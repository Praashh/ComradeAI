"use client";

import { useState, useRef, useCallback, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { api } from "@/trpc/react";
import { useJournals } from "@/lib/journals-context";
import NewJournalDialog from "@/app/_components/NewJournalDialog";
import { MilkdownEditorClient } from "@/app/_components/MilkdownEditorClient";
import type { MilkdownEditorHandle } from "@/app/_components/MilkdownEditor";
import { AppShell } from "@/app/_components/AppShell";
import { useLayoutLock } from "@/hooks/use-layout-lock";

// Helper to format date
function getFormattedDate(dateObj?: Date | null) {
  const d = dateObj ? new Date(dateObj) : new Date();
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).toUpperCase();
}

// Format card date
function formatCardDate(dateObj?: Date | null) {
  if (!dateObj) return "Today, 9:41 AM";
  const d = new Date(dateObj);
  const today = new Date();

  const isToday = d.toDateString() === today.toDateString();
  const timeStr = d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });

  if (isToday) {
    return `Today, ${timeStr}`;
  }

  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
}



/* ─── Archive Column ─── */
interface JournalEntry {
  id: number;
  title: string | null;
  content: string | null;
  mood: string | null;
  createdAt: Date | null;
}

function ArchiveColumn({
  filteredJournals,
  journalsLoading,
  activeJournalId,
  searchQuery,
  setSearchQuery,
  focusMode,
  onSelectEntry,
}: {
  filteredJournals: JournalEntry[];
  journalsLoading: boolean;
  activeJournalId?: number;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  focusMode: boolean;
  onSelectEntry: (id: number) => void;
}) {
  return (
    <section className={`w-full tablet:w-[320px] lg:w-[384px] shrink-0 border-r border-white/10 flex flex-col overflow-hidden transition-all duration-300 bg-[#0a0a0a] ${focusMode ? "hidden" : activeJournalId ? "hidden tablet:flex" : "flex flex-1 tablet:flex-initial"
      }`}>
      <div className="p-4 bg-white/5 border-b border-white/10">
        <h2 className="font-instrument text-xl font-normal text-white mb-3">Archive</h2>
        <div className="relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-white/50 text-base">
            search
          </span>
          <input
            className="w-full bg-white/5 border border-white/10 rounded-full py-2 pl-9 pr-4 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-white/30"
            placeholder="Search entries..."
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search entries"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 pb-28 space-y-2">
        {journalsLoading ? (
          <div className="p-4 text-center text-sm text-white/40 italic">Loading archive...</div>
        ) : filteredJournals.length === 0 ? (
          <div className="p-4 text-center text-sm text-white/40 italic">No entries found.</div>
        ) : (
          filteredJournals.map((entry) => {
            const isActive = entry.id === activeJournalId;
            const moodBadge = entry.mood ?? "Neutral";

            return (
              <button
                type="button"
                key={entry.id}
                onClick={() => onSelectEntry(entry.id)}
                className={`w-full text-left p-3.5 rounded-[18px] transition-all cursor-pointer border ${isActive
                  ? "bg-white/15 border-white/20 shadow-lg text-white"
                  : "bg-white/5 hover:bg-white/10 border-white/10 text-white/80"
                  }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs text-white/50 font-satoshi">
                    {formatCardDate(entry.createdAt)}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-white/10 text-white/80 border border-white/10">
                    {moodBadge}
                  </span>
                </div>
                <h3 className={`font-satoshi text-base mb-1 truncate transition-colors ${isActive ? "text-white font-medium" : "text-white/90"}`}>
                  {entry.title ?? "Untitled Entry"}
                </h3>
                <p className="font-satoshi text-xs text-white/50 line-clamp-2 leading-relaxed">
                  {entry.content ?? "Empty entry thoughts..."}
                </p>
              </button>
            );
          })
        )}
      </div>
    </section>
  );
}

/* ─── Insights Panel ─── */


/* ─── Main Dashboard ─── */
interface JournalDashboardProps {
  activeJournalId?: number;
}

export default function JournalDashboard({ activeJournalId }: JournalDashboardProps) {
  const router = useRouter();
  const { journals, isLoading: journalsLoading, refetch: refetchJournals } = useJournals();

  const [searchQuery, setSearchQuery] = useState("");
  const [focusMode, setFocusMode] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle");

  const editorRef = useRef<MilkdownEditorHandle>(null);
  const [localTitle, setLocalTitle] = useState<string | null>(null);
  const [prevActiveJournalId, setPrevActiveJournalId] = useState(activeJournalId);
  if (activeJournalId !== prevActiveJournalId) {
    setPrevActiveJournalId(activeJournalId);
    setLocalTitle(null);
  }

  const { data: activeData, isLoading: activeLoading } = api.journal.get.useQuery(
    { id: activeJournalId! },
    { enabled: !!activeJournalId }
  );

  // Guard: if the journal ID was provided but the journal doesn't exist, redirect back
  useEffect(() => {
    if (activeJournalId && !activeLoading && !activeData) {
      toast.error("Journal not found");
      router.replace("/write");
    }
  }, [activeJournalId, activeLoading, activeData, router]);

  const saveJournal = api.journal.save.useMutation();

  const journal = activeData?.journal;
  const title = localTitle ?? journal?.title ?? "";

  // Debounced auto-save
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const autoSave = useCallback(() => {
    if (!activeJournalId) return;
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    setSaveStatus("saving");
    debounceTimer.current = setTimeout(() => {
      const content = editorRef.current?.getMarkdown() ?? "";
      saveJournal.mutate(
        {
          id: activeJournalId,
          title: localTitle ?? undefined,
          content
        },
        {
          onSuccess: () => {
            refetchJournals();
            setSaveStatus("saved");
            setTimeout(() => setSaveStatus("idle"), 2000);
          },
          onError: () => {
            setSaveStatus("idle");
          }
        }
      );
    }, 1500);
  }, [activeJournalId, saveJournal, localTitle, refetchJournals]);

  useEffect(() => {
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, []);

  const filteredJournals = useMemo(() => {
    const sorted = [...journals].sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    });

    if (!searchQuery.trim()) return sorted;
    const q = searchQuery.toLowerCase();
    return sorted.filter(
      (j) =>
        (j.title ?? "Untitled").toLowerCase().includes(q) ||
        (j.content ?? "").toLowerCase().includes(q)
    );
  }, [journals, searchQuery]);



  useLayoutLock();

  return (
    <AppShell focusMode={focusMode}>
      {/* Main Workspace Frame */}
      <div className="flex flex-1 min-h-0 overflow-hidden bg-[#0a0a0a]">
        <main className="flex-1 flex flex-col tablet:flex-row overflow-hidden bg-[#0a0a0a]">
          <ArchiveColumn
            filteredJournals={filteredJournals}
            journalsLoading={journalsLoading}
            activeJournalId={activeJournalId}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            focusMode={focusMode}
            onSelectEntry={(id) => router.push(`/write/${id}`)}
          />

          {/* Active entry editor workspace */}
          {activeJournalId ? (
            activeLoading ? (
              <section className="flex-grow flex items-center justify-center bg-[#0d0d0d]">
                <span className="text-white/40 text-sm italic font-satoshi">Loading writing canvas...</span>
              </section>
            ) : (
              <section className="flex-1 min-w-0 flex flex-col items-center bg-[#0d0d0d] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-white/5 rounded-full blur-3xl pointer-events-none" />

                {/* Toolbar */}
                <div className="p-4 flex justify-between items-center z-10 border-b border-white/10 w-full max-w-3xl">
                  <div className="flex gap-2 items-center">
                    <button
                      type="button"
                      onClick={() => {
                        if (focusMode) setFocusMode(false);
                        else router.push("/write");
                      }}
                      className="material-symbols-outlined p-2 hover:bg-white/10 rounded-full text-white/70 hover:text-white transition-colors cursor-pointer"
                      title="Back to Archive"
                    >
                      arrow_back
                    </button>
                  </div>
                  <div className="flex items-center gap-3">
                    {saveStatus !== "idle" && (
                      <span className="text-xs font-satoshi text-white/60 flex items-center gap-1">
                        {saveStatus === "saving" ? (
                          <>
                            <span className="material-symbols-outlined animate-spin text-sm">sync</span>
                            Saving...
                          </>
                        ) : (
                          <>
                            <span className="material-symbols-outlined text-sm text-white">check_circle</span>
                            Saved
                          </>
                        )}
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => setFocusMode(!focusMode)}
                      className={`material-symbols-outlined p-2 rounded-full transition-colors cursor-pointer ${focusMode
                        ? "bg-white text-black"
                        : "hover:bg-white/10 text-white/70 hover:text-white"
                        }`}
                      title={focusMode ? "Exit Focus Mode" : "Focus Mode"}
                    >
                      {focusMode ? "close_fullscreen" : "open_in_full"}
                    </button>
                  </div>
                </div>

                {/* Canvas Area */}
                <div className="flex-1 overflow-y-auto px-4 tablet:px-8 py-6 pb-28 w-full max-w-3xl z-10">
                  <div className="mb-4">
                    <span className="text-xs uppercase tracking-widest text-white/40 font-mono">
                      {getFormattedDate(journal?.createdAt)}
                    </span>
                  </div>

                  <input
                    className="w-full bg-transparent border-none font-instrument text-3xl sm:text-4xl text-white placeholder:text-white/30 mb-6 focus:ring-0 focus:outline-none"
                    placeholder="Entry Title"
                    type="text"
                    value={title}
                    onChange={(e) => {
                      setLocalTitle(e.target.value);
                      autoSave();
                    }}
                    aria-label="Entry title"
                  />

                  <div className="writing-area mt-4 min-h-[500px] text-white">
                    <MilkdownEditorClient
                      ref={editorRef}
                      defaultValue={journal?.content ?? ""}
                      onChange={autoSave}
                    />
                  </div>
                </div>
              </section>
            )
          ) : (
            <section className="hidden tablet:flex flex-1 min-w-0 flex-col items-center justify-center bg-[#0d0d0d] p-8 text-center relative">
              <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-white/5 rounded-full blur-3xl pointer-events-none" />
              <div className="max-w-md z-10">
                <span className="material-symbols-outlined text-[56px] text-white/30 mb-4">
                  edit_note
                </span>
                <h3 className="font-instrument text-[32px] font-normal text-white mb-2">
                  Start Your Reflection
                </h3>
                <p className="font-satoshi text-sm text-white/60 mb-6 leading-relaxed">
                  Select an entry from the archive column or click &quot;New Entry&quot; in the sidebar to start your thoughts.
                </p>
                <NewJournalDialog>
                  <button type="button" className="font-satoshi bg-white text-black font-semibold px-6 py-2.5 rounded-full hover:bg-white/90 transition-all active:scale-95 cursor-pointer shadow-lg">
                    Create a journal
                  </button>
                </NewJournalDialog>
              </div>
            </section>
          )}
        </main>
      </div>

      {/* Mobile Floating Action Button */}
      <NewJournalDialog>
        <button type="button" className="tablet:hidden fixed right-6 bottom-20 w-14 h-14 bg-white text-black rounded-full shadow-xl flex items-center justify-center z-50 cursor-pointer hover:scale-105 active:scale-95 transition-transform">
          <span className="material-symbols-outlined text-2xl">add</span>
        </button>
      </NewJournalDialog>
    </AppShell>
  );
}
