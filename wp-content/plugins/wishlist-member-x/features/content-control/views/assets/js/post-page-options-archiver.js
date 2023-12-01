jQuery( document ).ready(
	function() {
		jQuery( '.wlm-archiver-save' ).click(
			function() {
				var $btn     = jQuery( this );
				var $message = jQuery( this ).parent().find( '.wlm-message' );
				$btn.addClass( '-disable' ).prop( 'disabled', true );
				$message.html( "Saving..." ).show();
				var data = jQuery( '.wlm-inside-archiver :input' ).serialize();
				data    += '&contentids=' + wlm_post_id;
				data    += '&action=admin_actions';
				data    += '&WishListMemberAction=set_content_archive';
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
