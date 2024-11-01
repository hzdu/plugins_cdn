import Actions from '../Types/Actions';
export interface CartCoupon {
    code: string;
    class: string;
    label: string;
    value: string;
}
export interface CartFee {
    label: string;
    value: string;
}
export interface CartTax {
    class: string;
    label: string;
    raw_label: string;
    value: string;
}
interface CartTotal {
    label: string;
    value: string;
}
export interface CartTotalsData {
    actions: Actions;
    subtotal: CartTotal;
    total: CartTotal;
    coupons: CartCoupon[];
    fees: CartFee[];
    taxes: CartTax[];
    shipping?: CartTotal;
    quantity: number;
}
export {};
