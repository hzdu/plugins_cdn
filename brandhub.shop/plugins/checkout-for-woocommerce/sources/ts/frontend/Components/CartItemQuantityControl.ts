import cfwGetWPHooks         from '../../functions/cfwGetWPHooks';
import DataService           from '../Services/DataService';

class CartItemQuantityControl {
    constructor() {
        this.setQuantityStepperTriggers();
        this.setQuantityPromptTriggers();
        this.setItemRemoveLinkTriggers();
    }

    setQuantityStepperTriggers(): void {
        jQuery( document.body ).on( 'click', '.cfw-quantity-stepper-btn-minus', ( event ) => {
            const element = jQuery( event.currentTarget );
            const quantityValue = element.siblings( '.cfw-edit-item-quantity-value' ).first();
            const quantityStepperLabel = element.parents( '.cart-item-row' ).find( '.cfw-cart-item-quantity-bubble' ).first();
            const quantityLabel = element.siblings( '.cfw-quantity-stepper-value-label' ).first();
            let newQuantity = Number( quantityValue.val() ) - Number( jQuery( quantityValue ).data( 'step' ) );
            const minQuantity = Number( jQuery( quantityValue ).data( 'min-value' ) );

            if ( newQuantity > 0 && newQuantity < minQuantity ) {
                newQuantity = minQuantity;
            }

            if ( newQuantity > 0 || ( <any>window ).confirm( DataService.getMessage( 'delete_confirm_message' ) ) ) {
                quantityValue.val( newQuantity );
                quantityLabel.text( newQuantity );
                quantityStepperLabel.text( newQuantity );

                CartItemQuantityControl.triggerCartUpdate( element );
            }

            event.preventDefault();
            return false;
        } );

        jQuery( document.body ).on( 'click', '.cfw-quantity-stepper-btn-plus:not(.maxed)', ( event ) => {
            const element = jQuery( event.currentTarget );
            const quantityValue = element.siblings( '.cfw-edit-item-quantity-value' ).first();
            const quantityStepperLabel = element.siblings( '.cfw-quantity-stepper-value-label' ).first();
            const quantityLabel = element.parents( '.cart-item-row' ).find( '.cfw-cart-item-quantity-bubble' ).first();
            const maxQuantity = Number( jQuery( quantityValue ).data( 'max-quantity' ) );
            let newQuantity = Number( quantityValue.val() ) + Number( jQuery( quantityValue ).data( 'step' ) );

            if ( newQuantity > maxQuantity ) {
                newQuantity = maxQuantity;
            }

            if ( newQuantity <= maxQuantity ) {
                quantityValue.val( newQuantity );
                quantityLabel.text( newQuantity );
                quantityStepperLabel.text( newQuantity );

                CartItemQuantityControl.triggerCartUpdate( element );
            }

            event.preventDefault();
            return false;
        } );

        jQuery( document.body ).on( 'click', '.cfw-quantity-stepper-btn-plus.maxed', ( event ) => {
            event.preventDefault();
            return false;
        } );
    }

    setQuantityPromptTriggers(): void {
        if ( cfwGetWPHooks().applyFilters( 'cfw_js_disable_cart_quantity_prompt', DataService.getSetting( 'disable_cart_quantity_prompt' ) ) ) {
            return;
        }

        jQuery( document.body ).on( 'click', '.cfw-quantity-bulk-edit', ( event ) => {
            const element = jQuery( event.currentTarget );
            const response = ( <any>window ).prompt( DataService.getMessage( 'quantity_prompt_message' ), element.data( 'quantity' ) );

            // If we have input
            if ( response !== null ) {
                const newQuantity = Number( response );

                if ( newQuantity > 0 || ( <any>window ).confirm( DataService.getMessage( 'delete_confirm_message' ) ) ) {
                    element.siblings( '.cfw-edit-item-quantity-value' ).val( newQuantity );
                    element.parent().find( '.cfw-quantity-stepper-value-label' ).text( newQuantity );

                    CartItemQuantityControl.triggerCartUpdate( element );
                }
            }
        } );
    }

    setItemRemoveLinkTriggers() {
        jQuery( document.body ).on( 'click', '.cfw-remove-item-button', this.removeItem.bind( this ) );
    }

    removeItem( event: Event ): boolean {
        event.preventDefault();

        const inputElement = jQuery( event.currentTarget ).parents( '.cart-item-row' ).find( '.cfw-edit-item-quantity-value' );

        if ( !inputElement.length ) {
            return false;
        }

        const userResponse = ( <any>window ).confirm( DataService.getMessage( 'delete_confirm_message' ) );

        if ( userResponse ) {
            inputElement.val( 0 );

            CartItemQuantityControl.triggerCartUpdate( inputElement );
        }

        return false;
    }

    static triggerCartUpdate( element?: JQuery ): void {
        jQuery( document.body ).trigger( 'cfw_update_cart', [ element ?? null ] );
    }
}

export default CartItemQuantityControl;
