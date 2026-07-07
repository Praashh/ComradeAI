import type { Metadata } from "next";
import { auth } from "@clerk/nextjs/server";
import Masthead from "@/app/_components/Masthead";
import Hero from "@/app/_components/Hero";
import BentoGrid from "@/app/_components/BentoGrid";
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
    <section className="py-16 bg-surface border-t border-outline-variant/20 flex flex-col items-center justify-center text-center px-margin-mobile tablet:px-margin-desktop">
      <div className="max-w-md flex flex-col items-center gap-4 animate-fade-in">
        <span className="material-symbols-outlined text-primary text-[32px]">rate_review</span>
        <h3 className="font-display-lg text-[24px] text-on-background font-normal">Have thoughts to share?</h3>
        <p className="font-body-md text-secondary leading-relaxed">
          We want to make Comrade AI your perfect digital sanctuary. Share your ideas, improvements, or report bugs directly to our development team.
        </p>
        <FeedbackDialog>
          <button type="button" className="bg-primary text-on-primary px-6 py-2.5 rounded-full text-xs font-semibold font-body tracking-wider transition-all hover:bg-primary/95 active:scale-95 cursor-pointer shadow-sm shadow-primary/10 mt-2">
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
    <div className="landing-theme min-h-screen flex flex-col bg-background text-on-background">
      <Masthead />
      <main className="flex-grow overflow-hidden">
        <Hero />
        <BentoGrid />
        <Privacy />
        <CTA />
        {userId && <FeedbackSection />}
      </main>
      <Footer />
    </div>
  );
}
