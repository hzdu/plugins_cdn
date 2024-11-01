/**
 * Base class for our ajax handling. Child classes will extend this and override the response function and implement their
 * own custom solutions for the php side of actions
 */
declare abstract class Action {
    /**
     * @type {string}
     * @private
     */
    protected id: string;
    /**
     * @param id
     */
    protected constructor(id: string);
    /**
     * Fire the ajax request
     *
     * @param data
     */
    load(data: any): void;
    static isValidJSON(rawJSON: string): boolean;
    /**
     * Our ajax response handler. Overridden in child classes
     * @param resp
     */
    abstract response(resp: any): void;
    /**
     * Our ajax error handler. Overridden in child classes
     * @param xhr
     * @param textStatus
     * @param errorThrown
     */
    error(xhr: any, textStatus: string, errorThrown: string): void;
    complete(xhr: any, textStatus: string): void;
}
export default Action;
