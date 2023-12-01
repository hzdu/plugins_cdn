var current_el = null;
jQuery(function($){
    $( '.rss-secret-key-apply' ).click_to_edit().apply_cancel( { require_change: false } )
    .on('edit.click_to_edit', function() {
        $( this ).apply_cancel( 'show' );
    } )
    .on('apply.apply_cancel', function(e) {
        $( this ).apply_cancel( 'hide' );
        $( this ).click_to_edit( 'close' );
        $( this ).parent().save_settings({
            data: { action : "admin_actions", WishListMemberAction : "save", },
            on_success: function( me, result ) {
                var i = $( me ).find( ':input[name=rss_secret_key]' );
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
            $( this ).apply_cancel( 'hide' );
    });

    $('.rss-ip-limit').apply_cancel()
    .on('apply.apply_cancel', function(e) {
        $( this ).parent().save_settings({
            data: { action: 'admin_actions', 'WishListMemberAction' : 'save' },
            on_done: function( me, result ) {
                $( '.wlm-message-holder' ).show_message( {
                    message : result.msg,
                    type : result.msg_type
                } );
                var i = $( '.rss-ip-limit' ).first();
                i.data( 'initial', i.val() );
            }
        })
    })
    .on('cancel.apply_cancel', function(e) {
        var i = $( '.rss-ip-limit' ).first();
        i.val( i.data( 'initial' ) );     
    });
});