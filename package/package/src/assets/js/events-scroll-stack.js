(function () {
	'use strict';

	var DEFAULTS = {
		itemDistance: 120,
		itemScale: 0.03,
		itemStackDistance: 22,
		stackPosition: '20%',
		scaleEndPosition: '10%',
		baseScale: 0.85,
		rotationAmount: 0,
		blurAmount: 1.2,
		useWindowScroll: true,
	};

	function parsePercentage(value, containerHeight) {
		if (typeof value === 'string' && value.indexOf('%') !== -1) {
			return (parseFloat(value) / 100) * containerHeight;
		}
		return parseFloat(value);
	}

	function calculateProgress(scrollTop, start, end) {
		if (scrollTop < start) return 0;
		if (scrollTop > end) return 1;
		return (scrollTop - start) / (end - start);
	}

	function initScrollStack(root, options) {
		var opts = Object.assign({}, DEFAULTS, options || {});
		var useWindowScroll = opts.useWindowScroll !== false;
		var scroller = root;
		var inner = root.querySelector('.scroll-stack-inner');
		if (!inner) return null;

		var cards = Array.prototype.slice.call(root.querySelectorAll('.scroll-stack-card'));
		if (!cards.length) return null;

		var section = root.closest('.events-scroll-section') || root.parentElement;
		var pageRoot = document.body.classList.contains('events-page')
			? document.body
			: null;
		var mapLayer =
			document.querySelector('.events-page [data-events-map]') ||
			(section ? section.querySelector('[data-events-map]') : null);
		var endElement = root.querySelector('.scroll-stack-end');
		var lastMapY = null;

		var animationFrameId = null;
		var lenis = null;
		var stackCompleted = false;
		var isUpdating = false;
		var lastTransforms = new Map();
		var cardTops = [];
		var endElementTop = 0;
		var sectionTop = 0;
		var sectionHeight = 0;
		var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		var isMobile = window.matchMedia('(max-width: 767px)').matches;
		var blurAmount = reduceMotion ? 0 : isMobile ? opts.blurAmount * 0.65 : opts.blurAmount;
		var resizeTimer = null;

		cards.forEach(function (card, i) {
			if (i < cards.length - 1) {
				card.style.marginBottom = opts.itemDistance + 'px';
			}
			card.style.willChange = 'transform';
			card.style.transformOrigin = 'top center';
			card.style.backfaceVisibility = 'hidden';
			card.style.webkitBackfaceVisibility = 'hidden';
			card.style.transform = 'translate3d(0, 0, 0)';
		});

		function cacheLayoutMetrics() {
			// Measure with transforms cleared so pin math never fights itself.
			var previous = cards.map(function (card) {
				var transform = card.style.transform;
				var filter = card.style.filter;
				card.style.transform = 'none';
				card.style.filter = 'none';
				return { transform: transform, filter: filter };
			});

			// Force layout once, then read untransformed positions.
			void root.offsetHeight;
			var scrollY = window.scrollY || window.pageYOffset || 0;

			cardTops = cards.map(function (card) {
				if (useWindowScroll) {
					return card.getBoundingClientRect().top + scrollY;
				}
				return card.offsetTop;
			});
			endElementTop = endElement
				? useWindowScroll
					? endElement.getBoundingClientRect().top + scrollY
					: endElement.offsetTop
				: 0;
			sectionTop = section
				? section.getBoundingClientRect().top + scrollY
				: root.getBoundingClientRect().top + scrollY;
			sectionHeight = section ? section.offsetHeight : root.offsetHeight;

			cards.forEach(function (card, i) {
				card.style.transform = previous[i].transform || 'translate3d(0, 0, 0)';
				card.style.filter = previous[i].filter || '';
			});
		}

		function getScrollTop() {
			if (lenis && typeof lenis.scroll === 'number') {
				return lenis.scroll;
			}
			if (useWindowScroll) {
				return window.scrollY || window.pageYOffset || 0;
			}
			return scroller.scrollTop;
		}

		function getContainerHeight() {
			return useWindowScroll ? window.innerHeight : scroller.clientHeight;
		}

		function updateAtmosphere(scrollTop, containerHeight) {
			var docHeight = Math.max(
				document.documentElement.scrollHeight - containerHeight,
				1
			);
			var pageProgress = Math.min(1, Math.max(0, scrollTop / docHeight));

			if (pageRoot && !reduceMotion) {
				var x1 = 62 + pageProgress * 18;
				var y1 = 26 + pageProgress * 22;
				var x2 = 22 - pageProgress * 10;
				var y2 = 64 + pageProgress * 12;
				pageRoot.style.setProperty('--events-glow-x', x1.toFixed(1) + '%');
				pageRoot.style.setProperty('--events-glow-y', y1.toFixed(1) + '%');
				pageRoot.style.setProperty('--events-glow-x2', x2.toFixed(1) + '%');
				pageRoot.style.setProperty('--events-glow-y2', y2.toFixed(1) + '%');
			}

			if (!mapLayer || reduceMotion) return;

			var start = sectionTop - containerHeight * 0.15;
			var end = sectionTop + Math.max(sectionHeight, containerHeight) - containerHeight * 0.2;
			var progress = calculateProgress(scrollTop, start, end);
			var mapY = Math.round(-28 + progress * 56);
			var mapScale = (1 + pageProgress * 0.04).toFixed(3);

			if (lastMapY === null || lastMapY !== mapY) {
				mapLayer.style.transform =
					'translate3d(0, ' + mapY + 'px, 0) scale(' + mapScale + ')';
				lastMapY = mapY;
			}
		}

		function getCardTrigger(index, stackPositionPx) {
			return cardTops[index] - stackPositionPx - opts.itemStackDistance * index;
		}

		function getTopCardIndex(scrollTop, stackPositionPx) {
			var topCardIndex = 0;
			for (var j = 0; j < cards.length; j++) {
				if (scrollTop >= getCardTrigger(j, stackPositionPx)) {
					topCardIndex = j;
				}
			}
			return topCardIndex;
		}

		/**
		 * Active card is always sharp.
		 * Behind (already stacked): stay softly blurred.
		 * Ahead: start blurred, then ease to sharp as you approach — fully clear when reached.
		 */
		function getCardBlur(i, scrollTop, stackPositionPx, topCardIndex) {
			if (!blurAmount || i === topCardIndex) return 0;

			if (i < topCardIndex) {
				return Math.min(5, (topCardIndex - i) * blurAmount);
			}

			// Approaching a future card: unblur over the stretch before its trigger.
			var thisTrigger = getCardTrigger(i, stackPositionPx);
			var fromTrigger = getCardTrigger(topCardIndex, stackPositionPx);
			var approach = calculateProgress(scrollTop, fromTrigger, thisTrigger);
			// Become sharp a bit before the pin snaps (last ~20% already clear).
			var clearProgress = Math.min(1, approach / 0.8);
			var baseBlur = Math.min(5, (i - topCardIndex) * blurAmount);
			return baseBlur * (1 - clearProgress);
		}

		function updateCardTransforms() {
			if (!cards.length || isUpdating) return;
			if (!cardTops.length) cacheLayoutMetrics();

			isUpdating = true;

			var scrollTop = getScrollTop();
			var containerHeight = getContainerHeight();
			var stackPositionPx = parsePercentage(opts.stackPosition, containerHeight);
			var scaleEndPositionPx = parsePercentage(opts.scaleEndPosition, containerHeight);
			var topCardIndex = getTopCardIndex(scrollTop, stackPositionPx);
			var pinEnd = endElementTop - containerHeight / 2;

			updateAtmosphere(scrollTop, containerHeight);

			cards.forEach(function (card, i) {
				if (!card) return;

				var cardTop = cardTops[i];
				var triggerStart = getCardTrigger(i, stackPositionPx);
				var triggerEnd = cardTop - scaleEndPositionPx;
				var pinStart = triggerStart;

				var scaleProgress = calculateProgress(scrollTop, triggerStart, triggerEnd);
				var targetScale = opts.baseScale + i * opts.itemScale;
				var scale = 1 - scaleProgress * (1 - targetScale);
				var rotation = opts.rotationAmount ? i * opts.rotationAmount * scaleProgress : 0;
				var blur = getCardBlur(i, scrollTop, stackPositionPx, topCardIndex);
				var isActive = i === topCardIndex;

				var translateY = 0;
				var isPinned = scrollTop >= pinStart && scrollTop <= pinEnd;
				// Stack upward: older cards peek above the active card (not below).
				var stackDepth = Math.max(0, topCardIndex - i);
				var stackOffset = -opts.itemStackDistance * stackDepth;

				if (isPinned) {
					translateY = scrollTop - cardTop + stackPositionPx + stackOffset;
				} else if (scrollTop > pinEnd) {
					translateY = pinEnd - cardTop + stackPositionPx + stackOffset;
				}

				if (reduceMotion) {
					scale = 1;
					rotation = 0;
					blur = 0;
					translateY = 0;
				}

				// Integer pixels avoid sub-pixel shake while pinned.
				var newTransform = {
					translateY: Math.round(translateY),
					scale: Math.round(scale * 1000) / 1000,
					rotation: Math.round(rotation * 100) / 100,
					blur: isActive ? 0 : Math.round(blur * 10) / 10,
				};

				var lastTransform = lastTransforms.get(i);
				var hasChanged =
					!lastTransform ||
					lastTransform.translateY !== newTransform.translateY ||
					Math.abs(lastTransform.scale - newTransform.scale) > 0.001 ||
					Math.abs(lastTransform.rotation - newTransform.rotation) > 0.1 ||
					Math.abs(lastTransform.blur - newTransform.blur) > 0.05 ||
					!!lastTransform.active !== isActive;

				card.classList.toggle('is-active', isActive);
				card.style.zIndex = String(i + 1);

				if (hasChanged) {
					card.style.transform =
						'translate3d(0, ' +
						newTransform.translateY +
						'px, 0) scale(' +
						newTransform.scale +
						')' +
						(newTransform.rotation
							? ' rotate(' + newTransform.rotation + 'deg)'
							: '');
					// Always set filter so active cards never keep a leftover blur.
					card.style.filter =
						newTransform.blur > 0.05 ? 'blur(' + newTransform.blur + 'px)' : 'none';
					newTransform.active = isActive;
					lastTransforms.set(i, newTransform);
				}

				if (i === cards.length - 1) {
					var isInView = scrollTop >= pinStart && scrollTop <= pinEnd;
					if (isInView && !stackCompleted) {
						stackCompleted = true;
						if (typeof opts.onStackComplete === 'function') opts.onStackComplete();
					} else if (!isInView && stackCompleted) {
						stackCompleted = false;
					}
				}
			});

			isUpdating = false;
		}

		function handleScroll() {
			updateCardTransforms();
		}

		function setupLenis() {
			if (typeof Lenis === 'undefined' || reduceMotion) {
				if (useWindowScroll) {
					window.addEventListener('scroll', handleScroll, { passive: true });
				} else {
					scroller.addEventListener('scroll', handleScroll, { passive: true });
				}
				return null;
			}

			var lenisOptions = {
				duration: 1.1,
				easing: function (t) {
					return Math.min(1, 1.001 - Math.pow(2, -10 * t));
				},
				smoothWheel: true,
				touchMultiplier: 1.6,
				infinite: false,
				wheelMultiplier: 1,
				lerp: 0.12,
				syncTouch: true,
				syncTouchLerp: 0.075,
			};

			if (!useWindowScroll) {
				lenisOptions.wrapper = scroller;
				lenisOptions.content = inner;
			}

			lenis = new Lenis(lenisOptions);
			lenis.on('scroll', handleScroll);

			function raf(time) {
				lenis.raf(time);
				animationFrameId = requestAnimationFrame(raf);
			}
			animationFrameId = requestAnimationFrame(raf);
			return lenis;
		}

		function onResize() {
			window.clearTimeout(resizeTimer);
			resizeTimer = window.setTimeout(function () {
				isMobile = window.matchMedia('(max-width: 767px)').matches;
				blurAmount = reduceMotion ? 0 : isMobile ? opts.blurAmount * 0.65 : opts.blurAmount;
				lastTransforms.clear();
				cacheLayoutMetrics();
				updateCardTransforms();
			}, 120);
		}

		cacheLayoutMetrics();
		setupLenis();
		updateCardTransforms();
		window.addEventListener('resize', onResize);

		// Recache after fonts/images settle so pin distances stay accurate.
		window.addEventListener('load', function () {
			cacheLayoutMetrics();
			updateCardTransforms();
		});

		return {
			destroy: function () {
				if (animationFrameId) cancelAnimationFrame(animationFrameId);
				if (lenis) lenis.destroy();
				window.clearTimeout(resizeTimer);
				window.removeEventListener('resize', onResize);
				window.removeEventListener('scroll', handleScroll);
				scroller.removeEventListener('scroll', handleScroll);
				lastTransforms.clear();
				cards = [];
			},
			refresh: function () {
				cacheLayoutMetrics();
				updateCardTransforms();
			},
		};
	}

	function boot() {
		var roots = document.querySelectorAll('[data-scroll-stack]');
		if (!roots.length) return;

		Array.prototype.forEach.call(roots, function (root) {
			initScrollStack(root, {
				useWindowScroll: root.getAttribute('data-use-window-scroll') !== 'false',
			});
		});
	}

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', boot);
	} else {
		boot();
	}

	window.iMusafirScrollStack = { init: initScrollStack };
})();
