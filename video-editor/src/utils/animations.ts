import { interpolate, Easing } from "remotion";

export const slideInFromLeft = (
  frame: number,
  durationFrames: number
) => {
  return interpolate(frame, [0, durationFrames], [-100, 0], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
};

export const slideInFromRight = (
  frame: number,
  durationFrames: number
) => {
  return interpolate(frame, [0, durationFrames], [100, 0], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
};

export const scaleIn = (
  frame: number,
  durationFrames: number,
  startScale: number = 0.5
) => {
  return interpolate(frame, [0, durationFrames], [startScale, 1], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
};

export const fadeIn = (
  frame: number,
  durationFrames: number
) => {
  return interpolate(frame, [0, durationFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
};

export const pulse = (
  frame: number,
  intensity: number = 1
) => {
  return 1 + Math.sin(frame / 5) * 0.1 * intensity;
};
