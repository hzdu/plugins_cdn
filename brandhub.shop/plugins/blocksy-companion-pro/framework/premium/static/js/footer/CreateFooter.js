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
	ColumnsDragDropContext,
	Switch,
	Select,
} from 'blocksy-options'
import { __ } from 'ct-i18n'

import classnames from 'classnames'

const CreateFooter = () => {
	const [isCreating, setIsCreating] = useState(false)
	const [{ name, copy }, setFooterData] = useState({ name: '', copy: null })

	const { builderValueCollection, builderValueDispatch } = useContext(
		ColumnsDragDropContext
	)

	return (
		<Fragment>
			<div className="ct-create-instance">
				<button
					className="button button-primary"
					onClick={(e) => {
						e.preventDefault()
						setIsCreating(true)
					}}>
					{__('Create new footer', 'blocksy-companion')}
				</button>
			</div>

			<Overlay
				items={isCreating}
				className="ct-admin-modal ct-create-instance-modal"
				onDismiss={() => {
					setIsCreating(false)
					setFooterData({ name: '', copy: null })
				}}
				render={() => (
					<div className="ct-modal-content">
						<h1>{sprintf(__('Create new footer', 'blocksy-companion'))}</h1>

						<p>
							{__(
								'Create a new footer and assign it to different pages or posts based on your conditions.',
								'blocksy-companion'
							)}
						</p>

						<div className="ct-create-instance-content">
							<div className="ct-option-input">
								<label>{__('Footer name', 'blocksy-companion')}</label>

								<input
									type="text"
									value={name}
									onChange={({ target: { value } }) => {
										setFooterData((data) => ({
											...data,
											name: value,
										}))
									}}
									placeholder={__('Footer name', 'blocksy-companion')}
								/>
							</div>

							<div
								className={classnames(
									'ct-control-copy-instance',
									{
										'ct-disabled': !copy,
									}
								)}>
								<div
									className="ct-checkbox-container"
									onClick={() => {
										setFooterData((data) => ({
											...data,
											copy: data.copy
												? null
												: builderValueCollection.current_section,
										}))
									}}>
									<span
										className={classnames('ct-checkbox', {
											active: copy,
										})}>
										<svg
											width="10"
											height="8"
											viewBox="0 0 11.2 9.1">
											<polyline
												className="check"
												points="1.2,4.8 4.4,7.9 9.9,1.2 "></polyline>
										</svg>
									</span>

									{__('Copy elements & styles from', 'blocksy-companion')}
								</div>

								<Select
									onChange={(copy) =>
										setFooterData((data) => ({
											...data,
											copy,
										}))
									}
									option={{
										placeholder: __(
											'Picker Footer',
											'blocksy-companion'
										),
										choices: builderValueCollection.sections
											.filter(
												({ id }) =>
													id !== 'type-2' &&
													id !== 'type-3'
											)
											.map(({ name, id }) => ({
												key: id,
												value:
													name ||
													{
														'type-1': __(
															'Global Footer',
															'blocksy-companion'
														),
														'type-2': __(
															'Secondary',
															'blocksy-companion'
														),
														'type-3': __(
															'Centered',
															'blocksy-companion'
														),
													}[id] ||
													id,
											})),
									}}
									value={copy}
								/>
							</div>
						</div>

						<div className="ct-modal-actions has-divider">
							<button
								className="button-primary"
								onClick={() => {
									builderValueDispatch({
										type: 'CREATE_NEW_SECTION',
										payload: {
											name,
											copy,
										},
									})

									setIsCreating(false)
									setTimeout(() => {
										setFooterData({ name: '', copy: null })
									}, 1000)
								}}
								disabled={!name}>
								{__('Create New Footer', 'blocksy-companion')}
							</button>
						</div>
					</div>
				)}
			/>
		</Fragment>
	)
}

export default CreateFooter
