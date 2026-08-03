"use client";

import { useState } from "react";
import RevealOnScroll from "./RevealOnScroll";

const FAQS_LEFT = [
  {
    question: "What exactly is Comrade AI?",
    answer:
      "Comrade AI is your personal AI companion that you can journal with, chat with, and talk to via voice. It remembers your conversations, understands your emotional patterns, and helps you reflect, grow, and feel heard.",
  },
  {
    question: "Is my journal private and secure?",
    answer:
      "Absolutely. Your journals and conversations are encrypted and never shared with third parties. We don't sell your data or use it for advertising — your thoughts stay yours alone.",
  },
  {
    question: "How does the voice conversation work?",
    answer:
      "Just hold to speak and have a natural, real-time conversation with your AI companion. It's like calling a friend who truly listens. Free users get 5 minutes of voice time to try it out.",
  },
];

const FAQS_RIGHT = [
  {
    question: "Is there a free plan?",
    answer:
      "Yes! Comrade AI is free to get started. You can journal as much as you want, chat with your AI companion, and try voice conversations with 5 free minutes included.",
  },
  {
    question: "How does the AI remember me?",
    answer:
      "Comrade AI uses a semantic memory system that learns from your journal entries and conversations over time. The more you share, the better it understands you and provides personalized, meaningful responses.",
  },
  {
    question: "Can I see my emotional patterns over time?",
    answer:
      "Yes! The Mind Graph and Emotional Cartography features visualize your mood shifts, recurring themes, and growth patterns across weeks and months with beautiful data-driven insights.",
  },
];

export default function FAQ() {
  const [openLeft, setOpenLeft] = useState<number | null>(null);
  const [openRight, setOpenRight] = useState<number | null>(null);

  return (
    <section
      id="faq"
      className="tablet:px-8 border-t border-white/5 bg-[var(--dark-bg)] px-4 py-24"
    >
      <div className="section-wrapper">
        <RevealOnScroll className="section-header mb-16">
          <div className="pill-badge">
            <span>FAQ</span>
          </div>

          <h2 className="font-instrument w-full max-w-[620px] text-center text-[36px] leading-[1.15] font-normal text-white sm:text-[48px] md:text-[54px]">
            <span className="text-[var(--text-muted-grey)]">Your </span>
            Questions, Answered{" "}
            <span className="text-[var(--text-muted-grey)]">clearly</span>
          </h2>
        </RevealOnScroll>

        <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-2">
          {/* Left Column */}
          <div className="space-y-4">
            {FAQS_LEFT.map((faq, idx) => {
              const isOpen = openLeft === idx;
              return (
                <RevealOnScroll key={idx}>
                  <div className="dark-gradient-card overflow-hidden rounded-[28px] border border-white/12 shadow-xl transition-all duration-300 hover:border-white/30">
                    <button
                      type="button"
                      onClick={() => setOpenLeft(isOpen ? null : idx)}
                      className="flex w-full cursor-pointer items-center justify-between gap-4 p-5 sm:p-6 text-left focus:outline-none"
                    >
                      <span className="font-satoshi text-[15px] sm:text-[16px] font-medium leading-snug text-white/90">
                        {faq.question}
                      </span>
                      <span className="font-light text-white/60 text-xl shrink-0 transition-transform duration-300">
                        {isOpen ? "−" : "+"}
                      </span>
                    </button>

                    {isOpen && (
                      <div className="font-satoshi px-6 pb-6 pt-1 text-[14px] leading-relaxed text-white/60 border-t border-white/5 animate-fade-in">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                </RevealOnScroll>
              );
            })}
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            {FAQS_RIGHT.map((faq, idx) => {
              const isOpen = openRight === idx;
              return (
                <RevealOnScroll key={idx}>
                  <div className="dark-gradient-card overflow-hidden rounded-[28px] border border-white/12 shadow-xl transition-all duration-300 hover:border-white/30">
                    <button
                      type="button"
                      onClick={() => setOpenRight(isOpen ? null : idx)}
                      className="flex w-full cursor-pointer items-center justify-between gap-4 p-5 sm:p-6 text-left focus:outline-none"
                    >
                      <span className="font-satoshi text-[15px] sm:text-[16px] font-medium leading-snug text-white/90">
                        {faq.question}
                      </span>
                      <span className="font-light text-white/60 text-xl shrink-0 transition-transform duration-300">
                        {isOpen ? "−" : "+"}
                      </span>
                    </button>

                    {isOpen && (
                      <div className="font-satoshi px-6 pb-6 pt-1 text-[14px] leading-relaxed text-white/60 border-t border-white/5 animate-fade-in">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                </RevealOnScroll>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

