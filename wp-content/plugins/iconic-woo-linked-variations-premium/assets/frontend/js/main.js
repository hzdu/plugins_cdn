(function( $, document ) {

	var iconic_wlv = {

		/**
		 * Set up cache with common elements and vars.
		 */
		cache: function() {
			iconic_wlv.els = [];

			iconic_wlv.els.term_link = $( '.iconic-wlv-terms__term-content--link' );
		},

		/**
		 * Run on doc ready.
		 */
		on_ready: function() {
			iconic_wlv.cache();
			iconic_wlv.setup_term_links();
		},

		/**
		 * Setup term links.
		 */
		setup_term_links: function() {
			iconic_wlv.els.term_link
				.on( 'mouseenter', function() {
					var $link = $( this ),
						$term = $link.closest( '.iconic-wlv-terms__term' ),
						$term_label = $term.data( 'iconic-wlv-term-label'),
						$selected_term = $link.closest( 'tr' ).find( '.iconic-wlv-variations__selection' );

					$selected_term.text( $term_label );
				} )
				.on( 'mouseleave', function() {
					var $link = $( this ),
						$selected_term = $link.closest( 'tr' ).find( '.iconic-wlv-variations__selection' ),
						$original_selected_term = $selected_term.data( 'iconic-wlv-selected-term-label' );

					$selected_term.text( $original_selected_term );
				} );
		}
	};

	$( document ).ready( iconic_wlv.on_ready );

}( jQuery, document ));