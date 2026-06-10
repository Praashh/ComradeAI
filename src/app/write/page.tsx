"use client";

import Link from "next/link";
import Masthead from "@/app/_components/Masthead";
import NewJournalDialog from "@/app/_components/NewJournalDialog";
import { useJournals } from "@/lib/journals-context";
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

function JournalList() {
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
              render={<Link href={`/write/${journal.id}`} />}
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

export default function WritePage() {
  return (
    <div className="chat-workspace flex flex-col h-screen overflow-hidden">
      <div className="shrink-0">
        <Masthead />
      </div>
      <SidebarProvider className="flex-1 min-h-0">
        <div className="flex flex-1 w-full relative overflow-hidden">
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
                  <JournalList />
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
            <SidebarFooter className="p-4 border-t border-[var(--rule-soft)]" />
          </Sidebar>

          <main className="flex-1 min-h-0 px-6 py-12 overflow-y-auto flex items-center justify-center">
            <p className="text-sm text-[var(--ink-3)] italic">Select a journal or create a new one.</p>
          </main>
        </div>
      </SidebarProvider>
    </div>
  );
}
