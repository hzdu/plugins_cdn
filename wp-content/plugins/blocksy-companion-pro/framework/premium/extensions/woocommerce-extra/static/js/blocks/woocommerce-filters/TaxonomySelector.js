import {
	createElement,
	useMemo,
	useState,
	useCallback,
	useEffect,
} from '@wordpress/element'
import { useSelect } from '@wordpress/data'

import { sprintf, __ } from 'ct-i18n'

import { PanelRow, ToggleControl, FormTokenField } from '@wordpress/components'

const cachedFetch = {}

const { attributes_tax } = window.blc_filters_data

const TaxonomySelector = ({ attributes, setAttributes }) => {
	const { type, attribute, excludeTaxonomy, taxonomy_not_in } = attributes
	const [options, setOptions] = useState(taxonomy_not_in)

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

	const taxonomyLabel = useMemo(() => {
		if (type === 'categories') {
			return __('Product Categories', 'blocksy-companion')
		}

		if (type === 'brands') {
			return __('Product Brands', 'blocksy-companion')
		}

		if (type === 'attributes') {
			return __('Product Attributes', 'blocksy-companion')
		}

		return __('Taxonomy', 'blocksy-companion')
	}, [type])

	const fetchAttributes = useCallback(async () => {
		if (selected_attr) {
			if (cachedFetch[selected_attr.attribute_id]) {
				setOptions(cachedFetch[selected_attr.attribute_id])
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
						setOptions(data)
						cachedFetch[selected_attr.attribute_id] = data
					})
			}
		}
	}, [attribute, cachedFetch, selected_attr])

	useEffect(() => {
		if (type === 'categories' && product_cat.length) {
			setOptions(
				product_cat.filter(
					(cat) => !taxonomy_not_in.includes(cat.parent)
				)
			)

			return
		}

		if (type === 'brands' && product_brands.length) {
			setOptions(product_brands)
			return
		}

		if (type === 'attributes') {
			fetchAttributes()
			return
		}

		setOptions([])
	}, [type, product_cat, product_brands, attribute, taxonomy_not_in])

	return (
		<>
			<ToggleControl
				label={sprintf(
					__('Exclude %s', 'blocksy-companion'),
					taxonomyLabel
				)}
				help={false}
				checked={excludeTaxonomy}
				onChange={() =>
					setAttributes({
						excludeTaxonomy: !excludeTaxonomy,
					})
				}
			/>

			{excludeTaxonomy ? (
				<FormTokenField
					label={__('Exclude Speciffic Items', 'blocksy-companion')}
					__experimentalShowHowTo={false}
					value={options
						.filter((tax) => taxonomy_not_in.includes(tax.id))
						.map((tax) => `${tax.name}---${tax.id}`)}
					suggestions={options.map(
						(tax) => `${tax.name}---${tax.id}`
					)}
					displayTransform={(v) => v.split('---')[0]}
					__experimentalExpandOnFocus
					onChange={(tokens) => {
						setAttributes({
							taxonomy_not_in: tokens.map(
								(tax) => +tax.split('---')[1]
							),
						})
					}}
				/>
			) : null}
		</>
	)
}

export default TaxonomySelector
