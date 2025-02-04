import { RuleType } from '../admin/Components/Metaboxes/Fields/Rules/RuleField';
interface TrustBadgeInterface {
    id: string;
    image: any;
    title: string;
    subtitle: string;
    description: string;
    template: string;
    mode: string;
    rules: RuleType[];
}
export default TrustBadgeInterface;
