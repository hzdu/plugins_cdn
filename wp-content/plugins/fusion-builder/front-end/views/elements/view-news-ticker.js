var FusionPageBuilder = FusionPageBuilder || {};

( function() {

	jQuery( document ).ready( function() {

		FusionPageBuilder.fusion_news_ticker = FusionPageBuilder.ElementView.extend( {

			/**
			 * Modify template attributes.
			 *
			 * @since 3.5
			 * @param {Object} atts - The attributes.
			 * @return {Object}
			 */
			filterTemplateAtts: function( atts ) {
				var attributes  = {};

				this.animationDuration = this.$el.find( '.awb-news-ticker-item-list' ).css( 'animation-duration' );
				this.values = atts.values;

				attributes.tickerTitle     = atts.values.ticker_title;
				attributes.tickerSpeed     = atts.values.ticker_speed;
				attributes.tickerAttr      = this.buildTickerAttr( atts.values, atts.extras );
				attributes.titleAttr       = this.buildTickerTitleAttr( atts.values );
				attributes.barAttr         = this.buildTickerBarAttr( atts.values );
				attributes.itemsListAttr   = this.buildTickerItemsListAttr( atts.values );
				attributes.titleShape      = atts.values.title_shape;
				attributes.tickerItems     = atts.query_data;
				attributes.carouselButtons = this.getCarouselButtonsIfNecessary( atts.values );

				return attributes;
			},

			/**
			 * Build the ticker element attributes.
			 *
			 * @since 3.5
			 * @param {Object} values
			 * @param {Object} extras
			 * @return {Object}
			 */
			buildTickerAttr: function( values, extras ) {
				var attr = {
					'class': 'awb-news-ticker awb-news-ticker-' + this.model.get( 'cid' ),
					'role': 'marquee',
					'style': this.getInlineStyle( values, extras )
				};

				if ( 'marquee' === values.ticker_type ) {
					attr[ 'class' ] += ' awb-news-ticker-marquee';
				} else if ( 'carousel' === values.ticker_type ) {
					attr[ 'class' ] += ' awb-news-ticker-carousel';
				}

				attr = _.fusionVisibilityAtts( values.hide_on_mobile, attr );

				if ( values[ 'class' ] ) {
					attr[ 'class' ] += ' ' + values[ 'class' ];
				}

				if ( values.id ) {
					attr.id = values.id;
				}

				attr = _.fusionAnimations( values, attr );

				return attr;
			},

			/**
			 * Build the ticker title attributes.
			 *
			 * @since 3.5
			 * @param {Object} values
			 * @return {Object}
			 */
			buildTickerTitleAttr: function( values ) {
				var attr = {
					'class': 'awb-news-ticker-title'
				};

				if ( 'rounded' === values.title_shape ) {
					attr[ 'class' ] += ' awb-news-ticker-title-rounded';
				}

				return attr;
			},

			/**
			 * Build the ticker bar attributes.
			 *
			 * @since 3.5
			 * @param {Object} values
			 * @return {Object}
			 */
			buildTickerBarAttr: function( values ) {
				var attr = {
					'class': 'awb-news-ticker-bar'
				};

				if ( 'marquee' === values.ticker_type ) {
					attr[ 'class' ] += ' awb-news-ticker-bar-marquee';
				} else if ( 'carousel' === values.ticker_type ) {
					attr[ 'class' ] += ' awb-news-ticker-bar-carousel';
				}

				return attr;
			},

			/**
			 * Build the items list wrapper attributes.
			 *
			 * @since 3.5
			 * @param {object} values
			 * @return {object}
			 */
			buildTickerItemsListAttr: function( values ) {
				var attr = {
						'class': 'awb-news-ticker-item-list'
					};

				if ( 'marquee' === values.ticker_type ) {
					attr[ 'class' ]                += ' awb-news-ticker-item-list-run';
					attr[ 'data-awb-ticker-speed' ] = values.ticker_speed;
				} else if ( 'carousel' === values.ticker_type ) {
					attr[ 'class' ] += ' awb-news-ticker-item-list-carousel';
					attr[ 'data-awb-news-ticker-display-time' ] = values.carousel_display_time;
				}

				return attr;
			},

			/**
			 * Get inline style.
			 *
			 * @since 3.5
			 * @param {object} values
			 * @param {object} extras
			 * @return string
			 */
			getInlineStyle: function( values, extras ) {
				var cssVarsOptions,
					boxShadow,
					customVars = [];
				this.values = values;

				cssVarsOptions = [
					'font_size',
					'letter_spacing',
					'text_transform',
					'ticker_height',
					'title_font_color',
					'title_background_color',
					'ticker_font_color',
					'ticker_hover_font_color',
					'ticker_background_color',
					'ticker_background_hover_color',
					'ticker_indicators_color',
					'ticker_indicators_hover_color',
					'title_padding_right',
					'title_padding_left',
					'carousel_btn_border_radius',
					'btn_padding_top',
					'btn_padding_right',
					'btn_padding_bottom',
					'btn_padding_left',
					'ticker_padding_right',
					'ticker_padding_left',
					'margin_top',
					'margin_right',
					'margin_bottom',
					'margin_left',
					'border_radius_top_left',
					'border_radius_top_right',
					'border_radius_bottom_right',
					'border_radius_bottom_left'
				];

				if ( values.line_height ) {
					cssVarsOptions.push( 'line_height' );
				}

				customVars = [];

				jQuery.each( _.fusionGetFontStyle( 'ticker_font', values, 'object' ), function( rule, value ) {
					customVars[ rule ] = value;
                } );

				if ( ! this.isDefault( 'carousel_bar_height' ) ) {
					customVars.carousel_bar_height = values.carousel_bar_height + 'px';
				}
				// Increase padding a little on triangle shape.
				if ( 'carousel' === values.ticker_type && 'triangle' === values.title_shape ) {
					if ( ! extras.is_rtl && this.isDefault( 'ticker_padding_left' ) ) {
						customVars.ticker_padding_left = '17px';
					} else if ( this.isDefault( 'ticker_padding_right' ) ) {
						customVars.ticker_padding_right = '17px';
					}
				}
				if ( ! this.isDefault( 'carousel_display_time' ) ) {
					customVars.carousel_display_time = values.carousel_display_time + 's';
				}

				if ( values.posts_distance && 'marquee' === values.ticker_type ) {
					customVars.posts_distance = ( values.posts_distance / 2 ).toFixed( 1 ) + 'px';
				}

				boxShadow = _.awbGetBoxShadowCssVar( '--awb-box-shadow', values );

				return this.getCssVarsForOptions( cssVarsOptions ) + this.getCustomCssVars( customVars ) + boxShadow;
			},

			/**
			 * Get the carousel buttons HTML if necessary.
			 *
			 * @since 3.5
			 * @param {object} values
			 * @return string
			 */
			getCarouselButtonsIfNecessary: function( values ) {
				var html = '',
					additionalBtnClasses;

				if ( 'carousel' === values.ticker_type ) {
					additionalBtnClasses = '';
					if ( 'border' === values.carousel_arrows_style ) {
						additionalBtnClasses = ' awb-news-ticker-btn-border';
					}

					html += '<div class="awb-news-ticker-items-buttons">';
					html += '<div class="awb-news-ticker-btn-wrapper"><button class="awb-news-ticker-prev-btn' + additionalBtnClasses + '"><span class="awb-news-ticker-btn-arrow">&#xf104;</span></button></div>';
					html += '<div class="awb-news-ticker-btn-wrapper"><button class="awb-news-ticker-next-btn' + additionalBtnClasses + '"><span class="awb-news-ticker-btn-arrow">&#xf105;</span></button></div>';
					html += '</div>';

					html += '<div class="awb-news-ticker-carousel-indicator"></div>';
				}

				return html;
			},

			/**
			 * Init.
			 *
			 * @since 3.5
			 * @return {void}
			 */
			onInit: function() {
				// Also refresh on init, since the onPageLoad event don't trigger sometimes.
				var previewBody = jQuery( '#fb-preview' )[ 0 ].contentWindow.jQuery( 'body' );
				previewBody.trigger( 'fusion-element-render-fusion_news_ticker', this.model.attributes.cid );
			},

			/**
			 * Runs after view DOM is patched.
			 *
			 * @since 3.5
			 * @return {void}
			 */
			afterPatch: function() {
				var previewBody = jQuery( '#fb-preview' )[ 0 ].contentWindow.jQuery( 'body' );
				previewBody.trigger( 'fusion-element-render-fusion_news_ticker', this.model.attributes.cid );
			}

		} );
	} );
}( jQuery ) );
