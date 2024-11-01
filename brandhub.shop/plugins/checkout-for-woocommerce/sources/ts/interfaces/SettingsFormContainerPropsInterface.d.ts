interface SettingsFormContainerPropsInterface {
    saveSettings: (values: any) => Promise<void>;
    isLoading: boolean;
    searchTerm?: string;
}
export default SettingsFormContainerPropsInterface;
