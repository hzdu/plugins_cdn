( function( $ ) {

	HappyForms.parts = HappyForms.parts || {};

	HappyForms.parts.poll = {
		init: function() {
			this.type = this.$el.data( 'happyforms-type' );
			this.$input = $( 'input', this.$el );

			this.$input.on( 'keyup', this.triggerChange.bind( this ) );
			this.$input.on( 'change', this.triggerChange.bind( this ) );

			// poll links
			$( 'button.happyforms-poll__show-results', this.$el ).on( 'click', this.onShowResultsClick.bind( this ) );
			$( 'button.happyforms-poll__back-to-poll', this.$el ).on( 'click', this.onBackToPollClick.bind( this ) );

			// other option
			this.$input.on( 'change', this.onPollOptionChange.bind( this ) );
			this.$input.on( 'focus', this.onFocus.bind( this ) );
		},

		onPollOptionChange: function( e ) {
			var otherControlType = 'radio';

			if ( this.$el.hasClass( 'happyforms-poll--allow-multiple' ) ) {
				otherControlType = 'checkbox';
			}

			var $otherControl = $( '.happyforms-part-option--other input[type='+ otherControlType +']', this.$el );
			var $label        = $otherControl.parent();
			var $otherInput   = $label.nextAll( 'input' );

			var $generalInput = $( 'input[type=text]', this.$el );
			$generalInput.prop( 'required', false );

			if ( $otherControl.length && $otherControl.is( ':checked' ) ) {
				if ( $( e.target )[0] === $otherControl[0] ) {
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
				$input.prevAll( 'input' ).prop( 'checked', true );
			}
		},

		onShowResultsClick: function( e ) {
			e.preventDefault();

			this.$el.addClass( 'show-results' );
		},

		onBackToPollClick: function( e ) {
			e.preventDefault();

			this.$el.removeClass( 'show-results' );
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
					var otherValue = ( $customInput.val() ) ? $customInput.val() : $customInput.data( 'default-value' );

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
