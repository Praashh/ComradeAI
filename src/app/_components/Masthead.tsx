"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { Show, UserButton } from "@clerk/nextjs";

export default function Masthead() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = useCallback(() => {
    setMenuOpen((prev) => !prev);
  }, []);

  const closeMenu = useCallback(() => {
    setMenuOpen(false);
  }, []);

  return (
    <>
      <nav
        className="fixed top-0 right-0 left-0 z-50 w-full border-b border-[var(--border-subtle)] bg-[var(--dark-bg)]/90 backdrop-blur-[10px]"
        style={{ WebkitBackdropFilter: "blur(10px)" }}
      >
        <div className="mx-auto flex w-full max-w-[1080px] items-center justify-between px-6 py-4">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-[var(--text-pure-white)] transition-opacity hover:opacity-90"
          >
            <svg
              className="h-6 w-6"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M 0 0 L 0 6"
                fill="transparent"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                stroke="white"
                transform="translate(4.5 9)"
              />
              <path
                d="M 0 0 L 0 18"
                fill="transparent"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                stroke="white"
                transform="translate(8.25 3)"
              />
              <path
                d="M 0 0 L 0 12"
                fill="transparent"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                stroke="white"
                transform="translate(12 6)"
              />
              <path
                d="M 0 0 L 0 6"
                fill="transparent"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                stroke="white"
                transform="translate(15.75 9)"
              />
              <path
                d="M 0 0 L 0 9"
                fill="transparent"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                stroke="white"
                transform="translate(19.5 7.5)"
              />
            </svg>
            <span className="font-instrument text-[22px] leading-[1.1] font-normal tracking-[0.01em] text-[var(--text-pure-white)]">
              ComradeAI
            </span>
          </Link>

          <div className="tablet:flex hidden items-center gap-4">
            <Show when="signed-out">
              <Link
                href="#features"
                className="nav-link font-satoshi text-[14px] font-normal text-[var(--text-muted-grey)] hover:text-[var(--text-pure-white)]"
              >
                Features
              </Link>
              <Link
                href="#testimonials"
                className="nav-link font-satoshi text-[14px] font-normal text-[var(--text-muted-grey)] hover:text-[var(--text-pure-white)]"
              >
                Testimonials
              </Link>
              <Link
                href="#pricing"
                className="nav-link font-satoshi text-[14px] font-normal text-[var(--text-muted-grey)] hover:text-[var(--text-pure-white)]"
              >
                Pricing
              </Link>
              <Link
                href="#faq"
                className="nav-link font-satoshi text-[14px] font-normal text-[var(--text-muted-grey)] hover:text-[var(--text-pure-white)]"
              >
                FAQ
              </Link>
            </Show>
            <Show when="signed-in">
              <Link
                href="/write"
                className="nav-link font-satoshi text-[14px] font-normal text-[var(--text-muted-grey)] hover:text-[var(--text-pure-white)]"
              >
                Journal
              </Link>
              <Link
                href="/chat"
                className="nav-link font-satoshi text-[14px] font-normal text-[var(--text-muted-grey)] hover:text-[var(--text-pure-white)]"
              >
                AskComrade
              </Link>
              <Link
                href="/talk"
                className="nav-link font-satoshi text-[14px] font-normal text-[var(--text-muted-grey)] hover:text-[var(--text-pure-white)]"
              >
                Voice
              </Link>
              <Link
                href="/mind"
                className="font-satoshi text-[14px] font-normal text-[var(--text-muted-grey)] hover:text-[var(--text-pure-white)]"
              >
                ComradeMind
              </Link>
            </Show>
          </div>

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={toggleMenu}
              className="tablet:hidden material-symbols-outlined cursor-pointer text-white/60 transition-colors hover:text-white"
              aria-label="Toggle menu"
            >
              menu
            </button>

            <Show when="signed-out">
              <Link href="/sign-up" className="tablet:block hidden">
                <button
                  type="button"
                  className="glass-btn font-satoshi cursor-pointer rounded-full px-5 py-2 text-[13px] font-medium tracking-wide transition-all active:scale-95"
                >
                  Try Now
                </button>
              </Link>
            </Show>

            <Show when="signed-in">
              <div className="flex items-center">
                <UserButton
                  appearance={{
                    elements: {
                      userButtonAvatarBox:
                        "w-[32px] h-[32px] border border-white/20 hover:scale-105 transition-transform rounded-full",
                    },
                  }}
                />
              </div>
            </Show>
          </div>
        </div>
      </nav>

      {menuOpen && (
        <button
          type="button"
          className="tablet:hidden fixed inset-0 z-55 cursor-default border-none bg-black/40 backdrop-blur-sm"
          onClick={closeMenu}
          aria-label="Close menu"
        />
      )}

      <div
        className={`tablet:hidden fixed top-4 right-4 z-60 flex h-[calc(100vh-32px)] w-64 flex-col gap-4 rounded-2xl border border-white/10 bg-[var(--dark-bg)]/95 p-6 shadow-2xl backdrop-blur-2xl transition-transform duration-300 ${
          menuOpen ? "translate-x-0" : "translate-x-[calc(100%+32px)]"
        }`}
      >
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--accent-neon)] text-[var(--dark-bg)]">
            <span className="material-symbols-outlined font-bold">bolt</span>
          </div>
          <div>
            <h2 className="font-instrument text-[20px] font-normal text-[var(--text-pure-white)]">
              Comrade AI
            </h2>
            <p className="text-[11px] text-[var(--text-muted-grey)]">
              Your Empathetic Companion
            </p>
          </div>
        </div>

        <nav className="flex flex-1 flex-col gap-2">
          <Show when="signed-out">
            <Link
              href="/"
              onClick={closeMenu}
              className="font-satoshi flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm text-[var(--text-pure-white)] transition-all hover:bg-white/5"
            >
              <span className="material-symbols-outlined text-[var(--text-muted-grey)]">
                home
              </span>{" "}
              Home
            </Link>
            <Link
              href="#features"
              onClick={closeMenu}
              className="font-satoshi flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm text-[var(--text-pure-white)] transition-all hover:bg-white/5"
            >
              <span className="material-symbols-outlined text-[var(--text-muted-grey)]">
                featured_play_list
              </span>{" "}
              Features
            </Link>
            <Link
              href="#testimonials"
              onClick={closeMenu}
              className="font-satoshi flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm text-[var(--text-pure-white)] transition-all hover:bg-white/5"
            >
              <span className="material-symbols-outlined text-[var(--text-muted-grey)]">
                rate_review
              </span>{" "}
              Testimonials
            </Link>
            <Link
              href="#pricing"
              onClick={closeMenu}
              className="font-satoshi flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm text-[var(--text-pure-white)] transition-all hover:bg-white/5"
            >
              <span className="material-symbols-outlined text-[var(--text-muted-grey)]">
                payments
              </span>{" "}
              Pricing
            </Link>
            <Link
              href="#faq"
              onClick={closeMenu}
              className="font-satoshi flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm text-[var(--text-pure-white)] transition-all hover:bg-white/5"
            >
              <span className="material-symbols-outlined text-[var(--text-muted-grey)]">
                quiz
              </span>{" "}
              FAQ
            </Link>
            <Link
              href="/sign-in"
              onClick={closeMenu}
              className="font-satoshi mt-2 flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm text-[var(--text-muted-grey)] transition-all hover:text-[var(--text-pure-white)]"
            >
              <span className="material-symbols-outlined">login</span> Sign In
            </Link>
            <Link
              href="/sign-up"
              onClick={closeMenu}
              className="neon-btn font-satoshi flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold tracking-wider"
            >
              TRY NOW
            </Link>
          </Show>

          <Show when="signed-in">
            <Link
              href="/write"
              onClick={closeMenu}
              className="neon-btn font-satoshi mb-2 flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-semibold"
            >
              <span className="material-symbols-outlined">book_5</span> Journal
            </Link>
            <Link
              href="/chat"
              onClick={closeMenu}
              className="font-satoshi flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm text-[var(--text-pure-white)] transition-all hover:bg-white/5"
            >
              <span className="material-symbols-outlined text-[var(--text-muted-grey)]">
                chat_bubble
              </span>{" "}
              Chat
            </Link>
            <Link
              href="/talk"
              onClick={closeMenu}
              className="font-satoshi flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm text-[var(--text-pure-white)] transition-all hover:bg-white/5"
            >
              <span className="material-symbols-outlined text-[var(--text-muted-grey)]">
                mic
              </span>{" "}
              Voice
            </Link>
            <Link
              href="/mind"
              onClick={closeMenu}
              className="font-satoshi flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm text-[var(--text-pure-white)] transition-all hover:bg-white/5"
            >
              <span className="material-symbols-outlined text-[var(--text-muted-grey)]">
                hub
              </span>{" "}
              ComradeMind
            </Link>
          </Show>
        </nav>

        <Show when="signed-in">
          <Link href="/talk" onClick={closeMenu}>
            <button
              type="button"
              className="bg-primary/10 text-primary py-md font-title-md border-primary/20 hover:bg-primary/20 mt-auto w-full cursor-pointer rounded-xl border transition-colors"
            >
              Talk to Comrade
            </button>
          </Link>
        </Show>

        <div className="pt-md mt-md border-outline-variant/30 gap-xs flex flex-col border-t">
          <Link
            href="/onboarding"
            onClick={closeMenu}
            className="text-on-secondary-container hover:bg-secondary-container/50 flex items-center gap-3 rounded-full px-4 py-1 text-sm"
          >
            <span className="material-symbols-outlined text-[18px]">
              settings
            </span>{" "}
            Onboarding
          </Link>
        </div>
      </div>
    </>
  );
}
