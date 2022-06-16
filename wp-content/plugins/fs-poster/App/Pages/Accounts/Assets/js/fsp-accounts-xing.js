'use strict';

( function ( $ ) {

	let doc = $( document );

	doc.ready( function () {
		doc.on( 'click', '.fsp-modal-footer > #fspModalAddButton', function () {
			let data = {
				login: $( '#fspCookie_login' ).val().trim(),
				csrf_token: $( '#fspCookie_csrfToken' ).val().trim(),
				csrf_checksum: $( '#fspCookie_csrfChecksum' ).val().trim(),
				proxy: $( '#fspProxy' ).val().trim()
			};

			FSPoster.ajax( 'add_xing_account', data, function () {
				accountAdded();
			} );
		} ).on( 'change', '.fsp-xing-group-forum', function () {
			let fs_xing_group_selected_forum = $( this ).val(),
				fs_xing_group_id 			 = $( this ).parent().parent().data( 'id' );

			FSPoster.ajax( 'change_xing_group_selected_forum', { fs_xing_group_selected_forum, fs_xing_group_id }, function ( result ) {
				FSPoster.toast( result[ 'msg' ], 'success' );
			} );
		} ).on('click', '.fsp-modal-footer > #fspModalUpdateCookiesButton', function () {
			let data = {
				login: $( '#fspCookie_login' ).val().trim(),
				csrf_token: $( '#fspCookie_csrfToken' ).val().trim(),
				csrf_checksum: $( '#fspCookie_csrfChecksum' ).val().trim(),
				account_id: $( '#account_to_update' ).val().trim(),
				proxy: $( '#fspProxy' ).val().trim()
			};

			FSPoster.ajax( 'update_xing_account_cookie', data, function () {
				accountUpdated();
			} );
		} );
	} );
} )( jQuery );