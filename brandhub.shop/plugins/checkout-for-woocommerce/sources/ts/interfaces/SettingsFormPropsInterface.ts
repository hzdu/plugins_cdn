import SettingsFormContainerPropsInterface from './SettingsFormContainerPropsInterface';

interface SettingsFormPropsInterface extends SettingsFormContainerPropsInterface {
    settings: any;
    woocommerce_settings: any;
    conditional_settings: any;
    plan: any;
}

export default SettingsFormPropsInterface;
