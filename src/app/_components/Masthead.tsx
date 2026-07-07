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
      {/* Floating Navigation Bar */}
      <div className="fixed top-4 left-0 right-0 z-50 px-margin-mobile tablet:px-margin-desktop flex justify-center">
        <nav className="w-full max-w-5xl bg-surface/80 backdrop-blur-xl border border-black/5 rounded-full px-6 py-2.5 shadow-[0_4px_20px_rgba(33,28,22,0.05)] flex justify-between items-center">
          <div className="flex items-center">
            <Link href="/" className="font-display-md text-[20px] font-semibold text-primary tracking-tight transition-transform active:scale-98">
              ComradeAI
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden tablet:flex items-center gap-6">
            <Show when="signed-out">
              <Link href="/" className="text-primary font-body-md font-semibold transition-colors text-sm">
                Home
              </Link>
              <Link href="#features" className="text-secondary hover:text-primary transition-colors font-body-md text-sm">
                Features
              </Link>
              <Link href="#cta" className="text-secondary hover:text-primary transition-colors font-body-md text-sm">
                Pricing
              </Link>
              <Link href="#footer" className="text-secondary hover:text-primary transition-colors font-body-md text-sm">
                Community
              </Link>
            </Show>

            <Show when="signed-in">
              <Link href="/write" className="text-secondary hover:text-primary transition-colors font-body-md text-sm">
                Write
              </Link>
              <Link href="/chat" className="text-secondary hover:text-primary transition-colors font-body-md text-sm">
                AskComrade
              </Link>
              <Link href="/talk" className="text-secondary hover:text-primary transition-colors font-body-md text-sm">
                Voice
              </Link>
              <Link href="/mind" className="text-secondary hover:text-primary transition-colors font-body-md text-sm">
                ComradeMind
              </Link>
            </Show>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={toggleMenu}
              className="landing-hamburger material-symbols-outlined text-on-surface-variant hover:text-primary transition-transform active:scale-95 cursor-pointer"
              aria-label="Toggle menu"
            >
              menu
            </button>

            <Show when="signed-out">
              <Link href="/sign-in" className="material-symbols-outlined text-on-surface-variant hover:text-primary transition-transform active:scale-95 text-[22px] flex items-center justify-center">
                account_circle
              </Link>
              <Link href="/sign-up">
                <button type="button" className="bg-primary text-on-primary px-4 py-2 rounded-full text-xs font-semibold font-body tracking-wider transition-all hover:bg-primary/95 active:scale-95 cursor-pointer shadow-sm shadow-primary/10">
                  GET STARTED
                </button>
              </Link>
            </Show>

            <Show when="signed-in">
              <div className="flex items-center">
                <UserButton
                  appearance={{
                    elements: {
                      userButtonAvatarBox: "w-[30px] h-[30px] border border-black/5 hover:scale-105 transition-transform",
                    },
                  }}
                />
              </div>
            </Show>
          </div>
        </nav>
      </div>

      {/* Mobile Drawer Navigation Overlay */}
      {menuOpen && (
        <button type="button" className="fixed inset-0 z-55 bg-black/40 backdrop-blur-sm tablet:hidden border-none cursor-default" onClick={closeMenu} aria-label="Close menu" />
      )}

      <div
        className={`fixed right-4 top-4 h-[calc(100vh-32px)] w-64 bg-surface/95 backdrop-blur-xl border border-black/5 rounded-2xl shadow-2xl transition-transform duration-300 z-60 tablet:hidden flex flex-col p-6 gap-4 ${menuOpen ? "translate-x-0" : "translate-x-[calc(100%+32px)]"
          }`}
      >
        <div className="flex items-center gap-sm mb-lg">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-on-primary">
            <span className="material-symbols-outlined">bolt</span>
          </div>
          <div>
            <h2 className="font-display-md text-body-lg font-bold text-primary">Comrade AI</h2>
            <p className="text-[10px] text-secondary">Your Empathetic Companion</p>
          </div>
        </div>

        <nav className="flex-1 flex flex-col gap-base">
          <Show when="signed-out">
            <Link
              href="/"
              onClick={closeMenu}
              className="text-on-secondary-container hover:bg-secondary-container/50 rounded-full px-4 py-2 flex items-center gap-3 transition-all font-body-md"
            >
              <span className="material-symbols-outlined">home</span> Home
            </Link>
            <Link
              href="#features"
              onClick={closeMenu}
              className="text-on-secondary-container hover:bg-secondary-container/50 rounded-full px-4 py-2 flex items-center gap-3 transition-all font-body-md"
            >
              <span className="material-symbols-outlined">featured_play_list</span> Features
            </Link>
            <Link
              href="#privacy"
              onClick={closeMenu}
              className="text-on-secondary-container hover:bg-secondary-container/50 rounded-full px-4 py-2 flex items-center gap-3 transition-all font-body-md"
            >
              <span className="material-symbols-outlined">security</span> Privacy
            </Link>
            <Link
              href="/sign-in"
              onClick={closeMenu}
              className="text-on-secondary-container hover:bg-secondary-container/50 rounded-full px-4 py-2 flex items-center gap-3 transition-all font-body-md"
            >
              <span className="material-symbols-outlined">login</span> Sign In
            </Link>
            <Link
              href="/sign-up"
              onClick={closeMenu}
              className="bg-primary text-on-primary rounded-full px-4 py-2 flex items-center gap-3 active:scale-98 transition-transform font-body-md"
            >
              <span className="material-symbols-outlined">assignment_ind</span> Get Started
            </Link>
          </Show>

          <Show when="signed-in">
            <Link
              href="/write"
              onClick={closeMenu}
              className="bg-primary text-on-primary rounded-full px-4 py-2 flex items-center gap-3 active:scale-98 transition-transform font-body-md"
            >
              <span className="material-symbols-outlined">book_5</span> Journal
            </Link>
            <Link
              href="/chat"
              onClick={closeMenu}
              className="text-on-secondary-container hover:bg-secondary-container/50 rounded-full px-4 py-2 flex items-center gap-3 transition-all font-body-md"
            >
              <span className="material-symbols-outlined">chat_bubble</span> Chat
            </Link>
            <Link
              href="/talk"
              onClick={closeMenu}
              className="text-on-secondary-container hover:bg-secondary-container/50 rounded-full px-4 py-2 flex items-center gap-3 transition-all font-body-md"
            >
              <span className="material-symbols-outlined">mic</span> Voice
            </Link>
            <Link
              href="/mind"
              onClick={closeMenu}
              className="text-on-secondary-container hover:bg-secondary-container/50 rounded-full px-4 py-2 flex items-center gap-3 transition-all font-body-md"
            >
              <span className="material-symbols-outlined">hub</span> ComradeMind
            </Link>
          </Show>
        </nav>

        <Show when="signed-in">
          <Link href="/talk" onClick={closeMenu}>
            <button type="button" className="mt-auto bg-primary/10 text-primary w-full py-md rounded-xl font-title-md border border-primary/20 cursor-pointer hover:bg-primary/20 transition-colors">
              Talk to Comrade
            </button>
          </Link>
        </Show>

        <div className="pt-md mt-md border-t border-outline-variant/30 flex flex-col gap-xs">
          <Link
            href="/onboarding"
            onClick={closeMenu}
            className="text-on-secondary-container hover:bg-secondary-container/50 rounded-full px-4 py-1 flex items-center gap-3 text-sm"
          >
            <span className="material-symbols-outlined text-[18px]">settings</span> Onboarding
          </Link>
        </div>
      </div>
    </>
  );
}
