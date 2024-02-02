import { getTabAreaClientId } from '../utils';
import { __ } from '@wordpress/i18n';
import { useSelect, useDispatch } from '@wordpress/data';
import { MenuItem } from '@wordpress/components';
import { useEffect, render } from '@wordpress/element';

export default ( props ) => {
	const {
		clientId,
		tabsContainer,
		variantRole,
	} = props;

	const {
		getBlockIndex,
		getBlocks,
	} = useSelect( ( select ) => select( 'core/block-editor' ), [] );

	const { removeBlocks } = useDispatch( 'core/block-editor' );

	const Item = <MenuItem
		icon="trash"
		onClick={ () => {
			const buttonContainerId = getTabAreaClientId( tabsContainer.innerBlocks, 'tab-buttons' ).find( Boolean );
			const tabItemsContainerId = getTabAreaClientId( tabsContainer.innerBlocks, 'tab-items' ).find( Boolean );
			const blockIndex = getBlockIndex( clientId );
			const tabButtons = getBlocks( buttonContainerId );
			const tabItems = getBlocks( tabItemsContainerId );
			const blocksToRemove = [];

			if ( tabButtons ) {
				const button = tabButtons[ blockIndex ]?.clientId;
				blocksToRemove.push( button );
			}

			if ( tabItems ) {
				const item = tabItems[ blockIndex ]?.clientId;
				blocksToRemove.push( item );
			}

			removeBlocks( blocksToRemove );
		} }
	>
		{ 'tab-item' === variantRole
			? __( 'Remove Tab Item & Button', 'generateblocks-pro' )
			: __( 'Remove Tab Button & Item', 'generateblocks-pro' )
		}
	</MenuItem>;

	useEffect( () => {
		if ( 'tab-item' === variantRole || 'tab-button' === variantRole ) {
			// Target the last item which should be the Remove Block button.
			const deleteBlockElement = document.querySelector( '.components-menu-group:last-child' );

			if ( ! deleteBlockElement.querySelector( '.gb-remove-tab-item' ) ) {
				const tabRemovalWrapper = document.createElement( 'div' );
				tabRemovalWrapper.classList.add( 'gb-remove-tab-item' );
				tabRemovalWrapper.setAttribute( 'role', 'group' );
				deleteBlockElement.append( tabRemovalWrapper );

				// Insert our button after the Removal Block button.
				render(
					Item,
					tabRemovalWrapper
				);
			}
		}
	}, [] );

	return null;
};
