/* global FusionPageBuilderApp, fusionAllElements */
var FusionPageBuilder = FusionPageBuilder || {};

( function() {

    jQuery( document ).ready( function() {

        FusionPageBuilder.FormNavView = FusionPageBuilder.BaseView.extend( {
            template: FusionPageBuilder.template( jQuery( '#front-end-form-nav-template' ).html() ),

            initialize: function() {
                this.listenTo( this.model, 'change:update', _.debounce( this.render.bind( this ), 20 ) );

                this.observer = new MutationObserver( this.render.bind( this ) );
            },

            render: function() {
                const attributes = this.model.attributes;
                this.formOptions = this.model.attributes.formOptions;
                attributes.wrapperAttr = this.getWrapperAttr();

                const isAbove = ( 'above' === this.formOptions.step_type );
                const aboveWrapper  = jQuery( '#fb-preview' ).contents().find( '.awb-above-form' );
                const belowWrapper  = jQuery( '#fb-preview' ).contents().find( '.awb-below-form' );

                if ( isAbove ) {
                    this.setElement( aboveWrapper );
                    if ( belowWrapper.html().trim() ) {
                        belowWrapper.html( '' );
                        this.observer.disconnect();
                    }

                    this.observer.observe( aboveWrapper[ 0 ], { attributes: true, childList: false, subtree: false } );
                } else {
                    this.setElement( belowWrapper );
                    if ( aboveWrapper.html().trim() ) {
                        aboveWrapper.html( '' );
                        this.observer.disconnect();
                    }

                    this.observer.observe( aboveWrapper[ 0 ], { attributes: true, childList: false, subtree: false } );
                }

                attributes.activeStep = 1;
                if ( this.$el.hasClass( 'awb-above-form-preview' ) ) {
                    attributes.activeStep  = parseInt( attributes.stepViews.length / 2 ) + 1;
                }

                let markup = '';
                if ( 'timeline' === this.formOptions.steps_nav ) {
                    markup = this.template( attributes );
                } else if ( 'progress_bar' === this.formOptions.steps_nav ) {
                    attributes.progressBarHTML = FusionPageBuilderApp.renderElement( 'fusion_progress', attributes.progressBarAttr, '', this.model.get( 'cid' ) );
                    markup = this.template( attributes );
                } else if ( 'none' === this.formOptions.steps_nav ) {
                    markup = '';
                }

                this.$el.html( markup );

                return this;
            },

            getWrapperAttr: function() {
                var attr = {
                    'class': 'awb-form-nav',
                    'data-steps': '',
                    'style': ''
                };

                if ( 'timeline' === this.formOptions.steps_nav ) {
                    attr[ 'class' ] += ' awb-form-nav--timeline';
                    attr.style += this.getTimelineCssVars();
                } else if ( 'progress_bar' === this.formOptions.steps_nav ) {
                    attr[ 'class' ] += ' awb-form-nav--progress';
                    attr.style += this.getProgressBarCssVars();
                }

                if ( 'above' === this.formOptions.step_type ) {
                    attr[ 'class' ] += ' awb-form-nav--above';
                } else if ( 'below' === this.formOptions.step_type ) {
                    attr[ 'class' ] += ' awb-form-nav--below';
                }

                return attr;
            },

            getTimelineCssVars: function() {
                var cssVarsOptions = [
                    'steps_bg_color',
                    'steps_bg_color_active',
                    'steps_bg_color_completed',

                    'steps_bor_type',
                    'steps_bor_color',
                    'steps_bor_color_active',
                    'steps_bor_color_completed',

                    'steps_sep_type',
                    'steps_sep_type_completed',
                    'steps_sep_color',
                    'steps_sep_color_completed',

                    'step_icon_color',
                    'step_icon_color_active',
                    'step_icon_color_completed',

                    'step_typo-line-height',
                    'step_typo-text-transform',

                    'steps_title_color',
                    'steps_title_color_active',
                    'steps_title_color_completed'

                ],
                    customVars     = [];

                this.values = this.formOptions;

                cssVarsOptions.steps_margin_top               = { 'callback': _.fusionGetValueWithUnit };
                cssVarsOptions.steps_margin_right             = { 'callback': _.fusionGetValueWithUnit };
                cssVarsOptions.steps_margin_bottom            = { 'callback': _.fusionGetValueWithUnit };
                cssVarsOptions.steps_margin_left              = { 'callback': _.fusionGetValueWithUnit };

                cssVarsOptions.step_padding_top = { 'callback': _.fusionGetValueWithUnit };
                cssVarsOptions.step_padding_right = { 'callback': _.fusionGetValueWithUnit };
                cssVarsOptions.step_padding_bottom = { 'callback': _.fusionGetValueWithUnit };
                cssVarsOptions.step_padding_left = { 'callback': _.fusionGetValueWithUnit };

                cssVarsOptions.steps_bor_top_left = { 'callback': _.fusionGetValueWithUnit };
                cssVarsOptions.steps_bor_top_right = { 'callback': _.fusionGetValueWithUnit };
                cssVarsOptions.steps_bor_bottom_right = { 'callback': _.fusionGetValueWithUnit };
                cssVarsOptions.steps_bor_bottom_left = { 'callback': _.fusionGetValueWithUnit };

                cssVarsOptions.steps_bor_width = { 'callback': _.fusionGetValueWithUnit };

                cssVarsOptions.steps_sep_width = { 'callback': _.fusionGetValueWithUnit };
                cssVarsOptions.step_sep_margin_left = { 'callback': _.fusionGetValueWithUnit };
                cssVarsOptions.step_sep_margin_right = { 'callback': _.fusionGetValueWithUnit };

                cssVarsOptions.step_icon_size = { 'callback': _.fusionGetValueWithUnit };
                cssVarsOptions.step_icon_title_gap = { 'callback': _.fusionGetValueWithUnit };

                cssVarsOptions[ 'step_typo-font-size' ] = { 'callback': _.fusionGetValueWithUnit };
                cssVarsOptions[ 'step_typo-letter-spacing' ] = { 'callback': _.fusionGetValueWithUnit };

                if ( 'yes' === this.values.step_icon_bg ) {
                    cssVarsOptions.push( 'step_icon_bg_color' );
                    cssVarsOptions.push( 'step_icon_bg_color_active' );
                    cssVarsOptions.push( 'step_icon_bg_color_completed' );

                    cssVarsOptions.step_icon_padding = { 'callback': _.fusionGetValueWithUnit };

                    cssVarsOptions.step_icon_bor_top_left = { 'callback': _.fusionGetValueWithUnit };
                    cssVarsOptions.step_icon_bor_top_right = { 'callback': _.fusionGetValueWithUnit };
                    cssVarsOptions.step_icon_bor_bottom_right = { 'callback': _.fusionGetValueWithUnit };
                    cssVarsOptions.step_icon_bor_bottom_left = { 'callback': _.fusionGetValueWithUnit };

                    cssVarsOptions.push( 'step_icon_bor_type' );

                    cssVarsOptions.step_icon_bor_width = { 'callback': _.fusionGetValueWithUnit };
                    cssVarsOptions.push( 'step_icon_bor_color' );
                    cssVarsOptions.push( 'step_icon_bor_color_active' );
                    cssVarsOptions.push( 'step_icon_bor_color_completed' );
				}


                if ( [ 'around', 'left', 'right' ].includes( this.formOptions.steps_spacing ) ) { // Needed because if this setting is changed to between, then it would also take previous set value and change aspect.
                    cssVarsOptions.push( 'between_steps_size' );
                }

                if ( 'none' !== this.formOptions.steps_number_icon && 'no' !== this.formOptions.steps_title ) {
                    if ( 'before' === this.formOptions.steps_title_position || 'above' === this.formOptions.steps_title_position ) {
                        customVars[ 'step-icon-order' ] = '1';
                    }

                    if ( 'below' === this.formOptions.steps_title_position || 'above' === this.formOptions.steps_title_position ) {
                        customVars[ 'step-flex-flow' ] = 'column';
                    }
                }

                // Need to add special key to make fonts work.
                this.values.fusion_font_family_step_typo  = this.values[ 'step_typo-font-family' ];
                this.values.fusion_font_variant_step_typo = this.values[ 'step_typo-variant' ];

                return this.getCssVarsForOptions( cssVarsOptions ) + this.getCustomCssVars( customVars ) + this.getFontStylingVars( 'step_typo', this.values );

            },

            getProgressBarCssVars: function() {
                var cssVarsOptions = [],
                    customVars     = [];

                this.values = this.formOptions;

                cssVarsOptions.steps_margin_top    = { 'callback': _.fusionGetValueWithUnit };
                cssVarsOptions.steps_margin_right  = { 'callback': _.fusionGetValueWithUnit };
                cssVarsOptions.steps_margin_bottom = { 'callback': _.fusionGetValueWithUnit };
                cssVarsOptions.steps_margin_left   = { 'callback': _.fusionGetValueWithUnit };

                return this.getCssVarsForOptions( cssVarsOptions ) + this.getCustomCssVars( customVars );
            },

            isDefault: function( param ) {
				return this.values[ param ] === fusionAllElements.fusion_form.defaults[ param ];
			}

        } );

    } );
}( jQuery ) );
