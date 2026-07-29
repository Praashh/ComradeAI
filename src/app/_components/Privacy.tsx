"use client";

import RevealOnScroll from "./RevealOnScroll";

export default function Privacy() {
  return (
    <section
      id="privacy"
      className="tablet:px-8 border-t border-white/5 bg-[var(--dark-bg)] px-4 py-24"
    >
      <div className="section-wrapper text-center">
        <RevealOnScroll className="mb-16">
          <span className="font-satoshi mb-3 inline-block text-xs font-semibold tracking-widest text-[var(--accent-neon)] uppercase">
            Uncompromised Security
          </span>
          <h2 className="font-instrument text-[42px] font-normal text-white sm:text-[54px]">
            Your Privacy is Our{" "}
            <span className="text-[var(--accent-neon)] italic">Sanctuary</span>
          </h2>
        </RevealOnScroll>

        <div className="tablet:grid-cols-3 grid grid-cols-1 gap-8">
          <RevealOnScroll className="flex">
            <div className="dark-gradient-card flex w-full flex-col items-center rounded-[40px] p-8 text-center transition-all duration-300 hover:border-[var(--accent-neon)]/30">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-[var(--accent-neon)]/20 bg-[var(--accent-neon)]/10 text-[var(--accent-neon)]">
                <span className="material-symbols-outlined text-[28px]">
                  security
                </span>
              </div>
              <h4 className="font-instrument mb-2 text-[24px] font-normal text-white">
                End-to-End Encryption
              </h4>
              <p className="font-satoshi text-sm leading-relaxed text-[var(--text-muted-grey)]">
                Your personal reflections are yours alone, encrypted at every
                step with enterprise-grade protocols.
              </p>
            </div>
          </RevealOnScroll>

          <RevealOnScroll className="flex">
            <div className="dark-gradient-card flex w-full flex-col items-center rounded-[40px] p-8 text-center transition-all duration-300 hover:border-[var(--accent-neon)]/30">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-[var(--accent-neon)]/20 bg-[var(--accent-neon)]/10 text-[var(--accent-neon)]">
                <span className="material-symbols-outlined text-[28px]">
                  visibility_off
                </span>
              </div>
              <h4 className="font-instrument mb-2 text-[24px] font-normal text-white">
                Zero Data Selling
              </h4>
              <p className="font-satoshi text-sm leading-relaxed text-[var(--text-muted-grey)]">
                We never monetize your private thoughts, display ads, or train
                public AI models on your journal entries.
              </p>
            </div>
          </RevealOnScroll>

          <RevealOnScroll className="flex">
            <div className="dark-gradient-card flex w-full flex-col items-center rounded-[40px] p-8 text-center transition-all duration-300 hover:border-[var(--accent-neon)]/30">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-[var(--accent-neon)]/20 bg-[var(--accent-neon)]/10 text-[var(--accent-neon)]">
                <span className="material-symbols-outlined text-[28px]">
                  verified_user
                </span>
              </div>
              <h4 className="font-instrument mb-2 text-[24px] font-normal text-white">
                Full Data Ownership
              </h4>
              <p className="font-satoshi text-sm leading-relaxed text-[var(--text-muted-grey)]">
                Delete any journal memory or export your entire reflective
                archive instantly at any time.
              </p>
            </div>
          </RevealOnScroll>
        </div>
      </div>
    </section>
  );
}
