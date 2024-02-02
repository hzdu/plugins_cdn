( function( $, editorSettings ) {

	HappyForms.parts = HappyForms.parts || {};

	HappyForms.parts.multi_line_text = {
		init: function( options ) {
			this.$form = options.form;
			this.type = this.$el.data( 'happyforms-type' );
			this.$input = $( 'textarea', this.$el );
			this.$counter = $( '.happyforms-part__char-counter span.counter', this.$el );

			this.$input.on( 'blur', this.onBlur.bind( this ) );
			this.$input.on( 'keyup', this.triggerChange.bind( this ) );
			this.$input.on( 'change', this.triggerChange.bind( this ) );
			this.$el.on( 'keyup', this.refreshCounter.bind( this ) );
			this.refreshCounter();
			$( '.happyforms-part__char-counter' ).show();
		},

		getValueLength: function() {
			var mode = this.$input.attr( 'data-length-mode' );
			var value = this.$input.val();

			var length = value.length;

			if ( 'word' === mode ) {
				var matches = value.match( /\w+/g );
				length = matches ? matches.length : 0;
			}

			return length;
		},

		refreshCounter: function() {
			var hasLength = parseInt( this.$input.attr( 'data-length' ), 10 );

			if ( hasLength < 1 ) {
				return;
			}

			var length = this.getValueLength();
			this.$counter.text( length );
		},

		onFocus: function() {
			this.$el.addClass( 'focus' );
		},

		onBlur: function() {
			this.$el.removeClass( 'focus' );
		},

		isFilled: function() {
			return '' !== this.$input.val();
		},

		serialize: function() {
			var serialized = HappyForms.parts.base.serialize.apply( this, arguments );

			return serialized;
		}
	};

} )( jQuery );
