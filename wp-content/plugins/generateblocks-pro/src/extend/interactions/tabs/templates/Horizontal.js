import { __ } from '@wordpress/i18n';

const buttonAttributes = {
	variantRole: 'tab-button',
	backgroundColorCurrent: '#fafafa',
	textColorCurrent: '#000000',
	buttonType: 'button',
	flexGrowMobile: 1,
	flexShrinkMobile: 0,
};

const tabAttributes = {
	variantRole: 'tab-item',
	paddingTop: '20',
	paddingRight: '20',
	paddingBottom: '20',
	paddingLeft: '20',
};

export const defaultTabButtonTemplate = [ 'generateblocks/button',
	{
		...generateBlocksPro?.blockStyles?.button,
		text: __( 'Tab 1', 'generateblocks' ),
		tabItemOpen: true,
		...buttonAttributes,
	},
];

export const defaultTabContentTemplate = [ 'generateblocks/container',
	{
		tabItemOpen: true,
		...tabAttributes,
	},
	[
		[ 'core/paragraph',
			{
				content: __( 'Tab 1 content.', 'generateblocks' ),
			},
		],
	],
];

const template = [
	[ 'generateblocks/container',
		{
			variantRole: 'tab-buttons',
			display: 'inline-flex',
			overflowXMobile: 'auto',
			sizing: {
				maxWidthMobile: '100%',
			},
		},
		[
			defaultTabButtonTemplate,
			[ 'generateblocks/button',
				{
					...generateBlocksPro?.blockStyles?.button,
					text: __( 'Tab 2', 'generateblocks' ),
					...buttonAttributes,
				},
			],
		],
	],
	[ 'generateblocks/container',
		{
			variantRole: 'tab-items',
			backgroundColor: '#fafafa',
		},
		[
			defaultTabContentTemplate,
			[ 'generateblocks/container',
				tabAttributes,
				[
					[ 'core/paragraph',
						{
							content: __( 'Tab 2 content.', 'generateblocks' ),
						},
					],
				],
			],
		],
	],
];

export default template;
