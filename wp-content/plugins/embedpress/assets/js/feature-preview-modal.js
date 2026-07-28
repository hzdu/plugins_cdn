/**
 * EmbedPress — "What's New" Feature Preview Modal (frontend behaviour).
 *
 * Reads the JSON payload printed by FeaturePreviewModal::render(), builds the
 * split modal DOM, and drives it:
 *   - single feature  → no navigation
 *   - 2+ features      → carousel with pager dots + Back/Next; "n of N" in the
 *                        eyebrow; Next becomes "Done ✓" on the last step; the
 *                        changelog link becomes "Skip · See the full changelog".
 *
 * Accessibility: dialog role, focus trap, ESC to close, focus returned to the
 * trigger element on close. Any close path (X / ESC / backdrop / CTA / Done)
 * persists the dismissal via admin-ajax so the modal won't re-fire for the
 * same release version.
 *
 * Source file: static/js/feature-preview-modal.js
 * Build output: assets/js/feature-preview-modal.js (mirror until vite build).
 *
 * Depends on the localized global `EmbedPressWhatsNew` (ajaxUrl/nonce/action/i18n).
 */
(function () {
    'use strict';

    var cfg = window.EmbedPressWhatsNew || {};
    var i18n = cfg.i18n || {};

    function sprintf(tpl, a, b) {
        return String(tpl).replace('%1$d', a).replace('%2$d', b);
    }

    // Emit a tracking beacon for any button/link click inside the What's New
    // modal. Two sinks, both optional and non-blocking:
    //   - a `document` CustomEvent ('embedpress:whatsnew:click') following the
    //     same convention analytics-tracker.js uses ('embedpress:view'), so any
    //     listener (site analytics, integrations) can subscribe;
    //   - a GTM-style `window.dataLayer` push when a dataLayer is present.
    // `action` names the control (cta / close / next / back / done / dot /
    // changelog / whatWeCollect); `detail` carries slide + release context.
    function beacon(action, extra) {
        var detail = { action: action };
        if (extra) {
            Object.keys(extra).forEach(function (k) { detail[k] = extra[k]; });
        }
        try {
            document.dispatchEvent(new CustomEvent('embedpress:whatsnew:click', { detail: detail }));
        } catch (e) { /* no-op */ }
        try {
            window.dataLayer = window.dataLayer || [];
            window.dataLayer.push({
                event: 'embedpress_whatsnew_click',
                embedpress: detail
            });
        } catch (e) { /* no-op */ }
    }

    function el(tag, cls, attrs) {
        var node = document.createElement(tag);
        if (cls) { node.className = cls; }
        if (attrs) {
            Object.keys(attrs).forEach(function (k) { node.setAttribute(k, attrs[k]); });
        }
        return node;
    }

    // True when `url` points off this site — such links must open in a new tab
    // so they never navigate the admin away from the current wp-admin screen.
    // Internal admin URLs (e.g. the Release Notes page) resolve to the same
    // host and stay in-tab. Empty / "#" / relative anchors are treated internal.
    function isExternalUrl(url) {
        if (!url || url === '#') { return false; }
        try {
            var target = new URL(url, window.location.href);
            if (target.protocol !== 'http:' && target.protocol !== 'https:') { return false; }
            return target.host !== window.location.host;
        } catch (e) {
            return false;
        }
    }

    // Apply target/rel for an anchor based on whether its href is external.
    function applyLinkTarget(anchor, external) {
        if (external) {
            anchor.setAttribute('target', '_blank');
            anchor.setAttribute('rel', 'noopener noreferrer');
        } else {
            anchor.removeAttribute('target');
            anchor.removeAttribute('rel');
        }
    }

    function init() {
        var root = document.getElementById('embedpress-whatsnew-root');
        var dataNode = document.getElementById('embedpress-whatsnew-data');
        if (!root || !dataNode) { return; }

        var data;
        try {
            data = JSON.parse(dataNode.textContent);
        } catch (e) {
            return;
        }
        if (!data || !data.features || !data.features.length) { return; }

        var modal = new WhatsNewModal(root, data);

        // Developer switch (server-side `embedpress_whatsnew_autoopen` filter,
        // default true). Auto-open: the modal opens as soon as the user lands on
        // an EmbedPress page. Click-mode: it stays closed until the user clicks
        // the flagged EmbedPress menu item — the blinking bubble is the cue.
        if (cfg.autoOpen === false) {
            bindMenuOpen(modal);
        } else {
            modal.open();
        }
    }

    /**
     * Click-mode: open the modal when the user clicks the EmbedPress admin menu
     * (the item carrying the blinking "New" bubble). We're already on an
     * EmbedPress page, so the top-level/current menu link is a same-page click —
     * intercept it and open the modal instead of just reloading.
     */
    function bindMenuOpen(modal) {
        var slug = cfg.menuSlug || 'embedpress';
        // The bubble marks the exact menu item; prefer it, then fall back to the
        // menu anchor by slug.
        var badge = document.querySelector('#adminmenu .ep-whatsnew-badge');
        var anchor = badge ? badge.closest('a') : null;
        if (!anchor) {
            anchor = document.querySelector('#adminmenu a[href*="page=' + slug + '"]');
        }
        if (!anchor) { return; }

        anchor.addEventListener('click', function (e) {
            // Only hijack a same-page click (already on an EmbedPress page);
            // let normal navigation proceed otherwise.
            e.preventDefault();
            modal.open();
        });
    }

    function WhatsNewModal(root, data) {
        this.root = root;
        this.data = data;
        this.features = data.features;
        this.multi = this.features.length > 1;
        this.index = 0;
        this.dismissed = false;
        this.lastFocused = null;
        this.build();
    }

    WhatsNewModal.prototype.build = function () {
        var self = this;
        this.root.removeAttribute('aria-hidden');
        this.root.className = 'epwn' + (this.multi ? ' epwn--multi' : '');
        this.root.setAttribute('role', 'dialog');
        this.root.setAttribute('aria-modal', 'true');
        this.root.setAttribute('aria-labelledby', 'epwn-title');

        // --- modal shell ---
        var modal = el('div', 'epwn__modal');

        var close = el('button', 'epwn__close', {
            type: 'button',
            'aria-label': i18n.close || 'Close'
        });
        close.innerHTML = '&#10005;';
        close.addEventListener('click', function () { self.beaconClick('close'); self.close(); });
        modal.appendChild(close);

        // --- left / preview ---
        var left = el('div', 'epwn__left');
        this.badge = el('span', 'epwn__badge');
        left.appendChild(this.badge);
        this.demo = el('div', 'epwn__demo');
        var bar = el('div', 'epwn__bar');
        bar.innerHTML = '<i></i><i></i><i></i>';
        this.stage = el('div', 'epwn__stage');
        this.demo.appendChild(bar);
        this.demo.appendChild(this.stage);
        left.appendChild(this.demo);
        modal.appendChild(left);

        // --- right / copy ---
        var right = el('div', 'epwn__right');
        this.right = right;

        // brand header: EmbedPress logo (version lives in the eyebrow)
        var header = el('div', 'epwn__header');
        if (cfg.logoUrl) {
            var logo = el('img', 'epwn__logo', { src: cfg.logoUrl, alt: 'EmbedPress' });
            header.appendChild(logo);
        }
        right.appendChild(header);

        this.eyebrow = el('span', 'epwn__eyebrow');
        this.title = el('h2', 'epwn__title', { id: 'epwn-title' });
        this.desc = el('p', 'epwn__desc');
        this.cta = el('a', 'epwn__cta', { href: '#' });
        this.cta.addEventListener('click', function (e) {
            self.beaconClick('cta', { label: self.cta.textContent, url: self.cta.getAttribute('href') });
            // CTA counts as engagement → dismiss, then let the link proceed.
            self.persistDismiss();
            if (!self.cta.getAttribute('href') || self.cta.getAttribute('href') === '#') {
                e.preventDefault();
                self.close();
            }
        });

        right.appendChild(this.eyebrow);
        right.appendChild(this.title);
        right.appendChild(this.desc);
        right.appendChild(el('div', 'epwn__grow'));
        right.appendChild(this.cta);

        // nav (always built; shown only when multi via CSS)
        var nav = el('div', 'epwn__nav');
        this.backBtn = el('button', 'epwn__back', { type: 'button' });
        this.backBtn.textContent = i18n.back || '← Back';
        this.dots = el('div', 'epwn__dots');
        this.nextBtn = el('button', 'epwn__next', { type: 'button' });
        this.backBtn.addEventListener('click', function () { self.beaconClick('back'); self.prev(); });
        this.nextBtn.addEventListener('click', function () {
            self.beaconClick(self.index < self.features.length - 1 ? 'next' : 'done');
            self.next();
        });
        nav.appendChild(this.backBtn);
        nav.appendChild(this.dots);
        nav.appendChild(this.nextBtn);
        right.appendChild(nav);

        // Bottom link. Text + href are set PER SLIDE in render(): the changelog
        // link on every slide, except the last slide becomes "What we collect"
        // → privacy policy when tracking isn't opted-in.
        //   - changelog link  → opens in a new tab AND dismisses the modal.
        //   - "What we collect" → opens the policy in a new tab ONLY; the popup
        //     stays open (it's not a dismissal, just a reference link).
        var chg = el('div', 'epwn__chglink');
        this.chgLink = el('a', null, { href: this.data.changelogUrl || '#', target: '_blank', rel: 'noopener noreferrer' });
        this.chgLink.addEventListener('click', function (e) {
            e.preventDefault();
            self.beaconClick(self.chgLinkIsWhatWeCollect ? 'whatWeCollect' : 'changelog', {
                url: self.chgLink.getAttribute('href')
            });
            var url = self.chgLink.getAttribute('href');
            if (url && url !== '#') {
                window.open(url, '_blank', 'noopener,noreferrer');
            }
            // "What we collect" is a reference link — do NOT close/dismiss.
            if (!self.chgLinkIsWhatWeCollect) {
                self.close();
            }
        });
        chg.appendChild(this.chgLink);
        right.appendChild(chg);

        modal.appendChild(right);
        this.root.appendChild(modal);

        // backdrop click closes
        this.root.addEventListener('mousedown', function (e) {
            if (e.target === self.root) { self.close(); }
        });

        // keyboard: ESC + focus trap
        this.keyHandler = function (e) { self.onKeydown(e); };
        document.addEventListener('keydown', this.keyHandler);

        this.render();
    };

    WhatsNewModal.prototype.render = function () {
        var f = this.features[this.index];
        var multi = this.multi;

        // media
        this.stage.innerHTML = '';
        var m = f.media || {};
        this.badge.textContent = m.badge || '';
        this.badge.style.display = m.badge ? '' : 'none';

        // File media (image/gif/video) has a natural aspect ratio and should
        // size to its content — the demo panel then centers in the column
        // rather than stretching to full height (which gaps a landscape clip).
        // html demos (e.g. Google Reviews) are built to fill, so they keep it.
        this.demo.classList.toggle('epwn__demo--flat', m.type !== 'html');

        if (m.type === 'html' && m.html) {
            this.stage.innerHTML = m.html;
        } else if (m.type === 'video' && m.src) {
            // A CDN-hosted clip can lag on first load; show the shimmer until
            // the first frame is ready, then reveal (same affordance as images).
            var vstage = this.stage;
            vstage.classList.add('epwn__stage--loading');
            var v = el('video', null, { src: m.src, autoplay: '', muted: '', loop: '', playsinline: '', preload: 'auto' });
            v.muted = true;
            if (m.poster) { v.setAttribute('poster', m.poster); }
            var vreveal = function () { vstage.classList.remove('epwn__stage--loading'); };
            v.addEventListener('loadeddata', vreveal);
            v.addEventListener('error', vreveal);
            this.stage.appendChild(v);
        } else if (m.src) {
            // Large images/GIFs may still be downloading when the modal opens
            // (they're preloaded on page load, but a cold cache can lag). Show a
            // shimmer on the stage until the image decodes, then reveal it.
            var stage = this.stage;
            stage.classList.add('epwn__stage--loading');
            var img = el('img', null, { src: m.src, alt: f.title || '' });
            var reveal = function () { stage.classList.remove('epwn__stage--loading'); };
            if (img.complete) { reveal(); }
            else {
                img.addEventListener('load', reveal);
                img.addEventListener('error', reveal);
            }
            stage.appendChild(img);
        }

        // copy
        this.eyebrow.textContent = multi
            ? f.eyebrow + ' · ' + sprintf(i18n.counter || '%1$d of %2$d', this.index + 1, this.features.length)
            : f.eyebrow;
        this.title.textContent = f.title;
        this.desc.innerHTML = f.desc; // server-side wp_kses_post'd

        // cta
        if (f.cta && f.cta.label) {
            this.cta.textContent = f.cta.label;
            this.cta.style.display = '';
            this.cta.setAttribute('href', f.cta.url || '#');
            // Honour the explicit `external` flag, but also open in a new tab
            // for any off-site URL so a doc/changelog CTA never navigates the
            // admin away from the current screen even if the flag was omitted.
            applyLinkTarget(this.cta, f.cta.external || isExternalUrl(f.cta.url));
        } else {
            this.cta.style.display = 'none';
        }

        // bottom-link copy + href, per slide. On the FIRST slide, and only when
        // whatWeCollectUrl is set (tracking not yet opted-in), the link becomes
        // "What we collect" → privacy policy — the disclosure shown up front,
        // before the user clicks Next (which is what grants consent). Every
        // other slide keeps the changelog / "Skip" link.
        var isFirst = this.index === 0;
        if (this.data.whatWeCollectUrl && isFirst) {
            this.chgLink.textContent = i18n.whatWeCollect || 'What we collect';
            this.chgLink.setAttribute('href', this.data.whatWeCollectUrl);
            // Mark this as the reference link so its click won't dismiss.
            this.chgLinkIsWhatWeCollect = true;
        } else {
            this.chgLink.textContent = multi ? (i18n.skip || 'Skip') : (i18n.changelog || 'See the full changelog');
            this.chgLink.setAttribute('href', this.data.changelogUrl || '#');
            this.chgLinkIsWhatWeCollect = false;
        }

        // fade the copy column
        this.right.classList.remove('epwn__fade');
        void this.right.offsetWidth;
        this.right.classList.add('epwn__fade');

        // nav state
        if (multi) {
            this.dots.innerHTML = '';
            for (var k = 0; k < this.features.length; k++) {
                var dot = el('button', 'epwn__dot' + (k === this.index ? ' is-on' : ''), {
                    type: 'button',
                    'aria-label': sprintf(i18n.counter || '%1$d of %2$d', k + 1, this.features.length)
                });
                (function (idx, modalRef) {
                    dot.addEventListener('click', function () {
                        modalRef.beaconClick('dot', { to: idx + 1 });
                        modalRef.goTo(idx);
                    });
                })(k, this);
                this.dots.appendChild(dot);
            }
            this.backBtn.style.visibility = this.index > 0 ? 'visible' : 'hidden';
            this.nextBtn.textContent = this.index < this.features.length - 1
                ? (i18n.next || 'Next →')
                : (i18n.done || 'Done ✓');
        }
    };

    // Emit a click beacon carrying this modal's context (release version +
    // current slide) merged with per-control extras. Every interactive control
    // in the modal routes through here so a listener sees a uniform payload.
    WhatsNewModal.prototype.beaconClick = function (action, extra) {
        var f = this.features[this.index] || {};
        var base = {
            version: this.data.version || '',
            release: this.data.id || '',
            slide:   this.index + 1,
            slides:  this.features.length,
            title:   f.title || ''
        };
        if (extra) {
            Object.keys(extra).forEach(function (k) { base[k] = extra[k]; });
        }
        beacon(action, base);
        // Consent is Next/Done only — advancing past the "What we collect"
        // disclosure on slide 1 is the affirmative action. Dismissing (close /
        // X / ESC / backdrop / Back / dots / reference link) never enables
        // tracking. Fired once; server-side is idempotent and only wired when
        // tracking isn't already on.
        if (action === 'next' || action === 'done') {
            this.persistConsent();
        }
    };

    // Fire-and-forget the consent opt-in. Guarded so it posts at most once per
    // modal instance, and only when the server flagged consent as needed
    // (tracking not already enabled).
    WhatsNewModal.prototype.persistConsent = function () {
        if (this.consented) { return; }
        if (!cfg.consentNeeded || !cfg.ajaxUrl || !cfg.consentAction) { return; }
        this.consented = true;
        var body = new URLSearchParams();
        body.set('action', cfg.consentAction);
        body.set('nonce', cfg.nonce || '');
        fetch(cfg.ajaxUrl, {
            method: 'POST',
            credentials: 'same-origin',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: body.toString(),
            keepalive: true
        }).catch(function () {});
    };

    WhatsNewModal.prototype.goTo = function (i) {
        if (i < 0 || i > this.features.length - 1 || i === this.index) { return; }
        this.index = i;
        this.render();
    };

    WhatsNewModal.prototype.next = function () {
        if (this.index < this.features.length - 1) {
            this.index++;
            this.render();
        } else {
            // "Done ✓" on the last step closes + dismisses.
            this.close();
        }
    };

    WhatsNewModal.prototype.prev = function () {
        if (this.index > 0) {
            this.index--;
            this.render();
        }
    };

    WhatsNewModal.prototype.focusables = function () {
        return this.root.querySelectorAll(
            'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
    };

    WhatsNewModal.prototype.onKeydown = function (e) {
        if (e.key === 'Escape') {
            e.preventDefault();
            this.close();
            return;
        }
        if (e.key === 'Tab') {
            var items = Array.prototype.filter.call(this.focusables(), function (n) {
                return n.offsetParent !== null && n.style.display !== 'none' && n.style.visibility !== 'hidden';
            });
            if (!items.length) { return; }
            var first = items[0];
            var last = items[items.length - 1];
            if (e.shiftKey && document.activeElement === first) {
                e.preventDefault();
                last.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
                e.preventDefault();
                first.focus();
            }
        }
    };

    WhatsNewModal.prototype.open = function () {
        var self = this;
        this.lastFocused = document.activeElement;
        // Mark "opened" (NOT "seen"): clears the menu "New" indicator now that
        // the modal has been opened at least once — but does NOT dismiss the
        // modal. The modal keeps re-showing until a real dismiss/Done stamps
        // "seen" via persistDismiss(). These are two independent markers.
        this.persistOpened();
        var badge = document.querySelector('#adminmenu .ep-whatsnew-badge');
        if (badge && badge.parentNode) { badge.parentNode.removeChild(badge); }
        // next frame so the transition runs
        requestAnimationFrame(function () {
            self.root.classList.add('is-open');
            var first = self.focusables()[0];
            if (first) { first.focus(); }
        });
    };

    // Fire-and-forget the "opened" marker. Guarded so it only posts once per
    // modal instance.
    WhatsNewModal.prototype.persistOpened = function () {
        if (this.opened) { return; }
        this.opened = true;
        if (!cfg.ajaxUrl || !cfg.openedAction) { return; }
        var body = new URLSearchParams();
        body.set('action', cfg.openedAction);
        body.set('nonce', cfg.nonce || '');
        body.set('version', this.data.version || '');
        fetch(cfg.ajaxUrl, {
            method: 'POST',
            credentials: 'same-origin',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: body.toString(),
            keepalive: true
        }).catch(function () {});
    };

    WhatsNewModal.prototype.persistDismiss = function () {
        if (this.dismissed) { return; }
        this.dismissed = true;
        if (!cfg.ajaxUrl || !cfg.action) { return; }
        var body = new URLSearchParams();
        body.set('action', cfg.action);
        body.set('nonce', cfg.nonce || '');
        body.set('version', this.data.version || '');
        // Fire-and-forget; keepalive so it survives navigation on CTA click.
        fetch(cfg.ajaxUrl, {
            method: 'POST',
            credentials: 'same-origin',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: body.toString(),
            keepalive: true
        }).catch(function () {});
    };

    WhatsNewModal.prototype.close = function () {
        var self = this;
        this.persistDismiss();
        // (The menu badge was already removed on open() — clearing it there is
        // what decouples "seen the badge" from "dismissed the modal".)
        this.root.classList.remove('is-open');
        document.removeEventListener('keydown', this.keyHandler);
        setTimeout(function () {
            self.root.setAttribute('aria-hidden', 'true');
            self.root.innerHTML = '';
        }, 240);
        if (this.lastFocused && this.lastFocused.focus) {
            this.lastFocused.focus();
        }
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
