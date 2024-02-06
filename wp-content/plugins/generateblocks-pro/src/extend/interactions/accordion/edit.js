import { addFilter, addAction } from '@wordpress/hooks';
import { useEffect, useRef, useState } from '@wordpress/element';
import { createHigherOrderComponent } from '@wordpress/compose';
import { BlockControls, store as blockEditorStore } from '@wordpress/block-editor';
import { ToolbarGroup } from '@wordpress/components';
import classnames from 'classnames';
import { getAccordionItemIds, setActiveAccordions } from './utils';
import AddAccordionItem from './components/AddAccordionItem';
import { useSelect, useDispatch } from '@wordpress/data';
import noStyleAttributes from '../../../utils/no-style-attributes';
import { isEqual, omit, isEmpty } from 'lodash';
import { transitionExists } from '../../../components/effect-panel-item/utils';

const withAccordion = createHigherOrderComponent( ( BlockEdit ) => {
	return ( props ) => {
		const {
			name,
			attributes,
			clientId,
			setAttributes,
			isSelected,
		} = props;

		const {
			variantRole,
			accordionTransition,
			transitions,
		} = attributes;

		const isAccordionItem = ( 'generateblocks/container' === name || 'generateblocks/button' === name ) && variantRole && variantRole.includes( 'accordion' );

		if ( ! isAccordionItem ) {
			return <BlockEdit { ...props } />;
		}

		const { getBlock, getBlockParentsByBlockName, getBlocks } = useSelect( ( select ) => select( blockEditorStore ), [] );
		const { updateBlockAttributes } = useDispatch( blockEditorStore );
		const [ currentClientId ] = useState( clientId );
		const firstUpdate = useRef( true );
		const noSyncAttributes = noStyleAttributes.filter( ( noStyleAttribute ) => 'icon' !== noStyleAttribute );
		const attributesRef = useRef( omit( attributes, noSyncAttributes ) );

		function getAccordionContainer() {
			let accordionContainer = '';

			if ( 'accordion-toggle' === variantRole || 'accordion-content' === variantRole || 'accordion-item' === variantRole ) {
				const accordionContainerId = getBlockParentsByBlockName( clientId, 'generateblocks/container', true )
					.find( ( block ) => 'accordion' === getBlock( block )?.attributes?.variantRole );

				accordionContainer = getBlock( accordionContainerId );
			}

			if ( 'accordion' === variantRole ) {
				accordionContainer = getBlock( clientId );
			}

			return accordionContainer;
		}

		function syncAccordionStyles( role ) {
			const shouldSyncStyles = getAccordionContainer()?.attributes?.syncAccordionItemStyles;

			if ( ! shouldSyncStyles ) {
				return;
			}

			const omittedAttributes = omit( attributes, noSyncAttributes );

			const changedAttributes = {};

			for ( const [ key, value ] of Object.entries( omittedAttributes ) ) {
				if ( ! isEqual( attributesRef.current[ key ], value ) ) {
					changedAttributes[ key ] = value;
				}
			}

			if ( isEmpty( changedAttributes ) ) {
				return;
			}

			attributesRef.current = omittedAttributes;

			const containerId = getAccordionContainer()?.clientId;
			const accordionItems = getBlocks( containerId );
			const itemIds = getAccordionItemIds( accordionItems, role, { clientId } );

			updateBlockAttributes( itemIds, changedAttributes );
		}

		// Sync tab styles whenever attributes are changed.
		useEffect( () => {
			if ( firstUpdate.current ) {
				firstUpdate.current = false;
				return;
			}

			// Check current clientId to prevent infinite loop updating attributes.
			if ( clientId === currentClientId && name.includes( 'generateblocks' ) && variantRole && variantRole.includes( 'accordion' ) && isSelected ) {
				syncAccordionStyles( variantRole );
			}
		}, [ JSON.stringify( attributes ) ] );

		// Add transitions effects.
		useEffect( () => {
			if ( 'accordion-item' === variantRole ) {
				const effectValues = [ ...transitions ];
				const transitionValues = {
					state: 'normal',
					target: 'accordionContent',
					customSelector: '',
					timingFunction: 'ease',
					delay: '',
				};

				if ( transitionExists( 'accordionContent', '', transitions ) ) {
					let transitionHasUpdate = false;
					const updatedTransitions = effectValues.map( ( transition ) => {
						if ( 'fade' === accordionTransition && 'max-height' === transition?.property ) {
							transitionHasUpdate = true;

							return {
								...transition,
								property: 'opacity',
								duration: 0.5,
							};
						}

						if ( 'slide' === accordionTransition && 'opacity' === transition?.property ) {
							transitionHasUpdate = true;

							return {
								...transition,
								property: 'max-height',
								duration: 0.25,
							};
						}

						return transition;
					} );

					const transitionIndex = transitions.findIndex( ( x ) => 'accordionContent' === x.target );

					if ( '' === accordionTransition ) {
						effectValues.splice( transitionIndex, 1 );

						setAttributes( {
							transitions: effectValues,
							useTransition: !! effectValues.length,
						} );
					} else if ( transitionHasUpdate ) {
						setAttributes( {
							transitions: updatedTransitions,
							useTransition: true,
						} );
					}
				} else if ( 'fade' === accordionTransition || 'slide' === accordionTransition ) {
					if ( 'fade' === accordionTransition ) {
						effectValues.push( {
							...transitionValues,
							property: 'opacity',
							duration: 0.5,
						} );
					}

					if ( 'slide' === accordionTransition ) {
						effectValues.push( {
							...transitionValues,
							property: 'max-height',
							duration: 0.25,
						} );
					}

					setAttributes( {
						transitions: effectValues,
						useTransition: true,
					} );
				}
			}
		}, [ accordionTransition, transitions ] );

		return (
			<>
				<BlockControls>
					<ToolbarGroup>
						<AddAccordionItem
							clientId={ clientId }
							variantRole={ variantRole }
						/>
					</ToolbarGroup>
				</BlockControls>

				<BlockEdit { ...props } />
			</>
		);
	};
}, 'withAccordion' );

addFilter(
	'editor.BlockEdit',
	'generateblocks/accordion/edit',
	withAccordion,
);

const addCustomAttributes = ( blockHtmlAttributes, blockName, blockAttributes ) => {
	if ( 'generateblocks/container' === blockName ) {
		blockHtmlAttributes = Object.assign(
			blockHtmlAttributes,
			{
				className: classnames( {
					[ blockHtmlAttributes.className ]: true,
					'gb-accordion': 'accordion' === blockAttributes.variantRole,
					'gb-accordion__item': 'accordion-item' === blockAttributes.variantRole,
					'gb-accordion__item-open': 'accordion-item' === blockAttributes.variantRole && !! blockAttributes.accordionItemOpen,
					'gb-accordion__toggle': 'accordion-toggle' === blockAttributes.variantRole,
					'gb-block-is-current': 'accordion-toggle' === blockAttributes.variantRole ? blockAttributes.accordionItemOpen : null,
				} ),
				'data-accordion-multiple-open': !! blockAttributes.accordionMultipleOpen ? true : null,
			}
		);
	}

	if ( 'generateblocks/button' === blockName ) {
		blockHtmlAttributes = Object.assign(
			blockHtmlAttributes,
			{
				className: classnames( {
					[ blockHtmlAttributes.className ]: true,
					'gb-accordion__toggle': 'accordion-toggle' === blockAttributes.variantRole,
					'gb-block-is-current': 'accordion-toggle' === blockAttributes.variantRole && blockAttributes.accordionItemOpen,
				} ),
			}
		);
	}

	return blockHtmlAttributes;
};

addFilter(
	'generateblocks.frontend.htmlAttributes',
	'generateblocks/accordion/add-html-attributes',
	addCustomAttributes
);

const RemoveButtonControls = ( show, props ) => {
	if ( 'generateblocks/button' === props.name && 'accordion-toggle' === props.attributes.variantRole ) {
		show = false;
	}

	return show;
};

addFilter(
	'generateblocks.editor.showButtonAppender',
	'generateblocks/accordion/remove-button-appender',
	RemoveButtonControls
);

addFilter(
	'generateblocks.editor.showButtonLinkControl',
	'generateblocks/accordion/remove-button-link-control',
	RemoveButtonControls
);

addFilter(
	'generateblocks.editor.showButtonContainerControl',
	'generateblocks/accordion/remove-button-container-control',
	RemoveButtonControls
);

function RenderBlocks( props ) {
	const { attributes, context, setAttributes, ref, isSelected, clientId } = props;
	const { variantRole, accordionItemOpen, accordionMultipleOpen } = attributes;
	const { hasSelectedInnerBlock } = useSelect( ( select ) => select( blockEditorStore ), [] );
	const isChildSelected = hasSelectedInnerBlock( clientId, true );

	// Sets the current class on our Toggle.
	useEffect( () => {
		if ( 'accordion-toggle' === variantRole ) {
			setAttributes( { accordionItemOpen: context[ 'generateblocks-pro/accordionItemOpen' ] } );
		}
	}, [ context[ 'generateblocks-pro/accordionItemOpen' ] ] );

	// Sets the initial open tab.
	useEffect( () => {
		if ( 'accordion-item' === variantRole ) {
			const element = ref?.current;

			if ( element && accordionItemOpen ) {
				element.setAttribute( 'data-accordion-is-open', true );

				const accordionToggle = element.querySelector( '.gb-accordion__toggle' );
				const block = accordionToggle.classList.contains( 'gb-button' )
					? 'button'
					: 'container';
				accordionToggle.setAttribute( 'data-' + block + '-is-current', true );
			}
		}
	}, [] );

	useEffect( () => {
		if ( 'accordion' === variantRole ) {
			const element = ref?.current;

			if ( element ) {
				if ( accordionMultipleOpen ) {
					element.setAttribute( 'data-multiple-open', true );
				} else {
					element.removeAttribute( 'data-multiple-open' );
				}
			}
		}
	}, [ accordionMultipleOpen ] );

	// Set the active tab when selecting a tab button or item.
	useEffect( () => {
		if ( 'accordion-toggle' === variantRole && ( isSelected || isChildSelected ) ) {
			setActiveAccordions( ref, 'button' );
		}

		if ( 'accordion-item' === variantRole && isSelected ) {
			setActiveAccordions( ref, 'container' );
		}
	}, [ isSelected, isChildSelected ] );

	useEffect( () => {
		if ( 'accordion-item' === variantRole ) {
			setAttributes( {
				accordionTransition: context[ 'generateblocks-pro/accordionTransition' ],
			} );
		}
	}, [ context[ 'generateblocks-pro/accordionTransition' ] ] );
}

addAction(
	'generateblocks.editor.renderBlock',
	'generateblocks-pro/accordion/renderBlocks',
	RenderBlocks
);
