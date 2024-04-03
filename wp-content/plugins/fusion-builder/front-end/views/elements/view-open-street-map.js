var FusionPageBuilder = FusionPageBuilder || {};

( function() {

	jQuery( document ).ready( function() {

		// OpenStreetMap View.
		FusionPageBuilder.fusion_openstreetmap = FusionPageBuilder.ParentElementView.extend( {

			/**
			 * Runs after view DOM is patched.
			 *
			 * @since 3.10
			 * @return {void}
			 */
			onRender: function() {
				this.afterPatch();
			},

			/**
			 * Modify template attributes.
			 *
			 * @since 3.10
			 * @param {Object} atts - The attributes.
			 * @return {Object}
			 */
			filterTemplateAtts: function( atts ) {
				var attributes = {};

				// Validate values.
				this.validateValues( atts.values );

				this.values = atts.values;

				attributes.cid          = this.model.get( 'cid' );
				attributes.elementAttr  = this.elementAttr( atts.values );

				return attributes;
			},

			/**
			 * Modifies the values.
			 *
			 * @since 3.10
			 * @param {Object} values - The values object.
			 * @return {void}
			 */
			validateValues: function( values ) {
				if ( 'undefined' === typeof values.shape_color ) {
					values.shape_color = values.parent.shape_color;
				}

				if ( 'undefined' === typeof values.shape_size ) {
					values.shape_size = values.parent.shape_size;
				}

				if ( 'undefined' === typeof values.map_style ) {
					values.map_style = values.parent.map_style;
				}
			},

			/**
			 * Create the element attributes.
			 *
			 * @since 3.10
			 * @param {Object} values - The options.
			 * @return {Object}
			 */
			elementAttr: function( values ) {
				var atts = {
					'style': this.getInlineStyle( values ),
					'class': 'awb-openstreet-map fusion-child-element'
				};

				atts[ 'class' ] += ' ' + this.getBaseClass();

				atts = _.fusionVisibilityAtts( values.hide_on_mobile, atts );

				if ( values[ 'class' ] ) {
					atts[ 'class' ] += ' ' + values[ 'class' ];
				}

				if ( values.id ) {
					atts.id = values.id;
				}

				atts = _.fusionAnimations( values, atts );

				atts[ 'data-map-style' ]       = values.map_style;
				atts[ 'data-map-type' ]        = values.map_type;
				atts[ 'data-zoom' ]            = values.zoom;
				atts[ 'data-zoomsnap' ]        = values.zoom_snap;
				atts[ 'data-zoomcontrol' ]     = 'yes' === values.zoom_control ? '1' : '';
				atts[ 'data-scrollwheelzoom' ] = 'yes' === values.scrollwheel ? '1' : '';
				atts[ 'data-dragging' ]        = 'yes' === values.dragging ? '1' : '';
				atts[ 'data-touchzoom' ]       = 'yes' === values.touchzoom ? '1' : '';
				atts[ 'data-dbclickzoom' ]     = 'yes' === values.dbclickzoom ? '1' : '';
				atts[ 'data-fitbounds' ]       = 'yes' === values.fitbounds ? '1' : '';
				atts[ 'data-shape-color' ]     = window.awbPalette.getRealColor( values.shape_color );
				atts[ 'data-shape-weight' ]    = values.shape_size;

				return atts;
			},

			/**
			 * Get inline style.
			 *
			 * @since 3.10
			 * @param {Object} values
			 * @return string
			 */
			getInlineStyle: function( values ) {
				var cssVarsOptions = {};

				cssVarsOptions = [
					'popup_background_color',
					'popup_close_btn_color',
					'popup_title_line_height',
					'popup_title_text_transform',
					'popup_title_color',
					'popup_title_alignment',
					'popup_content_line_height',
					'popup_content_text_transform',
					'popup_content_color',
					'popup_content_alignment'
				];

				cssVarsOptions.width = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.height = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.margin_top = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.margin_right = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.margin_bottom = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.margin_left = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.popup_title_font_size = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.popup_title_letter_spacing = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.popup_title_margin_top = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.popup_title_margin_bottom = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.popup_content_font_size = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.popup_content_letter_spacing = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.popup_padding_top = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.popup_padding_right = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.popup_padding_bottom = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.popup_padding_left = { 'callback': _.fusionGetValueWithUnit };

				return this.getCssVarsForOptions( cssVarsOptions ) + this.getFontStylingVars( 'popup_title_font', values ) + this.getFontStylingVars( 'popup_content_font', values );
			},

			/**
			 * Get the class name with an unique id among elements.
			 *
			 * @since 3.10
			 * @return {string}
			 */
			getBaseClass: function() {
				return 'awb-openstreet-map-' + this.model.get( 'cid' );
			},

			/**
			 * Run after the element has been patched.
			 *
			 * @since 3.10
			 * @return {void}
			 */
			afterPatch: function() {
				// Call the parent afterPatch.
				FusionPageBuilder.ParentElementView.prototype.afterPatch.bind( this )();

				this._refreshJs();
			},

			/**
			 * Trigger update markers point.
			 *
			 * @since 3.10
			 * @return {void}
			 */
			updateMarkers: function() {
				const self = this;
				setTimeout( function() {
					jQuery( '#fb-preview' )[ 0 ].contentWindow.jQuery( self.$el.find( '.awb-openstreet-map' ) )
					.trigger( 'awb_openstreetmap/updateMarker' )
					.trigger( 'awb_openstreetmap/updateCoords' );
				}, 300 );
			}

		} );
	} );
}( jQuery ) );
