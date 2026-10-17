# Kit de páginas de estudio

Las páginas HTML parten de una plantilla de `plantillas/` y solo escriben marcado: el kit pone la letra, los colores claro y oscuro, las fórmulas y los diagramas.

| Plantilla | Para |
|---|---|
| `tema.html` | una página de `Temas/` |
| `indice.html` | el índice de un curso |

Las secciones opcionales de cada plantilla están en un comentario HTML: se añaden solo si aportan.

## Carga y rutas

En el `<head>`, después de los `<meta>`:

```html
<link rel="stylesheet" href="<ruta al kit>/kit.css">
<script src="<ruta al kit>/kit.js"></script>
```

`kit.js` va sin `defer`. La ruta es relativa a la página: {{tabla de rutas según la organización de carpetas de la persona}}.

## Metadatos

```html
<meta name="curso" content="Rust">
<meta name="clave" content="rust/1.2">     <!-- única; la usa el repaso -->
<meta name="estado" content="nuevo">       <!-- nuevo, en-progreso, dominado -->
<meta name="repasar" content="">           <!-- AAAA-MM-DD del próximo repaso -->
```

## Componentes

- **Fórmulas:** `$…$` en línea y `$$…$$` aparte. El kit carga KaTeX solo si la página tiene `$`.
- **Diagramas:** `<pre class="mermaid">…</pre>`. El kit carga Mermaid solo si hay uno.
- **Avisos:** `<div class="aviso">`; para errores típicos, `<div class="aviso error-comun">`.
- **Repaso (opcional):** solo si las preguntas son parte de la explicación; la evaluación es de `/evaluar`. `<section class="repaso">` con un `<div class="q">` por pregunta. Abierta: solo el `<p>` del enunciado; el kit añade el cuadro de respuesta. Opción múltiple: un `<ol class="ops">` con un `<li data-correcta>` y cada distractor con `data-por="por qué no"`; el kit baraja, corrige al elegir y muestra el `.explica`. Al final añade «Enviar repaso», que lanza un evento `kit:review` en `window` con las respuestas, para que lo escuche cualquier app que aloje la página, y también las deja en la consola.

`window.Kit` trae `Kit.meta` (los `<meta>` leídos) y `Kit.enviar(datos)`.
