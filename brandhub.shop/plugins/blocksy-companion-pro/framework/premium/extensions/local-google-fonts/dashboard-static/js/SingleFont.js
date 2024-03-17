import { createElement, useState } from '@wordpress/element'
import Overlay from '../../../../../../static/js/helpers/Overlay'
import { __, sprintf } from 'ct-i18n'

import { humanizeVariations } from '../../../custom-fonts/dashboard-static/js/helpers'

import GeneralTab from './GeneralTab'
import classNames from 'classnames'
import AdvancedTab from './AdvancedTab'

const SingleFont = ({ font, remoteFont, onChange, onRemove, isLoading }) => {
	const [isSaving, setIsSaving] = useState(false)
	const [currentTab, setCurrentTab] = useState('general')
	const [futureVariations, setFutureVariations] = useState(false)
	const [futurePreloads, setFuturePreloads] = useState(
		font?.preloads || {
			variations: [],
			subsets: [],
		}
	)

	if (!remoteFont) {
		return null
	}

	const isDisabled =
		isSaving ||
		isLoading ||
		!!futurePreloads.variations.length ^ !!futurePreloads.subsets.length

	const variationsToDisplay = font.variations || remoteFont.all_variations

	return (
		<li>
			<div className="ct-google-font-info">
				<span>{font.id}</span>

				<i>
					{__('Variations', 'blocksy-companion')}
					:&nbsp;
					{variationsToDisplay
						.map((variation) => humanizeVariations(variation))
						.join(', ')}
				</i>
			</div>

			<div className="ct-google-font-actions">
				<button
					className="ct-edit-font"
					data-tooltip="top"
					disabled={isSaving}
					onClick={() => {
						setFutureVariations(
							font.variations || remoteFont.all_variations
						)

						setFuturePreloads(
							font.preloads || {
								variations: [],
								subsets: [],
							}
						)
					}}>
					<span className="ct-tooltip">
						{__('Select Variations', 'blocksy-companion')}
					</span>
				</button>

				<button
					className="ct-remove-font"
					data-hover="red"
					data-tooltip="top"
					disabled={isSaving}
					onClick={() => {
						onRemove()
					}}>
					<span className="ct-tooltip">
						{__('Remove Font', 'blocksy-companion')}
					</span>
				</button>
			</div>

			<Overlay
				items={!!futureVariations || isSaving}
				className="ct-local-google-fonts-modal"
				onDismiss={() => {
					setFutureVariations(false)
				}}
				render={() => {
					return (
						<div className="ct-modal-content" data-state={'edit'}>
							<h2>{font.id} Font</h2>

							<div className="ct-tabs-scroll">
								<div className="ct-tabs">
									<ul>
										{['general', 'advanced'].map((tab) => {
											const isActive = currentTab === tab

											return (
												<li
													key={tab}
													className={classNames({
														active: isActive,
													})}
													onClick={() =>
														setCurrentTab(tab)
													}>
													{
														{
															general: __(
																'General',
																'blocksy-companion'
															),

															advanced: __(
																'Preload',
																'blocksy-companion'
															),
														}[tab]
													}
												</li>
											)
										})}
									</ul>
									<div className="ct-current-tab">
										{currentTab === 'general' ? (
											<GeneralTab
												{...{
													futureVariations,
													setFutureVariations,
													remoteFont,
													isSaving,
												}}
											/>
										) : (
											<AdvancedTab
												{...{
													futureVariations,
													remoteFont,
													futurePreloads,
													setFuturePreloads,
													isSaving,
												}}
											/>
										)}
									</div>
								</div>
							</div>

							<div className="ct-modal-actions has-divider">
								<button
									className="button button-primary"
									disabled={isDisabled}
									onClick={async () => {
										setIsSaving(true)
										const { variations, ...fontResult } =
											font

										await onChange({
											...fontResult,
											...(futureVariations.length ===
											remoteFont.all_variations.length
												? {}
												: {
														variations:
															futureVariations,
												  }),
											...(futurePreloads
												? {
														preloads:
															futurePreloads,
												  }
												: {}),
										})
										setIsSaving(false)
										setFuturePreloads({
											variations: [],
											subsets: [],
										})
										setFutureVariations(false)
									}}>
									{isSaving ? (
										<svg
											width="15"
											height="15"
											viewBox="0 0 100 100">
											<g transform="translate(50,50)">
												<g transform="scale(1)">
													<circle
														cx="0"
														cy="0"
														r="50"
														fill="#687c93"
													/>
													<circle
														cx="0"
														cy="-26"
														r="12"
														fill="#ffffff"
														transform="rotate(161.634)">
														<animateTransform
															attributeName="transform"
															type="rotate"
															calcMode="linear"
															values="0 0 0;360 0 0"
															keyTimes="0;1"
															dur="1s"
															begin="0s"
															repeatCount="indefinite"
														/>
													</circle>
												</g>
											</g>
										</svg>
									) : (
										__('Save Font', 'blocksy-companion')
									)}
								</button>
							</div>
						</div>
					)
				}}
			/>
		</li>
	)
}

export default SingleFont
