class OrderBumpsAdmin {
    constructor() {
        jQuery( document.body ).on( 'change', '#cfw_ob_display_for', ( event ) => {
            const element = jQuery( event.currentTarget );
            const specificProductsTargetElements = jQuery( '#cfw_ob_products, #cfw_ob_any_product, #cfw_ob_upsell, #cfw_ob_enable_auto_match' ).parents( 'tr' );
            const specificCategoriesTargetElements = jQuery( '#cfw_ob_categories' ).parents( 'tr' );

            if ( element.val() === 'specific_products' ) {
                specificProductsTargetElements.show();
            } else {
                specificProductsTargetElements.hide();
            }

            if ( element.val() !== 'specific_categories' ) {
                specificCategoriesTargetElements.hide();
            } else {
                specificCategoriesTargetElements.show();
            }
        } );

        jQuery( '#cfw_ob_display_for' ).trigger( 'change' );

        jQuery( document.body ).on( 'change', '#cfw_ob_upsell', () => {
            const upsellIncompatibleSettings = jQuery( '#cfw_ob_offer_quantity, [name="cfw_ob_item_removal_behavior"]' ).parents( 'tr' );

            if ( jQuery( '#cfw_ob_upsell' ).is( ':checked' ) ) {
                upsellIncompatibleSettings.hide();
            } else {
                upsellIncompatibleSettings.show();
            }
        } );

        jQuery( '#cfw_ob_upsell' ).trigger( 'change' );

        jQuery( document.body ).on( 'change', '[name="cfw_ob_display_location"]', ( event ) => {
            const element = jQuery( event.currentTarget );
            const toggledElements = jQuery( '[name="cfw_ob_offer_heading"], [name="cfw_ob_offer_subheading"]' ).parents( 'tr' );

            if ( element.val() === 'complete_order' ) {
                toggledElements.show();

                jQuery( '.cfw-post-purchase-upsell-hide' ).hide();
                jQuery( '.cfw-post-purchase-upsell-show' ).show();
                jQuery( 'label[for="cfw_ob_offer_language"]' ).text( 'Offer Acceptance Button Text' );
            } else {
                toggledElements.hide();

                jQuery( '.cfw-post-purchase-upsell-hide' ).show();
                jQuery( '.cfw-post-purchase-upsell-show' ).hide();
                jQuery( 'label[for="cfw_ob_offer_language"]' ).text( 'Offer Language' );
            }
        } );

        jQuery( '[name="cfw_ob_display_location"]:checked' ).trigger( 'change' );
    }
}

export default OrderBumpsAdmin;
