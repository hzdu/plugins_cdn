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
	const { style,columns,size, new_tab, margin_top, margin_bottom, 
		box_1_img,box_1_text,box_1_url,
		box_2_img,box_2_text,box_2_url,
		box_3_img,box_3_text,box_3_url,
		box_4_img,box_4_text,box_4_url,
		box_5_img,box_5_text,box_5_url,
		box_6_img,box_6_text,box_6_url,
		box_7_img,box_7_text,box_7_url,
		box_8_img,box_8_text,box_8_url, } = props.attributes;

	const selectStyle = [
		{ value: 'boxes-style-1', label: __( 'Style 1' ) },
		{ value: 'boxes-style-2', label: __( 'Style 2' ) },
		{ value: 'boxes-style-3', label: __( 'Style 3' ) },
	];

	const selectColumns = [
		{ value: 'boxes-3-columns', label: __( '3 Columns' ) },
		{ value: 'boxes-4-columns', label: __( '4 Columns' ) },
	];

	const selectSize = [
		{ value: 'horizontal', label: __( 'Horizontal Size' ) },
		{ value: 'square', label: __( 'Square Size' ) },
		{ value: 'vertical', label: __( 'Vertical Size' ) },
	];

	const selectnew_tab = [
		{ value: 'yes', label: __( 'Yes' ) },
		{ value: 'no', label: __( 'No' ) },
	];

	 return (
       <Fragment>
	       <InspectorControls>
				<PanelBody title={ __( 'Featured Box Settings' ) }>
					<SelectControl
						label={ __( 'Featured Boxes Style' ) }
						value={ style }
						options={ selectStyle.map( ( { value, label } ) => ( {
							value: value,
							label: label,
						} ) ) }
						onChange={ ( newValue ) => { setAttributes( { style: newValue } ) } }
					/>
					<SelectControl
						label={ __( 'Featured Boxes Columns' ) }
						value={ columns }
						options={ selectColumns.map( ( { value, label } ) => ( {
							value: value,
							label: label,
						} ) ) }
						onChange={ ( newValue ) => { setAttributes( { columns: newValue } ) } }
					/>
					<SelectControl
						label={ __( 'Featured Boxes Size Type' ) }
						value={ size }
						options={ selectSize.map( ( { value, label } ) => ( {
							value: value,
							label: label,
						} ) ) }
						onChange={ ( newValue ) => { setAttributes( { size: newValue } ) } }
					/>
					<SelectControl
						label={ __( 'Open in New Tab?' ) }
						value={ new_tab }
						options={ selectnew_tab.map( ( { value, label } ) => ( {
							value: value,
							label: label,
						} ) ) }
						onChange={ ( newValue ) => { setAttributes( { new_tab: newValue } ) } }
					/>
				    <RangeControl
						label={ __( 'Custom Margin Top ( Unit is Pixel )' ) }
						value={ margin_top }
						onChange={ ( newValue ) => setAttributes( { margin_top: newValue } ) }
						min={ MIN_NUMBER }
						max={ MAX_NUMBER }
					/>
					<RangeControl
						label={ __( 'Custom Margin Bottom ( Unit is Pixel )' ) }
						value={ margin_bottom }
						onChange={ ( newValue ) => setAttributes( { margin_bottom: newValue } ) }
						min={ MIN_NUMBER }
						max={ MAX_NUMBER }
					/>
				</PanelBody>
				<PanelBody title={ __( 'Featured Box 1' ) }>
					<TextControl
						label={ __( 'Featured Box 1st Image' ) }
						value={ box_1_img }
						onChange={ ( newValue ) => setAttributes( { box_1_img: newValue } ) }
						help={ __( 'You just need choose image for this option with the width is 500px' ) }
					/>
					<TextControl
						label={ __( 'Featured Box 1st Text' ) }
						value={ box_1_text }
						onChange={ ( newValue ) => setAttributes( { box_1_text: newValue } ) }
					/>
					<TextControl
						label={ __( 'Featured Box 1st URL' ) }
						value={ box_1_url }
						onChange={ ( newValue ) => setAttributes( { box_1_url: newValue } ) }
					/>

					<TextControl
						label={ __( 'Featured Box 2nd Image' ) }
						value={ box_2_img }
						onChange={ ( newValue ) => setAttributes( { box_2_img: newValue } ) }
						help={ __( 'You just need choose image for this option with the width is 500px' ) }
					/>
					<TextControl
						label={ __( 'Featured Box 2nd Text' ) }
						value={ box_2_text }
						onChange={ ( newValue ) => setAttributes( { box_2_text: newValue } ) }
					/>
					<TextControl
						label={ __( 'Featured Box 2nd URL' ) }
						value={ box_2_url }
						onChange={ ( newValue ) => setAttributes( { box_2_url: newValue } ) }
					/>

					<TextControl
						label={ __( 'Featured Box 3rd Image' ) }
						value={ box_3_img }
						onChange={ ( newValue ) => setAttributes( { box_3_img: newValue } ) }
						help={ __( 'You just need choose image for this option with the width is 500px' ) }
					/>
					<TextControl
						label={ __( 'Featured Box 3rd Text' ) }
						value={ box_3_text }
						onChange={ ( newValue ) => setAttributes( { box_3_text: newValue } ) }
					/>
					<TextControl
						label={ __( 'Featured Box 3rd URL' ) }
						value={ box_3_url }
						onChange={ ( newValue ) => setAttributes( { box_3_url: newValue } ) }
					/>

					<TextControl
						label={ __( 'Featured Box 4th Image' ) }
						value={ box_4_img }
						onChange={ ( newValue ) => setAttributes( { box_4_img: newValue } ) }
						help={ __( 'You just need choose image for this option with the width is 500px' ) }
					/>
					<TextControl
						label={ __( 'Featured Box 4th Text' ) }
						value={ box_4_text }
						onChange={ ( newValue ) => setAttributes( { box_4_text: newValue } ) }
					/>
					<TextControl
						label={ __( 'Featured Box 4th URL' ) }
						value={ box_4_url }
						onChange={ ( newValue ) => setAttributes( { box_4_url: newValue } ) }
					/>

					<TextControl
						label={ __( 'Featured Box 5th Image' ) }
						value={ box_5_img }
						onChange={ ( newValue ) => setAttributes( { box_5_img: newValue } ) }
						help={ __( 'You just need choose image for this option with the width is 500px' ) }
					/>
					<TextControl
						label={ __( 'Featured Box 5th Text' ) }
						value={ box_5_text }
						onChange={ ( newValue ) => setAttributes( { box_5_text: newValue } ) }
					/>
					<TextControl
						label={ __( 'Featured Box 5th URL' ) }
						value={ box_5_url }
						onChange={ ( newValue ) => setAttributes( { box_5_url: newValue } ) }
					/>

					<TextControl
						label={ __( 'Featured Box 6th Image' ) }
						value={ box_6_img }
						onChange={ ( newValue ) => setAttributes( { box_6_img: newValue } ) }
						help={ __( 'You just need choose image for this option with the width is 600px' ) }
					/>
					<TextControl
						label={ __( 'Featured Box 6th Text' ) }
						value={ box_6_text }
						onChange={ ( newValue ) => setAttributes( { box_6_text: newValue } ) }
					/>
					<TextControl
						label={ __( 'Featured Box 6th URL' ) }
						value={ box_6_url }
						onChange={ ( newValue ) => setAttributes( { box_6_url: newValue } ) }
					/>

					<TextControl
						label={ __( 'Featured Box 7th Image' ) }
						value={ box_7_img }
						onChange={ ( newValue ) => setAttributes( { box_7_img: newValue } ) }
						help={ __( 'You just need choose image for this option with the width is 700px' ) }
					/>
					<TextControl
						label={ __( 'Featured Box 7th Text' ) }
						value={ box_7_text }
						onChange={ ( newValue ) => setAttributes( { box_7_text: newValue } ) }
					/>
					<TextControl
						label={ __( 'Featured Box 7th URL' ) }
						value={ box_7_url }
						onChange={ ( newValue ) => setAttributes( { box_7_url: newValue } ) }
					/>

					<TextControl
						label={ __( 'Featured Box 8th Image' ) }
						value={ box_8_img }
						onChange={ ( newValue ) => setAttributes( { box_8_img: newValue } ) }
						help={ __( 'You just need choose image for this option with the width is 800px' ) }
					/>
					<TextControl
						label={ __( 'Featured Box 8th Text' ) }
						value={ box_8_text }
						onChange={ ( newValue ) => setAttributes( { box_8_text: newValue } ) }
					/>
					<TextControl
						label={ __( 'Featured Box 8th URL' ) }
						value={ box_8_url }
						onChange={ ( newValue ) => setAttributes( { box_8_url: newValue } ) }
					/>
				</PanelBody>
			</InspectorControls>
	        <ServerSideRender
	            block="penci-gutenberg/featured-boxes"
	            attributes={ props.attributes }
	        />
        </Fragment>
    );
}

registerBlockType( 'penci-gutenberg/featured-boxes', {
	title: __( 'Penci: Featured boxes' ),
	icon: PenciIcon,
	category: 'penci-blocks',
	edit: edit,
	save: save,
} );
