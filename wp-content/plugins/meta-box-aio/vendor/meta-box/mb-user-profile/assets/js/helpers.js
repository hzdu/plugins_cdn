const $ = jQuery;

const checkRecaptcha = ( { key, success, error } ) => {
	grecaptcha.ready( () => grecaptcha.execute( key, { action: 'mbup' } ).then( success ).catch( error ) );
};

// Save editor content for ajax submission.
function saveEditorContent() {
	var id = $( this ).attr( 'id' );

	$( document ).on( 'tinymce-editor-init', ( event, editor ) => {
		editor.on( 'input keyup', () => editor.save() );
	} );
}

$( function () {
	$( '.rwmb-wysiwyg' ).each( saveEditorContent );
} );

export { checkRecaptcha };
