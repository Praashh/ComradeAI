"use client";

import { useEffect, useRef } from "react";
import { Crepe } from "@milkdown/crepe";
import "@milkdown/crepe/theme/common/style.css";
import "@milkdown/crepe/theme/classic.css";

export function MilkdownEditor() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const crepe = new Crepe({
      root: ref.current,
      defaultValue: "# Start writing...\n\nYour thoughts here.",
    });

    crepe.create().catch(console.error);

    return () => {
      // crepe.destroy returns a Promise
      void crepe.destroy().catch(console.error);
    };
  }, []);

  return <div ref={ref} className="milkdown-crepe-container" />;
}
