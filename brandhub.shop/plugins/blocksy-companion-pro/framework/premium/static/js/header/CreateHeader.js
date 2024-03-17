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

import classnames from 'classnames'

const CreateHeader = () => {
	const [isCreating, setIsCreating] = useState(false)
	const [{ name, copy }, setHeaderData] = useState({ name: '', copy: null })

	const { builderValueCollection, builderValueDispatch } = useContext(
		PlacementsDragDropContext
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
					{__('Create new header', 'blocksy-companion')}
				</button>
			</div>

			<Overlay
				items={isCreating}
				className="ct-admin-modal ct-create-instance-modal"
				onDismiss={() => {
					setIsCreating(false)
					setHeaderData({ name: '', copy: null })
				}}
				render={() => (
					<div className="ct-modal-content">
						<h2>{sprintf(__('Create new header', 'blocksy-companion'))}</h2>

						<p>
							{__(
								'Create a new header and assign it to different pages or posts based on your conditions.',
								'blocksy-companion'
							)}
						</p>

						<div className="ct-create-instance-content">
							<div className="ct-option-input">
								<label>{__('Header name', 'blocksy-companion')}</label>
								<input
									type="text"
									value={name}
									onChange={({ target: { value } }) => {
										setHeaderData((data) => ({
											...data,
											name: value,
										}))
									}}
									placeholder={__('Header name', 'blocksy-companion')}
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
										setHeaderData((data) => ({
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
										setHeaderData((data) => ({
											...data,
											copy,
										}))
									}
									option={{
										placeholder: __(
											'Picker header',
											'blocksy-companion'
										),
										choices: builderValueCollection.sections
											.filter(
												({ id }) =>
													id !== 'type-2' &&
													id !== 'type-3' &&
													id !==
														'ct-custom-transparent'
											)
											.map(({ name, id }) => ({
												key: id,
												value:
													name ||
													{
														'type-1': __(
															'Global Header',
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
										setHeaderData({ name: '', copy: null })
									}, 1000)
								}}
								disabled={!name}>
								{__('Create New Header', 'blocksy-companion')}
							</button>
						</div>
					</div>
				)}
			/>
		</Fragment>
	)
}

export default CreateHeader
