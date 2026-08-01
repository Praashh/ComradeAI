"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import RevealOnScroll from "./RevealOnScroll";
import {MagicWandIcon} from "@phosphor-icons/react";

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

          <h2 className="font-instrument w-full max-w-[620px] text-center text-[36px] leading-[1.15] font-normal text-white sm:text-[48px] md:text-[54px]">
            Journal, Chat,{" "}
            <span className="text-[var(--text-muted-grey)]">
              and talk to your best friend.
            </span>
          </h2>
        </RevealOnScroll>

        <div className="tablet:grid-cols-12 grid auto-rows-[340px] grid-cols-1 gap-6">
          {/* Card 1: Intelligent Journaling */}
          <RevealOnScroll className="tablet:col-span-5 flex">
            <div
              className="dark-gradient-card group relative flex w-full cursor-pointer flex-col justify-between overflow-hidden rounded-[32px] p-8 shadow-xl transition-all duration-300 hover:border-white/30"
            >
              <div>
                <h3 className="font-satoshi mb-2 text-[22px] font-medium tracking-tight text-white">
                  Intelligent Journaling
                </h3>
                <p className="font-satoshi max-w-[320px] text-[14px] leading-relaxed text-white/60">
                  Beyond text on a screen. Comrade analyzes your emotional
                  patterns over time.
                </p>
              </div>

              <div className="mt-8 w-full max-w-[300px] self-center">
                <div className="flex items-center justify-between rounded-full bg-white px-5 py-3.5 shadow-2xl transition-transform duration-300 group-hover:scale-[1.02]">
                  <div className="font-satoshi flex items-center gap-2.5 text-sm font-medium text-black/80">
                    <MagicWandIcon size={20} /> 
                    <span className="text-black/50">Today</span>
                    <span className="text-black font-normal transition-all duration-300">
                      {PROMPTS[promptIndex]}
                    </span>
                    <span className="animate-pulse font-semibold text-black">
                      |
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </RevealOnScroll>

          {/* Card 2: Emotional Cartography */}
          <RevealOnScroll className="tablet:col-span-7 flex">
            <div
              className="dark-gradient-card group relative flex w-full cursor-pointer flex-col justify-between overflow-hidden rounded-[32px] p-8 shadow-xl transition-all duration-300 hover:border-white/30"
            >
              <div>
                <h3 className="font-satoshi mb-2 text-[22px] font-medium tracking-tight text-white">
                  Emotional Cartography
                </h3>
                <p className="font-satoshi max-w-[420px] text-[14px] leading-relaxed text-white/60">
                  Visualize your internal landscape. See how your moods shift
                  across weeks and months with beautiful, data-driven
                  visualizations.
                </p>
              </div>

              <div className="relative flex h-44 w-full items-end justify-end overflow-hidden pr-4 pb-0">
                <div className="absolute right-32 -bottom-6 h-52 w-40 -rotate-8 transform overflow-hidden rounded-[20px] border border-white/15 bg-[#161616] shadow-2xl transition-transform duration-500 group-hover:-rotate-12">
                  <Image
                    src="https://framerusercontent.com/images/aX7MTNtljvKLZgoAQcYqRLk9iSs.png"
                    alt="Cartography preview 1"
                    fill
                    className="object-cover object-bottom"
                  />
                </div>
                <div className="absolute right-16 -bottom-6 z-10 h-52 w-40 rotate-0 transform overflow-hidden rounded-[20px] border border-white/15 bg-[#161616] shadow-2xl transition-transform duration-500 group-hover:-translate-y-1">
                  <Image
                    src="https://framerusercontent.com/images/WiXK9IxjSYae5vhRgnPTaFtm6M.png"
                    alt="Cartography preview 2"
                    fill
                    className="object-cover object-bottom"
                  />
                </div>
                <div className="absolute right-0 -bottom-6 z-20 h-52 w-40 rotate-6 transform overflow-hidden rounded-[20px] border border-white/15 bg-[#161616] shadow-2xl transition-transform duration-500 group-hover:rotate-8">
                  <Image
                    src="https://framerusercontent.com/images/fF3Mc4fgVZTZxt8trElosIucYU.png"
                    alt="Cartography preview 3"
                    fill
                    className="object-cover object-bottom"
                  />
                </div>
              </div>
            </div>
          </RevealOnScroll>

          {/* Card 3: Ask Comrade */}
          <RevealOnScroll className="tablet:col-span-4 flex">
            <div
              className="dark-gradient-card group relative flex w-full cursor-pointer flex-col justify-between overflow-hidden rounded-[32px] p-8 shadow-xl transition-all duration-300 hover:border-white/30"
            >
              <div>
                <h3 className="font-satoshi mb-2 text-[22px] font-medium tracking-tight text-white">
                  Ask Comrade
                </h3>
                <p className="font-satoshi max-w-[220px] text-[14px] leading-relaxed text-white/60">
                  Empathetic support whenever you need a sounding board moment
                  of clarity.
                </p>
              </div>

              <div className="absolute right-0 bottom-0 h-36 w-48 overflow-hidden rounded-tl-3xl">
                <Image
                  src="https://framerusercontent.com/images/imfcpiKB8yuozI4ETpHn68JuY.png"
                  alt="Autumn landscape tree framing"
                  fill
                  className="object-cover object-right-top transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            </div>
          </RevealOnScroll>

          {/* Card 4: Hold to Speak */}
          <RevealOnScroll className="tablet:col-span-4 flex">
            <div
              className="dark-gradient-card group relative flex w-full cursor-pointer flex-col justify-between overflow-hidden rounded-[32px] p-8 shadow-xl transition-all duration-300 hover:border-white/30"
            >
              <div>
                <h3 className="font-satoshi mb-2 text-[22px] font-medium tracking-tight text-white">
                  Hold to Speak
                </h3>
                <p className="font-satoshi text-[14px] leading-relaxed text-white/60">
                  Natural voice conversations that feel like talking to a real
                  friend.
                </p>
              </div>

              <div className="flex h-20 items-end justify-end gap-1.5 pb-2 pr-4">
                <span className="h-6 w-1.5 animate-pulse rounded-full bg-white/40"></span>
                <span className="h-10 w-1.5 animate-pulse rounded-full bg-white/60 delay-75"></span>
                <span className="h-14 w-1.5 animate-pulse rounded-full bg-white/90 delay-150"></span>
                <span className="h-10 w-1.5 animate-pulse rounded-full bg-white/70 delay-200"></span>
                <span className="h-16 w-1.5 animate-pulse rounded-full bg-white/90 delay-300"></span>
                <span className="h-8 w-1.5 animate-pulse rounded-full bg-white/50"></span>
                <span className="h-5 w-1.5 animate-pulse rounded-full bg-white/30"></span>
              </div>
            </div>
          </RevealOnScroll>

          {/* Card 5: Keyframe Control */}
          <RevealOnScroll className="tablet:col-span-4 flex">
            <div className="dark-gradient-card group relative flex w-full flex-col justify-between overflow-hidden rounded-[32px] p-8 shadow-xl transition-all duration-300 hover:border-white/30">
              <div>
                <h3 className="font-satoshi mb-2 text-[22px] font-medium tracking-tight text-white">
                  Keyframe Control
                </h3>
                <p className="font-satoshi text-[14px] leading-relaxed text-white/60">
                  Guide scenes with reference frames, camera cues, pacing, and
                  visual direction.
                </p>
              </div>

              <div className="relative flex h-32 w-full items-end justify-end pr-2 pb-2">
                <div className="flex h-28 w-28 -rotate-6 transform flex-col items-center justify-center gap-1.5 rounded-2xl border border-white/15 bg-white/10 shadow-lg backdrop-blur-md transition-transform duration-300 group-hover:-rotate-8">
                  <span className="text-xl font-bold text-white">+</span>
                  <span className="font-satoshi text-[10px] font-semibold tracking-wider text-white/80 uppercase">
                    START FRAME
                  </span>
                </div>
                <div className="-ml-8 flex h-28 w-28 rotate-3 transform flex-col items-center justify-center gap-1.5 rounded-2xl border border-white/20 bg-white/15 shadow-xl backdrop-blur-md transition-transform duration-300 group-hover:rotate-6">
                  <span className="text-xl font-bold text-white">+</span>
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

