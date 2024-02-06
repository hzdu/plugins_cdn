function setActiveAccordions( ref, type ) {
	const accordionItem = 'container' === type && ref?.current?.classList.contains( 'gb-accordion__toggle' )
		? ref?.current
		: ref?.current?.closest( '.gb-accordion__item' );
	const accordionContainer = accordionItem.closest( '.gb-accordion' );
	const multipleOpen = accordionContainer.getAttribute( 'data-multiple-open' );

	if ( ! multipleOpen ) {
		const allItems = Object.values( accordionContainer.children ).filter( ( child ) => child.className.includes( 'gb-accordion__item' ) );

		allItems.forEach( ( item ) => {
			item.removeAttribute( 'data-accordion-is-open' );
			const toggleItem = item.querySelector( '.gb-accordion__toggle' );
			const block = toggleItem.classList.contains( 'gb-button' )
				? 'button'
				: 'container';
			toggleItem.removeAttribute( 'data-' + block + '-is-current' );
		} );
	}

	accordionItem.setAttribute( 'data-accordion-is-open', true );
	const accordionToggle = accordionItem.querySelector( '.gb-accordion__toggle' );
	const block = accordionToggle.classList.contains( 'gb-button' )
		? 'button'
		: 'container';
	accordionToggle.setAttribute( 'data-' + block + '-is-current', true );
}

function getAccordionItemIds( items, type, { clientId } ) {
	const accordionItems = items;
	const accordionItemIds = accordionItems
		.map( ( block ) => block.clientId !== clientId ? block.clientId : null )
		.filter( ( value ) => value );
	const accordionToggleIds = [];
	const accordionContentIds = [];

	accordionItems.forEach( ( item ) => {
		item?.innerBlocks.forEach( ( innerItem ) => {
			if ( 'accordion-toggle' === innerItem?.attributes?.variantRole ) {
				accordionToggleIds.push( innerItem?.clientId );
			}

			if ( 'accordion-content' === innerItem?.attributes?.variantRole ) {
				accordionContentIds.push( innerItem?.clientId );
			}
		} );
	} );

	let itemIds = [];

	if ( 'accordion-toggle' === type ) {
		itemIds = accordionToggleIds;
	} else if ( 'accordion-content' === type ) {
		itemIds = accordionContentIds;
	} else if ( 'accordion-item' === type ) {
		itemIds = accordionItemIds;
	}

	return itemIds;
}

export {
	setActiveAccordions,
	getAccordionItemIds,
};
