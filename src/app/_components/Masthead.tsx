"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";

export default function Masthead() {
  const { isSignedIn } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const destination = isSignedIn ? "/write" : "/sign-up";

  const toggleMenu = useCallback(() => {
    setMenuOpen((prev) => !prev);
  }, []);

  const closeMenu = useCallback(() => {
    setMenuOpen(false);
  }, []);

  return (
    <>
      <nav
        className="fixed top-0 right-0 left-0 z-50 w-full border-b border-white/10 bg-[#0a0a0a]/60 backdrop-blur-md"
        style={{ WebkitBackdropFilter: "blur(12px)" }}
      >
        <div className="mx-auto flex w-full max-w-[1200px] items-center justify-between px-6 py-4">
          <Link
            href="/"
            className="group flex items-center gap-1.5 text-white transition-opacity hover:opacity-90"
          >
            <span className="font-instrument text-[22px] leading-none font-normal tracking-[0.01em] text-white">
              ComradeAI
            </span>
            <span className="font-satoshi -translate-y-1.5 text-[9px] font-semibold tracking-wider uppercase px-1.5 py-[2px] leading-none rounded-full border border-white/15 bg-white/[0.08] text-white/70 backdrop-blur-sm group-hover:border-white/25 group-hover:text-white/90 transition-all select-none">
              BETA
            </span>
          </Link>

          <div className="tablet:flex hidden items-center gap-7">
            <Link
              href="#features"
              className="nav-link font-satoshi text-[14px] font-normal text-white/80 transition-colors hover:text-white"
            >
              Features
            </Link>
            <Link
              href="#testimonials"
              className="nav-link font-satoshi text-[14px] font-normal text-white/80 transition-colors hover:text-white"
            >
              Testimonials
            </Link>
            <Link
              href="#pricing"
              className="nav-link font-satoshi text-[14px] font-normal text-white/80 transition-colors hover:text-white"
            >
              Pricing
            </Link>
            <Link
              href="#faq"
              className="nav-link font-satoshi text-[14px] font-normal text-white/80 transition-colors hover:text-white"
            >
              FAQ
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={toggleMenu}
              className="tablet:hidden flex items-center justify-center cursor-pointer text-white/60 transition-colors hover:text-white"
              aria-label="Toggle menu"
            >
              <span className="material-symbols-outlined">menu</span>
            </button>

            <Link href={destination} className="tablet:block hidden">
              <button
                type="button"
                className="font-satoshi cursor-pointer rounded-full border border-white/20 bg-white/10 px-5 py-2 text-[13px] font-medium text-white transition-all hover:bg-white/15 active:scale-95"
              >
                Try Now
              </button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Full-screen Mobile Menu Overlay */}
      {menuOpen && (
        <div className="tablet:hidden fixed inset-0 z-60 flex flex-col items-center justify-between bg-[#0a0a0a]/98 px-6 py-12 backdrop-blur-2xl animate-in fade-in duration-200">
          {/* Centered Navigation Links */}
          <div className="my-auto flex flex-col items-center gap-6 text-center">
            <Link
              href="#hero"
              onClick={closeMenu}
              className="font-instrument text-[28px] font-normal text-white transition-opacity hover:opacity-75 sm:text-[32px]"
            >
              About
            </Link>
            <Link
              href="#features"
              onClick={closeMenu}
              className="font-instrument text-[28px] font-normal text-white transition-opacity hover:opacity-75 sm:text-[32px]"
            >
              Features
            </Link>
            <Link
              href="#testimonials"
              onClick={closeMenu}
              className="font-instrument text-[28px] font-normal text-white transition-opacity hover:opacity-75 sm:text-[32px]"
            >
              Testimonials
            </Link>
            <Link
              href="#pricing"
              onClick={closeMenu}
              className="font-instrument text-[28px] font-normal text-white transition-opacity hover:opacity-75 sm:text-[32px]"
            >
              Pricing
            </Link>
            <Link
              href="#faq"
              onClick={closeMenu}
              className="font-instrument text-[28px] font-normal text-white transition-opacity hover:opacity-75 sm:text-[32px]"
            >
              FAQ
            </Link>
          </div>

          {/* Bottom Center Close Button */}
          <button
            type="button"
            onClick={closeMenu}
            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-white/60 transition-colors hover:text-white focus:outline-none"
            aria-label="Close menu"
          >
            <span className="material-symbols-outlined text-[24px]">close</span>
          </button>
        </div>
      )}
    </>
  );
}

