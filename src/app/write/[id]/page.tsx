"use client";

import { useState, useRef, useCallback, useEffect, use } from "react";
import Masthead from "@/app/_components/Masthead";
import { MilkdownEditorClient } from "@/app/_components/MilkdownEditorClient";
import type { MilkdownEditorHandle } from "@/app/_components/MilkdownEditor";
import { api } from "@/trpc/react";
import * as Icons from "@phosphor-icons/react";
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

function JournalEditor({ journalId }: { journalId: number }) {
  const [decorTab, setDecorTab] = useState<"page" | "plain">("plain");
  const [photoTab, setPhotoTab] = useState<"chat" | "uploads">("chat");
  const [focusMode, setFocusMode] = useState(false);
  const editorRef = useRef<MilkdownEditorHandle>(null);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { data, isLoading } = api.journal.get.useQuery({ id: journalId });
  const saveMemory = api.memory.saveMemory.useMutation();
  const saveJournal = api.journal.save.useMutation();

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

  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, []);

  const toggleFocusMode = useCallback(() => {
    setFocusMode((prev) => !prev);
  }, []);

  function handleApplyChanges() {
    const journalText = editorRef.current?.getMarkdown() ?? "";
    if (!journalText.trim()) return;
    saveMemory.mutate({ journalText });
  }

  if (isLoading) {
    return (
      <div className="chat-workspace">
        <Masthead />
        <div className="flex-1 flex items-center justify-center min-h-screen">
          <span className="text-[var(--ink-2)] text-sm italic">Loading journal...</span>
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
      <SidebarProvider open={!focusMode} onOpenChange={(open) => setFocusMode(!open)} className="flex-1 min-h-0">
        <div className="flex flex-1 w-full relative overflow-hidden">
          {/* Custom Lefthand Sidebar using ShadCN sidebar components */}
          <Sidebar side="left" collapsible="offcanvas">
            <SidebarHeader className="p-4 border-b border-[var(--rule-soft)]">
              <div className="flex items-center justify-between">
                <span className="font-serif italic text-lg text-[var(--ink)] tracking-wide">Decorations</span>
              </div>
            </SidebarHeader>
            <SidebarContent className="p-2 gap-4">

              
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
                    <h1 className="font-disp text-3xl text-[var(--ink)] tracking-tight leading-tight">
                      {data.journal.title ?? "Untitled Journal"}
                    </h1>
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
