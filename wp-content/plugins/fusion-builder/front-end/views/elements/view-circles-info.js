var FusionPageBuilder = FusionPageBuilder || {};

( function() {

	jQuery( document ).ready( function() {

		// Circles info parent View
		FusionPageBuilder.fusion_circles_info = FusionPageBuilder.ParentElementView.extend( {

			/**
			* Child elements count.
			*/
			icons: [],

			/**
			 * Runs after view DOM is patched.
			 *
			 * @since 3.9
			 * @return {void}
			 */
			afterPatch: function() {
				this.appendChildren( '.awb-circles-info-content-wrapper' );

				this._refreshJs();
			},

			/**
			 * Runs when child view is added.
			 *
			 * @since 3.9
			 * @return {void}
			 */
			childViewAdded: function() {
				var self = this;

				setTimeout( function() {
					self.updateList();
				}, 100 );
			},

			/**
			 * Runs when child view is removed.
			 *
			 * @since 3.9
			 * @return {void}
			 */
			childViewRemoved: function() {
				var self = this;

				setTimeout( function() {
					self.updateList();
				}, 100 );
			},

			/**
			 * Runs when child view is cloned.
			 *
			 * @since 3.9
			 * @return {void}
			 */
			childViewCloned: function() {
				var self = this;

				setTimeout( function() {
					self.updateList();
				}, 100 );
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
				attributes.circlesInfoAtts = this.buildAttr( atts );

				// Create HTML.
				attributes.iconsHTML = this.buildIconsHTML();

				return attributes;
			},

			/**
			 * Runs on render.
			 *
			 * @since 3.9
			 * @return {void}
			 */
			onRender: function() {
				this.afterPatch();
			},

			/**
			 * Builds attributes.
			 *
			 * @since 3.9
			 * @param {Object} values - The values object.
			 * @return {Object}
			 */
			buildAttr: function( atts ) {
				const values = atts.values;
				var attr     = _.fusionVisibilityAtts( values.hide_on_mobile, {
						class: 'awb-circles-info awb-circles-info-' + this.model.get( 'cid' ),
						style: ''
					} );


				if ( 'outer-circle' === values.icons_placement ) {
					attr[ 'class' ] += ' icons-on-outer-circle';
				}

				if ( 'yes' === values.auto_rotation ) {
					attr[ 'data-auto-rotation' ] = values.auto_rotation;

					if ( values.auto_rotation_time ) {
						attr[ 'data-auto-rotation-time' ] = values.auto_rotation_time * 1000;
					}

					if ( '' !== values.pause_on_hover ) {
						attr[ 'data-pause-on-hover' ] = values.pause_on_hover;
					}
				}

				if ( '' !== values.activation_type ) {
					attr[ 'data-activation-type' ] = values.activation_type;
				}

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

				if ( 'yes' === values.box_shadow ) {
					attr[ 'class' ] += ' has-box-shadow';
				}

				if ( '' !== values[ 'class' ] ) {
					attr[ 'class' ] += ' ' + values[ 'class' ];
				}

				if ( values.id ) {
					attr.id = values.id;
				}

				attr.style += this.getStyleVariables( values );

				attr = _.fusionAnimations( values, attr );

				return attr;
			},

			/**
			 * Builds icons HTML.
			 *
			 * @since 3.9
			 * @param {Object} values - The values object.
			 * @return {String}
			 */
			buildIconsHTML: function() {
				let iconsHTML = '';
				const self    = this;

				if ( this.model.children.length && this.areIconsChanges() ) {
					this.icons = [];
					_.each( this.model.children.models, function( child ) {
						const params = child.get( 'params' ),
							icon = 'undefined' !== typeof params.icon && '' !== params.icon ? params.icon : self.values.icon;
						if ( '' !== icon ) {
							iconsHTML += '<div class="awb-circles-info-tab-link" data-id="' + child.get( 'counter' ) + '">';
							iconsHTML += '<span><i class="' + _.fusionFontAwesome( icon ) + '"></i></span>';
							iconsHTML += '</div>';
							self.icons.push( icon );
						}
					} );
				} else {
					iconsHTML  = jQuery( this.$el.html() ).find( '.awb-circles-info-icons-wrapper' ).html();
				}

				if ( ! this.model.children.length ) {
					this.icons = [];
					iconsHTML  = '';
				}

				return iconsHTML;
			},

			/**
			 * Checks if icons are updated or not.
			 *
			 * @since 3.9
			 * @return {Bool}
			 */
			areIconsChanges: function() {
				let iconsChanged = false;

				const self       = this;

				if ( this.icons.length !== this.model.children.length ) {
					return true;
				}

				_.each( this.model.children.models, function( child ) {
					var params = child.get( 'params' );
					if ( 'undefined' !== typeof params.icon && '' !== params.icon && ! self.icons.includes( params.icon ) ) {
						iconsChanged = true;
					}
				} );

				if ( ! self.icons.includes( this.values.icon ) ) {
					iconsChanged = true;
				}

				return iconsChanged;
			},

			/**
			 * Updates data attributes.
			 *
			 * @since 3.9
			 * @return {void}
			 */
			updateList: function() {
				var counter = 1,
					self = this;

				this.$el.find( '.awb-circles-info-tab-link' ).each( function() {
					jQuery( this ).attr( 'data-id', counter );
					counter++;
				} );

				counter = 1;
				this.$el.find( '.awb-circles-info-content-area' ).each( function() {
					jQuery( this ).attr( 'data-id', counter );
					counter++;
				} );

				setTimeout( function() {
					var i = 1;
					_.each( self.model.children.models, function( child ) {
						child.set( 'counter', i );
						i++;
					} );
				}, 100 );


			},

			/**
			 * Extendable function for when child elements get generated.
			 *
			 * @since 3.9
			 * @param {Object} modules An object of modules that are not a view yet.
			 * @return {void}
			 */
			onGenerateChildElements: function( modules ) {
				var i = 1;

				// Set child counter. Used for auto rotation.
				_.each( modules, function( child ) {
					child.counter = i;
					i++;
				} );
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
					'icon_circle_color',
					'content_circle_color',
					'content_circle_border_style',
					'icon_border_style',
					'icon_active_border_style',
					'icon_circle_border_style',
					'icon_color',
					'icon_bg_color',
					'icon_border_color',
					'icon_active_color',
					'icon_bg_active_color',
					'icon_border_active_color',
					'box_shadow_color',
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

				cssVarsOptions.max_width               = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.icon_circle_size        = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.content_circle_size     = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.content_padding         = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.icon_size               = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.icon_border_size        = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.box_shadow_horizontal   = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.box_shadow_vertical     = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.box_shadow_blur         = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.box_shadow_spread       = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.margin_top              = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.margin_right            = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.margin_bottom           = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.margin_left             = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.title_font_size         = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.title_letter_spacing    = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.content_font_size       = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.content_line_height     = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.content_letter_spacing  = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.icon_active_border_size = { 'callback': _.fusionGetValueWithUnit };

				return this.getCssVarsForOptions( cssVarsOptions ) + this.getCustomCssVars( customVars );
			}
		} );
	} );
}( jQuery ) );
