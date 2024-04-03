var FusionPageBuilder = FusionPageBuilder || {};

( function() {

	jQuery( document ).ready( function() {

		// User Register Element View.
		FusionPageBuilder.fusion_register = FusionPageBuilder.ElementView.extend( {

			/**
			 * Modify template attributes.
			 *
			 * @since 2.0
			 * @param {Object} atts - The attributes.
			 * @return {Object}
			 */
			filterTemplateAtts: function( atts ) {
				this.extras        = atts.extras;
				atts.values.action = 'register';
				this.values        = atts.values;

				// Create attribute objects.
				atts.loginShortCodeAttr     = this.buildLoginShortCodeAttr( atts.values );
				atts.loginShortcodeFormAttr = this.buildLoginShortcodeFormAttr( atts.values );
				atts.loginShortcodeButton   = this.buildLoginShortcodeButtonAttr( atts.values );
				atts.loggedIn               = true;

				// Any extras that need passed on.
				atts.cid    = this.model.get( 'cid' );

				return atts;
			},

			/**
			 * Builds login attributes.
			 *
			 * @since 2.0
			 * @param {Object} values - The values.
			 * @return {Object}
			 */
			buildLoginShortCodeAttr: function( values ) {

				// LoginShortcode Attributes.
				var loginShortcode = _.fusionVisibilityAtts( values.hide_on_mobile, {
					class: 'fusion-login-box fusion-login-box-cid' + this.model.get( 'cid' ) + ' fusion-login-box-' + values.action + ' fusion-login-align-' + values.text_align + ' fusion-login-field-layout-' + values.form_field_layout,
					style: ''
				} );

				loginShortcode.style += this.getStyleVariables();

				values.label_class = 'yes' === values.show_labels  ? 'fusion-login-label' : 'fusion-hidden-content';

				if ( '' !== values[ 'class' ] ) {
					loginShortcode[ 'class' ] += ' ' + values[ 'class' ];
				}

				if ( '' !== values.id ) {
					loginShortcode.id = values.id;
				}

				return loginShortcode;
			},

			/**
			 * Builds form attributes.
			 *
			 * @since 2.0
			 * @param {Object} values - The values.
			 * @return {Object}
			 */
			buildLoginShortcodeFormAttr: function( values ) {

				// LoginShortcodeForm Attributes.
				var loginShortcodeForm = {
					class: 'fusion-login-form'
				};

				loginShortcodeForm.name   = values.action + 'form';
				loginShortcodeForm.id     = values.action + 'form';
				loginShortcodeForm.method = 'post';
				loginShortcodeForm.action = '';

				return loginShortcodeForm;
			},

			/**
			 * Builds button attributes.
			 *
			 * @since 2.0
			 * @param {Object} values - The values.
			 * @return {Object}
			 */
			buildLoginShortcodeButtonAttr: function( values ) {

				// LoginShortcodeButton Attributes.
				var loginShortcodeButton = {
					class: 'fusion-login-button fusion-button button-default fusion-button-default-size'
				};

				if ( 'yes' !== values.button_fullwidth ) {
					loginShortcodeButton[ 'class' ] += ' fusion-login-button-no-fullwidth';
				}

				loginShortcodeButton.type = 'submit';
				loginShortcodeButton.name = 'wp-submit';

				return loginShortcodeButton;
			},

			/**
			 * Gets style variables.
			 *
			 * @since 3.9
			 * @return {String}
			 */
			getStyleVariables: function() {

				var cssVarsOptions = [
					'heading_color',
					'caption_color',
					'link_color',
					'form_background_color'
				];

				cssVarsOptions.margin_top    = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.margin_right  = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.margin_bottom = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.margin_left   = { 'callback': _.fusionGetValueWithUnit };

				return this.getCssVarsForOptions( cssVarsOptions );
			}
		} );
	} );
}( jQuery ) );
