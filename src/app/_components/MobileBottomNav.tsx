"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { label: "Journal", href: "/write", icon: "book_5" },
  { label: "Chat", href: "/chat", icon: "chat_bubble" },
  { label: "Voice", href: "/talk", icon: "mic" },
  { label: "Mind", href: "/mind", icon: "hub" },
];

export function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="tablet:hidden fixed bottom-0 left-0 right-0 bg-[#0a0a0a]/95 backdrop-blur-xl border-t border-white/10 px-4 py-2.5 flex justify-around items-center z-50 shadow-2xl">
      {NAV_ITEMS.map((item) => {
        const isActive =
          pathname === item.href ||
          (item.href !== "/" && pathname.startsWith(item.href));

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center gap-1 px-3 py-1 rounded-xl transition-all ${
              isActive ? "text-white scale-105 font-bold" : "text-white/40 hover:text-white/80"
            }`}
          >
            <span
              className={`material-symbols-outlined text-[22px] transition-transform ${
                isActive ? "text-white scale-110" : "text-white/50"
              }`}
            >
              {item.icon}
            </span>
            <span className="text-[10px] tracking-wide font-satoshi font-medium">
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
