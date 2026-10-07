import {
  AbsoluteFill,
  useVideoConfig,
  Sequence,
  spring,
  useCurrentFrame,
  interpolate,
  Easing,
} from "remotion";
import { SLL_COLORS } from "../utils/sinlimiteslife-colors";
import { fadeIn, scaleIn, slideInFromLeft, slideInFromRight } from "../utils/animations";

export const SinLimitesLifeVideoEdit = () => {
  const { fps, durationInFrames, width, height } = useVideoConfig();
  const frame = useCurrentFrame();

  // Intro: Flecha rompiendo (0-2s = 60 frames)
  const introScale = scaleIn(Math.min(frame, 60), 60);
  const introOpacity = fadeIn(Math.min(frame, 60), 60);

  // Elemento dinámico central (2s-10s)
  const centralY = interpolate(
    Math.max(0, Math.min(frame - 60, 240)),
    [0, 240],
    [height / 2 + 100, height / 2 - 50],
    { easing: Easing.out(Easing.cubic) }
  );

  // Texto principal (3s-15s)
  const textOpacity = fadeIn(
    Math.max(0, Math.min(frame - 90, 180)),
    180
  );

  // Línea roja dinámica (5s-17s)
  const redLineWidth = interpolate(
    Math.max(0, Math.min(frame - 150, 210)),
    [0, 210],
    [0, width * 0.8],
    { easing: Easing.out(Easing.cubic) }
  );

  // Números que suben (8s-17s)
  const numbersOpacity = fadeIn(
    Math.max(0, Math.min(frame - 240, 120)),
    120
  );

  // Outro fade (15s-17s)
  const outroFade = interpolate(
    Math.max(0, frame - 450),
    [0, 60],
    [1, 0],
    { easing: Easing.in(Easing.cubic), extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: SLL_COLORS.primary.black,
        overflow: "hidden",
      }}
    >
      {/* Background animated grid */}
      <div
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          opacity: 0.05,
          background: `repeating-linear-gradient(
            0deg,
            ${SLL_COLORS.primary.blue},
            ${SLL_COLORS.primary.blue} 1px,
            transparent 1px,
            transparent 50px
          )`,
        }}
      />

      {/* INTRO: Flecha rompiendo límites */}
      <div
        style={{
          position: "absolute",
          top: "20%",
          left: "50%",
          transform: `translate(-50%, -50%) scale(${introScale})`,
          opacity: introOpacity,
          zIndex: 10,
        }}
      >
        <div
          style={{
            fontSize: 120,
            color: SLL_COLORS.primary.red,
            textShadow: `0 0 30px ${SLL_COLORS.primary.red}`,
            fontWeight: "bold",
          }}
        >
          ➜
        </div>
      </div>

      {/* Línea roja horizontal dinámica */}
      <div
        style={{
          position: "absolute",
          top: "35%",
          left: "50%",
          transform: "translateX(-50%)",
          width: `${redLineWidth}px`,
          height: 4,
          backgroundColor: SLL_COLORS.primary.red,
          boxShadow: `0 0 20px ${SLL_COLORS.primary.red}`,
        }}
      />

      {/* Elemento central: Números con animación */}
      <div
        style={{
          position: "absolute",
          top: `${centralY}px`,
          left: "50%",
          transform: "translateX(-50%)",
          opacity: numbersOpacity,
          zIndex: 5,
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontSize: 80,
            fontWeight: "bold",
            fontFamily: "Montserrat",
            color: SLL_COLORS.primary.blue,
            textShadow: `0 0 20px ${SLL_COLORS.primary.blue}`,
            marginBottom: 10,
          }}
        >
          ∞
        </div>
        <div
          style={{
            fontSize: 48,
            fontFamily: "Montserrat",
            color: SLL_COLORS.secondary.white,
            fontWeight: "bold",
            letterSpacing: 2,
          }}
        >
          SIN LÍMITES
        </div>
      </div>

      {/* Texto principal grande */}
      <div
        style={{
          position: "absolute",
          bottom: "30%",
          left: "10%",
          right: "10%",
          opacity: textOpacity,
          zIndex: 8,
        }}
      >
        <div
          style={{
            fontSize: 64,
            fontFamily: "Montserrat",
            fontWeight: "bold",
            color: SLL_COLORS.secondary.white,
            lineHeight: 1.2,
            marginBottom: 20,
            textTransform: "uppercase",
          }}
        >
          De Promedio a
          <br />
          <span style={{ color: SLL_COLORS.primary.red }}>
            EXTRAORDINARIO
          </span>
        </div>
        <div
          style={{
            fontSize: 28,
            fontFamily: "Inter",
            color: SLL_COLORS.secondary.lightBlue,
            lineHeight: 1.4,
          }}
        >
          Mentalidad, Hábitos, Acción.
        </div>
      </div>

      {/* Elementos decorativos: círculos dinámicos */}
      {[0, 1, 2].map((i) => {
        const circleScale = interpolate(
          Math.max(0, frame - (100 + i * 50)),
          [0, 100],
          [0.3, 1.2],
          { easing: Easing.out(Easing.cubic) }
        );
        const circleOpacity = interpolate(
          Math.max(0, frame - (100 + i * 50)),
          [0, 100],
          [0.8, 0],
          { easing: Easing.in(Easing.cubic) }
        );

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              width: 150,
              height: 150,
              border: `2px solid ${SLL_COLORS.primary.blue}`,
              borderRadius: "50%",
              bottom: `${200 - i * 100}px`,
              right: `${100 + i * 120}px`,
              transform: `scale(${circleScale})`,
              opacity: circleOpacity,
              pointerEvents: "none",
            }}
          />
        );
      })}

      {/* Lineas laterales */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: 4,
          height: "100%",
          backgroundColor: SLL_COLORS.primary.red,
          opacity: 0.3,
        }}
      />
      <div
        style={{
          position: "absolute",
          right: 0,
          top: 0,
          width: 4,
          height: "100%",
          backgroundColor: SLL_COLORS.primary.blue,
          opacity: 0.3,
        }}
      />

      {/* Branding final: Logo + CTA */}
      <div
        style={{
          position: "absolute",
          bottom: 60,
          left: "50%",
          transform: "translateX(-50%)",
          textAlign: "center",
          opacity: textOpacity,
          zIndex: 8,
        }}
      >
        <div
          style={{
            fontSize: 40,
            fontFamily: "Montserrat",
            fontWeight: "bold",
            color: SLL_COLORS.primary.red,
            marginBottom: 10,
            letterSpacing: 1,
          }}
        >
          🚀 SINLIMITESLIFE
        </div>
        <div
          style={{
            fontSize: 16,
            color: SLL_COLORS.secondary.lightBlue,
            letterSpacing: 2,
            textTransform: "uppercase",
          }}
        >
          Tu mejor versión te espera
        </div>
      </div>

      {/* Overlay final fade out */}
      <div
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          backgroundColor: SLL_COLORS.primary.black,
          opacity: 1 - outroFade,
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};
