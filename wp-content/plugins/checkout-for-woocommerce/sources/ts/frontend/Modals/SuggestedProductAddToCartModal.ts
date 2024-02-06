import cfwAjax                  from '../../functions/cfwAjax';
import VariableProductFormModal from './VariableProductFormModal';
import jqXHR = JQuery.jqXHR;

class SuggestedProductAddToCartModal extends VariableProductFormModal {
    constructor( content: string, args: any = {} ) {
        super( content, {
            type: 'inline',
            ...args,
        } );

        jQuery( document.body ).on( 'submit', `#${this.id}-content-wrapper form.cfw-product-form-modal.variable`, this.handleBumpFormSubmit.bind( this )  );
        jQuery( document.body ).on( 'woocommerce_variation_has_changed', 'form.cfw-product-form-modal', this.syncPrice.bind( this )  );
        jQuery( document.body ).on( 'wc_variation_form', 'form.cfw-product-form-modal', this.syncPrice.bind( this )  );
    }

    handleBumpFormSubmit = ( e: Event ): jqXHR => {
        e.preventDefault();

        const form = jQuery( e.currentTarget );

        const button = form.find( 'button[type="submit"]' );
        const productData = form.serializeArray();
        let hasProductId = false;

        // Check for woocommerce custom quantity code
        // https://docs.woocommerce.com/document/override-loop-template-and-show-quantities-next-to-add-to-cart-buttons/
        jQuery.each( productData, ( key, formItem ) => {
            if ( formItem.name === 'productID' || formItem.name === 'add-to-cart' ) {
                if ( formItem.value ) {
                    hasProductId = true;
                    return false;
                }
            }

            return true;
        } );

        let productID: string | boolean = false;

        // If no product id found , look for the form action URL
        if ( !hasProductId && form.attr( 'action' ) ) {
            const isUrl = form.attr( 'action' ).match( /add-to-cart=([0-9]+)/ );
            productID = isUrl ? isUrl[ 1 ] : false;
        }

        // if button as name add-to-cart get it and add to form
        if ( button.attr( 'name' ) && button.attr( 'name' ) === 'add-to-cart' && button.attr( 'value' ) ) {
            productID = button.attr( 'value' );
        }

        if ( productID ) {
            productData.push( { name: 'add-to-cart', value: productID } );
        }

        button.addClass( 'loading' );

        // Trigger event.
        jQuery( document.body ).trigger( 'adding_to_cart', [ button, productData ] );

        return cfwAjax( 'cfw_add_to_cart', {
            type: 'POST',
            data: productData,
            dataType: 'json',
            cache: false,
        } ).done(
            ( resp ) => {
                jQuery( document.body ).trigger( 'cfw_order_bump_variation_added_to_cart', [ resp ] );
            },
        ).always( () => {
            this.close();
        } );
    }

    syncPrice( e: Event ): void {
        const form = jQuery( e.currentTarget );

        const updatedPrice = form.find( '.single_variation_wrap .woocommerce-variation-price' ).html();

        if ( updatedPrice ) {
            form.find( '.cfw-product-form-modal-price' ).html( updatedPrice );
        }
    }
}

export default SuggestedProductAddToCartModal;
