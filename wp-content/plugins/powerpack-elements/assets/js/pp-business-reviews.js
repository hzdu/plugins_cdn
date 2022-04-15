( function( $ ) {

	var WidgetPPReviewsHandler = function( $scope, $ ) {

		if ( 'undefined' == typeof $scope ) {
			return;
		}

		var selector = $scope.find( '.pp-reviews-widget-wrapper' );

		if ( selector.length < 1 ) {
			return;
		}

		var layout  = selector.data( 'layout' ),
			skin_type = selector.data( 'review-skin' );

		/* Equal Height code */
		if( 'carousel' == layout ) {
			/* if( 'carousel' == layout ) {
				var slider_options  = selector.data( 'reviews_slider' );
				selector.slick( slider_options );
			}
			_equal_height( selector );

			selector.on( 'init', function() {
				_equal_height( selector );
			}); */

			if ( 'carousel' == layout ) {
				var carousel      = $scope.find( '.pp-swiper-slider' ),
					sliderOptions = selector.data( 'reviews_slider' );
			}

			if ( 'undefined' === typeof Swiper ) {
				var asyncSwiper = elementorFrontend.utils.swiper;
	
				new asyncSwiper( carousel, sliderOptions ).then( function( newSwiperInstance ) {
					var mySwiper = newSwiperInstance;
					//ppSwiperSliderAfterinit( carousel, carouselWrap, elementSettings, mySwiper );
				} );
			} else {
				var mySwiper = new Swiper(carousel, sliderOptions);
				//ppSwiperSliderAfterinit( carousel, carouselWrap, elementSettings, mySwiper );
			}
		}

		function _equal_height( widget_wrapper ) {

			var equal_height = widget_wrapper.data( 'equal-height' ),
				$parent_wrap = '.pp-review-wrap',
				$child_wrap = '.pp-review';

			if ( 'yes' !== equal_height ) {
				return;
			}

			var review_wrapper = widget_wrapper.find( $parent_wrap ),
				max_height = -1,
				wrapper_height = -1,
				box_active_height = -1;

			review_wrapper.each( function( i ) {

				var this_height = $( this ).outerHeight(),
					blog_post = $( this ).find( $child_wrap ),
					blog_post_height = blog_post.outerHeight();

				if( max_height < blog_post_height ) {
					max_height = blog_post_height;
					box_active_height = max_height + 15;
				}

				if ( wrapper_height < this_height ) {
					wrapper_height = this_height;
				}
			});

			review_wrapper.each( function( i ) {
				var selector = $( this ).find( $child_wrap );
				selector.animate({ height: max_height }, { duration: 0, easing: 'linear' });
			});

			if( "carousel" == layout ) {
				widget_wrapper.find('.slick-list.draggable').animate({ height: box_active_height }, { duration: 200, easing: 'linear' });
			}

			max_height = -1;
			wrapper_height = -1;

			review_wrapper.each(function() {

				var $this = jQuery( this ),
					selector = $this.find( $child_wrap ),
					blog_post_height = selector.outerHeight();

				if ( $this.hasClass('slick-active') ) {
					return true;
				}

				selector.css( 'height', blog_post_height );
			});

		}

	};

	$( window ).on( 'elementor/frontend/init', function () {

		elementorFrontend.hooks.addAction( 'frontend/element_ready/pp-business-reviews.default', WidgetPPReviewsHandler );

		elementorFrontend.hooks.addAction( 'frontend/element_ready/pp-business-reviews.classic', WidgetPPReviewsHandler );

		elementorFrontend.hooks.addAction( 'frontend/element_ready/pp-business-reviews.card', WidgetPPReviewsHandler );

	});

} )( jQuery );
