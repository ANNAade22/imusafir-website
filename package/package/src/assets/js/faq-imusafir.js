(function () {
  var root = document.querySelector("#faq-imusafir");
  if (!root) return;

  var items = Array.prototype.slice.call(root.querySelectorAll(".faq-imusafir__item"));
  if (!items.length) return;

  function setOpen(targetItem, open) {
    var panel = targetItem.querySelector(".faq-imusafir__panel");
    var trigger = targetItem.querySelector(".faq-imusafir__trigger");
    if (!panel || !trigger) return;

    targetItem.classList.toggle("is-open", open);
    trigger.setAttribute("aria-expanded", open ? "true" : "false");

    if (open) {
      panel.style.maxHeight = panel.scrollHeight + "px";
    } else {
      panel.style.maxHeight = "0px";
    }
  }

  function closeAll(except) {
    items.forEach(function (item) {
      if (item !== except) setOpen(item, false);
    });
  }

  items.forEach(function (item) {
    var trigger = item.querySelector(".faq-imusafir__trigger");
    if (!trigger) return;

    trigger.addEventListener("click", function () {
      var isOpen = item.classList.contains("is-open");
      closeAll(item);
      setOpen(item, !isOpen);
    });
  });

  var defaultOpen = root.querySelector('.faq-imusafir__item[data-default-open="true"]') || items[0];
  if (defaultOpen) {
    closeAll(defaultOpen);
    setOpen(defaultOpen, true);
  }

  window.addEventListener("resize", function () {
    items.forEach(function (item) {
      if (!item.classList.contains("is-open")) return;
      var panel = item.querySelector(".faq-imusafir__panel");
      if (panel) panel.style.maxHeight = panel.scrollHeight + "px";
    });
  });

  var cta = root.querySelector(".faq-imusafir__cta-btn");
  if (cta) {
    cta.addEventListener("click", function (e) {
      var href = cta.getAttribute("href") || "";
      if (href.charAt(0) !== "#") return;
      var target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      var offset = window.matchMedia("(min-width: 1024px)").matches ? 160 : 120;
      var top = target.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
      if (history.pushState) {
        history.pushState(null, "", href);
      }
    });
  }
})();
