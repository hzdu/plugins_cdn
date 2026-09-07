/**
 * Pricing page hash scroll (#gbt-pricing-credit, #pricing-options).
 * Tooltips: see dashboard-tips.js
 */
(function () {
	'use strict';

	var GAP = 20;
	var HASH_CREDIT = '#gbt-pricing-credit';
	var HASH_PLANS = '#pricing-options';
	var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

	function overlayTop() {
		var bar = document.getElementById('wpadminbar');
		if (!bar) {
			return 0;
		}
		var style = window.getComputedStyle(bar);
		if (style.display === 'none' || style.visibility === 'hidden') {
			return 0;
		}
		// Desktop: fixed. Mobile WP: often absolute until scrolled — only count
		// it when it actually covers the top of the viewport.
		var pos = style.position;
		if (pos !== 'fixed' && pos !== 'sticky') {
			return 0;
		}
		var rect = bar.getBoundingClientRect();
		if (rect.bottom <= 0 || rect.top > 8) {
			return 0;
		}
		return Math.max(0, Math.round(rect.bottom));
	}

	function hashOf(href) {
		if (!href) {
			return '';
		}
		var i = href.indexOf('#');
		return i === -1 ? '' : href.slice(i);
	}

	function targetForHash(hash) {
		if (hash === HASH_CREDIT) {
			var wrap = document.getElementById('gbt-pricing-credit');
			return (wrap && wrap.querySelector('[role="status"]')) || wrap || document.getElementById('pricing-options');
		}
		if (hash === HASH_PLANS) {
			return document.getElementById('pricing-options');
		}
		return null;
	}

	function slideTo(hash) {
		var target = targetForHash(hash);
		if (!target) {
			return false;
		}
		var scroller = document.scrollingElement || document.documentElement;
		var y = (scroller.scrollTop || window.pageYOffset) + target.getBoundingClientRect().top - overlayTop() - GAP;
		y = Math.max(0, Math.round(y));
		var opts = { top: y, left: 0, behavior: reduced ? 'auto' : 'smooth' };
		if (typeof scroller.scrollTo === 'function') {
			scroller.scrollTo(opts);
		}
		window.scrollTo(opts);
		return true;
	}

	function onPricingAnchor(e) {
		var el = e.target;
		if (el && el.nodeType === 3) {
			el = el.parentElement;
		}
		var a = el && el.closest && el.closest('a[href]');
		if (!a) {
			return;
		}
		var hash = hashOf(a.getAttribute('href'));
		if (hash !== HASH_CREDIT && hash !== HASH_PLANS) {
			return;
		}
		e.preventDefault();
		e.stopPropagation();
		if (!slideTo(hash)) {
			return;
		}
		if (history.replaceState) {
			history.replaceState(null, '', hash);
		}
	}

	function bindPricingScroll() {
		if ('scrollRestoration' in history) {
			history.scrollRestoration = 'manual';
		}

		document.addEventListener('click', onPricingAnchor, true);

		window.addEventListener('hashchange', function () {
			var hash = window.location.hash;
			if (hash === HASH_CREDIT || hash === HASH_PLANS) {
				slideTo(hash);
			}
		});

		var hash = window.location.hash;
		if (hash === HASH_CREDIT || hash === HASH_PLANS) {
			slideTo(hash);
			window.setTimeout(function () {
				slideTo(hash);
			}, 50);
		}
	}

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', bindPricingScroll);
	} else {
		bindPricingScroll();
	}
})();
