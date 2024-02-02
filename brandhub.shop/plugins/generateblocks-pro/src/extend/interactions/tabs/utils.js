function getTabAreaClientId( blocks, role ) {
	return blocks.reduce( ( result, block ) => {
		if (
			( block.name && 'generateblocks/container' === block.name ) &&
			( block.attributes && role === block.attributes.variantRole )
		) {
			result.push( block.clientId );
		}

		if ( block.innerBlocks ) {
			const { clientIds } = getTabAreaClientId( block.innerBlocks, role );
			result = result.concat( clientIds );
		}

		return result.filter( ( n ) => n );
	}, [] );
}

function getSiblings( elem ) {
	return Array.prototype.filter.call( elem.parentNode.children, ( sibling ) => {
		return sibling !== elem;
	} );
}

function setActiveTabs( ref, type ) {
	const childClass = 'button' === type
		? 'gb-tabs__button'
		: 'gb-container';

	const container = ref?.current?.closest( '.gb-tabs' );
	const allItems = Object.values( ref?.current?.parentElement.children ).filter( ( child ) => child.className.includes( childClass ) );
	const index = [ ...allItems ].indexOf( ref?.current );

	if ( container ) {
		container.setAttribute( 'data-opened-tab', index + 1 );
	}

	const tabItemsContainer = container.querySelector( '.gb-tabs__items' );
	const allTabItems = Object.values( tabItemsContainer.children ).filter( ( child ) => child.className.includes( 'gb-tabs__item' ) );
	allTabItems.forEach( ( item ) => item.removeAttribute( 'data-tab-is-open' ) );
	const tabItem = allTabItems[ index ];

	if ( tabItem ) {
		tabItem.setAttribute( 'data-tab-is-open', true );
	}

	const buttonItemsContainer = container.querySelector( '.gb-tabs__buttons' );
	const allButtonItems = Object.values( buttonItemsContainer.children ).filter( ( child ) => child.className.includes( 'gb-tabs__button' ) );
	allButtonItems.forEach( ( item ) => {
		const block = item.classList.contains( 'gb-button' )
			? 'button'
			: 'container';

		item.removeAttribute( 'data-' + block + '-is-current' );
	} );
	const buttonItem = allButtonItems[ index ];

	if ( buttonItem ) {
		const block = buttonItem.classList.contains( 'gb-button' )
			? 'button'
			: 'container';

		buttonItem.setAttribute( 'data-' + block + '-is-current', true );
	}
}

export {
	getTabAreaClientId,
	getSiblings,
	setActiveTabs,
};
