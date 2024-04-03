/* global FusionApp, fusionBuilderText */
var FusionPageBuilder = FusionPageBuilder || {};

( function() {

	jQuery( document ).ready( function() {
		// Fusion Form Select Image View.
		FusionPageBuilder.fusion_form_image_select = FusionPageBuilder.ParentElementView.extend( {

			onInit: function() {
				this.formData = FusionApp.data.postMeta;
				this.listenTo( window.FusionEvents, 'fusion-rerender-form-inputs', this.reRender );
			},

			/**
			 * Modify template attributes.
			 *
			 * @since 3.1
			 * @param {Object} atts - The attributes object.
			 * @return {Object}
			 */
			filterTemplateAtts: function( atts ) {
				var attributes  = {},
					elementData = this.elementData( atts.values );

				this.elementDataValues = elementData;
				this.values            = atts.values;

				if ( '' !== atts.values.tooltip ) {
					elementData.label      += this.getFieldTooltip( atts.values );
				}

				attributes.outerWrapper  = this.outerWrapper( atts.values );
				attributes.labelPosition = 'undefined' !== typeof this.formData._fusion.label_position ? this.formData._fusion.label_position : 'above';
				attributes.elementLabel  = elementData.label;

				return attributes;
			},

			getFieldTooltip: function( values ) {
				var html = '';

				if ( '' !== values.tooltip ) {
					html = '<div class="fusion-form-tooltip">';
					html += '<i class="awb-icon-question-circle"></i>';
					html += '<span class="fusion-form-tooltip-content">' + values.tooltip + '</span>';
					html += '</div>';
				}

				return html;
			},

			outerWrapper: function( values ) {
				var html,
					labelPosition = 'above',
					params = this.model.get( 'params' );

				if ( 'undefined' !== typeof this.formData._fusion.label_position ) {
					labelPosition = this.formData._fusion.label_position;
				}

				html = '<div ';

				// Add custom ID if it's there.
				if ( 'undefined' !== typeof params.id && '' !== params.id ) {
					html += 'id="' + params.id + '" ';
				}

				// Start building class.
				html += 'class="fusion-form-field fusion-form-field-' + this.model.get( 'element_type' ).replace( /_/g, '-' ) + this.model.get( 'cid' ) + ' fusion-form-field-' + this.model.get( 'element_type' ) + ' fusion-form-label-' + labelPosition;

				// Add inline class if needed.
				if ( 'floated' === values.form_field_layout ) {
					html += ' option-inline';
				}

				// Add custom class if it's there.
				if ( 'undefined' !== typeof params[ 'class' ] && '' !== params[ 'class' ] ) {
					html += ' ' + params[ 'class' ];
				}

				// Close class quotes.
				html += '"';

				html += ' style="' + this.getStyleVariables( values ) + '"';

				html += ' data-form-id="' + FusionApp.data.postDetails.post_id + '">';

				return html;
			},

			elementData: function( values ) {
				var data  = {};

				data.checked               = '';
				data.required              = '';
				data.required_label        = '';
				data.required_placeholder  = '';
				data[ 'class' ]            = '';
				data.id                    = '';
				data.placeholder           = '';
				data.label                 = '';
				data.label_class           = '';
				data.holds_private_data    = 'no';
				data.upload_size           = '';

				if ( 'undefined' === typeof values ) {
					return data;
				}

				if ( 'fusion_form_checkbox' === this.model.get( 'element_type' ) && 'undefined' !== typeof values.checked && values.checked ) {
					data.checked = ' checked="checked"';
				}

				if ( 'fusion_form_upload' === this.model.get( 'element_type' ) && 'undefined' !== typeof values.upload_size && values.upload_size ) {
					data.upload_size = ' data-size="' + values.upload_size + '"';
				}

				if ( 'undefined' !== typeof values.required && 'yes' === values.required ) {
					data.required             = ' required="true" aria-required="true"';
					data.required_label       = ' <abbr class="fusion-form-element-required" title="' + fusionBuilderText.required + '">*</abbr>';
					data.required_placeholder = '*';
				}

				data[ 'class' ] = ' class="fusion-form-input"';

				if ( 'undefined' !== typeof values.placeholder && '' !== values.placeholder ) {
					if ( 'fusion_form_dropdown' === this.model.get( 'element_type' ) ) {
						data.placeholder = values.placeholder + data.required_placeholder;
					} else {
						data.placeholder = ' placeholder="' + values.placeholder + data.required_placeholder + '"';
					}
				}

				if ( 'fusion_form_checkbox' === this.model.get( 'element_type' ) ) {
					data.label_class = ' class="fusion-form-checkbox-label"';
				}

				if ( 'undefined' !== typeof values.label && '' !== values.label ) {
					data.label = '<label for="' + values.name + '"' + data.label_class + '>' + values.label + data.required_label + '</label>';
				}

				data.holds_private_data = ' data-holds-private-data="false"';

				if ( 'undefined' !== typeof values.holds_private_data && '' !== values.holds_private_data ) {
					data.holds_private_data = ' data-holds-private-data="true"';
				}

				return data;
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

				jQuery.each( [ 'top', 'right', 'bottom', 'left' ], function( index, padding ) {
					var paddingName = 'padding_' + padding;

					if ( '' !== values[ paddingName ] ) {
						customVars[ 'padding-' + padding ] = _.fusionGetValueWithUnit( values[ paddingName ] );
					}
				} );

				if ( '' !== values.active_color ) {
					customVars[ 'hover-color' ] = jQuery.AWB_Color( values.active_color ).alpha( 0.5 ).toVarOrRgbaString();
				}


				cssVarsOptions = [
					'inactive_color',
					'active_color'
				];

				cssVarsOptions.width              = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.height             = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.border_size_top    = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.border_size_right  = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.border_size_bottom = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.border_size_left   = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.border_radius      = { 'callback': _.fusionGetValueWithUnit };

				return this.getCssVarsForOptions( cssVarsOptions ) + this.getCustomCssVars( customVars );
			}
		} );
	} );
}( jQuery ) );
