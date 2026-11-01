/* Motion layer for the themed pages, on top of each theme's own CSS animation:
   GSAP + ScrollTrigger + SplitText for scroll-linked scenes, Lenis for smooth scrolling.
   Each theme gets its own motion personality (see FX below); a few basics are shared.
   If the CDN scripts fail or the guest prefers reduced motion this does nothing,
   and the CSS-only version still works.                                              */
(function () {
  "use strict";
  if (!window.gsap || !window.ScrollTrigger || !window.SplitText) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  gsap.registerPlugin(ScrollTrigger, SplitText);
  // the mobile address bar showing/hiding would otherwise re-measure pinned scenes mid-scroll
  ScrollTrigger.config({ ignoreMobileResize: true });

  var root = document.documentElement;
  var body = document.body;
  var track = document.querySelector(".track");
  var finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  var touch = !finePointer;
  var theme = (body.className.match(/\bt-(\w+)/) || [])[1];

  function cols(gal) { return getComputedStyle(gal).gridTemplateColumns.split(" ").length; }
  function clamp(v) { return Math.max(-1, Math.min(1, v)); }
  function buzz(pattern) { if (touch && navigator.vibrate) navigator.vibrate(pattern); }

  /* ================= Particles ================= */
  var COLOR_VARS = ["--accent", "--accent-2", "--gold-hi", "--velvet", "--champagne", "--lemon", "--wine", "--leaf-2", "--sheen"];

  function resolveColors(list) {
    // custom properties can hold color-mix(); a probe resolves them to rgb() for canvas
    var probe = document.createElement("i");
    body.appendChild(probe);
    var cs = getComputedStyle(root);
    var out = list.map(function (v) { return v.indexOf("--") === 0 ? cs.getPropertyValue(v).trim() : v; })
      .filter(Boolean)
      .map(function (v) { probe.style.color = v; return getComputedStyle(probe).color; });
    probe.remove();
    return out;
  }

  function drawShape(ctx, shape, s, flip, t) {
    ctx.beginPath();
    if (shape === "dot") {
      ctx.arc(0, 0, s * 0.5, 0, Math.PI * 2);
    } else if (shape === "spark") {
      s *= 0.55 + 0.45 * Math.abs(Math.sin(t * 7 + flip));
      ctx.moveTo(0, -s);
      ctx.quadraticCurveTo(0, 0, s, 0);
      ctx.quadraticCurveTo(0, 0, 0, s);
      ctx.quadraticCurveTo(0, 0, -s, 0);
      ctx.quadraticCurveTo(0, 0, 0, -s);
    } else if (shape === "petal" || shape === "leaf") {
      ctx.ellipse(0, 0, s * 0.7, s * (shape === "leaf" ? 0.26 : 0.42) * Math.abs(Math.cos(flip)) + 0.5, 0, 0, Math.PI * 2);
    } else {
      ctx.rect(-s * 0.5, -s * 0.22 * Math.abs(Math.cos(flip)) - 0.5, s, s * 0.44 * Math.abs(Math.cos(flip)) + 1);
    }
    ctx.fill();
  }

  // origins: [{x, y, angle, spread}] for bursts; opts.rain drops from the top instead
  function burst(origins, opts) {
    opts = opts || {};
    var canvas = document.createElement("canvas");
    canvas.className = "burst";
    canvas.setAttribute("aria-hidden", "true");
    body.appendChild(canvas);
    var w = innerWidth, h = innerHeight;
    var dpr = Math.min(2, window.devicePixelRatio || 1);
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    var ctx = canvas.getContext("2d");
    ctx.scale(dpr, dpr);

    var colors = resolveColors(opts.colors || fx.colors || COLOR_VARS);
    var shape = fx.shape;
    var floaty = shape === "petal" || shape === "leaf" || shape === "spark";
    var k = Math.min(1.3, Math.max(0.75, h / 800)) * (opts.speed || 1);
    var count = opts.count || (w < 600 ? 70 : 130);
    var parts = [];
    function add(x, y, vx, vy) {
      parts.push({
        x: x, y: y, vx: vx, vy: vy, size: (floaty ? 9 : 6) + Math.random() * 6,
        color: colors[parts.length % colors.length],
        rot: Math.random() * 6.3, vr: (Math.random() - 0.5) * 10, flip: Math.random() * 6.3,
        wobble: floaty ? 60 + Math.random() * 90 : 0, wf: 2 + Math.random() * 3,
        fall: floaty ? 0.3 : 1, drag: floaty ? 2.6 : 1.4,
        t: 0, life: opts.rain ? 6 : 2.4 + Math.random() * (floaty ? 2 : 1)
      });
    }
    if (opts.rain) {
      for (var r = 0; r < count; r++) add(Math.random() * w, -20 - Math.random() * h * 0.6, (Math.random() - 0.5) * 60, 40 + Math.random() * 120);
    } else {
      var per = Math.round(count / origins.length);
      origins.forEach(function (o) {
        for (var i = 0; i < per; i++) {
          var ang = o.angle + (Math.random() - 0.5) * o.spread;
          var speed = (520 + Math.random() * 900) * k;
          add(o.x, o.y, Math.cos(ang) * speed, Math.sin(ang) * speed);
        }
      });
    }

    var last = performance.now();
    function frame(now) {
      var dt = Math.min(0.033, (now - last) / 1000);
      last = now;
      ctx.clearRect(0, 0, w, h);
      var alive = 0;
      parts.forEach(function (p) {
        p.t += dt;
        if (p.t > p.life || p.y > h + 40) return;
        alive++;
        var drag = Math.exp(-dt * p.drag);
        p.vx *= drag;
        p.vy = p.vy * drag + 900 * p.fall * dt;
        p.x += p.vx * dt + Math.sin(p.t * p.wf) * p.wobble * dt;
        p.y += p.vy * dt;
        p.rot += p.vr * dt;
        p.flip += dt * 7;
        ctx.save();
        ctx.globalAlpha = Math.min(1, (p.life - p.t) * 1.5);
        ctx.fillStyle = p.color;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        drawShape(ctx, shape, p.size, p.flip, p.t);
        ctx.restore();
      });
      if (alive) requestAnimationFrame(frame);
      else canvas.remove();
    }
    requestAnimationFrame(frame);
  }

  var FOUNTAIN = function () { return [{ x: innerWidth / 2, y: innerHeight * 0.6, angle: -Math.PI / 2, spread: Math.PI * 0.85 }]; };
  var CANNONS = function () {
    return [
      { x: 0, y: innerHeight, angle: -Math.PI / 3, spread: 0.7 },
      { x: innerWidth, y: innerHeight, angle: -Math.PI * 2 / 3, spread: 0.7 }
    ];
  };
  function play(kind, opts) {
    if (kind === "rain") burst(null, Object.assign({ rain: true }, opts));
    else burst(kind === "cannons" ? CANNONS() : FOUNTAIN(), opts);
  }

  var finaleDone = false;
  function finale() {
    if (finaleDone) return;
    finaleDone = true;
    play(fx.finale, fx.finaleOpts);
    buzz(20);
  }

  /* ================= Shared scenes ================= */
  function riseLines(el, scrollTrigger) {
    if (el._split) el._split.revert();
    // Khmer has no spaces between words, so SplitText can't find line breaks
    if (root.lang === "km") return;
    var split = el._split = SplitText.create(el, { type: "lines", mask: "lines" });
    gsap.from(split.lines, {
      yPercent: 110, duration: 1.2, ease: "expo.out", stagger: 0.1, delay: 0.25,
      scrollTrigger: scrollTrigger,
      // fixed line breaks would overflow if the window is resized later
      onComplete: function () { split.revert(); el._split = null; }
    });
  }

  function dealUnits(countdown, scrollTrigger) {
    gsap.fromTo(countdown.querySelectorAll(".unit"),
      { y: 40, rotateX: -80, transformPerspective: 600, autoAlpha: 0 },
      { y: 0, rotateX: 0, autoAlpha: 1, duration: 1, ease: "back.out(1.7)", stagger: 0.1, delay: 0.2,
        overwrite: true, scrollTrigger: scrollTrigger });
  }

  function heroPushBack() {
    var hero = document.querySelector(".hero");
    if (!hero) return;
    gsap.fromTo(hero, { "--out": 0 }, { "--out": 1, ease: "none",
      scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: true } });
  }

  function timelineSpark() {
    document.querySelectorAll(".timeline").forEach(function (tl) {
      var spark = document.createElement("i");
      spark.className = "tl-spark";
      spark.setAttribute("aria-hidden", "true");
      tl.appendChild(spark);
      gsap.fromTo(spark, { y: 0 }, { y: function () { return tl.offsetHeight; }, ease: "none",
        scrollTrigger: { trigger: tl, start: "top 65%", end: "bottom 65%", scrub: 0.6, invalidateOnRefresh: true,
          onUpdate: function (self) {
            // comet tail: stretch with scroll speed, then settle back
            gsap.to(spark, { scaleY: 1 + Math.min(Math.abs(self.getVelocity()) / 500, 5), duration: 0.15, overwrite: "auto",
              onComplete: function () { gsap.to(spark, { scaleY: 1, duration: 0.6, ease: "power2.out" }); } });
          } } });
    });
  }

  /* ================= Emerald: stationery, stacked cards ================= */
  function stackCards() {
    root.classList.add("fx-stack");
    var secs = gsap.utils.toArray(".content .sec");
    secs.forEach(function (sec, i) {
      var next = secs[i + 1];
      if (!next) return;
      // tall sections pin once their bottom is on screen, so nothing is hidden under the next card
      gsap.fromTo(sec, { "--stack": 0 }, { "--stack": 1, ease: "none", scrollTrigger: {
        trigger: sec, start: function () { return sec.offsetHeight > innerHeight ? "bottom bottom" : "top top"; },
        endTrigger: next, end: "top top", pin: true, pinSpacing: false, scrub: true, invalidateOnRefresh: true } });
    });
  }

  function dealGallery() {
    root.classList.add("fx-deal");
    document.querySelectorAll(".gallery").forEach(function (gal) {
      var figs = gal.querySelectorAll("figure");
      // the pile sits over the first row, so it is on screen as soon as the gallery is
      function pileX(i, f) { return gal.offsetWidth / 2 - (f.offsetLeft + f.offsetWidth / 2); }
      function pileY(i, f) { return figs[0].offsetHeight / 2 - (f.offsetTop + f.offsetHeight / 2); }
      gsap.fromTo(figs,
        { "--dx": pileX, "--dy": pileY, "--rot": function (i) { return (i % 2 ? 1 : -1) * (5 + i * 4); }, "--sc": 0.7 },
        { "--dx": 0, "--dy": 0, "--rot": 0, "--sc": 1, ease: "power2.out", stagger: 0.06,
          scrollTrigger: { trigger: gal, start: "top 85%", end: "center 55%", scrub: 0.8, invalidateOnRefresh: true } });
    });
  }

  /* ================= Palace: grand and cinematic ================= */
  function heroFlyThrough() {
    var hero = document.querySelector(".hero");
    if (!hero) return;
    gsap.timeline({ scrollTrigger: { trigger: hero, start: "top top", end: "+=110%", pin: true, scrub: 0.6 } })
      .fromTo(hero, { "--zoom": 0 }, { "--zoom": 1, ease: "power2.in", duration: 1 }, 0)
      .fromTo(hero, { "--fade": 0 }, { "--fade": 1, ease: "power1.in", duration: 0.75 }, 0.25);
  }

  function galleryHall() {
    var sec = document.querySelector(".s-gallery");
    var gal = sec && sec.querySelector(".gallery");
    if (!gal) return;
    root.classList.add("fx-hall");
    var figs = gsap.utils.toArray(gal.querySelectorAll("figure"));
    gsap.set(figs, { "--hs": 0.8 });
    function dist() { return gal.scrollWidth - innerWidth; }
    var hall = gsap.to(gal, { x: function () { return -dist(); }, ease: "none",
      scrollTrigger: { trigger: sec, start: "top top", end: function () { return "+=" + dist(); },
        pin: true, scrub: 0.5, invalidateOnRefresh: true } });
    figs.forEach(function (f) {
      ScrollTrigger.create({ trigger: f, containerAnimation: hall, start: "left right", end: "right left",
        onUpdate: function (s) { f.style.setProperty("--hs", (0.8 + 0.26 * Math.sin(s.progress * Math.PI)).toFixed(3)); } });
    });
  }

  /* ================= Velvet: theatre ================= */
  function actStamps() {
    root.classList.add("fx-acts");
    var beam = document.createElement("div");
    beam.className = "beam";
    beam.setAttribute("aria-hidden", "true");
    body.appendChild(beam);
    gsap.utils.toArray(".content .sec").forEach(function (sec) {
      var act = sec.querySelector(".act");
      function cue() {
        gsap.fromTo(beam, { opacity: 0 }, { opacity: 1, duration: 0.2, ease: "power2.out", yoyo: true, repeat: 1, repeatDelay: 0.3, overwrite: true });
        if (act) gsap.fromTo(act, { "--stamp": 2.8, "--ab": 10 }, { "--stamp": 1, "--ab": 0, duration: 1.1, ease: "expo.out", overwrite: "auto" });
      }
      ScrollTrigger.create({ trigger: sec, start: "top 55%", end: "bottom 45%", onEnter: cue, onEnterBack: cue });
    });
  }

  function stageFlats() {
    root.classList.add("fx-flats");
    document.querySelectorAll(".gallery").forEach(function (gal) {
      function side(i) {
        var c = cols(gal), col = i % c, mid = (c - 1) / 2;
        return col < mid ? 1 : col > mid ? -1 : 0;
      }
      gsap.fromTo(gal.querySelectorAll("figure"),
        { "--ry": function (i) { return side(i) * 70; }, "--sc": function (i) { return side(i) ? 1 : 0.7; } },
        { "--ry": 0, "--sc": 1, ease: "power2.out", stagger: 0.08,
          scrollTrigger: { trigger: gal, start: "top 85%", end: "center 55%", scrub: 0.7, invalidateOnRefresh: true } });
    });
  }

  function marquee(countdown, scrollTrigger) {
    gsap.fromTo(countdown.querySelectorAll(".unit"), { opacity: 0 },
      { keyframes: { opacity: [0, 1, 0.15, 0.9, 0.3, 1], easeEach: "none" }, duration: 1.2, stagger: 0.22,
        scrollTrigger: scrollTrigger });
  }

  /* ================= Olive: organic, ink and wind ================= */
  function inkTitles() {
    root.classList.add("fx-ink");
    gsap.utils.toArray(".content .sec:not(.hero) .title").forEach(function (t) {
      gsap.fromTo(t, { "--ink": 0 }, { "--ink": 1, ease: "none",
        scrollTrigger: { trigger: t, start: "top 90%", end: "top 50%", scrub: 0.5 } });
    });
    var names = document.querySelector(".hero .names");
    if (names) gsap.fromTo(names, { "--ink": 0 }, { "--ink": 1, duration: 2.4, ease: "power2.inOut", delay: 0.3 });
  }

  function wind() {
    root.classList.add("fx-wind");
    gsap.set(body, { "--wind": 0 });
    ScrollTrigger.create({ start: 0, end: "max", onUpdate: function (self) {
      gsap.to(body, { "--wind": clamp(self.getVelocity() / 1800), duration: 0.4, ease: "power2.out", overwrite: "auto",
        onComplete: function () { gsap.to(body, { "--wind": 0, duration: 1.8, ease: "elastic.out(1, 0.3)" }); } });
    } });
  }

  /* ================= Amalfi: playful, jelly and lemons ================= */
  function jelly() {
    root.classList.add("fx-jelly");
    gsap.set(track, { "--jelly": 0 });
    var last = track.scrollLeft, lastT = performance.now();
    track.addEventListener("scroll", function () {
      var now = performance.now();
      var v = (track.scrollLeft - last) / Math.max(8, now - lastT);
      last = track.scrollLeft;
      lastT = now;
      gsap.to(track, { "--jelly": clamp(v / 4), duration: 0.25, overwrite: "auto",
        onComplete: function () { gsap.to(track, { "--jelly": 0, duration: 1.2, ease: "elastic.out(1, 0.3)" }); } });
    }, { passive: true });
  }

  function lemons() {
    document.querySelectorAll(".content .lemon").forEach(function (lemon) {
      gsap.set(lemon, { "--pop": 1 });
      lemon.addEventListener("pointerdown", function (e) {
        gsap.fromTo(lemon, { "--pop": 0.55 }, { "--pop": 1, duration: 1, ease: "elastic.out(1.3, 0.3)", overwrite: "auto" });
        burst([{ x: e.clientX, y: e.clientY, angle: -Math.PI / 2, spread: Math.PI * 1.6 }],
          { count: 18, speed: 0.45, colors: ["--lemon", "#ffffff", "--lemon", "--leaf"] });
        buzz(10);
      });
    });
  }

  /* ================= Theme map ================= */
  var FX = {
    emerald: { shape: "ribbon", open: "fountain", finale: "cannons", hero: null, scenes: [stackCards, timelineSpark, dealGallery] },
    palace: { shape: "spark", open: "fountain", finale: "rain", hero: heroFlyThrough, scenes: [timelineSpark, galleryHall] },
    velvet: { shape: "petal", open: "rain", finale: "rain", finaleOpts: { count: innerWidth < 600 ? 110 : 200 },
      hero: heroPushBack, scenes: [actStamps, timelineSpark, stageFlats], countdown: marquee },
    olive: { shape: "leaf", open: "fountain", finale: "rain", hero: heroPushBack, scenes: [inkTitles, wind] },
    amalfi: { shape: "dot", open: "fountain", finale: "cannons", finaleOpts: { colors: ["--lemon", "#ffffff", "--lemon", "--leaf"] },
      album: [jelly, lemons] }
  };
  var fx = FX[theme] || FX.emerald;

  /* ================= Vertical pages ================= */
  function scrollScenes() {
    root.classList.add("scrolly");
    var snap = getComputedStyle(root).scrollSnapType !== "none";

    // Lenis and CSS scroll-snap (velvet's acts) fight over the scroll position.
    if (window.Lenis && !snap) {
      var lenis = new Lenis({ lerp: 0.085 });
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
      gsap.ticker.lagSmoothing(0);
    }

    // pinned scenes must be created top to bottom so later triggers account for their spacers
    if (fx.hero) fx.hero();
    fx.scenes.forEach(function (scene) { scene(); });

    var bar = document.createElement("div");
    bar.className = "scroll-bar";
    bar.setAttribute("aria-hidden", "true");
    body.appendChild(bar);
    gsap.to(bar, { scaleX: 1, ease: "none", scrollTrigger: { start: 0, end: "max", scrub: 0.3 } });

    gsap.utils.toArray(".venue-card, .gift-card").forEach(function (card) {
      gsap.fromTo(card, { "--lift": 0 }, { "--lift": 1, ease: "none",
        scrollTrigger: { trigger: card, start: "top bottom", end: "top 55%", scrub: true } });
    });

    document.querySelectorAll(".countdown").forEach(function (cd) {
      (fx.countdown || dealUnits)(cd, { trigger: cd, start: "top 88%", once: true });
    });

    document.querySelectorAll(".sub").forEach(function (el) {
      riseLines(el, { trigger: el, start: "top 88%", once: true });
    });

    var closing = document.querySelector(".closing");
    if (closing) ScrollTrigger.create({ trigger: closing, start: "top 65%", once: true, onEnter: finale });

    // palace scales .content in for 1.6s after opening, which skews the first measurements
    setTimeout(function () { ScrollTrigger.refresh(); }, 1800);
  }

  /* ================= Album pages (amalfi) ================= */
  function pageEnter(panel) {
    panel.querySelectorAll(".sub").forEach(function (el) { riseLines(el); });
    panel.querySelectorAll(".countdown").forEach(function (cd) { dealUnits(cd); });
    if (panel.classList.contains("closing")) finale();
  }

  /* ================= Hero depth: phone tilt or mouse ================= */
  function tilt() {
    var hero = document.querySelector(".hero");
    if (!hero) return;
    root.classList.add("tilt");
    gsap.set(hero, { "--tx": 0, "--ty": 0 });
    function move(x, y) {
      gsap.to(hero, { "--tx": x, "--ty": y, duration: 0.9, ease: "power3.out", overwrite: "auto" });
    }
    if (finePointer) {
      window.addEventListener("pointermove", function (e) {
        move(e.clientX / innerWidth * 2 - 1, e.clientY / innerHeight * 2 - 1);
      }, { passive: true });
    } else if (window.DeviceOrientationEvent && typeof DeviceOrientationEvent.requestPermission !== "function") {
      // iOS hides tilt behind a permission prompt, which we skip rather than interrupt the opening
      var base = null;
      window.addEventListener("deviceorientation", function (e) {
        if (e.gamma == null) return;
        if (base === null) base = e.beta;
        move(clamp(e.gamma / 25), clamp((e.beta - base) / 25));
      });
    }
  }

  /* ================= Buttons: magnetic on mouse, squish on press ================= */
  function buttons() {
    document.querySelectorAll(".btn").forEach(function (btn) {
      gsap.set(btn, { "--bx": 0, "--by": 0, "--bs": 1 });
      btn.addEventListener("pointerdown", function () {
        gsap.to(btn, { "--bs": 0.9, duration: 0.12, ease: "power2.out", overwrite: "auto" });
      });
      ["pointerup", "pointercancel", "pointerleave"].forEach(function (type) {
        btn.addEventListener(type, function () {
          gsap.to(btn, { "--bs": 1, duration: 0.8, ease: "elastic.out(1.1, 0.35)", overwrite: "auto" });
        });
      });
      if (!finePointer) return;
      btn.addEventListener("pointermove", function (e) {
        var r = btn.getBoundingClientRect();
        gsap.to(btn, {
          "--bx": (e.clientX - r.left - r.width / 2) * 0.35,
          "--by": (e.clientY - r.top - r.height / 2) * 0.5,
          duration: 0.4, ease: "power3.out", overwrite: "auto"
        });
      });
      btn.addEventListener("pointerleave", function () {
        gsap.to(btn, { "--bx": 0, "--by": 0, duration: 0.9, ease: "elastic.out(1, 0.35)", overwrite: "auto" });
      });
    });
  }

  function start() {
    play(fx.open);
    buzz([14, 60, 24]);
    if (track) (fx.album || []).forEach(function (scene) { scene(); });
    else document.fonts.ready.then(scrollScenes);
    tilt();
    buttons();
  }

  if (track) track.addEventListener("invite:page", function (e) { pageEnter(e.target); });
  if (body.classList.contains("opened")) start();
  else document.addEventListener("invite:open", start, { once: true });
})();
