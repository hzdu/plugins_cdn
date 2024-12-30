import {
	registerBlockType,
	__,
	InspectorControls,
	BlockControls,
	RichText,
	ToggleControl,
	TextControl,
	BlockAlignmentToolbar,
	ColorPalette,
	PanelColorSettings,
	IconButton,
	Dashicon,
	SelectControl,
	RangeControl,
	URLInput,
	PanelBody,
	Toolbar,
	ContrastChecker,
	ServerSideRender,
	omit,
	merge,
	Fragment,
} from '../../wp-imports'

import { PenciIcon } from '../../icons'

const MIN_NUMBER= 1;
const MAX_NUMBER = 100;

 // Rendering in PHP
export const save = ( props ) => { return null }

export const edit = ( props ) => {
	const { isSelected, className, setAttributes } = props;
	const { style,cat,number,pagination,numbermore,image_type,filter,column,all_text } = props.attributes;

	const selectStyle = [
		{ value: 'masonry', label: __( 'Masonry' ) },
		{ value: 'grid', label: __( 'Grid' ) },
	];

	const selectPag = [
		{ value: 'number', label: __( 'Numeric Pagination' ) },
		{ value: 'load_more', label: __( 'Load More Button' ) },
		{ value: 'infinite', label: __( 'Infinite Load' ) },
	];

	const selectImgType = [
		{ value: 'square', label: __( 'Square' ) },
		{ value: 'vertical', label: __( 'Vertical' ) },
		{ value: 'landscape', label: __( 'Landscape' ) },
	];

	const selectFilter = [
		{ value: 'true', label: __( 'Yes' ) },
		{ value: 'false', label: __( 'No' ) },
	];

	const selectCols = [
		{ value: '3', label: __( '3 Columns' ) },
		{ value: '2', label: __( '2 Columns' ) },
	];

	 return (
       <Fragment>
	       <InspectorControls>
				<PanelBody title={ __( 'Portfolio Settings' ) }>
					<SelectControl
						label={ __( 'Portfolio Style' ) }
						value={ style }
						options={ selectStyle.map( ( { value, label } ) => ( {
							value: value,
							label: label,
						} ) ) }
						onChange={ ( newValue ) => { setAttributes( { style: newValue } ) } }
					/>
					<TextControl
				      	label={ __( 'Portfolio Categories Slug To Display. E.g: cat-1, cat-2' ) }
				        value={ cat }
				        onChange={ ( newValue ) => setAttributes( { cat: newValue } ) }
				    />
				    <RangeControl
						label={ __( 'Number Portfolio Display' ) }
						value={ number }
						onChange={ ( newValue ) => setAttributes( { number: newValue } ) }
						min={ MIN_NUMBER }
						max={ MAX_NUMBER }
					/>
					<SelectControl
						label={ __( 'Pagination' ) }
						value={ pagination }
						options={ selectPag.map( ( { value, label } ) => ( {
							value: value,
							label: label,
						} ) ) }
						onChange={ ( newValue ) => { setAttributes( { pagination: newValue } ) } }
					/>
					<TextControl
					label={ __( 'Custom Number Posts for Each Time Load More Posts' ) }
					value={ numbermore }
					onChange={ ( newValue ) => setAttributes( { numbermore: newValue } ) }
					/>
					{ style === 'grid' &&
					<SelectControl
						label={ __( 'Image Type - Just apply for Grid Style' ) }
						value={ image_type }
						options={ selectImgType.map( ( { value, label } ) => ( {
							value: value,
							label: label,
						} ) ) }
						onChange={ ( newValue ) => { setAttributes( { image_type: newValue } ) } }
					/>
					}	

					<SelectControl
						label={ __( 'Display Filter?' ) }
						value={ filter }
						options={ selectFilter.map( ( { value, label } ) => ( {
							value: value,
							label: label,
						} ) ) }
						onChange={ ( newValue ) => { setAttributes( { filter: newValue } ) } }
					/>
					<SelectControl
						label={ __( 'Number Columns' ) }
						value={ column }
						options={ selectCols.map( ( { value, label } ) => ( {
							value: value,
							label: label,
						} ) ) }
						onChange={ ( newValue ) => { setAttributes( { column: newValue } ) } }
					/>
					<TextControl
				      	label={ __( 'All Portfolio Text' ) }
				        value={ all_text }
				        onChange={ ( newValue ) => setAttributes( { all_text: newValue } ) }
				    />
				</PanelBody>
			</InspectorControls>
	        <ServerSideRender
	            block="penci-gutenberg/portfolio"
	            attributes={ props.attributes }
	        />
        </Fragment>
    );
}

registerBlockType( 'penci-gutenberg/portfolio', {
	title: __( 'Penci: Portfolio' ),
	icon: PenciIcon,
	category: 'penci-blocks',
	edit: edit,
	save: save,
} );
