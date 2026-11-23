import React from "react";
import { AbsoluteFill } from "remotion";

// Recreación al milímetro del cuadro de referencia (aula, 1920x1080), medida sobre cuadrícula.
const HeadBall: React.FC<{ cx: number; cy: number; r: number; id: string; rimO?: number; cyan?: [number, number]; hi?: [number, number] }> = ({ cx, cy, r, id, rimO = 13, cyan, hi = [0.36, 0.4] }) => (
  <g>
    <defs>
      <radialGradient id={`g${id}`} cx={`${hi[0] * 100}%`} cy={`${hi[1] * 100}%`} r="70%"><stop offset="0%" stopColor="#2A2D3C" /><stop offset="40%" stopColor="#111219" /><stop offset="100%" stopColor="#050507" /></radialGradient>
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
    <AbsoluteFill style={{ filter: "blur(1.2px)" }}>
      <svg width={1920} height={1080}>
        <defs>
          <linearGradient id="wl" x1="0" y1="0" x2="1" y2="0.2"><stop offset="0%" stopColor="#F4E6BE" /><stop offset="60%" stopColor="#FEF6CE" /><stop offset="100%" stopColor="#F6EBC8" /></linearGradient>
          <linearGradient id="lw" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#F2A84A" /><stop offset="100%" stopColor="#EE9C3E" /></linearGradient>
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
        <rect x={1610} y={771} width={160} height={240} fill="#9E6A3A" /><path d="M1596 744 L 1766 744 L 1770 772 L 1598 772 Z" fill="#E6A86A" /><rect x={1616} y={754} width={90} height={6} fill="#4A7AE0" />
        <rect x={1764} y={622} width={170} height={208} fill="#B98A5A" /><rect x={1838} y={828} width={90} height={32} fill="#9A5AD8" /><rect x={1765} y={858} width={160} height={40} fill="#E6A86A" /><rect x={1866} y={895} width={60} height={6} fill="#4A7AE0" /><rect x={1946} y={868} width={30} height={22} fill="#F4E04A" />
        <rect x={1765} y={896} width={160} height={110} fill="#9E6A3A" />
        {/* niño del fondo derecho */}
        <path d="M1600 744 Q 1600 690 1650 684 L 1700 690 L 1700 744 Z" fill="#6A82D8" /><path d="M1690 690 Q 1740 690 1760 744 L 1700 744 Z" fill="#1A1A22" />
        <HeadBall cx={1800} cy={574} r={122} id="k2" rimO={6} hi={[0.4, 0.4]} />
        <path d="M1678 530 Q 1688 452 1800 450 Q 1912 452 1922 530 Q 1902 522 1888 532 Q 1868 518 1848 530 Q 1828 518 1808 530 Q 1788 518 1768 530 Q 1748 518 1728 530 Q 1708 518 1688 532 Z" fill="#4C4A6C" />
        {[1760, 1838].map((x) => <g key={x}><ellipse cx={x} cy={578} rx={20} ry={23} fill={W} /><circle cx={x - 3} cy={579} r={8} fill="#0A0A0E" /></g>)}
        <rect x={1746} y={534} width={30} height={9} rx={4} fill={W} /><rect x={1822} y={534} width={34} height={9} rx={4} fill={W} />
        <defs><linearGradient id="ray" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#FFF3C0" stopOpacity="0.35" /><stop offset="100%" stopColor="#FFF3C0" stopOpacity="0" /></linearGradient></defs>
        <path d="M1380 540 L 1520 540 L 1700 1003 L 1520 1003 Z" fill="url(#ray)" />
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
      {/* mano arriba con lápiz */}
      <path d="M700 252 Q 676 170 694 112 Q 708 76 750 76 L 838 76 Q 862 118 852 176 Q 836 246 770 262 Q 726 268 700 252 Z" fill="#FFB86C" transform="translate(-10 4)" />
      <path d="M700 252 Q 676 170 694 112 Q 708 76 750 76 L 838 76 Q 862 118 852 176 Q 836 246 770 262 Q 726 268 700 252 Z" fill="#0C0D12" />
      <path d="M760 246 L 842 76" stroke="#F8C52C" strokeWidth={26} /><path d="M753 242 L 760 268 L 771 250 Z" fill="#2A2A2A" /><path d="M774 218 L 800 230" stroke="#E2A61E" strokeWidth={5} />
      {/* cejas preocupadas */}
      <path d="M826 350 L 916 322" stroke={W} strokeWidth={30} strokeLinecap="round" /><path d="M1118 322 L 1206 350" stroke={W} strokeWidth={30} strokeLinecap="round" />
      {/* ojos */}
      <ellipse cx={873} cy={433} rx={66} ry={72} fill={W} /><circle cx={866} cy={440} r={24} fill="#0A0A0E" />
      <ellipse cx={1122} cy={433} rx={66} ry={72} fill={W} /><circle cx={1116} cy={440} r={24} fill="#0A0A0E" />
      {/* boca */}
      <path d="M906 604 Q 990 668 1100 590" stroke={W} strokeWidth={32} strokeLinecap="round" fill="none" />
      {/* gota */}
      <path d="M1300 318 Q 1278 372 1286 392 Q 1300 410 1314 392 Q 1322 372 1300 318 Z" fill="#BFE4F6" />
      {/* hoja y mano en la barbilla */}
      <g transform="rotate(57 1280 612)"><rect x={1280} y={612} width={520} height={440} fill="#FFFFFF" /><rect x={1280} y={612} width={520} height={440} fill="none" stroke="#E4DCC8" strokeWidth={10} /></g>
      <circle cx={1120} cy={757} r={98} fill="#0C0D12" />
      <circle cx={1095} cy={722} r={52} fill="#1C1E28" opacity={0.6} />
      {/* ---- niña de gafas en primer plano ---- */}
      <path d="M-10 1003 L 0 880 Q 140 840 330 860 Q 480 870 540 1003 Z" fill="#C04A56" />
      <circle cx={325} cy={995} r={18} fill="#F4C02A" />
      <defs><clipPath id="gtop"><rect x={-200} y={300} width={700} height={250} /></clipPath></defs><circle cx={190} cy={650} r={300} fill="#FFB86C" clipPath="url(#gtop)" /><HeadBall cx={190} cy={650} r={292} id="g" rimO={0} hi={[0.4, 0.38]} />
      {/* trenza */}
      {[[456, 786, 52, 76], [427, 884, 58, 60], [440, 972, 56, 58]].map(([x, y, rx, ry], i) => <g key={i}><ellipse cx={x + 6} cy={y} rx={rx} ry={ry} fill="#A8E2F2" /><ellipse cx={x} cy={y} rx={rx} ry={ry} fill="#3B2D5B" /><path d={`M${x - rx * 0.5} ${y - ry * 0.55} L ${x + rx * 0.45} ${y + ry * 0.5}`} stroke="#5E4E86" strokeWidth={8} strokeLinecap="round" /></g>)}
      {/* lentes (relleno translúcido) */}
      <ellipse cx={242} cy={616} rx={57} ry={118} fill="#4A3E66" opacity={0.45} />
      <circle cx={392} cy={605} r={112} fill="#4A3E66" opacity={0.4} />
      {/* ojos medio cerrados (párpado recto arriba) */}
      <path d="M190 604 L 266 604 Q 266 650 228 650 Q 190 650 190 604 Z" fill={W} /><circle cx={254} cy={624} r={14} fill="#0A0A0E" />
      <path d="M357 608 L 405 608 Q 405 648 381 648 Q 357 648 357 608 Z" fill={W} /><circle cx={396} cy={628} r={12} fill="#0A0A0E" />
      <path d="M198 534 L 270 552" stroke={W} strokeWidth={22} strokeLinecap="round" /><path d="M366 618 L 408 606" stroke={W} strokeWidth={12} strokeLinecap="round" />
      {/* monturas */}
      <ellipse cx={242} cy={616} rx={57} ry={118} fill="none" stroke="#2E2048" strokeWidth={20} />
      <circle cx={392} cy={605} r={112} fill="none" stroke="#2E2048" strokeWidth={22} />
      <path d="M306 600 Q 318 556 352 538" stroke="#C8C8D8" strokeWidth={9} strokeLinecap="round" fill="none" opacity={0.85} />
      <circle cx={440} cy={615} r={40} fill="#F4525A" />
      <path d="M250 744 L 383 744" stroke={W} strokeWidth={22} strokeLinecap="round" />
    </svg>
    <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 76, background: "#000" }} /><div style={{ position: "absolute", left: 0, top: 1003, width: 1920, height: 77, background: "#000" }} />
  </AbsoluteFill>
);
