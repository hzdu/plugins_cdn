( function( $, settings ) {
	$( function() {

		var HappyFormsGoogleGeocoding = function ( el ) {
			this.el = el;
			this.$el = $( el );

			this.init();
		}

		HappyFormsGoogleGeocoding.prototype.init = function() {
			this.$fullAddress = $( '.address-full', this.$el );
			this.$country = $( '.address-country', this.$el );
			this.$city = $( '.address-city', this.$el );

			// Geolocation
			this.$geolocation = $( '.happyforms-address-geolocate', this.$el );

			if ( this.$geolocation.length ) {
				if ( navigator.geolocation ) {
					this.$geolocation.on( 'click', this.geolocate.bind( this ) );
				} else {
					this.$geolocation.hide();
				}
			}
		},

		HappyFormsGoogleGeocoding.prototype.geolocate = function( e ) {
			e.preventDefault();

			this.$geolocation.prop( 'disabled', true );
			this.$geolocation.removeClass( 'happyforms-address-geolocate--default' );
			this.$geolocation.addClass( 'happyforms-address-geolocate--fetching' );

			navigator.geolocation.getCurrentPosition( this.geolocationCallback.bind( this ) );
		},

		HappyFormsGoogleGeocoding.prototype.geolocationCallback = function( position ) {
			var data = { action: settings.actionGeocode,
				latitude: position.coords.latitude,
				longitude: position.coords.longitude, }
			$.get( settings.url, data, this.applyGeolocationResults.bind( this ) );
		},

		HappyFormsGoogleGeocoding.prototype.getFullAddress = function( results ) {
			return results.formatted_address;
		},

		HappyFormsGoogleGeocoding.prototype.getCountry = function( results ) {
			if ( ! results.address_components ) {
				return '';
			}

			var country = results.address_components.filter( function( component ) {
				return component.types.indexOf( 'country' ) >= 0;
			} );

			country = country.length > 0 ? country[0].long_name : '';

			return country;
		},

		HappyFormsGoogleGeocoding.prototype.getCity = function( results ) {
			if ( ! results.address_components ) {
				return '';
			}

			var city = results.address_components.filter( function( component ) {
				return component.types.indexOf( 'locality' ) >= 0;
			} );

			city = city.length > 0 ? city[0].long_name : '';

			return city;
		},

		HappyFormsGoogleGeocoding.prototype.applyGeolocationResults = function( results ) {
			var fullAddress = this.getFullAddress( results );
			var country = this.getCountry( results );
			var city = this.getCity( results );

			this.$fullAddress.val( fullAddress ).trigger('change');
			this.$country.val( country ).trigger('change');
			this.$city.val( city ).trigger('change');

			this.$geolocation.removeClass( 'happyforms-address-geolocate--fetching' );
			this.$geolocation.addClass( 'happyforms-address-geolocate--default' );
			this.$geolocation.prop( 'disabled', false );
		},

		$.fn.happyFormsGoogleGeocoding = function( method ) {
			if( 'string' === typeof method ){
				var instance = $( this ).data( 'HappyFormsGoogleGeocoding' );

				if( instance && instance[method] ) {
					return instance[method].apply( instance, Array.prototype.slice.call( arguments, 1 ) );
				}
			} else {
				this.each( function() {
					$.data( this, 'HappyFormsGoogleGeocoding', new HappyFormsGoogleGeocoding( this ) );
				} );
			}
		}

		$( document ).on( 'happyforms-part-address-init', '.happyforms-part--address-has-geolocation', function(){
			$( this ).happyFormsGoogleGeocoding();
		} );
	} );
} ) ( jQuery, _happyFormsSettings.googleGeocoding );