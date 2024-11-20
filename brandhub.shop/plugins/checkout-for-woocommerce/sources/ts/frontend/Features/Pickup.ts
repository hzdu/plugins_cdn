import cfwGetWPHooks         from '../../functions/cfwGetWPHooks';
import DataService           from '../Services/DataService';
import UpdateCheckoutService from '../Services/UpdateCheckoutService';

class Pickup {
    protected static shippingAddress: JQuery<HTMLElement>;

    protected static billingFieldsContainer: JQuery<HTMLElement>;

    protected static shippingMethodBreadcrumb: JQuery<HTMLElement>;

    constructor() {
        if ( !DataService.getSetting( 'local_pickup_enabled' ) ) {
            return;
        }

        Pickup.shippingAddress = jQuery( '#cfw-customer-info-address.shipping' );
        Pickup.billingFieldsContainer = jQuery( '#cfw-billing-fields-container' );
        Pickup.shippingMethodBreadcrumb = jQuery( 'li.cfw-shipping-method > a' );

        jQuery( window ).on( 'load', () => {
            this.setTriggers();
        } );
    }

    setTriggers(): void {
        jQuery( document.body ).on( 'change', '[name="cfw_delivery_method"]', ( e ) => {
            Pickup.showContent( e.target );
        } );

        jQuery( '[name="cfw_delivery_method"]:checked' ).trigger( 'change' );

        jQuery( document.body ).on( 'change', '[name="cfw_delivery_method"], [name="cfw_pickup_location"]', () => {
            UpdateCheckoutService.queueUpdateCheckout( null, {
                // We don't want to update the shipping method since it will be recalculated when this changes
                update_shipping_method: false,
            } );
        } );

        cfwGetWPHooks().addFilter( 'cfw_js_suppress_smarty_address_validation', 'cfw', ( value ) => {
            if ( jQuery( '[name="cfw_delivery_method"]:checked' ).val() === 'pickup' ) {
                return true;
            }
            return value;
        } );
    }

    static showContent( target ): void {
        const radioButton = jQuery( target );
        const isPickup = radioButton.val() === 'pickup';
        const continueToShippingBtn = jQuery( '#cfw-customer-info-action .cfw-continue-to-shipping-btn' ).first();

        if ( isPickup && DataService.getSetting( 'hide_pickup_methods' ) ) {
            jQuery( document.body ).addClass( 'cfw-hide-pickup-methods' );
        } else {
            jQuery( document.body ).removeClass( 'cfw-hide-pickup-methods' );
        }

        if ( isPickup ) {
            Pickup.shippingAddress.hide();
            jQuery( '#cfw-pickup-location-wrap' ).show().find( ':input' ).prop( 'disabled', false );

            jQuery( '#shipping_dif_from_billing_radio' ).prop( 'checked', true ).trigger( 'change' );
            jQuery( '#billing_same_as_shipping_radio' ).prop( 'disabled', true );
            jQuery( '#cfw-shipping-same-billing .cfw-radio-reveal-group' ).css( 'border', 'none' );
            jQuery( '#cfw-shipping-same-billing .cfw-radio-reveal-group .cfw-radio-reveal-li' ).css( 'border', 'none' );
            jQuery( '#cfw-shipping-same-billing .cfw-radio-reveal-title-wrap' ).hide();
            jQuery( '.cfw-shipping-methods-heading' ).hide();
            Pickup.billingFieldsContainer.css( {
                padding: '0',
                border: 'none',
                background: 'none',
            } );

            const oldLabel = Pickup.shippingMethodBreadcrumb.text();
            Pickup.shippingMethodBreadcrumb.text( DataService.getMessage( 'pickup_label' ) ).data( 'old_label', oldLabel );

            const oldButtonLabel = continueToShippingBtn.text();
            continueToShippingBtn.text( DataService.getMessage( 'pickup_btn_label' ) ).data( 'old_label', oldButtonLabel );

            jQuery( document.body ).addClass( 'cfw-hide-payment-request-buttons' );
        } else {
            Pickup.shippingAddress.show();
            jQuery( '#cfw-pickup-location-wrap' ).hide().find( ':input' ).prop( 'disabled', true );

            jQuery( '#billing_same_as_shipping_radio' ).prop( 'disabled', false );
            jQuery( '#cfw-shipping-same-billing .cfw-radio-reveal-group' ).css( 'border', '' );
            jQuery( '#cfw-shipping-same-billing .cfw-radio-reveal-group .cfw-radio-reveal-li' ).css( 'border', '' );
            jQuery( '#cfw-shipping-same-billing .cfw-radio-reveal-title-wrap' ).show();
            jQuery( '.cfw-shipping-methods-heading' ).show();
            Pickup.billingFieldsContainer.css( {
                padding: '',
                border: '',
                background: '',
            } );

            const label = Pickup.shippingMethodBreadcrumb.data( 'old_label' );
            Pickup.shippingMethodBreadcrumb.text( label );

            const oldButtonLabel = continueToShippingBtn.data( 'old_label' );
            continueToShippingBtn.text( oldButtonLabel );

            jQuery( document.body ).removeClass( 'cfw-hide-payment-request-buttons' );
        }
    }
}

export default Pickup;
