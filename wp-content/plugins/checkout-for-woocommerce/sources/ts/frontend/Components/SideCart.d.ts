declare class SideCart {
    constructor();
    setDataStoreListeners(): void;
    setTriggers(): void;
    maybeOpenCartOrShakeButton(): void;
    static tryToGetDataFromLocalStorage(): void;
    shakeCartButton(): void;
    static maybeOpenCart(e?: KeyboardEvent): void;
    static openCart(e?: Event): void;
    static closeCart(e?: Event): void;
    processCartUpdates(): void;
    static supportsHTML5Storage(): boolean;
}
export default SideCart;
