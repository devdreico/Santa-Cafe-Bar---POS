/* ============================================================
   Santa Elena Café | Bar — Envío de comandas a Formspree
   ============================================================ */
window.SCB_Order = (function () {
  var cfg = window.SCB_CONFIG;

  function esDemo() {
    return !cfg.FORMSPREE_ENDPOINT || cfg.FORMSPREE_ENDPOINT.indexOf("PLACEHOLDER") !== -1;
  }

  function horaAhora() {
    return new Date().toLocaleString(cfg.LOCALE, {
      dateStyle: "short",
      timeStyle: "short"
    });
  }

  function textoComanda(mesa, items, total) {
    var lineas = [
      "COMANDA — " + cfg.NOMBRE_LOCAL,
      "Mesa: " + mesa,
      "Hora: " + horaAhora(),
      "--------------------------------"
    ];
    for (var i = 0; i < items.length; i++) {
      var it = items[i];
      lineas.push(it.qty + " x " + it.nombre + " — " + SCB_Cart.format(it.qty * it.precio));
    }
    lineas.push("--------------------------------");
    lineas.push("TOTAL: " + SCB_Cart.format(total));
    return lineas.join("\n");
  }

  /**
   * Envía la comanda. Resuelve con { ok: true, demo: bool, texto } o
   * rechaza con Error("RED"|"SERVIDOR").
   */
  function enviar(mesa, items, total) {
    var texto = textoComanda(mesa, items, total);
    var payload = {
      _subject: "Comanda Mesa " + mesa + " — " + cfg.NOMBRE_LOCAL,
      mesa: String(mesa),
      hora: horaAhora(),
      local: cfg.NOMBRE_LOCAL,
      items: items.map(function (it) {
        return it.qty + " x " + it.nombre + " (" + SCB_Cart.format(it.qty * it.precio) + ")";
      }).join("\n"),
      total: String(total),
      total_formato: SCB_Cart.format(total),
      comanda: texto
    };

    if (esDemo()) {
      console.log("%c[MODO DEMO] Comanda que se enviaría a Formspree:", "color:#d4a24e;font-weight:bold", payload);
      console.log(texto);
      return new Promise(function (resolve) {
        setTimeout(function () { resolve({ ok: true, demo: true, texto: texto }); }, 800);
      });
    }

    return fetch(cfg.FORMSPREE_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(payload)
    }).then(function (res) {
      if (!res.ok) throw new Error("SERVIDOR");
      return { ok: true, demo: false, texto: texto };
    }).catch(function (err) {
      if (err && err.message === "SERVIDOR") throw err;
      throw new Error("RED");
    });
  }

  function linkWhatsApp(texto) {
    if (!cfg.WHATSAPP) return null;
    return "https://wa.me/" + cfg.WHATSAPP + "?text=" + encodeURIComponent(texto);
  }

  return {
    enviar: enviar,
    textoComanda: textoComanda,
    linkWhatsApp: linkWhatsApp,
    esDemo: esDemo
  };
})();
