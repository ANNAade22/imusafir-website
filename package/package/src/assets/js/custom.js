const Imusafir = (function () {
  const handleCursorsection = () => {
    const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
    const narrowScreen = window.matchMedia("(max-width: 991px)").matches;
    if (coarsePointer || narrowScreen) return;

    let cursor = document.querySelector(".cursor");
    let cursor2 = document.querySelector(".cursor2");
    if (!cursor || !cursor2 || typeof gsap === "undefined") return;
    let cursorScale = document.querySelectorAll(".cursor-scale");
    let mouseX = 0;
    let mouseY = 0;

    gsap.to({}, 0.016, {
      repeat: -1,
      onRepeat: function () {
        gsap.set(cursor, {
          css: {
            left: mouseX,
            top: mouseY,
          },
        });
        gsap.set(cursor2, {
          css: {
            left: mouseX,
            top: mouseY,
          },
        });
      },
    });

    window.addEventListener("mousemove", (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    cursorScale.forEach((link) => {
      link.addEventListener("mousemove", () => {
        cursor.classList.add("grow");
        if (link.classList.contains("small")) {
          cursor.classList.remove("grow");
          cursor.classList.add("grow-small");
        }
      });

      link.addEventListener("mouseleave", () => {
        cursor.classList.remove("grow");
        cursor.classList.remove("grow-small");
      });
    });

    document.querySelectorAll(".info-tab-trigger, .quick-search").forEach((el) => {
      el.addEventListener("mouseenter", () => {
        cursor.style.opacity = "0";
        cursor2.style.opacity = "0";
      });
      el.addEventListener("mouseleave", () => {
        cursor.style.opacity = "1";
        cursor2.style.opacity = "1";
      });
    });
  };

  $(window).scroll(function () {
    if ($(this).scrollTop() > 50) {
      $(".sticky-header").addClass("is-fixed");
    } else {
      $(".sticky-header").removeClass("is-fixed");
    }
  });

  function handleMobilesidedrawer() {
    jQuery("#mobile-side-drawer").on("click", function () {
      jQuery(".mobile-sider-drawer-menu").toggleClass("active");
    });
  }
  function handleSitesearch() {
    jQuery('a[href="#search"]').on("click", function (event) {
      jQuery("#search").addClass("open");
      jQuery('#search > form > input[type="search"]').focus();
    });

    jQuery("#search, #search .close-btn").on("click keyup", function (event) {
      if (event.target === this || event.target.className === "close-btn") {
        jQuery(this).removeClass("open");
      }
    });
  }

  function handleMagnificvideo() {
    if (typeof jQuery !== "undefined" && jQuery.fn.magnificPopup && jQuery(".popup-youtube").length) {
      jQuery(".popup-youtube").magnificPopup({
        type: "iframe",
      });
    }
  }


  const handleCounterJS = () => {
    const counters = document.querySelectorAll(".value");
    const speed = 200;

    const runCounter = (counter) => {
      const target = +counter.getAttribute("data-value");
      let current = 0;
      const increment = target / speed;

      const update = () => {
        current += increment;
        if (current < target) {
          counter.innerText = Math.ceil(current);
          requestAnimationFrame(update);
        } else {
          counter.innerText = target;
        }
      };

      update();
    };

    const isInViewport = (el) => {
      const rect = el.getBoundingClientRect();
      return (
        rect.top >= 0 &&
        rect.bottom <=
          (window.innerHeight || document.documentElement.clientHeight)
      );
    };

    const handleScroll = () => {
      counters.forEach((counter) => {
        if (!counter.classList.contains("counted") && isInViewport(counter)) {
          counter.classList.add("counted");
          runCounter(counter);
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
  };

  if (jQuery(".emblem").length) {
    const Emblem = {
      init: function (el, str) {
        const element = document.querySelector(el);
        const text = str ? str : element.innerHTML;
        element.innerHTML = "";
        for (let i = 0; i < text.length; i++) {
          const letter = text[i];
          const span = document.createElement("span");
          const node = document.createTextNode(letter);
          const r = (360 / text.length) * i;
          const x = (Math.PI / text.length).toFixed(0) * i;
          const y = (Math.PI / text.length).toFixed(0) * i;
          span.appendChild(node);
          span.style.webkitTransform =
            "rotateZ(" + r + "deg) translate3d(" + x + "px," + y + "px,0)";
          span.style.transform =
            "rotateZ(" + r + "deg) translate3d(" + x + "px," + y + "px,0)";
          element.appendChild(span);
        }
      },
    };

    Emblem.init(".emblem");
  }

  const handleSetCurrentYear = () => {
    const currentDate = new Date();
    let currentYear = currentDate.getFullYear();
    let elements = document.getElementsByClassName("current-year");

    for (const element of elements) {
      element.innerHTML = currentYear;
    }
  };

  function handleTvrRainEffetctfunction() {
    $(".rain").empty();

    let increment = 0;
    let drops = "";
    let backDrops = "";

    while (increment < 100) {
      const randoHundo = Math.floor(Math.random() * (98 - 1 + 1) + 1);
      const randoFiver = Math.floor(Math.random() * (5 - 2 + 1) + 2);

      increment += randoFiver;

      drops +=
        '<div class="drop" style="left: ' +
        increment +
        "%; bottom: " +
        (randoFiver + randoFiver - 1 + 100) +
        "%; animation-delay: 0." +
        randoHundo +
        "s; animation-duration: 0.5" +
        randoHundo +
        's;">' +
        '<div class="stem" style="animation-delay: 0.' +
        randoHundo +
        "s; animation-duration: 0.5" +
        randoHundo +
        's;"></div>' +
        '<div class="splat" style="animation-delay: 0.' +
        randoHundo +
        "s; animation-duration: 0.5" +
        randoHundo +
        's;"></div>' +
        "</div>";

      backDrops +=
        '<div class="drop" style="right: ' +
        increment +
        "%; bottom: " +
        (randoFiver + randoFiver - 1 + 100) +
        "%; animation-delay: 0." +
        randoHundo +
        "s; animation-duration: 0.5" +
        randoHundo +
        's;">' +
        '<div class="stem" style="animation-delay: 0.' +
        randoHundo +
        "s; animation-duration: 0.5" +
        randoHundo +
        's;"></div>' +
        '<div class="splat" style="animation-delay: 0.' +
        randoHundo +
        "s; animation-duration: 0.5" +
        randoHundo +
        's;"></div>' +
        "</div>";
    }

    $(".rain.front-row").append(drops);
    $(".rain.back-row").append(backDrops);
  }

  function handleScrollTop() {
    jQuery("button.scroltop").on("click", function () {
      jQuery("html, body").animate(
        {
          scrollTop: 0,
        },
        1000
      );
      return false;
    });

    jQuery(window).on("scroll", function () {
      const scroll = jQuery(window).scrollTop();

      if (scroll > 900) {
        jQuery("button.scroltop").fadeIn(1000);
      } else {
        jQuery("button.scroltop").fadeOut(1000);
      }
    });
  }

  const handleCustomSelects = () => {
    document.querySelectorAll(".dynamic-select").forEach((selectElement) => {
      createCustomSelectFromSelect(selectElement);
    });
  };

  const createCustomSelectFromSelect = (selectElement) => {
    const selectId =
      selectElement.id || `select-${Math.random().toString(36).substr(2, 9)}`;
    const customSelectDiv = document.createElement("div");
    customSelectDiv.id = `custom-${selectId}`;
    customSelectDiv.className = "custom-select";

    const selectedDiv = document.createElement("div");
    selectedDiv.className = "select-selected";
    selectedDiv.textContent = (
      selectElement.querySelector("option[selected]") ||
      selectElement.options[0]
    ).textContent;

    const labelText = selectElement.parentElement?.dataset?.label || "";
    if (labelText) {
      const label = document.createElement("span");
      label.textContent = labelText;
      selectedDiv.appendChild(label);
    }

    customSelectDiv.appendChild(selectedDiv);

    const itemsDiv = document.createElement("div");
    itemsDiv.className = "select-items select-hide";
    customSelectDiv.appendChild(itemsDiv);

    Array.from(selectElement.options).forEach((option) => {
      const customOptionDiv = document.createElement("div");
      customOptionDiv.className = "select-item";
      customOptionDiv.setAttribute("data-value", option.value);
      customOptionDiv.textContent = option.textContent;
      if (option.selected) customOptionDiv.classList.add("active");

      customOptionDiv.addEventListener("click", function () {
        selectedDiv.childNodes[0].textContent = this.textContent;
        selectElement.value = this.getAttribute("data-value");
        selectElement.dispatchEvent(new Event("change"));
        selectElement.dispatchEvent(new Event("click"));

        itemsDiv.classList.add("select-hide");
        selectedDiv.classList.remove("select-active");

        itemsDiv
          .querySelectorAll(".select-item")
          .forEach((item) => item.classList.remove("active"));
        this.classList.add("active");
      });

      itemsDiv.appendChild(customOptionDiv);
    });

    selectElement.style.display = "none";
    selectElement.parentNode.insertBefore(
      customSelectDiv,
      selectElement.nextSibling
    );

    selectedDiv.addEventListener("click", function (e) {
      e.stopPropagation();
      itemsDiv.classList.toggle("select-hide");
      selectedDiv.classList.toggle("select-active");
    });

    document.addEventListener("click", function (e) {
      if (!customSelectDiv.contains(e.target)) {
        itemsDiv.classList.add("select-hide");
        selectedDiv.classList.remove("select-active");
      }
    });
  };

  const handleAccordion = (container = document) => {
    const accordionContainers = container.querySelectorAll(".myAccordion");

    accordionContainers.forEach((accordion) => {
      if (accordion.dataset.bound === "true") return;
      accordion.dataset.bound = "true";

      accordion.addEventListener("click", function (e) {
        const header = e.target.closest(".accordion-header");
        if (!header || !accordion.contains(header)) return;

        const item = header.parentElement;
        const content = item.querySelector(".accordion-content");
        const arrow = header.querySelector(".arrow");
        const isOpen = header.classList.contains("open");

        accordion.querySelectorAll(".accordion-header").forEach((h) => {
          if (h !== header) {
            h.classList.remove("open");
            h.querySelector(".arrow")?.classList.remove("active");
            const c = h.parentElement.querySelector(".accordion-content");
            if (c) c.style.maxHeight = null;
          }
        });

        if (!isOpen) {
          header.classList.add("open");
          content.style.maxHeight = content.scrollHeight + "px";
          arrow?.classList.add("active");
        } else {
          header.classList.remove("open");
          content.style.maxHeight = null;
          arrow?.classList.remove("active");
        }
      });
    });

    container.querySelectorAll(".accordion-header.open").forEach((header) => {
      const content = header.parentElement.querySelector(".accordion-content");
      const arrow = header.querySelector(".arrow");
      if (content) {
        content.style.maxHeight = content.scrollHeight + "px";
        arrow?.classList.add("active");
      }
    });
  };

  function handleLightboxPopup() {
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

  const handleTouchSpin = () => {
    function incrementValue(e) {
      e.preventDefault();
      const button = e.target.closest("[data-field]");
      const fieldName = button.getAttribute("data-field");

      const parent = button.closest("div") || button.closest("td");
      const input = parent.querySelector(`input[name="${fieldName}"]`);

      let currentVal = parseInt(input.value, 10);
      input.value = !isNaN(currentVal) ? currentVal + 1 : 0;
    }

    function decrementValue(e) {
      e.preventDefault();
      const button = e.target.closest("[data-field]");
      const fieldName = button.getAttribute("data-field");

      const parent = button.closest("div") || button.closest("td");
      const input = parent.querySelector(`input[name="${fieldName}"]`);

      let currentVal = parseInt(input.value, 10);
      input.value = !isNaN(currentVal) && currentVal > 0 ? currentVal - 1 : 0;
    }

    document.querySelectorAll(".input-group").forEach((group) => {
      group.addEventListener("click", function (e) {
        const target = e.target.closest(".button-plus, .button-minus");
        if (!target) return;

        if (target.classList.contains("button-plus")) {
          incrementValue(e);
        } else if (target.classList.contains("button-minus")) {
          decrementValue(e);
        }
      });
    });
  };

  const handleflatpickr = () => {
    if (typeof flatpickr === "undefined") return;
    if (jQuery(".flatpickr1").length > 0) {
      flatpickr(".flatpickr1", {});
    }
    if (jQuery(".time-picker").length > 0) {
      flatpickr(".time-picker", {
        enableTime: true,
        noCalendar: true,
        dateFormat: "H:i",
        defaultDate: "13:45",
      });
    }
  };

  const handleTagSlider = () => {
    if (jQuery("#tagSlider").length > 0) {
      $("#tagSlider").grouploop({
        velocity: 1,
        forward: false,
        pauseOnHover: true,
        childNode: ".item",
        childWrapper: ".item-wrap",
      });
    }
    if (jQuery("#tagSlider2").length > 0) {
      $("#tagSlider2").grouploop({
        velocity: 1,
        forward: true,
        pauseOnHover: true,
        childNode: ".item",
        childWrapper: ".item-wrap",
      });
    }
  };

  const handleShopProductPrice = () => {
    if (typeof noUiSlider === "undefined") return;
    const directionSlider = document.getElementById("slider-direction");
    const directionField = document.getElementById("field");

    if (!directionSlider || !directionField) return;

    noUiSlider.create(directionSlider, {
      start: 2,
      connect: [true, false],
      range: {
        min: 0,
        max: 10,
      },
    });

    directionSlider.noUiSlider.on("update", (values, handle) => {
      directionField.innerHTML = values[handle];
    });
  };

  const handlePageLoader = () => {
    const loader = document.querySelector(".loading-area");
    if (!loader) return;
    loader.classList.add("fade-out");
    setTimeout(() => loader.remove(), 400);
  };

  const handlePricingRedirect = () => {
    const page = window.location.pathname.split("/").pop() || "";
    if (page === "pricing.html" || page === "pricing") {
      window.location.replace("indonesia-2026.html");
    }
  };

  const DELEGATION_PACKAGE_LABELS = {
    "standard-delegate": "Standard Delegate ($2,997)",
    "executive-delegate": "Executive Delegate ($4,997)",
    "elite-founder-circle": "Elite Founder Circle ($7,997)",
    "legacy-companion-pass": "Legacy Companion Pass ($1,997–$2,497)",
    "not-sure": "Not sure yet — help me choose",
  };

  const buildContactSubject = (interest, pkg) => {
    if (interest === "indonesia-2026" && pkg && DELEGATION_PACKAGE_LABELS[pkg]) {
      return "Indonesia 2026 — " + DELEGATION_PACKAGE_LABELS[pkg];
    }
    if (interest === "indonesia-2026") {
      return "Indonesia 2026 Delegation Inquiry";
    }
    if (pkg && DELEGATION_PACKAGE_LABELS[pkg]) {
      return "Delegation Inquiry — " + DELEGATION_PACKAGE_LABELS[pkg];
    }
    return "";
  };

  const applyContactFormParams = () => {
    const form = document.getElementById("contact-form");
    if (!form) return;

    const params = new URLSearchParams(window.location.search);
    const packageSelect = document.getElementById("delegation-package");
    const interestSelect = document.getElementById("delegation-interest");
    const subjectInput = document.getElementById("contact-subject");
    const pkg = params.get("package");
    const interest = params.get("interest");

    if (interestSelect && interest) {
      const option = interestSelect.querySelector(`option[value="${interest}"]`);
      if (option) {
        interestSelect.value = interest;
      }
    }

    if (packageSelect && pkg && DELEGATION_PACKAGE_LABELS[pkg]) {
      packageSelect.value = pkg;
    }

    if (subjectInput && !subjectInput.dataset.userEdited) {
      const resolvedInterest = interest || interestSelect?.value || "";
      const resolvedPackage = pkg || packageSelect?.value || "";
      const subject = buildContactSubject(resolvedInterest, resolvedPackage);
      if (subject) {
        subjectInput.value = subject;
      }
    }
  };

  const handleContactFormHelpers = () => {
    const form = document.getElementById("contact-form");
    if (!form) return;

    const subjectInput = document.getElementById("contact-subject");
    const interestSelect = document.getElementById("delegation-interest");
    const packageSelect = document.getElementById("delegation-package");

    if (subjectInput) {
      subjectInput.addEventListener("input", () => {
        subjectInput.dataset.userEdited = "true";
      });
    }

    const updateSubjectFromSelections = () => {
      if (!subjectInput || subjectInput.dataset.userEdited) return;

      const interest = interestSelect?.value || "";
      const pkg = packageSelect?.value || "";
      const subject = buildContactSubject(interest, pkg);
      if (subject) {
        subjectInput.value = subject;
      }
    };

    const updateCompanionPackageNote = () => {
      const note = document.getElementById("companion-package-note");
      if (!note || !packageSelect) return;
      note.classList.toggle("hidden", packageSelect.value !== "legacy-companion-pass");
    };

    interestSelect?.addEventListener("change", updateSubjectFromSelections);
    packageSelect?.addEventListener("change", () => {
      updateSubjectFromSelections();
      updateCompanionPackageNote();
    });
    updateCompanionPackageNote();
  };

  return {
    init: function () {
      handleCursorsection();
      handleMobilesidedrawer();
      handleSitesearch();
      handleScrollTop();
      handleCounterJS();
      handleSetCurrentYear();
      handleCustomSelects();
      handleAccordion();
      handlePageLoader();
      handlePricingRedirect();
      applyContactFormParams();
      handleContactFormHelpers();
      if (typeof Gallery !== "undefined") Gallery.init();
      handleLightboxPopup();
      handleTagSlider();
    },
    applyContactFormParams,
    buildContactSubject,
  };
})();

document.addEventListener("DOMContentLoaded", () => {
  Imusafir.init();
});
