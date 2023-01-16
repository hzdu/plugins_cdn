'use strict';

( function ( $ ) {
	let doc = $( document );

	doc.ready( () => {
		doc.on( 'click', '.fsp-modal-footer > #fspModalAddButtonXing', function () {
			FSPoster.ajax( 'add_xing_account', {
				login: ( $( '#fspCookie_login' ).val() || '' ).trim(),
				csrf_token: ( $( '#fspCookie_csrfToken' ).val() || '' ).trim(),
				csrf_checksum: ( $( '#fspCookie_csrfChecksum' ).val() || '' ).trim(),
				proxy: ( $( '#fspProxy' ).val() || '' ).trim()
			}, () => accountAdded() );
		} ).on('click', '.fsp-modal-footer > #fspModalUpdateCookiesButtonXing', function () {
			FSPoster.ajax( 'update_xing_account', {
				login: ( $( '#fspCookie_login' ).val() || '' ).trim(),
				csrf_token: ( $( '#fspCookie_csrfToken' ).val() || '' ).trim(),
				csrf_checksum: ( $( '#fspCookie_csrfChecksum' ).val() || '' ).trim(),
				account_id: ( $( '#account_to_update' ).val() || '' ).trim(),
				proxy: ( $( '#fspProxy' ).val() || '' ).trim()
			}, () => accountUpdated() );
		} ).on( 'change', '.fsp-xing-group-forum', function () {
			let fs_xing_group_selected_forum = $( this ).val(),
				fs_xing_group_id 			 = $( this ).parent().parent().data( 'id' );

			FSPoster.ajax( 'change_xing_group_selected_forum', { fs_xing_group_selected_forum, fs_xing_group_id }, function ( result ) {
				FSPoster.toast( result[ 'msg' ], 'success' );
			} );
		} );
	} );
} )( jQuery );