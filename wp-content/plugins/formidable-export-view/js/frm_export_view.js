/*global jQuery:false */

var frmExportView;

function frmExportViewJS() {
	return {
		init: function () {
			this.showOrHideViewExportSettings();
			jQuery( document ).on( 'change', 'input[name="show_count"], #before_content', frmExportView.showOrHideViewExportSettings );
		},
		showOrHideViewExportSettings: function () {
			var exportViewSettings = jQuery( '#frm_export_view' );
			var viewExportPossible = jQuery( '#frm_view_export_possible' );

			if ( frmExportView.isViewExportPossible() ) {
				exportViewSettings.fadeIn();
				viewExportPossible.val( 1 );
			} else {
				exportViewSettings.fadeOut();
				viewExportPossible.val( 0 );
			}
		},
		isViewExportPossible: function () {
			return frmExportView.isListView() && frmExportView.hasTableInBeforeContent();
		},
		isListView: function () {
			var showCount = jQuery( 'input[name="show_count"]:checked' );
			if ( showCount ) {
				var viewType = showCount.val();
				if ( viewType === 'all' || viewType === 'dynamic' ) {
					return true;
				}
			}
			return false;
		},
		hasTableInBeforeContent: function() {
			var beforeContent = jQuery( '#before_content' );
			var beforeContentText = beforeContent.val();
			var tableRegex = new RegExp( '<table' );
			if ( ! tableRegex.test( beforeContentText ) ) {
				return false;
			}
			var closingTableRegex = new RegExp( '<\/table>' );
			if ( closingTableRegex.test( beforeContentText ) ) {
				return false;
			}

			return true;
		},
	};
}

frmExportView = frmExportViewJS();

( function ( $ ) {
	$( function () {
		frmExportView.init();
	} );
} )( jQuery );
