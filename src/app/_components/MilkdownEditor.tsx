"use client";

import { useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import { Crepe } from "@milkdown/crepe";
import "@milkdown/crepe/theme/common/style.css";
import "@milkdown/crepe/theme/classic.css";

export interface MilkdownEditorHandle {
  getMarkdown: () => string;
}

interface MilkdownEditorProps {
  onChange?: () => void;
  defaultValue?: string;
}

export const MilkdownEditor = forwardRef<MilkdownEditorHandle, MilkdownEditorProps>(
  function MilkdownEditor({ onChange, defaultValue }, ref) {
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
        defaultValue: defaultValue || "# Start writing...\n\nYour thoughts here.",
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
        crepeRef.current = null;
        void crepe.destroy().catch(console.error);
      };
    }, []);

    return <div ref={containerRef} className="milkdown-crepe-container" />;
  }
);
