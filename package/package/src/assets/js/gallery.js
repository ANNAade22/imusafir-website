const Gallery = (function () {
  const PHOTOS_PER_BLOCK = 7;
  let manifest = null;
  let renderedCount = 0;

  function getManifest() {
    const el = document.getElementById("gallery-manifest");
    if (!el) return null;
    try {
      return JSON.parse(el.textContent);
    } catch {
      return null;
    }
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function photoThumb(photo) {
    return escapeHtml(photo.thumb);
  }

  function photoThumbFallback(photo) {
    return escapeHtml(photo.thumbFallback || photo.src);
  }

  function photoFull(photo) {
    return escapeHtml(photo.webp || photo.src);
  }

  function photoTitle(photo) {
    return escapeHtml(photo.title || "iMusafir Gallery");
  }

  function renderPhotoCard(photo, size) {
    const thumb = photoThumb(photo);
    const thumbFallback = photoThumbFallback(photo);
    const full = photoFull(photo);
    const title = photoTitle(photo);

    const sizeClasses = {
      short:
        "relative block duration-500 w-[110%] xl:h-62.5 lg:h-52.5 h-40 object-cover object-bottom group-hover:opacity-20",
      tall:
        "relative block duration-500 w-[110%] xl:h-130 lg:h-110 h-85 object-cover object-bottom group-hover:opacity-20",
      wide:
        "relative block duration-500 w-[110%] xl:h-62.5 lg:h-52.5 h-40 object-cover object-bottom group-hover:opacity-20",
      featured: "max-w-full max-h-full object-contain object-bottom",
    };

    const imgClass = sizeClasses[size] || sizeClasses.short;
    const width = size === "tall" || size === "featured" ? 416 : 416;
    const height =
      size === "tall" || size === "featured" ? 520 : size === "wide" ? 250 : 250;

    if (size === "featured") {
      return `
        <div class="mb-5 xl:h-130 lg:h-110 h-85 overflow-hidden bg-linear-(--bg4-gradient) lg:rounded-3xl rounded-xxl text-center flex items-end justify-center">
          <div class="relative w-full h-full flex items-end justify-center">
            <picture>
              <source srcset="${thumb}" type="image/webp">
              <img src="${thumbFallback}" alt="${title}" class="${imgClass}" width="${width}" height="${height}" loading="lazy">
            </picture>
          </div>
        </div>`;
    }

    return `
      <div class="relative mb-5 overflow-hidden lg:rounded-3xl rounded-xxl group">
        <div class="relative bg-black text-center overflow-hidden">
          <picture>
            <source srcset="${thumb}" type="image/webp">
            <img src="${thumbFallback}" alt="${title}" class="${imgClass}" width="${width}" height="${height}" loading="lazy">
          </picture>
          <a class="elem size-10 leading-10 text-center block bg-white rounded-md text-heading text-22 absolute left-1/2 top-1/2 opacity-0 duration-500 group-hover:opacity-100 group-hover:-translate-1/2 -translate-x-1/2 -translate-y-1/2" href="${full}" title="${title}" data-lcl-txt="" data-lcl-author="" data-lcl-thumb="${thumb}"><i class="fa-solid fa-expand"></i></a>
        </div>
      </div>`;
  }

  function renderMasonryBlock(photos, startIndex) {
    const p = (offset) => photos[startIndex + offset];
    if (!p(0)) return "";

    return `
      <div class="row mb-10 gallery-masonry-block">
        <div class="md:w-1/3 w-1/2">
          ${p(0) ? renderPhotoCard(p(0), "short") : ""}
          ${p(1) ? renderPhotoCard(p(1), "short") : ""}
        </div>
        <div class="md:w-1/3 w-1/2">
          ${p(2) ? renderPhotoCard(p(2), "tall") : ""}
        </div>
        <div class="md:w-1/3 w-full">
          ${p(3) ? renderPhotoCard(p(3), "featured") : p(2) ? renderPhotoCard(p(2), "featured") : ""}
        </div>
        <div class="lg:w-2/3 md:w-1/2 w-full">
          ${p(4) ? renderPhotoCard(p(4), "wide") : ""}
        </div>
        <div class="lg:w-1/3 md:w-1/2 w-full">
          <div class="row">
            <div class="w-1/2">
              ${p(5) ? renderPhotoCard(p(5), "short") : ""}
            </div>
            <div class="w-1/2">
              ${p(6) ? renderPhotoCard(p(6), "short") : ""}
            </div>
          </div>
        </div>
      </div>`;
  }

  function renderPhotos() {
    const container = document.getElementById("gallery-photos-grid");
    const loadMoreBtn = document.getElementById("gallery-load-more");
    if (!container || !manifest?.photos?.length) return;

    const end = Math.min(renderedCount + PHOTOS_PER_BLOCK, manifest.photos.length);
    if (renderedCount >= end) return;

    container.insertAdjacentHTML(
      "beforeend",
      renderMasonryBlock(manifest.photos, renderedCount)
    );
    renderedCount = end;

    if (loadMoreBtn) {
      const hasMore = renderedCount < manifest.photos.length;
      loadMoreBtn.classList.toggle("hidden", !hasMore);
      if (hasMore) {
        loadMoreBtn.textContent = `Load more (${manifest.photos.length - renderedCount} photos)`;
      }
    }
  }

  function renderVideoItem(video) {
    const poster = escapeHtml(video.posterFallback || video.poster);
    const posterWebp = escapeHtml(video.poster);
    const src = escapeHtml(video.src);
    const title = escapeHtml(video.title || "iMusafir Video");

    return `
      <div class="md:px-3 px-2 item">
        <div class="relative md:mb-7.5 mb-5 overflow-hidden rounded-3xl group cursor-pointer">
          <div class="relative">
            <picture>
              <source srcset="${posterWebp}" type="image/webp">
              <img src="${poster}" alt="${title}" class="block xl:h-62.5 lg:h-47.5 md:h-40 h-25 object-cover object-bottom w-full lg:min-w-104 md:min-w-79 min-w-66.5" width="416" height="250" loading="lazy">
            </picture>
            <button type="button" class="elem-video absolute inset-0 flex items-center justify-center bg-black/25 border-0 p-0" data-src="${src}" data-poster="${posterWebp}" aria-label="Play ${title}">
              <span class="size-12 leading-12 text-center block bg-white/95 rounded-full text-heading text-xl shadow-lg pointer-events-none"><i class="fa-solid fa-play ml-0.5"></i></span>
            </button>
          </div>
        </div>
      </div>`;
  }

  function renderVideos() {
    if (!manifest?.videos?.length) return;

    const mid = Math.ceil(manifest.videos.length / 2);
    const row1 = manifest.videos.slice(0, mid);
    const row2 = manifest.videos.slice(mid);

    const slider1 = document.querySelector("#tagSlider .item-wrap");
    const slider2 = document.querySelector("#tagSlider2 .item-wrap");

    if (slider1) slider1.innerHTML = row1.map(renderVideoItem).join("");
    if (slider2) slider2.innerHTML = row2.map(renderVideoItem).join("");
  }

  function openVideoModal(src, poster) {
    let modal = document.getElementById("gallery-video-modal");
    if (!modal) {
      modal = document.createElement("div");
      modal.id = "gallery-video-modal";
      modal.className =
        "fixed inset-0 z-[999999] flex items-center justify-center bg-black/90 p-4 opacity-0 pointer-events-none transition-opacity duration-300";
      modal.innerHTML = `
        <button type="button" class="absolute right-4 top-4 z-10 size-10 flex items-center justify-center text-white bg-white/10 rounded-full hover:bg-white/20" aria-label="Close video">
          <i class="fa-solid fa-xmark"></i>
        </button>
        <video class="max-w-full max-h-[85vh] rounded-lg" controls playsinline preload="none"></video>`;
      document.body.appendChild(modal);

      modal.querySelector("button").addEventListener("click", closeVideoModal);
      modal.addEventListener("click", (e) => {
        if (e.target === modal) closeVideoModal();
      });
      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") closeVideoModal();
      });
    }

    const video = modal.querySelector("video");
    video.pause();
    video.removeAttribute("src");
    video.load();
    if (poster) video.poster = poster;
    video.src = src;

    modal.classList.remove("opacity-0", "pointer-events-none");
    video.play().catch(() => {});
  }

  function closeVideoModal() {
    const modal = document.getElementById("gallery-video-modal");
    if (!modal) return;
    const video = modal.querySelector("video");
    video.pause();
    video.removeAttribute("src");
    video.load();
    modal.classList.add("opacity-0", "pointer-events-none");
  }

  function initVideoHandlers() {
    if (initVideoHandlers.bound) return;
    initVideoHandlers.bound = true;
    document.addEventListener("click", (e) => {
      const btn = e.target.closest(".elem-video");
      if (!btn) return;
      e.preventDefault();
      openVideoModal(btn.dataset.src, btn.dataset.poster);
    });
  }

  function reinitLightbox() {
    if (typeof lc_lightbox === "function" && document.querySelector(".elem")) {
      lc_lightbox(".elem", {
        wrap_class: "lcl_fade_oc",
        gallery: true,
        thumb_attr: "data-lcl-thumb",
        skin: "minimal",
        radius: 0,
        padding: 0,
        border_w: 0,
      });
    }
  }

  function initLoadMore() {
    const btn = document.getElementById("gallery-load-more");
    if (!btn) return;
    btn.addEventListener("click", () => {
      renderPhotos();
      reinitLightbox();
    });
  }

  function init() {
    const root = document.getElementById("gallery-photos");
    if (!root) return;

    manifest = getManifest();
    if (!manifest) return;

    renderPhotos();
    renderVideos();
    initVideoHandlers();
    initLoadMore();
  }

  return { init };
})();
