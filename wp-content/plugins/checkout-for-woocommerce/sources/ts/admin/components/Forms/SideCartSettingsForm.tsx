import { Slot, SlotFillProvider, withFilters }              from '@wordpress/components';
import { Formik, Form }                                     from 'formik';
import React                                                from 'react';
import cfwConvertOptionsObjectToArray                       from '../../../functions/cfwConvertOptionsObjectToArray';
import SettingsFormContainerPropsInterface                  from '../../../interfaces/SettingsFormContainerPropsInterface';
import SettingsFormPropsPlanInterface                       from '../../../interfaces/SettingsFormPropsPlanInterface';
import AdminPageSection                                     from '../AdminPageSection';
import CheckboxField                                        from '../Fields/CheckboxField';
import ColorPickerField                                     from '../Fields/ColorPickerField';
import IconRadioGroupRowField                               from '../Fields/IconRadioGroupRowField';
import NumberField                                          from '../Fields/NumberField';
import TextField                                            from '../Fields/TextField';
import ToggleCheckboxField                                  from '../Fields/ToggleCheckboxField';
import WPMediaUploadButton                                  from '../Fields/WPMediaUploadButton';
import LockedFieldWrapper                                   from '../LockedFieldWrapper';
import SevereAlert                                          from '../SevereAlert';

interface SideCartSettingsInterface {
    enable_side_cart: boolean;
    side_cart_icon: string;
    side_cart_custom_icon_attachment_id: number|null;
    side_cart_icon_color: string;
    side_cart_icon_width: number;
    enable_floating_cart_button: boolean;
    floating_cart_button_right_position: number;
    floating_cart_button_bottom_position: number;
    hide_floating_cart_button_empty_cart: boolean;
    shake_floating_cart_button: boolean;
    enable_ajax_add_to_cart: boolean;
    enable_side_cart_payment_buttons: boolean;
    enable_order_bumps_on_side_cart: boolean;
    enable_side_cart_suggested_products: boolean;
    side_cart_suggested_products_heading: string;
    enable_side_cart_suggested_products_random_fallback: boolean;
    allow_side_cart_item_variation_changes: boolean;
    show_side_cart_item_discount: boolean;
    enable_promo_codes_on_side_cart: boolean;
    enable_side_cart_totals: boolean;
    enable_side_cart_continue_shopping_button: boolean;
    enable_free_shipping_progress_bar: boolean;
    side_cart_free_shipping_threshold: number;
    side_cart_amount_remaining_message: string;
    side_cart_free_shipping_message: string;
    side_cart_free_shipping_progress_indicator_color: string;
    side_cart_free_shipping_progress_bg_color: string;
    enable_free_shipping_progress_bar_at_checkout: boolean;
}

interface SideCartFormWooCommerceSettingsInterface {
    thank_you_order_statuses: any;
}

interface SideCartFormParamsInterface {
    icon_options: any[];
    default_free_shipping_progress_bar_color: string;
    custom_icon_preview_url: string;
}

interface SideCartSettingsFormPropsInterface extends SettingsFormContainerPropsInterface {
    settings: SideCartSettingsInterface;
    woocommerce_settings: SideCartFormWooCommerceSettingsInterface;
    plan: SettingsFormPropsPlanInterface;
    params: SideCartFormParamsInterface;
}

const SideCartSettingsForm: React.FC<SideCartSettingsFormPropsInterface> = ( props ) => {
    const { saveSettings, isLoading, searchTerm } = props;

    const AdditionalSettings = withFilters(
        'CheckoutWC.Admin.Settings.Pages.SideCart',
    )( () => <></> );

    return (
        <SlotFillProvider>
            <AdditionalSettings />
            <Formik
                initialValues={{
                    ...props.settings,
                }}
                enableReinitialize={true}
                onSubmit={async ( values ) => {
                    await saveSettings( values );
                }}
            >
                {( { values } ) => (
                    <Form className={'space-y-6 transition-all'} style={{ filter: isLoading ? 'blur(2px)' : 'none' }}>
                        <AdminPageSection
                            title='Side Cart'
                            description='Configure the Side Cart.'
                            content={
                                <>
                                    <LockedFieldWrapper plan={props.plan} slug={'side-cart'} locked={props.plan.plan_level < 2} requiredPlans={props.plan.labels.required_list[ 2 ]}>
                                        <ToggleCheckboxField
                                            name='enable_side_cart'
                                            label='Enable Side Cart'
                                            description='Replace your cart page with a beautiful side cart that slides in from the right when items are added to the cart.'
                                            disabled={props.plan.plan_level < 2}
                                            searchTerm={searchTerm}
                                        />
                                    </LockedFieldWrapper>

                                    <Slot name="CheckoutWC.Admin.Pages.SideCart.Options" />
                                </>
                            }
                        />

                        {props.plan.plan_level >= 2 && values.enable_side_cart
                            && (
                                <>
                                    <AdminPageSection
                                        title='Side Cart Icon'
                                        description='Used by the Side Cart and Floating Side Cart Button.'
                                        content={
                                            <>
                                                <div className={'flex space-x-4'}>
                                                    <div className={'grow space-y-4 cfw-admin-section-component-content'}>
                                                        <IconRadioGroupRowField
                                                            name='side_cart_icon'
                                                            label='Icon'
                                                            description='Choose the Side Cart icon.'
                                                            options={cfwConvertOptionsObjectToArray( props.params.icon_options )}
                                                            searchTerm={searchTerm}
                                                        />

                                                        <WPMediaUploadButton
                                                            name='side_cart_custom_icon_attachment_id'
                                                            label='Custom Icon'
                                                            description='Upload a custom icon. Overrides the icon selection above. SVG REQUIRED.'
                                                            defaultUrl={props.params.custom_icon_preview_url}
                                                            searchTerm={searchTerm}
                                                        />

                                                        <NumberField
                                                            name='side_cart_icon_width'
                                                            label='Width'
                                                            description='The width of the icon in pixels. Default: 34'
                                                            searchTerm={searchTerm}
                                                        />
                                                    </div>

                                                    <ColorPickerField
                                                        name='side_cart_icon_color'
                                                        label='Icon Color'
                                                        defaultValue='#222'
                                                        searchTerm={searchTerm}
                                                    />
                                                </div>
                                            </>
                                        }
                                    />

                                    <AdminPageSection
                                        title='Suggested Products'
                                        description='Configure Suggested Products cross-sells.'
                                        content={
                                            <>
                                                <CheckboxField
                                                    name="enable_side_cart_suggested_products"
                                                    label="Enable Suggested Products"
                                                    description='Display cross sells / suggested products at the bottom of the side cart.'
                                                    searchTerm={searchTerm}
                                                />

                                                { values.enable_side_cart_suggested_products
                                                    && (
                                                        <>
                                                            <TextField
                                                                name='side_cart_suggested_products_heading'
                                                                label='Heading'
                                                                description='Heading above the suggested products. Leave blank for default. Default: You may also like&hellip;'
                                                                placeholder={'You may also like…'}
                                                                searchTerm={searchTerm}
                                                            />

                                                            <CheckboxField
                                                                name="enable_side_cart_suggested_products_random_fallback"
                                                                label="Enable Random Cross Sells Fallback"
                                                                description='If none of the cart products have cross sell items defined, display random products instead.'
                                                                searchTerm={searchTerm}
                                                            />
                                                        </>
                                                    )
                                                }
                                            </>
                                        }
                                    />

                                    <AdminPageSection
                                        title='Floating Side Cart Button'
                                        description='Configure the Floating Side Cart Button'
                                        content={
                                            <>
                                                <CheckboxField
                                                    name="enable_floating_cart_button"
                                                    label="Enable Floating Cart Button"
                                                    description='Enable floating cart button on the bottom right of pages.'
                                                    searchTerm={searchTerm}
                                                />

                                                { values.enable_floating_cart_button
                                                    && (
                                                        <>
                                                            <div className={'flex space-x-4 cfw-admin-section-component-content'}>
                                                                <NumberField
                                                                    name='floating_cart_button_right_position'
                                                                    label='Right Position'
                                                                    description='The position from the right side of the screen in pixels. Default: 20'
                                                                    searchTerm={searchTerm}
                                                                />

                                                                <NumberField
                                                                    name='floating_cart_button_bottom_position'
                                                                    label='Bottom Position'
                                                                    description='The position from the bottom of the screen in pixels. Default: 20'
                                                                    searchTerm={searchTerm}
                                                                />
                                                            </div>

                                                            <CheckboxField
                                                                name="hide_floating_cart_button_empty_cart"
                                                                label="Hide Button If Empty Cart"
                                                                description='Hide floating cart button if cart is empty.'
                                                                searchTerm={searchTerm}
                                                            />
                                                        </>
                                                    )
                                                }
                                            </>
                                        }
                                    />

                                    <AdminPageSection
                                        title='Free Shipping Progress Bar'
                                        description='Configure the Free Shipping Progress Bar'
                                        content={
                                            <>
                                                <CheckboxField
                                                    name="enable_free_shipping_progress_bar"
                                                    label="Enable Free Shipping Progress Bar"
                                                    description='Enable Free Shipping progress bar to show customers how close they are to obtaining free shipping. Uses your shipping settings to determine limits. To override, specify amount below.'
                                                    searchTerm={searchTerm}
                                                />

                                                {values.enable_free_shipping_progress_bar
                                                    && (
                                                        <>
                                                            <NumberField
                                                                name='side_cart_free_shipping_threshold'
                                                                label='Free Shipping Threshold'
                                                                description='Cart subtotal required to qualify for free shipping. To use automatic detection based on shipping configuration, leave blank. Enter in store base currency.'
                                                                searchTerm={searchTerm}
                                                            />

                                                            <TextField
                                                                name='side_cart_amount_remaining_message'
                                                                label='Amount Remaining Message'
                                                                placeholder={"You're %s away from free shipping!"}
                                                                description="The amount remaining to qualify for free shipping message. Leave blank for default. Default: You're %s away from free shipping!"
                                                                searchTerm={searchTerm}
                                                            />

                                                            {values.side_cart_amount_remaining_message && !values.side_cart_amount_remaining_message.includes( '%s' ) && (
                                                                <SevereAlert
                                                                    description='Please ensure your amount remaining message includes the %s placeholder which is replaced with amount remaining when displayed to customers.'
                                                                />
                                                            )}

                                                            <TextField
                                                                name='side_cart_free_shipping_message'
                                                                label='Free Shipping Message'
                                                                placeholder={'Congrats! You get free standard shipping.'}
                                                                description="The free shipping message. Leave blank for default. Default: Congrats! You get free standard shipping."
                                                                searchTerm={searchTerm}
                                                            />

                                                            <CheckboxField
                                                                name="enable_free_shipping_progress_bar_at_checkout"
                                                                label="Enable Free Shipping Progress Bar At Checkout"
                                                                description='Enable Free Shipping Progress Bar on the checkout page cart summary.'
                                                                searchTerm={searchTerm}
                                                            />

                                                            <div className={'flex space-x-4 cfw-admin-section-component-content'}>
                                                                <ColorPickerField
                                                                    name='side_cart_free_shipping_progress_indicator_color'
                                                                    label='Progress Indicator Color'
                                                                    defaultValue={props.params.default_free_shipping_progress_bar_color}
                                                                    searchTerm={searchTerm}
                                                                />

                                                                <ColorPickerField
                                                                    name='side_cart_free_shipping_progress_bg_color'
                                                                    label='Progress Bar Background Color'
                                                                    defaultValue='#f5f5f5'
                                                                    searchTerm={searchTerm}
                                                                />
                                                            </div>
                                                        </>
                                                    )
                                                }
                                            </>
                                        }
                                    />

                                    {props.plan.plan_level >= 2 && values.enable_side_cart
                                        && (
                                            <AdminPageSection
                                                title='Options'
                                                description='Control various Side Cart options.'
                                                content={
                                                    <>
                                                        <CheckboxField
                                                            name="shake_floating_cart_button"
                                                            label="Disable Cart Auto Open"
                                                            description='Instead of opening the side cart, gently shake the floating cart button (if visible) to indicate a successful add to cart event.'
                                                            searchTerm={searchTerm}
                                                        />

                                                        <CheckboxField
                                                            name="enable_ajax_add_to_cart"
                                                            label="Enable AJAX Add to Cart"
                                                            description='Use AJAX on archive and single product pages to add items to cart. By default, WooCommerce requires a full form submit with page reload. Enabling this option uses AJAX to add items to the cart.'
                                                            searchTerm={searchTerm}
                                                        />

                                                        <CheckboxField
                                                            name="enable_side_cart_payment_buttons"
                                                            label="Enable Express Payment Buttons"
                                                            description='Enable express payment buttons from gateways that support the WooCommerce Minicart.'
                                                            searchTerm={searchTerm}
                                                        />

                                                        <CheckboxField
                                                            name="enable_order_bumps_on_side_cart"
                                                            label="Enable Order Bumps"
                                                            description='Enable order bumps that are set to display below cart items to appear in side cart.'
                                                            searchTerm={searchTerm}
                                                        />

                                                        <CheckboxField
                                                            name="allow_side_cart_item_variation_changes"
                                                            label="Allow Variation Changes"
                                                            description='Displays an edit link under cart items that allows customers to change which variation is selected in the cart.'
                                                            searchTerm={searchTerm}
                                                        />

                                                        <CheckboxField
                                                            name="show_side_cart_item_discount"
                                                            label="Enable Sale Prices"
                                                            description='Enable sale price under on cart item labels in side cart. Example: <s>$10.00</s> $5.00'
                                                            searchTerm={searchTerm}
                                                        />

                                                        <CheckboxField
                                                            name="enable_promo_codes_on_side_cart"
                                                            label="Enable Coupons"
                                                            description='Enable customers to apply coupons from the side cart.'
                                                            searchTerm={searchTerm}
                                                        />

                                                        {values.enable_promo_codes_on_side_cart && (
                                                            <CheckboxField
                                                                name="enable_side_cart_coupon_code_link"
                                                                label="Hide Coupon Code Field Behind Link"
                                                                description='Initially hide coupon field until "Have a coupon code?" link is clicked.'
                                                                searchTerm={searchTerm}
                                                            />
                                                        )}

                                                        <CheckboxField
                                                            name="enable_side_cart_totals"
                                                            label="Show Shipping and Totals"
                                                            description='Enable customers to see shipping and order total in addition to subtotal.'
                                                            searchTerm={searchTerm}
                                                        />

                                                        <CheckboxField
                                                            name="enable_side_cart_continue_shopping_button"
                                                            label="Enable Continue Shopping Button"
                                                            description='Enable Continue Shopping Button at bottom of Side Cart. Disabled by default.'
                                                            searchTerm={searchTerm}
                                                        />
                                                    </>
                                                }
                                            />
                                        )
                                    }
                                </>
                            )
                        }

                        <button className={'cfw_admin_page_submit hidden'} type="submit">Submit</button>
                    </Form>
                )}
            </Formik>
        </SlotFillProvider>
    );
};

export default SideCartSettingsForm;
