import { Slot, SlotFillProvider, withFilters }                from '@wordpress/components';
import { Formik, Form }                                       from 'formik';
import React                                                  from 'react';
import { sprintf }                                            from '@wordpress/i18n';
import SettingsFormPropsInterface                             from '../../../interfaces/SettingsFormPropsInterface';
import SettingsFormPropsPlanInterface                         from '../../../interfaces/SettingsFormPropsPlanInterface';
import AdminPageSection                                       from '../AdminPageSection';
import CheckboxField                                          from '../Fields/CheckboxField';
import CheckboxGroupField                                     from '../Fields/CheckboxGroupField';
import CountriesMultiselectField                              from '../Fields/CountriesMultiselectField';
import RadioGroupField                                        from '../Fields/RadioGroupField';
import TextField                                              from '../Fields/TextField';
import MediumAlert                                            from '../MediumAlert';
import SevereAlert                                            from '../SevereAlert';
import SelectField                                            from '../Fields/SelectField';
import LockedFieldWrapper                                     from '../LockedFieldWrapper';

interface CheckoutFormSettingsInterface {
    disable_express_checkout: boolean;
    skip_cart_step: boolean;
    skip_shipping_step: boolean;
    enable_order_review_step: boolean;
    enable_one_page_checkout: boolean;
    registration_style: string;
    user_matching: string;
    disable_auto_open_login_modal: boolean;
    'wp_option/woocommerce_checkout_phone_field': string;
    enable_order_notes: boolean;
    enable_coupon_code_link: boolean;
    enable_discreet_address_1_fields: boolean;
    discreet_address_1_fields_order: string;
    enable_highlighted_countries: boolean;
    highlighted_countries: string[];
    enable_international_phone_field: boolean;
    international_phone_field_standard: string;
    force_different_billing_address: boolean;
    enabled_billing_address_fields: string[];
    hide_billing_address_for_free_orders: boolean;
    enable_address_autocomplete: boolean;
    enable_fetchify_address_autocomplete: boolean;
    fetchify_access_token: string;
    enable_mobile_cart_summary: boolean;
    enable_mobile_totals: boolean;
    show_mobile_coupon_field: boolean;
    show_logos_mobile: boolean;
    cart_summary_mobile_label: string;
    enable_order_pay: boolean;
    enable_smartystreets_integration: boolean;
    smartystreets_auth_id: string;
    smartystreets_auth_token: string;
    disable_domain_autocomplete: boolean;
    auto_select_free_shipping_method: boolean;
    enable_cart_editing: boolean;
    allow_checkout_cart_item_variation_changes: boolean;
    show_item_remove_button: boolean;
    cart_edit_empty_cart_redirect: string;
}

interface CheckoutFormWooCommerceSettingsInterface {
    countries: any;
}

interface CheckoutFormConditionalSettingsInterface {
    order_notes_enable: boolean;
}

interface CheckoutSettingsFormPropsInterface extends SettingsFormPropsInterface {
    settings: CheckoutFormSettingsInterface;
    woocommerce_settings: CheckoutFormWooCommerceSettingsInterface;
    conditional_settings: CheckoutFormConditionalSettingsInterface;
    plan: SettingsFormPropsPlanInterface;
}

const CheckoutSettingsForm: React.FC<CheckoutSettingsFormPropsInterface> = ( props ) => {
    const { saveSettings, isLoading, searchTerm } = props;

    const AdditionalSettings = withFilters(
        'CheckoutWC.Admin.Settings.Pages.Checkout',
    )( () => <></> );

    return (
        <SlotFillProvider>
            <AdditionalSettings />
            <Formik
                initialValues={{
                    ...props.settings,
                    enabled_billing_address_fields: props.settings.enabled_billing_address_fields
                        ? props.settings.enabled_billing_address_fields
                        : [ 'billing_first_name',
                            'billing_last_name',
                            'billing_address_1',
                            'billing_address_2',
                            'billing_company',
                            'billing_country',
                            'billing_postcode',
                            'billing_state',
                            'billing_city',
                            'billing_phone',
                        ],
                }}
                enableReinitialize={true}
                onSubmit={async ( values ) => {
                    await saveSettings( values );
                }}
            >
                {( { values } ) => (
                    <Form className={'space-y-6 transition-all'} style={{ filter: isLoading ? 'blur(2px)' : 'none' }}>
                        <AdminPageSection
                            title='Steps'
                            description='Control the checkout steps.'
                            content={
                                <>
                                    <CheckboxField
                                        name="skip_cart_step"
                                        label="Disable Cart Step"
                                        description='Disable to skip the cart and redirect customers directly to checkout after adding a product to the cart. (Incompatible with Side Cart)'
                                        searchTerm={searchTerm}
                                    />
                                    <CheckboxField
                                        name="skip_shipping_step"
                                        label="Disable Shipping Step"
                                        description='Disable to hide the shipping method step. Useful if you only have one shipping option for all orders.'
                                        searchTerm={searchTerm}
                                    />

                                    <LockedFieldWrapper plan={props.plan} slug={'order-review-step-one-page-checkout'} locked={props.plan.plan_level < 1} requiredPlans={props.plan.labels.required_list[ 1 ]}>
                                        <CheckboxField
                                            name="enable_order_review_step"
                                            label="Enable Order Review Step"
                                            description='Adds a review step after payment information before finalizing order. Useful for jurisdictions which require additional confirmation before order submission. (Cannot be used with One Page Checkout)'
                                            searchTerm={searchTerm}
                                            disabled={props.plan.plan_level < 1}
                                        />

                                        <CheckboxField
                                            name="enable_one_page_checkout"
                                            label="Enable One Page Checkout"
                                            description='Show all checkout steps on  one page. Useful for digital stores. (Cannot be used with Order Review Step)'
                                            searchTerm={searchTerm}
                                            disabled={props.plan.plan_level < 1}
                                        />
                                    </LockedFieldWrapper>

                                    <Slot name="CheckoutWC.Admin.Pages.Checkout.Steps" />
                                </>
                            }
                        />
                        <AdminPageSection
                            title='Shipping Options'
                            description='Control shipping options.'
                            content={
                                <>
                                    <LockedFieldWrapper plan={props.plan} slug={'auto-select-free-shipping'} locked={props.plan.plan_level < 1} requiredPlans={props.plan.labels.required_list[ 1 ]}>
                                        <CheckboxField
                                            name="auto_select_free_shipping_method"
                                            label="Auto Select Free Shipping Method (if available)"
                                            description='WooCommerce has a habit of not selecting the free shipping method if it is setup to be conditionally enabled. This option auto-selects the free shipping on page load.'
                                            searchTerm={searchTerm}
                                            disabled={props.plan.plan_level < 1}
                                        />
                                    </LockedFieldWrapper>

                                    <Slot name="CheckoutWC.Admin.Pages.Checkout.ShippingOptions" />
                                </>
                            }
                        />
                        <AdminPageSection
                            title='Login and Registration'
                            description='Control how login and registration function on your checkout page.'
                            content={
                                <>
                                    <CheckboxField
                                        name="disable_auto_open_login_modal"
                                        label="Disable Automatic Login Modal"
                                        description='Normally the login modal automatically opens if the entered email address matches an existing account. This disables that behavior.'
                                        searchTerm={searchTerm}
                                    />

                                    <RadioGroupField
                                        name='registration_style'
                                        label='Registration'
                                        description='Choose how customers obtain a password when registering an account.'
                                        options={[
                                            {
                                                value: 'enhanced',
                                                label: 'Enhanced (Recommended)',
                                                description: 'Automatically generate a username and password and email it to the customer using the native WooCommerce functionality. (Recommended)',
                                            },
                                            {
                                                value: 'woocommerce',
                                                label: 'WooCommerce Default',
                                                description: 'A password field is provided for the customer to select their own password. Not recommended.',
                                            },
                                        ]}
                                        searchTerm={searchTerm}
                                    />

                                    <LockedFieldWrapper plan={props.plan} slug={'user-matching'} locked={props.plan.plan_level < 1} requiredPlans={props.plan.labels.required_list[ 1 ]}>
                                        <RadioGroupField
                                            name='user_matching'
                                            label='User Matching'
                                            description='Choose how to handle guest orders and accounts.'
                                            disabled={props.plan.plan_level < 1}
                                            options={[
                                                {
                                                    value: 'enabled',
                                                    label: 'Enabled (Recommended)',
                                                    description: 'Automatically matches guest orders to user accounts on new purchase as well as on registration of a new user. (Recommended)',
                                                },
                                                {
                                                    value: 'woocommerce',
                                                    label: 'WooCommerce Default',
                                                    description: 'Guest orders will not be linked to matching accounts.',
                                                },
                                            ]}
                                            searchTerm={searchTerm}
                                        />
                                    </LockedFieldWrapper>

                                    <Slot name="CheckoutWC.Admin.Pages.Checkout.LoginRegistration" />
                                </>
                            }
                        />

                        <AdminPageSection
                            title='Field Options'
                            description='Control how different checkout fields appear.'
                            content={
                                <>
                                    <SelectField
                                        name={'wp_option/woocommerce_checkout_phone_field'}
                                        label={'Phone Field'}
                                        description={'Determines whether the WooCommerce native phone field is enabled.'}
                                        options={[
                                            {
                                                value: 'hidden',
                                                label: 'Hidden',
                                            },
                                            {
                                                value: 'optional',
                                                label: 'Optional',
                                            },
                                            {
                                                value: 'required',
                                                label: 'Required',
                                            },
                                        ]}
                                        searchTerm={searchTerm}
                                    />

                                    <CheckboxField
                                        name="enable_order_notes"
                                        label="Enable Order Notes Field"
                                        description='Enable or disable WooCommerce Order Notes field. (Default: Disabled)'
                                        enabled={props.conditional_settings.order_notes_enable}
                                        searchTerm={searchTerm}
                                    />
                                    {!props.conditional_settings.order_notes_enable
                                        && (
                                            <MediumAlert description={'Order Notes field is being controlled by a filter or a plugin.'} />
                                        )
                                    }

                                    <CheckboxField
                                        name="enable_coupon_code_link"
                                        label="Hide Coupon Code Field Behind Link"
                                        description='Initially hide coupon field until "Have a coupon code?" link is clicked.'
                                        searchTerm={searchTerm}
                                    />

                                    <CheckboxField
                                        name="hide_optional_address_fields_behind_link"
                                        label="Hide Optional Address Fields Behind Links"
                                        description='Recommended to increase conversions. Example link text: Add Company (optional)'
                                        searchTerm={searchTerm}
                                    />

                                    <CheckboxField
                                        name="disable_domain_autocomplete"
                                        label="Disable Email Domain Autocomplete"
                                        description='Disable email domain autocomplete.'
                                        searchTerm={searchTerm}
                                    />

                                    <LockedFieldWrapper plan={props.plan} slug={'field-options'} locked={props.plan.plan_level < 1} requiredPlans={props.plan.labels.required_list[ 1 ]}>
                                        <CheckboxField
                                            name="enable_discreet_address_1_fields"
                                            label="Enable Separate House Number and Street Name Address Fields"
                                            description='Values are combined into a single address_1 field based on country selected by customer.'
                                            searchTerm={searchTerm}
                                            disabled={props.plan.plan_level < 1}
                                        />

                                        {props.plan.plan_level >= 1 && values.enable_discreet_address_1_fields
                                        && (
                                            <RadioGroupField
                                                name='discreet_address_1_fields_order'
                                                label='Separate Address Fields Display Order'
                                                description='Choose how display separate address 1 fields.'
                                                nested={true}
                                                options={[
                                                    {
                                                        value: 'default',
                                                        label: '[House Number] [Street Name]',
                                                        description: 'Display the House Number before the Street Name. (Default)',
                                                    },
                                                    {
                                                        value: 'alternate',
                                                        label: '[Street Name] [House Number]',
                                                        description: 'Display the Street Name before the House Number.',
                                                    },
                                                ]}
                                                searchTerm={searchTerm}
                                            />
                                        )
                                        }

                                        {values.enable_discreet_address_1_fields && values.enable_address_autocomplete && (
                                            <SevereAlert
                                                description='Separate Address Fields is incompatible with Google Address Autocomplete. <a target="_blank" class="text-blue-600 underline" href="https://www.checkoutwc.com/documentation/google-address-autocomplete-and-discreet-house-number-and-street-name-address-fields/">Learn More</a>'
                                            />
                                        )}

                                        <CheckboxField
                                            name="use_fullname_field"
                                            label="Enable Full Name Field"
                                            description='Enable to replace first and last name fields with a single full name field.'
                                            searchTerm={searchTerm}
                                            disabled={props.plan.plan_level < 1}
                                        />

                                        <CheckboxField
                                            name="enable_highlighted_countries"
                                            label="Enable Highlighted Countries"
                                            description='Promote selected countries to the top of the countries list in country dropdowns.'
                                            searchTerm={searchTerm}
                                            disabled={props.plan.plan_level < 1}
                                        />

                                        {props.plan.plan_level >= 1 && values.enable_highlighted_countries
                                        && (
                                            <CountriesMultiselectField
                                                name='highlighted_countries'
                                                label='Highlighted Countries'
                                                description='The countries to show first in country dropdowns.'
                                                nested={true}
                                                hide={!values.enable_highlighted_countries}
                                                countries={props.woocommerce_settings.countries}
                                                searchTerm={searchTerm}
                                            />
                                        )
                                        }

                                        <CheckboxField
                                            name="enable_international_phone_field"
                                            label="Enable International Phone Field"
                                            description='Validate phone number entry based on selected country. Replaces phone field placeholder with example phone number. Stores phone number according to International Phone Format.'
                                            searchTerm={searchTerm}
                                            disabled={props.plan.plan_level < 1}
                                        />

                                        {props.plan.plan_level >= 1 && values.enable_international_phone_field
                                        && (
                                            <RadioGroupField
                                                name='international_phone_field_standard'
                                                label='International Phone Format'
                                                description='Choose how to store phone numbers.'
                                                nested={true}
                                                options={[
                                                    {
                                                        value: 'raw',
                                                        label: 'Raw Value (No Formatting)',
                                                        description: 'The number is stored exactly how the user entered it.',
                                                    },
                                                    {
                                                        value: 'E164',
                                                        label: 'E164',
                                                        description: 'Format phone number with E164 standard.',
                                                    },
                                                    {
                                                        value: 'INTERNATIONAL',
                                                        label: 'International',
                                                        description: 'Format phone number with RFC3966 standard without the tel: prefix',
                                                    },
                                                    {
                                                        value: 'NATIONAL',
                                                        label: 'National',
                                                        description: 'Format phone number based on selected country. US Example (555) 555 - 5555, UK Example: 07911 123457',
                                                    },
                                                    {
                                                        value: 'RFC3966',
                                                        label: 'RFC3966',
                                                        description: 'Format phone number with RFC3966 standard.',
                                                    },
                                                ]}
                                                searchTerm={searchTerm}
                                            />
                                        )
                                        }
                                    </LockedFieldWrapper>
                                    <Slot name="CheckoutWC.Admin.Pages.Checkout.FieldOptions" />
                                </>
                            }
                        />
                        <AdminPageSection
                            title='Address Options'
                            description='Control address fields.'
                            content={
                                <>
                                    <CheckboxField
                                        name="force_different_billing_address"
                                        label="Force Different Billing Address"
                                        description='Remove option to use shipping address as billing address.'
                                        searchTerm={searchTerm}
                                    />

                                    <CheckboxField
                                        name="hide_billing_address_for_free_orders"
                                        label="Hide Billing Address For Free Orders"
                                        description='Remove the billing address fields from checkout for free orders.'
                                        searchTerm={searchTerm}
                                    />

                                    <CheckboxGroupField
                                        name='enabled_billing_address_fields'
                                        label='Enabled Billing Address Fields'
                                        description='Choose which billing address fields are visible for customers.'
                                        options={[
                                            {
                                                value: 'billing_first_name',
                                                label: 'First Name',
                                            },
                                            {
                                                value: 'billing_last_name',
                                                label: 'Last Name',
                                            },
                                            {
                                                value: 'billing_address_1',
                                                label: 'Address 1',
                                            },
                                            {
                                                value: 'billing_address_2',
                                                label: 'Address 2',
                                            },
                                            {
                                                value: 'billing_company',
                                                label: 'Company',
                                            },
                                            {
                                                value: 'billing_country',
                                                label: 'Country',
                                            },
                                            {
                                                value: 'billing_postcode',
                                                label: 'Postcode',
                                            },
                                            {
                                                value: 'billing_state',
                                                label: 'State',
                                            },
                                            {
                                                value: 'billing_city',
                                                label: 'City',
                                            },
                                            {
                                                value: 'billing_phone',
                                                label: 'Phone',
                                            },
                                        ]}
                                        searchTerm={searchTerm}
                                    />
                                    {
                                        ( !values.enabled_billing_address_fields.includes( 'billing_country' ) || !values.enabled_billing_address_fields.includes( 'billing_state' ) )
                                        && (
                                            <MediumAlert
                                                description='Disabling the country or state field causes issues with some gateways. Consider leaving these fields enabled.'
                                            />
                                        )
                                    }

                                    <Slot name="CheckoutWC.Admin.Pages.Checkout.AddressOptions" />
                                </>
                            }
                        />
                        <AdminPageSection
                            title='Address Completion and Validation'
                            description='Control some mobile only checkout behaviors.'
                            content={
                                <>
                                    <LockedFieldWrapper plan={props.plan} slug={'address-complete-and-validation'} locked={props.plan.plan_level < 1} requiredPlans={props.plan.labels.required_list[ 1 ]}>
                                        <CheckboxField
                                            name="enable_address_autocomplete"
                                            label="Enable Google Address Autocomplete"
                                            description={sprintf( 'Enable or disable Google Address Autocomplete feature. <a href="%s" class="text-blue-600 underline">%s</a>', ( window as any )?.cfw_google_address_autocomplete?.google_api_key_settings_page_url ?? '', 'Requires Google API key.' )}
                                            searchTerm={searchTerm}
                                            disabled={props.plan.plan_level < 1}
                                        />

                                        {props.plan.plan_level >= 1 && values.enable_discreet_address_1_fields && values.enable_address_autocomplete && (
                                            <SevereAlert
                                                description='Google Address Autocomplete cannot be used with Separate Address Fields. <a target="_blank" class="text-blue-600 underline" href="https://www.checkoutwc.com/documentation/google-address-autocomplete-and-discreet-house-number-and-street-name-address-fields/">Learn More</a>'
                                            />
                                        )}

                                        <CheckboxField
                                            name="enable_fetchify_address_autocomplete"
                                            label="Enable Fetchify Address Autocomplete"
                                            description={'Enable or disable Fetchify address autocomplete feature. <a href="https://fetchify.com" class="text-blue-600 underline" target="_blank">Requires Fetchify access token.</a>'}
                                            searchTerm={searchTerm}
                                            disabled={props.plan.plan_level < 1}
                                        />

                                        {props.plan.plan_level >= 1 && values.enable_fetchify_address_autocomplete
                                        && (
                                            <TextField
                                                name='fetchify_access_token'
                                                label='Fetchify Access Token'
                                                description='Your Fetchify access token.'
                                                nested={true}
                                                searchTerm={searchTerm}
                                            />
                                        )
                                        }

                                        {
                                            values.enable_fetchify_address_autocomplete && values.enable_address_autocomplete
                                        && (
                                            <SevereAlert
                                                description='You can only use one address autocomplete service at a time. Please disable one of the services.'
                                            />
                                        )
                                        }

                                        <CheckboxField
                                            name="enable_smartystreets_integration"
                                            label="Enable Smarty Address Validation"
                                            description={'Validates shipping address with Smarty.com and provides alternative, corrected addresses for incorrect or incomplete addresses.'}
                                            searchTerm={searchTerm}
                                            disabled={props.plan.plan_level < 1}
                                        />

                                        {props.plan.plan_level >= 1 && values.enable_smartystreets_integration
                                        && (
                                            <>
                                                <TextField
                                                    name='smartystreets_auth_id'
                                                    label='Smarty Auth ID'
                                                    description='Smarty Auth ID. Available in your <a target="_blank" href="https://www.smarty.com/account/keys" class="text-blue-600 underline">Smarty Account</a>'
                                                    searchTerm={searchTerm}
                                                    nested={true}
                                                />
                                                <TextField
                                                    name='smartystreets_auth_token'
                                                    label='Smarty Auth Token'
                                                    description='Smarty Auth Token. Available in your <a target="_blank" href="https://www.smarty.com/account/keys" class="text-blue-600 underline">Smarty Account</a>.'
                                                    searchTerm={searchTerm}
                                                    nested={true}
                                                />
                                            </>
                                        )
                                        }
                                    </LockedFieldWrapper>

                                    <Slot name="CheckoutWC.Admin.Pages.Checkout.AddressCompletionValidation" />
                                </>
                            }
                        />
                        <AdminPageSection
                            title={'Cart Summary'}
                            description={'Configure the Cart Summary on the checkout page.'}
                            content={
                                <>
                                    <LockedFieldWrapper plan={props.plan} slug={'cart-editing-at-checkout'} locked={props.plan.plan_level < 1} requiredPlans={props.plan.labels.required_list[ 1 ]}>
                                        <CheckboxField
                                            name="enable_cart_editing"
                                            label="Enable Cart Editing At Checkout"
                                            description='Enable or disable Cart Editing. Allows customer to remove or adjust quantity of cart items at checkout.'
                                            searchTerm={searchTerm}
                                            disabled={props.plan.plan_level < 1}
                                        />

                                        {props.plan.plan_level >= 1 && values.enable_cart_editing
                                            && (
                                                <>
                                                    <CheckboxField
                                                        name="allow_checkout_cart_item_variation_changes"
                                                        label="Allow Variation Changes"
                                                        description='Displays an edit link under cart items that allows customers to change which variation is selected in the cart.'
                                                        nested={true}
                                                        searchTerm={searchTerm}
                                                    />
                                                    <CheckboxField
                                                        name="show_item_remove_button"
                                                        label="Show Item Remove Button"
                                                        description='When hovering over an item, show a button (X) to remove the item.'
                                                        nested={true}
                                                        searchTerm={searchTerm}
                                                    />
                                                    <TextField
                                                        name="cart_edit_empty_cart_redirect"
                                                        label="Cart Editing Empty Cart Redirect"
                                                        description='URL to redirect to when customer empties cart from checkout page. If left blank, customer will be redirected to the cart page.'
                                                        nested={true}
                                                        searchTerm={searchTerm}
                                                    />
                                                </>
                                            )
                                        }
                                    </LockedFieldWrapper>

                                    <CheckboxField
                                        name="enable_sticky_cart_summary"
                                        label="Enable Sticky Cart Summary"
                                        description='If cart summary is shorter than the rest of the content, it will stick to the top of the screen when scrolling.'
                                        searchTerm={searchTerm}
                                    />
                                </>
                            }
                        />
                        <AdminPageSection
                            title='Mobile Options'
                            description='Control mobile specific features.'
                            content={
                                <>
                                    <CheckboxField
                                        name="enable_mobile_cart_summary"
                                        label="Enable Mobile Cart Summary"
                                        description={'Shows the cart, promo field, and totals at the bottom of the first checkout step.'}
                                        searchTerm={searchTerm}
                                    />

                                    <CheckboxField
                                        name="enable_mobile_totals"
                                        label="Enable Mobile Totals"
                                        description={'Shows cart totals right above the place order button on mobile.'}
                                        searchTerm={searchTerm}
                                    />

                                    <CheckboxField
                                        name="show_mobile_coupon_field"
                                        label="Enable Mobile Coupon Field"
                                        description={'Show coupon field above payment gateways on mobile devices. Helps customers find the coupon field without expanding the cart summary.'}
                                        searchTerm={searchTerm}
                                    />
                                    {
                                        values.enable_mobile_cart_summary && values.show_mobile_coupon_field
                                        && (
                                            <SevereAlert
                                                description='Enable Mobile Cart Summary is not compatible with Enable Mobile Coupon Field. Please disable one of the options.'
                                            />
                                        )
                                    }
                                    <CheckboxField
                                        name="show_logos_mobile"
                                        label="Enable Mobile Credit Card Logos"
                                        description={'Show the credit card logos on mobile. Note: Many gateway logos cannot be rendered properly on mobile. It is recommended you test before enabling. Default: Off'}
                                        searchTerm={searchTerm}
                                    />
                                    <TextField
                                        name='cart_summary_mobile_label'
                                        label='Cart Summary Mobile Label'
                                        description='Example: Show order summary and coupons. If left blank, this default will be used: Show order summary'
                                        searchTerm={searchTerm}
                                    />
                                    <Slot name="CheckoutWC.Admin.Pages.Checkout.MobileOptions" />
                                </>
                            }
                        />
                        <AdminPageSection
                            title='Order Pay'
                            description='Enable CheckoutWC template for the Order Pay / Customer Payment Page endpoint.'
                            content={
                                <>
                                    <LockedFieldWrapper plan={props.plan} slug={'order-pay'} locked={props.plan.plan_level < 1} requiredPlans={props.plan.labels.required_list[ 1 ]}>
                                        <CheckboxField
                                            name="enable_order_pay"
                                            label="Enable Order Pay Page"
                                            description={'Use CheckoutWC templates for Order Pay page.'}
                                            searchTerm={searchTerm}
                                            disabled={props.plan.plan_level < 1}
                                        />
                                    </LockedFieldWrapper>

                                    <Slot name="CheckoutWC.Admin.Pages.Checkout.OrderPay" />
                                </>
                            }
                        />
                        <button className={'cfw_admin_page_submit hidden'} type="submit">Submit</button>
                    </Form>
                )}
            </Formik>
        </SlotFillProvider>
    );
};

export default CheckoutSettingsForm;
