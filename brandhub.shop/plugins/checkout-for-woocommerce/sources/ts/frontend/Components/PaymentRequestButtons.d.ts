declare class PaymentRequestButtons {
    private expressButtonContainer;
    private expressButtonSeparator;
    constructor();
    showExpressButtons(): void;
    maybeShowExpressButtons(): boolean;
    hasButtons(): boolean;
}
export default PaymentRequestButtons;
