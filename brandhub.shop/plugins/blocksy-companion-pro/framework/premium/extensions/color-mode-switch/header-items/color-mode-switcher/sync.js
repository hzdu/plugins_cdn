import ctEvents from 'ct-events'
import {
	updateAndSaveEl,
	handleBackgroundOptionFor,
	typographyOption,
	getRootSelectorFor,
	assembleSelector,
	responsiveClassesFor,
	mutateSelector,
} from 'blocksy-customizer-sync'

ctEvents.on(
	'ct:header:sync:collect-variable-descriptors',
	(variableDescriptors) => {
		variableDescriptors['color-mode-switcher'] = ({ itemId }) => ({
			icon_size: {
				selector: assembleSelector(getRootSelectorFor({ itemId })),
				variable: 'theme-icon-size',
				responsive: true,
				unit: 'px',
			},

			...typographyOption({
				id: 'color_switch_label_font',
				selector: assembleSelector(
					mutateSelector({
						selector: [getRootSelectorFor({ itemId })[0]],
						operation: 'suffix',
						to_add: '.ct-color-switch .ct-label',
					})
				),
			}),

			// default state
			header_color_switch_font_color: [
				{
					selector: assembleSelector(getRootSelectorFor({ itemId })),
					variable: 'theme-link-initial-color',
					type: 'color:default',
					responsive: true,
				},

				{
					selector: assembleSelector(getRootSelectorFor({ itemId })),
					variable: 'theme-link-hover-color',
					type: 'color:hover',
					responsive: true,
				},
			],

			header_color_switch_icon_color: [
				{
					selector: assembleSelector(getRootSelectorFor({ itemId })),
					variable: 'theme-icon-color',
					type: 'color:default',
					responsive: true,
				},

				{
					selector: assembleSelector(getRootSelectorFor({ itemId })),
					variable: 'theme-icon-hover-color',
					type: 'color:hover',
					responsive: true,
				},
			],

			// transparent state
			transparent_header_color_switch_font_color: [
				{
					selector: assembleSelector(
						mutateSelector({
							selector: getRootSelectorFor({ itemId }),
							operation: 'between',
							to_add: '[data-transparent-row="yes"]',
						})
					),
					variable: 'theme-link-initial-color',
					type: 'color:default',
					responsive: true,
				},

				{
					selector: assembleSelector(
						mutateSelector({
							selector: getRootSelectorFor({ itemId }),
							operation: 'between',
							to_add: '[data-transparent-row="yes"]',
						})
					),
					variable: 'theme-link-hover-color',
					type: 'color:hover',
					responsive: true,
				},
			],

			transparent_header_color_switch_icon_color: [
				{
					selector: assembleSelector(
						mutateSelector({
							selector: getRootSelectorFor({ itemId }),
							operation: 'between',
							to_add: '[data-transparent-row="yes"]',
						})
					),
					variable: 'theme-icon-color',
					type: 'color:default',
					responsive: true,
				},

				{
					selector: assembleSelector(
						mutateSelector({
							selector: getRootSelectorFor({ itemId }),
							operation: 'between',
							to_add: '[data-transparent-row="yes"]',
						})
					),
					variable: 'theme-icon-hover-color',
					type: 'color:hover',
					responsive: true,
				},
			],

			// sticky state
			sticky_header_color_switch_font_color: [
				{
					selector: assembleSelector(
						mutateSelector({
							selector: getRootSelectorFor({ itemId }),
							operation: 'between',
							to_add: '[data-sticky*="yes"]',
						})
					),
					variable: 'theme-link-initial-color',
					type: 'color:default',
					responsive: true,
				},

				{
					selector: assembleSelector(
						mutateSelector({
							selector: getRootSelectorFor({ itemId }),
							operation: 'between',
							to_add: '[data-sticky*="yes"]',
						})
					),
					variable: 'theme-link-hover-color',
					type: 'color:hover',
					responsive: true,
				},
			],

			sticky_header_color_switch_icon_color: [
				{
					selector: assembleSelector(
						mutateSelector({
							selector: getRootSelectorFor({ itemId }),
							operation: 'between',
							to_add: '[data-sticky*="yes"]',
						})
					),
					variable: 'theme-icon-color',
					type: 'color:default',
					responsive: true,
				},

				{
					selector: assembleSelector(
						mutateSelector({
							selector: getRootSelectorFor({ itemId }),
							operation: 'between',
							to_add: '[data-sticky*="yes"]',
						})
					),
					variable: 'theme-icon-hover-color',
					type: 'color:hover',
					responsive: true,
				},
			],

			container_margin: {
				selector: assembleSelector(getRootSelectorFor({ itemId })),
				type: 'spacing',
				variable: 'margin',
				responsive: true,
				important: true,
			},
		})
	}
)

ctEvents.on(
	'ct:header:sync:item:color-mode-switcher',
	({ values: { wishlist_label }, optionId, optionValue }) => {
		const selector = '[data-id="color-mode-switcher"]'

		if (optionId === 'color_switch_icon_state') {
			updateAndSaveEl(selector, (el) => {
				el.dataset.colorSwitch =
					optionValue === 'yes' ? 'reversed' : 'normal'
			})
		}

		if (optionId === 'dark_mode_label') {
			updateAndSaveEl(selector, (el) => {
				;[...el.querySelectorAll('.ct-label .ct-dark-mode-label')].map(
					(label) => {
						label.innerHTML = optionValue
					}
				)
			})

			updateAndSaveEl(
				selector,
				(el) => {
					if (!optionValue.desktop) {
						optionValue = {
							desktop: optionValue,
							mobile: optionValue,
						}
					}

					;[
						...el.querySelectorAll('.ct-label .ct-dark-mode-label'),
					].map((label) => {
						label.innerHTML = optionValue.desktop
					})
				},
				{ onlyView: 'desktop' }
			)

			updateAndSaveEl(
				selector,
				(el) => {
					if (!optionValue.desktop) {
						optionValue = {
							desktop: optionValue,
							mobile: optionValue,
						}
					}

					;[
						...el.querySelectorAll('.ct-label .ct-dark-mode-label'),
					].map((label) => {
						label.innerHTML = optionValue.mobile
					})
				},
				{ onlyView: 'mobile' }
			)
		}

		if (optionId === 'light_mode_label') {
			updateAndSaveEl(selector, (el) => {
				;[...el.querySelectorAll('.ct-label .ct-light-mode-label')].map(
					(label) => {
						label.innerHTML = optionValue
					}
				)
			})

			updateAndSaveEl(
				selector,
				(el) => {
					if (!optionValue.desktop) {
						optionValue = {
							desktop: optionValue,
							mobile: optionValue,
						}
					}

					;[
						...el.querySelectorAll(
							'.ct-label .ct-light-mode-label'
						),
					].map((label) => {
						label.innerHTML = optionValue.desktop
					})
				},
				{ onlyView: 'desktop' }
			)

			updateAndSaveEl(
				selector,
				(el) => {
					if (!optionValue.desktop) {
						optionValue = {
							desktop: optionValue,
							mobile: optionValue,
						}
					}

					;[
						...el.querySelectorAll(
							'.ct-label .ct-light-mode-label'
						),
					].map((label) => {
						label.innerHTML = optionValue.mobile
					})
				},
				{ onlyView: 'mobile' }
			)
		}

		if (optionId === 'color_switch_label_visibility') {
			updateAndSaveEl(selector, (el) => {
				;[...el.querySelectorAll('.ct-label')].map((label) => {
					responsiveClassesFor(optionValue, label)
				})
			})
		}

		if (optionId === 'color_switch_label_position') {
			updateAndSaveEl(
				selector,
				(el) => {
					if (!optionValue.desktop) {
						optionValue = {
							desktop: optionValue,
							mobile: optionValue,
						}
					}

					el.dataset.label = optionValue.desktop
				},
				{ onlyView: 'desktop' }
			)

			updateAndSaveEl(
				selector,
				(el) => {
					if (!optionValue.desktop) {
						optionValue = {
							desktop: optionValue,
							mobile: optionValue,
						}
					}

					el.dataset.label = optionValue.mobile
				},
				{ onlyView: 'mobile' }
			)
		}

		if (optionId === 'header_color_switch_visibility') {
			updateAndSaveEl(selector, (el) =>
				responsiveClassesFor({ ...optionValue, desktop: true }, el)
			)
		}
	}
)
