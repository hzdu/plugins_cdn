import Action from './Action';
declare class CompleteOrderAction extends Action {
    /**
     */
    constructor();
    /**
     * Fire the ajax request
     *
     * Duplicate of Action.ts without the noncache parameter - necessary for PostFinance compatibility
     *
     * @param data
     */
    load(data: any): void;
    /**
     * @param resp
     */
    response(resp: any): void;
    /**
     * Try to fix invalid JSON
     *
     * @param rawResponse
     * @param dataType
     */
    dataFilter(rawResponse: string, dataType: string): any;
    isValidJSON(rawJSON: any): boolean;
    /**
     * @param xhr
     * @param textStatus
     * @param errorThrown
     */
    error(xhr: any, textStatus: string, errorThrown: string): void;
    submitError(): void;
}
export default CompleteOrderAction;
