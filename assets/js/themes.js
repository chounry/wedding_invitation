/* Shared behaviour for the EventLink-style themes
   (emerald, palace, amalfi, velvet, olive).
   The intro animation itself is pure CSS keyed off body.opening;
   <body data-open-ms="..."> sets how long it runs before the content shows.
   Optional hooks a theme can opt into from its markup:
     .intro.keep      intro stays on screen (pointer-events off) as a frame
     [data-split]     text is split into <span style="--i"> per character
     [data-scroll]    gets --p = 0..1 as it travels through the viewport
     .track           horizontal album: dots, arrows, wheel + keys, .active panel
     .spotlight       follows the pointer via --mx / --my                      */
(function () {
  "use strict";

  var WEDDING_DATE = new Date("2026-12-18T07:00:00");
  // Placeholder: replies open the guest's mail app addressed here.
  var RSVP_EMAIL = "rsvp@example.com";

  var body = document.body;
  var intro = document.querySelector(".intro");
  var content = document.querySelector(".content");
  var track = document.querySelector(".track");
  var openMs = parseInt(body.getAttribute("data-open-ms"), 10) || 1600;

  /* ---------- Split text into characters ---------- */
  document.querySelectorAll("[data-split]").forEach(function (el) {
    var text = el.textContent;
    el.setAttribute("aria-label", text);
    el.textContent = "";
    text.split("").forEach(function (ch, i) {
      var s = document.createElement("span");
      s.textContent = ch === " " ? " " : ch;
      s.setAttribute("aria-hidden", "true");
      s.style.setProperty("--i", i);
      el.appendChild(s);
    });
  });

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
      if (intro.classList.contains("keep")) intro.setAttribute("aria-hidden", "true");
      else intro.classList.add("gone");
      content.classList.add("show");
      body.classList.add("opened");
      body.classList.remove("locked");
      window.scrollTo(0, 0);
      revealAll();
      if (track) setActive(0);
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
    body.classList.add("opened");
    revealAll();
  }

  /* ---------- Scroll progress (--p) ---------- */
  var progressEls = Array.prototype.slice.call(document.querySelectorAll("[data-scroll]"));
  var ticking = false;
  function updateProgress() {
    ticking = false;
    var vh = window.innerHeight;
    progressEls.forEach(function (el) {
      var r = el.getBoundingClientRect();
      var p = (vh - r.top) / (vh + r.height);
      el.style.setProperty("--p", Math.min(1, Math.max(0, p)).toFixed(4));
    });
  }
  if (progressEls.length) {
    window.addEventListener("scroll", function () {
      if (!ticking) { ticking = true; requestAnimationFrame(updateProgress); }
    }, { passive: true });
    window.addEventListener("resize", updateProgress);
    updateProgress();
  }

  /* ---------- Spotlight ---------- */
  var spot = document.querySelector(".spotlight");
  if (spot) {
    window.addEventListener("pointermove", function (e) {
      spot.style.setProperty("--mx", e.clientX + "px");
      spot.style.setProperty("--my", e.clientY + "px");
      spot.classList.add("follow");
    }, { passive: true });
  }

  /* ---------- Horizontal album ---------- */
  var panels = track ? Array.prototype.slice.call(track.querySelectorAll(".panel")) : [];
  var current = -1;
  var dotsWrap = document.querySelector(".pager-dots");
  var counter = document.querySelector(".pager-count");
  function setActive(i) {
    if (i === current) return;
    current = i;
    panels.forEach(function (p, j) { p.classList.toggle("active", j === i); });
    if (dotsWrap) {
      Array.prototype.forEach.call(dotsWrap.children, function (d, j) {
        d.classList.toggle("on", j === i);
        d.setAttribute("aria-current", j === i ? "step" : "false");
      });
    }
    if (counter) counter.textContent = String(i + 1).padStart(2, "0") + " / " + String(panels.length).padStart(2, "0");
  }
  function goTo(i) {
    i = Math.max(0, Math.min(panels.length - 1, i));
    track.scrollTo({ left: panels[i].offsetLeft, behavior: "smooth" });
  }
  if (track && panels.length) {
    if (dotsWrap) {
      panels.forEach(function (p, i) {
        var b = document.createElement("button");
        b.type = "button";
        b.setAttribute("aria-label", "Go to " + (p.getAttribute("data-title") || "page " + (i + 1)));
        b.addEventListener("click", function () { goTo(i); });
        dotsWrap.appendChild(b);
      });
    }
    var prev = document.querySelector(".pager-prev");
    var next = document.querySelector(".pager-next");
    if (prev) prev.addEventListener("click", function () { goTo(current - 1); });
    if (next) next.addEventListener("click", function () { goTo(current + 1); });
    track.addEventListener("scroll", function () {
      setActive(Math.round(track.scrollLeft / track.clientWidth));
    }, { passive: true });
    document.addEventListener("keydown", function (e) {
      if (!body.classList.contains("opened") || (lb && lb.classList.contains("active"))) return;
      if (e.target.closest && e.target.closest("input, textarea")) return;
      if (e.key === "ArrowRight" || e.key === "PageDown") { e.preventDefault(); goTo(current + 1); }
      else if (e.key === "ArrowLeft" || e.key === "PageUp") { e.preventDefault(); goTo(current - 1); }
    });
    // Desktop mouse wheels only scroll vertically: turn a wheel flick into a page turn
    // once the panel itself has no more vertical room in that direction.
    var wheelLock = 0;
    track.addEventListener("wheel", function (e) {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
      var panel = panels[current];
      var inner = panel && panel.querySelector(".panel-in");
      if (inner) {
        var atTop = inner.scrollTop <= 0;
        var atEnd = inner.scrollTop + inner.clientHeight >= inner.scrollHeight - 2;
        if ((e.deltaY > 0 && !atEnd) || (e.deltaY < 0 && !atTop)) return;
      }
      e.preventDefault();
      var now = Date.now();
      if (now - wheelLock < 700) return;
      wheelLock = now;
      goTo(current + (e.deltaY > 0 ? 1 : -1));
    }, { passive: false });
  }

  /* ---------- Countdown ---------- */
  var cd = {};
  ["days", "hours", "minutes", "seconds"].forEach(function (k) {
    cd[k] = document.querySelector('[data-cd="' + k + '"]');
  });
  function pad(n) { return String(n).padStart(2, "0"); }
  function set(el, v) {
    if (el.textContent === v) return;
    el.textContent = v;
    // themes can animate .num.flip (e.g. a flip-clock turn)
    el.classList.remove("flip");
    void el.offsetWidth;
    el.classList.add("flip");
  }
  function tick() {
    var diff = Math.max(0, WEDDING_DATE - new Date());
    set(cd.days, String(Math.floor(diff / 86400000)));
    set(cd.hours, pad(Math.floor((diff / 3600000) % 24)));
    set(cd.minutes, pad(Math.floor((diff / 60000) % 60)));
    set(cd.seconds, pad(Math.floor((diff / 1000) % 60)));
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
