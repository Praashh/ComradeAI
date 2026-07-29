"use client";

import Image from "next/image";
import RevealOnScroll from "./RevealOnScroll";

const STEPS = [
  {
    title: "Describe the scene",
    description:
      "Write the image or video you want, then add details for style, mood, subject, and format.",
    mockup: "https://framerusercontent.com/images/w4nhLCDnIfIm3D5Tl6LRUhOClr0.png",
    alt: "Prompt Editor panel mockup",
  },
  {
    title: "Refine the direction",
    description:
      "Adjust style, aspect ratio, motion, references, or keyframes until the output matches your vision.",
    mockup: "https://framerusercontent.com/images/FuJFf3VwASR51eL7KMNGCb5xFAQ.png",
    alt: "Style & Motion controls mockup",
  },
  {
    title: "Export and publish",
    description:
      "Download polished visuals for ads, social content, product pages, storyboards, and campaigns.",
    mockup: "https://framerusercontent.com/images/DW2J0oQA57NXRuKQWnEAyt2wrxs.png",
    alt: "Export & Publish panel mockup",
  },
];

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="tablet:px-8 border-t border-white/5 bg-[var(--dark-bg)] px-4 py-24"
    >
      <div className="section-wrapper">
        <RevealOnScroll className="section-header mb-16">
          <div className="pill-badge">
            <span>How It Works</span>
          </div>

          <h2 className="font-instrument w-full max-w-[620px] text-center text-[36px] leading-[1.15] font-normal text-white sm:text-[48px] md:text-[54px]">
            <span className="text-[var(--text-muted-grey)]">From </span>
            prompt to finished{" "}
            <span className="text-[var(--text-muted-grey)]">
              visual in three simple steps.
            </span>
          </h2>
        </RevealOnScroll>

        <div className="grid grid-cols-1 items-stretch gap-6 md:grid-cols-3">
          {STEPS.map((step, idx) => (
            <RevealOnScroll key={idx} className="flex">
              <div className="dark-gradient-card group relative flex w-full flex-col justify-between overflow-hidden rounded-[32px] p-6 shadow-xl transition-all duration-300 hover:border-white/30">
                {/* Mountain Landscape Background + Panel UI Mockup */}
                <div className="relative mb-6 h-[320px] w-full overflow-hidden rounded-[24px] border border-white/10">
                  {/* Dark Sunset Mountain Background */}
                  <Image
                    src="https://framerusercontent.com/images/fQRil4z1ZxGKGZ6GCGKGBMBWEdo.png"
                    alt="Mountain landscape background"
                    fill
                    className="object-cover object-center"
                  />
                  {/* Floating Mockup Panel Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center p-3">
                    <div className="relative h-full w-full">
                      <Image
                        src={step.mockup}
                        alt={step.alt}
                        fill
                        className="object-contain transition-transform duration-500 group-hover:scale-[1.02]"
                      />
                    </div>
                  </div>
                </div>

                {/* Text Content */}
                <div className="px-2 pb-2">
                  <h3 className="font-satoshi mb-2 text-[20px] font-medium tracking-tight text-white">
                    {step.title}
                  </h3>
                  <p className="font-satoshi text-[14px] leading-relaxed text-white/60">
                    {step.description}
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
