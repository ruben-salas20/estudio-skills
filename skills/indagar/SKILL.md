---
name: indagar
description: Investiga un tema con fuentes y averigua qué sabes ya de él, antes de hacer el plan.
disable-model-invocation: true
---

# Indagar

Prepara las dos entradas del plan: qué dicen las fuentes del tema y desde dónde parte la persona. Lo primero lo hace un subagente; lo segundo, tú con la persona, a la vez.

## Pasos

1. **Lee el curso.** `MISION.md` y los `NOTAS.md` (el de `<RAIZ>` y el del curso). Hecho cuando sabes el tema, el objetivo y los límites.

2. **Lanza el subagente** en segundo plano. Dale el tema, los límites de la misión, la ruta de `Recursos/` del curso y esta orden: «Lee `<ruta absoluta de investigar-fuentes.md>` y síguelo». Ese archivo, junto a este, es el prompt del subagente. Hecho cuando está en marcha.

3. **Averigua las bases** mientras investiga.
   - Pregunta qué sabe ya del tema y de lo que lo rodea. Si dice que nada, anótalo y pasa al paso 4: se empieza de cero.
   - Comprueba lo que dice saber con 3 a 5 preguntas cortas, de lo más básico a lo más avanzado. Lo que alguien cree saber y lo que sabe no siempre coinciden. Para en la primera pregunta que falle claramente.

   Hecho cuando cada cosa que dijo saber está **comprobada** o **por comprobar**.

4. **Escribe `BASES.md`** en la carpeta del curso: lo que sabe (comprobado), lo que cree saber pero falló, lo que no sabe y la fecha. Si aprendiste algo de cómo aprende, añádelo a `NOTAS.md`: lo general va a `<RAIZ>/NOTAS.md` y lo propio del curso, al suyo. Hecho cuando el archivo existe.

5. **Recoge el informe del subagente.** Espera a que termine. Cruza su mapa con `BASES.md`: marca los requisitos previos que la persona no tiene. Muestra los huecos y las contradicciones, si hay. Hecho cuando la persona los vio.

6. **Pasa a la skill siguiente.** Lee `../plan-estudio/SKILL.md` y síguelo, con el mapa, `BASES.md` y los requisitos que faltan.
