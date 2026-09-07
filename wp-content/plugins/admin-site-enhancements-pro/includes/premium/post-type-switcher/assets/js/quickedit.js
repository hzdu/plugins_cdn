/* global inlineEditPost */
function asenha_pts_quick_edit() {

	var $ = jQuery;
	var _edit = inlineEditPost.edit;

	$( '#bulk-edit' )
		.find( '.inline-edit-col-right:first .inline-edit-col' )
		.append(
			$( '#bulk-edit #asenha_pts_bulk_edit' )
		);

	$( '.inline-edit-row' ).not( '#bulk-edit' )
		.find( '.inline-edit-col-right:first .inline-edit-col' )
		.append(
			$( '.inline-edit-row #asenha_pts_quick_edit' )
		);

	inlineEditPost.edit = function( id ) {

		var args = [].slice.call( arguments );

		_edit.apply( this, args );

		if ( typeof ( id ) === 'object' ) {
			id = this.getId( id );
		}

		var
			// edit_row is the quick-edit row, containing the inputs that need to be updated.
			edit_row = $( '#edit-' + id ),

			// post_row is the row shown when a post isn't being edited, which also holds the existing values.
			post_row = $( '#post-' + id ),

			// Get the existing values.
			post_type = $( 'td.post_type span', post_row ).data( 'post-type' );

		if ( ! post_type ) {
			// Fallback when helper cell content is unavailable in the table row markup.
			var post_row_classes = post_row.attr( 'class' ) || '';
			var post_type_match = post_row_classes.match( /\btype-([A-Za-z0-9_-]+)\b/ );
			post_type = post_type_match && post_type_match[1] ? post_type_match[1] : '';
		}

		// Set the values in the quick editor.
		if ( post_type ) {
			$( 'select[name=\"asenha_pts_post_type\"] option[value=\"' + post_type + '\"]', edit_row ).prop( 'selected', true );
		}
	};
}

// Another way of ensuring inlineEditPost.edit isn't patched until it's defined.
if ( inlineEditPost ) {
	asenha_pts_quick_edit();
} else {
	jQuery( asenha_pts_quick_edit );
}

