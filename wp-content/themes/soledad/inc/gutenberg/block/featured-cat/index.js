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
	const { style, category, number, orderby, order } = props.attributes;

	const selectStyle = [
		{ value: 'style-1', label: __( 'Style 1 - 1st Post Grid Featured on Left' ) },
		{ value: 'style-2', label: __( 'Style 2 - 1st Post Grid Featured on Top' ) },
		{ value: 'style-3', label: __( 'Style 3 - Text Overlay' ) },
		{ value: 'style-4', label: __( 'Style 4 - Single Slider' ) },
        {value: 'style-5', label: __('Style 5 - Slider 2 Columns')},
        {value: 'style-6', label: __('Style 6 - 1st Post List Featured on Top')},
        {value: 'style-7', label: __('Style 7 - Grid 2 Columns')},
        {value: 'style-8', label: __('Style 8 - List Layout')},
        {value: 'style-9', label: __('Style 9 - Small List Layout')},
        {value: 'style-10', label: __('Style 10 - 2 First Posts Featured and List')},
        {value: 'style-11', label: __('Style 11 - Text Overlay Center')},
        {value: 'style-12', label: __('Style 12 - Slider 3 Columns')},
        {value: 'style-13', label: __('Style 13 - Grid 3 Columns')},
        {value: 'style-14', label: __('Style 14 - 1st Post Overlay Featured on Top')},
        {value: 'style-15', label: __('Style 15 - Overlay Left then List on Right')},
    ];

	const selectOrderby = [
		{value: 'date', label: __( 'Post Date' )},
		{value: 'ID', label: __( 'Post ID' )},
		{value: 'title', label: __( 'Post Title' )},
		{value: 'rand', label: __( 'Random Posts' )},
	];

	const selectOrder = [
		{value: 'DESC', label: __( 'Descending' )},
		{value: 'ASC', label: __( 'Ascending' )}
	];

	 return (
       <Fragment>
	       <InspectorControls>
				<PanelBody title={ __( 'Featured Category Settings' ) }>
					<SelectControl
						label={ __( 'Featured Category Layout' ) }
						value={ style }
						options={ selectStyle.map( ( { value, label } ) => ( {
							value: value,
							label: label,
						} ) ) }
						onChange={ ( newValue ) => { setAttributes( { style: newValue } ) } }
					/>
					<TextControl
						label={ __( 'Category' ) }
						value={ category }
						onChange={ ( newValue ) => setAttributes( { category: newValue } ) }
						help={ __( 'If you want to exclude any categories, fill the categories slug here. See here to know what is category slug. Example: travel' ) }
					/>
					<RangeControl
						label={ __( 'Number Posts Display' ) }
						value={ number }
						onChange={ ( newValue ) => setAttributes( { number: newValue } ) }
						min={ MIN_NUMBER }
						max={ MAX_NUMBER }
						help={ __( 'Fill the number posts display you want here' ) }
					/>
					<SelectControl
						label={ __( 'Order by' ) }
						value={ orderby }
						options={ selectOrderby.map( ( { value, label } ) => ( {
							value: value,
							label: label,
						} ) ) }
						onChange={ ( newValue ) => { setAttributes( { orderby: newValue } ) } }
					/>
					<SelectControl
						label={ __( 'Sort order' ) }
						value={ order }
						options={ selectOrder.map( ( { value, label } ) => ( {
							value: value,
							label: label,
						} ) ) }
						onChange={ ( newValue ) => { setAttributes( { order: newValue } ) } }
					/>
				</PanelBody>
			</InspectorControls>
	        <ServerSideRender
	            block="penci-gutenberg/featured-cat"
	            attributes={ props.attributes }
	        />
        </Fragment>
    );
}

registerBlockType( 'penci-gutenberg/featured-cat', {
	title: __( 'Penci: Featured Categories' ),
	icon: PenciIcon,
	category: 'penci-blocks',
	edit: edit,
	save: save,
} );
