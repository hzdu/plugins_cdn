( function( $ ) {

	var loadStatus = true;
	var count = 1;
	var loader = '';
	var total = 0;
	var isEditMode = false;
	
	function equalHeight( $scope ) {
		var activeSlide = $scope.find( '.swiper-slide-visible' ),
			maxHeight   = -1;

		activeSlide.each( function() {
            var $this      = $( this ),
                post       = $this.find( '.pp-post' ),
                postHeight = post.outerHeight();

            if ( maxHeight < postHeight ) {
                maxHeight = postHeight;
            }
        });

		activeSlide.each( function() {
            var selector = $( this ).find( '.pp-post' );

            selector.animate({ height: maxHeight }, { duration: 200, easing: 'linear' });
        });
	}

	var ppSwiperSliderAfterinit = function ( $scope, carousel, carouselWrap, elementSettings, mySwiper ) {
		equalHeight( $scope );

		mySwiper.on('slideChange', function () {
			equalHeight( $scope );
		});

		if ( true === elementSettings.autoplay.pauseOnHover ) {
			carousel.on( 'mouseover', function() {
				mySwiper.autoplay.stop();
			});

			carousel.on( 'mouseout', function() {
				mySwiper.autoplay.start();
			});
		}

		if ( isEditMode ) {
			carouselWrap.resize( function() {
				mySwiper.update();
			});
		}

		var $triggers = [
			'ppe-tabs-switched',
			'ppe-toggle-switched',
			'ppe-accordion-switched',
			'ppe-popup-opened',
		];

		$triggers.forEach(function(trigger) {
			if ( 'undefined' !== typeof trigger ) {
				$(document).on(trigger, function(e, wrap) {
					if ( wrap.find( '.pp-swiper-slider' ).length > 0 ) {
						setTimeout(function() {
							slider.update();
						}, 100);
					}
				});
			}
		});
    };
	
	var PostsHandler = function( $scope, $ ) {
		
		var container            = $scope.find( '.pp-posts-container' ),
			selector             = $scope.find( '.pp-posts' ),
			layout               = $scope.find( '.pp-posts' ).data( 'layout' ),
			search               = $scope.find( '.pp-post-filters-container' ).data( 'search-form' ),
			$search_input        = $scope.find( '.pp-search-form-input' ),
			search_action        = $scope.find( '.pp-post-filters-container' ).data( 'search-action' ),
			loader               = $scope.find( '.pp-posts-loader' ),
			post_filter          = $scope.find( '.pp-post-filters' ),
			post_filter_dropdown = $scope.find( '.pp-post-filters-dropdown' );

		var coupon_container = $scope.find( '.pp-coupons' );

		if ( 'masonry' == layout ) {

			$scope.imagesLoaded( function(e) {

				selector.isotope({
					layoutMode: layout,
					itemSelector: '.pp-grid-item-wrap',
				});

			});
		}

		set_posts_count( $scope, 1 );
		
		// Post Filter
		post_filter.find( '.pp-post-filter' ).off( 'click' ).on( 'click', function() {
			$( this ).siblings().removeClass( 'pp-filter-current' );
			$( this ).addClass( 'pp-filter-current' );
			count = 1;

			if ( post_filter_dropdown.length > 0 ) {
				var curr_filter_update = $( this ).data( 'filter' );
				post_filter_dropdown.find('li[data-filter="' + curr_filter_update + '"]').siblings().removeClass( 'pp-filter-current' );
				post_filter_dropdown.find('li[data-filter="' + curr_filter_update + '"]').addClass( 'pp-filter-current' );
				post_filter_dropdown.find( '.pp-post-filters-dropdown-button' ).html( $( this ).html() );
			}

			if ( coupon_container.length > 0 ) {
				_postsFilterAjax( $scope, $( this ), 'coupon' );
			} else {
				_postsFilterAjax( $scope, $( this ), '' );
			}
		});

		// Post Filter Dropdown for Mobile device.
		post_filter_dropdown.find( '.pp-post-filters-dropdown-button' ).on( 'click', function() {
			post_filter_dropdown.find( '.pp-post-filters-dropdown-list' ).toggle();
		});
		
		post_filter_dropdown.find( '.pp-post-filters-dropdown-item' ).off( 'click' ).on( 'click', function() {
			$( this ).siblings().removeClass( 'pp-filter-current' );
			$( this ).addClass( 'pp-filter-current' );
			post_filter_dropdown.find( '.pp-post-filters-dropdown-list' ).hide();
			post_filter_dropdown.find( '.pp-post-filters-dropdown-button' ).html( $( this ).html() );
			count = 1;

			var curr_filter_update = $( this ).data( 'filter' );
			post_filter.find('li[data-filter="' + curr_filter_update + '"]').siblings().removeClass( 'pp-filter-current' );
			post_filter.find('li[data-filter="' + curr_filter_update + '"]').addClass( 'pp-filter-current' );

			if ( coupon_container.length > 0 ) {
				_postsFilterAjax( $scope, $( this ), 'coupon' );
			} else {
				_postsFilterAjax( $scope, $( this ), '' );
			}
		});

		if ( post_filter.length > 0 || post_filter_dropdown.length > 0 ) {
			// Trigger filter by hash parameter in URL.
			if ( '' !== location.hash ) {
				var filterHash = location.hash.split('#')[1];
				post_filter.find('li[data-filter=".' + filterHash + '"]').trigger('click');
				if ( post_filter_dropdown.length > 0 ) {
					post_filter_dropdown.find('li[data-filter=".' + filterHash + '"]').trigger('click');
				}
			}
			// Trigger filter on hash change in URL.
			$( window ).on( 'hashchange', function() {
				if ( '' !== location.hash ) {
					var filterHash = location.hash.split('#')[1];
					post_filter.find('li[data-filter=".' + filterHash + '"]').trigger('click');
					if ( post_filter_dropdown.length > 0 ) {
						post_filter_dropdown.find('li[data-filter=".' + filterHash + '"]').trigger('click');
					}
				}
			} );
		}
		
		if ( 'show' == search ) {
			$search_input.on({
                focus: function focus() {
                    $scope.find( '.pp-search-form' ).addClass('pp-search-form-focus');
                },
                blur: function blur() {
                    $scope.find( '.pp-search-form' ).removeClass('pp-search-form-focus');
                }
            });
			
			if ( 'instant' == search_action ) {
				$scope.find('.pp-search-form-input').keyup(debounce(function () {
					_postsSearchAjax( $scope, $( this ) );
				}));      

				// debounce so filtering doesn't happen every millisecond
				function debounce(pp, threshold) {
					var timeout;
					threshold = threshold || 100;
					return function debounced() {
						clearTimeout(timeout);
						var args = arguments;
						var _this = this;

						function delayed() {
							pp.apply(_this, args);
						}
						timeout = setTimeout(delayed, threshold);
					};
				}
			} else if ( 'button-click' == search_action ) {
				$scope.find( '.pp-search-form-submit' ).on( 'click', function() {

					_postsSearchAjax( $scope, $( this ) );

				});
			}
		}
		
		if ( container.find('.pp-posts').hasClass( 'pp-posts-skin-checkerboard' ) && $scope.hasClass( 'pp-equal-height-yes' ) ) {
			function setEqualHeight() {
				var elementorBreakpoints = elementorFrontend.config.breakpoints,
					maxHeight = 0,
					$height = 'auto';
				
				$scope.find('.pp-post-wrap').each( function() {
					if( $(this).find('.pp-post-content').outerHeight() > maxHeight ){
						maxHeight = $(this).find('.pp-post-content').outerHeight();
					}
				});
				if ($(window).width() >= elementorBreakpoints.md) {
					$height = maxHeight;
				}
				$scope.find('.pp-post-wrap').css('height',$height);
			}

			if ( container.find('.pp-posts').hasClass( 'pp-posts-height-auto' ) ) {
				$(setEqualHeight);
				$(window).resize(setEqualHeight);
			}
		}

		if ( container.hasClass( 'pp-posts-infinite-scroll' ) || coupon_container.hasClass( 'pp-coupons-infinite-scroll' ) ) {

			var windowHeight50 = jQuery( window ).outerHeight() / 1.25;

			$( window ).scroll( function () {

				if ( elementorFrontend.isEditMode() ) {
					loader.show();
					return false;
				}

				if ( coupon_container.hasClass( 'pp-coupons-infinite-scroll' ) ) {
					if ( ( $( window ).scrollTop() + windowHeight50 ) >= ( $scope.find( '.pp-coupons-grid-wrapper:last' ).offset().top ) ) {
						var $args = {
							'page_id':		$scope.find( '.pp-coupons-grid-wrapper' ).data('page'),
							'widget_id':	$scope.data( 'id' ),
							'filter':		$scope.find( '.pp-filter-current' ).data( 'filter' ),
							'taxonomy':		$scope.find( '.pp-filter-current' ).data( 'taxonomy' ),
							'skin':			$scope.find( '.pp-coupons-grid-wrapper' ).data( 'skin' ),
							'page_number':	$scope.find( '.page-numbers.current' ).next( 'a' ).html(),
							'ajax_for':     'coupon'
						};

						total = $scope.find( '.pp-posts-pagination' ).data( 'total' );

						if( true == loadStatus ) {
	
							if ( count < total ) {
								loader.show();
								_callAjax( $scope, $args, true );
								count++;
								loadStatus = false;
							}
	
						}
					}
				} else {
					if ( ( $( window ).scrollTop() + windowHeight50 ) >= ( $scope.find( '.pp-post:last' ).offset().top ) ) {

						var $args = {
							'page_id':		$scope.find( '.pp-posts' ).data('page'),
							'widget_id':	$scope.data( 'id' ),
							'filter':		$scope.find( '.pp-filter-current' ).data( 'filter' ),
							'taxonomy':		$scope.find( '.pp-filter-current' ).data( 'taxonomy' ),
							'skin':			$scope.find( '.pp-posts' ).data( 'skin' ),
							'page_number':	$scope.find( '.pp-posts-pagination .current' ).next( 'a' ).html(),
							'ajax_for':     ''
						};
	
						total = $scope.find( '.pp-posts-pagination' ).data( 'total' );
	
						if( true == loadStatus ) {
	
							if ( count < total ) {
								loader.show();
								_callAjax( $scope, $args, true );
								count++;
								loadStatus = false;
							}
	
						}
					}
				}
			} );
		}
		
		if ( 'carousel' == layout ) {
			var carouselWrap  = $scope.find( '.swiper-container-wrap' ).eq( 0 ),
				carousel      = $scope.find( '.pp-posts-carousel' ).eq( 0 ),
				sliderOptions = JSON.parse( carousel.attr('data-slider-settings') );

			/* $($carousel).on('setPosition', function () {
				equalHeight($scope);
			}); */

			if ( carousel.length > 0 ) {
				if ( 'undefined' === typeof Swiper ) {
					var asyncSwiper = elementorFrontend.utils.swiper;
		
					new asyncSwiper( carousel, sliderOptions ).then( function( newSwiperInstance ) {
						var mySwiper = newSwiperInstance;
						ppSwiperSliderAfterinit( $scope, carousel, carouselWrap, sliderOptions, mySwiper );
					} );
				} else {
					var mySwiper = new Swiper(carousel, sliderOptions);
					ppSwiperSliderAfterinit( $scope, carousel, carouselWrap, sliderOptions, mySwiper );
				}
			}
		}
	}

	$( document ).on( 'click', '.pp-post-load-more', function( e ) {

		$scope = $( this ).closest( '.elementor-widget-pp-posts' );
		loader = $scope.find( '.pp-posts-loader' );

		//Coupon widget
		var $coupon_scope = $( this ).closest( '.elementor-widget-pp-coupons' );
		coupon_loader = $coupon_scope.find( '.pp-posts-loader' );

		e.preventDefault();

		if( elementorFrontend.isEditMode() ) {
			loader.show();
			coupon_loader.show();
			return false;
		}

		if ( $coupon_scope.length > 0 ) {
			var page_count = get_posts_count( $coupon_scope ),
			category = $coupon_scope.find( '.pp-filter-current' ).data( 'filter' ),
			taxonomy = $coupon_scope.find( '.pp-filter-current' ).data( 'taxonomy' );

			var $args = {
				'page_id':		$coupon_scope.find( '.pp-coupons-grid-wrapper' ).data('page'),
				'widget_id':	$coupon_scope.data( 'id' ),
				'filter':		( category ) ? category : '',
				'taxonomy':		( taxonomy ) ? taxonomy : '',
				'page_number':	( page_count + 1 ),
				'ajax_for':     'coupon'
			};

			total = $coupon_scope.find( '.pp-posts-pagination' ).data( 'total' );

			if ( true == loadStatus ) {
				if ( page_count < total ) {
					coupon_loader.show();
					$( this ).hide();
					_callAjax( $coupon_scope, $args, true, page_count );
					page_count++;
					loadStatus = false;
				}
			}

		} else {
			var page_count = get_posts_count( $scope ),
			category = $scope.find( '.pp-filter-current' ).data( 'filter' ),
			taxonomy = $scope.find( '.pp-filter-current' ).data( 'taxonomy' );

			var $args = {
				'page_id':		$scope.find( '.pp-posts' ).data('page'),
				'widget_id':	$scope.data( 'id' ),
				'filter':		( category ) ? category : '',
				'taxonomy':		( taxonomy ) ? taxonomy : '',
				'skin':			$scope.find( '.pp-posts' ).data( 'skin' ),
				'page_number':	( page_count + 1 ),
				'ajax_for':     ''
			};

			total = $scope.find( '.pp-posts-pagination' ).data( 'total' );

			if ( true == loadStatus ) {

				if ( page_count < total ) {
					loader.show();
					$( this ).hide();
					_callAjax( $scope, $args, true, page_count );
					page_count++;
					loadStatus = false;
				}

			}
		}
	} );

	function get_posts_count( $scope ) {
		return $scope.find('.pp-post-load-more').data('count');
	}
	function set_posts_count( $scope, count ) {
		$scope.find('.pp-post-load-more').attr('data-count', count);
	}

	$( 'body' ).on( 'click', '.pp-posts-pagination-ajax .page-numbers', function( e ) {

		$scope = $( this ).closest( '.elementor-widget-pp-posts' );

		// Coupon widget
		var $coupon_scope = $( this ).closest( '.elementor-widget-pp-coupons' );
		
		if ( 'main' == $scope.find( '.pp-posts' ).data( 'query-type' ) ) {
			return;
		}

		e.preventDefault();

		if ( $coupon_scope.length > 0 ) {
			$coupon_scope.find( '.pp-coupons-grid-wrapper .pp-coupon' ).last().after( '<div class="pp-post-loader"><div class="pp-loader"></div><div class="pp-loader-overlay"></div></div>' );

			var page_number = 1;
			var curr = parseInt( $coupon_scope.find( '.pp-posts-pagination .page-numbers.current' ).html() );

			if ( $( this ).hasClass( 'next' ) ) {
				page_number = curr + 1;
			} else if ( $( this ).hasClass( 'prev' ) ) {
				page_number = curr - 1;
			} else {
				page_number = $( this ).html();
			}

			var $args = {
				'page_id':		$coupon_scope.find( '.pp-coupons-grid-wrapper' ).data('page'),
				'widget_id':	$coupon_scope.data( 'id' ),
				'filter':		$coupon_scope.find( '.pp-filter-current' ).data( 'filter' ),
				'taxonomy':		$coupon_scope.find( '.pp-filter-current' ).data( 'taxonomy' ),
				'page_number':	page_number,
				'ajax_for':     'coupon'
			};

			$('html, body').animate({
				scrollTop: ( ( $coupon_scope.find( '.pp-coupons-wrap' ).offset().top ) - 30 )
			}, 'slow');

			_callAjax( $coupon_scope, $args );

		} else {
			$scope.find( '.pp-posts .pp-post' ).last().after( '<div class="pp-post-loader"><div class="pp-loader"></div><div class="pp-loader-overlay"></div></div>' );

			var page_number = 1;
			var curr = parseInt( $scope.find( '.pp-posts-pagination .page-numbers.current' ).html() );

			if ( $( this ).hasClass( 'next' ) ) {
				page_number = curr + 1;
			} else if ( $( this ).hasClass( 'prev' ) ) {
				page_number = curr - 1;
			} else {
				page_number = $( this ).html();
			}

			var $args = {
				'page_id':		$scope.find( '.pp-posts' ).data('page'),
				'widget_id':	$scope.data( 'id' ),
				'filter':		$scope.find( '.pp-filter-current' ).data( 'filter' ),
				'taxonomy':		$scope.find( '.pp-filter-current' ).data( 'taxonomy' ),
				'skin':			$scope.find( '.pp-posts' ).data( 'skin' ),
				'page_number':	page_number,
				'ajax_for':     ''
			};

			$('html, body').animate({
				scrollTop: ( ( $scope.find( '.pp-posts-container' ).offset().top ) - 30 )
			}, 'slow');

			_callAjax( $scope, $args );
		}

	} );

	var _postsFilterAjax = function( $scope, $this, $coupon ) {

		if ( 'coupon' === $coupon ) {
			$scope.find( '.pp-coupons-grid-wrapper .pp-grid-item-wrap' ).last().after( '<div class="pp-posts-loader-wrap"><div class="pp-loader"></div><div class="pp-loader-overlay"></div></div>' );
			var $args = {
				'page_id':		$scope.find( '.pp-coupons-grid-wrapper' ).data('page'),
				'widget_id':	$scope.data( 'id' ),
				'filter':		$this.data( 'filter' ),
				'taxonomy':		$this.data( 'taxonomy' ),
				'page_number':	1,
				'ajax_for':     'coupon'
			};

			_callAjax( $scope, $args );
		} else {
			$scope.find( '.pp-posts .pp-grid-item-wrap' ).last().after( '<div class="pp-posts-loader-wrap"><div class="pp-loader"></div><div class="pp-loader-overlay"></div></div>' );

			var $args = {
				'page_id':		$scope.find( '.pp-posts' ).data('page'),
				'widget_id':	$scope.data( 'id' ),
				'filter':		$this.data( 'filter' ),
				'taxonomy':		$this.data( 'taxonomy' ),
				'skin':			$scope.find( '.pp-posts' ).data( 'skin' ),
				'page_number':	1,
				'ajax_for':     ''
			};

			_callAjax( $scope, $args );
		}
	}
    
    var _postsSearchAjax = function( $scope, $this ) {

		$scope.find( '.pp-posts .pp-grid-item-wrap' ).last().after( '<div class="pp-posts-loader-wrap"><div class="pp-loader"></div><div class="pp-loader-overlay"></div></div>' );

		var $args = {
			'page_id':		$scope.find( '.pp-posts' ).data('page'),
			'widget_id':	$scope.data( 'id' ),
			'search':		$scope.find( '.pp-search-form-input' ).val(),
			'page_number':	1
		};
        
		_callAjax( $scope, $args );
	}

	var _callAjax = function( $scope, $obj, $append, $count ) {

		var loader = $scope.find( '.pp-posts-loader' );
		
		$.ajax({
			url: pp_posts_script.ajax_url,
			data: {
				action:			'pp_get_post',
				page_id:		$obj.page_id,
				widget_id:		$obj.widget_id,
				category:		$obj.filter,
				search:			$obj.search,
				taxonomy:		$obj.taxonomy,
				skin:			$obj.skin,
				page_number:	$obj.page_number,
				ajax_for:		$obj.ajax_for,
				nonce:			pp_posts_script.posts_nonce,
			},
			dataType: 'json',
			type: 'POST',
			success: function( data ) {
				if ( 'coupon' === $obj.ajax_for ) {
					var sel = $scope.find( '.pp-coupons-grid-wrapper' );
					var not_found = $scope.find( '.pp-posts-empty' );

					not_found.remove();

					if ( $( not_found ).length == 0 ) {
						$(data.data.not_found).insertBefore(sel);
					}

					if ( true == $append ) {
						var html_str = data.data.html;
						sel.append( html_str );
					} else {
						sel.html( data.data.html );
					}

					$scope.find( '.pp-posts-pagination-wrap' ).html( data.data.pagination );

					//	Complete the process 'loadStatus'
					loadStatus = true;
					if ( true == $append ) {
						loader.hide();
						$scope.find( '.pp-post-load-more' ).show();
					}

					set_posts_count( $scope, $obj.page_number );
					
					$count = $count + 1;
					
					if( $count == total ) {
						$scope.find( '.pp-post-load-more' ).hide();
					}

					$scope.trigger('posts.rendered');

				} else {
					var sel = $scope.find( '.pp-posts' );
					var not_found = $scope.find( '.pp-posts-empty' );

					not_found.remove();

					if ( $( not_found ).length == 0 ) {
						$(data.data.not_found).insertBefore(sel);
					}

					if ( true == $append ) {

						var html_str = data.data.html;

						sel.append( html_str );
					} else {
						sel.html( data.data.html );
					}

					$scope.find( '.pp-posts-pagination-wrap' ).html( data.data.pagination );

					var layout = $scope.find( '.pp-posts' ).data( 'layout' ),
						selector = $scope.find( '.pp-posts' );

					if ( 'masonry' == layout ) {
						$scope.imagesLoaded( function() {
							selector.isotope( 'reloadItems' );
							selector.isotope({
								layoutMode: layout,
								itemSelector: '.pp-grid-item-wrap',
							});
						});
					}

					//	Complete the process 'loadStatus'
					loadStatus = true;
					if ( true == $append ) {
						loader.hide();
						$scope.find( '.pp-post-load-more' ).show();
					}

					set_posts_count( $scope, $obj.page_number );
					
					$count = $count + 1;
					
					if( $count == total ) {
						$scope.find( '.pp-post-load-more' ).hide();
					}

					$scope.trigger('posts.rendered');
				}
			}
		});

		setTimeout( () => {
			if ( $scope.find( '.elementor-invisible' ).length > 0 ) {
				$scope.find( '.elementor-invisible' ).removeClass( 'elementor-invisible' );
			}
		}, 1000 );
	}

	$( window ).on( 'elementor/frontend/init', function () {
        if ( elementorFrontend.isEditMode() ) {
			isEditMode = true;
		}

		elementorFrontend.hooks.addAction( 'frontend/element_ready/pp-posts.classic', PostsHandler );
		
		elementorFrontend.hooks.addAction( 'frontend/element_ready/pp-posts.card', PostsHandler );
		
		elementorFrontend.hooks.addAction( 'frontend/element_ready/pp-posts.checkerboard', PostsHandler );
		
		elementorFrontend.hooks.addAction( 'frontend/element_ready/pp-posts.creative', PostsHandler );
		
		elementorFrontend.hooks.addAction( 'frontend/element_ready/pp-posts.event', PostsHandler );
		
		elementorFrontend.hooks.addAction( 'frontend/element_ready/pp-posts.news', PostsHandler );
		
		elementorFrontend.hooks.addAction( 'frontend/element_ready/pp-posts.portfolio', PostsHandler );
		
		elementorFrontend.hooks.addAction( 'frontend/element_ready/pp-posts.overlap', PostsHandler );
		
		elementorFrontend.hooks.addAction( 'frontend/element_ready/pp-posts.template', PostsHandler );
		
		elementorFrontend.hooks.addAction( 'frontend/element_ready/pp-coupons.default', PostsHandler );

	});

} )( jQuery );
