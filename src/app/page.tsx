import type { Metadata } from "next";
import Masthead from "@/app/_components/Masthead";
import Hero from "@/app/_components/Hero";
import Difference from "@/app/_components/Difference";
import Memory from "@/app/_components/Memory";
import Method from "@/app/_components/Method";
import Principles from "@/app/_components/Principles";
import PullQuote from "@/app/_components/PullQuote";
import CTA from "@/app/_components/CTA";
import Footer from "@/app/_components/Footer";

export const metadata: Metadata = {
  title: "Mira - A thinking, consoling and understanding AI friend",
  description:
    "Mira is your AI journaling companion that learns from your writing, understands you deeply, and helps you reflect, grow, and make better decisions.",
};

export default function Home() {
  return (
    <>
      <Masthead />
      <main>
        <Hero />
        <Difference />
        <Memory />
        <Method />
        <Principles />
        <PullQuote />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
