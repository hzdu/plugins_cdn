/* global fusionAllElements */
var FusionPageBuilder = FusionPageBuilder || {};

( function() {

	jQuery( document ).ready( function() {

		// Title View
		FusionPageBuilder.fusion_title = FusionPageBuilder.ElementView.extend( {

			/**
			 * Runs when element is first init.
			 *
			 * @since 3.0
			 * @return {void}
			 */
			onInit: function() {
				var params = this.model.get( 'params' );

				// Check for newer margin params.  If unset but regular is, copy from there.
				if ( 'object' === typeof params ) {
					if ( 'undefined' === typeof params.margin_top_small && 'string' === typeof params.margin_top_mobile ) {
						params.margin_top_small = params.margin_top_mobile;
					}
					if ( 'undefined' === typeof params.margin_bottom_small && 'string' === typeof params.margin_bottom_mobile ) {
						params.margin_bottom_small = params.margin_bottom_mobile;
					}
					this.model.set( 'params', params );
				}
			},

			/**
			 * Modify template attributes.
			 *
			 * @since 2.0
			 * @param {Object} atts - The attributes
			 * @return {Object}
			 */
			filterTemplateAtts: function( atts ) {
				var attributes = {};

				// Validate values.
				this.validateValues( atts.values );
				this.values = atts.values;

				// Create attribute objects
				attributes.attr          			= this.buildAttr( atts.values );
				attributes.headingAttr   			= this.buildHeadingAttr( atts.values );
				attributes.marqueeAttr  			= this.buildMarqueeAttr( atts.values );
				attributes.animatedAttr  			= this.buildAnimatedAttr( atts.values );
				attributes.rotatedAttr   			= this.buildRotatedAttr( atts.values );
				attributes.separatorAttr 			= this.builderSeparatorAttr( atts.values );

				// Any extras that need passed on.
				attributes.cid            			= this.model.get( 'cid' );
				attributes.output         			= 'string' === typeof atts.values.element_content ? atts.values.element_content : '';
				attributes.style_type     			= atts.values.style_type;
				attributes.size           			= atts.values.size;
				attributes.content_align  			= atts.values.content_align;
				attributes.title_type     			= atts.values.title_type;
				attributes.before_text    			= atts.values.before_text;
				attributes.highlight_text 			= atts.values.highlight_text;
				attributes.after_text     			= atts.values.after_text;
				attributes.rotation_text  			= atts.values.rotation_text;
				attributes.title_link  			    = atts.values.title_link;
				attributes.title_tag      			= 'div' === atts.values.size || 'p' === atts.values.size ? atts.values.size : 'h' + atts.values.size;
				attributes.isFlex		  			= this.flexDisplay();
				attributes.content_align_sizes		= {
					large: atts.values.content_align,
					medium: atts.values.content_align_medium || atts.values.content_align,
					small: atts.values.content_align_small || atts.values.content_align
				};

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
				values.margin_top     = _.fusionValidateAttrValue( values.margin_top, 'px' );
				values.margin_right   = _.fusionValidateAttrValue( values.margin_right, 'px' );
				values.margin_bottom  = _.fusionValidateAttrValue( values.margin_bottom, 'px' );
				values.margin_left    = _.fusionValidateAttrValue( values.margin_left, 'px' );

				values.margin_top_mobile    = _.fusionValidateAttrValue( values.margin_top_mobile, 'px' );
				values.margin_bottom_mobile = _.fusionValidateAttrValue( values.margin_bottom_mobile, 'px' );

				if ( 'rotating' === values.title_type && '' !== values.rotation_text ) {
					values.rotation_text = values.rotation_text.split( '|' );
				} else {
					values.rotation_text = [];
				}

				if ( 'text' !== values.title_type ) {
					values.style_type = 'none';
				}

				if ( 'default' === values.style_type ) {
					values.style_type = fusionAllElements.fusion_title.defaults.style_type;
				}

				if ( 1 === values.style_type.split( ' ' ).length ) {
					values.style_type += ' solid';
				}

				// Make sure the title text is not wrapped with an unattributed p tag.
				if ( 'string' === typeof values.element_content ) {
					values.element_content = values.element_content.trim();
					values.element_content = values.element_content.replace( /(<p[^>]+?>|<p>|<\/p>)/img, '' );
				}

				if ( 'undefined' !== typeof values.font_size && '' !== values.font_size ) {
					values.font_size = _.fusionGetValueWithUnit( values.font_size );
				}

				if ( 'undefined' !== typeof values.letter_spacing && '' !== values.letter_spacing ) {
					values.letter_spacing = _.fusionGetValueWithUnit( values.letter_spacing );
				}

				if ( 'yes' === values.text_shadow ) {
					values.text_shadow = _.fusionGetTextShadowStyle( values ).trim();
				}

				if ( 'marquee' === values.title_type ) {
					values.marquee_translate_x = 'left' === values.marquee_direction ? '-100%' : '100%';
					values.marquee_speed      += 'ms';
				}
			},

			getStyleVars: function() {
				var cssVars          = [ 'margin_top', 'margin_right', 'margin_bottom', 'margin_left' ],
					bottomHighlights = [ 'underline', 'double_underline', 'underline_zigzag', 'underline_zigzag', 'curly' ];

				cssVars.push( 'text_color' );

				if ( 'highlight' === this.values.title_type ) {
					if ( ! this.isDefault( 'highlight_color' ) ) {
						cssVars.push( 'highlight_color' );
					}

					if ( ! this.isDefault( 'highlight_top_margin' )  && bottomHighlights.includes( this.values.highlight_effect ) ) {
						cssVars.highlight_top_margin = { 'callback': _.fusionGetValueWithUnit };
					}

					cssVars.push( 'highlight_width' );
				}

				if ( ! this.flexDisplay() && ! ( '' === this.values.margin_top_mobile && '' === this.values.margin_bottom_mobile ) ) {
					this.values.margin_top_small    = this.values.margin_top_mobile;
					this.values.margin_bottom_small = this.values.margin_bottom_mobile;
				}

				cssVars.margin_top_small     = { 'callback': _.fusionGetValueWithUnit };
				cssVars.margin_right_small   = { 'callback': _.fusionGetValueWithUnit };
				cssVars.margin_bottom_small  = { 'callback': _.fusionGetValueWithUnit };
				cssVars.margin_left_small    = { 'callback': _.fusionGetValueWithUnit };
				cssVars.margin_top_medium    = { 'callback': _.fusionGetValueWithUnit };
				cssVars.margin_right_medium  = { 'callback': _.fusionGetValueWithUnit };
				cssVars.margin_bottom_medium = { 'callback': _.fusionGetValueWithUnit };
				cssVars.margin_left_medium   = { 'callback': _.fusionGetValueWithUnit };
				cssVars.text_stroke_size   = { 'callback': _.fusionGetValueWithUnit };
				cssVars.push( 'text_stroke_color' );

				if ( ( 'text' === this.values.title_type || 'marquee' === this.values.title_type ) && 'on' === this.values.title_link ) {
					cssVars.push( 'link_color' );
					cssVars.push( 'link_hover_color' );
				}

				if ( 'none' !== this.values.text_overflow ) {
					cssVars.push( 'text_overflow' );
				}

				if ( 'marquee' === this.values.title_type ) {
					cssVars.push( 'marquee_speed' );
					cssVars.push( 'marquee_translate_x' );
				}

				cssVars.push( 'sep_color' );
				cssVars.font_size = { 'callback': _.fusionGetValueWithUnit };

				return this.getCssVarsForOptions( cssVars );
			},

			/**
			 * Builds attributes.
			 *
			 * @since 2.0
			 * @param {Object} values - The values object.
			 * @return {Object}
			 */
			buildAttr: function( values ) {
				var styles,
					titleSize = 'div',
					attr      = _.fusionVisibilityAtts( values.hide_on_mobile, {
						class: 'fusion-title title fusion-title-cid' + this.model.get( 'cid' ),
						style: this.getStyleVars()
					} );

				attr[ 'class' ] += _.fusionGetStickyClass( values.sticky_display );

				if ( -1 !== values.style_type.indexOf( 'underline' ) ) {
					styles = values.style_type.split( ' ' );

					_.each( styles, function( style ) {
						attr[ 'class' ] += ' sep-' + style;
					} );

				} else if ( -1 !== values.style_type.indexOf( 'none' ) || 'text' !== values.title_type ) {
					attr[ 'class' ] += ' fusion-sep-none';
				}

				if ( 'center' === values.content_align ) {
					attr[ 'class' ] += ' fusion-title-center';
				}

				if ( '' !== values.title_type ) {
					attr[ 'class' ] += ' fusion-title-' + values.title_type;
				}

				if ( 'text' !== values.title_type && '' !== values.loop_animation ) {
					attr[ 'class' ] += ' fusion-loop-' + values.loop_animation;
				}

				if ( 'rotating' === values.title_type && '' !== values.rotation_effect ) {
					attr[ 'class' ] += ' fusion-title-' + values.rotation_effect;
				}

				if ( 'highlight' === values.title_type && '' !== values.highlight_effect ) {
					attr[ 'data-highlight' ] = values.highlight_effect;
					attr[ 'class' ]         += ' fusion-highlight-' + values.highlight_effect;
				}

				if ( '1' == values.size ) {
					titleSize = 'one';
				} else if ( '2' == values.size ) {
					titleSize = 'two';
				} else if ( '3' == values.size ) {
					titleSize = 'three';
				} else if ( '4' == values.size ) {
					titleSize = 'four';
				} else if ( '5' == values.size ) {
					titleSize = 'five';
				} else if ( '6' == values.size ) {
					titleSize = 'six';
				} else if ( 'p' == values.size ) {
					titleSize = 'paragraph';
				}

				attr[ 'class' ] += ' fusion-title-size-' + titleSize;

				attr = _.fusionAnimations( values, attr );

				if ( 'yes' === values.text_stroke ) {
					attr[ 'class' ] += ' fusion-text-has-stroke';
				}

				if ( 'none' !== values.text_overflow ) {
					attr[ 'class' ] += ' fusion-has-text-overflow';
				}

				if ( '' !== values[ 'class' ] ) {
					attr[ 'class' ] += ' ' + values[ 'class' ];
				}

				if ( '' !== values.id ) {
					attr.id = values.id;
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
			buildHeadingAttr: function( values ) {
				var self        = this,
					headingAttr = {
						class: 'fusion-title-heading title-heading-' + values.content_align,
						style: ''
					};

				if ( 'div' === values.size || 'p' === values.size  ) {
					headingAttr[ 'class' ] += ' title-heading-tag';
				}

				headingAttr.style += _.fusionGetFontStyle( 'title_font', values );

				if ( 'marquee' === values.title_type ) {
					if ( 'right' === values.marquee_direction && ! jQuery( 'body' ).hasClass( 'rtl' ) ) {
						headingAttr.dir = 'rtl';
					} else if ( 'left' === values.marquee_direction && jQuery( 'body' ).hasClass( 'rtl' ) ) {
						headingAttr.dir = 'ltr';
					}

					headingAttr[ 'class' ] + ' awb-marquee-' + values.marquee_direction;
				}

				if ( this.flexDisplay() ) {
					if ( values.content_align_medium && values.content_align !== values.content_align_medium ) {
						headingAttr[ 'class' ] += ' md-text-align-' + values.content_align_medium;
					}
					if ( values.content_align_small && values.content_align !== values.content_align_small ) {
						headingAttr[ 'class' ] += ' sm-text-align-' + values.content_align_small;
					}
				}

				if ( '' !== values.margin_top || '' !== values.margin_bottom ) {
					headingAttr.style += 'margin:0;';
				}

				if ( '' !== values.font_size ) {
					headingAttr.style += 'font-size:1em;';
				}

				if ( 'undefined' !== typeof values.line_height && '' !== values.line_height ) {
					headingAttr.style += 'line-height:' + values.line_height + ';';
				}

				if ( 'undefined' !== typeof values.letter_spacing && '' !== values.letter_spacing ) {
					headingAttr.style += 'letter-spacing:' + values.letter_spacing + ';';
				}

				if ( 'undefined' !== typeof values.text_transform && '' !== values.text_transform ) {
					headingAttr.style += 'text-transform:' + values.text_transform + ';';
				}

				if ( ( 'text' === values.title_type || 'marquee' === values.title_type ) && 'yes' === values.gradient_font ) {
					headingAttr.style      += _.getGradientFontString( values );
					headingAttr[ 'class' ] += ' awb-gradient-text';
				}

				if ( '' !== values.style_tag ) {
					headingAttr.style += values.style_tag;
				}

				// Text shadow.
				if ( 'no' !== values.text_shadow ) {

					if ( 'yes' === values.gradient_font ) {
						headingAttr.style += 'filter:drop-shadow(' + values.text_shadow + ');';
					} else {
						headingAttr.style += 'text-shadow:' + values.text_shadow + ';';
					}
				}

				if ( 'text' === values.title_type ) {
					headingAttr = _.fusionInlineEditor( {
						cid: self.model.get( 'cid' ),
						overrides: {
							color: 'text_color',
							'font-size': 'font_size',
							'line-height': 'line_height',
							'letter-spacing': 'letter_spacing',
							tag: 'size'
						}
					}, headingAttr );
				}

				return headingAttr;
			},

			/**
			 * Builds marquee attributes.
			 *
			 * @since 2.1
			 * @param {Object} values - The values object.
			 * @return {Object}
			 */
			buildMarqueeAttr: function( values ) {
				const marqueeAttr = {
						class: 'awb-marquee-content'
					};

				if ( 'right' === values.marquee_direction && ! jQuery( 'body' ).hasClass( 'rtl' ) ) {
					marqueeAttr.dir = 'ltr';
				} else if ( 'left' === values.marquee_direction && jQuery( 'body' ).hasClass( 'rtl' ) ) {
					marqueeAttr.dir = 'rtl';
				}

				return marqueeAttr;
			},

			/**
			 * Builds animation attributes.
			 *
			 * @since 2.1
			 * @param {Object} values - The values object.
			 * @return {Object}
			 */
			buildAnimatedAttr: function( values ) {
				var animationAttr = {
						class: 'fusion-animated-texts-wrapper',
						style: ''
					};

				if ( '' !== values.animated_text_color ) {
					animationAttr.style += 'color:' + values.animated_text_color + ';';
				}

				if ( values.animated_font_size ) {
					animationAttr.style += 'font-size:' + values.animated_font_size + ';';
				}

				if ( 'highlight' === values.title_type ) {
					animationAttr[ 'class' ] = 'fusion-highlighted-text';
				}

				if ( 'rotating' === values.title_type ) {
					animationAttr[ 'data-length' ] = this.getAnimationLength( values.rotation_effect );

					if ( '' !== values.display_time ) {
						animationAttr[ 'data-minDisplayTime' ] = values.display_time;
					}

					if ( '' !== values.after_text || ( '' === values.before_text && '' === values.after_text ) ) {
						animationAttr.style += 'text-align: center;';
					}
				}

				return animationAttr;

			},

			/**
			 * Get Animation length.
			 *
			 * @since 2.1
			 * @param {String} effect - The animation effect.
			 * @return {String}
			 */
			getAnimationLength: function ( effect ) {
				var animationLength = '';

				switch ( effect ) {

					case 'flipInX':
					case 'bounceIn':
					case 'zoomIn':
					case 'slideInDown':
					case 'clipIn':
						animationLength = 'line';
						break;

					case 'lightSpeedIn':
						animationLength = 'word';
						break;

					case 'rollIn':
					case 'typeIn':
					case 'fadeIn':
						animationLength = 'char';
						break;
				}

				return animationLength;
			},

			/**
			 * Builds rotated text attributes.
			 *
			 * @since 2.1
			 * @param {Object} values - The values object.
			 * @return {Object}
			 */
			buildRotatedAttr: function( values ) {
				var effect    = values.rotation_effect,
					rotatedAttr = {
						class: 'fusion-animated-text',
						style: ''
					};

				rotatedAttr[ 'data-in-effect' ]   = effect;
				rotatedAttr[ 'data-in-sequence' ] = 'true';
				rotatedAttr[ 'data-out-reverse' ] = 'true';

				effect = effect.replace( 'In', 'Out' );
				effect = effect.replace( 'Down', 'Up' );

				rotatedAttr[ 'data-out-effect' ] = effect;

				return rotatedAttr;
			},

			/**
			 * Builds attributes.
			 *
			 * @since 2.0
			 * @param {Object} values - The values object.
			 * @return {Object}
			 */
			builderSeparatorAttr: function( values ) {
				var separatorAttr = {
						class: 'title-sep'
					},
					styles        = values.style_type.split( ' ' );

				_.each( styles, function( style ) {
					separatorAttr[ 'class' ] += ' sep-' + style;
				} );

				if ( values.sep_color ) {
					separatorAttr.style = 'border-color:' + values.sep_color + ';';
				}

				return separatorAttr;
			},

			onCancel: function() {
				this.resetTypography();
			},

			afterPatch: function() {
				this.resetTypography();
				this.refreshJs();
			},

			refreshJs: function() {
				jQuery( '#fb-preview' )[ 0 ].contentWindow.jQuery( 'body' ).trigger( 'fusion-element-render-fusion_title', this.model.attributes.cid );
			},

			resetTypography: function() {
				jQuery( '#fb-preview' )[ 0 ].contentWindow.jQuery( 'body' ).trigger( 'fusion-typography-reset', this.model.get( 'cid' ) );

				if ( 800 > jQuery( '#fb-preview' ).width() ) {
					setTimeout( function() {
						jQuery( '#fb-preview' )[ 0 ].contentWindow.jQuery( 'body' ).trigger( 'resize' );
					}, 50 );
				}
			}
		} );
	} );
}( jQuery ) );
