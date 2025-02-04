import React from 'react';
import SettingsFormPropsInterface from '../../../interfaces/SettingsFormPropsInterface';
import SettingsFormPropsPlanInterface from '../../../interfaces/SettingsFormPropsPlanInterface';
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
declare const CheckoutSettingsForm: React.FC<CheckoutSettingsFormPropsInterface>;
export default CheckoutSettingsForm;
