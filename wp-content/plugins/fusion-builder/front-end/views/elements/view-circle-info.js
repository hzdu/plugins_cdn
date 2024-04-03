/* global FusionPageBuilderViewManager */
var FusionPageBuilder = FusionPageBuilder || {};

( function() {

	jQuery( document ).ready( function() {

		// Circle info child View
		FusionPageBuilder.fusion_circle_info = FusionPageBuilder.ChildElementView.extend( {

			/**
			* Settings flag
			*/
			areSettingsOpen: false,

			/**
			 * Runs after view DOM is patched.
			 *
			 * @since 3.9
			 * @return {void}
			 */
			afterPatch: function() {
				jQuery( '#fb-preview' )[ 0 ].contentWindow.jQuery( 'body' ).trigger( 'fusion-element-render-fusion_circles_info', this.model.get( 'parent' ) );
			},

			/**
			 * When settings are opened.
			 *
			 * @since 3.9
			 * @return {void}
			 */
			onSettingsOpen: function() {
				var parentView = FusionPageBuilderViewManager.getView( this.model.get( 'parent' ) );

				if ( 'undefined' !== typeof parentView ) {
					parentView.$el.find( '.awb-circles-info' ).addClass( 'pause' );
					parentView.$el.find( '.awb-circles-info-tab-link[data-id="' + this.model.get( 'counter' ) + '"] span' ).trigger( 'click' );
					this.areSettingsOpen = true;
				}
			},

			/**
			 * When settings are closed.
			 *
			 * @since 3.9
			 * @return {void}
			 */
			onSettingsClose: function() {
				var parentView = FusionPageBuilderViewManager.getView( this.model.get( 'parent' ) );

				if ( 'undefined' !== typeof parentView ) {
					parentView.$el.find( '.awb-circles-info' ).removeClass( 'pause' );
					this.areSettingsOpen = false;
				}
			},

			/**
			 * Modify template attributes.
			 *
			 * @since 3.9
			 * @param {Object} atts - The attributes.
			 * @return {Object}
			 */
			filterTemplateAtts: function( atts ) {
				var attributes = {};

				this.values = atts.values;

				// Create attribute objects
				attributes.circleInfoAtts = this.buildAttr( atts );
				attributes.title          = this.buildTile( this.values );

				attributes.output = atts.values.item_content.replace( '<p>', '' ).replace( '</p>', '' );
				attributes.cid    = this.model.get( 'cid' );

				return attributes;
			},

			/**
			 * Runs during render() call.
			 *
			 * @since 3.9
			 * @return {void}
			 */
			onRender: function() {
				var parentView = FusionPageBuilderViewManager.getView( this.model.get( 'parent' ) );

				if ( 'undefined' !== typeof parentView && ! this.areSettingsOpen ) {
					parentView.reRender();
				}
			},

			/**
			 * Runs before element is removed.
			 *
			 * @since 3.9
			 * @return {void}
			 */
			beforeRemove: function() {
				var parentView = FusionPageBuilderViewManager.getView( this.model.get( 'parent' ) );

				if ( 'undefined' !== typeof parentView ) {
					setTimeout( function() {
						parentView.reRender();
					}, 100 );
				}
			},

			/**
			 * Builds attributes.
			 *
			 * @since 3.9
			 * @param {Object} values - The values object.
			 * @return {Object}
			 */
			buildAttr: function( atts ) {
				var attr = {
					class: 'awb-circle-info awb-circles-info-content-area awb-circle-info-' + this.model.get( 'cid' ),
					style: ''
				};
				const values = atts.values;

				if ( ! this.isDefault( 'background_color' ) ) {
					attr[ 'class' ] += ' has-bg-color';
				}

				if ( ! this.isDefault( 'gradient_start_color' ) && ! this.isDefault( 'gradient_end_color' ) ) {
					attr[ 'class' ] += ' has-bg-gradient';
					attr[ 'class' ] += ' gradient-type-' + values.gradient_type;
				}

				if ( ! this.isDefault( 'background_image' ) ) {
					attr[ 'class' ] += ' has-bg-image';
					attr[ 'class' ] += ' bg-image-blend-mode-' + values.background_blend_mode;
				}

				if ( '' !== values[ 'class' ] ) {
					attr[ 'class' ] += ' ' + values[ 'class' ];
				}

				if ( values.id ) {
					attr.id = values.id;
				}
				attr[ 'data-id' ] = this.model.get( 'counter' );

				attr.style += this.getStyleVariables( values );

				return attr;
			},

			/**
			 * Builds title.
			 *
			 * @since 3.9
			 * @param {Object} values - The values.
			 * @return {String}
			 */
			buildTile: function( values ) {
				return '' !== values.link ? '<a href="' + values.link + '">' + values.title + '</a>' : values.title;
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
					cssVarsOptions;

				// Title typography.
				jQuery.each( _.fusionGetFontStyle( 'title_font', values, 'object' ), function( rule, value ) {
						customVars[ 'title-' + rule ] = value;
				} );

				// Content typography.
				jQuery.each( _.fusionGetFontStyle( 'content_font', values, 'object' ), function( rule, value ) {
						customVars[ 'content-' + rule ] = value;
				} );

				if ( ! this.isDefault( 'radial_direction' ) ) {
					this.values.radial_direction = 'circle at ' + values.radial_direction;
				}

				if ( ! this.isDefault( 'background_image' ) ) {
					this.values.background_image = 'url(' + values.background_image + ')';
				}

				if ( ! this.isDefault( 'gradient_start_position' ) ) {
					this.values.gradient_start_position = values.gradient_start_position + '%';
				}

				if ( ! this.isDefault( 'gradient_end_position' ) ) {
					this.values.gradient_end_position = values.gradient_end_position + '%';
				}

				if ( ! this.isDefault( 'linear_angle' ) ) {
					this.values.linear_angle = values.linear_angle + 'deg';
				}

				cssVarsOptions = [
					'gradient_start_position',
					'gradient_end_position',
					'linear_angle',
					'background_position',
					'background_repeat',
					'background_blend_mode',
					'content_text_transform',
					'title_text_transform',
					'title_line_height',
					'title_color',
					'title_hover_color',
					'content_color',
					'background_color',
					'gradient_start_color',
					'gradient_end_color',
					'radial_direction',
					'background_image'
				];

				cssVarsOptions.title_font_size        = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.title_letter_spacing   = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.content_font_size      = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.content_line_height    = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.content_letter_spacing = { 'callback': _.fusionGetValueWithUnit };

				return this.getCssVarsForOptions( cssVarsOptions ) + this.getCustomCssVars( customVars );
			}
		} );
	} );
}( jQuery ) );
