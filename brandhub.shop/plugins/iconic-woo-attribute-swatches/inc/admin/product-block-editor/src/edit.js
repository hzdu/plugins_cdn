/**
 * External dependencies
 */
import { useWooBlockProps } from '@woocommerce/block-templates';
import { __ } from '@wordpress/i18n';
import { __experimentalUseProductEntityProp as useProductEntityProp } from '@woocommerce/product-editor';
import { map } from 'lodash';

/**
 * Internal dependencies
 */
import { SwatchesField, FeesField } from './components';
import './editor.scss';

function formatSwatchLabel( type ) {
	switch ( type ) {
		case 'image-swatch':
			return __( 'Swatches (Image)', 'iconic-was' );

		case 'colour-swatch':
			return __( 'Swatches (Colour)', 'iconic-was' );

		case 'text-swatch':
			return __( 'Swatches (Text)', 'iconic-was' );

		case 'radio-buttons':
			return __( 'Swatches (Radio Buttons)', 'iconic-was' );

		default:
			return __( 'Swatches', 'iconic-was' );
	}
}

/**
 * Update a field and get the updated Attribute Swatched data object.
 * @param {Object} attributeSwatchesValue
 * @param {String} attributeSlug
 * @param {String} fieldName
 * @param {*} newValue
 * @returns {Object}
 */
function getUpdatedAttributeSwatchesValue(
	attributeSwatchesValue,
	attributeSlug,
	fieldName,
	newValue
) {
	return {
		...attributeSwatchesValue,
		[ attributeSlug ]: {
			...attributeSwatchesValue[ attributeSlug ],
			values: {
				...attributeSwatchesValue[ attributeSlug ].values,
				[ fieldName ]: newValue,
			},
		},
	};
}

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 */
export function Edit( { attributes } ) {
	const blockProps = useWooBlockProps( attributes );

	const { property, postType } = attributes;

	const [ attributeSwatchesValue, setValue ] = useProductEntityProp(
		property,
		{
			postType,
			fallbackValue: false,
		}
	);

	return (
		<div { ...blockProps }>
			{ map( attributeSwatchesValue, ( item, attributeSlug ) => {
				const swatchesFields = item?.fields.filter(
					( field ) => field.field_name !== 'attribute_fees'
				);
				const feesFields = item?.fields.filter(
					( field ) => field.field_name === 'attribute_fees'
				);

				return (
					<div key={ attributeSlug }>
						<h3>{ item?.label }</h3>

						<SwatchesField
							label={ formatSwatchLabel(
								item?.values?.swatch_type
							) }
							fields={ swatchesFields }
							values={ item?.values }
							attributeSwatchesValue={ attributeSwatchesValue }
							attributeSlug={ attributeSlug }
							options={ item?.options }
							setValue={ setValue }
							getUpdatedAttributeSwatchesValue={
								getUpdatedAttributeSwatchesValue
							}
						/>

						<FeesField
							fields={ feesFields }
							feeValues={ item?.values?.fees }
							setValue={ setValue }
							attributeSwatchesValue={ attributeSwatchesValue }
							getUpdatedAttributeSwatchesValue={
								getUpdatedAttributeSwatchesValue
							}
							attributeSlug={ attributeSlug }
						/>
					</div>
				);
			} ) }
		</div>
	);
}
