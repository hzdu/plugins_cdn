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
	const { heading,style,number,paging,morenum,exclude } = props.attributes;

	const selectStyle = [
		{ value: 'standard', label: __( 'Standard Posts' ) },
		{ value: 'classic', label: __( 'Classic Posts' ) },
		{ value: 'overlay', label: __( 'Overlay Posts' ) },
		{ value: 'grid', label: __( 'Grid Posts' ) },
		{ value: 'grid-2', label: __( 'Grid 2 Columns Posts' ) },
		{ value: 'masonry', label: __( 'Grid Masonry Posts' ) },
		{ value: 'masonry-2', label: __( 'Grid Masonry 2 Columns Posts' ) },
		{ value: 'list', label: __( 'List Posts' ) },
		{ value: 'boxed-1', label: __( 'Boxed Posts Style 1' ) },
		{ value: 'boxed-2', label: __( 'Boxed Posts Style 2' ) },
		{ value: 'mixed', label: __( 'Mixed Posts' ) },
		{ value: 'mixed-2', label: __( 'Mixed Posts Style 2' ) },
		{ value: 'photography', label: __( 'Photography Posts' ) },
		{ value: 'standard-grid', label: __( '1st Standard Then Grid' ) },
		{ value: 'standard-grid-2', label: __( '1st Standard Then Grid 2 Columns' ) },
		{ value: 'standard-list', label: __( '1st Standard Then List' ) },
		{ value: 'standard-boxed-1', label: __( '1st Standard Then Boxed' ) },
		{ value: 'classic-grid', label: __( '1st Classic Then Grid' ) },
		{ value: 'classic-grid-2', label: __( '1st Classic Then Grid 2 Columns' ) },
		{ value: 'classic-list', label: __( '1st Classic Then List' ) },
		{ value: 'classic-boxed-1', label: __( '1st Classic Then Boxed' ) },
		{ value: 'overlay-grid', label: __( '1st Overlay Then Grid' ) },
		{ value: 'overlay-list', label: __( '1st Overlay Then List' ) },
	];

	const selectPag = [
		{ value: 'numbers', label: __( 'Page Navigation Numbers' ) },
		{ value: 'loadmore', label: __( 'Load More Posts' ) },
		{ value: 'scroll', label: __( 'Infinite Scroll' ) },
	];

	 return (
       <Fragment>
       <InspectorControls>
			<PanelBody title={ __( 'Latest Posts Settings' ) }>
				<TextControl
					label={ __( 'Heading Title for Latest Posts' ) }
					value={ heading }
					onChange={ ( newValue ) => setAttributes( { heading: newValue } ) }
				/>

				<SelectControl
					label={ __( 'Latest Posts Layout' ) }
					value={ style }
					options={ selectStyle.map( ( { value, label } ) => ( {
						value: value,
						label: label,
					} ) ) }
					onChange={ ( newValue ) => { setAttributes( { style: newValue } ) } }
				/>
				 <RangeControl
					label={ __( 'Number Posts Per Page' ) }
					value={ number }
					onChange={ ( newValue ) => setAttributes( { number: newValue } ) }
					min={ MIN_NUMBER }
					max={ MAX_NUMBER }
				/>
				<SelectControl
					label={ __( 'Page Navigation Style' ) }
					value={ paging }
					options={ selectPag.map( ( { value, label } ) => ( {
						value: value,
						label: label,
					} ) ) }
					onChange={ ( newValue ) => { setAttributes( { paging: newValue } ) } }
				/>
				 <RangeControl
					label={ __( 'Custom Number Posts for Each Time Load More Posts' ) }
					value={ morenum }
					onChange={ ( newValue ) => setAttributes( { morenum: newValue } ) }
					min={ MIN_NUMBER }
					max={ MAX_NUMBER }
				/>

				<TextControl
			      	label={ __( 'Exclude Categories' ) }
			        value={ exclude }
			        onChange={ ( newValue ) => setAttributes( { exclude: newValue } ) }
			    />
			</PanelBody>
		</InspectorControls>
        <ServerSideRender
            block="penci-gutenberg/latest-posts"
            attributes={ props.attributes }
        />
        </Fragment>
    );
}

registerBlockType( 'penci-gutenberg/latest-posts', {
	title: __( 'Penci: Latest Posts' ),
	icon: PenciIcon,
	category: 'penci-blocks',
	edit: edit,
	save: save,
} );
