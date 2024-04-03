/* global fusionSanitize, FusionPageBuilderApp */
var FusionPageBuilder = FusionPageBuilder || {};

( function() {

	jQuery( document ).ready( function() {
		// Fusion Form Rating View.
		FusionPageBuilder.fusion_form_rating = FusionPageBuilder.FormComponentView.extend( {

			/**
			 * Modify template attributes.
			 *
			 * @since 3.1
			 * @param {Object} atts - The attributes object.
			 * @return {Object}
			 */
			filterTemplateAtts: function( atts ) {
				var attributes = {};

				this.values = atts.values;

				// Create attribute objects;
				attributes.html = this.generateFormFieldHtml( this.generateRatingField( atts.values ) );

				return attributes;
			},

			generateRatingField: function( values ) {
				var elementData,
					elementName,
					elementHtml = '',
					limit,
					options    = '',
					html       = '',
					option;

				elementData = this.elementData( values );
				limit 		= fusionSanitize.number( values.limit );
				elementName = values.name;

				while ( 0 < limit ) {
					const checked = 2 >= limit ? 'checked' : '';
					option = limit;
					options += '<input id="' + option + '-' + this.model.get( 'cid' ) + '" type="radio" value="' + option + '" name="' + elementName + '"' + elementData[ 'class' ] + elementData.required + elementData.checked + elementData.holds_private_data + checked + '/>';
					options += '<label for="' + option + '-' + this.model.get( 'cid' ) + '" class="fusion-form-rating-icon">';
					options += '<i class="' + values.icon + '"></i>';
					options +=
					'</label>';
					limit--;
				}

				elementHtml += '<fieldset class="fusion-form-rating-area fusion-form-rating-area-' + this.model.get( 'cid' ) + ( FusionPageBuilderApp.$el.hasClass( 'rtl' ) ? ' rtl' : '' ) + '">';
				elementHtml += options;
				elementHtml += '</fieldset>';

				if ( '' !== values.tooltip ) {
					elementData.label += this.getFieldTooltip( values );
				}

				html = this.generateLabelHtml( html, elementHtml, elementData.label );

				return html;
			},

			/**
			 * Gets style variables.
			 *
			 * @since 3.9
			 * @param {Object} values - The values.
			 * @return {String}
			 */
			getStyleVariables: function( values ) {
				var customVars = [],
					cssVarsOptions;

				if ( '' !== values.active_icon_color ) {
					customVars[ 'hover-color' ] = jQuery.AWB_Color( values.active_icon_color ).alpha( 0.5 ).toVarOrRgbaString();
				}


				cssVarsOptions = [
					'icon_color',
					'active_icon_color'
				];

				cssVarsOptions.icon_size = { 'callback': _.fusionGetValueWithUnit };

				return this.getCssVarsForOptions( cssVarsOptions ) + this.getCustomCssVars( customVars );
			}

		} );
	} );
}( jQuery ) );
