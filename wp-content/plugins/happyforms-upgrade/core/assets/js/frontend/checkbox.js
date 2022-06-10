( function( $ ) {

	HappyForms.parts = HappyForms.parts || {};

	HappyForms.parts.checkbox = {
		init: function() {
			this.type = this.$el.data( 'happyforms-type' );
			this.$input = $( 'input', this.$el );

			this.$input.on( 'change', this.triggerChange.bind( this ) );
			this.$input.on( 'change', this.onCheckboxChange.bind( this ) );
			this.$input.on( 'focus', this.onFocus.bind( this ) );
		},

		onCheckboxChange: function( e ) {
			var $otherCheckbox = $( '.happyforms-part-option--other input[type=checkbox]', this.$el );
			var $label         = $otherCheckbox.parent();
			var $otherInput    = $label.nextAll( 'input' );

			var $generalInput = $( 'input[type=text]', this.$el );
			$generalInput.prop( 'required', false );

			if ( $otherCheckbox.length && $otherCheckbox.is( ':checked' ) ) {
				if ( $( e.target )[0] === $otherCheckbox[0] ) {
					$otherInput.addClass( 'hf-show' ).trigger( 'focus' );
				}

				if ( '' === this.$el.data( 'happyforms-required' ) ) {
					$otherInput.prop( 'required', true );
				}
			} else {
				$generalInput.removeClass( 'hf-show' );
			}
		},

		serialize: function() {
			var self = this;

			var serialized = this.$input.map( function( i, input ) {
				var $input = $( input );
				var $customInput = 0;

				if ( 'text' === $input.attr( 'type' ) ) {
					return;
				}

				if ( 'text' === $( self.$input[i+1] ).attr( 'type' ) ) {
					$customInput = $( self.$input[i+1] );
				}

				var keyValue = {
					name: $input.attr( 'name' ),
					value: $input.val()
				};

				if ( $customInput.length ) {
					var otherValue = $customInput.val();

					keyValue['value'] = [ $input.val(), otherValue ];

					keyValue['value'] = JSON.stringify( keyValue['value'] );
				}

				if ( ! $input.is( ':checked' ) ) {
					return;
				}

				return keyValue;
			} ).toArray();

			return serialized;
		},

		onFocus: function( e ) {
			var $input = $( e.target );

			if ( 'text' === $input.attr( 'type' ) ) {
				$input.prevAll( 'input[type=checkbox]' ).prop( 'checked', true );
			}
		},
	};

} )( jQuery );
