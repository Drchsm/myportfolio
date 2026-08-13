(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------- mobile nav ---------------- */
  var toggle = document.getElementById("navToggle");
  var header = document.querySelector(".site-header");
  if (toggle && header) {
    toggle.addEventListener("click", function () {
      var open = header.classList.toggle("nav-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    document.querySelectorAll(".site-nav-mobile a").forEach(function (link) {
      link.addEventListener("click", function () {
        header.classList.remove("nav-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------------- scroll reveal ---------------- */
  var revealTargets = document.querySelectorAll(
    ".problem-card, .step, .tl-item, .impact-card, .arch-diagram, .run-card, .compare-col, .tech-item, .flow-note"
  );
  revealTargets.forEach(function (el) { el.classList.add("reveal"); });

  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealTargets.forEach(function (el) { el.classList.add("is-visible"); });
  } else {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    revealTargets.forEach(function (el) { io.observe(el); });
  }

  /* ---------------- hero terminal typing sequence ---------------- */
  var termBody = document.getElementById("termLines");
  if (termBody) {
    var lines = Array.prototype.slice.call(termBody.querySelectorAll("li"));
    if (reduceMotion) {
      termBody.classList.add("no-anim");
    } else {
      lines.forEach(function (line, i) {
        setTimeout(function () {
          line.classList.add("is-visible");
        }, 220 + i * 420);
      });
    }
  }
})();
