/* global */
var FusionPageBuilder = FusionPageBuilder || {};

( function() {
	jQuery( document ).ready( function() {
		// Button Element View.
		FusionPageBuilder.fusion_search = FusionPageBuilder.ElementView.extend( {

			/**
			 * Modify template attributes.
			 *
			 * @since 2.2
			 * @param {Object} atts - The attributes.
			 * @return {Object}
			 */
			filterTemplateAtts: function( atts ) {
				var attributes = {};

				this.values = atts.values;
				this.validateValues( atts.values );

				attributes.wrapperAttr = this.buildAttr( atts.values );
				attributes.formAttr    = this.buildFormAttr( atts.values );

				// Any extras that need passed on.
				attributes.cid = this.model.get( 'cid' );

				// Any extras that need passed on.
				attributes.values = atts.values;

				return attributes;
			},

			/**
			 * Validates the values.
			 *
			 * @since 3.0
			 * @param {Object} values - The values object.
			 * @return {void}
			 */
			validateValues: function( values ) {

				// Old value check.
				if ( values.border_width ) {
					values.border_width       = _.fusionValidateAttrValue( values.border_width, 'px' );
					values.border_size_top    = '' !== values.border_size_top ? values.border_width : values.border_size_top;
					values.border_size_right  = '' !== values.border_size_right ? values.border_width : values.border_size_right;
					values.border_size_bottom = '' !== values.border_size_bottom ? values.border_width : values.border_size_bottom;
					values.border_size_left   = '' !== values.border_size_left ? values.border_width : values.border_size_left;
					delete values.border_width;
				}

				values.margin_top    = _.fusionValidateAttrValue( values.margin_top, 'px' );
				values.margin_right  = _.fusionValidateAttrValue( values.margin_right, 'px' );
				values.margin_bottom = _.fusionValidateAttrValue( values.margin_bottom, 'px' );
				values.margin_left   = _.fusionValidateAttrValue( values.margin_left, 'px' );
				values.input_height  = _.fusionValidateAttrValue( values.input_height, 'px' );
				values.border_radius = _.fusionValidateAttrValue( values.border_radius, 'px' );
			},

			buildFormAttr: function( values ) {
				var attr = {
					class: 'searchform fusion-search-form fusion-live-search'
				};

				if ( values.design ) {
					attr[ 'class' ] += ' fusion-search-form-' + values.design;
				}

				return attr;
			},

			buildAttr: function( values ) {
				var cssVars = [
						'text_color',
						'border_color',
						'focus_border_color',
						'text_size',
						'bg_color',
						'live_results_bg_color',
						'live_results_link_color',
						'live_results_meta_color',
						'live_results_scrollbar_bg',
						'live_results_scrollbar_handle',
						'live_results_border_color'
					],
					attr = _.fusionVisibilityAtts( values.hide_on_mobile, {
						class: 'fusion-search-element fusion-search-element-' + this.model.get( 'cid' )
					} );

				cssVars.margin_top         = { 'callback': _.fusionGetValueWithUnit };
				cssVars.margin_right       = { 'callback': _.fusionGetValueWithUnit };
				cssVars.margin_bottom      = { 'callback': _.fusionGetValueWithUnit };
				cssVars.margin_left        = { 'callback': _.fusionGetValueWithUnit };
				cssVars.input_height       = { 'callback': _.fusionGetValueWithUnit };
				cssVars.border_radius      = { 'callback': _.fusionGetValueWithUnit };
				cssVars.border_size_top    = { 'callback': _.fusionGetValueWithUnit };
				cssVars.border_size_right  = { 'callback': _.fusionGetValueWithUnit };
				cssVars.border_size_bottom = { 'callback': _.fusionGetValueWithUnit };
				cssVars.border_size_left   = { 'callback': _.fusionGetValueWithUnit };
				cssVars.live_results_height   = { 'callback': _.fusionGetValueWithUnit };
				cssVars.results_border_top    = { 'callback': _.fusionGetValueWithUnit };
				cssVars.results_border_right  = { 'callback': _.fusionGetValueWithUnit };
				cssVars.results_border_bottom = { 'callback': _.fusionGetValueWithUnit };
				cssVars.results_border_left   = { 'callback': _.fusionGetValueWithUnit };

				attr.style = this.getCssVarsForOptions( cssVars );

				attr[ 'class' ] += _.fusionGetStickyClass( values.sticky_display );

				if ( values[ 'class' ] ) {
					attr[ 'class' ] += ' ' + values[ 'class' ];
				}

				if ( 'string' === typeof values.design ) {
					attr[ 'class' ] += ' fusion-search-form-' + values.design;
				}

				attr.id = values.id;

				attr = _.fusionAnimations( values, attr );
				return attr;
			}

		} );
	} );
}( jQuery ) );
