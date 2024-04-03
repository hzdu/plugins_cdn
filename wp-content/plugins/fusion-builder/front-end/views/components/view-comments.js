var FusionPageBuilder = FusionPageBuilder || {};

( function() {

	jQuery( document ).ready( function() {

		// Comments view.
		FusionPageBuilder.fusion_tb_comments = FusionPageBuilder.ElementView.extend( {

			onInit: function() {
				if ( this.model.attributes.markup && '' === this.model.attributes.markup.output ) {
					this.model.attributes.markup.output = this.getComponentPlaceholder();
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

				attributes.output      = this.buildOutput( atts );
				attributes.placeholder = this.getComponentPlaceholder();

				// Any extras that need passed on.
				attributes.cid = this.model.get( 'cid' );

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
				values.border_size = _.fusionValidateAttrValue( values.border_size, 'px' );
				values.padding     = _.fusionValidateAttrValue( values.padding, 'px' );
			},

			/**
			 * Builds output.
			 *
			 * @since  2.2
			 * @param  {Object} values - The values object.
			 * @return {String}
			 */
			buildOutput: function( atts ) {
				var output = '',
					title  = '';

				if ( 'undefined' !== typeof atts.markup && 'undefined' !== typeof atts.markup.output && 'undefined' === typeof atts.query_data ) {
					output = jQuery( jQuery.parseHTML( atts.markup.output ) ).filter( '.fusion-comments-tb' ).html();
					output = ( 'undefined' === typeof output ) ? atts.markup.output : output;
				} else if ( 'undefined' !== typeof atts.query_data && 'undefined' !== typeof atts.query_data.comments ) {
					output = atts.query_data.comments;
				}

				_.each( jQuery( jQuery.parseHTML( output ) ).find( 'h1, h2, h3, h4, h5, h6' ), function( item ) {
					title  = _.buildTitleElement( atts.values, atts.extras, jQuery( item ).html() );
					output = output.replace( jQuery( item ).parent().prop( 'outerHTML' ), title );
				} );

				return output;
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
						class: 'fusion-comments-tb fusion-live-comments-tb fusion-comments-tb-' + this.model.get( 'cid' ) + ' fusion-order-' + values.template_order.split( ',' )[ 0 ].replace( '_', '-' ),
						style: ''
					} );

				if ( values.avatar ) {
					attr[ 'class' ] += ' avatar-' + values.avatar;
				}

				if ( 'hide' === values.headings ) {
					attr[ 'class' ] += ' hide-headings';
				}

				if ( '' !== values[ 'class' ] ) {
					attr[ 'class' ] += ' ' + values[ 'class' ];
				}

				if ( '' !== values.id ) {
					attr.id = values.id;
				}

				attr.style += this.getStyleVariables();

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

				var cssVarsOptions = [
					'border_color',
					'heading_color',
					'link_color',
					'link_hover_color',
					'text_color',
					'meta_color',
					'border_size',
					'padding'
				];

				cssVarsOptions.margin_top     = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.margin_right   = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.margin_bottom  = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.margin_left    = { 'callback': _.fusionGetValueWithUnit };

				return this.getCssVarsForOptions( cssVarsOptions );
			}
		} );
	} );
}( jQuery ) );
