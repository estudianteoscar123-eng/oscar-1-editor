import React from "react";
import { Audio } from "@remotion/media";
import { loadFont } from "@remotion/fonts";
import { AbsoluteFill, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame, Easing } from "remotion";
import w1 from "../../public/slc/v1.json";
import w2 from "../../public/slc/v2.json";

// SL "Cine": talking head + anime (emoción) + motion graphics (idea). Estilo de las 13 referencias:
// subtítulo sans pequeño sobre el pecho, frases título sans+serif itálica, tarjetas crema/negro, un rojo de acento.
const FPS = 30;
const F = (t: number) => Math.round(t * FPS);
const ip = (v: number, i: number[], o: number[], e?: (x: number) => number) =>
  interpolate(v, i, o, { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: e });
const EO = Easing.bezier(0.16, 1, 0.3, 1);
([["CSans", "poppins-latin-500-normal", "500"], ["CSansB", "poppins-latin-600-normal", "600"], ["CSerif", "instrument-serif-latin-400-italic", "400"], ["CPlay", "playfair-display-latin-600-italic", "600"]] as const).forEach(([fam, file, w]) =>
  loadFont({ family: fam, url: staticFile(`fonts/${file}.woff2`), weight: w, style: file.includes("italic") ? "italic" : "normal" }),
);
const CREAM = "#E9E6E0", INK = "#141414", RED = "#C1121F", BLACK = "#0C0C0C";

type W = { text: string; timestamp: [number, number] };
type Line = { t: number; x: string; f?: "s" | "S" | "R" | "b"; size?: number; strike?: number; tw?: boolean; c?: string };
type Ov =
  | { k: "an"; a: number; b: number; src: string; from: number; bw?: boolean; title?: Line[] }
  | { k: "mo"; a: number; b: number; bg: "cream" | "black" | "paper"; lines?: Line[]; sp?: "clock" | "lunes" | "page" | "bar" | "phone"; y?: number };
type Cfg = { vid: string; mix: string; words: W[]; fix: Record<number, string>; ov: Ov[]; bw: [number, number][]; titles: { a: number; b: number; lines: Line[] }[]; end: number };

// ---------- texto ----------
const fam = (f: Line["f"]) => (f === "S" || f === "R" ? "CSerif" : f === "b" ? "CSansB" : "CSans");
const LineEl: React.FC<{ l: Line; t: number; dark: boolean }> = ({ l, t, dark }) => {
  const p = ip(t, [l.t, l.t + 0.28], [0, 1], EO);
  const big = l.f === "S" || l.f === "R";
  const size = l.size ?? (big ? 150 : 50);
  const col = l.c ?? (l.f === "R" ? RED : dark ? "#F4F1EC" : INK);
  let txt = l.x;
  if (l.tw) txt = l.x.slice(0, Math.max(0, Math.floor((t - l.t) * 26)));
  const st = l.strike !== undefined ? ip(t, [l.strike, l.strike + 0.25], [0, 1], EO) : 0;
  return (
    <div style={{ position: "relative", opacity: l.tw ? (t >= l.t ? 1 : 0) : p, transform: `translateY(${(1 - p) * (l.tw ? 0 : 22)}px)`, fontFamily: fam(l.f), fontSize: size, lineHeight: big ? 0.92 : 1.18, color: col, letterSpacing: big ? -1 : -0.6, whiteSpace: "pre-wrap", textAlign: "center" }}>
      {txt}
      {l.tw && t >= l.t && (t - l.t) * 26 < l.x.length + 8 ? <span style={{ opacity: Math.floor(t * 3) % 2 ? 1 : 0.15, fontFamily: "CSans", fontWeight: 300 }}>|</span> : null}
      {st > 0 ? <div style={{ position: "absolute", left: "-4%", top: "52%", height: big ? 10 : 5, width: `${108 * st}%`, background: RED, borderRadius: 4 }} /> : null}
    </div>
  );
};
const Lines: React.FC<{ lines: Line[]; t: number; dark: boolean; y?: number }> = ({ lines, t, dark, y }) => (
  <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, width: 900, transform: `translateY(${y ?? 0}px)` }}>
      {lines.filter((l) => t >= l.t - 0.01).map((l, i) => <LineEl key={i} l={l} t={t} dark={dark} />)}
    </div>
  </AbsoluteFill>
);

// ---------- motion especiales ----------
const Clock: React.FC<{ t: number; a: number; b: number }> = ({ t, a, b }) => {
  const p = ip(t, [a + 0.3, b - 0.6], [0, 1], Easing.inOut(Easing.cubic));
  const mins = Math.round(6 * 60 + p * (17 * 60 + 47));
  const hh = String(Math.floor(mins / 60) % 24).padStart(2, "0"), mm = String(mins % 60).padStart(2, "0");
  const ang = mins * 6;
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <svg width={520} height={520} viewBox="-260 -260 520 520" style={{ position: "absolute", top: 520 }}>
        <circle r={230} fill="none" stroke="#F4F1EC" strokeOpacity={0.18} strokeWidth={3} />
        {Array.from({ length: 12 }).map((_, i) => <line key={i} x1={0} y1={-212} x2={0} y2={-196} stroke="#F4F1EC" strokeOpacity={0.45} strokeWidth={4} transform={`rotate(${i * 30})`} />)}
        <line x1={0} y1={0} x2={0} y2={-120} stroke="#F4F1EC" strokeWidth={9} strokeLinecap="round" transform={`rotate(${ang / 12})`} />
        <line x1={0} y1={0} x2={0} y2={-180} stroke={RED} strokeWidth={5} strokeLinecap="round" transform={`rotate(${ang})`} />
        <circle r={10} fill="#F4F1EC" />
      </svg>
      <div style={{ position: "absolute", top: 1120, fontFamily: "CSansB", fontSize: 120, color: "#F4F1EC", letterSpacing: -3 }}>{hh}:{mm}</div>
    </AbsoluteFill>
  );
};
const Lunes: React.FC<{ t: number; a: number }> = ({ t, a }) => (
  <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
    {[0, 1, 2, 3].map((i) => {
      const s = a + 0.15 + i * 0.62;
      const p = ip(t, [s, s + 0.3], [0, 1], EO);
      const st = ip(t, [s + 0.32, s + 0.5], [0, 1], EO);
      return t < s ? null : (
        <div key={i} style={{ position: "absolute", top: 560 + i * 34, transform: `translateY(${(1 - p) * 60 + i * 150}px) rotate(${(i % 2 ? 1 : -1) * 2}deg)`, opacity: p, width: 560, height: 210, background: "#F7F5F1", borderRadius: 18, boxShadow: "0 18px 50px rgba(0,0,0,.18)", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
          <div style={{ fontFamily: "CSans", fontSize: 26, color: "#8A857C", letterSpacing: 6 }}>SEMANA {i + 1}</div>
          <div style={{ position: "relative", fontFamily: "CSerif", fontSize: 110, color: INK }}>Lunes
            {i < 3 ? <div style={{ position: "absolute", left: -10, top: "55%", height: 8, width: `${(110 * st)}%`, background: RED, borderRadius: 4 }} /> : null}
          </div>
        </div>
      );
    })}
  </AbsoluteFill>
);
const Page: React.FC<{ t: number; a: number; sale: number }> = ({ t, a, sale }) => {
  const p = ip(t, [a, a + 0.35], [0, 1], EO);
  const n = ip(t, [sale, sale + 0.35], [-260, 0], EO);
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <div style={{ position: "absolute", top: 420, width: 720, height: 980, background: "#FFFFFF", border: "3px solid #9A9A9A", transform: `scale(${0.9 + p * 0.1}) rotate(-2deg)`, opacity: p, boxShadow: "0 30px 80px rgba(0,0,0,.18)", fontFamily: "Times New Roman, serif", color: "#1A1AE6", padding: 40 }}>
        <div style={{ background: "#FFFF66", fontSize: 64, textAlign: "center", padding: 10, fontWeight: 700 }}>MI TIENDA!!</div>
        <div style={{ marginTop: 40, height: 300, background: "#D9D9D9", display: "flex", justifyContent: "center", alignItems: "center", color: "#777", fontSize: 40 }}>[ imagen ]</div>
        <div style={{ marginTop: 40, fontSize: 40, color: "#000" }}>Bienvenidos a mi página</div>
        <div style={{ marginTop: 30, fontSize: 36, color: "#1A1AE6", textDecoration: "underline" }}>click aqui para comprar</div>
        <div style={{ marginTop: 50, width: 260, height: 80, background: "#00C800", color: "#fff", fontSize: 38, display: "flex", justifyContent: "center", alignItems: "center" }}>COMPRAR</div>
      </div>
      {t >= sale ? (
        <div style={{ position: "absolute", top: 260 + n, width: 820, height: 150, borderRadius: 36, background: "rgba(20,20,20,.94)", display: "flex", alignItems: "center", padding: "0 36px", gap: 26, boxShadow: "0 20px 60px rgba(0,0,0,.35)" }}>
          <div style={{ width: 84, height: 84, borderRadius: 20, background: RED, display: "flex", justifyContent: "center", alignItems: "center", fontFamily: "CSansB", fontSize: 50, color: "#fff" }}>$</div>
          <div><div style={{ fontFamily: "CSansB", fontSize: 40, color: "#fff" }}>Nueva venta</div><div style={{ fontFamily: "CSans", fontSize: 30, color: "#BDBDBD" }}>Tienes un pedido nuevo · ahora</div></div>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
const Bar: React.FC<{ t: number; a: number }> = ({ t, a }) => {
  const v = ip(t, [a + 0.3, a + 1.2], [0, 3], EO);
  return (
    <div style={{ position: "absolute", top: 1180, left: 160, width: 760 }}>
      <div style={{ height: 14, borderRadius: 8, background: "rgba(20,20,20,.12)", overflow: "hidden" }}><div style={{ width: `${v}%`, height: "100%", background: RED }} /></div>
      <div style={{ marginTop: 18, display: "flex", justifyContent: "space-between", fontFamily: "CSans", fontSize: 30, color: "#6B665E" }}><span>{Math.floor(t * 2) % 2 ? "cargando" : "cargando…"}</span><span>{Math.round(v)}%</span></div>
    </div>
  );
};
const Phone: React.FC<{ t: number; a: number }> = ({ t, a }) => {
  const n = Math.floor(ip(t, [a + 0.4, a + 4.4], [3, 1248]));
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <div style={{ position: "absolute", top: 380, width: 600, height: 1160, borderRadius: 80, border: "6px solid #2A2A2A", background: "#050505", overflow: "hidden" }}>
        <div style={{ textAlign: "center", marginTop: 70, fontFamily: "CSansB", fontSize: 120, color: "#F4F1EC", letterSpacing: -4 }}>2:0{Math.min(9, Math.floor(ip(t, [a, a + 4.5], [0, 9])))}</div>
        <div style={{ textAlign: "center", fontFamily: "CSans", fontSize: 28, color: "#8D8D8D" }}>a. m.</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, padding: 26, marginTop: 30 }}>
          {Array.from({ length: 12 }).map((_, i) => {
            const s = a + 0.4 + i * 0.3;
            const p = ip(t, [s, s + 0.25], [0, 1], EO);
            return <div key={i} style={{ height: 170, borderRadius: 10, background: `linear-gradient(160deg, hsl(${(i * 47) % 360} 12% ${18 + (i % 3) * 6}%), #111)`, opacity: p, transform: `scale(${0.85 + 0.15 * p})`, display: "flex", alignItems: "flex-end", padding: 10, fontFamily: "CPlay", fontSize: 18, color: "rgba(255,255,255,.7)" }}>“…”</div>;
          })}
        </div>
        <div style={{ position: "absolute", bottom: 60, width: "100%", textAlign: "center", fontFamily: "CSans", fontSize: 32, color: "#F4F1EC" }}>Guardados · <span style={{ color: RED, fontFamily: "CSansB" }}>{n.toLocaleString("es")}</span></div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- capas ----------
const Motion: React.FC<{ o: Extract<Ov, { k: "mo" }>; t: number }> = ({ o, t }) => {
  const dark = o.bg === "black";
  const bg = dark ? BLACK : CREAM;
  const wipe = ip(t, [o.a, o.a + 0.22], [0, 100], EO);
  return (
    <AbsoluteFill style={{ background: bg, clipPath: `inset(${100 - wipe}% 0 0 0)` }}>
      {o.bg === "paper" ? (
        <AbsoluteFill>
          <div style={{ position: "absolute", left: 90, right: 90, top: 300, bottom: 300, background: "#F6F2EA", boxShadow: "0 30px 90px rgba(0,0,0,.16)", transform: "rotate(-1.2deg)", backgroundImage: "repeating-linear-gradient(transparent 0 78px, rgba(60,80,140,.13) 78px 80px)" }} />
        </AbsoluteFill>
      ) : null}
      {!dark ? <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 40%, rgba(255,255,255,.35), rgba(0,0,0,.06) 80%)" }} /> : <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, rgba(255,255,255,.05), rgba(0,0,0,.4) 85%)" }} />}
      {o.sp === "clock" ? <Clock t={t} a={o.a} b={o.b} /> : null}
      {o.sp === "lunes" ? <Lunes t={t} a={o.a} /> : null}
      {o.sp === "page" ? <Page t={t} a={o.a} sale={o.b - 1.6} /> : null}
      {o.sp === "bar" ? <Bar t={t} a={o.a} /> : null}
      {o.sp === "phone" ? <Phone t={t} a={o.a} /> : null}
      {o.lines ? <Lines lines={o.lines} t={t} dark={dark} y={o.y} /> : null}
    </AbsoluteFill>
  );
};
const Anime: React.FC<{ o: Extract<Ov, { k: "an" }>; t: number }> = ({ o, t }) => {
  const sc = ip(t, [o.a, o.b], [1.04, 1.13]);
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <AbsoluteFill style={{ transform: `scale(${sc})`, filter: o.bw ? "grayscale(1) contrast(1.15) brightness(.9)" : "contrast(1.06) saturate(.86) brightness(.95)" }}>
        <OffthreadVideo src={staticFile(`slc/${o.src}.mp4`)} trimBefore={F(o.from)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 45%, rgba(0,0,0,.55) 100%)" }} />
      {o.title ? <AbsoluteFill style={{ background: "rgba(0,0,0,.35)" }}><Lines lines={o.title} t={t} dark y={-260} /></AbsoluteFill> : null}
    </AbsoluteFill>
  );
};

const clean = (x: string) => x.replace(/[.,;:«»"…!?¿¡]+/g, "");
const SMALL = new Set(["a", "al", "el", "la", "los", "las", "de", "del", "y", "que", "en", "un", "una", "no", "se", "su", "lo", "le", "me", "te", "mi", "tu", "es", "por", "con", "sin", "si", "pero", "o", "ni", "yo", "él", "más", "ya", "ha"]);
const groups = (ws: { x: string; a: number; b: number }[]) => {
  const out: { x: string[]; a: number; b: number }[] = [];
  ws.forEach((w, i) => {
    const cur = out[out.length - 1];
    const prev = ws[i - 1];
    const bigs = cur ? cur.x.filter((x) => !SMALL.has(clean(x).toLowerCase())).length : 0;
    const brk = !cur || (bigs >= 1 && !SMALL.has(clean(w.x).toLowerCase())) || cur.x.length >= 3 || w.a - prev.b > 0.3 || /[.,;:?!…]$/.test(prev.x);
    if (brk) out.push({ x: [w.x], a: w.a, b: w.b });
    else { cur.x.push(w.x); cur.b = w.b; }
  });
  return out.map((g, i) => ({ ...g, b: Math.min(out[i + 1]?.a ?? g.b + 0.6, g.b + 0.5) }));
};

const Cine: React.FC<{ c: Cfg }> = ({ c }) => {
  const f = useCurrentFrame();
  const t = f / FPS;
  const ws = c.words.map((w, i) => ({ x: (c.fix[i] ?? w.text).trim(), a: w.timestamp[0], b: w.timestamp[1] })).filter((w) => w.x);
  const gs = React.useMemo(() => groups(ws), [c]);
  const cur = c.ov.find((o) => t >= o.a && t < o.b);
  const title = c.titles.find((x) => t >= x.a && t < x.b);
  // talking head: zoom alterno por aparición
  const thStarts = [0, ...c.ov.map((o) => o.b)].filter((x) => x <= t);
  const thIdx = thStarts.length;
  const lastStart = Math.max(...thStarts);
  const z = (thIdx % 2 ? 1.0 : 1.16) + ip(t, [lastStart, lastStart + 4], [0, 0.03]);
  const punch = ip(t, [lastStart, lastStart + 0.18], [1.035, 1], EO);
  const bw = c.bw.some(([a, b]) => t >= a && t < b);
  const g = gs.find((x) => t >= x.a && t < x.b);
  const showSub = g && (!cur || cur.k === "an") && !title && !(cur?.k === "an" && cur.title);
  const gp = g ? ip(t, [g.a, g.a + 0.08], [0, 1]) : 0;
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <AbsoluteFill style={{ transform: `scale(${z * punch})`, transformOrigin: "50% 38%", filter: bw ? "grayscale(1) contrast(1.22) brightness(.86)" : "contrast(1.14) saturate(.78) brightness(.86) sepia(.14)" }}>
        <OffthreadVideo src={staticFile(`slc/${c.vid}.mp4`)} muted style={{ width: 1080, height: 1920 }} />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 70% 55% at 50% 40%, rgba(0,0,0,0) 30%, rgba(8,6,4,.62) 100%)" }} />
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(0,0,0,.35) 0%, rgba(0,0,0,0) 22%, rgba(0,0,0,0) 70%, rgba(0,0,0,.45) 100%)" }} />
      {c.ov.map((o, i) => (
        <Sequence key={i} from={F(o.a)} durationInFrames={F(o.b) - F(o.a)}>
          {o.k === "an" ? <Anime o={o} t={t} /> : <Motion o={o} t={t} />}
        </Sequence>
      ))}
      {title ? <AbsoluteFill style={{ background: "rgba(0,0,0,.28)" }}><Lines lines={title.lines} t={t} dark y={170} /></AbsoluteFill> : null}
      {showSub && g ? (
        <div style={{ position: "absolute", top: 1215, width: "100%", textAlign: "center", fontFamily: "CSans", fontSize: 46, color: "#fff", letterSpacing: -0.4, opacity: gp, textShadow: "0 2px 14px rgba(0,0,0,.55)" }}>{g.x.join(" ").replace(/[,.]$/, "")}</div>
      ) : null}
      <Audio src={staticFile(`slc/${c.mix}.wav`)} />
    </AbsoluteFill>
  );
};

// ---------- VIDEO 1: No eres flojo ----------
const C1: Cfg = {
  vid: "v1", mix: "mix1", words: (w1 as unknown as { chunks: W[] }).chunks, end: 74.6,
  fix: { 2: "Mi", 10: "empezar", 11: "su", 59: "diría", 72: "el", 78: "convierte", 80: "otro", 113: "se", 114: "quedó", 115: "", 116: "mirando", 117: "", 131: "está", 169: "cuaderno", 189: "hazlo" },
  bw: [[40.9, 49.4]],
  titles: [
    { a: 21.3, b: 24.0, lines: [{ t: 21.4, x: "nadie diría que es un", f: "s" }, { t: 23.45, x: "flojo.", f: "S", size: 170 }] },
    { a: 29.9, b: 32.0, lines: [{ t: 30.0, x: "hasta que", f: "s" }, { t: 30.75, x: "su primo", f: "S" }] },
    { a: 72.9, b: 74.6, lines: [{ t: 72.9, x: "Solo", f: "s", size: 60 }, { t: 73.15, x: "empezaron.", f: "S", size: 170 }] },
  ],
  ov: [
    { k: "an", a: 0, b: 2.45, src: "b4", from: 26, title: [{ t: 0.0, x: "Tres", f: "s", size: 56 }, { t: 0.38, x: "años.", f: "S", size: 210 }, { t: 1.4, x: "a punto de empezar", f: "s", size: 46 }] },
    { k: "an", a: 4.25, b: 6.45, src: "b6", from: 0 },
    { k: "mo", a: 8.6, b: 13.95, bg: "cream", lines: [{ t: 8.7, x: "Tiene todo.", f: "S", size: 140 }, { t: 9.9, x: "✓  el nombre", f: "s" }, { t: 11.6, x: "✓  el logo", f: "s" }, { t: 12.65, x: "✓  el plan", f: "s" }] },
    { k: "mo", a: 13.95, b: 16.9, bg: "black", sp: "clock", lines: [{ t: 14.0, x: "de las 6 a. m.", f: "s", size: 42 }], y: -545 },
    { k: "an", a: 16.9, b: 18.5, src: "b8", from: 4.2 },
    { k: "an", a: 18.5, b: 21.3, src: "b8", from: 1.8 },
    { k: "mo", a: 24.0, b: 27.3, bg: "cream", lines: [{ t: 24.05, x: "Siempre falta", f: "s", size: 56 }, { t: 24.6, x: "algo.", f: "S", size: 170 }, { t: 25.4, x: "un poco más de dinero", f: "s", strike: 26.6 }, { t: 27.0, x: "el lunes", f: "s" }] },
    { k: "mo", a: 27.3, b: 29.9, bg: "cream", sp: "lunes" },
    { k: "mo", a: 32.0, b: 40.9, bg: "cream", sp: "page", lines: [{ t: 33.4, x: "sin logo.", f: "b", size: 44, c: INK }, { t: 34.55, x: "sin plan.", f: "b", size: 44, c: INK }], y: 560 },
    { k: "an", a: 44.9, b: 46.4, src: "b8", from: 6.2, bw: true, title: [{ t: 44.95, x: "“Pero lo está", f: "s", size: 50 }, { t: 45.4, x: "haciendo mal.”", f: "S", size: 150 }] },
    { k: "mo", a: 48.5, b: 50.6, bg: "black", lines: [{ t: 48.55, x: "No era", f: "s", size: 56 }, { t: 48.8, x: "flojera.", f: "S", size: 170, strike: 49.4 }, { t: 49.6, x: "Era miedo.", f: "R", size: 190 }] },
    { k: "an", a: 50.6, b: 51.8, src: "b4", from: 0.2, bw: true },
    { k: "an", a: 51.8, b: 53.2, src: "b4", from: 12.8, bw: true },
    { k: "mo", a: 53.2, b: 56.5, bg: "cream", lines: [{ t: 53.25, x: "Lo que nunca intentas", f: "s", size: 52 }, { t: 55.45, x: "nunca puede", f: "S", size: 140 }, { t: 56.0, x: "fallar.", f: "R", size: 160 }] },
    { k: "an", a: 59.3, b: 61.4, src: "b6", from: 5.7 },
    { k: "mo", a: 64.1, b: 66.95, bg: "black", lines: [{ t: 64.15, x: "Hazlo mal.", f: "S", size: 130 }, { t: 65.0, x: "Hazlo feo.", f: "S", size: 130 }, { t: 65.85, x: "Pero hazlo", f: "s", size: 56 }, { t: 66.55, x: "hoy.", f: "R", size: 200 }] },
    { k: "an", a: 68.9, b: 69.85, src: "m3", from: 7.75 },
    { k: "an", a: 69.85, b: 71.25, src: "b7", from: 2.5 },
  ],
};

// ---------- VIDEO 2: Nadie va a venir ----------
const C2: Cfg = {
  vid: "v2", mix: "mix2", words: (w2 as unknown as { chunks: W[] }).chunks, end: 75.4,
  fix: { 12: "abrirla", 13: "", 14: "el día", 32: "haya", 68: "mientras", 75: "veía", 97: "mañana", 98: "empieza", 99: "", 101: "seguí", 115: "exactamente.", 116: "Los", 189: "tu yo", 195: "habría", 199: "anoche", 200: "escribí", 209: "dice:" },
  bw: [[44.4, 47.7]],
  titles: [
    { a: 30.1, b: 34.1, lines: [{ t: 30.2, x: "la misma promesa:", f: "s" }, { t: 32.8, x: "mañana", f: "S", size: 170 }, { t: 33.4, x: "empieza todo.", f: "s", size: 56 }] },
    { a: 57.9, b: 61.0, lines: [{ t: 57.95, x: "la única persona que puede cambiar tu vida", f: "s", size: 44 }, { t: 60.1, x: "ya está aquí.", f: "S", size: 170 }] },
  ],
  ov: [
    { k: "mo", a: 0, b: 4.15, bg: "paper", lines: [{ t: 0.05, x: "Para mí,", f: "S", size: 110, c: INK }, { t: 0.6, x: "dentro de cinco años.", f: "S", size: 84, c: INK }, { t: 2.3, x: "No la abras antes.", f: "s", size: 40, c: "#6B665E", tw: true }] },
    { k: "an", a: 5.55, b: 7.35, src: "b4", from: 1.8 },
    { k: "an", a: 7.35, b: 7.9, src: "b4", from: 4.7, bw: true },
    { k: "mo", a: 7.9, b: 11.7, bg: "paper", lines: [{ t: 7.95, x: "“Espero que alguien ya te haya dado la oportunidad.”", f: "S", size: 92, c: INK, tw: true }, { t: 10.1, x: "alguien.", f: "R", size: 130 }, { t: 11.1, x: "no yo.", f: "s", size: 50, c: INK }], y: -60 },
    { k: "mo", a: 13.4, b: 17.1, bg: "cream", sp: "bar", lines: [{ t: 13.45, x: "esperando", f: "S", size: 150 }, { t: 14.55, x: "tener ganas", f: "s" }, { t: 16.1, x: "el momento perfecto", f: "s" }], y: -220 },
    { k: "an", a: 17.1, b: 19.4, src: "b6", from: 0.05 },
    { k: "an", a: 19.4, b: 21.3, src: "b4", from: 18.9 },
    { k: "an", a: 21.3, b: 22.4, src: "b4", from: 21.2 },
    { k: "mo", a: 25.0, b: 30.1, bg: "black", sp: "phone" },
    { k: "an", a: 34.1, b: 37.3, src: "b8", from: 1.8 },
    { k: "an", a: 37.3, b: 38.2, src: "b8", from: 9.3 },
    { k: "mo", a: 38.2, b: 44.4, bg: "cream", lines: [{ t: 38.3, x: "Los mismos sueños.", f: "S", size: 120 }, { t: 40.7, x: "5 años después.", f: "s" }, { t: 42.6, x: "el mismo cuarto.", f: "s" }, { t: 43.7, x: "la misma historia.", f: "R", size: 100 }] },
    { k: "an", a: 47.7, b: 51.5, src: "b4", from: 26, title: [{ t: 48.85, x: "lo que más duele", f: "s", size: 50 }, { t: 50.2, x: "y lo que más libera", f: "S", size: 110 }] },
    { k: "mo", a: 51.5, b: 57.3, bg: "black", lines: [{ t: 51.55, x: "Nadie va a venir.", f: "S", size: 130 }, { t: 53.35, x: "la motivación", f: "s", strike: 54.2 }, { t: 54.8, x: "el lunes", f: "s", strike: 55.1 }, { t: 55.6, x: "esa persona", f: "s", strike: 56.2 }, { t: 56.5, x: "Nadie.", f: "R", size: 170 }] },
    { k: "an", a: 61.2, b: 62.55, src: "b7", from: 2.5 },
    { k: "an", a: 62.55, b: 64.2, src: "b7", from: 8.6 },
    { k: "mo", a: 68.2, b: 71.0, bg: "paper", lines: [{ t: 68.3, x: "Así que anoche", f: "s", size: 46, c: INK }, { t: 69.4, x: "escribí otra carta.", f: "S", size: 110, c: INK }] },
    { k: "mo", a: 72.8, b: 75.4, bg: "paper", lines: [{ t: 72.85, x: "Nadie vino.", f: "S", size: 130, c: INK }, { t: 73.65, x: "Por eso lo hiciste", f: "s", size: 50, c: INK }, { t: 74.95, x: "tú.", f: "R", size: 220 }] },
  ],
};

export const SLCINE1_TOTAL = F(C1.end);
export const SLCINE2_TOTAL = F(C2.end);
export const SLCine1: React.FC = () => <Cine c={C1} />;
export const SLCine2: React.FC = () => <Cine c={C2} />;
