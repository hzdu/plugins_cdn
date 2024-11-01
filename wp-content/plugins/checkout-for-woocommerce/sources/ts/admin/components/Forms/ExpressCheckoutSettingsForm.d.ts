import React from 'react';
import SettingsFormContainerPropsInterface from '../../../interfaces/SettingsFormContainerPropsInterface';
import SettingsFormPropsPlanInterface from '../../../interfaces/SettingsFormPropsPlanInterface';
interface ExpressCheckoutSettingsInterface {
    disable_express_checkout: boolean;
}
interface ExpressCheckoutSettingsFormPropsInterface extends SettingsFormContainerPropsInterface {
    settings: ExpressCheckoutSettingsInterface;
    plan: SettingsFormPropsPlanInterface;
    params: any;
}
declare const ExpressCheckoutSettingsForm: React.FC<ExpressCheckoutSettingsFormPropsInterface>;
export default ExpressCheckoutSettingsForm;
