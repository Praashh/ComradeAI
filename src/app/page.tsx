import type { Metadata } from "next";
import Masthead from "@/app/_components/Masthead";
import Hero from "@/app/_components/Hero";
import BentoGrid from "@/app/_components/BentoGrid";
import Privacy from "@/app/_components/Privacy";
import CTA from "@/app/_components/CTA";
import Footer from "@/app/_components/Footer";

export const metadata: Metadata = {
  title: "Comrade AI - A thinking, consoling and understanding AI friend",
  description:
    "Comrade AI is your AI journaling companion that learns from your writing, understands you deeply, and helps you reflect, grow, and make better decisions.",
};

export default function Home() {
  return (
    <div className="landing-theme min-h-screen flex flex-col bg-background text-on-background">
      <Masthead />
      <main className="flex-grow overflow-hidden">
        <Hero />
        <BentoGrid />
        <Privacy />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
