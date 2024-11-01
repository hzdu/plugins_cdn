import Compatibility from '../Compatibility';
declare class OwnID extends Compatibility {
    private params;
    constructor();
    load(params: any): void;
    maybeInitOwnID(): void;
    maybeInitOrderPayOwnID(): void;
}
export default OwnID;
