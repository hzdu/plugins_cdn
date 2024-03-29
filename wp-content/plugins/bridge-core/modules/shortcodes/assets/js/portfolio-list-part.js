(function($) {
	'use strict';
	
	var portfolioList = {};
	qode.modules.portfolioList = portfolioList;
	
	portfolioList.initPortfolio = initPortfolio;
	portfolioList.initPortfolioZIndex = initPortfolioZIndex;
	portfolioList.initPortfolioJustifiedGallery = initPortfolioJustifiedGallery;
	portfolioList.initPortfolioMasonry = initPortfolioMasonry;
	portfolioList.initPortfolioMasonryFilter = initPortfolioMasonryFilter;
	portfolioList.loadMore = loadMore;
	portfolioList.qodeInitElementorPortfolioList = qodeInitElementorPortfolioList;
	
	portfolioList.qodeOnDocumentReady = qodeOnDocumentReady;
	portfolioList.qodeOnWindowLoad = qodeOnWindowLoad;
	portfolioList.qodeOnWindowResize = qodeOnWindowResize;
	
	$(document).ready(qodeOnDocumentReady);
	$(window).on('load', qodeOnWindowLoad);
	$(window).on('resize', qodeOnWindowResize);
	
	function qodeOnDocumentReady() {
		initPortfolio();
		initPortfolioZIndex();
		initPortfolioJustifiedGallery();
		initPortfolioMasonry();
		initPortfolioMasonryFilter();
		loadMore();
	}
	
	function qodeOnWindowLoad() {
		qodeInitElementorPortfolioList();
	}
	
	function qodeOnWindowResize() {
		initPortfolioMasonry();
	}
	
	function initPortfolio(){
		"use strict";
		
		if($('.projects_holder_outer:not(.masonry_with_space, .justified_gallery)').length){
			$('.projects_holder_outer').each(function(){
				
				var currentPortfolio = $(this).find('.projects_holder');
				
				if(getIEversion() == 9 || getIEversion() == 10){
					currentPortfolio.addClass('ie-specific-styles');
				}
				
				$('.filter_holder .filter').on('click',function(){
					var $this = $(this).text();
					var activeFilter = $(this).data('filter');
					
					if(currentPortfolio.children('article').length) {
						currentPortfolio.children('article').each(function(){
							var thisArtcile = $(this);
							
							if(thisArtcile.hasClass(activeFilter) && activeFilter !== 'all') {
								thisArtcile.find('a.lightbox').attr('rel','prettyPhoto[pretty_photo_gallery_'+$this.toLowerCase()+']');
								thisArtcile.find('a.lightbox').attr('data-rel','prettyPhoto[pretty_photo_gallery_'+$this.toLowerCase()+']');
							} else if(activeFilter === 'all') {
								thisArtcile.find('a.lightbox').attr('rel','prettyPhoto[pretty_photo_gallery]');
								thisArtcile.find('a.lightbox').attr('data-rel','prettyPhoto[pretty_photo_gallery]');
							}
						});
					}
					
					var dropLabels = $('.filter_holder').find('.label span');
					dropLabels.each(function(){
						$(this).text($this);
					});
				});
				
				if(currentPortfolio.hasClass('v1')){
					var timeArray= new Array(1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25);
				}else if(currentPortfolio.hasClass('v2')){
					var timeArray= new Array(1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13,14,14,15,15,16,16,17,17,18,18,19,19,20,20);
				}else if(currentPortfolio.hasClass('v3')){
					var timeArray= new Array(1,2,3,2,3,4,3,4,5,4,5,6,5,6,7,6,7,8,7,8,9,8,9,10,9,10,11,10,11,12,11,12,13,12,13,14,13,14,15,14,15,16,15,16,17,16,17,18,17,18,19,18,19,20,19,20,21,20,21,22);
				}else if(currentPortfolio.hasClass('v4')){
					var timeArray= new Array(1,2,3,4,2,3,4,5,3,4,5,6,4,5,6,7,5,6,7,8,6,7,8,9,7,8,9,10,8,9,10,11,9,10,11,12,10,11,12,13,11,12,13,14,12,13,14,15,13,14,15,16,14,15,16,17,15,16,17,18,16,17,18,19,17,18,19,20,18,19,20,21);
				}else if(currentPortfolio.hasClass('v5')){
					var timeArray= new Array(1,2,3,4,5,2,3,4,5,6,3,4,5,6,7,4,5,6,7,8,5,6,7,8,9,6,7,8,9,10,7,8,9,10,11,8,9,10,11,12,9,10,11,12,13,10,11,12,13,14,11,12,13,14,15,12,13,14,15,16,13,14,15,16,17,14,15,16,17,18,15,16,17,18,19,20,16,17,18,19,20,17,18,19,20,21,18,19,20,21,22,19,20,21,22,23);
				}else if(currentPortfolio.hasClass('v6')){
					var timeArray= new Array(1,2,3,4,5,6,2,3,4,5,6,7,3,4,5,6,7,8,4,5,6,7,8,9,5,6,7,8,9,10,6,7,8,9,10,11,7,8,9,10,11,12,8,9,10,11,12,13,9,10,11,12,13,14,10,11,12,13,14,15,11,12,13,14,15,16,12,13,14,15,16,17,13,14,15,16,17,18,14,15,16,17,18,19,15,16,17,18,19,20,16,17,18,19,20,21,17,18,19,20,21,22);
				}
				
				var filterOnLoad;
				if(window.location.hash && (window.location.hash).indexOf("portfolio_category") == 1) {
					filterOnLoad = (window.location.hash).replace('#','');
				} else {
					filterOnLoad = 'all';
				}
				qodeInitPortFilterCounter($(this));
				currentPortfolio.mixitup({
					showOnLoad: filterOnLoad,
					transitionSpeed: 600,
					minHeight: 150,
					onMixLoad: function(){
						$('.projects_holder').addClass('hideItems');
						$('.projects_holder article').css('visibility','visible');
						
						if(currentPortfolio.hasClass('portfolio_one_by_one')) {
							currentPortfolio.find('article').each(function(l) {
								var currentPortfolioItem = $(this);
								if($('.vertical_split_slider').length){
									var acc = 0;
								}else{
									var acc = -150;
								}
								currentPortfolioItem.appear(function(){
									setTimeout(function() {
										currentPortfolioItem.addClass('show');
									}, 100*l);
								},{accX: 0, accY: -150});
							});
						}
						
						if(currentPortfolio.hasClass('slide_from_left')) {
							currentPortfolio.find('article').each(function(i) {
								var currentPortfolioItem = $(this);
								
								currentPortfolioItem.appear(function(){
									setTimeout(function() {
										currentPortfolioItem.addClass('show');
									}, (Math.random() * 200));
								},{accX: 0, accY: -150});
							});
						}
						
						if(currentPortfolio.hasClass('slide_from_top')) {
							currentPortfolio.find('article').each(function(i) {
								var currentPortfolioItem = $(this);
								currentPortfolioItem.appear(function(){
									setTimeout(function() {
										currentPortfolioItem.addClass('show');
									}, timeArray[i]*50);
								},{accX: 0, accY: -150});
							});
						}
						
						if(currentPortfolio.hasClass('diagonal_fade')) {
							currentPortfolio.find('article').each(function(i) {
								var currentPortfolioItem = $(this);
								currentPortfolioItem.appear(function(){
									setTimeout(function() {
										currentPortfolioItem.addClass('show');
									}, timeArray[i]*50);
								},{accX: 0, accY: -150});
							});
						}
						initParallax();
					},
					onMixEnd: function(){
						initParallax();
					}
				});
			});
		}
	}
	
	function initPortfolioZIndex(){
		"use strict";
		
		if($('.projects_holder_outer.portfolio_no_space').length){
			$('.no_space.hover_text article').each(function(i){
				$(this).css('z-index', i +10);
			});
		}
	}
	
	function initPortfolioJustifiedGallery() {
		"use strict";
		
		var project_holder = $('.projects_holder_outer.justified_gallery');
		project_holder.each(function() {
			var filter_holder = $(this).find('.filter_holder');
			
			filter_holder.find('li.filter').first().addClass('current');
			
			filter_holder.find('.filter').on('click',function(){
				var $this = $(this).text();
				var dropLabels = filter_holder.find('.label span');
				dropLabels.each(function(){
					$(this).text($this);
				});
				
				var selector = $(this).attr('data-filter');
				var articles = the_gallery.find('article');
				var transition_duration = 500;
				articles.css('transition','all '+transition_duration+'ms ease');
				articles.not(selector).css({
					'transform': 'scale(0)'
				});
				setTimeout(function() {
					articles.filter(selector).css({
						'transform': ''
					});
					the_gallery.css('transition','height '+transition_duration+'ms ease').justifiedGallery({selector: '>article'+(selector != '*' ? selector : '')});
				}, 1.1*transition_duration);
				setTimeout(function() {
					articles.css('transition','');
					the_gallery.css('transition','');
				}, 2.2*transition_duration);
				
				$(".filter").removeClass("current active");
				$(this).addClass("current active");
				
				return false;
			});
			
			qodeInitPortFilterCounter(project_holder);
			var the_gallery = $(this).find('.projects_holder');
			var row_height = typeof the_gallery.data('row-height') !== 'undefined' ? the_gallery.data('row-height') : 200,
				spacing = typeof the_gallery.data('spacing') !== 'undefined' ? the_gallery.data('spacing') : 0,
				last_row = typeof the_gallery.data('last-row') !== 'undefined' ? the_gallery.data('last-row') : 'nojustify',
				justify_threshold = typeof the_gallery.data('justify-threshold') !== 'undefined' ? the_gallery.data('justify-threshold') : 0.75;
			the_gallery
				.justifiedGallery({
					captions: false,
					rowHeight: row_height,
					margins: spacing,
					border: 0,
					lastRow: last_row,
					justifyThreshold: justify_threshold,
					selector: '> article'
				})
				.on('jg.complete jg.rowflush', function() {
					$(this).find('article').addClass('show').each(function() {
						$(this).height(Math.round($(this).height()));
					});
				});
		});
	}
	
	function initPortfolioMasonry(){
		"use strict";
		
		var portList = $('.projects_masonry_holder, .masonry_with_space .projects_holder');
		if(portList.length) {
			portList.each(function() {
				var thisPortList = $(this);
				var size = thisPortList.find('.qode-portfolio-masonry-gallery-grid-sizer').width();
				
				if(portList.hasClass('projects_masonry_holder')) {
					resizeMasonry(size,thisPortList);
				}
				qodeInitMasonry(thisPortList);
				qodeInitPortFilterCounter(portList.parent());
				$(window).resize(function(){
					setPortfolioMasZIndex();
					if(portList.hasClass('projects_masonry_holder')) {
						resizeMasonry(size, thisPortList);
					}
					qodeInitMasonry(thisPortList);
				});
			});
		}
	}
	
	function initPortfolioMasonryFilter(){
		"use strict";
		
		var masonry_holder = $('.projects_masonry_holder, .masonry_with_space .projects_holder');
		if (masonry_holder.length) {
			var portfolioIsotopeAnimation = null;
			$('.filter:first').addClass('current');
			$('.filter').on('click', function(){
				
				clearTimeout(portfolioIsotopeAnimation);
				$('.isotope, .isotope .isotope-item').css('transition-duration','0.8s');
				portfolioIsotopeAnimation = setTimeout(function(){  $('.isotope, .isotope .isotope-item').css('transition-duration','0s'); },700);
				
				var selector = $(this).attr('data-filter');
				masonry_holder.isotope({ filter: selector });
				
				$(".filter").removeClass("current");
				$(this).addClass("current");
				
				var $filterText = $(this).text();
				if(selector !== '*') {
					selector = selector.substring(1); // because first character is dot
				}
				
				if(masonry_holder.children('article').length) {
					masonry_holder.children('article').each(function(){
						var thisArtcile = $(this);
						
						if(thisArtcile.hasClass(selector) && selector !== '*') {
							thisArtcile.find('a.lightbox').attr('rel','prettyPhoto[pretty_photo_gallery_'+$filterText.toLowerCase()+']');
							thisArtcile.find('a.lightbox').attr('data-rel','prettyPhoto[pretty_photo_gallery_'+$filterText.toLowerCase()+']');
						} else if(selector === '*') {
							thisArtcile.find('a.lightbox').attr('rel','prettyPhoto[pretty_photo_gallery]');
							thisArtcile.find('a.lightbox').attr('data-rel','prettyPhoto[pretty_photo_gallery]');
						}
					});
				}
				
				setTimeout(setPortfolioMasZIndex(),700);
				
				return false;
			});
		}
	}
	
	function qodeInitMasonry(container){
		container.waitForImages(function() {
			container.animate({opacity:1});
			container.isotope({
				itemSelector: '.portfolio_masonry_item, .masonry_with_space .mix',
				masonry: {
					columnWidth: '.qode-portfolio-masonry-gallery-grid-sizer'
				}
			});
			if(container.hasClass('portfolio_one_by_one')) {
				container.find('article').each(function(l) {
					var $this = $(this);
					setTimeout(function() {
						$this.addClass('show');
					}, 100*l);
				});
			}
			
			if(container.hasClass('portfolio_fade_from_bottom')) {
				container.find('article').each(function(l) {
					var $this = $(this);
					$(this).css({
						'opacity': '0',
						'transform':'translateY(150px)'
					});
					$(this).appear(function() {
						setTimeout(function() {
							$this.css({'opacity':'1','transition':'all .8s ease','transform':'translateY(0)'});
						}, 100);
					},{accX: 0, accY: -150});
				});
			}
		});
	}
	
	function resizeMasonry(size, container){
		var $window = jQuery(window);
		
		if(container.hasClass('portfolio_masonry_gallery_with_space')) {
			var defaultMasonryItem = container.find('.portfolio_masonry_item.default');
			var largeWidthMasonryItem = container.find('.large_width');
			var largeHeightMasonryItem = container.find('.large_height');
			var largeWidthHeightMasonryItem = container.find('.large_width_height');
			
			defaultMasonryItem.css('height', size);
			largeHeightMasonryItem.css('height', Math.round(2*size));
			
			if($window.innerWidth() > 480){
				largeWidthHeightMasonryItem.css('height', Math.round(2*size));
				largeWidthMasonryItem.css('height', size);
			}else{
				largeWidthHeightMasonryItem.css('height', size);
				
			}
		} else {
			var largeItemHeight;
			if(container.find('article[class*="default"]:first img').height()){
				largeItemHeight = container.find('article[class*="default"]:first img').height();
			}else if(container.find('article[class*="large_width"]:not(.large_width_height):first img').height()){
				largeItemHeight = container.find('article[class*="large_width"]:not(.large_width_height):first img').height();
			}else{
				largeItemHeight = (container.find('article[class*="large_width_height"]:first img').height()) ? (container.find('article[class*="large_width_height"]:first img').height())/2 : (container.find('article[class*="large_height"]:first img').height())/2;
			}
			var double = ($window.innerWidth() > 480) ? 2 : 1 ;
			container.find('article[class*="large_width_height"] img, article[class*="large_height"] img').css('height',(largeItemHeight*double));
		}
	}
	
	function setPortfolioMasZIndex(){
		var $elemXPos = {};
		var $elemZIndex = {};
		
		$('.projects_masonry_holder article').each(function(){
			$elemXPos[$(this).index()] = getPortfolioXPos($(this).css('left'));
		});
		
		var $elemXPosArray = $.map($elemXPos, function (value) { return value; });
		$elemXPosArray = cleanPortfolioMasXArray($elemXPosArray);
		$elemXPosArray.sort(function(x,y){return x-y});
		
		for(var i = 0; i < $elemXPosArray.length; i++){
			$elemZIndex[$elemXPosArray[i]] = i*10;
		}
		
		$.each($elemXPos,function(key,val){
			
			var $zi;
			var $bgd = val;
			$.each($elemZIndex,function(key,val){
				if($bgd == key) {
					$zi = val;
				}
			});
			
			$('.projects_masonry_holder article:eq('+key+')').css('z-index',$zi);
		});
	}
	
	function cleanPortfolioMasXArray($elemXPosArray) {
		var i;
		var length = $elemXPosArray.length;
		var $elemXPosOutArray = [];
		var tmp = {};
		
		for (i = 0; i < length; i++) {
			tmp[$elemXPosArray[i]] = 0;
		}
		for (i in tmp) {
			$elemXPosOutArray.push(i);
		}
		return $elemXPosOutArray;
	}
	
	function getPortfolioXPos(css) {
		//return css.substr(7, css.length - 8).split(', ')[4];
		return css.substr(0, css.length - 2);
	}
	
	function qodeInitPortFilterCounter(container){
		
		if(container.hasClass('portfolio_holder_fwn')){
			var articles = (container.find('article'));
			var filters = (container.find('.filter_holder ul li'));
			
			filters.each(function(){
				var item = $(this);
				
				if((item).data('filter') == 'all' || (item).data('filter') == '*'){
					updateResult(item,".filter_number_of_items", articles.length);
				}
				else{
					var categoryClass = item.attr('data-filter');
					categoryClass = categoryClass.replace(/\./g, '');
					updateResult(item,".filter_number_of_items", container.find('article.'+categoryClass).length);
				}
				
			});
			
			filters.css('opacity','1');
			
		}
		
		function updateResult(item, pos ,value){
			item.find(pos).text(value);
		}
	}
	
	function loadMore(){
		"use strict";
		
		var i = 1;
		
		$('.load_more a').on('click', function(e)  {
			e.preventDefault();
			
			var currentElement = $(this);
			var currentElementHolder = $(this).closest('.projects_holder_outer');
			var link = $(this).attr('href');
			var $content = '.projects_holder';
			var $anchor = '.portfolio_paging .load_more a';
			var $next_href = $($anchor).attr('href'); // Get URL for the next set of posts
			var filler_num = $('.projects_holder .filler').length;
			
			var load_more_holder = $('.portfolio_paging');
			var loading_holder   = $('.portfolio_paging_loading');
			
			load_more_holder.hide();
			loading_holder.show();
			
			$.get(link+'', function(data){
				if (!$($content).is('.justified-gallery')) {
					$('.projects_holder .filler').slice(-filler_num).remove();
					var $new_content = $($content, data).wrapInner('').html(); // Grab just the content
					$next_href = $($anchor, data).attr('href'); // Get the new href
					$($content, data).waitForImages(function() {
						
						$('article.mix:last').after($new_content); // Append the new content
						
						$('.projects_holder article').css('visibility','visible');
						$('article:not(.show)').each(function(l){
							$(this).addClass('show');
						});
						
						if($('.masonry_with_space').length){
							$('.masonry_with_space .projects_holder').isotope('reloadItems').isotope();
						}else{
							var min_height = $('article.mix:first').height();
							$('article.mix').css('min-height',min_height);
							$('.projects_holder').mixitup('remix','all');
						}
						prettyPhoto();
						if($('.load_more').attr('rel') > i) {
							$('.load_more a').attr('href', $next_href); // Change the next URL
						} else {
							$('.load_more').remove();
						}
						$('.projects_holder .portfolio_paging:last').remove(); // Remove the original navigation
						$('article.mix').css('min-height',0);
						
						load_more_holder.show();
						loading_holder.hide();
					});
				}
				else {
					var $new_content = $($content, data).wrapInner('').html(); // Grab just the content
					$next_href = $($anchor, data).attr('href'); // Get the new href
					$($content, data).waitForImages(function() {
						
						$($content).find('article:last').after($new_content); // Append the new content
						
						$($content).find('article').css('visibility','visible');
						$($content).justifiedGallery('norewind');
						prettyPhoto();
						if($('.load_more').attr('rel') > i) {
							$('.load_more a').attr('href', $next_href); // Change the next URL
						} else {
							$('.load_more').remove();
						}
						$('.projects_holder .portfolio_paging:last').remove(); // Remove the original navigation
						
						load_more_holder.show();
						loading_holder.hide();
					});
				}
			}).done(function() {
				setTimeout(function(){
					initPortfolioMasonry();
					qodeInitPortFilterCounter(currentElementHolder);
				},1000);
			});
			i++;
		});
	}
	
	function qodeInitElementorPortfolioList(){
		$(window).on('elementor/frontend/init', function () {
			elementorFrontend.hooks.addAction( 'frontend/element_ready/bridge_portfolio_list.default', function() {
				initPortfolio();
				initPortfolioZIndex();
				initPortfolioJustifiedGallery();
				initPortfolioMasonry();
				initPortfolioMasonryFilter();
				loadMore();
			} );
		});
	}
	
})(jQuery);