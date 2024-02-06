/**
 * Default form frontend scripts
 *
 * @package YITH\CatalogMode
 */

var ctm_captcha;

function ywctm_recaptcha() {
	var ctm_recaptcha = jQuery( 'form[name="ywctm-default-form"]' ).find( '.g-recaptcha' );
	if ( typeof grecaptcha !== "undefined" && ctm_recaptcha.length > 0 ) {
		ctm_captcha = grecaptcha.render( 'recaptcha_ctm', {'sitekey': ctm_recaptcha.data( 'sitekey' )} );
	}
}

jQuery(
	function ( $ ) {
		"use strict";

		var ywctm_default_form_init = function () {

			var ywctm_default_form = $( 'form[name="ywctm-default-form"]' ),
				ajax_loader        = (typeof ywctm_form !== 'undefined') ? ywctm_form.block_loader : false,
				submit_button      = $( '.ywctm-send-request' ),
				error              = '<span class="ywctm_error"></span>',
				check_is_mail      = function ( val ) {
					/* https://stackoverflow.com/questions/2855865/jquery-validate-e-mail-address-regex */
					var pattern = new RegExp( /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i );
					return pattern.test( val );
				},
				print_error        = function ( elem, msg ) {

					if ( ! elem.next( '.ywctm_error' ).length ) {
						elem.after( error );
					}
					// Add error.
					elem.next( '.ywctm_error' ).html( msg );
				},
				validate_field     = function () {
					var t      = $( this ),
						parent = t.closest( 'p.form-row' ),
						value  = t.val(),
						msg    = '';

					if ( ! value && parent.hasClass( 'validate-required' ) && ! t.is( '[type="file"]' ) ) {
						msg = ywctm_form.err_msg;
						print_error( t, msg );
					} else if ( value && parent.hasClass( 'validate-email' ) && ! check_is_mail( value ) ) {
						print_error( t, ywctm_form.err_msg_mail );
					} else {
						t.next( '.ywctm_error' ).remove();
					}
				},
				scroll_to_notices  = function () {
					var scrollElement           = $( '.woocommerce-error, .woocommerce-message' ),
						isSmoothScrollSupported = 'scrollBehavior' in document.documentElement.style;

					if ( ! scrollElement.length ) {
						scrollElement = ywctm_default_form;
					}

					if ( scrollElement.length ) {
						if ( isSmoothScrollSupported ) {
							scrollElement[0].scrollIntoView(
								{
									behavior: 'smooth'
								}
							);
						} else {
							$( 'html, body' ).animate(
								{
									scrollTop: (scrollElement.offset().top - 100)
								},
								1000
							);
						}
					}
				},
				submit_form        = function ( e ) {
					e.preventDefault();

					var data = ywctm_default_form.ywctm_serialize_files();

					data.append( 'context', 'frontend' );

					$.ajax(
						{
							type       : 'POST',
							dataType   : 'json',
							data       : data,
							contentType: false,
							processData: false,
							url        : ywctm_form.ajaxurl.toString().replace( '%%endpoint%%', 'ywctm_submit_default_form' ),
							beforeSend : function () {
								submit_button.prop( 'disabled', true ).after( ' <img src="' + ajax_loader + '" class="ywctm-loader" >' );
							},
							complete   : function () {
								submit_button.prop( 'disabled', false ).next().remove();
							},
							success    : function ( response ) {
								if ( 'success' === response.result ) {
									// Remove notices from all sources.
									$( '.woocommerce-error, .woocommerce-message' ).remove();
									ywctm_default_form.prepend( '<div class="woocommerce-notice woocommerce-message">' + response.messages + '</div>' );
									ywctm_default_form.find( '.input-text, textarea' ).val( '' );
									ywctm_default_form.find( 'input:checkbox' ).prop( 'checked', false ).trigger( 'change' )

								}
								if ( 'failure' === response.result ) {

									// Remove notices from all sources.
									$( '.woocommerce-error, .woocommerce-message' ).remove();
									// Add new errors returned by this event.
									if ( response.messages ) {
										ywctm_default_form.prepend( '<div class="woocommerce-error woocommerce-message">' + response.messages + '</div>' );
									} else {
										ywctm_default_form.prepend( response );
									}
									// Lose focus for all fields.
									ywctm_default_form.find( '.input-text, input:checkbox' ).trigger( 'validate' ).blur();
								}

								scroll_to_notices();
								if ( typeof grecaptcha !== "undefined" && typeof ctm_captcha !== "undefined" ) {
									grecaptcha.reset( ctm_captcha );
								}
							}
						}
					);

					return false;
				};

			ywctm_default_form.on( 'blur', '.input-text', validate_field );
			ywctm_default_form.on( 'submit', submit_form );
		};

		$.fn.ywctm_serialize_files = function () {
			var obj      = $( this ),
				formData = new FormData(),
				params   = $( obj ).serializeArray();

			$.each(
				params,
				function ( i, val ) {
					if ( val.name ) {
						formData.append( val.name, val.value );
					}
				}
			);

			return formData;
		};

		ywctm_default_form_init( false );

	}
);
