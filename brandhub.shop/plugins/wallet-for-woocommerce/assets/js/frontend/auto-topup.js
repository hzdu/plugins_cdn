/* global wal_auto_topup_params */

jQuery( function ( $ ) {
	'use strict';

	$( 'form.wal-auto-topup-form #wal_auto_topup_amount' ).change( function () {
		if ( 'user-defined' === this.value ) {
			$( this ).closest( 'p' ).find( 'input[name="wal_auto_topup_custom_amount"]' ).show();
		} else {
			$( this ).closest( 'p' ).find( 'input[name="wal_auto_topup_custom_amount"]' ).hide();
		}
	} ).change();

	$( 'form.wal-auto-topup-form #wal_auto_topup_threshold_amount' ).change( function () {
		if ( 'user-defined' === this.value ) {
			$( this ).closest( 'p' ).find( 'input[name="wal_auto_topup_threshold_custom_amount"]' ).show();
		} else {
			$( this ).closest( 'p' ).find( 'input[name="wal_auto_topup_threshold_custom_amount"]' ).hide();
		}
	} ).change();	
} );
