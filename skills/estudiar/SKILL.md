---
name: estudiar
description: Empieza a estudiar algo. Aclara qué quieres aprender y si basta una explicación o hace falta un estudio a fondo.
disable-model-invocation: true
---

# Estudiar

Puerta de entrada al flujo. Averigua qué quiere aprender la persona y para qué, y la manda por el camino adecuado. Aquí solo se pregunta: enseñar empieza en la skill siguiente.

## Pasos

1. **Lee el contexto.** `<RAIZ>/AGENTS.md` trae las reglas de enseñanza y `<RAIZ>/NOTAS.md`, lo que se sabe de cómo aprende esta persona. Aplica ambos en todo lo que sigue. Hecho cuando los leíste o comprobaste que no existen.

2. **Ofrece los repasos vencidos.** Busca en `<RAIZ>` las páginas de tema cuyo metadato `repasar` sea anterior a hoy. Si hay, enuméralas con los días de retraso y pregunta si quiere repasar antes. Por cada uno que acepte, lee `../evaluar/SKILL.md` y síguelo en modo **Repaso programado**: primero se prueba lo que recuerda y solo se repasa lo que falle. Hecho cuando no hay vencidos o la persona eligió.

3. **Haz la ficha.** Pregunta de una en una, empezando por lo que el argumento no diga, hasta poder escribir una línea de cada campo:
   - **Qué:** el tema, acotado. «Cómo entrena una red neuronal», no «IA».
   - **Para qué:** el objetivo concreto. Un examen en una fecha, un proyecto, curiosidad.
   - **Éxito:** qué podrá hacer al terminar que hoy no puede.
   - **Límites:** tiempo disponible, fecha límite y lo que queda fuera.
   - **Fuente:** clases de una institución (lo que dijo el docente manda) u otra cosa.

   Hecho cuando la persona confirma la ficha.

4. **Decide la profundidad.** **Sencillo:** una duda que se resuelve en una sesión, sin seguimiento. **Profundo:** varias sesiones, con plan o evaluación. Propón una con su motivo en una frase; elige la persona. Hecho cuando eligió.

5. **Pasa a la skill siguiente.**
   - **Sencillo:** lee `../explicar/SKILL.md` y síguelo con el **Qué** de la ficha.
   - **Profundo:** lee `../profundo-setup/SKILL.md` y síguelo. Entrégale la ficha, que irá a `MISION.md`, y lo que aprendiste de cómo aprende la persona y no cabe en la ficha, que irá a `NOTAS.md`.
