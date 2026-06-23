"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { api } from "@/trpc/react";
import { toast } from "sonner";
import {
  Sparkle,
  Bug,
  ChatTeardropText,
  TrendUp,
  CircleNotch,
  PaperPlaneRight,
} from "@phosphor-icons/react";
import type { ElementType } from "react";
import RevealOnScroll from "./RevealOnScroll";

const FEEDBACK_TYPES = [
  { value: "feature", label: "Feature", icon: Sparkle as ElementType },
  { value: "bug", label: "Bug", icon: Bug as ElementType },
  { value: "general", label: "General", icon: ChatTeardropText as ElementType },
  { value: "improvements", label: "Improvement", icon: TrendUp as ElementType },
] as const;

type FeedbackType = (typeof FEEDBACK_TYPES)[number]["value"];

export default function Feedback() {
  const router = useRouter();
  const { isSignedIn, isLoaded } = useAuth();
  
  const [type, setType] = useState<FeedbackType>("general");
  const [message, setMessage] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const submitFeedback = api.feedback.submit.useMutation({
    onSuccess: () => {
      toast.success("Feedback submitted successfully! Thank you.");
      setMessage("");
      setType("general");
    },
    onError: (err) => {
      toast.error(err.message || "Failed to submit feedback. Please try again.");
    },
  });

  const handleInteraction = () => {
    if (isLoaded && !isSignedIn) {
      router.push("/sign-in");
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;
    if (!isSignedIn) {
      router.push("/sign-in");
      return;
    }

    if (message.trim().length < 5) {
      toast.error("Feedback message must be at least 5 characters long.");
      return;
    }

    submitFeedback.mutate({
      type,
      message: message.trim(),
    });
  };

  return (
    <section id="feedback" className="border-t-2 border-ink pt-[18px] pb-[clamp(56px,8vw,92px)]">
      <div className="wrap">
        <div className="grid grid-cols-[1fr_1.2fr] gap-[clamp(28px,6vw,80px)] max-tablet:grid-cols-1">
          {/* Text Side */}
          <RevealOnScroll className="flex flex-col justify-start">
            <span className="font-disp italic text-[1.1rem] text-red mb-3">
              § 05
            </span>
            <h2 className="[font-family:var(--disp)] font-normal text-[clamp(2.2rem,5.5vw,3.6rem)] leading-[1.02] tracking-[-0.01em] mb-4">
              Shape Comrade<span className="text-red">.</span>
              <br />
              <span className="it">Tell us your thoughts.</span>
            </h2>
            <p className="text-ink-2 max-w-[26em] text-[1.08rem] leading-[1.6]">
              Comrade is designed to grow alongside you. If you have run into a bug, want to suggest an improvement, request a new feature, or simply share some thoughts, let us know.
            </p>
            <p className="text-ink-3 text-[0.9rem] italic mt-6">
              * Submissions are routed directly to the developer team&rsquo;s Discord.
            </p>
          </RevealOnScroll>

          {/* Form Side */}
          <RevealOnScroll className="bg-paper-2 border border-rule-soft rounded-[4px] p-[clamp(20px,4vw,36px)] shadow-[0_4px_24px_rgba(33,28,22,0.04)]">
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              {/* Type Selection */}
              <div className="flex flex-col gap-2.5">
                <span className="text-[10px] tracking-[0.1em] uppercase text-[var(--ink-3)] font-body font-medium px-1">
                  Select Feedback Type
                </span>
                <div className="grid grid-cols-2 gap-2.5 max-mobile:grid-cols-1">
                  {FEEDBACK_TYPES.map((t) => {
                    const Icon = t.icon;
                    const isSelected = type === t.value;
                    return (
                      <button
                        key={t.value}
                        type="button"
                        onClick={() => {
                          handleInteraction();
                          if (isSignedIn) setType(t.value);
                        }}
                        className={`flex items-center gap-2.5 px-4 py-3 rounded-[3px] border transition-all cursor-pointer font-body text-[0.92rem] text-left ${
                          isSelected
                            ? "bg-red border-red text-paper shadow-[0_2px_8px_rgba(203,58,40,0.15)]"
                            : "bg-paper border-rule-soft text-ink-2 hover:border-rule hover:text-ink hover:bg-paper-2"
                        }`}
                      >
                        <Icon size={18} weight={isSelected ? "fill" : "regular"} />
                        {t.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Message Field */}
              <div className="flex flex-col gap-2.5">
                <label
                  htmlFor="feedback-message"
                  className="text-[10px] tracking-[0.1em] uppercase text-[var(--ink-3)] font-body font-medium px-1"
                >
                  Detailed Message
                </label>
                <textarea
                  id="feedback-message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onFocus={() => {
                    setIsFocused(true);
                    handleInteraction();
                  }}
                  onBlur={() => setIsFocused(false)}
                  placeholder="How can we make Comrade better for you?"
                  required
                  className={`w-full bg-paper border ${
                    isFocused ? "border-ink" : "border-rule-soft"
                  } rounded-[3px] p-3.5 text-ink placeholder-ink-3 transition-all duration-200 outline-none min-h-[140px] font-body text-[1rem] leading-[1.5] resize-y`}
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitFeedback.isPending}
                className="[font-family:var(--body)] cursor-pointer text-[0.96rem] tracking-[0.025em] transition-all duration-200 inline-flex items-center justify-center gap-2 bg-red text-paper px-[24px] py-[13px] border-0 rounded-[2px] font-medium hover:bg-red-d hover:-translate-y-px disabled:bg-ink-3 disabled:cursor-not-allowed w-full shadow-[0_2px_8px_rgba(203,58,40,0.15)]"
              >
                {submitFeedback.isPending ? (
                  <>
                    <CircleNotch size={16} className="animate-spin" />
                    Sending feedback...
                  </>
                ) : (
                  <>
                    Send feedback
                    <PaperPlaneRight size={16} />
                  </>
                )}
              </button>
            </form>
          </RevealOnScroll>
        </div>
      </div>
    </section>
  );
}
