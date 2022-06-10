( function() {
	var global = tinymce.util.Tools.resolve( 'tinymce.PluginManager' );

	global.add( 'hfcode', function( editor ) {
		editor.addCommand( 'hfFormatCode', function() {
			editor.execCommand( 'mceToggleFormat', false, 'pre' );
		} );

		editor.addButton( 'code', {
			icon: 'code',
			cmd: 'hfFormatCode',
		} );
	} );
} )();