"use client";

import Image from "next/image";
import RevealOnScroll from "./RevealOnScroll";

const STEPS = [
  {
    number: "01",
    title: "Journal",
    description:
      "Write down your daily thoughts, reflections, and feelings in your private space.",
    mockup: "/images/journal.png",
    alt: "Journaling interface mockup",
  },
  {
    number: "02",
    title: "Chat",
    description:
      "Text with your AI best friend anytime to process your emotions and get empathetic responses.",
    mockup: "/images/chat.png",
    alt: "Chat interface mockup",
  },
  {
    number: "03",
    title: "Talk",
    description:
      "Have real-time 1-on-1 voice calls with your AI companion whenever you need to speak out loud.",
    mockup: "/images/talk.png",
    alt: "Voice call interface mockup",
  },
];

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="tablet:px-8 border-t border-white/5 bg-[var(--dark-bg)] px-4 py-24"
    >
      <div className="section-wrapper">
        <RevealOnScroll className="section-header mb-16">
          <div className="pill-badge">
            <span>How It Works</span>
          </div>

          <h2 className="font-instrument w-full max-w-[620px] text-center text-[36px] leading-[1.15] font-normal text-white sm:text-[48px] md:text-[54px]">
            <span className="text-[var(--text-muted-grey)]">From </span>
            your thoughts to feeling heard{" "}
            <span className="text-[var(--text-muted-grey)]">
              in three simple ways.
            </span>
          </h2>
        </RevealOnScroll>

        <div className="grid grid-cols-1 items-stretch gap-6 md:grid-cols-3">
          {STEPS.map((step, idx) => (
            <RevealOnScroll key={idx} className="flex">
              <div className="dark-gradient-card group relative flex w-full flex-col justify-between overflow-hidden rounded-[32px] p-6 shadow-xl transition-all duration-300 hover:border-white/30">
                {/* UI Mockup Container */}
                <div
                  className="relative mb-6 h-[280px] w-full overflow-hidden rounded-[24px] border border-white/10 bg-[#0d0d0d]"
                  style={{ clipPath: "inset(0 round 24px)" }}
                >
                  <Image
                    src={step.mockup}
                    alt={step.alt}
                    fill
                    className="object-contain object-top"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/40 via-transparent to-transparent" />
                </div>

                {/* Text Content */}
                <div className="px-2 pb-2">
                  <div className="mb-2 flex items-center gap-2">
                    <span className="font-satoshi text-[12px] font-semibold text-white/40 border border-white/10 rounded-full px-2 py-0.5">
                      {step.number}
                    </span>
                    <h3 className="font-satoshi text-[20px] font-medium tracking-tight text-white">
                      {step.title}
                    </h3>
                  </div>
                  <p className="font-satoshi text-[14px] leading-relaxed text-white/60">
                    {step.description}
                  </p>
                </div>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
