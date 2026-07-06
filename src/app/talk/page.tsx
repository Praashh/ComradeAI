"use client";

import { useEffect } from "react";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/app/_components/AppSidebar";
import VoiceAgent from "@/app/_components/VoiceAgent";

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
    <SidebarProvider className="landing-theme layout-locked h-dvh overflow-hidden bg-background text-on-background">
      <AppSidebar />
      <SidebarInset className="!h-dvh !max-h-dvh flex flex-col overflow-hidden">
        {/* Top Shell Navigation */}
        <header className="w-full shrink-0 z-50 bg-surface/70 backdrop-blur-xl border-b border-black/5 flex justify-between items-center px-md py-sm shadow-sm">
          <div className="flex items-center gap-2">
            <SidebarTrigger />
            <Link href="/" className="font-display-md text-display-md font-semibold text-primary tablet:hidden">
              Comrade AI
            </Link>
          </div>
          <div className="flex items-center gap-md">
            <div className="hidden tablet:flex gap-md items-center">
              <Link href="/write" className="text-secondary hover:text-primary transition-colors font-body-md">
                Journal
              </Link>
              <Link href="/chat" className="text-secondary hover:text-primary transition-colors font-body-md">
                Chat
              </Link>
              <Link href="/talk" className="text-primary border-b-2 border-primary font-body-md">
                Voice
              </Link>
            </div>
            <div className="flex items-center">
              <UserButton
                appearance={{
                  elements: {
                    userButtonAvatarBox: "w-[32px] h-[32px] border border-black/5",
                  },
                }}
              />
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 min-h-0 flex items-center justify-center overflow-y-auto">
          <VoiceAgent />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
