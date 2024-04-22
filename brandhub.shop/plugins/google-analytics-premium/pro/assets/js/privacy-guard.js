var MonsterInsightsPrivacyGuard = {

	/**
	 * Run filter for each criteria.
	 *
	 * @param {string} pageLocation
	 * @return string
	 */
	filter: function ( pageLocation ) {
		var urlObject = new URL( pageLocation );

		this.removeCommonPIIkeys( urlObject );
		this.removeEmailAddress( urlObject );

		return urlObject.toString();
	},

	/**
	 * Add most common
	 *
	 * @return array
	 */
	commonPIIkeys: function() {
		return [
			'username',
			'fname',
			'firstname',
			'first_name',
			'lname',
			'lastname',
			'last_name',
			'name',
			'fullname',
			'full_name',
			'email',
			'address',
			'phone',
			'street',
			'road',
			'postcode',
			'zipcode',
			'avenue',
			'lat',
			'latitude',
			'lng',
			'longitude',
		];
	},

	/**
	 * Remove pre-defined keys from query string.
	 *
	 * @param {URL} urlObject
	 */
	removeCommonPIIkeys: function( urlObject ) {
		for ( var key of this.commonPIIkeys() ) {
			if ( urlObject.searchParams.has(key) ) {
				urlObject.searchParams.delete(key);
			}
		}

		// Run regex on keys. so that we can remove keys like phone1, phonenumber
		for ( var [entryKey, entryValue ] of urlObject.searchParams.entries() ) {
			for ( var commonKey of this.commonPIIkeys() ) {
				// Create regex like .*phone.*
				var regex = new RegExp( '.*' + commonKey + '.*' );
				if ( regex.test(entryKey) ) {
					urlObject.searchParams.delete( entryKey );
				}
			}
		}
	},

	/**
	 * Remove keys from query string which have email address.
	 *
	 * @param {URL} urlObject
	 */
	removeEmailAddress: function( urlObject ) {
		var regex = new RegExp('([a-z0-9_\.\-])+\@(([a-z0-9\-])+\.)+([a-z0-9]{2,7})+');

		for ( var [key, value] of urlObject.searchParams.entries() ) {
			// If value is the email remove it.
			if ( regex.test(value) ) {
				urlObject.searchParams.delete(key);
			}
		}
	},
};

/**
 * Filter query parameters.
 *
 * @return Object
 */
function MonsterInsightsPrivacyGuardFilter( excludeURL ) {
	var locations = {
		page_location: MonsterInsightsPrivacyGuard.filter( excludeURL.page_location ),
	};

	if ( excludeURL.page_referrer ) {
		locations.page_referrer = MonsterInsightsPrivacyGuard.filter( excludeURL.page_referrer );
	}

	return locations;
}
