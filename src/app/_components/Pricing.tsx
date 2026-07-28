"use client";

import { useState } from "react";
import Link from "next/link";
import RevealOnScroll from "./RevealOnScroll";

export default function Pricing() {
  const [isAnnual, setIsAnnual] = useState(true);

  return (
    <section
      id="pricing"
      className="tablet:px-8 border-t border-white/5 bg-[var(--dark-bg)] px-4 py-32"
    >
      <div className="section-wrapper">
        <RevealOnScroll className="section-header">
          <div className="pill-badge">
            <span>Pricing</span>
          </div>

          <h2 className="heading-h2 max-w-[580px]">
            Choose the plan{" "}
            <span className="text-[var(--text-muted-grey)]">
              that fits your creative output
            </span>
          </h2>

          <div className="mt-2 inline-flex items-center rounded-full border border-white/10 bg-white/5 p-1.5">
            <button
              type="button"
              onClick={() => setIsAnnual(false)}
              className={`font-satoshi cursor-pointer rounded-full px-5 py-2 text-xs font-medium transition-all ${
                !isAnnual
                  ? "bg-white text-[var(--dark-bg)]"
                  : "text-[var(--text-muted-grey)] hover:text-white"
              }`}
            >
              Monthly
            </button>
            <button
              type="button"
              onClick={() => setIsAnnual(true)}
              className={`font-satoshi flex cursor-pointer items-center gap-2 rounded-full px-5 py-2 text-xs font-medium transition-all ${
                isAnnual
                  ? "bg-white text-[var(--dark-bg)]"
                  : "text-[var(--text-muted-grey)] hover:text-white"
              }`}
            >
              Yearly
              <span className="rounded-full border border-white/20 bg-white/10 px-2 py-0.5 text-[10px] font-bold text-white/90 uppercase">
                20% OFF
              </span>
            </button>
          </div>
        </RevealOnScroll>

        <div className="grid grid-cols-1 items-stretch gap-8 md:grid-cols-3">
          <RevealOnScroll className="flex">
            <div className="dark-surface-card flex w-full flex-col justify-between rounded-[40px] p-8 transition-all duration-300 hover:border-white/20">
              <div>
                <h3 className="font-instrument mb-2 text-[28px] font-normal text-white">
                  Free Companion
                </h3>
                <p className="font-satoshi mb-6 text-xs text-[var(--text-muted-grey)]">
                  Essential tools for daily journaling and AI reflection.
                </p>

                <div className="mb-8">
                  <span className="font-instrument text-[48px] font-normal text-white">
                    $0
                  </span>
                  <span className="font-satoshi ml-2 text-xs text-[var(--text-muted-grey)]">
                    / forever
                  </span>
                </div>

                <ul className="font-satoshi mb-8 space-y-4 text-sm text-white/80">
                  <li className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-[18px] text-[var(--accent-neon)]">
                      check_circle
                    </span>
                    Unlimited text entries
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-[18px] text-[var(--accent-neon)]">
                      check_circle
                    </span>
                    Basic mood tracking
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-[18px] text-[var(--accent-neon)]">
                      check_circle
                    </span>
                    Standard AI chat assistance
                  </li>
                  <li className="flex items-center gap-3 text-[var(--text-muted-grey)]">
                    <span className="material-symbols-outlined text-[18px] text-white/20">
                      remove
                    </span>
                    Voice conversations
                  </li>
                </ul>
              </div>

              <Link href="/sign-up">
                <button
                  type="button"
                  className="glass-btn font-satoshi w-full cursor-pointer rounded-full py-3.5 text-xs font-semibold tracking-wider uppercase"
                >
                  Get Started Free
                </button>
              </Link>
            </div>
          </RevealOnScroll>

          <RevealOnScroll className="flex">
            <div className="dark-gradient-card relative flex w-full transform flex-col justify-between rounded-[40px] border-2 border-[var(--accent-neon)]/50 p-8 shadow-[0_0_40px_rgba(232,255,156,0.15)] md:-translate-y-2">
              <div className="font-satoshi absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-[var(--accent-neon)] px-4 py-1 text-[10px] font-bold tracking-widest text-[var(--dark-bg)] uppercase shadow-md">
                Most Popular
              </div>

              <div>
                <h3 className="font-instrument mb-2 text-[28px] font-normal text-white">
                  Comrade Pro
                </h3>
                <p className="font-satoshi mb-6 text-xs text-[var(--text-muted-grey)]">
                  Full suite of empathetic voice, memory graph, & insights.
                </p>

                <div className="mb-8">
                  <span className="font-instrument text-[48px] font-normal text-white">
                    ${isAnnual ? "12" : "15"}
                  </span>
                  <span className="font-satoshi ml-2 text-xs text-[var(--text-muted-grey)]">
                    / month
                  </span>
                </div>

                <ul className="font-satoshi mb-8 space-y-4 text-sm text-white">
                  <li className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-[18px] text-[var(--accent-neon)]">
                      check_circle
                    </span>
                    Everything in Free
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-[18px] text-[var(--accent-neon)]">
                      check_circle
                    </span>
                    Unlimited Voice mode conversations
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-[18px] text-[var(--accent-neon)]">
                      check_circle
                    </span>
                    ComradeMind memory graph visualization
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-[18px] text-[var(--accent-neon)]">
                      check_circle
                    </span>
                    Deep emotional cartography trends
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-[18px] text-[var(--accent-neon)]">
                      check_circle
                    </span>
                    Priority response times & encryption
                  </li>
                </ul>
              </div>

              <Link href="/sign-up">
                <button
                  type="button"
                  className="neon-btn font-satoshi w-full cursor-pointer rounded-full py-3.5 text-xs font-semibold tracking-wider uppercase"
                >
                  Start Pro Trial
                </button>
              </Link>
            </div>
          </RevealOnScroll>

          <RevealOnScroll className="flex">
            <div className="dark-surface-card flex w-full flex-col justify-between rounded-[40px] p-8 transition-all duration-300 hover:border-white/20">
              <div>
                <h3 className="font-instrument mb-2 text-[28px] font-normal text-white">
                  Sanctuary
                </h3>
                <p className="font-satoshi mb-6 text-xs text-[var(--text-muted-grey)]">
                  Dedicated private cloud deployment & custom AI models.
                </p>

                <div className="mb-8">
                  <span className="font-instrument text-[48px] font-normal text-white">
                    Custom
                  </span>
                </div>

                <ul className="font-satoshi mb-8 space-y-4 text-sm text-white/80">
                  <li className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-[18px] text-[var(--accent-neon)]">
                      check_circle
                    </span>
                    Zero-retention private server
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-[18px] text-[var(--accent-neon)]">
                      check_circle
                    </span>
                    Custom fine-tuned therapy assistance
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-[18px] text-[var(--accent-neon)]">
                      check_circle
                    </span>
                    Dedicated 24/7 support line
                  </li>
                </ul>
              </div>

              <Link href="mailto:support@comrade.ai">
                <button
                  type="button"
                  className="glass-btn font-satoshi w-full cursor-pointer rounded-full py-3.5 text-xs font-semibold tracking-wider uppercase"
                >
                  Contact Sales
                </button>
              </Link>
            </div>
          </RevealOnScroll>
        </div>
      </div>
    </section>
  );
}
