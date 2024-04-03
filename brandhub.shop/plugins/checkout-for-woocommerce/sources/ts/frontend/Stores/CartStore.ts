import { createReduxStore }         from '@wordpress/data';
import fastDeepEqual                from 'fast-deep-equal';
import CartItemInterface            from '../../interfaces/CartItemInterface';
import Actions                      from '../../Types/Actions';
import { CartTotalsData }           from '../../interfaces/CartTotalInterface';
import { Bump }                     from '../../Types/BumpTypes';
import ReviewPaneDataInterface      from '../Interfaces/ReviewPaneDataInterface';
import SideCartData                 from '../../interfaces/SideCartData';
import { ShippingPackageInterface } from '../../interfaces/ShippingPackageInterface';

// Define the combined state type
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

// Default state
const DEFAULT_STATE: CartStoreStateInterface = {
    cartIsEmpty: true,
    cartNeedsPayment: false,
    cartItems: [],
    cartActions: {},
    cartStaticActions: {},
    cartTotals: null,
    cartNotices: '',
    orderBumps: [],
    reviewData: null,
    sideCartData: null,
    shippingData: null,
};

// Combined reducer
const reducer = ( state = DEFAULT_STATE, action: any ): CartStoreStateInterface => {
    switch ( action.type ) {
        case 'SET_CART_IS_EMPTY':
            if ( fastDeepEqual( state.cartIsEmpty, action.cartIsEmpty ) ) {
                return state;
            }
            return {
                ...state,
                cartIsEmpty: action.cartIsEmpty,
            };
        case 'SET_CART_NEEDS_PAYMENT':
            if ( fastDeepEqual( state.cartNeedsPayment, action.cartNeedsPayment ) ) {
                return state;
            }
            return {
                ...state,
                cartNeedsPayment: action.cartNeedsPayment,
            };
        case 'SET_CART_ITEMS':
            if ( fastDeepEqual( state.cartItems, action.cartItems ) ) {
                return state;
            }
            return {
                ...state,
                cartItems: action.cartItems,
            };
        case 'SET_CART_STATIC_ACTIONS':
            if ( fastDeepEqual( state.cartStaticActions, action.cartStaticActions ) ) {
                return state;
            }
            return {
                ...state,
                cartStaticActions: action.cartStaticActions,
            };
        case 'SET_CART_ACTIONS':
            if ( fastDeepEqual( state.cartActions, action.cartActions ) ) {
                return state;
            }
            return {
                ...state,
                cartActions: action.cartActions,
            };
        case 'SET_CART_TOTALS':
            if ( fastDeepEqual( state.cartTotals, action.cartTotals ) ) {
                return state;
            }
            return {
                ...state,
                cartTotals: action.cartTotals,
            };
        case 'SET_CART_NOTICES':
            if ( fastDeepEqual( state.cartNotices, action.cartNotices ) ) {
                return state;
            }
            return {
                ...state,
                cartNotices: action.cartNotices,
            };
        case 'SET_ORDER_BUMPS':
            if ( fastDeepEqual( state.orderBumps, action.orderBumps ) ) {
                return state;
            }
            return {
                ...state,
                orderBumps: action.orderBumps,
            };
        case 'SET_REVIEW_DATA':
            if ( fastDeepEqual( state.reviewData, action.reviewData ) ) {
                return state;
            }
            return {
                ...state,
                reviewData: action.reviewData,
            };
        case 'SET_SIDE_CART_DATA':
            if ( fastDeepEqual( state.sideCartData, action.sideCartData ) ) {
                return state;
            }
            return {
                ...state,
                sideCartData: action.sideCartData,
            };
        case 'SET_SHIPPING_DATA':
            if ( fastDeepEqual( state.shippingData, action.shippingData ) ) {
                return state;
            }
            return {
                ...state,
                shippingData: action.shippingData,
            };
        default:
            return state;
    }
};

// Combined actions
const actions = {
    setCartIsEmpty( cartIsEmpty: boolean ) {
        return {
            type: 'SET_CART_IS_EMPTY',
            cartIsEmpty,
        };
    },
    setCartNeedsPayment( cartNeedsPayment: boolean ) {
        return {
            type: 'SET_CART_NEEDS_PAYMENT',
            cartNeedsPayment,
        };
    },
    setCartItems( cartItems: CartItemInterface[] ) {
        return {
            type: 'SET_CART_ITEMS',
            cartItems,
        };
    },
    setCartStaticActions( cartStaticActions: Actions ) {
        return {
            type: 'SET_CART_STATIC_ACTIONS',
            cartStaticActions,
        };
    },
    setCartActions( cartActions: Actions ) {
        return {
            type: 'SET_CART_ACTIONS',
            cartActions,
        };
    },
    setCartTotals( cartTotals: CartTotalsData ) {
        return {
            type: 'SET_CART_TOTALS',
            cartTotals,
        };
    },
    setCartNotices( cartNotices: string ) {
        return {
            type: 'SET_CART_NOTICES',
            cartNotices,
        };
    },
    setOrderBumps( orderBumps: Bump[] ) {
        return {
            type: 'SET_ORDER_BUMPS',
            orderBumps,
        };
    },
    setReviewData( reviewData: ReviewPaneDataInterface ) {
        return {
            type: 'SET_REVIEW_DATA',
            reviewData,
        };
    },
    setSideCartData( sideCartData: SideCartData ) {
        return {
            type: 'SET_SIDE_CART_DATA',
            sideCartData,
        };
    },
    setShippingData( shippingData: ShippingPackageInterface[] ) {
        return {
            type: 'SET_SHIPPING_DATA',
            shippingData,
        };
    },
};

// Combined selectors
const selectors = {
    getCartIsEmpty( state: CartStoreStateInterface ) {
        return state.cartIsEmpty;
    },
    getCartNeedsPayment( state: CartStoreStateInterface ) {
        return state.cartNeedsPayment;
    },
    getCartItems( state: CartStoreStateInterface ) {
        return state.cartItems;
    },
    getCartStaticActions( state: CartStoreStateInterface ) {
        return state.cartStaticActions;
    },
    getCartActions( state: CartStoreStateInterface ) {
        return state.cartActions;
    },
    getCartTotals( state: CartStoreStateInterface ) {
        return state.cartTotals;
    },
    getCartNotices( state: CartStoreStateInterface ) {
        return state.cartNotices;
    },
    getOrderBumps( state: CartStoreStateInterface ) {
        return state.orderBumps;
    },
    getReviewData( state: CartStoreStateInterface ) {
        return state.reviewData;
    },
    getSideCartData( state: CartStoreStateInterface ) {
        return state.sideCartData;
    },
    getShippingData( state: CartStoreStateInterface ) {
        return state.shippingData;
    },
};

// Create the combined store
const CartStore = createReduxStore( 'cfw-cart-store', {
    reducer,
    actions,
    selectors,
} );

export default CartStore;
