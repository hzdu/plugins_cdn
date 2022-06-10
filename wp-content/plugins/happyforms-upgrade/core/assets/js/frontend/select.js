( function( $ ) {

	HappyForms.parts = HappyForms.parts || {};

	HappyForms.parts.select = {
		init: function( options ) {
			this.type = this.$el.data( 'happyforms-type' );
			this.$input = $( '[data-serialize]', this.$el );

			this.$input.on( 'change', this.triggerChange.bind( this ) );
			this.$input.on( 'blur', this.onBlur.bind( this ) );
		},

		onBlur: function() {
			var $otherinput = $( '.happyforms-part-option--other input[type=text]', this.$el );
			if ( '999' === this.$input.val() ) {
				$otherinput.addClass( 'hf-show' );
				$otherinput.focus();
			} else {
				$otherinput.removeClass( 'hf-show' );
			}
		},

		serialize: function() {
			var self = this;

			var serialized = this.$input.map( function( i, select ) {
				var $select = $( select, self.$el );
				var $customInput = 0;

				if ( 999 == $select.val() ) {
					$customInput = $( ' .happyforms-part-option--other input[type=text]', self.$el );
				}

				var value = $select.val();

				if ( null == value ) {
					value = '';
				}

				var keyValue = {
					name: $select.attr( 'name' ),
					value: value
				};

				if ( $customInput.length ) {
					var otherValue = $customInput.val();

					keyValue['value'] = [ $select.val(), otherValue ];

					keyValue['value'] = JSON.stringify( keyValue['value'] );
				}

				return keyValue;
			} ).toArray();

			return serialized;

		}
	};

} )( jQuery );
