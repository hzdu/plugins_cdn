(function($) {
	'use strict';
	
	var interactiveProjectList = {};
	qode.modules.interactiveProjectList = interactiveProjectList;
	
	interactiveProjectList.qodeInitInteractiveProjectList = qodeInitPortfolioInteractiveItemShowcase;
	interactiveProjectList.qodeInitPortfolioInteractiveLinkShowcase = qodeInitPortfolioInteractiveLinkShowcase;
	
	
	interactiveProjectList.qodeOnDocumentReady = qodeOnDocumentReady;
	
	$(document).ready(qodeOnDocumentReady);
	
	/*
	 ** All functions to be called on $(window).load() should be in this function
	 */
	function qodeOnDocumentReady() {
		qodeInitPortfolioInteractiveItemShowcase();
		qodeInitPortfolioInteractiveLinkShowcase();
		qodeOutlineTextAnimation();
	}
	
	function qodeInitPortfolioInteractiveItemShowcase() {
		var projectList = $('.qode-interactive-project-list');
		
		if (projectList.length) {
			projectList.each(function () {
				var holder = $(this),
					item = holder.find('.qode-ipl-item'),
					backgroundImagesHolder = holder.find('.qode-ipl-right'),
					backgroundImages = backgroundImagesHolder.find('.qode-ipl-image'),
					indexCounterImg = 0,
					indexCounterItem = 0;
				
				backgroundImages.each(function() {
					$(this).attr('img-index', indexCounterImg);
					$(this).data('img-index', indexCounterImg);
					indexCounterImg++;
				});
				
				item.each(function() {
					$(this).attr('data-index', indexCounterItem);
					$(this).data('data-index', indexCounterItem);
					indexCounterItem++;
				});
				
				item.each(function () {
					var thisItem = $(this),
						thisTitle = thisItem.find('.qode-ipl-title:not(.qode-ipl-responsive-title)'),
						thisLink = thisItem.find('.qode-pli-link');
					
					thisItem.find(thisLink).appendTo(thisTitle);
				});
				
				item.on('mouseenter', function () {
					var currentIndex = $(this).data('data-index');
					backgroundImages.css('opacity', 0);
					backgroundImagesHolder.find('.qode-ipl-image[img-index="'+ currentIndex +'"]').css('opacity', 1);
				}).on('mouseleave', function () {
				});
			});
		}
	}
	
	function qodeInitPortfolioInteractiveLinkShowcase() {
		var interactiveLinkShowcase = $('.qode-interactive-project-list');
		
		if (interactiveLinkShowcase.length) {
			interactiveLinkShowcase.each(function () {
				var thisInteractiveLinkShowcase = $(this),
					singleImage = thisInteractiveLinkShowcase.find('.qode-ipl-right .qode-ipl-image'),
					singleLink = thisInteractiveLinkShowcase.find('.qode-ipl-left .qode-ipl-item');
				
				singleImage.eq(0).addClass('qode-active');
				singleLink.eq(0).addClass('qode-active');
				thisInteractiveLinkShowcase.find('.qode-ipl-left .qode-ipl-item[data-index="0"]').addClass('qode-active');
				
				singleLink.children().on('touchstart mouseenter', function () {
					var thisLink = $(this).parent(),
						index = parseInt(thisLink.data('index'), 10);
					
					singleImage.removeClass('qode-active').eq(index).addClass('qode-active');
					singleLink.removeClass('qode-active');
					thisInteractiveLinkShowcase.find('.qode-ipl-left .qode-ipl-item[data-index="' + index + '"]').addClass('qode-active');
				});
			});
		}
	}
	
	function qodeOutlineTextAnimation() {
		var interactiveShowcase = $('.qode-interactive-project-list');
		
		if (interactiveShowcase.length) {
			interactiveShowcase.each(function () {
				var thisShowcase = $(this);
				
				thisShowcase.find('.qode-ipl-item').each(function () {
					var thisItemTitle = $(this).find('.qode-ipl-title:not(.qode-ipl-responsive-title)');
					var thisItemText = thisItemTitle.text();
					thisItemTitle.attr('data-title', thisItemText);
				});
			});
		}
	}
	
})(jQuery);