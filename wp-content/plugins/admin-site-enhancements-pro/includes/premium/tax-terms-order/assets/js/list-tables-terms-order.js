(function( $ ) {
	'use strict';

	$( document ).ready( function() {
		// Move "Order" button to the right of "Apply" on taxonomy term list tables.
		$( '#terms-order-button' ).appendTo( '.tablenav.top .alignleft.actions.bulkactions' );
	} );
})( jQuery );
