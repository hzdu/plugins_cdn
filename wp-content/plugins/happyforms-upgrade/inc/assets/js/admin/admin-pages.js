( function( $, settings ) {
	$( document ).on( 'keydown', 'form input[type=text], form input[type=email], form input[type=password], form textarea', function( e ) {
		var $form = $( e.target ).parents( 'form' );

		if ( 'Tab' === e.key ) {
			return;
		}

		$form.trigger( 'happyforms.enable' );
	} );

	$( document ).on( 'click', 'form input[type=checkbox]', function( e ) {
		var $form = $( e.target ).parents( 'form' );

		$form.trigger( 'happyforms.enable' );
	} );

	$( document ).on( 'change', 'form select', function( e ) {
		var $form = $( e.target ).parents( 'form' );

		$form.trigger( 'happyforms.enable' );
	} );

	$( document ).on( 'submit', '#happyforms-settings-screen form.hf-ajax-submit', function( e ) {
		e.preventDefault();

		var $form    = $( e.target );
		var $wrapper = $form.parent();
		var $notices = $( '.happyforms-settings-notices', $wrapper );
		var $spinner = $( '.spinner', $wrapper );
		var $submit  = $( 'input[type=submit]', $wrapper );

		$submit.prop( 'disabled', false );
		$form.trigger( 'happyforms.disable' );
		$spinner.css( 'visibility', 'visible' );

		$.post( ajaxurl, $form.serialize(), function( response ) {
			$submit.removeAttr( 'disabled' );
			$spinner.css( 'visibility', 'hidden' );

			if ( $form.hasClass( 'happyforms-updater-credentials' ) ) {
				$wrapper.html( response );

				return;
			}

			if ( response.hasOwnProperty( 'url' ) && response.url ) {
				window.location.href = response.url;
			} else {
				var data = response.data;

				if ( data.hasOwnProperty( 'html' ) && data.html ) {
					var $html = $( data.html );

					if ( $( 'form', $html ).length ) {
						$form.replaceWith( data.html );
						$form = $( data.html );
					}
				}

				if ( data.hasOwnProperty( 'message' ) && data.message ) {
					var $notice = $( '<div />' ).addClass( 'notice' );

					var $p = $( '<p />' );
					$p.text( data.message ).appendTo( $notice );

					if ( response.success ) {
						$notice.addClass( 'notice-success' );
					} else {
						$notice.addClass( 'error' );
					}

					$notices.html( '' ).show();
					$notice.appendTo( $notices );
				}

				$form.trigger( 'happyforms.enable' );
			}
		} );
	} );

	$( document ).on( 'submit', '#happyforms-settings-screen form#hf-test-email', function( e ) {
		e.preventDefault();

		var $form    = $( e.target );
		var $wrapper = $form.parent();
		var $notices = $( '.happyforms-email-test-notices', $wrapper );
		var $spinner = $( '.spinner', $wrapper );
		var $submit  = $( 'input[type=submit]', $wrapper );

		$submit.prop( 'disabled', false );
		$form.trigger( 'happyforms.disable' );
		$spinner.css( 'visibility', 'visible' );

		$.post( ajaxurl, $form.serialize(), function( response ) {
			$submit.removeAttr( 'disabled' );
			$spinner.css( 'visibility', 'hidden' );

			var data = response.data;

			if ( data.hasOwnProperty( 'html' ) && data.html ) {
				var $html = $( data.html );

				if ( $( 'form', $html ).length ) {
					$form.replaceWith( data.html );
					$form = $( data.html );
				}
			}

			if ( data.hasOwnProperty( 'message' ) && data.message ) {
				var $notice = $( '<div />' ).addClass( 'notice' );

				var $p = $( '<p />' );
				$p.text( data.message ).appendTo( $notice );

				if ( response.success ) {
					$notice.addClass( 'notice-success' );
				} else {
					$notice.addClass( 'error' );
				}

				$notices.html( '' ).show();
				$notice.appendTo( $notices );
			}

			$form.trigger( 'happyforms.enable' );
		} );
	} );

	$( document ).on( 'click', '.hf-hide-pw', function( e ) {
		e.preventDefault();

		var $button = $( e.target ).closest( 'button' );
		var $input  = $button.prev();
		var $icon   = $( '> .dashicons', $button );

		$input.trigger( 'click' );

		setTimeout( function() {
			$input.trigger( 'select' );
		}, 100 );

		var revealIconClass = 'dashicons-visibility';
		var hideIconClass   = 'dashicons-hidden';

		if ( 'password' === $input.attr( 'type' ) ) {
			$button.attr( 'aria-label', $button.attr( 'data-label-hide' ) );
			$input.attr( 'type', 'text' );
			$icon.removeClass( revealIconClass ).addClass( hideIconClass );
		} else {
			$button.attr( 'aria-label', $button.attr( 'data-label-show' ) );
			$input.attr( 'type', 'password' );
			$icon.removeClass( hideIconClass ).addClass( revealIconClass );
		}
	} );
} ) ( jQuery, _happyFormsAdminPagesConfig );
