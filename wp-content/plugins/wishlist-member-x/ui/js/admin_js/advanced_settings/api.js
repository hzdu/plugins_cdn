jQuery(function($){
    $('.generate').click( generate_apikey );

    $( '.api-key-apply' ).click_to_edit().apply_cancel({require_change:false})
    .on('edit.click_to_edit', function() {
        $( this ).apply_cancel( 'show' );
    } )
    .on('apply.apply_cancel', function(e) {
        $( this ).apply_cancel( 'hide' );
        $( this ).click_to_edit( 'close' );
        $( this ).parent().save_settings({
            data: { action : "admin_actions", WishListMemberAction : "save", },
            on_success: function( me, result ) {
                var i = $( me ).find( ':input[name=WLMAPIKey]' );
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

var generate_apikey = function() {
    var r = "";
    var n = 50;
    while(n--)r+=String.fromCharCode((r=Math.random()*62|0,r+=r>9?(r<36?55:61):48));
    $(this).closest(".row").find('.api-key-apply').val(r);
    $(this).closest(".row").find('.api-key-apply').trigger('change'); //trigger change to update the text later
}