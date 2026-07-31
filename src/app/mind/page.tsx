"use client";

import { useCallback, useMemo, useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/app/_components/AppSidebar";
import { MobileBottomNav } from "@/app/_components/MobileBottomNav";
import { api } from "@/trpc/react";
import type {
  GraphApiDocument,
  GraphThemeColors,
} from "@supermemory/memory-graph";

const MemoryGraph = dynamic(
  () => import("@supermemory/memory-graph").then((mod) => mod.MemoryGraph),
  { ssr: false },
);

const graphColors: Partial<GraphThemeColors> = {
  bg: "#0a0a0a",
  docFill: "#121212",
  docStroke: "rgba(255, 255, 255, 0.15)",
  docInnerFill: "#181818",
  memFill: "#181818",
  memFillHover: "#222222",
  memStrokeDefault: "rgba(255, 255, 255, 0.1)",
  accent: "#ffffff",
  textPrimary: "#ffffff",
  textSecondary: "rgba(255, 255, 255, 0.7)",
  textMuted: "#858585",
  edgeDerives: "rgba(255, 255, 255, 0.4)",
  edgeUpdates: "rgba(255, 255, 255, 0.3)",
  edgeExtends: "rgba(255, 255, 255, 0.2)",
  memBorderForgotten: "#858585",
  memBorderExpiring: "rgba(255, 255, 255, 0.4)",
  memBorderRecent: "#ffffff",
  glowColor: "rgba(255, 255, 255, 0.15)",
  iconColor: "#ffffff",
  popoverBg: "#141414",
  popoverBorder: "rgba(255, 255, 255, 0.15)",
  popoverTextPrimary: "#ffffff",
  popoverTextSecondary: "rgba(255, 255, 255, 0.7)",
  popoverTextMuted: "#858585",
  controlBg: "#141414",
  controlBorder: "rgba(255, 255, 255, 0.12)",
};

export default function MindPage() {
  const [page, setPage] = useState<number>(1);
  const limit = 100;

  useEffect(() => {
    window.scrollTo(0, 0);
    document.body.classList.add("layout-locked");
    document.documentElement.classList.add("layout-locked");
    return () => {
      document.body.classList.remove("layout-locked");
      document.documentElement.classList.remove("layout-locked");
    };
  }, []);

  const { data, isLoading, error } = api.mind.getDocuments.useQuery({
    page,
    limit,
  });

  const [allDocuments, setAllDocuments] = useState<GraphApiDocument[]>([]);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);

  const documents = useMemo(() => {
    const raw =
      allDocuments.length > 0
        ? allDocuments
        : ((data?.documents ?? []) as GraphApiDocument[]);
    return raw.map((doc) => ({
      ...doc,
      memories: doc.memories ?? [],
    }));
  }, [allDocuments, data?.documents]);

  const hasMore = data?.pagination
    ? data.pagination.currentPage < data.pagination.totalPages
    : false;

  const loadMore = useCallback(async () => {
    if (isLoadingMore) return;
    setIsLoadingMore(true);
    const nextPage = page + 1;
    setPage(nextPage);

    try {
      const res = await fetch("/api/mind/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ page: nextPage, limit }),
      });
      const result = (await res.json()) as { documents: GraphApiDocument[] };
      setAllDocuments((prev) => [
        ...(prev.length > 0 ? prev : documents),
        ...result.documents,
      ]);
    } finally {
      setIsLoadingMore(false);
    }
  }, [page, limit, isLoadingMore, documents]);

  return (
    <SidebarProvider className="landing-theme layout-locked h-dvh overflow-hidden bg-[#0a0a0a] text-white">
      <AppSidebar />
      <SidebarInset className="!h-dvh !max-h-dvh flex flex-col overflow-hidden bg-[#0a0a0a]">
        {/* Top Workspace Shell Navigation */}
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

        {/* Graph Canvas */}
        <main className="flex-1 min-h-0 overflow-hidden relative bg-[#0a0a0a] pb-16 tablet:pb-0">
          <MemoryGraph
            documents={documents}
            isLoading={isLoading}
            error={error instanceof Error ? error : null}
            variant="consumer"
            isLoadingMore={isLoadingMore}
            hasMore={hasMore}
            onLoadMore={loadMore}
            totalCount={documents.length}
            colors={graphColors}
          >
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
              <p className="font-instrument italic text-xl text-white/60">
                No memories recorded yet
              </p>
              <p className="font-satoshi text-sm text-white/40 mt-2">
                Start writing journals to see your mind graph grow.
              </p>
            </div>
          </MemoryGraph>
        </main>
      </SidebarInset>
      <MobileBottomNav />
    </SidebarProvider>
  );
}

