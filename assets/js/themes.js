/* Shared behaviour for the EventLink-style themes
   (emerald, palace, amalfi, velvet, olive).
   The intro animation itself is pure CSS keyed off body.opening;
   <body data-open-ms="..."> sets how long it runs before the content shows. */
(function () {
  "use strict";

  var WEDDING_DATE = new Date("2026-12-18T07:00:00");
  // Placeholder: replies open the guest's mail app addressed here.
  var RSVP_EMAIL = "rsvp@example.com";

  var body = document.body;
  var intro = document.querySelector(".intro");
  var content = document.querySelector(".content");
  var openMs = parseInt(body.getAttribute("data-open-ms"), 10) || 1600;

  /* ---------- Scroll reveals ---------- */
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
    });
  }, { threshold: 0.15 });
  function revealAll() {
    document.querySelectorAll(".rv").forEach(function (el) { io.observe(el); });
  }

  /* ---------- Intro ---------- */
  var opened = false;
  function openIt() {
    if (opened) return;
    opened = true;
    body.classList.add("opening");
    setTimeout(function () {
      intro.classList.add("gone");
      content.classList.add("show");
      body.classList.remove("locked");
      window.scrollTo(0, 0);
      revealAll();
    }, openMs);
  }
  if (intro) {
    body.classList.add("locked");
    intro.setAttribute("tabindex", "0");
    intro.setAttribute("role", "button");
    intro.addEventListener("click", openIt);
    intro.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openIt(); }
    });
    intro.focus({ preventScroll: true });
  } else {
    if (content) content.classList.add("show");
    revealAll();
  }

  /* ---------- Countdown ---------- */
  var cd = {};
  ["days", "hours", "minutes", "seconds"].forEach(function (k) {
    cd[k] = document.querySelector('[data-cd="' + k + '"]');
  });
  function pad(n) { return String(n).padStart(2, "0"); }
  function tick() {
    var diff = Math.max(0, WEDDING_DATE - new Date());
    cd.days.textContent = String(Math.floor(diff / 86400000));
    cd.hours.textContent = pad(Math.floor((diff / 3600000) % 24));
    cd.minutes.textContent = pad(Math.floor((diff / 60000) % 60));
    cd.seconds.textContent = pad(Math.floor((diff / 1000) % 60));
  }
  if (cd.days) { tick(); setInterval(tick, 1000); }

  /* ---------- RSVP ---------- */
  var form = document.querySelector(".rsvp-form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var data = new FormData(form);
      var attending = data.get("attending") === "yes";
      var lines = [
        "Name: " + (data.get("name") || ""),
        "Attending: " + (attending ? "Yes" : "No"),
        attending ? "Guests: " + (data.get("guests") || "1") : "",
        data.get("message") ? "Message: " + data.get("message") : ""
      ].filter(Boolean);
      var done = form.querySelector(".rsvp-done p");
      if (done) {
        done.textContent = attending
          ? "We can't wait to celebrate with you."
          : "We'll miss you, and thank you for letting us know.";
      }
      form.classList.add("sent");
      window.location.href = "mailto:" + RSVP_EMAIL +
        "?subject=" + encodeURIComponent("Wedding RSVP - " + (data.get("name") || "")) +
        "&body=" + encodeURIComponent(lines.join("\n"));
    });
  }

  /* ---------- Lightbox ---------- */
  var imgs = Array.prototype.slice.call(document.querySelectorAll(".gallery img"));
  var lb = document.querySelector(".lightbox");
  if (lb && imgs.length) {
    var lbImg = lb.querySelector("img"), cur = 0;
    var show = function (i) { cur = i; lbImg.src = imgs[i].src; lbImg.alt = imgs[i].alt; };
    var close = function () { lb.classList.remove("active"); };
    var step = function (n) { show((cur + n + imgs.length) % imgs.length); };
    imgs.forEach(function (im, i) {
      im.addEventListener("click", function () { show(i); lb.classList.add("active"); });
    });
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
