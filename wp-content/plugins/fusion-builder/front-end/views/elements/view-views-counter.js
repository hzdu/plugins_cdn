/* global fusionBuilderText, FusionApp */
var FusionPageBuilder = FusionPageBuilder || {};

( function() {

	jQuery( document ).ready( function() {

		FusionPageBuilder.fusion_views_counter = FusionPageBuilder.ElementView.extend( {

			/**
			 * Modify template attributes.
			 *
			 * @since 3.5
			 * @param {Object} atts - The attributes.
			 * @returns {Object}
			 */
			filterTemplateAtts: function( atts ) {
				// Variables we will pass to the template.
				var templateVariables = {};

				templateVariables.cid = this.model.get( 'cid' );

				// Attributes for our wrapping element.
				templateVariables.isDisabled        = 'disabled' === FusionApp.settings.post_views;
				templateVariables.isDisabledText    = fusionBuilderText.post_views_counter_disabled;
				templateVariables.wrapperAttributes = this.buildWrapperAtts( atts.values );
				templateVariables.contentAttributes = this.buildContentAtts( atts.values );
				templateVariables.mainContent       = this.getViewsText( atts.values, atts.extras );

				return templateVariables;
			},

			/**
			 * Get the text that is displaying the views.
			 *
			 * @since 3.5
			 * @param {Object} atts - The values.
			 * @param {Object} extras - The extras variables.
			 * @return {string}
			 */
			getViewsText: function( atts, extras ) {
				var self = this,
					viewsToDisplay = atts.views_displayed.split( ',' ),
					text = '',
					separator = '<span class="awb-views-counter-separator">' + atts.separator + '</span>',
					isLastItem,
					totalViews,
					todayViews,
					viewsText,
					label;

				_.each( viewsToDisplay, function( viewType, index, list ) {
					isLastItem = ( list.length - 1 === index ? true : false );
					if ( isLastItem ) {
						separator = '';
					}

					if ( 'total_views' === viewType ) {
						totalViews = extras.total_views;
						label      = _.isEmpty( atts.total_views_label ) ? self.getTranslationText( viewType, atts, extras ) : atts.total_views_label;

						if ( 'before' === atts.labels ) {
							viewsText = label + totalViews;
						} else if ( 'after' === atts.labels ) {
							viewsText = totalViews + label;
						} else {
							viewsText = totalViews;
						}

						text += '<span class="awb-views-counter-total-views">' + viewsText + '</span>' + separator;
					}

					if ( 'today_views' === viewType ) {
						todayViews = extras.today_views;
						label      = _.isEmpty( atts.today_views_label ) ? self.getTranslationText( viewType, atts, extras ) : atts.today_views_label;

						if ( 'before' === atts.labels ) {
							viewsText = label + todayViews;
						} else if ( 'after' === atts.labels ) {
							viewsText = todayViews + label;
						} else {
							viewsText = todayViews;
						}

						text += '<span class="awb-views-counter-today-views">' + viewsText + '</span>' + separator;
					}
				} );

				return text;
			},

			/**
			 * Get the correct punctuation for the texts.
			 *
			 * @since 3.5
			 * @param {Object} values - The values.
			 * @param {string} extras - The extras.
			 * @returns {string}
			 */
			getTranslationText: function( viewType, values, extras ) {
				var translation_text = '';

				if ( 'total_views' === viewType ) {
					if ( 'before' === values.labels ) {
						translation_text = extras.default_total_views_before_text;
					} else if ( 'after' === values.labels ) {
						translation_text = extras.default_total_views_after_text;
					}
				} else if ( 'today_views' === viewType ) {
					if ( 'before' === values.labels ) {
						translation_text = extras.default_today_views_before_text;
					} else if ( 'after' === values.labels ) {
						translation_text = extras.default_today_views_after_text;
					}
				}

				return translation_text;
			},

			/**
			 * Builds attributes.
			 *
			 * @since 3.5
			 * @param {Object} values - The values.
			 * @returns {Object}
			 */
			buildWrapperAtts: function( values ) {
				var wrapperAttributes         = _.fusionVisibilityAtts( values.hide_on_mobile, {
					class: 'awb-views-counter awb-views-counter-' + this.model.get( 'cid' ),
					style: this.getInlineStyle( values )
				} );

				if ( values[ 'class' ] ) {
					wrapperAttributes[ 'class' ] += ' ' + values[ 'class' ];
				}

				if ( values.id ) {
					wrapperAttributes.id = values.id;
				}

				wrapperAttributes = _.fusionAnimations( values, wrapperAttributes );

				return wrapperAttributes;
			},

			/**
			 * Builds content attributes.
			 *
			 * @since 3.5
			 * @param {Object} values - The values.
			 * @returns {Object}
			 */
			buildContentAtts: function( values ) {
				var contentAttributes = {
					'class': 'awb-views-counter-content'
				};

				if ( 'stacked' === values.layout ) {
					contentAttributes[ 'class' ] += ' awb-views-counter-content-stacked';
				}

				return contentAttributes;
			},

			/**
			 * Get inline style.
			 *
			 * @since 3.9
			 * @param {Object} values
			 * @return string
			 */
			getInlineStyle: function( values ) {
				var cssVarsOptions = {},
					boxShadow,
					customVars = {};
				this.values = values;

				cssVarsOptions = [
					'color',
					'background',
					'font_size',
					'padding_top',
					'padding_right',
					'padding_bottom',
					'padding_left',
					'margin_top',
					'margin_right',
					'margin_bottom',
					'margin_left',
					'border_radius_top_left',
					'border_radius_top_right',
					'border_radius_bottom_right',
					'border_radius_bottom_left'
				];

				if ( values.alignment_floated && 'floated' === values.layout ) {
					customVars.alignment_floated = values.alignment_floated;
				}

				if ( values.alignment_stacked && 'stacked' === values.layout ) {
					customVars.alignment_stacked = values.alignment_stacked;
				}

				boxShadow = _.awbGetBoxShadowCssVar( '--awb-box-shadow', values );

				return this.getCssVarsForOptions( cssVarsOptions ) + this.getCustomCssVars( customVars ) + boxShadow;
			}
		} );
	} );
}( jQuery ) );
