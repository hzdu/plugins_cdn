/**
 * EmbedPress — public-facing view + download count badge for PDF/Document.
 *
 * Discovers wrappers carrying [data-embed-type="PDF"|"Document"] across
 * Gutenberg blocks, [embedpress] shortcode, and Elementor widgets. Renders
 * a single inline badge that reads
 *
 *      👁 N views   ⤓ M downloads
 *
 * Views are self-recorded on first paint (session-deduped server-side).
 * Downloads are recorded when the bundled PDF.js viewer posts a
 * {source:'embedpress-pdf-viewer', type:'download'} message from inside its
 * iframe — i.e., when the visitor clicks Save/Download/Open from the PDF.js
 * toolbar. There is intentionally NO external download button.
 */
(function () {
    'use strict';

    var cfg = window.embedpressViewCount || {};
    if (!cfg.restUrl || !cfg.types || !cfg.types.length) {
        return;
    }

    var processed = new WeakSet();
    var SESSION_COOKIE = 'ep_vc_session';
    // contentId -> wrapper element, so postMessage receivers can find the
    // badge they need to update.
    var contentIdIndex = Object.create(null);

    function ensureSessionId() {
        var m = document.cookie.match(/(?:^|;\s*)ep_vc_session=([^;]+)/);
        if (m) return decodeURIComponent(m[1]);
        var tm = document.cookie.match(/(?:^|;\s*)ep_session_id=([^;]+)/);
        var sid = tm ? decodeURIComponent(tm[1]) : ('ep-vc-' + Date.now() + '-' + Math.random().toString(36).slice(2, 10));
        document.cookie = SESSION_COOKIE + '=' + encodeURIComponent(sid) + '; path=/; max-age=86400; samesite=lax';
        return sid;
    }
    var sessionId = ensureSessionId();

    function getEmbedUrl(el) {
        var iframe = el.tagName === 'IFRAME' ? el : el.querySelector('iframe');
        var src = iframe && iframe.getAttribute('src');
        if (src) {
            try {
                var u = new URL(src, window.location.href);
                var fileParam = u.searchParams.get('file');
                if (fileParam) return decodeURIComponent(fileParam);
            } catch (e) { /* fall through */ }
            return src;
        }
        return el.getAttribute('data-embed-url')
            || el.getAttribute('data-url')
            || el.getAttribute('data-src')
            || el.getAttribute('href')
            || '';
    }

    // A source-id is only usable if it actually identifies the embed. Blocks
    // render data-source-id={`source-${clientId}`}; when clientId was undefined
    // at save time that becomes the literal "source-undefined", which is shared
    // by EVERY such embed — collapsing their counts into one ever-growing tally.
    // Reject that (and any blank) so we fall back to a per-instance id instead.
    function isUsableId(v) {
        return !!v && v !== 'source-undefined' && v !== 'undefined' && v !== 'source-' && v !== 'source-null';
    }

    // Deterministic index of `el` among all embeds that resolve to the SAME
    // url-hash, in DOCUMENT order. This must NOT depend on processing order:
    // the flipbook and modern viewers load asynchronously, so a process-order
    // counter would assign a different suffix to the same embed across reloads
    // — splitting its count and making it look like counting "stopped". DOM
    // order is fixed by the saved post content, so this is stable per instance.
    function sameHashIndex(el, hash) {
        var nodes = document.querySelectorAll('[data-embed-type]');
        var idx = 0;
        for (var i = 0; i < nodes.length; i++) {
            // Skip nested embeds (handled by their own outer wrapper).
            if (nodes[i].parentElement && nodes[i].parentElement.closest('[data-embed-type]')) continue;
            if (urlHash(getEmbedUrl(nodes[i])) !== hash) continue;
            if (nodes[i] === el) return idx;
            idx++;
        }
        return idx;
    }

    // Distinctive hash over the FULL url. A previous version base64-encoded the
    // url and kept the first 10 chars — but every "https://…" base64 starts with
    // the same "aHR0cHM6Ly" prefix, so different files collapsed to one hash and
    // then fought over a per-instance suffix. A djb2-style hash of the whole
    // string keeps distinct files distinct.
    function urlHash(url) {
        url = String(url || '');
        var h = 5381;
        for (var i = 0; i < url.length; i++) {
            h = ((h << 5) + h + url.charCodeAt(i)) >>> 0; // h * 33 + c, unsigned
        }
        return h.toString(36);
    }

    function deriveContentId(el, embedType) {
        var stored = el.getAttribute('data-embedpress-content');
        if (isUsableId(stored)) return stored;

        var existing = el.getAttribute('data-source-id') || el.getAttribute('data-emid');
        if (isUsableId(existing)) {
            el.setAttribute('data-embedpress-content', existing);
            return existing;
        }

        // No usable saved id (e.g. "source-undefined"): build a stable id from
        // the file URL + this embed's DOCUMENT-ORDER index among same-file
        // embeds, so multiple embeds of the same file are counted separately
        // AND each keeps the same id across reloads.
        var url = getEmbedUrl(el);
        var hash = urlHash(url);
        var contentId = 'ep-' + embedType + '-' + hash + '-' + sameHashIndex(el, hash);
        el.setAttribute('data-embedpress-content', contentId);
        return contentId;
    }

    function fmt(n, key, fallback) {
        var template = (cfg.labels && cfg.labels[key]) || fallback;
        return template.replace('%s', n.toLocaleString());
    }
    function formatViews(n) { return fmt(n, n === 1 ? 'singular' : 'plural', '%s views'); }
    function formatDownloads(n) { return fmt(n, n === 1 ? 'downloadSingular' : 'downloadPlural', '%s downloads'); }

    function buildBadge() {
        var wrapper = document.createElement('div');
        wrapper.className = 'ep-view-count';
        wrapper.innerHTML =
            '<span class="ep-view-count__item ep-view-count__item--views" hidden>' +
                '<svg class="ep-view-count__icon" width="14" height="14" viewBox="0 0 24 24" ' +
                'fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" ' +
                'stroke-linejoin="round" aria-hidden="true">' +
                '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z"/>' +
                '<circle cx="12" cy="12" r="3"/>' +
                '</svg>' +
                '<span class="ep-view-count__label" data-views></span>' +
            '</span>' +
            '<span class="ep-view-count__sep" hidden></span>' +
            '<span class="ep-view-count__item ep-view-count__item--downloads" hidden>' +
                '<svg class="ep-view-count__icon" width="14" height="14" viewBox="0 0 24 24" ' +
                'fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" ' +
                'stroke-linejoin="round" aria-hidden="true">' +
                '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>' +
                '<polyline points="7 10 12 15 17 10"/>' +
                '<line x1="12" y1="15" x2="12" y2="3"/>' +
                '</svg>' +
                '<span class="ep-view-count__label" data-downloads></span>' +
            '</span>';
        return wrapper;
    }

    // Resolve the effective badge position. Positioning is a Pro feature —
    // only the default 'below' is free. When Pro is inactive, any non-default
    // position falls back to 'below' (and 'above' insert reverts to after).
    function resolvePosition(el) {
        var pos = el.getAttribute('data-ep-count-position');
        if (!pos || pos === 'below') return 'below';
        if (!cfg.isPro) return 'below';
        return pos;
    }

    // The badge always sits OUTSIDE the embed (never overlaying it). Position
    // only decides which side — 'above-*' inserts before the embed, otherwise
    // after — and the CSS modifier class handles horizontal alignment.
    function isAbove(el) {
        return resolvePosition(el).indexOf('above') === 0;
    }

    function placeBadge(el, node) {
        var above = isAbove(el);
        if (el.tagName === 'IFRAME') {
            if (!el.parentNode) return;
            // 'above' goes before the iframe; 'below' goes after it, but still
            // before a trailing "Powered By EmbedPress" line so the count
            // always sits above the branding.
            var ref = above ? el : el.nextSibling;
            if (!above) {
                var sib = el.nextElementSibling;
                while (sib) {
                    if (sib.classList && sib.classList.contains('embedpress-el-powered')) { ref = sib; break; }
                    sib = sib.nextElementSibling;
                }
            }
            el.parentNode.insertBefore(node, ref);
        } else if (above) {
            el.insertBefore(node, el.firstChild);
        } else {
            // Keep the badge above any "Powered By EmbedPress" branding.
            var powered = el.querySelector(':scope > .embedpress-el-powered')
                || el.querySelector('.embedpress-el-powered');
            if (powered && powered.parentNode) {
                powered.parentNode.insertBefore(node, powered);
            } else {
                el.appendChild(node);
            }
        }
    }

    // Apply the per-embed alignment/side class. 'below' keeps the original
    // placement, so no class is added.
    function applyPosition(el, badge) {
        var pos = resolvePosition(el);
        if (pos === 'below') return;
        badge.classList.add('ep-view-count--pos-' + pos);
    }

    function findExistingBadge(el) {
        if (el.tagName === 'IFRAME') {
            var sibs = [el.previousElementSibling, el.nextElementSibling];
            for (var i = 0; i < sibs.length; i++) {
                var s = sibs[i];
                if (s && s.classList && s.classList.contains('ep-view-count')) return s;
            }
            return null;
        }
        // The badge may be nested (e.g. inserted before a deeper
        // ".embedpress-el-powered" branding line), so search descendants — but
        // ignore any badge that belongs to a NESTED embed wrapper so we don't
        // mistake a child embed's badge for this one's.
        var candidates = el.querySelectorAll('.ep-view-count');
        for (var j = 0; j < candidates.length; j++) {
            var c = candidates[j];
            var owner = c.closest('[data-embed-type]');
            if (owner === el) return c;
        }
        return null;
    }

    function ensureBadgeFor(el) {
        var existing = findExistingBadge(el);
        if (existing) return existing;
        var badge = buildBadge();
        placeBadge(el, badge);
        applyPosition(el, badge);
        return badge;
    }

    function setViewCount(el, count) {
        var badge = ensureBadgeFor(el);
        var item = badge.querySelector('.ep-view-count__item--views');
        item.hidden = false;
        item.querySelector('[data-views]').textContent = formatViews(count);
        el.setAttribute('data-ep-view-count', String(count));
        syncSeparator(badge);
    }

    function setDownloadCount(el, count) {
        var badge = ensureBadgeFor(el);
        var item = badge.querySelector('.ep-view-count__item--downloads');
        item.hidden = false;
        item.querySelector('[data-downloads]').textContent = formatDownloads(count);
        el.setAttribute('data-ep-download-count', String(count));
        syncSeparator(badge);
    }

    function syncSeparator(badge) {
        var v = badge.querySelector('.ep-view-count__item--views');
        var d = badge.querySelector('.ep-view-count__item--downloads');
        var sep = badge.querySelector('.ep-view-count__sep');
        sep.hidden = v.hidden || d.hidden;
        if (!sep.hidden) sep.textContent = '·';
    }

    function postForm(url, params) {
        var body = new URLSearchParams();
        Object.keys(params).forEach(function (k) {
            if (params[k] != null && params[k] !== '') body.set(k, params[k]);
        });
        return fetch(url, {
            method: 'POST',
            credentials: 'same-origin',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: body.toString()
        })
            .then(function (r) { return r.ok ? r.json() : null; })
            .then(function (j) { return j && typeof j.count === 'number' ? j.count : null; })
            .catch(function () { return null; });
    }
    function getJson(url, query) {
        var sep = url.indexOf('?') === -1 ? '?' : '&';
        var full = url + sep + 'content_id=' + encodeURIComponent(query);
        return fetch(full, { credentials: 'same-origin' })
            .then(function (r) { return r.ok ? r.json() : null; })
            .then(function (j) { return j && typeof j.count === 'number' ? j.count : null; })
            .catch(function () { return null; });
    }

    // The per-embed block/widget toggle is the ONLY thing that shows a counter.
    // The global option never overrides it. Editors emit an explicit marker on
    // the wrapper:
    //   data-ep-views="on"  -> show this counter for this embed
    //   data-ep-views="off" -> hide this counter for this embed
    //   absent              -> off (e.g. embeds saved before this feature)
    function resolve(el, attr) {
        return el.getAttribute(attr) === 'on';
    }
    function viewAllowed(el) {
        return resolve(el, 'data-ep-views');
    }
    function downloadAllowed(el) {
        return resolve(el, 'data-ep-downloads');
    }

    function processElement(el) {
        if (processed.has(el)) return;
        var embedType = el.getAttribute('data-embed-type');
        if (!embedType || cfg.types.indexOf(embedType) === -1) return;
        processed.add(el);

        var contentId = deriveContentId(el, embedType);
        var embedUrl  = getEmbedUrl(el);
        contentIdIndex[contentId] = el;

        if (viewAllowed(el) && cfg.trackUrl) {
            postForm(cfg.trackUrl, {
                content_id: contentId,
                session_id: sessionId,
                embed_type: embedType,
                embed_url: embedUrl
            }).then(function (count) {
                if (count === null) return getJson(cfg.restUrl, contentId);
                return count;
            }).then(function (count) {
                if (count === null) return;
                setViewCount(el, count);
            });
        }

        if (downloadAllowed(el) && cfg.downloadUrl) {
            getJson(cfg.downloadUrl, contentId).then(function (count) {
                setDownloadCount(el, count === null ? 0 : count);
            });
        }
    }

    function scan(root) {
        var nodes = (root || document).querySelectorAll('[data-embed-type]');
        for (var i = 0; i < nodes.length; i++) {
            if (nodes[i].parentElement && nodes[i].parentElement.closest('[data-embed-type]')) continue;
            processElement(nodes[i]);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function () { scan(); });
    } else {
        scan();
    }

    if ('MutationObserver' in window) {
        new MutationObserver(function (mutations) {
            mutations.forEach(function (m) {
                m.addedNodes.forEach(function (n) {
                    if (n.nodeType !== 1) return;
                    if (n.matches && n.matches('[data-embed-type]')) processElement(n);
                    if (n.querySelectorAll) n.querySelectorAll('[data-embed-type]').forEach(processElement);
                });
            });
        }).observe(document.body, { childList: true, subtree: true });
    }

    // Refresh view badge after analytics tracker fires its own view event.
    document.addEventListener('embedpress:view', function (ev) {
        var detail = ev && ev.detail;
        if (!detail || !detail.contentId) return;
        var el = contentIdIndex[detail.contentId];
        if (!el || !cfg.restUrl) return;
        getJson(cfg.restUrl, detail.contentId).then(function (c) {
            if (c !== null) setViewCount(el, c);
        });
    });

    /**
     * Receive download notifications from the bundled PDF.js viewer
     * (static/pdf/web/ep-scripts.js posts these when the toolbar
     * Download / Save buttons are clicked). Resolves the wrapper from
     * event.source.frameElement so we credit the right embed when the
     * page contains multiple PDFs.
     */
    window.addEventListener('message', function (ev) {
        var data = ev && ev.data;
        if (!data || data.source !== 'embedpress-pdf-viewer' || data.type !== 'download') return;
        // Need an endpoint to POST to; the actual per-embed gate is
        // downloadAllowed(el) below (after we resolve which embed sent this),
        // so a per-embed opt-in still tracks when the global default is off.
        if (!cfg.downloadTrackUrl) return;

        // Resolve which embed sent the download. The PDF.js viewer runs at
        // admin-ajax.php (same origin), so `iframe.contentWindow === ev.source`
        // is the primary match. Firefox, however, does not always keep that
        // identity stable across the viewer's internal reloads/bfcache, so we
        // fall back to matching the viewer iframe by its own `file=` src — the
        // most reliable cross-browser signal — before the host-URL fallback.
        var sourceFrame = null;
        try {
            var frames = document.getElementsByTagName('iframe');
            for (var i = 0; i < frames.length; i++) {
                if (frames[i].contentWindow === ev.source) { sourceFrame = frames[i]; break; }
            }
        } catch (e) { /* cross-origin — try fallbacks below */ }

        var el = sourceFrame ? sourceFrame.closest('[data-embed-type]') : null;

        // Firefox fallback: the message carries the viewer's own href, whose
        // `file=` param identifies the PDF. Match the iframe whose src points
        // at the same file and resolve ITS wrapper — this credits a correct
        // instance even when contentWindow identity didn't hold.
        if (!el) {
            try {
                // Prefer the explicit `file` the viewer sent (flipbook runs in a
                // blank frame, so its href has no file= to parse). Fall back to
                // parsing href's file= query for the classic PDF.js viewer.
                var target = '';
                if (data.file) {
                    target = data.file;
                } else {
                    var u = new URL(data.href || '', window.location.href);
                    var fileParam = u.searchParams.get('file');
                    if (fileParam) target = decodeURIComponent(fileParam);
                }
                if (target) {
                    var iframes = document.getElementsByTagName('iframe');
                    for (var k = 0; k < iframes.length && !el; k++) {
                        var isrc = iframes[k].getAttribute('src') || '';
                        if (isrc.indexOf('file=') === -1) continue;
                        try {
                            var iu = new URL(isrc, window.location.href);
                            var ifile = iu.searchParams.get('file');
                            if (ifile && decodeURIComponent(ifile) === target) {
                                el = iframes[k].closest('[data-embed-type]');
                            }
                        } catch (e2) { /* skip this iframe */ }
                    }
                    // Last resort: match an embed wrapper by its resolved URL.
                    if (!el) {
                        var nodes = document.querySelectorAll('[data-embed-type]');
                        for (var n = 0; n < nodes.length && !el; n++) {
                            if (getEmbedUrl(nodes[n]) === target) el = nodes[n];
                        }
                    }
                }
            } catch (e) { /* ignore */ }
        }
        if (!el) return;
        if (!downloadAllowed(el)) return;

        var embedType = el.getAttribute('data-embed-type');
        var contentId = el.getAttribute('data-embedpress-content') || deriveContentId(el, embedType);
        var embedUrl  = getEmbedUrl(el);

        // Optimistically bump the visible count NOW so it feels instant — the
        // flipbook's watermark/blob download and the REST round-trip can take a
        // moment, and waiting for the server response made the badge look like
        // it wasn't reacting. Reconcile with the authoritative count below.
        var current = parseInt(el.getAttribute('data-ep-download-count') || '0', 10);
        if (isNaN(current)) current = 0;
        setDownloadCount(el, current + 1);

        postForm(cfg.downloadTrackUrl, {
            content_id: contentId,
            session_id: sessionId,
            embed_type: embedType,
            embed_url: embedUrl
        }).then(function (count) {
            if (count === null) return;
            setDownloadCount(el, count);
        });
    });
})();
