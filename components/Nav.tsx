"use client";

import { useEffect, useState } from "react";

const LINKS = [
  { href: "#research", label: "Research" },
  { href: "#journey", label: "Journey" },
  { href: "#teaching", label: "Teaching" },
  { href: "#speaking", label: "Speaking" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className={`nav${scrolled ? " scrolled" : ""}`} aria-label="Main">
      <a className="brand" href="#top" aria-label="Dr Qudsia Akram, back to top">
        <span className="brand-dot" aria-hidden="true" />
        Qudsia Akram
      </a>
      <ul>
        {LINKS.map((l) => (
          <li key={l.href}>
            <a href={l.href}>{l.label}</a>
          </li>
        ))}
      </ul>
      <a className="btn btn-ink magnetic" href="#contact">
        Get in touch
      </a>
    </nav>
  );
}
