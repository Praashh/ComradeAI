"use client";

import { useState, useCallback, startTransition } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/trpc/react";
import { toast } from "sonner";
import {
  CHARACTERS,
  DEFAULT_CHARACTER,
  type CharacterId,
} from "@/lib/characters";

const IMPORT_PROMPT = `I'm moving to a new AI companion called Comrade AI and I'd like to bring my memories with me. Can you go through everything we've talked about and create a structured summary of what you know about me?

Write it in markdown with ## section headers. Use these sections (skip any that don't apply):

## Who I Am
Name, age, location, background, identity — the basics.

## Work & Career
What I do, where I work, career history, professional goals, frustrations.

## Relationships & People
Family, friends, partner, important people in my life. Use real names where I've shared them.

## Daily Life & Routines
How I spend my days, habits, routines, struggles with productivity or health.

## Interests & Tastes
Music, books, movies, food, hobbies — anything I've mentioned enjoying or disliking.

## What's On My Mind
Current projects, things I'm working through, decisions I'm facing, recurring themes in our conversations.

## Values & Worldview
What matters to me, how I think about life, beliefs, things I care deeply about.

## Memorable Moments
Specific stories, turning points, or quotes from our conversations that felt significant.

Rules:
- Only include things I've actually told you — no assumptions or inferences.
- Use real names, dates, and specifics wherever I've shared them.
- Write in third person (e.g., "They work at..." or "He mentioned...").
- Keep it honest and detailed — this is for my own personal use.`;

type Step =
  | "choose-path"
  | "import"
  | "nickname"
  | "pronouns"
  | "dob"
  | "character"
  | "completing";

type Pronouns = "he/him" | "she/her" | "they/them";

/* ─── Import Step ─── */
function ImportStep({
  importText,
  setImportText,
  importing,
  importResult,
  onImport,
  onSkip,
}: {
  importText: string;
  setImportText: (v: string) => void;
  importing: boolean;
  importResult: { imported: number; total: number } | null;
  onImport: () => void;
  onSkip: () => void;
}) {
  return (
    <div className="flex flex-col">
      <h2 className="mb-2 font-instrument text-[2rem] leading-[1.1] text-white">
        Import your memories
      </h2>
      <p className="mb-6 font-satoshi text-[0.9rem] leading-relaxed text-white/60">
        Copy the prompt below, paste it in ChatGPT or Claude, then paste
        their response here.
      </p>

      <div className="mb-4 rounded-[20px] border border-white/10 bg-[#141414] p-4 text-white">
        <div className="mb-2 flex items-center justify-between">
          <span className="font-satoshi text-[0.72rem] uppercase tracking-[0.1em] text-white/40 font-medium">
            Prompt to copy
          </span>
          <button
            type="button"
            onClick={() => {
              void navigator.clipboard.writeText(IMPORT_PROMPT);
              toast.success("Prompt copied to clipboard");
            }}
            className="rounded-full border border-white/15 bg-white/5 px-3 py-1 font-satoshi text-[0.75rem] text-white/70 transition-all hover:border-white/30 hover:bg-white/10 hover:text-white"
          >
            Copy
          </button>
        </div>
        <p className="font-satoshi text-[0.82rem] leading-relaxed text-white/75">
          {IMPORT_PROMPT}
        </p>
      </div>

      <textarea
        aria-label="Paste imported memories here"
        value={importText}
        onChange={(e) => setImportText(e.target.value)}
        placeholder="Paste the response here..."
        rows={6}
        className="mb-4 w-full resize-none rounded-[20px] border border-white/10 bg-[#141414] px-4 py-3 font-satoshi text-[0.88rem] text-white placeholder:italic placeholder:text-white/30 focus:border-white/30 focus:outline-none"
      />

      {importResult && (
        <p className="mb-4 font-satoshi text-[0.82rem] text-white/70">
          Imported {importResult.imported} of {importResult.total} memory
          sections.
        </p>
      )}

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onImport}
          disabled={!importText.trim() || importing}
          className="flex-1 rounded-full bg-white px-6 py-3 font-satoshi text-[0.88rem] font-semibold text-black transition-all hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-40 shadow-lg"
        >
          {importing ? "Importing..." : "Import & Continue"}
        </button>
        <button
          type="button"
          onClick={onSkip}
          className="rounded-full border border-white/15 bg-white/5 px-6 py-3 font-satoshi text-[0.88rem] font-medium text-white/80 transition-all hover:border-white/30 hover:bg-white/10 hover:text-white"
        >
          Skip
        </button>
      </div>
    </div>
  );
}

/* ─── Character Selection Step ─── */
function CharacterStep({
  selectedCharacter,
  setSelectedCharacter,
  onComplete,
  isPending,
}: {
  selectedCharacter: CharacterId;
  setSelectedCharacter: (id: CharacterId) => void;
  onComplete: () => void;
  isPending: boolean;
}) {
  return (
    <div className="flex flex-col items-center">
      <h2 className="mb-2 text-center font-instrument text-[2rem] leading-[1.1] text-white">
        Choose your companion
      </h2>
      <p className="mb-8 text-center font-satoshi text-[0.9rem] text-white/60">
        You can always switch later.
      </p>

      <div className="mb-8 grid w-full grid-cols-2 gap-3">
        {CHARACTERS.map((c) => (
          <button
            type="button"
            key={c.id}
            onClick={() => setSelectedCharacter(c.id)}
            className={`flex flex-col items-start rounded-[24px] border p-4 text-left transition-all ${selectedCharacter === c.id
                ? "border-white bg-[#1a1a1a] shadow-xl text-white ring-1 ring-white/20"
                : "border-white/10 bg-white/5 hover:border-white/20 text-white"
              }`}
          >
            <div className="mb-2 flex items-center gap-2.5">
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-full border ${selectedCharacter === c.id
                    ? "border-white bg-white text-black font-semibold"
                    : "border-white/20 bg-white/10 text-white"
                  } font-satoshi text-[1.1rem] leading-none transition-colors`}
              >
                {c.name[0]}
              </div>
              <div>
                <span className="block font-satoshi text-[1.05rem] font-medium leading-none text-white">
                  {c.name}
                </span>
                <span className="block font-satoshi text-[0.7rem] italic text-white/50">
                  {c.title}
                </span>
              </div>
            </div>
            <p className="font-satoshi text-[0.78rem] leading-snug text-white/60">
              {c.description}
            </p>
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={onComplete}
        disabled={isPending}
        className="rounded-full bg-white px-8 py-3.5 font-satoshi text-[0.88rem] font-semibold text-black transition-all hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-60 shadow-lg"
      >
        {isPending ? "Setting up..." : "Start your journey"}
      </button>
    </div>
  );
}

/* ─── Main Onboarding Flow ─── */
export default function OnboardingFlow() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("choose-path");

  const [nickname, setNickname] = useState("");
  const [pronouns, setPronouns] = useState<Pronouns | "">("");
  const [dob, setDob] = useState("");
  const [selectedCharacter, setSelectedCharacter] =
    useState<CharacterId>(DEFAULT_CHARACTER);

  const nicknameRef = useCallback((node: HTMLInputElement | null) => {
    if (node) {
      node.focus();
    }
  }, []);

  const todayDate = new Date().toISOString().split("T")[0];

  const changeStep = useCallback((newStep: Step) => {
    startTransition(() => {
      setStep(newStep);
    });
  }, []);

  const [importText, setImportText] = useState("");
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<{
    imported: number;
    total: number;
  } | null>(null);

  const completeOnboarding = api.onboarding.completeOnboarding.useMutation({
    onSuccess: () => router.push("/write"),
    onError: () => changeStep("character"),
  });

  const importMemory = api.onboarding.importMemory.useMutation();

  const handleImport = useCallback(async () => {
    if (!importText.trim()) return;
    setImporting(true);
    try {
      const result = await importMemory.mutateAsync({
        content: importText.trim(),
      });
      setImportResult(result);
      setTimeout(() => changeStep("nickname"), 1500);
    } catch {
      setImporting(false);
    }
  }, [importText, importMemory, changeStep]);

  const handleComplete = useCallback(() => {
    if (!nickname.trim() || !pronouns || !dob) return;
    changeStep("completing");
    completeOnboarding.mutate({
      nickname: nickname.trim(),
      pronouns,
      dob,
      preferredSpeaker: selectedCharacter,
    });
  }, [nickname, pronouns, dob, selectedCharacter, completeOnboarding, changeStep]);

  const canGoNext = () => {
    switch (step) {
      case "nickname":
        return nickname.trim().length > 0;
      case "pronouns":
        return pronouns !== "";
      case "dob":
        return /^\d{4}-\d{2}-\d{2}$/.test(dob);
      case "character":
        return true;
      default:
        return false;
    }
  };

  const handleNext = () => {
    const flow: Step[] = ["nickname", "pronouns", "dob", "character"];
    const currentIndex = flow.indexOf(step);
    if (currentIndex < flow.length - 1) {
      changeStep(flow[currentIndex + 1]!);
    } else if (step === "character") {
      handleComplete();
    }
  };

  const handleBack = () => {
    const flow: Step[] = ["choose-path", "nickname", "pronouns", "dob", "character"];
    const currentIndex = flow.indexOf(step);
    if (step === "import") {
      changeStep("choose-path");
    } else if (currentIndex > 0) {
      changeStep(flow[currentIndex - 1]!);
    }
  };

  return (
    <div className="w-full max-w-[520px] rounded-[32px] border border-white/10 bg-[#0d0d0d] p-8 shadow-2xl shadow-black/80 backdrop-blur-xl">
      {/* Back button */}
      {step !== "choose-path" && step !== "completing" && (
        <button
          type="button"
          onClick={handleBack}
          className="mb-6 flex items-center gap-1.5 font-satoshi text-sm text-white/50 transition-colors hover:text-white"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 12H5" />
            <path d="m12 19-7-7 7-7" />
          </svg>
          Back
        </button>
      )}

      {/* Step: Choose Path */}
      {step === "choose-path" && (
        <div className="flex flex-col items-center text-center">
          <h1 className="mb-3 font-instrument text-[2.4rem] leading-[1.1] text-white">
            Welcome to <span className="italic">Comrade AI</span>.
          </h1>
          <p className="mb-8 font-satoshi text-[0.95rem] text-white/60">
            Let&apos;s get to know you a little.
          </p>

          <div className="flex w-full flex-col gap-4">
            <button
              type="button"
              onClick={() => changeStep("import")}
              className="w-full rounded-[24px] border border-white/10 bg-white/5 p-6 text-left transition-all hover:border-white/30 hover:bg-white/10"
            >
              <span className="mb-1 block font-satoshi font-medium text-[1.15rem] text-white">
                I have memories to bring
              </span>
              <span className="block font-satoshi text-[0.85rem] text-white/60">
                Import from ChatGPT, Claude, or any AI you&apos;ve been talking
                to
              </span>
            </button>

            <button
              type="button"
              onClick={() => changeStep("nickname")}
              className="w-full rounded-[24px] border border-white/10 bg-white/5 p-6 text-left transition-all hover:border-white/30 hover:bg-white/10"
            >
              <span className="mb-1 block font-satoshi font-medium text-[1.15rem] text-white">
                Start fresh
              </span>
              <span className="block font-satoshi text-[0.85rem] text-white/60">
                We&apos;ll learn about you as we go
              </span>
            </button>
          </div>
        </div>
      )}

      {/* Step: Import Memory */}
      {step === "import" && (
        <ImportStep
          importText={importText}
          setImportText={setImportText}
          importing={importing}
          importResult={importResult}
          onImport={handleImport}
          onSkip={() => changeStep("nickname")}
        />
      )}

      {/* Step: Nickname */}
      {step === "nickname" && (
        <div className="flex flex-col items-center text-center">
          <h2 className="mb-2 font-instrument text-[2rem] leading-[1.1] text-white">
            What should I call you?
          </h2>
          <p className="mb-8 font-satoshi text-[0.9rem] text-white/60">
            A name, nickname, whatever feels right.
          </p>
          <input
            ref={nicknameRef}
            aria-label="Your name or nickname"
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && canGoNext()) handleNext();
            }}
            placeholder="Your name"
            maxLength={50}
            className="mb-8 w-full max-w-[320px] border-b border-white/20 bg-transparent px-0 py-3 text-center font-instrument text-[1.8rem] text-white placeholder:text-white/30 focus:border-white focus:outline-none"
          />
          <button
            type="button"
            onClick={handleNext}
            disabled={!canGoNext()}
            className="rounded-full bg-white px-8 py-3 font-satoshi text-sm font-semibold text-black transition-all hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-40 shadow-lg"
          >
            Next
          </button>
        </div>
      )}

      {/* Step: Pronouns */}
      {step === "pronouns" && (
        <div className="flex flex-col items-center text-center">
          <h2 className="mb-2 font-instrument text-[2rem] leading-[1.1] text-white">
            How should I refer to you?
          </h2>
          <p className="mb-8 font-satoshi text-[0.9rem] text-white/60">
            Pick your pronouns.
          </p>
          <div className="mb-8 flex gap-3">
            {(["he/him", "she/her", "they/them"] as const).map((p) => (
              <button
                type="button"
                key={p}
                onClick={() => setPronouns(p)}
                className={`rounded-full border px-5 py-2.5 font-satoshi text-sm transition-all ${pronouns === p
                    ? "border-white bg-white text-black font-semibold shadow-md"
                    : "border-white/15 bg-white/5 text-white/70 hover:border-white/30 hover:text-white"
                  }`}
              >
                {p}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={handleNext}
            disabled={!canGoNext()}
            className="rounded-full bg-white px-8 py-3 font-satoshi text-sm font-semibold text-black transition-all hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-40 shadow-lg"
          >
            Next
          </button>
        </div>
      )}

      {/* Step: DOB */}
      {step === "dob" && (
        <div className="flex flex-col items-center text-center">
          <h2 className="mb-2 font-instrument text-[2rem] leading-[1.1] text-white">
            When&apos;s your birthday?
          </h2>
          <p className="mb-8 font-satoshi text-[0.9rem] text-white/60">
            So we can celebrate with you.
          </p>
          <input
            aria-label="Date of birth"
            type="date"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && canGoNext()) handleNext();
            }}
            max={todayDate}
            className="mb-8 w-full max-w-[280px] rounded-[16px] border border-white/15 bg-[#141414] px-4 py-3 font-satoshi text-sm text-white focus:border-white/40 focus:outline-none"
          />
          <button
            type="button"
            onClick={handleNext}
            disabled={!canGoNext()}
            className="rounded-full bg-white px-8 py-3 font-satoshi text-sm font-semibold text-black transition-all hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-40 shadow-lg"
          >
            Next
          </button>
        </div>
      )}

      {/* Step: Character Selection */}
      {step === "character" && (
        <CharacterStep
          selectedCharacter={selectedCharacter}
          setSelectedCharacter={setSelectedCharacter}
          onComplete={handleComplete}
          isPending={completeOnboarding.isPending}
        />
      )}

      {/* Step: Completing */}
      {step === "completing" && (
        <div className="flex flex-col items-center text-center py-6">
          <div className="mb-6 h-12 w-12 animate-spin rounded-full border-2 border-white/20 border-t-white" />
          <p className="font-satoshi text-[0.95rem] text-white/80">
            Setting things up for you...
          </p>
        </div>
      )}
    </div>
  );
}
