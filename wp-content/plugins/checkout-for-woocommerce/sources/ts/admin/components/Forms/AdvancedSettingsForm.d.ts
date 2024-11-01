import React from 'react';
import SettingsFormContainerPropsInterface from '../../../interfaces/SettingsFormContainerPropsInterface';
import SettingsFormPropsPlanInterface from '../../../interfaces/SettingsFormPropsPlanInterface';
interface AdvancedSettingsInterface {
    template_loader: string;
    enable_beta_version_updates: boolean;
    hide_admin_bar_button: boolean;
    enable_debug_log: boolean;
    allow_tracking: string;
    allow_uninstall: boolean;
}
interface AdvancedFormParamsInterface {
    allow_tracking_hash: string;
}
interface AdvancedSettingsFormPropsInterface extends SettingsFormContainerPropsInterface {
    settings: AdvancedSettingsInterface;
    params: AdvancedFormParamsInterface;
    plan: SettingsFormPropsPlanInterface;
}
declare const AdvancedSettingsForm: React.FC<AdvancedSettingsFormPropsInterface>;
export default AdvancedSettingsForm;
