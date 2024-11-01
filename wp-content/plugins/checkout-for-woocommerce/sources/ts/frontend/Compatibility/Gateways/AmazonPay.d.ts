import Compatibility from '../Compatibility';
declare class AmazonPay extends Compatibility {
    protected timer: any;
    protected iterations: number;
    constructor();
    load(): void;
    clearShadowRoot(): void;
    cleanUpExtraStuff(): void;
}
export default AmazonPay;
