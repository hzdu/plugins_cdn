jQuery(function($){
    $( '.affiliateid-apply' ).apply_cancel()
    .on('apply.apply_cancel', function(e) {

        // var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
        //     '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
        //     '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
        //     '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
        //     '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
        //     '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
        // //check if URL
        // var aff_id = $( this ).parent().find(':input[name=affiliate_id]').val();
        // var e = true;
        // if ( pattern.test( aff_id ) ) {
        //     if ( aff_id.indexOf("p=") != -1 ) {
        //         aff_id = getParameterByName("p",aff_id);
        //         if ( aff_id ) {
        //             $( this ).parent().find(':input[name=affiliate_id]').val(aff_id);
        //             e = false;
        //         }
        //     }

        //     if ( e ) {
        //         $( '.wlm-message-holder' ).show_message( {
        //             message : "Invalid Affiliate ID",
        //             type : "danger"
        //         } );
        //         $( this ).parent().removeClass("has-success").addClass("has-error");
        //         return;
        //     }
        // }

        $( this ).apply_cancel( 'hide' );
        $( this ).parent().save_settings({
            data: { action : "admin_actions", WishListMemberAction : "save", },
            on_success: function( me, result ) {
                var i = $( me ).find( ':input[name=affiliate_id]' );
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

    function getParameterByName(name, url) {
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, '\\$&');
        var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, ' '));
    }
});