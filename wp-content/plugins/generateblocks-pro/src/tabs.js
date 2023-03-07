const Tabs = ( button ) => {
	const container = button.closest( '.gb-tabs' );

	if ( ! container ) {
		return;
	}

	const allButtons = [ ...button.parentElement.children ].filter( ( child ) => child.classList.contains( 'gb-tabs__button' ) );
	const index = allButtons.indexOf( button );
	const itemContainer = container.querySelector( '.gb-tabs__items' ); // Only get the first items element.
	const items = itemContainer.querySelectorAll( ':scope > .gb-tabs__item' );
	const item = items[ index ];

	if ( ! item || item.classList.contains( 'gb-tabs__item-open' ) ) {
		return;
	}

	const buttonContainer = container.querySelector( '.gb-tabs__buttons' );
	const buttons = buttonContainer.querySelectorAll( '.gb-tabs__button' );

	items.forEach( ( tabItem ) => {
		tabItem.classList.remove( 'gb-tabs__item-open' );
	} );

	buttons.forEach( ( buttonItem ) => {
		buttonItem.setAttribute( 'aria-expanded', false );
		buttonItem.classList.remove( 'gb-block-is-current' );
	} );

	const itemButton = buttons[ index ];

	// Show clicked tab.
	item.classList.add( 'gb-tabs__item-open' );
	item.classList.add( 'gb-tabs__item-transition' );
	setTimeout( () => item.classList.remove( 'gb-tabs__item-transition' ), 100 );
	container.setAttribute( 'data-opened-tab', index + 1 );
	itemButton.setAttribute( 'aria-expanded', true );
	itemButton.classList.add( 'gb-block-is-current' );
};

document.querySelectorAll( '.gb-tabs__button' ).forEach( ( button ) => {
	button.addEventListener( 'click', () => Tabs( button ) );

	if ( 'BUTTON' !== button?.tagName.toUpperCase() ) {
		button.addEventListener( 'keydown', ( e ) => {
			// "Spacebar" for IE11.
			if ( ' ' === e.key || 'Enter' === e.key || 'Spacebar' === e.key ) {
				// Prevent the default action to stop scrolling when space is pressed
				e.preventDefault();
				Tabs( button );
			}
		} );
	}
} );

function linkToTab() {
	const hash = window.location.hash;

	if ( hash ) {
		const hashedElement = document.getElementById( String( hash ).replace( '#', '' ) );

		if ( hashedElement && hashedElement.classList.contains( 'gb-tabs__item' ) ) {
			const container = hashedElement.closest( '.gb-tabs' );
			const buttonContainer = container.querySelector( '.gb-tabs__buttons' );
			const index = [ ...hashedElement.parentElement.children ].indexOf( hashedElement );

			if ( buttonContainer && buttonContainer.children && buttonContainer.children[ index ] ) {
				buttonContainer.children[ index ].click();
				buttonContainer.scrollIntoView();
			}
		}
	}
}

document.addEventListener( 'DOMContentLoaded', linkToTab );
window.addEventListener( 'hashchange', linkToTab );

const items = document.querySelectorAll( '.gb-tabs__item' );

if ( items ) {
	items.forEach( ( item ) => {
		const container = item.closest( '.gb-tabs' );
		const buttonContainer = container.querySelector( '.gb-tabs__buttons' );
		const buttons = buttonContainer.querySelectorAll( '.gb-tabs__button' );
		const index = [ ...item.parentElement.children ].indexOf( item );
		const button = buttons[ index ];

		if ( ! button ) {
			return;
		}

		const buttonId = button.getAttribute( 'id' );

		if ( buttonId ) {
			item.setAttribute( 'aria-labelledby', buttonId );
		}

		const itemId = item.getAttribute( 'id' );

		if ( itemId ) {
			button.setAttribute( 'aria-controls', itemId );
		}

		if ( item.classList.contains( 'gb-tabs__item-open' ) && button ) {
			button.setAttribute( 'aria-expanded', true );
		} else if ( button ) {
			button.setAttribute( 'aria-expanded', false );
		}
	} );
}
