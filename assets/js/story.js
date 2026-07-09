(function () {
  "use strict";

  /* ---------- Panel reveal + active dot (IntersectionObserver) ---------- */
  var panels = Array.prototype.slice.call(document.querySelectorAll(".panel"));
  var dots = Array.prototype.slice.call(document.querySelectorAll(".dots button"));

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      var idx = panels.indexOf(entry.target);
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
        if (entry.intersectionRatio >= 0.5) {
          dots.forEach(function (d) { d.classList.remove("active"); });
          if (dots[idx]) dots[idx].classList.add("active");
        }
      }
    });
  }, { threshold: [0.15, 0.5] });
  panels.forEach(function (p) { observer.observe(p); });

  /* dot click -> scroll to panel */
  dots.forEach(function (dot, idx) {
    dot.addEventListener("click", function () {
      if (panels[idx]) panels[idx].scrollIntoView({ behavior: "smooth" });
    });
  });

  /* ---------- Countdown ---------- */
  // EDIT ME: wedding start date/time (local)
  var WEDDING_DATE = new Date("2026-12-18T07:00:00");
  var el = {
    days: document.querySelector('[data-cd="days"]'),
    hours: document.querySelector('[data-cd="hours"]'),
    minutes: document.querySelector('[data-cd="minutes"]'),
    seconds: document.querySelector('[data-cd="seconds"]')
  };
  function tick() {
    var diff = Math.max(0, WEDDING_DATE - new Date());
    var d = Math.floor(diff / 86400000);
    var h = Math.floor((diff / 3600000) % 24);
    var m = Math.floor((diff / 60000) % 60);
    var s = Math.floor((diff / 1000) % 60);
    if (el.days) el.days.textContent = String(d);
    if (el.hours) el.hours.textContent = String(h).padStart(2, "0");
    if (el.minutes) el.minutes.textContent = String(m).padStart(2, "0");
    if (el.seconds) el.seconds.textContent = String(s).padStart(2, "0");
  }
  if (el.days) { tick(); setInterval(tick, 1000); }

  /* ---------- Lightbox for filmstrip ---------- */
  var imgs = Array.prototype.slice.call(document.querySelectorAll(".filmstrip img"));
  var lightbox = document.querySelector(".lightbox");
  if (lightbox && imgs.length) {
    var lbImg = lightbox.querySelector("img");
    var cur = 0;

    function open(i) {
      cur = i;
      lbImg.src = imgs[i].src;
      lbImg.alt = imgs[i].alt;
      lightbox.classList.add("active");
      document.body.style.overflow = "hidden";
    }
    function close() {
      lightbox.classList.remove("active");
      document.body.style.overflow = "";
    }
    function step(n) {
      cur = (cur + n + imgs.length) % imgs.length;
      lbImg.src = imgs[cur].src;
      lbImg.alt = imgs[cur].alt;
    }

    imgs.forEach(function (im, i) { im.addEventListener("click", function () { open(i); }); });
    lightbox.querySelector(".lx-close").addEventListener("click", close);
    lightbox.querySelector(".lx-prev").addEventListener("click", function () { step(-1); });
    lightbox.querySelector(".lx-next").addEventListener("click", function () { step(1); });
    lightbox.addEventListener("click", function (e) { if (e.target === lightbox) close(); });
    document.addEventListener("keydown", function (e) {
      if (!lightbox.classList.contains("active")) return;
      if (e.key === "Escape") close();
      else if (e.key === "ArrowLeft") step(-1);
      else if (e.key === "ArrowRight") step(1);
    });
  }
})();
