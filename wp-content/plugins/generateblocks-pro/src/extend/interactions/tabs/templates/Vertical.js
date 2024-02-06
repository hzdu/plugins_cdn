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

const template = [
	[ 'generateblocks/container',
		{
			variantRole: 'tab-buttons',
			display: 'flex',
			flexDirection: 'column',
			flexDirectionMobile: 'row',
			overflowXMobile: 'auto',
			sizing: {
				width: '200px',
				widthMobile: 'auto',
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
			flexGrow: 1,
			backgroundColor: '#fafafa',
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
