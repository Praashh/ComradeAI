import type { Metadata } from "next";
import { auth } from "@clerk/nextjs/server";
import Masthead from "@/app/_components/Masthead";
import Hero from "@/app/_components/Hero";
import BentoGrid from "@/app/_components/BentoGrid";
import Testimonials from "@/app/_components/Testimonials";
import Pricing from "@/app/_components/Pricing";
import FAQ from "@/app/_components/FAQ";
import Privacy from "@/app/_components/Privacy";
import CTA from "@/app/_components/CTA";
import Footer from "@/app/_components/Footer";
import { FeedbackDialog } from "@/app/_components/FeedbackDialog";

export const metadata: Metadata = {
  title: "Comrade AI - A thinking, consoling and understanding AI friend",
  description:
    "Comrade AI is your AI journaling companion that learns from your writing, understands you deeply, and helps you reflect, grow, and make better decisions.",
};

function FeedbackSection() {
  return (
    <section className="tablet:px-8 flex flex-col items-center justify-center border-t border-white/10 bg-[var(--dark-bg)] px-4 py-16 text-center">
      <div className="animate-fade-in flex max-w-md flex-col items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[var(--accent-neon)]/20 bg-[var(--accent-neon)]/10 text-[var(--accent-neon)]">
          <span className="material-symbols-outlined text-[24px]">
            rate_review
          </span>
        </div>
        <h3 className="font-instrument text-[28px] font-normal text-white">
          Have thoughts to share?
        </h3>
        <p className="font-satoshi text-sm leading-relaxed text-[var(--text-muted-grey)]">
          We want to make Comrade AI your perfect digital sanctuary. Share your
          ideas, improvements, or report bugs directly to our core team.
        </p>
        <FeedbackDialog>
          <button
            type="button"
            className="neon-btn font-satoshi mt-2 cursor-pointer rounded-full px-6 py-2.5 text-xs font-semibold tracking-wider uppercase transition-all"
          >
            GIVE FEEDBACK
          </button>
        </FeedbackDialog>
      </div>
    </section>
  );
}

export default async function Home() {
  const { userId } = await auth();

  return (
    <div className="landing-theme font-satoshi flex min-h-screen flex-col bg-[var(--dark-bg)] text-white selection:bg-white selection:text-[var(--dark-bg)]">
      <Masthead />
      <main className="flex-grow overflow-hidden">
        <Hero />
        <BentoGrid />
        <Testimonials />
        <Pricing />
        <FAQ />
        <Privacy />
        <CTA />
        {userId && <FeedbackSection />}
      </main>
      <Footer />
    </div>
  );
}
