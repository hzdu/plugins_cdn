/**
 * Scroll into view via IntersectionObserver
 *
 * Fallback for IE9+ included.
 */
class BricksIntersect {
	constructor(options = {}) {
		let element = options.element || false
		let callback = options.callback || false
		let runOnce = options.hasOwnProperty('once') ? options.once : true
		let trigger = options.hasOwnProperty('trigger') ? options.trigger : false

		// Create Intersection Observer
		if ('IntersectionObserver' in window) {
			let initialObserve = true
			let observerInstance = new IntersectionObserver(
				(entries, observer) => {
					entries.forEach((entry) => {
						// Check if element is intersecting based on trigger type
						let bricksIsIntersecting =
							trigger === 'leaveView' ? !entry.isIntersecting : entry.isIntersecting

						if (bricksIsIntersecting) {
							// Skip initial observe if trigger is 'leaveView', as it will always be true if element is not visible
							if (initialObserve && trigger === 'leaveView') {
								initialObserve = false

								return
							}

							// Run callback function
							if (element && callback) {
								callback(entry.target)
							}

							// Run only once: Stop observing element
							if (runOnce) {
								observer.unobserve(entry.target)
							}
						}
					})
				},
				{
					threshold: options.threshold || 0,
					root: options.root || null,
					rootMargin: options?.rootMargin || '0px'
				}
			)

			// Start observer
			if (element instanceof Element) {
				observerInstance.observe(element)
			}
		}

		// Fallback: Internet Explorer 9+
		else {
			let active = false

			let ieIntersectObserver = () => {
				if (active === false) {
					active = true

					if (
						element.getBoundingClientRect().top <= window.innerHeight &&
						element.getBoundingClientRect().bottom >= 0 &&
						window.getComputedStyle(element).display !== 'none'
					) {
						// Run callback function
						if (element && callback) {
							callback(element)
						}
					}

					active = false
				}
			}

			// Init IE intersect observer fallback function
			ieIntersectObserver()

			document.addEventListener('scroll', ieIntersectObserver)
			window.addEventListener('resize', ieIntersectObserver)
			window.addEventListener('orientationchange', ieIntersectObserver)
		}
	}
}

/**
 * Check if element is in the viewport
 *
 * @since 1.5
 *
 * @param {Element} element
 * @returns {boolean}
 */
function BricksIsInViewport(element) {
	const rect = element.getBoundingClientRect()
	return (
		rect.top >= 0 &&
		rect.left >= 0 &&
		rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
		rect.right <= (window.innerWidth || document.documentElement.clientWidth)
	)
}

/**
 * Convert foundNodeList to array (as IE does not support forEach loop on NodeList)
 *
 * @param {Element} parentNode Node to search within.
 * @param {array, string} selector CSS selector(s) to search for.
 *
 * @returns {array}
 */
function bricksQuerySelectorAll(parentNode, selector) {
	// Multiple selectors
	if (Array.isArray(selector)) {
		let nodes = []

		selector.forEach((sel) => {
			nodes = nodes.concat(Array.prototype.slice.apply(parentNode.querySelectorAll(sel)))
		})

		return nodes
	}

	// One selector (string)
	return Array.prototype.slice.apply(parentNode.querySelectorAll(selector))
}

/**
 * Bricks Utilities functions
 *
 * @since 1.8
 */

const bricksUtils = {
	/**
	 * Subscribe to multiple events
	 * @param {*} object Example: document, window, element
	 * @param {*} eventNames Array of event names
	 * @param {*} callback
	 */
	subscribeEvents: (object, eventNames, callback) => {
		eventNames.forEach((eventName) => {
			object.addEventListener(eventName, (event) => {
				callback(event)
			})
		})
	}
}

/**
 * BricksFunction class
 *
 * @since 1.8
 */
class BricksFunction {
	// Store custom functions on class init
	_customRun = null
	_customEachElement = null
	_customListenerHandler = null
	_customAddEventListeners = null

	// Store default settings
	_settings = {}

	// Store initialized elements
	_initializedElements = new Set()

	constructor(options) {
		// Default settings
		const defaultSettings = {
			parentNode: document,
			selector: '',
			subscribeEvents: ['bricks/ajax/pagination/completed', 'bricks/ajax/load_page/completed'],
			forceReinit: false,
			frontEndOnly: false,
			windowVariableCheck: [],
			additionalActions: []
		}

		// Merge options with default settings when init the class
		Object.assign(defaultSettings, options)

		// Set default settings as class properties
		this._settings = defaultSettings

		// Assign custom functions if any (these functions are overrideable on class init)
		this._customRun = options?.run ?? null
		this._customEachElement = options?.eachElement ?? null
		this._customListenerHandler = options?.listenerHandler ?? null
		this._customAddEventListeners = options?.addEventListeners ?? null

		// Bind functions to class
		this.cleanUpInitElements = this.cleanUpInitElements.bind(this)
		this.run = this.run.bind(this)
		this.eachElement = this.eachElement.bind(this)
		this.listenerHandler = this.listenerHandler.bind(this)
		this.addEventListeners = this.addEventListeners.bind(this)

		document.addEventListener('DOMContentLoaded', () => {
			// Add event listeners (only add once)
			this.addEventListeners()

			// Run additional actions: Not define as a function to avoid overriding (no functionCanRun check here)
			if (this._settings.additionalActions.length) {
				for (const action of this._settings.additionalActions) {
					// Check if action is a function
					if (typeof action === 'function') {
						action.call(this)
					}
				}
			}
		})
	}

	/**
	 * Helper: Based on window variable and frontEndOnly setting, check if function can run
	 */
	functionCanRun() {
		// Check: frontEndOnly is set and we are not in the front end
		if (this._settings.frontEndOnly) {
			// Can't use bricksIsFrontend here as this function is called before 'bricksIsFrontend' is set (and this is inside a class)
			if (!document.body.classList.contains('bricks-is-frontend')) {
				return false
			}
		}

		// Check: Does required window variables exist
		if (this._settings.windowVariableCheck.length) {
			for (const variable of this._settings.windowVariableCheck) {
				if (!window[variable]) {
					return false
				}
			}
		}

		return true
	}

	/**
	 * Helper: Clean up initialized elements set: Remove elements that are no longer in the DOM
	 */
	cleanUpInitElements() {
		// Remove elements from _initializedElements if they are no longer in the DOM
		for (const element of this._initializedElements) {
			if (!element.isConnected) {
				this._initializedElements.delete(element)
			}
		}
	}

	/**
	 * Run logic on each element
	 */
	eachElement(element) {
		// Execute custom _customEachElement function if defined in constructor
		if (this._customEachElement && typeof this._customEachElement === 'function') {
			this._customEachElement.call(this, element)
			return
		}

		// Default customEachElement function: Do nothing
	}

	/**
	 * Entry point:
	 * Using functionCanRun as a guard, clean up initialized elements.
	 * By default, find all elements based on parent node and selector, and run the eachElement function on each element.
	 */
	run(customSettings) {
		if (!this.functionCanRun()) {
			return
		}

		// Must run cleanUpInitElements before custom run function
		this.cleanUpInitElements()

		// Execute custom run function if defined in constructor
		if (this._customRun && typeof this._customRun === 'function') {
			this._customRun.call(this, customSettings)
			return
		}

		// Default run function

		// Clone settings (to avoid modifying them)
		const currentSettings = Object.assign({}, this._settings)

		// Set custom settings to current settings
		if (customSettings) {
			Object.keys(customSettings).forEach((key) => {
				if (currentSettings.hasOwnProperty(key)) {
					currentSettings[key] = customSettings[key]
				}
			})
		}

		const elementInstances = bricksQuerySelectorAll(
			currentSettings.parentNode,
			currentSettings.selector
		)

		// Exit if no element found
		if (!elementInstances.length) {
			return
		}

		elementInstances.forEach((element, index) => {
			// Store the element in the _initializedElements set
			// forceReinit, ignore the set and run the eachElement function
			if (currentSettings.forceReinit) {
				// If forceReinit is a callback, run it
				const reinit =
					typeof currentSettings.forceReinit === 'function'
						? currentSettings.forceReinit.call(this, element, index)
						: currentSettings.forceReinit

				if (reinit) {
					this.eachElement(element, index)
					// Continue to next element
					return
				}
			}

			// Check if the element is already initialized
			if (!this._initializedElements.has(element)) {
				// Add element to initialized elements set
				this._initializedElements.add(element)

				// Run eachElement function
				this.eachElement(element, index)
			} else {
				// Maybe the element inside the set is not the same as the current element, so we need to check
				// Get the element from the set
				const elementFromSet = Array.from(this._initializedElements).find((el) => el === element)

				// If it is not connected, remove it from the set and run the eachElement function
				if (!elementFromSet.isConnected) {
					this._initializedElements.delete(elementFromSet)
					// Add element to initialized elements set
					this._initializedElements.add(element, index)
					this.eachElement(element, index)
				}
			}
		})
	}

	/**
	 * Once subscribed to events, run the listenerHandler function
	 * By default, we will change the parent node based on the event type, and execute the run function again
	 */
	listenerHandler(event) {
		// Execute custom listenerHandler function if defined in constructor
		if (this._customListenerHandler && typeof this._customListenerHandler === 'function') {
			this._customListenerHandler.call(this, event)
			return
		}

		// Default listenerHandler function
		if (event?.type) {
			switch (event.type) {
				// Can add more cases here if needed for different events
				// Maybe can change the parent node or selector based on the event type

				default:
					this.run()
					break
			}
		}
	}

	/**
	 * By default, subscribe to events defined in the settings, and set listenerHandler as the callback
	 * Using functionCanRun as a guard
	 */
	addEventListeners() {
		if (!this.functionCanRun()) {
			return
		}

		// Execute custom addEventListeners function if defined in constructor
		if (this._customAddEventListeners && typeof this._customAddEventListeners === 'function') {
			this._customAddEventListeners.call(this)
			return
		}

		// Default addEventListeners function
		if (this._settings.subscribeEvents.length) {
			bricksUtils.subscribeEvents(document, this._settings.subscribeEvents, this.listenerHandler)
		}
	}
}

/**
 * Frontend: Lazy load when target element enters viewport
 *
 * Video lazy load via bricksBackgroundVideoInit()
 *
 * https://developers.google.com/web/fundamentals/performance/lazy-loading-guidance/images-and-video/
 */
const bricksLazyLoadFn = new BricksFunction({
	parentNode: document,
	selector: '.bricks-lazy-hidden',
	eachElement: (el) => {
		// Lazy Load function
		let lazyLoad = (el) => {
			// Replace element attributes by setting 'src' with 'data-src'

			// Show base64 preloader SVG
			el.classList.add('wait')

			// Image
			if (el.dataset.src) {
				el.src = el.dataset.src
				delete el.dataset.src
			}

			// Image (data-sizes @since 1.5.1 due to W3 Validator error)
			if (el.dataset.sizes) {
				el.sizes = el.dataset.sizes
				delete el.dataset.sizes
			}

			if (el.dataset.srcset) {
				el.srcset = el.dataset.srcset
				delete el.dataset.srcset
			}

			// Background image (e.g. slider)
			if (el.dataset.style) {
				let style = el.getAttribute('style') || ''
				style += el.dataset.style
				el.setAttribute('style', style)

				// Keep 'data-style' attribute for when splide.js re-initializes on window resize, etc. (@since 1.5)
				if (!el.classList.contains('splide__slide')) {
					delete el.dataset.style
				}
			}

			el.classList.remove('bricks-lazy-hidden')
			el.classList.remove('wait')

			if (el.classList.contains('bricks-lazy-load-isotope')) {
				bricksIsotope()
			}
		}

		// Lazy load offet: 300px default (customisable via Bricks setting 'offsetLazyLoad')
		const rootMargin = window.bricksData.offsetLazyLoad || 300

		new BricksIntersect({
			element: el,
			callback: (el) => {
				lazyLoad(el)
			},
			rootMargin: `${rootMargin}px`
		})
	},
	listenerHandler: (event) => {
		// No need to change parentNode, but need some delay to allow for new elements to be added to the DOM (e.g. swiper, carousel, testimonial, etc.)
		setTimeout(() => {
			bricksLazyLoadFn.run()
		}, 100)
	}
})

function bricksLazyLoad() {
	bricksLazyLoadFn.run()
}

/**
 * Animate.css element animation
 */
const bricksAnimationFn = new BricksFunction({
	parentNode: document,
	selector: '.brx-animated',
	removeAfterMs: 3000, // removeAfterMs not used anymore (@since 1.8)
	eachElement: (el) => {
		new BricksIntersect({
			element: el,
			callback: (el) => {
				let animation = el.dataset.animation
				if (animation) {
					// Start animation
					el.classList.add(`brx-animate-${animation}`)

					// Remove attribute to prevent hiding element after "in" animations (see _animate.scss)
					el.removeAttribute('data-animation')

					// Remove animation class on 'animationend' event instead of setTimeout below (@since 1.8)
					el.addEventListener(
						'animationend',
						() => {
							el.classList.remove(`brx-animate-${animation}`)

							// If this is .brx-popup-content, and animation includes 'Out', execute bricksClosePopup() after animation
							if (el.classList.contains('brx-popup-content') && animation.includes('Out')) {
								const popupNode = el.closest('.brx-popup')
								if (popupNode) {
									bricksClosePopup(popupNode)
								}
							}

							// animationId = data-animation-id
							const animationId = el.dataset?.animationId

							if (animationId) {
								// @since 1.8.4 - Trigger custom event for bricks/animation/end/{animationId}, provide element
								const bricksAnimationEvent = new CustomEvent(
									`bricks/animation/end/${animationId}`,
									{ detail: { el } }
								)
								document.dispatchEvent(bricksAnimationEvent)
							}
						},
						{ once: true }
					)
				}
			}
		})
	},
	run: (customSettings) => {
		const self = bricksAnimationFn

		// Use customSettings.elementsToAnimate if defined
		const elementsToAnimate =
			customSettings?.elementsToAnimate ||
			bricksQuerySelectorAll(self._settings.parentNode, self._settings.selector)

		// Use customSettings.removeAfterMs if defined
		self.removeAfterMs = customSettings?.removeAfterMs || self.removeAfterMs

		elementsToAnimate.forEach((el) => {
			self.eachElement(el)
		})
	}
})

function bricksAnimation() {
	bricksAnimationFn.run()
}

/**
 * Populate the queries instances variable to be used for infinite scroll and load more
 *
 * @since 1.6
 */
const bricksInitQueryLoopInstancesFn = new BricksFunction({
	parentNode: document,
	selector: '.brx-query-trail',
	subscribeEvents: ['bricks/ajax/load_page/completed'],
	eachElement: (el) => {
		const observerMargin = el.dataset?.observerMargin || '1px' // 0px doesn't trigger properly every time
		const queryElementId = el.dataset.queryElementId
		const queryVars = el.dataset.queryVars
		const isPostsElement = el?.classList.contains('bricks-isotope-sizer')
		const isInfiniteScroll = el?.classList.contains('brx-infinite-scroll')

		window.bricksData.queryLoopInstances[queryElementId] = {
			page: el.dataset.page,
			maxPages: el.dataset.maxPages,
			queryVars,
			observerMargin,
			infiniteScroll: isInfiniteScroll,
			isPostsElement: isPostsElement
		}

		// If posts element, the query trail is the isotope sizer; For the Query Loop the trail is the last loop element
		// @since 1.7.1 - exclude popup elements
		let queryTrail = isPostsElement
			? el.previousElementSibling
			: Array.from(document.querySelectorAll(`.brxe-${queryElementId}:not(.brx-popup)`)).pop()

		// Remove the trail in case it is not a Posts element
		if (!isPostsElement) {
			el.remove()
		}

		if (queryTrail && isInfiniteScroll) {
			queryTrail.dataset.queryElementId = queryElementId

			new BricksIntersect({
				element: queryTrail,
				callback: (el) => bricksQueryLoadPage(el),
				once: 1,
				rootMargin: observerMargin
			})
		}
	}
})

function bricksInitQueryLoopInstances() {
	bricksInitQueryLoopInstancesFn.run()
}

/**
 * Bricks query load page elements
 *
 * @since 1.5
 */
function bricksQueryLoadPage(el) {
	return new Promise(function (resolve, reject) {
		const queryElementId = el.dataset.queryElementId

		const queryInfo = window.bricksData.queryLoopInstances?.[queryElementId]

		if (!queryInfo || queryInfo?.isLoading) {
			return
		}

		let page = parseInt(queryInfo.page || 1) + 1
		const maxPages = parseInt(queryInfo.maxPages || 1)

		if (page > maxPages) {
			delete window.bricksData.queryLoopInstances[queryElementId]
			resolve({ page, maxPages })
			return
		}

		// Set isLoading flag
		window.bricksData.queryLoopInstances[queryElementId].isLoading = 1

		let queryData = {
			postId: window.bricksData.postId,
			queryElementId: queryElementId,
			queryVars: queryInfo.queryVars,
			page: page,
			nonce: window.bricksData.nonce
		}

		const url = window.bricksData.restApiUrl.concat('load_query_page')

		let xhr = new XMLHttpRequest()
		xhr.open('POST', url, true)
		xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8')
		xhr.setRequestHeader('X-WP-Nonce', window.bricksData.wpRestNonce)

		// Successful response
		xhr.onreadystatechange = function () {
			if (xhr.readyState === XMLHttpRequest.DONE) {
				var status = xhr.status

				// Success
				if (status === 0 || (status >= 200 && status < 400)) {
					let res = JSON.parse(xhr.response)

					const html = res?.html || false
					const styles = res?.styles || false

					// Popups HTML (@since 1.7.1)
					const popups = res?.popups || false

					if (html) {
						el.insertAdjacentHTML('afterend', html)
					}

					if (popups) {
						// Add popups HTML at the end of the body (@since 1.7.1)
						document.body.insertAdjacentHTML('beforeend', popups)
					}

					if (styles) {
						// Add the page styles at the end of body
						document.body.insertAdjacentHTML('beforeend', styles)
					}

					// Update Page on query info
					window.bricksData.queryLoopInstances[queryElementId].page = page
				}

				// Reset isLoading flag
				window.bricksData.queryLoopInstances[queryElementId].isLoading = 0

				resolve({ page, maxPages })

				setTimeout(() => {
					// Set the new query trail (Posts element)
					if (queryInfo.isPostsElement) {
						newQueryTrail =
							el.parentNode.querySelector('.bricks-isotope-sizer').previousElementSibling
					}

					// Query Loop, @since 1.7.1 - exclude popup elements from the query trail
					else {
						newQueryTrail = Array.from(
							document.querySelectorAll(`.brxe-${queryElementId}:not(.brx-popup)`)
						).pop()
					}

					// Emit event
					document.dispatchEvent(
						new CustomEvent('bricks/ajax/load_page/completed', {
							detail: { queryTrailElement: newQueryTrail, queryId: queryElementId }
						})
					)

					// Is infinite scroll?
					if (queryInfo.infiniteScroll) {
						newQueryTrail.dataset.queryElementId = queryElementId

						// Check if the query trail is still visible, if yes, triggers the next page
						if (BricksIsInViewport(newQueryTrail)) {
							bricksQueryLoadPage(newQueryTrail)
						}

						// Add a new observer
						else {
							new BricksIntersect({
								element: newQueryTrail,
								callback: (el) => bricksQueryLoadPage(el),
								once: true,
								rootMargin: queryInfo.observerMargin
							})
						}
					}
				}, 250)
			}
		}

		xhr.send(JSON.stringify(queryData))
	})
}

/**
 * Bricks query pagination elements (AJAX)
 *
 * @since 1.5
 */
const bricksQueryPaginationFn = new BricksFunction({
	parentNode: document,
	selector: '.brx-ajax-pagination a',
	subscribeEvents: ['bricks/ajax/pagination/completed'],
	eachElement: (el) => {
		if (!el.dataset?.ajaxPagination) {
			el.dataset.ajaxPagination = 1
			el.addEventListener('click', function (e) {
				const targetEl = e.currentTarget
				const href = targetEl.getAttribute('href')
				const targetPaginationEl = targetEl.closest('.brx-ajax-pagination')
				const queryId = targetPaginationEl?.dataset?.queryElementId

				// Check if there is any element
				const firstLoopElement = document.querySelector(`.brxe-${queryId}`)

				if (!firstLoopElement) {
					return
				}

				e.preventDefault()

				let xhr = new XMLHttpRequest()
				xhr.open('GET', href, true)
				xhr.responseType = 'document'

				xhr.onload = function () {
					if (this.readyState === XMLHttpRequest.DONE) {
						var status = this.status

						// Success
						if (status === 0 || (status >= 200 && status < 400)) {
							const response = this.responseXML

							const loopWrapper = firstLoopElement.parentNode

							// Add a marker in the DOM so we know where to add the new looped elements
							const listPlaceholder = document.createElement('div')
							listPlaceholder.style.display = 'none'

							// Insert the list placeholder before the first loop element
							firstLoopElement.insertAdjacentElement('beforebegin', listPlaceholder)

							// Remove old page elements, @since 1.7.1 - exclude popup elements
							const oldLoopNodes = loopWrapper.querySelectorAll(`.brxe-${queryId}:not(.brx-popup)`)
							oldLoopNodes.forEach((el) => el.remove())

							// Add new page elements, @since 1.7.1 - exclude popup elements
							const newLoopNodes = response.querySelectorAll(`.brxe-${queryId}:not(.brx-popup)`)
							newLoopNodes.forEach((el) => listPlaceholder.insertAdjacentElement('beforebegin', el))

							// Remove marker
							listPlaceholder.remove()

							// @since 1.7.1 - Remove old query looping popup elements
							const oldLoopPopupNodes = document.querySelectorAll(
								`.brx-popup[data-popup-loop="${queryId}"]`
							)
							oldLoopPopupNodes.forEach((el) => el.remove())

							// @since 1.7.1 - Add new query looping popup elements before body end
							const newLoopPopupNodes = response.querySelectorAll(
								`.brx-popup[data-popup-loop="${queryId}"]`
							)

							newLoopPopupNodes.forEach((el) =>
								document.body.insertAdjacentElement('beforeend', el)
							)

							// Replace #bricks-frontend-inline-inline-css - support looping dynamic styles (@since 1.8)
							const newInlineStyle = response.querySelector('#bricks-frontend-inline-inline-css')
							const oldInlineStyle = document.querySelector('#bricks-frontend-inline-inline-css')
							if (oldInlineStyle && newInlineStyle) {
								oldInlineStyle.replaceWith(newInlineStyle)
							}

							// Replace #bricks-dynamic-data-inline-css - support looping dynamic styles (@since 1.8)
							// Use for AJAX pagination
							const newDynamicStyle = response.querySelector('#bricks-dynamic-data-inline-css')
							const oldDynamicStyle = document.querySelector('#bricks-dynamic-data-inline-css')
							if (oldDynamicStyle && newDynamicStyle) {
								oldDynamicStyle.replaceWith(newDynamicStyle)
							}

							// Replace the pagination element
							const sourcePagination = response.querySelector(
								`.brx-ajax-pagination[data-query-element-id="${queryId}"]`
							)
							targetPaginationEl.replaceWith(sourcePagination)

							// @since 1.8 - Emit event
							document.dispatchEvent(
								new CustomEvent('bricks/ajax/pagination/completed', { detail: { queryId } })
							)

							// Update the history
							window.history.pushState({}, '', href)
						}
					}
				}

				// targetQueryTrailEl.classList.add('is-loading')

				xhr.send()
			})
		}
	}
})

function bricksQueryPagination() {
	bricksQueryPaginationFn.run()
}

function bricksStickyHeader() {
	let stickHeaderEl = document.querySelector('#brx-header.sticky')

	if (!stickHeaderEl) {
		return
	}

	let logo = document.querySelector('.bricks-site-logo')
	let logoDefault
	let logoInverse
	let lastScrolled = -1 // -1 to make sure that the first time bricksStickyHeaderOnScroll() runs it doesn't slide up
	let headerSlideUpAfter = stickHeaderEl.hasAttribute('data-slide-up-after')
		? stickHeaderEl.getAttribute('data-slide-up-after')
		: 0

	if (logo) {
		logoDefault = logo.getAttribute('data-bricks-logo')
		logoInverse = logo.getAttribute('data-bricks-logo-inverse')
	}

	const bricksStickyHeaderOnScroll = () => {
		let scrolled = window.pageYOffset

		if (scrolled > 0) {
			stickHeaderEl.classList.add('scrolling')

			if (logo && logoInverse && logo.src !== logoInverse) {
				logo.src = logoInverse
				logo.srcset = ''
			}
		} else {
			stickHeaderEl.classList.remove('scrolling')

			if (logo && logoDefault && logo.src !== logoDefault) {
				logo.src = logoDefault
			}
		}

		// Slide up
		if (headerSlideUpAfter) {
			if (scrolled > lastScrolled && lastScrolled >= 0) {
				// Scolling down
				if (scrolled > headerSlideUpAfter) {
					stickHeaderEl.classList.add('slide-up')
				}
			} else {
				// Scrolling up
				stickHeaderEl.classList.remove('slide-up')
			}
		}

		lastScrolled = scrolled
	}

	// Set sticky header logo inverse & slide up
	window.addEventListener('scroll', bricksStickyHeaderOnScroll)

	// Run it once on page load to set the .scrolling class if page is aready scrolled down
	bricksStickyHeaderOnScroll()
}

/**
 * Frontend: One Page Navigation (in builder via dynamic Vue component)
 */
function bricksOnePageNavigation() {
	let onePageNavigationWrapper = document.getElementById('bricks-one-page-navigation')

	if (!bricksIsFrontend || !onePageNavigationWrapper) {
		return
	}

	let rootElements = bricksQuerySelectorAll(document, '#brx-content > *')
	let elementIds = []
	let elementId = ''
	let onePageLink = ''
	let onePageItem = ''

	if (!rootElements) {
		return
	}

	rootElements.forEach((element) => {
		elementId = element.getAttribute('id')

		if (!elementId) {
			return
		}

		elementIds.push(elementId)
		onePageItem = document.createElement('li')
		onePageLink = document.createElement('a')
		onePageLink.classList.add(`bricks-one-page-${elementId}`)
		onePageLink.setAttribute('href', `#${elementId}`)

		onePageItem.appendChild(onePageLink)
		onePageNavigationWrapper.appendChild(onePageItem)
	})

	function onePageScroll() {
		let scrolled = window.scrollY

		elementIds.forEach((elementId) => {
			let element = document.getElementById(elementId)
			let elementTop = element.offsetTop
			let elementBottom = elementTop + element.offsetHeight

			if (scrolled >= elementTop - 1 && scrolled < elementBottom - 1) {
				document.querySelector(`.bricks-one-page-${elementId}`).classList.add('active')
			} else {
				document.querySelector(`.bricks-one-page-${elementId}`).classList.remove('active')
			}
		})
	}

	// Add load, resize, scroll event listeners
	window.addEventListener('load', onePageScroll)
	window.addEventListener('resize', onePageScroll)
	document.addEventListener('scroll', onePageScroll)
}

/**
 * Search element: Toggle overlay search
 */
function bricksSearchToggle() {
	let searchElements = bricksQuerySelectorAll(document, '.brxe-search')

	searchElements.forEach((searchElement) => {
		let toggle = searchElement.querySelector('.toggle')
		let overlay = searchElement.querySelector('.bricks-search-overlay')

		if (!toggle || !overlay) {
			return
		}

		let searchInputOrIcon = overlay.previousElementSibling

		document.addEventListener('keyup', (e) => {
			if (e.key === 'Escape') {
				// Close search overlay on ESC key if visible (offsetParent not working on fixed positioned node)
				let overlayStyles = window.getComputedStyle(overlay)

				if (overlayStyles.visibility === 'visible') {
					overlay.classList.remove('show')
					searchInputOrIcon.focus()
					searchInputOrIcon.setAttribute('aria-expanded', false)
				}
			}
		})

		toggle.addEventListener('click', () => {
			overlay.classList.toggle('show')

			toggle.setAttribute('aria-expanded', toggle.getAttribute('aria-expanded') === 'false')

			setTimeout(() => {
				searchElement.querySelector('input[type=search]').focus()
			}, 200)
		})

		overlay.querySelector('.close').addEventListener('click', () => {
			overlay.classList.remove('show')
			searchInputOrIcon.focus()
			searchInputOrIcon.setAttribute('aria-expanded', false)
		})
	})
}

/**
 * Dismiss alert element
 */
const bricksAlertDismissFn = new BricksFunction({
	parentNode: document,
	selector: '.brxe-alert svg',
	subscribeEvents: ['bricks/ajax/pagination/completed', 'bricks/ajax/load_page/completed'],
	eachElement: (dismissable) => {
		dismissable.addEventListener('click', () => {
			let alertEl = dismissable.closest('.brxe-alert')
			alertEl.remove()
		})
	}
})

function bricksAlertDismiss() {
	bricksAlertDismissFn.run()
}

/**
 * Element: Tabs
 */
const bricksTabsFn = new BricksFunction({
	parentNode: document,
	selector: '.brxe-tabs, .brxe-tabs-nested',
	subscribeEvents: ['bricks/ajax/pagination/completed', 'bricks/ajax/load_page/completed'],
	eachElement: (tabElement) => {
<<<<<<< HEAD
		let tabMenu = tabElement.querySelector('.tab-menu')
		let tabContent = tabElement.querySelector('.tab-content')

		if (!tabMenu || !tabContent) {
			return
		}

		let titles = Array.from(tabMenu.children)
		let panes = Array.from(tabContent.children)

		titles.forEach((title, index) => {
			// Set first title to open
			if (index === 0) {
				title.classList.add('brx-open')
			}

			// Set first content to open
			panes.forEach((content, index) => {
				if (index === 0) {
					content.classList.add('brx-open')
				}
			})

=======
		let titles = bricksQuerySelectorAll(tabElement, '.tab-title')
		let openAnchorId = tabElement.dataset.scriptArgs?.includes('openAnchorId')
		let hash = window.location.hash ? window.location.hash : ''
		let activeIndex = 0

		titles.forEach((title, index) => {
			let anchorId = title.dataset.anchorId ? `#${title.dataset.anchorId}` : ''
>>>>>>> improve/#862jy7jtk-open-tabs-or-accordion-via-anchor-link
			// Create tab title click listener
			title.addEventListener('click', () => {
				titles.forEach((t, i) => {
					// Add .brx-open to tab title
					if (i === index) {
						title.classList.add('brx-open')
					}

					// Remove .brx-open from other title
					else {
						t.classList.remove('brx-open')
					}
				})

				panes.forEach((pane, i) => {
					// Add .brx-open to tab content
					if (i === index) {
						pane.classList.add('brx-open')
					}

					// Remove .brx-open from other conten
					else {
						pane.classList.remove('brx-open')
					}
				})

				// Update URL hash (@since 1.8.2)
				if (anchorId) {
					window.location.hash = anchorId
				} else {
					// Remove hash from URL
					history.pushState('', document.title, window.location.pathname + window.location.search)
				}
			})
		})

		// URL hash & openAnchorId found
		if (hash && openAnchorId) {
			// Get the index of the tab title that matches the hash
			let tempIndex = titles.findIndex((x) => x.dataset.anchorId === hash.replace('#', ''))
			activeIndex = tempIndex !== -1 ? tempIndex : 0
		}

		// Set title to open
		if (titles[activeIndex]) {
			titles[activeIndex].classList.add('brx-open')
		}

		let panes = bricksQuerySelectorAll(tabElement, '.tab-pane')

		// Set content to open
		if (panes[activeIndex]) {
			panes[activeIndex].classList.add('brx-open')
		}
	}
})

function bricksTabs() {
	bricksTabsFn.run()
}

/**
 * Element - Video: Play video on overlay, icon click or thumbnail preview click
 */
const bricksVideoOverlayClickDetectorFn = new BricksFunction({
	parentNode: document,
	selector: '.bricks-video-overlay, .bricks-video-overlay-icon, .bricks-video-preview-image',
	subscribeEvents: ['bricks/ajax/pagination/completed', 'bricks/ajax/load_page/completed'],
	frontEndOnly: true,
	eachElement: (overlay) => {
		overlay.addEventListener('click', (e) => {
			let videoWrapper = e.target.closest('.brxe-video')

			if (!videoWrapper) {
				return
			}

			// STEP: Convert thumbnail preview into iframe

			// Get thumbnail preview element
			const thumbnailPreviewElement = videoWrapper.querySelector('.bricks-video-preview-image')

			if (thumbnailPreviewElement) {
				// Convert thumbnail preview into iframe together with all attributes (youtube/vimeo)
				const iframeElement = document.createElement('iframe')
				const attributes = [...thumbnailPreviewElement.attributes]
				attributes.forEach((attr) => {
					// Skip the class attribute and style attribute
					if (attr.name === 'class' || attr.name === 'style') {
						return
					}

					// Change the data-src attribute to src
					if (attr.name === 'data-iframe-src') {
						iframeElement.setAttribute('src', attr.value)
						return
					}

					// Add all other attributes to the iframe element
					iframeElement.setAttribute(attr.name, attr.value)
				})

				thumbnailPreviewElement.replaceWith(iframeElement)
			}

			// STEP: Start iframe/video

			// Get iframe element (video type: YouTube, Vimeo)
			const iframeElement = videoWrapper.querySelector('iframe')

			if (iframeElement && iframeElement.getAttribute('src')) {
				iframeElement.src += '&autoplay=1'
			}

			// Get <video> element (video type: media, file URL)
			const videoElement = videoWrapper.querySelector('video')

			if (videoElement) {
				videoElement.play()
			}
		})
	}
})
function bricksVideoOverlayClickDetector() {
	bricksVideoOverlayClickDetectorFn.run()
}

/**
 * Background video (supported: YouTube and file URLs)
 */
const bricksBackgroundVideoInitFn = new BricksFunction({
	parentNode: document,
	selector: '.bricks-background-video-wrapper',
	subscribeEvents: ['bricks/ajax/pagination/completed', 'bricks/ajax/load_page/completed'],
	forceReinit: (element, index) => {
		// Builder: Force reinit as the URL parameter is not yet set (@since 1.8)
		return !bricksIsFrontend
	},
	eachElement: (videoWrapper) => {
		if (videoWrapper.classList.contains('loaded')) {
			return
		}

		let videoId
		let videoUrl = videoWrapper.getAttribute('data-background-video-url')

		// Return: No videoUrl provided
		if (!videoUrl) {
			return
		}

		/**
		 * STEP: Start playing video on breakpoint and up
		 *
		 * Setting 'videoPlayBreakpoint' stored in data attribute 'data-background-video-show-at-breakpoint'.
		 *
		 * @since 1.8.5
		 */
		let videoPlayBreakpoint = parseInt(
			videoWrapper.getAttribute('data-background-video-show-at-breakpoint')
		)

		// Return: Viewport width is smaller than breakpoint width
		if (videoPlayBreakpoint && window.innerWidth < videoPlayBreakpoint) {
			return
		}

		let videoScale = videoWrapper.getAttribute('data-background-video-scale')
		let videoAspectRatio = videoWrapper.getAttribute('data-background-video-ratio') || '16:9'
		let videoAspectRatioX = parseInt(videoAspectRatio.split(':')[0] || 16)
		let videoAspectRatioY = parseInt(videoAspectRatio.split(':')[1] || 9)

		let startTime = parseInt(videoWrapper.getAttribute('data-background-video-start')) || 0
		let endTime = parseInt(videoWrapper.getAttribute('data-background-video-end')) || 0
		let videoLoop = videoWrapper.getAttribute('data-background-video-loop') == 1

		// End time must be greater than start time: If not, don't use it
		if (endTime < startTime) {
			endTime = 0
		}

		let isIframe = false // YouTube and Vimeo iframe embed
		let isYoutube = false
		let isVimeo = false

		/**
		 * YouTube embed
		 *
		 * NOTE: Error "Failed to execute 'postMessage' on 'DOMWindow'" when origin is not HTTPS
		 *
		 * Adding 'host' or 'origin' does not fix this error.
		 */
		if (videoUrl.indexOf('youtube.com') !== -1) {
			isIframe = true
			isYoutube = true

			if (videoUrl.indexOf('watch?v=') !== -1) {
				let videoIdIndex = videoUrl.lastIndexOf('=')
				videoId = videoUrl.slice(videoIdIndex + 1)
			} else if (videoUrl.indexOf('embed/') !== -1) {
				let videoIdIndex = videoUrl.lastIndexOf('/')
				videoId = videoUrl.slice(videoIdIndex + 1)
			}

			// Transform YouTube video URL into valid embed URL
			videoUrl = videoUrl.replace('watch?v=', 'embed/')
		}

		/**
		 * Vimeo embed
		 *
		 * https://help.vimeo.com/hc/en-us/articles/360001494447-Using-Player-Parameters
		 */
		if (videoUrl.indexOf('vimeo.com') !== -1) {
			isIframe = true
			isVimeo = true

			// Transform Vimeo video URL into valid embed URL
			if (videoUrl.indexOf('player.vimeo.com/video') === -1) {
				videoUrl = videoUrl.replace('vimeo.com', 'player.vimeo.com/video')
			}
		}

		let videoElement

		// STEP: YouTuvbe and Vimeo <iframe> embed
		if (isIframe) {
			if (isYoutube) {
				// Check if YouTube API script is already added
				if (!document.querySelector('script[src="https://www.youtube.com/iframe_api"]')) {
					// Create script tag for YouTube IFrame API
					let tag = document.createElement('script')

					// Set source to YouTube IFrame API URL
					tag.src = 'https://www.youtube.com/iframe_api'

					// Find the first script tag on your page
					let firstScriptTag = document.getElementsByTagName('script')[0]

					// Insert new script tag before the first script tag
					firstScriptTag.parentNode.insertBefore(tag, firstScriptTag)
				}

				videoElement = document.createElement('div')

				// Remove <video> element (present in the DOM due to Chrome compatibility)
				if (bricksIsFrontend && videoWrapper.querySelector('video')) {
					videoWrapper.removeChild(videoWrapper.querySelector('video'))
				}

				// Append videoElement to the videoWrapper before initializing the player
				videoWrapper.appendChild(videoElement)

				// Wait for YouTube IFrame Player API to load
				let playerCheckInterval = setInterval(function () {
					if (window.YT && YT.Player) {
						clearInterval(playerCheckInterval)

						let player = new YT.Player(videoElement, {
							width: '640',
							height: '360',
							videoId: videoId,
							playerVars: {
								autoplay: 1,
								controls: 0,
								start: startTime || undefined,
								// end: endTime || undefined, // Check endTime manually below to pause video instead of stopping it
								mute: 1,
								rel: 0,
								showinfo: 0,
								modestbranding: 1,
								cc_load_policy: 0,
								iv_load_policy: 3,
								autohide: 0,
								loop: 0, // Handle loop manually below according to startTime & endTime
								playlist: videoId,
								enablejsapi: 1
							},
							events: {
								onReady: function (event) {
									// Check every second if video endTime is reached
									if (endTime) {
										let endTimeCheckInterval = setInterval(function () {
											if (player.getCurrentTime() >= endTime) {
												// Loop or pause video
												if (videoLoop) {
													player.seekTo(startTime || 0, true)
												} else {
													player.pauseVideo()
													clearInterval(endTimeCheckInterval)
												}
											}
										}, 1000)
									}
								},

								onStateChange: function (event) {
									if (videoLoop) {
										// Video ended naturally: Restart at start time
										if (event.data == YT.PlayerState.ENDED) {
											player.seekTo(startTime || 0, true)
										}
									}
								}
							}
						})
					}
				}, 100)
			}

			if (isVimeo) {
				// Check if Vimeo Player API script is already added
				if (!document.querySelector('script[src="https://player.vimeo.com/api/player.js"]')) {
					// STEP: Create script tag for Vimeo Player API
					let tag = document.createElement('script')

					// Set source to Vimeo Player API URL
					tag.src = 'https://player.vimeo.com/api/player.js'

					// Find the first script tag on page
					let firstScriptTag = document.getElementsByTagName('script')[0]

					// Insert new script tag before the first script tag
					firstScriptTag.parentNode.insertBefore(tag, firstScriptTag)
				}

				// Remove <video> element (present in the DOM due to Chrome compatibility)
				if (bricksIsFrontend && videoWrapper.querySelector('video')) {
					videoWrapper.removeChild(videoWrapper.querySelector('video'))
				}

				// Create a div for the Vimeo player
				videoElement = document.createElement('div')

				// Append videoElement to the videoWrapper before initializing the player
				videoWrapper.appendChild(videoElement)

				// Extract Vimeo video ID
				const vimeoVideoId = videoUrl.split('/').pop()

				// Wait for Vimeo Player API to load
				let playerCheckInterval = setInterval(function () {
					if (window.Vimeo && Vimeo.Player) {
						clearInterval(playerCheckInterval)

						// STEP: Initialize new Vimeo Player
						let player = new Vimeo.Player(videoElement, {
							id: vimeoVideoId,
							width: 640,
							autoplay: true,
							controls: false,
							background: true,
							loop: videoLoop && !startTime // Handle loop manually if startTime set (as loop set to true always starts video at 0 sec)
						})

						// Player is loaded: Start the video at the startTime
						if (startTime) {
							player.on('loaded', function () {
								player.setCurrentTime(startTime)
							})
						}

						// EndTime reached: Pause or loop video
						if (endTime) {
							player.on('timeupdate', function (data) {
								if (data.seconds >= endTime) {
									if (videoLoop) {
										player.setCurrentTime(startTime || 0)
										player.play()
									} else {
										player.pause()
									}
								}
							})
						}

						// End of video reached
						player.on('ended', () => {
							// Restart video at startTime
							if (videoLoop) {
								player.setCurrentTime(startTime || 0).then(function (seconds) {
									player.play()
								})
							}
						})
					}
				}, 100)
			}
		}

		// STEP: Get the <video> element (present in the DOM due to Chrome compatibility)
		else {
			videoElement = videoWrapper.querySelector('video')

			if (videoElement) {
				let elementId = videoElement.closest('[data-script-id]')?.getAttribute('data-script-id')

				// Play once: Remove 'loop' attribute
				if (!videoLoop) {
					videoElement.removeAttribute('loop')
				} else if (!videoElement.hasAttribute('loop')) {
					videoElement.setAttribute('loop', '')
				}

				// Re-init startTime in builder
				if (!bricksIsFrontend) {
					videoElement.currentTime = startTime || 0
				}

				if (!window.bricksData.videoInstances?.[elementId]) {
					window.bricksData.videoInstances[elementId] = {}
				}

				// Store on window to update in builder :)
				window.bricksData.videoInstances[elementId].startTime = startTime
				window.bricksData.videoInstances[elementId].endTime = endTime
				window.bricksData.videoInstances[elementId].videoLoop = videoLoop

				// Set custom start time & play video
				let loadedmetadata = function () {
					if (window.bricksData.videoInstances[elementId].startTime) {
						this.currentTime = window.bricksData.videoInstances[elementId].startTime
						this.play()
					}
				}

				// Current playback time is greater than or equal to end time OR video duration
				let timeupdate = function () {
					// NOTE: media controller position changes ever 15 to 250ms (we use 250ms)
					if (
						this.currentTime >=
						(window.bricksData.videoInstances[elementId].endTime || this.duration) - 0.25
					) {
						// Loop disabled: Pause video
						if (window.bricksData.videoInstances[elementId].videoLoop) {
							// Reset to start time
							this.currentTime = window.bricksData.videoInstances[elementId].startTime

							// Video is not playing: Play it
							if (videoElement.paused) {
								this.play()
							}
						} else {
							this.pause()
						}
					}
				}

				// Set custom start time & play video
				let ended = function () {
					if (
						window.bricksData.videoInstances[elementId].videoLoop &&
						window.bricksData.videoInstances[elementId].startTime
					) {
						this.currentTime = window.bricksData.videoInstances[elementId].startTime
						this.play()
					}
				}

				/**
				 * Custom start and/or end time set
				 *
				 * Add event listeners to the video element (if not already added; check via .listening class)
				 */
				if (!videoElement.classList.contains('listening') && (startTime || endTime)) {
					videoElement.classList.add('listening')

					videoElement.addEventListener('loadedmetadata', loadedmetadata)
					videoElement.addEventListener('timeupdate', timeupdate)
					videoElement.addEventListener('ended', ended)
				}
			}
		}

		if (videoScale) {
			videoElement.style.transform = `translate(-50%, -50%) scale(${videoScale})`
		}

		// STEP: Lazy load video (frontend only)
		if (bricksIsFrontend) {
			if (videoWrapper.classList.contains('bricks-lazy-video')) {
				new BricksIntersect({
					element: videoWrapper,
					callback: (el) => {
						el.classList.remove('bricks-lazy-video')

						if (isIframe) {
							el.appendChild(videoElement)
						} else {
							videoElement.src = videoUrl
						}
					}
				})
			}
		} else {
			if (isIframe) {
				videoWrapper.appendChild(videoElement)
			} else {
				videoElement.src = videoUrl
			}
		}

		videoWrapper.classList.add('loaded')

		let resizeObserver = new ResizeObserver((entries) => {
			for (let entry of entries) {
				let videoWidth

				if (entry.contentBoxSize) {
					// Firefox implements `contentBoxSize` as a single content rect, rather than an array
					let contentBoxSize = Array.isArray(entry.contentBoxSize)
						? entry.contentBoxSize[0]
						: entry.contentBoxSize
					videoWidth = contentBoxSize.inlineSize
				} else {
					videoWidth = entry.contentRect.width
				}

				let elementHeight = videoWrapper.clientHeight

				let videoHeight = (videoWidth * videoAspectRatioY) / videoAspectRatioX

				if (videoHeight < elementHeight) {
					videoHeight = elementHeight
					videoWidth = (elementHeight * videoAspectRatioX) / videoAspectRatioY
				}

				videoElement.style.width = `${videoWidth}px`
				videoElement.style.height = `${videoHeight}px`
			}
		})

		resizeObserver.observe(videoWrapper)
	}
})

function bricksBackgroundVideoInit() {
	bricksBackgroundVideoInitFn.run()
}

/**
 * Photoswipe 5 lightbox
 *
 * For accessibility reasons the <a> is required by default: https://photoswipe.com/getting-started/#required-html-markup
 * If you want to use different markup there is a domItemData filter: https://photoswipe.com/data-sources/#custom-html-markup
 *
 * @since 1.8
 */
const bricksPhotoswipeFn = new BricksFunction({
	parentNode: document,
	selector: '.bricks-lightbox',
	windowVariableCheck: ['PhotoSwipeLightbox'],
	eachElement: (lightboxElement) => {
		let gallery = lightboxElement
		let children = lightboxElement.tagName === 'A' ? '' : 'a'
		let lightboxId = lightboxElement.getAttribute('data-pswp-id')

		// Can be set to 'none' to avoid jumpy animation between different aspect ratios (@since 1.8.4)
		let animationType = lightboxElement.getAttribute('data-animation-type') || 'zoom'

		// Get all lightbox elements with the same ID (@since 1.7.2)
		if (lightboxId) {
			children = bricksQuerySelectorAll(document, `[data-pswp-id="${lightboxId}"]`)
		}

		// https://photoswipe.com/styling/
		let closeSVG =
			'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>'

		let options = {
			mainClass: 'brx', // To distinguish from Photoswipe 4 (used on single product page by Woo core)
			gallery: gallery,
			counter: !gallery.classList.contains('brxe-carousel'), // Hide wrong carousel count for carousel loop (due to swiperJS-generated slide duplicates)
			children: children,
			pswpModule: PhotoSwipe5,
			closeSVG: closeSVG,
			showHideAnimationType: animationType
		}

		const lightbox = new PhotoSwipeLightbox(options)

		/**
		 * Lightbox video (not supported in Photoswipe natively)
		 *
		 * Supported units: px, %, vw, vh
		 *
		 * Generate HTML for YouTube, Vimeo, and <video> embeds.
		 *
		 * https://photoswipe.com/data-sources/
		 */
		lightbox.on('itemData', (e) => {
			let photoswipeInitialised = document.querySelector('.pswp__container')
			let videoUrl = lightboxElement.getAttribute('data-pswp-video-url')
			let width = lightboxElement.getAttribute('data-pswp-width')
			let height = lightboxElement.getAttribute('data-pswp-height')

			// width in '%' or 'vh'
			if (width && (width.includes('%') || width.includes('vw'))) {
				width = window.innerWidth * (parseInt(width) / 100)
			}

			// height in '%' or 'vw'
			if (height && (height.includes('%') || height.includes('vh'))) {
				height = window.innerHeight * (parseInt(height) / 100)
			}

			// Default width: 1280px
			if (!width) {
				width = 1280
			}

			// Auto-height (16:9)
			if (!height || height == 720) {
				height = Math.round((width / 16) * 9)
			}

			if (!photoswipeInitialised && videoUrl) {
				let html = bricksGetLightboxVideoNode(videoUrl)

				e.itemData = {
					html: html.outerHTML, // Convert DOM node to HTML string
					width: width,
					height: height
				}
			}
		})

		// Content added to the DOM: Autoplay <video> after lightbox is opened
		lightbox.on('contentAppend', ({ content }) => {
			if (content.element) {
				let photoswipeVideo = content.element.querySelector('video')

				if (photoswipeVideo) {
					photoswipeVideo.play()
				}
			}
		})

		// Fix 'loop' type carousel element requires double clicks on last slide (due to swiperJS-generated slide duplicates)
		if (gallery.classList.contains('brxe-carousel')) {
			let swiperId = gallery.getAttribute('data-script-id')

			// Correct the number of items as swiperJS duplicates slides with 'loop' setting enabled
			if (bricksData.swiperInstances?.[swiperId]?.loopedSlides) {
				// https://photoswipe.com/filters/#numitems
				lightbox.addFilter('numItems', (numItems, dataSource) => {
					// Lightbox has no children: Return original numItems
					if (dataSource.gallery) {
						let duplicateSlides = 0

						if (dataSource.gallery.classList.contains('brxe-carousel')) {
							// Carousel
							duplicateSlides =
								dataSource.gallery.querySelectorAll('.swiper-slide-duplicate').length
						}
						// Something wrong if duplicateSlides more than original numItems, so return original numItems
						numItems = numItems > duplicateSlides ? numItems - duplicateSlides : numItems
					}

					return numItems
				})

				// Modify 'clickedIndex' as 'numItems' has been modified
				lightbox.addFilter('clickedIndex', (clickedIndex, e) => {
					let currentSlide = e.target.closest('.swiper-slide')

					if (currentSlide) {
						// Store all slides in an array
						let tempArr = bricksData.swiperInstances[swiperId].slides
							.map((slide, index) => {
								return { slide, index }
							})
							.filter(Boolean)

						if (tempArr.length) {
							// Current clicked swiper slide index from data-swiper-slide-index attribute
							let currentSwiperSlideIndex = parseInt(currentSlide.dataset.swiperSlideIndex)

							// Find first result whehre data-swiper-slide-index is equal to currentSlideIndex as numItems changed
							let simulateSlide = tempArr.filter(
								(x) => x.slide.dataset.swiperSlideIndex == currentSwiperSlideIndex
							)

							if (simulateSlide.length) {
								// Get the index of the first result
								clickedIndex = simulateSlide[0].index
							}
						}
					}

					return clickedIndex
				})
			}
		}

		lightbox.init()
	}
})

function bricksPhotoswipe() {
	bricksPhotoswipeFn.run()
}

/**
 * Return iframe or video DOM node for lightbox video
 *
 * @param {string} videoUrl
 *
 * @returns iframe or video DOM node
 *
 * @since 1.7.2
 */
function bricksGetLightboxVideoNode(videoUrl) {
	if (videoUrl) {
		hasContent = true

		let isIframe = false // For YouTube and Vimeo embeds

		if (videoUrl.indexOf('youtube.com') !== -1) {
			isIframe = true

			// Transform YouTube video URL into valid embed URL
			videoUrl = videoUrl.replace('watch?v=', 'embed/')

			videoUrl += '?autoplay=1'
			videoUrl += '&rel=0'
		}

		if (videoUrl.indexOf('vimeo.com') !== -1) {
			isIframe = true

			// Transform Vimeo video URL into valid embed URL
			if (videoUrl.indexOf('player.vimeo.com/video') === -1) {
				videoUrl = videoUrl.replace('vimeo.com', 'player.vimeo.com/video')
			}

			videoUrl += '?autoplay=1'
		}

		if (isIframe) {
			// Create <iframe> for YouTube/Vimeo video
			let iframeElement = document.createElement('iframe')

			iframeElement.setAttribute('src', videoUrl)
			iframeElement.setAttribute('allow', 'autoplay')
			iframeElement.setAttribute('allowfullscreen', 1)

			return iframeElement
		}

		// Create <video> element (trigger autoplay in Photoswipe)
		let videoElement = document.createElement('video')
		videoElement.setAttribute('src', videoUrl)
		videoElement.setAttribute('controls', 1)
		videoElement.setAttribute('playsinline', 1)

		return videoElement
	}
}

/**
 * Element: Accordion
 */
const bricksAccordionFn = new BricksFunction({
	parentNode: document,
	selector: '.brxe-accordion, .brxe-accordion-nested',
	eachElement: (accordion) => {
		let slideUp = (target, duration = 200) => {
			target.style.transitionProperty = 'height, margin, padding'
			target.style.transitionDuration = `${duration}ms`
			target.style.height = `${target.offsetHeight}px`
			target.offsetHeight
			target.style.overflow = 'hidden'
			target.style.height = 0
			target.style.paddingTop = 0
			target.style.paddingBottom = 0
			target.style.marginTop = 0
			target.style.marginBottom = 0

			// Get the accordion item, target is the .accordion-content-wrapper
			let item = target.parentNode

			window.setTimeout(() => {
				target.style.display = 'none'
				target.style.removeProperty('height')
				target.style.removeProperty('padding-top')
				target.style.removeProperty('padding-bottom')
				target.style.removeProperty('margin-top')
				target.style.removeProperty('margin-bottom')
				target.style.removeProperty('overflow')
				target.style.removeProperty('transition-duration')
				target.style.removeProperty('transition-property')

				item.classList.remove('brx-open')
			}, duration)
		}

		let slideDown = (target, duration = 200) => {
			target.style.removeProperty('display')

			let display = window.getComputedStyle(target).display

			if (display === 'none') {
				display = 'block'
			}

			target.style.display = display

			let height = target.offsetHeight

			target.style.overflow = 'hidden'
			target.style.height = 0
			target.style.paddingTop = 0
			target.style.paddingBottom = 0
			target.style.marginTop = 0
			target.style.marginBottom = 0
			target.offsetHeight
			target.style.transitionProperty = 'height, margin, padding'
			target.style.transitionDuration = `${duration}ms`
			target.style.height = `${height}px`
			target.style.removeProperty('padding-top')
			target.style.removeProperty('padding-bottom')
			target.style.removeProperty('margin-top')
			target.style.removeProperty('margin-bottom')

			// Get the accordion item, target is the .accordion-content-wrapper
			let item = target.parentNode

			window.setTimeout(() => {
				target.style.removeProperty('height')
				target.style.removeProperty('overflow')
				target.style.removeProperty('transition-duration')
				target.style.removeProperty('transition-property')

				item.classList.add('brx-open')
			}, duration)
		}

		let slideToggle = (target, duration = 200) => {
			if (window.getComputedStyle(target).display === 'none') {
				return slideDown(target, duration)
			} else {
				return slideUp(target, duration)
			}
		}

		let items = Array.from(accordion.children)
		let duration = accordion.hasAttribute('data-transition')
			? isNaN(accordion.dataset.transition)
				? 0
				: accordion.dataset.transition
			: 200
		let expandFirstItem = accordion.dataset.scriptArgs?.includes('expandFirstItem')
		let expandAnchorId = accordion.dataset.scriptArgs?.includes('expandAnchorId')
		let independentToggle = accordion.dataset.scriptArgs?.includes('independentToggle')

		let hash = window.location.hash || '' // Hash with # prefix

		// Only recognise nestables as accordion items
		items = items.filter(
			(item) =>
				item.classList.contains('brxe-section') ||
				item.classList.contains('brxe-container') ||
				item.classList.contains('brxe-block') ||
				item.classList.contains('brxe-div') ||
				item.classList.contains('accordion-item')
		)

		items.forEach((item, index) => {
			// Expand first item
			if (index === 0 && expandFirstItem) {
				item.classList.add('brx-open')
			}

			// Expand anchor ID: Anchor ID matches current hash (@since 1.8.6)
			let anchorId = item.dataset.anchorId ? `#${item.dataset.anchorId}` : ''
			if (expandAnchorId && anchorId && anchorId === hash) {
				item.classList.add('brx-open')
			}

			if (item.classList.contains('listening')) {
				return
			}

			// Ensure click event listener is only added once
			item.classList.add('listening')

			/**
			 * Init title click listener
			 *
			 * Listen on accordion item also allows to re-run script in builder without having to setup any custom destroy()
			 */
			item.addEventListener('click', (e) => {
				let title = e.target.closest('.accordion-title-wrapper')

				if (!title) {
					return
				}

				let item = title.parentNode

				if (!item) {
					return
				}

				let content = item.querySelector('.accordion-content-wrapper')

				if (!content) {
					return
				}

				e.stopPropagation()

				// No independent toggle: slideUp .open item (if it's currently not open)
				if (!independentToggle) {
					let openItems = accordion.querySelectorAll('.brx-open')

					if (openItems.length) {
						openItems.forEach((openItem) => {
							let openContent = openItem.querySelector('.accordion-content-wrapper')

							if (openContent && openContent !== content) {
								slideUp(openContent, duration)
							}
						})
					}
				}

				// Check if item is currently going to be opened (must be captured before slideToggle)
				let openingItem = !item.classList.contains('brx-open')

				// Update URL hash (@since 1.8.6)
				if (anchorId && openingItem) {
					window.location.hash = anchorId
				} else {
					// Remove hash from URL
					history.pushState('', document.title, window.location.pathname + window.location.search)
				}

				// slideToggle target accordion content
				slideToggle(content, duration)
			})
		})
	}
})

function bricksAccordion() {
	bricksAccordionFn.run()
}

/**
 * Element: Animated Typing
 */
const bricksAnimatedTypingFn = new BricksFunction({
	parentNode: document,
	selector: '.brxe-animated-typing',
	windowVariableCheck: ['Typed'],
	eachElement: (element) => {
		let scriptId = element.dataset.scriptId
		let scriptArgs

		try {
			scriptArgs = JSON.parse(element.dataset.scriptArgs)
		} catch (e) {
			return false
		}

		let typedElement = element.querySelector('.typed')

		if (!typedElement) {
			return
		}

		/**
		 * Destroy typing animation
		 *
		 * @since 1.8.5: If not inside a splideJS slider (#862jz1gtn)
		 */
		if (
			window.bricksData.animatedTypingInstances[scriptId] &&
			!element.closest('.brxe-slider-nested.splide')
		) {
			window.bricksData.animatedTypingInstances[scriptId].destroy()
		}

		if (!scriptArgs.hasOwnProperty('strings') || !scriptArgs.strings) {
			return
		}

		if (Array.isArray(scriptArgs.strings) && !scriptArgs.strings.toString()) {
			return
		}

		window.bricksData.animatedTypingInstances[scriptId] = new Typed(typedElement, scriptArgs)
	}
})

function bricksAnimatedTyping() {
	bricksAnimatedTypingFn.run()
}

/**
 * Element: Audio
 */
const bricksAudioFn = new BricksFunction({
	parentNode: document,
	selector: '.brxe-audio',
	windowVariableCheck: ['MediaElementPlayer'],
	eachElement: (element) => {
		let audioElement = element.querySelector('audio')

		if (audioElement) {
			let mediaElementPlayer = new MediaElementPlayer(audioElement)
		}
	}
})
function bricksAudio() {
	bricksAudioFn.run()
}

/**
 * Element: Post Reading Time (of #brx-content text)
 *
 * @since 1.8.5
 */
const bricksPostReadingTimeFn = new BricksFunction({
	parentNode: document,
	selector: '.brxe-post-reading-time',
	eachElement: (element) => {
		let contentSelector = element.dataset.contentSelector || '.brxe-post-content'
		let content = document.querySelector(contentSelector)

		// Fallback to #brx-content
		if (!content) {
			content = document.querySelector('#brx-content')
		}

		if (!content) {
			return
		}

		let wordsPerMinute = element.getAttribute('data-wpm') || 200
		let prefix = element.getAttribute('data-prefix') || ''
		let suffix = element.getAttribute('data-suffix') || ''

		let articleText = content.textContent
		let wordCount = articleText.split(' ').length
		let readingTime = Math.ceil(wordCount / parseInt(wordsPerMinute))

		element.textContent = prefix + readingTime + suffix
	}
})

function bricksPostReadingTime() {
	bricksPostReadingTimeFn.run()
}

/**
 * Element: Countdown
 */
const bricksCountdownFn = new BricksFunction({
	parentNode: document,
	selector: '.brxe-countdown',
	eachElement: (element) => {
		// Countdown logic
		countdown = (element, settings, init) => {
			// STEP: Get timezone from settings
			let timezoneSign = settings.timezone[3] === '+' ? 1 : -1
			let timezoneHours = parseInt(settings.timezone.substring(4, 6))
			let timezoneMinutes = parseInt(settings.timezone.substring(7, 9))

			// Convert hours and minutes to minutes
			let countdownCreatorTimezone = timezoneSign * (timezoneHours * 60 + timezoneMinutes)

			// Convert timezone to milliseconds
			let countdownCreatorTimezoneMs = countdownCreatorTimezone * 60000

			// Get timezone offset of visitor in minutes
			let viewerOffsetMinutes = new Date().getTimezoneOffset()

			// Convert to millisecond and flip the sign here because getTimezoneOffset() returns the offset with an opposite sign
			let viewerOffsetMs = -viewerOffsetMinutes * 60000

			let date = settings.date.replace(' ', 'T') // Replace needed for iOS Safari (NaN)

			// Get time of the target date in milliseconds
			let targetDate = new Date(date).getTime()

			// STEP: Adjust the target date for the visitors' timezone offset and the timezone setting offset
			let targetDateAdjusted = targetDate + viewerOffsetMs - countdownCreatorTimezoneMs

			// Get current date and time in UTC milliseconds
			let now = new Date().getTime()

			// Calculate the difference in milliseconds
			let diff = targetDateAdjusted - now

			// Countdown date reached
			if (diff <= 0) {
				// Stop countdown
				clearInterval(element.dataset.bricksCountdownId)

				if (settings.action === 'hide') {
					element.innerHTML = ''
					return
				} else if (settings.action === 'text') {
					element.innerHTML = settings.actionText
					return
				}
			}

			// Add HTML nodes for each field (spans: .prefix, .format, .suffix)
			if (init) {
				// Builder: Remove HTML from previous instance
				element.innerHTML = ''

				settings.fields.forEach((field) => {
					if (!field.format) {
						return
					}

					let fieldNode = document.createElement('div')
					fieldNode.classList.add('field')

					if (field.prefix) {
						let prefixNode = document.createElement('span')
						prefixNode.classList.add('prefix')
						prefixNode.innerHTML = field.prefix
						fieldNode.appendChild(prefixNode)
					}

					let formatNode = document.createElement('span')
					formatNode.classList.add('format')
					fieldNode.appendChild(formatNode)

					if (field.suffix) {
						let suffixNode = document.createElement('span')
						suffixNode.classList.add('suffix')
						suffixNode.innerHTML = field.suffix
						fieldNode.appendChild(suffixNode)
					}

					element.appendChild(fieldNode)
				})
			}

			let fieldNodes = bricksQuerySelectorAll(element, '.field')

			let days = Math.floor(diff / (1000 * 60 * 60 * 24))
			let hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
			let minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
			let seconds = Math.floor((diff % (1000 * 60)) / 1000)

			settings.fields.forEach((field, index) => {
				if (!field.format) {
					return
				}

				let format = field.format.toLowerCase()

				// Add leading zero if format is uppercase & one digit (e.g. %D and value less than 10)

				// DAYS
				if (format.includes('%d')) {
					if (field.format.includes('%D')) {
						days <= 9 ? (days = `0${days}`) : days
					}

					fieldNodes[index].querySelector('.format').innerHTML = format.replace(
						'%d',
						diff <= 0 ? 0 : days
					)
				}

				// HOURS
				else if (format.includes('%h')) {
					if (field.format.includes('%H')) {
						hours <= 9 ? (hours = `0${hours}`) : hours
					}

					fieldNodes[index].querySelector('.format').innerHTML = format.replace(
						'%h',
						diff <= 0 ? 0 : hours
					)
				}

				// MINUTES
				else if (format.includes('%m')) {
					if (field.format.includes('%M')) {
						minutes <= 9 ? (minutes = `0${minutes}`) : minutes
					}

					fieldNodes[index].querySelector('.format').innerHTML = format.replace(
						'%m',
						diff <= 0 ? 0 : minutes
					)
				}

				// SECONDS
				else if (format.includes('%s')) {
					if (field.format.includes('%S')) {
						seconds <= 9 ? (seconds = `0${seconds}`) : seconds
					}

					fieldNodes[index].querySelector('.format').innerHTML = format.replace(
						'%s',
						diff <= 0 ? 0 : seconds
					)
				}
			})
		}

		let settings = element.dataset.bricksCountdownOptions

		try {
			settings = JSON.parse(settings)
		} catch (e) {
			return false
		}

		if (settings.hasOwnProperty('date') && settings.hasOwnProperty('fields')) {
			// Get existing countdownId
			let countdownId = element.dataset.bricksCountdownId

			// Destroy existing instance by clearing the interval
			if (countdownId) {
				clearInterval(countdownId)
			}

			// Init countdown
			countdown(element, settings, true)

			// Call countdown every second (= 1000ms)
			countdownId = setInterval(countdown, 1000, element, settings, false)

			element.dataset.bricksCountdownId = countdownId
		}
	}
})

function bricksCountdown() {
	bricksCountdownFn.run()
}

/**
 * Element: Counter
 * With custom run function, because we need to forceReinit only for counter inside popup
 */
const bricksCounterFn = new BricksFunction({
	parentNode: document,
	selector: '.brxe-counter',
	subscribeEvents: [
		'bricks/popup/open',
		'bricks/ajax/pagination/completed',
		'bricks/ajax/load_page/completed'
	],
	forceReinit: (element, index) => {
		// Force reinit if counter is inside popup
		return element.closest('.brx-popup')
	},
	eachElement: (element) => {
		let settings = element.dataset.bricksCounterOptions

		try {
			settings = JSON.parse(settings)
		} catch (e) {
			return false
		}

		let countNode = element.querySelector('.count')
		let countFrom = settings.hasOwnProperty('countFrom') ? parseInt(settings.countFrom) : 0
		let countTo = settings.hasOwnProperty('countTo') ? parseInt(settings.countTo) : 100
		let durationInMs = settings.hasOwnProperty('duration') ? parseInt(settings.duration) : 1000

		// Min. duration: 500ms
		if (durationInMs < 500) {
			durationInMs = 500
		}

		let diff = countTo - countFrom
		let timeout = durationInMs / diff
		let incrementBy = 1

		// Min. timeout: 4ms
		if (timeout < 4) {
			incrementBy = Math.ceil(4 / timeout)
			timeout = 4
		}

		// Vanilla JS countUp function
		let countUp = () => {
			// Get current count (locale string back to number)
			let count = countNode.innerText.replace(/\D/g, '')
			count = isNaN(count) ? countFrom : parseInt(count)

			// Calculate new count: Make sure we don't run over max. count
			let newCount = count + incrementBy < countTo ? count + incrementBy : countTo

			// countTo reached yet: Stop interval
			if (count >= countTo) {
				clearInterval(countNode.dataset.counterId)
				delete countNode.dataset.counterId
				return
			}

			countNode.innerText = settings.thousands ? newCount.toLocaleString() : newCount
		}

		let callback = () => {
			// Reset count
			countNode.innerText = countFrom

			// Interval not yet running: Start interval
			if (countNode.dataset.counterId == undefined) {
				countNode.dataset.counterId = setInterval(countUp, timeout)
			}
		}

		// Run countUp() when popup is open (has no .hide class)
		let popup = countNode.closest('.brx-popup')
		if (popup) {
			if (!popup.classList.contains('hide')) {
				callback()
			}
		}

		// Run countUp() when element enters viewport
		else {
			new BricksIntersect({
				element: element,
				callback: callback
			})
		}
	},
	listenerHandler: (event) => {
		if (event?.type) {
			switch (event.type) {
				case 'bricks/popup/open':
					// Change parentNode to the opened popup
					let settings = {
						parentNode: event.details?.popupElement ? event.details.popupElement : document
					}
					bricksCounterFn.run(settings)
					break
				default:
					bricksCounterFn.run()
					break
			}
		}
	}
})

function bricksCounter() {
	bricksCounterFn.run()
}

/**
 * Element: Post Table of Contents (tocbot)
 *
 * @since 1.8.5
 */
const bricksTableOfContentsFn = new BricksFunction({
	parentNode: document,
	selector: '.brxe-post-toc',
	eachElement: (toc) => {
		let scriptId = toc.dataset.scriptId

		// Destroy existing tocbot instance
		if (window.bricksData.tocbotInstances[scriptId]) {
			tocbot.destroy()
		}

		// STEP: Create IDs for each heading in the content (if heading has no 'id')
		let contentSelector = toc.dataset.contentSelector || '.brxe-post-content'
		let content = document.querySelector(contentSelector)

		// Fallback to #brx-content
		if (!content) {
			content = document.querySelector('#brx-content')
		}

		if (!content) {
			return
		}

		let headingSelectors = toc.dataset.headingSelectors || 'h2, h3'
		let headings = content.querySelectorAll(headingSelectors)
		let headingMap = {}

		headings.forEach((heading) => {
			let id =
				heading?.id ||
				heading.textContent
					.trim()
					.toLowerCase()
					.normalize('NFD') // Remove accents
					.replace(/[\u0300-\u036f]/g, '') // Remove accents
					.split(' ')
					.join('-')
					.replace(/[!@#$%^&*():=]/gi, '') // Remove special characters
					.replace(/\//gi, '-') // Remove special characters

			headingMap[id] = !isNaN(headingMap[id]) ? ++headingMap[id] : 0

			if (headingMap[id]) {
				heading.id = id + '-' + headingMap[id]
			} else {
				heading.id = id
			}
		})

		headingsOffset = parseInt(toc.dataset.headingsOffset) || 0

		// STEP: tocbot options (https://tscanlin.github.io/tocbot/#api)
		let options = {
			tocSelector: '.brxe-post-toc',
			contentSelector: contentSelector,
			headingSelector: headingSelectors,
			ignoreSelector: toc.dataset.ignoreSelector || '.toc-ignore',
			hasInnerContainers: false,
			linkClass: 'toc-link',
			extraLinkClasses: '',
			activeLinkClass: 'is-active-link',
			listClass: 'toc-list',
			extraListClasses: '',
			isCollapsedClass: 'is-collapsed',
			collapsibleClass: 'is-collapsible',
			listItemClass: 'toc-list-item',
			activeListItemClass: 'is-active-li',
			collapseDepth: toc.dataset.collapseInactive ? 0 : 6,
			scrollSmooth: true,
			scrollSmoothOffset: headingsOffset ? -headingsOffset : 0,
			headingsOffset: headingsOffset,
			throttleTimeout: 0,
			positionFixedSelector: null,
			positionFixedClass: 'is-position-fixed',
			fixedSidebarOffset: 'auto',
			includeHtml: false,
			includeTitleTags: false,
			orderedList: false, // TODO: Add "Numbered" setting
			scrollContainer: null,
			skipRendering: false,
			headingLabelCallback: false,
			ignoreHiddenElements: false,
			headingObjectCallback: null,
			basePath: '',
			disableTocScrollSync: false,
			tocScrollOffset: 0
		}

		// Init tocbot
		tocbot.init(options)

		// Store tocbot instance in bricksData to destroy and re-init
		window.bricksData.tocbotInstances[scriptId] = tocbot
	}
})

function bricksTableOfContents() {
	bricksTableOfContentsFn.run()
}

/**
 * Element: Form
 *
 * Init recaptcha explicit on Google reCAPTCHA callback.
 */
const bricksFormFn = new BricksFunction({
	parentNode: document,
	selector: '.brxe-form',
	eachElement: (form) => {
		let elementId = form.getAttribute('data-element-id')

		// Validate required checkboxes
		let checkboxes = bricksQuerySelectorAll(form, 'input[type="checkbox"]')

		checkboxes.forEach((checkbox) => {
			if (checkbox.required) {
				checkbox.addEventListener('click', (event) => {
					let cbName = checkbox.getAttribute('name')
					let group = bricksQuerySelectorAll(form, `input[name="${cbName}"]`)

					let atLeastOneChecked = false
					group.forEach((item) => {
						if (item.checked === true) {
							atLeastOneChecked = true
						}
					})

					if (atLeastOneChecked) {
						group.forEach((item) => {
							item.required = false
						})
					} else {
						group.forEach((item) => {
							item.required = true
						})
					}
				})
			}
		})

		// Init datepicker
		let flatpickrElements = bricksQuerySelectorAll(form, '.flatpickr')

		flatpickrElements.forEach((flatpickrElement) => {
			let flatpickrOptions = flatpickrElement.dataset.bricksDatepickerOptions

			if (flatpickrOptions) {
				flatpickrOptions = JSON.parse(flatpickrOptions)

				// Disable native mobile date input as it looks different from all other fields
				// @since 1.7 (https://flatpickr.js.org/mobile-support/)
				flatpickrOptions.disableMobile = true

				flatpickrOptions.onReady = (a, b, fp) => {
					let ariaLabel = fp.altInput.previousElementSibling
						? fp.altInput.previousElementSibling.getAttribute('aria-label')
						: 'Date'
					fp.altInput.setAttribute('aria-label', ariaLabel || 'Date')
				}

				flatpickr(flatpickrElement, flatpickrOptions)
			}
		})

		// Init file input, to validate files on user selection
		let files = {}
		let fileInputInstances = bricksQuerySelectorAll(form, 'input[type=file]')

		fileInputInstances.forEach((input) => {
			let inputRef = input.getAttribute('data-files-ref')
			let maxSize = input.getAttribute('data-maxsize') || false
			let maxLength = input.getAttribute('data-limit') || false

			maxSize = maxSize ? parseInt(maxSize) * 1024 * 1024 : false

			input.addEventListener('change', (e) => {
				let fileList = e.target.files
				let fileListLength = fileList.length
				let inputName = input.getAttribute('name')

				if (!fileListLength) {
					return
				}

				let fileResultEl = form.querySelector(`.file-result[data-files-ref="${inputRef}"]`)

				for (let i = 0; i < fileListLength; i++) {
					let file = fileList[i]
					let error = false

					// Populate upload HTML
					let resultEl = fileResultEl.cloneNode(true)

					// Erorro: Max. number of files exceeded
					if (
						maxLength &&
						files.hasOwnProperty(inputName) &&
						files[inputName].length >= maxLength
					) {
						error = 'limit'
					}

					// Error: File exceeds size limit
					if (maxSize && file.size > maxSize) {
						error = 'size'
					}

					if (error) {
						resultEl.classList.add('danger')
						resultEl.innerHTML = resultEl
							.getAttribute(`data-error-${error}`)
							.replace('%s', file.name)

						setTimeout(() => {
							resultEl.remove()
						}, 5000)
					}

					// Add file
					else {
						if (!files.hasOwnProperty(inputName)) {
							files[inputName] = []
						}

						files[inputName].push(file)

						resultEl.classList.add('show')

						let resultText = resultEl.querySelector('.text')
						let resultRemove = resultEl.querySelector('.remove')

						resultText.innerHTML = file.name
						resultRemove.setAttribute('data-name', file.name)
						resultRemove.setAttribute('data-field', inputName)

						// Remove file listener
						resultRemove.addEventListener('click', (e) => {
							let fileName = e.target.getAttribute('data-name')
							let fieldName = e.target.getAttribute('data-field')
							let fieldFiles = files[fieldName]

							for (let k = 0; k < fieldFiles.length; k++) {
								if (fieldFiles[k].name === fileName) {
									files[inputName].splice(k, 1)
									break
								}
							}

							resultEl.remove()
						})
					}

					// Add result
					fileResultEl.parentNode.insertBefore(resultEl, fileResultEl.nextSibling)
				}
			})
		})

		// Form submit
		form.addEventListener('submit', (event) => {
			event.preventDefault()

			if (!bricksIsFrontend) {
				return
			}

			// Recaptcha
			let recaptchaElement = document.getElementById(`recaptcha-${elementId}`)
			let recaptchaErrorEl = form.querySelector('.recaptcha-error')

			if (!recaptchaElement) {
				bricksSubmitForm(elementId, form, files, null)

				return
			}

			let recaptchaSiteKey = recaptchaElement.getAttribute('data-key')

			if (!recaptchaSiteKey) {
				recaptchaErrorEl.classList.add('show')

				return
			}

			try {
				grecaptcha.ready(() => {
					try {
						grecaptcha
							.execute(recaptchaSiteKey, { action: 'bricks_form_submit' })
							.then((token) => {
								recaptchaErrorEl.classList.remove('show')

								bricksSubmitForm(elementId, form, files, token)
							})
							.catch((error) => {
								recaptchaErrorEl.classList.add('show')
								form.querySelector('.alert').innerText = `Google reCaptcha ${error}`
							})
					} catch (error) {
						recaptchaErrorEl.classList.add('show')
						form.querySelector('.alert').innerText = `Google reCaptcha ${error}`
					}
				})
			} catch (error) {
				recaptchaErrorEl.classList.add('show')
				form.querySelector('.alert').innerText = `Google reCaptcha ${error}`
			}
		})
	}
})

function bricksForm() {
	bricksFormFn.run()
}

function bricksSubmitForm(elementId, form, files, recaptchaToken) {
	let submitButton = form.querySelector('button[type=submit]')
	submitButton.classList.add('sending')

	let formData = new FormData(form)
	formData.append('action', 'bricks_form_submit') // Do not remove this
	formData.append('postId', window.bricksData.postId)
	formData.append('formId', elementId)
	formData.append('recaptchaToken', recaptchaToken || '')
	formData.append('nonce', window.bricksData.nonce)
	formData.append('referrer', location.toString())

	// Append files
	for (let inputName in files) {
		files[inputName].forEach((file) => {
			formData.append(`${inputName}[]`, file, file.name)
		})
	}

	let url = window.bricksData.ajaxUrl
	let xhr = new XMLHttpRequest()

	xhr.open('POST', url, true)

	// Successful response
	xhr.onreadystatechange = function () {
		let getResponse = (data) => {
			try {
				return JSON.parse(data)
			} catch (e) {
				return null
			}
		}

		let res = getResponse(xhr.response)

		if (window.bricksData.debug) {
			console.warn('bricks_form_submit', xhr, res)
		}

		if (!res) {
			return
		}

		// Google Tag Manager: Newsletter signup (action: 'mailchimp' or 'sendgrid')
		if (res.success && (res.data?.action === 'mailchimp' || res.data?.action === 'sendgrid')) {
			window.dataLayer = window.dataLayer || []
			window.dataLayer.push({ event: 'bricksNewsletterSignup' })
		}

		// Check: Redirect after successful form submit
		if (res.success && res.data?.redirectTo) {
			setTimeout(() => {
				window.location.href = res.data.redirectTo
			}, parseInt(res.data?.redirectTimeout) || 0)
		}

		// Generate form submit message HTML
		if (form.querySelector('.message')) {
			form.querySelector('.message').remove()
		}

		let messageEl = document.createElement('div')
		messageEl.classList.add('message')

		let messageText = document.createElement('div')
		messageText.classList.add('text')

		// Show form response message
		if (res.data?.message) {
			if (res.data.message?.errors) {
				// User login/registration errors
				let errors = res.data.message.errors
				let errorKeys = Object.keys(errors)

				errorKeys.forEach((errorKey) => {
					messageText.innerHTML += errors[errorKey][0] + '<br>'
				})
			} else {
				messageText.innerHTML = res.data.message
			}
		}

		messageEl.appendChild(messageText)

		if (res.data?.info) {
			let submitInfoInner = document.createElement('div')

			let submitInfoText = document.createElement('div')
			submitInfoText.innerHTML = res.data.info.join('<br>')

			messageEl.appendChild(submitInfoInner)
			submitInfoInner.appendChild(submitInfoText)
		} else {
			messageEl.classList.add(res.data.type)
		}

		form.appendChild(messageEl)

		submitButton.classList.remove('sending')

		// Clear form data
		if (res.success) {
			form.reset()
			files = {}

			let fileResults = bricksQuerySelectorAll(form, '.file-result')

			if (fileResults !== null) {
				fileResults.forEach((resultEl) => {
					resultEl.remove()
				})
			}
		}
	}

	xhr.send(formData)
}

/**
 * IsotopeJS (Image Gallery & Posts)
 */
const bricksIsotopeFn = new BricksFunction({
	parentNode: document,
	selector: '.bricks-layout-wrapper.isotope',
	forceReinit: true,
	windowVariableCheck: ['Isotope'],
	eachElement: (el) => {
		let options = {
			itemSelector: '.bricks-layout-item',
			percentPosition: true
		}

		let layout = el.getAttribute('data-layout')

		if (layout === 'grid') {
			options.layoutMode = 'fitRows'
			options.fitRows = {
				gutter: '.bricks-gutter-sizer'
			}
		} else if (layout === 'masonry' || layout === 'metro') {
			options.masonry = {
				columnWidth: '.bricks-isotope-sizer',
				gutter: '.bricks-gutter-sizer'
			}
		}

		let isotopeInstance = new Isotope(el, options)

		// Isotope filtering (https://isotope.metafizzy.co/filtering.html)
		// TODO Make it work on grid & list layout as well (those don't have .isotope class)
		let filters = el.parentNode.querySelector('.bricks-isotope-filters')

		if (filters) {
			filters.addEventListener('click', (e) => {
				let filterValue = e.target.getAttribute('data-filter')
				let activeFilter = filters.querySelector('li.active')

				if (!filterValue || !bricksIsFrontend) {
					return
				}

				if (activeFilter) {
					activeFilter.classList.remove('active')
				}

				e.target.classList.add('active')

				// Example: https://codepen.io/desandro/pen/BgcCD
				isotopeInstance.arrange({
					filter: filterValue
				})
			})
		}
	}
})
function bricksIsotope() {
	bricksIsotopeFn.run()
}

/**
 * Element: Map
 *
 * Init maps explicit on Google Maps callback.
 */
const bricksMapFn = new BricksFunction({
	parentNode: document,
	selector: '.brxe-map',
	eachElement: (mapEl, index) => {
		/**
		 * Set 1000ms timeout to request next map (to avoid hitting query limits)
		 *
		 * https://developers.google.com/maps/premium/previous-licenses/articles/usage-limits)
		 */
		setTimeout(() => {
			let settings = (() => {
				let mapOptions = mapEl.dataset.bricksMapOptions

				if (!mapOptions) {
					return false
				}

				try {
					return JSON.parse(mapOptions)
				} catch (e) {
					return false
				}
			})(mapEl)

			if (!settings) {
				return
			}

			let addresses = Array.isArray(settings?.addresses)
				? settings.addresses
				: [{ address: 'Berlin, Germany' }]
			let markers = []
			let markerDefault = {}

			// Custom marker
			if (settings?.marker) {
				markerDefault.icon = {
					url: settings.marker
				}

				if (settings?.markerHeight && settings?.markerWidth) {
					markerDefault.icon.scaledSize = new google.maps.Size(
						parseInt(settings.markerWidth),
						parseInt(settings.markerHeight)
					)
				}
			}

			// Custom marker active
			let markerActive = {}

			if (settings?.markerActive) {
				markerActive = {
					url: settings.markerActive
				}

				if (settings?.markerActiveHeight && settings?.markerActiveWidth) {
					markerActive.scaledSize = new google.maps.Size(
						parseInt(settings.markerActiveWidth),
						parseInt(settings.markerActiveHeight)
					)
				}
			}

			let infoBoxes = []
			let bounds = new google.maps.LatLngBounds()

			// 'gestureHandling' combines 'scrollwheel' and 'draggable' (which are deprecated)
			let gestureHandling = 'auto'

			if (!settings.draggable) {
				gestureHandling = 'none'
			} else if (settings.scrollwheel && settings.draggable) {
				gestureHandling = 'cooperative'
			} else if (!settings.scrollwheel && settings.draggable) {
				gestureHandling = 'greedy'
			}

			if (settings.disableDefaultUI) {
				settings.fullscreenControl = false
				settings.mapTypeControl = false
				settings.streetViewControl = false
				settings.zoomControl = false
			}

			// https://developers.google.com/maps/documentation/javascript/reference/map#MapOptions
			let zoom = settings.zoom ? parseInt(settings.zoom) : 12
			let mapOptions = {
				zoom: zoom,
				// scrollwheel: settings.scrollwheel,
				// draggable: settings.draggable,
				gestureHandling: gestureHandling,
				fullscreenControl: settings.fullscreenControl,
				mapTypeControl: settings.mapTypeControl,
				streetViewControl: settings.streetViewControl,
				zoomControl: settings.zoomControl,
				disableDefaultUI: settings.disableDefaultUI
			}

			if (settings.zoomControl) {
				if (settings?.maxZoom) {
					mapOptions.maxZoom = parseInt(settings.maxZoom)
				}

				if (settings?.minZoom) {
					mapOptions.minZoom = parseInt(settings.minZoom)
				}
			}

			let map = new google.maps.Map(mapEl, mapOptions)

			// Loop through all addresses to set markers, infoBoxes, bounds etc.
			for (let i = 0; i < addresses.length; i++) {
				let addressObj = addresses[i]

				// Render marker with Latitude/Longitude
				if (addressObj?.latitude && addressObj?.longitude) {
					renderMapMarker(addressObj, {
						lat: parseFloat(addressObj.latitude),
						lng: parseFloat(addressObj.longitude)
					})
				}
				// Run Geocoding function to convert address into coordinates (use closure to pass additional variables)
				else if (addressObj?.address) {
					let geocoder = new google.maps.Geocoder()

					geocoder.geocode({ address: addressObj.address }, geocodeCallback(addressObj))
				}
			}

			function geocodeCallback(addressObj) {
				let geocodeCallback = (results, status) => {
					// Skip geocode response on error
					if (status !== 'OK') {
						console.warn('Geocode error:', status)
						return
					}

					let position = results[0].geometry.location
					renderMapMarker(addressObj, position)
				}

				return geocodeCallback
			}

			function renderMapMarker(addressObj, position) {
				markerDefault.map = map
				markerDefault.position = position

				let marker = new google.maps.Marker(markerDefault)
				marker.setMap(map)
				markers.push(marker)

				google.maps.event.addListener(marker, 'click', () => {
					onMarkerClick(addressObj)
				})

				function onMarkerClick(addressObj) {
					// First close all markers and infoBoxes
					if (markerDefault?.icon) {
						markers.forEach((marker) => {
							marker.setIcon(markerDefault.icon)
						})
					}

					infoBoxes.forEach((infoBox) => {
						infoBox.hide()
					})

					// Set custom active marker on marker click
					if (markerActive?.url) {
						marker.setIcon(markerActive)
					}

					// Open infoBox (better styleable than infoWindow) on marker click
					// http://htmlpreview.github.io/?http://github.com/googlemaps/v3-utility-library/blob/master/infobox/docs/reference.html
					let infoboxContent = ''
					let infoTitle = addressObj?.infoTitle || false
					let infoSubtitle = addressObj?.infoSubtitle || false
					let infoOpeningHours = addressObj?.infoOpeningHours || false
					let infoImages = addressObj?.infoImages || {}

					if (!Array.isArray(infoImages)) {
						infoImages = Array.isArray(infoImages?.images) ? infoImages.images : []
					}

					if (infoTitle) {
						infoboxContent += `<h3 class="title">${infoTitle}</h3>`
					}

					if (infoSubtitle) {
						infoboxContent += `<p class="subtitle">${infoSubtitle}</p>`
					}

					if (infoOpeningHours) {
						infoboxContent += '<ul class="content">'
						infoOpeningHours = infoOpeningHours.split('\n')

						if (infoOpeningHours.length) {
							infoOpeningHours.forEach((infoOpeningHour) => {
								infoboxContent += `<li>${infoOpeningHour}</li>`
							})
						}

						infoboxContent += '</ul>'
					}

					if (infoImages.length) {
						infoboxContent += '<ul class="images bricks-lightbox">'

						infoImages.forEach((image) => {
							infoboxContent += '<li>'

							if (image.thumbnail && image.src) {
								infoboxContent += `<a
									data-pswp-src="${image.src}"
									data-pswp-width="${image?.width || 376}"
									data-pswp-height="${image?.height || 376}"
									data-pswp-id="${addressObj.id}">`
								infoboxContent += `<img src="${image.thumbnail}"/>`
								infoboxContent += '</a>'
							}

							infoboxContent += '</li>'
						})

						infoboxContent += '</ul>'
					}

					if (infoboxContent) {
						let infoBoxWidth = parseInt(addressObj?.infoWidth) || 300
						let infoBoxOptions = {
							// minWidth: infoBoxWidth,
							// maxWidth: infoBoxWidth,
							content: infoboxContent,
							disableAutoPan: true,
							pixelOffset: new google.maps.Size(0, 0),
							alignBottom: false,
							infoBoxClearance: new google.maps.Size(20, 20),
							enableEventPropagation: false,
							zIndex: 1001,
							boxStyle: {
								opacity: 1,
								zIndex: 999,
								top: 0,
								left: 0,
								width: `${infoBoxWidth}px`
							}
						}

						if (typeof window.jQuery != 'undefined') {
							infoBoxOptions.closeBoxURL = ''
							infoBoxOptions.content += '<span class="close">×</span>'
						}

						let infoBox = new InfoBox(infoBoxOptions)

						infoBox.open(map, marker)
						infoBoxes.push(infoBox)

						// Center infoBox on map (small timeout required to allow infoBox to render)
						setTimeout(() => {
							let infoBoxHeight = infoBox.div_.offsetHeight
							let projectedPosition = map.getProjection().fromLatLngToPoint(marker.getPosition())
							let infoBoxCenter = map
								.getProjection()
								.fromPointToLatLng(
									new google.maps.Point(
										projectedPosition.x,
										projectedPosition.y - (infoBoxHeight * getLongitudePerPixel()) / 2
									)
								)
							map.panTo(infoBoxCenter)
						}, 100)

						google.maps.event.addListener(infoBox, 'domready', (e) => {
							if (infoImages.length) {
								bricksPhotoswipe()
							}

							// Close infoBox icon listener
							if (typeof window.jQuery != 'undefined') {
								jQuery('.close').on('click', () => {
									infoBox.close()

									if (markerDefault?.icon) {
										marker.setIcon(markerDefault.icon)
									}

									if (addresses.length > 1) {
										bounds.extend(position)
										map.fitBounds(bounds)
										map.panToBounds(bounds)
									}
								})
							}
						})
					}
				}

				// Get longitude per pixel based on current Zoom (for infoBox centering)
				function getLongitudePerPixel() {
					let latLng = map.getCenter()
					let zoom = map.getZoom()
					let pixelDistance = 1
					let point1 = map
						.getProjection()
						.fromLatLngToPoint(
							new google.maps.LatLng(
								latLng.lat() - pixelDistance / Math.pow(2, zoom),
								latLng.lng() - pixelDistance / Math.pow(2, zoom)
							)
						)
					let point2 = map
						.getProjection()
						.fromLatLngToPoint(
							new google.maps.LatLng(
								latLng.lat() + pixelDistance / Math.pow(2, zoom),
								latLng.lng() + pixelDistance / Math.pow(2, zoom)
							)
						)
					return Math.abs(point2.x - point1.x)
				}

				bounds.extend(position)
				map.fitBounds(bounds)
				map.panToBounds(bounds)

				// var mapPosition = marker.getPosition()
				// map.setCenter(mapPosition)

				// Set zoom once map is idle: As fitBounds overrules zoom (since 1.5.1)
				if (addresses.length === 1) {
					let mapIdleListener = google.maps.event.addListener(map, 'idle', () => {
						map.setZoom(zoom)
						google.maps.event.removeListener(mapIdleListener)
					})
				}
			}

			// Set map type
			if (settings?.type) {
				map.setMapTypeId(settings.type)
			}

			// Set map style
			if (settings?.style) {
				// Custom map style
				if (settings.style === 'custom' && settings?.customStyle) {
					let mapStyle = JSON.stringify(settings.customStyle)

					map.setOptions({
						styles: JSON.parse(mapStyle)
					})
				}

				// Predefined map style
				else if (window.bricksData && window.bricksData.mapStyles[settings.style]) {
					map.setOptions({
						styles: JSON.parse(window.bricksData.mapStyles[settings.style].style)
					})
				}
			}
		}, index * 1000)
	}
})
function bricksMap() {
	bricksMapFn.run()
}

/**
 * Element: Pie Chart
 */
const bricksPieChartFn = new BricksFunction({
	parentNode: document,
	selector: '.brxe-pie-chart',
	windowVariableCheck: ['EasyPieChart'],
	eachElement: (element) => {
		new BricksIntersect({
			element: element,
			callback: (el) => {
				// HTMLCollection of canvas (grab first one)
				let canvas = el.getElementsByTagName('canvas')

				// Remove canvas first, before EasyPieChart init
				if (canvas.length) {
					canvas[0].remove()
				}

				new EasyPieChart(el, {
					size: el.dataset.size && el.dataset.size > 0 ? el.dataset.size : 160,
					lineWidth: el.dataset.lineWidth,
					barColor: el.dataset.barColor,
					trackColor: el.dataset.trackColor,
					lineCap: el.dataset.lineCap,
					scaleColor: el.dataset.scaleColor,
					scaleLength: el.dataset.scaleLength,
					rotate: 0
				})
			},
			threshold: 1
		})
	}
})

function bricksPieChart() {
	bricksPieChartFn.run()
}

/**
 * Element: Pricing Tables (Pricing toggle)
 */
const bricksPricingTablesFn = new BricksFunction({
	parentNode: document,
	selector: '.brxe-pricing-tables',
	eachElement: (element) => {
		let tabs = bricksQuerySelectorAll(element, '.tab')
		let pricingTables = bricksQuerySelectorAll(element, '.pricing-table')

		tabs.forEach((tab) => {
			if (tab.classList.contains('listening')) {
				return
			}

			tab.classList.add('listening')

			tab.addEventListener('click', () => {
				// Return if selected tab is .active
				if (tab.classList.contains('active')) {
					return
				}

				// Toggle pricing table .active
				pricingTables.forEach((pricingTable) => {
					pricingTable.classList.toggle('active')
				})

				// Toggle .active tab
				tabs.forEach((tab) => {
					tab.classList.remove('active')
				})

				tab.classList.add('active')
			})
		})
	}
})

function bricksPricingTables() {
	bricksPricingTablesFn.run()
}

/**
 * Element: Post Reading Progress Bar
 *
 * @since 1.8.5
 */
const bricksPostReadingProgressBarFn = new BricksFunction({
	parentNode: document,
	selector: '.brxe-post-reading-progress-bar',
	eachElement: (element) => {
		// Get content element
		let contentEl = element.dataset.contentSelector
			? document.querySelector(element.dataset.contentSelector)
			: false

		window.addEventListener('scroll', () => {
			// Scrolled from document top
			let scrolled = window.scrollY

			// Document height minus the visible part of the window
			let height = document.documentElement.scrollHeight - document.documentElement.clientHeight

			// STEP: Calculate scroll position of specific element
			if (contentEl) {
				let rect = contentEl.getBoundingClientRect()
				height = rect.height
				scrolled = rect.top > 0 ? 0 : -rect.top
			}

			// Calculate the percentage of the document or contentEl that has been scrolled from the top
			element.setAttribute('value', Math.ceil((scrolled / height) * 100))
		})
	}
})

function bricksPostReadingProgressBar() {
	bricksPostReadingProgressBarFn.run()
}

/**
 * Element: Progress Bar (animate fill-up bar)
 */
const bricksProgressBarFn = new BricksFunction({
	parentNode: document,
	selector: '.brxe-progress-bar .bar span',
	eachElement: (bar) => {
		new BricksIntersect({
			element: bar,
			callback: () => {
				if (bar.dataset.width) {
					setTimeout(() => {
						bar.style.width = bar.dataset.width
					}, 'slow')
				}
			},
			threshold: 1
		})
	}
})

function bricksProgressBar() {
	bricksProgressBarFn.run()
}

/**
 * SplideJS: For all nestable elements
 *
 * @since 1.5
 */
const bricksSplideFn = new BricksFunction({
	parentNode: document,
	selector: '.brxe-slider-nested.splide',
	windowVariableCheck: ['Splide'],
	forceReinit: (element, index) => {
		// Allow Force reinit inside Builder (@since 1.8.2)
		return !bricksIsFrontend
	},
	eachElement: (splideElement) => {
		// Add .splide__slide to individual slide (perfect for in/builder)
		let slides = bricksQuerySelectorAll(splideElement, [
			'.splide__list > .brxe-container',
			'.splide__list > .brxe-block',
			'.splide__list > .brxe-div'
		])

		slides.forEach((slide) => {
			slide.classList.add('splide__slide')
			slide.dataset.id = slide.id
		})

		let scriptId = splideElement.dataset.scriptId

		// Destroy existing splideJS instance
		if (window.bricksData.splideInstances.hasOwnProperty(scriptId)) {
			window.bricksData.splideInstances[scriptId].destroy()
		}

		// Init & mount splideJS
		let splideInstance = new Splide(splideElement)

		// https://splidejs.com/guides/apis/#go
		splideInstance.mount()

		// Store splideJS instance in bricksData to destroy and re-init
		window.bricksData.splideInstances[scriptId] = splideInstance

		// NOTE: To ensure Bricks element ID is used (important also for builder), and not the randomly by splide generated ID (see: slide.js:mount())
		// Improvement: Tweak CSS selector for 'bricksSplide' elements to use #parent.id > .{slide-class}
		slides.forEach((slide, index) => {
			if (slide.dataset.id) {
				slide.id = slide.dataset.id

				// Set 'aria-controls' value to slide.id
				let pagination = splideElement.querySelector('.splide__pagination')

				if (pagination) {
					let paginationButton = pagination.querySelector(
						`li:nth-child(${index + 1}) .splide__pagination__page`
					)

					if (paginationButton) {
						paginationButton.setAttribute('aria-controls', slide.id)
					}
				}
			}

			// Get & set background-image added via lazy load through 'data-style' attribute inside query loop (@since 1.5)
			if (!slide.classList.contains('bricks-lazy-hidden')) {
				let style = slide.getAttribute('style') || ''

				if (slide.dataset.style) {
					style += slide.dataset.style
					slide.setAttribute('style', style)
				}
			}
		})
	}
})

function bricksSplide() {
	bricksSplideFn.run()
}

/**
 * SwiperJS touch slider: Carousel, Slider, Testimonials
 */
const bricksSwiperFn = new BricksFunction({
	parentNode: document,
	selector: '.bricks-swiper-container',
	windowVariableCheck: ['Swiper'],
	forceReinit: (element, index) => {
		// Allow Force reinit inside Builder (@since 1.8.2)
		return !bricksIsFrontend
	},
	eachElement: (swiperElement) => {
		let scriptArgs

		try {
			scriptArgs = JSON.parse(swiperElement.dataset.scriptArgs)
		} catch (e) {
			console.warn('bricksSwiper: Error parsing JSON of data-script-args', swiperElement)

			scriptArgs = {}
		}

		let element = swiperElement.classList.contains('[class*=brxe-]')
			? swiperElement
			: swiperElement.closest('[class*=brxe-]')

		if (!element) {
			return
		}

		// @since 1.5: Nestable elements: Add .swiper-slide to individual slide (perfect for in/builder)
		let slides = bricksQuerySelectorAll(swiperElement, [
			'.splide__list > .brxe-container',
			'.splide__list > .brxe-block',
			'.splide__list > .brxe-div'
		])

		slides.forEach((slide) => slide.classList.add('swiper-slide'))

		let scriptId = element.dataset.scriptId

		let swiperInstance = window.bricksData.swiperInstances.hasOwnProperty(scriptId)
			? window.bricksData.swiperInstances[scriptId]
			: undefined

		if (swiperInstance) {
			swiperInstance.destroy()
		}

		scriptArgs.observer = false // Not working and not necessary (= set to false)
		scriptArgs.observeParents = true
		scriptArgs.resizeObserver = true

		// Defaults
		scriptArgs.slidesToShow = scriptArgs.hasOwnProperty('slidesToShow')
			? scriptArgs.slidesToShow
			: 1
		scriptArgs.slidesPerGroup = scriptArgs.hasOwnProperty('slidesPerGroup')
			? scriptArgs.slidesPerGroup
			: 1
		scriptArgs.speed = scriptArgs.hasOwnProperty('speed') ? parseInt(scriptArgs.speed) : 300
		scriptArgs.effect = scriptArgs.hasOwnProperty('effect') ? scriptArgs.effect : 'slide'
		scriptArgs.spaceBetween = scriptArgs.hasOwnProperty('spaceBetween')
			? scriptArgs.spaceBetween
			: 0
		scriptArgs.initialSlide = scriptArgs.hasOwnProperty('initialSlide')
			? scriptArgs.initialSlide
			: 0

		// Enable keyboard control when in viewport (only on frontend as it messes with contenteditable in builder)
		scriptArgs.keyboard = {
			enabled: bricksIsFrontend,
			onlyInViewport: true
		}

		// Disabled & hide navigation buttons when there are not enough slides for sliding
		scriptArgs.watchOverflow = true

		// Effect: Flip
		if (scriptArgs.hasOwnProperty('effect') && scriptArgs.effect === 'flip') {
			scriptArgs.flipEffect = {
				slideShadows: false
			}
		}

		// Set crossFade to true to avoid seeing content behind or underneath slide (https://swiperjs.com/swiper-api#fade-effect)
		if (scriptArgs.hasOwnProperty('effect') && scriptArgs.effect === 'fade') {
			scriptArgs.fadeEffect = { crossFade: true }
		}

		// Arrows
		if (scriptArgs.navigation) {
			scriptArgs.navigation = {
				prevEl: element.querySelector('.bricks-swiper-button-prev'),
				nextEl: element.querySelector('.bricks-swiper-button-next')
			}
		}

		// Dots
		if (scriptArgs.pagination) {
			scriptArgs.pagination = {
				el: element.querySelector('.swiper-pagination'),
				type: 'bullets',
				clickable: true
			}

			if (scriptArgs.dynamicBullets == true) {
				delete scriptArgs.dynamicBullets

				scriptArgs.pagination.dynamicBullets = true
				// scriptArgs.pagination.dynamicMainBullets = 1
			}
		}

		swiperInstance = new Swiper(swiperElement, scriptArgs)

		// Store swiper instance in bricksData to destroy and re-init
		window.bricksData.swiperInstances[scriptId] = swiperInstance
	}
})

function bricksSwiper() {
	bricksSwiperFn.run()
}

/**
 * Element: Video (YouTube, Vimeo, File URL)
 */
const bricksVideoFn = new BricksFunction({
	parentNode: document,
	selector: '.brxe-video',
	eachElement: (element) => {
		// Remove overlay & icon
		if (bricksIsFrontend) {
			element.addEventListener('click', () => {
				let videoOverlay = element.querySelector('.bricks-video-overlay')
				let videoOverlayIcon = element.querySelector('.bricks-video-overlay-icon')

				if (videoOverlay) {
					videoOverlay.remove()
				}

				if (videoOverlayIcon) {
					videoOverlayIcon.remove()
				}
			})
		}

		// 'video' HTML (videoType: media, file, meta)
		let videoElement = element.querySelector('video')

		if (!videoElement) {
			return
		}

		// Init custom HTML5 <video> player (https://plyr.io)
		if (window.hasOwnProperty('Plyr')) {
			let elementId = element.dataset.scriptId
			let video = element.querySelector('.bricks-plyr')
			let player = window.bricksData?.videoInstances?.[elementId] || undefined

			if (player) {
				player.destroy()
			}

			if (video) {
				// 'autoplay' only runs if video is 'muted'
				player = new Plyr(video)
			}

			window.bricksData.videoInstances[elementId] = player
		}

		// Necessary for autoplaying in iOS (https://webkit.org/blog/6784/new-video-policies-for-ios/)
		videoElement.setAttribute('playsinline', true)
	}
})
function bricksVideo() {
	bricksVideoFn.run()
}

/**
 * Load Facebook SDK & render Facebook widgets
 *
 * https://developers.facebook.com/docs/javascript/reference/FB.init/v3.3
 *
 * @since 1.4 Use XMLHttpRequest instead of jquery.ajax()
 */

function bricksFacebookSDK() {
	// Return: Page has no Facebook Page element
	let facebookPageElement = document.querySelector('.brxe-facebook-page')

	if (!facebookPageElement) {
		return
	}

	let locale = window.bricksData.hasOwnProperty('locale') ? window.bricksData.locale : 'en_US'
	let facebookAppId = window.bricksData.hasOwnProperty('facebookAppId')
		? window.bricksData.facebookAppId
		: null
	let facebookSdkUrl = `https://connect.facebook.net/${locale}/sdk.js`

	let xhr = new XMLHttpRequest()
	xhr.open('GET', facebookSdkUrl)

	// Successful response: Create & add FB script to DOM and run function to generate Facebook Page HTML
	xhr.onreadystatechange = function () {
		if (this.readyState == 4 && this.status == 200) {
			let fbScript = document.createElement('script')
			fbScript.type = 'text/javascript'
			fbScript.id = 'bricks-facebook-page-sdk'
			fbScript.appendChild(document.createTextNode(xhr.responseText))
			document.body.appendChild(fbScript)

			FB.init({
				appId: facebookAppId,
				version: 'v3.3',
				xfbml: true // render
			})
		}
	}

	xhr.send()
}

/**
 * Prettify <pre> and <code> HTML tags
 *
 * https://github.com/googlearchive/code-prettify
 */
const bricksPrettifyFn = new BricksFunction({
	parentNode: document,
	selector: '.prettyprint.prettyprinted',
	run: () => {
		if (!window.hasOwnProperty('PR')) {
			return
		}

		PR.prettyPrint()

		// Builder: Re-init prettify
		let prettyprinted = bricksQuerySelectorAll(document, '.prettyprint.prettyprinted')

		if (!bricksIsFrontend && prettyprinted.length) {
			prettyprinted.forEach((prettyprint) => {
				prettyprint.classList.remove('prettyprinted')
				PR.prettyPrint()
			})
		}
	}
})

function bricksPrettify() {
	bricksPrettifyFn.run()
}

/**
 * Improve a11y keyboard navigation by making sure after skipping to the content, the next tab hit continues down the content
 *
 * https://axesslab.com/skip-links/
 */
function bricksSkipLinks() {
	let skipLinks = bricksQuerySelectorAll(document, '.skip-link')

	if (!skipLinks) {
		return
	}

	skipLinks.forEach((link) => {
		link.addEventListener('click', (e) => {
			e.preventDefault()

			let toElement = document.getElementById(link.href.split('#')[1])

			if (toElement) {
				toElement.setAttribute('tabindex', '-1')

				toElement.addEventListener(
					'blur',
					() => {
						toElement.removeAttribute('tabindex')
					},
					{ once: true }
				)

				toElement.focus()
			}
		})
	})
}

/**
 * Bind element interactions to elements (frontend only)
 *
 * @since 1.6
 */
const bricksInteractionsFn = new BricksFunction({
	parentNode: document,
	selector: '[data-interactions]',
	frontEndOnly: true,
	eachElement: (sourceEl) => {
		let interactions = []

		try {
			interactions = JSON.parse(sourceEl.dataset.interactions)
		} catch (e) {
			console.info('error:bricksInteractions', e)
			return false
		}

		let interactionGroupId = sourceEl.dataset?.interactionId || false

		if (!interactions || !interactionGroupId) {
			return
		}

		interactions.forEach((interaction) => {
			let bindToDocument = false

			if (!interaction?.trigger) {
				return
			}

			// trigger: 'click', 'mouseover', 'scroll', etc.
			if (interaction.trigger === 'scroll') {
				let scrollOffset = 0

				if (interaction?.scrollOffset) {
					scrollOffset = interaction?.scrollOffset.replace('px', '')

					if (scrollOffset.includes('%')) {
						let documentHeight = Math.max(
							document.body.scrollHeight,
							document.documentElement.scrollHeight,
							document.body.offsetHeight,
							document.documentElement.offsetHeight,
							document.body.clientHeight,
							document.documentElement.clientHeight
						)

						scrollOffset = (documentHeight / 100) * parseInt(scrollOffset)
					} else if (scrollOffset.includes('vh')) {
						scrollOffset = (window.innerHeight / 100) * parseInt(scrollOffset)
					}
				}

				interaction.scrollOffset = scrollOffset
			} else if (interaction.trigger === 'mouseleaveWindow') {
				interaction.trigger = 'mouseleave'
				bindToDocument = true
			}

			// 'loadMore': Check if query trail exist. If not: remove the "Load More" element
			if (interaction.action === 'loadMore') {
				const queryId = interaction?.loadMoreQuery

				if (!window.bricksData.queryLoopInstances?.[queryId]) {
					// Hide the element (@since 1.8.2), previously it was removed
					sourceEl.style.display = 'none'
				}
			}

			// Return: No more sourceEl
			if (!sourceEl) {
				return
			}

			// STEP: store the source element
			interaction.el = sourceEl

			// STEP: Interaction group Id
			interaction.groupId = bindToDocument ? 'document' : interactionGroupId

			// STEP: Store interaction
			if (!window.bricksData?.interactions) {
				window.bricksData.interactions = []
			}

			window.bricksData.interactions.push(interaction)

			// STEP: Create interaction event listeners
			switch (interaction.trigger) {
				case 'click':
				case 'mouseover':
				case 'mouseenter':
				case 'mouseleave':
				case 'focus':
				case 'blur':
					let attachEl = bindToDocument ? document.documentElement : sourceEl

					attachEl.addEventListener(interaction.trigger, bricksInteractionCallback, {
						once: interaction?.runOnce
					})
					break

				// @since 1.8.4
				case 'animationEnd':
					let targetAnimationId = interaction?.animationId || false

					// Target animation not set: Find last previous animation interaction (action is 'startAnimation'), and must be in the same interaction group
					if (!targetAnimationId) {
						let previousInteraction = window.bricksData.interactions.filter((int) => {
							return (
								int.groupId === interactionGroupId &&
								int.action === 'startAnimation' &&
								int.id !== interaction.id
							)
						})

						if (previousInteraction.length) {
							targetAnimationId = previousInteraction[previousInteraction.length - 1].id
						}
					}

					// @since 1.8.4 - Listen to `bricks/animation/end/${animationId}`
					if (targetAnimationId && targetAnimationId !== interaction.id) {
						document.addEventListener(
							`bricks/animation/end/${targetAnimationId}`,
							(evt) => {
								bricksInteractionCallbackExecution(sourceEl, interaction)
							},
							{
								once: interaction?.runOnce
							}
						)
					}
					break

				case 'contentLoaded':
					let delay = interaction?.delay || 0

					if (delay && delay.includes('ms')) {
						delay = parseInt(delay)
					} else if (delay && delay.includes('s')) {
						delay = parseFloat(delay) * 1000
					}

					setTimeout(() => {
						bricksInteractionCallbackExecution(sourceEl, interaction)
					}, delay)
					break

				case 'enterView':
					new BricksIntersect({
						element: sourceEl,
						callback: (sourceEl) => bricksInteractionCallbackExecution(sourceEl, interaction),
						once: interaction?.runOnce,
						trigger: interaction?.trigger
					})
					break

				/**
				 * Don't use rootMargin
				 *
				 * Because if element has enterView & leaveView interactions, the leaveView will be ignored when scrolling up
				 *
				 * @see #38ve0he
				 *
				 * @since 1.6.2
				 */
				case 'leaveView':
					new BricksIntersect({
						element: sourceEl,
						callback: (sourceEl) => bricksInteractionCallbackExecution(sourceEl, interaction),
						once: interaction?.runOnce,
						trigger: interaction?.trigger
					})
					break

				/**
				 * Show/Hide popup trigger
				 * @since 1.8.2
				 */
				case 'showPopup':
				case 'hidePopup':
					let listenEvent =
						interaction.trigger === 'showPopup' ? 'bricks/popup/open' : 'bricks/popup/close'
					document.addEventListener(listenEvent, (event) => {
						let popupElement = event.detail?.popupElement || false

						// Only run if this popup is the sourceEl
						if (!popupElement || popupElement !== sourceEl) {
							return
						}

						// STEP: Handle runOnce - As we are listening to a specific popup event, we cannot set once: true on addEventListener

						// Get interaction from window.bricksData.interactions
						let interactionIndex = window.bricksData.interactions.findIndex((interactionPool) => {
							return interactionPool === interaction
						})

						// If interactionIndex is not found, return
						if (interactionIndex === -1) {
							return
						}

						// Remove interaction from window.bricksData.interactions after running the callback
						if (interaction?.runOnce) {
							window.bricksData.interactions.splice(interactionIndex, 1)
						}

						// STEP: Execute callback
						bricksInteractionCallbackExecution(sourceEl, interaction)
					})
					break
			}
		})
	}
})

function bricksInteractions() {
	bricksInteractionsFn.run()
}

/**
 * Popups
 *
 * @since 1.6
 */
function bricksPopups() {
	/**
	 * Store popup elements that are already listening to close event (click popup overlay or ESC key)
	 *
	 * To prevent multiple initialization for the same popup
	 *
	 * Not used anymore as the event registered but not removed, we should remove the event listener when popup is closed (@since 1.8.4)
	 */
	// window.bricksPopupsData = {
	// 	initialized: []
	// }

	/**
	 * Popup Focus Trap
	 *
	 * @since 1.8.4
	 */
	const popupFocusTrap = (event, popupElement) => {
		if (event.key === 'Tab') {
			event.preventDefault()

			const focusableElements = bricksGetFocusables(popupElement)

			if (!focusableElements.length) {
				return
			}

			const focusedIndex = focusableElements.indexOf(document.activeElement)
			const nextIndex = event.shiftKey ? focusedIndex - 1 : focusedIndex + 1
			const nextElement = focusableElements[nextIndex]

			if (nextElement) {
				nextElement.focus()
			} else {
				focusableElements[0].focus()
			}
		}
	}

	const escClosePopup = (event, popupElement) => {
		if (event.key === 'Escape') {
			bricksClosePopup(popupElement)
		}
	}

	const backdropClosePopup = (event, popupElement) => {
		if (event.target.classList.contains('brx-popup-backdrop')) {
			bricksClosePopup(popupElement)
		}
	}

	/**
	 * Listen to document bricks/popup/open event
	 *
	 * event.detail.popupElement: Popup element
	 * event.detail.popupId: Popup id
	 *
	 * @since 1.7.1
	 */
	document.addEventListener('bricks/popup/open', (event) => {
		// STEP: Get popup element
		const popupElement = event.detail?.popupElement || false

		if (!popupElement || !bricksIsFrontend) {
			return
		}

		// Timeout is necessary to allow popup to be fully rendered & focusable (e.g. opening animation set)
		setTimeout(() => {
			//STEP: Autofocus on first focusable element inside popup (@since 1.8.4)
			if (!popupElement.dataset?.popupDisableAutoFocus) {
				let focusableElements = bricksGetFocusables(popupElement)

				if (focusableElements.length) {
					focusableElements[0].focus()
				}
			}

			// STEP: Scroll to top of popup content (@since 1.8.4)
			if (popupElement.dataset?.popupScrollToTop) {
				popupElement.querySelector('.brx-popup-content')?.scrollTo(0, 0)
			}
		}, 100)

		// STEP: Add focus trap - Not allowing to tab outside popup
		const focusTrapEventHandler = (event) => popupFocusTrap(event, popupElement)

		document.addEventListener('keydown', focusTrapEventHandler)

		// Remove the focus trap event listener when popup is closed
		document.addEventListener('bricks/popup/close', () => {
			document.removeEventListener('keydown', focusTrapEventHandler)
		})

		// STEP: Add close event listeners for popup
		const popupCloseOn = popupElement.dataset?.popupCloseOn || 'backdrop-esc'

		if (popupCloseOn.includes('esc')) {
			// STEP: Listen for ESC key pressed to close popup
			const escEventHandler = (event) => escClosePopup(event, popupElement)

			document.addEventListener('keyup', escEventHandler)

			// Remove the ESC event listener when popup is closed
			document.addEventListener('bricks/popup/close', () => {
				document.removeEventListener('keyup', escEventHandler)
			})
		}

		if (popupCloseOn.includes('backdrop')) {
			// STEP: Listen for click outside popup to close popup
			const backdropEventHandler = (event) => backdropClosePopup(event, popupElement)

			document.addEventListener('click', backdropEventHandler)

			// Remove the backdrop event listener when popup is closed
			document.addEventListener('bricks/popup/close', () => {
				document.removeEventListener('click', backdropEventHandler)
			})
		}
	})
}

/**
 * Scroll interaction listener (debounce: 100ms)
 *
 * @since 1.6
 */
function bricksScrollInteractions() {
	clearTimeout(bricksScrollTimeout)

	bricksScrollTimeout = setTimeout(() => {
		// Get scroll interactions anew on every scroll (new interactions could have been added via AJAX pagination or infinite scroll)
		let interactions = Array.isArray(window.bricksData?.interactions)
			? window.bricksData.interactions
			: []
		let scrolled = window.scrollY
		let runOnceIndexToRemove = []

		interactions.forEach((interaction, index) => {
			// Skip non-scroll interactions
			if (interaction?.trigger !== 'scroll') {
				return
			}

			if (scrolled >= interaction.scrollOffset) {
				bricksInteractionCallbackExecution(interaction.el, interaction)

				if (interaction?.runOnce) {
					runOnceIndexToRemove.push(index)
				}
			}
		})

		// Remove interaction from window.bricksData.interactions after looping over all interactions (@since 1.8.1)
		runOnceIndexToRemove.forEach((indexToRemove) => {
			window.bricksData.interactions.splice(indexToRemove, 1)
		})
	}, 100)
}

/**
 * Interactions callback
 *
 * @since 1.6
 */
function bricksInteractionCallback(event) {
	// Possible improvement: Add "Don't add e.preventDefault() to clikc interaction"
	if (event?.type === 'click') {
		// Return: Don't run interaction when clicking on an anchor ID (except for # itself)
		if (
			event.target.tagName === 'A' &&
			event.target.getAttribute('href') !== '#' &&
			event.target.getAttribute('href')?.startsWith('#')
		) {
			return
		}

		event.preventDefault()
	}

	const interactionGroupId = event?.currentTarget?.dataset?.interactionId || 'document'

	window.bricksData.interactions
		.filter((interaction) => interaction.groupId === interactionGroupId)
		.forEach((interaction) => {
			if (interaction?.trigger === event.type) {
				bricksInteractionCallbackExecution(interaction.el, interaction)
			}
		})
}

/**
 * Interaction action execution
 *
 * @since 1.6
 */
function bricksInteractionCallbackExecution(sourceEl, config) {
	const targetMode = config?.target || 'self'

	let target
	// Return: Interaction condition not fulfilled
	if (!bricksInteractionCheckConditions(config)) {
		return
	}

	switch (targetMode) {
		case 'custom':
			if (config?.targetSelector) {
				target = bricksQuerySelectorAll(document, config.targetSelector)
			}
			break

		case 'popup':
			if (config?.templateId) {
				// Target looping popup by matching 'data-interaction-loop-id' with 'data-popup-loop-id' + templateId (@since 1.8.4)
				if (sourceEl.dataset?.interactionLoopId) {
					target = bricksQuerySelectorAll(
						document,
						`.brx-popup[data-popup-id="${config.templateId}"][data-popup-loop-id="${sourceEl.dataset.interactionLoopId}"]`
					)
				}

				// No popup found: Try finding popup by 'data-popup-id'
				if (!target || !target.length) {
					target = bricksQuerySelectorAll(
						document,
						`.brx-popup[data-popup-id="${config.templateId}"]`
					)
				}
			}
			break

		default:
			target = sourceEl // = self
	}

	if (!target) {
		return
	}

	target = Array.isArray(target) ? target : [target]

	switch (config?.action) {
		case 'show':
		case 'hide':
			target.forEach((el) => {
				// Popup
				if (el?.classList.contains('brx-popup')) {
					if (config.action === 'show') {
						bricksOpenPopup(el)
					} else if (config.action === 'hide') {
						bricksClosePopup(el)
					}
				}

				// Regular element
				else {
					// Hide
					if (config.action === 'hide') {
						el.style.display = 'none'
					}

					// Show (remove display: none & only set display: block as a fallback)
					else {
						if (el.style.display === 'none') {
							el.style.display = null
						} else {
							el.style.display = 'block'
						}
					}
				}
			})
			break

		case 'setAttribute':
		case 'removeAttribute':
		case 'toggleAttribute':
			const attributeKey = config?.actionAttributeKey

			if (attributeKey) {
				target.forEach((el) => {
					let attributeValue = config?.actionAttributeValue || ''

					// Attribute 'class'
					if (attributeKey === 'class') {
						let classNames = attributeValue ? attributeValue.split(' ') : []

						classNames.forEach((className) => {
							if (config.action === 'setAttribute') {
								el.classList.add(className)
							} else if (config.action === 'removeAttribute') {
								el.classList.remove(className)
							} else {
								el.classList.toggle(className)
							}
						})
					}

					// All other attributes
					else {
						if (config.action === 'setAttribute') {
							el.setAttribute(attributeKey, attributeValue)
						} else if (config.action === 'removeAttribute') {
							el.removeAttribute(attributeKey)
						} else {
							// Toggle attribute
							if (el.hasAttribute(attributeKey)) {
								el.removeAttribute(attributeKey)
							} else {
								el.setAttribute(attributeKey, attributeValue)
							}
						}
					}
				})
			}
			break

		case 'storageAdd':
		case 'storageRemove':
		case 'storageCount':
			const storageType = config?.storageType
			const storageKey = config?.actionAttributeKey
			const storageValue = config.hasOwnProperty('actionAttributeValue')
				? config.actionAttributeValue
				: 0

			if (storageType && storageKey) {
				if (config.action === 'storageAdd') {
					bricksStorageSetItem(storageType, storageKey, storageValue)
				} else if (config.action === 'storageRemove') {
					bricksStorageRemoveItem(storageType, storageKey)
				} else if (config.action === 'storageCount') {
					let counter = bricksStorageGetItem(storageType, storageKey)

					counter = counter ? parseInt(counter) : 0

					bricksStorageSetItem(storageType, storageKey, counter + 1)
				}
			}
			break

		case 'startAnimation':
			const animationType = config?.animationType

			if (animationType) {
				target.forEach((el) => {
					// Default animation duration: 1s
					let removeAnimationAfterMs = 1000
					let isPopup = el?.classList.contains('brx-popup')

					// Apply animation to popup content (@since 1.8)
					if (isPopup) {
						el = el.querySelector('.brx-popup-content')
					}

					// Get custom animation-duration
					if (config?.animationDuration) {
						el.style.animationDuration = config.animationDuration

						if (config.animationDuration.includes('ms')) {
							removeAnimationAfterMs = parseInt(config.animationDuration)
						} else if (config.animationDuration.includes('s')) {
							removeAnimationAfterMs = parseFloat(config.animationDuration) * 1000
						}
					}

					// Get custom animation-delay
					if (config?.animationDelay) {
						el.style.animationDelay = config.animationDelay

						if (config.animationDelay.includes('ms')) {
							removeAnimationAfterMs += parseInt(config.animationDelay)
						} else if (config.animationDelay.includes('s')) {
							removeAnimationAfterMs += parseFloat(config.animationDelay) * 1000
						}
					}

					/**
					 * Animate popup
					 *
					 * @since 1.7 - Popup use removeAnimationAfterMs for setTimeout duration)
					 * @since 1.8.5 - Check config.trigger to avoid recursive error (#866aqzzwf)
					 */
					if (isPopup && config.trigger !== 'showPopup' && config.trigger !== 'hidePopup') {
						let popupNode = el.parentNode // el = .brx-popup-content

						// Animate: open popup (if animationType includes 'In')
						if (animationType.includes('In')) {
							bricksOpenPopup(popupNode, removeAnimationAfterMs)
						}
					}

					el.classList.add('brx-animated')

					el.setAttribute('data-animation', animationType)

					el.setAttribute('data-animation-id', config.id || '')

					// Remove animation class after animation duration + delay to run again
					bricksAnimationFn.run({
						elementsToAnimate: [el],
						removeAfterMs: removeAnimationAfterMs
					})
				})
			}
			break

		case 'loadMore':
			const queryId = config?.loadMoreQuery

			const queryConfig = window.bricksData.queryLoopInstances?.[queryId]

			if (!queryConfig) {
				return
			}

			// @since 1.7.1 - exclude popup from query trail
			const queryTrail = queryConfig.isPostsElement
				? document.querySelector(`.bricks-isotope-sizer[data-query-element-id="${queryId}"]`)
						?.previousElementSibling
				: Array.from(document.querySelectorAll(`.brxe-${queryId}:not(.brx-popup)`)).pop()

			if (queryTrail) {
				if (!sourceEl.classList.contains('is-loading')) {
					// Add "is-loading" class to the source element so we could style some spinner animation
					sourceEl.classList.add('is-loading')

					// Add the query ID to the trail so that the load page could fetch the query config
					queryTrail.dataset.queryElementId = queryId

					bricksQueryLoadPage(queryTrail).then((data) => {
						sourceEl.classList.remove('is-loading')

						// Remove the load more "button"
						if (data?.page >= data?.maxPages) {
							// Hide the element (@since 1.8.2), previously it was removed
							sourceEl.style.display = 'none'
						}
					})
				}
			}
			break
	}
}

/**
 * Open Bricks popup (frontend only)
 *
 * @param {obj} object Popup element node or popup ID
 *
 * @since 1.7.1
 */
function bricksOpenPopup(object, timeout = 0) {
	if (!bricksIsFrontend) {
		return
	}

	let popupElement

	// Check: Popup is element node OR popup ID
	if (object) {
		if (object.nodeType === Node.ELEMENT_NODE) {
			popupElement = object
		}

		// Check: object is the popup ID
		else if (object) {
			popupElement = document.querySelector(`.brx-popup[data-popup-id="${object}"]`)
		}
	}

	// Fallback: Get first popup on the page
	// else {popupElement = document.querySelector(`.brx-popup[data-popup-id]`)}

	if (!popupElement) {
		return
	}

	const popupId = popupElement.dataset.popupId

	// Check if the popup show limits are met
	if (bricksPopupCheckLimit(popupElement)) {
		// Show popup
		popupElement.classList.remove('hide')

		// @since 1.7.1 - Add "no-scroll" class to the body if 'data-popup-body-scroll' is not set
		if (!popupElement.dataset.popupBodyScroll) {
			document.body.classList.add('no-scroll')
		}

		// Set popup height to viewport height (@since 1.8.2)
		bricksSetVh()

		// @since 1.7.1 - Trigger custom event for the "bricks/popup/open" trigger, Provide the popup ID and the popup element
		const showPopupEvent = new CustomEvent('bricks/popup/open', {
			detail: { popupId, popupElement }
		})

		document.dispatchEvent(showPopupEvent)

		// Run counter after timeout animation finishes (delay + duration)
		setTimeout(() => {
			bricksCounter()
		}, timeout)

		// Store the number of times this popup was shown
		bricksPopupCounter(popupElement)
	}
}

/**
 * Close Bricks popup (frontend only)
 *
 * @param object Popup element node or popup ID
 *
 * @since 1.7.1
 */
function bricksClosePopup(object) {
	if (!bricksIsFrontend) {
		return
	}

	let popupElement

	// Check: Popup is element node OR popup ID
	if (object) {
		if (object.nodeType === Node.ELEMENT_NODE) {
			popupElement = object
		}

		// Check: object is the popup ID
		else if (object) {
			popupElement = document.querySelector(`.brx-popup[data-popup-id="${object}"]`)
		}
	}

	// Fallback: Get first popup on the page
	// else {popupElement = document.querySelector(`.brx-popup[data-popup-id]`)}

	if (!popupElement) {
		return
	}

	const popupId = popupElement.dataset.popupId

	popupElement.classList.add('hide')

	// @since 1.7.1 - Remove "no-scroll" class to the body if 'data-popup-body-scroll' is not set
	if (!popupElement.dataset.popupBodyScroll) {
		document.body.classList.remove('no-scroll')
	}

	// @since 1.7.1 - Trigger custom event for the "bricks/popup/close" trigger, Provide the popup ID and the popup element
	const hidePopupEvent = new CustomEvent('bricks/popup/close', {
		detail: { popupId, popupElement }
	})

	document.dispatchEvent(hidePopupEvent)
}

/**
 * Popups: Check show up limits
 *
 * true:  ok
 * false: limit overflow
 *
 * NOTE: Limits are stored in "brx_popup_${popupId}_total"
 *
 * @since 1.6
 */
function bricksPopupCheckLimit(element) {
	let limits = element?.dataset?.popupLimits
	let popupId = element?.dataset?.popupId

	if (!limits) {
		return true
	}

	try {
		limits = JSON.parse(limits)
	} catch (e) {
		console.info('error:bricksPopupCheckLimit', e)
		return true
	}

	let overflow = false

	Object.entries(limits).forEach(([key, value]) => {
		let counter = bricksStorageGetItem(key, `brx_popup_${popupId}_total`)
		counter = counter ? parseInt(counter) : 0
		overflow = overflow || counter >= value
	})

	return !overflow
}

/**
 * Popups: Store how many times popup was displayed
 *
 * NOTE: limits are stored in "brx_popup_${popupId}_total"
 *
 * @since 1.6
 */
function bricksPopupCounter(element) {
	let limits = element?.dataset?.popupLimits
	let popupId = element?.dataset?.popupId

	if (!limits) {
		return
	}

	try {
		limits = JSON.parse(limits)
	} catch (e) {
		console.info('error:bricksPopupCounter', e)
		return true
	}

	Object.entries(limits).forEach(([key, value]) => {
		let counter = bricksStorageGetItem(key, `brx_popup_${popupId}_total`)

		counter = counter ? parseInt(counter) : 0

		bricksStorageSetItem(key, `brx_popup_${popupId}_total`, counter + 1)
	})
}

/**
 * Check interactions conditions
 *
 * @since 1.6
 */
function bricksInteractionCheckConditions(config) {
	// STEP: No conditions
	if (!Array.isArray(config?.interactionConditions)) {
		return true
	}

	let relation = config?.interactionConditionsRelation || 'and'

	// Start with true if relation is 'and', false otherwise ('or')
	let runInteraction = relation === 'and'

	/**
	 * Convert storage value to number to be used in >=, <=, >, < conditions
	 *
	 * @see #862j9fr6y
	 *
	 * @since 1.7.1
	 */
	const convertToNumber = (value) => (!isNaN(value) ? parseFloat(value) : 0)

	// STEP: Check the interaction conditions
	config.interactionConditions.forEach((condition) => {
		let conditionType = condition?.conditionType
		let storageKey = condition?.storageKey || false
		let runCondition = false

		if (conditionType && storageKey) {
			let storageCompare = condition?.storageCompare || 'exists'
			let storageCompareValue = condition?.storageCompareValue

			let storageValue = bricksStorageGetItem(conditionType, storageKey)

			switch (storageCompare) {
				case 'exists':
					runCondition = storageValue !== null
					break

				case 'notExists':
					runCondition = storageValue === null
					break

				case '==':
					runCondition = storageValue == storageCompareValue
					break

				case '!=':
					runCondition = storageValue != storageCompareValue
					break

				case '>=':
					runCondition = convertToNumber(storageValue) >= convertToNumber(storageCompareValue)
					break

				case '<=':
					runCondition = convertToNumber(storageValue) <= convertToNumber(storageCompareValue)
					break

				case '>':
					runCondition = convertToNumber(storageValue) > convertToNumber(storageCompareValue)
					break

				case '<':
					runCondition = convertToNumber(storageValue) < convertToNumber(storageCompareValue)
					break
			}
		} else {
			runCondition = true
		}

		runInteraction =
			relation === 'and' ? runInteraction && runCondition : runInteraction || runCondition
	})

	return runInteraction
}

/**
 * Storage helper function to get value stored under a specific key
 *
 * @since 1.6
 */
function bricksStorageGetItem(type, key) {
	if (!key) {
		return
	}

	let value

	try {
		switch (type) {
			// Per page load
			case 'windowStorage':
				value = window.hasOwnProperty(key) ? window[key] : null
				break

			// Per session
			case 'sessionStorage':
				value = sessionStorage.getItem(key)
				break

			// Across sessions
			case 'localStorage':
				value = localStorage.getItem(key)
				break
		}
	} catch (e) {
		console.info('error:bricksStorageGetItem', e)
	}

	return value
}

/**
 * Storage helper function to set value for a specific storage key
 *
 * @since 1.6
 */
function bricksStorageSetItem(type, key, value) {
	if (!key) {
		return
	}

	try {
		switch (type) {
			case 'windowStorage':
				window[key] = value
				break

			case 'sessionStorage':
				sessionStorage.setItem(key, value)
				break

			case 'localStorage':
				localStorage.setItem(key, value)
				break
		}
	} catch (e) {
		console.info('error:bricksStorageSetItem', e)
	}
}

/**
 * Storage helper function to remove a specific storage key
 *
 * @since 1.6
 */
function bricksStorageRemoveItem(type, key) {
	if (!key) {
		return
	}

	try {
		switch (type) {
			case 'windowStorage':
				delete window[key]
				break

			case 'sessionStorage':
				sessionStorage.removeItem(key)
				break

			case 'localStorage':
				localStorage.removeItem(key)
				break
		}
	} catch (e) {
		console.info('error:bricksStorageRemoveItem', e)
	}
}

/**
 * Nav nested
 *
 * Mobile menu toggle
 *
 * Listeners:
 * - press ESC key to close .brx-nav-nested-items & auto-focus on mobile menu toggle
 * - press ENTER or SPACE to open .brxe-nav-nested-inner
 *
 * NOTE: Mobile menu toggle via .brx-toggle-div listener
 *
 * @since 1.8
 */
function bricksNavNested() {
	// Return: Builder has its own logic for showing the brx-nav-nested-items while editing
	if (!bricksIsFrontend) {
		return
	}

	let navNestedObserver = new MutationObserver((mutations) => {
		mutations.forEach((mutation) => {
			if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
				let navNested = mutation.target

				// STEP: Open navNested
				if (navNested.classList.contains('brx-open')) {
					// Set popup height to viewport height (@since 1.8.2)
					bricksSetVh() // Nav nested mobile menu uses 'top' & 'bottom' 0 instead of 100vh, though

					// Add class to body to prevent scrolling
					document.body.classList.add('no-scroll')

					// Close toggle inside navNested is open
					let toggleInside = navNested.querySelector('.brx-nav-nested-items button.brxe-toggle')

					if (toggleInside) {
						setTimeout(() => {
							toggleInside.classList.add('is-active')
							toggleInside.setAttribute('aria-expanded', true)
							toggleInside.focus()
						}, 10)
					}

					// Auto-focus on first focusable element inside .brx-nav-nested
					else {
						let focusableElements = bricksGetFocusables(navNested)

						if (focusableElements.length) {
							focusableElements[0].focus()
						}
					}
				}

				// STEP: Close nav nested
				else {
					// Remove class to body to prevent scrolling
					document.body.classList.remove('no-scroll')

					// Focus on toggle element that opened the nav nested ([data-toggle-script-id])
					let toggleScriptId = navNested.dataset.toggleScriptId
					let toggleNode = document.querySelector(`button[data-script-id="${toggleScriptId}"]`)

					if (toggleNode) {
						toggleNode.setAttribute('aria-expanded', false)
						toggleNode.classList.remove('is-active')
						toggleNode.focus()
					}
				}
			}
		})
	})

	let navNestedElements = bricksQuerySelectorAll(document, '.brxe-nav-nested')

	if (!navNestedElements.length) {
		return
	}

	// STEP: Observe class list changes on .brxe-nav-nested
	navNestedElements.forEach((navNested) => {
		navNestedObserver.observe(navNested, {
			attributes: true,
			attributeFilter: ['class']
		})
	})

	// STEP: ESC key pressed: Close mobile menu
	document.addEventListener('keyup', (e) => {
		if (e.key === 'Escape') {
			bricksNavNestedClose()
		}
	})

	// STEP: Click outside of .brxe-nav-nested && not on a toggle: Close mobile menu
	document.addEventListener('click', (e) => {
		let navNested = e.target.closest('.brxe-nav-nested')
		let clickOnToggle = e.target.closest('.brxe-toggle')

		if (!navNested && !clickOnToggle) {
			bricksNavNestedClose()
		}
	})
}

/**
 * Nav nested: Close mobile menu
 */
function bricksNavNestedClose() {
	let navNestedOpen = bricksQuerySelectorAll(document, '.brxe-nav-nested.brx-open')

	navNestedOpen.forEach((navNested) => {
		navNested.classList.add('brx-closing')

		// Close .brx-open after 200ms to prevent mobile menu styles from unsetting while mobile menu fades out
		setTimeout(() => {
			navNested.classList.remove('brx-closing')
			navNested.classList.remove('brx-open')
		}, 200)
	})
}

/**
 * Offcanvas element
 *
 * - Show by adding .show (click on toggle)
 * - Close by removeing .show (backdrop click/ESC key press)
 *
 * @since 1.8
 */
function bricksOffcanvas() {
	if (!bricksIsFrontend) {
		return
	}

	let offcanvasElements = bricksQuerySelectorAll(document, '.brxe-offcanvas')

	if (!offcanvasElements.length) {
		return
	}

	let offcanvasObserver = new MutationObserver((mutations) => {
		mutations.forEach((mutation) => {
			if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
				let offcanvas = mutation.target
				let inner = offcanvas.querySelector('.brx-offcanvas-inner')
				let transitionDuration = inner
					? (transitionDuration =
							parseFloat(window.getComputedStyle(inner).getPropertyValue('transition-duration')) *
							1000)
					: 200

				// STEP: Open offcanvas
				if (offcanvas.classList.contains('brx-open')) {
					// Set popup height to viewport height (@since 1.8.2)
					bricksSetVh()

					// Offset body by height/width of offcanvas
					if (offcanvas.dataset.effect === 'offset') {
						if (inner) {
							// Get CSS transition value of .brx-offcanvas-inner
							let direction = offcanvas.getAttribute('data-direction')
							let transition = window.getComputedStyle(inner).getPropertyValue('transition')

							document.body.style.margin = '0'
							document.body.style.transition = transition.replace('transform', 'margin')

							// Offset body by height/width of offcanvas

							// Horizontal (top/bottom)
							if (direction === 'top') {
								document.body.style.marginTop = `${inner.offsetHeight}px`
							} else if (direction === 'bottom') {
								document.body.style.marginTop = `-${inner.offsetHeight}px`
							}

							// Vertical (left/right)
							else if (direction === 'left') {
								document.body.style.marginLeft = `${inner.offsetWidth}px`
								document.body.style.overflowX = 'hidden'
							} else if (direction === 'right') {
								document.body.style.marginLeft = `-${inner.offsetWidth}px`
								document.body.style.overflowX = 'hidden'
							}
						}
					}

					// Disable body scroll
					if (offcanvas.dataset.noScroll) {
						document.body.classList.add('no-scroll')
					}

					// Auto-focus on first focusable element inside .brx-offcanvas
					let focusableElements = bricksGetFocusables(offcanvas)

					if (focusableElements.length) {
						focusableElements[0].focus()
					}

					// Toggle inside offcanvas is open
					let offcanvasToggle = offcanvas.querySelector('.brx-offcanvas-inner > button.brxe-toggle')

					if (offcanvasToggle) {
						offcanvasToggle.classList.add('is-active')
						offcanvasToggle.setAttribute('aria-expanded', true)
					}
				}

				// STEP: Close offcanvas
				else {
					// Keep offcanvas visible until closing transition is finished (don't use class to prevent infinite MutationObserver loop)
					offcanvas.style.visibility = 'visible'

					// Focus on toggle element that opened the offcanvas ([data-toggle-script-id])
					let toggleScriptId = offcanvas.dataset.toggleScriptId
					let toggleNode = document.querySelector(`button[data-script-id="${toggleScriptId}"]`)

					if (toggleNode) {
						toggleNode.setAttribute('aria-expanded', false)
						toggleNode.classList.remove('is-active')
						toggleNode.focus()
					}

					if (offcanvas.dataset.effect === 'offset') {
						if (document.body.style.marginTop) {
							document.body.style.margin = '0'
						}

						setTimeout(() => {
							document.body.style.margin = null
							document.body.style.overflow = null
							document.body.style.transition = null
						}, transitionDuration)
					}

					setTimeout(() => {
						// Set visibility back to hidden by removing the inline style
						offcanvas.style.visibility = null

						// Re-enable body scroll
						if (offcanvas.dataset.noScroll) {
							document.body.classList.remove('no-scroll')
							bricksSubmenuPosition()
						}
					}, transitionDuration)
				}
			}
		})
	})

	offcanvasElements.forEach((offcanvas) => {
		// STEP: Observe class list changes on .brxe-offcanvas
		offcanvasObserver.observe(offcanvas, {
			attributes: true,
			attributeFilter: ['class']
		})

		// STEP: Close offcanvas when clicking on backdrop
		let backdrop = offcanvas.querySelector('.brx-offcanvas-backdrop')

		if (backdrop) {
			backdrop.addEventListener('click', (e) => {
				bricksOffcanvasClose()
			})
		}
	})

	// STEP: ESC key pressed: Close offcanvas & focus on offcanvas toggle button
	document.addEventListener('keyup', (e) => {
		if (e.key === 'Escape') {
			bricksOffcanvasClose()
		}
	})
}

/**
 * Close all open offcanvas elements
 *
 * @since 1.8
 */
function bricksOffcanvasClose() {
	let openOffcanvasElements = bricksQuerySelectorAll(document, '.brxe-offcanvas.brx-open')

	openOffcanvasElements.forEach((openOffcanvas) => {
		openOffcanvas.classList.remove('brx-open')
	})
}

/**
 * Toggle mobile menu open inside "Div" inside .brx-nav-nested-items
 *
 * Set diplay on div according to toggle display (initially and on window resize).
 *
 * @since 1.8
 */
function bricksToggleDisplay() {
	let toggleElements = bricksQuerySelectorAll(document, '.brxe-toggle')

	if (!toggleElements.length) {
		return
	}

	toggleElements.forEach((toggle) => {
		// Mobile menu close toggle inside 'div' inside .brx-nav-nested-items: Hide div
		if (
			toggle.closest('.brx-nav-nested-items') &&
			!toggle.parentNode.classList.contains('brx-nav-nested-items') &&
			!toggle.parentNode.classList.contains('brx-toggle-div')
		) {
			// Hide parent div if toggle is hidden
			let toggleStyles = window.getComputedStyle(toggle)

			if (toggleStyles.display === 'none') {
				toggle.parentNode.style.display = 'none'
			} else {
				toggle.parentNode.style.display = null
			}
		}
	})
}

/**
 * Toggle element
 *
 * Default toggles:
 *
 * - Nav nested mobile menu (.brxe-nav-nested)
 * - Offcanvas element (.brxe-offcanvas)
 *
 * @since 1.8
 */
function bricksToggle() {
	if (!bricksIsFrontend) {
		return
	}

	let toggleElements = bricksQuerySelectorAll(document, '.brxe-toggle')

	if (!toggleElements.length) {
		return
	}

	bricksToggleDisplay()

	toggleElements.forEach((toggle) => {
		toggle.addEventListener('click', (e) => {
			e.preventDefault()

			// Toggle selector, attribute, and value
			let toggleSelector = toggle.dataset?.selector || '.brxe-offcanvas'
			let toggleAttribute = toggle.dataset?.attribute || 'class'
			let toggleValue = toggle.dataset?.value || 'brx-open'
			let toggleElement = toggleSelector ? document.querySelector(toggleSelector) : false

			// Element: nav-nested
			if (!toggleElement) {
				toggleElement = toggle.closest('.brxe-nav-nested')
			}

			// Element: offcanvas
			if (!toggleElement) {
				toggleElement = toggle.closest('.brxe-offcanvas')
			}

			if (!toggleElement) {
				return
			}

			// Re-calculcate mega menu position & width to prevent scrollbars
			if (document.querySelector('.brx-has-megamenu')) {
				// If not close toggle inside offcanvas with offset effect
				if (!e.target.closest('[data-effect="offset"]')) {
					bricksSubmenuPosition(0)
				}
			}

			// STEP: Set data-toggle-script-id as selector to focus back to toggle when closing via ESC key
			if (toggle.dataset.scriptId && !toggleElement.dataset.toggleScriptId) {
				toggleElement.dataset.toggleScriptId = toggle.dataset.scriptId
			}

			// STEP: Toggle 'aria-expanded' & .is-active on the toggle
			let expanded = toggle.getAttribute('aria-expanded') === 'true'
			toggle.setAttribute('aria-expanded', !expanded)
			toggle.classList.toggle('is-active')

			// STEP: Toggle class OR other attribute
			if (toggleAttribute === 'class') {
				// Close .brx-open after 200ms to prevent mobile menu styles from unsetting while mobile menu fades out
				if (
					toggle.closest('.brxe-nav-nested') &&
					toggleValue === 'brx-open' &&
					toggleElement.classList.contains('brx-open')
				) {
					toggleElement.classList.add('brx-closing')
					setTimeout(() => {
						toggleElement.classList.remove('brx-closing')
						toggleElement.classList.remove('brx-open')
					}, 200)
				} else {
					toggleElement.classList.toggle(toggleValue)
				}
			} else {
				if (toggleElement.getAttribute(toggleAttribute)) {
					toggleElement.removeAttribute(toggleAttribute)
				} else {
					toggleElement.setAttribute(toggleAttribute, toggleValue)
				}
			}

			// STEP: Focus on first focusable element inside target
			let focusableElements = bricksGetFocusables(toggleElement)

			if (focusableElements.length) {
				focusableElements[0].focus()
			}
		})
	})
}

/**
 * Toggle sub menu: Nav menu, Dropdown
 *
 * Toggle:
 * - click on dropdown toggle
 * - press ENTER key
 * - press SPACE key
 *
 * Hide:
 * - click outside dropdown
 * - click on another dropdown toggle
 * - press ESC key
 * - press TAB key to tab out of dropdown
 *
 * Not added:
 * - press ARROR UP/DOWN key to navigate dropdown items (prevents page scroll)
 *
 * @since 1.8
 */
function bricksSubmenuToggle(toggle, action = 'toggle') {
	// Menu item: Parent of .brx-submenu-toggle (@since 1.8 to allow usage of non 'li' HTML tag on dropdown element)
	let menuItem = toggle.parentNode.classList.contains('brx-submenu-toggle')
		? toggle.parentNode.parentNode
		: false

	// Return: No menu item found
	if (!menuItem) {
		return
	}

	// STEP: Multilevel menu
	let multilevel = toggle.closest('.brx-has-multilevel')

	if (multilevel) {
		// Hide currently active parent menu item (if it's not a megamenu)
		let activeMenuItem = menuItem.parentNode.closest('.active')
		if (activeMenuItem && !activeMenuItem.classList.contains('brx-has-megamenu')) {
			activeMenuItem.classList.remove('active')
		}

		// Focus on first focusable element in submenu (small timoute required)
		setTimeout(() => {
			let submenu = menuItem.querySelector('ul') || menuItem.querySelector('.brx-dropdown-content')
			if (submenu) {
				let focusables = bricksGetFocusables(submenu)
				if (focusables.length) {
					focusables[0].focus()
				}
			}
		}, 100)
	}

	// add, remove, toggle .open class (& add/remove .active class)
	if (action === 'add') {
		menuItem.classList.add('open')
		menuItem.classList.add('active')
	} else if (action === 'remove') {
		menuItem.classList.remove('open')
		menuItem.classList.remove('active')
	} else {
		menuItem.classList.toggle('open')
	}

	// Set 'aria-expanded'
	toggle.setAttribute('aria-expanded', menuItem.classList.contains('open'))

	// Re-position submenu on every toggle
	// bricksSubmenuPosition(100)
}

/**
 *
 * Sub menu event listeners (Nav menu, Dropdown)
 *
 * mouseenter: Open submenu
 * mouseleave: Close submenu
 * Escape key pressed: Close all open sub menus outside non-active element
 * Click outside submenu: Close all open sub menus
 *
 * @since 1.8
 */
function bricksSubmenuListeners() {
	// STEP: Toggle submenu on mouseenter & mouseleave (desktop menu only)
	let submenuItems = bricksQuerySelectorAll(document, '.bricks-nav-menu .menu-item-has-children')

	// Include Dropdown elements
	let dropdownMenuItems = bricksQuerySelectorAll(document, '.brxe-dropdown')
	submenuItems = submenuItems.concat(dropdownMenuItems)

	submenuItems.forEach((submenuItem) => {
		// Skip mouse listeners: Static, Multilevel, active menu item
		let skipMouseListeners =
			submenuItem.closest('[data-static]') ||
			submenuItem.closest('.brx-has-multilevel') ||
			submenuItem.classList.contains('active')

		if (skipMouseListeners) {
			return
		}

		// Open submenu on mouseenter
		submenuItem.addEventListener('mouseenter', function (e) {
			// Return: Mobile menu (Nav menu, Nav nested)
			if (
				submenuItem.closest('.show-mobile-menu') ||
				submenuItem.closest('.brxe-nav-nested.brx-open')
			) {
				return
			}

			// Return: Toggle on "click"
			if (submenuItem.getAttribute('data-toggle') === 'click') {
				return
			}

			let toggle = e.target.querySelector('[aria-expanded="false"]')

			if (toggle) {
				bricksSubmenuToggle(toggle)
			}
		})

		// Close submenu on mouseleave
		submenuItem.addEventListener('mouseleave', function (e) {
			// Skip mobile menu (Nav menu, Nav nested)
			if (
				submenuItem.closest('.show-mobile-menu') ||
				submenuItem.closest('.brxe-nav-nested.brx-open')
			) {
				return
			}

			// Return: Toggle on "click"
			if (submenuItem.getAttribute('data-toggle') === 'click') {
				return
			}

			let toggle = e.target.querySelector('[aria-expanded="true"]')

			if (toggle) {
				// Return: If submenu is .active (opened manually via toggle click)
				let menuItem = toggle.closest('.menu-item')

				if (!menuItem) {
					menuItem = toggle.closest('.brxe-dropdown')
				}

				if (menuItem && menuItem.classList.contains('active')) {
					return
				}

				bricksSubmenuToggle(toggle)
			}
		})
	})

	document.addEventListener('keyup', function (e) {
		if (e.key === 'Escape') {
			// STEP: Hide closest submenu & focus on parent
			let openSubmenu = e.target.closest('.open')
			let multilevel = e.target.closest('.brx-has-multilevel')

			if (openSubmenu && !multilevel) {
				let toggle = openSubmenu.querySelector('.brx-submenu-toggle button[aria-expanded]')

				if (toggle) {
					bricksSubmenuToggle(toggle, 'remove')

					// Focus on parent
					if (toggle) {
						toggle.focus()
					}
				}
			}

			// STEP: Close all open submenus (multilevel)
			else {
				let openSubmenuToggles = bricksQuerySelectorAll(
					document,
					'.brx-submenu-toggle > button[aria-expanded="true"]'
				)

				openSubmenuToggles.forEach((toggle) => {
					if (toggle) {
						bricksSubmenuToggle(toggle, 'remove')
					}
				})
			}
		}

		// STEP: Tabbed out of menu item: Close menu item (if it does not contain the active element)
		else if (e.key === 'Tab' && !e.shiftKey) {
			setTimeout(() => {
				let openToggles = bricksQuerySelectorAll(document, '[aria-expanded="true"]')

				// NOTE: Can't listen to tabbing out of window (in case there is no focusable element after the last open submenu on the page)
				openToggles.forEach((toggle) => {
					let menuItem = toggle.closest('.menu-item')

					if (!menuItem) {
						menuItem = toggle.closest('.brxe-dropdown')
					}

					if (
						(menuItem && !menuItem.contains(document.activeElement)) ||
						document.activeElement.tagName === 'BODY'
					) {
						bricksSubmenuToggle(toggle)
					}
				})
			}, 0)
		}
	})

	document.addEventListener('click', (e) => {
		let linkUrl =
			e.target.nodeName === 'A' && e.target.hasAttribute('href')
				? e.target.getAttribute('href')
				: ''

		if (linkUrl) {
			// Return: Link URL does not contain hash (#)
			if (!linkUrl.includes('#')) {
				return
			}

<<<<<<< HEAD
			// Prevent default on anchor link (#)
			if (linkUrl === '#') {
				e.preventDefault()
			}

			// Click on section anchor link (e.g. #section)
=======
			// Prevent default on anchor ID (#)
			else if (linkUrl === '#') {
				e.preventDefault()
			}

			// Click on section anchor ID (e.g. #section) inside offcanvas: Close offcanvas
>>>>>>> improve/#862jy7jtk-open-tabs-or-accordion-via-anchor-link
			else {
				// Inside offcanvas: Close offcanvas
				let offcanvas = e.target.closest('.brxe-offcanvas')
				if (offcanvas) {
					bricksOffcanvasClose()
				}

				// Inside mobile menu: Close mobile menu (@since 1.8.4)
				else {
					let isMobileMenu = e.target.closest('.brxe-nav-nested.brx-open')
					if (isMobileMenu) {
						bricksNavNestedClose()

						// Scroll to anchor link (after 200ms when mobile menu is closed)
						let element = document.querySelector(linkUrl)

						if (element) {
							setTimeout(() => {
								element.scrollIntoView()
							}, 200)
						}
					}
				}
			}
		}

		// STEP: Toggle submenu button click (default) OR entire .brx-submenu-toggle on click (if 'toggleOn' set to: click, or both)
		let submenuToggle = e.target.closest('.brx-submenu-toggle')
		if (submenuToggle) {
			let toggleOn = 'hover'

			let toggleOnNode = submenuToggle.closest('[data-toggle]')
			if (toggleOnNode) {
				toggleOn = toggleOnNode.getAttribute('data-toggle')
			}

			// Nav menu: Toggle on entire .brx-submenu-toggle click
			if (submenuToggle.closest('.brxe-nav-menu.show-mobile-menu')) {
				toggleOn = 'click'
			}

			// Nav nested: Toggle on entire .brx-submenu-toggle click
			if (submenuToggle.closest('.brxe-nav-nested.brx-open')) {
				toggleOn = 'click'
			}

			let toggleButton =
				toggleOn === 'hover'
					? e.target.closest('[aria-expanded]')
					: submenuToggle.querySelector('button[aria-expanded]')

			/**
			 * Return: Toggle on set to "hover"
			 *
			 * @sinc 1.8.4: Remove e.screenX = 0 && e.screenY = 0 check as not working in Safari
			 */
			let isKeyboardEvent = e.detail === 0
			if (!isKeyboardEvent && toggleOn !== 'click' && toggleOn !== 'both') {
				toggleButton = null
			}

			if (toggleButton) {
				bricksSubmenuToggle(toggleButton)

				// Set .open & active & aria-expanded in case toggle was already .open on mouseenter
				let menuItem = submenuToggle.parentNode
				menuItem.classList.toggle('active')

				setTimeout(() => {
					if (menuItem.classList.contains('active')) {
						menuItem.classList.add('open')
					}

					toggleButton.setAttribute('aria-expanded', menuItem.classList.contains('open'))
				}, 0)
			}
		}

		// STEP: Click outside submenu: Close open sub menus
		let openSubmenuButtons = bricksQuerySelectorAll(
			document,
			'.brx-submenu-toggle > button[aria-expanded="true"]'
		)

		openSubmenuButtons.forEach((toggleButton) => {
			let menuItem = toggleButton.closest('li')

			if (!menuItem) {
				menuItem = toggleButton.closest('.brxe-dropdown')
			}

			if (!menuItem || menuItem.contains(e.target)) {
				return
			}

			bricksSubmenuToggle(toggleButton)
			menuItem.classList.remove('active')
		})
	})
}

/**
 * Submenu position (re-run on window resize)
 *
 * Mega menu: Nav menu (Bricks template) & Dropdown.
 * Re-position submenu in case of viewport overflow.
 *
 * @param {number} timeout Timeout in ms before calculating submenu position.
 *
 * @since 1.8
 */
function bricksSubmenuPosition(timeout = 0) {
	setTimeout(() => {
		let docWidth = document.body.clientWidth // document width without scrollbar
		let submenuToggles = bricksQuerySelectorAll(document, '.brx-submenu-toggle')

		submenuToggles.forEach((submenuToggle) => {
			let menuItem = submenuToggle.parentNode
			let submenu =
				menuItem.querySelector('.brx-megamenu') ||
				menuItem.querySelector('.brx-dropdown-content') ||
				menuItem.querySelector('ul')

			// Submenu has aria-current="page" menu item: Add .aria-current to toplevel .brx-submenu-toggle
			if (submenu.querySelector('[aria-current="page"]')) {
				submenuToggle.classList.add('aria-current')
			}

			// Skip: Static submenu (e.g. Dropdown inside Offcanvas)
			if (menuItem.hasAttribute('data-static')) {
				return
			}

			// Skip: Submenu not found
			if (!submenu) {
				return
			}

			// STEP: Mega menu
			let hasMegamenu = menuItem.classList.contains('brx-has-megamenu')

			if (hasMegamenu) {
				let offsetLeft = menuItem.offsetLeft + 1 // + 1px to prevent horizontal scrollbar (@since 1.8)
				if (offsetLeft) {
					submenu.style.left = `-${offsetLeft}px`
				}

				// Set 'left' & 'min-width' of custom selector
				let megaMenuWidthNode = menuItem.dataset.megaMenu
					? document.querySelector(menuItem.dataset.megaMenu)
					: false

				if (megaMenuWidthNode) {
					let megaMenuWidthNodeRect = megaMenuWidthNode.getBoundingClientRect()
					submenu.style.left = `-${offsetLeft - megaMenuWidthNodeRect.left}px`
					submenu.style.minWidth = `${megaMenuWidthNodeRect.width}px`
				}

				// Default: Cover entire body width
				else {
					submenu.style.minWidth = `${document.body.clientWidth}px`
				}
			}

			// STEP: Default submenu
			else {
				// Remove overflow class to reapply logic on window resize
				if (submenu.classList.contains('brx-multilevel-overflow-right')) {
					submenu.classList.remove('brx-multilevel-overflow-right')
				}

				if (submenu.classList.contains('brx-submenu-overflow-right')) {
					submenu.classList.remove('brx-submenu-overflow-right')
				}

				if (submenu.classList.contains('brx-sub-submenu-overflow-right')) {
					submenu.classList.remove('brx-sub-submenu-overflow-right')
				}

				// STEP: Re-position in case of viewport overflow
				let submenuRect = submenu.getBoundingClientRect()
				let submenuWidth = submenuRect.width
				let submenuRight = submenuRect.right
				let submenuLeft = Math.ceil(submenuRect.left)

				// STEP: Submenu wider than viewport: Set submenu to viewport width
				if (submenuWidth > docWidth) {
					submenu.style.left = `-${submenuLeft}px`
					submenu.style.minWidth = `${docWidth}px`
				}

				// STEP: Dropdown content overflows viewport to the right: Re-position to prevent horizontal scrollbar
				else if (submenuRight > docWidth) {
					let multilevel = submenu.closest('.brx-has-multilevel')
					let isToplevel =
						!menuItem.parentNode.closest('.menu-item') &&
						!menuItem.parentNode.closest('.brxe-dropdown')

					// Top level of multilevel menu: Position all menus to the right
					if (multilevel) {
						submenu.classList.add('brx-multilevel-overflow-right')
					}

					// Default submenu
					else {
						if (isToplevel) {
							submenu.classList.add('brx-submenu-overflow-right')
						} else {
							submenu.classList.add('brx-sub-submenu-overflow-right')
						}
					}
				}

				// STEP: Dropdown content overflows viewport on the left (RTL)
				else if (submenuLeft < 0) {
					submenu.style.left = '100%'
					submenu.style.right = 'auto'
				}
			}
		})
	}, timeout)
}

/**
 * Multi level menu item: "Nav menu" OR "Dropdown" element
 *
 * Add 'back' text to multilevel submenus & click listeners.
 *
 * @since 1.8
 */
function bricksMultilevelMenu() {
	// STEP: Nav nested: Multilevel enabled
	let navNestedElements = bricksQuerySelectorAll(document, '.brxe-nav-nested.multilevel')

	navNestedElements.forEach((navNested) => {
		let backText = navNested.getAttribute('data-back-text')
		let dropdowns = navNested.querySelectorAll('.brxe-dropdown')

		dropdowns.forEach((dropdown) => {
			dropdown.classList.add('brx-has-multilevel')
			dropdown.setAttribute('data-toggle', 'click')
			dropdown.setAttribute('data-back-text', backText)
		})
	})

	// STEP: Create "back" HTML & listeners
	let multilevelItems = bricksQuerySelectorAll(document, '.brx-has-multilevel')

	multilevelItems.forEach((menuItem) => {
		let backText = menuItem.getAttribute('data-back-text') || 'Back'
		let submenus = bricksQuerySelectorAll(menuItem, 'ul')

		submenus.forEach((submenu, index) => {
			// Return on top level menu item
			if (index === 0) {
				return
			}

			// Add back list item as first submenu node: li > a.brx-multilevel-back
			let backLink = document.createElement('a')
			backLink.classList.add('brx-multilevel-back')
			backLink.setAttribute('href', '#')
			backLink.innerText = backText

			let backListItem = document.createElement('li')
			backListItem.classList.add('menu-item')
			backListItem.appendChild(backLink)

			submenu.insertBefore(backListItem, submenu.firstChild)

			// Listener to click on back link
			backLink.addEventListener('click', function (e) {
				e.preventDefault()

				// Hide current submenu
				let activeMenuItem = e.target.closest('.active')
				if (activeMenuItem) {
					activeMenuItem.classList.remove('open')
					activeMenuItem.classList.remove('active')

					// Set: aria-label="false"
					let submenuToggle = activeMenuItem.querySelector('.brx-submenu-toggle > button')
					if (submenuToggle) {
						submenuToggle.setAttribute('aria-expanded', false)
					}

					// Set parent menu item to active
					let parentMenuItem = activeMenuItem.parentNode.closest('.open')
					if (parentMenuItem) {
						parentMenuItem.classList.add('active')

						let parentSubmenu = parentMenuItem.querySelector('ul')
						if (parentSubmenu) {
							// Focus on first focusable element in parent menu item
							let focusables = bricksGetFocusables(parentSubmenu)
							if (focusables.length) {
								focusables[0].focus()
							}
						}
					}
				}
			})
		})
	})
}

/**
 * Nav menu: Open/close mobile menu
 *
 * Open/close: Click on mobile menu hamburger
 * Close: Click on mobile menu overlay OR press ESC key
 */
function bricksNavMenuMobile() {
	let toggles = bricksQuerySelectorAll(document, '.bricks-mobile-menu-toggle')

	if (!toggles.length) {
		return
	}

	// STEP: Observe mobile menu toggle via MutationObserver (.show-mobile-menu class)
	let navMenuObserver = new MutationObserver((mutations) => {
		// Set popup height to viewport height (@since 1.8.2)
		bricksSetVh()

		mutations.forEach((mutation) => {
			// Add/remove .no-scroll body class
			if (mutation.target.classList.contains('show-mobile-menu')) {
				document.body.classList.add('no-scroll')
			} else {
				document.body.classList.remove('no-scroll')
			}
		})
	})

	// STEP: Observe class list changes on .brxe-nav-nested
	toggles.forEach((toggle) => {
		let navMenu = toggle.closest('.brxe-nav-menu')
		navMenuObserver.observe(navMenu, {
			attributes: true,
			attributeFilter: ['class']
		})
	})

	// STEP: Toggle mobile menu (click on hamburger)
	document.addEventListener('click', (e) => {
		mobileMenuToggle = e.target.closest('.bricks-mobile-menu-toggle')

		if (mobileMenuToggle) {
			// Toggle mobile menu
			let navMenu = mobileMenuToggle.closest('.brxe-nav-menu')
			navMenu.classList.toggle('show-mobile-menu')

			// Toggle aria-expanded
			let expanded = navMenu.classList.contains('show-mobile-menu')
			mobileMenuToggle.setAttribute('aria-expanded', expanded)

			// Auto-focus first focusable element in mobile menu
			if (expanded) {
				setTimeout(() => {
					let navMenuMobile = navMenu.querySelector('.bricks-mobile-menu-wrapper')
					let focusableElements = bricksGetFocusables(navMenuMobile)

					if (focusableElements.length) {
						focusableElements[0].focus()
					}
				}, 10)
			}
		}
	})

	// STEP: Close mobile menu: Click on mobile menu overlay OR section anchor ID was clicked (e.g. #section)
	document.addEventListener('click', (e) => {
		let navMenu = e.target.closest('.brxe-nav-menu')

		if (!navMenu) {
			return
		}

		// Click on overlay: Close mobile menu
		if (e.target.classList.contains('bricks-mobile-menu-overlay')) {
			navMenu.classList.remove('show-mobile-menu')

			// Toggle aria-expanded
			navMenu.querySelector('.bricks-mobile-menu-toggle').setAttribute('aria-expanded', false)
		}

		// Click on anchor ID: Close mobile menu
		else if (e.target.closest('.bricks-mobile-menu-wrapper')) {
			let navLinkUrl = e.target.tagName === 'A' ? e.target.getAttribute('href') : ''

			// Close section link click (e.g.: #portfolio)
			if (navLinkUrl.length > 1 && navLinkUrl.includes('#')) {
				navMenu.classList.remove('show-mobile-menu')

				// Toggle aria-expanded
				navMenu.querySelector('.bricks-mobile-menu-toggle').setAttribute('aria-expanded', false)
			}
		}
	})

	// STEP: ESC key pressed: Close mobile menu & focus on mobile menu toggle button
	document.addEventListener('keyup', (e) => {
		if (e.key === 'Escape') {
			let openMobileMenu = document.querySelector('.brxe-nav-menu.show-mobile-menu')

			if (openMobileMenu) {
				openMobileMenu.classList.remove('show-mobile-menu')

				let toggle = openMobileMenu.querySelector('bricks-mobile-menu-toggle')

				if (toggle) {
					toggle.setAttribute('aria-expanded', false)

					setTimeout(() => {
						toggle.focus()
					}, 10)
				}
			}
		}
	})
}

/**
 * Helper function to get all focusable elements to auto-focus on (accessibility)
 *
 * @since 1.8
 */
function bricksGetFocusables(node) {
	let focusableElements = node.querySelectorAll(
		'a[href], button, input, textarea, select, details, [tabindex]:not([tabindex="-1"])'
	)

	// Filter out elements with display: none
	return Array.prototype.filter.call(focusableElements, (element) => {
		return window.getComputedStyle(element).display !== 'none'
	})
}

/**
 * Pause audio/video when popup is closed
 *
 * bricksPauseMediaFn.run() pauses all audio & video.
 *
 * @since 1.8
 */
const bricksPauseMediaFn = new BricksFunction({
	parentNode: document,
	selector: 'video, audio, iframe[src*="youtube"], iframe[src*="vimeo"]',
	subscribeEvents: ['bricks/popup/close'],
	forceReinit: true,
	eachElement: (element) => {
		// STEP: Pause video or audio
		if (
			(element.tagName === 'VIDEO' || element.tagName === 'AUDIO') &&
			element.pause &&
			typeof element.pause === 'function'
		) {
			element.pause()
			// Continue next element
			return
		}

		// STEP: Pause YouTube or Vimeo video
		if (element.tagName === 'IFRAME') {
			let src = element.getAttribute('src')
			let isYoutube = src.includes('youtube')
			let isVimeo = src.includes('vimeo')
			let command = isYoutube
				? { event: 'command', func: 'pauseVideo', args: '' }
				: { method: 'pause' }

			if (isVimeo || isYoutube) {
				// Note that if the youtube video is not enableJSAPI, we can't pause it
				element.contentWindow.postMessage(JSON.stringify(command), '*')
				// Continue next element
				return
			}
		}
	},
	listenerHandler: (event) => {
		if (event?.type) {
			switch (event.type) {
				case 'bricks/popup/close':
					let popupElement = event?.detail?.popupElement
					if (popupElement) {
						bricksPauseMediaFn.run({ parentNode: popupElement })
					}
					break
			}
		}
	}
})

/**
 * Set viewport height CSS variable: --bricks-vh
 *
 * Used in popup to cover viewport correctly on mobile devices.
 *
 * @since 1.8.2
 */
function bricksSetVh() {
	const vh = window.innerHeight * 0.01

	// Set var on documentElement (<html>)
	document.documentElement.style.setProperty('--bricks-vh', `${vh}px`)
}

/**
 * Enqueue custom scripts
 */
let bricksIsFrontend
let bricksScrollTimeout
let bricksTimeouts = {}

document.addEventListener('DOMContentLoaded', (event) => {
	bricksIsFrontend = document.body.classList.contains('bricks-is-frontend')

	// Nav menu & Dropdown (@since 1.8)
	bricksMultilevelMenu()
	bricksNavMenuMobile()

	bricksStickyHeader()
	bricksOnePageNavigation()
	bricksSkipLinks()
	bricksFacebookSDK()
	bricksSearchToggle()
	bricksPopups()

	bricksSwiper() // Sequence matters: before bricksSplide()
	bricksSplide() // Sequence matters: after bricksSwiper()

	// Run after bricksSwiper() & bricksSplide() as those need to generate required duplicate nodes first
	bricksPhotoswipe()

	bricksPrettify()
	bricksAccordion()
	bricksAnimatedTyping()
	bricksAudio()
	bricksCountdown()
	bricksCounter()
	bricksTableOfContents()
	bricksIsotope()
	bricksPricingTables()
	bricksVideo()
	bricksLazyLoad()
	bricksAnimation()
	bricksPieChart()
	bricksPostReadingProgressBar()
	bricksProgressBar()
	bricksForm()
	bricksInitQueryLoopInstances()
	bricksQueryPagination()
	bricksInteractions()
	bricksAlertDismiss()
	bricksTabs()
	bricksVideoOverlayClickDetector()
	bricksBackgroundVideoInit()
	bricksPostReadingTime()

	bricksNavNested()
	bricksOffcanvas()
	bricksToggle()

	// After bricksNavNested() ran (added .brx-has-multilevel)
	bricksSubmenuListeners()
	bricksSubmenuPosition(250)

	/**
	 * Debounce
	 *
	 * Use timeout object to allow for individual clearTimeout() calls.
	 *
	 * @since 1.8
	 */
	window.addEventListener('resize', () => {
		Object.keys(bricksTimeouts).forEach((key) => {
			clearTimeout(bricksTimeouts[key])
		})

		// Frontend: 1vh calculation based on window.innerHeight (for mobile devices)
		if (bricksIsFrontend) {
			bricksTimeouts.bricksVh = setTimeout(bricksSetVh, 250)
		}

		// Builder: Re-init swiperJS on window resize for switching between breakpoints, etc.
		else {
			bricksTimeouts.bricksSwiper = setTimeout(bricksSwiper, 250)
			bricksTimeouts.bricksSplide = setTimeout(bricksSplide, 250)
		}

		// Re-calculate left position on window resize with debounce (@since 1.8)
		bricksTimeouts.bricksSubmenuPosition = setTimeout(bricksSubmenuPosition, 250)

		// Set mobile menu open toggle parent div display according to toggle display
		bricksTimeouts.bricksToggleDisplay = setTimeout(bricksToggleDisplay, 100)

		// NOTE: Just for reference. Not in use (@since 1.8.5)
		// bricksTimeouts.bricksBackgroundVideo = setTimeout(bricksBackgroundVideoInit, 100)
	})

	/**
	 * Separate event registration from bricksInteractionsFn
	 *
	 * 100ms timeout to ensure bricksInteractionsFn has been initialized & set window.bricksData.interactions
	 *
	 * @since 1.8
	 */
	setTimeout(() => {
		let interactions = Array.isArray(window.bricksData?.interactions)
			? window.bricksData.interactions
			: []

		// Scroll interaction(s) found: Listen to scroll event
		if (interactions.find((interaction) => interaction?.trigger === 'scroll')) {
			document.addEventListener('scroll', bricksScrollInteractions)
		}
	}, 100)
})
