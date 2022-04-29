window._ASP_load = function () {
    "use strict";
    let $ = WPD.dom;

    window.ASP.instances = {
        instances: [],
        get: function(id, instance) {
            this.clean();
            if ( typeof id === 'undefined' || id == 0) {
                return this.instances;
            } else {
                if ( typeof instance === 'undefined' ) {
                    let ret = [];
                    for ( let i=0; i<this.instances.length; i++ ) {
                        if ( this.instances[i].o.id == id ) {
                            ret.push(this.instances[i]);
                        }
                    }
                    return ret.length > 0 ? ret : false;
                } else {
                    for ( let i=0; i<this.instances.length; i++ ) {
                        if ( this.instances[i].o.id == id && this.instances[i].o.iid == instance ) {
                            return this.instances[i];
                        }
                    }
                }
            }
            return false;
        },
        set: function(obj) {
            if ( !this.exist(obj.o.id, obj.o.iid) ) {
                this.instances.push(obj);
                return true;
            } else {
                return false;
            }
        },
        exist: function(id, instance) {
            this.clean();
            for ( let i=0; i<this.instances.length; i++ ) {
                if ( this.instances[i].o.id == id ) {
                    if (typeof instance === 'undefined') {
                        return true;
                    } else if (this.instances[i].o.iid == instance) {
                        return true;
                    }
                }
            }
            return false;
        },
        clean: function() {
            let unset = [], _this = this;
            this.instances.forEach(function(v, k){
                if ( $('.asp_m_' + v.o.rid).length == 0 ) {
                    unset.push(k);
                }
            });
            unset.forEach(function(k){
                if ( typeof _this.instances[k] !== 'undefined' ) {
                    _this.instances[k].destroy();
                    _this.instances.splice(k, 1);
                }
            });
        },
        destroy: function(id, instance) {
            let i = this.get(id, instance);
            if ( i !== false ) {
                if ( Array.isArray(i) ) {
                    i.forEach(function (s) {
                        s.destroy();
                    });
                    this.instances = [];
                } else {
                    let u = 0;
                    this.instances.forEach(function(v, k){
                        if ( v.o.id == id && v.o.iid == instance) {
                            u = k;
                        }
                    });
                    i.destroy();
                    this.instances.splice(u, 1);
                }
            }
        }
    };

    window.ASP.initialized = false;
    window.ASP.initializeById = function (id, ignoreViewport) {
        let selector = ".asp_init_data";
        ignoreViewport = typeof ignoreViewport == 'undefined' ? false : ignoreViewport;
        if (typeof id !== 'undefined' && typeof id != 'object')
            selector = "div[id*=asp_init_id_" + id + "]";

        /**
         * Getting around inline script declarations with this solution.
         * So these new, invisible divs contains a JSON object with the parameters.
         * Parse all of them and do the declaration.
         */
        let initialized = 0;
        $(selector).forEach(function (el) {
            // noinspection JSUnusedAssignment
            let $container = $(el).closest('.asp_w_container');
            let $asp = $container.find('.asp_m');
            // $asp.length == 0 -> when fixed compact layout mode is enabled
            if ( $asp.length == 0 || typeof $asp.get(0).hasAsp != 'undefined') {
                ++initialized;
                return true;
            }

            if (!ignoreViewport && !$container.inViewPort(-100)) {
                return true;
            }

            let jsonData = $(el).data("aspdata");
            if (typeof jsonData === "undefined") return true;   // Do not return false, it breaks the loop!

            jsonData = WPD.Base64.decode(jsonData);
            if (typeof jsonData === "undefined" || jsonData == "") return true; // Do not return false, it breaks the loop!

            let args = JSON.parse(jsonData);
            $asp.get(0).hasAsp = true;
            ++initialized;
            return $asp.ajaxsearchpro(args);
        });

        if ($(selector).length == initialized) {
            document.removeEventListener('scroll', ASP.initializeById);
            document.removeEventListener('resize', ASP.initializeById);
        }
    }

// Call this function if you need to initialize an instance that is printed after an AJAX call
// Calling without an argument initializes all instances found.
    window.ASP.initialize = function (id) {
        // this here is either window.ASP or window._ASP
        let _this = this;

        // Some weird ajax loader problem prevention
        if (typeof _this.version == 'undefined')
            return false;

        // noinspection JSUnresolvedVariable
        if ( ASP.script_async_load ) {
            document.addEventListener('scroll', ASP.initializeById, {passive: true});
            document.addEventListener('resize', ASP.initializeById, {passive: true});
            ASP.initializeById(id);
            setTimeout(function () {
                ASP.initializeById(id, true);
            }, 4000);
        } else {
            ASP.initializeById(id, true);
        }

        if (_this.highlight.enabled) {
            let data = localStorage.getItem('asp_phrase_highlight');
            localStorage.removeItem('asp_phrase_highlight');

            if (data != null) {
                data = JSON.parse(data);
                _this.highlight.data.forEach(function (o) {
                    if (o.id == data.id) {
                        let selector = o.selector != '' && $(o.selector).length > 0 ? o.selector : 'article',
                            $highlighted;
                        selector = $(selector).length > 0 ? selector : 'body';
                        // noinspection JSUnresolvedVariable
                        $(selector).highlight(data.phrase, {
                            element: 'span',
                            className: 'asp_single_highlighted_' + data.id,
                            wordsOnly: o.whole,
                            excludeParents: '.asp_w, .asp-try'
                        });
                        $highlighted = $('.asp_single_highlighted_' + data.id);
                        if (o.scroll && $highlighted.length > 0) {
                            let stop = $highlighted.offset().top - 120;
                            let $adminbar = $("#wpadminbar");
                            if ($adminbar.length > 0)
                                stop -= $adminbar.height();
                            // noinspection JSUnresolvedVariable
                            stop = stop + o.scroll_offset;
                            stop = stop < 0 ? 0 : stop;
                            $('html').animate({
                                "scrollTop": stop
                            }, 500);
                        }
                        return false;
                    }
                });
            }
        }

        _this.initialized = true;
    };

    window.ASP.ready = function () {
        let _this = this,
            $body = $('body'),
            t, tt, ttt, ts;

        _this.initialize();

        // DOM tree modification detection to re-initialize automatically if enabled
        // noinspection JSUnresolvedVariable
        if (typeof ASP.detect_ajax != "undefined" && ASP.detect_ajax == 1) {
            let observer = new MutationObserver(function() {
                clearTimeout(t);
                t = setTimeout(function () {
                    _this.initialize();
                }, 500);
            });
            function addObserverIfDesiredNodeAvailable() {
                let db = document.querySelector("body");
                if( !db ) {
                    //The node we need does not exist yet.
                    //Wait 500ms and try again
                    window.setTimeout(addObserverIfDesiredNodeAvailable,500);
                    return;
                }
                observer.observe(db, {subtree: true, childList: true});
            }
            addObserverIfDesiredNodeAvailable();
        }

        /**
         * Sometimes the mutation observer is not ready yet, and the init script is already finished.
         * It can happen when the search is injected via a 3rd party script, on document ready.
         * The init script finishes on document ready, does not find the search instances, but
         * neither does the mutation observer.
         * This should take care of that.
         */
        $(document).on('DOMContentLoaded', function() {
            _this.initializeById();
        });

        $(window).on('resize', function () {
            clearTimeout(tt);
            tt = setTimeout(function () {
                _this.initializeById();
            }, 200);
        });

        // Known slide-out and other type of menus to initialize on click
        ts = '#menu-item-search, .fa-search, .fa, .fas';
        // Avada theme
        ts = ts + ', .fusion-flyout-menu-toggle, .fusion-main-menu-search-open';
        // Be theme
        ts = ts + ', #search_button';
        // The 7 theme
        ts = ts + ', .mini-search.popup-search';
        // Flatsome theme
        ts = ts + ', .icon-search';
        // Enfold theme
        ts = ts + ', .menu-item-search-dropdown';
        // Uncode theme
        ts = ts + ', .mobile-menu-button';
        // Newspaper theme
        ts = ts + ', .td-icon-search, .tdb-search-icon';
        // Bridge theme
        ts = ts + ', .side_menu_button, .search_button';
        // Jupiter theme
        ts = ts + ', .raven-search-form-toggle';
        // Elementor trigger lightbox & other elementor stuff
        ts = ts + ', [data-elementor-open-lightbox], .elementor-button-link, .elementor-button';
        ts = ts + ', i[class*=-search], a[class*=-search]';

        // Attach this to the document ready, as it may not attach if this is loaded early
        $body.on('click touchend', ts, function () {
            clearTimeout(ttt);
            ttt = setTimeout(function () {
                _this.initializeById({}, true);
            }, 300);
        });

        // Elementor popup events (only works with jQuery)
        if ( typeof jQuery != 'undefined' ) {
            jQuery(document).on('elementor/popup/show', function(){
                setTimeout(function () {
                    _this.initializeById({}, true);
                }, 10);
            });
        }
    };

    window.ASP.loadScriptStack = function (stack) {
        let scriptTag;
        if ( stack.length > 0 ) {
            scriptTag = document.createElement('script');
            scriptTag.src = stack.shift()['src'];
            scriptTag.onload = function () {
                if ( stack.length > 0 ) {
                    window.ASP.loadScriptStack(stack)
                } else {
                    window.ASP.ready();
                }
            }
            document.body.appendChild(scriptTag);
        }
    }

    window.ASP.init = function () {
        // noinspection JSUnresolvedVariable
        if (ASP.script_async_load) {   // Opimized Normal
            // noinspection JSUnresolvedVariable
            window.ASP.loadScriptStack(ASP.additional_scripts);
        } else {
            if (typeof WPD.ajaxsearchpro !== 'undefined') {   // Classic normal
                window.ASP.ready();
            }
        }
    };

    // noinspection JSUnresolvedVariable
    if (
        !window.ASP.css_async ||
        typeof window.ASP.css_loaded != 'undefined' // CSS loader finished, but this script was not ready yet
    ) {
        window.WPD.intervalUntilExecute(window.ASP.init, function() {
            return typeof window.ASP.version != 'undefined' && $.fn.ajaxsearchpro != 'undefined'
        });
    }
};
// Run on document ready
(function() {
    // Preload script executed?
    if ( typeof WPD != 'undefined' && typeof WPD.dom != 'undefined' ) {
        window._ASP_load();
    } else {
        document.addEventListener('wpd-dom-core-loaded', window._ASP_load);
    }
})();