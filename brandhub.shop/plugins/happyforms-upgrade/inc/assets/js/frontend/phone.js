( function( $, settings ) {

	HappyForms.parts = HappyForms.parts || {};

	HappyForms.parts.phone = {
		init: function() {
			this.type = this.$el.data( 'happyforms-type' );
			this.$input = $( '.happyforms-part__el input', this.$el );
			this.masked = this.$el.attr( 'data-mask' );
			this.prefix = '';

			this.$input.on( 'keyup', this.triggerChange.bind( this ) );
			this.$input.on( 'change', this.triggerChange.bind( this ) );
			this.$input.on( 'focus', this.onInputFocus.bind(this) );
			this.$input.on( 'blur', this.onBlur.bind(this) );

			this.onBlur();
		},

		reinit: function() {
			this.init();
		},

		isFilled: function() {
			var prefix = this.prefix;

			var filledInputs = this.$input.filter( function() {
				var value = $( this ).val().replace( prefix, '' ).trim();

				return '' !== value;
			} );

			return filledInputs.length > 0;
		},

		onBlur: function() {
			if ( '' !== this.prefix ) {
				return;
			}

			if ( this.$el.is( '.happyforms-part--label-as_placeholder' ) ) {
				if ( this.isFilled() ) {
					this.$el.addClass( 'happyforms-part--filled' );
				} else {
					this.$el.removeClass( 'happyforms-part--filled' );
				}
			}

			this.$el.removeClass( 'focus' );
		},

		serialize: function() {
			var self = this;

			var serialized = this.$input.map( function( i, input ) {
				var $input = $( input );
				var keyValue = {
					name: $input.attr( 'name' ),
					value: $input.val(),
				};

				return keyValue;
			} ).toArray();

			return serialized;
		},
	};

} )( jQuery, _happyFormsSettings.phone );
