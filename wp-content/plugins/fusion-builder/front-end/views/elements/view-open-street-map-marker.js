/* global fusionAllElements, FusionPageBuilderElements, FusionPageBuilderApp, FusionPageBuilderViewManager, FusionEvents, FusionApp */
var FusionPageBuilder = FusionPageBuilder || {};

( function() {

	jQuery( document ).ready( function() {

		// Toggle child View
		FusionPageBuilder.fusion_openstreetmap_marker = FusionPageBuilder.ChildElementView.extend( {

			isSettingsOpen: false,

			/**
			 * Modify template attributes.
			 *
			 * @since 3.10
			 * @param {Object} atts - The attributes.
			 * @return {Object}
			 */
			filterTemplateAtts: function( atts ) {

				var attributes  = {},
					parent      = this.model.get( 'parent' ),
					parentModel = FusionPageBuilderElements.find( function( model ) {
						return model.get( 'cid' ) == parent;
					} ),
markerContent = '';

				this.parentValues = jQuery.extend( true, {}, fusionAllElements.fusion_openstreetmap.defaults, _.fusionCleanParameters( parentModel.get( 'params' ) ) );
				this.values = atts.values;

				attributes.cid             = this.model.get( 'cid' );
				attributes.icon            = atts.values.icon;
				attributes.iconAttr        = this.childElemIconAttr( atts.values );
				attributes.childInlineStyle = this.getChildInlineStyle();
				attributes.values = atts.values;
				attributes.animationClass = this.animationToClassName( this.parentValues.items_animation );
				markerContent = atts.values.tooltip_content;

				try {
					if ( markerContent && '' !== markerContent && FusionPageBuilderApp.base64Encode( FusionPageBuilderApp.base64Decode( markerContent ) ) === markerContent ) {
						markerContent = FusionPageBuilderApp.base64Decode( markerContent );
					}
				} catch ( error ) {
					console.log( error ); // jshint ignore:line
				}

				attributes.markerContent = markerContent;

				this.childElemAttr( atts.values );

				return attributes;
			},

			/**
			 * OnRender callback.
			 *
			 * @since 3.10
			 * @return {void}
			 */
			onRender: function() {
				const self = this;
				this.listenTo( FusionEvents, 'fusion-element-removed', function( cid ) {
					if ( cid !== self.model.get( 'cid' ) && ( 'undefined' === typeof self.model.parentView || ! self.model.parentView ) ) {
						return;
					}
					const parentView = FusionPageBuilderViewManager.getView( self.model.get( 'parent' ) );

					if ( 'undefined' !== typeof parentView ) {
						parentView.updateMarkers();
					}
				} );
			},

			/**
			 * Create the child element attributes.
			 *
			 * @since 3.10
			 * @param {Object} values - The options.
			 * @return {Object}
			 */
			childElemAttr: function( values ) {
				const action = '' === values.action ? this.parentValues.action : values.action;
				this.$el.addClass( 'awb-openstreet-map-marker' );
				this.$el.addClass( 'awb-openstreet-map-marker-' + this.model.get( 'cid' ) );

				// Remove the attributes, because this element is not totally replaced.
				this.$el.removeAttr( 'data-latitude' );
				this.$el.removeAttr( 'data-longitude' );
				this.$el.removeAttr( 'data-icon' );
				this.$el.removeAttr( 'data-action' );

				this.$el.attr( 'data-latitude', values.latitude );
				this.$el.attr( 'data-longitude', values.longitude );
				this.$el.attr( 'data-icon', _.fusionFontAwesome( values.icon ) );
				this.$el.attr( 'data-action', action );

			},

			/**
			 * Create the child inline css vars.
			 *
			 * @since 3.10
			 * @return {string}
			 */
			getChildInlineStyle: function() {
				var cssVarsOptions;

				cssVarsOptions = [
					'color',
					'background_color',
					'hover_color',
					'hover_background_color'
				];
				cssVarsOptions.size = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.border_radius_top_left = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.border_radius_top_right = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.border_radius_bottom_right = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.border_radius_bottom_left = { 'callback': _.fusionGetValueWithUnit };

				return this.getCssVarsForOptions( cssVarsOptions );
			},

			/**
			 * Create the child icon element attributes.
			 *
			 * @since 3.10
			 * @param {Object} values - The options.
			 * @return {Object}
			 */
			childElemIconAttr: function( values ) {
				var atts = {
						'class': _.fusionFontAwesome( values.icon )
					};

				return atts;
			},

			/**
			 * Get the animation class corresponding with the animation id.
			 *
			 * @since 3.10
			 * @param {string} animationName - The animation name.
			 * @return {string} - Empty string if do not exist.
			 */
			animationToClassName: function( animationName ) {
				if ( 'pumping' === animationName ) {
					return 'awb-openstreet-map-marker-anim-pumping';
				}

				if ( 'pulsating' === animationName ) {
					return 'awb-openstreet-map-marker-anim-pulsating';
				}

				if ( 'showing' === animationName ) {
					return 'awb-openstreet-map-marker-anim-showing';
				}

				if ( 'sonar' === animationName ) {
					return 'awb-openstreet-map-marker-anim-sonar';
				}

				if ( 'pumping_showing' === animationName ) {
					return 'awb-openstreet-map-marker-anim-pump-showing';
				}

				return '';
			},

			/**
			 * Run on settings open.
			 *
			 * @since 3.10
			 * @return {void}
			 */
			onSettingsOpen: function() {
				this.isSettingsOpen = true;
				const parentView = FusionPageBuilderViewManager.getView( this.model.get( 'parent' ) );
				parentView.$el.addClass( 'fusion-osm-marker-editing' );
				setTimeout( this.dragMarkerOn.bind( this ), 100 );
			},

			/**
			 * Run on settings close.
			 *
			 * @since 3.10
			 * @return {void}
			 */
			onSettingsClose: function() {
				var $el = this.$el;
				this.isSettingsOpen = false;

				if ( ! $el ) {
					return;
				}

				const parentView = FusionPageBuilderViewManager.getView( this.model.get( 'parent' ) );
				parentView.$el.removeClass( 'fusion-osm-marker-editing' );

				this.dragMarkerOff();
			},

			/**
			 * Enable drag marker.
			 *
			 * @since 3.10
			 * @return {void}
			 */
			dragMarkerOn: function() {
				if ( ! FusionApp.previewWindow.fusion_open_street_map[ this.model.get( 'parent' ) ] ) {
					return;
				}

				const markers = FusionApp.previewWindow.fusion_open_street_map[ this.model.get( 'parent' ) ][ this.model.get( 'cid' ) ];

				if ( markers ) {
					markers.forEach( function( marker ) {
						if ( marker ) {
							marker.dragging.enable();
							marker.on( 'dragend', function() {
								jQuery( '#latitude' ).val( marker.getLatLng().lat ).trigger( 'change' );
								jQuery( '#longitude' ).val( marker.getLatLng().lng ).trigger( 'change' );
							} );
						}
					} );
				}
			},

			/**
			 * Disable drag marker.
			 *
			 * @since 3.10
			 * @return {void}
			 */
			dragMarkerOff: function() {
				if ( ! FusionApp.previewWindow.fusion_open_street_map[ this.model.get( 'parent' ) ] ) {
					return;
				}

				const markers = FusionApp.previewWindow.fusion_open_street_map[ this.model.get( 'parent' ) ][ this.model.get( 'cid' ) ];

				if ( markers ) {
					markers.forEach( function( marker ) {
						if ( marker ) {
							marker.dragging.disable();
						}
					} );
				}
			},

			/**
			 * Run after the element has been patched.
			 *
			 * @since 3.10
			 * @return {void}
			 */
			afterPatch: function() {
				jQuery( '#fb-preview' )[ 0 ].contentWindow.jQuery( this.$el.closest( '.awb-openstreet-map' ) )
				.trigger( 'awb_openstreetmap/updateMarker' )
				.trigger( 'awb_openstreetmap/updateCoords' );

				if ( this.isSettingsOpen ) {
					setTimeout( this.dragMarkerOn.bind( this ), 100 );
				}
			}
		} );
	} );
}( jQuery ) );
