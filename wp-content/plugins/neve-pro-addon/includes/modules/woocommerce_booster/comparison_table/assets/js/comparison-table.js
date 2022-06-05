/* global neveWooBooster, localStorage */
import ld from 'lodash';
const _ = ld.noConflict();

function initializeComparisonTable() {
	// if comparison table is not enabled, return.
	if ( ! document.body.classList.contains( 'nv-ct-enabled' ) ) {
		return;
	}

	updateAddingProductRestriction();
	updateComparisonTableContent();
	addProductToComparisonTable();
	removeProductFromComparisonTable();
	removeProductFromComparisonTableStickyBar();
	clearAllProductsOfComparisonTable();
}

function isStickyBarLoaded() {
	// remove current products from sticky bar
	return document.getElementById( 'nv-ct-products' ) !== null;
}

function updateComparisonTableContent() {
	// remove current products from sticky bar
	const stickyBar = document.getElementById( 'nv-ct-products' );

	if ( stickyBar !== null ) {
		stickyBar.innerHTML = '';
	}

	const products = getProductsFromLocalStorage();
	const productIds = [];

	products.forEach( ( productDetails ) => {
		productIds.push( productDetails.id );

		if ( stickyBar !== null ) {
			addProductToStickyBar(
				productDetails.id,
				productDetails.url,
				productDetails.image
			);
		}

		markProductViews( 'add', productDetails.id );
	} );

	updateComparisonTablePageURL( productIds );
	updateStickyBarProductCount();
	updateStickyBarVisibility();
	updateStickyBarCompareButtonVisibility();
	updateAddingProductRestriction();
}

function getComparisonTableURL( productIds ) {
	return neveWooBooster.comparisonTable.tableURL.replace(
		'product-ids-placeholder',
		productIds.join( ',' )
	);
}

function updateComparisonTablePageURL( productIds ) {
	productIds = productIds.sort();

	const stickyBarCompareButton = document.querySelector(
		'.ct-sticky-col.nv-ct-col-button a'
	);
	if ( stickyBarCompareButton ) {
		stickyBarCompareButton.href = getComparisonTableURL( productIds );
	}
}

function updateScrollToTopPosition( newPosition ) {
	if ( ! document.getElementById( 'scroll-to-top' ) ) return;

	document.getElementById( 'scroll-to-top' ).style.bottom = newPosition;
}

function updateStickyBarVisibility() {
	if ( ! isStickyBarLoaded() ) {
		return;
	}

	if ( getTotalProduct() > 0 ) {
		document
			.getElementsByClassName( 'nv-ct-sticky-bar' )[ 0 ]
			.classList.remove( 'hidden' );
		setTimeout( () => {
			updateScrollToTopPosition(
				document.getElementsByClassName( 'nv-ct-sticky-bar' )[ 0 ]
					.offsetHeight +
					30 +
					'px'
			);
		}, 100 );
	} else {
		document
			.getElementsByClassName( 'nv-ct-sticky-bar' )[ 0 ]
			.classList.add( 'hidden' );

		updateScrollToTopPosition( '30px' );
	}

	const stickAddToCarts = document.getElementsByClassName(
		'sticky-add-to-cart'
	);

	// Sticky add to cart compatibility
	if ( stickAddToCarts.length === 1 ) {
		if (
			stickAddToCarts[ 0 ].classList.contains(
				'sticky-add-to-cart--active'
			) &&
			stickAddToCarts[ 0 ].classList.contains(
				'sticky-add-to-cart-bottom'
			)
		) {
			const addToCartStickyBarHeight = document.getElementsByClassName(
				'sticky-add-to-cart'
			)[ 0 ].offsetHeight;

			document.getElementsByClassName(
				'nv-ct-sticky-bar'
			)[ 0 ].style.bottom = addToCartStickyBarHeight + 'px';
		}
	}
}

function updateStickyBarCompareButtonVisibility() {
	if ( ! isStickyBarLoaded() ) {
		return;
	}

	if ( getTotalProduct() === 1 ) {
		document
			.querySelector( '.nv-ct-sticky-bar .nv-ct-col-button .min-prod' )
			.classList.remove( 'nv-ct-hide-element' );
		document
			.querySelector(
				'.nv-ct-sticky-bar .nv-ct-col-button .nv-ct-compare-btn-wrapper'
			)
			.classList.add( 'nv-ct-hide-element' );
	} else {
		document
			.querySelector( '.nv-ct-sticky-bar .nv-ct-col-button .min-prod' )
			.classList.add( 'nv-ct-hide-element' );
		document
			.querySelector(
				'.nv-ct-sticky-bar .nv-ct-col-button .nv-ct-compare-btn-wrapper'
			)
			.classList.remove( 'nv-ct-hide-element' );
	}
}

function getProductIdsFromLocalStorage() {
	return _.map( getProductsFromLocalStorage(), 'id' ); //eslint-disable-line
}

function getProductsFromLocalStorage() {
	const products = localStorage.getItem( 'nv_ct_products' );
	if ( products === null ) {
		return [];
	}
	return JSON.parse( products );
}

function addProductToLocalStorage( productId, productUrl, productImage ) {
	const products = getProductsFromLocalStorage();

	products.push( { id: productId, url: productUrl, image: productImage } );

	localStorage.setItem( 'nv_ct_products', JSON.stringify( products ) );
}

function removeProductFromLocalStorage( productId ) {
	const products = getProductsFromLocalStorage();

	for ( let i = 0; i < products.length; i++ ) {
		if ( products[ i ].id === productId ) {
			products.splice( i, 1 );
			i--;
		}
	}

	localStorage.setItem( 'nv_ct_products', JSON.stringify( products ) );
}

function clearAllProductsFromLocalStorage() {
	localStorage.removeItem( 'nv_ct_products' );
}

function addProductToComparisonTable() {
	document.addEventListener( 'click', function ( e ) {
		const btn = e.target.closest( 'a' );

		if ( ! btn || ! btn.classList.contains( 'nv-ct-compare-btn' ) ) {
			return;
		}

		e.preventDefault();

		const btnData = btn.dataset;

		const productId = btnData.pid;
		const productUrl = btnData.url;
		const productImage = btnData.img;

		if ( isProductExistInComparisonTable( productId ) ) {
			removeProductFromLocalStorage( productId );
			markProductViews( 'remove', productId );

			// remove product image.
			removeProductViewFromStickyBar( productId );

			updateStickyBarProductCount();
			updateStickyBarVisibility();
			updateStickyBarCompareButtonVisibility();
			updateAddingProductRestriction();

			updateComparisonTablePageURL( getProductIdsFromLocalStorage() );

			if (
				document.body.classList.contains(
					'nv-ct-comparison-table-content'
				)
			) {
				window.location.href = getComparisonTableURL(
					getProductIdsFromLocalStorage()
				);
			}

			return;
		}

		// check max product limit
		if ( ! canProductBeAdded() ) {
			return;
		}

		addProductToLocalStorage( productId, productUrl, productImage );

		markProductViews( 'add', productId );

		// add product seamless
		addProductToStickyBar( productId, productUrl, productImage );

		updateComparisonTablePageURL( getProductIdsFromLocalStorage() );
		updateStickyBarProductCount();
		updateStickyBarVisibility();
		updateStickyBarCompareButtonVisibility();
		updateAddingProductRestriction();

		if (
			document.body.classList.contains( 'nv-ct-comparison-table-content' )
		) {
			window.location.href = getComparisonTableURL(
				getProductIdsFromLocalStorage()
			);
		}
	} );
}

function addProductToStickyBar( productId, productUrl, productImage ) {
	if ( ! isStickyBarLoaded() ) {
		return;
	}

	const item = document.querySelector( '#nv-ct-product-template-container' );

	const cln = item.cloneNode( true );

	cln.querySelector( 'button' ).value = productId;
	cln.querySelector( '.nv-ct-product-image-wrapper' ).innerHTML =
		'<a href="' + productUrl + '"><img src="' + productImage + '" /></a>';
	cln.querySelector(
		'.nv-ct-sticky-bar-product-container'
	).dataset.pid = productId;

	// make visible.
	cln.style.display = 'block';
	document.getElementById( 'nv-ct-products' ).appendChild( cln );
}

function canProductBeAdded() {
	return (
		getTotalProduct() < neveWooBooster.comparisonTable.numberOfProductsLimit
	);
}

function updateAddingProductRestriction() {
	if ( canProductBeAdded() ) {
		document.body.classList.remove( 'nv-ct-product-limit-exceed' );
	} else {
		document.body.classList.add( 'nv-ct-product-limit-exceed' );
	}
}

function removeProductViewFromStickyBar( productId ) {
	if ( ! isStickyBarLoaded() ) {
		return;
	}

	// remove product image.
	const productDetail = document.querySelector(
		'.nv-ct-sticky-bar-product-container[data-pid="' + productId + '"]'
	);

	if ( productDetail ) {
		productDetail.parentNode.remove();
	}
}

function updateStickyBarProductCount() {
	if ( ! isStickyBarLoaded() ) {
		return;
	}

	const newProductCount = getTotalProduct();
	document.getElementsByClassName(
		'nv-ct-sticky-bar-total-product'
	)[ 0 ].innerHTML = newProductCount;
}

function clearAllProductsOfComparisonTable() {
	const trigger = document.getElementsByClassName( 'nv-ct-clear-all' );

	for ( let i = 0; i < trigger.length; i++ ) {
		trigger[ i ].addEventListener(
			'click',
			function clearAllProductsOfComparisonTableEvent( e ) {
				e.preventDefault();

				clearAllProductsFromLocalStorage();
				updateStickyBarProductCount();
				updateStickyBarVisibility();
				updateStickyBarCompareButtonVisibility();

				const products = document.querySelectorAll(
					'#nv-ct-products .nv-ct-sticky-bar-product-container'
				);

				// remove products
				products.forEach( ( product ) => product.parentNode.remove() );

				// deselect products
				markProductViews( 'remove', 'all' );
			}
		);
	}
}

function removeProductFromComparisonTableStickyBar() {
	if ( ! isStickyBarLoaded() ) {
		return;
	}

	document.addEventListener( 'click', function ( e ) {
		if (
			e.target &&
			e.target.classList.contains( 'nv-ct-remove-product' )
		) {
			e.preventDefault();

			const productId = e.target.value;

			removeProductFromLocalStorage( productId );
			removeProductViewFromStickyBar( productId );
			updateStickyBarProductCount();
			updateStickyBarVisibility();
			updateStickyBarCompareButtonVisibility();

			updateComparisonTablePageURL( getProductIdsFromLocalStorage() );

			// make product unselected
			markProductViews( 'remove', productId );

			// update tooltips
			updateAddingProductRestriction();
		}
	} );
}

function removeProductFromComparisonTable() {
	const trigger = document.querySelectorAll( '.nv-ct .nv-ct-remove-product' );

	for ( let i = 0; i < trigger.length; i++ ) {
		trigger[ i ].addEventListener(
			'click',
			function removeProductFromComparisonTableEvent( e ) {
				e.preventDefault();

				const triggerButton = this;
				const productId = triggerButton.value;

				// update tooltips
				updateAddingProductRestriction();

				removeProductFromLocalStorage( productId );
				window.location.href = getComparisonTableURL(
					getProductIdsFromLocalStorage()
				);
			}
		);
	}
}

function getTotalProduct() {
	let products = getProductsFromLocalStorage();

	products = products.filter( ( productDetails ) => productDetails.id > 0 );
	return products.length;
}

function isProductExistInComparisonTable( productId ) {
	const products = getProductsFromLocalStorage();

	for ( let i = 0; i < products.length; i++ ) {
		if ( products[ i ].id === productId ) {
			return true;
		}
	}

	return false;
}

/**
 *
 * The functions marks compare buttons as selected or non-selected.
 *
 * @param {string} type that type 'add' or 'remove'.
 * @param {number | string} productId specific product ID OR all.
 * @param {boolean} nonAddedFilter if it's set as true, products that not in the comparison list are affected.
 */
function markProductViews( type, productId, nonAddedFilter = false ) {
	let selector = '.nv-ct-compare-btn[data-pid="' + productId + '"]';

	if ( productId === 'all' ) {
		selector = '.nv-ct-compare-btn';
	}

	const products = document.querySelectorAll( selector );

	products.forEach( ( product ) => {
		if (
			nonAddedFilter &&
			getProductIdsFromLocalStorage().includes( productId )
		) {
			return;
		}

		product.classList[ type ]( 'nv-ct-item-added' );
	} );
}

export { initializeComparisonTable, updateComparisonTableContent };
