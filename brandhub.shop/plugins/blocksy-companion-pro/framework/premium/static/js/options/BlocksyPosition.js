import {
	createElement,
	Fragment,
	useMemo,
	useRef,
	useState,
} from '@wordpress/element'
import classnames from 'classnames'

const BlocksyPosition = ({ value, onChange, option }) => {
	return (
		<ul className="ct-option-position">
			{[
				'top:left',
				'top:center',
				'top:right',
				'middle:left',
				'middle:center',
				'middle:right',
				'bottom:left',
				'bottom:center',
				'bottom:right',
			].map((position) => (
				<li
					className={classnames({
						active: position === value,
					})}
					onClick={() => onChange(position)}
				/>
			))}
		</ul>
	)
}

export default BlocksyPosition
