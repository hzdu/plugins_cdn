import AddToCartAction from '../Actions/AddToCartAction';
import DataService     from '../Services/DataService';

class AddToCart {
    constructor() {
        if ( DataService.getSetting( 'enable_ajax_add_to_cart' ) ) {
            jQuery( document.body ).on( 'submit', 'form.cart', this.addToCartFormSubmit.bind( this ) );
        }
    }

    addToCartFormSubmit( e ): void {
        const form = jQuery( e.currentTarget );

        if ( form.closest( '.product' ).hasClass( 'product-type-external' ) ) {
            return;
        }

        // Use the submitter property to determine the button that triggered the form submission
        const submitButton = e.originalEvent?.submitter as HTMLButtonElement;

        // Check if the button's name is 'add-to-subscription' and exit if it is
        if ( submitButton && submitButton.name === 'add-to-subscription' ) {
            return;
        }

        // Prevent form submission by default
        e.preventDefault();

        const productData = form.serializeArray();
        let productID: string | boolean = false;

        // Look for product ID in the form data
        productData.forEach( ( item ) => {
            if ( item.name === 'productID' || item.name === 'add-to-cart' ) {
                if ( item.value ) {
                    productID = item.value;
                }
            }
        } );

        // Additional check on form's action URL if no product ID found
        if ( !productID && form.attr( 'action' ) ) {
            const match = form.attr( 'action' ).match( /add-to-cart=(\d+)/ );
            if ( match ) {
                productID = match[ 1 ];
            }
        }

        // Include the submit button's data if it has 'add-to-cart' name
        if ( submitButton && submitButton.name === 'add-to-cart' && submitButton.value ) {
            productData.push( { name: 'add-to-cart', value: submitButton.value } );
        }

        if ( productID ) {
            productData.push( { name: 'add-to-cart', value: productID } );
        }

        jQuery( submitButton ).addClass( 'loading' );

        // Trigger an event for adding to cart
        jQuery( document.body ).trigger( 'adding_to_cart', [ submitButton, productData ] );

        // Execute add-to-cart action
        new AddToCartAction( jQuery( submitButton ) ).load( jQuery.param( productData ) );
    }
}

export default AddToCart;
