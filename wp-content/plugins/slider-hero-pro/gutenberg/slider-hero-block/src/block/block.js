/**
 * BLOCK: my-block
 *
 * Registering a basic block with Gutenberg.
 * Simple block, renders and saves the same content without any interactivity.
 */

//  Import CSS.
import './style.scss';
import './editor.scss';

const { __ } = wp.i18n; // Import __() from wp.i18n
const { registerBlockType } = wp.blocks;
const { RichText } = wp.editor;
import { ServerSideRender } from '@wordpress/components';


function Qcld_Sliderhero_Shortcode_Preview( { shortcodeID } ) {
	if( shortcodeID > 0 ){
	    return(
			<div>
				 [qcld_hero id = {shortcodeID} ]
			</div>
	    )
	}else{
		return(
			''
	    )
	}
}


registerBlockType( 'qcld-slider-hero/qcld-slider-hero-shortcode-maker', {
    title: __( 'Slider-Hero' ),
    icon: 'slides',
    category: 'common',
    keywords: [
        __( 'slider hero shortcode maker' ),
        __( 'slider hero shortcode' )
    ],
    attributes: {
        shortcodeID: {
            type: 'string',
            default: 0
        }
    },
    edit: function( props ) {
        const { attributes: { shortcodeID }, setAttributes } = props;

 		jQuery(document).on('change', '.qcld_hero_shortcode_maker', function(e){
			const selected = event.target.querySelector( 'option:checked' );
            setAttributes( { shortcodeID: selected.value } );
	    });

        return (
            <div className={ props.className }>
                <ServerSideRender
					block="qcld-slider-hero/render-all-sliders"
				/>
            	<Qcld_Sliderhero_Shortcode_Preview shortcodeID = { shortcodeID } />
            </div>
        );
    },
    save: function( props ) {
        const { attributes: { shortcodeID } } = props;
        return (
            <div>
            	<Qcld_Sliderhero_Shortcode_Preview shortcodeID = { shortcodeID } />
            </div>
        );
    }
} );


