import { createElement } from '@wordpress/element'

import { __ } from 'ct-i18n'
import { registerBlockType } from '@wordpress/blocks'

import { InspectorControls } from '@wordpress/block-editor'
import {
	Panel,
	PanelBody,
	PanelRow,
	ToggleControl,
	__experimentalToggleGroupControl as ToggleGroupControl,
	__experimentalToggleGroupControlOption as ToggleGroupControlOption,
} from '@wordpress/components'

const ResetIcon = () => (
	<svg width="11" height="11" viewBox="0 0 15 15" fill="currentColor">
		<path d="M8.5,7.5l4.5,4.5l-1,1L7.5,8.5L3,13l-1-1l4.5-4.5L2,3l1-1l4.5,4.5L12,2l1,1L8.5,7.5z"></path>
	</svg>
)

const ResetIconButton = () => (
	<svg width="12" height="12" viewBox="0 0 15 15" fill="currentColor">
		<path d="M8.5,7.5l4.5,4.5l-1,1L7.5,8.5L3,13l-1-1l4.5-4.5L2,3l1-1l4.5,4.5L12,2l1,1L8.5,7.5z"></path>
	</svg>
)

const Preview = ({ layout, showResetButton }) => {
	const resetButton = (
		<a href="#" className="ct-button-ghost">
			<ResetIconButton />
			{__('Reset Filters', 'blocksy-companion')}
		</a>
	)

	if (layout === 'list') {
		return (
			<ul class="ct-active-filters" data-display-type="list">
				<li class="ct-active-filter-item">
					<ul>
						<li class="ct-active-filter-name">
							{__('Category', 'blocksy-companion')}
						</li>
						<li>
							<a href="#">
								<ResetIcon />
								{__('Category 1', 'blocksy-companion')}
							</a>
						</li>
						<li>
							<a href="#">
								<ResetIcon />
								{__('Category 2', 'blocksy-companion')}
							</a>
						</li>
					</ul>
				</li>
				<li class="ct-active-filter-item">
					<ul>
						<li class="ct-active-filter-name">
							{__('Attribute', 'blocksy-companion')}
						</li>
						<li>
							<a href="#">
								<ResetIcon />
								{__('Attribute 1', 'blocksy-companion')}
							</a>
						</li>
						<li>
							<a href="#">
								<ResetIcon />
								{__('Attribute 2', 'blocksy-companion')}
							</a>
						</li>
					</ul>
				</li>
				{showResetButton === 'yes' ? <li className="ct-filter-reset">{resetButton}</li> : null}
			</ul>
		)
	}

	return (
		<div class="ct-active-filters" data-display-type="inline">
			<a href="#">
				<ResetIcon />
				{__('Category', 'blocksy-companion')}
			</a>
			<a href="#">
				<ResetIcon />
				{__('Attribute', 'blocksy-companion')}
			</a>

			{showResetButton === 'yes' ? <div className="ct-filter-reset">{resetButton}</div> : null}
		</div>
	)
}

registerBlockType('blocksy/active-filters', {
	title: __('Active Filters', 'blocksy-companion'),
	description: __('Display the currently active filters.', 'blocksy-companion'),
	icon: 'filter',
	icon: {
		src: (
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 24 24"
				className="wc-block-editor-components-block-icon">
				<path d="M18.7,7.1c-0.4-1.5-1.7-2.6-3.3-2.6S12.4,5.6,12,7.1H4v1.8h8c0.4,1.5,1.7,2.5,3.3,2.5s2.9-1.1,3.3-2.5H20V7.1H18.7zM15.3,9.8c-1,0-1.8-0.8-1.8-1.8c0-1,0.8-1.8,1.8-1.8c1,0,1.8,0.8,1.8,1.8C17.1,8.9,16.3,9.8,15.3,9.8z M8.7,12.6c-1.6,0-2.9,1.1-3.3,2.6H4v1.8h1.3c0.4,1.5,1.7,2.5,3.3,2.5s2.9-1.1,3.3-2.5h8v-1.8h-8C11.6,13.7,10.3,12.6,8.7,12.6z M8.7,17.8c-1,0-1.8-0.8-1.8-1.8c0-1,0.8-1.8,1.8-1.8c1,0,1.8,0.8,1.8,1.8C10.5,17,9.7,17.8,8.7,17.8z" />
			</svg>
		),
	},
	category: 'widgets',
	supports: {
		html: false,
		multiple: false,
		inserter: false,
		lock: false,
	},
	attributes: {
		layout: {
			type: 'string',
			default: 'list',
		},
		showResetButton: {
			type: 'string',
			default: 'yes',
		},
	},
	edit: ({ attributes, setAttributes }) => {
		const { layout, showResetButton } = attributes

		return (
			<>
				<Preview {...attributes} />
				<InspectorControls>
					<Panel header="Filter Settings">
						<PanelBody>
							<ToggleGroupControl
								label={__('Display Type', 'blocksy-companion')}
								value={layout}
								isBlock
								onChange={(newLayout) =>
									setAttributes({ layout: newLayout })
								}>
								<ToggleGroupControlOption
									key="list"
									value="list"
									label={__('List', 'blocksy-companion')}
								/>
								<ToggleGroupControlOption
									key="inline"
									value="inline"
									label={__('Inline', 'blocksy-companion')}
								/>
							</ToggleGroupControl>
							<PanelRow>
								<ToggleControl
									label={__(
										'Show Reset Button',
										'blocksy-companion'
									)}
									help={__(
										'Show or hide reset filter button.',
										'blocksy-companion'
									)}
									checked={showResetButton === 'yes'}
									onChange={() =>
										setAttributes({
											showResetButton:
												showResetButton === 'yes'
													? 'no'
													: 'yes',
										})
									}
								/>
							</PanelRow>
						</PanelBody>
					</Panel>
				</InspectorControls>
			</>
		)
	},
	save: function () {
		return <div>Blocksy: Active Filter</div>
	},
})

wp.blocks.registerBlockVariation('blocksy/widgets-wrapper', {
	name: 'blocksy-active-filters',
	title: __('Active Filters', 'blocksy-companion'),
	attributes: {
		heading: __('Active Filters', 'blocksy-companion'),
		block: 'blocksy/active-filters',
	},
	isActive: (attributes) => attributes.block === 'blocksy/active-filters',
	icon: {
		src: (
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 24 24"
				className="wc-block-editor-components-block-icon">
				<path d="M18.7,7.1c-0.4-1.5-1.7-2.6-3.3-2.6S12.4,5.6,12,7.1H4v1.8h8c0.4,1.5,1.7,2.5,3.3,2.5s2.9-1.1,3.3-2.5H20V7.1H18.7zM15.3,9.8c-1,0-1.8-0.8-1.8-1.8c0-1,0.8-1.8,1.8-1.8c1,0,1.8,0.8,1.8,1.8C17.1,8.9,16.3,9.8,15.3,9.8z M8.7,12.6c-1.6,0-2.9,1.1-3.3,2.6H4v1.8h1.3c0.4,1.5,1.7,2.5,3.3,2.5s2.9-1.1,3.3-2.5h8v-1.8h-8C11.6,13.7,10.3,12.6,8.7,12.6z M8.7,17.8c-1,0-1.8-0.8-1.8-1.8c0-1,0.8-1.8,1.8-1.8c1,0,1.8,0.8,1.8,1.8C10.5,17,9.7,17.8,8.7,17.8z" />
			</svg>
		),
	},
})
