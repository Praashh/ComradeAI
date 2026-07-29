import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Comrade AI - Onboarding",
};

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-[#0a0a0a] text-white selection:bg-white selection:text-black">
      {/* Subtle ambient lighting glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-white/[0.025] blur-[140px]" />
      </div>

      <header className="relative z-10 flex items-center justify-between px-6 sm:px-12 py-6">
        <Link
          href="/"
          className="font-instrument text-2xl tracking-tight text-white font-normal hover:opacity-80 transition-opacity"
        >
          Comrade<span className="text-white/40">AI</span>
        </Link>
      </header>

      <main className="relative z-10 flex flex-1 items-center justify-center p-4 sm:p-8">
        {children}
      </main>
    </div>
  );
}
