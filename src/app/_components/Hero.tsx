"use client";

import Link from "next/link";
import { CaretDown } from "@phosphor-icons/react";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col justify-center items-center overflow-hidden bg-background px-margin-mobile tablet:px-margin-desktop py-xl">
      {/* Premium Mesh Gradient Background */}
      <div className="absolute inset-0 z-0 bg-background overflow-hidden">
        {/* Top-Right Peach Glow */}
        <div className="absolute -top-[20%] -right-[10%] w-[70vw] h-[70vw] max-w-[800px] max-h-[800px] rounded-full bg-[#fbe7e1] opacity-70 blur-[120px]"></div>
        
        {/* Bottom-Left Lavender Glow */}
        <div className="absolute -bottom-[20%] -left-[10%] w-[60vw] h-[60vw] max-w-[700px] max-h-[700px] rounded-full bg-[#ecdfe9] opacity-50 blur-[140px]"></div>
        
        {/* Center-Left Warm Gold Glow */}
        <div className="absolute top-[20%] left-[-20%] w-[50vw] h-[50vw] max-w-[600px] max-h-[600px] rounded-full bg-[#fdf6e2] opacity-60 blur-[100px]"></div>
      </div>
      
      {/* Integrated Content Container */}
      <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center text-center animate-fade-in gap-6">
        <span className="inline-block px-4 py-1.5 bg-primary/5 text-primary text-[10px] tracking-[0.15em] font-body font-semibold rounded-full uppercase">
          YOUR EMPATHETIC ARCHIVE
        </span>
        
        <h1 className="font-display-lg text-[44px] sm:text-[56px] md:text-[64px] leading-tight mb-2 text-balance text-on-background font-normal max-w-3xl">
          The friend who <span className="text-primary italic">listens</span>,<br />understands, and <span className="text-primary">remembers</span>.
        </h1>
        
        <p className="font-body-lg text-on-surface-variant mb-6 text-balance max-w-2xl leading-relaxed">
          A safe harbor for your thoughts. Comrade AI bridges the gap between digital convenience and human warmth, preserving your growth in a tactile, intelligent journal.
        </p>
        
        <div className="flex flex-wrap gap-4 justify-center">
          <Link href="/write">
            <button type="button" className="bg-primary text-on-primary px-8 py-3.5 rounded-2xl text-sm font-body font-semibold shadow-lg shadow-primary/20 hover:scale-105 transition-transform active:scale-95 cursor-pointer">
              Start your journey
            </button>
          </Link>
          <Link href="#features">
            <button type="button" className="bg-transparent border border-outline-variant/60 text-on-surface px-8 py-3.5 rounded-2xl text-sm font-body font-medium hover:bg-surface-container-high transition-colors active:scale-95 cursor-pointer">
              Watch how it feels
            </button>
          </Link>
        </div>
      </div>

      {/* Scroll indicator */}
      <Link href="#features" className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 z-10 text-secondary hover:text-primary transition-colors cursor-pointer group">
        <span className="text-[10px] tracking-[0.2em] font-body font-semibold opacity-80 group-hover:opacity-100 transition-opacity">EXPLORE</span>
        <CaretDown size={14} className="animate-bounce" />
      </Link>
    </section>
  );
}
