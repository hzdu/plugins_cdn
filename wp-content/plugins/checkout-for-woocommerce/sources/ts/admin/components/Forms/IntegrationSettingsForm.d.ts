import React from 'react';
import SettingsFormContainerPropsInterface from '../../../interfaces/SettingsFormContainerPropsInterface';
import SettingsFormPropsPlanInterface from '../../../interfaces/SettingsFormPropsPlanInterface';
interface IntegrationsSettingsInterface {
    google_places_api_key: string;
}
interface IntegrationsSettingsFormPropsInterface extends SettingsFormContainerPropsInterface {
    settings: IntegrationsSettingsInterface;
    integrations: any[];
    plan: SettingsFormPropsPlanInterface;
}
declare const IntegrationsSettingsForm: React.FC<IntegrationsSettingsFormPropsInterface>;
export default IntegrationsSettingsForm;
