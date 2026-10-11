---
name: clase-a-tema
description: Convierte el material de una clase (transcripción o apuntes) en páginas de tema, una por concepto, y las estudias.
disable-model-invocation: true
---

# Clase a tema

Para cursos de una institución. La fuente es la clase: lo que dijo el docente manda sobre cualquier otra fuente. Empieza en una sesión nueva.

## Pasos

1. **Sitúate.** Lee `<RAIZ>/AGENTS.md`, `MISION.md` y los `NOTAS.md` de la materia. Si hay páginas de esta materia con `estado: nuevo`, una sesión anterior quedó a medias: ofrece retomarlas en el paso 6. El material es el que indica el argumento; si no hay, enumera el de `_Inbox/` del periodo para esta materia y pregunta. Hecho cuando hay material o páginas que retomar.

2. **Ofrece los repasos vencidos** con el paso 2 de `../estudiar/SKILL.md`. Hecho cuando no hay o la persona eligió.

3. **Saca los conceptos.** Lee el material entero y enumera los conceptos que enseña la clase. Para cada uno, busca en `Temas/` si ya tiene página: si la tiene, se amplía; si no, se crea. Junta también:
   - **errores de transcripción** evidentes, con su corrección;
   - **imprecisiones** del material: lo que parece incorrecto o incompleto, con el motivo.

   Muéstralo todo. Hecho cuando la persona confirma la lista de conceptos.

4. **Guarda el material** en `Recursos/AAAA-MM-DD — Clase — <tema>.md`, con la fecha de la clase y los errores de transcripción corregidos. Sácalo de `_Inbox/`. Hecho cuando está en `Recursos/` y no en `_Inbox/`.

5. **Escribe las páginas,** una por concepto, en `Temas/` y en el formato del curso, antes de estudiar ninguna.
   - Numera como las páginas que ya existen (por ejemplo, la unidad del temario: `U1.4`). Si no hay ninguna, pregunta el temario.
   - Cuenta lo que dijo la clase y cítala. Lo que añadas de otra fuente se marca como añadido. Cada imprecisión va en un aviso, junto a lo que dijo el docente: la persona decide.
   - Enlaza lo que ya tiene página en vez de repetirlo.
   - Termina con 2 o 3 preguntas de repaso que no se respondan copiando una línea.
   - Metadatos: `estado: nuevo` y `repasar` vacío.
   - Enlázalas desde el índice de la materia.

   Hecho cuando cada concepto confirmado tiene su página, enlazada desde el índice.

6. **Estudia y evalúa cada página** con los pasos 5 y 6 de `../estudiar-fase/SKILL.md`. Hecho cuando cada página está evaluada o la sesión se cierra.

7. **Cierra la sesión.** Si quedan páginas con `estado: nuevo` y la sesión ya es larga, termina y di que se retoman con `/clase-a-tema` en una sesión nueva.
