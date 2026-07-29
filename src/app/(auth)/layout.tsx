import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Authentication - Comrade AI",
  description:
    "Sign in or create your Comrade AI account to start journaling with your AI companion.",
};

export default function AuthLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="auth-page landing-theme relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-[#0a0a0a] text-white">
      {/* Background Hero Scenery Image */}
      <div className="absolute inset-0 z-0 h-full w-full overflow-hidden">
        <Image
          src="/images/hero-bg.png"
          alt="Dusk mountain and lake background"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        {/* Dark Overlay Gradient to ensure contrast */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/90 via-[#0a0a0a]/80 to-[#0a0a0a]" />
      </div>

      {/* Top Header Logo */}
      <header className="absolute top-0 right-0 left-0 z-20 flex items-center justify-between px-6 py-6 sm:px-12">
        <Link
          href="/"
          className="font-instrument text-[24px] font-normal tracking-[0.01em] text-white transition-opacity hover:opacity-80"
        >
          ComradeAI
        </Link>
        <Link
          href="/"
          className="font-satoshi rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-[13px] font-medium text-white transition-all hover:bg-white/20"
        >
          &larr; Back to Home
        </Link>
      </header>

      {/* Centered Auth Card Area */}
      <main className="relative z-10 my-auto flex w-full items-center justify-center px-4 py-20">
        {children}
      </main>
    </div>
  );
}


