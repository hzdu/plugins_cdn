/* global monsterinsights_user_journey */

'use strict';

/**
 * MonsterInsights User Journey function.
 *
 * @since 1.0.0
 */
var MonsterInsightsUserJourney = window.MonsterInsightsUserJourney || ( function( document, window ) {

	/**
	 * Public functions and properties.
	 *
	 * @since 1.0.0
	 *
	 * @type {object}
	 */
	var app = {

		/**
		 * Start the engine.
		 *
		 * @since 1.0.0
		 */
		init: function() {

			if ( ! String.prototype.startsWith ) {
				Object.defineProperty(
					String.prototype,
					'startsWith',
					{
						value: function( search, rawPos ) {
							var pos = rawPos > 0 ? rawPos | 0 : 0;
							return this.substring( pos, pos + search.length ) === search;
						},
					}
				);
			}

			var timeStamp = Math.round( Date.now() / 1000 ),
				cookie    = app.getCookie( '_monsterinsights_uj' ),
				data      = {},
				url       = window.location.href;

			if ( ! cookie && document.referrer !== '' && ! document.referrer.startsWith( window.location.origin ) ) {
				data[ timeStamp - 2 ] = document.referrer + '|#|{ReferrerPageTitle}';
			}

			url += '|#|' + document.title;

			if ( typeof monsterinsights_user_journey !== 'undefined' && monsterinsights_user_journey.page_id ) {
				url += '|#|' + Number( monsterinsights_user_journey.page_id );
			}

			if ( cookie ) {
				data = JSON.parse( cookie );
			}

			data[timeStamp] = encodeURIComponent( url );

			app.createCookie( '_monsterinsights_uj', JSON.stringify( data ), 365 );
		},

		/**
		 * Create cookie.
		 * We can't use this method from monsterinsights because this script must load on each page.
		 *
		 * @since 1.0.0
		 *
		 * @param {string} name  Cookie name.
		 * @param {string} value Cookie value.
		 * @param {string} days  Whether it should expire and when.
		 */
		createCookie: function( name, value, days ) {

			var expires = '';
			var secure = '';

			if ( monsterinsights_user_journey.is_ssl ) {
				secure = ';secure';
			}

			// If we have a days value, set it in the expiry of the cookie.
			if ( days ) {

				// If -1 is our value, set a session based cookie instead of a persistent cookie.
				if ( '-1' === days ) {
					expires = '';
				} else {
					var date = new Date();
					date.setTime( date.getTime() + ( days * 24 * 60 * 60 * 1000 ) );
					expires = ';expires=' + date.toGMTString();
				}
			} else {
				expires = ';expires=Thu, 01 Jan 1970 00:00:01 GMT';
			}

			// Write the cookie.
			document.cookie = name + '=' + value + expires + ';path=/;samesite=strict' + secure;
		},

		/**
		 * Retrieve cookie.
		 * We can't use this method from monsterinsights because this script must load on each page.
		 *
		 * @since 1.0.0
		 *
		 * @param {string} name Cookie name.
		 *
		 * @returns {string|null} Cookie value or null when it doesn't exist.
		 */
		getCookie: function( name ) {

			var nameEQ = name + '=',
				ca     = document.cookie.split( ';' );

			for ( var i = 0; i < ca.length; i++ ) {
				var c = ca[i];
				while ( ' ' === c.charAt( 0 ) ) {
					c = c.substring( 1, c.length );
				}
				if ( 0 === c.indexOf( nameEQ ) ) {
					return c.substring( nameEQ.length, c.length );
				}
			}

			return null;
		},
	};

	// Provide access to public functions/properties.
	return app;

}( document, window ) );

// Initialize.
MonsterInsightsUserJourney.init();
