/* global FusionApp */
/* eslint no-unused-vars: 0 */
/* eslint no-shadow: 0 */

var FusionPageBuilder = FusionPageBuilder || {};

( function() {

	jQuery( document ).ready( function() {

		// Widget Area Element View.
		FusionPageBuilder.fusion_widget_area = FusionPageBuilder.ElementView.extend( {

			/**
			 * Fires during element render() function.
			 *
			 * @since 2.0.4
			 * @param {Object} atts - The attributes.
			 * @return {Object}
			 */
			onRender: function() {
				var elementContent = this.$el.html();

				this.$el.html( FusionApp.removeScripts( elementContent ) );
			},

			/**
			 * Modify template attributes.
			 *
			 * @since 2.0
			 * @param {Object} atts - The attributes.
			 * @return {Object}
			 */
			filterTemplateAtts: function( atts ) {
				var attributes = {},
					name       = 'undefined' !== typeof atts.values.name ? atts.values.name.replace( /-/g, '_' ) : '';

				// Validate values.
				this.validateValues( atts.values );

				this.values = atts.values;

				// Create attribute objects
				attributes.attr   = this.buildAttr( atts.values );

				attributes.widgetArea = false;
				if ( 'undefined' !== atts.query_data && 'undefined' !== typeof atts.query_data[ name ] ) {
					attributes.widgetArea = atts.query_data[ name ];
				}

				return attributes;
			},

			/**
			 * Modifies the values.
			 *
			 * @since 2.0
			 * @param {Object} values - The values object.
			 * @return {void}
			 */
			validateValues: function( values ) {
				values = _.fusionGetPadding( values );

				values.margin_bottom = _.fusionValidateAttrValue( values.margin_bottom, 'px' );
				values.margin_left   = _.fusionValidateAttrValue( values.margin_left, 'px' );
				values.margin_right  = _.fusionValidateAttrValue( values.margin_right, 'px' );
				values.margin_top    = _.fusionValidateAttrValue( values.margin_top, 'px' );
			},

			/**
			 * Builds attributes.
			 *
			 * @since 2.0
			 * @param {Object} values - The values object.
			 * @return {Object}
			 */
			buildAttr: function( values ) { // here.
				var attr = _.fusionVisibilityAtts( values.hide_on_mobile, {
						class: 'fusion-widget-area awb-widget-area-element fusion-content-widget-area',
						style: ''
					} ),
					cid = this.model.get( 'cid' );

				attr[ 'class' ] += ' fusion-widget-area-cid' + cid;

				if ( '' !== values[ 'class' ] ) {
					attr[ 'class' ] += ' ' + values[ 'class' ];
				}

				attr.style += this.getStyleVariables( values );

				if ( '' !== values.id ) {
					attr.id = values.id;
				}

				return attr;
			},

			/**
			 * Gets style variables.
			 *
			 * @since 3.9
			 * @param  {Object} values - The values object.
			 * @return {String}
			 */
			getStyleVariables: function( values ) {
				var customVars = [],
					cssVarsOptions,
					padding;

				// Padding.
				if ( '' !== values.padding ) {
					if ( -1 === values.padding.indexOf( '%' ) && -1 === values.padding.indexOf( 'px' ) ) {
						values.padding = values.padding + 'px';
					}

					padding = _.fusionGetValueWithUnit( values.padding );
					customVars.padding = padding;
				}

				cssVarsOptions = [
					'background_color',
					'title_color'
				];

				cssVarsOptions.margin_bottom = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.margin_left   = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.margin_right  = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.margin_top    = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.title_size    = { 'callback': _.fusionGetValueWithUnit };

				return this.getCssVarsForOptions( cssVarsOptions ) + this.getCustomCssVars( customVars );
			}
		} );

		// Widget Area Callback.
		_.extend( FusionPageBuilder.Callback.prototype, {
			fusion_widget_area: function( name, value, modelData, args, cid, action, model, view ) { // jshint ignore: line
				var queryName,
					params   = jQuery.extend( true, {}, modelData.params ),
					ajaxData = {};

				if ( 'undefined' !== typeof name && ! args.skip ) {
					params[ name ] = value;
				}
				ajaxData.params = jQuery.extend( true, {}, window.fusionAllElements[ modelData.element_type ].defaults, _.fusionCleanParameters( params ) );

				if ( 'undefined' !== typeof name && 'undefined' !== typeof value ) {
					queryName = value.replace( /-/g, '_' );
				}

				if ( 'undefined' !== typeof model.query_data && 'undefined' !== typeof model.query_data[ queryName ] && 'undefined' !== typeof view ) {
					view.reRender();
					return true;
				}

				// Send this data with ajax or rest.
				jQuery.ajax( {
					url: window.fusionAppConfig.ajaxurl,
					type: 'post',
					dataType: 'json',
					data: {
						action: 'get_widget_area',
						model: ajaxData,
						fusion_load_nonce: window.fusionAppConfig.fusion_load_nonce
					}
				} )
				.done( function( response ) {
					var queryData;

					if ( 'undefined' !== typeof model && 'undefined' !== typeof model.get( 'query_data' ) ) {
						queryData              = model.get( 'query_data' );
						queryData[ queryName ] = response[ queryName ];
					} else {
						queryData = response;
					}

					model.set( 'query_data', queryData );

					if ( ! args.skip && 'undefined' !== typeof name ) {
						view.changeParam( name, value );
					}

					if ( 'generated_element' !== model.get( 'type' ) ) {
						view.reRender();
					}
				} );
			}
		} );
	} );
}( jQuery ) );
