(function () {
  "use strict";

  /* ---------- Preloader ---------- */
  window.addEventListener("load", function () {
    var preloader = document.getElementById("preloader");
    if (preloader) {
      setTimeout(function () {
        preloader.classList.add("loaded");
      }, 300);
    }
  });

  /* ---------- Floating Petals ---------- */
  var petalsContainer = document.querySelector(".petals");
  if (petalsContainer) {
    var PETAL_COUNT = 22;
    for (var i = 0; i < PETAL_COUNT; i++) {
      var petal = document.createElement("span");
      petal.className = "petal";
      var left = Math.random() * 100;
      var fallDuration = 9 + Math.random() * 8;
      var swayDuration = 3 + Math.random() * 3;
      var delay = Math.random() * 12;
      var scale = 0.6 + Math.random() * 0.9;
      petal.style.left = left + "vw";
      petal.style.animationDuration = fallDuration + "s, " + swayDuration + "s";
      petal.style.animationDelay = "-" + delay + "s, -" + delay + "s";
      petal.style.transform = "scale(" + scale + ")";
      petal.style.background =
        Math.random() > 0.5 ? "var(--blush-dark)" : "var(--gold-light)";
      petalsContainer.appendChild(petal);
    }
  }

  /* ---------- Navbar scroll state ---------- */
  var navbar = document.querySelector(".navbar");
  var navLinks = document.querySelectorAll(".nav-links a");
  var sections = document.querySelectorAll("section[id]");

  function onScroll() {
    if (window.scrollY > 40) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }

    var scrollPos = window.scrollY + window.innerHeight * 0.35;
    sections.forEach(function (section) {
      var top = section.offsetTop;
      var bottom = top + section.offsetHeight;
      var id = section.getAttribute("id");
      var link = document.querySelector('.nav-links a[href="#' + id + '"]');
      if (link) {
        if (scrollPos >= top && scrollPos < bottom) {
          navLinks.forEach(function (l) { l.classList.remove("active"); });
          link.classList.add("active");
        }
      }
    });
  }
  window.addEventListener("scroll", onScroll);
  onScroll();

  /* ---------- Mobile nav toggle ---------- */
  var navToggle = document.querySelector(".nav-toggle");
  var navLinksList = document.querySelector(".nav-links");
  if (navToggle && navLinksList) {
    navToggle.addEventListener("click", function () {
      navLinksList.classList.toggle("open");
    });
    navLinks.forEach(function (link) {
      link.addEventListener("click", function () {
        navLinksList.classList.remove("open");
      });
    });
  }

  /* ---------- Scroll reveal ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  revealEls.forEach(function (el) { observer.observe(el); });

  /* ---------- Countdown ---------- */
  // EDIT ME: set your real wedding date/time here (local time).
  var WEDDING_DATE = new Date("2026-12-18T07:00:00");

  var countdownEls = {
    days: document.querySelector('[data-countdown="days"]'),
    hours: document.querySelector('[data-countdown="hours"]'),
    minutes: document.querySelector('[data-countdown="minutes"]'),
    seconds: document.querySelector('[data-countdown="seconds"]')
  };

  function updateCountdown() {
    var now = new Date();
    var diff = WEDDING_DATE - now;
    if (diff < 0) diff = 0;

    var days = Math.floor(diff / (1000 * 60 * 60 * 24));
    var hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    var minutes = Math.floor((diff / (1000 * 60)) % 60);
    var seconds = Math.floor((diff / 1000) % 60);

    if (countdownEls.days) countdownEls.days.textContent = String(days);
    if (countdownEls.hours) countdownEls.hours.textContent = String(hours).padStart(2, "0");
    if (countdownEls.minutes) countdownEls.minutes.textContent = String(minutes).padStart(2, "0");
    if (countdownEls.seconds) countdownEls.seconds.textContent = String(seconds).padStart(2, "0");
  }
  updateCountdown();
  setInterval(updateCountdown, 1000);

  /* ---------- Gallery background auto-slideshow ---------- */
  var galleryBg = document.querySelector(".gallery-bg");
  if (galleryBg) {
    var bgSlides = Array.prototype.slice.call(galleryBg.querySelectorAll(".gallery-bg-slide"));
    if (bgSlides.length > 1) {
      var bgIndex = 0;
      setInterval(function () {
        bgSlides[bgIndex].classList.remove("active");
        bgIndex = (bgIndex + 1) % bgSlides.length;
        bgSlides[bgIndex].classList.add("active");
      }, 5000);
    }
  }

  /* ---------- Gallery Lightbox ---------- */
  var galleryItems = Array.prototype.slice.call(document.querySelectorAll(".polaroid img"));
  var lightbox = document.querySelector(".lightbox");
  var lightboxImg = document.querySelector(".lightbox img");
  var lightboxClose = document.querySelector(".lightbox-close");
  var lightboxPrev = document.querySelector(".lightbox-prev");
  var lightboxNext = document.querySelector(".lightbox-next");
  var currentIndex = 0;

  function openLightbox(index) {
    currentIndex = index;
    lightboxImg.src = galleryItems[index].src;
    lightboxImg.alt = galleryItems[index].alt;
    lightbox.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    lightbox.classList.remove("active");
    document.body.style.overflow = "";
  }

  function showRelative(step) {
    currentIndex = (currentIndex + step + galleryItems.length) % galleryItems.length;
    lightboxImg.src = galleryItems[currentIndex].src;
    lightboxImg.alt = galleryItems[currentIndex].alt;
  }

  if (lightbox) {
    galleryItems.forEach(function (img, idx) {
      img.addEventListener("click", function () { openLightbox(idx); });
    });
    lightboxClose.addEventListener("click", closeLightbox);
    lightboxPrev.addEventListener("click", function () { showRelative(-1); });
    lightboxNext.addEventListener("click", function () { showRelative(1); });
    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener("keydown", function (e) {
      if (!lightbox.classList.contains("active")) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") showRelative(-1);
      if (e.key === "ArrowRight") showRelative(1);
    });
  }

  /* ---------- Video play/pause ---------- */
  var videoEl = document.querySelector(".video-frame video");
  var videoPlayBtn = document.querySelector(".video-play");
  if (videoEl && videoPlayBtn) {
    videoPlayBtn.addEventListener("click", function () {
      videoEl.play();
      videoPlayBtn.classList.add("hidden");
    });
    videoEl.addEventListener("pause", function () {
      videoPlayBtn.classList.remove("hidden");
    });
    videoEl.addEventListener("ended", function () {
      videoPlayBtn.classList.remove("hidden");
    });
  }
})();
