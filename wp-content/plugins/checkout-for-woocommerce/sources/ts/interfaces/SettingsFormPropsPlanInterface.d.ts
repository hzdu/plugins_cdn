interface SettingsFormPropsPlanInterface {
    plan_id: number | null;
    plan_level: number;
    labels: {
        required_list: Record<number, string>;
    };
}
export default SettingsFormPropsPlanInterface;
