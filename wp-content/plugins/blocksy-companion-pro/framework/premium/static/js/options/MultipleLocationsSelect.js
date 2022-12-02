import {
	createElement,
	Component,
	useEffect,
	useState,
} from '@wordpress/element'
import { __ } from 'ct-i18n'
import { Switch, Select } from 'blocksy-options'
import cls from 'classnames'

import { OptionsPanel } from 'blocksy-options'

import nanoid from 'nanoid'

const MultipleLocationsSelect = ({ value, onChange, option: { choices } }) => {
	return (
		<div className="ct-new-condition-location">
			{value.map((l, index) => (
				<div className="ct-new-location" key={l.__id}>
					<OptionsPanel
						onChange={(optionId, optionValue) => {
							onChange(
								value.map((localL) =>
									localL.__id === l.__id
										? {
												...localL,
												[optionId]: optionValue,
										  }
										: localL
								)
							)
						}}
						options={{
							group: {
								type: 'ct-group',
								label: false,
								attr: { class: 'ct-condition-location' },
								options: {
									location: {
										label: false,
										type: 'blocksy-hooks-select',
										search: true,
										value: '',
										design: 'none',
										defaultToFirstItem: false,
										choices,
										placeholder: __(
											'Select location',
											'blocksy-companion'
										),
									},

									priority: {
										label: false,
										type: 'ct-number',
										value: 10,
										min: 1,
										max: 100,
										design: 'none',
										attr: { 'data-width': 'full' },
									},
								},
							},

							condition: {
								type: 'ct-condition',
								condition: {
									location: 'custom_hook',
								},
								options: {
									custom_location: {
										label: __(
											'Custom Hook',
											'blocksy-companion'
										),
										type: 'text',
										value: '',
									},
								},
							},

							other_condition: {
								type: 'ct-condition',
								condition: {
									location:
										'blocksy:single:content:paragraphs-number',
								},
								options: {
									paragraphs_count: {
										label: __(
											'After Block Number',
											'blocksy-companion'
										),
										type: 'text',
										value: '3',
										design: 'inline',
										wrapperAttr: {
											'data-location': 'block',
										},
									},
								},
							},

							other_condition_wh: {
								type: 'ct-condition',
								condition: {
									location:
										'blocksy:single:content:headings-number',
								},
								options: {
									headings_count: {
										label: __(
											'Before Heading Number',
											'blocksy-companion'
										),
										type: 'text',
										value: '3',
										design: 'inline',
										wrapperAttr: {
											'data-location': 'block',
										},
									},
								},
							},
						}}
						value={l}
						hasRevertButton={false}
					/>
					<button
						onClick={(e) => {
							e.preventDefault()
							onChange(
								value.filter(({ __id }) => l.__id !== __id)
							)
						}}>
						×
					</button>
				</div>
			))}
			<button
				className="button"
				onClick={(e) => {
					e.preventDefault()

					onChange([
						...value,
						{
							__id: nanoid(),
							location: '',
							priority: 10,
							custom_location: '',
							paragraphs_count: '5',
						},
					])
				}}>
				{__('Add New Location', 'blocksy-companion')}
			</button>
		</div>
	)

	return (
		<Select
			onChangeFor={onChangeFor}
			onChange={(value) => {
				onChange(value)

				/*
				setTimeout(() => {
					onChangeFor(
						'priority',
						blocksy_premium_admin.all_hooks.find(
							({ hook }) => hook === value
						).priority || 10
					)
				}, 1000)
                */
			}}
			{...props}
		/>
	)
}

export default MultipleLocationsSelect
