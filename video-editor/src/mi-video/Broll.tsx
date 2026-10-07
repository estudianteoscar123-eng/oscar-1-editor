import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import data from "../../public/mi-video/data.json";
import { Pill } from "./Camera";
import { C, MONO, SANS, SERIF, cardStyle, enter, monoLabel } from "./theme";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const EASE = Easing.bezier(0.16, 1, 0.3, 1);

const useWordFrame = (startSec: number) => {
  const { fps } = useVideoConfig();
  return (i: number) => Math.round((data.words[i].s - startSec) * fps);
};

// Bloque de contenido centrado en la zona útil (y 380–1300); los subtítulos van debajo
const Stage: React.FC<{ children: React.ReactNode; gap?: number }> = ({ children, gap = 36 }) => (
  <div
    style={{
      position: "absolute",
      left: 90,
      right: 90,
      top: 330,
      height: 1000,
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      gap,
    }}
  >
    {children}
  </div>
);

const Label: React.FC<{ text: string; at?: number }> = ({ text, at = 0 }) => {
  const frame = useCurrentFrame();
  return <div style={{ ...monoLabel, textAlign: "center", ...enter(frame, at) }}>{text}</div>;
};

const Accent: React.FC<{ text: string; at: number; size?: number }> = ({ text, at, size = 84 }) => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        fontFamily: SERIF,
        fontStyle: "italic",
        fontSize: size,
        lineHeight: 1,
        color: C.blue,
        textAlign: "center",
        ...enter(frame, at, 8),
      }}
    >
      {text}
    </div>
  );
};

const Icon: React.FC<{ d: string }> = ({ d }) => (
  <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke={C.ink} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);
const ICONS = {
  glass: "M8 22h8M12 15v7M7 2h10l-1 7a4 4 0 0 1-8 0L7 2z",
  smoke: "M2 16h15v4H2zM19 16v4M22 16v4M18 12c0-2-2-2-2-4s2-2 2-4",
  phone: "M7 2h10a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zM11 18h2",
};

// 1 · Lo que se elimina
export const BrollElimina: React.FC<{ startSec: number }> = ({ startSec }) => {
  const frame = useCurrentFrame();
  const wf = useWordFrame(startSec);
  const items = [
    { text: "Alcohol", icon: ICONS.glass, at: 2 },
    { text: "Tabaco y drogas", icon: ICONS.smoke, at: 6 },
    { text: "Móvil al despertar", icon: ICONS.phone, at: wf(11) },
  ];
  return (
    <Stage>
      <Label text="Winter Arc · lo que eliminas" />
      <div style={{ ...cardStyle, padding: "10px 34px", ...enter(frame, 0) }}>
        {items.map((it, k) => {
          const off = it.at + 10;
          const strike = interpolate(frame, [off, off + 8], [0, 100], { ...clamp, easing: EASE });
          const done = interpolate(frame, [off, off + 8], [0, 1], clamp);
          return (
            <div
              key={it.text}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 26,
                padding: "28px 0",
                borderTop: k ? `1px solid ${C.line}` : "none",
                ...enter(frame, it.at),
              }}
            >
              <div
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: 20,
                  background: "#F3F5FA",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Icon d={it.icon} />
              </div>
              <div
                style={{
                  position: "relative",
                  fontFamily: SANS,
                  fontWeight: 700,
                  fontSize: 44,
                  letterSpacing: -0.6,
                  color: done > 0.5 ? C.muted : C.ink,
                }}
              >
                {it.text}
                <div style={{ position: "absolute", left: 0, top: "53%", height: 4, width: `${strike}%`, background: C.ink, borderRadius: 4 }} />
              </div>
              <div
                style={{
                  marginLeft: "auto",
                  fontFamily: MONO,
                  fontSize: 20,
                  letterSpacing: 2,
                  color: C.blue,
                  background: C.blueSoft,
                  borderRadius: 999,
                  padding: "10px 18px",
                  opacity: done,
                  scale: interpolate(done, [0, 1], [0.9, 1]),
                }}
              >
                FUERA
              </div>
            </div>
          );
        })}
      </div>
    </Stage>
  );
};

// 2 · "bajo ningún concepto"
export const BrollCeroFiestas: React.FC<{ startSec: number }> = () => {
  const frame = useCurrentFrame();
  return (
    <Stage gap={10}>
      <Label text="Regla 05 · salir de fiesta" />
      <div
        style={{
          textAlign: "center",
          fontFamily: SANS,
          fontWeight: 800,
          fontSize: 440,
          lineHeight: 1,
          letterSpacing: -16,
          color: C.ink,
          ...enter(frame, 2, 9),
          scale: interpolate(frame, [2, 12], [1.12, 1], { ...clamp, easing: EASE }),
        }}
      >
        0
      </div>
      <Accent text="fiestas en 90 días" at={8} />
      <div style={{ display: "flex", justifyContent: "center", marginTop: 40, ...enter(frame, 14) }}>
        <Pill>Sin excepciones</Pill>
      </div>
    </Stage>
  );
};

// 3 · Rutina: fe y horario de sueño
export const BrollRutina: React.FC<{ startSec: number }> = ({ startSec }) => {
  const frame = useCurrentFrame();
  const wf = useWordFrame(startSec);
  const rows = [
    { time: "Siempre", text: "Seguir el camino de Dios", at: 0 },
    { time: "22:00", text: "Dormir", at: wf(38) },
    { time: "06:00", text: "Levantarse", at: wf(38) + 16 },
  ];
  return (
    <Stage>
      <Label text="Rutina diaria" />
      <div style={{ ...cardStyle, padding: "10px 34px", ...enter(frame, 0) }}>
        {rows.map((r, k) => (
          <div
            key={r.text}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 28,
              padding: "30px 0",
              borderTop: k ? `1px solid ${C.line}` : "none",
              ...enter(frame, r.at),
            }}
          >
            <div
              style={{
                ...monoLabel,
                fontSize: 22,
                color: C.blue,
                background: C.blueSoft,
                borderRadius: 14,
                padding: "12px 0",
                width: 170,
                textAlign: "center",
              }}
            >
              {r.time}
            </div>
            <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 44, letterSpacing: -0.6, color: C.ink }}>{r.text}</div>
          </div>
        ))}
      </div>
    </Stage>
  );
};

// 4 · Entreno: 5 de 7 días
export const BrollSemana: React.FC<{ startSec: number }> = ({ startSec }) => {
  const frame = useCurrentFrame();
  const wf = useWordFrame(startSec);
  const days = ["L", "M", "X", "J", "V", "S", "D"];
  const on = [0, 1, 2, 4, 5];
  const fillStart = wf(44);
  const count = on.filter((_, k) => frame >= fillStart + k * 4).length;
  return (
    <Stage gap={44}>
      <Label text="Entreno · semana" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        {days.map((d, k) => {
          const order = on.indexOf(k);
          const fill = order < 0 ? 0 : interpolate(frame, [fillStart + order * 4, fillStart + order * 4 + 6], [0, 1], clamp);
          return (
            <div
              key={d}
              style={{
                ...cardStyle,
                width: 116,
                height: 156,
                borderRadius: 24,
                position: "relative",
                overflow: "hidden",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                ...enter(frame, k * 2),
              }}
            >
              <div style={{ position: "absolute", inset: 0, background: C.blue, opacity: fill }} />
              <span
                style={{
                  position: "relative",
                  fontFamily: SANS,
                  fontWeight: 700,
                  fontSize: 40,
                  color: fill > 0.5 ? C.white : C.muted,
                }}
              >
                {d}
              </span>
            </div>
          );
        })}
      </div>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "center", gap: 16, ...enter(frame, fillStart) }}>
        <span style={{ fontFamily: SANS, fontWeight: 800, fontSize: 220, lineHeight: 1, letterSpacing: -8, color: C.ink }}>{count}</span>
        <span style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 84, color: C.blue }}>días</span>
      </div>
    </Stage>
  );
};

// 5 · Gratitud: cada día cuenta
export const BrollGratitud: React.FC<{ startSec: number }> = ({ startSec }) => {
  const frame = useCurrentFrame();
  const wf = useWordFrame(startSec);
  const plus = wf(70);
  const day = frame >= plus ? 4 : 3;
  return (
    <Stage>
      <Label text="Gratitud · Winter Arc" />
      <div style={{ ...cardStyle, padding: "44px 48px", ...enter(frame, 0) }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 14, fontFamily: SANS, color: C.ink }}>
          <span style={{ ...monoLabel, fontSize: 24, marginRight: 8 }}>Día</span>
          <span
            style={{
              fontWeight: 800,
              fontSize: 190,
              lineHeight: 1,
              letterSpacing: -7,
              display: "inline-block",
              ...enter(frame, day === 4 ? plus : 2, 6),
            }}
          >
            {day}
          </span>
          <span style={{ fontWeight: 700, fontSize: 72, color: C.muted, letterSpacing: -2 }}>/90</span>
        </div>
        <div style={{ height: 10, borderRadius: 10, background: "#E3E7F0", marginTop: 36 }}>
          <div
            style={{
              height: "100%",
              borderRadius: 10,
              background: C.blue,
              width: `${interpolate(frame, [plus, plus + 10], [3 / 90, 4 / 90], { ...clamp, easing: EASE }) * 100}%`,
            }}
          />
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "center", ...enter(frame, plus) }}>
        <Pill>+1 día</Pill>
      </div>
      <Accent text="cada día cuenta" at={plus + 4} size={72} />
    </Stage>
  );
};

const SOCIAL = [
  { name: "TikTok", d: "M9 12a4 4 0 1 0 4 4V3c1 2 3 3 5 3" },
  { name: "Instagram", d: "M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4zM12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM17.5 6.5h.01" },
  { name: "YouTube", d: "M3 7a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3zM10 9l5 3-5 3z" },
];

// 6 · Cierre: "sígueme en mis redes sociales"
export const BrollRedes: React.FC<{ startSec: number }> = () => {
  const frame = useCurrentFrame();
  return (
    <Stage gap={50}>
      <Label text="Sígueme" />
      <div style={{ display: "flex", justifyContent: "center", gap: 36 }}>
        {SOCIAL.map((s, k) => (
          <div key={s.name} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 22, ...enter(frame, 3 + k * 5) }}>
            <div
              style={{
                ...cardStyle,
                width: 220,
                height: 220,
                borderRadius: 52,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg width="96" height="96" viewBox="0 0 24 24" fill="none" stroke={C.blue} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d={s.d} />
              </svg>
            </div>
            <div style={{ ...monoLabel, color: C.ink }}>{s.name}</div>
          </div>
        ))}
      </div>
      <Accent text="te espero dentro" at={20} size={78} />
    </Stage>
  );
};
