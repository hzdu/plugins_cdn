import { getTabAreaClientId } from '../utils';
import { __ } from '@wordpress/i18n';
import { useSelect, useDispatch } from '@wordpress/data';
import { ToolbarButton } from '@wordpress/components';
import { cloneBlock, createBlocksFromInnerBlocksTemplate } from '@wordpress/blocks';
import { plus } from '@wordpress/icons';
import OnboardPopover from '../../../../components/onboard-popover';
import { defaultTabButtonTemplate, defaultTabContentTemplate } from '../templates/Horizontal';

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

	const { insertBlocks } = useDispatch( 'core/block-editor' );

	return (
		<>
			<ToolbarButton
				className="gblocks-block-control-icon gblocks-add-grid-item"
				icon={ plus }
				label={ __( 'Add Tab Item', 'generateblocks-pro' ) }
				onClick={ () => {
					const buttonContainerId = getTabAreaClientId( tabsContainer.innerBlocks, 'tab-buttons' ).find( Boolean );
					const tabItemsContainerId = getTabAreaClientId( tabsContainer.innerBlocks, 'tab-items' ).find( Boolean );
					const tabButtons = getBlocks( buttonContainerId );
					const tabItems = getBlocks( tabItemsContainerId );
					const blockIndex = 'tab-item' === variantRole || 'tab-button' === variantRole
						? getBlockIndex( clientId )
						: tabButtons.length - 1;

					if ( tabButtons ) {
						const button = tabButtons[ blockIndex ];
						const clonedButton = button
							? cloneBlock( button, { uniqueId: '', tabItemOpen: false } )
							: createBlocksFromInnerBlocksTemplate( [ defaultTabButtonTemplate ] );

						insertBlocks( clonedButton, blockIndex + 1, buttonContainerId, false );
					}

					if ( tabItems ) {
						const item = tabItems[ blockIndex ];
						const clonedItem = item
							? cloneBlock( item, { uniqueId: '', tabItemOpen: false } )
							: createBlocksFromInnerBlocksTemplate( [ defaultTabContentTemplate ] );

						insertBlocks( clonedItem, blockIndex + 1, tabItemsContainerId, false );
					}
				} }
				showTooltip
			/>
			<OnboardPopover onboardingKey="add_tab_item">
				<h3>{ __( 'Add Tab Item', 'generateblocks-pro' ) }</h3>
				<p>{ __( 'You can use this button to add new tab items.', 'generateblocks-pro' ) }</p>
			</OnboardPopover>
		</>
	);
};
