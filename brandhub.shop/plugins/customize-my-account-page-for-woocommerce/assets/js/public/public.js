/**
 * Frontend related javascript.
 */

'use strict';

( function( $, tgwc ) {

	/**
	 * Initialize the avatar image upload dropzone.
	 */
	Dropzone.autoDiscover = false;
	var $dropzone         = $( '#tgwc-file-drop-zone' );

	$dropzone.dropzone(
		{
			maxFilesize       : tgwc.avatarUploadSize,
			maxFiles          : 1,
			thumbnailWidth    : tgwc.avatarImageSize.width,
			thumbnailHeight   : tgwc.avatarImageSize.height,
			clickable         : '.tgwc-user-avatar-upload-icon',
			acceptedFiles     : 'image/*',
			dictDefaultMessage: '',
			timeout           : 30000,
			previewTemplate   : '',
			addedfile: function() {}, // Removing this callback, results in console error.
			thumbnail: function( file, dataURL ) {
				$( this.element ).find( 'img' ).attr( 'src', dataURL );
			},
			sending: function( file, xhr, formData ) {
				formData.append( 'previous_attach_id', tgwc.previousAttachId );
				$( this.element ).find( '.tgwc-progress' ).addClass( 'tgwc-progress--loading' ).removeClass( 'tgwc-display-none' );
				$( this.element ).find( '.tgwc-remove-image' ).css( 'display', 'none' );
			},
			error: function( file, errorMessage, xhr ) {
				$( this.element ).find( '.tgwc-progress' ).html( errorMessage.data );
			},
			complete: function( file ) {
				$( this.element ).find( '.tgwc-progress' ).removeClass( 'tgwc-progress--loading' ).addClass( 'tgwc-display-none' );
				this.removeFile( file );
			},
			success: function( file, xhr ) {
				tgwc.previousAttachId = xhr.data.attach_id;
				$( this.element ).find( '.tgwc-remove-image' ).css( 'display', 'block' );
			}
		}
	);

	/**
	 * Handle avatar image deletion.
	 */
	$dropzone.on(
		'click',
		'.tgwc-remove-image',
		function( e ) {
			e.preventDefault();

			var avatarUploadDropZone = Dropzone.forElement( '#' + $dropzone.attr( 'id' ) );
			avatarUploadDropZone.removeAllFiles( true );

			// Remove the previous image file.
			$.ajax(
				{
					method: 'post',
					url: tgwc.ajaxURL,
					data: {
						action: 'tgwc_avatar_upload',
						previous_attach_id: tgwc.previousAttachId,
						tgwc_avatar_upload_nonce: $dropzone.find( 'input[name="tgwc_avatar_upload_nonce"]' ).val()
					},
					beforeSend: function( xhr ){
						$dropzone.find( '.tgwc-progress' ).addClass( 'tgwc-progress--loading' ).removeClass( 'tgwc-display-none' );
					}
				}
			).done(
				function( data ) {
					$dropzone.find( 'img' ).attr( 'src', tgwc.gravatarImage );
					$dropzone.find( 'img' ).attr( 'srcset', '' );
				}
			).always(
				function() {
					$dropzone.find( '.tgwc-progress' ).removeClass( 'tgwc-progress--loading' ).addClass( 'tgwc-display-none' );
					$dropzone.find( '.tgwc-remove-image' ).hide();
				}
			);

		}
	);

	/**
	 * Scrollable tab init.
	 */
	var $nav = $( '.tgwc-woocommerce-MyAccount-navigation' ),
		$ul  = $nav.find( 'ul' );

	if ( 'tab' === tgwc.menuStyle && undefined === wp.customize ) {
		var navScroll = $ul.scrollTabs();
		navScroll     = Array.isArray( navScroll ) ? navScroll[0] : navScroll;
		navScroll.scrollSelectedIntoView();
	}

	/**
	 * Handle hover on sub menu item.
	 */
	$( 'li.woocommerce-MyAccount-navigation-link' ).on(
		'mouseover',
		function() {
			var $navItem     = $( this ),
				$submenuWrap = $( '> ul', $navItem );

			// grab the menu item's position relative to its positioned parent
			var navItemPos = $navItem.position();

			// place the submenu in the correct position relevant to the menu item
			$submenuWrap.css(
				{
					left: navItemPos.left,
				}
			);
		}
	);

	/**
	 * Handle toggle of group menu item.
	 */
	$( '.tgwc-group > a' ).on(
		'click',
		function ( e ) {
			e.preventDefault();
			if ( 'tab' !== tgwc.menuStyle ) {
				var $this  = $( this ),
					$plus  = '<svg class="tgwc-icon tgwc-icon--plus" xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 448 512\'><path fill="currentColor" d=\'M416 208H272V64c0-17.67-14.33-32-32-32h-32c-17.67 0-32 14.33-32 32v144H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h144v144c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32V304h144c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z\'></path></svg>',
					$minus = '<svg class="tgwc-icon tgwc-icon--minus" xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 448 512\'><path fill="currentColor" d=\'M416 208H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h384c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z\'></path></svg>';

				$this.next().slideToggle(
					'fast',
					function() {
						if ( $( this ).is( ':hidden' ) ) {
							$this.find( '> svg' ).replaceWith( $plus )
						} else {
							$this.find( '> svg' ).replaceWith( $minus );
						}
					}
				);
			}
		}
	)
} )( jQuery, window.tgwc );
