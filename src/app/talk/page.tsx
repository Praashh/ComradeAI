"use client";

import { useEffect } from "react";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/app/_components/AppSidebar";
import VoiceAgent from "@/app/_components/VoiceAgent";
import { MobileBottomNav } from "@/app/_components/MobileBottomNav";

export default function TalkPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.body.classList.add("layout-locked");
    document.documentElement.classList.add("layout-locked");
    return () => {
      document.body.classList.remove("layout-locked");
      document.documentElement.classList.remove("layout-locked");
    };
  }, []);

  return (
    <SidebarProvider className="landing-theme layout-locked h-dvh overflow-hidden bg-[#0a0a0a] text-white">
      <AppSidebar />
      <SidebarInset className="!h-dvh !max-h-dvh flex flex-col overflow-hidden bg-[#0a0a0a]">
        {/* Top Shell Navigation */}
        <header className="w-full shrink-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/10 flex justify-between items-center px-4 py-3 sm:px-6 shadow-sm">
          <div className="flex items-center gap-2">
            <SidebarTrigger />
            <Link href="/" className="group flex items-center gap-1.5 tablet:hidden">
              <span className="font-instrument text-xl font-normal text-white">
                ComradeAI
              </span>
              <span className="font-satoshi -translate-y-1 text-[8.5px] font-semibold tracking-wider uppercase px-1.5 py-[1.5px] leading-none rounded-full border border-white/15 bg-white/[0.08] text-white/60 select-none">
                BETA
              </span>
            </Link>
          </div>
          <div className="flex items-center">
            <UserButton
              appearance={{
                elements: {
                  userButtonAvatarBox: "w-[32px] h-[32px] border border-white/20",
                },
              }}
            />
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 min-h-0 flex items-center justify-center overflow-y-auto bg-[#0a0a0a] p-4 pb-20 tablet:pb-4">
          <VoiceAgent />
        </main>
      </SidebarInset>
      <MobileBottomNav />
    </SidebarProvider>
  );
}
