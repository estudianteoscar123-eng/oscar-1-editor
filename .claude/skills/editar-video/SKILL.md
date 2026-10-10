---
name: editar-video
description: Edita los videos verticales (Reels/TikTok) de @sinlimiteslife en su estilo premium aprobado, "Estilo F" — persona a cámara alternada con escenas ilustradas animadas, cada escena de un color distinto, subtítulos de dos niveles que nunca tocan la cara, destellos de luz entre cortes y cierre con monograma. Usa esta skill siempre que el usuario mande un video crudo para editar, pida "edita este video", "aplica el estilo", "hazlo como el anterior", un reel, un short o un TikTok, o quiera retomar o corregir una edición existente, aunque no nombre el estilo.
---

# Editar video en Estilo F

El usuario graba; tú haces todo lo demás: edición completa, revisión y título. Él publica. Cada video es nuevo (otro audio, otro contenido) pero el estilo es siempre el mismo. La meta es retención ≥ 85 %: que nunca haya un segundo muerto y que todo se vea premium, nunca genérico.

La referencia aprobada ("quedó increíble") es la composición **EE46F** en `video-editor/src/ee46f/`. Úsala como plantilla: está probada, renderiza bien y ya respeta todas las reglas de abajo. El detalle de estilo (paletas, tipografía, tiempos, transiciones, cómo diseñar escenas) está en `references/estilo-f.md`. Léelo antes de diseñar las escenas. El historial completo de estilos y correcciones está en `video-editor/estilo.md`.

## Reglas que el usuario fijó (no son negociables)

Cada una viene de una corrección explícita. Saltarse una arruina la pieza para él:

1. **Los subtítulos jamás tocan la cara.** Ni con el punch-in. Se pierde toda la estética. En el A-roll el texto va debajo del mentón; compruébalo en fotogramas reales, no lo supongas.
2. **Nada de amarillo**, ni dorado ni ámbar. Le parece feo.
3. **Las ilustraciones no son todas azules.** Cada escena tiene su propio color, sacado de sus paletas aprobadas (están en la referencia). No repitas un color en escenas seguidas.
4. **La palabra clave no siempre del mismo color:** 4 tonos que rotan en el A-roll, y en el B-roll el color de la escena.
5. **Sin filtros de pantalla completa** (grano, viñeta, brillo global). Un destello de 3–10 fotogramas en un corte sí vale, porque es una transición.
6. **Todo cambio de estilo necesita una razón** (posición, tamaño o color del texto). No varíes por variar.
7. **Nada genérico.** Sin partículas decorativas, sin anillos u órbitas, sin plantillas de stock.

## Flujo de trabajo

Habla con el usuario en español, en frases cortas. Si pregunta "¿ya?" a mitad del trabajo, dile en qué paso vas y cuánto falta.

### 1. Preparar el material

```bash
python3 -I .claude/skills/editar-video/scripts/prep_video.py <video> <slug>
```

Este script hace cuatro cosas:
- Normaliza la voz a −16 LUFS.
- Transcribe por palabra con Whisper. La primera vez instala el modelo desde npm, porque Hugging Face está bloqueado.
- Recorta y limpia el plano de cámara a 1200 px de alto.
- Guarda una hoja de contacto en `video-editor/analysis/<slug>/`.

Mira la hoja de contacto (`*-aroll.png`). Si quedan barras negras, títulos quemados, números o marcas de agua, corrige el recorte. Mide la franja limpia sobre el fotograma original (`*-source.png`) y vuelve a correr con `--crop W:H:X:Y --solo-aroll`. El auto-recorte solo quita barras negras, no texto.

### 2. Corregir la transcripción

Whisper se equivoca con palabras habladas rápido ("Acostúmete" por "Acostúmbrate", "quieres" por "que eres"). Lee la transcripción completa y corrige el campo `text` en `public/<slug>/data.json` sin tocar los tiempos. Para unir dos palabras en una, pon el texto en la primera y deja `""` en la segunda: los subtítulos saltan las vacías.

### 3. Crear la composición desde la plantilla

```bash
python3 -I .claude/skills/editar-video/scripts/new_edit.py <slug> <Componente>
```

Copia `src/ee46f` a `src/<slug>`, apunta las rutas y la duración, y lo registra en `Root.tsx`. Después reescribe lo que es propio del video:

- **`timeline.ts`**
  - `CUTS`: dónde cortar, A-roll o escena, y con qué índice de palabra.
  - `GROUPS`: subtítulos y punch-ins.
  - `CHAPTERS` y el mapa `SCENE_PAL`.
  - El tipo `SceneId`.
- **`Scenes.tsx`**: una escena ilustrada por idea, con metáforas visuales del guion. Reutiliza `Shell`, `Tilt`, `popSvg` y las figuras y objetos de `shapes.tsx`.
- **`Main.tsx`**
  - El texto de la tarjeta de cristal: título de la serie y total del contador `/09`.
  - El monograma del cierre.
  - En `ARoll`: `width` del `<Video>` y del contenedor (el ancho real de `aroll.mp4`), `left` para centrar la cara, y `transformOrigin` sobre la cara para que el punch-in acerque hacia ella.

Planifica antes de escribir: lee el guion entero, sepáralo en ideas, decide qué va a cámara (el gancho, las frases con emoción, el cierre) y qué va a escena ilustrada (todo lo que se pueda mostrar). Asigna un color a cada escena.

### 4. Vista previa y revisión

```bash
cd video-editor && npx tsc --noEmit -p . && npx remotion render src/index.ts <Componente> output/<slug>-preview.mp4 --codec=h264 --crf=23 --scale=0.5
```

Saca una hoja de contacto de unos 20 fotogramas repartidos, más los fotogramas justo antes y después de cada corte, y míralos de verdad. Revisa sobre todo:
- Que el texto nunca toque la cara, también durante el punch-in.
- Que haya espacio entre las palabras clave y que ningún texto se salga del ancho.
- Que las figuras se vean naturales: brazos colgando, no en jarra.
- Que los objetos no se encimen con el texto ni entre sí.
- Que ninguna escena se vea vacía o genérica.

Corrige y vuelve a mirar. No entregues lo que no viste.

### 5. Render final y entrega

```bash
npx remotion render src/index.ts <Componente> output/<slug>-edit.mp4 --codec=h264 --crf=18
```

El render tarda unos 8 minutos para 30 segundos; córrelo en segundo plano y avisa. Después:
- Comprueba el volumen (`ffmpeg -af loudnorm=print_format=summary`). Debe dar entre −14 y −16 LUFS, con pico por debajo de −1 dBTP.
- Comprueba el tamaño. Si pasa de 30 MB, haz una copia con `-crf 22`.
- Envía el archivo con `SendUserFile` y `display: "render"`.
- Haz commit y push del código: `src/<slug>`, `Root.tsx` y `public/<slug>/data.json`. Añade `public/<slug>/*.mp4` y `*.wav` al `.gitignore` de `video-editor/`, porque son derivados.

### 6. Mensaje final

En pocas líneas:
- Qué se hizo y por qué: escenas y colores, punch-ins, transiciones.
- Qué decidiste por tu cuenta, como recortes o palabras corregidas.
- Límites honestos, por ejemplo una fuente de baja calidad.
- Un **título** para la publicación, pensado para su cuenta. `video-editor/instagram-sinlimiteslife.md` tiene lo que funcionó en su perfil.

Termina preguntando qué ajustaría.
