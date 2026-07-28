/**
 * EmbedPress — Google Reviews (free) frontend behaviour.
 *
 * Read-more toggle: the review text is line-clamped via CSS; this reveals the
 * "Read more" button ONLY when the text actually overflows, and toggles the
 * expanded state on click. Rating-only / short reviews never get a button.
 *
 * Vanilla JS, no dependencies. Idempotent and re-runnable: the block is injected
 * by ServerSideRender in the editor AFTER load, so a MutationObserver re-inits
 * newly-added review cards. Uses a distinct init flag from the Pro script so the
 * two never double-bind the same node.
 */
(function () {
    'use strict';

    var INIT_FLAG = 'epGrRmInit';

    function initCard(card) {
        if (card.dataset[INIT_FLAG] === '1') return;
        var text = card.querySelector('.ep-gr-text');
        var btn = card.querySelector('.ep-gr-readmore');
        if (!text || !btn) return;
        card.dataset[INIT_FLAG] = '1';

        // Show the toggle only when the (clamped) text overflows.
        var overflows = text.scrollHeight - text.clientHeight > 2;
        if (!overflows) {
            btn.hidden = true;
            return;
        }
        btn.hidden = false;
        btn.addEventListener('click', function () {
            var expanded = card.classList.toggle('is-expanded');
            btn.setAttribute('aria-expanded', expanded ? 'true' : 'false');
        });
    }

    function init(root) {
        var scope = root && root.querySelectorAll ? root : document;
        var cards = scope.querySelectorAll('.ep-gr-body');
        for (var i = 0; i < cards.length; i++) {
            initCard(cards[i]);
        }
        var carousels = scope.querySelectorAll('.ep-google-reviews--carousel');
        for (var c = 0; c < carousels.length; c++) {
            initCarousel(carousels[c]);
        }
        var roots = scope.querySelectorAll('.ep-google-reviews[data-ep-gr-loadmore]');
        for (var m = 0; m < roots.length; m++) {
            initLoadMore(roots[m]);
        }
        var loaders = scope.querySelectorAll('.ep-google-reviews--loading[data-ep-gr-poll]');
        for (var p = 0; p < loaders.length; p++) {
            initPoller(loaders[p]);
        }
    }

    /**
     * Frontend "still fetching" self-refresh. A freshly-added place whose reviews
     * aren't fetched yet renders the .ep-google-reviews--loading placeholder
     * (see GoogleReviewsRenderer::render_loading) carrying the place_id + the
     * public status endpoint URL. We poll that endpoint; the moment the
     * background job is done WITH reviews, we reload the page once so the server
     * re-renders the real review cards in place — no manual refresh. On
     * failed / done-empty we simply stop polling (the placeholder stays as-is;
     * for visitors a failed fetch renders nothing at all server-side).
     *
     * The poll endpoint ALSO advances the job server-side (WP-cron is unreliable
     * on quiet pages), so polling is what actually drives the fetch to completion
     * for the first visitor who lands on the page.
     */
    function initPoller(root) {
        if (root.dataset.epGrPollInit === '1') return;
        var placeId = root.getAttribute('data-ep-gr-poll');
        var url = root.getAttribute('data-ep-gr-poll-url');
        if (!placeId || !url) return;
        root.dataset.epGrPollInit = '1';

        var interval = parseInt(root.getAttribute('data-ep-gr-poll-interval'), 10) || 5000;
        // Stop after a generous ceiling so a wedged job can't poll forever
        // (a big place can scrape for a few minutes; 10 min is a safe cap).
        var deadline = Date.now() + 10 * 60 * 1000;

        function tick() {
            if (Date.now() > deadline) return; // give up quietly
            var u = url + (url.indexOf('?') === -1 ? '?' : '&') + 'place_id=' + encodeURIComponent(placeId);
            fetch(u, { headers: { Accept: 'application/json' } })
                .then(function (r) { return r.json(); })
                .then(function (res) {
                    if (!res) { window.setTimeout(tick, interval); return; }
                    if (res.ready) {
                        // Done (or failed). Reload only when reviews actually
                        // landed, so the server renders them in place. On
                        // failed / 0-reviews, stop — nothing to show.
                        if ((res.review_count || 0) > 0) {
                            window.location.reload();
                        }
                        return; // stop polling either way
                    }
                    window.setTimeout(tick, interval); // still running/queued
                })
                .catch(function () { window.setTimeout(tick, interval); });
        }

        window.setTimeout(tick, interval);
    }

    /**
     * "Load more" (FREE, AJAX): the server renders the first page and stamps a
     * config blob on data-ep-gr-loadmore. On click we fetch the next page of
     * rendered cards from the REST endpoint, append them, advance the offset, and
     * hide the button when the server reports no more.
     */
    function initLoadMore(root) {
        if (root.dataset.epGrLoadmoreInit === '1') return;
        var cfg;
        try { cfg = JSON.parse(root.getAttribute('data-ep-gr-loadmore') || '{}'); }
        catch (e) { return; }
        if (!cfg || !cfg.rest || !cfg.place_id) return;

        var btn = root.querySelector('.ep-gr-loadmore');
        var wrap = root.querySelector('.ep-gr-loadmore-wrap');
        var items = root.querySelector('.ep-gr-items');
        if (!btn || !items) return;
        root.dataset.epGrLoadmoreInit = '1';

        var offset = parseInt(cfg.offset, 10) || 0;
        var loading = false;

        btn.addEventListener('click', function () {
            if (loading) return;
            loading = true;
            btn.classList.add('is-loading');
            btn.disabled = true;

            var params = ['place_id=' + encodeURIComponent(cfg.place_id),
                'offset=' + offset,
                'per_page=' + (parseInt(cfg.per_page, 10) || 5)];
            var q = cfg.query || {};
            for (var k in q) {
                if (!Object.prototype.hasOwnProperty.call(q, k)) continue;
                var v = q[k];
                if (Array.isArray(v)) {
                    for (var i = 0; i < v.length; i++) {
                        params.push(encodeURIComponent(k + '[]') + '=' + encodeURIComponent(v[i]));
                    }
                } else {
                    params.push(encodeURIComponent(k) + '=' + encodeURIComponent(v));
                }
            }
            var url = cfg.rest + (cfg.rest.indexOf('?') === -1 ? '?' : '&') + params.join('&');

            fetch(url, { headers: { Accept: 'application/json' } })
                .then(function (r) { return r.json(); })
                .then(function (res) {
                    if (res && res.html) {
                        items.insertAdjacentHTML('beforeend', res.html);
                        init(root); // wire read-more on the new cards
                    }
                    if (res && typeof res.next_offset === 'number') offset = res.next_offset;
                    if (!res || !res.has_more) {
                        if (wrap) { wrap.style.display = 'none'; } else { btn.style.display = 'none'; }
                    }
                })
                .catch(function () { /* leave button for retry */ })
                .then(function () {
                    loading = false;
                    btn.classList.remove('is-loading');
                    btn.disabled = false;
                });
        });
    }

    /**
     * Real carousel: arrows + dots + autoplay, sliding one "page" at a time.
     * Page size = how many cards fit the viewport (1 or 2, matching the CSS
     * flex-basis breakpoint). Idempotent via data flag; rebuilds controls if the
     * editor re-renders.
     */
    function initCarousel(root) {
        if (root.dataset.epGrCarousel === '1') return;
        var track = root.querySelector('.ep-gr-items');
        if (!track) return;
        var items = track.querySelectorAll('.ep-gr-review');
        if (items.length < 2) return; // nothing to slide
        root.dataset.epGrCarousel = '1';

        // The track is the element we translate, so it must NOT be the one that
        // clips overflow — a clip box on the moving element travels with it, so
        // after translateX(-100%) the next page lands outside its own clip and
        // shows blank (the "empty next" bug). Wrap the track in a stationary
        // viewport that owns overflow:hidden. Idempotent across re-inits.
        var viewport = track.parentNode;
        if (!viewport || !viewport.classList || !viewport.classList.contains('ep-gr-viewport')) {
            viewport = document.createElement('div');
            viewport.className = 'ep-gr-viewport';
            track.parentNode.insertBefore(viewport, track);
            viewport.appendChild(track);
        }

        function perView() {
            // Derive from the first card's rendered width vs the viewport width.
            // Use the viewport (stationary, clips) not the track (sized to its
            // 17-card content) so the ratio reflects what's actually on screen.
            var tw = viewport.clientWidth || track.clientWidth || 1;
            var cw = items[0].getBoundingClientRect().width || tw;
            return Math.max(1, Math.round(tw / cw));
        }

        var pv = perView();
        var realPages = Math.max(1, Math.ceil(items.length / pv));

        // ── Seamless infinite loop ────────────────────────────────────────
        // Clone the first page's cards and append them as a phantom page. We
        // animate forward into the phantom, then — once the slide finishes —
        // silently snap (transition off) back to the real page 0. The viewer
        // never sees the reset, so it reads as a continuous, never-ending loop.
        // Seamless infinite loop unless explicitly disabled (data-ep-gr-loop="0").
        var loopEnabled = root.getAttribute('data-ep-gr-loop') !== '0';
        var loop = loopEnabled && realPages > 1;
        if (loop && root.dataset.epGrCloned !== '1') {
            for (var ci = 0; ci < pv && ci < items.length; ci++) {
                var clone = items[ci].cloneNode(true);
                clone.setAttribute('data-ep-gr-clone', '1');
                clone.setAttribute('aria-hidden', 'true');
                track.appendChild(clone);
            }
            root.dataset.epGrCloned = '1';
        }

        // FIXED height for the whole carousel — the tallest card across the set,
        // capped. A fixed box means the cards/dots/everything below never jump
        // up and down as you slide (the per-page approach caused that). With the
        // carousel text clamped to 3 lines in CSS, the tallest "normal" card is
        // modest, so this fixed height is also compact (no giant empty box). The
        // cap guards against a rare photo-heavy outlier. Computed once.
        function fitHeight() {
            var max = 0;
            for (var i = 0; i < items.length; i++) {
                var h = items[i].offsetHeight;
                if (h > max) max = h;
            }
            // Cap to a typical clamped-card height. With text limited to 3 lines
            // the normal tallest card fits well under this; a rare photo-heavy
            // card is clipped by the viewport rather than ballooning the whole
            // slider into a tall empty box for every other page.
            if (max > 340) max = 340;
            if (max > 0) viewport.style.setProperty('height', max + 'px', 'important');
        }

        var page = 0;          // logical page, 0..realPages-1
        var slot = 0;          // physical slot, 0..realPages (realPages == clone)
        var animating = false;

        function paint(animate) {
            var offset = -(slot * 100);
            track.style.setProperty('transition', animate ? 'transform 0.45s ease' : 'none', 'important');
            // Use !important so the widget's transform reset (style isolation)
            // can't cancel the slide.
            track.style.setProperty('transform', 'translateX(' + offset + '%)', 'important');
            updateDots();
        }

        function go(target) {
            if (animating) return;
            if (!loop) {
                page = (target + realPages) % realPages;
                slot = page;
                paint(true);
                return;
            }
            // Forward into clone (target == realPages) animates, then resets.
            if (target >= realPages) {
                animating = true;
                slot = realPages; page = 0;
                paint(true);
                afterSlide(function () { slot = 0; paint(false); animating = false; });
            } else if (target < 0) {
                // Going back from page 0: jump to the clone position first
                // (no anim), then animate to the last real page.
                slot = realPages; paint(false);
                // force reflow so the next transform animates from the clone
                void track.offsetWidth;
                animating = true;
                page = realPages - 1; slot = page;
                paint(true);
                afterSlide(function () { animating = false; });
            } else {
                page = target; slot = target;
                paint(true);
            }
        }

        // Run cb once after the current transform transition ends (with a
        // timeout fallback so a missed transitionend never wedges the carousel).
        function afterSlide(cb) {
            var done = false;
            function fire() { if (done) return; done = true; track.removeEventListener('transitionend', onEnd); cb(); }
            function onEnd(e) { if (e.propertyName === 'transform') fire(); }
            track.addEventListener('transitionend', onEnd);
            window.setTimeout(fire, 600);
        }

        // Controls
        var prev = document.createElement('button');
        prev.type = 'button';
        prev.className = 'ep-gr-carousel-arrow ep-gr-carousel-prev';
        prev.setAttribute('aria-label', 'Previous');
        prev.innerHTML = '‹';
        var next = document.createElement('button');
        next.type = 'button';
        next.className = 'ep-gr-carousel-arrow ep-gr-carousel-next';
        next.setAttribute('aria-label', 'Next');
        next.innerHTML = '›';
        prev.addEventListener('click', function () { go(page - 1); stopAuto(); });
        next.addEventListener('click', function () { go(page + 1); stopAuto(); });
        // Show arrows unless explicitly disabled (data-ep-gr-arrows="0").
        var showArrows = root.getAttribute('data-ep-gr-arrows') !== '0';
        if (showArrows) {
            root.appendChild(prev);
            root.appendChild(next);
        }

        var dotsWrap = document.createElement('div');
        dotsWrap.className = 'ep-gr-carousel-dots';
        // Show dots unless explicitly disabled (data-ep-gr-dots="0").
        var showDots = root.getAttribute('data-ep-gr-dots') !== '0';
        if (showDots) {
            root.appendChild(dotsWrap);
        }
        function buildDots() {
            dotsWrap.innerHTML = '';
            for (var i = 0; i < realPages; i++) {
                (function (idx) {
                    var d = document.createElement('button');
                    d.type = 'button';
                    d.className = 'ep-gr-carousel-dot';
                    d.setAttribute('aria-label', 'Go to slide ' + (idx + 1));
                    d.addEventListener('click', function () { go(idx); stopAuto(); });
                    dotsWrap.appendChild(d);
                })(i);
            }
        }
        function updateDots() {
            var dots = dotsWrap.children;
            for (var i = 0; i < dots.length; i++) {
                dots[i].classList.toggle('is-active', i === page);
            }
        }

        // Autoplay (opt-in via data-ep-gr-autoplay; pauses on hover). Interval
        // from data-ep-gr-speed (seconds), clamped to a sane 1–30s band.
        var timer = null;
        var autoplay = root.getAttribute('data-ep-gr-autoplay') === '1';
        var speed = parseFloat(root.getAttribute('data-ep-gr-speed')) || 5;
        speed = Math.min(30, Math.max(1, speed)) * 1000;
        function startAuto() {
            if (!autoplay) return;
            if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
            stopAuto();
            timer = window.setInterval(function () { go(page + 1); }, speed);
        }
        function stopAuto() { if (timer) { window.clearInterval(timer); timer = null; } }
        root.addEventListener('mouseenter', stopAuto);
        root.addEventListener('mouseleave', startAuto);

        buildDots();
        fitHeight();
        paint(false);
        startAuto();

        // Rebuild on resize (perView may change between 1 and 2). pv/realPages
        // are captured at init; if perView changes we re-fit height and re-clamp
        // to a valid page so the box and dots stay correct.
        var rt;
        window.addEventListener('resize', function () {
            window.clearTimeout(rt);
            rt = window.setTimeout(function () {
                fitHeight();
                if (page > realPages - 1) page = realPages - 1;
                slot = page;
                paint(false);
            }, 200);
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function () { init(document); });
    } else {
        init(document);
    }

    // Editor parity: re-init when SSR injects fresh review markup.
    if (typeof MutationObserver !== 'undefined') {
        var obs = new MutationObserver(function (muts) {
            for (var i = 0; i < muts.length; i++) {
                if (muts[i].addedNodes && muts[i].addedNodes.length) {
                    init(document);
                    break;
                }
            }
        });
        var start = function () {
            if (document.body) obs.observe(document.body, { childList: true, subtree: true });
        };
        if (document.body) start();
        else document.addEventListener('DOMContentLoaded', start);
    }
})();
