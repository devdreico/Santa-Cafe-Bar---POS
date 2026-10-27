/* ============================================================
   Santa Elena Café | Bar — App POS (vistas, carrito, pedido)
   Lee la mesa y la sección desde window.SCB (inyectado por cada
   página generada) y renderiza todo en #app.
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

  /* ---------- Estado de vista ---------- */
  var state = {
    section: SCB.section, // 'home' | 'bebidasalcohol' | 'comidas'
    grupo: null,          // 'licores' | 'sinAlcohol' | 'paquetes' | 'restaurante'
    sub: null             // 'cerveza' | 'destilados' | 'calientes' | 'frias' | null
  };

  if (state.section === "bebidasalcohol") {
    state.grupo = "licores";
    state.sub = "cerveza";
  } else if (state.section === "comidas") {
    state.grupo = "paquetes";
  }

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

  /* ---------- Estructura del catálogo para la vista actual ---------- */
  function gruposDeSection() {
    if (state.section === "comidas") {
      return [
        { key: "paquetes", label: DATA.comidas.paquetes.label, subs: null, items: DATA.comidas.paquetes.items },
        { key: "restaurante", label: DATA.comidas.restaurante.label, subs: null, items: DATA.comidas.restaurante.items }
      ];
    }
    return [
      {
        key: "licores",
        label: DATA.bebidas.licores.label,
        subs: [
          { key: "cerveza", label: DATA.bebidas.licores.cerveza.label, items: DATA.bebidas.licores.cerveza.items },
          { key: "destilados", label: DATA.bebidas.licores.destilados.label, items: DATA.bebidas.licores.destilados.items }
        ]
      },
      {
        key: "sinAlcohol",
        label: DATA.bebidas.sinAlcohol.label,
        subs: [
          { key: "calientes", label: DATA.bebidas.sinAlcohol.calientes.label, items: DATA.bebidas.sinAlcohol.calientes.items },
          { key: "frias", label: DATA.bebidas.sinAlcohol.frias.label, items: DATA.bebidas.sinAlcohol.frias.items }
        ]
      }
    ];
  }

  function grupoActual() {
    var gs = gruposDeSection();
    for (var i = 0; i < gs.length; i++) if (gs[i].key === state.grupo) return gs[i];
    return gs[0];
  }

  function itemsActuales() {
    var g = grupoActual();
    if (!g.subs) return g.items;
    for (var i = 0; i < g.subs.length; i++) if (g.subs[i].key === state.sub) return g.subs[i].items;
    return g.subs[0].items;
  }

  /* ============================================================
     RENDER
     ============================================================ */
  function render() {
    if (state.section === "home") {
      root.innerHTML = renderHome();
    } else {
      root.innerHTML = renderHeader() + renderMenu();
    }
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
          "<p>¡Bienvenido! Elige qué se te antoja</p>" +
        "</div>" +
        '<div class="home__mesa-banner">📍 Estás pidiendo para la Mesa ' + SCB.mesa + "</div>" +
        '<div class="home__split">' +
          '<button class="home__choice home__choice--bebidas" data-ir="bebidasalcohol">' +
            '<span class="emoji">🥃</span>' +
            "<strong>Bebidas</strong>" +
            "<span>Licores y sin alcohol</span>" +
          "</button>" +
          '<button class="home__choice home__choice--comidas" data-ir="comidas">' +
            '<span class="emoji">🍽️</span>' +
            "<strong>Comidas</strong>" +
            "<span>Paquetes y restaurante</span>" +
          "</button>" +
        "</div>" +
      "</div>"
    );
  }

  /* ---------- Header ---------- */
  function renderHeader() {
    var esBebidas = state.section === "bebidasalcohol";
    return (
      '<header class="header">' +
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
      "</nav>"
    );
  }

  /* ---------- Menú (tabs + productos) ---------- */
  function renderMenu() {
    var esBebidas = state.section === "bebidasalcohol";
    var titulo = esBebidas ? DATA.bebidas.label : DATA.comidas.label;
    var subtitulo = esBebidas
      ? "Licores y bebidas sin alcohol"
      : "Paquetes y carta de restaurante";

    // Chip cruzado (pequeño)
    var chip = esBebidas
      ? '<button class="cross-chip" data-ir="comidas">¿Te interesa comer?</button>'
      : '<button class="cross-chip" data-ir="bebidasalcohol">¿Quieres beber?</button>';

    // Tabs de grupo (Licores | Sin Alcohol  /  Paquetes | Restaurante)
    var gs = gruposDeSection();
    var tabsGrupo = "";
    for (var i = 0; i < gs.length; i++) {
      tabsGrupo +=
        '<button class="tab' + (gs[i].key === state.grupo ? " is-active" : "") + '" data-grupo="' + gs[i].key + '">' +
        esc(gs[i].label) +
        "</button>";
    }

    // Tabs de subcategoría (solo bebidas: Cerveza | Destilados / Calientes | Frías)
    var g = grupoActual();
    var tabsSub = "";
    if (g.subs) {
      tabsSub = '<div class="tabs">';
      for (var j = 0; j < g.subs.length; j++) {
        tabsSub +=
          '<button class="tab' + (g.subs[j].key === state.sub ? " is-active" : "") + '" data-sub="' + g.subs[j].key + '">' +
          esc(g.subs[j].label) +
          "</button>";
      }
      tabsSub += "</div>";
    }

    return (
      '<div class="section-head">' +
        '<div class="section-head__titles">' +
          "<h1>" + esc(titulo) + "</h1>" +
          "<p>" + esc(subtitulo) + "</p>" +
        "</div>" +
        chip +
      "</div>" +
      '<div class="tabs">' + tabsGrupo + "</div>" +
      tabsSub +
      '<div class="grid">' + renderCards(itemsActuales()) + "</div>"
    );
  }

  function renderCards(items) {
    var html = "";
    for (var i = 0; i < items.length; i++) {
      var p = items[i];
      var qty = Cart.qtyOf(p.id);
      html +=
        '<article class="card" data-add="' + p.id + '">' +
          (qty > 0 ? '<span class="card__badge">' + qty + "</span>" : "") +
          '<div class="card__name">' + esc(p.nombre) + "</div>" +
          '<div class="card__desc">' + esc(p.desc) + "</div>" +
          '<div class="card__row">' +
            '<span class="card__price">' + fmt(p.precio) + "</span>" +
            '<button class="card__add" data-add-btn="' + p.id + '" aria-label="Agregar ' + esc(p.nombre) + '">+</button>' +
          "</div>" +
        "</article>";
    }
    return html;
  }

  function findProduct(id) {
    var gs = gruposDeSection();
    for (var i = 0; i < gs.length; i++) {
      var g = gs[i];
      if (g.subs) {
        for (var j = 0; j < g.subs.length; j++) {
          var its = g.subs[j].items;
          for (var k = 0; k < its.length; k++) if (its[k].id === id) return its[k];
        }
      } else {
        for (var m = 0; m < g.items.length; m++) if (g.items[m].id === id) return g.items[m];
      }
    }
    return null;
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

  /* ---------- Drawer del carrito ---------- */
  function openDrawer() {
    var overlay = document.getElementById("overlay");
    var drawer = document.getElementById("drawer");
    renderDrawerBody();
    overlay.classList.add("is-open");
    drawer.classList.add("is-open");
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
  var mesaPedido = SCB.mesa; // mesa usada para el pedido (auto-detectada)

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
      .catch(function (err) {
        showError(Order.textoComanda(mesaPedido, items, total), err.message);
      });
  }

  function showExito(demo) {
    document.getElementById("modal").innerHTML =
      '<div class="modal__card">' +
        '<div class="modal__icon modal__icon--ok">✓</div>' +
        "<h2>¡Comanda enviada!</h2>" +
        "<p>Cocina y bar ya recibieron tu pedido.<br>La mesa es la <strong>Mesa " + mesaPedido + "</strong>.</p>" +
        (demo ? '<p style="font-size:12px;margin-top:8px;">(modo demo: no se envió a Formspree todavía — configura tu endpoint en <code>config.js</code>)</p>' : "") +
        '<div class="modal__actions">' +
          '<button class="btn-primary" id="btn-seguir">Seguir pidiendo 🍹</button>' +
        "</div>" +
      "</div>";
    document.getElementById("btn-seguir").addEventListener("click", closeModal);
  }

  function showError(texto, motivo) {
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

    document.getElementById("btn-reintentar").addEventListener("click", function () {
      renderConfirm();
    });
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

  /* ---------- Eventos globales ---------- */
  function bind() {
    root.querySelectorAll("[data-ir]").forEach(function (b) {
      b.addEventListener("click", function () { irA(b.getAttribute("data-ir")); });
    });

    root.querySelectorAll("[data-grupo]").forEach(function (b) {
      b.addEventListener("click", function () {
        state.grupo = b.getAttribute("data-grupo");
        var g = grupoActual();
        state.sub = g.subs ? g.subs[0].key : null;
        render();
      });
    });

    root.querySelectorAll("[data-sub]").forEach(function (b) {
      b.addEventListener("click", function () {
        state.sub = b.getAttribute("data-sub");
        render();
      });
    });

    root.querySelectorAll("[data-add]").forEach(function (card) {
      card.addEventListener("click", function (e) {
        var id = card.getAttribute("data-add");
        var p = findProduct(id);
        if (!p) return;
        Cart.add(p);
        toast("＋ " + p.nombre);
      });
    });
  }

  /* ---------- Suscripción a cambios del carrito ---------- */
  Cart.onChange(function () {
    // Actualiza badges de productos + barra + drawer si está abierto
    if (state.section !== "home") {
      root.querySelectorAll(".card").forEach(function (card) {
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
    }
    renderCartbar();
    var drawer = document.getElementById("drawer");
    if (drawer && drawer.classList.contains("is-open")) renderDrawerBody();
  });

  document.getElementById("overlay").addEventListener("click", closeDrawer);
  document.getElementById("drawer-close").addEventListener("click", closeDrawer);

  render();
})();
