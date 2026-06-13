"use client";

import { useEffect, useRef, useImperativeHandle } from "react";
import type React from "react";
import { Crepe } from "@milkdown/crepe";
import "@milkdown/crepe/theme/common/style.css";
import "@milkdown/crepe/theme/classic.css";

export interface MilkdownEditorHandle {
  getMarkdown: () => string;
}

interface MilkdownEditorProps {
  onChange?: () => void;
  defaultValue?: string;
  ref?: React.Ref<MilkdownEditorHandle>;
}

export function MilkdownEditor({ onChange, defaultValue, ref }: MilkdownEditorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const crepeRef = useRef<Crepe | null>(null);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  useImperativeHandle(ref, () => ({
    getMarkdown: () => crepeRef.current?.getMarkdown() ?? "",
  }));

  useEffect(() => {
    if (!containerRef.current) return;

    const crepe = new Crepe({
      root: containerRef.current,
      defaultValue: defaultValue ?? "# Start writing...\n\nYour thoughts here.",
    });

    crepe.on((listener) => {
      listener.markdownUpdated(() => {
        onChangeRef.current?.();
      });
    });

    crepe.create().then(() => {
      crepeRef.current = crepe;
    }).catch(console.error);

    return () => {
      const crepeInstance = crepeRef.current;
      crepeRef.current = null;
      if (crepeInstance) {
        void crepeInstance.destroy().catch(console.error);
      }
    };
  }, [defaultValue]);

  return <div ref={containerRef} className="milkdown-crepe-container" />;
}
