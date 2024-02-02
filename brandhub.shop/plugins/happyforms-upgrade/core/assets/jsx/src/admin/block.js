import { Placeholder, SelectControl, PanelBody, Icon, Button, Notice } from '@wordpress/components';
import ServerSideRender from '@wordpress/server-side-render';
import { InspectorControls } from '@wordpress/block-editor';
import { registerBlockType, createBlock } from '@wordpress/blocks';
import { useState } from '@wordpress/element';
import { __, sprintf } from '@wordpress/i18n';

( function( settings ) {

	var blockID = 'thethemefoundry/happyforms';
	var options = settings.forms
		.map( function( form ) {
			return { label: form.post_title, value: form.ID };
		} )
	options.unshift( { label: __( 'Choose', 'happyforms' ), value: '' } );

	var ComponentPlaceholder = function( props ) {
		const [ form, setForm ] = useState( '' );
		
		return (
			<Placeholder
				icon={ <Icon icon={ settings.block.icon } style={{ marginRight: "14.66px" }} /> }
				label={ settings.block.title }
				instructions={ [
					( props.attributes.id && ! props.attributes.exists ) && (
						<Notice status="warning" isDismissible={ false }>
							{ __( 'The form previously added has been trashed or deleted.', 'happyforms' ) }
						</Notice>
					),
					settings.forms.length > 0 ?
					__( 'Pick a form to display on your site.', 'happyforms' ) :
					__( 'No forms found.', 'happyforms' )
				] }
				className="happyforms-block-form-selector-wrap"
				key="happyforms-component-placeholder">

				{
					settings.forms.length > 0 &&
					<div className="happyforms-block-placeholder__control-group">
						<SelectControl value={ form } options={ options } onChange={ ( v ) => setForm( v ) } />
						<Button isPrimary="true" onClick={ ( v ) => props.setAttributes( { id: form } ) }>{ __( 'Insert', 'happyforms' ) }</Button>
					</div>
				}

			</Placeholder>
		);
	};

	var ComponentForm = function( props ) {
		return [
			<ServerSideRender
				block={ blockID }
				attributes={ props.attributes }
				key="happyforms-component-form" />
		];
	};

	var ComponentInspector = function( props ) {
		return (
			<InspectorControls key="happyforms-inspector-controls">
				<PanelBody title={ __( 'Settings', 'happyforms' ) }>
					<SelectControl
						label={ __( 'Pick a form', 'happyforms' ) }
						value={ props.attributes.id }
						options={ options }
						onChange={ ( v ) => props.setAttributes( { id : v } ) } />
				</PanelBody>
			</InspectorControls>
		);
	};

	registerBlockType( blockID, {
		title: settings.block.title,
		description: settings.block.description,
		category: settings.block.category,
		icon: settings.block.icon,
		keywords: settings.block.keywords,
		supports: {
			anchor: true,
			html: false
		},

		transforms: {
			from: [ {
				type: 'block',
				blocks: [ 'core/legacy-widget' ],

				isMatch: ( { idBase, instance } ) => {
					if ( ! instance?.raw ) {
						return false;
					}
					
					return idBase === 'happyforms_widget';
				},
				
				transform: ( { instance } ) => {
					return createBlock( blockID, {
						id: instance.raw.form_id,
					} );
				},
			} ],
		},

		edit: function( props ) {
			if ( ! props.attributes.id && settings.forms.length === 1 ) {
				props.attributes.id = String( settings.forms[0].ID );
			}

			props.attributes.exists = settings.forms.find( form => form.ID == props.attributes.id );

			let blockComponent = (
				props.attributes.id && props.attributes.exists ?
				ComponentForm( props ) :
				ComponentPlaceholder( props )
			);

			let inspectorComponent = (
				settings.forms.length > 1 ?
				ComponentInspector( props ) :
				false
			);

			let component = (
				inspectorComponent ?
				[ blockComponent, inspectorComponent ] :
				[ blockComponent ]
			);

			return component;
		},

		save: function() {
			return null;
		},
	} );

} )(
	_happyFormsBlockSettings,
);
