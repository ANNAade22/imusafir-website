(function () {
  var root = document.querySelector("[data-women-stories]");
  if (!root) return;

  var cards = Array.prototype.slice.call(
    root.querySelectorAll(".women-strategy-stories__card")
  );
  if (!cards.length) return;

  function setActive(index) {
    cards.forEach(function (card, i) {
      card.classList.toggle("is-active", i === index);
    });
  }

  cards.forEach(function (card, index) {
    card.addEventListener("mouseenter", function () {
      setActive(index);
    });
    card.addEventListener("focusin", function () {
      setActive(index);
    });
  });

  setActive(0);
})();
