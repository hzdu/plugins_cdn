import {
	createElement,
	Fragment,
	useMemo,
	useRef,
	useState,
} from '@wordpress/element'

import { OutsideClickHandler } from 'blocksy-options'
import { __, sprintf } from 'ct-i18n'

import fas from '../../icons/fas.json'
import far from '../../icons/far.json'
import fab from '../../icons/fab.json'
import blc from '../../icons/blc.json'
import IconPickerModal from './IconPicker/Modal'

export const packs = [
	{
		name: __('Theme Icons', 'blocksy-companion'),
		icons: blc,
		prefix: 'blc blc-',
	},

	{
		name: __('FontAwesome Brands', 'blocksy-companion'),
		icons: fab,
		prefix: 'fab fa-',
	},

	{
		name: __('FontAwesome Solid', 'blocksy-companion'),
		icons: fas,
		prefix: 'fas fa-',
	},

	{
		name: __('FontAwesome Regular', 'blocksy-companion'),
		icons: far,
		prefix: 'far fa-',
	},
]

const IconPicker = ({ value, onChange, option }) => {
	const correctIcon = useMemo(() => {
		let pack = packs.find(({ prefix }) => value.icon.indexOf(prefix) === 0)

		return value.icon && pack
			? pack.icons.find(
					({ icon }) => icon === value.icon.replace(pack.prefix, '')
			  )
			: value.source === 'attachment' && value.url
	}, [value.icon, value.source, value.url])

	const el = useRef()

	const [searchString, setSearchString] = useState('')

	const [{ isPicking, isTransitioning }, setAnimationState] = useState({
		isPicking: null,
		isTransitioning: null,
	})

	return (
		<div ref={el}>
			<OutsideClickHandler
				useCapture={false}
				disabled={!isPicking}
				className="ct-icon-picker-value"
				additionalRefs={[]}
				onOutsideClick={(e) => {
					if (!isPicking) {
						return
					}

					if (e.target.closest('.media-modal-content')) {
						return
					}

					setAnimationState({
						isTransitioning: isPicking.split(':')[0],
						isPicking: null,
					})
				}}
				wrapperProps={{
					onClick: (e) => {
						e.preventDefault()

						let futureIsPicking = isPicking
							? isPicking.split(':')[0] === 'opts'
								? null
								: `opts:${isPicking.split(':')[0]}`
							: 'opts'

						setAnimationState({
							isTransitioning: 'opts',
							isPicking: futureIsPicking,
						})

						setSearchString('')

						setTimeout(() => {
							let maybeIcon = el.current
								.closest('.ct-control')
								.querySelector(`[data-icon="${value.icon}"]`)

							if (maybeIcon) {
								maybeIcon.scrollIntoView()
							}
						}, 100)
					},
				}}>
				{correctIcon ? (
					<Fragment>
						{value.source !== 'attachment' && (
							<i
								className="ct-icon-preview"
								dangerouslySetInnerHTML={{
									__html: correctIcon.svg,
								}}
							/>
						)}

						{value.source === 'attachment' && (
							<i className="ct-icon-preview">
								<img src={value.url} />
							</i>
						)}

						<div>
							<span className="ct-edit">
								<span className="ct-tooltip-top">
									{__('Change Icon', 'blocksy-companion')}
								</span>
							</span>

							<i className="divider"></i>

							<span
								className="ct-remove"
								onClick={(e) => {
									e.preventDefault()
									e.stopPropagation()

									onChange({
										icon: '',
									})
								}}>
								<span className="ct-tooltip-top">
									{__('Remove Icon', 'blocksy-companion')}
								</span>
							</span>
						</div>
					</Fragment>
				) : (
					<div>{__('Select', 'blocksy-companion')}</div>
				)}
			</OutsideClickHandler>

			<IconPickerModal
				el={el}
				value={value}
				onChange={onChange}
				option={option}
				isPicking={isPicking}
				isTransitioning={isTransitioning}
				searchString={searchString}
				setSearchString={setSearchString}
				picker={{
					id: 'opts',
				}}
				onPickingChange={(isPicking) => {
					if (!value.enable) {
						return
					}

					setAnimationState({
						isTransitioning: 'opts',
						isPicking,
					})
				}}
				stopTransitioning={() =>
					setAnimationState({
						isPicking,
						isTransitioning: false,
					})
				}
			/>
		</div>
	)
}

IconPicker.ControlEnd = () => {
	return <div className="ct-color-modal-wrapper" />
}

export default IconPicker
