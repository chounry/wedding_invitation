/* Colour palettes for the themed pages. Load in <head> with data-theme="<theme>" so
   the palette is applied before first paint. Each palette's colours live in the
   theme's CSS under :root[data-palette="<id>"]; the first entry here is the default.
   Choice order: ?palette=<id> in the URL, then the guest's last pick, then default. */
(function () {
  "use strict";

  var PALETTES = {
    emerald: [["emerald", "Emerald", "#0b382b", "#d8c7a5"], ["sapphire", "Sapphire", "#13294b", "#d9c9a3"], ["burgundy", "Burgundy", "#5a1a24", "#ecd0bb"], ["onyx", "Onyx", "#1c1c1e", "#d9c290"]],
    palace: [["ivory", "Ivory & Gold", "#f7f2e8", "#c8aa71"], ["rose", "Rose Gold", "#f8efec", "#c9958a"], ["silver", "Silver", "#f2f3f5", "#a7adb8"], ["sage", "Sage", "#f2f3ec", "#a3ab88"]],
    velvet: [["crimson", "Crimson", "#7a1212", "#c9a882"], ["midnight", "Midnight", "#1b2c5a", "#c3c9d3"], ["forest", "Forest", "#0f4a35", "#c9a882"], ["plum", "Plum", "#5a1f4f", "#dcae9f"]],
    olive: [["olive", "Olive", "#7f8453", "#722f37"], ["eucalyptus", "Eucalyptus", "#5f7f78", "#4b5e7a"], ["terracotta", "Terracotta", "#b06a4a", "#5c6b47"], ["lavender", "Lavender", "#8a7fa6", "#8a5a6e"]],
    amalfi: [["amalfi", "Amalfi Blue", "#2455a4", "#f4d342"], ["capri", "Capri", "#127a86", "#f4d342"], ["positano", "Positano", "#d0675a", "#f4d342"], ["majolica", "Majolica", "#3f7d4e", "#f4d342"]]
  };

  var theme = document.currentScript && document.currentScript.getAttribute("data-theme");
  var list = PALETTES[theme];
  if (!list) return;

  var root = document.documentElement;
  var key = "palette:" + theme;
  function find(id) { return list.filter(function (p) { return p[0] === id; })[0]; }
  function load() { try { return localStorage.getItem(key); } catch (e) { return null; } }
  function save(id) { try { localStorage.setItem(key, id); } catch (e) {} }
  function apply(id) {
    if (id === list[0][0]) root.removeAttribute("data-palette");
    else root.setAttribute("data-palette", id);
  }

  var current = (find(new URLSearchParams(location.search).get("palette")) || find(load()) || list[0])[0];
  apply(current);

  function dot(p) {
    var d = document.createElement("span");
    d.className = "palette-dot";
    d.style.background = "linear-gradient(135deg, " + p[2] + " 50%, " + p[3] + " 50%)";
    return d;
  }

  document.addEventListener("DOMContentLoaded", function () {
    var wrap = document.createElement("div");
    wrap.className = "palette";
    var toggle = document.createElement("button");
    toggle.type = "button";
    toggle.className = "palette-toggle";
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-haspopup", "true");
    var menu = document.createElement("div");
    menu.className = "palette-menu";
    menu.setAttribute("role", "group");
    menu.setAttribute("aria-label", "Colour palette");

    function render() {
      toggle.textContent = "";
      toggle.appendChild(dot(find(current)));
      toggle.appendChild(document.createTextNode("Colour"));
      Array.prototype.forEach.call(menu.children, function (b) {
        b.setAttribute("aria-pressed", String(b.value === current));
      });
    }
    function setOpen(open) {
      wrap.classList.toggle("open", open);
      toggle.setAttribute("aria-expanded", String(open));
    }

    list.forEach(function (p) {
      var b = document.createElement("button");
      b.type = "button";
      b.value = p[0];
      b.appendChild(dot(p));
      b.appendChild(document.createTextNode(p[1]));
      b.addEventListener("click", function () {
        current = p[0];
        save(current);
        var url = new URL(location.href);
        if (current === list[0][0]) url.searchParams.delete("palette");
        else url.searchParams.set("palette", current);
        history.replaceState(null, "", url);
        var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (document.startViewTransition && !reduced) document.startViewTransition(function () { apply(current); });
        else apply(current);
        render();
        setOpen(false);
        toggle.focus();
      });
      menu.appendChild(b);
    });

    toggle.addEventListener("click", function () { setOpen(!wrap.classList.contains("open")); });
    document.addEventListener("click", function (e) { if (!wrap.contains(e.target)) setOpen(false); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && wrap.classList.contains("open")) { setOpen(false); toggle.focus(); }
    });

    render();
    wrap.appendChild(toggle);
    wrap.appendChild(menu);
    var tools = document.querySelector(".tools");
    if (!tools) {
      tools = document.createElement("div");
      tools.className = "tools";
      document.body.appendChild(tools);
    }
    tools.appendChild(wrap);
  });
})();
