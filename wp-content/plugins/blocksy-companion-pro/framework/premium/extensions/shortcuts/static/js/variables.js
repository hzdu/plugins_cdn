import ctEvents from 'ct-events'
import {
	withKeys,
	handleBackgroundOptionFor,
	responsiveClassesFor,
	typographyOption,
} from 'blocksy-customizer-sync'

ctEvents.on(
	'ct:customizer:sync:collect-variable-descriptors',
	(allVariables) => {
		allVariables.result = {
			...allVariables.result,
			...withKeys(
				['shortcuts_container_height', 'shortcuts_bar_visibility'],
				[
					{
						selector: ':root',
						variable: 'shortcuts-container-height',
						responsive: true,
						extractValue: () => {
							return wp.customize('shortcuts_container_height')()
						},
						unit: 'px',
					},

					{
						selector: '.ct-has-shortcuts-bar',
						variable: 'shortcuts-bar-spacer',
						responsive: true,
						extractValue: () => {
							let visibility = wp.customize(
								'shortcuts_bar_visibility'
							)()

							let container_height = wp.customize(
								'shortcuts_container_height'
							)()

							if (!container_height.desktop) {
								container_height = {
									desktop: container_height,
									tablet: container_height,
									mobile: container_height,
								}
							}

							if (!visibility.desktop) {
								container_height.desktop = '0'
							}

							if (!visibility.tablet) {
								container_height.tablet = '0'
							}

							if (!visibility.mobile) {
								container_height.mobile = '0'
							}

							return container_height
						},
						unit: 'px',
					},
				]
			),

			shortcuts_container_width: {
				selector: ':root',
				variable: 'shortcuts-container-width',
				unit: '',
			},

			shortcuts_icon_size: {
				selector: '.ct-shortcuts-container',
				variable: 'icon-size',
				responsive: true,
				unit: 'px',
			},

			...typographyOption({
				id: 'shortcuts_font',
				selector: '.ct-shortcuts-container',
			}),

			shortcuts_font_color: [
				{
					selector: '.ct-shortcuts-container a',
					variable: 'linkInitialColor',
					type: 'color:default',
					responsive: true,
				},

				{
					selector: '.ct-shortcuts-container a',
					variable: 'linkHoverColor',
					type: 'color:hover',
					responsive: true,
				},
			],

			shortcuts_icon_color: [
				{
					selector: '.ct-shortcuts-container',
					variable: 'icon-color',
					type: 'color:default',
					responsive: true,
				},

				{
					selector: '.ct-shortcuts-container',
					variable: 'icon-hover-color',
					type: 'color:hover',
					responsive: true,
				},
			],

			shortcuts_cart_badge_color: [
				{
					selector: '.ct-shortcuts-container [data-shortcut="cart"]',
					variable: 'cartBadgeBackground',
					type: 'color:background',
					responsive: true,
				},

				{
					selector: '.ct-shortcuts-container [data-shortcut="cart"]',
					variable: 'cartBadgeText',
					type: 'color:text',
					responsive: true,
				},
			],

			shortcuts_divider: {
				selector: '.ct-shortcuts-container',
				variable: 'shortcuts-divider',
				type: 'border',
			},

			shortcuts_divider_height: [
				{
					selector: '.ct-shortcuts-container',
					variable: 'shortcuts-divider-height',
					unit: '%',
				},
			],

			...handleBackgroundOptionFor({
				id: 'shortcuts_container_background',
				selector: '.ct-shortcuts-container',
				responsive: true,
			}),

			shortcuts_container_shadow: {
				selector: '.ct-shortcuts-container',
				type: 'box-shadow',
				variable: 'box-shadow',
				responsive: true,
			},

			shortcuts_container_border_radius: {
				selector: '.ct-shortcuts-container',
				type: 'spacing',
				variable: 'border-radius',
				responsive: true,
			},
		}
	}
)

wp.customize('shortcuts_bar_visibility', (value) =>
	value.bind((to) =>
		responsiveClassesFor(
			'shortcuts_bar_visibility',
			document.querySelector('.ct-shortcuts-container')
		)
	)
)
