import Action from './Action';
declare class AddToCartAction extends Action {
    protected button: JQuery;
    /**
     * @param button
     */
    constructor(button: JQuery);
    /**
     * @param resp
     */
    response(resp: any): void;
    complete(): void;
}
export default AddToCartAction;
