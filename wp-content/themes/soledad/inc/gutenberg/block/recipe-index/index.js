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
	const { title,cat,numbers_posts,columns,display_title,display_cat,display_date,display_image,image_size,cat_link, cat_link_text } = props.attributes;

	const selectcolumns = [
		{ value: '2', label: __( '2 Columns' ) },
		{ value: '3', label: __( '3 Columns' ) },
		{ value: '4', label: __( '4 Columns' ) },
	];

	const selectImageSize = [
		{ value: 'landscape', label: __( 'Landscape' ) },
		{ value: 'square', label: __( 'Square' ) },
		{ value: 'vertical', label: __( 'Vertical' ) },
	];


	
	 return (
       <Fragment>	
       <InspectorControls>
			<PanelBody title={ __( 'Recipe Index Settings' ) }>
				<TextControl
			      	label={ __( 'Title' ) }
			        value={ title }
			        onChange={ ( newValue ) => setAttributes( { title: newValue } ) }
			    />
			    <TextControl
			      	label={ __( 'Recipe Index Category Slug' ) }
			        value={ cat }
			        onChange={ ( newValue ) => setAttributes( { cat: newValue } ) }
			    />
			    <RangeControl
					label={ __( 'Numbers Posts to Show?' ) }
					value={ numbers_posts }
					onChange={ ( newValue ) => setAttributes( { numbers_posts: newValue } ) }
					min={ MIN_NUMBER }
					max={ MAX_NUMBER }
				/>
				<SelectControl
					label={ __( 'Select Columns' ) }
					value={ columns }
					options={ selectcolumns.map( ( { value, label } ) => ( {
						value: value,
						label: label,
					} ) ) }
					onChange={ ( newValue ) => { setAttributes( { columns: newValue } ) } }
				/>
				<ToggleControl
					label={ __( 'Display Posts Title?' ) }
					checked={ display_title }
					onChange={ () => setAttributes( { display_title: ! display_title } ) }
				/>
				<ToggleControl
					label={ __( 'Display Posts Categories?' ) }
					checked={ display_cat }
					onChange={ () => setAttributes( { display_cat: ! display_cat } ) }
				/>
				<ToggleControl
					label={ __( 'Display Posts Date?' ) }
					checked={ display_date }
					onChange={ () => setAttributes( { display_date: ! display_date } ) }
				/>
				<ToggleControl
					label={ __( 'Display Posts Featured Image?' ) }
					checked={ display_image }
					onChange={ () => setAttributes( { display_image: ! display_image } ) }
				/>
				<SelectControl
					label={ __( 'Images Size for Featured Image' ) }
					value={ image_size }
					options={ selectImageSize.map( ( { value, label } ) => ( {
						value: value,
						label: label,
					} ) ) }
					onChange={ ( newValue ) => { setAttributes( { image_size: newValue } ) } }
				/>
				
				<ToggleControl
					label={ __( 'Display View All Posts ( Category Link )?' ) }
					checked={ cat_link }
					onChange={ () => setAttributes( { cat_link: ! cat_link } ) }
				/>
				<TextControl
			      	label={ __( 'Custom "View All" button text' ) }
			        value={ cat_link_text }
			        onChange={ ( newValue ) => setAttributes( { cat_link_text: newValue } ) }
			    />
			</PanelBody>
		</InspectorControls>
        <ServerSideRender
            block="penci-gutenberg/recipe-index"
            attributes={ props.attributes }
        />
        </Fragment>
    );
}

registerBlockType( 'penci-gutenberg/recipe-index', {
	title: __( 'Penci: Recipe Index' ),
	icon: PenciIcon,
	category: 'penci-blocks',
	edit: edit,
	save: save,
} );
