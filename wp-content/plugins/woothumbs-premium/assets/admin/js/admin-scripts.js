(function( $, document ) {

	// variables
	var cacheKey = 'data-jckwt-galleries';

	/* on doc ready */
	$( document ).ready( function() {
		setup_variation_image_management();
		setup_bulk_save_buttons();
		setup_media_upload();
	} );

	// local cache

	var localCache = {
		/**
		 * timeout for cache in millis
		 * @type {number}
		 */
		timeout: 1800000, // 30 minutes
		/**
		 * @type {{_: number, data: {}}}
		 **/
		data: {},
		remove: function( key ) {
			delete localCache.data[ key ];
		},
		exist: function( key ) {
			return !!localCache.data[ key ] && ((new Date().getTime() - localCache.data[ key ]._) < localCache.timeout);
		},
		get: function( key ) {
			return localCache.data[ key ].data;
		},
		set: function( key, cachedData, callback ) {
			localCache.remove( key );
			localCache.data[ key ] = {
				_: new Date().getTime(),
				data: cachedData
			};
			if ( $.isFunction( callback ) ) {
				callback( cachedData );
			}
		}
	};

	// ! Bulk Save Buttons

	function setup_bulk_save_buttons() {
		$( '.saveVariationImages' ).on( 'click', function() {

			var btn = $( this ),
				$messageContainer = btn.next( '.updateMsg' ),
				updateText = btn.attr( 'data-update' ),
				updatedText = btn.attr( 'data-updated' ),
				updatingText = btn.attr( 'data-updating' ),
				errorText = btn.attr( 'data-error' ),
				varid = btn.attr( 'data-varid' ),
				images = $( btn.attr( 'data-input' ) ).val(),
				ajaxargs = {
					action: iconic_woothumbs_vars.slug + '_bulk_save',
					nonce: iconic_woothumbs_vars.nonce,
					varid: varid,
					images: images
				};

			btn.val( updatingText );

			$.post( iconic_woothumbs_vars.ajaxurl, ajaxargs, function( data ) {
				if ( data.result == 'success' ) {
					btn.val( updatedText );
				} else {
					btn.val( errorText );
				}

				$messageContainer.text( data.message );

				setTimeout( function() {
					btn.val( updateText );
					$messageContainer.text( '' );
				}, 3000 );
			} );

			return false;
		} );
	}

	// Update Selected Images

	function selectedImgs( $tableCol ) {
		// Get all selected images
		var $selectedImgs = [],
			$gallery_field = $tableCol.find( '.variation_image_gallery' );

		$tableCol.find( '.wooThumbs .image' ).each( function() {
			$selectedImgs.push( $( this ).attr( 'data-attachment_id' ) );
		} );

		// Update hidden input with chosen images
		$gallery_field.val( $selectedImgs.join( ',' ) );
		input_changed( $gallery_field );
	}

	function triggerGalleryData() {
		var $ImgUploadBtns = $( '.woocommerce_variations .upload_image_button' );

		// set an empty object to store our variation galleries by id
		localCache.set( cacheKey, {} );

		// loop through each upload image btn
		$ImgUploadBtns.each( function() {
			var $uploadBtn = $( this ),
				varId = $uploadBtn.attr( 'rel' ),
				galleries = {};

			// if the cache is already set, get the current data
			if ( localCache.exist( cacheKey ) ) {
				galleries = localCache.get( cacheKey );
			}

			if ( typeof (galleries[ varId ]) !== "undefined" && galleries[ varId ] !== null ) {
				// this gallery has been loaded before, so
				// trigger this button as ready
				$( 'body' ).trigger( 'gallery_ready', [ $uploadBtn, varId ] );
			} else {
				// Set up content to inset after variation Image
				var ajaxargs = {
					'action': 'admin_load_thumbnails',
					'nonce': iconic_woothumbs_vars.nonce,
					'varID': varId
				};

				$.ajax( {
					url: iconic_woothumbs_vars.ajaxurl,
					data: ajaxargs,
					context: this
				} ).success( function( data ) {
					// add our gallery to the galleries data
					// and add it to the cache
					galleries[ varId ] = data;
					localCache.set( cacheKey, galleries );

					// this gallery is now loaded, so,
					// trigger this button as ready
					$( 'body' ).trigger( 'gallery_ready', [ $uploadBtn, varId ] );

				} );
			}
		} );

		refreshGalleryHtml();
	}

	// insert gallery html

	function refreshGalleryHtml() {
		$( 'body' ).on( 'gallery_ready', function( event, $btn, varId ) {
			var galleries = {};

			if ( localCache.exist( cacheKey ) ) {
				galleries = localCache.get( cacheKey );
			}

			if ( typeof (galleries[ varId ]) !== "undefined" && galleries[ varId ] !== null ) {
				var galleryWrapperClass = 'wooThumbs-wrapper--' + varId;

				$( '.' + galleryWrapperClass ).remove();

				var $wooThumbs = '<div class="wooThumbs-wrapper ' + galleryWrapperClass + '">' +
				                 '<h4>Additional Images</h4>' +
				                 galleries[ varId ] +
				                 '<a href="#" class="manage_wooThumbs button">Add Additional Images</a>' +
				                 '</div>';

				$btn.after( $wooThumbs );
			}

			// Sort Images
			$( ".wooThumbs" ).sortable( {
				deactivate: function( en, ui ) {
					var $tableCol = $( ui.item ).closest( '.upload_image' );
					selectedImgs( $tableCol );
				},
				placeholder: 'ui-state-highlight'
			} );
		} );
	}

	function input_changed( $input ) {
		$input
			.closest( '.woocommerce_variation' )
			.addClass( 'variation-needs-update' );

		$( 'button.cancel-variation-changes, button.save-variation-changes' ).removeAttr( 'disabled' );

		$( '#variable_product_options' ).trigger( 'woocommerce_variations_input_changed' );
	}

	// Setup Variation Image Manager

	function setup_variation_image_management() {
		triggerGalleryData();

		var product_gallery_frame;

		$( document ).on( 'click', '.manage_wooThumbs', function( event ) {

			var $wooThumbs = $( this ).siblings( '.wooThumbs' ),
				$image_gallery_ids = $( this ).siblings( '.variation_image_gallery' ),
				attachment_ids = $image_gallery_ids.val();

			event.preventDefault();

			// Create the media frame.
			product_gallery_frame = wp.media.frames.downloadable_file = wp.media( {
				// Set the title of the modal.
				title: 'Manage Variation Images',
				button: {
					text: 'Add to variation'
				},
				library: {
					type: 'image'
				},
				multiple: true
			} );

			// When an image is selected, run a callback.
			product_gallery_frame.on( 'select', function() {
				var selection = product_gallery_frame.state().get( 'selection' );

				selection.map( function( attachment ) {
					attachment = attachment.toJSON();

					if ( attachment.id ) {
						attachment_ids = attachment_ids ? attachment_ids + "," + attachment.id : attachment.id;

						$wooThumbs.append(
							'<li class="image" data-attachment_id="' + attachment.id + '">' +
							'<a href="#" class="wooThumbs-variation-image-delete" title="Delete image"><img src="' + attachment.url + '" /></a>' +
							'</li>'
						);
					}
				} );

				$image_gallery_ids.val( attachment_ids );
				input_changed( $image_gallery_ids );
			} );

			// Finally, open the modal.
			product_gallery_frame.open();

			return false;
		} );

		// Delete Image

		$( document ).on( "mouseenter mouseleave click", '.wooThumbs-variation-image-delete', function( event ) {
			if ( event.type === 'click' ) {
				var $tableCol = $( this ).closest( '.upload_image' );
				// Remove clicked image
				$( this ).closest( 'li' ).remove();

				selectedImgs( $tableCol );
				return false;
			}

			if ( event.type === 'mouseenter' ) {
				$( this ).find( 'img' ).animate( { "opacity": 0.3 }, 150 );
			}
			if ( event.type === 'mouseleave' ) {
				$( this ).find( 'img' ).animate( { "opacity": 1 }, 150 );
			}
		} );

		// after variations load
		$( '#woocommerce-product-data' ).on( 'woocommerce_variations_loaded', triggerGalleryData );

		// Once a new variation is added
		$( '#variable_product_options' ).on( 'woocommerce_variations_added', triggerGalleryData );
	}

	/**
	 * Setup media gallery for attaching media/video to image.
	 */
	function setup_media_upload() {
		if( $( 'form#post #post_type' ).length  && 'attachment' === $( 'form#post #post_type' ).val() ) {	
			setup_media_upload_for_attachment_page();
		} else {
			setup_media_upload_for_product_and_library_page();
		}
	}
	
	function setup_media_upload_for_attachment_page( $button ) {
		$( document.body ).on( 'click', '.iconic-wt-upload-media', function( event ) {
	
			var $button = $( this ),
				media_thumbnail_id = $button.data( 'image-id' );
		
			event.preventDefault();
			
			// If the media frame already exists, reopen it.
			if ( wp.media.frames.iconic_woothumbs_media ) {
				wp.media.frames.iconic_woothumbs_media.media_thumbnail_id = media_thumbnail_id;
				wp.media.frames.iconic_woothumbs_media.open();
				return;
			}

			// Create the media frame.
			wp.media.frames.iconic_woothumbs_media = wp.media( {
				// Set the title of the modal.
				title: 'Select MP4',
				button: {
					text: 'Attach MP4'
				},
				library: {
					type: 'video/mp4'
				},
				multiple: false
			} );


			// When an image is selected, run a callback.
			wp.media.frames.iconic_woothumbs_media.on( 'select', function() {
			
				var selected_media = wp.media.frames.iconic_woothumbs_media.state().get( 'selection' ),
					$media_field = $( '#attachments-' + wp.media.frames.iconic_woothumbs_media.media_thumbnail_id + '-iconic_woothumbs_media' );
				
				selected_media.map( function( attachment ) {
					attachment = attachment.toJSON();
					$media_field.val( attachment.url ).change();
					return false;
				} );
			} );

			// Finally, open the modal.
			wp.media.frames.iconic_woothumbs_media.media_thumbnail_id = media_thumbnail_id;
			wp.media.frames.iconic_woothumbs_media.open();

			return false;
		});
	}

	function setup_media_upload_for_product_and_library_page( ) {
		$( document.body ).on( 'click', '.iconic-wt-upload-media', function( event ) {
			var $button = $( this );
				media_thumbnail_id = $button.data( 'image-id' );
			
			event.preventDefault();

			// Set original frame each time, as there's numerous places
			// to trigger opening the media library.
			wp.media.frames.original = wp.media.frame;
			
			wp.media.frames.original.close();
			// Stop watching for uploads.
			wp.media.frames.original.state().deactivate();
			
			// If the media frame already exists, reopen it.
			if ( wp.media.frames.iconic_woothumbs_media ) {
				wp.media.frames.iconic_woothumbs_media.media_thumbnail_id = media_thumbnail_id;
				wp.media.frames.iconic_woothumbs_media.open();
				return;
			}

			// Create the media frame.
			wp.media.frames.iconic_woothumbs_media = wp.media( {
				// Set the title of the modal.
				title: 'Select MP4',
				button: {
					text: 'Attach MP4'
				},
				library: {
					type: 'video/mp4'
				},
				multiple: false
			} );

			// wp.media.frames.iconic_woothumbs_media.on('all', function(e) { console.log( 'attach mp4', e); });

			// When an image is selected, run a callback.
			wp.media.frames.iconic_woothumbs_media.on( 'select', function() {
				// Open the original media library and activate watching for uploads.
				wp.media.frames.original.state().activate();
				wp.media.frames.original.open();
				// Reassign original window to the frame.
				wp.media.frame = wp.media.frames.original;
				// Select image to attach media to.
				if( wp.media.frames.original.state().get('selection') ) { // returns false in media library page.
					wp.media.frames.original.state().get('selection').add( wp.media.attachment( wp.media.frames.iconic_woothumbs_media.media_thumbnail_id ) );
				}

				var selected_media = wp.media.frames.iconic_woothumbs_media.state().get( 'selection' ),
					$media_field = $( '#attachments-' + wp.media.frames.iconic_woothumbs_media.media_thumbnail_id + '-iconic_woothumbs_media' );

				selected_media.map( function( attachment ) {
					attachment = attachment.toJSON();

					$media_field.val( attachment.url ).change();

					return false;
				} );
			} );

			// Finally, open the modal.
			wp.media.frames.iconic_woothumbs_media.media_thumbnail_id = media_thumbnail_id;
			wp.media.frames.iconic_woothumbs_media.open();

			return false;
		} );
	}
}( jQuery, document ));