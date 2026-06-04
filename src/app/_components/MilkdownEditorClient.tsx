"use client";

import dynamic from "next/dynamic";
import { forwardRef } from "react";
import type { MilkdownEditorHandle } from "@/app/_components/MilkdownEditor";

const MilkdownEditor = dynamic(
  () => import("@/app/_components/MilkdownEditor").then((m) => m.MilkdownEditor),
  { ssr: false },
);

interface MilkdownEditorClientProps {
  onChange?: () => void;
  defaultValue?: string;
}

export const MilkdownEditorClient = forwardRef<MilkdownEditorHandle, MilkdownEditorClientProps>(
  function MilkdownEditorClient({ onChange, defaultValue }, ref) {
    return <MilkdownEditor ref={ref} onChange={onChange} defaultValue={defaultValue} />;
  }
);
