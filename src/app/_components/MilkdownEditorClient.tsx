"use client";

import dynamic from "next/dynamic";
import { forwardRef } from "react";
import type { MilkdownEditorHandle } from "@/app/_components/MilkdownEditor";

const MilkdownEditor = dynamic(
  () => import("@/app/_components/MilkdownEditor").then((m) => m.MilkdownEditor),
  { ssr: false },
);

export const MilkdownEditorClient = forwardRef<MilkdownEditorHandle>(
  function MilkdownEditorClient(_props, ref) {
    return <MilkdownEditor ref={ref} />;
  }
);
