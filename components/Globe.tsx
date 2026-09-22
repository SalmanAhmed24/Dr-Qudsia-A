"use client";

import { useEffect, useRef, useState, type MutableRefObject } from "react";
import gsap from "gsap";
import { geoGraticule10, geoOrthographic, geoPath, type GeoPermissibleObjects } from "d3-geo";
import { feature, mesh } from "topojson-client";
import type { GeometryCollection, Topology } from "topojson-specification";
import { HOME, HOME_COUNTRY, REGIONS, isRegion, type FilterKey, type RegionKey } from "@/lib/data";

export type GlobeApi = { focus: (key: FilterKey | null, hover?: boolean) => void };

type V3 = [number, number, number];
type Arc = { region: RegionKey; label: string; end: V3; path: V3[]; delay: number };

const RAD = Math.PI / 180;
const DEFAULT_CAPTION = "Lines from Lahore to every region in my research. Drag to turn the globe.";

const vec = (lat: number, lon: number): V3 => {
  const la = lat * RAD, lo = lon * RAD, c = Math.cos(la);
  return [c * Math.cos(lo), c * Math.sin(lo), Math.sin(la)];
};

type World = {
  land: GeoPermissibleObjects;
  borders: GeoPermissibleObjects;
  countries: Map<string, GeoPermissibleObjects>;
};

/** Loads Natural Earth country shapes (world-atlas, 1:110m) in a separate chunk after the page is interactive. */
let worldPromise: Promise<World> | null = null;
function loadWorld() {
  worldPromise ??= import("world-atlas/countries-110m.json").then((mod) => {
    const topo = (mod.default ?? mod) as unknown as Topology<{ countries: GeometryCollection; land: GeometryCollection }>;
    const countries = new Map<string, GeoPermissibleObjects>();
    for (const g of topo.objects.countries.geometries) {
      countries.set(String(g.id), feature(topo, g) as GeoPermissibleObjects);
    }
    return {
      land: feature(topo, topo.objects.land) as GeoPermissibleObjects,
      borders: mesh(topo, topo.objects.countries, (x, y) => x !== y) as GeoPermissibleObjects,
      countries,
    };
  });
  return worldPromise;
}

const SPHERE: GeoPermissibleObjects = { type: "Sphere" };
const GRATICULE = geoGraticule10();

function buildArcs(): Arc[] {
  const a = vec(HOME[0], HOME[1]);
  const arcs: Arc[] = [];
  (Object.keys(REGIONS) as RegionKey[]).forEach((region) => {
    REGIONS[region].pins.forEach(([label, lat, lon]) => {
      const b = vec(lat, lon);
      const dot = a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
      const om = Math.acos(Math.min(1, Math.max(-1, dot)));
      const so = Math.sin(om) || 1;
      const path: V3[] = [];
      for (let s = 0; s <= 48; s++) {
        const t = s / 48;
        const k1 = Math.sin((1 - t) * om) / so, k2 = Math.sin(t * om) / so;
        const h = 1 + Math.min(0.28, om * 0.22) * Math.sin(Math.PI * t);
        path.push([(a[0] * k1 + b[0] * k2) * h, (a[1] * k1 + b[1] * k2) * h, (a[2] * k1 + b[2] * k2) * h]);
      }
      arcs.push({ region, label, end: b, path, delay: Math.random() * 2 });
    });
  });
  return arcs;
}

export default function Globe({ apiRef }: { apiRef: MutableRefObject<GlobeApi | null> }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [caption, setCaption] = useState(DEFAULT_CAPTION);

  useEffect(() => {
    const wrap = wrapRef.current!, canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let world: World | null = null;
    const arcs = buildArcs();
    const home = vec(HOME[0], HOME[1]);
    const state = { lon: 40, lat: 18, zoom: 1, scale: reduce ? 1 : 0.82, reveal: reduce ? 1 : 0 };
    const projection = geoOrthographic().clipAngle(90).precision(0.6);
    const path = geoPath(projection, ctx);
    let active: RegionKey | null = null;
    let hover: RegionKey | null = null;
    let size = 1, dpr = 1, visible = true, dragging = false, last = 0, clock = 0, raf = 0;
    let tween: gsap.core.Tween | null = null;

    const colors = { land: "", sea: "", pin: "", ink: "", line: "", font: "", oceanHi: "", oceanLo: "", landFill: "", coast: "", border: "", grid: "" };
    const readColors = () => {
      const cs = getComputedStyle(document.documentElement);
      colors.land = cs.getPropertyValue("--land").trim();
      colors.sea = cs.getPropertyValue("--globe-sea").trim();
      colors.pin = cs.getPropertyValue("--pin").trim();
      colors.ink = cs.getPropertyValue("--ink").trim();
      colors.line = cs.getPropertyValue("--line").trim();
      colors.oceanHi = cs.getPropertyValue("--ocean-hi").trim();
      colors.oceanLo = cs.getPropertyValue("--ocean-lo").trim();
      colors.landFill = cs.getPropertyValue("--land-fill").trim();
      colors.coast = cs.getPropertyValue("--coast").trim();
      colors.border = cs.getPropertyValue("--border").trim();
      colors.grid = cs.getPropertyValue("--grid").trim();
      colors.font = getComputedStyle(document.body).fontFamily;
    };
    readColors();
    const dark = window.matchMedia("(prefers-color-scheme: dark)");
    const onScheme = () => { readColors(); if (reduce) draw(); };
    dark.addEventListener("change", onScheme);

    const resize = () => {
      const r = wrap.getBoundingClientRect();
      size = Math.max(1, Math.min(r.width, r.height || r.width));
      dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = Math.round(size * dpr);
      canvas.height = Math.round(size * dpr);
      if (reduce) draw();
    };
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);

    function draw() {
      const W = size, cx = W / 2, cy = W / 2;
      const R = W * 0.42 * state.scale * state.zoom;
      const L = state.lon * RAD, P = state.lat * RAD;
      const cl = Math.cos(L), sl = Math.sin(L), cp = Math.cos(P), sp = Math.sin(P);
      const proj = (v: V3): V3 => {
        const x1 = v[0] * cl + v[1] * sl, y1 = -v[0] * sl + v[1] * cl;
        return [x1 * cp + v[2] * sp, y1, -x1 * sp + v[2] * cp];
      };
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx!.clearRect(0, 0, W, W);

      const GR = Math.min(R * 1.2, W * 0.5);
      const g = ctx!.createRadialGradient(cx - R * 0.35, cy - R * 0.4, R * 0.1, cx, cy, GR);
      g.addColorStop(0, colors.sea);
      g.addColorStop(Math.min(0.95, R / GR), colors.sea);
      g.addColorStop(1, "rgba(140,212,255,0)");
      ctx!.fillStyle = g;
      ctx!.beginPath();
      ctx!.arc(cx, cy, GR, 0, Math.PI * 2);
      ctx!.fill();

      const CR = Math.min(W * 0.495, R * 1.35);
      ctx!.save();
      ctx!.beginPath();
      ctx!.arc(cx, cy, CR, 0, Math.PI * 2);
      ctx!.clip();
      if (R > CR) { ctx!.fillStyle = colors.sea; ctx!.fill(); }

      projection.rotate([-state.lon, -state.lat]).scale(R).translate([cx, cy]);

      // ocean with a soft light source top-left
      const ocean = ctx!.createRadialGradient(cx - R * 0.4, cy - R * 0.45, R * 0.05, cx, cy, R);
      ocean.addColorStop(0, colors.oceanHi);
      ocean.addColorStop(1, colors.oceanLo);
      ctx!.fillStyle = ocean;
      ctx!.beginPath(); path(SPHERE); ctx!.fill();

      ctx!.strokeStyle = colors.grid; ctx!.lineWidth = 0.7;
      ctx!.beginPath(); path(GRATICULE); ctx!.stroke();

      if (world) {
        ctx!.globalAlpha = state.reveal;
        ctx!.fillStyle = colors.landFill;
        ctx!.beginPath(); path(world.land); ctx!.fill();

        // research countries, tinted by region; the focused region glows, others step back
        const focusNow = hover || active;
        (Object.keys(REGIONS) as RegionKey[]).forEach((k) => {
          const r = REGIONS[k];
          const alpha = !focusNow ? 0.55 : focusNow === k ? 0.95 : 0.22;
          ctx!.globalAlpha = alpha * state.reveal;
          ctx!.fillStyle = r.color;
          ctx!.beginPath();
          r.countries.forEach((id) => { const f = world!.countries.get(id); if (f) path(f); });
          ctx!.fill();
        });
        const pk = world.countries.get(HOME_COUNTRY);
        if (pk) { ctx!.globalAlpha = 0.75 * state.reveal; ctx!.fillStyle = colors.pin; ctx!.beginPath(); path(pk); ctx!.fill(); }

        ctx!.globalAlpha = state.reveal;
        ctx!.strokeStyle = colors.border; ctx!.lineWidth = 0.6;
        ctx!.beginPath(); path(world.borders); ctx!.stroke();
        ctx!.strokeStyle = colors.coast; ctx!.lineWidth = 0.8;
        ctx!.beginPath(); path(world.land); ctx!.stroke();
        ctx!.globalAlpha = 1;
      }

      // 3D shading: highlight top-left, gentle shadow around the rim
      const shade = ctx!.createRadialGradient(cx - R * 0.35, cy - R * 0.4, R * 0.1, cx, cy, R);
      shade.addColorStop(0, "rgba(255,255,255,0.35)");
      shade.addColorStop(0.45, "rgba(255,255,255,0)");
      shade.addColorStop(0.85, "rgba(30,40,110,0.06)");
      shade.addColorStop(1, "rgba(30,40,110,0.22)");
      ctx!.fillStyle = shade;
      ctx!.beginPath(); path(SPHERE); ctx!.fill();

      // arcs, sparks, pins, labels
      const focus = hover || active;
      const placed: [number, number][] = [];
      const labelFont = `600 ${Math.max(11, Math.round((W * 0.42) / 22))}px ${colors.font}`;
      for (const a of arcs) {
        const col = REGIONS[a.region].color;
        const on = !focus || focus === a.region;
        const prog = reduce ? 1 : Math.min(1, Math.max(0, (clock - a.delay * 0.6 - 0.6) / 1.4));
        if (prog <= 0) continue;
        const upto = Math.floor(prog * (a.path.length - 1));
        ctx!.strokeStyle = col;
        ctx!.globalAlpha = on ? 0.95 : 0.14;
        ctx!.lineWidth = on && focus ? 2.4 : 1.6;
        ctx!.lineCap = "round";
        ctx!.beginPath();
        let pen = false;
        for (let s = 0; s <= upto; s++) {
          const p = proj(a.path[s]);
          if (p[0] > 0 || Math.hypot(p[1], p[2]) > 1) {
            const X = cx + R * p[1], Y = cy - R * p[2];
            if (pen) ctx!.lineTo(X, Y); else { ctx!.moveTo(X, Y); pen = true; }
          } else pen = false;
        }
        ctx!.stroke();

        if (on && !reduce && prog >= 1) {
          const t = (clock * 0.35 + a.delay) % 1;
          const q = proj(a.path[Math.floor(t * (a.path.length - 1))]);
          if (q[0] > 0 || Math.hypot(q[1], q[2]) > 1) {
            ctx!.globalAlpha = 1;
            ctx!.fillStyle = col;
            ctx!.beginPath();
            ctx!.arc(cx + R * q[1], cy - R * q[2], 2.6, 0, Math.PI * 2);
            ctx!.fill();
          }
        }

        const e = proj(a.end);
        if (e[0] > 0 && prog >= 1) {
          const X = cx + R * e[1], Y = cy - R * e[2];
          ctx!.globalAlpha = on ? 1 : 0.25;
          ctx!.fillStyle = col;
          ctx!.beginPath();
          ctx!.arc(X, Y, on && focus ? 5 : 3.6, 0, Math.PI * 2);
          ctx!.fill();
          if (on && !reduce) {
            const pulse = (clock * 0.8 + a.delay) % 1;
            ctx!.globalAlpha = (1 - pulse) * 0.6;
            ctx!.strokeStyle = col;
            ctx!.lineWidth = 1.5;
            ctx!.beginPath();
            ctx!.arc(X, Y, 4 + pulse * 12, 0, Math.PI * 2);
            ctx!.stroke();
          }
          const clash = placed.some(([px, py]) => Math.abs(px - X) < 70 && Math.abs(py - Y) < 22);
          if (focus === a.region && e[0] > 0.2 && !clash && X > 0 && X < W - 40 && Y > 16 && Y < W) {
            placed.push([X, Y]);
            ctx!.globalAlpha = 1;
            ctx!.font = labelFont;
            const tw = ctx!.measureText(a.label).width, bx = X + 9, by = Y - 11;
            ctx!.fillStyle = colors.sea;
            ctx!.beginPath();
            if ("roundRect" in ctx!) ctx!.roundRect(bx - 5, by - 12, tw + 10, 20, 10); else ctx!.rect(bx - 5, by - 12, tw + 10, 20);
            ctx!.fill();
            ctx!.fillStyle = colors.ink;
            ctx!.fillText(a.label, bx, by + 3);
          }
        }
      }

      const h = proj(home);
      if (h[0] > 0) {
        const HX = cx + R * h[1], HY = cy - R * h[2];
        ctx!.globalAlpha = 1;
        ctx!.fillStyle = colors.pin;
        ctx!.beginPath();
        ctx!.arc(HX, HY, 6, 0, Math.PI * 2);
        ctx!.fill();
        ctx!.strokeStyle = colors.sea;
        ctx!.lineWidth = 2.5;
        ctx!.stroke();
        ctx!.font = `600 ${Math.max(12, Math.round((W * 0.42) / 20))}px ${colors.font}`;
        ctx!.fillStyle = colors.ink;
        ctx!.fillText("Lahore", HX + 11, HY + 18);
      }
      ctx!.globalAlpha = 1;
      ctx!.restore();
      ctx!.strokeStyle = colors.line;
      ctx!.lineWidth = 1.5;
      ctx!.beginPath();
      ctx!.arc(cx, cy, Math.min(R, CR), 0, Math.PI * 2);
      ctx!.stroke();
    }

    const loop = (ts: number) => {
      const dt = last ? Math.min(0.05, (ts - last) / 1000) : 0;
      last = ts;
      clock += dt;
      if (!dragging && !active && !hover && !tween) state.lon += dt * 6;
      draw();
      if (visible) raf = requestAnimationFrame(loop); else last = 0;
    };

    const io = new IntersectionObserver(([entry]) => {
      const was = visible;
      visible = entry.isIntersecting;
      if (visible && !was && !reduce) raf = requestAnimationFrame(loop);
    });
    io.observe(wrap);

    let intro: gsap.core.Tween | null = null;
    let alive = true;
    loadWorld().then((w) => {
      if (!alive) return;
      world = w;
      if (reduce) draw();
      else gsap.to(state, { reveal: 1, duration: 1.2, ease: "power2.out" });
    });
    if (reduce) {
      document.fonts?.ready.then(() => { readColors(); draw(); });
    } else {
      intro = gsap.to(state, { scale: 1, duration: 1.8, ease: "expo.out", delay: 0.1 });
      document.fonts?.ready.then(readColors);
      raf = requestAnimationFrame(loop);
    }

    // drag to rotate (vertical page scroll stays native thanks to touch-action: pan-y)
    let sx = 0, sy = 0, slon = 0, slat = 0;
    const down = (e: PointerEvent) => {
      dragging = true; sx = e.clientX; sy = e.clientY; slon = state.lon; slat = state.lat;
      tween?.kill(); tween = null;
      wrap.setPointerCapture(e.pointerId);
    };
    const move = (e: PointerEvent) => {
      if (!dragging) return;
      const k = (180 / size) * 0.6;
      state.lon = slon - (e.clientX - sx) * k;
      state.lat = Math.max(-60, Math.min(70, slat + (e.clientY - sy) * k));
      if (reduce) draw();
    };
    const up = () => { dragging = false; };
    wrap.addEventListener("pointerdown", down);
    wrap.addEventListener("pointermove", move);
    wrap.addEventListener("pointerup", up);
    wrap.addEventListener("pointercancel", up);

    const turnTo = (lat: number, lon: number, zoom = 1) => {
      const d = (((lon - state.lon) % 360) + 540) % 360 - 180;
      const target = state.lon + d;
      tween?.kill();
      if (reduce) { state.lon = target; state.lat = lat; state.zoom = zoom; tween = null; draw(); return; }
      tween = gsap.to(state, { lon: target, lat, zoom, duration: 1.3, ease: "expo.inOut", onComplete: () => { tween = null; } });
    };

    apiRef.current = {
      focus(key, isHover = false) {
        if (isHover) hover = isRegion(key) ? key : null;
        else { hover = null; active = isRegion(key) ? key : null; }
        const k = hover || active;
        if (k) {
          const r = REGIONS[k];
          turnTo(r.center[0], r.center[1], r.zoom);
          setCaption(`Showing ${r.name}, traced from Lahore.`);
        } else if (key === "theory") {
          turnTo(HOME[0] - 6, HOME[1], 1);
          setCaption("Theory travels everywhere. Home base: Lahore.");
        } else {
          turnTo(state.lat > 40 || state.lat < 0 ? 18 : state.lat, state.lon, 1);
          setCaption(DEFAULT_CAPTION);
        }
      },
    };

    return () => {
      alive = false;
      gsap.killTweensOf(state);
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      intro?.kill();
      tween?.kill();
      dark.removeEventListener("change", onScheme);
      wrap.removeEventListener("pointerdown", down);
      wrap.removeEventListener("pointermove", move);
      wrap.removeEventListener("pointerup", up);
      wrap.removeEventListener("pointercancel", up);
      apiRef.current = null;
    };
  }, [apiRef]);

  return (
    <aside className="globe-col" aria-label="Research map">
      <div className="globe-sticky">
        <div className="globe-wrap" ref={wrapRef}>
          <canvas
            ref={canvasRef}
            role="img"
            aria-label="A turning world map globe with lines from Lahore to the regions Dr Akram researches: the Middle East, South Asia, the Indian Ocean, Russia and Eurasia, and Africa."
          />
        </div>
        <p className="globe-caption" aria-live="polite">
          {caption}
        </p>
      </div>
    </aside>
  );
}
