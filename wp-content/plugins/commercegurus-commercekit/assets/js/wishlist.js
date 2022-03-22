/* Javascript Document */
function showWishlistPopup(message){
	if( document.querySelector('#commercekit-wishlist-popup') ){
		var popup = document.querySelector('#commercekit-wishlist-popup');
		popup.innerHTML = message;
		popup.style.display = 'block';
		setTimeout( function(){ document.querySelector('#commercekit-wishlist-popup').style.display = 'none';}, 2000);
	}
}
document.querySelectorAll('.commercekit-save-wishlist').forEach(function(object){
	object.setAttribute('href', '#wishlists');
});
if( document.querySelector('.commercekit-wishlist') ){
	document.querySelector('body').insertAdjacentHTML('afterbegin', '<div id="commercekit-wishlist-popup" style="display: none;"></div>');
}
document.querySelector('body').addEventListener('click', function(event){
	$this = event.target.closest('a');
	if( $this && $this.classList.contains('commercekit-save-wishlist') ){
		event.preventDefault();
		processWishlistAction($this, 'commercekit_save_wishlist');
	}
	if( $this && $this.classList.contains('commercekit-remove-wishlist') ){
		event.preventDefault();
		processWishlistAction($this, 'commercekit_remove_wishlist');
	}
});
document.querySelector('body').addEventListener('click', function(event){
	$this = event.target;
	if( $this.classList.contains('commercekit-remove-wishlist2') ){
		event.preventDefault();
		if( $this.classList.contains('processing') ) return true;
		$this.classList.add('processing');
		var product_id = $this.getAttribute('data-product-id');
		var wpage = $this.getAttribute('data-wpage');
		var formData = new FormData();
		formData.append('product_id', product_id);
		formData.append('wpage', wpage);
		formData.append('type', 'list');
		formData.append('reload', '1');
		fetch( commercekit_ajs.ajax_url + '=commercekit_remove_wishlist', {
			method: 'POST',
			body: formData,
		}).then(response => response.json()).then( json => {
			if( json.status == 1 ){
				document.querySelector('#commercekit-wishlist-shortcode').innerHTML = json.html;
			}
			showWishlistPopup(json.message);
		});
	}
	if( $this.classList.contains('commercekit-wishlist-cart') ){
		event.preventDefault();
		$this.setAttribute('disabled', 'disabled');
		var product_id = $this.getAttribute('data-product-id');
		var formData = new FormData();
		formData.append('product_id', product_id);
		fetch( commercekit_ajs.ajax_url + '=commercekit_wishlist_addtocart', {
			method: 'POST',
			body: formData,
		}).then(response => response.json()).then( json => {
			$this.removeAttribute('disabled');
			showWishlistPopup(json.message);
			var wc_fragment = new Event('wc_fragment_refresh');
			document.body.dispatchEvent(wc_fragment);
		});
	}
});
function processWishlistAction($this, action){
	if( $this.classList.contains('processing') ) return true;
	$this.classList.add('processing');
	var parent = $this.parentNode;
	var product_id = $this.getAttribute('data-product-id');
	var type = $this.getAttribute('data-type');
	var formData = new FormData();
	formData.append('product_id', product_id);
	formData.append('type', type);
	fetch( commercekit_ajs.ajax_url + '='+action, {
		method: 'POST',
		body: formData,
	}).then(response => response.json()).then( json => {
		if( json.status == 1 ){
			parent.innerHTML = json.html;
		}
		$this.classList.remove('processing');
		showWishlistPopup(json.message);
	});
}
