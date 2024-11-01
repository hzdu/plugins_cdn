import CartItemInterface from '../../interfaces/CartItemInterface';
import Actions from '../../Types/Actions';
import { CartTotalsData } from '../../interfaces/CartTotalInterface';
import { Bump } from '../../Types/BumpTypes';
import ReviewPaneDataInterface from '../Interfaces/ReviewPaneDataInterface';
import SideCartData from '../../interfaces/SideCartData';
import { ShippingPackageInterface } from '../../interfaces/ShippingPackageInterface';
export interface CartStoreStateInterface {
    cartIsEmpty: boolean;
    cartNeedsPayment: boolean;
    cartItems: CartItemInterface[];
    cartActions: Actions;
    cartStaticActions: Actions;
    cartTotals: CartTotalsData;
    cartNotices: string;
    orderBumps: Bump[];
    reviewData: ReviewPaneDataInterface;
    sideCartData: SideCartData;
    shippingData: ShippingPackageInterface[];
}
declare const CartStore: import("@wordpress/data/build-types/types").StoreDescriptor<import("@wordpress/data/build-types/types").ReduxStoreConfig<unknown, {
    setCartIsEmpty(cartIsEmpty: boolean): {
        type: string;
        cartIsEmpty: boolean;
    };
    setCartNeedsPayment(cartNeedsPayment: boolean): {
        type: string;
        cartNeedsPayment: boolean;
    };
    setCartItems(cartItems: CartItemInterface[]): {
        type: string;
        cartItems: CartItemInterface[];
    };
    setCartStaticActions(cartStaticActions: Actions): {
        type: string;
        cartStaticActions: Actions;
    };
    setCartActions(cartActions: Actions): {
        type: string;
        cartActions: Actions;
    };
    setCartTotals(cartTotals: CartTotalsData): {
        type: string;
        cartTotals: CartTotalsData;
    };
    setCartNotices(cartNotices: string): {
        type: string;
        cartNotices: string;
    };
    setOrderBumps(orderBumps: Bump[]): {
        type: string;
        orderBumps: Bump[];
    };
    setReviewData(reviewData: ReviewPaneDataInterface): {
        type: string;
        reviewData: ReviewPaneDataInterface;
    };
    setSideCartData(sideCartData: SideCartData): {
        type: string;
        sideCartData: SideCartData;
    };
    setShippingData(shippingData: ShippingPackageInterface[]): {
        type: string;
        shippingData: ShippingPackageInterface[];
    };
}, {
    getCartIsEmpty(state: CartStoreStateInterface): boolean;
    getCartNeedsPayment(state: CartStoreStateInterface): boolean;
    getCartItems(state: CartStoreStateInterface): CartItemInterface[];
    getCartStaticActions(state: CartStoreStateInterface): Actions;
    getCartActions(state: CartStoreStateInterface): Actions;
    getCartTotals(state: CartStoreStateInterface): CartTotalsData;
    getCartNotices(state: CartStoreStateInterface): string;
    getOrderBumps(state: CartStoreStateInterface): Bump[];
    getReviewData(state: CartStoreStateInterface): ReviewPaneDataInterface;
    getSideCartData(state: CartStoreStateInterface): SideCartData;
    getShippingData(state: CartStoreStateInterface): ShippingPackageInterface[];
}>>;
export default CartStore;
