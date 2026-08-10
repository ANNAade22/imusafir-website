(function () {
	'use strict';

	var TRANSITION_MS = 700;

	function initHeroSwiper() {
		if (typeof lottie === 'undefined' || typeof Swiper === 'undefined') return;

		var stage = document.querySelector('.ow-hero-lottie-swiper');
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

	function markLottieLoaded(el) {
		requestAnimationFrame(function () {
			el.classList.add('is-loaded');
		});
	}

	function loadLottieInto(el, options) {
		var path = el.getAttribute('data-lottie');
		if (!path || el.getAttribute('data-lottie-bound') === '1') return null;

		el.setAttribute('data-lottie-bound', '1');

		var reduceMotion = options.reduceMotion;
		var anim = lottie.loadAnimation({
			container: el,
			renderer: 'svg',
			loop: !reduceMotion && options.loop !== false,
			autoplay: false,
			path: path,
		});

		anim.addEventListener('DOMLoaded', function () {
			markLottieLoaded(el);
			if (reduceMotion) {
				anim.goToAndStop(0, true);
				return;
			}
			if (options.autoplayOnLoad) {
				anim.play();
			}
		});

		anim.addEventListener('data_failed', function () {
			markLottieLoaded(el);
		});

		return anim;
	}

	function initHeroLottie() {
		if (typeof lottie === 'undefined') return;

		var el = document.querySelector('.ow-hero--page .ow-hero__lottie[data-lottie-lazy], .ow-hero--page .ow-hero__lottie[data-lottie]');
		if (!el || !el.getAttribute('data-lottie')) return;

		var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		var started = false;

		function start() {
			if (started) return;
			started = true;

			var anim = loadLottieInto(el, {
				reduceMotion: reduceMotion,
				loop: true,
				autoplayOnLoad: !reduceMotion,
			});
			if (!anim || reduceMotion) return;

			if (!('IntersectionObserver' in window)) return;

			var playIo = new IntersectionObserver(
				function (entries) {
					entries.forEach(function (entry) {
						if (entry.isIntersecting) {
							anim.play();
						} else {
							anim.pause();
						}
					});
				},
				{ threshold: 0.2 }
			);
			playIo.observe(el);
		}

		if (!('IntersectionObserver' in window)) {
			start();
			return;
		}

		// Lazy: begin fetch when hero is near viewport; blur clears on DOMLoaded
		var lazyIo = new IntersectionObserver(
			function (entries) {
				entries.forEach(function (entry) {
					if (!entry.isIntersecting) return;
					lazyIo.unobserve(el);
					start();
				});
			},
			{ rootMargin: '120px 0px', threshold: 0.01 }
		);
		lazyIo.observe(el);
	}

	function initSectionLotties() {
		if (typeof lottie === 'undefined') return;

		var nodes = document.querySelectorAll('.ow-section-lottie[data-lottie]');
		if (!nodes.length) return;

		var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

		Array.prototype.forEach.call(nodes, function (el) {
			if (el.closest('.ow-hero--page')) return;

			var path = el.getAttribute('data-lottie');
			if (!path) return;

			function bind() {
				var anim = loadLottieInto(el, {
					reduceMotion: reduceMotion,
					loop: true,
					autoplayOnLoad: false,
				});
				if (!anim) return;

				if (reduceMotion) return;

				if (!('IntersectionObserver' in window)) {
					anim.play();
					return;
				}

				var io = new IntersectionObserver(
					function (entries) {
						entries.forEach(function (entry) {
							if (entry.isIntersecting) {
								anim.play();
							} else {
								anim.pause();
							}
						});
					},
					{ threshold: 0.25 }
				);
				io.observe(el);
			}

			if (!('IntersectionObserver' in window)) {
				bind();
				return;
			}

			var lazyIo = new IntersectionObserver(
				function (entries) {
					entries.forEach(function (entry) {
						if (!entry.isIntersecting) return;
						lazyIo.unobserve(el);
						bind();
					});
				},
				{ rootMargin: '160px 0px', threshold: 0.01 }
			);
			lazyIo.observe(el);
		});
	}

	function initReveals() {
		var nodes = document.querySelectorAll('.ow-reveal');
		if (!nodes.length) return;

		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
			nodes.forEach(function (el) {
				el.classList.add('is-inview');
			});
			return;
		}

		if (!('IntersectionObserver' in window)) {
			nodes.forEach(function (el) {
				el.classList.add('is-inview');
			});
			return;
		}

		var io = new IntersectionObserver(
			function (entries) {
				entries.forEach(function (entry) {
					if (!entry.isIntersecting) return;
					entry.target.classList.add('is-inview');
					io.unobserve(entry.target);
				});
			},
			{ threshold: 0.15 }
		);

		nodes.forEach(function (el) {
			io.observe(el);
		});
	}

	function init() {
		initHeroSwiper();
		initHeroLottie();
		initSectionLotties();
		initReveals();
	}

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', init);
	} else {
		init();
	}
})();
