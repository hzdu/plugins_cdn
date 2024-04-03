var FusionPageBuilder = FusionPageBuilder || {};

( function() {

	jQuery( document ).ready( function() {

		// Testimonials parent View.
		FusionPageBuilder.fusion_testimonials = FusionPageBuilder.ParentElementView.extend( {

			/**
			 * Runs after view DOM is patched.
			 *
			 * @since 2.0
			 * @return {void}
			 */
			afterPatch: function() {

				// TODO: save DOM and apply instead of generating.
				this.generateChildElements();

				jQuery( '#fb-preview' )[ 0 ].contentWindow.jQuery( 'body' ).trigger( 'fusion-element-render-fusion_testimonials', this.model.attributes.cid );
			},

			childViewAdded: function() {
				this.clearInterval();
			},

			childViewRemoved: function() {
				this.clearInterval();
			},

			childViewCloned: function() {
				this.clearInterval();
			},

			clearInterval: function() {

				// Clear interval, before DOM is patched an info is lost.
				jQuery( '#fb-preview' )[ 0 ].contentWindow.clearInterval( parseInt( jQuery( this.$el ).find( '.fusion-testimonials' ).attr( 'data-interval' ) ) );
				this.reRender();
			},

			// Empty on purpose, to override parent function.
			refreshJs: function() {}, // eslint-disable-line no-empty-function

			/**
			 * Modify template attributes.
			 *
			 * @since 2.0
			 * @param {Object} atts - The attributes.
			 * @return {Object}
			 */
			filterTemplateAtts: function( atts ) {
				var attributes = {};

				this.values = atts.values;

				this.validateValues( atts.values );

				attributes.attr           = this.buildAttr( atts.values );
				attributes.paginationAttr = this.buildPaginationAttr( atts.values );
				attributes.navigation     = atts.values.navigation;
				attributes.children       = 'undefined' !== typeof atts.values.element_content ? atts.values.element_content.match( /\[fusion_testimonial ((.|\n|\r)*?)\]/g ).length : 1;

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
				values.random = ( 'yes' === values.random || '1' === values.random ) ? 1 : 0;

				if ( 'clean' === values.design && '' === values.navigation ) {
					values.navigation = 'yes';
				} else if ( 'classic' === values.design && '' === values.navigation ) {
					values.navigation = 'no';
				}

				values.testimonial_border_color = '0' === values.testimonial_border_size ? 'rgba(255,255,255,0)' : values.testimonial_border_color;
			},

			/**
			 * Builds attributes.
			 *
			 * @since 2.0
			 * @param {Object} values - The values object.
			 * @return {Object}
			 */
			buildAttr: function( values ) {
				var attr = _.fusionVisibilityAtts( values.hide_on_mobile, {
					class: 'fusion-testimonials ' + values.design + ' awb-speech-bubble-' + values.testimonial_speech_bubble + ' fusion-testimonials-cid' + this.model.get( 'cid' ) + ' ' + values[ 'class' ],
					style: ''
				} );

				attr.style += this.getStyleVariables( values );

				attr[ 'data-random' ] = values.random;
				attr[ 'data-speed' ]  = values.speed;

				attr.id = values.id;

				return attr;
			},

			/**
			 * Builds attributes.
			 *
			 * @since 2.0
			 * @return {Object}
			 */
			buildPaginationAttr: function() {
				var paginationAttr = {
					class: 'testimonial-pagination',
					id: 'fusion-testimonials-cid' + this.model.get( 'cid' )
				};
				return paginationAttr;
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
						'textcolor',
						'testimonial_text_line_height',
						'testimonial_text_text_transform',
						'name_company_text_color',
						'name_company_line_height',
						'name_company_text_transform',
						'backgroundcolor',
						'testimonial_border_style',
						'navigation_color'
					],
					cssCustomVars = [];

				cssVarsOptions.testimonial_text_font_size      = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.testimonial_text_letter_spacing = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.name_company_font_size          = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.name_company_letter_spacing     = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.margin_top                      = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.margin_right                    = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.margin_bottom                   = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.margin_left                     = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.testimonial_border_top          = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.testimonial_border_right        = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.testimonial_border_bottom       = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.testimonial_border_left         = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.testimonial_border_color        = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.navigation_size                 = { 'callback': _.fusionGetValueWithUnit };

				cssCustomVars[ 'testimonial-border-width-top' ]    = _.fusionGetValueWithUnit( values.testimonial_border_top );
				cssCustomVars[ 'testimonial-border-width-right' ]  = _.fusionGetValueWithUnit( values.testimonial_border_right );
				cssCustomVars[ 'testimonial-border-width-bottom' ] = _.fusionGetValueWithUnit( values.testimonial_border_bottom );
				cssCustomVars[ 'testimonial-border-width-left' ]   = _.fusionGetValueWithUnit( values.testimonial_border_left );

				return this.getCssVarsForOptions( cssVarsOptions ) + this.getBorderRadiusVars( values ) + this.getCustomCssVars( cssCustomVars, false ) + this.getFontStylingVars( 'testimonial_text_font', values ) + this.getFontStylingVars( 'name_company_font', values );
			}

		} );
	} );
}( jQuery ) );
