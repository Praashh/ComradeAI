"use client";

import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { api } from "@/trpc/react";
import { useJournals } from "@/lib/journals-context";
import NewJournalDialog from "@/app/_components/NewJournalDialog";
import { MilkdownEditorClient } from "@/app/_components/MilkdownEditorClient";
import type { MilkdownEditorHandle } from "@/app/_components/MilkdownEditor";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/app/_components/AppSidebar";

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

// Helpers for mood/insights
function getEmotionalPulse(mood: string | null) {
  const normalizedMood = (mood ?? "").toLowerCase().trim();
  if (normalizedMood.includes("reflective")) {
    return { clarity: 75, stability: 90, anxiety: 15 };
  }
  if (normalizedMood.includes("tired")) {
    return { clarity: 40, stability: 50, anxiety: 35 };
  }
  if (normalizedMood.includes("happy") || normalizedMood.includes("inspired")) {
    return { clarity: 90, stability: 80, anxiety: 10 };
  }
  if (normalizedMood.includes("anxious")) {
    return { clarity: 30, stability: 45, anxiety: 70 };
  }
  if (normalizedMood.includes("excited")) {
    return { clarity: 70, stability: 60, anxiety: 30 };
  }
  return { clarity: 60, stability: 70, anxiety: 20 };
}

function getVisualMoodDetails(mood: string | null) {
  const normalizedMood = (mood ?? "").toLowerCase().trim();
  if (normalizedMood.includes("reflective") || normalizedMood.includes("thoughtful")) {
    return {
      title: "Ethereal Order",
      tagline: "Atmosphere",
      image: "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&w=600&q=80"
    };
  }
  if (normalizedMood.includes("tired") || normalizedMood.includes("sleep")) {
    return {
      title: "Quiet Sanctuary",
      tagline: "Atmosphere",
      image: "https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=600&q=80"
    };
  }
  if (normalizedMood.includes("happy") || normalizedMood.includes("inspired") || normalizedMood.includes("excited")) {
    return {
      title: "Creative Spark",
      tagline: "Atmosphere",
      image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=600&q=80"
    };
  }
  if (normalizedMood.includes("anxious") || normalizedMood.includes("stressed")) {
    return {
      title: "Calm Refuge",
      tagline: "Atmosphere",
      image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=600&q=80"
    };
  }
  return {
    title: "Silent Balance",
    tagline: "Atmosphere",
    image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=600&q=80"
  };
}

function getDeepDivePrompt(content: string, summary: string | null) {
  if (summary && summary.trim().length > 15) {
    return `"${summary.trim()}" -- How does this reflection sit with you today?`;
  }

  const text = content.toLowerCase();
  if (text.includes("career") || text.includes("job") || text.includes("work") || text.includes("studio") || text.includes("protect")) {
    return `"You mentioned 'protective words.' What are you protecting yourself from in this new studio role?"`;
  }
  if (text.includes("fog") || text.includes("autumn") || text.includes("season") || text.includes("transition")) {
    return `"There's a specific kind of quiet that comes with the autumn fog. How does this transition between seasons mirror your current journey?"`;
  }
  if (text.includes("sarah") || text.includes("relationship") || text.includes("friend")) {
    return `"You mentioned talking with Sarah. How do you feel this conversation shifted your view on generative art or therapy?"`;
  }

  return `"What is the core emotion behind this entry, and what is one small thing you can do to honor it today?"`;
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
    <section className={`w-full tablet:w-[320px] lg:w-[384px] shrink-0 border-r border-black/5 flex flex-col overflow-hidden transition-all duration-300 ${activeJournalId || focusMode ? "hidden" : "flex"}`}>
      <div className="p-md bg-surface/30">
        <h2 className="font-headline-lg text-headline-lg mb-sm">Archive</h2>
        <div className="relative">
          <span className="material-symbols-outlined absolute left-[12px] top-1/2 -translate-y-1/2 text-secondary text-sm">
            search
          </span>
          <input
            className="w-full bg-surface-container-high/50 border-none rounded-full py-[8px] pl-[40px] pr-[16px] text-body-md focus:ring-1 focus:ring-primary focus:outline-none"
            placeholder="Search entries..."
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search entries"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-sm pb-[40px] space-y-[8px]">
        {journalsLoading ? (
          <div className="p-[16px] text-center text-sm text-secondary italic">Loading archive...</div>
        ) : filteredJournals.length === 0 ? (
          <div className="p-[16px] text-center text-sm text-secondary italic">No entries found.</div>
        ) : (
          filteredJournals.map((entry) => {
            const isActive = entry.id === activeJournalId;
            const moodBadge = entry.mood ?? "Neutral";
            const badgeColorClass =
              moodBadge.toLowerCase() === "reflective" ? "bg-primary/10 text-primary" :
                moodBadge.toLowerCase() === "tired" ? "bg-secondary-container text-on-secondary-container" :
                  moodBadge.toLowerCase() === "inspired" ? "bg-primary/10 text-primary" :
                    moodBadge.toLowerCase() === "happy" ? "bg-primary/10 text-primary" :
                      moodBadge.toLowerCase() === "anxious" ? "bg-error/10 text-error" :
                        "bg-surface-container-highest/60 text-secondary";

            return (
              <button
                type="button"
                key={entry.id}
                onClick={() => onSelectEntry(entry.id)}
                className={`w-full text-left p-md rounded-2xl transition-all cursor-pointer border ${isActive
                  ? "bg-surface-container-lowest border-black/5 card-shadow"
                  : "bg-surface hover:bg-surface-container border-transparent"
                  }`}
              >
                <div className="flex justify-between items-start mb-[8px]">
                  <span className="text-label-md text-secondary">
                    {formatCardDate(entry.createdAt)}
                  </span>
                  <span className={`px-[8px] py-[2px] rounded-full text-[10px] font-bold uppercase tracking-wider ${badgeColorClass}`}>
                    {moodBadge}
                  </span>
                </div>
                <h3 className={`font-title-md text-title-md mb-[4px] transition-colors ${isActive ? "text-primary font-semibold" : ""}`}>
                  {entry.title ?? "Untitled Entry"}
                </h3>
                <p className="text-body-md text-secondary line-clamp-2">
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
function InsightsPanel({
  activeJournalId,
  journal,
  pulseMetrics,
  visualDetails,
  deepDivePrompt,
  focusMode,
}: {
  activeJournalId?: number;
  journal: { mood: string | null; content: string | null; summary: string | null } | undefined;
  pulseMetrics: { clarity: number; stability: number; anxiety: number };
  visualDetails: { title: string; tagline: string; image: string };
  deepDivePrompt: string;
  focusMode: boolean;
}) {
  return (
    <section className={`w-full lg:w-[320px] xl:w-[384px] shrink-0 glass-panel bg-white/40 p-md flex-col gap-md overflow-y-auto transition-all duration-300 ${focusMode ? "hidden" : "hidden lg:flex"}`}>
      <div className="flex items-center gap-base mb-[8px]">
        <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
          auto_awesome
        </span>
        <h2 className="font-headline-lg text-headline-lg">Comrade Insights</h2>
      </div>

      {activeJournalId && journal ? (
        <>
          {/* Emotional Pulse Card */}
          <div className="bg-surface-container-highest/30 backdrop-blur-md rounded-2xl p-md border border-white/40 shadow-sm">
            <div className="flex justify-between items-center mb-md">
              <h3 className="font-title-md text-title-md">Emotional Pulse</h3>
              <span className="material-symbols-outlined text-secondary text-sm cursor-help" title="Insights gathered from your entry content and mood tag">
                info
              </span>
            </div>
            <div className="space-y-[16px]">
              <div className="flex justify-between items-center">
                <span className="text-body-md text-secondary">Clarity</span>
                <div className="w-[128px] h-[6px] bg-surface-container rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-500"
                    style={{ width: `${pulseMetrics.clarity}%` }}
                  ></div>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-body-md text-secondary">Stability</span>
                <div className="w-[128px] h-[6px] bg-surface-container rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-500"
                    style={{ width: `${pulseMetrics.stability}%` }}
                  ></div>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-body-md text-secondary">Anxiety</span>
                <div className="w-[128px] h-[6px] bg-surface-container rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary-container rounded-full transition-all duration-500"
                    style={{ width: `${pulseMetrics.anxiety}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* AI Prompt / Deep Dive Card */}
          <div className="bg-primary/5 rounded-2xl p-md border border-primary/10">
            <div className="flex items-start gap-[12px]">
              <div className="bg-primary p-[8px] rounded-xl text-on-primary shrink-0">
                <span className="material-symbols-outlined text-base">psychology</span>
              </div>
              <div>
                <h3 className="font-title-md text-primary mb-[4px]">Deep Dive</h3>
                <p className="text-body-md text-on-surface-variant italic">
                  {deepDivePrompt}
                </p>
                <Link href="/chat">
                  <button type="button" className="mt-md text-label-md text-primary font-bold flex items-center gap-[4px] hover:underline cursor-pointer">
                    Answer Comrade
                    <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                  </button>
                </Link>
              </div>
            </div>
          </div>

          {/* Visual Mood Card */}
          <div className="flex-1 min-h-[160px] rounded-2xl overflow-hidden relative group">
            <Image
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              alt="Visual mood representation"
              src={visualDetails.image}
              fill
              sizes="384px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-md">
              <p className="text-white font-label-md uppercase tracking-widest opacity-80 mb-1">
                {visualDetails.tagline}
              </p>
              <h4 className="text-white font-display-md text-lg">
                {visualDetails.title}
              </h4>
            </div>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center flex-grow p-[16px] text-center border border-dashed border-black/10 rounded-2xl text-secondary">
          <span className="material-symbols-outlined text-3xl mb-sm opacity-40">
            wb_sunny
          </span>
          <p className="text-sm italic">
            Select a journal entry from the archive to load your emotional insights and deep dives here.
          </p>
        </div>
      )}
    </section>
  );
}

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

  const currentMood = journal?.mood ?? null;
  const pulseMetrics = getEmotionalPulse(currentMood);
  const visualDetails = getVisualMoodDetails(currentMood);
  const deepDivePrompt = getDeepDivePrompt(journal?.content ?? "", journal?.summary ?? null);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.body.classList.add("layout-locked");
    document.documentElement.classList.add("layout-locked");
    return () => {
      document.body.classList.remove("layout-locked");
      document.documentElement.classList.remove("layout-locked");
    };
  }, []);

  return (
    <SidebarProvider className="landing-theme layout-locked h-dvh overflow-hidden bg-background text-on-background">
      <AppSidebar />
      <SidebarInset className="!h-dvh !max-h-dvh flex flex-col overflow-hidden">
        {/* Top Shell Navigation */}
        <header className="w-full shrink-0 z-50 bg-surface/70 backdrop-blur-xl border-b border-black/5 flex justify-between items-center px-md py-sm shadow-sm">
          <div className="flex items-center gap-2">
            <SidebarTrigger />
            <Link href="/" className="font-display-md text-display-md font-semibold text-primary tablet:hidden">
              Comrade AI
            </Link>
          </div>
          <div className="flex items-center gap-md">
            <div className="hidden tablet:flex gap-md items-center">
              <Link href="/write" className="text-primary border-b-2 border-primary font-body-md">
                Journal
              </Link>
              <Link href="/chat" className="text-secondary hover:text-primary transition-colors font-body-md">
                Chat
              </Link>
              <Link href="/talk" className="text-secondary hover:text-primary transition-colors font-body-md">
                Voice
              </Link>
            </div>
            <div className="flex items-center gap-sm">
              <div className="flex items-center">
                <UserButton
                  appearance={{
                    elements: {
                      userButtonAvatarBox: "w-[32px] h-[32px] border border-black/5",
                    },
                  }}
                />
              </div>
            </div>
          </div>
        </header>

        {/* Main Workspace Frame */}
        <div className="flex flex-1 min-h-0 overflow-hidden bg-background">
          <main className="flex-1 flex flex-col tablet:flex-row overflow-hidden bg-background">
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
                <section className="flex-grow flex items-center justify-center bg-surface-container-lowest/50">
                  <span className="text-secondary text-sm italic">Loading writing canvas...</span>
                </section>
              ) : (
                <section className="flex-1 min-w-0 flex flex-col items-center bg-surface-container-lowest/50 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-[256px] h-[256px] bg-primary/5 rounded-full blur-3xl -mr-[128px] -mt-[128px] pointer-events-none"></div>

                  {/* Toolbar */}
                  <div className="p-md flex justify-between items-center z-10 border-b border-black/5 w-full max-w-3xl">
                    <div className="flex gap-sm items-center">
                      <button
                        type="button"
                        onClick={() => {
                          if (focusMode) setFocusMode(false);
                          else router.push("/write");
                        }}
                        className="material-symbols-outlined p-[8px] hover:bg-surface-container rounded-full text-secondary transition-colors cursor-pointer"
                        title="Back to Archive"
                      >
                        arrow_back
                      </button>
                    </div>
                    <div className="flex items-center gap-sm">
                      {saveStatus !== "idle" && (
                        <span className="text-label-md text-secondary flex items-center gap-[4px]">
                          {saveStatus === "saving" ? (
                            <>
                              <span className="material-symbols-outlined animate-spin text-sm">sync</span>
                              Saving...
                            </>
                          ) : (
                            <>
                              <span className="material-symbols-outlined text-sm text-primary">check_circle</span>
                              Saved
                            </>
                          )}
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => setFocusMode(!focusMode)}
                        className={`material-symbols-outlined p-[8px] rounded-full transition-colors cursor-pointer ${
                          focusMode
                            ? "bg-primary/10 text-primary"
                            : "hover:bg-surface-container text-secondary"
                        }`}
                        title={focusMode ? "Exit Focus Mode" : "Focus Mode"}
                      >
                        {focusMode ? "close_fullscreen" : "open_in_full"}
                      </button>
                    </div>
                  </div>

                  {/* Canvas Area */}
                  <div className="flex-1 overflow-y-auto px-md tablet:px-xl py-lg w-full max-w-3xl z-10">
                    <div className="mb-md">
                      <span className="text-xs uppercase tracking-widest text-secondary font-mono">
                        {getFormattedDate(journal?.createdAt)}
                      </span>
                    </div>

                    <input
                      className="w-full bg-transparent border-none font-display-md text-display-md placeholder:text-outline/40 mb-lg focus:ring-0 focus:outline-none text-on-surface"
                      placeholder="Entry Title"
                      type="text"
                      value={title}
                      onChange={(e) => {
                        setLocalTitle(e.target.value);
                        autoSave();
                      }}
                      aria-label="Entry title"
                    />

                    <div className="writing-area mt-[16px] min-h-[500px]">
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
              <section className="flex-1 min-w-0 flex flex-col items-center justify-center bg-surface-container-lowest/50 p-lg text-center relative">
                <div className="absolute top-0 right-0 w-[256px] h-[256px] bg-primary/5 rounded-full blur-3xl -mr-[128px] -mt-[128px] pointer-events-none"></div>
                <div className="max-w-md z-10">
                  <span className="material-symbols-outlined text-[64px] text-primary/40 mb-md">
                    edit_note
                  </span>
                  <h3 className="font-display-md text-display-md text-on-background mb-sm">
                    Start Your Reflection
                  </h3>
                  <p className="font-body-lg text-secondary mb-lg">
                    Select an entry from the archive column or click &quot;New Entry&quot; in the sidebar to start your thoughts.
                  </p>
                  <NewJournalDialog>
                    <button type="button" className="bg-primary text-on-primary font-semibold px-[24px] py-[12px] rounded-full hover:shadow-lg hover:shadow-primary/20 transition-all active:scale-95 cursor-pointer">
                      Create First Entry
                    </button>
                  </NewJournalDialog>
                </div>
              </section>
            )}

            <InsightsPanel
              activeJournalId={activeJournalId}
              journal={journal}
              pulseMetrics={pulseMetrics}
              visualDetails={visualDetails}
              deepDivePrompt={deepDivePrompt}
              focusMode={focusMode}
            />
          </main>
        </div>
      </SidebarInset>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="tablet:hidden fixed bottom-0 left-0 right-0 bg-surface/80 backdrop-blur-xl border-t border-black/5 px-[24px] py-[12px] flex justify-around items-center z-50">
        <button type="button" onClick={() => router.push("/write")} className="flex flex-col items-center gap-[4px] text-primary cursor-pointer">
          <span className="material-symbols-outlined">book_5</span>
          <span className="text-[10px] font-bold">Journal</span>
        </button>
        <button type="button" onClick={() => router.push("/chat")} className="flex flex-col items-center gap-[4px] text-secondary cursor-pointer">
          <span className="material-symbols-outlined">chat_bubble</span>
          <span className="text-[10px] font-bold">Chat</span>
        </button>
        <button type="button" onClick={() => router.push("/talk")} className="flex flex-col items-center gap-[4px] text-secondary cursor-pointer">
          <span className="material-symbols-outlined">mic</span>
          <span className="text-[10px] font-bold">Voice</span>
        </button>
        <button type="button" onClick={() => router.push("/onboarding")} className="flex flex-col items-center gap-[4px] text-secondary cursor-pointer">
          <span className="material-symbols-outlined">account_circle</span>
          <span className="text-[10px] font-bold">Profile</span>
        </button>
      </nav>

      {/* Mobile Floating Action Button */}
      <NewJournalDialog>
        <button type="button" className="tablet:hidden fixed right-[24px] bottom-[80px] w-[56px] h-[56px] bg-primary text-on-primary rounded-full shadow-lg shadow-primary/30 flex items-center justify-center z-50 cursor-pointer hover:scale-105 active:scale-95 transition-transform">
          <span className="material-symbols-outlined text-2xl">add</span>
        </button>
      </NewJournalDialog>
    </SidebarProvider>
  );
}
