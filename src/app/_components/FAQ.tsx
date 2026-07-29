"use client";

import { useState } from "react";
import RevealOnScroll from "./RevealOnScroll";

const FAQS_LEFT = [
  {
    question: "What can I create with ComradeAI?",
    answer:
      "ComradeAI allows you to generate high-resolution AI images, cinematic video clips, storyboards, and custom visual assets using simple text prompts and reference frames.",
  },
  {
    question: "Do I need design or video skills?",
    answer:
      "No technical background is needed. Our intuitive prompt editor, visual presets, and automated keyframes handle composition, lighting, and motion for you.",
  },
  {
    question: "Does ComradeAI support both images and video?",
    answer:
      "Yes! You can create standalone images, animate static visuals into video clips, or build multi-frame keyframe sequences seamlessly.",
  },
];

const FAQS_RIGHT = [
  {
    question: "Is there a free plan available?",
    answer:
      "Yes, our Starter plan is 100% free forever and includes 100 monthly credits to test image generation and basic editing features.",
  },
  {
    question: "Can I use ComradeAI for commercial work?",
    answer:
      "Yes, all assets generated on Pro and Studio plans come with full commercial rights for ads, social media, product launches, and client work.",
  },
  {
    question: "How do credits work?",
    answer:
      "Credits are used whenever you generate an image or render a video. Monthly credits renew at the start of each billing cycle, and additional credit top-ups are available anytime.",
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

