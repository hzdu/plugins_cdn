/**
 * EmbedPress Pro — Google Reviews frontend behaviour.
 *
 * - Copies the data-ep-gr-accent attribute onto the --ep-gr-accent CSS var.
 * - Drives autoplay for the slider preset (.ep-gr--autoplay), pausing on hover
 *   and respecting prefers-reduced-motion.
 *
 * Vanilla JS, no dependencies. Safe to load on every page; it no-ops when no
 * Google Reviews blocks are present.
 */
(function () {
    'use strict';

    function initAccent(root) {
        var accent = root.getAttribute('data-ep-gr-accent');
        if (accent) {
            root.style.setProperty('--ep-gr-accent', accent);
        }
    }

    // Spotlight preset: one full-width centered review at a time. CSS hides the
    // siblings (.ep-gr-review + .ep-gr-review { display:none }); this controller
    // overrides per-card display, builds manual prev/next + dot controls, and —
    // when .ep-gr--autoplay is set — auto-advances on a timer that pauses on
    // hover/focus and after any manual interaction.
    function initSpotlight(root) {
        if (!root.classList.contains('ep-gr--preset-spotlight')) return;

        var track = root.querySelector('.ep-gr-items');
        if (!track) return;
        var items = track.querySelectorAll('.ep-gr-review');
        if (items.length < 2) return; // single review: nothing to navigate

        var idx = 0;

        function show(p) {
            idx = (p + items.length) % items.length;
            for (var i = 0; i < items.length; i++) {
                // Beat the CSS sibling-hide rule with an explicit display.
                items[i].style.setProperty('display', i === idx ? 'block' : 'none', 'important');
            }
            updateDots();
        }

        // ── Controls (arrows + dots), built once. ──────────────────────────
        var prev = document.createElement('button');
        prev.type = 'button';
        prev.className = 'ep-gr-carousel-arrow ep-gr-carousel-prev';
        prev.setAttribute('aria-label', 'Previous review');
        prev.innerHTML = '‹';
        var next = document.createElement('button');
        next.type = 'button';
        next.className = 'ep-gr-carousel-arrow ep-gr-carousel-next';
        next.setAttribute('aria-label', 'Next review');
        next.innerHTML = '›';
        prev.addEventListener('click', function () { show(idx - 1); stopAuto(); });
        next.addEventListener('click', function () { show(idx + 1); stopAuto(); });
        root.appendChild(prev);
        root.appendChild(next);

        var dotsWrap = document.createElement('div');
        dotsWrap.className = 'ep-gr-carousel-dots';
        for (var d = 0; d < items.length; d++) {
            (function (di) {
                var dot = document.createElement('button');
                dot.type = 'button';
                dot.className = 'ep-gr-carousel-dot';
                dot.setAttribute('aria-label', 'Go to review ' + (di + 1));
                dot.addEventListener('click', function () { show(di); stopAuto(); });
                dotsWrap.appendChild(dot);
            })(d);
        }
        root.appendChild(dotsWrap);
        function updateDots() {
            var dots = dotsWrap.children;
            for (var i = 0; i < dots.length; i++) {
                dots[i].classList.toggle('is-active', i === idx);
            }
        }

        // ── Autoplay (opt-in, reduced-motion aware). ───────────────────────
        var timer = null;
        // Autoplay via the free data attr (data-ep-gr-autoplay) or the Pro class.
        var autoplay = (root.getAttribute('data-ep-gr-autoplay') === '1' || root.classList.contains('ep-gr--autoplay')) &&
            !(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
        // Interval from data-ep-gr-speed (seconds), clamped 1–30s; default 4s.
        var spotSpeed = parseFloat(root.getAttribute('data-ep-gr-speed'));
        spotSpeed = (spotSpeed ? Math.min(30, Math.max(1, spotSpeed)) : 4) * 1000;
        function startAuto() {
            if (!autoplay) return;
            stopAuto();
            timer = window.setInterval(function () { show(idx + 1); }, spotSpeed);
        }
        function stopAuto() {
            if (timer) { window.clearInterval(timer); timer = null; }
        }
        root.addEventListener('mouseenter', stopAuto);
        root.addEventListener('mouseleave', startAuto);
        root.addEventListener('focusin', stopAuto);
        root.addEventListener('focusout', startAuto);

        // Lock the track to the TALLEST review so the container never resizes as
        // you navigate between short and long reviews (the page used to jump).
        // Measure each card's natural height (briefly making it visible but not
        // painted), take the max, and pin it as the track's min-height.
        function lockHeight() {
            var max = 0;
            for (var i = 0; i < items.length; i++) {
                var prevDisplay = items[i].style.display;
                items[i].style.setProperty('display', 'block', 'important');
                var h = items[i].offsetHeight;
                if (h > max) max = h;
                items[i].style.display = prevDisplay;
            }
            if (max > 0) track.style.minHeight = max + 'px';
        }
        lockHeight();
        // Re-measure on resize (column width changes → text reflows → new max).
        if (window.addEventListener) {
            var rT = null;
            window.addEventListener('resize', function () {
                if (rT) window.clearTimeout(rT);
                rT = window.setTimeout(function () { track.style.minHeight = ''; lockHeight(); }, 150);
            });
        }

        show(0);
        startAuto();
    }

    // Marquee preset: a continuously scrolling ribbon. The CSS animates the
    // track by -50%, so we duplicate the card set once — at the halfway point
    // the clone sits exactly where the original started, making the loop
    // seamless. Duration scales with content width for a steady ~80px/s speed.
    function initMarquee(root) {
        if (!root.classList.contains('ep-gr--preset-marquee')) return;
        if (root.dataset.epGrMarquee === '1') return;
        var track = root.querySelector('.ep-gr-items');
        if (!track) return;
        var originals = track.querySelectorAll('.ep-gr-review');
        if (originals.length < 2) return; // nothing to scroll
        root.dataset.epGrMarquee = '1';

        for (var i = 0; i < originals.length; i++) {
            var clone = originals[i].cloneNode(true);
            clone.setAttribute('data-ep-gr-clone', '1');
            clone.setAttribute('aria-hidden', 'true');
            track.appendChild(clone);
        }

        // Steady, READABLE base speed regardless of how many reviews: duration =
        // width / pxPerSec. scrollWidth spans both copies; half is one full loop.
        // The data-ep-gr-speed knob is an intuitive 1–10 scale where HIGHER =
        // FASTER (default 4 = calm, readable drift). Mapped linearly to px/sec:
        //   knob 1  → ~12 px/s (very slow)
        //   knob 4  → ~32 px/s (default — comfortable to read)
        //   knob 10 → ~71 px/s (fast but still legible)
        // The old default scrolled at ~80 px/s, which whipped the text past
        // before it could be read.
        var loopWidth = track.scrollWidth / 2;
        var knob = parseFloat(root.getAttribute('data-ep-gr-speed'));
        knob = knob ? Math.min(10, Math.max(1, knob)) : 4;
        var pxPerSec = 6 + knob * 6.5; // 12.5 … 71 px/s across the 1–10 range
        // Clamp duration to a sane band so a huge set never crawls and a tiny one
        // never races: 10s floor, 180s ceiling.
        var duration = Math.min(180, Math.max(10, Math.round(loopWidth / pxPerSec)));
        root.style.setProperty('--ep-gr-marquee-duration', duration + 's');
    }

    function initLoadMore(root) {
        var perPage = parseInt(root.getAttribute('data-ep-gr-per-page'), 10);
        if (!perPage || perPage < 1) return;

        var items = root.querySelectorAll('.ep-gr-review');
        var btnWrap = root.querySelector('.ep-gr-loadmore-wrap');
        var btn = root.querySelector('.ep-gr-loadmore');
        if (!items.length) return;
        // In the editor the SSR markup omits the button (it's a frontend-only
        // control), but pagination should still preview correctly — so we apply
        // the per-page clamp even when there's no button to bind.

        var shown = perPage;
        function apply() {
            for (var i = 0; i < items.length; i++) {
                items[i].style.display = i < shown ? '' : 'none';
            }
            if (btnWrap) btnWrap.style.display = shown >= items.length ? 'none' : '';
        }
        if (btn) {
            btn.addEventListener('click', function () {
                shown += perPage;
                apply();
            });
        }
        apply(); // initial: hide beyond first page
    }

    function init() {
        var roots = document.querySelectorAll('.ep-google-reviews');
        for (var i = 0; i < roots.length; i++) {
            var root = roots[i];
            // Idempotent: SSR re-renders in the editor re-run init; skip roots
            // already wired (the data-ep-gr-init flag), but ALWAYS re-clamp
            // load-more since SSR replaces the markup with a fresh node anyway.
            if (root.getAttribute('data-ep-gr-init') === '1') continue;
            root.setAttribute('data-ep-gr-init', '1');
            initAccent(root);
            initSpotlight(root);
            initMarquee(root);
            initLoadMore(root);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Editor parity: the block is injected by ServerSideRender AFTER load, so
    // re-init when new .ep-google-reviews nodes appear (e.g. Gutenberg preview).
    if (typeof MutationObserver !== 'undefined') {
        var obs = new MutationObserver(function () { init(); });
        if (document.body) {
            obs.observe(document.body, { childList: true, subtree: true });
        } else {
            document.addEventListener('DOMContentLoaded', function () {
                obs.observe(document.body, { childList: true, subtree: true });
            });
        }
    }
})();
