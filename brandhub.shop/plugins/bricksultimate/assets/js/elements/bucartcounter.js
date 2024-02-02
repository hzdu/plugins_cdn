document.addEventListener('DOMContentLoaded', buCartCounter); 
function buCartCounter(){
	const $cartcounters = document.querySelectorAll('.brxe-bu-cart-counter');
	if( $cartcounters.length > 0 ) {
		if( ! bricksIsFrontend && typeof wc_cart_fragments_params !== 'undefined' ) {
			let wc_fragments = JSON.parse( window.sessionStorage.getItem( wc_cart_fragments_params.fragment_name ) ),
				cart_hash    = window.sessionStorage.getItem( wc_cart_fragments_params.cart_hash_key ),
				cookie_hash  = Cookies.get( 'woocommerce_cart_hash');
				
			if ( wc_fragments && wc_fragments['div.widget_shopping_cart_content'] && cart_hash === cookie_hash ) {
				jQuery.each( wc_fragments, function( key, value ) {
					jQuery( key ).replaceWith(value);
				});
			}
		}
 	
		$cartcounters.forEach(( el ) => {
			let btn = el.querySelector('.bu-cart-counter-btn')
			let cartTimeout = null
			let endTimeout = null
			if( btn != null ) {
				let params = JSON.parse( btn.getAttribute('data-bucc-config') )

				_showPopup = function() {
					btn.nextElementSibling.classList.remove('screen-reader-text')
					btn.nextElementSibling.classList.add('bu-visible')
					btn.nextElementSibling.setAttribute('aria-expanded', "true")
					btn.nextElementSibling.setAttribute('aria-hidden', "false")
				};

				_hidePopup = function() {
					btn.nextElementSibling.classList.remove('screen-reader-text')
					btn.nextElementSibling.classList.remove('bu-visible')
					btn.nextElementSibling.setAttribute('aria-expanded', "false")
					btn.nextElementSibling.setAttribute('aria-hidden', "true")
				};

				_togglePopup = function(e) {
					e.preventDefault();
					btn.nextElementSibling.classList.remove('screen-reader-text')

					btn.nextElementSibling.classList.toggle('bu-visible');
					btn.nextElementSibling.setAttribute('aria-expanded', btn.nextElementSibling.getAttribute('aria-expanded') == "false" ? "true" : "false" )
					btn.nextElementSibling.setAttribute('aria-hidden', btn.nextElementSibling.getAttribute('aria-hidden') == "true" ? "false" : "true" )
					//e.stopPropagation();
				};

				_visibility = function() {
					if( ! bricksIsFrontend )
						return false

					if( endTimeout )
						clearTimeout(endTimeout)

					if( params.showbtn == 'hide') {
						if( Cookies.get( 'woocommerce_items_in_cart' ) > 0 ) {
							el.classList.remove('bu-hide-cart-btn')
						} else {
							el.classList.add('bu-hide-cart-btn')
						}
					}

					if( params.hide_popup == 'yes' && btn.classList.contains('bu-cart-counter-cta-popup') ) {
						if( Cookies.get( 'woocommerce_items_in_cart' ) > 0 ) {
							btn.nextElementSibling.classList.remove('bu-hide-popup')
						} else {
							btn.nextElementSibling.classList.remove('bu-visible')
							btn.nextElementSibling.classList.add('bu-hide-popup')
						}
					}
				};

				_reveal = function() {
					cartTimeout = setTimeout( function() {
						_showPopup()
					}, params.delay );

					endTimeout = setTimeout( function() {
						clearTimeout(cartTimeout)
						_hidePopup()
					}, params.duration );

					el.querySelector('.bu-cart-counter-popup').addEventListener('mouseover', function(){
						clearTimeout(endTimeout)
						_showPopup()
					});
				};

				_visibility();

				document.addEventListener("click", function(t) {
					if (
						!t.target.closest(".bu-cart-counter-btn") && btn.nextElementSibling && btn.nextElementSibling.classList.contains("bu-visible") 
						&& !t.target.closest(".bu-cart-counter-popup")
					) {
						_hidePopup();
					}
				});

				jQuery( document.body ).on( 'removed_from_cart', function() {
					if( typeof wc_add_to_cart_params != 'undefined' && wc_add_to_cart_params.is_cart )
						jQuery(document.body).trigger("wc_update_cart")

					if( params.checkoutpage == 'yes' || jQuery('.woocommerce-checkout-review-order-table').length > 0 )
						jQuery( document.body ).trigger( 'update_checkout' )
				});

				jQuery( document.body ).on( 'added_to_cart updated_wc_div update_checkout removed_from_cart', _visibility );

				if( ! btn.classList.contains('bu-cart-counter-cta-popup') )
					return false

				if( params.reveal == 'yes' ) { 
					jQuery( document.body ).on( 'added_to_cart', _reveal );
					if( BU_ADDED_TO_CART !== "undefined" ) {
						_reveal();
					}
				}

				let eventListener = 'click';

				if('ontouchstart' in window) // iOS & android
					eventListener = 'touchstart';
				else if(window.navigator.msPointerEnabled) // Win8
					eventListener = 'touchstart';
				else if('ontouchstart' in document.documentElement)
					eventListener = 'touchstart';

				if ( params.eventlistener === 'hover' ) {
					el.addEventListener( 'mouseover', _showPopup );
					el.addEventListener( 'mouseout', _hidePopup );

					if( eventListener == 'touchstart' )
						btn.addEventListener(eventListener, _togglePopup )
				}

				if ( params.eventlistener == 'click' ) {
					btn.addEventListener(eventListener, _togglePopup );
				}
			}
		})
	}
}