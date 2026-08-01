(function () {
	'use strict';

	var TRANSITION_MS = 700;

	function initHeroLottie() {
		if (typeof lottie === 'undefined' || typeof Swiper === 'undefined') return;

		var stage = document.querySelector('.hero-lottie-swiper');
		if (!stage) return;

		var sourceNodes = stage.querySelectorAll('[data-lottie]');
		if (!sourceNodes.length) return;

		var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		var slideCount = sourceNodes.length;
		var animationsByEl = new Map();
		var ready = 0;
		var totalToLoad = 0;
		var swiper = null;

		function playActive() {
			if (!swiper) return;
			var activeSlide = swiper.slides[swiper.activeIndex];
			if (!activeSlide) return;

			var activeEl = activeSlide.querySelector('[data-lottie]');
			animationsByEl.forEach(function (anim, el) {
				if (el === activeEl) {
					anim.goToAndPlay(0, true);
				} else {
					anim.stop();
					anim.goToAndStop(0, true);
				}
			});
		}

		function bindLottie(el) {
			var path = el.getAttribute('data-lottie');
			if (!path || animationsByEl.has(el)) return;

			totalToLoad += 1;
			var anim = lottie.loadAnimation({
				container: el,
				renderer: 'svg',
				loop: false,
				autoplay: false,
				path: path,
			});

			animationsByEl.set(el, anim);

			anim.addEventListener('DOMLoaded', function () {
				ready += 1;
				if (reduceMotion) {
					if (ready === 1) anim.goToAndStop(0, true);
					return;
				}
				if (ready === totalToLoad && swiper) {
					playActive();
				}
			});

			anim.addEventListener('complete', function () {
				if (reduceMotion || !swiper || slideCount < 2) return;

				var activeSlide = swiper.slides[swiper.activeIndex];
				var activeEl = activeSlide && activeSlide.querySelector('[data-lottie]');
				if (activeEl !== el) return;

				swiper.slideNext();
			});
		}

		swiper = new Swiper(stage, {
			direction: 'vertical',
			effect: 'slide',
			speed: TRANSITION_MS,
			loop: slideCount > 1,
			allowTouchMove: false,
			simulateTouch: false,
			slidesPerView: 1,
			spaceBetween: 0,
			watchOverflow: true,
			on: {
				init: function () {
					stage.querySelectorAll('[data-lottie]').forEach(bindLottie);
				},
				slideChangeTransitionEnd: function () {
					if (reduceMotion) return;
					playActive();
				},
			},
		});

		if (!totalToLoad) {
			stage.querySelectorAll('[data-lottie]').forEach(bindLottie);
		}
	}

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', initHeroLottie);
	} else {
		initHeroLottie();
	}
})();
