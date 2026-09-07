( function( $ ) {
	'use strict';

	if ( typeof ppAdmin === 'undefined' ) {
		return;
	}

	function getRemainingLabel( expiresAt ) {
		var remaining = expiresAt - Math.floor( Date.now() / 1000 );

		if ( remaining <= 0 ) {
			return ppAdmin.expiredLabel || ppAdmin.remainingLabel;
		}

		var days = Math.floor( remaining / 86400 );
		var hours = Math.floor( ( remaining % 86400 ) / 3600 );
		var minutes = Math.floor( ( remaining % 3600 ) / 60 );

		var duration;

		if ( days > 0 ) {
			duration = days + ( days === 1 ? ' day, ' : ' days, ' ) + hours + ( hours === 1 ? ' hour' : ' hours' );
		} else if ( hours > 0 ) {
			duration = hours + ( hours === 1 ? ' hour, ' : ' hours, ' ) + minutes + ( minutes === 1 ? ' minute' : ' minutes' );
		} else {
			minutes = Math.max( 1, minutes );
			duration = minutes + ( minutes === 1 ? ' minute' : ' minutes' );
		}

		var format = ppAdmin.expiresInFormat || 'Expires in %s';

		return format.replace( '%s', duration );
	}

	function updateExpiryDisplay( expiresAt, label ) {
		var $expiry = $( '.asenha-public-preview-expiry' );

		if ( ! $expiry.length ) {
			return;
		}

		$expiry.attr( 'data-expires-at', expiresAt );

		if ( label ) {
			$expiry.text( label );
		} else {
			$expiry.text( getRemainingLabel( expiresAt ) );
		}
	}

	function updatePreviewLink( link ) {
		$( '#public-preview a' ).attr( 'href', link );
		$( '.asenha-copy-preview-link-button' ).attr( 'data-clipboard-text', link );
	}

	function initCopyButton() {
		if ( typeof ClipboardJS === 'undefined' || typeof tippy === 'undefined' ) {
			return;
		}

		var $copyButtons = $( '.asenha-copy-preview-link-button' );

		if ( ! $copyButtons.length ) {
			return;
		}

		$copyButtons.each( function() {
			var button = this;

			if ( button._asenhaCopyTippy ) {
				button._asenhaCopyTippy.destroy();
				button._asenhaCopyTippy = null;
			}

			if ( button._asenhaCopyClipboard ) {
				button._asenhaCopyClipboard.destroy();
				button._asenhaCopyClipboard = null;
			}

			button._asenhaCopyTippy = tippy( button, {
				content: ppAdmin.copyCopiedLabel,
				placement: 'right',
				arrow: true,
				theme: 'light',
				trigger: 'click',
				onShow: function( instance ) {
					window.setTimeout( function() {
						instance.hide();
					}, 1000 );
				}
			} );

			button._asenhaCopyClipboard = new ClipboardJS( button );
		} );
	}

	function resetPreviewLink() {
		var $button = $( '.asenha-public-preview-reset' );

		$button.prop( 'disabled', true );

		$.post(
			ppAdmin.ajaxUrl,
			{
				action: ppAdmin.action,
				post_id: ppAdmin.postId,
				nonce: ppAdmin.nonce
			}
		).done( function( response ) {
			if ( response.success && response.data ) {
				updatePreviewLink( response.data.link );
				updateExpiryDisplay( response.data.expires_at, response.data.remaining_label );
				ppAdmin.link = response.data.link;
				ppAdmin.expiresAt = response.data.expires_at;
			} else {
				window.alert( ppAdmin.resetError );
			}
		} ).fail( function() {
			window.alert( ppAdmin.resetError );
		} ).always( function() {
			$button.prop( 'disabled', false );
		} );
	}

	$( document ).ready( function() {
		var expiresAt = parseInt( $( '.asenha-public-preview-expiry' ).attr( 'data-expires-at' ), 10 ) || ppAdmin.expiresAt;

		initCopyButton();

		if ( expiresAt ) {
			setInterval( function() {
				var currentExpires = parseInt( $( '.asenha-public-preview-expiry' ).attr( 'data-expires-at' ), 10 ) || expiresAt;
				updateExpiryDisplay( currentExpires );
			}, 60000 );
		}

		$( document ).on( 'click', '.asenha-public-preview-reset', function( e ) {
			e.preventDefault();

			if ( ! window.confirm( ppAdmin.confirmReset ) ) {
				return;
			}

			resetPreviewLink();
		} );
	} );

}( jQuery ) );
