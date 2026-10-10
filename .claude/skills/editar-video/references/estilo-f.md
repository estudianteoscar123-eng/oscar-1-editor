# Estilo F — especificación

Basado en dos referencias aprobadas (talking head + B-roll ilustrado con luz), con los cambios del usuario: colores variados en lugar de todo azul, nada de amarillo, nada que tape la cara. Los valores concretos salen de la edición aprobada `video-editor/src/ee46f/`.

## Contenido
1. Estructura y ritmo
2. Plano de cámara (A-roll)
3. Escenas ilustradas (B-roll)
4. Color
5. Subtítulos
6. Transiciones y sonido
7. Elementos fijos y cierre

## 1. Estructura y ritmo

- Alterna A-roll (la persona a cámara) con escenas ilustradas a pantalla completa. Un cambio cada **1,5–4 s**; ninguna escena de más de ~4 s. En EE46F, 33 s llevan 6 bloques de cámara y 7 escenas.
- El primer segundo es el gancho: la persona a cámara con la palabra clave enorme ("Ponte en / FORMA"), y enseguida el primer corte a escena.
- Para la cámara: el gancho, las frases con carga emocional o mirada a cámara ("Acostúmbrate a ser EL LOCO", "DI NO"), y la frase final.
- Para escena ilustrada: todo lo que se puede **mostrar** (un hábito, un objeto, una situación, una comparación).
- Los cortes caen **2 fotogramas antes** de la primera palabra del bloque (`wf(i) - 2`), para que la imagen llegue con la palabra.
- Si el guion es una lista, hay un contador de capítulos (01/09) en la tarjeta de arriba: le dice al espectador cuánto falta y sostiene la retención.

## 2. Plano de cámara (A-roll)

- La cámara va en una **ventana** de 1080×1200 en `top: 250`. Sus bordes superior e inferior se funden con el fondo mediante `mask-image` (0 → 9 % y 70 → 100 %). Así la parte baja queda oscura para el texto, aunque la camiseta sea clara.
- Si la fuente es de baja calidad, `prep_video.py` aplica limpieza suave (hqdn3d), lanczos y nitidez (cas). No agregues filtros de color.
- Movimiento:
  - Empuje lento continuo de 1 a 1,045 dentro de cada bloque.
  - Punch-in en seco al cambiar de grupo de subtítulos: 1,0 / 1,06 / 1,1 / 1,16, alternando para que dos grupos seguidos no tengan el mismo encuadre.
  - Al entrar desde una escena, desenfoque de 12 a 0 px y escala de 1,06 a 1 en unos 8 fotogramas.
  - Al salir, escala ×1,05 y desenfoque de 7 px en los últimos 5 fotogramas.
- `transformOrigin` del zoom: sobre la cara. Así el punch-in acerca la cara y el mentón no baja hacia el texto.
- **La cara nunca se tapa.** Los subtítulos del A-roll empiezan en `top: 1392`, por debajo del mentón. Si la cara de un video nuevo queda más baja, sube la ventana o baja el texto, y compruébalo con fotogramas.

## 3. Escenas ilustradas (B-roll)

Ilustración plana **monocroma**: cada escena usa solo tonos de su color, con un brillo suave (bloom). Va sobre un fondo casi negro teñido de ese color, con un **cono de luz cenital** y el suelo iluminado. El componente `Shell` de `Scenes.tsx` ya hace todo esto, además del empuje de cámara (1 → 1,07) y la salida desenfocada.

Cómo diseñar una escena:
- **Una metáfora visual clara por idea**, sacada del guion. Ejemplos aprobados:
  - Porno: un móvil con "18+" y un anillo de prohibido que se dibuja.
  - No contar tus metas: una persona con el dedo en la boca, la meta dentro de un pensamiento y un candado que se cierra en la burbuja de diálogo.
  - Salir del grupo: el grupo apagado con iconos de malos hábitos encima, y tú caminando hacia una puerta de luz.
  - Ser quien quieres ser: tú frente a un espejo con tu versión ideal, unidos por una línea de alineación que se dibuja.
  - Te ven como un loco: una persona entrenando bajo el foco mientras se abren ojos en la oscuridad.
  - Planes que no suman: un calendario 3D con cruces que se estampan y un signo menos.
  - Nada de móvil al despertar: amanecer, el móvil bloqueado y un reloj que barre 2 horas en rojo.
- **Las cosas pasan con la palabra.** Cada elemento importante aparece o actúa en el fotograma de la palabra que lo nombra: `at(i, from)` da el fotograma local de la palabra i. Ese sincronismo es lo que hace que se vea profesional.
- **Profundidad:** objetos del fondo pequeños y desenfocados (4–9 px, opacidad 0,45–0,7), el sujeto nítido y en el centro. Algunos objetos van inclinados en 3D real con `Tilt` (rotateX/rotateY de 6–28°).
- **Movimiento suave constante:** flotación senoidal (`float`, ±6–10 px), entradas con `popSvg` (escala 0,8 → 1 con leve rebote y desenfoque 10 → 0), y acciones repetidas como caminar o levantar pesas.
- **Composición:** el texto va en el tercio superior (`top: 330`) y la ilustración entre y = 800 y 1750. Nada importante debajo de 1800, donde va la marca de agua.

### Piezas disponibles en `shapes.tsx`

- `Figure`: persona sin rostro, como en las referencias, con los pies en (x, y) y escala `s`. Las poses se dan por posición de las manos (cinemática inversa):
  - `stand`: brazos colgando; es la natural.
  - `phone`: manos al pecho, con el móvil.
  - `lift`: brazos arriba, con pesa.
  - `hips`: manos en la cintura; transmite seguridad.
  - `hush`: dedo en la boca.
  - `point`: señala.
  - `cross`: brazos cruzados.

  Acepta `o` (opacidad, para figuras apagadas), `flip`, `lean` y `step` (para caminar), y objetos en las manos como `children`. Para poses nuevas, pasa `{ l: [x, y], r: [x, y] }`. La cabeza está en y ≈ −536 y la cintura en −278. Si las manos se ponen más arriba de la cintura con los codos hacia fuera, se ve "en jarra"; para que cuelguen, usa manos en (±124, −198).
- Objetos: `Phone`, `Bubble`, `Lock` (con `open` para el candado abierto), `Target`, `Eye` (con `open` para el parpadeo), `Dumbbell`, `Bottle`, `Cig`, `Dice` y `Clock` (con `arc` para el arco de horas).
- `Defs` define los degradados por escena (`#<id>-skin`, `-shirt`, `-pants`, `-obj`, `-dark`, `-screen`) y el filtro `#<id>-glow`. Usa un `id` corto y distinto en cada escena.

Si una idea necesita un objeto nuevo, dibújalo con el mismo lenguaje: formas redondeadas, monocromo con degradado de claro arriba a oscuro abajo, y brillo.

### Trampas conocidas
- En un mismo `<g>` no combines `style={popSvg(...)}` con el atributo `filter=url(#…-glow)`: el `filter` del CSS anula el del SVG. Envuelve: el `<g>` de fuera con `transform` y `filter`, el de dentro con el `style` del pop.
- Tampoco combines `transform="…"` con la propiedad CSS `scale` en el mismo `<g>`. Separa en dos grupos.

## 4. Color

Una paleta por escena y **nunca la misma en dos escenas seguidas**. Los colores salen de las paletas que el usuario aprobó: rojo y negro, Old Money, Elegant, azul nieve y verde bosque. `PAL` en `theme.ts`:

| clave | medio `m` | claro `l` | uso típico |
|---|---|---|---|
| red | #C40B11 | #F2595E | prohibición, alarma |
| indigo | #35339A | #A09CF4 | mente, secretos, metas |
| steel | #2B5B7E | #A6C9E0 | entorno social, frío |
| green | #2C7411 | #9DD65A | crecimiento, futuro yo |
| slate | #3C6264 | #B7D5D2 | foco, disciplina, calma |
| wine | #740A12 | #E36D73 | restar, perder, compromisos |
| silver | #55534F | #ECEAE3 (+ acento #E0242B) | mañana, tiempo, claridad |

- **Prohibido:** amarillo, dorado y ámbar. Puedes crear tonos nuevos derivados de las paletas aprobadas (por ejemplo, un azul medianoche #061D33 o un burdeos #640F12), pero nunca amarillos.
- **Palabras clave del A-roll:** 4 tonos rotando. Elige el tono que conecte con la escena vecina.
  - `crimson #E8383E`
  - `ice #CFE4EC`
  - `lime #A9D46C`
  - `lilac #A9A5F6`
- Texto base: `#F4F2EE`. Fondo: `#07080B`.

## 5. Subtítulos

- **Dos niveles:** una línea pequeña de contexto y la **palabra clave** debajo, grande.
  - Contexto: Inter Tight 600, 46 px en A-roll y 52 px en B-roll.
  - Palabra clave: Poppins 900 itálica en mayúsculas, de 78 a 140 px; el tamaño se ajusta solo al ancho de 930 px.
  - Si la palabra clave abre la frase ("DI NO / a todos los planes"), va arriba.
  - Variante en línea para frases sin un remate claro: palabras clave en itálica gruesa, en minúscula, 1,5 veces más grandes, dentro de la frase ("porque cuando te *enfocas* de verdad").
- Las palabras aparecen **una a una**: cada una espera en gris (34 %) 5 fotogramas antes y se enciende al pronunciarse. La palabra clave entra con impulso (escala 1,22 → 1, desenfoque 12 → 0, rebote suave) y un brillo blanco la recorre una vez.
- Relleno de la palabra clave: degradado de blanco al tono, con resplandor del tono al 50 % y sombra para que se lea sobre cualquier fondo.
- Posición: en A-roll debajo de la cara (`top: 1392`); en B-roll en el tercio superior (`top: 330`). Alineación centrada, o a la izquierda cuando la ilustración pesa a la derecha, como en "salir del grupo".
- Grupos de 3 a 9 palabras. El grupo termina donde empieza el siguiente. Si coincide con un corte, sale con **glitch** (5 franjas desplazadas más desenfoque en 5 fotogramas); si no, con un desenfoque rápido de 3 fotogramas.

## 6. Transiciones y sonido

- **Destello de luz** en cada corte: un degradado radial del color de la escena que entra, en modo screen. Sube en 3 fotogramas y baja en 10. Pico de 0,78 de cámara a escena, 0,6 entre escenas y 0,5 de escena a cámara.
- El A-roll entra desenfocado y la escena sale con zoom y desenfoque, como en el punto 2.
- Efectos de sonido (`public/sfx/`):
  - `whoosh` 8 fotogramas antes de cada corte, volumen 0,2.
  - `pop` en cada palabra clave, volumen 0,09.
  - `impact` en golpes visuales (sellos, tachones), volumen 0,16.
  - `tick` en relojes y contadores, volumen 0,07.
  - `shimmer` en el cierre, volumen 0,22.

  Siempre por debajo de la voz.
- Sin música por ahora (no hay biblioteca con licencia). Si el usuario manda una pista, ponla de fondo a −24/−28 LUFS por debajo de la voz.

## 7. Elementos fijos y cierre

- **Tarjeta de cristal** arriba (`top: 104`). Tiene fondo blanco al 7 %, borde al 16 %, `backdropFilter: blur(18px)` y forma de píldora. Lleva el título de la serie ("Sé un HOMBRE 10/10") y el contador del capítulo, que rueda hacia arriba al cambiar y toma el color de la escena.
- **Marca de agua** `@sinlimiteslife` abajo (a 64 px del borde inferior), en 24 px, con 38 % de opacidad.
- **Cierre** (cuando dice "sígueme…"): fondo negro, un círculo que se dibuja y el monograma "SL" en Instrument Serif itálica, trazado con línea que luego se rellena. Debajo, "SÍGUEME PARA MÁS" con espaciado de 10 px y el usuario.
