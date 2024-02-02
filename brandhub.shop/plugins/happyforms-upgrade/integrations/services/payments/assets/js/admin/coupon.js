( function( $ ) {
	var addingCoupon = false;

	$( '#the-list' ).on( 'click', '.delete-coupon', function() {
		var t = $(this), tr = t.parents('tr'), r = true, data;

		if ( 'undefined' != showNotice )
			r = showNotice.warn();

		if ( r ) {
			data = t.attr('href').replace(/[^?]*\?/, '');

			$.post( ajaxurl, data, function ( r ) {
				if ( '1' == r ) {
					$('#ajax-response').empty();
					tr.fadeOut('normal', function(){ tr.remove(); });
				} else {
					$('#ajax-response').empty().append('<div class="error"><p>' + wp.i18n.__( 'Something went wrong.' ) + '</p></div>');
					tr.children().css('backgroundColor', '');
				}
			} );
			tr.children().css('backgroundColor', '#f33');
		}

		return false;
	});

	$( '#submit' ).on( 'click', function() {
		var form = $( this ).parents( 'form' );

		if ( addingCoupon ) {
			return false;
		}

		addingCoupon = true;
		form.find( '.submit .spinner' ).addClass( 'is-active' );

		$.post( ajaxurl, $( '#add-happyforms-coupon' ).serialize(), function( r ) {
			var res;

			addingCoupon = false;
			form.find( '.submit .spinner' ).removeClass( 'is-active' );

			$('#ajax-response').empty();

			res = wpAjax.parseAjaxResponse( r, 'ajax-response' );

			if ( res.errors && 'error-field' === res.responses[0].errors[0].code ) {
				validateForm( form );
			}

			if ( ! res || res.errors ) {
				return;
			}

			$( '.coupons' ).prepend( res.responses[0].supplemental.coupon_row );

			$('.coupons .no-items').remove();

			$('input:not([type="checkbox"]):not([type="radio"]):not([type="button"]):not([type="submit"]):not([type="reset"]):visible, textarea:visible', form).val('');

		} );

		return false;
	} );

	$( '#edit-happyforms-coupon' ).on( 'click', '.delete', function( e ) {
		if ( 'undefined' === typeof showNotice ) {
			return true;
		}

		// Confirms the deletion, a negative response means the deletion must not be executed.
		var response = showNotice.warn();
		if ( ! response ) {
			e.preventDefault();
		}
	});

	$( '[name="discount_type"]' ).on( 'change', function( e ) {
		var value = $( '[name=discount_type]:checked' ).val();
		var $amount = $( '#discount_amount' );

		if ( 'fixed' == value ) {
			$( 'p.details-discount_type-fixed' ).show();
			$( 'label.labels-dicount_type-fixed' ).show();
			$( 'label.labels-dicount_type-percentage' ).css( 'display', 'none' );
			$amount.removeAttr( 'max' );
		} else {
			$( 'p.details-discount_type-fixed' ).hide();
			$( 'label.labels-dicount_type-fixed' ).hide();
			$( 'label.labels-dicount_type-percentage' ).css( 'display', 'block' );
			$amount.attr( 'max', 100 );
		}
	} );

	$( '#post_title' ).on( 'keypress', function( e ) {
		if ( 32 == e.which ) {
			return false;
		}
	} );

	$( '#post_title' ).on( 'change', function( e ) {
		var $input = $( e.target );
		var value = $input.val();

		$input.val( value.replace(/\s/g,'') );
	} );


$( document ).ready(function() {
  $( 'input#post_title' ).focus();
});
} )( jQuery );