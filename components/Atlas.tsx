"use client";

import { useCallback, useRef, type ReactNode } from "react";
import Globe, { type GlobeApi } from "./Globe";
import Research from "./Research";
import type { FilterKey } from "@/lib/data";

/** Hero and research share one sticky globe: filters and hovers in the list steer it. */
export default function Atlas({ hero }: { hero: ReactNode }) {
  const globe = useRef<GlobeApi | null>(null);
  const onRegion = useCallback((key: FilterKey | null, hover: boolean) => globe.current?.focus(key, hover), []);
  return (
    <div className="atlas" id="top">
      {hero}
      <Globe apiRef={globe} />
      <Research onRegion={onRegion} />
    </div>
  );
}
