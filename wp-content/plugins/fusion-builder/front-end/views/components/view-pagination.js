var FusionPageBuilder = FusionPageBuilder || {};

( function() {

	jQuery( document ).ready( function() {

		// Pagination view.
		FusionPageBuilder.fusion_tb_pagination = FusionPageBuilder.ElementView.extend( {

			/**
			 * Runs after view DOM is patched.
			 *
			 * @since 3.2
			 * @return {void}
			 */
			afterPatch: function() {
				var $pagination = jQuery( '#fb-preview' )[ 0 ].contentWindow.jQuery( this.$el.find( '.fusion-live-pagination-tb.layout-sticky' ) );

				if ( jQuery( '.fusion-builder-module-settings[data-element-cid="' + this.model.get( 'cid' ) + '"]' ).length ) {
					$pagination.addClass( 'show-live' );
				}
			},

			/**
			 * Modify template attributes.
			 *
			 * @since 2.2
			 * @param {Object} atts - The attributes.
			 * @return {Object}
			 */
			filterTemplateAtts: function( atts ) {

				var attributes = {};

				// Validate values.
				this.validateValues( atts.values );

				this.values = atts.values;

				attributes.wrapperAttr = this.buildAttr( atts.values );
				attributes.label       = window.fusionAllElements[ this.model.get( 'element_type' ) ].name;
				attributes.icon        = window.fusionAllElements[ this.model.get( 'element_type' ) ].icon;

				// Any extras that need passed on.
				attributes.values = atts.values;

				return attributes;
			},

			/**
			 * Modifies the values.
			 *
			 * @since  2.2
			 * @param  {Object} values - The values object.
			 * @return {void}
			 */
			validateValues: function( values ) {
				values.border_size           = _.fusionValidateAttrValue( values.border_size, 'px' );
				values.height                = _.fusionValidateAttrValue( values.height, 'px' );
				values.preview_height        = _.fusionValidateAttrValue( values.preview_height, 'px' );
				values.preview_wrapper_width = _.fusionValidateAttrValue( values.preview_wrapper_width, 'px' );
				values.preview_width         = _.fusionValidateAttrValue( values.preview_width, 'px' );
			},

			/**
			 * Builds attributes.
			 *
			 * @since  2.2
			 * @param  {Object} values - The values object.
			 * @return {Object}
			 */
			buildAttr: function( values ) {
				var attr         = _.fusionVisibilityAtts( values.hide_on_mobile, {
						class: 'fusion-live-pagination-tb fusion-pagination-tb fusion-pagination-tb-' + this.model.get( 'cid' ),
						style: ''
					} );

				attr.style += this.getStyleVariables( values );

				if ( 'sticky' !== values.layout ) {
					attr[ 'class' ] += ' single-navigation clearfix ';
				}

				if ( values.layout ) {
					attr[ 'class' ] += ' layout-' + values.layout;
				}

				if ( values.preview_position && 'preview' === values.layout ) {
					attr[ 'class' ] += ' position-' + values.preview_position;
				}

				if ( 'yes' === values.box_shadow ) {
					attr[ 'class' ] += ' has-box-shadow';
				}

				if ( '' !== values[ 'class' ] ) {
					attr[ 'class' ] += ' ' + values[ 'class' ];
				}

				if ( '' !== values.alignment && 'sticky' !== values.layout ) {
					attr[ 'class' ] += ' align-' + values.alignment;
				}

				if ( '' !== values.id ) {
					attr.id = values.id;
				}

				attr = _.fusionAnimations( values, attr );

				return attr;
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

				customVars.box_shadow = _.fusionGetBoxShadowStyle( values );

				cssVarsOptions = [
					'z_index',
					'border_color',
					'bg_color',
					'text_color',
					'text_hover_color',
					'preview_text_color'
				];

				cssVarsOptions.margin_top            = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.margin_right          = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.margin_bottom         = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.margin_left           = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.font_size             = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.height                = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.preview_wrapper_width = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.preview_width         = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.preview_height        = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.border_size           = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.preview_font_size     = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.max_width             = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.max_width             = { 'callback': _.fusionGetValueWithUnit };

				return this.getCssVarsForOptions( cssVarsOptions ) + this.getCustomCssVars( customVars );
			},

			/**
			 * Open actual modal.
			 *
			 * @since 2.0
			 * @return {void}
			 */
			onSettingsOpen: function() {
				var $pagination = jQuery( '#fb-preview' )[ 0 ].contentWindow.jQuery( this.$el.find( '.fusion-live-pagination-tb' ) );

				if ( $pagination.hasClass( 'layout-sticky' ) ) {
					$pagination.addClass( 'show-live' );
				}
			},

			/**
			 * Close the modal.
			 *
			 * @since 2.0
			 * @return {void}
			 */
			onSettingsClose: function() {
				var $pagination = jQuery( '#fb-preview' )[ 0 ].contentWindow.jQuery( this.$el.find( '.fusion-live-pagination-tb' ) );
				if ( $pagination.hasClass( 'layout-sticky' ) ) {
					$pagination.removeClass( 'show-live' );
				}
			}
		} );
	} );
}( jQuery ) );
