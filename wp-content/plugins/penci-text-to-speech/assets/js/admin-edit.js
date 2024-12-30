( function ( $ ) {

    "use strict";

    $( document ).ready( function () {

        /** Bulk Create Audio. */
        let to_process = [];
        let f_bulk = false;
        $( '#doaction' ).on( 'click', function( e ) {

            /** Process only 'Create Audio' action. */
            if ( $('#bulk-action-selector-top').val() !== 'speaker' ) { return; }
            e.preventDefault();

            to_process = [];
            f_bulk = true;

            /** Generate Audio foreach post/page.  */
            $( '#the-list .check-column input:checked' ).each( function() {
                to_process.push( this.value );
            } );

            if ( ! to_process.length ) { return; }
            to_process = to_process.reverse();
            let p_id = to_process.pop();
            $( '#post-' + p_id + ' .penci-texttospeech-gen' ).click();
            $( '#cb-select-' + p_id ).click();

        } );

        /** Individual Create Audio Button. */
        $( document ).on( 'click', '.penci-texttospeech-gen', function( e ) {

            let PenciTextToSpeech = window.PenciTextToSpeech;

            let $link = $( this );
            let sel = $link.parent();

            e.preventDefault();
            if ( $link.hasClass( 'is-busy' ) ) { return; }

            /** Disable links. */
            sel.find( 'a' ).addClass( 'is-busy' ).attr( 'disabled', true );

            /** Remove Create Audio icon */
            $link.find( 'img' ).remove();

            /** Current Post ID. */
            let post_id = $( this ).data( 'post-id' );

            let data = {
                action: 'gspeak',
                nonce: PenciTextToSpeech.nonce,
                post_id: post_id,
                stid: $( this ).data( 'stid' )
            };

            $.ajax( {
                type: 'POST',
                url: ajaxurl,
                data: data,
                success: function ( response ) {

                    /** Add audio player if audio file is ready. */
                    if( response.success ) {
                        sel.html( '<a href="' + PenciTextToSpeech.audio_url + 'post-' + post_id + '.mp3' + '" download="" class="dashicons dashicons-format-audio penci-texttospeech-download"></a>' );
                        sel.append( '<a href="#" class="penci-texttospeech-gen" data-post-id="' + post_id + '" style="display: none;"></a>' );
                    } else {

                        /** Show Error message to user. */
                        show_err_msg( response );
                    }

                    /** Call Next Ajax, if we have id's to process. */
                    if ( to_process.length ) {

                        let p_id = to_process.pop();
                        $( '#post-' + p_id + ' .penci-texttospeech-gen' ).click();
                        $( '#cb-select-' + p_id ).click();

                    } else if ( f_bulk ) {

                        f_bulk = false;
                        alert( 'Generation of Audio Files is Complete.' );

                    }

                },
                fail: function( response ) {

                    sel.html( '<a href="#" class="penci-texttospeech-error"></a>' );

                    show_err_msg( response );

                    /** Call Next Ajax, if we have id's to process. */
                    if ( to_process.length ) {

                        let p_id = to_process.pop();
                        $( '#post-' + p_id + ' .penci-texttospeech-gen' ).click();
                        $( '#cb-select-' + p_id ).click();

                    }

                }

            } );

            /** Show Alert with Error. */
            function show_err_msg( err ) {

                console.error( err );

                if ( err.message ) {

                    alert( 'ERROR:\n ' + err.message );

                } else if ( err.responseText ) {

                    alert( 'ERROR:\n ' + err.responseText );

                } else {

                    alert( 'ERROR:\n ' + err );

                }

            }

        } ); // END Create Audio Button.

    } ); // END Document Ready.

} ( jQuery ) );