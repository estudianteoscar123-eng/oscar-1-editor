import React from "react";

// Personaje réplica "¿Y si…?" de cuerpo entero, animable. (x,y) = pies; s=1 → cabeza r=120.
// Contorno de luz de dos colores (filtro), cabeza negro azulado mate, cara blanca plana, túnica de tela con mangas, guantes mitón.
export type YFace = { brow?: number; browTilt?: number; mouth?: "smile" | "flat" | "o" | "worry" | "grin"; eyeX?: number; eyeY?: number; lid?: number; sweat?: boolean; eyeS?: number };
export type YProps = {
  id: string; x: number; y: number; s?: number; t: number; facing?: 1 | -1; face?: YFace; talk?: boolean;
  armR?: [number, number]; armL?: [number, number]; robe?: string; robe2?: string; sash?: string;
  hair?: "none" | "curly" | "long" | "beard"; hairC?: string; holdR?: React.ReactNode; walk?: number; lean?: number; headOnly?: boolean; bob?: number;
};
export const YDefs: React.FC<{ l?: string; r?: string; id?: string }> = ({ l = "#FFB86C", r = "#A8E2F2", id = "rim" }) => (
  <defs>
    <filter id={id} x="-30%" y="-30%" width="160%" height="160%">
      <feOffset in="SourceAlpha" dx={-7} dy={-4} result="o1" /><feFlood floodColor={l} /><feComposite in2="o1" operator="in" result="c1" />
      <feOffset in="SourceAlpha" dx={6} dy={1} result="o2" /><feFlood floodColor={r} /><feComposite in2="o2" operator="in" result="c2" />
      <feMerge><feMergeNode in="c1" /><feMergeNode in="c2" /><feMergeNode in="SourceGraphic" /></feMerge>
    </filter>
    <radialGradient id="yhead" cx="34%" cy="34%" r="72%"><stop offset="0%" stopColor="#2A2D3C" /><stop offset="40%" stopColor="#111219" /><stop offset="100%" stopColor="#050507" /></radialGradient>
  </defs>
);
const BK = "#0C0D12";
const Glove: React.FC<{ x: number; y: number; rot: number; s?: number }> = ({ x, y, rot, s = 0.62 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <path d="M-34 -10 Q -40 -56 0 -60 Q 40 -56 36 -10 L 34 30 Q 0 46 -34 30 Z" fill={BK} />
    <path d="M-34 -6 Q -62 -14 -60 -38 Q -46 -44 -32 -28" fill={BK} />
  </g>
);
export const YChar: React.FC<YProps & { rim?: string }> = ({ id, x, y, s = 1, t, facing = 1, face = {}, talk, armR = [12, 16], armL = [12, 16], robe = "#E9DEC4", robe2 = "#BFAF8E", sash = "#2F6FB0", hair = "none", hairC = "#2E2238", holdR, walk, lean = 0, headOnly, rim = "rim", bob = 0 }) => {
  const R = 120;
  const br = Math.sin(t * 2.3 + id.length) * 3;
  const ph = walk !== undefined ? walk * Math.PI * 2 : 0;
  const legA = walk !== undefined ? Math.sin(ph) * 22 : 0;
  const wb = walk !== undefined ? -Math.abs(Math.cos(ph)) * 10 : 0;
  const sw = walk !== undefined ? Math.sin(ph) * 20 : 0;
  const blink = ((t * 0.33 + id.length * 0.7) % 1) < 0.04;
  const tk = talk ? Math.abs(Math.sin(t * 13 + Math.sin(t * 4))) : 0;
  const mouth = talk ? (tk > 0.3 ? "o" : "flat") : face.mouth ?? "smile";
  const es = face.eyeS ?? 1;
  const ex = (face.eyeX ?? 0.2) * R * 0.06, ey = (face.eyeY ?? 0.1) * R * 0.06;
  const arm = (sd: number, [a, b]: [number, number]) => {
    const sx = sd * 78, sy = -292, r1 = (a * sd * Math.PI) / 180, r2 = ((a + b) * sd * Math.PI) / 180;
    const ex2 = sx + Math.sin(r1) * 110, ey2 = sy + Math.cos(r1) * 110, hx = ex2 + Math.sin(r2) * 104, hy = ey2 + Math.cos(r2) * 104;
    return { d: `M${sx} ${sy} L ${ex2} ${ey2} L ${hx} ${hy}`, hx, hy, rot: 180 - (a + b) * sd };
  };
  const L = arm(-1, [armL[0] - sw, armL[1]]), Rr = arm(1, [armR[0] + sw, armR[1]]);
  const head = (
    <g transform={`translate(0 ${-430 + br * 0.6})`}>
      {hair === "long" ? <path d={`M${-R - 8} 10 C ${-R - 20} -120, ${R + 20} -120, ${R + 8} 10 L ${R - 4} 150 L ${-R + 4} 150 Z`} fill={hairC} /> : null}
      <circle r={R} fill="url(#yhead)" />
      {hair === "curly" ? [[-70, -88, 40], [-24, -110, 44], [26, -110, 44], [72, -88, 40], [-100, -50, 32], [102, -50, 32]].map(([a, b, r], i) => <circle key={i} cx={a} cy={b} r={r} fill={hairC} />) : null}
      {hair === "long" ? <path d={`M${-R + 6} -30 C ${-R + 20} -130, ${R - 20} -130, ${R - 6} -30 Q 60 -80 0 -78 Q -60 -80 ${-R + 6} -30 Z`} fill={hairC} /> : null}
      {hair === "beard" ? <path d={`M${-R * 0.78} 20 C ${-R * 0.8} 110, -40 150, 0 152 C 40 150, ${R * 0.8} 110, ${R * 0.78} 20 C 60 70, -60 70, ${-R * 0.78} 20 Z`} fill={hairC} /> : null}
      {/* cejas */}
      {[-1, 1].map((sd) => <path key={sd} d={`M${sd * R * 0.36 - R * 0.15} ${-R * 0.3 - (face.brow ?? 0) * R * 0.08 + sd * (face.browTilt ?? 0) * R * 0.05} L ${sd * R * 0.36 + R * 0.15} ${-R * 0.3 - (face.brow ?? 0) * R * 0.08 - sd * (face.browTilt ?? 0) * R * 0.05}`} stroke="#FFF" strokeWidth={R * 0.082} strokeLinecap="round" />)}
      {/* ojos */}
      {[-1, 1].map((sd) => (
        <g key={sd} transform={`translate(${sd * R * 0.34} ${-R * 0.02})`}>
          <ellipse rx={R * 0.18 * es} ry={R * 0.195 * es * (blink ? 0.08 : 1)} fill="#FFF" />
          {!blink ? <circle cx={ex} cy={ey} r={R * 0.068} fill="#0A0A0E" /> : null}
          {face.lid ? <rect x={-R * 0.22} y={-R * 0.22} width={R * 0.44} height={R * 0.4 * face.lid} fill="#12131A" /> : null}
        </g>
      ))}
      {mouth === "smile" ? <path d={`M${-R * 0.25} ${R * 0.42} Q ${-R * 0.02} ${R * 0.6} ${R * 0.27} ${R * 0.38}`} stroke="#FFF" strokeWidth={R * 0.087} strokeLinecap="round" fill="none" /> : null}
      {mouth === "worry" ? <path d={`M${-R * 0.2} ${R * 0.5} Q 0 ${R * 0.38} ${R * 0.2} ${R * 0.5}`} stroke="#FFF" strokeWidth={R * 0.08} strokeLinecap="round" fill="none" /> : null}
      {mouth === "flat" ? <path d={`M${-R * 0.16} ${R * 0.44} L ${R * 0.16} ${R * 0.44}`} stroke="#FFF" strokeWidth={R * 0.08} strokeLinecap="round" /> : null}
      {mouth === "o" ? <ellipse cx={0} cy={R * 0.46} rx={R * (0.08 + tk * 0.04)} ry={R * (0.08 + (talk ? tk * 0.08 : 0.06))} fill="#FFF" /> : null}
      {mouth === "grin" ? <path d={`M${-R * 0.26} ${R * 0.36} Q 0 ${R * 0.7} ${R * 0.26} ${R * 0.36} Z`} fill="#FFF" /> : null}
      {face.sweat ? <path d={`M${R * 0.78} ${-R * 0.5} Q ${R * 0.68} ${-R * 0.26} ${R * 0.72} ${-R * 0.16} Q ${R * 0.78} ${-R * 0.06} ${R * 0.85} ${-R * 0.16} Q ${R * 0.88} ${-R * 0.26} ${R * 0.78} ${-R * 0.5} Z`} fill="#BFE4F6" /> : null}
    </g>
  );
  return (
    <g transform={`translate(${x} ${y + wb + bob}) scale(${s * facing} ${s})`}>
      <ellipse cx={0} cy={4} rx={110} ry={16} fill="#000" opacity={0.25} />
      <g filter={`url(#${rim})`} transform={`rotate(${lean} 0 -200)`}>
        {!headOnly ? (
          <g>
            {[-1, 1].map((sd) => { const a = (sd * legA * Math.PI) / 180, fx = sd * 26 + Math.sin(a) * 80; return <g key={sd}><path d={`M${sd * 24} -90 L ${fx} -6`} stroke="#1E1A18" strokeWidth={24} strokeLinecap="round" /><ellipse cx={fx + 10} cy={-2} rx={30} ry={11} fill="#7A4A2A" /></g>; })}
            <path d={L.d} stroke={robe2} strokeWidth={54} strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <Glove x={L.hx} y={L.hy} rot={L.rot} />
            <path d="M-78 -310 Q -110 -200 -116 -70 Q 0 -50 116 -70 Q 110 -200 78 -310 Q 0 -330 -78 -310 Z" fill={robe} />
            <path d="M40 -310 Q 70 -200 76 -64 L 116 -70 Q 110 -200 78 -310 Z" fill={robe2} opacity={0.7} />
            <path d="M-26 -318 L 0 -262 L 26 -318" stroke={robe2} strokeWidth={10} fill="none" strokeLinecap="round" />
            <path d="M-102 -176 Q 0 -160 102 -176" stroke={sash} strokeWidth={22} fill="none" />
            <path d={Rr.d} stroke={robe2} strokeWidth={58} strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <path d={Rr.d} stroke={robe} strokeWidth={44} strokeLinecap="round" strokeLinejoin="round" fill="none" />
            {holdR ? <g transform={`translate(${Rr.hx} ${Rr.hy - 22})`}>{holdR}</g> : null}
            <Glove x={Rr.hx} y={Rr.hy} rot={Rr.rot} />
          </g>
        ) : null}
        {head}
      </g>
    </g>
  );
};
