$(function() {
	$( '.auto-insert-more-at' ).apply_cancel()
	.on('apply.apply_cancel', function(e) {
		$( this ).apply_cancel( 'hide' );
    	$( this ).parent().save_settings({
    		data: { action : "admin_actions", WishListMemberAction : "save", },
    		on_success: function( me, result ) {
    			var i = $( me ).find( ':input[name=auto_insert_more_at]' );
    			i.data( 'initial', i.val() );
    		},
    		on_done: function( me, result ) {
    			$( '.wlm-message-holder' ).show_message( {
    				message : result.msg,
    				type : result.msg_type
    			} );
    		}
    	});
	})
	.on('cancel.apply_cancel', function(e) {
			$( this ).val( $( this ).data( 'initial' ) ).trigger( 'change' );
	});

	$( ':input[name=auto_insert_more_at]' ).change(function() {
		$( this ).val( parseInt ('0' + $(this).val() ) );
	}).change();
});