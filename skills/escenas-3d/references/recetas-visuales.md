# Recetas visuales

Técnicas de *realismo* sin posprocesado (`laboratorio.md` §5), probadas en el render por software de las capturas. Cada una dice cuándo usarla: aplicarlas todas a todo es decorar. Código completo de referencia en `references/ejemplos/` de esta skill: `motor-raptor-flujo-completo.html` (§1-§5), `como-un-rio-rehace-su-valle.html` (§6-§9), `como-bombea-el-corazon.html` (§10-§11).

| Si el tema tiene… | Receta |
|---|---|
| Superficies de un material reconocible (metal, agua, roca, tejido, plástico) | §1 Material según lo que es |
| Una magnitud que varía sobre una superficie (temperatura, profundidad, concentración, velocidad) | §2 Magnitud → apariencia |
| Algo sin superficie definida que se mueve: fuego, humo, gas, vapor, plasma, un chorro | §3 Efecto volumétrico animado |
| Algo que emite luz de verdad (llama, filamento, LED, lava, estrella) | §4 Resplandor local |
| Un interior que importa y paredes con grosor (órganos, capas de la Tierra, tuberías, máquinas, células) | §5 Corte con sección |
| Un paisaje o una superficie natural sobre una rejilla de alturas (valle, volcán, costa, glaciar, campo, tejido visto como paisaje) | §6 Terreno por historia |
| Un bloque de material cortado por los lados o por un plano: suelo, roca, hielo, sedimento, un tejido en capas | §7 Estratos en laterales y secciones |
| Muchos objetos pequeños que cubren una superficie según su estado (árboles, cultivos, rocas, casas, células, corales) | §8 Cubierta instanciada con máscaras |
| Un fluido en lámina cuyo movimiento es la causa del fenómeno (río, marea, colada, corriente oceánica, flujo sanguíneo) | §9 Agua con profundidad y dirección de flujo |
| Una forma blanda, redondeada o que se deforma (órganos, células, frutas, animales, rocas erosionadas, masas que laten o respiran) | §10 Geometría orgánica |
| Partículas que representan un caudal por compartimentos con válvulas o compuertas (sangre por el corazón, aire en los pulmones, agua por esclusas, tráfico por semáforos) | §11 Partículas que conservan el caudal |

Reglas que valen para todas: los tintes físicos (arena, roca, arteria, revenido del acero) se declaran con `ampliarTemas` con claves propias, no como hexadecimales sueltos; todo lo aleatorio sale de un hash determinista del índice, nunca de `Math.random`, para que la captura salga igual; y todo `uT` de un shader se asigna en `actualizar(t)` con `ANIMADA` activa mientras se vea, así la pausa lo congela y `?t=` lo reproduce.

## 1. Material según lo que es

Cada superficie lleva la rugosidad y el metalizado de lo que representa; el color semántico se conserva encima.

| Material | `metalness` | `roughness` | Notas |
|---|---|---|---|
| Metal pulido / mecanizado | 0,8–0,9 | 0,25–0,45 | necesita entorno (abajo) o sale negro |
| Plástico, pintura | 0 | 0,4–0,6 | |
| Roca, tierra, terreno | 0 | 0,85–1 | variación de color con §2, no con brillo |
| Agua | 0 | 0,05–0,2 | `transparent`, `opacity` 0,6–0,8; se beneficia del entorno |
| Vidrio | 0 | 0–0,1 | `opacity` 0,2–0,35, `depthWrite: false` |
| Tejido orgánico, piel | 0 | 0,5–0,7 | tono con §2 si codifica algo (oxigenación, temperatura) |

**Entorno, solo si hay algo que refleja** (metal, agua, vidrio). Se genera una vez y no cuesta nada por fotograma; con él, el comentario de `mat()` sobre «metalness alto sale negro» deja de aplicar:

```js
const { RoomEnvironment } = await import('three/addons/environments/RoomEnvironment.js');
const pmrem = new THREE.PMREMGenerator(render);
escena.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
pmrem.dispose();
escena.environmentIntensity = 0.4;                 // moderado: no aplastar la luz direccional
alCambiarTema((n, T) => { hemi.intensity = T.hemi * 0.6; });   // el entorno ya aporta luz
for (const m of [suelo.material, pedestal.material]) m.envMapIntensity = 0.25;   // lo mate, casi nada
```

## 2. Magnitud → apariencia

Una magnitud del estado que varía sobre una superficie se ve en la superficie (la garganta de una tobera al rojo, el lecho más oscuro donde la erosión es más honda). Dos piezas: un **degradado fijo** en textura de canvas (dónde varía) y una **intensidad ligada al estado** (cuánto):

```js
function degradado(paradas) {        // a lo largo de v: el uv de LatheGeometry, TubeGeometry o un plano
  const c = document.createElement('canvas'); c.width = 4; c.height = 256;
  const x = c.getContext('2d'), g = x.createLinearGradient(0, 256, 0, 0);
  for (const [p, col] of paradas) g.addColorStop(p, col);
  x.fillStyle = g; x.fillRect(0, 0, 4, 256);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}
const m = mat('metal', { emissiveMap: degradado([[0, '#fff'], [0.15, '#000'], [1, '#000']]) });
alCambiar((e) => { m.emissiveIntensity = analizar(e).presion / 300; });   // calor ∝ magnitud
```

- Calor que brilla: `emissiveMap` + `emissiveIntensity`. Lo que no emite luz (profundidad, concentración): `map` o `vertexColors`, nunca emisivo.
- En un terreno, el degradado va por vértice (`vertexColors`) desde la altura o la magnitud.

## 3. Efecto volumétrico animado

Fuego, humo, vapor, gas caliente, plasma, un chorro: **capas de geometría abierta** (conos, cilindros o planos cruzados) con un `ShaderMaterial` de ruido animado, sin raymarching ni partículas pesadas. Núcleo del fragment shader, con `s` = coordenada a lo largo del efecto (0 en el origen, 1 en la cola):

```glsl
float f = abs(dot(normalize(vN), normalize(vV)));            // 1 de frente, 0 en el borde
vec3 q = vec3(s * uLargo * 5.0 - uT * uVel, vA * 1.4);       // el ruido viaja con el tiempo
float n = fbm(vec3(q.x * 0.9, q.yz * 3.2));                  // vetas estiradas a lo largo del eje
float m = fbm(vec3(q.x * 0.45 + 7.0, q.yz * 1.3));           // remolinos grandes
float I = smoothstep(0.0, uIni, s) * pow(max(1.0 - s, 0.0), uCaida);   // nace y se apaga
I *= mix(1.0, 0.2 + 1.4 * n, uRuido);
I *= mix(1.0, smoothstep(0.0, 0.35, m + 0.55 - s), uRompe);  // la cola se deshace en jirones
vec3 col = mix(mix(uC0, uC1, smoothstep(0.0, 0.4, s)), uC2, smoothstep(0.35, 1.0, s));
gl_FragColor = vec4(col, clamp(uOpac * I * pow(f, uBorde), 0.0, 1.0));
#include <colorspace_fragment>
```

(`fbm` = 3 octavas de ruido de valor 3D; `hash3` y `ruido`, en la escena del motor.)

- **El borde por `N·V`** da el aspecto de volumen: la capa se desvanece donde se ve de canto.
- Material: `transparent: true, depthWrite: false, side: DoubleSide`.
- Variantes por parámetros, no por shaders distintos: fuego (núcleo claro → color → oscuro, aditivo, `uCaida` alta), humo (colores oscuros, mezcla normal, geometría que se ensancha con `s`), gas en un recipiente (`uCaida` baja, `uRuido` alto). Color y tamaño salen del estado cuando son un dato (la llama del metano es azulada; la del queroseno, naranja).

**Aditivo solo sobre fondo oscuro.** En el tema claro `AdditiveBlending` satura a blanco y el efecto desaparece: ahí, mezcla normal con tonos más saturados por tema. Gas dentro de una pieza iluminada, también normal, o lava la pared a blanco. Cambiar `blending` exige `material.needsUpdate = true`.

## 4. Resplandor local

Halo sin bloom para lo que emite luz de verdad: un `Sprite` aditivo con degradado radial, escalado por la magnitud y oculto en el tema claro (§3). Un halo en una pieza «importante» es decoración.

```js
const c = document.createElement('canvas'); c.width = c.height = 128;
const x = c.getContext('2d'), g = x.createRadialGradient(64, 64, 0, 64, 64, 64);
g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(0.25, 'rgba(255,255,255,.45)'); g.addColorStop(1, 'rgba(255,255,255,0)');
x.fillStyle = g; x.fillRect(0, 0, 128, 128);
const halo = new THREE.Sprite(new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(c),
  transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));
halo.material.color.setHex(0xffb060);   // tinte del emisor
```

## 5. Corte con sección

Media pieza quitada, la pared **con su grosor rayado** como en un plano técnico y el interior visible. Sin pasada de stencil. Si solo importa el flujo interior, más barato: carcasas casi transparentes (`laboratorio.md` §6).

1. **Las piezas cortables son sólidos cerrados**: pared exterior y pared interior con las normales hacia dentro (`LatheGeometry` de un perfil rectangular cerrado; en cajas, una dentro de otra con la interior invertida). Una superficie de una hoja cortada se ve hueca.
2. **Plano de recorte** en los materiales cortables:
   ```js
   render.localClippingEnabled = true;
   const plano = new THREE.Plane(new THREE.Vector3(0, 0, -1), 0);   // quita z > 0
   m.clippingPlanes = corte ? [plano] : []; m.clipShadows = true; m.side = corte ? THREE.DoubleSide : THREE.FrontSide;
   ```
3. **Las caras traseras que asoman por el corte se pintan como sección**: lo único que se ve de espaldas es el interior de la pared.
   ```js
   const uCorte = { value: 0 }, uSeccion = { value: new THREE.Color() };
   alCambiarTema((n, T) => uSeccion.value.setHex(T.seccion, THREE.LinearSRGBColorSpace));
   m.onBeforeCompile = (sh) => {
     sh.uniforms.uCorte = uCorte; sh.uniforms.uSeccion = uSeccion;
     sh.fragmentShader = 'uniform float uCorte;\nuniform vec3 uSeccion;\n' + sh.fragmentShader.replace(
       '#include <dithering_fragment>', `#include <dithering_fragment>
       if (uCorte > 0.5 && !gl_FrontFacing) {
         float raya = step(mod(gl_FragCoord.x - gl_FragCoord.y, 8.0), 1.6);
         gl_FragColor = vec4(uSeccion * (1.0 - 0.3 * raya), 1.0);
       }`);
   };
   m.customProgramCacheKey = () => 'seccion';   // si no, Three.js reutiliza el programa sin el parche
   ```
4. **Dentro**, lo que cuenta: fluido translúcido del color de la leyenda, gas con §3, piezas internas.
5. **Color de sección** (`seccion`, en `ampliarTemas`), distinto de todos los semánticos: gris neutro en piezas y máquinas; en tejido, roca o madera, el tono del material cortado, claro y poco saturado (rosa pálido en un órgano, ocre en un terreno). El hueco interior, más oscuro que la pared cortada, para distinguir de un vistazo pared y vacío.
6. **Lo que atraviesa el plano**: una esfera cortada se ve como un anillo hueco, así que las partículas van **detrás** del plano (`z ≤ −radio`). Las piezas finas que importan enteras (valvas, láminas, filamentos), sin recortar, aunque sobresalgan un poco.

## 6. Terreno por historia

Un paisaje que cambia (erosión, depósito, lava, hielo, cultivo), donde **qué hay en cada punto depende de lo que le pasó**. Un plano con textura se lee como un mapa pegado a una losa; parece maqueta cuando altura, color y cubierta salen de la misma magnitud por celda (edad, material, profundidad).

- **Rejilla propia** (`BufferGeometry` indexada, un vértice por celda del modelo), no `PlaneGeometry`: el índice `c = j * NX + i` sirve igual para altura, color, vegetación (§8) y la textura del agua (§9).
- **Una clase por celda** decide altura y tinte a la vez (viejo / joven / depósito reciente / bajo el agua / borde que se derrumba). La altura sigue a la clase (lo recién depositado, más bajo, sube con la edad); el ruido solo añade micro-relieve (±0,5 m).
- **Tintes mezclados con `Color.lerp` según la edad** (arena → prado → bosque). Lo que la escena cuenta («esto ya lo recorrió el río») tiene que distinguirse de lo que no: si el suelo joven acaba del color del viejo, la cifra que lo mide deja de verse.
- **Los bordes empinados dientan** en sierra. Un suavizado 4-1-1-1-1 (y dos pasadas más solo en la zona empinada) lo quita sin perder formas de 2-3 celdas:
  ```js
  hTmp.set(h);
  for (let j = 1; j < NZ - 1; j++) for (let i = 1; i < NX - 1; i++) {
    const c = j * NX + i;
    h[c] = (4 * hTmp[c] + hTmp[c - 1] + hTmp[c + 1] + hTmp[c - NX] + hTmp[c + NX]) / 8;
  }
  ```
- **La pared que se derrumba es geometría aparte**: una tira vertical a lo largo del borde (un vértice arriba y otro al pie por punto), con el material de §7. La rejilla sola no dibuja un escarpe más estrecho que una celda.
- Exageración vertical en una constante (`wy = (h) => h * VE / 100`), dicha en `ayuda()`. Lo que va encima (árboles, casas) **no** se exagera, o parecen agujas.
- Rehacer 50 000 vértices + `computeVertexNormals` por fotograma aguanta una transición en cámara rápida; más, bajar la resolución.

## 7. Estratos en laterales y secciones

El canto de un material por capas (lateral de un bloque de terreno, corte geológico, testigo de hielo, sección de una piel). Un lateral liso delata la maqueta; las capas cuentan qué se depositó sobre qué. Un solo material para todos los cantos calcula el color **en el fragmento** desde la altura del mundo y dos atributos por vértice: `aTop` (superficie de esa columna) y `aDep` (base de la capa nueva; igual a `aTop` donde no la hay). Así las capas quedan horizontales y nítidas aunque la geometría sea una tira de dos vértices por columna.

```js
function matEstratos() {
  const m = new THREE.MeshStandardMaterial({ roughness: 1, side: THREE.DoubleSide });
  m.onBeforeCompile = (sh) => {
    Object.assign(sh.uniforms, uEstr);   // colores de las capas (desde TEMAS con alCambiarTema) y uEsc = m por unidad
    sh.vertexShader = sh.vertexShader
      .replace('#include <common>', '#include <common>\nattribute float aTop, aDep;\nvarying float vTop, vDep;\nvarying vec3 vMundo;')
      .replace('#include <project_vertex>', '#include <project_vertex>\nvTop = aTop; vDep = aDep; vMundo = (modelMatrix * vec4(transformed, 1.0)).xyz;');
    sh.fragmentShader = sh.fragmentShader
      .replace('#include <common>', `#include <common>
uniform vec3 uSuelo, uNueva, uA, uB, uC; uniform float uEsc;
varying float vTop, vDep; varying vec3 vMundo;
vec3 capa(float y, float top, float dep, float hor) {
  if (y > top - 0.5) return uSuelo;                            // suelo con raíces arriba
  if (y > dep) return uNueva * (0.92 + 0.14 * step(0.8, fract(y / 0.6)));   // capa nueva, laminada
  float k = mod(y + 0.5 * sin(hor * 0.011), 3.4);              // capas antiguas, algo onduladas
  return k < 1.5 ? uA : k < 2.1 ? uB : uC;
}`)
      .replace('#include <color_fragment>', '#include <color_fragment>\ndiffuseColor.rgb = capa(vMundo.y * uEsc, vTop, vDep, (vMundo.x + vMundo.z) * 100.0);');
  };
  m.customProgramCacheKey = () => 'estratos';
  return m;
}
```

- **Laterales**: por cada celda del borde de la rejilla, un vértice en la superficie y otro en la base, con su `aTop`/`aDep`; se actualizan con el terreno.
- **Sección de terreno** (no la de §5, que corta sólidos cerrados): con el plano de recorte alineado con una columna de la rejilla, dibujar sobre él una tira con este material tomando la altura **de la propia rejilla**, para que el borde coincida con el terreno recortado. El agua de la sección, en una malla aparte sobre el lecho.
- Alturas del shader en metros reales, con la escala como uniforme (`uEsc = 100 / VE`): las capas no cambian de grosor si cambia la exageración.

## 8. Cubierta instanciada con máscaras

Muchas cosas iguales cuya presencia, tamaño o color **depende del estado del suelo** (bosque según la edad, rocas según la pendiente, casas según la cota de inundación). Miles de objetos low-poly en **un** `InstancedMesh`; lo que enseña es la máscara, no el árbol.

- **Candidatos fijos**, creados una vez en una rejilla con jitter determinista; cada uno guarda su celda y dos números fijos (umbral de aparición `a`, variación de tamaño `b`).
- **En cada cambio de estado** se aplican las máscaras y se escriben solo los que salen; `count` corta el resto:
  ```js
  let n = 0;
  for (const k of candidatos) {
    const c = k.c;
    if (agua[c] || cauce[c] || pendiente(c) > MAX || zonaVetada(k)) continue;   // máscaras duras
    const dens = densidadSegun(edad[c]);                                        // máscara blanda: 0..1
    if (k.a > dens) continue;
    const t = tamSegun(edad[c]) * (0.8 + 0.4 * k.b);
    m4.compose(v.set(x(k), y(c), z(k)), q, s.set(0.13 * t, 0.16 * t, 0.13 * t));
    copas.setMatrixAt(n, m4);
    copas.setColorAt(n, col.setHex(t < 0.5 ? T.arbusto : T.copaJoven).lerp(tmp.setHex(T.copaVieja), madurez));
    n++;
  }
  copas.count = n; copas.instanceMatrix.needsUpdate = copas.instanceColor.needsUpdate = true;
  copas.computeBoundingSphere();   // si no, el frustum culling usa la caja de la primera vez
  ```
- **Geometría**: `IcosahedronGeometry(0.5, 0)` trasladada para apoyarse en el suelo, `flatShading: true`: 20 caras que se leen como copa en el render por software. `setColorAt(0, …)` antes del primer uso crea `instanceColor`.
- **La máscara puede dibujar historia**: modular la densidad con la edad (`cos(edad / periodo)`) deja filas de árboles sobre las antiguas orillas o frentes.
- **Las máscaras que explican son duras**: nada crece donde el fenómeno actúa (borde que se come el río, colada activa). Ese vacío es lo que hace visible el fenómeno.
- Coste: ~17 000 candidatos y ~10 000 instancias de 20 triángulos no movieron el `listo en` de la captura; con sombras se dibujan otra vez en el mapa, y con `ANIMADA`, en cada fotograma.

## 9. Agua con profundidad y dirección de flujo

Un fluido en lámina donde **la velocidad o la quietud es parte de la explicación** (corriente más rápida por fuera de la curva, lago aislado frente a río, marea, colada). El color por profundidad da volumen; las vetas que corren dan la causa.

- **Un plano al nivel del agua** que asoma solo donde el terreno queda por debajo: cauces y lagos salen solos.
- **Una textura de datos por celda** (`DataTexture` RGBA 8 bits, filtrado lineal) rellenada desde el modelo en cada cambio: R,G = dirección (0,5 = quieto), B = rapidez, A = profundidad. Se lee con `uv = (xz − origen) / tamaño`, origen medio píxel antes de la primera celda.
- **Color**: `mix(somera, profunda, smoothstep(…, prof))` y alfa que sube con la profundidad, para que la orilla deje ver el lecho. **Dirección nula = agua quieta**: otro tono (más oscuro, verdoso) y sin vetas; así se distingue sin leer un lago aislado de un cauce vivo.
- **Vetas**: ruido estirado en el marco del flujo y desplazado con el tiempo, en dos fases cruzadas para que no se estiren sin fin (mapas de flujo):
  ```glsl
  vec2 d = normalize(dir + vec2(1e-4, 0.0)), p = vMundo.xz * 100.0;
  vec2 q = vec2(dot(p, d), dot(p, vec2(-d.y, d.x)));            // a lo largo / a través del flujo
  float f0 = fract(uT * 0.3), f1 = fract(uT * 0.3 + 0.5), w = abs(1.0 - 2.0 * f0);
  float n0 = ruido(vec2((q.x - vel * 55.0 * f0) / 22.0, q.y / 3.5));
  float n1 = ruido(vec2((q.x - vel * 55.0 * f1) / 22.0 + 17.3, q.y / 3.5 + 5.1));
  float veta = smoothstep(0.66, 0.9, mix(n0, n1, w)) * (1.0 - lago) * smoothstep(0.15, 0.6, vel);
  ```
- **La rapidez sale del modelo**: la misma función que da la forma (aquí, la asimetría por curvatura) da más velocidad junto a la orilla exterior. Si varios tramos tocan una celda, manda el más cercano.
- Material `transparent`, `depthWrite: false`, `roughness` ~0,1 y `envMapIntensity` ~1: el reflejo de entorno, solo en el agua.

## 10. Geometría orgánica

Una masa blanda con uniones suaves, surcos y abultamientos (órgano, célula, fruta, animal, roca erosionada). Con esferas y cilindros sueltos sale un muñeco de plastilina; lo real sale de tres cosas a la vez: **uniones suaves con pliegues donde toca**, **relieve en el material** y **lo que va encima (vasos, grasa) como geometría propia**.

**Forma: campo de distancia + marching cubes, una vez al arrancar.** Cada masa es un elipsoide, una cápsula o un tubo, unidos con `smin`. El `k` decide: grande (1-1,5 cm en un corazón) funde dos masas en una; pequeño (0,4-0,5) deja un **pliegue**, que es un surco anatómico o un cuello. Una envolvente exterior se suma con `smin` y no lleva cavidad.

```js
const smin = (a, b, k) => { const h = Math.max(k - Math.abs(a - b), 0) / k; return Math.min(a, b) - h * h * k * 0.25; };
const sdVent = (x, y, z) => smin(sdElipsoide(VI, x, y, z) - 1.1, sdElipsoide(VD, x, y, z) - 0.55, 1.3);   // una masa
const sdTodo = (x, y, z) => smin(sdVent(x, y, z), sdAuriculas(x, y, z), 0.45);                          // con surco
const geo = mallaMC(sdTodo, centro, lado, 84);   // MarchingCubes → mergeVertices → Taubin → normales
```

- **Coste**: lo caro es evaluar el campo en 84³-100³ nodos. Evaluar en tres niveles (cada 4, 2 y 1 nodos) interpolando donde `|d|` supera el paso, cotas baratas (caja o esfera) para saltar primitivas lejanas y nada de `Math.hypot` ni `Object.values` en el bucle: de 1,9 s a 0,3 s en Node. `mc.field` quiere el signo al revés (positivo dentro) e `isolation = 0`.
- **Escalonado**: `mergeVertices(g, 1e-4)` y 4 pasadas de **Taubin** (λ = 0,5, μ = −0,53) antes de `computeVertexNormals`: alisa sin adelgazar paredes. Los **tubos largos** (vasos, tallos) no van en el campo: `TubeGeometry` sobre una curva.
- **Deformar sin rehacer la malla** (latir, respirar, crecer): cada cavidad escala su interior y fuera el desplazamiento decae como 1/ρ², que conserva el volumen de la pared. Se precalculan dos vectores por vértice y cavidad (`P`, `Q`) y por fotograma solo se combinan con los factores de escala; la misma función mueve tubos, grasa y partículas, que así no se despegan. Posición de reposo en el atributo `aRef`.
- **Lo que va encima se coloca con el propio campo**: proyectar a la superficie con Newton (6-8 pasos); para un **surco**, buscar junto a una guía el punto donde las dos masas que lo forman están igual de cerca (`|dA − dB|` mínimo). Ahí van el vaso (`TubeGeometry` medio hundido) y la grasa como lóbulos (`IcosahedronGeometry(1, 2)` con `mergeVertices` —si no, facetado—, algo de ruido y escala desigual, en un `InstancedMesh`).
  ```js
  function aSuperficie(p) { for (let i = 0; i < 8; i++) { const d = sd(p.x, p.y, p.z); if (Math.abs(d) < 1e-3) break; p.addScaledVector(grad(p), -d); } return p; }
  ```

**Material: tejido húmedo con relieve procedural, sin UV.** `MeshPhysicalMaterial` (`roughness` 0,4-0,5, `clearcoat` 0,4-0,6: brillo de superficie mojada) y, en `onBeforeCompile`, un relieve sobre `aRef` aplicado con derivadas de pantalla. Sirve para mallas de marching cubes y tubos, que no tienen UV, y no resbala al deformarse:

```glsl
float altura(vec3 p) {   // p = vRef, en cm
  float n = 0.6 * ruido(p * uFrec) + 0.3 * ruido(p * uFrec * 2.3 + 3.1);
  float fib = sin(dot(p, vec3(0.52, 0.74, 0.42)) * uFrec * 9.0 + n * 3.0);   // estrías oblicuas
  return 0.5 * n + uFib * 0.5 * fib;
}
// tras #include <normal_fragment_maps>:
float hh = altura(vRef) * uRelieve;
vec3 sx = normalize(dFdx(-vViewPosition)), sy = normalize(dFdy(-vViewPosition)), r1 = cross(sy, normal), r2 = cross(normal, sx);
float det = dot(sx, r1) * faceDirection;
normal = normalize(abs(det) * normal - sign(det) * (dFdx(hh) * r1 + dFdy(hh) * r2));
// tras #include <color_fragment>: variación de tono
diffuseColor.rgb *= 0.86 + 0.26 * ruido(vRef * uFrec * 0.4 + 7.7);
```

- **La amplitud se calibra mirando de cerca**: `uRelieve` 0,02-0,05 no se ve; el músculo necesitó 0,14 (`uFrec` 1,25 por cm, estrías de ~0,5 cm) y la grasa 0,012 con frecuencia alta. Captura con una vista oculta muy cerca (`VISTAS.zoom = { …, oculta: true }`, `-v zoom`); a distancia normal el relieve se lee como «no es plástico».
- Una sola función de material con parámetros (`relieve`, `frec`, `fibras` y la sección de §5) para músculo, grasa y vasos, con `customProgramCacheKey` fijo: los uniformes siguen siendo de cada material.
- Coste medido (corazón): ~42 000 vértices de masa + 13 tubos + ~250 lóbulos, +0,3-0,6 s de arranque en la captura.

## 11. Partículas que conservan el caudal

Partículas que pasan por compartimentos separados por válvulas o compuertas (sangre, aire en los alvéolos, esclusas, un cruce), cuando **lo que enseña es cuándo se mueven y cuándo no**. Con perlas a velocidad fija por un conducto no se ve que con la válvula cerrada todo se detiene.

Cada partícula lleva una **etiqueta L** fija: el volumen que entró antes que ella. Del modelo sale en cada instante el **volumen acumulado** que ha cruzado cada frontera; la partícula está en el tramo cuyas dos fronteras la rodean, a la fracción que le toca. Con una válvula cerrada su contador no avanza y el tramo se queda quieto solo. Es función pura del tiempo y no deriva ciclo tras ciclo.

```js
// Contadores de un ciclo, normalizados para que sumen exactamente el volumen latido VL:
const Bsal = n * VL + salido(tc);          // lo que ha salido por la válvula de salida
const Bav = Bsal + Vventriculo(tc);        // lo que ha entrado por la de entrada = salido + lo que hay dentro
const Bin = Bav + Vauricula(tc), Bfin = Bsal - Vartería(tc);
for (let k = Math.ceil(Bfin / DV); k <= Math.floor((Bin + VVEN) / DV); k++) {
  const L = k * DV;
  if (L > Bin)       p = ruta(venas,   1 - (L - Bin) / VVEN, k);
  else if (L > Bav)  p = ruta(auricula, (Bin - L) / (Bin - Bav), k);
  else if (L > Bsal) p = ruta(ventriculo, (Bav - L) / (Bav - Bsal), k);
  else               p = ruta(arteria,  (Bsal - L) / (Bsal - Bfin), k);
}
```

- Las fronteras se construyen **desde los volúmenes** (salido + lo que hay dentro), no integrando cada caudal: así cada tramo tiene partículas en proporción a su volumen y nunca se crean ni se pierden.
- Desplazamiento lateral por partícula con un hash de `k`; dentro de una cavidad que se deforma, la misma deformación que la pared (§10). Con corte, detrás del plano (§5).
- Tamaño: ~2 mL por partícula y radio 0,2 cm dieron ~300 partículas legibles en un corazón de 20 cm; con 1,5 mL y 0,3 cm eran un amasijo.
