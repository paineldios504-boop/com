/* ============================================================
   EL RINCÓN DEL PAYASITO — app.js
   Sin login. Catálogo + carrito + checkout directo por WhatsApp.
   ============================================================ */

const CONFIG = {
  nombreTienda: "El Rincón del Payasito",
  telefono: "51961283742",
  telefonoVisible: "961 283 742",
};

const CATEGORIAS = {
  todos: "🎪 Todos",
  gamer: "🎮 Gamer & Streaming",
  vida: "🌤️ Vida diaria",
  formal: "👔 Oficina & Estilo",
  random: "🎲 Random & Mood",
};

const COMBOS = [
  {
    id: "combo-risa",
    nombre: "Set Risa Asegurada",
    cantidad: 5,
    precio: 4.50,
    precioNormal: 5.00,
    ribbon: null,
    desc: "5 stickers a tu elección. Nos escribes cuáles quieres por WhatsApp.",
    destacado: false,
  },
  {
    id: "combo-carcajada",
    nombre: "Combo Carcajada",
    cantidad: 10,
    precio: 8.50,
    precioNormal: 10.00,
    ribbon: "AHORRA",
    desc: "10 stickers a tu elección, ideal para tu cuaderno o laptop.",
    destacado: false,
  },
  {
    id: "combo-pepa",
    nombre: "Pack Bájate la Pepa",
    cantidad: 20,
    precio: 15.00,
    precioNormal: 20.00,
    ribbon: "MÁS VENDIDO",
    desc: "20 stickers a tu elección. El favorito de nuestros clientes.",
    destacado: true,
  },
  {
    id: "combo-mega",
    nombre: "Mega Pack Completo",
    cantidad: 127,
    precio: 89.00,
    precioNormal: 150.00,
    ribbon: "TODO EL CATÁLOGO",
    desc: "Los 127 stickers del catálogo completo. La colección entera.",
    destacado: false,
  },
];

/* ---------------- CARRITO (localStorage, sin cuentas) ---------------- */
const Cart = {
  get(){ try{ return JSON.parse(localStorage.getItem("payasito_carrito")) || []; }catch(e){ return []; } },
  set(items){ localStorage.setItem("payasito_carrito", JSON.stringify(items)); },
};

function findSticker(id){ return STICKERS.find(s => s.id === id); }
function findCombo(id){ return COMBOS.find(c => c.id === id); }

function agregarSticker(id){
  const carrito = Cart.get();
  const existente = carrito.find(i => i.type === "sticker" && i.id === id);
  if(existente) existente.qty += 1;
  else carrito.push({ type:"sticker", id, qty:1 });
  Cart.set(carrito);
  refreshCartUI();
  abrirCarrito();
}

function agregarCombo(id){
  const carrito = Cart.get();
  const existente = carrito.find(i => i.type === "combo" && i.id === id);
  if(existente) existente.qty += 1;
  else carrito.push({ type:"combo", id, qty:1 });
  Cart.set(carrito);
  refreshCartUI();
  abrirCarrito();
}

function cambiarCantidad(type, id, delta){
  let carrito = Cart.get();
  const item = carrito.find(i => i.type === type && i.id === id);
  if(!item) return;
  item.qty += delta;
  if(item.qty <= 0) carrito = carrito.filter(i => !(i.type===type && i.id===id));
  Cart.set(carrito);
  refreshCartUI();
}

function itemUnitPrice(item){
  if(item.type === "sticker"){ const s = findSticker(item.id); return s ? s.precio : 0; }
  const c = findCombo(item.id); return c ? c.precio : 0;
}
function itemLabel(item){
  if(item.type === "sticker"){ const s = findSticker(item.id); return s ? s.nombre : "?"; }
  const c = findCombo(item.id); return c ? `${c.nombre} (x${c.cantidad})` : "?";
}
function itemImg(item){
  if(item.type === "sticker"){ const s = findSticker(item.id); return s ? s.file : ""; }
  return "stickers/h1_04.jpg"; // imagen genérica para combos
}

function totalCarrito(){
  return Cart.get().reduce((sum,item)=> sum + itemUnitPrice(item)*item.qty, 0);
}

function refreshCartUI(){
  const carrito = Cart.get();
  const countEl = document.getElementById("cart-count");
  if(countEl){
    const count = carrito.reduce((s,i)=>s+i.qty,0);
    countEl.textContent = count;
    countEl.style.display = count>0 ? "flex":"none";
  }
  const wrap = document.getElementById("cart-items");
  const totalEl = document.getElementById("cart-total");
  const btn = document.getElementById("btn-finalizar");
  if(!wrap) return;
  if(carrito.length === 0){
    wrap.innerHTML = `<div class="cart-empty">Tu carrito está más vacío que circo sin payaso 🤡<br>Agrega algunos stickers.</div>`;
    if(btn) btn.disabled = true;
  } else {
    wrap.innerHTML = carrito.map(item => `
      <div class="cart-item">
        <img src="${itemImg(item)}" alt="">
        <div class="info">
          <b>${itemLabel(item)}</b>
          <span>S/ ${(itemUnitPrice(item)*item.qty).toFixed(2)}</span>
        </div>
        <div class="qty-controls">
          <button onclick="cambiarCantidad('${item.type}','${item.id}',-1)">−</button>
          <span class="mono">${item.qty}</span>
          <button onclick="cambiarCantidad('${item.type}','${item.id}',1)">+</button>
        </div>
      </div>
    `).join("");
    if(btn) btn.disabled = false;
  }
  if(totalEl) totalEl.textContent = "S/ " + totalCarrito().toFixed(2);
}

function abrirCarrito(){
  document.getElementById("cart-drawer")?.classList.add("open");
  document.getElementById("cart-overlay")?.classList.add("open");
}
function cerrarCarrito(){
  document.getElementById("cart-drawer")?.classList.remove("open");
  document.getElementById("cart-overlay")?.classList.remove("open");
}

function pedirStickerWhatsapp(id){
  const s = findSticker(id);
  if(!s) return;
  const texto = encodeURIComponent(`¡Hola El Rincón del Payasito! 🤡 Me interesa el sticker "${s.nombre}" (S/ ${s.precio.toFixed(2)}). ¿Está disponible?`);
  window.open(`https://wa.me/${CONFIG.telefono}?text=${texto}`, "_blank");
}

function pedirComboWhatsapp(id){
  const c = findCombo(id);
  if(!c) return;
  const texto = encodeURIComponent(`¡Hola El Rincón del Payasito! 🤡 Quiero el "${c.nombre}" (${c.cantidad} stickers) por S/ ${c.precio.toFixed(2)}. Te cuento cuáles diseños quiero.`);
  window.open(`https://wa.me/${CONFIG.telefono}?text=${texto}`, "_blank");
}

function finalizarPedidoWhatsapp(){
  const carrito = Cart.get();
  if(carrito.length === 0) return;
  let lineas = carrito.map(item => `• ${item.qty} x ${itemLabel(item)} — S/ ${(itemUnitPrice(item)*item.qty).toFixed(2)}`);
  let texto = `¡Hola El Rincón del Payasito! 🤡 Quiero bajarme la pepa con este pedido:\n\n${lineas.join("\n")}\n\nTotal: S/ ${totalCarrito().toFixed(2)}\n\nPagaré por Yape al ${CONFIG.telefonoVisible}.`;
  window.open(`https://wa.me/${CONFIG.telefono}?text=${encodeURIComponent(texto)}`, "_blank");
  Cart.set([]);
  refreshCartUI();
  cerrarCarrito();
}

/* ---------------- CATÁLOGO / RENDER ---------------- */
let filtroActivo = "todos";
let visibles = 24;
const PASO = 24;

function listaFiltrada(){
  return filtroActivo === "todos" ? STICKERS : STICKERS.filter(s => s.cat === filtroActivo);
}

function renderFiltros(){
  const wrap = document.getElementById("tag-filters");
  wrap.innerHTML = Object.entries(CATEGORIAS).map(([key,label]) =>
    `<button class="tag-filter ${key===filtroActivo?'active':''}" data-cat="${key}">${label}</button>`
  ).join("");
  wrap.addEventListener("click", e=>{
    const btn = e.target.closest(".tag-filter");
    if(!btn) return;
    filtroActivo = btn.dataset.cat;
    visibles = PASO;
    wrap.querySelectorAll(".tag-filter").forEach(b=>b.classList.remove("active"));
    btn.classList.add("active");
    renderGrid();
  });
}

function renderGrid(){
  const grid = document.getElementById("product-grid");
  const lista = listaFiltrada();
  const mostrar = lista.slice(0, visibles);
  grid.innerHTML = mostrar.map(s => `
    <article class="product-card">
      <div class="product-media">
        <img src="${s.file}" alt="Sticker: ${s.nombre}" loading="lazy">
        ${s.premium ? '<span class="premium-flag">★ premium</span>' : ''}
      </div>
      <div class="product-body">
        <h4>${s.nombre}</h4>
        <div class="product-foot">
          <span class="price-tag">S/ ${s.precio.toFixed(2)}</span>
          <button class="add-btn" title="Agregar al carrito" onclick="agregarSticker('${s.id}')">+</button>
        </div>
      </div>
    </article>
  `).join("");

  const loadWrap = document.getElementById("load-more-wrap");
  if(visibles < lista.length){
    loadWrap.innerHTML = `<button class="btn btn-outline" id="btn-cargar-mas">Ver más stickers (${lista.length - visibles} restantes) 🤡</button>`;
    document.getElementById("btn-cargar-mas").addEventListener("click", ()=>{
      visibles += PASO;
      renderGrid();
    });
  } else {
    loadWrap.innerHTML = "";
  }
}

function renderCombos(){
  const wrap = document.getElementById("combo-grid");
  if(!wrap) return;
  wrap.innerHTML = COMBOS.map(c => `
    <div class="combo-card ${c.destacado ? 'destacado':''}">
      ${c.ribbon ? `<div class="combo-ribbon">${c.ribbon}</div>` : ''}
      <h3>${c.nombre}</h3>
      <div class="combo-icons">
        ${STICKERS.slice(0,4).map(s=>`<img src="${s.file}" alt="">`).join("")}
      </div>
      <p class="combo-desc">${c.desc}</p>
      <div class="combo-oldprice">Antes S/ ${c.precioNormal.toFixed(2)}</div>
      <div class="combo-price">S/ ${c.precio.toFixed(2)}</div>
      <div style="display:flex; gap:8px; margin-top:14px;">
        <button class="btn btn-yellow btn-sm" style="flex:1;" onclick="agregarCombo('${c.id}')">Agregar</button>
        <button class="btn btn-whatsapp btn-sm" style="flex:1;" onclick="pedirComboWhatsapp('${c.id}')">💬 Pedir</button>
      </div>
    </div>
  `).join("");
}

function renderMosaic(){
  const wrap = document.getElementById("hero-mosaic");
  if(!wrap) return;
  const muestra = [STICKERS[3], STICKERS[24], STICKERS[40], STICKERS[55]];
  wrap.innerHTML = muestra.map((s,i)=>{
    const rot = [-8,6,-4,9][i];
    const pos = [
      {top:"4%", left:"2%"}, {top:"10%", right:"2%"},
      {bottom:"12%", left:"6%"}, {bottom:"4%", right:"8%"}
    ][i];
    const posStyle = Object.entries(pos).map(([k,v])=>`${k}:${v}`).join(";");
    return `<img class="float-sticker" style="--r:${rot}deg; ${posStyle}; animation-delay:${i*0.4}s;" src="${s.file}" alt="">`;
  }).join("");
}

function renderAboutMosaic(){
  const wrap = document.getElementById("about-mosaic");
  if(!wrap) return;
  const idxs = [2,10,20,30,45,60,75,90];
  wrap.innerHTML = idxs.map(i => `<img src="${STICKERS[i % STICKERS.length].file}" alt="">`).join("");
}

/* ---------------- FAQ ---------------- */
function initFaq(){
  document.querySelectorAll(".faq-item").forEach(item=>{
    item.querySelector(".faq-q").addEventListener("click", ()=>{
      const wasOpen = item.classList.contains("open");
      document.querySelectorAll(".faq-item").forEach(i=>i.classList.remove("open"));
      if(!wasOpen) item.classList.add("open");
    });
  });
}

/* ---------------- TICKER ---------------- */
function renderTicker(){
  const el = document.getElementById("ticker-track");
  if(!el) return;
  const msg = "🎉 NUEVO: Mega Pack Completo x127 stickers &nbsp;·&nbsp; 🤡 Envíos a todo Lima &nbsp;·&nbsp; 💜 Paga fácil con Yape &nbsp;·&nbsp; 🎈 Packs personalizados a tu pedido &nbsp;·&nbsp; ";
  el.innerHTML = msg.repeat(4);
}

/* ---------------- INIT ---------------- */
document.addEventListener("DOMContentLoaded", ()=>{
  renderFiltros();
  renderGrid();
  renderCombos();
  renderMosaic();
  renderAboutMosaic();
  renderTicker();
  initFaq();
  refreshCartUI();

  const toggle = document.getElementById("nav-toggle");
  const nav = document.getElementById("main-nav");
  toggle?.addEventListener("click", ()=> nav.classList.toggle("open"));

  document.getElementById("cart-open")?.addEventListener("click", abrirCarrito);
  document.getElementById("cart-close")?.addEventListener("click", cerrarCarrito);
  document.getElementById("cart-overlay")?.addEventListener("click", cerrarCarrito);
  document.getElementById("btn-finalizar")?.addEventListener("click", finalizarPedidoWhatsapp);
});
