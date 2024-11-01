import Compatibility from '../Compatibility';
declare class AmazonPayLegacy extends Compatibility {
    constructor();
    load(): void;
    toggleCreateAccount(): void;
    cleanUpExtraStuff(): void;
}
export default AmazonPayLegacy;
