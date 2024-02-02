( function( $, settings ) {
	$( function() {
		var HappyFormsGooglePlaces = function( el ) {
			this.el = el;
			this.$el = $( el );

			this.init();
		}

		HappyFormsGooglePlaces.prototype.init = function() {
			this.$input = $( 'input', this.$el );
			this.mode = this.$el.attr('data-mode');
			this.autocomplete = this.$el.data('google-autocomplete');


			var $input = $( '[data-serialize]', this.$el );
			var $visualInput = $( '.happyforms-part--address__autocomplete', this.$el );
			var $select = $( '.happyforms-custom-select-dropdown', this.$el );

			var autocompleteOptions = {
				delay: 500,
				source: settings.actionAutocomplete,
				url: settings.url,
			};

			$visualInput.happyFormsSelect( {
				$input: $input,
				$select: $select,
				searchable: 'autocomplete',
				autocompleteOptions: autocompleteOptions
			});
		}

		$.fn.happyFormsGooglePlaces = function( method ) {
			if ( 'string' === typeof method ) {
				var instance = $( this ).data( 'HappyFormsGooglePlaces' );

				if ( instance && instance[method] ) {
					return instance[method].apply( instance, Array.prototype.slice.call( arguments, 1 ) );
				}
			} else {
				this.each( function() {
					$.data( this, 'HappyFormsGooglePlaces', new HappyFormsGooglePlaces( this ) );
				} );
			}
		}

		$( document ).on( 'happyforms-part-address-init', '.happyforms-part--address-googleplaces', function() {
			$( this ).happyFormsGooglePlaces();
		} );
	} );
} ) ( jQuery, _happyFormsSettings.googlePlaces );
