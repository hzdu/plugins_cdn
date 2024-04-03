/* global FusionApp, FusionPageBuilderApp, FusionPageBuilderViewManager, fusionAllElements, fusionBuilderText, FusionEvents, FusionPageBuilderElements */
/* jshint -W020 */
/* eslint no-shadow: 0 */
var FusionPageBuilder = FusionPageBuilder || {};

( function() {

	jQuery( document ).ready( function() {

		// Builder Container View
		FusionPageBuilder.ContainerView = FusionPageBuilder.BaseView.extend( {

			template: FusionPageBuilder.template( jQuery( '#fusion-builder-container-template' ).html() ),
			className: function() {
				var classes = 'fusion-builder-container fusion-builder-data-cid',
					values  = _.fusionCleanParameters( jQuery.extend( true, {}, this.model.get( 'params' ) ) );

				if ( 'yes' === values.hundred_percent_height_scroll && 'yes' === values.hundred_percent_height ) {
					classes += ' scrolling-helper';
				}

				if ( this.isFlex ) {
					classes += ' fusion-builder-flex-container';
				}

				if ( values.status && 'draft' === values.status ) {
					classes += ' fusion-builder-container-status-draft';
				}

				// Absolute container.
				if ( 'undefined' !== typeof values.absolute && 'on' === values.absolute ) {
					classes += ' fusion-builder-absolute-container-wrapper';
				}

				return classes;
			},
			events: {
				'click .fusion-builder-container-settings': 'settings',
				'click .fusion-builder-container-remove': 'removeContainer',
				'click .fusion-builder-container-clone': 'cloneContainer',
				'click .fusion-builder-container-add': 'addContainer',
				'click .fusion-builder-container-save': 'openLibrary',
				'click .fusion-builder-publish-tooltip': 'publish',
				'click .fusion-builder-unglobal-tooltip': 'unglobalize',
				'click .fusion-builder-container-drag': 'preventDefault'
			},

			/**
			 * Init.
			 *
			 * @since 2.0.0
			 * @return {void}
			 */
			initialize: function() {
				var cid = this.model.get( 'cid' ),
					el  = this.$el;

				el.attr( 'data-cid', cid );
				el.attr( 'id', 'fusion-container-' + cid );

				if ( 'undefined' !== typeof this.model.attributes.params && 'undefined' !== typeof this.model.attributes.params.fusion_global ) {
					el.attr( 'fusion-global-layout', this.model.attributes.params.fusion_global );
					this.$el.removeClass( 'fusion-global-container' ).addClass( 'fusion-global-container' );
				}

				this.listenTo( FusionEvents, 'fusion-view-update-fusion_builder_container', this.reRender );
				this.listenTo( FusionEvents, 'fusion-param-changed-' + this.model.get( 'cid' ), this.onOptionChange );
				// Responsive control updates on resize.
				this.listenTo( FusionEvents, 'fusion-preview-viewport-update', this.onPreviewResize );

				this._triggerCallback = _.debounce( _.bind( this.triggerCallback, this ), 200 );

				this.model.children = new FusionPageBuilder.Collection();
				this.listenTo( this.model.children, 'add', this.addChildView );

				this.renderedYet          = FusionPageBuilderApp.loaded;
				this._refreshJs           = _.debounce( _.bind( this.refreshJs, this ), 300 );
				this._triggerScrollUpdate = _.debounce( _.bind( this.triggerScrollUpdate, this ), 300 );
				this._reInitSticky        = _.debounce( _.bind( this.reInitSticky, this ), 300 );
				this._updateInnerStyles	  = _.debounce( _.bind( this.updateInnerStyles, this ), 500 );

				this.scrollingSections = false;

				this.settingsControlsOffset = 0;
				this.width = el.width();
				el.on( 'mouseenter', _.bind( this.setSettingsControlsOffset, this ) );
				this.correctStackingContextForFilters();

				this.deprecatedParams();

				this.baseInit();

				this.reInitDraggables = false;
			},

			/**
			 * Set correct top offset for the container setting controls.
			 *
			 * @since 2.0
			 * @param {boolean} forced - Whether to force an update and bypass checks.
			 * @return {void}
			 */
			setSettingsControlsOffset: function( forced ) {
				var offset = 15,
					customOffset;

				if ( ( 'undefined' !== typeof forced || 0 === this.settingsControlsOffset || this.width !== this.$el.width() ) && ( 'undefined' !== typeof window.frames[ 0 ].getStickyHeaderHeight || 'undefined' !== typeof window.frames[ 0 ].fusionGetStickyOffset ) ) {
					// if we have sticky enabled, get its height.
					if ( 'off' !== FusionApp.preferencesData.sticky_header && 'on' !== this.values.sticky ) {

						// If we have a custom header, use function to retrieve lowest point.
						if ( jQuery( '#fb-preview' )[ 0 ].contentWindow.jQuery( '.fusion-tb-header' ).length && 'function' === typeof window.frames[ 0 ].fusionGetStickyOffset ) {
							customOffset = window.frames[ 0 ].fusionGetStickyOffset();
							if ( customOffset ) {
								offset += customOffset;
							}
						} else if ( 'undefined' !== typeof window.frames[ 0 ].getStickyHeaderHeight ) {
							offset += window.frames[ 0 ].getStickyHeaderHeight( true );
						}
					}

					this.settingsControlsOffset = offset + 'px';
					this.width                  = this.$el.width();

					this.$el.find( '.fusion-builder-module-controls-container-wrapper .fusion-builder-module-controls-type-container' ).css( 'top', this.settingsControlsOffset );
				}

				if ( this.$el.find( '.fusion-builder-empty-container' ).is( ':visible' ) ) {
					this.$el.find( '.fusion-builder-module-controls-container-wrapper .fusion-builder-module-controls-type-container' ).css( 'margin-top', '8.5px' );
				} else {
					this.$el.find( '.fusion-builder-module-controls-container-wrapper .fusion-builder-module-controls-type-container' ).css( 'margin-top', '' );
				}
			},

			/**
			 * Corrects the stacking context if filters are used, to make all elements accessible.
			 *
			 * @since 2.2
			 * @return {void}
			 */
			correctStackingContextForFilters: function() {
				var parent = this.$el;


				this.$el.on( 'mouseenter', '.fusion-fullwidth', function() {
					if ( 'none' !== jQuery( this ).css( 'filter' ) ) {
						parent.addClass( 'fusion-has-filters' );
					}
				} );

				this.$el.on( 'mouseleave', '.fusion-fullwidth', function() {
					if ( ! parent.hasClass( 'fusion-container-editing-child' ) ) {
						parent.removeClass( 'fusion-has-filters' );
					}
				} );
			},

			/**
			 * Renders the view.
			 *
			 * @since 2.0.0
			 * @return {Object} this
			 */
			render: function() {
				var self = this,
					data = this.getTemplateAtts();

				this.$el.html( this.template( data ) );
				this.appendChildren();

				if ( this.renderedYet ) {
					this._refreshJs();

					// Trigger equal height columns js
					jQuery( '#fb-preview' )[ 0 ].contentWindow.jQuery( 'body' ).trigger( 'fusion-option-change-equal_height_columns', this.model.attributes.cid );
				}

				this.onRender();

				this.renderedYet = true;

				setTimeout( function() {
					self.droppableContainer();
				}, 100 );

				this._triggerScrollUpdate();

				return this;
			},

			/**
			 * Adds drop zones for continers and makes container draggable.
			 *
			 * @since 2.0.0
			 * @return {void}
			 */
			droppableContainer: function() {
				var $el   = this.$el,
					self  = this,
					cid   = this.model.get( 'cid' ),
					$body = jQuery( '#fb-preview' )[ 0 ].contentWindow.jQuery( 'body' );

				if ( ! $el ) {
					return;
				}

				$el.draggable( {
					appendTo: FusionPageBuilderApp.$el,
					zIndex: 999999,
					delay: 100,
					cursorAt: { top: 15, left: 15 },
					iframeScroll: true,
					containment: $body,
					cancel: '.fusion-builder-column',
					helper: function() {
						var $classes = FusionPageBuilderApp.DraggableHelpers.draggableClasses( cid );
						return jQuery( '<div class="fusion-container-helper ' + $classes + '" data-cid="' + cid + '"><span class="fusiona-container"></span></div>' );
					},
					start: function() {
						$body.addClass( 'fusion-container-dragging fusion-active-dragging' );
						$el.addClass( 'fusion-being-dragged' );

						//  Add a class to hide the unnecessary target after.
						if ( $el.prev( '.fusion-builder-container' ).length ) {
							$el.prev( '.fusion-builder-container' ).addClass( 'hide-target-after' );
						}

						if ( $el.prev( '.fusion-fusion-builder-next-pager' ).length ) {
							$el.prev( '.fusion-fusion-builder-next-page' ).addClass( 'hide-target-after' );
						}
					},
					stop: function() {
						setTimeout( function() {
							$body.removeClass( 'fusion-container-dragging fusion-active-dragging' );
						}, 10 );
						$el.removeClass( 'fusion-being-dragged' );
						FusionPageBuilderApp.$el.find( '.hide-target-after' ).removeClass( 'hide-target-after' );
					}
				} );

				$el.find( '.fusion-container-target' ).droppable( {
					tolerance: 'touch',
					hoverClass: 'ui-droppable-active',
					accept: '.fusion-builder-container, .fusion-builder-next-page, .fusion-checkout-form, .fusion-builder-form-step',
					drop: function( event, ui ) {
						self.handleDropContainer( ui.draggable, $el, jQuery( event.target ) );
					}
				} );
			},

			handleDropContainer( $column, $targetEl, $dropTarget ) {
				// Move the actual html.
				if ( jQuery( $dropTarget ).hasClass( 'target-after' ) ) {
					$targetEl.after( $column );
				} else {
					$targetEl.before( $column );
				}

				FusionEvents.trigger( 'fusion-content-changed' );

				FusionPageBuilderApp.scrollingContainers();

				FusionEvents.trigger( 'fusion-history-save-step', fusionBuilderText.full_width_section + ' Order Changed' );
			},

			/**
			 * Get the template.
			 *
			 * @since 2.0.0
			 * @return {void}
			 */
			getTemplate: function() {
				var atts = this.getTemplateAtts();

				return this.template( atts );
			},

			/**
			 * Remove deprecated params.
			 *
			 * @since 2.0.0
			 * @return {void}
			 */
			deprecatedParams: function() {
				var params               = this.model.get( 'params' ),
					defaults             = fusionAllElements.fusion_builder_container.defaults,
					values               = jQuery.extend( true, {}, defaults, params ),
					alphaBackgroundColor = 1,
					radiaDirectionsNew   = { 'bottom': 'center bottom', 'bottom center': 'center bottom', 'left': 'left center', 'right': 'right center', 'top': 'center top', 'center': 'center center', 'center left': 'left center' };

				params = _.fusionContainerMapDeprecatedArgs( params );

				// If no blend mode is defined, check if we should set to overlay.
				if ( 'undefined' === typeof params.background_blend_mode && '' !== values.background_color  ) {
					alphaBackgroundColor = jQuery.AWB_Color( values.background_color ).alpha();
					if ( 1 > alphaBackgroundColor && 0 !== alphaBackgroundColor && ( '' !== params.background_image || '' !== params.video_bg ) ) {
						params.background_blend_mode = 'overlay';
					}
				}

				// Check if we have an old border-size. If we do, then we need to migrate it to the new options
				// and delete the old param.
				if ( 'undefined' !== typeof params.border_size ) {
					if ( '' !== params.border_size ) {
						params.border_sizes_top    = parseInt( params.border_size ) + 'px';
						params.border_sizes_bottom = parseInt( params.border_size ) + 'px';
						params.border_sizes_left   = '0px';
						params.border_sizes_right  = '0px';
					}
					delete params.border_size;
				}

				// Correct radial direction params.
				if ( 'undefined' !== typeof params.radial_direction && ( params.radial_direction in radiaDirectionsNew ) ) {
					params.radial_direction = radiaDirectionsNew[ values.radial_direction ];
				}

				// No column align, but equal heights is on, set to stretch.
				if ( 'undefined' === typeof params.flex_align_items && 'undefined' !== typeof params.equal_height_columns && 'yes' === params.equal_height_columns ) {
					params.flex_align_items = 'stretch';
				}

				// No align content, but it is 100% height and centered.
				if ( 'undefined' === typeof params.align_content && 'undefined' !== typeof params.hundred_percent_height && 'yes' === params.hundred_percent_height && 'undefined' !== typeof params.hundred_percent_height_center_content && 'yes' === params.hundred_percent_height_center_content ) {
					params.align_content = 'center';
				}

				// If legacy mode is off, remove param, causes it to run migration and then setType is called.
				if ( ( 'undefined' === typeof params.type || 'flex' !== params.type ) && 'undefined' !== typeof fusionAllElements.fusion_builder_container.extras.container_legacy_support && ( 0 === fusionAllElements.fusion_builder_container.extras.container_legacy_support || '0' === fusionAllElements.fusion_builder_container.extras.container_legacy_support || false === fusionAllElements.fusion_builder_container.extras.container_legacy_support ) ) {
					delete params.type;
				}

				this.model.set( 'params', params );
			},

			/**
			 * Set type to ensure migration does not run on front-end.
			 *
			 * @since 3.0
			 * @return {Void}
			 */
			setType: function() {
				var params   = this.model.get( 'params' ),
					defaults = fusionAllElements.fusion_builder_container.defaults;

				if ( 'undefined' === typeof params.type ) {
					params.type = defaults.type;
				}

				this.model.set( 'params', params );
			},

			/**
			 * Get dynamic values.
			 *
			 * @since 2.0.0
			 * @return {Object}
			 */
			getDynamicAtts: function( values ) {
				var self = this;

				if ( 'undefined' !== typeof this.dynamicParams && this.dynamicParams && ! _.isEmpty( this.dynamicParams.getAll() ) ) {
					_.each( this.dynamicParams.getAll(), function( data, id ) {
						var value = self.dynamicParams.getParamValue( data );

						if ( 'undefined' !== typeof value && false !== value ) {
							values[ id ] = value;
						}
					} );
				}
				return values;
			},

			setValues: function() {
				var element		= fusionAllElements[ this.model.get( 'element_type' ) ],
					defaults 	= fusionAllElements.fusion_builder_container.defaults,
					params		= jQuery.extend( true, {}, this.model.get( 'params' ) ),
					extras		= {},
					values		= {},
					borderRadius;

				extras = jQuery.extend( true, {}, fusionAllElements.fusion_builder_container.extras );

				// If 100 page template.
				if ( FusionPageBuilderApp.$el.find( '#main' ).hasClass( 'width-100' ) && 'undefined' !== typeof extras.container_padding_100 ) {
					defaults.padding_top    = extras.container_padding_100.top;
					defaults.padding_right  = extras.container_padding_100.right;
					defaults.padding_bottom = extras.container_padding_100.bottom;
					defaults.padding_left   = extras.container_padding_100.left;
				} else if ( ! FusionPageBuilderApp.$el.find( '#main' ).hasClass( 'width-100' ) && 'undefined' !== typeof extras.container_padding_default ) {
					defaults.padding_top    = extras.container_padding_default.top;
					defaults.padding_right  = extras.container_padding_default.right;
					defaults.padding_bottom = extras.container_padding_default.bottom;
					defaults.padding_left   = extras.container_padding_default.left;
				}

				params = _.fusionCleanParameters( params );

				// Set values & extras
				if ( element && 'undefined' !== typeof element.defaults ) {
					values = jQuery.extend( true, {}, defaults, params );
				}

				// Default value is an array, so we need to convert it to string.
				if ( Array.isArray( values.absolute_devices ) ) {
					values.absolute_devices = values.absolute_devices.join( ',' );
				}

				values = this.getDynamicAtts( values );

				this.defaults			= defaults;
				this.values 			= values;
				this.params				= params;

				if ( 'on' === this.values.sticky ) {
					this.values.background_parallax = 'none';
					this.values.fade                = 'no';
				}

				this.values.border_radius_top_left     = this.values.border_radius_top_left ? _.fusionGetValueWithUnit( this.values.border_radius_top_left ) : '0px';
				this.values.border_radius_top_right    = this.values.border_radius_top_right ? _.fusionGetValueWithUnit( this.values.border_radius_top_right ) : '0px';
				this.values.border_radius_bottom_left  = this.values.border_radius_bottom_left ? _.fusionGetValueWithUnit( this.values.border_radius_bottom_left ) : '0px';
				this.values.border_radius_bottom_right = this.values.border_radius_bottom_right ? _.fusionGetValueWithUnit( this.values.border_radius_bottom_right ) : '0px';
				borderRadius                           = this.values.border_radius_top_left + ' ' + this.values.border_radius_top_right + ' ' + this.values.border_radius_bottom_right + ' ' + this.values.border_radius_bottom_left;
				if ( '0px 0px 0px 0px' !== borderRadius && '' === this.values.overflow ) {
					this.values.overflow = 'hidden';
				}
			},

			/**
			 * Set extra args.
			 *
			 * @since 2.0.0
			 * @return {void}
			 */
			setExtraValues: function() {
				this.values.alpha_background_color = jQuery.AWB_Color( this.values.background_color ).alpha();
			},

			contentStyle: function() {
				var self = this,
					contentStyle = '';

				if ( 'yes' === this.values.hundred_percent_height && 'yes' === this.values.hundred_percent_height_center_content ) {
					// Get correct container padding.
					jQuery.each( [ 'top', 'right', 'bottom', 'left' ], function( index, padding ) {
						var paddingName = 'padding_' + padding;

						// Add padding to style.
						if ( '' !== self.values[ paddingName ] ) {
							contentStyle += 'padding-' + padding + ':' + _.fusionGetValueWithUnit( self.values[ paddingName ] ) + ';';
						}
					} );
				}

				return contentStyle;
			},

			/**
			 * Sets container video data args.
			 *
			 * @access public
			 * @since 3.0
			 * @return void
			 */
			setContainerVideoData: function() {
				// If no blend mode is defined, check if we should set to overlay.
				if ( 'undefined' !== typeof this.values.background_blend_mode &&
					1 > this.values.alpha_background_color &&
					0 !== this.values.alpha_background_color &&
					! this.is_gradient_color &&
					( this.background_image || this.values.video_bg ) ) {
					this.values.background_blend_mode = 'overlay';
				}

				this.values.video_bg = false;
				if ( this.values.video_mp4 || this.values.video_webm || this.values.video_ogv || this.values.video_url ) {
					this.values.video_bg = true;
				}
			},

			parallaxAttr: function() {
				var attr 			= {},
					bgColorAlpha 	= jQuery.AWB_Color( this.values.background_color ).alpha();

				attr[ 'class' ] = 'fusion-bg-parallax';

				attr[ 'data-bg-align' ]       = this.values.background_position;
				attr[ 'data-direction' ]      = this.values.background_parallax;
				attr[ 'data-mute' ]           = 'mute' === this.values.video_mute ? 'true' : 'false';
				attr[ 'data-opacity' ]        = this.values.opacity;
				attr[ 'data-velocity' ]       = this.values.parallax_speed * -1;
				attr[ 'data-mobile-enabled' ] = 'yes' === this.values.enable_mobile ? 'true' : 'false';
				attr[ 'data-break_parents' ]  = this.values.break_parents;
				attr[ 'data-bg-image' ]       = this.values.background_image;
				attr[ 'data-bg-repeat' ]      = this.values.background_repeat && 'no-repeat' !== this.values.background_repeat ? 'true' : 'false';

				if ( 0 !== bgColorAlpha ) {
					attr[ 'data-bg-color' ] = this.values.background_color;
				}

				if ( 'none' !== this.values.background_blend_mode ) {
					attr[ 'data-blend-mode' ] = this.values.background_blend_mode;
				}

				if ( this.values.is_gradient_color ) {
					attr[ 'data-bg-gradient-type' ]           = this.values.gradient_type;
					attr[ 'data-bg-gradient-angle' ]          = this.values.linear_angle;
					attr[ 'data-bg-gradient-start-color' ]    = this.values.gradient_start_color;
					attr[ 'data-bg-gradient-start-position' ] = this.values.gradient_start_position;
					attr[ 'data-bg-gradient-end-color' ]      = this.values.gradient_end_color;
					attr[ 'data-bg-gradient-end-position' ]   = this.values.gradient_end_position;
					attr[ 'data-bg-radial-direction' ]        = this.values.radial_direction;
				}

				attr[ 'data-bg-height' ] = this.values.data_bg_height;
				attr[ 'data-bg-width' ]  = this.values.data_bg_width;

				return attr;
			},

			isFlex: function() {
				return this.values && 'flex' === this.values.type;
			},

			attr: function() {
				var attr = {
					'class': 'fusion-fullwidth fullwidth-box fusion-builder-row-live-' + this.model.get( 'cid' ),
					'style': this.getInlineStyle(),
					'id': ''
				};

				if ( this.isFlex() ) {
					attr[ 'class' ] += ' fusion-flex-container';
					if ( 'stretch' !== this.values.align_content ) {
						attr[ 'class' ] += ' fusion-flex-align-content-' + this.values.align_content;
					}
				}

				if ( this.values.video_bg ) {
					attr[ 'class' ] += ' video-background';
				}

				// Fading Background.
				if ( 'yes' === this.values.fade && '' !== this.values.background_image && false === this.values.video_bg ) {
					attr[ 'class' ] += ' faded-background';
				}

				// Parallax.
				if ( false === this.values.video_bg && '' !== this.values.background_image ) {
					// Parallax css class+
					if ( '' !== this.values.background_parallax ) {
						attr[ 'class' ] += ' fusion-parallax-' + this.values.background_parallax;
					}
					if  ( 'fixed' === this.values.background_parallax ) {
						attr.style += 'background-attachment:' + this.values.background_parallax + ';';
					}
				}

				// Custom CSS class+
				if ( '' !== this.values[ 'class' ] ) {
					attr[ 'class' ] += ' ' + this.values[ 'class' ];
				}

				attr[ 'class' ] += ( 'yes' === this.values.hundred_percent ) ? ' hundred-percent-fullwidth' : ' nonhundred-percent-fullwidth';

				attr[ 'class' ] += ( 'yes' === this.values.hundred_percent_height_scroll && 'yes' === this.values.hundred_percent_height ) ? ' fusion-scrolling-section-edit' : '';
				attr[ 'class' ] += ( 'yes' === this.values.hundred_percent_height ) ? ' non-hundred-percent-height-scrolling' : '';
				attr[ 'class' ] += ( 'yes' === this.values.hundred_percent_height && 'yes' !== this.values.hundred_percent_height_center_content ) ? ' hundred-percent-height' : '';
				attr[ 'class' ] += ( 'yes' === this.values.hundred_percent_height && 'yes' === this.values.hundred_percent_height_center_content ) ? ' hundred-percent-height-center-content' : '';

				// Equal column height.
				if ( 'yes' === this.values.equal_height_columns && ! this.isFlex() ) {
					attr[ 'class' ] += ' fusion-equal-height-columns';
				}

				// Hundred percent height and centered content, if added to centerContentClass then the padding makes the container too large.
				if ( 'yes' === this.values.hundred_percent_height && 'yes' === this.values.hundred_percent_height_center_content ) {
					attr[ 'class' ] += ' hundred-percent-height non-hundred-percent-height-scrolling';
				}

				// Visibility classes.
				let visibilityValue = this.values.hide_on_mobile;

				// Get Render logics Array.
				const renderLogicsDevices = this.getRenderLogicsDevices();

				if ( renderLogicsDevices.length && 'on' === FusionApp.preferencesData.rendering_logic ) {
					const rlDevicesEqual = [];
					const rlDevicesNotEqual = [];

					renderLogicsDevices.forEach( ( r ) => {
						switch ( r.value ) {
							case 'desktop':
								if ( 'equal' === r.comparison ) {
									rlDevicesEqual.push( 'large-visibility' );
								} else {
									rlDevicesNotEqual.push( 'large-visibility' );
								}
								break;

							case 'tablet':
								if ( 'equal' === r.comparison ) {
									rlDevicesEqual.push( 'medium-visibility' );
								} else {
									rlDevicesNotEqual.push( 'medium-visibility' );
								}
								break;

							case 'mobile':
								if ( 'equal' === r.comparison ) {
									rlDevicesEqual.push( 'small-visibility' );
								} else {
									rlDevicesNotEqual.push( 'small-visibility' );
								}
								break;

							case 'mobile_tablet':
								if ( 'equal' === r.comparison ) {
									rlDevicesEqual.push( 'medium-visibility' );
									rlDevicesEqual.push( 'small-visibility' );
								} else {
									rlDevicesNotEqual.push( 'medium-visibility' );
									rlDevicesNotEqual.push( 'small-visibility' );
								}
								break;
						}
					} );

					if ( rlDevicesEqual.length ) {
						attr[ 'class' ] = _.fusionVisibilityAtts( rlDevicesEqual.join( ',' ), attr[ 'class' ] );
					}

					if ( rlDevicesNotEqual.length ) {
						visibilityValue = visibilityValue.split( ',' ).filter( ( v ) => !rlDevicesNotEqual.includes( v ) );
					}
				}

				attr[ 'class' ] = _.fusionVisibilityAtts( visibilityValue, attr[ 'class' ] );

				// Animations.
				attr = _.fusionAnimations( this.values, attr );

				// Custom CSS ID.
				if ( '' !== this.values.id ) {
					attr.id = this.values.id;
				}

				if ( '' !== this.values.menu_anchor ) {
					attr.id += ' ' + this.values.menu_anchor;
				}

				// Sticky container.
				if ( 'on' === this.values.sticky ) {
					attr[ 'class' ] += ' fusion-sticky-container';

					if ( '' !== this.values.sticky_transition_offset && 0 !== this.values.sticky_transition_offset ) {
						attr[ 'data-transition-offset' ] = parseFloat( this.values.sticky_transition_offset );
					}
					if ( '' !== this.values.sticky_offset && 0 !== this.values.sticky_offset ) {
						attr[ 'data-sticky-offset' ] = this.values.sticky_offset;
					}
					if ( '' !== this.values.scroll_offset && 0 !== this.values.scroll_offset ) {
						attr[ 'data-scroll-offset' ] = parseFloat( this.values.scroll_offset );
					}

					if ( '' !== this.values.sticky_devices ) {
						if ( 'string' === typeof this.values.sticky_devices ) {
							this.values.sticky_devices = this.values.sticky_devices.split( ',' );
						}
						_.each( this.values.sticky_devices, function( stickyDevice ) {
							attr[ 'data-sticky-' + stickyDevice.replace( /\s/g, '' ) ] = true;
						} );
					}
				}

				// z-index.
			if ( 'undefined' !== typeof this.values.z_index && '' !== this.values.z_index ) {
				attr[ 'class' ] += ' fusion-custom-z-index';
			}

			// Absolute container.
			if ( 'undefined' !== typeof this.values.absolute && 'on' === this.values.absolute ) {
				attr[ 'class' ] += ' fusion-absolute-container';

				if ( 'undefined' !== typeof this.values.absolute_devices && '' !== this.values.absolute_devices ) {
					_.each( this.values.absolute_devices.split( ',' ), function( absoluteDevice ) {
						attr[ 'class' ] += ' fusion-absolute-position-' + absoluteDevice;
					} );
				}
			}

			if ( this.values.pattern_bg ) {
				attr[ 'class' ] += ' has-pattern-background';
			}

			if ( this.values.mask_bg ) {
				attr[ 'class' ] += ' has-mask-background';
			}


				return attr;
			},

			getInlineStyle: function() {
				var customVars = {},
					cssVars,
					boxShadow;

				cssVars = [
					'background_position',
					'background_position_medium',
					'background_position_small',
					'background_repeat',
					'background_repeat_medium',
					'background_repeat_small',
					'background_blend_mode',
					'background_blend_mode_medium',
					'background_blend_mode_small',

					'border_sizes_top',
					'border_sizes_bottom',
					'border_sizes_left',
					'border_sizes_right',
					'border_color',
					'border_style',
					'border_radius_top_left',
					'border_radius_top_right',
					'border_radius_bottom_right',
					'border_radius_bottom_left',

					'overflow',
					'z_index'
				];

				// Background.
				if ( '' !== this.values.background_color && ! ( 'yes' === this.values.fade && '' !== this.values.background_image && false === this.values.video_bg ) ) {
					customVars.background_color = this.values.background_color;
				}

				if ( '' !== this.values.background_color_medium ) {
					customVars.background_color_medium = this.values.background_color_medium;
				}

				if ( '' !== this.values.background_color_small ) {
					customVars.background_color_small = this.values.background_color_small;
				}

				if ( '' !== this.values.background_image && 'yes' !== this.values.fade ) {
					customVars.background_image = 'url(\'' + this.values.background_image + '\')';
				}

				if ( '' !== this.values.background_image_medium ) {
					customVars.background_image_medium = 'url(\'' + this.values.background_image_medium + '\')';
				}

				if ( '' !== this.values.background_image_small ) {
					customVars.background_image_small = 'url(\'' + this.values.background_image_small + '\')';
				}

				if ( '' !== _.getGradientString( this.values, 'main_bg' ) ) {
					customVars.background_image = _.getGradientString( this.values, 'main_bg' );

					if ( '' !== this.values.background_image_medium ) {
						customVars.background_image_medium = _.getGradientString( this.values, 'column', 'medium' );
					}

					if ( '' !== this.values.background_image_small ) {
						customVars.background_image_small = _.getGradientString( this.values, 'column', 'small' );
					}
				}

				if ( 'on' === this.values.sticky ) {
					if ( '' !== this.values.sticky_background_color ) {
						customVars.sticky_background_color = this.values.sticky_background_color + ' !important';
					}

					if ( '' !== this.values.sticky_height ) {
						customVars.sticky_height = this.values.sticky_height + ' !important';
					}
				}
				if ( undefined !== this.values.flex_wrap && '' !== this.values.flex_wrap ) {
					customVars.flex_wrap = this.values.flex_wrap;
				}
				if ( undefined !== this.values.flex_wrap_medium && '' !== this.values.flex_wrap_medium ) {
					customVars.flex_wrap_medium = this.values.flex_wrap_medium;
				}
				if ( undefined !== this.values.flex_wrap_small && '' !== this.values.flex_wrap_small ) {
					customVars.flex_wrap_small = this.values.flex_wrap_small;
				}

				if ( ! this.isFlex() ) {
					cssVars.padding_top    = { 'callback': _.fusionGetValueWithUnit };
					cssVars.padding_right  = { 'callback': _.fusionGetValueWithUnit };
					cssVars.padding_bottom = { 'callback': _.fusionGetValueWithUnit };
					cssVars.padding_left   = { 'callback': _.fusionGetValueWithUnit };

					cssVars.margin_top    = { 'callback': _.fusionGetValueWithUnit };
					cssVars.margin_bottom = { 'callback': _.fusionGetValueWithUnit };
				} else {
					cssVars.padding_top    = { 'callback': _.fusionGetValueWithUnit };
					cssVars.padding_right  = { 'callback': _.fusionGetValueWithUnit };
					cssVars.padding_bottom = { 'callback': _.fusionGetValueWithUnit };
					cssVars.padding_left   = { 'callback': _.fusionGetValueWithUnit };

					cssVars.padding_top_medium    = { 'callback': _.fusionGetValueWithUnit };
					cssVars.padding_right_medium  = { 'callback': _.fusionGetValueWithUnit };
					cssVars.padding_bottom_medium = { 'callback': _.fusionGetValueWithUnit };
					cssVars.padding_left_medium   = { 'callback': _.fusionGetValueWithUnit };

					cssVars.padding_top_small    = { 'callback': _.fusionGetValueWithUnit };
					cssVars.padding_right_small  = { 'callback': _.fusionGetValueWithUnit };
					cssVars.padding_bottom_small = { 'callback': _.fusionGetValueWithUnit };
					cssVars.padding_left_small   = { 'callback': _.fusionGetValueWithUnit };

					cssVars.margin_top           = { 'callback': _.fusionGetValueWithUnit };
					cssVars.margin_bottom        = { 'callback': _.fusionGetValueWithUnit };
					cssVars.margin_top_medium    = { 'callback': _.fusionGetValueWithUnit };
					cssVars.margin_bottom_medium = { 'callback': _.fusionGetValueWithUnit };
					cssVars.margin_top_small     = { 'callback': _.fusionGetValueWithUnit };
					cssVars.margin_bottom_small  = { 'callback': _.fusionGetValueWithUnit };

					// Minimum height.
					if ( 'min' === this.values.hundred_percent_height ) {
						cssVars.min_height        = { 'callback': this.sanitizeMinHeightArg };
						cssVars.min_height_medium = { 'callback': this.sanitizeMinHeightArg };
						cssVars.min_height_small  = { 'callback': this.sanitizeMinHeightArg };
					}
				}

				boxShadow = _.awbGetBoxShadowCssVar( '--awb-box-shadow', this.values );
				if ( boxShadow ) {
					boxShadow += 'box-shadow: var(--awb-box-shadow) !important';
				}

				// background size.
				if ( '' !== this.values.background_image && false === this.values.video_bg ) {
					if ( 'no-repeat' === this.values.background_repeat ) {
						customVars.background_size = 'cover';
					}
				}

				if ( '' !== this.values.background_size ) {
					const backgroundSize = 'custom' === this.values.background_size ? this.values.background_custom_size : this.values.background_size;
					customVars.background_size = backgroundSize;
				}

				if ( '' !== this.values.background_size_medium ) {
					const backgroundSizeMedium = 'custom' === this.values.background_size_medium ? this.values.background_custom_size_medium : this.values.background_size_medium;
					customVars.background_size_medium = backgroundSizeMedium;
				}

				if ( '' !== this.values.background_size_small ) {
					const backgroundSizeSmall = 'custom' === this.values.background_size_small ? this.values.background_custom_size_small : this.values.background_size_small;
					customVars.background_size_small = backgroundSizeSmall;
				}

				return this.getLinkColorStyles( this.values ) + this.getCssVarsForOptions( cssVars ) + this.getCustomCssVars( customVars ) + boxShadow + _.getFilterVars( this.values );
			},

			getLinkColorStyles: function( values ) {
				let styles = '';
				if ( '' !== values.link_hover_color ) {
					styles += '--link_hover_color: ' + values.link_hover_color + ';';
				}

				if ( '' !== values.link_color ) {
					styles += '--link_color: ' + values.link_color + ';';
				}

				return styles;
			},

			getFadingBgVars: function() {
				var customVars = {},
					cssVars;

				// Fading Background.
				if ( 'yes' === this.values.fade && '' !== this.values.background_image && false === this.values.video_bg ) {
					cssVars = [
						'background_color',
						'background_position',
						'background_position_medium',
						'background_position_small',
						'background_repeat',
						'background_repeat_medium',
						'background_repeat_small',
						'background_blend_mode',
						'background_blend_mode_medium',
						'background_blend_mode_small'
					];

					if (  this.values.background_parallax ) {
						cssVars.push( 'background_parallax' );
					}

					if ( this.values.background_image ) {
						customVars.background_image = 'url(' + this.values.background_image + ')';
					}

					if ( this.values.background_image_medium ) {
						customVars.background_image_medium = 'url(' + this.values.background_image_medium + ')';
					}

					if ( this.values.background_image_small ) {
						customVars.background_image_small = 'url(' + this.values.background_image_small + ')';
					}

					if ( '' !== _.getGradientString( this.values, 'fade' ) ) {
						customVars.background_image = _.getGradientString( this.values, 'fade' );

						if ( this.values.background_image_medium ) {
							customVars.background_image_medium = _.getGradientString( this.values, 'fade', 'medium' );
						}

						if ( this.values.background_image_small ) {
							customVars.background_image_small = _.getGradientString( this.values, 'fade', 'small' );
						}
					}

					if ( 'no-repeat' === this.values.background_repeat ) {
						customVars.background_size = 'cover';
					}

					if ( '' !== this.values.background_size ) {
						const backgroundSize = 'custom' === this.values.background_size ? this.values.background_custom_size : this.values.background_size;
						customVars.background_size = backgroundSize;
					}

					if ( '' !== this.values.background_size ) {
						const backgroundSizeMedium = 'custom' === this.values.background_size_medium ? this.values.background_custom_size_medium : this.values.background_size_medium;
						customVars.background_size_medium = backgroundSizeMedium;
					}

					if ( '' !== this.values.background_size ) {
						const backgroundSizeSmall = 'custom' === this.values.background_size_small ? this.values.background_custom_size_small : this.values.background_size_small;
						customVars.background_size_small = backgroundSizeSmall;
					}
				}

				return this.getCssVarsForOptions( cssVars ) + this.getCustomCssVars( customVars );
			},

			sanitizeMinHeightArg: function( value ) {
				if ( '' !== value ) {
					if ( -1 !== value.indexOf( '%' ) ) {
						value = value.replace( '%', 'vh' );
					}
					value = _.fusionGetValueWithUnit( value );
				}

				return value;
			},

			createVideoBackground: function() {
				var videoBackground = '',
					overlayStyle	= '',
					cid				= this.model.get( 'cid' ),
					videoAttributes,
					videoPreviewImageStyle,
					videoUrl,
					videoSrc,
					loop;

					// Videos.
				if ( 'undefined' !== typeof this.values.video_mp4 && '' !== this.values.video_mp4 ) {
					videoSrc += '<source src="' + this.values.video_mp4 + '" type="video/mp4">';
				}

				if ( 'undefined' !== typeof this.values.video_webm && '' !== this.values.video_webm ) {
					videoSrc += '<source src="' + this.values.video_webm + '" type="video/webm">';
				}

				if ( 'undefined' !== typeof this.values.video_ogv && '' !== this.values.video_ogv ) {
					videoSrc += '<source src="' + this.values.video_ogv + '" type="video/ogg">';
				}

				if ( '' !== this.values.video_url ) {
					videoUrl = _.fusionGetVideoProvider( this.values.video_url ),
					loop     = ( 'yes' === this.values.video_loop ? 1 : 0 );
					if ( 'youtube' === videoUrl.type ) {
						videoBackground += '<div style=\'opacity:0;\' class=\'fusion-background-video-wrapper\' id=\'video-' + cid + '\' data-youtube-video-id=\'' + videoUrl.id + '\' data-mute=\'' + this.values.video_mute + '\' data-loop=\'' + loop + '\' data-loop-adjustment=\'' + this.values.video_loop_refinement + '\' data-video-aspect-ratio=\'' + this.values.video_aspect_ratio + '\'><div class=\'fusion-container-video-bg\' id=\'video-' + cid + '-inner\'></div></div>';
					} else if ( 'vimeo' === videoUrl.type ) {
						videoBackground += '<div id="video-' + cid + '" data-vimeo-video-id="' + videoUrl.id + '" data-mute="' + this.values.video_mute + '" data-video-aspect-ratio="' + this.values.video_aspect_ratio + ' }}" style="visibility:hidden;"><iframe id="video-iframe-' + cid + '" src="//player.vimeo.com/video/' + videoUrl.id + '?api=1&player_id=video-iframe-' + cid + '&html5=1&autopause=0&autoplay=1&badge=0&byline=0&loop=' + loop + '&title=0" frameborder="0"></iframe></div>';
					}
				} else {
					videoAttributes = 'preload="auto" autoplay playsinline';

					if ( 'yes' === this.values.video_loop ) {
						videoAttributes += ' loop';
					}

					if ( 'yes' === this.values.video_mute ) {
						videoAttributes += ' muted';
					}

					// Video Preview Image.
					if ( '' !== this.values.video_preview_image ) {
						videoPreviewImageStyle = 'background-image: url(\'' + this.values.video_preview_image + '\');';
						videoBackground += '<div class="fullwidth-video-image" style="' + videoPreviewImageStyle + '"></div>';
					}

					videoBackground += '<div class="fullwidth-video"><video ' + videoAttributes + '>' + videoSrc + '</video></div>';
				}

				// Video Overlay.
				if ( '' !== _.getGradientString( this.values ) ) {
					overlayStyle += 'background-image:' + _.getGradientString( this.values ) + ';';
				}

				if ( '' !== this.values.background_color && 1 > jQuery.AWB_Color( this.values.background_color ).alpha() ) {
					overlayStyle += 'background-color:' + this.values.background_color + ';';
				}

				if ( '' !== overlayStyle ) {
					videoBackground   += '<div class="fullwidth-overlay" style="' + overlayStyle + '"></div>';
				}

				return videoBackground;
			},

			fadingBackgroundAttr: function() {
				var attr = {
					class: 'fullwidth-faded',
					style: this.getFadingBgVars()
				};

				return attr;
			},

			/**
			 * Get template attributes.
			 *
			 * @since 2.0.0
			 * @return {void}
			 */
			getTemplateAtts: function()  {
				var templateAttributes 		= {};

				this.setValues();
				this.setExtraValues();
				this.setContainerVideoData();

				// Remove old parallax bg.
				if ( this.$el.find( '.fusion-bg-parallax' ).length ) {
					if ( 'undefined' !== typeof this.$el.find( '.fusion-bg-parallax' ).data( 'parallax-index' ) ) {
						jQuery( '#fb-preview' )[ 0 ].contentWindow._fusionImageParallaxImages.splice( this.$el.find( '.fusion-bg-parallax' ).data( 'parallax-index' ), 1 );
					}

					this.$el.find( '.fusion-bg-parallax' ).remove();
					this.$el.find( '.parallax-inner' ).remove();
				}

				templateAttributes.values		         = this.values;
				templateAttributes.attr			         = this.attr();
				templateAttributes.parallax 		     = this.parallaxAttr();
				templateAttributes.createVideoBackground = _.bind( this.createVideoBackground, this );
				templateAttributes.fadingBackground	     = this.fadingBackgroundAttr();
				templateAttributes.admin_label 			 = ( '' !== this.values.admin_label ) ? _.unescape( this.values.admin_label ) : fusionBuilderText.full_width_section;
				templateAttributes.topOverlap            = ( 20 > parseInt( this.values.padding_top, 10 ) && ( '0%' === this.values.padding_top || -1 === this.values.padding_top.indexOf( '%' ) ) ) ? 'fusion-overlap' : '';
				templateAttributes.bottomOverlap         = ( 20 > parseInt( this.values.padding_bottom, 10 ) && ( '0%' === this.values.padding_bottom || -1 === this.values.padding_bottom.indexOf( '%' ) ) ) ? 'fusion-overlap' : '';
				templateAttributes.isFlex				 = this.isFlex();
				templateAttributes.isGlobal              = ( 'undefined' !== typeof this.values.fusion_global ) ? 'yes' : 'no';
				templateAttributes.cid                   = this.model.get( 'cid' );
				templateAttributes.status                = this.values.status;
				templateAttributes.container_tag         = this.values.container_tag;
				templateAttributes.scrollPosition 		 = ( 'right' === FusionApp.settings.header_position || jQuery( '#fb-preview' )[ 0 ].contentWindow.jQuery( 'body' ).hasClass( 'rtl' ) ) ? 'scroll-navigation-left' : 'scroll-navigation-right';
				templateAttributes.contentStyle 		 = this.contentStyle();
				templateAttributes.patternBg 		 	 = _.fusionGetPatternElement( this.values );
				templateAttributes.maskBg 		 	 = _.fusionGetMaskElement( this.values );
				templateAttributes.bgSlider 		 	 = _.fusionGetBackgroundSliderElement( this );


				return templateAttributes;
			},

			triggerScrollUpdate: function() {
				setTimeout( function() {
					FusionPageBuilderApp.scrollingContainers();
				}, 100 );
			},

			beforePatch: function() {
				if ( this.$el.find( '.fusion-bg-parallax' ).length ) {
					if ( 'object' === typeof jQuery( '#fb-preview' )[ 0 ].contentWindow._fusionImageParallaxImages && 'undefined' !== typeof this.$el.find( '.fusion-bg-parallax' ).attr( 'data-parallax-index' ) ) {
						jQuery( '#fb-preview' )[ 0 ].contentWindow._fusionImageParallaxImages.splice( this.$el.find( '.fusion-bg-parallax' ).attr( 'data-parallax-index' ), 1 );
					}
				}
			},

			/**
			 * Runs after view DOM is patched.
			 *
			 * @since 2.0.0
			 * @return null
			 */
			afterPatch: function() {
				var self = this;

				this.appendChildren();

				// Using non debounced version for smoothness.
				this.refreshJs();

				this._triggerScrollUpdate();

				setTimeout( function() {
					self.droppableContainer();
				}, 100 );

				if ( 'yes' === this.model.attributes.params.hundred_percent_height && 'yes' === this.model.attributes.params.hundred_percent_height_scroll ) {
					this.$el.addClass( 'scrolling-helper' );
				} else {
					this.$el.removeClass( 'scrolling-helper' );
				}

				this.setSettingsControlsOffset( true );

				this._reInitSticky();

				if ( this.reInitDraggables ) {
					this.updateDragHandles();
				}
			},

			/**
			 * Triggers a refresh.
			 *
			 * @since 2.0.0
			 * @return void
			 */
			refreshJs: function( cid ) {
				cid = 'undefined' === typeof cid ? this.model.attributes.cid : cid;
				jQuery( '#fb-preview' )[ 0 ].contentWindow.jQuery( 'body' ).trigger( 'fusion-element-render-fusion_builder_container', cid );
				jQuery( '#fb-preview' )[ 0 ].contentWindow.jQuery( 'body' ).trigger( 'fusion-reinit-carousels', cid );
				jQuery( '#fb-preview' )[ 0 ].contentWindow.jQuery( 'body' ).trigger( 'fusion-reinit-background-slider', cid );
			},

			/**
			 * Adds a container.
			 *
			 * @since 2.0.0
			 * @param {Object} event - The event.
			 * @return {void}
			 */
			addContainer: function( event ) {
				var elementID,
					defaultParams,
					params,
					value,
					newContainer;

				if ( event ) {
					event.preventDefault();
					FusionPageBuilderApp.newContainerAdded = true;
				}

				elementID     = FusionPageBuilderViewManager.generateCid();
				defaultParams = fusionAllElements.fusion_builder_container.params;
				params        = {};

				// Process default options for shortcode.
				_.each( defaultParams, function( param )  {
					value = ( _.isObject( param.value ) ) ? param[ 'default' ] : param.value;
					params[ param.param_name ] = value;

					if ( 'dimension' === param.type && _.isObject( param.value ) ) {
						_.each( param.value, function( val, name )  {
							params[ name ] = val;
						} );
					}
				} );

				this.collection.add( [
					{
						type: 'fusion_builder_container',
						added: 'manually',
						element_type: 'fusion_builder_container',
						cid: elementID,
						params: params,
						view: this,
						created: 'auto'
					}
				] );

				// Make sure to add row to new container not current one.
				newContainer = FusionPageBuilderViewManager.getView( elementID );
				newContainer.addRow();

				FusionPageBuilderApp.scrollingContainers();
			},

			/**
			 * Adds a row.
			 *
			 * @since 2.0.0
			 * @return {void}
			 */
			addRow: function() {

				this.collection.add( [
					{
						type: 'fusion_builder_row',
						element_type: 'fusion_builder_row',
						added: 'manually',
						cid: FusionPageBuilderViewManager.generateCid(),
						parent: this.model.get( 'cid' ),
						view: this,
						element_content: ''
					}
				] );
			},

			/**
			 * Removes the container.
			 *
			 * @since 2.0.0
			 * @param {Object}         event - The event.
			 * @param {boolean|undefined} skip - Should we skip this?
			 * @param {bool} forceManually - Force manually, even if it's not an event, to update history and trigger content changes.
			 * @return {void}
			 */
			removeContainer: function( event, skip, forceManually ) {
				var rows;

				if ( event ) {
					event.preventDefault();
				}

				rows = FusionPageBuilderViewManager.getChildViews( this.model.get( 'cid' ) );

				_.each( rows, function( row ) {
					if ( 'fusion_builder_row' === row.model.get( 'type' ) ) {
						row.removeRow();
					}
				} );

				FusionPageBuilderViewManager.removeView( this.model.get( 'cid' ) );

				this.model.destroy();

				FusionEvents.trigger( 'fusion-element-removed', this.model.get( 'cid' ) );

				this.remove();

				// If its the last container add empty page view.
				if ( 1 > FusionPageBuilderViewManager.countElementsByType( 'fusion_builder_container' ) && 'undefined' === typeof skip ) {
					FusionPageBuilderApp.blankPage = true;
					FusionPageBuilderApp.clearBuilderLayout( true );
				}

				// If the column is deleted manually.
				if ( event || forceManually ) {

					FusionPageBuilderApp.scrollingContainers();

					FusionEvents.trigger( 'fusion-history-save-step', fusionBuilderText.deleted_section );
					FusionEvents.trigger( 'fusion-content-changed' );
				}
			},

			/**
			 * Clones a container.
			 *
			 * @since 2.0.0
			 * @param {Object} event - The event.
			 * @return {void}
			 */
			cloneContainer: function( event ) {
				var containerAttributes,
					$thisContainer;

				if ( event ) {
					event.preventDefault();
				}

				containerAttributes = jQuery.extend( true, {}, this.model.attributes );

				containerAttributes.cid = FusionPageBuilderViewManager.generateCid();
				containerAttributes.created = 'manually';
				containerAttributes.view = this;
				FusionPageBuilderApp.collection.add( containerAttributes );

				$thisContainer = this.$el;

				// Parse rows
				$thisContainer.find( '.fusion-builder-row-container:not(.fusion_builder_row_inner .fusion-builder-row-container)' ).each( function() {

					var thisRow = jQuery( this ),
						rowCID  = thisRow.data( 'cid' ),
						rowView,

						// Get model from collection by cid.
						row = FusionPageBuilderElements.find( function( model ) {
							return model.get( 'cid' ) == rowCID; // jshint ignore: line
						} ),

						// Clone row.
						rowAttributes = jQuery.extend( true, {}, row.attributes );

					rowAttributes.created = 'manually';
					rowAttributes.cid     = FusionPageBuilderViewManager.generateCid();
					rowAttributes.parent  = containerAttributes.cid;
					FusionPageBuilderApp.collection.add( rowAttributes );

					// Make sure spacing is calculated.
					rowView = FusionPageBuilderViewManager.getView( rowAttributes.cid );

					// Parse columns
					thisRow.find( '.fusion-builder-column-outer' ).each( function() {

						// Parse column elements
						var thisColumn = jQuery( this ),
							$columnCID = thisColumn.data( 'cid' ),

							// Get model from collection by cid
							column = FusionPageBuilderElements.find( function( model ) {
								return model.get( 'cid' ) == $columnCID; // jshint ignore: line
							} ),

							// Clone column
							columnAttributes = jQuery.extend( true, {}, column.attributes );

						columnAttributes.created = 'manually';
						columnAttributes.cid     = FusionPageBuilderViewManager.generateCid();
						columnAttributes.parent  = rowAttributes.cid;
						columnAttributes.from    = 'fusion_builder_container';
						columnAttributes.cloned  = true;

						// Don't need target element, position is defined from order.
						delete columnAttributes.targetElementPosition;

						FusionPageBuilderApp.collection.add( columnAttributes );

						// Find column elements
						thisColumn.find( '.fusion-builder-column-content:not( .fusion-nested-column-content )' ).children( '.fusion-builder-live-element, .fusion_builder_row_inner' ).each( function() {

							var thisElement,
								elementCID,
								element,
								elementAttributes,
								thisInnerRow,
								InnerRowCID,
								innerRowView;

							// Regular element
							if ( jQuery( this ).hasClass( 'fusion-builder-live-element' ) ) {

								thisElement = jQuery( this );
								elementCID = thisElement.data( 'cid' );

								// Get model from collection by cid
								element = FusionPageBuilderElements.find( function( model ) {
									return model.get( 'cid' ) == elementCID; // jshint ignore: line
								} );

								// Clone model attritubes
								elementAttributes         = jQuery.extend( true, {}, element.attributes );
								elementAttributes.created = 'manually';
								elementAttributes.cid     = FusionPageBuilderViewManager.generateCid();
								elementAttributes.parent  = columnAttributes.cid;
								elementAttributes.from    = 'fusion_builder_container';

								// Don't need target element, position is defined from order.
								delete elementAttributes.targetElementPosition;

								FusionPageBuilderApp.collection.add( elementAttributes );

							// Inner row element
							} else if ( jQuery( this ).hasClass( 'fusion_builder_row_inner' ) ) {

								thisInnerRow = jQuery( this );
								InnerRowCID = thisInnerRow.data( 'cid' );

								innerRowView = FusionPageBuilderViewManager.getView( InnerRowCID );

								// Clone inner row
								if ( 'undefined' !== typeof innerRowView ) {
									innerRowView.cloneNestedRow( '', columnAttributes.cid );
								}
							}
						} );
					} );

					// Update spacing for columns.
					rowView.setRowData();
				} );

				FusionPageBuilderApp.scrollingContainers();

				FusionEvents.trigger( 'fusion-history-save-step', fusionBuilderText.cloned_section );
				FusionEvents.trigger( 'fusion-content-changed' );
				this._refreshJs( containerAttributes.cid );
			},

			/**
			 * Adds a child view.
			 *
			 * @param {Object} element - The element model.
			 * @return {void}
			 */
			addChildView: function( element ) {

				var view,
					viewSettings = {
						model: element,
						collection: FusionPageBuilderElements
					};

				view = new FusionPageBuilder.RowView( viewSettings );

				FusionPageBuilderViewManager.addView( element.get( 'cid' ), view );

				if ( this.$el.find( '.fusion-builder-container-content' ).length ) {
					this.$el.find( '.fusion-builder-container-content' ).append( view.render().el );
				} else {
					this.$el.find( '> .fusion-builder-add-element' ).hide().end().append( view.render().el );
				}

				// Add parent view to inner rows that have been converted from shortcodes
				if ( 'manually' === element.get( 'created' ) && 'row_inner' === element.get( 'element_type' ) ) {
					element.set( 'view', FusionPageBuilderViewManager.getView( element.get( 'parent' ) ), { silent: true } );
				}
			},

			/**
			 * Appends model children.
			 *
			 * @since 2.0.0
			 * @return {void}
			 */
			appendChildren: function() {
				var self = this,
					cid,
					view;

				this.model.children.each( function( child ) {

					cid  = child.attributes.cid;
					view = FusionPageBuilderViewManager.getView( cid );

					self.$el.find( '.fusion-builder-container-content' ).append( view.$el );

					view.delegateEvents();
					view.delegateChildEvents();
					view.droppableColumn();
				} );
			},

			/**
			 * Triggers event to reinit sticky container properties.
			 *
			 * @since 3.0
			 * @return {void}
			 */
			reInitSticky: function() {
				jQuery( '#fb-preview' )[ 0 ].contentWindow.jQuery( 'body' ).trigger( 'fusion-reinit-sticky', this.model.attributes.cid );
			},

			/**
			 * Set empty spacing for legacy and re-render.
			 *
			 * @since 3.0.0
			 * @return {void}
			 */
			setEmptySpacing: function() {
				var params = this.model.get( 'params' );
				params.flex_column_spacing = '0px';
				this.model.set( 'params', params );
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
			onOptionChange: function( paramName, paramValue, event ) {
				var reInitDraggables	= false,
					dimensionType		= _.find( [ 'spacing_', 'margin_', 'padding_' ], function( type ) {
						return paramName.includes( type );
					} );

				// Reverted to history step or user entered value manually.
				if ( 'undefined' === typeof event || ( 'undefined' !== typeof event && ( 'change' !== event.type || ( 'change' === event.type && 'undefined' !== typeof event.srcElement ) ) ) ) {
					reInitDraggables = true;
				}

				if ( dimensionType ) {
					this.model.attributes.params[ paramName ] = paramValue;

					if ( true === reInitDraggables ) {
						if ( 'padding_' === dimensionType ) {
							this.destroyPaddingResizable();
							this.paddingDrag();
						} else {
							this.destroyMarginResizable();
							this.marginDrag();
						}

					}
				}

				switch ( paramName ) {
					case 'admin_label':
						this.model.attributes.params[ paramName ] = paramValue.replace( /[[\]]+/g, '' );
						break;

					// Changing between legacy and flex.
					case 'type':
						this.model.attributes.params[ paramName ] = paramValue;
						this.values.type                          = paramValue;
						this.reRenderRows();
						this.updateResponsiveSetup();
						break;

					// Sticky options.
					case 'sticky':
					case 'sticky_devices':
					case 'sticky_height':
					case 'sticky_offset':
					case 'sticky_transition_offset':
					case 'scroll_offset':
						this._reInitSticky();
						break;

					// Changing options which alter row if in flex mode.
					case 'flex_column_spacing':
						this._updateInnerStyles();
						break;

					case 'absolute':
						if ( 'on' === paramValue && ! this.$el.hasClass( 'fusion-builder-absolute-container-wrapper' ) ) {
							this.$el.addClass( 'fusion-builder-absolute-container-wrapper' );
						} else if ( 'off' === paramValue && this.$el.hasClass( 'fusion-builder-absolute-container-wrapper' ) ) {
							this.$el.removeClass( 'fusion-builder-absolute-container-wrapper' );
						}
						break;

					case 'render_logics':
						this.reRender();
						jQuery( '#fb-preview' )[ 0 ].contentWindow.jQuery( 'body' ).trigger( 'fusion-column-resized', this.model.attributes.cid );
						FusionEvents.trigger( 'fusion-column-resized' );
					break;
				}
			},

			/**
			 * Re-renders the rows.
			 *
			 * @since 3.0
			 * @return {void}
			 */
			reRenderRows: function() {
				var rows = FusionPageBuilderViewManager.getChildViews( this.model.get( 'cid' ) );

				// TODO: check this for performance.  Ideally we just update params, not re-render row.
				_.each( rows, function( row ) {
					row.modeChange();
				} );
			},

			/**
			 * Updates the styles inside container.
			 *
			 * @since 3.0
			 * @return {void}
			 */
			updateInnerStyles: function() {
				var rows = FusionPageBuilderViewManager.getChildViews( this.model.get( 'cid' ) );
				_.each( rows, function( row ) {
					row.updateInnerStyles();
				} );
			},

			/**
			 * Updates responsive setup.
			 *
			 * @since 3.0
			 * @return {void}
			 */
			updateResponsiveSetup: function() {
				var $settings = jQuery( '.fusion_builder_module_settings' );

				this.isFlex() ? $settings.addClass( 'has-flex' ) : $settings.removeClass( 'has-flex' );
			},

			/**
			 * Gets the contents of the container.
			 *
			 * @since 2.0.0
			 * @return {string}
			 */
			getContent: function() {
				var shortcode = '';

				shortcode += FusionPageBuilderApp.generateElementShortcode( this.$el, true );

				this.$el.find( '.fusion_builder_row' ).each( function() {
					var $thisRow = jQuery( this );

					shortcode += '[fusion_builder_row]';

					$thisRow.find( '.fusion-builder-column-outer' ).each( function() {
						var $thisColumn = jQuery( this ),
							columnCID   = $thisColumn.data( 'cid' ),
							columnView  = FusionPageBuilderViewManager.getView( columnCID );

						shortcode += columnView.getColumnContent();

					} );

					shortcode += '[/fusion_builder_row]';

				} );

				shortcode += '[/fusion_builder_container]';

				return shortcode;
			},

			/**
			 * Get the save label.
			 *
			 * @since 2.0.0
			 * @return {string}
			 */
			getSaveLabel: function() {
				return fusionBuilderText.save_section;
			},

			/**
			 * Returns the 'sections' string.
			 *
			 * @since 2.0.0
			 * @return {string}
			 */
			getCategory: function() {
				return 'sections';
			},

			/**
			 * Handle margin adjustments on drag.
			 *
			 * @since 2.0.0
			 * @return {void}
			 */
			marginDrag: function() {
				var $el            = this.$el,
					self           = this,
					directions     = { top: 's', bottom: 's' },
					parentWidth    = $el.closest( '.fusion-row, .fusion-builder-live-editor' ).width();

				if ( this.$el.hasClass( 'active' ) ) {
					return;
				}

				_.each( directions, function( handle, direction )  {
					var optionKey 		= FusionApp.getResponsiveOptionKey( 'margin_' + direction, self.isFlex() ),
						actualDimension = self.values[ optionKey ] || self.values[ 'margin_' + direction ] || 0,
						percentSpacing 	= false;

					percentSpacing  = actualDimension && actualDimension.includes( '%' );

					if ( percentSpacing ) {
						// Get actual dimension and set.
						actualDimension = ( parentWidth / 100 ) * parseFloat( actualDimension );
						$el.find( '.fusion-container-margin-' + direction ).css( 'height', actualDimension );
						if ( 'bottom' === direction && 20 > actualDimension ) {
							$el.find( '.fusion-container-margin-bottom, .fusion-container-padding-bottom' ).addClass( 'fusion-overlap' );
						}
					}

					$el.find( '.fusion-container-margin-' + direction ).css( 'display', 'block' );
					$el.find( '.fusion-container-margin-' + direction ).height( actualDimension );

					$el.find( '.fusion-container-margin-' + direction ).resizable( {
						handles: handle,
						minHeight: 0,
						minWidth: 0,
						grid: ( percentSpacing ) ? [ parentWidth / 100, 10 ] : '',
						create: function() {
							if ( 'bottom' === direction ) {
								if ( 20 > parseInt( actualDimension, 10 ) && ! percentSpacing ) {
									$el.find( '.fusion-container-margin-bottom, .fusion-container-padding-bottom' ).addClass( 'fusion-overlap' );
								} else {
									$el.find( '.fusion-container-margin-bottom, .fusion-container-padding-bottom' ).removeClass( 'fusion-overlap' );
								}
							}
						},
						resize: function( event, ui ) {
							var optionKey 		= FusionApp.getResponsiveOptionKey( 'margin_' + direction, self.isFlex() ),
								actualDimension = self.values[ optionKey ] || 0,
								percentSpacing 	= false,
								value 			= 'top' === direction || 'bottom' === direction ? ui.size.height : ui.size.width;

							jQuery( ui.element ).addClass( 'active' );

							// Recheck in case unit is changed in the modal.
							percentSpacing  = actualDimension && actualDimension.includes( '%' );

							jQuery( ui.element ).closest( '.fusion-builder-container' ).addClass( 'active' );

							value = 0 > value ? 0 : value;
							value = value + 'px';
							if ( percentSpacing ) {
								value = 0 === parseFloat( value ) ? '0%' : Math.round( parseFloat( parseFloat( value ) / ( parentWidth / 100 ) ) ) + '%';
							}

							// Bottom margin overlap
							if ( 'bottom' === direction ) {
								if ( 20 > ui.size.height ) {
									jQuery( ui.element ).addClass( 'fusion-overlap' );
									$el.find( '.fusion-container-padding-bottom' ).addClass( 'fusion-overlap' );
								} else {
									jQuery( ui.element ).removeClass( 'fusion-overlap' );
									$el.find( '.fusion-container-padding-bottom' ).removeClass( 'fusion-overlap' );
								}
							}

							// Legacy update.
							if ( ! self.isFlex() ) {
								$el.find( '.fusion-fullwidth' ).css( 'margin-' + direction, value );
							}

							jQuery( ui.element ).find( '.fusion-spacing-tooltip, .fusion-column-spacing' ).addClass( 'active' );
							jQuery( ui.element ).find( '.fusion-spacing-tooltip' ).text( value );

							// Update open modal.
							self.updateDragSettings( '#' + optionKey, value );
						},
						stop: function( event, ui ) {
							jQuery( ui.element ).removeClass( 'active' );
							jQuery( ui.element ).closest( '.fusion-builder-container' ).removeClass( 'active' );

							// Delete all spacing resizable within because parent width has changed.
							if ( jQuery( ui.element ).closest( '.fusion-builder-container' ).find( '.fusion-column-spacing .ui-resizable' ).length ) {
								jQuery( ui.element ).closest( '.fusion-builder-container' ).find( '.fusion-column-spacing .ui-resizable' ).resizable( 'destroy' );
							}
						}
					} );
				} );
			},

			/**
			 * Checks if the container needs to run through legacy conversion.
			 *
			 * @since 3.0.0
			 * @return {boolean}
			 */
			needsLegacyConversion: function() {
				var params = this.model.get( 'params' );
				return 'undefined' === typeof params.type;
			},

			/**
			 * Handle padding adjustments on drag.
			 *
			 * @since 2.0.0
			 * @return {void}
			 */
			paddingDrag: function() {
				var $el         = this.$el,
					self        = this,
					directions  = { top: 's', right: 'w', bottom: 's', left: 'e' },
					parentWidth = $el.closest( '.fusion-row, .fusion-builder-live-editor' ).width(),
					defaults;

				if ( this.$el.hasClass( 'active' ) ) {
					return;
				}

				defaults = this.defaults;

				_.each( directions, function( handle, direction )  {
					var actualDimension,
					previewSize = FusionApp.getPreviewWindowSize(),
					percentSpacing 	= false;

					if ( 'small' === previewSize ) {
						actualDimension = self.values[ 'padding_' + direction + '_small' ];
					}
					if ( ! actualDimension && [ 'small', 'medium' ].includes( previewSize ) ) {
						actualDimension = self.values[ 'padding_' + direction + '_medium' ];
					}
					if ( ! actualDimension ) {
						actualDimension = self.values[ 'padding_' + direction ];
					}
					actualDimension = actualDimension || defaults[ 'padding_' + direction ] || 0;

					// Check if using a percentage.
					percentSpacing  = actualDimension && actualDimension.includes( '%' );

					if ( percentSpacing ) {

						// Get actual dimension and set.
						actualDimension = ( parentWidth / 100 ) * parseFloat( actualDimension );
						if ( 'top' === direction || 'bottom' === direction ) {
							$el.find( '.fusion-container-padding-' + direction ).css( 'height', actualDimension );
						} else {
							$el.find( '.fusion-container-padding-' + direction ).css( 'width', actualDimension );
						}
						if ( 'top' === direction && 20 > actualDimension ) {
							$el.find( '.fusion-container-margin-top, .fusion-container-padding-top' ).addClass( 'fusion-overlap' );
						}
					}

					$el.find( '.fusion-container-padding-' + direction ).css( 'display', 'block' );
					if ( 'top' === direction || 'bottom' === direction ) {
						$el.find( '.fusion-container-padding-' + direction ).height( actualDimension );
					} else {
						$el.find( '.fusion-container-padding-' + direction ).width( actualDimension );
					}

					$el.find( '.fusion-container-padding-' + direction ).resizable( {
						handles: handle,
						minHeight: 0,
						minWidth: 0,

						create: function() {
							if ( 'top' === direction ) {
								if ( 20 > parseInt( actualDimension, 10 ) && ! percentSpacing ) {
									$el.find( '.fusion-container-margin-top, .fusion-container-padding-top' ).addClass( 'fusion-overlap' );
								} else {
									$el.find( '.fusion-container-margin-top, .fusion-container-padding-top' ).removeClass( 'fusion-overlap' );
								}
							}
						},

						resize: function( event, ui ) {
							var optionKey 		= FusionApp.getResponsiveOptionKey( 'padding_' + direction, self.isFlex() ),
								actualDimension = self.values[ optionKey ],
								percentSpacing 	= false,
								value 			= 'top' === direction || 'bottom' === direction ? ui.size.height : ui.size.width;

							percentSpacing  = actualDimension && actualDimension.includes( '%' );

							jQuery( ui.element ).addClass( 'active' );
							jQuery( ui.element ).closest( '.fusion-builder-container' ).addClass( 'active' );

							value = 0 > value ? 0 : value;
							value = value + 'px';
							if ( percentSpacing ) {
								value = 0 === parseFloat( value ) ? '0%' : Math.round( parseFloat( parseFloat( value ) / ( parentWidth / 100 ) ) ) + '%';
							}

							// Top padding overlap
							if ( 'top' === direction ) {
								if ( 20 > ui.size.height ) {
									jQuery( ui.element ).addClass( 'fusion-overlap' );
									$el.find( '.fusion-container-margin-top' ).addClass( 'fusion-overlap' );
								} else {
									jQuery( ui.element ).removeClass( 'fusion-overlap' );
									$el.find( '.fusion-container-margin-top' ).removeClass( 'fusion-overlap' );
								}
							}

							// Set values and width.
							$el.children( '.fusion-fullwidth' ).css( '--awb-' + optionKey.replaceAll( '_', '-' ), value );

							jQuery( ui.element ).find( '.fusion-spacing-tooltip, .fusion-column-spacing' ).addClass( 'active' );
							jQuery( ui.element ).find( '.fusion-spacing-tooltip' ).text( value );

							// Update open modal.
							self.updateDragSettings( '#' + optionKey, value );
						},
						stop: function( event, ui ) {
							jQuery( ui.element ).removeClass( 'active' );
							jQuery( ui.element ).closest( '.fusion-builder-container' ).removeClass( 'active' );

							// Delete all spacing resizable within because parent width has changed.
							if ( jQuery( ui.element ).closest( '.fusion-builder-container' ).find( '.fusion-column-spacing .ui-resizable' ).length ) {
								jQuery( ui.element ).closest( '.fusion-builder-container' ).find( '.fusion-column-spacing .ui-resizable' ).resizable( 'destroy' );
							}
						}
					} );
				} );
			},

			/**
			 * Destroy container resizable.
			 *
			 * @since 2.0.0
			 * @return {void}
			 */
			destroyResizable: function() {
				this.destroyMarginResizable();
				this.destroyPaddingResizable();
			},

			/**
			 * Destroy container margin resizable.
			 *
			 * @since 2.0.0
			 * @return {void}
			 */
			destroyMarginResizable: function() {
				var $containerSpacer = this.$el.find( '.fusion-container-margin-top, .fusion-container-margin-bottom' );

				jQuery.each( $containerSpacer, function( index, spacer ) {
					if ( jQuery( spacer ).hasClass( 'ui-resizable' ) ) {
						jQuery( spacer ).resizable( 'destroy' );
						jQuery( spacer ).hide();
					}
				} );
			},

			/**
			 * Destroy container padding resizable.
			 *
			 * @since 2.0.0
			 * @return {void}
			 */
			destroyPaddingResizable: function() {
				var $containerSpacer = this.$el.find( '.fusion-container-padding-top, .fusion-container-padding-right, .fusion-container-padding-bottom, .fusion-container-padding-left' );

				jQuery.each( $containerSpacer, function( index, spacer ) {
					if ( jQuery( spacer ).hasClass( 'ui-resizable' ) ) {
						jQuery( spacer ).resizable( 'destroy' );
						jQuery( spacer ).hide();
					}
				} );
			},

			/**
			 * Filter out DOM before patching.
			 *
			 * @since 2.0.0
			 * @return {void}
			 */
			patcherFilter: function( diff ) {
				var filteredDiff = [],
					self         = this;

				self.reInitDraggables = false;

				_.each( diff, function( info ) {
					if ( 'removeElement' === info.action ) {
						if ( 'undefined' !== typeof info.element.attributes && 'undefined' !== typeof info.element.attributes[ 'class' ] && -1 !== info.element.attributes[ 'class' ].indexOf( 'fusion-fullwidth' ) ) {
							self.reInitDraggables = true;
							filteredDiff.push( info );
						} else if ( 'undefined' !== typeof info.element.attributes && 'undefined' !== typeof info.element.attributes[ 'class' ] && -1 !== info.element.attributes[ 'class' ].indexOf( 'fusion-container-spacing' ) ) {

							// Ignore.
						} else {
							filteredDiff.push( info );
						}
					} else if ( 'addElement' === info.action ) {
						if ( 'undefined' !== typeof info.element.attributes && 'undefined' !== typeof info.element.attributes[ 'class' ] && -1 !== info.element.attributes[ 'class' ].indexOf( 'fusion-container-spacing' ) ) {

							// Ignore.
						} else {
							filteredDiff.push( info );
						}
					} else {
						filteredDiff.push( info );
					}
				} );

				return filteredDiff;
			},

			publish: function( event ) {
				var cid    = jQuery( event.currentTarget ).data( 'cid' ),
					view   = FusionPageBuilderViewManager.getView( cid ),
					params = view.model.get( 'params' );

				FusionApp.confirmationPopup( {
					title: fusionBuilderText.container_publish,
					content: fusionBuilderText.are_you_sure_you_want_to_publish,
					actions: [
						{
							label: fusionBuilderText.no,
							classes: 'no',
							callback: function() {
								FusionApp.confirmationPopup( {
									action: 'hide'
								} );
							}
						},
						{
							label: fusionBuilderText.yes,
							classes: 'yes',
							callback: function() {
								params.status = 'published';
								view.model.set( 'params', params );
								view.$el.find( 'a[data-cid="' + cid + '"].fusion-builder-publish-tooltip' ).remove();

								FusionEvents.trigger( 'fusion-history-turn-on-tracking' );
								FusionEvents.trigger( 'fusion-history-save-step', fusionBuilderText.container_published );

								FusionEvents.trigger( 'fusion-content-changed' );
								FusionApp.confirmationPopup( {
									action: 'hide'
								} );
							}
						}
					]
				} );
			},

			unglobalize: function( event ) {
				var cid    = jQuery( event.currentTarget ).data( 'cid' ),
					view   = FusionPageBuilderViewManager.getView( cid ),
					params = view.model.get( 'params' );

				event.preventDefault();

				FusionApp.confirmationPopup( {

					title: fusionBuilderText.remove_global,
					content: fusionBuilderText.are_you_sure_you_want_to_remove_global,
					actions: [
						{
							label: fusionBuilderText.no,
							classes: 'no',
							callback: function() {
								FusionApp.confirmationPopup( {
									action: 'hide'
								} );
							}
						},
						{
							label: fusionBuilderText.yes,
							classes: 'yes',
							callback: function() {

								// Remove global attributes.
								delete params.fusion_global;
								view.model.set( 'params', params );
								view.$el.removeClass( 'fusion-global-container fusion-global-column fusion-global-nested-row fusion-global-element fusion-global-parent-element' );
								view.$el.find( 'a[data-cid="' + cid + '"].fusion-builder-unglobal-tooltip' ).remove();
								view.$el.removeAttr( 'fusion-global-layout' );

								FusionEvents.trigger( 'fusion-history-turn-on-tracking' );
								FusionEvents.trigger( 'fusion-history-save-step', fusionBuilderText.removed_global );

								FusionEvents.trigger( 'fusion-content-changed' );
								FusionApp.confirmationPopup( {
									action: 'hide'
								} );
							}
						}
					]
				} );
			},

			/**
			 * Fires when preview are is resized.
			 *
			 * @since 3.0
			 * @return {void}
			 */
			onPreviewResize: function() {

				if ( ! this.isFlex() ) {
					return;
				}

				if ( this.$el.hasClass( 'fusion-builder-element-edited' ) ) {
					this.updateDragHandles();
				}

			},

			/**
			 * Updates column sizes controls.
			 *
			 * @since 3.0
			 * @return {void}
			 */
			updateDragHandles: function() {
				this.destroyResizable();
				this.marginDrag();
				this.paddingDrag();
			},

			/**
			 * Runs just after render on cancel.
			 *
			 * @since 3.5
			 * @return null
			 */
			beforeGenerateShortcode: function() {
				var elementType = this.model.get( 'element_type' ),
					options     = fusionAllElements[ elementType ].params,
					values      = jQuery.extend( true, {}, fusionAllElements[ elementType ].defaults, _.fusionCleanParameters( this.model.get( 'params' ) ) );

				if ( 'object' !== typeof options ) {
					return;
				}

				// If images needs replaced lets check element to see if we have media being used to add to object.
				if ( 'undefined' !== typeof FusionApp.data.replaceAssets && FusionApp.data.replaceAssets && ( 'undefined' !== typeof FusionApp.data.fusion_element_type || 'fusion_template' === FusionApp.getPost( 'post_type' ) ) ) {

					this.mapStudioImages( options, values );

					if ( '' !== values.video_mp4 ) {
						// If its not within object already, add it.
						if ( 'undefined' === typeof FusionPageBuilderApp.mediaMap.videos[ values.video_mp4 ] ) {
							FusionPageBuilderApp.mediaMap.videos[ values.video_mp4 ] = true;
						}
					}
				}
			},

			/**
			 * check if String is JSON string.
			 *
			 * @since 3.7
			 * @return boolean
			 */
			IsJsonString: function( str ) {
				try {
					const json = JSON.parse( str );
					return ( 'object' === typeof json );
				} catch ( e ) {
					return false;
				}
			},

			/**
			 * Get render logics devices.
			 *
			 * @since 3.7
			 * @return boolean
			 */
			getRenderLogicsDevices: function( value ) {
				value = value || this.values.render_logics;
				let renderLogics = value && this.IsJsonString( atob( value ) ) ? JSON.parse( atob( value ) ) : [];

				// Get device Render logics only.
				renderLogics = renderLogics.filter( ( r ) => 'device_type' === r.field );

				return renderLogics;
			}

		} );
	} );
}( jQuery ) );
