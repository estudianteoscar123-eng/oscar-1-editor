import { AbsoluteFill, useVideoConfig } from "remotion";

export const SinLimitesLifeIntro = () => {
  const { fps, durationInFrames } = useVideoConfig();

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0A0E27",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          fontSize: 60,
          color: "#FFFFFF",
          fontFamily: "Montserrat",
          fontWeight: "bold",
        }}
      >
        🎬 SinLimitesLife
      </div>
    </AbsoluteFill>
  );
};
