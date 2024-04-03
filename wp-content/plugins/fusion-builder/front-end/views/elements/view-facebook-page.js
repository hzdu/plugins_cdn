/* global FusionApp */
var FusionPageBuilder = FusionPageBuilder || {};

( function() {

	jQuery( document ).ready( function() {

		FusionPageBuilder.fusion_facebook_page = FusionPageBuilder.ElementView.extend( {

			/**
			 * Modify template attributes.
			 *
			 * @since 2.0
			 * @param {Object} atts - The attributes object.
			 * @return {Object}
			 */
			filterTemplateAtts: function( atts ) {
				var attributes = {};

				this.values = atts.values;

				// Create attribute objects
				attributes.atts   = this.buildAttr( atts.values );

				// Any extras that need passed on.
				attributes.cid    = this.model.get( 'cid' );
				attributes.values = atts.values;

				return attributes;
			},

			/**
			 * Builds attributes.
			 *
			 * @since 2.0
			 * @param {Object} values - The values object.
			 * @return {Object}
			 */
			buildAttr: function( values ) {
				var attr = {
					style: ''
				};

				if ( '' !== values.id ) {
					attr.id = values.id;
				}

				attr[ 'class' ] = 'fusion-facebook-page fb-page fusion-facebook-page-' + this.model.get( 'cid' ) + ' ' + values[ 'class' ];

				attr  = _.fusionVisibilityAtts( values.hide_on_mobile, attr );
				attr[ 'data-language' ] = values.language || 'en_US';
				if ( '' !== values.href ) {
					attr[ 'data-href' ] = values.href;
				}
				if ( '' !== values.tabs ) {
					attr[ 'data-tabs' ] = values.tabs;
				}

				if ( '' !== values.width ) {
					attr[ 'data-width' ] = values.width;
				}

				if ( '' !== values.height ) {
					attr[ 'data-height' ] = values.height;
				}

				if ( 'small' === values.header ) {
					attr[ 'data-small_header' ] = 'true';
				}

				if ( 'hide' === values.cover ) {
					attr[ 'data-hide_cover' ] = 'true';
				}

				if ( 'hide' === values.cta ) {
					attr[ 'data-hide_cta' ] = 'true';
				}

				if ( 'on' === values.lazy ) {
					attr[ 'data-lazy' ] = 'true';
				}

				if ( 'hide' === values.facepile ) {
					attr[ 'data-show_facepile' ] = 'false';
				}

				if ( '' !==  values.alignment ) {
					attr.style += 'display:flex; justify-content:' + values.alignment + ';';
				}

				attr.style += this.getStyleVariables();

				//Animation
				attr = _.fusionAnimations( values, attr );


				return attr;
			},

			/**
			 * Gets style variables.
			 *
			 * @since 3.9
			 * @return {String}
			 */
			getStyleVariables: function() {
				const cssVarsOptions = [];

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

				return this.getCssVarsForOptions( cssVarsOptions );
			},

			/**
			 * refresh the script to change language dynamically.
			 *
			 * @since 3.7
			 * @return void
			*/
			refreshScript: function() {

				const lang = this.model.attributes.params.language || 'en_US';
					delete FusionApp.previewWindow.FB;

					( function ( d, s, id ) {
						let js = d.getElementById( id );

						if ( js ) {
							js.parentNode.removeChild( js );
						} // remove script tag if exists
						js = d.createElement( s );
						js.id = id;
						js.src = `https://connect.facebook.net/${lang}/sdk.js#xfbml=1&version=v12.0`;
						d.body.appendChild( js );
					}( FusionApp.previewWindow.document, 'script', 'facebook-jssdk' ) );

					this._refreshJs();
			},

			/**
			 * Triggers a refresh.
			 *
			 * @since 2.0.0
			 * @return void
			 */
			refreshJs: function() {
				if ( 'undefined' !== typeof FusionApp.previewWindow.FB ) {
					FusionApp.previewWindow.FB.XFBML.parse();
				}
			},

			onInit: function() {
				this._refreshJs();
			},
			onRender: function() {
				this._refreshJs();
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
			onOptionChange: function( paramName ) {
				if ( 'language' === paramName  ) {
					this.refreshScript();
				} else {
					this._refreshJs();
				}
			}
		} );
	} );
}( jQuery ) );
