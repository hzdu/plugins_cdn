( function() {

	HappyForms.Antispam = {

		getHash: function( data ) {
			var hash = [];

			data.forEach( function( entry ) {
				hash.push( entry.value );
			} );

			hash = hash.join( '' ).replace( /[^\w\d]/gm, '' );
			hash = md5( hash );

			return hash;
		},

		getPlatformInfo: function() {
			var info = {
				user_agent: navigator.userAgent,
				app_version: navigator.appVersion,
				language: navigator.language || navigator.userLanguage || navigator.browserLanguage || navigator.systemLanguage,
				languages_length: navigator.languages.length,
				webdriver: navigator.webdriver ? 1 : 0,
				concurrency: navigator.hardwareConcurrency,
				outer_width: window.outerWidth,
				outer_height: window.outerHeight,
				connectionRtt: navigator.connection ? navigator.connection.rtt : -1,
			};

			var platformInfo = {};

			for ( const [key, value] of Object.entries( info ) ) {
				platformInfo[`platform_info[${ key }]`] = value;
			}

			return platformInfo;
		},

	};

} )();
