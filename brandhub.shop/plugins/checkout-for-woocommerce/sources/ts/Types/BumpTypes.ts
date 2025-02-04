export const bumpLocations = {
    below_cart_items: true,
    below_side_cart_items: true,
    below_checkout_cart_items: true,
    above_terms_and_conditions: true,
    above_express_checkout: true,
    bottom_information_tab: true,
    bottom_shipping_tab: true,
    below_complete_order_button: true,
    complete_order: true,
} as const;

export type BumpLocation = keyof typeof bumpLocations;

export type Bump = {
    id: number;
    offerProductId: number;
    wrappedThumb: string;  // Assuming it's a string of HTML or a URL
    offerDescription: string;
    offerLanguage: string;
    offerPrice: string;
    variationParent: boolean;  // Assuming this is a boolean value
    location: BumpLocation;
    selected: boolean;
};
