/* global FusionApp, fusionAllElements, fusionSanitize */
var FusionPageBuilder = FusionPageBuilder || {};

( function () {

	jQuery( document ).ready( function () {

		FusionPageBuilder.fusion_menu = FusionPageBuilder.ElementView.extend( {

			onRender: function() {
				var self = this;
				setTimeout( function() {
					jQuery( '#fb-preview' )[ 0 ].contentWindow.jQuery( 'body' ).trigger( 'fusion-element-render-fusion_menu', self.model.get( 'cid' ) );
				}, 300 );
			},

			/**
			 * Modify template attributes.
			 *
			 * @since 3.0
			 * @param {Object} atts - The attributes object.
			 * @return {Object}
			 */
			filterTemplateAtts: function ( atts ) {
				var attributes = {};

				this.values = atts.values;

				// Force click expand mode if submenu flyout is enabled.
				this.values.expand_method = 'flyout' === this.values.submenu_mode ? 'click' : this.values.expand_method;

				// Disable box shadow for flyout submenus.
				this.values.box_shadow = 'flyout' === this.values.submenu_mode ? 'no' : this.values.box_shadow;

				// Force opacity submenu transition for vertical menus.
				this.values.expand_transition = 'row' !== this.values.direction ? 'opacity' : this.values.expand_transition;

				attributes.attr = this.buildAttr();

				attributes.menuMarkup         = 'undefined' !== typeof atts.query_data && 'undefined' !== typeof atts.query_data.menu_markup ? atts.query_data.menu_markup : 'No menu markup';
				attributes.buttonMarkup       = 'undefined' !== typeof atts.query_data && 'undefined' !== typeof atts.query_data.button_markup ? atts.query_data.button_markup : 'No button markup';
				attributes.flyoutButtonMarkup = 'undefined' !== typeof atts.query_data && 'undefined' !== typeof atts.query_data.flyout_button_markup ? atts.query_data.flyout_button_markup : 'No flyout button markup';

				return attributes;
			},

			isDefault: function( param ) {
				return this.values[ param ] === fusionAllElements.fusion_menu.defaults[ param ];
			},

			/**
			 * Builds attributes.
			 *
			 * @since 3.0
			 * @return {Object}
			 */
			buildAttr: function () {

				var attr = {
						class: [
							'awb-menu',
							'awb-menu_' + this.values.direction,
							'mobile-mode-' + this.values.mobile_nav_mode,
							'awb-menu_icons-' + this.values.icons_position,
							'awb-menu_dc-' + this.values.dropdown_carets,
							'mobile-trigger-fullwidth-' + this.values.mobile_nav_trigger_fullwidth
						].join( ' ' ),
						style: ''
					},
					self = this,
					cssVariables;

				let expandMethod = this.values.expand_method;
				if  ( 'column' === this.values.direction && 'stacked' === this.values.submenu_mode ) {
					expandMethod = this.values.stacked_expand_method;

					if ( 'always' === this.values.stacked_expand_method ) {
						expandMethod = 'click';
					}

					if ( 'click' === this.values.stacked_expand_method ) {
						attr[ 'class' ] += ' awb-submenu_cm_' + this.values.stacked_click_mode;
					}
				}

				// Active, inherit from default.
				if ( '' === this.values.active_color && '' !== this.values.color ) {
					this.values.active_color = this.values.color;
				}

				attr['class'] += 'yes' === this.values.close_on_outer_click_stacked || 'yes' === this.values.close_on_outer_click ? ' close-on-outer-click-yes' : '';

				attr['class'] += ' awb-menu_em-' + expandMethod;

				if ( 'on' === this.values.mobile_indent_submenu ) {
					attr[ 'class' ] += ' awb-menu_indent-' + this.values.mobile_justify_content;
				}

				if ( 'on' === this.values.mobile_nav_trigger_fullwidth ) {
					attr[ 'class' ] += ' awb-menu_mt-fullwidth';
				}

				// The size options are only relevant for collapse to button.
				if ( 'collapse-to-button' === this.values.mobile_nav_mode ) {
					attr[ 'class' ] +=  ' mobile-size-' + this.values.mobile_nav_size;
				}

				// If we have a breakpoint and load is a mobile, set to default as collapse-enabled.
				attr[ 'class' ] += ' awb-menu_desktop';

				if ( 'object' === typeof this.values.arrows ) {
					this.values.arrows = this.values.arrows.join( ',' );
				}

				if ( this.values.arrows.includes( 'active' ) ) {
					attr[ 'class' ] += ' awb-menu_arrows-active';
				}

				if ( this.values.arrows.includes( 'main' ) ) {
					attr[ 'class' ] += ' awb-menu_arrows-main';
				}

				if ( this.values.arrows.includes( 'submenu' ) ) {
					attr[ 'class' ] += ' awb-menu_arrows-sub';
				}

				if ( 'flyout' === this.values.submenu_mode ) {
					attr[ 'class' ] += ' awb-menu_flyout';
					attr[ 'class' ] += ' awb-menu_flyout__' + this.values.submenu_flyout_direction;
				} else if ( 'stacked' === this.values.submenu_mode ) {
					attr[ 'class' ] += ' awb-menu_v-stacked';
					if ( 'always' === this.values.stacked_expand_method ) {
						attr[ 'class' ] += ' awb-menu_em-always';
					}
				}

				if ( 'dropdown' === this.values.submenu_mode ) {
					attr[ 'class' ] += ' awb-menu_dropdown';
					attr[ 'class' ] += ' awb-menu_expand-' + this.values.expand_direction;
					attr[ 'class' ] += ' awb-menu_transition-' + this.values.expand_transition;
				}

				attr[ 'data-cid' ] = this.model.get( 'cid' );

				[ 'typography', 'submenu_typography', 'mobile_typography' ].forEach( ( typoVar ) => {
					if ( self.values[ 'fusion_font_family_' + typoVar ].includes( 'var(' ) ) {
						self.values[ 'fusion_font_variant_' + typoVar ] = window.awbTypographySelect.getVarString( self.values[ 'fusion_font_family_' + typoVar ], 'font-weight' );
					}
				} );

				if ( 'small' === this.values.breakpoint ) {
					attr[ 'data-breakpoint' ] = FusionApp.settings.visibility_small;
				} else if ( 'medium' === this.values.breakpoint ) {
					attr[ 'data-breakpoint' ] = FusionApp.settings.visibility_medium;
				} else if ( 'large' === this.values.breakpoint ) {
					attr[ 'data-breakpoint' ] = 10000;
				} else if ( 'custom' === this.values.breakpoint ) {
					attr[ 'data-breakpoint' ] = parseInt( this.values.custom_breakpoint );
				}

				attr[ 'class' ] += _.fusionGetStickyClass( this.values.sticky_display );

				attr[ 'data-transition-type' ] = this.values.transition_type;

				if ( '' !== this.values[ 'class' ] ) {
					attr[ 'class' ] += ' ' + this.values[ 'class' ];
				}

				if ( '' !== this.values.id ) {
					attr.id = this.values.id;
				}

				attr = _.fusionAnimations( this.values, attr );
				attr = _.fusionVisibilityAtts( this.values.hide_on_mobile, attr );

				this.values.main_justify_content = this.values.main_justify_content.replace( 'left', 'flex-start' ).replace( 'right', 'flex-end' );
				this.values.sub_justify_content  = this.values.sub_justify_content.replace( 'left', 'flex-start' ).replace( 'right', 'flex-end' );

				attr.style += this.getStyleVariables();

				return attr;
			},

			/**
			 * Gets style variables.
			 *
			 * @since 3.9
			 * @return {String}
			 */
			getStyleVariables: function() {
				var customVars = [],
					cssVarsOptions,
					self = this;

				customVars.mobile_justify     = this.values.mobile_justify_content;
				customVars.mobile_caret_left  = 'auto';
				customVars.mobile_caret_right = '0';

				if ( jQuery( 'body' ).hasClass( 'rtl' ) ) {
					customVars.mobile_justify = customVars.mobile_justify.replace( 'left', 'flex-end' ).replace( 'right', 'flex-start' );
					if ( 'flex-end' !== customVars.mobile_justify ) {
						customVars.mobile_caret_left  = '0';
						customVars.mobile_caret_right = 'auto';
					}
				} else {
					customVars.mobile_justify = customVars.mobile_justify.replace( 'left', 'flex-start' ).replace( 'right', 'flex-end' );
					if ( 'flex-end' === customVars.mobile_justify ) {
						customVars.mobile_caret_left  = '0';
						customVars.mobile_caret_right = 'auto';
					}
				}

				// Add box shadow as a full string.
				if ( 'yes' === this.values.box_shadow ) {
					customVars.box_shadow = _.fusionGetBoxShadowStyle( this.values );
				}

				jQuery.each( _.fusionGetFontStyle( 'typography', self.values, 'object' ), function( rule, value ) {
					customVars[ 'fusion-' + rule + '-typography' ] = value;
				} );
				jQuery.each( _.fusionGetFontStyle( 'submenu_typography', self.values, 'object' ), function( rule, value ) {
					customVars[ 'fusion-' + rule + '-submenu-typography' ] = value;
				} );
				jQuery.each( _.fusionGetFontStyle( 'mobile_typography', self.values, 'object' ), function( rule, value ) {
					customVars[ 'fusion-' + rule + '-mobile-typography' ] = value;
				} );

				cssVarsOptions = [
					'line_height',
					'transition_time',
					'text_transform',
					'bg',
					'align_items',
					'justify_content',
					'border_color',
					'color',
					'active_color',
					'active_bg',
					'active_border_color',
					'submenu_color',
					'submenu_bg',
					'submenu_sep_color',
					'submenu_active_bg',
					'submenu_active_color',
					'submenu_space',
					'submenu_text_transform',
					'submenu_line_height',
					'icons_size',
					'icons_color',
					'icons_hover_color',
					'main_justify_content',
					'sub_justify_content',
					'mobile_nav_button_align_hor',
					'mobile_bg',
					'mobile_color',
					'mobile_active_bg',
					'mobile_active_color',
					'mobile_trigger_color',
					'mobile_trigger_background_color',
					'mobile_text_transform',
					'mobile_line_height',
					'mobile_sep_color',
					'flyout_close_color',
					'flyout_active_close_color',
					'justify_title',
				];

				cssVarsOptions.font_size   = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.margin_top   = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.margin_bottom   = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.min_height   = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.border_radius_top_left   = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.border_radius_top_right   = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.border_radius_bottom_right   = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.border_radius_bottom_left   = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.gap   = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.items_padding_top   = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.items_padding_right   = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.items_padding_bottom   = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.items_padding_left   = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.border_top   = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.border_right   = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.border_bottom   = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.border_left   = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.letter_spacing   = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.active_border_top   = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.active_border_right   = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.active_border_bottom   = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.active_border_left   = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.submenu_items_padding_top   = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.submenu_items_padding_right   = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.submenu_items_padding_bottom   = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.submenu_items_padding_left   = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.submenu_border_radius_top_left   = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.submenu_border_radius_top_right   = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.submenu_border_radius_bottom_right   = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.submenu_border_radius_bottom_left   = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.submenu_font_size   = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.submenu_letter_spacing   = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.submenu_max_width   = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.arrows_size_height   = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.arrows_size_width   = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.push( 'mobile_nav_items_height' ); // Don't do sanitation here, because of the calc already forcing to "px".
				cssVarsOptions.mobile_trigger_font_size   = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.trigger_padding_top   = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.trigger_padding_right   = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.trigger_padding_bottom   = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.trigger_padding_left   = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.mobile_nav_trigger_bottom_margin   = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.mobile_font_size   = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.mobile_letter_spacing   = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.mobile_sticky_max_height   = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.thumbnail_size_width   = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.thumbnail_size_height   = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.sticky_min_height   = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.stacked_submenu_indent   = { 'callback': _.fusionGetValueWithUnit };

				return this.getCssVarsForOptions( cssVarsOptions ) + this.getCustomCssVars( customVars );
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

					if ( '' !== values.menu ) {
						// If its not within object already, add it.
						if ( 'undefined' === typeof FusionPageBuilderApp.mediaMap.menus[ values.menu ] ) {
							FusionPageBuilderApp.mediaMap.menus[ values.menu ] = true;
						}
					}
				}
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
				var $el    = this.$el,
					params = this.model.get( 'params' ),
					hasActiveBorder = false;

				switch ( paramName ) {

				case 'active_border_top':
				case 'active_border_right':
				case 'active_border_bottom':
				case 'active_border_left':

					[ 'active_border_top', 'active_border_right', 'active_border_bottom', 'active_border_left' ].forEach( function( param ) {
						if ( 'string' === typeof params[ param ] && 0 < parseInt( params[ param ] ) ) {
							hasActiveBorder = true;
						}
					} );

					setTimeout( function() {
						if ( hasActiveBorder ) {
							$el.find( '.awb-menu__main-li_with-arrow' ).addClass( 'awb-menu__main-li_active-arrow-border' );
						} else {
							$el.find( '.awb-menu__main-li_active-arrow-border' ).removeClass( 'awb-menu__main-li_active-arrow-border' );
						}
					}, 500 );

					break;
				}

				if ( 'direction' === paramName && 'row' === paramValue && 'stacked' === this.model.attributes.params['submenu_mode'] ) {
					jQuery( '.fusion-builder-option[data-option-id="submenu_mode"]' ).find( 'a[data-value="dropdown"]' ).click();
				}

			}
		} );
	} );
}( jQuery ) );
