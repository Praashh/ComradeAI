"use client";

import { useState } from "react";
import Masthead from "@/app/_components/Masthead";
import { MilkdownEditorClient } from "@/app/_components/MilkdownEditorClient";
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from "@/components/ui/sidebar";

function getFormattedDate() {
  return "FRIDAY, MAY 29, 2026";
}

function SidebarToggler() {
  const { toggleSidebar } = useSidebar();
  return (
    <button
      onClick={toggleSidebar}
      className="flex items-center gap-1.5 text-xs text-[var(--ink-2)] hover:text-[var(--ink)] transition-colors cursor-pointer"
      title="Toggle Sidebar"
    >
      <svg
        className="w-4.5 h-4.5 text-[var(--ink-2)]"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 4.5v15m6-15v15m-12-3h18c.6 0 1-.4 1-1V5c0-.6-.4-1-1-1H3c-.6 0-1 .4-1 1v13c0 .6.4 1 1 1z"
        />
      </svg>
      <span className="text-[10px] tracking-wider uppercase font-medium">focus mode</span>
    </button>
  );
}

function ChatPageContent() {
  const [decorTab, setDecorTab] = useState<"page" | "plain">("plain");
  const [photoTab, setPhotoTab] = useState<"chat" | "uploads">("chat");

  return (
    <div className="chat-workspace">
      <Masthead />
      <SidebarProvider defaultOpen={true}>
        <div className="flex flex-1 w-full relative overflow-hidden">
          {/* Custom Lefthand Sidebar using ShadCN sidebar components */}
          <Sidebar side="left" collapsible="icon">
            <SidebarHeader className="p-4 border-b border-[var(--rule-soft)]">
              <div className="flex items-center justify-between">
                <span className="font-serif italic text-lg text-[var(--ink)] tracking-wide">Decorations</span>
              </div>
            </SidebarHeader>
            <SidebarContent className="p-2 gap-4">

              {/* DECORATIONS SECTION */}
              <SidebarGroup>
                <SidebarGroupLabel className="[font-family:var(--body)] text-[0.72rem] font-semibold tracking-[0.16em] uppercase text-ink-2 mb-3 flex items-center justify-between px-0">
                  Decorations
                </SidebarGroupLabel>
                <SidebarGroupContent>
                  <div className="flex bg-paper-3 p-[3px] rounded border border-rule-soft w-full">
                    <button
                      onClick={() => setDecorTab("page")}
                      className={`bg-transparent border-0 text-ink-2 px-3 py-[6px] rounded-[2px] [font-family:var(--body)] text-[0.8rem] font-medium tracking-[0.06em] uppercase cursor-pointer transition-all duration-[250ms] flex-1 text-center hover:text-ink${decorTab === "page" ? " bg-paper text-ink shadow-[0_1px_3px_rgba(33,28,22,0.12)] !font-semibold" : ""}`}
                    >
                      Page
                    </button>
                    <button
                      onClick={() => setDecorTab("plain")}
                      className={`bg-transparent border-0 text-ink-2 px-3 py-[6px] rounded-[2px] [font-family:var(--body)] text-[0.8rem] font-medium tracking-[0.06em] uppercase cursor-pointer transition-all duration-[250ms] flex-1 text-center hover:text-ink${decorTab === "plain" ? " bg-paper text-ink shadow-[0_1px_3px_rgba(33,28,22,0.12)] !font-semibold" : ""}`}
                    >
                      Plain
                    </button>
                  </div>
                </SidebarGroupContent>
              </SidebarGroup>

              {/* PHOTOS SECTION */}
              <SidebarGroup>
                <div className="flex items-center justify-between [font-family:var(--body)] text-[0.72rem] font-semibold tracking-[0.16em] uppercase text-ink-2 mb-3">
                  <SidebarGroupLabel className="px-0">
                    Photos
                  </SidebarGroupLabel>
                  <a href="#" className="text-[10px] lowercase tracking-normal text-[var(--red)] hover:underline normal-case">
                    tap to add ⌃
                  </a>
                </div>
                <SidebarGroupContent>
                  <SidebarMenu className="flex flex-row gap-4 border-b border-[var(--rule-soft)] mb-3 pb-1">
                    <SidebarMenuItem>
                      <button
                        className={`bg-transparent border-0 cursor-pointer [font-family:var(--body)] text-[0.8rem] tracking-[0.08em] uppercase pb-[6px] transition-all duration-200 border-b-2${photoTab === "chat" ? " text-red border-red" : " text-ink-3 border-transparent hover:text-ink"}`}
                        onClick={() => setPhotoTab("chat")}
                      >
                        Chat
                      </button>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <button
                        className={`bg-transparent border-0 cursor-pointer [font-family:var(--body)] text-[0.8rem] tracking-[0.08em] uppercase pb-[6px] transition-all duration-200 border-b-2${photoTab === "uploads" ? " text-red border-red" : " text-ink-3 border-transparent hover:text-ink"}`}
                        onClick={() => setPhotoTab("uploads")}
                      >
                        Uploads
                      </button>
                    </SidebarMenuItem>
                  </SidebarMenu>
                  <div className="[font-family:var(--body)] italic text-[0.88rem] leading-[1.6] text-ink-2 px-5 py-4 bg-[rgba(236,230,215,0.4)] border-[1.5px] border-dashed border-rule-soft rounded mt-[10px] text-center shadow-[inset_0_1px_3px_rgba(33,28,22,0.02)]">
                    no chat photos yet. share one with maya, sage, theo, or luna and they&apos;ll appear here.
                  </div>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>

            <SidebarFooter className="p-4 border-t border-[var(--rule-soft)]">
              <SidebarMenu className="gap-2">
                <SidebarMenuItem>
                  <SidebarMenuButton className="sidebar-action-btn h-10 w-full justify-center">
                    <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                    </svg>
                    <span>Upload Photo</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton className="sidebar-action-btn h-10 w-full justify-center">
                    <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
                    </svg>
                    <span>Camera</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton className="sidebar-action-btn apply-changes-btn h-10 w-full justify-center">
                    <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    <span>Apply Changes</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarFooter>
          </Sidebar>

          {/* Main Writing Pad Editor Canvas */}
          <main className="flex-1 min-h-screen px-6 py-12 overflow-y-auto">
            <div className="mx-auto max-w-2xl relative">

              {/* Header inside writing space displaying Date & Sidebar Toggle focus controls */}
              <div className="flex items-center justify-between border-b border-[var(--rule-soft)] pb-3 mb-6">
                <span className="text-xs uppercase tracking-widest text-[var(--ink-2)] font-mono">
                  {getFormattedDate()}
                </span>
                <SidebarToggler />
              </div>

              {/* Crepe Editor */}
              <MilkdownEditorClient />
            </div>
          </main>
        </div>
      </SidebarProvider>
    </div>
  );
}

export default function ChatPage() {
  return <ChatPageContent />;
}
