# Reglas de producción (fijas del usuario · ZK y SL)

## Entrega
- Siempre 2 videos por marca, entregados JUNTOS.
- Tiempo máximo: 15 minutos para los 2 videos, desde que llegan las voces/material hasta la entrega. Si se puede menos, mejor. No se alarga nunca.
- La calidad sigue siendo prioridad: se optimiza el proceso, no se baja el estándar.

## Cómo se cumple (proceso)
1. El plan de escenas de cada guion se arma ANTES de que llegue la voz (al entregar el guion): escenarios, objetos y planos por frase ya escritos.
2. Al llegar la voz: transcripción (~1 min) → ajuste de tiempos al plan (~2 min) → prueba de velocidad de 30 fotogramas → render.
3. Render rápido:
   - ZK Dark v2: sin desenfoque de capas (solo foco en 1–2 capas clave), grano y tinta con filtros estáticos, render a 720×1280 y escalado a 1080×1920 con lanczos + nitidez si hace falta. Objetivo ≤ 3 min por video.
   - SL: cortes con ffmpeg en paralelo + composición sin efectos pesados. Objetivo ≤ 3 min por video.
   - Un render a la vez con toda la máquina; nunca dos composiciones pesadas en paralelo.
4. Control de calidad automático antes de entregar (fotogramas, audio desde el fotograma 0, LUFS, duración).
