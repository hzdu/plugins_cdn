
import { addFilter } from '@wordpress/hooks';
import { __ } from '@wordpress/i18n';
import { SelectControl, ToggleControl } from '@wordpress/components';
import { getAccordionItemIds } from '../utils';
import { store as blockEditorStore } from '@wordpress/block-editor';
import { useDispatch, useSelect } from '@wordpress/data';
import { createBlock } from '@wordpress/blocks';
import { iconAttributes } from './AccordionTemplate';

function AccordionSettingsPanel( content, props ) {
	const { attributes, setAttributes, name, clientId } = props;
	const { variantRole, accordionMultipleOpen, accordionItemOpen, syncAccordionItemStyles, accordionTransition, accordionToggleType } = attributes;
	const { getBlock, getBlocks } = useSelect( ( select ) => select( blockEditorStore ), [] );
	const { replaceBlock } = useDispatch( blockEditorStore );

	if ( 'accordion' !== variantRole && 'accordion-item' !== variantRole ) {
		return content;
	}

	if ( 'generateblocks/container' !== name ) {
		return content;
	}

	return (
		<>
			{ 'accordion' === variantRole &&
				<>
					<ToggleControl
						label={ __( 'Keep multiple items open', 'generateblocks' ) }
						checked={ !! accordionMultipleOpen }
						onChange={ ( value ) => {
							setAttributes( {
								accordionMultipleOpen: value,
							} );
						} }
					/>

					<ToggleControl
						label={ __( 'Sync accordion item styles', 'generateblocks-pro' ) }
						checked={ !! syncAccordionItemStyles }
						onChange={ ( value ) => setAttributes( { syncAccordionItemStyles: value } ) }
					/>

					<SelectControl
						label={ __( 'Transition', 'generateblocks' ) }
						value={ accordionTransition }
						onChange={ ( value ) => setAttributes( { accordionTransition: value } ) }
						options={ [
							{ value: '', label: __( 'None', 'generateblocks-pro' ) },
							{ value: 'slide', label: __( 'Slide', 'generateblocks-pro' ) },
							{ value: 'fade', label: __( 'Fade', 'generateblocks-pro' ) },
						] }
					/>

					<SelectControl
						label={ __( 'Accordion title type', 'generateblocks-pro' ) }
						options={ [
							{ value: 'button', label: __( 'Button', 'generateblocks-pro' ) },
							{ value: 'container', label: __( 'Container', 'generateblocks-pro' ) },
						] }
						value={ accordionToggleType }
						onChange={ ( value ) => {
							setAttributes( { accordionToggleType: value } );

							const accordionItems = getBlocks( clientId );
							const buttons = getAccordionItemIds( accordionItems, 'accordion-toggle', { clientId } );
							const clientIds = [];
							const blocks = [];

							buttons.forEach( ( buttonId ) => {
								const button = getBlock( buttonId );
								clientIds.push( button.clientId );
								let newBlock = false;

								if ( 'button' === value ) {
									let text = '';

									if ( button.innerBlocks.length ) {
										const textBlock = button.innerBlocks.find( ( innerBlock ) =>
											'generateblocks/headline' === innerBlock.name ||
											'core/paragraph' === innerBlock.name ||
											'core/heading' === innerBlock.name
										);

										if ( textBlock?.attributes?.content ) {
											text = textBlock?.attributes?.content;
										}
									}

									newBlock = createBlock(
										'generateblocks/button',
										{
											...button.attributes,
											...iconAttributes,
											display: 'inline-flex',
											text,
											buttonType: 'button',
										}
									);
								}

								if ( 'container' === value ) {
									newBlock = createBlock(
										'generateblocks/container',
										{
											...button.attributes,
											display: '',
										},
										[
											createBlock(
												'generateblocks/headline',
												{
													content: button?.attributes?.text,
													element: 'p',
												} ),
										]
									);
								}

								replaceBlock( buttonId, newBlock );

								blocks.push( newBlock );
							} );

							// if ( blocks.length ) {
							// 	replaceBlocks( clientIds, blocks );
							// }
						} }
					/>

					<ToggleControl
						label={ __( 'Enable FAQ schema', 'generateblocks' ) }
						checked={ !! attributes.faqSchema }
						onChange={ ( value ) => setAttributes( { faqSchema: value } ) }
					/>
				</>
			}

			{ 'accordion-item' === variantRole &&
				<>
					<ToggleControl
						label={ __( 'Item open by default', 'generateblocks-pro' ) }
						checked={ !! accordionItemOpen }
						onChange={ ( value ) => {
							setAttributes( {
								accordionItemOpen: value,
							} );
						} }
					/>
				</>
			}

			{ content }
		</>
	);
}

addFilter(
	'generateblocks.editor.settingsPanel',
	'generateblocks/accordion/containerSettingsPanel',
	AccordionSettingsPanel
);
