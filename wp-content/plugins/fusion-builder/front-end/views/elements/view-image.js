/* global fusionAllElements, FusionApp, FusionPageBuilderApp, builderConfig */
var FusionPageBuilder = FusionPageBuilder || {};

( function() {
	jQuery( document ).ready( function() {

		// Image Frame Element View.
		FusionPageBuilder.fusion_imageframe = FusionPageBuilder.ElementView.extend( {

			/**
			 * Runs after view DOM is patched.
			 *
			 * @since 2.0
			 * @return {void}
			 */
			onRender: function() {
				this.afterPatch();


			},

			/**
			 * Runs after view DOM is patched.
			 *
			 * @since 2.0
			 * @return {void}
			 */
			afterPatch: function() {
				var params = this.model.get( 'params' ),
					link  = jQuery( '#fb-preview' )[ 0 ].contentWindow.jQuery( this.$el.find( '.fusion-lightbox' ) );

				this.$el.removeClass( 'fusion-element-alignment-right fusion-element-alignment-left' );
				if ( ! this.flexDisplay() ) {
					if ( 'undefined' !== typeof params.align && ( 'right' === params.align || 'left' === params.align ) ) {
						this.$el.addClass( 'fusion-element-alignment-' + params.align );
					}
				}
				if ( 'object' === typeof jQuery( '#fb-preview' )[ 0 ].contentWindow.avadaLightBox ) {
					if ( 'undefined' !== typeof this.iLightbox ) {
						this.iLightbox.destroy();
					}

					if ( link.length ) {
						this.iLightbox = link.iLightBox( jQuery( '#fb-preview' )[ 0 ].contentWindow.avadaLightBox.prepare_options( 'single' ) );
					}
				}

				// Image magnify with lightbox or link
				if ( jQuery( '#fb-preview' )[ 0 ].contentWindow.jQuery( this.$el.find( 'a' ) ).hasClass( 'has-image-magnify' ) && 'function' === typeof jQuery( '#fb-preview' )[ 0 ].contentWindow.jQuery().fusionImageMagnify ) {
					jQuery( '#fb-preview' )[ 0 ].contentWindow.jQuery( this.$el.find( '.fusion-imageframe' ) ).off( 'mouseenter mouseleave' );
					jQuery( '#fb-preview' )[ 0 ].contentWindow.jQuery( this.$el.find( 'a.has-image-magnify' ) ).off( 'mouseenter mouseleave' );
					jQuery( '#fb-preview' )[ 0 ].contentWindow.jQuery( this.$el.find( 'a.has-image-magnify' ) ).fusionImageMagnify();
				}

				// Image magnify.
				if ( !jQuery( '#fb-preview' )[ 0 ].contentWindow.jQuery( this.$el.find( 'a' ) ).hasClass( 'has-image-magnify' ) && this.$el.find( '.fusion-imageframe' ).hasClass( 'has-image-magnify' ) && 'function' === typeof jQuery( '#fb-preview' )[ 0 ].contentWindow.jQuery().fusionImageMagnify ) {
					jQuery( '#fb-preview' )[ 0 ].contentWindow.jQuery( this.$el.find( '.fusion-imageframe.has-image-magnify' ) ).off( 'mouseenter mouseleave' );
					jQuery( '#fb-preview' )[ 0 ].contentWindow.jQuery( this.$el.find( 'a.has-image-magnify' ) ).off( 'mouseenter mouseleave' );
					jQuery( '#fb-preview' )[ 0 ].contentWindow.jQuery( this.$el.find( '.fusion-imageframe.has-image-magnify' ) ).fusionImageMagnify();
				}

				// Image scroll.
				if ( this.$el.find( '.fusion-imageframe' ).hasClass( 'has-image-scroll' ) && 'function' === typeof jQuery( '#fb-preview' )[ 0 ].contentWindow.jQuery().fusionImageScroll ) {
					jQuery( '#fb-preview' )[ 0 ].contentWindow.jQuery( this.$el.find( '.fusion-imageframe.has-image-scroll' ) ).off( '.zoom' );
					jQuery( '#fb-preview' )[ 0 ].contentWindow.jQuery( this.$el.find( 'a' ) ).off( '.zoom' );
					jQuery( '#fb-preview' )[ 0 ].contentWindow.jQuery( this.$el.find( '.fusion-imageframe.has-image-scroll' ) ).fusionImageScroll();
				}

				// Disable magnify and scroll in case of zoom in and zoom out.
				if ( this.$el.find( '.fusion-imageframe' ).hasClass( 'hover-type-zoomin' ) || this.$el.find( '.fusion-imageframe' ).hasClass( 'hover-type-zoomout' ) || this.$el.find( '.fusion-imageframe' ).hasClass( 'hover-type-liftup' ) || this.$el.find( '.fusion-imageframe' ).hasClass( 'hover-type-none' )  ) {
					jQuery( '#fb-preview' )[ 0 ].contentWindow.jQuery( this.$el.find( '.fusion-imageframe' ) ).off( '.zoom' );
					jQuery( '#fb-preview' )[ 0 ].contentWindow.jQuery( this.$el.find( '.fusion-imageframe' ) ).off( 'mouseenter mouseleave' );
					jQuery( '#fb-preview' )[ 0 ].contentWindow.jQuery( this.$el.find( 'a' ) ).off( '.zoom' );
				}
			},

			/**
			 * Modify template attributes.
			 *
			 * @since 2.0
			 * @return {Object}
			 */
			filterTemplateAtts: function( atts ) {

				if ( 'undefined' !== typeof atts.values.element_content ) {

					this.isFlex 	  = this.flexDisplay();
					// Validate values.
					this.validateValues( atts.values );
					// Create attribute objects
					this.values       = atts.values;
					this.extras       = atts.extras;
					atts.isFlex       = this.isFlex;
					atts.attr         = this.buildAttr( atts.values );
					atts.contentAttr  = this.buildContentAttr( atts.values );
					atts.linkAttr     = this.buildLinktAttr( atts.values );
					atts.borderRadius = this.buildBorderRadius( atts.values );
					atts.imgStyles    = this.buildImgStyles( atts.values );
					atts.responsiveAttr = this.buildResponsiveAttr( atts.values );
					atts.imageMagnify   = this.buildImageMagnify( atts.values );
					atts.imageScroll   = this.buildImageScroll( atts.values );

					this.buildElementContent( atts );


					atts.liftupClasses = this.buildLiftupClasses( atts );
					atts.liftupStyles  = this.buildLiftupStyles( atts );
					atts.captionHtml   = this.generateCaption( atts );

					// Add min height sticky.
					atts.stickyStyles = '';
					atts.filter_style_block = _.fusionGetFilterStyleElem( atts.values, '.imageframe-cid' + this.model.get( 'cid' ), this.model.get( 'cid' )  );
				}

				return atts;
			},

			/**
			 * Modifies the values.
			 *
			 * @since 2.0
			 * @param {Object} values - The values object.
			 * @return {void}
			 */
			validateValues: function( values ) {
				values.borderradius  = _.fusionValidateAttrValue( values.borderradius, 'px' );
				values.bordersize    = _.fusionValidateAttrValue( values.bordersize, 'px' );
				values.blur          = _.fusionValidateAttrValue( values.blur, 'px' );
				values.margin_bottom = _.fusionValidateAttrValue( values.margin_bottom, 'px' );
				values.margin_left   = _.fusionValidateAttrValue( values.margin_left, 'px' );
				values.margin_right  = _.fusionValidateAttrValue( values.margin_right, 'px' );
				values.margin_top    = _.fusionValidateAttrValue( values.margin_top, 'px' );

				// If caption style used then disable style type.
				if ( -1 === jQuery.inArray( values.caption_style, [ 'off', 'above', 'below' ] ) ) {
					values.style_type = 'none';
				}

				// If mask used disable style type.
				if ( values.mask ) {
					values.style_type = 'none';
				}

				if ( ! values.style ) {
					values.style = values.style_type;
				}
				if ( values.borderradius && 'bottomshadow' === values.style ) {
					values.borderradius = '0';
				}

				if ( 'round' === values.borderradius ) {
					values.borderradius = '50%';
				}

			},

			/**
			 * Builds responsive container attributes.
			 *
			 * @since 2.0
			 * @param {Object} values - The values object.
			 * @return {Object}
			 */
			buildResponsiveAttr: function( values ) {
				var attr = {
					style: '',
					class: 'fusion-image-element '
				},
				alignLarge  = values.align && 'none' !== values.align ? values.align : false,
				alignMedium = values.align_medium && 'none' !== values.align_medium ? values.align_medium : false,
				alignSmall  = values.align_small && 'none' !== values.align_small ? values.align_small : false;

				if ( this.isFlex ) {
					attr = _.fusionVisibilityAtts( values.hide_on_mobile, attr );
				}

				if ( alignLarge ) {
					attr.style += 'text-align:' + alignLarge + ';';
				}

				if ( alignMedium && alignLarge !== alignMedium ) {
					attr[ 'class' ] += ' md-text-align-' + alignMedium;
				}

				if ( values.sticky_display ) {
					attr[ 'class' ] += _.fusionGetStickyClass( values.sticky_display );
				}

				if ( alignSmall && alignLarge !== alignSmall ) {
					attr[ 'class' ] += ' sm-text-align-' + alignSmall;
				}

				if ( -1 !== jQuery.inArray( values.caption_style, [ 'above', 'below' ] ) ) {
					attr[ 'class' ] += ' awb-imageframe-style awb-imageframe-style-' + values.caption_style + ' awb-imageframe-style-' + this.model.get( 'cid' );
				}

				// Special variables.
				if ( 'liftup' === values.hover_type && '' === values.mask ) {
					if ( values.borderradius ) {
						attr.style += '--awb-liftup-border-radius:' + _.fusionGetValueWithUnit( values.borderradius ) + ';';
					}
				}

				const styleColor = ( 0 === values.stylecolor.indexOf( '#' ) ) ? jQuery.AWB_Color( values.stylecolor ).alpha( 0.4 ).toVarOrRgbaString() : jQuery.AWB_Color( values.stylecolor ).toVarOrRgbaString();

				if ( 'bottomshadow' === values.style ) {
					attr.style += '--awb-bottom-shadow-color:' + styleColor + ';';
				}

				if ( ! this.isFlex ) {
					attr[ 'class' ] += ' in-legacy-container';
				}

				attr.style += this.getAspectRatioVars( values );
				attr.style += this.getMaskVars( values );
				attr.style += this.getStyleVariables( values );

				return attr;
			},

			/**
			 * Builds attributes.
			 *
			 * @since 2.0
			 * @param {Object} values - The values object.
			 * @return {Object}
			 */
			buildAttr: function( values ) {

				// Main wrapper attributes
				var attr = {
						class: 'fusion-imageframe',
						style: ''
					},
					imgStyles,
					styleColorVal = values.stylecolor ? values.stylecolor : '',
					styleColor    = ( 0 === styleColorVal.indexOf( '#' ) ) ? jQuery.AWB_Color( styleColorVal ).alpha( 0.3 ).toVarOrRgbaString() : jQuery.AWB_Color( styleColorVal ).toVarOrRgbaString(),
					blur          = values.blur,
					blurRadius    = ( parseInt( blur, 10 ) + 4 ) + 'px';

				attr = _.fusionVisibilityAtts( values.hide_on_mobile, attr );
				if (  ! this.isFlex ) {
					attr[ 'class' ] += ' fusion-imageframe-align-' + values.align;
				}

				if ( ! values.style ) {
					values.style = values.style_type;
				}

				imgStyles   = '';

				// Border style only if not using mask.
				if ( '' === values.mask ) {
					if ( '' != values.bordersize && '0' != values.bordersize && '0px' !== values.bordersize ) {
						imgStyles += 'border:' + values.bordersize + ' solid ' + values.bordercolor + ';';
					}

					if ( '0' != values.borderradius && '0px' !== values.borderradius ) {
						imgStyles += '-webkit-border-radius:' + values.borderradius + ';-moz-border-radius:' + values.borderradius + ';border-radius:' + values.borderradius + ';';

						if ( '50%' === values.borderradius || 100 < parseFloat( values.borderradius ) ) {
							imgStyles += '-webkit-mask-image: -webkit-radial-gradient(circle, white, black);';
						}
					}
				}

				if ( 'glow' === values.style ) {
					imgStyles += '-moz-box-shadow: 0 0 ' + blur + ' ' + styleColor + ';-webkit-box-shadow: 0 0 ' + blur + ' ' + styleColor + ';box-shadow: 0 0 ' + blur + ' ' + styleColor + ';';
				} else if ( 'dropshadow' === values.style ) {
					imgStyles += '-moz-box-shadow: ' + blur + ' ' + blur + ' ' + blurRadius + ' ' + styleColor + ';-webkit-box-shadow: ' + blur + ' ' + blur + ' ' + blurRadius + ' ' + styleColor + ';box-shadow: ' + blur + ' ' + blur + ' ' + blurRadius + ' ' + styleColor + ';';
				}
				if ( 'scroll' === values.hover_type && '' !== values.scroll_height ) {
					imgStyles += 'height: ' + values.scroll_height + 'px';
				}

				if ( '' !== imgStyles ) {
					attr.style += imgStyles;
				}

				attr[ 'class' ] += ' imageframe-' + values.style + ' imageframe-cid' + this.model.get( 'cid' );

				if ( values.z_index ) {
					attr.style += 'z-index:' + values.z_index + ';';
				}

				if ( 'bottomshadow' === values.style ) {
					attr[ 'class' ] += ' element-bottomshadow';
				}

				if ( '' !== values.mask ) {
					attr[ 'class' ] += ' has-mask';
				}
				if ( '' !== values.aspect_ratio ) {
					attr[ 'class' ] += ' has-aspect-ratio';
				}

				if ( 'liftup' !== values.hover_type && -1 !== jQuery.inArray( values.caption_style, [ 'off', 'above', 'below' ] ) ) {
					if ( ! this.isFlex ) {
						if ( 'left' === values.align ) {
							attr.style += 'margin-right:25px;float:left;';
						} else if ( 'right' === values.align ) {
							attr.style += 'margin-left:25px;float:right;';
						}
					}

					attr[ 'class' ] += ' hover-type-' + values.hover_type;
				}

				// Caption style.
				if ( -1 === jQuery.inArray( values.caption_style, [ 'off', 'above', 'below' ] ) ) {
					attr[ 'class' ] += ' awb-imageframe-style awb-imageframe-style-' + values.caption_style;
				}

				if ( 'undefined' !== typeof values[ 'class' ] && '' !== values[ 'class' ] ) {
					attr[ 'class' ] += ' ' + values[ 'class' ];
				}
				if ( 'magnify' === values.hover_type && 'no' === values.lightbox && '' === values.link ) {
					attr[ 'class' ] += ' has-image-magnify';
				}
				if ( 'scroll' === values.hover_type ) {
					attr[ 'class' ] += ' has-image-scroll';
				}
				if ( ( 'scroll' === values.hover_type || 'magnify' === values.hover_type ) && '' !== values.mask ) {
					attr[ 'class' ] += ' wrapper-mask';
				}

				if ( 'undefined' !== typeof values.id && '' !== values.id ) {
					attr.id = values.id;
				}

				attr = _.fusionAnimations( values, attr );

				return attr;
			},

			/**
			 * Builds link attributes.
			 *
			 * @since 2.0
			 * @param {Object} values - The values object.
			 * @return {Object}
			 */
			buildLinktAttr: function( values ) {

				// Link Attributes
				var linkAttr = {};
				if ( 'yes' === values.lightbox ) {

					// Set the lightbox image to the dedicated link if it is set.
					if ( '' !== values.lightbox_image ) {
						values.pic_link = values.lightbox_image;
					}

					linkAttr.href  = values.pic_link;
					linkAttr[ 'class' ] = 'fusion-lightbox imageframe-shortcode-link';

					if ( 'magnify' === values.hover_type ) {
						linkAttr[ 'class' ] += ' has-image-magnify';
					}

					if ( '' !== values.gallery_id || '0' === values.gallery_id ) {
						linkAttr[ 'data-rel' ] = 'iLightbox[' + values.gallery_id + ']';
					} else {
						linkAttr[ 'data-rel' ] = 'iLightbox[image-' + this.model.get( 'cid' ) + ']';
					}
				} else if ( values.link ) {
					linkAttr[ 'class' ]  = 'fusion-no-lightbox';
					if ( 'magnify' === values.hover_type ) {
						linkAttr[ 'class' ] += ' has-image-magnify';
					}
					linkAttr.href   = values.link;
					linkAttr.target = values.linktarget;
					if ( '_blank' === values.linktarget ) {
						linkAttr.rel = 'noopener noreferrer';
					}
				}

				return linkAttr;
			},

			/**
			 * Builds image magnify data.
			 *
			 * @since 2.0
			 * @param {Object} values - The values object.
			 * @return {Object}
			 */
			buildImageMagnify: function( values ) {

				// Set magnify attributes
				var imageMagnify = {};
				if ( 'magnify' === values.hover_type ) {
					if ( '' !== values.magnify_full_img ) {
						values.data_magnify_img = values.magnify_full_img;
						imageMagnify[ 'data-magnify-img' ] = values.data_magnify_img;
					}
					if ( '' !== values.magnify_duration ) {
						values.data_duration = values.magnify_duration;
						imageMagnify[ 'data-magnify-duration' ] = values.data_duration;
					}
				}
				return imageMagnify;
			},

			/**
			 * Builds image scroll data.
			 *
			 * @since 2.0
			 * @param {Object} values - The values object.
			 * @return {Object}
			 */
			buildImageScroll: function( values ) {

				// Set scroll attributes
				var imageScroll = {};
				if ( 'scroll' === values.hover_type ) {
					if ( '' !== values.scroll_height ) {
						values.scroll_h = values.scroll_height;
						imageScroll[ 'data-scroll-height' ] = values.scroll_h;
					}
					if ( '' !== values.scroll_speed ) {
						values.scroll_duration = values.scroll_speed;
						imageScroll[ 'data-scroll-speed' ] = values.scroll_duration;
					}
				}
				return imageScroll;
			},

			/**
			 * Builds content attributes.
			 *
			 * @since 2.0
			 * @param {Object} values - The values object.
			 * @return {Object}
			 */
			buildContentAttr: function( values ) {
				var contentAttr = {},
					title       = '',
					src         = '';

				// values.image_id = '';

				// Could add JS to get image dimensions if necessary.
				if ( ! values.element_content ) {
					return 'no_image_set';
				}
				// eslint-disable-next-line no-useless-escape
				src = values.element_content.match( /(src=["\'](.*?)["\'])/ );

				if ( src && 1 < src.length ) {
					src = src[ 2 ];
				} else if ( -1 === values.element_content.indexOf( '<img' ) && '' !== values.element_content ) {
					src = values.element_content;
				}

				if ( ! this.isImgUrl( src ) ) {
					// eslint-disable-next-line quotes
					src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1024 560'%3E%3Cpath fill='%23EAECEF' d='M0 0h1024v560H0z'/%3E%3Cg fill-rule='evenodd' clip-rule='evenodd'%3E%3Cpath fill='%23BBC0C4' d='M378.9 432L630.2 97.4c9.4-12.5 28.3-12.6 37.7 0l221.8 294.2c12.5 16.6.7 40.4-20.1 40.4H378.9z'/%3E%3Cpath fill='%23CED3D6' d='M135 430.8l153.7-185.9c10-12.1 28.6-12.1 38.7 0L515.8 472H154.3c-21.2 0-32.9-24.8-19.3-41.2z'/%3E%3Ccircle fill='%23FFF' cx='429' cy='165.4' r='55.5'/%3E%3C/g%3E%3C/svg%3E";
					contentAttr.width = 600;
				}
				if ( 'undefined' !== typeof src && src && '' !== src ) {
					src             = src.replace( '&#215;', 'x' );
					contentAttr.src = src;
					values.pic_link = src;

					if ( 'no' === values.lightbox && '' !== values.link ) {
						contentAttr.title = title;
					} else {
						contentAttr.title = '';
					}

					contentAttr.alt = values.alt;
				}

				if ( '' !== values.aspect_ratio ) {
					contentAttr[ 'class' ] = 'img-with-aspect-ratio';
				}

				let imageIdSize, imageId, imageSize;
				if ( 'undefined' !== typeof values.image_id && '' !== values.image_id ) {
					const self = this;
					if ( -1 !== values.image_id.indexOf( '|' ) ) {
						imageIdSize = values.image_id.split( '|' );
						imageId     = imageIdSize[ 0 ];
						imageSize   = imageIdSize[ 1 ];
					} else {
						imageId = values.image_id;
					}

					const media = wp.media.attachment( imageId );
					if ( _.isUndefined( media.get( 'title' ) ) ) {
						media.fetch().then( function() {
							self.reRender();
							self._refreshJs();
						} );
					} else if ( imageSize && ! _.isUndefined( media.attributes.sizes ) && ! _.isUndefined( media.attributes.sizes[ imageSize ] ) ) {
						contentAttr.width  = media.attributes.sizes[ imageSize ].width;
						contentAttr.height = media.attributes.sizes[ imageSize ].height;
					} else {
						contentAttr.width  = media.attributes.width;
						contentAttr.height = media.attributes.height;
					}
				}

				return contentAttr;
			},

			/**
			 * Builds border radius.
			 *
			 * @since 2.0
			 * @param {Object} values - The values object.
			 * @return {string}
			 */
			buildBorderRadius: function( values ) {
				var borderRadius = '';

				if ( values.borderradius && '' !== values.borderradius && 0 !== values.borderradius && '0' !== values.borderradius && '0px' !== values.borderradius ) {
					borderRadius += '-webkit-border-radius:' + values.borderradius + ';-moz-border-radius:' + values.borderradius + ';border-radius:' + values.borderradius + ';';
				}

				return borderRadius;
			},

			/**
			 * Builds image styles.
			 *
			 * @since 2.0
			 * @param {Object} atts - The atts object.
			 * @return {string}
			 */
			buildImgStyles: function( atts ) {
				var imgStyles = '';
				if ( atts.borderRadius ) {
					imgStyles = ' style="' + atts.borderRadius + '"';
				}

				return imgStyles;
			},

			/**
			 * Builds element content.
			 *
			 * @since 2.0
			 * @param {Object} atts - The atts object.
			 */
			buildElementContent: function( atts ) {
				var imgClasses = 'img-responsive',
					classes    = '',
					imageAtts  = '';

				if ( 'no_image_set' === atts.contentAttr ) {
					return;
				} else if ( _.FusionIsValidJSON( atts.contentAttr.src ) ) {
					atts.values.element_content = this.getLogoImages( atts );
				} else {
					imageAtts =  _.fusionGetAttributes( atts.contentAttr );
					imageAtts = -1 === imageAtts.indexOf( 'alt=' ) ? imageAtts + ' alt' : imageAtts;
					atts.values.element_content = '<img ' + imageAtts + ' />';
				}

				if ( '' !== atts.values.image_id ) {
					imgClasses += ' wp-image-' + atts.values.image_id;
				}

				// Get custom classes from the img tag.
				// eslint-disable-next-line no-useless-escape
				classes = atts.values.element_content.match( /(class=["\'](.*?)["\'])/ );

				if ( classes && 1 < classes.length ) {
					imgClasses += ' ' + classes[ 2 ];
				}

				imgClasses = 'class="' + imgClasses + '"';

				// Add custom and responsive class and the needed styles to the img tag.
				if ( classes && 'undefined' !== typeof classes[ 0 ] ) {
					atts.values.element_content = atts.values.element_content.replace( classes[ 0 ], imgClasses +  atts.imgStyles );
				} else {
					atts.values.element_content = atts.values.element_content.replace( '/>', imgClasses +  atts.imgStyles + '/>' );
				}

				// Set the lightbox image to the dedicated link if it is set.
				if ( '' !== atts.values.lightbox_image ) {
					atts.values.pic_link = atts.values.lightbox_image;
				}

				if ( -1 === jQuery.inArray( atts.values.caption_style, [ 'off', 'above', 'below' ] ) ) {
					atts.values.element_content += this.generateCaption( atts );
				}

				if ( 'yes' === atts.values.lightbox || atts.values.link ) {
					if ( '' !== atts.values.hover_type &&  'magnify' === atts.values.hover_type ) {
						atts.values.element_content = '<a ' + _.fusionGetAttributes( atts.linkAttr ) + ' ' + _.fusionGetAttributes( atts.imageMagnify ) + '>' + atts.values.element_content + '</a>';
					} else {
						atts.values.element_content = '<a ' + _.fusionGetAttributes( atts.linkAttr ) + '>' + atts.values.element_content + '</a>';
					}
				}

			},

			/**
			 * Builds liftup classes.
			 *
			 * @since 2.0
			 * @param {Object} atts - The atts object.
			 * @return {string}
			 */
			buildLiftupClasses: function( atts ) {
				var liftupClasses = '',
					cid = this.model.get( 'cid' );

				if ( 'liftup' === atts.values.hover_type || ( 'bottomshadow' === atts.values.style_type && ( 'none' === atts.values.hover_type || 'zoomin' === atts.values.hover_type || 'zoomout' === atts.values.hover_type ) ) ) {
					if ( 'liftup' === atts.values.hover_type ) {
						liftupClasses = 'imageframe-liftup';

						if ( ! this.isFlex ) {
							if ( 'left' === atts.values.align ) {
								liftupClasses += ' fusion-imageframe-liftup-left';
							} else if ( 'right' === atts.values.align ) {
								liftupClasses += ' fusion-imageframe-liftup-right';
							}
						}

						if ( atts.borderRadius ) {
							liftupClasses += ' imageframe-cid' + cid;
						}

						if ( '' !== atts.values.hover_type && '' !== atts.values.mask ) {
							liftupClasses += ' awb-image-frame hover-with-mask';
						}

					} else {
						liftupClasses += 'fusion-image-frame-bottomshadow image-frame-shadow-cid' + cid;
					}

					liftupClasses += ' imageframe-cid' + cid;
				}

				return liftupClasses;
			},

			/**
			 * Builds mask styles.
			 *
			 * @since 3.9
			 * @param {Object} atts - The atts object.
			 * @return {string}
			 */
			getMaskVars: function( values ) {
				if ( ! values.mask ) {
					return '';
				}
					const maskUrl = 'custom' === values.mask ? values.custom_mask
									: `${builderConfig.fusion_builder_plugin_dir + '/assets/images/masks/'}${values.mask}.svg`;

					let style      = '';

					if ( maskUrl ) {
						style += '--awb-mask-url: url(' + maskUrl + ');';
					}

					if ( values.mask_size ) {
						const maskSize = values.mask_size;
						if ( 'fit' === maskSize ) {
							style += '--awb-mask-size: contain;';
						}
						if ( 'fill' === maskSize ) {
							style += '--awb-mask-size: cover;';
						}
						if ( 'custom' === maskSize ) {
							style += '--awb-mask-size: ' + values.mask_custom_size + ';';
						}
					}

					if ( values.mask_position ) {
						const maskPosition = 'custom' !== values.mask_position ? values.mask_position.replace( '-', ' ' ) : values.mask_custom_position;
							style += '--awb-mask-position: ' + maskPosition + ';';
					}

					if ( values.mask_repeat ) {
							style += '--awb-mask-repeat: ' + values.mask_repeat + ';';
					}


				return style;
			},

			/**
			 * Builds liftup styles.
			 *
			 * @since 2.0
			 * @param {Object} atts - The atts object.
			 * @return {string}
			 */
			buildLiftupStyles: function( atts ) {
				var liftupStyles = '<style>',
					cid = this.model.get( 'cid' ),
					styleColor;

				if ( atts.borderRadius ) {
					liftupStyles += '.imageframe-liftup.imageframe-cid' + cid + ':before{' + atts.borderRadius + '}';
				}

				if ( '' !== atts.values.max_width && '' === atts.values.aspect_ratio ) {
					liftupStyles += '.imageframe-cid' + cid + '{max-width:' + _.fusionGetValueWithUnit( atts.values.max_width ) + '}';
				}

				if ( 'liftup' === atts.values.hover_type || ( 'bottomshadow' === atts.values.style_type && ( 'none' === atts.values.hover_type || 'zoomin' === atts.values.hover_type || 'zoomout' === atts.values.hover_type ) ) ) {
					styleColor = ( 0 === atts.values.stylecolor.indexOf( '#' ) ) ? jQuery.AWB_Color( atts.values.stylecolor ).alpha( 0.4 ).toVarOrRgbaString() : jQuery.AWB_Color( atts.values.stylecolor ).toVarOrRgbaString();

					if ( 'liftup' === atts.values.hover_type ) {
						if ( 'bottomshadow' === atts.values.style_type ) {
							liftupStyles  += '.element-bottomshadow.imageframe-cid' + cid + ':before, .element-bottomshadow.imageframe-cid' + cid + ':after{';
							liftupStyles  += '-webkit-box-shadow: 0 17px 10px ' + styleColor + ';box-shadow: 0 17px 10px ' + styleColor + ';}';
						}
					} else {
						liftupStyles += '.imageframe-cid' + cid + '{display: inline-block}';
						liftupStyles  += '.element-bottomshadow.imageframe-cid' + cid + ':before, .element-bottomshadow.imageframe-cid' + cid + ':after{';
						liftupStyles  += '-webkit-box-shadow: 0 17px 10px ' + styleColor + ';box-shadow: 0 17px 10px ' + styleColor + ';}';
					}
				}

				liftupStyles += '</style>';

				return liftupStyles;
			},

			/**
			 * Builds margin styles.
			 *
			 * @since 3.5
			 * @param {Object} atts - The atts object.
			 * @return {string}
			 */
			buildMarginStyles: function( atts ) {
				var extras = jQuery.extend( true, {}, fusionAllElements.fusion_imageframe.extras ),
					elementSelector = 'div.imageframe-cid' + this.model.get( 'cid' ),
					responsiveStyles = '';

				if ( 'liftup' !== atts.values.hover_type && 'bottomshadow' !== atts.values.style ) {
					elementSelector = 'span.imageframe-cid' + this.model.get( 'cid' );
				}

				_.each( [ 'large', 'medium', 'small' ], function( size ) {
					var marginStyles = '',
						marginKey;

					_.each( [ 'top', 'right', 'bottom', 'left' ], function( direction ) {

						// Margin.
						marginKey = 'margin_' + direction + ( 'large' === size ? '' : '_' + size );
						if ( '' !== atts.values[ marginKey ] ) {
							marginStyles += 'margin-' + direction + ' : ' + _.fusionGetValueWithUnit( atts.values[ marginKey ] ) + ';';
						}

					} );

					if ( '' === marginStyles ) {
						return;
					}

					// Wrap CSS selectors
					if ( '' !== marginStyles ) {
						marginStyles = elementSelector + ' {' + marginStyles + '}';
					}

					// Large styles, no wrapping needed.
					if ( 'large' === size ) {
						responsiveStyles += marginStyles;
					} else {
						// Medium and Small size screen styles.
						responsiveStyles += '@media only screen and (max-width:' + extras[ 'visibility_' + size ] + 'px) {' + marginStyles + '}';
					}
				} );

				responsiveStyles += this.buildCaptionStyles( atts );


				return responsiveStyles;
			},

			/**
			 * Generate logos images markup.
			 *
			 * @since 3.0
			 * @param {string} images - The atts object.
			 * @return {string}
			 */
			getLogoImages: function( atts ) {

				var data    	= JSON.parse( atts.contentAttr.src ),
					normalUrl 	= data[ 'default' ] && data[ 'default' ].normal &&  data[ 'default' ].normal.url,
					stickyUrl 	= data.sticky && data.sticky.normal && data.sticky.normal.url,
					mobileUrl	= data.mobile && data.mobile.normal && data.mobile.normal.url,
					content 	= '';

				if ( normalUrl ) {
					content += this.getLogoImage( atts, data[ 'default' ], 'fusion-standard-logo' );
				}
				if ( stickyUrl ) {
					content += this.getLogoImage( atts, data.sticky, 'fusion-sticky-logo' );
				}
				if ( mobileUrl ) {
					content += this.getLogoImage( atts, data.mobile, 'fusion-mobile-logo' );
				}

				return content;
			},

			/**
			 * Generate logos image markup.
			 *
			 * @since 3.0
			 * @param {Object} data      - The data object.
			 * @param {string} itemClass - Class for image.
			 * @return {string}
			 */
			getLogoImage: function( atts, data, itemClass ) {
				var content     = '',
					logoUrl    = '',
					logoData   = {
						'url': '',
						'srcset': '',
						'style': '',
						'retina_url': false,
						'width': '',
						'height': '',
						'class': itemClass
					},
					retinaUrl = ( data.retina && data.retina.url ) || '';

				logoUrl              = data.normal.url;
				logoData.srcset = logoUrl + ' 1x';

				// Get retina logo, if default one is not set.
				if ( '' === logoUrl ) {
					logoUrl            = retinaUrl;
					logoData.srcset = logoUrl + ' 1x';
					logoData.url    = logoUrl;
					logoData.width  = data.retina.width;
					logoData.height = data.retina.height;

					if ( '' !== logoData.width ) {
						logoData.style = 'max-height:' + logoData.height + 'px;height:auto;';
					}
				} else {
					logoData.url        = logoUrl;
					logoData.width      = ( data.normal && data.normal.width ) || '';
					logoData.height     = ( data.normal && data.normal.height ) || '';
				}

				if ( data.normal && '' !== data.normal && '' !== logoData.width && '' !== logoData.height ) {
					logoData.retina_url = retinaUrl;
					logoData.srcset    += ', ' + retinaUrl + ' 2x';

					if ( '' !== logoData.width ) {
						logoData.style = 'max-height:' + logoData.height + 'px;height:auto;';
					}
				}

				atts.attr[ 'class' ] += ' has-' + itemClass;

				content = '<img ' + _.fusionGetAttributes( logoData ) + ' />';

				return content;
			},

			/**
			 * Generate caption markup.
			 *
			 * @since 3.5
			 * @param {string} atts - The atts object.
			 * @return {string}
			 */
			generateCaption: function( atts ) {
				var self = this,
					content = '<div ' + _.fusionGetAttributes( this.buildCaptionAttr( atts.values ) ) + '><div class="awb-imageframe-caption">',
					title = '',
					caption = '',
					title_tag = '',
					image_id,
					media;

				if ( 'off' === atts.values.caption_style ) {
					return '';
				}

				// Get image title & caption from attachment attribute.
				if ( 'undefined' !== typeof atts.values.image_id && '' !== atts.values.image_id ) {
					if ( -1 !== atts.values.image_id.indexOf( '|' ) ) {
						image_id = atts.values.image_id.split( '|' )[ 0 ];
					} else {
						image_id = atts.values.image_id;
					}
					media = wp.media.attachment( image_id );
					if ( _.isUndefined( media.get( 'title' ) ) ) {
						media.fetch().then( function() {
							self.reRender();
							self._refreshJs();
						} );
					} else {
						title = media.get( 'title' );
						caption = media.get( 'caption' );
					}
				}

				// Otherwise get title & caption from custom option.
				if ( '' !== atts.values.caption_title ) {
					title = atts.values.caption_title;
				}
				if ( '' !== atts.values.caption_text ) {
					caption = atts.values.caption_text;
				}

				if ( '' !== title ) {
					title_tag = 'div' === atts.values.caption_title_tag ? 'div' : 'h' + atts.values.caption_title_tag;
					content += '<' + title_tag + ' class="awb-imageframe-caption-title">' + title + '</' + title_tag + '>';
				}
				if ( '' !== caption ) {
					content += '<p class="awb-imageframe-caption-text">' + caption + '</p>';
				}
				content += '</div></div>';

				return content;
			},

			/**
			 * Runs just after render on cancel.
			 *
			 * @since 3.5
			 * @return null
			 */
			beforeGenerateShortcode: function() {
				var elementType = this.model.get( 'element_type' ),
					options     = fusionAllElements[ elementType ].params,
					values      = jQuery.extend( true, {}, fusionAllElements[ elementType ].defaults, _.fusionCleanParameters( this.model.get( 'params' ) ) );

				if ( 'object' !== typeof options ) {
					return;
				}

				// If images needs replaced lets check element to see if we have media being used to add to object.
				if ( 'undefined' !== typeof FusionApp.data.replaceAssets && FusionApp.data.replaceAssets && ( 'undefined' !== typeof FusionApp.data.fusion_element_type || 'fusion_template' === FusionApp.getPost( 'post_type' ) ) ) {

					this.mapStudioImages( options, values );

					if ( '' !== values.element_content ) {
						// If its not within object already, add it.
						if ( 'undefined' === typeof FusionPageBuilderApp.mediaMap.images[ values.element_content ] ) {
								FusionPageBuilderApp.mediaMap.images[ values.element_content ] = true;
							}

						// Check if we have an image ID for this param.
						if ( 'undefined' !== typeof values.image_id && '' !== values.image_id )	{
							if ( 'object' !== typeof FusionPageBuilderApp.mediaMap.images[ values.element_content ] ) {
								FusionPageBuilderApp.mediaMap.images[ values.element_content ] = {};
							}
							FusionPageBuilderApp.mediaMap.images[ values.element_content ].image_id = values.image_id;
						}
					}
				}
			},

			/**
			 * Builds caption attributes.
			 *
			 * @since 2.0
			 * @param {Object} values - The values object.
			 * @return {Object}
			 */
			buildCaptionAttr: function( values ) {
				// Caption Attributes.
				var attr = {
					'class': 'awb-imageframe-caption-container',
					'style': ''
				};

				if ( '' !== values.max_width && -1 !== jQuery.inArray( values.caption_style, [ 'above', 'below' ] ) && '' === values.aspect_ratio ) {
					attr.style += 'max-width:' + _.fusionGetValueWithUnit( values.max_width ) + ';';
				}
				if ( -1 !== jQuery.inArray( values.caption_style, [ 'above', 'below' ] ) ) {
					const sizes = [ 'large', 'medium', 'small' ];
					sizes.forEach( ( size ) => {
						const key = 'caption_align' + ( 'large' === size ? '' : '_' + size );

						const align = values[ key ] && 'none' !== values[ key ] ? values[ key ] : false;

						if ( align ) {
							if ( 'large' === size ) {
								attr.style += 'text-align:' + values[ key ] + ';';
							} else {
								attr[ 'class' ] += ( 'medium' === size ? ' md-text-align-' : ' sm-text-align-' ) + values[ key ];
							}
						}
					} );
				}
				return attr;
			},

			/**
			 * Gets style variables.
			 *
			 * @since 3.9
			 * @return {String}
			 */
			getStyleVariables: function( values ) {
				const cssVarsOptions = [
					'caption_title_color',
					'caption_title_transform',
					'caption_title_line_height',
					'caption_text_color',
					'caption_text_transform',
					'caption_text_line_height',
					'caption_border_color',
					'caption_overlay_color',
					'caption_background_color'
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
				cssVarsOptions.caption_text_size   = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.caption_text_letter_spacing   = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.caption_margin_top   = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.caption_margin_right   = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.caption_margin_bottom   = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.caption_margin_left   = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.sticky_max_width       = { 'callback': _.fusionGetValueWithUnit };

				const customVars = [];
				const caption_title_tag = values.caption_title_tag;
				const caption_title_def_prefix = isNaN( caption_title_tag ) ? 'var(--body_typography-' : 'var(--h' + caption_title_tag + '_typography-';
				const caption_title_def_postfix = ')';

				const title_typography = _.fusionGetFontStyle( 'caption_title_font', values, 'object' );

				if ( '' !== values.max_width && '' === values.aspect_ratio ) {
					cssVarsOptions.max_width = { 'callback': _.fusionGetValueWithUnit };
				}

				if ( title_typography[ 'font-family' ] ) {
					customVars.caption_title_font_family = title_typography[ 'font-family' ];
				} else {
					customVars.caption_title_font_family = caption_title_def_prefix + 'font-family' + caption_title_def_postfix;
				}

				if ( title_typography[ 'font-weight' ] ) {
					customVars.caption_title_font_weight = title_typography[ 'font-weight' ];
				} else {
					customVars.caption_title_font_weight = caption_title_def_prefix + 'font-weight' + caption_title_def_postfix;
				}

				if ( title_typography[ 'font-style' ] ) {
					customVars.caption_title_font_style = title_typography[ 'font-style' ];
				} else {
					customVars.caption_title_font_style = caption_title_def_prefix + 'font-style' + caption_title_def_postfix;
				}

				customVars.caption_title_size = values.caption_title_size ? _.fusionGetValueWithUnit( values.caption_title_size ) : caption_title_def_prefix + 'font-size' + caption_title_def_postfix;

				customVars.caption_title_transform = values.caption_title_transform ? values.caption_title_transform : caption_title_def_prefix + 'text-transform' + caption_title_def_postfix;

				customVars.caption_title_line_height = values.caption_title_line_height ? values.caption_title_line_height : caption_title_def_prefix + 'line-height' + caption_title_def_postfix;

				customVars.caption_title_letter_spacing = values.caption_title_letter_spacing ? _.fusionGetValueWithUnit( values.caption_title_letter_spacing ) : caption_title_def_prefix + 'letter-spacing' + caption_title_def_postfix;


				return this.getCssVarsForOptions( cssVarsOptions ) + this.getCustomCssVars( customVars ) + this.getFontStylingVars( 'caption_text_font', values );
			},

			isImgUrl( url ) {
				if ( -1 !== url.indexOf( 'gravatar.com' ) ) {
					return true;
				}

				return ( /\.(jpg|jpeg|png|webp|avif|gif|svg)$/ ).test( url );
			}

		} );
	} );
}( jQuery ) );
