/* global fusionAllElements, FusionPageBuilderElements, FusionPageBuilderApp */
var FusionPageBuilder = FusionPageBuilder || {};

( function() {

	jQuery( document ).ready( function() {

		// Toggle child View
		FusionPageBuilder.fusion_image_hotspot_point = FusionPageBuilder.ChildElementView.extend( {

			/**
			 * Modify template attributes.
			 *
			 * @since 3.5
			 * @param {Object} atts - The attributes.
			 * @return {Object}
			 */
			filterTemplateAtts: function( atts ) {

				var attributes  = {},
					parent      = this.model.get( 'parent' ),
					parentModel = FusionPageBuilderElements.find( function( model ) {
						return model.get( 'cid' ) == parent;
					} );

				this.parentValues = jQuery.extend( true, {}, fusionAllElements.fusion_image_hotspots.defaults, _.fusionCleanParameters( parentModel.get( 'params' ) ) );
				this.values = atts.values;

				attributes.cid             = this.model.get( 'cid' );
				attributes.hotspotItemText = atts.values.title;
				attributes.icon            = atts.values.icon;
				attributes.iconAttr        = this.childElemIconAttr( atts.values );

				this.childElemAttr( atts.values );

				return attributes;
			},

			/**
			 * Create the child element attributes.
			 *
			 * @since 3.5
			 * @param {Object} values - The options.
			 * @return {Object}
			 */
			childElemAttr: function( values ) {
				// Using the style attribute, because jQuery methods auto-corrects invalid values.
				var style          = this.getChildInlineStyle( values ),
					placement      = '',
					animationClass = '',
					textArea,
					title,
					popoverContent = values.long_text;

				this.$el.addClass( 'awb-image-hotspots-hotspot' );

				this.$el.addClass( 'awb-image-hotspots-hotspot-' + this.model.get( 'cid' ) );

				animationClass = this.animationToClassName( this.parentValues.items_animation );
				if ( animationClass ) {
					this.$el.addClass( animationClass );
				}

				this.$el.attr( 'style', style );

				try {
					if ( popoverContent && '' !== popoverContent && FusionPageBuilderApp.base64Encode( FusionPageBuilderApp.base64Decode( popoverContent ) ) === popoverContent ) {
						popoverContent = FusionPageBuilderApp.base64Decode( popoverContent );
					}
				} catch ( error ) {
					console.log( error ); // jshint ignore:line
				}

				// Remove the attributes, because this element is not totally replaced.
				this.$el.removeAttr( 'role' );
				this.$el.removeAttr( 'tabindex' );
				this.$el.removeAttr( 'href' );
				this.$el.removeAttr( 'title' );
				this.$el.removeAttr( 'target' );
				this.$el.removeAttr( 'data-awb-toggle-image-hotspot-popover' );
				this.$el.removeAttr( 'data-trigger' );
				this.$el.removeAttr( 'data-title' );
				this.$el.removeAttr( 'data-content' );
				this.$el.removeAttr( 'data-placement' );

				if ( 'link' === values.button_action ) {
					this.$el.attr( 'href', values.link );

					if ( values.link_title ) {
						this.$el.attr( 'title', values.link_title );
					}

					if ( 'new_tab' === values.link_open_method ) {
						this.$el.attr( 'target', '_blank' );
					}
				} else {
					// The title needs to be decoded for special characters.
					textArea = document.createElement( 'textarea' );
					textArea.innerHTML = String( values.long_title ).trim();
					title = textArea.value;
					if ( ! _.isString( title ) ) {
						title = '';
					}

					this.$el.attr( 'role', 'button' );
					this.$el.attr( 'href', '#' );
					this.$el.attr( 'tabindex', '0' );
					this.$el.attr( 'data-awb-toggle-image-hotspot-popover', 'true' );
					this.$el.attr( 'data-trigger', this.parentValues.popover_trigger );
					this.$el.attr( 'data-title', title );
					this.$el.attr( 'data-content', String( popoverContent ).trim() );

					placement = 'auto';
					if ( 'auto' !== values.popover_placement ) {
						placement += ' ' + values.popover_placement;
					}
					this.$el.attr( 'data-placement', placement );
				}

			},

			getChildInlineStyle: function( values ) {
				var cssVarsOptions,
					customVars = {};
				this.values = values;

				cssVarsOptions = [
					'font_size',
					'hotspot_text_color',
					'hotspot_background_color',
					'hotspot_hover_text_color',
					'hotspot_hover_background_color',
					'icon_distance',
					'padding_top',
					'padding_right',
					'padding_bottom',
					'padding_left',
					'border_radius_top_left',
					'border_radius_top_right',
					'border_radius_bottom_right',
					'border_radius_bottom_left'
				];

				if ( ! _.isEmpty( values.pos_x ) ) {
					customVars.pos_x = values.pos_x + '%';
				}

				if ( ! _.isEmpty( values.pos_y ) ) {
					customVars.pos_y = values.pos_y + '%';
				}

				return this.getCssVarsForOptions( cssVarsOptions ) + this.getCustomCssVars( customVars );
			},

			/**
			 * Create the child icon element attributes.
			 *
			 * @since 3.5
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
			 * @since 3.5
			 * @param {string} animationName - The animation name.
			 * @return {string} - Empty string if do not exist.
			 */
			animationToClassName: function( animationName ) {
				if ( 'pumping' === animationName ) {
					return 'awb-image-hotspots-hotspot-anim-pumping';
				}

				if ( 'pulsating' === animationName ) {
					return 'awb-image-hotspots-hotspot-anim-pulsating';
				}

				if ( 'showing' === animationName ) {
					return 'awb-image-hotspots-hotspot-anim-showing';
				}

				if ( 'sonar' === animationName ) {
					return 'awb-image-hotspots-hotspot-anim-sonar';
				}

				if ( 'pumping_showing' === animationName ) {
					return 'awb-image-hotspots-hotspot-anim-pump-showing';
				}

				return '';
			},

			/**
			 * Run after the element has been patched.
			 *
			 * @since 3.5
			 * @return {void}
			 */
			afterPatch: function() {
				var popover = jQuery( '#fb-preview' )[ 0 ].contentWindow.jQuery( this.$el ),
					textArea,
					title,
					popoverData;

				if ( 'link' === this.values.button_action ) {
					popover.popover( 'destroy' );
				} else {
					popover.popover( { html: true } );

					// Change popover placement, via jquery data.
					popoverData = popover.data( 'bs.popover' );
					if ( popoverData && popoverData.options && popover.attr( 'data-placement' ) ) {
						popoverData.options.placement = popover.attr( 'data-placement' );
					}

					// Popover title needs to change manually also.
					if ( popoverData && popoverData.options ) {
						// The title needs to be decoded for special characters.
						textArea = document.createElement( 'textarea' );
						textArea.innerHTML = popover.attr( 'data-title' );
						title = textArea.value;
						if ( ! _.isString( title ) ) {
							title = '';
						}

						popoverData.options.title = title;
					}

					popover.data( 'bs.popover', popoverData );
				}
			},

			onSettingsOpen: function() {
				var self = this;

				setTimeout( function() {
					self.draggable();
				}, 100 );
			},

			onSettingsClose: function() {
				var $el = this.$el;

				if ( ! $el ) {
					return;
				}

				$el.draggable( 'destroy' );
			},

			/**
			 * Make the hotspots draggable.
			 *
			 * @since 3.5
			 * @return {void}
			 */
			draggable: function() {
				var self  = this,
					$el   = this.$el,
					elWidth,
					elHeight,
					imageWidth,
					imageHeight;

				if ( ! $el ) {
					return;
				}

				$el.draggable( {
					zIndex: 999999,
					delay: 100,
					cursorAt: { top: 15, left: 15 },
					scroll: false,
					containment: $el.parent(),
					start: function() {
						$el.parent().css( 'overflow', 'hidden' );
						elWidth     = Math.ceil( $el.outerWidth() );
						elHeight    = Math.ceil( $el.outerHeight() );
						imageWidth  = Math.floor( $el.parent().width() );
						imageHeight = Math.floor( $el.parent().height() );
					},
					drag: function( event, ui ) {
						ui.position.left = Math.min( imageWidth - elWidth, ui.position.left );
						ui.position.top  = Math.min( imageHeight - elHeight,  ui.position.top );

						self.updateDragSettings( '#pos_x', Math.round( ui.position.left / imageWidth * 1000 ) / 10 );
						self.updateDragSettings( '#pos_y', Math.round( ui.position.top / imageHeight * 1000 ) / 10 );
					},
					stop: function() {
						// Remove relative position CSS set by jQuery.
						$el.css( { 'left': '', 'top': '', 'z-index': '' } );
						$el.parent().css( 'overflow', '' );
					}
				} );
			}

		} );
	} );
}( jQuery ) );
