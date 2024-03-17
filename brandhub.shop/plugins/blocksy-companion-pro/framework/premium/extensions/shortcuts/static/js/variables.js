import ctEvents from 'ct-events'
import {
	withKeys,
	handleBackgroundOptionFor,
	responsiveClassesFor,
	typographyOption,
	maybePromoteScalarValueIntoResponsive,
} from 'blocksy-customizer-sync'

ctEvents.on(
	'ct:customizer:sync:collect-variable-descriptors',
	(allVariables) => {
		allVariables.result = {
			...allVariables.result,

			...withKeys(
				[
					'shortcuts_container_height',
					'shortcuts_bar_visibility',
					'shortcuts_bar_type',
				],
				{
					selector: '.ct-drawer-canvas[data-shortcuts-bar]',
					variable: 'shortcuts-bar-height',
					responsive: true,
					unit: 'px',
					extractValue: (el) => {
						const shortcuts_container_height =
							maybePromoteScalarValueIntoResponsive(
								wp.customize('shortcuts_container_height')()
							)

						const shortcuts_bar_type =
							wp.customize('shortcuts_bar_type')()

						if (shortcuts_bar_type === 'type-2') {
							shortcuts_container_height.desktop =
								parseFloat(shortcuts_container_height.desktop) +
								30

							shortcuts_container_height.tablet =
								parseFloat(shortcuts_container_height.tablet) +
								30

							shortcuts_container_height.mobile =
								parseFloat(shortcuts_container_height.mobile) +
								30
						}

						const shortcuts_bar_visibility = wp.customize(
							'shortcuts_bar_visibility'
						)()

						if (!shortcuts_bar_visibility.desktop) {
							shortcuts_container_height.desktop = 0
						}

						if (!shortcuts_bar_visibility.tablet) {
							shortcuts_container_height.tablet = 0
						}

						if (!shortcuts_bar_visibility.mobile) {
							shortcuts_container_height.mobile = 0
						}

						return shortcuts_container_height
					},
				}
			),

			shortcuts_container_width: {
				selector: '.ct-shortcuts-bar-items',
				variable: 'shortcuts-bar-width',
				unit: '',
			},

			shortcuts_icon_size: {
				selector: '.ct-shortcuts-bar-items',
				variable: 'theme-icon-size',
				responsive: true,
				unit: 'px',
			},

			...typographyOption({
				id: 'shortcuts_font',
				selector: '.ct-shortcuts-bar-items',
			}),

			shortcuts_font_color: [
				{
					selector: '.ct-shortcuts-bar-items a',
					variable: 'theme-link-initial-color',
					type: 'color:default',
					responsive: true,
				},

				{
					selector: '.ct-shortcuts-bar-items a',
					variable: 'theme-link-hover-color',
					type: 'color:hover',
					responsive: true,
				},
			],

			shortcuts_icon_color: [
				{
					selector: '.ct-shortcuts-bar-items',
					variable: 'theme-icon-color',
					type: 'color:default',
					responsive: true,
				},

				{
					selector: '.ct-shortcuts-bar-items',
					variable: 'theme-icon-hover-color',
					type: 'color:hover',
					responsive: true,
				},
			],

			shortcuts_item_color: [
				{
					selector: '.ct-shortcuts-bar-items',
					variable: 'item-color',
					type: 'color:default',
					responsive: true,
				},

				{
					selector: '.ct-shortcuts-bar-items',
					variable: 'item-hover-color',
					type: 'color:hover',
					responsive: true,
				},
			],

			shortcuts_cart_badge_color: [
				{
					selector: '.ct-shortcuts-bar-items [data-shortcut="cart"]',
					variable: 'theme-cart-badge-background',
					type: 'color:background',
					responsive: true,
				},

				{
					selector: '.ct-shortcuts-bar-items [data-shortcut="cart"]',
					variable: 'theme-cart-badge-text',
					type: 'color:text',
					responsive: true,
				},
			],

			shortcuts_wishlist_badge_color: [
				{
					selector:
						'.ct-shortcuts-bar-items [data-shortcut="wishlist"]',
					variable: 'theme-cart-badge-background',
					type: 'color:background',
					responsive: true,
				},

				{
					selector:
						'.ct-shortcuts-bar-items [data-shortcut="wishlist"]',
					variable: 'theme-cart-badge-text',
					type: 'color:text',
					responsive: true,
				},
			],

			shortcuts_compare_badge_color: [
				{
					selector:
						'.ct-shortcuts-bar-items [data-shortcut="compare"]',
					variable: 'theme-cart-badge-background',
					type: 'color:background',
					responsive: true,
				},

				{
					selector:
						'.ct-shortcuts-bar-items [data-shortcut="compare"]',
					variable: 'theme-cart-badge-text',
					type: 'color:text',
					responsive: true,
				},
			],

			shortcuts_divider: {
				selector: '.ct-shortcuts-bar-items',
				variable: 'shortcuts-divider',
				type: 'border',
			},

			shortcuts_divider_height: [
				{
					selector: '.ct-shortcuts-bar-items',
					variable: 'shortcuts-divider-height',
					unit: '%',
				},
			],

			...handleBackgroundOptionFor({
				id: 'shortcuts_container_background',
				selector: '.ct-shortcuts-bar-items',
				responsive: true,
			}),

			shortcuts_container_shadow: {
				selector: '.ct-shortcuts-bar-items',
				type: 'box-shadow',
				variable: 'theme-box-shadow',
				responsive: true,
			},

			shortcuts_container_border_radius: {
				selector: '.ct-shortcuts-bar-items',
				type: 'spacing',
				variable: 'theme-border-radius',
				responsive: true,
			},
		}
	}
)

wp.customize('shortcuts_bar_visibility', (value) =>
	value.bind((to) =>
		responsiveClassesFor(
			'shortcuts_bar_visibility',
			document.querySelector('.ct-shortcuts-bar')
		)
	)
)
