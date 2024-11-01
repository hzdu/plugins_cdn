import React from 'react';
import SettingsFormContainerPropsInterface from '../../../interfaces/SettingsFormContainerPropsInterface';
import SettingsFormPropsPlanInterface from '../../../interfaces/SettingsFormPropsPlanInterface';
interface SideCartSettingsInterface {
    enable_side_cart: boolean;
    side_cart_icon: string;
    side_cart_custom_icon_attachment_id: number | null;
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
declare const SideCartSettingsForm: React.FC<SideCartSettingsFormPropsInterface>;
export default SideCartSettingsForm;
