/* global fusionAllElements */
var FusionPageBuilder = FusionPageBuilder || {};

( function() {

	jQuery( document ).ready( function() {

		// Button Element View.
		FusionPageBuilder.fusion_button = FusionPageBuilder.ElementView.extend( {

			/**
			 * Migrate params to new format.
			 *
			 * @since 3.5
			 * @return {void}
			 */
			onInit: function() {
				var params = this.model.get( 'params' );

				// Check for newer margin params.  If unset but regular is, copy from there.
				if ( 'object' === typeof params ) {

					// Split border width into 4.
					if ( 'undefined' === typeof params.border_top && 'undefined' !== typeof params.border_width && '' !== params.border_width ) {
						params.border_top    = parseInt( params.border_width ) + 'px';
						params.border_right  = params.border_top;
						params.border_bottom = params.border_top;
						params.border_left   = params.border_top;
						delete params.border_width;
					}

					// Split border radius into 4.
					if ( 'undefined' === typeof params.border_radius_top_left && 'undefined' !== typeof params.border_radius && '' !== params.border_radius ) {
						params.border_radius_top_left     = parseInt( params.border_radius ) + 'px';
						params.border_radius_top_right    = params.border_radius_top_left;
						params.border_radius_bottom_right = params.border_radius_top_left;
						params.border_radius_bottom_left  = params.border_radius_top_left;
						delete params.border_radius;
					}
					this.model.set( 'params', params );
				}
			},

			/**
			 * Runs on render.
			 *
			 * @since 2.0
			 * @return {void}
			 */
			onRender: function() {
				this.afterPatch();
			},

			/**
			 * Runs after view DOM is patched.
			 *
			 * @since 2.0
			 * @return {void}
			 */
			afterPatch: function() {
				var item    = jQuery( '#fb-preview' )[ 0 ].contentWindow.jQuery( this.$el.find( '[rel="iLightbox"]' ) ),
					params  = this.model.get( 'params' ),
					stretch = params.stretch;

				if ( 'default' === stretch || '' == stretch ) {
					stretch = fusionAllElements.fusion_button.defaults.stretch;
				}

				this.$el.removeClass( 'fusion-element-alignment-right fusion-element-alignment-left fusion-element-alignment-block fusion-element-alignment-textflow' );

				if ( 'yes' !== stretch && ! this.flexDisplay() ) {
					if ( 'undefined' !== typeof params.alignment && '' !== params.alignment ) {
						this.$el.addClass( 'fusion-element-alignment-' + params.alignment );
					} else if ( ! jQuery( 'body.rtl' ).length ) {
						this.$el.addClass( 'fusion-element-alignment-left fusion-element-alignment-textflow' );
					} else {
						this.$el.addClass( 'fusion-element-alignment-right fusion-element-alignment-textflow' );
					}
				} else {
					this.$el.addClass( 'fusion-element-alignment-block' );
				}

				if ( 'object' === typeof jQuery( '#fb-preview' )[ 0 ].contentWindow.avadaLightBox ) {
					if ( 'undefined' !== typeof this.iLightbox ) {
						this.iLightbox.destroy();
					}

					if ( item.length ) {
						this.iLightbox = item.iLightBox( jQuery( '#fb-preview' )[ 0 ].contentWindow.avadaLightBox.prepare_options( 'single' ) );
					}
				}
			},

			/**
			 * Modify template attributes.
			 *
			 * @since 2.0
			 * @param {Object} atts - The attributes.
			 * @return {Object}
			 */
			filterTemplateAtts: function( atts ) {
				var attributes = {};

				this.isFlex = this.flexDisplay();
				this.values = atts.values;
				this.extras = atts.extras;

				// Validate values.
				this.validateArgs();

				// Create attribute objects.
				attributes.wrapperAttr    = this.buildWrapperAttr( atts.values );
				attributes.attr           = this.buildAttr( atts.values );
				attributes.IconAttr       = this.buildIconAttr( atts.values );
				attributes.textAttr       = this.buildTextAttr( atts.values );

				// Any extras that need passed on.
				attributes.values = atts.values;

				return attributes;
			},

			/**
			 * Modify template attributes.
			 *
			 * @since 3.5
			 * @return {void}
			 */
			validateArgs: function() {
				// variables into current scope
				var params, border_radius;

				params = this.model.get( 'params' );

				this.values.default_size = false;
				if ( ( 'undefined' !== typeof params.size && '' === params.size ) || 'undefined' === typeof params.size ) {
					this.values.default_size = true;
				}

				this.values.default_stretch = false;
				if ( ( 'undefined' !== typeof params.stretch && '' === params.stretch ) || 'undefined' === typeof params.stretch ) {
					this.values.default_stretch = true;
				}

				this.values.default_type = false;
				if ( ( 'undefined' !== typeof params.type && ( '' === params.type || 'default' === params.type ) ) || 'undefined' === typeof params.type ) {
					this.values.default_type = true;
				}

				this.values.margin_bottom = _.fusionGetValueWithUnit( this.values.margin_bottom );
				this.values.margin_left   = _.fusionGetValueWithUnit( this.values.margin_left );
				this.values.margin_right  = _.fusionGetValueWithUnit( this.values.margin_right );
				this.values.margin_top    = _.fusionGetValueWithUnit( this.values.margin_top );

				if ( 'undefined' === typeof this.values.gradient_colors || '' === this.values.gradient_colors ) {
					this.values.gradient_colors = this.values.button_gradient_top_color.toLowerCase() + '|' + this.values.button_gradient_bottom_color.toLowerCase();
				}

				if ( 'undefined' === typeof this.values.gradient_hover_colors || '' === this.values.gradient_hover_colors ) {
					this.values.gradient_hover_colors = this.values.button_gradient_top_color_hover.toLowerCase() + '|' + this.values.button_gradient_bottom_color_hover.toLowerCase();
				}

				this.values.old_text_color   = ( 'undefined' !== typeof this.values.text_color && '' !== this.values.text_color ) ? this.values.text_color : false;
				this.values.text_color       = this.values.accent_color;
				this.values.icon_color       = this.values.text_color;
				this.values.text_hover_color = this.values.accent_hover_color;
				this.values.icon_hover_color = this.values.text_hover_color;

				if ( 'undefined' !== typeof this.values.old_text_color && '' !== this.values.old_text_color ) {
					this.values.text_color = this.values.old_text_color;
				}

				if ( this.values.modal ) {
					this.values.link = '#';
				}

				this.values.type = 'string' === typeof this.values.type ? this.values.type.toLowerCase() : 'flat';

				// BC compatibility for button shape.
				if ( 'undefined' !== typeof params.shape && '' !== params.shape && 'undefined' === typeof params.border_radius && 'undefined' === typeof params.border_radius_top_left ) {
					border_radius = '0';
					if ( 'square' === this.values.shape ) {
						border_radius = '0';
					} else if ( 'round' === this.values.shape ) {
						border_radius = '2';

						if ( '3d' === this.values.type.toLowerCase() ) {
							border_radius = '4';
						}
					} else if ( 'pill' === this.values.shape ) {
						border_radius = '25';
					}

					this.values.border_radius_top_left     = _.fusionGetValueWithUnit( border_radius );
					this.values.border_radius_top_right    = this.values.border_radius_top_left;
					this.values.border_radius_bottom_right = this.values.border_radius_top_left;
					this.values.border_radius_bottom_left  = this.values.border_radius_top_left;
				} else if ( 'undefined' !== typeof params.border_radius && 'undefined' === typeof params.border_radius_top_left && '' !== params.border_radius ) {
					this.values.border_radius_top_left     = params.border_radius;
					this.values.border_radius_top_right    = this.values.border_radius_top_left;
					this.values.border_radius_bottom_right = this.values.border_radius_top_left;
					this.values.border_radius_bottom_left  = this.values.border_radius_top_left;
				}

				this.values.border_radius_top_left     = _.isEmpty( this.values.border_radius_top_left ) ? '0' : _.fusionGetValueWithUnit( this.values.border_radius_top_left );
				this.values.border_radius_top_right    = _.isEmpty( this.values.border_radius_top_right ) ? '0' : _.fusionGetValueWithUnit( this.values.border_radius_top_right );
				this.values.border_radius_bottom_right = _.isEmpty( this.values.border_radius_bottom_right ) ? '0' : _.fusionGetValueWithUnit( this.values.border_radius_bottom_right );
				this.values.border_radius_bottom_left  = _.isEmpty( this.values.border_radius_bottom_left ) ? '0' : _.fusionGetValueWithUnit( this.values.border_radius_bottom_left );
				this.values.border_radius              = this.values.border_radius_top_left + ' ' +  this.values.border_radius_top_right + ' ' + this.values.border_radius_bottom_right + ' ' +  this.values.border_radius_bottom_left;

				// Legacy single border support.
				if ( 'undefined' !== params.border_width && '' !== params.border_width && 'undefined' === params.border_top ) {
					this.values.border_top    = params.border_width;
					this.values.border_right  = this.values.border_top;
					this.values.border_bottom = this.values.border_top;
					this.values.border_left   = this.values.border_top;
				}

				this.values.default_border_width = false;
				if ( '' === this.values.border_top && '' === this.values.border_right && '' === this.values.border_bottom && '' === this.values.border_left ) {
					this.values.default_border_width = true;
				} else {

					// Not using default, ensure values for each.
					this.values.border_top    = ( '' === this.values.border_top ) ? this.extras.border_top : this.values.border_top;
					this.values.border_right  = ( '' === this.values.border_right ) ? this.extras.border_right : this.values.border_right;
					this.values.border_bottom = ( '' === this.values.border_bottom ) ? this.extras.border_bottom : this.values.border_bottom;
					this.values.border_left   = ( '' === this.values.border_left ) ? this.extras.border_left : this.values.border_left;
				}

				this.values.border_top    = _.isEmpty( this.values.border_top ) ? '0' : _.fusionGetValueWithUnit( this.values.border_top );
				this.values.border_right  = _.isEmpty( this.values.border_right ) ? '0' : _.fusionGetValueWithUnit( this.values.border_right );
				this.values.border_bottom = _.isEmpty( this.values.border_bottom ) ? '0' : _.fusionGetValueWithUnit( this.values.border_bottom );
				this.values.border_left   = _.isEmpty( this.values.border_left ) ? '0' : _.fusionGetValueWithUnit( this.values.border_left );
				this.values.border_width  = this.values.border_top + ' ' +  this.values.border_right + ' ' + this.values.border_bottom + ' ' +  this.values.border_left;

				if ( 'undefined' === typeof this.values.size ) {
					this.values.size = '';
				}
			},

			/**
			 * Builds the wrapper attributes.
			 *
			 * @since 2.0
			 * @param {Object} values - The values object.
			 * @return {Object}
			 */
			buildWrapperAttr: function( values ) {
				var attr 		= {
					class: '',
					style: ''
				},
				isDefaultStretch = ( 'undefined' !== typeof values.stretch && ( '' === values.stretch || 'default' === values.stretch ) ) || 'undefined' === typeof values.stretch;

				if ( this.isFlex ) {
					if ( values.alignment ) {
						attr.style += 'text-align:' + values.alignment + ';';
					}
					if ( values.alignment_medium && values.alignment !== values.alignment_medium ) {
						attr[ 'class' ] += ' md-text-align-' + values.alignment_medium;
					}

					if ( values.alignment_small && values.alignment !== values.alignment_small ) {
						attr[ 'class' ] += ' sm-text-align-' + values.alignment_small;
					}
				} else {
					attr[ 'class' ] += 'fusion-button-wrapper';
					// Add wrapper to the button for alignment and scoped styling.
					if ( ( ( ! isDefaultStretch && 'yes' === values.stretch ) || ( isDefaultStretch && 'yes' === fusionAllElements.fusion_button.defaults.stretch ) ) ) {
						attr[ 'class' ] += ' fusion-align-block';
					} else if ( values.alignment ) {
						attr[ 'class' ] += ' fusion-align' + values.alignment;
					}
				}

				return attr;
			},

			/**
			 * Builds attributes.
			 *
			 * @since 2.0
			 * @param {Object} values - The values object.
			 * @return {Object}
			 */
			buildAttr: function( values ) {
				var params           = this.model.get( 'params' ),
					attr             = _.fusionVisibilityAtts( values.hide_on_mobile, {
						class: 'fusion-button button-' + values.type + ' button-' + values.color + ' button-cid' + this.model.get( 'cid' ),
						style: this.getStyleVars()
					} ),
					sizeClass        = 'button-' + values.size,
					stretchClass     = 'fusion-button-span-' + values.stretch,
					typeClass        = '',
					colorType;

				attr[ 'class' ] += _.fusionGetStickyClass( values.sticky_display );

				if ( ( 'undefined' !== typeof params.size && '' === params.size ) || 'undefined' === typeof params.size ) {
					sizeClass = 'fusion-button-default-size';
				}

				if ( ( 'undefined' !== typeof params.stretch && ( '' === params.stretch || 'default' === params.stretch ) ) || 'undefined' === typeof params.stretch ) {
					stretchClass = 'fusion-button-default-span';
				}

				if ( ( 'undefined' !== typeof params.type && ( '' === params.type || 'default' === params.type ) ) || 'undefined' === typeof params.type ) {
					typeClass = 'fusion-button-default-type';
				}

				colorType = this.values.color;
				if ( 'custom' === this.values.color ) {
					colorType = 'default';
				}

				attr[ 'class' ] += ' ' + sizeClass + ' ' + stretchClass + ' ' + typeClass + ' fusion-button-' + colorType;

				attr.target = values.target;
				if ( '_blank' === values.target ) {
					attr.rel = 'noopener noreferrer';
				} else if ( 'lightbox' === values.target ) {
					attr.rel = 'iLightbox';
				}

				if ( 'none' !== this.values.hover_transition ) {
					attr[ 'data-hover ' ] = this.values.hover_transition;

					if ( 'icon_position' === this.values.hover_transition && this.values.icon ) {
						attr[ 'class' ] += ' awb-b-icon-pos-' + this.values.icon_position;
					}
				}

				attr =  _.fusionLinkAttributes( attr, values );

				attr.title = values.title;
				attr[ 'aria-label' ] = 'undefined' !== typeof attr[ 'aria-label' ] ? attr[ 'aria-label' ] : values.title;


				attr.href  = values.link;

				if ( '' !== values.modal ) {
					attr.data_toggle = 'modal';
					attr.data_target =  '.fusion-modal.' + values.modal;
				}

				if ( '' !== values[ 'class' ] ) {
					attr[ 'class' ] += ' ' + values[ 'class' ];
				}

				if ( '' !== values.id ) {
					attr.id = values.id;
				}

				attr = _.fusionAnimations( values, attr );

				if ( 'undefined' !== typeof this.values.has_gradient && this.values.has_gradient ) {
					attr[ 'class' ] += ' fusion-has-button-gradient';
				}

				return attr;
			},

			/**
			 * Builds icon attributes.
			 *
			 * @since 2.0
			 * @param {Object} values - The values object.
			 * @return {Object}
			 */
			buildIconAttr: function( values ) {
				var buttonShortcodeIcon = {
					class: _.fusionFontAwesome( values.icon ),
					'aria-hidden': 'true'
				};

				if ( 'yes' !== values.icon_divider ) {
					buttonShortcodeIcon[ 'class' ] += ' button-icon-' + values.icon_position;
				}

				if ( values.icon_color && values.icon_color !== values.accent_color ) {
					buttonShortcodeIcon.style = 'color:' + values.icon_color + ';';
				}

				return buttonShortcodeIcon;
			},

			/**
			 * Builds text attributes.
			 *
			 * @since 2.0
			 * @param {Object} values - The values object.
			 * @return {Object}
			 */
			buildTextAttr: function( values ) {
				var buttonTextAttr = {
					class: 'fusion-button-text'
				};
				if ( '' !== values.icon && 'yes' === values.icon_divider ) {
					buttonTextAttr[ 'class' ] += ' fusion-button-text-' + values.icon_position;
				}
				buttonTextAttr = _.fusionInlineEditor( {
					cid: this.model.get( 'cid' ),
					'disable-return': true,
					'disable-extra-spaces': true,
					toolbar: 'simple'
				}, buttonTextAttr );

				return buttonTextAttr;
			},

			/**
			 * Builds the styles.
			 *
			 * @since 3.5
			 * @return {void}
			 */
			getStyleVars: function() {
				var customVars = [],
					grad_colors,
					grad_hover_colors,
					text_styles;

				this.values.has_gradient = false;

				// If its custom, default or a custom color scheme.
				if ( 'custom' ===  this.values.color || 'default' ===  this.values.color || false !==  this.values.color.includes( 'scheme-' ) ) {

					if ( ! this.isDefault( 'bevel_color' ) ) {
						customVars.button_bevel_color = this.values.bevel_color;
					}
					if ( ! this.isDefault( 'bevel_color_hover' ) ) {
						customVars.button_bevel_color_hover = this.values.bevel_color_hover;
					}

					if ( 'default' !==  this.values.color ) {
						customVars.button_accent_color = this.values.accent_color;
						if ( '' !== this.values.border_color && ! this.isDefault( 'border_color' ) ) {
							customVars.button_border_color = this.values.border_color;
						}

						if ( 'string' === typeof this.values.old_text_color && '' !== this.values.old_text_color ) {
							customVars.button_accent_hover_color = this.values.old_text_color;
						} else if ( '' !== this.values.accent_hover_color ) {
							customVars.button_accent_hover_color = this.values.accent_hover_color;
						} else if ( '' !== this.values.accent_color && ! this.isDefault( 'accent_color' ) ) {
							customVars.button_accent_hover_color = this.values.accent_color;
						}

						if ( '' !== this.values.border_hover_color ) {
							customVars.button_border_hover_color = this.values.border_hover_color;
						} else if ( '' !== this.values.accent_color ) {
							customVars.button_border_hover_color = this.values.accent_color;
						}
					}

					if ( '' !==  this.values.border_width && 'custom' === this.values.color && ! this.values.default_border_width ) {
						customVars[ 'button_border_width-top' ]    = this.values.border_top;
						customVars[ 'button_border_width-right' ]  = this.values.border_right;
						customVars[ 'button_border_width-bottom' ] = this.values.border_bottom;
						customVars[ 'button_border_width-left' ]   = this.values.border_left;
					}

					if ( ! this.isDefault( 'border_radius_top_left' ) ) {
						customVars[ 'button-border-radius-top-left' ]  = this.values.border_radius_top_left;
					}
					if ( ! this.isDefault( 'border_radius_top_right' ) ) {
						customVars[ 'button-border-radius-top-right' ]    = this.values.border_radius_top_right;
					}
					if ( ! this.isDefault( 'border_radius_bottom_right' ) ) {
						customVars[ 'button-border-radius-bottom-right' ] = this.values.border_radius_bottom_right;
					}
					if ( ! this.isDefault( 'border_radius_bottom_left' ) ) {
						customVars[ 'button-border-radius-bottom-left' ] = this.values.border_radius_bottom_left;
					}

					if ( 'default' !== this.values.color ) {
						if ( ! this.isDefault( 'linear_angle' ) ) {
							customVars.button_gradient_angle = parseFloat( this.values.linear_angle ) + 'deg';
						}
						if ( ! this.isDefault( 'gradient_start_position' ) ) {
							customVars.button_gradient_start = parseFloat( this.values.gradient_start_position ) + '%';
						}
						if ( ! this.isDefault( 'gradient_end_position' ) ) {
							customVars.button_gradient_end = parseFloat( this.values.gradient_end_position ) + '%';
						}

						if ( 'string' === typeof this.values.gradient_colors && '' !== this.values.gradient_colors ) {
							// Checking for deprecated separators.
							if ( this.values.gradient_colors.includes( ';' ) ) {
								grad_colors = this.values.gradient_colors.split( ';' );
							} else {
								grad_colors = this.values.gradient_colors.split( '|' );
							}

							// Only one, just use that as background color, no gradient.
							if ( 1 === grad_colors.length || '' === grad_colors[ 1 ] || grad_colors[ 0 ] === grad_colors[ 1 ] ) {
								customVars.button_gradient_top_color    = grad_colors[ 0 ];
								customVars.button_gradient_bottom_color = grad_colors[ 0 ];
							} else {
								customVars.button_gradient_top_color    = grad_colors[ 0 ];
								customVars.button_gradient_bottom_color = grad_colors[ 1 ];
								this.values.has_gradient                   = true;

								if ( 'linear' !==  this.values.gradient_type ) {
									customVars.button_gradient = 'radial-gradient(circle at ' + this.values.radial_direction + ',' + grad_colors[ 0 ] + ' ' + this.values.gradient_start_position + '%,' + grad_colors[ 1 ] + ' ' + this.values.gradient_end_position + '%)';
								}
							}
						}

						if ( 'string' === typeof this.values.gradient_hover_colors && '' !== this.values.gradient_hover_colors ) {

							// Checking for deprecated separators.
							if ( this.values.gradient_hover_colors.includes( ';' ) ) {
								grad_hover_colors = this.values.gradient_hover_colors.split( ';' );
							} else {
								grad_hover_colors = this.values.gradient_hover_colors.split( '|' );
							}

							if ( 1 === grad_hover_colors.length || '' === grad_hover_colors[ 1 ] || grad_hover_colors[ 0 ] === grad_hover_colors[ 1 ] ) {
								customVars.button_gradient_top_color_hover    = grad_hover_colors[ 0 ];
								customVars.button_gradient_bottom_color_hover = grad_hover_colors[ 0 ];
							} else {
								customVars.button_gradient_top_color_hover    = grad_hover_colors[ 0 ];
								customVars.button_gradient_bottom_color_hover = grad_hover_colors[ 1 ];
								this.values.has_gradient                         = true;

								if ( 'linear' !==  this.values.gradient_type ) {
									customVars.button_gradient_hover = 'radial-gradient(circle at ' +  this.values.radial_direction + ',' + grad_hover_colors[ 0 ] + ' ' +  this.values.gradient_start_position + '%,' + grad_hover_colors[ 1 ] + ' ' +  this.values.gradient_end_position + '%)';
								}
							}
						}
					}
				}

				if ( !this.isDefault( 'text_transform' ) && '' !==  this.values.text_transform ) {
					customVars.button_text_transform = this.values.text_transform;
				}

				if ( '' === this.values.size ) {
					if ( ! this.isDefault( 'font_size' ) ) {
						customVars.button_font_size =  _.fusionGetValueWithUnit( this.values.font_size );
					}

					if ( ! this.isDefault( 'line_height' ) ) {
						customVars.button_line_height = this.values.line_height;
					}

					if ( ! this.isDefault( 'padding_top' ) ) {
						customVars[ 'button_padding-top' ] =  _.fusionGetValueWithUnit( this.values.padding_top );
					}
					if ( ! this.isDefault( 'padding_right' ) ) {
						customVars[ 'button_padding-right' ] =  _.fusionGetValueWithUnit( this.values.padding_right );
					}
					if ( ! this.isDefault( 'padding_bottom' ) ) {
						customVars[ 'button_padding-bottom' ] =  _.fusionGetValueWithUnit( this.values.padding_bottom );
					}
					if ( ! this.isDefault( 'padding_left' ) ) {
						customVars[ 'button_padding-left' ] =  _.fusionGetValueWithUnit( this.values.padding_left );
					}
				}

				if ( ! this.isDefault( 'letter_spacing' ) ) {
					customVars[ 'button_typography-letter-spacing' ] = _.fusionGetValueWithUnit( this.values.letter_spacing );
				}

				text_styles = _.fusionGetFontStyle( 'button_font', this.values, 'object' );
				jQuery.each( text_styles, function( rule, value ) {
					customVars[ 'button_typography-' + rule ] = value;
				} );

				if ( ! this.isDefault( 'margin_top' ) ) {
					customVars[ 'button_margin-top' ] = _.fusionGetValueWithUnit( this.values.margin_top );
				}
				if ( ! this.isDefault( 'margin_right' ) ) {
					customVars[ 'button_margin-right' ] = _.fusionGetValueWithUnit( this.values.margin_right );
				}
				if ( ! this.isDefault( 'margin_bottom' ) ) {
					customVars[ 'button_margin-bottom' ] = _.fusionGetValueWithUnit( this.values.margin_bottom );
				}
				if ( ! this.isDefault( 'margin_left' ) ) {
					customVars[ 'button_margin-left' ] = _.fusionGetValueWithUnit( this.values.margin_left );
				}

				return this.getCustomCssVars( customVars, false );

			}
		} );
	} );
}( jQuery ) );
