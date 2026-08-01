(function () {
	'use strict';

	function initHeroLottie() {
		if (typeof lottie === 'undefined' || typeof Swiper === 'undefined') return;

		var stage = document.querySelector('.hero-lottie-swiper');
		if (!stage) return;

		var nodes = stage.querySelectorAll('[data-lottie]');
		if (!nodes.length) return;

		var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		var animations = [];
		var ready = 0;
		var swiper = null;

		function playActive() {
			if (!swiper) return;
			var active = swiper.activeIndex;
			animations.forEach(function (anim, i) {
				if (!anim) return;
				if (i === active) {
					anim.goToAndPlay(0, true);
				} else {
					anim.stop();
					anim.goToAndStop(0, true);
				}
			});
		}

		nodes.forEach(function (el, i) {
			var path = el.getAttribute('data-lottie');
			if (!path) return;

			var anim = lottie.loadAnimation({
				container: el,
				renderer: 'svg',
				loop: false,
				autoplay: false,
				path: path,
			});

			animations[i] = anim;

			anim.addEventListener('DOMLoaded', function () {
				ready += 1;
				if (reduceMotion) {
					if (i === 0) anim.goToAndStop(0, true);
					return;
				}
				if (ready === nodes.length && swiper) {
					playActive();
				}
			});

			anim.addEventListener('complete', function () {
				if (reduceMotion || !swiper) return;
				if (animations.length === 1) {
					anim.goToAndPlay(0, true);
					return;
				}
				if (swiper.activeIndex !== i) return;
				if (swiper.activeIndex >= animations.length - 1) {
					swiper.slideTo(0);
				} else {
					swiper.slideNext();
				}
			});
		});

		swiper = new Swiper(stage, {
			direction: 'vertical',
			effect: 'slide',
			speed: 700,
			loop: false,
			rewind: true,
			allowTouchMove: true,
			slidesPerView: 1,
			spaceBetween: 0,
			watchOverflow: true,
			on: {
				slideChangeTransitionEnd: function () {
					if (reduceMotion) return;
					playActive();
				},
			},
		});

		if (!reduceMotion && ready === nodes.length) {
			playActive();
		}
	}

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', initHeroLottie);
	} else {
		initHeroLottie();
	}
})();
