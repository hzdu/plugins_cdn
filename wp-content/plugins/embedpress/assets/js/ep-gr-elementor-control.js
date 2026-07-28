/**
 * Backbone view for the EmbedPress Google Reviews place picker Elementor
 * control (type: ep_gr_place_picker).
 *
 * Stored value shape: { place_id: '', place_name: '' }
 *
 * Why a custom control vs. the inject-HTML approach we shipped earlier:
 *   - Elementor manages render / undo / clone properly when the value lives
 *     in the model behind a real control type.
 *   - Theme switching (light/dark) works automatically because all styles
 *     hang off Elementor's CSS variables.
 *   - No need to maintain mirror text inputs as graceful-degradation fallback.
 */
(function ($) {
    'use strict';

    if (typeof window.epGoogleReviewsElementor !== 'object') return;
    var REST  = window.epGoogleReviewsElementor.restUrl;
    var NONCE = window.epGoogleReviewsElementor.nonce;
    var I18N  = window.epGoogleReviewsElementor.i18n || {};
    var PRO_ACTIVE  = !!window.epGoogleReviewsElementor.proActive;
    var UPGRADE_URL = window.epGoogleReviewsElementor.upgradeUrl || 'https://wpdeveloper.com/in/upgrade-embedpress';
    function t(k, fb) { return I18N[k] || fb; }
    // Crown SVG — matches the settings/block "+ Select" upsell badge.
    var CROWN = '<svg width="11" height="11" viewBox="0 0 24 24" aria-hidden="true">' +
        '<path fill="currentColor" d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm0 2h14v2H5v-2z"/></svg>';
    // Map-pin SVG — same icon + class as the block/admin pickers (parity).
    var PIN = '<svg class="ep-gr-suggestion-pin" width="14" height="14" viewBox="0 0 24 24" fill="none" ' +
        'stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
        '<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>';

    // Rating + review-count line — mirrors the block/admin SuggestionMeta:
    // "★ 4.5 · 1,167 reviews". Returns '' when neither is present.
    function metaHtml(rating, count) {
        if (rating == null && count == null) { return ''; }
        var html = '<span class="ep-gr-suggestion-meta">';
        if (rating != null) {
            html += '<span class="ep-gr-suggestion-rating">' +
                '<span class="ep-gr-suggestion-star" aria-hidden="true">★</span>' +
                escapeHtml(Number(rating).toFixed(1)) + '</span>';
        }
        if (count != null) {
            var n = Number(count);
            html += '<span class="ep-gr-suggestion-count">' +
                escapeHtml(n.toLocaleString()) + ' ' +
                escapeHtml(n === 1 ? t('review', 'review') : t('reviews', 'reviews')) + '</span>';
        }
        return html + '</span>';
    }

    function escapeHtml(s) {
        return String(s == null ? '' : s)
            .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    }

    $(window).on('elementor:init', function () {
        if (!window.elementor || !elementor.modules || !elementor.modules.controls) return;

        var ControlBaseDataView = elementor.modules.controls.BaseData;

        var PlacePickerView = ControlBaseDataView.extend({

            ui: function () {
                var base = ControlBaseDataView.prototype.ui.apply(this, arguments);
                _.extend(base, {
                    input:        '.ep-gr-picker__input',
                    spinner:      '.ep-gr-picker__spinner',
                    resultsPanel: '.ep-gr-picker__results-panel',
                    results:      '.ep-gr-picker__results',
                    resultsNote:  '.ep-gr-picker__results-note',
                    status:       '.ep-gr-picker__status',
                    selected:     '.ep-gr-picker__selected',
                    selectedNm:   '.ep-gr-picker__selected-name',
                    selectedId:   '.ep-gr-picker__selected-id',
                    selectedAddr: '.ep-gr-picker__selected-address',
                    search:       '.ep-gr-picker__search',
                    clearBtn:     '.ep-gr-picker__clear',
                    lists:        '.ep-gr-picker__lists',
                    listSaved:    '.ep-gr-picker__list[data-kind=saved] .ep-gr-picker__list-items',
                    listRecent:   '.ep-gr-picker__list[data-kind=recent] .ep-gr-picker__list-items',
                    listSavedBox: '.ep-gr-picker__list[data-kind=saved]',
                    listRecentBox:'.ep-gr-picker__list[data-kind=recent]',
                    manualToggle: '.ep-gr-picker__manual-toggle',
                    manualRow:    '.ep-gr-picker__manual-row',
                    manualInput:  '.ep-gr-picker__manual-input',
                    manualApply:  '.ep-gr-picker__manual-apply',
                });
                return base;
            },

            events: function () {
                return _.extend({}, ControlBaseDataView.prototype.events.apply(this, arguments), {
                    'input @ui.input':          'onInput',
                    'focus @ui.input':          'onInputFocus',
                    'keydown @ui.input':        'onInputKey',
                    'click @ui.clearBtn':       'onClear',
                    'click @ui.results > li':   'onPick',
                    'keydown @ui.results > li': 'onResultKey',
                    'click @ui.manualToggle':   'onToggleManual',
                    'click @ui.manualApply':    'onApplyManual',
                    'keydown @ui.manualInput':  'onManualKey',
                    'click .ep-gr-picker__list-pick': 'onListPick',
                });
            },

            onReady: function () {
                this.renderSelected();
                this.loadLists();
            },

            getValueOrDefault: function () {
                var v = this.readValue();
                if (!v || typeof v !== 'object') v = { place_id: '', place_name: '', place_address: '' };
                return v;
            },

            // Read/write the control value through whichever Elementor API is
            // available. Elementor 4.x dropped the BaseData.setControlValue()
            // helper on object-typed custom controls; calling it throws
            // `this.setControlValue is not a function` and the click silently
            // fails. Fall back to the settings model directly.
            readValue: function () {
                var name = this.model.get('name');
                if (this.container && this.container.settings) {
                    return this.container.settings.get(name);
                }
                if (this.elementSettingsModel) {
                    return this.elementSettingsModel.get(name);
                }
                if (typeof this.getControlValue === 'function') {
                    return this.getControlValue();
                }
                return null;
            },

            writeValue: function (value) {
                var name = this.model.get('name');
                // Preferred: route through Elementor's command pipeline so the
                // live preview iframe re-renders and undo history is recorded.
                // `container.settings.set()` alone updates the Backbone model
                // but skips the render path, so the canvas appears stale until
                // the next reload.
                if (this.container && window.$e && $e.run) {
                    try {
                        $e.run('document/elements/settings', {
                            container: this.container,
                            settings: _.object([name], [value]),
                        });
                        return;
                    } catch (err) { /* fall through to direct model write */ }
                }
                if (this.container && this.container.settings) {
                    this.container.settings.set(name, value);
                    return;
                }
                if (this.elementSettingsModel) {
                    this.elementSettingsModel.set(name, value);
                    return;
                }
                if (typeof this.setControlValue === 'function') {
                    this.setControlValue(value);
                }
            },

            renderSelected: function () {
                var v = this.getValueOrDefault();
                if (v.place_id) {
                    this.ui.selected.attr('data-state', 'picked');
                    // Name line stays clean — when a place was added by raw ID it
                    // has no name, so show a neutral label rather than dumping the
                    // ID into the prominent name slot (the ID shows demoted below).
                    this.ui.selectedNm.text(v.place_name || t('selectedPlace', 'Selected place'));
                    this.ui.selectedNm.attr('title', v.place_name || v.place_id);
                    // Show the location details (address) when we have them; fall
                    // back to the raw Place ID (e.g. added by ID / Maps link).
                    var addr = v.place_address || '';
                    if (addr) {
                        this.ui.selectedAddr.text(addr).attr('title', addr).prop('hidden', false);
                        this.ui.selectedId.text('').prop('hidden', true);
                    } else {
                        this.ui.selectedAddr.text('').prop('hidden', true);
                        this.ui.selectedId.text(v.place_id).attr('title', v.place_id).prop('hidden', false);
                    }
                    this.ui.search.hide();
                    this.hideResults();
                    this.ui.lists.hide();
                    this.setStatus('');
                } else {
                    this.ui.selected.attr('data-state', 'empty');
                    this.ui.search.show();
                    this.renderLists();
                }
            },

            // --- Recent / saved lists ----------------------------------

            loadLists: function (cb) {
                var self = this;
                $.ajax({
                    url: REST + '/places',
                    method: 'GET',
                    beforeSend: function (xhr) { xhr.setRequestHeader('X-WP-Nonce', NONCE); },
                }).done(function (res) {
                    self._lists = res || { recent: [], saved: [] };
                    if (typeof cb === 'function') { cb(); return; }
                    if (!self.getValueOrDefault().place_id) self.renderLists();
                });
            },

            renderLists: function () {
                if (!this._lists) { this.ui.lists.hide(); return; }
                var savedIds = (this._lists.saved || []).reduce(function (acc, p) { acc[p.place_id] = true; return acc; }, {});
                // Free/Pro: SAME treatment as the SEARCH results. When a free user
                // is at the 1-place cap, every place EXCEPT the ONE they're allowed
                // is LOCKED → pin + "Upgrade to add" (click → upgrade). A free user
                // must ALWAYS be able to use at least 1 place: the allowed one is
                // the widget's current selection, or — if nothing is selected yet —
                // the FIRST saved place. Pro = all pickable.
                var limit = this.placeLimitReached();
                var current = this.getValueOrDefault().place_id;
                var firstSavedId = ((this._lists && this._lists.saved) || [])[0];
                firstSavedId = firstSavedId ? firstSavedId.place_id : '';
                var allowedId = current || firstSavedId;
                // Rows are PICK-ONLY — clicking selects the place. Removing a saved
                // place only happens from the settings page, never here.
                var renderRow = function (p, kind) {
                    var locked = limit && p.place_id !== allowedId;
                    var badge = locked
                        ? '<em class="ep-gr-suggestion-pro">' + CROWN + ' ' + escapeHtml(t('upgrade', 'Upgrade to add')) + '</em>'
                        : '';
                    return '<li>' +
                        '<button type="button" class="ep-gr-picker__list-pick' + (locked ? ' is-locked' : '') + '"' +
                            ' data-id="' + escapeHtml(p.place_id) + '"' +
                            ' data-name="' + escapeHtml(p.place_name || '') + '"' +
                            ' data-address="' + escapeHtml(p.address || '') + '"' +
                            ' data-locked="' + (locked ? '1' : '0') + '"' +
                            (locked ? ' title="' + escapeHtml(t('limitTitle', 'Showing more than one place needs EmbedPress Pro — click to upgrade.')) + '"' : '') + '>' +
                            PIN +
                            '<span class="ep-gr-picker__list-pick-body ep-gr-suggestion-body">' +
                                '<strong>' + escapeHtml(p.place_name || p.place_id) + '</strong>' +
                                // Location description (address) — saved with the place.
                                (p.address ? '<span>' + escapeHtml(p.address) + '</span>' : '') +
                                badge +
                            '</span>' +
                        '</button>' +
                    '</li>';
                };
                var saved  = (this._lists.saved  || []).map(function (p) { return renderRow(p, 'saved'); }).join('');
                var recent = (this._lists.recent || []).filter(function (p) { return !savedIds[p.place_id]; })
                                .map(function (p) { return renderRow(p, 'recent'); }).join('');
                this.ui.listSaved.html(saved);
                this.ui.listRecent.html(recent);
                this.ui.listSavedBox.prop('hidden', !saved);
                this.ui.listRecentBox.prop('hidden', !recent);
                // Upsell note below the lists when at the free cap (mirrors search).
                var note = this.ui.lists.find('.ep-gr-picker__lists-note');
                if (limit) {
                    var noteHtml = escapeHtml(t('limitLead', 'You’ve added your 1 free place.')) + ' ' +
                        '<a href="' + escapeHtml(UPGRADE_URL) + '" target="_blank" rel="noopener noreferrer">' +
                        escapeHtml(t('goPro', 'Go Pro')) + '</a> ' +
                        escapeHtml(t('limitTail', 'to show reviews from multiple businesses at once.'));
                    if (note.length) { note.html(noteHtml); }
                    else { this.ui.lists.append('<p class="ep-gr-picker__lists-note ep-gr-inline-note ep-gr-inline-note--muted">' + noteHtml + '</p>'); }
                } else if (note.length) {
                    note.remove();
                }
                var empty = !saved && !recent;
                // Toggle BOTH the hidden prop and inline display so this plays
                // nicely with the .hide()/.show() calls elsewhere.
                this.ui.lists.prop('hidden', empty);
                if (empty) { this.ui.lists.hide(); } else { this.ui.lists.show(); }
            },

            // Show the saved/recent lists, loading them first if they haven't been
            // fetched yet (e.g. focusing the input before onReady's load lands).
            showLists: function () {
                if (this._lists) { this.renderLists(); return; }
                var self = this;
                this.loadLists(function () { self.renderLists(); });
            },

            postPlaces: function (action, place_id, place_name, place_address) {
                var self = this;
                $.ajax({
                    url: REST + '/places',
                    method: 'POST',
                    data: { action: action, place_id: place_id, place_name: place_name || '', place_address: place_address || '' },
                    beforeSend: function (xhr) { xhr.setRequestHeader('X-WP-Nonce', NONCE); },
                }).done(function (res) {
                    self._lists = res || { recent: [], saved: [] };
                    if (!self.getValueOrDefault().place_id) self.renderLists();
                });
            },

            commitPick: function (place_id, place_name, place_address) {
                this.writeValue({ place_id: place_id, place_name: place_name, place_address: place_address || '' });
                this.postPlaces('recent', place_id, place_name, place_address);
                this.ui.input.val('');
                // writeValue() routes through $e.run('document/elements/settings'),
                // which re-renders this control view asynchronously — a synchronous
                // renderSelected() here would update DOM that the re-render then
                // throws away (the picker would snap back to the empty search
                // state, so the chosen place "doesn't show"). Render now for the
                // case where no re-render fires, AND again on the next frame to win
                // against the re-render.
                this.renderSelected();
                var self = this;
                window.requestAnimationFrame(function () { self.renderSelected(); });
                window.setTimeout(function () { self.renderSelected(); }, 60);
            },

            onListPick: function (e) {
                e.preventDefault();
                var $b = $(e.currentTarget);
                // Locked (free user at the 1-place cap, a different place) → send
                // to the upgrade page instead of selecting. Mirrors search results.
                if ($b.attr('data-locked') === '1') {
                    window.open(UPGRADE_URL, '_blank', 'noopener');
                    return;
                }
                this.commitPick($b.attr('data-id') || '', $b.attr('data-name') || '', $b.attr('data-address') || '');
            },

            // --- Manual Place ID entry --------------------------------

            onToggleManual: function (e) {
                e.preventDefault();
                var hidden = this.ui.manualRow.prop('hidden');
                this.ui.manualRow.prop('hidden', !hidden);
                this.ui.manualToggle.attr('aria-expanded', String(hidden));
                if (hidden) this.ui.manualInput.focus();
            },

            onApplyManual: function (e) {
                e.preventDefault();
                this.applyManual();
            },

            onManualKey: function (e) {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    this.applyManual();
                }
            },

            applyManual: function () {
                var raw = (this.ui.manualInput.val() || '').trim();
                // Accept either a bare place_id or a Places API (New) resource name like "places/ChIJ..."
                var m = raw.match(/^(?:places\/)?([A-Za-z0-9_\-]+)$/);
                if (!m) {
                    this.setStatus(t('badId', 'That doesn’t look like a valid Place ID.'), 'error');
                    return;
                }
                this.commitPick(m[1], '');
                this.ui.manualInput.val('');
            },

            setStatus: function (text, tone) {
                this.ui.status.text(text || '').attr('data-tone', tone || '');
            },

            setBusy: function (busy) {
                this.ui.spinner.prop('hidden', !busy);
            },

            // Focusing the empty search input reveals the saved + recent places
            // below it, so the user can re-pick a place with one click instead of
            // retyping. Hidden again as soon as they start typing a query (the
            // search results take over).
            onInputFocus: function () {
                var q = (this.ui.input.val() || '').trim();
                if (q.length < 2) {
                    this.showLists();
                }
            },

            onInput: function (e) {
                var self = this;
                var q = (e.target.value || '').trim();
                clearTimeout(this._debounce);
                if (q.length < 2) {
                    this.hideResults();
                    this.setStatus('');
                    this.setBusy(false);
                    this.showLists();     // show saved/recent again when cleared
                    return;
                }
                this.ui.lists.hide();     // typing a query → results replace lists
                this.setBusy(true);
                this.setStatus('');
                this._debounce = setTimeout(function () { self.runSearch(q); }, 300);
            },

            onInputKey: function (e) {
                if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    var first = this.ui.results.find('li').first();
                    if (first.length) first.focus();
                }
            },

            onResultKey: function (e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.onPick(e);
                } else if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    var n = $(e.currentTarget).next('li');
                    if (n.length) n.focus();
                } else if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    var p = $(e.currentTarget).prev('li');
                    if (p.length) p.focus(); else this.ui.input.focus();
                }
            },

            runSearch: function (q) {
                var self = this;
                // Sequence each request so out-of-order responses can't clobber a
                // newer one. Typing "riber road" fires several debounced searches;
                // an early uncached query can resolve (or error) AFTER a later one.
                // Only the response from the latest-issued query is allowed to
                // touch the UI — this is what caused a stale Apify error to flash
                // even though the final result came back fine.
                var seq = (this._searchSeq = (this._searchSeq || 0) + 1);
                var stale = function () { return seq !== self._searchSeq; };
                $.ajax({
                    url: REST + '/search?q=' + encodeURIComponent(q),
                    method: 'GET',
                    beforeSend: function (xhr) { xhr.setRequestHeader('X-WP-Nonce', NONCE); },
                }).done(function (res) {
                    if (stale()) { return; }
                    self.setBusy(false);
                    var list = (res && res.predictions) || [];
                    if (!list.length) {
                        self.hideResults();
                        self.setStatus(t('noResults', 'No matches. Try a different spelling or include the city.'), 'muted');
                        return;
                    }
                    // Unified flow (matches settings + Gutenberg pickers): each row
                    // shows "+ Select" / "already added" / "Upgrade to add", and an
                    // upsell note sits BELOW the results when at the free 1-place cap.
                    var savedIds = (self._lists && self._lists.saved || []).reduce(function (a, p) { a[p.place_id] = true; return a; }, {});
                    var limit = self.placeLimitReached();
                    var html = list.map(function (p) {
                        var already = !!savedIds[p.place_id];
                        var locked  = limit && !already;
                        var badge = already
                            ? '<em class="ep-gr-already">' + escapeHtml(t('added', 'already added')) + '</em>'
                            : locked
                                ? '<em class="ep-gr-suggestion-pro">' + CROWN + ' ' + escapeHtml(t('upgrade', 'Upgrade to add')) + '</em>'
                                : '<em class="ep-gr-suggestion-add">+ ' + escapeHtml(t('select', 'Select')) + '</em>';
                        return '<li role="option" tabindex="0"' +
                                    ' class="ep-gr-suggestion' + (locked ? ' is-locked' : '') + '"' +
                                    ' data-locked="' + (locked ? '1' : '') + '"' +
                                    ' data-id="' + escapeHtml(p.place_id) + '"' +
                                    ' data-address="' + escapeHtml(p.secondary_text || '') + '"' +
                                    ' data-name="' + escapeHtml(p.main_text || p.description || '') + '">' +
                                    PIN +
                                    '<span class="ep-gr-suggestion-body">' +
                                        '<strong>' + escapeHtml(p.main_text || p.description) + '</strong>' +
                                        (p.secondary_text ? '<span>' + escapeHtml(p.secondary_text) + '</span>' : '') +
                                        metaHtml(p.rating, p.review_count) +
                                        badge +
                                    '</span>' +
                                '</li>';
                    }).join('');
                    self.ui.results.html(html);
                    if (limit) {
                        // "You’ve added your 1 free place. <a>Go Pro</a> to show
                        // reviews from multiple businesses at once."
                        self.ui.resultsNote.html(
                            escapeHtml(t('limitLead', 'You’ve added your 1 free place.')) + ' ' +
                            '<a href="' + UPGRADE_URL + '" target="_blank" rel="noopener noreferrer">' +
                                escapeHtml(t('goPro', 'Go Pro')) + '</a> ' +
                            escapeHtml(t('limitTail', 'to show reviews from multiple businesses at once.'))
                        ).prop('hidden', false);
                    } else {
                        self.ui.resultsNote.empty().prop('hidden', true);
                    }
                    self.ui.resultsPanel.prop('hidden', false).show();
                    self.setStatus('');
                }).fail(function (xhr) {
                    if (stale()) { return; }
                    self.setBusy(false);
                    self.hideResults();
                    var body = xhr.responseJSON || {};
                    var msg = body.message || t('failed', 'Search failed.');
                    if (/missing|api[_ ]?key|not configured/i.test(msg)) {
                        msg += ' ' + t('addKey', 'Add your Google Places API key in EmbedPress → Google Reviews.');
                    }
                    self.setStatus(msg, 'error');
                });
            },

            onPick: function (e) {
                var $li = $(e.currentTarget);
                // Locked row (free user at the 1-place cap, net-new place) → send to
                // upgrade instead of selecting, mirroring the settings/block pickers.
                if ($li.attr('data-locked') === '1') {
                    window.open(UPGRADE_URL, '_blank', 'noopener');
                    return;
                }
                this.commitPick($li.attr('data-id') || '', $li.attr('data-name') || '', $li.attr('data-address') || '');
            },

            // A free user is at the 1-place cap once the global library has ≥1
            // saved place. Pro lifts it. Same rule as the settings + block pickers.
            placeLimitReached: function () {
                if (PRO_ACTIVE) { return false; }
                var saved = (this._lists && this._lists.saved) || [];
                return saved.length >= 1;
            },

            // Hide + clear the whole results panel (list + note).
            hideResults: function () {
                this.ui.results.empty();
                this.ui.resultsNote.empty().prop('hidden', true);
                this.ui.resultsPanel.prop('hidden', true).hide();
            },

            onClear: function () {
                this.writeValue({ place_id: '', place_name: '', place_address: '' });
                this.renderSelected();
                var self = this;
                setTimeout(function () { self.ui.input.focus(); }, 0);
            },
        });

        elementor.addControlView(
            'ep_gr_place_picker',
            PlacePickerView
        );
    });
})(jQuery);
