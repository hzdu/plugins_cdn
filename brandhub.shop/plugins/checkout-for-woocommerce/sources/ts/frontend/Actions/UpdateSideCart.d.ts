import Action from './Action';
declare class UpdateSideCart extends Action {
    protected blockedElements: JQuery;
    protected supportsHTML5Storage: boolean;
    /**
     * @param blockedElements
     */
    constructor(blockedElements: JQuery);
    /**
     *
     * @param resp
     */
    response(resp: any): void;
    /** Set the cart hash in both session and local storage */
    setCartHash(cartHash: string): void;
}
export default UpdateSideCart;
