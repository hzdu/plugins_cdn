var FusionPageBuilder = FusionPageBuilder || {};

( function() {

	jQuery( document ).ready( function() {
		FusionPageBuilder.fusion_woo_order_additional_info = FusionPageBuilder.ElementView.extend( {

			/**
			 * Modify template attributes.
			 *
			 * @since 3.5
			 * @return {Object}
			 */
			filterTemplateAtts: function( values ) {
				var attributes = {};

				attributes.label = window.fusionAllElements[ this.model.get( 'element_type' ) ].name;
				attributes.icon  = window.fusionAllElements[ this.model.get( 'element_type' ) ].icon;

				attributes.elemAttr = this.elementAttr( values.values );

				return attributes;
			},

			/**
			 * Create the element attributes.
			 *
			 * @since 3.5
			 * @param {Object} values - The options.
			 * @return {Object}
			 */
			elementAttr: function( values ) {
				var atts = {
					'style': this.getInlineStyle( values ),
					'class': 'awb-woo-order-additional-info awb-woo-order-additional-info--' + this.model.get( 'cid' )
				};

				atts = _.fusionVisibilityAtts( values.hide_on_mobile, atts );

				if ( values[ 'class' ] ) {
					atts[ 'class' ] += ' ' + values[ 'class' ];
				}

				if ( values.id ) {
					atts.id = values.id;
				}

				atts = _.fusionAnimations( values, atts );

				return atts;
			},

			/**
			 * Get inline style.
			 *
			 * @since 3.9
			 * @param {Object} values
			 * @return string
			 */
			getInlineStyle: function( values ) {
				var cssVarsOptions = [];

				cssVarsOptions.margin_top    = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.margin_right  = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.margin_bottom = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.margin_left   = { 'callback': _.fusionGetValueWithUnit };

				this.values = values;

				return this.getCssVarsForOptions( cssVarsOptions );
			}


		} );
	} );
}( jQuery ) );
