// Incrusta escenas 3D (skill escenas-3d) en una nota. La nota pone cada escena en un iframe con id:
//   <iframe id="router" src="escenas/router-moe.html" title="…" allowfullscreen loading="lazy"
//           style="width:100%; aspect-ratio:16/9; border:0; border-radius:12px"></iframe>
// y carga este archivo una vez (copiado junto a la nota o pegado en un <script>). Hace dos cosas:
// - un botón con data-3d='{"en":"router","vista":"lado"}' manda esa orden a la escena «router»;
// - pasa a cada escena el tema y los colores de la nota, si la nota los define.
(() => {
  // Color de la escena ← variable CSS de la nota. Son los nombres del kit de /crear-kit; si el kit usa otros, cámbialos aquí.
  // La escena admite también blue, orange, magenta y cyan.
  const DE_LA_NOTA = { bg: "--fondo", fg: "--texto", muted: "--suave", mesa: "--caja", accent: "--acento", green: "--bien", red: "--mal" };
  const escenas = () => [...document.querySelectorAll("iframe[id]")];
  // El tema sale del fondo real de la nota; si es transparente, del sistema.
  const oscuro = () => {
    const ctx = document.createElement("canvas").getContext("2d", { willReadFrequently: true });
    ctx.fillStyle = getComputedStyle(document.body).backgroundColor;
    ctx.fillRect(0, 0, 1, 1);
    const [r, g, b, a] = ctx.getImageData(0, 0, 1, 1).data;
    return a ? (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255 < 0.5 : matchMedia("(prefers-color-scheme: dark)").matches;
  };
  const tema = (f) => {
    const cs = getComputedStyle(document.documentElement), colores = {};
    for (const [n, css] of Object.entries(DE_LA_NOTA)) { const v = cs.getPropertyValue(css).trim(); if (v) colores[n] = v; }
    f.contentWindow?.postMessage({ tipo: "tema", tema: oscuro() ? "oscuro" : "claro", colores }, "*");
  };
  // Una escena con loading="lazy" aún sin cargar pierde la orden: se manda igual (por si ya estaba lista antes de este
  // guion) y se repite cuando avise de que está lista. Las órdenes fijan estado, así que repetirla no cambia nada.
  const listas = new WeakSet(), pendientes = new Map();
  const ordenar = (f, d) => f.contentWindow.postMessage({ tipo: "orden", orden: d }, "*");
  addEventListener("message", (e) => {
    if (e.data?.tipo !== "escena3d-lista") return;
    for (const f of escenas().filter((f) => f.contentWindow === e.source)) {
      listas.add(f);
      tema(f);
      if (pendientes.has(f)) { ordenar(f, pendientes.get(f)); pendientes.delete(f); }
    }
  });
  matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => escenas().forEach(tema));
  new MutationObserver(() => escenas().forEach(tema)).observe(document.documentElement, { attributes: true, attributeFilter: ["class", "style", "data-theme", "data-tema"] });
  document.addEventListener("click", (e) => {
    const b = e.target.closest("[data-3d]");
    if (!b) return;
    let d;
    try { d = JSON.parse(b.dataset["3d"]); } catch { return console.error("incrustar: data-3d no es JSON válido: " + b.dataset["3d"]); }
    const f = d.en ? document.getElementById(d.en) : escenas()[0];
    if (!f?.contentWindow) return console.error(`incrustar: no hay escena con id "${d.en}"`);
    f.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "nearest" });
    ordenar(f, d);
    if (!listas.has(f)) pendientes.set(f, d);
  });
})();
