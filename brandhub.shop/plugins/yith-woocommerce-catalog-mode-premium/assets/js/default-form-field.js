/**
 * Default form field scripts
 *
 * @package YITH\CatalogMode
 */

jQuery(
	function ( $ ) {

		var ywctm_default_form = $( 'div.ywctm-default-form' ).data( 'option-id' ),
			main_table         = $( '.ywctm-default-form-main-table' ),
			newField           = $( document ).find( '.ywctm-default-form__popup_wrapper' ),
			blockParams        = {message: null, overlayCSS: {background: '#fff', opacity: 0.7}, ignoreIfBlocked: true},
			format_name        = function ( name ) {
				// Format the "name" of field.
				// First replace all space with _.
				name      = name.trim();
				name      = name.toLowerCase();
				name      = name.replace( /\s/g, "_" );
				var regex = /[^A-Za-z0-9_]+/gi;
				name      = name.replace( regex, "" );
				return name;
			},
			submitRowForm      = function () {
				// Submit the field form.
				if ( $( '#name' ).hasClass( 'field-exists' ) ) {
					return false;
				}

				var data = $( "form.ywctm-default-form__form_row" ).serializeArray(); // Convert form to array.
				data.push( {name: "ywctm_default_form", value: ywctm_default_form} );
				data.push( {name: "request", value: "save"} );
				main_table.block( blockParams );
				newField.dialog( "close" );
				$.post( document.location.href, data )
					.done(
						function ( data ) {
							refreshTable( data );
							main_table.unblock();
						}
					);
			},
			activateRow        = function ( row, activated ) {
				// Enable/disable the table row.
				main_table.block( blockParams );
				$.post(
					document.location.href,
					{
						ywctm_default_form: ywctm_default_form,
						request           : "activate",
						activated         : activated,
						row               : row
					}
				)
					.done(
						function () {
							main_table.unblock();
						}
					);
			},
			sortTable          = function ( order ) {
				// Sort the table.
				main_table.block( blockParams );
				$.post(
					document.location.href,
					{
						ywctm_default_form: ywctm_default_form,
						request           : "sort",
						order             : order
					}
				)
					.done(
						function ( data ) {
							refreshTable( data );
							main_table.unblock();
						}
					);
			},
			refreshTable       = function ( data ) {
				// Refresh the main table.
				if ( data !== '' ) {
					var c     = $( "<div></div>" ).html( data ),
						table = c.find( '.ywctm-default-form-main-table' ),
						popup = c.find( '.ywctm-default-form__popup_wrapper' );

					$( '.ywctm-default-form-main-table' ).html( table.html() );
					$( '.ywctm-default-form__popup_wrapper' ).html( popup.html() );
					newField = $( document ).find( '.ywctm-default-form__popup_wrapper' );
					initSortTable();
				}
			},
			initSortTable      = function () {
				// Init the table to sort.
				$( ".ywctm-default-form-main-table tbody" ).sortable(
					{
						placeholder: "ui-state-highlight",
						axis       : 'y',
						handle     : ".action__sort",
						stop       : function () {
							var new_order = main_table.find( '[data-name="name"]' ),
								order     = [];
							new_order.each(
								function ( i, input ) {
									order.push( $( input ).val() );
								}
							);
							sortTable( order );
						},
						start      : function ( event, ui ) {
							$( ':root' )
								.css( '--dragged-item-width', ui.item.width() + 'px' );
						}
					}
				).disableSelection();
			},
			openPopup          = function () {

				newField = $( document ).find( '.ywctm-default-form__popup_wrapper' );

				// init dialog.
				newField.dialog(
					{
						closeText  : '',
						title      : ywctm_default_form_field.popup_title,
						width      : 400,
						modal      : true,
						dialogClass: 'yith-plugin-ui ywctm-default-form-popup',
						buttons    : [{
							'text' : ywctm_default_form_field.save,
							'click': function () {
								submitRowForm();
							},
							'class': 'yith-save-button'
						}]
					}
				);

				loadDependences();
			},
			loadDependences    = function () {
				// load the fields dependence on popup.

				$( document ).find( '.ywctm-default-form__popup_wrapper [data-deps]' ).each(
					function () {

						var t          = $( this ),
							wrap       = t.closest( 'tr' ),
							deps       = t.attr( 'data-deps' ).split( ',' ),
							values     = t.attr( 'data-deps_value' ).split( ',' ),
							conditions = [];

						$.each(
							deps,
							function ( i, dep ) {
								$( '[name="' + dep + '"]' ).on(
									'change',
									function () {

										var $tt          = $( this ),
											value        = $tt.val(),
											type         = $tt.attr( 'type' ),
											check_values = '';

										// exclude radio if not checked.
										if ( type === 'radio' && ! $tt.is( ':checked' ) ) {
											return;
										}

										if ( type === 'checkbox' ) {
											value = $tt.is( ':checked' ) ? 'yes' : 'no';
										}

										check_values  = values[i] + ''; // Force to string.
										check_values  = check_values.split( '|' );
										conditions[i] = $.inArray( value, check_values ) !== -1;

										if ( $.inArray( false, conditions ) === -1 ) {
											wrap.fadeIn();
										} else {
											wrap.fadeOut();
										}
									}
								).trigger( 'change' );
							}
						);
					}
				);
			};

		initSortTable();

		$( document ).on(
			'blur',
			'#name',
			function () {
				var $t          = $( this ),
					val         = $t.val(),
					td          = $t.closest( 'td' ),
					popupButton = $( '.yith-save-button' );

				popupButton.removeClass( 'disabled' ).removeAttr( 'disabled' );

				$t.removeClass( 'required' );
				$t.removeClass( 'field-exists' );
				td.find( '.description.field-exists' ).hide();
				td.find( '.description.required' ).hide();

				if ( $t.is( '[readonly]' ) ) {
					return;
				}

				val = format_name( val );

				if ( val === '' ) {
					$t.addClass( 'required' );
					td.find( '.description.required' ).show();
					popupButton.addClass( 'disabled' ).attr( 'disabled', 'true' );
					return false;
				}

				var $fields_names = main_table.find( 'input[value="' + val + '"]' );

				$.each(
					$fields_names,
					function () {
						var $field = $( this );
						if ( $field.val() === val ) {
							$t.addClass( 'field-exists' );
							td.find( '.description.field-exists' ).show();
							popupButton.addClass( 'disabled' ).attr( 'disabled', 'true' );
							return false;
						}
					}
				);
			}
		);

		$( document ).on(
			'click',
			'.action__edit',
			function ( e ) {
				e.preventDefault();
				var $t   = $( this ),
					tr   = $t.closest( 'tr' ),
					form = newField.find( 'form' );

				$.each(
					tr.find( 'input[type="hidden"]' ),
					function ( i, hidden ) {
						var name       = $( hidden ).data( 'name' ),
							form_input = $( form ).find( 'td *[name="' + name + '"]' ),
							value      = $( hidden ).val();

						if ( name === "name" ) {
							form_input.prop( 'readonly', true );
						}

						if ( form_input.length ) {
							if ( form_input.attr( 'type' ) === 'checkbox' ) {
								if ( 'yes' === value ) {
									form_input.prop( 'checked', true );
								} else {
									form_input.prop( 'checked', false );
								}
							} else {
								form_input.val( value );
							}
						}

						form_input.trigger( 'change' );

					}
				);

				openPopup();
			}
		);

		$( document ).on(
			'change',
			'input[name="enabled"]',
			function () {
				var $t        = $( this ),
					tr        = $t.closest( 'tr' ),
					row       = tr.find( '[data-name="name"]' ).val(),
					activated = $t.is( ':checked' ) ? 'yes' : 'no';

				activateRow( row, activated );
			}
		);
	}
);
