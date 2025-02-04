import React                                                                                                                    from 'react';
import { PluginDocumentSettingPanel }                                                                                           from '@wordpress/edit-post';
import { RadioControl, TextareaControl, TextControl }                                                                           from '@wordpress/components';
import withMetaboxValidation                                                                                                    from './withMetaboxValidation';
import { OrderBumpsMeta, ValidationRules }                                                                                      from '../../Types/ValidationRules';

const getValidationRules: ( meta: OrderBumpsMeta ) => ValidationRules = ( meta ) => ( {
    cfw_ob_offer_language: {
        required: true,
        error: 'Offer Language is a required field.',
    },
    cfw_ob_offer_description: {
        required: true,
        error: 'Offer Description is a required field.',
    },
} );

const OrderBumpsOfferLanguagePanel = ( { meta, handleFieldChange } ) => (
    <PluginDocumentSettingPanel
        name="cfw-ob-offer-language"
        title="Offer Language"
        className="cfw-ob-offer-language-mb"
    >

        {meta.cfw_ob_display_location === 'complete_order'
                && <>
                    <TextControl
                        label={ 'After Checkout Submit Modal Heading' }
                        help={ 'Default if blank: Your order is almost complete...' }
                        value={ meta.cfw_ob_offer_heading }
                        onChange={
                            ( newValue: string ) => {
                                handleFieldChange( 'cfw_ob_offer_heading', newValue );
                            }
                        }
                    />
                    <TextControl
                        label={ 'After Checkout Submit Modal Subheading' }
                        help={ 'Default if blank: Add this offer to your order and save!' }
                        value={ meta.cfw_ob_offer_subheading }
                        onChange={
                            ( newValue: string ) => {
                                handleFieldChange( 'cfw_ob_offer_subheading', newValue );
                            }
                        }
                    />
                </>
        }

        <TextControl
            label={ meta.cfw_ob_display_location !== 'complete_order' ? 'Offer Acceptance Checkbox Label' : 'Offer Acceptance Button Label' }
            help={ 'Example: Yes! Please add this offer to my order' }
            value={ meta.cfw_ob_offer_language }
            onChange={
                ( newValue: string ) => {
                    handleFieldChange( 'cfw_ob_offer_language', newValue );
                }
            }
        />

        <TextareaControl
            label={'Offer Description'}
            help={'Example: Limited time offer! Get an EXCLUSIVE discount right now! Click the checkbox above to add this product to your order now.'}
            value={ meta.cfw_ob_offer_description }
            onChange={
                ( newValue: string ) => {
                    handleFieldChange( 'cfw_ob_offer_description', newValue );
                }
            }
        />

        <TextControl
            label={ 'Modal Offer Rejection Link Text' }
            help={ (
                <>
                    <p>
                        Displays in modal version of Order Bump, such as when configured as an <i>After Checkout Submit Modal</i> or when the Offer Product is a variable product (as opposed to a specific variation).
                    </p>
                    <p>
                        {meta.cfw_ob_display_location === 'complete_order' ? (
                            <>Default if blank: No thanks, just complete my order</>
                        ) : (
                            <>Default if blank: No thanks</>
                        )}
                    </p>
                </>
            ) }
            value={ meta.cfw_ob_offer_cancel_button_text }
            onChange={
                ( newValue: string ) => {
                    handleFieldChange( 'cfw_ob_offer_cancel_button_text', newValue );
                }
            }
        />
    </PluginDocumentSettingPanel>
);

export default withMetaboxValidation( OrderBumpsOfferLanguagePanel, getValidationRules );
