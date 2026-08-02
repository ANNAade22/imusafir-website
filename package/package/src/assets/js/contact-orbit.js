(function () {
  var root = document.querySelector("#contact-orbit");
  if (!root) return;

  var cards = root.querySelectorAll(".contact-orbit__card");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-inview");
          io.unobserve(entry.target);
        });
      },
      { threshold: 0.15 }
    );
    cards.forEach(function (card) {
      io.observe(card);
    });
  } else {
    cards.forEach(function (card) {
      card.classList.add("is-inview");
    });
  }

  var items = Array.prototype.slice.call(root.querySelectorAll(".contact-orbit__item"));

  function setOpen(item, open) {
    var panel = item.querySelector(".contact-orbit__panel");
    var trigger = item.querySelector(".contact-orbit__trigger");
    if (!panel || !trigger) return;

    item.classList.toggle("is-open", open);
    trigger.setAttribute("aria-expanded", open ? "true" : "false");
    panel.style.maxHeight = open ? panel.scrollHeight + "px" : "0px";
  }

  function closeAll(except) {
    items.forEach(function (item) {
      if (item !== except) setOpen(item, false);
    });
  }

  items.forEach(function (item) {
    var trigger = item.querySelector(".contact-orbit__trigger");
    if (!trigger) return;
    trigger.addEventListener("click", function () {
      var isOpen = item.classList.contains("is-open");
      closeAll(item);
      setOpen(item, !isOpen);
    });
  });

  if (items[0]) {
    closeAll(items[0]);
    setOpen(items[0], true);
  }

  window.addEventListener("resize", function () {
    items.forEach(function (item) {
      if (!item.classList.contains("is-open")) return;
      var panel = item.querySelector(".contact-orbit__panel");
      if (panel) panel.style.maxHeight = panel.scrollHeight + "px";
    });
  });

  root.querySelectorAll(".contact-orbit__select-wrap select").forEach(function (select) {
    var sync = function () {
      select.classList.toggle("has-value", !!select.value);
    };
    select.addEventListener("change", sync);
    sync();
  });
})();
