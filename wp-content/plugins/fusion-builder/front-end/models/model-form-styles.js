/* global FusionApp, FusionEvents */
var FusionPageBuilder = FusionPageBuilder || {};

( function() {

	FusionPageBuilder.FormStyles = Backbone.Model.extend( {

		initialize: function() {
			this.baseSelector = '.fusion-form.fusion-form-form-wrapper';
			this.dynamic_css  = {};
			this.formData     = FusionApp.data.postMeta._fusion;
			this.addStyleVariables();

			this.listenTo( FusionEvents, 'fusion-form-styles', this.addStyleVariables );
			this.listenTo( FusionEvents, 'fusion-builder-loaded', this.addStyleVariables );


			this.listenTo( FusionEvents, 'fusion-preview-refreshed', this.updateFormData );
		},

		updateFormData: function() {
			this.formData = FusionApp.data.postMeta._fusion;
		},

		isDefault: function( param, subset ) {
			if ( 'string' === typeof subset ) {
				return 'undefined' === typeof this.formData[ param ] || 'undefined' === typeof this.formData[ param ][ subset ] || '' === this.formData[ param ][ subset ];
			}
			return 'undefined' === typeof this.formData[ param ] || '' === this.formData[ param ];
		},

		/**
		 * Adds style variables.
		 *
		 * @since 3.9
		 * @return {String}
		 */
		addStyleVariables: function() {
			var customVars = [],
				cssVarsOptions = [],
				styles;

			if ( 'undefined' !== typeof this.formData.tooltip_text_color && '' !== this.formData.tooltip_text_color ) {
				customVars.tooltip_text_color = this.formData.tooltip_text_color;
			}

			if ( 'undefined' !== typeof this.formData.tooltip_background_color && '' !== this.formData.tooltip_background_color ) {
				customVars.tooltip_background_color = this.formData.tooltip_background_color;
			}

			if ( ! this.isDefault( 'field_margin', 'top' ) ) {
				customVars.field_margin_top = _.fusionGetValueWithUnit( this.formData.field_margin.top );
			}

			if ( ! this.isDefault( 'field_margin', 'bottom' ) ) {
				customVars.field_margin_bottom = _.fusionGetValueWithUnit( this.formData.field_margin.bottom );
			}

			if ( ! this.isDefault( 'form_input_height' ) ) {
				customVars.form_input_height = _.fusionGetValueWithUnit( this.formData.form_input_height );
			}

			if ( ! this.isDefault( 'form_bg_color' ) ) {
				customVars.form_bg_color = this.formData.form_bg_color;
			}

			if ( ! this.isDefault( 'label_font_size' ) ) {
				customVars.label_font_size = _.fusionGetValueWithUnit( this.formData.label_font_size );
			}

			if ( ! this.isDefault( 'form_font_size' ) ) {
				customVars.form_font_size = _.fusionGetValueWithUnit( this.formData.form_font_size );
			}

			if ( 'undefined' !== typeof this.formData.form_placeholder_color && '' !== this.formData.form_placeholder_color ) {
				customVars.form_placeholder_color = this.formData.form_placeholder_color;
			} else if ( ! this.isDefault( 'form_text_color' ) ) {
				customVars.form_placeholder_color = jQuery.AWB_Color( this.formData.form_text_color ).alpha( 0.5 ).toRgbaString();
			}

			if ( ! this.isDefault( 'form_text_color' ) ) {
				customVars.form_text_color = this.formData.form_text_color;
			}

			if ( ! this.isDefault( 'form_label_color' ) ) {
				customVars.form_label_color = this.formData.form_label_color;
			}

			if ( ! this.isDefault( 'form_border_width', 'top' ) ) {
				customVars.form_border_width_top = _.fusionGetValueWithUnit( this.formData.form_border_width.top, 'px' );
			}

			if ( ! this.isDefault( 'form_border_width', 'bottom' ) ) {
				customVars.form_border_width_bottom = _.fusionGetValueWithUnit( this.formData.form_border_width.bottom, 'px' );
			}

			if ( ! this.isDefault( 'form_border_width', 'right' ) ) {
				customVars.form_border_width_right = _.fusionGetValueWithUnit( this.formData.form_border_width.right, 'px' );
			}

			if ( ! this.isDefault( 'form_border_width', 'left' ) ) {
				customVars.form_border_width_left = _.fusionGetValueWithUnit( this.formData.form_border_width.left, 'px' );
			}

			if ( ! this.isDefault( 'form_border_color' ) ) {
				customVars.form_border_color = this.formData.form_border_color;
			}

			if ( ! this.isDefault( 'form_focus_border_color' ) ) {
				customVars.form_focus_border_color       = this.formData.form_focus_border_color;
				customVars.form_focus_border_hover_color = jQuery.AWB_Color( this.formData.form_focus_border_color ).alpha( 0.5 ).toRgbaString();
			}

			if ( ! this.isDefault( 'form_border_radius' ) ) {
				customVars.form_border_radius = _.fusionGetValueWithUnit( this.formData.form_border_radius, 'px' );
			}

			if ( ! this.isDefault( 'form_border_width', 'bottom' ) || !this.isDefault( 'form_border_width', 'top' ) ) {
				customVars.icon_alignment_top       = this.isDefault( 'form_border_width', 'top' ) ? 'var(--form_border_width-top)' : _.fusionGetValueWithUnit( this.formData.form_border_width.top, 'px' );
				customVars.icon_alignment_bottom    = this.isDefault( 'form_border_width', 'bottom' ) ? 'var(--form_border_width-bottom)' : _.fusionGetValueWithUnit( this.formData.form_border_width.bottom, 'px' );
				customVars.icon_alignment_font_size = this.isDefault( 'form_font_size' ) ? '1em' : this.formData.form_font_size;

				jQuery( '#fb-preview' )[ 0 ].contentWindow.jQuery( 'body' ).find( '.fusion-form-form-wrapper' ).addClass( 'has-icon-alignment' );
			} else {
				jQuery( '#fb-preview' )[ 0 ].contentWindow.jQuery( 'body' ).find( '.fusion-form-form-wrapper' ).removeClass( 'has-icon-alignment' );
			}

			cssVarsOptions.margin_top    = { 'callback': _.fusionGetValueWithUnit };
			cssVarsOptions.margin_right  = { 'callback': _.fusionGetValueWithUnit };
			cssVarsOptions.margin_bottom = { 'callback': _.fusionGetValueWithUnit };
			cssVarsOptions.margin_left   = { 'callback': _.fusionGetValueWithUnit };

			styles = this.getCssVarsForOptions( cssVarsOptions ) + this.getCustomCssVars( customVars );

			jQuery( '#fb-preview' )[ 0 ].contentWindow.jQuery( 'body' ).find( '.fusion-form-form-wrapper' ).attr( 'style', styles );
		},

		/**
		 * Get a string with each of the option as a CSS variable, if the option is not default.
		 *
		 * @since 3.9
		 * @param {array} options The array with the options ids.
		 * @return {string}
		 */
		getCssVarsForOptions( options ) {
			var css = '',
				varName,
				value,
				callback_args,
				key;

			for ( key in options ) {
				if ( ! options.hasOwnProperty( key ) || 'length' === key ) {
					continue; // eslint-disable-line no-continue
				}

				value = options[ key ];

				if ( 'object' === typeof value ) { // If the value is an array, then the CSS var name is the key.
					if ( ! this.isDefault( key ) ) {
						varName       = '--awb-' + key.replaceAll( '_', '-' );
						callback_args = ( 'object' === typeof value.args ? value.args : [ this.values[ key ] ] );
						css          += varName + ':' + value.callback.apply( null, callback_args ) + ';';
					}
				} else {
					if ( ! this.isDefault( value ) ) { // eslint-disable-line no-lonely-if
						varName = '--awb-' + value.replaceAll( '_', '-' );
						css    += varName + ':' + this.values[ value ] + ';';
					}
				}
			}

			return css;
		},

		/**
		 * Get a string with custom CSS variables, created from array key => value pairs.
		 *
		 * @since 3.9
		 * @param {Object} $options The object with the custom css vars. The property
		 * represents the option name, while the value represents the custom value.
		 * @return {string}
		 */
		getCustomCssVars( options, prefix ) {
			var css = '',
				varName,
				property;

			if ( 'undefined' === typeof prefix ) {
				prefix = true;
			}
			for ( property in options ) {
				if ( ! options.hasOwnProperty( property ) ) {
					continue; // eslint-disable-line no-continue
				}

				if ( prefix ) {
					varName = '--awb-' + property.replaceAll( '_', '-' );
				} else {
					varName = '--' + property;
				}
				css    += varName + ':' + options[ property ] + ';';
			}

			return css;
		}
	} );
}( jQuery ) );
