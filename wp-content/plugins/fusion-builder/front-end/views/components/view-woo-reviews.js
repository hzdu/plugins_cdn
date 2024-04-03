/* eslint no-mixed-spaces-and-tabs: 0 */
var FusionPageBuilder = FusionPageBuilder || {};

( function() {


	jQuery( document ).ready( function() {

		// Woo Rating Component View.
		FusionPageBuilder.fusion_tb_woo_reviews = FusionPageBuilder.ElementView.extend( {

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
					this.model.set( 'params', params );
				}
			},

			/**
			 * Runs during render() call.
			 *
			 * @since 2.0
			 * @return {void}
			 */
			onRender: function() {
				var $this = this;

				jQuery( window ).on( 'load', function() {
					$this._refreshJs();
				} );
			},

			refreshJs: function() {
				jQuery( '#fb-preview' )[ 0 ].contentWindow.jQuery( 'body' ).find( '.fusion-builder-live-element[data-cid="' + this.model.get( 'cid' ) + '"] ' ).find( '.comment-form-rating select[name="rating"]:visible' ).trigger( 'init' );
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

				this.values = atts.values;
				this.params = this.model.get( 'params' );

				// Any extras that need passed on.
				attributes.cid         = this.model.get( 'cid' );
				attributes.wrapperAttr = this.buildAttr( atts.values );
				attributes.output      = this.buildOutput( atts );

				return attributes;
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
						class: 'fusion-woo-reviews-tb fusion-woo-reviews-tb-' + this.model.get( 'cid' ),
						style: ''
					} );

				if ( '' !== values[ 'class' ] ) {
					attr[ 'class' ] += ' ' + values[ 'class' ];
				}

				if ( 'no' == values.show_tab_title ) {
					attr[ 'class' ] += ' woo-reviews-hide-heading';
				}

				if ( ! this.isDefault( 'button_size' ) ) {
					attr[ 'class' ] += ' button-size-' + values.button_size;
				}

				if ( ! this.isDefault( 'button_stretch' ) ) {
					attr[ 'class' ] += ' button-stretch';
				}

				attr.style += this.getStyleVariables( values );

				if ( '' !== values.id ) {
					attr.id = values.id;
				}

				attr = _.fusionAnimations( values, attr );

				return attr;
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
					output = jQuery( jQuery.parseHTML( atts.markup.output ) ).filter( '.fusion-woo-reviews-tb' ).html();
					output = ( 'undefined' === typeof output ) ? atts.markup.output : output;
				} else if ( 'undefined' !== typeof atts.query_data && 'undefined' !== typeof atts.query_data.woo_reviews ) {
					output = atts.query_data.woo_reviews;
				}

				return this.disableInlineScripts( output );
			},

			/**
			 * Disables inline scripts.
			 *
			 * @since  3.2
			 * @param  {String} output - The output string.
			 * @return {String}
			 */
			disableInlineScripts: function( output ) {
				if ( -1 !== output.indexOf( '<script' ) && -1 !== output.indexOf( '</script>' ) ) {
					output = output.replace( '<script', '<!--<script' ).replace( '</script>', '</script>-->' );
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
					cssVarsOptions;

				// Text typography.
				jQuery.each( _.fusionGetFontStyle( 'text_font', values, 'object' ), function( rule, value ) {
						customVars[ 'text-' + rule ] = value;
				} );

				if ( ( 'string' === typeof this.params.button_gradient_top && '' !==  this.params.button_gradient_top ) ||  ( 'string' === typeof this.params.button_gradient_bottom && '' !==  this.params.button_gradient_bottom ) ) {
					customVars.button_gradient_top     = this.values.button_gradient_top;
					customVars.button_background_image = 'linear-gradient( to top, ' +  this.values.button_gradient_bottom + ', ' +  this.values.button_gradient_top + ' )';
				}

				if ( ( 'string' === typeof this.params.button_gradient_top_hover && '' !== this.params.button_gradient_top_hover ) ||  ( 'string' === typeof this.params.button_gradient_bottom_hover && '' !== this.params.button_gradient_bottom_hover ) ) {
					customVars.button_gradient_top_hover     = this.values.button_gradient_top_hover;
					customVars.button_background_image_hover = 'background-image', 'linear-gradient( to top, ' +  this.values.button_gradient_bottom_hover + ', ' +  this.values.button_gradient_top_hover + ' )';
				}

				if ( 'string' === typeof this.params.text_color && '' !== this.params.text_color ) {
					customVars.stars_default_color = this.values.text_color;
				}

				cssVarsOptions = [
					'text_color',
					'border_color',
					'stars_color',
					'rating_box_bg_color',
					'rating_box_active_bg_color',
					'button_color',
					'button_border_color',
					'button_color_hover',
					'button_border_color_hover',
					'text_line_height',
					'text_text_transform'
				];

				cssVarsOptions.margin_bottom        = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.margin_left          = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.margin_right         = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.margin_top           = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.text_font_size       = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.text_letter_spacing  = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.border_size          = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.button_border_top    = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.button_border_right  = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.button_border_bottom = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.button_border_left   = { 'callback': _.fusionGetValueWithUnit };


				return this.getCssVarsForOptions( cssVarsOptions ) + this.getCustomCssVars( customVars );
			}
		} );
	} );
}( jQuery ) );
