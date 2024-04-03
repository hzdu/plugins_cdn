var FusionPageBuilder = FusionPageBuilder || {};

( function() {

	jQuery( document ).ready( function() {

		// Scroll Progress Element View.
		FusionPageBuilder.fusion_scroll_progress = FusionPageBuilder.ElementView.extend( {

			/**
			 * Modify template attributes.
			 *
			 * @since 3.3
			 * @return {Object}
			 */
			filterTemplateAtts: function( atts ) {
				var attributes = {};

				// Validate values.
				this.validateValues( atts.values );

				this.values = atts.values;
				this.params = this.model.get( 'params' );
				this.extras = atts.extras;

				// Any extras that need passed on.
				attributes.cid         = this.model.get( 'cid' );
				attributes.wrapperAttr = this.buildAttr( atts.values );
				attributes.position    = atts.values.position;
				attributes.label       = window.fusionAllElements[ this.model.get( 'element_type' ) ].name;
				attributes.icon        = window.fusionAllElements[ this.model.get( 'element_type' ) ].icon;

				return attributes;
			},


			/**
			 * Modify values.
			 *
			 * @since 3.3
			 * @param {Object} values - The values.
			 * @return {void}
			 */
			validateValues: function( values ) {
				var borderRadius = values.border_radius_top_left + ' ' + values.border_radius_top_right + ' ' + values.border_radius_bottom_right + ' ' + values.border_radius_bottom_left;

				values.border_radius = ( '0px 0px 0px 0px' === borderRadius ) ? '' : borderRadius;
			},

			/**
			 * Builds attributes.
			 *
			 * @since 3.3
			 * @param {Object} values - The values object.
			 * @return {Object}
			 */
			buildAttr: function( values ) {
				var attr = _.fusionVisibilityAtts( values.hide_on_mobile, {
					class: 'fusion-scroll-progress fusion-scroll-progress-' + this.model.get( 'cid' ),
					max: '100',
					value: ''
				} );

				if ( 'flow' !== values.position ) {
					attr[ 'class' ] += ' fusion-fixed-' + values.position;
				}

				attr.style = this.getStyleVariables();

				if ( '' !== values[ 'class' ] ) {
					attr[ 'class' ] += ' ' + values[ 'class' ];
				}

				if ( '' !== values.id ) {
					attr.id = values.id;
				}

				return attr;
			},

			/**
			 * Gets style variables.
			 *
			 * @since 3.9
			 * @return {String}
			 */
			getStyleVariables: function() {
				var cssVarsOptions = [
					'background_color',
					'progress_color',
					'z_index',
					'border_radius',
					'border_color'
				];

				cssVarsOptions.height      = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.border_size = { 'callback': _.fusionGetValueWithUnit };

				return this.getCssVarsForOptions( cssVarsOptions );
			}
		} );
	} );
}( jQuery ) );
