/**
 * Shared dashboard tooltips (license + plans).
 * - Feature tips: absolute under the row (scroll with the item).
 * - Save / prem tips: fixed + cursor follow on fine pointers; tap on touch.
 */
(function (window, document) {
	'use strict';

	var UNDER = 10;

	function finePointer() {
		return window.matchMedia('(hover: hover) and (pointer: fine)').matches;
	}

	function clampLeft(left, tw) {
		var pad = 12;
		var vw = window.innerWidth || document.documentElement.clientWidth;
		return Math.min(vw - tw - pad, Math.max(pad, left));
	}

	/** Cursor-follow for fixed tips (save / prem). */
	function placeCursor(tip, e) {
		if (!tip || !e) {
			return;
		}
		var x = typeof e.clientX === 'number' ? e.clientX : 0;
		var y = typeof e.clientY === 'number' ? e.clientY : 0;
		var tw = tip.offsetWidth || 160;
		var th = tip.offsetHeight || 36;
		var pad = 12;
		var vh = window.innerHeight || document.documentElement.clientHeight;
		var left = clampLeft(x + 12, tw);
		var top = y + 18;
		var above = y - th - 12;

		tip.classList.remove('is-above', 'is-anchored');
		if (top + th + pad > vh && above > 0) {
			top = above;
			tip.classList.add('is-above');
		}

		tip.style.transform = 'translate(' + Math.round(left) + 'px,' + Math.round(top) + 'px)';
	}

	/** Anchor a fixed tip under/above a trigger (touch / focus). */
	function placeNearAnchor(tip, anchor, offsetX) {
		if (!tip || !anchor) {
			return;
		}
		var rect = anchor.getBoundingClientRect();
		var tw = tip.offsetWidth || 160;
		var th = tip.offsetHeight || 36;
		var pad = 12;
		var vh = window.innerHeight || document.documentElement.clientHeight;
		var ox = typeof offsetX === 'number' ? offsetX : 0;
		var left = clampLeft(rect.left + ox, tw);
		var top = rect.bottom + UNDER;
		var above = rect.top - th - UNDER;

		tip.classList.add('is-anchored');
		tip.classList.remove('is-above');
		if (top + th + pad > vh && above > 0) {
			top = above;
			tip.classList.add('is-above');
		}

		tip.style.transform = 'translate(' + Math.round(left) + 'px,' + Math.round(top) + 'px)';
	}

	function showTip(tip) {
		if (tip) {
			tip.classList.add('is-on');
		}
	}

	function hideTip(tip) {
		if (tip) {
			tip.classList.remove('is-on', 'is-above', 'is-anchored');
		}
	}

	/** Pay-once / simple hover tip — CSS opacity; JS only tracks cursor. */
	function initSaveTips(scope) {
		var tip = scope.querySelector('.gbt-save-tip');
		var label = tip && tip.closest('label');
		if (!label || !tip) {
			return;
		}

		label.addEventListener('pointerenter', function (e) {
			placeCursor(tip, e);
		});
		label.addEventListener('pointermove', function (e) {
			placeCursor(tip, e);
		});
	}

	/**
	 * Feature row tips — CSS hover on desktop; tap on touch. Flips above when needed.
	 */
	function initFeatTips(scope) {
		var fine = finePointer();
		var rows = [];

		scope.querySelectorAll('.group\\/feat').forEach(function (row) {
			var tip = row.querySelector('.gbt-feat-tip');
			if (!tip) {
				return;
			}
			tip.style.transform = '';
			tip.style.top = '';
			tip.style.left = '';
			rows.push({ row: row, tip: tip });
		});

		if (!rows.length) {
			return;
		}

		function orientTip(item) {
			var anchor = item.row.querySelector('.gbt-feat-label') || item.row;
			item.tip.classList.remove('is-above');
			var rect = anchor.getBoundingClientRect();
			var vh = window.innerHeight || document.documentElement.clientHeight;
			if (vh - rect.bottom < 72 && rect.top > vh - rect.bottom) {
				item.tip.classList.add('is-above');
			}
		}

		rows.forEach(function (item) {
			if (fine) {
				item.row.addEventListener('pointerenter', function () {
					orientTip(item);
				});
				return;
			}

			item.row.addEventListener('click', function (e) {
				e.preventDefault();
				e.stopPropagation();
				var wasOn = item.tip.classList.contains('is-on');
				rows.forEach(function (r) {
					hideTip(r.tip);
				});
				if (!wasOn) {
					orientTip(item);
					showTip(item.tip);
				}
			});
		});

		if (!fine) {
			document.addEventListener(
				'click',
				function (e) {
					if (e.target.closest && e.target.closest('.group\\/feat')) {
						return;
					}
					rows.forEach(function (r) {
						hideTip(r.tip);
					});
				},
				true
			);
		}
	}

	/** License "new features" tip — list in tip; tap on mobile. */
	function initPremTips(scope) {
		var triggers = scope.querySelectorAll('[data-gbt-tip-trigger], .group\\/prem');
		var fine = finePointer();

		triggers.forEach(function (trigger) {
			var tip = trigger.querySelector('.gbt-prem-tip, [data-gbt-tip]');
			if (!tip || tip.__gbtTipBound) {
				return;
			}
			tip.__gbtTipBound = true;

			var open = false;

			function show(e) {
				open = true;
				showTip(tip);
				if (fine && e && typeof e.clientX === 'number') {
					placeCursor(tip, e);
				} else {
					placeNearAnchor(tip, trigger, 0);
				}
			}

			function hide() {
				open = false;
				hideTip(tip);
			}

			if (fine) {
				trigger.addEventListener('pointerenter', show);
				trigger.addEventListener('pointermove', function (e) {
					if (open) {
						placeCursor(tip, e);
					}
				});
				trigger.addEventListener('pointerleave', hide);
				trigger.addEventListener('focus', function () {
					show();
				});
				trigger.addEventListener('blur', hide);
				return;
			}

			trigger.addEventListener('click', function (e) {
				e.preventDefault();
				e.stopPropagation();
				if (open) {
					hide();
				} else {
					show();
				}
			});

			document.addEventListener('click', function (e) {
				if (!open) {
					return;
				}
				if (trigger.contains(e.target) || tip.contains(e.target)) {
					return;
				}
				hide();
			});

			document.addEventListener('keydown', function (e) {
				if (e.key === 'Escape' && open) {
					hide();
				}
			});

			window.addEventListener('resize', function () {
				if (open) {
					placeNearAnchor(tip, trigger, 0);
				}
			});

			window.addEventListener(
				'scroll',
				function () {
					if (open) {
						placeNearAnchor(tip, trigger, 0);
					}
				},
				true
			);
		});
	}

	function init(root) {
		var scope = root || document.querySelector('.gbt-dashboard-scope');
		if (!scope) {
			return;
		}
		initSaveTips(scope);
		initFeatTips(scope);
		initPremTips(scope);
	}

	window.GBTDashboardTips = {
		init: init,
		placeCursor: placeCursor,
		placeNearAnchor: placeNearAnchor,
		showTip: showTip,
		hideTip: hideTip,
	};

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', function () {
			init();
		});
	} else {
		init();
	}
})(window, document);
