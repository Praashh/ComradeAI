"use client";

import { useEffect } from "react";

export function useLayoutLock() {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.body.classList.add("layout-locked");
    document.documentElement.classList.add("layout-locked");
    return () => {
      document.body.classList.remove("layout-locked");
      document.documentElement.classList.remove("layout-locked");
    };
  }, []);
}
