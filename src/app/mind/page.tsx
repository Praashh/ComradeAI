"use client";

import { useCallback, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import Masthead from "@/app/_components/Masthead";
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
  bg: "#ece6d7", // --paper
  docFill: "#e4dcc9", // --paper-2
  docStroke: "rgba(33, 28, 22, 0.24)", // --rule
  docInnerFill: "#dcd3bd", // --paper-3
  memFill: "#e4dcc9", // --paper-2
  memFillHover: "#dcd3bd", // --paper-3
  memStrokeDefault: "rgba(33, 28, 22, 0.1)", // --rule-soft
  accent: "#cb3a28", // --red
  textPrimary: "#211c16", // --ink
  textSecondary: "#5b544a", // --ink-2
  textMuted: "#8c8473", // --ink-3
  edgeDerives: "#cb3a28", // --red
  edgeUpdates: "#a22c1d", // --red-d
  edgeExtends: "#8c8473", // --ink-3
  memBorderForgotten: "#8c8473", // --ink-3
  memBorderExpiring: "#a22c1d", // --red-d
  memBorderRecent: "#cb3a28", // --red
  glowColor: "rgba(203, 58, 40, 0.15)", // red glow
  iconColor: "#5b544a", // --ink-2
  popoverBg: "#e4dcc9", // --paper-2
  popoverBorder: "rgba(33, 28, 22, 0.24)", // --rule
  popoverTextPrimary: "#211c16", // --ink
  popoverTextSecondary: "#5b544a", // --ink-2
  popoverTextMuted: "#8c8473", // --ink-3
  controlBg: "#dcd3bd", // --paper-3
  controlBorder: "rgba(33, 28, 22, 0.1)", // --rule-soft
};

export default function MindPage() {
  const [page, setPage] = useState<number>(1);
  const limit = 100;

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
    <div className="flex flex-col h-screen overflow-hidden bg-[var(--paper)]">
      <div className="shrink-0">
        <Masthead />
      </div>
      <main className="flex-1 min-h-0 overflow-hidden">
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
            <p className="font-disp italic text-lg text-[var(--ink-3)]">
              No memories yet
            </p>
            <p className="font-body text-sm text-[var(--ink-3)] mt-2">
              Start writing journals to see your mind graph grow.
            </p>
          </div>
        </MemoryGraph>
      </main>
    </div>
  );
}
