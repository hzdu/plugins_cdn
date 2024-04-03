/* eslint no-mixed-spaces-and-tabs: 0 */
var FusionPageBuilder = FusionPageBuilder || {};

( function() {


	jQuery( document ).ready( function() {

		// Woo Product Component View.
		FusionPageBuilder.fusion_woo_product_grid = FusionPageBuilder.ElementView.extend( {

			onInit: function() {
				if ( this.model.attributes.markup && '' === this.model.attributes.markup.output ) {
					this.model.attributes.markup.output = this.getComponentPlaceholder();
				}
			},

			/**
			 * Modify template attributes.
			 *
			 * @since 3.2
			 * @param {Object} atts - The attributes.
			 * @return {Object}
			 */
			filterTemplateAtts: function( atts ) {
				var attributes = {};

				// Validate values.
				this.validateValues( atts.values );
				this.values = atts.values;
				this.extras = atts.extras;

				// Any extras that need passed on.
				attributes.cid             = this.model.get( 'cid' );
				attributes.attr            = this.buildAttr( atts.values );
				attributes.productsLoop    = this.buildOutput( atts );
				attributes.productsAttrs   = this.buildProductsAttrs( atts.values );
				attributes.pagination      = this.buildPagination( atts );
				attributes.paginationAttrs = this.buildPaginationAttrs();
				attributes.query_data      = atts.query_data;
				// add placeholder.
				attributes.query_data.placeholder = this.getComponentPlaceholder();
				attributes.values = atts.values;
				attributes.loadMoreText = atts.extras.load_more_text;

				return attributes;
			},

			/**
			 * Modifies the values.
			 *
			 * @since  3.2
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
			},

			/**
			 * Builds attributes.
			 *
			 * @since  3.2
			 * @param  {Object} values - The values object.
			 * @return {Object}
			 */
			buildAttr: function( values ) {
				var attr         = _.fusionVisibilityAtts( values.hide_on_mobile, {
						class: 'fusion-woo-product-grid fusion-product-archive fusion-woo-product-grid-' + this.model.get( 'cid' ),
						style: ''
					} );

				if ( '' !== values[ 'class' ] ) {
					attr[ 'class' ] += ' ' + values[ 'class' ];
				}

				if ( this.isSpacingOff() ) {
					attr[ 'class' ] += ' fusion-woo-product-grid-spacing-off';
				}

				if ( ! this.isDefault( 'grid_separator_color' ) && 'shadow' === values.grid_separator_style_type ) {
					attr[ 'class' ] += ' has-content-sep-shadow';
				}

				if ( ! this.isDefault( 'show_title' ) ) {
					attr[ 'class' ] += ' hide-product-title';
				}

				if ( ! this.isDefault( 'show_price' ) ) {
					attr[ 'class' ] += ' hide-price';
				}

				if ( ! this.isDefault( 'show_rating' ) ) {
					attr[ 'class' ] += ' hide-rating';
				}

				if ( ! this.isDefault( 'show_buttons' ) ) {
					attr[ 'class' ] += ' hide-buttons';
				}

				if ( ! this.isDefault( 'show_title' ) && ! this.isDefault( 'show_price' ) && ! this.isDefault( 'show_rating' ) && ! this.isDefault( 'show_buttons' ) ) {
					attr[ 'class' ] += ' hide-content';
				}

				if ( this.isLoadMore() ) {
					attr[ 'class' ] += ' has-load-more';
				}

				if ( ! this.isDefault( 'column_spacing' ) && '1' !== values.columns ) {
					attr[ 'class' ] += ' has-column-spacing';
				}

				attr.style += this.getStyleVariables( values );

				if ( '' !== values.id ) {
					attr.id = values.id;
				}

				attr = _.fusionAnimations( values, attr );

				return attr;
			},

			/**
			 * Builds carousel nav.
			 *
			 * @since 3.2
			 * @return {string}
			 */
			buildCarouselNav: function() {
				var output = '';

				output += '<div class="fusion-carousel-nav">';
				output += '<button class="fusion-nav-prev" aria-label="Previous"></button>';
				output += '<button class="fusion-nav-next" aria-label="Next"></button>';
				output += '</div>';

				return output;
			},

			/**
			 * Builds carousel attributes.
			 *
			 * @since 3.2
			 * @param {Object} values - The values.
			 * @return {Object}
			 */
			buildCarouselAttrs: function( values ) {
				var attr = {
					class: 'fusion-carousel'
				};

				/**
				 * Set the autoplay variable.
				 */
				attr[ 'data-autoplay' ] = values.products_autoplay;

				/**
				 * Set the touch scroll variable.
				 */
				attr[ 'data-touchscroll' ] = values.products_swipe;

				attr[ 'data-columns' ]     = values.products_columns;
				attr[ 'data-itemmargin' ]  = parseInt( values.products_column_spacing ) + 'px';
				attr[ 'data-itemwidth' ]   = 180;

				attr[ 'data-scrollitems' ] = ( 0 == values.products_swipe_items ) ? '' : values.products_swipe_items;

				return attr;
			},

			/**
			 * Builds products UL attributes.
			 *
			 * @since 3.2
			 * @param {Object} values - The values.
			 * @return {Object}
			 */
			buildProductsAttrs: function( values ) {
				var attr = {
					class: 'products products-' + values.columns
				};

				return attr;
			},

			/**
			 * Builds pagination attributes.
			 *
			 * @since 3.2
			 * @param {Object} values - The values.
			 * @return {Object}
			 */
			buildPaginationAttrs: function() {
				var attr = {
					class: 'fusion-woo-product-grid-pagination fusion-clearfix'
				};

				if ( this.isLoadMore() ) {
					attr[ 'class' ] += ' infinite-scroll infinite-scroll-hide';
				}

				return attr;
			},

			/**
			 * Check is load more.
			 *
			 * @since 3.2
			 * @return {boolean}
			 */
			isLoadMore: function() {
				return -1 !== jQuery.inArray( this.values.scrolling, [ 'infinite', 'load_more_button' ] );
			},

			/**
			 * Check if spacing should be off.
			 *
			 * @since 3.3
			 * @return {boolean}
			 */
			isSpacingOff: function() {
				return ! this.isDefault( 'show_price' ) && ! this.isDefault( 'show_rating' );
			},

			/**
			 * Builds output.
			 *
			 * @since  3.2
			 * @param  {Object} values - The values object.
			 * @return {String}
			 */
			buildOutput: function( atts ) {
				var output = '';

				if ( 'undefined' !== typeof atts.markup && 'undefined' !== typeof atts.markup.output && 'undefined' === typeof atts.query_data ) {
					output = jQuery( jQuery.parseHTML( atts.markup.output ) ).html();
					output = ( 'undefined' === typeof output ) ? atts.markup.output : output;
				} else if ( 'undefined' !== typeof atts.query_data && 'undefined' !== typeof atts.query_data.loop_product ) {
					output = atts.query_data.loop_product;
				}

				return output;
			},

			/**
			 * Builds pagination.
			 *
			 * @since  3.2
			 * @param  {Object} atts - The atts object.
			 * @return {String}
			 */
			buildPagination: function( atts ) {
				var output = '';

				if ( 'undefined' !== typeof atts.query_data && 'undefined' !== typeof atts.query_data.pagination ) {
					output = atts.query_data.pagination;
				}

				return output;
			},

			/**
			 * Gets style variables.
			 *
			 * @since 3.9
			 * @param  {Object} values - The values object.
			 * @return {String}
			 */
			getStyleVariables: function( values ) {
				var customVars = [],
					cssVarsOptions,
					colors,
					gradient,
					gradient_after,
					column_spacing;

				if ( ! this.isDefault( 'grid_separator_color' ) && 'shadow' === values.grid_separator_style_type ) {
					colors = jQuery.AWB_Color( values.grid_separator_color );
					gradient = 'linear-gradient(to left, rgba({1}, {2}, {3}, 0) 0%, rgba({1}, {2}, {3}, 0) 15%, rgba({1}, {2}, {3}, 0.65) 50%, rgba({1}, {2}, {3}, 0) 85%, rgba({1}, {2}, {3}, 0) 100%)';
					gradient = gradient.replace( /\{1\}/g, colors.red() ).replace( /\{2\}/g, colors.green() ).replace( /\{3\}/g, colors.blue() );
					gradient_after = 'radial-gradient(ellipse at 50% -50%, rgba({1}, {2}, {3}, 0.5) 0, rgba(255, 255, 255, 0) 65%)';
					gradient_after = gradient_after.replace( /\{1\}/g, colors.red() ).replace( /\{2\}/g, colors.green() ).replace( /\{3\}/g, colors.blue() );

					customVars.gradient       = gradient;
					customVars.gradient_after = gradient_after;
				}

				if ( ! this.isDefault( 'column_spacing' ) && 1 < parseInt( values.columns ) ) {
					column_spacing = _.fusionGetValueWithUnit( values.column_spacing );

					customVars.column_spacing_margin = 'calc((' + column_spacing + ')/ -2)';
					customVars.column_spacing_padding = 'calc((' + column_spacing + ')/ 2)';
				}


				cssVarsOptions = [
					'grid_box_color',
					'grid_border_color',
					'grid_separator_color'
				];

				cssVarsOptions.margin_bottom = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.margin_left   = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.margin_right  = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.margin_top    = { 'callback': _.fusionGetValueWithUnit };

				return this.getCssVarsForOptions( cssVarsOptions ) + this.getCustomCssVars( customVars );
			}

		} );
	} );
}( jQuery ) );
