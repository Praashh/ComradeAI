import "@/styles/globals.css";

import { type Metadata } from "next";
import { Instrument_Serif, Newsreader, JetBrains_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { Analytics } from "@vercel/analytics/next";

import { Toaster } from "sonner";
import { TRPCReactProvider } from "@/trpc/react";
import { cn } from "@/lib/utils";

const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' });

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? "https://comrade.ai",
  ),
  title: {
    default: "Comrade AI - A thinking, consoling and understanding AI friend.",
    template: "%s | Comrade AI",
  },
  description:
    "Comrade AI is an AI application, that stores your journal, learns about you from your journals, and console you, understand you and help you in decision making based on your nature, situation or circumstances.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
  openGraph: {
    type: "website",
    siteName: "Comrade AI",
    title: "Comrade AI - A thinking, consoling and understanding AI friend.",
    description:
      "Comrade AI stores your journal, learns about you, and helps you with understanding, consolation, and decision making.",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Comrade AI - Your AI friend",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Comrade AI - A thinking, consoling and understanding AI friend.",
    description:
      "Comrade AI stores your journal, learns about you, and helps you with understanding, consolation, and decision making.",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Comrade AI - Your AI friend",
      },
    ],
  },
};

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-instrument-serif",
});

const newsreader = Newsreader({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-newsreader",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider>
      <html lang="en" className={cn(instrumentSerif.variable, newsreader.variable, "font-mono", jetbrainsMono.variable)}>
        <body className="loaded">
          <TRPCReactProvider>{children}</TRPCReactProvider>
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: "var(--paper-2)",
                color: "var(--ink)",
                border: "1px solid var(--rule-soft)",
                fontFamily: "var(--body)",
              },
            }}
          />
          <Analytics />
        </body>
      </html>
    </ClerkProvider>
  );
}
