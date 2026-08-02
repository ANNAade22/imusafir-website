(function () {
	'use strict';

	function initEventsLottie() {
		if (typeof lottie === 'undefined') return;

		var nodes = document.querySelectorAll('.scroll-stack-card__lottie[data-lottie]');
		if (!nodes.length) return;

		var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

		Array.prototype.forEach.call(nodes, function (el) {
			var path = el.getAttribute('data-lottie');
			if (!path) return;

			var anim = lottie.loadAnimation({
				container: el,
				renderer: 'svg',
				loop: !reduceMotion,
				autoplay: !reduceMotion,
				path: path,
			});

			if (reduceMotion) {
				anim.addEventListener('DOMLoaded', function () {
					anim.goToAndStop(0, true);
				});
			}
		});
	}

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', initEventsLottie);
	} else {
		initEventsLottie();
	}
})();
