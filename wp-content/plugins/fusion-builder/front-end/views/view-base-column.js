/* global FusionApp, fusionBuilderText, fusionAllElements, cssua, FusionPageBuilderViewManager, FusionPageBuilderApp, FusionEvents, fusionSettings */
/* eslint no-unused-vars: 0 */
/* eslint no-shadow: 0 */
var FusionPageBuilder = FusionPageBuilder || {};

( function() {

	jQuery( document ).ready( function() {

		// Nested Column View
		FusionPageBuilder.BaseColumnView = FusionPageBuilder.BaseView.extend( {

			/**
			 * On init for both regular and nested columns.
			 *
			 * @since 3.0
			 * @return null
			 */
			baseColumnInit: function() {
				this.model.children = new FusionPageBuilder.Collection();

				this.listenTo( FusionEvents, 'fusion-param-changed-' + this.model.get( 'cid' ), this.onOptionChange );
				this.listenTo( this.model.children, 'add', this.addChildView );

				// Responsive control updates on resize.
				this.listenTo( FusionEvents, 'fusion-preview-viewport-update', this.onPreviewResize );

				this._triggerCallback = _.debounce( _.bind( this.triggerCallback, this ), 200 );
				this._toolTipHide     = _.debounce( _.bind( this.toolTipHide, this ), 500 );
				this._refreshJs       = _.debounce( _.bind( this.refreshJs, this ), 300 );
				this._equalHeights    = _.debounce( _.bind( this.equalHeights, this ), 300 );

				this.deprecatedParams();

				// Hold the DOM elements for resizables.
				this.marginResize  = {};
				this.paddingResize = {};
			},

			/**
			 * Runs before view DOM is patched.
			 *
			 * @since 2.0.0
			 * @return null
			 */
			beforePatch: function() {}, // eslint-disable-line no-empty-function

			/**
			 * Runs after view DOM is patched.
			 *
			 * @since 2.0.0
			 * @return null
			 */
			afterPatch: function() {
				var self = this;

				if ( 'undefined' !== typeof this.model.attributes.selectors ) {
					if ( this.model.get( 'dragging' ) ) {
						this.model.attributes.selectors.style      += ';display: none;';
						this.model.attributes.selectors[ 'class' ] += ' ignore-me-column';
					}

					this.$el.removeAttr( 'data-animationType' );
					this.$el.removeAttr( 'data-animationDuration' );
					this.$el.removeAttr( 'data-animationOffset' );

					this.setElementAttributes( this.$el, this.model.attributes.selectors );
				}

				if ( this.forceAppendChildren ) {
					this.appendChildren();
					this.forceAppendChildren = false;
				}

				setTimeout( function() {
					self.droppableColumn();
				}, 300 );

				this._refreshJs();
			},

			/**
			 * Delegates multiple child elements.
			 *
			 * @since 2.0.0
			 * @return {void}
			 */
			delegateChildEvents: function() {
				var cid,
					view;

				this.model.children.each( function( child ) {
					cid  = child.attributes.cid;
					view = FusionPageBuilderViewManager.getView( cid );

					view.delegateEvents();

					// Re init for elements.
					if ( 'function' === typeof view.droppableElement ) {
						view.droppableElement();
					}

					// Re init for nested row.
					if ( 'function' === typeof view.droppableColumn ) {
						view.droppableColumn();
					}

					// Multi elements
					if ( 'undefined' !== typeof view.model.get( 'multi' ) && 'multi_element_parent' === view.model.get( 'multi' ) ) {
						view.delegateChildEvents();
						view.sortableChildren();
					}
				} );
			},

			updateInnerStyles: function() {
				this.setArgs();
				this.validateArgs();
				this.setExtraArgs();
				this.setColumnMapData();
				this.setResponsiveColumnStyles();
				this.$el.find( '.fusion-column-responsive-styles' ).last().html( this.responsiveStyles );

				const attr = this.buildAttr();
				this.$el.attr( 'style', attr.style );
				this.delegateChildEvents();
			},

			/**
			 * Checks if the width is custom.
			 *
			 * @since 2.1
			 * @return {bool}
			 */
			isCustomWidth: function ( width ) {
				if ( 'string' === typeof width && ( width.includes( 'px' ) || width.includes( 'calc' ) ) ) {
					return true;
				}
					return false;

			},

			/**
			 * Updates now deprecated params and adds BC checks.
			 *
			 * @since 2.1
			 * @return {void}
			 */
			deprecatedParams: function() {
				var params               = this.model.get( 'params' ),
					alphaBackgroundColor = 1,
					radiaDirectionsNew   = { 'bottom': 'center bottom', 'bottom center': 'center bottom', 'left': 'left center', 'right': 'right center', 'top': 'center top', 'center': 'center center', 'center left': 'left center' },
					borderSize;

				// Correct radial direction params.
				if ( 'undefined' !== typeof params.radial_direction && ( params.radial_direction in radiaDirectionsNew ) ) {
					params.radial_direction = radiaDirectionsNew[ params.radial_direction ];
				}

				// No align self set but ignore equal heights is on.
				if ( 'undefined' === typeof params.align_self && 'undefined' !== typeof params.min_height && 'none' === params.min_height ) {
					params.align_self = 'flex-start';
				}

				// No align content set, but legacy center_content is on.
				if ( 'undefined' === typeof params.align_content && 'undefined' !== typeof params.center_content && 'yes' === params.center_content ) {
					params.align_content = 'center';
				}

				// Border sizes.
				if ( ( 'undefined' === typeof params.border_sizes_top || 'undefined' === typeof params.border_sizes_bottom || 'undefined' === typeof params.border_sizes_left || 'undefined' === typeof params.border_sizes_right ) && 'string' === typeof params.border_size ) {
					if ( 'all' === params.border_position ) {
						borderSize = _.fusionGetValueWithUnit( params.border_size );
						params.border_sizes_top    = borderSize;
						params.border_sizes_bottom = borderSize;
						params.border_sizes_left   = borderSize;
						params.border_sizes_right  = borderSize;
					} else {
						params[ 'border_sizes_' + params.border_position ] = _.fusionGetValueWithUnit( params.border_size );
					}
					delete params.border_size;
				}

				this.model.set( 'params', params );
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
					parentWidth    = 'fusion_builder_column_inner' === this.model.get( 'type' ) ? $el.closest( '.fusion-builder-row-container-inner' ).width() : $el.closest( '.fusion-row' ).width(),
					isFlex         = false,
					widthType	   = self.getVisibleWidth(),
					$spacers       = this.$el.find( '> .fusion-column-wrapper > .fusion-column-spacers, > .fusion-column-margins' );

				// If flex we also use left and right.
				if ( 'undefined' !== typeof this.isFlex && true === this.isFlex ) {
					directions = { top: 's', bottom: 's', left: 'e', right: 'w' };
					isFlex     = true;
				}

				// If class is set, do not init again.
				if ( this.$el.hasClass( 'resizable-active' ) ) {
					return;
				}

				// Single post card, margin is not used.
				if ( 'fusion_builder_column_inner' !== this.model.get( 'type' ) && 'post_cards' === FusionApp.data.fusion_element_type ) {
					return;
				}

				_.each( directions, function( handle, direction )  {
					var optionKey       = FusionApp.getResponsiveOptionKey( 'top' === direction || 'bottom' === direction ? 'margin_' + direction : 'spacing_' + direction, self.isFlex ),
						actualDimension = self.values[ optionKey ],
						percentSpacing  = false;

					// No value, use half column spacing (not upsized).
					if ( isFlex && ( ! actualDimension || '' === actualDimension ) && ( 'top' === direction || 'bottom' === direction ) ) {
						if ( self.values[ 'margin_' + direction ] ) {
							actualDimension = self.values[ 'margin_' + direction ];
						}
						if ( optionKey.includes( 'small' ) && '' !== self.values[ 'margin_' + direction + '_medium' ] ) {
							actualDimension = self.values[ 'margin_' + direction + '_medium' ];
						}
					}
					if ( ! actualDimension ) {
						actualDimension = self.getHalfSpacing();
					}

					// Check if using a percentage.
					percentSpacing = -1 !== actualDimension.indexOf( '%' );

					// If percentage, get the actual px dimension.
					if ( percentSpacing ) {
						actualDimension = ( parentWidth / 100 ) * parseFloat( actualDimension );
					}

					// Overlap checks.
					if ( 'bottom' === direction ) {
						if ( 20 > parseInt( actualDimension, 10 ) ) {
							$spacers.find( '.fusion-column-margin-bottom, .fusion-column-padding-bottom' ).addClass( 'fusion-overlap' );
						} else {
							$spacers.find( '.fusion-column-margin-bottom, .fusion-column-padding-bottom' ).removeClass( 'fusion-overlap' );
						}
					}

					// Find element and display it.
					self.marginResize[ direction ] = $spacers.find( '.fusion-column-margin-' + direction );
					self.marginResize[ direction ].css( 'display', 'block' );

					// Set initial width or height.
					if ( 'left' === direction || 'right' === direction ) {
						if ( percentSpacing && 'custom' === widthType ) {
							self.marginResize[ direction ].width( 0 );
						} else {
							self.marginResize[ direction ].width( actualDimension );
						}

					} else {
						self.marginResize[ direction ].height( actualDimension );
					}

					// Init resizable.
					self.marginResize[ direction ].resizable( {
						handles: handle,
						minHeight: 0,
						minWidth: 0,
						grid: ( percentSpacing ) ? [ parentWidth / 1000, 10 ] : '',
						resize: function( event, ui ) {
							var optionKey      = FusionApp.getResponsiveOptionKey( 'top' === direction || 'bottom' === direction ? 'margin_' + direction : 'spacing_' + direction, self.isFlex ),
								percentSpacing = 'undefined' !== typeof self.values[ optionKey ] ? -1 !== self.values[ optionKey ].indexOf( '%' ) : false,
								$resizer       = jQuery( ui.element ),
								value          = 'top' === direction || 'bottom' === direction ? ui.size.height : ui.size.width;

							// If nothing is set and left and right, check row column spacing
							if ( '' === self.values[ optionKey ] && ( 'left' === direction || 'right' === direction ) ) {
								percentSpacing =  -1 !== self.getHalfSpacing().indexOf( '%' );
							}

							// Active class to prevent multiple inits.
							$resizer.closest( '.fusion-builder-column:not( .resizable-active )' ).addClass( 'resizable-active' );

							// Work out value.
							value = 0 > value ? 0 : value;
							value = value + 'px';
							if ( percentSpacing ) {
								value = 0 === parseFloat( value ) ? '0%' : ( Math.round( parseFloat( parseFloat( value ) / ( parentWidth / 1000 ) ) ) / 10 ) + '%';
							}

							// Bottom margin overlap
							if ( 'bottom' === direction ) {
								if ( 20 > ui.size.height ) {
									$resizer.addClass( 'fusion-overlap' );
									$spacers.find( '.fusion-column-padding-bottom' ).addClass( 'fusion-overlap' );
								} else {
									$resizer.removeClass( 'fusion-overlap' );
									$spacers.find( '.fusion-column-padding-bottom' ).removeClass( 'fusion-overlap' );
								}
							}

							// Display tooltip.
							$resizer.find( '.fusion-spacing-tooltip, .fusion-column-spacing' ).addClass( 'active' );
							$resizer.find( '.fusion-spacing-tooltip' ).text( value );

							// Update open settings modal.
							self.updateDragSettings( '#' + optionKey, value );
						},
						stop: function( event, ui ) {
							var $resizer = jQuery( ui.element );

							$resizer.closest( '.fusion-builder-column' ).removeClass( 'resizable-active' );
							$resizer.find( '.fusion-spacing-tooltip, .fusion-column-spacing' ).removeClass( 'active' );

							// Delete all spacing resizable within because parent width has changed.
							if ( $resizer.find( '.fusion-builder-column-inner'  ).find( '.fusion-element-spacing .ui-resizable' ).length ) {
								$resizer.closest( '.fusion-builder-column-inner'  ).find( '.fusion-element-spacing .ui-resizable' ).resizable( 'destroy' );
							}
						}
					} );
				} );
			},

			/**
			 * Handle padding adjustments on drag.
			 *
			 * @since 2.0.0
			 * @return {void}
			 */
			paddingDrag: function() {
				var $el            = this.$el,
					self           = this,
					directions     = { top: 's', right: 'w', bottom: 's', left: 'e' },
					percentSpacing = false,
					parentWidth    = $el.find( '> .fusion-column-wrapper' ).first().width(),
					$spacers	   = this.$el.find( '> .fusion-column-wrapper > .fusion-column-spacers, > .fusion-column-margins' ),
					valueAllowed   = ( parentWidth / 100 ),
					isFlex         = false,
					value,
					actualDimension;

				if ( this.$el.hasClass( 'resizable-active' ) ) {
					return;
				}

				if ( 'undefined' !== typeof this.isFlex && true === this.isFlex ) {
					isFlex = true;
				}

				_.each( directions, function( handle, direction )  {
					var optionKey       = FusionApp.getResponsiveOptionKey( 'padding_' + direction, isFlex ),
						actualDimension = self.values[ optionKey ] || self.values[ 'padding_' + direction ],
						percentSpacing  = false;

					if ( ! isFlex && ! actualDimension ) {
						actualDimension = '0px';
					}

					// Check if using a percentage.
					percentSpacing = 'undefined' !== typeof actualDimension ? -1 !== actualDimension.indexOf( '%' ) : false;

					if ( percentSpacing ) {

						// Get actual dimension and set.
						actualDimension = ( parentWidth / 100 ) * parseFloat( actualDimension );
					}

					if ( 'bottom' !== direction && ( isFlex || 'top' === direction ) ) {
						if ( 20 > parseInt( actualDimension, 10 ) ) {
							$spacers.find( '.fusion-column-margin-' + direction + ', .fusion-column-padding-' + direction ).addClass( 'fusion-overlap' );
						} else {
							$spacers.find( '.fusion-column-margin-' + direction + ', .fusion-column-padding-' + direction ).removeClass( 'fusion-overlap' );
						}
					}

					self.paddingResize[ direction ] = $spacers.find( '.fusion-column-padding-' + direction );
					self.paddingResize[ direction ].css( 'display', 'block' );
					if ( 'top' === direction || 'bottom' === direction ) {
						self.paddingResize[ direction ].height( actualDimension );
					} else {
						self.paddingResize[ direction ].width( actualDimension );
					}

					self.paddingResize[ direction ].resizable( {
						handles: handle,
						minHeight: 0,
						minWidth: 0,

						resize: function( event, ui ) {
							var optionKey 		= FusionApp.getResponsiveOptionKey( 'padding_' + direction, isFlex ),
								actualDimension = self.values[ optionKey ],
								dimension 		= 'top' === direction || 'bottom' === direction ? 'height' : 'width',
								$resizer  		= jQuery( ui.element );

							// Recheck in case unit is changed in the modal.
							percentSpacing = 'undefined' !== typeof actualDimension ? -1 !== actualDimension.indexOf( '%' ) : false;

							// Force to grid amount.
							if ( percentSpacing ) {
								ui.size[ dimension ] = Math.round( ui.size[ dimension ] / valueAllowed ) * valueAllowed;
							}

							$resizer.closest( '.fusion-builder-column' ).addClass( 'resizable-active' );

							// Change format of value.
							value = ui.size[ dimension ];
							value = 0 > value ? 0 : value;
							value = value + 'px';
							if ( percentSpacing ) {
								value = 0 === parseFloat( value ) ? '0%' : Math.round( parseFloat( parseFloat( value ) / ( parentWidth / 100 ) ) ) + '%';
							}

							// Overlaps top left, right.
							if ( 'top' === direction ) {
								if ( 20 > ui.size.height ) {
									$resizer.addClass( 'fusion-overlap' );
									$spacers.find( '.fusion-column-margin-top' ).addClass( 'fusion-overlap' );
								} else {
									$resizer.removeClass( 'fusion-overlap' );
									$spacers.find( '.fusion-column-margin-top' ).removeClass( 'fusion-overlap' );
								}
							} else if ( 'right' === direction ) {
								if ( 20 > ui.size.width && ( isFlex || 20 > $spacers.find( '.fusion-column-spacing .fusion-spacing-value' ).width() ) ) {
									$resizer.addClass( 'fusion-overlap' );
									$spacers.find( '.fusion-column-spacing, .fusion-column-margin-right' ).addClass( 'fusion-overlap' );
								} else {
									$resizer.removeClass( 'fusion-overlap' );
									$spacers.find( '.fusion-column-spacing, .fusion-column-margin-right' ).removeClass( 'fusion-overlap' );
								}
							} else if ( 'left' === direction && isFlex ) {
								if ( 20 > ui.size.width ) {
									$resizer.addClass( 'fusion-overlap' );
									$spacers.find( '.fusion-column-margin-left' ).addClass( 'fusion-overlap' );
								} else {
									$resizer.removeClass( 'fusion-overlap' );
									$spacers.find( '.fusion-column-margin-left' ).removeClass( 'fusion-overlap' );
								}
							}

							// Set values.
							$resizer.find( '.fusion-spacing-tooltip, .fusion-column-spacing' ).addClass( 'active' );
							$resizer.find( '.fusion-spacing-tooltip' ).text( value );

							// Update open modal.
							self.updateDragSettings( '#' + optionKey, value );
						},
						stop: function( event, ui ) {
							var $resizer = jQuery( ui.element );

							$resizer.closest( '.fusion-builder-column' ).removeClass( 'resizable-active' );
							$resizer.find( '.fusion-spacing-tooltip, .fusion-column-spacing' ).removeClass( 'active' );

							// Delete all spacing resizable within because parent width has changed.
							if ( $resizer.find( '.fusion-builder-column-inner'  ).find( '.fusion-element-spacing .ui-resizable' ).length ) {
								$resizer.closest( '.fusion-builder-column-inner'  ).find( '.fusion-element-spacing .ui-resizable' ).resizable( 'destroy' );
							}
						}
					} );
				} );
			},

			/**
			 * Destroy column's resizables.
			 *
			 * @since 2.0.0
			 * @return {void}
			 */
			destroyResizable: function() {
				this.destroySpacingResizable();
				this.destroyMarginResizable();
				this.destroyPaddingResizable();
			},

			/**
			 * Destroy column's spacing resizable.
			 *
			 * @since 2.0.0
			 * @return {void}
			 */
			destroySpacingResizable: function() {
				var $columnSpacer;

				$columnSpacer = this.$el.find( '> .fusion-column-spacing .fusion-spacing-value' );

				if ( $columnSpacer.hasClass( 'ui-resizable' ) ) {
					$columnSpacer.resizable( 'destroy' );
					$columnSpacer.hide();
					this.columnSpacer = false;
				}
			},

			/**
			 * Destroy column's margin resizable.
			 *
			 * @since 2.0.0
			 * @return {void}
			 */
			destroyMarginResizable: function() {
				_.each( this.marginResize, function( $marginResize ) {
					if ( $marginResize.length && $marginResize.hasClass( 'ui-resizable' ) &&  -1 !== $marginResize.attr( 'class' ).indexOf( 'fusion-column-margin-' ) ) {
						$marginResize.resizable( 'destroy' );
						$marginResize.hide();
					}
				} );

			},

			/**
			 * Destroy column's padding resizable.
			 *
			 * @since 2.0.0
			 * @return {void}
			 */
			destroyPaddingResizable: function() {

				_.each( this.paddingResize, function( $paddingResize ) {
					if ( $paddingResize.length && $paddingResize.hasClass( 'ui-resizable' ) &&  -1 !== $paddingResize.attr( 'class' ).indexOf( 'fusion-column-padding-' ) ) {
						$paddingResize.resizable( 'destroy' );
						$paddingResize.hide();
					}
				} );
			},

			/**
			 * Changes the column spacing.
			 *
			 * @since 2.0.0
			 * @param {Object} event - The event.
			 * @return {void}
			 */
			columnSpacing: function( event ) {
				var percentSpacing  = false,
					$el             = this.$el,
					self            = this,
					$spacers        = this.$el.find( '> .fusion-column-wrapper > .fusion-column-spacers' ),
					marginDirection = FusionPageBuilderApp.$el.hasClass( 'rtl' ) ? 'left' : 'right',
					parentWidth,
					marginRight,
					container,
					columnSpacing,
					existingSpacing,
					modelSpacing,
					$columnSpacer,
					maxWidth,
					rightPadding,
					rightOverlap;

				// We don't need column spacing when flex container is used.
				if ( 'undefined' !== typeof this.isFlex && true === this.isFlex ) {
					return;
				}

				$columnSpacer = this.$el.find( '> .fusion-column-spacing .fusion-spacing-value' );

				if ( event && 'event' !== event ) {
					event.preventDefault();
				}

				// If responsive mode and columns are 1/1 hide and return.
				if ( jQuery( '#fb-preview' ).width() < FusionApp.settings.content_break_point && FusionApp.settings.responsive ) {
					$columnSpacer.hide();
					return;
				}

				$columnSpacer.show();

				// If this is the last column in a virtual row, then no handles.
				if ( this.$el.hasClass( 'fusion-column-last' ) ) {
					return;
				}

				// No resizer for fallback method.
				if ( 'yes' === this.model.attributes.params.spacing || 'no' === this.model.attributes.params.spacing ) {
					return;
				}

				existingSpacing = this.model.attributes.params.spacing;
				if ( 'undefined' === typeof existingSpacing || '' === existingSpacing ) {
					existingSpacing = '4%';
				}
				if ( 'no' === existingSpacing ) {
					existingSpacing = '0';
				}

				// Already created spacer and not %, no need to continue.
				if ( this.columnSpacer && -1 === existingSpacing.indexOf( '%' ) ) {
					return;
				}

				// Get the container width.
				container = FusionPageBuilderViewManager.getView( this.model.get( 'parent' ) );

				if ( 'fusion_builder_column_inner' === this.model.get( 'type' ) ) {
					parentWidth = container.$el.find( '.fusion-builder-row-container-inner' ).width();
				} else {
					parentWidth = container.$el.find( '.fusion-row' ).width();
				}

				// Already created spacer, % is being used and width is the same, no need to continue.
				if ( this.columnSpacer && parentWidth === this.parentWidth ) {
					return;
				}

				// Store parent width to compare.
				this.parentWidth = parentWidth;

				// Get the column right margin.  In real usage use the model attribute.
				columnSpacing = existingSpacing;
				marginRight   = existingSpacing;

				// Set column spacing width.
				if ( -1 !== existingSpacing.indexOf( '%' ) ) {
					percentSpacing = true;
					marginRight    = parseFloat( marginRight ) / 100.0;
					columnSpacing  = marginRight * parentWidth;
				}

				// Set max width spacing.
				maxWidth = parentWidth - 100;

				// Destroy in case it's already active
				if ( $columnSpacer.hasClass( 'ui-resizable' ) ) {
					$columnSpacer.resizable( 'destroy' );
				}

				$columnSpacer.width( columnSpacing );

				$columnSpacer.resizable( {
					handles: FusionPageBuilderApp.$el.hasClass( 'rtl' ) ? 'w' : 'e',
					minWidth: 0,
					maxWidth: maxWidth,
					grid: ( percentSpacing ) ? [ parentWidth / 100, 10 ] : '',
					create: function() {
						if ( 0 === $el.find( '> .fusion-column-spacing .fusion-spacing-value' ).width() ) {
							$el.find( '> .fusion-column-spacing' ).addClass( 'empty' );
						} else if ( $el.find( '> .fusion-column-spacing.empty' ).length ) {
							$el.find( '> .fusion-column-spacing' ).removeClass( 'empty' );
						}
					},
					resize: function( event, ui ) {

						ui.size.width = 0 > ui.size.width ? 0 : ui.size.width;

						if ( 0 === modelSpacing ) {
							$el.find( '> .fusion-column-spacing' ).addClass( 'empty' );
						} else if ( $el.find( '> .fusion-column-spacing.empty' ).length ) {
							$el.find( '> .fusion-column-spacing' ).removeClass( 'empty' );
						}
						modelSpacing = ui.size.width + 'px';
						if ( percentSpacing ) {
							modelSpacing = Math.round( parseFloat( ui.size.width / ( parentWidth / 100 ) ) ) + '%';
						}
						$el.css( 'margin-' + marginDirection, modelSpacing );

						// Update open modal.
						if ( jQuery( '[data-element-cid="' + self.model.get( 'cid' ) + '"]' ).length ) {
							jQuery( '[data-element-cid="' + self.model.get( 'cid' ) + '"] [data-option-id="spacing"] #spacing' ).val( modelSpacing ).trigger( 'change' );
						}

						$el.find( '> .fusion-column-spacing .fusion-spacing-tooltip, > .fusion-column-spacing' ).addClass( 'active' );
						$el.find( '> .fusion-column-spacing .fusion-spacing-tooltip' ).text( modelSpacing );
						$el.addClass( 'active-drag' );
						self._toolTipHide();

						// Right padding overlap.
						if ( 20 > ui.size.width && 20 > $spacers.find( '.fusion-column-padding-' + marginDirection ).width() ) {
							jQuery( ui.element ).parent().addClass( 'fusion-overlap' );
							$spacers.find( '.fusion-column-padding-' + marginDirection ).addClass( 'fusion-overlap' );
						} else {
							jQuery( ui.element ).parent().removeClass( 'fusion-overlap' );
							$spacers.find( '.fusion-column-padding-' + marginDirection ).removeClass( 'fusion-overlap' );
						}
					},
					stop: function( event, ui ) { // jshint ignore: line
						$el.removeClass( 'active-drag' );
					}
				} );

				rightPadding = 'undefined' === typeof this.model.attributes.params.padding_right || '' === this.model.attributes.params.padding_right ? '0px' : this.model.attributes.params.padding_right;
				rightOverlap = ( 20 > parseInt( rightPadding, 10 ) && ( '0%' === rightPadding || -1 === rightPadding.indexOf( '%' ) ) && ( 20 > parseInt( columnSpacing, 10 ) ) ) ? 'fusion-overlap' : '';

				if ( '' !== rightOverlap ) {
					$spacers.find( '.fusion-column-padding-right' ).addClass( 'fusion-overlap' );
					$el.find( '> .fusion-column-spacing' ).addClass( 'fusion-overlap' );
				} else {
					$spacers.find( '.fusion-column-padding-right' ).removeClass( 'fusion-overlap' );
					$el.find( '> .fusion-column-spacing' ).removeClass( 'fusion-overlap' );
				}

				// Column spacer created
				this.columnSpacer = true;
			},

			/**
			 * Changes the size of a column.
			 *
			 * @since 2.0.0
			 * @param {Object} event - The event triggering the change in size.
			 * @return {void}
			 */
			sizeSelect: function( event ) {
				var columnSize,
					fractionSize,
					container	= FusionPageBuilderViewManager.getView( this.model.get( 'parent' ) ),
					viewport	= jQuery( '#fb-preview' ).attr( 'data-viewport' ),
					index		= [ 'desktop', 'tablet', 'mobile' ].findIndex( function ( vp ) {
						return viewport.includes( vp );
					} ),
					widthKeys	= [ 'type', 'type_medium', 'type_small' ];

				if ( event ) {
					event.preventDefault();
				}

				columnSize = jQuery( event.target ).data( 'column-size' );

				// Check if there's a setings view and veify if it's the one corresponding to this element.
				if ( FusionPageBuilderApp.SettingsHelpers.openSettingsView && FusionPageBuilderApp.SettingsHelpers.openSettingsView.model.cid === this.model.cid ) {
					if ( FusionPageBuilderApp.SettingsHelpers.openSettingsView.tabsRendered.design ) {
						return FusionPageBuilderApp.SettingsHelpers.openSettingsView.$el.find( '.fusion-option-' + widthKeys[ index ] + ' .ui-button[data-value="' + columnSize + '"]' ).trigger( 'click' );
					}
					jQuery( FusionPageBuilderApp.SettingsHelpers.openSettingsView.$el.find( '.width-value' )[ index ] ).val( columnSize );
				}

				// Update model.
				this.model.attributes.params[ widthKeys[ index ] ] = columnSize;

				this.$el.find( '.column-sizes' ).hide();
				this.$el.removeClass( 'active' );
				this.$el.attr( 'data-column-size', columnSize );

				fractionSize = columnSize.replace( '_', '/' );

				// Necessary for re-sizing then cloning.
				this.reRender();

				container.setRowData();

				if ( 'fusion_builder_column_inner' !== this.model.get( 'type' ) ) {
					this.renderSectionSeps();
				}

				this.$el.find( '.column-sizes .column-size' ).removeClass( 'active-size' );
				this.$el.find( '.column-size-' + columnSize ).addClass( 'active-size' );

				this.$el.closest( '.fusion-builder-container' ).removeClass( 'fusion-column-sizer-active' );

				jQuery( '#fb-preview' )[ 0 ].contentWindow.jQuery( 'body' ).trigger( 'fusion-column-resized', this.model.get( 'cid' ) );
				FusionEvents.trigger( 'fusion-column-resized' );

				// Save history state
				FusionEvents.trigger( 'fusion-history-save-step', fusionBuilderText.resized_column + ' ' + fractionSize );
			},

			/**
			 * Checks if the value is in pixels.
			 *
			 * @since 2.0.0
			 * @param {string} value - The value we want to check.
			 * @return {boolean}
			 */
			pxCheck: function( value ) {
				if ( 'undefined' === typeof value ) {
					return false;
				}

				// If 0, then consider valid.
				if ( '0' === value || 0 === value ) {
					return true;
				}

				return ( -1 !== value.indexOf( 'px' ) ) ? true : false;
			},

			/**
			 * Checks if the value is using %.
			 *
			 * @since 2.0.0
			 * @param {string} value - The value we want to check.
			 * @return {boolean}
			 */
			percentageCheck: function( value ) {
				if ( 'undefined' === typeof value ) {
					return false;
				}

				// If 0, then consider valid.
				if ( '0' === value || 0 === value ) {
					return true;
				}

				return ( -1 !== value.indexOf( '%' ) ) ? true : false;
			},

			/**
			 * Adds 2 values.
			 *
			 * @since 2.0.0
			 * @param {string|number|double} a - The 1st value.
			 * @param {string|number|double} b - The 2nd value.
			 * @return {number}
			 */
			addValues: function( a, b ) {
				return parseFloat( a ) + parseFloat( b );
			},

			/**
			 * Add a module.
			 *
			 * @since 2.0.0
			 * @param {Object} event - The event triggering the module addition.
			 * @return {void}
			 */
			addModule: function( event ) {
				var view,
					viewSettings,
					closestParent;

				if ( event ) {
					event.preventDefault();
					event.stopPropagation();
					FusionPageBuilderApp.sizesHide( event );
				}

				FusionPageBuilderApp.parentColumnId = this.model.get( 'cid' );

				viewSettings = {
					model: this.model,
					collection: this.collection,
					view: this,
					attributes: {
						'data-parent_cid': this.model.get( 'cid' )
					}
				};

				if ( ! jQuery( event.currentTarget ).closest( '.fusion-builder-empty-column' ).length ) {
					closestParent = jQuery( event.currentTarget ).closest( '.fusion-builder-live-element' );
					if ( closestParent.length ) {
						viewSettings.targetElement = closestParent;
					} else {
						viewSettings.targetElement = jQuery( event.currentTarget ).closest( '.fusion-builder-nested-element' );
					}
				}

				view = new FusionPageBuilder.ElementLibraryView( viewSettings );

				jQuery( view.render().el ).dialog( {
					title: 'Select Element',
					draggable: false,
					modal: true,
					resizable: false,
					dialogClass: 'fusion-builder-dialog fusion-builder-large-library-dialog fusion-builder-element-library-dialog',

					resizeStart: function( event, ui ) {
						FusionApp.dialog.addResizingClasses();
					},

					resizeStop: function( event, ui ) {
						FusionApp.dialog.removeResizingClasses();
					},

					open: function( event, ui ) { // jshint ignore: line
						FusionApp.dialog.resizeDialog();

						// On start can sometimes be laggy/late.
						FusionApp.dialog.addResizingHoverEvent();
					},
					close: function( event, ui ) { // jshint ignore: line
						view.remove();
					}
				} );
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

			setArgs: function() {
				var params = jQuery.extend( true, {}, this.model.get( 'params' ) ),
					values;

				// Make sure initial width is correctly inherited.
				if ( 'undefined' === typeof params.type ) {
					params.type = this.model.attributes.params.type;
				}

				if ( fusionAllElements[ this.model.get( 'type' ) ] ) {
					values = jQuery.extend( true, {}, fusionAllElements[ this.model.get( 'type' ) ].defaults, _.fusionCleanParameters( params ) );
				}

				// If no blend mode is defined, check if we should set to overlay.
				if ( 'undefined' === typeof params.background_blend_mode && '' !== params.background_color && 1 > values.alpha_background_color && 0 !== values.alpha_background_color && '' !== params.background_image ) {
					values.background_blend_mode = 'overlay';
				}

				// If padding (combined all 4) is not set in params, then use individual variables.
				if ( 'undefined' === typeof params.padding ) {
					values = _.fusionGetPadding( values );
				}

				this.values = this.getDynamicAtts( values );
			},

			validateArgs: function() {
				var borderRadius;

				// Alpha related checks.
				this.values.alpha_background_color     = jQuery.AWB_Color( this.values.background_color ).alpha();
				this.values.alpha_gradient_start_color = jQuery.AWB_Color( this.values.gradient_start_color ).alpha();
				this.values.alpha_gradient_end_color   = jQuery.AWB_Color( this.values.gradient_end_color ).alpha();

				if ( '' !== this.values.margin_bottom ) {
					this.values.margin_bottom = _.fusionGetValueWithUnit( this.values.margin_bottom );
				}
				if ( '' !== this.values.margin_top ) {
					this.values.margin_top = _.fusionGetValueWithUnit( this.values.margin_top );
				}

				if ( this.values.border_size ) {
					this.values.border_size = _.fusionValidateAttrValue( this.values.border_size, 'px' );
				}

				if ( '' !== this.values.padding ) {
					this.values.padding = _.fusionGetValueWithUnit( this.values.padding );
				}

				if ( '' !== this.values.border_sizes_top ) {
					this.values.border_sizes_top = _.fusionGetValueWithUnit( this.values.border_sizes_top );
				}

				if ( '' !== this.values.border_sizes_bottom ) {
					this.values.border_sizes_bottom = _.fusionGetValueWithUnit( this.values.border_sizes_bottom );
				}

				if ( '' !== this.values.border_sizes_top ) {
					this.values.border_sizes_left = _.fusionGetValueWithUnit( this.values.border_sizes_left );
				}

				if ( '' !== this.values.border_sizes_top ) {
					this.values.border_sizes_right = _.fusionGetValueWithUnit( this.values.border_sizes_right );
				}


				// Border radius validation.
				this.values.border_radius_top_left     = this.values.border_radius_top_left ? _.fusionGetValueWithUnit( this.values.border_radius_top_left ) : '0px';
				this.values.border_radius_top_right    = this.values.border_radius_top_right ? _.fusionGetValueWithUnit( this.values.border_radius_top_right ) : '0px';
				this.values.border_radius_bottom_left  = this.values.border_radius_bottom_left ? _.fusionGetValueWithUnit( this.values.border_radius_bottom_left ) : '0px';
				this.values.border_radius_bottom_right = this.values.border_radius_bottom_right ? _.fusionGetValueWithUnit( this.values.border_radius_bottom_right ) : '0px';
				borderRadius                           = this.values.border_radius_top_left + ' ' + this.values.border_radius_top_right + ' ' + this.values.border_radius_bottom_right + ' ' + this.values.border_radius_bottom_left;
				this.values.border_radius              = '0px 0px 0px 0px' === borderRadius ? '' : borderRadius;

				this.values.border_position = 'all' !== this.values.border_position ? '-' + this.values.border_position : '';

				if ( '' === this.values.background_color_hover && '' !== this.values.background_color ) {
					this.values.background_color_hover = this.values.background_color;
				}

			},

			validatePercentageMargin: function( value, columnSize, values ) {
				value      = 'undefined' === typeof value ? '' :  value;
				columnSize = 'undefined' === typeof columnSize ? 1 : columnSize;
				values     = 'undefined' === typeof values ? this.values : values;

				if ( -1 !== value.indexOf( '%' ) && this.isCustomWidth( columnSize ) ) {
					return '0px';
				}

				// If value is in percentage and not calc, make it relative to container.
				if ( 0 < parseFloat( columnSize ) &&  -1 !== value.indexOf( '%' ) && -1 === value.indexOf( 'calc' ) ) {
					// If all are in % just work it out.
					if ( -1 !== values.column_spacing.indexOf( '%' ) && -1 === values.column_spacing.indexOf( 'calc' ) ) {
						return ( parseFloat( value ) / parseFloat( columnSize ) / 100 * ( 100 - parseFloat( values.column_spacing ) ) ) + '%';
					}

					// Not all % then we need to use calc.
					return 'calc( ' + ( parseFloat( value ) / parseFloat( columnSize ) / 100 ) + ' * calc( 100% - ' + values.column_spacing + ' ) )';

				}
				return value;
			},

			setExtraArgs: function() {

				var container = FusionPageBuilderApp.getParentContainer( this.model.get( 'parent' ) ),
					containerParams,
					containerValues;

				this.values.flex             = false;
				this.values.column_spacing   = '4%';
				this.values.flex_align_items = 'flex-start';
				if ( 'object' === typeof container ) {
					containerParams              = _.fusionCleanParameters( container.model.get( 'params' ) );
					containerValues              = jQuery.extend( true, {}, fusionAllElements.fusion_builder_container.defaults, containerParams );
					this.values.flex             = 'flex' === containerValues.type;
					this.values.column_spacing   = containerValues.flex_column_spacing;
					this.values.flex_align_items = containerValues.flex_align_items;
				}

				this.values.column_counter = this.model.get( 'cid' );

				this.values.hover_or_link = ( 'none' !== this.values.hover_type && '' !== this.values.hover_type ) || '' !== this.values.link;

				this.values.shortcode_classname = 'fusion_builder_column' === this.model.get( 'type' ) ? 'fusion-builder-live-column' : 'fusion-builder-live-nested-column';

				// Store for later use.
				this.isFlex = this.values.flex;
			},

			setColumnMapData: function() {
				var self = this,
					containerSpacingOffset,
					unitlessSpacing,
					unitlessHalf,
					halfSpacing,
					emptyOffset,
					container,
					currentRow,
					containerRows,
					spacings,
					total,
					lastIndex,
					model,
					columnSpacing,
					widthKey,
					spacingLeftKey,
					spacingRightKey,
					extras;

				// If we are flex, we do not have a column map.
				if ( this.values.flex ) {
					this.setColumnSize();

					extras = jQuery.extend( true, {}, fusionAllElements.fusion_builder_column.extras );

					// Medium inherit from large or validate if set.
					if ( '' === this.values.type_medium || 0 === parseFloat( this.values.type_medium ) ) {
						this.values.type_medium = 'inherit_from_large' === extras.col_width_medium ? this.values.column_size : 1;
					} else {
						this.values.type_medium = this.validateColumnSize( this.values.type_medium );
					}

					// Small default to 1 or validate if set.
					if ( '' === this.values.type_small || 0 === parseFloat( this.values.type_small ) ) {
						this.values.type_small = 'inherit_from_large' === extras.col_width_small ? this.values.column_size : 1;
					} else {
						this.values.type_small = this.validateColumnSize( this.values.type_small );
					}

					// Not full width medium, inherit from large if set.
					if ( 1 !== parseInt( this.values.type_medium ) ) {
						if ( '' === this.values.spacing_left_medium ) {
							this.values.spacing_left_medium = this.values.spacing_left;
						}
						if ( '' === this.values.spacing_right_medium ) {
							this.values.spacing_right_medium = this.values.spacing_right;
						}
					}

					// Full width small, inherit from medium or large if set.
					if ( 1 !== parseInt( this.values.type_small ) ) {
						if ( '' === this.values.spacing_left_small ) {
							this.values.spacing_left_small = '' !== this.values.spacing_left_medium ? this.values.spacing_left_medium : this.values.spacing_left;
						}
						if ( '' === this.values.spacing_right_small ) {
							this.values.spacing_right_small = '' !== this.values.spacing_right_medium ? this.values.spacing_right_medium : this.values.spacing_right;
						}
					}

					// Half the spacing on container.
					halfSpacing = this.getHalfSpacing();

					// Validate left and right margins that are set.
					_.each( [ 'large', 'medium', 'small' ], function( width ) {

						// Need to calc for each because column width may be different and that changes things.
						widthKey    = 'large' === width ? 'column_size' : 'type_' + width;
						emptyOffset = self.validatePercentageMargin( halfSpacing, self.values[ widthKey ] );

						// We have a value, validate it, else we use the empty offset.
						spacingLeftKey = 'large' === width ? 'spacing_left' : 'spacing_left_' + width;
						if ( '' !== self.values[ spacingLeftKey ] ) {
							self.values[ 'upsized_' + spacingLeftKey ] = self.validatePercentageMargin( self.values[ spacingLeftKey ], self.values[ widthKey ] );
						} else {
							self.values[ 'upsized_' + spacingLeftKey ] = emptyOffset;
						}

						spacingRightKey = 'large' === width ? 'spacing_right' : 'spacing_right_' + width;
						if ( '' !== self.values[ spacingRightKey ] ) {
							self.values[ 'upsized_' + spacingRightKey ] = self.validatePercentageMargin( self.values[ spacingRightKey ], self.values[ widthKey ] );
						} else {
							self.values[ 'upsized_' + spacingRightKey ] = emptyOffset;
						}
					} );

					return;
				}

				container     = FusionPageBuilderViewManager.getView( this.model.get( 'parent' ) );
				containerRows = container.model.get( 'rows' );
				currentRow    = container.getVirtualRowByCID( this.model.get( 'cid' ) );

				if ( 'yes' === this.values.spacing || '' === this.values.spacing ) {
					this.values.spacing = '4%';
				} else if ( 'no' === this.values.spacing ) {
					this.values.spacing = '0px';
				}

				this.values.spacing                   = _.fusionGetValueWithUnit( this.values.spacing );
				this.values.widthOffset               = '';
				this.values.currentRowNumberOfColumns = false;

				function fallbackCheck( value ) {
					return ( 'yes' === value || 'no' === value );
				}

				// Pop off the last because it can't have spacing.
				if ( 'undefined' !== typeof currentRow ) {

					// currentRow = currentRow.slice( 0, -1 );
					this.values.currentRowNumberOfColumns = currentRow.length + 1;
				}

				this.values.fallback = false;
				if ( 'object' === typeof currentRow ) {
					this.values.fallback = currentRow.every( fallbackCheck );
				}

				this.setColumnSize();

				// Nested column check
				if ( 'object' === typeof currentRow ) {
					spacings  = [];
					total     = currentRow.length;
					lastIndex = total - 1;

					_.each( currentRow, function( column, index ) {

						if ( lastIndex !== index ) {
							model = container.model.children.find( function( model ) {
								return model.get( 'cid' ) == column.cid; // jshint ignore: line
							} );

							columnSpacing = model.attributes.params.spacing;
							columnSpacing = ( 'undefined' === typeof columnSpacing || '' === columnSpacing ) ? '4%' : columnSpacing;

							spacings.push( columnSpacing );
						}

						if ( 1 === total ) {
							spacings.push( '' );
						}

					} );

					spacings = spacings.join( ' + ' );

					// If no fallback make sure to replace mixed values.
					if ( ! this.values.fallback ) {
						spacings = spacings.replace( /yes/g, '4%' ).replace( /no/g, '0%' );
					}
					this.values.widthOffset = '( ( ' + spacings + ' ) * ' + this.values.column_size + ' ) ';
				}

				this.setSpacingStyling();
			},

			getHalfSpacing: function () {
				var unitlessSpacing = parseFloat( this.values.column_spacing ),
					unitlessHalf    = unitlessSpacing / 2;

				return this.values.column_spacing.replace( unitlessSpacing, unitlessHalf );
			},

			setColumnSize: function() {
				var sizeClass;

				// Column size value
				switch ( this.values.type ) {
				case '1_1':
					sizeClass  = 'fusion-one-full';
					break;
				case '1_4':
					sizeClass  = 'fusion-one-fourth';
					break;
				case '3_4':
					sizeClass  = 'fusion-three-fourth';
					break;
				case '1_2':
					sizeClass  = 'fusion-one-half';
					break;
				case '1_3':
					sizeClass  = 'fusion-one-third';
					break;
				case '2_3':
					sizeClass  = 'fusion-two-third';
					break;
				case '1_5':
					sizeClass  = 'fusion-one-fifth';
					break;
				case '2_5':
					sizeClass  = 'fusion-two-fifth';
					break;
				case '3_5':
					sizeClass  = 'fusion-three-fifth';
					break;
				case '4_5':
					sizeClass  = 'fusion-four-fifth';
					break;
				case '5_6':
					sizeClass  = 'fusion-five-sixth';
					break;
				case '1_6':
					sizeClass  = 'fusion-one-sixth';
					break;
				}

				this.values.column_size = this.validateColumnSize( this.values.type );
				this.values.size_class  = sizeClass;
			},

			validateColumnSize: function( columnSize ) {
				var fractions;

				if ( 'undefined' === typeof columnSize ) {
					columnSize = '1_3';
				}

				// Fractional value.
				if ( -1 !== columnSize.indexOf( '_' ) ) {
					fractions = columnSize.split( '_' );
					return parseFloat( fractions[ 0 ] ) / parseFloat( fractions[ 1 ] );
				}

				// Greater than one, assume percentage and divide by 100.
				if ( 1 < parseFloat( columnSize ) && -1 == columnSize.indexOf( 'px' ) && -1 == columnSize.indexOf( 'calc' ) ) {
					return parseFloat( columnSize ) / 100;
				}
				// Return if not float.
				return columnSize;
			},

			setSpacingStyling: function() {
				var spacingDirection,
					width         = ( this.values.column_size * 100 ) + '%',
					mapOldSpacing = {
						0.1666: '13.3333%',
						0.8333: '82.6666%',
						0.2: '16.8%',
						0.4: '37.6%',
						0.6: '58.4%',
						0.8: '79.2%',
						0.25: '22%',
						0.75: '74%',
						0.3333: '30.6666%',
						0.6666: '65.3333%',
						0.5: '48%',
						1: '100%'
					};

				this.values.column_spacing_style = '';
				this.values.spacing_classes      = '';

				if ( 0 === parseFloat( this.values.spacing ) ) {
					this.values.spacing_classes = 'fusion-spacing-no';
				}

				if ( ! this.values.last && ! ( this.values.fallback && '0px' === this.values.spacing ) ) {
					spacingDirection = 'right';

					if ( FusionPageBuilderApp.$el.hasClass( 'rtl' ) ) {
						spacingDirection = 'left';
					}
					if ( ! this.values.fallback ) {
						this.values.column_spacing_style = 'width:' + width + ';width:calc(' + width + ' - ' + this.values.widthOffset + ');margin-' + spacingDirection + ': ' + this.values.spacing + ';';
					} else {
						this.values.column_spacing_style = 'width:' + mapOldSpacing[ this.values.column_size ] + '; margin-' + spacingDirection + ': ' + this.values.spacing + ';';
					}
				} else if ( 'undefined' !== typeof this.values.currentRowNumberOfColumns && 1 < this.values.currentRowNumberOfColumns ) {
					if ( ! this.values.fallback ) {
						this.values.column_spacing_style = 'width:' + width + ';width:calc(' + width + ' - ' + this.values.widthOffset + ');';
					} else if ( '0px' !== this.values.spacing && 'undefined' !== typeof mapOldSpacing[ this.values.column_size ] ) {
						this.values.column_spacing_style = 'width:' + mapOldSpacing[ this.values.column_size ] + ';';
					} else {
						this.values.column_spacing_style = 'width:' + width + ';';
					}
				} else if ( 'undefined' === typeof this.values.currentRowNumberOfColumns && 'undefined' !== mapOldSpacing[ this.values.column_size ] ) {
					this.values.column_spacing_style = 'width:' + mapOldSpacing[ this.values.column_size ] + ';';
				}
			},

			getResponsiveColumnVars: function() {
				var self    = this,
					cssVars = [];

				this.responsiveStyles = '';

				if ( ! this.values.flex ) {
					return;
				}

				_.each( [ 'large', 'medium', 'small' ], function( size ) {
					var widthKey,
						keyBase,
						orderKey,
						flex_grow_key,
						flex_shrink_key,
						spacingKey;

					// Width.
					widthKey = 'large' === size ? 'column_size' : 'type_' + size;
					if ( 'string' === typeof self.values[ widthKey ] && ( self.values[ widthKey ].indexOf( 'px' ) || self.values[ widthKey ].indexOf( 'px' ) ) ) {
						cssVars[ 'width-' + size ] =  self.values[ widthKey ];
					} else if ( '' !== self.values[ widthKey ] && 'auto' !== self.values[ widthKey ] && 0 < parseFloat( self.values[ widthKey ] ) ) {
						cssVars[ 'width-' + size ] =  ( parseFloat( self.values[ widthKey ] ) * 100 ) + '%';
					} else if ( 'auto' === self.values[ widthKey ] ) {
						cssVars[ 'width-' + size ] =  'auto';
					}

					// Order.
					orderKey = 'large' === size ? 'order' : 'order_' + size;
					if ( '' !== self.values[ orderKey ] ) {
						cssVars[ 'order-' + size ] = parseInt( self.values[ orderKey ] );
					}

					flex_grow_key = 'large' === size ? 'flex_grow' : 'flex_grow_' + size;
					flex_shrink_key = 'large' === size ? 'flex_shrink' : 'flex_shrink_' + size;
					if ( 0 < parseInt( self.values[ flex_grow_key ] ) ) {
						cssVars[ flex_grow_key ] = parseInt( self.values[ flex_grow_key ] );
					}
					if ( 0 < parseInt( self.values[ flex_shrink_key ] ) ) {
						cssVars[ flex_shrink_key ] = parseInt( self.values[ flex_shrink_key ] );
					}

					_.each( [ 'top', 'right', 'bottom', 'left' ], function( direction ) {

						// Margin.
						keyBase    = 'left' === direction || 'right' === direction ? 'upsized_spacing' : 'margin';
						spacingKey = 'large' === size ? keyBase + '_' + direction : keyBase + '_' + direction + '_' + size;
						if ( '' !== self.values[ spacingKey ] ) {
							if ( 'margin' === keyBase ) {
								cssVars[ 'margin-' + direction + '-' + size ] = self.values[ spacingKey ];
							} else if ( 'upsized_spacing' === keyBase ) {
								if ( -1 !== self.values[ spacingKey ].indexOf( '%' ) && 'custom' === self.getVisibleWidth() ) {
									cssVars[ 'spacing-' + direction + '-' + size ] = '0px';
								} else {
									cssVars[ 'spacing-' + direction + '-' + size ] = _.fusionGetValueWithUnit( self.values[ spacingKey ] );
								}
							}
						}
					} );
				} );
				return this.getCustomCssVars( cssVars );
			},

			setResponsiveColumnStyles: function() {
				var self    = this,
					extras  = jQuery.extend( true, {}, fusionAllElements.fusion_builder_column.extras );

				this.responsiveStyles = '';

				if ( ! this.values.flex ) {
					return;
				}

				_.each( [ 'large', 'medium', 'small' ], function( size ) {
					var uiWrapperStyles     	= '',
						dragStyles          	= '',
						columnStyles          = '',
						keyBase,
						orderKey,
						spacingKey;

					// Order.
					orderKey = 'large' === size ? 'order' : 'order_' + size;
					if ( '' !== self.values[ orderKey ] ) {
						columnStyles += 'order : ' + parseInt( self.values[ orderKey ] ) + ';';
					}

					_.each( [ 'top', 'right', 'bottom', 'left' ], function( direction ) {

						// Margin.
						keyBase    = 'left' === direction || 'right' === direction ? 'upsized_spacing' : 'margin';
						spacingKey = 'large' === size ? keyBase + '_' + direction : keyBase + '_' + direction + '_' + size;
						if ( '' !== self.values[ spacingKey ] ) {
							if ( 'left' === direction ) {
								uiWrapperStyles += direction + ':' + self.values[ spacingKey ] + ';';
							}
							if ( 'left' === direction || 'right' === direction ) {
								dragStyles += direction + ':' + self.values[ spacingKey ] + ';';
							}
						}
					} );

					// Wrap CSS selectors
					if ( '' !== columnStyles ) {
						columnStyles = '.fusion-body .' + self.values.shortcode_classname + '-' + self.values.column_counter + '{' + columnStyles + '}';
					}

					if ( '' !== uiWrapperStyles ) {
						uiWrapperStyles  = '.fusion-body .fusion-flex-container .fusion-row .' + self.values.shortcode_classname + '-' + self.values.column_counter + ' > .fusion-builder-module-controls-type-column {' + uiWrapperStyles + '}';
					}
					if ( '' !== dragStyles ) {
						dragStyles  = '.fusion-flex-container .fusion-row .' + self.values.shortcode_classname + '-' + self.values.column_counter + '.fusion-being-dragged:after, .fusion-builder-live .fusion-flex-container .fusion-nested-columns.editing .' + self.values.shortcode_classname + '-' + self.values.column_counter + ':hover:after {' + dragStyles + '}';
					}

					// Large styles, no wrapping needed.
					if ( 'large' === size ) {
						self.responsiveStyles += uiWrapperStyles + dragStyles + columnStyles;
					} else {
						// Medium and Small size screen styles.
						self.responsiveStyles += '@media only screen and (max-width:' + extras[ 'visibility_' + size ] + 'px) {' + uiWrapperStyles + dragStyles + columnStyles + '}';
					}
				} );
			},

			buildAttr: function() {
				var attr = {
						'class': 'fusion-layout-column ' + this.model.get( 'type' ) + ' ' + this.values.shortcode_classname + '-' + this.values.column_counter + ' fusion-builder-column-live-' + this.values.column_counter,
						'style': this.getStyleVars()
					};

				// Sticky column.
				if ( 'on' === this.values.sticky ) {
					attr[ 'class' ] += ' awb-sticky';

					if ( '' !== this.values.sticky_offset && 0 !== this.values.sticky_offset ) {

						// If its not a selector then get value and set to css variable.
						if ( ! this.values.sticky_offset.includes( '.' ) && ! this.values.sticky_offset.includes( '#' ) ) {
							attr.style += '--awb-sticky-offset:' + _.fusionGetValueWithUnit( this.values.sticky_offset ) + ';';
						} else {
							attr[ 'data-sticky-offset' ] = this.values.sticky_offset;
						}
					}

					// Not ideal, but easier to join and keep the rest of the logic the same.
					if ( 'object' === typeof this.values.sticky_devices ) {
						this.values.sticky_devices = this.values.sticky_devices.join( ',' );
					}
					if ( 'string' === typeof this.values.sticky_devices && '' !== this.values.sticky_devices ) {
						this.values.sticky_devices = this.values.sticky_devices.replaceAll( '-visibility', '' ).split( ',' );

						this.values.sticky_devices.forEach( ( stickyDevice ) => {
							attr[ 'class' ] += ' awb-sticky-' + stickyDevice.replaceAll( ' ', '' );
						} );
					}
				}

				if ( 'on' === this.values.absolute ) {
					attr[ 'class' ] += ' awb-absolute';
				}

				if ( this.values.z_index ) {
					attr.style += 'z-index:' + this.values.z_index + ';';
				}

				// Flexbox column.
				if ( this.values.flex ) {
					attr[ 'class' ] += ' fusion-flex-column';

					// Alignment of column vertically.
					if ( 'auto' !== this.values.align_self ) {
						attr[ 'class' ] += ' fusion-flex-align-self-' + this.values.align_self;
					}
				} else {

					if ( '' !== this.values.type && this.values.type.includes( '_ ' ) ) {
						attr[ 'class' ] += ' ' + this.model.get( 'type' ) + '_' + this.values.type;
						attr[ 'class' ] += ' ' + this.values.type;
					}

					// Class for the specific size of column.
					if ( '' !== this.values.size_class ) {
						attr[ 'class' ] += ' ' + this.values.size_class;
					}

					// First column.
					if ( this.values.first ) {
						attr[ 'class' ] += ' fusion-column-first';
					}

					// Last column.
					if ( this.values.last ) {
						attr[ 'class' ] += ' fusion-column-last';
					}

					// Special calcs for spacing.
					if ( '' !== this.values.spacing_classes ) {
						attr[ 'class' ] += this.values.spacing_classes;
					}

					// Column spacing style, margin and width.
					if ( '' !== this.values.column_spacing_style ) {
						attr.style += this.values.column_spacing_style;
					}
				}

				// Custom CSS class.
				if ( '' !== this.values[ 'class' ] ) {
					attr[ 'class' ] += ' ' + this.values[ 'class' ];
				}

				// Min height for newly created columns by the converter.
				if ( 'none' === this.values.min_height ) {
					attr[ 'class' ] += ' fusion-column-no-min-height';
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

				// Visibility classes.
				attr[ 'class' ] = _.fusionVisibilityAtts( visibilityValue, attr[ 'class' ] );

				attr[ 'class' ] += _.fusionGetStickyClass( this.values.sticky_display );

				// Hover type or link.
				if ( this.values.hover_or_link ) {
					attr[ 'class' ] += ' fusion-column-inner-bg-wrapper';
				}

				// TODO: check why it is looking at animation type/class.
				if ( this.values.hover_or_link && '' !== this.values.animation_type && 'liftup' === this.values.hover_type ) {
					attr[ 'class' ] += ' fusion-column-hover-type-liftup';
				}

				// Lift up and border.
				if ( 'liftup' === this.values.hover_type && '' !== this.values.border_style ) {
					attr[ 'class' ] += ' fusion-column-liftup-border';
				}

				attr = _.fusionAnimations( this.values, attr );

				if ( '' !== this.values.id ) {
					attr.id = this.values.id;
				}

				if ( this.values.motion_effects ) {
					attr[ 'data-motion-effect' ] = true;
				}

				return attr;
			},

			buildWrapperAttr: function() {
				var attr = {
						'class': 'fusion-column-wrapper fusion-column-wrapper-live-' + this.values.column_counter,
						'style': ''
					};

				// Image URL for empty dimension calculations.
				attr[ 'data-bg-url' ] = this.values.background_image;

				// Box shadow.
				if ( 'liftup' !== this.values.hover_type && '' !== this.values.box_shadow ) {
					attr[ 'class' ] += ' fusion-column-has-shadow'; // Move this to appropriate.
				}

				// Flex.
				if ( this.values.flex ) {
					if ( '' !== this.values.align_content ) {
						attr[ 'class' ] += ' fusion-flex-justify-content-' + this.values.align_content;
						attr[ 'class' ] += ' fusion-content-layout-' + this.values.content_layout;

						if ( 'row' === this.values.content_layout && 'flex-start' !== this.values.valign_content ) {
							attr[ 'class' ] += ' fusion-flex-align-items-' + this.values.valign_content;
						}
						if ( 'wrap' !== this.values.content_wrap ) {
							attr[ 'class' ] += ' fusion-content-' + this.values.content_wrap;
						}
					}
				}

				return attr;
			},

			buildHoverWrapperAttr: function() {
				var attr = {
						'class': 'fusion-column-inner-bg hover-type-' + this.values.hover_type,
						'style': ''
					};


				return attr;
			},

			buildAnchorAttr: function() {
				var attr = {};

				attr[ 'class' ] = 'fusion-column-anchor';

				if ( '' !== this.values.link ) {
					attr.href = this.values.link;
				}

				if ( '_blank' === this.values.target ) {
					attr.rel    = 'noopener noreferrer';
					attr.target = '_blank';
				} else if ( 'lightbox' === this.values.target ) {
					attr[ 'data-rel' ] = 'iLightbox';
				}

				if ( '' !== this.values.link_description ) {
					attr[ 'aria-label' ] = this.values.link_description;
				}

				return attr;
			},

			buildHoverInnerWrapperAttr: function() {
				var attr = {
						'class': 'fusion-column-inner-bg-image',
						'style': ''
					};

				return attr;
			},

			getStyleVars: function() {
				var cssVars = [
						'z_index',
						'z_index_hover'
					],
					borderVars,
					innerVarPrefix,
					customCssVars = {};

				cssVars.padding_top = { 'callback': _.fusionGetValueWithUnit };
				cssVars.padding_right = { 'callback': _.fusionGetValueWithUnit };
				cssVars.padding_bottom = { 'callback': _.fusionGetValueWithUnit };
				cssVars.padding_left = { 'callback': _.fusionGetValueWithUnit };

				cssVars.padding_top_medium = { 'callback': _.fusionGetValueWithUnit };
				cssVars.padding_right_medium = { 'callback': _.fusionGetValueWithUnit };
				cssVars.padding_bottom_medium = { 'callback': _.fusionGetValueWithUnit };
				cssVars.padding_left_medium = { 'callback': _.fusionGetValueWithUnit };

				cssVars.padding_top_small = { 'callback': _.fusionGetValueWithUnit };
				cssVars.padding_right_small = { 'callback': _.fusionGetValueWithUnit };
				cssVars.padding_bottom_small = { 'callback': _.fusionGetValueWithUnit };
				cssVars.padding_left_small = { 'callback': _.fusionGetValueWithUnit };

				// Overflow.
				if ( '' !== this.values.overflow ) {
					customCssVars.overflow = this.values.overflow;
				} else if ( this.values.border_radius ) {
					customCssVars.overflow = 'hidden';
				}

				// Some variables needs to be placed directly on column, some on an inner div helper.
				// This is a quick way to not check for "hover_or_link" every time.
				innerVarPrefix = ( this.values.hover_or_link ? 'inner-' : '' );

				if ( 'on' === this.values.absolute && 'on' !== this.values.sticky ) {
					customCssVars[ 'container-position' ] = 'absolute';

					cssVars.absolute_top =    { 'callback': _.fusionGetValueWithUnit };
					cssVars.absolute_right =  { 'callback': _.fusionGetValueWithUnit };
					cssVars.absolute_bottom = { 'callback': _.fusionGetValueWithUnit };
					cssVars.absolute_left =   { 'callback': _.fusionGetValueWithUnit };
				}

				if ( '' !== this.values.background_color && ( '' === this.values.background_image || 0 !== this.values.alpha_background_color ) ) {
						customCssVars[ innerVarPrefix + 'bg-color' ] = this.values.background_color;
				}

				if ( '' !== this.values.background_color_hover ) {
						customCssVars[ innerVarPrefix + 'bg-color-hover' ] = this.values.background_color_hover;
				}

				if ( '' !== this.values.background_color_medium ) {
						customCssVars[ innerVarPrefix + 'bg-color-medium' ] = this.values.background_color_medium;
				}

				if ( '' !== this.values.background_color_medium_hover ) {
						customCssVars[ innerVarPrefix + 'bg-color-medium-hover' ] = this.values.background_color_medium_hover;
				}

				if ( '' !== this.values.background_color_small ) {
						customCssVars[ innerVarPrefix + 'bg-color-small' ] = this.values.background_color_small;
				}

				if ( '' !== this.values.background_color_small_hover ) {
						customCssVars[ innerVarPrefix + 'bg-color-small-hover' ] = this.values.background_color_small_hover;
				}

				if ( '' !== this.values.background_image ) {
					customCssVars[ innerVarPrefix + 'bg-image' ] = 'url(\'' + this.values.background_image + '\')';
				}

				if ( '' !== this.values.background_image_medium ) {
					customCssVars[ innerVarPrefix + 'bg-image-medium' ] = 'url(\'' + this.values.background_image_medium + '\')';
				}

				if ( '' !== this.values.background_image_small ) {
					customCssVars[ innerVarPrefix + 'bg-image-small' ] = 'url(\'' + this.values.background_image_small + '\')';
				}

				if ( '' !== _.getGradientString( this.values, 'column' ) ) {
					customCssVars[ innerVarPrefix + 'bg-image' ] = _.getGradientString( this.values, 'column' );

					if ( '' !== this.values.background_image_medium ) {
						customCssVars[ innerVarPrefix + 'bg-image_medium' ] = _.getGradientString( this.values, 'column', 'medium' );
					}

					if ( '' !== this.values.background_image_small ) {
						customCssVars[ innerVarPrefix + 'bg-image_small' ] = _.getGradientString( this.values, 'column', 'small' );
					}
				}

				if ( this.values.background_position && ! this.isDefault( 'background_position' ) ) {
					customCssVars[ innerVarPrefix + 'bg-position' ] = this.values.background_position;
				}

				if ( this.values.background_position_medium ) {
					customCssVars[ innerVarPrefix + 'bg-position-medium' ] = this.values.background_position_medium;
				}

				if ( this.values.background_position_small ) {
					customCssVars[ innerVarPrefix + 'bg-position-small' ] = this.values.background_position_small;
				}

				if ( ! this.isDefault( 'background_blend_mode' ) ) {
					customCssVars[ innerVarPrefix + 'bg-blend' ] = this.values.background_blend_mode;
				}

				if ( this.values.background_blend_mode_medium ) {
					customCssVars[ innerVarPrefix + 'bg-blend-medium' ] = this.values.background_blend_mode_medium;
				}

				if ( this.values.background_blend_mode_small ) {
					customCssVars[ innerVarPrefix + 'bg-blend-small' ] = this.values.background_blend_mode_small;
				}

				if ( '' !== this.values.background_repeat ) {
					customCssVars[ innerVarPrefix + 'bg-repeat' ] = this.values.background_repeat;
				}

				if ( '' !== this.values.background_repeat ) {
					customCssVars[ innerVarPrefix + 'bg-repeat' ] = this.values.background_repeat;
				}

				if ( '' !== this.values.background_repeat_medium ) {
					customCssVars[ innerVarPrefix + 'bg-repeat-medium' ] = this.values.background_repeat_medium;
				}

				if ( '' !== this.values.background_repeat_small ) {
					customCssVars[ innerVarPrefix + 'bg-repeat-small' ] = this.values.background_repeat_small;
				}

				if ( 'no-repeat' === this.values.background_repeat ) {
					customCssVars[ innerVarPrefix + 'bg-size' ] = 'cover';
				}

				if ( '' !== this.values.background_size ) {
					const backgroundSize = 'custom' === this.values.background_size ? this.values.background_custom_size : this.values.background_size;
					customCssVars[ innerVarPrefix + 'bg-size' ] = backgroundSize;
				}

				if ( '' !== this.values.background_size_medium ) {
					const backgroundSizeMedium = 'custom' === this.values.background_size_medium ? this.values.background_custom_size_medium : this.values.background_size_medium;
					customCssVars[ innerVarPrefix + 'bg-size-medium' ] = backgroundSizeMedium;
				}

				if ( '' !== this.values.background_size_small ) {
					const backgroundSizeSmall = 'custom' === this.values.background_size_small ? this.values.background_custom_size_small : this.values.background_size_small;
					customCssVars[ innerVarPrefix + 'bg-size-small' ] = backgroundSizeSmall;
				}

				borderVars = this.getBorderVars();

				if ( 'yes' === this.values.box_shadow ) {
					if ( 'liftup' === this.values.hover_type ) {
						customCssVars.inner_bg_box_shadow = _.fusionGetBoxShadowStyle( this.values ).trim();
					} else {
						customCssVars.box_shadow = _.fusionGetBoxShadowStyle( this.values ).trim();
					}
				}

				const transformVars = _.fusionGetTransformVars( this.values, '--awb-transform', '--awb-transform-hover', '--awb-transform-parent-hover' );

				if ( this.values.transform_origin && '50% 50%' !== this.values.transform_origin ) {
					customCssVars.transform_origin = this.values.transform_origin;
				}

				const filterVars = _.getFilterVars( this.values );

				if ( ! this.isDefault( 'transition_duration' ) || ! this.isDefault( 'transition_easing' ) ) {
					customCssVars.transition = _.fusionGetTransitionStyle( this.values );
				}

				return this.getCssVarsForOptions( cssVars ) + this.getCustomCssVars( customCssVars ) + borderVars + transformVars + filterVars + this.getResponsiveColumnVars();
			},

			getBorderVars: function() {
				var customCssVars = {},
					borderOnInner = ( 'liftup' === this.values.hover_type ? true : false );

				if ( '' !== this.values.border_color ) {
					customCssVars[ 'border-color' ] = this.values.border_color;
					if ( borderOnInner ) {
						customCssVars[ 'inner-border-color' ] = this.values.border_color;
					}

					if ( this.values.border_color_hover ) {
						customCssVars[ 'border-color-hover' ] = this.values.border_color_hover;

						if ( borderOnInner ) {
							customCssVars[ 'inner-border-color-hover' ] = this.values.border_color_hover;
						}
					}

					if ( this.values.border_sizes_top ) {
						customCssVars[ 'border-top' ] = this.values.border_sizes_top;

						if ( borderOnInner ) {
							customCssVars[ 'inner-border-top' ] = this.values.border_sizes_top;
						}
					}

					if ( this.values.border_sizes_right ) {
						customCssVars[ 'border-right' ] = this.values.border_sizes_right;

						if ( borderOnInner ) {
							customCssVars[ 'inner-border-right' ] = this.values.border_sizes_right;
						}
					}

					if ( this.values.border_sizes_bottom ) {
						customCssVars[ 'border-bottom' ] = this.values.border_sizes_bottom;

						if ( borderOnInner ) {
							customCssVars[ 'inner-border-bottom' ] = this.values.border_sizes_bottom;
						}
					}

					if ( this.values.border_sizes_left ) {
						customCssVars[ 'border-left' ] = this.values.border_sizes_left;

						if ( borderOnInner ) {
							customCssVars[ 'inner-border-left' ] = this.values.border_sizes_left;
						}
					}

					if ( '' !== this.values.border_style ) {
						customCssVars[ 'border-style' ] = this.values.border_style;

						if ( borderOnInner ) {
							customCssVars[ 'inner-border-style' ] = this.values.border_style;
						}
					}
				}

				if ( '' !== this.values.border_radius ) {
					customCssVars.border_radius = this.values.border_radius;

					if ( ( 'zoomin' === this.values.hover_type || 'zoomout' === this.values.hover_type || '' !== this.values.link ) ) {
						customCssVars[ 'inner-bg-border-radius' ] = this.values.border_radius;
					}

					// Lift up and border radius we need to apply radius to lift up markup.
					if ( this.values.hover_or_link && 'liftup' === this.values.hover_type ) {
						customCssVars[ 'liftup-border-radius' ] = this.values.border_radius;
					}
				}

				if ( ( 'zoomin' === this.values.hover_type || 'zoomout' === this.values.hover_type || this.values.link ) && '' !== this.values.border_radius ) {
					customCssVars[ 'inner-bg-overflow' ] = 'hidden';
				}

				return this.getCustomCssVars( customCssVars );
			},

			/**
			 * Fires when preview are is resized.
			 *
			 * @since 3.0
			 * @return {void}
			 */
			onPreviewResize: function() {
				// Update size indicator in toolbar.
				this.updateSizeIndicators();

				if ( ! FusionPageBuilderApp.getParentContainer( this ).isFlex() ) {
					return;
				}

				// Update margin and padding indicators if we are editing this.
				if ( this.$el.hasClass( 'fusion-builder-element-edited' ) ) {
					this.updateBoxModelIndicators();
				}
			},

			/**
			 * Updates column sizes controls.
			 *
			 * @since 3.0
			 * @return {void}
			 */
			updateSizeIndicators: function() {
				var columnSize = this.getVisibleWidth();

				this.$el.find( '.column-sizes .column-size' ).removeClass( 'active-size' );
				if ( columnSize.includes( '_' ) ) {
					this.$el.find( '.column-size-' + columnSize ).addClass( 'active-size' );
				}
				if ( 'custom' === columnSize ) {
					columnSize = '<span class="fusiona-column"></span>';
				}
				this.$el.find( '.fusion-column-size-label' ).html( columnSize.replace( '_', '/' ) );

			},

			/**
			 * Updates column sizes controls.
			 *
			 * @since 3.0
			 * @return {void}
			 */
			updateBoxModelIndicators: function() {
				this.destroyMarginResizable();
				this.destroyPaddingResizable();
				this.marginDrag();
				this.paddingDrag();
			},

			/**
			 * Parses width to readable string.
			 *
			 * @since 3.0
			 * @param  {String} width
			 * @return {String}
			 */
			parseWidthLabel: function( width ) {
				if ( 'undefined' === typeof width ) {
					width = '1_1';
				}
				if ( 'auto' === width ) {
					return 'auto';
				}
				if ( ! width.includes( '_' ) && ! width.includes( 'px' ) && ! width.includes( 'calc' ) ) {
					return width.split( '.' )[ 0 ] + '%';
				}
				if ( width.includes( 'px' ) || width.includes( 'calc' ) ) {
					return 'custom';
				}
				return width;

			},

			/**
			 * Returns visible column width.
			 *
			 * @since 3.0
			 * @return {String}
			 */
			getVisibleWidth: function() {
				var param, defaultVal, previewFrame, legacyBreakpoint;
					// Legacy support.
					if ( ! FusionPageBuilderApp.getParentContainer( this ).isFlex() ) {
						previewFrame = jQuery( '#fb-preview' )[ 0 ];
						legacyBreakpoint = getComputedStyle( previewFrame.contentDocument.documentElement ).getPropertyValue( '--content_break_point' );
						if ( legacyBreakpoint && legacyBreakpoint >= previewFrame.offsetWidth ) {
							return '1_1';
						}
						return this.model.attributes.params.type;
					}

					param = FusionApp.getResponsiveOptionKey( 'type', true );

					// Default for medium and small sizes.
					if ( 'type' !== param &&  ! this.model.attributes.params[ param ] ) {
						// Return large value.
						defaultVal = fusionAllElements.fusion_builder_column.extras[ 'col_width_' +  param.replace( 'type_', '' ) ];
						if ( 'inherit_from_large' === defaultVal ) {
							return this.parseWidthLabel( this.model.attributes.params.type );
						}
						return '1_1';
					}
					return this.parseWidthLabel( this.model.attributes.params[ param ] );
			},

			getTemplateAtts: function() {
				var styleSelector,
					data   = {},
					wrapperAttr;

				this.setArgs();

				this.responsiveStyles = '';
				this.styles           = '';

				this.validateArgs();

				this.setExtraArgs();

				this.setColumnMapData();

				// Sets styles for responsive options.
				if ( this.values.flex ) {
					this.setResponsiveColumnStyles();
				}

				let columnSelector = '.fusion-builder-column-live-' + this.model.get( 'cid' );

				if ( 'fusion_builder_column_inner' === this.model.get( 'type' ) ) {
					columnSelector = '.fusion-builder-live-nested-column-' + this.model.get( 'cid' );
				}

				// Get the filter style
				if ( 'fusion_builder_column' === this.model.get( 'type' ) ) {
					styleSelector = columnSelector;
				} else {
					styleSelector = { regular: columnSelector, hover: columnSelector + ':hover' };
				}

				// Get Transform selector.
				let transformSelector = '';
				let transformEditSelector = '';

				if ( 'fusion_builder_column' === this.model.get( 'type' ) ) {
					transformSelector = columnSelector;
					transformEditSelector = columnSelector + '.fusion-builder-element-edited';
				} else {
					transformSelector = { regular: columnSelector, hover: columnSelector + ':hover' };
					transformEditSelector = { regular: '.fusion-builder-element-edited' + columnSelector, hover: '.fusion-builder-element-edited' + columnSelector  + ':hover' };
				}

				data.wrapperAttr           = this.buildWrapperAttr();
				data.center_content        = this.values.center_content;
				data.hoverWrapperAttr      = this.buildHoverWrapperAttr();
				data.anchorAttr            = this.buildAnchorAttr();
				data.hoverInnerWrapperAttr = this.buildHoverInnerWrapperAttr();
				data.styles                = this.styles;
				data.nestedClass           = 'fusion_builder_column_inner' === this.model.get( 'type' ) ? ' fusion-nested-column-content' : '';
				data.cid                   = this.model.get( 'cid' );
				data.hoverOrLink           = this.values.hover_or_link;
				data.layout                = this.getVisibleWidth().replace( '_', '/' );
				data.isFlex                = ( 'undefined' !== typeof this.values.flex ) ? this.values.flex : false;
				data.responsiveStyles      = 'undefined' !== typeof this.responsiveStyles ? this.responsiveStyles : '';
				data.isGlobal              = ( 'undefined' !== typeof this.values.fusion_global ) ? 'yes' : 'no';
				data.hideMargin            = 'fusion_builder_column_inner' !== this.model.get( 'type' ) && 'post_cards' === FusionApp.data.fusion_element_type;
				data.column_tag            = this.values.column_tag;
				data.hasBgSlider           = this.values.background_slider_images;
				data.bgSlider 		 	   = _.fusionGetBackgroundSliderElement( this, 'column' );
				wrapperAttr                = this.buildAttr();

				// Flag as having filters.
				if ( '' !== _.getFilterVars( this.values ) ) {
					wrapperAttr[ 'class' ] += ' fusion-has-filters';
				}

				// Main wrapper is the actual view.
				this.model.set( 'selectors', wrapperAttr );

				return data;
			},

			/**
			 * Toggles the 'active' class.
			 *
			 * @since 2.0.0
			 * @param {Object} event - The event triggering the class toggling.
			 * @return {void}
			 */
			sizesShow: function( event ) {
				var parentContainer = this.$el.closest( '.fusion-builder-container' ),
					sizesPopover = this.$el.find( '.column-sizes' ),
					columnOffsetTop = 0,
					html, header, headerBottom, conditional;

				if ( event ) {
					event.preventDefault();
					event.stopPropagation();
				}

				sizesPopover.removeClass( 'fusion-expand-to-bottom' );

				// This needs to be the way it is setup, as nested cols could trigger sizing on several cols at once.
				if ( ! this.$el.hasClass( 'active' ) ) {
					this.$el.addClass( 'active' );
					parentContainer.addClass( 'fusion-column-sizer-active' );

					columnOffsetTop = this.$el.offset().top;
					html = this.$el.closest( 'html' );
					conditional = false;

					if ( html.children( 'body' ).hasClass( 'fusion-top-header' ) ) {
						if ( jQuery( '#fb-preview' )[ 0 ].contentWindow.jQuery( '.fusion-footer-parallax' ).length ) {
							sizesPopover.on( 'mouseenter', function() {
								jQuery( '#fb-preview' )[ 0 ].contentWindow.jQuery( '#main' ).css( 'z-index', 'auto' );

								if ( 'fixed' === jQuery( '#fb-preview' )[ 0 ].contentWindow.jQuery( '.fusion-footer-parallax' ).css( 'position' ) ) {
									jQuery( '#fb-preview' )[ 0 ].contentWindow.jQuery( '.fusion-footer-parallax' ).css( 'z-index', '-1' );

									if ( jQuery( '#fb-preview' )[ 0 ].contentWindow.jQuery( '#sliders-container' ).find( '.tfs-slider[data-parallax="1"]' ).length ) {
										jQuery( '#fb-preview' )[ 0 ].contentWindow.jQuery( '#sliders-container' ).css( 'z-index', 'auto' );
									}
								}
							} );

							sizesPopover.on( 'mouseleave', function() {
								jQuery( '#fb-preview' )[ 0 ].contentWindow.jQuery( '#main' ).css( 'z-index', '' );
								jQuery( '#fb-preview' )[ 0 ].contentWindow.jQuery( '.fusion-footer-parallax' ).css( 'z-index', '' );
								jQuery( '#fb-preview' )[ 0 ].contentWindow.jQuery( '#sliders-container' ).css( 'z-index', '' );
							} );
						}

						header       = html.find( '.fusion-header-wrapper' );
						headerBottom = 0;
						if ( header.length ) {
							headerBottom = header.offset().top + header.outerHeight();
						}
						conditional = 106 > columnOffsetTop - headerBottom;
					}

					if ( 54 > columnOffsetTop - 121 || conditional || sizesPopover.parents( '.fusion-fullwidth' ).hasClass( 'bg-parallax-parent' ) ) {
						sizesPopover.addClass( 'fusion-expand-to-bottom' );
					}
				} else {
					this.$el.removeClass( 'active' );
					parentContainer.removeClass( 'fusion-column-sizer-active' );

					sizesPopover.off( 'mouseover' ).off( 'mouseleave' );
				}

			},

			/**
			 * Toggle class to show content in bottom
			 *
			 * @since 2.0.0
			 * @return {void}
			 */
			offsetClass: function() {
				if ( 100 > this.$el.offset().top ) {
					this.$el.addClass( 'fusion-content-bottom' );
				} else if ( 100 < this.$el.offset().top && this.$el.hasClass( 'fusion-content-bottom' )  ) {
					this.$el.removeClass( 'fusion-content-bottom' );
				}
			},

			/**
			 * Column spacing dimensions version.
			 *
			 * @since 2.0.0
			 * @return {void}
			 */
			fallbackColumnSpacing: function( $placeholder, allNo ) {
				var columnSize      = '100%',
					fullcolumnSize  = columnSize,
					existingSpacing = '0%',
					columnWidth     = this.model.attributes.params.type,
					spacingDirection;

				if ( 'yes' === this.model.attributes.params.spacing ) {
					existingSpacing = '4%';
				}

				columnWidth = this.model.attributes.params.type;

				switch ( columnWidth ) {
				case '1_1':
					columnSize     = '100%';
					fullcolumnSize = '100%';
					break;
				case '1_4':
					columnSize     = '22%';
					fullcolumnSize = '25%';
					break;
				case '3_4':
					columnSize     = '74%';
					fullcolumnSize = '75%';
					break;
				case '1_2':
					columnSize     = '48%';
					fullcolumnSize = '50%';
					break;
				case '1_3':
					columnSize     = '30.6666%';
					fullcolumnSize = '33.3333%';
					break;
				case '2_3':
					columnSize     = '65.3333%';
					fullcolumnSize = '66.6666%';
					break;
				case '1_5':
					columnSize     = '16.8%';
					fullcolumnSize = '20%';
					break;
				case '2_5':
					columnSize     = '37.6%';
					fullcolumnSize = '40%';
					break;
				case '3_5':
					columnSize     = '58.4%';
					fullcolumnSize = '60%';
					break;
				case '4_5':
					columnSize     = '79.2%';
					fullcolumnSize = '80%';
					break;
				case '5_6':
					columnSize     = '82.6666%';
					fullcolumnSize = '83.3333%';
					break;
				case '1_6':
					columnSize     = '13.3333%';
					fullcolumnSize = '16.6666%';
					break;
				}

				if ( '4%' !== existingSpacing && ( ! this.model.attributes.params.last || allNo ) ) {
					columnSize = fullcolumnSize;
				}

				this.$el.css( 'width', columnSize );
				$placeholder.css( 'width', columnSize );

				spacingDirection = 'right';
				if ( FusionPageBuilderApp.$el.hasClass( 'rtl' ) ) {
					spacingDirection = 'left';
				}
				$placeholder.css( 'margin-' + spacingDirection, existingSpacing );
				this.$el.css( 'margin-' + spacingDirection, existingSpacing );
			},

			/**
			 * Column spacing dimensions version.
			 *
			 * @since 2.0.0
			 * @return {void}
			 */
			dimensionColumnSpacing: function( columnRow, columnWidth, $placeholder ) {
				var decimalWidth,
					check,
					spacingWidth,
					existingSpacing,
					spacings = [],
					spacingDirection;

				// Remove last from calcs.
				columnRow.pop();

				columnWidth  = columnWidth[ 0 ] / columnWidth[ 1 ];
				decimalWidth = columnWidth;

				if ( 'object' === typeof columnRow ) {
					check = columnRow.every( this.pxCheck );
					if ( check ) {
						spacingWidth = ( columnRow.reduce( this.addValues, 0 ) * decimalWidth ) + 'px';
						this.$el.css( 'width', 'calc( ' + ( columnWidth * 100 ) + '% - ' + spacingWidth + ' )' );
						$placeholder.css( 'width', 'calc( ' + ( columnWidth * 100 ) + '% - ' + spacingWidth + ' )' );
					} else if ( columnRow.every( this.percentageCheck ) ) {
						columnWidth = ( columnWidth * 100 ) - ( columnRow.reduce( this.addValues, 0 ) * decimalWidth );
						this.$el.css( 'width', columnWidth + '%' );
						$placeholder.css( 'width', columnWidth + '%' );
					} else {

						_.each( columnRow, function( space ) {
							space = ( 'undefined' === typeof space || '' === space ) ? '4%' : space;
							spacings.push( space );
						} );

						spacingWidth = spacings.join( ' + ' );
						this.$el.css( 'width', 'calc( ' + ( columnWidth * 100 ) + '% - ( ( ' + spacingWidth + ' ) * ' + decimalWidth + ' )' );
						$placeholder.css( 'width', 'calc( ' + ( columnWidth * 100 ) + '% - ( ( ' + spacingWidth + ' ) * ' + decimalWidth + ' )' );
					}
				}

				existingSpacing = this.model.attributes.params.spacing;
				if ( 'undefined' === typeof this.model.attributes.params.spacing || 'yes' === this.model.attributes.params.spacing || '' === this.model.attributes.params.spacing ) {
					existingSpacing = '4%';
				}
				if ( 'no' === this.model.attributes.params.spacing ) {
					existingSpacing = '0';
				}

				spacingDirection = 'right';
				if ( FusionPageBuilderApp.$el.hasClass( 'rtl' ) ) {
					spacingDirection = 'left';
				}
				$placeholder.css( 'margin-' + spacingDirection, existingSpacing );
				this.$el.css( 'margin-' + spacingDirection, existingSpacing );
			},

			/**
			 * Check if value is valid for column spacing.
			 *
			 * @since 2.0.0
			 * @return {void}
			 */
			validColumnSpacing: function( value ) {
				if ( 'yes' !== value && 'no' !== value && ! ( /\d/ ).test( value ) && '' !== value ) {
					return false;
				}
				return true;
			},

			/**
			 * Filter out DOM before patching.
			 *
			 * @since 2.0.0
			 * @return {void}
			 */
			patcherFilter: function( diff ) {
				var filteredDiff = [],
					self = this;

				_.each( diff, function( info ) {
					if ( 'removeElement' === info.action ) {
						if ( 'undefined' !== typeof info.element.attributes[ 'class' ] &&
							(
								-1 !== info.element.attributes[ 'class' ].indexOf( 'fusion-column-content-centered' ) ||
								-1 !== info.element.attributes[ 'class' ].indexOf( 'fusion-builder-column-content' ) ||
								-1 !== info.element.attributes[ 'class' ].indexOf( 'fusion-column-wrapper' )
							)
						) {
							self.forceAppendChildren = true;
							filteredDiff.push( info );
						} else if (
							'undefined' !== typeof info.element.attributes[ 'class' ] &&
							(
								-1 !== info.element.attributes[ 'class' ].indexOf( 'fusion-spacing-value' ) ||
								-1 !== info.element.attributes[ 'class' ].indexOf( 'fusion-element-spacing' ) ||
								-1 !== info.element.attributes[ 'class' ].indexOf( 'fusion-builder-live-element' ) ||
								-1 !== info.element.attributes[ 'class' ].indexOf( 'fusion_builder_row_inner' )
							)
						) {

							// ignore
						} else {
							filteredDiff.push( info );
						}
					} else if ( 'addElement' === info.action ) {
						if ( 'undefined' !== typeof info.element.attributes[ 'class' ] &&
							(
								-1 !== info.element.attributes[ 'class' ].indexOf( 'fusion-column-content-centered' ) ||
								-1 !== info.element.attributes[ 'class' ].indexOf( 'fusion-builder-column-content' ) ||
								-1 !== info.element.attributes[ 'class' ].indexOf( 'fusion-column-wrapper' )
							)
						) {
							self.forceAppendChildren = true;
							filteredDiff.push( info );
						} else if ( 'undefined' !== typeof info.element.attributes[ 'class' ] && ( -1 !== info.element.attributes[ 'class' ].indexOf( 'fusion-spacing-value' ) || -1 !== info.element.attributes[ 'class' ].indexOf( 'fusion-element-spacing' ) ) ) {

							// ignore
						} else {
							filteredDiff.push( info );
						}
					} else {
						filteredDiff.push( info );
					}
				} );

				return filteredDiff;
			},

			/**
			 * Adds a delay to the change trigger to accomodate equal-heights implementation.
			 *
			 * @since 2.0.0
			 * @param {number|string} cid - The CID of the element.
			 * @return {void}
			 */
			equalHeights: function( cid ) {
				cid = 'undefined' === typeof cid ? this.model.attributes.cid : cid;
				setTimeout( function() {
					jQuery( document ).trigger( 'fusion-content-changed', cid );
					jQuery( window ).trigger( 'fusion-content-changed', cid );
					jQuery( '#fb-preview' )[ 0 ].contentWindow.jQuery( 'body' ).trigger( 'fusion-content-changed', cid );
				}, 300 );
			},

			/**
			 * Removes the 'active' class.
			 *
			 * @since 2.0.0
			 * @return {void}
			 */
			toolTipHide: function() {
				this.$el.find( '.fusion-spacing-tooltip, .fusion-column-spacing' ).removeClass( 'active' );
			},

			/**
			 * Resize spacer on window resize event.
			 *
			 * @since 2.0.0
			 * @return {void}
			 */
			resizeSpacer: function() {
				if ( this.columnSpacer ) {
					this.columnSpacing();
				}
			},

			/**
			 * Preview column-spacing changes.
			 *
			 * @since 2.0.0
			 * @param {Object} columnRow - The row.
			 * @return {void}
			 */
			columnSpacingPreview: function( columnRow ) {
				var columnWidth = 'undefined' !== typeof this.model.attributes.params.type ? this.model.attributes.params.type.split( '_' ) : [ '1', '1' ],
					fallback = true,
					origValue,
					$placeholder = jQuery( '.fusion-builder-column-placeholder[data-cid="' + this.model.get( 'cid' ) + '"]' ),
					allNo = true;

				_.each( columnRow, function( value, index ) {
					origValue          = value;
					value              = ( 'yes' === value ) ? '4%' : value;
					value              = ( 'no' === value ) ? '0' : value;
					fallback           = fallback && origValue !== value;
					allNo              = allNo && 0 === parseInt( value, 10 );
					columnRow[ index ]   = value;
				} );

				if ( ! fallback ) {
					this.dimensionColumnSpacing( columnRow, columnWidth, $placeholder );
				} else {
					this.fallbackColumnSpacing( $placeholder, allNo );
				}
			},

			/**
			 * Gets the column content.
			 * Alias of getColumnContent method.
			 *
			 * @since 2.0.0
			 * @return {string}
			 */
			getContent: function() {
				return this.getColumnContent();
			},

			/**
			 * Sets the attributes of an element.
			 *
			 * @since 2.0.0
			 * @param {Object} element - The element we're updating.
			 * @param {Object} attributes - The attributes we're setting/updating.
			 * @return {void}
			 */
			setElementAttributes: function( element, attributes ) {
				var self = this;

				element.removeClass( this.currentClasses );

				if ( 'object' === typeof attributes && element.length ) {
					_.each( attributes, function( values, attribute ) {
						if ( 'class' === attribute ) {
							self.currentClasses = values;
							element.addClass( values );
						} else if ( 'id' === attribute ) {
							element.attr( 'id', values );
						} else if ( 'style' === attribute ) {
							element.attr( 'style', values );
						} else if ( -1 !== attribute.indexOf( 'data' ) ) {
							attribute = attribute.replace( /_/g, '-' );
							element.attr( attribute, values );
						}
					} );
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
				//console.warn( JSON.parse( value ));
				value = value || this.values.render_logics;
				let renderLogics = value && this.IsJsonString( atob( value ) ) ? JSON.parse( atob( value ) ) : [];

				// Get device Render logics only.
				renderLogics = renderLogics.filter( ( r ) => 'device_type' === r.field );

				return renderLogics;
			}
		} );
	} );
}( jQuery ) );
