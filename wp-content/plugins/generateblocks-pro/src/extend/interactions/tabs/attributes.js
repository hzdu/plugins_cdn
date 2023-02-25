import { addFilter } from '@wordpress/hooks';

const attributes = ( settings ) => {
	if ( 'undefined' === typeof settings.attributes ) {
		return settings;
	}

	if ( 'generateblocks/container' === settings.name ) {
		settings.attributes = Object.assign(
			settings.attributes, {
				defaultOpenedTab: {
					type: 'string',
					default: '',
				},
				tabItemOpen: {
					type: 'boolean',
					default: false,
				},
				syncTabItemStyles: {
					type: 'boolean',
					default: true,
				},
				tabButtonsType: {
					type: 'string',
					default: 'button',
				},
				tabTransition: {
					type: 'string',
					default: '',
				},
			}
		);

		settings.providesContext = Object.assign(
			settings.providesContext, {
				'generateblocks-pro/tabTransition': 'tabTransition',
			},
		);

		settings.usesContext = [
			...settings.usesContext,
			'generateblocks-pro/tabTransition',
		];
	}

	if ( 'generateblocks/button' === settings.name ) {
		settings.attributes = Object.assign(
			settings.attributes, {
				tabItemOpen: {
					type: 'boolean',
					default: false,
				},
			}
		);
	}

	return settings;
};

addFilter(
	'blocks.registerBlockType',
	'generateblocks-pro/tabs/attributes',
	attributes
);
