declare class Pickup {
    protected static documentBody: JQuery<HTMLElement>;
    protected static shippingAddress: JQuery<HTMLElement>;
    protected static pickupLocationWrap: JQuery<HTMLElement>;
    protected static billingFieldsContainer: JQuery<HTMLElement>;
    protected static shippingMethodBreadcrumb: JQuery<HTMLElement>;
    constructor();
    setTriggers(): void;
    static showContent(target: any): void;
}
export default Pickup;
