import Actions from '../Types/Actions';
interface CartItemInterface {
    item_key: string;
    thumbnail: string;
    quantity: number;
    title: string;
    url: string;
    subtotal: string;
    hide_remove_item: boolean;
    row_class: string;
    data: Array<{
        key: string;
        value: any;
    }>;
    formatted_data: string;
    disable_cart_editing: boolean;
    disable_cart_editing_at_checkout: boolean;
    disable_cart_variation_editing: boolean;
    max_quantity: number;
    min_quantity: number;
    step: number;
    product_title: string;
    product_sku: string;
    product_id: number;
    product_parent_id: number;
    has_quantity_override: boolean;
    discount_html: string;
    actions: Actions;
}
export default CartItemInterface;
