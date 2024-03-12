import cfwGetWPHooks         from '../../functions/cfwGetWPHooks';
import DataService           from '../Services/DataService';
import UpdateCheckoutService from '../Services/UpdateCheckoutService';

class Pickup {
    protected static documentBody: JQuery<HTMLElement>;

    protected static shippingAddress: JQuery<HTMLElement>;

    protected static pickupLocationWrap: JQuery<HTMLElement>;

    protected static billingFieldsContainer: JQuery<HTMLElement>;

    protected static shippingMethodBreadcrumb: JQuery<HTMLElement>;

    constructor() {
        if ( !DataService.getSetting( 'local_pickup_enabled' ) ) {
            return;
        }

        Pickup.documentBody = jQuery( document.body );
        Pickup.shippingAddress = jQuery( '#cfw-customer-info-address.shipping' );
        Pickup.pickupLocationWrap = jQuery( '#cfw-pickup-location-wrap' );
        Pickup.billingFieldsContainer = jQuery( '#cfw-billing-fields-container' );
        Pickup.shippingMethodBreadcrumb = jQuery( 'li.cfw-shipping-method > a' );
        this.setTriggers();
    }

    setTriggers(): void {
        Pickup.documentBody.on( 'change', '[name="cfw_delivery_method"]', ( e ) => {
            Pickup.showContent( e.target );
        } );

        jQuery( '[name="cfw_delivery_method"]:checked' ).trigger( 'change' );

        Pickup.documentBody.on( 'change', '[name="cfw_delivery_method"], [name="cfw_pickup_location"]', () => {
            UpdateCheckoutService.queueUpdateCheckout();
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

        if ( isPickup && DataService.getSetting( 'hide_pickup_methods' ) ) {
            Pickup.documentBody.addClass( 'cfw-hide-pickup-methods' );
        } else {
            Pickup.documentBody.removeClass( 'cfw-hide-pickup-methods' );
        }

        if ( isPickup ) {
            Pickup.shippingAddress.hide();
            Pickup.pickupLocationWrap.show().find( ':input' ).prop( 'disabled', false );

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

            Pickup.documentBody.addClass( 'cfw-hide-payment-request-buttons' );
        } else {
            Pickup.shippingAddress.show();
            Pickup.pickupLocationWrap.hide().find( ':input' ).prop( 'disabled', true );

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

            Pickup.documentBody.removeClass( 'cfw-hide-payment-request-buttons' );
        }
    }
}

export default Pickup;
