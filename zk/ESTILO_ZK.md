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
1. Guion → 2. voz → 3. Whisper (tiempo de cada palabra) → 4. lista de eventos por palabra clave → 5. escenas con el kit → 6. mezcla de sonido → 7. render → 8. medición → 9. entrega → 10. título.

## Título (regla fija)
Al terminar cada video se entrega su título: corto, en forma de pregunta y pensado para que lo abran (alto CTR).

## Fórmula viral (análisis de nov. 2026: nuestros 2 mejores frente a los 3 últimos y 7 refs de @detras_del_dato)
Lo que funcionó (Pedro "juró que nunca lo negaría", el ladrón "único hombre al que Jesús le prometió el paraíso") y lo que no (David, Jonás, Pedro sobre el agua en POV "tú"):
- Gancho en 1,5 s: una pregunta que la gente ya se hace o una paradoja con nombre propio ("El único hombre… era un criminal"). Nunca empezar con una escena en POV ("Estás en medio del mar…").
- La segunda frase rompe lo esperado ("Y no es por el humo", "ni entra en el top 10").
- Un dato poco conocido y verificable (3 negaciones ↔ 3 "¿me amas?"), con cita bíblica exacta como prueba.
- Narración en tercera persona con diálogos reales del texto, no "tú".
- Explicar con comparaciones simples y cifras en pantalla.
- Cerrar con una frase que reinterpreta todo ("No eligió al que nunca cayó, eligió al que volvió").
- Cierre de reenvío dirigido: "Mándaselo a ese amigo que…" (motor de compartidos).
- Duración máxima 29 s (regla fija del usuario): ~80 palabras a ~3 palabras por segundo, sin silencios largos. Historias muy conocidas (David, Jonás) solo si se cuenta un dato que casi nadie sabe.

## Estándar dinámico (desde "Pedro camina sobre el agua" v2)
- Un plano cada ~0,9 s: la misma escena se corta en varios encuadres (general, primer plano, detalle) con zoom en movimiento, giro leve y pulso de mano.
- Cada palabra clave lleva impacto: sacudida + golpe de zoom; efectos de escena (rayo, salpicadura, destello cálido).
- Subtítulos: siempre los de ZK (arriba, 1–3 palabras, clave enmarcada en azul). Los de dos niveles son solo de SL; nunca mezclarlos.
- Canciones sacadas de TikTok: cortar antes del sonido del logo final.
- Regla del usuario: cada video debe superar claramente al anterior.

## Música (regla fija, nov. 2026)
- Solo 3 canciones para ZK, en `video-editor/public/zk/songs/`:
  - zk1 (60 s, Do mayor, 65 BPM): empieza suave, sube a los 20 s, pico en el 42 s → historias con giro (alinear el pico con el momento fuerte).
  - zk2 (60 s, La menor, 65 BPM): oscura y pareja, corte a los 55 s → estilo Dark y tensión constante.
  - zk3 (5:37, Mi mayor, 81 BPM): intro de 40 s y luego estable; golpe tipo logo al final (cortar antes de 5:30) → finales esperanzadores.
- Una sola canción por video (nunca dos en el mismo video), elegida según cuál conecte más con el guion (potencial viral). Nunca otra fuera de estas 3.
- Cortar siempre antes de cualquier sonido de logo final.

## Miniatura dentro del video (regla fija, ZK y SL)
- Elegir el fotograma de mayor CTR de todo el video: un solo foco grande, contraste fuerte, curiosidad, 1–3 palabras como máximo, dentro de la zona segura.
- Renderizarlo limpio (sin subtítulos) e insertarlo al inicio durante 3 fotogramas (0,1 s); todo lo demás se corre 0,1 s y la primera palabra sigue antes de 0,25 s. El tercer fotograma funde con el primer plano.
- Al publicar se elige el fotograma 0 como portada. Entregar también ese fotograma en PNG y decir qué momento se eligió.

## Filosofía de marca (regla fija del usuario)
- Como una marca de papas: el producto es siempre la Biblia; cada video es un "sabor" distinto (otro personaje, otro dato, otro ángulo), con la misma estructura viral.
- Viralidad = 3 cosas a la vez: audio de calidad, imagen que entretiene y retiene (golpes dopamínicos visuales constantes) y una retención del 95 % del video.
- Guion e idea pesan más del 60 % (gancho y storytelling), pero el empaquetado visual también decide: un buen mensaje mal empaquetado no se ve, y un buen empaquetado con un guion flojo tampoco funciona.

## Curva de retención (regla fija)
- Los 3 primeros segundos deciden: la primera palabra antes de 0,25 s, movimiento desde el fotograma 1, 2 o 3 cambios visuales y una pregunta abierta antes del segundo 3.
- Después, la curva debe ser casi plana: un re-gancho cada 5–7 s (dato poco conocido, pregunta nueva, giro o contador) y ninguna pausa de más de 0,4 s.
- El final empalma con el inicio (bucle).

## Cero redundancia (regla fija)
- Tres capas con tres trabajos distintos:
  - El **subtítulo** es lo que se dice.
  - El **título en pantalla** es lo que NO se dice: un dato, una cifra, una cita, un contraste o una pregunta que abre curiosidad.
  - La **imagen** muestra el subtexto, la consecuencia o la metáfora, para que el espectador deduzca; no ilustra la palabra literal.
- Prohibido que el título repita el subtítulo, o que la imagen sea literalmente lo que se dice (ej.: subtítulo "el poder del rayo" + título "EL PODER DEL RAYO" + una mano con un rayo).
- Prueba de cada plano: si quito una capa, ¿se pierde información? Si no se pierde, esa capa sobra o se cambia.
- Si no hay nada nuevo que decir, no hay título: la imagen sola.

## Efectos de sonido (regla fija)
- Pocos y estratégicos: solo donde suman (un giro, un dato clave, un golpe de rojo). Nunca de relleno ni en cada corte; dejar tramos sin efectos.
