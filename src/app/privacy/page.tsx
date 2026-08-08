"use client";

import Link from "next/link";
import Masthead from "@/app/_components/Masthead";
import Footer from "@/app/_components/Footer";
import SmoothScroll from "@/app/_components/SmoothScroll";
import RevealOnScroll from "@/app/_components/RevealOnScroll";

const LAST_UPDATED = "August 8, 2026";

const SECTIONS = [
  {
    id: "information-we-collect",
    icon: "database",
    title: "Information We Collect",
    content: [
      {
        subtitle: "Account Information",
        text: "When you create an account, we collect your name, email address, and authentication credentials through our identity provider (Clerk). We do not store passwords directly.",
      },
      {
        subtitle: "Journal & Conversation Data",
        text: "Your journal entries, chat messages, and voice conversation transcripts are stored securely to provide our core service — understanding you and offering personalized support.",
      },
      {
        subtitle: "Usage Data",
        text: "We collect anonymous, aggregated usage analytics (via Vercel Analytics) such as page views and feature usage to improve the product. This data cannot be traced back to you personally.",
      },
    ],
  },
  {
    id: "how-we-use",
    icon: "settings",
    title: "How We Use Your Information",
    content: [
      {
        subtitle: "Personalization",
        text: "Your journals and conversations are used exclusively to power your AI companion's memory and understanding. This data is never used to train general-purpose models or shared with third parties.",
      },
      {
        subtitle: "Service Improvement",
        text: "Aggregated, anonymized usage patterns help us improve features, fix bugs, and enhance user experience. Individual content is never reviewed by humans unless you explicitly request support.",
      },
      {
        subtitle: "Communication",
        text: "We may send you service-related emails such as account verification, security alerts, and important product updates. We will never send unsolicited marketing emails.",
      },
    ],
  },
  {
    id: "data-protection",
    icon: "shield",
    title: "Data Protection & Security",
    content: [
      {
        subtitle: "Encryption",
        text: "All data is encrypted in transit using TLS 1.3 and at rest using AES-256 encryption. Your journal entries and conversations are protected at every step of their lifecycle.",
      },
      {
        subtitle: "Infrastructure",
        text: "Our services are hosted on secure, SOC 2 compliant infrastructure. We leverage industry-standard security practices including regular audits, access controls, and monitoring.",
      },
      {
        subtitle: "Access Controls",
        text: "Only you can access your personal data. Our team cannot read your journals or conversations. Administrative access to infrastructure is restricted, audited, and protected by multi-factor authentication.",
      },
    ],
  },
  {
    id: "your-rights",
    icon: "person",
    title: "Your Rights & Controls",
    content: [
      {
        subtitle: "Data Export",
        text: "You can request a full export of all your data at any time. We'll provide your information in a standard, machine-readable format within 30 days of your request.",
      },
      {
        subtitle: "Data Deletion",
        text: "You can delete your account and all associated data at any time. Upon deletion, all your journals, conversations, and AI memory are permanently and irreversibly removed from our systems within 30 days.",
      },
      {
        subtitle: "Opt-Out",
        text: "You can opt out of anonymous analytics collection at any time through your account settings without affecting your access to any features.",
      },
    ],
  },
  {
    id: "third-parties",
    icon: "group",
    title: "Third-Party Services",
    content: [
      {
        subtitle: "AI Processing",
        text: "We use third-party AI providers to power conversations. Your data is sent to these providers solely for generating responses and is not retained by them beyond the immediate request, in accordance with their data processing agreements.",
      },
      {
        subtitle: "Authentication",
        text: "We use Clerk for secure authentication. Clerk processes your login credentials under their own privacy policy and does not have access to your journal or conversation content.",
      },
      {
        subtitle: "Analytics",
        text: "Vercel Analytics collects anonymized, aggregate usage data. No personally identifiable information or content is shared with analytics providers.",
      },
    ],
  },
  {
    id: "cookies",
    icon: "cookie",
    title: "Cookies & Local Storage",
    content: [
      {
        subtitle: "Essential Cookies",
        text: "We use strictly necessary cookies for authentication and session management. These cookies are required for the service to function and cannot be disabled.",
      },
      {
        subtitle: "No Tracking Cookies",
        text: "We do not use advertising cookies, tracking pixels, or any form of cross-site tracking. We are not an ad company and will never monetize your browsing behavior.",
      },
    ],
  },
  {
    id: "changes",
    icon: "history",
    title: "Changes to This Policy",
    content: [
      {
        subtitle: "Notification",
        text: "We will notify you of any material changes to this privacy policy via email and an in-app notification at least 30 days before changes take effect. Continued use of the service after changes constitutes acceptance.",
      },
      {
        subtitle: "Version History",
        text: "We maintain a complete history of changes to this policy. You can request previous versions at any time by contacting us.",
      },
    ],
  },
];

export default function PrivacyPage() {
  return (
    <SmoothScroll>
      <div className="landing-theme font-satoshi flex min-h-screen flex-col bg-[#0a0a0a] text-white selection:bg-white selection:text-[#0a0a0a] mt-10">
        <Masthead />
        <main className="flex-grow overflow-hidden">
          {/* Hero */}
          <section
            className="relative flex w-full flex-col items-center justify-center overflow-hidden bg-[#0a0a0a] px-4 pt-20 pb-20 text-center sm:px-8 sm:pt-44 sm:pb-24"
          >
            {/* Subtle radial glow — matches Hero.tsx background overlays */}
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "radial-gradient(ellipse 60% 40% at 50% 0%, rgba(255,255,255,0.03) 0%, transparent 70%)",
              }}
            />

            <RevealOnScroll className="flex flex-col items-center gap-1">
              <div className="pill-badge mb-6">
                <span>Privacy Policy</span>
              </div>

              <h1 className="font-instrument mx-auto w-full max-w-[720px] text-center text-[40px] leading-[1.12] font-normal tracking-[-0.01em] text-white sm:text-[56px] md:text-[62px]">
                Your privacy is{" "}
                <span className="text-[var(--text-muted-grey)]">
                  sacred to us.
                </span>
              </h1>

              <p className="font-satoshi mx-auto mt-4 max-w-[440px] text-center text-[14px] leading-[1.45] font-normal text-white/80 sm:text-[15px]">
                Comrade AI is built on the belief that your most personal
                thoughts deserve the highest level of protection. Here&apos;s
                exactly how we handle your data.
              </p>

              <p className="font-satoshi mt-6 text-[12px] font-semibold tracking-wider text-white/40 uppercase">
                Last updated — {LAST_UPDATED}
              </p>
            </RevealOnScroll>
          </section>

          {/* Policy Sections */}
          <section className="tablet:px-8 border-t border-white/5 bg-[#0a0a0a] px-4 py-24">
            <div className="section-wrapper">
              <div className="flex flex-col gap-6">
                {SECTIONS.map((section, idx) => (
                  <RevealOnScroll key={section.id}>
                    <div
                      id={section.id}
                      className="dark-gradient-card group relative overflow-hidden rounded-[32px] border border-white/12 p-8 shadow-xl transition-all duration-300 hover:border-white/30 sm:p-10"
                    >
                      {/* Section number + icon row */}
                      <div className="mb-6 flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 transition-colors group-hover:border-white/20 group-hover:bg-white/10">
                          <span className="material-symbols-outlined text-[20px] text-white/90">
                            {section.icon}
                          </span>
                        </div>
                        <span className="font-satoshi text-[12px] font-semibold tracking-wider text-white/40 uppercase">
                          {String(idx + 1).padStart(2, "0")}
                        </span>
                      </div>

                      <h2 className="font-instrument mb-6 text-[28px] leading-[1.15] font-normal text-white sm:text-[36px]">
                        {section.title}
                      </h2>

                      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {section.content.map((item) => (
                          <div
                            key={item.subtitle}
                            className="flex flex-col gap-2"
                          >
                            <h3 className="font-satoshi text-[15px] font-medium text-white/90">
                              {item.subtitle}
                            </h3>
                            <p className="font-satoshi text-[14px] leading-relaxed text-white/60">
                              {item.text}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </RevealOnScroll>
                ))}
              </div>
            </div>
          </section>

          {/* Contact CTA */}
          <section className="tablet:px-8 flex flex-col items-center justify-center border-t border-white/5 bg-[#0a0a0a] px-4 py-20 text-center">
            <RevealOnScroll className="flex flex-col items-center">
              <div className="flex max-w-md flex-col items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/80 shadow-md">
                  <span className="material-symbols-outlined text-[22px]">
                    mail
                  </span>
                </div>
                <h3 className="font-instrument text-[28px] font-normal text-white sm:text-[34px]">
                  Questions about your data?
                </h3>
                <p className="font-satoshi text-sm leading-relaxed text-white/60">
                  If you have any questions, concerns, or requests regarding
                  your privacy or this policy, we&apos;re here to help.
                </p>
                <Link href="https://x.com/10xpraash">
                  <button
                    type="button"
                    className="font-satoshi mt-2 cursor-pointer rounded-full bg-white px-7 py-3 text-[14px] font-semibold text-black shadow-xl transition-all hover:bg-white/90 active:scale-95"
                  >
                    Contact Us
                  </button>
                </Link>
              </div>
            </RevealOnScroll>
          </section>
        </main>
        <Footer />
      </div>
    </SmoothScroll>
  );
}
