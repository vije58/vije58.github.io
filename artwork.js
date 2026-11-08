(function () {
  "use strict";

  /* ---------- phone menu (same behaviour as the home page) ---------- */
  var toggle = document.querySelector(".menu-toggle");
  var menu = document.getElementById("site-menu");

  if (toggle && menu) {
    var setMenu = function (open) {
      menu.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    };

    toggle.addEventListener("click", function () {
      setMenu(!menu.classList.contains("is-open"));
    });

    menu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () { setMenu(false); });
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") setMenu(false);
    });

    document.addEventListener("click", function (e) {
      if (!e.target.closest(".site-header")) setMenu(false);
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > 820) setMenu(false);
    });
  }

  /* ---------- category tabs on the list page ---------- */
  var tabs = document.querySelectorAll(".tab");

  if (tabs.length) {
    var names = [];
    tabs.forEach(function (t) { names.push(t.dataset.tab); });

    var showTab = function (name) {
      if (names.indexOf(name) < 0) name = "painting";
      tabs.forEach(function (t) {
        var on = t.dataset.tab === name;
        t.classList.toggle("is-active", on);
        t.setAttribute("aria-selected", on ? "true" : "false");
      });
      document.querySelectorAll(".panel").forEach(function (p) {
        p.hidden = p.id !== "panel-" + name;
      });
    };

    showTab(location.hash.replace("#", ""));

    tabs.forEach(function (t) {
      t.addEventListener("click", function () {
        showTab(t.dataset.tab);
        if (window.history && history.replaceState) {
          history.replaceState(null, "", "#" + t.dataset.tab);
        }
      });
    });

    window.addEventListener("hashchange", function () {
      showTab(location.hash.replace("#", ""));
    });
  }

  /* ---------- enlarged picture viewer ---------- */
  var sources = Array.prototype.slice.call(document.querySelectorAll("[data-full]"));
  if (!sources.length) return;

  var current = 0;
  var lastFocus = null;

  var box = document.createElement("div");
  box.className = "lb";
  box.setAttribute("role", "dialog");
  box.setAttribute("aria-modal", "true");
  box.setAttribute("aria-label", "Enlarged picture");
  box.innerHTML =
    '<button type="button" class="lb-btn lb-close" aria-label="Close">&#10005;</button>' +
    '<button type="button" class="lb-btn lb-prev" aria-label="Previous picture">&#8592;</button>' +
    '<div class="lb-stage"></div>' +
    '<button type="button" class="lb-btn lb-next" aria-label="Next picture">&#8594;</button>' +
    '<div class="lb-count"></div>';
  document.body.appendChild(box);

  var stage = box.querySelector(".lb-stage");
  var count = box.querySelector(".lb-count");

  function render() {
    var el = sources[current];
    stage.innerHTML = "";

    if (el.dataset.kind === "video") {
      var v = document.createElement("video");
      v.src = el.dataset.full;
      v.poster = el.dataset.poster || "";
      v.controls = true;
      v.autoplay = true;
      v.playsInline = true;
      stage.appendChild(v);
    } else {
      var img = document.createElement("img");
      img.src = el.dataset.full;
      var thumb = el.querySelector("img");
      img.alt = thumb ? thumb.alt : "";
      stage.appendChild(img);
    }

    count.textContent = (current + 1) + " / " + sources.length;
    var many = sources.length > 1;
    box.querySelector(".lb-prev").style.display = many ? "" : "none";
    box.querySelector(".lb-next").style.display = many ? "" : "none";
  }

  function open(i) {
    current = i;
    lastFocus = document.activeElement;
    render();
    box.classList.add("is-open");
    document.body.style.overflow = "hidden";
    box.querySelector(".lb-close").focus();
  }

  function close() {
    box.classList.remove("is-open");
    stage.innerHTML = "";
    document.body.style.overflow = "";
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  function step(d) {
    current = (current + d + sources.length) % sources.length;
    render();
  }

  sources.forEach(function (el, i) {
    el.addEventListener("click", function () { open(i); });
  });

  box.querySelector(".lb-close").addEventListener("click", close);
  box.querySelector(".lb-prev").addEventListener("click", function () { step(-1); });
  box.querySelector(".lb-next").addEventListener("click", function () { step(1); });

  box.addEventListener("click", function (e) {
    if (e.target === box) close();
  });

  document.addEventListener("keydown", function (e) {
    if (!box.classList.contains("is-open")) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowLeft") step(-1);
    if (e.key === "ArrowRight") step(1);
  });
})();
