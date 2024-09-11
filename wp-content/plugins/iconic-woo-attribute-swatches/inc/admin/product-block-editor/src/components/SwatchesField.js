/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import { MediaUpload } from '@wordpress/media-utils';
import {
	SelectControl as Select,
	__experimentalNumberControl as NumberInput,
	Flex,
	__experimentalText as Text,
	Icon,
	ColorIndicator,
	ColorPicker,
} from '@wordpress/components';
import {
	castArray,
	isArray,
	map,
	parseInt,
	isNumber,
	find,
	mapValues,
} from 'lodash';
import { CollapsibleContent } from '@woocommerce/components';

/**
 *
 * @param {string} id
 * @param {Object} fields
 * @returns {string|undefined}
 */
function getFieldName( id, fields ) {
	const field = find( fields, ( field ) => {
		const { field_settings: settings } = field;

		return settings?.id === id;
	} );

	return field?.field_name;
}

/**
 * Format the colour swatch values object.
 *
 * @param {Object} values
 * @param {Array} options
 * @returns {Object}
 */
function formatColourSwatchValues( values, options ) {
	if ( values ) {
		return mapValues( values, ( value ) => ( {
			...value,
			url: undefined,
		} ) );
	}

	return options?.reduce( ( accumulator, option ) => {
		accumulator[ option.slug ] = {
			label: option.name,
			value: '',
		};

		return accumulator;
	}, {} );
}

/**
 * Format the image swatch values object.
 *
 * @param {Object} values
 * @param {Array} options
 * @returns {Object}
 */
function formatImageSwatchValues( values, options ) {
	if ( values ) {
		return values;
	}

	return options?.reduce( ( accumulator, option ) => {
		accumulator[ option.slug ] = {
			label: option.name,
			value: '',
			url: '',
		};

		return accumulator;
	}, {} );
}

/**
 * Color input component.
 */
function ColorInput( props ) {
	const { label, colorValue, onChange } = props;
	const [ showPicker, setShowPicker ] = useState( false );

	return (
		<div className="wp-block-iconic-was-product-block-editor__color">
			<label className="wp-block-iconic-was-product-block-editor__color-label">
				{ label }
			</label>

			<ColorIndicator
				colorValue={ colorValue }
				onClick={ () => setShowPicker( ! showPicker ) }
				className="wp-block-iconic-was-product-block-editor__color-indicator"
			/>

			{ showPicker && (
				<ColorPicker color={ colorValue } onChange={ onChange } />
			) }
		</div>
	);
}

/**
 * Image input component.
 */
function ImageInput( props ) {
	const { label, value, url, onChange, onRemove } = props;

	const formattedValue = parseInt( value );

	return (
		<div className="wp-block-iconic-was-product-block-editor__image-wrapper">
			<div className="wp-block-iconic-was-product-block-editor__image-label">
				{ label }
			</div>

			<div
				className={ `wp-block-iconic-was-product-block-editor__image-preview ${
					url
						? 'wp-block-iconic-was-product-block-editor__image-preview--bg-transparent'
						: ''
				}` }
			>
				{ url && <img src={ url } /> }

				<MediaUpload
					allowedTypes="image"
					onSelect={ onChange }
					value={ formattedValue ? formattedValue : undefined }
					render={ ( { open } ) => (
						<>
							{ !! formattedValue &&
								isNumber( formattedValue ) && (
									<Icon
										onClick={ onRemove }
										icon="no"
										style={ { fontFamily: 'dashicons' } }
										className="wp-block-iconic-was-product-block-editor__image-icon"
										title={ __(
											'Remove Image',
											'iconic-was'
										) }
									/>
								) }
							<Icon
								onClick={ open }
								icon={
									formattedValue && isNumber( formattedValue )
										? 'edit'
										: 'plus'
								}
								style={ { fontFamily: 'dashicons' } }
								className="wp-block-iconic-was-product-block-editor__image-icon"
								title={ __( 'Upload/Add Image', 'iconic-was' ) }
							/>
						</>
					) }
				/>
			</div>
		</div>
	);
}

/**
 * SwatchesField component.
 */
export function SwatchesField( {
	label,
	fields,
	values,
	options,
	setValue,
	attributeSwatchesValue,
	attributeSlug,
	getUpdatedAttributeSwatchesValue,
} ) {
	return (
		<CollapsibleContent toggleText={ label }>
			{ fields?.map( ( field ) => {
				const {
					field_settings: settings,
					label,
					description,
					condition,
					match,
					field_name,
				} = field;

				if ( isArray( condition ) ) {
					for ( let index = 0; index < condition.length; index++ ) {
						const condition_field_id = condition[ index ];
						const condition_field_name = getFieldName(
							condition_field_id,
							fields
						);
						const value = values?.[ condition_field_name ];

						const matches = castArray( match?.[ index ] );

						if ( ! matches?.includes( value ) ) {
							return <></>;
						}
					}
				}

				if ( condition && ! isArray( condition ) ) {
					const condition_field_name = getFieldName(
						condition,
						fields
					);
					const value = values?.[ condition_field_name ];

					if ( ! match?.includes( value ) ) {
						return <></>;
					}
				}

				switch ( settings?.type ) {
					case 'select':
						return (
							<div
								key={ settings?.id }
								className="wp-block-iconic-was-product-block-editor__field"
							>
								<Select
									id={ settings?.id }
									label={ label }
									options={ settings?.options }
									help={ description }
									value={ values?.[ field_name ] }
									onChange={ ( newValue ) => {
										setValue(
											getUpdatedAttributeSwatchesValue(
												attributeSwatchesValue,
												attributeSlug,
												field_name,
												newValue
											)
										);
									} }
								/>
							</div>
						);

					case 'dimensions':
						return (
							<div
								key={ settings?.id }
								className="wp-block-iconic-was-product-block-editor__field wp-block-iconic-was-product-block-editor__field-dimensions"
							>
								<Text>{ label }</Text>
								<Flex justify="flex-start">
									<NumberInput
										label={ __( 'Width', 'iconic-was' ) }
										labelPosition="side"
										min={ 0 }
										value={ values?.[ field_name ]?.width }
										onChange={ ( newValue ) => {
											const fieldValue = {
												width: newValue,
												height: values?.[ field_name ]
													?.height,
											};

											setValue(
												getUpdatedAttributeSwatchesValue(
													attributeSwatchesValue,
													attributeSlug,
													field_name,
													fieldValue
												)
											);
										} }
									/>
									<NumberInput
										label={ __( 'Height', 'iconic-was' ) }
										labelPosition="side"
										min={ 0 }
										value={ values?.[ field_name ]?.height }
										onChange={ ( newValue ) => {
											const fieldValue = {
												height: newValue,
												width: values?.[ field_name ]
													?.width,
											};

											setValue(
												getUpdatedAttributeSwatchesValue(
													attributeSwatchesValue,
													attributeSlug,
													field_name,
													fieldValue
												)
											);
										} }
									/>
								</Flex>
							</div>
						);

					default:
						return <></>;
				}
			} ) }

			{ 'colour-swatch' === values?.swatch_type && (
				<>
					{ map( values?.values || options, ( attribute, key ) => {
						return (
							<ColorInput
								key={ key }
								label={ attribute?.label || attribute?.name }
								colorValue={ attribute?.value || '' }
								onChange={ ( value ) => {
									const currentValues =
										formatColourSwatchValues(
											values?.values,
											options
										);

									const slug = options?.[ key ]?.slug || key;

									const fieldValue = {
										...currentValues,
										[ slug ]: {
											...currentValues[ slug ],
											value,
										},
									};

									setValue(
										getUpdatedAttributeSwatchesValue(
											attributeSwatchesValue,
											attributeSlug,
											'values',
											fieldValue
										)
									);
								} }
							/>
						);
					} ) }
				</>
			) }

			{ 'image-swatch' === values?.swatch_type && (
				<>
					{ map( values?.values || options, ( attribute, key ) => {
						return (
							<ImageInput
								key={ key }
								label={ attribute?.label || attribute?.name }
								url={ attribute?.url }
								value={ attribute?.value }
								onChange={ ( media ) => {
									const currentValues =
										formatImageSwatchValues(
											values?.values,
											options
										);

									const slug = options?.[ key ]?.slug || key;

									const fieldValue = {
										...currentValues,
										[ slug ]: {
											...currentValues[ slug ],
											value: parseInt( media?.id ),
											url: media?.url,
										},
									};

									setValue(
										getUpdatedAttributeSwatchesValue(
											attributeSwatchesValue,
											attributeSlug,
											'values',
											fieldValue
										)
									);
								} }
								onRemove={ () => {
									const currentValues =
										formatImageSwatchValues(
											values?.values,
											options
										);

									const slug = options?.[ key ]?.slug || key;

									const fieldValue = {
										...currentValues,
										[ slug ]: {
											...currentValues[ slug ],
											value: '',
											url: '',
										},
									};

									setValue(
										getUpdatedAttributeSwatchesValue(
											attributeSwatchesValue,
											attributeSlug,
											'values',
											fieldValue
										)
									);
								} }
							/>
						);
					} ) }
				</>
			) }
		</CollapsibleContent>
	);
}
