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
      emoji: "🥃",
      subtitulo: "Licores y bebidas sin alcohol",
      cross: { ir: "comidas", label: "¿Te interesa comer?" },
      grupos: [
        { key: "cerveza", label: "Cerveza", icono: "🍺", color: "var(--cat-cerveza)", items: DATA.bebidas.licores.cerveza.items },
        { key: "destilados", label: "Destilados", icono: "🥃", color: "var(--cat-destilados)", items: DATA.bebidas.licores.destilados.items },
        { key: "calientes", label: "Calientes", icono: "☕", color: "var(--cat-calientes)", items: DATA.bebidas.sinAlcohol.calientes.items },
        { key: "frias", label: "Frías", icono: "🧊", color: "var(--cat-frias)", items: DATA.bebidas.sinAlcohol.frias.items }
      ]
    },
    comidas: {
      titulo: "Comidas",
      emoji: "🍽️",
      subtitulo: "Paquetes y carta de restaurante",
      cross: { ir: "bebidasalcohol", label: "¿Quieres beber?" },
      grupos: [
        { key: "paquetes", label: "Paquetes", icono: "🎁", color: "var(--cat-paquetes)", items: DATA.comidas.paquetes.items },
        { key: "restaurante", label: "Restaurante", icono: "🍽️", color: "var(--cat-restaurante)", items: DATA.comidas.restaurante.items }
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
        '<div class="home__hero shine">' +
          '<img src="' + SCB.base + 'assets/santa-cafe-bar-logo.png" alt="Santa Elena Café | Bar">' +
          "<h1>" + esc(CFG.NOMBRE_LOCAL) + "</h1>" +
          "<p>¡Bienvenido! ¿Qué se te antoja?</p>" +
        "</div>" +
        '<div class="home__mesa-banner">📍 Estás pidiendo para la Mesa ' + SCB.mesa + "</div>" +
        '<div class="home__split">' +
          '<button class="home__choice shine" data-ir="bebidasalcohol">' +
            '<span class="emoji">🥃</span>' +
            "<strong>Bebidas</strong>" +
            "<span>Licores y sin alcohol</span>" +
          "</button>" +
          '<button class="home__choice shine" data-ir="comidas">' +
            '<span class="emoji">🍽️</span>' +
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

    // Header
    var html =
      '<header class="header glass shine">' +
        '<img class="header__logo" src="' + SCB.base + 'assets/santa-cafe-bar-logo.png" alt="">' +
        '<div class="header__brand">' +
          '<div class="header__title">' + esc(CFG.NOMBRE_LOCAL) + "</div>" +
          '<div class="header__subtitle">Menú digital</div>' +
        "</div>" +
        '<div class="header__mesa">Mesa ' + SCB.mesa + "</div>" +
      "</header>" +
      '<nav class="topnav">' +
        '<button class="topnav__btn' + (!esBebidas ? " is-active" : "") + '" data-ir="comidas">🍽️ Comidas</button>' +
        '<button class="topnav__btn' + (esBebidas ? " is-active" : "") + '" data-ir="bebidasalcohol">🥃 Bebidas</button>' +
      "</nav>" +
      // Hero
      '<section class="hero glass shine">' +
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
          '<div class="best__head"><span class="spark">⭐</span><h2>Los más pedidos</h2></div>' +
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
            '<span class="cat-head__dot"></span>' +
            "<h3>" + grupo.icono + " " + esc(grupo.label) + "</h3>" +
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

  function renderBestCard(p, idx) {
    var qty = Cart.qtyOf(p.id);
    return (
      '<article class="best-card shine" data-add="' + p.id + '" style="animation-delay:' + (150 + idx * 70) + 'ms">' +
        (qty > 0 ? '<span class="card__badge">' + qty + "</span>" : "") +
        '<span class="best-card__tag">Top</span>' +
        '<div class="best-card__name">' + esc(p.nombre) + "</div>" +
        '<div class="best-card__desc">' + esc(p.desc) + "</div>" +
        '<div class="best-card__row">' +
          '<span class="best-card__price">' + fmt(p.precio) + "</span>" +
          '<button class="card__add" data-add-btn="' + p.id + '" aria-label="Agregar ' + esc(p.nombre) + '">+</button>' +
        "</div>" +
      "</article>"
    );
  }

  function renderCard(p, idx) {
    var qty = Cart.qtyOf(p.id);
    return (
      '<article class="card" data-add="' + p.id + '" style="animation-delay:' + Math.min(idx * 35, 500) + 'ms">' +
        (qty > 0 ? '<span class="card__badge">' + qty + "</span>" : "") +
        '<div class="card__name">' + esc(p.nombre) + "</div>" +
        '<div class="card__desc">' + esc(p.desc) + "</div>" +
        '<div class="card__row">' +
          '<span class="card__price">' + fmt(p.precio) + "</span>" +
          '<button class="card__add" data-add-btn="' + p.id + '" aria-label="Agregar ' + esc(p.nombre) + '">+</button>' +
        "</div>" +
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
          "<span>🛒 Ver carrito</span>" +
          (n > 0
            ? '<span class="cartbar__count">' + n + " producto" + (n === 1 ? "" : "s") + "</span><span>" + fmt(total) + "</span>"
            : "<span>Agrega algo rico</span>") +
        "</button>" +
      "</div>";
    document.getElementById("cartbar-btn").addEventListener("click", function () {
      if (Cart.count() === 0) {
        toast("Aún no has agregado nada 🙂");
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
      body.innerHTML = '<div class="drawer__empty">Tu carrito está vacío.<br>¡Agrega algo rico! 🍹</div>';
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
            '<button data-dec="' + it.id + '">−</button>' +
            "<span>" + it.qty + "</span>" +
            '<button data-inc="' + it.id + '">+</button>' +
          "</div>" +
          '<div class="line__sub">' + fmt(it.qty * it.precio) + "</div>" +
          '<button class="line__remove" data-del="' + it.id + '" aria-label="Quitar">✕</button>' +
        "</div>";
    }
    body.innerHTML = html;

    var total = Cart.total();
    var n = Cart.count();
    foot.innerHTML =
      '<div class="drawer__totals"><span>' + n + " producto" + (n === 1 ? "" : "s") + "</span><span>Envío: en el bar</span></div>" +
      '<div class="drawer__total"><span>Total</span><span class="valor">' + fmt(total) + "</span></div>" +
      '<button class="btn-primary" id="btn-pedir">Pedir 🍽️</button>' +
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
        '<div class="modal__icon modal__icon--confirm">🍽️</div>' +
        "<h2>Confirmar pedido</h2>" +
        "<p>Revisa tu comanda antes de enviarla a cocina</p>" +
        '<div class="modal__mesa">📍 Mesa ' + mesaPedido + " ✓ detectada automáticamente</div>" +
        '<div><button class="modal__change-mesa" id="btn-cambiar-mesa">¿Es otra mesa? Cambiar</button></div>' +
        '<div id="mesa-picker-wrap" style="display:none">' +
          '<div class="mesa-picker" id="mesa-picker"></div>' +
        "</div>" +
        '<div class="modal__resumen">' + esc(resumen) + "\n\nTOTAL: " + fmt(total) + "</div>" +
        '<div class="modal__actions">' +
          '<button class="btn-primary" id="btn-enviar">Enviar comanda a cocina ✅</button>' +
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
          '<button class="btn-primary" id="btn-seguir">Seguir pidiendo 🍹</button>' +
        "</div>" +
      "</div>";
    document.getElementById("btn-seguir").addEventListener("click", closeModal);
  }

  function showError(texto) {
    var wa = Order.linkWhatsApp(texto);
    document.getElementById("modal").innerHTML =
      '<div class="modal__card">' +
        '<div class="modal__icon modal__icon--err">!</div>' +
        "<h2>No se pudo enviar</h2>" +
        "<p>Revisa tu conexión o pide ayuda al mesero.<br>Tu carrito se mantiene guardado.</p>" +
        '<div class="modal__actions">' +
          '<button class="btn-primary" id="btn-reintentar">Reintentar</button>' +
          '<button class="btn-ghost" id="btn-copiar">📋 Copiar comanda</button>' +
          (wa ? '<a class="btn-ghost" style="display:block;text-align:center;padding:13px;" href="' + wa + '" target="_blank" rel="noopener">📱 Enviar por WhatsApp</a>' : "") +
          '<button class="btn-ghost" id="btn-cerrar-err">Cerrar</button>' +
        "</div>" +
      "</div>";

    document.getElementById("btn-reintentar").addEventListener("click", renderConfirm);
    document.getElementById("btn-cerrar-err").addEventListener("click", closeModal);
    document.getElementById("btn-copiar").addEventListener("click", function () {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(texto).then(function () { toast("Comanda copiada ✓"); });
      } else {
        var ta = document.createElement("textarea");
        ta.value = texto;
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand("copy"); toast("Comanda copiada ✓"); } catch (e) {}
        document.body.removeChild(ta);
      }
    });
  }

  /* ---------- Eventos ---------- */
  function bind() {
    root.querySelectorAll("[data-ir]").forEach(function (b) {
      b.addEventListener("click", function () { irA(b.getAttribute("data-ir")); });
    });

    root.querySelectorAll("[data-add]").forEach(function (card) {
      card.addEventListener("click", function () {
        var id = card.getAttribute("data-add");
        var p = PRODUCTOS[id];
        if (!p) return;
        Cart.add(p);
        toast("＋ " + p.nombre);
        var btn = card.querySelector(".card__add");
        if (btn) {
          btn.classList.remove("pulse");
          void btn.offsetWidth;
          btn.classList.add("pulse");
        }
      });
    });
  }

  /* ---------- Cambios del carrito ---------- */
  Cart.onChange(function () {
    root.querySelectorAll("[data-add]").forEach(function (card) {
      var id = card.getAttribute("data-add");
      var qty = Cart.qtyOf(id);
      var badge = card.querySelector(".card__badge");
      if (qty > 0) {
        if (badge) badge.textContent = qty;
        else {
          var span = document.createElement("span");
          span.className = "card__badge";
          span.textContent = qty;
          card.appendChild(span);
        }
      } else if (badge) {
        badge.remove();
      }
    });
    renderCartbar();
    bumpCartbar();
    var drawer = document.getElementById("drawer");
    if (drawer && drawer.classList.contains("is-open")) renderDrawerBody();
  });

  document.getElementById("overlay").addEventListener("click", closeDrawer);
  document.getElementById("drawer-close").addEventListener("click", closeDrawer);

  render();
})();
