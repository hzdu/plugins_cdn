import {
	createElement,
	Fragment,
	Component,
	useContext,
	useState,
} from '@wordpress/element'
import {
	Overlay,
	OptionsPanel,
	getValueFromInput,
	PlacementsDragDropContext,
	Switch,
	Select,
} from 'blocksy-options'
import { __ } from 'ct-i18n'

export const customItemsSeparator = () => '~'
export const getOriginalId = (id) => id.split(customItemsSeparator())[0]

const CloneItem = ({ item, itemInBuilder, itemData }) => {
	const {
		builderValue,
		builderValueCollection,
		builderValueDispatch,
	} = useContext(PlacementsDragDropContext)

	let allClones = builderValue.items.filter(
		({ id }) =>
			id.indexOf(customItemsSeparator()) > -1 &&
			getOriginalId(id) === item
	)

	let hasClone =
		item.indexOf(customItemsSeparator()) === -1 &&
		// itemInBuilder &&
		itemData.config.clone &&
		allClones.length < (parseFloat(itemData.config.clone) || 3)

	let hasRemove =
		item.indexOf(customItemsSeparator()) > -1 &&
		!itemInBuilder &&
		itemData.config.clone

	return (
		<Fragment>
			{hasClone && (
				<span
					onClick={(e) => {
						e.stopPropagation()
						e.preventDefault()

						builderValueDispatch({
							type: 'CLONE_ITEM',
							payload: {
								id: item,
							},
						})
					}}
					className="ct-clone-item">
					<svg width="11px" height="11px" viewBox="0 0 24 24">
						<path d="M23,6.7h-5.7V1c0-0.6-0.4-1-1-1H1C0.4,0,0,0.4,0,1v15.3c0,0.6,0.4,1,1,1h5.7V23c0,0.6,0.4,1,1,1H23c0.6,0,1-0.4,1-1V7.7C24,7.1,23.6,6.7,23,6.7z M22,22H8.7v-4.7h7.6c0.6,0,1-0.4,1-1V8.7H22V22z" />
					</svg>

					<i className="ct-tooltip-top">{__('Clone Item', 'blocksy-companion')}</i>
				</span>
			)}

			{hasRemove && (
				<span
					className="ct-remove-item"
					title="Remove"
					onClick={(e) => {
						e.stopPropagation()
						e.preventDefault()

						builderValueDispatch({
							type: 'REMOVE_CLONED_ITEM',
							payload: {
								id: item,
							},
						})
					}}>
					<svg width="11px" height="11px" viewBox="0 0 24 24">
						<path d="M9.6,0l0,1.2H1.2v2.4h21.6V1.2h-8.4l0-1.2H9.6z M2.8,6l1.8,15.9C4.8,23.1,5.9,24,7.1,24h9.9c1.2,0,2.2-0.9,2.4-2.1L21.2,6H2.8z" />
					</svg>

					<i className="ct-tooltip-top">{__('Remove Item', 'blocksy-companion')}</i>
				</span>
			)}
		</Fragment>
	)
}

export default CloneItem
