import React from "react";
import { Audio, Video } from "@remotion/media";
import { AbsoluteFill, Sequence, interpolate, random, staticFile, useCurrentFrame } from "remotion";
import { loadFont } from "@remotion/fonts";
import timeline from "../../public/sl/timeline.json";
import words1 from "../../public/sl/words1.json";
import words2 from "../../public/sl/words2.json";

// SL: biografías con material de anime. Subtítulos estilo referencias: gancho repartido alrededor de la tarjeta,
// después bloques que se construyen palabra a palabra con jerarquía de tamaños y color por emoción.
const FPS = 30;
const P8 = "SL Poppins 800";
const P9 = "SL Poppins 900";
const SERIF = "SL Serif";
loadFont({ family: P8, url: staticFile("fonts/poppins-latin-800-normal.woff2"), weight: "800" });
loadFont({ family: P9, url: staticFile("fonts/poppins-latin-900-normal.woff2"), weight: "900" });
loadFont({ family: SERIF, url: staticFile("fonts/instrument-serif-latin-400-italic.woff2"), weight: "400", style: "italic" });
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ip = (f: number, i: number[], o: number[]) => interpolate(f, i, o, cl);
const S = (t: number) => Math.round(t * FPS);

const COLORS = { r: "#FF2E2E", y: "#FFDD3C", b: "#35B4FF", w: "#FFFFFF" } as const;
type C = keyof typeof COLORS;
type W = { w: string; s: number; e: number; c?: C; serif?: boolean };
type Item = { t: number; d: number; layout: "card" | "full" | "blur" | "red" | "black"; clip?: string };

type Cfg = {
  words: { chunks: { text: string; timestamp: [number, number | null] }[] };
  fix: (w: string, prev: string, next: string) => string[] | null;
  colors: Record<string, C>;
  serif: string[];
  hookEnd: number;
  total: number;
  audio: string;
  songCuts: number[];
};
const clean = (w: string) => w.toLowerCase().replace(/[^a-záéíóúñü0-9%]/g, "");

const CFG: Record<"vegeta" | "lee", Cfg> = {
  vegeta: {
    words: words1 as unknown as Cfg["words"],
    fix: (w, prev, next) => {
      if (w === "Uyosuigo") return ["vio", "a", "su", "hijo"];
      if (w === "y" && prev === "orgullo") return [];
      if (w === "de" && next === "segundo.") return [];
      const m: Record<string, string> = { Juro: "Juró", mas: "más", entreno: "entrenó", sufre: "sufrió" };
      return m[w] ? [m[w]] : null;
    },
    colors: { príncipe: "y", esclavo: "r", vegeta: "y", freezer: "r", destruyó: "r", planeta: "b", pueblo: "r", padre: "r", orgullo: "y", fuerte: "y", universo: "b", goku: "y", segundo: "r", alma: "r", peligro: "r", sacrificando: "r", salvarlos: "y", nadie: "y", kakaroto: "y", uno: "y", difícil: "r", mismo: "y" },
    serif: ["abrazó"],
    hookEnd: 4.0,
    total: 64.5,
    audio: "sl/vegeta_mezcla.wav",
    songCuts: [20.45, 36.3, 50.2],
  },
  lee: {
    words: words2 as unknown as Cfg["words"],
    fix: (w, prev, next) => {
      if (w === "roto") return ["derrota", "a", "un"];
      if (w === "ingenio,") return ["genio."];
      if (w === "Rokkli") return ["Rock", "Lee."];
      if (w === "hacerlo") return ["hacer", "lo"];
      if (w === "por" && next === "hívidas") return [];
      if (w === "la" && next === "aplastó") return ["le"];
      const m: Record<string, string> = { "lámpagos.": "relámpagos.", Ells: "Él", podian: "podía", "tecnica,": "técnica.", seria: "sería", asi: "así", decidio: "decidió", unico: "único", mas: "más", "dias.": "días.", "Gara,": "Gaara,", hívidas: "prohibidas", "Gara.": "Gaara." };
      return m[w] ? [m[w]] : null;
    },
    colors: { ninjutsu: "r", genio: "y", lee: "y", fuego: "r", agua: "b", relámpagos: "b", técnica: "r", ninja: "r", entrenar: "y", patadas: "y", puñetazos: "y", gaara: "r", tocar: "r", prohibidas: "r", arena: "b", golpeó: "y", atrapó: "r", brazo: "r", pierna: "r", pelear: "r", morir: "r", aceptó: "y", sobrevivió: "y", talento: "y", comprar: "r", levantarse: "y" },
    serif: ["maestro"],
    hookEnd: 4.8,
    total: 69.2,
    audio: "sl/lee_mezcla.wav",
    songCuts: [18.9, 31.0, 46.2],
  },
};
// "pelear" solo se pinta de amarillo la última vez (en Lee, "volvió a pelear")
const buildWords = (cfg: Cfg): W[] => {
  const raw = cfg.words.chunks.map((c) => ({ w: c.text.trim(), s: c.timestamp[0], e: c.timestamp[1] ?? c.timestamp[0] + 0.3 }));
  const out: W[] = [];
  raw.forEach((r, i) => {
    const rep = cfg.fix(r.w, clean(raw[i - 1]?.w ?? ""), raw[i + 1]?.w ?? "");
    const parts = rep ?? [r.w];
    const n = parts.length;
    parts.forEach((p, k) => {
      const s = r.s + ((r.e - r.s) * k) / Math.max(1, n);
      const e = r.s + ((r.e - r.s) * (k + 1)) / Math.max(1, n);
      const c = cfg.colors[clean(p)];
      out.push({ w: p, s, e, c, serif: cfg.serif.includes(clean(p)) });
    });
  });
  return out;
};

const SMALL = new Set(["el", "la", "los", "las", "un", "una", "de", "del", "a", "al", "y", "que", "su", "sus", "se", "lo", "le", "en", "con", "por", "para", "ni", "es", "era", "mi", "o", "como"]);
// bloques: se cortan en puntuación, a las 4 palabras o en una pausa
const blocksOf = (ws: W[]) => {
  const out: W[][] = [];
  let b: W[] = [];
  ws.forEach((w, i) => {
    b.push(w);
    const n = ws[i + 1];
    if (/[.,:?!»]$/.test(w.w) || b.length >= 4 || !n || n.s - w.e > 0.38) {
      out.push(b);
      b = [];
    }
  });
  return out;
};
// líneas: las palabras pequeñas se pegan a la siguiente; dos palabras normales cortas comparten línea
const linesOf = (b: W[]) => {
  const lines: W[][] = [];
  let cur: W[] = [];
  b.forEach((w, i) => {
    cur.push(w);
    const small = SMALL.has(clean(w.w));
    const next = b[i + 1];
    const isKey = !!w.c || w.serif;
    const nextKey = next && (!!next.c || next.serif);
    const shortPair = !small && !isKey && next && !nextKey && w.w.length + next.w.length <= 10 && cur.length === 1;
    if (!next || (!small && !shortPair) || nextKey) {
      lines.push(cur);
      cur = [];
    }
  });
  if (cur.length) lines.push(cur);
  return lines;
};

const Word: React.FC<{ w: W; f: number; size: number; upper: boolean; last: boolean; blockDone: boolean }> = ({ w, f, size, upper, last, blockDone }) => {
  const t = f - S(w.s) + 2;
  if (t < 0) return null;
  const pop = ip(t, [0, 3, 6], [1.35, 0.94, 1]);
  const col = w.c ? COLORS[w.c] : "#fff";
  const txt = upper ? w.w.toUpperCase() : w.w;
  const under = last && blockDone && w.c === "y";
  const glow = last && blockDone && (w.c === "w" || (!w.c && size > 90));
  return (
    <span
      style={{
        display: "inline-block",
        margin: "0 0.12em",
        transform: `scale(${pop})`,
        opacity: ip(t, [0, 2], [0, 1]),
        fontFamily: w.serif ? SERIF : w.c ? P9 : P8,
        fontStyle: w.serif ? "italic" : "normal",
        fontWeight: w.serif ? 400 : w.c ? 900 : 800,
        fontSize: w.serif ? size * 1.35 : size,
        color: col,
        letterSpacing: w.serif ? 0 : -0.5,
        lineHeight: 1.0,
        textDecoration: under ? "underline" : undefined,
        textDecorationThickness: under ? Math.max(4, size * 0.07) : undefined,
        textUnderlineOffset: under ? size * 0.12 : undefined,
        textShadow: glow ? "0 0 26px rgba(255,255,255,0.9), 0 4px 18px rgba(0,0,0,0.85)" : w.c === "r" ? "0 0 24px rgba(255,40,40,0.55), 0 4px 18px rgba(0,0,0,0.9)" : "0 4px 18px rgba(0,0,0,0.9), 0 0 2px rgba(0,0,0,0.9)",
      }}
    >
      {txt}
    </span>
  );
};

const sizeOf = (w: W, big: boolean) => {
  const small = SMALL.has(clean(w.w));
  if (w.c || w.serif) return (w.w.length > 10 ? 92 : 118) * (big ? 1.25 : 1);
  if (small) return 46 * (big ? 1.2 : 1);
  return 72 * (big ? 1.25 : 1);
};

// cuerpo: bloque centrado que se construye
const Block: React.FC<{ b: W[]; f: number; end: number; y: number; big: boolean }> = ({ b, f, end, y, big }) => {
  const lines = linesOf(b);
  const done = f >= S(b[b.length - 1].s) + 4;
  const out = ip(f, [end - 3, end], [1, 0]);
  return (
    <div style={{ position: "absolute", left: 40, right: 40, top: y, transform: "translateY(-50%)", textAlign: "center", opacity: out }}>
      {lines.map((ln, i) => (
        <div key={i} style={{ lineHeight: 1.04 }}>
          {ln.map((w, k) => (
            <Word key={k} w={w} f={f} size={sizeOf(w, big)} upper last={w === b[b.length - 1]} blockDone={done} />
          ))}
        </div>
      ))}
    </div>
  );
};

// gancho: palabras antes de la clave arriba a la izquierda, la clave sobre la tarjeta, el resto debajo
const Hook: React.FC<{ b: W[]; f: number; end: number; first: boolean }> = ({ b, f, end, first }) => {
  const ki = b.findIndex((w) => w.c);
  const pre = ki >= 0 ? b.slice(0, ki) : b;
  const key = ki >= 0 ? b[ki] : null;
  const post = ki >= 0 ? b.slice(ki + 1) : [];
  const out = ip(f, [end - 3, end], [1, 0]);
  const preLines = linesOf(pre);
  return (
    <div style={{ position: "absolute", inset: 0, opacity: out }}>
      <div style={{ position: "absolute", left: first ? 110 : undefined, right: first ? undefined : 110, top: first ? 380 : 1440, textAlign: first ? "left" : "right" }}>
        {preLines.map((ln, i) => (
          <div key={i} style={{ marginLeft: first ? i * 40 : 0, marginRight: first ? 0 : i * 40 }}>
            {ln.map((w, k) => (
              <Word key={k} w={w} f={f} size={SMALL.has(clean(w.w)) ? 54 : 74} upper={false} last={false} blockDone={false} />
            ))}
          </div>
        ))}
      </div>
      {key ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: first ? 900 : 1600, textAlign: "center" }}>
          <Word w={key} f={f} size={128} upper last blockDone={f >= S(key.s) + 6} />
        </div>
      ) : null}
      {post.length ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 1720, textAlign: "center" }}>
          {post.map((w, k) => (
            <Word key={k} w={w} f={f} size={70} upper={false} last={false} blockDone={false} />
          ))}
        </div>
      ) : null}
    </div>
  );
};

// ---------- imagen ----------
const Shot: React.FC<{ it: Item; k: number }> = ({ it, k }) => {
  const f = useCurrentFrame();
  const n = S(it.d);
  const u = f / Math.max(1, n);
  const zin = k % 2 === 0;
  const z = zin ? 1 + 0.07 * u : 1.07 - 0.07 * u;
  const punch = ip(f, [0, 4], [1.05, 1]);
  const src = staticFile(it.clip!);
  if (it.layout === "card") {
    const mask = "linear-gradient(to right, transparent 0%, #000 9%, #000 91%, transparent 100%), linear-gradient(to bottom, transparent 0%, #000 9%, #000 91%, transparent 100%)";
    return (
      <AbsoluteFill style={{ background: "#000" }}>
        <div style={{ position: "absolute", left: 150, top: 600, width: 780, height: 780, overflow: "hidden", WebkitMaskImage: mask, WebkitMaskComposite: "source-in", maskImage: mask, maskComposite: "intersect" }}>
          <Video src={src} muted style={{ width: 780, height: 780, objectFit: "cover", scale: z * punch }} />
        </div>
      </AbsoluteFill>
    );
  }
  if (it.layout === "blur") {
    return (
      <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
        <Video src={src} muted style={{ position: "absolute", left: -420, top: 0, width: 1920, height: 1920, objectFit: "cover", filter: "blur(38px) brightness(0.45) saturate(1.2)", scale: 1.1 }} />
        <div style={{ position: "absolute", left: 0, top: 420, width: 1080, height: 1080, overflow: "hidden", boxShadow: "0 30px 80px rgba(0,0,0,0.7)" }}>
          <Video src={src} muted style={{ width: 1080, height: 1080, objectFit: "cover", scale: z * punch }} />
        </div>
      </AbsoluteFill>
    );
  }
  if (it.layout === "red") {
    return (
      <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 45%, #FF2A1A, #C80F0F 70%, #8E0808)" }}>
        <div style={{ position: "absolute", left: 130, top: 560, width: 820, height: 820, borderRadius: 34, overflow: "hidden", boxShadow: "0 40px 90px rgba(0,0,0,0.55)", scale: ip(f, [0, 8], [0.9, 1]) }}>
          <Video src={src} muted style={{ width: 820, height: 820, objectFit: "cover", scale: z }} />
        </div>
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <Video src={src} muted style={{ position: "absolute", left: -420, top: 0, width: 1920, height: 1920, objectFit: "cover", scale: z * punch }} />
    </AbsoluteFill>
  );
};

const Sfx: React.FC<{ t: number; name: string; v: number }> = ({ t, name, v }) => (
  <Sequence from={Math.max(0, S(t) - 6)} durationInFrames={40}>
    <Audio src={staticFile(`sfx/${name}.wav`)} volume={v} />
  </Sequence>
);

export const SL: React.FC<{ video: "vegeta" | "lee" }> = ({ video }) => {
  const f = useCurrentFrame();
  const cfg = CFG[video];
  const items = (timeline as unknown as Record<string, Item[]>)[video];
  const words = buildWords(cfg);
  const blocks = blocksOf(words);
  const t = f / FPS;
  const bi = blocks.findIndex((b, i) => t >= b[0].s - 0.07 && t < (blocks[i + 1]?.[0].s ?? 999) - 0.07);
  const b = bi >= 0 ? blocks[bi] : null;
  const end = bi >= 0 ? S((blocks[bi + 1]?.[0].s ?? cfg.total + 1) - 0.07) : 0;
  const cur = items.find((it) => t >= it.t && t < it.t + it.d);
  const onBlack = cur?.layout === "black";
  const hook = b && b[0].s < cfg.hookEnd;
  const lastBlock = bi === blocks.length - 1;
  // transición al cambiar de canción: destello blanco y zoom con desenfoque
  const tr = cfg.songCuts.reduce((o, c) => Math.max(o, f >= S(c) - 3 ? ip(f - S(c), [-3, 0, 9], [0, 1, 0]) : 0), 0);
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <AbsoluteFill style={{ transform: `scale(${1 + tr * 0.18})`, filter: tr > 0.02 ? `blur(${tr * 14}px)` : undefined }}>
        {items.map((it, k) =>
          it.layout === "black" ? null : (
            <Sequence key={k} from={S(it.t)} durationInFrames={Math.max(1, S(it.t + it.d) - S(it.t))}>
              <Shot it={it} k={k} />
            </Sequence>
          ),
        )}
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 85% 70% at 50% 50%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.55) 100%)", pointerEvents: "none" }} />
      <AbsoluteFill style={{ background: `rgba(255,255,255,${tr * 0.85})`, pointerEvents: "none" }} />
      {b ? hook ? <Hook b={b} f={f} end={end} first={b[0].s < 1.5} /> : <Block b={b} f={f} end={lastBlock ? S(cfg.total) + 5 : end} y={onBlack ? 960 : 1010} big={onBlack} /> : null}
      <Audio src={staticFile(cfg.audio)} />
      {cfg.songCuts.map((c, i) => <Sfx key={i} t={c} name="whoosh" v={0.22} />)}
    </AbsoluteFill>
  );
};
export const SL_TOTAL = { vegeta: S(64.5), lee: S(69.2) };
export const randomSeed = random;
