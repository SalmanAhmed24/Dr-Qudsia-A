"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Talk } from "@/lib/data";

gsap.registerPlugin(ScrollTrigger);

export default function Talks({ talks }: { talks: Talk[] }) {
  const [open, setOpen] = useState(false);
  const listRef = useRef<HTMLOListElement>(null);
  const first = useRef(true);

  useEffect(() => {
    if (first.current) { first.current = false; return; }
    if (open && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.fromTo(
        listRef.current!.querySelectorAll(".talk.more"),
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, stagger: 0.035, duration: 0.5, ease: "power3.out" }
      );
    }
    ScrollTrigger.refresh();
  }, [open]);

  return (
    <div>
      <ol className={`talks${open ? " open" : ""}`} id="talks" ref={listRef}>
        {talks.map((t) => (
          <li className={`talk${t.featured ? "" : " more"}`} key={t.title}>
            <time dateTime={t.date}>{t.year}</time>
            <div>
              <h3>{t.title}</h3>
              <p>{t.where}</p>
            </div>
          </li>
        ))}
      </ol>
      <button
        className="btn btn-soft talks-toggle"
        type="button"
        aria-expanded={open}
        aria-controls="talks"
        onClick={() => setOpen((o) => !o)}
      >
        {open ? "Show fewer" : `Show all ${talks.length} papers`}
      </button>
    </div>
  );
}
