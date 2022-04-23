( function( $ ) {

	'use strict';

	var UltimatePostKitEditor = {

		init: function() {
			elementor.channels.editor.on( 'section:activated', UltimatePostKitEditor.onAnimatedBoxSectionActivated );

			window.elementor.on( 'preview:loaded', function() {
				elementor.$preview[0].contentWindow.UltimatePostKitEditor = UltimatePostKitEditor;
				UltimatePostKitEditor.onPreviewLoaded();
			});
		},



		onPreviewLoaded: function() {
			var elementorFrontend = $('#elementor-preview-iframe')[0].contentWindow.elementorFrontend;

			elementorFrontend.hooks.addAction( 'frontend/element_ready/widget', function( $scope ) {
				$scope.find( '.upk-elementor-template-edit-link' ).on( 'click', function( event ) {
					window.open( $( this ).attr( 'href' ) );
				});
			});
		}
	};

	$( window ).on( 'elementor:init', UltimatePostKitEditor.init );

	window.UltimatePostKitEditor = UltimatePostKitEditor;

}( jQuery ) );
