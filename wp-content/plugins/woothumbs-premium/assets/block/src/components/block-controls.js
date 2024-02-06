
import { __ } from '@wordpress/i18n';
import { BlockControls } from '@wordpress/block-editor';
import { ToolbarGroup } from '@wordpress/components';

const EditorBlockControls = ( { isEditing, setAttributes } ) => {
	return (
		<BlockControls>
			<ToolbarGroup
				controls={ [
					{
						icon: 'edit',
						title: __(
							'Edit WooThumbs product',
							'iconic-woothumbs'
						),
						onClick: () => setAttributes( { 'isEditing': ! isEditing } ),
						isActive: isEditing,
					},
				] }
			/>
		</BlockControls>
	)
}

export default EditorBlockControls;
