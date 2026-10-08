import { loadFont } from "@remotion/fonts";
import { Audio } from "@remotion/media";
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  interpolateColors,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import words from "../../public/pieza/words.json";

// Paleta: base azul profundo + acentos que cambian por escena (no todo azul)
const P = {
  base: "#040A1C",
  blue: "#0A84FF",
  cyan: "#5AC8FA",
  amber: "#FFB547",
  magenta: "#E8457C",
  warm: "#FFF4E0",
  text: "#F7F8FB",
};
const FONT = "Inter Tight";
for (const w of ["500", "600", "700", "800"]) {
  loadFont({ family: FONT, url: staticFile(`fonts/inter-tight-latin-${w}-normal.woff2`), weight: w });
}

const W = words.words;
const FPS = 30;
const wf = (i: number) => Math.round(W[i].s * FPS);
const EASE = Easing.bezier(0.16, 1, 0.3, 1);
const INOUT = Easing.bezier(0.65, 0, 0.35, 1);
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ip = (f: number, i: number[], o: number[], e = EASE) => interpolate(f, i, o, { ...clamp, easing: e });

// Escenas: rango de palabras + acento + palabras clave
type Scene = { a: number; b: number; accent: string; keys: number[]; chip?: string };
const SCENES: Scene[] = [
  { a: 0, b: 4, accent: P.cyan, keys: [0, 4], chip: "Winter Arc" },
  { a: 5, b: 11, accent: P.amber, keys: [9, 11] },
  { a: 12, b: 15, accent: P.magenta, keys: [15] },
  { a: 16, b: 27, accent: P.cyan, keys: [22, 23, 26] },
  { a: 28, b: 33, accent: P.warm, keys: [29, 33] },
  { a: 34, b: 44, accent: P.amber, keys: [39, 41, 44], chip: "3 meses" },
  { a: 45, b: 53, accent: P.magenta, keys: [53] },
  { a: 54, b: 64, accent: P.amber, keys: [59, 61, 64], chip: "3 meses" },
  { a: 65, b: 69, accent: P.cyan, keys: [69] },
  { a: 70, b: 77, accent: P.warm, keys: [76] },
  { a: 78, b: 84, accent: P.amber, keys: [84] },
  { a: 85, b: 90, accent: P.magenta, keys: [88, 90] },
];

// Fin de la pieza: cuando termina la última palabra
const END = Math.round(34.1 * FPS);

export const Pieza: React.FC = () => {
  const f = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  // escena activa y su color (interpolado entre escenas)
  const starts = SCENES.map((s) => wf(s.a));
  const colorIn = starts.map((s, k) => (k === 0 ? 0 : s));
  const accent = interpolateColors(f, [0, ...colorIn.slice(1).flatMap((s) => [s - 6, s + 6]), END], [
    SCENES[0].accent,
    ...SCENES.slice(1).flatMap((sc, k) => [SCENES[k].accent, sc.accent]),
    SCENES[SCENES.length - 1].accent,
  ]);

  const drift = Math.sin(f / 70) * 30;
  const zoom = interpolate(f, [0, durationInFrames], [1, 1.05]);
  const flash = starts.slice(1).reduce((m, s) => Math.max(m, ip(f, [s - 4, s, s + 9], [0, 0.85, 0], INOUT)), 0);

  return (
    <AbsoluteFill style={{ background: P.base, overflow: "hidden" }}>
      {/* luz principal azul que respira + acento de la escena */}
      <AbsoluteFill style={{ scale: zoom }}>
        <div
          style={{
            position: "absolute",
            left: -260 + drift,
            top: -640,
            width: 1600,
            height: 1400,
            borderRadius: "50%",
            background: `radial-gradient(closest-side, rgba(10,132,255,0.55), rgba(10,132,255,0.12) 60%, rgba(10,132,255,0) 100%)`,
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 260,
            bottom: -520,
            width: 1100,
            height: 1000,
            borderRadius: "50%",
            background: `radial-gradient(closest-side, ${accent}44, ${accent}00 100%)`,
            translate: `${-drift}px 0px`,
          }}
        />
      </AbsoluteFill>

      {/* barrido de luz entre escenas: transición suave */}
      {starts.slice(1).map((s, k) => {
        const x = interpolate(f, [s - 9, s + 9], [-1400, 1500], { ...clamp, easing: INOUT });
        const o = ip(f, [s - 9, s, s + 9], [0, 0.55, 0], INOUT);
        return (
          <div
            key={k}
            style={{
              position: "absolute",
              top: -200,
              left: 0,
              width: 360,
              height: 2400,
              translate: `${x}px 0px`,
              rotate: "18deg",
              background: `linear-gradient(90deg, rgba(255,255,255,0), ${SCENES[k + 1].accent}, rgba(255,255,255,0))`,
              opacity: o,
              filter: "blur(18px)",
              mixBlendMode: "screen",
            }}
          />
        );
      })}

      {/* destello en cada corte */}
      <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 42%, ${accent}, transparent 60%)`, opacity: flash * 0.6, mixBlendMode: "screen" }} />

      {/* escenas: texto por frases */}
      {SCENES.map((sc, k) => (
        <Scene key={k} scene={sc} index={k} f={f} nextStart={starts[k + 1] ?? durationInFrames + 30} />
      ))}

      {/* chip superior */}
      <Chips f={f} />

      {/* textura de película y viñeta */}
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 80% 70% at 50% 45%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.7) 100%)" }} />
      <svg width="1080" height="1920" style={{ position: "absolute", opacity: 0.07, mixBlendMode: "overlay" }}>
        <filter id="g">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed={Math.floor(f / 2)} />
        </filter>
        <rect width="1080" height="1920" filter="url(#g)" />
      </svg>

      <Audio src={staticFile("pieza/voz.wav")} />
    </AbsoluteFill>
  );
};

const Scene: React.FC<{ scene: Scene; index: number; f: number; nextStart: number }> = ({ scene, f, nextStart }) => {
  const first = wf(scene.a);
  const visibleFrom = first - 8;
  const visibleTo = nextStart + 6;
  if (f < visibleFrom || f > visibleTo) return null;

  // salida: el texto se desenfoca y sube mientras pasa el barrido
  const out = ip(f, [nextStart - 6, nextStart + 8], [0, 1], INOUT);
  const idx = Array.from({ length: scene.b - scene.a + 1 }, (_, k) => scene.a + k);
  const keyColor = scene.accent;

  const enter = ip(f, [first - 6, first + 18], [0, 1]);
  const spin = (f - first) * 1.2;
  return (
    <>
      <svg width="600" height="600" viewBox="-300 -300 600 600" style={{ position: "absolute", left: 240, top: 300, opacity: enter * (1 - out) * 0.95, scale: ip(f, [first - 6, first + 22], [0.6, 1]) }}>
        <circle r="230" fill="none" stroke={keyColor} strokeOpacity="0.35" strokeWidth="2" />
        <circle r="200" fill="none" stroke={keyColor} strokeWidth="6" strokeDasharray="120 1200" strokeLinecap="round" transform={`rotate(${spin})`} style={{ filter: `drop-shadow(0 0 14px ${keyColor})` }} />
        <circle r="150" fill="none" stroke="#FFFFFF" strokeOpacity="0.25" strokeWidth="2" strokeDasharray="4 18" transform={`rotate(${-spin * 0.6})`} />
        <circle r="120" fill={keyColor} fillOpacity="0.12" />
        {Array.from({ length: 14 }, (_, k) => {
          const a = (k / 14) * Math.PI * 2 + f / 60 + k;
          const r = 190 + Math.sin(f / 25 + k) * 16;
          return <circle key={k} cx={Math.cos(a) * r} cy={Math.sin(a) * r} r={k % 3 === 0 ? 5 : 3} fill={keyColor} fillOpacity={0.9} />;
        })}
      </svg>
    <div
      style={{
        position: "absolute",
        left: 70,
        right: 70,
        top: 900,
        textAlign: "center",
        fontFamily: FONT,
        fontSize: 66,
        fontWeight: 700,
        lineHeight: 1.16,
        letterSpacing: -1.8,
        color: P.text,
        opacity: 1 - out,
        filter: `blur(${out * 14}px)`,
        translate: `0px ${-out * 60}px`,
        scale: 1 - out * 0.06,
      }}
    >
      {idx.map((i) => {
        const at = wf(i);
        const key = scene.keys.includes(i);
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              marginRight: "0.24em",
              opacity: ip(f, [at - 2, at + 4], [0, 1]),
              filter: `blur(${ip(f, [at - 2, at + 5], [12, 0])}px)`,
              translate: `0px ${ip(f, [at - 2, at + 6], [18, 0])}px`,
              scale: ip(f, [at - 2, at + 6], [0.96, 1]),
              ...(key
                ? {
                    fontWeight: 800,
                    fontStyle: "italic",
                    backgroundImage: `linear-gradient(180deg, #FFFFFF 0%, ${keyColor} 70%)`,
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    color: "transparent",
                    paddingTop: "0.08em",
                    paddingBottom: "0.16em",
                    paddingLeft: "0.1em",
                    paddingRight: "0.1em",
                    marginTop: "-0.08em",
                    marginBottom: "-0.16em",
                    marginLeft: "-0.1em",
                    filter: `blur(${ip(f, [at - 2, at + 5], [12, 0])}px) drop-shadow(0 0 22px ${keyColor}99)`,
                  }
                : {}),
            }}
          >
            {W[i].t.replace(/[.,;:!?¡¿…]+$/g, "")}
          </span>
        );
      })}
    </div>
    </>
  );
};

// Chips de contexto con entrada en escala y cambio de color por escena
const Chips: React.FC<{ f: number }> = ({ f }) => {
  const sc = SCENES.find((s) => s.chip && f >= wf(s.a) - 4 && f <= wf(s.b) + 8);
  if (!sc) return null;
  const at = wf(sc.a);
  return (
    <div
      style={{
        position: "absolute",
        top: 1230,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
        opacity: ip(f, [at - 4, at + 6], [0, 1]),
        scale: ip(f, [at - 4, at + 10], [0.7, 1], Easing.bezier(0.34, 1.56, 0.64, 1)),
      }}
    >
      <div
        style={{
          fontFamily: FONT,
          fontSize: 30,
          fontWeight: 700,
          letterSpacing: 2,
          textTransform: "uppercase",
          color: P.text,
          background: "rgba(255,255,255,0.06)",
          border: `1.5px solid ${sc.accent}`,
          borderRadius: 999,
          padding: "16px 34px",
          boxShadow: `0 0 40px ${sc.accent}66`,
          backdropFilter: "blur(14px)",
        }}
      >
        {sc.chip}
      </div>
    </div>
  );
};
