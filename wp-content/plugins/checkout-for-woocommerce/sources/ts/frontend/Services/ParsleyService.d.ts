import FieldValidationRefresher from '../Interfaces/FieldValidationRefresher';
import jqXHR = JQuery.jqXHR;
declare class ParsleyService implements FieldValidationRefresher {
    private static _instance;
    private constructor();
    static get instance(): ParsleyService;
    /**
     * @type {any}
     * @private
     */
    private _parsley;
    private _debouncedParsleyRefresh;
    static xhrCache: Record<string, jqXHR<any>>;
    load(): void;
    setParsleyValidators(): void;
    queueRefreshParsley(): void;
    refreshParsley(): void;
    destroy(): void;
    /**
     * refreshField
     *
     * The input event is what Parsley is listening for.
     *
     * @param {Array<HTMLElement>} elements
     */
    refreshField(...elements: HTMLElement[]): void;
    /**
     * @returns {any}
     */
    get parsley(): any;
    /**
     * @param value
     */
    set parsley(value: any);
}
export default ParsleyService;
