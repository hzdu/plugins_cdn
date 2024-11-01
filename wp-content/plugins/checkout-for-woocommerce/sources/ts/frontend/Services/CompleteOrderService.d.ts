declare class CompleteOrderService {
    constructor();
    setCheckoutErrorHandler(): void;
    setCompleteOrderListener(): void;
    /**
     * Kick off complete order
     */
    static completeOrderSubmitHandler(): boolean;
}
export default CompleteOrderService;
