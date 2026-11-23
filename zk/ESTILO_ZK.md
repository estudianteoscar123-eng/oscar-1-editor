# ZK — estilo aprobado (versión de referencia: "Pedro v2")

> Regla fija de producción (ZK y SL): 2 videos por marca, entregados juntos, en máximo 15 minutos. Ver `zk/REGLAS_PRODUCCION.md`.

Este es el estándar de ZK. Todo video nuevo se construye y se mide contra él.
Video de referencia: `video-editor/output/pedro-volvio-v2.mp4` · código: `video-editor/src/pedro/Main.tsx` · kit: `video-editor/src/kit/Kit.tsx`.

## Formato
- Vertical 1080×1920, 30 fps, entre 30 y 60 s.
- Todo dibujado y animado con código (SVG/CSS en Remotion). Sin imágenes de IA, sin vídeo real, sin marcas de agua, sin "EP. 01" ni "mañana…".

## Guion
- Gancho en el primer segundo con la fórmula fija de `zk/GANCHO_VIRAL.md` (sujeto + acción extraordinaria + consecuencia + contradicción, que dispara una pregunta automática sin escribirla). Se aplica también a SL.
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

## Subtítulos (los actuales, fijados — regla del usuario: NUNCA cambiarlos, tampoco en el estilo 3D)
- Los del kit (`Captions` de `src/kit/Kit.tsx`) con la palabra clave enmarcada en rojo (#D30F17), como en los videos Dark.
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
- El título nunca repite lo que se dice en el video, ni el gancho ni el cierre. Debe aportar un ángulo nuevo que dé curiosidad.

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
- Solo 5 canciones para ZK, guardadas en el repo en `video-editor/public/zk/songs/` (zk1–zk5.mp3):
  - zk1 (60 s): oscura y pareja, baja a los 55 s.
  - zk2 (53 s): oscura, golpe tipo logo a los 49 s → cortar antes de 48,5 s.
  - zk3 (5:37): intro suave de ~37 s y luego estable; golpe final → cortar antes de 5:30.
  - zk4 (35 s): tensión media, golpe a los 31 s → cortar antes de 30,5 s.
  - zk5 (60 s): crece desde suave hasta el pico a partir de los 34 s → alinear el pico con el momento fuerte.
- Una sola canción por video, elegida según el guion; no repetir la del video anterior. Nunca otra fuera de estas 5.
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

## Bucle y ritmo (regla fija, nov. 2026)
- En el guion entregado el cierre NUNCA reescribe el inicio (el usuario lo copia tal cual a la voz): la última frase queda abierta y conecta sola con la primera al repetirse el video.
- Todo video es cíclico: la última frase queda abierta y se completa con la primera ("Mándaselo a quien todavía no sabe que…" → "Los Reyes Magos nunca…"). El último plano empalma con el primero y la música no se cierra; el espectador no debe notar que el video acabó.
- Ritmo rápido: un plano cada 0,6–0,9 s y trazos que se dibujan en 0,25 s o menos (nunca revelados lentos). Algo se mueve en cada fotograma y hay transiciones de 4–6 fotogramas (barrido, zoom a través del objeto).
- Variar la canción: no repetir la del video anterior.
- Aprovechar la temporada (Navidad, Semana Santa) siempre desde la Biblia; nunca Halloween.

## Efectos de sonido (regla fija)
- Pocos y estratégicos: solo donde suman (un giro, un dato clave, un golpe de rojo). Nunca de relleno ni en cada corte; dejar tramos sin efectos.

## Resultados nov. 2026 y reglas nuevas
- Lo que gana es el MECANISMO, no el título: figura que todos conocen + verdad oculta que contradice la imagen popular + revelación visual (Lucifer 3.655 TT / 7.537 IG; Jesús 2.591 TT).
- Nunca repetir fórmula de título ni de portada: cada video con gancho, pregunta y diseño propios (regla del usuario: nada genérico ni repetitivo).
- Portada con figura o cara siempre: "¿Su nombre?" (rectángulo con símbolos) quedó en 1.039 TT pese a 6.089 IG.
- Publicar en TikTok e Instagram (IG: 255,5k visualizaciones en 30 días).
- Dinamismo: un cambio visual cada 0,5–0,7 s, 3–4 eventos por frase (zoom de golpe, sacudida, destello, partículas, reencuadre), nada quieto.
- Interacción indirecta (nunca pedir like/comentario): afirmación que divide, pregunta que el video no responde, cierre "esto es para…" que invita a enviar, bucle.
- Temas con atractivo masivo (miedo, misterio, lo prohibido), no solo para creyentes.
- La música influye en el alcance (dato del usuario): elegirla por emoción del guion, que suba en el giro y nunca repetir la del video anterior. Registrar qué canción llevó cada video para cruzarlo con las visitas (Lucifer = zk5 → mejor resultado; Nombre = zk1).
- Dinamismo = CONTENIDO, no cámara (corrección del usuario): una escena nueva cada ~1,2 s, personajes y objetos que actúan (caminan, caen, se transforman, señalan, arden), transición distinta en cada cambio (atravesar con zoom, barrido, iris, caída, rebobinado). La cámara solo empuja suave; los reencuadres mecánicos cada 0,6 s se ven básicos.

## Formato 3D "Eres…" (desde nov. 2026, referencia: videos de Jensen Huang y Trump)
- Duración 45–60 s (reemplaza el límite de 29 s para este formato).
- Narración en segunda persona ("Eres Judas…") con un dato verificable cada 3–4 s, giro y escándalo al final.
- Kit 3D propio: muñecos de cabeza redonda con caras expresivas, escenarios llenos de objetos, cambio de plano cada ~1 s, barridos con desenfoque entre escenarios, datos en carteles del escenario y tablet "REAL" con arte clásico o foto real.
- Subtítulos: SIN cambios (Kit Captions con la palabra clave enmarcada en rojo).

## YouTube ZK (largo diario) — concepto "burbuja bíblica"
- ZK y SL son proyectos SEPARADOS: cuentas, estilos, guiones y automatizaciones distintas. Nunca mezclar.
- 1 video diario 4–6 min (máx 6) en YouTube ZK; de cada uno salen 3 Reels/Shorts de ~60 s autónomos (no "Parte 1/2/3").
- Tema libre (mundo, historia, ciencia, hipótesis "¿qué pasaría si…?"), pero SIEMPRE dentro de la Biblia: la Biblia es el suelo; se camina sobre ella, se toman sus objetos, nunca se sale de ella. Ej: "¿Qué pasaría si quedaras atrapado en la época de Sansón?".
- Estilo visual: pendiente de referencias del usuario.
- Conexión YouTube vía Composio con alias "ZK".

## Referencias YouTube "¿Y si…?" (5 videos, 8–12 min, 1920x1080 60fps) — análisis
- 2D vectorial con volumen: degradados suaves, sombras de contacto, bruma de profundidad (fondo desenfocado/lavado), luz cálida de ventana, letterbox negro.
- Personaje: cabeza negra redonda con cara emoji blanca (ojos/cejas/boca), pelo de trazos, cuerpo simple con ropa de color, guantes negros. Extras = siluetas grises.
- Sets muy detallados (cuarto, salón, feria, azotea, ciudad de noche) con props con texto ("OFERTA $99", "FERIA", relojes).
- Narración 2ª persona presente ("Suena tu alarma… abres la ventana"), gancho con número/misterio en 0–7 s, contadores en pantalla (8 231 478 902, cuenta regresiva, "DÍA 45").
- Subtítulos: palabra por palabra, amarillo/naranja Bebas-like con contorno oscuro, cerca del personaje, solo en diálogos/frases clave.
- Cortes: mediana 2–3.5 s; cámara con paneos/zoom lentos; personajes con animación sutil (respirar, parpadeo, gesto).
- Audio a -14 LUFS, música de fondo continua.
- Adaptación ZK: mismo motor, "¿Y si…?" dentro de la Biblia, paletas más oscuras (noche, fuego, desierto).

## Voz IA (VoiceStudio / OmniVoice) — instalado en /home/user/tools/VoiceStudio (.venv CPU)
- Script: video-editor/tools/voz/tts.py. ~30 s de cómputo por 5 s de audio (48 pasos, CPU).
- Diseño de voz por atributos (género, edad, tono). Español OK. Verificar cada toma con transcripción: ~1 de 3 sale mal.

## REGLAS VIGENTES (usuario, tras reels de 10 s con personaje réplica)
- Personaje réplica "¿Y si…?" (YChar) APROBADO. Visual del video YouTube aprobado.
- Efectos: mínimos, solo cuando sean necesarios; fuego/etc. permitido pero NUNCA repetir el mismo efecto. Nada genérico.
- Subtítulos amarillos: PROHIBIDOS. Shorts usan los subtítulos ZK originales (palabra clave en marco rojo #D30F17).
- Shorts: contenido APARTE del video largo (no recortes), < 30 s, 9:16, música: solo las 2 canciones que da el usuario, alternándolas (guardarlas en public/zk/songs).
- YouTube largo: sin música. Uno cada 2 días.
- Voz: clonada (OmniVoice con referencia de su narración), sin eco.
- El usuario solo publica y reporta resultados. Todo lo demás (idea, guion, voz, edición, miniatura, título) es mío.
- Prioridad: retención (3 primeros segundos + mantener) > interacción. Ideas con demanda probada (adaptar outliers de la competencia). Jamás genérico ni con cara de IA.
- Subtítulos SOLO cuando hagan falta (frase clave, dato, número). Cuando el foco es el personaje/acción: sin subtítulos (shorts y largos).
- Todo debe entenderlo cualquier persona del mundo: lenguaje simple, imagen que explique sola.
- Filtrar ideas/guiones de forma crítica; producir en masa sin sacrificar calidad; definir un estilo y exprimirlo.
- Música Shorts: public/zk/songs/short1.mp3, short2.mp3, short3.mp3. Rotar: nunca la misma que el short anterior. Siempre por debajo de la voz; debe combinar con el mensaje.
