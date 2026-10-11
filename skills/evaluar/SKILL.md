---
name: evaluar
description: Evalúa un subtema con preguntas y un ejercicio, da retroalimentación y programa su próximo repaso.
disable-model-invocation: true
---

# Evaluar

Comprueba si la persona alcanzó la meta de un subtema. Es la única skill que cambia el estado de un tema: en su página y en las marcas de `PLAN.md`.

## Modos

- **Tras estudiar:** llega desde `/estudiar-fase` o desde `/repaso`.
- **Repaso programado:** el metadato `repasar` de la página ya venció. Llega desde la oferta de repasos vencidos.

## Pasos

1. **Prepara la prueba.** Lee la página del subtema, su **meta** en `fases/` y lo que pide de él la **Evaluación** de la fase. Prepara de 3 a 5 preguntas distintas de las de repaso de la página y un ejercicio que aplique la meta. Un curso de institución no tiene `fases/` ni `PLAN.md`: la meta sale de la página y de lo que el docente dijo que entra. Si el curso tiene un componente de evaluación interactivo, úsalo. Escribe para ti la respuesta correcta de cada ítem antes de preguntar. Hecho cuando cada ítem tiene su clave.

2. **Pregunta de una en una.** Durante la prueba solo preguntas y escuchas: las pistas son de `/repaso`. Hecho cuando la persona respondió todo.

3. **Corrige.** Cada ítem queda como bien, a medias o mal, con su motivo según la clave. Aprueba si se cumple el criterio de la fase. Di el resultado y con qué ítems lo comprobaste. Para cada fallo, explica qué idea falta, no solo cuál era la respuesta. Hecho cuando la persona tiene el resultado y la retroalimentación.

4. **Registra.** Añade una línea a `Evaluaciones/registro.md` del curso: fecha, subtema, modo, resultado, ítems fallados y repasos hechos antes. Hecho cuando la línea existe.

5. **Actualiza el estado.** El historial del subtema en `Evaluaciones/registro.md` dice si hubo `/repaso` o se rehízo la página, y cuál fue el intervalo anterior. Cambia `estado` y `repasar` en la página y, si hay `PLAN.md`, la marca del subtema, a la vez:

   | Resultado | Estado y marca | Próximo `repasar` |
   |---|---|---|
   | Aprueba tras estudiar, sin `/repaso` | `en-progreso`, `[~]` | en 7 días |
   | Aprueba tras un `/repaso` | `en-progreso`, `[~]` | en 3 días |
   | Aprueba tras rehacer la página | `en-progreso`, `[~]` | en 1 día |
   | Aprueba un repaso programado | `en-progreso`, `[~]` | el doble del intervalo anterior |
   | Aprueba un repaso programado de 28 días o más | `dominado`, `[x]` | vacío |
   | Falla un repaso programado | `en-progreso`, `[~]` | en 1 día, tras `/repaso` |

   Un fallo tras estudiar no cambia el estado: sigue el paso 6. Hecho cuando la página y `PLAN.md` dicen lo mismo.

6. **Sigue según el resultado.**
   - **Aprueba:** vuelve a la skill que te llamó.
   - **Falla por primera vez:** lee `../repaso/SKILL.md` y síguelo; después repite desde el paso 1 con preguntas nuevas.
   - **Falla tras un `/repaso`:** son 2 fallos seguidos. Tras estudiar, vuelve a la skill que creó la página (`/estudiar-fase` o `/clase-a-tema`) con lo que falló. En un repaso programado, pon `repasar` a mañana y di que la página se rehace con esa skill en una sesión nueva.
