declare class AccountValidation {
    static load(): void;
    static getValidatorFactory(): () => Promise<any>;
    static addAlert(): void;
    static accountDoesNotExistOrLoginIsNotRequired(): boolean;
}
export default AccountValidation;
