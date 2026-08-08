"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { TooltipProvider } from "@/components/ui/tooltip";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { FeedbackDialog } from "./FeedbackDialog";

const NAV_ITEMS = [
  { label: "Journal", href: "/write", icon: "book_5" },
  { label: "Chat", href: "/chat", icon: "chat_bubble" },
  { label: "Voice", href: "/talk", icon: "mic" },
  { label: "Mind", href: "/mind", icon: "hub" },
];

const FOOTER_ITEMS = [
  { label: "Help", href: "https://x.com/10xpraash", icon: "help" },
  { label: "Privacy", href: "/privacy", icon: "security" },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <TooltipProvider delay={0}>
      <Sidebar
        collapsible="icon"
        className="border-r border-white/10 bg-[#0a0a0a] text-white"
      >
        <SidebarHeader className="px-3 py-4 group-data-[collapsible=icon]:px-2 group-data-[collapsible=icon]:py-3">
          <Link href="/" className="flex items-center gap-2.5 overflow-hidden">
            <span className="font-instrument font-normal text-white truncate text-lg tracking-tight group-data-[collapsible=icon]:hidden">
              ComradeAI
            </span>
          </Link>
        </SidebarHeader>

        <SidebarContent className="group-data-[collapsible=icon]:pt-2">
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu className="gap-1.5">
                {NAV_ITEMS.map((item) => {
                  const isActive =
                    pathname === item.href ||
                    pathname.startsWith(item.href + "/");

                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton
                        isActive={isActive}
                        tooltip={item.label}
                        render={<Link href={item.href} />}
                        className={
                          isActive
                            ? "bg-white text-black hover:bg-white/90 hover:text-black data-active:bg-white data-active:text-black font-semibold rounded-xl shadow-md"
                            : "text-white/60 hover:bg-white/10 hover:text-white rounded-xl"
                        }
                      >
                        <span
                          className="material-symbols-outlined shrink-0 size-5 flex items-center justify-center"
                          style={{ fontSize: "20px" }}
                        >
                          {item.icon}
                        </span>
                        <span className="truncate font-satoshi font-medium text-sm group-data-[collapsible=icon]:hidden">
                          {item.label}
                        </span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="pb-4 group-data-[collapsible=icon]:pb-2">
          <SidebarSeparator className="mb-2 bg-white/10 group-data-[collapsible=icon]:hidden" />
          <SidebarMenu className="gap-1">
            {FOOTER_ITEMS.map((item) => (
              <SidebarMenuItem key={item.label}>
                <SidebarMenuButton
                  tooltip={item.label}
                  render={<Link href={item.href} />}
                  className="text-white/50 hover:bg-white/10 hover:text-white rounded-xl"
                >
                  <span
                    className="material-symbols-outlined shrink-0 size-5 flex items-center justify-center"
                    style={{ fontSize: "20px" }}
                  >
                    {item.icon}
                  </span>
                  <span className="truncate font-satoshi text-sm group-data-[collapsible=icon]:hidden">
                    {item.label}
                  </span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}

            {/* Feedback Dialog Trigger */}
            <SidebarMenuItem>
              <FeedbackDialog>
                <SidebarMenuButton
                  tooltip="Feedback"
                  className="text-white/50 hover:bg-white/10 hover:text-white rounded-xl cursor-pointer"
                >
                  <span
                    className="material-symbols-outlined shrink-0 size-5 flex items-center justify-center"
                    style={{ fontSize: "20px" }}
                  >
                    rate_review
                  </span>
                  <span className="truncate font-satoshi text-sm group-data-[collapsible=icon]:hidden">
                    Feedback
                  </span>
                </SidebarMenuButton>
              </FeedbackDialog>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>

        <SidebarRail />
      </Sidebar>
    </TooltipProvider>
  );
}

