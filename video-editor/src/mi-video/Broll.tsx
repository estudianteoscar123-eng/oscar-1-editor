import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import data from "../../public/mi-video/data.json";
import { C, MONO, SANS, cardStyle, enter, monoLabel } from "./theme";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const EASE = Easing.bezier(0.16, 1, 0.3, 1);

// fotograma (relativo a la escena) en que se dice la palabra i
const useWordFrame = (startSec: number) => {
  const { fps } = useVideoConfig();
  return (i: number) => Math.round((data.words[i].s - startSec) * fps);
};

const Label: React.FC<{ text: string; at: number }> = ({ text, at }) => {
  const frame = useCurrentFrame();
  return <div style={{ ...monoLabel, textAlign: "center", ...enter(frame, at) }}>{text}</div>;
};

const Column: React.FC<{ children: React.ReactNode; top?: number }> = ({ children, top = 420 }) => (
  <div style={{ position: "absolute", left: 90, right: 90, top, display: "flex", flexDirection: "column", gap: 28 }}>
    {children}
  </div>
);

// 1 · Lista de lo que se elimina (alcohol, drogas, móvil)
export const BrollElimina: React.FC<{ startSec: number }> = ({ startSec }) => {
  const frame = useCurrentFrame();
  const wf = useWordFrame(startSec);
  const items = [
    { text: "Alcohol", at: 2 },
    { text: "Tabaco y drogas", at: 7 },
    { text: "Móvil al despertar", at: wf(11) },
  ];
  return (
    <Column>
      <Label text="Winter Arc · lo que eliminas" at={0} />
      <div style={{ ...cardStyle, padding: "18px 36px", ...enter(frame, 0) }}>
        {items.map((it, k) => {
          const strike = interpolate(frame, [it.at + 6, it.at + 14], [0, 100], { ...clamp, easing: EASE });
          return (
            <div
              key={it.text}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 28,
                padding: "26px 0",
                borderTop: k ? `1px solid ${C.cardBorder}` : "none",
                ...enter(frame, it.at),
              }}
            >
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 99,
                  background: "rgba(230,57,70,0.15)",
                  color: C.red,
                  fontFamily: SANS,
                  fontWeight: 900,
                  fontSize: 34,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                ✕
              </div>
              <div style={{ position: "relative", fontFamily: SANS, fontWeight: 700, fontSize: 48, color: C.white }}>
                {it.text}
                <div
                  style={{
                    position: "absolute",
                    left: 0,
                    top: "52%",
                    height: 5,
                    width: `${strike}%`,
                    background: C.red,
                    borderRadius: 4,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </Column>
  );
};

// 2 · "bajo ningún concepto": 0 fiestas en 90 días
export const BrollCeroFiestas: React.FC<{ startSec: number }> = () => {
  const frame = useCurrentFrame();
  return (
    <Column top={360}>
      <Label text="Fiestas en 90 días" at={0} />
      <div
        style={{
          textAlign: "center",
          fontFamily: SANS,
          fontWeight: 900,
          fontSize: 420,
          lineHeight: 1,
          letterSpacing: -12,
          color: C.white,
          ...enter(frame, 2, 9),
          scale: interpolate(frame, [2, 11], [1.15, 1], { ...clamp, easing: EASE }),
        }}
      >
        0
      </div>
      <div style={{ display: "flex", justifyContent: "center", ...enter(frame, 10) }}>
        <div
          style={{
            background: C.red,
            color: C.white,
            fontFamily: MONO,
            fontWeight: 700,
            fontSize: 28,
            letterSpacing: 2,
            padding: "16px 30px",
            borderRadius: 999,
          }}
        >
          SIN EXCEPCIONES
        </div>
      </div>
    </Column>
  );
};

// 3 · Rutina: fe + horario de sueño
export const BrollRutina: React.FC<{ startSec: number }> = ({ startSec }) => {
  const frame = useCurrentFrame();
  const wf = useWordFrame(startSec);
  const rows = [
    { time: "DIARIO", text: "Seguir el camino de Dios", at: 0 },
    { time: "22:00", text: "Dormir", at: wf(38) },
    { time: "06:00", text: "Levantarse", at: wf(38) + 18 },
  ];
  return (
    <Column>
      <Label text="Rutina diaria" at={0} />
      <div style={{ ...cardStyle, padding: "14px 36px", ...enter(frame, 0) }}>
        {rows.map((r, k) => (
          <div
            key={r.text}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 30,
              padding: "30px 0",
              borderTop: k ? `1px solid ${C.cardBorder}` : "none",
              ...enter(frame, r.at),
            }}
          >
            <div style={{ ...monoLabel, width: 150, color: C.blue, fontWeight: 700 }}>{r.time}</div>
            <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 46, color: C.white }}>{r.text}</div>
          </div>
        ))}
      </div>
    </Column>
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
    <Column top={440}>
      <Label text="Entreno · semana" at={0} />
      <div style={{ display: "flex", justifyContent: "space-between", ...enter(frame, 0) }}>
        {days.map((d, k) => {
          const order = on.indexOf(k);
          const fill =
            order < 0 ? 0 : interpolate(frame, [fillStart + order * 4, fillStart + order * 4 + 6], [0, 1], clamp);
          return (
            <div
              key={d}
              style={{
                ...cardStyle,
                width: 118,
                height: 170,
                borderRadius: 22,
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "center",
                paddingBottom: 20,
                position: "relative",
                overflow: "hidden",
                ...enter(frame, k * 2),
              }}
            >
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  bottom: 0,
                  height: `${fill * 100}%`,
                  background: C.red,
                  boxShadow: `0 0 30px ${C.red}`,
                }}
              />
              <span style={{ position: "relative", fontFamily: MONO, fontWeight: 700, fontSize: 30, color: C.white }}>
                {d}
              </span>
            </div>
          );
        })}
      </div>
      <div
        style={{
          textAlign: "center",
          fontFamily: SANS,
          fontWeight: 900,
          fontSize: 200,
          lineHeight: 1,
          letterSpacing: -6,
          color: C.white,
          marginTop: 30,
          ...enter(frame, fillStart),
        }}
      >
        {count}
        <span style={{ color: C.muted, fontSize: 110 }}>/7</span>
      </div>
    </Column>
  );
};

// 5 · Gratitud: cada día cuenta
export const BrollGratitud: React.FC<{ startSec: number }> = ({ startSec }) => {
  const frame = useCurrentFrame();
  const wf = useWordFrame(startSec);
  const plus = wf(70);
  const day = frame >= plus ? 4 : 3;
  return (
    <Column top={420}>
      <Label text="Gratitud · cada día cuenta" at={0} />
      <div style={{ ...cardStyle, padding: "44px 48px", ...enter(frame, 0) }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 18, fontFamily: SANS, color: C.white }}>
          <span style={{ ...monoLabel, fontSize: 28 }}>DÍA</span>
          <span style={{ fontWeight: 900, fontSize: 180, lineHeight: 1, letterSpacing: -6 }}>{day}</span>
          <span style={{ fontWeight: 800, fontSize: 70, color: C.muted }}>/90</span>
        </div>
        <div style={{ height: 10, borderRadius: 10, background: "#1A2040", marginTop: 34 }}>
          <div
            style={{
              height: "100%",
              borderRadius: 10,
              background: C.red,
              boxShadow: `0 0 18px ${C.red}`,
              width: `${interpolate(frame, [plus, plus + 10], [3 / 90, 4 / 90], { ...clamp, easing: EASE }) * 100}%`,
            }}
          />
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "center", ...enter(frame, plus) }}>
        <div
          style={{
            background: C.blue,
            color: C.white,
            fontFamily: MONO,
            fontWeight: 700,
            fontSize: 28,
            letterSpacing: 2,
            padding: "16px 30px",
            borderRadius: 999,
          }}
        >
          +1 DÍA
        </div>
      </div>
    </Column>
  );
};

// 6 · Cierre de marca
export const BrollCierre: React.FC<{ startSec: number }> = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", paddingBottom: 380 }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 34 }}>
        <div
          style={{
            width: 150,
            height: 150,
            borderRadius: 40,
            background: C.red,
            boxShadow: `0 0 60px rgba(230,57,70,0.6)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: SANS,
            fontWeight: 900,
            fontSize: 96,
            color: C.white,
            ...enter(frame, 0, 9),
            scale: interpolate(frame, [0, 9], [0.85, 1], { ...clamp, easing: EASE }),
          }}
        >
          ➜
        </div>
        <div
          style={{ fontFamily: SANS, fontWeight: 900, fontSize: 92, letterSpacing: -2, color: C.white, ...enter(frame, 5) }}
        >
          SINLIMITESLIFE
        </div>
        <div style={{ ...monoLabel, ...enter(frame, 10) }}>Mentalidad · Hábitos · Acción</div>
      </div>
    </AbsoluteFill>
  );
};
