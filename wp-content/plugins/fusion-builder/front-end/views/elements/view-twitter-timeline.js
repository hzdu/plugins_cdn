/* global FusionApp */
var FusionPageBuilder = FusionPageBuilder || {};

( function() {

	jQuery( document ).ready( function() {
		// Fusion twitter timeline.
		FusionPageBuilder.fusion_twitter_timeline = FusionPageBuilder.FormComponentView.extend( {

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
				attributes.iframeAtts   = this.buildIframeAttr( atts.values );

				// Any extras that need passed on.
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
				var attr         = _.fusionVisibilityAtts( values.hide_on_mobile, {
					class: 'fusion-twitter-timeline fusion-twitter-timeline-' + this.model.get( 'cid' ) + ' ' + values[ 'class' ],
					style: ''
				} );

				if ( '' !== values.id ) {
					attr.id = values.id;
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
			 * Builds Iframe attributes.
			 *
			 * @since 2.0
			 * @param {Object} values - The values object.
			 * @return {Object}
			 */
			buildIframeAttr: function( values ) {
				var attr         = {};

				attr[ 'class' ] = 'twitter-timeline';

				attr.href = 'https://twitter.com/' + values.username;

				if ( '' !== values.language ) {
					attr[ 'data-lang' ] = values.language;
				}

				if ( '' !== values.width ) {
					attr[ 'data-width' ] = values.width;
				}

				if ( '' !== values.height ) {
					attr[ 'data-height' ] = values.height;
				}

				if ( '' !== values.theme ) {
					attr[ 'data-theme' ] = values.theme;
				}

				if ( 'hide' !== values.borders && '' !== values.border_color ) {
					attr[ 'data-border-color' ] = values.border_color;
				}

				let chrome = '';
				if ( 'hide' === values.header ) {
					chrome += ' noheader';
				}
				if ( 'hide' === values.footer ) {
					chrome += ' nofooter';
				}
				if ( 'hide' === values.borders ) {
					chrome += ' noborders';
				}
				if ( 'hide' === values.scrollbar ) {
					chrome += ' noscrollbar';
				}
				if ( 'yes' === values.transparent ) {
					chrome += ' transparent';
				}

				if ( '' !== chrome ) {
					attr[ 'data-chrome' ] = chrome;
				}
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
			 * Triggers a refresh.
			 *
			 * @since 2.0.0
			 * @return void
			 */
			refreshJs: function() {
				if ( 'undefined' !== typeof FusionApp.previewWindow.twttr ) {
					FusionApp.previewWindow.twttr.widgets.load();
				}
			},
			onInit: function() {
				this._refreshJs();
			},
			onRender: function() {
				this._refreshJs();
			},
			afterPatch: function() {
				this._refreshJs();
			}
		} );
	} );
}( jQuery ) );
