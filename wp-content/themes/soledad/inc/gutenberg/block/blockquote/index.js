import {
	registerBlockType,
	__,
	InspectorControls,
	BlockControls,
	RichText,
	TextControl,
	ToggleControl,
	BlockAlignmentToolbar,
	ColorPalette,
	PanelColorSettings,
	IconButton,
	Dashicon,
	SelectControl,
	RangeControl,
	URLInput,
	ServerSideRender,
	PanelBody,
	ContrastChecker,
	omit,
	merge,
	Fragment,
	TextareaControl,
} from '../../wp-imports'

import { PenciIcon } from '../../icons'

export const save = ( props ) => { return null }

export const edit = ( props ) => {
	const { isSelected, className, setAttributes } = props;
	const { content,author,align } = props.attributes;

	const selectalign = [
		{ value: 'none', label: __( 'None' ) },
		{ value: 'left', label: __( 'Align Left' ) },
		{ value: 'center', label: __( 'Align Center' ) },
		{ value: 'right', label: __( 'Align Right' ) },
	];

	return (
		<Fragment>
			<InspectorControls>
				<PanelBody>
			       <TextControl
					label={ __( 'Quote Content' ) }
					value={ content }
					onChange={ ( newValue ) => setAttributes( { content: newValue } ) }
					/>
					<TextControl
				      	label={ __( 'Quote Author' ) }
				        value={ author }
				        onChange={ ( newValue ) => setAttributes( { author: newValue } ) }
				    />
					<SelectControl
						label={ __( 'Align' ) }
						value={ align }
						options={ selectalign.map( ( { value, label } ) => ( {
							value: value,
							label: label,
						} ) ) }
						onChange={ ( newValue ) => { setAttributes( { align: newValue } ) } }
					/>
				</PanelBody>
			</InspectorControls>
			 <ServerSideRender
	            block="penci-gutenberg/blockquote"
	            attributes={ props.attributes }
	        />
		</Fragment>
	)
}

registerBlockType( 'penci-gutenberg/blockquote', {
	title: __( 'Penci: Blockquote' ),
	description: __( 'Maybe someone else said it better -- add some quoted text.' ),
	icon: PenciIcon,
	category: 'penci-blocks',
	edit: edit,
	save: save,
} );
