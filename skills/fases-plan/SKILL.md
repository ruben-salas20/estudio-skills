---
name: fases-plan
description: Detalla las fases del plan de estudio o las rediseña según cómo vas avanzando.
disable-model-invocation: true
---

# Fases del plan

Escribe un archivo por fase en `fases/` y, una vez que `/plan-estudio` lo creó, es la única skill que cambia la estructura de `PLAN.md`. Las marcas `[ ]`, `[~]` y `[x]` son de `/evaluar`: al tocar el árbol, consérvalas.

## Modos

- **Detallar:** no hay archivos en `fases/`. Detalla todas las fases.
- **Revisar:** ya existen. Llega desde `/estudiar-fase` con lo que se vio en una fase terminada, o desde la persona con lo que quiere cambiar. Revisa la fase siguiente y, si el motivo lo pide, las demás.

## Pasos

1. **Lee el curso.** `PLAN.md`, `MISION.md`, `BASES.md`, los `NOTAS.md`, los archivos de `fases/` y el registro de `/evaluar`, si existen. Hecho cuando sabes en qué modo estás y, al revisar, el motivo.

2. **Escribe o propón el detalle.** Cada fase va en `fases/<n> — <Tema>.md`:

   ```markdown
   # Fase <n>. <Tema>

   **Objetivo:** <qué podrás hacer al terminar que hoy no puedes>
   **Necesita:** <fases o subtemas previos>

   ## Subtemas
   ### <n.1> <Subtema>
   - **Meta:** <una frase que se pueda comprobar>
   - **Fuentes:** <enlaces a Recursos/, o «hueco»>
   - **Práctica:** <ejercicio o proyecto>

   ## Evaluación
   <qué tiene que salir bien para aprobar la fase>

   ## Cambios
   - <AAAA-MM-DD>: <qué cambió y por qué>
   ```

   - **Detallar:** escribe todas las fases.
   - **Revisar:** propón cada cambio con su motivo, apoyado en lo observado: fallos de `/evaluar`, `NOTAS.md`, un subtema que resultó ser previo de otro. Aplica solo lo que la persona apruebe y anótalo en **Cambios**.

   Hecho cuando cada subtema del árbol tiene meta, fuentes y práctica, y cada fase tiene criterio de evaluación.

3. **Ajusta `PLAN.md`** si cambió la estructura: subtemas nuevos con `[ ]`, quitados o movidos, sesiones estimadas. Enlaza cada fase a su archivo. Hecho cuando el árbol y `fases/` dicen lo mismo.

4. **Termina.** Di qué fase toca y que se empieza con `/estudiar-fase` en una sesión nueva.
