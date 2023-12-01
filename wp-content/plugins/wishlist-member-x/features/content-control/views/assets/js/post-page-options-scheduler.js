jQuery( document ).ready(
	function() {

		jQuery( '.scheddays' ).each(
			function(i,el){
				if ( jQuery( this ).val() <= 0 ) {
					jQuery( this ).val( "" );
					jQuery( this ).parent().parent().find( ".hidedays" ).val( "" );
					jQuery( this ).parent().parent().find( ".hidedays" ).addClass( '-disable' ).prop( "disabled", true );
				} else {
					jQuery( this ).parent().parent().find( ".hidedays" ).removeClass( '-disable' ).prop( "disabled", false );
				}
			}
		);

		jQuery( '.scheddays' ).change(
			function() {
				if ( jQuery( this ).val() <= 0 ) {
					jQuery( this ).val( "" );
					jQuery( this ).parent().parent().find( ".hidedays" ).val( "" );
					jQuery( this ).parent().parent().find( ".hidedays" ).addClass( '-disable' ).prop( "disabled", true );
				} else {
					jQuery( this ).parent().parent().find( ".hidedays" ).removeClass( '-disable' ).prop( "disabled", false );
				}
			}
		);

		jQuery( '.wlm-scheduler-save' ).click(
			function() {
				var $btn     = jQuery( this );
				var $message = jQuery( this ).parent().find( '.wlm-message' );
				$btn.addClass( '-disable' ).prop( 'disabled', true );
				$message.html( "Saving..." ).show();
				var data = jQuery( '.wlm-inside-scheduler :input' ).serialize();
				data    += '&contentids=' + wlm_post_id;
				data    += '&action=admin_actions';
				data    += '&WishListMemberAction=set_content_schedule';
				data    += '&post_option=1';

				jQuery.post(
					ajaxurl,
					data,
					function( result ) {
						var result_data = "";
						if ( result != 0 || result != "" ) {
							// try parsing result
							try {
								result_data = wlm.json_parse( result );
							} catch (e) {
								result_data = result;
							}
						}

						$btn.removeClass( '-disable' ).prop( 'disabled', false );
						$message.html( result_data.msg ).delay( 4000 ).fadeOut( 500 );
					}
				);
				return false;
			}
		);
	}
);
