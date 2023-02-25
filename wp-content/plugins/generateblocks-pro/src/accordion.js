const getSiblings = ( elem ) => {
	return Array.prototype.filter.call( elem.parentNode.children, ( sibling ) => {
		return sibling !== elem;
	} );
};

const Accordion = ( toggle ) => {
	const accordionItem = toggle.closest( '.gb-accordion__item' );
	const accordionContent = accordionItem.querySelectorAll( '.gb-accordion__content' )[ 0 ];
	const accordionToggle = accordionItem.querySelectorAll( '.gb-accordion__toggle' )[ 0 ];
	const container = accordionItem.closest( '.gb-accordion' );
	const transition = accordionItem.getAttribute( 'data-transition' );

	if ( container && null === container.getAttribute( 'data-accordion-multiple-open' ) ) {
		const siblingAccordionItems = getSiblings( accordionItem );

		if ( siblingAccordionItems ) {
			siblingAccordionItems.forEach( ( siblingAccordionItem ) => {
				if ( siblingAccordionItem.classList.contains( 'gb-accordion__item-open' ) ) {
					if ( 'slide' === transition ) {
						const siblingAccordionContent = siblingAccordionItem.querySelectorAll( '.gb-accordion__content' )[ 0 ];

						if ( siblingAccordionContent ) {
							siblingAccordionContent.style.maxHeight = siblingAccordionContent.scrollHeight + 'px';

							setTimeout( () => {
								siblingAccordionItem.classList.remove( 'gb-accordion__item-open' );
								siblingAccordionContent.style.maxHeight = null;
							}, 10 );
						}
					} else {
						siblingAccordionItem.classList.remove( 'gb-accordion__item-open' );
					}

					const siblingAccordionToggle = siblingAccordionItem.querySelectorAll( '.gb-accordion__toggle' )[ 0 ];

					if ( siblingAccordionToggle ) {
						siblingAccordionToggle.setAttribute( 'aria-expanded', false );
						siblingAccordionToggle.classList.remove( 'gb-block-is-current' );
					}
				}
			} );
		}
	}

	if ( accordionItem.classList.contains( 'gb-accordion__item-open' ) ) {
		if ( 'slide' === transition ) {
			accordionContent.style.maxHeight = accordionContent.scrollHeight + 'px';

			setTimeout( () => {
				accordionToggle.setAttribute( 'aria-expanded', false );
				accordionToggle.classList.remove( 'gb-block-is-current' );
				accordionItem.classList.remove( 'gb-accordion__item-open' );
				accordionContent.style.maxHeight = null;
			}, 10 );
		} else {
			accordionToggle.setAttribute( 'aria-expanded', false );
			accordionToggle.classList.remove( 'gb-block-is-current' );
			accordionItem.classList.remove( 'gb-accordion__item-open' );
		}
	} else {
		// We want a "lonely if" here so we can expand on it if needed.
		// eslint-disable-next-line no-lonely-if
		if ( 'slide' === transition ) {
			accordionContent.style.maxHeight = accordionContent.scrollHeight + 'px';

			setTimeout( () => {
				accordionToggle.setAttribute( 'aria-expanded', true );
				accordionToggle.classList.add( 'gb-block-is-current' );
				accordionItem.classList.add( 'gb-accordion__item-open' );

				accordionContent.addEventListener( 'transitionend', ( e ) => {
					if ( 'max-height' === e.propertyName ) {
						accordionContent.style.maxHeight = null;
					}
				},
				{
					once: true,
				} );
			}, 10 );
		} else {
			accordionToggle.setAttribute( 'aria-expanded', true );
			accordionToggle.classList.add( 'gb-block-is-current' );
			accordionItem.classList.add( 'gb-accordion__item-open' );
			accordionItem.classList.add( 'gb-accordion__item-transition' );
			setTimeout( () => accordionItem.classList.remove( 'gb-accordion__item-transition' ), 100 );
		}
	}
};

document.querySelectorAll( '.gb-accordion__item .gb-accordion__toggle' ).forEach( ( toggle ) => {
	toggle.addEventListener( 'click', () => Accordion( toggle ) );

	if ( 'BUTTON' !== toggle?.tagName.toUpperCase() ) {
		toggle.addEventListener( 'keydown', ( e ) => {
			// "Spacebar" for IE11.
			if ( ' ' === e.key || 'Enter' === e.key || 'Spacebar' === e.key ) {
				// Prevent the default action to stop scrolling when space is pressed
				e.preventDefault();
				Accordion( toggle );
			}
		} );
	}
} );

function linkToItem() {
	const hash = window.location.hash;

	if ( hash ) {
		const hashedElement = document.getElementById( String( hash ).replace( '#', '' ) );

		if ( hashedElement && hashedElement.classList.contains( 'gb-accordion__item' ) ) {
			const button = hashedElement.querySelector( '.gb-accordion__toggle' );
			const content = hashedElement.querySelector( '.gb-accordion__content' );
			content.style.transition = 'none';

			if ( button ) {
				if ( ! hashedElement.classList.contains( 'gb-accordion__item-open' ) ) {
					button.click();
				}

				hashedElement.scrollIntoView();
				content.style.transition = '';
			}
		}
	}
}

window.addEventListener( 'hashchange', linkToItem );
document.addEventListener( 'DOMContentLoaded', linkToItem );

const accordionItems = document.querySelectorAll( '.gb-accordion__item' );

if ( accordionItems ) {
	accordionItems.forEach( ( accordionItem ) => {
		const accordionToggle = accordionItem.querySelectorAll( '.gb-accordion__toggle' )[ 0 ];
		const accordionContent = accordionItem.querySelectorAll( '.gb-accordion__content' )[ 0 ];
		const accordionToggleId = accordionToggle.getAttribute( 'id' );
		const accordionContentId = accordionContent.getAttribute( 'id' );

		if ( accordionToggleId ) {
			accordionContent.setAttribute( 'aria-labelledby', accordionToggleId );
		}

		if ( accordionContentId ) {
			accordionToggle.setAttribute( 'aria-controls', accordionContentId );
		}

		if ( accordionItem.classList.contains( 'gb-accordion__item-open' ) && accordionToggle ) {
			accordionToggle.setAttribute( 'aria-expanded', true );
		} else if ( accordionToggle ) {
			accordionToggle.setAttribute( 'aria-expanded', false );
		}
	} );
}
