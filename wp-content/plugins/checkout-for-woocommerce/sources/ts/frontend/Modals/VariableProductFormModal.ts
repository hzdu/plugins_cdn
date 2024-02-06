import AbstractComposableModal from './AbstractComposableModal';

class VariableProductFormModal extends AbstractComposableModal  {
    constructor( content: string, args: any = {} ) {
        jQuery( document.body ).on( 'show_variation', ( event, variation, purchasable ) => {
            if ( !jQuery( event.target ).parents( '.cfw-modaal' ).length ) {
                return;
            }

            const confirmButton = jQuery( '.cfw-modaal .modaal-confirm-btn.modaal-ok' );
            const addToCartButton = jQuery( '.cfw-modaal .single_add_to_cart_button' );

            if ( purchasable ) {
                confirmButton.prop( 'disabled', false );
                addToCartButton.prop( 'disabled', false );
                return;
            }

            confirmButton.prop( 'disabled', true );
            addToCartButton.prop( 'disabled', true );
        } );

        jQuery( document.body ).on( 'reset_data', ( event ) => {
            if ( !jQuery( event.target ).parents( '.cfw-modaal' ).length ) {
                return;
            }

            const confirmButton = jQuery( '.cfw-modaal .modaal-confirm-btn.modaal-ok' );

            confirmButton.prop( 'disabled', true );
            jQuery( '.cfw-modaal .single_add_to_cart_button' ).prop( 'disabled', true );
        } );

        super( content, {
            ...args,
        } );

        jQuery( document.body ).on( 'woocommerce_variation_has_changed', '.cfw-modaal form', this.syncPrice.bind( this )  );
        jQuery( document.body ).on( 'wc_variation_form', '.cfw-modaal form', this.syncPrice.bind( this )  );
    }

    afterOpen(): void {
        const form = jQuery( `#${this.id}-content-wrapper form.cfw-product-form-modal.variable` );
        form.wc_variation_form();
    }

    syncPrice( e: Event ): void {
        const form = jQuery( e.currentTarget );

        const updatedPrice = form.find( '.single_variation_wrap .woocommerce-variation-price' ).html();

        if ( updatedPrice ) {
            form.find( '.cfw-product-form-modal-price' ).html( updatedPrice );
        }
    }
}

export default VariableProductFormModal;
