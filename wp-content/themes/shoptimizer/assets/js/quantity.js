// Quantity buttons on the single product and cart pages.
jQuery( document ).ready( function( $ ) {
	$( document ).ajaxComplete( function() {
		shoptimizerWooQuantityButtons();
	} );
} );
document.addEventListener( 'DOMContentLoaded', function() {
	window.addEventListener( 'load', function( event ) {
		shoptimizerWooQuantityButtons();
	} );
} );

/**
* WooCommerce quantity buttons
*/
function shoptimizerWooQuantityButtons() {
	var quantityBoxes = document.querySelectorAll( '.woocommerce-cart-form div.quantity:not(.buttons_added) .qty, .summary div.quantity:not(.buttons_added) .qty' );
	if ( 0 < quantityBoxes.length ) {

		var quantityNav = document.createElement( 'div' );
		quantityNav.setAttribute( 'class', 'quantity-nav' );
		quantityNav.innerHTML = '<span class="quantity-button quantity-up plus"></span><span class="quantity-button quantity-down minus"></span>';

		quantityBoxes.forEach( function( quantityBoxe ) {
			if ( 'date' !== quantityBoxe.type && 'hidden' !== quantityBoxe.type ) {
				quantityBoxe.parentNode.classList.add( 'buttons_added' );
				var quantityNavClone = quantityNav.cloneNode( true );
				quantityBoxe.parentNode.insertBefore( quantityNavClone, quantityBoxe.nextSibling );
			}
		} );

		var quantityInputs = document.querySelectorAll( 'input.qty' );
		if ( 0 < quantityInputs.length ) {
			quantityInputs.forEach( function( quantityInput ) {
				var parent = quantityInput.closest( '.product-quantity' );
				if ( ! parent ) {
					var _min = parseInt( quantityInput.getAttribute( 'min' ) );
					if ( _min && 0 < _min && parseInt( quantityInput.value ) < _min ) {
						quantityInput.value = _min;
					}
				}
			} );
		}
	}
}

document.addEventListener( 'DOMContentLoaded', function() {
	document.addEventListener( 'click', function( event ) {
		var quantityCntl = event.target;
		if ( quantityCntl.classList.contains( 'plus' ) || quantityCntl.classList.contains( 'minus' ) ) {
			var quantity = quantityCntl.closest( '.quantity' );
			if ( quantity ) {
				var quantityBox = quantity.querySelector( 'input.qty' );
				if ( quantityBox ) {
					var currentQuantity = parseInt( quantityBox.value );
					var maxQuantity     = parseInt( quantityBox.getAttribute( 'max' ) );
					var minQuantity     = parseInt( quantityBox.getAttribute( 'min' ) );
					var step            = quantityBox.getAttribute( 'step' );

					if ( ! currentQuantity || '' === currentQuantity || 'NaN' === currentQuantity ) {
						currentQuantity = 0;
					}
					if ( '' === maxQuantity || 'NaN' === maxQuantity ) {
						maxQuantity = '';
					}

					if ( '' === minQuantity || 'NaN' === minQuantity ) {
						minQuantity = 0;
					}
					if ( 'any' === step || '' === step || undefined === step || 'NaN' === parseInt( step )  ) {
						step = 1;
					}

					if ( quantityCntl.classList.contains( 'plus' ) ) {
						if ( maxQuantity && ( maxQuantity === currentQuantity || currentQuantity > maxQuantity ) ) {
							quantityBox.value = maxQuantity;
						} else {
							quantityBox.value = currentQuantity + parseInt( step );
						}
					} else {
						if ( minQuantity && ( minQuantity === currentQuantity || currentQuantity < minQuantity ) ) {
							quantityBox.value = minQuantity;
						} else if ( 0 < currentQuantity ) {
							quantityBox.value = currentQuantity - parseInt( step );
						}
					}

					var updateCart = document.querySelector( '.woocommerce-cart-form [name="update_cart"]' );
					if ( updateCart ) {
						updateCart.removeAttribute( 'disabled' );
						updateCart.setAttribute( 'aria-disabled', 'false' );
					}
					quantityBox.dispatchEvent( new Event( 'change', { bubbles: true } ) );
				}
			}
			event.stopPropagation();
			event.preventDefault();
			return;
		}
	} );
} );
