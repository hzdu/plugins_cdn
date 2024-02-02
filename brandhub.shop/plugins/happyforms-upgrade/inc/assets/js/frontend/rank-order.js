( function ( $ ) {

	HappyForms.parts = HappyForms.parts || {};

	HappyForms.parts.rank_order = {
		init: function () {
			this.$input = $( 'select', this.$el );
            this.$ranks = $( '.happyforms-custom-select select.happyforms-select', this.$el );
			var self = this;

			this.$input.on( 'change', this.triggerChange.bind( this ) );

			$( '.happyforms-custom-select', this.$el ).each( function() {
				var $part = $( this );
				var $select = $( 'select.happyforms-select', $part );
				$select.on( 'input', self.onItemSelect.bind( self ) );
			} );
		},

		onItemSelect: function ( e ) {
			var $target = $( e.target );
			var selectedValue = $target.val();
			var previousValue = $target.data( 'prev-value' );

			if ( 'clear' == selectedValue ) {
				$( 'option[value="' + previousValue + '"]', this.$ranks ).not( $targetOption ).prop( 'disabled', '' );
				$( 'option.happyforms-rank-clear-button', $target ).prop( 'hidden', 'true' );
				$target.val( '' );
				$target.data( 'prev-value', '' );
				return false;
			}

			var $targetOption = $( 'option[value="' + selectedValue + '"]', $target );

			if ( selectedValue != previousValue ) {
				$( 'option[value="' + selectedValue + '"]', this.$ranks ).not( $targetOption ).prop( 'disabled', 'true' );

				if ( '' != previousValue ) {
					$( 'option[value="' + previousValue + '"]', this.$ranks ).not( $targetOption ).prop( 'disabled', '' );
				}

				$( 'option.happyforms-rank-clear-button', $target ).prop( 'hidden', '' );
				$target.data( 'prev-value', selectedValue );
			}
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
} ) ( jQuery );
