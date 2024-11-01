import React from 'react';
import SettingsFormContainerPropsInterface from '../../../interfaces/SettingsFormContainerPropsInterface';
import SettingsFormPropsPlanInterface from '../../../interfaces/SettingsFormPropsPlanInterface';
interface OrderBumpsSettingsInterface {
    enable_order_bumps: boolean;
    max_bumps: number;
    max_after_checkout_bumps: number;
}
interface OrderBumpsSettingsFormPropsInterface extends SettingsFormContainerPropsInterface {
    settings: OrderBumpsSettingsInterface;
    plan: SettingsFormPropsPlanInterface;
}
declare const OrderBumpsSettingsForm: React.FC<OrderBumpsSettingsFormPropsInterface>;
export default OrderBumpsSettingsForm;
