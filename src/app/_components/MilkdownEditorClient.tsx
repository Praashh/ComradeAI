"use client";

import dynamic from "next/dynamic";

const MilkdownEditor = dynamic(
  () => import("@/app/_components/MilkdownEditor").then((m) => m.MilkdownEditor),
  { ssr: false },
);

export function MilkdownEditorClient() {
  return <MilkdownEditor />;
}
