import { __ } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/block-editor';
import { RangeControl, Panel, PanelBody, PanelRow } from '@wordpress/components';

const EditorInspectorControls = ( { galleryWidth, setAttributes } ) => {
	return (
		<InspectorControls key="iconic-woothumbs-block-editor-settings">
			<div id="iconic-woothumbs-block-editor-settings">
				<Panel>
					<PanelBody title={ __( 'Block Settings', 'iconic-woothumbs' ) }  initialOpen={ true }>
						<PanelRow>
							<RangeControl
								label={ __( 'Gallery Width (%)', 'iconic-woothumbs' ) }
								value={ galleryWidth }
								onChange={ ( val ) => { setAttributes( { 'galleryWidth': parseInt( val ) } ) } }
								min={ 20 }
								max={ 100 }
							/>
						</PanelRow>
					</PanelBody>
				</Panel>
			</div>
		</InspectorControls>
	)
}

export default EditorInspectorControls;
