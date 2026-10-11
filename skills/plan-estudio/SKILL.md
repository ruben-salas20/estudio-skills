---
name: plan-estudio
description: Convierte la investigación y tus bases en el plan general del curso, un árbol de fases y subtemas.
disable-model-invocation: true
---

# Plan de estudio

Escribe `PLAN.md`: el árbol del curso. Cada rama de primer nivel es una **fase**; sus hojas, los **subtemas**. El detalle de cada fase lo pone `/fases-plan`.

## Pasos

1. **Reúne las entradas.** El mapa del subagente y los requisitos que faltan llegan de `/indagar`. Lee `MISION.md`, `BASES.md` y los `NOTAS.md`. Si no vienes de `/indagar`, reconstruye el mapa con los archivos de `Recursos/`. Hecho cuando tienes mapa, bases y límites.

2. **Arma el árbol.**
   - Las fases van en orden de dependencia: ninguna usa algo que se ve después.
   - Los requisitos previos que faltan forman la primera fase.
   - Lo que `BASES.md` da por comprobado y lo que la misión deja fuera van a **Fuera del plan**, con su motivo.
   - Un subtema sin fuente fiable lleva `(hueco)`.

   Hecho cuando cada subtema del mapa está en una fase o en **Fuera del plan**.

3. **Comprueba que cabe.** Estima las sesiones de cada fase y compáralas con el tiempo y la fecha límite de la misión. Si no cabe, propón qué recortar o pasar a **Fuera del plan**. Hecho cuando cabe o la persona aceptó que no.

4. **Escribe `PLAN.md`** en la carpeta del curso, tras mostrar el árbol y que la persona lo apruebe:

   ```markdown
   <!-- Estructura: /fases-plan. Marcas: /evaluar. -->
   # Plan: <Curso>

   [ ] pendiente · [~] en progreso · [x] dominado

   ## Fase 1. <Tema> (~N sesiones)
   - [ ] 1.1 <Subtema>
   - [ ] 1.2 <Subtema> (hueco)

   ## Fuera del plan
   - <Subtema>: <motivo>
   ```

   La numeración (`1.2`) será el prefijo de la página del subtema en `Temas/`. Las fases no llevan marca: una fase está terminada cuando ninguno de sus subtemas sigue en `[ ]`. Hecho cuando el archivo existe.

5. **Pasa a la skill siguiente.** Lee `../fases-plan/SKILL.md` y síguelo.
