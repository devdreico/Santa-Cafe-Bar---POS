/* ============================================================
   Santa Elena Café | Bar — Configuración global
   ============================================================ */
window.SCB_CONFIG = {
  // Reemplaza este placeholder con tu endpoint real de Formspree.
  // 1) Crea una cuenta en https://formspree.io
  // 2) Crea un formulario nuevo (modo JSON)
  // 3) Copia el endpoint, ej: https://formspree.io/f/abcdeXYZ
  // Mientras el valor contenga "PLACEHOLDER", el sistema corre en
  // MODO DEMO: simula el envío exitoso sin enviar nada real.
  FORMSPREE_ENDPOINT: "https://formspree.io/f/PLACEHOLDER",

  // Moneda
  CURRENCY: "COP",
  LOCALE: "es-CO",

  // Identidad
  NOMBRE_LOCAL: "Santa Elena Café | Bar",

  // Opcional: número de WhatsApp del bar (solo dígitos, con código de
  // país). Si está definido, en el fallback de error aparece un botón
  // para enviar la comanda por WhatsApp. Ej: "584121234567"
  WHATSAPP: "",

  // Cantidad de mesas
  MESAS: 20
};
