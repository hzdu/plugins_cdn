import { registerDynamicChunk } from 'blocksy-frontend'
import $ from 'jquery'

const { days_label, hours_label, min_label, sec_label } =
	blc_woo_extra_product_sale_countdown

let counter = null

const getDateObj = (date) => {
	const countDown = new Date(date).getTime()
	const dateNow = new Date().getTime()

	const dateDiff = countDown - dateNow

	const days = Math.floor(dateDiff / (1000 * 60 * 60 * 24))
	const hours = Math.floor(
		(dateDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
	)
	const minutes = Math.floor((dateDiff % (1000 * 60 * 60)) / (1000 * 60))
	const seconds = Math.floor((dateDiff % (1000 * 60)) / 1000)

	return {
		days,
		hours,
		minutes,
		seconds,
		dateDiff,
	}
}

const renderCountDownMarkup = (wrapper, date) => {
	if (!wrapper) {
		return
	}

	const { days, hours, minutes, seconds } = getDateObj(date)

	wrapper.insertAdjacentHTML(
		'beforeend',
		`<div data-date="${date}">
    <span><b>${`${days}`.padStart(
		2,
		'0'
	)}</b><small>${days_label}</small></span>
    <span><b>${`${hours}`.padStart(
		2,
		'0'
	)}</b><small>${hours_label}</small></span>
    <span><b>${`${minutes}`.padStart(
		2,
		'0'
	)}</b><small>${min_label}</small></span>
    <span><b>${`${seconds}`.padStart(
		2,
		'0'
	)}</b><small>${sec_label}</small></span>
  </div>`
	)
}

const initCountDown = (date) => {
	clearInterval(counter)

	const wrapper = document.querySelector('.ct-product-sale-countdown')

	if (!wrapper.querySelector('[data-date]')) {
		renderCountDownMarkup(wrapper, date)

		setTimeout(() => {
			initCountDown(date)
		})

		return
	}

	counter = setInterval(() => {
		const { days, hours, minutes, seconds, dateDiff } = getDateObj(date)

		;[days, hours, minutes, seconds].forEach((num, idx) => {
			const targetWrapper = wrapper.querySelector(
				`span:nth-of-type(${idx + 1}) b`
			)
			if (targetWrapper) {
				targetWrapper.innerHTML = `${num}`.padStart(2, '0')
			}
		})

		if (dateDiff <= 1000) {
			clearInterval(counter)
		}
	}, 1000)
}

const removeCountDown = () => {
	const countdown = document.querySelector(
		'.ct-product-sale-countdown [data-date]'
	)

	if (countdown) {
		countdown.remove()
	}
}

registerDynamicChunk('blocksy_ext_woo_extra_countdown', {
	mount: (element, { event, eventData }) => {
		if (event.type === 'reset_data' || event.type === 'found_variation') {
			if (eventData) {
				if (eventData.date_on_sale_to?.date) {
					initCountDown(eventData.date_on_sale_to.date)
				} else {
					removeCountDown()
				}
			} else {
				removeCountDown()
			}

			return
		}

		const countDown = document.querySelector(
			'.product .ct-product-sale-countdown [data-date]'
		)

		if (countDown) {
			initCountDown(countDown.dataset.date)
		}
	},
})
