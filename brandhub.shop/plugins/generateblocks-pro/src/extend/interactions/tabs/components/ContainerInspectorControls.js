import { useEffect, useRef, useState } from '@wordpress/element';
import { store as blockEditorStore } from '@wordpress/block-editor';
import { addFilter } from '@wordpress/hooks';
import { sprintf, __ } from '@wordpress/i18n';
import { SelectControl, ToggleControl } from '@wordpress/components';
import { useDispatch, useSelect } from '@wordpress/data';
import { createBlock } from '@wordpress/blocks';
import { getTabAreaClientId } from '../utils';

function TabsSettingPanels( content, props ) {
	const { attributes, setAttributes, clientId, name } = props;
	const { variantRole, defaultOpenedTab, syncTabItemStyles, tabButtonsType, tabTransition } = attributes;
	const { getBlock, getBlocks } = useSelect( ( select ) => select( blockEditorStore ), [] );
	const { updateBlockAttributes, replaceBlocks } = useDispatch( blockEditorStore );
	const onMount = useRef( true );
	const [ tabItems, setTabItems ] = useState( {} );

	useEffect( () => {
		if ( onMount.current ) {
			onMount.current = false;
			return;
		}

		const indexNumber = defaultOpenedTab - 1;
		const newAttributes = {};
		const clientIds = tabItems.buttonIds.concat( tabItems.tabIds );

		tabItems?.tabIds?.forEach( ( itemClientId, index ) => {
			newAttributes[ itemClientId ] = {
				tabItemOpen: String( index ) === String( indexNumber ) ? true : false,
			};
		} );

		tabItems?.buttonIds?.forEach( ( itemClientId, index ) => {
			newAttributes[ itemClientId ] = {
				tabItemOpen: String( index ) === String( indexNumber ) ? true : false,
			};
		} );

		updateBlockAttributes( clientIds, newAttributes, true );
	}, [ defaultOpenedTab ] );

	// An expensive variable, but we limit it to the Tabs block.
	const innerBlocks = 'tabs' === variantRole ? getBlock( clientId )?.innerBlocks : [];

	useEffect( () => {
		if ( 'tabs' === variantRole ) {
			const tabItemClientIds = [];
			const tabButtonClientIds = [];

			const tabItemsContainer = innerBlocks.length ? innerBlocks.filter( ( block ) => 'tab-items' === block.attributes.variantRole ) : [];

			if ( tabItemsContainer.length ) {
				tabItemsContainer[ 0 ].innerBlocks.forEach( ( block ) => tabItemClientIds.push( block.clientId ) );
			}

			const tabButtonsContainer = innerBlocks.length ? innerBlocks.filter( ( block ) => 'tab-buttons' === block.attributes.variantRole ) : [];

			if ( tabButtonsContainer.length ) {
				tabButtonsContainer[ 0 ].innerBlocks.forEach( ( block ) => tabButtonClientIds.push( block.clientId ) );
			}

			setTabItems( {
				...tabItems,
				tabIds: tabItemClientIds,
				buttonIds: tabButtonClientIds,
			} );
		}
	}, [ innerBlocks ] );

	const isTabBlock = 'generateblocks/container' === name && 'tabs' === variantRole;

	if ( ! props.isSelected || ! isTabBlock ) {
		return content;
	}

	const tabIdOptions = [ { label: __( 'Select…', 'generateblocks-pro' ), value: '' } ];

	if ( tabItems?.tabIds?.length ) {
		tabItems.tabIds.forEach( ( id, index ) => {
			const count = index + 1;

			tabIdOptions.push( {
				/* translators: Tab number */
				label: sprintf( __( 'Tab %s', 'generateblocks-pro' ), count ),
				value: count,
			} );
		} );
	}

	return (
		<>
			{ 'tabs' === variantRole &&
				<>
					<SelectControl
						label={ __( 'Default opened tab', 'generateblocks-pro' ) }
						options={ tabIdOptions }
						value={ defaultOpenedTab }
						onChange={ ( value ) => {
							setAttributes( { defaultOpenedTab: value } );
						} }
					/>

					<SelectControl
						label={ __( 'Transition', 'generateblocks-pro' ) }
						options={ [
							{ value: '', label: __( 'None', 'generateblocks-pro' ) },
							{ value: 'fade', label: __( 'Fade', 'generateblocks-pro' ) },
						] }
						value={ tabTransition }
						onChange={ ( value ) => setAttributes( { tabTransition: value } ) }
					/>

					<ToggleControl
						label={ __( 'Sync tab item styles', 'generateblocks-pro' ) }
						checked={ !! syncTabItemStyles }
						onChange={ ( value ) => setAttributes( { syncTabItemStyles: value } ) }
					/>

					<SelectControl
						label={ __( 'Tab button type', 'generateblocks-pro' ) }
						options={ [
							{ value: 'button', label: __( 'Button', 'generateblocks-pro' ) },
							{ value: 'container', label: __( 'Container', 'generateblocks-pro' ) },
						] }
						value={ tabButtonsType }
						onChange={ ( value ) => {
							setAttributes( { tabButtonsType: value } );

							const tabChildren = getBlocks( clientId );
							const buttonContainerId = getTabAreaClientId( tabChildren, 'tab-buttons' ).find( Boolean );
							const buttons = getBlocks( buttonContainerId );
							const clientIds = [];
							const blocks = [];

							buttons.forEach( ( button ) => {
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

								blocks.push( newBlock );
							} );

							if ( blocks.length ) {
								replaceBlocks( clientIds, blocks );
							}
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
	'generateblocks-pro/tabs/containerSettingsPanel',
	TabsSettingPanels
);
