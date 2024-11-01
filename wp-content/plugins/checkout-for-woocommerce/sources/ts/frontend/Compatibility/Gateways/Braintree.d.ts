import Compatibility from '../Compatibility';
declare class Braintree extends Compatibility {
    constructor();
    /**
     * Loads the Braintree compatibility class
     *
     * @param {any} params
     */
    load(params: any): void;
    /**
     * Calls the refresh_braintree method on the credit card handler. Resets the state back to default
     */
    creditCardRefresh(): void;
    paypalRefresh(): void;
    savedPaymentMethods(): void;
}
export default Braintree;
