
jQuery( function ( $ ) {
	'use strict';

	$( '#wal_module_auto_topup_terms_and_conditions' ).change( function () {
		$( '#wal_module_auto_topup_terms_and_conditions_url,#wal_module_auto_topup_terms_and_conditions_content' ).closest( 'tr' ).hide();

		if ( this.checked ) {
			$( '#wal_module_auto_topup_terms_and_conditions_url,#wal_module_auto_topup_terms_and_conditions_content' ).closest( 'tr' ).show();
		}
	}).change();
	var WAL_Auto_Topup = {
		init: function ( ) {
			// handle auto topup renewal order details.
			$(document).on('click', '.wal-auto-topup-renewal-order-details', this.handle_auto_topup_renewal_order_details);
		}, handle_auto_topup_renewal_order_details: function (event) {
			event.preventDefault( );           
			var $this = $(event.currentTarget),
			wrapper = $('.wal-wallet-module-settings-content-auto_topup');
				
			WAL_Auto_Topup.block(wrapper);
			var data = ({
				action: 'wal_get_auto_topup_renewal_order_details_popup_content',
				order_id: $this.data('id'),
				wal_security: wal_auto_topup_params.wal_auto_topup_nonce
			});

			$.post(ajaxurl, data, function (res) {
				if (true === res.success) {
					$('#wal-auto-topup-modal').html(res.data.html);
					$(document.body).trigger('wal-enhanced-lightcase');
					$('.wal-popup').trigger('click');
				} else {
					alert(res.data.error);
				}
				WAL_Auto_Topup.unblock(wrapper);
			});
		}, block: function (id) {
			if (!WAL_Auto_Topup.is_blocked(id)) {
				$(id).addClass('processing').block({
					message: null,
					overlayCSS: {
						background: '#fff',
						opacity: 0.7
					}
				});
			}
		}, unblock: function (id) {
			$(id).removeClass('processing').unblock();
		},is_blocked : function ( id ) {
			return $( id ).is( '.processing' ) || $( id ).parents( '.processing' ).length ;
		}
	};
	WAL_Auto_Topup.init();
});
