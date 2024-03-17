import {
	createElement,
	Component,
	useEffect,
	useState,
} from '@wordpress/element'
import { __ } from 'ct-i18n'
import { Switch, Select } from 'blocksy-options'
import cls from 'classnames'

const HooksSelect = ({ onChange, onChangeFor, ...props }) => {
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

export default HooksSelect
