declare class SmartyStreetsAddressValidationService {
    protected userAddress: any;
    protected suggestedAddress: Record<string, unknown> | [];
    protected userHasAcceptedAddress: boolean;
    protected tabChangeDestinationID: any;
    protected addressFieldNamePrefix: string;
    constructor(addressFieldNamePrefix: string);
    static isWrongTabContext(target: any): boolean;
    getAddress(): Record<string, unknown>;
    maybeValidateAddress(event: any, clicked: any, target: any): boolean;
    run(): void;
}
export default SmartyStreetsAddressValidationService;
