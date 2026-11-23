import React from "react";
import { AbsoluteFill } from "remotion";

// Rig v2: réplica del personaje de "¿Y si…?" — cabeza negra mate con contorno de luz de color,
// cara blanca plana grande, ropa real (sudadera con cordones, mangas de tela), guantes negros con pulgar.
export type Face = { eyeX?: number; eyeY?: number; brow?: number; browTilt?: number; mouth?: "smile" | "flat" | "o" | "smirk"; sweat?: boolean; lid?: number };
export const Head: React.FC<{ x: number; y: number; r: number; face?: Face; rimL?: string; rimR?: string; id: string; hair?: React.ReactNode }> = ({ x, y, r, face = {}, rimL = "#7FD4FF", rimR = "#FFB45A", id, hair }) => {
  const ex = (face.eyeX ?? 0) * r * 0.05, ey = (face.eyeY ?? 0) * r * 0.05;
  const lid = face.lid ?? 0;
  return (
    <g transform={`translate(${x} ${y})`}>
      <defs>
        <radialGradient id={`hg${id}`} cx="40%" cy="32%" r="75%"><stop offset="0%" stopColor="#2E2E38" /><stop offset="55%" stopColor="#141419" /><stop offset="100%" stopColor="#09090C" /></radialGradient>
        <clipPath id={`hc${id}`}><circle r={r} /></clipPath>
      </defs>
      {/* contorno de luz: dos medias lunas de color */}
      <circle r={r + 3} fill={rimR} />
      <circle r={r + 3} fill={rimL} clipPath={`url(#hl${id})`} />
      <defs><clipPath id={`hl${id}`}><rect x={-r - 10} y={-r - 10} width={r + 10} height={2 * r + 20} /></clipPath></defs>
      <circle r={r} fill={`url(#hg${id})`} />
      <g clipPath={`url(#hc${id})`}><circle cx={-r * 0.06} cy={0} r={r * 0.99} fill="none" stroke="#000" strokeOpacity={0.35} strokeWidth={r * 0.06} /></g>
      {hair}
      {/* cejas */}
      {[-1, 1].map((s) => (
        <path key={s} d={`M${s * r * 0.36 - r * 0.15} ${-r * 0.3 - (face.brow ?? 0) * r * 0.08 + s * (face.browTilt ?? 0) * r * 0.04} Q ${s * r * 0.36} ${-r * 0.37 - (face.brow ?? 0) * r * 0.1} ${s * r * 0.36 + r * 0.15} ${-r * 0.3 - (face.brow ?? 0) * r * 0.08 - s * (face.browTilt ?? 0) * r * 0.04}`} stroke="#FFFFFF" strokeWidth={r * 0.075} strokeLinecap="round" fill="none" />
      ))}
      {/* ojos */}
      {[-1, 1].map((s) => (
        <g key={s} transform={`translate(${s * r * 0.34} ${-r * 0.06})`}>
          <ellipse rx={r * 0.17} ry={r * 0.2} fill="#FFFFFF" />
          <circle cx={ex + s * r * 0.02} cy={ey + r * 0.02} r={r * 0.075} fill="#0A0A0E" />
          {lid > 0 ? <rect x={-r * 0.2} y={-r * 0.22} width={r * 0.4} height={r * 0.4 * lid} fill="#141419" /> : null}
        </g>
      ))}
      {/* boca */}
      {(face.mouth ?? "smile") === "smile" ? <path d={`M${-r * 0.24} ${r * 0.38} Q 0 ${r * 0.56} ${r * 0.24} ${r * 0.38}`} stroke="#FFF" strokeWidth={r * 0.07} strokeLinecap="round" fill="none" /> : null}
      {face.mouth === "flat" ? <path d={`M${-r * 0.16} ${r * 0.42} L ${r * 0.16} ${r * 0.42}`} stroke="#FFF" strokeWidth={r * 0.07} strokeLinecap="round" /> : null}
      {face.mouth === "smirk" ? <path d={`M${-r * 0.2} ${r * 0.44} Q ${r * 0.05} ${r * 0.52} ${r * 0.26} ${r * 0.34}`} stroke="#FFF" strokeWidth={r * 0.07} strokeLinecap="round" fill="none" /> : null}
      {face.mouth === "o" ? <ellipse cx={0} cy={r * 0.45} rx={r * 0.09} ry={r * 0.12} fill="#FFF" /> : null}
      {face.sweat ? <path d={`M${r * 0.62} ${-r * 0.42} Q ${r * 0.52} ${-r * 0.22} ${r * 0.62} ${-r * 0.12} Q ${r * 0.72} ${-r * 0.22} ${r * 0.62} ${-r * 0.42} Z`} fill="#9FD6F4" /> : null}
    </g>
  );
};
// guante negro tipo mitón con pulgar
export const Glove: React.FC<{ x: number; y: number; s: number; rot?: number; rim?: string }> = ({ x, y, s, rot = 0, rim = "#FFB45A" }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <path d="M-34 -10 Q -40 -56 0 -60 Q 40 -56 36 -10 L 34 30 Q 0 46 -34 30 Z" fill={rim} transform="translate(2 -2)" />
    <path d="M-34 -10 Q -40 -56 0 -60 Q 40 -56 36 -10 L 34 30 Q 0 46 -34 30 Z" fill="#0E0E12" />
    <path d="M-34 -6 Q -62 -14 -60 -38 Q -46 -44 -32 -28" fill="#0E0E12" />
    {[-14, 4, 20].map((v) => <path key={v} d={`M${v} -54 L ${v} -26`} stroke="#2A2A32" strokeWidth={4} strokeLinecap="round" />)}
  </g>
);
// sudadera (torso + capucha + cordones) y mangas de tela
export const Hoodie: React.FC<{ x: number; y: number; s: number; c: string; c2: string; armR?: [number, number]; armL?: [number, number]; rim?: string; holdR?: React.ReactNode }> = ({ x, y, s, c, c2, armR = [10, 20], armL = [10, 20], rim = "#FFB45A", holdR }) => {
  const arm = (sd: number, [a, b]: [number, number]) => {
    const sx = sd * 150, sy = -40, r1 = (a * sd * Math.PI) / 180, r2 = ((a + b) * sd * Math.PI) / 180;
    const ex = sx + Math.sin(r1) * 170, ey = sy + Math.cos(r1) * 170, hx = ex + Math.sin(r2) * 160, hy = ey + Math.cos(r2) * 160;
    return { d: `M${sx} ${sy} L ${ex} ${ey} L ${hx} ${hy}`, hx, hy, rot: -((a + b) * sd) + 180 };
  };
  const L = arm(-1, armL), R = arm(1, armR);
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d={L.d} stroke={c2} strokeWidth={96} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <Glove x={L.hx} y={L.hy} s={1.2} rot={L.rot} rim={rim} />
      <path d="M-170 -60 Q -190 120 -170 330 L 170 330 Q 190 120 170 -60 Q 0 -110 -170 -60 Z" fill={rim} transform="translate(4 -3)" />
      <path d="M-170 -60 Q -190 120 -170 330 L 170 330 Q 190 120 170 -60 Q 0 -110 -170 -60 Z" fill={c} />
      <path d="M-110 -80 Q 0 20 110 -80 Q 0 -40 -110 -80 Z" fill={c2} />
      <path d="M-40 -30 L -48 120 M 40 -30 L 48 120" stroke="#F4F4F4" strokeWidth={14} strokeLinecap="round" />
      <path d="M-120 200 Q 0 230 120 200 L 110 300 Q 0 320 -110 300 Z" fill={c2} opacity={0.6} />
      <path d={R.d} stroke={c2} strokeWidth={96} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d={R.d} stroke={c} strokeWidth={70} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      {holdR ? <g transform={`translate(${R.hx} ${R.hy - 30})`}>{holdR}</g> : null}
      <Glove x={R.hx} y={R.hy} s={1.2} rot={R.rot} rim={rim} />
    </g>
  );
};

// Prueba: recrear el cuadro de referencia (aula, primer plano con hoja y lápiz)
export const RigTest: React.FC = () => (
  <AbsoluteFill style={{ background: "#000" }}>
    <AbsoluteFill style={{ filter: "blur(3px)" }}>
      <svg width={1920} height={1080}>
        <defs><linearGradient id="wall" x1="0" y1="0" x2="1" y2="0.3"><stop offset="0%" stopColor="#F2E7C4" /><stop offset="100%" stopColor="#FBF3D2" /></linearGradient>
          <radialGradient id="sun" cx="80%" cy="50%" r="60%"><stop offset="0%" stopColor="#FFD27A" stopOpacity="0.55" /><stop offset="100%" stopColor="#FFD27A" stopOpacity="0" /></radialGradient></defs>
        <rect width={1920} height={1080} fill="url(#wall)" />
        <rect x={0} y={110} width={700} height={500} rx={10} fill="#C89A5E" /><rect x={14} y={124} width={672} height={472} fill="#D9AE72" />
        <text x={240} y={185} fontFamily="YCap" fontSize={40} fill="#7A4A22">NUESTROS TRABAJOS</text>
        {[[40, 220, "#F6D23A"], [210, 210, "#E64A3A"], [385, 210, "#3A8AE6"], [560, 215, "#888"], [40, 350, "#888"], [400, 345, "#F6D23A"]].map(([x, y, c], i) => <g key={i} transform={`translate(${x} ${y}) rotate(${(i % 2 ? 1 : -1) * 3})`}><rect width={140} height={110} fill="#FBFBF8" /><circle cx={70} cy={50} r={24} fill={c as string} /><circle cx={100} cy={8} r={6} fill="#E64A3A" /></g>)}
        <rect x={1340} y={400} width={580} height={22} fill="#C8843A" />
        {[[1380, "#E8424A"], [1450, "#F04A8A"], [1560, "#E83A3A"], [1680, "#3AC46A"], [1790, "#6A5AE8"]].map(([x, c], i) => <g key={i}><circle cx={(x as number) + 30} cy={414} r={10} fill="#F4E2B8" /><rect x={x as number} y={440} width={70} height={110} rx={16} fill={c as string} /></g>)}
        <rect x={0} y={560} width={1920} height={520} fill="#E7A44A" />
        <rect x={1600} y={720} width={320} height={60} fill="#C98A45" /><rect x={480} y={700} width={240} height={300} fill="#B8783A" />
        <rect width={1920} height={1080} fill="url(#sun)" />
      </svg>
    </AbsoluteFill>
    <svg width={1920} height={1080} style={{ position: "absolute" }}>
      {/* fondo derecha: alumno */}
      <Head id="b1" x={1770} y={580} r={120} face={{ mouth: "flat", eyeX: -0.6 }} rimL="#FFB45A" rimR="#FFE0A0" hair={<path d="M-120 -40 Q -110 -130 0 -128 Q 110 -130 122 -40 Q 80 -70 0 -66 Q -80 -70 -120 -40 Z" fill="#3A3A6A" />} />
      {/* principal */}
      <Hoodie x={1010} y={880} s={1.05} c="#36D3A8" c2="#22A684" armR={[150, 30]} armL={[30, 40]} rim="#FFD27A" />
      <g transform="translate(940 900) rotate(-28)"><rect x={0} y={0} width={420} height={330} fill="#FFFFFF" /><rect x={0} y={0} width={420} height={330} fill="none" stroke="#E8E0D0" strokeWidth={6} /></g>
      <Head id="m1" x={1010} y={440} r={370} face={{ brow: 0.6, browTilt: -0.4, mouth: "smile", sweat: true, eyeY: 0.3 }} rimL="#9FE0FF" rimR="#FFB45A" />
      <g transform="translate(800 40) rotate(28)"><rect x={0} y={0} width={22} height={240} rx={4} fill="#F6C42A" /><path d="M0 240 L 11 280 L 22 240 Z" fill="#2A2A2A" /></g>
      {/* primer plano izquierda: niña con gafas y trenza */}
      <g>
        <path d="M200 1080 Q 220 920 360 900 Q 520 920 560 1080 Z" fill="#C2464E" />
        <Head id="g1" x={250} y={640} r={300} face={{ mouth: "flat", lid: 0.35, eyeX: 0.8 }} rimL="#9FE0FF" rimR="#FFB45A" />
        <g fill="none" stroke="#3A2A5A" strokeWidth={22}><circle cx={150} cy={620} r={110} /><circle cx={380} cy={620} r={110} /><path d="M260 620 L 270 620" /></g>
        <circle cx={440} cy={600} r={48} fill="#F2525A" />
        <path d="M470 560 Q 560 720 470 900 Q 440 1000 470 1080" stroke="#3A2A5A" strokeWidth={70} fill="none" strokeLinecap="round" />
      </g>
    </svg>
    <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 76, background: "#000" }} /><div style={{ position: "absolute", left: 0, bottom: 0, width: 1920, height: 76, background: "#000" }} />
  </AbsoluteFill>
);
