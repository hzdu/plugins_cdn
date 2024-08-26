// Reference: https://plugins.trac.wordpress.org/browser/add-dashboard-columns/tags/2.0.0/assets/add-dashboard-columns.js
jQuery( function( $ ) {
	var enableSortable = function() {
		$( '.empty-container' ).removeClass( 'empty-container' );
	};
	enableSortable();
	$( 'input[name="screen_columns"]' ).on( 'change', enableSortable );
	$( '.meta-box-sortables' ).on( 'sortactivate', function( event, ui ) {
		enableSortable();
	} );
} );