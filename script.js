/* ===== DATOS DEL GIMNASIO: reemplaza estos valores de ejemplo por los reales ===== */
const CLUB = {
  address: "Costa del Este, Ciudad de Panamá",
  mapsQuery: "Costa del Este, Ciudad de Panamá",
  whatsapp: "50700000000",             // solo dígitos, con código de país
  phone: "+507 000 0000",
  instagram: "https://www.instagram.com/",
  facebook: "https://www.facebook.com/",
  tiktok: "https://www.tiktok.com/",
};
/* ================================================================================= */

const q = encodeURIComponent(CLUB.mapsQuery);
const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${q}`;
const waUrl = (text) => `https://wa.me/${CLUB.whatsapp}?text=${encodeURIComponent(text)}`;

document.querySelectorAll("[data-address]").forEach((el) => { el.textContent = CLUB.address; });
document.querySelectorAll("[data-maps]").forEach((el) => { el.href = mapsUrl; });
document.querySelectorAll("[data-social]").forEach((el) => { el.href = CLUB[el.dataset.social]; });
document.querySelectorAll("[data-wa]").forEach((el) => {
  el.href = waUrl(el.dataset.wa);
  el.target = "_blank";
  el.rel = "noopener";
});
document.getElementById("map").src = `https://www.google.com/maps?q=${q}&z=15&output=embed`;

/* ---------- Asistente: menú numérico, como el de una línea telefónica ---------- */
const BACK = "\n\n0. Volver al menú";
const link = (url, text) => ({ url, text });

const MENUS = {
  main: {
    text: "Hola, soy el asistente de Altum. Marca una opción:\n\n1. Mensualidades\n2. Promociones\n3. Horarios\n4. Ubicación\n5. Instalaciones y clases\n6. Agendar una visita\n7. Redes sociales\n8. Hablar con un asesor",
    options: { 1: "plans", 2: "promos", 3: "hours", 4: "where", 5: "facilities", 6: "visit", 7: "social", 8: "human" },
  },
  plans: {
    text: "Elige un plan para ver el detalle:\n\n1. Esencial: $89 USD/mes\n2. Signature: $149 USD/mes\n3. Privé: $249 USD/mes" + BACK,
    options: { 1: "esencial", 2: "signature", 3: "prive", 0: "main" },
  },
  esencial: {
    text: "Esencial, $89 USD/mes. Sala de fuerza y cardio de lunes a viernes, de 9:00 a 17:00. Incluye lockers y toallas.\n\n1. Ver otro plan" + BACK,
    options: { 1: "plans", 0: "main" },
  },
  signature: {
    text: "Signature, $149 USD/mes. Acceso total todos los días, piscina, sauna, clases grupales y evaluación física trimestral.\n\n1. Ver otro plan" + BACK,
    options: { 1: "plans", 0: "main" },
  },
  prive: {
    text: "Privé, $249 USD/mes. Todo lo de Signature, más 4 sesiones de entrenador al mes, plan de nutrición y locker fijo.\n\n1. Ver otro plan" + BACK,
    options: { 1: "plans", 0: "main" },
  },
  promos: {
    text: "Promociones vigentes:\n\n• Inscripción sin costo este mes (ahorras $120 USD)\n• 20% de descuento pagando el plan anual\n• Un mes gratis para cada uno si se inscriben dos personas juntas\n\n1. Ver mensualidades" + BACK,
    options: { 1: "plans", 0: "main" },
  },
  hours: {
    text: "Horario del club:\n\nLunes a viernes: 5:00 a 23:00\nSábados y domingos: 7:00 a 20:00\n\nEl plan Esencial entra de lunes a viernes, de 9:00 a 17:00." + BACK,
    options: { 0: "main" },
  },
  where: {
    text: `Estamos en ${CLUB.address}.`,
    links: [link(mapsUrl, "Abrir en Google Maps")],
    after: BACK.trim(),
    options: { 0: "main" },
  },
  facilities: {
    text: "¿Qué quieres conocer?\n\n1. Sala de fuerza y cardio\n2. Piscina y sauna\n3. Clases grupales" + BACK,
    options: { 1: "fac1", 2: "fac2", 3: "fac3", 0: "main" },
  },
  fac1: {
    text: "Sala de 11 m de altura con racks, mancuernas de hasta 60 kg y cintas de correr frente a un ventanal panorámico.\n\n1. Ver otras instalaciones" + BACK,
    options: { 1: "facilities", 0: "main" },
  },
  fac2: {
    text: "Piscina climatizada de 25 m con cuatro carriles a 28 °C, además de sauna de madera. Incluidas en Signature y Privé.\n\n1. Ver otras instalaciones" + BACK,
    options: { 1: "facilities", 0: "main" },
  },
  fac3: {
    text: "Pilates reformer, yoga y entrenamiento funcional en grupos reducidos. Incluidas en Signature y Privé.\n\n1. Ver otras instalaciones" + BACK,
    options: { 1: "facilities", 0: "main" },
  },
  visit: {
    text: "Con gusto te mostramos el club. Escríbenos por WhatsApp y coordinamos el día de tu recorrido.",
    links: [link(waUrl("Hola, quiero agendar una visita a Altum."), "Agendar por WhatsApp")],
    after: BACK.trim(),
    options: { 0: "main" },
  },
  social: {
    text: "Encuéntranos en:",
    links: [link(CLUB.instagram, "Instagram"), link(CLUB.facebook, "Facebook"), link(CLUB.tiktok, "TikTok")],
    after: BACK.trim(),
    options: { 0: "main" },
  },
  human: {
    text: `Un asesor te atiende por WhatsApp. También puedes llamar al ${CLUB.phone}.`,
    links: [link(waUrl("Hola, quiero hablar con un asesor de Altum."), "Escribir por WhatsApp")],
    after: BACK.trim(),
    options: { 0: "main" },
  },
};

const bot = document.getElementById("bot");
const log = document.getElementById("bot-log");
const keypad = document.getElementById("keypad");
const fab = document.querySelector(".bot-fab");
let current = "main";
let started = false;

function addMessage(kind) {
  const el = document.createElement("div");
  el.className = `msg msg-${kind}`;
  log.append(el);
  return el;
}

function show(id) {
  current = id;
  const menu = MENUS[id];
  const el = addMessage("bot");
  el.textContent = menu.text;
  (menu.links || []).forEach((l) => {
    const a = document.createElement("a");
    a.href = l.url;
    a.target = "_blank";
    a.rel = "noopener";
    a.textContent = l.text;
    el.append("\n", a);
  });
  if (menu.after) el.append("\n\n" + menu.after);
  syncKeys();
  log.scrollTop = log.scrollHeight;
}

function press(key) {
  const user = addMessage("user");
  user.textContent = key;
  const next = MENUS[current].options[key];
  if (next) {
    show(next);
  } else {
    addMessage("bot").textContent = "Esa opción no está en este menú. Marca uno de los números activos.";
    log.scrollTop = log.scrollHeight;
  }
}

["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", ""].forEach((k) => {
  if (!k) { keypad.append(document.createElement("span")); return; }
  const b = document.createElement("button");
  b.type = "button";
  b.className = "key";
  b.id = `key-${k}`;
  b.textContent = k;
  b.addEventListener("click", () => press(k));
  keypad.append(b);
});

function syncKeys() {
  keypad.querySelectorAll(".key").forEach((b) => {
    b.disabled = !(b.textContent in MENUS[current].options);
  });
}

function openBot() {
  bot.hidden = false;
  fab.hidden = true;
  if (!started) { started = true; show("main"); }
  document.getElementById("bot-close").focus();
}
function closeBot() {
  bot.hidden = true;
  fab.hidden = false;
  fab.focus();
}
document.querySelectorAll("[data-open-bot]").forEach((b) => b.addEventListener("click", openBot));
document.getElementById("bot-close").addEventListener("click", closeBot);

document.addEventListener("keydown", (e) => {
  if (bot.hidden) return;
  if (e.key === "Escape") closeBot();
  else if (/^[0-9]$/.test(e.key) && !e.ctrlKey && !e.metaKey && !e.altKey) press(e.key);
});
