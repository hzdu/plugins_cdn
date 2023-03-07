import { addAction, addFilter } from '@wordpress/hooks';
import classnames from 'classnames';
import { createHigherOrderComponent } from '@wordpress/compose';
import { useSelect, useDispatch } from '@wordpress/data';
import { ToolbarGroup } from '@wordpress/components';
import { BlockControls, BlockSettingsMenuControls, store as blockEditorStore } from '@wordpress/block-editor';
import { useEffect, useRef, useState } from '@wordpress/element';
import DeleteTabItem from './components/DeleteTabItem';
import AddTabItem from './components/AddTabItem';
import { getSiblings, setActiveTabs } from './utils';
import noStyleAttributes from '../../../utils/no-style-attributes';
import { isEqual, omit, isEmpty } from 'lodash';
import { transitionExists } from '../../../components/effect-panel-item/utils';

const withTabs = createHigherOrderComponent( ( BlockEdit ) => {
	return ( props ) => {
		const {
			name,
			attributes,
			clientId,
			isSelected,
			setAttributes,
		} = props;

		const {
			variantRole,
			lock,
		} = attributes;

		const isTabItem = ( 'generateblocks/container' === name || 'generateblocks/button' === name ) && variantRole && variantRole.includes( 'tab' );

		if ( ! isTabItem ) {
			return <BlockEdit { ...props } />;
		}

		const { getBlock, getBlockParentsByBlockName, getBlocks } = useSelect( ( select ) => select( blockEditorStore ), [] );
		const { updateBlockAttributes } = useDispatch( blockEditorStore );
		const [ currentClientId ] = useState( clientId );
		const firstUpdate = useRef( true );
		const attributesRef = useRef( omit( attributes, noStyleAttributes ) );

		function getTabsContainer() {
			let tabsContainer = '';

			if ( 'tab-button' === variantRole || 'tab-item' === variantRole || 'tab-buttons' === variantRole || 'tab-items' === variantRole ) {
				const tabContainerClientId = getBlockParentsByBlockName( clientId, 'generateblocks/container', true )
					.find( ( block ) => 'tabs' === getBlock( block )?.attributes?.variantRole );

				tabsContainer = getBlock( tabContainerClientId );
			}

			if ( 'tabs' === variantRole ) {
				tabsContainer = getBlock( clientId );
			}

			return tabsContainer;
		}

		function syncTabStyles( role ) {
			const shouldSyncStyles = getTabsContainer()?.attributes?.syncTabItemStyles;

			if ( ! shouldSyncStyles ) {
				return;
			}

			const omittedAttributes = omit( attributes, noStyleAttributes );

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

			const containerId = getBlockParentsByBlockName( clientId, 'generateblocks/container', true )
				.find( ( block ) => role === getBlock( block )?.attributes?.variantRole );

			const itemIds = getBlocks( containerId )
				.map( ( block ) => block.clientId !== clientId ? block.clientId : null )
				.filter( ( value ) => value );

			updateBlockAttributes( itemIds, changedAttributes );
		}

		useEffect( () => {
			if ( ( 'tab-items' === variantRole || 'tab-buttons' === variantRole ) && ! lock ) {
				setAttributes( {
					lock: {
						remove: true,
					},
				} );
			}
		}, [] );

		// Sync tab styles whenever attributes are changed.
		useEffect( () => {
			if ( firstUpdate.current ) {
				firstUpdate.current = false;
				return;
			}

			// Check current clientId to prevent infinite loop updating attributes.
			if ( clientId === currentClientId && isSelected ) {
				if ( 'tab-button' === variantRole ) {
					syncTabStyles( 'tab-buttons' );
				}

				if ( 'tab-item' === variantRole ) {
					syncTabStyles( 'tab-items' );
				}
			}
		}, [ JSON.stringify( attributes ) ] );

		return (
			<>
				{ ( 'tab-item' === variantRole || 'tab-button' === variantRole ) && isSelected &&
					<BlockSettingsMenuControls>
						<DeleteTabItem
							clientId={ clientId }
							tabsContainer={ getTabsContainer() }
							variantRole={ variantRole }
						/>
					</BlockSettingsMenuControls>
				}

				<BlockControls>
					<ToolbarGroup>
						<AddTabItem
							clientId={ clientId }
							tabsContainer={ getTabsContainer() }
							variantRole={ variantRole }
						/>
					</ToolbarGroup>
				</BlockControls>

				<BlockEdit { ...props } />
			</>
		);
	};
}, 'withTabs' );

addFilter(
	'editor.BlockEdit',
	'generateblocks/tabs/inspectorControls',
	withTabs
);

function RenderBlocks( props ) {
	const { attributes, ref, isSelected, name, clientId, context, setAttributes } = props;
	const { variantRole, tabItemOpen, transitions } = attributes;
	const { hasSelectedInnerBlock } = useSelect( ( select ) => select( blockEditorStore ), [] );
	const isChildSelected = hasSelectedInnerBlock( clientId, true );

	// Sets the initial open tab.
	useEffect( () => {
		if ( 'tab-item' === variantRole || 'tab-button' === variantRole ) {
			const element = ref?.current;

			if ( element && tabItemOpen ) {
				if ( 'tab-item' === variantRole ) {
					const openTabs = getSiblings( element ).filter( ( sibling ) => sibling.getAttribute( 'data-tab-is-open' ) );

					if ( ! openTabs.length ) {
						element.setAttribute( 'data-tab-is-open', true );
					}
				}

				if ( 'tab-button' === variantRole ) {
					const block = 'generateblocks/button' === name
						? 'button'
						: 'container';

					const openTabs = getSiblings( element ).filter( ( sibling ) => sibling.getAttribute( 'data-' + block + '-is-current' ) );

					if ( ! openTabs.length ) {
						element.setAttribute( 'data-' + block + '-is-current', true );
					}
				}
			}
		}
	}, [] );

	// Set the active tab when selecting a tab button or item.
	useEffect( () => {
		if ( 'tab-button' === variantRole && ( isSelected || isChildSelected ) ) {
			setActiveTabs( ref, 'button' );
		}

		if ( 'tab-item' === variantRole && isSelected ) {
			setActiveTabs( ref, 'container' );
		}
	}, [ isSelected, isChildSelected ] );

	useEffect( () => {
		if ( 'tab-items' === variantRole ) {
			setAttributes( {
				tabTransition: context[ 'generateblocks-pro/tabTransition' ],
			} );
		}
	}, [ context[ 'generateblocks-pro/tabTransition' ] ] );

	// Add transitions effects.
	useEffect( () => {
		if ( 'tab-item' === variantRole ) {
			const effectValues = [ ...transitions ];
			const tabTransition = context[ 'generateblocks-pro/tabTransition' ];
			const transitionValues = {
				state: 'normal',
				target: 'self',
				customSelector: '',
				timingFunction: 'ease',
				delay: '',
			};

			const transitionIndex = transitions.findIndex( ( x ) => 'opacity' === x.property );

			if ( transitionExists( 'self', '', transitions ) && -1 !== transitionIndex ) {
				if ( '' === tabTransition ) {
					effectValues.splice( transitionIndex, 1 );

					setAttributes( {
						transitions: effectValues,
						useTransition: !! effectValues.length,
					} );
				}
			} else if ( 'fade' === tabTransition ) {
				effectValues.push( {
					...transitionValues,
					property: 'opacity',
					duration: 0.5,
				} );

				setAttributes( {
					transitions: effectValues,
					useTransition: true,
				} );
			}
		}
	}, [ context[ 'generateblocks-pro/tabTransition' ] ] );
}

addAction(
	'generateblocks.editor.renderBlock',
	'generateblocks-pro/tabs/renderBlocks',
	RenderBlocks
);

const addCustomAttributes = ( blockHtmlAttributes, blockName, blockAttributes ) => {
	if ( 'generateblocks/container' === blockName ) {
		blockHtmlAttributes = Object.assign(
			blockHtmlAttributes,
			{
				className: classnames( {
					[ blockHtmlAttributes.className ]: true,
					'gb-tabs': 'tabs' === blockAttributes.variantRole,
					'gb-tabs__items': 'tab-items' === blockAttributes.variantRole,
					'gb-tabs__item': 'tab-item' === blockAttributes.variantRole,
					'gb-tabs__buttons': 'tab-buttons' === blockAttributes.variantRole,
					'gb-tabs__item-open': 'tab-button' !== blockAttributes.variantRole ? blockAttributes.tabItemOpen : null,
					'gb-tabs__button': 'tab-button' === blockAttributes.variantRole,
					'gb-block-is-current': 'tab-button' === blockAttributes.variantRole ? blockAttributes.tabItemOpen : null,
				} ),
				'data-opened-tab': blockAttributes.defaultOpenedTab || null,
			}
		);
	}

	if ( 'generateblocks/button' === blockName ) {
		blockHtmlAttributes = Object.assign(
			blockHtmlAttributes,
			{
				className: classnames( {
					[ blockHtmlAttributes.className ]: true,
					'gb-tabs__button': 'tab-button' === blockAttributes.variantRole,
					'gb-block-is-current': blockAttributes.tabItemOpen,
				} ),
			}
		);
	}

	return blockHtmlAttributes;
};

addFilter(
	'generateblocks.frontend.htmlAttributes',
	'generateblocks-pro/tabs/add-html-attributes',
	addCustomAttributes
);

const RemoveButtonControls = ( show, props ) => {
	if ( 'generateblocks/button' === props.name && 'tab-button' === props.attributes.variantRole ) {
		show = false;
	}

	return show;
};

addFilter(
	'generateblocks.editor.showButtonAppender',
	'generateblocks-pro/tabs/remove-button-appender',
	RemoveButtonControls
);

addFilter(
	'generateblocks.editor.showButtonLinkControl',
	'generateblocks-pro/tabs/remove-button-link-control',
	RemoveButtonControls
);

addFilter(
	'generateblocks.editor.showButtonContainerControl',
	'generateblocks-pro/tabs/remove-button-container-control',
	RemoveButtonControls
);
