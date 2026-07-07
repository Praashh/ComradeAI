"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Show, UserButton } from "@clerk/nextjs";

export default function Masthead() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const toggleMenu = useCallback(() => {
    setMenuOpen((prev) => !prev);
  }, []);

  const closeMenu = useCallback(() => {
    setMenuOpen(false);
  }, []);

  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY;
    if (currentScrollY <= 50) {
      setIsVisible(true);
      return;
    }
    if (currentScrollY > lastScrollY) {
      // Scroll down
      setIsVisible(false);
    } else {
      // Scroll up
      setIsVisible(true);
    }
    setLastScrollY(currentScrollY);
  }, [lastScrollY]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  return (
    <>
      {/* Top Navigation Bar */}
      <nav
        className="fixed top-0 w-full z-50 bg-surface/70 backdrop-blur-xl border-b border-black/5 shadow-sm transition-transform duration-300"
        style={{
          transform: isVisible ? "translateY(0)" : "translateY(-100%)",
        }}
      >
        <div className="flex justify-between items-center px-md py-sm max-w-[1440px] mx-auto">
          <div className="flex items-center gap-base">
            <Link href="/" className="font-display-md text-display-md font-semibold text-primary">
              ComradeAI
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden tablet:flex items-center gap-lg">
            <Show when="signed-out">
              <Link href="/" className="text-primary border-b-2 border-primary font-body-md transition-colors">
                Home
              </Link>
              <Link href="#features" className="text-secondary hover:text-primary-container transition-colors font-body-md">
                Features
              </Link>
              <Link href="#cta" className="text-secondary hover:text-primary-container transition-colors font-body-md">
                Pricing
              </Link>
              <Link href="#footer" className="text-secondary hover:text-primary-container transition-colors font-body-md">
                Community
              </Link>
            </Show>

            <Show when="signed-in">
              <Link href="/write" className="text-secondary hover:text-primary-container transition-colors font-body-md">
                Write
              </Link>
              <Link href="/chat" className="text-secondary hover:text-primary-container transition-colors font-body-md">
                AskComrade
              </Link>
              <Link href="/talk" className="text-secondary hover:text-primary-container transition-colors font-body-md">
                Voice
              </Link>
              <Link href="/mind" className="text-secondary hover:text-primary-container transition-colors font-body-md">
                ComradeMind
              </Link>
            </Show>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-md">
            <button
              type="button"
              onClick={toggleMenu}
              className="landing-hamburger material-symbols-outlined text-on-surface-variant hover:text-primary transition-transform active:scale-95 cursor-pointer"
              aria-label="Toggle menu"
            >
              menu
            </button>

            <Show when="signed-out">
              <Link href="/sign-in" className="material-symbols-outlined text-on-surface-variant hover:text-primary transition-transform active:scale-95">
                account_circle
              </Link>
              <Link href="/sign-up">
                <button type="button" className="bg-primary text-on-primary px-md py-xs rounded-full font-label-md transition-transform active:scale-95 cursor-pointer">
                  Get Started
                </button>
              </Link>
            </Show>

            <Show when="signed-in">
              <div className="flex items-center">
                <UserButton
                  appearance={{
                    elements: {
                      userButtonAvatarBox: "w-[28px] h-[28px] border border-black/5 hover:scale-105 transition-transform",
                    },
                  }}
                />
              </div>
            </Show>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Navigation Overlay */}
      {menuOpen && (
        <button type="button" className="fixed inset-0 z-55 bg-black/40 backdrop-blur-sm tablet:hidden border-none cursor-default" onClick={closeMenu} aria-label="Close menu" />
      )}

      <div
        className={`fixed left-0 top-0 h-full w-64 bg-surface-container-low/95 backdrop-blur-md border-r border-black/5 shadow-md transition-transform duration-300 z-60 tablet:hidden flex flex-col p-md gap-base ${menuOpen ? "translate-x-0" : "-translate-x-full"
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
