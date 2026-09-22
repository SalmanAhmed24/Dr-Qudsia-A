"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/** Page-wide motion: intro, scroll progress, heading reveals, springy magnetic buttons and tilting cards. */
export default function Animations() {
  useGSAP(() => {
    gsap.to(".progress i", { scaleX: 1, ease: "none", scrollTrigger: { start: 0, end: "max", scrub: 0.3 } });

    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      // Opening sequence
      const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
      tl.from(".hero h1 .ch", { yPercent: 115, rotate: 6, duration: 1.1, stagger: 0.035 })
        .from(".hero h1 .grad", { yPercent: 115, duration: 1.2 }, 0.25)
        .from(".hero .reveal", { y: 24, opacity: 0, duration: 0.9, stagger: 0.08 }, "-=.8")
        .from(".nav", { y: -20, opacity: 0, duration: 0.8 }, 0.2);

      gsap.utils.toArray<HTMLElement>("[data-count]").forEach((el) => {
        const end = Number(el.dataset.count), o = { v: 0 };
        tl.to(o, { v: end, duration: 1.6, ease: "power3.out", onUpdate: () => { el.textContent = String(Math.round(o.v)); } }, 0.6);
      });

      // Soft colour washes drifting in the background
      gsap.to(".wash .w1", { xPercent: -12, yPercent: 10, duration: 14, ease: "sine.inOut", repeat: -1, yoyo: true });
      gsap.to(".wash .w2", { xPercent: 14, yPercent: -8, duration: 17, ease: "sine.inOut", repeat: -1, yoyo: true });
      gsap.to(".wash .w3", { xPercent: -20, yPercent: -16, duration: 20, ease: "sine.inOut", repeat: -1, yoyo: true });

      // Headings reveal word by word
      gsap.utils.toArray<HTMLElement>(".split").forEach((h) => {
        gsap.from(h.querySelectorAll(".wi"), {
          yPercent: 110, duration: 1, ease: "expo.out", stagger: 0.05,
          scrollTrigger: { trigger: h, start: "top 88%", once: true },
        });
      });

      gsap.from(".contact", { scale: 0.94, borderRadius: 80, duration: 1.2, ease: "expo.out", scrollTrigger: { trigger: ".contact", start: "top 85%", once: true } });
    });

    // Pointer-driven springs only where a mouse or trackpad exists
    mm.add("(hover: hover) and (prefers-reduced-motion: no-preference)", () => {
      const cleanups: (() => void)[] = [];
      gsap.utils.toArray<HTMLElement>(".magnetic").forEach((b) => {
        const qx = gsap.quickTo(b, "x", { duration: 0.5, ease: "power3.out" });
        const qy = gsap.quickTo(b, "y", { duration: 0.5, ease: "power3.out" });
        const move = (e: PointerEvent) => {
          const r = b.getBoundingClientRect();
          qx((e.clientX - r.left - r.width / 2) * 0.3);
          qy((e.clientY - r.top - r.height / 2) * 0.4);
        };
        const leave = () => gsap.to(b, { x: 0, y: 0, duration: 1, ease: "elastic.out(1,.35)" });
        const press = () => gsap.to(b, { scale: 0.95, duration: 0.15 });
        const release = () => gsap.to(b, { scale: 1, duration: 0.6, ease: "elastic.out(1,.4)" });
        b.addEventListener("pointermove", move);
        b.addEventListener("pointerleave", leave);
        b.addEventListener("pointerdown", press);
        b.addEventListener("pointerup", release);
        cleanups.push(() => {
          b.removeEventListener("pointermove", move);
          b.removeEventListener("pointerleave", leave);
          b.removeEventListener("pointerdown", press);
          b.removeEventListener("pointerup", release);
        });
      });
      gsap.utils.toArray<HTMLElement>(".level, .stop").forEach((card) => {
        const move = (e: PointerEvent) => {
          const r = card.getBoundingClientRect();
          const px = (e.clientX - r.left) / r.width - 0.5, py = (e.clientY - r.top) / r.height - 0.5;
          gsap.to(card, { rotateY: px * 6, rotateX: -py * 6, transformPerspective: 900, duration: 0.6, ease: "power3.out" });
        };
        const leave = () => gsap.to(card, { rotateY: 0, rotateX: 0, duration: 1, ease: "elastic.out(1,.4)" });
        card.addEventListener("pointermove", move);
        card.addEventListener("pointerleave", leave);
        cleanups.push(() => {
          card.removeEventListener("pointermove", move);
          card.removeEventListener("pointerleave", leave);
        });
      });
      return () => cleanups.forEach((fn) => fn());
    });

    document.fonts?.ready.then(() => ScrollTrigger.refresh());
  });

  return null;
}
