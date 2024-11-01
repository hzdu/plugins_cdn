import React from 'react';
import SettingsFormContainerPropsInterface from '../../../interfaces/SettingsFormContainerPropsInterface';
import SettingsFormPropsPlanInterface from '../../../interfaces/SettingsFormPropsPlanInterface';
interface TrustBadgeSettingsInterface {
    enable_trust_badges: boolean;
    trust_badge_position: string;
    trust_badges_title: string;
    trust_badges: any[];
}
interface TrustBadgeFormWooCommerceSettingsInterface {
    shipping_methods: any;
}
interface TrustBadgeSettingsFormPropsInterface extends SettingsFormContainerPropsInterface {
    settings: TrustBadgeSettingsInterface;
    woocommerce_settings: TrustBadgeFormWooCommerceSettingsInterface;
    plan: SettingsFormPropsPlanInterface;
    params: any;
}
declare const TrustBadgeSettingsForm: React.FC<TrustBadgeSettingsFormPropsInterface>;
export default TrustBadgeSettingsForm;
