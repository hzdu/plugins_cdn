import { __ } from '@wordpress/i18n';
import { useSelect, useDispatch } from '@wordpress/data';
import { ToolbarButton } from '@wordpress/components';
import { cloneBlock, createBlocksFromInnerBlocksTemplate } from '@wordpress/blocks';
import { plus } from '@wordpress/icons';
import { template } from './AccordionTemplate';
import OnboardPopover from '../../../../components/onboard-popover';

export default ( props ) => {
	const {
		clientId,
		variantRole,
	} = props;

	const {
		getBlockParentsByBlockName,
		getBlock,
	} = useSelect( ( select ) => select( 'core/block-editor' ), [] );

	const { insertBlocks } = useDispatch( 'core/block-editor' );

	function getClientIdToCopy() {
		let idToCopy = '';
		const thisBlock = getBlock( clientId );

		if ( 'accordion' === variantRole ) {
			const childBlocks = thisBlock.innerBlocks;
			const keys = Object.keys( childBlocks );
			const lastKey = keys[ keys.length - 1 ];

			if ( 'undefined' !== typeof childBlocks[ lastKey ] ) {
				idToCopy = childBlocks[ lastKey ].clientId;
			}
		}

		if ( 'accordion-item' === variantRole ) {
			idToCopy = clientId;
		}

		if ( 'accordion-toggle' === variantRole || 'accordion-content' === variantRole ) {
			idToCopy = getBlockParentsByBlockName( clientId, 'generateblocks/container', true )
				.find( ( block ) => 'accordion-item' === getBlock( block )?.attributes?.variantRole );
		}

		return idToCopy;
	}

	return (
		<>
			<ToolbarButton
				icon={ plus }
				label={ __( 'Add Accordion Item', 'generateblocks-pro' ) }
				onClick={ () => {
					const idToCopy = getClientIdToCopy();

					const accordionId = 'accordion' === variantRole
						? clientId
						: getBlockParentsByBlockName( clientId, 'generateblocks/container', true )
							.find( ( block ) => 'accordion' === getBlock( block )?.attributes?.variantRole );

					if ( idToCopy ) {
						const blockToCopy = getBlock( idToCopy );

						const clonedBlock = cloneBlock(
							blockToCopy,
							{
								uniqueId: '',
								accordionItemOpen: false,
							}
						);

						insertBlocks( clonedBlock, undefined, accordionId );
					} else {
						insertBlocks( createBlocksFromInnerBlocksTemplate( template ), undefined, accordionId );
					}
				} }
				showTooltip
			/>
			<OnboardPopover onboardingKey="add_accordion_item">
				<h3>{ __( 'Add Accordion Item', 'generateblocks-pro' ) }</h3>
				<p>{ __( 'You can use this button to add new accordion items.', 'generateblocks-pro' ) }</p>
			</OnboardPopover>
		</>
	);
};
