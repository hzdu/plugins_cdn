import Compatibility from '../Compatibility';
declare class WooCommercePayments extends Compatibility {
    constructor();
    load(): void;
    static onError(): void;
}
export default WooCommercePayments;
