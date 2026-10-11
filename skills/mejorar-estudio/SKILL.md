---
name: mejorar-estudio
description: Revisa cómo vas aprendiendo y propone cambios al sistema de estudio, con datos.
disable-model-invocation: true
---

# Mejorar estudio

Adapta el sistema a la persona con lo observado. Propone cambios a las reglas (`<RAIZ>/AGENTS.md`), a las notas y a las instrucciones de las skills instaladas; aplica solo lo que la persona aprueba. Cada cambio queda en `<RAIZ>/MEJORAS.md`, para medir si funcionó y para no perderlo al actualizar las skills.

## Pasos

1. **Reúne la evidencia** desde la última entrada de `MEJORAS.md` (o desde el principio, si no existe):
   - `<RAIZ>/NOTAS.md` y el `NOTAS.md` de cada curso;
   - `Evaluaciones/registro.md` de cada curso;
   - la sección **Cambios** de los archivos de `fases/`.

   Hecho cuando sabes el periodo y cuántas evaluaciones entran.

2. **Mide las mejoras anteriores.** Para cada cambio aplicado en `MEJORAS.md`, compara su métrica antes y después. Hecho cuando cada uno queda como **funcionó**, **no funcionó** o **sin datos aún**.

3. **Busca patrones**, con cifras. Por ejemplo:
   - repasos programados que fallan más en un intervalo que en otro;
   - el tipo de ítem que más falla (definir, aplicar, relacionar);
   - páginas que hubo que rehacer y qué tenían en común;
   - notas que se repiten en dos o más cursos, que suben al `NOTAS.md` general;
   - notas contradictorias o que la evidencia ya desmiente.

   Un patrón necesita al menos 3 casos. Hecho cuando cada patrón tiene sus casos contados.

4. **Propón los cambios** de uno en uno. Cada propuesta dice: qué archivo y qué texto cambia, la evidencia con cifras y la métrica que dirá si funcionó. Si un cambio anterior no funcionó, propón revertirlo. Hecho cuando la persona aprobó o rechazó cada propuesta.

5. **Aplica y registra.** Aplica lo aprobado. En `MEJORAS.md` añade, por cada propuesta: fecha, cambio, evidencia, métrica y si se aprobó o se rechazó. Una propuesta rechazada vuelve solo con evidencia nueva. Hecho cuando cada propuesta tiene su entrada.
