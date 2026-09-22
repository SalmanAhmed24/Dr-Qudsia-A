"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import SplitHeading from "./SplitHeading";
import { TIMELINE } from "@/lib/data";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function Journey() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLOListElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      // Desktop: the section pins and the timeline scrolls sideways.
      mm.add("(min-width: 901px) and (prefers-reduced-motion: no-preference)", () => {
        const sec = root.current!, tr = track.current!;
        const dist = () => Math.max(0, tr.scrollWidth - window.innerWidth);
        const start = () => (sec.offsetHeight < window.innerHeight ? "center center" : "top top");
        const tw = gsap.to(tr, {
          x: () => -dist(),
          ease: "none",
          scrollTrigger: { trigger: sec, start, end: () => `+=${dist()}`, pin: true, scrub: 0.8, invalidateOnRefresh: true, anticipatePin: 1 },
        });
        gsap.to(".track-rail i", {
          scaleX: 1,
          ease: "none",
          scrollTrigger: { trigger: sec, start, end: () => `+=${dist()}`, scrub: 0.8, invalidateOnRefresh: true },
        });
        gsap.utils.toArray<HTMLElement>(".stop").forEach((s) => {
          gsap.from(s, {
            rotate: 4, y: 40, scale: 0.92, duration: 0.8, ease: "back.out(1.4)",
            scrollTrigger: { trigger: s, containerAnimation: tw, start: "left 95%", toggleActions: "play none none reverse" },
          });
        });
      });
      // Phones: a stacked list with a springy entrance.
      mm.add("(max-width: 900px) and (prefers-reduced-motion: no-preference)", () => {
        gsap.utils.toArray<HTMLElement>(".stop").forEach((s) => {
          gsap.from(s, { y: 40, scale: 0.96, duration: 0.8, ease: "back.out(1.4)", scrollTrigger: { trigger: s, start: "top 90%", once: true } });
        });
      });
    },
    { scope: root }
  );

  return (
    <section className="journey" id="journey" aria-labelledby="journey-title" ref={root}>
      <div className="sec-head">
        <SplitHeading id="journey-title">From student researcher to building a PhD programme</SplitHeading>
        <p>Two decades between Lahore and Islamabad, from a first thesis on Afghanistan to leading doctoral teaching.</p>
      </div>
      <div className="track-outer">
        <ol className="track" ref={track}>
          {TIMELINE.map((t) => (
            <li className="stop" key={t.title} style={{ "--c": t.color } as React.CSSProperties}>
              <time dateTime={t.year}>{t.label}</time>
              <h3>{t.title}</h3>
              <p>{t.body}</p>
            </li>
          ))}
        </ol>
        <div className="track-rail" aria-hidden="true">
          <i />
        </div>
      </div>
    </section>
  );
}
