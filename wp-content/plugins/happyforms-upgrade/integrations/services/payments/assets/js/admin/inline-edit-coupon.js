window.wp = window.wp || {};

( function( $, wp ) {

window.inlineEditCoupon = {

	init : function() {
		var t = this, row = $('#inline-edit');

		t.type = $('#the-list').attr('data-wp-lists').substr(5);
		t.what = '#'+t.type+'-';

		$( '#the-list' ).on( 'click', '.editinline', function() {
			$( this ).attr( 'aria-expanded', 'true' );
			inlineEditCoupon.edit( this );
		});

		row.on( 'keyup', function( e ) {
			// 27 = [Escape].
			if ( e.which === 27 ) {
				return inlineEditCoupon.revert();
			}
		});

		$( '.cancel', row ).on( 'click', function() {
			return inlineEditCoupon.revert();
		});

		$( '.save', row ).on( 'click', function() {
			return inlineEditCoupon.save(this);
		});

		$( 'input, select', row ).on( 'keydown', function( e ) {
			// 13 = [Enter].
			if ( e.which === 13 ) {
				return inlineEditCoupon.save( this );
			}
		});

		$( '#posts-filter input[type="submit"]' ).on( 'mousedown', function() {
			t.revert();
		});

		$( 'input[name="inline_discount_type"]').on( 'change', function( e ) {
		var value = $( '[name=inline_discount_type]:checked' ).val();

		if ( 'fixed' == value ) {
			$( '.title-discount_amount' ).show();
			$( '.title-discount_percentage' ).hide();
			$( '[name="discount_amount"]' ).removeAttr( 'max' );
			// $( '.title-discount_percentage' ).css( 'display', 'none' );
		} else {
			$( '.title-discount_amount' ).hide();
			$( '.title-discount_percentage' ).show();
			$( '[name="discount_amount"]' ).attr( 'max', 100 );
		}
	} );
	},

	toggle : function(el) {
		var t = this;

		$( t.what + t.getId( el ) ).css( 'display' ) === 'none' ? t.revert() : t.edit( el );
	},

	edit : function( id ) {
		var editRow, rowData, t = this;
		t.revert();

		if ( typeof( id ) === 'object' ) {
			id = t.getId( id );
		}

		editRow = $( '#inline-edit' ).clone( true ), rowData = $( '#inline_' + id) ;
		$( 'td', editRow ).attr( 'colspan', $( 'th:visible, td:visible', '.wp-list-table.widefat:first thead' ).length );

		$( t.what + id ).hide().after( editRow ).after( '<tr class="hidden"></tr>' );

		var postTitle = $( '.post_title', rowData ).text();
		
		$( ':input[name="post_title"]', editRow ).val( postTitle );

		var discountType = $( '.discount_type', rowData ).text();
		var $typeInput = $( 'input[id="inline_discount_type_' + discountType + '"][name="inline_discount_type"]', editRow );

		$typeInput.prop( 'checked', true );
		$typeInput.trigger( 'change' );

		var discountAmount = $( '.discount_amount', rowData ).text();
		
		$(':input[name="discount_amount"]', editRow).val( discountAmount );

		if ( 'percentage' === discountType ) {
			$(':input[name="discount_amount"]', editRow).attr( 'max', 100 );
		}

		$( editRow ).attr( 'id', 'edit-' + id ).addClass( 'inline-editor' ).show();
		$( '.ptitle', editRow ).eq( 0 ).trigger( 'focus' );

		return false;
	},

	save : function(id) {
		var params, fields, tax = $('input[name="taxonomy"]').val() || '';

		if( typeof(id) === 'object' ) {
			id = this.getId(id);
		}

		$( 'table.widefat .spinner' ).addClass( 'is-active' );

		params = {
			action: 'happyforms-inline-save-coupon',
			ID: id,
			post_title: $('#edit-'+id).find('input[name="post_title"]').val(),
			discount_type: $('#edit-'+id).find('input[name="inline_discount_type"]:checked').val(),
			discount_amount: $('#edit-'+id).find('input[name="discount_amount"]').val(),
			_inline_edit: $('#edit-'+id).find('input[name="_inline_edit"]').val(),
		};

		// fields = $('#edit-'+id).find(':input').serialize();
		// params = fields + '&' + $.param(params);

		$.post( ajaxurl, params,
			function( r ) {
				var row, new_id, option_value,
					$errorNotice = $( '#edit-' + id + ' .inline-edit-save .notice-error' ),
					$error = $errorNotice.find( '.error' );

				$( 'table.widefat .spinner' ).removeClass( 'is-active' );

				if ( r ) {
					if ( -1 !== r.indexOf( '<tr' ) ) {
						$(inlineEditCoupon.what+id).siblings('tr.hidden').addBack().remove();
						new_id = $(r).attr('id');

						$('#edit-'+id).before(r).remove();

						if ( new_id ) {
							option_value = new_id.replace( inlineEditCoupon.type + '-', '' );
							row = $( '#' + new_id );
						} else {
							option_value = id;
							row = $( inlineEditCoupon.what + id );
						}

						// Update the value in the Parent dropdown.
						$( '#parent' ).find( 'option[value=' + option_value + ']' ).text( row.find( '.row-title' ).text() );

						row.hide().fadeIn( 400, function() {
							// Move focus back to the Quick Edit button.
							row.find( '.editinline' )
								.attr( 'aria-expanded', 'false' )
								.trigger( 'focus' );
							wp.a11y.speak( wp.i18n.__( 'Changes saved.' ) );
						});

					} else {
						$errorNotice.removeClass( 'hidden' );
						$error.html( r );

						wp.a11y.speak( $error.text() );
					}
				} else {
					$errorNotice.removeClass( 'hidden' );
					$error.text( wp.i18n.__( 'Error while saving the changes.' ) );
					wp.a11y.speak( wp.i18n.__( 'Error while saving the changes.' ) );
				}
			}
		);

		return false;
	},

	revert : function() {
		var id = $('table.widefat tr.inline-editor').attr('id');

		if ( id ) {
			$( 'table.widefat .spinner' ).removeClass( 'is-active' );
			$('#'+id).siblings('tr.hidden').addBack().remove();
			id = id.substr( id.lastIndexOf('-') + 1 );

			$( this.what + id ).show().find( '.editinline' )
				.attr( 'aria-expanded', 'false' )
				.trigger( 'focus' );
		}
	},

	getId : function(o) {
		var id = o.tagName === 'TR' ? o.id : $(o).parents('tr').attr('id'), parts = id.split('-');

		return parts[parts.length - 1];
	}
};

$( function() { inlineEditCoupon.init(); } );

})( jQuery, window.wp );
