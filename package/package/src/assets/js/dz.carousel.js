const ImusafirCarousel = function () {
  const handleReviewSlider = function () {
    const reviewSliderEl = document.querySelector(".reviewtwo-slider");

    if (reviewSliderEl) {
      const swiper = new Swiper(".reviewtwo-slider", {
        slidesPerView: 3,
        spaceBetween: 20,
        loop: true,
        speed: 2000,
        freeMode: false,
        autoplay: {
          delay: 2000,
          pauseOnMouseEnter: true,
          disableOnInteraction: false,
        },
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        },
        breakpoints: {
          10: {
            slidesPerView: 1,
          },
          575: {
            slidesPerView: 1,
            spaceBetween: 20,
          },
          768: {
            slidesPerView: 2,
            spaceBetween: 20,
          },
          992: {
            slidesPerView: 3,
          },
          1200: {
            slidesPerView: 3,
          },
          1400: {
            slidesPerView: 4,
          },
        },
      });
    }
  };

  const handleBrandSwiper = function () {
    const brandSwiper = document.querySelector(".brand-swiper");

    if (brandSwiper) {
      const swiper = new Swiper(".brand-swiper", {
        speed: 1500,
        parallax: true,
        slidesPerView: 4,
        spaceBetween: 30,
        loop: true,
        autoplay: {
          delay: 3000,
        },
        breakpoints: {
          300: {
            slidesPerView: 1,
          },
          360: {
            slidesPerView: 2,
          },
          767: {
            slidesPerView: 3,
          },
          991: {
            slidesPerView: 4,
          },
          1200: {
            slidesPerView: 5,
          },
        },
      });
    }
  };

  const handlePlacesLogoSwiper = function () {
    const brandSwiper = document.querySelector(".popular-places-logo-swiper");

    if (brandSwiper) {
      const swiper = new Swiper(".popular-places-logo-swiper", {
        speed: 1500,
        parallax: true,
        slidesPerView: 4,
        spaceBetween: 30,
        loop: true,
        autoplay: {
          delay: 3000,
        },
        breakpoints: {
          360: {
            slidesPerView: 2,
          },
          767: {
            slidesPerView: 4,
          },
          991: {
            slidesPerView: 5,
          },
          1200: {
            slidesPerView: 6,
          },
        },
      });
    }
  };

  const handleTrvToursSt1 = function () {
    if (!document.querySelector(".trv-tours-st1")) {
      return;
    }

    var swiper = new Swiper(".trv-tours-st1", {
      slidesPerView: 1,
      spaceBetween: 0,
      loop: true,
      autoplay: {
        delay: 2500,
        disableOnInteraction: false,
      },
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
        dynamicBullets: true,
      },
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
      breakpoints: {
        0: {
          slidesPerView: 1,
        },
        480: {
          slidesPerView: 1,
        },
        575: {
          slidesPerView: 1,
        },
        768: {
          slidesPerView: 1,
        },
        991: {
          slidesPerView: 2,
        },
        1024: {
          slidesPerView: 2,
        },
        1200: {
          slidesPerView: 3,
        },
        1400: {
          slidesPerView: 3,
        },
        1600: {
          slidesPerView: 4,
        },
      },
    });
  };

  const handleTrvTestiSlider = function () {
    var swiper = new Swiper(".testimonial-thum-sld", {
      centeredSlides: true,
      centeredSlidesBounds: true,
      slidesPerView: 3,
      watchOverflow: true,
      watchSlidesVisibility: true,
      watchSlidesProgress: true,
      direction: "vertical",
      loop: true,
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
      autoplay: {
        delay: 2500,
        disableOnInteraction: false,
      },
      breakpoints: {
        0: {
          direction: "horizontal",
        },
        1200: {
          direction: "vertical",
        },
      },
    });
    var swiper2 = new Swiper(".testimonial-content-sld", {
      loop: true,
      watchOverflow: true,
      watchSlidesVisibility: true,
      watchSlidesProgress: true,
      preventInteractionOnTransition: true,
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
      effect: "fade",
      fadeEffect: {
        crossFade: true,
      },
      thumbs: {
        swiper: swiper,
      },
      autoplay: {
        delay: 2500,
        disableOnInteraction: false,
      },
    });
  };
  const handleTrvLatBlogSt2 = function () {
    var swiper = new Swiper(".trv-lat-blog-st2", {
      slidesPerView: 1,
      spaceBetween: 30,
      loop: true,
      autoplay: {
        delay: 2500,
        disableOnInteraction: false,
      },
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
        dynamicBullets: true,
      },
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
      breakpoints: {
        0: {
          slidesPerView: 1,
        },
        480: {
          slidesPerView: 1,
        },
        768: {
          slidesPerView: 2,
        },
        1024: {
          slidesPerView: 3,
        },
      },
    });
  };
  const handleTrvDSlider = function () {
    var swiper = new Swiper(".trv_d-slider", {
      freeMode: false,
      pagination: ".swiper-pagination",
      slidesPerView: 1,
      centeredSlides: false,
      paginationClickable: true,
      loop: true,
      spaceBetween: 10,
      slideToClickedSlide: true,

      pagination: {
        el: ".swiper-pagination",
        clickable: true,
        dynamicBullets: true,
      },

      autoplay: {
        delay: 2000,
        disableOnInteraction: false,
      },

      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
    });
  };

  const handleTourSwiper = () => {
    new Swiper(".trv-mf-tour-swiper", {
      slidesPerView: 1,
      spaceBetween: 30,
      loop: true,
      autoplay: {
        delay: 2500,
        disableOnInteraction: false,
      },
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
        dynamicBullets: true,
      },
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
      breakpoints: {
        0: {
          slidesPerView: 1,
        },
        480: {
          slidesPerView: 2,
        },
        991: {
          slidesPerView: 3,
        },
        1024: {
          slidesPerView: 4,
        },
		1200: {
          slidesPerView: 5,
        },
      },
    });
  };

  const handleTourCatSwiper = () => {
    const featureTitle = document.querySelector(".trv-feature h2");
    const featureDescription = document.querySelector(".trv-feature p");
    const featureUrl = document.querySelector(".trv-feature a");
    const carouselEl = document.querySelector(".trv-tr-cat-swiper");

    if (!carouselEl) return; // nothing to init

    const swiper = new Swiper(carouselEl, {
      slidesPerView: 2,
      spaceBetween: 30,
      autoplay: {
        delay: 4500,
        disableOnInteraction: false,
      },
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
      breakpoints: {
        0: {
          slidesPerView: 1,
        },
        540: {
          slidesPerView: 2,
        },
        1024: {
          slidesPerView: 2,
        },
      },
      on: {
        init() {
          const active = carouselEl.querySelector(
            ".trv-cat-sld.swiper-slide-active"
          );
          if (!active) return;
          if (featureTitle)
            featureTitle.textContent = active.getAttribute("data-title") || "";
          if (featureDescription)
            featureDescription.textContent =
              active.getAttribute("data-description") || "";
          if (featureUrl) featureUrl.classList.add("animate-url");
          if (featureTitle) featureTitle.classList.add("animate-title");
          if (featureDescription)
            featureDescription.classList.add("animate-description");
        },
        slideChangeTransitionStart() {
          if (featureTitle) featureTitle.classList.remove("animate-title");
          if (featureDescription)
            featureDescription.classList.remove("animate-description");
          if (featureUrl) featureUrl.classList.remove("animate-url");

          if (featureTitle) featureTitle.classList.add("animate-away");
          if (featureDescription)
            featureDescription.classList.add("animate-away");
          if (featureUrl) featureUrl.classList.add("animate-away");

          setTimeout(() => {
            if (featureTitle) featureTitle.classList.remove("animate-away");
            if (featureDescription)
              featureDescription.classList.remove("animate-away");
            if (featureUrl) featureUrl.classList.remove("animate-away");
          }, 500);
        },
        slideChangeTransitionEnd() {
          const active = carouselEl.querySelector(
            ".trv-cat-sld.swiper-slide-active"
          );
          if (!active) return;
          if (featureTitle)
            featureTitle.textContent = active.getAttribute("data-title") || "";
          if (featureDescription)
            featureDescription.textContent =
              active.getAttribute("data-description") || "";
          if (featureTitle) featureTitle.classList.add("animate-title");
          if (featureDescription)
            featureDescription.classList.add("animate-description");
          if (featureUrl) featureUrl.classList.add("animate-url");
        },
      },
    });

    // Optional: pause autoplay on hover for better UX
    carouselEl.addEventListener("mouseenter", () => swiper.autoplay.stop());
    carouselEl.addEventListener("mouseleave", () => swiper.autoplay.start());
  };

  const handleTestimonialSwiper = () => {
    if (typeof Swiper === "undefined") {
      console.warn("Swiper is not loaded.");
      return;
    }

    const carouselEl = document.querySelector(".trv-t-monial-swiper");
    if (!carouselEl) return; // nothing to init

    const swiper = new Swiper(carouselEl, {
      slidesPerView: 1,
      spaceBetween: 30,
      loop: true,
      autoplay: {
        delay: 2500,
        disableOnInteraction: false,
      },
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
        dynamicBullets: true,
      },
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
      breakpoints: {
        0: {
          slidesPerView: 1,
        },
        480: {
          slidesPerView: 1,
        },
        991: {
          slidesPerView: 2,
        },
        1024: {
          slidesPerView: 2,
        },
      },
    });

    // Optional UX: pause autoplay on hover/touch
    carouselEl.addEventListener("mouseenter", () => {
      if (swiper.autoplay && swiper.autoplay.running) swiper.autoplay.stop();
    });
    carouselEl.addEventListener("mouseleave", () => {
      if (swiper.autoplay && !swiper.autoplay.running) swiper.autoplay.start();
    });

    // On touch devices, pause while swiping
    carouselEl.addEventListener(
      "touchstart",
      () => {
        if (swiper.autoplay && swiper.autoplay.running) swiper.autoplay.stop();
      },
      { passive: true }
    );
    carouselEl.addEventListener(
      "touchend",
      () => {
        if (swiper.autoplay && !swiper.autoplay.running)
          swiper.autoplay.start();
      },
      { passive: true }
    );
  };

  const handleFilterSwiper = () => {
    if (jQuery(".pro-filtr-cate-bx").length) {
      const config = {
        pagination: ".swiper-pagination",
        slidesPerView: 1,
        slidesPerColumn: 1,
        paginationClickable: true,
        spaceBetween: 0,
        autoHeight: false,
        centerInsufficientSlides: true,
        centeredSlidesBounds: true,
        cssMode: false,
        mousewheel: false,
        keyboard: false,
        speed: 3000,
        parallax: true,
        freeMode: true,
        loop: true,
        grabCursor: true,
        autoplay: {
          delay: 1500,
          disableOnInteraction: false,
        },
        breakpoints: {
          0: {
            slidesPerView: 1,
            slidesPerGroup: 1,
            slidesPerColumn: 1,
            spaceBetween: 0,
          },
          768: {
            slidesPerView: 2,
            slidesPerGroup: 1,
            slidesPerColumn: 1,
            spaceBetween: 0,
          },
          991: {
            slidesPerView: 3,
            slidesPerGroup: 1,
            slidesPerColumn: 1,
            spaceBetween: 0,
          },
          1366: {
            slidesPerView: 3,
            slidesPerGroup: 1,
            slidesPerColumn: 1,
            spaceBetween: 0,
          },
        },
        // If we need pagination
        pagination: {
          el: ".swiper-pagination",
          type: "fraction",
        },
        // Navigation arrows
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        },

        // And if we need scrollbar
        scrollbar: {
          el: ".swiper-scrollbar",
        },
      };
      var swiper = new Swiper(".pro-filtr-cate-bx", config);
      const filters = document.querySelectorAll(
        ".pro-filtr-cate-carousal span"
      );
      function updateFilter(activeFilter) {
        const filters = document.querySelectorAll(
          ".pro-filtr-cate-carousal span"
        );
        if (!activeFilter) {
          filters[0].classList.add("active");
          activeFilter = filters[0];
        }
        const filter = activeFilter.innerText.toLowerCase();
        Array.prototype.forEach.call(filters, function (el) {
          if (el === activeFilter) {
            el.classList.add("active");
          } else {
            el.classList.remove("active");
          }
        });
      }
      Array.prototype.forEach.call(filters, function (_filter) {
        _filter.addEventListener("click", function (e) {
          const self = e.target;
          const filter = self.getAttribute("data-filter").toLowerCase();
          updateFilter(self);
          console.log("filter:", filter);
          if (filter == "all") {
            Array.prototype.forEach.call(
              document.querySelectorAll(".pro-filtr-cate-bx [data-filter]"),
              function (_item) {
                _item.classList.remove("non-swiper-slide");
                _item.classList.add("swiper-slide");
              }
            );
            swiper.destroy();
            swiper = new Swiper(".pro-filtr-cate-bx", config);
          } else {
            Array.prototype.forEach.call(
              document.querySelectorAll(
                ".pro-filtr-cate-bx [data-filter]:not([data-filter='" +
                  filter +
                  "'])"
              ),
              (el) => {
                el.classList.add("non-swiper-slide");
                el.classList.remove("swiper-slide");
                el.removeAttribute("style");
              }
            );
            Array.prototype.forEach.call(
              document.querySelectorAll(
                ".pro-filtr-cate-bx [data-filter='" + filter + "']"
              ),
              (el) => {
                el.classList.remove("non-swiper-slide");
                el.classList.add("swiper-slide");
                el.removeAttribute("style");
              }
            );
            swiper.destroy();
            swiper = new Swiper(".pro-filtr-cate-bx", config);
          }
        });
      });
      updateFilter(null);
    }
  };

  const handleToursSt2Swiper = () => {
    if (typeof Swiper === "undefined") {
      console.warn("Swiper is not loaded.");
      return;
    }

    const carouselEl = document.querySelector(".trv-tours-st2-swiper");
    if (!carouselEl) return;

    // scope controls to this carousel to avoid global selector conflicts
    const paginationEl = carouselEl.querySelector(".swiper-pagination");
    const nextEl = carouselEl.querySelector(".swiper-button-next");
    const prevEl = carouselEl.querySelector(".swiper-button-prev");

    const swiper = new Swiper(carouselEl, {
      slidesPerView: 1,
      spaceBetween: 30,
      loop: true,
      autoplay: {
        delay: 2500,
        disableOnInteraction: false,
      },
      pagination: paginationEl
        ? {
            el: paginationEl,
            clickable: true,
            dynamicBullets: true,
          }
        : {},
      navigation:
        nextEl && prevEl
          ? {
              nextEl,
              prevEl,
            }
          : {},
      breakpoints: {
        0: { slidesPerView: 1 },
        480: { slidesPerView: 1 },
        991: { slidesPerView: 2 },
        1199: { slidesPerView: 3 },
        1366: { slidesPerView: 3 },
        1440: { slidesPerView: 4 },
      },
      // optional accessibility improvements
      a11y: {
        enabled: true,
        prevSlideMessage: "Previous slide",
        nextSlideMessage: "Next slide",
        firstSlideMessage: "This is the first slide",
        lastSlideMessage: "This is the last slide",
      },
    });

    // Pause autoplay on hover (desktop)
    carouselEl.addEventListener("mouseenter", () => {
      if (swiper.autoplay && swiper.autoplay.running) swiper.autoplay.stop();
    });
    carouselEl.addEventListener("mouseleave", () => {
      if (swiper.autoplay && !swiper.autoplay.running) swiper.autoplay.start();
    });

    // Pause autoplay while user touches/swipes (mobile)
    carouselEl.addEventListener(
      "touchstart",
      () => {
        if (swiper.autoplay && swiper.autoplay.running) swiper.autoplay.stop();
      },
      { passive: true }
    );
    carouselEl.addEventListener(
      "touchend",
      () => {
        if (swiper.autoplay && !swiper.autoplay.running)
          swiper.autoplay.start();
      },
      { passive: true }
    );

    return swiper;
  };

  const handleToursSt3Swiper = () => {
    if (!document.querySelector(".trv-tours-st3-swiper")) return;

    new Swiper(".trv-tours-st3-swiper", {
      slidesPerView: 1,
      spaceBetween: 30,
      loop: true,
      autoplay: {
        delay: 2500,
        disableOnInteraction: false,
      },
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
        dynamicBullets: true,
      },
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
      breakpoints: {
        0: {
          slidesPerView: 1,
        },
        480: {
          slidesPerView: 1,
        },
        991: {
          slidesPerView: 3,
        },
        1024: {
          slidesPerView: 3,
        },
        1366: {
          slidesPerView: 4,
        },
      },
    });
  };

  const handleBlogSt2Swiper = () => {
    if (!document.querySelector(".trv-lat-blog-st2-swiper")) return;

    new Swiper(".trv-lat-blog-st2-swiper", {
      slidesPerView: 1,
      spaceBetween: 30,
      loop: true,
      autoplay: {
        delay: 2500,
        disableOnInteraction: false,
      },
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
        dynamicBullets: true,
      },
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
      breakpoints: {
        0: {
          slidesPerView: 1,
        },
        480: {
          slidesPerView: 1,
        },
        768: {
          slidesPerView: 2,
        },
        1024: {
          slidesPerView: 3,
        },
      },
    });
  };

  const handleTrvTourGuide = () => {
    if (!document.querySelector(".trv-tour-guide")) return;

    new Swiper(".trv-tour-guide", {
      slidesPerView: 1,
      spaceBetween: 30,
      loop: true,
      autoplay: {
        delay: 2500,
        disableOnInteraction: false,
      },
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
        dynamicBullets: true,
      },
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
      breakpoints: {
        0: {
          slidesPerView: 1,
        },
        480: {
          slidesPerView: 1,
        },
        640: {
          slidesPerView: 2,
        },
        1024: {
          slidesPerView: 3,
        },
        1366: {
          slidesPerView: 4,
        },
        1600: {
          slidesPerView: 5,
        },
      },
    });
  };

  const handleTrvGallerySwiper = () => {
		var swiper = new Swiper(".trv-inr-gallery-swiper", {
		  slidesPerView: 1,
		  spaceBetween: 10,
		  loop:true,
		  autoplay: {
			delay: 2500,
			disableOnInteraction: false,
		  },
		  pagination: {
			el: ".swiper-pagination",
			clickable: true,
			dynamicBullets: true,
		  },
		  navigation: {
			nextEl: ".swiper-button-next",
			prevEl: ".swiper-button-prev",
		  },
		  breakpoints: {
			0: {
				slidesPerView: 2,
			}, 
			360: {
			  slidesPerView: 2,
			},
			480: {
			  slidesPerView: 3,
			},
			991: {
			  slidesPerView: 4,
			},
			1024: {
			  slidesPerView: 4,
			},
		  },
		});
	}	

  return {
    load() {
      const inits = [
        [".reviewtwo-slider", handleReviewSlider],
        [".brand-swiper", handleBrandSwiper],
        [".popular-places-logo-swiper", handlePlacesLogoSwiper],
        [".trv-tours-st1", handleTrvToursSt1],
        [".testimonial-content-sld", handleTrvTestiSlider],
        [".trv-lat-blog-st2", handleTrvLatBlogSt2],
        [".trv_d-slider", handleTrvDSlider],
        [".trv-mf-tour-swiper", handleTourSwiper],
        [".trv-tr-cat-swiper", handleTourCatSwiper],
        [".trv-t-monial-swiper", handleTestimonialSwiper],
        [".pro-filtr-cate-bx", handleFilterSwiper],
        [".trv-tours-st2-swiper", handleToursSt2Swiper],
        [".trv-tours-st3-swiper", handleToursSt3Swiper],
        [".trv-lat-blog-st2-swiper", handleBlogSt2Swiper],
        [".trv-tour-guide", handleTrvTourGuide],
        [".trv-inr-gallery-swiper", handleTrvGallerySwiper],
      ];

      inits.forEach(([selector, init]) => {
        if (document.querySelector(selector)) init();
      });
    },
  };
};

const scheduleCarouselInit = (callback) => {
  if (typeof window.requestIdleCallback === "function") {
    window.requestIdleCallback(callback, { timeout: 2000 });
  } else {
    window.setTimeout(callback, 1);
  }
};

const bootCarousels = () => {
  if (typeof Swiper === "undefined") return;
  scheduleCarouselInit(() => ImusafirCarousel().load());
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", bootCarousels);
} else {
  bootCarousels();
}
