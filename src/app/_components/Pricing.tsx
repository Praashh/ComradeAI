"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import RevealOnScroll from "./RevealOnScroll";
import { PRODUCTS } from "@/lib/products";

function CheckIcon() {
  return (
    <svg
      className="h-4 w-4 shrink-0 text-white/80"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path
        d="M5 13l4 4L19 7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Pricing() {
  const [isYearly, setIsYearly] = useState(false);
  const { isSignedIn } = useAuth();

  const proProductId = isYearly
    ? PRODUCTS.pro_yearly.productId
    : PRODUCTS.pro_monthly.productId;

  const checkoutUrl = `/api/checkout?productId=${proProductId}`;

  return (
    <section
      id="pricing"
      className="tablet:px-8 border-t border-white/5 bg-[var(--dark-bg)] px-4 py-24"
    >
      <div className="section-wrapper">
        <RevealOnScroll className="section-header mb-16">
          <div className="pill-badge">
            <span>Pricing</span>
          </div>

          <h2 className="font-instrument w-full max-w-[640px] text-center text-[36px] leading-[1.15] font-normal text-white sm:text-[48px] md:text-[54px]">
            Choose the plan{" "}
            <span className="text-[var(--text-muted-grey)]">
              that fits your budget
            </span>
          </h2>

          {/* Billing Toggle Switch */}
          <div className="mt-8 flex items-center justify-center gap-3">
            <span
              onClick={() => setIsYearly(false)}
              className={`font-satoshi cursor-pointer text-sm font-medium transition-colors ${!isYearly ? "text-white" : "text-white/50 hover:text-white/80"
                }`}
            >
              Monthly
            </span>

            <button
              type="button"
              onClick={() => setIsYearly((prev) => !prev)}
              className="relative inline-flex h-7 w-12 cursor-pointer items-center rounded-full border border-white/20 bg-white/10 p-0.5 transition-colors hover:bg-white/15"
              aria-label="Toggle annual billing"
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform duration-300 ${isYearly ? "translate-x-5" : "translate-x-0"
                  }`}
              />
            </button>

            <span
              onClick={() => setIsYearly(true)}
              className={`font-satoshi cursor-pointer text-sm font-medium transition-colors ${isYearly ? "text-white" : "text-white/50 hover:text-white/80"
                }`}
            >
              Yearly
            </span>
          </div>
        </RevealOnScroll>

        <div className="grid grid-cols-1 items-stretch gap-6 md:grid-cols-3">
          {/* Card 1: Free */}
          <RevealOnScroll className="flex">
            <div className="dark-gradient-card group relative flex w-full flex-col justify-between overflow-hidden rounded-[32px] p-8 shadow-xl transition-all duration-300 hover:border-white/30">
              <div>
                <h3 className="font-satoshi mb-4 text-[20px] font-medium tracking-tight text-white">
                  Free
                </h3>

                <div className="mb-4 flex items-baseline">
                  <span className="font-instrument text-[42px] font-normal leading-none text-white">
                    $0
                  </span>
                  <span className="font-satoshi ml-1.5 text-[14px] text-white/50">
                    /month
                  </span>
                </div>

                <p className="font-satoshi mb-6 min-h-[42px] text-[14px] leading-relaxed text-white/60">
                  Get started with unlimited journals, chat support, and quick AI companion calls.
                </p>

                <Link href="/sign-up" className="block w-full">
                  <button
                    type="button"
                    className="font-satoshi w-full cursor-pointer rounded-full border border-white/15 bg-white/5 py-3 text-[14px] font-medium text-white transition-all hover:bg-white/10 active:scale-98"
                  >
                    Get Started Free
                  </button>
                </Link>

                {/* Divider */}
                <div className="relative my-6 flex items-center justify-center">
                  <div className="w-full border-t border-white/10" />
                  <span className="font-satoshi absolute bg-[#0a0a0a] px-3 text-[12px] font-medium text-white/40">
                    Features
                  </span>
                </div>

                <ul className="font-satoshi space-y-3 text-[14px] text-white/80">
                  <li className="flex items-center gap-3">
                    <CheckIcon />
                    Unlimited journals
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckIcon />
                    Unlimited chat support
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckIcon />
                    5 min call with your AI best friend
                  </li>
                </ul>
              </div>
            </div>
          </RevealOnScroll>

          {/* Card 2: Pro */}
          <RevealOnScroll className="flex">
            <div className="dark-gradient-card group relative flex w-full flex-col justify-between overflow-hidden rounded-[32px] p-8 shadow-xl transition-all duration-300 hover:border-white/30">
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="font-satoshi text-[20px] font-medium tracking-tight text-white">
                    Pro
                  </h3>
                  <span className="font-satoshi rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-medium text-white/90">
                    Popular
                  </span>
                </div>

                <div className="mb-4 flex items-baseline">
                  <span className="font-instrument text-[42px] font-normal leading-none text-white">
                    ${isYearly ? "16" : "20"}
                  </span>
                  <span className="font-satoshi ml-1.5 text-[14px] text-white/50">
                    /month
                  </span>
                </div>

                <p className="font-satoshi mb-6 min-h-[42px] text-[14px] leading-relaxed text-white/60">
                  Extended monthly talk time for regular calls with your AI best friend.
                </p>

                {isSignedIn ? (
                  <a href={checkoutUrl} className="block w-full">
                    <button
                      type="button"
                      className="font-satoshi w-full cursor-pointer rounded-full bg-white py-3 text-[14px] font-semibold text-black transition-all hover:bg-white/90 active:scale-98 shadow-lg"
                    >
                      Upgrade to Pro
                    </button>
                  </a>
                ) : (
                  <Link href="/sign-up" className="block w-full">
                    <button
                      type="button"
                      className="font-satoshi w-full cursor-pointer rounded-full bg-white py-3 text-[14px] font-semibold text-black transition-all hover:bg-white/90 active:scale-98 shadow-lg"
                    >
                      Upgrade to Pro
                    </button>
                  </Link>
                )}

                {/* Divider */}
                <div className="relative my-6 flex items-center justify-center">
                  <div className="w-full border-t border-white/10" />
                  <span className="font-satoshi absolute bg-[#0a0a0a] px-3 text-[12px] font-medium text-white/40">
                    Features
                  </span>
                </div>

                <ul className="font-satoshi space-y-3 text-[14px] text-white/80">
                  <li className="flex items-center gap-3">
                    <CheckIcon />
                    Unlimited journals
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckIcon />
                    Unlimited chat support
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckIcon />
                    30 hour call with your AI best friend
                  </li>
                </ul>
              </div>
            </div>
          </RevealOnScroll>

          {/* Card 3: Custom */}
          <RevealOnScroll className="flex">
            <div className="dark-gradient-card group relative flex w-full flex-col justify-between overflow-hidden rounded-[32px] p-8 shadow-xl transition-all duration-300 hover:border-white/30">
              <div>
                <h3 className="font-satoshi mb-4 text-[20px] font-medium tracking-tight text-white">
                  Custom
                </h3>

                <div className="mb-4 flex items-baseline">
                  <span className="font-instrument text-[42px] font-normal leading-none text-white">
                    Custom
                  </span>
                </div>

                <p className="font-satoshi mb-6 min-h-[42px] text-[14px] leading-relaxed text-white/60">
                  Custom AI persona tailoring with completely uncapped call time.
                </p>

                <Link href="https://x.com/10xpraash" className="block w-full">
                  <button
                    type="button"
                    className="font-satoshi w-full cursor-pointer rounded-full border border-white/15 bg-white/5 py-3 text-[14px] font-medium text-white transition-all hover:bg-white/10 active:scale-98"
                  >
                    Contact Us
                  </button>
                </Link>

                {/* Divider */}
                <div className="relative my-6 flex items-center justify-center">
                  <div className="w-full border-t border-white/10" />
                  <span className="font-satoshi absolute bg-[#0a0a0a] px-3 text-[12px] font-medium text-white/40">
                    Features
                  </span>
                </div>

                <ul className="font-satoshi space-y-3 text-[14px] text-white/80">
                  <li className="flex items-center gap-3">
                    <CheckIcon />
                    Unlimited journals
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckIcon />
                    Unlimited chat support
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckIcon />
                    Unlimited call with your AI best friend
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckIcon />
                    Custom AI best friend
                  </li>
                </ul>
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </div>
    </section>
  );
}
