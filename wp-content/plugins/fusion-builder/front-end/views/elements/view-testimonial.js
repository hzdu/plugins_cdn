var FusionPageBuilder = FusionPageBuilder || {};

( function() {

	jQuery( document ).ready( function() {

		// Counter circle child View.
		FusionPageBuilder.fusion_testimonial = FusionPageBuilder.ChildElementView.extend( {

			/**
			 * Runs during render() call.
			 *
			 * @since 2.0
			 * @return {void}
			 */
			onRender: function() {
				if ( 'undefined' !== typeof this.model.attributes.selectors ) {
					this.model.attributes.selectors[ 'class' ] += ' ' + this.className;
					this.setElementAttributes( this.$el, this.model.attributes.selectors );
				}
			},

			/**
			 * Runs after view DOM is patched.
			 *
			 * @since 2.0
			 * @return {void}
			 */
			afterPatch: function() {

				if ( 'undefined' !== typeof this.model.attributes.selectors ) {
					this.model.attributes.selectors[ 'class' ] += ' ' + this.className;
					this.setElementAttributes( this.$el, this.model.attributes.selectors );
				}
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

				this.values = atts.values;

				this.validateValues( atts.values );
				this.buildReviewAttr( atts );

				attributes.values = atts.values;
				attributes.parentValues = atts.parentValues;

				attributes.imageAttr        = this.buildImageAttr( atts.values );
				attributes.thumbnailAttr    = this.buildThumbnailAttr( atts );
				attributes.blockquoteAttr   = this.buildBlockquoteAttr( atts );
				attributes.quoteAttr        = this.buildQuoteAttr( atts );
				attributes.quoteContentAttr = this.buildQuoteContentAttr();
				attributes.iconAttr         = this.buildIconAttr( atts );
				attributes.authorAttr       = this.buildAuthorAttr();

				attributes.cid     = this.model.get( 'cid' );
				attributes.parent  = this.model.get( 'parent' );
				attributes.content = atts.values.element_content;

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

				if ( 'round' === values.image_border_radius ) {
					values.image_border_radius = '50%';
				} else {
					values.image_border_radius = _.fusionValidateAttrValue( values.image_border_radius, 'px' );
				}

				// Check for deprecated.
				if ( 'undefined' !== typeof values.gender && '' !== values.gender ) {
					values.avatar = values.gender;
				}

				if ( 'image' === values.avatar && ! values.image ) {
					values.avatar = 'none';
				}
			},

			/**
			 * Builds attributes.
			 *
			 * @since 2.0
			 * @param {Object} atts - The attributes.
			 * @return {Object}
			 */
			buildReviewAttr: function( atts ) {
				var values = atts.values,
					reviewAttr = {
						class: 'review ',
						style: ''
					};

				if ( this.isFirstChild() ) {
					reviewAttr[ 'class' ] += 'active-testimonial';
				}

				if ( 'classic' === atts.parentValues.design ) {
					if ( values.alignment_classic ) {
						reviewAttr[ 'class' ] += ' alignment-' + values.alignment_classic;
					}
				} else {
					reviewAttr[ 'class' ] += ' avatar-' + values.avatar_position;
				}

				if ( 'none' === values.avatar ) {
					reviewAttr[ 'class' ] += ' no-avatar';
				} else if ( 'image' === values.avatar ) {
					reviewAttr[ 'class' ] += ' avatar-image';
				} else {
					reviewAttr[ 'class' ] += ' ' + values.avatar;
				}

				reviewAttr.style += this.getStyleVariables();

				this.model.set( 'selectors', reviewAttr );
			},

			/**
			 * Builds attributes.
			 *
			 * @since 2.0
			 * @param {Object} values - The values.
			 * @return {Object}
			 */
			buildImageAttr: function( values ) {
				var imageAttr = {
					class: 'testimonial-image',
					src: values.image,
					alt: '',
					style: ''
				},
				customVars = [];

				if ( 'image' === values.avatar ) {
					customVars.border_radius = values.image_border_radius;
					imageAttr.style          = this.getCustomCssVars( customVars );
				}

				return imageAttr;
			},

			/**
			 * Builds attributes.
			 *
			 * @since 2.0
			 * @param {Object} atts - The attributes.
			 * @return {Object}
			 */
			buildThumbnailAttr: function( atts ) {
				var values = atts.values,
					thumbnailAttr = {
						class: 'testimonial-thumbnail'
					};

				if ( 'image' !== values.avatar ) {
					thumbnailAttr[ 'class' ] += ' doe';
				}

				return thumbnailAttr;
			},

			/**
			 * Builds attributes.
			 *
			 * @since 2.0
			 * @param {Object} atts - The attributes.
			 * @return {Object}
			 */
			buildBlockquoteAttr: function( atts ) {
				var parentValues = atts.parentValues,
					blockquoteAttr = {
						class: ''
					};

				if ( 'clean' === parentValues.design && ( 'transparent' === parentValues.backgroundcolor || 0 === jQuery.AWB_Color( parentValues.backgroundcolor ).alpha() ) ) {
					blockquoteAttr[ 'class' ] += ' has-transparent-color';
				}

				return blockquoteAttr;
			},

			/**
			 * Builds quote attribute.
			 *
			 * @since 2.0
			 * @param {Object} atts - The attributes.
			 * @return {Object}
			 */
			buildQuoteAttr: function( atts ) {
				var quoteAttr = {
					class: 'awb-quote'
				};

				if ( '' !== atts.values.testimonial_icon ) {
					quoteAttr[ 'class' ] += ' awb-testimonial-icon';
				}

				return quoteAttr;
			},

			/**
			 * Builds quote content attribute.
			 *
			 * @since 3.11.3
			 * @return {Object}
			 */
			buildQuoteContentAttr: function() {
				var quoteContentAttr = {
					class: 'awb-quote-content'
				};

				return quoteContentAttr;
			},

			/**
			 * Builds icon attributes.
			 *
			 * @since 3.11.3
			 * @param {Object} atts - The attributes.
			 * @return {Object}
			 */
			buildIconAttr: function( atts ) {
				var iconAttr = {
					class: 'awb-t-icon-' + atts.values.testimonial_icon_alignment + ' ' + atts.values.testimonial_icon
				};

				return iconAttr;
			},


			/**
			 * Builds attributes.
			 *
			 * @since 2.0
			 * @return {Object}
			 */
			buildAuthorAttr: function() {
				var authorAttr = {
					class: 'author'
				};

				return authorAttr;
			},

			/**
			 * Gets style variables.
			 *
			 * @since 3.11.3
			 * @return {String}
			 */
			getStyleVariables: function() {
				const cssVarsOptions = [];

				cssVarsOptions.avatar_size = { 'callback': _.fusionGetValueWithUnit };

				return this.getCssVarsForOptions( cssVarsOptions );
			}
		} );
	} );
}( jQuery ) );
