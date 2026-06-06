"use client";

import { createContext, useContext } from "react";
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

  return (
    <JournalsContext.Provider
      value={{
        journals: data?.journals ?? [],
        isLoading,
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        refetch,
      }}
    >
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
  const context = useContext(JournalsContext);
  return context ?? fallback;
}
