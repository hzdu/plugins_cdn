/* global neveWooBooster, jQuery, FileReader, DataTransfer, localStorage */

/**
 * Holds the maximum number of allowed images for upload.
 *
 * @type {number}
 */
const allowedImagesForUpload = 5;

function advancedProductReview() {
	const formId = '#commentform';
	const reviewImageId = 'nv-upload-review-image';
	jQuery( function ( $ ) {
		$( formId ).attr( 'enctype', 'multipart/form-data' );

		/**
		 * Set the status of the upvote button
		 *
		 * @param {number} index
		 * @param {HTMLElement} item
		 */
		const setUpvoteStatus = ( index, item ) => {
			const reviewId = $( item ).data( 'review-id' );
			const reviewKey = $( item ).data( 'key' );
			const reviewVoted = localStorage.getItem(
				'nv_apr_upvote_' + reviewKey + reviewId
			);

			if ( reviewVoted === 'voted' ) {
				$( item ).attr( 'data-already-liked', 1 );
				$( item ).find( '.nv-upvote-icon' ).addClass( 'active' );
			}
		};
		$( 'a.nv-upvote-button' ).each( setUpvoteStatus );

		/**
		 * Holds the state of the Ajax call.
		 *
		 * @type {boolean}
		 */
		let ajaxInProgress = false;

		/**
		 * Request a upvote action via ajax.
		 *
		 * @param {Event} e Event
		 */
		const requestUpvote = ( e ) => {
			e.preventDefault();
			if ( ajaxInProgress === true ) {
				return;
			}
			const selector = $( e.currentTarget );
			const alreadyLiked = selector.attr( 'data-already-liked' ) === '1';

			const reviewId = selector.data( 'review-id' );
			const productId = selector.data( 'product-id' );
			const reviewKey = selector.data( 'key' );

			let hasVoted = localStorage.getItem(
				'nv_apr_upvote_' + reviewKey + reviewId
			);

			// if we already set the voted status from PHP we need to update the localStorage in case a new browser is being used.
			if ( alreadyLiked && hasVoted !== 'voted' ) {
				localStorage.setItem(
					'nv_apr_upvote_' + reviewKey + reviewId,
					'voted'
				);
				hasVoted = 'voted';
			}

			$.ajax( {
				type: 'post',
				url:
					neveWooBooster.advancedProductReview.adminAjaxUrl +
					productId +
					'/vote',
				beforeSend( xhr ) {
					ajaxInProgress = true;
					xhr.setRequestHeader(
						'X-WP-Nonce',
						neveWooBooster.advancedProductReview.adminAjaxNonce
					);
				},
				data: {
					reviewId,
					hasVoted,
				},
				success( res ) {
					ajaxInProgress = false;
					if ( res.success ) {
						const latestCount = res.latestCount;
						selector
							.find( '.nv-upvote-count' )
							.html( latestCount > 0 ? latestCount : '' );

						selector.attr(
							'data-already-liked',
							alreadyLiked ? 0 : 1
						);
						if ( alreadyLiked ) {
							localStorage.removeItem(
								'nv_apr_upvote_' + reviewKey + reviewId
							);
						} else {
							localStorage.setItem(
								'nv_apr_upvote_' + reviewKey + reviewId,
								'voted'
							);
						}
						selector
							.find( '.nv-upvote-icon' )
							.toggleClass( 'active' );
					}
				},
			} );
		};
		$( '.nv-apr-upvote-section' ).on(
			'click',
			'a.nv-upvote-button',
			requestUpvote
		);

		/**
		 * Opens the modal for the clicked image.
		 *
		 * @param {Event} e Event
		 */
		const openImagePreviewModal = ( e ) => {
			e.preventDefault();
			const reviewImageModalId = 'review-image-modal';
			const imageFull = e.currentTarget.getAttribute( 'data-image' ),
				modalWindow = document.querySelector(
					`#${ reviewImageModalId }`
				),
				modalWindowContainer = document.querySelector(
					`#${ reviewImageModalId } .nv-modal-container`
				),
				modalWindowContent = document.querySelector(
					`#${ reviewImageModalId } .nv-modal-container .nv-modal-inner-content`
				);
			const displayImage = document.createElement( 'img' );
			displayImage.style.display = 'block';
			displayImage.style.width = '100%';
			displayImage.src = imageFull;

			modalWindow.classList.add( 'open' );
			modalWindowContainer.style.height = 'auto';
			modalWindowContainer.classList.remove( 'is-loading' );

			modalWindowContent.innerHTML = displayImage.outerHTML;
		};
		$( '.nv-review-gallery' ).on(
			'click',
			'a.nv-review-image',
			openImagePreviewModal
		);

		/**
		 * Holds a list of the current selected files.
		 *
		 * @type {*[]}
		 */
		const storedFiles = [];

		/**
		 * Updates the upload preview images.
		 *
		 * @param {HTMLInputElement} input
		 */
		const updateUploadPreview = ( input ) => {
			document.getElementById( 'nv-upload-max' ).style.display = 'none';
			const ul = document.getElementById( 'nv-upload-review-list' );
			const previewImage = function ( files, index ) {
				const oFReader = new FileReader();
				oFReader.readAsDataURL( files[ index ] );

				oFReader.onload = function ( oFREvent ) {
					document.getElementById(
						'img_preview_' + index
					).style.backgroundImage =
						'url("' + oFREvent.target.result + '")';
				};
			};

			while ( ul.hasChildNodes() ) {
				ul.removeChild( ul.firstChild );
			}
			for ( let i = 0; i < input.files.length; i++ ) {
				const li = document.createElement( 'li' );
				li.classList.add( 'nv-upload-img-preview' );
				li.setAttribute( 'id', 'img_preview_' + i );
				li.innerHTML =
					'<button value="' +
					i +
					'" class="nv-apr-remove-product">×</button>';
				previewImage( input.files, i );
				ul.appendChild( li );
			}
		};

		/**
		 * Removes a File form FileList and update the HTMLInputElement.
		 *
		 * @param {Event} e Event
		 */
		const removeFromUpload = ( e ) => {
			e.preventDefault();
			const index = parseInt( e.target.value );
			const input = document.getElementById( reviewImageId );

			const dt = new DataTransfer();
			const { files } = input;

			for ( let i = 0; i < files.length; i++ ) {
				const file = files[ i ];
				if ( index === i ) storedFiles.splice( i, 1 );
				if ( index !== i ) dt.items.add( file ); // here you exclude the file. thus removing it.
			}

			input.files = dt.files;
			updateUploadPreview( input );
		};

		/**
		 * Append and add File(s) to FileList and update the HTMLInputElement.
		 *
		 * @param {Event} e Event
		 */
		const uploadChange = ( e ) => {
			if ( ! e.target.files ) return;

			const currentFiles = e.target.files;
			const currentFileListAsArray = Array.from( currentFiles );

			if (
				storedFiles.length + currentFileListAsArray.length >
				allowedImagesForUpload
			) {
				document.getElementById( 'nv-upload-max' ).style.display =
					'block';
				const dt = new DataTransfer();
				for ( let i = 0; i < storedFiles.length; i++ ) {
					const file = storedFiles[ i ];
					dt.items.add( file );
				}
				const input = document.getElementById( reviewImageId );
				input.files = dt.files;
				return;
			}

			const dt = new DataTransfer();
			for ( let i = 0; i < storedFiles.length; i++ ) {
				const file = storedFiles[ i ];
				dt.items.add( file );
			}
			for ( let i = 0; i < currentFileListAsArray.length; i++ ) {
				const file = currentFiles[ i ];
				dt.items.add( file );
				storedFiles.push( file );
			}

			const input = document.getElementById( reviewImageId );
			input.files = dt.files;

			updateUploadPreview( input );
		};

		// Trigger the input file upload
		$( '#nv-do-upload' ).click( function () {
			$( `#${ reviewImageId }` ).click();
		} );

		// Listen to changes on the file upload
		$( `#${ reviewImageId }` ).on( 'change', uploadChange );

		// Listen for click on image remove button
		$( '#nv-upload-review-list' ).on(
			'click',
			'li .nv-apr-remove-product',
			removeFromUpload
		);

		// Prevent submission if limit is exceeded.
		$( formId ).submit( function () {
			const input = document.getElementById( reviewImageId );
			if ( input.files.length > allowedImagesForUpload ) {
				return false;
			}
		} );
	} );
}

export { advancedProductReview };
