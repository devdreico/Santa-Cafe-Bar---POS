/* ============================================================
   Santa Elena Café | Bar — App POS (glass, sin tabs)
   Por mesa solo 2 secciones: Comidas y Bebidas.
   Cada sección: hero → "Los más pedidos" → catálogo continuo
   con encabezados de subcategoría (3 col desktop / 2 col móvil).
   ============================================================ */
(function () {
  "use strict";

  var CFG = window.SCB_CONFIG;
  var DATA = window.SCB_DATA;
  var Cart = window.SCB_Cart;
  var Order = window.SCB_Order;
  var SCB = window.SCB; // { mesa, section, base }

  var root = document.getElementById("app");
  if (!root) return;

  /* ---------- Tercer blob del fondo ---------- */
  var blob = document.createElement("div");
  blob.className = "blob blob--peach";
  document.body.prepend(blob);

  /* ---------- Iconos SVG (formales, stroke, currentColor) ---------- */
  var ICONS = {
    utensils:
      '<path d="M3 2v7a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V2"/>' +
      '<path d="M7 2v20"/>' +
      '<path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3zm0 0v7"/>',
    martini:
      '<path d="M4 4h16l-8 9z"/>' +
      '<path d="M12 13v6"/>' +
      '<path d="M8.5 19.5h7"/>',
    beer:
      '<path d="M6.5 8h10v10.5a3 3 0 0 1-3 3h-4a3 3 0 0 1-3-3V8z"/>' +
      '<path d="M16.5 10.5H19a2.5 2.5 0 0 1 0 5h-2.5"/>' +
      '<path d="M6.5 8V6.2A2.2 2.2 0 0 1 8.7 4h3.6a2.2 2.2 0 0 1 2.2 2.2V8"/>' +
      '<path d="M9.8 12v6M13.2 12v6"/>',
    coffee:
      '<path d="M17 8h1a3.5 3.5 0 0 1 0 7h-1"/>' +
      '<path d="M3 8h14v7.5A4.5 4.5 0 0 1 12.5 20h-5A4.5 4.5 0 0 1 3 15.5V8z"/>' +
      '<path d="M6.5 2.5V5M10 2.5V5M13.5 2.5V5"/>',
    snowflake:
      '<path d="M12 2.5v19"/>' +
      '<path d="M4.2 7l15.6 10M19.8 7L4.2 17"/>' +
      '<path d="M9.5 4.8 12 6.5l2.5-1.7M9.5 19.2 12 17.5l2.5 1.7"/>' +
      '<path d="M5.2 10.4 4.4 7.6l2.9-.6M18.8 13.6l.8 2.8-2.9.6"/>' +
      '<path d="M5.2 13.6l-2.9.6.8 2.8M18.8 10.4l2.9-.6-.8-2.8"/>',
    gift:
      '<rect x="3.5" y="8" width="17" height="4.5" rx="1.5"/>' +
      '<path d="M5 12.5V19a2.5 2.5 0 0 0 2.5 2.5h9A2.5 2.5 0 0 0 19 19v-6.5"/>' +
      '<path d="M12 8v13.5"/>' +
      '<path d="M12 8S10.8 3 8.2 3 5.6 6.8 9.4 8h2.6z"/>' +
      '<path d="M12 8s1.2-5 3.8-5S18.4 6.8 14.6 8H12z"/>',
    plate:
      '<circle cx="12" cy="12" r="9"/>' +
      '<circle cx="12" cy="12" r="4.2"/>',
    star:
      '<path d="M12 3.2l2.7 5.5 6.1.9-4.4 4.3 1 6.1L12 17.1l-5.4 2.9 1-6.1L3.2 9.6l6.1-.9z"/>',
    bag:
      '<path d="M6 2.5 3 6.5v13.5a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6.5l-3-4z"/>' +
      '<path d="M3 6.5h18"/>' +
      '<path d="M16 10.5a4 4 0 0 1-8 0"/>',
    pin:
      '<path d="M20 10.5c0 6-8 11.5-8 11.5s-8-5.5-8-11.5a8 8 0 0 1 16 0z"/>' +
      '<circle cx="12" cy="10.3" r="2.8"/>',
    x:
      '<path d="M18 6 6 18M6 6l12 12"/>',
    check:
      '<path d="M20 6.5 9.5 17 4.5 12"/>',
    alert:
      '<circle cx="12" cy="12" r="9"/>' +
      '<path d="M12 7.2v5.6"/>' +
      '<path d="M12 16.4h.01"/>',
    copy:
      '<rect x="8.5" y="8.5" width="12" height="12" rx="2.5"/>' +
      '<path d="M16 8.5V6A2.5 2.5 0 0 0 13.5 3.5h-8A2.5 2.5 0 0 0 3 6v8A2.5 2.5 0 0 0 5.5 16.5H8"/>',
    message:
      '<path d="M21 11.5a8.5 8.5 0 0 1-9.2 8.5 9.7 9.7 0 0 1-3.8-.9L3 21l1.9-4.6A8.5 8.5 0 0 1 12 3a8.5 8.5 0 0 1 9 8.5z"/>',
    info:
      '<circle cx="12" cy="12" r="9"/>' +
      '<path d="M12 16.5V11.5"/>' +
      '<path d="M12 7.6h.01"/>',
    camera:
      '<rect x="3" y="6.5" width="18" height="13.5" rx="2.5"/>' +
      '<circle cx="12" cy="13.3" r="3.6"/>' +
      '<path d="M8.2 6.5 9.4 4.3h5.2l1.2 2.2"/>',
    plus:
      '<path d="M12 5.5v13M5.5 12h13"/>',
    minus:
      '<path d="M5.5 12h13"/>',
    printer:
      '<path d="M6.5 9.5V3.5h11v6"/>' +
      '<rect x="3" y="9.5" width="18" height="7.5" rx="2"/>' +
      '<rect x="6.5" y="14" width="11" height="6.5" rx="1.5"/>',
    refresh:
      '<path d="M20.5 12a8.5 8.5 0 1 1-2.5-6"/>' +
      '<path d="M20.5 3.5V9H15"/>',
    qr:
      '<rect x="3.5" y="3.5" width="7" height="7" rx="1.5"/>' +
      '<rect x="13.5" y="3.5" width="7" height="7" rx="1.5"/>' +
      '<rect x="3.5" y="13.5" width="7" height="7" rx="1.5"/>' +
      '<path d="M13.5 13.5h3.2v3.2h-3.2z"/>' +
      '<path d="M20.5 13.5v3.2M17.5 20.5h3M13.5 20.5h.01"/>'
  };

  function ico(nombre, clase, size) {
    var d = ICONS[nombre];
    if (!d) return "";
    size = size || 24;
    return (
      '<svg class="ico ' + (clase || "") + '" viewBox="0 0 24 24" width="' + size + '" height="' + size +
      '" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      d + "</svg>"
    );
  }

  /* ---------- Índice plano de productos ---------- */
  var PRODUCTOS = {};
  (function indexar() {
    function walk(items) {
      for (var i = 0; i < items.length; i++) PRODUCTOS[items[i].id] = items[i];
    }
    walk(DATA.comidas.paquetes.items);
    walk(DATA.comidas.restaurante.items);
    walk(DATA.bebidas.licores.cerveza.items);
    walk(DATA.bebidas.licores.destilados.items);
    walk(DATA.bebidas.sinAlcohol.calientes.items);
    walk(DATA.bebidas.sinAlcohol.frias.items);
  })();

  /* ---------- Definición de las 2 secciones ---------- */
  var SECCIONES = {
    bebidasalcohol: {
      titulo: "Bebidas",
      subtitulo: "Licores y bebidas sin alcohol",
      cross: { ir: "comidas", label: "¿Te interesa comer?" },
      grupos: [
        { key: "cerveza", label: "Cerveza", icono: "beer", color: "var(--cat-cerveza)", items: DATA.bebidas.licores.cerveza.items },
        { key: "destilados", label: "Destilados", icono: "martini", color: "var(--cat-destilados)", items: DATA.bebidas.licores.destilados.items },
        { key: "calientes", label: "Calientes", icono: "coffee", color: "var(--cat-calientes)", items: DATA.bebidas.sinAlcohol.calientes.items },
        { key: "frias", label: "Frías", icono: "snowflake", color: "var(--cat-frias)", items: DATA.bebidas.sinAlcohol.frias.items }
      ]
    },
    comidas: {
      titulo: "Comidas",
      subtitulo: "Paquetes y carta de restaurante",
      cross: { ir: "bebidasalcohol", label: "¿Quieres beber?" },
      grupos: [
        { key: "paquetes", label: "Paquetes", icono: "gift", color: "var(--cat-paquetes)", items: DATA.comidas.paquetes.items },
        { key: "restaurante", label: "Restaurante", icono: "plate", color: "var(--cat-restaurante)", items: DATA.comidas.restaurante.items }
      ]
    }
  };

  /* ---------- Helpers ---------- */
  function url(mesa, section) {
    var prefix = section ? section + "/" : "";
    return SCB.base + mesa + "/" + prefix;
  }

  function irA(section) {
    location.href = url(SCB.mesa, section);
  }

  function fmt(n) { return Cart.format(n); }

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function toast(msg) {
    var el = document.querySelector(".toast");
    if (!el) {
      el = document.createElement("div");
      el.className = "toast";
      document.body.appendChild(el);
    }
    el.textContent = msg;
    el.classList.add("is-show");
    clearTimeout(el._t);
    el._t = setTimeout(function () { el.classList.remove("is-show"); }, 1400);
  }

  function seccion() {
    return SECCIONES[SCB.section] || null;
  }

  function masVendidosDe(sec) {
    var out = [];
    for (var g = 0; g < sec.grupos.length; g++) {
      var items = sec.grupos[g].items;
      for (var i = 0; i < items.length; i++) {
        if (items[i].masVendido) out.push(items[i]);
      }
    }
    return out.slice(0, 4);
  }

  /* ============================================================
     RENDER
     ============================================================ */
  function render() {
    var sec = seccion();
    root.innerHTML = sec ? renderVistaSecccion(sec) : renderHome();
    renderCartbar();
    bind();
  }

  /* ---------- Home de la mesa ---------- */
  function renderHome() {
    return (
      '<div class="home">' +
        '<div class="home__hero">' +
          '<img src="' + SCB.base + 'assets/santa-cafe-bar-logo.png" alt="Santa Elena Café | Bar">' +
          "<h1>" + esc(CFG.NOMBRE_LOCAL) + "</h1>" +
          "<p>¡Bienvenido! ¿Qué se te antoja?</p>" +
        "</div>" +
        '<div class="home__mesa-banner">' + ico("pin", "", 15) + " Estás pidiendo para la Mesa " + SCB.mesa + "</div>" +
        '<div class="home__split">' +
          '<button class="home__choice" data-ir="bebidasalcohol">' +
            '<span class="home__icon">' + ico("martini", "", 44) + "</span>" +
            "<strong>Bebidas</strong>" +
            "<span>Licores y sin alcohol</span>" +
          "</button>" +
          '<button class="home__choice" data-ir="comidas">' +
            '<span class="home__icon">' + ico("utensils", "", 44) + "</span>" +
            "<strong>Comidas</strong>" +
            "<span>Paquetes y restaurante</span>" +
          "</button>" +
        "</div>" +
      "</div>"
    );
  }

  /* ---------- Vista de sección ---------- */
  function renderVistaSecccion(sec) {
    var esBebidas = SCB.section === "bebidasalcohol";

    // Header centrado con logo grande
    var html =
      '<header class="header">' +
        '<img class="header__logo" src="' + SCB.base + 'assets/santa-cafe-bar-logo.png" alt="">' +
        '<div class="header__title">' + esc(CFG.NOMBRE_LOCAL) + "</div>" +
        '<div class="header__subtitle">Menú digital</div>' +
        '<div class="header__mesa">Mesa ' + SCB.mesa + "</div>" +
      "</header>" +
      '<nav class="topnav">' +
        '<button class="topnav__btn' + (!esBebidas ? " is-active" : "") + '" data-ir="comidas">Comidas</button>' +
        '<button class="topnav__btn' + (esBebidas ? " is-active" : "") + '" data-ir="bebidasalcohol">Bebidas</button>' +
      "</nav>" +
      // Hero
      '<section class="hero glass">' +
        '<div class="hero__text">' +
          "<h1>" + esc(sec.titulo) + "</h1>" +
          "<p>" + esc(sec.subtitulo) + "</p>" +
        "</div>" +
        '<button class="cross-chip" data-ir="' + sec.cross.ir + '">' + esc(sec.cross.label) + "</button>" +
      "</section>";

    // Los más pedidos
    var best = masVendidosDe(sec);
    if (best.length > 0) {
      html +=
        '<section class="best">' +
          '<div class="best__head">' + ico("star", "best__star", 16) + "<h2>Los más pedidos</h2></div>" +
          '<div class="best__strip">';
      for (var i = 0; i < best.length; i++) {
        html += renderBestCard(best[i], i);
      }
      html += "</div></section>";
    }

    // Catálogo continuo con encabezados inline
    html += '<section class="catalog">';
    for (var g = 0; g < sec.grupos.length; g++) {
      var grupo = sec.grupos[g];
      html +=
        '<div class="cat">' +
          '<div class="cat-head" style="--cat-color:' + grupo.color + ';animation-delay:' + (g * 60) + 'ms">' +
            '<span class="cat-head__icon">' + ico(grupo.icono, "", 17) + "</span>" +
            "<h3>" + esc(grupo.label) + "</h3>" +
            "<span>" + grupo.items.length + " opciones</span>" +
          "</div>" +
          '<div class="grid">';
      for (var j = 0; j < grupo.items.length; j++) {
        html += renderCard(grupo.items[j], g * 4 + j);
      }
      html += "</div></div>";
    }
    html += "</section>";

    return html;
  }

  function fotoHtml(p, clase) {
    if (p.img) {
      return '<div class="' + clase + '"><img src="' + esc(p.img) + '" alt="' + esc(p.nombre) + '" loading="lazy"></div>';
    }
    return '<div class="' + clase + '">' + ico("camera", "ico--placeholder", 26) + "</div>";
  }

  function renderBestCard(p, idx) {
    return (
      '<article class="best-card" style="animation-delay:' + (150 + idx * 70) + 'ms">' +
        '<span class="best-card__tag">Top</span>' +
        fotoHtml(p, "card__photo") +
        '<div class="best-card__name">' + esc(p.nombre) + "</div>" +
        '<div class="best-card__row">' +
          '<span class="best-card__price">' + fmt(p.precio) + "</span>" +
        "</div>" +
        '<button class="btn-add" data-add-btn="' + p.id + '">Agregar al pedido</button>' +
      "</article>"
    );
  }

  function renderCard(p, idx) {
    return (
      '<article class="card" style="animation-delay:' + Math.min(idx * 35, 500) + 'ms">' +
        fotoHtml(p, "card__photo") +
        '<div class="card__name">' + esc(p.nombre) + "</div>" +
        '<div class="card__price">' + fmt(p.precio) + "</div>" +
        '<button class="btn-add" data-add-btn="' + p.id + '">Agregar al pedido</button>' +
      "</article>"
    );
  }

  /* ---------- Barra inferior del carrito ---------- */
  function renderCartbar() {
    var el = document.getElementById("cartbar");
    var n = Cart.count();
    var total = Cart.total();
    el.innerHTML =
      '<div class="cartbar__inner">' +
        '<button class="cartbar__btn' + (n === 0 ? " is-empty" : "") + '" id="cartbar-btn">' +
          "<span class=\"cartbar__label\">" + ico("bag", "", 17) + " Ver carrito</span>" +
          (n > 0
            ? '<span class="cartbar__count">' + n + " producto" + (n === 1 ? "" : "s") + "</span><span>" + fmt(total) + "</span>"
            : "<span>Agrega productos</span>") +
        "</button>" +
      "</div>";
    document.getElementById("cartbar-btn").addEventListener("click", function () {
      if (Cart.count() === 0) {
        toast("Aún no has agregado nada");
        return;
      }
      openDrawer();
    });
  }

  function bumpCartbar() {
    var btn = document.getElementById("cartbar-btn");
    if (!btn) return;
    btn.classList.remove("bump");
    void btn.offsetWidth;
    btn.classList.add("bump");
  }

  /* ---------- Drawer del carrito ---------- */
  function openDrawer() {
    document.getElementById("overlay").classList.add("is-open");
    document.getElementById("drawer").classList.add("is-open");
    renderDrawerBody();
  }

  function closeDrawer() {
    document.getElementById("overlay").classList.remove("is-open");
    document.getElementById("drawer").classList.remove("is-open");
  }

  function renderDrawerBody() {
    var body = document.getElementById("drawer-body");
    var foot = document.getElementById("drawer-foot");
    var items = Cart.items();

    if (items.length === 0) {
      body.innerHTML =
        '<div class="drawer__empty">' + ico("bag", "ico--empty", 34) +
        "<br>Tu carrito está vacío.<br>Agrega algo del menú.</div>";
      foot.innerHTML = '<button class="btn-ghost" id="drawer-close-2">Seguir viendo el menú</button>';
      document.getElementById("drawer-close-2").addEventListener("click", closeDrawer);
      return;
    }

    var html = "";
    for (var i = 0; i < items.length; i++) {
      var it = items[i];
      html +=
        '<div class="line">' +
          '<div class="line__info">' +
            '<div class="line__name">' + esc(it.nombre) + "</div>" +
            '<div class="line__unit">' + fmt(it.precio) + " c/u</div>" +
          "</div>" +
          '<div class="line__qty">' +
            '<button data-dec="' + it.id + '" aria-label="Restar">' + ico("minus", "", 13) + "</button>" +
            "<span>" + it.qty + "</span>" +
            '<button data-inc="' + it.id + '" aria-label="Sumar">' + ico("plus", "", 13) + "</button>" +
          "</div>" +
          '<div class="line__sub">' + fmt(it.qty * it.precio) + "</div>" +
          '<button class="line__remove" data-del="' + it.id + '" aria-label="Quitar">' + ico("x", "", 14) + "</button>" +
        "</div>";
    }
    body.innerHTML = html;

    var total = Cart.total();
    var n = Cart.count();
    foot.innerHTML =
      '<div class="drawer__totals"><span>' + n + " producto" + (n === 1 ? "" : "s") + "</span><span>Envío: en el bar</span></div>" +
      '<div class="drawer__total"><span>Total</span><span class="valor">' + fmt(total) + "</span></div>" +
      '<button class="btn-primary" id="btn-pedir">Pedir</button>' +
      '<button class="btn-ghost" id="btn-vaciar">Vaciar carrito</button>';

    body.querySelectorAll("[data-inc]").forEach(function (b) {
      b.addEventListener("click", function () { Cart.inc(b.getAttribute("data-inc")); });
    });
    body.querySelectorAll("[data-dec]").forEach(function (b) {
      b.addEventListener("click", function () { Cart.dec(b.getAttribute("data-dec")); });
    });
    body.querySelectorAll("[data-del]").forEach(function (b) {
      b.addEventListener("click", function () { Cart.remove(b.getAttribute("data-del")); });
    });
    document.getElementById("btn-pedir").addEventListener("click", openConfirm);
    document.getElementById("btn-vaciar").addEventListener("click", function () {
      if (confirm("¿Vaciar todo el carrito?")) Cart.clear();
    });
  }

  /* ---------- Modal: confirmar pedido / mesa ---------- */
  var mesaPedido = SCB.mesa;

  function openConfirm() {
    mesaPedido = SCB.mesa;
    closeDrawer();
    renderConfirm();
    document.getElementById("modal").classList.add("is-open");
  }

  function renderConfirm() {
    var items = Cart.items();
    var total = Cart.total();
    var resumen = items.map(function (it) {
      return it.qty + " x " + it.nombre;
    }).join("\n");

    document.getElementById("modal").innerHTML =
      '<div class="modal__card">' +
        '<div class="modal__icon modal__icon--confirm">' + ico("plate", "", 28) + "</div>" +
        "<h2>Confirmar pedido</h2>" +
        "<p>Revisa tu comanda antes de enviarla a cocina</p>" +
        '<div class="modal__mesa">' + ico("pin", "", 14) + " Mesa " + mesaPedido + " · detectada automáticamente</div>" +
        '<div><button class="modal__change-mesa" id="btn-cambiar-mesa">¿Es otra mesa? Cambiar</button></div>' +
        '<div id="mesa-picker-wrap" style="display:none">' +
          '<div class="mesa-picker" id="mesa-picker"></div>' +
        "</div>" +
        '<div class="modal__resumen">' + esc(resumen) + "\n\nTOTAL: " + fmt(total) + "</div>" +
        '<div class="modal__actions">' +
          '<button class="btn-primary" id="btn-enviar">Enviar comanda a cocina</button>' +
          '<button class="btn-ghost" id="btn-cancelar">Seguir pidiendo</button>' +
        "</div>" +
      "</div>";

    document.getElementById("btn-cancelar").addEventListener("click", closeModal);
    document.getElementById("btn-enviar").addEventListener("click", enviarPedido);
    document.getElementById("btn-cambiar-mesa").addEventListener("click", function () {
      var wrap = document.getElementById("mesa-picker-wrap");
      wrap.style.display = wrap.style.display === "none" ? "block" : "none";
      renderMesaPicker();
    });
    renderMesaPicker();
  }

  function renderMesaPicker() {
    var wrap = document.getElementById("mesa-picker");
    if (!wrap) return;
    var html = "";
    for (var i = 1; i <= CFG.MESAS; i++) {
      html += '<button data-mesa="' + i + '"' + (i === mesaPedido ? ' class="is-selected"' : "") + ">" + i + "</button>";
    }
    wrap.innerHTML = html;
    wrap.querySelectorAll("[data-mesa]").forEach(function (b) {
      b.addEventListener("click", function () {
        mesaPedido = parseInt(b.getAttribute("data-mesa"), 10);
        renderConfirm();
      });
    });
  }

  function closeModal() {
    document.getElementById("modal").classList.remove("is-open");
  }

  function enviarPedido() {
    var btn = document.getElementById("btn-enviar");
    var items = Cart.items();
    var total = Cart.total();
    if (items.length === 0) { closeModal(); return; }

    btn.disabled = true;
    btn.textContent = "Enviando…";

    Order.enviar(mesaPedido, items, total)
      .then(function (res) {
        showExito(res.demo);
        Cart.clear();
      })
      .catch(function () {
        showError(Order.textoComanda(mesaPedido, items, total));
      });
  }

  function showExito(demo) {
    document.getElementById("modal").innerHTML =
      '<div class="modal__card">' +
        '<div class="modal__icon modal__icon--ok">' +
          '<svg class="check-svg" viewBox="0 0 44 44"><circle cx="22" cy="22" r="19"/><path d="M13 22.5l6 6 12-13"/></svg>' +
        "</div>" +
        "<h2>¡Comanda enviada!</h2>" +
        "<p>Cocina y bar ya recibieron tu pedido.<br>La mesa es la <strong>Mesa " + mesaPedido + "</strong>.</p>" +
        (demo ? '<p style="font-size:12px;margin-top:8px;">(modo demo: no se envió a Formspree todavía — configura tu endpoint en <code>config.js</code>)</p>' : "") +
        '<div class="modal__actions">' +
          '<button class="btn-primary" id="btn-seguir">Seguir pidiendo</button>' +
        "</div>" +
      "</div>";
    document.getElementById("btn-seguir").addEventListener("click", closeModal);
  }

  function showError(texto) {
    var wa = Order.linkWhatsApp(texto);
    document.getElementById("modal").innerHTML =
      '<div class="modal__card">' +
        '<div class="modal__icon modal__icon--err">' + ico("alert", "", 28) + "</div>" +
        "<h2>No se pudo enviar</h2>" +
        "<p>Revisa tu conexión o pide ayuda al mesero.<br>Tu carrito se mantiene guardado.</p>" +
        '<div class="modal__actions">' +
          '<button class="btn-primary" id="btn-reintentar">Reintentar</button>' +
          '<button class="btn-ghost" id="btn-copiar">' + ico("copy", "", 14) + " Copiar comanda</button>" +
          (wa ? '<a class="btn-ghost btn-ghost--link" href="' + wa + '" target="_blank" rel="noopener">' + ico("message", "", 14) + " Enviar por WhatsApp</a>" : "") +
          '<button class="btn-ghost" id="btn-cerrar-err">Cerrar</button>' +
        "</div>" +
      "</div>";

    document.getElementById("btn-reintentar").addEventListener("click", renderConfirm);
    document.getElementById("btn-cerrar-err").addEventListener("click", closeModal);
    document.getElementById("btn-copiar").addEventListener("click", function () {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(texto).then(function () { toast("Comanda copiada"); });
      } else {
        var ta = document.createElement("textarea");
        ta.value = texto;
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand("copy"); toast("Comanda copiada"); } catch (e) {}
        document.body.removeChild(ta);
      }
    });
  }

  /* ---------- Eventos (solo el botón "Agregar al pedido" reacciona) ---------- */
  function bind() {
    root.querySelectorAll("[data-ir]").forEach(function (b) {
      b.addEventListener("click", function () { irA(b.getAttribute("data-ir")); });
    });

    root.querySelectorAll("[data-add-btn]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var p = PRODUCTOS[btn.getAttribute("data-add-btn")];
        if (!p) return;
        Cart.add(p);
        toast("Agregado: " + p.nombre);
        btn.classList.remove("pulse");
        void btn.offsetWidth;
        btn.classList.add("pulse");
      });
    });
  }

  /* ---------- Cambios del carrito ---------- */
  Cart.onChange(function () {
    renderCartbar();
    bumpCartbar();
    var drawer = document.getElementById("drawer");
    if (drawer && drawer.classList.contains("is-open")) renderDrawerBody();
  });

  document.getElementById("overlay").addEventListener("click", closeDrawer);
  document.getElementById("drawer-close").addEventListener("click", closeDrawer);

  render();
})();
