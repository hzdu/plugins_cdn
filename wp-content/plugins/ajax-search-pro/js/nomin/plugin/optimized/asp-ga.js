(function($){
    "use strict";
    let functions = {
        gaPageview: function(term) {
            let $this = this;
            let tracking_id = $this.gaGetTrackingID();
            // noinspection JSUnresolvedVariable
            if ( typeof ASP.analytics == 'undefined' || ASP.analytics.method != 'pageview' )
                return false;
            // noinspection JSUnresolvedVariable
            if ( ASP.analytics.string != '' ) {
                // YOAST uses __gaTracker, if not defined check for ga, if nothing go null, FUN EH??
                // noinspection JSUnresolvedVariable
                let _ga = typeof __gaTracker == "function" ? __gaTracker : (typeof ga == "function" ? ga : false);
                let _gtag = typeof gtag == "function" ? gtag : false;

                if (!window.location.origin) {
                    window.location.origin = window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port : '');
                }
                // Multisite Subdirectory (if exists)
                // noinspection JSUnresolvedVariable
                let url = $this.o.homeurl.replace(window.location.origin, '');

                // GTAG bypass pageview tracking method
                if ( _gtag !== false ) {
                    if ( tracking_id !== false ) {
                        // noinspection JSUnresolvedVariable
                        _gtag('config', tracking_id, {'page_path': url + ASP.analytics.string.replace("{asp_term}", term)});
                    }
                } else if ( _ga !== false ) {
                    if ( tracking_id !== false ) {
                        _ga('create', tracking_id, 'auto');
                    }
                    // noinspection JSUnresolvedVariable
                    _ga('send', 'pageview', {
                        'page': url + ASP.analytics.string.replace("{asp_term}", term),
                        'title': 'Ajax Search'
                    });
                }
            }
        },

        gaEvent: function(which, data) {
            let $this = this;
            let tracking_id = $this.gaGetTrackingID();
            // noinspection JSUnresolvedVariable
            if ( typeof ASP.analytics == 'undefined' || ASP.analytics.method != 'event' )
                return false;

            // Get the scope
            let _gtag = typeof gtag == "function" ? gtag : false;
            // noinspection JSUnresolvedVariable
            let _ga = typeof window.__gaTracker == "function" ? window.__gaTracker :
                (typeof window.ga == "function" ? window.ga : false);

            if ( _gtag === false && _ga === false )
                return false;

            // noinspection JSUnresolvedVariable
            if (
                typeof (ASP.analytics.event[which]) != 'undefined' &&
                ASP.analytics.event[which].active == 1
            ) {
                let def_data = {
                    "search_id": $this.o.id,
                    "search_name": $this.o.name,
                    "phrase": $this.n.text.val(),
                    "option_name": '',
                    "option_value": '',
                    "result_title": '',
                    "result_url": '',
                    "results_count": ''
                };
                // noinspection JSUnresolvedVariable
                let event = {
                    'event_category': ASP.analytics.event[which].category,
                    'event_label': ASP.analytics.event[which].label,
                    'value': ASP.analytics.event[which].value
                };
                data = $.fn.extend(def_data, data);
                Object.keys(data).forEach(function (k) {
                    let v = data[k];
                    v = String(v).replace(/[\s\n\r]+/g, " ").trim();
                    Object.keys(event).forEach(function (kk) {
                        let regex = new RegExp('\{' + k + '\}', 'gmi');
                        event[kk] = event[kk].replace(regex, v);
                    });
                });
                if ( _gtag === false ) {
                    if ( tracking_id !== false ) {
                        tracking_id.forEach(function(id){
                            _ga('create', id, 'auto');
                            // noinspection JSUnresolvedVariable
                            _ga('send', 'event',
                                event.event_category,
                                ASP.analytics.event[which].action,
                                event.event_label,
                                event.value
                            );
                        });
                    } else {
                        // noinspection JSUnresolvedVariable
                        _ga('send', 'event',
                            event.event_category,
                            ASP.analytics.event[which].action,
                            event.event_label,
                            event.value
                        );
                    }
                } else {
                    if ( tracking_id !== false ) {
                        tracking_id.forEach(function(id){
                            event.send_to = id;
                            // noinspection JSUnresolvedVariable
                            _gtag('event', ASP.analytics.event[which].action, event);
                        });
                    } else {
                        // noinspection JSUnresolvedVariable
                        _gtag('event', ASP.analytics.event[which].action, event);
                    }
                }
            }
        },

        gaGetTrackingID: function() {
            let ret = false;
            // noinspection JSUnresolvedVariable
            if ( typeof ASP.analytics == 'undefined' )
                return ret;

            // noinspection JSUnresolvedVariable
            if ( typeof ASP.analytics.tracking_id != 'undefined' && ASP.analytics.tracking_id != '' ) {
                // noinspection JSUnresolvedVariable
                return [ASP.analytics.tracking_id];
            } else {
                // GTAG bypass pageview tracking method
                let _gtag = typeof window.gtag == "function" ? window.gtag : false;
                if ( _gtag === false && typeof window.ga != 'undefined' && typeof window.ga.getAll != 'undefined' ) {
                    let id = [];
                    window.ga.getAll().forEach( function(tracker) {
                        id.push( tracker.get('trackingId') );
                    });
                    return id.length > 0 ? id : false;
                }
            }

            return ret;
        },

        stat_addKeyword: function(id, keyword) {
            let data = {
                action: 'ajaxsearchpro_addkeyword',
                id: id,
                keyword: keyword
            };
            // noinspection JSUnresolvedVariable
            $.fn.ajax({
                'url': ASP.ajaxurl,
                'method': 'POST',
                'data': data,
                'success': function (response) {}
            })
        }
    }
    $.fn.extend(window.WPD.ajaxsearchpro.plugin, functions);
})(WPD.dom);