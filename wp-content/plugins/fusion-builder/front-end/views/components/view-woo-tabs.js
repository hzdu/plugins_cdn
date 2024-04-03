var FusionPageBuilder = FusionPageBuilder || {};

( function() {


	jQuery( document ).ready( function() {

		// Woo Rating Component View.
		FusionPageBuilder.fusion_tb_woo_tabs = FusionPageBuilder.ElementView.extend( {

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
				jQuery( '#fb-preview' )[ 0 ].contentWindow.jQuery( 'body' ).find( '.fusion-builder-live-element[data-cid="' + this.model.get( 'cid' ) + '"] ' ).find( '.wc-tabs-wrapper, .woocommerce-tabs, .comment-form-rating select[name="rating"]:visible' ).trigger( 'init' );
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
						class: 'fusion-woo-tabs-tb fusion-woo-tabs-tb-' + this.model.get( 'cid' ),
						style: ''
					} );

				attr.style += this.getStyleVariables( values );

				if ( '' !== values[ 'class' ] ) {
					attr[ 'class' ] += ' ' + values[ 'class' ];
				}

				if ( '' !== values.layout ) {
					attr[ 'class' ] += ' woo-tabs-' + values.layout;
				}

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
					output = jQuery( jQuery.parseHTML( atts.markup.output ) ).filter( '.fusion-woo-tabs-tb' ).html();
					output = ( 'undefined' === typeof output ) ? atts.markup.output : output;
				} else if ( 'undefined' !== typeof atts.query_data && 'undefined' !== typeof atts.query_data.woo_tabs ) {
					output = atts.query_data.woo_tabs;
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

				// Text typography.
				jQuery.each( _.fusionGetFontStyle( 'title_font', values, 'object' ), function( rule, value ) {
						customVars[ 'title-' + rule ] = value;
				} );

				if ( 'vertical' === values.layout && ! this.isDefault( 'nav_content_space' ) ) {
					customVars.nav_content_space = 'calc(220px + ' + _.fusionGetValueWithUnit( values.nav_content_space ) + ')';
				}

				if ( 'string' === typeof values.text_color && '' !== values.text_color ) {
					customVars.stars_default_color = values.text_color;
				}

				cssVarsOptions = [
					'backgroundcolor',
					'inactivebackgroundcolor',
					'active_nav_text_color',
					'inactive_nav_text_color',
					'bordercolor',
					'text_color',
					'title_color',
					'stars_color',
					'text_line_height',
					'text_text_transform',
					'title_line_height',
					'title_text_transform'
				];

				cssVarsOptions.margin_bottom          = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.margin_left            = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.margin_right           = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.margin_top             = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.text_font_size         = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.text_letter_spacing    = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.title_font_size        = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.title_letter_spacing   = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.content_padding_top    = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.content_padding_right  = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.content_padding_bottom = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.content_padding_left   = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.nav_padding_top        = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.nav_padding_right      = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.nav_padding_bottom     = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.nav_padding_left       = { 'callback': _.fusionGetValueWithUnit };


				return this.getCssVarsForOptions( cssVarsOptions ) + this.getCustomCssVars( customVars );
			}
		} );
	} );
}( jQuery ) );
