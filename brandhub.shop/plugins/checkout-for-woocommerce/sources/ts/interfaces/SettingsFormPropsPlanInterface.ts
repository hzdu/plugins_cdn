interface SettingsFormPropsPlanInterface {
    plan_id: number | null; // Matches the result of UpdatesManager::instance()->get_license_price_id()
    plan_level: number; // Represents the user's plan level from PlanManager::get_user_plan_level()
    labels: {
        required_list: Record<number, string>; // Maps plan levels to their formatted English names
    };
}

export default SettingsFormPropsPlanInterface;
