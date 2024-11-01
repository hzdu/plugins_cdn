import React from 'react';
import SettingsFormContainerPropsInterface from '../../../interfaces/SettingsFormContainerPropsInterface';
import SettingsFormPropsPlanInterface from '../../../interfaces/SettingsFormPropsPlanInterface';
interface AdvancedScriptsSettingsInterface {
    header_scripts: string;
    footer_scripts: string;
    php_snippets: string;
    header_scripts_checkout: string;
    footer_scripts_checkout: string;
    header_scripts_thank_you: string;
    footer_scripts_thank_you: string;
    header_scripts_order_pay: string;
    footer_scripts_order_pay: string;
}
interface AdvancedScriptsSettingsFormPropsInterface extends SettingsFormContainerPropsInterface {
    settings: AdvancedScriptsSettingsInterface;
    plan: SettingsFormPropsPlanInterface;
}
declare const AdvancedScriptsSettingsForm: React.FC<AdvancedScriptsSettingsFormPropsInterface>;
export default AdvancedScriptsSettingsForm;
