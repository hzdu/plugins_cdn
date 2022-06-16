'use strict';

( function ( $ ) {
	let doc = $( document );

	doc.ready( function () {
		let frame = wp.media( {
			title: fsp__( 'Select or upload image' ), button: {
				text: fsp__( 'Use this media' )
			}, multiple: false, library: {
				type: 'image'
			}
		} );

		let saveID = FSPObject.saveID;

		frame.on( 'select', function () {
			var attachment = frame.state().get( 'selection' ).first().toJSON();

			$( '#imageID' ).val( attachment.id );
			$( '#imageShow' ).removeClass( 'fsp-hide' ).data( 'id', attachment.id ).children( 'img' ).attr( 'src', attachment.url );
			$( '#wpMediaBtn, #fspShareURL' ).addClass( 'fsp-hide' );
		} );

		$( '#wpMediaBtn' ).click( function ( event ) {
			frame.open();
		} );

		$( '.saveBtn,.saveBtnNew' ).click( function () {
			savePost( false, savePostCallback, $( this ).hasClass( 'saveBtnNew' ) );
		} );

		$( '#closeImg' ).click( function () {
			$( '#imageShow' ).addClass( 'fsp-hide' ).children( 'img' ).attr( 'src', '' ).data( 'id', 0 );
			$( '#wpMediaBtn, #fspShareURL' ).removeClass( 'fsp-hide' );
		} );

		function savePost ( tmp, callback, saveAndNew = false, isSchedule = false )
		{
			let is_empty = true;
			var link = $( '.link_url' ).val().trim(), message = {},
				image = $( '#imageShow' ).data( 'id' );

			var title = $( '#fspPostTitle' ).val().trim();

			is_empty = link === '' && image === '';

			$( '.message_box' ).each( function () {
				let m_val = $( this ).val().trim();
				is_empty = m_val === '' && is_empty;
				message[ $( this ).data( 'sn-id' ) ] = m_val;
			} );

			var save = function () {

				var nodes = [];
				$( '.fsp-metabox-accounts input[name=\'share_on_nodes[]\']' ).each( function () {
					nodes.push( $( this ).val() );
				} );

				FSPoster.ajax( 'manual_share_save', {
					'id': saveID,
					'title': title,
					'link': link,
					'message': message,
					'image': image,
					'nodes': nodes,
					'tmp': tmp ? 1 : 0
				}, function ( result ) {
					saveID = result[ 'id' ];

					var url = window.location.href;
					if ( url.indexOf( 'post_id=' ) > -1 )
					{
						url = url.replace( /post_id\=([0-9]+)/, 'post_id=' + saveID, url );
					}
					else
					{
						url += ( url.indexOf( '?' ) > -1 ? '&' : '?' ) + 'post_id=' + saveID;
					}

					window.history.pushState( '', '', url );

					if ( typeof callback === 'function' )
					{
						callback( saveAndNew );
					}
				} );
			};

			let schedule_message = isSchedule ? 'The post needs to be saved for scheduling. ' : '';

			if ( title === '' && is_empty && ! tmp )
			{
				FSPoster.toast( fsp__( schedule_message + 'A title, a link, an image, or a custom message is required to save it as a post.' ), 'warning' );
			}
			else if ( title === '' && ! tmp )
			{
				FSPoster.confirm( fsp__( schedule_message + 'Are you sure to save the post name as "Untitled"?' ), function () {
					save();
				}, 'fas fa-question', fsp__( 'Confirm' ), function () {

				} );
			}
			else if ( is_empty && tmp )
			{
				FSPoster.toast( 'There is no link, image, or custom message to share.', 'warning' );
			}
			else
			{
				save();
			}

		}

		function savePostCallback ( saveAndNew )
		{
			FSPoster.toast( 'Saved successfully!', 'success' );

			if ( saveAndNew )
			{
				window.location.href = 'admin.php?page=fs-poster-share';
			}
			else
			{
				FSPoster.ajax( 'get_fs_posts', {}, function ( res ) {
					$( '#fspFsPosts' ).html( FSPoster.htmlspecialchars_decode( res[ 'html' ] ) );
					$( '.fsp-title-count' ).text( res[ 'count' ] );
				} );
			}
		}

		// direct share tab shcedule button
		$( '.schedule_button' ).click( function () {
			savePost( false, function () {
				let nodes = [];

				$( '.fsp-metabox-accounts input[name="share_on_nodes[]"]' ).each( function () {
					nodes.push( $( this ).val() );
				} );

				FSPoster.loadModal( 'add_schedule', {
					'post_ids': saveID,
					'nodes': nodes,
					'is_direct_share_tab': 1
				} );
			}, false, true );
		} );

		$( '.shareNowBtn' ).click( function () {
			savePost( true, function () {
				var nodes = [];
				$( '.fsp-metabox-accounts input[name=\'share_on_nodes[]\']' ).each( function () {
					nodes.push( $( this ).val() );
				} );

				if ( nodes.length == 0 )
				{
					FSPoster.toast( fsp__( 'No selected account!' ), 'warning' );
					return;
				}

				FSPoster.ajax( 'share_saved_post', {
					'post_id': saveID, 'nodes': nodes, 'background': 0, 'shared_from': 'direct_share'
				}, function () {
					FSPoster.loadModal( 'share_feeds', { 'post_id': saveID }, true );
				} );
			} );
		} );

		$( '.delete_post_btn' ).click( function () {
			var tr = $( this ).closest( '.fsp-share-post' ), post_id = tr.data( 'id' );

			FSPoster.confirm( 'Are you sure you want to delete?', function () {
				FSPoster.ajax( 'manual_share_delete', { 'id': post_id }, function () {
					tr.fadeOut( 500, function () {
						if ( post_id === saveID )
						{
							window.location.href = '?page=fs-poster-share';
						}
						$( this ).remove();
					} );
				} );
			} );
		} );

		$( '.message_box' ).on( 'input, keyup', function () {
			let sn = $( this ).data( 'sn-id' );

			$( `[data-character-counter="${ sn }"]` ).text( $( this ).val().length );
		} ).trigger( 'keyup' );

		$( '#fspClearSavedPosts' ).on( 'click', function () {
			FSPoster.confirm( fsp__( 'Are you sure you want to clear saved posts?' ), function () {
				FSPoster.ajax( 'fs_clear_saved_posts', {}, function () {
					window.location.reload();
				} );
			} );
		} );
	} );
} )( jQuery );
