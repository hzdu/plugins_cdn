import Main                     from '../Main';
import DataService              from '../Services/DataService';

class Pickup {
    public constructor() {
        if ( !DataService.getSetting( 'local_pickup_enabled' ) ) {
            return;
        }

        this.setTriggers();
    }

    setTriggers(): void {
        jQuery( document.body ).on( 'change', '[name="cfw_delivery_method"]', ( e ) => {
            this.showContent( e.target );
        } );

        jQuery( window ).on( 'load', () => {
            jQuery( '[name="cfw_delivery_method"]:checked' ).trigger( 'change' );
        } );

        jQuery( document.body ).on( 'change', '[name="cfw_delivery_method"], [name="cfw_pickup_location"]', ( e ) => {
            Main.instance.updateCheckoutService.triggerUpdateCheckout();
        } );
    }

    showContent( target ): void {
        const radioButton = jQuery( target );

        if ( radioButton.val() === 'pickup' && DataService.getSetting( 'hide_pickup_methods' ) ) {
            jQuery( document.body ).addClass( 'cfw-hide-pickup-methods' );
        } else {
            jQuery( document.body ).removeClass( 'cfw-hide-pickup-methods' );
        }

        if ( radioButton.val() === 'pickup' ) {
            // Shipping address
            jQuery( '#cfw-customer-info-address.shipping' ).hide();

            // Pickup locations picker
            jQuery( '#cfw-pickup-location-wrap' ).show().find( ':input' ).prop( 'disabled', false );

            // Billing address
            jQuery( '#shipping_dif_from_billing_radio' ).prop( 'checked', true );
            jQuery( '#billing_same_as_shipping_radio' ).prop( 'disabled', true );
            jQuery( '#cfw-shipping-same-billing .cfw-radio-reveal-group' ).css( 'border', 'none' );
            jQuery( '#cfw-shipping-same-billing .cfw-radio-reveal-group .cfw-radio-reveal-li' ).css( 'border', 'none' );
            jQuery( '#cfw-shipping-same-billing .cfw-radio-reveal-title-wrap' ).hide();
            jQuery( '.cfw-shipping-methods-heading' ).hide();
            jQuery( '#cfw-billing-fields-container' )
                .css( 'padding', '0' )
                .css( 'border', 'none' )
                .css( 'background', 'none' );

            const shippingMethodBreadcrumb = jQuery( 'li.cfw-shipping-method > a' );
            const oldLabel = shippingMethodBreadcrumb.text();
            shippingMethodBreadcrumb.text( DataService.getMessage( 'pickup_label' ) ).data( 'old_label', oldLabel );
        } else {
            // Shipping address
            jQuery( '#cfw-customer-info-address.shipping' ).show();

            // Pickup locations picker
            jQuery( '#cfw-pickup-location-wrap' ).hide().find( ':input' ).prop( 'disabled', true );

            // Billing address
            jQuery( '#billing_same_as_shipping_radio' ).prop( 'disabled', false );
            jQuery( '#cfw-shipping-same-billing .cfw-radio-reveal-group' ).css( 'border', '' );
            jQuery( '#cfw-shipping-same-billing .cfw-radio-reveal-group .cfw-radio-reveal-li' ).css( 'border', '' );
            jQuery( '#cfw-shipping-same-billing .cfw-radio-reveal-title-wrap' ).show();
            jQuery( '.cfw-shipping-methods-heading' ).show();
            jQuery( '#cfw-billing-fields-container' )
                .css( 'padding', '' )
                .css( 'border', '' )
                .css( 'background', '' );

            const shippingMethodBreadcrumb = jQuery( 'li.cfw-shipping-method > a' );
            const label = shippingMethodBreadcrumb.data( 'old_label' );
            shippingMethodBreadcrumb.text( label );
        }
    }
}

export default Pickup;
