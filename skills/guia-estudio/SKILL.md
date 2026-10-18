---
name: guia-estudio
description: Te dice qué toca hacer ahora en tu estudio, o explica una skill o el flujo.
disable-model-invocation: true
---

# Guía de estudio

Solo lee y recomienda; la persona decide y lanza la skill. Lo que hace cada skill está en el `description` de `../<skill>/SKILL.md`: léelo de ahí. Aquí vive el mapa de cómo se conectan.

## Mapa del flujo

```text
/estudiar
├── sencillo → /explicar
└── profundo → /profundo-setup
    ├── institución → /clase-a-tema (cada clase, sesión nueva)
    └── otra fuente → /indagar → /plan-estudio → /fases-plan
                      → /estudiar-fase (cada subtema, sesión nueva)

Tras cada página: /evaluar ⇄ /repaso (2 fallos seguidos → se rehace la página)
Al cerrar una fase: /estudiar-fase revisa la siguiente → /fases-plan si hay cambios
Cuando haya datos: /mejorar-estudio
Instalar o actualizar: /setup-estudio-skills
```

Las sesiones nuevas leen todo de los archivos del curso: `MISION.md`, `NOTAS.md`, `BASES.md`, `PLAN.md` y `fases/`.

## Pasos

1. **Elige el modo.** Con una pregunta como argumento, ve al paso 3 (**Responde la pregunta**). Sin argumento, al paso 2 (**Recomienda el paso siguiente**).

2. **Recomienda el paso siguiente.** Recorre `<RAIZ>`: cada carpeta con `MISION.md` es un curso. Si no hay ninguno, recomienda `/estudiar`. Si no, busca en este orden y recomienda lo primero que encuentres:
   1. páginas con `repasar` anterior a hoy → `/estudiar`, que las ofrece en modo repaso programado;
   2. páginas con `estado: nuevo` → una sesión a medias: `/estudiar-fase` o `/clase-a-tema`, según el curso;
   3. material en `_Inbox/` → `/clase-a-tema`;
   4. el primer `[ ]` de cada `PLAN.md` → `/estudiar-fase`;
   5. 10 o más líneas en los registros de `Evaluaciones/` desde la última entrada de `<RAIZ>/MEJORAS.md` → `/mejorar-estudio`.

   Da un solo comando, con el curso como argumento (`/estudiar-fase <curso>`) o la carpeta donde abrir la sesión, y el motivo en una frase. Después, en una línea, lo demás que encontraste. Hecho cuando la persona sabe qué escribir.

3. **Responde la pregunta** con el mapa y, si trata de una skill concreta, con su `SKILL.md`. Termina diciendo qué comando usar. Hecho cuando la respuesta nombra la skill que resuelve su caso.
