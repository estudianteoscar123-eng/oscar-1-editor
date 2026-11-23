import React from "react";
import { AbsoluteFill } from "remotion";

// Recreación al milímetro del cuadro de referencia (aula, 1920x1080), medida sobre cuadrícula.
const HeadBall: React.FC<{ cx: number; cy: number; r: number; id: string; rimO?: number; cyan?: [number, number]; hi?: [number, number] }> = ({ cx, cy, r, id, rimO = 13, cyan, hi = [0.36, 0.4] }) => (
  <g>
    <defs>
      <radialGradient id={`g${id}`} cx={`${hi[0] * 100}%`} cy={`${hi[1] * 100}%`} r="70%"><stop offset="0%" stopColor="#34343F" /><stop offset="45%" stopColor="#15151B" /><stop offset="100%" stopColor="#070709" /></radialGradient>
      {cyan ? <clipPath id={`c${id}`}><rect x={cx + r * cyan[0]} y={cy + r * cyan[1]} width={r * 2} height={r * 2} /></clipPath> : null}
    </defs>
    <circle cx={cx} cy={cy} r={r + rimO} fill="#FFB86C" />
    {cyan ? <circle cx={cx} cy={cy} r={r + rimO - 2} fill="#A8E2F2" clipPath={`url(#c${id})`} /> : null}
    <circle cx={cx} cy={cy} r={r} fill={`url(#g${id})`} />
  </g>
);
const W = "#FFFFFF";
export const RigTest2: React.FC = () => (
  <AbsoluteFill style={{ background: "#000" }}>
    {/* ---------- fondo (ligeramente desenfocado) ---------- */}
    <AbsoluteFill style={{ filter: "blur(1.6px)" }}>
      <svg width={1920} height={1080}>
        <defs>
          <linearGradient id="wl" x1="0" y1="0" x2="1" y2="0.2"><stop offset="0%" stopColor="#F6E9C2" /><stop offset="70%" stopColor="#FFF6D0" /><stop offset="100%" stopColor="#F4E8C6" /></linearGradient>
          <linearGradient id="lw" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#F3AE52" /><stop offset="100%" stopColor="#E89A40" /></linearGradient>
        </defs>
        <rect width={1920} height={1080} fill="url(#wl)" />
        {/* tablero de corcho */}
        <path d="M-10 118 L 700 104 L 700 478 L -10 486 Z" fill="#B8783A" />
        <path d="M5 132 L 688 120 L 688 466 L 5 474 Z" fill="#E1A666" />
        <text x={242} y={186} fontFamily="Kit Poppins, YCap" fontWeight={800} fontSize={42} fill="#7A4422" transform="rotate(-1 450 170)">NUESTROS TRABAJOS</text>
        <g transform="rotate(-2 100 270)"><rect x={32} y={220} width={136} height={108} fill="#F6F3EA" /><circle cx={72} cy={262} r={19} fill="#E8CC3A" /><rect x={34} y={292} width={132} height={34} fill="#8DD07E" /><circle cx={98} cy={230} r={5} fill="#E8424A" /></g>
        <g transform="rotate(3 275 270)"><rect x={205} y={216} width={140} height={108} fill="#F6F3EA" /><path d="M243 262 L 275 232 L 307 262 Z" fill="#8A4A2A" /><rect x={250} y={260} width={50} height={44} fill="#F04A44" /><circle cx={276} cy={226} r={5} fill="#E8424A" /></g>
        <g transform="rotate(-2 450 268)"><rect x={378} y={214} width={144} height={108} fill="#F6F3EA" /><circle cx={450} cy={268} r={26} fill="#4A8AF0" /><circle cx={430} cy={240} r={10} fill="#4A8AF0" /><circle cx={468} cy={236} r={10} fill="#4A8AF0" /><circle cx={447} cy={222} r={5} fill="#E8424A" /></g>
        <g transform="rotate(1 624 264)"><rect x={558} y={212} width={132} height={108} fill="#F6F3EA" />{[236, 256, 276, 294].map((y) => <rect key={y} x={580} y={y} width={92} height={4} fill="#9A9A9A" />)}<circle cx={630} cy={218} r={5} fill="#E8424A" /></g>
        <g transform="rotate(-1 100 400)"><rect x={32} y={348} width={138} height={110} fill="#F6F3EA" /><circle cx={98} cy={356} r={5} fill="#E8424A" /></g>
        <g transform="rotate(2 290 400)"><rect x={232} y={346} width={114} height={110} fill="#F6F3EA" /><circle cx={292} cy={366} r={14} fill="#4A8AF0" /><circle cx={274} cy={354} r={5} fill="#E8424A" /></g>
        <g transform="rotate(2 450 400)"><rect x={380} y={342} width={144} height={112} fill="#F6F3EA" />{[368, 386, 406, 426].map((y) => <rect key={y} x={402} y={y} width={96} height={4} fill="#9A9A9A" transform={`rotate(3 450 ${y})`} />)}<circle cx={452} cy={352} r={5} fill="#E8424A" /></g>
        <g transform="rotate(-1 620 400)"><rect x={556} y={346} width={130} height={110} fill="#F6F3EA" /><circle cx={600} cy={382} r={20} fill="#E8CC3A" /><circle cx={628} cy={350} r={5} fill="#E8424A" /></g>
        {/* pared baja y riel de mochilas */}
        <rect x={0} y={528} width={1920} height={480} fill="url(#lw)" />
        <rect x={0} y={528} width={1920} height={16} fill="#B9772E" />
        <path d="M1380 404 L 1920 398 L 1920 430 L 1380 436 Z" fill="#B97A3A" />
        {[[1528, "#D84A6A"], [1642, "#F04A4A"], [1758, "#3EB85A"], [1876, "#6A6AE0"]].map(([x, c], i) => <g key={i}><rect x={(x as number) - 4} y={414} width={8} height={40} fill={c as string} /><circle cx={x as number} cy={415} r={10} fill="#F0C890" /></g>)}
        <rect x={1390} y={452} width={74} height={124} rx={18} fill="#F2474A" /><rect x={1402} y={512} width={54} height={46} rx={10} fill="#C83A40" />
        <rect x={1482} y={452} width={94} height={126} rx={20} fill="#FF4A9A" /><rect x={1498} y={512} width={62} height={46} rx={10} fill="#D83A7E" />
        <rect x={1605} y={440} width={76} height={54} rx={12} fill="#F04A44" />
        <rect x={1710} y={452} width={64} height={100} rx={16} fill="#3EC860" />
        <rect x={1830} y={450} width={96} height={100} rx={18} fill="#7A7AF0" />
        {/* pupitres derecha */}
        <rect x={1633} y={760} width={180} height={250} fill="#9E6A3A" /><path d="M1633 745 L 1810 745 L 1814 790 L 1636 790 Z" fill="#E6A86A" /><rect x={1660} y={762} width={90} height={6} fill="#4A7AE0" />
        <rect x={1802} y={622} width={130} height={208} fill="#B98A5A" /><rect x={1838} y={828} width={90} height={32} fill="#9A5AD8" /><rect x={1765} y={858} width={160} height={40} fill="#E6A86A" /><rect x={1866} y={895} width={60} height={6} fill="#4A7AE0" /><rect x={1946} y={868} width={30} height={22} fill="#F4E04A" />
        <rect x={1765} y={896} width={160} height={110} fill="#9E6A3A" />
        {/* niño del fondo derecho */}
        <rect x={1640} y={690} width={90} height={56} rx={26} fill="#6A82D8" />
        <HeadBall cx={1812} cy={572} r={122} id="k2" rimO={6} hi={[0.4, 0.4]} />
        <path d="M1690 528 Q 1700 450 1812 448 Q 1924 450 1934 528 Q 1914 520 1900 530 Q 1880 516 1860 528 Q 1840 516 1820 528 Q 1800 516 1780 528 Q 1760 516 1740 528 Q 1720 516 1700 530 Z" fill="#4C4A6C" />
        {[1760, 1838].map((x) => <g key={x}><ellipse cx={x} cy={578} rx={20} ry={23} fill={W} /><circle cx={x - 3} cy={579} r={8} fill="#0A0A0E" /></g>)}
        <rect x={1746} y={532} width={30} height={9} rx={4} fill={W} /><rect x={1822} y={532} width={34} height={9} rx={4} fill={W} />
        {[[1452, 707], [1595, 723], [1565, 750], [1455, 770]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={4} fill="#FFF2A0" />)}
      </svg>
    </AbsoluteFill>
    {/* ---------- personajes ---------- */}
    <svg width={1920} height={1080} style={{ position: "absolute" }}>
      {/* niño del fondo izquierdo (pelo rizado) */}
      <g>
        <ellipse cx={590} cy={560} rx={95} ry={150} fill="#101015" />
        {[[520, 470, 44], [555, 420, 46], [600, 398, 44], [640, 420, 40], [508, 530, 40], [520, 590, 36]].map(([x, y, r], i) => <circle key={i} cx={x} cy={y} r={r} fill="#5E4232" />)}
        {[[540, 430], [580, 410], [520, 520]].map(([x, y], i) => <path key={i} d={`M${x - 14} ${y + 6} Q ${x} ${y - 10} ${x + 14} ${y + 6}`} stroke="#8A6AA0" strokeWidth={4} fill="none" />)}
        <ellipse cx={595} cy={585} rx={27} ry={33} fill={W} /><circle cx={586} cy={588} r={11} fill="#0A0A0E" /><rect x={575} y={522} width={40} height={11} rx={5} fill={W} />
      </g>
      {/* ---- personaje principal ---- */}
      {/* sudadera */}
      <path d="M690 1003 L 668 760 Q 760 690 980 700 Q 1300 700 1500 790 Q 1640 860 1660 1003 Z" fill="#FFC97A" />
      <path d="M700 1003 L 680 770 Q 770 704 980 712 Q 1290 712 1490 800 Q 1628 868 1648 1003 Z" fill="#7CF0D0" />
      <path d="M700 1003 L 680 770 Q 700 755 730 745 L 750 1003 Z" fill="#2DC79E" />
      <path d="M1600 860 Q 1640 900 1648 1003 L 1620 1003 Q 1618 920 1590 880 Z" fill="#A8E8F4" />
      <path d="M790 745 Q 900 820 1010 810 Q 1100 806 1150 780 L 1040 740 Q 900 760 790 745 Z" fill="#0B0B0F" />
      <path d="M800 818 L 832 812 L 812 948 L 782 952 Z" fill={W} /><path d="M902 826 L 940 822 L 918 966 L 886 968 Z" fill={W} />
      {/* cabeza */}
      <HeadBall cx={1016} cy={440} r={368} id="m" rimO={14} cyan={[0.6, -0.55]} hi={[0.33, 0.36]} />
      {/* mano arriba con lápiz (delante, con contorno de luz) */}
      <path d="M690 160 Q 680 95 735 82 L 820 74 Q 860 80 862 120 L 858 240 Q 800 262 720 246 Q 688 220 690 160 Z" fill="#FFB86C" transform="translate(-8 0)" />
      <path d="M690 160 Q 680 95 735 82 L 820 74 Q 860 80 862 120 L 858 240 Q 800 262 720 246 Q 688 220 690 160 Z" fill="#0E0E12" />
      <path d="M750 252 L 835 74" stroke="#F6C42A" strokeWidth={24} strokeLinecap="butt" /><path d="M744 250 L 758 270 L 762 244 Z" fill="#2A2A2A" /><path d="M752 240 L 768 246" stroke="#E0A820" strokeWidth={6} />
      {/* cejas preocupadas */}
      <path d="M826 350 L 916 322" stroke={W} strokeWidth={30} strokeLinecap="round" /><path d="M1118 322 L 1206 350" stroke={W} strokeWidth={30} strokeLinecap="round" />
      {/* ojos */}
      <ellipse cx={873} cy={433} rx={66} ry={72} fill={W} /><circle cx={866} cy={440} r={24} fill="#0A0A0E" />
      <ellipse cx={1122} cy={433} rx={66} ry={72} fill={W} /><circle cx={1116} cy={440} r={24} fill="#0A0A0E" />
      {/* boca */}
      <path d="M906 604 Q 990 668 1100 590" stroke={W} strokeWidth={32} strokeLinecap="round" fill="none" />
      {/* gota */}
      <path d="M1300 322 Q 1286 372 1300 400 Q 1316 372 1300 322 Z" fill="#B8E2F4" />
      {/* hoja y mano en la barbilla */}
      <g transform="rotate(57 1312 616)"><rect x={1312} y={616} width={520} height={440} fill="#FFFFFF" /><rect x={1312} y={616} width={520} height={440} fill="none" stroke="#E4DCC8" strokeWidth={10} /></g>
      <circle cx={1158} cy={765} r={100} fill="#0C0C10" />
      <circle cx={1130} cy={730} r={60} fill="#1A1A22" opacity={0.5} />
      {/* ---- niña de gafas en primer plano ---- */}
      <path d="M-10 1003 L 0 880 Q 140 840 330 860 Q 480 870 540 1003 Z" fill="#C04A56" />
      <circle cx={325} cy={995} r={18} fill="#F4C02A" />
      <HeadBall cx={190} cy={650} r={292} id="g" rimO={8} hi={[0.4, 0.38]} />
      {/* trenza */}
      {[[462, 770, 58], [420, 880, 58], [462, 980, 60]].map(([x, y, r], i) => <g key={i}><circle cx={x + 3} cy={y} r={r + 4} fill="#A8E2F2" /><circle cx={x} cy={y} r={r} fill="#3A2C58" /><path d={`M${x - 30} ${y - 30} L ${x + 28} ${y + 26}`} stroke="#5E4E86" strokeWidth={8} strokeLinecap="round" /></g>)}
      {/* ojos somnolientos tras las gafas */}
      <ellipse cx={232} cy={628} rx={52} ry={34} fill={W} /><rect x={176} y={588} width={112} height={34} fill="#121218" /><circle cx={262} cy={628} r={15} fill="#0A0A0E" />
      <ellipse cx={378} cy={625} rx={42} ry={28} fill={W} /><rect x={332} y={590} width={92} height={30} fill="#121218" /><circle cx={402} cy={626} r={13} fill="#0A0A0E" />
      <path d="M196 534 L 274 550" stroke={W} strokeWidth={20} strokeLinecap="round" /><path d="M360 606 L 402 614" stroke={W} strokeWidth={14} strokeLinecap="round" />
      {/* gafas */}
      <ellipse cx={230} cy={615} rx={76} ry={120} fill="#5A4A7A" opacity={0.25} stroke="#2E2048" strokeWidth={22} />
      <circle cx={395} cy={615} r={110} fill="#5A4A7A" opacity={0.25} />
      <circle cx={395} cy={615} r={110} fill="none" stroke="#2E2048" strokeWidth={22} />
      <path d="M186 566 Q 196 534 218 524" stroke="#C8C8D8" strokeWidth={9} strokeLinecap="round" fill="none" />
      <path d="M312 584 Q 330 550 356 540" stroke="#C8C8D8" strokeWidth={9} strokeLinecap="round" fill="none" />
      <circle cx={440} cy={615} r={40} fill="#F4525A" />
      <path d="M250 744 L 383 744" stroke={W} strokeWidth={22} strokeLinecap="round" />
    </svg>
    {/* bloom cálido y viñeta */}
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 80% 45%, rgba(255,214,140,.22) 0%, rgba(255,214,140,0) 60%)" }} />
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 65%, rgba(60,30,0,.18) 100%)" }} />
    <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 76, background: "#000" }} /><div style={{ position: "absolute", left: 0, top: 1003, width: 1920, height: 77, background: "#000" }} />
  </AbsoluteFill>
);
