(function () {
  "use strict";

  /* ---------- Split the envelope names into animated characters ---------- */
  var lines = Array.prototype.slice.call(document.querySelectorAll(".env-names .line"));
  lines.forEach(function (line, li) {
    var text = line.getAttribute("data-text") || line.textContent;
    var base = 0.35 + li * 0.55;              // stagger each line
    line.textContent = "";
    line.style.setProperty("--base", base + "s");
    text.split("").forEach(function (ch, i) {
      var s = document.createElement("span");
      s.textContent = ch === " " ? " " : ch;
      s.style.setProperty("--i", i);
      line.appendChild(s);
    });
  });

  /* ---------- Align the lace trim to the flap's diagonal edges ----------
     The flap is a triangle spanning the full width, so its edge angle depends
     on the viewport. Measure it and feed the angle + length to CSS.          */
  var introEl = document.querySelector(".intro");
  var flapEl = document.querySelector(".env-flap");
  function fitLace() {
    if (!introEl || !flapEl) return;
    var w = flapEl.offsetWidth, h = flapEl.offsetHeight;
    if (!w || !h) return;
    var angle = Math.atan2(h, w / 2) * 180 / Math.PI;
    var len = Math.sqrt((w / 2) * (w / 2) + h * h);
    introEl.style.setProperty("--lace-angle", angle + "deg");
    introEl.style.setProperty("--lace-len", len + "px");
  }
  fitLace();
  window.addEventListener("resize", fitLace);

  /* ---------- Intro petals ---------- */
  var petals = document.querySelector(".petals");
  if (petals) {
    for (var p = 0; p < 18; p++) {
      var i = document.createElement("i");
      i.style.left = Math.random() * 100 + "vw";
      i.style.animationDuration = (9 + Math.random() * 8) + "s, " + (3 + Math.random() * 3) + "s";
      i.style.animationDelay = "-" + (Math.random() * 12) + "s, -" + (Math.random() * 12) + "s";
      i.style.transform = "scale(" + (0.6 + Math.random() * 0.9) + ")";
      if (Math.random() > 0.5) i.style.background = "var(--blush)";
      petals.appendChild(i);
    }
  }

  /* ---------- Open the envelope ---------- */
  var envelope = document.querySelector(".envelope");
  var intro = document.querySelector(".intro");
  var content = document.querySelector(".content");
  var opened = false;

  function openIt() {
    if (opened) return;
    opened = true;
    envelope.classList.add("open");
    setTimeout(function () {
      intro.classList.add("gone");
      content.classList.add("show");
      document.body.style.overflow = "auto";
      window.scrollTo(0, 0);
      revealAll();
    }, 1500);
  }
  if (envelope && intro) {
    document.body.style.overflow = "hidden";
    // listen on the whole intro, not just .envelope — the hint text and other
    // overlays sit above the envelope and would otherwise swallow the tap
    intro.addEventListener("click", openIt);
    envelope.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openIt(); }
    });
  }

  /* ---------- Scroll reveals ---------- */
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
    });
  }, { threshold: 0.18 });
  function revealAll() {
    document.querySelectorAll(".rv, .heart").forEach(function (el) { io.observe(el); });
  }

  /* ---------- Countdown ---------- */
  var WEDDING_DATE = new Date("2026-12-18T07:00:00");
  var el = {
    days: document.querySelector('[data-cd="days"]'),
    hours: document.querySelector('[data-cd="hours"]'),
    minutes: document.querySelector('[data-cd="minutes"]'),
    seconds: document.querySelector('[data-cd="seconds"]')
  };
  function tick() {
    var diff = Math.max(0, WEDDING_DATE - new Date());
    if (el.days) el.days.textContent = String(Math.floor(diff / 86400000));
    if (el.hours) el.hours.textContent = String(Math.floor((diff / 3600000) % 24)).padStart(2, "0");
    if (el.minutes) el.minutes.textContent = String(Math.floor((diff / 60000) % 60)).padStart(2, "0");
    if (el.seconds) el.seconds.textContent = String(Math.floor((diff / 1000) % 60)).padStart(2, "0");
  }
  if (el.days) { tick(); setInterval(tick, 1000); }

  /* ---------- Lightbox ---------- */
  var imgs = Array.prototype.slice.call(document.querySelectorAll(".m-grid img"));
  var lb = document.querySelector(".lightbox");
  if (lb && imgs.length) {
    var lbImg = lb.querySelector("img"), cur = 0;
    function show(i) { cur = i; lbImg.src = imgs[i].src; lbImg.alt = imgs[i].alt; }
    function open(i) { show(i); lb.classList.add("active"); }
    function close() { lb.classList.remove("active"); }
    function step(n) { show((cur + n + imgs.length) % imgs.length); }
    imgs.forEach(function (im, i) { im.addEventListener("click", function () { open(i); }); });
    lb.querySelector(".lx-close").addEventListener("click", close);
    lb.querySelector(".lx-prev").addEventListener("click", function () { step(-1); });
    lb.querySelector(".lx-next").addEventListener("click", function () { step(1); });
    lb.addEventListener("click", function (e) { if (e.target === lb) close(); });
    document.addEventListener("keydown", function (e) {
      if (!lb.classList.contains("active")) return;
      if (e.key === "Escape") close();
      else if (e.key === "ArrowLeft") step(-1);
      else if (e.key === "ArrowRight") step(1);
    });
  }
})();
