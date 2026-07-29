"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Word-by-word reveal animation for heading
    if (headingRef.current) {
      const words =
        headingRef.current.querySelectorAll<HTMLSpanElement>(".hero-word");
      words.forEach((word, i) => {
        word.style.transition = `opacity 0.5s ease ${i * 0.08}s, filter 0.5s ease ${i * 0.08}s, transform 0.5s ease ${i * 0.08}s`;
        requestAnimationFrame(() => {
          word.style.opacity = "1";
          word.style.filter = "blur(0px)";
          word.style.transform = "translateY(0px)";
        });
      });
    }

    // Letter-by-letter reveal for subtitle
    if (subtitleRef.current) {
      const chars =
        subtitleRef.current.querySelectorAll<HTMLSpanElement>(".hero-char");
      chars.forEach((char, i) => {
        char.style.transition = `opacity 0.3s ease ${0.5 + i * 0.02}s, filter 0.3s ease ${0.5 + i * 0.02}s, transform 0.3s ease ${0.5 + i * 0.02}s`;
        requestAnimationFrame(() => {
          char.style.opacity = "1";
          char.style.filter = "blur(0px)";
          char.style.transform = "translateY(0px)";
        });
      });
    }

    // CTA fade up
    if (ctaRef.current) {
      ctaRef.current.style.transition =
        "opacity 0.6s ease 1.2s, transform 0.6s ease 1.2s";
      requestAnimationFrame(() => {
        if (ctaRef.current) {
          ctaRef.current.style.opacity = "1";
          ctaRef.current.style.transform = "translateY(0px)";
        }
      });
    }
  }, []);

  const headingLine1 = ["The", "friend", "who", "listens,"];
  const headingLine2 = ["understands,", "and", "remembers."];
  const subtitleText =
    "A safe harbor for your thoughts - an intelligent journal that feels human.";

  return (
    <header
      className="relative flex min-h-screen w-full flex-col items-center justify-start overflow-hidden bg-[#0a0a0a]"
      id="hero"
    >
      {/* Background image with subtle top dark sky fade */}
      <div className="absolute inset-0 z-0 h-full w-full overflow-hidden">
        <div className="relative h-full w-full">
          <Image
            src="/images/hero-bg.png"
            alt="Scenic dusk mountain and lake background"
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />
          {/* Subtle top/bottom dark sky overlay matching reference */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/75 via-transparent to-[#0a0a0a]/80" />
        </div>
      </div>

      {/* Content */}
      <div
        className="relative z-10 mx-auto flex w-full max-w-[680px] flex-col items-center gap-6 px-4 text-center"
        style={{ paddingTop: "170px" }}
      >
        {/* Text group */}
        <div className="flex w-full flex-col items-center gap-4">
          {/* Heading - word-by-word reveal (upright Instrument Serif) */}
          <h1
            ref={headingRef}
            className="font-instrument w-full text-center text-[40px] leading-[1.12] font-normal tracking-[-0.01em] text-white sm:text-[56px] md:text-[62px]"
          >
            <span className="block">
              {headingLine1.map((word, i) => (
                <span
                  key={`l1-${i}`}
                  className="hero-word inline-block"
                  style={{
                    opacity: 0.001,
                    filter: "blur(4px)",
                    transform: "translateY(12px)",
                  }}
                >
                  {word}
                  {i < headingLine1.length - 1 ? "\u00A0" : ""}
                </span>
              ))}
            </span>
            <span className="block">
              {headingLine2.map((word, i) => (
                <span
                  key={`l2-${i}`}
                  className="hero-word inline-block"
                  style={{
                    opacity: 0.001,
                    filter: "blur(4px)",
                    transform: "translateY(12px)",
                  }}
                >
                  {word}
                  {i < headingLine2.length - 1 ? "\u00A0" : ""}
                </span>
              ))}
            </span>
          </h1>

          {/* Subtitle - character reveal */}
          <p
            ref={subtitleRef}
            className="font-satoshi max-w-[440px] text-center text-[14px] leading-[1.45] font-normal text-white/80 sm:text-[15px]"
          >
            {subtitleText.split("").map((char, i) => (
              <span
                key={i}
                className="hero-char inline-block"
                style={{
                  opacity: 0.001,
                  filter: "blur(10px)",
                  transform: "translateY(20px)",
                  whiteSpace: char === " " ? "pre" : undefined,
                }}
              >
                {char === " " ? "\u00A0" : char}
              </span>
            ))}
          </p>
        </div>

        {/* CTA Button — white solid pill button with dark text */}
        <div
          ref={ctaRef}
          className="mt-2"
          style={{ opacity: 0.001, transform: "translateY(24px)" }}
        >
          <Link href="/sign-up">
            <button
              type="button"
              className="font-satoshi cursor-pointer rounded-full bg-white px-7 py-3 text-[14px] font-medium text-[#0a0a0a] shadow-lg transition-all duration-200 hover:bg-white/90 hover:shadow-xl active:scale-95"
            >
              Start your journey
            </button>
          </Link>
        </div>
      </div>
    </header>
  );
}

