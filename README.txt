EL RINCÓN DEL PAYASITO — Tienda de stickers online
====================================================

ARCHIVOS
--------
index.html         -> Página completa (catálogo, paquetes, personalizado, FAQ, contacto).
style.css           -> Diseño visual (estilo carpa de circo / marquesina).
app.js              -> Lógica del catálogo, carrito y checkout por WhatsApp.
stickers-data.js    -> Lista de los 127 stickers (nombre, precio, categoría).
stickers/           -> Las 127 imágenes ya recortadas de tus 4 planchas.

CÓMO VERLO
----------
Abre index.html con doble clic. También puedes subir toda esta carpeta a
Netlify, Vercel o GitHub Pages para publicarlo con tu propio dominio.

SOBRE LOS STICKERS
-------------------
Recorté automáticamente tus 4 planchas (127 diseños en total) y les puse
nombre y precio a cada uno. Como el recorte fue automático, es MUY
recomendable que revises la carpeta "stickers" y:
  - Le cambies el nombre a los que quieras (edítalo en stickers-data.js,
    campo "nombre").
  - Ajustes el precio individual si algún diseño debería costar S/1.50
    en vez de S/1.00 (o viceversa). Cada producto tiene "precio": 1.00
    y "premium": true/false en stickers-data.js.
  - Elimines algún sticker que haya salido cortado o repetido, borrando
    su bloque del archivo stickers-data.js (no hace falta borrar la
    imagen física, solo su entrada en la lista).

Sobre la IMAGEN 5 (el cartel "El Rincón del Payasito" con Peppa Pig y los
Teletubbies): no la usé en la web. Esa imagen incluye personajes con
derechos de autor de otras marcas (Peppa Pig, Teletubbies), y usarla en
una página comercial podría traerte un problema legal de propiedad
intelectual. En su lugar, recreé el mismo espíritu festivo de circo con
un diseño propio (tipografía tipo carpa, luces de marquesina, colores de
circo) que sí puedes usar libremente porque es 100% original.

PRECIOS Y PAQUETES CONFIGURADOS
---------------------------------
- Sticker individual: S/ 1.00 (o S/ 1.50 en los marcados "premium")
- Set Risa Asegurada x5: S/ 4.50
- Combo Carcajada x10: S/ 8.50
- Pack Bájate la Pepa x20: S/ 15.00 (destacado como más vendido)
- Mega Pack Completo x127 (todo el catálogo): S/ 89.00
Puedes cambiar cualquiera de estos precios en app.js, dentro del bloque
COMBOS al inicio del archivo.

CONTACTO CONFIGURADO
---------------------
WhatsApp y Yape: 961 283 742
Para cambiarlo, edita CONFIG.telefono y CONFIG.telefonoVisible en app.js.

CÓMO FUNCIONA (SIN LOGIN)
---------------------------
Tal como pediste, no hay cuentas ni login. El carrito se guarda
temporalmente en el navegador (para que no se pierda si recargas la
página), y al finalizar el pedido se abre WhatsApp con todo el detalle
ya armado, listo para enviar. No se guarda ninguna base de datos de
pedidos ni de clientes — todo se coordina directo por WhatsApp y Yape,
como pediste.

SIGUIENTE PASO SUGERIDO
--------------------------
Si más adelante quieres más de 1000 stickers, la forma más rápida es
que me pases más planchas de diseños (mientras más variedad de poses y
frases, mejor) y yo las recorto y las agrego al catálogo con el mismo
proceso que usé aquí.
