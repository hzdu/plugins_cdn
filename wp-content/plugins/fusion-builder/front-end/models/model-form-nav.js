/* global FusionPageBuilderViewManager, fusionAllElements, FusionApp */
var FusionPageBuilder = FusionPageBuilder || {};

( function() {

    jQuery( document ).ready( function() {

        FusionPageBuilder.FormNav = Backbone.Model.extend( {

            initialize: function() {
                this.update = _.debounce( this.update.bind( this ), 20 );
                this.listenTo( window.FusionEvents, 'fusion-rerender-form-steps', this.update );
            },

            /**
             * Update all the attributes. This will also trigger render if necessary.
             */
            update: function() {
                if ( ! jQuery( '#fb-preview' ).contents().find( '.awb-above-form' ).length ) { // return without executing anything if this is not in forms view.
                    return;
                }

                this.formOptions = this.getFormOptions();
                this.steps       = this.getStepInfo();
                this.set( 'formOptions', this.formOptions );
                this.set( 'stepViews', this.steps );
                this.set( 'progressBarAttr', this.getProgressBarAttr() );
                this.trigger( 'change:update' ); // since we use an array with objects, it won't trigger change on change, so trigger manually.
            },

            getStepInfo: function() {
                var formStepsElements,
                    formStepsViewsOrdered = [],
                    elementViews,
                    i;

                elementViews = FusionPageBuilderViewManager.getViews();

                // Gather the form steps in their order.
                formStepsElements = jQuery( '#fb-preview' ).contents().find( '#fusion_builder_container > .fusion-builder-form-step' );

                for ( i = 0; i < formStepsElements.length; i++ ) {
                    if ( 0 === i && 0 !== formStepsElements.eq( i ).prev().length ) {
                        formStepsViewsOrdered.push( {} ); // empty object if the first step doesn't exist.
                    }

                    // todo, make sure that view exist.
                    formStepsViewsOrdered.push( elementViews[ formStepsElements.eq( i ).data( 'cid' ) ] );
                }

                return formStepsViewsOrdered;
            },

            getFormOptions: function() {
                var stepSettings = JSON.parse( JSON.stringify( FusionApp.data.postMeta._fusion ) ),
                    setting,
                    stepParams = {},
                    defaults = fusionAllElements.fusion_form.defaults,
                    objKey;

                // flatten meta array values.
                for ( setting in stepSettings ) {
                    if ( 'object' === ( typeof stepSettings[ setting ] ) ) {
                        for ( objKey in stepSettings[ setting ] ) {
                            if ( 'step_typo' === setting || 'step_pb_typo' === setting ) {
                                stepSettings[ setting + '-' + objKey ] = stepSettings[ setting ][ objKey ];
                            } else {
                                stepSettings[ objKey ] = stepSettings[ setting ][ objKey ];
                            }
                        }
                    }
                }

                // Filter step options from form options.
                for ( setting in defaults ) {
                    if ( ! setting.includes( 'step' ) && ! setting.includes( 'icon' ) ) {
                        continue; // eslint-disable-line no-continue
                    }

                    if ( stepSettings[ setting ] ) {
                        stepParams[ setting ] = stepSettings[ setting ];
                    } else {
                        stepParams[ setting ] = defaults[ setting ];
                    }
                }

                return stepParams;
            },

            getProgressBarAttr: function() {
                var attr = {},
                    nrSteps = ( 0 < this.steps.length ? this.steps.length : 1 );

                attr.percentage = Math.round( 100 / nrSteps );
                attr.unit       = '%';

                if ( this.formOptions.step_pb_alignment ) {
                    attr.text_align       = this.formOptions.step_pb_alignment;
                    attr.force_text_align = 'true';
				}

                if ( this.formOptions.step_pb_striped ) {
                    attr.striped = this.formOptions.step_pb_striped;
				}

                attr.show_percentage = 'yes';
				if ( this.formOptions.step_pb_percentage && 'none' === this.formOptions.step_pb_percentage ) {
                    attr.show_percentage = 'no';
				}
				if ( this.formOptions.step_pb_animated_stripes ) {
                    attr.animated_stripes = this.formOptions.step_pb_animated_stripes;
				}
				if ( this.formOptions.step_pb_dimension ) {
                    attr.height = this.formOptions.step_pb_dimension;
				}
				if ( this.formOptions.step_pb_filled_color ) {
                    attr.filledcolor = this.formOptions.step_pb_filled_color;
				}
				if ( this.formOptions.step_pb_unfilled_color ) {
                    attr.unfilledcolor = this.formOptions.step_pb_unfilled_color;
				}

				if ( this.formOptions.step_pb_bor_top_left ) {
                    attr.border_radius_top_left = this.formOptions.step_pb_bor_top_left;
				}
				if ( this.formOptions.step_pb_bor_top_right ) {
                    attr.border_radius_top_right = this.formOptions.step_pb_bor_top_right;
				}
				if ( this.formOptions.step_pb_bor_bottom_right ) {
                    attr.border_radius_bottom_right = this.formOptions.step_pb_bor_bottom_right;
				}
				if ( this.formOptions.step_pb_bor_bottom_left ) {
                    attr.border_radius_bottom_left = this.formOptions.step_pb_bor_bottom_left;
				}

				if ( this.formOptions.step_pb_filled_border_size ) {
                    attr.filledbordersize = this.formOptions.step_pb_filled_border_size;
				}

				if ( this.formOptions.step_pb_filled_border_color ) {
                    attr.filledbordercolor = this.formOptions.step_pb_filled_border_color;
				}

				if ( this.formOptions[ 'step_pb_typo-font-family' ] ) {
                    attr.fusion_font_family_text_font = this.formOptions[ 'step_pb_typo-font-family' ];
				}
				if ( this.formOptions[ 'step_pb_typo-variant' ] ) {
                    attr.fusion_font_variant_text_font = this.formOptions[ 'step_pb_typo-variant' ];
				}

				if ( this.formOptions[ 'step_pb_typo-font-size' ] ) {
                    attr.text_font_size = this.formOptions[ 'step_pb_typo-font-size' ];
				}
                if ( this.formOptions[ 'step_pb_typo-line-height' ] ) {
                    attr.text_line_height = this.formOptions[ 'step_pb_typo-line-height' ];
				}
                if ( this.formOptions[ 'step_pb_typo-letter-spacing' ] ) {
                    attr.text_letter_spacing = this.formOptions[ 'step_pb_typo-letter-spacing' ];
				}
                if ( this.formOptions[ 'step_pb_typo-text-transform' ] ) {
                    attr.text_text_transform = this.formOptions[ 'step_pb_typo-text-transform' ];
				}
                if ( this.formOptions.step_pb_typo_color ) {
                    attr.textcolor = this.formOptions.step_pb_typo_color;
				}


                return attr;
            }

        } );

    } );
}( jQuery ) );
