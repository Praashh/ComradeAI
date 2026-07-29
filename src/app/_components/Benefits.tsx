"use client";

import RevealOnScroll from "./RevealOnScroll";

const BENEFITS = [
  {
    icon: (
      <svg
        className="h-6 w-6 text-white/90"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M5 22h14" />
        <path d="M5 2h14" />
        <path d="M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22" />
        <path d="M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2" />
      </svg>
    ),
    title: "Personalized AI Memory",
    description:
      "ComradeAI remembers your preferences, past conversations, and working style. This allows it to provide smarter, more relevant assistance over time.",
  },
  {
    icon: (
      <svg
        className="h-6 w-6 text-white/90"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z" />
        <line x1="16" y1="8" x2="2" y2="22" />
        <line x1="17.5" y1="15" x2="9" y2="15" />
      </svg>
    ),
    title: "Smarter Decision Support",
    description:
      "Receive context-aware recommendations, summaries, and actionable insights. Make informed decisions faster with AI-powered assistance.",
  },
  {
    icon: (
      <svg
        className="h-6 w-6 text-white/90"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="6" />
        <circle cx="12" cy="12" r="2" />
      </svg>
    ),
    title: "Secure & User-Controlled",
    description:
      "Your connected data and AI memory are designed to stay under your control. Manage permissions, review actions, and protect your information with confidence.",
  },
  {
    icon: (
      <svg
        className="h-6 w-6 text-white/90"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      </svg>
    ),
    title: "Zero Tracking",
    description:
      "We never sell your data. We aren't an ad company.",
  },
  {
    icon: (
      <svg
        className="h-6 w-6 text-white/90"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M11 15h2a2 2 0 1 0 0-4h-3c-.6 0-1.1.2-1.4.6L3 17" />
        <path d="m7 21 1.6-1.4c.4-.4.9-.6 1.4-.6h4c1.1 0 2.1-.4 2.8-1.2l4.6-4.4a2 2 0 0 0-2.75-2.91l-4.2 3.9" />
        <path d="m2 16 6 6" />
        <path d="M16 8V5c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v3" />
      </svg>
    ),
    title: "You Control",
    description:
      "We never sell your data. We aren't an ad company.",
  },
  {
    icon: (
      <svg
        className="h-6 w-6 text-white/90"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    title: "End-to-End",
    description:
      "Your journals are yours alone, encrypted at every step.",
  },
];

export default function Benefits() {
  return (
    <section id="benefits" className="tablet:px-8 bg-[var(--dark-bg)] px-4 py-24">
      <div className="section-wrapper">
        <RevealOnScroll className="section-header mb-16">
          <div className="pill-badge">
            <span>Benefits</span>
          </div>

          <h2 className="font-instrument w-full max-w-[720px] text-center text-[36px] leading-[1.15] font-normal text-white sm:text-[48px] md:text-[54px]">
            Faster production, sharper concepts,{" "}
            <span className="text-[var(--text-muted-grey)]">
              and campaign assets ready in minutes.
            </span>
          </h2>
        </RevealOnScroll>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {BENEFITS.map((item, idx) => (
            <RevealOnScroll key={idx} className="flex">
              <div className="dark-gradient-card group relative flex min-h-[220px] w-full flex-col justify-start rounded-[32px] p-8 shadow-xl transition-all duration-300 hover:border-white/30">
                <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 border border-white/10 transition-colors group-hover:border-white/20 group-hover:bg-white/10">
                  {item.icon}
                </div>
                <div>
                  <h3 className="font-satoshi mb-2 text-[20px] font-medium tracking-tight text-white">
                    {item.title}
                  </h3>
                  <p className="font-satoshi text-[14px] leading-relaxed text-white/60">
                    {item.description}
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
