"use client";

import Link from "next/link";
import Masthead from "@/app/_components/Masthead";
import Footer from "@/app/_components/Footer";
import SmoothScroll from "@/app/_components/SmoothScroll";
import RevealOnScroll from "@/app/_components/RevealOnScroll";

const LAST_UPDATED = "August 20, 2026";

const GUARANTEES = [
  {
    icon: "visibility_off",
    title: "Zero Developer Viewing",
    desc: "We will never view, inspect, browse, or eavesdrop on your private chats, journal entries, or voice transcripts. Your reflections are strictly between you and your AI companion.",
  },
  {
    icon: "do_not_disturb_on",
    title: "Never Sold or Monetized",
    desc: "We do not sell, rent, trade, or broker your personal data, messages, or habits to advertisers, data brokers, or third parties under any circumstances.",
  },
  {
    icon: "psychology_alt",
    title: "No Public AI Training",
    desc: "Your personal conversations and reflections are never used to train public, foundation, or open-source AI models. Your thoughts remain your own.",
  },
  {
    icon: "lock",
    title: "Strict Tenant Isolation",
    desc: "All your data is encrypted at rest (AES-256) and in transit (TLS 1.3). Your semantic memory is isolated strictly to your unique account container.",
  },
];

const SECTIONS = [
  {
    id: "our-guarantee",
    icon: "verified_user",
    title: "Our Absolute Privacy Commitments",
    content: [
      {
        subtitle: "No Human Surveillance",
        text: "The developer and team cannot and will not read your journals, chat logs, or memories. There is no internal back-office dashboard or admin tool for anyone to browse your conversations.",
      },
      {
        subtitle: "Zero Data Selling",
        text: "We will never sell or monetize your personal information or conversations. Our business model is based purely on software subscriptions, not selling user data or attention.",
      },
      {
        subtitle: "Private Model Inference",
        text: "When you interact with Comrade AI, your inputs are passed strictly to generate real-time responses through secure enterprise APIs with zero-data-retention commitments. Your data is not stored or repurposed to train general AI models.",
      },
    ],
  },
  {
    id: "information-we-collect",
    icon: "database",
    title: "Information We Collect",
    content: [
      {
        subtitle: "Account Information",
        text: "When you create an account, we collect your name, email address, and authentication credentials through our identity provider (Clerk). We never store or see your passwords directly.",
      },
      {
        subtitle: "Journal & Conversation Data",
        text: "Your journal entries, chat messages, and voice transcripts are encrypted and stored in private databases and secure memory containers solely to provide you with your personal companion experience.",
      },
      {
        subtitle: "Usage Analytics",
        text: "We collect strictly anonymized, aggregated telemetry (via Vercel Analytics) such as performance metrics to keep the app fast and reliable. This data contains no personal content and cannot identify you.",
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
        text: "Your journals and conversations are used exclusively to power your AI companion's memory and empathetic responses. No one else has access to this contextual stream.",
      },
      {
        subtitle: "No Developer Snooping",
        text: "Individual content is never accessed or reviewed by humans. Automated systems operate with strict least-privilege policies to ensure your thoughts stay confidential.",
      },
      {
        subtitle: "Essential Communication",
        text: "We only send critical account notifications (e.g. security alerts or subscription receipts). We will never spam you or share your email with marketing firms.",
      },
    ],
  },
  {
    id: "data-protection",
    icon: "shield",
    title: "Data Protection & Security",
    content: [
      {
        subtitle: "Enterprise-Grade Encryption",
        text: "All data is encrypted in transit using modern TLS 1.3 and at rest using AES-256. Database records and semantic vector indexes are protected at every tier.",
      },
      {
        subtitle: "Secure Infrastructure",
        text: "Hosted on SOC 2 compliant cloud infrastructure with continuous monitoring, automated security patches, and strict perimeter firewalls.",
      },
      {
        subtitle: "Access Controls",
        text: "Strict cryptographic and container-level access barriers prevent cross-user leakage. Administrative access to raw databases requires hardware multi-factor authentication and is heavily audited.",
      },
    ],
  },
  {
    id: "your-rights",
    icon: "person",
    title: "Your Rights & Total Control",
    content: [
      {
        subtitle: "Instant Data Deletion",
        text: "You can delete individual conversations, journals, or your entire account at any moment. When deleted, all associated chat history and semantic memories are permanently and irreversibly purged from our databases.",
      },
      {
        subtitle: "Full Data Export",
        text: "You own your data. You can request a complete export of your journals and conversations at any time in standard machine-readable JSON/Markdown format.",
      },
      {
        subtitle: "Opt-Out of Analytics",
        text: "You can disable anonymous telemetry in your account settings at any time without impacting your companion features or AI memory.",
      },
    ],
  },
  {
    id: "third-parties",
    icon: "group",
    title: "Third-Party Service Providers",
    content: [
      {
        subtitle: "Enterprise AI Inference",
        text: "AI processing uses enterprise privacy endpoints with strict contractual zero-retention policies. Your private thoughts are not used to train models.",
      },
      {
        subtitle: "Authentication (Clerk)",
        text: "Clerk manages authentication securely. Clerk handles login credentials and never has access to your journal entries or chat conversations.",
      },
      {
        subtitle: "Payment Processing",
        text: "Payment details are processed directly by certified PCI-DSS compliant providers (Dodo Payments). We never handle or store your credit card information.",
      },
    ],
  },
  {
    id: "cookies",
    icon: "cookie",
    title: "Cookies & Tracking",
    content: [
      {
        subtitle: "Essential Cookies Only",
        text: "We only use essential cookies strictly necessary for authenticating your session and keeping you logged in.",
      },
      {
        subtitle: "Zero Advertising Trackers",
        text: "We do not use advertising trackers, Meta Pixels, Google Ads trackers, or cross-site tracking technologies. We never track you across the web.",
      },
    ],
  },
  {
    id: "changes",
    icon: "history",
    title: "Policy Changes & Integrity",
    content: [
      {
        subtitle: "Advance Notice",
        text: "Any material changes to our privacy policy will be announced via email and in-app notice at least 30 days prior. We will never quietly weaken our privacy protections.",
      },
      {
        subtitle: "Direct Contact",
        text: "You can contact our engineering team directly at any time regarding security questions, audits, or data requests.",
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

              <p className="font-satoshi mx-auto mt-4 max-w-[500px] text-center text-[14px] leading-[1.45] font-normal text-white/80 sm:text-[15px]">
                Comrade AI is built on the core principle that your thoughts and conversations are completely private. We never sell, view, or use your data for advertising or model training.
              </p>

              <p className="font-satoshi mt-6 text-[12px] font-semibold tracking-wider text-white/40 uppercase">
                Last updated — {LAST_UPDATED}
              </p>
            </RevealOnScroll>
          </section>

          {/* Core Guarantees Callout Grid */}
          <section className="tablet:px-8 border-t border-white/5 bg-[#0a0a0a] px-4 py-16">
            <div className="section-wrapper">
              <RevealOnScroll className="mb-10 text-center">
                <h2 className="font-instrument text-[28px] font-normal text-white sm:text-[36px]">
                  Our Ironclad Data Protection Guarantees
                </h2>
                <p className="font-satoshi text-sm text-white/60 mt-2 max-w-lg mx-auto">
                  A transparent contract between you and Comrade AI.
                </p>
              </RevealOnScroll>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {GUARANTEES.map((g, i) => (
                  <RevealOnScroll key={i} className="flex">
                    <div className="dark-gradient-card group relative flex w-full flex-col justify-start rounded-[24px] border border-white/12 p-6 shadow-xl transition-all duration-300 hover:border-white/30">
                      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 border border-white/10 transition-colors group-hover:border-white/20 group-hover:bg-white/10">
                        <span className="material-symbols-outlined text-[20px] text-white">
                          {g.icon}
                        </span>
                      </div>
                      <h3 className="font-satoshi text-[16px] font-medium text-white mb-2">
                        {g.title}
                      </h3>
                      <p className="font-satoshi text-[13px] leading-relaxed text-white/60">
                        {g.desc}
                      </p>
                    </div>
                  </RevealOnScroll>
                ))}
              </div>
            </div>
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
