import Compatibility from '../Compatibility';
declare class KlarnaPayments extends Compatibility {
    constructor();
    load(): void;
    static isKlarnaPaymentsSelected(): boolean;
}
export default KlarnaPayments;
