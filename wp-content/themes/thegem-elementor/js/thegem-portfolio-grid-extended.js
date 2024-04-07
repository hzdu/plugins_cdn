(function ($) {
	$(function () {

		const isEditor = $('body').hasClass('elementor-editor-active');
		let scrollTopPromise;

		window.defaultSortPortfolioDataNew = {
			date: '[data-sort-date] parseInt',
			popularity: '[data-sort-popularity] parseInt',
			rating: '[data-sort-rating] parseInt',
			price: '[data-sort-price] parseInt',
			title: '.title'
		};

		var localCache = {
			data: {},
			remove: function (url) {
				delete localCache.data[url];
			},
			exist: function (url) {
				return localCache.data.hasOwnProperty(url) && localCache.data[url] !== null;
			},
			get: function (url) {
				return localCache.data[url];
			},
			set: function (url, cachedData, callback) {
				localCache.remove(url);
				localCache.data[url] = cachedData;
				if ($.isFunction(callback)) callback(cachedData);
			}
		};

		let youtubeInited = false;
		let vimeoInited = false;
		let selfInited = false;
		let currentFilters = [];

		function portfolioImagesLoaded($box, image_selector, immediately, callback) {
			if (immediately) {
				return callback();
			}

			function check_image_loaded(img) {
				return img.getAttribute('src') == '' || window.getComputedStyle(img).display === "none" || window.getComputedStyle(img.parentElement).display === "none" || (img.complete && img.naturalWidth !== undefined && img.naturalWidth != 0);
			}

			var $images = $(image_selector, $box).filter(function () {
					return !check_image_loaded(this);
				}),
				images_count = $images.length;

			if (images_count == 0) {
				return callback();
			}

			if (window.gemBrowser.name == 'ie' && !isNaN(parseInt(window.gemBrowser.version)) && parseInt(window.gemBrowser.version) <= 10) {
				function image_load_event() {
					images_count--;
					if (images_count == 0) {
						callback();
					}
				}

				$images.each(function () {
					if (check_image_loaded(this)) {
						return;
					}

					var proxyImage = new Image();
					proxyImage.addEventListener('load', image_load_event);
					proxyImage.addEventListener('error', image_load_event);
					proxyImage.src = this.src;
				});
				return;
			}

			$images.on('load error', function () {
				images_count--;
				if (images_count == 0) {
					callback();
				}
			});
		}

		function initPrevNextNavigatorButtons($portfolio) {
			var current_page = $portfolio.data('current-page');
			var pages_count = $portfolio.data('pages-count');
			if (current_page <= 1) {
				if ($portfolio.hasClass('portfolio-pagination-normal')) {
					$('.portfolio-navigator a.prev', $portfolio).css('display', 'none');
				} else {
					$('.portfolio-navigator a.prev', $portfolio).addClass('disabled');
				}
			} else {
				if ($portfolio.hasClass('portfolio-pagination-normal')) {
					$('.portfolio-navigator a.prev', $portfolio).css('display', 'flex');
				} else {
					$('.portfolio-navigator a.prev', $portfolio).removeClass('disabled');
				}
			}

			if (current_page >= pages_count) {
				if ($portfolio.hasClass('portfolio-pagination-normal')) {
					$('.portfolio-navigator a.next', $portfolio).css('display', 'none');
				} else {
					$('.portfolio-navigator a.next', $portfolio).addClass('disabled');
				}
			} else {
				if ($portfolio.hasClass('portfolio-pagination-normal')) {
					$('.portfolio-navigator a.next', $portfolio).css('display', 'flex');
				} else {
					$('.portfolio-navigator a.next', $portfolio).removeClass('disabled');
				}
			}
		}

		function initPortfolioPagesExtended($portfolio) {
			var current_page = $portfolio.data('current-page');
			var pages_count = $portfolio.data('pages-count');

			if ($portfolio.hasClass('portfolio-pagination-normal')) {
				if ($('.portfolio-navigator', $portfolio).length && pages_count > 1) {
					let pagenavigator = '';
					let end_size = 3;
					let mid_size = 2;
					let dots = false;
					for (let i = 1; i <= pages_count; i++) {
						if (i == current_page || i <= end_size || (current_page && i >= current_page - mid_size && i <= current_page + mid_size) || i > pages_count - end_size) {
							pagenavigator += '<a href="#" data-page="' + i + '">' + i + '</a>';
							dots = true;
						} else if (dots) {
							pagenavigator += '<span class="page-numbers dots">...</span>';
							dots = false;
						}
					}
					$('.portfolio-navigator', $portfolio).find('.pages').html(pagenavigator);
					$('.portfolio-navigator', $portfolio).show();
					$('.portfolio-set', $portfolio).css('margin-bottom', '');
					$('.portfolio-navigator a[data-page="' + current_page + '"]', $portfolio).addClass('current');
				} else {
					$('.portfolio-navigator .pages', $portfolio).html('');
					$('.portfolio-navigator', $portfolio).hide();
					$('.portfolio-set', $portfolio).css('margin-bottom', 0);
				}
			}
			initPrevNextNavigatorButtons($portfolio);

			$('.portfolio-navigator', $portfolio).off('click', 'a');
			$('.portfolio-navigator', $portfolio).on('click', 'a', function () {
				if ($(this).hasClass('current'))
					return false;
				// var current_page = $(this).parents('.portfolio-navigator ').find('.current:first').data('page');
				var current_page = $portfolio.data('current-page');
				var page;
				if ($(this).hasClass('prev')) {
					page = current_page - 1;
				} else if ($(this).hasClass('next')) {
					page = current_page + 1
				} else {
					page = $(this).data('page');
				}
				if (page < 1)
					page = 1;
				if (page > pages_count)
					page = pages_count;
				$portfolio.data('next-page', page);
				$(this).parents('.portfolio-navigator ').find('a').removeClass('current');
				$(this).parents('.portfolio-navigator ').find('a[data-page="' + page + '"]').addClass('current');
				$portfolio.data('current-page', page);
				$portfolio.addClass('hide-loader');
				scrollTopPortfolio($portfolio, true)
				portfolioLoadCoreRequest($portfolio);
				initPortfolioPagesExtended($portfolio);
				return false;
			});
		}

		let fixedHeight = 0;

		if ($('#site-header.animated-header').length) {
			let $header = $('#site-header')[0];
			fixedHeight = $header.clientHeight;

			$(window).scroll(function () {
				if (fixedHeight > $header.clientHeight) {
					fixedHeight = $header.clientHeight;
				}
			});
		}

		function scrollTopPortfolio($this, $preventCheck = false) {
			let $portfolio;
			if ($this.hasClass('portfolio')) {
				$portfolio = $this;
			} else {
				$portfolio = $('.portfolio[data-portfolio-uid="' + $this.data('portfolio-uid') + '"]');
			}
			if (!$portfolio.length) return;
			if ($portfolio.find('.portfolio-top-panel').hasClass('filters-top-sticky')) {
				$(window).trigger('scroll');
			}
			if ($preventCheck || $this.find('.portfolio-filters-list').hasClass('scroll-top') || $this.find('.portfolio-sorting-select').hasClass('scroll-top') || $portfolio.find('.portfolio-top-panel').hasClass('sticky-fixed')) {
				let offset = fixedHeight;
				if ($portfolio.find('.portfolio-top-panel').hasClass('sticky-fixed')) {
					offset = -1;
				}
				$("html, body").animate({scrollTop: $portfolio.offset().top - offset - 20}, 600);
				scrollTopPromise = new Promise(resolve => {
					setTimeout(() => resolve('animated'), 600);
				});
			}
		}

		function initPortfolioSorting($portfolio) {

			$('.portfolio-sorting a.sorting-switcher', $portfolio).on('click', function (e) {
				var $selected = $('label[data-value!="' + $(this).data('current') + '"]', $(this).parent());
				$(this).data('current', $selected.data('value'));

				if ($(this).next().is($selected)) {
					$(this).addClass('right');
				} else {
					$(this).removeClass('right');
				}

				if ($portfolio.hasClass('category-grid')) {
					return;
				}

				$portfolio.data('next-page', 1);
				$portfolio.data('current-page', 1);
				portfolioLoadCoreRequest($portfolio);

				e.preventDefault();
				return false;
			});

			$('.portfolio-sorting label', $portfolio).on('click', function (e) {
				if ($(this).data('value') != $('.sorting-switcher', $(this).parent()).data('current')) {
					$('.sorting-switcher', $(this).parent()).click();
				}
				e.preventDefault();
				return false;
			});
		}

		$.fn.initPortfolioSorting = function () {
			let $portfolio,
				$this = $(this),
				portfolioUid = $this.data('portfolio-uid'),
				$sortingSelect = $this.find('.portfolio-sorting-select');
			if ($this.hasClass('portfolio')) {
				$portfolio = $this;
			} else {
				$portfolio = $('.portfolio[data-portfolio-uid="' + portfolioUid + '"]');
			}

			if ($sortingSelect.hasClass('open-dropdown-click')) {
				$sortingSelect.on('mouseleave', function () {
					$(this).removeClass('active');
				}).on('click', 'div.portfolio-sorting-select-current', function () {
					$sortingSelect.toggleClass('active');
				});
			} else {
				$sortingSelect.on('mouseover', function () {
					$(this).addClass('active');
				}).on('mouseout', function () {
					$(this).removeClass('active');
				});
			}

			$sortingSelect.on('click', 'li', function (e) {
				$('.portfolio-sorting-select li', $this).removeClass('portfolio-sorting-select-current');
				$('.portfolio-sorting-select div.portfolio-sorting-select-current .portfolio-sorting-select-name', $this).html($(this).html());
				$(this).addClass('portfolio-sorting-select-current');
				var selected = $(this).data('value');
				$('.portfolio-sorting-select', $this).mouseout();

				$portfolio.data('next-page', 1);
				$portfolio.data('current-page', 1);
				portfolioLoadCoreRequest($portfolio);
				scrollTopPortfolio($this);

				e.preventDefault();
				return false;
			});
		}

		function initFiltersMore($portfolio) {
			if (!$('.portfolio-filters-more', $portfolio).length)
				return false;

			$('.portfolio-filters-more', $portfolio).on('mouseover', function () {
				$(this).addClass('active');
			}).on('mouseout', function () {
				$(this).removeClass('active');
			});

			$('.portfolio-filters-more a', $portfolio).on('click', function (e) {
				$('.portfolio-filters-more', $portfolio).mouseout();
			});
		}

		var ajaxRequest;

		function portfolioLoadCoreRequest($portfolio, $next_page_preload = false, $params = false, $get_query_params = false) {
			if (!$portfolio.hasClass('portfolio') && !$get_query_params) return;
			var uid = $portfolio.data('portfolio-uid');
			var widget_settings_id = $portfolio.data('style-uid') ? $portfolio.data('style-uid') : uid;
			var queryParams;
			if ($get_query_params) {
				queryParams = new URLSearchParams();
			} else {
				var queryParams = new URLSearchParams(window.location.search);
				var delArr = [], cacheId = widget_settings_id;
				for (var p of queryParams) {
					if (uid.length) {
						if (p[0].includes(uid)) {
							delArr.push(p[0]);
						}
					} else {
						if (p[0].includes('filter_') || ["s", "page", "category", "min_price", "max_price", "status"].includes(p[0])) {
							delArr.push(p[0]);
						}
					}
				}

				for (var del of delArr) {
					queryParams.delete(del);
				}
			}

			if (!$next_page_preload && ajaxRequest != null) {
				ajaxRequest.abort();
				ajaxRequest = null;
			}

			var data = $.extend(true, {}, window['thegem_portfolio_ajax_' + widget_settings_id]);
			if ($get_query_params) {
				data['data'] = [];
			} else if ($.isEmptyObject(data)) {
				data = $.extend(true, {}, window['thegem_portfolio_ajax']);
				data['data'] = widget_settings[widget_settings_id];
				data['action'] = data['data']['action'];
			}
			if (uid != '') {
				uid += '-';
			}
			if ($('.portfolio-count select', $portfolio).length > 0)
				data['data']['more_count'] = $('.portfolio-count select', $portfolio).val();

			data['data']['items_per_page'] = $portfolio.data('per-page');

			var next_page = $portfolio.data('next-page');
			if ($params) {
				next_page = $params['next-page'];
			}
			data['data']['more_page'] = next_page || 1;

			if (data['data']['more_page'] == 0)
				return false;

			if (!$next_page_preload) {
				if ($portfolio.hasClass('reduce-size')) {
					if (next_page === 2) {
						data['data']['offset'] = data['data']['items_on_load'];
						data['data']['items_per_page'] = data['data']['items_per_page'] - data['data']['items_on_load'];
						data['data']['load_more_show_all'] = '';
						data['data']['more_page'] = 1;
						$portfolio.addClass('custom-scroll-loaded');
						cacheId += 'csl';
					}
					$portfolio.removeClass('reduce-size');
				} else {
					$portfolio.removeClass('custom-scroll-loaded')
				}
			}

			var portfolio_filter = $portfolio.data('portfolio-filter');
			if ($params['portfolio-filter']) {
				portfolio_filter = $params['portfolio-filter'];
			}
			if (portfolio_filter && portfolio_filter.length !== 0) {
				if (!Array.isArray(portfolio_filter)) {
					portfolio_filter = [portfolio_filter];
				}
				if ($portfolio.hasClass('news-grid')) {
					data['data']['categories'] = portfolio_filter;
				} else if ($portfolio.hasClass('products')) {
					data['data']['content_products_cat'] = portfolio_filter;
				} else {
					data['data']['content_portfolios_cat'] = portfolio_filter;
				}
				data['data']['has_categories_filter'] = true;
				if (!$('.portfolio-filters-list', $portfolio).hasClass('native')
					&& !$('.portfolio-filter-item.cats', $portfolio).hasClass('reload')
					&& !$('.portfolio-filter-tabs', $portfolio).length) {
					queryParams.set(uid + 'category', portfolio_filter);
					cacheId += 'category=' + portfolio_filter;
				}
			} else {
				data['data']['has_categories_filter'] = false;
			}
			if (data['data']['content_products_cat']) {
				data['data']['content_products_cat'] = data['data']['content_products_cat'].toString();
			}

			var attr_filter = $portfolio.data('portfolio-filter-attributes');
			if ($params['portfolio-filter-attributes']) {
				attr_filter = $params['portfolio-filter-attributes'];
			}
			data['data']['has_tags_filter'] = false;
			if (attr_filter) {
				data['data']['has_attributes_filter'] = true;
				let filters_attr = $portfolio.hasClass('products') ? 'content_products_attr' : 'filters_attr';
				data['data'][filters_attr] = [];
				var i = 0;
				for (var key in attr_filter) {
					if (key == 'tax_product_tag') {
						data['data']['content_products_tags'] = attr_filter[key];
						data['data']['has_tags_filter'] = true;
						queryParams.set(uid + 'product_tag', attr_filter[key]);
						cacheId += 'product_tag' + '=' + attr_filter[key];
					} else {
						data['data'][filters_attr].push(key);
						data['data'][filters_attr + '_val_' + key] = attr_filter[key].toString();
						queryParams.set(uid + 'filter_' + key, attr_filter[key]);
						cacheId += 'filter_' + key + '=' + attr_filter[key];
						i++;
					}
				}
				data['data'][filters_attr] = data['data'][filters_attr].toString();
				if (i === 0) {
					data['data']['has_attributes_filter'] = false;
				}
			} else {
				data['data']['has_attributes_filter'] = false;
			}

			var portfolio_filter_status = $portfolio.data('portfolio-filter-status');
			if ($params) {
				portfolio_filter_status = $params['portfolio-filter-status'];
			}
			if (portfolio_filter_status) {
				data['data']['content_products_status_filter'] = portfolio_filter_status;
				if (!$('.portfolio-filter-tabs', $portfolio).length) {
					queryParams.set(uid + 'status', portfolio_filter_status);
					cacheId += 'status=' + portfolio_filter_status;
				}
			}

			if ($portfolio.data('portfolio-filter-price')) {
				data['data']['content_products_price_filter'] = $portfolio.data('portfolio-filter-price');
				queryParams.set(uid + 'min_price', $portfolio.data('portfolio-filter-price')[0]);
				queryParams.set(uid + 'max_price', $portfolio.data('portfolio-filter-price')[1]);
				cacheId += 'min_price=' + $portfolio.data('portfolio-filter-price')[0];
				cacheId += 'max_price=' + $portfolio.data('portfolio-filter-price')[1];
			}

			if ($portfolio.data('portfolio-filter-search')) {
				data['data']['portfolio_search_filter'] = $portfolio.data('portfolio-filter-search');
				queryParams.set(uid + 's', $portfolio.data('portfolio-filter-search'));
				cacheId += 's=' + $portfolio.data('portfolio-filter-search');
			}

			var current_tab = $portfolio.data('current-tab');
			if ($params) {
				current_tab = $params['current-tab'];
			}
			if (current_tab && current_tab != 0) {
				queryParams.set(uid + 'tab', current_tab);
				cacheId += 'tab=' + current_tab;
			}

			if ($('.portfolio-sorting', $portfolio).length > 0) {
				data['data']['orderby'] = $('.portfolio-sorting .orderby .sorting-switcher', $portfolio).data('current');
				data['data']['order'] = $('.portfolio-sorting .order .sorting-switcher', $portfolio).data('current');
				cacheId += 'orderby' + $('.portfolio-sorting .orderby .sorting-switcher', $portfolio).data('current');
				cacheId += 'order' + $('.portfolio-sorting .order .sorting-switcher', $portfolio).data('current');
			} else if ($('.portfolio-sorting-select', $portfolio).length > 0 || $('.extended-posts-sorting[data-portfolio-uid="' + $portfolio.data('portfolio-uid') + '"] .portfolio-sorting-select').length > 0) {
				let $sortingSelect = $('.portfolio-sorting-select', $portfolio).length > 0 ? $('.portfolio-sorting-select', $portfolio) : $('.extended-posts-sorting[data-portfolio-uid="' + $portfolio.data('portfolio-uid') + '"] .portfolio-sorting-select'),
					$sortingSelectCurrent = $sortingSelect.find('li.portfolio-sorting-select-current');

				if (!$sortingSelect.find('li.default', $portfolio).hasClass('portfolio-sorting-select-current')) {
					data['data']['orderby'] = $sortingSelectCurrent.data('orderby');
					data['data']['order'] = $sortingSelectCurrent.data('order');
					queryParams.set(uid + 'orderby', $sortingSelectCurrent.data('orderby'));
					queryParams.set(uid + 'order', $sortingSelectCurrent.data('order'));
					cacheId += 'orderby' + $sortingSelectCurrent.data('orderby');
					cacheId += 'order' + $sortingSelectCurrent.data('order');
				}
			} else {
				if ($portfolio.hasClass('news-grid')) {
					data['data']['orderby'] = data['data']['orderby'] != 'default' ? data['data']['orderby'] : 'menu_order date';
					data['data']['order'] = data['data']['order'] != 'default' ? data['data']['order'] : 'DESC';
				} else if (!$portfolio.hasClass('extended-products-grid')) {
					data['data']['orderby'] = data['data']['orderby'] && data['data']['orderby'] != 'default' ? data['data']['orderby'] : 'menu_order ID';
					data['data']['order'] = data['data']['order'] && data['data']['order'] != 'default' ? data['data']['order'] : 'ASC';
				}
			}

			if ($get_query_params) {
				return queryParams.toString();
			}

			if (!$next_page_preload && !$portfolio.hasClass('custom-scroll-loaded')) {
				let preloader;
				if ($portfolio.hasClass('minimal-preloader')) {
					preloader = '<div class="loading"><div class="preloader-spin-new"></div></div>';
				} else {
					preloader = '<div class="loading"><div class="preloader-spin"></div></div>';
				}
				if ($portfolio.hasClass('portfolio-pagination-more') && data['data']['more_page'] != 1) {
					$('.portfolio-load-more .gem-button', $portfolio).before(preloader);
				} else if ($portfolio.hasClass('portfolio-pagination-scroll') && data['data']['more_page'] != 1) {
					$('.portfolio-scroll-pagination', $portfolio).addClass('active').html(preloader);
				} else {
					addFilterLoader($portfolio);

					if ($portfolio.hasClass('portfolio-pagination-normal') || $portfolio.hasClass('portfolio-pagination-arrows')) {
						if (data['data']['more_page'] > 1) {
							queryParams.set(uid + 'page', data['data']['more_page']);
						}
						setTimeout(function () {
							$portfolio.removeClass('hide-loader');
						}, 600);
					}
				}
			}

			cacheId += 'page' + data['data']['more_page'];

			if ($('.portfolio-filters-list', $portfolio).length > 0 && ($('.portfolio-filters-list', $portfolio).hasClass('style-hidden') || $(window).width() < 992)) {
				$('.progress-bar .striped', $portfolio).show();
				$('.progress-bar', $portfolio).fadeIn('slow');
			}

			if (!$next_page_preload && !$portfolio.hasClass('category-grid')) {
				if (queryParams.toString().length > 0) {
					history.replaceState(null, null, "?" + queryParams.toString());
				} else {
					history.replaceState(null, null, location.href.split("?")[0]);
				}
			}

			data['data'] = JSON.stringify(data['data']);
			ajaxRequest = $.ajax({
				type: 'post',
				dataType: 'json',
				url: data.url,
				data: data,
				beforeSend: function () {
					if (localCache.exist(cacheId)) {
						if (!$next_page_preload) {
							ajaxSuccess($portfolio, localCache.get(cacheId));
						}
						return false;
					}
					return true;
				},
				success: function (response) {
					if (response.status == 'success') {
						if (!$next_page_preload) {
							ajaxSuccess($portfolio, response);
						}
						localCache.set(cacheId, response);
					} else {
						alert(response.message);
						$('.portfolio-load-more .gem-button .loading', $portfolio).remove();
						$('.portfolio-scroll-pagination', $portfolio).removeClass('active').html('');
					}
				}
			});
		}

		function ajaxSuccess($portfolio, response) {
			var $set = $('.portfolio-set:not(.sub-categories)', $portfolio);
			var minZIndex = $('.portfolio-item:last', $set).css('z-index') - 1;
			var $newItems;
			if (document.location.protocol == 'https:') {
				$newItems = $(response.html.replaceAll("http:", "https:"));
			} else {
				$newItems = $(response.html);
			}
			if ($newItems.hasClass('woocommerce')) {
				$newItems = $newItems.find('>div');
			}
			var $inserted_data = $('.portfolio-item', $newItems);
			$inserted_data.addClass('paginator-page-1');
			$inserted_data.each(function () {
				$(this).css('z-index', minZIndex--);
			});
			var current_page = $newItems.data('page');
			var next_page = $newItems.data('next-page');
			$portfolio.data('current-page', current_page);
			$portfolio.data('pages-count', $newItems.data('pages-count'));
			if ($portfolio.hasClass('loading-animation')) {
				if ($portfolio.itemsAnimations('instance').getAnimationName() != 'disabled') {
					$inserted_data.addClass('item-animations-not-inited');
				} else {
					$inserted_data.removeClass('item-animations-not-inited');
				}
			}

			if (response.counts) {
				$('.portfolio-filter-item a', $portfolio).removeClass('disable');
				for (var key in response.counts) {
					$('.portfolio-filter-item a[data-filter-id=' + key + '] .count', $portfolio).html(response.counts[key]);
					if (response.counts[key] == 0) {
						$('.portfolio-filter-item a[data-filter-id=' + key + ']', $portfolio).addClass('disable');
					}
				}
			}

			if (($portfolio.hasClass('columns-2') || $portfolio.hasClass('columns-3') || $portfolio.hasClass('columns-4')) && $portfolio.hasClass('news-grid') && $portfolio.outerWidth() > 1170) {
				$('.image-inner picture source', $inserted_data).remove();
			}

			var immediately = false;
			if (($portfolio.hasClass('extended-products-grid') && $portfolio.hasClass('portfolio-style-justified')) || $portfolio.hasClass('without-image') || $portfolio.hasClass('disable-isotope')) {
				immediately = true;
			}

			portfolioImagesLoaded($newItems, '.image-inner img', immediately, function () {
				if (!$portfolio.hasClass('custom-scroll-loaded') && (current_page === 1 || $portfolio.hasClass('portfolio-pagination-normal') || $portfolio.hasClass('portfolio-pagination-arrows'))) {
					if ($portfolio.hasClass('loading-animation')) {
						$portfolio.itemsAnimations('instance').clear();
					}
					$set.html('');
					if (!$portfolio.hasClass('disable-isotope')) {
						$set.isotope('reloadItems');
					}
				}

				$portfolio.removeClass('ready');

				if (!$portfolio.hasClass('disable-isotope')) {
					$set.isotope('insert', $inserted_data);
					var items = $('.portfolio-item:not(.not-found)', $set);
					itemsInit($portfolio, items);
					imageSizesFix($portfolio);
				} else {
					$set.append($inserted_data);
					var items = $('.portfolio-item:not(.not-found)', $set);
					itemsInit($portfolio, items);
					imageSizesFix($portfolio);
					layoutComplete($portfolio, $set, items);
					arrangeComplete($portfolio, $set, 'justified', items);
				}

				setTimeout(function () {
					$portfolio.addClass('ready');
				}, 500);

				initCircularOverlay($portfolio, $inserted_data);

				if (window.wp !== undefined && window.wp.mediaelement !== undefined) {
					window.wp.mediaelement.initialize();
				}

				$portfolio.data('next-page', next_page);
				if ($portfolio.hasClass('portfolio-pagination-more')) {
					$('.portfolio-load-more .loading', $portfolio).remove();

					if (next_page > 0) {
						$('.portfolio-load-more', $portfolio).show();
					} else {
						$('.portfolio-load-more', $portfolio).hide();
					}
				} else if ($portfolio.hasClass('portfolio-pagination-scroll')) {
					$('.portfolio-scroll-pagination', $portfolio).removeClass('active').html('');
				} else if ($portfolio.hasClass('portfolio-pagination-normal') || $portfolio.hasClass('portfolio-pagination-arrows')) {
					if (current_page === 1 && !$portfolio.hasClass('custom-scroll-loaded')) {
						initPortfolioPagesExtended($portfolio);
					}
				}
				if (scrollTopPromise) {
					scrollTopPromise.then(function () {
						$('.portfolio-row-outer', $portfolio).find('.preloader-new').remove();
						$('.progress-bar .striped', $portfolio).fadeOut('slow');
					});
				} else {
					$('.portfolio-row-outer', $portfolio).find('.preloader-new').remove();
					$('.progress-bar .striped', $portfolio).fadeOut('slow');
				}

				if (typeof initPortfolioFancybox === 'function') {
					$portfolio.initPortfolioFancybox();
				}

				customExtendedIcons($inserted_data);
				categoryFilterClick($inserted_data);

				if ($('.product-variations', $inserted_data).length) {
					$('.gem-attribute-selector', $inserted_data).gemWooAttributeSelector();
					$('.product-variations', $inserted_data).each(function () {
						try {
							$(this).wc_variation_form();
						} catch(err) {
							console.log(err);
						}
						initVariations($(this));
					});
				}

				if ($portfolio.hasClass('next-page-preloading') && !isEditor) {
					portfolioLoadCoreRequest($portfolio, true)
				}

				$('.portfolio-search-filter-form', $portfolio).removeClass('ajax-loading');

				if ($('.zilla-likes', $inserted_data).length) {

					$('.zilla-likes', $inserted_data).on('click', function() {
						var link = $(this);
						if (link.hasClass('active')) return false;

						var id = $(this).attr('id'),
							postfix = link.find('.zilla-likes-postfix').text();

						$.ajax({
							type: 'POST',
							url: zilla_likes.ajaxurl,
							data: {
								action: 'zilla-likes',
								likes_id: id,
								postfix: postfix,
							},
							xhrFields: {
								withCredentials: true,
							},
							success: function(data) {
								link.html(data).addClass('active').attr('title','You already like this');
							},
						});

						return false;
					});
				}
			});
		}

		function addFilterLoader($portfolio) {
			let pos_t;
			if ($portfolio.find('.portfolio-filters-list').hasClass('scroll-top') || $portfolio.hasClass('hide-loader')) {
				if ($portfolio.offset().top + $portfolio.height() < $portfolio.offset().top - 200 + window.innerHeight) {
					pos_t = $portfolio.height() / 2;
				} else {
					pos_t = ($portfolio.offset().top - 200 + window.innerHeight - $portfolio.offset().top) / 2;
				}
			} else {
				if ($portfolio.offset().top + $portfolio.height() < $(window).scrollTop() + window.innerHeight) {
					if ($portfolio.offset().top > $(window).scrollTop()) {
						pos_t = $portfolio.height() / 2;
					} else {
						pos_t = $(window).scrollTop() - $portfolio.offset().top + ($portfolio.offset().top + $portfolio.height() - $(window).scrollTop()) / 2;
					}
				} else {
					if ($portfolio.offset().top > $(window).scrollTop()) {
						pos_t = ($(window).scrollTop() + window.innerHeight - $('.portfolio-row-outer', $portfolio).offset().top) / 2;
					} else {
						pos_t = $(window).scrollTop() - $portfolio.offset().top + window.innerHeight / 2;
					}
				}
			}

			let preloader;
			if ($portfolio.hasClass('minimal-preloader')) {
				preloader = '<div class="preloader-new"><div class="preloader-spin-new"></div></div>';
			} else {
				preloader = '<div class="preloader-new"><div class="preloader-spin"></div></div>';
			}
			$('.portfolio-row-outer', $portfolio).prepend(preloader);
			$('.portfolio-row-outer .preloader-new > div', $portfolio).css('top', pos_t);
			if ($('.portfolio-filters-list', $portfolio).hasClass('style-sidebar')) {
				let pos_r = ($('.portfolio-top-panel', $portfolio).outerWidth()) / 2;
				if ($portfolio.closest('.panel-sidebar-position-right').length) {
					$('.portfolio-row-outer .preloader-new > div', $portfolio).css('left', pos_r);
				} else {
					$('.portfolio-row-outer .preloader-new > div', $portfolio).css('right', pos_r);
				}
			}
			if (!$portfolio.hasClass('custom-scroll-loaded')) {
				scrollTopPortfolio($portfolio);
			}
		}

		function initPortfolioScrollNextPage($portfolio) {
			if ($('.portfolio-scroll-pagination', $portfolio).length == 0) {
				return false;
			}

			var $pagination = $('.portfolio-scroll-pagination', $portfolio);
			var watcher = scrollMonitor.create($pagination[0]);
			watcher.enterViewport(function () {
				if (this.watchItem.offsetTop > 0 && $portfolio.data('next-page') != 0) {
					portfolioLoadCoreRequest($portfolio);
				}
			});
		}

		$('.portfolio-count select').combobox();

		function initCircularOverlay($portfolio, $items) {
			if (!$portfolio.hasClass('hover-circular') && !$portfolio.hasClass('hover-new-circular') && !$portfolio.hasClass('hover-default-circular')) {
				return;
			}

			$items.on('mouseenter touchstart', function () {
				var overlayWidth = $('.overlay', this).width(),
					overlayHeight = $('.overlay', this).height(),
					$overlayCircle = $('.overlay-circle', this),
					maxSize = 0;

				if (overlayWidth > overlayHeight) {
					maxSize = overlayWidth;
					$overlayCircle.height(overlayWidth)
				} else {
					maxSize = overlayHeight;
					$overlayCircle.width(overlayHeight);
				}
				maxSize += overlayWidth * 0.3;

				$overlayCircle.css({
					marginLeft: -maxSize / 2,
					marginTop: -maxSize / 2
				});
			});
		}

		function fixItemHiddenContent($portfolio) {
			$('.slide-content-hidden', $portfolio).css('display', 'block');

			$('.portfolio-item', $portfolio).each(function () {
				let $hiddenContent = $(this).find('.slide-content-hidden');

				if (!$hiddenContent.length) {
					return;
				}

				$hiddenContent.css('margin-bottom', -$hiddenContent.outerHeight() + 'px');
			});

			$('.slide-content-hidden', $portfolio).css('display', '');
		}

		function fixHorizontalSlidingAuthor($portfolio) {
			$('.slide-content-hidden', $portfolio).css('display', 'block');

			$('.portfolio-item', $portfolio).each(function () {
				let $visibleContent = $(this).find('.slide-content-visible'),
					$hiddenContent = $(this).find('.slide-content-hidden'),
					$authorContent = $(this).find('.caption .author');

				if (!$authorContent.length || !$visibleContent.length || !$hiddenContent.length) {
					return;
				}

				$authorContent.css('top', ($visibleContent.outerHeight() - $hiddenContent.outerHeight() - $authorContent.outerHeight()) + 'px');
			});

			$('.slide-content-hidden', $portfolio).css('display', '');
		}

		function initNewsGridItems($portfolio) {
			if (!$portfolio.hasClass('news-grid')) {
				return;
			}

			if (!$portfolio.hasClass('title-on-page')) {
				$('.portfolio-item', $portfolio).each(function() {
					var $item = $(this);

					if ($item.width() < 260 || $item.height() < 300) {
						$item.addClass('small-item');
					}
				});
			}

			if (typeof $.fn.buildSimpleGalleries === 'function') {
				$portfolio.buildSimpleGalleries();
			}

			if (typeof $.fn.updateSimpleGalleries === 'function') {
				$portfolio.updateSimpleGalleries();
			}
		}

		function filterPortfolioExtended($portfolio, filterValue) {
			resetSearch($portfolio);
			$portfolio.data('portfolio-filter', filterValue || '');
			$portfolio.data('next-page', 1);
			portfolioLoadCoreRequest($portfolio);
		}

		function filterPortfolioAttributes($portfolio, filterValue) {
			resetSearch($portfolio);
			$portfolio.data('portfolio-filter-attributes', filterValue || '');
			$portfolio.data('next-page', 1);
			portfolioLoadCoreRequest($portfolio);
		}

		function filterPortfolioStatus($portfolio, filterValue) {
			$portfolio.data('portfolio-filter-status', filterValue || '');
			$portfolio.data('next-page', 1);
			portfolioLoadCoreRequest($portfolio);
		}

		function filterPortfolioPrice($portfolio, filterValue) {
			$portfolio.data('portfolio-filter-price', filterValue || '');
			$portfolio.data('next-page', 1);
			portfolioLoadCoreRequest($portfolio);
		}

		function filterPortfolioSearch($portfolio, filterValue) {
			if ($('.portfolio-search-filter', $portfolio).hasClass('reset-filters')) {
				resetFilters($portfolio);
			}
			$portfolio.data('portfolio-filter-search', filterValue || '');
			$portfolio.data('next-page', 1);
			portfolioLoadCoreRequest($portfolio);
		}

		function clearFilters($portfolio) {
			if (!$('.portfolio-top-panel.filter-type-default', $portfolio).length) {
				$portfolio.data('portfolio-filter', '');
			}
			$portfolio.data('portfolio-filter-attributes', '');
			$portfolio.data('portfolio-filter-status', '');
			$portfolio.data('portfolio-filter-price', '');
			$portfolio.data('portfolio-filter-search', '');
			$portfolio.data('next-page', 1);
			portfolioLoadCoreRequest($portfolio);
		}

		function resetSearch($this) {
			let $portfolio;
			if ($this.hasClass('portfolio')) {
				$portfolio = $this;
			} else {
				$portfolio = $('.portfolio[data-portfolio-uid="' + $this.data('portfolio-uid') + '"]');
			}
			if (!$portfolio.length) {
				$portfolio = $this;
			}
			if ($('.portfolio-search-filter', $this).hasClass('reset-filters')) {
				$portfolio.find(".portfolio-selected-filters .portfolio-selected-filter-item.search").remove();
				$this.find(".portfolio-search-filter input").val('');
				$portfolio.data('portfolio-filter-search', '');
				$portfolio.data('next-page', 1);
			}
		}

		function resetFilters($this) {
			let $portfolio;
			if ($this.hasClass('portfolio')) {
				$portfolio = $this;
			} else {
				$portfolio = $('.portfolio[data-portfolio-uid="' + $this.data('portfolio-uid') + '"]');
			}
			if (!$portfolio.length) {
				$portfolio = $this;
			}
			if ($('.portfolio-top-panel.filter-type-default', $this).length) {
				$('.portfolio-filters a', $this).removeClass('active');
				$('.portfolio-filters a:first-child', $this).addClass('active');
			}

			var $filtersList = $('.portfolio-filters-list', $this);
			if (!$filtersList.length) {
				$filtersList = $('.extended-posts-filter[data-portfolio-uid="' + $portfolio.data('portfolio-uid') + '"] .portfolio-filters-list');
			}
			$filtersList.find('.portfolio-filter-item:not(.reload) a').removeClass('active');
			$filtersList.find('.portfolio-filter-item:not(.reload) a.all').addClass('active');
			if ($filtersList.find(".slider-range").length) {
				var min = $filtersList.find(".slider-range").slider("option", "min");
				var max = $filtersList.find(".slider-range").slider("option", "max");
				$filtersList.find(".slider-range").slider("values", [min, max]);
			}
			$filtersList.find('.selector-title span.name').each(function () {
				if ($(this).data('title')) {
					$(this).html('<span data-filter="*">' + $(this).data('title') + '</span>');
				}
			});
			$portfolio.find(".portfolio-selected-filters .portfolio-selected-filter-item:not(.clear-filters, .search)").remove();
			$portfolio.data('portfolio-filter', '');
			$portfolio.data('portfolio-filter-attributes', '');
			$portfolio.data('portfolio-filter-status', '');
			$portfolio.data('portfolio-filter-price', '');
			$portfolio.data('portfolio-filter-search', '');
			$portfolio.data('next-page', 1);
		}

		function hasOnlyDoubleItems($set) {
			var $items = $('.portfolio-item', $set);
			return $items.length == $items.filter('.double-item-squared, .double-item-horizontal').length;
		}

		function fixPortfolioWithDoubleItems($portfolio, needFix) {
			if (needFix) {
				$portfolio.addClass('porfolio-even-columns');
				imageSizesFix($portfolio);
			} else {
				$portfolio.removeClass('porfolio-even-columns');
			}
		}

		function imageSizesFix($portfolio) {

			if ($portfolio.hasClass('extended-carousel-grid')) {
				return;
			}

			if ($portfolio.hasClass('extended-products-grid')) {

				if ($portfolio.hasClass('disable-isotope') || $portfolio.hasClass('portfolio-style-masonry') || $portfolio.hasClass('list-style')) {
					return;
				}

				$('.portfolio-item .image', $portfolio).css('height', '');
				$('.portfolio-item .wrap > .caption', $portfolio).css('height', '');

				var maxImageHeight = 0,
					maxCaptionHeight = 0,
					maxImageHeightVertical;

				$('.portfolio-item', $portfolio).each(function () {
					if ($(this).find('.wrap > .caption').outerHeight() > maxCaptionHeight) {
						maxCaptionHeight = $(this).find('.wrap > .caption').outerHeight();
					}
				});

				$('.portfolio-item .wrap > .caption', $portfolio).css('height', maxCaptionHeight);

				if ($portfolio.hasClass('portfolio-style-metro')) {
					if ($('.portfolio-set', $portfolio).data('isotope')) {
						$('.portfolio-set', $portfolio).isotope('layout');
					}
					return;
				}

				var singleInnerWidth = $('.portfolio-item-size-container .portfolio-item', $portfolio).innerWidth();
				var singleWidth = $('.portfolio-item-size-container .portfolio-item', $portfolio).width();
				var gaps = singleInnerWidth - singleWidth;

				if ($($portfolio).hasClass('aspect-ratio-portrait')) {
					maxImageHeight = parseInt(singleWidth * 1.25);
				} else if ($($portfolio).hasClass('aspect-ratio-custom')) {
					if ($('.portfolio-item:not(.double-item) .image', $portfolio).length) {
						maxImageHeight = parseInt($('.portfolio-item:not(.double-item) .image', $portfolio).height());
					} else {
						maxImageHeight = parseInt($('.portfolio-item:first-child .image', $portfolio).height());
					}
				} else {
					maxImageHeight = parseInt(singleWidth);
				}

				maxImageHeightVertical = 2 * maxImageHeight + gaps + maxCaptionHeight;

				$('.portfolio-item', $portfolio).not('.not-found, .double-item-squared, .double-item-vertical').find('.image').css('height', maxImageHeight);
				$('.portfolio-item.double-item-squared, .portfolio-item.double-item-vertical', $portfolio).find('.image').css('height', maxImageHeightVertical);

				if ($('.portfolio-item.double-item-squared', $portfolio).width() != singleWidth) {
					$('.portfolio-item.double-item-squared', $portfolio).find('.image').css('height', maxImageHeightVertical);
				}
			} else if ( $portfolio.hasClass('portfolio-grid') && $portfolio.hasClass('disable-isotope') && !$portfolio.hasClass('portfolio-list') && !$portfolio.hasClass('list-style') && !$portfolio.hasClass('news-grid')) {
				$('.portfolio-item .wrap .image', $portfolio).css('height', '').css('flex', '');
				$('.portfolio-item .wrap', $portfolio).css('height', '');
			}

			if ($portfolio.hasClass('portfolio-style-creative') || ( !$portfolio.hasClass('portfolio-style-masonry') && !$portfolio.hasClass('disable-isotope'))) {
				$portfolio.addClass('hide-likes');
				$('.portfolio-item .wrap > .caption', $portfolio).css('min-height', '');
				let maxCaptionHeight = 0;

				$('.portfolio-item', $portfolio).each(function () {
					if ($(this).find('.wrap > .caption').outerHeight() > maxCaptionHeight) {
						maxCaptionHeight = $(this).find('.wrap > .caption').outerHeight();
					}
				});

				$('.portfolio-item .wrap > .caption', $portfolio).css('min-height', maxCaptionHeight);
				$portfolio.removeClass('hide-likes');
			}

			if ($('.portfolio-set', $portfolio).data('isotope')) {
				$('.portfolio-set', $portfolio).isotope('layout');
			}

			if ($portfolio.hasClass('products')) {

				$('.portfolio-item', $portfolio).each(function () {
					if ($(this).outerWidth < 320) {
						$(this).addClass('item-small-size');
					} else {
						$(this).removeClass('item-small-size');
					}
				});
			}

			if ($portfolio.hasClass('news-grid') && $portfolio.hasClass('version-new')) {
				if ($portfolio.hasClass('hover-new-default') || $portfolio.hasClass('hover-new-zooming-blur')) {
					fixItemHiddenContent($portfolio);
				}

				if ($portfolio.hasClass('hover-new-horizontal-sliding')) {
					fixHorizontalSlidingAuthor($portfolio);
				}
			}

			if ($portfolio.hasClass('version-alternative')) {
				fixItemHiddenContent($portfolio);
			}

			if ($portfolio.hasClass('no-gaps') && !$portfolio.hasClass('portfolio-style-metro')) {
				$('.portfolio-item', $portfolio).css('width', '');
				$('.portfolio-set', $portfolio).css('margin-right', '');

				let setOldWidth = $('.portfolio-set', $portfolio).outerWidth();
				let portfolioItemWidth;
				if ($portfolio.hasClass('portfolio-style-creative')) {
					portfolioItemWidth = Math.ceil($('.size-item', $portfolio).outerWidth());
				} else {
					portfolioItemWidth = Math.ceil($('.portfolio-item-size-container .portfolio-item', $portfolio).outerWidth());
					if (portfolioItemWidth == 0) {
						portfolioItemWidth = Math.ceil($('.portfolio-item:not(.double-item-squared, .double-item-horizontal)', $portfolio).outerWidth());
					}
					if (portfolioItemWidth == 0) {
						portfolioItemWidth = Math.ceil($('.portfolio-item', $portfolio).outerWidth() / 2);
					}
				}

				if (portfolioItemWidth > 0) {
					$('.portfolio-item', $portfolio).each(function () {
						if (Math.round($(this).outerWidth() / portfolioItemWidth) === 2) {
							$(this).css('width', portfolioItemWidth * 2);
						} else {
							$(this).css('width', portfolioItemWidth);
						}
					});

					let columns = Math.round(setOldWidth / portfolioItemWidth);
					let setNewWidth = columns * portfolioItemWidth;

					if (setOldWidth !== setNewWidth) {
						$('.portfolio-set', $portfolio).css('margin-right', setOldWidth - setNewWidth);
					}
				}
			}
		}

		function initExtendedPortfolioGrid() {
			if (window.tgpLazyItems !== undefined) {
				var isShowed = window.tgpLazyItems.checkGroupShowed(this, function (node) {
					initExtendedPortfolioGrid.call(node);
				});
				if (!isShowed) {
					return;
				}
			}
			var $portfolio = $(this);
			if ($portfolio.hasClass('inited')) {
				imageSizesFix($portfolio);
				return;
			}
			$portfolio.addClass('inited');
			setTimeout(function () {
				$portfolio.addClass('ready');
			}, 500);
			var $set = $('.portfolio-set', $portfolio);
			var $items = $('.portfolio-item', $set);
			var isNewsGrid = $portfolio.hasClass('news-grid');

			if ($portfolio.data('next-page') == 0) {
				$('.portfolio-load-more', $portfolio).hide();
			}

			initPortfolioSorting($portfolio);
			$portfolio.initPortfolioSorting();
			initFiltersMore($portfolio);

			if ($portfolio.hasClass('portfolio-pagination-normal') || $portfolio.hasClass('portfolio-pagination-arrows')) {
				initPortfolioPagesExtended($portfolio);
			}

			if (($portfolio.hasClass('columns-2') || $portfolio.hasClass('columns-3') || $portfolio.hasClass('columns-4')) && $portfolio.hasClass('news-grid') && $portfolio.outerWidth() > 1170) {
				$('.image-inner picture source', $set).remove();
			}

			var immediately = false;
			if (($portfolio.hasClass('extended-products-grid') && $portfolio.hasClass('portfolio-style-justified')) || $portfolio.hasClass('without-image') || $portfolio.hasClass('disable-isotope')) {
				immediately = true;
			}

			portfolioImagesLoaded($set, '.image-inner img', immediately, function () {

				if ($portfolio.hasClass('loading-animation')) {
					var itemsAnimations = $portfolio.itemsAnimations({
						itemSelector: '.portfolio-item',
						scrollMonitor: true
					});
				}

				initCircularOverlay($portfolio, $items);

				initNewsGridItems($portfolio);

				customExtendedIcons($portfolio);

				imageSizesFix($portfolio);

				var portfolioStyle = 'justified';

				if (!$portfolio.hasClass('disable-isotope')) {

					var layoutMode = 'masonry-custom';
					var titleOnPage = $portfolio.hasClass('title-on-page');

					if ($portfolio.hasClass('portfolio-style-masonry')) {
						portfolioStyle = 'masonry';
					}

					if ($portfolio.hasClass('portfolio-style-metro')) {
						layoutMode = 'metro';
						portfolioStyle = 'metro';
					}

					if (portfolioStyle != 'metro') {
						fixPortfolioWithDoubleItems($portfolio, hasOnlyDoubleItems($set));
					}

					var size_container = $('.portfolio-item-size-container .portfolio-item', $portfolio);

					var isotope_options = {
						gridType: isNewsGrid ? 'news' : 'portfolio',
						itemSelector: '.portfolio-item',
						layoutMode: layoutMode,
						itemImageWrapperSelector: '.image-inner',
						fixHeightDoubleItems: portfolioStyle == 'justified',
						fixCaption: isNewsGrid && portfolioStyle == 'justified' && titleOnPage,
						'masonry-custom': {
							columnWidth: (size_container.length > 0) ? size_container[0] : '.portfolio-item:not(.double-item)'
						},
						transitionDuration: 0
					};

					$set
						.on('layoutComplete', function (event, laidOutItems) {
							layoutComplete($portfolio, $set, laidOutItems);
						})
						.on('arrangeComplete', function (event, filteredItems) {
							arrangeComplete($portfolio, $set, portfolioStyle, filteredItems);
						})
						.isotope(isotope_options);

					itemsInit($portfolio, $items);

					if ($set.closest('.fullwidth-block').length > 0) {
						$set.closest('.fullwidth-block').bind('fullwidthUpdate', function () {
							if ($set.data('isotope')) {
								$set.isotope('layout');
								return false;
							}
						});
					} else {
						if ($set.closest('.vc_row[data-vc-stretch-content="true"]').length > 0) {
							$set.closest('.vc_row[data-vc-stretch-content="true"]').bind('VCRowFullwidthUpdate', function () {
								if ($set.data('isotope')) {
									$set.isotope('layout');
									return false;
								}
							});
						}
					}

					if (!window.gemSettings.lasyDisabled) {
						var elems = $('.portfolio-item:visible', $set);
						var items = [];
						for (var i = 0; i < elems.length; i++)
							items.push($set.isotope('getItem', elems[i]));
						$set.isotope('reveal', items);
					}

					if ($set.closest('.gem_tab').length > 0) {
						$set.closest('.gem_tab').bind('tab-update', function () {
							if ($set.data('isotope')) {
								$set.isotope('layout');
							}
						});
					}

					$(document).on('gem.show.vc.tabs', '[data-vc-accordion]', function () {
						var $tab = $(this).data('vc.accordion').getTarget();
						if ($tab.find($set).length) {
							if ($set.data('isotope')) {
								$set.isotope('layout');
							}
						}
					});

					$(document).on('gem.show.vc.accordion', '[data-vc-accordion]', function () {
						var $tab = $(this).data('vc.accordion').getTarget();
						if ($tab.find($set).length) {
							if ($set.data('isotope')) {
								$set.isotope('layout');
							}
						}
					});
				} else {
					itemsInit($portfolio, $items);
					layoutComplete($portfolio, $set, $items);
					arrangeComplete($portfolio, $set, portfolioStyle, $items);
				}

				var wishlistTarget;
				$(document).on('click', '.yith-icon a', function () {
					wishlistTarget = $(this).parents('.extended-products-grid');
				});

				var notificationPopups = $('.thegem-popup-notification-wrap', $portfolio);
				$('#page').append(notificationPopups);

				$(document).on('added_to_cart', function (e, fragments, cart_hash, this_button) {
					var parent = this_button.parents('.extended-products-grid');
					var popupSelector = parent.attr('id') ? '#style-notification-' + parent.data('style-uid') : '[data-style-uid="' + parent.data('style-uid') + '"]';
					var cartPopup = $('.thegem-popup-notification-wrap' + popupSelector + ' .thegem-popup-notification.cart');
					$('.thegem-popup-notification').removeClass('visible');
					cartPopup.addClass('visible');
					setTimeout(function () {
						cartPopup.removeClass('visible');
					}, cartPopup.data('timing'));
				});

				$(document).on('added_to_wishlist', function (t, el_wrap) {
					customExtendedIcons($portfolio);
					if (wishlistTarget) {
						$('.thegem-popup-notification').removeClass('visible');
						var popupSelector = wishlistTarget.attr('id') ? '#style-notification-' + wishlistTarget.data('style-uid') : '[data-style-uid="' + wishlistTarget.data('style-uid') + '"]';
						var wishlistPopupAdd = $('.thegem-popup-notification-wrap' + popupSelector + ' .thegem-popup-notification.wishlist-add');
						wishlistPopupAdd.addClass('visible');
						setTimeout(function () {
							wishlistPopupAdd.removeClass('visible');
						}, wishlistPopupAdd.data('timing'));
					}
				});

				$(document).on('removed_from_wishlist', function (t, el_wrap) {
					customExtendedIcons($portfolio);
					if (wishlistTarget) {
						$('.thegem-popup-notification').removeClass('visible');
						var popupSelector = wishlistTarget.attr('id') ? '#style-notification-' + wishlistTarget.data('style-uid') : '[data-style-uid="' + wishlistTarget.data('style-uid') + '"]';
						var wishlistPopupRemove = $('.thegem-popup-notification-wrap' + popupSelector + ' .thegem-popup-notification.wishlist-remove');
						wishlistPopupRemove.addClass('visible');
						setTimeout(function () {
							wishlistPopupRemove.removeClass('visible');
						}, wishlistPopupRemove.data('timing'));
					}
				});

				$(document).on('yith_wcwl_fragments_loaded', function () {
					customExtendedIcons($portfolio);
				});

				$(window).on('resize', function () {
					imageSizesFix($portfolio);
				});

				$(window).on('load', function () {
					imageSizesFix($portfolio);
				});

				if ($('.portfolio-filters', $portfolio).length) {
					$('.portfolio-filters, .portfolio-filters-resp ul li', $portfolio).on('click', 'a', function (e) {
						let thisFilter = $(this).data('filter');
						let filtersPanel = $(this).parents('.portfolio-top-panel-left');
						let filterBy = filtersPanel.data('filter-by');
						let isMultiple = filtersPanel.hasClass('multiple');

						if (thisFilter) {
							e.preventDefault();
						} else {
							return;
						}

						if (filterBy) {
							let attrData = $portfolio.data('portfolio-filter-attributes') ? $portfolio.data('portfolio-filter-attributes') : [];
							if (!attrData[filterBy]) {
								attrData[filterBy] = [];
							}

							if (thisFilter == '*') {
								delete attrData[filterBy]
								filtersPanel.find('a').removeClass('active');
								$(this).addClass('active');
							} else if ($(this).hasClass('active')) {
								$(this).removeClass('active');
								if (attrData[filterBy]) {
									const index = attrData[filterBy].indexOf(thisFilter.substr(1));
									if (index > -1) {
										attrData[filterBy].splice(index, 1);
									}
									if (attrData[filterBy].length === 0) {
										delete attrData[filterBy];
										filtersPanel.find('a.all').addClass('active');
									}
								}
							} else {
								if (!isMultiple) {
									filtersPanel.find('a').removeClass('active');
									attrData[filterBy] = [];
								} else {
									filtersPanel.find('a.all').removeClass('active');
								}
								$(this).addClass('active');
								attrData[filterBy].push(thisFilter.substr(1));
							}

							filterPortfolioAttributes($portfolio, attrData);
						} else {
							let filtersArr = $portfolio.data('portfolio-filter') ? $portfolio.data('portfolio-filter') : [];

							if (thisFilter === '*') {
								filtersArr = [];
								filtersPanel.find('a').removeClass('active');
								$(this).addClass('active');
							} else if ($(this).hasClass('active')) {
								$(this).removeClass('active');
								if (filtersArr.includes(thisFilter.substr(1))) {
									const index = filtersArr.indexOf(thisFilter.substr(1));
									if (index > -1) {
										filtersArr.splice(index, 1);
									}
									if (filtersArr.length == 0) {
										filtersPanel.find('a.all').addClass('active');
									}
								}
							} else {
								if (!isMultiple) {
									filtersPanel.find('a').removeClass('active');
									filtersArr = [];
								} else {
									filtersPanel.find('a.all').removeClass('active');
								}
								$(this).addClass('active');
								filtersArr.push(thisFilter.substr(1));
							}

							filterPortfolioExtended($portfolio, filtersArr);
						}

						if ($('.portfolio-filters-resp', $portfolio).length > 0 && typeof $.fn.dlmenu === 'function') {
							$('.portfolio-filters-resp', $portfolio).dlmenu('closeMenu');
						}

						return false;
					});
				}

				if ($('.portfolio-filter-tabs', $portfolio).length) {

					if ($('.portfolio-filter-tabs-list-tab.active', $portfolio).data('filter') == 'categories') {
						$portfolio.data('portfolio-filter', $('.portfolio-filter-tabs-list-tab.active', $portfolio).data('filter-cat'));
					} else {
						$portfolio.data('portfolio-filter-status', [$('.portfolio-filter-tabs-list-tab.active', $portfolio).data('filter')]);
					}

					$('.portfolio-filter-tabs-list-tab', $portfolio).on('click', function (e) {
						if (!$(this).hasClass('active')) {
							$('.portfolio-filter-tabs-list-tab', $portfolio).removeClass('active');
							$(this).addClass('active');
							if ($(this).data('filter') == 'categories') {
								$portfolio.data('portfolio-filter', $(this).data('filter-cat'));
								$portfolio.data('portfolio-filter-status', '');
							} else {
								$portfolio.data('portfolio-filter', '');
								$portfolio.data('portfolio-filter-status', [$(this).data('filter')]);
							}
							$portfolio.data('current-tab', $(this).data('num'));
							$portfolio.data('next-page', 1);
							var uid = $portfolio.data('portfolio-uid');
							portfolioLoadCoreRequest($portfolio);
						}
					});

					if ($portfolio.hasClass('tabs-preloading') && !isEditor) {
						$('.portfolio-filter-tabs-list-tab', $portfolio).each(function () {
							var $params = [];
							if ($(this).data('filter') == 'categories') {
								$params['portfolio-filter'] = $(this).data('filter-cat');
								$params['portfolio-filter-status'] = '';
							} else {
								$params['portfolio-filter'] = '';
								$params['portfolio-filter-status'] = [$(this).data('filter')];
							}
							$params['current-tab'] = $(this).data('num');
							$params['next-page'] = 1;
							portfolioLoadCoreRequest($portfolio, true, $params)
						})
					}
				}

				if ($portfolio.hasClass('filters-preloading') && !isEditor) {
					$('.portfolio-filters a', $portfolio).each(function () {
						var $params = [];
						let filtersPanel = $(this).parents('.portfolio-top-panel-left');
						let filterBy = filtersPanel.data('filter-by');
						let thisFilter = $(this).data('filter');

						if (!thisFilter) {
							return;
						}

						if (filterBy) {
							let attrData = []
							attrData[filterBy] = [thisFilter.substr(1)];
							$params['portfolio-filter-attributes'] = attrData;
						} else {
							$params['portfolio-filter'] = thisFilter.substr(1);
						}
						$params['next-page'] = 1;
						portfolioLoadCoreRequest($portfolio, true, $params)
					})
				}

				$portfolio.initPortfolioFiltersList();

				if ($('.portfolio-selected-filters', $portfolio).length) {

					if ($('.portfolio-filters-list.native-ajax-filters', $portfolio).length) {
						$('.portfolio-selected-filters', $portfolio).on('click', '.delete-filter', function () {

							var $this = $(this),
								href;

							href = window.location.href;
							href = href.replace(/\/page\/\d+/, "").replace("&amp;", '&').replace("%2C", ',');

							var $filtersList = $('.portfolio-filters-list', $portfolio);
							var $selectedFilters = $('.portfolio-selected-filters', $portfolio);
							var item = $this.closest('.portfolio-selected-filter-item');
							if (item.hasClass('category')) {
								// href = updateUrlParams(href, 'category', '');
								// var params = '',
								// shopUrl = $('input.shop-page-url').val();
								// if (href.indexOf('?') > 1) {
								// 	params = '?'+href.split("?")[1];
								// }
								// nativeAjaxFiltering($portfolio, shopUrl+params);
							} else if (item.hasClass('attribute')) {

								var attr = 'filter_' + item.data("attr"),
									filter = item.data("filter"),
									params,
									queryParams = new URLSearchParams(window.location.search);
								for (var p of queryParams) {
									if (p[0].includes(attr)) {
										params = p[1].split(",");
										var index = params.indexOf(filter);
										if (index > -1) {
											params.splice(index, 1);
										}
									}
								}
								href = updateUrlParams(href, attr, params.toString());
								nativeAjaxFiltering($portfolio, href);

							} else if (item.hasClass('price')) {
								href = updateUrlParams(href, 'min_price', '');
								href = updateUrlParams(href, 'max_price', '');
								nativeAjaxFiltering($portfolio, href);
							} else if (item.hasClass('search')) {
								href = updateUrlParams(href, 's', '');
								nativeAjaxFiltering($portfolio, href);
							}
						}).on('click', '.clear-filters', function (e) {
							var shopUrl = $('input#shop-page-url').val();
							nativeAjaxFiltering($portfolio, shopUrl);
						});
					} else {
						let $this = $portfolio,
							$filtersList = $('.portfolio-filters-list', $portfolio);
						if (!$filtersList.length) {
							$this = $('.extended-posts-filter[data-portfolio-uid="' + $portfolio.data('portfolio-uid') + '"]');
							$filtersList = $this.find('.portfolio-filters-list');
						}

						$('.portfolio-selected-filters', $portfolio).on('click', '.delete-filter', function () {
							var $selectedFilters = $('.portfolio-selected-filters', $portfolio);
							var item = $(this).closest('.portfolio-selected-filter-item');
							if (item.hasClass('category')) {
								if ($filtersList.find('a.all[data-filter-type="category"]').length) {
									$filtersList.find('a.all[data-filter-type="category"]').click();
								} else {
									$selectedFilters.find('.portfolio-selected-filter-item.category').remove();
									clearFilters($portfolio);
								}
							} else if (item.hasClass('attribute')) {
								if ($filtersList.find('.portfolio-filter-item.' + item.data("attr")).hasClass('multiple')) {
									$filtersList.find('a[data-attr="' + item.data("attr") + '"][data-filter="' + item.data("filter") + '"]').click();
								} else {
									$filtersList.find('a.all[data-attr="' + item.data("attr") + '"]').click();
								}
							} else if (item.hasClass('price')) {
								if (item.find('.slider-range').data('attr')) {
									let attr = item.find('.slider-range').data('attr');
									let min = $this.find('.slider-range[data-attr="' + item.data("attr") + '"]').slider("option", "min");
									let max = $this.find('.slider-range[data-attr="' + item.data("attr") + '"]').slider("option", "max");
									$this.find('.slider-range[data-attr="' + item.data("attr") + '"]').slider("values", [min, max]);
									$selectedFilters.find('.portfolio-selected-filter-item.price[data-attr="' + item.data("attr") + '"]').remove();
									let attrData = $this.data('portfolio-filter-attributes') ? $this.data('portfolio-filter-attributes') : [];
									if (attrData[attr + '__range']) {
										delete attrData[attr + '__range'];
									}
									filterPortfolioAttributes($portfolio, attrData);
								} else {
									let min = $this.find(".slider-range").slider("option", "min");
									let max = $this.find(".slider-range").slider("option", "max");
									$this.find(".slider-range").slider("values", [min, max]);
									$selectedFilters.find('.portfolio-selected-filter-item.price').remove();
									filterPortfolioPrice($portfolio, '');
								}
							} else if (item.hasClass('status')) {
								$filtersList.find('a[data-filter-type="status"][data-filter="' + item.data("filter") + '"]').click();
							} else if (item.hasClass('search')) {
								$this.find(".portfolio-search-filter .portfolio-search-filter-form input").val('');
								$selectedFilters.find('.portfolio-selected-filter-item.search').remove();
								filterPortfolioSearch($portfolio, '');
							}

							scrollTopPortfolio($this);

							if (!$filtersList.length) {
								$selectedFilters.find('.clear-filters').click();
							}

							$filtersList.find('.filters-apply-button .gem-button').click();
						}).on('click', '.clear-filters', function () {
							$this.find('.portfolio-filter-item:not(.reload) a').removeClass('active');
							$this.find('.portfolio-filter-item:not(.reload) a.all').addClass('active');
							$this.find(".slider-range").each(function (){
								var min = $(this).slider("option", "min");
								var max = $(this).slider("option", "max");
								$(this).slider("values", [min, max]);
							})
							$this.find(".portfolio-search-filter input").val('');
							$portfolio.find(".portfolio-selected-filters .portfolio-selected-filter-item:not(.clear-filters)").remove();
							clearFilters($portfolio);
							$filtersList.find('.selector-title span.name').each(function () {
								if ($(this).data('title')) {
									$(this).html('<span data-filter="*">' + $(this).data('title') + '</span>');
								}
							});
							scrollTopPortfolio($this);
						});
					}
				}

				categoryFilterClick($portfolio);

				$portfolio.on('click', '.info a:not(.zilla-likes, .additional-meta)', function () {
					var slug = $(this).data('slug') || '';

					if (slug != '') {
						if ($('.portfolio-filters', $portfolio).length) {
							$('.portfolio-filters a[data-filter=".' + slug + '"]').click();
						} else {
							filterPortfolioExtended($portfolio, slug);
						}
						return false;
					}
				});

				$portfolio.on('click', 'a.additional-meta', function () {
					let filterType = $(this).data('filter-type');
					let attr = $(this).data('attr');
					let filter = $(this).data('filter');

					if (!$('.portfolio-top-panel.filter-type-default', $portfolio).length) {
						$portfolio.data('portfolio-filter', '');
					}
					$portfolio.data('portfolio-filter-attributes', '');
					$portfolio.data('portfolio-filter-status', '');
					$portfolio.data('portfolio-filter-price', '');
					$portfolio.data('portfolio-filter-search', '');
					$portfolio.data('next-page', 1);

					if (filterType === 'taxonomies') {
						if ($('.portfolio-filters.filter-by-' + attr + ' a[data-filter=".' + filter + '"]', $portfolio).length) {
							$('.portfolio-filters.filter-by-' + attr + ' a', $portfolio).removeClass('active');
							$('.portfolio-filters.filter-by-' + attr + ' a[data-filter=".' + filter + '"]', $portfolio).addClass('active');
							if (attr === 'category' || attr === 'thegem_portfolios') {
								filterPortfolioExtended($portfolio, filter);
								return;
							}
						}
						attr = 'tax_' + attr;
					}

					if ($('.portfolio-filters-extended a[data-attr="' + attr + '"][data-filter="' + filter + '"]', $portfolio).length) {
						let $filtersList = $('.portfolio-filters-list', $portfolio);
						if (!$filtersList.length) {
							$filtersList = $('.extended-posts-filter[data-portfolio-uid="' + $portfolio.data('portfolio-uid') + '"] .portfolio-filters-list');
						}
						$filtersList.find('.portfolio-filter-item:not(.reload) a').removeClass('active');
						$filtersList.find('.portfolio-filter-item:not(.reload) a.all').addClass('active');
						$portfolio.find(".portfolio-search-filter input").val('');
						$portfolio.find(".portfolio-selected-filters .portfolio-selected-filter-item:not(.clear-filters)").remove();
						$('.portfolio-filters-extended a[data-attr="' + attr + '"][data-filter="' + filter + '"]', $portfolio).click();
					} else {
						let $selectedFilters = $('.portfolio-selected-filters', $portfolio);
						$selectedFilters.find('.portfolio-selected-filter-item[data-attr="' + attr + '"]').remove();
						$selectedFilters.append('<div class="portfolio-selected-filter-item attribute" data-attr="' + attr + '" data-filter="' + filter + '">' + $(this).html() + '<i class="delete-filter"></i></div>');
						let attrData = [];
						attrData['' + attr] = [filter];
						scrollTopPortfolio($portfolio, true);
						filterPortfolioAttributes($portfolio, attrData);
					}
				});

				$('.portfolio-load-more', $portfolio).on('click', function () {
					portfolioLoadCoreRequest($portfolio);
				});

				if ($portfolio.hasClass('reduce-size') && $portfolio.data('next-page') !== 0) {
					let event = typeof TheGemDelayJavaScript == 'undefined' ? 'scroll' : 'thegem-load';
					window.addEventListener(event, function() {
						if ($portfolio.hasClass('reduce-size')) {
							portfolioLoadCoreRequest($portfolio);
						}
					});
				}

				if ($portfolio.hasClass('portfolio-pagination-scroll')) {
					initPortfolioScrollNextPage($portfolio);
				}

				if (!$portfolio.hasClass('news-grid') && !$portfolio.hasClass('extended-products-grid')) {
					$portfolio.on('click', '.portfolio-item .image .overlay, .portfolio-item .wrap > .caption', function (event) {

						if ($portfolio.hasClass('caption-position-hover') && $(this).parents('.portfolio-item').hasClass('hover-effect')) {
							if (!$(this).parents('.portfolio-item').hasClass('hover-effect-active')) {
								return
							}
						}
						var $target = $(event.target),
							$icons = $target.closest('.portfolio-item').find('.portfolio-icons'),
							$product_link = $target.closest('.portfolio-item').find('.product-link'),
							$portfolio_link = $target.closest('.portfolio-item').find('.portfolio-item-link');

						if ($target.hasClass('portfolio-item-link') || $target.hasClass('product-link') || $target.hasClass('add_to_cart_button') ||
							$target.closest('.add_to_cart_button').length || $target.closest('.icon').length || $target.closest('.socials-sharing').length ||
							$target.closest('.post-footer-sharing').length || $target.closest('.quick-view-button').length || $target.closest('.set').length ||
							$target.closest('.read-more-button').length) {
							return;
						}

						if (window.gemSettings.isTouch) {
							if ($(this).children('.product-link').length) {
								window.location.href = $product_link.attr('href');
								return false;
							}
							if ($target.closest('.overlay').length && !$target.closest('.portfolio-item').hasClass('touch-hover')) {
								$target.closest('.portfolio-item').addClass('touch-hover');
								$('*').one('click', function (event) {
									if (!$(event.target).closest('.portfolio-item').is($target.closest('.portfolio-item'))) {
										$target.closest('.portfolio-item').removeClass('touch-hover');
									}
								});
								return false;
							}
						}

						if ($product_link.length) {
							window.open($product_link.attr('href'), "_self");
						} else if ($portfolio_link.length) {
							if ( $portfolio_link.hasClass('self-link')) {
								window.open($portfolio_link.attr('href'), $portfolio_link.attr('target'));
							} else {
								$portfolio_link.click();
							}
						} else if ($('.icon.self-link', $icons).length) {
							window.open(
								$('.icon.self-link', $icons).attr('href'),
								$('.icon.self-link', $icons).attr('target')
							);
						} else if ($('.icon.bottom-product-link', $icons).length) {
							window.open($('.icon.bottom-product-link', $icons).attr('href'), "_self");
						} else {
							var $firstIcon = $('.icon', $icons).first();

							if ($firstIcon.hasClass('inner-link') || $firstIcon.hasClass('outer-link')) {
								window.open(
									$firstIcon.attr('href'),
									$firstIcon.attr('target')
								);
							} else {
								$firstIcon.click();
							}
						}
					});
				}

				if ($portfolio.hasClass('next-page-preloading') && $portfolio.data('next-page') > 0 && !isEditor) {
					if ($portfolio.hasClass('portfolio-pagination-normal')) {
						portfolioLoadCoreRequest($portfolio, true, {'next-page': 1});
					}
					portfolioLoadCoreRequest($portfolio, true);
				}

				if ($('.product-variations:not(.simple)', $portfolio).length) {
					$('.product-variations:not(.simple)', $portfolio).each(function () {
						initVariations($(this));
					});
				}
			});

			if (typeof $.fn.dlmenu === 'function') {
				$('.portfolio-filters-resp', $portfolio).dlmenu({
					animationClasses: {
						classin: 'dl-animate-in',
						classout: 'dl-animate-out'
					}
				});
			}
		}

		function initVariations($form) {
			let $price = $form.closest('.portfolio-item').find('.product-price'),
				variablePrice = $price.html(),
				$selectOptionsWrap = $form.closest('.portfolio-item').find('span.cart:not(.swatches-button)'),
				$cartWrap = $form.closest('.portfolio-item').find('span.cart.swatches-button'),
				$cart = $cartWrap.find('a'),
				$image = $form.closest('.portfolio-item').find('.image'),
				$productImg = $form.closest('.portfolio-item').find('img:not(.variation-image)'),
				$variationImg = $form.closest('.portfolio-item').find('.variation-image'),
				hideVariation = () => {
					$price.html(variablePrice);
					$cartWrap.hide();
					$selectOptionsWrap.show().insertBefore($cartWrap);
					$productImg.show();
					$variationImg.hide();
					$variationImg.attr('src', '');
					$variationImg.attr('srcset', '');
				};

			hideVariation();

			$form.on('hide_variation', function (e) {
				hideVariation();
			});

			$form.on('show_variation', function (e, variation) {
				if (variation.is_purchasable) {
					if (variation.is_in_stock) {
						if (variation.price_html != '') {
							$price.html(variation.price_html);
						}
						$selectOptionsWrap.hide();
						$cart.data('variation_id', variation.variation_id);
						let variationsArray = $form.serializeArray();
						let variations = {};
						$.each(variationsArray, function () {
							variations[this.name] = this.value || "";
						});
						$cart.data('variation', variations);
						$cartWrap.show().insertBefore($selectOptionsWrap);
					} else {
						$price.html('<div class="price">'+variation.availability_html+'</div>');
					}

					if (variation.image && variation.image.src) {
						$image.prepend('<div class="preloader-spin-new"></div>');
						$variationImg.attr('src', variation.image.src);
						$variationImg.attr('height', variation.image.src_h);
						$variationImg.attr('width', variation.image.src_w);
						$variationImg.attr('srcset', variation.image.srcset);
						$variationImg.attr('sizes', variation.image.sizes);
						$variationImg.attr('title', variation.image.title);
						$variationImg.attr('data-caption', variation.image.caption);
						$variationImg.attr('alt', variation.image.alt);
					} else {
						$productImg.show();
						$variationImg.hide();
						$variationImg.attr('src', '');
						$variationImg.attr('srcset', '');
					}
					$form.closest('.portfolio-item').find('.image .variations-notification').html('').hide();
				} else {
					hideVariation();
					if ($form.find('.single_variation > p').length) {
						$form.closest('.portfolio-item').find('.image .variations-notification').html('<span class="close"></span>'+$form.find('.single_variation > p').html()).css('display', 'flex');
					}
				}
			});

			$form.on('reset_data', function (e, variation) {
				$form.closest('.portfolio-item').find('.image .variations-notification').html('').hide();
				setTimeout(checkVariables.bind(this, $form), 100);
			});

			$cart.on('click', function (e) {

				if ($cart.data('product_id')) {
					e.preventDefault();

					let $thisButton = $(this);

					let data = {
						action: 'woocommerce_ajax_add_to_cart'
					};

					// Fetch changes that are directly added by calling $thisbutton.data( key, value )
					$.each( $thisButton.data(), function( key, value ) {
						data[ key ] = value;
					});

					$(document.body).trigger('adding_to_cart', [$thisButton, data]);

					$.ajax({
						type: 'post',
						url: wc_add_to_cart_params.ajax_url,
						data: data,
						success: function (response) {
							if ( ! response ) {
								return;
							}

							if ( response.error && response.product_url ) {
								window.location = response.product_url;
								return;
							}

							$(document.body).trigger('added_to_cart', [response.fragments, response.cart_hash, $thisButton]);
						},
					});

					return false;
				}
			});

			$variationImg.on('load', function () {
				$productImg.hide();
				$variationImg.show();
				$image.find('.preloader-spin-new').remove();
			});

			$('.variations-notification').on('click', '.close', function () {
				$(this).parent().hide();
			})
		}

		function checkVariables($form) {
			if ($form.find('.wc-no-matching-variations').length) {
				$form.closest('.portfolio-item').find('.image .variations-notification').html('<span class="close"></span>'+$form.find('.wc-no-matching-variations').html()).css('display', 'flex');
			}
		}

		function layoutComplete($portfolio, $set, laidOutItems) {

			if ($portfolio.hasClass('news-grid')) {

				if (!$portfolio.hasClass('disable-isotope')) {
					var setWidth = $set[0].offsetWidth;

					for (var i = 0; i < laidOutItems.length; i++) {
						var item = laidOutItems[i];

						if (item.element.classList.contains('double-item-style-alternative')) {
							var itemWidth = item.element.offsetWidth;

							if (item.position.x != 0 && item.position.x + itemWidth > setWidth - 4) {
								item.element.classList.add('right-item');
							} else {
								item.element.classList.remove('right-item');
							}
						}
					}
				}
			}
		}

		function arrangeComplete($portfolio, $set, portfolioStyle) {

			if ($portfolio.hasClass('products')) {
				if ($portfolio.hasClass('columns-1') && $portfolio.hasClass('caption-position-zigzag')) {
					$('.portfolio-item .image', $portfolio).removeClass('col-md-push-4 col-md-push-5');
					$('.portfolio-item .caption', $portfolio).removeClass('col-md-pull-8 col-md-pull-7');

					$('.portfolio-item', $portfolio).each(function (i){
						if (i % 2 == 1) {
							if ($(this).hasClass('portfolio-1x-fullwidth-item')) {
								$(this).find('.image').addClass('col-md-push-4');
								$(this).find('.caption').addClass('col-md-pull-8');
							} else {
								$(this).find('.image').addClass('col-md-push-5');
								$(this).find('.caption').addClass('col-md-pull-7');
							}
						}
					})
				}
			}

			if ($portfolio.hasClass('news-grid')) {

				if (typeof $.fn.buildSimpleGalleries === 'function') {
					$set.buildSimpleGalleries();
				}

				if (typeof $.fn.updateSimpleGalleries === 'function') {
					$set.updateSimpleGalleries();
				}
			}

			if (portfolioStyle != 'metro') {
				var onlyDoubleItems = hasOnlyDoubleItems($set);

				if (onlyDoubleItems != $portfolio.hasClass('porfolio-even-columns')) {
					fixPortfolioWithDoubleItems($portfolio, onlyDoubleItems);

					if ($set.data('isotope')) {
						$set.isotope('layout');
					}
				}
			}

			$portfolio.closest('.portfolio-preloader-wrapper').prev('.preloader').remove();
		}

		function itemsInit($portfolio, $items) {

			let $set = $('.portfolio-set', $portfolio);

			if ($portfolio.hasClass('products')) {

				if ($portfolio.hasClass('title-on-hover') || $portfolio.hasClass('hover-gradient') || $portfolio.hasClass('hover-circular')) {
					$('.portfolio-icons-inner > a:not(.added_to_cart)', $items).addClass('icon');
				}

				$('.product-bottom .yith-wcwl-wishlistexistsbrowse a', $items).addClass('icon wishlist');

				// Fix problem with YITH loaded by ajax
				$('.product-bottom .yith-wcwl-add-to-wishlist', $items).each(function () {
					var wishlistItem = $(this);
					var classList = $(this).attr('class').split(/\s+/);
					$.each(classList, function (index, item) {
						var a = item.indexOf("wishlist-fragment");
						if (a !== -1 && a > 0) {
							var res = item.slice(0, a);
							wishlistItem.removeClass(item).addClass(res + ' wishlist-fragment');
						}
					});
				});
			}

			if ($portfolio.hasClass('news-grid') && !$portfolio.hasClass('title-on-page')) {
				var needLayout = false;

				$items.each(function () {

					if ($(this).innerWidth() < 260 || $(this).innerHeight() < 260) {
						if (!$(this).hasClass('small-item')) {
							$(this).addClass('small-item');
							needLayout = true;
						}
					} else {
						if ($(this).hasClass('small-item')) {
							$(this).removeClass('small-item');
							needLayout = true;
						}
					}

					if ($('mediaelementwrapper', this).length > 0) {
						$('mediaelementwrapper', this).trigger('resize');
					}
				})

				if (needLayout && $set.data('isotope')) {
					$set.isotope('layout');
				}
			}

			if ( $portfolio.hasClass('portfolio-grid') && $portfolio.hasClass('disable-isotope') && !$portfolio.hasClass('portfolio-list') && !$portfolio.hasClass('list-style') && !$portfolio.hasClass('news-grid')) {

				$items.on('mouseenter', function () {
					$(this).addClass('hide-likes');
					if ($portfolio.hasClass('portfolio-style-creative') && $(this).hasClass('double-item')) {
						$(this).find('.wrap .image').css('height', '').css('flex', '').css('height', $(this).find('.wrap .image').outerHeight()).css('flex', 'none');
					}
					$(this).find('.wrap').css('height', '').css('height', $(this).find('.wrap').outerHeight());
					$(this).removeClass('hide-likes');
				})
			}

			if ($portfolio.hasClass('loading-animation')) {
				if (scrollTopPromise) {
					scrollTopPromise.then(function () {
						$portfolio.itemsAnimations('instance').show($items)
					});
				} else {
					$portfolio.itemsAnimations('instance').show($items);
				}
			}

			if (window.tgpLazyItems !== undefined) {
				window.tgpLazyItems.scrollHandle();
			}

			$('img.image-hover', $items).show();

			if ($('.gem-video-portfolio.run-embed-video', $items).length) {
				initApiVideos($('.gem-video-portfolio.run-embed-video', $items));
			}

			if ( $portfolio.hasClass('portfolio-grid')) {
				$items.each(function (){
					if ($(this).hasClass('appearance-type-gallery')) {
						initPortfolioGallery($(this));
					}

					if ($(this).find('.thegem-te-loop-featured-media.appearance-type-gallery')) {
						initPortfolioGallery($(this));
					}
				});
			}

			$('.details span.format-locale', $items).each(function (){
				let loc = $(this).data('locale').replace('_', '-');
				let num = parseFloat($(this).html());
				$(this).html(num.toLocaleString(loc));
			});
		}

		let autoScrolldelay = 0;

		function initPortfolioGallery($item) {
			if ($item.hasClass('inited')) return;
			let $slider = $item.find(".portfolio-image-slider"),
				$slides = $item.find(".slide"),
				$btns = $item.find(".btn"),
				curSlide = 0,
				maxSlide = $slides.length - 1,
				autoplay;

			$slides.each(function (i){
				$(this).css('transform', `translateX(${i * 100}%)`).css('opacity', '');
			});

			$btns.on('click', function (){
				changeSlide($(this).data('direction'));
			});

			const changeSlide = (direction) => {
				if (direction === "prev") {
					curSlide--;
					if (curSlide < 0 ) {
						let moveSlide = $slider.find(".slide")[maxSlide];
						$(moveSlide).css('transform', 'translateX(-100%)');
						$slider.prepend(moveSlide);
						curSlide = 0;
					}
				} else {
					curSlide++;
					if (curSlide > maxSlide) {
						let moveSlide = $slider.find(".slide")[0];
						$(moveSlide).css('transform', 'translateX(100%)');
						$slider.append(moveSlide);
						curSlide = maxSlide;
					}
				}
				setTimeout(function (){
					$slider.find(".slide").each(function (i){
						$(this).css('transform', `translateX(${100 * (i - curSlide)}%)`);
					});
				}, 0);

			}

			if ($slider.hasClass('autoscroll')) {
				setTimeout(function (){
					let interval = $slider.data('interval');
					autoplay = setInterval(() => changeSlide('next'), interval);

					$item.on('mouseenter', function (){
						clearInterval(autoplay);
					}).on('mouseleave', function (){
						autoplay = setInterval(() => changeSlide('next'), interval);
					})
				}, autoScrolldelay * 1200);
				autoScrolldelay++;
			}
			$item.addClass('inited');
		}

		function filtersListMobileView(filtersList, breakpoint) {
			if ($(window).outerWidth() < breakpoint) {
				if (filtersList.hasClass('style-standard')) {
					filtersList.addClass('style-standard-mobile');
				} else if (filtersList.hasClass('style-sidebar')) {
					filtersList.addClass('style-sidebar-mobile');
				}
			} else {
				if (filtersList.hasClass('style-standard')) {
					filtersList.removeClass('style-standard-mobile');
				} else if (filtersList.hasClass('style-sidebar')) {
					filtersList.removeClass('style-sidebar-mobile');
				}
			}
		}

		function nativeAjaxFiltering($portfolio, href) {
			scrollTopPortfolio($portfolio);
			href = updateUrlParams(href, 'page', '');
			href = updateUrlParams(href, 'style_uid', $portfolio.data('style-uid'));
			href = updateUrlParams(href, 'ajax_filters', '1');
			href = href.replace(/\/page\/\d+/, "").replace("&amp;", '&').replace("%2C", ',');

			addFilterLoader($portfolio);

			$.ajax({
				url: href,
				type: "POST",
				success: function (response) {
					href = updateUrlParams(href, 'ajax_search', '');
					href = updateUrlParams(href, 'ajax_filters', '');
					href = updateUrlParams(href, 'style_uid', '');
					var $response = $(response);
					if ($response.find('.extended-products-grid.main-loop-grid').length) {
						let $wrapper = $portfolio.closest('.portfolio-preloader-wrapper');
						$wrapper.html($response.find('.extended-products-grid.main-loop-grid'))
							.find('.count').each(function () {
							$(this).html($(this).html().replace('(', '').replace(')', '')).css('opacity', 1);
						});

						$('.extended-products-grid').initExtendedPortfolioGrids();
						refreshPriceSlider();
						refreshSelect2();
						$('.gem-attribute-selector', $wrapper).gemWooAttributeSelector();
						$('.product-variations', $wrapper).each(function () {
							if (typeof wc_variation_form === 'function') {
								$(this).wc_variation_form();
							}
						});
						history.replaceState(null, null, href);
					} else {
						window.location.href = href;
					}
				}
			});
		}

		function updateUrlParams(uri, key, value) {
			var params = '';
			if (uri.indexOf('?') > 1) {
				params = uri.split("?")[1];
			}
			var queryParams = new URLSearchParams(params);
			if (value !== '') {
				queryParams.set(key, value)
			} else {
				queryParams.delete(key);
			}

			if (queryParams.toString().length > 0) {
				return uri.split("?")[0] + "?" + queryParams.toString();
			} else {
				return uri.split("?")[0];
			}
		}

		function refreshSelect2() {
			var select2 = $('select.woocommerce-widget-layered-nav-dropdown');
			if (select2.length && jQuery().selectWoo) {
				select2.each(function () {
					$(this).selectWoo({
						placeholder: $(this).find('option').eq(0).text(),
						minimumResultsForSearch: 5,
						width: '100%',
						allowClear: typeof $(this).attr('multiple') != 'undefined' && $(this).attr('multiple') == 'multiple' ? 'false' : 'true'
					});
				});
			}
			$('body').children('span.select2-container').remove();
		}

		function refreshPriceSlider() {
			var price_slider = $('.price_slider');
			if (price_slider.length) {
				if (typeof woocommerce_price_slider_params === 'undefined') {
					return false;
				}

				$('input#min_price, input#max_price').hide();
				$('.price_slider, .price_label').show();

				var min_price = $('.price_slider_amount #min_price').data('min'),
					max_price = $('.price_slider_amount #max_price').data('max'),
					current_min_price = parseInt($('.price_slider_amount #min_price').val() ? $('.price_slider_amount #min_price').val() : min_price, 10),
					current_max_price = parseInt($('.price_slider_amount #max_price').val() ? $('.price_slider_amount #max_price').val() : max_price, 10);

				$('.price_slider').slider({
					range: true,
					animate: true,
					min: min_price,
					max: max_price,
					values: [current_min_price, current_max_price],
					create: function () {
						$('.price_slider_amount #min_price').val(current_min_price);
						$('.price_slider_amount #max_price').val(current_max_price);
						$(document.body).trigger('price_slider_create', [current_min_price, current_max_price]);
					},
					slide: function (event, ui) {
						$('input#min_price').val(ui.values[0]);
						$('input#max_price').val(ui.values[1]);
						$(document.body).trigger('price_slider_slide', [ui.values[0], ui.values[1]]);
					},
					change: function (event, ui) {
						$(document.body).trigger('price_slider_change', [ui.values[0], ui.values[1]]);
					},
					stop: function (event, ui) {
						var href = window.location.href;
						href = href.replace(/\/page\/\d+/, "").replace("&amp;", '&').replace("%2C", ',');

						href = updateUrlParams(href, 'min_price', ui.values[0]);
						href = updateUrlParams(href, 'max_price', ui.values[1]);

						let $portfolio = $(this).closest('.portfolio.extended-products-grid');
						$('.widget_price_filter', $portfolio).removeClass('yith-wcan-list-price-filter');
						if ($('.portfolio-filters-list', $portfolio).hasClass('native-ajax-filters')) {
							nativeAjaxFiltering($portfolio, href);
						} else {
							window.location.href = href;
						}
					}
				});
			}
			$('.price_slider_amount .button').addClass('gem-button gem-button-style-outline gem-button-size-tiny');
		}

		function categoryFilterClick($portfolio) {
			if (!$portfolio.hasClass('extended-portfolio-grid')) {
				$portfolio = $portfolio.parents('.extended-portfolio-grid');
			}
			$('.categories', $portfolio).on('click', 'a', function (e) {
				var thisFilter = $(this).data('filter');
				if (!thisFilter) return;
				e.preventDefault();
				var $thisItem = $('.portfolio-filters-area', $portfolio).find('a[data-filter-type="category"][data-filter="' + thisFilter + '"]');

				if ($thisItem.length) {
					$thisItem.click();
				} else {
					var $selectedFilters = $('.portfolio-selected-filters', $portfolio);
					$selectedFilters.find('.portfolio-selected-filter-item.category').remove();
					if (thisFilter !== '*') {
						$selectedFilters.append('<div class="portfolio-selected-filter-item category" data-filter="' + thisFilter + '">' + $(this).html() + '<i class="delete-filter"></i></div>');
						filterPortfolioExtended($portfolio, thisFilter);
					} else {
						filterPortfolioExtended($portfolio, '');
					}
				}
			});
		}

		function closeFiltersPopup($portfolio) {
			$('.portfolio').removeClass('filters-opened');
			$('.portfolio-filters-outer', $portfolio).addClass('close-animation').removeClass('visible');
			setTimeout(function () {
				$('.portfolio-filters-outer', $portfolio).removeClass('close-animation');
				$('.progress-bar', $portfolio).hide();
			}, 300);

		}

		function toggleNewsGridSharing(button) {
			var $meta = $(button).closest('.grid-post-meta-inner'),
				$likes = $('.grid-post-meta-comments-likes', $meta),
				$icons = $('.portfolio-sharing-pane', $meta);

			if ($meta.hasClass('active')) {
				$meta.removeClass('active');

				$('.socials-sharing', $meta).animate({
					width: 'toggle'
				}, 300, function () {
					$meta.removeClass('animation');
				});
			} else {
				$meta.css('min-width', $meta.outerWidth());

				$meta.addClass('active animation');

				$('.socials-sharing', $meta).animate({
					width: 'toggle'
				}, 200);
			}
		}

		function customExtendedIcons($portfolio) {
			if (!$portfolio.hasClass('extended-portfolio-grid')) {
				$portfolio = $portfolio.parents('.extended-portfolio-grid');
			}
			$portfolio.find('.post-meta-likes, .portfolio-likes, .portfolio-list-likes').each(function () {
				if ($(this).find('i').length) {
					if (!$(this).find('a').children('i').length) {
						var icon = $(this).children('i');
						$(this).find('a').prepend(icon.clone());
					}
				} else if ($(this).find('svg').length) {
					if (!$(this).find('a').children('svg').length) {
						var icon_svg = $(this).children('svg');
						$(this).find('a').prepend(icon_svg.clone());
					}
				}
			});

			$portfolio.find('.comments-link').each(function () {
				if ($(this).find('i').length) {
					var icon = $(this).find('i');
					$(this).find('i').remove();
					$(this).find('a').prepend(icon);
				} else if ($(this).find('svg').length) {
					var icon_svg = $(this).find('svg');
					$(this).find('svg').remove();
					$(this).find('a').prepend(icon_svg);
				}
			});

			$portfolio.find('.yith-icon a').css('transition', 'none');
			setTimeout(function () {
				$portfolio.find('.yith-icon a').css('transition', '');
			}, 300);

			if ($portfolio.hasClass('extended-products-grid')) {
				$portfolio.find('.yith-icon').each(function () {
					if (!$(this).find('a').hasClass('icon')) {
						var addIcon = $(this).children('.add-wishlist-icon').clone();
						var addedIcon = $(this).children('.added-wishlist-icon').clone();
						$(this).find('a i').remove();
						$(this).find('a svg').remove();
						$(this).find('.yith-wcwl-add-button a:not(.delete_item)').prepend(addIcon);
						$(this).find('.yith-wcwl-add-button a.delete_item').prepend(addedIcon);
						$(this).find('.yith-wcwl-wishlistexistsbrowse a').prepend(addedIcon);
						$(this).find('a').addClass('icon');
						$(this).find('a.gem-button').removeAttr('class').removeAttr('style').removeAttr('onmouseleave').removeAttr('onmouseenter').addClass('icon');
						$(this).find('.yith-wcwl-wishlistaddedbrowse a').prepend(addedIcon);
					}
				});
			} else {
				$portfolio.find('.yith-icon').each(function () {
					if ($(this).find('i').length) {
						if (!$(this).find('.yith-wcwl-add-button a').children('i').length) {
							var icon = $(this).children('i');
							$(this).find('.yith-wcwl-add-button a').prepend(icon.clone());
						}
					} else if ($(this).find('svg').length) {
						if (!$(this).find('.yith-wcwl-add-button a').children('svg').length) {
							var icon_svg = $(this).children('svg');
							$(this).find('.yith-wcwl-add-button a').prepend(icon_svg.clone());
						}
					}
				});
			}

		}

		$.fn.initPortfolioFiltersList = function () {
			let $portfolio,
				$this = $(this),
				portfolioUid = $this.data('portfolio-uid'),
				$filtersList = $this.find('.portfolio-filters-list'),
				filterUrl = $this.data('url');
			if ($this.hasClass('portfolio')) {
				$portfolio = $this;
			} else if (!filterUrl) {
				$portfolio = $('.portfolio[data-portfolio-uid="' + portfolioUid + '"]');
			}
			if ($filtersList.hasClass('filtering-type-external') && !$portfolio.length) {
				filterUrl = true;
			}

			if (filterUrl) {
				currentFilters[portfolioUid] = [];
				currentFilters[portfolioUid]['portfolio-uid'] = portfolioUid;
			}

			let filterLater = $filtersList.hasClass('filtering-type-button') || $filtersList.hasClass('filtering-type-external');
			if (filterLater && !filterUrl && !$portfolio.find('.portfolio-selected-filters-clone').length) {
				$portfolio.find('.portfolio-selected-filters').clone().addClass('portfolio-selected-filters-clone').prependTo($portfolio);
			}

			if ($('.portfolio-filters-list', $this).length) {

				$this.closest('#main').addClass('over-header');

				$(this).find('.portfolio-filters-list:not(.native) .portfolio-filter-item').on('click', 'a', function (e) {
					var $thisItem = $(this).parents('.portfolio-filter-item');
					if (($(this).hasClass('active') && !$thisItem.hasClass('multiple')) || ($(this).hasClass('disable'))) {
						return;
					}
					var typeFilter = $(this).data('filter-type');
					var thisFilter = $(this).data('filter');
					var $selectedFilters = $('.portfolio-selected-filters', $portfolio);
					if (filterLater) {
						$selectedFilters = $('.portfolio-selected-filters-clone', $portfolio);
					} else if ($('.portfolio-selected-filters-clone', $portfolio).length) {
						$('.portfolio-selected-filters', $portfolio).html($('.portfolio-selected-filters-clone', $portfolio).html());
					}
					let selectorTitle = $thisItem.find('.selector-title span.name');

					if (typeFilter) {
						e.preventDefault();
					} else {
						return;
					}

					resetSearch($this);

					if (!$thisItem.hasClass('multiple')) {
						$thisItem.find('.dropdown-selector').removeClass('collapsed');
					}

					if (typeFilter === 'category') {
						if ($thisItem.hasClass('reload')) {
							var shopUrl = $('input#shop-page-url').val();
							if (thisFilter !== '*') {
								shopUrl = $(this).attr("href");
							}
							var href = window.location.href;
							if (href.indexOf('?') > 1) {
								var queryParams = new URLSearchParams(href.split("?")[1]);
								queryParams.delete('page');
								shopUrl += '?' + queryParams.toString();
							}

							shopUrl = shopUrl.replace(/\/page\/\d+/, "").replace("&amp;", '&').replace("%2C", ',');
							window.location.href = shopUrl;
							return;
						} else {
							$thisItem.find('a').removeClass('active');
							$thisItem.find('a[data-filter="' + thisFilter + '"]').addClass('active').parents('li').find(' > a').addClass('active');
							$selectedFilters.find('.portfolio-selected-filter-item.category').remove();
							if (selectorTitle.length) {
								selectorTitle.html($(this).find('.title').html());
								if (thisFilter == '*' && selectorTitle.data('title')) {
									selectorTitle.html('<span data-filter="*">' + selectorTitle.data('title') + '</span>');
								} else {
									selectorTitle.html('<span data-filter="' + thisFilter + '">' + $(this).find('.title').html() + '</span>');
								}
							}
							if (thisFilter !== '*') {
								if (!$filtersList.hasClass('single-filter')) {
									$selectedFilters.append('<div class="portfolio-selected-filter-item category" data-filter="' + thisFilter + '">' + $(this).find('.title').html() + '<i class="delete-filter"></i></div>');
								}

								if (filterLater) {
									if (filterUrl) {
										currentFilters[portfolioUid]['portfolio-filter'] = thisFilter;
									} else {
										$portfolio.data('portfolio-filter', thisFilter);
									}
								} else {
									filterPortfolioExtended($portfolio, thisFilter);
								}
							} else {
								if (filterLater) {
									if (filterUrl) {
										currentFilters[portfolioUid]['portfolio-filter'] = '';
									} else {
										$portfolio.data('portfolio-filter', '');
									}
								} else {
									filterPortfolioExtended($portfolio, '');
								}
							}
						}
					} else if (['attribute', 'products_attributes', 'taxonomies', 'details', 'custom_fields', 'acf_fields', 'manual_key'].includes(typeFilter)) {
						let attr = $(this).data('attr');
						let attrData;
						if (filterUrl) {
							attrData = currentFilters[portfolioUid]['portfolio-filter-attributes'] ? currentFilters[portfolioUid]['portfolio-filter-attributes'] : [];
						} else {
							attrData = $portfolio.data('portfolio-filter-attributes') ? $portfolio.data('portfolio-filter-attributes') : []
						}
						if (!attrData[attr]) {
							attrData[attr] = [];
						}

						if ($(this).hasClass('all')) {
							delete attrData[attr];
							$thisItem.find('a').removeClass('active');
							$(this).addClass('active');
							$selectedFilters.find('.portfolio-selected-filter-item[data-attr="' + attr + '"]').remove();
							if (selectorTitle.length) {
								if (selectorTitle.data('title')) {
									selectorTitle.html('<span data-filter="*">' + selectorTitle.data('title') + '</span>');
								} else {
									selectorTitle.html('<span data-filter="*">' + $(this).find('.title').html() + '</span>');
								}
							}
						} else if ($(this).hasClass('active')) {
							$(this).removeClass('active');
							if (attrData[attr]) {
								const index = attrData[attr].indexOf(thisFilter);
								if (index > -1) {
									attrData[attr].splice(index, 1);
								}
								if (attrData[attr].length === 0) {
									delete attrData[attr];
									$thisItem.find('a.all').addClass('active');
									if (selectorTitle.length) {
										if (selectorTitle.data('title')) {
											selectorTitle.html('<span data-filter="*">' + selectorTitle.data('title') + '</span>');
										} else {
											selectorTitle.html('<span data-filter="*">' + $thisItem.find('a.all .title').html() + '</span>');
										}
									}
								}
							}
							$selectedFilters.find('.portfolio-selected-filter-item[data-attr="' + attr + '"][data-filter="' + thisFilter + '"]').remove();
							if (selectorTitle.length) {
								selectorTitle.find('span[data-filter="' + thisFilter + '"]').remove();
							}
						} else {
							if (!$thisItem.hasClass('multiple')) {
								$thisItem.find('a').removeClass('active');
								attrData[attr] = [];
								$selectedFilters.find('.portfolio-selected-filter-item[data-attr="' + attr + '"]').remove();
								if (selectorTitle.length) {
									selectorTitle.html('');
								}
							} else {
								$thisItem.find('a.all').removeClass('active');
								if (selectorTitle.length) {
									selectorTitle.find('span[data-filter="*"]').remove();
								}
							}
							$(this).addClass('active');
							attrData[attr].push(thisFilter);
							$selectedFilters.append('<div class="portfolio-selected-filter-item attribute" data-attr="' + attr + '" data-filter="' + thisFilter + '">' + $(this).find('.title').html() + '<i class="delete-filter"></i></div>');
							if (selectorTitle.length) {
								selectorTitle.append('<span data-filter="' + thisFilter + '">' + $(this).find('.title').html() + '<span class="separator">, </span></span>');
							}
						}
						if (filterLater) {
							if (filterUrl) {
								currentFilters[portfolioUid]['portfolio-filter-attributes'] = attrData;
							} else {
								$portfolio.data('portfolio-filter-attributes', attrData);
							}
						} else {
							filterPortfolioAttributes($portfolio, attrData);
						}
					} else if (typeFilter === 'status') {
						let statusData;
						if (filterUrl) {
							statusData = currentFilters[portfolioUid]['portfolio-filter-status'] ? currentFilters[portfolioUid]['portfolio-filter-status'] : [];
						} else {
							statusData = $portfolio.data('portfolio-filter-status') ? $portfolio.data('portfolio-filter-status') : [];
						}
						if ($(this).hasClass('all')) {
							statusData = '';
							$thisItem.find('a').removeClass('active');
							$(this).addClass('active');
							$selectedFilters.find('.portfolio-selected-filter-item.status').remove();
							if (selectorTitle.length) {
								if (selectorTitle.data('title')) {
									selectorTitle.html('<span data-filter="*">' + selectorTitle.data('title') + '</span>');
								} else {
									selectorTitle.html('<span data-filter="*">' + $(this).find('.title').html() + '</span>');
								}
							}
						} else if ($(this).hasClass('active')) {
							$(this).removeClass('active');
							const index = statusData.indexOf(thisFilter);
							if (index > -1) {
								statusData.splice(index, 1);
							}
							if (statusData.length === 0) {
								$thisItem.find('a.all').addClass('active');
								statusData = '';
								if (selectorTitle.length) {
									if (selectorTitle.data('title')) {
										selectorTitle.html('<span data-filter="*">' + selectorTitle.data('title') + '</span>');
									} else {
										selectorTitle.html('<span data-filter="*">' + $thisItem.find('a.all .title').html() + '</span>');
									}
								}
							}
							$selectedFilters.find('.portfolio-selected-filter-item.status[data-filter="' + thisFilter + '"]').remove();
							if (selectorTitle.length) {
								selectorTitle.find('span[data-filter="' + thisFilter + '"]').remove();
							}
						} else {
							$thisItem.find('a.all').removeClass('active');
							if (selectorTitle.length) {
								selectorTitle.find('span[data-filter="*"]').remove();
							}
							$(this).addClass('active');
							statusData.push(thisFilter);
							$selectedFilters.append('<div class="portfolio-selected-filter-item status" data-filter="' + thisFilter + '">' + $(this).find('.title').html() + '<i class="delete-filter"></i></div>');
							if (selectorTitle.length) {
								selectorTitle.append('<span data-filter="' + thisFilter + '">' + $(this).find('.title').html() + '<span class="separator">, </span></span>');
							}
						}
						if (filterLater) {
							if (filterUrl) {
								currentFilters[portfolioUid]['portfolio-filter-status'] = statusData;
							} else {
								$portfolio.data('portfolio-filter-status', statusData);
							}
						} else {
							filterPortfolioStatus($portfolio, statusData);
						}
					}

					if (!filterLater) {
						scrollTopPortfolio($this);
					}

					return false;
				});

				$('.portfolio-filters-list', $this).on('click', '.portfolio-show-filters-button', function () {
					$portfolio.addClass('filters-opened');
					$(this).next().addClass('visible');
				}).on('click', '.portfolio-close-filters', function () {
					closeFiltersPopup($this);
				}).on('click', '.portfolio-filters-outer', function () {
					closeFiltersPopup($this);
				}).on('click', '.portfolio-filters-area', function (e) {
					e.stopPropagation();
				});

				$('.progress-bar', $portfolio).on('click', '.show', function () {
					closeFiltersPopup($portfolio);
				});

				if ($('.portfolio-filters-list', $portfolio).hasClass('native-ajax-filters')) {

					$('.widget_layered_nav, .widget_rating_filter, .widget_layered_nav_filters', $portfolio).off('click', 'a').on('click', 'a', function (e) {
						e.preventDefault();
						var href = $(this).attr('href');
						nativeAjaxFiltering($portfolio, href);
					});

					$('.widget_layered_nav select').off('change').on('change', function (e) {
						e.preventDefault();

						var $this = $(this),
							name = $this.closest('form').find('input[type=hidden]').length ? $this.closest('form').find('input[type=hidden]').attr('name').replace('filter_', '') : $this.attr('class').replace('dropdown_layered_nav_', ''),
							slug = $this.val(),
							href;

						href = window.location.href;
						href = href.replace(/\/page\/\d+/, "").replace("&amp;", '&').replace("%2C", ',');

						href = updateUrlParams(href, 'filter_' + name, slug);

						nativeAjaxFiltering($portfolio, href);
					});

					$('.widget_product_search, .wc-block-product-search').on('submit', 'form', function (e) {
						e.preventDefault();

						var $this = $(this),
							search = $this.find('input[type=search]').val(),
							href;

						href = window.location.href;
						href = href.replace(/\/page\/\d+/, "").replace("&amp;", '&').replace("%2C", ',');
						href = updateUrlParams(href, 's', search);

						if ( $('input#shop-page-url').hasClass('is-shop-home')) {
							href = updateUrlParams(href, 'post_type', 'product');
						}

						nativeAjaxFiltering($portfolio, href+"&ajax_search=1");
					});


					$('.widget_price_filter .price_slider_wrapper').off('click', '.button').on('click', '.button', function (e) {
						e.preventDefault();

						var form = $(this).closest('form'),
							action = form.attr('action'),
							href = action + (-1 === action.indexOf('?') ? '?' : '&') + form.serialize();
						$('.widget_price_filter').removeClass('yith-wcan-list-price-filter');

						nativeAjaxFiltering($portfolio, href);
					});
				}

				$('.portfolio-filters-list:not(.native) .filters-collapsible-arrow', $this).on('click', function (e) {
					e.preventDefault();
					e.stopPropagation();
					$(this).parent().toggleClass('collapsed');
					$(this).parent().next().slideToggle('slow');
				});

				$(this).find('.price-range-slider').each(function () {
					var $range = $(this).find('.slider-range');
					if ($range.length === 0) return;
					var $thisItem = $(this).parents('.portfolio-filter-item');
					var $amount = $thisItem.find('.slider-amount-value');
					var minValue = Math.floor(parseFloat($range.data('min')));
					var maxValue = Math.ceil(parseFloat($range.data('max')));
					var currency = $range.data('currency') ? $range.data('currency') : '';
					var attr = $range.data('attr');
					var prefix = $range.data('prefix') ? $range.data('prefix') : '';
					var suffix = $range.data('suffix') ? $range.data('suffix') : '';
					var $selectedFilters = $('.portfolio-selected-filters', $portfolio);
					if (filterLater) {
						$selectedFilters = $('.portfolio-selected-filters-clone', $portfolio);
					} else if ($('.portfolio-selected-filters-clone', $portfolio).length) {
						$('.portfolio-selected-filters', $portfolio).html($('.portfolio-selected-filters-clone', $portfolio).html());
					}
					var values;
					if (filterUrl) {
						values = currentFilters[portfolioUid]['portfolio-filter-price'] ? currentFilters[portfolioUid]['portfolio-filter-price'] : null;
					} else {
						values = $portfolio.data('portfolio-filter-price');
					}
					if (values == null) {
						let attrData;
						if (filterUrl) {
							attrData = currentFilters[portfolioUid]['portfolio-filter-attributes'] ? currentFilters[portfolioUid]['portfolio-filter-attributes'] : [];
						} else {
							attrData = $portfolio.data('portfolio-filter-attributes') ? $portfolio.data('portfolio-filter-attributes') : [];
						}
						if (attrData[attr+'__range']) {
							values = attrData[attr+'__range'];
						} else {
							values = [minValue, maxValue];
						}
					}

					var currencyPosition = $range.data('currency-position');
					var space = '';
					if (currencyPosition == 'left_space' || currencyPosition == 'right_space') {
						space = ' ';
					}
					var thousandSeparator = $range.data('thousand-separator');
					var locale = $range.data('locale');
					function formatNumber(num, sep = thousandSeparator, loc = locale) {
						if (thousandSeparator) {
							return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, sep);
						} else if (loc) {
							loc = loc.replace('_', '-');
							return num.toLocaleString(loc);
						} else {
							return num.toString();
						}
					}

					if (locale && $selectedFilters.find('.portfolio-selected-filter-item.price[data-attr="'+attr+'"]').length) {
						$selectedFilters.find('.portfolio-selected-filter-item.price[data-attr="'+attr+'"] span').each(function (){
							$(this).html(formatNumber(parseInt($(this).html())));
						});
					}

					$range.slider({
						range: true,
						min: minValue,
						max: maxValue,
						values: values,
						slide: function (event, ui) {
							var from = formatNumber(ui.values[0]),
								to = formatNumber(ui.values[1]);
							if (currencyPosition == 'left' || currencyPosition == 'left_space') {
								$amount.html(prefix + currency + space + from + suffix + " - " + prefix + currency + space + to + suffix);
							} else {
								$amount.html(prefix + from + space + currency + suffix + " - " + prefix + to + space + currency + suffix);
							}
						},
						stop: function (event, ui) {
							var from = formatNumber(ui.values[0]),
								to = formatNumber(ui.values[1]);

							resetSearch($this);

							if (attr) {
								let attrData;
								if (filterUrl) {
									attrData = currentFilters[portfolioUid]['portfolio-filter-attributes'] ? currentFilters[portfolioUid]['portfolio-filter-attributes'] : [];
								} else {
									attrData = $portfolio.data('portfolio-filter-attributes') ? $portfolio.data('portfolio-filter-attributes') : []
								}
								if (!attrData[attr+'__range']) {
									attrData[attr+'__range'] = [];
								}

								if (from == minValue && to == maxValue) {
									delete attrData[attr+'__range'];
								} else {
									attrData[attr+'__range'] = ui.values;
								}

								if (filterLater) {
									if (filterUrl) {
										currentFilters[portfolioUid]['portfolio-filter-attributes'] = attrData;
									} else {
										$portfolio.data('portfolio-filter-attributes', attrData);
									}
								} else {
									filterPortfolioAttributes($portfolio, attrData);
								}
								$selectedFilters.find('.portfolio-selected-filter-item.price[data-attr="'+attr+'"]').remove();
							} else {

								if (filterLater) {
									if (filterUrl) {
										currentFilters[portfolioUid]['portfolio-filter-price'] = ui.values;
									} else {
										$portfolio.data('portfolio-filter-price', ui.values);
									}
								} else {
									filterPortfolioPrice($portfolio, ui.values);
								}
								$selectedFilters.find('.portfolio-selected-filter-item.price').remove();
							}

							if ($range.data('currency-position') == 'left' || currencyPosition == 'left_space') {
								$selectedFilters.append('<div class="portfolio-selected-filter-item price" data-attr="' + attr + '">' + prefix + currency + space + from + suffix + " - " + prefix + currency + space + to + suffix + '<i class="delete-filter"></i></div>');
							} else {
								$selectedFilters.append('<div class="portfolio-selected-filter-item price" data-attr="' + attr + '">' + prefix + from + space + currency + suffix + " - " + prefix + to + space + currency + suffix + '<i class="delete-filter"></i></div>');
							}

							if (!filterLater) {
								scrollTopPortfolio($this);
							}
						},
						change: function (event, ui) {
							var from = formatNumber(ui.values[0]),
								to = formatNumber(ui.values[1]);
							if (currencyPosition == 'left' || currencyPosition == 'left_space') {
								$amount.html(prefix + currency + space + from + suffix + " - " + prefix + currency + space + to + suffix);
							} else {
								$amount.html(prefix + from + space + currency + suffix + " - " + prefix + to + space + currency + suffix);
							}
						}
					});

					var from = formatNumber($range.slider("values", 0)),
						to = formatNumber($range.slider("values", 1));
					if (currencyPosition == 'left' || currencyPosition == 'left_space') {
						$amount.html(prefix + currency + space + from + suffix + " - " + prefix + currency + space + to + suffix);
					} else {
						$amount.html(prefix + from + space + currency + suffix + " - " + prefix + to + space + currency + suffix);
					}
				});

				$(".portfolio-filters-list", $this).each(function () {
					if (!$(this).hasClass("style-hidden") && !$(this).hasClass("prevent-hidden-mobile")) {
						let filtersList = $(this),
							breakpoint = filtersList.data("breakpoint") ? filtersList.data("breakpoint") : 992;
						filtersListMobileView(filtersList, breakpoint);
						$(window).on("resize", function () {
							filtersListMobileView(filtersList, breakpoint)
						})
					}
				});
			}

			if ($('.portfolio-search-filter', $this).length) {
				let isLiveSearch = $('.portfolio-search-filter', $this).hasClass('live-search');
				var $selectedFilters = $('.portfolio-selected-filters', $portfolio);
				if (filterLater) {
					$selectedFilters = $('.portfolio-selected-filters-clone', $portfolio);
				} else if ($('.portfolio-selected-filters-clone', $portfolio).length) {
					$('.portfolio-selected-filters', $portfolio).html($('.portfolio-selected-filters-clone', $portfolio).html());
				}
				$('.portfolio-search-filter', $this).on('click', '.portfolio-search-filter-button', function () {
					if (!filterLater) {
						if ($(this).parents('.portfolio-search-filter').hasClass('active')) {
							$(this).parents('.portfolio-search-filter').submit();
						} else {
							$(this).parents('.portfolio-search-filter').addClass('active');
						}
					}
				}).on('change', 'input', function () {
					$(this).parents('.portfolio-search-filter').addClass('changed');
				}).on('keyup', 'input', function () {
					if (isLiveSearch && !filterLater) {
						if ($(this).val().length == 0 || $(this).val().length > 2) {
							$(this).parents('.portfolio-search-filter').addClass('changed');
							$(this).closest('.portfolio-search-filter').submit();
						}
					}
				}).on('mouseenter', function () {
					if ("ontouchstart" in document.documentElement) {
					} else {
						$(this).addClass('active');
					}
				}).on('mouseleave', function (e) {
					$(this).removeClass('active');
				}).on('submit', function (e) {
					e.preventDefault();
					if ($(this).hasClass('changed')) {
						var value = $(this).find('input').val();
						$selectedFilters.find('.portfolio-selected-filter-item.search').remove();
						if (value != '') {
							$selectedFilters.append('<div class="portfolio-selected-filter-item search">' + value + '<i class="delete-filter"></i></div>');
						}
						if (isLiveSearch && !filterLater) {
							$('.portfolio-search-filter-form', $this).addClass('ajax-loading');
							if ($selectedFilters.hasClass('portfolio-selected-filters-clone')) {
								$('.portfolio-selected-filters', $portfolio).html($('.portfolio-selected-filters-clone', $portfolio).html());
							}
						}
						if ($('.portfolio-search-filter', $this).hasClass('reset-filters')) {
							resetFilters($this);
						}
						if (filterLater) {
							if (filterUrl) {
								currentFilters[portfolioUid]['portfolio-filter-search'] = value;
							} else {
								$portfolio.data('portfolio-filter-search', value);
							}
						} else {
							filterPortfolioSearch($portfolio, value);
						}
						if (!isLiveSearch) {
							$('.portfolio-search-filter', $portfolio).removeClass('changed');
							closeFiltersPopup($portfolio);
						}
					}
					if (!isLiveSearch) {
						$(this).find('input').blur();
						$('.portfolio-search-filter', $portfolio).removeClass('active');
					}
				});
			}

			if ($this.find('.filters-apply-button').length) {
				$this.find('.filters-apply-button').on('click', '.gem-button', function (e) {
					e.preventDefault();
					$('.extended-posts-filter[data-portfolio-uid="' + portfolioUid + '"] .portfolio-search-filter').submit();
					if (filterUrl) {
						let $params = $('<div></div>');
						for (var key in currentFilters[portfolioUid]) {
							$params.data(key, currentFilters[portfolioUid][key]);
						}
						let queryParams = portfolioLoadCoreRequest($params, false, false, true);
						let fullUrl = filterUrl + '?' + queryParams.toString();
						fullUrl = fullUrl.replace(/\/page\/\d+/, "").replace("&amp;", '&').replace("%2C", ',');
						window.location.href = fullUrl;
					} else {
						$portfolio.data('next-page', 1);
						$('.portfolio-selected-filters', $portfolio).html($('.portfolio-selected-filters-clone', $portfolio).html());
						portfolioLoadCoreRequest($portfolio);
						scrollTopPortfolio($this);
					}
					closeFiltersPopup($this);
				})
			}

			if ($('.display-type-dropdown', $this).length) {

				$(window).on('click', function (){
					$('.display-type-dropdown .dropdown-selector', $this).removeClass('collapsed');
				});

				$('.portfolio-filters-area', $this).on('click', function (){
					$('.display-type-dropdown .dropdown-selector', $this).removeClass('collapsed');
				});

				$('.display-type-dropdown.open-dropdown-click', $this).on('mouseleave', function (){
					$(this).find('.dropdown-selector').removeClass('collapsed');
				}).on('click', '.selector-title', function (e){
					e.stopPropagation();
					if ($(this).parent().hasClass('collapsed')) {
						$(this).parent().removeClass('collapsed');
					} else {
						$('.display-type-dropdown').removeClass('collapsed');
						$(this).parent().addClass('collapsed');
					}
				});

				$('.display-type-dropdown.open-dropdown-hover', $this).on('mouseenter', function (){
					$(this).find('.dropdown-selector').addClass('collapsed');
				}).on('mouseleave', function (){
					$(this).find('.dropdown-selector').removeClass('collapsed');
				}).on('click', '.selector-title', function (e){
					e.stopPropagation();
				});
			}
		}

		// Api videos init
		function initApiVideos($videos) {

			$videos.each(function (){
				let $video = $(this);
				if ($(this).data("video-type") === 'youtube') {
					if (!youtubeInited) {
						$.getScript("https://www.youtube.com/iframe_api", function() {
							youtubeInited = true;
							onYouTubeVideoInit($video);
						});
					} else {
						onYouTubeVideoInit($video);
					}
				} else if ($(this).data("video-type") === 'vimeo') {
					if (!vimeoInited) {
						vimeoInited = true;
						$.getScript("https://player.vimeo.com/api/player.js", function() {
							onVimeoVideoInit($video);
						});
					} else {
						onVimeoVideoInit($video);
					}
				} else {
					selfInited = true;
					onSelfVideoInit($video);
				}
			});
		}

		// Init youtube api video
		function onYouTubeVideoInit($video) {
			let videoId = $video.data('video-id');
			let blockId = $video.find('.video-embed').attr('id');
			let $portfolioItem = $video.closest('.portfolio-item');

			if (videoId !== undefined && videoId !== null) {
				window.YT.ready(function(){
					let currentPlayer = new YT.Player(blockId, {
						videoId: videoId,
						playerVars: {
							'playsinline': 1,
							'controls': 0,
							'autoplay': 0,
							'loop': 1,
							'rel': 0,
							'fs': 0,
							'mute': 1,
						},
						events: {
							onReady: () => {
								if ($video.hasClass('play-on-hover')) {

									$portfolioItem.on('mouseenter touchstart', function (){
										if (currentPlayer) {
											currentPlayer.playVideo();
										}
									}).on('mouseleave', function (){
										if (currentPlayer) {
											currentPlayer.pauseVideo();
										}
									});
								} else {
									currentPlayer.mute();
									currentPlayer.playVideo();
								}
							},
						}
					});
				});
			}
		}

		// Init vimeo api video
		function onVimeoVideoInit($video) {
			let videoId = $video.data('video-id');
			let blockId = $video.find('.video-embed').attr('id');
			let $portfolioItem = $video.closest('.portfolio-item');

			if (videoId !== undefined && videoId !== null){
				let options = {
					id: videoId,
					loop: true,
					muted: true,
					playsinline: true,
					controls: false,
					title: false,
					portrait: false,
					byline: false,
				};

				let currentPlayer = new Vimeo.Player(blockId, options);

				currentPlayer.ready().then(() => {
					if ($video.hasClass('play-on-hover')) {
						$portfolioItem.on('mouseenter touchstart', function (){
							playPromise = currentPlayer.play();
						}).on('mouseleave', function (){
							if (playPromise !== undefined) {
								playPromise.then(_ => {
									currentPlayer.pause();
								});
							}
						});
					} else {
						currentPlayer.play();
					}
				});
			}
		}

		// Init self api video
		function onSelfVideoInit($video) {
			let videoId = $video.data('video-id');
			let $portfolioItem = $video.closest('.portfolio-item');

			if (videoId !== undefined && videoId !== null){
				let currentPlayer = $video.find('video').get(0);
				currentPlayer.disablePictureInPicture = true;

				if ($video.hasClass('play-on-hover')) {
					$portfolioItem.on('mouseenter touchstart', function (){
						currentPlayer.play();
					}).on('mouseleave', function (){
						currentPlayer.pause();
					});
				} else {
					currentPlayer.play();
				}
			}
		}

		$('body').on('click', '.portfolio.portfolio-grid.extended-products-grid a.icon.share', function (e) {
			e.preventDefault();
			e.stopPropagation();
			$(this).next('.sharing-popup').removeClass('right').removeClass('left');
			var offsetLeft = $(this).offset().left;
			var offsetRight = ($(window).width() - (offsetLeft + $(this).outerWidth()));
			if (offsetLeft < 100) {
				$(this).next('.sharing-popup').addClass('left');
			} else if (offsetRight < 100) {
				$(this).next('.sharing-popup').addClass('right');
			}
			if ($(this).closest('.links').find('.portfolio-sharing-pane').hasClass('active') ||
				$(this).closest('.post-footer-sharing').find('.sharing-popup').hasClass('active')) {
				$('.portfolio-sharing-pane').removeClass('active');
				$('.sharing-popup').removeClass('active');
			} else {
				$('.portfolio-sharing-pane').removeClass('active');
				$('.sharing-popup').removeClass('active');
				$(this).closest('.links').find('.portfolio-sharing-pane').addClass('active');
				$(this).closest('.post-footer-sharing').find('.sharing-popup').addClass('active');
			}
			return false;
		});

		$('body').on('click', function () {
			$('.portfolio-sharing-pane').removeClass('active');
			$('.sharing-popup').removeClass('active');
		}).on('touchstart', function (e) {
			$('.extended-products-grid .portfolio-item').removeClass('hover-effect');
			$('.extended-products-grid .portfolio-item').removeClass('hover-effect-active');
		});

		$('.extended-products-grid .portfolio-item').on('touchstart', function (e) {
			// e.preventDefault();
			// e.stopPropagation();
			$('.extended-products-grid .portfolio-item').not(this).removeClass('hover-effect');
			$('.extended-products-grid .portfolio-item').not(this).removeClass('hover-effect-active');
			$(this).addClass('hover-effect');
			let item = $(this);
			setTimeout(function () {
				item.addClass('hover-effect-active');
			}, 500);
		});

		$('body').on('DOMSubtreeModified', '.zilla-likes', function () {
			if (!$(this).children('i').length) {
				var icon = $(this).siblings('i');
				$(this).prepend(icon.clone());
			}
		});

		$('body').on('click', '.portfolio.portfolio-grid:not(.news-grid):not(.extended-products-grid) a.icon.share', function (e) {
			e.preventDefault();
			$(this).closest('.links').find('.portfolio-sharing-pane').toggleClass('active');
			$(this).closest('.post-footer-sharing').find('.sharing-popup').toggleClass('active');
			return false;
		});

		$('body').on('click', '.portfolio.news-grid a.icon.share', function (e) {
			e.preventDefault();

			if ($(this).closest('.portfolio').hasClass('version-new') ||
				($(this).closest('.portfolio').hasClass('version-default') &&
					$(this).closest('.portfolio').hasClass('title-on-hover'))
			) {
				toggleNewsGridSharing(this);
			} else {
				$(this).closest('.links').find('.portfolio-sharing-pane').toggleClass('active');
			}
			return false;
		});

		$('body').on('mouseleave', '.portfolio.portfolio-grid .portfolio-item', function () {
			$('.portfolio-sharing-pane').removeClass('active');
		});

		$('body').on('click', '.portfolio.portfolio-grid .portfolio-item', function () {
			// $(this).mouseover();
		});

		$(document).on('mouseenter', '.gif-load-on-hover', function (){
			let $gif = $(this).find('.gem-gif-portfolio');
			$gif.on('load', function () {
				$(this).closest('.image').removeClass('gif-load-on-hover');
			});
			$gif.attr('src', $gif.data('src'));
		})

		if (typeof $.fn.scSticky === 'function') {
			$('.sticky-sidebar > .filter-sidebar').scSticky();
			$('.filters-top-sticky').scSticky({hideStickyHeader: true, fullWidth: true});
		}

		$.fn.initExtendedPortfolioGrids = function () {
			$(this).each(initExtendedPortfolioGrid);
		};

		$(document).ready(function () {
			$('body:not(.elementor-editor-active) .extended-portfolio-grid:not(.extended-carousel-grid)').initExtendedPortfolioGrids();
			refreshPriceSlider();

			$('body:not(.elementor-editor-active) .extended-posts-filter').each(function () {
				$(this).initPortfolioFiltersList();
			});

			$('body:not(.elementor-editor-active) .extended-posts-sorting').each(function () {
				$(this).initPortfolioSorting();
			});
		});

		$(window).on('load', function () {
			if (window.tgpLazyItems !== undefined) {
				window.tgpLazyItems.scrollHandle();
			}
		})
	});
})(jQuery);
