/**
 * Vanilla port of JellyExploreButton — gooey SVG filter + cursor blob.
 * Enhances all .site-button elements; preserves text, href, and click behavior.
 */
(function () {
  const SPRING = { stiffness: 200, damping: 20 };
  const FILTER_ID = "jelly-gooey-filter";
  const SELECTOR = ".site-button";
  const LABEL_DARK = "#1C1915";

  let uid = 0;

  function ensureFilter() {
    if (document.getElementById(FILTER_ID)) return;
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("aria-hidden", "true");
    svg.classList.add("jelly-filter-svg");
    svg.innerHTML =
      '<defs><filter id="' +
      FILTER_ID +
      '">' +
      '<feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />' +
      '<feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -9" result="goo" />' +
      '<feComposite in="SourceGraphic" in2="goo" operator="atop" />' +
      "</filter></defs>";
    document.body.prepend(svg);
  }

  function resolveColor(el) {
    if (el.classList.contains("btn-white")) return "#FFFFFF";
    const css = getComputedStyle(document.documentElement);
    return (css.getPropertyValue("--primary") || "#C5A059").trim();
  }

  function createSpring(stiffness, damping) {
    let value = 0;
    let velocity = 0;
    let target = 0;
    const mass = 1;

    return {
      set(t) {
        target = t;
      },
      get() {
        return value;
      },
      step(dt) {
        const steps = Math.max(1, Math.ceil(dt / 0.008));
        const h = dt / steps;
        for (let i = 0; i < steps; i++) {
          const force = -stiffness * (value - target) - damping * velocity;
          const accel = force / mass;
          velocity += accel * h;
          value += velocity * h;
        }
        if (Math.abs(velocity) < 0.05 && Math.abs(value - target) < 0.05) {
          value = target;
          velocity = 0;
        }
        return value;
      },
    };
  }

  function enhance(el) {
    if (el.dataset.jelly === "1") return;
    el.dataset.jelly = "1";
    el.classList.add("jelly-explore");

    const color = resolveColor(el);
    const content = el.innerHTML;
    const id = "jelly-" + ++uid;
    const isOutline = el.classList.contains("outline");

    el.style.setProperty("--jelly-color", color);
    // Always keep label dark for contrast on cream + gold fills.
    // Hover class toggles fill; never pin label color via inline vars that block CSS.
    el.style.setProperty("--jelly-label-color", LABEL_DARK);
    el.setAttribute("data-jelly-id", id);

    if (isOutline) {
      el.classList.add("jelly-explore--outline");
    }

    el.innerHTML =
      '<span class="jelly-shadow" aria-hidden="true"></span>' +
      '<span class="jelly-gooey" aria-hidden="true">' +
      '<span class="jelly-body"></span>' +
      '<span class="jelly-blob"></span>' +
      "</span>" +
      '<span class="jelly-body-overlay" aria-hidden="true"></span>' +
      '<span class="jelly-label">' +
      content +
      "</span>";

    const gooey = el.querySelector(".jelly-gooey");
    const body = el.querySelector(".jelly-body");
    const blob = el.querySelector(".jelly-blob");
    const overlay = el.querySelector(".jelly-body-overlay");
    const label = el.querySelector(".jelly-label");

    gooey.style.filter = "url(#" + FILTER_ID + ")";

    const mouseX = createSpring(SPRING.stiffness, SPRING.damping);
    const mouseY = createSpring(SPRING.stiffness, SPRING.damping);
    let isHovered = false;
    let isPressed = false;
    let raf = 0;
    let lastTime = 0;

    function isDisabled() {
      return el.disabled || el.getAttribute("aria-disabled") === "true" || el.classList.contains("disabled");
    }

    function syncSize() {
      const w = el.offsetWidth;
      const h = el.offsetHeight;
      body.style.width = w + "px";
      body.style.height = h + "px";
      overlay.style.width = w + "px";
      overlay.style.height = h + "px";
    }

    function setHovered(next) {
      isHovered = next;
      el.classList.toggle("is-jelly-hovered", next);
      // Force readable label on filled / outline states.
      label.style.color = LABEL_DARK;
    }

    function applyTransforms() {
      const bx = mouseX.get();
      const by = mouseY.get();
      const bodyX = Math.max(-2, Math.min(2, bx * 0.02));
      const bodyY = Math.max(-1, Math.min(1, by * 0.02));
      const scale = isPressed ? 0.94 : isHovered ? 1.02 : 1;
      const labelScale = isPressed ? 0.96 : 1;

      const bodyTransform =
        "translate(" + bodyX + "px, " + bodyY + "px) scale(" + scale + ")";
      body.style.transform = bodyTransform;
      overlay.style.transform = bodyTransform;
      label.style.transform =
        "translate(" +
        bx * 0.05 +
        "px, " +
        by * 0.05 +
        "px) scale(" +
        labelScale +
        ")";

      blob.style.transform =
        "translate(calc(-50% + " + bx + "px), calc(-50% + " + by + "px)) scale(" +
        (isHovered ? 1 : 0) +
        ")";
      blob.style.opacity = isHovered ? "1" : "0";
    }

    function tick(time) {
      if (!lastTime) lastTime = time;
      const dt = Math.min(0.032, (time - lastTime) / 1000);
      lastTime = time;
      mouseX.step(dt);
      mouseY.step(dt);
      applyTransforms();
      raf = requestAnimationFrame(tick);
    }

    function startLoop() {
      if (raf) return;
      lastTime = 0;
      raf = requestAnimationFrame(tick);
    }

    function stopLoop() {
      if (!raf) return;
      cancelAnimationFrame(raf);
      raf = 0;
      lastTime = 0;
    }

    el.addEventListener("mouseenter", () => {
      if (isDisabled()) return;
      setHovered(true);
      syncSize();
      startLoop();
      applyTransforms();
    });

    el.addEventListener("mousemove", (e) => {
      if (isDisabled()) return;
      const rect = el.getBoundingClientRect();
      mouseX.set(e.clientX - (rect.left + rect.width / 2));
      mouseY.set(e.clientY - (rect.top + rect.height / 2));
    });

    el.addEventListener("mouseleave", () => {
      setHovered(false);
      isPressed = false;
      mouseX.set(0);
      mouseY.set(0);
      applyTransforms();
      setTimeout(() => {
        if (!isHovered) stopLoop();
      }, 400);
    });

    el.addEventListener("mousedown", () => {
      if (isDisabled()) return;
      isPressed = true;
      applyTransforms();
    });

    el.addEventListener("mouseup", () => {
      isPressed = false;
      applyTransforms();
    });

    label.style.color = LABEL_DARK;
    syncSize();
    applyTransforms();
    requestAnimationFrame(() => {
      syncSize();
      applyTransforms();
    });

    if (typeof ResizeObserver !== "undefined") {
      new ResizeObserver(() => {
        syncSize();
        applyTransforms();
      }).observe(el);
    }
  }

  function init(root) {
    ensureFilter();
    (root || document).querySelectorAll(SELECTOR).forEach(enhance);
  }

  window.JellyExploreButton = { init: init, enhance: enhance };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => init());
  } else {
    init();
  }
})();
