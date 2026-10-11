---
name: estudiar-fase
description: Estudia el siguiente subtema del plan. Crea su página, la estudias y se evalúa.
disable-model-invocation: true
---

# Estudiar fase

Una sesión de estudio: uno o varios subtemas cortos de la fase en curso. Empieza en una sesión nueva; todo lo que necesitas está en los archivos del curso.

## Pasos

1. **Sitúate.** Lee `<RAIZ>/AGENTS.md`, `PLAN.md`, `MISION.md`, `BASES.md` y los `NOTAS.md`. El subtema es el primer `[ ]` del árbol, y la fase en curso, la suya: lee su archivo en `fases/`. Si ese subtema ya tiene página, la sesión anterior quedó a medias y se retoma. Hecho cuando dices fase y subtema en una línea.

2. **Ofrece los repasos vencidos** con el paso 2 de `../estudiar/SKILL.md`. Hecho cuando no hay o la persona eligió.

3. **Investiga la fase** si es su primera sesión, es decir, si ningún subtema de la fase tiene página. Lanza un subagente con `../indagar/investigar-fuentes.md`, limitado a los subtemas de esta fase y sus huecos, y espera su informe. Muestra los huecos y las contradicciones que traiga. Hecho cuando terminó o la fase ya estaba investigada.

4. **Escribe la página** `Temas/<n.m> <Subtema>`, en el formato del curso.
   - Antes, busca en `Temas/` lo que ya existe: lo que ya tiene página se enlaza, no se repite.
   - Persigue la **meta** del subtema en el archivo de la fase y apóyate en sus fuentes de `Recursos/`, citándolas.
   - Termina con 2 o 3 preguntas de repaso que no se respondan copiando una línea.
   - Metadatos: `estado: nuevo` y `repasar` vacío.
   - Enlázala desde el índice del curso.

   Hecho cuando la página está enlazada desde el índice y cada afirmación clave tiene su fuente o es razonamiento propio.

5. **Estudia la página con la persona.** Ábrela y deja que la lea. Responde sus dudas. Cuando una duda muestre que la página no se entiende, corrige la página además de responder. Lo que aprendas de cómo aprende va a `NOTAS.md`: lo general va a `<RAIZ>/NOTAS.md` y lo propio del curso, al suyo. Hecho cuando la persona dice que está lista.

6. **Evalúa.** Sigue `../evaluar/SKILL.md` y vuelve aquí con su resultado. Si vuelve tras 2 fallos seguidos, rehaz la página desde otro ángulo, con lo que falló, comprueba en `BASES.md` si falta un requisito y regresa al paso 5.

7. **Cierra la sesión.**
   - **Quedan subtemas en la fase:** si el siguiente es corto y la sesión aún es breve, vuelve al paso 4 con él. Si no, termina y di que se sigue con `/estudiar-fase` en una sesión nueva.
   - **Fase terminada** (ningún `[ ]`): revisa la fase siguiente con lo observado (fallos, dudas, `NOTAS.md`). Si necesita cambios, lee `../fases-plan/SKILL.md` y síguelo en modo **Revisar**. Si no, di qué fase empieza.
