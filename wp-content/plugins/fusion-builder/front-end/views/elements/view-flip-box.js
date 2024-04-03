/* global fusionAllElements, FusionPageBuilderElements */
/* eslint no-unused-vars: 0 */

var FusionPageBuilder = FusionPageBuilder || {};

( function() {

	jQuery( document ).ready( function() {

		// Counter flip box view
		FusionPageBuilder.fusion_flip_box = FusionPageBuilder.ChildElementView.extend( {

			/**
			 * Runs during render() call.
			 *
			 * @since 2.0
			 * @return {void}
			 */
			onRender: function() {

				if ( 'undefined' !== typeof this.model.attributes.selectors ) {
					this.model.attributes.selectors[ 'class' ] += ' ' + this.className;
					this.setElementAttributes( this.$el, this.model.attributes.selectors );
				}
			},

			/**
			 * Runs after view DOM is patched.
			 *
			 * @since 2.0
			 * @return {void}
			 */
			afterPatch: function() {

				if ( 'undefined' !== typeof this.model.attributes.selectors ) {
					this.model.attributes.selectors[ 'class' ] += ' ' + this.className;
					this.setElementAttributes( this.$el, this.model.attributes.selectors );
				}

				// Using non debounced version for smoothness.
				this.refreshJs();
			},

			/**
			 * Modify template attributes.
			 *
			 * @since 2.0
			 * @param {Object} atts - The attributes.
			 * @return {Object}
			 */
			filterTemplateAtts: function( atts ) {
				var computedAtts;

				atts.usingDynamicParent = this.isParentHasDynamicContent( atts.parentValues );

				if ( atts.usingDynamicParent ) {
					atts.values.usingDynamicParent = true;
				}

				computedAtts = this.computeAtts( atts.values );

				atts.cid    = this.model.get( 'cid' );
				atts.parent = this.model.get( 'parent' );

				atts.flipBoxShortcodeBackBox  = computedAtts.flipBoxShortcodeBackBox;
				atts.flipBoxAttributes        = computedAtts.flipBoxAttributes;
				atts.flipBoxShortcodeFrontBox = computedAtts.flipBoxShortcodeFrontBox;
				atts.icon_output              = computedAtts.icon_output;
				atts.title_front_output       = computedAtts.title_front_output;
				atts.title_back_output        = computedAtts.title_back_output;
				atts.icon_output              = computedAtts.icon_output;


				return atts;
			},

			/**
			 * Builds attributes.
			 *
			 * @since 2.0
			 * @param {Object} values - The values.
			 * @return {Object}
			 */
			computeAtts: function( values ) {
				var parent                       = this.model.get( 'parent' ),
					parentModel                  = FusionPageBuilderElements.find( function( model ) {
						return model.get( 'cid' ) == parent;
					} ),
					parentValues                 = 'undefined' !== typeof parentModel ? jQuery.extend( true, {}, fusionAllElements.fusion_flip_boxes.defaults, _.fusionCleanParameters( parentModel.get( 'params' ) ) ) : {},
					params                       = this.model.get( 'params' ),
					style                        = '',
					flipBoxAttributes            = '',
					flipBoxShortcode,
					flipBoxShortcodeIcon         = {
						'aria-hidden': 'true'
					},
					iconOutput                   = '',
					animations                   = '',
					titleTag                     = '',
					flipBoxShortcodeGrafix       = '',
					flipBoxShortcodeHeadingFront = '',
					titleFrontOutput             = '',
					flipBoxShortcodeHeadingBack  = '',
					flipBoxShortcodeBackBox      = '',
					titleBackOutput              = '',
					frontInner                   = '',
					columns                      = '',
					flipBoxShortcodeFrontBox,
					atts,
					alpha;

				values.border_size   = _.fusionValidateAttrValue( values.border_size, 'px' );
				values.border_radius = _.fusionValidateAttrValue( values.border_radius, 'px' );

				// Case when image is set on parent element and icon on child element.
				if ( ( 'undefined' === typeof params.image || '' === params.image ) && ( 'undefined' !== typeof params.icon && '' !== params.icon ) ) {
					values.image = '';
				}

				// Backwards compatibility for when we had image width and height params.
				if ( 'undefined' !== typeof params.image_width && params.image_width ) {
					values.image_width = params.image_width;
				} else {
					values.image_width = values.image_max_width;
				}

				values.image_width  = _.fusionValidateAttrValue( values.image_width, '' );

				if ( 'undefined' !== typeof values.image && ( '' !== values.image || '' !== values.image_id ) ) {

					if ( -1 === parseInt( values.image_width ) ) {
						values.image_width = '35';
					}

					values.image_height = values.image_width;

				} else {
					values.image_width  = '' === values.image_width ? '35' : values.image_width;
					values.image_height = '35';
				}

				if ( 'round' === values.border_radius ) {
					values.border_radius = '50%';
				}

				style             = '';
				iconOutput        = '';
				titleFrontOutput  = '';
				titleBackOutput   = '';
				flipBoxAttributes = {
					class: 'fusion-flip-box',
					tabindex: 0
				};

				flipBoxAttributes[ 'class' ] += ' flip-' + values.flip_direction;

				if ( values.animation_type ) {
					flipBoxAttributes = _.fusionAnimations( values, flipBoxAttributes );
				}

				if ( values.image && '' !== values.image ) {

					iconOutput = '<img src="' + values.image + '" width="' + values.image_width + '" height="' + values.image_height + '" alt="' + values.alt + '" />';

				} else if ( values.icon ) {

					if ( values.image ) {
						flipBoxShortcodeIcon[ 'class' ] = 'image';
					} else if ( values.icon ) {
						flipBoxShortcodeIcon[ 'class' ] = _.fusionFontAwesome( values.icon );
					}

					if ( values.icon_flip ) {
						flipBoxShortcodeIcon[ 'class' ] += ' fa-flip-' + values.icon_flip;
					}

					if ( values.icon_rotate ) {
						flipBoxShortcodeIcon[ 'class' ] += ' fa-rotate-' + values.icon_rotate;
					}

					if ( 'yes' === values.icon_spin ) {
						flipBoxShortcodeIcon[ 'class' ] += ' fa-spin';
					}

					iconOutput = '<i ' + _.fusionGetAttributes( flipBoxShortcodeIcon ) + '></i>';

				}

				if ( '' !== iconOutput ) {

					flipBoxShortcodeGrafix = {
						class: 'flip-box-grafix'
					};

					if ( ! values.image ) {

						if ( 'yes' === values.circle ) {
							flipBoxShortcodeGrafix[ 'class' ] += ' flip-box-circle';
						} else {
							flipBoxShortcodeGrafix[ 'class' ] += ' flip-box-no-circle';
						}
					} else {
						flipBoxShortcodeGrafix[ 'class' ] += ' flip-box-image';
					}

					iconOutput = '<div ' + _.fusionGetAttributes( flipBoxShortcodeGrafix ) + '>' + iconOutput + '</div>';
				}

				let title_front = values.title_front;
				let title_back = values.title_back;

				if ( values.usingDynamicParent ) {
					title_front = 'Front Title';
					title_back = 'Back Title';
				}

				if ( '' !== title_front ) {
					flipBoxShortcodeHeadingFront = {
						class: 'flip-box-heading',
						style: this.getFrontHeadingStyleVars( values )
					};

					jQuery.each( _.fusionGetFontStyle( 'front_title_font', values, 'object' ), function( rule, value ) {
						flipBoxShortcodeHeadingFront.style += rule + ':' + value + ';';
					} );

					if ( ! values.text_front ) {
						flipBoxShortcodeHeadingFront[ 'class' ] += ' without-text';
					}

					titleTag = this.getTitleTag( values, 'front' );
					titleFrontOutput = '<' + titleTag + ' ' + _.fusionGetAttributes( flipBoxShortcodeHeadingFront ) + '>' + title_front + '</' + titleTag + '>';
				}

				if ( '' !== title_back ) {
					flipBoxShortcodeHeadingBack = {
						class: 'flip-box-heading-back',
						style: this.getBackHeadingStyleVars( values )
					};

					titleTag = this.getTitleTag( values, 'back' );
					titleBackOutput = '<' + titleTag + ' ' + _.fusionGetAttributes( flipBoxShortcodeHeadingBack ) + '>' + title_back + '</' + titleTag + '>';
				}

				frontInner = '<div class="flip-box-front-inner">' + iconOutput + titleFrontOutput + values.text_front + '</div>';

				// flipBoxShortcodeFrontBox Attributes.
				flipBoxShortcodeFrontBox = {
					class: 'flip-box-front',
					style: this.getChildStyleVars( values, 'front' )
				};

				// flipBoxShortcodeBackBox Attributes.
				flipBoxShortcodeBackBox = {
					class: 'flip-box-back',
					style: this.getChildStyleVars( values, 'back' )
				};

				// flipBoxShortcode Attributes.
				columns = 1;
				if ( parentValues.columns ) {
					columns = 12 / parseInt( parentValues.columns, 10 );
				}

				flipBoxShortcode = {
					class: 'fusion-flip-box-wrapper fusion-column col-lg-' + columns + ' col-md-' + columns + ' col-sm-' + columns
				};

				if ( 5 === parseInt( parentValues.columns, 10 ) ) {
					flipBoxShortcode[ 'class' ] = 'fusion-flip-box-wrapper col-lg-2 col-md-2 col-sm-2';
				}

				if ( '' !== values[ 'class' ] ) {
					flipBoxShortcode[ 'class' ] += ' ' + values[ 'class' ];
				}

				if ( '' !== values.id ) {
					flipBoxShortcode.id = values.id;
				}

				this.model.set( 'selectors', flipBoxShortcode );

				atts = {};

				atts.flipBoxShortcodeBackBox  = flipBoxShortcodeBackBox;
				atts.flipBoxAttributes        = flipBoxAttributes;
				atts.flipBoxShortcodeFrontBox = flipBoxShortcodeFrontBox;
				atts.icon_output              = iconOutput;
				atts.title_front_output       = titleFrontOutput;
				atts.title_back_output        = titleBackOutput;
				atts.icon_output              = iconOutput;

				return atts;
			},

			/**
			 * Get the style vars for a child element.
			 *
			 * @since 3.9
			 * @param {Object} values
			 * @param {string} childType
			 * @returns
			 */
			getChildStyleVars: function( values, childType ) {
				var cssVars = [ 'icon_color', 'border_color', 'border_size', 'border_radius' ],
					cssCustomVars = {},
					alpha;
				this.values = values;

				if ( ! values.image && values.circle ) {
					cssVars.push( 'circle_color' );
					cssVars.push( 'circle_border_color' );
				}

				if ( 'front' === childType ) {
					cssVars.push( 'background_color_front' );
					cssVars.push( 'title_front_color' );
					cssVars.push( 'text_front_color' );

					if ( values.background_image_front ) {
						cssCustomVars.background_image_front = 'url(\'' + values.background_image_front + '\')';
						if ( values.background_color_front ) {
							alpha = jQuery.AWB_Color( values.background_color_front ).alpha();
							if ( 1 > alpha && 0 !== alpha ) {
								cssCustomVars[ 'background-front-blend-mode' ] = 'overlay';
							}
						}
					}
				} else {
					cssVars.push( 'background_color_back' );
					cssVars.push( 'title_back_color' );
					cssVars.push( 'text_back_color' );

					if ( values.background_image_back ) {
						cssCustomVars.background_image_back = 'url(\'' + values.background_image_back + '\')';

						if ( values.background_color_back ) {
							alpha = jQuery.AWB_Color( values.background_color_back ).alpha();
							if ( 1 > alpha && 0 !== alpha ) {
								cssCustomVars[ 'background-back-blend-mode' ] = 'overlay';
							}
						}
					}
				}

				return this.getCssVarsForOptions( cssVars ) + this.getCustomCssVars( cssCustomVars );
			},

			/**
			 * Get the style vars for front heading.
			 *
			 * @since 3.9
			 * @param {Object} values
			 * @return string
			 */
			getFrontHeadingStyleVars: function( values ) {
				var titleTypography = _.fusionGetFontStyle( 'front_title_font', values, 'object' ),
					fontVarArgs,
					fontVars;

				fontVarArgs = {
					'font-family': ( titleTypography[ 'font-family' ] ? titleTypography[ 'font-family' ] : '' ),
					'font-weight': ( titleTypography[ 'font-weight' ] ? titleTypography[ 'font-weight' ] : '' ),
					'font-style': ( titleTypography[ 'font-style' ] ? titleTypography[ 'font-style' ] : '' ),
					'font-size': values.front_title_font_size,
					'letter-spacing': values.front_title_letter_spacing,
					'line-height': values.front_title_line_height,
					'text-transform': values.front_title_text_transform
				};

				fontVars = this.getHeadingFontVars( this.getTitleTag( values, 'front' ), fontVarArgs );

				return fontVars;
			},

			/**
			 * Get the style vars for back heading.
			 *
			 * @since 3.9
			 * @param {Object} values
			 * @return string
			 */
			getBackHeadingStyleVars: function( values ) {
				var titleTypography = _.fusionGetFontStyle( 'back_title_font', values, 'object' ),
					fontVarArgs,
					fontVars;

				fontVarArgs = {
					'font-family': ( titleTypography[ 'font-family' ] ? titleTypography[ 'font-family' ] : '' ),
					'font-weight': ( titleTypography[ 'font-weight' ] ? titleTypography[ 'font-weight' ] : '' ),
					'font-style': ( titleTypography[ 'font-style' ] ? titleTypography[ 'font-style' ] : '' ),
					'font-size': values.back_title_font_size,
					'letter-spacing': values.back_title_letter_spacing,
					'line-height': values.back_title_line_height,
					'text-transform': values.back_title_text_transform
				};

				fontVars = this.getHeadingFontVars( this.getTitleTag( values, 'back' ), fontVarArgs );

				return fontVars;
			},

			/**
			 * Get the title HTML tag.
			 *
			 * @param {Array} values
			 * @param {string} title 'front' or 'back' for title type.
			 * @returns
			 */
			getTitleTag: function( values, title ) {
			var title_value;
			if ( 'front' === title ) {
				title_value = values.front_title_size;
				if ( ! title_value ) {
					return 'h2';
				}
			} else {
				title_value = values.back_title_size;
				if ( ! title_value ) {
					return 'h3';
				}
			}

			if ( !isNaN( title_value ) && !isNaN( parseFloat( title_value ) ) ) {
				return 'h' + title_value;
			}

			return title_value;
		}

		} );
	} );
}( jQuery ) );
