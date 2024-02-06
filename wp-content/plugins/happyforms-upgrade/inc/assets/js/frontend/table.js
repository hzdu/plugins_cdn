( function( $ ) {

	HappyForms.parts = HappyForms.parts || {};

	HappyForms.parts.table = {
		isFilled: function() {
			var $rows = $( '.happyforms-table__row.happyforms-table__row--body', this.$el );

			var $filledRows = $rows.filter( function() {
				var $row = $( this );
				var $input = $( 'input:checked', $row );

				return $input.length > 0;
			} );

			return $rows.length === $filledRows.length;
		},
	};

} )( jQuery );
