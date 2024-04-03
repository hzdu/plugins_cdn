/* global FusionEvents, fusionBuilderText */
var FusionPageBuilder = FusionPageBuilder || {};

( function() {
    jQuery( document ).ready( function() {
        var refreshTocElementsEventsAdded = false;

        FusionPageBuilder.fusion_table_of_contents = FusionPageBuilder.ElementView.extend( {

			/**
			 * Modify template attributes.
			 *
			 * @since 3.9
			 * @param {Object} atts - The attributes.
			 * @return {Object}
			 */
			filterTemplateAtts: function( atts ) {
				var attributes  = {};

				this.values = atts.values;

                attributes.tocAttr  = this.buildTOCAttr( atts.values );

				return attributes;
			},

            onRender: function() {
                var iframeWindow  = jQuery( '#fb-preview' )[ 0 ].contentWindow;
                iframeWindow.jQuery( iframeWindow.document ).ready( this.afterPatch.bind( this ) );

                if ( ! refreshTocElementsEventsAdded ) {
                    this.listenTo( FusionEvents, 'fusion-columns-added', this.refreshAllTocElements.bind( this ) );
                    this.listenTo( FusionEvents, 'fusion-content-changed', this.refreshAllTocElements.bind( this ) );
                    this.listenTo( FusionEvents, 'fusion-element-removed', this.refreshAllTocElements.bind( this ) );
                    this.listenTo( FusionEvents, 'fusion-column-resized', this.refreshAllTocElements.bind( this ) );
                    refreshTocElementsEventsAdded = true;
                }

			},

            buildTOCAttr: function( values ) {
                var attr = {
					'class': 'awb-toc-el awb-toc-el--cid' + this.model.get( 'cid' ),
                    'data-awb-toc-options': this.escapeHtml( this.getTocOptionsAttribute( values ) ),
                    'style': this.getInlineStyle( values )
				};

				attr = _.fusionVisibilityAtts( values.hide_on_mobile, attr );


				if ( 'li_default' === values.counter_type ) {
					attr[ 'class' ] += ' awb-toc-el--default-list-type';
				}

				if ( values[ 'class' ] ) {
					attr[ 'class' ] += ' ' + values[ 'class' ];
				}

				if ( values.id ) {
					attr.id = values.id;
				}

				attr = _.fusionAnimations( values, attr );

				return attr;
            },

            getTocOptionsAttribute: function( values ) {
				var options          = {},
                allowed_heading_tags = this.getAllowedHeadingsObject( values );

				options.allowed_heading_tags      = allowed_heading_tags;
				options.ignore_headings           = values.ignore_headings_by_classes;
                options.ignore_headings_words     = values.ignore_headings_by_words;
                options.highlight_current_heading = values.highlight_current_heading;
                options.hide_hidden_titles        = values.hide_hidden_titles;
                options.limit_container           = values.limit_container;
				options.select_custom_headings    = values.select_custom_headings;
                options.icon                      = _.fusionFontAwesome( values.icon );
                options.counter_type              = values.counter_type;

				return JSON.stringify( options );
            },

            getAllowedHeadingsObject: function( values ) {
                var object = {},
                    startIndex = 0,
                    tags = [ 'h1', 'h2', 'h3', 'h4', 'h5', 'h6' ],
                    i,
                    allowedTags;

                    allowedTags = values.allowed_heading_tags.split( ',' );

                for ( i = 0; i < tags.length; i++ ) {
                    if ( allowedTags.includes( tags[ i ] ) ) {
                        object[ tags[ i ] ] = startIndex;
                        startIndex++;
                    }
                }

                return object;
            },

            getInlineStyle: function( values ) {
                var customVars   = [],
                    counterSeparator,
                    cssVarsOptions;

                this.values = values;

                jQuery.each( _.fusionGetFontStyle( 'item_font', values, 'object' ), function( rule, value ) {
                    customVars[ 'item-' + rule ] = value;
                } );

				if ( ! this.isDefault( 'counter_type' ) && 'li_default' !== values.counter_type && 'custom_icon' !== values.counter_type ) {
					counterSeparator = '';
					if ( 'dot' === values.counter_separator ) {
						counterSeparator = '.';
					} else if ( 'comma' === values.counter_separator ) {
						counterSeparator = ',';
					} else if ( 'custom' === values.counter_separator ) {
						counterSeparator = _.unescape( values.custom_counter_separator ).replace( /"/g, '\\"' );
					}

					customVars.counter_type = 'counters(awb-toc, "' + counterSeparator + '", ' + values.counter_type + ') "' + counterSeparator + ' "';
                    customVars.counter_type = customVars.counter_type.replace( /"/g, '&quot;' ); // escape double quotes.
				}

				cssVarsOptions = [
                    'margin_top',
					'margin_right',
					'margin_bottom',
					'margin_left',
					'padding_top',
					'padding_right',
					'padding_bottom',
					'padding_left',
                    'item_font_size',
                    'item_line_height',
                    'item_letter_spacing',
                    'item_text_transform',
                    'item_color',
                    'item_color_hover',
                    'item_bg_color_hover',
                    'counter_color',
                    'hover_counter_color',
                    'list_indent',
                    'item_highlighted_bg_color',
                    'item_hover_highlighted_bg_color',
                    'item_highlighted_color',
                    'item_hover_highlighted_color',
                    'highlighted_counter_color',
                    'highlighted_hover_counter_color',
                    'item_padding_top',
					'item_padding_right',
					'item_padding_bottom',
					'item_padding_left',
                    'item_radius_top_left',
					'item_radius_top_right',
					'item_radius_bottom_right',
					'item_radius_bottom_left',
                    'item_margin_top',
					'item_margin_bottom'
                ];

                if ( 'yes' === values.item_text_overflow ) {
					customVars[ 'item-overflow' ] = 'hidden';
					customVars[ 'item-white-space' ]   = 'nowrap';
					customVars[ 'item-text-overflow' ] = 'ellipsis';
				}

				return this.getCssVarsForOptions( cssVarsOptions ) + this.getCustomCssVars( customVars );
            },

			/**
			 * Runs after view DOM is patched.
			 *
			 * @since 3.9
			 * @return {void}
			 */
            afterPatch: function() {
                this.indexTocElements();
                this.refreshAllTocElements();
			},

            refreshAllTocElements: function() {
                var iframeWindow = jQuery( '#fb-preview' )[ 0 ].contentWindow;

                if ( ! iframeWindow.awbTOCDummyContent1 ) {
                    this.setLiveEmptyElementDummyContent();
                }

                iframeWindow.awbTableOfContentsRefreshAllElements();
            },

            /**
             * Index TOC elements. This will create the same attribute as added in PHP version.
             *
             * @since 3.9
             * @return {void}
             */
            indexTocElements: function() {
                var elements = jQuery( '#fb-preview' )[ 0 ].contentWindow.jQuery( '.awb-toc-el' ),
                    index = 1;

                elements.each( function() {
                    jQuery( this ).attr( 'data-awb-toc-id', index );
                    index++;
                } );
            },

            escapeHtml: function ( str ) {
                return str.replace( /&/g, '&amp;' ).replace( /</g, '&lt;' ).replace( />/g, '&gt;' ).replace( /"/g, '&quot;' ).replace( /'/g, '&#039;' );
            },

            setLiveEmptyElementDummyContent: function() {
                var titles = getDummyTitles();
                jQuery( '#fb-preview' )[ 0 ].contentWindow.awbTOCDummyContent1 = JSON.parse( JSON.stringify( titles ) );

                titles[ 0 ].children = getDummyTitles();
                titles[ 1 ].children = getDummyTitles();
                jQuery( '#fb-preview' )[ 0 ].contentWindow.awbTOCDummyContent2 = JSON.parse( JSON.stringify( titles ) );

                titles[ 0 ].children[ 0 ].children = getDummyTitles();
                titles[ 0 ].children[ 1 ].children = getDummyTitles();
                jQuery( '#fb-preview' )[ 0 ].contentWindow.awbTOCDummyContent3 = JSON.parse( JSON.stringify( titles ) );

                function getDummyTitles() {
                    return [
                        {
                            id: 'dummy',
                            title: fusionBuilderText.toc_element_title_placeholder,
                            children: []
                        },
                        {
                            id: 'dummy',
                            title: fusionBuilderText.toc_element_title_placeholder,
                            children: []
                        }
                    ];
                }
            }

        } );
    } );
}( jQuery ) );
