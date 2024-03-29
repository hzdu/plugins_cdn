(function($) {
	'use strict';
	
	var elementorPortfolioListStacked = {};
	qode.modules.elementorPortfolioListStacked = elementorPortfolioListStacked;
	
	elementorPortfolioListStacked.qodeInitElementorPortfolioListStacked = qodeInitElementorPortfolioListStacked;
	
	
	elementorPortfolioListStacked.qodeOnWindowLoad = qodeOnWindowLoad;
	
	$(window).on('load', qodeOnWindowLoad);
	
	/*
	 ** All functions to be called on $(window).load() should be in this function
	 */
	function qodeOnWindowLoad() {
		qodeInitElementorPortfolioListStacked();
	}
	
	function qodeInitElementorPortfolioListStacked(){
		$j(window).on('elementor/frontend/init', function () {
			elementorFrontend.hooks.addAction( 'frontend/element_ready/bridge_portfolio_list_stacked.default', function() {
				qode.modules.ptfListStacked.qodeInitPortfolioListStacked().init();
			} );
		});
	}
	
})(jQuery);
