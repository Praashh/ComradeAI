"use client";

import Image from "next/image";
import Link from "next/link";
import RevealOnScroll from "./RevealOnScroll";

export default function CTA() {
  return (
    <section id="cta" className="tablet:px-8 bg-[var(--dark-bg)] px-4 py-32">
      <RevealOnScroll className="section-wrapper">
        <div className="dark-gradient-card tablet:p-16 tablet:flex-row relative flex flex-col items-center justify-between gap-12 overflow-hidden rounded-[40px] border border-[var(--border-card)] p-10 shadow-2xl">
          <div className="pointer-events-none absolute top-0 right-0 h-96 w-96 rounded-full bg-white/5 blur-[100px]" />

          <div className="relative z-10 max-w-xl">
            <div className="pill-badge mb-4">
              <span>Start Today</span>
            </div>

            <h2 className="font-instrument mb-4 text-[40px] leading-tight font-normal text-white sm:text-[54px]">
              Ready to start your{" "}
              <span className="text-white/90 italic">reflective</span> journey?
            </h2>
            <p className="font-satoshi mb-8 text-[15px] leading-relaxed text-[var(--text-muted-grey)]">
              Join thousands of mindful writers who have found a quieter, more
              intelligent way to process daily thoughts.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Link href="/sign-up">
                <button
                  type="button"
                  className="neon-btn font-satoshi cursor-pointer rounded-full px-7 py-3 text-xs font-semibold tracking-wide uppercase shadow-lg transition-all duration-200"
                >
                  Get Started Free
                </button>
              </Link>
              <Link href="/talk">
                <button
                  type="button"
                  className="font-satoshi cursor-pointer rounded-full border border-white/15 bg-white/10 px-7 py-3 text-xs font-medium tracking-wide text-white uppercase transition-all hover:bg-white/20"
                >
                  Try Voice Mode
                </button>
              </Link>
            </div>
          </div>

          <div className="tablet:w-5/12 relative aspect-square w-full shrink-0 rotate-1 overflow-hidden rounded-[20px] border border-white/15 bg-[var(--dark-surface-1)] transition-transform duration-500 hover:rotate-0">
            <Image
              className="object-cover"
              alt="Person sitting in a light-filled room reflecting"
              src="/images/cta.jpg"
              fill
              sizes="(min-width: 810px) 40vw, 100vw"
            />
          </div>
        </div>
      </RevealOnScroll>
    </section>
  );
}
