declare abstract class Compatibility {
    protected key: any;
    /**
   * @param key Unique string matching localized json from server.
   */
    protected constructor(key: string);
    /**
     * Literally anything function. Runs user code.
     *
     * @param {any} params Params for the child class to run on load
     */
    abstract load(params: any): void;
    /**
     * Dynamic Load
     *
     * Given an array of active class objects { class: name, params: ... },
     * init and load this compatibility class if found in active array.
     * It is assumed a class could not have more than one instance inside the activeClasses array.
     */
    maybeLoad(): void;
}
export default Compatibility;
