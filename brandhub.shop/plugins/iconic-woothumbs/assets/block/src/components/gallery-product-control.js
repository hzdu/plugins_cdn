import { __ } from '@wordpress/i18n';
import apiFetch from '@wordpress/api-fetch';
import { BaseControl, Button } from '@wordpress/components';
import { addQueryArgs } from '@wordpress/url';
import AsyncSelect from 'react-select/async';

const GalleryProductControl = ( { selectedProductValue, setAttributes } ) => {
	const getProductsBySearchTerm = ( searchQuery = '' ) => {
		// We cannot utilise useSelect here, as that forces a component re-render.
		return new Promise ( ( resolve, reject ) => {
			const apiPath = addQueryArgs(
				'/wp/v2/product',
				{
					"context": "edit",
					"_locale": "user",
					"per_page": 100,
					"status": "publish",
					"search": searchQuery,
					"woothumbs": true
				}
			);

			apiFetch( { path: apiPath } )
				.then( ( result ) => {
					if ( ! result ) {
						resolve( [] );
					}

					resolve(
						result.map( post => ({
							label: `${post.title.raw} (#${post.id})`,
							value: post.id
						} ) )
					 );
				})
				.catch(function (error) {
					reject( [] );
				});
		} );
	}

	const loadProductsBySearchTerm = ( inputValue ) => {
		return new Promise ( ( resolve, reject ) => {
			// Return no results if we have input that is less than 3 characters.
			if ( inputValue.length && inputValue.length < 3 ) {
				return resolve( [] );
			}

			getProductsBySearchTerm( inputValue )
			.then( ( products ) => {
				resolve( products );
			})
			.catch(function (error) {
				reject( [] );
			});
		}
	) };

	const placeholderLabel = ( selectedProductValue ) ? `${selectedProductValue.label} - `: '';
	const placeholderText = `${placeholderLabel}Search products...`;

	return (
		<BaseControl
			id='iconic-woothumbs-block-editor-placeholder-select'
			className='iconic-woothumbs-block-editor-placeholder__base'
			label={ __( 'Use the dropdown or type to search:', 'iconic-woothumbs' ) }
			__nextHasNoMarginBottom={ true }
			>
			<AsyncSelect
				inputId='iconic-woothumbs-block-editor-placeholder-select'
				className='iconic-woothumbs-block-editor-placeholder__select'
				classNamePrefix='iconic-woothumbs-block-editor-placeholder__select'
				controlShouldRenderValue={ false }
				autoFocus={ true }
				placeholder={ placeholderText }
				theme={(theme) => ({
					...theme,
					colors: {
					...theme.colors,
					primary: '#0085ba',
					},
				})}
				defaultOptions
				loadOptions={loadProductsBySearchTerm}
				value={ selectedProductValue }
				onChange={ selectedProduct => setAttributes( { 'selectedProduct': JSON.stringify( selectedProduct ) } ) }
			/>
			<div className="iconic-woothumbs-block-editor-placeholder__button-wrap">
				<Button
					variant="primary"
					onClick={ () => setAttributes( { 'isEditing': false } ) }
					>
					{ __( 'Select Product', 'iconic-woothumbs' ) }
				</Button>
			</div>
		</BaseControl>
	)
}

 export default GalleryProductControl;
