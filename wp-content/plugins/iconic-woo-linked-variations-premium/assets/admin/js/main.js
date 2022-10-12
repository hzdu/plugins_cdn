(function( $, document ) {

	var iconic_wlv = {

		/**
		 * Set up cache with common elements and vars.
		 */
		cache: function() {
			iconic_wlv.els = [];

			iconic_wlv.els.tooltips = $( '.woocommerce-help-tip' );
			iconic_wlv.els.attributes = $( '.iconic-wlv-attributes' );
		},

		/**
		 * Run on doc ready.
		 */
		on_ready: function() {
			iconic_wlv.cache();
			iconic_wlv.setup_tooltips();
			iconic_wlv.setup_attributes();
		},

		/**
		 * Setup tooltips.
		 */
		setup_tooltips: function() {
			var tiptip_args = {
				'attribute': 'data-tip',
				'fadeIn': 50,
				'fadeOut': 50,
				'delay': 200
			};

			iconic_wlv.els.tooltips.tipTip( tiptip_args );
		},

		/**
		 * Setup attributes.
		 */
		setup_attributes: function() {
			iconic_wlv.els.attributes.sortable( {
				handle: '.iconic-wlv-attributes__attribute-handle',
				items: '> .iconic-wlv-attributes__attribute'
			} );
		}
	};

	$( document ).ready( iconic_wlv.on_ready );

}( jQuery, document ));