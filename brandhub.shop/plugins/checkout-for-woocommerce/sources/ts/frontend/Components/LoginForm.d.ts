import AccountExistsAction from '../Actions/AccountExistsAction';
declare class LoginForm {
    private readonly _debounceAccountExists;
    protected accountExistsAction: AccountExistsAction;
    protected lastEmailValue: string;
    constructor();
    setListeners(): void;
    setLoginModalListener(): void;
    setAccountCheckListener(): void;
    triggerAccountExistsCheck(): void;
    setCreateAccountCheckboxListener(): void;
    static hideCreatePasswordField(): void;
    static showCreatePasswordField(): void;
}
export default LoginForm;
