/* global fusionAllElements, fusionBuilderText */
var FusionPageBuilder = FusionPageBuilder || {};

( function() {

	jQuery( document ).ready( function() {

		// Text Element View.
		FusionPageBuilder.fusion_text = FusionPageBuilder.ElementView.extend( {

			/**
			 * Runs before view DOM is patched.
			 *
			 * @since 2.0.0
			 * @return null
			 */
			beforePatch: function() {

				if ( 'undefined' === typeof this.model.attributes.params.element_content || '' === this.model.attributes.params.element_content ) {
					this.model.attributes.params.element_content = fusionBuilderText.text_placeholder;
				}

			},

			afterPatch: function() {
				this._refreshJs();
			},

			/**
			 * Modify template attributes.
			 *
			 * @since 2.0
			 * @param {Object} atts - The attributes.
			 * @return {Object}
			 */
			filterTemplateAtts: function( atts ) {
				var attributes = {};

				// Validate values.
				this.validateValues( atts.values );

				// Create attribute objects
				attributes.attr			= this.buildAttr( atts.values );

				// Any extras that need passed on.
				attributes.cid    = this.model.get( 'cid' );
				attributes.output = _.autop( atts.values.element_content );

				return attributes;
			},

			/**
			 * Modifies the values.
			 *
			 * @since 3.0
			 * @param {Object} values - The values object.
			 * @return {void}
			 */
			validateValues: function( values ) {
				if ( 'undefined' !== typeof values.font_size && '' !== values.font_size ) {
					values.font_size = _.fusionGetValueWithUnit( values.font_size );
				}

				if ( 'undefined' !== typeof values.letter_spacing && '' !== values.letter_spacing ) {
					values.letter_spacing = _.fusionGetValueWithUnit( values.letter_spacing );
				}

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
			 * @since 2.0
			 * @param {Object} values - The values object.
			 * @return {Object}
			 */
			buildAttr: function( values ) {
				var self           = this,
					textAttributes = _.fusionVisibilityAtts( values.hide_on_mobile, {
						class: 'fusion-text fusion-text-' + this.model.get( 'cid' ),
						style: this.getStyleVars( values )
					} );

				textAttributes[ 'class' ] += _.fusionGetStickyClass( values.sticky_display );

				if ( 'default' === values.rule_style ) {
					values.rule_style = fusionAllElements.fusion_text.defaults.rule_style;
				}

				if ( this.flexDisplay() ) {

					if ( values.content_alignment_medium && values.content_alignment !== values.content_alignment_medium ) {
						textAttributes[ 'class' ] += ' md-text-align-' + values.content_alignment_medium;
					}

					if ( values.content_alignment_small && values.content_alignment !== values.content_alignment_small ) {
						textAttributes[ 'class' ] += ' sm-text-align-' + values.content_alignment_small;
					}
				}

				// Only add styling if more than one column is used.
				if ( 1 < values.columns ) {
					textAttributes[ 'class' ] += ' awb-text-cols fusion-text-columns-' + values.columns;
				}

				if ( 'undefined' !== typeof values[ 'class' ] && '' !== values[ 'class' ] ) {
					textAttributes[ 'class' ] += ' ' + values[ 'class' ];
				}

				if ( 'undefined' !== typeof values.id && '' !== values.id ) {
					textAttributes.id = values.id;
				}

				if ( '' !== values.margin_bottom ) {
					textAttributes[ 'class' ] += ' fusion-text-no-margin';
				}

				textAttributes = _.fusionInlineEditor( {
					cid: self.model.get( 'cid' )
				}, textAttributes );

				textAttributes = _.fusionAnimations( values, textAttributes );

				return textAttributes;
			},

			getStyleVars: function( values ) {
				var cssVars = [
						'content_alignment',
						'font_size',
						'line_height',
						'letter_spacing',
						'text_transform',
						'text_color',

						'margin_top',
						'margin_right',
						'margin_bottom',
						'margin_left'
					],
					customCSSVars = {},
					fontVars;
				this.values = values;

				// Only add styling if more than one column is used.
				if ( 1 < values.columns ) {
					cssVars.push( 'columns' );

					if ( values.column_spacing ) {
						customCSSVars.column_spacing = _.fusionValidateAttrValue( values.column_spacing, 'px' );
					}

					if ( values.column_min_width ) {
						customCSSVars.column_min_width = _.fusionValidateAttrValue( values.column_min_width, 'px' );
					}

					if ( 'none' !== values.rule_style ) {
						customCSSVars.rule_style = values.rule_size + 'px ' + values.rule_style + ' ' + values.rule_color;
					}
				}

				fontVars = this.getFontStylingVars( 'text_font', values );

				return this.getCssVarsForOptions( cssVars ) + this.getCustomCssVars( customCSSVars ) + fontVars;
			}
		} );
	} );
}( jQuery ) );
