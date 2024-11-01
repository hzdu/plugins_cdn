import React from 'react';
import SettingsFormContainerPropsInterface from '../../../interfaces/SettingsFormContainerPropsInterface';
import SettingsFormPropsPlanInterface from '../../../interfaces/SettingsFormPropsPlanInterface';
interface LocalPickupSettingsInterface {
    enable_pickup: boolean;
    enable_pickup_ship_option: boolean;
    pickup_ship_option_label: string;
    pickup_option_label: string;
    pickup_methods: any[];
    pickup_shipping_method_other_label: string;
    enable_pickup_shipping_method_other_regex: boolean;
    enable_pickup_method_step: boolean;
    hide_pickup_methods: boolean;
}
interface LocalPickupFormWooCommerceSettingsInterface {
    shipping_methods: any;
}
interface LocalPickupSettingsFormPropsInterface extends SettingsFormContainerPropsInterface {
    settings: LocalPickupSettingsInterface;
    woocommerce_settings: LocalPickupFormWooCommerceSettingsInterface;
    plan: SettingsFormPropsPlanInterface;
    params: any;
}
declare const LocalPickupSettingsForm: React.FC<LocalPickupSettingsFormPropsInterface>;
export default LocalPickupSettingsForm;
