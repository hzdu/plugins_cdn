import cfwAjax                  from '../../functions/cfwAjax';
import DataService              from '../Services/DataService';
import VariableProductFormModal from './VariableProductFormModal';
import ClickEvent = JQuery.ClickEvent;

class UpdateVariableCartItemModal extends VariableProductFormModal {
    constructor( content: string, args: any = {}, e: ClickEvent ) {
        super( content, {
            ...args,
            confirm_callback: () => {
                const form = jQuery( `#${this.id}-content-wrapper form.cfw-product-form-modal` );
                let productData = form.serializeArray();

                if ( jQuery( e.currentTarget ).data( 'cart-item-key' ) ) {
                    productData.push( { name: 'key', value: jQuery( e.currentTarget ).data( 'cart-item-key' ) } );
                }

                productData = productData.filter( ( item ) => item.name !== 'add-to-cart' );

                return cfwAjax( 'update_cart_item_variation', {
                    type: 'POST',
                    data: productData,
                    dataType: 'json',
                    cache: false,
                } ).done(
                    ( resp ) => {
                        jQuery( document.body ).trigger( 'cfw_cart_item_variation_edited', [ resp ] );
                    },
                ).always( () => {
                    this.close();
                } );
            },
            confirm_button_text: DataService.getMessage( 'update_cart_item_variation_button' ),
            confirm_cancel_button_text: DataService.getMessage( 'cancel_button_label' ),
        } );
    }
}

export default UpdateVariableCartItemModal;
