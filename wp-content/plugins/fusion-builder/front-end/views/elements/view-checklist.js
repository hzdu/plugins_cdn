/* global fusionSanitize */
var FusionPageBuilder = FusionPageBuilder || {};

( function() {

	jQuery( document ).ready( function() {

		// Accordion View.
		FusionPageBuilder.fusion_checklist = FusionPageBuilder.ParentElementView.extend( {

			/**
			 * Runs when child view is added.
			 *
			 * @since 3.9
			 * @return {void}
			 */
			childViewAdded: function() {
				this.updateList();
			},

			/**
			 * Runs when child view is removed.
			 *
			 * @since 3.9
			 * @return {void}
			 */
			childViewRemoved: function() {
				this.updateList();
			},

			/**
			 * Runs when child view is cloned.
			 *
			 * @since 3.9
			 * @return {void}
			 */
			childViewCloned: function() {
				var self = this;

				setTimeout( function() {
					self.updateList();
				}, 100 );
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

				this.validateValues( atts.values, atts.extras );

				this.values = atts.values;
				atts.values.size = '' === atts.values.size ? '16px' : atts.values.size;
				this.font_size   = parseFloat( atts.values.size );
				this.line_height = this.font_size * 1.7;

				// Create attribute objects.
				attributes.checklistShortcode = this.buildChecklistAttr( atts.values );

				// Any extras that need passed on.
				attributes.values = atts.values;
				attributes.cid    = this.model.get( 'cid' );

				return attributes;
			},

			/**
			 * Modify values.
			 *
			 * @since 2.0
			 * @param {Object} values - The values object.
			 * @param {Object} extras - The extras object.
			 * @return {void}
			 */
			validateValues: function( values, extras ) {
				values.size = _.fusionValidateAttrValue( values.size, 'px' );

				// Fallbacks for old size parameter and 'px' check+
				if ( 'small' === values.size ) {
					values.size = '13px';
				} else if ( 'medium' === values.size ) {
					values.size = '18px';
				} else if ( 'large' === values.size ) {
					values.size = '40px';
				} else if ( -1 === values.size.indexOf( 'px' ) ) {
					values.size = fusionSanitize.convert_font_size_to_px( values.size, extras.body_font_size );
				}

				values.circle = ( 1 == values.circle ) ? 'yes' : values.circle;

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
			buildChecklistAttr: function( values ) {

				// Main Attributes
				var checklistShortcode = {
					'class': 'fusion-checklist fusion-checklist-' + this.model.get( 'cid' ),
					'style': this.getStyleVars( values )
				};

				if ( -1 === checklistShortcode.style.indexOf( '--awb-odd-row-bgcolor' ) && -1 === checklistShortcode.style.indexOf( '--awb-item-padding-top' ) ) {
					checklistShortcode[ 'class' ] += ' fusion-checklist-default';
				}

				checklistShortcode = _.fusionVisibilityAtts( values.hide_on_mobile, checklistShortcode );

				if ( 'yes' === values.divider ) {
					checklistShortcode[ 'class' ] += ' fusion-checklist-divider';
				}

				if ( '' !== values.type ) {
					checklistShortcode[ 'class' ] += ' type-' + values.type;
				}

				if ( '' !== values[ 'class' ] ) {
					checklistShortcode[ 'class' ] += ' ' + values[ 'class' ];
				}

				if ( '' !== values.id ) {
					checklistShortcode.id = values.id;
				}
				checklistShortcode[ 'class' ] += ' fusion-child-element';
				checklistShortcode[ 'data-empty' ] = this.emptyPlaceholderText;

				return checklistShortcode;
			},

			/**
			 * Extendable function for when child elements get generated.
			 *
			 * @since 3.9
			 * @param {Object} modules An object of modules that are not a view yet.
			 * @return {void}
			 */
			onGenerateChildElements: function( modules ) {
				var i = 1;

				// Set child counter. Used for auto rotation.
				_.each( modules, function( child ) {
					child.counter = i;
					i++;
				} );
			},

			/**
			 * Updates list when type is set to numbered.
			 *
			 * @since 3.9
			 * @return {void}
			 */
			updateList: function() {
				var counter = 1,
					self = this;
				if ( 'numbered' === this.values.type ) {
					this.$el.find( '.fusion-li-item' ).each( function() {
						jQuery( this ).find( '.icon-wrapper' ).html( counter );
						counter++;
					} );

					setTimeout( function() {
						var i = 1;
						_.each( self.model.children.models, function( child ) {
							child.set( 'counter', i );
							i++;
						} );
					}, 100 );
				}
			},

			getStyleVars: function( values ) {
				var cssVarsOptions = [
					'size',
					'margin_top',
					'margin_right',
					'margin_bottom',
					'margin_left',
					'item_padding_top',
					'item_padding_right',
					'item_padding_bottom',
					'item_padding_left',
					'odd_row_bgcolor',
					'even_row_bgcolor',
					'iconcolor'
				],
				customVars = {};

				if ( 'yes' === values.divider ) {
					cssVarsOptions.push( 'divider_color' );
				}

				if ( '' !== values.textcolor ) {
					cssVarsOptions.push( 'textcolor' );
				}

				customVars.line_height = this.line_height + 'px';
				customVars.icon_width  = this.line_height + 'px';
				customVars.icon_height = this.line_height + 'px';
				customVars.icon_margin = ( this.font_size * 0.7 ) + 'px';
				customVars.content_margin = ( this.line_height + ( this.font_size * 0.7 ) ) + 'px';

				if ( 'yes' === values.circle ) {
					customVars.circlecolor          = values.circlecolor;
					customVars.circle_yes_font_size = values.circle_yes_font_size + 'px';
				}

				return this.getCssVarsForOptions( cssVarsOptions ) + this.getCustomCssVars( customVars );
			}

		} );
	} );
}( jQuery ) );
