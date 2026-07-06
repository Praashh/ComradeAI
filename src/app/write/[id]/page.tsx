"use client";

import { use } from "react";
import JournalDashboard from "@/app/_components/JournalDashboard";

export default function WriteJournalPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const journalId = Number(id);

  return <JournalDashboard activeJournalId={journalId} />;
}

