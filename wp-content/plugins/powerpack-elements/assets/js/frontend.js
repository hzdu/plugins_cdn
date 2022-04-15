(function ($) {
    'use strict';

    var getElementSettings = function( $element ) {
		var elementSettings = {},
			modelCID 		= $element.data( 'model-cid' );

		if ( isEditMode && modelCID ) {
			var settings     = elementorFrontend.config.elements.data[ modelCID ],
				settingsKeys = elementorFrontend.config.elements.keys[ settings.attributes.widgetType || settings.attributes.elType ];

			jQuery.each( settings.getActiveControls(), function( controlKey ) {
				if ( -1 !== settingsKeys.indexOf( controlKey ) ) {
					elementSettings[ controlKey ] = settings.attributes[ controlKey ];
				}
			} );
		} else {
			elementSettings = $element.data('settings') || {};
		}

		return elementSettings;
	};

    var isEditMode = false;

    var ppSwiperSliderinit = function (carousel, carouselWrap, elementSettings, sliderOptions) {
		if ( 'undefined' === typeof Swiper ) {
			var asyncSwiper = elementorFrontend.utils.swiper;

			new asyncSwiper( carousel, sliderOptions ).then( function( newSwiperInstance ) {
				var mySwiper = newSwiperInstance;
				ppSwiperSliderAfterinit( carousel, carouselWrap, elementSettings, mySwiper );
			} );
		} else {
			var mySwiper = new Swiper(carousel, sliderOptions);
			ppSwiperSliderAfterinit( carousel, carouselWrap, elementSettings, mySwiper );
		}
    };

	var ppSwiperSliderAfterinit = function (carousel, carouselWrap, elementSettings, mySwiper) {
		if ( 'yes' === elementSettings.pause_on_hover ) {
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

		ppWidgetUpdate( mySwiper, '.pp-swiper-slider', 'swiper' );
    };

    var ppSwiperSliderHandler = function ($scope, $) {
		var elementSettings = getElementSettings( $scope ),
			carouselWrap    = $scope.find('.swiper-container-wrap'),
            carousel        = $scope.find('.pp-swiper-slider'),
			sliderOptions   = ( carousel.attr('data-slider-settings') !== undefined ) ? JSON.parse( carousel.attr('data-slider-settings') ) : '';

		ppSwiperSliderinit(carousel, carouselWrap, elementSettings, sliderOptions);
	};

    var ppWidgetUpdate = function (slider, selector, type) {
		if( 'undefined' === typeof type ){
			type = 'swiper';
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
					if ( trigger == 'ppe-popup-opened' ) {
						wrap = $('.pp-modal-popup-' + wrap);
					}
					if ( wrap.find( selector ).length > 0 ) {
						setTimeout(function() {
							if ( 'slick' === type ) {
								slider.slick( 'setPosition' );
							} else if ( 'swiper' === type ) {
								slider.update();
							} else if ( 'gallery' === type ) {
								var $gallery = wrap.find('.pp-image-gallery').eq(0);
								$gallery.isotope( 'layout' );
							}
						}, 100);
					}
				});
			}
		});
	};

    var ImageHotspotHandler = function ($scope, $) {
		var id              = $scope.data('id'),
			hotspotsWrap    = $scope.find('.pp-image-hotspots'),
			tooltipOptions  = JSON.parse( hotspotsWrap.attr('data-tooltip-options') ),
			ppclass         = 'pp-tooltip' + ' pp-tooltip-' + id,
        	ttArrow         = tooltipOptions.arrow,
        	ttAlwaysOpen    = tooltipOptions.always_open,
			ttTrigger       = tooltipOptions.trigger,
			ttDistance      = tooltipOptions.distance,
			animation       = tooltipOptions.animation,
			tooltipWidth    = tooltipOptions.width,
			tooltipSize     = tooltipOptions.size,
			tooltipZindex   = tooltipOptions.zindex;

		if ( '' !== tooltipSize && undefined !== tooltipSize ) {
			ppclass += ' pp-tooltip-size-' + tooltipSize;
		}

		$('.pp-hot-spot-wrap[data-tooltip]').each(function () {
			var ttPosition   = $(this).data('tooltip-position');

			$( this ).pptooltipster({
				trigger:         ttTrigger,
				animation:       animation,
	        	minWidth:        tooltipWidth,
	        	maxWidth:        tooltipWidth,
				ppclass:         ppclass,
				position:        ttPosition,
	        	arrow:           ( 'yes' === ttArrow ),
	        	distance:        ttDistance,
	        	interactive:     true,
	        	positionTracker: true,
	        	zIndex:          tooltipZindex,
			});

			if ( ttAlwaysOpen === 'yes' ) {
				$(this).pptooltipster();
				$(this).pptooltipster('show');
			}
		});
    };

    var ImageComparisonHandler = function ($scope) {
		if ( 'undefined' === typeof $scope ) {
			return;
		}

        var imageComparisonElem = $scope.find('.pp-image-comparison').eq(0),
            settings            = imageComparisonElem.data('settings');
        
		$scope.imagesLoaded( function() {
			imageComparisonElem.twentytwenty({
				default_offset_pct:         settings.visible_ratio,
				orientation:                settings.orientation,
				before_label:               settings.before_label,
				after_label:                settings.after_label,
				move_slider_on_hover:       settings.slider_on_hover,
				move_with_handle_only:      settings.slider_with_handle,
				click_to_move:              settings.slider_with_click,
				no_overlay:                 settings.no_overlay
			});
		} );
    };

    var CounterHandler = function ($scope, $) {
        var counterElem   = $scope.find('.pp-counter').eq(0),
            target        = counterElem.data('target'),
            separator     = $scope.find('.pp-counter-number').data('separator'),
			separatorChar = $scope.find('.pp-counter-number').data('separator-char'),
			format        = ( separatorChar !== '' ) ? '(' + separatorChar + 'ddd).dd' : '(,ddd).dd';

		var counter = function () {
			$(target).each(function () {
				var to     = $(this).data('to'),
					speed  = $(this).data('speed'),
					od     = new Odometer({
						el:       this,
						value:    0,
						duration: speed,
						format:   (separator === 'yes') ? format : ''
					});
				od.render();
				setInterval(function () {
					od.update(to);
				});
			})
		}

		if ( 'undefined' !== typeof elementorFrontend.waypoint ) {
			elementorFrontend.waypoint(
				counterElem,
				counter,
				{ offset: '80%', triggerOnce: true }
			);
		}
	};

	var infoBoxEqualHeight = function($scope, $) {
		var activeSlide = $scope.find( '.swiper-slide-visible' ),
			maxHeight   = -1;

		activeSlide.each( function() {
            var $this         = $( this ),
                infoBox       = $this.find( '.pp-info-box-content-wrap' ),
                infoBoxHeight = infoBox.outerHeight();

            if ( maxHeight < infoBoxHeight ) {
                maxHeight = infoBoxHeight;
            }
        });

		activeSlide.each( function() {
            var selector = $( this ).find( '.pp-info-box-content-wrap' );

            selector.animate({ height: maxHeight }, { duration: 200, easing: 'linear' });
        });
	};

    var InfoBoxCarouselHandler = function ($scope, $) {
		var elementSettings = getElementSettings( $scope ),
			carouselWrap    = $scope.find('.swiper-container-wrap'),
            carousel        = $scope.find('.pp-info-box-carousel'),
			sliderOptions   = ( carousel.attr('data-slider-settings') !== undefined ) ? JSON.parse( carousel.attr('data-slider-settings') ) : '',
            equalHeight	    = elementSettings.equal_height_boxes;

		if ( 'undefined' === typeof Swiper ) {
			var asyncSwiper = elementorFrontend.utils.swiper;

			new asyncSwiper( carousel, sliderOptions ).then( function( newSwiperInstance ) {
				var mySwiper = newSwiperInstance;

				if ( equalHeight === 'yes' ) {
					mySwiper.on('slideChange', function () {
						infoBoxEqualHeight($scope, $);
					});
					//$(window).resize(infoBoxEqualHeight($scope, $));
				}

				ppSwiperSliderAfterinit( carousel, carouselWrap, elementSettings, mySwiper );
			} );
		} else {
			var mySwiper = new Swiper(carousel, sliderOptions);

			if ( equalHeight === 'yes' ) {
				infoBoxEqualHeight($scope, $);
				//$(window).resize(infoBoxEqualHeight($scope, $));
			}

			ppSwiperSliderAfterinit( carousel, carouselWrap, elementSettings, mySwiper );
		}
    };

    var InstaFeedHandler = function ($scope, $) {
        var widgetId		= $scope.data('id'),
			elementSettings = getElementSettings( $scope ),
			feed            = $scope.find('.pp-instagram-feed').eq(0),
            layout          = elementSettings.feed_layout;

		if ( ! feed.length ) {
			return;
		}

		if ( layout === 'carousel' ) {
			var carouselWrap  = $scope.find('.swiper-container-wrap'),
				carousel      = $scope.find('.swiper-container').eq(0),
				sliderOptions = JSON.parse( carousel.attr('data-slider-settings') );

			ppSwiperSliderinit(carousel, carouselWrap, elementSettings, sliderOptions);
		} else if (layout === 'masonry') {
			var grid = $('#pp-instafeed-' + widgetId).imagesLoaded( function() {
				grid.masonry({
					itemSelector:    '.pp-feed-item',
					percentPosition: true
				});
			});
		}
    };

    var ImageSliderAfter = function (carousel, carouselWrap, elementSettings, mySwiper, thumbsNav) {
		if ( 'yes' === elementSettings.pause_on_hover ) {
			carousel.on( 'mouseover', function() {
				mySwiper.autoplay.stop();
			});

			carousel.on( 'mouseout', function() {
				mySwiper.autoplay.start();
			});
		}

		if ( elementSettings.skin === 'slideshow' ) {
			thumbsNav.removeClass('pp-active-slide');
			thumbsNav.eq(0).addClass('pp-active-slide');

			mySwiper.on('slideChange', function () {
				var activeSlide = ( elementSettings.infinite_loop == 'yes' ) ? mySwiper.realIndex : mySwiper.activeIndex;

				thumbsNav.removeClass('pp-active-slide');
				thumbsNav.eq( activeSlide ).addClass('pp-active-slide');
			});
			
			var offset = elementSettings.infinite_loop ? 1 : 0;
			$(thumbsNav).on('click', function(){
				mySwiper.slideTo($(this).index() + offset, 500);
			});
		}

		if ( isEditMode ) {
			carouselWrap.resize( function() {
				mySwiper.update();
			});
		}

		ppWidgetUpdate( mySwiper, '.pp-image-slider', 'swiper' );
    };

    var ImageSliderHandler = function ( $scope, $ ) {
        var carousel         = $scope.find( '.pp-image-slider' ).eq( 0 ),
            slider_id        = carousel.attr( 'id' ),
            sliderOptions    = carousel.data('slider-settings'),
            fancyboxSettings = carousel.data('fancybox-settings'),
            carouselWrap     = $scope.find( '.pp-image-slider-wrap' ),
            thumbsNav        = $scope.find( '.pp-image-slider-container .pp-image-slider-thumb-item-wrap' ),
			elementSettings  = getElementSettings( $scope );

		if ( 'undefined' === typeof Swiper ) {
			var asyncSwiper = elementorFrontend.utils.swiper;

			new asyncSwiper( carousel, sliderOptions ).then( function( newSwiperInstance ) {
				var mySwiper = newSwiperInstance;
				ImageSliderAfter(carousel, carouselWrap, elementSettings, mySwiper, thumbsNav);
			} );
		} else {
			var mySwiper = new Swiper( carousel, sliderOptions );
			ImageSliderAfter(carousel, carouselWrap, elementSettings, mySwiper, thumbsNav);
		}
	
		var $lightbox_selector = '.pp-swiper-slide:not(.swiper-slide-duplicate) .pp-image-slider-slide-link[data-fancybox="' + slider_id + '"]';
	
		$($lightbox_selector).fancybox( fancyboxSettings );
    };

	var ModalPopupHandler = function ($scope, $) {
		if ( $scope.hasClass('pp-visibility-hidden') ) {
			return;
		}

		var popupElem        = $scope.find('.pp-modal-popup').eq(0),
			widgetId         = $scope.data('id'),
			elementSettings  = getElementSettings( $scope ),
			overlay          = elementSettings.overlay_switch,
			popupLayout      = 'pp-modal-popup-' + elementSettings.layout_type,
			closeButtonPos   = elementSettings.close_button_position,
			effect           = 'animated' + ' ' + elementSettings.popup_animation_in,
			popupType        = popupElem.data('type'),
			iframeClass      = popupElem.data('iframe-class'),
			src              = popupElem.data('src'),
			triggerElement   = popupElem.data('trigger-element'),
			delay            = popupElem.data('delay'),
			popupDisableOn   = popupElem.data('disable-on'),
			trigger          = elementSettings.trigger,
			preventScroll    = (elementSettings.prevent_scroll === 'yes') ? true : false,
			enableUrlTrigger = elementSettings.enable_url_trigger,
			popupId          = 'popup_' + widgetId,
			displayAfter     = popupElem.data('display-after'),
			mainClass        = ' ' + 'pp-modal-popup-' + widgetId + ' ' + popupLayout + ' ' + closeButtonPos + ' ' + effect,
			popupArgs        = {
				disableOn			: popupDisableOn,
				showCloseBtn		: (elementSettings.close_button === 'yes') ? true : false,
				enableEscapeKey		: (elementSettings.esc_exit === 'yes') ? true : false,
				closeOnBgClick		: (elementSettings.click_exit === 'yes') ? true : false,
				closeOnContentClick	: (elementSettings.content_close === 'yes') ? true : false,
				closeMarkup			: '<div class="mfp-close">&#215;</div>',
				closeBtnInside		: (closeButtonPos === 'win-top-left' || closeButtonPos === 'win-top-right') ? false : true,
				removalDelay		: 500,
				callbacks			: {
					open : function() {
						$(document).trigger('ppe-popup-opened', [ widgetId ]);
						if ( !preventScroll ) {
							$('html').css({ 'overflow' : '' });
						}
					},
					close : function() {
						if ( !preventScroll ) {
							$('html').css({ 'overflow' : 'hidden' });
						}
					}
				}
			};

		if ( elementorFrontend.isEditMode() ) {
			$.magnificPopup.close();

			if ( $( '#pp-modal-popup-wrap-' + widgetId ).hasClass( 'pp-popup-preview' ) ) {
				popupArgs.items = {
					src:  src,
					type: popupType
				};
				popupArgs.mainClass = mainClass;

				$.magnificPopup.open( popupArgs );
			}
		}

		if ( overlay !== 'yes' ) {
			mainClass += ' ' + 'pp-no-overlay';
		}

		var loadURLPopup = function( hashPopupId ) {
			if ( '' !== hashPopupId && undefined !== hashPopupId ) {
				src = $( "[data-url-identifier='" + hashPopupId + "']" ).data('src');
				if ( '' !== src && undefined !== src ) {
					popupArgs.items = {
						src:  src,
						type: popupType
					};
					popupArgs.mainClass = mainClass;
					$.magnificPopup.open( popupArgs );
				}
			}
		}

		$( window ).on( "load", function() {
			if ( 'yes' === enableUrlTrigger ) {
				var urlLink = window.location.href,
					hashPopupId = urlLink.split('#')[1];
					loadURLPopup( hashPopupId );
				
				$( 'a' ).click( function( evt ) {
					var url = $(this).attr('href');

					if ( url.indexOf('#') === 0 ) {
						var hashPopupId = url.split('#')[1];

						if ( '' !== hashPopupId ) {
							evt.preventDefault();
							loadURLPopup( hashPopupId );
						}
					}
				} );
			}
		} );

		var triggerButtonElement = $( '.pp-modal-popup-link' );
		// if is not disabled for particular device size then show the popup button.
		if ( ( undefined !== popupArgs.disableOn &&  $(window).width() > popupArgs.disableOn ) || ( undefined === popupArgs.disableOn ) ) {
			triggerButtonElement.show(); //show button when device disabled off.
			if ( trigger === 'exit-intent' ) {
				var mouseY   = 0,
					topValue = 0;

				if ( displayAfter === 0 ) {
					$.removeCookie(popupId, { path: '/' });
				}
				
				popupArgs.items = {
					src: src 
				};
				popupArgs.type = popupType;
				popupArgs.mainClass = 'mfp-fade mfp-fade-side';
				
				$(document).on( 'mouseleave', function( e ) {
					mouseY = e.clientY;
					if (mouseY < topValue && !$.cookie(popupId) ) {
						$.magnificPopup.open( popupArgs );

						if ( displayAfter > 0 ) {
							$.cookie(popupId, displayAfter, { expires: displayAfter, path: '/' });
						} else {
							$.removeCookie( popupId );
						}
					}
				} );
			}
			else if ( trigger === 'page-load' ) {
				if ( displayAfter === 0 ) {
					$.removeCookie(popupId, { path: '/' });
				}
				popupArgs.items = {
					src: src 
				};
				popupArgs.type = popupType;
				if ( !$.cookie(popupId) ) {
					setTimeout(function() {
						$.magnificPopup.open( popupArgs );

						if ( displayAfter > 0 ) {
							$.cookie(popupId, displayAfter, { expires: displayAfter, path: '/' });
						} else {
							$.removeCookie( popupId );
						}
					}, delay);
				}
			} else {
				if (typeof triggerElement === 'undefined' || triggerElement === '') {
					triggerElement = '.pp-modal-popup-link';
				}
				popupArgs.iframe = {
					markup: '<div class="' + iframeClass + '">'+
							'<div class="modal-popup-window-inner">'+
							'<div class="mfp-iframe-scaler">'+
								'<div class="mfp-close"></div>'+
								'<iframe class="mfp-iframe" frameborder="0" allowfullscreen></iframe>'+
							'</div>'+
							'</div>'+
							'</div>'
				};

				popupArgs.items = {
					src: src,
					type: popupType
				};
				popupArgs.mainClass = mainClass;
				$(triggerElement).magnificPopup(popupArgs);

				/* $(triggerElement).on('click', function () {
					src = $(this).parent().data('src'),
					popupType = $(this).parent().data('type'),
					popupArgs.items = {
						src:  src,
						type: popupType
					};
					popupArgs.mainClass = mainClass;
					$.magnificPopup.open(popupArgs);
				}); */
			}
		} else {
			triggerButtonElement.hide(); // hide button when device disabled on.
		}
	};

	var TableHandler = function ($scope, $) {
		var table_elem      = $scope.find('.pp-table').eq(0),
            elementSettings	= getElementSettings( $scope );
		
		if ( elementSettings.table_type === 'responsive' ) {
			
			if ( elementSettings.scrollable === 'yes' && elementSettings.breakpoint > 0 ) {
				if ( jQuery(window).width() >= elementSettings.breakpoint ) {
					jQuery( table_elem ).removeAttr('data-tablesaw-mode');
				}
			}
			
			$( document ).trigger( 'enhance.tablesaw' );
		}
	};

	var AdvancedTabsHandler = function ($scope, $) {
		new PPAdvancedTabs( $scope, $ );
	};

	var PPCountdownHandler = function ($scope, $) {
		var settings = JSON.parse( $scope.find('[name=pp-countdown-settings]').val() );

		new PPCountdown( settings, $scope, $ );
	};

    var ToggleHandler = function ($scope, $) {
        var toggleElem            = $scope.find('.pp-toggle-container').eq(0),
			toggleSwitchContainer = $(toggleElem).find('.pp-toggle-switch-container'),
			toggleSwitch          = $(toggleElem).find('.pp-toggle-switch'),
			labelPrimary          = $(toggleElem).find('.pp-primary-toggle-label'),
			labelSecondary        = $(toggleElem).find('.pp-secondary-toggle-label'),
			sectionPrimary        = $(toggleElem).find('.pp-toggle-section-primary'),
			sectionSecondary      = $(toggleElem).find('.pp-toggle-section-secondary');
		
			toggleSwitch.on('click', function() {
				sectionPrimary.toggle(0, 'swing', function() {
					toggleSwitchContainer.toggleClass('pp-toggle-switch-on');
				});
				sectionSecondary.toggle();

				toggleSwitch.prop('checked', false);
				if ( labelPrimary.hasClass('pp-toggle-active') ) {
					labelPrimary.removeClass('pp-toggle-active');
					labelSecondary.addClass('pp-toggle-active');
				} else {
					labelPrimary.addClass('pp-toggle-active');
					labelSecondary.removeClass('pp-toggle-active');
				}

				if ( sectionPrimary.is(":visible") ) {
					$(document).trigger('ppe-toggle-switched', [ sectionPrimary ]);
				} else {
					$(document).trigger('ppe-toggle-switched', [ sectionSecondary ]);
				}
			});

			/* Primary Label Click */
			labelPrimary.on('click', function() {
				toggleSwitch.prop('checked', false);
				toggleSwitchContainer.removeClass('pp-toggle-switch-on');
				$(this).addClass('pp-toggle-active');
				labelSecondary.removeClass('pp-toggle-active');
				sectionPrimary.show();
				sectionSecondary.hide();

				$(document).trigger('ppe-toggle-switched', [ sectionPrimary ]);
			});

			/* Secondary Label Click */
			labelSecondary.on('click', function() {
				toggleSwitch.prop('checked', true);
				toggleSwitchContainer.addClass('pp-toggle-switch-on');
				$(this).addClass('pp-toggle-active');
				labelPrimary.removeClass('pp-toggle-active');
				sectionSecondary.show();
				sectionPrimary.hide();

				$(document).trigger('ppe-toggle-switched', [ sectionSecondary ]);
			});
    };

	var AdvancedMenuHandler = function ($scope) {
		var elementSettings  = getElementSettings( $scope );

		new PPAdvancedMenu( $scope, elementSettings );
		
	};

    var ImageGalleryHandler = function ($scope, $) {
		var galleryContainer = $scope.find('.pp-image-gallery-container').eq(0),
			gallery          = $scope.find('.pp-image-gallery').eq(0),
			elementSettings  = getElementSettings( $scope ),
        	justifiedGallery = $scope.find('.pp-image-gallery-justified').eq(0),
            widgetId         = $scope.data( 'id' ),
            galleryId        = gallery.attr( 'id' ),
            lightboxLibrary  = elementSettings.lightbox_library,
            fancyboxSettings = gallery.data('fancybox-settings'),
            settings         = galleryContainer.data('settings'),
            cachedItems      = [],
            cachedIds        = [];

        if ( ! isEditMode ) {
            if ( gallery.hasClass('pp-image-gallery-masonry') || gallery.hasClass('pp-image-gallery-filter-enabled') || settings.pagination === 'yes' ) {
                var layoutMode = 'fitRows';

                if ( gallery.hasClass('pp-image-gallery-masonry') ) {
                    layoutMode = 'masonry';
                }

				var filterItems = $scope.find( '.pp-gallery-filters .pp-gallery-filter' ),
					defaultFilter = '';

				$(filterItems).each(function() {
					if ( defaultFilter === '' || defaultFilter === undefined ) {
						defaultFilter = $(this).attr('data-default');
					}
				});

                var $isotope_args = {
						itemSelector    : '.pp-grid-item-wrap',
						layoutMode		: layoutMode,
						percentPosition : true,
						filter          : defaultFilter,
					},
                    isotopeGallery = {};

                $scope.imagesLoaded( function() {
                    isotopeGallery = gallery.isotope( $isotope_args );
                    gallery.find('.pp-gallery-slide-image').on('load', function() {
						if ( $(this).hasClass('lazyloaded') ) {
							return;
						}
						setTimeout(function() {
							gallery.isotope( 'layout' );
						}, 500);
					});
                });

                $scope.on( 'click', '.pp-gallery-filter', function() {
                    var $this = $(this),
                        filterValue = $this.attr('data-filter'),
						filterIndex = $this.attr('data-gallery-index'),
						galleryItems = gallery.find(filterValue);

					if ( filterValue === '*' ) {
						galleryItems = gallery.find('.pp-grid-item-wrap');
					}

					$(galleryItems).each(function() {
						var imgLink = $(this).find('.pp-image-gallery-item-link');
						if ( lightboxLibrary === 'fancybox' ) {
							imgLink.attr('data-fancybox', filterIndex + '_' + widgetId);	
						} else {
							imgLink.attr('data-elementor-lightbox-slideshow', filterIndex + '_' + widgetId);
						}
					});

                    $this.siblings().removeClass('pp-active');
                    $this.addClass('pp-active');

                    isotopeGallery.isotope({ filter: filterValue });
                });

				$('.pp-filters-dropdown').on( 'change', function() {
					// get filter value from option value
					var filterValue = this.value;

					isotopeGallery.isotope({ filter: filterValue });
				});

				// Trigger filter by hash parameter in URL.
				gallery_hashchange();

				// Trigger filter on hash change in URL.
				$( window ).on( 'hashchange', function() {
					gallery_hashchange();
				} );

				ppWidgetUpdate(gallery, '.pp-image-gallery', 'gallery');
			}
        }

		var tiltEnable = (settings.tilt_enable !== undefined) ? settings.tilt_enable : '';

        if ( tiltEnable === 'yes' ) {
            $( gallery ).find('.pp-image-gallery-thumbnail-wrap').tilt({
                disableAxis: settings.tilt_axis,
                maxTilt: settings.tilt_amount,
                scale: settings.tilt_scale,
                speed: settings.tilt_speed,
				perspective: 1000
            });
		}

		if ( justifiedGallery.length > 0 ) {
			justifiedGallery.imagesLoaded( function() {
			})
			.done(function( instance ) {
				justifiedGallery.justifiedGallery({
				    rowHeight : settings.row_height,
				    lastRow : settings.last_row,
				    selector : 'div',
				    waitThumbnailsLoad : true,
				    margins : 0,
				    border : 0
				});
			});
		}

		var lightboxSelector = '.pp-grid-item-wrap .pp-image-gallery-item-link[data-fancybox="' + galleryId + '"]';

		if ( $(lightboxSelector).length > 0 ) {
			$(lightboxSelector).fancybox( fancyboxSettings );
		}
		
		gallery.find('.pp-grid-item-wrap').each(function() {
			cachedIds.push( $(this).data('item-id') );
		});
		
		// Load More
		$scope.find('.pp-gallery-load-more').on('click', function(e) {
			e.preventDefault();

			var $this = $(this);
			$this.addClass('disabled pp-loading');

			if ( cachedItems.length > 0 ) {
				gallery_render_items();
			} else {
				var data = {
					action: 'pp_gallery_get_images',
					pp_action: 'pp_gallery_get_images',
					settings: settings
				};

				$.ajax({
					type: 'post',
					url: window.location.href.split( '#' ).shift(),
					data: data,
					success: function(response) {
						if ( response.success ) {
							var items = response.data.items;
							if ( items ) {
								$(items).each(function() {
									if ( $(this).hasClass('pp-grid-item-wrap') ) {
										cachedItems.push( this );
									}
								});
							}

							gallery_render_items();
						}
					},
					error: function(xhr, desc) {
						console.log(desc);
					}
				});
			}
		});

		function gallery_hashchange() {
			setTimeout(function() {
				if ( location.hash && $(location.hash).length > 0 ) {
					if ( $(location.hash).parent().hasClass('pp-gallery-filters') ) {
						$(location.hash).trigger('click');
					}
				}
			}, 500);
		}

		function gallery_render_items() {
			$scope.find('.pp-gallery-load-more').removeClass( 'disabled pp-loading' );

			if ( cachedItems.length > 0 ) {
				var count = 1;
				var items = [];

				$(cachedItems).each(function() {
					var id = $(this).data('item-id');

					if ( -1 === $.inArray( id, cachedIds ) ) {
						if ( count <= parseInt( settings.per_page, 10 ) ) {
							cachedIds.push( id );
							items.push( this );
							count++;
						} else {
							return false;
						}
					}
				});

				if ( items.length > 0 ) {
					items = $(items);

					items.imagesLoaded( function() {
						gallery.isotope('insert', items);
						setTimeout(function() {
							gallery.isotope('layout');
						}, 500);

						if ( tiltEnable === 'yes' ) {
							$( gallery ).find('.pp-grid-item').tilt({
								disableAxis: settings.tilt_axis,
								maxTilt: settings.tilt_amount,
								scale: settings.tilt_scale,
								speed: settings.tilt_speed
							});
						}
					});
				}

				if ( cachedItems.length === cachedIds.length ) {
					$scope.find('.pp-gallery-pagination').hide();
				}

				var lightboxSelector = '.pp-grid-item-wrap .pp-image-gallery-item-link[data-fancybox="' + galleryId + '"]';

				if ( $(lightboxSelector).length > 0 ) {
					$(lightboxSelector).fancybox({
						loop: true
					});
				}
			}
		}
	};

	var OffCanvasContentHandler = function ($scope, $) {
		var content_wrap = $scope.find('.pp-offcanvas-content-wrap');
		
		if ( $(content_wrap).length > 0 ) {
			new PPOffcanvasContent( $scope );
		}
	};

	var PPButtonHandler = function ( $scope ) {
		var id = $scope.data('id'),
			ppclass = 'pp-tooltip' + ' pp-tooltip-' + id,
			ttipPosition = $scope.find('.pp-button[data-tooltip]').data('tooltip-position'),
			elementorBreakpoints = elementorFrontend.config.breakpoints;

		// tablet
		if ( window.innerWidth <= elementorBreakpoints.lg && window.innerWidth >= elementorBreakpoints.md ) {
			ttipPosition = $scope.find('.pp-button[data-tooltip]').data('tooltip-position-tablet');
		}
		// mobile
		if ( window.innerWidth < elementorBreakpoints.md ) {
			ttipPosition = $scope.find('.pp-button[data-tooltip]').data('tooltip-position-mobile');
		}

		$scope.find('.pp-button[data-tooltip]').pptooltipster({
			trigger : 'hover',
			animation : 'fade',
			ppclass : ppclass,
			side : ttipPosition,
			interactive : true,
			positionTracker : true,
		});
	};

	var PPVideo = {

	   /**
		* Auto Play Video
		*/

	   _play: function( $selector, outerWrap ) {
			var $iframe  = $( '<iframe/>' ),
		   		$vidSrc = $selector.data( 'src' );

			if ( 0 === $selector.find( 'iframe' ).length ) {
				$iframe.attr( 'src', $vidSrc );
				$iframe.attr( 'frameborder', '0' );
				$iframe.attr( 'allowfullscreen', '1' );
				$iframe.attr( 'allow', 'autoplay;encrypted-media;' );
				$selector.html( $iframe );
				if ( outerWrap.hasClass( 'pp-video-type-hosted' ) ) {
					var hostedVideoHtml = JSON.parse( outerWrap.data( 'hosted-html' ) );
					$iframe.on( 'load', function() {
						var hostedVideoIframe = $iframe.contents().find( 'body' );
						hostedVideoIframe.html( hostedVideoHtml );
						$iframe.contents().find( 'video' ).css( {"width":"100%", "height":"100%"} );
						$iframe.contents().find( 'video' ).attr( 'autoplay','autoplay' );
				   });
			   }
		   }
	   }
   };

    var ShowcaseHandler = function ( $scope, $ ) {
        var carousel             = $scope.find( '.pp-showcase-preview' ).eq( 0 ),
			sliderOptions        = ( carousel.attr('data-slider-settings') !== undefined ) ? JSON.parse( carousel.attr('data-slider-settings') ) : '',
            showcaseId           = carousel.attr( 'id' ),
            $rtl     			 = carousel.data( 'rtl' ),
            $slider_wrap         = $scope.find( '.pp-showcase-preview-wrap' ),
            $nav_wrap            = $scope.find( '.pp-showcase-navigation-items' ),
            $nav                 = $scope.find( '.pp-showcase .pp-showcase-navigation-item-wrap' ),
            $video_play          = $scope.find( '.pp-showcase .pp-video-play' ),
            elementSettings      = getElementSettings( $scope ),
            scrollableNav        = elementSettings.scrollable_nav,
            previewPosition      = elementSettings.preview_position,
            stackOn              = elementSettings.preview_stack,
			elementorBreakpoints = elementorFrontend.config.breakpoints;

            carousel.slick({
                slidesToShow:   1,
				slidesToScroll: 1,
                autoplay:       'yes' === elementSettings.autoplay,
                autoplaySpeed:  elementSettings.autoplay_speed,
                arrows:         'yes' === elementSettings.arrows,
                prevArrow:      sliderOptions.prevArrow,
				nextArrow:      sliderOptions.nextArrow,
                dots:           'yes' === elementSettings.dots,
                fade:           'fade' === elementSettings.effect,
                speed:          elementSettings.animation_speed,
                infinite:       'yes' === elementSettings.infinite_loop,
                pauseOnHover:   'yes' === elementSettings.pause_on_hover,
                adaptiveHeight: 'yes' === elementSettings.adaptive_height,
                rtl:            'yes' === $rtl,
                asNavFor:       ( scrollableNav === 'yes' ) ? $nav_wrap : ''
            });

            carousel.slick( 'setPosition' );

            if ( scrollableNav === 'yes' ) {
                
                $nav_wrap.slick({
                    slidesToShow:   ( elementSettings.nav_items !== undefined && elementSettings.nav_items !== '' ) ? parseInt( elementSettings.nav_items , 10) : 5,
                    slidesToScroll: 1,
                    asNavFor:       carousel,
                    arrows:         false,
                    dots:           false,
                    infinite:       'yes' === elementSettings.infinite_loop,
                    focusOnSelect:  true,
                    vertical:       (previewPosition === 'top' || previewPosition === 'bottom') ? false : true,
                    centerMode:     'yes' === elementSettings.nav_center_mode,
                    centerPadding:  '0px',
                    responsive:     [
                        {
                        breakpoint: elementorBreakpoints.lg,
                            settings: {
                                slidesToShow: ( elementSettings.nav_items_tablet !== undefined && elementSettings.nav_items_tablet !== '' ) ? parseInt( elementSettings.nav_items_tablet, 10 ) : 3,
                                slidesToScroll: 1,
                                vertical: ( stackOn === undefined ) ? false : ( ( stackOn === 'tablet' ) ? false : true )
                            }
                        },
                        {
                        breakpoint: elementorBreakpoints.md,
                            settings: {
                                slidesToShow: ( elementSettings.nav_items_mobile !== undefined && elementSettings.nav_items_mobile !== '' ) ? parseInt( elementSettings.nav_items_mobile, 10 ) : 2,
                                slidesToScroll: 1,
                                vertical: false
                            }
                        }
                    ]
                });
                
            } else {
                
                $nav.removeClass('pp-active-slide');
                $nav.eq(0).addClass('pp-active-slide');

                carousel.on('beforeChange', function ( event, slick, currentSlide, nextSlide ) {
                    currentSlide = nextSlide;
                    $nav.removeClass('pp-active-slide');
                    $nav.eq( currentSlide ).addClass('pp-active-slide');
                });

                $nav.each( function( currentSlide ) {
                    $(this).on( 'click', function ( e ) {
                        e.preventDefault();
                        carousel.slick( 'slickGoTo', currentSlide );
                    });
                });
                
            }
		
			ppWidgetUpdate( carousel, '.pp-showcase', 'slick' );

            if ( isEditMode ) {
                $slider_wrap.resize( function() {
                    carousel.slick( 'setPosition' );
                });
            }
        
            var $lightbox_selector = '.slick-slide:not(.slick-cloned) .pp-showcase-item-link[data-fancybox="' + showcaseId + '"]';
        
            $($lightbox_selector).fancybox({
                loop: true
            });
			
			$video_play.off( 'click' ).on( 'click', function( e ) {

				e.preventDefault();
				
				var $video_player 	= $( this ).find( '.pp-video-player' );
	
				PPVideo._play( $video_player );
	
			});
    };
    
    var TimelineHandler = function ( $scope, $ ) {
        var $carousel            = $scope.find( '.pp-timeline-horizontal .pp-timeline-items' ).eq( 0 ),
            $slider_wrap         = $scope.find( '.pp-timeline-wrapper' ),
            $rtl				 = $slider_wrap.data( 'rtl' ),
            $slider_nav          = $scope.find( '.pp-timeline-navigation' ),
            arrowNext            = ( $slider_nav.data( 'nav-arrow' ) !== undefined ) ? JSON.parse( $slider_nav.data( 'nav-arrow' ) ) : '',
            arrowPrev            = ( arrowNext !== undefined ) ? arrowNext.replaceAll( 'right', 'left' ) : '',
            elementSettings      = getElementSettings( $scope ),
			$items               = ( elementSettings.columns !== undefined && elementSettings.columns !== '' ) ? parseInt( elementSettings.columns, 10 ) : 3,
			$items_tablet        = ( elementSettings.columns_tablet !== undefined && elementSettings.columns_tablet !== '' ) ? parseInt( elementSettings.columns_tablet, 10 ) : 2,
			$items_mobile        = ( elementSettings.columns_mobile !== undefined && elementSettings.columns_mobile !== '' ) ? parseInt( elementSettings.columns_mobile, 10 ) : 1,
			slidesToScroll       = ( elementSettings.slides_to_scroll !== undefined && elementSettings.slides_to_scroll !== '' ) ? parseInt( elementSettings.slides_to_scroll, 10 ) : 3,
			slidesToScrollTablet = ( elementSettings.slides_to_scroll_tablet !== undefined && elementSettings.slides_to_scroll_tablet !== '' ) ? parseInt( elementSettings.slides_to_scroll_tablet, 10 ) : 2,
			slidesToScrollMobile = ( elementSettings.slides_to_scroll_mobile !== undefined && elementSettings.slides_to_scroll_mobile !== '' ) ? parseInt( elementSettings.slides_to_scroll_mobile, 10 ) : 1,
			elementorBreakpoints = elementorFrontend.config.breakpoints;

		if ( elementSettings.layout === 'horizontal' ) {
			var $center_mode = false;

			if ( isEditMode ) {
				var arrowNext = ( 'undefined' !== typeof elementSettings.select_arrow ) ? elementSettings.select_arrow.value : '',
					arrowPrev = ( arrowNext !== undefined ) ? arrowNext.replace( 'right', 'left' ) : '';

				arrowNext = '<i class="' + arrowNext + '"></i>';
				arrowPrev = '<i class="' + arrowPrev + '"></i>';
			}
			
			if ( 'yes' === elementSettings.infinite_loop && 'yes' === elementSettings.center_mode ) {
				$center_mode = true;
			}
			
			$carousel.slick({
				slidesToShow:   $items,
				slidesToScroll: slidesToScroll,
				autoplay:       'yes' === elementSettings.autoplay,
				autoplaySpeed:  elementSettings.autoplay_speed,
				arrows:         false,
				pauseOnHover:   'yes' === elementSettings.pause_on_hover,
				pauseOnFocus:   'yes' === elementSettings.pause_on_hover,
				dots:           'yes' === elementSettings.dots,
				centerMode:     $center_mode,
				speed:          elementSettings.animation_speed,
				infinite:       'yes' === elementSettings.infinite_loop,
				rtl:            'yes' === $rtl,
				asNavFor:       $slider_nav,
				responsive: [
					{
					breakpoint: elementorBreakpoints.lg,
						settings: {
							slidesToShow: $items_tablet,
							slidesToScroll: slidesToScrollTablet
						}
					},
					{
					breakpoint: elementorBreakpoints.md,
						settings: {
							slidesToShow: $items_mobile,
							slidesToScroll: slidesToScrollMobile
						}
					}
				]
			});

			$slider_nav.slick({
				slidesToShow:   $items,
				slidesToScroll: slidesToScroll,
				autoplay:       'yes' === elementSettings.autoplay,
				autoplaySpeed:  elementSettings.autoplay_speed,
				asNavFor:       $carousel,
				arrows:         'yes' === elementSettings.arrows,
				pauseOnHover:   'yes' === elementSettings.pause_on_hover,
				pauseOnFocus:   'yes' === elementSettings.pause_on_hover,
				prevArrow:      '<div class="pp-slider-arrow pp-arrow pp-arrow-prev">' + arrowPrev + '</div>',
				nextArrow:      '<div class="pp-slider-arrow pp-arrow pp-arrow-next">' + arrowNext + '</div>',
				centerMode:     'yes' === elementSettings.center_mode,
				infinite:       'yes' === elementSettings.infinite_loop,
				rtl:            'yes' === $rtl,
				focusOnSelect:  true,
				responsive: [
					{
					breakpoint: elementorBreakpoints.lg,
						settings: {
							slidesToShow: $items_tablet,
							slidesToScroll: slidesToScrollTablet
						}
					},
					{
					breakpoint: elementorBreakpoints.md,
						settings: {
							slidesToShow: $items_mobile,
							slidesToScroll: slidesToScrollMobile
						}
					}
				]
			});

			$carousel.slick( 'setPosition' );

			if ( isEditMode ) {
				$slider_wrap.resize( function() {
					$carousel.slick( 'setPosition' );
				});
			}

			// When user hover then pause and after hover start Slider.
			if ( 'yes' === elementSettings.pause_on_hover ) {
				$scope.find( '.pp-timeline-card' ).mouseover(function() {
					$carousel.slick( 'slickPause' );
					$slider_nav.slick( 'slickPause' );
				});

				$scope.find( '.pp-timeline-card' ).mouseleave(function() {
					$carousel.slick( 'slickPlay' );
					$slider_nav.slick( 'slickPlay' );
				});
			}

			ppWidgetUpdate( $carousel, '.pp-timeline-horizontal .pp-timeline-items', 'slick' );
			ppWidgetUpdate( $slider_nav, '.pp-timeline-navigation', 'slick' );
		}

		// PPTimeline
		var settings = {};

		if ( isEditMode ) {
			settings.window = elementor.$previewContents;
		}

		var timeline = new PPTimeline( settings, $scope );
    };

    var CardSliderHandler = function ($scope, $) {
		var elementSettings = getElementSettings( $scope ),
			carouselWrap    = $scope.find('.swiper-container-wrap'),
			carousel        = $scope.find('.pp-swiper-slider'),
			carouselItem    = $scope.find('.pp-card-slider-item'),
			sliderOptions   = JSON.parse( carousel.attr('data-slider-settings') ),
			height          = 0;

		ppSwiperSliderinit(carousel, carouselWrap, elementSettings, sliderOptions);

		carouselItem.each(function () {
			if ( $(this).height() > height) {
				height = $(this).height();
			}
		});

		carousel.css( 'height', (height + 70) + 'px' );
    };

    var ImageAccordionHandler = function ($scope, $) {
		var imageAccordion  = $scope.find('.pp-image-accordion').eq(0),
            elementSettings = getElementSettings( $scope ),
            $action         = elementSettings.accordion_action,
		    $id             = imageAccordion.attr( 'id' ),
		    $item           = $('#'+ $id +' .pp-image-accordion-item');
		   
		if ( 'on-hover' === $action ) {
            $item.hover(
                function ImageAccordionHover() {
                    $item.css('flex', '1');
                    $item.removeClass('pp-image-accordion-active');
                    $(this).addClass('pp-image-accordion-active');
                    $item.find('.pp-image-accordion-content-wrap').removeClass('pp-image-accordion-content-active');
                    $(this).find('.pp-image-accordion-content-wrap').addClass('pp-image-accordion-content-active');
                    $(this).css('flex', '3');
                },
                function() {
                    $item.css('flex', '1');
                    $item.find('.pp-image-accordion-content-wrap').removeClass('pp-image-accordion-content-active');
                    $item.removeClass('pp-image-accordion-active');
                }
            );
        }
		else if ( 'on-click' === $action ) {
            $item.click( function(e) {
                e.stopPropagation(); // when you click the button, it stops the page from seeing it as clicking the body too
                $item.css('flex', '1');
				$item.removeClass('pp-image-accordion-active');
                $(this).addClass('pp-image-accordion-active');
				$item.find('.pp-image-accordion-content-wrap').removeClass('pp-image-accordion-content-active');
				$(this).find('.pp-image-accordion-content-wrap').addClass('pp-image-accordion-content-active');
                $(this).css('flex', '3');
            });

            $('#'+ $id).click( function(e) {
                e.stopPropagation(); // when you click within the content area, it stops the page from seeing it as clicking the body too
            });

            $('body').click( function() {
                $item.css('flex', '1');
				$item.find('.pp-image-accordion-content-wrap').removeClass('pp-image-accordion-content-active');
				$item.removeClass('pp-image-accordion-active');
            });
		}
    };
    
    var AdvancedAccordionHandler = function ($scope, $) {
    	var accordionTitle  = $scope.find('.pp-accordion-tab-title'),
            elementSettings = getElementSettings( $scope ),
        	accordionType   = elementSettings.accordion_type,
        	accordionSpeed  = elementSettings.toggle_speed;
	
        // Open default actived tab
        accordionTitle.each(function(){
            if ( $(this).hasClass('pp-accordion-tab-active-default') ) {
                $(this).addClass('pp-accordion-tab-show pp-accordion-tab-active');
                $(this).next().slideDown(accordionSpeed);
            }
        });

        // Remove multiple click event for nested accordion
        accordionTitle.unbind('click');

        accordionTitle.click(function(e) {
            e.preventDefault();

            var $this = $(this),
				$item = $this.parent();
			
			$(document).trigger('ppe-accordion-switched', [ $item ]);

            if ( accordionType === 'accordion' ) {
                if ( $this.hasClass('pp-accordion-tab-show') ) {
                    $this.closest('.pp-accordion-item').removeClass('pp-accordion-item-active');
                    $this.removeClass('pp-accordion-tab-show pp-accordion-tab-active');
					$this.attr('aria-expanded', 'false');
                    $this.next().slideUp(accordionSpeed);
                } else {
                    $this.closest('.pp-advanced-accordion').find('.pp-accordion-item').removeClass('pp-accordion-item-active');
                    $this.closest('.pp-advanced-accordion').find('.pp-accordion-tab-title').removeClass('pp-accordion-tab-show pp-accordion-tab-active');
                    $this.closest('.pp-advanced-accordion').find('.pp-accordion-tab-title').removeClass('pp-accordion-tab-active-default');
                    $this.closest('.pp-advanced-accordion').find('.pp-accordion-tab-content').slideUp(accordionSpeed);
                    $this.toggleClass('pp-accordion-tab-show pp-accordion-tab-active');
					$this.closest('.pp-advanced-accordion').find('.pp-accordion-tab-title').attr('aria-expanded', 'false');
                    $this.closest('.pp-accordion-item').toggleClass('pp-accordion-item-active');
					if ( $this.hasClass('pp-accordion-tab-title') ) {
						$this.attr('aria-expanded', 'true');
					}
                    $this.next().slideToggle(accordionSpeed);
                }
            } else {
                // For acccordion type 'toggle'
                if ( $this.hasClass('pp-accordion-tab-show') ) {
                    $this.removeClass('pp-accordion-tab-show pp-accordion-tab-active');
                    $this.next().slideUp(accordionSpeed);
                } else {
                    $this.addClass('pp-accordion-tab-show pp-accordion-tab-active');
                    $this.next().slideDown(accordionSpeed);
                }
			}
        });

		// Trigger filter by hash parameter in URL.
		advanced_accordion_hashchange();

		// Trigger filter on hash change in URL.
		$( window ).on( 'hashchange', function() {
			advanced_accordion_hashchange();
		} );
    };

	function advanced_accordion_hashchange() {
		if ( location.hash && $(location.hash).length > 0 ) {
			var element = $(location.hash + '.pp-accordion-tab-title');

			if ( element && element.length > 0 ) {
				location.href = '#';
				$('html, body').animate({
					scrollTop: ( element.parents('.pp-accordion-item').offset().top - 50 ) + 'px'
				}, 500, function() {
					if ( ! element.parents('.pp-accordion-item').hasClass('pp-accordion-item-active') ) {
						element.trigger('click');
					}
				});
			}
		}
	}

    var MagazineSliderHandler = function ( $scope, $ ) {
        var carousel        = $scope.find( '.pp-magazine-slider' ).eq( 0 ),
			carouselWrap    = $scope.find( '.pp-magazine-slider-wrap' ),
			sliderOptions   = carousel.data( 'slider-settings' ),
            elementSettings = getElementSettings( $scope );

		ppSwiperSliderinit(carousel, carouselWrap, elementSettings, sliderOptions);
    };

    var VideoHandler = function ($scope, $) {
		var outerWrap  = $scope.find( '.pp-video' ),
			videoPlay  = $scope.find( '.pp-video-play' ),
		    isLightbox = videoPlay.hasClass( 'pp-video-play-lightbox' );
        
		videoPlay.off( 'click' ).on( 'click', function( e ) {

			e.preventDefault();
			
			var $selector = $( this ).find( '.pp-video-player' );

			if( ! isLightbox ) {
				PPVideo._play( $selector, outerWrap );
			}

		});

		if ( videoPlay.data( 'autoplay' ) == '1' && ! isLightbox ) {

			PPVideo._play( $scope.find( '.pp-video-player' ), outerWrap );
			
		}
	};

    var VideoGalleryHandler = function ($scope, $) {
        var $gallery        = $scope.find('.pp-video-gallery').eq(0),
            elementSettings = getElementSettings( $scope ),
            videoPlay       = $scope.find( '.pp-video-play' ),
            $action         = $gallery.data( 'action' );

        if ( $action === 'inline') {
            videoPlay.off( 'click' ).on( 'click', function( e ) {

                e.preventDefault();

                var $iframe = $( '<iframe/>' ),
                    $vid_src = $( this ).data( 'src' ),
                    $player = $( this ).find( '.pp-video-player' );

                $iframe.attr( 'src', $vid_src );
                $iframe.attr( 'frameborder', '0' );
                $iframe.attr( 'allowfullscreen', '1' );
                $iframe.attr( 'allow', 'autoplay;encrypted-media;' );

                $player.html( $iframe );
            });
		}
        
        if ( ! isEditMode ) {
            if ( elementSettings.layout === 'grid' ) {
                if ( $gallery.hasClass('pp-video-gallery-filter-enabled') ) {
                    var $isotope_args = {
                            itemSelector    : '.pp-grid-item-wrap',
                            layoutMode		: 'fitRows',
                            percentPosition : true
                        },
                        $isotope_gallery = {};

                    $scope.imagesLoaded( function() {
                        $isotope_gallery = $gallery.isotope( $isotope_args );
                    });

                    $scope.on( 'click', '.pp-gallery-filter', function() {
                        var $this = $(this),
                            filterValue = $this.attr('data-filter');

                        $this.siblings().removeClass('pp-active');
                        $this.addClass('pp-active');

                        $isotope_gallery.isotope({ filter: filterValue });
                    });
                }
            }
        }

		if ( $action === 'lightbox') {
			$.fancybox.defaults.media.dailymotion = {
				matcher : /dailymotion.com\/video\/(.*)\/?(.*)/,
				params : {
					additionalInfos : 0,
					autoStart : 1
				},
				type : 'iframe',
				url  : '//www.dailymotion.com/embed/video/$1'
			};
		}
        
        if ( elementSettings.layout === 'carousel' ) {
            var carouselWrap  = $scope.find('.pp-video-gallery-wrapper').eq(0),
                carousel      = $scope.find('.pp-video-gallery').eq(0),
				sliderOptions = JSON.parse( carouselWrap.attr('data-slider-settings') );

			ppSwiperSliderinit(carousel, carouselWrap, elementSettings, sliderOptions);
        }
	};

    var AlbumHandler = function ($scope, $) {
        var $album           = $scope.find('.pp-album').eq(0),
            $id              = $album.data('id'),
            fancyboxThumbs   = $album.data('fancybox-class'),
            fancyboxAxis	 = $album.data('fancybox-axis'),
            elementSettings  = getElementSettings( $scope ),
            lightboxSelector = '[data-fancybox="'+$id+'"]';

        if ( elementSettings.lightbox_library === 'fancybox' ) {
            $(lightboxSelector).fancybox({
                loop:               'yes' === elementSettings.loop,
                arrows:             'yes' === elementSettings.arrows,
                infobar:            'yes' === elementSettings.slides_counter,
                keyboard:           'yes' === elementSettings.keyboard,
                toolbar:            'yes' === elementSettings.toolbar,
                buttons:            elementSettings.toolbar_buttons,
                animationEffect:    elementSettings.lightbox_animation,
                transitionEffect:   elementSettings.transition_effect,
				baseClass:			fancyboxThumbs,
				thumbs: {
					autoStart:	'yes' === elementSettings.thumbs_auto_start,
					axis:		fancyboxAxis
				}
            });
        }
	};
    
    var TestimonialsCarouselHandler = function ( $scope, $ ) {
        var $testimonials      = $scope.find( '.pp-testimonials' ).eq( 0 ),
            testimonialsWrap   = $scope.find( '.pp-testimonials-wrap' ),
            testimonialsLayout = $testimonials.data( 'layout' );

            if ( testimonialsLayout === 'carousel' || testimonialsLayout === 'slideshow' ) {
                var $slider_options = JSON.parse( $testimonials.attr('data-slider-settings') ),
                    $thumbs_nav     = $scope.find( '.pp-testimonials-thumb-item-wrap' ),
                    elementSettings = getElementSettings( $scope );
                
                $testimonials.slick( $slider_options );

                if ( testimonialsLayout === 'slideshow' && elementSettings.thumbnail_nav === 'yes' ) {
                    $thumbs_nav.removeClass('pp-active-slide');
                    $thumbs_nav.eq(0).addClass('pp-active-slide');

                    $testimonials.on('beforeChange', function ( event, slick, currentSlide, nextSlide ) {
                        currentSlide = nextSlide;
                        $thumbs_nav.removeClass('pp-active-slide');
                        $thumbs_nav.eq( currentSlide ).addClass('pp-active-slide');
                    });

                    $thumbs_nav.each( function( currentSlide ) {
                        $(this).on( 'click', function ( e ) {
                            e.preventDefault();
                            $testimonials.slick( 'slickGoTo', currentSlide );
                        });
                    });
                }

                $testimonials.slick( 'setPosition' );
				
				ppWidgetUpdate( $testimonials, '.pp-testimonials', 'slick' );

                if ( isEditMode ) {
                    testimonialsWrap.resize( function() {
                        $testimonials.slick( 'setPosition' );
                    });
                }

            }
	};
	
    var ImageScrollHandler = function($scope) {
        var elementSettings  = getElementSettings( $scope ),
			scrollElement    = $scope.find('.pp-image-scroll-container'),
            scrollOverlay    = scrollElement.find('.pp-image-scroll-overlay'),
            scrollVertical   = scrollElement.find('.pp-image-scroll-vertical'),
            imageScroll      = scrollElement.find('.pp-image-scroll-image img'),
            direction        = elementSettings.direction_type,
            reverse			 = elementSettings.reverse,
            trigger			 = elementSettings.trigger_type,
            transformOffset  = null;
        
        function startTransform() {
            imageScroll.css('transform', (direction === 'vertical' ? 'translateY' : 'translateX') + '( -' +  transformOffset + 'px)');
        }
        
        function endTransform() {
            imageScroll.css('transform', (direction === 'vertical' ? 'translateY' : 'translateX') + '(0px)');
        }
        
        function setTransform() {
            if( direction === 'vertical' ) {
                transformOffset = imageScroll.height() - scrollElement.height();
            } else {
                transformOffset = imageScroll.width() - scrollElement.width();
            }
        }
        
        if ( trigger === 'scroll' ) {
            scrollElement.addClass('pp-container-scroll');
            if ( direction === 'vertical' ) {
                scrollVertical.addClass('pp-image-scroll-ver');
            } else {
                scrollElement.imagesLoaded(function() {
                  scrollOverlay.css( { 'width': imageScroll.width(), 'height': imageScroll.height() } );
                });
            }
        } else {
            if ( reverse === 'yes' ) {
                scrollElement.imagesLoaded(function() {
                    scrollElement.addClass('pp-container-scroll-instant');
                    setTransform();
                    startTransform();
                });
            }
            if ( direction === 'vertical' ) {
                scrollVertical.removeClass('pp-image-scroll-ver');
            }
            scrollElement.mouseenter(function() {
                scrollElement.removeClass('pp-container-scroll-instant');
                setTransform();
                reverse === 'yes' ? endTransform() : startTransform();
            });

            scrollElement.mouseleave(function() {
                reverse === 'yes' ? startTransform() : endTransform();
            });
        }
    };

	var TwitterTimelineHandler = function ($scope, $) {
		$(document).ready(function () {
			if ('undefined' !== twttr) {
				twttr.widgets.load();
			}
		});
	};

	var tabbedGalleryTabs = function( $scope, elementSettings, sliderOptions, tabbedGallerySwiper ) {
		var tabsNav = $scope.find( '.pp-gallery-filters .pp-gallery-filter' );

		tabsNav.removeClass('pp-active-slide');
		tabsNav.eq(0).addClass('pp-active-slide');

		if ( 'undefined' !== typeof tabbedGallerySwiper ) {
			tabbedGallerySwiper.on( 'slideChange', function () {
				var currentSlide = $scope.find( '.swiper-slide.swiper-slide-active' ).data( 'swiper-slide-index' );
				var nextSlide    = $scope.find( '.swiper-slide.swiper-slide-next' ).data( 'swiper-slide-index' );

				var tabGroupCurrent = tabsNav.eq( currentSlide ).data('group'),
					tabGroupNext    = tabsNav.eq( nextSlide ).data('group');
				
				if ( tabGroupCurrent !== tabGroupNext ) {
					tabsNav.removeClass('pp-active-slide');
					var $group = tabsNav.eq( nextSlide ).data('group');
					tabsNav.filter('[data-group="' + $group + '"]').addClass('pp-active-slide');
				}
			});

			tabsNav.each( function() {
				$(this).on( 'click', function ( e ) {
					e.preventDefault();

					if ( ( $( window ).width() <= 480 ) && elementSettings.slides_per_view_mobile <= 2 ) {
						var currentSlide = $(this).data('index') + parseInt( elementSettings.slides_per_view_mobile );
					} else if ( ( $( window ).width() <= 768 ) && elementSettings.slides_per_view_tablet <= 2 ) {
						var currentSlide = $(this).data('index') + parseInt( elementSettings.slides_per_view_tablet );
					} else {
						var currentSlide = $(this).data('index') + parseInt( sliderOptions.slidesPerView );
					}

					tabsNav.removeClass( 'pp-active-slide' );
					$(this).addClass( 'pp-active-slide' );

					tabbedGallerySwiper.slideTo( currentSlide );
				});
			});
		}
	};

    var TabbedGalleryHandler = function ( $scope, $ ) {
		var elementSettings = getElementSettings( $scope ),
			carousel        = $scope.find( '.pp-tabbed-gallery-carousel' ).eq( 0 ),
			carouselWrap    = $scope.find('.swiper-container-wrap').eq(0),
			sliderOptions   = JSON.parse( carouselWrap.attr('data-slider-settings') ),
			sliderId        = $scope.find( '.pp-tabbed-carousel' ).eq( 0 ).attr( 'id' );

		if ( 'undefined' === typeof Swiper ) {
			var asyncSwiper = elementorFrontend.utils.swiper;

			new asyncSwiper( carousel, sliderOptions ).then( function( newSwiperInstance ) {
				var tabbedGallerySwiper = newSwiperInstance;
				ppSwiperSliderAfterinit( carousel, carouselWrap, elementSettings, tabbedGallerySwiper );
				tabbedGalleryTabs( $scope, elementSettings, sliderOptions, tabbedGallerySwiper );
			} );
		} else {
			var tabbedGallerySwiper = new Swiper(carousel, sliderOptions);
			ppSwiperSliderAfterinit( carousel, carouselWrap, elementSettings, tabbedGallerySwiper );
			tabbedGalleryTabs( $scope, elementSettings, sliderOptions, tabbedGallerySwiper );
		}

		var $lightbox_selector = '.swiper-slide:not(.swiper-slide-duplicate) .pp-image-slider-slide-link[data-fancybox="' + sliderId + '"]';
		$( $lightbox_selector ).fancybox({
			loop: true
		} );
	};

    var CouponsHandler = function ($scope) {
        var elementSettings = getElementSettings( $scope );
            
		if ( 'carousel' === elementSettings.layout ) {
        	var carouselWrap  = $scope.find('.swiper-container-wrap').eq(0),
				carousel      = carouselWrap.find('.pp-coupons-carousel'),
				sliderOptions = JSON.parse( carouselWrap.attr('data-slider-settings') );

			ppSwiperSliderinit(carousel, carouselWrap, elementSettings, sliderOptions);
		}
		
		$scope.find('.pp-coupon').each(function () {
            var couponCode = $(this).find('.pp-coupon-code').attr('data-coupon-code');

			$(this).find('.pp-coupon-code').not('.pp-copied').on('click', function(){
				var clicked = $(this);
				var tempInput = '<input type="text" value="' + couponCode + '" id="ppCouponInput">';

				clicked.append(tempInput);

				var copyText = document.getElementById('ppCouponInput');
				copyText.select();
				document.execCommand('copy');
				$('#ppCouponInput').remove();

				if ('copy' === elementSettings.coupon_style) {
					clicked.addClass('pp-copied');
					clicked.find('.pp-coupon-copy-text').fadeOut().text('Copied').fadeIn();
				} else {
					clicked.find('.pp-coupon-reveal-wrap').css({
						'transform': 'translate(200px, 0px)'
					});
					setTimeout(function () {
						clicked.find('.pp-coupon-code-text-wrap').removeClass('pp-unreavel');
						clicked.find('.pp-coupon-code-text').text(couponCode);
						clicked.find('.pp-coupon-reveal-wrap').remove();
					}, 150);
					setTimeout(function () {
						clicked.addClass('pp-copied');
						clicked.find('.pp-coupon-copy-text').fadeOut().text('Copied').fadeIn();
					}, 500);
				}
			});
		});
    };

    var CategoriesHandler = function ($scope, $) {
        var elementSettings = getElementSettings( $scope ),
            catBoxWrap	    = $scope.find('.pp-category-wrap'),
            catBox		    = catBoxWrap.find('.pp-category');
		
		if ( elementSettings.equal_height === 'yes' ) {
			var highestBox = 0;

			catBoxWrap.each(function () {
				if ( $( this ).outerHeight() > highestBox) {
					highestBox = $( this ).outerHeight();
				}
			});

			catBox.css( 'height', highestBox+'px' );
		}
            
		if ( 'carousel' === elementSettings.layout ) {
        	var carouselWrap  = $scope.find('.swiper-container-wrap').eq(0),
				carousel      = carouselWrap.find('.pp-categories-carousel'),
				sliderOptions = JSON.parse( carouselWrap.attr('data-slider-settings') );

			ppSwiperSliderinit(carousel, carouselWrap, elementSettings, sliderOptions);
		}
    };

	var GFormsHandler = function( $scope, $ ) {
		if ( 'undefined' === typeof $scope ) {
			return;
		}

		$scope.find('select:not([multiple])').each(function() {
			var	gf_select_field = $( this );
			if( gf_select_field.next().hasClass('chosen-container') ) {
				gf_select_field.next().wrap( '<span class="pp-gf-select-custom"></span>' );
			} else {
				gf_select_field.wrap( '<span class="pp-gf-select-custom"></span>' );
			}
		});
	};

	var SitemapHandler = function( $scope ) {
		var elementSettings = getElementSettings($scope),
			list            = $scope.find('.pp-sitemap-list'),
			tree            = elementSettings.sitemap_tree,
			style           = elementSettings.sitemap_tree_style;

		if ( 'yes' === tree ) {
			if ( 'plus_circle' === style ) {
				list.treed();
			}
			else if ( 'caret' === style ) {
				list.treed({ openedClass: 'fa-caret-down', closedClass: 'fa-caret-right' });
			}
			else if ( 'plus' === style ) {
				list.treed({ openedClass: 'fa-minus', closedClass: 'fa-plus' });
			}
			else if ( 'folder' === style ) {
				list.treed({ openedClass: 'fa-folder-open', closedClass: 'fa-folder' });
			}
		}
	};

	var BreadcrumbsHandler = function( $scope ) {
		var elementSettings = getElementSettings( $scope ),
            breadcrumbsType = elementSettings.breadcrumbs_type;

		if ( breadcrumbsType !== 'powerpack' ) {
			$scope.find('.pp-breadcrumbs a' ).parent().css({'padding' : '0', 'background-color' : 'transparent', 'border' : '0', 'margin' : '0', 'box-shadow' : 'none'});
		}
		if ( breadcrumbsType === 'yoast' || breadcrumbsType === 'rankmath' ) {
			$scope.find('.pp-breadcrumbs a' ).parent().parent().css({'padding' : '0', 'background-color' : 'transparent', 'border' : '0', 'margin' : '0', 'box-shadow' : 'none'});
		}
	};

	var LoginHandler = function( $scope, $ ) {
		var LoginForm       = $scope.find('.pp-login-form'),
			LoginFormWrap   = $scope.find('.pp-login-form-wrap'),
			pageUrl         = LoginFormWrap.data('page-url'),
			elementSettings = getElementSettings( $scope ),
			fbButton        = $scope.find( '.pp-fb-login-button' ),
			fbAppId         = fbButton.data( 'appid' ),
			googleButton    = $scope.find( '.pp-google-login-button' ),
			googleClientId  = googleButton.data( 'clientid' );
		
		if ( $(LoginForm).length > 0 ) {
			new PPLoginForm($scope, elementSettings, {
				id: $scope.data('id'),
				messages: {
					empty_username:   ppLogin.empty_username,
					empty_password:   ppLogin.empty_password,
					empty_password_1: ppLogin.empty_password_1,
					empty_password_2: ppLogin.empty_password_2,
					empty_recaptcha:  ppLogin.empty_recaptcha,
					email_sent:       ppLogin.email_sent,
					reset_success:    ppLogin.reset_success,
				},
				page_url:         pageUrl,
				facebook_login:   ( 'yes' === elementSettings.facebook_login ) ? 'true' : 'false',
				facebook_app_id:  fbAppId,
				facebook_sdk_url: '',
				google_login:     ( 'yes' === elementSettings.google_login ) ? 'true' : 'false',
				enable_recaptcha: ( 'yes' === elementSettings.enable_recaptcha ) ? 'true' : 'false',
				google_client_id: googleClientId,
			});
		}
	};

	var PricingTableHandler = function( $scope, $ ) {
		var id                   = $scope.data('id'),
			toolTopElm           = $scope.find('.pp-pricing-table-tooptip[data-tooltip]'),
			elementSettings      = getElementSettings( $scope ),
			ppclass              = 'pp-tooltip' + ' pp-tooltip-' + id,
        	ttArrow              = elementSettings.tooltip_arrow,
			ttTrigger            = elementSettings.tooltip_trigger,
			animation            = elementSettings.tooltip_animation,
			tooltipSize          = elementSettings.tooltip_size,
			tooltipZindex        = elementSettings.tooltip_zindex,
			elementorBreakpoints = elementorFrontend.config.breakpoints;

		if ( '' !== tooltipSize && undefined !== tooltipSize ) {
			ppclass += ' pp-tooltip-size-' + tooltipSize;
		}

		toolTopElm.each(function () {
            var ttPosition   = $(this).data('tooltip-position'),
				minWidth     = $(this).data('tooltip-width'),
				ttDistance   = $(this).data('tooltip-distance');

            // tablet
            if ( window.innerWidth <= elementorBreakpoints.lg && window.innerWidth >= elementorBreakpoints.md ) {
                ttPosition = $scope.find('.pp-pricing-table-tooptip[data-tooltip]').data('tooltip-position-tablet');
            }

            // mobile
            if ( window.innerWidth < elementorBreakpoints.md ) {
                ttPosition = $scope.find('.pp-pricing-table-tooptip[data-tooltip]').data('tooltip-position-mobile');
            }

			$( this ).pptooltipster({
				trigger : ttTrigger,
				animation : animation,
	        	minWidth: minWidth,
				ppclass : ppclass,
				side : ttPosition,
	        	arrow : ( 'yes' === ttArrow ),
	        	distance : ttDistance,
	        	interactive : true,
	        	positionTracker : true,
	        	zIndex : tooltipZindex,
			});
        });
	};

	var RegistrationHandler = function( $scope, $ ) {
		var registration_form = $scope.find('.pp-registration-form'),
			elementSettings   = getElementSettings( $scope );
		
		if ( $(registration_form).length > 0 ) {
			new PPRegistrationForm($scope, {
				id: $scope.data('id'),
				min_pass_length: registration_form.data('password-length'),
				pws_meter: ('yes' === elementSettings.enable_pws_meter),
				i18n: {
					messages: {
						error: {
							invalid_username: ppRegistration.invalid_username,
							username_exists: ppRegistration.username_exists,
							empty_email: ppRegistration.empty_email,
							invalid_email: ppRegistration.invalid_email,
							email_exists: ppRegistration.email_exists,
							password: ppRegistration.password,
							password_length: ppRegistration.password_length,
							password_mismatch: ppRegistration.password_mismatch,
							invalid_url: ppRegistration.invalid_url,
							recaptcha_php_ver: ppRegistration.recaptcha_php_ver,
							recaptcha_missing_key: ppRegistration.recaptcha_missing_key,
						},
						success: elementSettings.success_message,
					},
					pw_toggle_text: {
						show: ppRegistration.show_password,
						hide: ppRegistration.hide_password,
					},
				},
				ajaxurl: ppRegistration.ajax_url
			});
		}
	};
    
	var ContentReveal = function ($scope, $) {
		var elementSettings 	= getElementSettings($scope),
			contentWrapper      = $scope.find('.pp-content-reveal-content-wrapper'),
			$content 			= $scope.find('.pp-content-reveal-content'),
			$saparator 			= $scope.find('.pp-content-reveal-saparator'),
			$button				= $scope.find('.pp-content-reveal-button-inner'),
			contentOuterHeight 	= $content.outerHeight(),
			contentVisibility   = contentWrapper.data('visibility'),
			contentHeightCustom = contentWrapper.data('content-height'),
			speedUnreveal       = contentWrapper.data('speed') * 1000,
			contentHeightLines  = contentWrapper.data('lines'),
			contentLineHeight   = $scope.find('.pp-content-reveal-content p').css('line-height'),
			contentPaddingTop 	= $content.css('padding-top');

        if ( contentVisibility == 'lines' ) {
            if ( contentHeightLines == '0' ) {
                var contentWrapperHeight = contentWrapper.outerHeight();
            } else {
                var contentWrapperHeight = (parseInt(contentLineHeight, 10) * contentHeightLines) + parseInt(contentPaddingTop, 10);
                contentWrapper.css( 'height', (contentWrapperHeight + 'px') );
            }
        } else {
            contentWrapper.css( 'height', (contentHeightCustom + 'px') );
            contentWrapperHeight = contentHeightCustom;
        }

		$button.on('click', function () {
			$saparator.slideToggle(speedUnreveal);
			$(this).toggleClass('pp-content-revealed');
			$(this).find('.pp-content-reveal-button-open').slideToggle(speedUnreveal);
			$(this).find('.pp-content-reveal-button-closed').slideToggle(speedUnreveal);
			if ( $button.hasClass('pp-content-revealed') ) {
				contentWrapper.animate({ height: ( contentOuterHeight + 'px') }, speedUnreveal);
			} else {
				contentWrapper.animate({ height: ( contentWrapperHeight + 'px') }, speedUnreveal);

				$('html, body').animate({
					scrollTop: ( contentWrapper.offset().top - 50 ) + 'px'
				});
			}
		});
    };

	var WrapperLinkHandler = function( $scope ) {
		if ( $scope.data( 'pp-wrapper-link' ) ) {
			var wrapperLink = $scope.data('pp-wrapper-link'),
				id          = $scope.data('id'),
				url         = wrapperLink.url,
				isExternal  = wrapperLink.is_external ? '_blank' : '_self',
				rel         = wrapperLink.nofollow ? 'nofollow' : '',
				anchorTag   = document.createElement('a');

			$scope.on('click.onPPWrapperLink', function() {
				anchorTag.id            = 'pp-wrapper-link-' + id;
				anchorTag.href          = url;
				anchorTag.target        = isExternal;
				anchorTag.rel           = rel;
				anchorTag.style.display = 'none';

				document.body.appendChild(anchorTag);

				var anchorObj = document.getElementById(anchorTag.id);
				anchorObj.click();

				var timeout = setTimeout(function() {
					document.body.removeChild(anchorObj);
					clearTimeout(timeout);
				});
			});
		}
	};
    
    $(window).on('elementor/frontend/init', function () {
        if ( elementorFrontend.isEditMode() ) {
			isEditMode = true;
		}

		var widgets = {
			'pp-image-hotspots.default':       ImageHotspotHandler,
			'pp-image-comparison.default':     ImageComparisonHandler,
			'pp-counter.default':              CounterHandler,
			'pp-logo-carousel.default':        ppSwiperSliderHandler,
			'pp-info-box-carousel.default':    InfoBoxCarouselHandler,
			'pp-instafeed.default':            InstaFeedHandler,
			'pp-team-member-carousel.default': ppSwiperSliderHandler,
			'pp-modal-popup.default':          ModalPopupHandler,
			'pp-table.default':                TableHandler,
			'pp-toggle.default':               ToggleHandler,
			'pp-countdown.default':            PPCountdownHandler,
			'pp-image-gallery.default':        ImageGalleryHandler,
			'pp-image-slider.default':         ImageSliderHandler,
			'pp-advanced-menu.default':        AdvancedMenuHandler,
			'pp-advanced-tabs.default':        AdvancedTabsHandler,
			'pp-offcanvas-content.default':    OffCanvasContentHandler,
			'pp-buttons.default':              PPButtonHandler,
			'pp-showcase.default':             ShowcaseHandler,
			'pp-timeline.default':             TimelineHandler,
			'pp-card-slider.default':          CardSliderHandler,
			'pp-image-accordion.default':      ImageAccordionHandler,
			'pp-advanced-accordion.default':   AdvancedAccordionHandler,
			'pp-content-ticker.default':       ppSwiperSliderHandler,
			'pp-magazine-slider.default':      MagazineSliderHandler,
			'pp-video.default':                VideoHandler,
			'pp-video-gallery.default':        VideoGalleryHandler,
			'pp-testimonials.default':         TestimonialsCarouselHandler,
			'pp-scroll-image.default':         ImageScrollHandler,
			'pp-album.default':                AlbumHandler,
			'pp-twitter-timeline.default':     TwitterTimelineHandler,
			'pp-twitter-tweet.default':        TwitterTimelineHandler,
			'pp-tabbed-gallery.default':       TabbedGalleryHandler,
			'pp-faq.default':                  AdvancedAccordionHandler,
			'pp-coupons.default':              CouponsHandler,
			'pp-categories.default':           CategoriesHandler,
			'pp-gravity-forms.default':        GFormsHandler,
			'pp-sitemap.default':              SitemapHandler,
			'pp-breadcrumbs.default':          BreadcrumbsHandler,
			'pp-login-form.default':           LoginHandler,
			'pp-registration-form.default':    RegistrationHandler,
			'pp-pricing-table.default':        PricingTableHandler,
			'pp-content-reveal.default':       ContentReveal,
			'pp-business-reviews.classic':     ppSwiperSliderHandler,
			'pp-business-reviews.card':        ppSwiperSliderHandler,
		};

		$.each( widgets, function( widget, callback ) {
			elementorFrontend.hooks.addAction( 'frontend/element_ready/' + widget, callback );
		});

		elementorFrontend.hooks.addAction( 'frontend/element_ready/global', WrapperLinkHandler );
    });
    
}(jQuery));
