var FusionPageBuilder = FusionPageBuilder || {};

( function() {

	jQuery( document ).ready( function() {

		// Content Boxes Parent View.
		FusionPageBuilder.fusion_content_boxes = FusionPageBuilder.ParentElementView.extend( {

			/**
			 * Image map of child element images and thumbs.
			 *
			 * @since 2.0
			 */
			imageMap: {},

			/**
			 * Initial data has run.
			 *
			 * @since 2.0
			 */
			initialData: false,

			/**
			 * Runs after view DOM is patched.
			 *
			 * @since 2.0
			 * @return {void}
			 */
			afterPatch: function() {
				this.generateChildElements();
				this._refreshJs();

				this.initListeners();
			},

			/**
			 * Runs after view DOM is loaded for first time.
			 *
			 * @since 2.0
			 * @return {void}
			 */
			onRender: function() {
				this.initListeners();
			},

			/**
			 * Add mouse listeners for effects.
			 *
			 * @since 3.9
			 * @return {void}
			 */
			initListeners: function() {
				this.$el.find( '.link-area-link-icon .fusion-read-more-button, .link-area-link-icon .fusion-read-more, .link-area-link-icon .heading' ).off( 'mouseenter.awb' ).on( 'mouseenter.awb', function() {
					jQuery( this ).parents( '.link-area-link-icon' ).addClass( 'link-area-link-icon-hover' );
				} );
				this.$el.find( '.link-area-link-icon .fusion-read-more-button, .link-area-link-icon .fusion-read-more, .link-area-link-icon .heading' ).off( 'mouseleave.awb' ).on( 'mouseleave.awb', function() {
					jQuery( this ).parents( '.link-area-link-icon' ).removeClass( 'link-area-link-icon-hover' );
				} );

				this.$el.find( '.link-area-box' ).off( 'mouseenter.awb' ).on( 'mouseenter.awb', function() {
					jQuery( this ).addClass( 'link-area-box-hover' );
				} );
				this.$el.find( '.link-area-box' ).off( 'mouseleave.awb' ).on( 'mouseleave.awb', function() {
					jQuery( this ).removeClass( 'link-area-box-hover' );
				} );
			},

			/**
			 * Modify template attributes.
			 *
			 * @since 2.0
			 * @param {Object} atts - The attributes.
			 * @return {Object}
			 */
			filterTemplateAtts: function( atts ) {
				var attributes = {};

				// Validate values.
				this.validateValues( atts.values );

				// Create attribute objects.
				attributes.attr   = this.buildAttr( atts.values );

				return attributes;
			},

			/**
			 * Modify values.
			 *
			 * @since 2.0
			 * @param {Object} values - The values.
			 * @return {void}
			 */
			validateValues: function( values ) {

				// Backwards compatibility for when we had image width and height params.
				if ( 'undefined' !== typeof values.image_width ) {
					values.image_width = values.image_width ? values.image_width : '35';
				} else {
					values.image_width = values.image_max_width;
				}

				values.title_size            = _.fusionValidateAttrValue( values.title_size, 'px', false );
				values.icon_circle_radius    = _.fusionValidateAttrValue( values.icon_circle_radius, 'px' );
				values.icon_size             = _.fusionValidateAttrValue( values.icon_size, 'px' );
				values.margin_top            = _.fusionValidateAttrValue( values.margin_top, 'px' );
				values.margin_bottom         = _.fusionValidateAttrValue( values.margin_bottom, 'px' );
				values.margin_bottom         = _.fusionValidateAttrValue( values.margin_bottom, 'px' );
				values.circlebordersize      = _.fusionValidateAttrValue( values.circlebordersize, 'px' );
				values.outercirclebordersize = _.fusionValidateAttrValue( values.outercirclebordersize, 'px' );

				if ( values.linktarget ) {
					values.link_target = values.linktarget;
				}

				if ( 'timeline-vertical' === values.layout ) {
					values.columns = 1;
				}

				if ( 'timeline-vertical' === values.layout || 'timeline-horizontal' === values.layout ) {
					values.animation_delay     = 350;
					values.animation_speed     = 0.25;
					values.animation_type      = 'fade';
					values.animation_direction = '';
				}

				if ( 5 >= values.animation_delay ) {
					values.animation_delay = values.animation_delay * 1000;
				}
			},

			/**
			 * Builds attributes.
			 *
			 * @since 2.0
			 * @param {Object} values - The values.
			 * @return {Object}
			 */
			buildAttr: function( values ) {
				var attr              = _.fusionVisibilityAtts( values.hide_on_mobile, {
						class: 'fusion-content-boxes content-boxes',
						style: this.getParentCssVars( values )
					} ),
					cid               = this.model.get( 'cid' ),
					totalNumOfColumns = 'undefined' !== typeof values.element_content ? values.element_content.match( /\[fusion_content_box ((.|\n|\r)*?)\]/g ) : 1,
					numOfColumns;

				totalNumOfColumns = null !== totalNumOfColumns ? totalNumOfColumns.length : 1;
				numOfColumns      = values.columns;

				if ( '' === numOfColumns || '0' === numOfColumns ) {
					numOfColumns = totalNumOfColumns;
					numOfColumns = Math.max( 6, numOfColumns );
				} else if ( 6 < numOfColumns ) {
					numOfColumns = 6;
				}

				values.columns = numOfColumns;

				attr[ 'class' ] += ' columns row';
				attr[ 'class' ] += ' fusion-columns-' + numOfColumns;
				attr[ 'class' ] += ' fusion-columns-total-' + totalNumOfColumns;
				attr[ 'class' ] += ' fusion-content-boxes-cid' + cid;
				attr[ 'class' ] += ' content-boxes-' + values.layout;
				attr[ 'class' ] += ' content-' + values.icon_align;

				if ( 'timeline-horizontal' === values.layout || 'clean-vertical' === values.layout ) {
					attr[ 'class' ] += ' content-boxes-icon-on-top';
				}

				if ( 'timeline-vertical' === values.layout ) {
					attr[ 'class' ] += ' content-boxes-icon-with-title';
				}
				if ( 'clean-horizontal' === values.layout ) {
					attr[ 'class' ] += ' content-boxes-icon-on-side';
				}

				if ( '' !== values.animation_delay ) {
					attr[ 'data-animation-delay' ] = values.animation_delay;
					attr[ 'class' ] += ' fusion-delayed-animation';
				}

				attr[ 'class' ] += ' fusion-child-element';

				if ( values.alignment ) {
					attr[ 'class' ] += ' has-flex-alignment';
				}

				if ( '' !== values[ 'class' ] ) {
					attr[ 'class' ] += ' ' + values[ 'class' ];
				}

				if ( '' !== values.id ) {
					attr.id = values.id;
				}

				attr = _.fusionAnimations( values, attr );

				return attr;
			},

			getParentCssVars: function( values ) {
				var cssVars = [
					'backgroundcolor',
					'body_color',
					'title_color',
					'iconcolor',
					'iconcolor_hover',
					'circlecolor_hover',
					'margin_top',
					'margin_bottom',
					'alignment'
				];
				var customCssVars = [];
				this.values = values;

				cssVars.item_margin_top = { 'callback': _.fusionGetValueWithUnit };
				cssVars.item_margin_bottom = { 'callback': _.fusionGetValueWithUnit };

				cssVars.border_radius_top_left = { 'callback': _.fusionGetValueWithUnit };
				cssVars.border_radius_top_right = { 'callback': _.fusionGetValueWithUnit };
				cssVars.border_radius_bottom_right = { 'callback': _.fusionGetValueWithUnit };
				cssVars.border_radius_bottom_left = { 'callback': _.fusionGetValueWithUnit };

				customCssVars.hover_accent_color = values.hover_accent_color;

				let circleHoverAccentColor = values.hover_accent_color;
				if ( 'transparent' === values.circlecolor || 0 === jQuery.AWB_Color( values.circlecolor ).alpha() || 'no' === values.icon_circle ) {
					circleHoverAccentColor = 'transparent';
				}
				customCssVars.circle_hover_accent_color = circleHoverAccentColor;

				// if 1 column and not margin bottom is set, then set margin-bottom to 40px.
				if ( 1 === parseInt( values.columns ) && ! values.item_margin_bottom ) {
					customCssVars.item_margin_bottom = '40px';
				}

				// Box Shadow.
				let boxShadow = '';
				if ( 'yes' === values.box_shadow ) {
					boxShadow = _.awbGetBoxShadowCssVar( '--awb-box-shadow', this.values );
				}

				return this.getCssVarsForOptions( cssVars ) + this.getCustomCssVars( customCssVars ) + boxShadow;
			},

			/**
			 * Extendable function for when child elements get generated.
			 *
			 * @since 2.0.0
			 * @param {Object} modules An object of modules that are not a view yet.
			 * @return {void}
			 */
			onGenerateChildElements: function( modules ) {
				this.addImagesToImageMap( modules, false, false );
			},

			/**
			 * Add images to the view's image map.
			 *
			 * @since 2.0
			 * @param {Object} childrenData - The children for which images need added to the map.
			 * @param bool async - Determines if the AJAX call should be async.
			 * @param bool async - Determines if the view should be re-rendered.
			 * @return void
			 */
			addImagesToImageMap: function( childrenData, async, reRender ) {
				var view      = this,
					queryData = {};

				async    = ( 'undefined' === typeof async ) ? true : async;
				reRender = ( 'undefined' === typeof reRender ) ?  true : reRender;

				view.initialData = true;

				_.each( childrenData, function( child ) {
					var params  = ( 'undefined' !== typeof child.get ) ? child.get( 'params' ) : child.params,
						cid     = ( 'undefined' !== typeof child.get ) ? child.get( 'cid' ) : child.cid,
						imageId = 'undefined' !== typeof params.image_id && '' !== params.image_id ? params.image_id : false,
						image   = 'undefined' !== typeof params.image && '' !== params.image ? params.image : false;

					// Has neither url or ID set.
					if ( ! imageId && ! image ) {
						return;
					}

					// if it has image id set and available, no need to progress.
					if ( imageId && 'undefined' !== typeof view.imageMap[ imageId ] ) {
						return;
					}

					// if it has image url set and available, no need to progress.
					if ( image && 'undefined' !== typeof view.imageMap[ image ] ) {
						return;
					}

					// Made it this far we need to get image data.
					queryData[ cid ] = params;
				} );

				// Send this data with ajax or rest.
				if ( ! _.isEmpty( queryData ) ) {
					jQuery.ajax( {
						async: async,
						url: window.fusionAppConfig.ajaxurl,
						type: 'post',
						dataType: 'json',
						data: {
							action: 'get_fusion_content_boxes_children_data',
							children: queryData,
							fusion_load_nonce: window.fusionAppConfig.fusion_load_nonce
						}
					} )
					.done( function( response ) {
						view.updateImageMap( response );

						if ( reRender ) {
							view.reRender();
						}
					} );
				} else if ( reRender ) {
					view.reRender();
				}
			},

			/**
			 * Update the view's image map.
			 *
			 * @since 2.0
			 * @param {Object} images - The images object to inject.
			 * @return void
			 */
			updateImageMap: function( images ) {
				var self = this;

				_.each( images, function( imageData, image ) {
					if ( 'undefined' === typeof self.imageMap[ image ] ) {
						self.imageMap[ image ] = imageData;
					}
				} );
			}
		} );
	} );
}( jQuery ) );
