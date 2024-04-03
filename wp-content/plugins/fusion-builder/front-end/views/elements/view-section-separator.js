/* global FusionPageBuilderApp, fusionAllElements */
var FusionPageBuilder = FusionPageBuilder || {};

( function() {

	jQuery( document ).ready( function() {

		// Section separator view.
		FusionPageBuilder.fusion_section_separator = FusionPageBuilder.ElementView.extend( {

			/**
			 * BG Image Separator divider types.
			 *
			 * @since 3.2
			 * @return {Object}
			 */
			bgImageSeparators: [ 'grunge', 'music', 'waves_brush', 'paper', 'squares', 'circles', 'paint', 'grass', 'splash', 'custom' ],

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
			afterPatch: function() { // eslint-disable-line no-empty-function
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

				// Validate values.
				this.validateValues( atts.values );

				this.extras = atts.extras;

				// Create attribute objects
				attributes.attr             = this.buildAtts( atts.values );
				attributes.attrSvgWrapper   = this.buildSvgWrapperAtts( atts.values );
				attributes.attrSpacer       = this.buildSpacerAtts( atts.values );
				attributes.attrSpacerHeight = this.buildSpacerHeightAtts( atts.values );
				attributes.attrCandyArrow   = this.buildCandyArrowAtts( atts.values );
				attributes.attrCandy        = this.buildCandyAtts( atts.values );
				attributes.attrSVG          = this.buildSVGAtts( atts.values );
				attributes.attrSVGBGImage   = this.buildSVGBGImageAtts( atts.values );
				attributes.attrButton       = this.buildButtonAtts( atts.values );
				attributes.attrRoundedSplit = this.buildRoundedSplitAtts( atts.values );
				attributes.values           = atts.values;
				attributes.custom_svg       = atts.values.custom_svg ? this.getCustomSvg( atts.values ).svg : '';
				attributes.spacerHeight		= this.spacerHeight( atts.values );

				return attributes;
			},

			/**
			 * Modifies the values.
			 *
			 * @since 2.0
			 * @param {Object} values - The values object.
			 * @return {void}
			 */
			validateValues: function( values ) {
				if ( ! isNaN( values.bordersize ) ) {
					values.bordersize = _.fusionGetValueWithUnit( values.bordersize );
				}

				values.borderSizeWithoutUnits = parseInt( values.bordersize.match( /\d+/ ), 10 );

				if ( 'horizon' === values.divider_type ) {
					values.yMin = 'top' === values.divider_candy ? '-0.5' : '0';
				} else if ( 'hills_opacity' === values.divider_type ) {
					values.yMin = 'top' === values.divider_candy ? '-0.5' : '0';
				} else if ( 'waves' === values.divider_type ) {
					values.yMin = 'top' === values.divider_candy ? '54' : '1';
				} else if ( 'waves_opacity' === values.divider_type ) {
					values.yMin = 'top' === values.divider_candy ? '0' : '1';
				}

				values.add_boxed_markup = false;
			},

			/**
			 * Builds attributes.
			 *
			 * @since 2.0
			 * @param {Object} values - The values.
			 * @return {Object}
			 */
			buildAtts: function( values ) {
				var attr = _.fusionVisibilityAtts( values.hide_on_mobile, {
						class: 'fusion-section-separator section-separator ' + values.divider_type + ' fusion-section-separator-' + this.model.get( 'cid' ),
						style: this.getStyleVars( values )
					} );

				if ( 'rounded-split' === values.divider_type ) {
					attr[ 'class' ] += ' rounded-split-separator';
				}

				if ( '' !== values[ 'class' ] ) {
					attr[ 'class' ] += ' ' + values[ 'class' ];
				}

				if ( '' !== values.id ) {
					attr.id = values.id;
				}

				// If we are in studio, and color is global var.
				if ( 'undefined' !== typeof window.awbOriginalPalette && values.backgroundcolor.includes( '--' ) ) {
					attr[ 'data-var' ]     = values.backgroundcolor;
					attr[ 'data-color' ]   = window.awbPalette.getRealColor( values.backgroundcolor ).replaceAll( ' ', '' );
				}

				return attr;
			},

			getStyleVars: function( values ) {
				var cssVars             = [],
					customCssVars       = {},
					self                = this,
					hundredPxSeparators = [ 'slant', 'bigtriangle', 'curved', 'big-half-circle', 'clouds' ];
				this.values = values;

				// Border.
				if ( 'triangle' === values.divider_type ) {
					if ( '' !== values.bordercolor ) {
						if ( 'bottom' === values.divider_candy || 'top' === values.divider_candy ) {
							customCssVars[ 'border_' + values.divider_candy ] = values.bordersize + ' solid ' + values.bordercolor + ';';
						} else if ( -1 !== values.divider_candy.indexOf( 'top' ) && -1 !== values.divider_candy.indexOf( 'bottom' ) ) {
							customCssVars.border = values.bordersize + ' solid ' + values.bordercolor + ';';
						}
					}
				}

				// Spacer height/padding-top.
				if ( -1 !== jQuery.inArray( values.divider_type, hundredPxSeparators ) ) {
					customCssVars[ 'spacer-height' ] = '99px';
				} else if ( 'triangle' === values.divider_type ) {
					if ( values.bordercolor ) {
						if ( 'bottom' === values.divider_candy || 'top' === values.divider_candy ) {
							customCssVars[ 'spacer-height' ] = values.bordersize;
						} else if ( -1 !== values.divider_candy.indexOf( 'top' ) && -1 !== values.divider_candy.indexOf( 'bottom' ) ) {
							customCssVars[ 'spacer-height' ] = 'calc( ' + values.bordersize + ' * 2 )';
						}
					}
				} else if ( 'rounded-split' === values.divider_type ) {
					customCssVars[ 'spacer-height' ] = '71px';
				} else if ( 'hills_opacity' === values.divider_type ) {
					customCssVars[ 'spacer-padding-top' ] = ( 182 / 1024 * 100 ) + '%';
				} else if ( 'hills' === values.divider_type ) {
					customCssVars[ 'spacer-padding-top' ] = ( 107 / 1024 * 100 ) + '%';
				} else if ( 'horizon' === values.divider_type ) {
					customCssVars[ 'spacer-padding-top' ] = ( 178 / 1024 * 100 ) + '%';
				} else if ( 'waves_opacity' === values.divider_type ) {
					customCssVars[ 'spacer-padding-top' ] = ( 216 / 1024 * 100 ) + '%';
				} else if ( 'waves' === values.divider_type ) {
					customCssVars[ 'spacer-padding-top' ] = ( 162 / 1024 * 100 ) + '%';
				} else if ( -1 !== jQuery.inArray( values.divider_type, this.bgImageSeparators ) ) {
					const defaultSepHeight = 'custom' === values.divider_type && values.custom_svg ? this.getCustomSvg( values ).height : this._getDefaultSepHeight()[ values.divider_type ];
					const height = '' === values.divider_height && 1 < values.divider_repeat ? ( parseInt( defaultSepHeight ) / values.divider_repeat ) + 'px' : defaultSepHeight; // Aspect ratio height.
					customCssVars[ 'spacer-height' ] = height;
				}

				// Hide spacer if 100% width template && 1/1 column.
				const parentColumnView   = FusionPageBuilderApp.getParentColumn( this );
				const parentColumnValues = 'undefined' !== typeof parentColumnView.values ? parentColumnView.values : {};
				const extras             = jQuery.extend( true, {}, fusionAllElements.fusion_section_separator.extras );
				if ( FusionPageBuilderApp.$el.find( '#main' ).hasClass( 'width-100' ) && 'undefined' !== typeof parentColumnValues.type && '1_1' === parentColumnValues.type && 'wide' !== extras.layout ) {
					customCssVars[ 'spacer-display' ] = 'none';
				}

				const parentContainernView  = FusionPageBuilderApp.getParentContainer( this );
				const parentContainerValues = 'undefined' !== typeof parentContainernView.values ? parentContainernView.values : {};
				if ( _.isObject( parentColumnValues ) ) {
					if ( FusionPageBuilderApp.$el.find( '#main' ).hasClass( 'width-100' ) && '1_1' === parentColumnValues.type ) {
						if ( 'boxed' === extras.layout && _.isObject( parentContainerValues ) ) {
							values.add_boxed_markup = true;
							customCssVars[ 'section-separator-pos' ] = 'relative';

							_.each( [ 'large', 'medium', 'small' ], function( size ) {
								const varSize = ( 'large' === size ? '' : '_' + size );

								if ( 'undefined' !== typeof parentContainerValues[ 'padding_left' + varSize ] && 'undefined' !== typeof parentContainerValues[ 'padding_right' + varSize ] && ! _.isEmpty( parentContainerValues[ 'padding_left' + varSize ] ) && ! _.isEmpty( parentContainerValues[ 'padding_right' + varSize ] ) && -1 !== parentContainerValues[ 'padding_left' + varSize ].indexOf( '%' ) && -1 !== parentContainerValues[ 'padding_right' + varSize ].indexOf( '%' ) ) {
									const margin = parseFloat( parentContainerValues[ 'padding_left' + varSize ] ) + parseFloat( parentContainerValues[ 'padding_right' + varSize ] );
									const scale  = ( 100 - margin ) / 100;

									customCssVars[ 'svg-margin-left' + varSize ] = '-' + ( parseFloat( parentContainerValues[ 'padding_left' + varSize ] ) / scale ) + '%';
									customCssVars[ 'svg-margin-right' + varSize ] = '-' + ( parseFloat( parentContainerValues[ 'padding_right' + varSize ] ) / scale ) + '%';
								} else {
									if ( 'undefined' !== typeof parentContainerValues[ 'padding_left' + varSize ] && ! _.isEmpty( parentContainerValues[ 'padding_left' + varSize ] ) ) {
										customCssVars[ 'svg-margin-left' + varSize ] = '-' + parentContainerValues[ 'padding_left' + varSize ];
									}

									if ( 'undefined' !== typeof parentContainerValues[ 'padding_right' + varSize ] && ! _.isEmpty( parentContainerValues[ 'padding_right' + varSize ] ) ) {
										customCssVars[ 'svg-margin-right' + varSize ] = '-' + parentContainerValues[ 'padding_right' + varSize ];
									}

								}
							} );

						}
					}
				}

				if ( _.isObject( parentColumnValues ) ) {
					if ( ! ( FusionPageBuilderApp.$el.find( '#main' ).hasClass( 'width-100' ) && 'boxed' === extras.layout ) ) {
						if ( '1_1' !== parentColumnValues.type ) {
							const columnOuterWidth      = jQuery( parentColumnView.$el ).width();
							const columnWidth           = jQuery( parentColumnView.$el ).children( '.fusion-column-wrapper' ).width();
							_.each( [ 'large', 'medium', 'small' ], function( size ) {
								const varSize = ( 'large' === size ? '' : '_' + size );

								if ( ! _.isEmpty( parentColumnValues[ 'padding_left' + varSize ] ) ) {
									let paddingValueLeft = parentColumnValues[ 'padding_left' + varSize ];
									let paddingValueRight = parentColumnValues[ 'padding_right' + varSize ];

									if ( -1 !== paddingValueLeft.indexOf( '%' ) ) {
										paddingValueLeft = ( parseFloat( paddingValueLeft.replace( '%', '' ) ) / ( columnWidth / columnOuterWidth ) ) + '%';
									}

									if ( -1 !== paddingValueRight.indexOf( '%' ) ) {
										paddingValueRight = ( parseFloat( paddingValueRight.replace( '%', '' ) ) / ( columnWidth / columnOuterWidth ) ) + '%';
									}

									customCssVars[ 'svg-margin-right' + varSize ] = '-' + paddingValueLeft;
									customCssVars[ 'svg-margin-left' + varSize ]  = '-' + paddingValueRight;
								}
							} );
						}
					}

				}

				const dividerHeightArr = [];
				if ( _.isObject( parentColumnValues ) ) {

					// Check for custom height.
					_.each( [ 'large', 'medium', 'small' ], function( responsiveSize ) {
						var varSize = ( 'large' === responsiveSize ? '' : '_' + responsiveSize );
						var key = 'divider_height' + varSize;

						// Skip for specific type.
						if ( 'triangle' === values.divider_type || 'rounded-split' === values.divider_type ) {
							return;
						}

						// Check for flex.
						if ( ! self.flexDisplay() && 'large' !== responsiveSize ) {
							return;
						}

						let dividerHeight = values[ key ];

						if ( '' === dividerHeight && -1 !== jQuery.inArray( values.divider_type, hundredPxSeparators ) && 'large' === responsiveSize ) {
							dividerHeight = '99px';
						}

						// Check for empty value.
						if ( '' === dividerHeight ) {
							return;
						}

						dividerHeightArr[ key ]                     = dividerHeight;
						customCssVars[ key ]                        = dividerHeight;
						customCssVars[ 'spacer-height' + varSize ]  = dividerHeight;
						customCssVars[ 'spacer-padding-top' ] = 'inherit';
					} );
				}

				if ( _.isObject( parentColumnValues ) ) {
					// Background Repeat.
					_.each( [ 'large', 'medium', 'small' ], function( responsiveSize ) {
						var varSize = ( 'large' === responsiveSize ? '' : '_' + responsiveSize ),
							key = 'divider_repeat' + varSize,
							keyDividerH = 'divider_height' + varSize,
							height;

						// Only allow for SVG Background type.
						if ( -1 === jQuery.inArray( values.divider_type, self.bgImageSeparators ) ) {
							return;
						}

						// Check for flex.
						if ( ! self.flexDisplay() && 'large' !== responsiveSize ) {
							return;
						}

						// Check for empty value.
						if ( '' === values[ key ] ) {
							return;
						}

						self.dynamic_css  = {};


						height = '' !== values[ keyDividerH ] ? values[ keyDividerH ] : self.getDividerHeightResponsive( keyDividerH, dividerHeightArr );
						height = '' === values[ keyDividerH ] && 1 < values[ key ] ? ( parseInt( height ) / values[ key ] ) + 'px' : height; // Aspect ratio height.

						if ( _.contains( height, '%' ) ) {
							customCssVars[ 'bg-size' + varSize ] = parseFloat( 100 / values[ key ] ) + '% 100%';
						} else {
							height = 0 < parseInt( height ) ? height : '100%';
							customCssVars[ 'bg-size' + varSize ] = parseFloat( 100 / values[ key ] ) + '% ' + height;
						}
					} );
				}

				// Margin.
				cssVars.margin_top = { 'callback': _.fusionGetValueWithUnit };
				cssVars.margin_right = { 'callback': _.fusionGetValueWithUnit };
				cssVars.margin_bottom = { 'callback': _.fusionGetValueWithUnit };
				cssVars.margin_left = { 'callback': _.fusionGetValueWithUnit };

				if ( 'bigtriangle' === values.divider_type || 'slant' === values.divider_type || 'big-half-circle' === values.divider_type || 'clouds' === values.divider_type || 'curved' === values.divider_type ) {
					customCssVars[ 'sep-padding' ] = '0';
					customCssVars[ 'svg-padding' ] = '0';
				} else if ( 'horizon' === values.divider_type || 'waves' === values.divider_type || 'waves_opacity' === values.divider_type || 'hills' === values.divider_type || 'hills_opacity' === values.divider_type ) {
					customCssVars[ 'sep-font-size' ]   = '0';
					customCssVars[ 'sep-line-height' ] = '0';
				}

				if ( 'slant' === values.divider_type && 'bottom' === values.divider_candy ) {
					customCssVars[ 'svg-tag-margin-bottom' ]   = '-3px';
					customCssVars[ 'sep-svg-display' ] = 'block';
				}

				if ( 'triangle' === values.divider_type ) {
					if ( ! values.icon_color ) {
						values.icon_color = values.bordercolor;
					}

					customCssVars.icon_color = values.icon_color;

					if ( 1 < values.borderSizeWithoutUnits ) {
						if ( 'bottom' === values.divider_candy ) {
							customCssVars[ 'icon-top' ]    = 'auto';
							customCssVars[ 'icon-bottom' ] = '-' + ( values.borderSizeWithoutUnits + 10 ) + 'px';
						} else if ( 'top' === values.divider_candy ) {
							customCssVars[ 'icon-top' ] = '-' + ( values.borderSizeWithoutUnits + 10 ) + 'px';
						}
					}
				}


				return this.getCssVarsForOptions( cssVars ) + this.getCustomCssVars( customCssVars );
			},

			/**
			 * Builds attributes.
			 *
			 * @since 3.0
			 * @param {Object} values - The values.
			 * @return {Object}
			 */
			buildSvgWrapperAtts: function( values ) {
				var attr = {
						class: 'fusion-section-separator-svg'
					},
					parentColumnView      = FusionPageBuilderApp.getParentColumn( this ),
					parentColumnValues    = 'undefined' !== typeof parentColumnView.values ? parentColumnView.values : {},
					extras                = jQuery.extend( true, {}, fusionAllElements.fusion_section_separator.extras ),
					parentContainernView  = FusionPageBuilderApp.getParentContainer( this ),
					parentContainerValues = 'undefined' !== typeof parentContainernView.values ? parentContainernView.values : {};

				values.additional_styles = '';

				if ( _.isObject( parentColumnValues ) ) {
					if ( FusionPageBuilderApp.$el.find( '#main' ).hasClass( 'width-100' ) && '1_1' === parentColumnValues.type && ( 'boxed' !== extras.layout || ! _.isObject( parentContainerValues ) ) ) {
						attr[ 'class' ] += ' fusion-section-separator-fullwidth';
					}
				}

				return attr;
			},

			/**
			 * Builds attributes.
			 *
			 * @since 3.0
			 * @param {Object} values - The values.
			 * @return {Object}
			 */
			buildSpacerAtts: function( values ) { // eslint-disable-line no-unused-vars
				var attrSpacer = {
						class: 'fusion-section-separator-spacer'
					},
					parentColumnView   = FusionPageBuilderApp.getParentColumn( this ),
					parentColumnValues = 'undefined' !== typeof parentColumnView.values ? parentColumnView.values : {},
					extras             = jQuery.extend( true, {}, fusionAllElements.fusion_section_separator.extras );

				// 100% width template && 1/1 column.
				if ( FusionPageBuilderApp.$el.find( '#main' ).hasClass( 'width-100' ) && 'undefined' !== typeof parentColumnValues.type && '1_1' === parentColumnValues.type && 'wide' === extras.layout ) {
					attrSpacer[ 'class' ] += ' fusion-section-separator-fullwidth';
				}

				return attrSpacer;

			},

			/**
			 * Builds attributes.
			 *
			 * @since 3.0
			 * @return {Object}
			 */
			buildSpacerHeightAtts: function() {
				var attrSpacerHeight = {
						class: 'fusion-section-separator-spacer-height'
					};
				return attrSpacerHeight;
			},

			/**
			 * Spacer height.
			 *
			 * @since 3.6
			 * @param {Object} values - The values.
			 * @return {String} Spacer height.
			 */
			spacerHeight( values ) {
				const defaultSepHeight = 'custom' === values.divider_type && values.custom_svg ? this.getCustomSvg( values ).height : this._getDefaultSepHeight()[ values.divider_type ];
				const height = '' === values.divider_height && 1 < values.divider_repeat ? ( parseInt( defaultSepHeight ) / values.divider_repeat ) + 'px' : defaultSepHeight; // Aspect ratio height.

				return height;
			},

			/**
			 * Builds attributes.
			 *
			 * @since 2.0
			 * @param {Object} values - The values.
			 * @return {Object}
			 */
			buildCandyAtts: function( values ) {
				var attrCandy = {
					class: 'divider-candy'
				};

				if ( 'bottom' === values.divider_candy ) {
					attrCandy[ 'class' ] += ' bottom';
					attrCandy.style = 'bottom:-' + ( values.borderSizeWithoutUnits + 20 ) + 'px;border-bottom:1px solid ' + values.bordercolor + ';border-left:1px solid ' + values.bordercolor + ';';
				} else if ( 'top' === values.divider_candy ) {
					attrCandy[ 'class' ] += ' top';
					attrCandy.style = 'top:-' + ( values.borderSizeWithoutUnits + 20 ) + 'px;border-bottom:1px solid ' + values.bordercolor + ';border-left:1px solid ' + values.bordercolor + ';';

					// Modern setup, that won't work in IE8.
				} else if ( -1 !== values.divider_candy.indexOf( 'top' ) && -1 !== values.divider_candy.indexOf( 'bottom' ) ) {
					attrCandy[ 'class' ] += ' both';
					attrCandy.style = 'background-color:' + values.backgroundcolor + ';border:1px solid ' + values.bordercolor + ';';
				}

				if ( -1 !== values.divider_candy.indexOf( 'top' ) && -1 !== values.divider_candy.indexOf( 'bottom' ) ) {
					attrCandy[ 'class' ] += ' triangle';
				}
				return attrCandy;
			},

			/**
			 * Builds attributes.
			 *
			 * @since 2.0
			 * @param {Object} values - The values.
			 * @return {Object}
			 */
			buildCandyArrowAtts: function( values ) {
				var attrCandyArrow = {
					class: 'divider-candy-arrow'
				};

				// For borders of size 1, we need to hide the border line on the arrow, thus we set it to 0.
				var arrowPosition = values.borderSizeWithoutUnits;
				if ( 1 === arrowPosition ) {
					arrowPosition = 0;
				}

				if ( 'bottom' === values.divider_candy ) {
					attrCandyArrow[ 'class' ] += ' bottom';
					attrCandyArrow.style  = 'top:' + arrowPosition + 'px;border-top-color: ' + values.backgroundcolor + ';';
				} else if ( 'top' === values.divider_candy ) {
					attrCandyArrow[ 'class' ] += ' top';
					attrCandyArrow.style  = 'bottom:' + arrowPosition + 'px;border-bottom-color: ' + values.backgroundcolor + ';';
				}

				return attrCandyArrow;
			},

			/**
			 * Builds attributes.
			 *
			 * @since 2.0
			 * @param {Object} values - The values.
			 * @return {Object}
			 */
			buildSVGAtts: function( values ) {
				var attrSVG = {
					display: 'block'
				};

				attrSVG.fill = jQuery.AWB_Color( values.backgroundcolor ).toRgbaString();

				return attrSVG;
			},

			/**
			 * Builds attributes.
			 *
			 * @since 2.0
			 * @param {Object} values - The values.
			 * @return {Object}
			 */
			buildButtonAtts: function( values ) {
				var attrButton = {};

				if ( '' !== values.icon ) {
					attrButton = {
						class: 'section-separator-icon icon ' + _.fusionFontAwesome( values.icon )
					};
				}

				return attrButton;
			},

			/**
			 * Builds attributes.
			 *
			 * @since 2.0
			 * @param {Object} values - The values.
			 * @return {Object}
			 */
			buildRoundedSplitAtts: function( values ) {
				var attrRoundedSplit = {};

				if ( 'rounded-split' === values.divider_type ) {
					attrRoundedSplit = {
						class: 'rounded-split ' + values.divider_candy,
						style: 'background-color:' + values.backgroundcolor + ';'
					};
				}

				return attrRoundedSplit;
			},

			/**
			 * Builds SVG BG Image attributes.
			 *
			 * @since 3.2
			 * @param {Object} values - The values.
			 * @return {Object}
			 */
			buildSVGBGImageAtts: function( values ) {
				var attrSVG = {
					class: 'fusion-' + values.divider_type + '-candy-sep fusion-section-separator-svg-bg',
					style: ''
				},
				height = this._getDefaultSepHeight()[ values.divider_type ] ? this._getDefaultSepHeight()[ values.divider_type ] : '100px',
				transform = [];

				if ( '' === values.divider_height ) {
					if ( 1 < values.divider_repeat ) {
						height = ( parseInt( height ) / values.divider_repeat ) + 'px';
					}
					attrSVG.style += 'height:' + height + ';';
				}

				if ( 'right' === values.divider_position ) {
					transform.push( 'rotateY(180deg)' );
				} else {
					transform.push( 'rotateY(0)' );
				}

				if ( 'bottom' === values.divider_candy ) {
					transform.push( 'rotateX(180deg)' );
				} else {
					transform.push( 'rotateX(0)' );
				}

				if ( transform.length ) {
					attrSVG.style += 'transform: ' + transform.join( ' ' ) + ' ;';
				}


				return attrSVG;
			},

			/**
			 * Get default height of separators.
			 *
			 * @since 3.2
			 * @return {Object}
			 */
			_getDefaultSepHeight: function() {
				return {
					grunge: '43px',
					music: '297px',
					waves_brush: '124px',
					paper: '102px',
					circles: '164px',
					squares: '140px',
					paint: '80px',
					grass: '195px',
					splash: '65px'
				};
			},

			getDividerHeightResponsive: function( key, hash ) {
				var keys = hash.keys(),
					found_index = _.contains( keys, key );
				if ( false === found_index || 0 === found_index ) {
					return '';
				}
				return keys[ found_index - 1 ];
			},

			/**
			 * Get custom svg
			 *
			 * @since 7.6
			 * @param {Object} values - The values.
			 * @return {Object}
			 */
			getCustomSvg: function( values ) {
				var svg = '';
				const url = values.custom_svg;
				if ( !url ) {
					return {};
				}

				jQuery.ajax( {
					url: url,
					type: 'get',
					dataType: 'html',
					async: false,
					success: function( data ) {
						svg = data;
					}
				} );

				svg = svg.replace( /fill="(.*?)"/ig, `fill="${jQuery.AWB_Color( values.backgroundcolor ).toRgbaString()}"` );

				//get the default height
				const rx = /viewBox="(.*?)"/g;
				const matches = rx.exec( svg );

				const height = matches ? matches[ 1 ].split( ' ' )[ 3 ] + 'px' : '65px';


				return { svg, height };

			}

		} );
	} );
}( jQuery ) );
