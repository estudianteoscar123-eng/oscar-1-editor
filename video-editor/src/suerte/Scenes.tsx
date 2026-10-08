import { Easing, interpolate, useCurrentFrame } from "remotion";
import { FONT, INOUT, K, OUT, W, accentText, glass, ip, leave, rise, wf } from "./kit";

const mono: React.CSSProperties = { fontFamily: FONT, fontSize: 24, fontWeight: 500, letterSpacing: 3, textTransform: "uppercase", color: K.dim };
const abs = (top: number, extra: React.CSSProperties = {}): React.CSSProperties => ({ position: "absolute", left: 0, right: 0, top, display: "flex", justifyContent: "center", ...extra });
const hash = (a: number, b: number) => {
  const x = Math.sin(a * 127.1 + b * 311.7) * 43758.5453;
  return x - Math.floor(x);
};
const count = (f: number, a: number, b: number, to: number) => Math.round(ip(f, [a, b], [0, to], Easing.bezier(0.1, 0.9, 0.2, 1)));
const fmt = (n: number) => n.toLocaleString("es-ES");

const Check: React.FC<{ p: number; size?: number }> = ({ p, size = 44 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="11" fill={p > 0 ? K.blue : "none"} stroke={p > 0 ? K.blue : K.faint} strokeWidth="1.5" opacity={0.25 + 0.75 * Math.min(1, p * 2)} />
    <path d="M7 12.5l3.2 3.2L17 9" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="16" strokeDashoffset={16 - 16 * p} />
  </svg>
);

// ─── 1 · "¿Suerte?" letra a letra → se transforma en buscador con la pregunta + perfiles ───
export const SceneSuerte: React.FC = () => {
  const f = useCurrentFrame();
  if (f > 122) return null;
  const word = "¿Suerte?";
  const morph = ip(f, [26, 42], [0, 1], INOUT);
  // texto tecleado: cada palabra se escribe durante el tiempo en que se pronuncia
  let typed = "";
  for (let i = 1; i <= 12; i++) {
    const s = W[i].s * 30, e = W[i].e * 30;
    const n = Math.round(ip(f, [s, e], [0, W[i].t.length], (x) => x));
    if (n > 0) typed += (typed ? " " : "") + W[i].t.slice(0, n);
  }
  const caret = Math.floor(f / 8) % 2 === 0 && f < wf(12) + 14;
  const exit = leave(f, 112, 10, -320);
  return (
    <div style={{ position: "absolute", inset: 0, ...exit }}>
      {/* palabra gigante que sube y se encoge dentro del campo */}
      <div
        style={{
          ...abs(820),
          fontFamily: FONT,
          fontSize: 170,
          fontWeight: 600,
          letterSpacing: -6,
          translate: `0px ${interpolate(morph, [0, 1], [0, -330])}px`,
          scale: interpolate(morph, [0, 1], [1, 0.32]),
          opacity: 1 - ip(f, [36, 44], [0, 1]),
        }}
      >
        {word.split("").map((ch, k) => {
          const at = 4 + k * 2;
          return (
            <span
              key={k}
              style={{
                display: "inline-block",
                opacity: ip(f, [at, at + 4], [0, 1]),
                filter: `blur(${ip(f, [at, at + 6], [16, 0])}px) drop-shadow(0 0 30px ${K.glow})`,
                translate: `0px ${ip(f, [at, at + 7], [30, 0])}px`,
                ...(k > 0 && k < 7 ? accentText : { color: K.text }),
              }}
            >
              {ch}
            </span>
          );
        })}
      </div>
      {/* campo de búsqueda que crece desde la palabra */}
      <div style={abs(470)}>
        <div
          style={{
            ...glass,
            width: interpolate(morph, [0, 1], [240, 920]),
            height: interpolate(morph, [0, 1], [110, 330]),
            borderRadius: interpolate(morph, [0, 1], [60, 44]),
            opacity: morph,
            border: `1.5px solid rgba(10,132,255,${0.25 + 0.35 * morph})`,
            boxShadow: `0 0 60px rgba(10,132,255,${0.25 * morph}), 0 30px 80px rgba(0,0,0,0.6)`,
            padding: "40px 46px",
            boxSizing: "border-box",
            overflow: "hidden",
          }}
        >
          <div style={{ ...mono, fontSize: 20, marginBottom: 18, opacity: ip(f, [38, 46], [0, 1]) }}>Pregunta</div>
          <div style={{ fontFamily: FONT, fontSize: 52, fontWeight: 500, lineHeight: 1.22, letterSpacing: -1, color: K.text }}>
            {typed.split(" ").map((t, k, arr) => (
              <span key={k} style={/suerte/i.test(t) ? accentText : undefined}>
                {t}
                {k < arr.length - 1 ? " " : ""}
              </span>
            ))}
            <span style={{ display: "inline-block", width: 4, height: 54, marginLeft: 4, translate: "0 10px", background: K.blue, opacity: caret ? 1 : 0 }} />
          </div>
        </div>
      </div>
      {/* "gente exitosa": tres perfiles que reciben el chip ¿Suerte? */}
      {[0, 1, 2].map((k) => {
        const at = wf(7) + k * 4;
        const chip = wf(12) + k * 3;
        return (
          <div key={k} style={{ ...abs(880 + k * 190), ...rise(f, at, 11, 40, 14, 0.86) }}>
            <div style={{ ...glass, width: 860, height: 160, borderRadius: 30, display: "flex", alignItems: "center", gap: 28, padding: "0 34px", boxSizing: "border-box" }}>
              <div style={{ width: 92, height: 92, borderRadius: 99, background: `linear-gradient(140deg, ${["#3A3A46", "#2B2F3E", "#343440"][k]}, #1A1A20)`, border: `1px solid ${K.stroke}` }} />
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: [210, 170, 240][k], height: 22, borderRadius: 11, background: "#3A3A44" }} />
                  <Check p={1} size={30} />
                </div>
                <div style={{ width: [300, 260, 220][k], height: 16, borderRadius: 8, background: "#26262D", marginTop: 16 }} />
              </div>
              <div
                style={{
                  fontFamily: FONT,
                  fontSize: 30,
                  fontWeight: 600,
                  color: K.text,
                  background: "rgba(10,132,255,0.16)",
                  border: `1px solid rgba(10,132,255,0.5)`,
                  borderRadius: 999,
                  padding: "14px 24px",
                  boxShadow: `0 0 30px ${K.glow}`,
                  opacity: ip(f, [chip, chip + 4], [0, 1]),
                  scale: ip(f, [chip, chip + 8], [0.6, 1], Easing.bezier(0.34, 1.56, 0.64, 1)),
                }}
              >
                ¿Suerte?
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

// ─── 2 · Iceberg: la suerte es la punta; debajo, esfuerzo, sacrificios y fracasos ───
export const SceneIceberg: React.FC = () => {
  const f = useCurrentFrame();
  if (f < 108 || f > 272) return null;
  const enter = rise(f, 112, 14, 160, 22, 0.94);
  const exit = leave(f, 262, 10, -360);
  const cam = interpolate(f, [112, wf(19), wf(24), wf(29), 272], [300, 300, 40, -120, -150], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: INOUT });
  const hours = count(f, wf(21), wf(21) + 26, 10000);
  const fails = count(f, wf(26), wf(29) + 10, 247);
  const sacr = ["Fiestas", "Excusas", "Comodidad"];
  return (
    <div style={{ position: "absolute", inset: 0, ...enter, ...(f >= 262 ? exit : {}) }}>
      <div style={{ position: "absolute", inset: 0, translate: `0px ${cam}px`, perspective: 1800 }}>
        <div style={{ ...abs(560), ...rise(f, wf(13), 10) }}>
          <div style={{ ...mono }}>Lo que ves</div>
        </div>
        <div style={{ ...abs(610), ...rise(f, wf(14), 12, 20, 14, 0.7) }}>
          <div
            style={{
              fontFamily: FONT,
              fontSize: 46,
              fontWeight: 600,
              color: "#fff",
              background: `linear-gradient(180deg, ${K.cyan}, ${K.blue})`,
              borderRadius: 999,
              padding: "22px 44px",
              boxShadow: `0 0 70px ${K.glow}, 0 0 0 6px rgba(10,132,255,0.15)`,
            }}
          >
            ✦ Suerte
          </div>
        </div>
        {/* línea de flotación */}
        <div style={{ position: "absolute", left: 60, right: 60, top: 770, height: 2, background: `repeating-linear-gradient(90deg, ${K.faint} 0 14px, transparent 14px 26px)`, opacity: ip(f, [wf(17), wf(17) + 8], [0, 1]), scale: `${ip(f, [wf(17), wf(17) + 14], [0, 1])} 1` }} />
        <div style={{ ...abs(800), ...rise(f, wf(18), 10) }}>
          <div style={{ ...mono }}>Lo que no ves</div>
        </div>
        {/* esfuerzo */}
        <div style={{ ...abs(870), ...rise(f, wf(19), 12, 60, 16, 0.92), rotate: "x 10deg" }}>
          <div style={{ ...glass, width: 900, height: 280, padding: "34px 44px", boxSizing: "border-box", border: `1px solid ${f >= wf(21) ? "rgba(10,132,255,0.45)" : K.stroke}`, boxShadow: f >= wf(21) ? `0 0 60px rgba(10,132,255,0.25), 0 30px 80px rgba(0,0,0,0.6)` : glass.boxShadow }}>
            <div style={mono}>Horas de esfuerzo</div>
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginTop: 14 }}>
              <div style={{ fontFamily: FONT, fontSize: 120, fontWeight: 600, letterSpacing: -4, color: K.text, lineHeight: 1 }}>
                {fmt(hours)}
                <span style={{ fontSize: 56, color: K.dim, marginLeft: 10 }}>h</span>
              </div>
              <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 120 }}>
                {Array.from({ length: 12 }, (_, k) => (
                  <div key={k} style={{ width: 16, borderRadius: 4, height: 20 + 100 * ip(f, [wf(21) + k * 1.5, wf(21) + k * 1.5 + 10], [0, (k + 3) / 15]), background: k === 11 ? K.blue : "#34343C", boxShadow: k === 11 ? `0 0 20px ${K.glow}` : undefined }} />
                ))}
              </div>
            </div>
          </div>
        </div>
        {/* sacrificios */}
        <div style={{ ...abs(1180), ...rise(f, wf(24) - 4, 12, 60, 16, 0.92), rotate: "x 10deg" }}>
          <div style={{ ...glass, width: 900, height: 260, padding: "34px 44px", boxSizing: "border-box" }}>
            <div style={mono}>Sacrificios</div>
            <div style={{ display: "flex", gap: 16, marginTop: 30 }}>
              {sacr.map((s, k) => {
                const at = wf(24) + k * 4;
                return (
                  <div key={s} style={{ ...rise(f, at, 9, 16, 10, 0.8), display: "flex", alignItems: "center", gap: 12, fontFamily: FONT, fontSize: 34, fontWeight: 500, color: K.text, background: "#1E1E25", border: `1px solid ${K.stroke}`, borderRadius: 999, padding: "16px 24px" }}>
                    <span style={{ color: K.blue, fontWeight: 700 }}>✕</span>
                    <span style={{ position: "relative" }}>
                      {s}
                      <span style={{ position: "absolute", left: 0, top: "54%", height: 3, background: K.dim, width: `${ip(f, [at + 6, at + 12], [0, 100])}%` }} />
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        {/* fracasos */}
        <div style={{ ...abs(1470), ...rise(f, wf(26), 12, 60, 16, 0.92), rotate: "x 10deg" }}>
          <div style={{ ...glass, width: 900, height: 280, padding: "34px 44px", boxSizing: "border-box" }}>
            <div style={mono}>Fracasos</div>
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginTop: 14 }}>
              <div style={{ fontFamily: FONT, fontSize: 120, fontWeight: 600, letterSpacing: -4, color: K.text, lineHeight: 1 }}>{fmt(fails)}</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(14, 14px)", gap: 6 }}>
                {Array.from({ length: 42 }, (_, k) => (
                  <div key={k} style={{ width: 14, height: 14, borderRadius: 3, background: k === 41 ? K.blue : "#34343C", opacity: ip(f, [wf(26) + k * 0.6, wf(26) + k * 0.6 + 4], [0, 1]), boxShadow: k === 41 ? `0 0 16px ${K.glow}` : undefined }} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── 3 · Esperar la suerte: cargador atascado ───
export const SceneEspera: React.FC = () => {
  const f = useCurrentFrame();
  if (f < 258 || f > 366) return null;
  const reset = wf(38);
  const prog = f < reset ? ip(f, [266, reset], [0.6, 3.4], (x) => x) : ip(f, [reset, reset + 6], [3.4, 0], INOUT);
  const days = count(f, 266, 356, 1825);
  const shake = f >= reset && f < reset + 10 ? Math.sin(f * 3) * ip(f, [reset, reset + 10], [14, 0], (x) => x) : 0;
  return (
    <div style={{ position: "absolute", inset: 0, ...rise(f, 262, 14, 160, 22, 0.94) }}>
      <div style={{ ...abs(760), translate: `${shake}px 0px` }}>
        <div style={{ ...glass, width: 900, padding: "48px 50px", boxSizing: "border-box" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 30 }}>
            <svg width="86" height="86" viewBox="0 0 50 50" style={{ rotate: `${f * 9}deg` }}>
              <circle cx="25" cy="25" r="21" fill="none" stroke="#2A2A31" strokeWidth="4" />
              <circle cx="25" cy="25" r="21" fill="none" stroke={K.blue} strokeOpacity="0.7" strokeWidth="4" strokeLinecap="round" strokeDasharray="34 132" />
            </svg>
            <div>
              <div style={{ fontFamily: FONT, fontSize: 50, fontWeight: 600, letterSpacing: -1, color: K.text }}>Esperando suerte…</div>
              <div style={{ ...mono, fontSize: 20, marginTop: 8 }}>Estado · pendiente</div>
            </div>
          </div>
          <div style={{ height: 12, borderRadius: 12, background: "#24242B", marginTop: 44, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${prog}%`, background: K.dim, borderRadius: 12 }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 16, fontFamily: FONT, fontSize: 28, color: K.dim }}>
            <span>{prog.toFixed(1)} %</span>
            <span>
              {fmt(days)} días esperando
            </span>
          </div>
        </div>
      </div>
      <div style={{ ...abs(1210), ...rise(f, reset + 2, 10, -40, 12, 0.9) }}>
        <div style={{ ...glass, borderRadius: 999, display: "flex", alignItems: "center", gap: 16, padding: "22px 36px", fontFamily: FONT, fontSize: 36, fontWeight: 500, color: K.text }}>
          <span style={{ width: 40, height: 40, borderRadius: 99, border: `2px solid ${K.dim}`, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 24, color: K.dim }}>i</span>
          Sin resultados
        </div>
      </div>
    </div>
  );
};

// transición en píxeles (como el icono que se convierte en candado en la referencia v4)
export const PixelGlitch: React.FC<{ at: number }> = ({ at }) => {
  const f = useCurrentFrame();
  const t = f - at;
  if (t < 0 || t > 12) return null;
  const env = interpolate(t, [0, 5, 12], [0, 1, 0]);
  const cells = [];
  for (let y = 0; y < 40; y++)
    for (let x = 0; x < 22; x++) {
      const r = hash(x + t * 3, y);
      if (r < 0.55 * env) {
        const c = r < 0.12 ? K.blue : r < 0.25 ? "#FFFFFF" : r < 0.4 ? "#3A3A44" : "#16161B";
        cells.push(<div key={`${x}-${y}`} style={{ position: "absolute", left: x * 49, top: y * 48, width: 49, height: 48, background: c, opacity: 0.85 }} />);
      }
    }
  return <div style={{ position: "absolute", inset: 0 }}>{cells}</div>;
};

// ─── 4 · Cuando nadie te mira: 05:30, hábitos que se encienden, 0 espectadores ───
export const SceneNadie: React.FC = () => {
  const f = useCurrentFrame();
  if (f < 356 || f > 468) return null;
  const rows = ["Entrenamiento", "Lectura", "Trabajo profundo"];
  const exit = leave(f, 458, 10, -340);
  return (
    <div style={{ position: "absolute", inset: 0, ...(f >= 458 ? exit : {}) }}>
      <div style={{ ...abs(580), ...rise(f, 360, 12, 40, 18, 0.9) }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontFamily: FONT, fontSize: 210, fontWeight: 500, letterSpacing: -8, lineHeight: 1, color: K.text, textShadow: `0 0 50px rgba(10,132,255,0.35)` }}>05:30</div>
          <div style={{ ...mono, marginTop: 12 }}>Lunes · todos duermen</div>
        </div>
      </div>
      <div style={{ ...abs(930), ...rise(f, 378, 12, 50, 16, 0.92) }}>
        <div style={{ ...glass, width: 880, padding: "16px 44px", boxSizing: "border-box" }}>
          {rows.map((r, k) => {
            const on = ip(f, [wf(48) + k * 5, wf(48) + k * 5 + 7], [0, 1]);
            return (
              <div key={r} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "30px 0", borderTop: k ? `1px solid ${K.stroke}` : "none" }}>
                <span style={{ fontFamily: FONT, fontSize: 42, fontWeight: 500, color: on > 0.5 ? K.text : K.dim }}>{r}</span>
                <div style={{ width: 120, height: 70, borderRadius: 99, background: on > 0 ? `rgba(10,132,255,${0.25 + 0.75 * on})` : "#2A2A31", boxShadow: on > 0.5 ? `0 0 30px ${K.glow}` : undefined, position: "relative" }}>
                  <div style={{ position: "absolute", top: 6, left: 6 + 50 * on, width: 58, height: 58, borderRadius: 99, background: "#fff" }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div style={{ ...abs(1400), ...rise(f, wf(50), 10, 30, 14, 0.85) }}>
        <div style={{ ...glass, borderRadius: 999, display: "flex", alignItems: "center", gap: 18, padding: "22px 38px", fontFamily: FONT, fontSize: 38, fontWeight: 500, color: K.dim }}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={K.dim} strokeWidth="1.8" strokeLinecap="round">
            <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z" />
            <circle cx="12" cy="12" r="3" />
            <path d="M3 3l18 18" />
          </svg>
          Espectadores
          <span style={{ color: K.text, fontWeight: 600, fontSize: 44 }}>0</span>
        </div>
      </div>
    </div>
  );
};

// ─── 5 · Feed basura que se colapsa en una papelera ───
export const SceneFeed: React.FC = () => {
  const f = useCurrentFrame();
  if (f < 454 || f > 544) return null;
  const tags = ["Drama", "Chisme", "Polémica", "Clickbait", "Drama", "Chisme", "Polémica", "Clickbait", "Drama", "Chisme", "Polémica", "Clickbait"];
  const scroll = interpolate(f, [462, wf(63)], [0, 1900], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.in(Easing.quad) });
  const speed = interpolate(f, [462, wf(63)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.in(Easing.quad) });
  const col = wf(63);
  const following = count(f, wf(55), wf(58) + 6, 1248);
  const exit = leave(f, 534, 10, -340);
  return (
    <div style={{ position: "absolute", inset: 0, ...rise(f, 458, 12, 160, 22, 0.94), ...(f >= 534 ? exit : {}) }}>
      <div style={{ ...abs(500) }}>
        <div style={{ ...glass, borderRadius: 999, display: "flex", alignItems: "center", gap: 18, padding: "20px 36px", fontFamily: FONT, fontSize: 36, color: K.dim }}>
          Siguiendo <span style={{ color: K.text, fontWeight: 600, fontSize: 46 }}>{fmt(following)}</span>
        </div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 640, height: 1080, overflow: "hidden", maskImage: "linear-gradient(180deg, transparent 0%, black 14%, black 86%, transparent 100%)" }}>
        {tags.map((tag, k) => {
          const y = 40 + k * 230 - (scroll % 230) - Math.floor(scroll / 230) * 0;
          const yy = ((40 + k * 230 - scroll) % 2760 + 2760) % 2760 - 200;
          const c = ip(f, [col + (k % 6) * 1.2, col + (k % 6) * 1.2 + 9], [0, 1], Easing.in(Easing.cubic));
          return (
            <div
              key={k}
              style={{
                position: "absolute",
                left: 130,
                top: interpolate(c, [0, 1], [yy, 470]),
                width: 820,
                height: 190,
                ...glass,
                borderRadius: 30,
                display: "flex",
                alignItems: "center",
                gap: 26,
                padding: "0 30px",
                boxSizing: "border-box",
                filter: `blur(${speed * 7}px)`,
                scale: interpolate(c, [0, 1], [1, 0.05]),
                opacity: 1 - ip(c, [0.7, 1], [0, 1]),
                translate: `0px ${y * 0}px`,
              }}
            >
              <div style={{ width: 86, height: 86, borderRadius: 99, background: "#2C2C34" }} />
              <div style={{ flex: 1 }}>
                <div style={{ width: 300, height: 20, borderRadius: 10, background: "#34343C" }} />
                <div style={{ width: 420, height: 14, borderRadius: 7, background: "#24242B", marginTop: 16 }} />
              </div>
              <div style={{ fontFamily: FONT, fontSize: 26, fontWeight: 500, color: K.dim, border: `1px solid ${K.stroke}`, borderRadius: 999, padding: "10px 18px" }}>{tag}</div>
            </div>
          );
        })}
      </div>
      {/* papelera */}
      <div style={{ ...abs(1010), opacity: ip(f, [col + 4, col + 8], [0, 1]), scale: ip(f, [col + 4, col + 14], [0.4, 1], Easing.bezier(0.34, 1.56, 0.64, 1)) }}>
        <svg width="220" height="220" viewBox="0 0 24 24" fill="none" stroke={K.blue} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" style={{ filter: `drop-shadow(0 0 30px ${K.glow})` }}>
          <g style={{ rotate: `${ip(f, [col + 10, col + 16], [-18, 0])}deg`, transformOrigin: "4px 6px" }}>
            <path d="M3 6h18M8 6V4h8v2" />
          </g>
          <path d="M5 6l1 14h12l1-14M10 10v6M14 10v6" />
        </svg>
      </div>
    </div>
  );
};

// ─── 6 · Seguir: el cursor pulsa, "Siguiendo ✓", tus objetivos ───
export const SceneSeguir: React.FC = () => {
  const f = useCurrentFrame();
  if (f < 530) return null;
  const click = 551;
  const press = interpolate(f, [click, click + 3, click + 8], [1, 0.93, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const on = ip(f, [click + 2, click + 10], [0, 1], INOUT);
  const cx = interpolate(f, [536, click], [930, 600], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: OUT });
  const cy = interpolate(f, [536, click], [1450, 740], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: OUT });
  const goals = ["Disciplina", "Constancia", "Resultados"];
  return (
    <div style={{ position: "absolute", inset: 0, ...rise(f, 534, 12, 160, 22, 0.94) }}>
      <div style={{ ...abs(660), scale: press }}>
        <div
          style={{
            width: interpolate(on, [0, 1], [520, 600]),
            height: 140,
            borderRadius: 999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 16,
            fontFamily: FONT,
            fontSize: 56,
            fontWeight: 600,
            letterSpacing: -1,
            color: "#fff",
            background: on < 0.5 ? `linear-gradient(180deg, ${K.cyan}, ${K.blue})` : K.cardSolid,
            border: `1.5px solid ${on < 0.5 ? "transparent" : "rgba(10,132,255,0.6)"}`,
            boxShadow: `0 0 ${interpolate(on, [0, 1], [70, 40])}px ${K.glow}`,
          }}
        >
          {on < 0.5 ? "Seguir" : (
            <>
              Siguiendo <Check p={ip(f, [click + 6, click + 14], [0, 1])} size={52} />
            </>
          )}
        </div>
      </div>
      <svg width="64" height="64" viewBox="0 0 24 24" style={{ position: "absolute", left: cx, top: cy, opacity: ip(f, [536, 540], [0, 1]) - ip(f, [click + 16, click + 22], [0, 1]), filter: "drop-shadow(0 6px 12px rgba(0,0,0,0.6))" }}>
        <path d="M4 2l16 9-7 2-3 7z" fill="#fff" stroke="#111" strokeWidth="1" strokeLinejoin="round" />
      </svg>
      <div style={{ ...abs(920), ...rise(f, wf(68), 12, 50, 16, 0.92) }}>
        <div style={{ ...glass, width: 880, padding: "30px 46px", boxSizing: "border-box" }}>
          <div style={{ ...mono, marginBottom: 6 }}>Tus objetivos</div>
          {goals.map((g, k) => {
            const p = ip(f, [wf(71) + k * 4, wf(71) + k * 4 + 8], [0, 1]);
            return (
              <div key={g} style={{ display: "flex", alignItems: "center", gap: 26, padding: "26px 0", borderTop: k ? `1px solid ${K.stroke}` : "none", ...rise(f, wf(69) + k * 3, 9, 16, 10, 0.95) }}>
                <Check p={p} size={56} />
                <span style={{ fontFamily: FONT, fontSize: 44, fontWeight: 500, color: p > 0.5 ? K.text : K.dim }}>{g}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
