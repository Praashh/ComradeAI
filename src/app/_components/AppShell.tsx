"use client";

import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/app/_components/AppSidebar";
import { MobileBottomNav } from "@/app/_components/MobileBottomNav";

interface AppShellProps {
  children: React.ReactNode;
  showMobileNav?: boolean;
  focusMode?: boolean;
}

export function AppShell({
  children,
  showMobileNav = true,
  focusMode = false,
}: AppShellProps) {
  return (
    <SidebarProvider className="landing-theme layout-locked h-dvh overflow-hidden bg-[#0a0a0a] text-white">
      {!focusMode && <AppSidebar />}
      <SidebarInset className="!h-dvh !max-h-dvh flex flex-col overflow-hidden bg-[#0a0a0a]">
        {!focusMode && (
          <header className="w-full shrink-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/10 flex justify-between items-center px-4 py-3 sm:px-6 shadow-sm">
            <div className="flex items-center gap-2">
              <SidebarTrigger />
              <Link href="/" className="font-instrument text-xl font-normal text-white tablet:hidden">
                ComradeAI
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
        )}
        {children}
      </SidebarInset>
      {showMobileNav && !focusMode && <MobileBottomNav />}
    </SidebarProvider>
  );
}
