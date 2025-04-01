import React from 'react';
import SettingsFormContainerPropsInterface from '../../../interfaces/SettingsFormContainerPropsInterface';
import SettingsFormPropsPlanInterface from '../../../interfaces/SettingsFormPropsPlanInterface';
interface ACRSettingsInterface {
    enable_acr: boolean;
    acr_abandoned_time: number;
    acr_from_name: string;
    acr_from_address: string;
    acr_reply_to_address: string;
    acr_recovered_order_statuses: any[];
    acr_excluded_roles: any[];
    acr_simulate_only: boolean;
}
interface ACRFormWooCommerceSettingsInterface {
    order_statuses: any;
    roles: any;
}
interface ACRFormParamsInterface {
    pre_content: string;
    post_content: string;
    clear_cart_data_url: string;
}
interface ACRSettingsFormPropsInterface extends SettingsFormContainerPropsInterface {
    settings: ACRSettingsInterface;
    woocommerce_settings: ACRFormWooCommerceSettingsInterface;
    plan: SettingsFormPropsPlanInterface;
    params: ACRFormParamsInterface;
}
declare const ACRSettingsForm: React.FC<ACRSettingsFormPropsInterface>;
export default ACRSettingsForm;
