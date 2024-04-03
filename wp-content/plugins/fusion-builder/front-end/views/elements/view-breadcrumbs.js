/* global FusionApp */
var FusionPageBuilder = FusionPageBuilder || {};

( function() {

	jQuery( document ).ready( function() {

		// Breadcrumbs view.
		FusionPageBuilder.fusion_breadcrumbs = FusionPageBuilder.ElementView.extend( {

			/**
			 * Modify template attributes.
			 *
			 * @since 2.2
			 * @param {Object} atts - The attributes.
			 * @return {Object}
			 */
			filterTemplateAtts: function( atts ) {
				var attributes = {};

				// Validate values.
				this.validateValues( atts.values );
				this.values = atts.values;

				attributes.wrapperAttr = this.buildAttr( atts.values );
				attributes.output      = this.buildOutput( atts );

				// Any extras that need passed on.
				attributes.cid = this.model.get( 'cid' );

				return attributes;
			},

			/**
			 * Modifies the values.
			 *
			 * @since  2.2
			 * @param  {Object} values - The values object.
			 * @return {void}
			 */
			validateValues: function( values ) {
				values.font_size = _.fusionValidateAttrValue( values.font_size, 'px' );
			},

			/**
			 * Builds output.
			 *
			 * @since  2.2
			 * @param  {Object} values - The values object.
			 * @return {String}
			 */
			buildOutput: function( atts ) {
				var output = '';

				if ( 'undefined' !== typeof atts.markup && 'undefined' !== typeof atts.markup.output && 'undefined' === typeof atts.query_data ) {
					output = jQuery( jQuery.parseHTML( atts.markup.output ) ).filter( '.fusion-breadcrumbs' ).html();
					output = ( 'undefined' === typeof output ) ? atts.markup.output : output;
				} else if ( 'undefined' !== typeof atts.query_data && 'undefined' !== typeof atts.query_data.breadcrumbs ) {
					output = atts.query_data.breadcrumbs;
				}

				if ( ( FusionApp.data.is_home || FusionApp.data.is_front_page ) && 1 < jQuery( jQuery.parseHTML( output ) ).filter( '.fusion-breadcrumb-item' ).length ) {
					output = jQuery( jQuery.parseHTML( output ) ).filter( '.fusion-breadcrumb-item' ).eq( 1 ).remove().html();
				}

				return output;
			},

			/**
			 * Builds attributes.
			 *
			 * @since  2.2
			 * @param  {Object} values - The values object.
			 * @return {Object}
			 */
			buildAttr: function( values ) {
				var cssVars = [
						'margin_top',
						'margin_right',
						'margin_bottom',
						'margin_left',
						'alignment',
						'font_size',
						'text_hover_color',
						'text_color'
					],
					attr         = _.fusionVisibilityAtts( values.hide_on_mobile, {
						class: 'fusion-breadcrumbs fusion-live-breadcrumbs fusion-breadcrumbs-' + this.model.get( 'cid' ),
						style: this.getCssVarsForOptions( cssVars )
					} );

				attr[ 'class' ] += _.fusionGetStickyClass( values.sticky_display );

				attr.style += '--awb-breadcrumb-sep:\'' + values.separator + '\';';

				attr[ 'aria-label' ] = 'Breadcrumb';

				if ( '' !== values[ 'class' ] ) {
					attr[ 'class' ] += ' ' + values[ 'class' ];
				}

				if ( '' !== values.id ) {
					attr.id = values.id;
				}

				attr = _.fusionAnimations( values, attr );

				return attr;
			}

		} );
	} );
}( jQuery ) );
