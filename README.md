# ☕🥃 Santa Elena Café | Bar — POS / Menú digital

Sistema de pedidos desde la mesa (POS digital) para **Santa Elena Café | Bar**.
El cliente escanea el QR de su mesa, arma su carrito con autosuma y envía la
comanda directo a cocina/bartender vía **Formspree**. 100% estático (HTML/CSS/JS),
listo para `santahelenabar.presentto.online`.

**Diseño:** minimalista oscuro (fondo espresso, glass sutil, acentos pastel
naranja/café, tipografía **Montserrat bold**). Header centrado con logo grande.
Por mesa solo **2 secciones: Comidas y Bebidas**, con bloque **"⭐ Los más pedidos"**
arriba y el catálogo continuo debajo (3 columnas desktop / 2 móvil).
Cada card tiene **espacio para 1 foto** (placeholder hasta asignar `img` en
`data.js`) y solo el botón **"Agregar al pedido"** reacciona al clic.

## ✨ Funcionalidades

- **20 mesas** con página propia: `santahelenabar.presentto.online/1` … `/20`
  (el sistema sabe en qué mesa estás desde la URL — nunca hay que digitarla).
- **Flujo QR**: el código de la mesa apunta a `/{mesa}/bebidasalcohol`
  (entra directo a **Bebidas → Licores → Cerveza/Destilados**).
- En cada pantalla, un chip pequeño **"¿Te interesa comer?"** (y **"¿Quieres beber?"**
  al revés) para alternar entre Bebidas y Comidas.
- **Árbol de menú** (flujo continuo sin tabs):
  - **Comidas** → Paquetes / Restaurante → productos
  - **Bebidas** → Cerveza / Destilados / Calientes / Frías → productos
- **⭐ Los más pedidos:** bloque destacado al inicio de cada sección alimentado
  por el flag `masVendido: true` en `assets/js/data.js`
  (los actuales son placeholders — reemplázalos por los reales cuando los tengas).
- **Carrito con autosuma instantánea** (barra inferior siempre visible), cantidades ±,
  persistencia por mesa en `localStorage` (no se pierde al recargar).
- **"Pedir"**: confirma la mesa (auto-detectada, con opción de cambiar) y envía la
  comanda a **Formspree**. Pantalla de éxito, o fallback con *Reintentar*,
  *Copiar comanda* y (opcional) *Enviar por WhatsApp*.
- **Modo demo**: mientras el endpoint de Formspree siga como `PLACEHOLDER`,
  el pedido "se envía" simulado (se ve todo en consola del navegador).

## 🚀 Publicar

1. Sube **todo** el contenido de este repo a `santahelenabar.presentto.online`
   (carpetas `1/` … `20/`, `assets/`, `qr/`, `index.html`, `config.js`).
2. Abre `https://santahelenabar.presentto.online/` → aparece
   **"¿En qué mesa te encuentras?"** con la cuadrícula 1–20.
3. Abre `https://santahelenabar.presentto.online/qr/` → genera/imprime los
   20 códigos QR (cada uno entra a `/{mesa}/bebidasalcohol`).

## 📬 Conectar Formspree (para recibir comandas reales)

1. Crea cuenta en [formspree.io](https://formspree.io) y un formulario nuevo (modo JSON).
2. Copia el endpoint, por ejemplo: `https://formspree.io/f/abcdeXYZ`.
3. Edita **`config.js`** y reemplaza el placeholder:

```js
FORMSPREE_ENDPOINT: "https://formspree.io/f/abcdeXYZ",
```

Enviará: asunto, mesa, hora, ítems, total y la comanda en texto plano.
Mientras no lo hagas, corre en **modo demo** (nada se envía).

Opcional en `config.js`:

```js
WHATSAPP: "584121234567"  // si el envío falla, aparece botón de WhatsApp
```

## 🗂 Estructura

```
index.html               → Selector "¿En qué mesa te encuentras?" (1–20)
config.js                → Endpoint Formspree, moneda (COP), WhatsApp
1/ … 20/                 → 20 mesas × 3 vistas (generadas):
   ├── index.html            → home: Comidas | Bebidas
   ├── bebidasalcohol/       → destino del QR
   └── comidas/
qr/index.html            → Generador/imprimible de QRs por mesa (staff)
assets/
   ├── css/styles.css     → tema espresso + dorado, mobile-first
   ├── js/data.js         → catálogo simulado (precios COP)
   ├── js/cart.js         → carrito + autosuma (localStorage por mesa)
   ├── js/order.js        → comanda → Formspree (+ fallback)
   └── js/app.js          → vistas, tabs, carrito UI, pedidos
tools/generate-pages.js   → regenera las 60 páginas de mesa
```

## 🛠 Comandos útiles

```bash
# Probar en local
python3 -m http.server 8000
# → http://localhost:8000/   (selector de mesas)
# → http://localhost:8000/2/bebidasalcohol/   (como si escanearas el QR de la mesa 2)

# Regenerar páginas si cambias el número de mesas (en tools/generate-pages.js)
node tools/generate-pages.js
```

## ✏️ Editar productos

Todo el catálogo está en **`assets/js/data.js`** (nombre, descripción y precio en COP).
Agrega o quita objetos; no hace falta regenerar nada.

> Si cambias la cantidad de mesas, actualiza `MESAS` en `config.js`,
> en `index.html`, en `qr/index.html` y en `tools/generate-pages.js`,
> y vuelve a ejecutar `node tools/generate-pages.js`.
