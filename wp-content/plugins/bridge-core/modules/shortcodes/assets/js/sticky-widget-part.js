(function($) {
	'use strict';
	
	var stickyWidget = {};
	qode.modules.stickyWidget = stickyWidget;
	
	stickyWidget.qodeInitStickyWidget = qodeInitStickyWidget;
	
	stickyWidget.qodeOnWindowLoad = qodeOnWindowLoad;
	stickyWidget.qodeOnWindowResize = qodeOnWindowResize;
	
	$(window).on('load',qodeOnWindowLoad);
	$(window).on('resize', qodeOnWindowResize);
	
	function qodeOnWindowLoad() {
		qodeInitStickyWidget();
	}
	
	function qodeOnWindowResize() {
		qodeInitStickyWidget();
	}
	
	function qodeInitStickyWidget() {
		var stickyWidgets = $('.qode-widget-sticky-sidebar');
		
		if ( stickyWidgets.length && $window_width > 1000 ) {
			
			var header = $('header.page_header');
			sticky_amount = getScrollAmountForStickyHeader();
			
			stickyWidgets.each(function(){
				var widget = $(this),
					parent =  '.full_section_inner, .section_inner, .two_columns_75_25, .two_columns_25_75, .two_columns_66_33, .two_columns_33_66, .elementor-row, .elementor-section',
					stickyHeight = 0,
					widgetOffset = widget.offset().top;
				
				
				if (widget.parent('aside.sidebar').length) {
					var sidebar = widget.parents('aside.sidebar');
				} else if (widget.parents('.wpb_widgetised_column').length) {
					var sidebar = widget.parents('.wpb_widgetised_column');
					widget.closest('.wpb_column').css('position','static');
				} else if(widget.parents('.elementor-widget.elementor-widget-sidebar').length) {
					var sidebar = widget.parents('.elementor-widget.elementor-widget-sidebar');
				}
				
				var sidebarOffset = sidebar.offset().top;
				if(sticky_amount < sidebarOffset && (header.hasClass('stick') || header.hasClass('stick_with_left_right_menu'))){
					stickyHeight = min_header_height_sticky;
				}else if(header.hasClass('fixed')){
					stickyHeight = min_header_height_scroll + content_menu_top_add;
				}else if(header.hasClass('fixed_top_header')){
					stickyHeight = header_top_height;
				}else if(header.hasClass('fixed_hiding')){
					stickyHeight = min_header_height_fixed_hidden + 40; //2*20 for logo margin
				}else if(qode_window < 1000 || $('.vertical_menu_enabled').length > 0){ //for mobile and verical header
					stickyHeight = 0;
				}else{
					stickyHeight = 0;
				}
				
				var offset = -(widgetOffset-sidebarOffset-stickyHeight-10); //10 is to push down from browser top edge
				
				sidebar.stick_in_parent({
					parent: parent,
					sticky_class : 'qode-sticky-sidebar',
					inner_scrolling : false,
					offset_top: offset
				}).on("sticky_kit:bottom", function() { //check if sticky sidebar have hit the bottom and use that class for pull it down when sticky header appears
					sidebar.addClass('qode-sticky-sidebar-on-bottom');
				}).on("sticky_kit:unbottom", function() {
					sidebar.removeClass('qode-sticky-sidebar-on-bottom');
				});
				
				$(window).scroll(function(){
					if ($window_width >= 1000) {
						if (sticky_amount > sidebarOffset && header.hasClass('sticky') && sidebar.hasClass('qode-sticky-sidebar') && !sidebar.hasClass('qode-sticky-sidebar-on-bottom')) {
							sidebar.css('-webkit-transform', 'translateY('+min_header_height_sticky+'px)');
							sidebar.css('transform', 'translateY('+min_header_height_sticky+'px)');
						} else {
							sidebar.css('-webkit-transform', 'translateY(0px)');
							sidebar.css('transform', 'translateY(0px)');
						}
					}
				});
				
			});
		}
	}
	
})(jQuery);