/* ============================================================
   Santa Elena Café | Bar — Carrito con autosuma (por mesa)
   ============================================================ */
window.SCB_Cart = (function () {
  var mesa = window.SCB.mesa;
  var KEY = "scb_cart_mesa_" + mesa;
  var listeners = [];

  function load() {
    try {
      var raw = localStorage.getItem(KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  var items = load();

  function save() {
    try {
      localStorage.setItem(KEY, JSON.stringify(items));
    } catch (e) { /* storage lleno o bloqueado */ }
    emit();
  }

  function emit() {
    for (var i = 0; i < listeners.length; i++) listeners[i](api);
  }

  function find(id) {
    for (var i = 0; i < items.length; i++) if (items[i].id === id) return items[i];
    return null;
  }

  var api = {
    mesa: mesa,

    items: function () { return items.slice(); },

    count: function () {
      var n = 0;
      for (var i = 0; i < items.length; i++) n += items[i].qty;
      return n;
    },

    total: function () {
      var t = 0;
      for (var i = 0; i < items.length; i++) t += items[i].qty * items[i].precio;
      return t;
    },

    qtyOf: function (id) {
      var it = find(id);
      return it ? it.qty : 0;
    },

    add: function (product, qty) {
      qty = qty || 1;
      var it = find(product.id);
      if (it) {
        it.qty += qty;
      } else {
        items.push({
          id: product.id,
          nombre: product.nombre,
          precio: product.precio,
          qty: qty
        });
      }
      save();
      return api;
    },

    setQty: function (id, qty) {
      var it = find(id);
      if (!it) return api;
      if (qty <= 0) {
        api.remove(id);
        return api;
      }
      it.qty = qty;
      save();
      return api;
    },

    inc: function (id) {
      var it = find(id);
      if (it) it.qty += 1;
      save();
      return api;
    },

    dec: function (id) {
      var it = find(id);
      if (!it) return api;
      it.qty -= 1;
      if (it.qty <= 0) return api.remove(id);
      save();
      return api;
    },

    remove: function (id) {
      items = items.filter(function (x) { return x.id !== id; });
      save();
      return api;
    },

    clear: function () {
      items = [];
      save();
      return api;
    },

    onChange: function (fn) {
      listeners.push(fn);
      return api;
    },

    format: function (n) {
      return new Intl.NumberFormat(window.SCB_CONFIG.LOCALE, {
        style: "currency",
        currency: window.SCB_CONFIG.CURRENCY,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(n);
    }
  };

  return api;
})();
