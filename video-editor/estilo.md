# estilo.md — Guía de edición (extraída de las referencias)

Fuentes analizadas:
- `refB` = 4ef24c28 (42,75 s, 1080x1920, 30 fps) — referencia principal
- `refA` = 26a10ead (79,96 s, 720x1280, 30 fps) — mismo creador, mismo estilo
- Método: 2 fotogramas/s + detección de cambio de plano (ffmpeg `scene>0.2`), análisis fotograma a fotograma de animaciones, muestreo de color por píxel, `ebur128` y `silencedetect` en el audio.

Las medidas en px están referidas a un lienzo de 1080x1920.

---

## 1. Ritmo de cortes
- Cambio de plano medio: **2,6 s** (refB) / **3,5 s** (refA). Mediana 2,15 s / 3,33 s.
- Plano más corto: **0,8 s**. Plano más largo: **10,8 s** (solo cuando hay una tarjeta de UI que se lee).
- Patrón: cámara (1–3 s) → b-roll a pantalla completa (1–3 s) → cámara. Alterna cada 1–2 frases.
- Silencios: **0** pausas de voz > 0,2 s a −45 dB. El habla va pegada, sin respiraciones (jump cuts).
- Primer plano a cámara antes de 1,5 s. Hook en el primer segundo con el texto clave más grande.

## 2. Subtítulos
- Fuente: grotesk sans geométrica, peso Bold (700) para texto normal, Black/ExtraBold (800–900) para la palabra destacada. [SUPOSICIÓN: Satoshi / General Sans; sustituto disponible en Google Fonts: **Inter Tight**]
- Tamaño línea normal: **≈48 px** (altura de minúscula ≈24 px).
- Tamaño palabra destacada: **≈110–130 px** (≈2,4× la línea normal).
- Posición sobre cámara: centrado horizontal, línea normal con su parte superior en **y ≈ 215 px** (11 % de la altura); palabra destacada justo debajo, **y ≈ 290–330 px**. Nunca tapa la cara.
- Posición sobre b-roll blanco: misma columna centrada, en **y ≈ 1400–1560 px** (debajo de la tarjeta) o arriba si la tarjeta ocupa la mitad inferior.
- Palabras por bloque: **2–5** en la línea normal + **0 o 1** palabra destacada. Un bloque dura lo que dura la frase (≈0,8–2 s).
- Animación de entrada por palabra (aditiva, palabra a palabra sincronizada con la voz): blur **8 px → 0** y opacidad **0 → 1** en **2 fotogramas (66 ms)**. Las palabras se colocan en su posición final del bloque ya centrado (la línea no se recentra al crecer).
- Palabra destacada: entra con blur **14 px → 0**, opacidad 0 → 1 y escala **1,08 → 1** en **4 fotogramas (≈130 ms)**.
- Salida del bloque: blur 0 → 10 px + opacidad 1 → 0 en **3 fotogramas (100 ms)**, todo el bloque a la vez.
- Color sobre cámara: texto **#FFFFFF**, sombra suave `0 2px 12px rgba(0,0,0,0.35)`. Palabra destacada: **#FFFFFF**.
- Color sobre fondo blanco: texto **#111111**, palabra destacada **#0051FF**. Palabras "de relleno" a veces en gris **#9AA0AA**.
- Palabra destacada = sustantivo/número/verbo clave de la frase (ej.: "editado", "IA", "fácil", "valor", "colores", "5.000 €").
- Variante de acento [refA]: palabra en serif itálica azul (ej. "un área completa") — 1 vez por vídeo como máximo.

## 3. Textos en pantalla (no subtítulos)
- Etiquetas tipo "píldora": fondo **#111111**, texto blanco en monoespaciada mayúsculas **≈26 px**, tracking +1 px, radio 999 px, punto azul **#0051FF** de 8 px a la izquierda (ej. "VÍDEO 3 · ESTE TAMBIÉN", "HAZ CAPTURA").
- Etiquetas monoespaciadas grises sin fondo, **≈22 px**, color **#8A8F99**, mayúsculas (ej. "TICKET 01", "AUTOMATIZACIONES", "TODA LA INFORMACIÓN DE LA EMPRESA"). [SUPOSICIÓN fuente: JetBrains Mono]
- Tarjetas UI: fondo **#FFFFFF**, radio **24–28 px**, sombra `0 20px 60px rgba(20,40,120,0.12)`, borde 1 px **#EEF0F5**, padding 24–32 px.
- Listas numeradas: círculo azul **#0051FF** 44 px con número blanco + texto 40 px negro dentro de una tarjeta.

## 4. B-roll
- Proporción en refB: **≈50 %** del tiempo es b-roll a pantalla completa; en refA **≈40 %**.
- Tipo: gráficos UI animados (tarjetas, diagramas de nodos, barras, iconos de apps, terminal, móvil con la app). No usa stock footage.
- Fondo del b-roll: **#FBFAFD** con 2 manchas radiales azules difuminadas (**#D3E0FE**, radio ≈600 px, blur ≈150 px) en esquina superior derecha e inferior izquierda.
- Cámara dentro de b-roll: a veces el vídeo a cámara aparece dentro de una tarjeta con radio 28 px, ancho ≈56 % (≈605 px).
- Elementos del b-roll entran escalonados cada **4–6 fotogramas**.

## 5. Transiciones
- Entre cámara y b-roll: **corte seco** (0 fotogramas). No hay fundidos, ni wipes, ni whooshes visuales.
- Elementos dentro del b-roll: entrada con blur 10 → 0 px + opacidad 0 → 1 + translateY 20 → 0 px en **6–8 fotogramas**, curva ease-out (spring sin rebote, damping ≈200).
- Salida de elementos: opacidad 1 → 0 + blur 0 → 8 px en **4 fotogramas**.

## 6. Zooms
- Jump cut en cámara alterna escala **100 % ↔ 115 %** (punch-in) en cada corte de silencio. Medido en refB entre t=5,0 s y t=5,6 s.
- Dentro del plano: empuje lento **100 % → 104 %** a lo largo del plano. [SUPOSICIÓN: lineal]
- Punto de anclaje del zoom: la cara (≈ y 40 % del cuadro).

## 7. Color
- Cámara: sin LUT agresivo, tonos naturales, contraste suave. Saturación ≈ original. [SUPOSICIÓN: ligera subida de exposición +0,1]
- Paleta gráfica: blanco **#FBFAFD**, negro **#111111**, azul de marca **#0051FF**, azul suave **#D3E0FE**, gris **#8A8F99**. Un solo color de acento.

## 8. Sonido
- Voz: **−18,7 LUFS** integrados (refB), **−18,9 LUFS** (refA). RMS ≈ −18,5 dB.
- Suelo bajo la voz: **−36 a −42 dB** sin silencios → hay cama musical continua muy baja. [SUPOSICIÓN: música a ≈ −28 / −32 LUFS, ≈12 dB por debajo de la voz]
- Efectos: [SUPOSICIÓN] "pop"/"click" suave al aparecer tarjetas; no se aprecian whooshes fuertes.

---

## Correcciones aprobadas
- **v2 · Paleta:** usar la paleta clara de la referencia (fondo #FBFAFD + manchas #D3E0FE, texto #111111, acento #0051FF). No usar la paleta oscura/roja.
- **v2 · Audio:** solo el audio original del vídeo. **Nunca** música ni audio externo.
- **v2 · Marcas de agua:** ninguna. Recortar las del material de origen (TikTok, números grabados) y no añadir textos de marca propios encima (nada de "SINLIMITESLIFE" en el vídeo).
- **v2 · Espacio:** zona útil y 130–1360 en planos de cámara (subtítulos arriba en y 130, tarjeta de cámara cuadrada 920 px en y 440, progreso debajo). En b-roll, contenido centrado en y 330–1330 y subtítulos en y 1370. Los 380 px inferiores quedan libres (interfaz de TikTok).
- **v2 · Acento tipográfico:** serif cursiva azul (Instrument Serif Italic) para frases de apoyo dentro del b-roll.

---

# Estilo B — motion graphics "foco azul" (refC f9e65181, refD dd1085e4)

## Ritmo
- refC: cambio de plano cada **≈1,1 s** (54 cortes en 59,5 s). refD: cada **≈2,0 s**.
- Proporción: **≈65 % ilustración / 35 % cámara** (refC). Ilustraciones seguidas sin volver a cámara son normales.

## Ilustraciones
- Fondo: degradado radial **#0A2A66 → #051333 → #02060F**, centrado arriba.
- **Foco cenital**: cono de luz trapezoidal desde el centro superior (blanco-cian **rgba(110,200,255,0.55)** → transparente), con fuente brillante arriba y elipse de luz en el suelo + línea de horizonte fina.
- Ilustración plana **azul monocroma** (rampa #030A1E → #08286E → #145FDC → #46A5FF → #CDF0FF) con brillo `drop-shadow(0 0 40px rgba(40,150,255,0.75))`. Principal centrada (≈520–620 px, y≈1010) flotando ±12 px; 2–4 objetos secundarios alrededor (150–250 px) con parallax, los lejanos desenfocados 3 px.
- Formas orgánicas azules (#1C78FF → #0A3FA8) en las esquinas, girando despacio. Partículas de polvo dentro del foco. Lluvia diagonal 18° en frases negativas.
- Entrada de objetos escalonada cada 3 fotogramas, escala 0,4 → 1 con rebote ligero.
- Prohibido: aro cian con barra a −45°, centro transparente, entra girando −25° → 0°.
- Empuje lento de toda la escena 1,00 → 1,06.

## Transiciones
- Cámara → ilustración: **destello blanco-cian** (pico 0,9) de 2 fotogramas antes a 5 después del corte; la ilustración entra con desenfoque **22 → 0 px** y escala **1,14 → 1** en 8 fotogramas.
- Ilustración → cámara: destello suave (0,45); cámara desenfoque **16 → 0 px**, escala **1,10 → 1** en 6 fotogramas.

## Subtítulos (mecánica de v2 aprobada + tipografía de refC)
- Fuente **Poppins**. Línea: 600, **54 px**, blanca con brillo `0 0 22px rgba(120,190,255,0.55)`.
- Palabra destacada: **Poppins 900 cursiva, MAYÚSCULAS, 122 px**, degradado **#B8F6FF → #3BE3FF → #0A7BFF**, brillo cian; entra con escala 1,3 → 1 y desenfoque 16 → 0 en 4–5 fotogramas.
- Posición: en ilustración **y = 280** (dentro del foco); en cámara **y = 1150** (sobre el pecho).

## Cámara
- A pantalla completa: fondo = el mismo plano desenfocado (40 px, brillo 0,22); delante, el plano nítido 1080 px fundido arriba y abajo con máscara; viñeta radial.

## Sonido — librería `@wubbleai/community-sfx` (CC0, 936 sonidos en 12 estilos; copias en `public/sfx/lib/`)
- Corte a ilustración: **cinematic/swipe** (vol 0,55), empieza 3 fotogramas antes del corte.
- Corte a cámara: **scifi/swipe** (0,40), 3 fotogramas antes.
- Cada palabra destacada: **scifi/snap** (0,38) en el fotograma exacto de la palabra.
- Señal de prohibido: **cinematic/drop** (0,50) cuando cae la señal (fotograma 8 de la escena).
- Inicio: **cinematic/start** (0,50). Cierre ("redes sociales"): **cinematic/achievement** (0,45).
- Sin música. Mezcla final ≈ −18 LUFS, pico ≤ −0,5 dBFS.

---

# Estilo C — "Product motion" premium (5 refs: Claude, Spotify 2.0, Portfolio, Opal, Apple-style UI)

Fuentes: v1 5804b7c5 (14,2 s), v2 681bb645 (16,1 s), v3 9e133b28 (24,2 s), v4 c77047b5 (12,0 s), v5 c7ace7d9 (33,0 s). Todas 16:9 y sin persona en cámara.

## Concepto
- La **interfaz es la protagonista**: tarjetas, píldoras, contadores, campos de texto, iconos de app, móviles. Cuenta una historia de producto en 12–33 s y termina en **logo + frase**.
- **Plano secuencia**: casi sin cortes (v1, v2, v4, v5: 0–1 cortes). Las escenas cambian moviendo la cámara (dolly, giro 3D, zoom a través de un elemento) o **transformando** un elemento en el siguiente (morphing). v3 sí corta (cada 1,5 s) con destellos blancos.
- Ritmo de "evento" cada **0,5–1,2 s**: siempre está pasando algo, nunca hay un fotograma quieto.

## Color y luz
- Fondo casi negro **#0A0A0C–#121214**, nunca negro puro; una sola **luz suave de color** desde arriba o una esquina (degradado radial muy difuminado) + viñeta.
- **Un único color de acento por pieza**: naranja Claude **#E8552C→#FF8A3D** (v1), verde Spotify **#1ED760** (v2), lila-gris **#B9AEDB** (v4), rojo-naranja **#FF4A1C** (v3), azul iOS **#0A84FF** (v5). El resto en blanco y grises.
- Los elementos activos **brillan**: borde de 1–2 px con resplandor del acento (blur 20–40 px). Estados de alerta con halo rojo **#E0242A**.
- v5 usa la variante clara: fondo **#F2F2F4**, tarjetas blancas y sombras suaves.

## Tipografía
- Sans neutra tipo **SF Pro / Inter**, pesos 400–600, tamaños pequeños (frases ≈ 3–4 % de la altura). Títulos de marca más grandes (≈ 8–10 %).
- Texto que entra **letra a letra con desenfoque** (cada letra 2–3 fotogramas, desenfoque 6 → 0 px) o como **máquina de escribir** dentro de un campo de texto con cursor.
- Una palabra clave de la frase en el color de acento ("portfolio", "blue", "playing", "Portofolio", "life").

## Movimiento
- Curvas: entradas **ease-out fuerte** (tipo spring sin rebote); los elementos llegan rápido y frenan largo. Contadores: 0 → 67 en ≈ 0,8 s desacelerando (41, 51, 57, 62, 65, 66, 67).
- **Desenfoque de movimiento** marcado en todo lo que se mueve rápido (estelas horizontales o verticales).
- **3D real**: tarjetas y pantallas inclinadas 20–35° en X/Y con perspectiva, cámara que vuela entre ellas; profundidad de campo (lo lejano desenfocado).
- Aparición de elementos: escala 0,85 → 1 + desenfoque 12 → 0 + opacidad, escalonada 3–5 fotogramas entre hermanos.
- Morphing: una píldora se estira hasta convertirse en un campo o tarjeta; un icono se pixela/glitch y se convierte en candado.
- Interacciones simuladas: **cursor** que pulsa (la píldora se hunde a 0,95 y vuelve), toggles, botones "Start".
- Partículas o pixel-glitch solo como transición puntual (v4: TikTok → candado).

## Composición
- Un foco por plano, centrado o en tercios; mucho aire negativo. Los elementos secundarios se reparten en filas o abanico (3 píldoras, 3 tarjetas).
- Cierre: 1–2 s de **logo** con un brillo leve + frase corta ("Create anything.").

## Sonido
- Música electrónica suave y efectos UI (clics, whooshes cortos, "ticks" en contadores) sincronizados con cada evento. [SUPOSICIÓN: los efectos van alineados a cada aparición/pulsación]

## Adaptación a 9:16 (pendiente de confirmar)
- Las piezas son horizontales: para TikTok se recompone en vertical (los elementos se apilan en columna, tamaños ×1,6).
