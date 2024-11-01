import ClickEvent = JQuery.ClickEvent;
declare class PaymentGatewaysService {
    private _selectedGateway;
    constructor();
    /**
     * Find the selected payment gateway and trigger a click
     *
     * Some gateways look for a click action to init themselves properly
     */
    initSelectedPaymentGateway(): void;
    paymentGatewayChangeHandler(e: ClickEvent): void;
}
export default PaymentGatewaysService;
