"use client";

import { createContext, use, useMemo } from "react";
import { api } from "@/trpc/react";

type Journal = {
  id: number;
  userId: number;
  title: string | null;
  content: string;
  mood: string | null;
  icon: string | null;
  color: string | null;
  summary: string | null;
  summarizedAt: Date | null;
  memorySyncedAt: Date | null;
  createdAt: Date | null;
  updatedAt: Date | null;
};

type JournalsContextValue = {
  journals: Journal[];
  isLoading: boolean;
  refetch: () => void;
};

const JournalsContext = createContext<JournalsContextValue | null>(null);

export function JournalsProvider({ children }: { children: React.ReactNode }) {
  const { data, isLoading, refetch } = api.journal.getAllJournals.useQuery(
    undefined,
    { staleTime: Infinity },
  );

  const value = useMemo(
    () => ({
      journals: data?.journals ?? [],
      isLoading,
      refetch,
    }),
    [data?.journals, isLoading, refetch],
  );

  return (
    <JournalsContext.Provider value={value}>
      {children}
    </JournalsContext.Provider>
  );
}

const fallback: JournalsContextValue = {
  journals: [],
  isLoading: false,
  refetch: () => { /* empty */ },
};

export function useJournals() {
  const context = use(JournalsContext);
  return context ?? fallback;
}
