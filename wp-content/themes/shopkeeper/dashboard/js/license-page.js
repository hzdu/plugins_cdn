(function () {
	'use strict';

	var root = document.getElementById('gbt-license-root');
	if (!root || !window.gbtUi) {
		return;
	}

	function copyText(text) {
		if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
			return navigator.clipboard.writeText(text);
		}
		return new Promise(function (resolve, reject) {
			var ta = document.createElement('textarea');
			ta.value = text;
			ta.setAttribute('readonly', '');
			ta.style.cssText = 'position:fixed;left:-9999px;top:0;opacity:0;';
			document.body.appendChild(ta);
			ta.select();
			try {
				if (!document.execCommand('copy')) {
					reject(new Error('copy failed'));
					return;
				}
				resolve();
			} catch (err) {
				reject(err);
			} finally {
				ta.remove();
			}
		});
	}

	function bindKeyReveal() {
		if (root.getAttribute('data-key-reveal') !== '1') {
			return;
		}

		document.querySelectorAll('[data-gbt-key-reveal]').forEach(function (btn) {
			btn.addEventListener('click', function () {
				var revealed = btn.getAttribute('aria-pressed') === 'true';
				var next = !revealed;
				btn.setAttribute('aria-pressed', next ? 'true' : 'false');
				btn.setAttribute('aria-label', next ? 'Hide license key' : 'Reveal license key');
				btn.setAttribute('title', next ? 'Hide license key' : 'Reveal license key');

				var showIcon = btn.querySelector('[data-reveal-show]');
				var hideIcon = btn.querySelector('[data-reveal-hide]');
				if (showIcon) {
					showIcon.classList.toggle('hidden', next);
					showIcon.classList.toggle('inline-flex', !next);
				}
				if (hideIcon) {
					hideIcon.classList.toggle('hidden', !next);
					hideIcon.classList.toggle('inline-flex', next);
				}

				// Table row: open/close a dedicated panel under the row.
				if (btn.hasAttribute('data-gbt-key-expand')) {
					btn.setAttribute('aria-expanded', next ? 'true' : 'false');
					var row = btn.closest('[data-gbt-key-row]');
					var panel = row ? row.querySelector('[data-gbt-key-panel]') : null;
					if (panel) {
						panel.classList.toggle('hidden', !next);
					}
					return;
				}

				// Legacy inline reveal (left column).
				var wrap = btn.closest('div');
				var display = wrap ? wrap.querySelector('[data-gbt-key-display]') : null;
				if (!display) {
					return;
				}
				display.textContent = next ? display.getAttribute('data-full') : display.getAttribute('data-masked');
			});
		});

		document.querySelectorAll('[data-gbt-key-copy]').forEach(function (btn) {
			var resetTimer = null;
			btn.addEventListener('click', function () {
				var panel = btn.closest('[data-gbt-key-panel]');
				var full = panel ? panel.querySelector('[data-gbt-key-full]') : null;
				var text = full ? (full.textContent || '').trim() : '';
				if (!text) {
					return;
				}

				copyText(text).then(function () {
					var idle = btn.querySelector('[data-copy-idle]');
					var done = btn.querySelector('[data-copy-done]');
					if (idle) {
						idle.classList.add('hidden');
						idle.classList.remove('inline-flex');
					}
					if (done) {
						done.classList.remove('hidden');
						done.classList.add('inline-flex');
					}
					btn.setAttribute('aria-label', 'Copied');
					btn.setAttribute('title', 'Copied');
					if (resetTimer) {
						clearTimeout(resetTimer);
					}
					resetTimer = setTimeout(function () {
						if (idle) {
							idle.classList.remove('hidden');
							idle.classList.add('inline-flex');
						}
						if (done) {
							done.classList.add('hidden');
							done.classList.remove('inline-flex');
						}
						btn.setAttribute('aria-label', 'Copy license key');
						btn.setAttribute('title', 'Copy license key');
					}, 1600);
				}).catch(function () {
					/* ignore */
				});
			});
		});
	}

	function bindOverlays() {
		if (root.getAttribute('data-overlays') !== '1') {
			return;
		}

		var main = document.getElementById('gbt-license-main');
		var side = document.getElementById('gbt-license-side');
		var emailOverlay = document.getElementById('gbt-tf-email-overlay');
		var whyOverlay = document.getElementById('gbt-conversion-why-overlay');
		var howtoOverlay = document.getElementById('gbt-conversion-howto-overlay');
		var whyOpeners = document.querySelectorAll('[data-gbt-why-open]');
		var howtoOpeners = document.querySelectorAll('[data-gbt-howto-open]');
		if (!main || !side) {
			return;
		}

		var lastFocus = null;
		var useEmailBase = !!(emailOverlay && emailOverlay.hasAttribute('data-gbt-convert-base'));

		function hideOverlay(overlay) {
			if (!overlay) {
				return;
			}
			overlay.classList.add('hidden');
			overlay.classList.remove('flex');
			overlay.setAttribute('aria-hidden', 'true');
		}

		function setWhyExpanded(expanded) {
			whyOpeners.forEach(function (el) {
				el.setAttribute('aria-expanded', expanded ? 'true' : 'false');
			});
		}

		function setHowtoExpanded(expanded) {
			howtoOpeners.forEach(function (el) {
				el.setAttribute('aria-expanded', expanded ? 'true' : 'false');
			});
		}

		function showOverlay(overlay) {
			lastFocus = document.activeElement;
			hideOverlay(whyOverlay);
			hideOverlay(howtoOverlay);
			if (emailOverlay) {
				hideOverlay(emailOverlay);
			}
			main.classList.add('hidden');
			side.classList.add('hidden');
			overlay.classList.remove('hidden');
			overlay.classList.add('flex');
			overlay.setAttribute('aria-hidden', 'false');
			var closeBtn = overlay.querySelector('[data-gbt-overlay-dismiss]');
			if (closeBtn) {
				closeBtn.focus();
			}
		}

		function restoreMain() {
			hideOverlay(whyOverlay);
			hideOverlay(howtoOverlay);
			if (emailOverlay) {
				hideOverlay(emailOverlay);
			}
			setWhyExpanded(false);
			setHowtoExpanded(false);
			main.classList.remove('hidden');
			side.classList.remove('hidden');
			if (lastFocus && typeof lastFocus.focus === 'function') {
				lastFocus.focus();
			}
		}

		function restoreConvert() {
			hideOverlay(whyOverlay);
			hideOverlay(howtoOverlay);
			setWhyExpanded(false);
			setHowtoExpanded(false);

			if (useEmailBase && emailOverlay) {
				main.classList.add('hidden');
				side.classList.add('hidden');
				emailOverlay.classList.remove('hidden');
				emailOverlay.classList.add('flex');
				emailOverlay.setAttribute('aria-hidden', 'false');
			} else {
				restoreMain();
				return;
			}

			if (lastFocus && typeof lastFocus.focus === 'function') {
				lastFocus.focus();
			}
		}

		document.querySelectorAll('[data-gbt-overlay-dismiss], [data-gbt-email-close]').forEach(function (el) {
			el.addEventListener('click', function () {
				lastFocus = document.activeElement;
				restoreMain();
			});
		});

		document.querySelectorAll('[data-gbt-back-to-convert]').forEach(function (el) {
			el.addEventListener('click', restoreConvert);
		});

		whyOpeners.forEach(function (opener) {
			opener.addEventListener('click', function () {
				setWhyExpanded(true);
				setHowtoExpanded(false);
				showOverlay(whyOverlay);
			});
		});

		howtoOpeners.forEach(function (opener) {
			opener.addEventListener('click', function () {
				setHowtoExpanded(true);
				setWhyExpanded(false);
				showOverlay(howtoOverlay);
			});
		});

		document.addEventListener('keydown', function (e) {
			if (e.key !== 'Escape') {
				return;
			}
			if (
				(whyOverlay && !whyOverlay.classList.contains('hidden')) ||
				(howtoOverlay && !howtoOverlay.classList.contains('hidden')) ||
				(emailOverlay && !emailOverlay.classList.contains('hidden'))
			) {
				restoreMain();
			}
		});
	}

	function runConfetti() {
		if (root.getAttribute('data-confetti') !== '1') {
			return;
		}
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
			return;
		}

		var colors = ['#00a32a', '#72aee6', '#2271b1', '#f0c930', '#ffffff', '#68de7c'];
		var canvas = document.createElement('canvas');
		canvas.setAttribute('aria-hidden', 'true');
		canvas.style.cssText = 'position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:100000;';
		document.body.appendChild(canvas);

		var ctx = canvas.getContext('2d');
		if (!ctx) {
			canvas.remove();
			return;
		}

		var dpr = Math.max(1, window.devicePixelRatio || 1);
		var W = 0;
		var H = 0;
		var pieces = [];
		var start = performance.now();
		var duration = 3200;

		function resize() {
			W = window.innerWidth;
			H = window.innerHeight;
			canvas.width = Math.floor(W * dpr);
			canvas.height = Math.floor(H * dpr);
			canvas.style.width = W + 'px';
			canvas.style.height = H + 'px';
			ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
		}

		function spawn(ox, oy, count, power) {
			for (var i = 0; i < count; i++) {
				var angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.6;
				var speed = power * (0.55 + Math.random() * 0.7);
				pieces.push({
					x: ox,
					y: oy,
					vx: Math.cos(angle) * speed,
					vy: Math.sin(angle) * speed - power * 0.35,
					w: 6 + Math.random() * 6,
					h: 8 + Math.random() * 10,
					color: colors[(Math.random() * colors.length) | 0],
					rot: Math.random() * Math.PI * 2,
					vr: (Math.random() - 0.5) * 0.35,
					gravity: 0.12 + Math.random() * 0.08,
					drag: 0.985 + Math.random() * 0.01,
					opacity: 1,
				});
			}
		}

		function frame(now) {
			var t = now - start;
			ctx.clearRect(0, 0, W, H);

			for (var i = pieces.length - 1; i >= 0; i--) {
				var p = pieces[i];
				p.vx *= p.drag;
				p.vy = p.vy * p.drag + p.gravity;
				p.x += p.vx;
				p.y += p.vy;
				p.rot += p.vr;
				if (t > duration * 0.55) {
					p.opacity = Math.max(0, 1 - (t - duration * 0.55) / (duration * 0.45));
				}

				ctx.save();
				ctx.translate(p.x, p.y);
				ctx.rotate(p.rot);
				ctx.globalAlpha = p.opacity;
				ctx.fillStyle = p.color;
				ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
				ctx.restore();
			}

			if (t < duration) {
				requestAnimationFrame(frame);
			} else {
				window.removeEventListener('resize', resize);
				canvas.remove();
			}
		}

		resize();
		window.addEventListener('resize', resize);

		var cx = W * 0.5;
		var cy = Math.min(H * 0.38, 320);
		spawn(cx, cy, 90, 11);
		setTimeout(function () {
			spawn(W * 0.22, cy + 40, 45, 9);
		}, 180);
		setTimeout(function () {
			spawn(W * 0.78, cy + 40, 45, 9);
		}, 280);

		requestAnimationFrame(frame);
	}

	window.gbtUi.bindBusySubmit(document);
	bindKeyReveal();
	bindOverlays();
	runConfetti();
})();
