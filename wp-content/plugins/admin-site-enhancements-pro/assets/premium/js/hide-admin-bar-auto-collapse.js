/*! <fs_premium_only> */
/**
 * Auto-collapse frontend admin bar into a toggle control (ASE Pro).
 */
(function () {
	'use strict';

	var cfg = window.asenhaHideAdminBarAutoCollapse;
	if (!cfg || typeof cfg !== 'object') {
		return;
	}

	var adminBar = document.getElementById('wpadminbar');
	if (!adminBar) {
		return;
	}

	var html = document.documentElement;
	var wideInitialized = false;
	var pinnedExpanded = false;
	var hoverStrip = null;
	var toggleBtn = null;
	var collapseTimer = null;
	var expandTimer = null;
	var mq = window.matchMedia(
		'(max-width: ' + String(cfg.smallScreenMaxPx || 782) + 'px)'
	);

	function readStoredState() {
		if (!cfg.storageKey || typeof window.localStorage === 'undefined') {
			return null;
		}
		try {
			var v = window.localStorage.getItem(cfg.storageKey);
			if (v === 'collapsed' || v === 'expanded') {
				return v;
			}
			return null;
		} catch (err) {
			return null;
		}
	}

	function writeStoredState(value) {
		if (!cfg.storageKey || typeof window.localStorage === 'undefined') {
			return;
		}
		try {
			window.localStorage.setItem(cfg.storageKey, value);
		} catch (err) {
			/* Private mode / quota — ignore */
		}
	}

	function clearTimers() {
		if (collapseTimer) {
			window.clearTimeout(collapseTimer);
			collapseTimer = null;
		}
		if (expandTimer) {
			window.clearTimeout(expandTimer);
			expandTimer = null;
		}
	}

	function teardownWide() {
		if (!wideInitialized) {
			return;
		}
		wideInitialized = false;
		pinnedExpanded = false;
		clearTimers();
		html.classList.remove('asenha-abac-html--wide-active');
		html.classList.remove('asenha-abac-html--collapsed');
		html.classList.remove('asenha-abac-html--toggle-right');
		adminBar.removeAttribute('aria-hidden');
		if (hoverStrip && hoverStrip.parentNode) {
			hoverStrip.parentNode.removeChild(hoverStrip);
		}
		hoverStrip = null;
		if (toggleBtn && toggleBtn.parentNode) {
			toggleBtn.parentNode.removeChild(toggleBtn);
		}
		toggleBtn = null;
		adminBar.style.transition = '';
	}

	function isToolbarHoverRelated(node) {
		if (!node || typeof node.closest !== 'function') {
			return false;
		}
		return !!(
			node.closest('#wpadminbar') ||
			node.closest('#asenha-abac-hover-strip') ||
			node.closest('#asenha-abac-toggle')
		);
	}

	function onToolbarUiMouseleave(ev) {
		if (pinnedExpanded) {
			clearTimers();
			return;
		}
		if (isToolbarHoverRelated(ev.relatedTarget)) {
			return;
		}
		scheduleCollapse();
	}

	function scheduleCollapse() {
		if (pinnedExpanded) {
			clearTimers();
			return;
		}
		clearTimers();
		collapseTimer = window.setTimeout(function () {
			collapseTimer = null;
			setCollapsed(true);
		}, cfg.delay || 200);
	}

	function scheduleExpand() {
		clearTimers();
		expandTimer = window.setTimeout(function () {
			expandTimer = null;
			setCollapsed(false);
		}, cfg.delay || 200);
	}

	function setCollapsed(collapsed) {
		if (!wideInitialized) {
			return;
		}
		var i18n = cfg.i18n || {};
		if (collapsed) {
			html.classList.add('asenha-abac-html--collapsed');
			adminBar.setAttribute('aria-hidden', 'true');
			if (toggleBtn) {
				toggleBtn.setAttribute('aria-expanded', 'false');
				toggleBtn.setAttribute(
					'aria-label',
					i18n.expandToolbar || 'Show toolbar'
				);
			}
		} else {
			html.classList.remove('asenha-abac-html--collapsed');
			adminBar.removeAttribute('aria-hidden');
			if (toggleBtn) {
				toggleBtn.setAttribute('aria-expanded', 'true');
				toggleBtn.setAttribute(
					'aria-label',
					i18n.collapseToolbar || 'Hide toolbar'
				);
			}
		}
	}

	function initWide() {
		if (wideInitialized) {
			return;
		}
		wideInitialized = true;
		html.classList.add('asenha-abac-html--wide-active');
		html.classList.remove('asenha-abac-html--toggle-right');
		if (cfg.arrowPosition === 'right') {
			html.classList.add('asenha-abac-html--toggle-right');
		}

		var animMs = parseInt(cfg.animationSpeed, 10);
		if (isNaN(animMs) || animMs < 0) {
			animMs = 100;
		}
		adminBar.style.transition =
			'transform ' + String(animMs) + 'ms ease-out';

		hoverStrip = document.createElement('div');
		hoverStrip.id = 'asenha-abac-hover-strip';
		hoverStrip.setAttribute('aria-hidden', 'true');
		document.body.appendChild(hoverStrip);

		hoverStrip.addEventListener('mouseenter', scheduleExpand);
		hoverStrip.addEventListener('mouseleave', onToolbarUiMouseleave);

		adminBar.addEventListener('mouseenter', scheduleExpand);
		adminBar.addEventListener('mouseleave', onToolbarUiMouseleave);

		if (cfg.showToggle) {
			toggleBtn = document.createElement('button');
			toggleBtn.type = 'button';
			toggleBtn.id = 'asenha-abac-toggle';
			toggleBtn.className = 'asenha-abac-toggle';
			toggleBtn.setAttribute('aria-controls', 'wpadminbar');
			toggleBtn.setAttribute('aria-expanded', 'false');
			if (cfg.showArrow) {
				var arrow = document.createElement('span');
				arrow.className = 'asenha-abac-arrow';
				arrow.setAttribute('aria-hidden', 'true');
				toggleBtn.appendChild(arrow);
				toggleBtn.classList.add('asenha-abac-toggle--arrow');
			}
			if (cfg.arrowPosition === 'right') {
				toggleBtn.classList.add('asenha-abac-toggle--right');
			}
			toggleBtn.addEventListener('click', function () {
				var collapsed = html.classList.contains(
					'asenha-abac-html--collapsed'
				);
				clearTimers();
				if (collapsed) {
					pinnedExpanded = true;
					setCollapsed(false);
					writeStoredState('expanded');
				} else {
					pinnedExpanded = false;
					setCollapsed(true);
					writeStoredState('collapsed');
				}
			});
			document.body.appendChild(toggleBtn);
		}

		var delayMs = parseInt(cfg.delay, 10);
		if (isNaN(delayMs) || delayMs < 0) {
			delayMs = 200;
		}

		var stored = readStoredState();
		if (stored === 'expanded') {
			pinnedExpanded = true;
			setCollapsed(false);
		} else if (stored === 'collapsed') {
			pinnedExpanded = false;
			setCollapsed(true);
		} else {
			pinnedExpanded = false;
			if (toggleBtn) {
				var i18nInit = cfg.i18n || {};
				toggleBtn.setAttribute('aria-expanded', 'true');
				toggleBtn.setAttribute(
					'aria-label',
					i18nInit.collapseToolbar || 'Hide toolbar'
				);
			}
			window.setTimeout(function () {
				if (!wideInitialized) {
					return;
				}
				setCollapsed(true);
			}, delayMs);
		}
	}

	function applySmallHidden() {
		teardownWide();
		html.classList.add('asenha-abac-html--small-hidden');
	}

	function removeSmallHidden() {
		html.classList.remove('asenha-abac-html--small-hidden');
	}

	function updateMode() {
		if (cfg.hideOnSmallScreens && mq.matches) {
			removeSmallHidden();
			applySmallHidden();
			return;
		}
		removeSmallHidden();
		initWide();
	}

	function bindMq(handler) {
		if (typeof mq.addEventListener === 'function') {
			mq.addEventListener('change', handler);
		} else if (typeof mq.addListener === 'function') {
			mq.addListener(handler);
		}
	}

	bindMq(updateMode);

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', updateMode);
	} else {
		updateMode();
	}
})();
/*! </fs_premium_only> */
