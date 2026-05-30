"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";

export default function Masthead() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = useCallback(() => {
    setMenuOpen((prev) => !prev);
    document.body.classList.toggle("menu-open");
  }, []);

  const closeMenu = useCallback(() => {
    setMenuOpen(false);
    document.body.classList.remove("menu-open");
  }, []);

  return (
    <>
      <header
        className="sticky top-0 z-[300] bg-paper border-b border-rule"
        id="masthead"
      >
        <div className="wrap flex items-baseline justify-between gap-[20px] py-[14px]">
          <Link
            href="/"
            className="font-disp text-[1.9rem] leading-none tracking-[-0.01em]"
          >
            talkamore<span className="text-red">.</span>
          </Link>
          <nav className="flex items-center gap-[26px] max-tablet:hidden">
            <Link
              href="#memory"
              className="font-body text-[0.82rem] tracking-[0.14em] uppercase text-ink-2 transition-colors duration-200 hover:text-ink"
            >
              Memory
            </Link>
            <Link
              href="#how"
              className="font-body text-[0.82rem] tracking-[0.14em] uppercase text-ink-2 transition-colors duration-200 hover:text-ink"
            >
              Method
            </Link>
            <Link
              href="#maya"
              className="font-body text-[0.82rem] tracking-[0.14em] uppercase text-ink-2 transition-colors duration-200 hover:text-ink"
            >
              Maya
            </Link>

            <Show when="signed-out">
              <SignInButton mode="modal">
                <button className="bg-transparent border-0 cursor-pointer p-0 font-body text-[0.82rem] tracking-[0.14em] uppercase text-ink-2 transition-colors duration-200 hover:text-ink">
                  Sign in
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="nav-btn-start bg-transparent border-0 cursor-pointer p-0 font-body text-[0.82rem] tracking-[0.14em] uppercase text-red relative pb-[3px]">
                  Start writing
                </button>
              </SignUpButton>
            </Show>

            <Show when="signed-in">
              <UserButton
                appearance={{
                  elements: {
                    userButtonAvatarBox:
                      "w-[26px] h-[26px] border border-rule-soft",
                  },
                }}
              />
            </Show>
          </nav>
          <button
            className="nav-toggle"
            id="toggle"
            aria-label="Menu"
            onClick={toggleMenu}
            aria-expanded={menuOpen}
          >
            <span></span>
            <span></span>
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      <div className="mobile-menu" id="menu">
        <Link
          href="#memory"
          onClick={closeMenu}
          className="font-disp text-[2.2rem] py-[16px] border-b border-rule-soft text-ink hover:text-red transition-colors"
        >
          Memory
        </Link>
        <Link
          href="#how"
          onClick={closeMenu}
          className="font-disp text-[2.2rem] py-[16px] border-b border-rule-soft text-ink hover:text-red transition-colors"
        >
          Method
        </Link>
        <Link
          href="#maya"
          onClick={closeMenu}
          className="font-disp text-[2.2rem] py-[16px] border-b border-rule-soft text-ink hover:text-red transition-colors"
        >
          Maya
        </Link>

        <Show when="signed-out">
          <SignInButton mode="modal">
            <button
              onClick={closeMenu}
              className="bg-transparent border-0 cursor-pointer text-left font-disp text-[2.2rem] py-[16px] border-b border-rule-soft text-ink w-full hover:text-red transition-colors"
            >
              Sign in
            </button>
          </SignInButton>
          <SignUpButton mode="modal">
            <button
              onClick={closeMenu}
              className="bg-transparent border-0 cursor-pointer text-left font-disp text-[2.2rem] py-[16px] border-b border-rule-soft text-red w-full"
            >
              Start writing →
            </button>
          </SignUpButton>
        </Show>

        <Show when="signed-in">
          <div className="flex items-center justify-between py-[20px] border-b border-rule-soft">
            <span className="font-disp text-[1.8rem] text-ink-2">
              Logged in as
            </span>
            <UserButton
              appearance={{
                elements: {
                  userButtonAvatarBox: "w-10 h-10 border border-rule-soft",
                },
              }}
            />
          </div>
        </Show>
      </div>
    </>
  );
}
