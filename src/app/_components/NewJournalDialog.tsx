"use client";

import { useState } from "react";
import { redirect, useRouter } from "next/navigation";
import { api } from "@/trpc/react";
import * as Icons from "@phosphor-icons/react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";

const COLOR_OPTIONS = [
  { value: "#6E56CF", label: "Purple" },
  { value: "#D47B9A", label: "Rose" },
  { value: "#E5484D", label: "Red" },
  { value: "#EC60B4", label: "Pink" },
  { value: "#F7978D", label: "Salmon" },
  { value: "#F3B294", label: "Peach" },
  { value: "#F79F6E", label: "Orange" },
  { value: "#13C296", label: "Teal" },
  { value: "#30B2F2", label: "Sky" },
  { value: "#3E63DD", label: "Blue" },
  { value: "#8BA3E8", label: "Periwinkle" },
  { value: "#8E9DF7", label: "Lavender" },
  { value: "#FFFFFF", label: "White" },
  { value: "linear-gradient(135deg, #6e56cf 0%, #ea580c 50%, #e11d48 100%)", label: "Sunset" },
  { value: "linear-gradient(135deg, #3b82f6 0%, #06b6d4 50%, #10b981 100%)", label: "Ocean" },
];

const ICON_OPTIONS = [
  "MasksPlay", "Smiley", "SmileyWink", "SmileySad", "SmileyMeh", "Heart",
  "Sparkles", "Star", "Crown", "Trophy", "House", "Bed",
  "Tree", "Leaf", "Mountains", "Sun", "Moon", "CloudRain",
  "Flame", "Lightning", "Snowflake", "Globe", "BookOpen", "Notebook",
  "Pen", "Palette", "MusicNotes", "Camera", "Airplane", "Bicycle",
  "Car", "Briefcase", "Key", "Lightbulb", "Coffee", "Wine",
  "Pizza", "Gift", "Clock", "Compass", "Brain", "Medal",
  "Dog", "Cat", "Anchor", "PuzzlePiece", "Signpost", "Hourglass"
];

const QUICK_MOODS = [
  { label: "Calm 😌", text: "Calm" },
  { label: "Reflective 🤔", text: "Reflective" },
  { label: "Happy 😊", text: "Happy" },
  { label: "Tired 😴", text: "Tired" },
  { label: "Anxious 😰", text: "Anxious" },
  { label: "Excited ⚡", text: "Excited" },
];

interface NewJournalDialogProps {
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export default function NewJournalDialog({ children, defaultOpen = false }: NewJournalDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(defaultOpen);
  const [title, setTitle] = useState("");
  const [mood, setMood] = useState("");
  const [selectedColor, setSelectedColor] = useState("#6E56CF");
  const [selectedIcon, setSelectedIcon] = useState("MasksPlay");
  const [errorMsg, setErrorMsg] = useState("");

  const createJournal = api.journal.create.useMutation({
    onSuccess: (data) => {
      setOpen(false);
      router.push(`/write/${data.journal.id}`);
    },
    onError: (err) => {
      setErrorMsg(err.message || "Failed to create journal. Please try again.");
    }
  });

  const handleDone = () => {
    if (!title.trim()) {
      setErrorMsg("Please enter a journal name.");
      return;
    }
    setErrorMsg("");
    createJournal.mutate({
      title: title.trim(),
      mood: mood.trim() || undefined,
      icon: selectedIcon,
      color: selectedColor,
    });
  };

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) {
      // Reset form on close
      setTitle("");
      setMood("");
      setSelectedColor("#6E56CF");
      setSelectedIcon("MasksPlay");
      setErrorMsg("");
    }
    redirect("/")
  };

  const PreviewIcon = (Icons[selectedIcon as keyof typeof Icons] ?? Icons.BookOpen) as React.ElementType;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger render={<span />}>
        {children}
      </DialogTrigger>
      <DialogContent
        showCloseButton={false}
        className="!bg-[var(--paper-2)] !border !border-[var(--rule-soft)] !rounded-[8px] !p-6 !shadow-[0_8px_40px_rgba(33,28,22,0.12)] !max-w-[480px] !ring-0 flex flex-col gap-6 font-body select-none"
      >
        {/* Dynamic Icon Preview */}
        <div className="flex justify-center pt-2">
          <div
            className="w-24 h-24 rounded-full flex items-center justify-center text-white shadow-[0_4px_16px_rgba(33,28,22,0.12)] transition-all duration-500 ease-out hover:scale-105"
            style={{ background: selectedColor }}
          >
            <PreviewIcon size={48} weight="duotone" />
          </div>
        </div>

        {/* Form Inputs */}
        <div className="flex flex-col gap-4">
          {/* Journal Title */}
          <input
            type="text"
            placeholder="Journal Name"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-transparent border-b-[1.5px] border-[var(--rule-soft)] focus:border-[var(--rule)] px-2 py-3 text-center text-[var(--ink)] placeholder-[var(--ink-3)] font-disp text-2xl font-normal transition-colors focus:outline-none"
          />

          {/* Journal Mood */}
          <div className="flex flex-col gap-2">
            <input
              type="text"
              placeholder="How are you feeling today?"
              value={mood}
              onChange={(e) => setMood(e.target.value)}
              className="w-full bg-transparent border-b border-[var(--rule-soft)] focus:border-[var(--rule)] px-2 py-2 text-center text-[var(--ink)] placeholder-[var(--ink-3)] font-body text-sm italic transition-colors focus:outline-none"
            />
            {/* Quick Mood Shortcuts */}
            <div className="flex flex-wrap gap-1.5 justify-center mt-1">
              {QUICK_MOODS.map((m) => (
                <button
                  key={m.text}
                  type="button"
                  onClick={() => setMood(m.text)}
                  className={`text-[11px] px-2.5 py-1 rounded-full border transition-all cursor-pointer font-body ${mood.toLowerCase() === m.text.toLowerCase()
                    ? "bg-[var(--red)] border-[var(--red)] text-[var(--paper)]"
                    : "border-[var(--rule-soft)] text-[var(--ink-3)] hover:border-[var(--rule)] hover:text-[var(--ink-2)]"
                    }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Colors Carousel/Row */}
        <div className="flex flex-col gap-2.5">
          <span className="text-[10px] tracking-[0.1em] uppercase text-[var(--ink-3)] font-body font-medium px-1">Select theme color</span>
          <div className="flex gap-2 overflow-x-auto p-2 no-scrollbar scroll-smooth">
            {COLOR_OPTIONS.map((c) => {
              const isSelected = selectedColor === c.value;
              return (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => setSelectedColor(c.value)}
                  className={`w-7 h-7 rounded-full shrink-0 transition-all cursor-pointer relative flex items-center justify-center hover:scale-110 active:scale-95 ${isSelected ? "ring-2 ring-[var(--ink)] ring-offset-2 ring-offset-[var(--paper-2)]" : "opacity-75 hover:opacity-100"
                    }`}
                  style={{ background: c.value }}
                  title={c.label}
                >
                  {isSelected && (
                    <div className="w-1.5 h-1.5 rounded-full bg-white mix-blend-difference" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Icons Grid */}
        <div className="flex flex-col gap-2.5">
          <span className="text-[10px] tracking-[0.1em] uppercase text-[var(--ink-3)] font-body font-medium px-1">Select journal icon</span>
          <div className="grid grid-cols-7 gap-2 max-h-[160px] overflow-y-auto p-1.5 bg-[var(--paper-3)] border border-[var(--rule-soft)] rounded-[6px] no-scrollbar">
            {ICON_OPTIONS.map((iconName) => {
              const IconComp = (Icons[iconName as keyof typeof Icons] ?? Icons.BookOpen) as React.ElementType;
              const isSelected = selectedIcon === iconName;
              return (
                <button
                  key={iconName}
                  type="button"
                  onClick={() => setSelectedIcon(iconName)}
                  className={`aspect-square rounded-full flex items-center justify-center transition-all cursor-pointer hover:scale-105 active:scale-95 ${isSelected
                    ? "bg-[var(--red)] text-[var(--paper)] shadow-md scale-105"
                    : "bg-[var(--paper-2)] text-[var(--ink-3)] hover:text-[var(--ink)] hover:bg-[var(--paper)]"
                    }`}
                  style={{ padding: "8px" }}
                >
                  <IconComp size={18} weight={isSelected ? "bold" : "regular"} />
                </button>
              );
            })}
          </div>
        </div>

        {errorMsg && (
          <p className="text-[var(--red)] text-xs text-center font-body font-medium animate-pulse">
            {errorMsg}
          </p>
        )}

        {/* Buttons */}
        <div className="flex justify-end gap-3 pt-2 mt-1">
          <button
            type="button"
            onClick={() => handleOpenChange(false)}
            className="px-5 py-2.5 bg-[var(--paper-3)] hover:bg-[var(--paper)] text-[var(--ink-2)] hover:text-[var(--ink)] border border-[var(--rule-soft)] hover:border-[var(--rule)] rounded-[4px] text-sm font-body font-medium transition-all cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={createJournal.isPending}
            onClick={handleDone}
            className="px-6 py-2.5 bg-[var(--red)] hover:bg-[var(--red-d)] disabled:bg-[var(--ink-3)] text-[var(--paper)] rounded-[4px] text-sm font-body font-semibold tracking-wide uppercase transition-all cursor-pointer shadow-[0_2px_6px_rgba(203,58,40,0.2)] disabled:cursor-not-allowed flex items-center gap-2"
          >
            {createJournal.isPending ? (
              <>
                <Icons.CircleNotch size={16} className="animate-spin" />
                Creating...
              </>
            ) : (
              "Done"
            )}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
