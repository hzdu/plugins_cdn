/* global fusionAllElements, FusionPageBuilderElements, FusionPageBuilderViewManager */
var FusionPageBuilder = FusionPageBuilder || {};

( function() {

	jQuery( document ).ready( function() {

		// Toggle child View
		FusionPageBuilder.fusion_li_item = FusionPageBuilder.ChildElementView.extend( {

			/**
			 * Runs after view DOM is patched.
			 *
			 * @since 3.9
			 * @return {void}
			 */
			afterPatch: function() {
				var parentView = FusionPageBuilderViewManager.getView( this.model.get( 'parent' ) );

				if ( 'undefined' !== typeof parentView ) {
					parentView.updateList();
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

				var attributes  = {},
					parent      = this.model.get( 'parent' ),
					parentModel = FusionPageBuilderElements.find( function( model ) {
						return model.get( 'cid' ) == parent;
					} );

				this.parentValues = jQuery.extend( true, {}, fusionAllElements.fusion_checklist.defaults, _.fusionCleanParameters( parentModel.get( 'params' ) ) );
				this.parentExtras = parentModel.get( 'extras' );

				// Create attribute objects.
				attributes.checklistShortcodeSpan        = this.buildChecklistShortcodeSpanAttr( atts.values );
				attributes.checklistShortcodeIcon        = this.buildChecklistShortcodeIconAttr( atts.values );
				attributes.checklistShortcodeItemContent = this.buildChecklistShortcodeItemContentAttr( atts.values );
				this.$el.attr( 'style', this.getChildCssVars( atts.values ) );

				// Any extras that need passed on.
				attributes.cid          = this.model.get( 'cid' );
				attributes.parent       = parent;
				attributes.parentValues = this.parentValues;
				attributes.output       = atts.values.element_content;
				attributes.counter      = this.model.get( 'counter' );

				attributes.usingDynamicParent = this.isParentHasDynamicContent( this.parentValues );

				return attributes;
			},

			getChildCssVars: function( values ) {
				var cssVarsOptions = [
					'circlecolor',
					'iconcolor'
				];

				this.values = values;

				return this.getCssVarsForOptions( cssVarsOptions );
			},

			/**
			 * Builds attributes.
			 *
			 * @since 2.0
			 * @param {Object} values - The values object.
			 * @return {Object}
			 */
			buildChecklistShortcodeSpanAttr: function( values ) {
				var checklistShortcodeSpan = {
						style: ''
					},
					circleClass = 'circle-no';

				this.parentValues.circle = ( 1 == this.parentValues.circle ) ? 'yes' : this.parentValues.circle;

				if ( 'yes' === values.circle || ( 'yes' === this.parentValues.circle && 'no' !== values.circle ) ) {
					circleClass = 'circle-yes';
				}

				checklistShortcodeSpan[ 'class' ] = 'icon-wrapper ' + circleClass;

				return checklistShortcodeSpan;
			},

			/**
			 * Builds attributes.
			 *
			 * @since 2.0
			 * @param {Object} values - The values object.
			 * @return {Object}
			 */
			buildChecklistShortcodeIconAttr: function( values ) {
				var checklistShortcodeIcon = {},
					icon;

				if ( ! values.icon || '' === values.icon ) {
					icon = _.fusionFontAwesome( this.parentValues.icon );
				} else {
					icon = _.fusionFontAwesome( values.icon );
				}

				checklistShortcodeIcon = {
					class: 'fusion-li-icon ' + icon,
					'aria-hidden': 'true'
				};

				return checklistShortcodeIcon;
			},

			/**
			 * Builds attributes.
			 *
			 * @since 2.0
			 * @return {Object}
			 */
			buildChecklistShortcodeItemContentAttr: function() {
				var checklistShortcodeItemContent = {
					class: 'fusion-li-item-content',
					style: ''
				};

				checklistShortcodeItemContent = _.fusionInlineEditor( {
					cid: this.model.get( 'cid' ),
					'data-disable-return': true,
					'data-disable-extra-spaces': true
				}, checklistShortcodeItemContent );

				return checklistShortcodeItemContent;
			}

		} );
	} );
}( jQuery ) );
