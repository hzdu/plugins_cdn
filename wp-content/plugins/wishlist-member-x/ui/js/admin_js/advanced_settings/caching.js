jQuery(function($){
    $( '.cookie-prefix-apply' ).click_to_edit({is_copyable : false}).apply_cancel({require_change:false})
    .on('edit.click_to_edit', function() {
        $( this ).apply_cancel( 'show' );
    } )
    .on('apply.apply_cancel', function(e) {
        $( this ).apply_cancel( 'hide' );
        $( this ).click_to_edit( 'close' );
        $( this ).parent().save_settings({
            data: { action : "admin_actions", WishListMemberAction : "save", },
            on_success: function( me, result ) {
                var i = $( me ).find( ':input[name=CookiePrefix]' );
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
            $( this ).click_to_edit( 'close' );
    });
});