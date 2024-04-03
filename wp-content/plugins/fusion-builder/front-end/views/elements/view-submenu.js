/* global FusionApp, fusionAllElements, FusionPageBuilderApp */
var FusionPageBuilder = FusionPageBuilder || {};

( function () {

	jQuery( document ).ready( function () {

		FusionPageBuilder.fusion_submenu = FusionPageBuilder.ElementView.extend( {

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

				// Force opacity submenu transition for vertical menus.
				this.values.expand_transition = 'row' !== this.values.direction ? 'opacity' : this.values.expand_transition;

				attributes.attr = this.buildAttr();

				attributes.menuMarkup         = 'undefined' !== typeof atts.query_data && 'undefined' !== typeof atts.query_data.menu_markup ? atts.query_data.menu_markup : 'No menu markup';
				return attributes;
			},

			isDefault: function( param ) {
				return this.values[ param ] === fusionAllElements.fusion_submenu.defaults[ param ];
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
							'awb-submenu',
							'awb-submenu_' + this.values.direction,
							'awb-submenu_icons-' + this.values.icons_position,
							'awb-submenu_dc-' + this.values.dropdown_carets
						].join( ' ' ),
						style: ''
					},
					cssVarsOptions,
					cssVariables,
					self = this;

				let expandMethod = this.values.expand_method;
				if ( 'stacked' === this.values.submenu_mode && 'column' === this.values.direction ) {
					attr[ 'class' ] += ' awb-submenu_v-stacked';
					if ( 'always' === this.values.stacked_expand_method ) {
						attr[ 'class' ] += ' awb-submenu_em-always';
					}
					expandMethod = this.values.stacked_expand_method;

					if ( 'always' === this.values.stacked_expand_method ) {
						expandMethod = 'click';
					}

					if ( 'click' === this.values.stacked_expand_method ) {
						attr[ 'class' ] += ' awb-submenu_cm_' + this.values.stacked_click_mode;
					}
				} else {
					attr[ 'class' ] += ' awb-submenu_dropdown';
					attr[ 'class' ] += ' awb-submenu_expand-' + this.values.expand_direction;
					attr[ 'class' ] += ' awb-submenu_transition-' + this.values.expand_transition;
				}


				attr[ 'class' ] += ' awb-submenu_em-' + expandMethod;


				attr[ 'data-cid' ] = this.model.get( 'cid' );

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

				cssVarsOptions = [
					'line_height',
					'transition_time',
					'fusion_font_family_typography',
					'fusion_font_variant_typography',
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
					'submenu_items_padding_top',
					'submenu_items_padding_right',
					'submenu_items_padding_bottom',
					'submenu_items_padding_left',
					'fusion_font_family_submenu_typography',
					'fusion_font_variant_submenu_typography',
					'submenu_active_bg',
					'submenu_active_color',
					'submenu_space',
					'submenu_text_transform',
					'submenu_line_height',
					'submenu_letter_spacing',
					'submenu_max_width',
					'icons_size',
					'icons_color',
					'icons_hover_color',
					'main_justify_content',
					'sub_justify_content',
					'sticky_min_height',
					'stacked_submenu_indent'
				];

				cssVarsOptions.margin_top   = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.margin_bottom   = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.items_padding_top   = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.items_padding_bottom   = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.items_padding_left   = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.items_padding_right   = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.gap   = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.font_size   = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.min_height   = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.border_top   = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.border_bottom   = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.border_left   = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.border_right   = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.active_border_top   = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.active_border_bottom   = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.active_border_left   = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.active_border_right   = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.border_radius_top_left   = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.border_radius_top_right   = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.border_radius_bottom_right   = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.border_radius_bottom_left   = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.submenu_border_radius_top_left   = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.submenu_border_radius_top_right   = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.submenu_border_radius_bottom_right   = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.submenu_border_radius_bottom_left   = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.submenu_space   = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.submenu_items_padding_top   = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.submenu_items_padding_bottom   = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.submenu_items_padding_left   = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.submenu_items_padding_right   = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.submenu_font_size   = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.thumbnail_size_width   = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.thumbnail_size_height   = { 'callback': _.fusionGetValueWithUnit };

				attr.style += this.getCssVarsForOptions( cssVarsOptions );
				cssVariables = {};

				// Add box shadow as a full string.
				if ( 'yes' === this.values.box_shadow ) {
					cssVariables.box_shadow = _.fusionGetBoxShadowStyle( this.values );
				}

				jQuery.each( _.fusionGetFontStyle( 'typography', self.values, 'object' ), function( rule, value ) {
					cssVariables[ 'fusion-' + rule + '-typography' ] = value;
				} );
				jQuery.each( _.fusionGetFontStyle( 'submenu_typography', self.values, 'object' ), function( rule, value ) {
					cssVariables[ 'fusion-' + rule + '-submenu-typography' ] = value;
				} );

				attr.style += this.getCustomCssVars( cssVariables );

				return attr;
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
			}
		} );
	} );
}( jQuery ) );
