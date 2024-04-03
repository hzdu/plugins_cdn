var FusionPageBuilder = FusionPageBuilder || {};

( function () {


	jQuery( document ).ready( function () {

		// Post Card Cart Component View.
		FusionPageBuilder.fusion_post_card_cart = FusionPageBuilder.ElementView.extend( {

			onInit: function() {
				var params = this.model.get( 'params' );

				// Check for newer margin params.  If unset but regular is, copy from there.
				if ( 'object' === typeof params ) {

					// Split border width into 4.
					if ( 'undefined' === typeof params.button_border_top && 'undefined' !== typeof params.button_border_width && '' !== params.button_border_width ) {
						params.button_border_top    = parseInt( params.button_border_width ) + 'px';
						params.button_border_right  = params.button_border_top;
						params.button_border_bottom = params.button_border_top;
						params.button_border_left   = params.button_border_top;
						delete params.button_border_width;
					}

					// Split border width into 4.
					if ( 'undefined' === typeof params.button_details_border_top && 'undefined' !== typeof params.button_details_border_width && '' !== params.button_details_border_width ) {
						params.button_details_border_top    = parseInt( params.button_details_border_width ) + 'px';
						params.button_details_border_right  = params.button_details_border_top;
						params.button_details_border_bottom = params.button_details_border_top;
						params.button_details_border_left   = params.button_details_border_top;
						delete params.button_details_border_width;
					}
					this.model.set( 'params', params );
				}
			},

			afterPatch: function () {
				var $quantityBoxes = this.$el.find( 'div.quantity:not(.buttons_added), td.quantity:not(.buttons_added)' ).find( '.qty' ),
					$form = jQuery( '#fb-preview' )[ 0 ].contentWindow.jQuery( this.$el.find( '.variations_form' ) );

				if ( $quantityBoxes.length && 'function' === typeof jQuery( '#fb-preview' )[ 0 ].contentWindow.avadaAddQuantityBoxes ) {
					jQuery( '#fb-preview' )[ 0 ].contentWindow.avadaAddQuantityBoxes( '.qty', $quantityBoxes );
				}

				if ( $form.length && 'function' === typeof $form.wc_variation_form ) {
					$form.wc_variation_form();
					$form.on( 'hide_variation', function( e ) {
						jQuery( '#fb-preview' )[ 0 ].contentWindow.jQuery( e.currentTarget ).find( '.avada-variation' ).closest( 'tr' ).addClass( 'awb-hide-element' );
					} ).on( 'found_variation.wc-variation-form', function( e ) {
						if ( jQuery.trim( jQuery( '#fb-preview' )[ 0 ].contentWindow.jQuery( e.currentTarget ).find( '.avada-variation' ).text() ).length ) {
							jQuery( '#fb-preview' )[ 0 ].contentWindow.jQuery( e.currentTarget ).find( '.avada-variation' ).closest( 'tr' ).removeClass( 'awb-hide-element' );
						}
					} );
					this.$el.find( '.awb-post-card-cart-cart-wrapper' ).appendTo( $form );
				}
			},

			/**
			 * Modify template attributes.
			 *
			 * @since 3.3
			 * @param {Object} atts - The attributes.
			 * @return {Object}
			 */
			filterTemplateAtts: function ( atts ) {
				var attributes = {};

				this.values = atts.values;
				this.extras = atts.extras;
				this.query_data = atts.query_data;
				this.setIconDefaults();

				// Validate values.
				this.validateArgs();

				// Any extras that need passed on.
				attributes.cid = this.model.get( 'cid' );
				attributes.wrapperAttr = this.buildAttr( atts.values );
				attributes.output = this.buildOutput( atts );

				return attributes;
			},

			/**
			 * Modify template attributes.
			 *
			 * @since 3.5
			 * @return {void}
			 */
			validateArgs: function() {
				this.values.button_icon = this.values.button_icon.replace( 'fusion-prefix-', '' );

			},

			/**
			 * Set default icons for text links
			 *
			 * @since  3.3
			 */
			setIconDefaults: function() {
				if ( 'custom' !== this.values.button_style ) {
					this.values.icon_position = 'left';
					this.values.button_icon   = 'fa-shopping-cart fas';
				}

				if ( 'custom' !== this.values.product_link_style ) {
					this.values.icon_details_position = 'left';
					this.values.button_details_icon   = 'fa-list-ul fas';
				}
			},

			/**
			 * Builds attributes.
			 *
			 * @since  3.3
			 * @param  {Object} values - The values object.
			 * @return {Object}
			 */
			buildAttr: function ( values ) {
				var attr = _.fusionVisibilityAtts( values.hide_on_mobile, {
					class: 'fusion-woo-cart fusion-post-card-cart',
					style: this.getStyleVars()
				} );

				if ( '' !== values[ 'class' ] ) {
					attr[ 'class' ] += ' ' + values[ 'class' ];
				}

				attr[ 'class' ] += ' awb-variation-layout-' + this.values.variation_layout;
				attr[ 'class' ] += ' awb-variation-clear-' + this.values.variation_clear;
				attr[ 'class' ] += ' awb-label-' + this.values.show_label;

				if ( '' !== values.variation_text_align ) {
					attr[ 'class' ] += ' awb-variation-text-align-' + values.variation_text_align;
				}

				attr[ 'class' ] += ' awb-add-to-cart-style-' + ( '' === this.values.button_style ? 'link' : 'button' );
				attr[ 'class' ] += ' awb-product-style-' + ( '' === this.values.product_link_style ? 'link' : 'button' );

				if ( '' !== values.id ) {
					attr.id = values.id;
				}

				attr = _.fusionAnimations( values, attr );

				return attr;
			},


			/**
			 * Builds output.
			 *
			 * @since  3.3
			 * @param  {Object} values - The values object.
			 * @return {String}
			 */
			buildOutput: function ( atts ) {
				var quantity = '',
						buttons = '',
						output = '';

				if ( 'yes' === atts.values.show_variations && 'variable' === this.getProductType() && 'undefined' !== typeof atts.query_data && 'undefined' !== typeof atts.query_data.fusion_post_card_cart ) {
					output = atts.query_data.fusion_post_card_cart;
				}
				if ( 'yes' === atts.values.show_add_to_cart_button ) {
					buttons += this.buildAddToCart( );
				}
				if ( 'yes' === atts.values.show_product_link_button ) {
					buttons += this.buildProductDetails( );
				}
				if ( 'yes' === atts.values.show_quantity_input ) {
					quantity = this.buildQuantity( );
				}

				// Add wrapper.
				if ( 'yes' === atts.values.show_variations && 'variable' === this.getProductType() ) {
					quantity = '<div class="awb-post-card-cart-cart-wrapper">' + quantity;
				}

				output += quantity;
				if ( this.has_buttons_wrapper() ) {
					output += '<div class="fusion-post-card-cart-button-wrapper">';
				}
				output += buttons;
				if ( this.has_buttons_wrapper() ) {
					output += '</div>';
				}

				// Closing wrapper.
				if ( 'yes' === atts.values.show_variations && 'variable' === this.getProductType() ) {
					output += '</div>';
				}
				return output;
			},

			/**
			 * Builds Quantity
			 *
			 * @since  3.3
			 * @return {String}
			 */
			buildQuantity: function ( ) {
				var output = '<div class="fusion-post-card-cart-quantity">' +
				'<div class="quantity">' +
				'<label class="screen-reader-text" for="quantity_temp">Quis voluptas quos ut in quantity</label>' +
				'<input type="number" id="quantity_temp" class="input-text qty text" step="1" min="1" max="" name="quantity" value="1" title="Qty" size="4" inputmode="numeric" />' +
				'</div></div>';
				return output;
			},

			/**
			 * Builds Add to cart button
			 *
			 * @since  3.3
			 * @return {String}
			 */
			buildAddToCart: function ( ) {
				var output = '',
					button_class = [ 'fusion-post-card-cart-add-to-cart' ];

				if ( '' === this.values.button_size ) {
					button_class.push( 'fusion-button-default-size' );
				}

				if ( 'custom' === this.values.button_style ) {
					button_class.push( 'button-default' );
				}

				output = '<a href="#" data-quantity="1" class="' + button_class.join( ' ' ) + '" aria-label="Add Temp Product" rel="nofollow">';
				if ( '' !== this.values.button_icon && 'left' === this.values.icon_position ) {
					output += '<i class="' + this.values.button_icon + ' button-icon-left" aria-hidden="true"></i>';
				}
				output += this.extras.add_to_cart_text;
				if ( '' !== this.values.button_icon && 'right' === this.values.icon_position ) {
					output += '<i class="' + this.values.button_icon + ' button-icon-right" aria-hidden="true"></i>';
				}
				output += '</a>';
				return output;
			},

			/**
			 * Builds Details/Quick view button
			 *
			 * @since  3.3
			 * @return {String}
			 */
			buildProductDetails: function ( ) {
				var output = '';
				var button_class = '' === this.values.button_details_size ? ' fusion-button-default-size' : '';
				button_class += 'custom' === this.values.product_link_style ? ' button-default' : '';
				if ( '1' === this.values.enable_quick_view || 'yes' === this.values.enable_quick_view ) {
					output = '<a href="#" class="fusion-post-card-cart-product-link fusion-quick-view' + button_class + '">';
					if ( '' !== this.values.button_details_icon && 'left' === this.values.icon_details_position ) {
						output += '<i class="' + this.values.button_details_icon + ' button-icon-left" aria-hidden="true"></i>';
					}
					output += this.extras.quick_view_text;
					if ( '' !== this.values.button_details_icon && 'right' === this.values.icon_details_position ) {
						output += '<i class="' + this.values.button_details_icon + ' button-icon-right" aria-hidden="true"></i>';
					}
					output += '</a>';
				} else {
					output = '<a href="#" class="fusion-post-card-cart-product-link show_details_button' + button_class + '">';
					if ( '' !== this.values.button_details_icon && 'left' === this.values.icon_details_position ) {
						output += '<i class="' + this.values.button_details_icon + ' button-icon-left" aria-hidden="true"></i>';
					}
					output += this.extras.details_text;
					if ( '' !== this.values.button_details_icon && 'right' === this.values.icon_details_position ) {
						output += '<i class="' + this.values.button_details_icon + ' button-icon-right" aria-hidden="true"></i>';
					}
				output += '</a>';
				}

				return output;
			},

			/**
			 * Checks if buttons wrapper needed
			 *
			 * @since  3.3
			 * @param  {Object} values - The values object.
			 * @return {Boolean}
			 */
			has_buttons_wrapper: function () {
				return ( 'yes' === this.values.show_product_link_button || 'yes' === this.values.show_add_to_cart_button ) &&
					! ( 'floated' === this.values.cart_layout && 'floated' === this.values.buttons_layout && 'no' === this.values.buttons_stretch );
			},

			/**
			 * Builds styles.
			 *
			 * @since  3.3
			 * @param  {Object} values - The values object.
			 * @return {String}
			 */
			getStyleVars: function () {
				var customVars     = {},
					cssVarsOptions = [],
					buttonSizeMap = {
						small: {
							padding: '9px 20px',
							line_height: '14px',
							font_size: '12px'
						},
						medium: {
							padding: '11px 23px',
							line_height: '16px',
							font_size: '13px'
						},
						large: {
							padding: '13px 29px',
							line_height: '17px',
							font_size: '14px'
						},
						xlarge: {
							padding: '17px 40px',
							line_height: '21px',
							font_size: '18px'
						}
					},
					width,
					buttonDimensions;

				cssVarsOptions.margin_top = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.margin_right = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.margin_bottom = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.margin_left = { 'callback': _.fusionGetValueWithUnit };

				if ( 'floated' === this.values.cart_layout ) {
					customVars[ 'justify-content' ] = this.values.justify;
					customVars[ 'align-items' ]     = 'center';
				} else {
					customVars[ 'flex-direction' ] = 'column';
					customVars[ 'align-items' ]    = this.values.align;
				}

				if ( 'yes' === this.values.show_add_to_cart_button ) {
					cssVarsOptions.button_margin_top    = { 'callback': _.fusionGetValueWithUnit };
					cssVarsOptions.button_margin_right  = { 'callback': _.fusionGetValueWithUnit };
					cssVarsOptions.button_margin_bottom = { 'callback': _.fusionGetValueWithUnit };
					cssVarsOptions.button_margin_left   = { 'callback': _.fusionGetValueWithUnit };
				}

				if ( 'yes' === this.values.show_product_link_button ) {
					cssVarsOptions.button_details_margin_top    = { 'callback': _.fusionGetValueWithUnit };
					cssVarsOptions.button_details_margin_right  = { 'callback': _.fusionGetValueWithUnit };
					cssVarsOptions.button_details_margin_bottom = { 'callback': _.fusionGetValueWithUnit };
					cssVarsOptions.button_details_margin_left   = { 'callback': _.fusionGetValueWithUnit };
				}

				// Button wrapper if both buttons are used.
				if ( this.has_buttons_wrapper() ) {
					if ( 'floated' === this.values.buttons_layout ) {
						customVars[ 'button-align-items' ] = 'center';
						if ( 'stacked' === this.values.cart_layout ) {
							customVars[ 'button-justify-content' ] = this.values.buttons_justify;
						}
					} else if ( 'stacked' === this.values.buttons_layout ) {
						customVars[ 'button-flex-direction' ] = 'column';
						customVars[ 'button-align-items' ]    = this.values.buttons_alignment;
					}

					// Button wrapper expand full width.
					if ( 'yes' === this.values.buttons_stretch ) {
						customVars[ 'button-a-justify-content' ] = 'center';

						// Stacked buttons next to quantity.
						if ( 'floated' === this.values.cart_layout ) {
							if ( 'stacked' === this.values.buttons_layout ) {

								customVars[ 'button-flex' ]        = '1';
								customVars[ 'button-align-items' ] = 'stretch';
							} else {
								customVars[ 'button-flex' ]   = '1';
								customVars[ 'button-a-flex' ] = '1';
							}
						} else if ( 'stacked' === this.values.buttons_layout ) {
								customVars[ 'button-align-items' ] = 'stretch';
							} else {
								customVars[ 'button-a-flex' ] = '1';
							}
					}
				}

				if ( 'custom' === this.values.quantity_style ) {
					cssVarsOptions.quantity_margin_top    = { 'callback': _.fusionGetValueWithUnit };
					cssVarsOptions.quantity_margin_right  = { 'callback': _.fusionGetValueWithUnit };
					cssVarsOptions.quantity_margin_bottom = { 'callback': _.fusionGetValueWithUnit };
					cssVarsOptions.quantity_margin_left   = { 'callback': _.fusionGetValueWithUnit };

					// Quantity height.
					if ( ! this.isDefault( 'quantity_height' ) ) {
						customVars[ 'quantity-height' ] = _.fusionGetValueWithUnit( this.values.quantity_height );
					}

					// Quantity width.
					width = '36px';
					if ( ! this.isDefault( 'quantity_width' ) ) {
						width = _.fusionGetValueWithUnit( this.values.quantity_width );

						if ( width.includes( '%' ) ) {
							customVars[ 'quantity-width' ] = 'calc( 100% - var(--awb-quantity-height) - var(--awb-quantity-height) )';
						} else {
							customVars[ 'quantity-width' ] = width;
						}
					}

					// Quantity wrapper.
					if ( ! this.isDefault( 'quantity_width' ) || ! this.isDefault( 'quantity_height' ) ) {
						customVars[ 'quantity-wrapper-width' ] = 'calc( ' + width + ' + var(--awb-quantity-height) + var(--awb-quantity-height) )';
					}

					cssVarsOptions.quantity_radius_top_left     = { 'callback': _.fusionGetValueWithUnit };
					cssVarsOptions.quantity_radius_bottom_left  = { 'callback': _.fusionGetValueWithUnit };
					cssVarsOptions.quantity_radius_bottom_right = { 'callback': _.fusionGetValueWithUnit };
					cssVarsOptions.quantity_radius_top_right    = { 'callback': _.fusionGetValueWithUnit };
					cssVarsOptions.quantity_font_size           = { 'callback': _.fusionGetValueWithUnit };
					cssVarsOptions.quantity_border_sizes_top    = { 'callback': _.fusionGetValueWithUnit };
					cssVarsOptions.quantity_border_sizes_right  = { 'callback': _.fusionGetValueWithUnit };
					cssVarsOptions.quantity_border_sizes_bottom = { 'callback': _.fusionGetValueWithUnit };
					cssVarsOptions.quantity_border_sizes_left   = { 'callback': _.fusionGetValueWithUnit };
					cssVarsOptions.push(  'quantity_color' );
					cssVarsOptions.push(  'quantity_background' );
					cssVarsOptions.push(  'quantity_border_color' );
					cssVarsOptions.qbutton_border_sizes_top     = { 'callback': _.fusionGetValueWithUnit };
					cssVarsOptions.qbutton_border_sizes_right   = { 'callback': _.fusionGetValueWithUnit };
					cssVarsOptions.qbutton_border_sizes_bottom  = { 'callback': _.fusionGetValueWithUnit };
					cssVarsOptions.qbutton_border_sizes_left    = { 'callback': _.fusionGetValueWithUnit };
					cssVarsOptions.push(  'qbutton_color' );
					cssVarsOptions.push(  'qbutton_background' );
					cssVarsOptions.push(  'qbutton_border_color' );
					cssVarsOptions.push(  'qbutton_color_hover' );
					cssVarsOptions.push(  'qbutton_background_hover' );
					cssVarsOptions.push(  'qbutton_border_color_hover' );
				}

				if ( 'custom' === this.values.button_style ) {
					// Button size.
					if ( ! this.isDefault( 'button_size' ) ) {

						if ( 'object' === typeof buttonSizeMap[ this.values.button_size ] ) {
							buttonDimensions                 = buttonSizeMap[ this.values.button_size ];
							customVars[ 'button-padding' ]     = buttonDimensions.padding;
							customVars[ 'button-line-height' ] = buttonDimensions.line_height;
							customVars[ 'button-font-size' ]   = buttonDimensions.font_size;
						}
					}

					cssVarsOptions.button_border_top    = { 'callback': _.fusionGetValueWithUnit };
					cssVarsOptions.button_border_right  = { 'callback': _.fusionGetValueWithUnit };
					cssVarsOptions.button_border_bottom = { 'callback': _.fusionGetValueWithUnit };
					cssVarsOptions.button_border_left   = { 'callback': _.fusionGetValueWithUnit };
					cssVarsOptions.push( 'button_color' );
					cssVarsOptions.push( 'button_border_color' );
					cssVarsOptions.push( 'button_color_hover' );
					cssVarsOptions.push( 'button_border_color_hover' );

					// Button gradient.
					if ( 'string' === typeof this.values.button_gradient_top && '' !== this.values.button_gradient_top ) {
						cssVarsOptions.push( 'button_gradient_top' );
					}
					if ( 'string' === typeof this.values.button_gradient_bottom && '' !== this.values.button_gradient_bottom ) {
						cssVarsOptions.push( 'button_gradient_bottom' );
					} else if ( 'string' === typeof this.values.button_gradient_top && '' !== this.values.button_gradient_top ) {
						customVars[ 'button-gradient-bottom' ] = this.values.button_gradient_top;
					}

					if ( 'string' === typeof this.values.button_gradient_top_hover && '' !== this.values.button_gradient_top_hover ) {
						cssVarsOptions.push( 'button_gradient_top_hover' );
					}
					if ( 'string' === typeof this.values.button_gradient_bottom_hover && '' !== this.values.button_gradient_bottom_hover ) {
						cssVarsOptions.push( 'button_gradient_bottom_hover' );
					} else if ( 'string' === typeof this.values.button_gradient_top_hover && '' !== this.values.button_gradient_top_hover ) {
						customVars[ 'button-gradient-bottom-hover' ] = this.values.button_gradient_top_hover;
					}
				} else {
					cssVarsOptions.push( 'link_color' );
					cssVarsOptions.push( 'link_hover_color' );
					cssVarsOptions.link_font_size = { 'callback': _.fusionGetValueWithUnit };
				}

				if ( 'custom' === this.values.product_link_style ) {
					// Button size.
					if ( ! this.isDefault( 'button_details_size' ) ) {

						if ( 'object' === typeof buttonSizeMap[ this.values.button_details_size ] ) {
							buttonDimensions                         = buttonSizeMap[ this.values.button_details_size ];
							customVars[ 'button-details-padding' ]     = buttonDimensions.padding;
							customVars[ 'button-details-line-height' ] = buttonDimensions.line_height;
							customVars[ 'button-details-font-size' ]   = buttonDimensions.font_size;
						}
					}

					cssVarsOptions.button_details_border_top    = { 'callback': _.fusionGetValueWithUnit };
					cssVarsOptions.button_details_border_right  = { 'callback': _.fusionGetValueWithUnit };
					cssVarsOptions.button_details_border_bottom = { 'callback': _.fusionGetValueWithUnit };
					cssVarsOptions.button_details_border_left   = { 'callback': _.fusionGetValueWithUnit };
					cssVarsOptions.push(  'button_details_color' );
					cssVarsOptions.push(  'button_details_border_color' );

					if ( 'string' === typeof this.values.button_details_gradient_top && '' !== this.values.button_details_gradient_top ) {
						cssVarsOptions.push( 'button_details_gradient_top' );
					}
					if ( 'string' === typeof this.values.button_details_gradient_bottom && '' !== this.values.button_details_gradient_bottom ) {
						cssVarsOptions.push( 'button_details_gradient_bottom' );
					} else if ( 'string' === typeof this.values.button_details_gradient_top && '' !== this.values.button_details_gradient_top ) {
						customVars[ 'button-details-gradient-bottom' ] = this.values.button_details_gradient_top;
					}

					if ( 'string' === typeof this.values.button_details_gradient_top_hover && '' !== this.values.button_details_gradient_top_hover ) {
						cssVarsOptions.push( 'button_details_gradient_top_hover' );
					}
					if ( 'string' === typeof this.values.button_details_gradient_bottom_hover && '' !== this.values.button_details_gradient_bottom_hover ) {
						cssVarsOptions.push( 'button_details_gradient_bottom_hover' );
					} else if ( 'string' === typeof this.values.button_details_gradient_top_hover && '' !== this.values.button_details_gradient_top_hover ) {
						customVars[ 'button-details-gradient-bottom-hover' ] = this.values.button_details_gradient_top_hover;
					}

					cssVarsOptions.push( 'button_details_color_hover' );
					cssVarsOptions.push( 'button_details_border_color_hover' );
				} else {
					cssVarsOptions.push( 'product_link_color' );
					cssVarsOptions.push( 'product_link_hover_color' );
					cssVarsOptions.product_link_font_size = { 'callback': _.fusionGetValueWithUnit };
				}

				if ( 'floated' === this.values.variation_layout && ! this.isDefault( 'variation_label_area_width' ) ) {
					cssVarsOptions.variation_label_area_width = { 'callback': _.fusionGetValueWithUnit };
				}

				// Variation Label Typo.
				cssVarsOptions.push( 'label_color' );
				cssVarsOptions.label_font_size      = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.push( 'label_line_height' );
				cssVarsOptions.label_letter_spacing = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.push( 'label_text_transform' );

				// Font family and weight.
				jQuery.each( _.fusionGetFontStyle( 'label_typography', this.values, 'object' ), function( rule, value ) {
					customVars[ 'label-typography-' + rule ] = value;
				} );

				// Select variation type styling.
				if ( ! this.isDefault( 'select_style' ) ) {
					cssVarsOptions.select_height         = { 'callback': _.fusionGetValueWithUnit };
					cssVarsOptions.select_font_size      = { 'callback': _.fusionGetValueWithUnit };
					cssVarsOptions.push( 'select_line_height' );
					cssVarsOptions.select_letter_spacing = { 'callback': _.fusionGetValueWithUnit };
					cssVarsOptions.push( 'select_text_transform' );

					// Font family and weight.
					jQuery.each( _.fusionGetFontStyle( 'select_typography', this.values, 'object' ), function( rule, value ) {
						customVars[ 'select-typography-' + rule ] = value;
					} );

					cssVarsOptions.push( 'select_color' );
					cssVarsOptions.push( 'select_background' );
					cssVarsOptions.push( 'select_border_color' );
					cssVarsOptions.select_border_sizes_top    = { 'callback': _.fusionGetValueWithUnit };
					cssVarsOptions.select_border_sizes_right  = { 'callback': _.fusionGetValueWithUnit };
					cssVarsOptions.select_border_sizes_bottom = { 'callback': _.fusionGetValueWithUnit };
					cssVarsOptions.select_border_sizes_left   = { 'callback': _.fusionGetValueWithUnit };

					// Border separator with arrow.
					if ( ! this.isDefault( 'select_border_color' ) && ! this.isDefault( 'select_border_sizes_right' ) && ! this.isDefault( 'select_border_sizes_left' ) ) {
						customVars[ 'arrow-border-left' ] = _.fusionGetValueWithUnit( this.values.select_border_sizes_left ) + ' solid ' + this.values.select_border_color;
					}

					cssVarsOptions.border_radius_top_left     = { 'callback': _.fusionGetValueWithUnit };
					cssVarsOptions.border_radius_top_right    = { 'callback': _.fusionGetValueWithUnit };
					cssVarsOptions.border_radius_bottom_right = { 'callback': _.fusionGetValueWithUnit };
					cssVarsOptions.border_radius_bottom_left  = { 'callback': _.fusionGetValueWithUnit };
				}

				// Swatch styling if enabled.
				if ( ! this.isDefault( 'swatch_style' ) ) {
					cssVarsOptions.swatch_margin_top          = { 'callback': _.fusionGetValueWithUnit };
					cssVarsOptions.swatch_margin_right        = { 'callback': _.fusionGetValueWithUnit };
					cssVarsOptions.swatch_margin_bottom       = { 'callback': _.fusionGetValueWithUnit };
					cssVarsOptions.swatch_margin_left         = { 'callback': _.fusionGetValueWithUnit };
					cssVarsOptions.push( 'swatch_background_color' );
					cssVarsOptions.push( 'swatch_border_color' );
					cssVarsOptions.push( 'swatch_background_color_active' );
					cssVarsOptions.swatch_border_sizes_top    = { 'callback': _.fusionGetValueWithUnit };
					cssVarsOptions.swatch_border_sizes_right  = { 'callback': _.fusionGetValueWithUnit };
					cssVarsOptions.swatch_border_sizes_bottom = { 'callback': _.fusionGetValueWithUnit };
					cssVarsOptions.swatch_border_sizes_left   = { 'callback': _.fusionGetValueWithUnit };

					if ( ! this.isDefault( 'swatch_border_color_active' ) ) {
						cssVarsOptions.push( 'swatch_border_color_active' );
						customVars.swatch_border_color_hover = jQuery.AWB_Color( this.values.swatch_border_color_active ).alpha( 0.5 ).toVarOrRgbaString();
					}

					cssVarsOptions.color_swatch_height         = { 'callback': _.fusionGetValueWithUnit };
					cssVarsOptions.color_swatch_padding_top    = { 'callback': _.fusionGetValueWithUnit };
					cssVarsOptions.color_swatch_padding_top    = { 'callback': _.fusionGetValueWithUnit };
					cssVarsOptions.color_swatch_padding_right  = { 'callback': _.fusionGetValueWithUnit };
					cssVarsOptions.color_swatch_padding_bottom = { 'callback': _.fusionGetValueWithUnit };
					cssVarsOptions.color_swatch_padding_left   = { 'callback': _.fusionGetValueWithUnit };

					// Color swatch.
					if ( ! this.isDefault( 'color_swatch_width' ) ) {
						customVars.color_swatch_width =  'auto' === this.values.color_swatch_width ? 'auto' : _.fusionGetValueWithUnit( this.values.color_swatch_width );
					}

					cssVarsOptions.color_swatch_border_radius_top_left     = { 'callback': _.fusionGetValueWithUnit };
					cssVarsOptions.color_swatch_border_radius_top_right    = { 'callback': _.fusionGetValueWithUnit };
					cssVarsOptions.color_swatch_border_radius_bottom_right = { 'callback': _.fusionGetValueWithUnit };
					cssVarsOptions.color_swatch_border_radius_bottom_left  = { 'callback': _.fusionGetValueWithUnit };

					// Image swatch.
					cssVarsOptions.image_swatch_height         = { 'callback': _.fusionGetValueWithUnit };
					cssVarsOptions.image_swatch_padding_top    = { 'callback': _.fusionGetValueWithUnit };
					cssVarsOptions.image_swatch_padding_right  = { 'callback': _.fusionGetValueWithUnit };
					cssVarsOptions.image_swatch_padding_bottom = { 'callback': _.fusionGetValueWithUnit };
					cssVarsOptions.image_swatch_padding_left   = { 'callback': _.fusionGetValueWithUnit };

					if ( ! this.isDefault( 'image_swatch_width' ) ) {
						customVars.color_swatch_width       = 'auto' === this.values.image_swatch_width ? 'auto' : _.fusionGetValueWithUnit( this.values.image_swatch_width );
						customVars.color_swatch_image_width = 'auto' !== this.values.image_swatch_width ? '100%' : 'auto';
					}

					cssVarsOptions.image_swatch_border_radius_top_left     = { 'callback': _.fusionGetValueWithUnit };
					cssVarsOptions.image_swatch_border_radius_top_right    = { 'callback': _.fusionGetValueWithUnit };
					cssVarsOptions.image_swatch_border_radius_bottom_right = { 'callback': _.fusionGetValueWithUnit };
					cssVarsOptions.image_swatch_border_radius_bottom_left  = { 'callback': _.fusionGetValueWithUnit };

					// Button swatch.
					cssVarsOptions.button_swatch_height                     = { 'callback': _.fusionGetValueWithUnit };
					cssVarsOptions.button_swatch_padding_top                = { 'callback': _.fusionGetValueWithUnit };
					cssVarsOptions.button_swatch_padding_right              = { 'callback': _.fusionGetValueWithUnit };
					cssVarsOptions.button_swatch_padding_bottom             = { 'callback': _.fusionGetValueWithUnit };
					cssVarsOptions.button_swatch_padding_left               = { 'callback': _.fusionGetValueWithUnit };
					cssVarsOptions.button_swatch_border_radius_top_left     = { 'callback': _.fusionGetValueWithUnit };
					cssVarsOptions.button_swatch_border_radius_top_right    = { 'callback': _.fusionGetValueWithUnit };
					cssVarsOptions.button_swatch_border_radius_bottom_right = { 'callback': _.fusionGetValueWithUnit };
					cssVarsOptions.button_swatch_border_radius_bottom_left  = { 'callback': _.fusionGetValueWithUnit };
					cssVarsOptions.button_swatch_font_size                  = { 'callback': _.fusionGetValueWithUnit };
					cssVarsOptions.push( 'button_swatch_color' );
					cssVarsOptions.push( 'button_swatch_color_active' );

					if ( ! this.isDefault( 'button_swatch_width' ) ) {
						customVars.button_swatch_width = 'auto' === this.values.button_swatch_width ? 'auto' : _.fusionGetValueWithUnit( this.values.button_swatch_width );
					}
				}

				return this.getCustomCssVars( customVars ) + this.getCssVarsForOptions( cssVarsOptions );
			},

			/**
			 * Get product type.
			 *
			 * @since  3.8.1
			 * @param  {Object} values - The values object.
			 * @return {String}
			 */
			getProductType: function () {
				var product_type = 'simple';

				if ( 'undefined' !== typeof this.query_data && 'undefined' !== typeof this.query_data.product_type ) {
					product_type = this.query_data.product_type;
				}
				return product_type;
			}
		} );
	} );
}( jQuery ) );
