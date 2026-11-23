import React from "react";
import { Character, CharP, Flame, Glow, Jar, OilLamp, Palm, W, H, ip, kf, rnd } from "./Kit";

// ---------- personajes del episodio ----------
type CP = Omit<CharP, "id" | "x" | "y" | "t"> & { x: number; y?: number; t: number; id?: string };
export const Tu: React.FC<CP> = (p) => <Character id={p.id ?? "tu"} y={p.y ?? 900} robe="#EDE6D6" robe2="#B9AE96" sash="#2F6FB0" {...p} />;
export const Eliab: React.FC<CP> = (p) => <Character id={p.id ?? "eliab"} y={p.y ?? 900} robe="#9A6A3E" robe2="#6A4424" sash="#D8C79A" hair="band" band="#B23A2A" {...p} />;
export const Abuelo: React.FC<CP> = (p) => <Character id={p.id ?? "abuelo"} y={p.y ?? 900} robe="#7A7064" robe2="#4E463C" sash="#3A332B" hood beard="#EDEDED" {...p} />;
export const Padre: React.FC<CP> = (p) => <Character id={p.id ?? "padre"} y={p.y ?? 900} robe="#F2EEE2" robe2="#C9C1AA" sash="#D9A93A" collar="#D9A93A" hair="wig" {...p} />;
export const Madre: React.FC<CP> = (p) => <Character id={p.id ?? "madre"} y={p.y ?? 900} robe="#B5543A" robe2="#7E3020" sash="#E3C27A" dress hair="long" collar="#2F7FA8" {...p} />;
export const Vecino: React.FC<CP> = (p) => <Character id={p.id ?? "vecino"} y={p.y ?? 900} robe="#8A5A35" robe2="#5A381E" sash="#CDBB8A" hair="band" band="#3A5A8A" beard="#2A1A10" {...p} />;
export const Faraon: React.FC<CP> = (p) => <Character id={p.id ?? "faraon"} y={p.y ?? 900} robe="#F4EFE2" robe2="#CFC6AE" sash="#2F6FB0" collar="#E0B23A" hair="wig" hairColor="#E0B23A" {...p} />;
export const Moises: React.FC<CP> = (p) => <Character id={p.id ?? "moises"} y={p.y ?? 900} robe="#6E4A2E" robe2="#4A301C" sash="#C9B48A" hood beard="#DADADA" {...p} />;
export const Esclava: React.FC<CP> = (p) => <Character id={p.id ?? "esclava"} y={p.y ?? 900} robe="#8E7A5E" robe2="#5E4E3A" sash="#B8A27A" dress hair="long" hairColor="#1A1412" {...p} />;

// ---------- props ----------
export const Staff: React.FC = () => <g><path d="M0 -170 Q 6 0 2 170" stroke="#6B4A2B" strokeWidth={10} strokeLinecap="round" /><path d="M0 -170 q 22 -10 18 -34" stroke="#6B4A2B" strokeWidth={10} fill="none" strokeLinecap="round" /></g>;
export const Lamb: React.FC<{ t: number; s?: number }> = ({ t, s = 1 }) => {
  const b = Math.sin(t * 3) * 2;
  return (
    <g transform={`scale(${s})`}>
      <ellipse cx={0} cy={4} rx={70} ry={10} fill="#000" opacity={0.2} />
      {[-34, -14, 18, 36].map((x, i) => <rect key={i} x={x - 5} y={-44} width={10} height={46} rx={4} fill="#2A2420" />)}
      <g transform={`translate(0 ${b * 0.3})`}>
        {Array.from({ length: 11 }).map((_, i) => <circle key={i} cx={-44 + (i % 6) * 18} cy={-70 - Math.floor(i / 6) * 22 + (i % 2) * 6} r={22} fill="#F4F1EA" />)}
        <ellipse cx={0} cy={-66} rx={58} ry={30} fill="#F4F1EA" />
        <g transform={`translate(54 ${-84 + b})`}>
          <ellipse cx={0} cy={0} rx={22} ry={18} fill="#2A2420" />
          <ellipse cx={-14} cy={-12} rx={9} ry={5} fill="#2A2420" transform="rotate(-30)" />
          <circle cx={6} cy={-4} r={4} fill="#fff" /><circle cx={7} cy={-4} r={2} fill="#000" />
          <circle cx={-6} cy={-20} r={12} fill="#F4F1EA" />
        </g>
      </g>
    </g>
  );
};
export const Frog: React.FC<{ x: number; y: number; s?: number; dead?: boolean }> = ({ x, y, s = 1, dead }) => (
  <g transform={`translate(${x} ${y}) scale(${s}) rotate(${dead ? 180 : 0})`}>
    <ellipse cx={0} cy={0} rx={22} ry={13} fill="#4E6B34" />
    <circle cx={-10} cy={-10} r={6} fill="#5E7E3E" /><circle cx={10} cy={-10} r={6} fill="#5E7E3E" />
    <path d="M-22 4 l -10 8 M22 4 l 10 8" stroke="#3E5428" strokeWidth={5} strokeLinecap="round" />
  </g>
);
export const Bowl: React.FC<{ fill?: number }> = ({ fill = 1 }) => (
  <g><path d="M-40 0 Q -36 30 0 32 Q 36 30 40 0 Z" fill="#9E5E32" /><ellipse cx={0} cy={0} rx={40} ry={9} fill="#6E3A1A" /><ellipse cx={0} cy={1} rx={34 * fill} ry={6 * fill} fill="#8E0F14" /></g>
);
export const Hyssop: React.FC<{ wet?: boolean }> = ({ wet }) => (
  <g>{Array.from({ length: 6 }).map((_, i) => <path key={i} d={`M0 0 Q ${-10 + i * 4} -30 ${-16 + i * 7} -60`} stroke={wet ? "#6E2A1A" : "#5E7A3A"} strokeWidth={5} fill="none" strokeLinecap="round" />)}
    {Array.from({ length: 6 }).map((_, i) => <circle key={i} cx={-16 + i * 7} cy={-60} r={7} fill={wet ? "#A0141A" : "#7E9A4A"} />)}</g>
);
export const Bread: React.FC<{ cut?: number }> = ({ cut = 0 }) => (
  <g><ellipse cx={0} cy={0} rx={70} ry={26} fill="#C98A45" /><ellipse cx={-8} cy={-6} rx={58} ry={16} fill="#DDA35E" />
    {[-30, 0, 30].map((x, i) => <path key={i} d={`M${x - 8} -14 l 16 14`} stroke="#A56A2E" strokeWidth={4} />)}
    {cut > 0 ? <rect x={30} y={-28} width={4} height={56} fill="#7A4A1E" /> : null}</g>
);
export const Knife: React.FC = () => <g><rect x={-4} y={-8} width={34} height={14} rx={4} fill="#3A2A1A" /><path d="M30 -6 L 96 -2 L 30 6 Z" fill="#CFCFD6" /></g>;

// ---------- sala (casa egipcia) ----------
type TOD = "dawn" | "day" | "dusk" | "night";
const SKY: Record<TOD, [string, string]> = { dawn: ["#F2B48A", "#8FA8D8"], day: ["#8EC3EE", "#D6E8F4"], dusk: ["#2E2A5A", "#D97A4A"], night: ["#0E1838", "#2A3C72"] };
const WALL: Record<TOD, [string, string]> = { dawn: ["#9E7A5C", "#B8916C"], day: ["#C9A07A", "#DDB892"], dusk: ["#7A5640", "#9A6E50"], night: ["#4A3428", "#6B4A35"] };
export const Room: React.FC<{ t: number; tod: TOD; bed?: boolean; desk?: boolean; table?: boolean; door?: "left" | "right"; doorOpen?: number; beam?: number; dark?: number; id: string; lamp?: [number, number] | null }> = ({ t, tod, bed, desk, table, door, doorOpen = 0, beam = 0, dark = 0, id, lamp }) => {
  const [s0, s1] = SKY[tod], [w0, w1] = WALL[tod];
  return (
    <g>
      <defs>
        <linearGradient id={`w${id}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={w0} /><stop offset="100%" stopColor={w1} /></linearGradient>
        <linearGradient id={`s${id}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={s0} /><stop offset="100%" stopColor={s1} /></linearGradient>
        <linearGradient id={`f${id}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#6A4A34" /><stop offset="100%" stopColor="#3E2A1E" /></linearGradient>
        <radialGradient id={`v${id}`} cx="50%" cy="50%" r="75%"><stop offset="45%" stopColor="#000" stopOpacity="0" /><stop offset="100%" stopColor="#000" stopOpacity={tod === "night" ? 0.75 : 0.4} /></radialGradient>
      </defs>
      <rect width={W} height={870} fill={`url(#w${id})`} />
      {Array.from({ length: 14 }).map((_, r) => Array.from({ length: 12 }).map((__, c) => <rect key={`${r}-${c}`} x={c * 170 + (r % 2) * 85 - 40} y={r * 62} width={164} height={56} rx={6} fill="#000" opacity={0.04 + rnd(r * 13 + c) * 0.04} />))}
      {/* ventana */}
      <g transform="translate(1300 200)">
        <path d="M0 280 L0 100 A 120 120 0 0 1 240 100 L 240 280 Z" fill={`url(#s${id})`} />
        {tod === "night" ? <><circle cx={160} cy={100} r={34} fill="#F3EFD8" /><circle cx={160} cy={100} r={80} fill="#F3EFD8" opacity={0.1} /></> : null}
        {tod !== "night" ? <path d="M0 220 L 60 190 L 110 205 L 170 180 L 240 200 L 240 280 L 0 280 Z" fill="#B98E62" opacity={0.7} /> : null}
        {tod !== "night" ? <path d="M150 230 L 200 150 L 240 230 Z" fill="#C9A577" opacity={0.6} /> : null}
        <path d="M-10 290 L0 100 A 120 120 0 0 1 240 100 L 250 290" stroke="#3E2817" strokeWidth={18} fill="none" />
        <path d="M-30 290 L 270 290" stroke="#4A301E" strokeWidth={22} strokeLinecap="round" />
        <path d={`M-6 80 Q 30 ${170 + Math.sin(t * 1.5) * 6} 10 300 L -14 300 Z`} fill="#2F6FB0" opacity={0.85} />
      </g>
      {tod !== "night" ? <path d="M1310 300 L 1530 300 L 1260 870 L 820 870 Z" fill="#FFE9B8" opacity={tod === "day" ? 0.16 : 0.1} /> : null}
      {/* estante */}
      <rect x={560} y={300} width={330} height={16} rx={4} fill="#4A301E" />
      <g transform="translate(610 300)"><Jar s={0.7} /></g><g transform="translate(700 300)"><Jar s={0.55} c="#8C5530" /></g><g transform="translate(800 300)"><Jar s={0.8} c="#B67A45" /></g>
      {/* puerta */}
      {door ? (
        <g transform={`translate(${door === "left" ? 150 : 1620} 300)`}>
          <rect x={-24} y={-30} width={250} height={600} fill="#2A1A10" />
          <rect x={0} y={0} width={200} height={570} fill={tod === "night" ? "#0A0E1E" : "#E8D9B8"} />
          <g transform={`translate(${door === "left" ? 0 : 200} 0) scale(${1 - doorOpen * 0.85} 1) translate(${door === "left" ? 0 : -200} 0)`}>
            <rect x={0} y={0} width={200} height={570} fill="#5A3A22" />
            {[50, 100, 150].map((v) => <rect key={v} x={v} y={0} width={4} height={570} fill="#000" opacity={0.25} />)}
            <circle cx={door === "left" ? 175 : 25} cy={300} r={8} fill="#C9A15A" />
          </g>
          {beam > 0 ? <rect x={-60 + (1 - beam) * -300} y={250} width={320} height={34} rx={6} fill="#6E4527" stroke="#3A2416" strokeWidth={4} /> : null}
        </g>
      ) : null}
      <rect y={870} width={W} height={210} fill={`url(#f${id})`} />
      <path d="M520 905 L 1420 905 L 1560 1015 L 380 1015 Z" fill="#7A2E22" />
      <path d="M560 925 L 1400 925 M 520 990 L 1440 990" stroke="#D8A04C" strokeWidth={8} />
      {bed ? (
        <g transform="translate(260 760)">
          <rect x={0} y={60} width={520} height={60} rx={14} fill="#6E4527" /><rect x={20} y={20} width={480} height={56} rx={22} fill="#E8DDC6" />
          <rect x={30} y={36} width={300} height={44} rx={20} fill="#3E6EA8" opacity={0.9} /><ellipse cx={430} cy={34} rx={64} ry={26} fill="#F4EEDC" />
        </g>
      ) : null}
      {desk ? (
        <g transform="translate(980 720)">
          <rect x={0} y={60} width={420} height={24} rx={6} fill="#6E4527" /><rect x={20} y={84} width={20} height={80} fill="#4A2D18" /><rect x={380} y={84} width={20} height={80} fill="#4A2D18" />
          <rect x={60} y={40} width={220} height={24} rx={8} fill="#E8D9A8" /><path d="M60 52 h 220" stroke="#8A7A5A" strokeWidth={2} strokeDasharray="10 8" />
          <ellipse cx={330} cy={54} rx={24} ry={8} fill="#2A2A2A" /><g transform="translate(330 0)"><Jar s={0.35} c="#3A5A8A" /></g>
        </g>
      ) : null}
      {table ? (
        <g transform="translate(860 750)">
          <ellipse cx={150} cy={130} rx={170} ry={16} fill="#000" opacity={0.3} />
          <rect x={0} y={0} width={300} height={26} rx={6} fill="#6E4527" /><rect x={20} y={26} width={22} height={100} fill="#4A2D18" /><rect x={258} y={26} width={22} height={100} fill="#4A2D18" />
        </g>
      ) : null}
      {lamp ? <><g transform={`translate(${lamp[0]} ${lamp[1]})`}><OilLamp t={t} /></g><Glow id={`rl${id}`} x={lamp[0] + 52} y={lamp[1] - 20} r={480} o={0.8} /></> : null}
      <rect width={W} height={H} fill={`url(#v${id})`} />
      {dark > 0 ? <rect width={W} height={H} fill="#05060C" opacity={dark} /> : null}
    </g>
  );
};

// ---------- calle: tu casa (izq) y la casa hebrea (der) ----------
export const Street: React.FC<{ t: number; tod: TOD; id: string; blood?: number; lintel?: number; frogs?: boolean; lamb?: boolean; lampsOut?: number; fog?: number; eyes?: boolean; dark?: number; yourDoorBarred?: boolean; hebrewLit?: boolean }> = ({ t, tod, id, blood = 0, lintel = 0, frogs, lamb, lampsOut = 0, fog = -1, eyes, dark = 0, yourDoorBarred, hebrewLit }) => {
  const [s0, s1] = SKY[tod];
  const night = tod === "night";
  const wallL = night ? "#4E3A50" : tod === "dusk" ? "#8A5E4A" : "#C9A27A";
  const wallR = night ? "#5A4258" : tod === "dusk" ? "#9A6A50" : "#D6AE84";
  const fl = 0.85 + Math.sin(t * 9) * 0.08;
  const winLit = (i: number) => (night ? clampN(1 - ip(lampsOut, [i * 0.2, i * 0.2 + 0.15], [0, 1])) : 0);
  return (
    <g>
      <defs>
        <linearGradient id={`ss${id}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={s0} /><stop offset="100%" stopColor={s1} /></linearGradient>
        <linearGradient id={`fg${id}`} x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#0E1A13" stopOpacity="0" /><stop offset="20%" stopColor="#1A2A22" stopOpacity="0.8" /><stop offset="85%" stopColor="#1A2A22" stopOpacity="0.8" /><stop offset="100%" stopColor="#0E1A13" stopOpacity="0" /></linearGradient>
        <radialGradient id={`sv${id}`} cx="50%" cy="50%" r="75%"><stop offset="45%" stopColor="#000" stopOpacity="0" /><stop offset="100%" stopColor="#000" stopOpacity={night ? 0.7 : 0.3} /></radialGradient>
      </defs>
      <rect width={W} height={H} fill={`url(#ss${id})`} />
      {night ? Array.from({ length: 60 }).map((_, i) => <circle key={i} cx={rnd(i) * W} cy={rnd(i + 3) * 300} r={1.5} fill="#fff" opacity={0.3 + 0.5 * Math.abs(Math.sin(t + i))} />) : null}
      {/* fondo: Nilo, palmeras, pirámide */}
      <path d="M700 520 L 960 300 L 1220 520 Z" fill={night ? "#2C2850" : "#D9B98A"} opacity={0.8} />
      <rect y={500} width={W} height={60} fill={night ? "#1C2A55" : "#6E9AC4"} opacity={0.9} />
      {[[640, 560, 0.7], [1300, 560, 0.8]].map(([a, b, sc], i) => <g key={i} transform={`translate(${a} ${b})`}><Palm t={t} s={sc} seed={i} c={night ? "#1D2E2A" : "#3E7A4A"} trunk={night ? "#2A2230" : "#7A5A3A"} /></g>)}
      {/* casa izquierda (tuya) */}
      <g>
        <rect x={-20} y={180} width={620} height={720} fill={wallL} />
        <rect x={440} y={180} width={160} height={720} fill="#000" opacity={0.15} />
        <rect x={-30} y={168} width={640} height={22} fill="#000" opacity={0.2} />
        <rect x={120} y={330} width={130} height={110} rx={6} fill={night ? "#FFC067" : "#2A1C12"} opacity={night ? 0.95 * winLit(0) * fl + 0.05 : 1} />
        <rect x={230} y={560} width={170} height={340} fill="#4A2D18" />
        {[270, 310, 350].map((v) => <rect key={v} x={v} y={560} width={4} height={340} fill="#000" opacity={0.25} />)}
        {yourDoorBarred ? <rect x={210} y={700} width={210} height={26} rx={4} fill="#6E4527" /> : null}
      </g>
      {/* casa derecha (hebrea) */}
      <g>
        <rect x={1320} y={200} width={620} height={700} fill={wallR} />
        <rect x={1320} y={200} width={120} height={700} fill="#000" opacity={0.12} />
        <rect x={1310} y={188} width={640} height={22} fill="#000" opacity={0.2} />
        <rect x={1660} y={340} width={130} height={110} rx={6} fill={night || hebrewLit ? "#FFC067" : "#2A1C12"} opacity={night || hebrewLit ? fl : 1} />
        <rect x={1500} y={560} width={170} height={340} fill="#3E2412" />
        {[1540, 1580, 1620].map((v) => <rect key={v} x={v} y={560} width={4} height={340} fill="#000" opacity={0.25} />)}
        {/* sangre: postes y dintel */}
        {blood > 0 ? <g fill="#A0121A">
          <rect x={1488} y={560 + 340 * (1 - ip(blood, [0, 0.5], [0, 1]))} width={14} height={340 * ip(blood, [0, 0.5], [0, 1])} />
          <rect x={1668} y={560 + 340 * (1 - ip(blood, [0.5, 1], [0, 1]))} width={14} height={340 * ip(blood, [0.5, 1], [0, 1])} />
        </g> : null}
        {lintel > 0 ? <g><rect x={1488} y={540} width={194 * lintel} height={20} fill="#A0121A" />{[1510, 1560, 1610, 1650].map((x, i) => lintel > (x - 1488) / 194 ? <rect key={i} x={x} y={558} width={5} height={8 + i * 5 * lintel} rx={2} fill="#A0121A" /> : null)}</g> : null}
        {night && (blood > 0.9 || hebrewLit) ? <rect x={1440} y={500} width={300} height={420} rx={60} fill="#FFB24F" opacity={0.08} /> : null}
      </g>
      {/* suelo */}
      <rect y={890} width={W} height={190} fill={night ? "#2A2030" : "#C8A57A"} />
      {Array.from({ length: 30 }).map((_, i) => <rect key={i} x={i * 70} y={910 + (i % 3) * 50} width={56} height={24} rx={6} fill="#000" opacity={0.08} />)}
      {frogs ? Array.from({ length: 22 }).map((_, i) => <Frog key={i} x={40 + (i % 11) * 36 + rnd(i) * 20} y={920 + Math.floor(i / 11) * 24 + rnd(i + 2) * 20} s={0.8} dead={i % 3 !== 0} />) : null}
      {lamb ? <g transform="translate(1760 900)"><Lamb t={t} s={0.8} /></g> : null}
      {eyes ? [[180, 385], [1720, 395], [900, 250]].map(([x, y], i) => <g key={i} opacity={ip(t % 6, [0.2 + i * 0.3, 0.6 + i * 0.3], [0, 1])}><circle cx={x - 14} cy={y} r={7} fill="#fff" /><circle cx={x + 14} cy={y} r={7} fill="#fff" /><circle cx={x - 12} cy={y} r={3} fill="#000" /><circle cx={x + 16} cy={y} r={3} fill="#000" /></g>) : null}
      {fog > -1 ? <g transform={`translate(${fog} 0)`}><rect x={-700} y={760} width={1600} height={260} fill={`url(#fg${id})`} />{Array.from({ length: 9 }).map((_, i) => <ellipse key={i} cx={-600 + i * 170} cy={880 + Math.sin(t * 2 + i) * 16} rx={190} ry={60} fill="#1A2A22" opacity={0.5} />)}</g> : null}
      <rect width={W} height={H} fill={`url(#sv${id})`} />
      {dark > 0 ? <rect width={W} height={H} fill="#03040A" opacity={dark} /> : null}
    </g>
  );
};
const clampN = (v: number) => Math.max(0, Math.min(1, v));

// ---------- Nilo rojo ----------
export const Nile: React.FC<{ t: number; id: string }> = ({ t, id }) => (
  <g>
    <defs><linearGradient id={`ns${id}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#E8B48A" /><stop offset="100%" stopColor="#F4D9B8" /></linearGradient>
      <linearGradient id={`nr${id}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#6E3A3A" /><stop offset="100%" stopColor="#3E1A1A" /></linearGradient></defs>
    <rect width={W} height={H} fill={`url(#ns${id})`} />
    <path d="M300 520 L 560 280 L 820 520 Z" fill="#C9A26E" opacity={0.6} />
    <rect y={500} width={W} height={300} fill={`url(#nr${id})`} />
    {Array.from({ length: 14 }).map((_, i) => <ellipse key={i} cx={(rnd(i) * W + t * 30 * (0.5 + rnd(i + 4))) % (W + 200) - 100} cy={540 + rnd(i + 9) * 240} rx={90 + rnd(i) * 120} ry={14 + rnd(i + 1) * 10} fill="#9E1A1A" opacity={0.55} />)}
    {Array.from({ length: 20 }).map((_, i) => <rect key={i} x={rnd(i + 30) * W} y={520 + rnd(i + 50) * 260} width={40 + rnd(i) * 60} height={3} fill="#E6A0A0" opacity={0.25 + 0.2 * Math.sin(t * 2 + i)} />)}
    <g transform="translate(1300 560)"><path d="M-160 0 Q 0 40 160 0 L 140 -20 L -140 -20 Z" fill="#5A3A22" /><path d="M0 -20 L 0 -200" stroke="#4A2D18" strokeWidth={8} /><path d="M4 -196 Q 90 -120 6 -40 Z" fill="#E8DCC0" /></g>
    <rect y={790} width={W} height={290} fill="#9E7A4E" />
    {Array.from({ length: 40 }).map((_, i) => { const bx = i * 50 + rnd(i) * 20, hh = 80 + rnd(i + 3) * 90, sw = Math.sin(t * 1.5 + i * 0.5) * 6; return <path key={i} d={`M${bx} 820 Q ${bx + sw * 0.5} ${820 - hh * 0.5} ${bx + sw} ${820 - hh}`} stroke="#4E6A34" strokeWidth={6} fill="none" strokeLinecap="round" />; })}
  </g>
);

// ---------- campo: granizo y langostas ----------
export const Field: React.FC<{ t: number; lt: number; id: string; hail?: boolean; locust?: boolean; pen?: boolean }> = ({ t, lt, id, hail, locust, pen }) => (
  <g>
    <defs><linearGradient id={`fs${id}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={hail ? "#6E7A8E" : "#C9B48A"} /><stop offset="100%" stopColor={hail ? "#B8C0CC" : "#EAD9B4"} /></linearGradient></defs>
    <rect width={W} height={H} fill={`url(#fs${id})`} />
    <rect y={600} width={W} height={480} fill={hail ? "#7A6A4A" : "#A88A5A"} />
    {!pen ? Array.from({ length: 70 }).map((_, i) => { const x = (i % 35) * 56 + rnd(i) * 30, y = 680 + Math.floor(i / 35) * 180 + rnd(i + 1) * 40; const bent = hail ? 70 : 0; return <g key={i}><path d={`M${x} ${y + 120} Q ${x + 6} ${y + 40} ${x + bent * 0.6} ${y + 20 + bent * 0.5}`} stroke="#B89A4A" strokeWidth={6} fill="none" /><ellipse cx={x + bent * 0.6} cy={y + 14 + bent * 0.5} rx={7} ry={16} fill="#D4B05A" transform={`rotate(${bent} ${x + bent * 0.6} ${y + 14 + bent * 0.5})`} /></g>; }) : null}
    {pen ? (
      <g>
        {Array.from({ length: 9 }).map((_, i) => <rect key={i} x={300 + i * 160} y={640} width={18} height={220} fill="#6E4A2A" />)}
        <rect x={290} y={680} width={1300} height={16} fill="#7E5632" /><rect x={290} y={770} width={1300} height={16} fill="#7E5632" />
        <ellipse cx={980} cy={900} rx={160} ry={30} fill="#C9A85A" /><ellipse cx={600} cy={930} rx={60} ry={14} fill="#5A4A2A" opacity={0.4} />
        {Array.from({ length: 8 }).map((_, i) => <circle key={i} cx={900 + Math.sin(t * 7 + i) * 80} cy={820 + Math.cos(t * 5 + i * 2) * 40} r={3} fill="#111" />)}
      </g>
    ) : null}
    {hail ? Array.from({ length: 80 }).map((_, i) => { const sp = 900 + rnd(i) * 500; const y = ((lt * sp + rnd(i + 7) * 1400) % 1300) - 200; return <ellipse key={i} cx={rnd(i + 3) * W + y * 0.15} cy={y} rx={7} ry={9} fill="#EEF4FA" opacity={0.9} />; }) : null}
    {hail ? Array.from({ length: 50 }).map((_, i) => <ellipse key={`g${i}`} cx={rnd(i + 60) * W} cy={900 + rnd(i + 80) * 170} rx={8} ry={6} fill="#EEF4FA" />) : null}
    {locust ? Array.from({ length: 160 }).map((_, i) => { const x = ((rnd(i) * W + lt * (300 + rnd(i + 1) * 400)) % (W + 100)) - 50, y = 150 + rnd(i + 2) * 650 + Math.sin(t * 9 + i) * 12; return <g key={i} transform={`translate(${x} ${y})`}><ellipse rx={9} ry={3.5} fill="#3E3A1E" /><path d={`M-2 -2 l -6 ${-6 + Math.sin(t * 40 + i) * 5} M2 -2 l 6 ${-6 - Math.sin(t * 40 + i) * 5}`} stroke="#6E6A4A" strokeWidth={2} /></g>; }) : null}
  </g>
);

// ---------- ciudad de noche / oscuridad / amanecer ----------
export const City: React.FC<{ t: number; id: string; mode: "night" | "dark" | "dawn"; fogX?: number; lampsOut?: number; shake?: number }> = ({ t, id, mode, fogX = -2000, lampsOut = 0 }) => {
  const houses = Array.from({ length: 11 }).map((_, i) => ({ x: 40 + i * 170 + rnd(i) * 30, w: 140 + rnd(i + 9) * 90, h: 150 + rnd(i + 3) * 120, blood: [1, 4, 7, 9].includes(i) }));
  const sky = mode === "dawn" ? ["#2A3C72", "#E9925A"] : mode === "dark" ? ["#020206", "#05050C"] : ["#070B20", "#4A3A66"];
  return (
    <g>
      <defs><linearGradient id={`cs${id}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={sky[0]} /><stop offset="100%" stopColor={sky[1]} /></linearGradient></defs>
      <rect width={W} height={H} fill={`url(#cs${id})`} />
      {mode === "night" ? <>{Array.from({ length: 120 }).map((_, i) => <circle key={i} cx={rnd(i) * W} cy={rnd(i + 500) * 560} r={0.8 + rnd(i + 99) * 1.6} fill="#fff" opacity={0.25 + 0.6 * Math.abs(Math.sin(t * (1 + rnd(i) * 2) + i))} />)}<circle cx={1480} cy={230} r={74} fill="#EEF0F8" /><circle cx={1480} cy={230} r={220} fill="#EEF0F8" opacity={0.08} /></> : null}
      {mode === "dawn" ? <><circle cx={960} cy={640} r={120} fill="#FFD68A" /><circle cx={960} cy={640} r={420} fill="#FFB86A" opacity={0.2} /></> : null}
      {mode !== "dark" ? <g opacity={0.9}><path d="M260 640 L 520 360 L 780 640 Z" fill={mode === "dawn" ? "#7A4A5A" : "#3B3560"} /><path d="M700 640 L 880 440 L 1060 640 Z" fill={mode === "dawn" ? "#8A5A62" : "#403A66"} /><path d="M1180 640 L 1300 520 L 1420 640 Z" fill={mode === "dawn" ? "#946A6A" : "#453E6A"} /></g> : null}
      <rect y={690} width={W} height={120} fill={mode === "dark" ? "#050508" : "#2A2030"} />
      {houses.map((hs, i) => {
        const dk = mode === "dark" ? (hs.blood ? 0 : 1) : !hs.blood ? Math.max(ip(fogX, [hs.x - 100, hs.x + 200], [0, 1]), ip(lampsOut, [i / 11, i / 11 + 0.08], [0, 1])) : 0;
        const c = mode === "dark" ? "#0B0A10" : i % 2 ? "#5A4258" : "#4E3A50";
        const fl = 0.85 + Math.sin(t * 9 + i) * 0.1;
        return (
          <g key={i} transform={`translate(${hs.x} 800)`}>
            <rect x={0} y={-hs.h} width={hs.w} height={hs.h} fill={mode === "dark" && hs.blood ? "#3A2A30" : c} />
            <rect x={hs.w * 0.15} y={-hs.h * 0.72} width={hs.w * 0.18} height={hs.h * 0.2} rx={3} fill="#FFC067" opacity={(1 - dk) * fl} />
            <rect x={hs.w * 0.4} y={-hs.h * 0.42} width={hs.w * 0.2} height={hs.h * 0.42} fill="#22160F" />
            {hs.blood && mode !== "dark" ? <g><rect x={hs.w * 0.36} y={-hs.h * 0.46} width={hs.w * 0.28} height={7} fill="#B0161B" /><rect x={hs.w * 0.36} y={-hs.h * 0.46} width={6} height={hs.h * 0.3} fill="#B0161B" /><rect x={hs.w * 0.64 - 6} y={-hs.h * 0.46} width={6} height={hs.h * 0.3} fill="#B0161B" /></g> : null}
            {mode === "dark" && hs.blood ? <circle cx={hs.w / 2} cy={-hs.h * 0.5} r={hs.w * 0.9} fill="#FFB24F" opacity={0.12} /> : null}
          </g>
        );
      })}
      <rect y={810} width={W} height={270} fill={mode === "dark" ? "#020204" : mode === "dawn" ? "#3A3048" : "#0F1530"} />
      {mode === "night" ? Array.from({ length: 14 }).map((_, i) => <rect key={i} x={1480 - (120 - i * 5) / 2 + Math.sin(t * 2 + i * 1.7) * 14} y={830 + i * 14} width={120 - i * 5} height={3} rx={2} fill="#DDE4FF" opacity={0.5 - i * 0.03} />) : null}
      {fogX > -1500 ? <g transform={`translate(${fogX} 0)`}><defs><linearGradient id={`cf${id}`} x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#0E1A13" stopOpacity="0" /><stop offset="25%" stopColor="#0E1A13" stopOpacity="0.7" /><stop offset="80%" stopColor="#0E1A13" stopOpacity="0.7" /><stop offset="100%" stopColor="#0E1A13" stopOpacity="0" /></linearGradient></defs><rect x={-700} y={640} width={1700} height={280} rx={140} fill={`url(#cf${id})`} />{Array.from({ length: 9 }).map((_, i) => <ellipse key={i} cx={-500 + i * 160} cy={720 + Math.sin(t * 2 + i) * 20} rx={180} ry={70} fill="#0E1A13" opacity={0.55} />)}</g> : null}
    </g>
  );
};

// ---------- palacio ----------
export const Palace: React.FC<{ t: number; id: string }> = ({ t, id }) => (
  <g>
    <defs><linearGradient id={`pw${id}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#2A1E30" /><stop offset="100%" stopColor="#4A3440" /></linearGradient></defs>
    <rect width={W} height={H} fill={`url(#pw${id})`} />
    {[200, 560, 1360, 1720].map((x, i) => <g key={i}><rect x={x - 60} y={80} width={120} height={820} fill="#6E5A4A" /><rect x={x - 60} y={80} width={30} height={820} fill="#000" opacity={0.2} /><rect x={x - 80} y={60} width={160} height={40} fill="#8A7256" />{[200, 400, 600].map((y) => <rect key={y} x={x - 60} y={y} width={120} height={10} fill="#C9A15A" opacity={0.6} />)}</g>)}
    {[380, 1540].map((x, i) => <g key={i} transform={`translate(${x} 520)`}><rect x={-8} y={0} width={16} height={120} fill="#3A2416" /><Flame t={t} s={1.3} seed={i * 4} /><circle cx={0} cy={-20} r={110} fill="#FFA040" opacity={0.15} /></g>)}
    <rect y={880} width={W} height={200} fill="#3A2A2E" />
    <g transform="translate(960 880)"><rect x={-130} y={-60} width={260} height={60} fill="#C9A15A" /><rect x={-100} y={-330} width={200} height={280} rx={20} fill="#8A6A3A" /><rect x={-80} y={-310} width={160} height={30} fill="#2F6FB0" /></g>
  </g>
);

// ---------- molino (esclava) ----------
export const Mill: React.FC<{ t: number; id: string }> = ({ t, id }) => (
  <g>
    <rect width={W} height={H} fill="#3A2A22" />
    <rect width={W} height={860} fill="#6A4E3A" />
    {Array.from({ length: 10 }).map((_, r) => Array.from({ length: 12 }).map((__, c) => <rect key={`${r}${c}`} x={c * 170 + (r % 2) * 85} y={r * 90} width={160} height={80} rx={6} fill="#000" opacity={0.06} />))}
    <path d="M1400 120 L 1700 120 L 1700 420 L 1400 420 Z" fill="#E8B97A" opacity={0.5} />
    <path d="M1400 120 L 1700 120 L 1500 860 L 1000 860 Z" fill="#FFE2A8" opacity={0.12} />
    <g transform="translate(1000 850)"><ellipse cx={0} cy={0} rx={150} ry={30} fill="#7A6A5A" /><ellipse cx={Math.sin(t * 3) * 40} cy={-20} rx={70} ry={16} fill="#9A8A7A" /><ellipse cx={-120} cy={6} rx={40} ry={10} fill="#E8DCC0" /></g>
    <rect y={860} width={W} height={220} fill="#4A3628" />
  </g>
);

// ---------- casa hebrea por dentro (Pascua) ----------
export const HebrewRoom: React.FC<{ t: number; id: string }> = ({ t, id }) => (
  <g>
    <defs><radialGradient id={`hr${id}`} cx="50%" cy="58%" r="60%"><stop offset="0%" stopColor="#FFB45A" stopOpacity="0.35" /><stop offset="100%" stopColor="#000" stopOpacity="0" /></radialGradient></defs>
    <rect width={W} height={H} fill="#2A1C16" />
    <rect width={W} height={860} fill="#4A3426" />
    {Array.from({ length: 14 }).map((_, r) => Array.from({ length: 12 }).map((__, c) => <rect key={`${r}-${c}`} x={c * 170 + (r % 2) * 85 - 40} y={r * 62} width={164} height={56} rx={6} fill="#000" opacity={0.08} />))}
    <rect y={860} width={W} height={220} fill="#2E2018" />
    <g transform="translate(700 760)"><rect x={0} y={0} width={520} height={26} rx={6} fill="#5E3A22" /><rect x={30} y={26} width={22} height={100} fill="#3E2414" /><rect x={468} y={26} width={22} height={100} fill="#3E2414" />
      <ellipse cx={180} cy={-6} rx={90} ry={18} fill="#E8DCC0" /><ellipse cx={180} cy={-16} rx={60} ry={16} fill="#8A4A2A" /><g transform="translate(360 -4) scale(0.6)"><Bread /></g><g transform="translate(60 0)"><Jar s={0.45} c="#9E5E32" /></g></g>
    <g transform="translate(930 760)"><OilLamp t={t} /></g>
    <rect width={W} height={H} fill={`url(#hr${id})`} />
    <Glow id={`hl${id}`} x={982} y={740} r={620} o={0.75} />
  </g>
);

// ---------- éxodo al amanecer ----------
export const Exodus: React.FC<{ t: number; lt: number; id: string }> = ({ t, lt, id }) => (
  <g>
    <defs><linearGradient id={`ex${id}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#3A4A82" /><stop offset="55%" stopColor="#E9925A" /><stop offset="100%" stopColor="#F4C58A" /></linearGradient></defs>
    <rect width={W} height={H} fill={`url(#ex${id})`} />
    <circle cx={1400} cy={600} r={110} fill="#FFE2A0" /><circle cx={1400} cy={600} r={380} fill="#FFC27A" opacity={0.25} />
    <path d="M200 640 L 420 400 L 640 640 Z" fill="#B0705A" opacity={0.7} /><path d="M560 640 L 720 470 L 880 640 Z" fill="#B8786A" opacity={0.6} />
    <rect y={620} width={W} height={460} fill="#D9A46A" />
    <path d="M0 760 Q 960 700 1920 740 L 1920 840 Q 960 800 0 860 Z" fill="#C9925A" />
    {Array.from({ length: 70 }).map((_, i) => { const row = i % 3; const x = ((i * 47 + lt * (40 + row * 25)) % 2200) - 140; const y = 720 + row * 50; const s = 0.35 + row * 0.12; return <g key={i} transform={`translate(${x} ${y + Math.abs(Math.sin(t * 5 + i)) * -4}) scale(${s})`}><path d="M-40 -230 Q 0 -246 40 -230 L 54 -10 Q 0 0 -54 -10 Z" fill={["#6E4A3A", "#5A4A5A", "#7A5A3A"][i % 3]} /><circle cx={0} cy={-275} r={42} fill="#1A1416" />{i % 4 === 0 ? <rect x={30} y={-260} width={70} height={50} rx={14} fill="#B8946A" /> : null}{i % 5 === 0 ? <path d="M-50 -330 L -50 10" stroke="#5A3A22" strokeWidth={8} /> : null}</g>; })}
  </g>
);

export const NightSky: React.FC<{ t: number }> = ({ t }) => (
  <g><rect width={W} height={H} fill="#03040A" />{Array.from({ length: 60 }).map((_, i) => <circle key={i} cx={rnd(i) * W} cy={rnd(i + 3) * H} r={1.3} fill="#fff" opacity={0.15 + 0.3 * Math.abs(Math.sin(t + i))} />)}</g>
);
export { kf };
