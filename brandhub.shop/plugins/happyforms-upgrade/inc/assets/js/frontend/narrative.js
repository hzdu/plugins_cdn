( function( $ ) {

	HappyForms.parts = HappyForms.parts || {};

	HappyForms.parts.narrative = {
		isFilled: function() {
			var emptyInputs = this.$input.filter( function() {
				return '' === $( this ).val();
			} );

			return 0 === emptyInputs.length;
		},
	};

} )( jQuery );