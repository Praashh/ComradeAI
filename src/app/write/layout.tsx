"use client";

import { JournalsProvider } from "@/lib/journals-context";

export default function WriteLayout({ children }: { children: React.ReactNode }) {
  return <JournalsProvider>{children}</JournalsProvider>;
}
