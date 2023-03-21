let xss = require('xss')
let translate = window.FC.fct

xss.whiteList['label'] = []
window.helpQuery = []
window.helpQueryType = []
window.helpPointer = -1

function globalNotification(type, message) {
	type = type === 'error' ? 'red' : 'green'
	jQuery('#notification-panel').removeClass('red green').addClass(type).html(message)
	setTimeout(() => {
		jQuery('#notification-panel').removeClass('red green').html('')
	}, 8000)
}

window.onbeforeunload = function (event) {
	if (window.lastCheckedFieldsNos !== 0 && window.lastSaveFieldsNos !== window.lastCheckedFieldsNos) {
		let message = translate['loseChanges']
		if (typeof event === 'undefined') {
			event = window.event
		}
		if (event) {
			event.returnValue = message
		}
		return message
	}
}


function getURLParameter(name) {
	return decodeURIComponent((new RegExp(`[?|&]${name}=([^&;]+?)(&|#|;|$)`).exec(location.search) || [, ''])[1].replace(/\+/g, '%20')) || null
}

function applySelectFix(id, value) {
	setTimeout(function() {
		jQuery(`#${id}`).val(value)
	}, 500)
}

function shadeColor(color, percent) {

	if (typeof color === 'undefined') {
		return '#666666'
	}

	let R = parseInt(color.substring(1, 3), 16)
	let G = parseInt(color.substring(3, 5), 16)
	let B = parseInt(color.substring(5, 7), 16)

	R = parseInt(R * (100 + percent) / 100, 10)
	G = parseInt(G * (100 + percent) / 100, 10)
	B = parseInt(B * (100 + percent) / 100, 10)

	R = (R < 255) ? R : 255
	G = (G < 255) ? G : 255
	B = (B < 255) ? B : 255

	let RR = ((R.toString(16).length === 1) ? `0${R.toString(16)}` : R.toString(16))
	let GG = ((G.toString(16).length === 1) ? `0${G.toString(16)}` : G.toString(16))
	let BB = ((B.toString(16).length === 1) ? `0${B.toString(16)}` : B.toString(16))

	return `#${RR + GG + BB}`
}


function loadAddons() {
	jQuery.ajax({
		url: FC.ajaxurl,
		type: 'GET',
		context: jQuery(this),
		data: {
			action: 'formcraft3_get',
			URL: `http://formcraft-wp.com/?type=get_addons&key=${FC.licenseKey}`
		},
		cache: false,
		dataType: 'json'
	})
		.done(function(response) {
			if (response.failed) {
				globalNotification('error', response.failed)
				jQuery('.new-addons').html('')
				return false
			}
			let html = ''
			let addons = []
			addons.free = []
			addons.purchased = []
			addons.other = []
			for (let x in response.addons) {
				if (jQuery(`.addon-id-${response.addons[x].ID}`).length > 0) {
					continue
				}
				if (response.addons[x].price === 0) {
					addons.free.push(response.addons[x])
				} else if (response.addons[x].purchased === true) {
					addons.purchased.push(response.addons[x])
				} else {
					addons.other.push(response.addons[x])
				}
			}
			let nos = 0
			let addonType
			for (let type in addons) {
				if (addons[type].length === 0) {
					continue
				}
				if (type === 'free') {
					addonType = translate['Free AddOns']
				}
				if (type === 'purchased') {
					addonType = translate['Purchased AddOns']
				}
				if (type === 'other') {
					addonType = translate['Paid AddOns']
				}
				html = `${html}<div class="addon-type">${addonType}</div>`
				for (let addon in addons[type]) {
					if (typeof addons[type][addon] !== 'object') {
						continue
					}
					addons[type][addon].price = parseInt(addons[type][addon].price, 10)
					let button
					if (addons[type][addon].price === 0 || addons[type][addon].purchased === true) {
						button = `<button class="toggle-install formcraft-button small" data-plugin="${addons[type][addon].ID}"><span>Install Plugin</span><div class='formcraft-loader'></div></button><a class="read-more-addon" href="http://formcraft-wp.com/addons/?page_id=${addons[type][addon].ID}" target="_blank">${translate['read more']}</a>`
					} else {
						button = `<a target="_blank" href="http://formcraft-wp.com/buy/?addons=${addons[type][addon].ID}&key=${FC.licenseKey}" class='formcraft-button small purchase green'><span>Purchase for $${addons[type][addon].price}</span></a><a class="read-more-addon" href="http://formcraft-wp.com/addons/?page_id=${addons[type][addon].ID}" target="_blank">${translate['read more']}</a>`
					}
					html = `${html}<div class="addon"><div class="addon-head ac-toggle"><div class="addon-logo-cover"><img class="addon-logo" src="${addons[type][addon].logo}"/></div><span class="addon-title">${addons[type][addon].addon_name}</span><span class="toggle-angle"><i class='formcraft-icon icon-type-down'>keyboard_arrow_down</i><i class='formcraft-icon icon-type-up'>keyboard_arrow_up</i></span></div><div class="addon-content ac-inner"><div class='addon-excerpt'>${addons[type][addon].addon_description.replace(/-&gt;/g, '→')}</div>${button}</div></div>`
					nos += 1
				}
			}
			if (nos === 0) {
				html = `<div class=\'no-addons\'>${translate['Nothing Left To Install']}</div>`
			}
			jQuery('.new-addons').html(html)
		})
		.fail(function() {
			jQuery('.new-addons').html('')
			globalNotification('error', translate['Please check your internet connection'])
		})
}

function updateHelp(query, type, log) {
	jQuery('#help_modal').addClass('loading')
	jQuery.ajax({
		url: FC.ajaxurl,
		type: 'GET',
		data: {
			action: 'formcraft3_get',
			URL: query
		},
		context: jQuery(this),
		cache: false,
		dataType: 'json'
	})
	.done(function(response) {
		if (response.failed) {
			jQuery('#help-content-content').html(`<div style="line-height:normal;letter-spacing:0px;font-size:1.5em;margin:50px 0;text-align:center">Something broke: <br>${response.failed}</div>`)
			return false
		}
		if (log === true) {
			window.helpQuery.push([query, type])
			window.helpPointer += 1
		}
		let html = `<div id="help-top"><span class="formcraft-button small" id="help-back">← ${translate['back']}</span><span class="formcraft-button small" id="help-home">Index</span><span class="formcraft-button small close" data-dismiss="fc_modal" aria-label="Close">close</span></div><div class="article-content">`
		if (type === 'categories') {
			let htmlListElement = ''
			if (query.indexOf('search=') !== -1) {
				let search = query.split('search=')
				html = `${html}<h2>Search: ${search[search.length - 1]}</h2><div style="padding-bottom: 10%">`
			} else {
				html = `${html}<h2>${translate['Help Topics']}</h2><div style="padding-bottom: 10%">`
			}
			let HTMLarray = []
			if (response.length === 0) {
				html = `${html}<div class="no-posts"><i class="icon-emo-unhappy"></i> ${translate['Sorry, nothing here']}</div>`
			} else {
				for (let x in response) {
					let ID
					for (let i in response[x]['_embedded']['wp:term']) {
						ID = response[x]['_embedded']['wp:term'][i][0].id
						break
					}
					HTMLarray[response[x]['_embedded']['wp:term'][0][0].name] = HTMLarray[response[x]['_embedded']['wp:term'][0][0].name] || []
					HTMLarray[response[x]['_embedded']['wp:term'][0][0].name].push([`<div class="post" data-id="${response[x].id}">${response[x].title.rendered}</div>`, ID])
				}
				for (let y in HTMLarray) {
					html = `${html}<h3 class="category" data-id="${HTMLarray[y][0][1]}">${y}</h3>`
					htmlListElement = `${htmlListElement}<li class="category" data-id="${HTMLarray[y][0][1]}">${y}</li>`
					let current = 0
					for (let z in HTMLarray[y]) {
						if (current === 6) {
							break
						}
						current += 1
						html = html + HTMLarray[y][z][0]
					}
				}
				htmlListElement = `${htmlListElement}<li><a style="box-shadow:none;outline:none;color:inherit;text-decoration:none;margin:-8px -12px;display: block;height: 34px;line-height: 34px;padding-left: 12px;" target="_blank" href="http://formcraft-wp.com/support">${translate['Contact Support']}</a></li>`
			}
			if (jQuery('#help-menu ul').html().trim() === '') {
				jQuery('#help-menu ul').html(htmlListElement)
			}
			html = `${html}</div>`
		} else if (type === 'posts') {
			html = `${html}<h2>${response[0]['_embedded']['wp:term'][0][0].name}</h2><div style="padding-top:3%; overflow: auto; max-height: 100%; padding-bottom: 10%">`
			for (let x in response) {
				html = `${html}<div class="post" data-id="${response[x].id}">${response[x].title.rendered}</div>`
			}
			html = `${html}</div>`
		} else if (type === 'post') {
			response.content = response.content.rendered.replace(/<pre>/g, '<code class="code">').replace(/<pre/g, '<code class="code"').replace(/<\/pre>/g, '</code>').replace(/-&gt;/g, '→')
			html = `${html}<h2>${response.title.rendered}</h2><article>${response.content}</article>`
		}
		html = `${html}</div>`
		jQuery('#help-content-content').html(html)
		jQuery('#help-content-content code').each(function(i, block) {
			hljs.highlightBlock(block)
		})
		jQuery('#help-content-content a').each(function() {
			jQuery(this).attr('target', '_blank')
		})
	})
	.fail(function() {
		globalNotification('error', translate['Please check your internet connection'])
	})
	.always(function() {
		jQuery('#help_modal').removeClass('loading')
		if (window.helpPointer === 0) {
			jQuery('#help-top').addClass('disabled')
		} else {
			jQuery('#help-top').removeClass('disabled')
		}
	})
}

jQuery(document).mouseup(function (e) {
	jQuery('.icons-list').each(function() {
		let container = jQuery(this)
		if (!container.is(e.target) && container.has(e.target).length === 0) {
			if (container.find('.hide-checkbox.ng-hide').length === 0) {
				container.find('div span:nth-child(2)').trigger('click')
			}
		}
	})
})

jQuery(document).ready(function() {

	if (jQuery('#formcraft3_wpnonce').length) {
		jQuery.ajaxSetup({
			data: {
				formcraft3_wpnonce: jQuery('#formcraft3_wpnonce').val()
			}
		})
	}

	jQuery('body').on('click', '.single-option textarea', function() {
		event.preventDefault()
	})

	jQuery('.option-box').hover(function() {
		jQuery('body').css('overflow', 'hidden')
	}, function() {
		jQuery('body').css('overflow', 'auto')
	})

	let h = window.innerHeight - parseInt(jQuery('.option-box').css('margin-top'), 10) - 32 - parseInt(getComputedStyle(jQuery('#wpbody')[0]).fontSize, 10)
	jQuery('.option-box').css('height', `${h}px`)
	jQuery('body').addClass('formcraft-css')
	jQuery('body').on('change', '.update-label label input', function() {
		if (jQuery(this).is(':checked')) {
			let name = jQuery(this).attr('name')
			jQuery(`[name="${name}"]`).parent().removeClass('active')
			jQuery(this).parent().addClass('active')
		}
	})
	jQuery('body').on('focus', '.meridian-picker', function() {
		if (jQuery(this).val() === 'am') {
			jQuery(this).val('pm')
		} else if (jQuery(this).val() === 'pm') {
			jQuery(this).val('am')
		} else {
			jQuery(this).val('am')
		}
		jQuery(this).blur()
		jQuery(this).trigger('input')
	})

	jQuery('body').on('focus', '.password-cover input[type="password"],.oneLineText-cover input[type="text"],.datepicker-cover input[type="text"],.email-cover input[type="text"],.textarea-cover textarea,.dropdown-cover select', function() {
		jQuery(this).parents('.field-cover').addClass('has-focus')
	})

	jQuery('body').on('blur', '.password-cover input[type="password"],.oneLineText-cover input[type="text"],.datepicker-cover input[type="text"],.email-cover input[type="text"],.textarea-cover textarea,.dropdown-cover select', function() {
		jQuery(this).parents('.field-cover').removeClass('has-focus')
	})

	jQuery('body').on('change', '.dropdown-cover select', function() {
		if (jQuery(this).find('option:checked').length > 0 && jQuery(this).find('option:checked').text() !== '') {
			jQuery(this).parents('.field-cover').addClass('has-input')
		} else {
			jQuery(this).parents('.field-cover').removeClass('has-input')
		}
	})

	jQuery('body').on('input', '.oneLineText-cover input[type="text"],.password-cover input[type="password"],.datepicker-cover input[type="text"],.email-cover input[type="text"],.textarea-cover textarea', function() {
		if (jQuery(this).val().length > 0 || jQuery(this).attr('placeholder').length > 0) {
			jQuery(this).parents('.field-cover').addClass('has-input')
		} else {
			jQuery(this).parents('.field-cover').removeClass('has-input')
		}
	})

	setTimeout(function() {
		jQuery('.oneLineText-cover input[type="text"],.password-cover input[type="password"],.datepicker-cover input[type="text"],.email-cover input[type="text"],.textarea-cover textarea').trigger('input')
	}, 1000)

	jQuery('body').on('click', '.toggle-install', function() {
		jQuery(this).addClass('loading').attr('disabled', 'disabled')
		jQuery.ajax({
			url: FC.ajaxurl,
			type: 'POST',
			context: jQuery(this),
			dataType: 'json',
			data: {
				action: 'formcraft3_install_plugin',
				plugin: jQuery(this).attr('data-plugin')
			}
		})
			.done(function(response) {
				if (response.failed) {
					globalNotification('error', response.failed)
					jQuery(this).removeClass('loading').removeAttr('disabled')
				} else if (response.success) {
					window.pluginInstalled = response.plugin
					jQuery('#plugin-save').trigger('click')
				} else {
					globalNotification('error', translate['Unknown Error.'])
					jQuery(this).removeClass('loading').removeAttr('disabled')
				}
			})
			.fail(function() {
				globalNotification('error', translate['Unknown Error.'])
				jQuery(this).removeClass('loading').removeAttr('disabled')
			})
	})
	jQuery('body').on('click', '.ac-toggle', function(e) {
		e.preventDefault()
		let jQthis = jQuery(this)
		if (jQthis.next()[0].classList.contains('show')) {
			jQthis.next().removeClass('show')
			jQthis.next().slideUp(300)
			jQthis.removeClass('active')
		} else {
			jQthis.parent().parent().find('.ac-inner').removeClass('show')
			jQthis.parent().parent().find('.ac-inner').slideUp(300)
			jQthis.parent().parent().find('.ac-toggle').removeClass('active')
			jQthis.next().toggleClass('show')
			jQthis.next().slideToggle(300)
			jQthis.addClass('active')
		}
	})
	jQuery('.simple-toggle').click(function() {
		let jQthis = jQuery(this)
		if (jQthis.next()[0].classList.contains('show')) {
			jQthis.next().removeClass('show')
			jQthis.next().slideUp(300)
			jQthis.removeClass('active')
		} else {
			jQthis.parent().parent().find('.simple-inner').removeClass('show')
			jQthis.parent().parent().find('.simple-inner').slideUp(300)
			jQthis.parent().parent().find('.simple-toggle').removeClass('active')
			jQthis.next().toggleClass('show')
			jQthis.next().slideToggle(300)
			jQthis.addClass('active')
		}
	})
	jQuery('body').on('click', '.form-cover-builder', function(event) {
		if (jQuery(event.target).parents('.fc-form').length === 0) {
			jQuery('.iris-picker').hide()
			if (jQuery('#form_styling_box').hasClass('state-true')) {
				jQuery('#form_styling_button').trigger('click')
			}
			if (jQuery('#form_addon_box').hasClass('state-true')) {
				jQuery('#form_addons_button').trigger('click')
			}
			if (jQuery('#form_options_box').hasClass('state-true')) {
				jQuery('#form_options_button').trigger('click')
			}
			if (jQuery('#form_logic_box').hasClass('state-true')) {
				jQuery('#form_logic_button').trigger('click')
			}
			jQuery('.options-true .form-element-html').trigger('click')
		}
	})
	jQuery('body').on('click', '.trigger-help', function() {
		jQuery('#help-content-content').html('.')
		jQuery('.fc_modal').fc_modal('hide')
		jQuery('#help_modal').fc_modal('show')
		window.helpPointer = window.helpQuery.length - 1
		let id = typeof jQuery(this).attr('data-post-id') !== 'undefined' ? jQuery(this).attr('data-post-id') : jQuery(this).attr('data-id')
		updateHelp(`http://formcraft-wp.com/wp-json/wp/v2/help/${id}/?_embed`, 'post', true)
	})
	jQuery('body').on('submit', '#help-search', function() {
		window.helpPointer = window.helpQuery.length - 1
		updateHelp(`http://formcraft-wp.com/wp-json/wp/v2/help?_embed&order=asc&per_page=100&page=1&search=${jQuery(this).find('input').val()}`, 'categories', true)
	})
	jQuery('body').on('click', '#help_modal .category', function() {
		jQuery('#help_modal .category.active').removeClass('active')
		jQuery(`.category[data-id="${jQuery(this).attr('data-id')}"]`).addClass('active')
		window.helpPointer = window.helpQuery.length - 1
		updateHelp(`http://formcraft-wp.com/wp-json/wp/v2/help?_embed&order=asc&per_page=100&page=1&group=${jQuery(this).attr('data-id')}`, 'posts', true)
	})
	jQuery('body').on('click', '#help-content-content .post, #help-content-content .trigger-post', function(event) {
		event.preventDefault()
		window.helpPointer = window.helpQuery.length - 1
		let id = typeof jQuery(this).attr('data-post-id') !== 'undefined' ? jQuery(this).attr('data-post-id') : jQuery(this).attr('data-id')
		updateHelp(`http://formcraft-wp.com/wp-json/wp/v2/help/${id}/?_embed`, 'post', true)
	})
	jQuery('body').on('click', '#help-back', function() {
		if (typeof window.helpQuery !== 'undefined' && !jQuery(this).parent().hasClass('disabled')) {
			window.helpPointer = window.helpPointer - 1
			window.helpQuery.splice(window.helpPointer + 1, window.helpQuery.length)
			updateHelp(window.helpQuery[window.helpPointer][0], window.helpQuery[window.helpPointer][1], false)
		}
	})
	jQuery('body').on('click', '#help-home', function() {
		window.helpPointer = window.helpQuery.length - 1
		updateHelp('http://formcraft-wp.com/wp-json/wp/v2/help?_embed&order=asc&per_page=100&page=1', 'categories', true)
	})
	jQuery('#help_modal').on('shown.bs.fc_modal', function () {
		if (jQuery('#help-content-content').html().trim() === '') {
			window.helpPointer = window.helpQuery.length - 1
			updateHelp('http://formcraft-wp.com/wp-json/wp/v2/help?_embed&order=asc&per_page=100&page=1', 'categories', true)
		}
	})
	jQuery('body').on('focus', '.wp-picker-input-wrap .color-picker', function() {
		jQuery(this).parent().find('.wp-color-picker').trigger('change')
	})
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
	jQuery('.fake-hover').hover(
		function () {
			jQuery(this).addClass('hover-true')
		},
		function () {
			setTimeout(function() {
				jQuery('.fake-hover').removeClass('hover-false')
			}, 200)
			jQuery(this).removeClass('hover-true')
			jQuery(this).addClass('hover-false')
		}
		)
	setTimeout(function() {
		jQuery('[data-toggle="tooltip"]').tooltip({ container: 'body', html:true })
	}, 2000)
	jQuery('body').on('change', '.parent-toggle', function() {
		let name = jQuery(this).attr('name')
		jQuery(`[name="${name}"]`).parent().removeClass('active')
		jQuery(`[name="${name}"]:checked`).parent().addClass('active')
	})
	jQuery('body').on('click', '.nav-tabs > span', function() {
		let selector = jQuery(this).parent().attr('data-content')
		jQuery(this).parent().find('> span').removeClass('active')
		jQuery(this).addClass('active')
		jQuery(selector).find(' > div').removeClass('active')
		jQuery(selector).find(' > div').eq(jQuery(this).index()).addClass('active')
	})
	jQuery('body').on('click', '.nav-tabs-slide > span', function() {
		let selector = jQuery(this).parent().attr('data-content')
		let left
		jQuery(this).parent().find('> span').removeClass('active')
		jQuery(this).addClass('active')
		if (window.isRTL === true || jQuery('body').hasClass('rtl')) {
			left = `${parseInt(jQuery(this).index(), 10) * 100}%`
		} else {
			left = `-${parseInt(jQuery(this).index(), 10) * 100}%`
		}
		jQuery(selector).css('-webkit-transform', `translate3d(${left}, 0px, 0px)`)
		jQuery(selector).css('transform', `translate3d(${left}, 0px, 0px)`)
		jQuery(selector).find(' > div').removeClass('active')
		jQuery(selector).find(' > div').eq(jQuery(this).index()).addClass('active')
		setTimeout(function() {
			let ta = document.querySelector('#success-message')
			let evt = document.createEvent('Event')
			evt.initEvent('autosize.update', true, false)
			ta.dispatchEvent(evt)
		}, 200)
		if (jQuery(selector).find(' > div').eq(jQuery(this).index()).hasClass('new-addons') && jQuery(selector).find(' > div').eq(jQuery(this).index()).html().trim() === '') {
			loadAddons()
		}
	})
})

function saveFormJQuery(builder, addons, addField, callback) {
	let meta_builder = {}
	meta_builder.fields = []
	meta_builder.config = builder.Config

	for (let page in builder.FormElements) {
		for (let element in builder.FormElements[page]) {
			if (typeof builder.FormElements[page][element].elementDefaults === 'undefined') {
				continue
			}
			let isPayment = false
			for (let x in addField.payments) {
				isPayment = addField.payments[x].name === builder.FormElements[page][element].type ? true : isPayment
			}
			meta_builder.fields.push({
				identifier: builder.FormElements[page][element].identifier,
				type: builder.FormElements[page][element].type,
				elementDefaults: builder.FormElements[page][element].elementDefaults,
				page: parseInt(page, 10) + 1,
				isPayment: isPayment
			})
			meta_builder.emailRecipients = typeof builder.Config.notifications.recipients === 'undefined' ? '' : builder.Config.notifications.recipients
		}
	}
	window.lastSaveFieldsNos = meta_builder.fields.length
	meta_builder.pageCount = builder.FormElements.length
	if (jQuery('.fc-form .customText-cover').length !== 0) {
		jQuery('.fc-form .customText-cover img').each(function() {
			let height = jQuery(this).attr('height')
			jQuery(this).css('height', `${height}px`)
			let width = jQuery(this).attr('width')
			jQuery(this).css('width', `${width}px`)
		})
	}
	if (jQuery('.fc-form .textarea-cover').length !== 0) {
		jQuery('.fc-form .textarea-cover textarea').each(function() {
			jQuery(this).css('min-height', `${jQuery(this).outerHeight()}px`)
		})
	}
	if (jQuery('.fc-form .datepicker-cover').length !== 0) {
		jQuery('.fc-form .datepicker-cover input').each(function() {
			jQuery(this).removeAttr('id')
		})
	}
	meta_builder = encodeURIComponent(deflate(angular.toJson(meta_builder)))
	builder = encodeURIComponent(deflate(angular.toJson(builder)))
	addons = encodeURIComponent(angular.toJson(addons))
	let html = jQuery('#form-cover-html').html().trim()

	if (jQuery('.fc-form .textarea-cover').length !== 0) {
		jQuery('.fc-form .textarea-cover textarea').each(function() {
			jQuery(this).css('min-height', '0')
		})
	}

	html = html.replace(/ng-repeat="[^"]*"/g, '')
	html = html.replace(/compilesafe="[^"]*"/g, '')
	html = html.replace(/<img>/g, '')
	html = html.replace(/ng-class="[^"]*"/g, '')
	html = html.replace(/ng-click="[^"]*"/g, '')
	html = html.replace(/ng-class-odd="[^"]*"/g, '')
	html = html.replace(/ng-init="[^"]*"/g, '')
	html = html.replace(/ui-sortable="[^"]*"/g, '')
	html = html.replace(/watch-show-options="[^"]*"/g, '')
	html = html.replace(/ng-class-even="[^"]*"/g, '')
	html = html.replace(/ng-model="[^"]*"/g, '')
	html = html.replace(/ondrop="[^"]*"/g, '')
	html = html.replace(/dnd-list="[^"]*"/g, '')
	html = html.replace(/compile="[^"]*"/g, '')
	html = html.replace(/<!--RFH-->[\s\S]*?<!--RTH-->/g, '')
	html = html.replace(/<!-- end ngRepeat: page in Builder.FormElements -->/g, '')
	html = html.replace(/<!-- end ngRepeat: element in page -->/g, '')
	html = html.replace(/<!-- end ngRepeat: element in page track by element.identifier -->/g, '')
	html = html.replace(/<!-- end ngRepeat: opt in element.elementDefaults.optionsListShow -->/g, '')
	html = html.replace(/<!-- ngRepeat: page in Builder.FormElements -->/g, '')
	html = html.replace(/<!-- ngRepeat: element in page -->/g, '')
	html = html.replace(/<!-- ngRepeat: element in page track by element.identifier -->/g, '')
	html = html.replace(/<!-- ngRepeat: opt in element.elementDefaults.optionsListShow -->/g, '')

	html = minify(html, {
		removeComments: false,
		removeEmptyAttributes: true
	})

	html = html.replace(/ng-binding/g, '')
	html = html.replace(/ng-pristine/g, '')
	html = html.replace(/ng-isolate-scope/g, '')
	html = html.replace(/ng-scope/g, '')
	html = html.replace(/ng-dirty/g, '')
	html = html.replace(/ui-sortable/g, '')
	html = html.replace(/ui-sortable-handle/g, '')
	html = html.replace(/ng-valid-parse/g, '')
	html = html.replace(/class=""/g, '')
	html = html.replace(/ng-untouched/g, '')
	html = html.replace(/ng-valid/g, '')
	if (typeof FC.gzinflate !== 'undefined' && FC.gzinflate === 1) {
		html = encodeURIComponent(html)
	} else {
		html = encodeURIComponent(deflate(html))
	}

	let data = `builder=${builder}&addons=${addons}&id=${jQuery('#form_id').val()}&html=${html}&meta_builder=${meta_builder}`

	jQuery('#form_save_button').attr('disabled', 'disabled')
	jQuery('#form_save_button').addClass('saving')
	jQuery.ajax({
		url: FC.ajaxurl,
		type: 'POST',
		context: jQuery(this),
		data: `action=formcraft3_form_save&formcraft3_wpnonce=${jQuery('#formcraft3_wpnonce').val()}&${data}`,
		dataType: 'json'
	})
		.done(function(response) {
			if (response.failed) {
				globalNotification('error', response.failed)
			} else if (response.success) {
				globalNotification('success', `<i class='formcraft-icon'>check</i> ${response.success}`)
				callback(true)
			} else {
				globalNotification('error', translate['Failed Saving.'] + translate['Unknown Error.'])
			}
		})
		.fail(function(response, status, code) {
			if (code === 'Forbidden') {
				globalNotification('error', translate['Failed Saving. Please try disabing your firewall, or security plugin.'])
			} else {
				globalNotification('error', translate['Failed Saving'])
			}
		})
		.always(function() {
			jQuery('#form_save_button').removeClass('saving')
			jQuery('#form_save_button').removeAttr('disabled')
		})
}

window.FormCraftApp = angular.module('FormCraft', ['textAngular', 'ui.sortable'])

FormCraftApp.directive('compile', function($compile) {
	return function(scope, element, attrs) {
		scope.$watch(function(scope) {
			return scope.$eval(attrs.compile)
		},
		function(value) {
			element.html(value)
			$compile(element.contents())(scope)
		})
	}
})

FormCraftApp.directive('compilesafe', function($compile) {
	return function(scope, element, attrs) {
		scope.$watch(function(scope) {
			return scope.$eval(attrs.compilesafe)
		},
		function(value) {
			element.html(xss(value))
			$compile(element.contents())(scope)
		})
	}
})

FormCraftApp.directive('updateLabel', function() {
	return {
		require: 'ngModel',
		link: function($scope, $element, $attrs) {
			$scope.$watch($attrs.ngModel, function() {
				if ($element[0].checked) {
					$element.parent().addClass('active')
				} else {
					$element.parent().removeClass('active')
				}
			})
		}

	}
})

FormCraftApp.directive('watchShowOptions', function() {
	return function($scope, $element, $attrs) {
		$attrs.$observe('watchShowOptions', function innerObserveFunction() {

			$scope.element.showOptionsAnimate = $scope.element.showOptionsAnimate || false
			if (typeof $scope.element.showOptions === 'undefined') {
				$scope.isShowPristine = false
			}
			if ($scope.element.showOptions === false && $scope.element.showOptionsAnimate !== false) {
				$scope.element.showOptionsAnimate = false
			} else {
				$scope.element.showOptionsAnimate = true
			}

			if ($scope.element.showOptions === true) {
				$scope.element.showOptionsAnimate = true
			}

			$scope.isShowPristine = typeof $scope.isShowPristine === 'undefined'
			if ($attrs.watchShowOptions === 'true' && $scope.isShowPristine === false) {
				for (let x in $scope.$parent.$parent.Builder.FormElements) {
					for (let y in $scope.$parent.$parent.Builder.FormElements[x]) {
						if (typeof $scope.$parent.$parent.Builder.FormElements[x][y].showOptions === 'undefined') {
							continue
						}
					}
				}
			}

		})
	}
})

FormCraftApp.directive('selectFields', function() {
	return function($scope, $element, $attrs) {
		$scope.$watch('listOfFields', function() {
			setTimeout(function() {
				let instance = $element[0].selectize
				if (typeof instance !== 'undefined') {
					instance.destroy()
				}
				$element.selectize({
					valueField: 'identifier',
					labelField: 'label',
					sortField: 'text',
					openOnFocus: true,
					preload: true,
					options: $scope.listOfFields,
					onChange: () => {
						let placeholder = $attrs.placeholder
						if (typeof placeholder !== 'undefined') {
							$element.parent().find('.selectize-input > input').attr('placeholder', placeholder)
						}
					}
				})
				let placeholder = $attrs.placeholder
				if (typeof placeholder !== 'undefined') {
					$element.parent().find('.selectize-input > input').attr('placeholder', placeholder)
				}
			}, 500)
		})
	}
})

FormCraftApp.directive('ngSlideToggle', function() {
	return function($scope, $element, $attrs) {
		$scope.$watch($attrs.ngSlideToggle, function(e) {
			if (typeof e === 'undefined' || e === false) {
				$element.slideUp(250)
			} else {
				$element.slideDown(250)
			}
		})
	}
})

FormCraftApp.directive('checkboxList', function() {
	return {
		require: 'ngModel',
		link: function($scope, $element, $attrs, ngModelCtrl) {
			$scope.$watch($attrs.ngModel, function() {
				if (typeof $scope.element.elementDefaults.optionsListShow === 'undefined') {
					$scope.isPristine = false
				}
				if (typeof $scope.isPristine === 'undefined' || $scope.isPristine === true) {
					$scope.isPristine = false
					return false
				}
				let temp
				if (typeof ngModelCtrl.$modelValue === 'number') {
					temp = $scope.element.elementDefaults.options_list.split('\n')
				} else {
					temp = ngModelCtrl.$modelValue.split('\n')
				}
				$scope.element.elementDefaults.optionsListShow = temp.map((x) => {
					return x.indexOf('==') === -1 ? { value: x, show: x } : { value: x.split('==')[0], show: x.split('==')[1] }
				})
			})
		}
	}
})

FormCraftApp.directive('matrixRows', function() {
	return {
		require: 'ngModel',
		link: function($scope, $element, $attrs, ngModelCtrl) {
			$scope.$watch($attrs.ngModel, function() {
				if (typeof $scope.element.elementDefaults.matrixRowsOutput === 'undefined') {
					$scope.isPristineRows = false
				}
				if (typeof $scope.isPristineRows === 'undefined' || $scope.isPristineRows === true) {
					$scope.isPristineRows = false
					return false
				}
				let temp
				if (typeof ngModelCtrl.$modelValue === 'number') {
					temp = $scope.element.elementDefaults.matrix_rows.split('\n')
				} else {
					temp = ngModelCtrl.$modelValue.split('\n')
				}
				$scope.element.elementDefaults.matrixRowsOutput = temp.map((x) => {
					return { value: x }
				})
			})
		}

	}
})

FormCraftApp.directive('matrixCols', function() {
	return {
		require: 'ngModel',
		link: function($scope, $element, $attrs, ngModelCtrl) {
			$scope.$watch($attrs.ngModel, function() {
				let temp

				if (typeof $scope.element.elementDefaults.matrixColumnsOutput === 'undefined') {
					$scope.isPristineCols = false
				}
				if (typeof $scope.isPristineCols === 'undefined' || $scope.isPristineCols === true) {
					$scope.isPristineCols = false
					return false
				}
				if (typeof $scope.element.elementDefaults.matrix_cols === 'undefined') {
					$scope.element.elementDefaults.matrix_cols = $scope.element.elementDefaults.options_list
					delete $scope.element.elementDefaults.options_list
					temp = $scope.element.elementDefaults.matrix_cols.split('\n')
				} else if (typeof ngModelCtrl.$modelValue === 'number') {
					temp = $scope.element.elementDefaults.matrix_cols.split('\n')
				} else {
					temp = ngModelCtrl.$modelValue.split('\n')
				}
				$scope.element.elementDefaults.matrixColumnsOutput = temp.map((x) => {
					return { value: x }
				})
			})
		}

	}
})

FormCraftApp.directive('imageList', function() {
	return {
		require: 'ngModel',
		link: function($scope, $element, $attrs, ngModelCtrl) {
			$scope.$watch($attrs.ngModel, function() {
				if ($scope.element.elementDefaults.allow_images === true) {
					let temp = ngModelCtrl.$modelValue.split('\n')
					$scope.element.elementDefaults.imagesListShow = temp.map((x) => {
						return { url: x }
					})
				} else {
					$scope.element.elementDefaults.imagesListShow = []
				}
			})
		}
	}
})

FormCraftApp.directive('updateHours', function() {
	return {
		link: function($scope, $element, $attrs) {
			$attrs.$observe('hrsMin', function innerObserveFunction() {
				let min = parseInt($attrs.hrsMin, 10)
				min = Math.max(min, 0)
				let max = parseInt($attrs.hrsMax, 10)
				max = Math.min(max, 24)
				let step = parseInt($attrs.hrsStep, 10)
				step = Math.max(1, step)

				min = isNaN(min) ? 0 : min
				max = isNaN(max) ? 24 : max
				step = isNaN(step) ? 1 : step
				let stop = false
				let i = min
				let a = 0
				$scope.element.elementDefaults.hoursRange = []
				while (stop === false) {
					a += 1
					let padded = (`0${i}`).substr(-2, 2)
					$scope.element.elementDefaults.hoursRange.push(padded)
					i = i + step
					if (i > max) {
						stop = true
					}
					if (a === 24) {
						stop = true
					}
				}
			})
			$attrs.$observe('hrsMax', function innerObserveFunction() {
				let min = parseInt($attrs.hrsMin, 10)
				min = Math.max(min, 0)
				let max = parseInt($attrs.hrsMax, 10)
				max = Math.min(max, 24)
				let step = parseInt($attrs.hrsStep, 10)
				step = Math.max(1, step)

				min = isNaN(min) ? 0 : min
				max = isNaN(max) ? 24 : max
				step = isNaN(step) ? 1 : step
				let stop = false
				let i = min
				let a = 0
				$scope.element.elementDefaults.hoursRange = []
				while (stop === false) {
					a += 1
					let padded = (`0${i}`).substr(-2, 2)
					$scope.element.elementDefaults.hoursRange.push(padded)
					i = i + step
					if (i > max) {
						stop = true
					}
					if (a === 24) {
						stop = true
					}
				}
			})
			$attrs.$observe('hrsStep', function innerObserveFunction() {
				let min = parseInt($attrs.hrsMin, 10)
				min = Math.max(min, 0)
				let max = parseInt($attrs.hrsMax, 10)
				max = Math.min(max, 24)
				let step = parseInt($attrs.hrsStep, 10)
				step = Math.max(1, step)

				min = isNaN(min) ? 0 : min
				max = isNaN(max) ? 24 : max
				step = isNaN(step) ? 1 : step
				let stop = false
				let i = min
				let a = 0
				$scope.element.elementDefaults.hoursRange = []
				while (stop === false) {
					a += 1
					let padded = (`0${i}`).substr(-2, 2)
					$scope.element.elementDefaults.hoursRange.push(padded)
					i = i + step
					if (i > max) {
						stop = true
					}
					if (a === 24) {
						stop = true
					}
				}
			})
		}

	}
})

FormCraftApp.directive('updateMinutes', function() {
	return {
		link: function($scope, $element, $attrs) {
			$attrs.$observe('minuteStep', function innerObserveFunction() {
				let step = parseInt($attrs.minuteStep, 10)
				step = Math.max(1, step)
				step = Math.min(60, step)
				step = isNaN(step) ? 30 : step

				let stop = false
				let i = 0
				let a = 0
				$scope.element.elementDefaults.minute_range = []
				while (stop === false) {
					a += 1
					let padded = (`0${i}`).substr(-2, 2)
					$scope.element.elementDefaults.minute_range.push(padded)
					i = i + step
					if (i >= 60) {
						stop = true
					}
					if (a === 60) {
						stop = true
					}
				}
			})
		}

	}
})

FormCraftApp.directive('subLabel', function() {
	return {
		require: 'ngModel',
		link: function($scope, $element, $attrs, ngModelCtrl) {
			$scope.$watch($attrs.ngModel, function() {
				if (ngModelCtrl.$modelValue === '') {
					$scope.element.elementDefaults.has_sub_label = false
				} else {
					$scope.element.elementDefaults.has_sub_label = true
				}
			})
		}

	}
})

FormCraftApp.directive('fcPlaceholder', function() {
	return {
		require: 'ngModel',
		link: function($scope, $element, $attrs) {
			$scope.$watch($attrs.ngModel, function() {
				if ($scope.$parent.Builder.label_style === 'placeholder') {
					$scope.element.elementDefaults.main_label_placeholder = $scope.element.elementDefaults.main_label
				} else if ($scope.element.elementDefaults.maskPlaceholder === '') {
					$scope.element.elementDefaults.main_label_placeholder = ''
				}
			})
		}
	}
})

FormCraftApp.directive('fcPlaceholderUpdate', function() {
	return {
		require: 'ngModel',
		link: function($scope, $element, $attrs, ngModelCtrl) {
			$scope.$watch($attrs.ngModel, function() {
				if (typeof ngModelCtrl.$viewValue !== 'undefined') {
					if (ngModelCtrl.$viewValue === 'placeholder') {
						for (let x in $scope.Builder.FormElements) {
							for (let y in $scope.Builder.FormElements[x]) {
								if (typeof $scope.Builder.FormElements[x][y] === 'object') {
									let temp = $scope.Builder.FormElements[x][y].elementDefaults.main_label
									$scope.Builder.FormElements[x][y].elementDefaults.main_label_placeholder = temp
								}
							}
						}
					} else {
						for (let x in $scope.Builder.FormElements) {
							for (let y in $scope.Builder.FormElements[x]) {
								if (typeof $scope.Builder.FormElements[x][y] === 'object') {
									if (typeof $scope.Builder.FormElements[x][y].elementDefaults.maskPlaceholder !== 'undefined' && $scope.Builder.FormElements[x][y].elementDefaults.maskPlaceholder.trim() !== '') {
										$scope.Builder.FormElements[x][y].elementDefaults.main_label_placeholder = $scope.Builder.FormElements[x][y].elementDefaults.maskPlaceholder
									} else {
										$scope.Builder.FormElements[x][y].elementDefaults.main_label_placeholder = ''
									}
								}
							}
						}
					}
				}
			})
		}
	}
})

FormCraftApp.directive('autosize', function() {
	return {
		link: function($scope, $element) {
			autosize($element)
		}
	}
})

FormCraftApp.directive('angularColor', function() {
	return {
		require: 'ngModel',
		link: function($scope, $element, $attrs, ngModelCtrl) {
			$element.wpColorPicker({
				change: function(event, ui) {
					if (ui.color.toString() !== jQuery(this).val()) {
						jQuery(this).val(ui.color.toString()).trigger('change')
					}
				},
				clear: function() {
					ngModelCtrl.$setViewValue('')
				}
			})
		}
	}
})

FormCraftApp.directive('tooltip', function() {
	return {
		link: function($scope, $element, $attrs, ngModelCtrl) {
			$element.tooltip({ html:true })
			$attrs.$observe('title', function innerObserveFunction() {
				$element.tooltip('destroy')
				if ($attrs.title.trim() !== '' && $attrs.title.indexOf('{{') === -1) {
					$element.tooltip({ html:true })
				} else {
					$element.attr('data-original-title', '')
				}
			})
		}

	}
})

FormCraftApp.directive('inputMask', function() {
	return {
		link: function($scope, $element, $attrs, ngModelCtrl) {
			$attrs.$observe('inputMask', function innerObserveFunction() {
				if ($attrs.inputMask.trim() === '') {
					$element.unmask()
				} else {
					$element.mask($attrs.inputMask.replace(/[^a-zA-Z0-9():\-\/]+/g, ''))
				}
			})
		}

	}
})

FormCraftApp.directive('maskPlaceholder', function() {
	return {
		link: function($scope, $element, $attrs, ngModelCtrl) {
			$attrs.$observe('maskPlaceholder', function innerObserveFunction() {
				if ($scope.$parent.Builder.label_style !== 'placeholder') {
					$scope.element.elementDefaults.main_label_placeholder = $scope.element.elementDefaults.maskPlaceholder
					setTimeout(function() {
						$element.trigger('input')
					}, 200)
				}
			})
		}

	}
})

FormCraftApp.directive('slider', function() {
	return {
		restrict: 'A',
		link: function($scope, $element, $attrs, ngModelCtrl) {
			let options = {}
			options.range = 'min'
			options.create = function() {
				if (options.range === true) {
					jQuery(this).find('.ui-slider-range').eq(0).append('<span class="ui-slider-handle-nos">0</span>')
				} else {
					jQuery(this).find('span.ui-slider-handle').eq(0).append('<span class="ui-slider-handle-nos">0</span>')
				}
			}
			options.change = options.slide = function(event, ui) {
				let value
				jQuery(this).find('.ui-slider-handle-nos').css('margin-left', '-' + (jQuery(this).find('.ui-slider-handle-nos').outerWidth() / 2 - 9) + 'px')
				if (ui.values) {
					ui.values[0] = typeof jQuery(this).attr('data-prefix') !== 'undefined' ? jQuery(this).attr('data-prefix') + ui.values[0] : ui.values[0]
					ui.values[0] = typeof jQuery(this).attr('data-suffix') !== 'undefined' ? ui.values[0] + jQuery(this).attr('data-suffix') : ui.values[0]
					ui.values[1] = typeof jQuery(this).attr('data-prefix') !== 'undefined' ? jQuery(this).attr('data-prefix') + ui.values[1] : ui.values[1]
					ui.values[1] = typeof jQuery(this).attr('data-suffix') !== 'undefined' ? ui.values[1] + jQuery(this).attr('data-suffix') : ui.values[1]
					value = `${ui.values[0]} - ${ui.values[1]}`
				} else {
					value = ui.value
					value = typeof jQuery(this).attr('data-prefix') !== 'undefined' ? jQuery(this).attr('data-prefix') + value : value
					value = typeof jQuery(this).attr('data-suffix') !== 'undefined' ? value + jQuery(this).attr('data-suffix') : value
				}
				jQuery(this).find('.ui-slider-handle-nos').text(value)
				jQuery(this).parent().parent().find('input').val(value).trigger('change')
			}

			$element.slider(options)
			$attrs.$observe('rangeMin', function innerObserveFunction() {
				$element.slider('option', 'min', parseFloat($attrs.rangeMin))
			})
			$attrs.$observe('rangeStep', function innerObserveFunction() {
				$element.slider('option', 'step', parseFloat($attrs.rangeStep))
			})
			$attrs.$observe('rangeMax', function innerObserveFunction() {
				$element.slider('option', 'max', parseFloat($attrs.rangeMax))
			})
			$attrs.$observe('rangeTrue', function innerObserveFunction() {
				let range = $attrs.rangeTrue === 'true' ? true : 'min'
				$element.slider('option', 'range', range)
			})
		}

	}
})

FormCraftApp.directive('datepicker', function() {
	return {
		restrict: 'A',
		require: 'ngModel',
		link: function($scope, $element, $attrs, ngModelCtrl) {
			let options = {}
			options.nextText = '❯'
			options.prevText = '❮'
			options.hideIfNoPrevNext = true
			options.changeYear = true
			options.changeMonth = true
			options.showAnim = false
			options.yearRange = 'c-20:c+20'
			if (typeof $attrs.dateFormat !== 'undefined' && typeof $attrs.defaultDate !== 'undefined' && $attrs.defaultDate !== '' && $attrs.dateFormat !== '') {
				if (parseInt($attrs.defaultDate, 10) !== $attrs.defaultDate) {
					options.dateFormat = $attrs.dateFormat
					options.defaultDate = $attrs.defaultDate
				}
			}
			options.beforeShow = function() {
				jQuery('#ui-datepicker-div').removeClass('ui-datepicker').addClass('formcraft-datepicker')
			}
			options.onSelect = function(input) {
				jQuery(this).trigger('change').trigger('input')
				$scope.$apply(function() {
					ngModelCtrl.$setViewValue(input)
				})
			}
			$element.datepicker(options)
			jQuery('#ui-datepicker-div').removeClass('ui-datepicker').addClass('formcraft-datepicker')
			$attrs.$observe('defaultDate', function innerObserveFunction() {
				if ($element.val() !== '' && typeof $element.attr('hasLoaded') === 'undefined') {
					let temp = $attrs.defaultDate
					setTimeout(function() {
						$element.val(temp).trigger('change')
						$element.attr('hasLoaded', 'true')
					}, 500)
				}
			})
			$scope.$watch($attrs.ngModel, function() {
				let date = jQuery.datepicker.formatDate('yy/mm/dd', $element.datepicker('getDate'))
				if ($attrs.ngModel === 'element.elementDefaults.minDate') {
					$scope.element.elementDefaults.minDateAlt = date
				}
				if ($attrs.ngModel === 'element.elementDefaults.maxDate') {
					$scope.element.elementDefaults.maxDateAlt = date
				}
			})
			$attrs.$observe('dateFormat', function innerObserveFunction() {
				if ($attrs.defaultDate === '' || $attrs.defaultDate === null) {
					$element.datepicker('option', 'dateFormat', $attrs.dateFormat)
					$element.trigger('change')
				}
			})
			$attrs.$observe('dateLang', function innerObserveFunction() {
				if ($attrs.dateLang !== 'en') {
					$element.datepicker('option', 'dateFormat', $attrs.dateFormat)
					$element.datepicker('option', 'altFormat', 'yy-mm-dd')
					jQuery.get(`${FC.datepickerLang}datepicker-${$attrs.dateLang}.js`)
				}
			})
			$attrs.$observe('dateMin', function innerObserveFunction() {
				if ($attrs.dateMin !== '' && parseInt($attrs.dateMin, 10) === $attrs.dateMin) {
					let someDate = new Date()
					someDate.setDate(someDate.getDate() + parseInt($attrs.dateMin, 10))
					$element.datepicker('option', 'minDate', $attrs.dateMin)
				} else {
					$element.datepicker('option', 'dateFormat', $attrs.dateFormat)
					$element.datepicker('option', 'altFormat', 'yy-mm-dd')
					$element.datepicker('option', 'minDate', $attrs.dateMin)
				}
			})
			$attrs.$observe('dateDays', function innerObserveFunction() {
				let temp = jQuery.parseJSON($attrs.dateDays)
				let tempNew = []
				for (let x in temp) {
					if (temp[x] === true) {
						tempNew.push(x)
					}
				}
				$element.datepicker('option', 'beforeShowDay', function(date) {
					if (tempNew.indexOf(date.getDay().toString()) !== -1) {
						return [true, '']
					}
					return [false, '']
				})
			})
			$attrs.$observe('dateMax', function innerObserveFunction() {
				if ($attrs.dateMax !== '' && parseInt($attrs.dateMax, 10) === $attrs.dateMax) {
					let someDate = new Date()
					someDate.setDate(someDate.getDate() + parseInt($attrs.dateMax, 10))
					$element.datepicker('option', 'maxDate', $attrs.dateMax)
				} else {
					$element.datepicker('option', 'dateFormat', $attrs.dateFormat)
					$element.datepicker('option', 'altFormat', 'yy-mm-dd')
					$element.datepicker('option', 'maxDate', $attrs.dateMax)
				}
			})
		}
	}
})

FormCraftApp.controller('FormController', function($scope, $locale, $http, $timeout) {

	$scope.addField = {}
	$scope.addField.payments = []
	$scope.addField.defaults = []
	$scope.addField.others = []

	function createOptions() {
		let options = {
			connectWith: '.form-page-content',
			helper: '',
			start: (event, ui) => {
				ui.placeholder.html(ui.item[0].innerHTML)
			}
		}
		return options
	}

	$scope.addAutoresponderFile = function() {
		$scope.Builder.Config.autoresponderFiles = $scope.Builder.Config.autoresponderFiles || []
		$scope.Builder.Config.autoresponderFiles.push({ url: '' })
	}
	$scope.removeAutoresponderFile = function($index) {
		$scope.Builder.Config.autoresponderFiles.splice($index, 1)
	}

	$scope.testEmail = function() {
		$scope.TestEmailResult = '<div class="formcraft-loader"></div>'
		$scope.TestEmailResultMore = ''
		let config = encodeURIComponent(deflate(angular.toJson($scope.Builder.Config.notifications)))

		$http({
			url: FC.ajaxurl,
			method: 'POST',
			params: {
				action: 'formcraft3_test_email',
				formcraft3_wpnonce: jQuery('#formcraft3_wpnonce').val()
			},
			data: {
				emails: $scope.Builder.TestEmails,
				config: config
			}
		})
			.success((response) => {
				if (response.failed) {
					$scope.TestEmailResult = `<div class="IsRed">${response.failed}</div>`
					$scope.TestEmailResultMore = `<br/><strong>${translate['Debug Info']}:</strong><br/>${response.debug}`
				} else {
					$scope.TestEmailResult = `<div class="IsGreen">${response.success}</div>`
				}
			})
	}

	$scope.FormElements = function() {
		$http({
			url: FC.ajaxurl,
			method: 'GET',
			params: {
				action: 'formcraft3_load_form_data',
				type: 'builder',
				id: jQuery('#form_id').val(),
				formcraft3_wpnonce: jQuery('#formcraft3_wpnonce').val()
			}
		}).success((response) => {
			/* Fetch and Fix Addons */
			response.addons = response.addons === false ? null : response.addons
			if (response.addons === null || response.addons.trim() === '') {
				$scope.Addons = {}
			} else {
				if (response.addons === '[]') {
					response.addons = '{}'
				}
				$scope.Addons = jQuery.evalJSON(response.addons)
			}

			/* Fetch and Fix Builder */
			if (response.builder.trim() === '') {
				$scope.Builder = {}
				$scope.Builder.Config = {}
				$scope.Builder.Config.Logic = []
				$scope.Builder.Config.messages = {}
				$scope.Builder.Config.autoresponder = {}
				$scope.Builder.Config.notifications = {}
				$scope.Builder.FormElements = []
				$scope.Builder.FormElements[0] = []
				$scope.Builder.Config.page_names = []
				$scope.Builder.Config.page_names[0] = 'Step 1'
				$scope.Builder.Options = {}
				$scope.Builder.form_background = 'white'
				$scope.Builder.form_background_type = 'white'
				$scope.Builder.Config.color_scheme_button = '#48e'
				$scope.Builder.Config.color_scheme_step = '#48e'
				$scope.Builder.Config.color_scheme_font = '#fff'
			} else if (response.builder.indexOf('[BREAK]') !== -1) {
				$scope.Builder = {}
				$scope.Builder.Config = {}
				$scope.Builder.Config.Logic = []
				$scope.Builder.Config.messages = {}
				$scope.Builder.Config.autoresponder = {}
				$scope.Builder.Config.notifications = {}
				$scope.Builder.FormElements = []
				$scope.Builder.FormElements[0] = []
				$scope.Builder.Config.page_names = []
				$scope.Builder.Config.page_names[0] = 'Step 1'
				$scope.Builder.Options = {}
				$scope.Builder.form_background = 'white'
				$scope.Builder.form_background_type = 'white'
				$scope.Builder.Config.color_scheme_button = '#48e'
				$scope.Builder.Config.color_scheme_step = '#48e'
				$scope.Builder.Config.color_scheme_font = '#fff'
				$scope.Addons = {}
				let imported = response.builder.split('[BREAK]')
				let build = imported[0]
				let options = imported[1]
				options = jQuery.evalJSON(inflate(decodeURIComponent(options.trim())))
				let con = imported[2].replace(/\\(.?)/g, function(s, n1) {
					switch (n1) {
					case '\\':
						return '\\'
					case '0':
						return '\u0000'
					case '':
						return ''
					default:
						return n1
					}
				})
				con = jQuery.evalJSON(con)
				let recipients = imported[3].replace(/\\(.?)/g, function(s, n1) {
					switch (n1) {
					case '\\':
						return '\\'
					case '0':
						return '\u0000'
					case '':
						return ''
					default:
						return n1
					}
				}).replace(/"/g, '')
				$scope.Builder.Config.notifications.recipients = recipients
				$scope.Builder.Config.Messages = $scope.Builder.Config.Messages || {}
				build = jQuery.evalJSON(inflate(decodeURIComponent(build.trim())))

				if (typeof con[0].user_save_form !== 'undefined' && con[0].user_save_form === 'save_form') {
					$scope.Builder.Config.save_progress = true
				}
				if (typeof con[0].frame !== 'undefined' && con[0].frame === 'noframe') {
					$scope.Builder.form_frame = 'hidden'
				}
				if (typeof con[0].bg_image !== 'undefined' && con[0].bg_image !== '') {
					$scope.Builder.form_background_custom_image = con[0].bg_image
				}
				if (typeof con[0].number_spin !== 'undefined' && con[0].number_spin === 'spin') {
					$scope.Builder.Config.spin_effect = true
				}
				if (typeof con[0].allow_multi !== 'undefined' && con[0].allow_multi === 'no_allow_multi') {
					$scope.Builder.Config.disable_multiple = true
				}
				if (typeof con[0].placeholder !== 'undefined' && con[0].placeholder === 'placeholder') {
					$scope.Builder.label_style = 'placeholder'
				}
				if (typeof con[0].multi_error !== 'undefined') {
					$scope.Builder.Config.disable_multiple_message = con[0].multi_error
				}

				if (typeof con[0].error_gen !== 'undefined') {
					$scope.Builder.Config.Messages.failed = con[0].error_gen
				}
				if (typeof con[0].success_msg !== 'undefined') {
					$scope.Builder.Config.Messages.success = con[0].success_msg
				}
				if (typeof con[0].error_email !== 'undefined') {
					$scope.Builder.Config.Messages.allow_email = con[0].error_email
				}
				if (typeof con[0].error_only_integers !== 'undefined') {
					$scope.Builder.Config.Messages.allow_numbers = con[0].error_only_integers
				}
				if (typeof con[0].error_only_alpha !== 'undefined') {
					$scope.Builder.Config.Messages.allow_alphabets = con[0].error_only_alpha
				}
				if (typeof con[0].error_only_alnum !== 'undefined') {
					$scope.Builder.Config.Messages.allow_alphanumeric = con[0].error_only_alnum
				}
				if (typeof con[0].error_required !== 'undefined') {
					$scope.Builder.Config.Messages.is_required = con[0].error_required
				}
				if (typeof con[0].error_min !== 'undefined') {
					con[0].error_min = con[0].error_min.replace('[min_chars]', '[x]')
					$scope.Builder.Config.Messages.min_char = con[0].error_min
				}
				if (typeof con[0].error_max !== 'undefined') {
					con[0].error_max = con[0].error_max.replace('[max_chars]', '[x]')
					$scope.Builder.Config.Messages.max_char = con[0].error_max
				}


				if (typeof con[0].autoreply_s !== 'undefined') {
					$scope.Builder.Config.autoresponder.email_subject = con[0].autoreply_s
				}
				if (typeof con[0].email_sub !== 'undefined') {
					$scope.Builder.Config.notifications.email_subject = con[0].email_sub
				}
				if (typeof con[0].mail_type !== 'undefined' && con[0].mail_type === 'smtp') {
					$scope.Builder.Config.notifications._method = 'smtp'
				}

				if (typeof con[0].from_name !== 'undefined') {
					$scope.Builder.Config.notifications.general_sender_name = con[0].from_name
				}
				if (typeof con[0].smtp_username !== 'undefined') {
					$scope.Builder.Config.notifications.smtp_sender_username = con[0].smtp_username
				}
				if (typeof con[0].smtp_pass !== 'undefined') {
					$scope.Builder.Config.notifications.smtp_sender_password = con[0].smtp_pass
				}
				if (typeof con[0].smtp_host !== 'undefined') {
					$scope.Builder.Config.notifications.smtp_sender_host = con[0].smtp_host
				}
				if (typeof con[0].smtp_port !== 'undefined') {
					$scope.Builder.Config.notifications.smtp_sender_port = con[0].smtp_port
				}
				if (typeof con[0].email_body !== 'undefined') {
					con[0].email_body = con[0].email_body.replace(/\n/g, '<br>')
					$scope.Builder.Config.notifications.email_body = con[0].email_body
				}
				if (typeof con[0].if_ssl !== 'undefined' && con[0].if_ssl === 'ssl') {
					$scope.Builder.Config.notifications.smtp_sender_security = 'ssl'
				}
				if (typeof con[0].if_ssl !== 'undefined' && con[0].if_ssl === 'tls') {
					$scope.Builder.Config.notifications.smtp_sender_security = 'tls'
				}

				if (typeof con[0].autoreply_name !== 'undefined') {
					$scope.Builder.Config.autoresponder.email_sender_name = con[0].autoreply_name
				}
				if (typeof con[0].autoreply_email !== 'undefined') {
					$scope.Builder.Config.autoresponder.email_sender_email = con[0].autoreply_email
				}
				if (typeof con[0].autoreply_s !== 'undefined') {
					$scope.Builder.Config.autoresponder.email_subject = con[0].autoreply_s
				}
				if (typeof con[0].autoreply_s !== 'undefined') {
					con[0].autoreply = con[0].autoreply.replace(/\n/g, '<br>')
					$scope.Builder.Config.autoresponder.email_body = con[0].autoreply
				}

				if (typeof con[0].from_email !== 'undefined') {
					$scope.Builder.Config.notifications.general_sender_email = con[0].from_email
				}
				if (typeof con[0].placeholder !== 'undefined' && con[0].placeholder === 'placeholder') {
					$scope.Builder.label_style = 'placeholder'
				}
				if (typeof con[0].block_label !== 'undefined' && con[0].block_label === 'block_label') {
					$scope.Builder.label_style = 'block'
				}
				if (typeof con[0].allow_multi !== 'undefined' && con[0].allow_multi === 'allow_multi') {
					$scope.Builder.Config.disable_multiple = true
				}
				if (typeof con[0].multi_error !== 'undefined') {
					$scope.Builder.Config.disable_multiple_message = con[0].multi_error
				}
				if (typeof con[0].fw !== 'undefined') {
					$scope.Builder.form_width = con[0].fw
				}
				if (typeof con[0].bg_image !== 'undefined') {
					$scope.Builder.form_background_custom_image = con[0].bg_image.replace('url(', '').replace(')', '')
				}

				if (typeof con[0].form_title !== 'undefined' && con[0].form_title !== '') {
					$scope.addFormElement('heading')
					$scope.Builder.FormElements[0][$scope.Builder.FormElements[0].length - 1]['elementDefaults']['field_value'] = con[0].form_title
					$scope.Builder.FormElements[0][$scope.Builder.FormElements[0].length - 1]['elementDefaults']['headingSize'] = 1.8
					$scope.Builder.FormElements[0][$scope.Builder.FormElements[0].length - 1]['elementDefaults']['headingWeight'] = true
					if (typeof con[0].ftalign !== 'undefined') {
						$scope.Builder.FormElements[0][$scope.Builder.FormElements[0].length - 1]['elementDefaults']['headingAlignment'] = con[0].ftalign
						$scope.Builder.FormElements[0][$scope.Builder.FormElements[0].length - 1]['elementDefaults']['paddingTop'] = '15px'
					}
				}

				let x = 0
				while (x < build.length - 1) {
					x++
					if (build[x].el_b.indexOf('One-line Text Input') !== -1) {
						$scope.addFormElement('oneLineText')
					} else if (build[x].el_b.indexOf('Hidden Field') !== -1) {
						$scope.addFormElement('customText')
						$scope.Builder.FormElements[0][$scope.Builder.FormElements[0].length - 1]['elementDefaults']['html'] = ''
						if (typeof build[x].hidval !== 'undefined') {
							$scope.Builder.FormElements[0][$scope.Builder.FormElements[0].length - 1]['elementDefaults']['field_value'] = build[x].hidval
						}
					} else if (build[x].el_b.indexOf('Divider') !== -1) {
						$scope.addFormElement('heading')
						$scope.Builder.FormElements[0][$scope.Builder.FormElements[0].length - 1]['elementDefaults']['field_value'] = build[x].cap1
						$scope.Builder.FormElements[0][$scope.Builder.FormElements[0].length - 1]['elementDefaults']['headingSize'] = 1.5
					} else if (build[x].el_b.indexOf('Email Input') !== -1) {
						$scope.addFormElement('email')
						if (typeof build[x].autoreply !== 'undefined' && build[x].autoreply === 'autoreply') {
							$scope.Builder.FormElements[0][$scope.Builder.FormElements[0].length - 1]['elementDefaults']['autoresponder'] = true
						}
						if (typeof build[x].replyto !== 'undefined' && build[x].replyto === 'replyto') {
							$scope.Builder.FormElements[0][$scope.Builder.FormElements[0].length - 1]['elementDefaults']['replyTo'] = true
						}
					} else if (build[x].el_b.indexOf('Paragraph Text Input') !== -1) {
						$scope.addFormElement('textarea')
					} else if (build[x].el_b.indexOf('Custom Text') !== -1) {
						$scope.addFormElement('customText')
						if (typeof build[x].customText !== 'undefined') {
							$scope.Builder.FormElements[0][$scope.Builder.FormElements[0].length - 1]['elementDefaults']['html'] = build[x].customText
						}
						if (typeof build[x].hValue !== 'undefined') {
							$scope.Builder.FormElements[0][$scope.Builder.FormElements[0].length - 1]['elementDefaults']['field_value'] = build[x].hValue
						}
					} else if (build[x].el_b.indexOf('Image') !== -1) {
						$scope.addFormElement('customText')
						if (typeof build[x].image !== 'undefined') {
							$scope.Builder.FormElements[0][$scope.Builder.FormElements[0].length - 1]['elementDefaults']['html'] = `<img src='${build[x].image}'/>`
						}
					} else if (build[x].el_b.indexOf('TimePicker') !== -1) {
						$scope.addFormElement('timepicker')
					} else if (build[x].el_b.indexOf('DatePicker') !== -1) {
						$scope.addFormElement('datepicker')
					} else if (build[x].el_b.indexOf('Slider Group') !== -1) {
						$scope.addFormElement('slider')
						if (typeof build[x].min !== 'undefined') {
							$scope.Builder.FormElements[0][$scope.Builder.FormElements[0].length - 1]['elementDefaults']['range_min'] = build[x].min
						}
						if (typeof build[x].max !== 'undefined') {
							$scope.Builder.FormElements[0][$scope.Builder.FormElements[0].length - 1]['elementDefaults']['range_max'] = build[x].max
						}
					} else if (build[x].el_b.indexOf('Slider Range Group') !== -1) {
						$scope.addFormElement('slider')
						if (typeof build[x].min !== 'undefined') {
							$scope.Builder.FormElements[0][$scope.Builder.FormElements[0].length - 1]['elementDefaults']['range_min'] = build[x].min
						}
						if (typeof build[x].max !== 'undefined') {
							$scope.Builder.FormElements[0][$scope.Builder.FormElements[0].length - 1]['elementDefaults']['range_max'] = build[x].max
						}
						$scope.Builder.FormElements[0][$scope.Builder.FormElements[0].length - 1]['elementDefaults']['range_true'] = true
					} else if (build[x].el_b.indexOf('Submit Button') !== -1) {
						$scope.addFormElement('submit')
					} else if (build[x].el_b.indexOf('File Upload') !== -1) {
						$scope.addFormElement('fileupload')
						if (typeof build[x].file_type !== 'undefined') {
							$scope.Builder.FormElements[0][$scope.Builder.FormElements[0].length - 1]['elementDefaults']['allow_extensions'] = build[x].file_type.replace(/ /g, ', ')
						}
					} else if (build[x].el_b.indexOf('Choice Matrix') !== -1) {
						$scope.addFormElement('matrix')
						let temp = []
						if (typeof build[x].matrix1 !== 'undefined') {
							temp.push(build[x].matrix1)
						}
						if (typeof build[x].matrix2 !== 'undefined') {
							temp.push(build[x].matrix2)
						}
						if (typeof build[x].matrix3 !== 'undefined') {
							temp.push(build[x].matrix3)
						}
						if (typeof build[x].matrix4 !== 'undefined') {
							temp.push(build[x].matrix4)
						}
						$scope.Builder.FormElements[0][$scope.Builder.FormElements[0].length - 1]['elementDefaults']['options_list'] = temp.join('\n')
						temp = build[x].el_f.split('opt in option[')
						let temp2 = temp[1].split(']')
						let temp3 = []
						if (typeof options[temp2[0]] !== 'undefined') {
							for (y in options[temp2[0]].Drop) {
								temp3.push(options[temp2[0]].Drop[y].val)
							}
						}
						$scope.Builder.FormElements[0][$scope.Builder.FormElements[0].length - 1]['elementDefaults']['matrix_rows'] = temp3.join('\n')
					} else if (build[x].el_b.indexOf('Star Rating') !== -1 || build[x].el_b.indexOf('Smiley Rating') !== -1) {
						$scope.addFormElement('star')
						let temp = build[x].el_f.split('opt in option[')
						let temp2 = temp[1].split(']')
						let temp3 = []
						if (typeof options[temp2[0]] !== 'undefined') {
							for (y in options[temp2[0]].Drop) {
								temp3.push(options[temp2[0]].Drop[y].val)
							}
						}
						$scope.Builder.FormElements[0][$scope.Builder.FormElements[0].length - 1]['elementDefaults']['options_list'] = temp3.join('\n')
					} else if (build[x].el_b.indexOf('Radio Group') !== -1) {
						$scope.addFormElement('checkbox')
					} else if (build[x].el_b.indexOf('Dropdown Box') !== -1) {
						$scope.addFormElement('dropdown')
					} else if (build[x].el_b.indexOf('CheckBox Group') !== -1) {
						$scope.addFormElement('checkbox')
						$scope.Builder.FormElements[0][$scope.Builder.FormElements[0].length - 1]['elementDefaults']['allow_multiple'] = 'checkbox'
					}

					if (typeof build[x].inst !== 'undefined') {
						$scope.Builder.FormElements[0][$scope.Builder.FormElements[0].length - 1]['elementDefaults']['instructions'] = build[x].inst
					}
					if (typeof build[x].cap1 !== 'undefined') {
						$scope.Builder.FormElements[0][$scope.Builder.FormElements[0].length - 1]['elementDefaults']['main_label'] = build[x].cap1
					}
					if (typeof build[x].options_raw !== 'undefined') {
						$scope.Builder.FormElements[0][$scope.Builder.FormElements[0].length - 1]['elementDefaults']['options_list'] = build[x].options_raw
					}
					if (typeof build[x].uploadtext !== 'undefined') {
						$scope.Builder.FormElements[0][$scope.Builder.FormElements[0].length - 1]['elementDefaults']['button_label'] = build[x].uploadtext
					}
					if (typeof build[x].cap2 !== 'undefined') {
						$scope.Builder.FormElements[0][$scope.Builder.FormElements[0].length - 1]['elementDefaults']['sub_label'] = build[x].cap2
					}
					if (typeof build[x].req !== 'undefined' && build[x].req === 1) {
						$scope.Builder.FormElements[0][$scope.Builder.FormElements[0].length - 1]['elementDefaults']['sub_label'] = true
					}
					if (typeof build[x].default !== 'undefined' && build[x].default === 'is_hidden') {
						$scope.Builder.FormElements[0][$scope.Builder.FormElements[0].length - 1]['elementDefaults']['hidden_default'] = true
					}
					if (typeof build[x].inline !== 'undefined') {
						if (build[x].inline === 'inline4') {
							$scope.Builder.FormElements[0][$scope.Builder.FormElements[0].length - 1]['elementDefaults']['field_width'] = '25%'
						}
						if (build[x].inline === 'inline3') {
							$scope.Builder.FormElements[0][$scope.Builder.FormElements[0].length - 1]['elementDefaults']['field_width'] = '33.3%'
						}
						if (build[x].inline === 'inline2') {
							$scope.Builder.FormElements[0][$scope.Builder.FormElements[0].length - 1]['elementDefaults']['field_width'] = '50%'
						}
					}
					$scope.Builder.FormElements[0][$scope.Builder.FormElements[0].length - 1]['show_options'] = false
				}
			} else {
				let raw_builder = inflate(decodeURIComponent(response.builder.trim()))
				if (response.old_url !== false) {
					let reg = new RegExp(response.old_url, 'g')
					raw_builder = raw_builder.replace(reg, response.new_url)
				}
				raw_builder = Object.assign({}, jQuery.evalJSON(raw_builder))
				if (typeof raw_builder.FormElements[0].element === 'undefined') {
					for (let x in raw_builder.FormElements[0]) {
						raw_builder.FormElements[0][x].identifier = raw_builder.FormElements[0][x].identifier || `field${x}`
					}
				} else {
					for (let x in raw_builder.FormElements) {
						raw_builder.FormElements[x].identifier = raw_builder.FormElements[x].identifier || `field${x}`
					}
				}
				$scope.Builder = raw_builder
			}


			/* Fetch and Fix Meta Data */
			if (response.meta_builder !== null && response.meta_builder !== '') {
				let raw_meta = response.meta_builder
				if (response.old_url !== false) {
					let reg = new RegExp(response.old_url, 'g')
					raw_meta = raw_meta.replace(reg, response.new_url)
				}
			}

			$scope.Builder.Config = $scope.Builder.Config || {}
			$scope.Builder.Config.page_names = $scope.Builder.Config.page_names || []
			if (response.name) {
				$scope.Builder.Config.form_name = response.name
			}
			$scope.Builder.Config.autoresponder = $scope.Builder.Config.autoresponder || {}
			$scope.Builder.Config.Messages = $scope.Builder.Config.Messages || {}
			$scope.Builder.Config.notifications = $scope.Builder.Config.notifications || {}

			if (typeof $scope.Builder.FormElements[0].element !== 'undefined') {
				let temp = $scope.Builder.FormElements
				$scope.Builder.FormElements = []
				$scope.Builder.FormElements[0] = temp
			}

			$scope.Builder.Config.showOptions = $scope.Builder.Config.showOptions || false
			$scope.Builder.Config.showAddons = $scope.Builder.Config.showAddons || false
			$scope.Builder.Config.showStyling = $scope.Builder.Config.showStyling || false
			$scope.Builder.Config.showLogic = $scope.Builder.Config.showLogic || false

			$scope.Builder.Config.showAddField = $scope.Builder.Config.showAddField || false

			$scope.Builder.Config.decimal_separator = $scope.Builder.Config.decimal_separator === undefined ? '.' : $scope.Builder.Config.decimal_separator
			$scope.Builder.Config.thousand_separator = $scope.Builder.Config.thousand_separator === undefined ? '' : $scope.Builder.Config.thousand_separator

			$scope.Builder.label_style = $scope.Builder.label_style === undefined ? 'inline' : $scope.Builder.label_style
			$scope.Builder.form_width = $scope.Builder.form_width === undefined ? '420px' : $scope.Builder.form_width
			if ($scope.Builder.form_width.match(/^[0-9]+$/) !== null) {
				$scope.Builder.form_width = `${$scope.Builder.form_width}px`
			}
			$scope.Builder.form_frame = $scope.Builder.form_frame === undefined ? 'visible' : $scope.Builder.form_frame
			$scope.Builder.form_field_border = $scope.Builder.form_field_border === undefined ? 'visible' : $scope.Builder.form_field_border
			$scope.Builder.font_size = $scope.Builder.font_size === undefined ? 100 : $scope.Builder.font_size
			$scope.Builder.Config.font_color = $scope.Builder.Config.font_color === undefined ? '#666666' : $scope.Builder.Config.font_color
			$scope.Builder.Config.field_font_color = $scope.Builder.Config.field_font_color || '#777'

			$scope.Builder.Config.webhook_method = $scope.Builder.Config.webhook_method || 'POST'

			$scope.Builder.nextText = $scope.Builder.nextText === undefined ? 'Next' : $scope.Builder.nextText
			$scope.Builder.prevText = $scope.Builder.prevText === undefined ? 'Previous' : $scope.Builder.prevText

			$scope.Builder.Config.font_family = $scope.Builder.Config.font_family === undefined ? 'inherit' : $scope.Builder.Config.font_family
			$scope.Builder.form_internal_alignment = $scope.Builder.form_internal_alignment === undefined ? 'left' : $scope.Builder.form_internal_alignment

			$scope.Builder.Config.Messages.is_required = $scope.Builder.Config.Messages.is_required || translate['Required']
			$scope.Builder.Config.Messages.is_invalid = $scope.Builder.Config.Messages.is_invalid || translate['Invalid']
			$scope.Builder.Config.Messages.min_char = $scope.Builder.Config.Messages.min_char || translate['Min [x] characters required']
			$scope.Builder.Config.Messages.max_char = $scope.Builder.Config.Messages.max_char || translate['Max [x] characters allowed']
			$scope.Builder.Config.Messages.min_files = $scope.Builder.Config.Messages.min_files || translate['Min [x] file(s) required']
			$scope.Builder.Config.Messages.max_files = $scope.Builder.Config.Messages.max_files || translate['Max [x] file(s) allowed']
			$scope.Builder.Config.Messages.max_file_size = $scope.Builder.Config.Messages.max_file_size || translate['Files bigger than [x] MB not allowed']
			$scope.Builder.Config.Messages.allow_email = $scope.Builder.Config.Messages.allow_email || translate['Invalid Email']
			$scope.Builder.Config.Messages.allow_url = $scope.Builder.Config.Messages.allow_url || translate['Invalid URL']
			$scope.Builder.Config.Messages.allow_regexp = $scope.Builder.Config.Messages.allow_regexp || translate['Invalid Expression']
			$scope.Builder.Config.Messages.allow_alphabets = $scope.Builder.Config.Messages.allow_alphabets || translate['Only alphabets']
			$scope.Builder.Config.Messages.allow_numbers = $scope.Builder.Config.Messages.allow_numbers || translate['Only numbers']
			$scope.Builder.Config.Messages.allow_alphanumeric = $scope.Builder.Config.Messages.allow_alphanumeric || translate['Should be alphanumeric']
			$scope.Builder.Config.Messages.failed = $scope.Builder.Config.Messages.failed || translate['Please correct the errors and try again']
			$scope.Builder.Config.Messages.success = $scope.Builder.Config.Messages.success || translate['Message received']

			$scope.Builder.Config.autoresponder.email_body = $scope.Builder.Config.autoresponder.email_body || translate['Email Content Autoresponder']
			$scope.Builder.Config.autoresponder.email_subject = $scope.Builder.Config.autoresponder.email_subject || translate['Thank you for your submission']

			$scope.Builder.Config.notifications._method = $scope.Builder.Config.notifications._method || 'php'
			$scope.Builder.Config.notifications.form_layout = $scope.Builder.Config.notifications.form_layout || false
			$scope.Builder.Config.notifications.email_body = $scope.Builder.Config.notifications.email_body || translate['<p>Hello,</p><p><br></p><p>You have received a new form submission for the form [Form Name]. Here are the details:</p><p>[Form Content]</p><p><br></p><p>Page: [URL]<br>Unique ID: #[Entry ID]<br>Date: [Date]<br>Time: [Time]</p>']
			$scope.Builder.Config.notifications.email_subject = $scope.Builder.Config.notifications.email_subject || '[Form Name] - ' + translate['New Form Submission']

			$scope.Builder.Config.color_scheme_font = $scope.Builder.Config.color_scheme_font || '#fff'
			$scope.Builder.Config.font_color = $scope.Builder.Config.font_color || '#666'
			$scope.Builder.Config.field_font_color = $scope.Builder.Config.field_font_color || '#777'
			$scope.Builder.Config.color_field_background = $scope.Builder.Config.color_field_background || '#fafafa'
			$scope.Builder.Config.color_scheme_button = $scope.Builder.Config.color_scheme_button || '#4488ee'
			$scope.Builder.Config.color_scheme_step = $scope.Builder.Config.color_scheme_step || '#4488ee'

			let f3_activated = getURLParameter('f3_activated')
			if (f3_activated !== null) {
				$scope.Builder.Config.showAddons = true
				setTimeout(function() {
					jQuery('.fc_highlight').slideDown()
				}, 1500)
				setTimeout(function() {
					jQuery('.fc_highlight').removeClass('fc_highlight')
				}, 3000)
			}

			jQuery('#formcraft-builder-cover').removeClass('form-loading')
			setTimeout(function() {
				jQuery('.dropdown-cover select').trigger('change')
			}, 300)

			$scope.$watch('Builder.Config.notifications.smtp_sender_host', function(newValue) {
				if (typeof $scope.Builder.Config.notifications.smtp_sender_host !== 'undefined' && $scope.Builder.Config.notifications.smtp_sender_host.indexOf('gmail') !== -1) {
					$scope.Builder.Config.notifications.showTip = true
				} else {
					$scope.Builder.Config.notifications.showTip = false
				}
			})
			$scope.$watch('Builder.Config.font_family', function(newValue) {
				if (typeof $scope.Builder.Config.font_family !== 'undefined' && $scope.Builder.Config.font_family.indexOf('Arial') === -1 && $scope.Builder.Config.font_family.indexOf('Courier') === -1 && $scope.Builder.Config.font_family.indexOf('sans-serif') === -1 && $scope.Builder.Config.font_family.indexOf('inherit') === -1) {
					jQuery('head').append(`<link href='${(location.protocol === 'http:' ? 'http:' : 'https:')}//fonts.googleapis.com/css?family=${($scope.Builder.Config.font_family.replace(/ /g, '+'))}:400,600,700' rel='stylesheet' type='text/css'>`)
				}
			})
			$scope.$watch('Color_scheme', function() {
				if (typeof $scope.Color_scheme !== 'undefined') {
					$scope.Builder.Config.color_scheme_font = '#fff'
					$scope.Builder.Config.font_color = '#666'
					$scope.Builder.Config.field_font_color = '#777'
					$scope.Builder.Config.color_field_background = '#fafafa'
					$scope.Builder.Config.color_scheme_button = $scope.Color_scheme
					$scope.Builder.Config.color_scheme_step = $scope.Color_scheme
				}
				setTimeout(function() {
					jQuery('.custom-color .wp-color-picker').trigger('change')
				}, 100)
			})

			$scope.$watch('Builder.Config.form_background_type', function() {
				if ($scope.Builder.Config.form_background_type === 'none') {
					$scope.Builder.form_background = 'none'
				} else if ($scope.Builder.Config.form_background_type === 'white') {
					$scope.Builder.form_background = 'white'
				}
			})

			$scope.$watch('Builder.Config.color_scheme_button', function() {
				$scope.Builder.Config.color_scheme_button_dark = shadeColor($scope.Builder.Config.color_scheme_button, -12)
				setTimeout(function() {
					jQuery('.custom-color .wp-color-picker').trigger('change')
				}, 100)
			})
			$scope.$watch('Builder.Config.color_scheme_step', function() {
				$scope.Builder.Config.color_scheme_step_dark = shadeColor($scope.Builder.Config.color_scheme_step, -12)
				setTimeout(function() {
					jQuery('.custom-color .wp-color-picker').trigger('change')
				}, 100)
			})

			$scope.$watch('Builder.form_background_custom_image', function() {
				if (typeof $scope.Builder.form_background_custom_image !== 'undefined' && $scope.Builder.form_background_custom_image !== '' && $scope.Builder.Config.form_background_type === 'custom') {
					$scope.Builder.form_background = `url(${$scope.Builder.form_background_custom_image})`
				}
			})

			$scope.$watch('Builder.form_background_color', function() {
				if (typeof $scope.Builder.form_background_color !== 'undefined' && $scope.Builder.form_background_color !== '' && $scope.Builder.Config.form_background_type === 'color') {
					$scope.Builder.form_background = $scope.Builder.form_background_color
				}
			})

			$scope.Pristine = $scope.Builder.FormElements
			let initY = 0
			$scope.toX = 0
			for (let x in $scope.Builder.FormElements) {

				$scope.$watchCollection(`Builder.FormElements['${x}']`, function() {
					$scope.applyLogicFix()
				})
				$scope.$watchCollection('Builder.FormElements', function() {
					$scope.sortableOptions = []
					for (let x in $scope.Builder.FormElements) {
						$scope.sortableOptions.push(createOptions(x))
					}
				})
				for (let y in $scope.Builder.FormElements[x]) {
					$scope.$watchCollection(`Builder.FormElements[${x}][${y}].elementDefaults.main_label`, function() {
						if ($scope.toX < initY) {
							$scope.toX += 1
						}
						if ($scope.toX === initY) {
							$scope.updateListOfFields()
						}
					})
					initY += 1
				}
			}

			setTimeout(() => {
				let otherFields = $scope.addField.others.map((x) => {
					return x.name
				})
				let paymentFields = $scope.addField.payments.map((x) => {
					return x.name
				})
				$scope.Builder.FormElements.forEach((page, pageNos) => {
					$scope.Builder.FormElements[pageNos].forEach((x, y) => {
						if (otherFields.indexOf(x.type) > -1) {
							let xF = otherFields.indexOf(x.type)
							$scope.Builder.FormElements[pageNos][y].element = `<div compile='addField.others[${xF}].fieldHTMLTemplate'></div>`
							$scope.Builder.FormElements[pageNos][y].elementOptions = `<div compile='addField.others[${xF}].fieldOptionTemplate'></div>`
						}
						if (paymentFields.indexOf(x.type) > -1) {
							let xF = paymentFields.indexOf(x.type)
							$scope.Builder.FormElements[pageNos][y].element = `<div compile='addField.payments[${xF}].fieldHTMLTemplate'></div>`
							$scope.Builder.FormElements[pageNos][y].elementOptions = `<div compile='addField.payments[${xF}].fieldOptionTemplate'></div>`
						}
					})
				})
				$scope.$apply()
			}, 0)

			let slidingPanels = ['Options.showOptions', 'Options.showStyling', 'Options.showLogic', 'Options.showAddons']
			$scope.$watchGroup(slidingPanels, function(newValue, oldValue) {
				newValue.forEach((x, y) => {
					if (x === false && oldValue[y] === true) {
						$scope.Builder.Config[slidingPanels[y].split('.')[1]] = 'hiding'
						$timeout(function() {
							$scope.Builder.Config[slidingPanels[y].split('.')[1]] = false
						}, 350)
					}
				})
			})
		})
	}()


	$scope.builderInit = function() {
		jQuery('.main-loader').remove()
		jQuery('.fc-form').on('dragover', function(e) {
			e.preventDefault()
		})
		jQuery('.fields-list-sortable > button').on('dragstart', function(e) {
			e.originalEvent.dataTransfer.setData('field', jQuery(e.target).attr('ng-click').replace('addFormElement("', '').replace('")', ''))
		})
		setTimeout(() => {
			jQuery('.wp-color-picker').trigger('change')
		}, 500)
		jQuery('.fc-form').on('drop', function(e) {
			e.preventDefault()
			let data = e.originalEvent.dataTransfer.getData('field')
			let position = [
				jQuery(e.target).parents('.form-page').index(),
				jQuery(e.target).parents('.form-element').index() + 1
			]
			$scope.addFormElement(data, position)
			setTimeout($scope.$apply(), 500)
		})
	}

	$scope.clearCustom = function() {
		$scope.Builder.form_background_custom_image = ''
		jQuery('.color-schemes .color-picker').val('')
	}

	$scope.updateListOfFields = function() {
		$scope.listOfFields = []
		let i = 0
		for (let a in $scope.Builder.FormElements) {
			if (typeof $scope.Builder.FormElements[a] !== 'object') {
				continue
			}
			for (let b in $scope.Builder.FormElements[a]) {
				if (typeof $scope.Builder.FormElements[a][b] !== 'object') {
					continue
				}
				i += 1
				$scope.listOfFields.push({
					identifier: $scope.Builder.FormElements[a][b].identifier,
					label: $scope.Builder.FormElements[a][b].elementDefaults.main_label
				})
			}
		}
		window.lastCheckedFieldsNos = i
		window.lastSaveFieldsNos = typeof window.lastSaveFieldsNos === 'undefined' ? i : window.lastSaveFieldsNos
	}
	$scope.applyLogicFix = function() {
		for (let x in $scope.Builder.Config.Logic) {
			for (let y in $scope.Builder.Config.Logic[x][1]) {
				applySelectFix(`cons_select_fix_${x}_${y}`, $scope.Builder.Config.Logic[x][1][y][4])
			}
			for (let y in $scope.Builder.Config.Logic[x][0]) {
				applySelectFix(`select_fix_${x}_${y}`, $scope.Builder.Config.Logic[x][0][y][0])
			}
		}
	}
	$scope.saveForm = function(followup) {
		if (followup === 'preview') {
			if (typeof previewForm !== 'undefined') {
				previewForm.close()
			}
			if (typeof previewForm === 'undefined') {
				window.previewForm = window.open(`${FC.baseurl}/form-view/${FC.form_id}?preview=true`, 'previewForm')
			} else {
				window.previewForm = window.open(`${FC.baseurl}/form-view/${FC.form_id}?preview=true`, 'previewForm')
				if (previewForm.document.getElementById('form-cover') !== null) {
					previewForm.document.getElementById('form-cover').innerHTML = '<span class="fc-spinner form-spinner small" style="display: block; margin: 150px auto"><div class="bounce1"></div><div class="bounce2"></div><div class="bounce3"></div></span>'
				}
			}
			previewForm.location = `${FC.baseurl}/form-view/${FC.form_id}?preview=true`
			previewForm.focus()
		}
		saveFormJQuery($scope.Builder, $scope.Addons, $scope.addField, function(itWorked) {
			if (followup === 'pluginInstalled' && itWorked === true) {
				window.location.assign(`${window.location.href}&f3_activated=${window.pluginInstalled}`)
			}
		})
	}
	$scope.toggleOptions = function($event, $parent, $index) {
		if ($event.target.type === 'checkbox' || $event.target.type === 'radio') {
			return false
		}
		$event.preventDefault()
		$scope.Builder.FormElements[$parent][$index].showOptions = !$scope.Builder.FormElements[$parent][$index].showOptions
		let open = false
		for (let page in $scope.Builder.FormElements) {
			for (let element in $scope.Builder.FormElements[page]) {
				if ($scope.Builder.FormElements[page][element].showOptions === true) {
					open = true
				}
			}
		}
		if (open === true) {
			jQuery('.fc-form').addClass('options-fade')
		} else {
			jQuery('.fc-form').removeClass('options-fade')
		}
	}
	$scope.addLogic = function() {
		if (typeof $scope.Builder.Config.Logic === 'undefined') {
			$scope.Builder.Config.Logic = []
		}
		$scope.Builder.Config.Logic.push([])
		let len = $scope.Builder.Config.Logic.length - 1
		$scope.Builder.Config.Logic[len][0] = [[]]
		$scope.Builder.Config.Logic[len][1] = [[]]
		$scope.Builder.Config.Logic[len][2] = 'and'
	}
	$scope.removeLogic = function($index) {
		$scope.Builder.Config.Logic.splice($index, 1)
	}
	$scope.addLogicAction = function($index) {
		$scope.Builder.Config.Logic[$index][0].push([])
	}
	$scope.removeLogicAction = function($parent, $index) {
		$scope.Builder.Config.Logic[$parent][0].splice($index, 1)
	}
	$scope.addLogicResult = function($index) {
		$scope.Builder.Config.Logic[$index][1].push([])
	}
	$scope.removeLogicResult = function($parent, $index) {
		$scope.Builder.Config.Logic[$parent][1].splice($index, 1)
	}
	$scope.removeFormElement = function ($parent, $index) {
		$scope.Builder.FormElements[$parent].splice($index, 1)
		let open = false
		for (let page in $scope.Builder.FormElements) {
			for (let element in $scope.Builder.FormElements[page]) {
				if ($scope.Builder.FormElements[page][element].showOptions === true) {
					open = true
				}
			}
		}
		if (open === true) {
			jQuery('.fc-form').addClass('options-fade')
		} else {
			jQuery('.fc-form').removeClass('options-fade')
		}
		$scope.updateListOfFields()
	}
	$scope.duplicateFormElement = function ($parent, $index) {
		$scope.Builder.FormElements[$parent].splice($index, 0, angular.copy($scope.Builder.FormElements[$parent][$index]))
		let position = $index + 1
		$scope.Builder.elements_counter = $scope.Builder.elements_counter + 1
		$scope.Builder.FormElements[$parent][position].elementDefaults.identifier = `field${$scope.Builder.elements_counter}`
		$scope.Builder.FormElements[$parent][position].identifier = `field${$scope.Builder.elements_counter}`
		$scope.updateListOfFields()
	}

	$scope.showIcons = function($parent, $index) {
		let selectedIcon = $scope.Builder.FormElements[$parent][$index].elementDefaults.selectedIcon || ''
		jQuery('#icons_modal').fc_modal('show')
		$scope.showIconsParent = $parent;
		$scope.showIconsIndex = $index;
		jQuery('#icons_modal').find(`[value="${selectedIcon}"]`).prop('checked', true).parents('label').addClass('active')
		jQuery('#icons_modal').find('.active [type="radio"]:not(:checked)').parents('label').removeClass('active')
	}
	$scope.selectIcon = function(icon) {
		$scope.Builder.FormElements[$scope.showIconsParent][$scope.showIconsIndex].elementDefaults.selectedIcon = icon
		jQuery('#icons_modal').fc_modal('hide')
	}
	$scope.addCountries = function ($parent, $index) {
		$scope.Builder.FormElements[$parent][$index].elementDefaults.options_list = require('./data/countries').countries
	}
	$scope.addNationalities = function ($parent, $index) {
		$scope.Builder.FormElements[$parent][$index].elementDefaults.options_list = require('./data/nationalities').nationalities
	}
	$scope.addLanguages = function ($parent, $index) {
		$scope.Builder.FormElements[$parent][$index].elementDefaults.options_list = require('./data/languages').languages
	}
	$scope.addStates = function ($parent, $index) {
		$scope.Builder.FormElements[$parent][$index].elementDefaults.options_list = require('./data/states').states
	}
	$scope.addDays = function ($parent, $index) {
		$scope.Builder.FormElements[$parent][$index].elementDefaults.options_list = 'Sunday\nMonday\nTuesday\nWednesday\nThursday\nFriday\nSaturday'
	}
	$scope.addMonths = function ($parent, $index) {
		$scope.Builder.FormElements[$parent][$index].elementDefaults.options_list = 'January\nFebruary\nMarch\nApril\nMay\nJune\nJuly\nAugust\nSeptember\nOctober\nNovember\nDecember'
	}
	$scope.listIcons = require('./data/icons.js').icons

	$scope.dateLang = ['af', 'ar-DZ', 'ar', 'az', 'be', 'bg', 'bs', 'ca', 'cs', 'cy-GB', 'da', 'de', 'el', 'en-AU', 'en-GB', 'en-NZ', 'eo', 'es', 'et', 'eu', 'fa', 'fi', 'fo', 'fr-CA', 'fr-CH', 'fr', 'gl', 'he', 'hi', 'hr', 'hu', 'hy', 'id', 'is', 'it-CH', 'it', 'ja', 'ka', 'kk', 'km', 'ko', 'ky', 'lb', 'lt', 'lv', 'mk', 'ml', 'ms', 'nb', 'nl-BE', 'nl', 'nn', 'no', 'pl', 'pt-BR', 'pt', 'rm', 'ro', 'ru', 'sk', 'sl', 'sq', 'sr-SR', 'sr', 'sv', 'ta', 'th', 'tj', 'tr', 'uk', 'vi', 'zh-CN', 'zh-HK', 'zh-TW']

	$scope.fieldHTMLTemplate = require('./data/field-templates.js').fieldHTML
	$scope.fieldOptionTemplate = require('./data/field-templates.js').fieldOptions

	$scope.addFormElement = function(type, position) {

		let total = 0
		total = total + $scope.Builder.FormElements.length

		$scope.elementTemp = {}
		$scope.elementTemp.field_width = '100%'
		$scope.Builder.elements_counter = $scope.Builder.elements_counter === undefined ? 1 : $scope.Builder.elements_counter + 1
		let tempVar = $scope.Builder.elements_counter
		$scope.elementTemp.identifier = `field${parseInt(tempVar, 10)}`
		$scope.elementTemp.hidden_default = false
		$scope.elementTemp.required = false
		$scope.restrict = false

		switch (type) {
			case 'heading':
			$scope.element = `<div compile='fieldHTMLTemplate["${type}"]'></div>`
			$scope.elementOptions = `<div compile='fieldOptionTemplate["${type}"]'></div>`
			$scope.elementTemp.main_label = translate['Heading']
			$scope.elementTemp.field_value = translate['Some Title']
			$scope.elementTemp.headingSize = 1.5
			$scope.elementTemp.headingAlignment = 'left'
			break

			case 'oneLineText':
			$scope.element = `<div compile='fieldHTMLTemplate["${type}"]'></div>`
			$scope.elementOptions = `<div compile='fieldOptionTemplate["${type}"]'></div>`
			$scope.elementTemp.main_label = translate['Name']
			$scope.elementTemp.sub_label = translate['your full name']
			$scope.elementTemp.selectedIcon = ''
			$scope.elementTemp.readonly = false
			break

			case 'password':
			$scope.element = `<div compile='fieldHTMLTemplate["${type}"]'></div>`
			$scope.elementOptions = `<div compile='fieldOptionTemplate["${type}"]'></div>`
			$scope.elementTemp.main_label = translate['Password']
			$scope.elementTemp.sub_label = translate['check your caps']
			break

			case 'email':
			$scope.element = `<div compile='fieldHTMLTemplate["${type}"]'></div>`
			$scope.elementOptions = '<div compile=\'fieldOptionTemplate.email\'></div>'
			$scope.elementTemp.main_label = translate['Email']
			$scope.elementTemp.sub_label = translate['a valid email']
			break

			case 'textarea':
			$scope.element = `<div compile='fieldHTMLTemplate["${type}"]'></div>`
			$scope.elementOptions = `<div compile='fieldOptionTemplate["${type}"]'></div>`
			$scope.elementTemp.main_label = translate['Comments']
			$scope.elementTemp.sub_label = translate['more details']
			$scope.elementTemp.field_height = '5'
			break

			case 'checkbox':
			$scope.element = `<div compile='fieldHTMLTemplate["${type}"]'></div>`
			$scope.elementOptions = `<div compile='fieldOptionTemplate["${type}"]'></div>`
			$scope.elementTemp.main_label = translate['Favorite Fruits']
			$scope.elementTemp.sub_label = translate['pick one!']
			$scope.elementTemp.allow_multiple = 'checkbox'
			$scope.elementTemp.options_list = 'Apple\nOrange\nWatermelon'
			break

			case 'dropdown':
			$scope.element = `<div compile='fieldHTMLTemplate["${type}"]'></div>`
			$scope.elementOptions = `<div compile='fieldOptionTemplate["${type}"]'></div>`
			$scope.elementTemp.main_label = translate['Language']
			$scope.elementTemp.sub_label = translate['pick one!']
			$scope.elementTemp.options_list = '==Select An Option\nEnglish\nFrench\nSpanish'
			break

			case 'datepicker':
			$scope.element = `<div compile='fieldHTMLTemplate["${type}"]'></div>`
			$scope.elementOptions = `<div compile='fieldOptionTemplate["${type}"]'></div>`
			$scope.elementTemp.main_label = translate['Date']
			$scope.elementTemp.sub_label = translate['of appointment']
			$scope.elementTemp.dateLang = 'en'
			$scope.elementTemp.dateFormat = 'dd/mm/yy'
			$scope.elementTemp.dateDays = { 0:true, 1:true, 2:true, 3:true, 4:true, 5:true, 6:true }
			break

			case 'customText':
			$scope.element = `<div compile='fieldHTMLTemplate["${type}"]'></div>`
			$scope.elementOptions = `<div compile='fieldOptionTemplate["${type}"]'></div>`
			$scope.elementTemp.html = translate['Add some text or <strong>HTML</strong> here']
			$scope.elementTemp.main_label = translate['Text Field']
			$scope.elementTemp.font_color = '#666666'
			$scope.elementTemp.floating_type = 'false'
			$scope.elementTemp.alignment = 'left'
			break

			case 'submit':
			$scope.element = `<div compile='fieldHTMLTemplate["${type}"]'></div>`
			$scope.elementOptions = `<div compile='fieldOptionTemplate["${type}"]'></div>`
			$scope.elementTemp.main_label = translate['Submit Form']
			$scope.elementTemp.isWide = false
			$scope.elementTemp.doAnimate = false
			$scope.elementTemp.alignment = 'right'
			break

			case 'fileupload':
			$scope.element = `<div compile='fieldHTMLTemplate["${type}"]'></div>`
			$scope.elementOptions = `<div compile='fieldOptionTemplate["${type}"]'></div>`
			$scope.elementTemp.main_label = translate['File']
			$scope.elementTemp.sub_label = translate['upload']
			$scope.elementTemp.button_label = 'Upload'
			break

			case 'slider':
			$scope.element = `<div compile='fieldHTMLTemplate["${type}"]'></div>`
			$scope.elementOptions = `<div compile='fieldOptionTemplate["${type}"]'></div>`
			$scope.elementTemp.main_label = translate['Slider']
			$scope.elementTemp.sub_label = translate['take your pick']
			$scope.elementTemp.range_true = 'min'
			$scope.elementTemp.range_step = 5
			$scope.elementTemp.range_min = 10
			$scope.elementTemp.range_max = 100
			$scope.elementTemp.scale_true = false
			break

			case 'timepicker':
			$scope.element = `<div compile='fieldHTMLTemplate["${type}"]'></div>`
			$scope.elementOptions = `<div compile='fieldOptionTemplate["${type}"]'></div>`
			$scope.elementTemp.main_label = translate['Time']
			$scope.elementTemp.sub_label = translate['of appointment']
			$scope.elementTemp.format_24 = false
			$scope.elementTemp.hrs_min = 0
			$scope.elementTemp.hrs_max = 24
			$scope.elementTemp.hrs_step = 2
			break

			case 'address':
			$scope.element = `<div compile='fieldHTMLTemplate["${type}"]'></div>`
			$scope.elementOptions = `<div compile='fieldOptionTemplate["${type}"]'></div>`
			$scope.elementTemp.main_label = translate['Address']
			$scope.elementTemp.sub_label = translate['your home / office']
			$scope.elementTemp.map_height = 240
			break

			case 'star':
			$scope.element = `<div compile='fieldHTMLTemplate["${type}"]'></div>`
			$scope.elementOptions = `<div compile='fieldOptionTemplate["${type}"]'></div>`
			$scope.elementTemp.main_label = translate['Rate']
			$scope.elementTemp.sub_label = translate['our support']
			$scope.elementTemp.options_list = `1==${translate['Bad']}\n2==${translate['Could be better']}\n3==${translate['So so']}\n4==${translate['Good']}\n5==${translate['Excellent']}`
			break

			case 'thumb':
			$scope.element = `<div compile='fieldHTMLTemplate["${type}"]'></div>`
			$scope.elementOptions = `<div compile='fieldOptionTemplate["${type}"]'></div>`
			$scope.elementTemp.main_label = translate['Liked the food?']
			$scope.elementTemp.sub_label = translate['let us know']
			$scope.elementTemp.options_list = '1==Yep\n0==Nope'
			break

			case 'matrix':
			$scope.element = `<div compile='fieldHTMLTemplate["${type}"]'></div>`
			$scope.elementOptions = `<div compile='fieldOptionTemplate["${type}"]'></div>`
			$scope.elementTemp.main_label = translate['Survey']
			$scope.elementTemp.sub_label = ''
			$scope.elementTemp.matrix_rows = translate['How Was the Food?'] + "\n" + translate['How Was the Service?']
			$scope.elementTemp.matrix_cols = translate['Poor'] + "\n" + translate['Average'] + "\n" + translate['Good']
			break

			default:
			for (let x in $scope.addField.payments) {
				if ($scope.addField.payments[x].name === type) {
					for (let y in $scope.Builder.FormElements) {
						for (let z in $scope.Builder.FormElements[y]) {
							if ($scope.Builder.FormElements[y][z].type === $scope.addField.payments[x].name && $scope.Builder.FormElements[y][z].restrict === true) {
								return false
							}
						}
					}
					$scope.element = `<div compile='addField.payments[${x}].fieldHTMLTemplate'></div>`
					$scope.elementOptions = `<div compile='addField.payments[${x}].fieldOptionTemplate'></div>`
					$scope.restrict = true
					for (let y in $scope.addField.payments[x].defaults) {
						$scope.elementTemp[y] = $scope.addField.payments[x].defaults[y]
					}
				}
			}
			for (let x in $scope.addField.others) {
				if ($scope.addField.others[x].name === type) {
					$scope.element = `<div compile='addField.others[${x}].fieldHTMLTemplate'></div>`
					$scope.elementOptions = `<div compile='addField.others[${x}].fieldOptionTemplate'></div>`
					$scope.restrict = true
					for (let y in $scope.addField.others[x].defaults) {
						$scope.elementTemp[y] = $scope.addField.others[x].defaults[y]
					}
				}
			}
			break
		}
		position = typeof position === 'undefined' ? [0, $scope.Builder.FormElements[0].length] : position
		$scope.Builder.FormElements[position[0]].splice(position[1], 0, {
			element: $scope.element,
			restrict: $scope.restrict,
			identifier: `field${parseInt(tempVar, 10)}`,
			type: type,
			elementOptions: $scope.elementOptions,
			elementDefaults: $scope.elementTemp
		})
		setTimeout(function() {
			jQuery('.dropdown-cover select').trigger('change')
		}, 300)
		$scope.updateListOfFields()
		$scope.Builder.Config.showFields = false
	}

})
