import Action from './Action';
declare class UpdateCheckoutAction extends Action {
    private static _underlyingRequest;
    private static _fragments;
    private blockUISelector;
    /**
     * @param fields
     */
    constructor();
    load(data: any, args?: any): void;
    blockUI(selector?: string): void;
    unblockUI(): void;
    /**
     *
     * @param resp
     */
    response(resp: any): void;
    static getGatewayDataClass(element: JQuery<HTMLElement>): string;
    /**
     * @param xhr
     * @param textStatus
     * @param errorThrown
     */
    error(xhr: any, textStatus: string, errorThrown: string): void;
    complete(xhr: any, textStatus: string): void;
    /**
     * Cleanses our beautiful fragments of evil dirty bad stuff
     */
    static cleanseFragments(value: string): string;
    /**
     * @returns {any}
     */
    static get underlyingRequest(): any;
    /**
     * @param value
     */
    static set underlyingRequest(value: any);
}
export default UpdateCheckoutAction;
