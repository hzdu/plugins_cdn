( function ( $, settings ) {

	HappyForms.parts = HappyForms.parts || {};

	HappyForms.parts.address = {
		init: function() {
			this.type = this.$el.data( 'happyforms-type' );

			this.$input = $( 'input', this.$el );

			// Validation
			this.$input.on( 'keyup', this.triggerChange.bind( this ) );
			this.$input.on( 'change', this.triggerChange.bind( this ) );
			this.$input.on( 'focus', this.onInputFocus.bind( this ) );
			this.$input.on( 'blur', this.onBlur.bind( this ) );
			this.mode = this.$el.attr('data-mode');

			if ( 'simple' !== this.mode ) {
				this.$input = $( '[data-serialize]', this.$el );
				var $visualInput = $( '.happyforms-part--address__autocomplete', this.$el );
				var $select = $( '.happyforms-custom-select-dropdown', this.$el );

				var autocompleteOptions = {
					delay: 500,
					source: settings.countries,
				};

				$visualInput.happyFormsSelect( {
					$input: this.$input,
					$select: $select,
					searchable: 'autocomplete',
					autocompleteOptions: autocompleteOptions
				});
			}

			this.onBlur();
			this.$el.trigger( 'happyforms-part-address-init' );
		},

		serialize: function() {
			var serialized = $( 'input', this.$el ).map( function( i, input ) {
				var $input = $( input );

				return {
					name: $input.attr( 'name' ),
					value: $input.val(),
				}
			} ).toArray();

			return serialized;
		},
	}

} )( jQuery, _happyFormsSettings.address );
