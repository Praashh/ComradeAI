"use client";

import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Full-bleed Atmospheric Background */}
      <div className="absolute inset-0 z-0">
        <img
          alt="Serene Digital Sanctuary background"
          className="w-full h-full object-cover"
          src="/images/hero-bg.jpg"
        />
        {/* Gradient overlay for text legibility on the left */}
        <div className="absolute inset-0 bg-gradient-to-r from-surface/60 via-surface/20 to-transparent"></div>
      </div>
      
      {/* Integrated Content Container */}
      <div className="relative z-10 w-full max-w-[1440px] mx-auto px-margin-mobile tablet:px-margin-desktop">
        <div className="max-w-2xl animate-fade-in">
          <span className="inline-block px-md py-xs bg-primary/10 text-primary font-label-md rounded-full mb-md">
            WELCOME HOME
          </span>
          <h1 className="font-display-lg text-display-lg tablet:text-[64px] leading-tight mb-md text-balance text-on-background">
            The friend who <span className="text-primary italic font-display-lg">listens</span>, understands, and <span className="text-primary font-display-lg">remembers</span>.
          </h1>
          <p className="font-body-lg text-on-surface-variant mb-lg text-balance max-w-xl">
            Comrade AI is your empathetic digital companion. Designed for digital well-being, it bridges the gap between technology and true human understanding through reflective journaling and voice-first interaction.
          </p>
          <div className="flex flex-wrap gap-md">
            <Link href="/write">
              <button className="bg-primary text-on-primary px-xl py-md rounded-full font-title-md shadow-lg shadow-primary/20 hover:scale-105 transition-transform active:scale-95 cursor-pointer">
                Start Your Journey
              </button>
            </Link>
            <Link href="#features">
              <button className="bg-surface-container-highest/50 backdrop-blur-md px-xl py-md rounded-full font-title-md border border-outline-variant/30 hover:bg-surface-container-highest transition-colors active:scale-95 cursor-pointer">
                Watch How it Works
              </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
