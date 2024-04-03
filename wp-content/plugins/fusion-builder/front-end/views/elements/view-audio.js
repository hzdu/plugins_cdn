var FusionPageBuilder = FusionPageBuilder || {};

( function() {

	jQuery( document ).ready( function() {

		FusionPageBuilder.fusion_audio = FusionPageBuilder.ElementView.extend( {

			/**
			 * Modify template attributes.
			 *
			 * @since 2.1
			 * @param {Object} atts - The attributes object.
			 * @return {Object}
			 */
			filterTemplateAtts: function( atts ) {
				var attributes = {};

				// Validate values.
				this.validateValues( atts.values );

				this.values = atts.values;

				// Create attribute objects
				attributes.attr = this.buildAttr( atts.values );

				// Any extras that need passed on.
				attributes.cid    = this.model.get( 'cid' );
				attributes.values = atts.values;

				return attributes;
			},

			/**
			 * Modify values.
			 *
			 * @since 2.1
			 * @param {Object} values - The values.
			 * @return {void}
			 */
			validateValues: function( values ) {
				var corners = [
					'top_left',
					'top_right',
					'bottom_right',
					'bottom_left'
				];

				_.each( corners, function( corner ) {
					if ( 'undefined' !== typeof values[ 'border_radius_' + corner ] && '' !== values[ 'border_radius_' + corner ] ) {
						values[ 'border_radius_' + corner ] = _.fusionGetValueWithUnit( values[ 'border_radius_' + corner ] );
					} else {
						values[ 'border_radius_' + corner ] = '0px';
					}
				} );

				values.margin_bottom = _.fusionValidateAttrValue( values.margin_bottom, 'px' );
				values.margin_left   = _.fusionValidateAttrValue( values.margin_left, 'px' );
				values.margin_right  = _.fusionValidateAttrValue( values.margin_right, 'px' );
				values.margin_top    = _.fusionValidateAttrValue( values.margin_top, 'px' );
			},

			/**
			 * Builds attributes.
			 *
			 * @since 2.1
			 * @param {Object} values - The values object.
			 * @return {Object}
			 */
			buildAttr: function( values ) {
				var attr = _.fusionVisibilityAtts( values.hide_on_mobile, {
					class: 'fusion-audio',
					style: ''
				} );

				if ( 'dark' === values.controls_color_scheme ) {
					attr[ 'class' ] += ' dark-controls';
				}

				if ( '' !== values[ 'class' ] ) {
					attr[ 'class' ] += ' ' + values[ 'class' ];
				}

				if ( '' !== values.id ) {
					attr.id = values.id;
				}

				attr = _.fusionAnimations( values, attr );

				attr.values = values;

				attr.style += this.getStyleVariables( values );

				return attr;
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
					corners    = [
						'top_left',
						'top_right',
						'bottom_right',
						'bottom_left'
					],
					cssVarsOptions;

				_.each( corners, function( corner ) {
					if ( values[ 'border_radius_' + corner ] ) {
						customVars[ 'border-' + corner.replace( '_', '-' ) + '-radius' ] = values[ 'border_radius_' + corner ];
					}
				} );

				// Box shadow.
				if ( 'yes' === values.box_shadow ) {
					customVars[ 'box-shadow' ] = _.fusionGetBoxShadowStyle( values );
				}

				cssVarsOptions = [
					'progress_color',
					'border_color',
					'background_color',
					'border_size'
				];

				cssVarsOptions.max_width     = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.margin_top    = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.margin_right  = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.margin_bottom = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.margin_left   = { 'callback': _.fusionGetValueWithUnit };

				return this.getCssVarsForOptions( cssVarsOptions ) + this.getCustomCssVars( customVars );
			}
		} );
	} );
}( jQuery ) );
