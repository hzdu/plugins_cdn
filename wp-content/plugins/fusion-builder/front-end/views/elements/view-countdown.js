/* global fusionAllElements */
var FusionPageBuilder = FusionPageBuilder || {};

( function() {

	jQuery( document ).ready( function() {

		// Countdown view
		FusionPageBuilder.fusion_countdown = FusionPageBuilder.ElementView.extend( {

			/**
			 * Init.
			 *
			 * @since 2.2
			 * @return {void}
			 */
			onInit: function() {
				this.deprecatedParams();
			},

			/**
			 * Runs during render() call.
			 *
			 * @since 2.0
			 * @return {void}
			 */
			onRender: function() {
				var that = this;

				jQuery( window ).on( 'load', function() {
					that.afterPatch();
				} );
			},

			/**
			 * Runs before element is removed.
			 *
			 * @since 2.0
			 * @return {void}
			 */
			beforeRemove: function() {
				this.beforePatch();
			},

			/**
			 * Runs after view DOM is patched.
			 *
			 * @since 2.0
			 * @return {void}
			 */
			beforePatch: function() {
				var countdown = jQuery( '#fb-preview' )[ 0 ].contentWindow.jQuery( this.$el.find( '.fusion-countdown-counter-wrapper' ) );

				countdown.stopCountDown();
				countdown.removeData();
			},

			/**
			 * Runs after view DOM is patched.
			 *
			 * @since 2.0
			 * @return {void}
			 */
			afterPatch: function() {
				var countdown = jQuery( '#fb-preview' )[ 0 ].contentWindow.jQuery( this.$el.find( '.fusion-countdown-counter-wrapper' ) );

				setTimeout( function() {
					countdown.stopCountDown();
					countdown.fusion_countdown();
				}, 300 );
			},

			/**
			 * Modify template attributes.
			 *
			 * @since 2.0
			 * @param {Object} atts - The attributes.
			 * @return {Object}
			 */
			filterTemplateAtts: function( atts ) {
				var wrapperAttributes      = {},
					counterAttributes      = {},
					countdownShortcodeLink = {},
					headingAttr            = {},
					subHeadingAttr         = {},
					dashhtml               = '',
					headingText            = '',
					subheadingText         = '',
					linkUrl                = '',
					linkText               = '',
					elementContent         = '';

				// Validate values.
				this.validateValues( atts.values );
				this.values = atts.values;

				// Create attribute objects
				wrapperAttributes      = this.buildWrapperAtts( atts.values );
				counterAttributes      = this.buildCounterAtts( atts.values, atts.extras );
				countdownShortcodeLink = this.buildLinkAtts( atts.values, atts.extras );
				dashhtml               = this.buildDashHtml( atts.values, atts.extras );
				headingAttr            = this.buildHeadingAttr( atts.values );
				subHeadingAttr         = this.buildSubHeadingAttr( atts.values );
				headingText            = atts.values.heading_text;
				subheadingText         = atts.values.subheading_text;
				linkUrl                = atts.values.link_url;
				linkText               = atts.values.link_text;
				elementContent         = atts.values.element_content;

				// Reset atts.
				atts = {};

				// Build attributes.
				atts.wrapperAttributes      = wrapperAttributes;
				atts.counterAttributes      = counterAttributes;
				atts.countdownShortcodeLink = countdownShortcodeLink;
				atts.dashhtml               = dashhtml;
				atts.headingAttr            = headingAttr;
				atts.subHeadingAttr         = subHeadingAttr;
				atts.heading_text           = headingText;
				atts.subheading_text        = subheadingText;
				atts.link_url               = linkUrl;
				atts.link_text              = linkText;
				atts.element_content        = elementContent;

				// Any extras that need passed on.
				atts.cid = this.model.get( 'cid' );

				return atts;
			},

			/**
			 * Modify the values.
			 *
			 * @since 2.0
			 * @param {Object} values - The values.
			 * @return {void}
			 */
			validateValues: function( values ) {
				values.border_radius         = _.fusionValidateAttrValue( values.border_radius, 'px' );
				values.counter_border_size   = _.fusionValidateAttrValue( values.counter_border_size, 'px' );
				values.counter_border_radius = _.fusionValidateAttrValue( values.counter_border_radius, 'px' );

				if ( 'default' === values.link_target ) {
					values.link_target = fusionAllElements.fusion_countdown.link_target;
				}
			},

			/**
			 * Builds attributes.
			 *
			 * @since 2.0
			 * @param {Object} values - The values.
			 * @return {Object}
			 */
			buildWrapperAtts: function( values ) {
				var wrapperAttributes = {
					class: 'countdown-shortcode fusion-countdown fusion-countdown-cid' + this.model.get( 'cid' ) + ' fusion-countdown-' + values.layout + ' fusion-countdown-label-' + values.label_position,
					style: this.getStyles()
				},
				bgColor;

				if ( values.heading_text || values.subheading_text ) {
					wrapperAttributes[ 'class' ] += ' fusion-countdown-has-heading';
				}

				if ( values.link_text ) {
					wrapperAttributes[ 'class' ] += ' fusion-countdown-has-link';
				}

				wrapperAttributes = _.fusionVisibilityAtts( values.hide_on_mobile, wrapperAttributes );

				bgColor = jQuery.AWB_Color( values.background_color );
				if ( ! values.background_image && ( ! values.background_color || 0 === bgColor.alpha() || 'transparent' === values.background_color ) ) {
					wrapperAttributes[ 'class' ] += ' fusion-no-bg';
				}

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
			 * Builds attributes.
			 *
			 * @since 2.0
			 * @param {Object} values - The values.
			 * @param {Object} extras - Extra params.
			 * @return {Object}
			 */
			buildCounterAtts: function( values, extras ) {
				var counterAttributes = {
						class: 'fusion-countdown-counter-wrapper countdown-shortcode-counter-wrapper',
						id: 'fusion-countdown-cid' + this.model.get( 'cid' )
					},
					s,
					date,
					month;

				if ( ! values.subheading_text && ! values.heading_text && ! values.link_url ) {
					counterAttributes[ 'class' ] += ' awb-flex-grow';
				}

				if ( 'site_time' === values.timezone ) {
					counterAttributes[ 'data-gmt-offset' ] = extras.gmt_offset;
				}
				function pad( num, size ) {
					s = '000000000' + num;
					return s.substr( s.length - size );
				}
				if ( 'object' === typeof values.countdown_end && 'string' === typeof values.countdown_end.date ) {
					values.countdown_end = values.countdown_end.date;
				}
				if ( values.countdown_end ) {
					date  = new Date( values.countdown_end );
					month = pad( date.getMonth() + 1, 2 );
					counterAttributes[ 'data-timer' ] = date.getFullYear() + '-' + month + '-' + date.getDate() + '-' + date.getHours() + '-' + date.getMinutes() + '-' + date.getSeconds();
				}

				counterAttributes[ 'data-omit-weeks' ] = ( 'yes' === values.show_weeks ) ? '0' : '1';

				return counterAttributes;
			},

			/**
			 * Builds attributes.
			 *
			 * @since 2.0
			 * @param {Object} values - The values.
			 * @return {Object}
			 */
			buildLinkAtts: function( values ) {
				var countdownShortcodeLink = {
					class: 'fusion-countdown-link',
					target: values.link_target,
					href: values.link_url
				};

				if ( '_blank' === values.link_target ) {
					countdownShortcodeLink.rel = 'noopener noreferrer';
				}

				return countdownShortcodeLink;
			},

			/**
			 * Builds the HTML.
			 *
			 * @since 2.0
			 * @param {Object} values - The values.
			 * @param {Object} extras - Extra args.
			 * @return {string}
			 */
			buildDashHtml: function( values, extras ) {
				var dashClass = '',
					dashhtml  = '',
					counterBoxColor,
					dashes    = [
						{
							show: values.show_weeks,
							class: 'weeks',
							shortname: extras.weeks_text,
							longname: extras.weeks_text
						},
						{
							show: 'yes',
							class: 'days',
							shortname: extras.days_text,
							longname: extras.days_text
						},
						{
							show: 'yes',
							class: 'hours',
							shortname: extras.hrs_text,
							longname: extras.hours_text
						},
						{
							show: 'yes',
							class: 'minutes',
							shortname: extras.min_text,
							longname: extras.minutes_text
						},
						{
							show: 'yes',
							class: 'seconds',
							shortname: extras.sec_text,
							longname: extras.seconds_text
						}
					];

				if ( 'text_flow' !== values.label_position ) {
					values.dash_titles = 'long';
				}

				counterBoxColor = jQuery.AWB_Color( values.counter_box_color );
				if ( ! values.counter_box_color || 0 === counterBoxColor.alpha() || 'transparent' === values.counter_box_color ) {
					dashClass = ' fusion-no-bg';
				}

				jQuery.each( dashes, function( index, dash ) {
					if ( 'yes' === dash.show ) {
						dashhtml += '<div class="fusion-dash-wrapper ' + dashClass + '">';
						dashhtml += '<div class="fusion-dash fusion-dash-' + dash[ 'class' ] + '">';
						dashhtml += '<div class="fusion-digit-wrapper">';
						if ( 'days' === dash[ 'class' ] ) {
							dashhtml += '<div class="fusion-thousand-digit fusion-digit">0</div>';
						}
						if ( 'weeks' === dash[ 'class' ] || 'days' === dash[ 'class' ] ) {
							dashhtml += '<div class="fusion-hundred-digit fusion-digit">0</div>';
						}
						dashhtml += '<div class="fusion-digit">0</div><div class="fusion-digit">0</div>';
						dashhtml += '</div>';
						dashhtml += '<div class="fusion-dash-title">' + dash[ values.dash_titles + 'name' ] + '</div>';
						dashhtml += '</div></div>';
					}
				} );

				return dashhtml;
			},

			/**
			 * Builds styles.
			 *
			 * @since 2.0
			 * @return {string}
			 */
			getStyles: function() {
				var customVars = {},
					cssVars    = [
						'border_radius',
						'counter_box_color',
						'counter_border_color',
						'counter_border_radius',
						'counter_font_size',
						'counter_text_color',
						'label_font_size',
						'label_color',
						'heading_font_size',
						'heading_text_color',
						'subheading_font_size',
						'subheading_text_color',
						'link_text_color',
						'element_margin_top',
						'element_margin_right',
						'element_margin_bottom',
						'element_margin_left'
					];

				cssVars.counter_padding_top     = { 'callback': _.fusionGetValueWithUnit };
				cssVars.counter_padding_right   = { 'callback': _.fusionGetValueWithUnit };
				cssVars.counter_padding_bottom  = { 'callback': _.fusionGetValueWithUnit };
				cssVars.counter_padding_left    = { 'callback': _.fusionGetValueWithUnit };

				if ( '' !== this.values.background_image && ! this.isDefault( 'background_image' ) ) {
					customVars.background = 'url(' + this.values.background_image + ') ' + this.values.background_position + ' ' + this.values.background_repeat + ' ' + this.values.background_color;
					if ( 'no-repeat' === this.values.background_repeat ) {
						customVars[ 'background-size' ] = 'cover';
					}
				} else if ( '' !== this.values.background_color && ! this.isDefault( 'background_color' ) ) {
					customVars.background = this.values.background_color;
				}
				if ( '' !== this.values.counter_box_spacing ) {
					customVars[ 'counter-box-spacing' ] = ( parseFloat( this.values.counter_box_spacing ) / 2 ) + this.values.counter_box_spacing.replace( parseFloat( this.values.counter_box_spacing ), '' );
				}

				if ( '' !== this.values.counter_border_size ) {
					customVars[ 'counter-border-size' ] = parseFloat( this.values.counter_border_size );
				}

				return this.getCssVarsForOptions( cssVars ) + this.getCustomCssVars( customVars );
			},

			/**
			 * Builds attributes.
			 *
			 * @since 2.0
			 * @return {Object}
			 */
			buildHeadingAttr: function() {
				var self = this;

				return _.fusionInlineEditor( {
					cid: self.model.get( 'cid' ),
					param: 'heading_text',
					'disable-return': true,
					'disable-extra-spaces': true,
					toolbar: false
				}, { class: 'fusion-countdown-heading' } );
			},

			/**
			 * Builds attributes.
			 *
			 * @since 2.0
			 * @return {Object}
			 */
			buildSubHeadingAttr: function() {
				var self = this;

				return _.fusionInlineEditor( {
					cid: self.model.get( 'cid' ),
					param: 'subheading_text',
					'disable-return': true,
					'disable-extra-spaces': true,
					toolbar: false
				}, { class: 'fusion-countdown-subheading' } );
			},

			/**
			 * Updates now deprecated params and adds BC checks.
			 *
			 * @since 2.2
			 * @return {void}
			 */
			deprecatedParams: function() {
				var params = this.model.get( 'params' );

				// Correct old combined border radius setting.
				if ( 'undefined' === typeof params.counter_border_radius && 'string' === typeof params.border_radius ) {
					params.counter_border_radius = params.border_radius;
				}

				// Correct the label text color.
				if ( 'undefined' === typeof params.label_color && 'string' === typeof params.counter_text_color ) {
					params.label_color = params.counter_text_color;
				}

				this.model.set( 'params', params );
			}
		} );
	} );
}( jQuery ) );
