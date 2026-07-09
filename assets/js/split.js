(function () {
  "use strict";

  /* ---------- Left visual slideshow ---------- */
  var slides = Array.prototype.slice.call(document.querySelectorAll(".sv-slide"));
  if (slides.length > 1) {
    var idx = 0;
    setInterval(function () {
      slides[idx].classList.remove("active");
      idx = (idx + 1) % slides.length;
      slides[idx].classList.add("active");
    }, 4500);
  }

  /* ---------- Reveal on scroll ---------- */
  var obs = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add("in-view"); obs.unobserve(e.target); }
    });
  }, { threshold: 0.2 });
  document.querySelectorAll(".reveal").forEach(function (el) { obs.observe(el); });

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
  var imgs = Array.prototype.slice.call(document.querySelectorAll(".thumbs img"));
  var lb = document.querySelector(".lightbox");
  if (lb && imgs.length) {
    var lbImg = lb.querySelector("img"), cur = 0;
    function open(i) { cur = i; lbImg.src = imgs[i].src; lb.classList.add("active"); document.body.style.overflow = "hidden"; }
    function close() { lb.classList.remove("active"); document.body.style.overflow = ""; }
    function step(n) { cur = (cur + n + imgs.length) % imgs.length; lbImg.src = imgs[cur].src; }
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
