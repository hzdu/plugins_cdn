import { __ } from '@wordpress/i18n';
import { Fragment } from '@wordpress/element';
import { useBlockProps } from '@wordpress/block-editor';
import EditorBlockControls from './components/block-controls';
import EditorInspectorControls from './components/inspector-controls';
import GalleryProductControl from './components/gallery-product-control';
import PlaceholderHeading from './components/placeholder-heading';
import PlaceholderImage from './components/placeholder-image';
import PlaceholderText from './components/placeholder-text';
import './editor.scss';

export default function edit( { attributes, isSelected, setAttributes } ) {
	const { selectedProduct, galleryWidth, isEditing } = attributes;
	const selectedProductValue = ( selectedProduct ) ? JSON.parse( selectedProduct ) : '';
	const placeholderStyles = { 'maxWidth': galleryWidth + '%' }
	const containerClasses = ( isSelected || ! selectedProductValue ) ? 'iconic-woothumbs-block-editor-placeholder iconic-woothumbs-block-editor-placeholder--selected': 'iconic-woothumbs-block-editor-placeholder';

	return (
		<div { ...useBlockProps() }>
			<EditorBlockControls
				isEditing={ isEditing }
				setAttributes={ setAttributes }
			/>
			<div
				className={ containerClasses }
				style={ placeholderStyles }
			>

				<PlaceholderHeading
					selectedProductValue={ selectedProductValue }
				/>

				{ ( isSelected && isEditing ) || ! selectedProductValue ? (
					<div id="iconic-woothumbs-block-editor-toolbar">
						<GalleryProductControl
							selectedProduct={ selectedProduct }
							selectedProductValue={ selectedProductValue }
							setAttributes={ setAttributes }
							isSelected={ isSelected }
							isEditing={ isEditing }
						/>
					</div>
				) : (
					<Fragment>
						<EditorInspectorControls
							galleryWidth={ galleryWidth }
							setAttributes={ setAttributes }
						/>
						<PlaceholderImage
							selectedProductValue={ selectedProductValue }
						/>
						<PlaceholderText/>
					</Fragment>
				) }
			</div>
		</div>
	);
}
