---
name: crear-kit
description: Crea tu kit de páginas HTML de estudio, con tus colores y solo los componentes que necesitas.
disable-model-invocation: true
---

# Crear kit

Hace el kit HTML de la persona a partir de `referencia/`. La referencia es neutra a propósito: el estilo sale de lo que la persona elige, no de la referencia.

## Pasos

1. **Lee la referencia.** `referencia/LEEME.md`, `kit.css` y `kit.js`. Hecho cuando sabes qué hace cada componente.

2. **Pregunta los gustos,** de una en una, con la opción de la referencia por defecto:
   - **Colores:** un color de acento y si quiere claro, oscuro o según el sistema.
   - **Letra:** la del sistema o una concreta.
   - **Ancho de lectura** y tamaño de letra.
   - **Componentes:** fórmulas, diagramas, avisos y repaso. Pregunta qué materias estudia y si alguna necesita algo propio (circuitos, gráficas con ejes, 3D…).

   Hecho cuando hay respuesta para las cuatro.

3. **Crea el kit** en `<RAIZ>/_kit/`: copia la referencia, cambia las variables de `kit.css` y quita los componentes que no quiere. Un componente propio de una materia se escribe la primera vez que una página lo necesite, no ahora: anótalo en `LEEME.md` como pendiente. Hecho cuando el kit tiene solo lo elegido.

4. **Escribe las rutas.** Mira cómo organiza `<RAIZ>` sus cursos y rellena en `LEEME.md` la tabla de la ruta relativa al kit desde cada tipo de carpeta (índice de curso, `Temas/`…). Hecho cuando cada carpeta que tendrá páginas tiene su ruta.

5. **Prueba.** Rellena `plantillas/tema.html` con un ejemplo que use cada componente elegido, ábrelo en el visor de la persona o en el navegador y pídele que lo mire en claro y en oscuro. Corrige hasta que le guste. Borra el ejemplo. Hecho cuando la persona aprueba cómo se ve.

6. **Vuelve** a `/setup-estudio-skills` si vienes de allí, con la ruta del kit para su `AGENTS.md`.
