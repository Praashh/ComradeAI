"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/trpc/react";
import { toast } from "sonner";
import {
  CHARACTERS,
  DEFAULT_CHARACTER,
  type CharacterId,
} from "@/lib/characters";

const IMPORT_PROMPT = `I'm moving to a new AI companion called Mira and I'd like to bring my memories with me. Can you go through everything we've talked about and create a structured summary of what you know about me?

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

export default function OnboardingFlow() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("choose-path");

  // Form state
  const [nickname, setNickname] = useState("");
  const [pronouns, setPronouns] = useState<Pronouns | "">("");
  const [dob, setDob] = useState("");
  const [selectedCharacter, setSelectedCharacter] =
    useState<CharacterId>(DEFAULT_CHARACTER);

  // Focus ref for nickname input (replaces autoFocus to avoid lint warning)
  const nicknameRef = useRef<HTMLInputElement>(null);

  // Hydration-safe today's date for the date input max
  const [todayDate, setTodayDate] = useState<string | undefined>(undefined);
  useEffect(() => {
    setTodayDate(new Date().toISOString().split("T")[0]);
  }, []);

  // Focus the nickname input when the step becomes "nickname"
  useEffect(() => {
    if (step === "nickname") {
      nicknameRef.current?.focus();
    }
  }, [step]);

  // Import state
  const [importText, setImportText] = useState("");
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<{
    imported: number;
    total: number;
  } | null>(null);

  const completeOnboarding = api.onboarding.completeOnboarding.useMutation({
    onSuccess: () => router.push("/write"),
    onError: () => setStep("character"),
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
      // Auto-advance after a brief pause
      setTimeout(() => setStep("nickname"), 1500);
    } catch {
      // Allow user to retry or skip
      setImporting(false);
    }
  }, [importText, importMemory]);

  const handleComplete = useCallback(() => {
    if (!nickname.trim() || !pronouns || !dob) return;
    setStep("completing");
    completeOnboarding.mutate({
      nickname: nickname.trim(),
      pronouns,
      dob,
      preferredSpeaker: selectedCharacter,
    });
  }, [nickname, pronouns, dob, selectedCharacter, completeOnboarding]);

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
      setStep(flow[currentIndex + 1]!);
    } else if (step === "character") {
      handleComplete();
    }
  };

  const handleBack = () => {
    const flow: Step[] = ["choose-path", "nickname", "pronouns", "dob", "character"];
    const currentIndex = flow.indexOf(step);
    if (step === "import") {
      setStep("choose-path");
    } else if (currentIndex > 0) {
      setStep(flow[currentIndex - 1]!);
    }
  };

  return (
    <div className="w-full max-w-[520px]">
      {/* Back button */}
      {step !== "choose-path" && step !== "completing" && (
        <button
          type="button"
          onClick={handleBack}
          className="mb-6 flex items-center gap-1 font-body text-[0.82rem] text-ink-3 transition-colors hover:text-ink"
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
          <h1 className="mb-3 font-disp text-[2.4rem] leading-[1.1] text-ink">
            Welcome to <span className="italic">Mira</span>
            <span className="text-red">.</span>
          </h1>
          <p className="mb-10 font-body text-[0.95rem] text-ink-3">
            Let&apos;s get to know you a little.
          </p>

          <div className="flex w-full flex-col gap-4">
            <button
              type="button"
              onClick={() => setStep("import")}
              className="w-full rounded-[6px] border border-rule-soft bg-paper-2 px-6 py-5 text-left transition-all hover:border-rule hover:shadow-[0_4px_20px_rgba(33,28,22,0.08)]"
            >
              <span className="mb-1 block font-disp text-[1.2rem] text-ink">
                I have memories to bring
              </span>
              <span className="block font-body text-[0.82rem] text-ink-3">
                Import from ChatGPT, Claude, or any AI you&apos;ve been talking
                to
              </span>
            </button>

            <button
              type="button"
              onClick={() => setStep("nickname")}
              className="w-full rounded-[6px] border border-rule-soft bg-paper-2 px-6 py-5 text-left transition-all hover:border-rule hover:shadow-[0_4px_20px_rgba(33,28,22,0.08)]"
            >
              <span className="mb-1 block font-disp text-[1.2rem] text-ink">
                Start fresh
              </span>
              <span className="block font-body text-[0.82rem] text-ink-3">
                We&apos;ll learn about you as we go
              </span>
            </button>
          </div>
        </div>
      )}

      {/* Step: Import Memory */}
      {step === "import" && (
        <div className="flex flex-col">
          <h2 className="mb-2 font-disp text-[1.8rem] leading-[1.1] text-ink">
            Import your memories
          </h2>
          <p className="mb-6 font-body text-[0.88rem] leading-relaxed text-ink-3">
            Copy the prompt below, paste it in ChatGPT or Claude, then paste
            their response here.
          </p>

          {/* Copyable prompt */}
          <div className="mb-4 rounded-[4px] border border-rule-soft bg-paper-2 p-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="font-body text-[0.72rem] uppercase tracking-[0.1em] text-ink-3">
                Prompt to copy
              </span>
              <button
                type="button"
                onClick={() => {
                  void navigator.clipboard.writeText(IMPORT_PROMPT);
                  toast.success("Prompt copied to clipboard");
                }}
                className="rounded border border-rule-soft px-2 py-0.5 font-body text-[0.72rem] text-ink-3 transition-colors hover:border-rule hover:text-ink"
              >
                Copy
              </button>
            </div>
            <p className="font-body text-[0.82rem] leading-relaxed text-ink-2">
              {IMPORT_PROMPT}
            </p>
          </div>

          {/* Paste area */}
          <textarea
            aria-label="Paste imported memories here"
            value={importText}
            onChange={(e) => setImportText(e.target.value)}
            placeholder="Paste the response here..."
            rows={8}
            className="mb-4 w-full resize-none rounded-[4px] border border-rule-soft bg-paper-2 px-4 py-3 font-body text-[0.88rem] text-ink placeholder:italic placeholder:text-ink-3 focus:border-rule focus:outline-none"
          />

          {importResult && (
            <p className="mb-4 font-body text-[0.82rem] text-ink-2">
              Imported {importResult.imported} of {importResult.total} memory
              sections.
            </p>
          )}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleImport}
              disabled={!importText.trim() || importing}
              className="flex-1 rounded-[4px] bg-ink px-6 py-3 font-body text-[0.85rem] tracking-[0.04em] text-paper transition-colors hover:bg-ink-2 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {importing ? "Importing..." : "Import & Continue"}
            </button>
            <button
              type="button"
              onClick={() => setStep("nickname")}
              className="rounded-[4px] border border-rule-soft px-6 py-3 font-body text-[0.85rem] text-ink-3 transition-colors hover:border-rule hover:text-ink"
            >
              Skip
            </button>
          </div>
        </div>
      )}

      {/* Step: Nickname */}
      {step === "nickname" && (
        <div className="flex flex-col items-center text-center">
          <h2 className="mb-2 font-disp text-[1.8rem] leading-[1.1] text-ink">
            What should I call you?
          </h2>
          <p className="mb-8 font-body text-[0.88rem] text-ink-3">
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
            className="mb-8 w-full max-w-[320px] border-b-[1.5px] border-rule-soft bg-transparent px-0 py-3 text-center font-disp text-[1.6rem] text-ink placeholder:text-ink-3 focus:border-rule focus:outline-none"
          />
          <button
            type="button"
            onClick={handleNext}
            disabled={!canGoNext()}
            className="rounded-[4px] bg-ink px-8 py-3 font-body text-[0.85rem] tracking-[0.04em] text-paper transition-colors hover:bg-ink-2 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}

      {/* Step: Pronouns */}
      {step === "pronouns" && (
        <div className="flex flex-col items-center text-center">
          <h2 className="mb-2 font-disp text-[1.8rem] leading-[1.1] text-ink">
            How should I refer to you?
          </h2>
          <p className="mb-8 font-body text-[0.88rem] text-ink-3">
            Pick your pronouns.
          </p>
          <div className="mb-8 flex gap-3">
            {(["he/him", "she/her", "they/them"] as const).map((p) => (
              <button
                type="button"
                key={p}
                onClick={() => setPronouns(p)}
                className={`rounded-full border px-5 py-2.5 font-body text-[0.88rem] transition-colors ${
                  pronouns === p
                    ? "border-ink bg-ink text-paper"
                    : "border-rule text-ink-3 hover:border-ink-3"
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
            className="rounded-[4px] bg-ink px-8 py-3 font-body text-[0.85rem] tracking-[0.04em] text-paper transition-colors hover:bg-ink-2 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}

      {/* Step: DOB */}
      {step === "dob" && (
        <div className="flex flex-col items-center text-center">
          <h2 className="mb-2 font-disp text-[1.8rem] leading-[1.1] text-ink">
            When&apos;s your birthday?
          </h2>
          <p className="mb-8 font-body text-[0.88rem] text-ink-3">
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
            className="mb-8 w-full max-w-[280px] rounded-[4px] border border-rule-soft bg-paper-2 px-4 py-3 font-body text-[0.95rem] text-ink focus:border-rule focus:outline-none"
          />
          <button
            type="button"
            onClick={handleNext}
            disabled={!canGoNext()}
            className="rounded-[4px] bg-ink px-8 py-3 font-body text-[0.85rem] tracking-[0.04em] text-paper transition-colors hover:bg-ink-2 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}

      {/* Step: Character Selection */}
      {step === "character" && (
        <div className="flex flex-col items-center">
          <h2 className="mb-2 text-center font-disp text-[1.8rem] leading-[1.1] text-ink">
            Choose your companion
          </h2>
          <p className="mb-8 text-center font-body text-[0.88rem] text-ink-3">
            You can always switch later.
          </p>

          <div className="mb-8 grid w-full grid-cols-2 gap-3">
            {CHARACTERS.map((c) => (
              <button
                type="button"
                key={c.id}
                onClick={() => setSelectedCharacter(c.id)}
                className={`flex flex-col items-start rounded-[6px] border p-4 text-left transition-all ${
                  selectedCharacter === c.id
                    ? "border-red bg-paper-2 shadow-[0_4px_20px_rgba(203,58,40,0.1)]"
                    : "border-rule-soft bg-paper-2 hover:border-rule"
                }`}
              >
                <div className="mb-2 flex items-center gap-2.5">
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-full border ${
                      selectedCharacter === c.id
                        ? "border-red bg-red text-paper"
                        : "border-rule bg-paper text-ink"
                    } font-disp text-[1.1rem] leading-none transition-colors`}
                  >
                    {c.name[0]}
                  </div>
                  <div>
                    <span className="block font-disp text-[1.05rem] leading-none text-ink">
                      {c.name}
                    </span>
                    <span className="block font-body text-[0.7rem] italic text-ink-3">
                      {c.title}
                    </span>
                  </div>
                </div>
                <p className="font-body text-[0.75rem] leading-snug text-ink-3">
                  {c.description}
                </p>
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={handleComplete}
            disabled={completeOnboarding.isPending}
            className="rounded-[4px] bg-red px-8 py-3 font-body text-[0.85rem] tracking-[0.04em] text-paper transition-colors hover:bg-red-d disabled:cursor-not-allowed disabled:opacity-60"
          >
            {completeOnboarding.isPending
              ? "Setting up..."
              : "Start your journey"}
          </button>
        </div>
      )}

      {/* Step: Completing */}
      {step === "completing" && (
        <div className="flex flex-col items-center text-center">
          <div className="mb-6 h-12 w-12 animate-spin rounded-full border-2 border-rule-soft border-t-ink" />
          <p className="font-body text-[0.95rem] text-ink-2">
            Setting things up for you...
          </p>
        </div>
      )}
    </div>
  );
}
