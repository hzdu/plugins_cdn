// MyBlock.ts
import { registerBlockType }                from '@wordpress/blocks';
import React                                from 'react';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import { Panel, PanelBody, TextControl }    from '@wordpress/components';
import { __ }                               from '@wordpress/i18n';
import { cfw__ }                            from '../functions/translationWrappers';
import metadata                             from '../../../blocks/order-bump-steps/block.json';

class OrderBumpSteps {
    name: string;

    settings: any;

    constructor() {
        this.name = 'cfw/order-bump-steps';
        this.settings = {
            attributes: {
                stepOneTitle: {
                    type: 'string',
                    default: __( 'Order Submitted', 'checkout-wc' ),
                },
                stepTwoTitle: {
                    type: 'string',
                    default: __( 'Special Offer', 'checkout-wc' ),
                },
                stepThreeTitle: {
                    type: 'string',
                    default: __( 'Order Received', 'checkout-wc' ),
                },
            },

            edit: ( { attributes, setAttributes } ) => {
                const {
                    stepOneTitle,
                    stepTwoTitle,
                    stepThreeTitle,
                } = attributes;

                function onChangeStep1Title( value: string ) {
                    setAttributes( { stepOneTitle: value } );
                }

                function onChangeStep2Title( value: string ) {
                    setAttributes( { stepTwoTitle: value } );
                }

                function onChangeStep3Title( value: string ) {
                    setAttributes( { stepThreeTitle: value } );
                }

                return [
                    <InspectorControls>
                        <Panel>
                            <PanelBody
                                title={cfw__( 'Order Bump Steps Stettings', 'checkout-wc' )}
                            >
                                <TextControl
                                    label={cfw__( 'Step 1 Title', 'checkout-wc' )}
                                    help={cfw__( 'The title of Step 1. Example: Order Submitted', 'wholesome-plugin' )}
                                    onChange={onChangeStep1Title}
                                    value={stepOneTitle}
                                />
                                <TextControl
                                    label={cfw__( 'Step 2 Title', 'checkout-wc' )}
                                    help={cfw__( 'The title of Step 2. Example: Special Offer', 'wholesome-plugin' )}
                                    onChange={onChangeStep2Title}
                                    value={stepTwoTitle}
                                />
                                <TextControl
                                    label={cfw__( 'Step 3 Title', 'checkout-wc' )}
                                    help={cfw__( 'The title of Step 3. Example: Order Received', 'wholesome-plugin' )}
                                    onChange={onChangeStep3Title}
                                    value={stepThreeTitle}
                                />
                            </PanelBody>
                        </Panel>
                    </InspectorControls>,
                    <div {...useBlockProps()}>
                        <div className="cfw-order-bumps-stepper-wrapper">
                            <div className="stepper-item completed">
                                <div className="step-counter"></div>
                                <div className="step-name">
                                    {stepOneTitle}
                                </div>
                            </div>
                            <div className="stepper-item completed">
                                <div className="step-counter"></div>
                                <div className="step-name">
                                    {stepTwoTitle}
                                </div>
                            </div>
                            <div className="stepper-item">
                                <div className="step-counter"></div>
                                <div className="step-name">
                                    {stepThreeTitle}
                                </div>
                            </div>
                        </div>
                    </div>,
                ];
            },
            save: ( { attributes } ) => {
                const {
                    stepOneTitle,
                    stepTwoTitle,
                    stepThreeTitle,
                } = attributes;

                return (
                    <div {...useBlockProps.save()}>
                        <div className="cfw-order-bumps-stepper-wrapper">
                            <div className="stepper-item completed">
                                <div className="step-counter"></div>
                                <div className="step-name">
                                    {stepOneTitle}
                                </div>
                            </div>
                            <div className="stepper-item completed">
                                <div className="step-counter"></div>
                                <div className="step-name">
                                    {stepTwoTitle}
                                </div>
                            </div>
                            <div className="stepper-item">
                                <div className="step-counter"></div>
                                <div className="step-name">
                                    {stepThreeTitle}
                                </div>
                            </div>
                        </div>
                    </div>
                );
            },
        };
    }

    register() {
        if ( ( window as any ).pagenow !== 'cfw_order_bumps' ) {
            return;
        }

        registerBlockType( metadata as any, this.settings );
    }
}

export default OrderBumpSteps;
