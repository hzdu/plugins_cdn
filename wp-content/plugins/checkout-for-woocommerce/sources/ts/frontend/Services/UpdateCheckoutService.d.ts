import CartItemInterface from '../../interfaces/CartItemInterface';
declare class UpdateCheckoutService {
    protected static timer: any;
    static load(): void;
    static queueUpdateCheckout(e?: any, args?: any): true;
    /**
     * All update_checkout triggers should happen here
     *
     * Exceptions would be edge cases involving TS compat classes
     */
    static setUpdateCheckoutTriggers(): void;
    /**
     * reset the update checkout timer (stop iteration)
     */
    static resetUpdateCheckoutTimer(): void;
    static maybeUpdateCheckout(args?: any): void;
    /**
     * Call update_checkout
     *
     * This should be the ONLY place we call this ourselves
     */
    static triggerUpdateCheckout(args?: any): void;
    /**
     * Call updated_checkout
     *
     * This should be the ONLY place we call this ourselves
     */
    static triggerUpdatedCheckout(data?: any): void;
    /**
     * @param args
     */
    static getData(args?: any): Record<string, unknown>;
    static haveQuantitiesChanged: (items1: CartItemInterface[], items2: CartItemInterface[]) => boolean;
}
export default UpdateCheckoutService;
