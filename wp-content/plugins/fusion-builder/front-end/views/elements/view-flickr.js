/* globals FusionApp */
var FusionPageBuilder = FusionPageBuilder || {};

( function() {

	jQuery( document ).ready( function() {
		// Fusion flickr.
		FusionPageBuilder.fusion_flickr = FusionPageBuilder.FormComponentView.extend( {

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

				// Create attribute objects
				attributes.atts   = this.buildAttr( atts.values );

				// Any extras that need passed on.
				attributes.cid    = this.model.get( 'cid' );
				attributes.values = atts.values;

				attributes.flickrItems  = FusionApp.previewWindow.fusionFlickrItems;
				return attributes;
			},

			/**
			 * Builds attributes.
			 *
			 * @since 2.0
			 * @param {Object} values - The values object.
			 * @return {Object}
			 */
			buildAttr: function( values ) {
				var attr = {};
				attr[ 'class' ] = 'fusion-flickr-element flickr-' + this.model.get( 'cid' ) + ' ' + values[ 'class' ];

				attr  = _.fusionVisibilityAtts( values.hide_on_mobile, attr );


				if ( '' !== values.id ) {
					attr.id = values.id;
				}

				if ( '' !== values.hover_type ) {
					attr[ 'class' ] += ' hover-' + values.hover_type;
				}

				attr.style = '';

				if ( '' !== values.flickr_id ) {
					attr[ 'data-id' ] = values.flickr_id;
				}
				if ( '' !== values.type ) {
					attr[ 'data-type' ] = values.type;
				}
				if ( '' !== values.album_id ) {
					attr[ 'data-album_id' ] = values.album_id;
				}
				if ( '' !== values.count ) {
					attr[ 'data-count' ] = values.count;
				}
				if ( '' !== values.api_key ) {
					attr[ 'data-api_key' ] = values.api_key;
				}
				if ( '' !== values.link_type ) {
					attr[ 'data-link_type' ] = values.link_type;
				}
				if ( 'page' === values.link_type && '_blank' === values.link_target ) {
					attr[ 'data-link_target' ] = values.link_target;
				}

				attr.style += this.buildAspectRatioStyles( values );
				attr.style += this.buildColumnStyles( values );

				attr.style += this.getStyleVariables();

				//Animation
				attr = _.fusionAnimations( values, attr );

				return attr;
			},


			/**
			 * Gets style variables.
			 *
			 * @since 3.9
			 * @return {String}
			 */
			getStyleVariables: function() {
				const cssVarsOptions = [];

				cssVarsOptions.margin_top    = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.margin_right  = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.margin_bottom = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.margin_left   = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.margin_top_medium    = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.margin_right_medium  = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.margin_bottom_medium = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.margin_left_medium   = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.margin_top_small    = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.margin_right_small  = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.margin_bottom_small = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.margin_left_small   = { 'callback': _.fusionGetValueWithUnit };

				return this.getCssVarsForOptions( cssVarsOptions );
			},

			/**
			 * Builds column styles.
			 *
			 * @since 3.5
			 * @param {Object} values - The values object.
			 * @return {string}
			 */
			buildColumnStyles: function( values ) {
				var styles = '';

				_.each( [ 'large', 'medium', 'small' ], function( size ) {
					var columns 		= ( 'large' === size ) ?  values.columns :  values[ 'columns_' + size ],
						columns_spacing = ( 'large' === size ) ?  values.columns_spacing :  values[ 'columns_spacing_' + size ],
						device_abbr = '';

					if ( 'small' === size ) {
						device_abbr = 'sm-';
					}

					if ( 'medium' === size ) {
						device_abbr = 'md-';
					}

					if ( '' !== columns ) {
						styles += '--awb-' + device_abbr + 'column-width:' + ( 100 / parseInt( columns ) ) + '%;';
					}

					if ( '' !== columns_spacing ) {
						styles += '--awb-' + device_abbr + 'column-space:' + columns_spacing + ';';
					}

				} );

				return styles;
			},

			/**
			 * Builds aspect ratio styles.
			 *
			 * @since 3.8
			 * @param {Object} atts - The atts object.
			 * @return {string}
			 */
			buildAspectRatioStyles: function( values ) {
				var style = '',
					aspectRatio,
					width,
					height;

				if ( '' ===  values.aspect_ratio ) {
					return '';
				}

				// Calc Ratio
				if ( 'custom' ===  values.aspect_ratio && '' !==  values.custom_aspect_ratio ) {
					style += '--awb-aspect-ratio: 100 / ' + values.custom_aspect_ratio + '%;';
				} else {
					aspectRatio = values.aspect_ratio.split( '-' );
					width 		= aspectRatio[ 0 ] || '';
					height 		= aspectRatio[ 1 ] || '';
					style += `--awb-aspect-ratio: ${width / height};`;
				}

				//Ratio Position
				if ( '' !== values.aspect_ratio_position ) {
					style += '--awb-object-position:' + values.aspect_ratio_position + ';';
				}

				return style;
			},

			/**
			 * Things to do, places to go when options change.
			 *
			 * @since 2.0.0
			 * @param {string} paramName - The name of the parameter that changed.
			 * @param {mixed}  paramValue - The value of the option that changed.
			 * @param {Object} event - The event triggering the option change.
			 * @return {void}
			 */
			onOptionChange: function( paramName ) {
				if ( 'flickr_id' === paramName || 'count' === paramName ) {
					FusionApp.previewWindow.fusionFlickrItems = '';
				}
			}
		} );
	} );
}( jQuery ) );
