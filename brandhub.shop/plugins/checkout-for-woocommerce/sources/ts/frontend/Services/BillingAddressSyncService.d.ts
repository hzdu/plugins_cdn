declare class BillingAddressSyncService {
    static load(): void;
    static listenForShippingChanges(): void;
    static listenForBillingChanges(): void;
    static listenForSameAsShippingToggle(): void;
    static maybeSyncShippingAddressToBillingAddress(): void;
    static maybeRestoreSessionValueToBillingAddress(): void;
    /**
     *
     * @param srcField
     * @param destField
     */
    static syncField(srcField: JQuery<HTMLElement>, destField: JQuery<HTMLElement>): void;
}
export default BillingAddressSyncService;
