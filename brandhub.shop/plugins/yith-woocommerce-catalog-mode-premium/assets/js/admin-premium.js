/**
 * Admin panel premium scripts
 *
 * @package YITH\CatalogMode
 */

jQuery(
	function ( $ ) {

		$( 'input[name^=ywctm_inquiry_form_where_show]' ).on(
			'change, click',
			function () {
				if ( $( this ).is( ':checked' ) && 'tab' === $( this ).val() ) {
					$( 'input[name^=ywctm_inquiry_form_style][value=classic]' ).prop( 'checked', true ).trigger( 'click' ).trigger( 'change' );
				}
			}
		).trigger( 'change' );

		$( 'input[name^=ywctm_inquiry_form_style]' ).on(
			'change',
			function () {
				if ( $( this ).is( ':checked' ) && 'toggle' === $( this ).val() ) {
					$( 'input[name^=ywctm_inquiry_form_tab_title]' ).parent().parent().parent().hide();
				} else {
					$( 'input[name^=ywctm_inquiry_form_tab_title]' ).parent().parent().parent().show( 500 );
				}
			}
		).trigger( 'change' );

		$( 'select[name^=ywctm_inquiry_form_type]' ).on(
			'change',
			function () {
				var reCAPTCHA = $( '#ywctm_reCAPTCHA' );
				if ( 'default' !== $( this ).val() && 'yes' === reCAPTCHA.val() ) {
					reCAPTCHA
						.prop( 'checked', false )
						.val( 'no' )
						.removeClass( 'onoffchecked' )
						.trigger( 'change' );
				}

				if ( 'default' !== $( this ).val() ) {
					$( 'tr.ywctm-default-form' ).hide()
				} else {
					$( 'tr.ywctm-default-form' ).show( 500 )
				}
			}
		).trigger( 'change' );

		$( '.ywctm-exclusions .yith-save-button' ).on(
			'click',
			function ( e ) {

				window.onbeforeunload = null;

				var item_type = $( '#item_type' ).val(),
					element   = $( '#' + item_type + '_ids' );

				if ( element.find( 'option' ).length === 0 ) {

					element
						.parent()
						.find( 'small' )
						.remove();

					element
						.parent()
						.append( '<small style="color:#ff0000">' + ywctm.error_messages[item_type] + '</small>' );

					$( 'html, body' ).animate(
						{
							scrollTop: element.parent().offset().top - 30
						},
						500
					);

					e.preventDefault();
					return false;
				}
			}
		);

		$( '.ywctm-exclusions #doaction, .ywctm-exclusions #doaction2, .ywctm-exclusions #ywctm-filter-submit, .ywctm-exclusions #search-submit, .ywctm-exclusions .pagination-links, .ywctm-exclusions .yith-add-button, .ywctm-exclusions .yith-update-button' ).on(
			'click',
			function () {
				window.onbeforeunload = '';
			}
		);

		$( '.column-inquiry_form .on_off' ).on(
			'change',
			function () {

				var data = {
					action   : 'ywctm_enable_inquiry_form',
					item_id  : $( this ).parent().data( 'item-id' ),
					enabled  : $( this ).val(),
					section  : $( this ).parent().data( 'section' ),
					vendor_id: ywctm.vendor_id,
					_wpnonce : $( '#_wpnonce' ).val(),
				};

				$.post( ywctm.ajax_url, data );

			}
		);

		$( '.column-exclude .on_off' ).on(
			'change',
			function () {

				var data = {
					action  : 'ywctm_exclude_vendor',
					item_id : $( this ).attr( 'id' ).replace( 'exclude_vendor', '' ),
					enabled : $( this ).val(),
					_wpnonce: $( '#_wpnonce' ).val(),
				};

				$.post( ywctm.ajax_url, data );

			}
		);

		var product_ids_row  = $( 'tr.ajax-products.product_ids' ),
			category_ids_row = $( 'tr.ajax-terms.category_ids' ),
			tag_ids_row      = $( 'tr.ajax-terms.tag_ids' );

		$( '#item_type, .ywctm-exclusion-list-popup-wrapper #item_type' ).on(
			'change',
			function () {

				var type = $( this ).val();

				switch ( type ) {
					case 'category':
						product_ids_row.hide();
						category_ids_row.show( 500 );
						tag_ids_row.hide();
						break;

					case 'tag':
						product_ids_row.hide();
						category_ids_row.hide();
						tag_ids_row.show( 500 );
						break;

					default:
						product_ids_row.show( 500 );
						category_ids_row.hide();
						tag_ids_row.hide();

				}

			}
		).trigger( 'change' );

		$( '#ywctm_enable_atc_custom_options' ).on(
			'change',
			function () {

				if ( 'no' === $( this ).val() ) {
					$( 'tr.ywctm_atc_status' ).hide();
					$( 'tr.ywctm_custom_button' ).hide();
					$( 'tr.ywctm_custom_button_loop' ).hide();
				} else {
					$( 'tr.ywctm_atc_status' ).show( 500 );
				}
				$( '#ywctm_atc_status' ).trigger( 'change' );

			}
		).trigger( 'change' );

		$( '#ywctm_atc_status' ).on(
			'change',
			function () {

				var main_option = $( '#ywctm_enable_atc_custom_options' ).val();

				if ( 'show' === $( this ).val() || 'no' === main_option ) {
					$( 'tr.ywctm_custom_button' ).hide();
					$( 'tr.ywctm_custom_button_loop' ).hide();
				} else {
					$( 'tr.ywctm_custom_button' ).show( 500 );
					$( 'tr.ywctm_custom_button_loop' ).show( 500 );
				}
				$( '#ywctm_custom_button' ).trigger( 'change' );
				$( '#ywctm_custom_button_loop' ).trigger( 'change' );

			}
		).trigger( 'change' );

		$( '#ywctm_enable_price_custom_options' ).on(
			'change',
			function () {

				if ( 'no' === $( this ).val() ) {
					$( 'tr.ywctm_price_status' ).hide();
					$( 'tr.ywctm_custom_price_text' ).hide();
				} else {
					$( 'tr.ywctm_price_status' ).show( 500 );
				}
				$( '#ywctm_price_status' ).trigger( 'change' );

			}
		).trigger( 'change' );

		$( '#ywctm_price_status' ).on(
			'change',
			function () {

				var main_option = $( '#ywctm_enable_price_custom_options' ).val();

				if ( 'show' === $( this ).val() || 'no' === main_option ) {
					$( 'tr.ywctm_custom_price_text' ).hide();
				} else {
					$( 'tr.ywctm_custom_price_text' ).show( 500 );
				}

				$( '#ywctm_custom_price_text' ).trigger( 'change' );

			}
		).trigger( 'change' );

		$( '#ywctm_has_exclusion' ).on(
			'change',
			function () {
				if ( 'no' === $( this ).val() ) {
					$( '#ywctm_enable_atc_custom_options' )
						.prop( 'checked', false )
						.val( 'no' )
						.removeClass( 'onoffchecked' )
						.trigger( 'change' );
					$( '#ywctm_enable_price_custom_options' )
						.prop( 'checked', false )
						.val( 'no' )
						.removeClass( 'onoffchecked' )
						.trigger( 'change' );
					$( 'tr.ywctm_enable_inquiry_form' ).hide();
					$( 'tr.ywctm_enable_atc_custom_options' ).hide();
					$( 'tr.ywctm_enable_price_custom_options' ).hide();

				} else {
					$( 'tr.ywctm_enable_inquiry_form' ).show( 500 );
					$( 'tr.ywctm_enable_atc_custom_options' ).show( 500 );
					$( 'tr.ywctm_enable_price_custom_options' ).show( 500 );
				}
			}
		).trigger( 'change' );

		$( '#ywctm_custom_button' ).on(
			'change',
			function () {
				var atc_status   = $( '#ywctm_atc_status' ).val(),
					atc_override = $( '#ywctm_enable_atc_custom_options' ).val();
				if ( -1 === $.inArray( parseInt( $( this ).val() ), ywctm.buttons_custom_url ) || 'show' === atc_status || 'no' === atc_override ) {
					$( 'tr.ywctm_custom_button_url' ).hide()
				} else {
					$( 'tr.ywctm_custom_button_url' ).show( 500 );
				}
			}
		).trigger( 'change' );

		$( '#ywctm_custom_button_loop' ).on(
			'change',
			function () {
				var atc_status   = $( '#ywctm_atc_status' ).val(),
					atc_override = $( '#ywctm_enable_atc_custom_options' ).val();
				if ( -1 === $.inArray(
					parseInt( $( this ).val() ),
					ywctm.buttons_custom_url
				) || 'show' === atc_status || 'no' === atc_override
				) {
					$( 'tr.ywctm_custom_button_loop_url' ).hide()
				} else {
					$( 'tr.ywctm_custom_button_loop_url' ).show( 500 );
				}
			}
		).trigger( 'change' );

		$( '#ywctm_custom_price_text' ).on(
			'change',
			function () {
				var price_status   = $( '#ywctm_price_status' ).val(),
					price_override = $( '#ywctm_enable_price_custom_options' ).val();
				if ( -1 === $.inArray( parseInt( $( this ).val() ), ywctm.buttons_custom_url ) || 'show' === price_status || 'no' === price_override ) {
					$( 'tr.ywctm_custom_price_text_url' ).hide()
				} else {
					$( 'tr.ywctm_custom_price_text_url' ).show( 500 );
				}
			}
		).trigger( 'change' );

		$( '#ywctm-new-time-range, #ywctm-new-date-range' ).on(
			'click',
			function ( e ) {
				e.preventDefault();

				var type      = 'ywctm-new-time-range' === $( this ).attr( 'id' ) ? 'time' : 'date',
					table     = $( '.ywctm-' + type + '-ranges' ),
					rows      = table.find( '.ywctm-' + type + '-range-row' ),
					max_index = 1;

				rows.each(
					function () {
						var index = $( this ).data( 'index' );
						if ( index > max_index ) {
							max_index = index;
						}
					}
				);

				var new_index = max_index + 1,
					template  = wp.template( 'ywctm-' + type + '-range-row' ),
					new_row   = $( template( { index: new_index } ) );

				new_row.appendTo( table );

				$( document.body ).trigger( 'wc-enhanced-select-init' );
				$( document.body ).trigger( 'yith-framework-enhanced-select-init' );
				$( document.body ).trigger( 'yith_fields_init' );

			}
		);

		$( '#ywctm_enable_geolocation' ).on(
			'change',
			function () {
				if ( 'no' === $( this ).val() ) {
					$( '#ywctm_enable_geolocation_maxmind' )
						.prop( 'checked', false )
						.val( 'no' )
						.removeClass( 'onoffchecked' )
						.trigger( 'change' );
				}
			}
		).trigger( 'change' );

		$( '#ywctm_disable_shop' ).on(
			'change',
			function () {
				if ( 'no' === $( this ).val() ) {
					$( '#ywctm_disable_shop_timerange' )
						.prop( 'checked', false )
						.val( 'no' )
						.removeClass( 'onoffchecked' )
						.trigger( 'change' );
					$( '#ywctm_disable_shop_daterange' )
						.prop( 'checked', false )
						.val( 'no' )
						.removeClass( 'onoffchecked' )
						.trigger( 'change' );
				}
			}
		).trigger( 'change' );

		$( '#ywctm_disable_shop_timerange' ).on(
			'change',
			function () {
				if ( 'no' === $( this ).val() ) {
					$( '#ywctm_disable_shop_timerange_ranges' )
						.find( '.text input' )
						.each(
							function () {
								$( this ).attr( 'required', false );
							}
						);
				} else {
					$( '#ywctm_disable_shop_timerange_ranges' )
						.find( '.text input' )
						.each(
							function () {
								$( this ).attr( 'required', true );
							}
						);
				}
			}
		).trigger( 'change' );

		$( '#ywctm_disable_shop_daterange' ).on(
			'change',
			function () {
				if ( 'no' === $( this ).val() ) {
					$( '#ywctm_disable_shop_daterange_ranges' )
						.find( '.datepicker input' )
						.each(
							function () {
								$( this ).attr( 'required', false );
							}
						);
				} else {
					$( '#ywctm_disable_shop_daterange_ranges' )
						.find( '.datepicker input' )
						.each(
							function () {
								$( this ).attr( 'required', true );
							}
						);
				}
			}
		).trigger( 'change' );

		$( document ).on(
			'click',
			'.yith-icon.yith-icon-trash',
			function () {
				var $t          = $( this ),
					current_row = $t.closest( 'div.ywctm-time-range-row' );

				if ( ! current_row.length ) {
					current_row = $t.closest( 'div.ywctm-date-range-row' );
				}
				current_row.remove();
			}
		);

		$( document.body )
			.on(
				'ywctm_add_error_tip',
				function ( e, element, error_type ) {
					var offset = element.position();

					if ( element.parent().find( '.wc_error_tip' ).length === 0 ) {
						element.after( '<div class="wc_error_tip ' + error_type + '">' + ywctm.error_messages[error_type] + '</div>' );
						element
							.parent()
							.find( '.wc_error_tip' )
							.css( 'width', 150 )
							.css( 'left', offset.left + element.width() - ( element.width() / 2 ) - ( $( '.wc_error_tip' ).width() / 2 ) )
							.css( 'top', offset.top + element.height() )
							.fadeIn( '100' );
					}
				}
			)
			.on(
				'blur',
				'.ywctm-time-ranges-wrapper .text input',
				function () {
					$( '.wc_error_tip' ).fadeOut(
						'100',
						function () {
							$( this ).remove();
						}
					);
				}
			)
			.on(
				'keyup',
				'.ywctm-time-ranges-wrapper .text input',
				function ( e ) {
					var regex = new RegExp( '^' + $( this ).prop( 'pattern' ) + '$', 'gi' ),
						error = $( this ).hasClass( 'ywctm-hours' ) ? 'error_hours' : 'error_minutes',
						value = $( this ).val(),
						code  = e.keyCode || e.which;

					if ( ! regex.test( value ) && 9 !== code ) {
						$( document.body ).triggerHandler( 'ywctm_add_error_tip', [$( this ), error] );
					} else {
						$( document.body ).triggerHandler( 'wc_remove_error_tip', [$( this ), error] );
					}
				}
			);

		// Date picker fields.
		function date_picker_select( datepicker ) {
			var this_field_id  = datepicker.attr( 'id' ),
				option         = this_field_id.indexOf( 'start' ) !== -1 ? 'minDate' : 'maxDate',
				other_field_id = '#' + ( 'minDate' === option ? this_field_id.replace( 'start', 'end' ) : this_field_id.replace( 'end', 'start' ) ),
				date           = datepicker.datepicker( 'getDate' );

			$( other_field_id ).datepicker( 'option', option, date );
			$( datepicker ).change();
		}

		$.datepicker.setDefaults(
			{
				onSelect: function () {
					date_picker_select( $( this ) );
				}
			}
		);

		$( '.yith-plugin-fw-datepicker' ).each(
			function () {
				$( this ).each(
					function () {
						date_picker_select( $( this ) );
					}
				);
			}
		);

		var newExclusion = $( document ).find( '.ywctm-exclusion-list-popup-wrapper' ),
			popupForm    = newExclusion.find( 'form' ),
			openPopup    = function () {
				newExclusion = $( document ).find( '.ywctm-exclusion-list-popup-wrapper' );
				newExclusion.dialog(
					{
						closeText  : '',
						title      : ywctm.popup_labels.title.replace( /&#039;/g, "'" ),
						width      : 500,
						modal      : true,
						dialogClass: 'yith-plugin-ui ywctm-exclusion-list-popup',
						buttons    : [{
							'text' : ywctm.popup_labels.save.replace( /&#039;/g, "'" ),
							'click': function ( e ) {
								window.onbeforeunload = null;

								var popup     = $( '.ywctm-exclusion-list-popup-wrapper' ),
									is_vendor = popup.hasClass( 'vendor-exclusion' ),
									item_type = popup.find( '#item_type' ).val(),
									element   = is_vendor ? popup.find( '#item_ids' ) : popup.find( '#' + item_type + '_ids' );

								if ( element.find( 'option' ).length === 0 ) {

									element
										.parent()
										.find( 'small' )
										.remove();

									element
										.parent()
										.append( '<small style="color:#ff0000">' + ywctm.error_messages[item_type] + '</small>' );

									e.preventDefault();
									return false;
								} else {
									popupForm.submit();
								}
							},
							'class': 'yith-save-button'
						}
						]
					}
				);
			};

		$( document ).on(
			'click',
			'.yith-add-button',
			function ( e ) {
				e.preventDefault();
				openPopup();
			}
		);

		$( '.ywctm-notice' ).on(
			'click',
			'.notice-dismiss',
			function () {
				$( this ).parent().hide();
			}
		);

		history.pushState( null, '', pruned_url() );

		function pruned_url() {
			var url = location.href;
			url     = url.replace( /&?_wpnonce=([^&]$|[^&]*)/i, "" );
			url     = url.replace( /&?_wp_http_referer=([^&]$|[^&]*)/i, "" );
			return url;
		}

	}
);
