import { registerBlockType } from '@wordpress/blocks';
import edit from './edit';
import metadata from './block.json';
import iconCube from './components/icon-cube';

// The save method is ommitted here to make the block dynamic;
// see the `block_render` method  in `inc/class-block.php` for the output.
registerBlockType( metadata.name, {
	icon: iconCube,
	attributes: {
        selectedProduct: { type: 'string', default: '' },
        searchTerm: { type: 'string', default: '' },
		galleryWidth: { type: 'integer', default: 100 },
		isEditing: { type: 'boolean', default: false }
    },
	edit
} );
