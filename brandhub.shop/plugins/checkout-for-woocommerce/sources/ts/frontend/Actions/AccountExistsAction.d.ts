import Action from './Action';
/**
 * Ajax does the account exist action. Takes the information from email box and fires of a request to see if the account
 * exists
 */
declare class AccountExistsAction extends Action {
    protected accountExistsClass: string;
    /**
     * @param email
     */
    constructor();
    /**
     *
     * @param resp
     */
    response(resp: any): void;
}
export default AccountExistsAction;
