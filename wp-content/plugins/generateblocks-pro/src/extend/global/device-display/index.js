import './editor.scss';
import addToCSS from '../../../utils/add-to-css';
/**
 * WordPress Dependencies
 */
import {
	__,
} from '@wordpress/i18n';

import {
	addFilter,
	currentFilter,
	applyFilters,
} from '@wordpress/hooks';

import {
	Fragment,
} from '@wordpress/element';

import {
	InspectorAdvancedControls,
} from '@wordpress/block-editor';

import {
	createHigherOrderComponent,
} from '@wordpress/compose';

import { ToggleControl, Notice } from '@wordpress/components';

const allowedBlocks = [ 'generateblocks/container', 'generateblocks/button', 'generateblocks/button-container', 'generateblocks/headline', 'generateblocks/image' ];

/**
 * Add custom attribute for mobile visibility.
 *
 * @param {Object} settings Settings for the block.
 *
 * @return {Object} settings Modified settings.
 */
function addAttributes( settings ) {
	if ( ! allowedBlocks.includes( settings.name ) ) {
		return settings;
	}

	if ( typeof settings.attributes !== 'undefined' ) {
		settings.attributes = Object.assign( settings.attributes, {
			hideOnDesktop: {
				type: 'boolean',
				default: false,
			},
			hideOnTablet: {
				type: 'boolean',
				default: false,
			},
			hideOnMobile: {
				type: 'boolean',
				default: false,
			},
		} );
	}

	return settings;
}

/**
 * Add mobile visibility controls on Advanced Block Panel.
 *
 * @param {Function} BlockEdit Block edit component.
 *
 * @return {Function} BlockEdit Modified block edit component.
 */
const withAdvancedControls = createHigherOrderComponent(
	( BlockEdit ) => {
		return ( props ) => {
			if ( props.isSelected && allowedBlocks.includes( props.name ) ) {
				const {
					attributes,
					setAttributes,
				} = props;

				const {
					hideOnDesktop,
					hideOnTablet,
					hideOnMobile,
				} = attributes;

				return (
					<Fragment>
						<BlockEdit { ...props } />

						<InspectorAdvancedControls>
							<ToggleControl
								label={ __( 'Hide on desktop', 'generateblocks-pro' ) }
								checked={ !! hideOnDesktop }
								onChange={ ( value ) => {
									setAttributes( {
										hideOnDesktop: value,
									} );
								} }
							/>

							<ToggleControl
								label={ __( 'Hide on tablet', 'generateblocks-pro' ) }
								checked={ !! hideOnTablet }
								onChange={ ( value ) => {
									setAttributes( {
										hideOnTablet: value,
									} );
								} }
							/>

							<ToggleControl
								label={ __( 'Hide on mobile', 'generateblocks-pro' ) }
								checked={ !! hideOnMobile }
								onChange={ ( value ) => {
									setAttributes( {
										hideOnMobile: value,
									} );
								} }
							/>
						</InspectorAdvancedControls>
					</Fragment>
				);
			}

			return <BlockEdit { ...props } />;
		};
	},
	'withAdvancedControls'
);

function addCSS( css, props ) {
	const {
		clientId,
	} = props;

	const attributes = applyFilters( 'generateblocks.editor.cssAttrs', props.attributes, props );

	const {
		uniqueId,
		hideOnDesktop,
		hideOnTablet,
		hideOnMobile,
		isGrid,
	} = attributes;

	let hideOnDevice = hideOnDesktop;

	if ( 'generateblocks.editor.tabletOnlyCSS' === currentFilter() ) {
		hideOnDevice = hideOnTablet;
	} else if ( 'generateblocks.editor.mobileCSS' === currentFilter() ) {
		hideOnDevice = hideOnMobile;
	}

	if ( hideOnDevice ) {
		addToCSS( css, '.editor-styles-wrapper [data-block="' + clientId + '"]', {
			display: 'none !important',
		} );

		if ( isGrid ) {
			addToCSS( css, '.gb-grid-column-' + uniqueId, {
				display: 'none',
			} );
		}
	}

	return css;
}

function DeviceMessage( props ) {
	const {
		device,
		attributes,
		setAttributes,
	} = props;

	const {
		hideOnDesktop,
		hideOnTablet,
		hideOnMobile,
	} = attributes;

	return (
		<>
			{ 'Desktop' === device &&
				<ToggleControl
					label={ __( 'Hide on desktop', 'generateblocks-pro' ) }
					checked={ !! hideOnDesktop }
					onChange={ ( value ) => {
						setAttributes( {
							hideOnDesktop: value,
						} );
					} }
					help={ __( 'This block is hidden on this device.', 'generateblocks-pro' ) }
				/>
			}

			{ 'Tablet' === device &&
				<ToggleControl
					label={ __( 'Hide on tablet', 'generateblocks-pro' ) }
					checked={ !! hideOnTablet }
					onChange={ ( value ) => {
						setAttributes( {
							hideOnTablet: value,
						} );
					} }
					help={ __( 'This block is hidden on this device.', 'generateblocks-pro' ) }
				/>
			}

			{ 'Mobile' === device &&
				<ToggleControl
					label={ __( 'Hide on mobile', 'generateblocks-pro' ) }
					checked={ !! hideOnMobile }
					onChange={ ( value ) => {
						setAttributes( {
							hideOnMobile: value,
						} );
					} }
					help={ __( 'This block is hidden on this device.', 'generateblocks-pro' ) }
				/>
			}
		</>
	);
}

// Old device message using GB < 1.7.0.
function addLegacyDeviceMessage( output, id, data ) {
	if ( 'afterResponsiveTabs' !== id ) {
		return output;
	}

	const {
		selectedDevice,
		attributes,
		setAttributes,
	} = data;

	const {
		hideOnDesktop,
		hideOnTablet,
		hideOnMobile,
	} = attributes;

	if (
		( 'Desktop' === selectedDevice && ! hideOnDesktop ) ||
		( 'Tablet' === selectedDevice && ! hideOnTablet ) ||
		( 'Mobile' === selectedDevice && ! hideOnMobile )
	) {
		return output;
	}

	return (
		<Fragment>
			<Notice
				className="gblocks-device-hidden-notice"
				status="info"
				isDismissible={ false }
			>
				<DeviceMessage
					device={ selectedDevice }
					attributes={ attributes }
					setAttributes={ setAttributes }
				/>
			</Notice>

			{ output }
		</Fragment>
	);
}

function addDeviceMessage( content, props ) {
	const {
		device,
		name,
		attributes,
		setAttributes,
	} = props;

	if ( ! allowedBlocks.includes( name ) ) {
		return content;
	}

	const {
		hideOnDesktop,
		hideOnTablet,
		hideOnMobile,
	} = attributes;

	if (
		( 'Desktop' === device && ! hideOnDesktop ) ||
		( 'Tablet' === device && ! hideOnTablet ) ||
		( 'Mobile' === device && ! hideOnMobile )
	) {
		return content;
	}

	return (
		<>
			<DeviceMessage
				device={ device }
				attributes={ attributes }
				setAttributes={ setAttributes }
			/>

			{ content }
		</>
	);
}

addFilter(
	'generateblocks.editor.settingsPanel',
	'generateblocks/device-display/add-notice',
	addDeviceMessage
);

addFilter(
	'blocks.registerBlockType',
	'generateblocks-pro/device-display/add-attributes',
	addAttributes
);

addFilter(
	'editor.BlockEdit',
	'generateblocks-pro/device-display/add-control',
	withAdvancedControls
);

addFilter(
	'generateblocks.editor.desktopCSS',
	'generateblocks-pro/device-display/add-desktop-css',
	addCSS
);

addFilter(
	'generateblocks.editor.tabletOnlyCSS',
	'generateblocks-pro/device-display/add-tablet-only-css',
	addCSS
);

addFilter(
	'generateblocks.editor.mobileCSS',
	'generateblocks-pro/device-display/add-mobile-css',
	addCSS
);

addFilter(
	'generateblocks.editor.controls',
	'generateblocks-pro/device-display/add-hidden-message',
	addLegacyDeviceMessage
);
