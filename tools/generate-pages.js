#!/usr/bin/env node
/* ============================================================
   Genera las páginas de cada mesa (20 mesas × 3 vistas):
     n/index.html              → home (Comidas | Bebidas)
     n/bebidasalcohol/index.html → destino QR
     n/comidas/index.html      → comidas
   Todas son copias idénticas de una plantilla; la lógica vive
   en assets/js/* y lee window.SCB (mesa / sección / base).
   Uso:  node tools/generate-pages.js
   ============================================================ */
"use strict";

const fs = require("fs");
const path = require("path");

const MESAS = 20;
const ROOT = path.join(__dirname, "..");

const SHELL = (base, mesa, section, sectionLabel) => `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <meta name="theme-color" content="#1a1210">
  <title>Mesa ${mesa} — Santa Elena Café | Bar</title>
  <link rel="stylesheet" href="${base}assets/css/styles.css">
</head>
<body>
  <div class="app" id="app"></div>

  <!-- Barra inferior del carrito -->
  <div class="cartbar" id="cartbar"></div>

  <!-- Carrito (drawer) -->
  <div class="overlay" id="overlay"></div>
  <aside class="drawer" id="drawer" aria-label="Carrito">
    <div class="drawer__head">
      <h2>Tu pedido · Mesa ${mesa}</h2>
      <button class="drawer__close" id="drawer-close" aria-label="Cerrar">✕</button>
    </div>
    <div class="drawer__body" id="drawer-body"></div>
    <div class="drawer__foot" id="drawer-foot"></div>
  </aside>

  <!-- Modal de confirmación / éxito / error del pedido -->
  <div class="modal" id="modal"></div>

  <script>
    window.SCB = { mesa: ${mesa}, section: "${section}", base: "${base}", sectionLabel: "${sectionLabel}" };
  </script>
  <script src="${base}config.js"></script>
  <script src="${base}assets/js/data.js"></script>
  <script src="${base}assets/js/cart.js"></script>
  <script src="${base}assets/js/order.js"></script>
  <script src="${base}assets/js/app.js"></script>
</body>
</html>
`;

const SECTIONS = [
  { dir: "", section: "home", label: "Inicio" },
  { dir: "bebidasalcohol", section: "bebidasalcohol", label: "Bebidas con licor" },
  { dir: "comidas", section: "comidas", label: "Comidas" }
];

let creadas = 0;

for (let mesa = 1; mesa <= MESAS; mesa++) {
  for (const sec of SECTIONS) {
    const dirPath = path.join(ROOT, String(mesa), sec.dir);
    fs.mkdirSync(dirPath, { recursive: true });

    // Profundidad relativa para volver a la raíz:
    //   1/index.html            → ../
    //   1/bebidasalcohol/index → ../../
    const depth = sec.dir ? 2 : 1;
    const base = "../".repeat(depth);

    const file = path.join(dirPath, "index.html");
    fs.writeFileSync(file, SHELL(base, mesa, sec.section, sec.label), "utf8");
    creadas++;
  }
}

console.log(`✓ ${creadas} páginas generadas (${MESAS} mesas × ${SECTIONS.length} vistas)`);
