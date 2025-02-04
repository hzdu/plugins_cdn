export declare const bumpLocations: {
    readonly below_cart_items: true;
    readonly below_side_cart_items: true;
    readonly below_checkout_cart_items: true;
    readonly above_terms_and_conditions: true;
    readonly above_express_checkout: true;
    readonly bottom_information_tab: true;
    readonly bottom_shipping_tab: true;
    readonly below_complete_order_button: true;
    readonly complete_order: true;
};
export type BumpLocation = keyof typeof bumpLocations;
export type Bump = {
    id: number;
    offerProductId: number;
    wrappedThumb: string;
    offerDescription: string;
    offerLanguage: string;
    offerPrice: string;
    variationParent: boolean;
    location: BumpLocation;
    selected: boolean;
};
