import React from "react";
import { AbsoluteFill } from "remotion";
import { Toon, type TLook, type Expr, type Pose } from "./Toon";
const KING: TLook = { robe: "#4A1E46", robeSh: "#24102A", trim: "#C9A04A", mantle: "#7A0A14", skin: "#B07850", skinSh: "#7A4E34", hair: "#1A1210", hairStyle: "short", beard: "short", crown: true };
const GIRL: TLook = { robe: "#9A2A3A", robeSh: "#5A1420", trim: "#C9A04A", skin: "#C08A62", skinSh: "#8A5A3E", hair: "#140C08", hairStyle: "long", jewel: true };
const OLD: TLook = { robe: "#D8D0C0", robeSh: "#9A9284", skin: "#B07850", skinSh: "#7A4E34", hair: "#E8E4DC", hairStyle: "white", beard: "white" };
const list: [TLook, Expr, Pose][] = [[KING, "laugh", "clap"], [KING, "shock", "face"], [KING, "sad", "face"], [GIRL, "happy", "dance"], [GIRL, "evil", "hips"], [OLD, "cold", "down"], [KING, "smug", "point"], [OLD, "think", "chin"]];
export const ZKToonTest: React.FC = () => (
  <AbsoluteFill style={{ background: "#1A1418" }}>
    <svg width={1080} height={1920}>
      {list.map(([l, e, p], i) => <Toon key={i} x={150 + (i % 4) * 260} y={i < 4 ? 900 : 1800} s={0.68} l={l} e={e} pose={p} t={1.3} />)}
    </svg>
  </AbsoluteFill>
);
