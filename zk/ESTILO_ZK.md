# ZK — estilo aprobado (versión de referencia: "Pedro v2")

Este es el estándar de ZK. Todo video nuevo se construye y se mide contra él.
Video de referencia: `video-editor/output/pedro-volvio-v2.mp4` · código: `video-editor/src/pedro/Main.tsx` · kit: `video-editor/src/kit/Kit.tsx`.

## Formato
- Vertical 1080×1920, 30 fps, entre 30 y 60 s.
- Todo dibujado y animado con código (SVG/CSS en Remotion). Sin imágenes de IA, sin vídeo real, sin marcas de agua, sin "EP. 01" ni "mañana…".

## Guion
- Gancho en el primer segundo: promesa, paradoja o pregunta.
- Datos concretos: nombres, años, cifras.
- Un giro con "Pero…", "Entonces…" o "Semanas después…".
- Cierre que interpela: "¿Y tú…?".
- La voz (ElevenLabs o MiniMax) se genera sin silencio inicial (la primera palabra antes de 0,25 s).

## Visual
- Luz de cine: siluetas con contraluz, contraste de frío y cálido (luna o antorchas), niebla, grano y viñeta.
- Cada escena en 5 capas con parallax: cielo, fondo lejano, decorado, personajes y primer plano desenfocado.
- Nada quieto: cámara con pulso de mano, personajes que respiran, tela que ondea, fuego, humo, brasas y partículas.
- Un evento visual en cada palabra clave, exactamente en el segundo en que se dice.
- Salto de plano (corte de cámara) en las palabras clave: un cambio grande cada 1,5–2,5 s.
- Datos en pantalla: etiquetas, globos de diálogo, contadores y marcadores (✕ → ❤).
- Gradación final: brillo ×1,18, contraste ×1,12, saturación ×1,12.

## Subtítulos (los actuales, fijados)
- Arriba (y ≈ 250), Poppins 600 a 62 px, blanco con sombra.
- De 1 a 3 palabras por bloque; las no dichas al 32 % de opacidad.
- Palabra clave enmarcada en azul (#4FA3FF).

## Sonido (medido contra las referencias)
- Voz normalizada a −16 LUFS (pico −1,5 dBTP).
- Música 12 dB por debajo de la voz, con compresión por la voz (sidechain). Se corta para que su subida coincida con el clímax.
- Efectos: entre 1,5 y 2 cada 10 s, solo al abrir un bloque o justo antes de un giro, nunca encima de una palabra.

## Control de calidad antes de entregar
Medir con `ficha-referencias.md`: volumen de la voz, fondo, efectos por cada 10 s, cambio visual cada X s, % de imagen quieta y movimiento. No se entrega hasta que cuadre.

## Flujo
1. Guion → 2. voz → 3. Whisper (tiempo de cada palabra) → 4. lista de eventos por palabra clave → 5. escenas con el kit → 6. mezcla de sonido → 7. render → 8. medición → 9. entrega.
