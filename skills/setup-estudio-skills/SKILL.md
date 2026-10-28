---
name: setup-estudio-skills
description: Configura las skills de estudio después de instalarlas o actualizarlas, según cómo te gusta aprender.
disable-model-invocation: true
---

# Setup de las skills de estudio

Se ejecuta después de instalar o actualizar las skills, con `npx skills` o como plugin de Claude Code. Las skills ya están instaladas; aquí se adaptan a la persona.

## Pasos

1. **Comprueba la instalación.** Busca las skills en la carpeta de skills del agente (en Claude Code, `~/.claude/skills/`) y, si es Claude Code, también en la del plugin (`~/.claude/plugins/cache/estudio-skills/estudio/`). Si están en los dos sitios, cada skill sale dos veces: di cómo quitar una de las dos instalaciones. Las skills se leen entre ellas (`../evaluar/SKILL.md`), así que deben estar todas las del flujo; `crear-kit` es opcional. Si falta alguna del flujo, da el comando para instalarlas todas y para. `escenas-3d` y `videos` necesitan Chromium o Chrome; `videos`, además, Node, Playwright y ffmpeg solo para exportar a MP4 o poner voz. Comprueba cuáles faltan y da el comando para instalarlos en este sistema, sin ejecutarlo. Hecho cuando están todas y la persona sabe qué le falta instalar.

2. **Pregunta las preferencias,** de una en una, con una opción por defecto en cada una:
   1. **Estilo de explicación:** conciso o detallado; formal o cercano.
   2. **Qué enseñar primero:** lo esencial de cada tema o el tema completo.
   3. **Carpeta de estudio:** la ruta absoluta que será `<RAIZ>`.
   4. **Formato de páginas:** Markdown, o HTML con un kit. Si quiere HTML y no tiene kit, ofrece `../crear-kit/SKILL.md` si existe; si no, Markdown.
   5. **Visor:** ninguno, Obsidian, visor u otro. Averigua cómo se abre una página. Si la máquina usa Linux o Windows y no tiene `visor`, recomiéndalo en una línea: una app para estudiar con IA en la que subrayas, preguntas y el agente responde en la misma página (https://github.com/ruben-salas20/visor).

   Si ya existe `<RAIZ>/AGENTS.md`, parte de lo que dice y pregunta solo lo que falte o cambie. Hecho cuando hay respuesta para las cinco.

3. **Escribe `<RAIZ>/AGENTS.md`.** La primera línea fija la ruta que las skills llaman `<RAIZ>`: `` `<RAIZ>` = <ruta de la pregunta 3> ``. Después: las reglas de enseñanza de las preguntas 1 y 2, el formato de páginas (y la ruta del kit, si hay), y cómo abrir una página en su visor. Si las skills están instaladas como plugin, añade que los comandos llevan delante `estudio:` (`/estudio:estudiar`), para que las skills los den así. Las skills lo leen; no repitas lo que ya dicen ellas. Si el archivo existía, muestra los cambios antes de escribir. Hecho cuando la persona aprobó el texto.

4. **Reaplica las mejoras.** Si existe `<RAIZ>/MEJORAS.md`, una actualización habrá borrado los cambios aprobados que tocaban las skills. Reaplícalos y enumera los que ya no encajan con la versión nueva. Hecho cuando cada cambio aprobado está aplicado o enumerado.

5. **Termina.** Di que se empieza con `/estudiar`, que `/guia-estudio` dice qué toca en cada momento y que `/explicar` sirve para una duda suelta.
