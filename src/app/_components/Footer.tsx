"use client";

import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer
      id="footer"
      className="w-full border-t border-white/10 bg-[var(--dark-bg)] py-16"
    >
      <div className="mx-auto flex max-w-[1200px] flex-col items-start justify-between gap-12 px-6 sm:px-12 md:flex-row">
        {/* Left Side: Brand Logo, Tagline, Socials, Credit */}
        <div className="flex flex-col items-start text-left">
          <Link
            href="/"
            className="flex items-center gap-2 text-white transition-opacity hover:opacity-90"
          >
            <svg
              className="h-6 w-6 text-white"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M 0 0 L 0 6"
                fill="transparent"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                stroke="currentColor"
                transform="translate(4.5 9)"
              />
              <path
                d="M 0 0 L 0 18"
                fill="transparent"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                stroke="currentColor"
                transform="translate(8.25 3)"
              />
              <path
                d="M 0 0 L 0 12"
                fill="transparent"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                stroke="currentColor"
                transform="translate(12 6)"
              />
              <path
                d="M 0 0 L 0 6"
                fill="transparent"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                stroke="currentColor"
                transform="translate(15.75 9)"
              />
              <path
                d="M 0 0 L 0 9"
                fill="transparent"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                stroke="currentColor"
                transform="translate(19.5 7.5)"
              />
            </svg>
            <span className="font-instrument text-[24px] leading-none font-normal tracking-[0.01em] text-white">
              ComradeAI
            </span>
          </Link>

          <p className="font-satoshi mt-3 mb-6 max-w-xs text-[14px] leading-relaxed text-white/50">
            AI image and video generation for campaigns, product stories, ads,
            and social content.
          </p>

          {/* Social Icons */}
          <div className="flex items-center gap-3">
            <Link
              href="https://x.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="X Twitter"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white/80 transition-all hover:border-white/20 hover:text-white"
            >
              <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </Link>
            <Link
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white/80 transition-all hover:border-white/20 hover:text-white"
            >
              <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.25V10.9H6.46M7.86 6.7a1.6 1.6 0 1 0 1.6 1.6 1.6 1.6 0 0 0-1.6-1.6z" />
              </svg>
            </Link>
          </div>

          {/* Created by */}
          <div className="mt-8 flex items-center gap-2 font-satoshi text-[13px] text-white/60">
            <span>Built with love by</span>
            <div className="relative h-6 w-6 overflow-hidden rounded-full border border-white/20">
              <Image
                src="/myy.jpeg"
                alt="praash avatar"
                fill
                className="object-cover"
              />
            </div>
            <Link
              href="https://x.com/10xpraash"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-white transition-colors hover:text-white/80"
            >
              Praash
            </Link>
          </div>
        </div>

        {/* Right Side: Navigation Links */}
        <div className="flex flex-col text-left">
          <h4 className="font-satoshi mb-4 text-[14px] font-medium text-white">
            Navigation
          </h4>
          <div className="font-satoshi space-y-2.5 text-[14px] text-white/60">
            <Link
              href="#features"
              className="block transition-colors hover:text-white"
            >
              Features
            </Link>
            <Link
              href="#how-it-works"
              className="block transition-colors hover:text-white"
            >
              Use Cases
            </Link>
            <Link
              href="#testimonials"
              className="block transition-colors hover:text-white"
            >
              Testimonials
            </Link>
            <Link
              href="#pricing"
              className="block transition-colors hover:text-white"
            >
              Pricing
            </Link>
            <Link
              href="#faq"
              className="block transition-colors hover:text-white"
            >
              FAQ
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

