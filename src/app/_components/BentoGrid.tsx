"use client";

import Image from "next/image";
import Link from "next/link";

export default function BentoGrid() {
  return (
    <section id="features" className="px-margin-mobile tablet:px-margin-desktop py-xl bg-surface-container-low/50">
      <div className="max-w-[1440px] mx-auto">
        <div className="mb-lg">
          <h2 className="font-display-md text-display-md mb-xs text-primary">Core Pillars</h2>
          <p className="font-body-md text-secondary">Advanced AI, human-centric design.</p>
        </div>
        <div className="grid grid-cols-1 tablet:grid-cols-12 gap-md auto-rows-[320px]">
          {/* Intelligent Journaling */}
          <div className="tablet:col-span-8 glass-card p-md rounded-xl flex flex-col justify-between overflow-hidden relative group">
            <div className="relative z-10">
              <span className="material-symbols-outlined text-primary text-[32px] mb-base">book_5</span>
              <h3 className="font-headline-lg text-headline-lg mb-base">Intelligent Journaling</h3>
              <p className="font-body-md text-secondary max-w-md">
                Beyond text on a screen. Comrade analyzes your emotional patterns over time, helping you uncover insights into your daily well-being through guided reflection.
              </p>
            </div>
            <div className="absolute bottom-0 right-0 w-1/2 h-full opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none">
              <Image
                className="w-full h-full object-cover"
                alt="Abstract visualization of a digital diary"
                width={100}
                height={100}
                src={"/images/intelligent-journaling.png"}
              />
            </div>
            <Link href="/write" className="relative z-10 self-start font-label-md text-primary mt-md flex items-center gap-xs hover:underline">
              Learn more <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </Link>
          </div>

          {/* Voice / Hold */}
          <Link href="/talk" className="tablet:col-span-4 bg-primary text-on-primary p-md rounded-xl flex flex-col items-center justify-center text-center shadow-md hover:scale-[1.01] transition-transform cursor-pointer">
            <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center mb-md animate-pulse">
              <span className="material-symbols-outlined text-[48px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                mic
              </span>
            </div>
            <h3 className="font-headline-lg text-headline-lg mb-xs text-on-primary">Hold to Speak</h3>
            <p className="font-body-md opacity-80 mb-md text-on-primary">
              Natural voice conversations that feel like talking to a real friend.
            </p>
            <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
              <div className="h-full bg-white w-1/3 animate-[shimmer_2s_infinite]"></div>
            </div>
          </Link>

          {/* AskComrade */}
          <Link href="/chat" className="tablet:col-span-4 glass-card p-md rounded-xl flex flex-col justify-end hover:scale-[1.01] transition-transform cursor-pointer">
            <span className="material-symbols-outlined text-primary text-[32px] mb-base">chat_bubble</span>
            <h3 className="font-headline-lg text-headline-lg mb-base">AskComrade</h3>
            <p className="font-body-md text-secondary">
              Real-time empathetic support whenever you need a sounding board or a quiet moment of clarity.
            </p>
          </Link>

          {/* Emotional Insights */}
          <Link href="/mind" className="tablet:col-span-8 glass-card p-md rounded-xl flex flex-col tablet:flex-row items-center gap-md hover:scale-[1.01] transition-transform cursor-pointer">
            <div className="flex-1">
              <h3 className="font-headline-lg text-headline-lg mb-base">Emotional Cartography</h3>
              <p className="font-body-md text-secondary">
                Visualize your internal landscape. See how your moods shift across weeks and months with beautiful, data-driven visualizations.
              </p>
            </div>
            <div className="w-1/3 aspect-video bg-surface-container rounded-lg overflow-hidden border border-outline-variant/30 shrink-0">
              <img
                className="w-full h-full object-cover"
                alt="Emotional trends chart visualization"
                src="/images/emotional-cartography .jpg"
              />
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
