"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import RevealOnScroll from "./RevealOnScroll";

const PROMPTS = [
  "worked through ideas...",
  "found unexpected clarity...",
  "felt deeply focused...",
];

export default function BentoGrid() {
  const [promptIndex, setPromptIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPromptIndex((prev) => (prev + 1) % PROMPTS.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      id="features"
      className="tablet:px-8 bg-[var(--dark-bg)] px-4 py-24"
    >
      <div className="section-wrapper">
        <RevealOnScroll className="section-header">
          <div className="pill-badge">
            <span>Introducing Comrade</span>
          </div>

          <h2 className="heading-h2 max-w-[580px]">
            Journal, Chat,{" "}
            <span className="text-[var(--text-muted-grey)]">
              and talk to your best friend.
            </span>
          </h2>
        </RevealOnScroll>

        <div className="tablet:grid-cols-12 grid auto-rows-[360px] grid-cols-1 gap-6">
          <RevealOnScroll className="tablet:col-span-5 flex">
            <Link
              href="/write"
              className="dark-gradient-card group relative flex w-full cursor-pointer flex-col justify-between overflow-hidden rounded-[40px] p-8 shadow-xl transition-all duration-300 hover:border-[var(--border-hover)]"
            >
              <div>
                <h3 className="font-satoshi mb-2 text-[22px] font-medium tracking-tight text-[var(--text-pure-white)]">
                  Intelligent Journaling
                </h3>
                <p className="font-satoshi max-w-xs text-[14px] leading-relaxed text-[var(--text-muted-grey)]">
                  Beyond text on a screen. Comrade analyzes your emotional
                  patterns over time.
                </p>
              </div>

              <div className="mt-8 w-full max-w-[280px] self-center">
                <div className="flex items-center justify-between rounded-full bg-white px-5 py-3 shadow-2xl transition-transform duration-300 group-hover:scale-[1.02]">
                  <div className="font-satoshi flex items-center gap-2 text-sm font-medium text-black/80">
                    <svg
                      className="h-4 w-4 shrink-0 text-black/60"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        d="M12 3v3m0 12v3M3 12h3m12 0h3m-3.5-6.5l-2.1 2.1m-8.8 8.8l-2.1 2.1m0-13l2.1 2.1m8.8 8.8l2.1 2.1"
                        strokeLinecap="round"
                      />
                    </svg>
                    <span className="text-black/50">Today</span>
                    <span className="text-black transition-all duration-300">
                      {PROMPTS[promptIndex]}
                    </span>
                    <span className="ml-0.5 animate-pulse font-semibold text-black">
                      |
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </RevealOnScroll>

          <RevealOnScroll className="tablet:col-span-7 flex">
            <Link
              href="/mind"
              className="dark-gradient-card group relative flex w-full cursor-pointer flex-col justify-between overflow-hidden rounded-[40px] p-8 shadow-xl transition-all duration-300 hover:border-[var(--border-hover)]"
            >
              <div>
                <h3 className="font-satoshi mb-2 text-[22px] font-medium tracking-tight text-[var(--text-pure-white)]">
                  Emotional Cartography
                </h3>
                <p className="font-satoshi max-w-sm text-[14px] leading-relaxed text-[var(--text-muted-grey)]">
                  Visualize your internal landscape. See how your moods shift
                  across weeks and months with beautiful, data-driven
                  visualizations.
                </p>
              </div>

              <div className="relative flex h-44 w-full items-end justify-end overflow-hidden pr-4 pb-2">
                <div className="absolute right-28 -bottom-4 h-48 w-36 -rotate-8 transform overflow-hidden rounded-2xl border border-white/15 bg-[#161616] shadow-2xl transition-transform duration-500 group-hover:-rotate-12">
                  <Image
                    src="https://framerusercontent.com/images/aX7MTNtljvKLZgoAQcYqRLk9iSs.png"
                    alt="Cartography preview 1"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="absolute right-14 -bottom-4 z-10 h-48 w-36 rotate-0 transform overflow-hidden rounded-2xl border border-white/15 bg-[#161616] shadow-2xl transition-transform duration-500 group-hover:-translate-y-1">
                  <Image
                    src="https://framerusercontent.com/images/WiXK9IxjSYae5vhRgnPTaFtm6M.png"
                    alt="Cartography preview 2"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="absolute right-0 -bottom-4 z-20 h-48 w-36 rotate-6 transform overflow-hidden rounded-2xl border border-white/15 bg-[#161616] shadow-2xl transition-transform duration-500 group-hover:rotate-8">
                  <Image
                    src="https://framerusercontent.com/images/fF3Mc4fgVZTZxt8trElosIucYU.png"
                    alt="Cartography preview 3"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </Link>
          </RevealOnScroll>

          <RevealOnScroll className="tablet:col-span-4 flex">
            <Link
              href="/chat"
              className="dark-gradient-card group relative flex w-full cursor-pointer flex-col justify-between overflow-hidden rounded-[40px] p-8 shadow-xl transition-all duration-300 hover:border-[var(--border-hover)]"
            >
              <div>
                <h3 className="font-satoshi mb-2 text-[22px] font-medium tracking-tight text-[var(--text-pure-white)]">
                  Ask Comrade
                </h3>
                <p className="font-satoshi text-[14px] leading-relaxed text-[var(--text-muted-grey)]">
                  Empathetic support whenever you need a sounding board moment
                  of clarity.
                </p>
              </div>

              <div className="absolute right-0 bottom-0 h-32 w-44 overflow-hidden rounded-tl-3xl border-t border-l border-white/10">
                <Image
                  src="https://framerusercontent.com/images/imfcpiKB8yuozI4ETpHn68JuY.png"
                  alt="Autumn landscape tree framing"
                  fill
                  className="transition-scale object-cover object-right-top duration-500 group-hover:scale-105"
                />
              </div>
            </Link>
          </RevealOnScroll>

          <RevealOnScroll className="tablet:col-span-4 flex">
            <Link
              href="/talk"
              className="dark-gradient-card group relative flex w-full cursor-pointer flex-col justify-between overflow-hidden rounded-[40px] p-8 shadow-xl transition-all duration-300 hover:border-[var(--border-hover)]"
            >
              <div>
                <h3 className="font-satoshi mb-2 text-[22px] font-medium tracking-tight text-[var(--text-pure-white)]">
                  Hold to Speak
                </h3>
                <p className="font-satoshi text-[14px] leading-relaxed text-[var(--text-muted-grey)]">
                  Natural voice conversations that feel like talking to a real
                  friend.
                </p>
              </div>

              <div className="flex h-16 items-end justify-end gap-1.5 pt-4 pr-2">
                <span className="h-5 w-1 animate-pulse rounded-full bg-white/40"></span>
                <span className="h-9 w-1 animate-pulse rounded-full bg-white/60 delay-75"></span>
                <span className="h-14 w-1 animate-pulse rounded-full bg-white/90 delay-150"></span>
                <span className="h-10 w-1 animate-pulse rounded-full bg-white/70 delay-200"></span>
                <span className="h-16 w-1 animate-pulse rounded-full bg-white/90 delay-300"></span>
                <span className="h-7 w-1 animate-pulse rounded-full bg-white/50"></span>
                <span className="h-4 w-1 animate-pulse rounded-full bg-white/30"></span>
              </div>
            </Link>
          </RevealOnScroll>

          <RevealOnScroll className="tablet:col-span-4 flex">
            <div className="dark-gradient-card group relative flex w-full flex-col justify-between overflow-hidden rounded-[40px] p-8 shadow-xl transition-all duration-300 hover:border-[var(--border-hover)]">
              <div>
                <h3 className="font-satoshi mb-2 text-[22px] font-medium tracking-tight text-[var(--text-pure-white)]">
                  Keyframe Control
                </h3>
                <p className="font-satoshi text-[14px] leading-relaxed text-[var(--text-muted-grey)]">
                  Guide scenes with reference frames, camera cues, pacing, and
                  visual direction.
                </p>
              </div>

              <div className="relative flex h-28 w-full items-end justify-end pr-2 pb-2">
                <div className="flex h-24 w-24 -rotate-6 transform flex-col items-center justify-center gap-1 rounded-2xl border border-white/15 bg-white/10 shadow-lg backdrop-blur-md transition-transform group-hover:-rotate-8">
                  <span className="text-lg font-bold text-white">+</span>
                  <span className="font-satoshi text-[10px] font-semibold tracking-wider text-white/80 uppercase">
                    START FRAME
                  </span>
                </div>
                <div className="-ml-6 flex h-24 w-24 rotate-3 transform flex-col items-center justify-center gap-1 rounded-2xl border border-white/20 bg-white/15 shadow-xl backdrop-blur-md transition-transform group-hover:rotate-6">
                  <span className="text-lg font-bold text-white">+</span>
                  <span className="font-satoshi text-[10px] font-semibold tracking-wider text-white/80 uppercase">
                    END FRAME
                  </span>
                </div>
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </div>
    </section>
  );
}
