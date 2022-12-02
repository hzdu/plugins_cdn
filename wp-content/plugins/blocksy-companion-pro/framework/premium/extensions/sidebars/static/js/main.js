import { __ } from 'ct-i18n'
import { Fragment, createElement, render } from '@wordpress/element'
import { onDocumentLoaded } from 'blocksy-options'
import $ from 'jquery'
import SettingsManager from './SettingsManager'
import { addFilter } from '@wordpress/hooks'

import BlockWidgetControls from './BlockWidgetControls'

addFilter('editor.BlockEdit', 'blocksy', (Edit) => {
	return (props) => {
		if (props.name !== 'core/widget-area') {
			return <Edit {...props} />
		}

		if (props.attributes.id.indexOf('ct-dynamic-sidebar') === -1) {
			return <Edit {...props} />
		}

		return (
			<Fragment>
				<BlockWidgetControls
					sidebarId={props.attributes.id.replace(
						'ct-dynamic-sidebar-',
						''
					)}
				/>
				<Edit {...props} />
			</Fragment>
		)
	}
})

onDocumentLoaded(() => {
	setTimeout(() => {
		if (document.querySelector('.block-editor-writing-flow')) {
			document
				.querySelector('.block-editor-writing-flow')
				.insertAdjacentHTML(
					'beforebegin',
					`<section class="ct-block-sidebars-manager">
						<h2>${__('Create Sidebar/Widget Area', 'blocksy-companion')}</h2>

						<p>
							${__(
								'Enter a name in the input below and hit the Create Sidebar button.',
								'blocksy-companion'
							)}
						</p>

						<form>
							<input type="text" placeholder="${__('Sidebar name', 'blocksy-companion')}" />

							<button
								type="submit"
								disabled
								class="button button-primary">
								${__('Create Sidebar', 'blocksy-companion')}
							</button>
						</form>
					</section>`
				)
		}
	})

	const allDynamicSidebars = [
		...document.querySelectorAll(
			'.widgets-holder-wrap:not(.inactive-sidebar) [id*="ct-dynamic-sidebar"] .sidebar-description > .description'
		),
	]

	allDynamicSidebars.map((el) => {
		el.parentNode.insertAdjacentHTML(
			'beforebegin',
			'<div class="blocksy-settings"></div>'
		)

		el.classList.add('ct-tooltip-top')
	})

	if (allDynamicSidebars.length > 0) {
		const div = document.createElement('div')
		document.body.appendChild(div)

		render(<SettingsManager />, div)
	}
})

$(document).on(
	'submit',
	'.ct-sidebars-manager form, .ct-block-sidebars-manager form',
	(e) => {
		e.preventDefault()

		let input = document.querySelector(
			'.ct-sidebars-manager form input, .ct-block-sidebars-manager form input'
		)

		if (!input.value) return

		wp.ajax
			.send({
				url: `${wp.ajax.settings.url}?action=blocksy_sidebars_create&name=${input.value}`,
				contentType: 'application/json',
			})
			.then(() => location.reload())
	}
)

$(document).on(
	'input',
	'.ct-sidebars-manager form input, .ct-block-sidebars-manager form input',
	(e) => {
		e.preventDefault()

		let input = document.querySelector(
			'.ct-sidebars-manager form input, .ct-block-sidebars-manager form input'
		)

		let button = document.querySelector(
			'.ct-sidebars-manager form button, .ct-block-sidebars-manager form button'
		)

		if (input.value) {
			button.removeAttribute('disabled')
		} else {
			button.setAttribute('disabled', true)
		}
	}
)

$(document).on(
	'click.ctDynamicSidebars',
	'[id*="ct-dynamic-sidebar"] .sidebar-description',
	function (e) {
		e.preventDefault()

		if (
			$(this).closest('.sidebar-description').length === 0 ||
			!$(this).hasClass('sidebar-description')
		) {
			return
		}

		wp.ajax
			.send({
				url: `${
					wp.ajax.settings.url
				}?action=blocksy_sidebars_remove&id=${$(this)
					.closest('.widgets-sortables')[0]
					.id.replace('ct-dynamic-sidebar-', '')}`,
				contentType: 'application/json',
			})
			.then(() => location.reload())
	}
)
