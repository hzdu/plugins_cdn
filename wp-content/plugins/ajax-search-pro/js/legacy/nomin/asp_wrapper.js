/**
 * An initialization wrapper for Ajax Search Pro
 *
 * This solution gets rid off the nasty inline script declarations once and for all.
 * Instead the search instance params are stored in a hidden div element. This baby here
 * parses through them and does a very simple initialization process.
 * Also, the ASP variable now provides a way for developers to manually initialize the instances
 * anytime, anywhere.
 */

// Use the window to make sure it is in the main scope, I do not trust IE
window.ASP = window.ASP || {};

window.ASP.Base64 = {

// private property
        _keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

// public method for encoding
        encode : function (input) {
            var output = "";
            var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
            var i = 0;

            input = window.ASP.Base64._utf8_encode(input);

            while (i < input.length) {

                chr1 = input.charCodeAt(i++);
                chr2 = input.charCodeAt(i++);
                chr3 = input.charCodeAt(i++);

                enc1 = chr1 >> 2;
                enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                enc4 = chr3 & 63;

                if (isNaN(chr2)) {
                    enc3 = enc4 = 64;
                } else if (isNaN(chr3)) {
                    enc4 = 64;
                }

                output = output +
                    this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
                    this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);

            }

            return output;
        },

// public method for decoding
        decode : function (input) {
            var output = "";
            var chr1, chr2, chr3;
            var enc1, enc2, enc3, enc4;
            var i = 0;

            // noinspection RegExpRedundantEscape
            input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

            while (i < input.length) {

                enc1 = this._keyStr.indexOf(input.charAt(i++));
                enc2 = this._keyStr.indexOf(input.charAt(i++));
                enc3 = this._keyStr.indexOf(input.charAt(i++));
                enc4 = this._keyStr.indexOf(input.charAt(i++));

                chr1 = (enc1 << 2) | (enc2 >> 4);
                chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                chr3 = ((enc3 & 3) << 6) | enc4;

                output = output + String.fromCharCode(chr1);

                if (enc3 != 64) {
                    output = output + String.fromCharCode(chr2);
                }
                if (enc4 != 64) {
                    output = output + String.fromCharCode(chr3);
                }

            }

            output = window.ASP.Base64._utf8_decode(output);

            return output;

        },

// private method for UTF-8 encoding
        _utf8_encode : function (string) {
            string = string.replace(/\r\n/g,"\n");
            var utftext = "";

            for (var n = 0; n < string.length; n++) {

                var c = string.charCodeAt(n);

                if (c < 128) {
                    utftext += String.fromCharCode(c);
                }
                else if((c > 127) && (c < 2048)) {
                    utftext += String.fromCharCode((c >> 6) | 192);
                    utftext += String.fromCharCode((c & 63) | 128);
                }
                else {
                    utftext += String.fromCharCode((c >> 12) | 224);
                    utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                    utftext += String.fromCharCode((c & 63) | 128);
                }

            }

            return utftext;
        },

// private method for UTF-8 decoding
        _utf8_decode : function (utftext) {
            var string = "";
            var i = 0, c2, c3, c = 0;

            while ( i < utftext.length ) {
                c = utftext.charCodeAt(i);

                if (c < 128) {
                    string += String.fromCharCode(c);
                    i++;
                } else if((c > 191) && (c < 224)) {
                    c2 = utftext.charCodeAt(i+1);
                    string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                    i += 2;
                } else {
                    c2 = utftext.charCodeAt(i+1);
                    c3 = utftext.charCodeAt(i+2);
                    string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                    i += 3;
                }
            }

            return string;
        }

    };

window.ASP.instances = {
    instances: [],
    get: function(id, instance) {
        this.clean();
        if ( typeof id === 'undefined' || id == 0) {
            return this.instances;
        } else {
            var i;
            if ( typeof instance === 'undefined' ) {
                var ret = [];
                for ( i=0; i<this.instances.length; i++ ) {
                    if ( this.instances[i].o.id == id ) {
                        ret.push(this.instances[i]);
                    }
                }
                return ret.length > 0 ? ret : false;
            } else {
                for ( i=0; i<this.instances.length; i++ ) {
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
        for ( var i=0; i<this.instances.length; i++ ) {
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
        var $ = jQuery,
            unset = [], _this = this;
        this.instances.forEach(function(v, k){
            if ( $('.asp_m_' + v.o.rid).length == 0 ) {
                unset.push(k);
            }
        });
        unset.forEach(function(k){
            _this.instances[k].destroy();
            _this.instances.splice(k, 1);
        });
    },
    destroy: function(id, instance) {
        var i = this.get(id, instance);
        if ( i !== false ) {
            if ( Array.isArray(i) ) {
                i.forEach(function (s) {
                    s.destroy();
                });
                this.instances = [];
            } else {
                var u = 0;
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

window.ASP.getScope = function() {
    /**
     * Explanation:
     * If the sript is scoped, the first argument is always passed in a localized jQuery
     * variable, while the actual parameter can be aspjQuery or jQuery (or anything) as well.
     */
    if (typeof jQuery !== "undefined") {
        // Is there more than one jQuery? Let's try to find the one where ajax search pro is added
        if ( typeof jQuery.fn.ajaxsearchpro == 'undefined' ) {
            // Let's try noconflicting through all the versions
            var temp = jQuery;
            var original = jQuery;
            for (var i = 0; i < 10; i++) {
                if (typeof temp.fn.ajaxsearchpro == 'undefined') {
                    temp = jQuery.noConflict(true);
                } else {
                    // Restore the globals to the initial, original one
                    window.jQuery = window.$ = original;
                    return temp;
                }
            }
        } else {
            return jQuery;
        }
    }
    return window.jQuery;
};

window.ASP.initialized = false;

// Call this function if you need to initialize an instance that is printed after an AJAX call
// Calling without an argument initializes all instances found.
window.ASP.initialize = function(id) {
    // this here is either window.ASP or window._ASP
    var _this = this;

    // Some weird ajax loader problem prevention
    if ( typeof _this.getScope == 'undefined' || typeof _this.version == 'undefined' )
        return false;

    // Yeah I could use $ or jQuery as the scope variable, but I like to avoid magical errors..
    var scope = _this.getScope(),
        selector = ".asp_init_data";


    if (typeof id !== 'undefined')
        selector = "div[id*=asp_init_id_" + id + "]";

    /**
     * Getting around inline script declarations with this solution.
     * So these new, invisible divs contains a JSON object with the parameters.
     * Parse all of them and do the declaration.
     */
    scope(selector).each(function(){
        var $asp = scope(this).closest('.asp_w_container').find('.asp_m'),
            jsonData = scope(this).data("aspdata");
        if (typeof jsonData === "undefined") return true;   // Do not return false, it breaks the loop!

        if ( $asp.length == 0 || typeof $asp.get(0).hasAsp != 'undefined' ) {
            return true;
        }
        jsonData = window.ASP.Base64.decode(jsonData);
        if (typeof jsonData === "undefined" || jsonData == "") return true; // Do not return false, it breaks the loop!

        $asp.addClass("hasASP");
        $asp.get(0).hasAsp = true;

        return $asp.ajaxsearchpro(JSON.parse(jsonData));
    });

    if ( _this.highlight.enabled ) {
        var data = localStorage.getItem('asp_phrase_highlight');
        localStorage.removeItem('asp_phrase_highlight');

        if ( data != null ) {
            data = JSON.parse(data);
            scope.each(_this.highlight.data, function(i, o){
                if ( o.id == data.id ) {
                    var selector = o.selector != '' && scope(o.selector).length > 0 ? o.selector : 'article';
                    selector = scope(selector).length > 0 ? selector : 'body';
                    // noinspection JSUnresolvedVariable
                    scope(selector).highlight(data.phrase, { element: 'span', className: 'asp_single_highlighted_' + data.id, wordsOnly: o.whole, excludeParents : '.asp_w, .asp-try' });
                    if ( o.scroll && scope('.asp_single_highlighted_' + data.id).length > 0 ) {
                        var stop = scope('.asp_single_highlighted_' + data.id).offset().top - 120;
                        if (scope("#wpadminbar").length > 0)
                            stop -= scope("#wpadminbar").height();
                        // noinspection JSUnresolvedVariable
                        stop = stop + o.scroll_offset;
                        stop = stop < 0 ? 0 : stop;
                        scope('html').animate({
                            "scrollTop": stop
                        }, {
                            duration: 500
                        });
                    }
                    return false;
                }
            });
        }
    }

    _this.initialized = true;
};

window.ASP.ready = function() {
    var _this = this;
    var scope = _this.getScope();
    var t = null;
    var iv = null;
    var ivc = 0;

    // noinspection JSUnresolvedVariable
    if ( _this.css_async ) {
        if ( _this.css_loaded == 1 ) {
            _this.initialize();
        } else {
            iv = setInterval(function () {
                ivc++;
                if (_this.css_loaded == 1 || ivc > 80) {
                    scope(function () {
                        _this.initialize();
                    });

                    // Redundancy for safety
                    scope(document).on('load', function () {
                        // It should be initialized at this point, but you never know..
                        if (!_this.initialized) {
                            _this.initialize();
                        }
                    });
                    clearInterval(iv);
                }
            }, 50);
        }
    } else {
        scope(function(){
            _this.initialize();
        });
        scope(document).on('load', function () {
            if (!_this.initialized) {
                _this.initialize();
                console.log("ASP initialized via window.load");
            }
        });
    }

    // DOM tree modification detection to re-initialize automatically if enabled
    // noinspection JSUnresolvedVariable
    if (typeof ASP.detect_ajax != "undefined" && ASP.detect_ajax == 1) {
        var observer = new MutationObserver(function() {
            clearTimeout(t);
            t = setTimeout(function () {
                _this.initialize();
            }, 500);
        });
        function addObserverIfDesiredNodeAvailable() {
            var db = document.querySelector("body");
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

    var ttt;
    // Known slide-out and other type of menus to initialize on click
    var triggerSelectors = '#menu-item-search, .fa-search, .fa, .fas';
    // Avada theme
    triggerSelectors = triggerSelectors + ', .fusion-flyout-menu-toggle, .fusion-main-menu-search-open';
    // Be theme
    triggerSelectors = triggerSelectors + ', #search_button';
    // The 7 theme
    triggerSelectors = triggerSelectors + ', .mini-search.popup-search';
    // Flatsome theme
    triggerSelectors = triggerSelectors + ', .icon-search';
    // Enfold theme
    triggerSelectors = triggerSelectors + ', .menu-item-search-dropdown';
    // Uncode theme
    triggerSelectors = triggerSelectors + ', .mobile-menu-button';
    // Newspaper theme
    triggerSelectors = triggerSelectors + ', .td-icon-search, .tdb-search-icon';
    // Bridge theme
    triggerSelectors = triggerSelectors + ', .side_menu_button, .search_button';
    // Jupiter theme
    triggerSelectors = triggerSelectors + ', .raven-search-form-toggle';
    // Elementor trigger lightbox & other elementor stuff
    triggerSelectors = triggerSelectors + ', [data-elementor-open-lightbox], .elementor-button-link, .elementor-button';
    triggerSelectors = triggerSelectors + ', i[class*=-search], a[class*=-search]';

    // Attach this to the document ready, as it may not attach if this is loaded early
    scope(function(){
        scope('body').on('click touchend', triggerSelectors, function(){
            clearTimeout(ttt);
            ttt = setTimeout(function(){
                _this.initialize();
            }, 500);
        });
    });

    // Elementor popup events (only works with jQuery)
    if ( typeof jQuery != 'undefined' ) {
        jQuery(document).on('elementor/popup/show', function(){
            setTimeout(function () {
                _this.initialize();
            }, 10);
        });
    }
};

window.ASP.api = (function() {
    var a4 = function(id, instance, func, args) {
            var s = ASP.instances.get(id, instance);
            return s !== false && s[func].apply(s, [args]);
        },
        a3 = function(id, func, args) {
            var s;
            if ( !isNaN(parseFloat(func)) && isFinite(func) ) {
                s = ASP.instances.get(id, func);
                return s !== false && s[args].apply(s);
            } else {
                s = ASP.instances.get(id);
                return s !== false && s.forEach(function(i){
                    i[func].apply(i, [args]);
                });
            }
        },
        a2 = function(id, func) {
            var s;
            if ( func == 'exists' ) {
                return ASP.instances.exist(id);
            }
            s = ASP.instances.get(id);
            return s !== false && s.forEach(function(i){
                i[func].apply(i);
            });
        };
    if ( arguments.length == 4 ){
        return(
            a4.apply( this, arguments )
        );
    } else if ( arguments.length == 3 ) {
        return(
            a3.apply( this, arguments )
        );
    } else if ( arguments.length == 2 ) {
        return(
            a2.apply( this, arguments )
        );
    } else if ( arguments.length == 0 ) {
        console.log("Usage: ASP.api(id, [optional]instance, function, [optional]args);");
        console.log("For more info: https://knowledgebase.ajaxsearchpro.com/other/javascript-api");
    }
});

// Make a reference clone, just in case if an ajax page loader decides to override
window._ASP = ASP;

// Call the ready method
window._ASP.ready();