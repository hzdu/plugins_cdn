import Compatibility from '../Compatibility';
declare class Stripe extends Compatibility {
    constructor();
    load(): void;
    static onError(): void;
}
export default Stripe;
