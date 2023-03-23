/**
 * Sets proper language cookie
 *
 * Sends ajax request to get browser and IP language.
 * Sets cookie with current language.
 * Changes cookie when clicking a link pointed to another language.
 *
 */
function TRP_Determine_Language(){
    var _this = this;
    var trpCookie = null;
    var trpHelper = null;

    this.get_lang_from_url = function ( url ) {
        // we remove http or https
        // if the user links to a http link but the abs_home_url is https, we're serving the https one so we don't brake cookies if he doesn't have proper redirects
        var lang = url.replace( /^(http|https):\/\//g, '');
        var abs_home = trp_language_cookie_data[ 'abs_home' ].replace( /^(http|https):\/\//g, '');

        // we have removed the home path from our URL. We're adding a / in case it's the homepage of one of the languages
        // removing / from the front so it's easier for understanding explode()
        lang = trpHelper.ltrim( trpHelper.trailingslashit( lang.replace(abs_home, '') ),'/' );

        // We now have to see if the first part of the string is actually a language slug
        var lang_array = lang.split("/");
        if( lang_array.length < 2 ){
            return trp_language_cookie_data['default_language'];
        }
        // The language code is the first non-empty item in this array depending on abs_home slashes
        for ( var i = 0; i < lang_array.length; i++ ){
            if ( lang_array[i] != undefined && lang_array[i] != '' ) {
                lang = lang_array[i];
                break;
            }
        }
        // the lang slug != actual lang. So we need to do array_search so we don't end up with en instead of en_US
        if( trpHelper.in_array( lang, trp_language_cookie_data['url_slugs']) ){
            return trpHelper.array_search(lang, trp_language_cookie_data['url_slugs'] );
        } else {
            return trp_language_cookie_data['default_language'];
        }

    };

    this.get_current_dom_language = function(){
        var html_language = jQuery('html').attr('lang');
        html_language = html_language.split("-").join("_");
        return html_language;
    };


    this.ajax_get_needed_language = function() {
        jQuery.ajax({
            url: trp_language_cookie_data['trp_ald_ajax_url'],
            type: 'post',
            dataType: 'json',
            data: {
                action: 'trp_ald_get_needed_language',
                detection_method: trp_language_cookie_data['detection_method'],
                publish_languages: trp_language_cookie_data['publish_languages'],
                iso_codes: trp_language_cookie_data['iso_codes']
            },
            success: function( response ) {
                if ( response ) {
                    _this.redirect_if_needed( response );
                }else{
                    _this.redirect_if_needed( _this.get_current_dom_language() );
                }

            },
            error: function( errorThrown ){
                // make current language the needed language
                _this.redirect_if_needed( _this.get_current_dom_language() );
            }
        });
    };

    this.get_url_for_lang = function( language ){
        return jQuery( 'link[hreflang=' + language.split("_").join("-") + ']').first().attr('href');
    };

    this.is_valid_url = function ( url ) {
        if ( typeof url === 'undefined' || url === '' ){
            return false;
        }
        var starting_characters = ['#','?'];
        for (var i = 0; i < starting_characters.length; i++ ){
            if ( url.substring( 0, 1 ) === starting_characters[i] ){
                return false;
            }
        }
        return true;
    };

    this.add_event_handlers = function(){
        jQuery('body').on('click', 'a', function(e) {

            var clicked_url = jQuery(this).attr("href");
            if ( _this.is_valid_url( clicked_url ) ) {
                var clicked_language = _this.get_lang_from_url(clicked_url);
                var trp_current_language = trpCookie.getCookie(trp_language_cookie_data['cookie_name']);

                if (trp_current_language != clicked_language) {
                    trpCookie.setCookie(trp_language_cookie_data['cookie_name'], clicked_language, trp_language_cookie_data['cookie_age'], trp_language_cookie_data['cookie_path']);
                }
            }
        });
    };

    this.redirect_if_needed = function( needed_language ){
        trpCookie.setCookie( trp_language_cookie_data['cookie_name'], needed_language, trp_language_cookie_data['cookie_age'], trp_language_cookie_data['cookie_path'] );
        _this.add_event_handlers();

         if ( _this.get_current_dom_language() != needed_language ){
            url_to_redirect = _this.get_url_for_lang( needed_language );
            // redirect to needed language
            window.location.replace( url_to_redirect );
        }
    };

    this.initialize = function (){
        trpCookie = new TRP_Cookie();
        trpHelper = new TRP_Helper();
        if ( ! trpCookie.areCookiesEnabled() ){
            _this.add_event_handlers();
            return;
        }
        var language_from_cookie = trpCookie.getCookie( trp_language_cookie_data['cookie_name'] );
        if ( language_from_cookie && trpHelper.in_array( language_from_cookie, trp_language_cookie_data['publish_languages'] ) ) {
            // if cookie is set, redirect if needed
            _this.redirect_if_needed( language_from_cookie );
        }else{
            // if cookie is not set, send request to find out language and then redirect if needed
            _this.ajax_get_needed_language();
        }
    };

    _this.initialize();
}

/**
 * String manipulation functions
 */
function TRP_Helper(){

    this.trailingslashit = function ( string ){
        string = string.replace(/\/+$/,'');
        string = string + '/';
        return string;
    };

    this.ltrim = function ( string ) {
        var trimmed = string.replace(/^\s+/g, '');
        return trimmed;
    };

    this.in_array = function (needle, haystack) {
        for(var i in haystack ) {
            if(haystack[i] == needle) {
                return true;
            }
        }
        return false;
    };

    this.array_search = function(val, array) {
        if(typeof(array) === 'array' || typeof(array) === 'object') {
            var rekey;
            for(var i in array) {
                if(array[i] == val) {
                    rekey = i;
                    break;
                }
            }
            return rekey;
        }
    };

    /**
     * Update url with query string.
     *
     */
    this.update_query_string = function(key, value, url) {
        if (!url) url = window.location.href;
        var re = new RegExp("([?&])" + key + "=.*?(&|#|$)(.*)", "gi"),
            hash;

        if (re.test(url)) {
            if (typeof value !== 'undefined' && value !== null)
                return url.replace(re, '$1' + key + "=" + value + '$2$3');
            else {
                hash = url.split('#');
                url = hash[0].replace(re, '$1$3').replace(/(&|\?)$/, '');
                if (typeof hash[1] !== 'undefined' && hash[1] !== null)
                    url += '#' + hash[1];
                return url;
            }
        }
        else {
            if (typeof value !== 'undefined' && value !== null ) {
                var separator = url.indexOf('?') !== -1 ? '&' : '?';
                hash = url.split('#');
                url = hash[0] + separator + key + '=' + value;
                if (typeof hash[1] !== 'undefined' && hash[1] !== null)
                    url += '#' + hash[1];
                return url;
            }
            else
                return url;
        }
    };
}

/**
 * Manipulate cookie: set/get/erase
 */
function TRP_Cookie() {
    this.setCookie = function(cname,cvalue,exdays,cpath){
        var d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        var expires = "expires="+d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=" + cpath + ";SameSite=Lax";
    };

    this.getCookie = function(cname) {
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for(var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    };

    this.eraseCookie = function(name) {
        document.cookie = name+'=; Max-Age=-99999999;';
    };

    this.areCookiesEnabled = function(){
        if (navigator.cookieEnabled) return true;

        // set and read cookie
        document.cookie = "cookietest=1";
        var ret = document.cookie.indexOf("cookietest=") != -1;

        // delete cookie
        document.cookie = "cookietest=1; expires=Thu, 01-Jan-1970 00:00:01 GMT";

        return ret;
    }
}


jQuery( function() {
    trpDetermineLanguage = new TRP_Determine_Language();
});
