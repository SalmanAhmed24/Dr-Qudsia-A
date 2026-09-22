"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { Flip } from "gsap/Flip";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitHeading from "./SplitHeading";
import { FILTERS, PUBLICATIONS, filterColor, filterLabel, isRegion, type FilterKey } from "@/lib/data";

gsap.registerPlugin(Flip, ScrollTrigger);

const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

type Props = { onRegion: (key: FilterKey | null, hover: boolean) => void };

export default function Research({ onRegion }: Props) {
  const [filter, setFilter] = useState<FilterKey>("all");
  const rootRef = useRef<HTMLElement>(null);
  const flipState = useRef<Flip.FlipState | null>(null);
  const activeRef = useRef<FilterKey>("all");
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const targets = () => rootRef.current!.querySelectorAll<HTMLElement>(".pub, .chip-pill");

  const select = (key: FilterKey) => {
    if (key === filter) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    flipState.current = reduce ? null : Flip.getState(targets());
    activeRef.current = key;
    setFilter(key);
    onRegion(key === "all" ? null : key, false);
  };

  // Animate from the captured layout to the new one, like Framer Motion's layout animations.
  useIsoLayoutEffect(() => {
    const state = flipState.current;
    if (!state) {
      ScrollTrigger.refresh();
      return;
    }
    flipState.current = null;
    const flip = Flip.from(state, {
      targets: targets(),
      duration: 0.65,
      ease: "power3.inOut",
      absolute: true,
      nested: true,
      onEnter: (els) =>
        gsap.fromTo(els, { opacity: 0, scale: 0.94, y: 16 }, { opacity: 1, scale: 1, y: 0, duration: 0.55, ease: "back.out(1.6)", delay: 0.12 }),
      onLeave: (els) => gsap.to(els, { opacity: 0, scale: 0.94, duration: 0.3 }),
      onComplete: () => ScrollTrigger.refresh(),
    });
    return () => {
      flip.progress(1).kill();
    };
  }, [filter]);

  useEffect(() => () => clearTimeout(hoverTimer.current), []);

  const hoverOn = (key: FilterKey) => {
    clearTimeout(hoverTimer.current);
    hoverTimer.current = setTimeout(() => {
      if (isRegion(key)) onRegion(key, true);
    }, 120);
  };
  const hoverOff = () => {
    clearTimeout(hoverTimer.current);
    hoverTimer.current = setTimeout(() => {
      const a = activeRef.current;
      onRegion(a === "all" ? null : a, false);
    }, 200);
  };

  const shown = PUBLICATIONS.filter((p) => filter === "all" || p.regions.includes(filter as never)).length;
  const long = FILTERS.find((f) => f.key === filter)?.long;

  return (
    <section className="research" id="research" aria-labelledby="research-title" ref={rootRef}>
      <div className="sec-head">
        <SplitHeading id="research-title">Research that follows the fault lines</SplitHeading>
        <p>Peer-reviewed work on terrorism, proxy forces, maritime rivalry and foreign policy. Pick a region and the globe turns to meet it.</p>
      </div>

      <div className="chips" role="group" aria-label="Filter publications by region">
        {FILTERS.map((f) => {
          const on = f.key === filter;
          return (
            <button
              key={f.key}
              className="chip"
              type="button"
              aria-pressed={on}
              style={{ "--c": f.color } as React.CSSProperties}
              onClick={() => select(f.key)}
            >
              <i aria-hidden="true" />
              {f.label}
              {on && <span className="chip-pill" data-flip-id="chip-pill" aria-hidden="true" />}
            </button>
          );
        })}
      </div>

      <p className="count" aria-live="polite">
        {filter === "all" ? `Showing all ${PUBLICATIONS.length} articles` : `Showing ${shown} of ${PUBLICATIONS.length} articles on ${long}`}
      </p>

      <ol className="pubs" reversed>
        {PUBLICATIONS.map((p) => {
          const visible = filter === "all" || p.regions.includes(filter as never);
          const first = p.regions[0];
          return (
            <li
              key={p.title}
              className={`pub${visible ? "" : " hide"}`}
              data-flip-id={p.title}
              style={{ "--c": filterColor(first) } as React.CSSProperties}
              onMouseEnter={() => hoverOn(first)}
              onMouseLeave={hoverOff}
              onFocus={() => hoverOn(first)}
              onBlur={hoverOff}
            >
              <article>
                <h3>{p.title}</h3>
                <div className="pub-meta">
                  <span className="pub-year">{p.year}</span>
                  <span>{p.coauthors}</span>
                  <span>{p.venue}</span>
                </div>
                <div className="tags">
                  {p.regions.map((r) => (
                    <span key={r} className="tag" style={{ "--c": filterColor(r) } as React.CSSProperties}>
                      {filterLabel(r)}
                    </span>
                  ))}
                  <span className="tag" style={{ "--c": p.category === "X" ? "var(--sun)" : "var(--line)" } as React.CSSProperties}>
                    {p.category} category
                  </span>
                </div>
              </article>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
