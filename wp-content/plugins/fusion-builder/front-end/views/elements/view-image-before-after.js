/* global FusionEvents */

var FusionPageBuilder = FusionPageBuilder || {};

( function() {

	jQuery( document ).ready( function() {

		// Image Before After Element View.
		FusionPageBuilder.fusion_image_before_after = FusionPageBuilder.ElementView.extend( {

			/**
			 * Runs when element is first init.
			 *
			 * @since 2.0.0
			 * @return {void}
			 */
			onInit: function() {
				this.listenTo( FusionEvents, 'fusion-preview-toggle', this.previewToggle );
				this.listenTo( FusionEvents, 'fusion-iframe-loaded', this.initElement );
			},

			/**
			 * Init Element.
			 *
			 * @since 2.0.0
			 * @return {void}
			 */
			initElement: function() {
				jQuery( '#fb-preview' )[ 0 ].contentWindow.jQuery( 'body' ).trigger( 'fusion-element-render-fusion_image_before_after', this.model.attributes.cid );
			},

			/**
			 * Preview mode toggled.
			 *
			 * @since 2.0.0
			 * @return {void}
			 */
			previewToggle: function() {
				if ( jQuery( '#fb-preview' )[ 0 ].contentWindow.jQuery( 'body' ).hasClass( 'fusion-builder-preview-mode' ) ) {
					this.disableDroppableElement();
				} else {
					this.enableDroppableElement();
				}
			},

			/**
			 * Runs before view DOM is patched.
			 *
			 * @since 2.0.0
			 * @return {void}
			 */
			beforePatch: function() {
				this.$el.css( 'min-height', this.$el.outerHeight() + 'px' );
			},

			/**
			 * Runs after view DOM is patched.
			 *
			 * @since 2.0
			 * @return {void}
			 */
			afterPatch: function() {
				var self = this;

				this._refreshJs();

				setTimeout( function() {
					self.$el.css( 'min-height', '0px' );
				}, 300 );
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

				if ( '' !== atts.values.before_image || '' !== atts.values.after_image ) {

					// Validate values.
					this.validateValues( atts.values );

					// Create attribute objects
					attributes.attr            = this.buildAttr( atts.values );
					attributes.attrWrapper     = this.buildWrapperAttr( atts.values );
					attributes.attrLink        = this.buildLinkAttr( atts.values );
					attributes.attrBeforeImage = this.buildBeforeImageAttr( atts.values );
					attributes.attrAfterImage  = this.buildAfterImageAttr( atts.values );
					attributes.attrOverlay     = this.buildOverlayAttr( atts.values );
					attributes.attrHandle      = this.buildHandleAttr( atts.values );

					// Any extras that need passed on.
					attributes.values = atts.values;
				}

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

				values.offset        = parseInt( values.offset, 10 ) / 100;
				values.font_size     = _.fusionValidateAttrValue( values.font_size, 'px' );
				values.borderradius  = _.fusionValidateAttrValue( values.borderradius, 'px' );
				values.bordersize    = _.fusionValidateAttrValue( values.bordersize, 'px' );
				values.max_width     = _.fusionValidateAttrValue( values.max_width, 'px' );
				values.margin_bottom = _.fusionValidateAttrValue( values.margin_bottom, 'px' );
				values.margin_left   = _.fusionValidateAttrValue( values.margin_left, 'px' );
				values.margin_right  = _.fusionValidateAttrValue( values.margin_right, 'px' );
				values.margin_top    = _.fusionValidateAttrValue( values.margin_top, 'px' );
			},

			/**
			 * Builds attributes.
			 *
			 * @since 2.0
			 * @param {Object} values - The values object.
			 * @return {Object}
			 */
			buildAttr: function( values ) {
				var attr = {
						class: 'fusion-image-before-after-element',
						style: ''
					},
					cid = this.model.get( 'cid' );

				if ( 'switch' === values.type ) {
					attr[ 'class' ] += ' fusion-image-switch';
				} else if ( 'before_after' === values.type ) {
					attr[ 'class' ] += ' fusion-image-before-after fusion-image-before-after-container';

					if ( values.offset || 0 == values.offset ) {
						attr[ 'data-offset' ] = values.offset.toString();
					}

					if ( values.orientation ) {
						attr[ 'data-orientation' ] = values.orientation;
					}

					if ( values.handle_movement ) {
						if ( 'drag_click' === values.handle_movement ) {
							attr[ 'data-move-with-handle-only' ] = 'true';
							attr[ 'data-click-to-move' ]         = 'true';
						} else if ( 'drag' === values.handle_movement ) {
							attr[ 'data-move-with-handle-only' ] = 'true';
						} else if ( 'hover' === values.handle_movement ) {
							attr[ 'data-move-slider-on-hover' ] = 'true';
						}
					}
				}

				if ( '' !== values.max_width ) {
					attr.style += 'max-width:' + values.max_width + ';';
				}

				attr[ 'class' ] += ' fusion-image-before-after-cid' + cid;

				return attr;
			},

			/**
			 * Builds attributes.
			 *
			 * @since 2.0
			 * @param {Object} values - The values object.
			 * @return {Object}
			 */
			buildWrapperAttr: function( values ) {
				var attr = _.fusionVisibilityAtts( values.hide_on_mobile, {
						class: 'fusion-image-before-after-wrapper',
						style: this.getStyleVars( values )
					} ),
					cid = this.model.get( 'cid' );

				if ( values.orientation && 'before_after' === values.type ) {
					attr[ 'class' ] += ' fusion-image-before-after-' + values.orientation;
				}

				if ( '' !== values.type ) {
					attr[ 'class' ] += ' type-' + values.type.replace( '_', '-' );
				}

				if ( '' !== values.label_hover_type ) {
					const hoverTypeExtra = 'out-image-up-down' === values.label_placement ? 'out-' : '';
					attr[ 'class' ] += ' hover-type-' + hoverTypeExtra + values.label_hover_type;
				}

				if ( '' !== values.alignment ) {
					attr[ 'class' ] += ' has-alignment';
					attr[ 'class' ] += ' align-' + values.alignment;
				}

				if ( '' !== values[ 'class' ] ) {
					attr[ 'class' ] += ' ' + values[ 'class' ];
				}

				if ( '' !== values.id ) {
					attr.id = values.id;
				}

				attr = _.fusionAnimations( values, attr );

				attr[ 'class' ] += ' fusion-image-before-after-wrapper-cid' + cid;

				return attr;
			},

			/**
			 * Builds link attributes.
			 *
			 * @since 2.2
			 * @param {Object} values - The values object.
			 * @return {Object}
			 */
			buildLinkAttr: function( values ) {
				var attr = {
						class: 'fusion-image-switch-link',
						href: values.link,
						target: values.target,
						rel: ''
					};

					if ( '_blank' === values.target ) {
						attr.rel = 'noopener noreferrer';
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
			buildBeforeImageAttr: function( values ) {
				var attr = {
					class: 'before_after' === values.type ? 'fusion-image-before-after-before' : 'fusion-image-switch-before',
					src: values.before_image,
					alt: ''
				};

				return attr;
			},

			/**
			 * Builds attributes.
			 *
			 * @since 2.0
			 * @param {Object} values - The values object.
			 * @return {Object}
			 */
			buildAfterImageAttr: function( values ) {
				var attr = {
					class: 'before_after' === values.type ? 'fusion-image-before-after-after' : 'fusion-image-switch-after',
					src: values.after_image,
					alt: ''
				};

				return attr;
			},

			/**
			 * Builds attributes.
			 *
			 * @since 2.0
			 * @param {Object} values - The values object.
			 * @return {Object}
			 */
			buildOverlayAttr: function( values ) {
				var attr = {
					class: 'fusion-image-before-after-overlay'
				};

				if ( values.label_placement && '' !== values.label_placement ) {
					attr[ 'class' ] += ' before-after-overlay-' + values.label_placement;
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
			buildHandleAttr: function( values ) {
				var attr = {
					class: 'fusion-image-before-after-handle'
				};

				if ( values.handle_type && 'default' !== values.handle_type ) {
					attr[ 'class' ] += ' fusion-image-before-after-handle-' + values.handle_type;
				}

				return attr;
			},

			/**
			 * Get style variables.
			 *
			 * @param {Object} values
			 * @returns string
			 */
			getStyleVars: function( values ) {
				var cssVars = [
					'handle_color',
					'font_size',
					'accent_color',
					'bordersize',
					'borderradius',
					'bordercolor',
					'margin_top',
					'margin_right',
					'margin_bottom',
					'margin_left'
					],
					customCSSVars = {},
					color,
					colorObj;

				this.values = values;

				if ( 'circle' !== values.handle_type && 'arrows' !== values.handle_type ) {
					cssVars.push( 'handle_bg' );
				}

				if ( values.handle_color ) {
					if ( values.handle_type && 'circle' === values.handle_type ) {
						color    = values.handle_color;
						colorObj = jQuery.AWB_Color( color );

						customCSSVars[ 'handle-accent-color' ] = _.fusionAutoCalculateAccentColor( color );
						customCSSVars[ 'handle-transparent-color' ] = colorObj.alpha( 0.6 ).toVarOrRgbaString();
					}
				}

				if ( values.accent_color ) {
					color    = values.accent_color;
					colorObj = jQuery.AWB_Color( color );

					customCSSVars[ 'accent-color-bg' ] = 'transparent';
					if ( 'out-image-up-down' !== values.label_placement ) {
						customCSSVars[ 'accent-color-bg' ] = colorObj.alpha( colorObj.alpha() * 0.15 ).toVarOrRgbaString();
					}
				}

				if ( values.max_width ) {
					customCSSVars[ 'element-width' ]     = '100%';
					customCSSVars[ 'element-max-width' ] = values.max_width;
				}

				if ( values.transition_time ) {
					customCSSVars.transition_time = values.transition_time + 's';
				}

				return this.getCssVarsForOptions( cssVars ) + this.getCustomCssVars( customCSSVars );
			}

		} );
	} );
}( jQuery ) );
