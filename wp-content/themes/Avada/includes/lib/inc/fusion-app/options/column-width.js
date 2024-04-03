/* global */
var FusionPageBuilder = FusionPageBuilder || {};
FusionPageBuilder.options = FusionPageBuilder.options || {};

FusionPageBuilder.options.fusionColumnWidth = {

	optionColumnWidth: function( $element ) {
		var $columnWidth;
		$columnWidth		= $element.find( '.fusion-form-column-width' );

		$columnWidth.each( function() {
			// Init
			var $colEl 			= jQuery( this ),
				value 			= $colEl.find( '.width-value' ).val(),
				fractionToDecimal;

			fractionToDecimal = function( newValue ) {
				var fraction;

				if ( ! newValue.includes( '_' ) ) {
					return '';
				}

				fraction = newValue.split( '_' );
				if ( '' === newValue ) {
					return 0;
				}
				return ( parseFloat( fraction[ 0 ] ) / parseFloat( fraction[ 1 ] ) * 100 ).toFixed( 2 );
			};

			// Check if it's fraction else initialize custom width.
			if ( ! value || value.includes( '_' ) || 'auto' === value ) {
				$colEl.data( 'active', 'ui-buttons' );
				$colEl.find( '.ui-input, .width-custom' ).hide();
				$colEl.find( '.ui-button[data-value="' + value + '"]' ).addClass( 'ui-state-active' );
				// Update input values
				$colEl.find( '.ui-input input' ).val( fractionToDecimal( value ) );
			} else {
				$colEl.data( 'active', 'ui-input' );
				$colEl.find( '.ui-buttons, .width-default' ).hide();
			}

			// Event listeners.
			$colEl.on( 'click', '.column-width-toggle', function() {
				$colEl.find( '.ui-input, .ui-buttons, a .label' ).toggle();
			} );

			$colEl.on( 'click', '.ui-button', function( event ) {
				var $widthBtn 		= jQuery( this ),
					width			= $widthBtn.data( 'value' );

				if ( jQuery( this ).hasClass( 'default' ) && event ) {
					event.preventDefault();
				}

				// Update Slider values
				$colEl.find( '.ui-input input' ).val( fractionToDecimal( width ) );

				$colEl.find( '.ui-button' ).removeClass( 'ui-state-active' );
				$widthBtn.addClass( 'ui-state-active' );
				$colEl.find( '.width-value' ).val( width ).trigger( 'change' );
			} );

			$colEl.on( 'change', '.ui-input input', function() {
				var $widthInput = jQuery( this ),
					width		= $widthInput.val();

				// Update Slider values.
				$colEl.find( '.ui-button' ).removeClass( 'ui-state-active' );
				$colEl.find( '.width-value' ).val( width ).trigger( 'change' );
			} );
		} );
	}
};
