"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full py-xl bg-surface border-t border-outline-variant/30">
      <div className="flex flex-col items-center justify-center gap-md px-margin-mobile tablet:px-margin-desktop max-w-[1440px] mx-auto">
        <div className="font-display-lg text-display-lg text-primary">Comrade AI</div>
        
        <div className="flex gap-lg flex-wrap justify-center">
          <Link href="#" className="text-secondary hover:text-primary transition-all font-label-md">
            About
          </Link>
          <Link href="#" className="text-secondary hover:text-primary transition-all font-label-md">
            Terms
          </Link>
          <Link href="#" className="text-secondary hover:text-primary transition-all font-label-md">
            Journaling Guide
          </Link>
        </div>
        
        <div className="flex gap-md my-sm">
          <Link
            href="#"
            className="w-10 h-10 rounded-full border border-outline-variant/30 flex items-center justify-center text-secondary hover:text-primary transition-colors"
          >
            <span className="material-symbols-outlined">alternate_email</span>
          </Link>
          <Link
            href="#"
            className="w-10 h-10 rounded-full border border-outline-variant/30 flex items-center justify-center text-secondary hover:text-primary transition-colors"
          >
            <span className="material-symbols-outlined">public</span>
          </Link>
        </div>
        
        <p className="font-label-md text-label-md text-on-secondary-container">
          © 2026 Comrade AI. Built for Digital Well-being.
        </p>
      </div>
    </footer>
  );
}
