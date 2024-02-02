/**
 * Buttons & Labels admin panel scripts
 *
 * @package YITH\CatalogMode
 */

jQuery(
	function ( $ ) {

		function render_icons( text ) {

			var regex = /{{(((\w+-?)*) ((\w+\d*-?)*))}}/gm;

			return text.replace( regex, '<i class="$1"></i>' );

		}

		$( window ).on(
			'resize',
			function () {
				if ( 1440 > $( window ).width() ) {
					$( 'body' ).addClass( 'folded' );
				} else {
					$( 'body' ).removeClass( 'folded' );
				}
			}
		);

		$( '.ywctm-back-button' ).on(
			'click',
			function () {
				window.onbeforeunload = '';
			}
		);

		var selected_icon_row           = $( 'tr.ywctm_selected_icon' ),
			selected_icon_size_row      = $( 'tr.ywctm_selected_icon_size' ),
			selected_icon_alignment_row = $( 'tr.ywctm_selected_icon_alignment' ),
			icon_color_row              = $( 'tr.ywctm_icon_color' ),
			custom_icon_row             = $( 'tr.ywctm_custom_icon' );

		$(
			function () {

				if ( 1440 > $( window ).width() ) {
					$( 'body' ).addClass( 'folded' );
				}

				$( '.ywctm-metabox-tab-button' ).each(
					function () {
						$( this ).on(
							'click',
							function () {

								var tab_name = $( this ).data( 'tab-name' ),
									tab      = $( '.ywctm-settings-wrapper.' + tab_name );

								if ( ! tab.hasClass( 'tab-active' ) ) {
									$( '.ywctm-metabox-tab-button' ).removeClass( 'tab-active' );
									$( '.ywctm-settings-wrapper' ).removeClass( 'tab-active' );

									$( this ).addClass( 'tab-active' );
									tab.addClass( 'tab-active' );
								}

							}
						);
					}
				);

				var button = $( 'span.ywctm-custom-button' );

				$( document ).on(
					'tinymce-editor-setup',
					function ( event, editor ) {

						editor.on(
							'init',
							function ( e ) {
								e.target.editorCommands.execCommand( 'fontName', false, ywctm_btns.editor_font );
								e.target.editorCommands.execCommand( 'fontSize', false, '16px' );
							}
						);

						editor.on(
							'ExecCommand',
							function ( e ) {
								if ( '' !== e.target.getContent() ) {
									button.find( '.ywctm-inquiry-title' ).html( render_icons( e.target.getContent() ) );
								}
							}
						);

						editor.on(
							'SetContent',
							function ( e ) {
								if ( '' !== e.content ) {
									button.find( '.ywctm-inquiry-title' ).html( render_icons( e.content ) )
								}
							}
						);

						editor.on(
							'KeyUp',
							function ( e ) {
								button.find( '.ywctm-inquiry-title' ).html( render_icons( e.target.innerHTML ) )
							}
						);

					}
				);

				button.css( 'font-family', ywctm_btns.editor_font );

				$( '.ywctm-metabox-wrapper input, .ywctm-metabox-wrapper select, .ywctm-metabox-wrapper .yit-icons-manager-wrapper, .ywctm-metabox-wrapper .ui-slider-horizontal, .wp-editor-area, .wp-picker-holder' ).on(
					'change keyup input keydown keypress click mousemove',
					function () {

						var current_element = $( this ),
							button_text     = button.find( '.ywctm-inquiry-title' ).html(),
							icon,
							icon_data,
							icon_class      = '',
							image           = '';

						if ( $( this ).hasClass( 'wp-editor-area' ) ) {
							if ( '' === $( this ).val() ) {
								if ( button_text.indexOf( 'btn-placeholder' ) === -1 ) {
									button_text = $( this ).val();
								}
							} else {
								button_text = $( this ).val();
							}
						}

						if ( '' !== current_element && 'ywctm_icon_type' === current_element.attr( 'id' ) ) {

							switch ( current_element.val() ) {
								case 'icon':
									icon_color_row.show( 500 );
									selected_icon_row.show( 500 );
									selected_icon_size_row.show( 500 );
									selected_icon_alignment_row.show( 500 );
									custom_icon_row.hide();
									break;

								case 'custom':
									icon_color_row.hide();
									selected_icon_row.hide();
									selected_icon_size_row.hide();
									selected_icon_alignment_row.show( 500 );
									custom_icon_row.show( 500 );
									break;

								default:
									icon_color_row.hide();
									selected_icon_row.hide();
									selected_icon_size_row.hide();
									selected_icon_alignment_row.hide();
									custom_icon_row.hide();

							}
						}

						var text_color                 = $( '#ywctm_default_colors_text' ).val(),
							hover_text_color           = $( '#ywctm_hover_colors_text' ).val(),
							background_color           = $( '#ywctm_default_colors_background' ).val(),
							hover_background_color     = $( '#ywctm_hover_colors_background' ).val(),
							border_color               = $( '#ywctm_default_colors_borders' ).val(),
							hover_border_color         = $( '#ywctm_hover_colors_borders' ).val(),
							border_thickness_top       = $( '#ywctm_border_thickness-dimension-top' ).val(),
							border_thickness_right     = $( '#ywctm_border_thickness-dimension-right' ).val(),
							border_thickness_bottom    = $( '#ywctm_border_thickness-dimension-bottom' ).val(),
							border_thickness_left      = $( '#ywctm_border_thickness-dimension-left' ).val(),
							border_radius_top_left     = $( '#ywctm_border_radius-dimension-top-left' ).val(),
							border_radius_top_right    = $( '#ywctm_border_radius-dimension-top-right' ).val(),
							border_radius_bottom_right = $( '#ywctm_border_radius-dimension-bottom-right' ).val(),
							border_radius_bottom_left  = $( '#ywctm_border_radius-dimension-bottom-left' ).val(),
							margin_top                 = $( '#ywctm_margin_settings-dimension-top' ).val(),
							margin_right               = $( '#ywctm_margin_settings-dimension-right' ).val(),
							margin_bottom              = $( '#ywctm_margin_settings-dimension-bottom' ).val(),
							margin_left                = $( '#ywctm_margin_settings-dimension-left' ).val(),
							padding_top                = $( '#ywctm_padding_settings-dimension-top' ).val(),
							padding_right              = $( '#ywctm_padding_settings-dimension-right' ).val(),
							padding_bottom             = $( '#ywctm_padding_settings-dimension-bottom' ).val(),
							padding_left               = $( '#ywctm_padding_settings-dimension-left' ).val(),
							width_amount               = $( '#ywctm_width_settings_width' ).val(),
							width_unit                 = $( '#ywctm_width_settings_unit' ).val(),
							selected_icon              = $( '#ywctm_selected_icon' ).val(),
							icon_color                 = $( '#ywctm_icon_color_default' ).val(),
							hover_icon_color           = $( '#ywctm_icon_color_hover' ).val(),
							selected_icon_size         = $( '#ywctm_selected_icon_size' ).val(),
							selected_icon_alignment    = $( '#ywctm_selected_icon_alignment' ).val(),
							custom_icon                = $( '#ywctm_custom_icon' ).val(),
							hover_effect               = $( '#ywctm_hover_animation' ).val(),
							width                      = ( '' === width_amount ) ? 'max-content' : width_amount + width_unit;

						switch ( $( '#ywctm_icon_type' ).val() ) {
							case 'icon':

								icon_data = selected_icon.split( ':' );

								switch ( icon_data[0] ) {
									case 'FontAwesome':
										icon_class = 'fa fa-' + icon_data[1];
										break;
									case 'Dashicons':
										icon_class = 'dashicons dashicons-' + icon_data[1];
										break;
									default:
								}

								icon = '<span class="ywctm-icon-form ' + icon_class + '"></span>';
								break;
							case 'custom':
								image = ( '' !== custom_icon ? '<img src="' + custom_icon + '" />' : '' );
								icon  = '<span class="custom-icon">' + image + '</span>';
								break;
							default:
								icon = '';
						}

						if ( 'none' === hover_effect ) {
							button
								.removeClass( 'ywctm-hover-effect' )
								.removeClass(
									function ( index, className ) {
										return ( className.match( /\bywctm-effect-\S+/g ) || [] ).join( ' ' );
									}
								);
						} else {
							button
								.removeClass(
									function ( index, className ) {
										return ( className.match( /\bywctm-effect-\S+/g ) || [] ).join( ' ' );
									}
								)
								.addClass( 'ywctm-hover-effect ywctm-effect-' + hover_effect );

							$( ':root' )
								.css( '--hover-bg-color', hover_background_color )
								.css( '--bg-color', background_color )
								.css( '--border-radius', border_radius_top_left + 'px ' + border_radius_top_right + 'px ' + border_radius_bottom_right + 'px ' + border_radius_bottom_left + 'px' );

							if ( 'slide-top' === hover_effect || 'slide-left' === hover_effect ) {
								hover_background_color = 'transparent';
								background_color       = 'transparent';
							}
						}

						button
							.css( 'color', text_color )
							.css( 'background-color', background_color )
							.css( 'border-color', border_color )
							.css( 'border-top-width', border_thickness_top + 'px' )
							.css( 'border-right-width', border_thickness_right + 'px' )
							.css( 'border-bottom-width', border_thickness_bottom + 'px' )
							.css( 'border-left-width', border_thickness_left + 'px' )
							.css( 'border-top-left-radius', border_radius_top_left + 'px' )
							.css( 'border-top-right-radius', border_radius_top_right + 'px' )
							.css( 'border-bottom-right-radius', border_radius_bottom_right + 'px' )
							.css( 'border-bottom-left-radius', border_radius_bottom_left + 'px' )
							.css( 'margin-top', margin_top + 'px' )
							.css( 'margin-right', margin_right + 'px' )
							.css( 'margin-bottom', margin_bottom + 'px' )
							.css( 'margin-left', margin_left + 'px' )
							.css( 'padding-top', padding_top + 'px' )
							.css( 'padding-right', padding_right + 'px' )
							.css( 'padding-bottom', padding_bottom + 'px' )
							.css( 'padding-left', padding_left + 'px' )
							.css( 'max-width', width )
							.html( icon + '<span class="ywctm-inquiry-title">' + render_icons( button_text ) + '</span>' )
							.off( 'mouseenter mouseleave' )
							.on(
								'hover',
								function () {

									$( this )
										.css( 'color', hover_text_color )
										.css( 'background-color', hover_background_color )
										.css( 'border-color', hover_border_color );

									$( this )
										.find( '.ywctm-icon-form' )
										.css( 'color', hover_icon_color );
								},
								function () {

									$( this )
										.css( 'color', text_color )
										.css( 'background-color', background_color )
										.css( 'border-color', border_color );

									$( this )
										.find( '.ywctm-icon-form' )
										.css( 'color', icon_color );
								}
							);

						button
							.find( '.ywctm-icon-form' )
							.css( 'color', icon_color )
							.css( 'font-size', selected_icon_size + 'px' )
							.css( 'align-self', selected_icon_alignment );

						button
							.find( '.custom-icon' )
							.css( 'align-self', selected_icon_alignment );

					}
				).trigger( 'change' );

				$( window ).on(
					'scroll',
					function () {

						var container = $( '.ywctm-button-preview' );

						if ( container.offset().top < $( window ).scrollTop() + 32 ) {
							container.find( 'div.sticky' ).css(
								{
									position: 'fixed',
									top     : '3rem',
									width   : container.width()
								}
							);
						} else {
							container.find( 'div.sticky' ).css(
								{
									position: 'relative',
									top     : 'initial',
									width   : '100%'
								}
							);
						}
					}
				);

			}
		);

		$( 'input[name^=ywctm_button_url_type]' ).on(
			'change',
			function () {
				if ( $( this ).is( ':checked' ) && 'custom' === $( this ).val() ) {
					$( '#ywctm_button_url' ).parent().parent().parent().show( 500 );
				} else {
					$( '#ywctm_button_url' ).parent().parent().parent().hide();
				}
			}
		).trigger( 'change' );

		var ywctm_validator = {
			after_validation     : function ( action, $field ) {
				var message       = $field.data( 'message' ),
					beforeMessage = $field;

				beforeMessage.next( '.validate-error' ).remove();

				if ( action !== 'valid' ) {
					$field.addClass( 'invalid' );

					if ( typeof message !== 'undefined' ) {
						beforeMessage.after( '<span class="validate-error">' + message + '</span>' );
					}
				} else {
					$field.removeClass( 'invalid' );
				}
			},
			validateRequiredField: function () {
				var isEmpty = ! $( this ).val() || $( this ).val() == null;
				ywctm_validator.after_validation( isEmpty ? '' : 'valid', $( this ) );
			}
		};

		/* Validate for YITH required fields */
		$( document ).on(
			'focusout validate_field',
			'.yith-plugin-ui input.required',
			ywctm_validator.validateRequiredField
		);

		$( document ).on(
			'submit',
			'body.post-type-ywctm-button-label form#post',
			function ( e ) {
				var form   = $( e.target ),
					fields = form.find( 'input,select,textarea' ),
					invalidFields,
					firstInvalidField;

				fields.trigger( 'validate_field' );
				invalidFields = fields.filter( '.invalid' );
				if ( invalidFields.length ) {
					firstInvalidField = invalidFields.first();
					firstInvalidField.focus();
					$( '#publish' ).removeClass( 'disabled' );
					e.preventDefault();
				}
			}
		);

	}
);
