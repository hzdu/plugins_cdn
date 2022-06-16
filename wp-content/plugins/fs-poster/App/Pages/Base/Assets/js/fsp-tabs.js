'use strict';

( function ( $ ) {

    /* 
        Handles tab actions. Work with tab id so that multiple tabs can be handled at the same time.
        Usage: .fsp-modal-tabs must have a unique ID. Tab content must have id="{tabID}_{step}" 
        and class="{tabID}-step".
    */

	let index = 0;

	if ( $( '.fsp-metabox-tab.fsp-is-active' ).data( 'tab' ) == 'fsp' )
	{
		index = 1;
	}

	$( '.fsp-modal-tabs' ).each( function (i, el) {
        const tabID = $( el ).attr( 'id' );

        $( el ).find( '.fsp-modal-tab' ).on( 'click', function () {
            if ($(this).hasClass( 'fsp-is-active' )) {
                return;
            }

            $( '.fsp-modal-tab.fsp-is-active' ).removeClass( 'fsp-is-active' );
            $(this).addClass( 'fsp-is-active' );

            const step = String($( '.fsp-modal-tab.fsp-is-active' ).data( 'step' ));

            $( `.${tabID}-step` ).hide();
            $( `#${tabID}_${step}` ).show();
        }).eq( index ).click();
    } );

    /* Open "Accounts" tab of "Add Schedule" modal on "Add Account" close */
    $( '[data-modal-close]' ).on( 'click', () => {
        if ( $( '#fspAddSchedule' ).length ) {
            $( '#fspAddSchedule' ).find( '.fsp-modal-tab' ).eq(2).click();
        }
    } );
} )( jQuery );