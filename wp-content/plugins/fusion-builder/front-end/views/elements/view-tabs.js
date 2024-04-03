var FusionPageBuilder = FusionPageBuilder || {};

( function() {

	jQuery( document ).ready( function() {

		// Tabs View.
		FusionPageBuilder.fusion_tabs = FusionPageBuilder.ParentElementView.extend( {

			/**
			 * Runs during render() call.
			 *
			 * @since 2.0
			 * @return {void}
			 */
			onRender: function() {
				var $this = this;

				jQuery( window ).on( 'load', function() {
					$this._refreshJs();
				} );
			},

			/**
			 * Runs after view DOM is patched.
			 *
			 * @since 2.0
			 * @return {void}
			 */
			afterPatch: function() {
				var self     = this,
					children = window.FusionPageBuilderViewManager.getChildViews( this.model.get( 'cid' ) );

				this.appendChildren( '.nav-tabs' );

				_.each( children, function( child ) {
					self.appendContents( child );
				} );

				this._refreshJs();
			},

			refreshJs: function() {
				jQuery( '#fb-preview' )[ 0 ].contentWindow.jQuery( 'body' ).trigger( 'fusion-element-render-fusion_tabs', this.model.attributes.cid );

				this.checkActiveTab();
			},

			/**
			 * Find the active tab.
			 *
			 * @since 2.0
			 * @return {void}
			 */
			getActiveTab: function() {
				var self     = this,
					children = window.FusionPageBuilderViewManager.getChildViews( this.model.get( 'cid' ) );

				_.each( children, function( child ) {
					if ( child.$el.hasClass( 'active' ) ) {
						self.model.set( 'activeTab', child.model.get( 'cid' ) );
					}
				} );
			},

			/**
			 * Set tab as active.
			 *
			 * @since 2.0
			 * @return {void}
			 */
			checkActiveTab: function() {
				var self = this,
					children = window.FusionPageBuilderViewManager.getChildViews( this.model.get( 'cid' ) ),
					activeTab = this.model.get( 'activeTab' ) || self.$el.find( '.nav-tabs li.active' ).data( 'cid' );

				if ( 'undefined' !== activeTab ) {
					_.each( children, function( child ) {
						child.checkActive( activeTab );
					} );
					self.$el.find( '.fusion-extra-' + activeTab ).addClass( 'active in' );
				} else {
					_.each( children, function( child ) {
						if ( child.isFirstChild() ) {
							const tabPane = self.$el.find( '.fusion-extra-' + child.model.get( 'cid' ) );
							const tabLi = self.$el.find( 'a[href="#' + tabPane.attr( 'id' ) + '"]' ).parent( 'li' );
							tabPane.addClass( 'active in' );
							tabLi.addClass( 'active' );

						}
					} );
				}
			},

			/**
			 * Modify template attributes.
			 *
			 * @since 2.0
			 * @param {Object} atts - The attributes.
			 * @return {Object} - Returns the attributes.
			 */
			filterTemplateAtts: function( atts ) {
				this.values = atts.values;

				// Create attribute objects.
				atts.tabsShortcode   = this.buildTabsShortcodeAttrs( atts.values );
				atts.justifiedClass  = this.setJustifiedClass( atts.values );

				this.model.set( 'first', true );


				atts.cid             = this.model.get( 'cid' );
				return atts;
			},

			/**
			 * Builds attributes.
			 *
			 * @since 2.0
			 * @param {Object} values - The values.
			 * @return {Object} - Returns the shortcode object.
			 */
			buildTabsShortcodeAttrs: function( values ) {

				// TabsShortcode  Attributes.
				var tabsShortcode = _.fusionVisibilityAtts( values.hide_on_mobile, {
					class: 'fusion-tabs fusion-tabs-cid' + this.model.get( 'cid' ) + ' ' + values.design,
					style: ''
				} );

				if ( 'yes' !== values.justified && 'vertical' !== values.layout ) {
					tabsShortcode[ 'class' ] += ' nav-not-justified';
				}

				if ( 'yes' === values.justified && 'vertical' !== values.layout ) {
					tabsShortcode[ 'class' ] += ' nav-is-justified';
				}

				if ( '' !== values.icon_position ) {
					tabsShortcode[ 'class' ] += ' icon-position-' + values.icon_position;
				}

				if ( '' !== values[ 'class' ] ) {
					tabsShortcode[ 'class' ] += ' ' + values[ 'class' ];
				}

				if ( '' !== values.mobile_mode ) {
					tabsShortcode[ 'class' ] += ' mobile-mode-' + values.mobile_mode;
				}

				if ( 'carousel' === values.mobile_mode && 'yes' === values.mobile_sticky_tabs ) {
					tabsShortcode[ 'class' ] += ' mobile-sticky-tabs';
				}

				tabsShortcode[ 'class' ] += ( 'vertical' === values.layout ) ? ' vertical-tabs' : ' horizontal-tabs';

				if ( 'no' == values.show_tab_titles ) {
					tabsShortcode[ 'class' ] += ' woo-tabs-hide-headings';
				}

				if ( '' !== values.id ) {
					tabsShortcode.id = values.id;
				}

				// Icon color.
				tabsShortcode.style += '' !== values.icon_color ? '--icon-color:' + values.icon_color + ';' : '';

				// Active icon color.
				tabsShortcode.style += '' !== values.active_icon_color ? '--icon-active-color:' + values.active_icon_color + ';' : '';

				tabsShortcode.style += this.getStyleVariables( values );

				return tabsShortcode;
			},


			/**
			 * Set class.
			 *
			 * @since 2.0
			 * @param {Object} values - The values.
			 * @return {string} - Returns a string containing the CSS classes.
			 */
			setJustifiedClass: function( values ) {
				var justifiedClass = '';

				if ( 'yes' === values.justified && 'vertical' !== values.layout ) {
					justifiedClass = ' nav-justified';
				}

				return justifiedClass;
			},

			onInit: function() {
				var params = this.model.get( 'params' );

				// Check for newer margin params.  If unset but regular is, copy from there.
				if ( 'object' === typeof params ) {

					// Split border width into 4.
					if ( 'undefined' === typeof params.alignment && 'clean' === params.design ) {
						params.alignment = 'center';
					}

					this.model.set( 'params', params );
				}

				this.listenTo( window.FusionEvents, 'fusion-preview-viewport-update', this.onChangeDevice );

			},
			onChangeDevice() {
				const device = jQuery( '.viewport-indicator span.active' ).data( 'indicate-viewport' );
				const values = this.model.get( 'params' );
				// Hide active toggle content panels from desktop.
				if ( 'toggle' === values.mobile_mode && 'desktop' === device ) {
					const activeId = this.$el.find( '.nav li.active' ).data( 'cid' );

					this.$el.find( '.tab-pane' ).removeClass( 'active in' );
					this.$el.find( '.tab-pane#tabcid' + activeId ).addClass( 'active in' );

					this.$el.find( '.fusion-mobile-tab-nav li' ).removeClass( 'active' );
					this.$el.find( '.fusion-mobile-tab-nav li a[href="#tabcid' + activeId + '"]' ).parent().addClass( 'active' );
				}
			},

			/**
			 * Gets style variables.
			 *
			 * @since 3.9
			 * @param {Object} values - The values.
			 * @return {String}
			 */
			getStyleVariables: function( values ) {
				const cssVarsOptions = [
					'alignment',
					'title_text_transform',
					'title_line_height'
				];

				cssVarsOptions.margin_top    = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.margin_right  = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.margin_bottom = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.margin_left   = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.margin_top_medium    = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.margin_right_medium  = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.margin_bottom_medium = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.margin_left_medium   = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.margin_top_small    = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.margin_right_small  = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.margin_bottom_small = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.margin_left_small   = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.title_border_radius_top_left   = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.title_border_radius_top_right   = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.title_border_radius_bottom_right   = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.title_border_radius_bottom_left   = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.content_padding_top   = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.content_padding_right   = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.content_padding_bottom   = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.content_padding_left   = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.content_padding_top_medium   = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.content_padding_right_medium   = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.content_padding_bottom_medium   = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.content_padding_left_medium   = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.content_padding_top_small   = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.content_padding_right_small   = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.content_padding_bottom_small   = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.content_padding_left_small   = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.title_padding_top   = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.title_padding_right   = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.title_padding_bottom   = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.title_padding_left   = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.title_padding_top_medium   = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.title_padding_right_medium   = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.title_padding_bottom_medium   = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.title_padding_left_medium   = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.title_padding_top_small   = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.title_padding_right_small   = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.title_padding_bottom_small   = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.title_padding_left_small   = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.title_font_size   = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.title_letter_spacing   = { 'callback': _.fusionGetValueWithUnit };

				const customVars = [];

				if ( values.inactivecolor ) {
					customVars.inactive_color = values.inactivecolor;
				}
				if ( values.title_text_color ) {
					customVars.title_text_color = values.title_text_color;
				}
				if ( values.title_active_text_color ) {
					customVars.title_active_text_color = values.title_active_text_color;
				}

				customVars.background_color = values.backgroundcolor;
				customVars.border_color = values.bordercolor;
				customVars.active_border_color = values.active_border_color;

				return this.getCssVarsForOptions( cssVarsOptions ) + this.getCustomCssVars( customVars ) + this.getFontStylingVars( 'title_font', values );
			}

		} );
	} );
}( jQuery ) );
