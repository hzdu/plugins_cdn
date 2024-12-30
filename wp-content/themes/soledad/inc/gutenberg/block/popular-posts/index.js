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
	const { title,type,columns, category, number } = props.attributes;

	const selectType = [
		{ value: 'all', label: __( 'All Time' ) },
		{ value: 'week', label: __( 'Once Week' ) },
		{ value: 'month', label: __( 'Once Month' ) },
	];

	const selectcolumns = [
		{ value: '4', label: __( '4 Columns' ) },
		{ value: '3', label: __( '3 Columns' ) },
	];

	 return (
       <Fragment>
       <InspectorControls>
			<PanelBody title={ __( 'Popular Posts Settings' ) }>
				<TextControl
					label={ __( 'Heading Title' ) }
					value={ title }
					onChange={ ( newValue ) => setAttributes( { title: newValue } ) }
				/>
				<SelectControl
					label={ __( 'Display Popular Posts by?' ) }
					value={ type }
					options={ selectType.map( ( { value, label } ) => ( {
						value: value,
						label: label,
					} ) ) }
					onChange={ ( newValue ) => { setAttributes( { type: newValue } ) } }
				/>

				<SelectControl
					label={ __( 'Select Columns for Display' ) }
					value={ columns }
					options={ selectcolumns.map( ( { value, label } ) => ( {
						value: value,
						label: label,
					} ) ) }
					onChange={ ( newValue ) => { setAttributes( { columns: newValue } ) } }
				/>
				<TextControl
					label={ __( 'Filter Popular Posts by Category(s)' ) }
					value={ category }
					onChange={ ( newValue ) => setAttributes( { category: newValue } ) }
					help={ __( 'If you want to exclude any categories, fill the categories slug here. See here to know what is category slug. Example: cat-1, cat-2' ) }
				/>
				 <RangeControl
					label={ __( 'Number Posts To Display' ) }
					value={ number }
					onChange={ ( newValue ) => setAttributes( { number: newValue } ) }
					min={ MIN_NUMBER }
					max={ MAX_NUMBER }
				/>
			</PanelBody>
		</InspectorControls>
        <ServerSideRender
            block="penci-gutenberg/popular-posts"
            attributes={ props.attributes }
        />
        </Fragment>
    );
}

registerBlockType( 'penci-gutenberg/popular-posts', {
	title: __( 'Penci: Popular Posts' ),
	icon: PenciIcon,
	category: 'penci-blocks',
	edit: edit,
	save: save,
} );
