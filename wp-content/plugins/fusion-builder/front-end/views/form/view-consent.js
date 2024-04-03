/* global FusionPageBuilderApp */
var FusionPageBuilder = FusionPageBuilder || {};

( function() {

	jQuery( document ).ready( function() {
		// Fusion Form Checkbox View.
		FusionPageBuilder.fusion_form_consent = FusionPageBuilder.FormComponentView.extend( {

			/**
			 * Modify template attributes.
			 *
			 * @since 3.1
			 * @param {Object} atts - The attributes object.
			 * @return {Object}
			 */
			filterTemplateAtts: function( atts ) {
				var attributes = {};
				// Create attribute objects;
				attributes.styles = this.buildStyles( atts.values );
				attributes.html   = this.getMarkup( atts.values );

				return attributes;
			},

			getMarkup: function( values ) {
				var elementData = this.elementData( values ),
					checked,
					$option;

				if ( FusionPageBuilderApp.base64Encode( FusionPageBuilderApp.base64Decode( values.description ) ) === values.description ) {
					values.description = FusionPageBuilderApp.base64Decode( values.description );
					values.description = _.unescape( values.description );
				}

				if ( 'checkbox' === values.consent_type ) {
					checked  = 'checked' === values[ 'default' ] ? ' checked ' : '';
					$option   = '<div class="fusion-form-checkbox option-inline">';
					$option  += '<input ';
					$option  += 'tabindex="' + values.tab_index + '" id="' + values.name + '" type="checkbox" value="1" name="' + values.name + '"' + elementData[ 'class' ] + elementData.required + checked + '/>';
					$option  += '<label for="' + values.name + '">';
					$option  += values.description + '</label>';
					$option  += '</div>';
				} else {
					$option = '<p>' + values.description + '</p><input name="' + values.name + '" type="hidden" value="1"/>';
				}

				if ( '' !== values.tooltip ) {
					elementData.label += this.getFieldTooltip( values );
				}

				if ( '' !== values.label ) {
					elementData.label = '<div class="fusion-form-label-wrapper">' + elementData.label + '</div>';
				}

				if ( 'above' === this.formData._fusion.label_position ) {
					$option = elementData.label + $option;
				} else {
					$option = $option + elementData.label;
				}

				return this.generateFormFieldHtml( $option );
			}

		} );
	} );
}( jQuery ) );
