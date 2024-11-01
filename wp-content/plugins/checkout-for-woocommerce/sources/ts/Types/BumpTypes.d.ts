export type BumpLocation = 'below_cart_items' | 'below_side_cart_items' | 'below_checkout_cart_items' | 'above_terms_and_conditions' | 'above_express_checkout' | 'bottom_information_tab' | 'bottom_shipping_tab' | 'below_complete_order_button' | 'complete_order';
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
