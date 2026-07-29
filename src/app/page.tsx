import type { Metadata } from "next";
import { auth } from "@clerk/nextjs/server";
import Masthead from "@/app/_components/Masthead";
import Hero from "@/app/_components/Hero";
import BentoGrid from "@/app/_components/BentoGrid";
import Benefits from "@/app/_components/Benefits";
import Testimonials from "@/app/_components/Testimonials";
import Pricing from "@/app/_components/Pricing";
import FAQ from "@/app/_components/FAQ";
import HowItWorks from "@/app/_components/HowItWorks";
import CTA from "@/app/_components/CTA";
import Footer from "@/app/_components/Footer";
import { FeedbackDialog } from "@/app/_components/FeedbackDialog";

import SmoothScroll from "@/app/_components/SmoothScroll";

export const metadata: Metadata = {
  title: "Comrade AI - A thinking, consoling and understanding AI friend",
  description:
    "Comrade AI is your AI journaling companion that learns from your writing, understands you deeply, and helps you reflect, grow, and make better decisions.",
};

function FeedbackSection() {
  return (
    <section className="tablet:px-8 flex flex-col items-center justify-center border-t border-white/5 bg-[var(--dark-bg)] px-4 py-20 text-center">
      <div className="flex max-w-md flex-col items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/80 shadow-md">
          <span className="material-symbols-outlined text-[22px]">
            rate_review
          </span>
        </div>
        <h3 className="font-instrument text-[28px] sm:text-[34px] font-normal text-white">
          Have thoughts to share?
        </h3>
        <p className="font-satoshi text-sm leading-relaxed text-white/60">
          We want to make Comrade AI your perfect digital sanctuary. Share your
          ideas, improvements, or report bugs directly to our core team.
        </p>
        <FeedbackDialog>
          <button
            type="button"
            className="font-satoshi mt-2 cursor-pointer rounded-full bg-white px-7 py-3 text-xs font-semibold tracking-wider uppercase text-[#0a0a0a] shadow-lg transition-all hover:bg-white/90 active:scale-95"
          >
            Give Feedback
          </button>
        </FeedbackDialog>
      </div>
    </section>
  );
}

export default async function Home() {
  const { userId } = await auth();

  return (
    <SmoothScroll>
      <div className="landing-theme font-satoshi flex min-h-screen flex-col bg-[var(--dark-bg)] text-white selection:bg-white selection:text-[var(--dark-bg)]">
        <Masthead />
        <main className="flex-grow overflow-hidden">
          <Hero />
          <BentoGrid />
          <Benefits />
          <HowItWorks />
          <Pricing />
          <Testimonials />
          <FAQ />
          <CTA />
          {userId && <FeedbackSection />}
        </main>
        <Footer />
      </div>
    </SmoothScroll>
  );
}
