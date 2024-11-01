declare class DataService {
    /**
     * @type {any}
     * @private
     */
    private static _checkoutForm;
    static initRunTimeParams(): void;
    static getSettings(): Record<string, unknown>;
    static getSetting(setting: string): any;
    static getData(key: string): any;
    static updateData(key: string, value: any): void;
    static getMessage(messageKey: string): string;
    static getCompatibilityClass(key: string): CompatibilityClass;
    static getElement(element: string): JQuery<HTMLElement>;
    static getCheckoutParams(): Record<string, unknown>;
    /**
   * @param param
   */
    static getCheckoutParam(param: string): string | boolean | null;
    static getRuntimeParameters(): Record<string, unknown>;
    static getRuntimeParameter(param: string): any;
    static setRuntimeParameter(param: string, value: any): void;
    /**
     * @returns {JQuery}
     */
    static get checkoutForm(): JQuery;
    /**
     * @param {JQuery} value
     */
    static set checkoutForm(value: JQuery);
}
export default DataService;
