var FusionPageBuilder = FusionPageBuilder || {};

( function() {

	jQuery( document ).ready( function() {

		// Image Hotspots View.
		FusionPageBuilder.fusion_image_hotspots = FusionPageBuilder.ParentElementView.extend( {

			/**
			 * Modify template attributes.
			 *
			 * @since 3.5
			 * @param {Object} atts - The attributes.
			 * @return {Object}
			 */
			filterTemplateAtts: function( atts ) {
				var attributes = {};

				attributes.hotspotImage = this.getImageHtml( atts.values );
				attributes.cid          = this.model.get( 'cid' );
				attributes.elementAttr  = this.elementAttr( atts.values );

				return attributes;
			},

			/**
			 * Create the image element.
			 *
			 * @since 3.5
			 * @param {Object} values - The options.
			 * @return {Object}
			 */
			getImageHtml: function( values ) {
				var imgAttr = '',
				imageData;

				if ( ! values.image ) {
					return '';
				}

				if ( _.FusionIsValidJSON( values.image ) ) {
					imageData = this.getLogoImage( values.image );
					values.image = imageData.url;
				}

				// There is no width/height/alt/title attributes like in php file.

				imgAttr = 'src="' + values.image + '"';

				imgAttr += ' class="awb-image-hotspots-image"';

				return '<img ' + imgAttr + '/>';
			},

			/**
			 * Create the element attributes.
			 *
			 * @since 3.5
			 * @param {Object} values - The options.
			 * @return {Object}
			 */
			elementAttr: function( values ) {
				var atts = {
					'style': this.getInlineStyle( values ),
					'class': 'awb-image-hotspots'
				},
				alignmentLarge,
				alignmentMedium,
				alignmentSmall;

				atts[ 'class' ] += ' ' + this.getBaseClass();

				atts = _.fusionVisibilityAtts( values.hide_on_mobile, atts );

				if ( values[ 'class' ] ) {
					atts[ 'class' ] += ' ' + values[ 'class' ];
				}

				if ( values.id ) {
					atts.id = values.id;
				}

				atts = _.fusionAnimations( values, atts );

				alignmentLarge = values.alignment;
				alignmentMedium = ! _.isEmpty( values.alignment_medium ) ? values.alignment_medium : false;
				if ( alignmentMedium && alignmentLarge !== alignmentMedium ) {
					atts[ 'class' ] += ' md-flex-align-' + alignmentMedium;
				}

				alignmentSmall = ! _.isEmpty( values.alignment_small ) ? values.alignment_small : false;
				if ( alignmentSmall && alignmentLarge !== alignmentSmall ) {
					atts[ 'class' ] += ' sm-flex-align-' + alignmentSmall;
				}

				return atts;
			},

			/**
			 * Get inline style.
			 *
			 * @since 3.9
			 * @param {Object} values
			 * @return string
			 */
			getInlineStyle: function( values ) {
				var cssVarsOptions = {};

				this.values = values;

				cssVarsOptions = [
					'image_max_width',
					'alignment',
					'popover_heading_background_color',
					'popover_content_background_color',
					'popover_text_color',
					'popover_border_color',
					'margin_top',
					'margin_right',
					'margin_bottom',
					'margin_left'
				];

				return this.getCssVarsForOptions( cssVarsOptions );
			},

			/**
			 * Get the class name with an unique id among elements.
			 *
			 * @since 3.5
			 * @return {string}
			 */
			getBaseClass: function() {
				return 'awb-image-hotspots-' + this.model.get( 'cid' );
			},

			/**
			 * Get the logo src.
			 *
			 * @since 3.5
			 * @param {string} logo_json
			 * @return {string}
			 */
			getLogoImage: function( logo_json ) {
				var data           = {
					'id': '',
					'url': '',
					'srcset': ''
				},
				i,
				keys_to_verify = [ 'default', 'sticky', 'mobile' ],
				is_url,
				is_retina_url,
				key;

				logo_json = JSON.parse( logo_json );

				for ( i = 0; 3 > i; i++ ) {
					key = keys_to_verify[ i ];
					if ( ! logo_json || ! logo_json[ key ] || ! logo_json[ key ].normal ) {
						continue; // eslint-disable-line no-continue
					}

					is_url        = ( ! _.isEmpty( logo_json[ key ].normal.url ) && ! _.isEmpty( logo_json[ key ].normal.id ) );
					is_retina_url = ( ! _.isEmpty( logo_json[ key ].retina.url ) && ! _.isEmpty( logo_json[ key ].retina.id ) );

					if ( is_url ) {
						data.url    = logo_json[ key ].normal.url;
						data.id     = logo_json[ key ].normal.id;
						data.srcset = data.url + ' 1x';
						if ( is_retina_url ) {
							data.srcset += ', ' + logo_json[ key ].retina.url + ' 2x';
						}
						return data;
					}
					if ( is_retina_url ) {
						data.url    = logo_json[ key ].retina.url;
						data.id     = logo_json[ key ].retina.id;
						data.srcset = data.url + ' 1x';
						return data;
					}
				}

				return data;
			},

			/**
			 * Run after the element has been patched.
			 *
			 * @since 3.5
			 * @return {void}
			 */
			afterPatch: function() {
				var popover = '';

				// Call the parent afterPatch.
				FusionPageBuilder.ParentElementView.prototype.afterPatch.bind( this )();

				popover = jQuery( '#fb-preview' )[ 0 ].contentWindow.jQuery( this.el ).find( '[data-awb-toggle-image-hotspot-popover="true"]' );

				popover.popover( 'destroy' );
				popover.popover();
			}

		} );
	} );
}( jQuery ) );
