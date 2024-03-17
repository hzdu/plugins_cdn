import {
	createElement,
	useState,
	useCallback,
	useEffect,
} from '@wordpress/element'
const { addQueryArgs } = wp.url

import { __ } from 'ct-i18n'
import { registerBlockType } from '@wordpress/blocks'
import { InspectorControls } from '@wordpress/block-editor'
import {
	Panel,
	PanelBody,
	PanelRow,
	SelectControl,
	ToggleControl,
	__experimentalToggleGroupControl as ToggleGroupControl,
	__experimentalToggleGroupControlOption as ToggleGroupControlOption,
	RangeControl,
	FormTokenField,
} from '@wordpress/components'

import Preview from './Preview'
import Disabled from './Disabled'
import TaxonomySelector from './TaxonomySelector'

const { attributes_tax, has_brands } = window.blc_filters_data
export const attributeTaxonomiesOpts = [
	{
		label: __('Select attribute', 'blocksy-companion'),
		value: '',
	},
	...Object.values(attributes_tax).map(
		({ attribute_name, attribute_label }) => ({
			label: attribute_label,
			value: attribute_name,
		})
	),
]

const brands_enabled = !!parseInt(has_brands)

const sizesConfig = ['1/1', '4/3', '16/9', '2/1']

export const typesConfig = {
	categories: __('Category', 'blocksy-companion'),
	attributes: __('Attribute', 'blocksy-companion'),
}

if (brands_enabled) {
	typesConfig['brands'] = __('Brand', 'blocksy-companion')
}

registerBlockType('blocksy/woocommerce-filters', {
	title: __('Shop Filters Controls', 'blocksy-companion'),
	description: __(
		'Widget for filtering the WooCommerce products loop by category, attribute or brand.',
		'blocksy-companion'
	),
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
		type: {
			type: 'string',
			default: 'categories',
		},
		viewType: {
			type: 'string',
			default: 'list',
		},
		showCounters: {
			type: 'boolean',
			default: false,
		},
		multipleFilters: {
			type: 'boolean',
			default: true,
		},
		attribute: {
			type: 'string',
			default: attributeTaxonomiesOpts?.[0]?.value,
		},
		showLabel: {
			type: 'boolean',
			default: true,
		},
		showCheckbox: {
			type: 'boolean',
			default: true,
		},
		showAttributesCheckbox: {
			type: 'boolean',
			default: false,
		},
		showItemsRendered: {
			type: 'boolean',
			default: true,
		},
		showResetButton: {
			type: 'boolean',
			default: false,
		},
		hierarchical: {
			type: 'boolean',
			default: false,
		},
		expandable: {
			type: 'boolean',
			default: false,
		},
		defaultExpanded: {
			type: 'boolean',
			default: true,
		},
		useFrame: {
			type: 'boolean',
			default: false,
		},
		logoMaxW: {
			type: 'number',
			default: 40,
		},
		aspectRatio: {
			type: 'string',
			default: '16/9',
		},
		excludeTaxonomy: {
			type: 'boolean',
			default: false,
		},
		taxonomy_not_in: {
			type: 'array',
			default: [],
		},
		showSearch: {
			type: 'boolean',
			default: false,
		},
		limitHeight: {
			type: 'boolean',
			default: false,
		},
		limitHeightValue: {
			type: 'number',
			default: 400,
		},
	},
	edit: ({ attributes, setAttributes }) => {
		const {
			type,
			showCounters,
			multipleFilters,
			viewType,
			showLabel,
			showCheckbox,
			showSearch,
			showItemsRendered,
			showAttributesCheckbox,
			showResetButton,
			hierarchical,
			expandable,
			defaultExpanded,
			logoMaxW,
			useFrame,
			aspectRatio,
			limitHeight,
			limitHeightValue,
		} = attributes

		return (
			<>
				<Disabled
					isError={
						(type === 'attributes' &&
							(!attributeTaxonomiesOpts
								.map((aO) => aO.value)
								.includes(attributes.attribute) ||
								!attributes.attribute)) ||
						(type === 'brands' && !brands_enabled)
					}
					type={type}>
					<Preview {...attributes} />
				</Disabled>
				<InspectorControls>
					<Panel header="Filter Settings">
						<Disabled
							isError={
								(type === 'attributes' &&
									(!attributeTaxonomiesOpts
										.map((aO) => aO.value)
										.includes(attributes.attribute) ||
										!attributes.attribute)) ||
								(type === 'brands' && !brands_enabled)
							}
							type={type}
							placement="sidebar">
							<PanelBody>
								<ToggleGroupControl
									label={__('Filter By', 'blocksy-companion')}
									value={type}
									isBlock
									onChange={(newType) =>
										setAttributes({ type: newType })
									}>
									{Object.keys(typesConfig).map(
										(buttonType) => (
											<ToggleGroupControlOption
												key={buttonType}
												value={buttonType}
												label={typesConfig[buttonType]}
												disable={true}
											/>
										)
									)}
								</ToggleGroupControl>

								<ToggleGroupControl
									label={__(
										'Display Type',
										'blocksy-companion'
									)}
									value={viewType}
									isBlock
									onChange={(newViewType) =>
										setAttributes({ viewType: newViewType })
									}>
									<ToggleGroupControlOption
										value="list"
										label={__('List', 'blocksy-companion')}
									/>
									<ToggleGroupControlOption
										value="inline"
										label={__(
											'Inline',
											'blocksy-companion'
										)}
									/>
								</ToggleGroupControl>

								{type === 'attributes' ? (
									<PanelRow>
										<SelectControl
											style={{ width: '250px' }}
											label={__(
												'Attribute',
												'blocksy-companion'
											)}
											options={attributeTaxonomiesOpts}
											value={attributes.attribute}
											onChange={(attribute) =>
												setAttributes({ attribute })
											}
										/>
									</PanelRow>
								) : null}
							</PanelBody>

							<PanelBody>
								<ToggleControl
									label={__(
										'Multiple Selections',
										'blocksy-companion'
									)}
									help={__(
										'Allow selecting multiple items in a filter.',
										'blocksy-companion'
									)}
									checked={multipleFilters}
									onChange={() =>
										setAttributes({
											multipleFilters: !multipleFilters,
										})
									}
								/>
							</PanelBody>

							<PanelBody>
								<ToggleControl
									label={__(
										'Show Search Box',
										'blocksy-companion'
									)}
									checked={showSearch}
									onChange={() =>
										setAttributes({
											showSearch: !showSearch,
										})
									}
								/>
							</PanelBody>

							{type === 'categories' ? (
								<PanelBody>
									<ToggleControl
										label={__(
											'Show Checkboxes',
											'blocksy-companion'
										)}
										checked={showCheckbox}
										onChange={() =>
											setAttributes({
												showCheckbox: !showCheckbox,
											})
										}
									/>
								</PanelBody>
							) : null}

							{type !== 'categories' ? (
								<PanelBody>
									<ToggleControl
										label={__(
											'Show Checkboxes',
											'blocksy-companion'
										)}
										checked={showAttributesCheckbox}
										onChange={() =>
											setAttributes({
												showAttributesCheckbox:
													!showAttributesCheckbox,
											})
										}
									/>
								</PanelBody>
							) : null}

							{type === 'categories' && viewType === 'list' ? (
								<PanelBody>
									<ToggleControl
										label={__(
											'Show Hierarchy',
											'blocksy-companion'
										)}
										checked={hierarchical}
										onChange={() =>
											setAttributes({
												hierarchical: !hierarchical,
											})
										}
									/>

									{hierarchical ? (
										<>
											<ToggleControl
												label={__(
													'Expandable',
													'blocksy-companion'
												)}
												checked={expandable}
												onChange={() =>
													setAttributes({
														expandable: !expandable,
													})
												}
											/>

											{expandable ? (
												<ToggleControl
													label={__(
														'Expanded by Default',
														'blocksy-companion'
													)}
													checked={defaultExpanded}
													onChange={() =>
														setAttributes({
															defaultExpanded:
																!defaultExpanded,
														})
													}
												/>
											) : null}
										</>
									) : null}
								</PanelBody>
							) : null}

							{type !== 'categories' ? (
								<PanelBody>
									<ToggleControl
										label={
											type === 'brands'
												? __(
														'Show Brands Images',
														'blocksy-companion'
												  )
												: __(
														'Show Swatches',
														'blocksy-companion'
												  )
										}
										checked={showItemsRendered}
										onChange={() =>
											setAttributes({
												showItemsRendered:
													!showItemsRendered,
											})
										}
									/>

									{type === 'brands' && showItemsRendered ? (
										<>
											<ToggleGroupControl
												label={__(
													'Image Aspect Ratio',
													'blocksy-companion'
												)}
												value={aspectRatio}
												isBlock
												onChange={(newAspectRatio) =>
													setAttributes({
														aspectRatio:
															newAspectRatio,
													})
												}>
												{sizesConfig.map((ar) => (
													<ToggleGroupControlOption
														key={ar}
														value={ar}
														label={ar}
													/>
												))}
											</ToggleGroupControl>

											<RangeControl
												label={__(
													'Image Max width',
													'blocksy-companion'
												)}
												value={logoMaxW}
												onChange={(val) =>
													setAttributes({
														logoMaxW: val,
													})
												}
												min={10}
												max={140}
												step={10}
											/>

											<ToggleControl
												label={__(
													'Show Image Frame',
													'blocksy-companion'
												)}
												checked={useFrame}
												onChange={() =>
													setAttributes({
														useFrame: !useFrame,
													})
												}
											/>
										</>
									) : null}
								</PanelBody>
							) : null}

							{type !== 'categories' ? (
								<PanelBody>
									<ToggleControl
										label={__(
											'Show Label',
											'blocksy-companion'
										)}
										checked={showLabel}
										onChange={() =>
											setAttributes({
												showLabel: !showLabel,
											})
										}
									/>
								</PanelBody>
							) : null}

							<PanelBody>
								<ToggleControl
									label={__(
										'Show Counter',
										'blocksy-companion'
									)}
									checked={showCounters}
									onChange={() =>
										setAttributes({
											showCounters: !showCounters,
										})
									}
								/>
							</PanelBody>

							<PanelBody>
								<TaxonomySelector
									attributes={attributes}
									setAttributes={setAttributes}
								/>
							</PanelBody>

							<PanelBody>
								<ToggleControl
									label={__(
										'Container Maximum Height',
										'blocksy-companion'
									)}
									checked={limitHeight}
									onChange={() =>
										setAttributes({
											limitHeight: !limitHeight,
										})
									}
								/>

								{limitHeight ? (
									<RangeControl
										label={__(
											'Max Height',
											'blocksy-companion'
										)}
										value={limitHeightValue}
										onChange={(val) =>
											setAttributes({
												limitHeightValue: val,
											})
										}
										min={10}
										max={1000}
										step={10}
									/>
								) : null}
							</PanelBody>

							<PanelBody>
								<ToggleControl
									label={__(
										'Show Reset Button',
										'blocksy-companion'
									)}
									checked={showResetButton}
									onChange={() =>
										setAttributes({
											showResetButton: !showResetButton,
										})
									}
								/>
							</PanelBody>
						</Disabled>
					</Panel>
				</InspectorControls>
			</>
		)
	},
	save: function () {
		return <div>Blocksy: Ajax Category Filter</div>
	},
})

wp.blocks.registerBlockVariation('blocksy/widgets-wrapper', {
	name: 'blocksy-filters',
	title: __('Shop Filters', 'blocksy-companion'),
	attributes: {
		heading: __('Filter', 'blocksy-companion'),
		block: 'blocksy/woocommerce-filters',
	},
	isActive: (attributes) =>
		attributes.block === 'blocksy/woocommerce-filters',
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
