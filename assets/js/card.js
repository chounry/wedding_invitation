(function () {
  "use strict";

  /* ---------- Envelope open ---------- */
  var envelope = document.querySelector(".envelope");
  var stage = document.querySelector(".stage");
  var invitation = document.querySelector(".invitation");
  var opened = false;

  function openEnvelope() {
    if (opened) return;
    opened = true;
    envelope.classList.add("open");
    // after the flap + letter animation, reveal the full invitation
    setTimeout(function () {
      stage.classList.add("hidden");
      invitation.classList.add("show");
      document.body.style.overflow = "auto";
    }, 1500);
  }
  if (envelope) {
    document.body.style.overflow = "hidden";
    envelope.addEventListener("click", openEnvelope);
    envelope.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openEnvelope(); }
    });
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
  var imgs = Array.prototype.slice.call(document.querySelectorAll(".iv-photos img"));
  var lb = document.querySelector(".lightbox");
  if (lb && imgs.length) {
    var lbImg = lb.querySelector("img"), cur = 0;
    function open(i) { cur = i; lbImg.src = imgs[i].src; lb.classList.add("active"); }
    function close() { lb.classList.remove("active"); }
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
