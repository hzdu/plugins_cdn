/**
 *
 */
declare class TabService {
    /**
     * @type {any}
     * @private
     */
    static tabContainer: JQuery<any>;
    static tabsLoaded: boolean;
    /**
     * @type {any}
     * @private
     */
    private static tabBreadcrumbContainer;
    /**
     * @type string
     * @private
     */
    private static _customerInformationTabId;
    /**
     * @type string
     * @private
     */
    private static _shippingMethodTabId;
    /**
     * @type string
     * @private
     */
    private static _paymentMethodTabId;
    /**
     * @type string
     * @private
     */
    private static _orderReviewTabId;
    static load(): void;
    /**
     * Maybe load the tabs. Returns true if tabs loaded, otherwise returns false
     *
     * @return boolean
     */
    static maybeLoadTabs(): boolean;
    /**
     * Returns the current and target tab indexes
     *
     * @returns JQuery<HTMLElement>
     */
    static getCurrentTab(): JQuery<HTMLElement>;
    static setTabButtonListeners(): void;
    static setTabChangeListeners(): void;
    static maybeScrollToTop(): void;
    /**
     * Set active tab class on form
     */
    static setActiveTabClass(): void;
    /**
     * @param {string} tabId
     */
    static go(tabId: any): void;
    static get customerInformationTabId(): string;
    static get shippingMethodTabId(): string;
    static get paymentMethodTabId(): string;
    static get orderReviewTabId(): string;
}
export default TabService;
