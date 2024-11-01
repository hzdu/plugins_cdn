import AdminPageContextInterface from '../../interfaces/AdminPageContextInterface';
interface TrustBadgeAdminContextInterface extends AdminPageContextInterface {
    badges: any;
    isEnabled: boolean;
    outputLocation: string;
    introductionText: string;
    setBadges: (badges: any) => void;
    setIsEnabled: (enabled: boolean) => void;
    setOutputLocation: (outputLocation: string) => void;
    setIntroductionText: (introductionText: string) => void;
}
declare const TrustBadgeAdminContext: import("react").Context<TrustBadgeAdminContextInterface>;
export default TrustBadgeAdminContext;
