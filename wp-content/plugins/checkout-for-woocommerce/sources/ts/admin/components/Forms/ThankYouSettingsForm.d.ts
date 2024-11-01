import React from 'react';
import SettingsFormContainerPropsInterface from '../../../interfaces/SettingsFormContainerPropsInterface';
import SettingsFormPropsPlanInterface from '../../../interfaces/SettingsFormPropsPlanInterface';
interface ThankYouSettingsInterface {
    enable_thank_you_page: boolean;
    thank_you_order_statuses: any[];
    enable_map_embed: boolean;
    override_view_order_template: boolean;
}
interface ThankYouFormWooCommerceSettingsInterface {
    thank_you_order_statuses: any;
}
interface ThankYouSettingsFormPropsInterface extends SettingsFormContainerPropsInterface {
    settings: ThankYouSettingsInterface;
    woocommerce_settings: ThankYouFormWooCommerceSettingsInterface;
    plan: SettingsFormPropsPlanInterface;
}
declare const ThankYouSettingsForm: React.FC<ThankYouSettingsFormPropsInterface>;
export default ThankYouSettingsForm;
