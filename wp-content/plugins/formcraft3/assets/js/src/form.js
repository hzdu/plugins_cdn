let translate = window.FC.fct
let Parser = require('../vendor/expr-eval.min.js').Parser
let parser = new Parser()
import autosize from '../vendor/autosize.js'
import formcraftValidation from './formcraft.validation.js'
import helpers from './helpers.js'

function globalNotification(type, message) {
	type = type === 'error' ? 'red' : 'green'
	jQuery('#notification-panel').removeClass('red green').addClass(type).html(message)
}

if (typeof Object.assign !== 'function') {
	Object.assign = function(target) {
		if (target === null) {
			throw new TypeError('Cannot convert undefined or null to object')
		}

		target = Object(target)
		for (let index = 1; index < arguments.length; index++) {
			let source = arguments[index]
			if (source !== null) {
				for (let key in source) {
					if (Object.prototype.hasOwnProperty.call(source, key)) {
						target[key] = source[key]
					}
				}
			}
		}
		return target
	}
}

class FormCraft {

	constructor(form) {
		this.form = form
		this.formID = form.attr('data-id')
		this.parentElement = form.parents('.form-live')
		let self = this

		// Setup complex form elements
		this.setupAutocomplete()
		this.setupInputMasks()
		this.setupCharacterCount()
		this.setupSliderFields()
		this.setupDatepickerFields()
		this.setupFileUploadFields()
		this.setupTimepickerFields()
		this.setupAddressFields()
		form.find('.star-cover label').removeClass('fake-click fake-hover active')
		this.form.find('.textarea-cover textarea').each(function() {
			autosize(this)
		}).on('input', function() {
			let evt = document.createEvent('Event')
			evt.initEvent('autosize:update', true, false)
			this.dispatchEvent(evt)
		})

		// Simple Stuff
		if (jQuery().tooltip) {
			if (helpers.isMobile() === true) {
				this.parentElement.find('.fc-form [data-toggle="tooltip"]').tooltip({
					container: '.fc-form',
					placement: 'top'
				})
			} else {
				this.parentElement.find('.fc-form [data-toggle="tooltip"]').tooltip({
					container: '.fc-form'
				})
			}
		}

		jQuery('.formcraft-icon').each(function() {
			if (jQuery(this).text() === '' || jQuery(this).text() === 'no-icon') {
				jQuery(this).remove()
			}
		})

		// Parse form text to look for math formulas in []
		this.prepareMathFormulas()

		// Handle form submission
		jQuery(this.form).on('submit', function(event) {
			event.preventDefault()
			FormCraftSubmitForm(self.form, 'all')
		})

		jQuery(this.form).find('span.error').text('')
		setTimeout(function() {
			jQuery(this.form).find('.form-element.error-field').removeClass('error-field')
		}, 300)

		// Auto-save form progress data every 3 seconds
		if (self.form.hasClass('save-form-true')) {
			setInterval(() => self.saveProgress(), 3000)
		}

		// Our logic is stored as plain text in a hidden element. Retrieve that.
		this.FormCraftLogic = window.formcraftLogic[this.formID] ? window.formcraftLogic[this.formID] : null

		// Check if we need to execute Conditional Logic or Math Logic on changes in fields
		form.on('input', '.oneLineText-cover input[type="text"], .address-cover input[type="text"], .password-cover input[type="password"], .datepicker-cover input[type="text"], .email-cover input[type="text"], .email-cover input[type="email"], .textarea-cover textarea', function() {
			self.setValue = []
			self.checkIfApplyMath(jQuery(this))
			self.checkIfApplyLogic(jQuery(this))
		})
		form.on('change', '.customText-cover input[type="hidden"], .timepicker-cover input[type="hidden"], .slider-cover input[type="hidden"], .fileupload-cover input[type="hidden"], .checkbox-cover input[type="radio"], .star-cover input[type="radio"], .thumb-cover input[type="radio"], .checkbox-cover input[type="checkbox"], .dropdown-cover select', function() {
			self.setValue = []
			self.checkIfApplyMath(jQuery(this))
			self.checkIfApplyLogic(jQuery(this))
		})

		// Save checked labels for label-value fields
		form.on('change', '.checkbox-cover input[type="checkbox"]', function() {
			let FieldLabels = form.data('FieldLabels') || {}
			let thisFieldName = `${jQuery(this).attr('name').replace(/[\[\]']+/g,'')}.label`
			FieldLabels[thisFieldName] = []
			jQuery(this).parents('.checkbox-cover').find('input[type="checkbox"]').each(function() {
				if (jQuery(this).prop('checked')) {
					let thisFieldLabels = jQuery(this).parent().find('span').html().replace(/(<([^>]+)>)/ig,"")
					FieldLabels[thisFieldName].push(thisFieldLabels)
				}
			})
			form.data('FieldLabels', FieldLabels)
		})
		form.on('change', '.checkbox-cover input[type="radio"]', function() {
			let FieldLabels = form.data('FieldLabels') || {}
			let thisFieldName = `${jQuery(this).attr('name').replace(/[\[\]']+/g,'')}.label`
			FieldLabels[thisFieldName] = []
			jQuery(this).parents('.checkbox-cover').find('input[type="radio"]').each(function() {
				if (jQuery(this).prop('checked')) {
					let thisFieldLabels = jQuery(this).parent().find('span').html().replace(/(<([^>]+)>)/ig,"")
					FieldLabels[thisFieldName].push(thisFieldLabels)
				}
			})
			form.data('FieldLabels', FieldLabels)
		})
		form.on('change', '.dropdown-cover select', function() {
			let FieldLabels = form.data('FieldLabels') || {}
			let thisFieldName = `${jQuery(this).attr('name').replace(/[\[\]']+/g,'')}.label`
			FieldLabels[thisFieldName] = []
			FieldLabels[thisFieldName].push(jQuery(this).find('option:selected').text())
			form.data('FieldLabels', FieldLabels)
		})

		// If form had previously saved data, populate it in the form
		setTimeout(function() {
			let data = {}
			self.form.parents('.form-live').find('.pre-populate-data').each(function() {
				let dataTemp = jQuery(this).text().replace(/“/g, '"').replace(/”/g, '"').replace(/″/g, '"')
				if (dataTemp === '') return true
				dataTemp = jQuery.parseJSON(dataTemp)
				for (let field in dataTemp) {
					if (dataTemp[field] === '' || (typeof dataTemp[field] === 'object' && dataTemp[field][0] === '')) {
						delete dataTemp[field]
					}
				}
				data = Object.assign(data, dataTemp)
			})
			self.setFormValues(data)
			setTimeout(function() {
				jQuery('.oneLineText-cover input[type="text"],.datepicker-cover input[type="text"], .email-cover input[type="text"], .email-cover input[type="email"], .textarea-cover textarea').trigger('input')
				jQuery('.customText-cover input[type="hidden"],.timepicker-cover input[type="hidden"],.slider-cover input[type="hidden"],.fileupload-cover input[type="hidden"],.star-cover input[type="radio"],.thumb-cover input[type="radio"],.dropdown-cover select').trigger('change')
			}, 0)
		}, 0)

		form.keypress(function(event) {
			if (event.which === 13 && form.hasClass('disable-enter-true') === true && event.target.type != 'textarea') {
				event.preventDefault()
			}
		})

		// HoneyPot
		this.form.find('.required_field').hide()

		// Mark ReadOnly
		this.form.find('[make-read-only="true"]').attr('readonly', true).addClass('is-read-only')
	}

	disableSubmit() {
		this.form.find('.submit-button').attr('disabled', true)
	}

	enableSubmit() {
		this.form.find('.submit-button').attr('disabled', false)
	}

	setupCharacterCount() {
		this.form.find('.textarea-cover textarea').on('input', function() {
			let len = jQuery(this).val().length
			let max = parseInt(jQuery(this).parents('.textarea-cover').find('.count-true > span.max-count').text(), 10)
			if (len > max) {
				jQuery(this).parents('.textarea-cover').find('.count-true').css('color', 'red')
			} else {
				jQuery(this).parents('.textarea-cover').find('.count-true').css('color', 'inherit')
			}
			jQuery(this).parents('.textarea-cover').find('.count-true > span.current-count').text(len)
		})
	}

	setupAutocomplete() {
		setTimeout(() => {
			this.form.find('.dropdown-cover.autocomplete-type-true').each(function() {
				jQuery(this).find('input').val(jQuery(this).find('select').val())
				jQuery(this).parents('.form-element').css('z-index', 102)
				let inputField = jQuery(this).find('input')[0]
				let selectOptions = []
				jQuery(this).find('select option').each((x, y) => {
					selectOptions.push(y.text)
				})
				new Awesomplete(inputField, {
					minChars: 1,
					list: selectOptions
				})
				inputField.addEventListener('awesomplete-select', function(event) {
					jQuery(inputField).parents('.dropdown-cover').find(`select option:contains("${event.text.label}")`)[0].selected = true
					jQuery(inputField).parents('.dropdown-cover').find('select').trigger('change')
				})
				inputField.addEventListener('awesomplete-open', function(event) {
					jQuery(inputField).parents('.form-element').addClass('index-true')
				})
				inputField.addEventListener('awesomplete-close', function(event) {
					jQuery(inputField).parents('.form-element').removeClass('index-true')
				})		
			})
		}, 250)
	}

	setupInputMasks() {
		this.form.find('[data-input-mask]').each(function() {
			let options =  {
				onComplete: (cep, event) => {
					jQuery(event.srcElement).removeClass('mask-invalid')
				},
				onChange: (cep, event) => {
					jQuery(event.srcElement).addClass('mask-invalid')
				}
			}
			if (jQuery(this).attr('data-input-mask').replace(/[^a-zA-Z0-9 ():.\-\/]+/g, '').trim() !== '') {
				jQuery(this).mask(jQuery(this).attr('data-input-mask').replace(/[^a-zA-Z0-9 ():.\-\/]+/g, ''), options)
			}
		})
	}

	setupSliderFields() {
		this.form.find('.slider-cover .ui-slider-cover').each(function() {
			let options = {}
			options.min = parseFloat(jQuery(this).find('> span').attr('range-min'))
			options.max = parseFloat(jQuery(this).find('> span').attr('range-max'))
			options.step = parseFloat(jQuery(this).find('> span').attr('range-step'))
			options.range = jQuery(this).find('> span').attr('range-true') === 'true' ? true : 'min'
			let prefix = jQuery(this).find('> span').attr('data-prefix') || ''
			let suffix = jQuery(this).find('> span').attr('data-suffix') || ''
			options.create = function() {
				if (options.range === true) {
					jQuery(this).find('.ui-slider-range').eq(0).append('<span class="ui-slider-handle-nos">0</span>')
				} else {
					jQuery(this).find('span.ui-slider-handle').eq(0).append('<span class="ui-slider-handle-nos">0</span>')
				}
				jQuery(this).parents('.slider-cover').find('input[type="hidden"]').val('').trigger('change').attr('data-prefix', prefix).attr('data-suffix', suffix)
			}
			options.change = options.slide = function(event, ui) {
				jQuery(this).parents('.ui-slider-cover').find('.ui-slider-handle-nos').show()
				let thousand = jQuery(this).parents('.fc-form').attr('data-thousand')
				let decimal = jQuery(this).parents('.fc-form').attr('data-decimal')
				jQuery(this).parents('.slider-cover').find('.ui-slider-handle-nos').css('margin-left', `-${(jQuery(this).parents('.slider-cover').find('.ui-slider-handle-nos').outerWidth() / 2 - 9)}px`)
				let value, valueAmount, valueOne, valueOneFrom, valueZero, valueZeroFrom

				if (ui.values) {
					valueAmount = `${ui.values[0]} - ${ui.values[1]}`
					valueZero = ui.values[0].toString().replace(/[.]/g, decimal).replace(/\B(?=(\d{3})+(?!\d))/g, thousand)
					valueOne = ui.values[1].toString().replace(/[.]/g, decimal).replace(/\B(?=(\d{3})+(?!\d))/g, thousand)
					valueZeroFrom = ui.values[0]
					valueOneFrom = ui.values[1]
					ui.values[0] = prefix + ui.values[0] + suffix
					ui.values[1] = prefix + ui.values[1] + suffix
					value = `${ui.values[0]} - ${ui.values[1]}`
				} else {
					valueAmount = ui.value
					value = parseFloat(ui.value)
					valueZero = value.toString().replace(/[.]/g, decimal).replace(/\B(?=(\d{3})+(?!\d))/g, thousand)
					valueZeroFrom = value
					valueOne = ''
					valueOneFrom = ''
					value = prefix + value + suffix
				}
				jQuery(this).parents('.slider-cover').find('input').val(valueAmount).trigger('change')
				value = value.replace(valueZeroFrom, valueZero).replace(valueOneFrom, valueOne)
				jQuery(this).parents('.slider-cover').find('.ui-slider-handle-nos').text(value)
			}
			jQuery(this).html('<span></span>')
			jQuery(this).find('span').slider(options)
		})
	}

	setupDatepickerFields() {
		this.form.find('.datepicker-cover input[type="text"]').each(function () {
			jQuery(this).removeClass('hasDatepicker')
			let options = {}
			options.beforeShow = function() {
				jQuery('#ui-datepicker-div').removeClass('ui-datepicker').addClass('formcraft-datepicker')
			}
			options.onClose = function () {
				jQuery(this).trigger('blur')
			}
			options.onSelect = function() {
				jQuery(this).trigger('change').trigger('input')
				if (jQuery(`[data-date-min-range="[${jQuery(this).attr('data-field-id')}]"]`).length !== 0 && jQuery(`[data-date-min-range="[${jQuery(this).attr('data-field-id')}]"]`).hasClass('hasDatepicker')) {
					jQuery(`[data-date-min-range="[${jQuery(this).attr('data-field-id')}]"]`).datepicker(
						'option',
						'minDate',
						jQuery(this).datepicker('getDate')
					)
				}
			}
			if (jQuery(this).attr('data-date-lang') && jQuery(this).attr('data-date-lang') !== 'en' && window.datepickerLoad === false) {
				jQuery.getScript(`${FC.datepickerLang}datepicker-${jQuery(this).attr('data-date-lang')}.js`)
				window.datepickerLoad = true
			}
			if (jQuery(this).attr('data-date-format')) {
				options.dateFormat = jQuery(this).attr('data-date-format')
			}

			if (jQuery(this).attr('data-date-max')) {
				let maxDate
				if (jQuery(this).attr('data-date-max') !== '' && parseInt(jQuery(this).attr('data-date-max'), 10).toString() === jQuery(this).attr('data-date-max')) {
					maxDate = new Date()
					maxDate.setDate(maxDate.getDate() + parseInt(jQuery(this).attr('data-date-max'), 10))
				} else {
					maxDate = new Date(jQuery(this).attr('data-date-max-alt'))
				}
				options.maxDate = maxDate
			}
			if (jQuery(this).attr('data-date-min')) {
				let minDate
				if (jQuery(this).attr('data-date-min') !== '' && parseInt(jQuery(this).attr('data-date-min'), 10).toString() === jQuery(this).attr('data-date-min')) {
					minDate = new Date()
					minDate.setDate(minDate.getDate() + parseInt(jQuery(this).attr('data-date-min'), 10))
				} else {
					minDate = new Date(jQuery(this).attr('data-date-min-alt'))
				}
				options.minDate = minDate
			}
			if (jQuery(this).attr('data-date-days')) {
				let tempNew = jQuery.map(jQuery.parseJSON(jQuery(this).attr('data-date-days')), (x, y) => {
					if (x === true) return y.toString()
				})
				options.beforeShowDay = function(date) {
					if (tempNew.indexOf(date.getDay().toString()) !== -1) return [true, '']
					return [false, '']
				}
			}
			options.nextText = '❯'
			options.prevText = '❮'
			options.hideIfNoPrevNext = true
			options.changeYear = true
			options.changeMonth = true
			options.showAnim = false
			options.yearRange = 'c-100:c+100'
			options.shortYearCutoff = 50
			options.showOtherMonths = true
			jQuery(this).datepicker(options)
		})
	}

	setupFileUploadFields() {
		if (this.form.find('.fileupload-cover .button-file input').length === 0) return
		this.form.find('.fileupload-cover .button-file input').each(function() {
			let extensions = jQuery(this).attr('data-allow-extensions').replace(/ /g, '').split(',').map(x => `.${x}` ).join(',')
			jQuery(this).attr('accept', extensions)
		})
		this.form.find('.fileupload-cover .button-file input').fileupload({
			dataType: 'json',
			add: function (e, data) {
				let thisForm = jQuery(this).parents('form').data('FormCraft')
				thisForm.disableSubmit()
				if (jQuery(this).attr('data-allow-extensions') !== '' && jQuery(this).attr('data-allow-extensions').indexOf(',')) {
					let extensions = jQuery(this).attr('data-allow-extensions').replace(/ /g, '').split(',')
					for (let file in data.files) {
						let fileParts = data.files[file].name.split('.')
						let fileExtension = fileParts[fileParts.length - 1]
						if (extensions.indexOf(fileExtension.toLowerCase()) === -1) {
							if (typeof window[`FC_Validation_${thisForm.formID}`].is_invalid === 'undefined') {
								alert('Invalid extension')
							} else {
								alert(window[`FC_Validation_${thisForm.formID}`].is_invalid)
							}
							thisForm.enableSubmit()
							return false
						}
					}
				}
				if (jQuery(this).attr('data-max-files') !== '') {
					if (jQuery(this).parent().parent().find('.files-list li').length >= parseInt(jQuery(this).attr('data-max-files'), 10)) {
					if (typeof window[`FC_Validation_${thisForm.formID}`].max_files === 'undefined') {
							alert('Reached max files allowed')
						} else {
							alert(window[`FC_Validation_${thisForm.formID}`].max_files.replace('[x]', parseInt(jQuery(this).attr('data-max-files'), 10)))
						}						
						thisForm.enableSubmit()
						return false
					}
				}

				if (typeof jQuery(this).attr('data-max-size') !== 'undefined' && jQuery(this).attr('data-max-size') !== '') {
					let maxSize = parseFloat(jQuery(this).attr('data-max-size'))
					if ((data.files[0].size / 1024) > maxSize) {
						if (typeof window[`FC_Validation_${thisForm.formID}`].max_file_size === 'undefined') {
							alert('File too big')
						} else {
							alert(window[`FC_Validation_${thisForm.formID}`].max_file_size.replace('[x]', maxSize))
						}
						thisForm.enableSubmit()
						return false
					}
				}

				let id = jQuery(this).parents('.fc-form').attr('data-id')
				data.url = `${FC.ajaxurl}${FC.ajaxurl.indexOf('?') === -1 ? '?' : '&'}action=formcraft3_file_upload&id=${id}`
				let parent = jQuery(this).parent().parent()
				if (parent.find('.files-list').length === 0) {
					parent.append('<ul class="files-list"></ul>')
				}
				parent.find('.files-list').append('<li><div></div></li>')
				data.listPosition = parent.find('li').length - 1
				parent.find('.files-list li').eq(data.listPosition).slideDown(100)
				data.timeout = 0
				window.jqXHR = data.submit()
			},
			progress: function (e, data) {
				let parent = jQuery(this).parent().parent()
				let progress = parseInt(data.loaded / data.total * 100, 10)
				parent.find('.files-list li').eq(data.listPosition).find('div').css('width', `${progress}%`)
			},
			done: function (e, data) {
				let thisForm = jQuery(this).parents('form').data('FormCraft')
				thisForm.enableSubmit()
				let parent = jQuery(this).parent().parent()
				if (data.result.success) {
					let name = jQuery(this).attr('data-name-list')
					parent.find('.files-list li').eq(data.listPosition).find('div').text(data.result.file_name)
					parent.find('.files-list li').eq(data.listPosition).append(`<span class="delete-file" title="Delete File">&times;</span><input type="hidden" data-field-id="${name}" name="${name}[]" value="${data.result.success}"/>`)
					parent.find('.files-list li').eq(data.listPosition).find('input').trigger('change')
				} else if (data.result.failed) {
					parent.find('.files-list li').eq(data.listPosition).remove()
					if (showDebug === true) {
						globalNotification('error', data.result.debug)
					}
				}
			}
		})
		this.form.find('.fileupload-cover').on('click', '.files-list .delete-file', function(e) {
			e.preventDefault()
			let key = jQuery(this).parent().find('input').val()
			jQuery(this).addClass('icon-spin5 animate-spin').html('')
			jQuery.ajax({
				url: FC.ajaxurl,
				type: 'POST',
				context: jQuery(this),
				data: `action=formcraft3_file_delete&id=${key}&formcraft3_wpnonce=${jQuery('#formcraft3_wpnonce').val()}`,
				dataType: 'json'
			})
			.done(function(response) {
				if (response.success) {
					jQuery(this).parent().slideUp(200, function() {
						jQuery(this).find('input').val('').trigger('change')
						jQuery(this).remove()
					})
				} else {
					jQuery(this).removeClass('icon-spin5 animate-spin').html('×')
				}
			})
			.always(function() {
				jQuery(this).removeClass('icon-spin5 animate-spin').html('×')
			})
		})
	}

	setupTimepickerFields() {
		this.form.on('input, change', '.time-fields-cover > select, .time-fields-cover > input', function() {
			let parent = jQuery(this).parent()
			let hrs = parent.find('select').eq(0).val()
			let minute = parent.find('select').eq(1).val()
			let meridian = parent.find('input').val()
			if (jQuery(this).parent().hasClass('hide-meridian-true')) {
				parent.parent().find('input[type="hidden"]').val(`${hrs}:${minute}`).trigger('change')
			} else {
				parent.parent().find('input[type="hidden"]').val(`${hrs}:${minute} ${meridian}`).trigger('change')
			}
		})
		this.form.on('focus', '.meridian-picker', function() {
			if (jQuery(this).val() === 'am') {
				jQuery(this).val('pm').trigger('change')
			} else if (jQuery(this).val() === 'pm') {
				jQuery(this).val('am').trigger('change')
			} else {
				jQuery(this).val('am').trigger('change')
			}
			jQuery(this).blur()
			jQuery(this).trigger('input')
		})
	}

	setupAddressFields() {
		if (typeof AddressPicker === 'undefined') {
			jQuery('.address-picker-field').parents('.field-cover').find('.address-field-map').html(translate.needAPIKey).css('height', 'auto').css('color', 'red')
			return
		}

		jQuery('.address-picker-field').each(function() {
			let thisField = jQuery(this)
			jQuery(this).on('click', (e) => {
				if (helpers.isiOS()) {
					e.preventDefault()
					thisField.focus()
				}
			})
			if (!jQuery(this).is('[class*=tt-]')) {
				let restrict = jQuery(this).attr('data-map-restrict') || ''
				if (jQuery(this).attr('data-show-map') === 'true') {
					jQuery(this).parents('.field-cover').find('.address-field-map').css('height', jQuery(this).attr('data-map-height'))
					jQuery(this).data('addressField', new AddressPicker({
						map: {
							id: jQuery(this).parents('.field-cover').find('.address-field-map')[0]
						},
						reverseGeocoding: true,
						autocompleteService: {
							componentRestrictions: { country: restrict }
						}
					}))
					jQuery(this).typeahead(null, {
						displayKey: 'description',
						source: jQuery(this).data('addressField').ttAdapter()
					})
					jQuery(this).on('typeahead:selected', jQuery(this).data('addressField').updateMap)
					jQuery(this).on('typeahead:cursorchanged', jQuery(this).data('addressField').updateMap)
					jQuery(jQuery(this).data('addressField')).on('addresspicker:selected', (event, result) => {
						jQuery(this).parents('.address-cover').find('.address-picker-field-hidden').val(result.placeResult.formatted_address)
						jQuery(this).val(result.address())
					})
				} else {
					jQuery(this).data('addressField', new AddressPicker({
						autocompleteService: {
							componentRestrictions: { country: restrict }
						}
					}
					))
					jQuery(this).typeahead(null, {
						displayKey: 'description',
						source: jQuery(this).data('addressField').ttAdapter()
					})
					jQuery(this).parents('.field-cover').find('.address-field-map').hide()
					jQuery(this).on('typeahead:selected', jQuery(this).data('addressField').updateMap)
					jQuery(this).on('typeahead:cursorchanged', jQuery(this).data('addressField').updateMap)
					jQuery(jQuery(this).data('addressField')).on('addresspicker:selected', (event, result) => {
						jQuery(this).parents('.address-cover').find('.address-picker-field-hidden').val(result.placeResult.formatted_address)
						jQuery(this).val(result.address())
					})
				}
				jQuery('.tt-hint').prop('readonly', false).prop('disabled', true)
			}
		})
	}

	prepareMathFormulas() {
		this.FormCraftMath = []
		let self = this
		this.form.find('.customText-cover > div, .stripe-cover div.stripe-amount-show, .stripe-cover input.stripe-amount-hidden, .customText-cover input[type="hidden"], .allow-math').each(function() {
			let html, match, text, textToSearch
			if (jQuery(this).prop('type') === 'hidden') {
				text = textToSearch = jQuery(this).val()
			} else {
				text = jQuery(this).text()
				html = jQuery(this).html()
				let temp = jQuery('<div>').html(html)
				temp.find('.fc-third-party').remove()
				textToSearch = temp.text()
			}
			let pattern = /\[(.*?)\]/g
			while ((match = pattern.exec(textToSearch)) !== null) {
				match[0] = jQuery('<div/>').text(match[0]).html()
				let identifier = Math.random().toString(36).replace(/[^a-z]+/g, '').substring(0, 8)
				if (jQuery(this).prop('type') === 'hidden') {
					jQuery(this).attr('id', `bind-math-${identifier}`).val('')
				} else {
					html = html.replace(match[0], `<span id="bind-math-${identifier}"></span>`)
					jQuery(this).html(html)
				}

				self.FormCraftMath[identifier] = { identifier: identifier, variables: [] }
				self.FormCraftMath[identifier].string = match[1].replace(/[^a-zA-Z0-9.*()\-,+\/]+/g, '').toLowerCase()
				if (self.FormCraftMath[identifier].string.slice(-1).replace(/[^.*\-,+\/]+/g, '') !== '') {
					self.FormCraftMath[identifier].string = self.FormCraftMath[identifier].string.slice(0, self.FormCraftMath[identifier].string.length - 1)
				}
				if (self.FormCraftMath[identifier].string.replace(/[^.*()\-,+\/]+/g, '') === '') {
					self.FormCraftMath[identifier].resultType = 'string'
				} else {
					self.FormCraftMath[identifier].resultType = 'math'
				}
				let fields = self.FormCraftMath[identifier].string.split(/[*()\-,+\/]/)
				for (let field in fields) {
					if (fields[field] === '' || typeof fields[field] === 'function' || fields[field].replace(/[^\d.-]/g, '') === fields[field]) {
						continue
					}
					self.FormCraftMath[identifier].variables.push(fields[field])
				}
				self.FormCraftMath[identifier].variables = self.FormCraftMath[identifier].variables.sort(function(a, b) {
					return parseInt(b.replace('field', ''), 10) - parseInt(a.replace('field', ''), 10)
				})
			}
		})
	}

	checkIfApplyMath(element) {
		let fieldID = jQuery(element).attr('data-field-id')
		for (let formula in this.FormCraftMath) {
			for (let field in this.FormCraftMath[formula].variables) {
				if (this.FormCraftMath[formula].variables[field] === fieldID) {
					this.calculateAndApplyMath(this.FormCraftMath[formula])
				}
			}
		}
	}

	calculateAndApplyMath(formula) {
		let mathResult
		let form = jQuery(`#bind-math-${formula.identifier}`).parents('form')
		let thousand = jQuery(`#bind-math-${formula.identifier}`).parents('form').attr('data-thousand')
		let decimal = jQuery(`#bind-math-${formula.identifier}`).parents('form').attr('data-decimal')

		if (formula.variables.length === 1 && formula.variables[0] === formula.string) {
			// Do this if the [] block has one variable
			mathResult = this.getFieldValue(jQuery(`[data-field-id="${formula.variables[0]}"]`), 'string')
			if (jQuery(`#bind-math-${formula.identifier}`).prop('type') === 'hidden') {
				mathResult = parseFloat(mathResult)
				setTimeout(() => {
					jQuery(`#bind-math-${formula.identifier}`).val(mathResult).trigger('change')
				})
			} else {
				mathResult = mathResult.toString().replace(/[.]/g, decimal).replace(/\B(?=(\d{3})+(?!\d))/g, thousand)
				jQuery(`#bind-math-${formula.identifier}`).text(mathResult)
			}
			jQuery(document).trigger('formcraft_math_change', [form])
		} else {
			// Do this if the [] block has more than one variable
			let string = formula.string
			for (let field in formula.variables) {
				if (typeof formula.variables[field] === 'function') {
					continue
				}
				let value = this.getFieldValue(jQuery(form).find(`[data-field-id="${formula.variables[field]}"]`), 'number')
				let reg = new RegExp(formula.variables[field], 'g')
				value = value === '' ? 0 : value
				string = string.replace(reg, value)
			}
			string = string.replace(/--/g, '+')
			mathResult = parseFloat(parser.evaluate(string).toFixed(2))
			mathResult = isNaN(mathResult) ? 0 : mathResult
			mathResult = !isFinite(mathResult) ? '∞' : mathResult
			if (jQuery(`#bind-math-${formula.identifier}`).prop('type') === 'hidden') {
				jQuery(`#bind-math-${formula.identifier}`).val(mathResult).trigger('change')
			} else {
				mathResult = mathResult.toString().replace(/[.]/g, decimal).replace(/\B(?=(\d{3})+(?!\d))/g, thousand)
				jQuery(`#bind-math-${formula.identifier}`).text(mathResult)
			}
			jQuery(document).trigger('formcraft_math_change', [form])
		}
	}

	checkIfApplyLogic(element) {
		let parent = this.form.parents('.form-live').attr('data-uniq')
		let fieldID = jQuery(element).attr('data-field-id')
		let applied = false

		if (typeof this.FormCraftLogic !== 'undefined' && this.FormCraftLogic !== null && this.FormCraftLogic.length !== 0) {
			for (let logic in this.FormCraftLogic) {
				for (let conditions in this.FormCraftLogic[logic][0]) {

					let tempField = this.FormCraftLogic[logic][0][conditions][2]

					if (typeof tempField !== 'undefined' && tempField.slice(0, 1) === '[' && tempField.replace('[', '').replace(']', '') === fieldID) {
						this.applyLogic(this.FormCraftLogic[logic], parent)
						applied = true
					} else if (this.FormCraftLogic[logic][0][conditions][0] === fieldID) {
						this.applyLogic(this.FormCraftLogic[logic], parent)
						applied = true
					}
				}
			}
		}
		if (applied === true) {
			this.setFormValues(this.setValue)
		}
		if (typeof this.finalHideShowList === 'undefined') {
			return false
		}
		for (let field in this.finalHideShowList) {
			if (field.substr(0, 5) !== 'field') {
				continue
			}
			if (this.finalHideShowList[field].length === 0 || typeof this.finalHideShowList[field] === 'function') {
				continue
			}
			let newState = 'default'
			for (let x of this.finalHideShowList[field]) {
				if (x !== 'default') {
					newState = x
				}
			}
			// this.finalHideShowList[field] = this.finalHideShowList[field].sort()
			// newState = this.finalHideShowList[field][this.finalHideShowList[field].length - 1]
			switch (newState) {

				case 'hide':
				if (!jQuery(`.uniq-${parent} form .form-element-${field}`).hasClass('state-hidden')) {
					jQuery(`.uniq-${parent} form .form-element-${field}`).removeClass('state-hidden state-shown over-write')
					jQuery(`.uniq-${parent} form .form-element-${field}`).slideUp(300).addClass('state-hidden')
					jQuery(`.uniq-${parent} form .form-element-${field}`).trigger('hideElement')
				}
				break

				case 'show':
				if (!jQuery(`.uniq-${parent} form .form-element-${field}`).hasClass('state-shown')) {
					jQuery(`.uniq-${parent} form .form-element-${field}`).removeClass('state-hidden state-shown over-write')
					jQuery(`.uniq-${parent} form .form-element-${field}`).slideDown(300).addClass('state-shown')
					jQuery(`.uniq-${parent} form .form-element-${field}`).trigger('showElement')
				}
				break

				case 'default':
				if (jQuery(`.uniq-${parent} form .form-element-${field}`).hasClass('default-false') && jQuery(`.uniq-${parent} form .form-element-${field}`).hasClass('state-hidden')) {
					jQuery(`.uniq-${parent} form .form-element-${field}`).slideDown(300).removeClass('state-hidden state-shown').addClass('state-shown')
					jQuery(`.uniq-${parent} form .form-element-${field}`).trigger('showElement')
				}
				if (jQuery(`.uniq-${parent} form .form-element-${field}`).hasClass('default-true') && jQuery(`.uniq-${parent} form .form-element-${field}`).hasClass('state-shown')) {
					jQuery(`.uniq-${parent} form .form-element-${field}`).slideUp(300).removeClass('state-hidden state-shown').addClass('state-hidden')
					jQuery(`.uniq-${parent} form .form-element-${field}`).trigger('hideElement')
				}
				break

			}
		}
		this.finalHideShowList = []
	}

	applyLogic(logic, parent) {

		this.finalHideShowList = this.finalHideShowList || []
		window.finalEmailsTo = window.finalEmailsTo || []
		let logicNos = this.FormCraftLogic.indexOf(logic)
		let conditions = logic[0]
		let actions = logic[1]
		let conditionsSatisfied = 0
		let conditionsToSatisfy = logic[2] === 'or' ? 1 : conditions.length

		for (let x in conditions) {

			let value = this.getFieldValue(jQuery(`.uniq-${parent} [data-field-id="${conditions[x][0]}"]`), 'string')
			let conditionToCheck, tempVal
			conditions[x][2] = conditions[x][2] || ''

			if (conditions[x][2].slice(0, 1) === '[') {
				conditionToCheck = conditions[x][2].replace('[', '').replace(']', '')
				conditionToCheck = this.getFieldValue(jQuery(`[data-field-id="${conditionToCheck}"]`), 'string')
			} else {
				conditionToCheck = conditions[x][2]
			}

			switch (conditions[x][1]) {

				case 'equal_to':
				if (conditionToCheck.toString().indexOf('-') === 4 && /^\d+$/.test(conditionToCheck.toString().substr(0, 4))) {
					tempVal = this.dateToDifference(conditionToCheck).toString()
				} else {
					tempVal = conditionToCheck
				}
				if (tempVal === value.toString()) {
					conditionsSatisfied++
				}
				break

				case 'not_equal_to':
				if (conditionToCheck.toString().indexOf('-') === 4) {
					tempVal = this.dateToDifference(conditionToCheck).toString()
				} else {
					tempVal = conditionToCheck
				}
				if (tempVal !== value.toString()) conditionsSatisfied++
				break

				case 'contains':
				if (conditionToCheck === '') {
					if (value !== '') conditionsSatisfied++
					break
				}
				if (value.toString().indexOf(conditionToCheck) !== -1) conditionsSatisfied++
				break

				case 'contains_not':
				if (value.toString().indexOf(conditionToCheck) === -1) conditionsSatisfied++
				break

				case 'greater_than':
				if (conditionToCheck.toString().indexOf('-') !== -1) {
					tempVal = this.dateToDifference(conditionToCheck)
				} else {
					tempVal = conditionToCheck
				}
				if (!isNaN(parseFloat(value)) && parseFloat(value) > parseFloat(tempVal)) conditionsSatisfied++
				break

				case 'less_than':
				if (conditionToCheck.toString().indexOf('-') !== -1) {
					tempVal = this.dateToDifference(conditionToCheck)
				} else {
					tempVal = conditionToCheck
				}
				if (!isNaN(parseFloat(value)) && parseFloat(value) < parseFloat(tempVal)) conditionsSatisfied++
				break
			}
		}
		this.executeLogic(actions, logicNos, conditionsToSatisfy, conditionsSatisfied)
	}

	executeLogic(actions, logicNos, conditionsToSatisfy, conditionsSatisfied) {

		for (let x in actions) {
			switch (actions[x][0]) {

				case 'hide_fields':
				if (!actions[x][1]) continue
				let fieldsToHide = actions[x][1].split(',')
				for (let y in fieldsToHide) {
					if (typeof fieldsToHide[y] === 'function') continue
					this.finalHideShowList[fieldsToHide[y]] = this.finalHideShowList[fieldsToHide[y]] || []
					if (conditionsSatisfied >= conditionsToSatisfy) {
						this.finalHideShowList[fieldsToHide[y]].push('hide')
					} else {
						this.finalHideShowList[fieldsToHide[y]].push('default')
					}
				}
				break

				case 'show_fields':
				if (!actions[x][1]) continue
				let fieldsToShow = actions[x][1].split(',')
				for (let y in fieldsToShow) {
					if (typeof fieldsToShow[y] === 'function') continue
					this.finalHideShowList[fieldsToShow[y]] = this.finalHideShowList[fieldsToShow[y]] || []
					if (conditionsSatisfied >= conditionsToSatisfy) {
						this.finalHideShowList[fieldsToShow[y]].push('show')
					} else {
						this.finalHideShowList[fieldsToShow[y]].push('default')
					}
				}
				break

				case 'email_to':
				if (!actions[x][2]) continue
				let emails = actions[x][2]
				if (conditionsSatisfied >= conditionsToSatisfy) {
					if (window.finalEmailsTo.indexOf(`${logicNos}:${emails}`) === -1) {
						window.finalEmailsTo.push(`${logicNos}:${emails}`)
					}
				} else if (window.finalEmailsTo.indexOf(`${logicNos}:${emails}`) !== -1) {
					window.finalEmailsTo.splice(window.finalEmailsTo.indexOf(`${logicNos}:${emails}`), 1)
				}
				break

				case 'redirect_to':
				window.finalRedirect = window.finalRedirect || []
				if (conditionsSatisfied >= conditionsToSatisfy) {
					window.finalRedirect.push(actions[x][2])
				} else if (window.finalRedirect.indexOf(actions[x][2]) !== -1) {
					window.finalRedirect.splice(window.finalRedirect.indexOf(actions[x][2]), 1)
				}
				break

				case 'trigger_integration':
				if (!actions[x][3]) continue
				window.triggerIntegration = window.triggerIntegration || []
				if (conditionsSatisfied >= conditionsToSatisfy) {
					if (window.triggerIntegration.indexOf(actions[x][3]) === -1) {
						window.triggerIntegration.push(actions[x][3])
					}
				} else if (window.triggerIntegration.indexOf(actions[x][3]) !== -1) {
					window.triggerIntegration.splice(window.triggerIntegration.indexOf(actions[x][3]), 1)
				}
				break

				case 'set_value':
				// if (!actions[x][2]) continue
				this.setValue = this.setValue || []
				let actionsApply
				if (actions[x][2] && actions[x][2].slice(0, 1) === '[') {
					actionsApply = actions[x][2].replace('[', '').replace(']', '')
					actionsApply = this.getFieldValue(jQuery(`[data-field-id="${actionsApply}"]`), 'string')
				} else {
					actionsApply = actions[x][2]
				}
				if (conditionsSatisfied >= conditionsToSatisfy) {
					this.setValue[actions[x][4]] = actionsApply
				} else if (typeof this.setValue[actions[x][4]] !== 'undefined' && this.setValue[actions[x][4]] === actionsApply) {
					// delete this.setValue[actions[x][4]]
				}
				break
			}
		}
	}

	/**
	* Save form data in a JSON string, and store it in the database
	*/
	saveProgress() {
		let data = `${this.form.find('input, textarea, select').not('.no-save, [type="password"], .stripe-amount-hidden').serialize()}&id=${this.form.attr('data-id')}`
		if (!this.lastSaveProgress || this.lastSaveProgress !== data) {
			this.lastSaveProgress = data
		} else {
			return false
		}
		return jQuery.ajax({
			url: FC.ajaxurl,
			type: 'POST',
			data: `action=formcraft3_save_form_progress&${data}&formcraft3_wpnonce=${jQuery('#formcraft3_wpnonce').val()}`,
			dataType: 'json'
		})
	}

	/**
	* Get value of an input field element
	*/
	getFieldValue(element, type) {
		let parentUniq = this.parentElement.attr('data-uniq')
		if (jQuery(element).length === 0) {
			return 0
		}
		let elementType = jQuery(element).prop('type')
		let result
		let decimal = jQuery(element).parents('.fc-form').attr('data-decimal') === ',' ? ',' : '.'
		elementType = jQuery(element).is('select') ? 'select' : elementType
		elementType = jQuery(element).hasClass('hasDatepicker') ? 'date' : elementType
		elementType = jQuery(element).parent().parent().hasClass('files-list') ? 'file' : elementType
		elementType = jQuery(element).parent().parent().hasClass('slider-cover') ? 'slider' : elementType
		switch (elementType) {

			case 'text': case 'password': case 'select': case 'hidden': case 'email': case 'textarea':
			result = jQuery(element).val().replace(decimal, '.')
			break

			case 'slider':
			result = jQuery(element).val().replace(decimal, '.')
			if (result.indexOf(' - ') !== -1) {
				result = (parseFloat(result.split(' - ')[0]) + parseFloat(result.split(' - ')[1])) / 2
			}
			break

			case 'radio': case 'checkbox':
			result = []
			jQuery(`.uniq-${parentUniq} [name="${jQuery(element).prop('name')}"]:checked`).each(function() {
				result.push(jQuery(this).val().replace(decimal, '.'))
			})
			break

			case 'date':
			let date = jQuery(element).datepicker('getDate')
			if (date === null) {
				return ''
			}
			let now = new Date()
			let today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
			date = date === null ? today : date
			result = parseInt((date - today) / (60 * 60 * 24 * 1000), 10)
			break

			case 'file':
			let name = jQuery(element).attr('name')
			result = 0
			jQuery(`[name="${name}"]`).each(function() {
				if (jQuery(this).val() !== '') result++
			})
			break

		}
		if (type === 'string') {
			if (typeof result === 'object') return result.join(', ')
			return result
		}
		if (typeof result === 'object') {
			let sum = 0
			for (let x in result) {
				sum = sum + (isNaN(parseFloat(result[x])) ? 0 : parseFloat(result[x]))
			}
			return sum
		} else if (typeof result === 'string' && result.indexOf('-') !== -1) {
			let temp = result.split('-')
			result = (parseFloat(temp[0].trim()) + parseFloat(temp[1].trim())) / 2
			return isNaN(parseFloat(result)) ? 0 : parseFloat(result)
		}
		return isNaN(parseFloat(result)) ? 0 : parseFloat(result)
	}

	/**
	* Set form field values
	* @param {Object} data e.g. {field1: "Jack", field2: "23"}
	*/
	setFormValues(data) {
		let form = this.form
		for (let x in data) {
			let element = form.find(`[name="${x}"]`).length === 0 ? form.find(`[name="${x}[]"]`) : form.find(`[name="${x}"]`)
			let elementType = element.prop('type')
			elementType = element.is('select') ? 'select' : elementType
			elementType = element.hasClass('hasDatepicker') ? 'date' : elementType
			elementType = element.parent().parent().hasClass('files-list') ? 'file' : elementType
			elementType = element.parents('.field-cover').hasClass('slider-cover') ? 'slider' : elementType
			elementType = element.parents('.field-cover').hasClass('timepicker-cover') ? 'timepicker' : elementType
			switch (elementType) {

				case 'text': case 'email': case 'select': case 'hidden': case 'textarea': case 'date':
				if (element.attr('id')) {
					if (element.attr('id').substr(0, 9) === 'bind-math') break
				}
				if (data[x] !== element.val()) {
					element.val(data[x]).trigger('input').trigger('change')
				}
				break

				case 'radio': case 'checkbox':
				if ((typeof data[x] === 'string' && data[x] === '') || (data[x] === null) && form.find(`[name="${x}[]"]`).length > 0) {
					form.find(`[name="${x}[]"]`).prop('checked', false).trigger('change')
				}
				if (typeof data[x] === 'string' && data[x].indexOf('||') > -1) {
					data[x] = data[x].split('||')
				}
				data[x] = typeof data[x] === 'string' ? [data[x]] : data[x]
				for (let y in data[x]) {
					if (form.find(`[name="${x}[]"]`).length === 0) {
						form.find(`[name="${x}"][value="${data[x][y]}"]`).prop('checked', true).trigger('change')
					} else {
						form.find(`[name="${x}[]"][value="${data[x][y]}"]`).prop('checked', true).trigger('change')
					}
				}
				break

				case 'timepicker':
				element.val(data[x]).trigger('change')
				let time = data[x].replace(' ', ':').split(':')
				time[0] = time[0] === '' || typeof time[0] === 'undefined' ? '00' : time[0]
				time[1] = time[1] === '' || typeof time[1] === 'undefined' ? '00' : time[1]
				time[2] = time[2] === '' || typeof time[2] === 'undefined' ? 'am' : time[2]
				element.parents('.timepicker-cover').find('.time-fields-cover > select').eq(0).val(time[0])
				element.parents('.timepicker-cover').find('.time-fields-cover > select').eq(1).val(time[1])
				element.parents('.timepicker-cover').find('.time-fields-cover > input').eq(0).val(time[2])
				break

				case 'slider':
				if (data[x] === '') break
				if (data[x].indexOf(' - ') !== -1) {
					let temp = data[x].split(' - ')
					temp = temp.map((x) => parseFloat(x.replace(/[^\d.-]/g, '')))
					element.parents('.slider-cover').find('.ui-slider-cover > span').slider('values', temp)
				} else {
					data[x] = data[x].replace(element.attr('data-prefix'), '').replace(element.attr('data-suffix'), '')
					data[x] = isNaN(data[x]) ? 0 : parseFloat(data[x].replace(/[^\d.-]/g, ''))
					element.parents('.slider-cover').find('.ui-slider-cover > span').slider('value', data[x])
				}
				break
			}
		}
	}

	/**
	* Save form data in a JSON string, and store it in the database
	* @param (String) date      format YYYY-MM-DD
	* @return (Number) result   difference in days between input data, and today
	*/
	dateToDifference(date) {
		let temp = date.toString().split('-')
		let now = new Date()
		let today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
		let fieldDate = new Date(temp[0], parseInt(temp[1], 10) - 1, temp[2])
		return parseInt((fieldDate - today) / (60 * 60 * 24 * 1000), 10)
	}

}

jQuery(document).ready(function() {
	jQuery('.fc-form').each(function() {
		let thisForm = new FormCraft(jQuery(this))
		jQuery(this).data('FormCraft', thisForm)
		let alignment = jQuery(this).parents('.form-live.align-left').length ? 'align-left' : ''
		alignment = jQuery(this).parents('.form-live.align-center').length ? 'align-center' : alignment
		alignment = jQuery(this).parents('.form-live.align-right').length ? 'align-right' : alignment
		jQuery(this).addClass(alignment)
	})

	jQuery('[accept]').each(function() {
		if ( jQuery(this).attr('accept') === '.' ) {
			jQuery(this).removeAttr('accept')
		}
	})

	// Fix an issue where autosizing textarea doesn't work when the field is inside an element which is hidden by default
	jQuery('.fc-form-modal').on('shown.bs.fc_modal', function () {
		let form = jQuery(this).find('.fc-form').attr('data-id')
		jQuery(this).find('.fc-form').find('textarea').trigger('input')
		jQuery.get(`${FC.ajaxurl}?action=formcraft3_trigger_view&id=${form}`)
	})
})

/**
* Legacy Support
*/
window.setFormValues = function(form, data) {
	form.data('FormCraft').setFormValues(data)
}

window.datepickerLoad = false

window.showDebug = window.location.href.indexOf('preview=true') > -1 ? true : false

if (window.location.protocol === 'https:') {
	FC.ajaxurl = FC.ajaxurl.replace('http:', 'https:')
	FC.datepickerLang = FC.datepickerLang.replace('http:', 'https:')
}

window.disableFormCraftForm = function(form) {
	form.find('.submit-cover').addClass('disabled')
	form.find('.submit-button').attr('disabled', true)
}

window.enableFormCraftForm = function(form) {
	form.find('.submit-cover').removeClass('disabled')
	form.find('.submit-button').attr('disabled', false)
}

window.canSubmitFormCraftForm = function(form) {
	return !form.find('.submit-button').attr('disabled')
}

/**
* Main function to handle form submission
*/
window.FormCraftSubmitForm = function(element, type, callback) {
	let redirect = ''
	let form = jQuery(element)
	if (type === 'all' && form.find('.form-element-type-submit.state-hidden').length === form.find('.form-element-type-submit').length) {
		return false
	}
	if ( !window.canSubmitFormCraftForm(form) ) {
		return false
	}
	window.disableFormCraftForm(form)

	form.find('.submit-response').slideUp('fast').html()
	let formData = jQuery(element).hasClass('dont-submit-hidden-true') ? form.find('.form-element').not('.state-hidden').find('input, select, textarea').serialize() : form.serialize()
	let hidden = []
	form.find('.form-element.state-hidden').each(function() {
		hidden.push(jQuery(this).attr('data-identifier'))
	})
	hidden = hidden.join(', ')

	let emails = ''
	if (typeof window.finalEmailsTo !== 'undefined') {
		for (let x in window.finalEmailsTo) {
			if (typeof window.finalEmailsTo[x] === 'function') {
				continue
			}
			emails = `${emails},${encodeURIComponent(window.finalEmailsTo[x].substr(window.finalEmailsTo[x].indexOf(':') + 1))}`
		}
	}

	if (typeof window.finalRedirect !== 'undefined' && window.finalRedirect.length !== 0) {
		redirect = encodeURIComponent(window.finalRedirect[window.finalRedirect.length - 1])
	}

	let triggerIntegration
	if (typeof window.triggerIntegration !== 'undefined') {
		triggerIntegration = encodeURIComponent(JSON.stringify(window.triggerIntegration))
	}

	let FieldLabels
	if (typeof form.data('FieldLabels') !== 'undefined') {
		FieldLabels = encodeURIComponent(JSON.stringify(form.data('FieldLabels')))
	}
	let data = `${formData}&id=${form.attr('data-id')}&location=${encodeURIComponent(window.location.href)}&emails=${emails}&hidden=${hidden}&redirect=${redirect}&type=${type}&triggerIntegration=${triggerIntegration}&fieldLabels=${FieldLabels}`

	let abort = { abort: false }
	if (type === 'all') {
		form.find('.validation-lenient, .validation-strict').each(function() {
			if (!jQuery(this).parents('.form-element').hasClass('state-hidden')) {
				let a = jQuery(this).fcValidate()
				if (a === false) {
					abort.abort = true
				}
			}
		})
	} else {
		let pageValidate = type - 1
		form.find(`.form-page-${pageValidate} .validation-lenient, .validation-strict`).each(function() {
			if (!jQuery(this).parents('.form-element').hasClass('state-hidden') && jQuery(this).parents(`.form-page-${pageValidate}`).length !== 0) {
				let a = jQuery(this).fcValidate()
				if (a === false) {
					abort.abort = true
				}
			}
		})
	}
	if (type === 'all') {
		jQuery(document).trigger('formcraft_submit_trigger', [form, data, abort])
	}
	if (abort.abort === true) {
		if (form.find('.error-field').length === 0) {
			return false
		}
		if (helpers.isElementInViewport(form.find('.error-field').first()) === false) {
			if (form.attr('data-auto-scroll') !== 'true') {
				let element = form.find('.error-field').first()[0]
				element.scrollIntoView({behavior: "smooth", block: "start"})
			}
		}
		if (typeof callback !== 'undefined') {
			callback(false)
		}
		window.enableFormCraftForm(form)		
		return false
	}

	form.find('.form-element').removeClass('error-field')
	let tempForm = form
	jQuery.ajax({
		url: FC.ajaxurl,
		type: 'POST',
		timeout: 120000,
		data: `action=formcraft3_form_submit&${data}&formcraft3_wpnonce=${jQuery('#formcraft3_wpnonce').val()}`,
		dataType: 'json'
	})
	.done(function(response) {
		form = tempForm
		if (response.debug) {
			if (response.debug.failed) {
				if (showDebug === true) {
					for (let x in response.debug.failed) {
						globalNotification('error', response.debug.failed[x])
					}
				}
			}
			if (response.debug.success) {
				if (showDebug === true) {
					for (let x in response.debug.success) {
						globalNotification('success', `<i class='formcraft-icon'>check</i> ${response.debug.success[x]}`)
					}
				}
			}
		}
		if (response.failed) {
			if (form.parents('.fc-form-modal').length !== 0) {
				setTimeout(function() {
					form.addClass('shake')
				}, 600)
				setTimeout(function() {
					form.removeClass('shake')
				}, 1100)
			}
			form.find('.validation-lenient').addClass('validation-strict').removeClass('.validation-lenient')
			form.find('.submit-response').html(`<span class="has-error">${response.failed}</span>`).slideDown('fast')
			if (response.errors) {
				for (let field in response.errors) {
					form.find(`.form-element-${field}`).addClass('error-field')
					form.find(`.form-element-${field} .error`).text(response.errors[field])
				}
			}
			if (form.find('.error-field').length !== 0) {
				if (helpers.isElementInViewport(form.find('.error-field').first()) === false) {
					if (form.attr('data-auto-scroll') !== 'true') {
						let element = form.find('.error-field').first()[0]
						element.scrollIntoView({behavior: "smooth", block: "start"})
					}
				}
			}
		} else if (typeof response.success !== 'undefined') {
			window.disableFormCraftForm(form)
			jQuery(document).trigger('formcraft_submit_result', [form, response])
			let delay = parseInt(form.attr('data-delay'), 10)
			delay = isNaN(delay) ? 0 : delay
			delay = Math.max(0, delay)
			if (response.redirect && form.attr('data-no-message-redirect') === 'true') {
				setTimeout(function() {
					form.find('.submit-cover').addClass('disabled')
				}, 0)
				setTimeout(function() {
					window.location.assign(response.redirect)
				}, delay * 1000)
			} else {
				form.append('<div class="final-success"><i class="final-success-check formcraft-icon">check</i><span></span></div>')
				form.find('.final-success > span').html(response.success)
				form.addClass('submitted')
				form.find('.final-success').slideDown(800, function() {
				})
				form.find('.form-page').slideUp(800, function() {
					form.find('.form-element').remove()
				})
				if (form.parents('.fc-form-modal').length === 0 && form.parents('.fc-sticky').length === 0) {
					if (form.attr('data-auto-scroll') !== 'true') {
						jQuery('html, body').animate({ scrollTop: form.offset().top - 100 }, 800)
					}
				}
			}
			if (response.redirect) {
				setTimeout(function() {
					window.location.assign(response.redirect)
				}, delay * 1000)
			}
		}
		if (typeof callback !== 'undefined') {
			callback(response, form)
		}
	})
	.fail(function() {
		jQuery(element).find('.response').text('Connection error')
		if (typeof callback !== 'undefined') {
			callback(false)
		}
	})
	.always(function(response) {
		jQuery(document).trigger('formcraft_submit_success_trigger', [form, response])
		form.find('.submit-cover').addClass('enabled')
		form.find('.submit-cover').removeClass('disabled')
		if (type === 'all') {
			window.enableFormCraftForm(form)
		}
	})
}

jQuery(document).ready(function() {

	if (helpers.isMobile() === true) {
		jQuery('.email-cover input[type="text"]').prop('type', 'email')
	}

	if (jQuery('#fc-form-preview').length === 1) {
		jQuery('body').addClass('formcraft-css')
	}

	jQuery('body').on('click', '.fc-trigger-close', function() {
		jQuery('.fc-sticky').each(function() {
			if (jQuery(this).hasClass('show')) {
				jQuery(this).parent().find('[data-toggle="fc-sticky"]').trigger('click')
			}
		})
	})

	jQuery('.form-element.default-true').hide()
	jQuery('.fc-form').removeClass('fc-temp-class')
	jQuery('.fc-form .form-element.default-true').addClass('state-hidden')
	jQuery('body').on('click', '.field-cover div [class^="icon-"]', function() {
		jQuery(this).parent().find('input').focus()
	})
	jQuery('[href]').each(function() {
		let href = jQuery(this).attr('href')
		if (href.indexOf('form-view/') !== -1) {
			let sub = href.split('form-view/')
			if (jQuery(`.fc-form-modal .fc-form[data-id="${parseInt(sub[sub.length - 1], 10)}"]`).length) {
				let form = jQuery(`.fc-form-modal .fc-form[data-id="${parseInt(sub[sub.length - 1], 10)}"]`).first()
				let uniq = form.parents('.fc-form-modal').attr('id')
				jQuery(this).removeAttr('href')
				jQuery(this).attr('data-toggle', 'fc_modal')
				jQuery(this).attr('data-target', `#${uniq}`)
			}
		}
	})
	jQuery('.fc-form-modal .form-live').each(function() {
		if (jQuery(this).attr('data-bind') !== '') {
			let uniq = jQuery(this).attr('data-uniq')
			jQuery(jQuery(this).attr('data-bind')).each(function() {
				jQuery(this).attr('data-toggle', 'fc_modal')
				jQuery(this).attr('data-target', `#modal-${uniq}`)
			})
		}
	})
	jQuery('.fc-form').each(function() {
		let form = jQuery(this)
		jQuery(document).trigger('formcraft_math_change', [form])
	})

	jQuery('body').on('focus', '.password-cover input[type="password"], .address-cover input[type="text"] ,.oneLineText-cover input[type="text"],.datepicker-cover input[type="text"],.email-cover input[type="text"],.email-cover input[type="email"],.textarea-cover textarea,.dropdown-cover select,.matrix-cover input,.star-cover input,.thumb-cover input', function() {
		jQuery(this).parents('.field-cover, .form-element').addClass('has-focus')
	})
	jQuery('body').on('blur', '.password-cover input[type="password"], .address-cover input[type="text"] ,.oneLineText-cover input[type="text"],.datepicker-cover input[type="text"],.email-cover input[type="text"],.email-cover input[type="email"],.textarea-cover textarea,.dropdown-cover select,.matrix-cover input,.star-cover input,.thumb-cover input', function() {
		jQuery(this).parents('.field-cover, .form-element').removeClass('has-focus')
	})

	jQuery('body').on('change', '.dropdown-cover select', function() {
		if (jQuery(this).find('option:checked').length > 0 && jQuery(this).find('option:checked').text() !== '') {
			jQuery(this).parents('.field-cover').addClass('has-input')
		} else {
			jQuery(this).parents('.field-cover').removeClass('has-input')
		}
	})
	jQuery('body').on('input', '.address-cover input[type="text"], .oneLineText-cover input[type="text"],.password-cover input[type="password"],.datepicker-cover input[type="text"],.email-cover input[type="text"],.email-cover input[type="email"], .textarea-cover textarea', function() {
		if (jQuery(this).val().length > 0 || (typeof jQuery(this).attr('placeholder') !== 'undefined' && jQuery(this).attr('placeholder').length > 0)) {
			jQuery(this).parents('.field-cover').addClass('has-input')
		} else {
			jQuery(this).parents('.field-cover').removeClass('has-input')
		}
	})

	jQuery('.oneLineText-cover input[type="text"],.datepicker-cover input[type="text"], .email-cover input[type="text"], .email-cover input[type="email"], .textarea-cover textarea').trigger('input')
	jQuery('.customText-cover input[type="hidden"],.timepicker-cover input[type="hidden"],.slider-cover input[type="hidden"],.fileupload-cover input[type="hidden"],.star-cover input[type="radio"],.thumb-cover input[type="radio"],.dropdown-cover select').trigger('change')

	if (jQuery('.checkbox-cover input[type="checkbox"], .checkbox-cover input[type="radio"]').length > 50) {
		jQuery('.checkbox-cover input[type="checkbox"], .checkbox-cover input[type="radio"]').filter(function(x, y) {
			return jQuery(y).prop('checked')
		}).trigger('change')
	} else {
		jQuery('.checkbox-cover input[type="checkbox"], .checkbox-cover input[type="radio"]').trigger('change')
	}


	setTimeout(function() {
		jQuery('.time-fields-cover > select').first().trigger('change')
	}, 500)
	jQuery('.fc-pagination').each(function() {
		jQuery(this).find('.pagination-trigger').eq(0).addClass('active')
	})
	jQuery('.fc-form .form-page-0').addClass('active')
	jQuery('body').on('change', '.update-label label input', function() {
		if (jQuery(this).is(':checked')) {
			let name = jQuery(this).attr('name')
			jQuery(`[name="${name}"]`).parent().removeClass('active')
			jQuery(this).parent().addClass('active')
		}
	})
	jQuery('body').on('change', '.checkbox-cover label input', function() {
		if (jQuery(this).is(':checked')) {
			jQuery(this).parent().parent().find('.active').removeClass('active')
			jQuery(this).parent().addClass('active')
		}
	})
	if (helpers.isiOS()) {
		jQuery('body').on('touchstart', '.star-cover label, .thumb-cover label', function() {
			event.preventDefault()
			jQuery(this).trigger('click')
		})
		jQuery('body').on('touchstart', '[data-toggle="fc_modal"]', function(event) {
			event.preventDefault()
			// jQuery(this).trigger('click')
		})
		jQuery('body').on('touchstart', '[data-toggle="fc-sticky"]', function() {
			event.preventDefault()
			// jQuery(this).trigger('click')
		})
	}
	jQuery('body').on('change', '.star-cover label input', function() {
		if (jQuery(this).is(':checked')) {
			let name = jQuery(this).attr('name')
			jQuery(`[name="${name}"]`).parent().removeClass('active')
			jQuery(this).parent().addClass('active')
			let index = jQuery(this).parent().index()
			jQuery(this).parent().parent().find('label').removeClass('fake-click')
			jQuery(this).parent().parent().find('label').slice(0, index + 1).addClass('fake-click')
		}
	})
	jQuery('.update-label label.active').removeClass('active')
	jQuery('.powered-by').each(function() {
		let width = jQuery(this).parent().find('.fc-form').outerWidth()
		jQuery(this).css('width', `${width} px`)
	})
	setTimeout(function() {
		jQuery('.fc-form-modal').appendTo('body')
	}, 500)
	jQuery('.formcraft-css.placement-right').appendTo('body')
	jQuery('.formcraft-css.placement-left').appendTo('body')
	jQuery('.body-append').appendTo('body')
	setTimeout(function() {
		jQuery('.image_button_cover a').each(function() {
			let height = (parseInt(jQuery(this).outerWidth(), 10) / 2) + jQuery(this).outerHeight()
			jQuery(this).css('top', `-${height}px`)
		})
	}, 100)
	setTimeout(function() {
		jQuery('.image_button_cover a').each(function() {
			jQuery(this).parents('.image_button_cover').addClass('now-show')
		})
	}, 400)
	jQuery('body').on('click', '[data-toggle="fc-sticky"]', function() {
		let element = jQuery(jQuery(this).attr('data-target'))
		let elementButton = jQuery(jQuery(this).attr('data-target')).parent().find('.fc-sticky-button')
		if (element.hasClass('show')) {
			element.addClass('hiding')
			elementButton.addClass('showing')
			setTimeout(function() {
				element.removeClass('show hiding')
				elementButton.removeClass('hide showing')
			}, 400)
		} else {
			let form = element.find('.fc-form').attr('data-id')
			jQuery.get(`${FC.ajaxurl}?action=formcraft3_trigger_view&id=${form}`)
			element.addClass('show')
			elementButton.addClass('hide')
		}
	})
	jQuery(document).keyup(function(e) {
		jQuery('.fc-sticky').each(function() {
			if (jQuery(this).hasClass('show') && e.which === 27) {
				jQuery(this).parent().find('[data-toggle="fc-sticky"]').trigger('click')
			}
		})
	})
	let bodyHeight = parseInt(jQuery(window).height(), 10) * 0.8
	jQuery('.fc-sticky').css('max-height', `${bodyHeight}px`)
	jQuery(document).mouseup(function (e) {
		let container1 = jQuery('.fc-sticky')
		let container2 = jQuery('.formcraft-datepicker')
		let container3 = jQuery('.fc-sticky-button')
		if (!container1.is(e.target) && container1.has(e.target).length === 0 && !container2.is(e.target) && container2.has(e.target).length === 0 && !container3.is(e.target)) {
			jQuery('.fc-sticky').each(function() {
				if (jQuery(this).hasClass('show')) {
					jQuery(this).parent().find('[data-toggle="fc-sticky"]').trigger('click')
				}
			})
		}
	})
	setTimeout(function() {
		jQuery('.fc-sticky').each(function() {
			if (jQuery(this).hasClass('fc-sticky-right') || jQuery(this).hasClass('fc-sticky-left')) {
				let height = jQuery(this).find('.fc-form').height()
				height = Math.min(bodyHeight, height)
				jQuery(this).css('margin-top', `-${(height / 2)}px`)
				jQuery(this).find('.fc-form').addClass('calculated')
			}
		})
	}, 500)

	jQuery('.fc-form-modal').each(function() {
		if (jQuery(this).attr('data-auto') && !isNaN(parseFloat(jQuery(this).attr('data-auto')))) {
			let modal = jQuery(this)
			setTimeout(function() {
				modal.fc_modal('show')
			}, parseFloat(jQuery(this).attr('data-auto')) * 1000)
		}
		if (jQuery(this).find('.pagination-trigger').length > 1) {
			let height = jQuery(this).find('.fc_close').parents('.fc_modal-dialog').find('.fc-pagination-cover').height()
			let width = jQuery(this).find('.fc_close').parents('.fc_modal-dialog').find('.fc-form').width()
			jQuery(this).find('.fc_close').css({
				'margin-top': height,
				left: '50%',
				'margin-left': ((width / 2) - 30)
			})
		}
	})
	jQuery('.fc-sticky').each(function() {
		if (jQuery(this).attr('data-auto') && !isNaN(parseFloat(jQuery(this).attr('data-auto')))) {
			let modal = jQuery(this)
			setTimeout(function() {
				if (!modal.hasClass('show')) {
					modal.parent().find('.fc-sticky-button').trigger('click')
				}
			}, parseFloat(jQuery(this).attr('data-auto')) * 1000)
		}
	})
	jQuery('.star-cover label').on('hover', function() {
		let index = jQuery(this).index()
		jQuery(this).parent().find('label').slice(0, index + 1 - jQuery(this).prevAll('.formcraft-icon').length).addClass('fake-hover')
		jQuery(this).parent().find('label').slice(index + 1 - jQuery(this).prevAll('.formcraft-icon').length, jQuery(this).parent().find('label').length).addClass('fake-empty')
	}, function() {
		jQuery(this).parent().find('label').removeClass('fake-hover fake-empty')
	})
	if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
		jQuery('.datepicker-cover input[type="text"]').attr('readonly', 'readonly')
	}
	setTimeout(function() {
		jQuery('body').on('blur change', '.fc-form .validation-lenient', function(e) {
			if (jQuery(this).fcValidate() === false) {
				jQuery(this).addClass('validation-strict').removeClass('validation-lenient')
			}
		})
	}, 1000)
	jQuery('body').on('keyup change input', '.fc-form .validation-strict', function() {
		if (jQuery(this).fcValidate() === false) {
			jQuery(this).addClass('validation-strict').removeClass('validation-lenient')
		} else {
			jQuery(this).addClass('validation-lenient').removeClass('validation-strict')
		}
	})
})
