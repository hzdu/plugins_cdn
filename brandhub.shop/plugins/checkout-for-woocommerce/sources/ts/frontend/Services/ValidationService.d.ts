type validatorFactory = () => Promise<any>;
type validatorFactoryQueue = Record<string, Array<validatorFactory>>;
declare class ValidationService {
    protected static validatorFactoryQueue: validatorFactoryQueue;
    static load(): void;
    static addValidatorFactory(tab: string, validator: validatorFactory): void;
    static validateTabsBeforeSwitch(): void;
    static validateTab(tab: string, destinationTab: string): void;
    static validateOnFormSubmit(): void;
    static validatePreviousTabs(): void;
    static getValidatorPromisesForTab(tab: string): Promise<any>[];
}
export default ValidationService;
