( function( $ ) {

	HappyForms.parts = HappyForms.parts || {};

	HappyForms.parts.title = {
		init: function( options ) {
			this.type = this.$el.data( 'happyforms-type' );
			this.$input = $( '[data-serialize]', this.$el );

			this.$input.on( 'change', this.triggerChange.bind( this ) );
			this.$input.on( 'blur', this.onBlur.bind(this) );
		},

		serialize: function() {
			var serialized = $( 'select', this.$el ).map( function( i, select ) {
				var $select = $( select );

				var value = $select.val();

				if ( null == value ) {
					value = '';
				}

				return {
					name: $select.attr( 'name' ),
					value: value,
				}
			} ).toArray();

			return serialized;
		},
	};

} )( jQuery );