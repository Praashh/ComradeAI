"use client";

import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import RevealOnScroll from "./RevealOnScroll";

export default function CTA() {
  const { isSignedIn } = useAuth();
  const destination = isSignedIn ? "/write" : "/sign-up";

  return (
    <section id="cta" className="tablet:px-8 bg-[var(--dark-bg)] px-4 py-24">
      <div className="section-wrapper">
        <RevealOnScroll>
          <div className="group relative flex min-h-[380px] w-full flex-col justify-center overflow-hidden rounded-[36px] border border-white/12 p-8 shadow-2xl sm:min-h-[420px] sm:p-12 md:p-16">
            {/* Background Image: Lake & Autumn Red Tree Sunset Landscape */}
            <Image
              src="/images/cta.png"
              alt="ComradeAI landscape CTA background"
              fill
              className="object-cover object-right-bottom transition-transform duration-700 group-hover:scale-[1.02]"
            />

            {/* Dark Sky Gradient Overlay for High Text Readability */}
            <div className="absolute inset-0 z-10 bg-gradient-to-r from-[#0a0a0a]/90 via-[#0a0a0a]/65 to-transparent sm:w-3/4" />

            {/* CTA Foreground Content */}
            <div className="relative z-20 max-w-md">
              <h2 className="font-instrument text-[36px] font-normal leading-[1.12] text-white sm:text-[46px] md:text-[52px]">
                Start your journey with <br />
                Comrade AI today
              </h2>

              <p className="font-satoshi mt-4 mb-8 max-w-sm text-[14px] leading-relaxed text-white/70 sm:text-[15px]">
                Journal your thoughts, chat through your feelings, or talk it
                out — your AI companion is always here for you.
              </p>

              <Link href={destination}>
                <button
                  type="button"
                  className="font-satoshi cursor-pointer rounded-full bg-white px-7 py-3 text-[14px] font-semibold text-black shadow-xl transition-all hover:bg-white/90 active:scale-95"
                >
                  Try Now
                </button>
              </Link>
            </div>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}

