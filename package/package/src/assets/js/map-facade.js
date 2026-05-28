document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".map-facade").forEach((facade) => {
    const src = facade.getAttribute("data-src");
    if (!src) return;

    const button = facade.querySelector("button");
    const loadMap = () => {
      if (facade.dataset.loaded === "true") return;
      facade.dataset.loaded = "true";
      const iframe = document.createElement("iframe");
      iframe.src = src;
      iframe.loading = "lazy";
      iframe.className = "max-md:h-90 w-full rounded-4xl";
      iframe.height = "600";
      iframe.title = "Google Maps";
      iframe.setAttribute("allowfullscreen", "");
      iframe.setAttribute("referrerpolicy", "no-referrer-when-downgrade");
      facade.replaceChildren(iframe);
    };

    if (button) {
      button.addEventListener("click", loadMap, { once: true });
    } else {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries.some((entry) => entry.isIntersecting)) {
            loadMap();
            observer.disconnect();
          }
        },
        { rootMargin: "200px" }
      );
      observer.observe(facade);
    }
  });
});
