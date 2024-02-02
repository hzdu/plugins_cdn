import UpdateVariableCartItemModal from '../Modals/UpdateVariableCartItemModal';

class EditVariableCartItemService {
    constructor() {
        this.setListeners();
    }

    setListeners(): void {
        jQuery( document.body ).on( 'click', '.cfw-cart-edit-item-variation', ( e ) => {
            const apiRoot = ( <any>window ).wpApiSettings.root;
            const url = `${apiRoot}checkoutwc/v1/get-variation-form/${jQuery( e.currentTarget ).data( 'product' )}?key=${jQuery( e.currentTarget ).data( 'cart-item-key' )}`;

            jQuery.get( url, ( data ) => {
                const modal = new UpdateVariableCartItemModal( data.html ?? 'Could not load product', {}, e );

                modal.open();
            } );
        } );
    }
}

export default EditVariableCartItemService;
