import Compatibility         from '../Compatibility';
import UpdateCheckoutService from '../../Services/UpdateCheckoutService';

declare let wc_gc_params: any;

class WooCommerceGiftCards extends Compatibility {
    constructor() {
        super( 'WooCommerceGiftCards' );
    }

    load(): void {
        jQuery( document.body ).on( 'click', '#wc_gc_cart_redeem_send', ( e ) => {
            e.preventDefault();

            const code = jQuery( '#wc_gc_cart_code' ).val();
            if ( code ) {
                UpdateCheckoutService.queueUpdateCheckout();
            }
        } );

        /**
         * Remove gift card from checkout buttons.
         */
        jQuery( document.body ).on( 'click', '.wc_gc_remove_gift_card', function ( e ) {
            e.preventDefault();

            const $el = jQuery( this );
            const cardId = $el.data( 'giftcard' );

            jQuery.ajax( {
                type: 'post',
                url: wc_gc_params.wc_ajax_url.toString().replace(
                    '%%endpoint%%',
                    'remove_gift_card_from_session',
                ),
                data: `wc_gc_cart_id=${cardId}&security=${wc_gc_params.security_remove_card_nonce}`,
                dataType: 'html',
                success() {
                    UpdateCheckoutService.queueUpdateCheckout();
                },
            } );

            return false;
        } );

        // Resolve issues with the totals component being rendered multiple places simultaneously
        // Only alternative would be to selectively render them or suppress the action output in some contexts
        // But we render it in 3 places (mobile header, mobile cart summary, desktop cart summary)
        // So this hacky workaround is preferred for now
        // Ticket: https://secure.helpscout.net/conversation/2978044881/21763?viewId=8485149
        jQuery( document.body ).on( 'change', '#use_gift_card_balance', function () {
            // Sync all checkboxes with this id
            const checked = jQuery( this ).is( ':checked' );
            jQuery( '#use_gift_card_balance' ).prop( 'checked', checked );
        } );
    }
}

export default WooCommerceGiftCards;
