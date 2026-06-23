"use client";

import { useState, useRef, useCallback, useEffect, use } from "react";
import Link from "next/link";
import Masthead from "@/app/_components/Masthead";
import { MilkdownEditorClient } from "@/app/_components/MilkdownEditorClient";
import type { MilkdownEditorHandle } from "@/app/_components/MilkdownEditor";
import { api } from "@/trpc/react";
import * as Icons from "@phosphor-icons/react";
import { useJournals } from "@/lib/journals-context";
import NewJournalDialog from "@/app/_components/NewJournalDialog";
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

function getFormattedDate() {
  return new Date()
    .toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
    .toUpperCase();
}

function FocusToggler({ focusMode, onToggle }: { focusMode: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`flex items-center gap-1.5 text-xs transition-colors cursor-pointer ${focusMode ? "text-[var(--ink-2)] hover:text-[var(--ink)]" : "text-[var(--red)] hover:opacity-80"}`}
      title="Toggle Focus Mode"
    >
      <svg
        className="w-4.5 h-4.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 4.5v15m6-15v15m-12-3h18c.6 0 1-.4 1-1V5c0-.6-.4-1-1-1H3c-.6 0-1 .4-1 1v13c0 .6.4 1 1 1z"
        />
      </svg>
      <span className="text-[10px] tracking-wider uppercase font-medium">
        {focusMode ? "back to normal" : "focus mode"}
      </span>
    </button>
  );
}

function JournalList({ activeJournalId }: { activeJournalId: number }) {
  const { journals, isLoading } = useJournals();

  if (isLoading) {
    return (
      <SidebarMenu>
        {Array.from({ length: 3 }).map((_, i) => (
          <SidebarMenuItem key={i}>
            <SidebarMenuButton disabled>
              <span className="text-[var(--ink-3)] text-xs italic">Loading...</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    );
  }

  if (!journals.length) {
    return (
      <p className="text-xs text-[var(--ink-3)] italic px-2 py-1">No journals yet.</p>
    );
  }

  return (
    <SidebarMenu>
      {journals.map((journal) => {
        const IconComponent = journal.icon
          ? ((Icons[journal.icon as keyof typeof Icons] ?? Icons.BookOpen) as React.ElementType)
          : Icons.BookOpen;
        return (
          <SidebarMenuItem key={journal.id}>
            <SidebarMenuButton
              isActive={journal.id === activeJournalId}
              render={<Link href={`/write/${journal.id}`} target="_blank" />}
            >
              <IconComponent
                size={16}
                weight="duotone"
                style={{ color: journal.color ?? "var(--ink-2)" }}
              />
              <span>{journal.title ?? "Untitled"}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        );
      })}
    </SidebarMenu>
  );
}

function JournalEditor({ journalId }: { journalId: number }) {
  const [focusMode, setFocusMode] = useState(false);
  const [localTitle, setLocalTitle] = useState<string | null>(null);
  const editorRef = useRef<MilkdownEditorHandle>(null);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const titleDebounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { refetch: refetchJournals } = useJournals();
  const { data, isLoading } = api.journal.get.useQuery({ id: journalId });
  const saveJournal = api.journal.save.useMutation();

  const title = localTitle ?? data?.journal?.title ?? "";

  const debouncedSave = useCallback(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    debounceTimer.current = setTimeout(() => {
      const content = editorRef.current?.getMarkdown() ?? "";
      if (!content.trim()) return;
      saveJournal.mutate({ id: journalId, content });
    }, 500);
  }, [journalId, saveJournal]);

  const saveTitle = useCallback(
    (newTitle: string) => {
      if (titleDebounceTimer.current) {
        clearTimeout(titleDebounceTimer.current);
      }
      titleDebounceTimer.current = setTimeout(() => {
        const content = editorRef.current?.getMarkdown() ?? "";
        saveJournal.mutate(
          { id: journalId, title: newTitle, content },
          {
            onSuccess: () => {
              refetchJournals();
            },
          },
        );
      }, 500);
    },
    [journalId, saveJournal, refetchJournals],
  );

  useEffect(() => {
    const debounceRef = debounceTimer.current;
    const titleDebounceRef = titleDebounceTimer.current;
    return () => {
      if (debounceRef) {
        clearTimeout(debounceRef);
      }
      if (titleDebounceRef) {
        clearTimeout(titleDebounceRef);
      }
    };
  }, []);

  const toggleFocusMode = useCallback(() => {
    setFocusMode((prev) => !prev);
  }, []);


  if (isLoading) {
    return (
      <div className="chat-workspace flex flex-col h-screen overflow-hidden">
        <div className="shrink-0">
          <Masthead />
        </div>
        <div className="flex-1 flex items-center justify-center min-h-0">
          <span className="text-[var(--ink-2)] text-sm italic">
            Loading journal...
          </span>
        </div>
      </div>
    );
  }

  const defaultContent = data?.journal?.content ?? "";

  return (
    <div className="chat-workspace flex flex-col h-screen overflow-hidden">
      <div
        className={`shrink-0 transition-all duration-300 ease-in-out ${focusMode ? "max-h-0 opacity-0 overflow-hidden" : "max-h-[200px] opacity-100"}`}
      >
        <Masthead />
      </div>
      <SidebarProvider
        open={!focusMode}
        onOpenChange={(open) => setFocusMode(!open)}
        className="flex-1 min-h-0"
      >
        <div className="flex flex-1 w-full relative overflow-hidden">
          {/* Custom Lefthand Sidebar using ShadCN sidebar components */}
          <Sidebar side="left" collapsible="offcanvas">
            <SidebarHeader className="p-4 border-b border-[var(--rule-soft)]">
              <div className="flex items-center justify-between">
                <span className="font-serif italic text-lg text-[var(--ink)] tracking-wide">Journals</span>
              </div>
            </SidebarHeader>
            <SidebarContent className="p-2 gap-4">
              <SidebarGroup>
                <SidebarGroupLabel className="flex items-center justify-between">
                  Your Journals
                  <NewJournalDialog>
                    <button
                      type="button"
                      className="ml-auto p-0.5 rounded hover:bg-[var(--paper-3)] text-[var(--ink-3)] hover:text-[var(--ink)] transition-colors cursor-pointer"
                      title="New Journal"
                    >
                      <Icons.Plus size={16} weight="bold" />
                    </button>
                  </NewJournalDialog>
                </SidebarGroupLabel>
                <SidebarGroupContent>
                  <JournalList activeJournalId={journalId} />
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>

            <SidebarFooter className="p-4 border-t border-[var(--rule-soft)]">
            </SidebarFooter>
          </Sidebar>

          {/* Main Writing Pad Editor Canvas */}
          <main className="flex-1 min-h-0 px-6 py-12 overflow-y-auto">
            <div className="mx-auto max-w-2xl relative">

              {/* Header inside writing space displaying Date & Sidebar Toggle focus controls */}
              <div className="flex items-center justify-between border-b border-[var(--rule-soft)] pb-3 mb-4">
                <span className="text-xs uppercase tracking-widest text-[var(--ink-2)] font-mono">
                  {getFormattedDate()}
                </span>
                <FocusToggler focusMode={focusMode} onToggle={toggleFocusMode} />
              </div>

              {/* Journal Title, Icon and Mood Header */}
              {data?.journal && (
                <div className="mb-6 flex items-center gap-4 animate-fade-in">
                  {data.journal.icon && (
                    <div
                      className="w-14 h-14 rounded-full flex items-center justify-center text-white shadow-sm shrink-0"
                      style={{
                        background: data.journal.color ?? "var(--red)",
                      }}
                    >
                      {(() => {
                        const IconComponent = (Icons[data.journal.icon as keyof typeof Icons] ?? Icons.BookOpen) as React.ElementType;
                        return <IconComponent size={28} weight="duotone" />;
                      })()}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => {
                        setLocalTitle(e.target.value);
                        saveTitle(e.target.value);
                      }}
                      placeholder="Untitled Journal"
                      aria-label="Journal title"
                      className="w-full bg-transparent font-disp text-3xl text-[var(--ink)] tracking-tight leading-tight outline-none border-none placeholder:text-[var(--ink-3)]"
                    />
                    {data.journal.mood && (
                      <p className="text-[10px] text-[var(--ink-3)] tracking-widest font-mono uppercase mt-0.5">
                        Feeling: <span className="text-[var(--ink-2)] font-semibold">{data.journal.mood}</span>
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Crepe Editor */}
              <MilkdownEditorClient
                ref={editorRef}
                onChange={debouncedSave}
                defaultValue={defaultContent}
              />
            </div>
          </main>
        </div>
      </SidebarProvider>
    </div>
  );
}

export default function WriteJournalPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const journalId = Number(id);

  return <JournalEditor journalId={journalId} />;
}
