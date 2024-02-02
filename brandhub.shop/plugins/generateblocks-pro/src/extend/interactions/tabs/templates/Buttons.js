import { __ } from '@wordpress/i18n';

const buttonAttributes = {
	variantRole: 'tab-button',
	backgroundColorCurrent: generateBlocksPro?.blockStyles?.button.backgroundColorHover,
	textColorCurrent: generateBlocksPro?.blockStyles?.button.textColorHover,
	buttonType: 'button',
	flexGrowMobile: 1,
	flexShrinkMobile: 0,
};

const tabAttributes = {
	variantRole: 'tab-item',
};

const template = [
	[ 'generateblocks/container',
		{
			variantRole: 'tab-buttons',
			display: 'flex',
			justifyContent: 'center',
			columnGap: '10px',
			overflowXMobile: 'auto',
			sizing: {
				maxWidthMobile: '100%',
			},
		},
		[
			[ 'generateblocks/button',
				{
					...generateBlocksPro?.blockStyles?.button,
					text: __( 'Tab 1', 'generateblocks' ),
					tabItemOpen: true,
					...buttonAttributes,
				},
			],
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
		},
		[
			[ 'generateblocks/container',
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
			],
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
