var FusionPageBuilder = FusionPageBuilder || {};

( function() {

	jQuery( document ).ready( function() {

		// Accordion View.
		FusionPageBuilder.fusion_accordion = FusionPageBuilder.ParentElementView.extend( {

			/**
			 * Modify template attributes.
			 *
			 * @since 2.0
			 * @param {Object} atts - The attributes object.
			 * @return {Object}
			 */
			filterTemplateAtts: function( atts ) {
				var attributes = {};
				this.values = atts.values;

				this.validateValues( atts.values );

				// Create attribute objects.
				attributes.toggleShortcode           = this.buildToggleAttr( atts.values );
				attributes.toggleShortcodePanelGroup = this.buildPanelGroupAttr( atts.values );

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
				values.icon_size       = _.fusionValidateAttrValue( values.icon_size, 'px' );
				values.border_size     = _.fusionValidateAttrValue( values.border_size, 'px' );
				values.title_font_size = _.fusionValidateAttrValue( values.title_font_size, 'px' );
				values.margin_bottom   = _.fusionValidateAttrValue( values.margin_bottom, 'px' );
				values.margin_top      = _.fusionValidateAttrValue( values.margin_top, 'px' );
			},

			/**
			 * Builds attributes.
			 *
			 * @since 2.0
			 * @param {Object} values - The values object.
			 * @return {Object}
			 */
			buildToggleAttr: function( values ) {
				var toggleShortcode = _.fusionVisibilityAtts( values.hide_on_mobile, {
					class: 'accordian fusion-accordian',
					style: ''
				} );

				if ( '' !== values.margin_top ) {
					toggleShortcode.style += 'margin-top:' + values.margin_top + ';';
				}

				if ( '' !== values.margin_bottom ) {
					toggleShortcode.style += 'margin-bottom:' + values.margin_bottom + ';';
				}

				if ( ' ' !== values[ 'class' ] ) {
					toggleShortcode[ 'class' ] += ' ' + values[ 'class' ];
				}

				if ( '' !== values.id ) {
					toggleShortcode.id = values.id;
				}

				toggleShortcode.style += this.getStyleVariables( values );

				return toggleShortcode;
			},

			/**
			 * Builds attributes.
			 *
			 * @since 2.0
			 * @param {Object} values - The values object.
			 * @return {Object}
			 */
			buildPanelGroupAttr: function( values ) {
				var toggleShortcodePanelGroup = {
					class: 'panel-group fusion-child-element',
					id: 'accordion-cid' + this.model.get( 'cid' )
				};

				if ( 'right' === values.icon_alignment ) {
					toggleShortcodePanelGroup[ 'class' ] += ' fusion-toggle-icon-right';
				}

				if ( '0' === values.icon_boxed_mode || 'no' === values.icon_boxed_mode ) {
					toggleShortcodePanelGroup[ 'class' ] += ' fusion-toggle-icon-unboxed';
				}

				toggleShortcodePanelGroup[ 'data-empty' ] = this.emptyPlaceholderText;

				return toggleShortcodePanelGroup;
			},

			/**
			 * Gets style variables.
			 *
			 * @since 3.9
			 * @param {Object} values - The values.
			 * @return {String}
			 */
			getStyleVariables: function( values ) {
				const cssVarsOptions = [
					'content_text_transform',
					'content_line_height',
					'icon_alignment'
				];

				cssVarsOptions.margin_top    = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.margin_bottom = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.padding_top    = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.padding_right    = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.padding_bottom = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.padding_left = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.border_size = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.icon_size = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.content_font_size = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.content_letter_spacing = { 'callback': _.fusionGetValueWithUnit };

				const customVars = [];

				if ( values.hover_color ) {
					customVars.hover_color = values.hover_color;
				}
				if ( values.border_color ) {
					customVars.border_color = values.border_color;
				}
				if ( values.background_color ) {
					customVars.background_color = values.background_color;
				}
				if ( values.divider_color ) {
					customVars.divider_color = values.divider_color;
				}
				if ( values.divider_hover_color ) {
					customVars.divider_hover_color = values.divider_hover_color;
				}
				if ( values.icon_color ) {
					customVars.icon_color = values.icon_color;
				}
				if ( values.title_color ) {
					customVars.title_color = values.title_color;
				}
				if ( values.content_color ) {
					customVars.content_color = values.content_color;
				}
				if ( values.icon_box_color ) {
					customVars.icon_box_color = values.icon_box_color;
				}
				if ( values.toggle_hover_accent_color ) {
					customVars.toggle_hover_accent_color = values.toggle_hover_accent_color;
				}
				if ( values.toggle_active_accent_color ) {
					customVars.toggle_active_accent_color = values.toggle_active_accent_color;
				}

				const title_typography = _.fusionGetFontStyle( 'title_font', values, 'object' );


				if ( title_typography[ 'font-family' ] ) {
					customVars.title_font_family = title_typography[ 'font-family' ];
				}

				if ( title_typography[ 'font-weight' ] ) {
					customVars.title_font_weight = title_typography[ 'font-weight' ];
				}

				if ( title_typography[ 'font-style' ] ) {
					customVars.title_font_style = title_typography[ 'font-style' ];
				}

				if ( values.title_font_size ) {
					customVars.title_font_size = _.fusionGetValueWithUnit( values.title_font_size );
				}

				if ( values.title_letter_spacing ) {
					customVars.title_letter_spacing = _.fusionGetValueWithUnit( values.title_letter_spacing );
				}

				if ( values.title_line_height ) {
					customVars.title_line_height = values.title_line_height;
				}

				if ( values.title_text_transform ) {
					customVars.title_text_transform = values.title_text_transform;
				}

				if ( values.title_color ) {
					customVars.title_color = values.title_color;
				}

				return this.getCssVarsForOptions( cssVarsOptions ) + this.getCustomCssVars( customVars ) + this.getFontStylingVars( 'content_font', values );
			}
		} );
	} );
}( jQuery ) );
