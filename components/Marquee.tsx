"use client";

import { useState } from "react";
import type { Thesis } from "@/lib/data";

function Row({ items, reverse, duration, paused }: { items: Thesis[]; reverse?: boolean; duration: number; paused: boolean }) {
  const [hovered, setHovered] = useState(false);
  const list = (hidden?: boolean) => (
    <ul aria-hidden={hidden || undefined}>
      {items.map((t) => (
        <li className="thesis" key={t.title} style={{ "--c": t.color } as React.CSSProperties}>
          {t.title}
          <span>{t.by}</span>
        </li>
      ))}
    </ul>
  );
  return (
    <div
      className={`marquee${reverse ? " rev" : ""}${paused || hovered ? " paused" : ""}`}
      style={{ "--dur": `${duration}s` } as React.CSSProperties}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="m-row">
        {list()}
        {list(true)}
      </div>
    </div>
  );
}

export default function Marquee({ top, bottom }: { top: Thesis[]; bottom: Thesis[] }) {
  const [paused, setPaused] = useState(false);
  return (
    <div className="supervise">
      <div className="supervise-top">
        <h3>Forty theses supervised, on questions as current as the news</h3>
        <button className="btn btn-soft" type="button" aria-pressed={paused} onClick={() => setPaused((p) => !p)}>
          {paused ? "Resume scrolling" : "Pause scrolling"}
        </button>
      </div>
      <Row items={top} duration={95} paused={paused} />
      <Row items={bottom} duration={110} paused={paused} reverse />
    </div>
  );
}
