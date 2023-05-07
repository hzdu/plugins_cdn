import { cfwDomReady }             from './_functions';
import AddToCart                   from './frontend/Components/AddToCart';
import CartItemQuantityControl     from './frontend/Components/CartItemQuantityControl';
import SideCart                    from './frontend/Components/SideCart';
import EditVariableCartItemService from './frontend/Services/EditVariableCartItemService';
import OrderBumpService            from './frontend/Services/OrderBumpService';

cfwDomReady( () => {
    new CartItemQuantityControl();
    new AddToCart();
    new SideCart();
    new OrderBumpService();
    new EditVariableCartItemService();
} );
