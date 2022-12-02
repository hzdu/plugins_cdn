import {
	createElement,
	Component,
	useState,
	useContext,
	Fragment,
} from '@wordpress/element'
import cls from 'classnames'

import {
	getValueFromInput,
	Panel,
	PanelMetaWrapper,
	Overlay,
	OptionsPanel,
	ColumnsDragDropContext,
	Switch,
	Select,
} from 'blocksy-options'

import { __ } from 'ct-i18n'

import CreateFooter from './CreateFooter'
import EditConditions from './EditConditions'

const PanelsManager = () => {
	const [isRemovingSection, setIsRemovingSection] = useState(false)

	const secondaryItems =
		ct_customizer_localizations.header_builder_data.secondary_items.footer
	const allItems = ct_customizer_localizations.header_builder_data.footer

	const {
		builderValueCollection,
		builderValue,
		builderValueDispatch,
		panelsActions,
	} = useContext(ColumnsDragDropContext)

	const allSections = builderValueCollection.sections.filter(
		({ id }) => id !== 'type-2' && id !== 'type-3'
	)

	return (
		<Fragment>
			<div className="ct-panels-manager">
				<ul className={cls('ct-panels-list')}>
					{allSections.map(({ name, id }) => {
						let panelLabel =
							name ||
							{
								'type-1': __('Global Footer', 'blocksy'),
							}[id] ||
							id

						const panelId = `builder_footer_panel_${id}`

						const footerOptions =
							ct_customizer_localizations.header_builder_data
								.footer_data.footer_options

						const option = {
							label: panelLabel,
							'inner-options': {
								...(id.indexOf('ct-custom') > -1
									? {
											conditions_button: {
												label: __(
													'Edit Conditions',
													'blocksy-companion'
												),
												type: 'jsx',
												design: 'block',
												render: () => (
													<EditConditions
														footerId={id}
													/>
												),
											},
									  }
									: {}),

								...footerOptions,
							},
						}

						return (
							<PanelMetaWrapper
								id={panelId}
								key={id}
								option={option}
								{...panelsActions}
								getActualOption={({ open }) => (
									<Fragment>
										{id === builderValue.id && (
											<Panel
												id={panelId}
												getValues={() =>
													getValueFromInput(
														footerOptions,

														Array.isArray(
															builderValue.settings
														)
															? {}
															: builderValue.settings
													)
												}
												option={option}
												onChangeFor={(
													optionId,
													optionValue
												) => {
													builderValueDispatch({
														type:
															'BUILDER_GLOBAL_SETTING_ON_CHANGE',
														payload: {
															optionId,
															optionValue,
														},
													})
												}}
												view="simple"
											/>
										)}

										<li
											className={cls({
												active: id === builderValue.id,
												'ct-global': id === 'type-1',
											})}
											onClick={() => {
												if (id === builderValue.id) {
													open()
												} else {
													builderValueDispatch({
														type:
															'PICK_BUILDER_SECTION',
														payload: {
															id,
														},
													})
												}
											}}>
											<span className="ct-panel-name">
												{panelLabel}
											</span>

											{id.indexOf('ct-custom') > -1 &&
												id !== builderValue.id && (
													<span
														className="ct-remove-instance"
														onClick={(e) => {
															e.preventDefault()
															e.stopPropagation()

															setIsRemovingSection(
																id
															)
														}}>
														<i className="ct-tooltip-top">
															{__(
																'Remove footer',
																'blocksy-companion'
															)}
														</i>
														<svg
															width="11px"
															height="11px"
															viewBox="0 0 24 24">
															<path d="M9.6,0l0,1.2H1.2v2.4h21.6V1.2h-8.4l0-1.2H9.6z M2.8,6l1.8,15.9C4.8,23.1,5.9,24,7.1,24h9.9c1.2,0,2.2-0.9,2.4-2.1L21.2,6H2.8z"></path>
														</svg>
													</span>
												)}
										</li>
									</Fragment>
								)}></PanelMetaWrapper>
						)
					})}
				</ul>
			</div>

			<CreateFooter />

			<Overlay
				items={isRemovingSection}
				className="ct-admin-modal ct-reset-options"
				onDismiss={() => setIsRemovingSection(false)}
				render={() => (
					<div className="ct-modal-content">
						<h2 className="ct-modal-title">
							{__('Remove Footer', 'blocksy-companion')}
						</h2>
						<p>
							{__(
								'You are about to remove a custom footer, are you sure you want to continue?',
								'blocksy-companion'
							)}
						</p>

						<div
							className="ct-modal-actions has-divider"
							data-buttons="2">
							<button
								onClick={(e) => {
									e.preventDefault()
									e.stopPropagation()
									setIsRemovingSection(false)
								}}
								className="button">
								{__('Cancel', 'blocksy-companion')}
							</button>

							<button
								className="button button-primary"
								onClick={(e) => {
									e.preventDefault()
									builderValueDispatch({
										type: 'REMOVE_BUILDER_SECTION',
										payload: {
											id: isRemovingSection,
										},
									})

									setIsRemovingSection(false)
								}}>
								{__('Confirm', 'blocksy-companion')}
							</button>
						</div>
					</div>
				)}
			/>
		</Fragment>
	)
}

export default PanelsManager
