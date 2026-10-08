import { Audio } from "@remotion/media";
import { AbsoluteFill, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import data from "../../public/mi-video/data.json";
import { Camera } from "./Camera";
import { Captions } from "./Captions";
import { Spot, SpotProps } from "./Spot";
import { B, clamp } from "./theme";

type Scene = { from: number; to: number; spot?: SpotProps };

// ≈65 % ilustración / 35 % cámara, como refC
const SCENES: Scene[] = [
  { from: 0, to: 1.04 },
  {
    from: 1.04, to: 2.46,
    spot: { main: "wine-glass", mainSize: 470, overlay: "prohibited", items: [
      { name: "cigarette", x: 210, y: 760, size: 230, rot: -20 }, { name: "beer-mug", x: 880, y: 820, size: 250, rot: 12 },
      { name: "pill", x: 250, y: 1330, size: 170, rot: 25 }, { name: "syringe", x: 860, y: 1330, size: 200, rot: -30, depth: 2 },
    ] },
  },
  { from: 2.46, to: 3.76 },
  {
    from: 3.76, to: 5.22,
    spot: { main: "person-in-bed", mainSize: 600, items: [
      { name: "alarm-clock", x: 850, y: 720, size: 240, rot: 10 }, { name: "mobile-phone-off", x: 220, y: 760, size: 210, rot: -14 },
      { name: "crescent-moon", x: 300, y: 520, size: 150, depth: 2 },
    ] },
  },
  {
    from: 5.22, to: 7.34,
    spot: { main: "mobile-phone", mainSize: 520, items: [
      { name: "hourglass-not-done", x: 860, y: 860, size: 230, rot: 12 }, { name: "speech-balloon", x: 220, y: 760, size: 180, rot: -10 },
      { name: "red-heart", x: 250, y: 1200, size: 140, rot: 15 }, { name: "bell", x: 870, y: 1300, size: 150, depth: 2 },
    ] },
  },
  { from: 7.34, to: 8.9 },
  {
    from: 8.9, to: 10.42,
    spot: { main: "mirror-ball", mainSize: 480, overlay: "prohibited", items: [
      { name: "party-popper", x: 200, y: 800, size: 230, rot: -15 }, { name: "clinking-beer-mugs", x: 880, y: 820, size: 240 },
      { name: "bottle-with-popping-cork", x: 840, y: 1320, size: 200, rot: 18, depth: 2 },
    ] },
  },
  {
    from: 10.42, to: 12.3,
    spot: { main: "open-book", mainSize: 560, items: [
      { name: "brain", x: 840, y: 740, size: 220, rot: 8 }, { name: "books", x: 220, y: 800, size: 220, rot: -8 },
      { name: "sparkles", x: 300, y: 560, size: 140, depth: 2 },
    ] },
  },
  {
    from: 12.3, to: 13.72,
    spot: { main: "church", mainSize: 560, items: [
      { name: "folded-hands", x: 200, y: 820, size: 220, rot: -8 }, { name: "glowing-star", x: 860, y: 640, size: 170 },
      { name: "prayer-beads", x: 860, y: 1300, size: 170, depth: 2 },
    ] },
  },
  { from: 13.72, to: 14.86 },
  {
    from: 14.86, to: 16.24,
    spot: { main: "alarm-clock", mainSize: 520, items: [
      { name: "sun", x: 850, y: 680, size: 230 }, { name: "sparkles", x: 220, y: 760, size: 160 },
      { name: "mountain", x: 230, y: 1320, size: 190, depth: 2 },
    ] },
  },
  {
    from: 16.24, to: 18.72,
    spot: { main: "man-lifting-weights", mainSize: 620, items: [
      { name: "flexed-biceps", x: 200, y: 760, size: 200, rot: -12 }, { name: "spiral-calendar", x: 870, y: 780, size: 210, rot: 10 },
      { name: "fire", x: 860, y: 1320, size: 160, depth: 2 },
    ] },
  },
  {
    from: 18.72, to: 20.3,
    spot: { main: "green-salad", mainSize: 540, items: [
      { name: "broccoli", x: 210, y: 780, size: 210, rot: -14 }, { name: "green-apple", x: 860, y: 800, size: 200, rot: 10 },
      { name: "red-apple", x: 250, y: 1320, size: 150, depth: 2 },
    ] },
  },
  { from: 20.3, to: 23.38 },
  {
    from: 23.38, to: 25.94,
    spot: { main: "folded-hands", mainSize: 520, items: [
      { name: "sun", x: 850, y: 700, size: 220 }, { name: "sparkles", x: 220, y: 760, size: 170 },
      { name: "red-heart", x: 860, y: 1300, size: 150, depth: 2 },
    ] },
  },
  {
    from: 25.94, to: 29.3,
    spot: { main: "sun-behind-rain-cloud", mainSize: 580, rain: true, items: [
      { name: "glowing-star", x: 220, y: 700, size: 170 }, { name: "sparkles", x: 860, y: 760, size: 160 },
      { name: "cloud-with-rain", x: 240, y: 1300, size: 180, depth: 2 },
    ] },
  },
  { from: 29.3, to: 32.53 },
];

// Destello blanco-cian en cada corte (refC: 3–4 fotogramas); más fuerte al entrar en ilustración
const Flash: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  let o = 0;
  for (const s of SCENES.slice(1)) {
    const f0 = Math.round(s.from * fps);
    const peak = s.spot ? 0.9 : 0.45;
    o = Math.max(o, interpolate(frame, [f0 - 2, f0, f0 + 5], [0, peak, 0], clamp));
  }
  return <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 40%, #FFFFFF 0%, #BDF3FF 45%, #3BE3FF 100%)", opacity: o, pointerEvents: "none" }} />;
};

// Efectos de sonido CC0 de @wubbleai/community-sfx (estilo.md · Estilo B · Sonido)
const sfx = (n: string) => staticFile(`sfx/lib/${n}.mp3`);

const Sfx: React.FC = () => {
  const { fps } = useVideoConfig();
  const hlStarts = data.phrases.filter((p) => p.hl.length).map((p) => data.words[p.hl[0]].s);
  const at = (sec: number, off = 0) => Math.max(0, Math.round(sec * fps) + off);
  return (
    <>
      <Sequence from={0} durationInFrames={fps}>
        <Audio src={sfx("cinematic-start")} volume={0.5} />
      </Sequence>
      {SCENES.slice(1).map((s) => (
        <Sequence key={`w${s.from}`} from={at(s.from, -3)} durationInFrames={fps}>
          <Audio src={sfx(s.spot ? "cinematic-swipe" : "scifi-swipe")} volume={s.spot ? 0.55 : 0.4} />
        </Sequence>
      ))}
      {SCENES.filter((s) => s.spot?.overlay).map((s) => (
        <Sequence key={`d${s.from}`} from={at(s.from, 8)} durationInFrames={fps}>
          <Audio src={sfx("cinematic-drop")} volume={0.5} />
        </Sequence>
      ))}
      {hlStarts.map((t) => (
        <Sequence key={`p${t}`} from={at(t)} durationInFrames={Math.round(0.4 * fps)}>
          <Audio src={sfx("scifi-snap")} volume={0.38} />
        </Sequence>
      ))}
      <Sequence from={at(data.words[88].s)} durationInFrames={2 * fps}>
        <Audio src={sfx("cinematic-achievement")} volume={0.45} />
      </Sequence>
    </>
  );
};

export const MiVideoV3: React.FC = () => {
  const { fps } = useVideoConfig();
  const frame = useCurrentFrame();
  const t = frame / fps;
  const scene = SCENES.find((s) => t >= s.from && t < s.to) ?? SCENES[SCENES.length - 1];

  return (
    <AbsoluteFill style={{ background: B.bg0 }}>
      {SCENES.map((s) => (
        <Sequence key={s.from} from={Math.round(s.from * fps)} durationInFrames={Math.round((s.to - s.from) * fps)} premountFor={fps}>
          {s.spot ? <Spot {...s.spot} /> : <Camera startSec={s.from} />}
        </Sequence>
      ))}
      <Captions top={scene.spot ? 280 : 1150} />
      <Flash />
      <Audio src={staticFile("mi-video/voz.wav")} />
      <Sfx />
    </AbsoluteFill>
  );
};
