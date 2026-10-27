/* ============================================================
   Santa Elena Café | Bar — Catálogo simulado (precios COP)
   `masVendido: true` → aparece en el bloque "Los más pedidos".
   `img: "ruta.jpg"`  → foto del producto (opcional; si se omite
   o es null, la card muestra un placeholder con icono de cámara).
   NOTA: los actuales son PLACEHOLDERS — reemplazar por los
   productos reales más vendidos cuando se confirme la lista.
   ============================================================ */
window.SCB_DATA = {
  comidas: {
    label: "Comidas",
    paquetes: {
      label: "Paquetes",
      items: [
        { id: "paq-piqueo-pareja", nombre: "Piqueo para dos", desc: "Tequeños, nachos, alitas y papas", precio: 38000, masVendido: true },
        { id: "paq-desayuno", nombre: "Desayuno parejo", desc: "2 arepas, 2 huevos, queso, café", precio: 25000 },
        { id: "paq-parrilla", nombre: "Parrilla pareja", desc: "Carne, pollo, arepas y ensalada", precio: 55000 },
        { id: "paq-deportivo", nombre: "Combo deportivo", desc: "4 cervezas + piqueo mixto", precio: 45000 },
        { id: "paq-familiar", nombre: "Combo familiar", desc: "4 platos del día + bebidas", precio: 78000 },
        { id: "paq-madrugada", nombre: "Combo madrugada", desc: "Papas, queso, salchichón y 2 tragos", precio: 32000 }
      ]
    },
    restaurante: {
      label: "Restaurante",
      items: [
        { id: "res-arepa-pabellon", nombre: "Arepa de pabellón", desc: "Carne mechada, caraotas y plátano", precio: 18000, masVendido: true },
        { id: "res-tequenos", nombre: "Tequeños (8 u.)", desc: "Con salsa de la casa", precio: 12000, masVendido: true },
        { id: "res-hamburguesa", nombre: "Hamburguesa completa", desc: "Carne, queso, tocineta y papas", precio: 22000, masVendido: true },
        { id: "res-patacon", nombre: "Patacón con todo", desc: "Patacón, carne, queso y guasacaca", precio: 20000 },
        { id: "res-cachapa", nombre: "Cachapa con queso", desc: "Cachapa tradicional con queso de mano", precio: 16000 },
        { id: "res-empanadas", nombre: "Empanadas (3 u.)", desc: "Carne mechada, con ají", precio: 10000 },
        { id: "res-ensalada", nombre: "Ensalada de la casa", desc: "Verdes, pollo grillado y vinagreta", precio: 15000 },
        { id: "res-pasta", nombre: "Pasta alfredo", desc: "Con pollo y champiñones", precio: 20000 },
        { id: "res-alitas", nombre: "Alitas BBQ (10 u.)", desc: "Con dip de la casa", precio: 24000 },
        { id: "res-wrap", nombre: "Wrap de pollo", desc: "Con vegetales y aderezo ranch", precio: 16000 }
      ]
    }
  },

  bebidas: {
    label: "Bebidas",
    licores: {
      label: "Licores",
      cerveza: {
        label: "Cerveza",
        items: [
          { id: "cer-polar-400", nombre: "Polar 400 ml", desc: "Lager clásica bien fría", precio: 4500, masVendido: true },
          { id: "cer-polar-light", nombre: "Polar Light 400 ml", desc: "Ligera, refrescante", precio: 4500 },
          { id: "cer-pilsen", nombre: "Pilsen 400 ml", desc: "Cerveza premium", precio: 5000 },
          { id: "cer-club-colombia", nombre: "Club Colombia 330 ml", desc: "Rubia, sabor suave", precio: 5500 },
          { id: "cer-brahma", nombre: "Brahma 400 ml", desc: "Sabor brasileño", precio: 5000 },
          { id: "cer-aguila", nombre: "Águila 400 ml", desc: "La de siempre", precio: 4500 },
          { id: "cer-stella", nombre: "Stella Artois 330 ml", desc: "Belga premium", precio: 6500 },
          { id: "cer-corona", nombre: "Corona 355 ml", desc: "Con limón y sal", precio: 6000 },
          { id: "cer-cerveza-tinto", nombre: "Cervecina de la casa", desc: "Cerveza artesanal local", precio: 7500 },
          { id: "cer-cubata", nombre: "Cubata (cerveza + ron)", desc: "Mezcla de la casa", precio: 12000 }
        ]
      },
      destilados: {
        label: "Destilados",
        items: [
          { id: "des-ron-st-70", nombre: "Ron Santa Teresa 70", desc: "Servido en copa 60 ml", precio: 12000, masVendido: true },
          { id: "des-diplomatico", nombre: "Diplomático Reserva", desc: "Copa 60 ml", precio: 18000 },
          { id: "des-old-parr", nombre: "Old Parr 12 años", desc: "Copa 60 ml", precio: 20000 },
          { id: "des-absolut", nombre: "Absolut Vodka", desc: "Copa 60 ml", precio: 15000 },
          { id: "des-bacardi", nombre: "Bacardí Carta Blanca", desc: "Copa 60 ml", precio: 14000 },
          { id: "des-aguardiente", nombre: "Aguardiente Cristal", desc: "Copa 60 ml", precio: 10000 },
          { id: "des-cuervo", nombre: "Tequila José Cuervo", desc: "Copa 60 ml", precio: 16000 },
          { id: "des-tanqueray", nombre: "Gin Tanqueray", desc: "Copa 60 ml con tónica", precio: 17000 },
          { id: "des-jager", nombre: "Jägermeister", desc: "Copa 40 ml", precio: 13000 },
          { id: "des-carajillo", nombre: "Carajillo", desc: "Café + licor de café", precio: 14000 },
          { id: "des-michelada", nombre: "Michelada", desc: "Cerveza con limón y especias", precio: 11000 },
          { id: "des-canilla", nombre: "Cañilla de la casa", desc: "Trago signature del bar", precio: 16000 }
        ]
      }
    },
    sinAlcohol: {
      label: "Sin Alcohol",
      calientes: {
        label: "Calientes",
        items: [
          { id: "ca-americano", nombre: "Café americano", desc: "Espresso doble con agua", precio: 6500 },
          { id: "ca-capuchino", nombre: "Capuchino", desc: "Espresso con leche vaporizada", precio: 8000, masVendido: true },
          { id: "ca-latte", nombre: "Café latte", desc: "Suave, con espuma de leche", precio: 8000 },
          { id: "ca-moca", nombre: "Moca", desc: "Café, chocolate y crema", precio: 8500 },
          { id: "ca-avena", nombre: "Avena caliente", desc: "Tradicional, con canela", precio: 7000 },
          { id: "ca-chocolate", nombre: "Chocolate caliente", desc: "Chocolate de la casa", precio: 8000 },
          { id: "ca-te", nombre: "Té selección", desc: "Manzanilla, hierbabuena o negro", precio: 5000 },
          { id: "ca-mate", nombre: "Mate de coco", desc: "Caliente y aromático", precio: 7500 }
        ]
      },
      frias: {
        label: "Frías",
        items: [
          { id: "fr-limonada-coco", nombre: "Limonada de coco", desc: "La más pedida", precio: 9000, masVendido: true },
          { id: "fr-limonada", nombre: "Limonada natural", desc: "Con hierbabuena", precio: 8000 },
          { id: "fr-mora", nombre: "Jugo de mora", desc: "Natural, 500 ml", precio: 8000 },
          { id: "fr-parchita", nombre: "Jugo de parchita", desc: "Natural, 500 ml", precio: 8000 },
          { id: "fr-papelón", nombre: "Papelón con limón", desc: "Bien frío", precio: 7000 },
          { id: "fr-gaseosa", nombre: "Gaseosa", desc: "Coca-Cola, Pepsi o Sprite", precio: 5000 },
          { id: "fr-malta", nombre: "Malta", desc: "Bien fría", precio: 5000 },
          { id: "fr-soda", nombre: "Soda saborizada", desc: "Uva, naranja o manzana", precio: 5500 },
          { id: "fr-milkshake", nombre: "Milkshake", desc: "Fresa, chocolate o vainilla", precio: 12000 },
          { id: "fr-sangria", nombre: "Sangría sin alcohol", desc: "Frutas de temporada", precio: 10000 }
        ]
      }
    }
  }
};
