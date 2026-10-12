---
name: setup-estudio-skills
description: Configura las skills de estudio después de instalarlas o actualizarlas, según cómo te gusta aprender.
disable-model-invocation: true
---

# Setup de las skills de estudio

Se ejecuta después de `npx skills add` o `npx skills update`. Las skills ya están instaladas; aquí se adaptan a la persona.

## Pasos

1. **Comprueba la instalación.** Busca la carpeta de skills del agente (en Claude Code, `~/.claude/skills/`). Las skills se leen entre ellas (`../evaluar/SKILL.md`), así que deben estar todas las del flujo; `crear-kit`, `videos` y `escenas-3d` son opcionales. Si falta alguna del flujo, da el comando para instalarlas todas y para. Si está `videos`, necesita Node, Playwright, Chromium y ffmpeg; si está `escenas-3d`, Node 22 o superior y Chromium o Chrome. Comprueba cuáles faltan y da el comando para instalarlos en este sistema, sin ejecutarlo. Hecho cuando están todas y la persona sabe qué falta para las opcionales que tiene.

2. **Pregunta las preferencias,** de una en una, con una opción por defecto en cada una:
   1. **Estilo de explicación:** conciso o detallado; formal o cercano.
   2. **Qué enseñar primero:** lo esencial de cada tema o el tema completo.
   3. **Carpeta de estudio:** la ruta absoluta que será `<RAIZ>`.
   4. **Formato de páginas:** Markdown, o HTML con un kit. Si quiere HTML y no tiene kit, ofrece `../crear-kit/SKILL.md` si existe; si no, Markdown.
   5. **Visor:** ninguno, Obsidian, visor u otro. Averigua cómo se abre una página. Si la máquina usa Linux con Wayland y no tiene `visor`, recomiéndalo en una línea: una app para estudiar con IA en la que subrayas, preguntas y el agente responde en la misma página (https://github.com/ruben-salas20/visor).

   Si ya existe `<RAIZ>/AGENTS.md`, parte de lo que dice y pregunta solo lo que falte o cambie. Hecho cuando hay respuesta para las cinco.

3. **Escribe `<RAIZ>/AGENTS.md`.** La primera línea fija la ruta que las skills llaman `<RAIZ>`: `` `<RAIZ>` = <ruta de la pregunta 3> ``. Después: las reglas de enseñanza de las preguntas 1 y 2, el formato de páginas (y la ruta del kit, si hay), y cómo abrir una página en su visor. Las skills lo leen; no repitas lo que ya dicen ellas. Si el archivo existía, muestra los cambios antes de escribir. Hecho cuando la persona aprobó el texto.

4. **Reaplica las mejoras.** Si existe `<RAIZ>/MEJORAS.md`, una actualización habrá borrado los cambios aprobados que tocaban las skills. Reaplícalos y enumera los que ya no encajan con la versión nueva. Hecho cuando cada cambio aprobado está aplicado o enumerado.

5. **Termina.** Di que se empieza con `/estudiar`, que `/guia-estudio` dice qué toca en cada momento y que `/explicar` sirve para una duda suelta.
