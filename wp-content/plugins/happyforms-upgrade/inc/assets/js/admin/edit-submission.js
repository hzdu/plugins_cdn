( function( $ ) {
	$( function() {
		// Remove core elements first
		$( '.misc-pub-curtime' ).first().remove();

		var $timestampdiv = $( '#happyforms-timestampdiv' ),
			$timestamp = $( '#happyforms-timestamp' ),
			stamp = $timestamp.html(),
			$timestampwrap = $timestampdiv.find( '.timestamp-wrap' ),
			$edittimestamp = $( 'a.edit-timestamp' );

		$edittimestamp.on( 'click', function( e ) {
			e.preventDefault();

			if ( $timestampdiv.is( ':hidden' ) ) {
				$timestampdiv.slideDown( 'fast', function() {
					$( 'input, select', $timestampwrap ).first().trigger( 'focus' );
				} );

				$( this ).hide();
			}
		} );

		$timestampdiv.find( '.cancel-timestamp' ).on( 'click', function( e ) {
			e.preventDefault();

			$edittimestamp.show().trigger( 'focus' );
			$timestampdiv.slideUp( 'fast' );

			$('#mm').val($('#hidden_mm').val());
			$('#jj').val($('#hidden_jj').val());
			$('#aa').val($('#hidden_aa').val());
			$('#hh').val($('#hidden_hh').val());
			$('#mn').val($('#hidden_mn').val());
			
			$timestamp.html( stamp );
		} );

		$timestampdiv.find( '.save-timestamp' ).on( 'click', function( e ) {
			var aa = $('#aa').val(), 
				mm = $('#mm').val(), 
				jj = $('#jj').val(), 
				hh = $('#hh').val(), 
				mn = $('#mn').val(),
				newD = new Date( aa, mm - 1, jj, hh, mn );

			e.preventDefault();

			if ( newD.getFullYear() != aa || (1 + newD.getMonth()) != mm || newD.getDate() != jj || newD.getMinutes() != mn ) {
				$timestampwrap.addClass( 'form-invalid' );
				return;
			} else {
				$timestampwrap.removeClass( 'form-invalid' );
			}

			$timestamp.html(
				wp.i18n.__( 'Submitted on:' ) + ' <b>' +
				/* translators: 1: Month, 2: Day, 3: Year, 4: Hour, 5: Minute. */
				wp.i18n.__( '%1$s %2$s, %3$s at %4$s:%5$s' )
					.replace( '%1$s', $( 'option[value="' + mm + '"]', '#mm' ).attr( 'data-text' ) )
					.replace( '%2$s', parseInt( jj, 10 ) )
					.replace( '%3$s', aa )
					.replace( '%4$s', ( '00' + hh ).slice( -2 ) )
					.replace( '%5$s', ( '00' + mn ).slice( -2 ) ) +
					'</b> '
			);

			$edittimestamp.show().trigger( 'focus' );
			$timestampdiv.slideUp( 'fast' );
		} );
	} );
} ) ( jQuery );