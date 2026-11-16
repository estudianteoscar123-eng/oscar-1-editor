import React from "react";

// Personaje 2D vectorial (estilo de la referencia: cabeza blanca redonda con volumen, cara de trazos, cuerpo de frijol, palitos).
// Coordenadas en px de la composición 1080x1920; (x, y) = punto entre los pies. s = escala (1 ≈ 900 px de alto).
export type Face2D = "calm" | "smile" | "proud" | "sad" | "shock" | "happy" | "smirk" | "angry";
export type Person2DP = {
  x: number; y: number; s?: number; t: number; seed?: number; flip?: boolean;
  face?: Face2D; robe?: string; robe2?: string; trim?: string; hair?: "none" | "short" | "long" | "white";
  hairColor?: string; beard?: string; crown?: boolean; glow?: number; halo?: boolean;
  armL?: number; armR?: number; // ángulo en grados desde abajo (0 = colgando, 90 = horizontal, 160 = arriba)
  holdR?: React.ReactNode; talk?: boolean; walk?: number; bounce?: number; o?: number; lean?: number; id: string;
};
const L = "#24242A";
export const Person2D: React.FC<Person2DP> = (p) => {
  const { t, s = 1, seed = 0, face = "calm", robe = "#2A2A30", robe2, trim, hair = "none", hairColor = "#3B2618", id } = p;
  const blink = ((t + seed * 1.7) * 0.31) % 1 < 0.035;
  const br = Math.sin(t * 2.1 + seed) * 3;
  const walk = p.walk ?? 0;
  const step = walk ? Math.sin(t * 9 + seed) : 0;
  const bob = walk ? Math.abs(step) * -10 : 0;
  const bounce = p.bounce ?? 0;
  const by = bob + br * 0.4 - bounce * Math.abs(Math.sin(t * 6)) * 20;
  // cabeza: centro relativo a los pies
  const HX = 0, HY = -640, R = 200;
  const talk = p.talk ? Math.abs(Math.sin(t * 16 + seed)) : 0;
  const arm = (side: number, deg: number) => {
    const a = (deg * Math.PI) / 180;
    const sx = side * 92, sy = -470;
    const len = 210;
    const ex = sx + side * Math.sin(a) * len, ey = sy + Math.cos(a) * len;
    const mx = sx + side * Math.sin(a * 0.6) * len * 0.55 + side * 18, my = sy + Math.cos(a * 0.6) * len * 0.55;
    return { d: `M${sx} ${sy} Q ${mx} ${my} ${ex} ${ey}`, ex, ey };
  };
  const aL = arm(-1, p.armL ?? 12 + (walk ? step * 20 : Math.sin(t * 1.7 + seed) * 3));
  const aR = arm(1, p.armR ?? 12 - (walk ? step * 20 : Math.sin(t * 1.5 + seed) * 3));
  const eyes = () => {
    if (blink && face !== "happy") return <path d={`M-92 -30 L-44 -30 M44 -30 L92 -30`} stroke={L} strokeWidth={9} strokeLinecap="round" />;
    switch (face) {
      case "happy": case "smile":
        return <path d={`M-94 -24 Q-68 -60 -42 -24 M42 -24 Q68 -60 94 -24`} stroke={L} strokeWidth={10} fill="none" strokeLinecap="round" />;
      case "proud": case "smirk":
        return <g><path d={`M-95 -34 L-41 -34 A27 20 0 0 1 -95 -34 Z M41 -38 L95 -38 A27 20 0 0 1 41 -38 Z`} fill="#3C3C42" /></g>;
      case "shock":
        return <g><circle cx={-66} cy={-30} r={22} fill={L} /><circle cx={66} cy={-30} r={22} fill={L} /><circle cx={-60} cy={-36} r={7} fill="#fff" /><circle cx={72} cy={-36} r={7} fill="#fff" /></g>;
      default:
        return <g><ellipse cx={-66} cy={-28} rx={15} ry={18} fill={L} /><ellipse cx={66} cy={-28} rx={15} ry={18} fill={L} /><circle cx={-61} cy={-33} r={5} fill="#fff" /><circle cx={71} cy={-33} r={5} fill="#fff" /></g>;
    }
  };
  const brows = () => {
    const tilt = { calm: 0, smile: -6, happy: -8, proud: 10, smirk: 12, sad: -18, shock: -14, angry: 22 }[face];
    return <g stroke="#7C7C84" strokeWidth={18} strokeLinecap="round"><line x1={-102} y1={-88 + tilt * 0.3} x2={-34} y2={-88 - tilt} /><line x1={34} y1={-88 - tilt} x2={102} y2={-88 + tilt * 0.3} /></g>;
  };
  const mouth = () => {
    if (talk > 0.15) return <ellipse cx={0} cy={62} rx={30} ry={10 + talk * 24} fill="#3B1712" stroke={L} strokeWidth={6} />;
    switch (face) {
      case "proud": case "smirk": return <path d="M-40 62 Q 10 92 64 48" stroke={L} strokeWidth={10} fill="none" strokeLinecap="round" />;
      case "sad": return <path d="M-44 82 Q 0 50 44 82" stroke={L} strokeWidth={10} fill="none" strokeLinecap="round" />;
      case "shock": return <ellipse cx={0} cy={70} rx={26} ry={34} fill="#3B1712" stroke={L} strokeWidth={6} />;
      case "angry": return <path d="M-44 76 L44 70" stroke={L} strokeWidth={10} strokeLinecap="round" />;
      case "happy": return <path d="M-56 46 Q 0 118 56 46 Z" fill="#3B1712" stroke={L} strokeWidth={7} strokeLinejoin="round" />;
      default: return <path d="M-46 54 Q 0 92 46 54" stroke={L} strokeWidth={10} fill="none" strokeLinecap="round" />;
    }
  };
  return (
    <g transform={`translate(${p.x} ${p.y}) scale(${(p.flip ? -1 : 1) * s} ${s})`} opacity={p.o ?? 1}>
      <defs>
        <radialGradient id={`hd${id}`} cx="40%" cy="38%" r="68%"><stop offset="0%" stopColor="#FFFFFF" /><stop offset="62%" stopColor="#F7F7FA" /><stop offset="88%" stopColor="#DCDDE8" /><stop offset="100%" stopColor="#B9BBD0" /></radialGradient>
        <linearGradient id={`rb${id}`} x1="0" y1="0" x2="1" y2="0.2"><stop offset="0%" stopColor={robe2 ?? robe} stopOpacity={1} /><stop offset="40%" stopColor={robe} /><stop offset="100%" stopColor={robe2 ?? "#000"} stopOpacity={robe2 ? 1 : 0.85} /></linearGradient>
        <radialGradient id={`gl${id}`}><stop offset="0%" stopColor="#FFE9A8" stopOpacity="0.9" /><stop offset="100%" stopColor="#FFE9A8" stopOpacity="0" /></radialGradient>
        <radialGradient id={`sh${id}`}><stop offset="0%" stopColor="#000" stopOpacity="0.55" /><stop offset="100%" stopColor="#000" stopOpacity="0" /></radialGradient>
      </defs>
      {p.glow ? <ellipse cx={0} cy={-470} rx={420} ry={600} fill={`url(#gl${id})`} opacity={0.6 * p.glow} /> : null}
      <ellipse cx={0} cy={6} rx={190} ry={34} fill={`url(#sh${id})`} />
      <g transform={`translate(0 ${by}) rotate(${p.lean ?? 0} 0 -300)`}>
        {/* piernas */}
        {[-1, 1].map((sd) => {
          const k = walk ? (sd > 0 ? step : -step) : 0;
          return <g key={sd}><path d={`M${sd * 44} -240 Q ${sd * 50 + k * 30} -120 ${sd * 52 + k * 46} -14`} stroke="#141418" strokeWidth={22} fill="none" strokeLinecap="round" /><ellipse cx={sd * 62 + k * 46} cy={-6} rx={44} ry={24} fill="#141418" /></g>;
        })}
        {/* cuerpo / túnica */}
        <path d="M0 -500 C 74 -500, 112 -452, 128 -380 C 146 -300, 150 -250, 136 -214 C 116 -180, 64 -168, 0 -168 C -64 -168, -116 -180, -136 -214 C -150 -250, -146 -300, -128 -380 C -112 -452, -74 -500, 0 -500 Z" fill={`url(#rb${id})`} stroke={L} strokeWidth={6} />
        {trim ? <path d="M-132 -232 C -60 -206, 60 -206, 132 -232" stroke={trim} strokeWidth={14} fill="none" /> : null}
        {trim ? <path d="M0 -500 L0 -176" stroke={trim} strokeWidth={8} opacity={0.7} /> : null}
        {/* brazos */}
        {[aL, aR].map((a, i) => <g key={i}><path d={a.d} stroke="#141418" strokeWidth={18} fill="none" strokeLinecap="round" /><circle cx={a.ex} cy={a.ey} r={30} fill="#141418" /><circle cx={a.ex - 8} cy={a.ey - 9} r={9} fill="#3A3A42" opacity={0.6} /></g>)}
        {p.holdR ? <g transform={`translate(${aR.ex} ${aR.ey})`}>{p.holdR}</g> : null}
        {/* cabeza */}
        <g transform={`translate(${HX} ${HY + br})`}>
          {p.halo ? <ellipse cx={0} cy={-R - 26} rx={120} ry={28} fill="none" stroke="#FFD860" strokeWidth={14} opacity={0.95} /> : null}
          {hair === "long" ? <path d={`M${-R - 14} 40 C ${-R - 30} -150, -120 ${-R - 40}, 0 ${-R - 30} C 120 ${-R - 40}, ${R + 30} -150, ${R + 14} 40 L ${R - 10} 160 L ${-R + 10} 160 Z`} fill={hairColor} stroke={L} strokeWidth={7} /> : null}
          <ellipse cx={0} cy={0} rx={R + 10} ry={R} fill={`url(#hd${id})`} stroke={L} strokeWidth={8} />
          <path d={`M${-R + 12} 60 C ${-R - 8} -50, -150 ${-R + 10}, -30 ${-R + 6}`} stroke="#9C99C8" strokeWidth={8} fill="none" opacity={0.7} />
          {hair === "short" ? <path d={`M${-R - 4} -10 C ${-R} -150, -100 ${-R - 6}, 0 ${-R - 6} C 100 ${-R - 6}, ${R} -150, ${R + 4} -10 C ${R - 30} -90, 90 -150, 0 -150 C -90 -150, ${-R + 30} -90, ${-R - 4} -10 Z`} fill={hairColor} stroke={L} strokeWidth={6} /> : null}
          {hair === "white" ? <path d={`M${-R - 2} -20 C ${-R + 10} -150, -90 ${-R - 4}, 0 ${-R - 4} C 90 ${-R - 4}, ${R - 10} -150, ${R + 2} -20`} stroke={L} strokeWidth={18} fill="none" strokeLinecap="round" /> : null}
          {hair === "long" ? <path d={`M${-R + 4} -40 C ${-R + 20} -150, -90 ${-R + 4}, 0 ${-R + 2} C 90 ${-R + 4}, ${R - 20} -150, ${R - 4} -40 C ${R - 40} -110, 80 -146, 0 -146 C -80 -146, ${-R + 40} -110, ${-R + 4} -40 Z`} fill={hairColor} stroke={L} strokeWidth={6} /> : null}
          {p.beard ? <path d="M-150 60 C -140 170, -60 214, 0 214 C 60 214, 140 170, 150 60 C 110 120, 60 104, 0 104 C -60 104, -110 120, -150 60 Z" fill={p.beard} stroke={L} strokeWidth={6} /> : null}
          {brows()}{eyes()}{mouth()}
          {p.crown ? <g transform={`translate(0 ${-R + 10}) rotate(-4)`}><path d="M-110 0 L-104 -70 L-62 -26 L-30 -92 L0 -30 L30 -92 L62 -26 L104 -70 L110 0 Z" fill="#F2C42C" stroke={L} strokeWidth={6} strokeLinejoin="round" />{[-104, -30, 30, 104].map((x, i) => <circle key={i} cx={x} cy={i % 3 === 0 ? -76 : -98} r={11} fill="#FFE27A" stroke={L} strokeWidth={4} />)}<path d="M-108 -12 L108 -12" stroke="#FFF2B8" strokeWidth={6} /></g> : null}
        </g>
      </g>
    </g>
  );
};
