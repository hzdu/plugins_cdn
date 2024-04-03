/* global FusionPageBuilderApp, fusionAllElements */
var FusionPageBuilder = FusionPageBuilder || {};

( function() {

	jQuery( document ).ready( function() {

		// Tooltip View
		FusionPageBuilder.fusion_popover = FusionPageBuilder.ElementView.extend( {

			/**
			 * Runs before view DOM is patched.
			 *
			 * @since 2.0
			 * @return {void}
			 */
			beforePatch: function() {
				var $popover = jQuery( '#fb-preview' )[ 0 ].contentWindow.jQuery( this.$el.find( '[data-toggle~="popover"]' ) );
				$popover.removeData();
				$popover.remove();

				if ( jQuery( '#fb-preview' )[ 0 ].contentWindow.jQuery( '.fusion-popover-' + this.model.get( 'cid' ) ).length ) {
					jQuery( '#fb-preview' )[ 0 ].contentWindow.jQuery( '.fusion-popover-' + this.model.get( 'cid' ) ).remove();
				}
			},

			/**
			 * Runs after view DOM is patched.
			 *
			 * @since 2.0
			 * @return {void}
			 */
			afterPatch: function() {
				this._refreshJs();
			},

			/**
			 * Modify template attributes.
			 *
			 * @since 2.0
			 * @param {Object} atts - The attributes.
			 * @return {Object}
			 */
			filterTemplateAtts: function( atts ) {
				var attributes = {};

				this.values        = atts.values;
				attributes.attr    = this.computeAttr( atts.values );
				attributes.cid     = this.model.get( 'cid' );
				attributes.parent  = this.model.get( 'parent' );
				attributes.inline  = 'undefined' !== typeof atts.inlineElement;
				attributes.content = atts.values.element_content;
				attributes.label   = window.fusionAllElements[ this.model.get( 'element_type' ) ].name;
				attributes.icon    = window.fusionAllElements[ this.model.get( 'element_type' ) ].icon;
				attributes.popover = atts.values.popover;
				return attributes;
			},

			/**
			 * Builds attributes.
			 *
			 * @since 2.0
			 * @param {Object} values - The values.
			 * @return {Object}
			 */
			computeAttr: function( values ) {
				var cssVars = [
						'bordercolor',
						'title_bg_color',
						'textcolor',
						'bordercolor',
						'content_bg_color'
					],
					cid              = this.model.get( 'cid' ),
					atts             = {
						class: 'fusion-popover popover-' + cid,
						'data-style': this.getCssVarsForOptions( cssVars )
					},
					popoverContent   = values.content;

				this.values.arrow_color = 'bottom' !== this.values.placement ? this.values.content_bg_color : this.values.title_bg_color;
				if ( '' !== this.values.arrow_color ) {
					atts[ 'data-style' ] += '--awb-arrowcolor:' + this.values.arrow_color + ';';
				}

				if ( 'default' === values.placement ) {
					values.placement = fusionAllElements.fusion_popover.defaults.placement;
				}

				if ( '' !== values[ 'class' ] ) {
					atts[ 'class' ] += ' ' + values[ 'class' ];
				}

				if ( '' !== values.id ) {
					atts.id = values.id;
				}

				try {
					if ( popoverContent && '' !== popoverContent && FusionPageBuilderApp.base64Encode( FusionPageBuilderApp.base64Decode( popoverContent ) ) === popoverContent ) {
						popoverContent = FusionPageBuilderApp.base64Decode( popoverContent );
					}
				} catch ( error ) {
					console.log( error ); // jshint ignore:line
				}

				atts[ 'data-animation' ] = values.animation;
				atts[ 'data-class' ]     = 'fusion-popover-' + cid;
				atts[ 'data-delay' ]     = values.delay;
				atts[ 'data-placement' ] = values.placement.toLowerCase();
				atts[ 'data-title' ]     = values.title;
				atts[ 'data-toggle' ]    = 'popover';
				atts[ 'data-trigger' ]   = values.trigger;
				values.popover           = popoverContent;
				return atts;
			}
		} );
	} );
}( jQuery ) );
