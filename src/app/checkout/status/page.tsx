"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";

const STATUS_CONFIG = {
  success: {
    icon: (
      <svg
        className="h-10 w-10 text-emerald-400"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        viewBox="0 0 24 24"
      >
        <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    ringColor: "border-emerald-500/30 bg-emerald-500/10 shadow-[0_0_40px_rgba(16,185,129,0.15)]",
    pingColor: "bg-emerald-500/20",
    title: "Payment Successful",
    description:
      "Thank you for upgrading to Pro! Your account has been activated with 30 hours of monthly voice calls.",
    primaryCta: { label: "Start Chatting", href: "/chat" },
    secondaryCta: { label: "Start a Voice Call", href: "/talk" },
    footnote: "It may take a moment for your subscription to activate. If your plan hasn't updated, try refreshing the page.",
  },
  failed: {
    icon: (
      <svg
        className="h-10 w-10 text-red-400"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        viewBox="0 0 24 24"
      >
        <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    ringColor: "border-red-500/30 bg-red-500/10 shadow-[0_0_40px_rgba(239,68,68,0.15)]",
    pingColor: "bg-red-500/20",
    title: "Payment Failed",
    description:
      "Something went wrong with your payment. You have not been charged. Please try again or use a different payment method.",
    primaryCta: { label: "Try Again", href: "/#pricing" },
    secondaryCta: { label: "Continue on Free", href: "/chat" },
    footnote: null,
  },
  cancelled: {
    icon: (
      <svg
        className="h-10 w-10 text-amber-400"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        viewBox="0 0 24 24"
      >
        <path d="M12 9v4m0 4h.01M12 3a9 9 0 100 18 9 9 0 000-18z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    ringColor: "border-amber-500/30 bg-amber-500/10 shadow-[0_0_40px_rgba(245,158,11,0.15)]",
    pingColor: "bg-amber-500/20",
    title: "Payment Cancelled",
    description:
      "You cancelled the checkout. No worries — you can upgrade anytime from the pricing page.",
    primaryCta: { label: "Back to Pricing", href: "/#pricing" },
    secondaryCta: { label: "Continue on Free", href: "/chat" },
    footnote: null,
  },
} as const;

type StatusKey = keyof typeof STATUS_CONFIG;

function CheckoutStatusContent() {
  const searchParams = useSearchParams();
  const rawStatus = searchParams.get("status") ?? "success";
  const status: StatusKey = (rawStatus in STATUS_CONFIG)
    ? (rawStatus as StatusKey)
    : "failed";

  const config = STATUS_CONFIG[status];

  return (
    <div className="font-satoshi flex min-h-screen flex-col items-center justify-center bg-[#0a0a0a] px-4 text-white">
      <div className="flex max-w-md flex-col items-center gap-6 text-center">
        {/* Animated icon */}
        <div className="relative flex h-20 w-20 items-center justify-center">
          <div className={`absolute inset-0 animate-ping rounded-full ${config.pingColor}`} />
          <div className={`relative flex h-20 w-20 items-center justify-center rounded-full border ${config.ringColor}`}>
            {config.icon}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <h1 className="font-instrument text-[36px] leading-tight font-normal sm:text-[44px]">
            {config.title}
          </h1>
          <p className="text-[15px] leading-relaxed text-white/50">
            {config.description}
          </p>
        </div>

        <div className="mt-2 flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
          <Link href={config.primaryCta.href}>
            <button
              type="button"
              className="w-full cursor-pointer rounded-full bg-white px-8 py-3 text-[14px] font-semibold text-black shadow-lg transition-all hover:bg-white/90 active:scale-98 sm:w-auto"
            >
              {config.primaryCta.label}
            </button>
          </Link>
          <Link href={config.secondaryCta.href}>
            <button
              type="button"
              className="w-full cursor-pointer rounded-full border border-white/15 bg-white/5 px-8 py-3 text-[14px] font-medium text-white transition-all hover:bg-white/10 active:scale-98 sm:w-auto"
            >
              {config.secondaryCta.label}
            </button>
          </Link>
        </div>

        {config.footnote && (
          <p className="mt-4 text-[13px] text-white/30">{config.footnote}</p>
        )}

        {status !== "success" && (
          <p className="mt-2 text-[13px] text-white/30">
            If this keeps happening, please contact us at{" "}
            <a
              href="https://x.com/10xpraash"
              className="text-white/50 underline underline-offset-2 hover:text-white/70"
            >
              @10xpraash
            </a>
          </p>
        )}
      </div>
    </div>
  );
}

export default function CheckoutStatusPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a]">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-white" />
        </div>
      }
    >
      <CheckoutStatusContent />
    </Suspense>
  );
}
