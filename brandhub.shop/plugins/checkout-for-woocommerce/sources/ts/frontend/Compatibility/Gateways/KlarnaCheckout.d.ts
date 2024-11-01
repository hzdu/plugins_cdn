import Compatibility from '../Compatibility';
declare class KlarnaCheckout extends Compatibility {
    protected klarna_button_id: string;
    protected show_easy_tabs: boolean;
    constructor();
    load(params: any): void;
    maybeChangeToKco(): void;
    hideWooCouponNotification(): void;
}
export default KlarnaCheckout;
