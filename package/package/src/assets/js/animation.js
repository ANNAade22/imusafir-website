const ClinicMasterGsap = function () {
  gsap.registerPlugin(ScrollTrigger);

  const headerWrapper = document.getElementById("headerWrapper1");
  if (headerWrapper) {
    const tl = gsap.timeline({ paused: true });
    tl.to("#headerWrapper1", {
      top: -98,
      duration: 0.3,
      ease: "power2.out",
    });

    ScrollTrigger.create({
      trigger: "#headerWrapper1",
      start: "bottom top",
      onEnter: () => tl.play(),
      onLeaveBack: () => tl.reverse(),
    });
  }

  const linkSmoothScroll = () => {
    const anchorLinks = Array.from(document.querySelectorAll('a[href^="#"]')).filter(
      (link) => link.getAttribute("href") !== "#"
    );

    const setActiveLink = (href) => {
      anchorLinks.forEach((link) => {
        link.classList.toggle("active", link.getAttribute("href") === href);
      });
    };

    const clickHandler = (e) => {
      const anchor = e.target.closest('a[href^="#"]');
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href || href === "#") return;

      const targetId = href.slice(1);
      const targetEl = document.getElementById(targetId);
      if (!targetEl) return;

      e.preventDefault();
      anchorLinks.forEach((link) => link.classList.remove("active"));
      anchor.classList.add("active");
      targetEl.scrollIntoView({ behavior: "smooth" });
    };

    document.addEventListener("click", clickHandler);

    anchorLinks.forEach((link) => {
      const href = link.getAttribute("href");
      const targetId = href.slice(1);
      const section = document.getElementById(targetId);
      if (!section) return;

      ScrollTrigger.create({
        trigger: section,
        start: "top center",
        end: "bottom center",
        onEnter: () => setActiveLink(href),
        onEnterBack: () => setActiveLink(href),
      });
    });

    return () => {
      document.removeEventListener("click", clickHandler);
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  };

  let cleanupSticky = null;
  const initStickyPosition = (selector = ".my-sticky", offset = 100) => {
    ScrollTrigger.matchMedia({
      "(min-width: 992px)": () => {
        const elements = document.querySelectorAll(selector);
        const triggers = [];
        elements.forEach((el) => {
          const parent = el.parentElement;
          if (!parent) return;

          const spacer = document.createElement("div");
          spacer.style.position = "relative";
          spacer.style.height = el.classList.contains("sidebar-sticky")
            ? 0
            : `${el.offsetHeight + offset}px`;
          parent.insertBefore(spacer, el);
          spacer.appendChild(el);

          Object.assign(el.style, {
            position: "absolute",
            top: el.classList.contains("space-top-0") ? 0 : `${offset}px`,
            left: 0,
            right: 0,
          });

          const trigger = ScrollTrigger.create({
            trigger: spacer,
            start: "top top",
            end: () => `+=${parent.offsetHeight - el.offsetHeight - offset}`,
            pin: el,
            pinSpacing: false,
            anticipatePin: 1,
          });

          triggers.push({ trigger, spacer, el });
        });

        return () => {
          triggers.forEach(({ trigger, spacer, el }) => {
            trigger.kill();
            const parent = spacer.parentElement;
            if (parent) {
              parent.insertBefore(el, spacer);
              parent.removeChild(spacer);
            }
            Object.assign(el.style, {
              position: "",
              top: "",
              left: "",
              right: "",
            });
          });
        };
      },
    });
  };

  const applySticky = () => {
    if (cleanupSticky) cleanupSticky();
    cleanupSticky = initStickyPosition();
  };

  document.querySelectorAll(".sticky-update-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      setTimeout(() => applySticky(), 200);
    });
  });

  const customScroll = () => {
    document.querySelectorAll(".custom-scroll").forEach((item) => {
      item.addEventListener(
        "wheel",
        function (e) {
          e.stopPropagation();
        },
        { passive: false }
      );

      let startY = 0;
      let startX = 0;

      item.addEventListener(
        "touchstart",
        (e) => {
          const touch = e.touches[0];
          startY = touch.clientY;
          startX = touch.clientX;
        },
        { passive: true }
      );

      item.addEventListener(
        "touchmove",
        (e) => {
          const touch = e.touches[0];
          const deltaY = startY - touch.clientY;
          const deltaX = startX - touch.clientX;
          item.scrollTop += deltaY;
          item.scrollLeft += deltaX;
          startY = touch.clientY;
          startX = touch.clientX;
          e.stopPropagation();
          e.preventDefault();
        },
        { passive: false }
      );
    });
  };

  return {
    init() {
      linkSmoothScroll();
      applySticky();
      customScroll();
    },
  };
};

const scheduleAnimationInit = (callback) => {
  if (typeof window.requestIdleCallback === "function") {
    window.requestIdleCallback(callback, { timeout: 2000 });
  } else {
    window.setTimeout(callback, 1);
  }
};

const bootAnimations = () => {
  if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
    ClinicMasterGsap().init();
  }
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => scheduleAnimationInit(bootAnimations));
} else {
  scheduleAnimationInit(bootAnimations);
}

let resizeTimeout;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    if (typeof ScrollTrigger !== "undefined") ScrollTrigger.refresh();
  }, 250);
});
