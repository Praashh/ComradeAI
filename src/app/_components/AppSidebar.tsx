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

const NAV_ITEMS = [
  { label: "Journal", href: "/write", icon: "book_5" },
  { label: "Chat", href: "/chat", icon: "chat_bubble" },
  { label: "Voice", href: "/talk", icon: "mic" },
];

const FOOTER_ITEMS = [
  { label: "Help", href: "/onboarding", icon: "help" },
  { label: "Privacy", href: "/onboarding", icon: "security" },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <TooltipProvider delay={0}>
      <Sidebar
        collapsible="icon"
        className="border-r border-black/5 bg-surface-container-low/80 backdrop-blur-md"
      >
        <SidebarHeader className="px-3 py-4 group-data-[collapsible=icon]:px-2 group-data-[collapsible=icon]:py-3">
          <Link href="/" className="flex items-center gap-2.5 overflow-hidden">
            <span
              className="material-symbols-outlined text-primary shrink-0 size-5 flex items-center justify-center"
              style={{ fontSize: "22px", fontVariationSettings: "'FILL' 1" }}
            >
              favorite
            </span>
            <span className="font-semibold text-primary truncate text-sm tracking-tight group-data-[collapsible=icon]:hidden">
              Comrade AI
            </span>
          </Link>
        </SidebarHeader>

        <SidebarContent className="group-data-[collapsible=icon]:pt-2">
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu className="gap-1">
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
                            ? "bg-primary text-on-primary hover:bg-primary/90 hover:text-on-primary data-active:bg-primary data-active:text-on-primary rounded-xl"
                            : "text-on-secondary-container hover:bg-secondary-container/50 rounded-xl"
                        }
                      >
                        <span
                          className="material-symbols-outlined shrink-0 size-5 flex items-center justify-center"
                          style={{ fontSize: "20px" }}
                        >
                          {item.icon}
                        </span>
                        <span className="truncate font-medium text-sm group-data-[collapsible=icon]:hidden">
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
          <SidebarSeparator className="mb-2 group-data-[collapsible=icon]:hidden" />
          <SidebarMenu className="gap-1">
            {FOOTER_ITEMS.map((item) => (
              <SidebarMenuItem key={item.label}>
                <SidebarMenuButton
                  tooltip={item.label}
                  render={<Link href={item.href} />}
                  className="text-secondary hover:bg-surface-container rounded-xl"
                >
                  <span
                    className="material-symbols-outlined shrink-0 size-5 flex items-center justify-center"
                    style={{ fontSize: "20px" }}
                  >
                    {item.icon}
                  </span>
                  <span className="truncate text-sm group-data-[collapsible=icon]:hidden">
                    {item.label}
                  </span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarFooter>

        <SidebarRail />
      </Sidebar>
    </TooltipProvider>
  );
}
