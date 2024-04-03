/* global fusionBuilderText */

var FusionPageBuilder = FusionPageBuilder || {};

( function() {

	jQuery( document ).ready( function() {

		// Woo Filters View.
		FusionPageBuilder.WooFiltersView = FusionPageBuilder.ElementView.extend( {

			onInit: function() {
				if ( this.model.attributes.markup && ! this.model.attributes.markup.output ) {
					this.model.attributes.markup.output = '' === this.model.attributes.markup.output ? this.getComponentPlaceholder( this.model.attributes ) : this.model.attributes.markup.output;
				}
			},

			/**
			 * Modify template attributes.
			 *
			 * @since 3.8
			 * @param {Object} atts - The attributes.
			 * @return {Object}
			 */
			filterTemplateAtts: function( atts ) {
				var attributes = {};

				// Validate values.
				this.validateValues( atts.values );

				this.values = atts.values;
				this.extras = atts.extras;
				this.query_data = atts.query_data;

				// Any extras that need passed on.
				attributes.cid    = this.model.get( 'cid' );
				attributes.attr   = this.buildAttr( atts.values );
				attributes.output = this.buildOutput( atts );

				return attributes;
			},

			/**
			 * Modifies the values.
			 *
			 * @since  3.8
			 * @param  {Object} values - The values object.
			 * @return {void}
			 */
			validateValues: function( values ) {
				if ( 'undefined' !== typeof values.margin_top && '' !== values.margin_top ) {
					values.margin_top = _.fusionGetValueWithUnit( values.margin_top );
				}

				if ( 'undefined' !== typeof values.margin_right && '' !== values.margin_right ) {
					values.margin_right = _.fusionGetValueWithUnit( values.margin_right );
				}

				if ( 'undefined' !== typeof values.margin_bottom && '' !== values.margin_bottom ) {
					values.margin_bottom = _.fusionGetValueWithUnit( values.margin_bottom );
				}

				if ( 'undefined' !== typeof values.margin_left && '' !== values.margin_left ) {
					values.margin_left = _.fusionGetValueWithUnit( values.margin_left );
				}

				if ( 'undefined' !== typeof values.title_font_size && '' !== values.title_font_size ) {
					values.title_font_size = _.fusionGetValueWithUnit( values.title_font_size );
				}

				if ( 'undefined' !== typeof values.title_letter_spacing && '' !== values.title_letter_spacing ) {
					values.title_letter_spacing = _.fusionGetValueWithUnit( values.title_letter_spacing );
				}

				_.each( [ 'top', 'bottom' ], function( direction ) {
					var marginKey = 'title_margin_' + direction;
					if ( 'undefined' !== typeof values[ marginKey ] && '' !== values[ marginKey ] ) {
						values[ marginKey ] = _.fusionGetValueWithUnit( values[ marginKey ] );
					}
				} );
			},

			/**
			 * Builds attributes.
			 *
			 * @since  3.8
			 * @param  {Object} values - The values object.
			 * @return {Object}
			 */
			buildAttr: function( values ) {
				var attr         = _.fusionVisibilityAtts( values.hide_on_mobile, {
						class: 'awb-woo-filters ' + this.shortcode_classname + ' ' + this.shortcode_classname + '-' + this.model.get( 'cid' ),
						style: ''
					} );

				attr.style += this.getStyleVariables( values );

				if ( '' !== values[ 'class' ] ) {
					attr[ 'class' ] += ' ' + values[ 'class' ];
				}

				if ( '' !== values.id ) {
					attr.id = values.id;
				}

				if ( 'yes' !== values.show_title ) {
					attr[ 'class' ] += ' hide-show_title';
				}

				attr = _.fusionAnimations( values, attr );

				return attr;
			},

			/**
			 * Builds output.
			 *
			 * @since  3.8
			 * @param  {Object} values - The values object.
			 * @return {String}
			 */
			buildOutput: function( atts ) {
				var output = '';

				if ( 'undefined' !== typeof atts.markup && 'undefined' !== typeof atts.markup.output && 'undefined' === typeof atts.query_data ) {
					output = jQuery( jQuery.parseHTML( atts.markup.output ) ).html();
					output = ( 'undefined' === typeof output ) ? atts.markup.output : output;
				} else if ( 'undefined' !== typeof atts.query_data && 'undefined' !== typeof atts.query_data.output ) {
					output = atts.query_data.output;
				}

				if ( '' === output ) {
					output = this.getComponentPlaceholder( atts );
				}

				return output;
			},

			/**
			 * Gets style variables.
			 *
			 * @since  3.8
			 * @param  {Object} values - The values object.
			 * @return {String}
			 */
			getStyleVariables: function( values, customVars = []  ) {
				var marginKey;

				// Title Typo.
				customVars = this.getTypoVars( {
					'title_font': 'font',
					'title_font_size': 'size',
					'title_line_height': 'line_height',
					'title_letter_spacing': 'letter_spacing',
					'title_text_transform': 'text_transform',
					'title_color': 'color'
				}, values, customVars );

				if ( values.margin_top ) {
					customVars.margin_top = values.margin_top;
				}

				if ( values.margin_right ) {
					customVars.margin_right = values.margin_right;
				}

				if ( values.margin_bottom ) {
					customVars.margin_bottom = values.margin_bottom;
				}

				if ( values.margin_left ) {
					customVars.margin_left = values.margin_left;
				}

				// Title Margin.
				_.each( [ 'top', 'bottom' ], function( direction ) {
					marginKey = 'title_margin_' + direction;
					if ( ! this.isDefault( marginKey ) ) {
						customVars[ 'title-margin' + direction ] = values[ marginKey ];
					}
				}, this );

				return customVars;
			},

			/**
			 * Get dimension variable css.
			 *
			 * @since  3.8
			 */
			getDimensionVars: function( option_name, values, customVars ) {
				var key;

				_.each( [ 'top', 'right', 'bottom', 'left' ], function( direction ) {
					key = `${option_name}_${direction}`;

					if ( ! this.isDefault( key ) ) {
						customVars[ key ] = values[ key ];
					}
				}, this );

				return customVars;
			},

			/**
			 * Gets style variables.
			 *
			 * @since  3.8
			 * @param  {Object} values     - The values object.
			 * @param  {Object} customVars - The custom vars object.
			 * @return {String}
			 */
			getTypoVars: function( params, values, customVars ) {
				var fontStyles = '';

				_.each( params, function( type, key ) {

					if ( 'font' === type ) {
						fontStyles = _.fusionGetFontStyle( key, values, 'array' );
						_.each( fontStyles, function( value, rule ) {
							customVars[ key + '_' + rule ] = fontStyles[ rule ];
						}, this );
					} else if ( ! this.isDefault( key ) ) {
						customVars[ key ] = values[ key ];
					}
				}, this );

				return customVars;
			},

			/**
			 * Get the placeholder.
			 *
			 * @since 3.8
			 * @return {string}
			 */
			getPlaceholder: function() {
				var label  		= window.fusionAllElements[ this.model.get( 'element_type' ) ].name;
				var icon   		= window.fusionAllElements[ this.model.get( 'element_type' ) ].icon;

				var placeholder = _.template( '<div class="fusion-builder-placeholder-preview awb-narrow-placeholder-preview"><i class="<%= icon %>" aria-hidden="true"></i> <%= label %></div>' );
				return placeholder( { icon: icon, label: label } );
			},

			/**
			 * Get component placeholder.
			 *
			 * @since 3.8
			 * @return {string}
			 */
			getComponentPlaceholder: function( atts ) {
				var placeholder,
					msg = fusionBuilderText.dynamic_source;

				if ( 'undefined' !== typeof atts.query_data && 'undefined' !== typeof atts.query_data.msg && '' !== atts.query_data.msg ) {
					msg = atts.query_data.msg;
				}

				placeholder = jQuery( this.getPlaceholder() ).append( '<a href="#" class="fusion-tb-source">' + msg + '</a>' );
				return placeholder[ 0 ].outerHTML;
			}
		} );

        // Woo Filters Active View.
		FusionPageBuilder.fusion_tb_woo_filters_active = FusionPageBuilder.WooFiltersView.extend( {

			/**
			 * Define shortcode handle.
			 *
			 * @since  3.8
			 */
			shortcode_handle: 'fusion_tb_woo_filters_active',

			/**
			 * Define shortcode classname.
			 *
			 * @since  3.8
			 */
			shortcode_classname: 'awb-woo-filters-active',

			/**
			 * Builds attributes.
			 *
			 * @since  3.8
			 * @param  {Object} values - The values object.
			 * @return {Object}
			 */
			buildAttr: function( values ) {
				var attr = FusionPageBuilder.WooFiltersView.prototype.buildAttr.call( this, values );

				return attr;
			},

			/**
			 * Modifies the values.
			 *
			 * @since  3.8
			 * @param  {Object} values - The values object.
			 * @return {void}
			 */
			validateValues: function( values ) {
				var units = [
					'item_font_size',
					'item_letter_spacing',
					'item_padding_top',
					'item_padding_right',
					'item_padding_bottom',
					'item_padding_left'
				];

				FusionPageBuilder.WooFiltersView.prototype.validateValues.call( this, values );

				_.each( units, function( unit ) {
					if ( 'undefined' !== typeof values[ unit ] && '' !== values[ unit ] ) {
						values[ unit ] = _.fusionGetValueWithUnit( values[ unit ] );
					}
				}, this );
			},

			/**
			 * Gets style variables.
			 *
			 * @since  3.8
			 * @param  {Object} values - The values object.
			 * @return {String}
			 */
			getStyleVariables: function( values ) {
				var customVars = FusionPageBuilder.WooFiltersView.prototype.getStyleVariables.call( this, values, [] );

				var cssVarsOptions = [
					'item_color',
					'item_bgcolor',
					'item_hover_color',
					'item_hover_bgcolor'
				];

				// Item Typo.
				customVars = this.getTypoVars( {
					'item_font': 'font',
					'item_font_size': 'size',
					'item_line_height': 'line_height',
					'item_letter_spacing': 'letter_spacing',
					'item_text_transform': 'text_transform'
				}, values, customVars );

				// Item Padding.
				customVars = this.getDimensionVars( 'item_padding', values, customVars );
				return this.getCssVarsForOptions( cssVarsOptions ) + this.getCustomCssVars( customVars );
			}

		} );

        // Woo Filters Price View.
		FusionPageBuilder.fusion_tb_woo_filters_price = FusionPageBuilder.WooFiltersView.extend( {

			/**
			 * Define shortcode handle.
			 *
			 * @since  3.8
			 */
			shortcode_handle: 'fusion_tb_woo_filters_price',

			/**
			 * Define shortcode classname.
			 *
			 * @since  3.8
			 */
			shortcode_classname: 'awb-woo-filters-price',

			/**
			 * Builds attributes.
			 *
			 * @since  3.8
			 * @param  {Object} values - The values object.
			 * @return {Object}
			 */
			buildAttr: function( values ) {
				var attr = FusionPageBuilder.WooFiltersView.prototype.buildAttr.call( this, values );

				return attr;
			},

			/**
			 * Modifies the values.
			 *
			 * @since  3.8
			 * @param  {Object} values - The values object.
			 * @return {void}
			 */
			validateValues: function( values ) {
				var units = [
					'price_font_size',
					'price_letter_spacing'
				];

				FusionPageBuilder.WooFiltersView.prototype.validateValues.call( this, values );

				_.each( units, function( unit ) {
					if ( 'undefined' !== typeof values[ unit ] && '' !== values[ unit ] ) {
						values[ unit ] = _.fusionGetValueWithUnit( values[ unit ] );
					}
				}, this );
			},

			/**
			 * Gets style variables.
			 *
			 * @since  3.8
			 * @param  {Object} values - The values object.
			 * @return {String}
			 */
			getStyleVariables: function( values ) {
				var customVars = FusionPageBuilder.WooFiltersView.prototype.getStyleVariables.call( this, values, [] );

				var cssVarsOptions = [
					'range_filled_color',
					'range_unfilled_color',
					'range_button_color',
					'range_button_bgcolor',
					'range_button_hover_color',
					'range_button_hover_bgcolor',
					'range_handle_bgcolor',
					'range_handle_border_color'
				];

				// Price Typo.
				customVars = this.getTypoVars( {
					'price_font': 'font',
					'price_font_size': 'size',
					'price_line_height': 'line_height',
					'price_letter_spacing': 'letter_spacing',
					'price_text_transform': 'text_transform',
					'price_color': 'color'
				}, values, customVars );

				return this.getCssVarsForOptions( cssVarsOptions ) + this.getCustomCssVars( customVars );
			},

			/**
			 * Runs after view DOM is patched.
			 *
			 * @since 3.8
			 * @return null
			 */
			afterPatch: function() {

				// This will trigger a JS event on the preview frame.
				this._refreshJs();

				jQuery( '#fb-preview' )[ 0 ].contentWindow.jQuery( 'body' ).trigger( 'init_price_filter' );
			}

		} );

        // Woo Filters Rating View.
		FusionPageBuilder.fusion_tb_woo_filters_rating = FusionPageBuilder.WooFiltersView.extend( {

			/**
			 * Define shortcode handle.
			 *
			 * @since  3.8
			 */
			shortcode_handle: 'fusion_tb_woo_filters_rating',

			/**
			 * Define shortcode classname.
			 *
			 * @since  3.8
			 */
			shortcode_classname: 'awb-woo-filters-rating',

			/**
			 * Builds attributes.
			 *
			 * @since  3.8
			 * @param  {Object} values - The values object.
			 * @return {Object}
			 */
			buildAttr: function( values ) {
				var attr = FusionPageBuilder.WooFiltersView.prototype.buildAttr.call( this, values );

				return attr;
			},

			/**
			 * Gets style variables.
			 *
			 * @since  3.8
			 * @param  {Object} values - The values object.
			 * @return {String}
			 */
			getStyleVariables: function( values ) {
				var customVars = FusionPageBuilder.WooFiltersView.prototype.getStyleVariables.call( this, values, [] );

				var cssVarsOptions = [
					'text_color',
					'text_hover_color',
					'star_color',
					'star_hover_color'
				];

				return this.getCssVarsForOptions( cssVarsOptions ) + this.getCustomCssVars( customVars );
			}

		} );

        // Woo Filters Attribute View.
		FusionPageBuilder.fusion_tb_woo_filters_attribute = FusionPageBuilder.WooFiltersView.extend( {

			/**
			 * Define shortcode handle.
			 *
			 * @since  3.8
			 */
			shortcode_handle: 'fusion_tb_woo_filters_attribute',

			/**
			 * Define shortcode classname.
			 *
			 * @since  3.8
			 */
			shortcode_classname: 'awb-woo-filters-attribute',

			/**
			 * Builds attributes.
			 *
			 * @since  3.8
			 * @param  {Object} values - The values object.
			 * @return {Object}
			 */
			buildAttr: function( values ) {
				var attr = FusionPageBuilder.WooFiltersView.prototype.buildAttr.call( this, values );

				if ( 'undefined' !== typeof this.query_data && 'undefined' !== typeof this.query_data.extra_classes ) {
					attr[ 'class' ] += ` ${this.query_data.extra_classes}`;
				}
				return attr;
			},

			/**
			 * Modifies the values.
			 *
			 * @since  3.8
			 * @param  {Object} values - The values object.
			 * @return {void}
			 */
			validateValues: function( values ) {
				var units = [
					'list_padding_top',
					'list_padding_right',
					'list_padding_bottom',
					'list_padding_left',
					'list_item_font_size',
					'list_item_letter_spacing',
					'attr_padding_top',
					'attr_padding_right',
					'attr_padding_bottom',
					'attr_padding_left',
					'count_font_size'
				];

				FusionPageBuilder.WooFiltersView.prototype.validateValues.call( this, values );

				_.each( units, function( unit ) {
					if ( 'undefined' !== typeof values[ unit ] && '' !== values[ unit ] ) {
						values[ unit ] = _.fusionGetValueWithUnit( values[ unit ] );
					}
				}, this );
			},

			/**
			 * Gets style variables.
			 *
			 * @since  3.8
			 * @param  {Object} values - The values object.
			 * @return {String}
			 */
			getStyleVariables: function( values ) {
				var customVars     = FusionPageBuilder.WooFiltersView.prototype.getStyleVariables.call( this, values, [] ),
					cssVarsOptions = [
					'list_color',
					'list_hover_color',
					'list_sep_color',
					'list_color',
					'list_hover_color',
					'list_bgcolor',
					'list_hover_bgcolor',
					'list_sep_color',
					'attr_color',
					'attr_bgcolor',
					'attr_border_color',
					'attr_hover_color',
					'attr_hover_bgcolor',
					'attr_border_hover_color',
					'dd_color',
					'dd_bgcolor',
					'dd_hover_color',
					'dd_hover_bgcolor',
					'dd_border_color',
					'count_color',
					'count_hover_color'
				];

				// List Item Padding.
				customVars = this.getDimensionVars( 'list_padding', values, customVars );

				// List Item Typo.
				customVars = this.getTypoVars( {
					'list_item_font': 'font',
					'list_item_font_size': 'size',
					'list_item_line_height': 'line_height',
					'list_item_letter_spacing': 'letter_spacing',
					'list_item_text_transform': 'text_transform'
				}, values, customVars );

				// Attribute Padding.
				customVars = this.getDimensionVars( 'attr_padding', values, customVars );

				if ( ! this.isDefault( 'list_align' ) ) {
					customVars.list_align = values.list_align;
				}

				// Count Typo.
				customVars = this.getTypoVars( {
					'count_font': 'font',
					'count_font_size': 'size',
					'count_line_height': 'line_height',
					'count_letter_spacing': 'letter_spacing',
					'count_text_transform': 'text_transform'
				}, values, customVars );

				if ( ! this.isDefault( 'show_count' ) ) {
					customVars.show_count = 'none';
				}

				return this.getCssVarsForOptions( cssVarsOptions ) + this.getCustomCssVars( customVars );
			},

			/**
			 * Runs after view DOM is patched.
			 *
			 * @since 3.8
			 * @return null
			 */
			afterPatch: function() {
				var self = this,
					$obj;

				// This will trigger a JS event on the preview frame.
				this._refreshJs();

				if ( 'function' === typeof jQuery( '#fb-preview' )[ 0 ].contentWindow.jQuery.fn.selectWoo ) {
					$obj = jQuery( '#fb-preview' )[ 0 ].contentWindow.jQuery( '.awb-woo-filters .dropdown_layered_nav_' + this.model.attributes.params.attribute );
					$obj.selectWoo( {
						minimumResultsForSearch: 5,
						width: '100%',
						allowClear: true
					} );

					$obj.on( 'select2:open', function() {
						$obj.data( 'select2' ).$dropdown.addClass( 'awb-woo-filters' )[ 0 ].style.cssText += self.getStyleVariables( self.model.attributes.params );
					} );
				}
			}
		} );
	} );
}( jQuery ) );
