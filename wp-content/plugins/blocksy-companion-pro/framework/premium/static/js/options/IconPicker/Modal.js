import {
	Fragment,
	createElement,
	createPortal,
	useState,
	useMemo,
} from '@wordpress/element'
import classnames from 'classnames'

import { __ } from 'ct-i18n'

import IconsList from './IconsList'
import CustomIcon from './CustomIcon'

import { Popover } from '@wordpress/components'

import {
	Transition,
	animated,
	bezierEasing,
	usePopoverMaker,
} from 'blocksy-options'

import { packs } from '../IconPicker'

const IconPickerModal = ({
	option,
	value,
	onChange,
	picker,

	onPickingChange,
	stopTransitioning,

	el,

	searchString,
	setSearchString,

	isTransitioning,
	isPicking,
}) => {
	const filteredPacks = useMemo(
		() =>
			packs.filter(({ icons }) =>
				searchString.trim().length > 0
					? !!icons.find(
							({ icon }) => icon.indexOf(searchString) > -1
					  )
					: true
			),
		[searchString]
	)

	const { styles, popoverProps } = usePopoverMaker({
		ref: el,
		defaultHeight: 400,
		shouldCalculate:
			isTransitioning === picker.id ||
			(isPicking || '').split(':')[0] === picker.id,
	})

	return (
		(isTransitioning === picker.id ||
			(isPicking || '').split(':')[0] === picker.id) &&
		createPortal(
			<Transition
				items={isPicking}
				onRest={(isOpen) => {
					stopTransitioning()
				}}
				config={{
					delay: 50,
					duration: 100,
					easing: bezierEasing(0.25, 0.1, 0.25, 1.0),
				}}
				from={
					(isPicking || '').indexOf(':') === -1
						? {
								transform: 'scale3d(0.95, 0.95, 1)',
								opacity: 0,
						  }
						: { opacity: 1 }
				}
				enter={
					(isPicking || '').indexOf(':') === -1
						? {
								transform: 'scale3d(1, 1, 1)',
								opacity: 1,
						  }
						: {
								opacity: 1,
						  }
				}
				leave={
					(isPicking || '').indexOf(':') === -1
						? {
								transform: 'scale3d(0.95, 0.95, 1)',
								opacity: 0,
						  }
						: {
								opacity: 1,
						  }
				}>
				{(isPicking) =>
					(isPicking || '').split(':')[0] === picker.id &&
					((props) => (
						<animated.div
							style={{ ...props, ...styles }}
							{...popoverProps}
							className="ct-option-modal ct-icon-picker-modal"
							onClick={(e) => {
								e.preventDefault()
								e.stopPropagation()
							}}
							onMouseDownCapture={(e) => {
								e.nativeEvent.stopImmediatePropagation()
								e.nativeEvent.stopPropagation()
							}}
							onMouseUpCapture={(e) => {
								e.nativeEvent.stopImmediatePropagation()
								e.nativeEvent.stopPropagation()
							}}>
							<ul className="ct-modal-tabs">
								<li
									onClick={() => {
										onChange({
											...value,
											source: 'default',
										})
									}}
									className={classnames({
										active: value.source !== 'attachment',
									})}>
									{__('All Icons', 'blocksy-companion')}
								</li>

								<li
									onClick={() => {
										onChange({
											...value,
											source: 'attachment',
										})
									}}
									className={classnames({
										active: value.source === 'attachment',
									})}>
									{__('Upload Icon', 'blocksy-companion')}
								</li>
							</ul>

							{value.source !== 'attachment' && (
								<IconsList
									searchString={searchString}
									filteredPacks={filteredPacks}
									setSearchString={setSearchString}
									onChange={onChange}
									value={value}
								/>
							)}

							{value.source === 'attachment' && (
								<CustomIcon onChange={onChange} value={value} />
							)}
						</animated.div>
					))
				}
			</Transition>,
			document.body
		)
	)
}

export default IconPickerModal
