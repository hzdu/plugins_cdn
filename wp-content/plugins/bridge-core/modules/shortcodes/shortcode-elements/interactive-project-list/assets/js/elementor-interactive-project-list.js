(function($) {
	'use strict';
	
	var elementorInteractiveProjectList = {};
	qode.modules.elementorInteractiveProjectList = elementorInteractiveProjectList;
	
	elementorInteractiveProjectList.qodeInitElementorInteractiveProjectList = qodeInitElementorInteractiveProjectList;
	
	
	elementorInteractiveProjectList.qodeOnWindowLoad = qodeOnWindowLoad;
	
	$(window).on('load', qodeOnWindowLoad);
	
	/*
	 ** All functions to be called on $(window).load() should be in this function
	 */
	function qodeOnWindowLoad() {
		qodeInitElementorInteractiveProjectList();
	}
	
	function qodeInitElementorInteractiveProjectList(){
		$j(window).on('elementor/frontend/init', function () {
			elementorFrontend.hooks.addAction( 'frontend/element_ready/bridge_interactive_project_list.default', function() {
				qode.modules.interactiveProjectList.qodeInitInteractiveProjectList();
				qode.modules.interactiveProjectList.qodeInitPortfolioInteractiveLinkShowcase();
			} );
		});
	}
	
})(jQuery);
