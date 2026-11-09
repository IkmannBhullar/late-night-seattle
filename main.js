/* ==========================================================
   CONFIG: every link on the site lives here.
   Anything still wrapped in [BRACKETS] shows as a dimmed placeholder.
   ========================================================== */
const CONFIG = {
  email: "Ikmannb12@gmail.com",
  linkedin: "https://www.linkedin.com/in/ikmannbhullar/",
  github: "https://github.com/IkmannBhullar",
  resume: "[RESUME_LINK]",
  projects: {
    clinicrecall: { demo: "https://clinicrecall-2-web.vercel.app", code: "https://github.com/IkmannBhullar/clinicrecall-2" },
    permitflow:   { demo: "[LINK]", code: "[LINK]" },
    swapspot:     { demo: "[LINK]", code: "[LINK]" },
    litemusic:    { demo: "[LINK]", code: "[LINK]" },
    greenbite:    { demo: "[LINK]", code: "[LINK]" },
  },
};

(() => {
  "use strict";

  const SVG_NS = "http://www.w3.org/2000/svg";
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const body = document.body;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  /* ---------- links from CONFIG ---------- */
  const lookup = (path) => path.split(".").reduce((o, k) => (o == null ? o : o[k]), CONFIG);
  const isPlaceholder = (v) => !v || /^\[.*\]$/.test(String(v).trim());

  function wireLinks() {
    $$("[data-link]").forEach((a) => {
      const key = a.dataset.link;
      let v = lookup(key);
      if (isPlaceholder(v)) {
        // unfinished link: hide it (or its whole row) instead of showing a dead link
        (a.closest("[data-ph-scope]") || a).hidden = true;
        return;
      }
      if (key === "email") v = `mailto:${v}`;
      a.setAttribute("href", v);
      if (/^https?:/.test(v)) {
        a.setAttribute("target", "_blank");
        a.setAttribute("rel", "noopener noreferrer");
      }
    });
    $$(".links").forEach((row) => {
      if (!$$("a", row).some((x) => !x.hidden)) row.hidden = true;
    });
    $$("[data-text]").forEach((el) => {
      let v = lookup(el.dataset.text) || "";
      if (el.hasAttribute("data-strip")) v = v.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");
      el.textContent = v;
    });
  }

  /* ---------- seeded random so the skyline looks the same every visit ---------- */
  let seed = 7;
  const rand = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
  const el = (tag, attrs = {}, parent) => {
    const n = document.createElementNS(SVG_NS, tag);
    for (const k in attrs) n.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(n);
    return n;
  };

  function buildScenery() {
    // lit windows in the skyline
    $$(".bld").forEach((b) => {
      const x = +b.getAttribute("x"), y = +b.getAttribute("y");
      const w = +b.getAttribute("width"), h = +b.getAttribute("height");
      const g = el("g");
      for (let yy = y + 8; yy < y + h - 6; yy += 11) {
        for (let xx = x + 6; xx < x + w - 6; xx += 10) {
          if (rand() < 0.3) el("rect", { x: xx, y: yy, width: 4, height: 5, fill: rand() < 0.75 ? "#F2B45A" : "#9fc4de", opacity: (0.35 + rand() * 0.45).toFixed(2) }, g);
        }
      }
      b.after(g);
    });

    // string-light bulbs along the swag (quadratic segments, 460 wide)
    const lights = $("#string-lights");
    const segs = [[-60, 20, 170, 64, 400, 22], [400, 22, 630, -20, 860, 22], [860, 22, 1090, 64, 1320, 22], [1320, 22, 1550, -20, 1780, 22]];
    segs.forEach(([x0, y0, , , x2, y2], i) => {
      const cy = 64; // sag
      const cx = (x0 + x2) / 2;
      for (const t of [0.2, 0.5, 0.8]) {
        const x = (1 - t) ** 2 * x0 + 2 * (1 - t) * t * cx + t * t * x2;
        const y = (1 - t) ** 2 * y0 + 2 * (1 - t) * t * cy + t * t * y2;
        el("circle", { cx: x.toFixed(1), cy: (y + 8).toFixed(1), r: 14, class: "bulb-halo" }, lights);
        el("circle", { cx: x.toFixed(1), cy: (y + 8).toFixed(1), r: 4.5, class: "bulb" }, lights);
      }
    });
    // redraw the wire so every segment sags
    lights.querySelector("path").setAttribute("d", segs.map(([x0, y0, , , x2, y2], i) => `${i ? "" : `M${x0} ${y0}`}Q${(x0 + x2) / 2} 64 ${x2} ${y2}`).join(""));

    // rain: falling streaks + slow drips on the glass
    makeRain($("#rain-window"), { x: 400, y: 100, w: 520, h: 430, count: 85 });
    const drops = $("#drops-window");
    for (let i = 0; i < 46; i++) {
      el("ellipse", { cx: (400 + rand() * 520).toFixed(1), cy: (110 + rand() * 410).toFixed(1), rx: (0.8 + rand() * 1.6).toFixed(1), ry: (1.2 + rand() * 2.2).toFixed(1), fill: "#d6e5f1", opacity: (0.12 + rand() * 0.2).toFixed(2) }, drops);
    }
    for (let i = 0; i < 9; i++) {
      const d = el("ellipse", { cx: (410 + rand() * 500).toFixed(1), cy: (60 + rand() * 120).toFixed(1), rx: 1.6, ry: 3.2, class: "drip" }, drops);
      d.style.animationDuration = `${(7 + rand() * 9).toFixed(1)}s`;
      d.style.animationDelay = `-${(rand() * 14).toFixed(1)}s`;
    }
  }

  function makeRain(g, { x, y, w, h, count }) {
    for (let i = 0; i < count; i++) {
      const rx = x + rand() * (w + 40);
      const len = 14 + rand() * 26;
      const ln = el("line", { x1: rx.toFixed(1), y1: (y - 60).toFixed(1), x2: (rx - 2.5).toFixed(1), y2: (y - 60 + len).toFixed(1), "stroke-width": (0.8 + rand() * 0.9).toFixed(2), opacity: (0.18 + rand() * 0.3).toFixed(2) }, g);
      const dur = 0.55 + rand() * 0.6;
      ln.style.animationDuration = `${dur.toFixed(2)}s`;
      ln.style.animationDelay = `-${(rand() * dur).toFixed(2)}s`;
    }
  }

  /* ---------- hotspots: labels, focus rings, activation ---------- */
  const labels = $("#labels");

  function setupHotspots() {
    $$(".hotspot").forEach((h) => {
      const bb = h.getBBox();
      const pad = 10;
      const ring = el("rect", { x: bb.x - pad, y: bb.y - pad, width: bb.width + pad * 2, height: bb.height + pad * 2, rx: 12, class: "hs-ring" }, labels);
      const below = h.dataset.labelPos === "below";
      const lx = Math.min(1560, Math.max(60, bb.x + bb.width / 2));
      const ly = below ? bb.y + bb.height + 38 : Math.max(44, bb.y - 16);
      const label = el("text", { x: lx, y: ly, "text-anchor": "middle", class: "hs-label", "data-for": h.id }, labels);
      label.textContent = h.dataset.label || "";

      const on = () => { label.classList.add("show"); h.classList.add("is-hot"); };
      const off = () => { label.classList.remove("show"); h.classList.remove("is-hot"); ring.classList.remove("show"); };
      h.addEventListener("pointerenter", on);
      h.addEventListener("pointerleave", () => { if (document.activeElement !== h) off(); });
      h.addEventListener("focus", () => { on(); if (h.matches(":focus-visible")) ring.classList.add("show"); });
      h.addEventListener("blur", off);

      if (h.getAttribute("role") === "button") {
        const activate = () => (h.id === "hs-sign" ? toggleSign() : openPanel(h.dataset.panel, h));
        h.addEventListener("click", activate);
        h.addEventListener("keydown", (e) => {
          if (e.key === "Enter" || e.key === " ") { e.preventDefault(); activate(); }
        });
      }
    });
  }

  /* ---------- panels ---------- */
  const root = $("#panel-root");
  const panel = $("#panel");
  const app = $("#app");
  let lastTrigger = null;
  let currentId = null;

  function openPanel(id, trigger) {
    const sec = document.getElementById(id);
    if (!sec || !sec.classList.contains("sheet")) return;
    lastTrigger = trigger || document.activeElement;
    $$(".sheet", panel).forEach((s) => (s.hidden = s !== sec));
    panel.dataset.style = sec.dataset.style || "paper";
    const h2 = sec.querySelector("h2");
    panel.setAttribute("aria-labelledby", h2.id);
    root.classList.add("is-open");
    app.inert = true;
    document.documentElement.style.overflow = "hidden";
    panel.scrollTop = 0;
    currentId = id;
    if (location.hash !== `#${id}`) history.replaceState(null, "", `#${id}`);
    requestAnimationFrame(() => h2.focus({ preventScroll: true }));
  }

  function closePanel() {
    if (!root.classList.contains("is-open")) return;
    root.classList.remove("is-open");
    app.inert = false;
    document.documentElement.style.overflow = "";
    currentId = null;
    history.replaceState(null, "", location.pathname + location.search);
    if (lastTrigger && document.contains(lastTrigger)) lastTrigger.focus({ preventScroll: true });
  }

  function setupPanels() {
    $$("[data-close]", root).forEach((b) => b.addEventListener("click", closePanel));
    document.addEventListener("click", (e) => {
      const t = e.target.closest("[data-open]");
      if (!t) return;
      e.preventDefault();
      openPanel(t.dataset.open, t);
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        if (root.classList.contains("is-open")) closePanel();
        else if (note.classList.contains("show")) hideNote();
        return;
      }
      if (e.key === "Tab" && root.classList.contains("is-open")) trapFocus(e);
    });
    window.addEventListener("hashchange", () => {
      const id = location.hash.slice(1);
      if (id && id !== currentId) openPanel(id);
    });
    const initial = location.hash.slice(1);
    if (initial) openPanel(initial);
  }

  function trapFocus(e) {
    const f = $$('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])', panel).filter((n) => n.offsetParent !== null || n === document.activeElement);
    if (!f.length) return;
    const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && (document.activeElement === first || !panel.contains(document.activeElement))) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }

  /* ---------- the neon sign: CLOSED <-> OPEN TO WORK ---------- */
  const sign = $("#hs-sign");
  const note = $("#open-note");

  function toggleSign(force) {
    const open = typeof force === "boolean" ? force : !body.classList.contains("sign-open");
    body.classList.toggle("sign-open", open);
    body.classList.add("sign-lit");
    sign.setAttribute("aria-pressed", String(open));
    sign.setAttribute("aria-label", open ? "Neon sign: Open to work. Flip it back to Closed." : "Neon sign: currently Closed. Flip it to Open to work.");
    sign.dataset.label = open ? "flip it back" : "flip the sign";
    const lab = $(`.hs-label[data-for="hs-sign"]`);
    if (lab) lab.textContent = sign.dataset.label;
    open ? showNote() : hideNote();
  }
  function showNote() { note.classList.add("show"); }
  function hideNote() { note.classList.remove("show"); }

  function setupSign() {
    $(".note-x", note).addEventListener("click", hideNote);
    $$("[data-flip]").forEach((b) => b.addEventListener("click", () => { closePanel(); toggleSign(true); }));
  }

  /* ---------- rain toggle ---------- */
  function setupRain() {
    const btn = $("#rain-toggle");
    btn.addEventListener("click", () => {
      const off = body.classList.toggle("no-rain");
      btn.setAttribute("aria-pressed", String(!off));
      $(".state", btn).textContent = off ? "off" : "on";
    });
  }

  /* ---------- skills: shake the cork board ---------- */
  function setupBoard() {
    const btn = $("#shake-board"), grid = $("#notes-grid");
    if (!btn || !grid) return;
    const tilt = (max) => `${(Math.random() * max * 2 - max).toFixed(1)}deg`;
    btn.addEventListener("click", () => {
      $$(".sn", grid).forEach((n) => n.style.setProperty("--r", tilt(3.5)));
      $$(".chips li", grid).forEach((c) => c.style.setProperty("--cr", tilt(3)));
      grid.classList.toggle("shaking", false);
      void grid.offsetWidth; // restart the animation
      grid.classList.add("shaking");
    });
    grid.addEventListener("animationend", () => grid.classList.toggle("shaking", false));
  }

  /* ---------- copy email ---------- */
  function setupCopy() {
    const btn = $("#copy-email"), status = $(".copy-status");
    btn.addEventListener("click", async () => {
      try { await navigator.clipboard.writeText(CONFIG.email); status.textContent = "copied ✓"; }
      catch { status.textContent = CONFIG.email; }
      setTimeout(() => (status.textContent = ""), 2400);
    });
  }

  /* ---------- the one orchestrated opening ---------- */
  function boot() {
    if (reduceMotion.matches) {
      body.classList.add("lights-on", "sign-lit", "steam-on", "rain-on");
      return;
    }
    setTimeout(() => body.classList.add("lights-on"), 250);   // lights flicker on
    setTimeout(() => body.classList.add("sign-lit"), 1300);   // neon buzzes awake
    setTimeout(() => body.classList.add("steam-on"), 1500);   // steam starts
    setTimeout(() => body.classList.add("rain-on"), 1900);    // rain fades in
  }

  /* ---------- mobile: start the pan on the counter ---------- */
  function centerScene() {
    const s = $("#scene");
    if (s.scrollWidth > s.clientWidth) s.scrollLeft = (s.scrollWidth - s.clientWidth) * 0.5;
  }

  /* ---------- go ---------- */
  wireLinks();
  buildScenery();
  setupPanels();
  setupSign();
  setupRain();
  setupCopy();
  setupBoard();
  centerScene();
  boot();
  // label/ring placement depends on text metrics, so wait for fonts
  (document.fonts ? document.fonts.ready : Promise.resolve()).then(setupHotspots);
})();
