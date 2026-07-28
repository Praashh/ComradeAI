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

  const headingWords = [
    "The",
    "friend",
    "who",
    "listens,",
    "understands,",
    "and",
    "remembers.",
  ];
  const subtitleText =
    "A safe harbor for your thoughts - an intelligent journal that feels human.";

  return (
    <header
      className="relative flex h-screen w-full flex-col items-center justify-start overflow-hidden bg-black"
      id="hero"
    >
      {/* Background image with mask fade */}
      <div
        className="absolute inset-0 z-0 h-full w-full overflow-hidden"
        style={{
          WebkitMask: "linear-gradient(#000 52%, #0000 100%)",
          mask: "linear-gradient(#000 52%, #0000 100%)",
        }}
      >
        <div
          className="h-full w-full"
          style={{ willChange: "transform", transform: "scale(1.05)" }}
        >
          <Image
            src="/images/hero-bg.png"
            alt="Scenic dusk mountain and lake background"
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />
        </div>
      </div>

      {/* Content */}
      <div
        className="relative z-10 mx-auto flex w-full max-w-[560px] flex-col items-center gap-8 px-4 text-center"
        style={{ paddingTop: "160px" }}
      >
        {/* Text group */}
        <div className="flex w-full flex-col items-center gap-4">
          {/* Heading - word-by-word reveal */}
          <h1
            ref={headingRef}
            className="font-instrument w-full text-center text-[40px] leading-[1em] font-normal tracking-[-0.03em] text-white sm:text-[56px] md:text-[58px]"
            style={{ fontStyle: "italic" }}
          >
            {headingWords.map((word, i) => (
              <span
                key={i}
                className="hero-word inline-block"
                style={{
                  opacity: 0.001,
                  filter: "blur(4px)",
                  transform: "translateY(12px)",
                }}
              >
                {word}
                {i < headingWords.length - 1 ? "\u00A0" : ""}
              </span>
            ))}
          </h1>

          {/* Subtitle - character reveal */}
          <p
            ref={subtitleRef}
            className="font-satoshi max-w-[350px] text-center text-[14px] leading-[1.3em] font-normal text-white sm:text-[15px]"
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

        {/* CTA Button — neon lime green matching reference */}
        <div
          ref={ctaRef}
          style={{ opacity: 0.001, transform: "translateY(24px)" }}
        >
          <Link href="/sign-up">
            <button
              type="button"
              className="neon-btn font-satoshi cursor-pointer rounded-full px-7 py-3 text-[14px] font-medium tracking-normal transition-all duration-200 active:scale-95"
            >
              Start your journey
            </button>
          </Link>
        </div>
      </div>
    </header>
  );
}
