/*!
 * MediaElement.js
 * http://www.mediaelementjs.com/
 *
 * Wrapper that mimics native HTML5 MediaElement (audio and video)
 * using a variety of technologies (pure JavaScript, Flash, iframe)
 *
 * Copyright 2010-2017, John Dyer (http://j.hn/)
 * License: MIT
 *
 */
!function r(i, l, a) {
    function d(t, e) {
        if (!l[t]) {
            if (!i[t]) {
                var s = "function" == typeof require && require;
                if (!e && s) return s(t, !0);
                if (p) return p(t, !0);
                var o = new Error("Cannot find module '" + t + "'");
                throw o.code = "MODULE_NOT_FOUND", o
            }
            var n = l[t] = {exports: {}};
            i[t][0].call(n.exports, function (e) {
                return d(i[t][1][e] || e)
            }, n, n.exports, r, i, l, a)
        }
        return l[t].exports
    }

    for (var p = "function" == typeof require && require, e = 0; e < a.length; e++) d(a[e]);
    return d
}({
    1: [function (e, t, s) {
        "use strict";
        mejs.i18n.en["mejs.speed-rate"] = "Speed Rate", Object.assign(mejs.MepDefaults, {
            speeds: ["2.00", "1.50", "1.25", "1.00", "0.75"],
            defaultSpeed: "1.00",
            speedChar: "x",
            speedText: null
        }), Object.assign(MediaElementPlayer.prototype, {
            buildspeed: function (l, e, t, a) {
                var d = this;
                if (null !== d.media.rendererName && /(native|html5)/i.test(d.media.rendererName)) {
                    for (var o = [], s = mejs.Utils.isString(d.options.speedText) ? d.options.speedText : mejs.i18n.t("mejs.speed-rate"), p = function (e) {
                        for (var t = 0, s = o.length; t < s; t++) if (o[t].value === e) return o[t].name
                    }, c = void 0, n = !1, r = 0, i = d.options.speeds.length; r < i; r++) {
                        var u = d.options.speeds[r];
                        "string" == typeof u ? (o.push({
                            name: "" + u + d.options.speedChar,
                            value: u
                        }), u === d.options.defaultSpeed && (n = !0)) : (o.push(u), u.value === d.options.defaultSpeed && (n = !0))
                    }
                    n || o.push({
                        name: d.options.defaultSpeed + d.options.speedChar,
                        value: d.options.defaultSpeed
                    }), o.sort(function (e, t) {
                        return parseFloat(t.value) - parseFloat(e.value)
                    }), d.cleanspeed(l), l.speedButton = document.createElement("div"), l.speedButton.className = d.options.classPrefix + "button " + d.options.classPrefix + "speed-button", l.speedButton.innerHTML = '<button type="button" aria-controls="' + d.id + '" title="' + s + '" aria-label="' + s + '" tabindex="0">' + p(d.options.defaultSpeed) + '</button><div class="' + d.options.classPrefix + "speed-selector " + d.options.classPrefix + 'offscreen"><ul class="' + d.options.classPrefix + 'speed-selector-list"></ul></div>', d.addControlElement(l.speedButton, "speed");
                    for (var f = 0, v = o.length; f < v; f++) {
                        var h = d.id + "-speed-" + o[f].value;
                        l.speedButton.querySelector("ul").innerHTML += '<li class="' + d.options.classPrefix + 'speed-selector-list-item"><input class="' + d.options.classPrefix + 'speed-selector-input" type="radio" name="' + d.id + '_speed"disabled="disabled" value="' + o[f].value + '" id="' + h + '"  ' + (o[f].value === d.options.defaultSpeed ? ' checked="checked"' : "") + '/><label for="' + h + '" class="' + d.options.classPrefix + "speed-selector-label" + (o[f].value === d.options.defaultSpeed ? " " + d.options.classPrefix + "speed-selected" : "") + '">' + o[f].name + "</label></li>"
                    }
                    c = d.options.defaultSpeed, l.speedSelector = l.speedButton.querySelector("." + d.options.classPrefix + "speed-selector");
                    for (var m = ["mouseenter", "focusin"], S = ["mouseleave", "focusout"], x = l.speedButton.querySelectorAll('input[type="radio"]'), b = l.speedButton.querySelectorAll("." + d.options.classPrefix + "speed-selector-label"), y = 0, g = m.length; y < g; y++) l.speedButton.addEventListener(m[y], function () {
                        mejs.Utils.removeClass(l.speedSelector, d.options.classPrefix + "offscreen"), l.speedSelector.style.height = l.speedSelector.querySelector("ul").offsetHeight, l.speedSelector.style.top = -1 * parseFloat(l.speedSelector.offsetHeight) + "px"
                    });
                    for (var k = 0, P = S.length; k < P; k++) l.speedSelector.addEventListener(S[k], function () {
                        mejs.Utils.addClass(this, d.options.classPrefix + "offscreen")
                    });
                    for (var j = 0, E = x.length; j < E; j++) {
                        var B = x[j];
                        B.disabled = !1, B.addEventListener("click", function () {
                            var e = this.value;
                            c = e, a.playbackRate = parseFloat(e), l.speedButton.querySelector("button").innerHTML = p(e);
                            for (var t = l.speedButton.querySelectorAll("." + d.options.classPrefix + "speed-selected"), s = 0, o = t.length; s < o; s++) mejs.Utils.removeClass(t[s], d.options.classPrefix + "speed-selected");
                            this.checked = !0;
                            for (var n = mejs.Utils.siblings(this, function (e) {
                                return mejs.Utils.hasClass(e, d.options.classPrefix + "speed-selector-label")
                            }), r = 0, i = n.length; r < i; r++) mejs.Utils.addClass(n[r], d.options.classPrefix + "speed-selected")
                        })
                    }
                    for (var U = 0, C = b.length; U < C; U++) b[U].addEventListener("click", function () {
                        var e = mejs.Utils.siblings(this, function (e) {
                            return "INPUT" === e.tagName
                        })[0], t = mejs.Utils.createEvent("click", e);
                        e.dispatchEvent(t)
                    });
                    d.options.keyActions.push({
                        keys: [60, 188], action: function (e, t, s, o) {
                            if ("<" == o.key) for (var n = 0; n < x.length - 1; n++) if (x[n].checked) {
                                var r = x[n + 1];
                                r.dispatchEvent(mejs.Utils.createEvent("click", r));
                                break
                            }
                        }
                    }, {
                        keys: [62, 190], action: function (e, t, s, o) {
                            if (">" == o.key) for (var n = 1; n < x.length; n++) if (x[n].checked) {
                                var r = x[n - 1];
                                r.dispatchEvent(mejs.Utils.createEvent("click", r));
                                break
                            }
                        }
                    }), l.speedSelector.addEventListener("keydown", function (e) {
                        e.stopPropagation()
                    }), a.addEventListener("loadedmetadata", function () {
                        c && (a.playbackRate = parseFloat(c))
                    })
                }
            }, cleanspeed: function (e) {
                e && (e.speedButton && e.speedButton.parentNode.removeChild(e.speedButton), e.speedSelector && e.speedSelector.parentNode.removeChild(e.speedSelector))
            }
        })
    }, {}]
}, {}, [1]);
// Remove download button for web-kit players
window.addEventListener('DOMContentLoaded', (event) => {

    for (let singleAudioTag of document.querySelectorAll('.penci-texttospeech-wrapper audio')) {

        // Playback speed
        const $speeds = singleAudioTag.parentElement.parentElement.parentElement.querySelector('.penci-texttospeech--speed');
        if ($speeds !== null) {

            /** Init saved speed */
            const savedSpeed = getStorageSettings('speed');

            /** Apply saved speed from the last visit */
            if (savedSpeed) {

                const $speedButtonSaved = document.querySelector(`button.penci-texttospeech--speed-button[data-speed='${savedSpeed}']`);

                if ($speedButtonSaved) {

                    speedClick({target: $speedButtonSaved});

                }

            }

            /** Listen for clicks */
            $speeds.addEventListener('click', speedClick);

            /**
             * Speed button click handler
             * @param e
             */
            function speedClick(e) {

                const $speedButton = e.target;

                setSpeed($speedButton.getAttribute('data-speed'));
                setSpeedButtonActive($speeds, $speedButton);

            }

            /**
             * Set speed for Penci Text To Speech player
             * @param speed
             */
            function setSpeed(speed) {

                // WP Player
                if (typeof window.MediaElementPlayer === 'function') {

                    new MediaElementPlayer(singleAudioTag.id);

                }

                singleAudioTag.playbackRate = speed;

                updateStorage('speed', speed);

            }

            /**
             * Set active-speed class for active button
             * @param $speeds
             * @param $speedButton
             */
            function setSpeedButtonActive($speeds, $speedButton) {

                $speeds.querySelectorAll('.active-speed').forEach(element => element.classList.remove('active-speed'));
                $speedButton.classList.add('active-speed');

            }

        }

        // Disallow downloading interface
        if (singleAudioTag.parentElement.getAttribute('data-download') !== '1') {

            singleAudioTag.controlsList = 'nodownload';

        }

        // Chrome style player
        if (singleAudioTag.parentElement.parentElement.classList.contains('speaker-chrome')) {

            const $playerWrapper = singleAudioTag.parentElement.parentElement;
            let volumeShow = false;

            /** Show volume slider */
            $playerWrapper.addEventListener('mouseover', function (e) {

                if (e.target.parentElement.classList.contains('mejs-volume-button') && !volumeShow) {

                    $playerWrapper.classList.remove('mejs-volume-hide');
                    $playerWrapper.classList.add('mejs-volume-show');
                    volumeShow = true;

                }

            }, {passive: true});

            /** Hide volume slider */
            $playerWrapper.addEventListener('mouseout', function (e) {

                if (e.target.className.length > 0 && !e.target.className.includes('mejs-horizontal-volume') && volumeShow) {

                    $playerWrapper.classList.add('mejs-volume-hide');

                    setTimeout(() => {

                        $playerWrapper.classList.remove('mejs-volume-show');
                        $playerWrapper.classList.remove('mejs-volume-hide');

                    }, 100);

                    volumeShow = false;

                }

            }, {passive: true});

            /** Add the More menu button */
            setTimeout(() => {

                const $playerControls = $playerWrapper.querySelector('.mejs-controls');
                const $downloadLink = $playerWrapper.parentElement.querySelector('.penci-texttospeech-download-box a');

                // Dont add more menu if download link is not exist
                if ($downloadLink === null) {
                    return
                }

                // Add More menu button and menu
                const $moreButton = document.createElement('div');
                $moreButton.classList.add('mejs-button');
                $moreButton.classList.add('mejs-more-button');
                $moreButton.innerHTML = '<button type="button" title="More" aria-label="More" tabindex="0"></button>';
                $moreButton.addEventListener('click', (e) => {

                    // Remove old menu or create new menu
                    if (document.querySelector('.mejs-more-menu') !== null) {

                        document.querySelector('.mejs-more-menu').remove();

                    } else {

                        // Add more menu
                        const $moreMenu = document.createElement('div');
                        $moreMenu.classList.add('mejs-more-menu');
                        $moreMenu.style.bottom = `${e.layerY}px`;
                        $moreMenu.style.right = `${e.layerX}px`;
                        $moreMenu.innerHTML = `<a href="${$downloadLink.href}" class="mejs-more-menu--download" target="_blank" rel="noopener">Download</a>`;

                        $playerControls.appendChild($moreMenu);

                    }

                }, {passive: false})

                // Remove More menu if click somewhere
                document.addEventListener('click', (e) => {

                    // Exit if no one menu founded on the page
                    if (document.querySelector('.mejs-more-menu') === null) {
                        return;
                    }

                    const elClassName = e.target.className;
                    if (elClassName !== 'mejs-more-menu--download' && elClassName !== 'mejs-more-button' && elClassName !== '') {

                        document.querySelector('.mejs-more-menu').remove();

                    }

                }, {passive: true});

                $playerControls.appendChild($moreButton);

            }, 1);

        }

        // Backend duration
        const $dataHolder = singleAudioTag.closest('.penci-texttospeech-box > div');
        if ($dataHolder.getAttribute('data-length-formatted')) {

            const lengthFormatted = $dataHolder.getAttribute('data-length-formatted');

            setTimeout(() => {

                if ($dataHolder.querySelector('.mejs-duration')) {
                    $dataHolder.querySelector('.mejs-duration').innerHTML = lengthFormatted;
                }

            }, 1);

        }

        /**
         * Get settings from storage by key
         * @param key
         * @returns {boolean|*}
         */
        function getStorageSettings(key) {

            let storedSettings = window.localStorage.getItem('PenciTextToSpeech');

            if (storedSettings) {

                let localStorage = JSON.parse(storedSettings);
                return localStorage[key] ? localStorage[key] : false;

            } else {

                return false;

            }

        }

        /**
         * Update local storage
         * @param key
         * @param value
         */
        function updateStorage(key, value) {

            const storage = window.localStorage.getItem('PenciTextToSpeech');

            if (storage) {

                let localStorage = JSON.parse(storage);
                localStorage[key] = value;

                window.localStorage.setItem('PenciTextToSpeech', JSON.stringify(localStorage));

            } else {

                let localStorage = {};
                localStorage[key] = value;

                window.localStorage.setItem('PenciTextToSpeech', JSON.stringify(localStorage));

            }

        }

    }

});

