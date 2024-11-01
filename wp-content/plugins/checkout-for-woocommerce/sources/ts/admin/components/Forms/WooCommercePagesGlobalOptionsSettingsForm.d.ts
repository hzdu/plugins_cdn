import React from 'react';
import SettingsFormContainerPropsInterface from '../../../interfaces/SettingsFormContainerPropsInterface';
import SettingsFormPropsPlanInterface from '../../../interfaces/SettingsFormPropsPlanInterface';
interface GlobalOptionsFormSettingsInterface {
    show_cart_item_discount: boolean;
    cart_item_link: string;
    cart_item_link_target_new_window: boolean;
    cart_item_data_display: string;
    store_policies: any[];
}
interface GlobalOptionsSettingsFormPropsInterface extends SettingsFormContainerPropsInterface {
    settings: GlobalOptionsFormSettingsInterface;
    plan: SettingsFormPropsPlanInterface;
}
declare const WooCommercePagesGlobalOptionsSettingsForm: React.FC<GlobalOptionsSettingsFormPropsInterface>;
export default WooCommercePagesGlobalOptionsSettingsForm;
