import { closeMicroPopup } from './open-close-logic'
import $ from 'jquery'

export const mountAdditionalCloseForPopup = (popup) => {
	if (popup.dataset.popupAdditionalClose.indexOf('button_click') > -1) {
		const [_, ...selector] = popup.dataset.popupAdditionalClose.split(':')

		const maybeButton = popup.querySelector(selector.join(':'))

		if (maybeButton && !maybeButton.hasAdditionalCloseEvent) {
			maybeButton.hasAdditionalCloseEvent = true
			maybeButton.addEventListener('click', (e) => {
				e.preventDefault()
				closeMicroPopup(popup, {
					reason: 'button_click',
				})
			})
		}
	}

	if (popup.dataset.popupAdditionalClose.indexOf('form_submit') > -1) {
		const maybeForm = popup.querySelector('form')
		if (maybeForm && !maybeForm.hasAdditionalCloseEvent) {
			maybeForm.hasAdditionalCloseEvent = true

			// Check for Kadence Form.
			window.document.body.addEventListener(
				'kb-form-success',
				() => {
					closeMicroPopup(popup, {
						reason: 'form_submit:kadence',
					})
				},
				false
			)

			if (maybeForm.matches('.wpforms-form')) {
				$(maybeForm).on('wpformsAjaxSubmitSuccess', () => {
					closeMicroPopup(popup, {
						reason: 'form_submit:wpforms',
					})
				})
			} else if (maybeForm.matches('form.frm-fluent-form')) {
				$(maybeForm).on('fluentform_submission_success', function (e) {
					closeMicroPopup(popup, {
						reason: 'form_submit:fluentform',
					})
				})
			} else if (maybeForm.matches('.gform_anchor')) {
				var form_id = maybeForm.id
				form_id = parseInt(form_id.replace(/\D/g, ''))

				jQuery(document).on(
					'gform_confirmation_loaded',
					(event, formId) => {
						if (form_id !== formId) {
							return
						}

						closeMicroPopup(popup, {
							reason: 'form_submit:gravityforms',
						})
					}
				)
			} else {
				maybeForm.addEventListener('submit', (e) => {
					e.preventDefault()
					// TODO: maybe even allow form validation sometime in the future?
					closeMicroPopup(popup, {
						reason: 'form_submit:default',
					})
				})
			}
		}
	}
}
