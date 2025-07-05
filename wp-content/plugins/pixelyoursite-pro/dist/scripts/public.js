/* global pysOptions */

! function ($, options) {
    if (options.debug) {
        console.log('PYS:', options);
    }

    var uniqueId = {};

    var firstVisit = false;

    var isTrackEventForGA = [];

    var isAdsLoad = false;

    let gtm_variables = {};
    let gtm_datalayername = "dynamicVariable";
    var domain = '';
    if(options.hasOwnProperty("track_cookie_for_subdomains") && options.track_cookie_for_subdomains) {
        domain = getRootDomain(true);
    }



    var loadTags = [];

    var dummyPinterest = function () {

        /**
         * Public API
         */
        return {
            tag: function() {
                return "pinterest";
            },
            isEnabled: function () {},

            disable: function () {},

            loadPixel: function () {},

            fireEvent: function (name, data) {
                return false;
            },

            onAdSenseEvent: function (event) {},

            onClickEvent: function (params) {},

            onWatchVideo: function (params) {},

            onCommentEvent: function (event) {},

            onFormEvent: function (params) {},

            onDownloadEvent: function (params) {},



            onWooAddToCartOnButtonEvent: function (product_id) {},

            onWooAddToCartOnSingleEvent: function (product_id, qty, product_type, is_external, $form) {},

            onWooRemoveFromCartEvent: function (cart_item_hash) {},

            onWooAffiliateEvent: function (product_id) {},

            onWooPayPalEvent: function (event) {},

            onEddAddToCartOnButtonEvent: function (download_id, price_index, qty) {},

            onEddRemoveFromCartEvent: function (item) {},

            onPageScroll: function (event) {},
            onTime: function (event) {

            },

        }

    }();

    var dummyBing = function () {

        /**
         * Public API
         */
        return {
            tag: function() {
                return "bing";
            },
            isEnabled: function () {},

            disable: function () {},

            loadPixel: function () {},

            fireEvent: function (name, data) {
                return false;
            },

            onAdSenseEvent: function (event) {},

            onClickEvent: function (params) {},

            onWatchVideo: function (params) {},

            onCommentEvent: function (event) {},

            onFormEvent: function (params) {},

            onDownloadEvent: function (params) {},


            onWooAddToCartOnButtonEvent: function (product_id) {},

            onWooAddToCartOnSingleEvent: function (product_id, qty, product_type, is_external, $form) {},

            onWooRemoveFromCartEvent: function (cart_item_hash) {},

            onWooAffiliateEvent: function (product_id) {},

            onWooPayPalEvent: function (event) {},

            onEddAddToCartOnButtonEvent: function (download_id, price_index, qty) {},

            onEddRemoveFromCartEvent: function (item) {},
            onPageScroll: function (event) {},
            onTime: function (event) {

            },
        }

    }();

    var Utils = function (options) {


        var Pinterest = dummyPinterest;

        var Bing = dummyBing;

        var gtag_loaded = false;

        var gtm_loaded = false;

        let isNewSession = checkSession();

        let dataLayerName = 'dataLayerPYS';

        let GTMdataLayerName = 'dataLayer';


        function loadPixels() {

            if (!options.gdpr.all_disabled_by_api) {
                if (!options.gdpr.tiktok_disabled_by_api) {
                    TikTok.loadPixel();
                }

                if (!options.gdpr.facebook_disabled_by_api) {
                    Facebook.loadPixel();
                }

                if (!options.gdpr.analytics_disabled_by_api) {
                    Analytics.loadPixel();
                }

                if (!options.gdpr.google_ads_disabled_by_api) {
                    GAds.loadPixel();
                }

                if (!options.gdpr.analytics_disabled_by_api) {
                    GTM.loadPixel();
                }

                if (!options.gdpr.pinterest_disabled_by_api) {
                    Pinterest.loadPixel();
                }

                if (!options.gdpr.bing_disabled_by_api) {
                    Bing.loadPixel();
                }

            }
            if (options.gdpr.consent_magic_integration_enabled && typeof CS_Data !== "undefined") {
                if (typeof CS_Data.cs_google_analytics_consent_mode !== "undefined" && CS_Data.cs_google_analytics_consent_mode == 1) {
                    Analytics.loadPixel();
                }
                if (typeof CS_Data.cs_google_ads_consent_mode !== "undefined" && CS_Data.cs_google_ads_consent_mode == 1 ) {
                    GAds.loadPixel();
                }
            }
        }

        /**
         * WATCHVIDEO UTILS
         */

        function isJSApiAttrEnabled(url) {
            return url.indexOf('enablejsapi') > -1;
        }

        function isOriginAttrEnabled(url) {
            return url.indexOf('origin') > -1;
        }

        // Returns key/value pairs of percentages: number of seconds to achieve
        function getVideoCompletionMarks(duration) {

            var marks = {};
            var points = [0, 10, 50, 90, 100];

            for (var i = 0; i < points.length; i++) {

                var _point = points[i];
                var _mark = _point + '%';
                var _time = duration * _point / 100;

                if (_point === 100) {
                    _time = _time - 1;
                }

                // 10% => 123
                marks[_mark] = Math.floor(_time);

            }

            return marks;

        }

        // Determine if the element is a YouTube video or not
        function tagIsYouTubeVideo(tag) {
            var src = tag.src || '';
            return src.indexOf('youtube.com/embed/') > -1 || src.indexOf('youtube.com/v/') > -1;
        }

        function tagIsYouTubeAsyncVideo(tag) {
            if(tag.src && tag.src.indexOf("data:image") !== -1) return false; // video is loaded
            var keys = Object.keys(tag.dataset);
            for(var i = 0;i<keys.length;i++) {
                if(keys[i].toLowerCase().indexOf("src") > -1) {
                    var src = tag.dataset[keys[i]];
                    return src.indexOf('youtube.com/embed/') > -1 || src.indexOf('youtube.com/v/') > -1;
                }
            }
            return false; //not find src
        }

        // Turn embed objects into iframe objects and ensure they have the right parameters
        function normalizeYouTubeIframe(tag) {

            var loc = window.location;
            var a = document.createElement('a');
            a.href = tag.src;
            a.hostname = 'www.youtube.com';
            a.protocol = loc.protocol;
            var tmpPathname = a.pathname.charAt(0) === '/' ? a.pathname : '/' + a.pathname; // IE10 shim

            if (!isJSApiAttrEnabled(a.search)) {
                a.search = (a.search.length > 0 ? a.search + '&' : '') + 'enablejsapi=1';
            }

            // for security reasons, YouTube wants an origin parameter set that matches our hostname
            if (!isOriginAttrEnabled(a.search) && loc.hostname.indexOf('localhost') === -1) {

                var port = loc.port ? ':' + loc.port : '';
                var origin = loc.protocol + '%2F%2F' + loc.hostname + port;

                a.search = a.search + '&origin=' + origin;

            }

            if (tag.type === 'application/x-shockwave-flash') {

                var newIframe = document.createElement('iframe');
                newIframe.height = tag.height;
                newIframe.width = tag.width;
                tmpPathname = tmpPathname.replace('/v/', '/embed/');

                tag.parentNode.parentNode.replaceChild(newIframe, tag.parentNode);

                tag = newIframe;

            }

            a.pathname = tmpPathname;

            if (tag.src !== a.href + a.hash) {
                tag.src = a.href + a.hash;
            }

            return tag;

        }

        // Add event handlers for events emitted by the YouTube API
        function addYouTubeEvents(iframe) {

            var player = YT.get(iframe.id);
            if (!player) {
                player = new YT.Player(iframe, {});
            }

            if (typeof iframe.pauseFlag === 'undefined') {

                iframe.pauseFlag = false;
                player.addEventListener('onStateChange', function (evt) {
                    onYouTubePlayerStateChange(evt, iframe);
                });

            }

        }

        function addDynYouTubeVideos(el) {
            // We only bind to iFrames with a YouTube URL with the enablejsapi=1 and
            // origin=<<hostname>> parameters
            if (el.tagName === 'IFRAME'
                && tagIsYouTubeVideo(el)
                && isJSApiAttrEnabled(el.src)
                && isOriginAttrEnabled(el.src))
            {
                addYouTubeEvents(el);
            }
        }

        // Event handler for events emitted from the YouTube API
        function onYouTubePlayerStateChange(evt, iframe) {

            var stateIndex = evt.data;
            var player = evt.target;
            var targetVideoUrl = player.getVideoUrl();
            var targetVideoId = targetVideoUrl.match(/[?&]v=([^&#]*)/)[1]; // Extract the ID
            var playerState = player.getPlayerState();
            var marks = getVideoCompletionMarks(player.getDuration());

            iframe.playTracker = iframe.playTracker || {};

            if (playerState === YT.PlayerState.PLAYING && !iframe.timer) {

                clearInterval(iframe.timer);

                // check every second to see if we've hit any of our percentage viewed marks
                iframe.timer = setInterval(function () {
                    checkYouTubeCompletion(player, marks, iframe.videoId);
                }, 1000);

            } else {

                clearInterval(iframe.timer);
                iframe.timer = false;

            }

            // playlist edge-case handler
            if (stateIndex === YT.PlayerState.PLAYING) {
                iframe.playTracker[targetVideoId] = true;
                iframe.videoId = targetVideoId;
                iframe.pauseFlag = false;
            }

            if (!iframe.playTracker[iframe.videoId]) {
                return false; // this video hasn't started yet, so this is spam
            }

            if (stateIndex === YT.PlayerState.PAUSED) {

                if (!iframe.pauseFlag) {
                    iframe.pauseFlag = true;
                } else {
                    return false; // we don't want to fire consecutive pause events
                }

            }

        }

        // Trigger event if YouTube video mark was reached
        function checkYouTubeCompletion(player, marks, videoId) {

            var currentTime = player.getCurrentTime();

            player[videoId] = player[videoId] || {};

            for (var key in marks) {

                if (marks[key] <= currentTime && !player[videoId][key]) {
                    player[videoId][key] = true;

                    var data = player.getVideoData();

                    if (key === '0%') {
                        key = 'play';
                    }

                    var params = {
                        video_type: 'youtube',
                        video_id: videoId,
                        video_title: data.title,
                    };

                    let disable_watch_video = [];

                    //Custom
                    if ( options.triggerEventTypes.hasOwnProperty( "video_view" ) ) {
                        Object.entries( options.triggerEventTypes.video_view ).forEach( function ( [ trigger_id, triggers ] ) {
                            triggers.forEach( function ( trigger ) {
                                if ( trigger.type === 'youtube' && trigger.rule === videoId ) {

                                    let pixels = Object.keys( options.triggerEvents[ trigger_id ] );
                                    for ( let i = 0; i < pixels.length; i++ ) {
                                        let event = Utils.clone( options.triggerEvents[ trigger_id ][ pixels[ i ] ] );

                                        if ( trigger.disable_watch_video ) {
                                            disable_watch_video.push( pixels[ i ] );
                                        }

                                        if ( currentTime >= marks[ trigger.value ] ) {
                                            event.params[ "progress" ] = key;
                                            Utils.copyProperties( params, event.params );

                                            if ( event.fired !== true ) {
                                                if ( Utils.isEventInTimeWindow( event.name, event, 'dyn_' + pixels[ i ] + '_' + trigger_id ) ) {
                                                    event = Utils.getFormFilledData( event );
                                                    getPixelBySlag( pixels[ i ] ).fireEvent( event.name, event );
                                                    options.triggerEvents[ trigger_id ][ pixels[ i ] ].fired = true;
                                                }
                                            }
                                        }
                                    }
                                }
                            } )
                        } )
                    }

                    // Auto
                    if( options.automatic.enable_video
                        && options.automatic.enable_youtube
                        && options.dynamicEvents.hasOwnProperty("automatic_event_video")
                    ) {
                        var pixels = Object.keys(options.dynamicEvents.automatic_event_video);

                        for (var i = 0; i < pixels.length; i++) {
                            if ( disable_watch_video.includes( pixels[ i ] ) ) {
                                continue;
                            }
                            var event = Utils.clone(options.dynamicEvents.automatic_event_video[pixels[i]]);
                            event.params["progress"] = key
                            Utils.copyProperties(params, event.params)
                            if ( pixels[i] === 'tiktok' ) {
                                var time_trigger = event.automatic_event_video_trigger;
                                if ( currentTime >= marks[time_trigger] && event.fired !== true ) {
                                    getPixelBySlag(pixels[i]).onWatchVideo(event);

                                    //tiktok watch video fire once
                                    options.dynamicEvents.automatic_event_video[pixels[i]].fired = true;
                                }
                            } else {
                                Utils.copyProperties(Utils.getRequestParams(), event.params);
                                getPixelBySlag(pixels[i]).onWatchVideo(event);
                            }
                        }
                    }

                    if(key == "play") {

                        $.each(options.triggerEventTypes, function (triggerType, events) {
                            $.each(events, function (eventId, triggers) {
                                switch (triggerType) {
                                    case 'video_play':
                                        Utils.fireTriggerEvent(eventId);
                                        break;
                                }

                            });
                        });
                    }

                }

            }

        }

        // Determine if the element is a Vimeo video or not
        function tagIsVimeoVideo(tag) {
            var src = tag.src || '';
            return src.indexOf('player.vimeo.com/video/') > -1;
        }

        function tagIsAsincVimeoVideo(tag) {
            if(tag.src) return false; // video is loaded
            var keys = Object.keys(tag.dataset);
            for(var i = 0;i<keys.length;i++) {
                if(keys[i].toLowerCase().indexOf("src") > -1) {
                    var src = tag.dataset[keys[i]];
                    return src.indexOf('player.vimeo.com/video/') > -1;
                }
            }
            return false; //not find src
        }

        function attachVimeoPlayerToTag(tag) {
            var player = new Vimeo.Player(tag);

            player.getDuration().then(function (pl,seconds) {
                pl.pysMarks = getVideoCompletionMarks(seconds);
            }.bind(null,player));

            player.getVideoTitle().then(function (pl,title) {
                pl.pysVideoTitle = title;
            }.bind(null,player));

            player.getVideoId().then(function (pl,id) {
                pl.pysVideoId = id;
            }.bind(null,player));

            player.pysCompletedMarks = {};

            player.on('play', function () {

                if (this.pysTimer) {
                    return;
                }

                clearInterval(this.pysTimer);

                var player = this;

                this.pysTimer = setInterval(function () {
                    checkVimeoCompletion(player);
                }, 1000);

            });

            player.on('pause', function () {
                clearInterval(this.pysTimer);
                this.pysTimer = false;
            });

            player.on('ended', function () {
                clearInterval(this.pysTimer);
                this.pysTimer = false;
            });
        }

        // Trigger event if Vimeo video mark was reached
        function checkVimeoCompletion(player) {

            player.getCurrentTime().then(function (seconds) {

                for (var key in player.pysMarks) {

                    if (player.pysMarks[key] <= seconds && !player.pysCompletedMarks[key]) {

                        player.pysCompletedMarks[key] = true;

                        if (key === '0%') {
                            key = 'play';
                        }

                        var params = {
                            video_type: 'vimeo',
                            video_id: player.pysVideoId,
                            video_title: player.pysVideoTitle,
                        };

                        let disable_watch_video = [];

                        //Custom
                        if ( options.triggerEventTypes.hasOwnProperty( "video_view" ) ) {
                            Object.entries( options.triggerEventTypes.video_view ).forEach( function ( [ trigger_id, triggers ] ) {
                                triggers.forEach( function ( trigger ) {
                                    if ( trigger.type === 'vimeo' && trigger.rule == player.pysVideoId ) {
                                        let pixels = Object.keys( options.triggerEvents[ trigger_id ] );
                                        for ( let i = 0; i < pixels.length; i++ ) {
                                            let event = Utils.clone( options.triggerEvents[ trigger_id ][ pixels[ i ] ] );

                                            if ( trigger.disable_watch_video ) {
                                                disable_watch_video.push( pixels[ i ] );
                                            }

                                            if ( seconds >= player.pysMarks[ trigger.value ] ) {
                                                event.params[ "progress" ] = key;
                                                Utils.copyProperties( params, event.params );

                                                if ( event.fired !== true ) {
                                                    if ( Utils.isEventInTimeWindow( event.name, event, 'dyn_' + pixels[ i ] + '_' + trigger_id ) ) {
                                                        event = Utils.getFormFilledData( event );
                                                        getPixelBySlag( pixels[ i ] ).fireEvent( event.name, event );
                                                        options.triggerEvents[ trigger_id ][ pixels[ i ] ].fired = true;
                                                    }
                                                }
                                            }
                                        }
                                    }
                                } )
                            } )
                        }

                        // Auto
                        if(options.automatic.enable_video
                            && options.automatic.enable_vimeo
                            && options.dynamicEvents.hasOwnProperty("automatic_event_video")
                        ) {
                            var pixels = Object.keys(options.dynamicEvents.automatic_event_video);

                            for (var i = 0; i < pixels.length; i++) {
                                if ( disable_watch_video.includes( pixels[ i ] ) ) {
                                    continue;
                                }

                                var event = Utils.clone(options.dynamicEvents.automatic_event_video[pixels[i]]);
                                event.params["progress"] = key
                                Utils.copyProperties(params, event.params);

                                if ( pixels[i] === 'tiktok' ) {
                                    var time_trigger = event.automatic_event_video_trigger;
                                    if ( seconds >= player.pysMarks[time_trigger] && event.fired !== true ) {
                                        getPixelBySlag(pixels[i]).onWatchVideo(event);

                                        //tiktok watch video fire once
                                        options.dynamicEvents.automatic_event_video[pixels[i]].fired = true;
                                    }
                                } else {
                                    Utils.copyProperties(Utils.getRequestParams(), event.params);
                                    getPixelBySlag(pixels[i]).onWatchVideo(event);
                                }
                            }
                        }

                        if(key == "play") {
                            $.each(options.triggerEventTypes, function (triggerType, events) {
                                $.each(events, function (eventId, triggers) {
                                    switch (triggerType) {
                                        case 'video_play':
                                            Utils.fireTriggerEvent(eventId);
                                            break;
                                    }

                                });
                            });
                        }
                    }

                }

            });

        }

        /**
         * COOKIES UTILS
         */

        var utmTerms = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content' ,'utm_term'];
        var utmId = ['fbadid', 'gadid', 'padid', 'bingid'];
        var requestParams = [];


        function getDomain(url) {

            url = url.replace(/(https?:\/\/)?(www.)?/i, '');

            if (url.indexOf('/') !== -1) {
                return url.split('/')[0];
            }

            return url;
        }

        function checkSession() {

            if( Cookies.get('pys_start_session') === undefined ||
                Cookies.get('pys_session_limit') === undefined) {
                firstVisit = true;
                return true
            }
            return false

        }

        function getTrafficSource() {

            try {

                let referrer = document.referrer.toString(),
                    source;

                let direct = referrer.length === 0;
                let internal = direct ? false : referrer.indexOf(options.siteUrl) === 0;
                let external = !direct && !internal;

                if (external === false) {
                    source = 'direct';
                } else {
                    source = referrer;
                }

                if (source !== 'direct') {
                    // leave only domain (Issue #70)
                    return getDomain(source);
                } else {
                    return source;
                }

            } catch (e) {
                console.error(e);
                return 'direct';
            }

        }

        /**
         * Return query variables object with where property name is query variable
         * and property value is query variable value.
         */
        function getQueryVars() {

            try {

                var result = {},
                    tmp = [];

                window.location.search
                    .substr(1)
                    .split("&")
                    .forEach(function (item) {

                        tmp = item.split('=');

                        if (tmp.length > 1) {
                            result[tmp[0]] = tmp[1];
                        }

                    });

                return result;

            } catch (e) {
                console.error(e);
                return {};
            }

        }

        function getLandingPageValue() {
            let name = "pys_landing_page"
            if(options.visit_data_model === "last_visit") {
                name = "last_pys_landing_page"
            }
            if(Cookies.get(name) && Cookies.get(name) !== "undefined") {
                return Cookies.get(name);
            }
            else if(options.hasOwnProperty("tracking_analytics") && options.tracking_analytics.TrafficLanding){
                return options.tracking_analytics.TrafficLanding;
            } else{
                return "";
            }
        }
        function getTrafficSourceValue() {
            let name = "pysTrafficSource"
            if(options.visit_data_model === "last_visit") {
                name = "last_pysTrafficSource"
            }
            if(Cookies.get(name) && Cookies.get(name) !== "undefined") {
                return Cookies.get(name);
            }
            else if(options.hasOwnProperty("tracking_analytics") && options.tracking_analytics.TrafficSource){
                return options.tracking_analytics.TrafficSource;
            } else{
                return "";
            }
        }

        function getUTMId(useLast = false) {
            try {
                let cookiePrefix = 'pys_'
                let terms = [];
                if (useLast) {
                    cookiePrefix = 'last_pys_'
                }
                $.each(utmId, function (index, name) {
                    if (Cookies.get(cookiePrefix + name)) {
                        terms[name] = Cookies.get(cookiePrefix + name)
                    }
                    else if(options.hasOwnProperty("tracking_analytics") && options.tracking_analytics.TrafficUtmsId[name]) {
                        terms[name] = filterEmails(options.tracking_analytics.TrafficUtmsId[name])
                    }
                });
                return terms;
            } catch (e) {
                console.error(e);
                return [];
            }
        }
        /**
         * Return UTM terms from request query variables or from cookies.
         */
        function getUTMs(useLast = false) {

            try {
                let cookiePrefix = 'pys_'
                if(useLast) {
                    cookiePrefix = 'last_pys_'
                }
                let terms = [];
                $.each(utmTerms, function (index, name) {
                    if (Cookies.get(cookiePrefix + name)) {
                        let value = Cookies.get(cookiePrefix + name);
                        terms[name] = filterEmails(value); // do not allow email in request params (Issue #70)
                    }
                    else if(options.hasOwnProperty("tracking_analytics") && options.tracking_analytics.TrafficUtms[name]) {
                        terms[name] = filterEmails(options.tracking_analytics.TrafficUtms[name])
                    }
                });

                return terms;

            } catch (e) {
                console.error(e);
                return [];
            }

        }

        function getDateTime() {
            var dateTime = new Array();
            var date = new Date(),
                days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
                months = ['January', 'February', 'March', 'April', 'May', 'June',
                    'July', 'August', 'September', 'October', 'November', 'December'
                ],
                hours = ['00-01', '01-02', '02-03', '03-04', '04-05', '05-06', '06-07', '07-08',
                    '08-09', '09-10', '10-11', '11-12', '12-13', '13-14', '14-15', '15-16', '16-17',
                    '17-18', '18-19', '19-20', '20-21', '21-22', '22-23', '23-24'
                ];
            dateTime.push(hours[date.getHours()]);
            dateTime.push(days[date.getDay()]);
            dateTime.push(months[date.getMonth()]);
            return dateTime;
        }

        function filterEmails(value) {
            return Utils.validateEmail(value) ? undefined : value;
        }

        /**
         * PUBLIC API
         */
        return {

            PRODUCT_SIMPLE : 0,
            PRODUCT_VARIABLE : 1,
            PRODUCT_BUNDLE : 2,
            PRODUCT_GROUPED : 3,
            utmTerms : utmTerms,
            utmId : utmId,
            isNewSession: checkSession(),
            setHidePixelCookie: function(){
                let refresh_after_consent = false;
                if ( !firstVisit && options.gdpr.consent_magic_integration_enabled && window.CS_Data !== undefined && window.CS_Data.cs_refresh_after_consent) {
                    refresh_after_consent = true;
                }
                if( !refresh_after_consent && !firstVisit) return false;

                const url_parts = window.location.href;
                const url_params = new URLSearchParams(window.location.search);
                const matchingPixels = ["facebook", "ga", "gtm", "google_ads", "bing", "pinterest", "tiktok"];
                $.each(matchingPixels, function (index, slug) {
                    var module = getPixelBySlag(slug);
                    if (module && module.isEnabled()) {
                        const fullUrl = window.location.href;
                        $.each(module.getHidePixel(), function (index, hide_info) {
                            for (const item of hide_info.hide_tag_contain) {
                                if (item && fullUrl.includes(item)) {
                                    let hideTagTimeInMilliseconds = hide_info.hide_tag_time * 60 * 60 * 1000;
                                    let expiresTime = new Date().getTime() + hideTagTimeInMilliseconds;
                                    Cookies.set('hide_tag_' + hide_info.pixel, true, { expires: new Date(expiresTime), path: '/' });
                                    break;
                                }
                            }
                        });
                    }

                });
            },
            hideMatchingPixel: function(pixelValue, slug) {
                if(Cookies.get('hide_tag_'+pixelValue))
                {
                    return true;
                }
                return false;
            },
            validateEmail: function (email) {
                var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                return re.test(email);
            },
            fireEventForAllPixel:function(functionName,events){
                if (events.hasOwnProperty(Facebook.tag()))
                    Facebook[functionName](events[Facebook.tag()]);
                if (events.hasOwnProperty(Analytics.tag()))
                    Analytics[functionName](events[Analytics.tag()]);
                if (events.hasOwnProperty(GAds.tag()))
                    GAds[functionName](events[GAds.tag()]);
                if (events.hasOwnProperty(Pinterest.tag()))
                    Pinterest[functionName](events[Pinterest.tag()]);
                if (events.hasOwnProperty(Bing.tag()))
                    Bing[functionName](events[Bing.tag()]);
                if (events.hasOwnProperty(TikTok.tag()))
                    TikTok[functionName](events[TikTok.tag()]);

                if (events.hasOwnProperty(GTM.tag()))
                    GTM[functionName](events[GTM.tag()]);
            },

            getQueryValue:function (name){
                return getQueryVars()[name];
            },

            filterEmails: function (value) {
                return filterEmails(value);
            },

            setupPinterestObject: function () {
                Pinterest = window.pys.Pinterest || Pinterest;
                return Pinterest;
            },

            setupBingObject: function () {
                Bing = window.pys.Bing || Bing;
                return Bing;
            },

            // Clone all object members to another and return it
            copyProperties: function (from, to) {
                for (var key in from) {
                    if("function" == typeof from[key]) {
                        continue;
                    }
                    to[key] = from[key];
                }
                return to;
            },

            /**
             * Generate unique ID
             */
            generateUniqueId : function (event) {
                if(event.eventID.length == 0 || (event.type == "static" && options.ajaxForServerStaticEvent) || (event.type !== "static" && options.ajaxForServerEvent)) {
                    let idKey = event.hasOwnProperty('custom_event_post_id') ? event.custom_event_post_id : event.e_id;
                    if (!uniqueId.hasOwnProperty(idKey)) {
                        uniqueId[idKey] = pys_generate_token();
                    }
                    return uniqueId[idKey];
                }
                else if(event.eventID.length !== 0)
                {
                    return event.eventID;
                }
            },

            sendServerAjaxRequest: function ( url, data ) {
                jQuery.ajax( {
                    type: 'POST',
                    url: url,
                    data: data,
                    headers: {
                        'Cache-Control': 'no-cache'
                    },
                    success: function () {
                    },
                } );
            },

            clone: function(obj) {
                var copy;

                // Handle the 3 simple types, and null or undefined
                if (null == obj || "object" != typeof obj) return obj;

                // Handle Date
                if (obj instanceof Date) {
                    copy = new Date();
                    copy.setTime(obj.getTime());
                    return copy;
                }

                // Handle Array
                if (obj instanceof Array) {
                    copy = [];
                    for (var i = 0, len = obj.length; i < len; i++) {
                        if("function" == typeof obj[i]) {
                            continue;
                        }
                        copy[i] = Utils.clone(obj[i]);
                    }
                    return copy;
                }

                // Handle Object
                if (obj instanceof Object) {
                    copy = {};
                    for (var attr in obj) {
                        if (obj.hasOwnProperty(attr)) {
                            if("function" == typeof obj[attr]) {
                                continue;
                            }
                            copy[attr] = Utils.clone(obj[attr]);
                        }
                    }
                    return copy;
                }

                return obj;
            },

            // Returns array of elements with given tag name
            getTagsAsArray: function (tag) {
                return [].slice.call(document.getElementsByTagName(tag));
            },


            initializeVideoAPIs: function (options) {
                let trigger_has_video_YT, trigger_has_video_Vimeo = false;
                if (options.hasOwnProperty('automatic') && options.automatic.enable_video) {
                    if ( options.triggerEventTypes.hasOwnProperty( "video_view" ) ) {
                        Object.entries( options.triggerEventTypes.video_view ).forEach( function ( [ trigger_id, triggers ] ) {
                            triggers.forEach( function ( trigger ) {
                                if (trigger.type === 'youtube') {
                                    trigger_has_video_YT = true;
                                }
                                if(trigger.type === 'vimeo'){
                                    trigger_has_video_Vimeo = true;
                                }
                            });
                        });
                    }
                    if(options.automatic.enable_youtube || trigger_has_video_YT){
                        Utils.initYouTubeAPI();
                    }
                    if(options.automatic.enable_vimeo || trigger_has_video_Vimeo){
                        Utils.initVimeoAPI();
                    }
                }
            },
            /**
             * Load and initialize YouTube API
             *
             * @link: https://developers.google.com/youtube/iframe_api_reference
             */
            initYouTubeAPI: function () {

                // maybe load YouTube JS API
                if (typeof window.YT === 'undefined') {
                    var tag = document.createElement('script');
                    tag.src = '//www.youtube.com/iframe_api';
                    var firstScriptTag = document.getElementsByTagName('script')[0];
                    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
                }

                // initialize when API is ready
                if ( typeof window.onYouTubeIframeAPIReady !== 'function' ) {

                    window.onYouTubeIframeAPIReady = function () {

                        // collect all possible YouTube tags
                        var potentialVideos = Utils.getTagsAsArray( 'iframe' ).concat( Utils.getTagsAsArray( 'embed' ) );

                        // turn videos into trackable videos with events
                        for ( var i = 0; i < potentialVideos.length; i++ ) {
                            var video = potentialVideos[ i ];
                            if ( tagIsYouTubeVideo( video ) ) {
                                var iframe = normalizeYouTubeIframe( video );
                                addYouTubeEvents( iframe );
                            } else if ( tagIsYouTubeAsyncVideo( video ) ){
                                video.addEventListener( "load", function ( evt ) {
                                    var iframe = normalizeYouTubeIframe( evt.currentTarget );
                                    addYouTubeEvents( iframe );
                                } );
                            }
                        }

                        var targets = document.querySelectorAll( '.elementor-widget-video .elementor-wrapper' );

                        const config = {
                            attributes: false,
                            childList: true,
                            subtree: true
                        };

                        const callback = function ( mutationsList, observer ) {
                            for ( let mutation of mutationsList ) {
                                if ( mutation.type === 'childList' ) {
                                    for ( var m = 0; m < mutation.addedNodes.length; m++ ) {
                                        addDynYouTubeVideos( mutation.addedNodes[ m ] );
                                    }
                                }
                            }
                        };
                        // observe elementator widget-video and add event when it add iframe
                        for ( var i = 0; i < targets.length; i++ ) {
                            const observer = new MutationObserver( callback );
                            observer.observe( targets[ i ], config );//maybe remove before add
                        }
                    }
                }
            },

            /**
             * Load and initialize Vimeo API
             *
             * @link: https://github.com/vimeo/player.js
             */
            initVimeoAPI: function () {


                $(document).ready(function () {

                    var potentialVideos = Utils.getTagsAsArray('iframe').concat(Utils.getTagsAsArray('embed'));

                    for (var i = 0; i < potentialVideos.length; i++) {
                        var tag = potentialVideos[i];
                        if (tagIsVimeoVideo(tag)) {
                            var nextElementHasClass = $(tag).closest('.elementor-widget-video').find('.elementor-custom-embed-image-overlay');
                            if(nextElementHasClass.length > 0) {
                                tag.addEventListener("load", function() {
                                    attachVimeoPlayerToTag(this);
                                });
                            }
                            else {
                                attachVimeoPlayerToTag(tag);
                            }


                        } else {
                            if (tagIsAsincVimeoVideo(tag)) {
                                tag.addEventListener("load", function(evt) {
                                    attachVimeoPlayerToTag(evt.currentTarget);
                                });
                            }
                        }
                    }

                });

            },

            manageCookies: function () {
                if (options.gdpr.cookiebot_integration_enabled && typeof Cookiebot !== 'undefined') {
                    if (Cookiebot.consented === false && !Cookiebot.consent['marketing'] && !Cookiebot.consent['statistics']) {
                        return;
                    }
                }

                let cm_consent_not_expressed = false;
                if ( options.gdpr.consent_magic_integration_enabled && window.CS_Data !== undefined && window.CS_Data.cs_refresh_after_consent == 1 ) {
                    if ( Cookies.get( 'cs_viewed_cookie_policy' ) === undefined ) {
                        cm_consent_not_expressed = true;
                    }
                }

                if( !cm_consent_not_expressed && isNewSession && !options.cookie.disabled_all_cookie && !options.cookie.disabled_start_session_cookie) {
                    let duration = options.last_visit_duration * 60000
                    var now = new Date();
                    now.setTime(now.getTime() + duration);
                    Cookies.set('pys_session_limit', true,{ expires: now, path: '/',domain: domain })
                    Cookies.set('pys_start_session', true,{ path: '/',domain: domain });
                    Utils.setHidePixelCookie();
                }

                if (!Cookies.get('pbid') && Facebook.isEnabled() && options.ajaxForServerEvent) {
                    jQuery.ajax({
                        url: options.ajaxUrl,
                        dataType: 'json',
                        data: {
                            action: 'pys_get_pbid'
                        },
                        success: function (res) {
                            if (res.data && res.data.pbid != false && options.send_external_id) {
                                if(!(options.cookie.disabled_all_cookie || options.cookie.externalID_disabled_by_api)){
                                    var expires = parseInt(options.external_id_expire || 180);
                                    Cookies.set('pbid', res.data.pbid, { expires: expires,path: '/',domain: domain });
                                }

                                if(options.hasOwnProperty('facebook')) {
                                    options.facebook.advancedMatching = {
                                        ...options.facebook.advancedMatching,  // распыляем текущие значения advancedMatching
                                        external_id: res.data.pbid
                                    };
                                }
                            }
                        }
                    });
                } else if (Cookies.get('pbid') && Facebook.isEnabled()){
                    if(options.hasOwnProperty('facebook')) {
                        options.facebook.advancedMatching = {
                            ...options.facebook.advancedMatching,
                            external_id: Cookies.get('pbid')
                        };
                    }
                }
                let expires = parseInt(options.cookie_duration); //  days
                let queryVars = getQueryVars();
                let landing = window.location.href.split('?')[0];
                try {
                    // save data for first visit
                    if(Cookies.get('pys_first_visit') === undefined && (!options.cookie.disabled_all_cookie)) {

                        if(!options.cookie.disabled_first_visit_cookie)
                        {
                            Cookies.set('pys_first_visit', true, { expires: expires, path: '/',domain: domain });
                        }
                        else {
                            Cookies.remove('pys_first_visit', { path: '/',domain: domain } )
                        }

                        if(!options.cookie.disabled_trafficsource_cookie)
                        {
                            Cookies.set('pysTrafficSource', getTrafficSource(), { expires: expires,path: '/',domain: domain });
                        }
                        else {
                            Cookies.remove('pysTrafficSource', { path: '/',domain: domain })
                        }

                        if(!options.cookie.disabled_landing_page_cookie && options.enable_lading_page_param)
                        {
                            Cookies.set('pys_landing_page',landing,{ expires: expires,path: '/',domain: domain });
                        }
                        else {
                            Cookies.remove('pys_landing_page', { path: '/',domain: domain })
                        }

                        if(!options.cookie.disabled_utmTerms_cookie)
                        {
                            $.each(utmTerms, function (index, name) {
                                if (queryVars.hasOwnProperty(name)) {
                                    Cookies.set('pys_' + name, queryVars[name], { expires: expires,path: '/',domain: domain });
                                } else {
                                    Cookies.remove('pys_' + name, { path: '/',domain: domain })
                                }
                            });
                        }
                        else {
                            $.each(utmTerms, function (index, name) {
                                Cookies.remove('pys_' + name, { path: '/',domain: domain })
                            });
                        }

                        if(!options.cookie.disabled_utmId_cookie)
                        {
                            $.each(utmId,function(index,name) {
                                if (queryVars.hasOwnProperty(name)) {
                                    Cookies.set('pys_' + name, queryVars[name], { expires: expires,path: '/',domain: domain });
                                } else {
                                    Cookies.remove('pys_' + name, { path: '/',domain: domain })
                                }
                            })
                        }
                        else {
                            $.each(utmId, function (index, name) {
                                Cookies.remove('pys_' + name, { path: '/',domain: domain })
                            });
                        }

                    }

                    // save data for last visit if it new session
                    if(isNewSession && (!options.cookie.disabled_all_cookie)) {
                        if(!options.cookie.disabled_trafficsource_cookie)
                        {
                            Cookies.set('last_pysTrafficSource', getTrafficSource(), { expires: expires,path: '/',domain: domain });
                        }
                        else {
                            Cookies.remove('last_pysTrafficSource', { path: '/',domain: domain })
                        }

                        if(!options.cookie.disabled_landing_page_cookie && options.enable_lading_page_param)
                        {
                            Cookies.set('last_pys_landing_page',landing,{ expires: expires,path: '/',domain: domain });
                        }
                        else {
                            Cookies.remove('last_pys_landing_page', { path: '/',domain: domain })
                        }

                        if(!options.cookie.disabled_utmTerms_cookie)
                        {
                            $.each(utmTerms, function (index, name) {
                                if (queryVars.hasOwnProperty(name)) {
                                    Cookies.set('last_pys_' + name, queryVars[name], { expires: expires,path: '/',domain: domain });
                                } else {
                                    Cookies.remove('last_pys_' + name, { path: '/',domain: domain })
                                }
                            });
                        }
                        else {
                            $.each(utmTerms, function (index, name) {
                                Cookies.remove('last_pys_' + name, { path: '/',domain: domain })
                            });
                        }

                        if(!options.cookie.disabled_utmId_cookie)
                        {
                            $.each(utmId,function(index,name) {
                                if (queryVars.hasOwnProperty(name)) {
                                    Cookies.set('last_pys_' + name, queryVars[name], { expires: expires,path: '/',domain: domain });
                                } else {
                                    Cookies.remove('last_pys_' + name, { path: '/',domain: domain })
                                }
                            })
                        }
                        else {
                            $.each(utmId, function (index, name) {
                                Cookies.remove('last_pys_' + name, { path: '/',domain: domain })
                            });
                        }

                    }
                    if(options.cookie.disabled_start_session_cookie) {
                        Cookies.remove('pys_start_session', { path: '/',domain: domain })
                        Cookies.remove('pys_session_limit', { path: '/',domain: domain })
                    }
                    if(options.cookie.disabled_all_cookie)
                    {
                        Cookies.remove('pys_first_visit', { path: '/',domain: domain })
                        Cookies.remove('pysTrafficSource', { path: '/',domain: domain })
                        Cookies.remove('pys_landing_page', { path: '/',domain: domain })
                        Cookies.remove('last_pys_landing_page', { path: '/',domain: domain })
                        Cookies.remove('last_pysTrafficSource', { path: '/',domain: domain })
                        Cookies.remove('pys_start_session', { path: '/',domain: domain })
                        Cookies.remove('pys_session_limit', { path: '/',domain: domain })
                        $.each(Utils.utmTerms, function (index, name) {
                            Cookies.remove('pys_' + name, { path: '/',domain: domain })
                        });
                        $.each(Utils.utmId,function(index,name) {
                            Cookies.remove('pys_' + name, { path: '/',domain: domain })
                        })
                        $.each(Utils.utmTerms, function (index, name) {
                            Cookies.remove('last_pys_' + name, { path: '/',domain: domain })
                        });
                        $.each(Utils.utmId,function(index,name) {
                            Cookies.remove('last_pys_' + name, { path: '/',domain: domain })
                        });
                    }
                } catch (e) {
                    console.error(e);
                }
            },

            initializeRequestParams: function () {

                if (options.trackTrafficSource) {
                    requestParams.traffic_source = getTrafficSourceValue();
                }

                if (options.trackUTMs) {

                    var utms = getUTMs(options.visit_data_model === "last_visit");

                    $.each(utmTerms, function (index, term) {
                        if (term in utms) {
                            requestParams[term] = utms[term];
                        }
                    });

                }


                var dateTime = getDateTime();
                if(options.enable_event_time_param) {
                    requestParams.event_hour = dateTime[0];
                }

                if(options.enable_event_day_param) {
                    requestParams.event_day = dateTime[1];
                }
                if(options.enable_event_month_param) {
                    requestParams.event_month = dateTime[2];
                }

                if(options.enable_lading_page_param){
                    requestParams.landing_page = getLandingPageValue();
                }
            },

            getRequestParams: function () {
                return requestParams;
            },

            /**
             * DOWNLOAD DOCS
             */

            getLinkExtension: function (link) {

                // Remove anchor, query string and everything before last slash
                link = link.substring(0, (link.indexOf("#") === -1) ? link.length : link.indexOf("#"));
                link = link.substring(0, (link.indexOf("?") === -1) ? link.length : link.indexOf("?"));
                link = link.substring(link.lastIndexOf("/") + 1, link.length);

                // If there's a period left in the URL, then there's a extension
                if (link.length > 0 && link.indexOf('.') !== -1) {
                    link = link.substring(link.lastIndexOf(".") + 1); // Remove everything but what's after the first period
                    return link;
                } else {
                    return "";
                }
            },

            getLinkFilename: function (link) {

                // Remove anchor, query string and everything before last slash
                link = link.substring(0, (link.indexOf("#") === -1) ? link.length : link.indexOf("#"));
                link = link.substring(0, (link.indexOf("?") === -1) ? link.length : link.indexOf("?"));
                link = link.substring(link.lastIndexOf("/") + 1, link.length);

                // If there's a period left in the URL, then there's a extension
                if (link.length > 0 && link.indexOf('.') !== -1) {
                    return link;
                } else {
                    return "";
                }
            },

            /**
             * CUSTOM EVENTS
             */

            setupMouseOverClickEvents: function (eventId, triggers) {

                // Non-default binding used to avoid situations when some code in external js
                // stopping events propagation, eg. returns false, and our handler will never called
                document.addEventListener('mouseover', function(event) {
                    var matchedElements = Array.from(document.querySelectorAll(triggers));
                    var clickedElement = event.target;
                    var closestMatch = clickedElement.closest(triggers);
                    if (matchedElements.includes(clickedElement) || closestMatch){
                        if (event.target.classList.contains('pys-mouse-over-' + eventId)) {
                            return true;
                        } else {
                            event.target.classList.add('pys-mouse-over-' + eventId);
                        }

                        Utils.fireTriggerEvent(eventId);
                    }
                });


            },

            setupCSSClickEvents: function (eventId, triggers) {
                // Non-default binding used to avoid situations when some code in external js
                // stopping events propagation, eg. returns false, and our handler will never called
                // add event to document to support dyn class
                document.addEventListener('click', function(event) {
                    let matchedElements = Array.from(document.querySelectorAll(triggers)),
                        clickedElement = event.target,
                        closestMatch = clickedElement.closest(triggers);

                    if (matchedElements.includes(clickedElement) || closestMatch){
                        Utils.fireTriggerEvent(eventId);
                    }
                }, true);
            },

            setupURLClickEvents: function () {

                if( !options.triggerEventTypes.hasOwnProperty('url_click') ) {
                    return;
                }
                // Non-default binding used to avoid situations when some code in external js
                // stopping events propagation, eg. returns false, and our handler will never called
                document.addEventListener('click', function(event) {
                    let anchor = event.target.closest('a');

                    if (anchor) {
                        var url = anchor.getAttribute('href');
                        if (url) {
                            Object.entries(options.triggerEventTypes.url_click).forEach(function ([eventId, triggers]) {
                                triggers.forEach(function (trigger) {
                                    if (Utils.compareUrl(url, trigger.value, trigger.rule)) {
                                        Utils.fireTriggerEvent(eventId);
                                    }
                                });
                            });
                        }
                    }
                }, true);

            },

            removeUrlDomain(url) {
                if(url.indexOf("/#") > -1) {
                    url = url.substring(0, url.indexOf("/#"));
                }
                return url.replace('http://','')
                    .replace('https://','')
                    .replace('www.','')
                    .trim()
                    .replace(/^\/+/g, '')

            },

            compareUrl: function(base,url,rule){

                if(url == "*" || url == '') return true;

                base = Utils.removeUrlDomain(base)
                url = Utils.removeUrlDomain(url)

                if(rule == 'match') {
                    return url == base;
                } else {
                    return base.indexOf(url) !== -1
                }

            },

            setupScrollPosEvents: function (eventId, triggers) {

                var scrollPosThresholds = {},
                    docHeight = $(document).height() - $(window).height();

                // convert % to absolute positions
                $.each(triggers, function (index, scrollPos) {

                    // convert % to pixels
                    scrollPos = docHeight * scrollPos / 100;
                    scrollPos = Math.round(scrollPos);

                    scrollPosThresholds[scrollPos] = eventId;

                });

                $(document).on("scroll",function () {

                    var scrollPos = $(window).scrollTop();

                    $.each(scrollPosThresholds, function (threshold, eventId) {

                        // position has not reached yes
                        if (scrollPos <= threshold) {
                            return true;
                        }

                        // fire event only once
                        if (eventId === null) {
                            return true;
                        } else {
                            scrollPosThresholds[threshold] = null;
                        }

                        Utils.fireTriggerEvent(eventId);

                    });

                });

            },
            setupCommentEvents : function (eventId,triggers) {
                $('form.comment-form').on("submit",function () {
                    Utils.fireTriggerEvent(eventId);
                });
            },

            setupEmailLinkEvents: function ( events ) {

                $( document ).on( 'click', 'a', function ( event ) {
                    let anchor = event.target.closest('a');

                    if (anchor) {
                        let url = anchor.getAttribute('href');
                        if (url && (url.startsWith('mailto:') || url.startsWith('tel:'))) {

                            let sendEventIds = [],
                                disabled_for_pixels = [],
                                disabled_email_action = false;

                            $.each(events, function (eventId, trigger_group) {
                                url = url.replace('mailto:', '').replace('tel:', '');
                                trigger_group.forEach(function (triggers) {
                                    triggers.rules.forEach(function (trigger) {
                                        if (Utils.compareUrl(url, trigger.value, trigger.rule)) {
                                            sendEventIds.push(eventId);
                                            if (triggers.hasOwnProperty('disabled_email_link') && triggers.disabled_email_link) {
                                                disabled_email_action = true;
                                                if (options.triggerEvents.hasOwnProperty(eventId)) {
                                                    disabled_for_pixels.push(...Object.keys(options.triggerEvents[eventId]));
                                                }
                                            }
                                        }
                                    });
                                })
                            })

                            if (sendEventIds.length > 0) {
                                sendEventIds.forEach(function (sendEventId) {
                                    Utils.fireTriggerEvent(sendEventId);
                                })
                            }
                            setupEmailLinks(disabled_for_pixels);
                        }
                    }
                } )
            },

            /**
             * Events
             */

            isEventInTimeWindow: function (eventName, event, prefix) {

                if(event.hasOwnProperty("hasTimeWindow") && event.hasTimeWindow) {
                    var cookieName = prefix+"_"+eventName;
                    var now = new Date().getTime();

                    if(Cookies.get(cookieName) !== undefined) {

                        var lastTimeFire = Cookies.get(cookieName);
                        var fireTime = event.timeWindow * 60*60*1000;

                        if( now - lastTimeFire > fireTime) {
                            Cookies.set(cookieName,now, { expires: event.timeWindow / 24.0, path: '/'} );
                        } else {
                            return false;
                        }
                    } else {
                        Cookies.set(cookieName,now, { expires: event.timeWindow / 24.0, path: '/'} );
                    }
                }
                return true
            },

            fireTriggerEvent: function (eventId) {

                if (!options.triggerEvents.hasOwnProperty(eventId)) {
                    return;
                }

                var event = {};
                var events = options.triggerEvents[eventId];

                if (events.hasOwnProperty('facebook')) {
                    event = events.facebook;
                    if(Utils.isEventInTimeWindow(event.name,event,"dyn_facebook_"+eventId)) {
                        event = Utils.getFormFilledData(event);
                        Facebook.fireEvent(event.name, event);
                    }
                }

                if (events.hasOwnProperty('ga')) {
                    event = events.ga;
                    if(Utils.isEventInTimeWindow(event.name,event,"dyn_ga_"+eventId)) {
                        event = Utils.getFormFilledData(event);
                        Analytics.fireEvent(event.name, event);
                    }
                }

                if (events.hasOwnProperty('google_ads')) {
                    event = events.google_ads;
                    if(Utils.isEventInTimeWindow(event.name,event,"dyn_google_ads_"+eventId)) {
                        event = Utils.getFormFilledData(event);
                        GAds.fireEvent(event.name, event);
                    }
                }

                if (events.hasOwnProperty('pinterest')) {
                    event = events.pinterest;
                    if(Utils.isEventInTimeWindow(event.name,event,"dyn_pinterest_"+eventId)) {
                        event = Utils.getFormFilledData(event);
                        Pinterest.fireEvent(event.name, event);;
                    }
                }

                if (events.hasOwnProperty('bing')) {
                    event = events.bing;
                    if(Utils.isEventInTimeWindow(event.name,event,"dyn_bing_"+eventId)) {
                        event = Utils.getFormFilledData(event);
                        Bing.fireEvent(event.name, event);;
                    }
                }
                if (events.hasOwnProperty('tiktok')) {
                    event = events.tiktok;
                    if(Utils.isEventInTimeWindow(event.name,event,"dyn_tiktok_"+eventId)) {
                        event = Utils.getFormFilledData(event);
                        TikTok.fireEvent(event.name, event);
                    }
                }

                if (events.hasOwnProperty('gtm')) {
                    event = events.gtm;
                    if(Utils.isEventInTimeWindow(event.name,event,"dyn_gtm_"+eventId)) {
                        event = Utils.getFormFilledData(event);
                        GTM.fireEvent(event.name, event);
                    }
                }


            },

            isFirstPurchaseFire: function ($eventName,orderId,pixel) {

                if(Cookies.get("pys_"+$eventName+"_order_id_"+pixel) == orderId) {
                    return false;
                } else {
                    Cookies.set("pys_"+$eventName+"_order_id_"+pixel, orderId, { expires: 1,path: '/' });
                }
                return true;
            },

            fireStaticEvents: function (pixel, timeout = 0) {

                if (options.staticEvents.hasOwnProperty(pixel)) {

                    $.each(options.staticEvents[pixel], function (eventId, events) {

                        //skip purchase event if this order was fired
                        if( options.woo.hasOwnProperty('woo_purchase_on_transaction') &&
                            options.woo.woo_purchase_on_transaction &&
                            (eventId === "woo_purchase" || eventId === "woo_purchase_category") ) {
                            if(!Utils.isFirstPurchaseFire(eventId,events[0].woo_order,pixel)) {
                                return;
                            }
                        }

                        if( options.edd.hasOwnProperty('edd_purchase_on_transaction') &&
                            options.edd.edd_purchase_on_transaction &&
                            (eventId === "edd_purchase" || eventId === "edd_purchase_category") ) {
                            if(!Utils.isFirstPurchaseFire(eventId,events[0].edd_order,pixel)) {
                                return;
                            }
                        }


                        $.each(events, function (index, event) {

                            event.fired = event.fired || false;

                            if (!event.fired && Utils.isEventInTimeWindow(event.name,event,'static_' + pixel+"_")) {
                                event = Utils.getFormFilledData(event);

                                var fired = false;

                                // fire event
                                if ( pixel === 'tiktok' ) {
                                    setTimeout(function() {
                                        getPixelBySlag(pixel).fireEvent(event.name, event);
                                    }, timeout * 500);
                                    timeout++;
                                } else {
                                    getPixelBySlag(pixel).fireEvent(event.name, event);
                                }

                                // prevent event double event firing
                                event.fired = fired;
                            }
                        });
                    });
                }
            },

            /**
             * Load tag's JS
             *
             * @link: https://developers.google.com/analytics/devguides/collection/gtagjs/
             * @link: https://developers.google.com/analytics/devguides/collection/gtagjs/custom-dims-mets
             */
            loadGoogleTag: function (id) {

                if (!gtag_loaded) {
                    let dataLayerName = this.dataLayerName;
                    if(options.hasOwnProperty('GATags')){
                        switch (options.GATags.ga_datalayer_type) {
                            case 'default':
                                dataLayerName = 'dataLayerPYS';
                                break;
                            case 'custom':
                                dataLayerName = options.GATags.ga_datalayer_name;
                                break;
                            default:
                                dataLayerName = 'dataLayer';
                        }
                    }
                    this.dataLayerName = dataLayerName;
                    (function (window, document, src) {
                        var a = document.createElement('script'),
                            m = document.getElementsByTagName('script')[0];
                        a.async = 1;
                        a.src = src;
                        m.parentNode.insertBefore(a, m);
                    })(window, document, '//www.googletagmanager.com/gtag/js?id=' + id+'&l='+this.dataLayerName);

                    window[dataLayerName] = window[dataLayerName] || [];
                    window.gtag = window.gtag || function gtag() {
                        window[dataLayerName].push(arguments);
                    };

                    if ( options.google_consent_mode ) {
                        let data = {};
                        data[ 'analytics_storage' ] = options.gdpr.analytics_storage.enabled ? options.gdpr.analytics_storage.value : 'granted';
                        data[ 'ad_storage' ] = options.gdpr.ad_storage.enabled ? options.gdpr.ad_storage.value : 'granted';
                        data[ 'ad_user_data' ] = options.gdpr.ad_user_data.enabled ? options.gdpr.ad_user_data.value : 'granted';
                        data[ 'ad_personalization' ] = options.gdpr.ad_personalization.enabled ? options.gdpr.ad_personalization.value : 'granted';

                        this.loadDefaultConsent( 'consent', 'default', data );
                    }

                    gtag('js', new Date());
                    gtag_loaded = true;

                }

            },

            loadDefaultConsent: function() {
                window[ this.dataLayerName ].push( arguments );
            },

            loadGTMScript: function (id = '') {
                const domain = options.gtm.gtm_container_domain ?? 'www.googletagmanager.com';
                const loader = options.gtm.gtm_container_identifier ?? 'gtm';
                const gtm_auth = options.gtm.gtm_auth ?? ''; // Set this if needed
                const gtm_preview = options.gtm.gtm_preview ?? ''; // Set this if needed
                const datalayer_name = options.gtm.gtm_dataLayer_name ?? 'dataLayer';

                window[ datalayer_name ] = window[ datalayer_name ] || [];
                window.gtag = window.gtag || function gtag() {
                    window[ datalayer_name ].push( arguments );
                };

                if ( options.google_consent_mode ) {
                    let data = {};
                    data[ 'analytics_storage' ] = options.gdpr.analytics_storage.enabled ? options.gdpr.analytics_storage.value : 'granted';
                    data[ 'ad_storage' ] = options.gdpr.ad_storage.enabled ? options.gdpr.ad_storage.value : 'granted';
                    data[ 'ad_user_data' ] = options.gdpr.ad_user_data.enabled ? options.gdpr.ad_user_data.value : 'granted';
                    data[ 'ad_personalization' ] = options.gdpr.ad_personalization.enabled ? options.gdpr.ad_personalization.value : 'granted';

                    this.GTMdataLayerName = datalayer_name;
                    this.loadDefaultGTMConsent( 'consent', 'default', data );
                }

                (function(w, d, s, l, i) {
                    w[l] = w[l] || [];
                    w[l].push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
                    const f = d.getElementsByTagName(s)[0];
                    const j = d.createElement(s);
                    const dl = l !== 'dataLayer' ? '&l=' + l : '';
                    j.async = true;
                    j.src = 'https://' + domain + '/' + loader + '.js?id=' + i + dl;
                    if (gtm_auth && gtm_preview) {
                        j.src += '&gtm_auth=' + gtm_auth + '&gtm_preview=' + gtm_preview + '&gtm_cookies_win=x';
                    }
                    f.parentNode.insertBefore(j, f);
                })(window, document, 'script', datalayer_name, id);

            },

            loadDefaultGTMConsent: function() {
                window[ this.GTMdataLayerName ].push( arguments );
            },

            /**
             * GDPR
             */

            loadPixels: function () {

                if (options.gdpr.ajax_enabled && !options.gdpr.consent_magic_integration_enabled) {

                    // retrieves actual PYS GDPR filters values which allow to avoid cache issues
                    $.get({
                        url: options.ajaxUrl,
                        dataType: 'json',
                        data: {
                            action: 'pys_get_gdpr_filters_values'
                        },
                        success: function (res) {

                            if (res.success) {

                                options.gdpr.all_disabled_by_api = res.data.all_disabled_by_api;
                                options.gdpr.facebook_disabled_by_api = res.data.facebook_disabled_by_api;
                                options.gdpr.tiktok_disabled_by_api = res.data.tiktok_disabled_by_api;
                                options.gdpr.analytics_disabled_by_api = res.data.analytics_disabled_by_api;
                                options.gdpr.google_ads_disabled_by_api = res.data.google_ads_disabled_by_api;
                                options.gdpr.pinterest_disabled_by_api = res.data.pinterest_disabled_by_api;
                                options.gdpr.bing_disabled_by_api = res.data.bing_disabled_by_api;

                                options.cookie.externalID_disabled_by_api = res.data.externalID_disabled_by_api;
                                options.cookie.disabled_all_cookie = res.data.disabled_all_cookie;
                                options.cookie.disabled_advanced_form_data_cookie = res.data.disabled_advanced_form_data_cookie;
                                options.cookie.disabled_landing_page_cookie = res.data.disabled_landing_page_cookie || !options.enable_lading_page_param;
                                options.cookie.disabled_first_visit_cookie = res.data.disabled_first_visit_cookie;
                                options.cookie.disabled_trafficsource_cookie = res.data.disabled_trafficsource_cookie;
                                options.cookie.disabled_utmTerms_cookie = res.data.disabled_utmTerms_cookie;
                                options.cookie.disabled_utmId_cookie = res.data.disabled_utmId_cookie;
                            }
                            loadPixels();

                        }
                    });

                } else {
                    loadPixels();
                }

            },

            consentGiven: function (pixel) {

                /**
                 * Cookiebot
                 */
                if (options.gdpr.cookiebot_integration_enabled && typeof Cookiebot !== 'undefined') {

                    var cookiebot_consent_category = options.gdpr['cookiebot_' + pixel + '_consent_category'];

                    if (options.gdpr[pixel + '_prior_consent_enabled']) {
                        if (Cookiebot.consented === true || Cookiebot.consent[cookiebot_consent_category]) {
                            return true;
                        }
                    } else {
                        if (Cookiebot.consent[cookiebot_consent_category]) {
                            return true;
                        }
                    }
                    return false;

                }

                /**
                 * Cookie Notice
                 */
                if (options.gdpr.cookie_notice_integration_enabled && typeof cnArgs !== 'undefined') {

                    var cn_cookie = Cookies.get(cnArgs.cookieName);

                    if (options.gdpr[pixel + '_prior_consent_enabled']) {
                        if (typeof cn_cookie === 'undefined' || cn_cookie === 'true') {
                            return true;
                        }
                    } else {
                        if (cn_cookie === 'true') {
                            return true;
                        }
                    }

                    return false;

                }

                /**
                 * Cookie Law Info
                 */

                if (options.gdpr.cookie_law_info_integration_enabled) {
                    var cli_cookie = Cookies.get('cookieyes-consent') ?? Cookies.get('wt_consent') ?? Cookies.get('viewed_cookie_policy');
                    if (options.gdpr[pixel + '_prior_consent_enabled']) {
                        if (typeof cli_cookie === 'undefined') return true;
                        if (
                            cli_cookie &&
                            (cli_cookie === Cookies.get('cookieyes-consent') || cli_cookie === Cookies.get('wt_consent'))
                        ) {
                            if (getCookieYes('analytics') === 'yes') {
                                return true;
                            }
                        } else if (cli_cookie && cli_cookie === Cookies.get('viewed_cookie_policy')) {
                            if (Cookies.get('viewed_cookie_policy') === 'yes') {
                                return true;
                            }
                        }
                    } else {
                        if (
                            cli_cookie &&
                            (cli_cookie === Cookies.get('cookieyes-consent') || cli_cookie === Cookies.get('wt_consent'))
                        ) {
                            if (getCookieYes('analytics') === 'yes') {
                                return true;
                            }
                        } else if (cli_cookie && cli_cookie === Cookies.get('viewed_cookie_policy')) {
                            if (Cookies.get('viewed_cookie_policy') === 'yes') {
                                return true;
                            }
                        }
                    }
                    return false;
                }

                /**
                 * ConsentMagic
                 */
                if (options.gdpr.consent_magic_integration_enabled && typeof CS_Data !== "undefined" ) {

                    let test_prefix = CS_Data.test_prefix;
                    if (
                        ( ( typeof CS_Data.cs_google_consent_mode_enabled !== "undefined" && CS_Data.cs_google_consent_mode_enabled == 1 ) && ( pixel == 'analytics' || pixel == 'google_ads' ) )
                        || ( typeof CS_Data.cs_meta_ldu_mode !== "undefined" && CS_Data.cs_meta_ldu_mode && pixel == 'facebook' )
                        || ( typeof CS_Data.cs_bing_consent_mode !== "undefined" && CS_Data.cs_bing_consent_mode.ad_storage.enabled && pixel == 'bing' )
                    ) {
                        if ( CS_Data.cs_cache_enabled == 0 || ( CS_Data.cs_cache_enabled == 1 && window.CS_Cache && window.CS_Cache.check_status ) ) {
                            return true;
                        } else {
                            return false;
                        }
                    }

                    if( pixel == 'facebook' && ( CS_Data.cs_script_cat.facebook == 0 || CS_Data.cs_script_cat.facebook == CS_Data.cs_necessary_cat_id ) ) {
                        return true;
                    } else if( pixel == 'bing' && ( CS_Data.cs_script_cat.bing == 0 || CS_Data.cs_script_cat.bing == CS_Data.cs_necessary_cat_id ) ) {
                        return true;
                    } else if( pixel == 'analytics' && ( CS_Data.cs_script_cat.analytics == 0 || CS_Data.cs_script_cat.analytics == CS_Data.cs_necessary_cat_id ) ) {
                        return true;
                    } else if( pixel == 'google_ads' && ( CS_Data.cs_script_cat.gads == 0 || CS_Data.cs_script_cat.gads == CS_Data.cs_necessary_cat_id ) ) {
                        return true;
                    } else if( pixel == 'pinterest' && ( CS_Data.cs_script_cat.pinterest == 0 || CS_Data.cs_script_cat.pinterest == CS_Data.cs_necessary_cat_id ) ) {
                        return true;
                    } else if( pixel == 'tiktok' && ( CS_Data.cs_script_cat.tiktok == 0 || CS_Data.cs_script_cat.tiktok == CS_Data.cs_necessary_cat_id ) ) {
                        return true;
                    }

                    let substring = "cs_enabled_cookie_term",
                        theCookies = document.cookie.split( ';' );

                    for ( let i = 1; i <= theCookies.length; i++ ) {
                        if ( theCookies[ i - 1 ].indexOf( substring ) !== -1 ) {
                            let categoryCookie = theCookies[ i - 1 ].replace( 'cs_enabled_cookie_term' + test_prefix + '_', '' );
                            categoryCookie = Number( categoryCookie.replace( /\D+/g, "" ) );
                            let cs_cookie_val = Cookies.get( 'cs_enabled_cookie_term' + test_prefix + '_' + categoryCookie );

                            if ( categoryCookie === CS_Data.cs_script_cat.facebook && pixel == 'facebook' ) {
                                return cs_cookie_val == 'yes';
                            } else if ( categoryCookie === CS_Data.cs_script_cat.bing && pixel == 'bing' ) {
                                return cs_cookie_val == 'yes';
                            } else if ( categoryCookie === CS_Data.cs_script_cat.analytics && pixel == 'analytics' ) {
                                return cs_cookie_val == 'yes';
                            } else if ( categoryCookie === CS_Data.cs_script_cat.gads && pixel == 'google_ads' ) {
                                return cs_cookie_val == 'yes';
                            } else if ( categoryCookie === CS_Data.cs_script_cat.pinterest && pixel == 'pinterest' ) {
                                return cs_cookie_val == 'yes';
                            } else if ( categoryCookie === CS_Data.cs_script_cat.tiktok && pixel == 'tiktok' ) {
                                return cs_cookie_val == 'yes';
                            }
                        }
                    }

                    return false;
                }


                /**
                 * Real Cookie Banner
                 */
                if (options.gdpr.real_cookie_banner_integration_enabled) {
                    var consentApi = window.consentApi;
                    if (consentApi) {
                        switch (pixel) {
                            case "analytics":
                                return consentApi.consentSync("http", "_ga", "*").cookieOptIn;
                            case "facebook":
                                return consentApi.consentSync("http", "_fbp", "*").cookieOptIn;
                            case "pinterest":
                                return consentApi.consentSync("http", "_pinterest_sess", ".pinterest.com").cookieOptIn;
                            case "bing":
                                return consentApi.consentSync("http", "_uetsid", "*").cookieOptIn;
                            case "google_ads":
                                return consentApi.consentSync("http", "1P_JAR", ".google.com").cookieOptIn;
                            case 'tiktok':
                                return consentApi.consentSync("http", "tt_webid_v2", ".tiktok.com").cookieOptIn;
                            default:
                                return true;
                        }
                    }
                }

                return true;

            },

            setupGdprCallbacks: function () {

                let isConcent = false;

                /**
                 * Cookiebot
                 */
                if ( options.gdpr.cookiebot_integration_enabled && typeof Cookiebot !== 'undefined' ) {
                    isConcent = true;
                    window.addEventListener( "CookiebotOnConsentReady", function () {

                        let consent = {
                            facebook: true,
                            ga: true,
                            google_ads: true,
                            tiktok: true,
                            bing: true,
                            pinterest: true,
                            gtm: true,
                        };
                        Utils.initializeVideoAPIs( options );

                        Utils.manageCookies();
                        if ( Cookiebot.consent.marketing ) {
                            Facebook.loadPixel();
                            Bing.loadPixel();
                            Pinterest.loadPixel();
                            GAds.loadPixel();
                            TikTok.loadPixel();

                            consent.facebook = true;
                            consent.bing = true;
                            consent.google_ads = true;
                            consent.pinterest = true;
                            consent.tiktok = true;
                        }
                        if ( Cookiebot.consent.statistics ) {
                            Analytics.loadPixel();

                            consent.ga = true;
                            consent.gtm = true;
                        }
                        if ( !Cookiebot.consent.marketing ) {
                            Facebook.disable();
                            Pinterest.disable();
                            Bing.disable()
                            GAds.disable();
                            TikTok.disable();

                            consent.facebook = false;
                            consent.bing = false;
                            consent.google_ads = false;
                            consent.pinterest = false;
                            consent.tiktok = false;
                        }
                        if ( !Cookiebot.consent.statistics ) {
                            Analytics.disable();

                            consent.ga = false;
                            consent.gtm = false;
                        }

                        Utils.setupGDPRData( consent );
                    } );
                }

                /**
                 * Cookie Notice
                 */
                if ( options.gdpr.cookie_notice_integration_enabled ) {
                    isConcent = true;
                    $( document ).onFirst( 'click', '.cn-set-cookie', function () {

                        let consent = {};

                        if ( $( this ).data( 'cookie-set' ) === 'accept' ) {

                            Utils.initializeVideoAPIs( options );

                            Facebook.loadPixel();
                            Analytics.loadPixel();
                            GAds.loadPixel();
                            Pinterest.loadPixel();
                            Bing.loadPixel();
                            TikTok.loadPixel();

                            consent = {
                                facebook: true,
                                ga: true,
                                google_ads: true,
                                tiktok: true,
                                bing: true,
                                pinterest: true,
                                gtm: true,
                            };
                        } else {
                            Facebook.disable();
                            Analytics.disable();
                            GAds.disable();
                            Pinterest.disable();
                            Bing.disable();
                            TikTok.disable();

                            consent = {
                                facebook: false,
                                ga: false,
                                google_ads: false,
                                tiktok: false,
                                bing: false,
                                pinterest: false,
                                gtm: false,
                            };
                        }
                        Utils.setupGDPRData( consent );

                    } );

                    $( document ).onFirst( 'click', '.cn-revoke-cookie', function () {
                        Facebook.disable();
                        Analytics.disable();
                        GAds.disable();
                        Pinterest.disable();
                        Bing.disable();
                        TikTok.disable();

                        let consent = {
                            facebook: false,
                            ga: false,
                            google_ads: false,
                            tiktok: false,
                            bing: false,
                            pinterest: false,
                            gtm: false,
                        };
                        Utils.setupGDPRData( consent );

                    } );
                }

                /**
                 * Cookie Law Info
                 */
                if ( options.gdpr.cookie_law_info_integration_enabled ) {
                    isConcent = true;
                    $( document ).onFirst( 'click', '#wt-cli-accept-all-btn,#cookie_action_close_header, .cky-btn-accept', function () {
                        Utils.initializeVideoAPIs( options );
                        setTimeout( function () {
                            let cli_cookie = Cookies.get( 'cookieyes-consent' ) ?? Cookies.get( 'wt_consent' ) ?? Cookies.get( 'viewed_cookie_policy' );
                            if ( typeof cli_cookie !== 'undefined' ) {
                                if (
                                    cli_cookie &&
                                    (cli_cookie === Cookies.get('cookieyes-consent') || cli_cookie === Cookies.get('wt_consent'))
                                ) {
                                    if (getCookieYes('analytics') === 'yes') {
                                        Utils.manageCookies();
                                    }
                                } else if ( cli_cookie === Cookies.get( 'viewed_cookie_policy' ) && cli_cookie == 'yes' ) {
                                    Utils.manageCookies();
                                }
                            }
                        }, 1000 )
                        Facebook.loadPixel();
                        Analytics.loadPixel();
                        GAds.loadPixel();
                        Pinterest.loadPixel();
                        Bing.loadPixel();
                        TikTok.loadPixel();

                        let consent = {
                            facebook: true,
                            ga: true,
                            google_ads: true,
                            tiktok: true,
                            bing: true,
                            pinterest: true,
                            gtm: true,
                        };
                        Utils.setupGDPRData( consent );
                    } );

                    $( document ).onFirst( 'click', '#cookie_action_close_header_reject, .cky-btn-reject', function () {
                        Facebook.disable();
                        Analytics.disable();
                        GAds.disable();
                        Pinterest.disable();
                        Bing.disable();
                        TikTok.disable();

                        let consent = {
                            facebook: false,
                            ga: false,
                            google_ads: false,
                            tiktok: false,
                            bing: false,
                            pinterest: false,
                            gtm: false,
                        };
                        Utils.setupGDPRData( consent );
                    } );
                }

                /**
                 * ConsentMagic
                 */
                if ( options.gdpr.consent_magic_integration_enabled && typeof CS_Data !== "undefined" ) {
                    isConcent = true;
                    let test_prefix = CS_Data.test_prefix,
                        cs_refresh_after_consent = false,
                        substring = "cs_enabled_cookie_term";

                    if ( CS_Data.cs_refresh_after_consent == 1 ) {
                        cs_refresh_after_consent = CS_Data.cs_refresh_after_consent;
                    }

                    let consent_actions = function () {
                        let theCookies = document.cookie.split( ';' );

                        let consent = {
                            facebook: true,
                            ga: true,
                            google_ads: true,
                            tiktok: true,
                            bing: true,
                            pinterest: true,
                            gtm: true,
                        };

                        for ( let i = 1; i <= theCookies.length; i++ ) {
                            if ( theCookies[ i - 1 ].indexOf( substring ) !== -1 ) {
                                let categoryCookie = theCookies[ i - 1 ].replace( 'cs_enabled_cookie_term' + test_prefix + '_', '' );
                                categoryCookie = Number( categoryCookie.replace( /\D+/g, "" ) );
                                let cs_cookie_val = Cookies.get( 'cs_enabled_cookie_term' + test_prefix + '_' + categoryCookie );
                                if ( cs_cookie_val == 'yes' ) {

                                    Utils.initializeVideoAPIs( options );

                                    if ( ( categoryCookie === CS_Data.cs_script_cat.facebook ) || ( typeof CS_Data.cs_meta_ldu_mode !== "undefined" && CS_Data.cs_meta_ldu_mode ) ) {
                                        Facebook.loadPixel();
                                    }

                                    if ( categoryCookie === CS_Data.cs_script_cat.bing || ( typeof CS_Data.cs_bing_consent_mode !== "undefined" && CS_Data.cs_bing_consent_mode.ad_storage.enabled ) ) {
                                        Bing.loadPixel();
                                    }

                                    if ( categoryCookie === CS_Data.cs_script_cat.analytics || ( typeof CS_Data.cs_google_analytics_consent_mode !== "undefined" && CS_Data.cs_google_analytics_consent_mode == 1 ) ) {
                                        Analytics.loadPixel();
                                    }
                                    if ( categoryCookie === CS_Data.cs_script_cat.gads || ( typeof CS_Data.cs_google_ads_consent_mode !== "undefined" && CS_Data.cs_google_ads_consent_mode == 1 ) ) {
                                        GAds.loadPixel();
                                    }

                                    if ( categoryCookie === CS_Data.cs_script_cat.pinterest ) {
                                        Pinterest.loadPixel();
                                    }

                                    if ( categoryCookie === CS_Data.cs_script_cat.tiktok ) {
                                        TikTok.loadPixel();
                                    }
                                } else {
                                    if ( ( categoryCookie === CS_Data.cs_script_cat.facebook ) && ( typeof CS_Data.cs_meta_ldu_mode == "undefined" || !CS_Data.cs_meta_ldu_mode ) ) {
                                        Facebook.disable();
                                        consent.facebook = false;
                                    }

                                    if ( categoryCookie === CS_Data.cs_script_cat.bing && ( typeof CS_Data.cs_bing_consent_mode == "undefined" || !CS_Data.cs_bing_consent_mode.ad_storage.enabled ) ) {
                                        Bing.disable();
                                        consent.bing = false;
                                    }

                                    if ( categoryCookie === CS_Data.cs_script_cat.analytics && ( typeof CS_Data.cs_google_analytics_consent_mode == "undefined" || CS_Data.cs_google_analytics_consent_mode == 0 ) ) {
                                        Analytics.disable();
                                        consent.ga = false;
                                        consent.gtm = false;
                                    }

                                    if ( categoryCookie === CS_Data.cs_script_cat.gads && ( typeof CS_Data.cs_google_ads_consent_mode == "undefined" || CS_Data.cs_google_ads_consent_mode == 0 ) ) {
                                        GAds.disable();
                                        consent.google_ads = false;
                                    }

                                    if ( categoryCookie === CS_Data.cs_script_cat.pinterest ) {
                                        Pinterest.disable();
                                        consent.pinterest = false;
                                    }

                                    if ( categoryCookie === CS_Data.cs_script_cat.tiktok ) {
                                        TikTok.disable();
                                        consent.tiktok = false;
                                    }
                                }
                                if ( Cookies.get( 'cs_enabled_advanced_matching' ) == 'yes' ) {
                                    Facebook.loadPixel();
                                }
                            }
                        }

                        Utils.setupGDPRData( consent );
                    }

                    if ( !cs_refresh_after_consent ) {
                        consent_actions();

                        $( document ).on( 'click', '.cs_action_btn', function ( e ) {
                            e.preventDefault();

                            let consent = {
                                facebook: true,
                                ga: true,
                                google_ads: true,
                                tiktok: true,
                                bing: true,
                                pinterest: true,
                                gtm: true,
                            };

                            let elm = $( this ),
                                button_action = elm.attr( 'data-cs_action' );

                            if ( button_action === 'allow_all' ) {

                                Utils.initializeVideoAPIs( options );

                                Facebook.loadPixel();
                                Bing.loadPixel();
                                Analytics.loadPixel();
                                GAds.loadPixel();
                                Pinterest.loadPixel();
                                TikTok.loadPixel();

                                consent.facebook = true;
                                consent.bing = true;
                                consent.ga = true;
                                consent.google_ads = true;
                                consent.pinterest = true;
                                consent.tiktok = true;
                                consent.gtm = true;

                                Utils.setupGDPRData( consent );

                            } else if ( button_action === 'disable_all' ) {

                                if (typeof CS_Data.cs_meta_ldu_mode == "undefined" || CS_Data.cs_meta_ldu_mode == 0 ) {
                                    Facebook.disable();
                                    consent.facebook = false;
                                }

                                if (typeof CS_Data.cs_bing_consent_mode == "undefined" || CS_Data.cs_bing_consent_mode.ad_storage.enabled == 0 ) {
                                    Bing.disable();
                                    consent.bing = false;
                                }

                                if ( typeof CS_Data.cs_google_analytics_consent_mode == "undefined" || CS_Data.cs_google_analytics_consent_mode == 0 ) {
                                    Analytics.disable();
                                    consent.ga = false;
                                    consent.gtm = false;
                                }

                                if ( typeof CS_Data.cs_google_ads_consent_mode == "undefined" || CS_Data.cs_google_ads_consent_mode == 0 ) {
                                    GAds.disable();
                                    consent.google_ads = false;
                                }
                                Pinterest.disable();
                                TikTok.disable();

                                consent.pinterest = false;
                                consent.tiktok = false;

                                Utils.setupGDPRData( consent );
                            } else if ( button_action === 'cs_confirm' ) {
                                consent_actions();
                            }
                        } );
                    }
                }

                /**
                 * Real Cookie Banner
                 */
                if ( options.gdpr.real_cookie_banner_integration_enabled ) {
                    isConcent = true;
                    let consentApi = window.consentApi;
                    if ( consentApi ) {
                        consentApi.consent( "http", "_ga", "*" )
                            .then( Analytics.loadPixel.bind( Analytics ), Analytics.disable.bind( Analytics ) );
                        consentApi.consent( "http", "1P_JAR", ".google.com" )
                            .then( GAds.loadPixel.bind( GAds ), GAds.disable.bind( GAds ) );
                        consentApi.consent( "http", "_fbp", "*" )
                            .then( Facebook.loadPixel.bind( Facebook ), Facebook.disable.bind( Facebook ) );
                        consentApi.consent( "http", "_pinterest_sess", ".pinterest.com" )
                            .then( Pinterest.loadPixel.bind( Pinterest ), Pinterest.disable.bind( Pinterest ) );
                        consentApi.consent( "http", "_uetsid", "*" )
                            .then( Bing.loadPixel.bind( Bing ), Bing.disable.bind( Bing ) );
                        consentApi.consent( "http", "tt_webid_v2", ".tiktok.com" )
                            .then( TikTok.loadPixel.bind( TikTok ), TikTok.disable.bind( TikTok ) );

                        let consent = {
                            facebook: true,
                            ga: true,
                            google_ads: true,
                            tiktok: true,
                            bing: true,
                            pinterest: true,
                            gtm: true,
                        };

                        if (!consentApi.consentSync("http", "_ga", "*").cookieOptIn) {
                            consent.ga = false;
                            consent.gtm = false;
                        }
                        if (!consentApi.consentSync("http", "_fbp", "*").cookieOptIn) {
                            consent.facebook = false;
                        }
                        if (!consentApi.consentSync("http", "_pinterest_sess", ".pinterest.com").cookieOptIn) {
                            consent.pinterest = false;
                        }
                        if (!consentApi.consentSync("http", "_uetsid", "*").cookieOptIn) {
                            consent.bing = false;
                        }
                        if (!consentApi.consentSync("http", "1P_JAR", ".google.com").cookieOptIn) {
                            consent.google_ads = false;
                        }
                        if (!consentApi.consentSync("http", "tt_webid_v2", ".tiktok.com").cookieOptIn) {
                            consent.tiktok = false;
                        }
                        Utils.setupGDPRData( consent );

                        // load WatchVideo event APIs for Auto
                        /**
                         * Real Cookie Banner.
                         */
                        if ( options.hasOwnProperty( 'automatic' ) && options.automatic.enable_video && options.automatic.enable_youtube ) {
                            consentApi.consent( "http", "CONSENT", ".youtube.com" ).then( Utils.initYouTubeAPI );
                        }

                        if ( options.hasOwnProperty( 'automatic' ) && options.automatic.enable_video && options.automatic.enable_vimeo ) {
                            consentApi.consent( "http", "player", ".vimeo.com" ).then( Utils.initVimeoAPI );
                        }
                    }
                }

                if ( !isConcent ) {
                    Utils.initializeVideoAPIs( options );
                }
            },

            setupGDPRData: function ( consent ) {
                consent = window.btoa( JSON.stringify( consent ) );
                Cookies.set( 'pys_consent', consent, { expires: 365, path: '/', domain: domain } );
            },

            /**
             * Enrich
             */
            isCheckoutPage: function () {
                return $('body').hasClass('woocommerce-checkout') || document.querySelector('.woocommerce-checkout') ||
                    $('body').hasClass('edd-checkout');
            },
            addCheckoutFields : function() {
                var utm = "";
                var utms = getUTMs()
                $.each(utmTerms, function (index, name) {
                    if(index > 0) {
                        utm+="|";
                    }
                    utm+=name+":"+utms[name];
                });
                var utmIdList = "";
                var utmsIds = getUTMId()
                $.each(utmId, function (index, name) {
                    if(index > 0) {
                        utmIdList+="|";
                    }
                    utmIdList+=name+":"+utmsIds[name];
                });
                var utmIdListLast = "";
                var utmsIdsLast = getUTMId(true)
                $.each(utmId, function (index, name) {
                    if(index > 0) {
                        utmIdListLast+="|";
                    }
                    utmIdListLast+=name+":"+utmsIdsLast[name];
                });


                var utmLast = "";
                var utmsLast = getUTMs(true)
                $.each(utmTerms, function (index, name) {
                    if(index > 0) {
                        utmLast+="|";
                    }
                    utmLast+=name+":"+utmsLast[name];
                });

                var dateTime = getDateTime();
                var landing = Cookies.get('pys_landing_page');
                var lastLanding = Cookies.get('last_pys_landing_page');
                var trafic = Cookies.get('pysTrafficSource');
                var lastTrafic = Cookies.get('last_pysTrafficSource');

                var $form = null;
                if($('body').hasClass('woocommerce-checkout')) {
                    $form = $("form.woocommerce-checkout");
                } else {
                    $form = $("#edd_purchase_form");
                }
                var inputs = {'pys_utm':utm,
                    'pys_utm_id':utmIdList,
                    'pys_browser_time':dateTime.join("|"),
                    'pys_landing':landing,
                    'pys_source':trafic,
                    'pys_order_type': $(".wcf-optin-form").length > 0 ? "wcf-optin" : "normal",

                    'last_pys_landing':lastLanding,
                    'last_pys_source':lastTrafic,
                    'last_pys_utm':utmLast,
                    'last_pys_utm_id':utmIdListLast,
                }

                Object.keys(inputs).forEach(function(key,index) {
                    $form.append("<input type='hidden' name='"+key+"' value='"+inputs[key]+"' /> ");
                });


            },

            /**
             * Advanced From Data
             */
            saveAdvancedFormData: function ( email, phone, firstName, lastName, override = true ) {

                if ( !options.cookie.disabled_advanced_form_data_cookie ) {
                    let data = Utils.getAdvancedFormData();
                    // Ensure data["address"] is an object

                    if ( email != null ) {
                        if ( !override ) {
                            if ( typeof data[ "email" ] === 'undefined' || !data[ "email" ] ) {
                                data[ "email" ] = email;
                            }
                        } else {
                            data[ "email" ] = email;
                        }

                        if ( typeof data[ "emails" ] === 'object' ) {
                            if ( override ) {
                                data[ "emails" ] = [ email, ...Object.values( data[ "emails" ] ) ];
                            } else {
                                data[ "emails" ] = [ ...Object.values( data[ "emails" ] ), email ];
                            }
                        } else {
                            data[ "emails" ] = [ email ];
                        }
                        data[ "emails" ] = [ ...new Set( data[ "emails" ] ) ];
                        data[ "emails" ] = data[ "emails" ].slice( 0, 3 );
                    }

                    if ( phone != null ) {
                        if ( !override ) {
                            if ( typeof data[ "phone" ] === 'undefined' || !data[ "phone" ] ) {
                                data[ "phone" ] = phone;
                            }
                        } else {
                            data[ "phone" ] = phone;
                        }

                        if ( typeof data[ "phones" ] === 'object' ) {
                            if ( override ) {
                                data[ "phones" ] = [ phone, ...Object.values( data[ "phones" ] ) ];
                            } else {
                                data[ "phones" ] = [ ...Object.values( data[ "phones" ] ), phone ];
                            }
                        } else {
                            data[ "phones" ] = [ phone ];
                        }
                        data[ "phones" ] = [ ...new Set( data[ "phones" ] ) ];
                        data[ "phones" ] = data[ "phones" ].slice( 0, 3 );
                    }

                    if ( firstName != null ) {
                        if ( !override ) {
                            if ( typeof data[ "first_name" ] === 'undefined' || !data[ "first_name" ] ) {
                                data[ "first_name" ] = firstName;
                            }
                        } else {
                            data[ "first_name" ] = firstName;
                        }

                        if ( typeof data[ "fns" ] === 'object' ) {
                            if ( override ) {
                                data[ "fns" ] = [ firstName, ...Object.values( data[ "fns" ] ) ];
                            } else {
                                data[ "fns" ] = [ ...Object.values( data[ "fns" ] ), firstName ];
                            }
                        } else {
                            data[ "fns" ] = [ firstName ];
                        }
                        data[ "fns" ] = [ ...new Set( data[ "fns" ] ) ];
                        data[ "fns" ] = data[ "fns" ].slice( 0, 2 );
                    }

                    if ( lastName != null ) {
                        if ( !override ) {
                            if ( typeof data[ "last_name" ] === 'undefined' || !data[ "last_name" ] ) {
                                data[ "last_name" ] = lastName;
                            }
                        } else {
                            data[ "last_name" ] = lastName;
                        }

                        if ( typeof data[ "lns" ] === 'object' ) {
                            if ( override ) {
                                data[ "lns" ] = [ lastName, ...Object.values( data[ "lns" ] ) ];
                            } else {
                                data[ "lns" ] = [ ...Object.values( data[ "fns" ] ), lastName ];
                            }
                        } else {
                            data[ "lns" ] = [ lastName ];
                        }
                        data[ "lns" ] = [ ...new Set( data[ "lns" ] ) ];
                        data[ "lns" ] = data[ "lns" ].slice( 0, 2 );
                    }

                    Cookies.set( 'pys_advanced_form_data', JSON.stringify( data ), { expires: 300,path: '/',domain: domain } );
                } else {
                    Cookies.remove( 'pys_advanced_form_data', { path: '/',domain: domain } )
                }
                if(GTM.isEnabled()){
                    GTM.updateEnhancedConversionData();
                }
                if(Analytics.isEnabled()){
                    Analytics.updateEnhancedConversionData();
                } else if ( GAds.isEnabled() ) {
                    GAds.updateEnhancedConversionData();
                }
            },
            getAdvancedMergeFormData: function (allways_provided_data = false) {
                const advanced = Utils.getAdvancedFormData();
                let mergedData = {},
                    limit = options.tracking_analytics.use_multiple_provided_data || allways_provided_data ? 3 : 1,
                    address_limit = options.tracking_analytics.use_multiple_provided_data || allways_provided_data ? 2 : 1;

                if ( options.tracking_analytics.use_encoding_provided_data || allways_provided_data) {
                    mergedData.sha256_email_address = [];
                    mergedData.sha256_phone_number = [];
                    mergedData.address = [];
                    if ( options.tracking_analytics.hasOwnProperty( "userData" ) ) {
                        if ( options.tracking_analytics.userData.hasOwnProperty( "emails" ) && Object.keys( options.tracking_analytics.userData.emails ).length > 0 ) {
                            Object.keys( options.tracking_analytics.userData.emails ).forEach( ( key ) => {
                                mergedData.sha256_email_address.push( sha256( options.tracking_analytics.userData.emails[ key ] ) );
                            } )
                        }
                        if ( options.tracking_analytics.userData.hasOwnProperty( "phones" ) && Object.keys( options.tracking_analytics.userData.phones ).length > 0 ) {
                            Object.keys( options.tracking_analytics.userData.phones ).forEach( ( key ) => {
                                mergedData.sha256_phone_number.push( sha256( options.tracking_analytics.userData.phones[ key ] ) );
                            } )
                        }
                        if ( options.tracking_analytics.userData.hasOwnProperty( "addresses" ) && Object.keys( options.tracking_analytics.userData.addresses ).length > 0 ) {
                            Object.keys( options.tracking_analytics.userData.addresses ).forEach( ( key ) => {
                                let address = Object.assign( {}, options.tracking_analytics.userData.addresses[ key ] );

                                if ( address.first_name ) {
                                    address.sha256_first_name = address.first_name !== '' ? sha256( address.first_name ) : '';
                                    delete address.first_name;
                                }
                                if ( address.last_name ) {
                                    address.sha256_last_name = address.last_name !== '' ? sha256( address.last_name ) : '';
                                    delete address.last_name;
                                }
                                mergedData.address.push( address );
                            } )
                        }
                    }

                    let data_persistency = options.data_persistency;

                    //emails
                    if ( advanced.emails && Object.keys( advanced.emails ).length > 0 ) {
                        Object.keys( advanced.emails ).forEach( ( key ) => {
                            if ( data_persistency === 'recent_data' ) {
                                mergedData.sha256_email_address.push( sha256( advanced.emails[ key ] ) );
                            } else {
                                mergedData.sha256_email_address.unshift( sha256( advanced.emails[ key ] ) );
                            }
                        } )
                    }
                    if ( advanced.email && advanced.email !== '' ) {
                        if ( data_persistency === 'recent_data' ) {
                            mergedData.sha256_email_address.push( sha256( advanced.email ) );
                        } else {
                            mergedData.sha256_email_address.unshift( sha256( advanced.email ) );
                        }
                    }
                    mergedData.sha256_email_address = [ ...new Set( mergedData.sha256_email_address ) ];
                    mergedData.sha256_email_address = mergedData.sha256_email_address.slice( 0, limit );

                    //phones
                    if ( advanced.phones && Object.keys( advanced.phones ).length > 0 ) {
                        Object.keys( advanced.phones ).forEach( ( key ) => {
                            if ( data_persistency === 'recent_data' ) {
                                mergedData.sha256_phone_number.push( sha256( advanced.phones[ key ] ) );
                            } else {
                                mergedData.sha256_phone_number.unshift( sha256( advanced.phones[ key ] ) );
                            }
                        } )
                    }
                    if ( advanced.phone && advanced.phone !== '' ) {
                        if ( data_persistency === 'recent_data' ) {
                            mergedData.sha256_phone_number.push( sha256( advanced.phone ) );
                        } else {
                            mergedData.sha256_phone_number.unshift( sha256( advanced.phone ) );
                        }
                    }
                    mergedData.sha256_phone_number = [ ...new Set( mergedData.sha256_phone_number ) ];
                    mergedData.sha256_phone_number = mergedData.sha256_phone_number.slice( 0, limit );

                    //first and last names
                    if ( advanced.fns && Object.keys( advanced.fns ).length > 0 ) {
                        Object.entries( advanced.fns ).forEach( ( item ) => {
                            if ( mergedData.address.length < address_limit ) {
                                let first_name = item[ 1 ];
                                let last_name = ( advanced.lns && Object.keys( advanced.lns ).length > 0 ) ? ( advanced.lns[ item[ 0 ] ] ? advanced.lns[ item[ 0 ] ] : advanced.lns[ 0 ] ) : '';
                                let address = {
                                    sha256_first_name: first_name !== '' ? sha256( first_name ) : '',
                                    sha256_last_name: last_name !== '' ? sha256( last_name ) : '',
                                    // Add other address properties here if they exist in advanced
                                };
                                mergedData.address.push( address );
                            }
                        } )
                    }

                    if ( advanced.first_name || advanced.last_name ) {
                        if ( mergedData.address.length < address_limit ) {
                            let address = {
                                sha256_first_name: advanced.first_name !== '' ? sha256( advanced.first_name ) : '',
                                sha256_last_name: advanced.last_name !== '' ? sha256( advanced.last_name ) : '',
                                // Add other address properties here if they exist in advanced
                            };
                            mergedData.address.push( address );
                        }
                    }
                } else {
                    mergedData.email = [];
                    mergedData.phone_number = [];
                    mergedData.address = [];
                    if ( options.tracking_analytics.hasOwnProperty( "userData" ) ) {
                        if ( options.tracking_analytics.userData.hasOwnProperty( "emails" ) && Object.keys( options.tracking_analytics.userData.emails ).length > 0 ) {
                            Object.keys( options.tracking_analytics.userData.emails ).forEach( ( key ) => {
                                mergedData.email.push( options.tracking_analytics.userData.emails[ key ] );
                            } )
                        }
                        if ( options.tracking_analytics.userData.hasOwnProperty( "phones" ) && Object.keys( options.tracking_analytics.userData.phones ).length > 0 ) {
                            Object.keys( options.tracking_analytics.userData.phones ).forEach( ( key ) => {
                                mergedData.phone_number.push( options.tracking_analytics.userData.phones[ key ] );
                            } )
                        }
                        if ( options.tracking_analytics.userData.hasOwnProperty( "addresses" ) && Object.keys( options.tracking_analytics.userData.addresses ).length > 0 ) {
                            Object.keys( options.tracking_analytics.userData.addresses ).forEach( ( key ) => {
                                mergedData.address.push( options.tracking_analytics.userData.addresses[ key ] );
                            } )
                        }
                    }

                    let data_persistency = options.data_persistency;

                    //emails
                    if ( advanced.emails && Object.keys( advanced.emails ).length > 0 ) {
                        Object.keys( advanced.emails ).forEach( ( key ) => {
                            if ( data_persistency === 'recent_data' ) {
                                mergedData.email.push( advanced.emails[ key ] );
                            } else {
                                mergedData.email.unshift( advanced.emails[ key ] );
                            }
                        } )
                    }
                    if ( advanced.email && advanced.email !== '' ) {
                        if ( data_persistency === 'recent_data' ) {
                            mergedData.email.push( advanced.email );
                        } else {
                            mergedData.email.unshift( advanced.email );
                        }
                    }
                    mergedData.email = [ ...new Set( mergedData.email ) ];
                    mergedData.email = mergedData.email.slice( 0, limit );

                    //phones
                    if ( advanced.phones && Object.keys( advanced.phones ).length > 0 ) {
                        Object.keys( advanced.phones ).forEach( ( key ) => {
                            if ( data_persistency === 'recent_data' ) {
                                mergedData.phone_number.push( advanced.phones[ key ] );
                            } else {
                                mergedData.phone_number.unshift( advanced.phones[ key ] );
                            }
                        } )
                    }
                    if ( advanced.phone && advanced.phone !== '' ) {
                        if ( data_persistency === 'recent_data' ) {
                            mergedData.phone_number.push( advanced.phone );
                        } else {
                            mergedData.phone_number.unshift( advanced.phone );
                        }
                    }
                    mergedData.phone_number = [ ...new Set( mergedData.phone_number ) ];
                    mergedData.phone_number = mergedData.phone_number.slice( 0, limit );

                    //first and last names
                    if ( advanced.fns && Object.keys( advanced.fns ).length > 0 ) {
                        Object.entries( advanced.fns ).forEach( ( item ) => {
                            if ( mergedData.address.length < address_limit ) {
                                let first_name = item[ 1 ];
                                let last_name = ( advanced.lns && Object.keys( advanced.lns ).length > 0 ) ? ( advanced.lns[ item[ 0 ] ] ? advanced.lns[ item[ 0 ] ] : advanced.lns[ 0 ] ) : '';
                                let address = {
                                    first_name: first_name || '',
                                    last_name: last_name || '',
                                    // Add other address properties here if they exist in advanced
                                };
                                mergedData.address.push( address );
                            }
                        } )
                    }

                    if ( advanced.first_name || advanced.last_name ) {
                        if ( mergedData.address.length < address_limit ) {
                            let address = {
                                first_name: advanced.first_name || '',
                                last_name: advanced.last_name || '',
                                // Add other address properties here if they exist in advanced
                            };
                            mergedData.address.push( address );
                        }
                    }
                }

                Utils.removeEmptyProperties( mergedData );
                return mergedData;
            },
            removeEmptyProperties : function(obj) {

                if (obj.hasOwnProperty('address')) {
                    // Проходим по каждому массиву в 'address'
                    for (let i = 0; i < obj['address'].length; i++) {
                        let address1 = obj['address'][i];

                        // Сравниваем с каждым другим массивом в 'address'
                        for (let j = i + 1; j < obj['address'].length; j++) {
                            let address2 = obj['address'][j];

                            // Если находим дублирующиеся свойства, удаляем их из address2
                            for (let prop in address1) {
                                if (address1[prop] === address2[prop]) {
                                    delete address2[prop];
                                }
                            }
                        }
                    }
                }

                for (let key in obj) {
                    if (obj[key] === null || obj[key] === undefined || obj[key] === '') {
                        delete obj[key];
                    } else if (Array.isArray(obj[key])) {
                        obj[key] = [...new Set(obj[key])]; // Удаление дубликатов из массива
                        obj[key] = obj[key].filter(item => item !== null && item !== undefined && item !== '');
                        // Обработка объектов внутри массивов
                        obj[key] = obj[key].map(item => {
                            if (item === null) {
                                return; // Пропускаем null элементы
                            } else if (Array.isArray(item)) {
                                return this.removeEmptyProperties(item);
                            } else if (typeof item === 'object') {
                                let cleanedItem = this.removeEmptyProperties(item);
                                if (Object.keys(cleanedItem).length > 0) {
                                    return cleanedItem;
                                }
                            } else {
                                return item;
                            }
                        });
                        // Удаляем пустые объекты и null из массива
                        obj[key] = obj[key].filter(item => item !== undefined && !(typeof item === 'object' && Object.keys(item).length === 0));
                        if (obj[key].length === 0) {
                            delete obj[key];
                        }
                    } else if (typeof obj[key] === 'object') {
                        this.removeEmptyProperties(obj[key]);
                        if (Object.keys(obj[key]).length === 0) {
                            delete obj[key];
                        }
                    }
                }
                return obj;
            },
            getAdvancedFormData: function () {
                let dataStr = Cookies.get("pys_advanced_form_data");
                if(dataStr === undefined) {
                    return {'first_name':"",'last_name':"",'email':"",'phone':"",'fns':[],'lns':[],'emails':[],'phones':[]};
                } else {
                    return JSON.parse(dataStr);
                }
            },

            getFormFilledData: function ( event ) {
                if ( Object.keys(options.track_dynamic_fields).length > 0 && Object.keys(event.params).length > 0 ) {
                    Object.entries(event.params).forEach((item) => {

                        if ( options.track_dynamic_fields.hasOwnProperty(item[0]) ) {
                            let fieldData = Cookies.get('pys_dyn_field_' + item[1] );

                            if(fieldData !== undefined && fieldData !== '') {
                                event.params[item[0]] = fieldData;
                            } else {
                                delete event.params[item[0]];
                            }
                        }
                    })
                }
                return event;
            }

        };

    }(options);

    var TikTok = function (options) {

        var initialized = false;

        function fireEvent(name, event) {

            if(typeof window.pys_event_data_filter === "function" && window.pys_disable_event_filter(name,'tiktok')) {
                return;
            }

            var data = event.params;

            var ids = event.pixelIds.filter(function (pixelId) {
                return !Utils.hideMatchingPixel(pixelId, 'tiktok');
            })
            var params = {};
            Utils.copyProperties(data, params);

            params.eventID = Utils.generateUniqueId(event);

            if(ids.length > 0){
                TikTok.fireEventAPI(name, event, params);
            }
            ids.forEach(function(pixelId){
                if (options.debug) {
                    console.log('[TikTok] ' + name, params,"pixel_id",pixelId);
                }

                ttq.instance(pixelId).track(name,params)

            });

            var customEvent = new CustomEvent('tiktok_event_sent', {
                detail: {
                    eventName: name,
                    params: params,
                    pixel_ids: ids
                }
            });
            window.dispatchEvent(customEvent);
        }

        return {
            tag: function() {
                return "tiktok";
            },
            isEnabled: function () {
                return options.hasOwnProperty('tiktok');
            },
            getHidePixel: function(){
                if(this.isEnabled() && options.tiktok.hasOwnProperty('hide_pixels'))
                {
                    return options.tiktok.hide_pixels;
                }
                return [];
            },
            disable: function () {
                initialized = false;
            },

            loadPixel:function () {
                if (initialized || !this.isEnabled() || !Utils.consentGiven('tiktok')) {
                    return;
                }
                for (var i = 0; i < options.tiktok.pixelIds.length; i++) {
                    var trackingId = options.tiktok.pixelIds[i];
                    if (!Utils.hideMatchingPixel(trackingId, 'tiktok')) {
                        !function (w, d, t) {
                            w.TiktokAnalyticsObject=t;
                            var ttq=w[t]=w[t]||[];
                            ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"];
                            ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};
                            for(var i=0;i<ttq.methods.length;i++)
                                ttq.setAndDefer(ttq,ttq.methods[i]);
                            ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e};
                            ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=i,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};var o=document.createElement("script");o.type="text/javascript",o.async=!0,o.src=i+"?sdkid="+e+"&lib="+t;var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a)};

                            //ttq.load('C60QSCQRVDG9JAKNPK2G');
                            //ttq.page();
                        }(window, document, 'ttq');
                        break;
                    }
                }


                var ids = options.tiktok.pixelIds.filter(function (pixelId) {
                    return !Utils.hideMatchingPixel(pixelId, 'tiktok');
                })
                ids.forEach(function (pixelId) {

                    ttq.load(pixelId);
                    ttq.page();
                    let advancedMatching = {};
                    if(options.tiktok.hasOwnProperty('advanced_matching')
                        && Object.keys(options.tiktok.advanced_matching).length > 0) {
                        advancedMatching = options.tiktok.advanced_matching;
                        if(!advancedMatching.hasOwnProperty("external_id")){
                            if (Cookies.get('pbid')) {
                                advancedMatching["external_id"] = Cookies.get('pbid');
                            }
                        }
                        else if(advancedMatching.hasOwnProperty("external_id") && advancedMatching.external_id != Cookies.get('pbid'))
                        {
                            advancedMatching["external_id"] = Cookies.get('pbid') ? Cookies.get('pbid') : advancedMatching.external_id;
                        }

                        ttq.instance(pixelId).identify(advancedMatching)
                    }
                });
                initialized = true;

                if (options.staticEvents.hasOwnProperty('tiktok')) {
                    var timeout = 1;
                    setTimeout(function (timeout) {
                        Utils.fireStaticEvents('tiktok', timeout);
                    }, 1500, timeout)
                }
            },

            fireEvent: function (name, data) {
                if (!initialized || !this.isEnabled()) {
                    return false;
                }
                data.delay = data.delay || 0;

                if (data.delay === 0) {
                    fireEvent(name, data);
                } else {
                    setTimeout(function (name, params) {
                        fireEvent(name, params);
                    }, data.delay * 1000, name, data);
                }
                return true;
            },

            fireEventAPI: function (name, event, params) {

                var ids = event.pixelIds.filter(function (pixelId) {
                    return !Utils.hideMatchingPixel(pixelId, 'tiktok');
                })
                var notCachedEventsIds = new Array();
                var isAddToCartFromJs =  options.woo.hasOwnProperty("addToCartCatchMethod")
                    && options.woo.addToCartCatchMethod === "add_cart_js";
                if(!isAddToCartFromJs) {
                    notCachedEventsIds.push('woo_add_to_cart_on_button_click')
                }

                if(options.tiktok.serverApiEnabled) {
                    if(!notCachedEventsIds.includes(event.e_id)) {

                        var isApiDisabled = options.gdpr.all_disabled_by_api ||
                            options.gdpr.tiktok_disabled_by_api ||
                            options.gdpr.cookiebot_integration_enabled ||
                            options.gdpr.cookie_notice_integration_enabled ||
                            options.gdpr.consent_magic_integration_enabled ||
                            options.gdpr.cookie_law_info_integration_enabled;
                        // Update eventID

                        // send event from server if they were block by gdpr or need send with delay
                        if( options.ajaxForServerEvent || isApiDisabled || event.delay > 0 || event.type !== "static" ){

                            var json = {
                                action: 'pys_tiktok_api_event',
                                pixel: TikTok.tag(),
                                event: name,
                                ids: ids,
                                data:params,
                                url:window.location.href,
                                event_id:params.eventID,
                                ajax_event:options.ajax_event
                            };

                            let delay = 0;
                            try {
                                if (sessionStorage) {
                                    Object.keys(sessionStorage)
                                        .filter(key => key.startsWith('wc_fragments_'))
                                        .forEach((key) => {
                                            let value = sessionStorage.getItem(key);
                                            if (event.e_id === 'woo_add_to_cart_on_button_click') {
                                                delay = 2000;
                                            }
                                        });
                                }
                            } catch (error) {
                                console.error('sessionStorage is not accessible:', error);
                            }


                            if(event.hasOwnProperty('woo_order')) {
                                json['woo_order'] = event.woo_order;
                            }

                            if(event.hasOwnProperty('edd_order')) {
                                json['edd_order'] = event.edd_order;
                            }
                            if(event.e_id === "automatic_event_internal_link"
                                || event.e_id === "automatic_event_outbound_link"
                                || name == 'PageView'
                            ) {
                                setTimeout(function(){
                                    delay = delay === 0 ? 500 : delay;
                                    Utils.sendServerAjaxRequest(options.ajaxUrl, json)
                                },delay)
                            } else {
                                setTimeout( () => Utils.sendServerAjaxRequest( options.ajaxUrl, json ), delay );
                            }
                        }
                    }
                }
            },

            onClickEvent: function (event) {
                this.fireEvent(event.name, event);
            },

            onWooAddToCartOnSingleEvent: function (product_id, qty, product_type, is_external, $form) {

                window.pysWooProductData = window.pysWooProductData || [];
                if (!options.dynamicEvents.woo_add_to_cart_on_button_click.hasOwnProperty(this.tag()))
                    return;

                if (window.pysWooProductData.hasOwnProperty(product_id)) {
                    if (window.pysWooProductData[product_id].hasOwnProperty(this.tag())) {

                        var event = Utils.clone(options.dynamicEvents.woo_add_to_cart_on_button_click[this.tag()]);

                        Utils.copyProperties(window.pysWooProductData[product_id][this.tag()]['params'], event.params);

                        // maybe customize value option
                        if (options.woo.addToCartOnButtonValueEnabled && options.woo.addToCartOnButtonValueOption !== 'global') {

                            if (product_type === Utils.PRODUCT_BUNDLE) {
                                var data = $(".bundle_form .bundle_data").data("bundle_form_data");
                                var items_sum = getBundlePriceOnSingleProduct(data);
                                event.params.value = (parseFloat(data.base_price) + items_sum) * qty;
                            } else {
                                event.params.value = event.params.value * qty;
                            }
                        }

                        event.params.quantity = qty;

                        this.fireEvent(event.name, event);

                    }
                }
            },

            onWooAddToCartOnButtonEvent: function (product_id) {
                if(!options.dynamicEvents.woo_add_to_cart_on_button_click.hasOwnProperty(this.tag()))
                    return;

                if (window.pysWooProductData.hasOwnProperty(product_id)) {
                    if (window.pysWooProductData[product_id].hasOwnProperty(this.tag())) {
                        var productData = window.pysWooProductData[product_id][this.tag()]
                        var event = Utils.clone(options.dynamicEvents.woo_add_to_cart_on_button_click[this.tag()])

                        Utils.copyProperties(productData['params'], event.params)
                        event.pixelIds = productData['pixelIds'];
                        this.fireEvent(event.name, event);
                    }
                }
            },

            onEddAddToCartOnButtonEvent : function (download_id, price_index, qty) {
                if(!options.dynamicEvents.edd_add_to_cart_on_button_click.hasOwnProperty(this.tag()))
                    return;
                var event = Utils.clone(options.dynamicEvents.edd_add_to_cart_on_button_click[this.tag()]);


                if (window.pysEddProductData.hasOwnProperty(download_id)) {

                    var index;

                    if (price_index) {
                        index = download_id + '_' + price_index;
                    } else {
                        index = download_id;
                    }

                    if (window.pysEddProductData[download_id].hasOwnProperty(index)) {
                        if (window.pysEddProductData[download_id][index].hasOwnProperty(this.tag())) {

                            Utils.copyProperties(window.pysEddProductData[download_id][index][this.tag()].params, event.params);
                            this.fireEvent(event.name,event);

                        }
                    }

                }
            },

            onPageScroll: function (event) {
                if (initialized && this.isEnabled()) {
                    this.fireEvent(event.name, event);
                }
            },

            onWatchVideo: function (event) {
                if (initialized && this.isEnabled() && !event.fired) {
                    this.fireEvent(event.name, event);
                }
            },

            onCommentEvent: function (event) {
                if (initialized && this.isEnabled()) {
                    this.fireEvent(event.name, event);
                }
            },

            onAdSenseEvent: function (event) {
                if (initialized && this.isEnabled()) {
                    this.fireEvent(event.name, event);
                }
            },

            onTime: function (event) {
                if (initialized && this.isEnabled()) {
                    this.fireEvent(event.name, event);
                }
            },
        }
    }(options);

    var Facebook = function (options) {

        var defaultEventTypes = [
            'PageView',
            'ViewContent',
            'Search',
            'AddToCart',
            'AddToWishlist',
            'InitiateCheckout',
            'AddPaymentInfo',
            'Purchase',
            'Lead',

            'Subscribe',
            'CustomizeProduct',
            'FindLocation',
            'StartTrial',
            'SubmitApplication',
            'Schedule',
            'Contact',
            'Donate'
        ];

        var notCachedEventsIds = new Array();
        var isAddToCartFromJs =  options.woo.hasOwnProperty("addToCartCatchMethod")
            && options.woo.addToCartCatchMethod === "add_cart_js";
        if(!isAddToCartFromJs) {
            notCachedEventsIds.push('woo_add_to_cart_on_button_click')
        }

        var initialized = false;

        var genereateFbp = function (){
            return !Cookies.get('_fbp') ? 'fb.1.'+Date.now()+'.'+Math.floor(1000000000 + Math.random() * 9000000000) : Cookies.get('_fbp');
        };
        var genereateFbc = function (){
            return getUrlParameter('fbclid') ? 'fb.1.'+Date.now()+'.'+getUrlParameter('fbclid') : ''
        };

        var configuredPixels = new Array();
        function fireEvent(name, event) {


            if(typeof window.pys_event_data_filter === "function" && window.pys_disable_event_filter(name,'facebook')) {
                return;
            }

            var data = event.params;
            var ids = event.pixelIds.filter(function (pixelId) {
                return !Utils.hideMatchingPixel(pixelId, 'facebook');
            });

            var actionType = defaultEventTypes.includes(name) ? 'trackSingle' : 'trackSingleCustom';

            var params = {};

            Utils.copyProperties(data, params);
            Utils.copyProperties(Utils.getRequestParams(), params);
            Utils.copyProperties(Utils.getRequestParams(), data);

            params = Facebook.filterParams(params);


            if(options.facebook.serverApiEnabled) {
                if(event.e_id === "woo_remove_from_cart" ) {
                    Facebook.updateEventId(event.name);
                    event.eventID = Facebook.getEventId(event.name);
                } else if(!notCachedEventsIds.includes(event.e_id)) {
                    var isApiDisabled = options.gdpr.all_disabled_by_api ||
                        options.gdpr.facebook_disabled_by_api ||
                        options.gdpr.cookiebot_integration_enabled ||
                        options.gdpr.cookie_notice_integration_enabled ||
                        options.gdpr.consent_magic_integration_enabled ||
                        options.gdpr.cookie_law_info_integration_enabled;
                    // Update eventID

                    event.eventID = Utils.generateUniqueId(event);

                    if(Cookies.get('_fbp')){
                        params._fbp = Cookies.get('_fbp');
                    }
                    if(Cookies.get('_fbc')){
                        params._fbc = Cookies.get('_fbc');
                    }
                    // send event from server if they was bloc by gdpr or need send with delay
                    if( options.ajaxForServerEvent || isApiDisabled ){

                        var json = {
                            action: 'pys_api_event',
                            pixel: 'facebook',
                            event: name,
                            ids: ids,
                            data:params,
                            url:window.location.href,
                            eventID:event.eventID,
                            ajax_event:options.ajax_event
                        };

                        if(event.hasOwnProperty('woo_order')) {
                            json['woo_order'] = event.woo_order;
                        }

                        if(event.hasOwnProperty('edd_order')) {
                            json['edd_order'] = event.edd_order;
                        }

                        let delay = 0;
                        try {
                            if (sessionStorage) {
                                Object.keys(sessionStorage)
                                    .filter(key => key.startsWith('wc_fragments_'))
                                    .forEach((key) => {
                                        let value = sessionStorage.getItem(key);
                                        if (event.e_id === 'woo_add_to_cart_on_button_click') {
                                            delay = 2000;
                                        }
                                    });
                            }
                        } catch (error) {
                            console.error('sessionStorage is not accessible:', error);
                        }

                        if (event.e_id === "automatic_event_internal_link" || event.e_id === "automatic_event_outbound_link") {
                            delay = delay === 0 ? 500 : delay;
                            setTimeout(() => Utils.sendServerAjaxRequest(options.ajaxUrl, json), delay);
                        } else if (event.type != 'static') {
                            setTimeout(() => Utils.sendServerAjaxRequest(options.ajaxUrl, json), delay);
                        }

                        if ( ( event.type == 'static' && options.ajaxForServerStaticEvent ) || ( event.hasOwnProperty( 'ajaxFire' ) && event.ajaxFire ) ) {
                            setTimeout( () => Utils.sendServerAjaxRequest( options.ajaxUrl, json ), delay );
                        }
                    }

                    if( event.e_id !== "automatic_event_signup" && name == "CompleteRegistration" && options.facebook.wooCRSendFromServer ) {
                        return;
                    }
                }

            }
            delete params._fbp;
            delete params._fbc;
            if (options.debug) {
                console.log('[Facebook] ' + name, params,"pixel_ids",ids,"eventID",event.eventID);
            }
            // fire event for each pixel id
            ids.forEach(function (pixelId) {
                // add eventID for deduplicate events @see https://developers.facebook.com/docs/marketing-api/conversions-api/deduplicate-pixel-and-server-events/
                var args = {};
                if(options.facebook.serverApiEnabled && event.hasOwnProperty('eventID')) {
                    args.eventID = event.eventID;
                }
                Facebook.maybeInitPixel(pixelId);
                fbq(actionType,pixelId, name, params,args);
            });
            var customEvent = new CustomEvent('facebook_event_sent', {
                detail: {
                    eventName: name,
                    params: params,
                    pixel_ids: ids
                }
            });
            window.dispatchEvent(customEvent);
        }

        /**
         * Public API
         */
        return {
            tag: function() {
                return "facebook";
            },
            isEnabled: function () {
                return options.hasOwnProperty('facebook');
            },
            getHidePixel: function(){
                if(this.isEnabled() && options.facebook.hasOwnProperty('hide_pixels'))
                {
                    return options.facebook.hide_pixels;
                }
                return [];
            },
            initEventIdCookies: function (key) {
                var ids = {};
                ids[key] = pys_generate_token(36)
                Cookies.set('pys_fb_event_id', JSON.stringify(ids), {path: '/',domain: domain});
            },

            updateEventId:function(key) {
                var cooData = Cookies.get("pys_fb_event_id")
                if(cooData === undefined) {
                    this.initEventIdCookies(key);
                } else {
                    var data = JSON.parse(cooData);
                    data[key] = pys_generate_token(36);
                    Cookies.set('pys_fb_event_id', JSON.stringify(data), {path: '/',domain: domain} );
                }
            },

            getEventId:function (key) {
                var data = Cookies.get("pys_fb_event_id");
                if(data === undefined) {
                    this.initEventIdCookies(key);
                    data = Cookies.get("pys_fb_event_id");
                }
                return JSON.parse(data)[key];
            },

            disable: function () {
                initialized = false;
            },

            filterParams: function (params) {
                var filteredParams = {};

                if (options.facebook.hasOwnProperty('enabled_medical') && options.facebook.enabled_medical && options.facebook.hasOwnProperty('do_not_track_medical_param')) {
                    // Remove empty strings from the array
                    options.facebook.do_not_track_medical_param = options.facebook.do_not_track_medical_param.filter(Boolean);
                    for (const key in params) {
                        if (Array.isArray(options.facebook.do_not_track_medical_param)) {
                            if (!options.facebook.do_not_track_medical_param.includes(key)) {
                                filteredParams[key] = params[key];
                            }
                        }
                    }
                }
                else {
                    Utils.copyProperties(params, filteredParams);
                }
                return filteredParams;
            },

            /**
             * Load pixel's JS
             */
            loadPixel: function () {
                if (initialized || !this.isEnabled() || !Utils.consentGiven('facebook')) {
                    return;
                }

                ! function (f, b, e, v, n, t, s) {
                    if (f.fbq) return;
                    n = f.fbq = function () {
                        n.callMethod ?
                            n.callMethod.apply(n, arguments) : n.queue.push(arguments)
                    };
                    if (!f._fbq) f._fbq = n;
                    n.push = n;
                    n.loaded = !0;
                    n.version = '2.0';
                    n.agent = 'dvpixelyoursite';
                    n.queue = [];
                    t = b.createElement(e);
                    t.async = !0;
                    t.src = v;
                    s = b.getElementsByTagName(e)[0];
                    s.parentNode.insertBefore(t, s)
                }(window,
                    document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
                let expires = parseInt(options.cookie_duration);
                if(!Cookies.get('_fbp')) {
                    Cookies.set('_fbp',genereateFbp(),  { expires: expires,path: '/',domain: domain });
                }

                if(getUrlParameter('fbclid')) {
                    Cookies.set('_fbc',genereateFbc(),  { expires: expires,path: '/',domain: domain });
                }
                var ids = options.facebook.pixelIds.filter(function (pixelId) {
                    return !Utils.hideMatchingPixel(pixelId, 'facebook');
                });
                // initialize default pixel
                ids.forEach(function (pixelId) {
                    Facebook.maybeInitPixel(pixelId);
                });
                initialized = true;

                Utils.fireStaticEvents('facebook');

            },
            advancedMatching: function () {
                if(options.facebook.advancedMatchingEnabled) {
                    let advancedMatchingForm = Utils.getAdvancedFormData();
                    let advancedMatching = {};
                    if(Object.keys(options.facebook.advancedMatching).length > 0) {
                        advancedMatching = options.facebook.advancedMatching;
                    }

                    if(!advancedMatching.hasOwnProperty("em")
                        && advancedMatchingForm.hasOwnProperty("email") && advancedMatchingForm["email"].length > 0) {
                        advancedMatching["em"] = advancedMatchingForm["email"];
                    }
                    if(!advancedMatching.hasOwnProperty("ph")
                        && advancedMatchingForm.hasOwnProperty("phone") && advancedMatchingForm["phone"].length > 0) {
                        advancedMatching["ph"] = advancedMatchingForm["phone"];
                    }
                    if(!advancedMatching.hasOwnProperty("fn")
                        && advancedMatchingForm.hasOwnProperty("first_name") && advancedMatchingForm["first_name"].length > 0) {
                        advancedMatching["fn"] = advancedMatchingForm["first_name"];
                    }
                    if(!advancedMatching.hasOwnProperty("ln")
                        && advancedMatchingForm.hasOwnProperty("last_name") && advancedMatchingForm["last_name"].length > 0) {
                        advancedMatching["ln"] = advancedMatchingForm["last_name"];
                    }
                    if(!advancedMatching.hasOwnProperty("external_id")){
                        if (Cookies.get('pbid')) {
                            advancedMatching["external_id"] = Cookies.get('pbid');
                        }
                    }
                    else if(advancedMatching.hasOwnProperty("external_id") && advancedMatching.external_id != Cookies.get('pbid'))
                    {
                        advancedMatching["external_id"] = Cookies.get('pbid') ? Cookies.get('pbid') : advancedMatching.external_id;
                    }

                    if(Object.keys(advancedMatching).length > 0) {
                        return advancedMatching;
                    }
                }
                return false
            },
            maybeInitPixel: function(pixelId) {

                if(configuredPixels.includes(pixelId)) return;

                if (options.facebook.removeMetadata || Utils.hideMatchingPixel(pixelId, this.tag())) {
                    fbq('set', 'autoConfig', false, pixelId);
                }
                let advancedMatching = Facebook.advancedMatching();

                if ( +options.facebook.meta_ldu === 1  ) {
                    fbq( 'dataProcessingOptions', [ 'LDU' ], 0, 0 );
                }

                if (options.gdpr.consent_magic_integration_enabled && typeof CS_Data !== "undefined") {
                    if(!advancedMatching) {
                        fbq('init', pixelId);
                    } else {
                        var test_prefix = CS_Data.test_prefix;
                        var cs_advanced_matching = Cookies.get('cs_enabled_advanced_matching'+test_prefix);
                        if (jQuery('#cs_enabled_advanced_matching'+test_prefix).length > 0) {
                            if (cs_advanced_matching == 'yes') {
                                fbq('init', pixelId, advancedMatching);
                            } else {
                                fbq('init', pixelId);
                            }
                        } else {
                            fbq('init', pixelId, advancedMatching);
                        }
                    }
                } else {
                    if(!advancedMatching) {
                        fbq('init', pixelId);
                    }  else {
                        fbq('init', pixelId, advancedMatching);
                    }
                }
                configuredPixels.push(pixelId);
            },

            fireEvent: function (name, data) {

                if (!initialized || !this.isEnabled()) {
                    return false;
                }

                data.delay = data.delay || 0;
                data.params = data.params || {};

                if (data.delay === 0) {

                    fireEvent(name, data);

                } else {

                    setTimeout(function (name, params) {
                        fireEvent(name, params);
                    }, data.delay * 1000, name, data);

                }

                return true;

            },

            onAdSenseEvent: function (event) {
                this.fireEvent(event.name, event);
            },

            onClickEvent: function (event) {
                this.fireEvent(event.name, event);
            },

            onWatchVideo: function (event) {
                this.fireEvent(event.name, event);
            },

            onCommentEvent: function (event) {
                this.fireEvent(event.name, event);
            },

            onFormEvent: function (event) {
                this.fireEvent(event.name, event);
            },

            onDownloadEvent: function (event) {
                this.fireEvent(event.name, event);

            },


            onWooAddToCartOnButtonEvent: function (product_id) {

                window.pysWooProductData = window.pysWooProductData || [];
                if(!options.dynamicEvents.woo_add_to_cart_on_button_click.hasOwnProperty(this.tag()))
                    return;

                if (window.pysWooProductData.hasOwnProperty(product_id)) {
                    if (window.pysWooProductData[product_id].hasOwnProperty('facebook')) {

                        var event = Utils.clone(options.dynamicEvents.woo_add_to_cart_on_button_click[this.tag()])

                        Utils.copyProperties(window.pysWooProductData[product_id]['facebook']['params'], event.params)
                        event.pixelIds = window.pysWooProductData[product_id]['facebook']['pixelIds'];
                        this.fireEvent(event.name, event);
                    }
                }
            },

            onWooAddToCartOnSingleEvent: function (product_id, qty, product_type, is_external, $form) {

                window.pysWooProductData = window.pysWooProductData || [];
                if(!options.dynamicEvents.woo_add_to_cart_on_button_click.hasOwnProperty(this.tag()))
                    return;

                if (product_type === Utils.PRODUCT_VARIABLE && !options.facebook.wooVariableAsSimple) {
                    product_id = parseInt($form.find('input[name="variation_id"]').val());
                }

                if (window.pysWooProductData.hasOwnProperty(product_id)) {
                    if (window.pysWooProductData[product_id].hasOwnProperty('facebook')) {

                        var event = Utils.clone(options.dynamicEvents.woo_add_to_cart_on_button_click.facebook);


                        Utils.copyProperties(window.pysWooProductData[product_id]['facebook']['params'], event.params);

                        var groupValue = 0;
                        if(product_type === Utils.PRODUCT_GROUPED ) {
                            $form.find(".woocommerce-grouped-product-list .qty").each(function(index){
                                var childId = $(this).attr('name').replaceAll("quantity[","").replaceAll("]","");
                                var quantity = parseInt($(this).val());
                                if(isNaN(quantity)) {
                                    quantity = 0;
                                }
                                var childItem = window.pysWooProductData[product_id]['facebook'].grouped[childId];

                                if(quantity == 0) {
                                    event.params.content_ids.forEach(function(el,index,array) {
                                        if(el == childItem.content_id) {
                                            array.splice(index, 1);
                                        }
                                    });
                                }

                                if(event.params.hasOwnProperty('contents')) {
                                    event.params.contents.forEach(function(el,index,array) {
                                        if(el.id == childItem.content_id) {
                                            if(quantity > 0){
                                                el.quantity = quantity;
                                            } else {
                                                array.splice(index, 1);
                                            }
                                        }
                                    });
                                }


                                groupValue += childItem.price * quantity;
                            });
                            if(groupValue == 0) return; // skip if no items selected
                        }



                        // maybe customize value option
                        if (options.woo.addToCartOnButtonValueEnabled && options.woo.addToCartOnButtonValueOption !== 'global') {

                            if(product_type === Utils.PRODUCT_GROUPED) {
                                event.params.value = groupValue;
                            } else if(product_type === Utils.PRODUCT_BUNDLE) {
                                var data = $(".bundle_form .bundle_data").data("bundle_form_data");
                                var items_sum = getBundlePriceOnSingleProduct(data);
                                event.params.value = (parseFloat(data.base_price) + items_sum )* qty;
                            } else {
                                event.params.value = event.params.value * qty;
                            }
                        }

                        // only when non Facebook for WooCommerce logic used
                        if (event.params.hasOwnProperty('contents') && product_type !== Utils.PRODUCT_GROUPED) {
                            event.params.contents[0].quantity = qty;

                        }

                        var event_name = is_external ? options.woo.affiliateEventName : event.name;

                        this.fireEvent(event_name, event);

                    }
                }

            },

            onWooRemoveFromCartEvent: function (event) {
                this.fireEvent(event.name, event);
            },

            onWooAffiliateEvent: function (product_id) {
                if(!options.dynamicEvents.woo_affiliate.hasOwnProperty(this.tag()))
                    return;
                var event = Utils.clone(options.dynamicEvents.woo_affiliate[this.tag()]);


                if (window.pysWooProductData.hasOwnProperty(product_id)) {
                    if (window.pysWooProductData[product_id].hasOwnProperty('facebook')) {

                        Utils.copyProperties(window.pysWooProductData[product_id][this.tag()].params, event.params)
                        this.fireEvent(options.woo.affiliateEventName, event);

                    }
                }

            },

            onWooPayPalEvent: function (event) {
                this.fireEvent(event.name, event);
            },

            onEddAddToCartOnButtonEvent: function (download_id, price_index, qty) {
                if(!options.dynamicEvents.edd_add_to_cart_on_button_click.hasOwnProperty(this.tag()))
                    return;
                var event = Utils.clone(options.dynamicEvents.edd_add_to_cart_on_button_click[this.tag()]);

                if (window.pysEddProductData.hasOwnProperty(download_id)) {

                    var index;

                    if (price_index) {
                        index = download_id + '_' + price_index;
                    } else {
                        index = download_id;
                    }

                    if (window.pysEddProductData[download_id].hasOwnProperty(index)) {
                        if (window.pysEddProductData[download_id][index].hasOwnProperty('facebook')) {

                            Utils.copyProperties(window.pysEddProductData[download_id][index]['facebook']["params"], event.params)

                            // maybe customize value option
                            if (options.edd.addToCartOnButtonValueEnabled && options.edd.addToCartOnButtonValueOption !== 'global') {
                                event.params.value = event.params.value * qty;
                            }

                            // update contents qty param
                            var contents = event.params.contents;
                            contents[0].quantity = qty;
                            event.params.contents = contents;

                            this.fireEvent(event.name,event);

                        }
                    }

                }

            },

            onEddRemoveFromCartEvent: function (event) {
                this.fireEvent(event.name, event);
            },
            onPageScroll: function (event) {
                this.fireEvent(event.name, event);
            },
            onTime: function (event) {
                this.fireEvent(event.name, event);
            },
        };

    }(options);

    var Analytics = function (options) {

        var initialized = false;
        var isAllowEnhancedConversions = false;
        /**
         * Fires event
         *
         * @link: https://developers.google.com/analytics/devguides/collection/gtagjs/sending-data
         * @link: https://developers.google.com/analytics/devguides/collection/gtagjs/events
         * @link: https://developers.google.com/gtagjs/reference/event
         * @link: https://developers.google.com/gtagjs/reference/parameter
         *
         * @link: https://developers.google.com/analytics/devguides/collection/gtagjs/custom-dims-mets
         *
         * @param name
         * @param data
         */
        function fireEvent(name, event) {
            if(typeof window.pys_event_data_filter === "function" && window.pys_disable_event_filter(name,'ga')) {
                return;
            }

            var eventParams = event.params;
            var valuesArray = Object.values(event.trackingIds);
            var ids = valuesArray.filter(function (pixelId) {
                return loadTags.some(loadTag => pixelId.startsWith(loadTag)) && !Utils.hideMatchingPixel(pixelId, 'ga') && !Utils.hideMatchingPixel(pixelId, 'google_ads');
            })

            Utils.copyProperties(Utils.getRequestParams(), eventParams);
            var _fireEvent = function (tracking_ids,name,params) {

                params['send_to'] = tracking_ids;
                if (options.debug) {
                    console.log('[Google Analytics #' + tracking_ids + '] ' + name, params);
                }

                gtag('event', name, params);

                var customEvent = new CustomEvent('gtag_event_sent', {
                    detail: {
                        eventName: name,
                        params: params,
                        pixel_ids: tracking_ids
                    }
                });
                window.dispatchEvent(customEvent);

            };

            var copyParams = Utils.copyProperties(eventParams, {}); // copy params because mapParamsTov4 can modify it

            var params = mapParamsTov4(ids,name,copyParams)

            params.event_id = Utils.generateUniqueId(event);


            delete params.analytics_storage;
            delete params.ad_storage;
            delete params.ad_user_data;
            delete params.ad_personalization;

            _fireEvent(ids, name, params);
            isTrackEventForGA.push(name);



        }

        function normalizeEventName(eventName) {

            var matches = {
                ViewContent: 'view_item',
                AddToCart: 'add_to_cart',
                AddToWishList: 'add_to_wishlist',
                InitiateCheckout: 'begin_checkout',
                Purchase: 'purchase',
                Lead: 'generate_lead',
                CompleteRegistration: 'sign_up',
                AddPaymentInfo: 'set_checkout_option'
            };

            return matches.hasOwnProperty(eventName) ? matches[eventName] : eventName;

        }

        function mapParamsTov4(tag,name,param) {
            //GA4 automatically collects a number of parameters for all events
            var hasGA4Tag = false;

            // end
            if (Array.isArray(tag)) {
                hasGA4Tag = tag.some(function (element) {
                    return isv4(element);
                });
            } else if(isv4(tag)) {
                // tag является строкой и соответствует GA4
                hasGA4Tag = true;
            }
            if(hasGA4Tag) {
                delete param.event_category;
                delete param.event_label;
                delete param.ecomm_prodid;
                delete param.ecomm_pagetype;
                delete param.ecomm_totalvalue;
                if(name === 'search') {
                    param['search'] = param.search_term;
                    delete param.search_term;
                    delete param.dynx_itemid;
                    delete param.dynx_pagetype;
                    delete param.dynx_totalvalue;
                }
            }
            return param;
        }

        function isv4(tag) {
            return tag.indexOf('G') === 0;
        }

        /**
         * Public API
         */
        return {
            tag: function() {
                return "ga";
            },
            isEnabled: function () {
                return options.hasOwnProperty('ga');
            },
            getHidePixel: function(){
                if(this.isEnabled() && options.ga.hasOwnProperty('hide_pixels'))
                {
                    return options.ga.hide_pixels;
                }
                return [];
            },
            disable: function () {
                initialized = false;
            },
            updateEnhancedConversionData : function () {
                if (!initialized || !this.isEnabled()) {
                    return;
                }
                if(options.hasOwnProperty("tracking_analytics") && options.tracking_analytics.hasOwnProperty("userDataEnable") && options.tracking_analytics.userDataEnable) {
                    var advanced = Utils.getAdvancedMergeFormData();
                    if (Object.keys(advanced).length > 0) {
                        gtag('set', 'user_data', advanced);
                    }
                }
            },
            loadPixel: function () {
                if (initialized || !this.isEnabled() || !Utils.consentGiven('analytics')) {
                    return;
                }


                for (var i = 0; i < options.ga.trackingIds.length; i++) {
                    var trackingId = options.ga.trackingIds[i];
                    if (!Utils.hideMatchingPixel(trackingId, 'ga')) {
                        Utils.loadGoogleTag(trackingId);
                        break;
                    }
                }

                var cd = {
                    'dimension1': 'event_hour',
                    'dimension2': 'event_day',
                    'dimension3': 'event_month'
                };

                // configure Dynamic Remarketing CDs
                if (options.ga.retargetingLogic === 'ecomm') {
                    cd.dimension4 = 'ecomm_prodid';
                    cd.dimension5 = 'ecomm_pagetype';
                    cd.dimension6 = 'ecomm_totalvalue';
                } else {
                    cd.dimension4 = 'dynx_itemid';
                    cd.dimension5 = 'dynx_pagetype';
                    cd.dimension6 = 'dynx_totalvalue';
                }

                if(options.hasOwnProperty("tracking_analytics") && options.tracking_analytics.hasOwnProperty("userDataEnable") && options.tracking_analytics.userDataEnable){
                    var advanced = Utils.getAdvancedMergeFormData();
                    if(Object.keys(advanced).length > 0){
                        gtag('set', 'user_data', advanced);
                    }
                }

                var config = {
                    'custom_map': cd
                };

                if(options.user_id && options.user_id != 0) {
                    config.user_id = options.user_id;
                }
                config.url_passthrough = options.ga.url_passthrough;
                // Cross-Domain tracking
                if (options.ga.crossDomainEnabled) {
                    config.linker = {
                        accept_incoming: options.ga.crossDomainAcceptIncoming,
                        domains: options.ga.crossDomainDomains
                    };
                }

                var ids = options.ga.trackingIds.filter(function (pixelId) {
                    return !Utils.hideMatchingPixel(pixelId, 'ga');
                });
                loadTags.push(...ids);
                ids.forEach(function (trackingId,index) {

                    var obj = options.ga.isDebugEnabled;
                    var searchValue = "index_"+index;
                    var config_for_tag = Object.assign({}, config);
                    config_for_tag.debug_mode = false;
                    config_for_tag.send_page_view = !options.ga.custom_page_view_event;
                    for (var key in obj) {
                        if (obj[key] === searchValue) {
                            config_for_tag.debug_mode = true;
                            break;
                        }
                    }
                    if(!config_for_tag.debug_mode)
                    {
                        delete config_for_tag.debug_mode;
                    }

                    if(isv4(trackingId)) {
                        if(options.ga.disableAdvertisingPersonalization) {
                            config_for_tag.allow_ad_personalization_signals = false
                        }
                    }
                    if(options.ga.hasOwnProperty('additionalConfig')){
                        if(options.ga.additionalConfig.hasOwnProperty(trackingId) && options.ga.additionalConfig[trackingId]){
                            config_for_tag.first_party_collection = options.ga.additionalConfig[trackingId].first_party_collection;
                        }

                    }
                    if(options.ga.hasOwnProperty('serverContainerUrls')){
                        if(options.ga.serverContainerUrls.hasOwnProperty(trackingId) && options.ga.serverContainerUrls[trackingId].enable_server_container != false){
                            if(options.ga.serverContainerUrls[trackingId].server_container_url != ''){
                                config_for_tag.server_container_url = options.ga.serverContainerUrls[trackingId].server_container_url;
                            }
                            if(options.ga.serverContainerUrls[trackingId].transport_url != ''){
                                config_for_tag.transport_url = options.ga.serverContainerUrls[trackingId].transport_url;
                            }
                        }
                    }
                    if (options.gdpr.cookiebot_integration_enabled && typeof Cookiebot !== 'undefined') {
                        var cookiebot_consent_category = options.gdpr['cookiebot_analytics_consent_category'];
                        if (options.gdpr['analytics_prior_consent_enabled']) {
                            if (Cookiebot.consented === true && Cookiebot.consent[cookiebot_consent_category]) {
                                gtag('config', trackingId, config_for_tag);
                            }
                        } else {
                            if (Cookiebot.consent[cookiebot_consent_category]) {
                                gtag('config', trackingId, config_for_tag);
                            }
                        }
                    }
                    else
                    {
                        gtag('config', trackingId, config_for_tag);
                    }
                });
                if(!isAdsLoad && GAds.isEnabled() && options.google_ads.conversion_ids.length > 0 && Utils.consentGiven('google_ads')) {
                    for (var i = 0; i < options.google_ads.conversion_ids.length; i++) {
                        var trackingId = options.google_ads.conversion_ids[i];
                        if (!Utils.hideMatchingPixel(trackingId, 'google_ads')) {
                            Utils.loadGoogleTag(trackingId);
                            break;
                        }
                    }
                    var ids = options.google_ads.conversion_ids.filter(function (pixelId) {
                        return !Utils.hideMatchingPixel(pixelId, 'google_ads');
                    });
                    loadTags.push(...ids);
                    // configure conversion ids
                    ids.forEach(function (conversion_id,index) {

                        gtag('config', conversion_id);

                        if(options.google_ads.enhanced_conversion.includes("index_"+index)) {
                            isAllowEnhancedConversions = true
                            gtag('config', conversion_id,{ 'allow_enhanced_conversions':true });
                        }

                    });
                    isAdsLoad = true;
                }


                initialized = true;

                Utils.fireStaticEvents('ga');
                $( document).trigger( "analytics_initialized")
            },

            fireEvent: function (name, data) {

                if (!initialized || !this.isEnabled()) {
                    return false;
                }

                data.delay = data.delay || 0;
                data.params = data.params || {};

                if (data.delay === 0) {

                    fireEvent(name, data);

                } else {

                    setTimeout(function (name, params) {
                        fireEvent(name, params);
                    }, data.delay * 1000, name, data);

                }

                return true;

            },

            onAdSenseEvent: function (event) {
                this.fireEvent(event.name, event);
            },

            onClickEvent: function (event) {
                this.fireEvent(event.name, event);
            },

            onWatchVideo: function (event) {
                if(!event.hasOwnProperty("youtube_disabled")
                    || !event.youtube_disabled
                    || event.params.video_type !== "youtube") {
                    this.fireEvent(event.name, event);
                }
            },

            onCommentEvent: function (event) {

                this.fireEvent(event.name, event);

            },

            onFormEvent: function (event) {

                this.fireEvent(event.name, event);

            },

            onDownloadEvent: function (event) {

                this.fireEvent(event.name, event);

            },

            onWooAddToCartOnButtonEvent: function (product_id, prod_info = null) {
                if(!options.dynamicEvents.woo_add_to_cart_on_button_click.hasOwnProperty(this.tag()))
                    return;

                if (window.pysWooProductData.hasOwnProperty(product_id)) {
                    if (window.pysWooProductData[product_id].hasOwnProperty('ga')) {
                        var event = Utils.clone(options.dynamicEvents.woo_add_to_cart_on_button_click[this.tag()]);
                        Utils.copyProperties(window.pysWooProductData[product_id]['ga'].params, event.params)
                        event.trackingIds = window.pysWooProductData[product_id]['ga']['trackingIds'];
                        if(prod_info)
                        {
                            if(prod_info['pys_list_name_productlist_id'])
                            {
                                event.params.items[0]['item_list_id'] = prod_info['pys_list_name_productlist_id']
                            }
                            if(prod_info['pys_list_name_productlist_name'])
                            {
                                event.params.items[0]['item_list_name'] =prod_info['pys_list_name_productlist_name']
                            }
                        }
                        this.fireEvent(event.name, event);
                    }
                }

            },

            onWooAddToCartOnSingleEvent: function (product_id, qty, product_type, is_external, $form, prod_info) {

                window.pysWooProductData = window.pysWooProductData || [];

                if(!options.dynamicEvents.woo_add_to_cart_on_button_click.hasOwnProperty(this.tag()))
                    return;
                var event = Utils.clone(options.dynamicEvents.woo_add_to_cart_on_button_click[this.tag()]);

                if (product_type === Utils.PRODUCT_VARIABLE && !options.ga.wooVariableAsSimple) {
                    product_id = parseInt($form.find('input[name="variation_id"]').val());
                }

                if (window.pysWooProductData.hasOwnProperty(product_id)) {
                    if (window.pysWooProductData[product_id].hasOwnProperty('ga')) {

                        Utils.copyProperties(window.pysWooProductData[product_id]['ga'].params, event.params);


                        if(product_type === Utils.PRODUCT_GROUPED ) {
                            var groupValue = 0;
                            $form.find(".woocommerce-grouped-product-list .qty").each(function(index){
                                var childId = $(this).attr('name').replaceAll("quantity[","").replaceAll("]","");
                                var quantity = parseInt($(this).val());
                                if(isNaN(quantity)) {
                                    quantity = 0;
                                }
                                var childItem = window.pysWooProductData[product_id]['ga'].grouped[childId];
                                event.params.items.forEach(function(el,index,array) {
                                    if(el.id == childItem.content_id) {
                                        if(quantity > 0){
                                            el.quantity = quantity;
                                            el.price = childItem.price;
                                        } else {
                                            array.splice(index, 1);
                                        }
                                    }
                                });
                                groupValue += childItem.price * quantity;
                            });

                            if(options.woo.addToCartOnButtonValueEnabled &&
                                options.woo.addToCartOnButtonValueOption !== 'global' &&
                                event.params.hasOwnProperty('value')) {
                                event.params.value = groupValue;
                            }

                            if(groupValue == 0) return; // skip if no items selected
                        } else {
                            // update items qty param
                            event.params.items[0].quantity = qty;
                        }

                        // maybe customize value option
                        if (options.woo.addToCartOnButtonValueEnabled &&
                            options.woo.addToCartOnButtonValueOption !== 'global' &&
                            product_type !== Utils.PRODUCT_GROUPED)
                        {
                            if(event.params.hasOwnProperty('value')) {
                                event.params.value = event.params.items[0].price * qty;
                            }
                        }

                        if(prod_info)
                        {
                            if(prod_info['pys_list_name_productlist_id'])
                            {
                                event.params.items[0]['item_list_id'] = prod_info['pys_list_name_productlist_id']
                            }
                            if(prod_info['pys_list_name_productlist_name'])
                            {
                                event.params.items[0]['item_list_name'] =prod_info['pys_list_name_productlist_name']
                            }
                        }

                        var eventName = is_external ? options.woo.affiliateEventName : event.name;
                        eventName = normalizeEventName(eventName);

                        this.fireEvent(eventName, event);

                    }
                }

            },

            onWooCheckoutProgressStep: function (event) {
                this.fireEvent(event.name, event);
            },

            onWooSelectContent: function (event) {
                const select_prod_list = {};

                if (event.params.items[0].item_list_name !== undefined) {
                    select_prod_list.list_name = event.params.items[0].item_list_name;
                }

                if (event.params.items[0].item_list_id !== undefined) {
                    select_prod_list.list_id = event.params.items[0].item_list_id;
                }
                const url = new URL(window.location.href);
                select_prod_list.url = url.origin + url.pathname;
                Cookies.set('select_prod_list', JSON.stringify(select_prod_list), { expires: 1,path: '/' });
                this.fireEvent(event.name, event);
            },

            onWooRemoveFromCartEvent: function (event) {
                this.fireEvent(event.name, event);
            },

            onWooAffiliateEvent: function (product_id) {
                if(!options.dynamicEvents.woo_affiliate.hasOwnProperty(this.tag()))
                    return;
                var event = options.dynamicEvents.woo_affiliate[this.tag()];

                if (window.pysWooProductData.hasOwnProperty(product_id)) {
                    if (window.pysWooProductData[product_id].hasOwnProperty('ga')) {

                        event = Utils.clone(event );
                        Utils.copyProperties(window.pysWooProductData[product_id][this.tag()], event.params)
                        this.fireEvent(normalizeEventName(options.woo.affiliateEventName), event);

                    }
                }

            },

            onWooPayPalEvent: function (event) {
                this.fireEvent(event.name, event);
            },

            onEddAddToCartOnButtonEvent: function (download_id, price_index, qty) {
                if(!options.dynamicEvents.edd_add_to_cart_on_button_click.hasOwnProperty(this.tag()))
                    return;
                var event = Utils.clone(options.dynamicEvents.edd_add_to_cart_on_button_click[this.tag()]);


                if (window.pysEddProductData.hasOwnProperty(download_id)) {

                    var index;

                    if (price_index) {
                        index = download_id + '_' + price_index;
                    } else {
                        index = download_id;
                    }

                    if (window.pysEddProductData[download_id].hasOwnProperty(index)) {
                        if (window.pysEddProductData[download_id][index].hasOwnProperty('ga')) {

                            Utils.copyProperties(window.pysEddProductData[download_id][index]['ga'].params, event.params);

                            // update items qty param
                            event.params.items[0].quantity = qty;

                            this.fireEvent(event.name,event);

                        }
                    }

                }

            },

            onEddRemoveFromCartEvent: function (event) {
                this.fireEvent(event.name, event);
            },

            onPageScroll: function (event) {
                if (initialized && this.isEnabled()) {
                    this.fireEvent(event.name, event);
                }
            },
            onTime: function (event) {
                if (initialized && this.isEnabled()) {
                    this.fireEvent(event.name, event);
                }
            },
        };

    }(options);

    var GAds = function (options) {

        var initialized = false;
        var isAllowEnhancedConversions = false
        /**
         * Fires event
         *
         * @link: https://developers.google.com/analytics/devguides/collection/gtagjs/sending-data
         * @link: https://developers.google.com/analytics/devguides/collection/gtagjs/events
         * @link: https://developers.google.com/gtagjs/reference/event
         * @link: https://developers.google.com/gtagjs/reference/parameter
         */
        function fireEvent(name, data) {
            if(typeof window.pys_event_data_filter === "function" && window.pys_disable_event_filter(event_name,'google_ads')) {
                return;
            }
            var _params = Utils.copyProperties(data.params,{});

            _params.event_id = Utils.generateUniqueId(data);

            var ids = data.ids.filter(function (pixelId) {
                return !Utils.hideMatchingPixel(pixelId, 'google_ads');
            });

            var conversionIds = data.hasOwnProperty('conversion_ids') ? data.conversion_ids.filter(function (conversion_id) {
                return !Utils.hideMatchingPixel(conversion_id, 'google_ads');
            }) : [];
            var conversion_labels = data.hasOwnProperty('conversion_labels') ? data.conversion_labels.filter(function (conversion_label) {
                conversion_id = conversion_label.split('/')[0];
                return !Utils.hideMatchingPixel(conversion_id, 'google_ads');
            }) : [];

            Utils.copyProperties(Utils.getRequestParams(), _params);
            var _fireEvent = function (conversion_id,event_name) {

                params = Utils.copyProperties(_params, { send_to: conversion_id });

                if("conversion" === event_name) {
                    delete params.items;
                    delete params.ecomm_pagetype;
                    delete params.ecomm_prodid;
                    delete params.ecomm_totalvalue;
                }

                if (options.debug) {
                    console.log('[Google Ads #' + conversion_id + '] ' + event_name, params);
                }
                gtag('event', event_name, params);
                var customEvent = new CustomEvent('gtag_event_sent', {
                    detail: {
                        eventName: event_name,
                        params: params,
                        pixel_ids: conversion_id
                    }
                });
                window.dispatchEvent(customEvent);

            };


            if ( conversion_labels.length > 0 ) {
                ids = conversion_labels;
                if ( !isTrackEventForGA.includes( name ) ) {
                    _fireEvent( ids, name );
                }
            } else {
                var conversion_event_name = data.e_id;
                switch ( conversion_event_name ) {
                    case "woo_add_to_cart_on_cart_page":
                    case "woo_add_to_cart_on_checkout_page":
                    case "woo_add_to_cart_on_button_click":
                        conversion_event_name = 'woo_add_to_cart';
                        break;
                    case "edd_add_to_cart_on_cart_page":
                    case "edd_add_to_cart_on_checkout_page":
                    case "edd_add_to_cart_on_button_click":
                        conversion_event_name = 'edd_add_to_cart';
                        break;
                    case "automatic_event_adsense":
                    case "automatic_event_comment":
                    case "automatic_event_download":
                    case "automatic_event_email_link":
                    case "automatic_event_form":
                    case "automatic_event_internal_link":
                    case "automatic_event_outbound_link":
                    case "automatic_event_scroll":
                    case "automatic_event_tel_link":
                    case "automatic_event_time_on_page":
                    case "automatic_event_video":
                        conversion_event_name = 'automatic_event';
                        break;
                }

                if ( ids.length ) {
                    if ( conversion_event_name !== 'automatic_event' && options.google_ads[ conversion_event_name + '_conversion_track' ] ) {
                        const conversionTrack = options.google_ads[ conversion_event_name + '_conversion_track' ];

                        if ( conversionTrack === 'conversion' ) {
                            _fireEvent( ids, "conversion" );
                        }
                    }

                } else {
                    ids = conversionIds;
                }

                if ( !isTrackEventForGA.includes( name ) ) {
                    _fireEvent( ids, name );
                }
            }
        }

        function normalizeEventName(eventName) {

            var matches = {
                ViewContent: 'view_item',
                AddToCart: 'add_to_cart',
                AddToWishList: 'add_to_wishlist',
                InitiateCheckout: 'begin_checkout',
                Purchase: 'purchase',
                Lead: 'generate_lead',
                CompleteRegistration: 'sign_up',
                AddPaymentInfo: 'set_checkout_option'
            };

            return matches.hasOwnProperty(eventName) ? matches[eventName] : eventName;

        }

        /**
         * Public API
         */
        return {
            tag: function() {
                return "google_ads";
            },
            isEnabled: function () {
                return options.hasOwnProperty('google_ads');
            },
            getHidePixel: function(){
                if(this.isEnabled() && options.google_ads.hasOwnProperty('hide_pixels'))
                {
                    return options.google_ads.hide_pixels;
                }
                return [];
            },
            disable: function () {
                initialized = false;
            },

            updateEnhancedConversionData : function () {

                if(options.hasOwnProperty("tracking_analytics") && options.tracking_analytics.hasOwnProperty("userDataEnable") && options.tracking_analytics.userDataEnable){
                    var advanced = Utils.getAdvancedMergeFormData()
                    gtag('set', 'user_data', advanced);
                }
            },

            loadPixel: function () {

                if (initialized || !this.isEnabled() || !Utils.consentGiven('google_ads')) {
                    return;
                }
                var ids = options.google_ads.conversion_ids.filter(function (pixelId) {
                    return !Utils.hideMatchingPixel(pixelId, 'google_ads');
                });
                loadTags.push(...ids);
                if(!isAdsLoad && options.google_ads.conversion_ids.length > 0){
                    for (var i = 0; i < options.google_ads.conversion_ids.length; i++) {
                        var trackingId = options.google_ads.conversion_ids[i];
                        if (!Utils.hideMatchingPixel(trackingId, 'google_ads')) {
                            Utils.loadGoogleTag(trackingId);
                            break;
                        }
                    }

                    // configure conversion ids
                    ids.forEach(function (conversion_id,index) {

                        let config = {};

                        if(options.google_ads.enhanced_conversion.includes("index_"+index)) {
                            isAllowEnhancedConversions = true;
                            config.allow_enhanced_conversions = true
                        }

                        // Cross-Domain tracking
                        if (options.google_ads.crossDomainEnabled) {
                            config.linker = {
                                accept_incoming: options.google_ads.crossDomainAcceptIncoming,
                                domains: options.google_ads.crossDomainDomains
                            };
                        }

                        gtag('config', conversion_id, config );

                        if(options.hasOwnProperty("tracking_analytics") && options.tracking_analytics.hasOwnProperty("userDataEnable") && options.tracking_analytics.userDataEnableuserDataEnable){
                            var advanced = Utils.getAdvancedMergeFormData()
                            gtag('set', 'user_data', advanced);
                        }

                    });
                    isAdsLoad = true;
                }

                initialized = true;

                Utils.fireStaticEvents('google_ads');

            },

            fireEvent: function (name, data) {

                if (!initialized || !this.isEnabled()) {
                    return false;
                }

                data.delay = data.delay || 0;
                data.params = data.params || {};
                data.ids = data.ids || [];
                data.conversion_labels = data.conversion_labels || [];

                if (data.delay === 0) {
                    fireEvent(name, data);
                } else {
                    setTimeout(function (name, data) {
                        fireEvent(name, data);
                    }, data.delay * 1000, name, data);
                }

                return true;

            },

            onAdSenseEvent: function (event) {
                this.fireEvent(event.name, event);
            },

            onClickEvent: function (action, params) {
                //disabled
            },

            onWatchVideo: function (event) {
                this.fireEvent(event.name, event);
            },

            onCommentEvent: function (event) {
                this.fireEvent(event.name, event);
            },

            onFormEvent: function (event) {
                this.fireEvent(event.name, event);
            },

            onDownloadEvent: function (event) {
                this.fireEvent(event.name, event);
            },




            onWooAddToCartOnButtonEvent: function (product_id) {

                if(!options.dynamicEvents.woo_add_to_cart_on_button_click.hasOwnProperty(this.tag()))
                    return;

                if (window.pysWooProductData.hasOwnProperty(product_id)) {
                    if (window.pysWooProductData[product_id].hasOwnProperty('google_ads')) {

                        var event = Utils.clone(options.dynamicEvents.woo_add_to_cart_on_button_click[this.tag()])
                        Utils.copyProperties(window.pysWooProductData[product_id]['google_ads']['params'].params, event.params)
                        event["ids"] = window.pysWooProductData[product_id]['google_ads']['ids']
                        event["conversion_labels"] = window.pysWooProductData[product_id]['google_ads']['conversion_labels']
                        this.fireEvent(event.name, event);
                    }
                }

            },

            onWooAddToCartOnSingleEvent: function (product_id, qty, product_type, is_external, $form) {

                window.pysWooProductData = window.pysWooProductData || [];
                if(!options.dynamicEvents.woo_add_to_cart_on_button_click.hasOwnProperty(this.tag()))
                    return;
                var event = Utils.clone(options.dynamicEvents.woo_add_to_cart_on_button_click[this.tag()]);

                if (product_type === Utils.PRODUCT_VARIABLE && !options.google_ads.wooVariableAsSimple) {
                    product_id = parseInt($form.find('input[name="variation_id"]').val());
                }

                if (window.pysWooProductData.hasOwnProperty(product_id)) {
                    if (window.pysWooProductData[product_id].hasOwnProperty('google_ads')) {

                        Utils.copyProperties(window.pysWooProductData[product_id]['google_ads']["params"], event.params);
                        event["ids"] = window.pysWooProductData[product_id]['google_ads']['ids']
                        event["conversion_labels"] = window.pysWooProductData[product_id]['google_ads']['conversion_labels']

                        var groupValue = 0;
                        if(product_type === Utils.PRODUCT_GROUPED ) {
                            $form.find(".woocommerce-grouped-product-list .qty").each(function(index){
                                var childId = $(this).attr('name').replaceAll("quantity[","").replaceAll("]","");
                                var quantity = parseInt($(this).val());
                                if(isNaN(quantity)) {
                                    quantity = 0;
                                }

                                var childItem = window.pysWooProductData[product_id]['google_ads'].grouped[childId];

                                if(options.woo.addToCartOnButtonValueEnabled &&
                                    options.woo.addToCartOnButtonValueOption !== 'global') {

                                    event.params.items.forEach(function(el,index,array) {
                                        if(el.id == childItem.content_id) {
                                            if(quantity > 0){
                                                el.quantity = quantity;
                                                el.price = childItem.price;
                                            } else {
                                                array.splice(index, 1);
                                            }
                                        }
                                    });
                                }
                                groupValue += childItem.price * quantity;
                            });
                            if(groupValue == 0) return;
                            event.params.value = groupValue;
                        } else {
                            // update items qty param
                            event.params.items[0].quantity = qty;
                        }



                        // maybe customize value option
                        if (options.woo.addToCartOnButtonValueEnabled &&
                            options.woo.addToCartOnButtonValueOption !== 'global' &&
                            product_type !== Utils.PRODUCT_GROUPED) {
                            event.params.value =  event.params.value * qty;
                        }



                        var eventName = is_external ? options.woo.affiliateEventName : event.name;
                        eventName = normalizeEventName(eventName);

                        this.fireEvent(eventName, event);

                    }
                }

            },

            onWooRemoveFromCartEvent: function (event) {
                this.fireEvent(event.name, event);
            },

            onWooAffiliateEvent: function (product_id) {
                if(!options.dynamicEvents.woo_affiliate.hasOwnProperty(this.tag()))
                    return;
                var event = options.dynamicEvents.woo_affiliate[this.tag()];

                if (window.pysWooProductData.hasOwnProperty(product_id)) {
                    if (window.pysWooProductData[product_id].hasOwnProperty('google_ads')) {

                        event = Utils.clone(event)
                        Utils.copyProperties(window.pysWooProductData[product_id][this.tag()], event.params)
                        this.fireEvent(normalizeEventName(options.woo.affiliateEventName), event);

                    }
                }

            },

            onWooPayPalEvent: function (event) {
                this.fireEvent(event.name, event);
            },

            onEddAddToCartOnButtonEvent: function (download_id, price_index, qty) {
                if(!options.dynamicEvents.edd_add_to_cart_on_button_click.hasOwnProperty(this.tag()))
                    return;
                var event = options.dynamicEvents.edd_add_to_cart_on_button_click[this.tag()];


                if (window.pysEddProductData.hasOwnProperty(download_id)) {

                    var index;

                    if (price_index) {
                        index = download_id + '_' + price_index;
                    } else {
                        index = download_id;
                    }

                    if (window.pysEddProductData[download_id].hasOwnProperty(index)) {
                        if (window.pysEddProductData[download_id][index].hasOwnProperty('google_ads')) {

                            event = Utils.clone(event)
                            Utils.copyProperties(window.pysEddProductData[download_id][index]['google_ads']['params'], event.params);
                            event.ids = window.pysEddProductData[download_id][index]['google_ads']['ids']
                            // update items qty param
                            //params.items[0].quantity = qty;

                            this.fireEvent(event.name, event);

                        }
                    }

                }

            },

            onEddRemoveFromCartEvent: function (event) {
                this.fireEvent(event.name, event);
            },
            onPageScroll: function (event) {
                if (initialized && this.isEnabled()) {
                    this.fireEvent(event.name, event);
                }
            },
            onTime: function (event) {
                if (initialized && this.isEnabled()) {
                    this.fireEvent(event.name, event);
                }
            },

        };

    }(options);

    var GTM = function (options) {

        var initialized = false;

        var datalayer_name = 'dataLayer';
        /*
         * @param name
         * @param data
         */
        function fireEvent(name, event) {
            if(typeof window.pys_event_data_filter === "function" && window.pys_disable_event_filter(name,'gtm')) {
                return;
            }


            var eventParams = event.params;
            var data = event.params;
            var valuesArray = Object.values(event.trackingIds);
            var ids = valuesArray.filter(function (pixelId) {
                return !Utils.hideMatchingPixel(pixelId, 'gtm');
            })
            Utils.copyProperties(Utils.getRequestParams(), eventParams);
            var _fireEvent = function (tracking_id,name,params, event=null) {

                var eventData = {};
                var ContainerCodeHasTag = !options.gtm.gtm_just_data_layer && tracking_id.length > 0;
                if(ContainerCodeHasTag) {
                    params['send_to'] = tracking_id;
                }
                else if(!options.gtm.gtm_just_data_layer){
                    return
                }

                if (params.hasOwnProperty('ecommerce')) {
                    eventData.ecommerce = params.ecommerce;
                    delete params.ecommerce;
                }

                var automatedParams = { ...params };
                [params['manualName'], 'manualName', 'triggerType'].forEach(key => delete automatedParams[key]);
                if(event && (!event.hasOwnProperty('hasAutoParam') || (event.hasOwnProperty('hasAutoParam') && event.hasAutoParam))) {
                    eventData.automatedParameters = automatedParams;
                }

// Move custom parameters to eventData

                if (params.hasOwnProperty(params['manualName'])) {
                    eventData[params['manualName']] = params[params['manualName']];
                    delete params[params['manualName']];
                }

                ['manualName','triggerType'].forEach(key => {
                    if (params.hasOwnProperty(key)) {
                        eventData[key] = params[key];
                        delete params[key];
                    }
                });

                eventData.manualDataLayer = options.gtm.gtm_dataLayer_name ?? 'dataLayer';

                eventData.event = name;

                if (options.debug) {
                    if (ContainerCodeHasTag){
                        console.log('[Google GTM #' + tracking_id + '] ' + name, eventData);
                    }
                    else {
                        console.log('[Google GTM push to "'+datalayer_name+'"] ' + name, eventData);
                    }
                }
                window[datalayer_name].push(eventData);

                var customEvent = new CustomEvent('gtm_event_sent', {
                    detail: {
                        eventName: name,
                        params: eventData,
                        pixel_ids: tracking_id
                    }
                });
                window.dispatchEvent(customEvent);

            };

            var copyParams = Utils.copyProperties(eventParams, {}); // copy params because mapParamsToGTM can modify it

            var params = mapParamsToGTM(ids,name,copyParams)

            params.event_id = Utils.generateUniqueId(event);

            _fireEvent(ids, name, params, event);
        }

        function normalizeEventName(eventName) {

            var matches = {
                ViewContent: 'view_item',
                AddToCart: 'add_to_cart',
                AddToWishList: 'add_to_wishlist',
                InitiateCheckout: 'begin_checkout',
                Purchase: 'purchase',
                Lead: 'generate_lead',
                CompleteRegistration: 'sign_up',
                AddPaymentInfo: 'set_checkout_option'
            };

            return matches.hasOwnProperty(eventName) ? matches[eventName] : eventName;

        }

        function mapParamsToGTM(tag,name,param) {
            var hasGTM = false;

            // end
            if (Array.isArray(tag)) {
                hasGTM = tag.some(function (element) {
                    return isGTM(element);
                });
            } else if(isGTM(tag)) {
                hasGTM = true;
            }
            if(hasGTM) {
                delete param.event_category;
                delete param.event_label;

                delete param.analytics_storage;
                delete param.ad_storage;
                delete param.ad_user_data;
                delete param.ad_personalization;

                if(name === 'search') {
                    param['search'] = param.search_term;
                    delete param.search_term;
                    delete param.dynx_itemid;
                    delete param.dynx_pagetype;
                    delete param.dynx_totalvalue;
                }
            }
            return param;
        }

        function isGTM(tag) {
            return tag.indexOf('GTM') === 0;
        }
        /**
         * Public API
         */
        return {
            tag: function() {
                return "gtm";
            },
            isEnabled: function () {
                return options.hasOwnProperty('gtm');
            },
            getHidePixel: function(){
                if(this.isEnabled() && options.gtm.hasOwnProperty('hide_pixels'))
                {
                    return options.gtm.hide_pixels;
                }
                return [];
            },
            disable: function () {
                initialized = false;
            },
            updateEnhancedConversionData : function () {
                if (!initialized || !this.isEnabled()) {
                    return;
                }
                if(options.hasOwnProperty("tracking_analytics") && options.tracking_analytics.hasOwnProperty("userDataEnable") && options.tracking_analytics.userDataEnable) {
                    var advanced = Utils.getAdvancedMergeFormData(true);
                    if (Object.keys(advanced).length > 0) {
                        window[datalayer_name].push({'user_data' : advanced});
                    }
                }
            },
            loadPixel: function () {

                if (initialized || !this.isEnabled() || !Utils.consentGiven('analytics')) {
                    return;
                }
                datalayer_name = options.gtm.gtm_dataLayer_name ?? 'dataLayer';

                for (var i = 0; i < options.gtm.trackingIds.length; i++) {
                    var trackingId = options.gtm.trackingIds[i];
                    if (!Utils.hideMatchingPixel(trackingId, 'gtm') && !options.gtm.gtm_just_data_layer) {
                        console.log('[PYS] Google Tag Manager container code loaded');
                        Utils.loadGTMScript(trackingId);
                        break;
                    }
                }

                if(options.gtm.gtm_just_data_layer) {
                    console.warn && console.warn("[PYS] Google Tag Manager container code placement set to OFF !!!");
                    console.warn && console.warn("[PYS] Data layer codes are active but GTM container must be loaded using custom coding !!!");
                    if(options.gtm.trackingIds.length == 0){
                        Utils.loadGTMScript();
                    }
                }

                if(options.hasOwnProperty("tracking_analytics") && options.tracking_analytics.hasOwnProperty("userDataEnable") && options.tracking_analytics.userDataEnable){
                    var advanced = Utils.getAdvancedMergeFormData(true);
                    if(Object.keys(advanced).length > 0){
                        window[datalayer_name].push({'user_data' : advanced});
                    }
                }


                var config = {};

                if(options.user_id && options.user_id != 0) {
                    config.user_id = options.user_id;
                }

                // Cross-Domain tracking

                var ids = options.gtm.trackingIds.filter(function (pixelId) {
                    return !Utils.hideMatchingPixel(pixelId, 'gtm');
                });


                initialized = true;

                Utils.fireStaticEvents('gtm');
            },

            fireEvent: function (name, data) {

                if (!initialized || !this.isEnabled()) {
                    return false;
                }

                data.delay = data.delay || 0;
                data.params = data.params || {};

                if (data.delay === 0) {

                    fireEvent(name, data);

                } else {

                    setTimeout(function (name, params) {
                        fireEvent(name, params);
                    }, data.delay * 1000, name, data);

                }

                return true;

            },

            onAdSenseEvent: function (event) {
                this.fireEvent(event.name, event);
            },

            onClickEvent: function (event) {
                this.fireEvent(event.name, event);
            },

            onWatchVideo: function (event) {
                if(!event.hasOwnProperty("youtube_disabled")
                    || !event.youtube_disabled
                    || event.params.video_type !== "youtube") {
                    this.fireEvent(event.name, event);
                }
            },

            onCommentEvent: function (event) {

                this.fireEvent(event.name, event);

            },

            onFormEvent: function (event) {

                this.fireEvent(event.name, event);

            },

            onDownloadEvent: function (event) {

                this.fireEvent(event.name, event);

            },

            onWooAddToCartOnButtonEvent: function (product_id, prod_info = null) {
                if(!options.dynamicEvents.woo_add_to_cart_on_button_click.hasOwnProperty(this.tag()))
                    return;
                if (window.pysWooProductData.hasOwnProperty(product_id)) {
                    if (window.pysWooProductData[product_id].hasOwnProperty('gtm')) {
                        var event = Utils.clone(options.dynamicEvents.woo_add_to_cart_on_button_click[this.tag()]);
                        Utils.copyProperties(window.pysWooProductData[product_id]['gtm'].params, event.params)
                        event.trackingIds = window.pysWooProductData[product_id]['gtm']['trackingIds'];


                        if(prod_info)
                        {
                            item = event.params.hasOwnProperty('ecommerce') ? event.params.ecommerce.items[0] : event.params.items[0];

                            if(prod_info['pys_list_name_productlist_id'])
                            {
                                item['item_list_id'] = prod_info['pys_list_name_productlist_id']
                            }
                            if(prod_info['pys_list_name_productlist_name'])
                            {
                                item['item_list_name'] =prod_info['pys_list_name_productlist_name']
                            }
                        }
                        this.fireEvent(event.name, event);
                    }
                }

            },

            onWooAddToCartOnSingleEvent: function (product_id, qty, product_type, is_external, $form, prod_info) {
                window.pysWooProductData = window.pysWooProductData || [];

                if(!options.dynamicEvents.woo_add_to_cart_on_button_click.hasOwnProperty(this.tag()))
                    return;
                var event = Utils.clone(options.dynamicEvents.woo_add_to_cart_on_button_click[this.tag()]);

                if (product_type === Utils.PRODUCT_VARIABLE && !options.gtm.wooVariableAsSimple) {
                    product_id = parseInt($form.find('input[name="variation_id"]').val());
                }

                if (window.pysWooProductData.hasOwnProperty(product_id)) {
                    if (window.pysWooProductData[product_id].hasOwnProperty('gtm')) {

                        Utils.copyProperties(window.pysWooProductData[product_id]['gtm'].params, event.params);

                        params = event.params.hasOwnProperty('ecommerce') ? event.params.ecommerce : event.params;

                        if(product_type === Utils.PRODUCT_GROUPED ) {
                            var groupValue = 0;
                            $form.find(".woocommerce-grouped-product-list .qty").each(function(index){
                                var childId = $(this).attr('name').replaceAll("quantity[","").replaceAll("]","");
                                var quantity = parseInt($(this).val());
                                if(isNaN(quantity)) {
                                    quantity = 0;
                                }
                                var childItem = window.pysWooProductData[product_id]['gtm'].grouped[childId];

                                params.items.forEach(function(el,index,array) {
                                    if(el.id == childItem.content_id) {
                                        if(quantity > 0){
                                            el.quantity = quantity;
                                            el.price = childItem.price;
                                        } else {
                                            array.splice(index, 1);
                                        }
                                    }
                                });
                                groupValue += childItem.price * quantity;
                            });



                            if(options.woo.addToCartOnButtonValueEnabled &&
                                options.woo.addToCartOnButtonValueOption !== 'global' &&
                                params.hasOwnProperty('value')) {
                                params.value = groupValue;
                            }

                            if(groupValue == 0) return; // skip if no items selected
                        } else {
                            // update items qty param
                            params.items[0].quantity = qty;
                        }

                        // maybe customize value option
                        if (options.woo.addToCartOnButtonValueEnabled &&
                            options.woo.addToCartOnButtonValueOption !== 'global' &&
                            product_type !== Utils.PRODUCT_GROUPED)
                        {
                            if(params.hasOwnProperty('value')) {
                                params.value = params.items[0].price * qty;
                            }
                        }

                        if(prod_info)
                        {
                            if(prod_info['pys_list_name_productlist_id'])
                            {
                                params.items[0]['item_list_id'] = prod_info['pys_list_name_productlist_id']
                            }
                            if(prod_info['pys_list_name_productlist_name'])
                            {
                                params.items[0]['item_list_name'] =prod_info['pys_list_name_productlist_name']
                            }
                        }

                        var eventName = is_external ? options.woo.affiliateEventName : event.name;
                        eventName = normalizeEventName(eventName);

                        this.fireEvent(eventName, event);

                    }
                }

            },

            onWooCheckoutProgressStep: function (event) {
                this.fireEvent(event.name, event);
            },

            onWooSelectContent: function (event) {
                const select_prod_list = {};

                if (event.params.items[0].item_list_name !== undefined) {
                    select_prod_list.list_name = event.params.items[0].item_list_name;
                }

                if (event.params.items[0].item_list_id !== undefined) {
                    select_prod_list.list_id = event.params.items[0].item_list_id;
                }
                const url = new URL(window.location.href);
                select_prod_list.url = url.origin + url.pathname;
                Cookies.set('select_prod_list', JSON.stringify(select_prod_list), { expires: 1,path: '/' });
                this.fireEvent(event.name, event);
            },

            onWooRemoveFromCartEvent: function (event) {
                this.fireEvent(event.name, event);
            },

            onWooAffiliateEvent: function (product_id) {
                if(!options.dynamicEvents.woo_affiliate.hasOwnProperty(this.tag()))
                    return;
                var event = options.dynamicEvents.woo_affiliate[this.tag()];

                if (window.pysWooProductData.hasOwnProperty(product_id)) {
                    if (window.pysWooProductData[product_id].hasOwnProperty('gtm')) {

                        event = Utils.clone(event );
                        Utils.copyProperties(window.pysWooProductData[product_id][this.tag()], event.params)
                        this.fireEvent(normalizeEventName(options.woo.affiliateEventName), event);

                    }
                }

            },

            onWooPayPalEvent: function (event) {
                this.fireEvent(event.name, event);
            },

            onEddAddToCartOnButtonEvent: function (download_id, price_index, qty) {
                if(!options.dynamicEvents.edd_add_to_cart_on_button_click.hasOwnProperty(this.tag()))
                    return;
                var event = Utils.clone(options.dynamicEvents.edd_add_to_cart_on_button_click[this.tag()]);


                if (window.pysEddProductData.hasOwnProperty(download_id)) {

                    var index;

                    if (price_index) {
                        index = download_id + '_' + price_index;
                    } else {
                        index = download_id;
                    }

                    if (window.pysEddProductData[download_id].hasOwnProperty(index)) {
                        if (window.pysEddProductData[download_id][index].hasOwnProperty('gtm')) {

                            Utils.copyProperties(window.pysEddProductData[download_id][index]['gtm'].params, event.params);
                            item = event.params.hasOwnProperty('ecommerce') ? event.params.ecommerce.items[0] : event.params.items[0];
                            // update items qty param
                            item.quantity = qty;

                            this.fireEvent(event.name,event);

                        }
                    }

                }

            },

            onEddRemoveFromCartEvent: function (event) {
                this.fireEvent(event.name, event);
            },

            onPageScroll: function (event) {
                if (initialized && this.isEnabled()) {
                    this.fireEvent(event.name, event);
                }
            },
            onTime: function (event) {
                if (initialized && this.isEnabled()) {
                    this.fireEvent(event.name, event);
                }
            },
        };

    }(options);

    window.pys = window.pys || {};
    window.pys.Facebook = Facebook;
    window.pys.Analytics = Analytics;
    window.pys.GAds = GAds;
    window.pys.GTM = GTM;
    window.pys.Utils = Utils;
    window.pys.TikTok = TikTok;



    $(document).ready(function () {

        if(Cookies.get('form_track'))
        {
            Cookies.remove('form_track')
        }

        if($("#pys_late_event").length > 0) {
            var dirAttr = $("#pys_late_event").attr("dir");
            if (dirAttr) {
                try {
                    var events = JSON.parse(dirAttr);
                } catch (e) {
                    console.warn("Invalid JSON in pys_late_event dir attribute:", e);
                }
            } else {
                console.warn("pys_late_event dir attribute is undefined or empty");
            }
            if (events) {
                for (var platform in events) {
                    if (events.hasOwnProperty(platform)) {
                        var platformEvents = events[platform];
                        platformEvents.forEach(function (event) {
                            var eventData = {};
                            eventData[event.e_id] = [event];
                            if (options.staticEvents.hasOwnProperty(platform)) {
                                Object.assign(options.staticEvents[platform], eventData);
                            } else {
                                options.staticEvents[platform] = eventData;
                            }
                        });
                    }
                }
            }
        }

        var Pinterest = Utils.setupPinterestObject();
        var Bing = Utils.setupBingObject();
        if(options.hasOwnProperty('cookie'))
        {
            if(options.cookie.externalID_disabled_by_api || options.cookie.disabled_all_cookie)
            {
                Cookies.remove('pbid')
            }
            if(options.cookie.disabled_advanced_form_data_cookie || options.cookie.disabled_all_cookie)
            {
                Cookies.remove('pys_advanced_form_data')
            }

            if(options.cookie.disabled_landing_page_cookie || !options.enable_lading_page_param || options.cookie.disabled_all_cookie)
            {
                Cookies.remove('pys_landing_page', { path: '/',domain: domain })
                Cookies.remove('last_pys_landing_page', { path: '/',domain: domain })
            }
            if(options.cookie.disabled_trafficsource_cookie || options.cookie.disabled_all_cookie)
            {
                Cookies.remove('pysTrafficSource', { path: '/',domain: domain })
                Cookies.remove('last_pysTrafficSource', { path: '/',domain: domain })
            }
            if(options.cookie.disabled_first_visit_cookie || options.cookie.disabled_all_cookie)
            {
                Cookies.remove('pys_first_visit', { path: '/',domain: domain })

            }
            if(options.cookie.disabled_utmTerms_cookie || options.cookie.disabled_all_cookie)
            {
                $.each(Utils.utmTerms, function (index, name) {
                    Cookies.remove('pys_' + name, { path: '/',domain: domain })
                });
                $.each(Utils.utmTerms, function (index, name) {
                    Cookies.remove('last_pys_' + name, { path: '/',domain: domain })
                });
            }
            if(options.cookie.disabled_utmId_cookie || options.cookie.disabled_all_cookie)
            {
                $.each(Utils.utmId,function(index,name) {
                    Cookies.remove('pys_' + name, { path: '/',domain: domain })
                })
                $.each(Utils.utmId,function(index,name) {
                    Cookies.remove('last_pys_' + name, { path: '/',domain: domain })
                });
            }
        }

        if (options.gdpr.cookie_law_info_integration_enabled) {
            var cli_cookie = Cookies.get('cookieyes-consent') ?? Cookies.get('wt_consent') ?? Cookies.get('viewed_cookie_policy');

            if (typeof cli_cookie !== 'undefined') {
                if (cli_cookie === Cookies.get('cookieyes-consent') || cli_cookie === Cookies.get('wt_consent')) {
                    if (getCookieYes('analytics') === 'yes') {
                        Utils.manageCookies();
                    }
                } else if (cli_cookie === Cookies.get('viewed_cookie_policy') && cli_cookie == 'yes') {
                    Utils.manageCookies();
                }
            }
        }

        if ( options.gdpr.consent_magic_integration_enabled && typeof CS_Data !== "undefined" ) {
            if ( CS_Data.cs_script_cat.pys == CS_Data.cs_necessary_cat_id || CS_Data.cs_script_cat.pys == 0 ) {
                Utils.manageCookies();
            } else if ( Cookies.get( 'cs_enabled_cookie_term' + CS_Data.test_prefix + '_' + CS_Data.cs_script_cat.pys ) == 'yes' ) {
                Utils.manageCookies();
            }
        } else {
            Utils.manageCookies();
        }

        Utils.initializeRequestParams();
        Utils.setupGdprCallbacks();

        if ( options.enable_auto_save_advance_matching ) {
            let override = options.data_persistency == 'recent_data';

            //Setup Advanced Form Data
            if ( options.advance_matching_form.enable_advance_matching_forms ) {
                $( document ).on( "blur", "input[type='email']", function () {
                    let email = $( this ).val().trim().toLowerCase();
                    if ( Utils.validateEmail( email ) ) {
                        Utils.saveAdvancedFormData( email, null, null, null, override );
                    }
                } )
                $( document ).on( "blur", "input[type='tel']", function () {
                    let phone = $( this ).val().trim().replace( /\D/g, "" );
                    if ( phone.length > 5 ) {
                        Utils.saveAdvancedFormData( null, phone, null, null, override );
                    }
                } )
                $( document ).on( "blur", "input[type='text']", function () {
                    let name;
                    if ( $( this ).attr( "name" ) && $( this ).attr( "name" ) != '' ) {
                        name = $( this ).attr( "name" ).trim()
                    }
                    if ( name && options.advance_matching_form.advance_matching_fn_names.includes( name ) ) {
                        let value = $( this ).val().trim();
                        if ( value.length > 0 ) {
                            Utils.saveAdvancedFormData( null, null, value, null, override );
                        }
                    }
                    if ( name && options.advance_matching_form.advance_matching_ln_names.includes( name ) ) {
                        let value = $( this ).val().trim();
                        if ( value.length > 0 ) {
                            Utils.saveAdvancedFormData( null, null, null, value, override );
                        }
                    }
                    if ( name && options.advance_matching_form.advance_matching_tel_names.includes( name ) ) {
                        let value = $( this ).val().trim();
                        if ( value.length > 0 ) {
                            Utils.saveAdvancedFormData( null, value, null, null, override );
                        }
                    }
                    if ( name && options.advance_matching_form.advance_matching_em_names.includes( name ) ) {
                        let email = $( this ).val().trim().toLowerCase();

                        if ( Utils.validateEmail( email ) ) {
                            Utils.saveAdvancedFormData( email, null, null, null, false );
                        }
                    }
                } )
            }

            //Setup Advanced Url Data
            if ( Object.keys( options.advance_matching_url ).length > 0 && options.advance_matching_url.enable_advance_matching_url ) {
                const url_params = new URLSearchParams( window.location.search );
                url_params.forEach( ( value, key ) => {
                    if ( options.advance_matching_url.advance_matching_fn_names.includes( key ) ) {
                        Utils.saveAdvancedFormData( null, null, value.trim(), null, override );
                    }

                    if ( options.advance_matching_url.advance_matching_ln_names.includes( key ) ) {
                        Utils.saveAdvancedFormData( null, null, null, value.trim(), override );
                    }

                    if ( options.advance_matching_url.advance_matching_tel_names.includes( key ) ) {
                        Utils.saveAdvancedFormData( null, value.trim(), null, null, override );
                    }

                    if ( options.advance_matching_url.advance_matching_em_names.includes( key ) ) {
                        let email = value.trim().toLowerCase()
                        if ( Utils.validateEmail( email ) ) {
                            Utils.saveAdvancedFormData( email, null, null, null, override );
                        }
                    }
                } );
            }
        }

        // setup Click Event
        if (
            options.dynamicEvents.hasOwnProperty("automatic_event_internal_link") ||
            options.dynamicEvents.hasOwnProperty("automatic_event_outbound_link") ||
            options.dynamicEvents.hasOwnProperty("automatic_event_tel_link") ||
            options.dynamicEvents.hasOwnProperty("automatic_event_email_link") ||
            options.dynamicEvents.hasOwnProperty("automatic_event_download")
        ) {

            $(document).onFirst('click', 'a, button, input[type="button"], input[type="submit"]', function (e) {

                var $elem = $(this);


                // Download
                if(options.dynamicEvents.hasOwnProperty("automatic_event_download")) {
                    var isFired = false;
                    if ($elem.is('a')) {
                        var href = $elem.attr('href');
                        if (typeof href !== "string") {
                            return;
                        }
                        href = href.trim();
                        var extension = Utils.getLinkExtension(href);
                        var track_download = false;

                        if (extension.length > 0) {

                            if(options.dynamicEvents.hasOwnProperty("automatic_event_download") ) {
                                var pixels = Object.keys(options.dynamicEvents.automatic_event_download);
                                for (var i = 0; i < pixels.length; i++) {
                                    var event = Utils.clone(options.dynamicEvents.automatic_event_download[pixels[i]]);
                                    var extensions = event.extensions;
                                    if (extensions.includes(extension)) {

                                        if(pixels[i] == "tiktok") {
                                            getPixelBySlag(pixels[i]).fireEvent(event.name, event);
                                        } else {
                                            if (options.enable_remove_download_url_param) {
                                                href = href.split('?')[0];
                                            }
                                            event.params.download_url = href;
                                            event.params.download_type = extension;
                                            event.params.download_name = Utils.getLinkFilename(href);
                                            getPixelBySlag(pixels[i]).onDownloadEvent(event);
                                        }

                                        isFired = true;
                                    }
                                }
                            }
                        }
                    }
                    if(isFired) { // prevent duplicate events on the same element
                        return;
                    }
                }


                if (!e.hasOwnProperty('originalEvent')) {
                    return;
                }
                if($elem.hasClass("add_to_cart_button") ||
                    $elem.hasClass("single_add_to_cart_button") ) { // add_to_cart_button fire in woo
                    return;
                }

                if(options.dynamicEvents.hasOwnProperty("wcf_add_to_cart_on_next_step_click")
                    && $elem.hasClass("wcf-next-step-link")) {
                    return;// add_to_cart_button fire in woo cf
                }
                if(options.dynamicEvents.hasOwnProperty("wcf_add_to_cart_on_bump_click")
                    && $elem.hasClass("wcf-bump-order-cb")) {
                    return;// add_to_cart_button fire in woo cf
                }

                if($elem.hasClass("remove_from_cart_button") ) { // cancel remove from cart
                    return;
                }
                if($elem.hasClass("remove") ) { // cancel remove from cart
                    if($elem.parents('.cart_item').length || $elem.parents('.mini_cart_item').length)
                        return;
                }
                if($elem.attr("name") == "update_cart" || $elem.attr("name") == "apply_coupon") { // cancel update  cart or coupon button
                    return;
                }


                if ($elem.hasClass('pys_block')) {
                    return; // avoiding fake double clicks from Affiliate event
                }
                var text = "";
                var target_url = "";
                var linkType = "Internal Click";

                if ($elem.is('a')) {
                    var href = $elem.attr('href');

                    // fixes #112
                    if (typeof href !== "string") {
                        return;
                    }
                    href = href.trim();

                    text = $elem.contents().filter(function() {
                        return this.nodeType === 3; // Фильтруем только текстовые узлы
                    }).text().trim();
                    if(options.enable_remove_target_url_param) {
                        target_url = href.split('?')[0];
                    } else {
                        target_url = href
                    }


                    //Email Event
                    if ( href.startsWith( 'mailto:' ) ) {
                        if ( options.triggerEventTypes.hasOwnProperty( "email_link" ) ) {
                            return;
                        } else {
                            setupEmailLinks();
                        }

                        return; // not fire next
                    }

                    // Phone
                    if (href.startsWith('tel:')) {
                        if(options.dynamicEvents.hasOwnProperty("automatic_event_tel_link")) {
                            var pixels = Object.keys(options.dynamicEvents.automatic_event_tel_link);
                            for(var i = 0;i<pixels.length;i++) {
                                var event = Utils.clone(options.dynamicEvents.automatic_event_tel_link[pixels[i]]);
                                if ( pixels[i] !== 'tiktok') {
                                    Utils.copyProperties(Utils.getRequestParams(), event.params);
                                }
                                getPixelBySlag(pixels[i]).fireEvent(event.name, event);
                            }
                        }
                        return; // not fire next
                    }

                    if (href.startsWith('http')) {
                        // link type
                        var host = $elem.context != undefined ? $elem.context.host : $elem[0].host;
                        if (document.location.host != host) {
                            linkType = 'External Click';
                        }
                    }
                } else if ($elem.is('button')) {
                    if( $elem.hasClass("forminator-button-submit")) {
                        //disable duplicate events
                        return;
                    }
                    text = $elem.contents().filter(function() {
                        return this.nodeType === 3; // Фильтруем только текстовые узлы
                    }).text().trim();
                } else if ($elem.is('input[type="button"]')) {
                    text = $elem.val();
                } else if ($elem.is('input[type="submit"]')) {
                    if ( $elem.parents("form.comment-form")) {
                        //disable duplicate events
                        return;
                    }
                    if ($elem.parents("form")) {
                        //disable duplicate events
                        return;
                    }
                    text = $elem.val();
                } else {
                    return;
                }



                text = Utils.filterEmails(text);


                if( linkType === "Internal Click"
                    && options.dynamicEvents.hasOwnProperty("automatic_event_internal_link")
                ) {
                    var pixels = Object.keys(options.dynamicEvents.automatic_event_internal_link);

                    for(var i = 0;i<pixels.length;i++) {
                        var event = Utils.clone(options.dynamicEvents.automatic_event_internal_link[pixels[i]]);

                        if(pixels[i] !== "tiktok") { // TT doesn't support custom parameters
                            event.params["text"] = text;
                            if(target_url){
                                event.params["target_url"] = target_url;
                            }
                            Utils.copyProperties(Utils.getRequestParams(), event.params);
                        }


                        getPixelBySlag(pixels[i]).fireEvent(event.name, event);
                    }
                }

                if( linkType === "External Click"
                    && options.dynamicEvents.hasOwnProperty("automatic_event_outbound_link")
                ) {
                    var pixels = Object.keys(options.dynamicEvents.automatic_event_outbound_link);

                    for(var i = 0;i<pixels.length;i++) {
                        var event = Utils.clone(options.dynamicEvents.automatic_event_outbound_link[pixels[i]]);

                        if(pixels[i] !== "tiktok") { // TT doesn't support custom parameters
                            event.params["text"] = text;
                            if(target_url){
                                event.params["target_url"] = target_url;
                            }
                            Utils.copyProperties(Utils.getRequestParams(), event.params);
                        }


                        getPixelBySlag(pixels[i]).fireEvent(event.name, event);
                    }
                }




            });

        }

        // setup AdSense Event
        if (options.dynamicEvents.hasOwnProperty("automatic_event_adsense")) {

            var isOverGoogleAd = false;

            $(document)
                .on('mouseover', 'ins iframe', function () { //class adsbygoogle adsbygoogle-noablate ??
                    isOverGoogleAd = true;
                })
                .on('mouseout', 'iframe', function () {
                    isOverGoogleAd = false;
                });

            $(window)
                .on( "blur",function () {
                    if (isOverGoogleAd) {
                        if(options.dynamicEvents.hasOwnProperty("automatic_event_adsense")) {
                            var pixels = Object.keys(options.dynamicEvents.automatic_event_adsense);
                            for (var i = 0; i < pixels.length; i++) {
                                var event = Utils.clone(options.dynamicEvents.automatic_event_adsense[pixels[i]]);
                                if ( pixels[i] !== 'tiktok') {
                                    Utils.copyProperties(Utils.getRequestParams(), event.params);
                                }
                                getPixelBySlag(pixels[i]).onAdSenseEvent(event);
                            }
                        }

                        $.each(options.triggerEventTypes, function (triggerType, events) {
                            $.each(events, function (eventId, triggers) {
                                switch (triggerType) {
                                    case 'ad_sense_click':
                                        Utils.fireTriggerEvent(eventId);
                                        break;
                                }
                            });
                        });
                    }
                })
                .trigger("focus");

        }

        //setup adsense for custom events
        var dynamicAdsenseEventsTriggers = 0
        $.each(options.triggerEventTypes, function (triggerType, events) {
            if(triggerType == "ad_sense_click") {
                dynamicAdsenseEventsTriggers++;
            }
        });
        if (dynamicAdsenseEventsTriggers > 0) {

            var isOverGoogleAd = false;

            $(document)
                .on('mouseover', 'ins > ins > iframe', function () {
                    isOverGoogleAd = true;
                })
                .on('mouseout', 'iframe', function () {
                    isOverGoogleAd = false;
                });

            $(window)
                .on( "blur",function () {
                    if (isOverGoogleAd) {

                        $.each(options.triggerEventTypes, function (triggerType, events) {
                            $.each(events, function (eventId, triggers) {
                                switch (triggerType) {
                                    case 'ad_sense_click':
                                        Utils.fireTriggerEvent(eventId);
                                        break;
                                }
                            });
                        });
                    }
                })
                .trigger("focus");

        }


        // page scroll event
        if (options.dynamicEvents.hasOwnProperty("automatic_event_scroll")
        ) {

            var singlePageScroll = function () {


                var docHeight = $(document).height() - $(window).height();
                var isFired = false;

                if (options.dynamicEvents.hasOwnProperty("automatic_event_scroll")) {
                    var pixels = Object.keys(options.dynamicEvents.automatic_event_scroll);
                    for(var i = 0;i<pixels.length;i++) {
                        var event = Utils.clone(options.dynamicEvents.automatic_event_scroll[pixels[i]]);
                        var scroll = Math.round(docHeight * event.scroll_percent / 100)// convert % to absolute positions

                        if(scroll < $(window).scrollTop()) {
                            if ( pixels[i] !== 'tiktok') {
                                Utils.copyProperties(Utils.getRequestParams(), event.params);
                            }
                            getPixelBySlag(pixels[i]).onPageScroll(event);
                            isFired = true
                        }
                    }
                }
                if(isFired) {
                    $(document).off("scroll",singlePageScroll);
                }
            }
            $(document).on("scroll",singlePageScroll);
        }


        if (options.dynamicEvents.hasOwnProperty("automatic_event_time_on_page")) {
            var pixels = Object.keys(options.dynamicEvents.automatic_event_time_on_page);
            var time = options.dynamicEvents.automatic_event_time_on_page[pixels[0]].time_on_page; // the same for all pixel
            setTimeout(function(){
                for(var i = 0;i<pixels.length;i++) {
                    var event = Utils.clone(options.dynamicEvents.automatic_event_time_on_page[pixels[i]]);
                    if ( pixels[i] !== 'tiktok') {
                        Utils.copyProperties(Utils.getRequestParams(), event.params);
                    }
                    getPixelBySlag(pixels[i]).onTime(event);
                }
            },time*1000);
        }

        // setup Dynamic events

        $.each(options.triggerEventTypes, function (triggerType, events) {

            $.each(events, function (eventId, triggers) {
                switch (triggerType) {
                    case 'url_click':
                        //@see: Utils.setupURLClickEvents()
                        break;

                    case 'css_click':
                        Utils.setupCSSClickEvents(eventId, triggers);
                        break;

                    case 'css_mouseover':
                        Utils.setupMouseOverClickEvents(eventId, triggers);
                        break;

                    case 'scroll_pos':
                        Utils.setupScrollPosEvents(eventId, triggers);
                        break;
                    case 'comment':
                        Utils.setupCommentEvents(eventId, triggers);
                        break;
                    case 'video_view':
                        //@see: Utils.checkYouTubeCompletion() and Utils.addYouTubeEvents()
                        break;
                }

            });

            if ( triggerType == "email_link" ) {
                Utils.setupEmailLinkEvents( events )
            }

        });

        // setup WooCommerce events
        if (options.woo.enabled) {

            // Woo CartFlow AddToCart
            if (options.dynamicEvents.hasOwnProperty("wcf_add_to_cart_on_next_step_click")) {
                $("body").on("click",'.wcf-next-step-link',function () {
                    var pixels = Object.keys(options.dynamicEvents.wcf_add_to_cart_on_next_step_click);
                    for(var i = 0;i<pixels.length;i++) {
                        var event = Utils.clone(options.dynamicEvents.wcf_add_to_cart_on_next_step_click[pixels[i]])
                        getPixelBySlag(pixels[i]).fireEvent(event.name, event);
                    }
                });
            }
            // Woo CartFlow Bump AddToCart
            if(options.dynamicEvents.hasOwnProperty("wcf_add_to_cart_on_bump_click") ||
                options.dynamicEvents.hasOwnProperty("wcf_bump")) {
                $("body").on('change','.wcf-bump-order-cb',function () {

                    if(this.checked) {
                        if(options.dynamicEvents.hasOwnProperty("wcf_add_to_cart_on_bump_click")) {
                            var pixels = Object.keys(options.dynamicEvents.wcf_add_to_cart_on_bump_click);
                            for(var i = 0;i<pixels.length;i++) {
                                var event = Utils.clone(options.dynamicEvents.wcf_add_to_cart_on_bump_click[pixels[i]]);
                                getPixelBySlag(pixels[i]).fireEvent(event.name, event);
                            }
                        }


                        if(options.dynamicEvents.hasOwnProperty("wcf_bump")) {
                            var pixels = Object.keys(options.dynamicEvents.wcf_bump);
                            for(var i = 0;i<pixels.length;i++) {
                                var event = Utils.clone(options.dynamicEvents.wcf_bump[pixels[i]]);
                                getPixelBySlag(pixels[i]).fireEvent(event.name, event);
                            }
                        }

                    } else {
                        if(options.dynamicEvents.hasOwnProperty("wcf_remove_from_cart_on_bump_click")) {
                            var pixels = Object.keys(options.dynamicEvents.wcf_remove_from_cart_on_bump_click);
                            for(var i = 0;i<pixels.length;i++) {
                                var event = Utils.clone(options.dynamicEvents.wcf_remove_from_cart_on_bump_click[pixels[i]]);
                                getPixelBySlag(pixels[i]).fireEvent(event.name, event);
                            }
                        }

                    }


                });
            }


            // WooCommerce AddToCart
            if (options.dynamicEvents.hasOwnProperty("woo_add_to_cart_on_button_click")
                && options.woo.hasOwnProperty("addToCartCatchMethod")
                && options.woo.addToCartCatchMethod === "add_cart_js"
            ) {
                // Loop, any kind of "simple" product, except external
                $('.add_to_cart_button:not(.product_type_variable,.product_type_bundle,.single_add_to_cart_button)').on("click",function (e) {

                    var $button = $(this);
                    var $prod_info = $button.siblings('.pys_list_name_productdata').data();
                    var product_id = $(this).data('product_id');
                    Cookies.set('productlist', JSON.stringify($prod_info), { expires: 1,path: '/' })
                    var product_id = $(this).data('product_id');
                    if (typeof product_id !== 'undefined') {

                        if(options.dynamicEvents.hasOwnProperty("woo_add_to_cart_on_button_click")){
                            var tmpEventID = pys_generate_token();
                            $.each(options.dynamicEvents.woo_add_to_cart_on_button_click, function (i, tag) {
                                tag.eventID = tmpEventID;
                            });
                        }

                        Facebook.onWooAddToCartOnButtonEvent(product_id,$(this));
                        Analytics.onWooAddToCartOnButtonEvent(product_id, $prod_info);
                        GTM.onWooAddToCartOnButtonEvent(product_id, $prod_info);
                        GAds.onWooAddToCartOnButtonEvent(product_id);
                        Pinterest.onWooAddToCartOnButtonEvent(product_id);
                        Bing.onWooAddToCartOnButtonEvent(product_id);
                        TikTok.onWooAddToCartOnButtonEvent(product_id);
                    }

                });

                // Single Product
                // tap try to https://stackoverflow.com/questions/30990967/on-tap-click-event-firing-twice-how-to-avoid-it
                //  $(document) not work
                $('body').onFirst('click','button.single_add_to_cart_button,.single_add_to_cart_button',function (e) {

                    var $button = $(this);
                    var $prod_info = $button.siblings('.pys_list_name_productdata').data();
                    var product_id = $(this).data('product_id');
                    Cookies.set('productlist', JSON.stringify($prod_info), { expires: 1,path: '/' })
                    if ($button.hasClass('disabled')) {
                        return;
                    }

                    var $form = $button.closest('form');

                    var product_type = Utils.PRODUCT_SIMPLE;
                    var is_external = false;

                    if ($form.length === 0) {
                        is_external = true;
                    } else if ($form.hasClass('variations_form')) {
                        product_type = Utils.PRODUCT_VARIABLE;
                    } else if($form.hasClass('bundle_form')) {
                        product_type = Utils.PRODUCT_BUNDLE;
                    } else if($form.hasClass('grouped_form')) {
                        product_type = Utils.PRODUCT_GROUPED;
                    }



                    var product_id;
                    var qty;
                    if (product_type === Utils.PRODUCT_GROUPED) {
                        qty = 1;
                        product_id = parseInt($form.find('*[name="add-to-cart"]').val());
                    } else if (product_type === Utils.PRODUCT_VARIABLE) {
                        product_id = parseInt($form.find('*[name="add-to-cart"]').val());
                        var qtyTag = $form.find('input[name="quantity"]');
                        if(qtyTag.length <= 0) {
                            qtyTag = $form.find('select[name="quantity"]');
                        }
                        qty = parseInt(qtyTag.val());
                    } else if (is_external) {
                        product_id = options.woo.singleProductId;
                        qty = 1;
                    } else {
                        product_id = parseInt($form.find('*[name="add-to-cart"]').val());
                        var qtyTag = $form.find('input[name="quantity"]');
                        if(qtyTag.length <= 0) {
                            qtyTag = $form.find('select[name="quantity"]');
                        }
                        qty = parseInt(qtyTag.val());
                    }

                    //
                    if(options.dynamicEvents.hasOwnProperty("woo_add_to_cart_on_button_click")){
                        var tmpEventID = pys_generate_token();
                        $.each(options.dynamicEvents.woo_add_to_cart_on_button_click, function (i, tag) {
                            tag.eventID = tmpEventID;
                        });
                    }

                    Facebook.onWooAddToCartOnSingleEvent(product_id, qty, product_type, is_external, $form);
                    Analytics.onWooAddToCartOnSingleEvent(product_id, qty, product_type, is_external, $form, $prod_info);
                    GTM.onWooAddToCartOnSingleEvent(product_id, qty, product_type, is_external, $form, $prod_info);
                    GAds.onWooAddToCartOnSingleEvent(product_id, qty, product_type, is_external, $form);
                    Pinterest.onWooAddToCartOnSingleEvent(product_id, qty, product_type, is_external, $form);
                    Bing.onWooAddToCartOnSingleEvent(product_id, qty, product_type, is_external, $form);
                    TikTok.onWooAddToCartOnSingleEvent(product_id, qty, product_type, is_external, $form);
                });

            } else {
                $('.add_to_cart_button:not(.product_type_variable,.product_type_bundle,.single_add_to_cart_button)').on("click",function (e) {
                    var $button = $(this);
                    var $prod_info = $button.siblings('.pys_list_name_productdata').data();
                    var product_id = $(this).data('product_id');
                    Cookies.set('productlist', JSON.stringify($prod_info), { expires: 1,path: '/' })
                });

                // Single Product
                // tap try to https://stackoverflow.com/questions/30990967/on-tap-click-event-firing-twice-how-to-avoid-it
                //  $(document) not work
                $('body').onFirst('click','button.single_add_to_cart_button,.single_add_to_cart_button',function (e) {

                    var $button = $(this);
                    var $prod_info = $button.siblings('.pys_list_name_productdata').data();
                    Cookies.set('productlist', $prod_info, { expires: 1,path: '/' })
                });
            }

            // WooCommerce Affiliate
            if (options.dynamicEvents.hasOwnProperty("woo_affiliate")) {

                // Loop, external
                $('.product_type_external').on("click",function (e) {

                    var product_id = $(this).data('product_id');

                    if (typeof product_id !== 'undefined') {
                        Facebook.onWooAffiliateEvent(product_id);
                        Analytics.onWooAffiliateEvent(product_id);
                        GTM.onWooAffiliateEvent(product_id);
                        GAds.onWooAffiliateEvent(product_id);
                        Pinterest.onWooAffiliateEvent(product_id);
                        Bing.onWooAffiliateEvent(product_id);
                    }

                });

            }

            // WooCommerce RemoveFromCart
            if (options.dynamicEvents.hasOwnProperty("woo_remove_from_cart")) {

                $('body').on('click', options.woo.removeFromCartSelector, function (e) {

                    var $a = $(e.currentTarget),
                        href = $a.attr('href');

                    // extract cart item hash from remove button URL
                    var regex = new RegExp("[\\?&]remove_item=([^&#]*)"),
                        results = regex.exec(href);

                    if (results !== null) {

                        var item_hash = results[1];

                        if (options.dynamicEvents["woo_remove_from_cart"].hasOwnProperty(item_hash)) {
                            var events = options.dynamicEvents["woo_remove_from_cart"][item_hash];
                            Utils.fireEventForAllPixel("onWooRemoveFromCartEvent",events)
                        }

                    }

                });

            }

            // WooCommerce PayPal
            if (options.dynamicEvents.hasOwnProperty("woo_paypal")) {

                // Non-default binding used to avoid situations when some code in external js
                // stopping events propagation, eg. returns false, and our handler will never called
                $(document).onFirst('submit click', '#place_order', function (e) {

                    var method = $('form[name="checkout"] input[name="payment_method"]:checked').val();

                    if (method !== 'paypal') {
                        return;
                    }
                    var events = options.dynamicEvents.woo_paypal;
                    Utils.fireEventForAllPixel("onWooPayPalEvent",events)

                });

            }

            // WooCommerce checkout progress
            if(options.dynamicEvents.hasOwnProperty("woo_initiate_checkout_progress_f") ) {

                $(document).on("change",".woocommerce-validated #billing_first_name",function () {
                    Analytics.onWooCheckoutProgressStep(options.dynamicEvents.woo_initiate_checkout_progress_f[Analytics.tag()]);
                });
            }
            if(options.dynamicEvents.hasOwnProperty("woo_initiate_checkout_progress_l")) {

                $(document).on("change",".woocommerce-validated #billing_last_name",function () {
                    Analytics.onWooCheckoutProgressStep(options.dynamicEvents.woo_initiate_checkout_progress_l[Analytics.tag()]);
                });
            }

            if(options.dynamicEvents.hasOwnProperty("woo_initiate_checkout_progress_e")) {

                $(document).on("change",".woocommerce-validated #billing_email",function () {
                    Analytics.onWooCheckoutProgressStep(options.dynamicEvents.woo_initiate_checkout_progress_e[Analytics.tag()]);
                });
            }
            if(options.dynamicEvents.hasOwnProperty("woo_initiate_checkout_progress_o")) {
                $(document).onFirst('submit click', '#place_order', function () {
                    Analytics.onWooCheckoutProgressStep(options.dynamicEvents.woo_initiate_checkout_progress_o[Analytics.tag()]);
                });
            }


            // WooCommerce

            $('.product.type-product a.woocommerce-loop-product__link').onFirst('click', function (evt) {
                var productId = $(this).closest('.product').find(".add_to_cart_button").attr("data-product_id");
                var eventTypes = ["woo_select_content_search", "woo_select_content_shop", "woo_select_content_tag", "woo_select_content_single", "woo_select_content_category"];
                var isEventFired = false;

                for (var i = 0; i < eventTypes.length; i++) {
                    var eventType = eventTypes[i];
                    if (options.dynamicEvents.hasOwnProperty(eventType) && options.dynamicEvents[eventType].hasOwnProperty(productId)) {
                        if(Analytics.isEnabled()){
                            Analytics.onWooSelectContent(options.dynamicEvents[eventType][productId][Analytics.tag()]);
                        }
                        if(GTM.isEnabled()){
                            GTM.onWooSelectContent(options.dynamicEvents[eventType][productId][GTM.tag()]);
                        }
                        isEventFired = true;
                        break;
                    }
                }

                if (!isEventFired) {
                    let prod_info = $(this).parent().find('.pys_list_name_productdata').data();
                    if (prod_info) {
                        const select_prod_list = {};
                        if (prod_info['pys_list_name_productlist_name']) {
                            select_prod_list.list_name = prod_info['pys_list_name_productlist_name']
                        }
                        if (prod_info['pys_list_name_productlist_id']) {
                            select_prod_list.list_id = prod_info['pys_list_name_productlist_id']
                        }
                        const url = new URL(window.location.href);
                        select_prod_list.url = url.origin + url.pathname;
                        Cookies.set('select_prod_list', JSON.stringify(select_prod_list), { expires: 1,path: '/' });
                    }
                }
            });

        }

        // setup EDD events
        if (options.edd.enabled) {

            // EDD AddToCart
            if (options.dynamicEvents.hasOwnProperty("edd_add_to_cart_on_button_click")) {

                $('form.edd_download_purchase_form .edd-add-to-cart').on("click",function (e) {

                    var $button = $(this);
                    var $form = $button.closest('form');
                    var variable_price = $button.data('variablePrice'); // yes/no
                    var price_mode = $button.data('priceMode'); // single/multi
                    var ids = [];
                    var quantities = [];
                    var qty;
                    var id;

                    if (variable_price === 'yes' && price_mode === 'multi') {

                        id = $form.find('input[name="download_id"]').val();

                        // get selected variants
                        $.each($form.find('input[name="edd_options[price_id][]"]:checked'), function (i, el) {
                            ids.push(id + '_' + $(el).val());
                        });

                        // get qty for selected variants
                        $.each(ids, function (i, variant_id) {

                            var variant_index = variant_id.split('_', 2);
                            qty = $form.find('input[name="edd_download_quantity_' + variant_index[1] + '"]').val();

                            if (typeof qty !== 'undefined') {
                                quantities.push(qty);
                            } else {
                                quantities.push(1);
                            }

                        });

                    } else if (variable_price === 'yes' && price_mode === 'single') {

                        id = $form.find('input[name="download_id"]').val();
                        ids.push(id + '_' + $form.find('input[name="edd_options[price_id][]"]:checked').val());

                        qty = $form.find('input[name="edd_download_quantity"]').val();

                        if (typeof qty !== 'undefined') {
                            quantities.push(qty);
                        } else {
                            quantities.push(1);
                        }

                    } else {

                        ids.push($button.data('downloadId'));

                        qty = $form.find('input[name="edd_download_quantity"]').val();

                        if (typeof qty !== 'undefined') {
                            quantities.push(qty);
                        } else {
                            quantities.push(1);
                        }
                    }

                    // fire event for each download/variant
                    $.each(ids, function (i, download_id) {

                        var q = parseInt(quantities[i]);
                        var variant_index = download_id.toString().split('_', 2);
                        var price_index;

                        if (variant_index.length === 2) {
                            download_id = variant_index[0];
                            price_index = variant_index[1];
                        }

                        Facebook.onEddAddToCartOnButtonEvent(download_id, price_index, q);
                        Analytics.onEddAddToCartOnButtonEvent(download_id, price_index, q);
                        GTM.onEddAddToCartOnButtonEvent(download_id, price_index, q);
                        GAds.onEddAddToCartOnButtonEvent(download_id, price_index, q);
                        Pinterest.onEddAddToCartOnButtonEvent(download_id, price_index, q);
                        Bing.onEddAddToCartOnButtonEvent(download_id, price_index, q);
                        TikTok.onEddAddToCartOnButtonEvent(download_id, price_index, q);

                    });

                });

            }

            // EDD RemoveFromCart
            if (options.dynamicEvents.hasOwnProperty("edd_remove_from_cart") ) {

                $('form#edd_checkout_cart_form .edd_cart_remove_item_btn').on("click",function (e) {

                    var href = $(this).attr('href');
                    var key = href.substring(href.indexOf('=') + 1).charAt(0);

                    if (options.dynamicEvents.edd_remove_from_cart.hasOwnProperty(key)) {
                        var events = options.dynamicEvents.edd_remove_from_cart[key];
                        Utils.fireEventForAllPixel("onEddRemoveFromCartEvent",events)
                    }

                });

            }

        }

        Utils.setupURLClickEvents();

        // setup Comment Event
        if (options.dynamicEvents.hasOwnProperty("automatic_event_comment")
        ) {

            $('form.comment-form').on("submit",function () {
                if (options.dynamicEvents.hasOwnProperty("automatic_event_comment")) {
                    var pixels = Object.keys(options.dynamicEvents.automatic_event_comment);
                    for (var i = 0; i < pixels.length; i++) {
                        var event = Utils.clone(options.dynamicEvents.automatic_event_comment[pixels[i]]);
                        if ( pixels[i] !== 'tiktok') {
                            Utils.copyProperties(Utils.getRequestParams(), event.params);
                        }
                        getPixelBySlag(pixels[i]).onCommentEvent(event);
                    }
                }
            });

        }

        // setup Form Event
        if ( options.dynamicEvents.hasOwnProperty("automatic_event_form")) {

            $(document).onFirst('submit', 'form', function (e) {

                var $form = $(this);

                // exclude WP forms
                if ($form.hasClass('comment-form') || $form.hasClass('search-form') || $form.attr('id') === 'adminbarsearch') {
                    return;
                }

                // exclude Woo forms
                if ($form.hasClass('woocommerce-product-search') || $form.hasClass('cart') || $form.hasClass('woocommerce-cart-form') ||
                    $form.hasClass('woocommerce-shipping-calculator') || $form.hasClass('checkout') || $form.hasClass('checkout_coupon')) {
                    return;
                }

                // exclude EDD forms
                if ($form.hasClass('edd_form') || $form.hasClass('edd_download_purchase_form')) {
                    return;
                }
                // exclude CF7 forms
                if ($form.hasClass('wpcf7-form')) {
                    return;
                }
                // exclude Gravity forms
                if ($form.attr('id') && $form.attr('id').includes('gform')) {
                    var target = $form.attr('target');
                    if (target && target.indexOf('gform_ajax_frame') !== -1) {
                        return;
                    }
                }
                // exclude Forminator forms
                if ($form.hasClass('forminator-custom-form') || $form.hasClass('forminator_ajax')) {
                    return;
                }
                // exclude WPforms forms
                if ($form.hasClass('wpforms-form') || $form.hasClass('wpforms-ajax-form')) {
                    return;
                }
                // exclude Formidable forms
                /*if ($form.hasClass('frm-show-form')) {
                    return;
                }*/
                // exclude Ninja Forms forms
                if ($form.parent().hasClass('nf-form-layout')) {
                    return;
                }
                // exclude Fluent forms
                if ($form.hasClass('frm-fluent-form')) {
                    return;
                }

                // exclude WS form forms
                if ($form.hasClass('wsf-form') ) {
                    return;
                }

                // exclude WS form forms
                if ( $form.hasClass( 'elementor-form' ) ) {
                    return;
                }

                if(!options.enable_success_send_form) {
                    var params = {
                        form_id: $form.attr('id'),
                        form_class: $form.attr('class') ? $form.attr('class') : $form.attr('id'),
                        text: $form.find('[type="submit"]').is('input') ?
                            $form.find('[type="submit"]').val() : $form.find('[type="submit"]').text()
                    };

                    if (options.dynamicEvents.hasOwnProperty("automatic_event_form")) {
                        var pixels = Object.keys(options.dynamicEvents.automatic_event_form);
                        for (var i = 0; i < pixels.length; i++) {
                            var event = Utils.clone(options.dynamicEvents.automatic_event_form[pixels[i]]);

                            if (pixels[i] === "tiktok") {
                                getPixelBySlag(pixels[i]).fireEvent(event.name, event);
                            } else {
                                Utils.copyProperties(params, event.params,)
                                Utils.copyProperties(Utils.getRequestParams(), event.params);
                                getPixelBySlag(pixels[i]).onFormEvent(event);
                            }
                        }
                    }
                }
            });


        }

        jQuery(document).on('elementor/popup/show', function(event) {
            for (var i = 0; i < jQuery(".wpcf7-form").length; i++) {
                wpcf7.init(jQuery(".wpcf7-form")[i]);
            }
        });

        document.addEventListener( 'wpcf7mailsent', function ( event ) {
            let form_id = event.detail.contactFormId,
                sendEventId = null,
                disabled_form_action = false;
            if ( options.triggerEventTypes.hasOwnProperty( 'CF7' ) ) {
                $.each( options.triggerEventTypes.CF7, function ( eventId, triggers ) {
                    $.each( triggers, function ( index, trigger ) {
                        $.each( trigger.forms, function ( i, value ) {
                            if ( value == form_id ) {
                                sendEventId = eventId;
                                disabled_form_action = trigger.disabled_form_action;
                            }
                        } )
                    } );
                } );
            }
            if ( sendEventId != null ) {
                Utils.fireTriggerEvent( sendEventId );
            }
            sendFormAction( $( event.target ), form_id, sendEventId, disabled_form_action );

        }, false );

        //GravityForm
        jQuery( document ).on( 'gform_confirmation_loaded', function ( event, formId ) {
            let form_id = formId,
                sendEventId = null,
                disabled_form_action = false;
            if ( options.triggerEventTypes.hasOwnProperty( 'gravity' ) ) {
                $.each( options.triggerEventTypes.gravity, function ( eventId, triggers ) {
                    $.each( triggers, function ( index, trigger ) {
                        $.each( trigger.forms, function ( i, value ) {
                            if ( value == form_id ) {
                                disabled_form_action = trigger.disabled_form_action;
                                sendEventId = eventId;
                            }
                        } )
                    } );
                } );
            }

            if ( sendEventId != null ) {
                Utils.fireTriggerEvent( sendEventId );
            }
            sendFormAction( $( event.target ), form_id, sendEventId, disabled_form_action );
            jQuery( document ).off( 'gform_confirmation_loaded' );
        } );
        //Forminator
        $( document ).on( 'forminator:form:submit:success', function ( event ) {

            let form_id = $( event.target ).find( 'input[name="form_id"]' ).val(),
                sendEventId = null,
                disabled_form_action = false;
            if ( options.triggerEventTypes.hasOwnProperty( 'forminator' ) ) {
                $.each( options.triggerEventTypes.forminator, function ( eventId, triggers ) {
                    $.each( triggers, function ( index, trigger ) {
                        $.each( trigger.forms, function ( i, value ) {
                            if ( value == form_id ) {
                                disabled_form_action = trigger.disabled_form_action;
                                sendEventId = eventId;
                            }
                        } )
                    } );
                } );
            }
            if ( sendEventId != null ) {
                Utils.fireTriggerEvent( sendEventId );
            }
            sendFormAction( $( event.target ), form_id, sendEventId, disabled_form_action );
        } );

        //WPForm
        $( 'form.wpforms-form' ).on( 'wpformsAjaxSubmitSuccess', ( event ) => {

            let form_id = $( event.target ).attr( 'data-formid' ),
                sendEventId = null,
                disabled_form_action = false;

            if ( options.triggerEventTypes.hasOwnProperty( 'wpforms' ) ) {
                $.each( options.triggerEventTypes.wpforms, function ( eventId, triggers ) {
                    $.each( triggers, function ( index, trigger ) {
                        $.each( trigger.forms, function ( i, value ) {
                            if ( value == form_id ) {
                                sendEventId = eventId;
                                disabled_form_action = trigger.disabled_form_action;
                            }
                        } )
                    } );
                } );
            }
            if ( sendEventId != null ) {
                Utils.fireTriggerEvent( sendEventId );
            }
            sendFormAction( $( event.target ), form_id, sendEventId, disabled_form_action );
        } )

        $( document ).on( 'frmFormComplete', function ( event, form, response ) {
            const form_id = $( form ).find( 'input[name="form_id"]' ).val();
            let sendEventId = null,
                disabled_form_action = false;
            if ( options.triggerEventTypes.hasOwnProperty( 'formidable' ) ) {
                $.each( options.triggerEventTypes.formidable, function ( eventId, triggers ) {
                    $.each( triggers, function ( index, trigger ) {
                        $.each( trigger.forms, function ( i, value ) {
                            if ( value == form_id ) {
                                disabled_form_action = trigger.disabled_form_action;
                                sendEventId = eventId;
                            }
                        } )
                    } );
                } );
            }
            if ( sendEventId != null ) {
                Utils.fireTriggerEvent( sendEventId );
            }
            sendFormAction( $( event.target ), form_id, sendEventId, disabled_form_action );

        } );

        // Ninja Forms
        $( document ).onFirst( 'nfFormSubmitResponse', function ( event, data ) {
            const form_id = data.response.data.form_id;
            let sendEventId = null,
                disabled_form_action = false;
            if ( options.triggerEventTypes.hasOwnProperty( 'ninjaform' ) ) {
                $.each( options.triggerEventTypes.ninjaform, function ( eventId, triggers ) {
                    $.each( triggers, function ( index, trigger ) {
                        $.each( trigger.forms, function ( i, value ) {
                            if ( value == form_id ) {
                                disabled_form_action = trigger.disabled_form_action;
                                sendEventId = eventId;
                            }
                        } )
                    } );
                } );
            }
            if ( sendEventId != null ) {
                Utils.fireTriggerEvent( sendEventId );
            }
            sendFormAction( $( event.target ), form_id, sendEventId, disabled_form_action );
        } );


        $(document).on('fluentform_submission_success', function ( event, data ) {
            let $form = data.form; // Submitted form
            let config = data.config; // Form configuration
            let response = data.response; // Server response


            let $formItem = $form;
            let form_id = config.id;
            let sendEventId = null,
                disabled_form_action = false;
            if ( options.triggerEventTypes.hasOwnProperty( 'fluentform' ) ) {
                $.each( options.triggerEventTypes.fluentform, function ( eventId, triggers ) {
                    $.each( triggers, function ( index, trigger ) {
                        $.each( trigger.forms, function ( i, value ) {
                            if ( value == form_id ) {
                                disabled_form_action = trigger.disabled_form_action;
                                sendEventId = eventId;
                            }
                        } )
                    } );
                } );
            }

            if ( sendEventId != null ) {
                Utils.fireTriggerEvent( sendEventId );
            }
            sendFormAction( $( event.target ), form_id, sendEventId, disabled_form_action );
        } );

        //WSForm
        $( document ).on( 'wsf-submit-complete', ( event, form_object, form_id ) => {
            let sendEventId = null,
                disabled_form_action = false;
            if ( options.triggerEventTypes.hasOwnProperty( 'wsform' ) ) {
                $.each( options.triggerEventTypes.wsform, function ( eventId, triggers ) {
                    $.each( triggers, function ( index, trigger ) {
                        $.each( trigger.forms, function ( i, value ) {
                            if ( value == form_id ) {
                                disabled_form_action = trigger.disabled_form_action;
                                sendEventId = eventId;
                            }
                        } )
                    } );
                } );
            }

            if ( sendEventId != null ) {
                Utils.fireTriggerEvent( sendEventId );
            }
            sendFormAction( $( event.target ), form_id, sendEventId, disabled_form_action );
        } )

        // Elementor Forms
        let forms = document.querySelectorAll( '.elementor-form' );
        // Apply the observer to each form
        forms.forEach( function ( form ) {
            observeElementorForm( form );
        } );

        // watching Elementor Popup forms
        let observer = new MutationObserver( function ( mutationsList, observer ) {
            for ( let i = 0; i < mutationsList.length; i++ ) {
                let popupForm = document.querySelector( '[class*="elementor-popup"] form' );
                if ( popupForm ) {
                    observeElementorForm( popupForm );
                    observer.disconnect();
                    break;
                }
            }
        } );
        observer.observe( document.body, { childList: true, subtree: true } );

        // load pixel APIs
        Utils.loadPixels();

        // setup Enrich content
        if(Utils.isCheckoutPage()) {
            Utils.addCheckoutFields();
        }
        if(options.woo.hasOwnProperty('woo_view_content_variation_is_selected') && options.woo.woo_view_content_variation_is_selected) {
            handleWooViewContentVariation()
        }

    });


    function handleWooViewContentVariation() {
        var form = $('form.variations_form');

        form.on('change', 'select', function() {
            var selectedAttributes = {};
            form.find('select').each(function() {
                var attributeName = $(this).data('attribute_name') || $(this).attr('name');
                var attributeValue = $(this).val();
                if (attributeValue) {
                    selectedAttributes[attributeName] = attributeValue;
                }
            });

            $.ajax({
                url: options.ajaxUrl,
                type: 'POST',
                data: {
                    action: 'get_variation_info',
                    product_id: form.data('product_id'), // Передаем ID основного товара
                    attributes: selectedAttributes
                },
                success: function(response) {
                    if (response.success) {
                        $.each(response.data, function(slug) {
                            $.each(response.data[slug], function(index, event) {
                                getPixelBySlag(slug).fireEvent(event.name, event);
                            });
                        });
                    } else {
                        console.log('Error retrieving data:', response.data);
                    }
                }
            });
        });
    }
    var sendFormAction = function (form_target, formId, customEventId = null, disabled = false){
        var params = {
            form_id: formId,
            text: form_target.find('[type="submit"]').is('input') ? form_target.find('[type="submit"]').val() :
                form_target.find('.forminator-button-submit').text() != '' ? form_target.find('.forminator-button-submit').text() :
                    form_target.find('[type="submit"]').text()
        };

        if (options.dynamicEvents.hasOwnProperty("automatic_event_form")) {
            var pixels = Object.keys(options.dynamicEvents.automatic_event_form);
            for (var i = 0; i < pixels.length; i++) {

                if ( disabled && customEventId && typeof options.triggerEvents[customEventId][pixels[i]] !== 'undefined') {
                    continue;
                }
                var event = options.dynamicEvents.automatic_event_form[pixels[i]];
                if (pixels[i] === "tiktok") {
                    getPixelBySlag(pixels[i]).fireEvent(event.name, event);
                } else {
                    Utils.copyProperties(params, event.params)
                    Utils.copyProperties(Utils.getRequestParams(), event.params);
                    getPixelBySlag(pixels[i]).onFormEvent(event);
                }
            }
        }
    }

    var setupEmailLinks = function ( disabled_for_pixels = [] ) {
        if ( options.dynamicEvents.hasOwnProperty( "automatic_event_email_link" ) ) {
            var pixels = Object.keys( options.dynamicEvents.automatic_event_email_link );
            for ( var i = 0; i < pixels.length; i++ ) {
                if ( disabled_for_pixels.indexOf(pixels[ i ]) === -1 ) {
                    var event = Utils.clone( options.dynamicEvents.automatic_event_email_link[ pixels[ i ] ] );
                    if ( pixels[ i ] !== 'tiktok' ) {
                        Utils.copyProperties( Utils.getRequestParams(), event.params );
                    }
                    getPixelBySlag( pixels[ i ] ).fireEvent( event.name, event );
                }
            }
        }
    }

    //Elementor Forms Observer
    var observeElementorForm = function ( form ) {
        let observer = new MutationObserver( function ( mutations ) {

            for ( let i = 0; i < mutations.length; i++ ) {
                let mutation = mutations[ i ];

                if ( mutation.type === 'childList' || mutation.type === 'attributes' ) {
                    if ( $( form ).find( '.elementor-message-success' ).length > 0 ) {

                        let form_id = $( form ).attr( 'id' );
                        if ( !form_id ) {
                            form_id = $( form ).find( 'input[name="form_id"]' ).val();
                        }

                        let sendEventId = null,
                            disabled_form_action = false;
                        if ( options.triggerEventTypes.hasOwnProperty( 'elementor_form' ) ) {
                            $.each( options.triggerEventTypes.elementor_form, function ( eventId, triggers ) {
                                $.each( triggers, function ( index, trigger ) {
                                    $.each( trigger.forms, function ( i, value ) {
                                        if ( value == form_id ) {
                                            disabled_form_action = trigger.disabled_form_action;
                                            sendEventId = eventId;
                                        }
                                    })
                                } );
                            } );
                        }
                        if ( sendEventId != null ) {
                            Utils.fireTriggerEvent( sendEventId );
                        }
                        sendFormAction( $( event.target ), form_id, sendEventId, disabled_form_action );

                        observer.disconnect();
                        break;
                    }
                }
            }
        } );

        // Start observing the form for changes
        observer.observe( form, {
            attributes: true,
            childList: true,
            subtree: true
        } );
    }

}(jQuery, pysOptions);

function pys_generate_token() {
    return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
}
function getBundlePriceOnSingleProduct(data) {
    var items_sum = 0;
    jQuery(".bundle_form .bundled_product").each(function(index){
        var id = jQuery(this).find(".cart").data("bundled_item_id");
        var item_price = data.prices[id];
        var item_quantity = jQuery(this).find(".bundled_qty").val();
        if(!jQuery(this).hasClass("bundled_item_optional") ||
            jQuery(this).find(".bundled_product_optional_checkbox input").prop('checked')) {
            items_sum += item_price*item_quantity;
        }
    });
    return items_sum;
}

function getPixelBySlag(slug) {
    switch (slug) {
        case "facebook": return window.pys.Facebook;
        case "ga": return window.pys.Analytics;
        case "gtm": return window.pys.GTM;
        case "google_ads": return window.pys.GAds;
        case "bing": return window.pys.Bing;
        case "pinterest": return window.pys.Pinterest;
        case "tiktok": return window.pys.TikTok;
    }
}
function getUrlParameter(sParam) {
    var sPageURL = window.location.search.substring(1),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
        }
    }
    return false;
};
function inArray(needle, haystack) {
    var length = haystack.length;
    for(var i = 0; i < length; i++) {
        if(haystack[i] == needle) return true;
    }
    return false;
}

function getCookieYes(key) {
    const cookiesObj = document.cookie
        .split(";")
        .reduce((ac, cv) => {
            const [k, v] = cv.split("=");
            if (k && v) ac[k.trim()] = v;
            return ac;
        }, {});
    const consentCookie = cookiesObj["cookieyes-consent"] || cookiesObj["wt_consent"];
    if (!consentCookie) return undefined;
    const { [key]: value } = consentCookie
        .split(",")
        .reduce((obj, pair) => {
            const [k, v] = pair.split(":");
            if (k && v) obj[k] = v;
            return obj;
        }, {});
    return value;
}

function getRootDomain(useSubdomain = false) {
    const hostname = window.location.hostname; // Get the current hostname
    // Check if tldjs is defined before using it
    if (typeof tldjs === "undefined") {
        console.warn("tldjs is not defined");
        return hostname; // Return hostname as a fallback
    }

    const rootDomain = tldjs.getDomain(hostname); // Use tldjs to extract the root domain

    // Return the root domain with or without a leading dot based on useSubdomain
    return rootDomain ? (useSubdomain ? '.' + rootDomain : rootDomain) : hostname;
}
