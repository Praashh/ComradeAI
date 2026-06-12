"use client";

import dynamic from "next/dynamic";
import type React from "react";
import type { MilkdownEditorHandle } from "@/app/_components/MilkdownEditor";

const MilkdownEditor = dynamic(
  () => import("@/app/_components/MilkdownEditor").then((m) => m.MilkdownEditor),
  { ssr: false },
);

interface MilkdownEditorClientProps {
  onChange?: () => void;
  defaultValue?: string;
  ref?: React.Ref<MilkdownEditorHandle>;
}

export const MilkdownEditorClient = function MilkdownEditorClient({
  onChange,
  defaultValue,
  ref,
}: MilkdownEditorClientProps) {
  return <MilkdownEditor ref={ref} onChange={onChange} defaultValue={defaultValue} />;
};
