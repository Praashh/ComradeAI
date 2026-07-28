"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer
      id="footer"
      className="w-full border-t border-white/10 bg-[var(--dark-bg)] py-12"
    >
      <div className="tablet:px-8 mx-auto flex max-w-5xl flex-col items-center justify-center gap-6 px-4 text-center">
        <Link
          href="/"
          className="flex items-center gap-2 text-white transition-opacity hover:opacity-90"
        >
          <svg className="h-6 w-6 fill-current text-white" viewBox="0 0 24 24">
            <path
              d="M12 3v18M8 6v12M4 9v6M16 6v12M20 9v6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
          <span className="font-instrument text-[32px] font-normal text-white">
            ComradeAI
          </span>
        </Link>

        <div className="font-satoshi flex flex-wrap justify-center gap-8 text-sm text-[var(--text-muted-grey)]">
          <Link href="#features" className="transition-colors hover:text-white">
            Features
          </Link>
          <Link
            href="#testimonials"
            className="transition-colors hover:text-white"
          >
            Testimonials
          </Link>
          <Link href="#pricing" className="transition-colors hover:text-white">
            Pricing
          </Link>
          <Link href="#faq" className="transition-colors hover:text-white">
            FAQ
          </Link>
          <Link href="#privacy" className="transition-colors hover:text-white">
            Privacy Policy
          </Link>
        </div>

        <div className="my-2 flex gap-4">
          <Link
            href="#"
            aria-label="Email"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/5 text-[var(--text-muted-grey)] transition-all hover:border-white/30 hover:text-white"
          >
            <span className="material-symbols-outlined text-[18px]">
              alternate_email
            </span>
          </Link>
          <Link
            href="#"
            aria-label="Website"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/5 text-[var(--text-muted-grey)] transition-all hover:border-white/30 hover:text-white"
          >
            <span className="material-symbols-outlined text-[18px]">
              public
            </span>
          </Link>
        </div>

        <p className="font-satoshi text-xs text-[var(--text-muted-grey)]/70">
          &copy; 2026 Comrade AI. Built for Digital Well-being and Deep
          Mindfulness.
        </p>
      </div>
    </footer>
  );
}
