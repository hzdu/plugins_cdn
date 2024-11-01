import CartItemInterface from '../interfaces/CartItemInterface';
import { CartTotalsData } from '../interfaces/CartTotalInterface';
import Actions from '../Types/Actions';
import ReviewPaneDataInterface from './Interfaces/ReviewPaneDataInterface';
import { Bump } from '../Types/BumpTypes';
import SideCartData from '../interfaces/SideCartData';
import { ShippingPackageInterface } from '../interfaces/ShippingPackageInterface';
interface UpdateDataInterface {
    cart?: {
        isEmpty?: boolean;
        needsPayment?: boolean;
        items?: CartItemInterface[];
        totals?: CartTotalsData;
        staticActions?: Actions;
        actions?: Actions;
        notices?: string;
        shipping: ShippingPackageInterface[];
    };
    side_cart?: SideCartData;
    review?: ReviewPaneDataInterface;
    bumps?: Bump[];
}
declare class DataStores {
    static cart_store_key: string;
    static hasInitialized: boolean;
    static init(): void;
    static tryToUpdateDataStoreFromLocalStorage(): boolean;
    static supportsHTML5Storage(): boolean;
    /**
     * Updates data store with data from AJAX response
     *
     * Does NOT update actions store
     */
    static updateDataStore(data: UpdateDataInterface, updateStaticActions?: boolean): void;
}
export default DataStores;
