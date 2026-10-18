---
name: profundo-setup
description: Prepara un estudio a fondo. Crea la carpeta del curso o la materia, su índice, MISION.md y NOTAS.md.
disable-model-invocation: true
---

# Profundo setup

Crea el sitio donde vivirá un estudio a fondo. Cada skill posterior crea sus propias carpetas (`Temas/`, `Recursos/`, `Evaluaciones/`…) la primera vez que escribe en ellas; aquí solo se crea lo que se usa desde el principio.

## Pasos

1. **Consigue la ficha.** Viene de `/estudiar` en esta conversación. Si no está, hazla con el paso 3 (**Haz la ficha**) de `../estudiar/SKILL.md`. Hecho cuando tienes los cinco campos confirmados.

2. **Elige el sitio.** Mira cómo está organizada `<RAIZ>` y sigue ese patrón. Si está vacía:
   - **Fuente institución:** `<RAIZ>/Institucion/<periodo>/<Materia>/`, con `_Inbox/` en la carpeta del periodo para el material de clase. Pregunta el periodo si no lo sabes.
   - **Otra fuente:** `<RAIZ>/Autodidacta/<Curso>/`.

   Si la carpeta ya existe, muestra qué contiene y pregunta si se actualiza su `MISION.md` o se elige otro nombre. Hecho cuando la persona confirma la ruta.

3. **Crea la carpeta y su índice.** El índice se llama como la carpeta y tiene el formato de los demás índices de `<RAIZ>`; si no hay ninguno, Markdown. Enlázalo desde el índice de nivel superior (el del periodo o el del área), si existe. Hecho cuando el índice existe y el superior, si lo hay, lo enlaza.

4. **Escribe los documentos.**
   - `MISION.md`: los cinco campos de la ficha, uno por línea, y la fecha de hoy.
   - **Notas:** lo que valga para cualquier tema va a `<RAIZ>/NOTAS.md`; lo propio de este curso, a su `NOTAS.md`. Crea cada archivo solo si tiene algo que guardar.

   Hecho cuando todo lo que `/estudiar` averiguó está en uno de estos archivos.

5. **Pasa a la skill siguiente.**
   - **Fuente institución:** termina. Di que cada clase se procesa con `/clase-a-tema` en una sesión nueva: abierta en la carpeta del curso (di su ruta) o con el curso como argumento, `/clase-a-tema <curso>`.
   - **Otra fuente:** lee `../indagar/SKILL.md` y síguelo.
