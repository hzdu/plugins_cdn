import RemoveCouponAction    from '../Actions/RemoveCouponAction';
import DataService           from '../Services/DataService';

class Coupons {
    constructor() {
        this.setRemoveCouponListener();
    }

    setRemoveCouponListener(): void {
        jQuery( document.body ).on( 'click', '.woocommerce-remove-coupon', function ( e ) {
            e.preventDefault();
            new RemoveCouponAction().load( {
                security: DataService.getCheckoutParam( 'remove_coupon_nonce' ),
                coupon_code: jQuery( this ).data( 'coupon' ),
            } );
        } );
    }
}

export default Coupons;
