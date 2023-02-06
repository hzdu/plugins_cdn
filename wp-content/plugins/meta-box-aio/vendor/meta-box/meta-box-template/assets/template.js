jQuery( function( $ ) {
	const settings = $.extend( true, {}, wp.codeEditor.defaultSettings, {
		codemirror: {
			mode: 'text/x-yaml',
			indentUnit: 2,
			tabSize: 2,
			indentWithTabs: false,
		}
	} );
	const editor = wp.codeEditor.initialize( 'meta-box-template', settings ).codemirror;
	editor.focus();
} );
