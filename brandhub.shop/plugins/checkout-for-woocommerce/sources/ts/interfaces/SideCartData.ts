export interface SuggestedProduct {
    productId: number;
    title: string;
    priceHtml: string;
    imageTag: string;
    isVariable: boolean;
    addToCartText: string;
}

export default interface SideCartData {
    is_empty: boolean;
    free_shipping_progress_bar: {
        has_free_shipping: boolean;
        amount_remaining: number;
        fill_percentage: number;
        free_shipping_message: string;
        amount_remaining_message: string;
    };
    suggested_products: SuggestedProduct[];
};
