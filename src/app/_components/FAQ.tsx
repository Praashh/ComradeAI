"use client";

import { useState } from "react";
import RevealOnScroll from "./RevealOnScroll";

const FAQS = [
  {
    question: "How does Comrade AI protect my personal journal privacy?",
    answer:
      "Your privacy is our core priority. All journal entries and voice conversations are encrypted end-to-end. We never sell your data or use your personal journals to train public foundation models.",
  },
  {
    question: "What is Emotional Cartography?",
    answer:
      "Emotional Cartography is Comrade's interactive visualization feature. It maps key emotional themes, recurring topics, and mood shifts over time, giving you a bird's-eye view of your psychological well-being.",
  },
  {
    question: "How does Voice Mode work?",
    answer:
      "Voice Mode utilizes low-latency, real-time audio streams. You can speak naturally, pause to think, or interrupt, and Comrade responds with human-like empathy and gentle cadence.",
  },
  {
    question: "Can I export my journals?",
    answer:
      "Yes, you can export your entire journal history at any time in JSON, Markdown, or PDF format with a single click.",
  },
  {
    question: "Is Comrade AI a replacement for professional therapy?",
    answer:
      "No. Comrade AI is an empathetic journaling companion designed for self-reflection, emotional tracking, and mindfulness. It does not provide medical diagnoses or clinical mental health treatment.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section
      id="faq"
      className="tablet:px-8 border-t border-white/5 bg-[var(--dark-bg)] px-4 py-24"
    >
      <div className="mx-auto max-w-[768px]">
        <RevealOnScroll className="section-header">
          <div className="pill-badge">
            <span>FAQ</span>
          </div>

          <h2 className="heading-h2 max-w-[580px]">
            Frequently{" "}
            <span className="text-[var(--text-muted-grey)]">
              asked questions
            </span>
          </h2>
        </RevealOnScroll>

        <div className="space-y-4">
          {FAQS.map((faq, i) => (
            <RevealOnScroll key={i}>
              <div className="dark-gradient-card overflow-hidden rounded-[20px] border border-white/10 transition-all duration-200">
                <button
                  type="button"
                  onClick={() => toggle(i)}
                  className="flex w-full cursor-pointer items-center justify-between gap-4 p-6 text-left transition-colors hover:bg-white/5"
                >
                  <span className="font-satoshi text-[16px] font-medium text-white sm:text-[18px]">
                    {faq.question}
                  </span>
                  <span className="material-symbols-outlined text-[var(--text-muted-grey)] transition-transform duration-300">
                    {openIndex === i ? "expand_less" : "expand_more"}
                  </span>
                </button>

                {openIndex === i && (
                  <div className="font-satoshi animate-fade-in px-6 pt-0 pb-6 text-sm leading-relaxed text-[var(--text-muted-grey)]">
                    {faq.answer}
                  </div>
                )}
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
