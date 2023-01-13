// Register eslint ignored glabals - to be revisited.
// https://github.com/woocommerce/automatewoo/issues/1212
/* global AutomateWoo, AW, CustomEvent */
/**
 * AutomateWoo Modal
 */
jQuery( function ( $ ) {
	AutomateWoo.Modal = {
		init() {
			$( document.body ).on(
				'click',
				'.js-close-automatewoo-modal',
				this.close
			);
			$( document.body ).on(
				'click',
				'.automatewoo-modal-overlay',
				this.close
			);
			$( document.body ).on(
				'click',
				'.js-open-automatewoo-modal',
				this.handle_link
			);

			$( document ).on( 'keydown', function ( e ) {
				if ( e.keyCode === 27 ) {
					AutomateWoo.Modal.close();
				}
			} );
		},

		handle_link( e ) {
			e.preventDefault();

			const $a = $( this );
			const type = $a.data( 'automatewoo-modal-type' );
			const size = $a.data( 'automatewoo-modal-size' );

			if ( type === 'ajax' ) {
				AutomateWoo.Modal.open( type, size );
				AutomateWoo.Modal.loading();

				$.post( $a.attr( 'href' ), {}, function ( response ) {
					AutomateWoo.Modal.contents( response );
				} );
			} else if ( type === 'inline' ) {
				const contents = $(
					$a.data( 'automatewoo-modal-contents' )
				).html();
				AutomateWoo.Modal.open( type, size );
				AutomateWoo.Modal.contents( contents );
			}
		},

		open( type, size ) {
			const classes = [ 'automatewoo-modal--type-' + type ];

			if ( size ) {
				classes.push( 'automatewoo-modal--size-' + size );
			}

			$( document.body )
				.addClass( 'automatewoo-modal-open' )
				.append( '<div class="automatewoo-modal-overlay"></div>' );
			$( document.body ).append(
				'<div class="automatewoo-modal ' +
					classes +
					'"><div class="automatewoo-modal__contents"><div class="automatewoo-modal__header"></div></div><div class="automatewoo-icon-close js-close-automatewoo-modal"></div></div>'
			);
			this.position();
		},

		loading() {
			$( document.body ).addClass( 'automatewoo-modal-loading' );
		},

		contents( contents ) {
			$( document.body ).removeClass( 'automatewoo-modal-loading' );
			$( '.automatewoo-modal__contents' ).html( contents );

			AW.initTooltips();

			this.position();
		},

		/**
		 * Closes modal, by changin classes on `document.body` and removing modal content and overlay elements.
		 *
		 * @fires awmodal-close on the `document.body`.
		 */
		close() {
			$( document.body ).removeClass(
				'automatewoo-modal-open automatewoo-modal-loading'
			);
			$( '.automatewoo-modal, .automatewoo-modal-overlay' ).remove();

			// Fallback to Event in the browser does not support CustomEvent, like IE.
			const eventCtor =
				typeof CustomEvent === 'undefined' ? Event : CustomEvent;
			document.body.dispatchEvent( new eventCtor( 'awmodal-close' ) );
		},

		position() {
			const $modal = $( '.automatewoo-modal' );
			const $modalBody = $( '.automatewoo-modal__body' );
			const $modalHeader = $( '.automatewoo-modal__header' );

			$modalBody.removeProp( 'style' );

			const modalHeaderHeight = $modalHeader.outerHeight();
			const modalHeight = $modal.height();
			const modalWidth = $modal.width();
			const modalBodyHeight = $modalBody.outerHeight();
			const modalContentsHeight = modalBodyHeight + modalHeaderHeight;

			$modal.css( {
				'margin-left': -modalWidth / 2,
				'margin-top': -modalHeight / 2,
			} );

			if ( modalHeight < modalContentsHeight - 5 ) {
				$modalBody.height( modalHeight - modalHeaderHeight );
			}
		},
	};

	AutomateWoo.Modal.init();
} );

// FIXME: refactor to remove this global.
// https://github.com/woocommerce/automatewoo/issues/1212
let throttle = null;

jQuery( window ).on( 'resize', function () {
	clearTimeout( throttle );
	throttle = setTimeout( function () {
		AutomateWoo.Modal.position();
	}, 50 );
} );
