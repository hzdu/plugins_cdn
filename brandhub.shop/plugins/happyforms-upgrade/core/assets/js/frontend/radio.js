( function( $ ) {

	HappyForms.parts = HappyForms.parts || {};

	HappyForms.parts.radio = {
		init: function() {
			this.type = this.$el.data( 'happyforms-type' );
			this.$input = $( 'input', this.$el );
			this.$visualInput = $( 'input[type=email]', this.$el );

			this.$input.on( 'keyup', this.triggerChange.bind( this ) );
			this.$input.on( 'change', this.triggerChange.bind( this ) );
			this.$input.on( 'change', this.onRadioChange.bind( this ) );
			this.$input.on( 'focus', this.onFocus.bind( this ) );
		},

		onRadioChange: function( e ) {
			var $otherRadio = $( '.happyforms-part-option--other input[type=radio]', this.$el );
			var $label      = $otherRadio.parent();
			var $otherInput = $label.nextAll( 'input' );

			var $generalInput = $( 'input[type=text]', this.$el );
			$generalInput.prop( 'required', false );

			if ( $otherRadio.length && $otherRadio.is( ':checked' ) ) {
				if ( $( e.target )[0] === $otherRadio[0] ) {
					$otherInput.addClass( 'hf-show' ).trigger( 'focus' );
				}

				if ( '' === this.$el.data( 'happyforms-required' ) ) {
					$otherInput.prop( 'required', true );
				}
			} else {
				$generalInput.removeClass( 'hf-show' );
			}
		},

		onFocus: function( e ) {
			var $input = $( e.target );

			if ( 'text' === $input.attr( 'type' ) ) {
				$input.prevAll( 'input[type=radio]' ).prop( 'checked', true );
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
		}
	};

} )( jQuery );
