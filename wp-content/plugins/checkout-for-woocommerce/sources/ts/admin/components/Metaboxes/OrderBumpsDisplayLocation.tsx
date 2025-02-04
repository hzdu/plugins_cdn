import React, { useEffect }                                                            from 'react';
import { PluginDocumentSettingPanel }                                                  from '@wordpress/edit-post';
import {
    CheckboxControl,
    SelectControl,
} from '@wordpress/components';
import { useDispatch }                                                                     from '@wordpress/data';
import { store as noticesStore }                                                           from '@wordpress/notices';
import withMetaboxValidation                                                               from './withMetaboxValidation';
import { OrderBumpsMeta, ValidationRules }                                                 from '../../Types/ValidationRules';

const getValidationRules: ( meta: OrderBumpsMeta ) => ValidationRules = ( meta ) => ( {
} );

const OrderBumpsDisplayLocation = ( { meta, handleFieldChange } ) => {
    const { createNotice, removeNotice } = useDispatch( noticesStore );

    useEffect( () => {
        if ( meta.cfw_ob_display_location !== 'complete_order'
            || (
                meta.cfw_ob_full_screen !== 'yes'
                && meta.cfw_ob_display_location === 'complete_order'
            )
        ) {
            createNotice(
                'warning',
                'Block Editor is only used for Full Screen Order Bumps (Configurable for After Checkout Submit Bumps). Blocks are ignored for other configurations.',
                { id: 'notice-cfw_ob_display_location', isDismissible: false },
            );
        } else {
            removeNotice( 'notice-cfw_ob_display_location' );
        }

        return () => {
            removeNotice( 'notice-cfw_ob_display_location' );
        };
    }, [ meta.cfw_ob_display_location, meta.cfw_ob_full_screen ] );

    return (
        <PluginDocumentSettingPanel
            name="cfw-ob-display-location"
            title="Display Location"
            className="cfw-ob-display-location-mb"
        >
            <div
                style={{ marginBottom: '1rem' }}
            >
                <SelectControl
                    help="Where to display order bumps. Below Cart Items bumps will always display above the terms and conditions on mobile."
                    value={meta.cfw_ob_display_location}
                    options={[
                        { label: 'Below Cart Items', value: 'below_cart_items' },
                        { label: 'Below Cart Items (Side Cart Only)', value: 'below_side_cart_items' },
                        { label: 'Below Cart Items (Checkout Only)', value: 'below_checkout_cart_items' },
                        { label: 'Above Terms and Conditions', value: 'above_terms_and_conditions' },
                        { label: 'Above Express Checkout', value: 'above_express_checkout' },
                        { label: 'Bottom of Information Step', value: 'bottom_information_tab' },
                        { label: 'Bottom of Shipping Step', value: 'bottom_shipping_tab' },
                        { label: 'Below Complete Order Button', value: 'below_complete_order_button' },
                        { label: 'After Checkout Submit Modal', value: 'complete_order' },
                    ]}
                    onChange={
                        ( newValue: any ) => {
                            handleFieldChange( 'cfw_ob_display_location', newValue );
                        }
                    }
                />
                {meta.cfw_ob_display_location === 'complete_order'
                    && <CheckboxControl
                        label="Full Screen Landing Page (Use Block Editor To Design)"
                        help="If checked, the bump offer will be displayed full screen. Use Order Bump Offer Form block to design the offer."
                        checked={meta.cfw_ob_full_screen === 'yes'}
                        onChange={
                            ( newValue: boolean ) => {
                                handleFieldChange( 'cfw_ob_full_screen', newValue ? 'yes' : 'no' );
                            }
                        }
                    />
                }
            </div>
        </PluginDocumentSettingPanel>
    );
};

export default withMetaboxValidation( OrderBumpsDisplayLocation, getValidationRules );
