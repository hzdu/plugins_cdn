jQuery(function($) {

"use strict";

var wishlistEvents = 'yith_wcwl_fragments_replaced yith_wcwl_reload_fragments yith_wcwl_add_to_wishlist_ajax_success yith_wcwl_remove_from_wishlist_ajax_success yith_wcwl_wishlist_product_added yith_wcwl_wishlist_product_removed yith_wcwl_wishlist_updated added_to_wishlist removed_from_wishlist';
var wishlistSettings = window.shopkeeperWishlistCounters || {};
var wishlistRequest = null;

if ( ! wishlistSettings.ajax_url ) {
	return;
}

function refreshWishlistCount() {
	if ( wishlistRequest && wishlistRequest.readyState !== 4 ) {
		wishlistRequest.abort();
	}

	wishlistRequest = $.post(
		wishlistSettings.ajax_url,
		{
			action: wishlistSettings.action,
			nonce: wishlistSettings.nonce
		}
	).done(function(response){
		if ( response && response.success && response.data && typeof response.data.count !== 'undefined' ) {
			$('.wishlist_items_number').text(response.data.count);
		}
	}).always(function(){
		wishlistRequest = null;
	});
}

$(document).on(wishlistEvents, refreshWishlistCount);
refreshWishlistCount();

});
