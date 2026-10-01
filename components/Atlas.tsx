"use client";

import { useCallback, useRef } from "react";
import Globe, { type GlobeApi } from "./Globe";
import Research from "./Research";
import type { FilterKey } from "@/lib/data";

/** The research section and its globe: filters and hovers in the list steer the globe. */
export default function Atlas() {
  const globe = useRef<GlobeApi | null>(null);
  const onRegion = useCallback((key: FilterKey | null, hover: boolean) => globe.current?.focus(key, hover), []);
  return <Research onRegion={onRegion} globe={<Globe apiRef={globe} />} />;
}
