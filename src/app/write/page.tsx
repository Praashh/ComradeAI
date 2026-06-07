"use client";

import NewJournalDialog from "@/app/_components/NewJournalDialog";
import { Suspense } from "react";

export default function WritePage() {
  return (
    <div className="bg-paper min-h-screen">
      <Suspense fallback={<div>Loading...</div>}>
        <NewJournalDialog defaultOpen>
          <span />
        </NewJournalDialog>
      </Suspense>
    </div>
  );
}
