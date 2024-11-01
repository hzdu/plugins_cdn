import React from 'react';
import SettingsFormContainerPropsInterface from '../../../interfaces/SettingsFormContainerPropsInterface';
import SettingsFormPropsPlanInterface from '../../../interfaces/SettingsFormPropsPlanInterface';
interface AppearanceDesignFormSettingsInterface {
    footer_text_editor_mode: string;
}
interface AppearanceDesignFormParamsInterface {
    font_options: any[];
    template_path: string;
    color_settings: any[];
    color_settings_defaults: any[];
    logo_preview_url: string;
}
interface AppearanceDesignSettingsFormPropsInterface extends SettingsFormContainerPropsInterface {
    settings: AppearanceDesignFormSettingsInterface;
    params: AppearanceDesignFormParamsInterface;
    plan: SettingsFormPropsPlanInterface;
}
declare const AppearanceDesignSettingsForm: React.FC<AppearanceDesignSettingsFormPropsInterface>;
export default AppearanceDesignSettingsForm;
