"use client";

import { useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import { Crepe } from "@milkdown/crepe";
import "@milkdown/crepe/theme/common/style.css";
import "@milkdown/crepe/theme/classic.css";

export interface MilkdownEditorHandle {
  getMarkdown: () => string;
}

export const MilkdownEditor = forwardRef<MilkdownEditorHandle>(
  function MilkdownEditor(_props, ref) {
    const containerRef = useRef<HTMLDivElement>(null);
    const crepeRef = useRef<Crepe | null>(null);

    useImperativeHandle(ref, () => ({
      getMarkdown: () => crepeRef.current?.getMarkdown() ?? "",
    }));

    useEffect(() => {
      if (!containerRef.current) return;

      const crepe = new Crepe({
        root: containerRef.current,
        defaultValue: "# Start writing...\n\nYour thoughts here.",
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
