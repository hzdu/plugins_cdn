import {
	createElement,
	useCallback,
	useState,
	useEffect,
	useMemo,
} from '@wordpress/element'

import { __, sprintf } from 'ct-i18n'

import { __experimentalText as Text, Spinner } from '@wordpress/components'

import { useSelect } from '@wordpress/data'
import CategoryItem from './CategoryItem'
import { attributeTaxonomiesOpts, typesConfig } from '.'

const {
	attributes_tax,
	has_swatches,
	has_brands,
	ct_color_swatch_shape,
	ct_image_swatch_shape,
	ct_button_swatch_shape,
} = window.blc_filters_data

const brands_enabled = !!parseInt(has_brands)
const swatches_enabled = !!parseInt(has_swatches)

const cachedFetch = {}

const shapes = {
	color: ct_color_swatch_shape,
	image: ct_image_swatch_shape,
	button: ct_button_swatch_shape,
}

const Preview = ({
	type,
	showCheckbox,
	showSearch,
	showAttributesCheckbox,
	showItemsRendered,
	showResetButton,
	showLabel,
	showCounters,
	attribute,
	hierarchical,
	expandable,
	defaultExpanded,
	viewType,
	logoMaxW,
	limitHeight,
	limitHeightValue,
	useFrame,
	aspectRatio,
	excludeTaxonomy,
	taxonomy_not_in,
}) => {
	const [items, setItems] = useState([])
	const [isLoading, setIsLoading] = useState(false)

	const product_cat = useSelect(
		(select) =>
			select('core').getEntityRecords('taxonomy', 'product_cat', {
				per_page: -1,
			}) || []
	)

	const product_brands = useSelect(
		(select) =>
			select('core').getEntityRecords('taxonomy', 'product_brands', {
				per_page: -1,
			}) || []
	)

	const selected_attr = useMemo(
		() =>
			Object.values(attributes_tax).find(
				(a) => a.attribute_name === attribute
			),
		[attribute]
	)

	const fetchAttributes = useCallback(async () => {
		setIsLoading(true)

		if (selected_attr) {
			if (cachedFetch[selected_attr.attribute_id]) {
				setItems(cachedFetch[selected_attr.attribute_id])
				setIsLoading(false)
			} else {
				fetch(
					`${
						(
							window.ct_localizations ||
							window.ct_customizer_localizations
						).rest_url
					}blocksy/v1/attributes/${selected_attr.attribute_id}`
				)
					.then((res) => res.json())
					.then((data) => {
						setItems(data)
						setIsLoading(false)
						cachedFetch[selected_attr.attribute_id] = data
					})
			}
		}
	}, [attribute, cachedFetch, selected_attr])

	useEffect(() => {
		if (type === 'categories' && product_cat.length) {
			if (hierarchical && viewType === 'list') {
				setItems(product_cat.filter((cat) => !cat.parent))
			} else {
				setItems(product_cat)
			}
		}

		if (type === 'brands' && product_brands.length) {
			setItems(product_brands)
		}

		if (type === 'attributes') {
			fetchAttributes()
		}
	}, [type, product_cat, product_brands, attribute, hierarchical, viewType])

	const additionalProps = useMemo(() => {
		if (type === 'brands') {
			return {
				style: {
					'--product-brand-logo-size': `${logoMaxW}px`,
					'--product-brand-logo-aspect-ratio': aspectRatio,
					...(limitHeight
						? { maxHeight: `${limitHeightValue}px` }
						: {}),
				},
				'data-frame': useFrame ? 'yes' : 'no',
			}
		}

		if (
			type === 'attributes' &&
			selected_attr?.type &&
			selected_attr?.type !== 'select'
		) {
			return {
				'data-swatches-shape': shapes[selected_attr.type],
				'data-swatches-type': selected_attr.type,
				...(limitHeight
					? {
							style: { maxHeight: `${limitHeightValue}px` },
					  }
					: {}),
			}
		}

		return {
			...(limitHeight
				? {
						style: {
							...(limitHeight
								? { maxHeight: `${limitHeightValue}px` }
								: {}),
						},
				  }
				: {}),
		}
	}, [
		type,
		useFrame,
		logoMaxW,
		aspectRatio,
		limitHeight,
		limitHeightValue,
		selected_attr?.type,
	])

	return (
		<div class="ct-filter-widget-wrapper">
			{showSearch ? (
				<div class="ct-filter-search">
					<input
						type="search"
						placeholder={sprintf(
							__('Find by %s', 'blocksy-companion'),
							type !== 'attributes'
								? typesConfig[type]
								: attributeTaxonomiesOpts.find(
										(a) => a.value === attribute
								  )?.label || attribute
						)}
					/>
					<span class="ct-filter-search-icon">
						<svg
							className="ct-filter-search-zoom-icon"
							width="13"
							height="13"
							fill="currentColor"
							aria-hidden="true"
							viewBox="0 0 15 15">
							<path d="M14.8,13.7L12,11c0.9-1.2,1.5-2.6,1.5-4.2c0-3.7-3-6.8-6.8-6.8S0,3,0,6.8s3,6.8,6.8,6.8c1.6,0,3.1-0.6,4.2-1.5l2.8,2.8c0.1,0.1,0.3,0.2,0.5,0.2s0.4-0.1,0.5-0.2C15.1,14.5,15.1,14,14.8,13.7z M1.5,6.8c0-2.9,2.4-5.2,5.2-5.2S12,3.9,12,6.8S9.6,12,6.8,12S1.5,9.6,1.5,6.8z"></path>
						</svg>
					</span>
				</div>
			) : null}
			<ul
				className="ct-filter-widget"
				{...additionalProps}
				data-display-type={viewType}>
				{!isLoading && items.length ? (
					items.map((item) => {
						if (
							taxonomy_not_in.includes(item.id) &&
							excludeTaxonomy
						) {
							return null
						}

						if (type === 'categories') {
							return (
								<CategoryItem
									key={item.id}
									category={item}
									showCheckbox={showCheckbox}
									showLabel={showLabel}
									showCounters={showCounters}
									defaultExpanded={
										expandable ? defaultExpanded : true
									}
									hierarchical={
										viewType === 'list'
											? hierarchical
											: false
									}
									expandable={
										viewType === 'list' ? expandable : false
									}
									taxonomy_not_in={taxonomy_not_in}
									excludeTaxonomy={excludeTaxonomy}
								/>
							)
						}

						const maybeColor =
							item?.meta?.[0]?.accent_color?.default?.color
						const maybeImage = item?.meta?.[0]?.image?.url

						return (
							<li className="ct-filter-item" key={item.id}>
								<div className="ct-filter-item-inner">
									<a href="#">
										{showAttributesCheckbox ? (
											<span className="ct-filter-checkbox" />
										) : null}

										{type === 'attributes' &&
										swatches_enabled &&
										showItemsRendered ? (
											<>
												{(selected_attr?.type ===
													'color' &&
													maybeColor !==
														'CT_CSS_SKIP_RULE') ||
												(selected_attr?.type ===
													'image' &&
													maybeImage) ||
												selected_attr?.type ===
													'button' ? (
													<span className="ct-swatch-container">
														{selected_attr?.type ===
														'color' ? (
															<span
																className="ct-swatch"
																style={{
																	backgroundColor:
																		maybeColor,
																}}
															/>
														) : null}
														{selected_attr?.type ===
														'image' ? (
															<span className="ct-media-container ct-swatch">
																<img
																	src={
																		maybeImage
																	}
																	alt={
																		item.name
																	}
																/>
															</span>
														) : null}
														{selected_attr?.type ===
														'button' ? (
															<span className="ct-swatch">
																{item?.short_name ||
																	item?.name}
															</span>
														) : null}
													</span>
												) : null}
											</>
										) : null}
										{type === 'brands' &&
										item?.logo?.url &&
										brands_enabled &&
										showItemsRendered ? (
											<div className="ct-media-container ct-product-brand">
												<img
													src={item.logo.url}
													alt={item.name}
												/>
											</div>
										) : null}
										{showLabel ? (
											<span className="ct-filter-label">
												{item.name}
											</span>
										) : null}
										{showCounters ? (
											<span className="ct-filter-count">
												{item.count}
											</span>
										) : null}
									</a>
								</div>
							</li>
						)
					})
				) : (
					<Spinner />
				)}
			</ul>

			{showResetButton ? (
				<div class="ct-filter-reset wp-block-button is-style-outline">
					<a
						href="#"
						class="ct-button-ghost wp-element-button wp-block-button__link">
						<svg
							width="12"
							height="12"
							viewBox="0 0 15 15"
							fill="currentColor">
							<path d="M8.5,7.5l4.5,4.5l-1,1L7.5,8.5L3,13l-1-1l4.5-4.5L2,3l1-1l4.5,4.5L12,2l1,1L8.5,7.5z"></path>
						</svg>
						{__('Reset Filter', 'blocksy-companion')}
					</a>
				</div>
			) : null}
		</div>
	)
}

export default Preview
