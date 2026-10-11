// Kit de referencia. Va sin `defer` en el <head>, después de los <meta>.
// Carga KaTeX y Mermaid solo si la página los usa, y da vida al bloque de repaso.
(() => {
  const KATEX = "https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/";
  const MERMAID = "https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs";

  const meta = {};
  const leerMeta = () => {
    for (const m of document.querySelectorAll("meta[name]")) meta[m.name] = m.content;
  };

  // Si el visor ofrece una API para recibir datos de la página, se usa; si no, queda en la consola.
  const enviar = (datos) =>
    window.visor?.send ? window.visor.send(datos) : console.info("kit: sin visor que reciba", datos);

  const cargarCss = (href) => {
    const l = document.createElement("link");
    l.rel = "stylesheet";
    l.href = href;
    document.head.append(l);
  };
  const cargarJs = (src) =>
    new Promise((ok, mal) => {
      const s = document.createElement("script");
      s.src = src;
      s.onload = ok;
      s.onerror = () => mal(new Error("kit: no cargó " + src));
      document.head.append(s);
    });

  async function matematicas() {
    if (!/\$[^$]+\$/.test(document.body.textContent)) return;
    cargarCss(KATEX + "katex.min.css");
    await cargarJs(KATEX + "katex.min.js");
    await cargarJs(KATEX + "contrib/auto-render.min.js");
    window.renderMathInElement(document.body, {
      delimiters: [
        { left: "$$", right: "$$", display: true },
        { left: "$", right: "$", display: false },
      ],
      ignoredTags: ["script", "noscript", "style", "textarea", "pre", "code"],
    });
  }

  async function diagramas() {
    if (!document.querySelector("pre.mermaid")) return;
    const { default: mermaid } = await import(MERMAID);
    const oscuro = matchMedia("(prefers-color-scheme: dark)").matches;
    mermaid.initialize({ startOnLoad: false, theme: oscuro ? "dark" : "default" });
    await mermaid.run();
  }

  // Repaso: <section class="repaso"> con un <div class="q"> por pregunta.
  // Abierta: solo el enunciado. Opción múltiple: un <ol class="ops"> con un <li data-correcta>
  // y cada distractor con data-por="por qué no".
  function repaso() {
    document.querySelectorAll(".repaso").forEach((bloque, nb) => {
      const qs = [...bloque.querySelectorAll(".q")];
      qs.forEach((q) => {
        const ops = q.querySelector(".ops");
        if (!ops) {
          q.querySelector("p")?.after(document.createElement("textarea"));
          return;
        }
        const lis = [...ops.children];
        for (let i = lis.length - 1; i > 0; i--) ops.append(lis.splice(Math.floor(Math.random() * (i + 1)), 1)[0]);
        ops.addEventListener("click", (e) => {
          const li = e.target.closest("li");
          if (!li || q.classList.contains("contestada")) return;
          q.classList.add("contestada");
          q.dataset.elegida = li.textContent.trim();
          if (li.hasAttribute("data-correcta")) li.classList.add("acierto");
          else {
            li.classList.add("fallo");
            const por = document.createElement("p");
            por.className = "por";
            por.textContent = li.dataset.por || "";
            li.after(por);
            ops.querySelector("[data-correcta]")?.classList.add("acierto");
          }
        });
      });
      const boton = document.createElement("button");
      boton.textContent = "Enviar repaso";
      boton.addEventListener("click", () =>
        enviar({
          tipo: "repaso",
          pagina: meta.clave || location.pathname,
          bloque: nb,
          preguntas: qs.map((q, i) => ({
            pregunta: i + 1,
            enunciado: q.querySelector("p")?.textContent.trim(),
            respuesta: q.querySelector("textarea")?.value ?? q.dataset.elegida ?? null,
            acierto: q.querySelector(".ops") && q.classList.contains("contestada") ? !q.querySelector("li.fallo") : null,
          })),
        })
      );
      bloque.append(boton);
    });
  }

  window.Kit = { meta, enviar };
  document.addEventListener("DOMContentLoaded", () => {
    leerMeta();
    repaso();
    matematicas().catch(console.error);
    diagramas().catch(console.error);
  });
})();
