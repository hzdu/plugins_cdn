var FusionPageBuilder = FusionPageBuilder || {};

( function() {

	jQuery( document ).ready( function() {

		// Alert Element View.
		FusionPageBuilder.fusion_alert = FusionPageBuilder.ElementView.extend( {

			/**
			 * Modify template attributes.
			 *
			 * @since 2.0
			 * @param {Object} atts - The attributes object.
			 * @return {Object}
			 */
			filterTemplateAtts: function( atts ) {
				var attributes = {};

				// Validate values.
				this.validateValues( atts.values );

				// Create attribute objects
				attributes.attr           = this.buildAttr( atts.values );
				attributes.buttonStyles   = this.buildButtonStyles( atts.values );
				attributes.contentAttr    = this.buildContentAttr( atts.values );

				// Any extras that need passed on.
				attributes.cid    = this.model.get( 'cid' );
				attributes.values = atts.values;

				return attributes;
			},

			/**
			 * Modify the values.
			 *
			 * @since 2.0
			 * @param {Object} values - The values object.
			 * @return {void}
			 */
			validateValues: function( values ) {
				values.alert_class = 'info';

				values.margin_bottom = _.fusionValidateAttrValue( values.margin_bottom, 'px' );
				values.margin_left   = _.fusionValidateAttrValue( values.margin_left, 'px' );
				values.margin_right  = _.fusionValidateAttrValue( values.margin_right, 'px' );
				values.margin_top    = _.fusionValidateAttrValue( values.margin_top, 'px' );

				values.padding_bottom = _.fusionValidateAttrValue( values.padding_bottom, 'px' );
				values.padding_left   = _.fusionValidateAttrValue( values.padding_left, 'px' );
				values.padding_right  = _.fusionValidateAttrValue( values.padding_right, 'px' );
				values.padding_top    = _.fusionValidateAttrValue( values.padding_top, 'px' );

				values.border_size = parseFloat( values.border_size ) + 'px;';
				values.dismissable = 'yes' === values.dismissable ? 'boxed' : values.dismissable;

				switch ( values.type ) {
				case 'general':
					values.alert_class = 'info';
					if ( ! values.icon || 'none' !== values.icon ) {
						values.icon = 'awb-icon-info-circle';
					}
					break;
				case 'error':
					values.alert_class = 'danger';
					if ( ! values.icon || 'none' !== values.icon ) {
						values.icon = 'awb-icon-exclamation-triangle';
					}
					break;
				case 'success':
					values.alert_class = 'success';
					if ( ! values.icon || 'none' !== values.icon ) {
						values.icon = 'awb-icon-check-circle';
					}
					break;
				case 'notice':
					values.alert_class = 'warning';
					if ( ! values.icon || 'none' !== values.icon ) {
						values.icon = 'awb-icon-cog';
					}
					break;
				case 'blank':
					values.alert_class = 'blank';
					break;
				case 'custom':
					values.alert_class = 'custom';
					break;
				}

				// Make sure the title text is not wrapped with an unattributed p tag.
				if ( 'undefined' !== typeof values.element_content ) {
					values.element_content = values.element_content.trim();
					values.element_content = values.element_content.replace( /(<p[^>]+?>|<p>|<\/p>)/img, '' );
				}
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
						class: 'fusion-alert alert fusion-live-alert fusion-alert-cid' + this.model.get( 'cid' ),
						style: this.getStyleVars( values ),
						role: 'alert'
					} ),
					alertClass   = values.alert_class;

				attr[ 'class' ] += _.fusionGetStickyClass( values.sticky_display );

				if ( 'capitalize' === values.text_transform ) {
					alertClass += ' fusion-alert-capitalize';
				}

				attr[ 'class' ] += 'yes' === values.link_color_inheritance ? ' awb-alert-inherit-link-color' : ' awb-alert-native-link-color';

				if ( 'boxed' === values.dismissable || 'floated' === values.dismissable ) {
					alertClass += ' alert-dismissable awb-alert-close-' + values.dismissable;
				}

				attr[ 'class' ] += ' alert-' + alertClass;
				attr[ 'class' ] += ' fusion-alert-' + values.text_align;
				attr[ 'class' ] += ' ' + values.type;

				if ( 'yes' === values.box_shadow ) {
					attr[ 'class' ] += ' alert-shadow';
				}

				if ( '' !== values[ 'class' ] ) {
					attr[ 'class' ] += ' ' + values[ 'class' ];
				}

				if ( '' !== values.id ) {
					attr.id = values.id;
				}

				attr = _.fusionAnimations( values, attr );

				return attr;
			},

			getStyleVars: function( values ) {
				var customVars = [],
					corners    = [
						'top_left',
						'top_right',
						'bottom_right',
						'bottom_left'
					],
					cssVars = [
						'margin_top',
						'margin_right',
						'margin_bottom',
						'margin_left',
						'padding_top',
						'padding_right',
						'padding_bottom',
						'padding_left'
					];
				this.values = values;

				if ( 'custom' === values.alert_class ) {
					cssVars.push( 'background_color' );
					cssVars.push( 'accent_color' );
					cssVars.push( 'border_size' );

					_.each( corners, function( corner ) {
						if ( values[ 'border_radius_' + corner ] ) {
							customVars[ 'border-' + corner.replace( '_', '-' ) + '-radius' ] = values[ 'border_radius_' + corner ];
						}
					} );
				}

				return this.getCssVarsForOptions( cssVars )  + this.getCustomCssVars( customVars );
			},

			/**
			 * Builds attributes.
			 *
			 * @since 2.0
			 * @return {Object}
			 */
			buildContentAttr: function() {
				var contentAttr = _.fusionInlineEditor( {
					cid: this.model.get( 'cid' ),
					'disable-return': true,
					'disable-extra-spaces': true,
					toolbar: 'simple'
				}, {
					class: 'fusion-alert-content'
				} );
				return contentAttr;
			},

			/**
			 * Builds the styles.
			 *
			 * @since 2.0
			 * @param {Object} values - The values object.
			 * @return {string}
			 */
			buildButtonStyles: function( values ) {
				if ( 'custom' === values.alert_class ) {
					return 'color:' + values.accent_color + ';border-color:' + values.accent_color + ';';
				}
				return '';
			}
		} );
	} );
}( jQuery ) );
