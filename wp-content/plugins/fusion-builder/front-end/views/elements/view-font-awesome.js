/* global fusionAllElements, FusionApp, FusionPageBuilderApp, fusionAppConfig */
var FusionPageBuilder = FusionPageBuilder || {};

( function() {

	jQuery( document ).ready( function() {

		// Font Awesome Element View.
		FusionPageBuilder.fusion_fontawesome = FusionPageBuilder.ElementView.extend( {

			/**
			 * Runs when element is first init.
			 *
			 * @since 2.0
			 * @return {void}
			 */
			onInit: function() {
				var params = this.model.get( 'params' );

				// Check for newer hover params.  If unset but regular is, copy from there.
				if ( 'object' === typeof params ) {
					if ( 'undefined' === typeof params.iconcolor_hover && 'string' === typeof params.iconcolor ) {
						params.iconcolor_hover = params.iconcolor;
					}
					if ( 'undefined' === typeof params.circlecolor_hover && 'string' === typeof params.circlecolor ) {
						params.circlecolor_hover = params.circlecolor;
					}
					if ( 'undefined' === typeof params.circlebordercolor_hover && 'string' === typeof params.circlebordercolor ) {
						params.circlebordercolor_hover = params.circlebordercolor;
					}
					this.model.set( 'params', params );
				}
			},

			/**
			 * Runs after view DOM is patched.
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
				var params = this.model.get( 'params' ),
					alignment = '';

				this.$el.removeClass( 'fusion-element-alignment-right fusion-element-alignment-left fusion-element-alignment-textflow' );

				if ( 'undefined' !== typeof params.alignment ) {
					alignment = params.alignment;

					// Text-flow.
					if ( '' === alignment ) {
						alignment = 'left';

						if ( jQuery( 'body' ).hasClass( 'rtl' ) ) {
							alignment = 'right';
						}

						this.$el.addClass( 'fusion-element-alignment-textflow' );
					}
				}

				if ( alignment && ( 'right' === alignment || 'left' === alignment ) ) {
					this.$el.addClass( 'fusion-element-alignment-' + alignment );
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

				this.validateValues( atts.values );
				this.isRTL         = jQuery( 'body' ).hasClass( 'rtl' ),
				attributes.attr    = this.buildAttr( atts.values );
				attributes.cid     = this.model.get( 'cid' );
				attributes.output  = atts.values.element_content;
				attributes.hasLink = 'string' === typeof atts.values.link && '' !==  atts.values.link;

				return attributes;
			},

			get_style_vars: function( values ) {
				var cssVars = [
						'iconcolor',
						'iconcolor_hover'
					],
					legacyIcon = false,
					customCSSVars = {};

				values.circle_yes_font_size = 'undefined' !== values.bg_size && '-1' !== values.bg_size ? values.font_size : values.font_size * 0.88;
				values.height               = 'undefined' !== values.bg_size && '-1' !== values.bg_size ? parseInt( values.bg_size ) : values.font_size * 1.76;
				values.line_height          = values.height - ( 2 * parseInt( values.circlebordersize ) );
				values.icon_margin          = values.font_size * 0.5;
				values.circlebordersize     = _.fusionValidateAttrValue( values.circlebordersize, 'px' );
				this.values = values;

				if ( 'yes' === values.circle ) {
					cssVars.push( 'circlecolor' );
					cssVars.push( 'circlecolor_hover' );
					cssVars.push( 'circlebordercolor' );
					cssVars.push( 'circlebordercolor_hover' );
					cssVars.push( 'circlebordersize' );

					customCSSVars.font_size = values.circle_yes_font_size + 'px';

					customCSSVars.width  = values.height + 'px';
					customCSSVars.height = values.height + 'px';
					customCSSVars.line_height = values.line_height + 'px';

					if ( ! this.isDefault( 'border_radius_top_left' ) ) {
						customCSSVars.border_radius_top_l = values.border_radius_top_left;
					}
					if ( ! this.isDefault( 'border_radius_top_right' ) ) {
						customCSSVars.border_radius_top_r = values.border_radius_top_right;
					}
					if ( ! this.isDefault( 'border_radius_bottom_right' ) ) {
						customCSSVars.border_radius_bot_r = values.border_radius_bottom_right;
					}
					if ( ! this.isDefault( 'border_radius_bottom_left' ) ) {
						customCSSVars.border_radius_bot_l = values.border_radius_bottom_left;
					}
				} else {
					customCSSVars.font_size = values.font_size + 'px';
				}

				// Check if an old icon shortcode is used, where no margin option is present, or if all margins were left empty.
				if ( 'undefined' === typeof values.margin_left || ( '' === values.margin_top && '' === values.margin_right && '' === values.margin_bottom && '' === values.margin_left ) ) {
					legacyIcon = true;
				}
				if ( legacyIcon ) {
					if ( 'left' === values.alignment ) {
						values.icon_margin_position = 'right';
					} else if ( 'right' === values.alignment ) {
						values.icon_margin_position = 'left';
					} else {
						values.icon_margin_position = FusionPageBuilderApp.$el.hasClass( 'rtl' ) ? 'left' : 'right';
					}

					if ( 'center' === values.alignment ) {
						customCSSVars.margin_top    = 0;
						customCSSVars.margin_right  = 0;
						customCSSVars.margin_bottom = 0;
						customCSSVars.margin_left   = 0;
					} else {
						customCSSVars[ 'margin_' + values.icon_margin_position ] = values.icon_margin + 'px';
					}
				} else {
					cssVars.push( 'margin_top' );
					cssVars.push( 'margin_right' );
					cssVars.push( 'margin_bottom' );
					cssVars.push( 'margin_left' );
				}

				// Responsive Alignment.
				[ 'large', 'medium', 'small' ].forEach( function( size ) {
					var alignStyles = '',
						alignKey    = ( 'large' === size ? 'alignment' : 'alignment_' + size );

					if ( '' !== values[ alignKey ] ) {
						// RTL adjust.
						if ( this.isRTL && 'center' !== values[ alignKey ] ) {
							values[ alignKey ] = ( 'left' === values[ alignKey ] ? 'right' : 'left' );
						}
						if ( 'left' === values[ alignKey ] ) {
							alignStyles = 'flex-start';
						} else if ( 'right' === values[ alignKey ] ) {
							alignStyles = 'flex-end';
						} else {
							alignStyles = 'center';
						}
					}

					if ( '' === alignStyles ) {
						return;
					}

					if ( 'large' === size ) {
						customCSSVars[ 'align-self' ] = alignStyles;
					} else if ( 'medium' === size ) {
						customCSSVars[ 'md-align-self' ] = alignStyles;
					} else if ( 'small' === size ) {
						customCSSVars[ 'sm-align-self' ] = alignStyles;
					}
				} );

				return this.getCssVarsForOptions( cssVars ) + this.getCustomCssVars( customCSSVars );
			},

			/**
			 * Modify values.
			 *
			 * @since 2.0
			 * @param {Object} values - The values.
			 * @return {void}
			 */
			validateValues: function( values ) {
				var corners = [
					'top_left',
					'top_right',
					'bottom_right',
					'bottom_left'
				];

				values.font_size = _.fusionValidateAttrValue( this.convertDeprecatedSizes( values.size ), '' );

				_.each( corners, function( corner ) {
					if ( 'undefined' !== typeof values[ 'border_radius_' + corner ] && '' !== values[ 'border_radius_' + corner ] ) {
						values[ 'border_radius_' + corner ] = _.fusionGetValueWithUnit( values[ 'border_radius_' + corner ] );
					} else {
						values[ 'border_radius_' + corner ] = '0px';
					}
				} );
			},

			/**
			 * Converts deprecated font sizes.
			 *
			 * @since 2.0
			 * @param {string} size - The size (small|medium|large).
			 * @return {string}
			 */
			convertDeprecatedSizes: function( size ) {
				switch ( size ) {
					case 'small':
						return '10px';
					case 'medium':
						return '18px';
					case 'large':
						return '40px';
					default:
						return size;
				}
			},

			/**
			 * Builds attributes.
			 *
			 * @since 2.0
			 * @param {Object} values - The values.
			 * @return {Object}
			 */
			buildAttr: function( values ) {
				var attr                    = {};

				attr = {
					class: 'fb-icon-element-live-' + this.model.get( 'cid' ) + ' fb-icon-element fontawesome-icon ' + _.fusionFontAwesome( values.icon ) + ' circle-' + values.circle,
					'aria-hidden': 'true'
				};
				attr = _.fusionVisibilityAtts( values.hide_on_mobile, attr );

				attr[ 'class' ] += _.fusionGetStickyClass( values.sticky_display );

				attr.style = this.get_style_vars( values );

				if ( '' === values.alignment ) {
					attr[ 'class' ] += ' fusion-text-flow';
				}

				if ( values.rotate ) {
					attr[ 'class' ] += ' fa-rotate-' + values.rotate;
				}

				if ( 'yes' === values.spin ) {
					attr[ 'class' ] += ' fa-spin';
				}

				if ( values.flip ) {
					attr[ 'class' ] += ' fa-flip-' + values.flip;
				}

				// Link related parameters.
				if ( '' !== values.link ) {
					attr[ 'class' ]  += ' fusion-link';
					attr.href    = values.link;
					attr.target  = values.linktarget;

					if ( '_blank' === values.linktarget ) {
						attr.rel = 'noopener noreferrer';
					}
				}

				if ( 'pulsate' === values.icon_hover_type || 'slide' === values.icon_hover_type ) {
					attr[ 'class' ] += ' icon-hover-animation-' + values.icon_hover_type;
				}

				if ( values[ 'class' ] ) {
					attr[ 'class' ] += ' ' + values[ 'class' ];
				}

				if ( values.id ) {
					attr.id = values.id;
				}

				attr = _.fusionAnimations( values, attr );

				return attr;
			},

			/**
			 * Runs just after render on cancel.
			 *
			 * @since 3.5
			 * @return null
			 */
			beforeGenerateShortcode: function() {
				var elementType = this.model.get( 'element_type' ),
					options     = fusionAllElements[ elementType ].params,
					values      = jQuery.extend( true, {}, fusionAllElements[ elementType ].defaults, _.fusionCleanParameters( this.model.get( 'params' ) ) ),
					iconWithoutFusionPrefix;

				if ( 'object' !== typeof options ) {
					return;
				}

				// If images needs replaced lets check element to see if we have media being used to add to object.
				if ( 'undefined' !== typeof FusionApp.data.replaceAssets && FusionApp.data.replaceAssets && ( 'undefined' !== typeof FusionApp.data.fusion_element_type || 'fusion_template' === FusionApp.getPost( 'post_type' ) ) ) {

					this.mapStudioImages( options, values );

				if ( '' !== values.icon && 'fusion-prefix-' === values.icon.substr( 0, 14 ) ) {
						if ( 'undefined' !== typeof fusionAppConfig.customIcons ) {
							iconWithoutFusionPrefix = values.icon.substr( 14 );

							// TODO: try to optimize this check.
							jQuery.each( fusionAppConfig.customIcons, function( iconPostName, iconSet ) {
								if ( 0 === iconWithoutFusionPrefix.indexOf( iconSet.css_prefix ) ) {
									FusionPageBuilderApp.mediaMap.icons[ iconSet.post_id ] = iconSet.css_prefix;
									return false;
								}
							} );
						}
					}
				}
			}
		} );
	} );
}( jQuery ) );
