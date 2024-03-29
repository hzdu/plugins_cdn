(function ( $ ) {
	'use strict';

	window.qodefAddonsPremiumCore     = {};
	qodefAddonsPremiumCore.shortcodes = {};

	qodefAddonsPremiumCore.body         = $( 'body' );
	qodefAddonsPremiumCore.html         = $( 'html' );
	qodefAddonsPremiumCore.windowWidth  = $( window ).width();
	qodefAddonsPremiumCore.windowHeight = $( window ).height();
	qodefAddonsPremiumCore.scroll       = 0;

	$( document ).ready(
		function () {
			qodefAddonsPremiumCore.scroll = $( window ).scrollTop();
			qodefSplitting.init();
		}
	);

	$( window ).resize(
		function () {
			qodefAddonsPremiumCore.windowWidth  = $( window ).width();
			qodefAddonsPremiumCore.windowHeight = $( window ).height();
		}
	);

	$( window ).scroll(
		function () {
			qodefAddonsPremiumCore.scroll = $( window ).scrollTop();
		}
	);

	/**
	 * Init splitting.js
	 */
	var qodefSplitting = {
		init: function () {
			this.holder = $( '.qodef-qi--splitting' );

			if ( this.holder.length ) {
				this.holder.each(
					function () {
						qodefSplitting.initSplitting( $( this ) );
					}
				);
			}
		},
		initSplitting: function ( $holder ) {
			gsap.registerPlugin( SplitText );

			var $splitText = new SplitText(
				$holder,
				{
					type: 'chars,words',
					charsClass: 'qodef-e-char',
					wordsClass: 'qodef-e-word',
				}
			);

			var $chars = $splitText.chars;

			if ( $chars.length ) {
				for ( var i = 0; i < $chars.length; i++ ) {
					gsap.set(
						$chars[i],
						{
							'--qodef-char-index': i,
						}
					);

					if ( i === $chars.length - 1 ) {
						$holder.addClass( 'qodef-qi--splitting-init' );
					}
				}
			}
		}
	};
	qodefAddonsPremiumCore.qodefSplitting = qodefSplitting;

	var qodefInfoFollow = {
		init: function ( $holder, additionalClass = '' ) {

			if ( $holder.length ) {
				qodefCore.body.append( '<div class="qodef-qi-e-content-follow ' + additionalClass + '"><div class="qodef-e-content"></div></div>' );

				var $contentFollow = $( '.qodef-qi-e-content-follow' ),
					$content    = $contentFollow.find( '.qodef-e-content' );

				if ( qodefCore.windowWidth > 1024 ) {
					$holder.each(
						function () {
							var $thisGallery = $( this );

							$thisGallery.find( '.qodef-e-inner' ).each(
								function () {
									var $thisItem = $( this );

									//info element position
									$thisItem.on(
										'mousemove',
										function ( e ) {
											if ( e.clientX + $contentFollow.width() + 20 > qodefCore.windowWidth ) {
												$contentFollow.addClass( 'qodef-right' );
											} else {
												$contentFollow.removeClass( 'qodef-right' );
											}

											$contentFollow.css(
												{
													top: e.clientY + 20,
													left: e.clientX + 20
												}
											);
										}
									);

									//show/hide info element
									$thisItem.on(
										'mouseenter',
										function () {
											var $thisItemContent = $( this ).find( '.qodef-e-content' );

											if ( $thisItemContent.length ) {
												$content.html( $thisItemContent.html() );
											}

											if ( ! $contentFollow.hasClass( 'qodef-is-active' ) ) {
												$contentFollow.addClass( 'qodef-is-active' );
											} else {
												$contentFollow.removeClass( 'qodef-is-active' );
												setTimeout(
													function () {
														$contentFollow.addClass( 'qodef-is-active' );
													},
													10
												);
											}
										}
									).on(
										'mouseleave',
										function () {
											if ( $contentFollow.hasClass( 'qodef-is-active' ) ) {
												$contentFollow.removeClass( 'qodef-is-active' );
											}
										}
									);

									$( window ).on(
										'wheel',
										function () {
											if ( $contentFollow.hasClass( 'qodef-is-active' ) ) {
												$contentFollow.removeClass( 'qodef-is-active' );
											}
										}
									);
								}
							);
						}
					);
				}
			}
		}
	};
	qodefAddonsPremiumCore.qodefInfoFollow = qodefInfoFollow;

})( jQuery );

(function ( $ ) {
	'use strict';

	$( document ).ready(
		function () {
			qodefQiAddonsPagination.init();
		}
	);

	$( window ).scroll(
		function () {
			qodefQiAddonsPagination.scroll();
		}
	);

	$( document ).on(
		'qi_addons_for_elementor_premium_trigger_load_more',
		function ( e, $holder, nextPage ) {
			qodefQiAddonsPagination.triggerLoadMore( $holder, nextPage );
		}
	);

	$( document ).on(
		'qi_addons_for_elementor_premium_trigger_get_new_posts',
		function ( e, $holder ) {
			qodefAddonsCore.qodefButton.init();
		}
	);

	/*
	 **	Init pagination functionality
	 */
	var qodefQiAddonsPagination = {
		init: function ( settings ) {
			this.holder = $( '.qodef-qi-pagination--on' );

			// Allow overriding the default config
			$.extend( this.holder, settings );

			if ( this.holder.length ) {
				this.holder.each(
					function () {
						var $holder = $( this );

						qodefQiAddonsPagination.initPaginationType( $holder );
					}
				);
			}
		},
		scroll: function ( settings ) {
			this.holder = $( '.qodef-qi-pagination--on' );

			// Allow overriding the default config
			$.extend( this.holder, settings );

			if ( this.holder.length ) {
				this.holder.each(
					function () {
						var $holder = $( this );

						if ( $holder.hasClass( 'qodef-pagination-type--infinite-scroll' ) ) {
							qodefQiAddonsPagination.initInfiniteScroll( $holder );
						}
					}
				);
			}
		},
		initPaginationType: function ( $holder ) {
			if ( $holder.hasClass( 'qodef-pagination-type--standard' ) ) {
				qodefQiAddonsPagination.initStandard( $holder );
			} else if ( $holder.hasClass( 'qodef-pagination-type--load-more' ) ) {
				qodefQiAddonsPagination.initLoadMore( $holder );
			} else if ( $holder.hasClass( 'qodef-pagination-type--infinite-scroll' ) ) {
				qodefQiAddonsPagination.initInfiniteScroll( $holder );
			}
		},
		initStandard: function ( $holder, nextPage ) {
			var $paginationItems = $holder.find( '.qodef-m-pagination-items' );

			if ( $paginationItems.length ) {
				var options      = $holder.data( 'options' ),
					current_page = typeof nextPage !== 'undefined' && nextPage !== '' ? parseInt( nextPage, 10 ) : 1;

				qodefQiAddonsPagination.changeStandardState( $holder, options.max_pages_num, current_page );

				$paginationItems.children().each(
					function () {
						var $thisItem = $( this );

						$thisItem.on(
							'click',
							function ( e ) {
								e.preventDefault();

								if ( ! $thisItem.hasClass( 'qodef--active' ) ) {
									qodefQiAddonsPagination.getNewPosts( $holder, $thisItem.data( 'paged' ) );
								}
							}
						);
					}
				);
			}
		},
		changeStandardState: function ( $holder, maxPagesNum, nextPage ) {
			if ( $holder.hasClass( 'qodef-pagination-type--standard' ) ) {
				var $paginationNav = $holder.find( '.qodef-m-pagination-items' ),
					$numericItem   = $paginationNav.children( '.qodef--number' ),
					$prevItem      = $paginationNav.children( '.qodef--prev' ),
					$nextItem      = $paginationNav.children( '.qodef--next' );

				qodefQiAddonsPagination.standardPaginationVisibility( $paginationNav, maxPagesNum );

				$numericItem.removeClass( 'qodef--active current' ).eq( nextPage - 1 ).addClass( 'qodef--active current' );

				$prevItem.data( 'paged', nextPage - 1 );

				if ( nextPage > 1 ) {
					$prevItem.show();
					$prevItem.next().removeClass( 'qodef-prev--hidden' );
				} else {
					$prevItem.hide();
					$prevItem.next().addClass( 'qodef-prev--hidden' );
				}

				$nextItem.data( 'paged', nextPage + 1 );

				if ( nextPage === maxPagesNum ) {
					$nextItem.hide();
				} else {
					$nextItem.show();
				}
			}
		},
		standardPaginationVisibility: function ( $paginationNav, maxPagesNum ) {
			if ( maxPagesNum === 1 ) {
				$paginationNav.hide();
			} else if ( maxPagesNum > 1 && ! $paginationNav.is( ':visible' ) ) {
				$paginationNav.show();
			}
		},
		changeStandardHtml: function ( $holder, maxPagesNum, nextPage, $pagination_html ) {
			if ( $holder.hasClass( 'qodef-pagination-type--standard' ) ) {
				var $paginationNav     = $holder.find( '.qodef-addons-m-pagination' ),
					$paginationSpinner = $holder.find( '.qodef-m-pagination-spinner' );

				qodefQiAddonsPagination.standardPaginationVisibility(
					$paginationNav,
					maxPagesNum
				);

				$paginationNav.remove();
				$paginationSpinner.remove();

				$holder.append( $pagination_html );
				qodefQiAddonsPagination.initStandard( $holder, nextPage );
			}
		},
		triggerStandardScrollAnimation: function ( $holder ) {
			if ( $holder.hasClass( 'qodef-pagination-type--standard' ) ) {
				$( 'html, body' ).animate(
					{
						scrollTop: $holder.offset().top - 100
					},
					500
				);
			}
		},
		initLoadMore: function ( $holder ) {
			var $loadMoreButton = $holder.find( '.qodef-load-more-button' );

			$loadMoreButton.on(
				'click',
				function ( e ) {
					e.preventDefault();

					qodefQiAddonsPagination.getNewPosts( $holder );
				}
			);
		},
		triggerLoadMore: function ( $holder, nextPage ) {
			qodefQiAddonsPagination.getNewPosts( $holder, nextPage );
		},
		loadMoreButtonVisibility: function ( $holder, options ) {
			if ( $holder.hasClass( 'qodef-pagination-type--load-more' ) ) {

				if ( options.next_page > options.max_pages_num || options.max_pages_num === 1 ) {
					$holder.find( '.qodef-load-more-button' ).hide();
				} else if ( options.max_pages_num > 1 && options.next_page <= options.max_pages_num ) {
					$holder.find( '.qodef-load-more-button' ).show();
				}
			}
		},
		initInfiniteScroll: function ( $holder ) {
			var holderEndPosition = $holder.outerHeight() + $holder.offset().top,
				scrollPosition    = qodefAddonsCore.scroll + qodefAddonsCore.windowHeight,
				options           = $holder.data( 'options' );

			if ( ! $holder.hasClass( 'qodef--loading' ) && scrollPosition > holderEndPosition && options.max_pages_num >= options.next_page ) {
				qodefQiAddonsPagination.getNewPosts( $holder );
			}
		},
		getNewPosts: function ( $holder, nextPage ) {
			$holder.addClass( 'qodef--loading' );

			var $itemsHolder   = $holder.children( '.qodef-grid-inner' );
			var options        = $holder.data( 'options' );
			options.element_id = $holder.parents( '.elementor-widget' ).data( 'id' );

			qodefQiAddonsPagination.setNextPageValue( options, nextPage, false );

			$.ajax(
				{
					type: 'GET',
					url: qodefQiAddonsPremiumGlobal.vars.restUrl + qodefQiAddonsPremiumGlobal.vars.paginationRestRoute,
					data: {
						options: options
					},
					beforeSend: function ( request ) {
						request.setRequestHeader(
							'X-WP-Nonce',
							qodefQiAddonsPremiumGlobal.vars.restNonce
						);
					},
					success: function ( response ) {

						if ( response.status === 'success' ) {
							// Override max page numbers options
							if ( options.max_pages_num !== response.data.max_pages_num ) {
								options.max_pages_num = response.data.max_pages_num;
							}

							qodefQiAddonsPagination.setNextPageValue( options, nextPage, true );
							qodefQiAddonsPagination.changeStandardHtml( $holder, options.max_pages_num, nextPage, response.data.pagination_html );

							qodefQiAddonsPagination.addPosts( $itemsHolder, response.data.html, nextPage );
							qodefQiAddonsPagination.reInitMasonryPosts( $holder, $itemsHolder );

							setTimeout(
								function () {
									qodefAddonsCore.body.trigger(
										'qi_addons_for_elementor_premium_trigger_get_new_posts',
										[$holder, response.data, nextPage]
									);
								},
								300
							); // 300ms is set in order to be after the masonry script initialize

							qodefQiAddonsPagination.triggerStandardScrollAnimation( $holder );
							qodefQiAddonsPagination.loadMoreButtonVisibility( $holder, options );
						} else {
							console.log( response.message );
						}
					},
					complete: function () {
						$holder.removeClass( 'qodef--loading' );
					}
				}
			);
		},
		setNextPageValue: function ( options, nextPage, ajaxTrigger ) {
			if ( typeof nextPage !== 'undefined' && nextPage !== '' && ! ajaxTrigger ) {
				options.next_page = nextPage;
			} else if ( ajaxTrigger ) {
				options.next_page = parseInt( options.next_page, 10 ) + 1;
			}
		},
		addPosts: function ( $itemsHolder, newItems, nextPage ) {
			if ( typeof nextPage !== 'undefined' && nextPage !== '' ) {
				$itemsHolder.html( newItems );
			} else {
				$itemsHolder.append( newItems );
			}
		},
		reInitMasonryPosts: function ( $holder, $itemsHolder ) {

			if ( $holder.hasClass( 'qodef-layout--qi-masonry' )) {
				$itemsHolder.isotope( 'reloadItems' ).isotope( { sortBy: 'original-order' } );

				setTimeout(
					function () {
						qodefAddonsCore.qodefMasonryLayout.reInit();
					},
					200
				);
			}

			if ( $holder.hasClass( 'qodef-qi-blog-list-premium' )) { //since blog premium is always masonry
				$itemsHolder.isotope( 'reloadItems' ).isotope( { sortBy: 'original-order' } );

				// setTimeout(
				// 	function () {
						qodefAddonsPremiumCore.shortcodes.qi_addons_for_elementor_premium_blog_list_premium.qodefBlogListPremium.init();
				// 	},
				// 	200
				// );
			}
		}
	};

	qodefAddonsCore.qodefQiAddonsPagination = qodefQiAddonsPagination;

})( jQuery );

(function ( $ ) {
	'use strict';

	qodefAddonsCore.shortcodes.qi_addons_for_elementor_premium_advanced_timeline = {};

	$( document ).ready(
		function ()
		{
			qodefAdvancedTimeline.init();
		}
	);

	var qodefAdvancedTimeline = {
		init: function () {
			var $holder = $( '.qodef-qi-advanced-timeline' );
			if ( $holder.length ) {
				$holder.each(
					function (i) {
						var $thisHolder = $( this );
						
						qodefAdvancedTimeline.initItem( $thisHolder );
					}
				);
			}
		},
		initItem: function ( $holder ) {

			if ( $holder.length ) {
				$holder.each(
					function ()
					{
						var $timeline           = $( this ),
							$timelineComponents = {};

						var $eventsMinDistance = $timeline.data( 'distance' );

						if ( qodefAddonsCore.windowWidth < 600 ) {
							$eventsMinDistance = 80;
						}

						//cache timeline components
						$timelineComponents['timelineNavWrapper']      = $timeline.find( '.qodef-at-nav-wrapper' );
						$timelineComponents['timelineNavWrapperWidth'] = $timelineComponents['timelineNavWrapper'].width();
						$timelineComponents['timelineNavInner']        = $timelineComponents['timelineNavWrapper'].find( '.qodef-at-nav-inner' );
						$timelineComponents['fillingLine']             = $timelineComponents['timelineNavInner'].find( '.qodef-at-nav-filling-line' );
						$timelineComponents['timelineEvents']          = $timelineComponents['timelineNavInner'].find( 'a' );
						$timelineComponents['timelineDates']           = qodefAdvancedTimeline.parseDate( $timelineComponents['timelineEvents'] );
						$timelineComponents['eventsMinLapse']          = qodefAdvancedTimeline.minLapse( $timelineComponents['timelineDates'] );
						$timelineComponents['timelineNavigation']      = $timeline.find( '.qodef-at-nav-navigation' );
						$timelineComponents['timelineEventContent']    = $timeline.find( '.qodef-at-content' );

						//select initial event
						$timelineComponents['timelineEvents'].first().addClass( 'qodef-selected' );
						$timelineComponents['timelineEventContent'].find( 'li' ).first().addClass( 'qodef-selected' );

						//assign a left postion to the single events along the timeline
						qodefAdvancedTimeline.setDatePosition(
							$timelineComponents,
							$eventsMinDistance
						);

						//assign a width to the timeline
						var $timelineTotWidth = qodefAdvancedTimeline.setTimelineWidth(
							$timelineComponents,
							$eventsMinDistance
						);

						//the timeline has been initialize - show it
						$timeline.addClass( 'qodef-loaded' );

						//detect click on the next arrow
						$timelineComponents['timelineNavigation'].on(
							'click',
							'.qodef-next',
							function ( e ) {
								e.preventDefault();
								qodefAdvancedTimeline.updateSlide(
									$timelineComponents,
									$timelineTotWidth,
									$eventsMinDistance,
									'next'
								);
							}
						);

						//detect click on the prev arrow
						$timelineComponents['timelineNavigation'].on(
							'click',
							'.qodef-prev',
							function ( e ) {
								e.preventDefault();
								qodefAdvancedTimeline.updateSlide(
									$timelineComponents,
									$timelineTotWidth,
									$eventsMinDistance,
									'prev'
								);
							}
						);

						//detect click on the a single event - show new event content
						$timelineComponents['timelineNavInner'].on(
							'click',
							'a',
							function ( e ) {
								e.preventDefault();

								var thisItem = $( this );

								$timelineComponents['timelineEvents'].removeClass( 'qodef-selected' );
								thisItem.addClass( 'qodef-selected' );

								qodefAdvancedTimeline.updateOlderEvents( thisItem );
								qodefAdvancedTimeline.updateFilling(
									thisItem,
									$timelineComponents['fillingLine'],
									$timelineTotWidth
								);
								qodefAdvancedTimeline.updateVisibleContent(
									thisItem,
									$timelineComponents['timelineEventContent']
								);
							}
						);

						var mq = qodefAdvancedTimeline.checkMQ();

						// Autoplay functionality
						var autoplayEnabled = $timeline.hasClass( 'qodef-autoplay--enabled' );

						if ( autoplayEnabled ) {
							// Autoplay variables
							var autoplaySpeed      = 4000,
								autoplayInterval,
								autoplayTimeout,
								autoplayTimeoutVal = 4000, // time in ms before autoplay resets again after user interruption
								lastNavItem        = $timeline.find( '.qodef-at-nav-inner ol li:last-child a' );

							// Autoplay logic
							var autoplayStart = function () {
								autoplayInterval = setInterval(
									function () {
										if ( lastNavItem.hasClass( 'qodef-selected' ) ) {
											stopAutoplay();
										} else {
											qodefAdvancedTimeline.showNewContent(
												$timelineComponents,
												$timelineTotWidth,
												'next'
											);
										}
									},
									autoplaySpeed
								);
							};

							// Start autoplay on appear
							$timeline.appear(
								function () {
									qodefAdvancedTimeline.showNewContent(
										$timelineComponents,
										$timelineTotWidth,
										'next'
									);
									autoplayStart();
								},
								{ accX: 0, accY: 0 }
							);

							// Reset autoplay function
							var resetAutoplay = function () {
								clearInterval( autoplayInterval );
								autoplayTimeout = setTimeout(
									function () {
										autoplayStart();
									},
									autoplayTimeoutVal
								);
							};

							var stopAutoplay = function () {
								clearInterval( autoplayInterval );
							};
						}

						// Desktop drag events
						var dragEvent = {
							down: 'mousedown',
							up: 'mouseup',
							target: 'target',
						};

						var isTouchDevice = qodef.html.hasClass( 'touchevents' );

						// Touch drag events
						if ( isTouchDevice ) {
							dragEvent = {
								down: 'touchstart',
								up: 'touchend',
								target: 'srcElement',
							};
						}

						// Check if user is scrolling on touch devices
						var touchScrolling = function ( oldEvent, newEvent ) {
							if ( isTouchDevice ) {
								var oldY = oldEvent.originalEvent.changedTouches[0].clientY,
									newY = newEvent.originalEvent.changedTouches[0].clientY;

								if ( Math.abs( newY - oldY ) > 100 ) { // 100 is drag sensitivity
									return true;
								}
							}
							return false;
						};

						var getXPos = function ( e ) {
							return isTouchDevice ? e.originalEvent.changedTouches[0].clientX : e.clientX;
						};

						// Check if user is tapping on link on touch devices
						var tapOnLink = function ( e ) {
							return (isTouchDevice && $( e[dragEvent.target] ).is( 'a' )) ? true : false;
						};

						// Drag logic for top timeline
						var mouseTopDown = false;
						$timeline.find( '.qodef-at-nav' ).on(
							dragEvent.down,
							function ( e ) {
								if ( ! mouseTopDown && ! tapOnLink( e ) ) {
									var xPos = getXPos( e );
									! isTouchDevice ? e.preventDefault() : null;
									mouseTopDown = true;

									$timeline.find( '.qodef-at-nav' ).one(
										dragEvent.up,
										function ( e ) {
											var xPosNew = getXPos( e );
											! isTouchDevice ? e.preventDefault() : null;
											if ( Math.abs( xPos - xPosNew ) > 10 ) { // drag sensitivity
												if ( xPos > xPosNew ) {
													qodefAdvancedTimeline.updateSlide(
														$timelineComponents,
														$timelineTotWidth,
														$eventsMinDistance,
														'next'
													);
												} else {
													qodefAdvancedTimeline.updateSlide(
														$timelineComponents,
														$timelineTotWidth,
														$eventsMinDistance,
														'prev'
													);
												}
											}
											mouseTopDown = false;
										}
									);
								}
							}
						);

						// Drag logic for content items
						var mouseDown = false;
						$timeline.find( '.qodef-at-content' ).on(
							dragEvent.down,
							function ( e ) {
								if ( ! mouseDown && ! $( e[dragEvent.target] ).is( 'a, span' ) ) {
									var oldEvent = e,
										xPos     = getXPos( e );
									mouseDown    = true;
									if ( autoplayEnabled ) {
										clearTimeout( autoplayTimeout );
										resetAutoplay();
									}

									$timeline.find( '.qodef-at-content' ).one(
										dragEvent.up,
										function ( e ) {
											var xPosNew = getXPos( e );
											if ( Math.abs( xPos - xPosNew ) > 10 && ! touchScrolling(
												oldEvent,
												e
											) ) {
												if ( xPos > xPosNew ) {
													qodefAdvancedTimeline.showNewContent(
														$timelineComponents,
														$timelineTotWidth,
														'next'
													);
												} else {
													qodefAdvancedTimeline.showNewContent(
														$timelineComponents,
														$timelineTotWidth,
														'prev'
													);
												}
											}
											mouseDown = false;
										}
									);
								}
							}
						);

						//keyboard navigation
						$( document ).keyup(
							function ( event )
							{
								if ( event.which === '37' && qodefAdvancedTimeline.elementInViewport( $timeline.get( 0 ) ) ) {
									qodefAdvancedTimeline.showNewContent(
										$timelineComponents,
										$timelineTotWidth,
										'prev'
									);
								} else if ( event.which === '39' && qodefAdvancedTimeline.elementInViewport( $timeline.get( 0 ) ) ) {
									qodefAdvancedTimeline.showNewContent(
										$timelineComponents,
										$timelineTotWidth,
										'next'
									);
								}
							}
						);
					}
				);
			}
		},
		updateSlide: function ( $timelineComponents, timelineTotWidth, $eventsMinDistance, string ) {
			//retrieve translateX value of $timelineComponents['timelineNavInner']
			var translateValue = qodefAdvancedTimeline.getTranslateValue( $timelineComponents['timelineNavInner'] ),
				wrapperWidth   = Number(
					$timelineComponents['timelineNavWrapper'].css( 'width' ).replace(
						'px',
						''
					)
				);
			//translate the timeline to the left('next')/right('prev')
			if ( string === 'next' ) {
				qodefAdvancedTimeline.translateTimeline(
					$timelineComponents,
					translateValue - wrapperWidth + $eventsMinDistance,
					wrapperWidth - timelineTotWidth
				);
			} else {
				qodefAdvancedTimeline.translateTimeline(
					$timelineComponents,
					translateValue + wrapperWidth - $eventsMinDistance
				);
			}
		},
		showNewContent: function ( $timelineComponents, timelineTotWidth, string ) {
			//go from one event to the next/previous one
			var visibleContent = $timelineComponents['timelineEventContent'].find( '.qodef-selected' ),
				newContent     = (string === 'next') ? visibleContent.next() : visibleContent.prev();

			if ( newContent.length > 0 ) { //if there's a next/prev event - show it
				var selectedDate = $timelineComponents['timelineNavInner'].find( '.qodef-selected' ),
					newEvent     = (string === 'next') ? selectedDate.parent( 'li' ).next( 'li' ).children( 'a' ) : selectedDate.parent( 'li' ).prev( 'li' ).children( 'a' );

				qodefAdvancedTimeline.updateFilling(
					newEvent,
					$timelineComponents['fillingLine'],
					timelineTotWidth
				);
				qodefAdvancedTimeline.updateVisibleContent(
					newEvent,
					$timelineComponents['timelineEventContent']
				);

				newEvent.addClass( 'qodef-selected' );
				selectedDate.removeClass( 'qodef-selected' );

				qodefAdvancedTimeline.updateOlderEvents( newEvent );
				qodefAdvancedTimeline.updateTimelinePosition(
					string,
					newEvent,
					$timelineComponents
				);
			}
		},
		updateTimelinePosition: function ( string, event, $timelineComponents ) {
			//translate timeline to the left/right according to the position of the qodef-selected event
			var eventStyle = window.getComputedStyle(
				event.get( 0 ),
				null,
			),
			eventLeft = Number(
				eventStyle.getPropertyValue( 'left' ).replace(
					'px',
					''
				)
			),
			timelineWidth = Number(
				$timelineComponents['timelineNavWrapper'].css( 'width' ).replace(
					'px',
					''
				)
			),
			timelineTotWidth = Number(
				$timelineComponents['timelineNavInner'].css( 'width' ).replace(
					'px',
					''
				)
			),
			timelineTranslate = qodefAdvancedTimeline.getTranslateValue( $timelineComponents['timelineNavInner'] );

			if ( (string === 'next' && eventLeft > timelineWidth - timelineTranslate) || (string === 'prev' && eventLeft < -timelineTranslate) ) {
				qodefAdvancedTimeline.translateTimeline(
					$timelineComponents,
					-eventLeft + timelineWidth / 2,
					timelineWidth - timelineTotWidth
				);
			}
		},
		translateTimeline: function ( $timelineComponents, value, totWidth ) {
			var timelineNavInner = $timelineComponents['timelineNavInner'].get( 0 );

			value = (value > 0) ? 0 : value; //only negative translate value
			value = ( ! (typeof totWidth === 'undefined') && value < totWidth) ? totWidth : value; //do not translate more than timeline width

			qodefAdvancedTimeline.setTransformValue(
				timelineNavInner,
				'translateX',
				value + 'px'
			);

			//update navigation arrows visibility
			(value === 0) ? $timelineComponents['timelineNavigation'].find( '.qodef-prev' ).addClass( 'qodef-inactive' ) : $timelineComponents['timelineNavigation'].find( '.qodef-prev' ).removeClass( 'qodef-inactive' );
			(value === totWidth) ? $timelineComponents['timelineNavigation'].find( '.qodef-next' ).addClass( 'qodef-inactive' ) : $timelineComponents['timelineNavigation'].find( '.qodef-next' ).removeClass( 'qodef-inactive' );
		},
		updateFilling: function ( selectedEvent, filling, totWidth ) {
			//change .qodef-at-nav-filling-line length according to the qodef-selected event

			if ( $( window ).width() < 480 ) {
				var lineWidth = ($( '.qodef-at-nav-wrapper' ).width() - 50) / 2;
				$( '.qodef-at-nav-inner ol > li:first-child > a' ).css(
					'left',
					lineWidth
				);
			}

			var eventStyle = window.getComputedStyle(
				selectedEvent.get( 0 ),
				null
			),
			eventLeft  = eventStyle.getPropertyValue( 'left' ),
			eventWidth = eventStyle.getPropertyValue( 'width' );

			eventLeft = Number(
				eventLeft.replace(
					'px',
					''
				)
			) + Number(
				eventWidth.replace(
					'px',
					''
				)
			) / 2;
			var scaleValue = eventLeft / totWidth;

			qodefAdvancedTimeline.setTransformValue(
				filling.get( 0 ),
				'scaleX',
				scaleValue
			);
		},
		setDatePosition: function ( $timelineComponents, min ) {
			for ( var i = 0; i < $timelineComponents['timelineDates'].length; i++ ) {
				var distance = qodefAdvancedTimeline.daydiff(
					$timelineComponents['timelineDates'][0],
					$timelineComponents['timelineDates'][i]
				),
				distanceNorm = Math.round( distance / $timelineComponents['eventsMinLapse'] ) + 2;

				$timelineComponents['timelineEvents'].eq( i ).css(
					'left',
					distanceNorm * min + 'px'
				);
			}
		},
		setTimelineWidth: function ( $timelineComponents, width ) {
			var timeSpan     = qodefAdvancedTimeline.daydiff(
				$timelineComponents['timelineDates'][0],
				$timelineComponents['timelineDates'][$timelineComponents['timelineDates'].length - 1]
			),
			timeSpanNorm = Math.round( timeSpan / $timelineComponents.eventsMinLapse ) + 4,
			totalWidth   = timeSpanNorm * width;

			if ( totalWidth < $timelineComponents['timelineNavWrapperWidth'] ) {
				totalWidth = $timelineComponents['timelineNavWrapperWidth'];
			}

			$timelineComponents['timelineNavInner'].css(
				'width',
				totalWidth + 'px'
			);

			qodefAdvancedTimeline.updateFilling(
				$timelineComponents['timelineNavInner'].find( 'a.qodef-selected' ),
				$timelineComponents['fillingLine'],
				totalWidth
			);
			qodefAdvancedTimeline.updateTimelinePosition(
				'next',
				$timelineComponents['timelineNavInner'].find( 'a.qodef-selected' ),
				$timelineComponents
			);

			return totalWidth;
		},
		updateVisibleContent: function ( event, timelineEventContent ) {
			var eventDate             = event.data( 'date' ),
				visibleContent        = timelineEventContent.find( '.qodef-selected' ),
				selectedContent       = timelineEventContent.find( '[data-date="' + eventDate + '"]' ),
				selectedContentHeight = selectedContent.height(),
				classEnetering        = 'qodef-selected qodef-enter-left',
				classLeaving          = 'qodef-leave-right';

			if ( selectedContent.index() > visibleContent.index() ) {
				classEnetering = 'qodef-selected qodef-enter-right';
				classLeaving   = 'qodef-leave-left';
			}

			selectedContent.attr(
				'class',
				classEnetering
			);

			visibleContent.attr(
				'class',
				classLeaving
			).one(
				'webkitAnimationEnd oanimationend msAnimationEnd animationend',
				function () {
					visibleContent.removeClass( 'qodef-leave-right qodef-leave-left' );
					selectedContent.removeClass( 'qodef-enter-left qodef-enter-right' );
				}
			);

			timelineEventContent.css(
				'height',
				selectedContentHeight + 'px'
			);
		},
		updateOlderEvents: function ( event ) {
			event.parent( 'li' ).prevAll( 'li' ).children( 'a' ).addClass( 'qodef-older-event' ).end().end().nextAll( 'li' ).children( 'a' ).removeClass( 'qodef-older-event' );
		},

		getTranslateValue: function ( timeline ) {
			var timelineStyle     = window.getComputedStyle(
				timeline.get( 0 ),
				null
			),
			timelineTranslate = timelineStyle.getPropertyValue( '-webkit-transform' ) || timelineStyle.getPropertyValue( '-moz-transform' ) || timelineStyle.getPropertyValue( '-ms-transform' ) || timelineStyle.getPropertyValue( '-o-transform' ) || timelineStyle.getPropertyValue( 'transform' ),
			translateValue    = 0;

			if ( timelineTranslate.indexOf( '(' ) >= 0 ) {
				timelineTranslate = timelineTranslate.split( '(' )[1];
				timelineTranslate = timelineTranslate.split( ')' )[0];
				timelineTranslate = timelineTranslate.split( ',' );

				translateValue = timelineTranslate[4];
			}

			return Number( translateValue );
		},
		setTransformValue: function ( element, property, value ) {
			element.style['-webkit-transform'] = property + '(' + value + ')';
			element.style['-moz-transform']    = property + '(' + value + ')';
			element.style['-ms-transform']     = property + '(' + value + ')';
			element.style['-o-transform']      = property + '(' + value + ')';
			element.style['transform']         = property + '(' + value + ')';
		},
		//based on http://stackoverflow.com/questions/542938/how-do-i-get-the-number-of-days-between-two-dates-in-javascript
		parseDate: function ( events ) {
			var dateArrays = [];

			events.each(
				function () {
					var singleDate  = $( this ),
						dateCompStr = new String( singleDate.data( 'date' ) ),
						dayComp     = ['2000', '0', '0'],
						timeComp    = ['0', '0'];

					if ( dateCompStr.length === 4 ) { //only year
						dayComp = [dateCompStr, '0', '0'];
					} else {
						var dateComp = dateCompStr.split( 'T' );

						dayComp = dateComp[0].split( '/' ); //only DD/MM/YEAR

						if ( dateComp.length > 1 ) { //both DD/MM/YEAR and time are provided
							dayComp  = dateComp[0].split( '/' );
							timeComp = dateComp[1].split( ':' );
						} else if ( dateComp[0].indexOf( ':' ) >= 0 ) { //only time is provide
							timeComp = dateComp[0].split( ':' );
						}
					}

					var newDate = new Date(
						dayComp[2],
						dayComp[0] - 1,
						dayComp[1],
						timeComp[0],
						timeComp[1]
					);

					dateArrays.push( newDate );
				}
			);

			return dateArrays;
		},
		daydiff: function ( first, second ) {
			return Math.round( (second - first) );
		},
		minLapse: function ( dates ) {
			//determine the minimum distance among events
			var dateDistances = [];

			for ( var i = 1; i < dates.length; i++ ) {
				var distance = qodefAdvancedTimeline.daydiff(
					dates[i - 1],
					dates[i]
				);
				dateDistances.push( distance );
			}

			return Math.min.apply(
				null,
				dateDistances
			);
		},
		/*
		 How to tell if a DOM element is visible in the current viewport?
		 http://stackoverflow.com/questions/123999/how-to-tell-if-a-dom-element-is-visible-in-the-current-viewport
		 */
		elementInViewport: function ( el ) {
			var top    = el.offsetTop;
			var left   = el.offsetLeft;
			var width  = el.offsetWidth;
			var height = el.offsetHeight;

			while (el.offsetParent) {
				el = el.offsetParent;
				top += el.offsetTop;
				left += el.offsetLeft;
			}

			return (
				top < (window.pageYOffset + window.innerHeight) &&
				left < (window.pageXOffset + window.innerWidth) &&
				(top + height) > window.pageYOffset &&
				(left + width) > window.pageXOffset
			);
		},

		checkMQ: function () {
			//check if mobile or desktop device
			return window.getComputedStyle(
				document.querySelector( '.qodef-qi-advanced-timeline' ),
				'::before'
			).getPropertyValue( 'content' ).replace(
				/'/g,
				''
			).replace(
				/"/g,
				''
			);
		}
	};

	qodefAddonsCore.shortcodes.qi_addons_for_elementor_premium_advanced_timeline.qodefAdvancedTimeline = qodefAdvancedTimeline;

})( jQuery );

(function ($) {
	'use strict';
	qodefAddonsPremiumCore.shortcodes.qi_addons_for_elementor_premium_advanced_toggle = {};

	$( document ).ready(
		function () {
			qodefAdvancedToggle.init();
		}
	);

	var qodefAdvancedToggle = {
		init: function () {
			var $holder = $( '.qodef-qi-advanced-toggle' );

			if ( $holder.length ) {
				$holder.each(
					function () {
						var $thisHolder = $( this );

						qodefAdvancedToggle.initItem( $thisHolder );
					}
				);
			}
		},
		initItem: function ( $holder ) {
			if ( ! $holder.hasClass( 'qodef-qi-advanced-toggle' ) ) { return };
			
			var $switcher     = $holder.find( '> .qodef-m-switcher input[type=checkbox]' ),
				$mainHolder   = $holder.find( '> .qodef-m-at-content' ),
				$firstHolder  = $mainHolder.find( '> .qodef-e-content-holder' ).first(),
				$secondHolder = $mainHolder.find( '> .qodef-e-content-holder' ).last(),
				firstHeight   = $firstHolder.outerHeight(),
				secondHeight  = $secondHolder.outerHeight(),
				height        = firstHeight > secondHeight ? firstHeight : secondHeight;

			$mainHolder.height( height );

			$firstHolder.addClass( 'qodef--active' );

			$switcher.on(
				'change',
				function( e ) {
					var checked = $switcher.is( ':checked' );

					if ( checked ) {
						$firstHolder.removeClass( 'qodef--active' );
						$secondHolder.addClass( 'qodef--active' );
					} else {
						$secondHolder.removeClass( 'qodef--active' );
						$firstHolder.addClass( 'qodef--active' );
					}
				}
			)
		}
	};

	qodefAddonsPremiumCore.shortcodes.qi_addons_for_elementor_premium_advanced_toggle.qodefAdvancedToggle = qodefAdvancedToggle;

})( jQuery );

(function ($) {
	'use strict';
	
	qodefAddonsPremiumCore.shortcodes.qi_addons_for_elementor_premium_business_reviews_yelp = {};
	qodefAddonsPremiumCore.shortcodes.qi_addons_for_elementor_premium_business_reviews_yelp.qodefMasonryLayout = qodefAddonsCore.qodefMasonryLayout;

})( jQuery );

(function ( $ ) {
	'use strict';

	qodefAddonsPremiumCore.shortcodes.qi_addons_for_elementor_premium_animated_device_slider = {};

	$( document ).ready(
		function () {
			qodefAnimatedDeviceSlider.init();
		}
	);

	var qodefAnimatedDeviceSlider = {
		init: function () {
			this.holder = $( '.qodef-qi-animated-device-slider' ),
				this.header = $( '#qodef-page-header-inner' );

			if ( this.holder.length ) {
				this.holder.each(
					function () {
						qodefAnimatedDeviceSlider.initItem( $( this ) );
					}
				);
			}
		},
		initItem: function ( $thisHolder ) {
			qodefAnimatedDeviceSlider.createSlider( $thisHolder );
			qodefAnimatedDeviceSlider.forceInputFocus( $thisHolder );

			var thisHolderTopOffset    = $thisHolder.offset().top,
				thisHolderBottomOffset = $thisHolder.offset().top + $thisHolder.outerHeight( true ),
				pageTopOffset          = ( $( '#qodef-page-wrapper' ).length ) ? $( '#qodef-page-wrapper' ).offset().top : false;

			if ( thisHolderTopOffset === pageTopOffset ) {
				qodefAddonsCore.qodefScroll.disable();
			}

			//we have to listen wheel, since slider could be positioned on middle of page in some situations, and than our qodefIsInViewport will not work
			window.addEventListener(
				'wheel',
				function ( e ) {

					var previousPosition = $( window ).scrollTop(),
						currentPosition  = previousPosition + e.deltaY;

					//check direction of scroll and scroll page to slider slider top offset position
					if ( (e.deltaY > 0 && currentPosition < thisHolderTopOffset) || (e.deltaY < 0 && thisHolderBottomOffset < currentPosition + qodefAddonsCore.windowHeight) ) {
						qodefAddonsCore.qodefIsInViewport.check(
							$thisHolder,
							function () {
								qodefAddonsCore.qodefScroll.disable();
								$( 'html, body' ).stop().animate(
									{
										scrollTop: thisHolderTopOffset
									},
									1200
								);
							},
							true
						);
					}
				},
				{ passive: false }
			);
		},
		createSlider: function ( $holder ) {
			var $pasepartuWrapper  = $( '.qodef--passepartout' ),
				$stripe            = $holder.find( '.qodef-m-stripe' ),
				$frameImage        = $holder.find( '.qodef-m-inner-frame' ),
				$frameInfo         = $holder.find( '.qodef-m-frame-info' ),
				$frameSlideTagline = $frameInfo.find( '.qodef-m-frame-slide-tagline' ),
				$frameSlideNumber  = $frameInfo.find( '.qodef-m-frame-slide-number' ),
				$frameDecoration   = $frameInfo.find( '.qodef-m-frame-decoration' ),
				$frameLink         = $frameInfo.find( '.qodef-m-frame-link' ),
				$frameTitle        = $frameInfo.find( '.qodef-m-frame-title' ),
				$frameText         = $frameInfo.find( '.qodef-m-frame-text' ),
				$swiperInstance    = $holder.find( '.swiper-container' ),
				$swiperSlide       = $swiperInstance.find( '.swiper-slide' ),
				lastSlide          = $swiperSlide.length,
				secondLastSlide    = lastSlide - 1,
				indexCounter       = 1,
				currentActiveIndex,
				currentActiveTagline,
				currentActiveTitle,
				currentActiveLink,
				currentActiveText,
				currentActiveDecoration,
				onLastSlide        = false,
				currentActiveImageSrc,
				scrollStart        = false,

				$swiper            = new Swiper(
					$swiperInstance[0],
					{
						loop: false,
						direction: 'vertical',
						slidesPerView: 1,
						touchStartForcePreventDefault: true,
						speed: 1000,
						on: {
							init: function () {
								var scrollStart = false;
								$swiperInstance.off().on(
									'wheel',
									function ( e ) {
										if ( ! scrollStart ) {
											scrollStart = true;

											if ( e.originalEvent.deltaY > 0 ) {
												$swiperInstance[0].swiper.slideNext();
											} else {
												$swiperInstance[0].swiper.slidePrev();
											}

											setTimeout(
												function () {
													scrollStart = false;
												},
												1000
											);
										}
									}
								);
							},
						},
						pagination: {
							el: $holder.find( '.swiper-pagination' )[0],
							type: 'bullets',
							clickable: true
						},
					}
				);

			if ( qodefAddonsCore.windowWidth < 1025 ) {
				var headerHeight = $( '.qodef-mobile-header-inner' ).css( 'height' );
				$holder.css(
					'height',
					'calc(100vh - ' + headerHeight + ')'
				);
				$swiperInstance.css(
					'height',
					'calc(100vh - ' + headerHeight + ')'
				);
				$pasepartuWrapper.css(
					'padding',
					0
				);
			}

			//initialize swiper
			qodefAddonsCore.qodefWaitForImages.check(
				$holder,
				function () {
					$swiper.init();

					var rotateDegrees          = 0,
						swiperPagination       = $holder.find( '.swiper-pagination' ),
						swiperPaginationBullet = swiperPagination.find( '.swiper-pagination-bullet' ),
						pageTopOffset          = ( $( '#qodef-page-wrapper' ).length ) ? $( '#qodef-page-wrapper' ).offset().top : false;

					$swiperSlide.each(
						function () {
							$( this ).attr(
								'slide-index',
								indexCounter
							);
							$( this ).data(
								'slide-index',
								indexCounter
							);
							var imgSrc = $( this ).find( '.qodef-m-item>img' ).attr( 'src' ),
								imgAlt = $( this ).find( '.qodef-m-item>img' ).attr( 'alt' );
							if ( imgSrc !== undefined ) {
								$frameImage.append( '<div><img src="' + imgSrc + '" alt="' + imgAlt + '"></div>' );
							}
							indexCounter++;
						}
					);

					$frameImage.find( 'div:first-child' ).addClass( 'active' );

					function enableAdjacentPagination() {
						var activeBullet = swiperPagination.find( '.swiper-pagination-bullet-active' );
						swiperPaginationBullet.removeClass( 'bullet-clickable' );
						activeBullet.addClass( 'bullet-clickable' );
						activeBullet.next().addClass( 'bullet-clickable' );
						activeBullet.prev().addClass( 'bullet-clickable' );
					}

					// function find active item
					function findActiveItem() {
						var currentSlide        = $swiperInstance.find( '.swiper-slide-active' ),
							currentslideOptions = {};

						currentActiveIndex      = currentSlide.data( 'slide-index' );
						currentActiveTagline    = currentSlide.find( '.qodef-m-item-tagline' ).text();
						currentActiveTitle      = currentSlide.find( '.qodef-m-item-title' ).text();
						currentActiveLink       = currentSlide.find( '.qodef-m-item-link' ).attr( 'href' );
						currentActiveText       = currentSlide.find( '.qodef-m-item-text' ).text();
						currentActiveDecoration = currentSlide.find( '.qodef-m-item-decoration' ).html();
						currentActiveImageSrc   = currentSlide.find( '>.qodef-m-item>img' ).attr( 'src' );

						currentslideOptions = typeof currentSlide.data( 'options' ) !== 'undefined' ? currentSlide.data( 'options' ) : {};
						if ( currentslideOptions.hasOwnProperty( 'headerSkin' ) ) {
							qodefAnimatedDeviceSlider.header
							.removeClass( 'qodef-skin--light qodef-skin--dark' )
							.addClass( 'qodef-skin--' + currentslideOptions.headerSkin );

						}
					}

					function animateFrameImages() {
						$frameImage.find( 'div' ).removeClass( 'prev-active' );
						$frameImage.find( 'div.active' ).removeClass( 'active' ).addClass( 'prev-active' );
						$frameImage.find( 'div:nth-child(' + currentActiveIndex + ')' ).addClass( 'active' );
					}

					function updateFrameInfo() {
						$frameSlideTagline.text( currentActiveTagline );
						$frameSlideNumber.text( '0' + currentActiveIndex );
						$frameDecoration.html( currentActiveDecoration );
						$frameTitle.text( currentActiveTitle );
						$frameLink.attr(
							'href',
							currentActiveLink
						);
						$frameText.text( currentActiveText );
					}

					function readyAnimation() {
						setTimeout(
							function () {
								$frameInfo.removeClass( 'qodef-m-frame-animate-out' );
							},
							700
						);
						$holder.removeClass( 'qodef-animated-device-slider-ready-animation' );
					}

					// Initialize frame info when slider is ready
					findActiveItem();
					enableAdjacentPagination();
					updateFrameInfo();

					setTimeout(
						function () {
							readyAnimation();
						},
						500
					);

					$swiper.on(
						'slideNextTransitionStart',
						function () {
							if ( ! onLastSlide ) {
								rotateDegrees += 180;
								$stripe.css(
									'transform',
									'rotate(' + rotateDegrees + 'deg)'
								);
							}
						}
					);

					$swiper.on(
						'slidePrevTransitionStart',
						function () {
							if ( currentActiveIndex !== secondLastSlide ) {
								rotateDegrees -= 180;
								$stripe.css(
									'transform',
									'rotate(' + rotateDegrees + 'deg)'
								);
							}
						}
					);

					$swiper.on(
						'slideChangeTransitionStart',
						function () {
							findActiveItem();
							animateFrameImages();
							enableAdjacentPagination();

							if ( currentActiveIndex == lastSlide ) {
								onLastSlide = true;
								$holder.addClass( 'qodef-animated-device-slider-last-slide' );
							} else {
								onLastSlide = false;
								$holder.removeClass( 'qodef-animated-device-slider-last-slide' );
							}

							if ( ! onLastSlide ) {
								$frameInfo.addClass( 'qodef-m-frame-animate-out' );

								setTimeout(
									function () {
										// if even slide move the frame info down
										if ( currentActiveIndex % 2 == 0 ) {
											$frameInfo.addClass( 'qodef-m-frame-even' );
										} else {
											$frameInfo.removeClass( 'qodef-m-frame-even' );
										}
										updateFrameInfo();
										$frameInfo.removeClass( 'qodef-m-frame-animate-out' );
									},
									800
								);
							}
						}
					);

					$swiper.on(
						'slideNextTransitionEnd',
						function () {
							if ( $swiper.isEnd ) {
								qodefAddonsCore.qodefScroll.enable();
							} else {
								qodefAddonsCore.qodefScroll.disable();
							}
						}
					);

					$swiper.on(
						'slidePrevTransitionEnd',
						function () {
							if ( $swiper.isBeginning ) {
								if ( $holder.offset().top !== pageTopOffset ) {
									qodefAddonsCore.qodefScroll.enable();
								}
							} else {
								qodefAddonsCore.qodefScroll.disable();
							}
						}
					);
				}
			);
		},
		forceInputFocus: function ( $holder ) {
			var $form = $holder.find( '.qodef-m-contact-form' );

			if ( $form.length ) {
				var $inputs = $form.find( 'input' );

				if ( $inputs.length ) {
					$inputs.each(
						function () {
							var $thisInput = $( this );

							$thisInput.on(
								'click',
								function () {
									$thisInput.focus();
								}
							);
						}
					);
				}
			}
		}
	};

	qodefAddonsPremiumCore.shortcodes.qi_addons_for_elementor_premium_animated_device_slider.qodefAnimatedDeviceSlider = qodefAnimatedDeviceSlider;

})( jQuery );

(function ($) {
	'use strict';
	
	qodefAddonsPremiumCore.shortcodes.qi_addons_for_elementor_premium_business_reviews_google = {};
	qodefAddonsPremiumCore.shortcodes.qi_addons_for_elementor_premium_business_reviews_google.qodefMasonryLayout = qodefAddonsCore.qodefMasonryLayout;

})( jQuery );

(function ($) {
	'use strict';
	qodefAddonsPremiumCore.shortcodes.qi_addons_for_elementor_premium_circled_slider = {};

	$( document ).ready(
		function () {
			qodefCircledSlider.init();
		}
	);

	var qodefCircledSlider = {
		init: function () {
			var $holder = $( '.qodef-qi-circled-slider' );

			if ( $holder.length ) {
				$holder.each(
					function () {
						var $thisHolder = $( this );

						qodefCircledSlider.initItem( $thisHolder );
					}
				);
			}
		},
		initItem: function ( $holder ) {
			var $swiperHolder = $holder.find( '.qodef-m-swiper' ),
				$sliderHolder = $holder.find( '.qodef-m-items' ),
				$pagination   = $holder.find( '.swiper-pagination' );

			var $thumbs = [];
			var $images = $sliderHolder.find( '.qodef-m-slide-content img' );
			$images.each(
				function() {
					$thumbs.push( $( this ).attr( "src" ) );
				}
			);

			var $swiper = new Swiper(
				$swiperHolder[0],
				{
					slidesPerView: 'auto',
					centeredSlides: true,
					spaceBetween: 0,
					effect: 'fade',
					autoplay: {
						delay: 5000,
						disableOnInteraction: false
					},
					loop: true,
					speed: 300,
					pagination: {
						el: $pagination[0],
						type: 'bullets',
						clickable: true,
						renderBullet: function (index, className) {

							// autoplay delay & speed used for transition duration
							var transition = 5800;
							return '<span class="' + className + '">' + '<svg class="progress-circle svg-content" width="100%" height="100%" viewBox="-1 -1 102 102"><path d="M50,1 a49,49 0 0,1 0,98 a49,49 0 0,1 0,-98" style="stroke-dasharray: 307.919, 307.919; stroke-dashoffset: 307.919; animation-duration: ' + transition + 'ms;"></path> </svg><img src=" ' + $thumbs[index] + ' ">' + '</span>';
						}
					},
					on: {
						init: function () {
							setTimeout(
								function () {
											$sliderHolder.addClass( 'qodef-swiper--initialized' );
											$pagination.find('.swiper-pagination-bullet').addClass('qodef--appear');
								},
								500
							);
						}
					}
				}
			);
		}
	};

	qodefAddonsPremiumCore.shortcodes.qi_addons_for_elementor_premium_circled_slider.qodefCircledSlider  = qodefCircledSlider;

})( jQuery );

(function ( $ ) {
	'use strict';

	qodefAddonsPremiumCore.shortcodes.qi_addons_for_elementor_premium_data_table = {};

	$( document ).ready(
		function () {
			qodefTables.init();
		}
	);

	var qodefTables = {
		init: function () {
			this.holder = $( '.qodef-qi-data-table' );
			if ( this.holder.length ) {
				this.holder.each(
					function () {
						qodefTables.initItem( $( this ) );
					}
				);
			}
		},
		initItem: function( $currentItem ) {
			var $tables     = $currentItem.find( '.qodef-m-table' ),
				$pagination = $currentItem.find( '.qodef-m-table-pagination' ),
				$numbers    = $pagination.find( '.qodef-e-number' ),
				$prev       = $pagination.find( '.qodef-m-prev' ),
				$next       = $pagination.find( '.qodef-m-next' );

			$numbers.first().addClass( 'qodef--current' );
			$tables.first().addClass( 'qodef--active' );

			$numbers.each(
				function () {
					$( this ).on(
						'click',
						function() {
							var id            = $( this ).data( 'id' ),
								$currentTable = $tables.eq( id - 1 );

							$tables.removeClass( 'qodef--active' );
							$currentTable.addClass( 'qodef--active' );

							$numbers.removeClass( 'qodef--current' );
							$( this ).addClass( 'qodef--current' );

							if ( id === 1 ) {
								$prev.addClass( 'qodef--disabled' );
								$next.removeClass( 'qodef--disabled' );
							} else if ( id === $numbers.length ) {
								$prev.removeClass( 'qodef--disabled' );
								$next.addClass( 'qodef--disabled' );
							} else {
								$prev.removeClass( 'qodef--disabled' );
								$next.removeClass( 'qodef--disabled' );
							}
						}
					);
				}
			);

			$prev.on(
				'click',
				function () {
					var $triggerNumber = $numbers.filter( '.qodef--current' ).prev();

					$triggerNumber.trigger( 'click' );
				}
			);

			$next.on(
				'click',
				function () {
					var $triggerNumber = $numbers.filter( '.qodef--current' ).next();

					$triggerNumber.trigger( 'click' );
				}
			)
		},
	};

	qodefAddonsPremiumCore.shortcodes.qi_addons_for_elementor_premium_data_table.qodefTables = qodefTables;

})( jQuery );

(function ( $ ) {
	'use strict';
	qodefAddonsPremiumCore.shortcodes.qi_addons_for_elementor_premium_content_menu = {};

	$( document ).ready(
		function () {
			qodefContentMenuBottomLine.init();
		}
	);

	var qodefContentMenuBottomLine = {
		init: function () {
			this.holder = $( '.qodef-qi-content-menu.qodef-menu-item-style--with-active-floating-underline' );

			if ( this.holder.length ) {
				this.holder.each(
					function () {
						qodefContentMenuBottomLine.initItem( $( this ) );
					}
				);
			}
		},
		initItem: function ( $currentItem ) {
			let $mainMenu  = $currentItem.find( '> nav > ul' ),
				$menuLine  = $currentItem.find( '.qodef-content-menu-line' ),
				$menuItems = $mainMenu.find( '> li.menu-item' ),
				initialOffset;

			if ( $menuItems.filter( '.current-menu-item' ).length ) {
				initialOffset = $menuItems.filter( '.current-menu-item' ).find('a').offset().left;
				$menuLine.css(
					'width',
					$menuItems.filter( '.current-menu-item' ).find('a').outerWidth()
				);
			} else {
				initialOffset = $menuItems.first().find('a').offset().left;
				$menuLine.css(
					'width',
					$menuItems.first().find('a').outerWidth()
				);
			}

			//initial positioning
			$menuLine.css(
				'left',
				initialOffset - $mainMenu.offset().left
			);

			$menuItems.mouseenter(
				function () {
					let $menuItem      = $( this ),
						menuItemLink   = $menuItem.find('a'),
						menuItemWidth  = menuItemLink.outerWidth(),
						mainMenuOffset = $mainMenu.offset().left,
						menuItemOffset = menuItemLink.offset().left - mainMenuOffset;

					$menuLine.css(
						'width',
						menuItemWidth
					);
					$menuLine.css(
						'left',
						menuItemOffset
					);
				}
			);
			//fx off
			$mainMenu.mouseleave(
				function () {
					if ( $menuItems.filter( '.current-menu-item' ).length ) {
						$menuLine.css(
							'width',
							$menuItems.filter( '.current-menu-item' ).find('a').outerWidth()
						);
					} else {
						$menuLine.css(
							'width',
							$menuItems.first().find('a').outerWidth()
						);
					}
					$menuLine.css(
						'left',
						initialOffset - $mainMenu.offset().left
					);
				}
			);

		}
	};

	qodefAddonsPremiumCore.shortcodes.qi_addons_for_elementor_premium_content_menu.qodefContentMenuBottomLine = qodefContentMenuBottomLine;

})( jQuery );

(function ( $ ) {
	'use strict';

	qodefAddonsPremiumCore.shortcodes.qi_addons_for_elementor_premium_divided_showcase_carousel = {};

	$( document ).ready(
		function () {
			qodefDividedShowcaseCarousel.init();
		}
	);

	var qodefDividedShowcaseCarousel = {
		init: function () {
			this.sliders = $( '.qodef-qi-divided-showcase-carousel' );

			if ( this.sliders.length ) {
				this.sliders.each(
					function () {
						qodefDividedShowcaseCarousel.initItem( $( this ) );
					}
				);
			}
		},
		initItem: function( $currentItem ) {
			qodefAddonsCore.qodefSwiperElementorCheck.init( qodefDividedShowcaseCarousel.initSwiperReinit, $currentItem );
		},
		initSwiperReinit: function ( $currentItem ) {
			var $mainSlider   = $currentItem.find( '.qodef-qi-swiper-container:not(.qodef-divided-showcase-carousel-text)' ),
				$deviceSlider = $currentItem.find( '.qodef-qi-swiper-container.qodef-divided-showcase-carousel-text' ),
				deviceSliderOptions,
				numItemsMain,
				autoplay      = $mainSlider[0].swiper.autoplay.running;

			numItemsMain                        = $mainSlider.find( '.swiper-slide' ).length;
			deviceSliderOptions                 = $deviceSlider[0].swiper.params;
			deviceSliderOptions['loopedSlides'] = numItemsMain;//real number of slides should be the same on both sides because of controller
			deviceSliderOptions['autoplay']     = 'false';

			$mainSlider[0].swiper.autoplay.stop();
			$deviceSlider[0].swiper.destroy();

			let $swiperDeviceNew = new Swiper(
				$deviceSlider[0],
				Object.assign( deviceSliderOptions )
			);

			$mainSlider[0].swiper.controller.control = $swiperDeviceNew;
			$mainSlider[0].swiper.controller.by      = 'slide';
			$mainSlider[0].swiper.controller.inverse = true;
			$swiperDeviceNew.controller.control      = $mainSlider[0].swiper;

			if ( autoplay ) {
				$mainSlider[0].swiper.autoplay.start();
			}
			$currentItem.addClass( 'qodef--visible' );

			$mainSlider[0].swiper.on(
				'slideChangeTransitionStart',
				function () {
					qodefDividedShowcaseCarousel.addBackwardClasses(
						$currentItem,
						$mainSlider[0].swiper
					);
				}
			);
		},
		addBackwardClasses: function ( $holder, $swiperInstance ) {
			if ( $swiperInstance.activeIndex < $swiperInstance.previousIndex ) {
				$holder.addClass( 'qodef-swiping-backwards' );
			} else {
				$holder.removeClass( 'qodef-swiping-backwards' );
			}
		}
	};

	qodefAddonsPremiumCore.shortcodes.qi_addons_for_elementor_premium_divided_showcase_carousel.qodefSwiper                  = qodefAddonsCore.qodefSwiper;
	qodefAddonsPremiumCore.shortcodes.qi_addons_for_elementor_premium_divided_showcase_carousel.qodefDividedShowcaseCarousel = qodefDividedShowcaseCarousel;
	qodefAddonsPremiumCore.shortcodes.qi_addons_for_elementor_premium_divided_showcase_carousel.qodefSplitting               = qodefAddonsPremiumCore.qodefSplitting;

})( jQuery );

(function ( $ ) {
	'use strict';

	qodefAddonsPremiumCore.shortcodes.qi_addons_for_elementor_premium_divided_device_slider             = {};
	qodefAddonsPremiumCore.shortcodes.qi_addons_for_elementor_premium_divided_device_slider.qodefSwiper = qodefAddonsCore.qodefSwiper;

	$( document ).ready(
		function () {
			qodefDividedDeviceSlider.init();
		}
	);

	$( window ).on(
		'elementor/frontend/init',
		function () {
			if ( elementorFrontend.isEditMode() ) {
				elementor.channels.editor.on(
					'change',
					function ( e ) {
						if ( typeof e.$el === 'object' && e.$el.hasClass( 'elementor-control-content_width' ) && typeof e.options.element.$el === 'object' ) {
							var $item = e.options.element.$el.find( '.qodef-qi-divided-device-slider' );

							if ( $item.length ) {
								qodefDividedDeviceSlider.reinitMainSwiper( $item.find( '.qodef-m-main-slider' ) );
							}
						}
					}
				);
			}
		}
	);

	var qodefDividedDeviceSlider = {
		init: function () {
			this.holder = $( '.qodef-qi-divided-device-slider' );

			if ( this.holder.length ) {
				this.holder.each(
					function () {
						qodefDividedDeviceSlider.initItem( $( this ) );
					}
				);
			}
		},
		initItem: function( $currentItem ) {
			qodefAddonsCore.qodefSwiperElementorCheck.init( qodefDividedDeviceSlider.initSwiperReinit, $currentItem );
		},
		initSwiperReinit: function ( $currentItem ) {
			var $mainSlider   = $currentItem.find( '.qodef-m-main-slider' ),
				$deviceSlider = $currentItem.find( '.qodef-m-device-slider' ),
				deviceSliderOptions,
				numItemsMain,
				autoplay;

			numItemsMain                        = $mainSlider.find( '.swiper-slide' ).length;
			deviceSliderOptions                 = $deviceSlider[0].swiper.params;
			deviceSliderOptions['loopedSlides'] = numItemsMain;//real number of slides should be the same on both sides because of controller
			deviceSliderOptions ['autoplay']    = 'false';
			autoplay                            = $mainSlider[0].swiper.autoplay.running;

			$mainSlider[0].swiper.autoplay.stop();
			$deviceSlider[0].swiper.destroy();

			let $swiperDeviceNew = new Swiper(
				$deviceSlider[0],
				Object.assign( deviceSliderOptions )
			);

			qodefDividedDeviceSlider.enableScroll(
				$currentItem,
				$mainSlider[0].swiper
			);

			if ( autoplay ) {
				$mainSlider[0].swiper.autoplay.start();
			}

			$currentItem.addClass( 'qodef--visible' );

			$mainSlider.find( '.swiper-slide-active' ).addClass( 'qodef--active qodef--initially-active' );
			$deviceSlider.find( '.swiper-slide-active' ).addClass( 'qodef--active qodef--initially-active' );

			$mainSlider[0].swiper.on(
				'slideChangeTransitionStart',
				function () {
					var prevActiveIndex  = $mainSlider[0].swiper.previousIndex;
					var $prevActiveSlide = $mainSlider.find( '.swiper-slide' ).eq( prevActiveIndex );
					var $activeSlide     = $mainSlider.find( '.swiper-slide-active' );

					$activeSlide.siblings().removeClass( 'qodef--active qodef--initially-active' );
					$activeSlide.addClass( 'qodef--active' );

					$prevActiveSlide.siblings().removeClass( 'qodef--prev-active' );
					$prevActiveSlide.addClass( 'qodef--prev-active' );

					if ( $swiperDeviceNew.realIndex !== $mainSlider[0].swiper.realIndex ) {//transition was triggered by mobile device slider if condition false
						$swiperDeviceNew.slideTo( $mainSlider[0].swiper.realIndex );//controller was buggy on loop fix
					}
				}
			);

			$swiperDeviceNew.on(
				'slideChangeTransitionStart',
				function () {
					var prevActiveIndex  = $swiperDeviceNew.previousIndex;
					var $prevActiveSlide = $deviceSlider.find( '.swiper-slide' ).eq( prevActiveIndex );
					var $activeSlide     = $deviceSlider.find( '.swiper-slide-active' );

					$activeSlide.siblings().removeClass( 'qodef--active qodef--initially-active' );
					$activeSlide.addClass( 'qodef--active' );
					$prevActiveSlide.siblings().removeClass( 'qodef--prev-active' );
					$prevActiveSlide.addClass( 'qodef--prev-active' );

					if ( $swiperDeviceNew.realIndex !== $mainSlider[0].swiper.realIndex ) {
						if ( $swiperDeviceNew.activeIndex > $swiperDeviceNew.previousIndex ) {
							$mainSlider[0].swiper.slideNext();
						} else {
							$mainSlider[0].swiper.slidePrev();
						}
					}
				}
			);
		},
		enableScroll: function ( $currentItem, $mainSliderSwiper ) {
			if ( $currentItem.hasClass( 'qodef--change-on-scroll' ) ) {
				var scrollStart        = false;

				$currentItem.on(
					'wheel',
					function ( e ) {
						if ( ! scrollStart ) {
							scrollStart = true;

							if ( e.originalEvent.deltaY > 0 ) {
								$mainSliderSwiper.slideNext();
							} else {
								$mainSliderSwiper.slidePrev();
							}

							setTimeout(
								function () {
									scrollStart = false;
								},
								1000
							);
						}
					}
				);
			}
		},
		reinitMainSwiper: function ( $currentItem ) {
			$currentItem[0].swiper.update();
		}
	};
	qodefAddonsPremiumCore.shortcodes.qi_addons_for_elementor_premium_divided_device_slider.qodefDividedDeviceSlider = qodefDividedDeviceSlider;
	qodefAddonsPremiumCore.shortcodes.qi_addons_for_elementor_premium_divided_device_slider.qodefSplitting           = qodefAddonsPremiumCore.qodefSplitting;

})( jQuery );

(function ( $ ) {
	'use strict';

	qodefAddonsPremiumCore.shortcodes.qi_addons_for_elementor_premium_divided_slider_diverge = {};

	$( document ).ready(
		function () {
			qodefDividedSliderDiverge.init();
		}
	);

	var qodefDividedSliderDiverge = {
		init: function () {
			var $holder = $( '.qodef-qi-divided-slider-diverge' );
			if ( $holder.length ) {
				qodefDividedSliderDiverge.initItem( $holder );
			}
		},
		initItem: function ( $currentItem ) {
			var breakpoint         	   = qodefDividedSliderDiverge.getBreakpoint( $currentItem ),
				initialNavigationStyle = '',
				$currentItemPag		   = $currentItem.find( '.qodef-m-counter .qodef-m-current' ),
				$numberOfSections      = $currentItem.find( '.qodef-m-slide-content' ),
				$numberOfItems 	       = $currentItem.find( '.qodef-m-counter .qodef-m-max' ),
				$prevNavigation	       = $( '.qodef-e-nav-arrow.qodef--prev' ),
				$nextNavigation        = $( '.qodef-e-nav-arrow.qodef--next' );

			if ( $currentItem.hasClass( 'qodef-skin--light' ) ) {
				initialNavigationStyle = 'light';
			} else if ( $currentItem.hasClass( 'qodef-skin--dark' ) ) {
				initialNavigationStyle = 'dark';
			}

			$numberOfItems.text( '0' + ( $numberOfSections.length ) );

			$currentItem.multiscroll(
				{
					navigation: false,
					navigationPosition: 'right',
					scrollingSpeed: 1200,
					easing: 'easeInOutCubic',
					afterRender: function () {
						qodefAddonsPremiumCore.body.addClass( 'qodef-qi-divided-slider-diverge--initialized' );
						qodefDividedSliderDiverge.navigationClassHandler( $( '.ms-left .ms-section:first-child' ).data( 'navigation-skin' ), initialNavigationStyle, $currentItem );

						$currentItemPag.text( '01' );

						$prevNavigation.on(
							'click',
							function(){
								$.fn.multiscroll.moveSectionUp();
							}
						);

						$nextNavigation.on(
							'click',
							function(){
								$.fn.multiscroll.moveSectionDown();
							}
						);
					},
					onLeave: function ( index, nextIndex ) {
						qodefDividedSliderDiverge.navigationClassHandler( $( $( '.ms-left .ms-section' )[nextIndex - 1] ).data( 'navigation-skin' ), initialNavigationStyle, $currentItem );

						if ( nextIndex < 10 ) {
							$currentItemPag.text( '0' + nextIndex );
						} else {
							$currentItemPag.text( nextIndex );
						}

					},
				}
			);

			$currentItem.height( qodefAddonsPremiumCore.windowHeight );
			qodefDividedSliderDiverge.buildAndDestroy( breakpoint );

			$( window ).resize(
				function () {
					qodefDividedSliderDiverge.buildAndDestroy( breakpoint );
				}
			);
		},
		getBreakpoint: function ( $holder ) {
			if ( $holder.hasClass( 'qodef-disable-below--768' ) ) {
				return 768;
			} else {
				return 1024;
			}
		},
		buildAndDestroy: function ( breakpoint ) {

			if ( qodefAddonsPremiumCore.windowWidth <= breakpoint ) {
				$.fn.multiscroll.destroy();
				$( 'html, body' ).css( 'overflow', 'initial' );
				qodefAddonsPremiumCore.body.removeClass( 'qodef-qi-divided-slider-diverge--initialized' );
			} else {
				$.fn.multiscroll.build();
				qodefAddonsPremiumCore.body.addClass( 'qodef-qi-divided-slider-diverge--initialized' );
			}
		},
		navigationClassHandler: function ( slideNavigationStyle, initialNavigationStyle, currentItem ) {

			if ( slideNavigationStyle !== undefined && slideNavigationStyle !== '' ) {
				currentItem.removeClass( 'qodef-skin--light qodef-skin--dark' ).addClass( 'qodef-skin--' + slideNavigationStyle );
			} else if ( initialNavigationStyle !== '' ) {
				currentItem.removeClass( 'qodef-skin--light qodef-skin--dark' ).addClass( 'qodef-skin--' + slideNavigationStyle );
			} else {
				currentItem.removeClass( 'qodef-skin--light qodef-skin--dark' );
			}
		}
	};

	qodefAddonsPremiumCore.shortcodes.qi_addons_for_elementor_premium_divided_slider_diverge.qodefDividedSliderDiverge = qodefDividedSliderDiverge;

})( jQuery );

(function ( $ ) {
	'use strict';

	qodefAddonsPremiumCore.shortcodes.qi_addons_for_elementor_premium_fixed_project_slider             = {};
	qodefAddonsPremiumCore.shortcodes.qi_addons_for_elementor_premium_fixed_project_slider.qodefSwiper = qodefAddonsCore.qodefSwiper;

	$( window ).load(
		function () {
			qodefFixedProjectSlider.init();
		}
	);
	$( window ).on(
		'elementor/frontend/init',
		function () {
			if ( elementorFrontend.isEditMode() ) {
				elementor.channels.editor.on(
					'change',
					function ( e ) {
						if ( typeof e.$el === 'object' && e.$el.hasClass( 'elementor-control-slider_left_offset' ) && typeof e.options.element.$el === 'object' ) {
							var $item = e.options.element.$el.find( '.qodef-qi-fixed-project-slider' );

							if ( $item.length ) {
								qodefFixedProjectSlider.reinitMainSwiper( $item.find( '.qodef-m-holder' ) );
							}
						} else if ( typeof e.$el === 'object' && e.$el.hasClass( 'elementor-control-content_width' ) && typeof e.options.element.$el === 'object' ) {
							var $item = e.options.element.$el.find( '.qodef-qi-fixed-project-slider' );

							if ( $item.length ) {
								qodefFixedProjectSlider.reinitMainSwiper( $item.find( '.qodef-m-items-holder' ) );
							}
						}
					}
				);
			}
		}
	);

	var qodefFixedProjectSlider = {
		init: function () {
			this.holder = $( '.qodef-qi-fixed-project-slider' );
			if ( this.holder.length ) {
				this.holder.each(
					function () {
						qodefFixedProjectSlider.initItem( $( this ) );
					}
				);
			}
		},
		initItem: function ( $currentItem ) {
			qodefAddonsCore.qodefSwiperElementorCheck.init( qodefFixedProjectSlider.initSwiperReinit, $currentItem );
		},
		initSwiperReinit: function( $currentItem ){
			var $itemHolder = $currentItem.find( '.qodef-m-items-holder' ),
				$mainSlider = $currentItem.find( '.qodef-m-holder > .qodef-qi-swiper-container' ),
				$itemSlider = $itemHolder.find( '.qodef-qi-swiper-container' ),
				itemSliderOptions,
				numItemsMain,
				autoplay;

			numItemsMain                      = $mainSlider.find( '.swiper-slide' ).length;
			itemSliderOptions                 = $itemSlider[0].swiper.params;
			itemSliderOptions['loopedSlides'] = numItemsMain;//real number of slides should be the same on both sides because of controller
			itemSliderOptions ['autoplay']    = 'false';
			autoplay                          = $mainSlider[0].swiper.autoplay.running;

			$mainSlider[0].swiper.autoplay.stop();
			$itemSlider[0].swiper.destroy(
				true,
				false
			);

			let $itemSwiperNew = new Swiper(
				$itemSlider[0],
				Object.assign( itemSliderOptions )
			);

			if ( autoplay ) {
				$mainSlider[0].swiper.autoplay.start();
			}

			//needs to get recalculate widths
			qodefFixedProjectSlider.recalculate(
				$itemSlider,
				$mainSlider
			);

			$currentItem.addClass( 'qodef--visible' );

			$mainSlider[0].swiper.on(
				'slideChangeTransitionStart',
				function () {
					if ( $itemSwiperNew.realIndex !== $mainSlider[0].swiper.realIndex ) {//transition was triggered by text slider if condition false
						$itemSwiperNew.slideTo( $mainSlider[0].swiper.realIndex );//controller was buggy on loop fix
					}
				}
			);

			$itemSwiperNew.on(
				'slideChangeTransitionStart',
				function () {
					//
					if ( $itemSwiperNew.realIndex !== $mainSlider[0].swiper.realIndex ) {
						if ( $itemSwiperNew.activeIndex > $itemSwiperNew.previousIndex ) {
							$mainSlider[0].swiper.slideNext();
						} else {
							$mainSlider[0].swiper.slidePrev();
						}
					}
				}
			);
		},
		recalculate: function ( $itemSlider, $mainSlider ) {
			$itemSlider[0].swiper.update();
			$mainSlider[0].swiper.update();
		},
		reinitMainSwiper: function ( $currentItem ) {
			var $slider = $currentItem.find( '> .qodef-qi-swiper-container' );

			$slider[0].swiper.update();
		}
	};

	qodefAddonsPremiumCore.shortcodes.qi_addons_for_elementor_premium_fixed_project_slider.qodefFixedProjectSlider = qodefFixedProjectSlider;

})( jQuery );

(function ( $ ) {
	'use strict';

	qodefAddonsCore.shortcodes.qi_addons_for_elementor_premium_flip_box = {};

	$( document ).ready(
		function ()
		{
			qodefFlipBox.init();
		}
	);

	var qodefFlipBox = {
		init: function () {
			var $holder = $( '.qodef-qi-flip-box' );
			if ( $holder.length ) {
				$holder.each(
					function (i) {
						var $thisHolder = $( this );
						
						qodefFlipBox.initItem( $thisHolder );
					}
				);
			}
		},
		initItem: function ($holder) {
			if ($holder.hasClass('qodef-qi-trigger-hover')) {
				$holder.on({
					mouseenter: function () {
						$holder.addClass('qodef-show');
					},
					mouseleave: function () {
						$holder.removeClass('qodef-show');
					}
				});
			}
			
			if ($holder.hasClass('qodef-qi-trigger-click')) {
				$holder.on({
					click: function () {
						$holder.addClass('qodef-show');
					},
					mouseleave: function () {
						$holder.removeClass('qodef-show');
					}
				});
			}
			
			if ($holder.hasClass('qodef-qi-trigger-button')) {
				$holder.find('.qodef-front-trigger-icon').on('click', function () {
					$holder.addClass('qodef-show');
				});
				
				$holder.find('.qodef-back-trigger-icon').on('click', function () {
					$holder.removeClass('qodef-show');
				});
			}
		},
	};

	qodefAddonsCore.shortcodes.qi_addons_for_elementor_premium_flip_box.qodefFlipBox = qodefFlipBox;

})( jQuery );

(function ( $ ) {
	'use strict';

	qodefAddonsPremiumCore.shortcodes.qi_addons_for_elementor_premium_google_map = {};

	$( document ).ready(
		function () {
			qodefGoogleMap.init();
		}
	);

	var qodefGoogleMap = {
		mapHolder: '',
		mapOptions: [],
		mapElement: '',
		map: {},
		markers: {},
		circleMap: {},
		init: function () {
			this.holder = $( '.qodef-qi-google-map' );
			if ( this.holder.length ) {
				this.holder.each(
					function () {
						qodefGoogleMap.initItem( $( this ) );
					}
				);
			}
		},
		initItem: function ( $currentItem ) {
			if ( $currentItem.hasClass( 'qodef--has-key' ) ) {
				qodefGoogleMap.initMap( $currentItem.find( '.qodef-m-map' ) );
			}
		},
		getMapSettings: function () {
			var settings = {
				styles: this.mapOptions.mapStyle,
				mapTypeId: google.maps.MapTypeId.ROADMAP,
				scrollwheel: this.mapOptions.mapScroll,
				draggable: this.mapOptions.mapDrag,
				streetViewControl: this.mapOptions.streetView,
				// zoomControl: qodefMapsVariables.global.zoomControl,
				zoom: parseInt( this.mapOptions.mapZoom, 10 ),
				mapTypeControl: this.mapOptions.mapTypeControl,
				fullscreenControl: this.mapOptions.fullScreenControl,
			};

			return settings;
		},
		getMapOptions: function ( $mapHolder, forwardOptions ) {
			var options = {
				uniqueId: '',
				holderId: '',
				mapHeight: 0,
				mapStyle: '',
				streetView: false,
				mapDrag: false,
				mapScroll: false,
				mapTypeControl: false,
				fullScreenControl: false,
				mapZoom: 0,
				addresses: [],
				addressesLatLng: [],
				pin: '',
				selectorIsID: false,
				multipleTrigger: false,
				geolocation: false,
			};

			options = $.extend( options, forwardOptions );

			if ( options.selectorIsID ) {
				options.uniqueId = $mapHolder[0].id;
				options.holderId = $mapHolder[0].id;
			} else if ( typeof $mapHolder.data( 'unique-id' ) !== 'undefined' && $mapHolder.data( 'unique-id' ) !== false ) {
				options.uniqueId = $mapHolder.data( 'unique-id' );
				options.holderId = 'qodef-map-id--' + $mapHolder.data( 'unique-id' );
			}

			if ( typeof $mapHolder.data( 'height' ) !== 'undefined' && $mapHolder.data( 'height' ) !== false ) {
				options.mapHeight = parseInt( $mapHolder.data( 'height' ), 10 );
			}

			if ( typeof $mapHolder.data( 'zoom' ) !== 'undefined' && $mapHolder.data( 'zoom' ) !== false ) {
				options.mapZoom = parseInt( $mapHolder.data( 'zoom' ), 10 );
			}

			if ( typeof $mapHolder.data( 'style' ) !== 'undefined' && $mapHolder.data( 'style' ) !== false ) {
				options.mapStyle = $mapHolder.data( 'style' );
			}

			if ( typeof $mapHolder.data( 'street-view' ) !== 'undefined' && $mapHolder.data( 'street-view' ) === 'yes' ) {
				options.streetView = true;
			}

			if ( typeof $mapHolder.data( 'map-type' ) !== 'undefined' && $mapHolder.data( 'map-type' ) === 'yes' ) {
				options.mapTypeControl = true;
			}

			if ( typeof $mapHolder.data( 'map-full-screen' ) !== 'undefined' && $mapHolder.data( 'map-full-screen' ) === 'yes' ) {
				options.fullScreenControl = true;
			}

			if ( typeof $mapHolder.data( 'map-drag' ) !== 'undefined' && $mapHolder.data( 'map-drag' ) === 'yes' ) {
				options.mapDrag = true;
			}

			if ( typeof $mapHolder.data( 'map-scroll' ) !== 'undefined' && $mapHolder.data( 'map-scroll' ) === 'yes' ) {
				options.mapScroll = true;
			}

			if ( typeof $mapHolder.data( 'street-view' ) !== 'undefined' && $mapHolder.data( 'street-view' ) === 'yes' ) {
				options.streetView = true;
			}

			if ( typeof $mapHolder.data( 'addresses' ) !== 'undefined' && $mapHolder.data( 'addresses' ) !== false ) {
				options.addresses = $mapHolder.data( 'addresses' );
			}

			if ( typeof $mapHolder.data( 'pin' ) !== 'undefined' && $mapHolder.data( 'pin' ) !== false ) {
				options.pin = $mapHolder.data( 'pin' );
			}

			return options;
		},
		initMap: function ( $mapHolder, options ) {
			this.mapOptions = this.getMapOptions( $mapHolder, options );
			this.mapElement = document.getElementById( this.mapOptions.holderId );
			this.map        = new google.maps.Map( this.mapElement, this.getMapSettings() );

			// Trigger geolocation
			//this.triggerGeolocation();

			// Set map addresses
			this.setAddress();

			// Set map height
			this.setMapHeight();
		},
		triggerGeolocation: function () {

			//If geolocation enabled set map center to user location
			if ( navigator.geolocation && this.mapOptions.geolocation ) {
				this.centerMapToGeolocationAddress();
			}
		},
		setAddress: function () {
			for ( var index = 0; index < this.mapOptions.addresses.length; index++ ) {
				var address = this.mapOptions.addresses[index];

				if ( address === '' ) {
					return;
				}

				if ( this.mapOptions.multipleTrigger ) {
					var addressLocation = address.location;

					if ( typeof addressLocation !== 'undefined' && addressLocation !== null && addressLocation.latitude !== '' && addressLocation.longitude !== '' ) {
						this.mapOptions.addressesLatLng.push( $.extend( addressLocation, address ) );
					}

				} else {
					this.setSingleAddress( address );
				}
			}

			if ( this.mapOptions.multipleTrigger ) {

				// Center map and set borders of map
				this.centerMapMultipleAddresses( this.map, this.mapOptions );

				// Add markers to the map
				this.addMultipleMarkers();
			}
		},
		setSingleAddress: function ( address ) {
			var $infoWindow = new google.maps.InfoWindow(
				{
					content: '<div id="content"><div id="siteNotice"></div><div id="bodyContent"><p>' + address + '</p></div></div>',
				}
			);

			var $geocoder = new google.maps.Geocoder();

			if ( typeof $geocoder === 'object' ) {
				var $map       = this.map,
					mapOptions = this.mapOptions;

				$geocoder.geocode(
					{ 'address': address },
					function ( results, status ) {
						if ( status === google.maps.GeocoderStatus.OK && typeof results === 'object' ) {
							var $marker = new google.maps.Marker(
								{
									map: $map,
									position: results[0].geometry.location,
									icon: mapOptions.pin,
									title: address.store_title,
								}
							);

							google.maps.event.addListener(
								$marker,
								'click',
								function () {
									$infoWindow.open( $map, $marker );
								}
							);

							var addressVariables = {
								address: results[0].formatted_address,
								latitude: results[0].geometry.location.lat(),
								longitude: results[0].geometry.location.lng(),
							};

							mapOptions.addressesLatLng.push( addressVariables );

							// Center map address
							qodefGoogleMap.centerMapAddress( $map, mapOptions, results );
						}
					}
				);
			}
		},
		setMapHeight: function () {
			var mapOptions = this.mapOptions;

			if ( mapOptions.mapHeight > 0 && this.mapElement !== '' ) {
				this.mapElement.style.height = mapOptions.mapHeight + 'px';
			}
		},
		centerMapAddress: function ( $map, mapOptions, results ) {

			// Different logic for single and multiple addresses
			if ( mapOptions.addresses.length === 1 ) {
				$map.setCenter( results[0].geometry.location );
			} else {
				this.centerMapMultipleAddresses( $map, mapOptions );
			}

			// Re-init markers position on resize
			window.addEventListener(
				'resize',
				function () {
					qodefGoogleMap.centerMapAddress(
						$map,
						mapOptions,
						results
					);
				}
			);
		},
		centerMapMultipleAddresses: function ( $map, mapOptions ) {
			var $bounds         = new google.maps.LatLngBounds(),
				addressesLatLng = mapOptions.addressesLatLng;

			if ( mapOptions.multipleTrigger && addressesLatLng.length === 1 ) {
				$map.setCenter(
					{
						lat: parseFloat( addressesLatLng[0].latitude ),
						lng: parseFloat( addressesLatLng[0].longitude ),
					}
				);
			} else if ( typeof $bounds === 'object' && addressesLatLng.length ) {
				for ( var index = 0; index < addressesLatLng.length; index++ ) {
					$bounds.extend(
						{
							lat: parseFloat( addressesLatLng[index].latitude ),
							lng: parseFloat( addressesLatLng[index].longitude ),
						}
					);
				}

				$map.fitBounds( $bounds );
			}
		},
		centerMapToGeolocationAddress: function ( setInputAddressValue, placesInput, geoLocationLinkIcon, listHolder ) {

			// Try HTML5 geolocation.
			if ( navigator.geolocation ) {
				var $map = this.map;

				if ( setInputAddressValue ) {
					geoLocationLinkIcon.addClass( 'fa-spinner fa-spin' );
				}

				navigator.geolocation.getCurrentPosition(
					function ( position ) {
						var lat    = position.coords.latitude,
							lng    = position.coords.longitude,
							latlng = {
								lat: lat,
								lng: lng,
							};

						if ( setInputAddressValue ) {
							var $geocoder           = new google.maps.Geocoder(),
								cityName            = '',
								cityWithCountryName = '';

							$geocoder.geocode(
								{ 'latLng': latlng },
								function ( results, status ) {
									if ( status === google.maps.GeocoderStatus.OK && typeof results === 'object' ) {
										var resultsObject = results;

										for ( var $i = 0; $i <= resultsObject.length; $i++ ) {
											var result = resultsObject[$i];

											if ( typeof result === 'object' && result.types[0] === 'locality' ) {
												var currentAddress = result.address_components;

												cityName = currentAddress[0].long_name;

												for ( var $j = 0; $j <= currentAddress.length; $j++ ) {
													if ( typeof currentAddress[$j] === 'object' && currentAddress[$j].types[0] === 'country' ) {
														cityWithCountryName = cityName + ',' + currentAddress[$j].long_name;
													}
												}
											}
										}

										if ( typeof cityName === 'string' ) {
											geoLocationLinkIcon.removeClass( 'fa-spinner fa-spin' );

											if ( typeof cityWithCountryName === 'string' ) {
												placesInput.val( cityWithCountryName );
											} else {
												placesInput.val( cityName );
											}

											window.qodefGeoLocation.showRangeSlider( latlng, true );
										}
									}
								}
							);
						} else {
							$map.setCenter( latlng );
						}
					}
				);
			}
		},
		centerMapToForwardAddress: function ( addressName ) {

			if ( typeof addressName === 'string' && typeof google === 'object' ) {
				var $map        = this.map,
					mapSettings = this.getMapSettings(),
					$geocoder   = new google.maps.Geocoder();

				$geocoder.geocode(
					{ 'address': addressName },
					function ( results, status ) {
						if ( status === google.maps.GeocoderStatus.OK && typeof results[0] === 'object' ) {
							$map.setZoom( mapSettings.zoom );
							$map.setCenter( results[0].geometry.location );
						}
					}
				);
			}
		},
		addMultipleMarkers: function () {
			var markers         = [],
				addressesLatLng = this.mapOptions.addressesLatLng;

			for ( var i = 0; i < addressesLatLng.length; i++ ) {
				var latLng = {
					lat: parseFloat( addressesLatLng[i].latitude ),
					lng: parseFloat( addressesLatLng[i].longitude )
				};

				//Custom html markers
				//Insert marker data into info window template
				var templateData = {
					title: addressesLatLng[i].title,
					itemId: addressesLatLng[i].itemId,
					address: addressesLatLng[i].address,
					featuredImage: addressesLatLng[i].featuredImage,
					itemUrl: addressesLatLng[i].itemUrl,
					latLng: latLng,
				};

				var $customMarker = new window.qodefCustomMarker(
					{
						position: latLng,
						map: this.map,
						templateData: templateData,
						markerPin: addressesLatLng[i].markerPin,
					}
				);

				markers.push( $customMarker );
			}

			this.markers = markers;

			//Init map clusters ( Grouping map markers at small zoom values )
			this.initMarkerClusters();

			//Init marker info
			this.initMarkerInfo();
		},
		initMarkerClusters: function () {
			var markerOptions = {
				minimumClusterSize: 2,
				maxZoom: 12,
				styles: [{
					width: 50,
					height: 60,
					url: '',
					textSize: 12,
				}],
			};

			new MarkerClusterer(
				this.map,
				this.markers,
				markerOptions
			);
		},
		initMarkerInfo: function () {
			var $map = this.map;

			$( document ).off(
				'click',
				'.qodef-map-marker'
			).on(
				'click',
				'.qodef-map-marker',
				function () {
					var self             = $( this ),
						$markerHolders   = $( '.qodef-map-marker-holder' ),
						$infoWindows     = $( '.qodef-info-window' ),
						$markerHolder    = self.parent( '.qodef-map-marker-holder' ),
						markerlatlngData = $markerHolder.data( 'latlng' ),
						$infoWindow      = self.siblings( '.qodef-info-window' );

					if ( $markerHolder.hasClass( 'qodef-active qodef-map-active' ) ) {
						$markerHolder.removeClass( 'qodef-active qodef-map-active' );
						$infoWindow.fadeOut( 0 );
					} else {
						$markerHolders.removeClass( 'qodef-active qodef-map-active' );
						$infoWindows.fadeOut( 0 );
						$markerHolder.addClass( 'qodef-active qodef-map-active' );
						$infoWindow.fadeIn( 300 );

						if ( markerlatlngData.length && markerlatlngData !== undefined ) {
							var latlngStr = markerlatlngData.replace( '(', '' ).replace( ')', '' ).split( ',', 2 );

							$map.panTo( new google.maps.LatLng( parseFloat( latlngStr[0] ), parseFloat( latlngStr[1] ) ) );
						}
					}
				}
			);
		},
		setGeoLocationRadius: function ( $geoLocation, radius, isActive ) {

			if ( typeof $geoLocation === 'object' && typeof google === 'object' ) {
				var $map     = this.map,
					$markers = this.markers;

				if ( isActive ) {
					this.circleMap.setMap( null );
				}

				this.circleMap = new google.maps.Circle(
					{
						map: $map,
						center: $geoLocation,
						radius: parseInt( radius, 10 ) * 1000, // 1000 change meters to kilometers
						strokeWeight: 0,
						fillColor: '#fc475f',
						fillOpacity: 0.15,
					}
				);

				var $currentCircle = this.circleMap;

				var itemsInArea = [];
				$.each(
					$markers,
					function ( i, marker ) {
						if ( $currentCircle.getBounds().contains( marker.latlng ) ) {
							itemsInArea.push( marker.templateData.itemId );
						}
					}
				);

				window.qodefGeoLocation.disableItemsOutOfRange( itemsInArea );
			}
		},
		createAutocompletePlaces: function ( placeInputID ) {

			if ( typeof google === 'object' && typeof google.maps.places === 'object' ) {
				var autocompleteConfig = {
					types: ['(cities)']
				};

				var autocomplete = new google.maps.places.Autocomplete( placeInputID, autocompleteConfig );

				autocomplete.addListener(
					'place_changed',
					function () {
						// Enable reset icon in field
						$( placeInputID ).next().show();
						window.qodefGeoLocation.reset();
					}
				);
			}
		},
	};

	qodefAddonsPremiumCore.shortcodes.qi_addons_for_elementor_premium_google_map.qodefGoogleMap = qodefGoogleMap;

})( jQuery );

(function ( $ ) {
	'use strict';

	qodefAddonsPremiumCore.shortcodes.qi_addons_for_elementor_premium_divided_slider_reveal             = {};
	qodefAddonsPremiumCore.shortcodes.qi_addons_for_elementor_premium_divided_slider_reveal.qodefSwiper = qodefAddonsCore.qodefSwiper;

})( jQuery );

(function ( $ ) {
	'use strict';

	qodefAddonsPremiumCore.shortcodes.qi_addons_for_elementor_premium_floating_item_showcase = {};

	$( window ).on(
		'load',
		function () {
			qodefFloatingItemShowcase.init();
		}
	);

	var qodefFloatingItemShowcase = {
		init: function () {
			var $holder = $( '.qodef-qi-floating-item-showcase' );

			if ( $holder.length ) {
				$holder.each(
					function () {
						qodefFloatingItemShowcase.initItem( $( this ) );
					}
				);
			}
		},
		initItem: function ( $thisHolder ) {
			var documentHeight = $thisHolder.closest( 'body' ).height(),
				isInContent    = qodefAddonsCore.windowHeight < documentHeight;

			if ( qodefAddonsCore.windowWidth > 1024 ) {
				if ( isInContent ) {
					qodefFloatingItemShowcase.animateFloatInContent( $thisHolder );
				} else {
					qodefFloatingItemShowcase.animateFloat( $thisHolder );
				}
			} else {
				$thisHolder.find( '.qodef-grid-inner' ).removeClass( 'qodef--masonry-init' );
				qodefAddonsCore.qodefMasonryLayout.createMasonry( $thisHolder );
				qodefFloatingItemShowcase.animateFloatAppear( $thisHolder );
			}

			if ( $thisHolder.hasClass( 'qodef-qi--info_follow' ) ) {
				var parentDataId = $thisHolder.parents( '.elementor-widget' ).data( 'id' ),
					parentClass  = 'qodef-' + parentDataId;

				qodefAddonsPremiumCore.qodefInfoFollow.init(
					$thisHolder,
					parentClass
				);
			}

			if ( $thisHolder.hasClass( 'qodef-qi--cursor-follow-image-enabled' ) && qodefAddonsCore.windowWidth > 1024 ) {
				qodefFloatingItemShowcase.initImageFollow( $thisHolder );
			}
		},
		animateFloat: function ( $holder ) {
			/* logic for scrolling slider - start */
			var $items = $holder.find( 'article' );

			// Init Smooth Scrollbar
			var $Scrollbar = window.Scrollbar;
			$Scrollbar.use( window.OverscrollPlugin );

			var $floatScrollbar = $Scrollbar.init(
				document.querySelector( '.qodef-qi-floating-item-showcase .qodef-masonry-holder' ),
				{
					damping: 0.05,
					continuousScrolling: true,
					delegateTo: document,
					plugins: {
						overscroll: {
							damping: 0.1,
							maxOverscroll: 200
						}
					}
				}
			);

			qodefFloatingItemShowcase.animateFloatAppear( $holder );
		},
		animateFloatInContent: function ( $holder ) {
			qodefAddonsCore.qodefWaitForImages.check(
				$holder,
				function () {
					$holder.wrap( '<div class="qodef-qi-floating-item-showcase-holder"></div>' );

					gsap.registerPlugin( ScrollTrigger );//need to make sure that plugin is registered

					var $lastItem          = $holder.find( 'article:last-of-type' ),
						holderHeight       = Math.ceil( $lastItem.position().top + $lastItem.outerHeight() ),//position().top  is relative to parent top position
						holderNotSticky    = qodefAddonsCore.windowHeight > holderHeight,
						scrollOffsetBottom = 100,//arbitrary value, final bottom position after scroll is finished
						maxScroll          = holderHeight - qodefAddonsCore.windowHeight + scrollOffsetBottom,
						$holderParent      = $holder.closest( '.qodef-qi-floating-item-showcase-holder' ),
						$scrollHolder      = $holder.find( '.qodef-grid-inner ' );

					if ( $holder.length ) {
						$holder.addClass( 'qodef-vertical-scroll-in-content' );
						$holder.closest( '#qodef-page-wrapper' ).css(
							'overflow',
							'visible'
						);
					}

					$holderParent.css(
						{
							'--qodef-vertical-scroll-height': holderHeight,
							'--qodef-max-scroll': maxScroll,
						}
					);

					if ( holderNotSticky ) {
						$holder.css(
							{
								'position': 'static',
							}
						);
					}

					var floatTl = gsap.timeline(
						{
							paused: true,
							scrollTrigger: {
								trigger: $holderParent,
								scrub: 1,
								start: 'top top',//when top of the holder hits top of the viewport
								// markers: true,//only used for development
								end: 'bottom bottom',//when bottom of the holder hits bottom of the viewport
							}
						}
					);

					floatTl
					.to(
						$scrollHolder,
						{
							y: Math.min(//cant be smaller than 0, in case holder height is smaller than window height
								0,
								-maxScroll
							),
						}
					);

					qodefFloatingItemShowcase.animateFloatAppear( $holder );
				}
			);


		},
		animateFloatAppear: function ( $thisHolder ) {
			var $elements = $thisHolder.find( '.qodef-e' );

			function getRandomArbitrary( min, max ) {
				return Math.floor( Math.random() * (max - min) + min );
			}

			$thisHolder.addClass( 'qodef--appear' );

			if ( $elements.length ) {
				$elements.each(
					function () {
						var $element  = $( this ),
							randomNum = getRandomArbitrary(
								10,
								500
							);

						qodefAddonsCore.qodefIsInViewport.check(
							$element,
							function () {
								if ( ! $element.hasClass( 'qodef--appear' ) ) {
									setTimeout(
										function () {
											$element.addClass( 'qodef--appear' );
										},
										randomNum
									);
								}
							}
						);
					}
				);
			}
		},
		initImageFollow: function ( $holder ) {
			var $followImage = $holder.find( '.qodef-m-cursor-follow-image-holder' );

			var transformCursor = function ( x, y ) {

				if ( $followImage.hasClass( 'qodef--is-active' ) ) {
					gsap.to(
						$followImage,
						{
							x: x,
							y: y,
							duration: .7,
						}
					);
				}
			};

			var handleMove = function ( e ) {
				var x = e.clientX - $followImage.width() / 2,
					y = e.clientY - $followImage.height() / 2;

				requestAnimationFrame(
					function () {
						transformCursor(
							x,
							y
						);
					}
				);
			};

			$holder.on(
				'mousemove',
				handleMove
			);

			//show/hide info element
			$holder.on(
				'mouseenter',
				function () {
					if ( ! $followImage.hasClass( 'qodef--is-active' ) ) {
						$followImage.addClass( 'qodef--is-active' );
					}
				}
			).on(
				'mouseleave',
				function () {
					if ( $followImage.hasClass( 'qodef--is-active' ) ) {
						$followImage.removeClass( 'qodef--is-active' );
					}
				}
			);
		},
	};

	qodefAddonsPremiumCore.shortcodes.qi_addons_for_elementor_premium_floating_item_showcase.qodefFloatingItemShowcase = qodefFloatingItemShowcase;

})( jQuery );

(function ( $ ) {
	'use strict';

	qodefAddonsPremiumCore.shortcodes.qi_addons_for_elementor_premium_horizontal_double_row_project_showcase = {};

	$( document ).on(
		'ready',
		function () {
			qodefHorizontalDoubleRowProjectShowcase.init();
		}
	);

	$( window ).resize(
		function () {
			qodefHorizontalDoubleRowProjectShowcase.init();
		}
	);

	var qodefHorizontalDoubleRowProjectShowcase = {
		init: function () {
			var $holder = $( '.qodef-qi-horizontal-double-row-project-showcase' );

			if ( $holder.length ) {
				$holder.each(
					function () {
						qodefHorizontalDoubleRowProjectShowcase.initItem( $( this ) );
					}
				);
			}
		},
		initItem: function ( $thisHolder ) {
			var documentHeight = $thisHolder.closest( 'body' ).height(),
				isInContent    = qodefAddonsCore.windowHeight < documentHeight;

			if ( qodefAddonsCore.windowWidth > 1024 ) {
				if ( isInContent ) {
					qodefHorizontalDoubleRowProjectShowcase.animateSliderInContent( $thisHolder );
				} else {
					qodefHorizontalDoubleRowProjectShowcase.animateSlider( $thisHolder );
				}
			} else {
				qodefHorizontalDoubleRowProjectShowcase.animateAppear( $thisHolder );
			}
		},
		animateSlider: function ( $thisHolder ) {
			var $Scrollbar = window.Scrollbar;

			//custom horizontalscroll plugin
			class HorizontalScrollPlugin extends Scrollbar.ScrollbarPlugin {
				transformDelta( delta, fromEvent ) {
					if ( ! /wheel/.test( fromEvent.type ) ) {
						return delta;
					}

					const { x, y } = delta;

					return {
						y: 0,
						x: Math.abs( x ) > Math.abs( y ) ? x : y
					};
				}
			}

			function _defineProperty( obj, key, value ) {
				if ( key in obj ) {
					Object.defineProperty(
						obj,
						key,
						{ value: value, enumerable: true, configurable: true, writable: true }
					);
				} else {
					obj[key] = value;
				}
				return obj;
			}

			_defineProperty(
				HorizontalScrollPlugin,
				'pluginName',
				'horizontalScroll'
			);

			//initialize scrolling
			$Scrollbar.use( HorizontalScrollPlugin );
			$Scrollbar.use( window.OverscrollPlugin );

			var scrollOptions = {
				damping: 0.1,
				continuousScrolling: false,
				delegateTo: document,
				plugins: {
					overscroll: {
						damping: 0.1,
						maxOverscroll: 150
					}
				}
			};

			var $scrollBarHolder = $thisHolder.find( '.qodef-items-holder' )[0];

			var $horizontalScrollbar = $Scrollbar.init(
				$scrollBarHolder,
				scrollOptions
			);

			/* logic for show items on load/scroll - start */
			var $items       = $thisHolder.find( '.qodef-e:not( .qodef-e-featured )' ),
				$fetured     = $thisHolder.find( '.qodef-e-featured' ),
				feturedWidth = $fetured.length > 0 ? $fetured.width() : 0;

			$fetured.addClass( 'qodef--appear' );

			//set data offset to items, so we could know when to show them
			$items.each(
				function ( i ) {
					var $thisOffsetLeft = $( this ).offset().left;
					$( this ).attr(
						'data-offset-left',
						$thisOffsetLeft
					);
					$( this ).data(
						'offset-left',
						$thisOffsetLeft
					);
				}
			);

			//if some items are in viewport on load, than show them
			$items.each(
				function ( i ) {
					var thisItem = $( this );
					if ( $thisHolder.width() + feturedWidth > $( this ).data( 'offset-left' ) ) {
						setTimeout(
							function () {
								thisItem.addClass( 'qodef--appear' );
							},
							(i + 1) * 200
						);
					}
				}
			);
			//check items on scroll and show them when they are in viewport
			$horizontalScrollbar.addListener(
				function () {
					var scrollbarOffset = this.offset.x;
					$items.each(
						function () {
							if ( ! $( this ).hasClass( 'qodef--appear' ) ) {
								if ( $thisHolder.width() + scrollbarOffset + feturedWidth - 100 > $( this ).data( 'offset-left' ) ) {//100 is scroll delay
									$( this ).addClass( 'qodef--appear qodef--appear-delay' );
								}
							}
						}
					);
				}
			);
			/* logic for show items on load/scroll - end */
		},
		animateSliderInContent: function ( $thisHolder ) {
			$thisHolder.addClass( 'qodef-horizontal-scroll-in-content' );

			var $scrollHolder = $thisHolder.find( '.qodef-items-holder' );

			/* logic for show items on load/scroll - start */
			var $items       = $thisHolder.find( '.qodef-e:not(.qodef-e-featured)' ),
				$fetured     = $thisHolder.find( '.qodef-e-featured' ),
				feturedWidth = $fetured.length > 0 ? $fetured.width() : 0;

			$scrollHolder.find( '.qodef-scroll-content' ).contents().unwrap();
			$scrollHolder.wrapInner( '<div class="qodef-scroll-content"></div>' );

			$fetured.addClass( 'qodef--appear' );

			//set data offset to items, so we could know when to show them
			$items.each(
				function ( i ) {
					var $thisOffsetLeft = $( this ).offset().left;
					$( this ).attr(
						'data-offset-left',
						$thisOffsetLeft
					);
					$( this ).data(
						'offset-left',
						$thisOffsetLeft
					);
				}
			);

			//if some items are in viewport on load, than show them
			$items.each(
				function ( i ) {
					var thisItem = $( this );
					if ( $thisHolder.width() + feturedWidth > $( this ).data( 'offset-left' ) ) {
						setTimeout(
							function () {
								thisItem.addClass( 'qodef--appear' );
							},
							(i + 1) * 200
						);
					}
				}
			);
			/* logic for show items on load/scroll - end */

			//Horizontal scrolling
			var horizontalClass       = 'qodef-scroll-horizontal';
			var horizontalActiveClass = horizontalClass + '--active';
			var horizontalEndedClass  = horizontalClass + '--ended';

			function setUpHorizontalScroll( $element ) {
				var elementWidth      = $element.find( '.qodef-scroll-content' ).outerWidth();
				var elementOffsetLeft = $element.offset().left;
				var rightMax          = elementOffsetLeft + elementWidth - qodefAddonsCore.windowWidth;
				var rightMaxMinus     = -(rightMax);

				$element.css(
					{
						'--qodef-horizontal-scroll-width': elementWidth, // Set height of section to the scroll width of content wrapper
						'--qodef-horizontal-scroll-offset': elementOffsetLeft,
						'--qodef-right-max': rightMax,
					}
				);

				// Set initialized data variable to false do incidate scrolling functionality doesn't work yet.
				$element.data(
					'initalized',
					false
				);

				// Set right max variables & data attributes.
				$element.data(
					'rightMax',
					Number( rightMaxMinus )
				);

				// Set data attribute for outerHeight.
				$element.data(
					'scrollWidth',
					elementWidth
				);

				// Set data attribute for outerHeight.
				$element.data(
					'outerHeight',
					$element.outerHeight()
				);

				// Set data attribute for offset top.
				$element.data(
					'offsetTop',
					$element.offset().top
				);

				// Set data initialized data variable to true to indicate ready for functionality.
				$element.data(
					'initalized',
					true
				);
				//
				// // Set data variable for transform X (0 by default)
				$element.data(
					'transformX',
					'0'
				);
			}

			function setActiveClasses( $element ) {
				// Get bounding values from section.
				var bounding = $element[0].getBoundingClientRect(),
					$scrollContent = $element.find( '.qodef-scroll-content' );

				if ( bounding.top > qodefAddonsCore.windowHeight ) {
					// Section is below the viewport.
					// Section has not ended or started, therefore remove classes.
					$scrollContent.removeClass( horizontalActiveClass );
					$scrollContent.removeClass( horizontalEndedClass );

				} else if ( bounding.bottom < 0 ) {

					// Section is above the viewport.
					// Section has ended, therefore remove classes.
					$scrollContent.addClass( horizontalEndedClass );
					$scrollContent.removeClass( horizontalActiveClass );

				} else {

					// We're now inside the section, not below or above.
					// If top of section is at top of viewport, add class active.
					if ( bounding.top <= 0 ) {
						$scrollContent.addClass( horizontalActiveClass );
					}

					// If top of section is below top of viewport, remove class active.
					if ( bounding.top > 0 ) {
						$scrollContent.removeClass( horizontalActiveClass );
					}

					// If bottom of section is at bottom of viewport, add class ended.
					if ( bounding.bottom <= qodefAddonsCore.windowHeight ) {
						$scrollContent.addClass( horizontalEndedClass );
					}

					// If bottom of section is not at bottom of viewport, remove class ended.
					if ( bounding.bottom > qodefAddonsCore.windowHeight ) {
						$scrollContent.removeClass( horizontalEndedClass );
					}
				}
			}

			function transformHorizontalBasedOnScroll( $element ) {
				// Get amount scrolled variables.
				var amountScrolledContainer = qodefAddonsCore.scroll - $element.data( 'offsetTop' ),
					amountScrolledThrough   = (amountScrolledContainer / ($element.data( 'outerHeight' ) - (qodefAddonsCore.windowHeight - qodefAddonsCore.windowWidth))),
					speed                   = 1.1;

				// Add transform value variable based on amount scrolled through multiplied by scroll width of content.
				var toTransform = amountScrolledThrough * $element.data( 'scrollWidth' ) * speed;

				// Add transform value for minus (as we're transforming opposite direction).
				var toTransformMinus = -(toTransform);

				// If transform value is bigger or equal than 0, set value to 0.
				toTransformMinus = Math.min(
					0,
					toTransformMinus
				);

				// If transform value is smaller or equal than rightMax, set value to rightMax.
				toTransformMinus = Math.max(
					toTransformMinus,
					$element.data( 'rightMax' )
				);

				// Update transformX data variable for section.
				$element.data(
					'transformX',
					Number( toTransformMinus )
				);

				// If section has been initalized, apply transform.
				if ( $element.data( 'initalized' ) === true ) {
					var $scrollContent = $thisHolder.find( '.qodef-scroll-content' );

					gsap.to(
						$scrollContent,
						{
							x: $element.data( 'transformX' ),
							overwrite: true,
							// duration: 0.4,
							// ease: 'power3.out',
						}
					);

					//add appear class on items
					var hiddenItems = $thisHolder.find( '.qodef-e:not( .qodef-e-featured ):not( .qodef--appear )' );

					hiddenItems.each(
						function () {
							if ( ! $( this ).hasClass( 'qodef--appear' ) ) {
								if ( $thisHolder.width() + Math.abs( toTransformMinus ) + feturedWidth + 100 > $( this ).data( 'offset-left' ) ) {
									$( this ).addClass( 'qodef--appear' );
								}
							}
						}
					);
				}
			}

			// Set up horizontal scrolling data attributes and show section all have been computed.
			setUpHorizontalScroll( $thisHolder );

			// Now we're ready, call setScene on load that adds classes based on scroll position.
			setActiveClasses( $thisHolder );

			$( window ).on(
				'scroll',
				function () {
					transformHorizontalBasedOnScroll( $thisHolder );
					setActiveClasses( $thisHolder );
				}
			);

			// $( window ).resize(
			// 	function () {
			// 		// location.reload();
			// 		setUpHorizontalScroll( $thisHolder );
			// 		setActiveClasses( $thisHolder );
			// 	}
			// );
		},
		animateAppear: function ( $thisHolder ) {
			var $elements = $thisHolder.find( '.qodef-e' );

			$thisHolder.find( '.qodef-items-holder > .qodef-scroll-content' ).contents().unwrap();
			if ( $elements.length ) {
				$elements.each(
					function () {
						var $element = $( this );
						qodefAddonsCore.qodefIsInViewport.check(
							$element,
							function () {
								if ( ! $element.hasClass( 'qodef--appear' ) ) {
									$element.addClass( 'qodef--appear' );
								}
							}
						);
					}
				);
			}
		},
	};

	qodefAddonsPremiumCore.shortcodes.qi_addons_for_elementor_premium_horizontal_double_row_project_showcase.qodefHorizontalDoubleRowProjectShowcase = qodefHorizontalDoubleRowProjectShowcase;

})( jQuery );

(function ( $ ) {
	'use strict';

	qodefAddonsPremiumCore.shortcodes.qi_addons_for_elementor_premium_hover_aware_slider = {};

	$( document ).ready(
		function () {
			qodefHoverAwareSlider.init();
		}
	);

	var qodefHoverAwareSlider = {
		init: function () {
			this.holder = $( '.qodef-qi-hover-aware-slider' );
			if ( this.holder.length ) {
				this.holder.each(
					function () {
						qodefHoverAwareSlider.initItem( $( this ) );
					}
				);
			}
		},
		initItem: function ( $currentItem ) {
			var $innerItems = $currentItem.find( '.qodef-e-item .qodef-e-link' );

			if ( $innerItems.length ) {
				$innerItems.first().parent().addClass( 'qodef--active' );

				$innerItems.each(
					function () {
						var $this = $( this );

						$this.on(
							'touch mouseover',
							function () {
								$this.parents( '.qodef-m-items' ).find( '.qodef-e-item.qodef--prev' ).removeClass( 'qodef--prev' );
								$this.parents( '.qodef-m-items' ).find( '.qodef-e-item.qodef--active' ).removeClass( 'qodef--active' ).addClass( 'qodef--prev' );
								$this.parent().removeClass( 'qodef--prev' ).addClass( 'qodef--active' );
							}
						);
					}
				);
			}
		}
	};

	qodefAddonsPremiumCore.shortcodes.qi_addons_for_elementor_premium_hover_aware_slider.qodefHoverAwareSlider = qodefHoverAwareSlider;

})( jQuery );

(function ( $ ) {
	'use strict';

	$( document ).ready(
		function () {
			qodefImageGalleryAdditionalEffects.init();
		}
	);

	var qodefImageGalleryAdditionalEffects = {
		init: function () {
			var $holder = $( '.qodef-qi-image-gallery' );

			if ( $holder.length ) {
				$holder.each(
					function ( index ) {
						qodefImageGalleryAdditionalEffects.initItem(
							$( this ),
							index
						);
					}
				);
			}
		},
		initItem: function ( $thisHolder, index ) {
			if ( $thisHolder.hasClass( 'qodef-image--hover-distort' ) && qodefAddonsCore.windowWidth > 1024 ) {
				qodefImageGalleryAdditionalEffects.initImageDistort(
					$thisHolder,
					index
				);
			} else if ( $thisHolder.hasClass( 'qodef-image--hover-gradient' ) && qodefAddonsCore.windowWidth > 1024 ) {
				qodefImageGalleryAdditionalEffects.initGradient( $thisHolder );
			}
		},
		initImageDistort: function ( $holder, index ) {
			var $items = $holder.find( '.qodef-e' );

			if ( $items.length ) {
				$items.each(
					function ( itemIndex ) {
						var $item             = $( this ),
							$itemImage        = $item.find( '.qodef-e-inner img' ),
							$filterId         = 'qodef-image-gallery-svg-distort-' + index + '-' + itemIndex,
							$distortFilterSvg = '<svg class="qodef-svg-distort-filter" width="100%" height="100%">' +
								'<filter id=' + $filterId + ' x="-25%" y="-25%" width="150%" height="150%">' +
								'<feTurbulence type="fractalNoise" baseFrequency="0.02 0.01" numOctaves="2" seed="2" result="warp" result="warp" />' +
								'<feDisplacementMap xChannelSelector="R" yChannelSelector="G" scale="0" in="SourceGraphic" in2="warp" />' +
								'</filter></svg>';

						$itemImage.clone().addClass( 'qodef--distort-img-clone' ).insertAfter( $itemImage );
						$itemImage.after( $distortFilterSvg );

						var $itemCloneImage       = $item.find( '.qodef--distort-img-clone' ),
							$svg                  = $item.find( '.qodef-svg-distort-filter' ),
							$filter               = $svg.find( 'filter' ),
							$displacementMap      = $filter.find( 'feDisplacementMap' )[0],
							$displacementMapScale = { val: 0 };

						var $distortTl = gsap.timeline(
							{
								paused: true,
								defaults: {
									duration: 0.8,
									ease: 'power1.inOut',
								},
								onStart: () => {
									gsap.set(
										$itemCloneImage,
										{
											filter: 'url(#' + $filterId + ')',
										}
									);
								},
								onReverseComplete: () => {
									gsap.set(
										$itemCloneImage,
										{
											filter: 'none',
										}
									);
								},
								onUpdate: () => {
									$displacementMap.setAttribute(
										'scale',
										$displacementMapScale.val
									);
								}
							}
						);

						$distortTl.to(
							$displacementMapScale,
							{
								startAt: {
									val: 0
								},
								val: 100,
							},
							0
						);

						$item[0].addEventListener(
							'mouseenter',
							function () {
								$distortTl.restart();
							}
						);
						$item[0].addEventListener(
							'mouseleave',
							function () {
								$distortTl.reverse();
							}
						);
					}
				);
			}
		},
		initGradient: function ( $holder ) {
			var $items = $holder.find( '.qodef-e' );

			if ( $items.length ) {
				$items.each(
					function () {
						var $item          = $( this ),
							$imageGradient =
								'<span class="qodef-e-gradient-holder">' +
								'<span class="qodef-e-gradient">' +
								'<span class="qodef-e-gradient-dot-1"></span>' +
								'<span class="qodef-e-gradient-dot-2"></span></span></span>';

						$item.find( '.qodef-e-inner' ).append( $imageGradient );
					}
				);
			}
		}
	};

	qodefAddonsCore.shortcodes.qi_addons_for_elementor_image_gallery.qodefImageGalleryAdditionalEffects = qodefImageGalleryAdditionalEffects;

})( jQuery );

(function ( $ ) {
	'use strict';

	qodefAddonsCore.shortcodes.qi_addons_for_elementor_premium_icon_progress_bar = {};

	$( document ).ready(
		function ()
		{
			qodefIconProgressBar.init();
		}
	);

	var qodefIconProgressBar = {
		init: function () {
			var $holder = $( '.qodef-qi-icon-progress-bar' );
			if ( $holder.length ) {
				$holder.each(
					function (i) {
						var $thisHolder = $( this );
						
						qodefIconProgressBar.initItem( $thisHolder );
					}
				);
			}
		},
		initItem: function ($holder) {
			var $icons = $holder.find( '.qodef-icon-holder' ),
				activeIconsNumber = $holder.data( 'active' ),
				animationDelay = $holder.data( 'icon-animation-delay' );
			
			qodefAddonsCore.qodefIsInViewport.check(
				$holder,
				function () {
					$icons.each(function (i) {
						if(i < activeIconsNumber) {
							var $icon = $(this);
							setTimeout(function () {
								$icon.addClass( 'qodef-active' );
							}, i * animationDelay); // delay 100 ms
						}
					});
				}
			);
			
		},
	};

	qodefAddonsCore.shortcodes.qi_addons_for_elementor_premium_icon_progress_bar.qodefIconProgressBar = qodefIconProgressBar;

})( jQuery );

(function ( $ ) {
	'use strict';

	$( document ).ready(
		function () {
			qodefImageGalleryMasonryAdditionalEffects.init();
		}
	);

	var qodefImageGalleryMasonryAdditionalEffects = {
		init: function () {
			var $holder = $( '.qodef-qi-image-gallery-masonry' );

			if ( $holder.length ) {
				$holder.each(
					function ( index ) {
						qodefImageGalleryMasonryAdditionalEffects.initItem(
							$( this ),
							index
						);
					}
				);
			}
		},
		initItem: function ( $thisHolder, index ) {
			if ( $thisHolder.hasClass( 'qodef-image--hover-distort' ) && qodefAddonsCore.windowWidth > 1024 ) {
				qodefImageGalleryMasonryAdditionalEffects.initImageDistort(
					$thisHolder,
					index
				);
			} else if ( $thisHolder.hasClass( 'qodef-image--hover-gradient' ) && qodefAddonsCore.windowWidth > 1024 ) {
				qodefImageGalleryMasonryAdditionalEffects.initGradient( $thisHolder );
			}
		},
		initImageDistort: function ( $holder, index ) {
			var $items = $holder.find( '.qodef-e' );

			if ( $items.length ) {
				$items.each(
					function ( itemIndex ) {
						var $item             = $( this ),
							$itemImage        = $item.find( '.qodef-e-inner img' ),
							$filterId         = 'qodef-image-gallery-masonry-svg-distort-' + index + '-' + itemIndex,
							$distortFilterSvg = '<svg class="qodef-svg-distort-filter" width="100%" height="100%">' +
								'<filter id=' + $filterId + ' x="-25%" y="-25%" width="150%" height="150%">' +
								'<feTurbulence type="fractalNoise" baseFrequency="0.02 0.01" numOctaves="2" seed="2" result="warp" result="warp" />' +
								'<feDisplacementMap xChannelSelector="R" yChannelSelector="G" scale="0" in="SourceGraphic" in2="warp" />' +
								'</filter></svg>';

						$itemImage.clone().addClass( 'qodef--distort-img-clone' ).insertAfter( $itemImage );
						$itemImage.after( $distortFilterSvg );

						var $itemCloneImage       = $item.find( '.qodef--distort-img-clone' ),
							$svg                  = $item.find( '.qodef-svg-distort-filter' ),
							$filter               = $svg.find( 'filter' ),
							$displacementMap      = $filter.find( 'feDisplacementMap' )[0],
							$displacementMapScale = { val: 0 };

						var $distortTl = gsap.timeline(
							{
								paused: true,
								defaults: {
									duration: 0.8,
									ease: 'power1.inOut',
								},
								onStart: () => {
									gsap.set(
										$itemCloneImage,
										{
											filter: 'url(#' + $filterId + ')',
										}
									);
								},
								onReverseComplete: () => {
									gsap.set(
										$itemCloneImage,
										{
											filter: 'none',
										}
									);
								},
								onUpdate: () => {
									$displacementMap.setAttribute(
										'scale',
										$displacementMapScale.val
									);
								}
							}
						);

						$distortTl.to(
							$displacementMapScale,
							{
								startAt: {
									val: 0
								},
								val: 100,
							},
							0
						);

						$item[0].addEventListener(
							'mouseenter',
							function () {
								$distortTl.restart();
							}
						);
						$item[0].addEventListener(
							'mouseleave',
							function () {
								$distortTl.reverse();
							}
						);
					}
				);
			}
		},
		initGradient: function ( $holder ) {
			var $items = $holder.find( '.qodef-e' );

			if ( $items.length ) {
				$items.each(
					function () {
						var $item          = $( this ),
							$imageGradient =
								'<span class="qodef-e-gradient-holder">' +
								'<span class="qodef-e-gradient">' +
								'<span class="qodef-e-gradient-dot-1"></span>' +
								'<span class="qodef-e-gradient-dot-2"></span></span></span>';

						$item.find( '.qodef-e-inner' ).append( $imageGradient );
					}
				);
			}
		}
	};

	qodefAddonsCore.shortcodes.qi_addons_for_elementor_image_gallery_masonry.qodefImageGalleryMasonryAdditionalEffects = qodefImageGalleryMasonryAdditionalEffects;

})( jQuery );

(function ( $ ) {
	'use strict';

	$( document ).ready(
		function () {
			qodefImageGalleryPinterestAdditionalEffects.init();
		}
	);

	var qodefImageGalleryPinterestAdditionalEffects = {
		init: function () {
			var $holder = $( '.qodef-qi-image-gallery-pinterest' );

			if ( $holder.length ) {
				$holder.each(
					function ( index ) {
						qodefImageGalleryPinterestAdditionalEffects.initItem(
							$( this ),
							index
						);
					}
				);
			}
		},
		initItem: function ( $thisHolder, index ) {
			if ( $thisHolder.hasClass( 'qodef-image--hover-distort' ) && qodefAddonsCore.windowWidth > 1024 ) {
				qodefImageGalleryPinterestAdditionalEffects.initImageDistort(
					$thisHolder,
					index
				);
			} else if ( $thisHolder.hasClass( 'qodef-image--hover-gradient' ) && qodefAddonsCore.windowWidth > 1024 ) {
				qodefImageGalleryPinterestAdditionalEffects.initGradient( $thisHolder );
			}
		},
		initImageDistort: function ( $holder, index ) {
			var $items = $holder.find( '.qodef-e' );

			if ( $items.length ) {
				$items.each(
					function ( itemIndex ) {
						var $item             = $( this ),
							$itemImage        = $item.find( '.qodef-e-inner img' ),
							$filterId         = 'qodef-image-gallery-pinterest-svg-distort-' + index + '-' + itemIndex,
							$distortFilterSvg = '<svg class="qodef-svg-distort-filter" width="100%" height="100%">' +
								'<filter id=' + $filterId + ' x="-25%" y="-25%" width="150%" height="150%">' +
								'<feTurbulence type="fractalNoise" baseFrequency="0.02 0.01" numOctaves="2" seed="2" result="warp" result="warp" />' +
								'<feDisplacementMap xChannelSelector="R" yChannelSelector="G" scale="0" in="SourceGraphic" in2="warp" />' +
								'</filter></svg>';

						$itemImage.clone().addClass( 'qodef--distort-img-clone' ).insertAfter( $itemImage );
						$itemImage.after( $distortFilterSvg );

						var $itemCloneImage       = $item.find( '.qodef--distort-img-clone' ),
							$svg                  = $item.find( '.qodef-svg-distort-filter' ),
							$filter               = $svg.find( 'filter' ),
							$displacementMap      = $filter.find( 'feDisplacementMap' )[0],
							$displacementMapScale = { val: 0 };

						var $distortTl = gsap.timeline(
							{
								paused: true,
								defaults: {
									duration: 0.8,
									ease: 'power1.inOut',
								},
								onStart: () => {
									gsap.set(
										$itemCloneImage,
										{
											filter: 'url(#' + $filterId + ')',
										}
									);
								},
								onReverseComplete: () => {
									gsap.set(
										$itemCloneImage,
										{
											filter: 'none',
										}
									);
								},
								onUpdate: () => {
									$displacementMap.setAttribute(
										'scale',
										$displacementMapScale.val
									);
								}
							}
						);

						$distortTl.to(
							$displacementMapScale,
							{
								startAt: {
									val: 0
								},
								val: 100,
							},
							0
						);

						$item[0].addEventListener(
							'mouseenter',
							function () {
								$distortTl.restart();
							}
						);
						$item[0].addEventListener(
							'mouseleave',
							function () {
								$distortTl.reverse();
							}
						);
					}
				);
			}
		},
		initGradient: function ( $holder ) {
			var $items = $holder.find( '.qodef-e' );

			if ( $items.length ) {
				$items.each(
					function () {
						var $item          = $( this ),
							$imageGradient =
								'<span class="qodef-e-gradient-holder">' +
								'<span class="qodef-e-gradient">' +
								'<span class="qodef-e-gradient-dot-1"></span>' +
								'<span class="qodef-e-gradient-dot-2"></span></span></span>';

						$item.find( '.qodef-e-inner' ).append( $imageGradient );
					}
				);
			}
		}
	};

	qodefAddonsCore.shortcodes.qi_addons_for_elementor_image_gallery_pinterest.qodefImageGalleryPinterestAdditionalEffects = qodefImageGalleryPinterestAdditionalEffects;

})( jQuery );

(function ( $ ) {
	'use strict';

	$( document ).ready(
		function () {
			qodefImageSliderAdditionalEffects.init();
		}
	);

	var qodefImageSliderAdditionalEffects = {
		init: function () {
			var $holder = $( '.qodef-qi-image-slider' );

			if ( $holder.length ) {
				$holder.each(
					function ( index ) {
						qodefImageSliderAdditionalEffects.initItem(
							$( this ),
							index
						);
					}
				);
			}
		},
		initItem: function ( $thisHolder, index ) {
			if ( $thisHolder.hasClass( 'qodef-image--hover-distort' ) && qodefAddonsCore.windowWidth > 1024 ) {
				qodefImageSliderAdditionalEffects.initImageDistort(
					$thisHolder,
					index
				);
			} else if ( $thisHolder.hasClass( 'qodef-image--hover-gradient' ) && qodefAddonsCore.windowWidth > 1024 ) {
				qodefImageSliderAdditionalEffects.initGradient( $thisHolder );
			}
		},
		initImageDistort: function ( $holder, index ) {
			var $items = $holder.find( '.qodef-e' );

			if ( $items.length ) {
				$items.each(
					function ( itemIndex ) {
						var $item             = $( this ),
							$itemImage        = $item.find( '.qodef-e-inner img' ),
							$filterId         = 'qodef-image-slider-svg-distort-' + index + '-' + itemIndex,
							$distortFilterSvg = '<svg class="qodef-svg-distort-filter" width="100%" height="100%">' +
								'<filter id=' + $filterId + ' x="-25%" y="-25%" width="150%" height="150%">' +
								'<feTurbulence type="fractalNoise" baseFrequency="0.02 0.01" numOctaves="2" seed="2" result="warp" result="warp" />' +
								'<feDisplacementMap xChannelSelector="R" yChannelSelector="G" scale="0" in="SourceGraphic" in2="warp" />' +
								'</filter></svg>';

						$itemImage.clone().addClass( 'qodef--distort-img-clone' ).insertAfter( $itemImage );
						$itemImage.after( $distortFilterSvg );

						var $itemCloneImage       = $item.find( '.qodef--distort-img-clone' ),
							$svg                  = $item.find( '.qodef-svg-distort-filter' ),
							$filter               = $svg.find( 'filter' ),
							$displacementMap      = $filter.find( 'feDisplacementMap' )[0],
							$displacementMapScale = { val: 0 };

						var $distortTl = gsap.timeline(
							{
								paused: true,
								defaults: {
									duration: 0.8,
									ease: 'power1.inOut',
								},
								onStart: () => {
									gsap.set(
										$itemCloneImage,
										{
											filter: 'url(#' + $filterId + ')',
										}
									);
								},
								onReverseComplete: () => {
									gsap.set(
										$itemCloneImage,
										{
											filter: 'none',
										}
									);
								},
								onUpdate: () => {
									$displacementMap.setAttribute(
										'scale',
										$displacementMapScale.val
									);
								}
							}
						);

						$distortTl.to(
							$displacementMapScale,
							{
								startAt: {
									val: 0
								},
								val: 100,
							},
							0
						);

						$item[0].addEventListener(
							'mouseenter',
							function () {
								$distortTl.restart();
							}
						);
						$item[0].addEventListener(
							'mouseleave',
							function () {
								$distortTl.reverse();
							}
						);
					}
				);
			}
		},
		initGradient: function ( $holder ) {
			var $items = $holder.find( '.qodef-e' );

			if ( $items.length ) {
				$items.each(
					function () {
						var $item          = $( this ),
							$imageGradient =
								'<span class="qodef-e-gradient-holder">' +
								'<span class="qodef-e-gradient">' +
								'<span class="qodef-e-gradient-dot-1"></span>' +
								'<span class="qodef-e-gradient-dot-2"></span></span></span>';

						$item.find( '.qodef-e-inner' ).append( $imageGradient );
					}
				);
			}
		}
	};

	qodefAddonsCore.shortcodes.qi_addons_for_elementor_image_slider.qodefImageSliderAdditionalEffects = qodefImageSliderAdditionalEffects;

})( jQuery );

(function ( $ ) {
	'use strict';
	qodefAddonsPremiumCore.shortcodes.qi_addons_for_elementor_premium_interactive_info_images = {};

	$( document ).ready(
		function () {
			qodefInteractiveInfoImages.init();
		}
	);

	var qodefInteractiveInfoImages = {
		init: function () {
			var $holder = $( '.qodef-qi-interactive-info-images' );

			if ( $holder.length ) {
				$holder.each(
					function () {
						var $thisHolder = $( this );

						qodefInteractiveInfoImages.initItem( $thisHolder );
					}
				);
			}
		},
		initItem: function ( $holder ) {
			var $items      = $holder.find( '.qodef-m-items' ),
				$item       = $items.find( '.qodef-m-item' );


			$item.each(
				function () {
					var $thisItem = $( this );

					$thisItem.on(
						'touch mouseover',
						function () {
							$item.removeClass( 'qodef-active' );
							$thisItem.addClass( 'qodef-active' );
						}
					);
				}
			);

		}
	};

	qodefAddonsPremiumCore.shortcodes.qi_addons_for_elementor_premium_interactive_info_images.qodefCircledSlider = qodefInteractiveInfoImages;

})( jQuery );

(function ( $ ) {
	'use strict';

	qodefAddonsPremiumCore.shortcodes.qi_addons_for_elementor_premium_interactive_project_carousel = {};

	$( document ).ready(
		function () {
			qodefInteractiveProjectCarousel.init();
		}
	);

	var qodefInteractiveProjectCarousel = {
		init: function () {
			var $holder = $( '.qodef-qi-interactive-project-carousel' );

			if ( $holder.length ) {
				$holder.each(
					function () {
						qodefInteractiveProjectCarousel.initItem( $( this ) );
					}
				);
			}
		},
		initItem: function ( $thisHolder ) {
			var $swiperContainers      = $thisHolder.find( '.swiper-container' ),
				swiperContainersLength = $swiperContainers.length - 1,
				slideSpeed             = 1200;

			$swiperContainers.each(
				function ( i ) {
					var $thisSwiperContainer = $( this ),
						swiperIndex          = i;

					// Set direction
					if ( (i + 1) % 2 == 0 ) {
						$thisSwiperContainer.attr(
							'dir',
							'rtl'
						);
					} else {
						$thisSwiperContainer.attr(
							'dir',
							'ltr'
						);
					}

					var swiperSlider = new Swiper(
						$thisSwiperContainer[0],
						{
							loop: true,
							slidesPerView: 'auto',
							speed: slideSpeed,
							simulateTouch: false,
							on: {
								init: function () {
									if ( swiperIndex === swiperContainersLength ) {
										// Init other functions after last swiper init
										setTimeout(
											function () {
												$thisHolder.find( '.swiper-container' ).each(
													function () {
														if ( ! qodefAddonsCore.body.hasClass( 'qodef-qi--touch' ) ) {
															qodefInteractiveProjectCarousel.wheelTrigger(
																$thisHolder,
																$( this ),
																slideSpeed
															);
														}
														qodefInteractiveProjectCarousel.dragTrigger(
															$thisHolder,
															$( this ),
															slideSpeed
														);
														qodefInteractiveProjectCarousel.touchTrigger(
															$thisHolder,
															$( this ),
															slideSpeed
														);
													}
												);

												qodefInteractiveProjectCarousel.initHoverAnimations( $thisHolder );
												$thisHolder.addClass( 'qodef--initialized' );

												var $items  = $thisHolder.find( '.qodef-e-item.swiper-slide-active' ),
													$images = $thisHolder.find( '.qodef-e-media-image' );

												$items.eq( 0 ).addClass( 'qodef--hovered' );
												$images.eq( 0 ).addClass( 'qodef--active' );
											},
											100
										);
									}
								},
							},
						}
					);
				}
			);
		},
		initHoverAnimations: function ( $thisHolder ) {
			var $slideItems = $thisHolder.find( '.qodef-e-item' ),
				xPos,
				yPos;

			$( window ).on(
				'mousemove',
				function ( e ) {
					xPos = e.clientX;
					yPos = e.clientY;
				}
			);

			// Change hovered item after scroll
			$thisHolder.on(
				'qodefSliderScrolled',
				function ( e ) {
					setTimeout(
						function () {
							qodefInteractiveProjectCarousel.changeHoveredItemAfterScroll(
								$thisHolder,
								$slideItems,
								xPos,
								yPos
							);
						},
						10
					);
				}
			);

			// Mouse enter and leave item
			$slideItems.each(
				function () {
					var $thisItem = $( this );
					$thisItem.on(
						'mouseenter',
						function () {
							qodefInteractiveProjectCarousel.hoverItem(
								$thisHolder,
								$thisItem,
								'in'
							);
						}
					).on(
						'mouseleave',
						function () {
							qodefInteractiveProjectCarousel.hoverItem(
								$thisHolder,
								$thisItem,
								'out'
							);
						}
					);
				}
			);

			// Touch device events
			if ( qodefAddonsCore.body.hasClass( 'qodef-qi--touch' ) ) {
				$slideItems.on(
					'touchstart',
					function () {
						var $thisItem = $( this );

						if ( ! $thisItem.hasClass( 'qodef--hovered' ) ) {
							$slideItems.each(
								function () {
									qodefInteractiveProjectCarousel.hoverItem(
										$thisHolder,
										$( this ),
										'out'
									);
								}
							);
							qodefInteractiveProjectCarousel.hoverItem(
								$thisHolder,
								$thisItem,
								'in'
							);
						}
					}
				);
			}
		},
		changeHoveredItemAfterScroll: function ( $thisHolder, $slideItems, x, y ) {
			var $pointElement = qodefInteractiveProjectCarousel.getJqueryElementFromPoint( x, y ),
				$hoveredItem  = $pointElement.closest( '.qodef-e-item' );

			if ( $hoveredItem.length && ! $hoveredItem.hasClass( 'qodef--hovered' ) ) {
				$slideItems.each(
					function () {
						qodefInteractiveProjectCarousel.hoverItem(
							$thisHolder,
							$( this ),
							'out'
						);
					}
				);
				qodefInteractiveProjectCarousel.hoverItem(
					$thisHolder,
					$hoveredItem,
					'in'
				);
			}
		},
		hoverItem: function ( $thisHolder, $thisItem, action ) {
			var itemDataId   = $thisItem.data( 'index' ),
				$thisItemIMG = $thisHolder.find( '.qodef-e-media-image[data-index=' + itemDataId + ']' );

			if ( action === 'in' ) {
				$thisItem.siblings().removeClass( 'qodef--hovered' );
				$thisItem.addClass( 'qodef--hovered' );
				$thisItemIMG.siblings().removeClass( 'qodef--active' );
				$thisItemIMG.addClass( 'qodef--active' );
			} else {
				if ( ! $thisItemIMG.children( 'img' ).is( ':hover' ) ) {
					$thisItem.removeClass( 'qodef--hovered' );
					$thisItemIMG.removeClass( 'qodef--active' );
				}
			}
		},
		getJqueryElementFromPoint: function ( x, y ) {
			return $( document.elementFromPoint( x,	y )	);
		},
		connectTwoSwipers: function ( $swiperContainers ) {
			$swiperContainers.each(
				function ( i ) {
					var thisSwiperInstance = $( this )[0].swiper,
						indexOfOtherSwiper = i == 0 ? 1 : 0;

					thisSwiperInstance.controller.control = $swiperContainers.eq( indexOfOtherSwiper )[0].swiper,
						thisSwiperInstance.update();
				}
			);
		},
		wheelTrigger: function ( $thisHolder, $firstSwiper, slideSpeed ) {
			var scrollStart = false;

			$thisHolder.on(
				'wheel',
				function ( event ) {
					if ( ! scrollStart ) {
						scrollStart = true;

						if ( event.originalEvent.deltaY < 0 ) {
							$firstSwiper[0].swiper.slideNext(
								slideSpeed,
								true
							);
						} else {
							$firstSwiper[0].swiper.slidePrev(
								slideSpeed,
								true
							);
						}

						setTimeout(
							function () {
								scrollStart = false;
								$thisHolder.triggerHandler( 'qodefSliderScrolled' );
							},
							slideSpeed + 10
						);
					}

				}
			);
		},
		dragTrigger: function ( $thisHolder, $firstSwiper, slideSpeed ) {
			var dragStart = false,
				original,
				movement;

			$thisHolder.on(
				'drag',
				function ( event ) {
					event.preventDefault();

					movement = event.originalEvent.offsetX;

					if ( ! dragStart ) {
						dragStart = true;
						original  = event.originalEvent.offsetX;
					}

					if ( dragStart && movement !== original ) {

						if ( movement - original < 0 ) {
							$firstSwiper[0].swiper.slideNext(
								slideSpeed,
								true
							);
						} else {
							$firstSwiper[0].swiper.slidePrev(
								slideSpeed,
								true
							);
						}

						setTimeout(
							function () {
								dragStart = false;
								$thisHolder.triggerHandler( 'qodefSliderScrolled' );
							},
							slideSpeed + 10
						);
					}

				}
			);
		},
		touchTrigger: function ( $thisHolder, $firstSwiper, slideSpeed ) {
			var dragStart = false,
				original,
				movement;

			$thisHolder.on(
				'touchmove',
				function ( event ) {
					event.preventDefault();

					movement = event.originalEvent.changedTouches[0].screenX;

					if ( ! dragStart ) {
						dragStart = true;
						original  = event.originalEvent.changedTouches[0].screenX;
					}

					if ( dragStart && movement !== original ) {

						if ( movement - original < 0 ) {
							$firstSwiper[0].swiper.slideNext(
								slideSpeed,
								true
							);
						} else {
							$firstSwiper[0].swiper.slidePrev(
								slideSpeed,
								true
							);
						}

						setTimeout(
							function () {
								dragStart = false;
							},
							slideSpeed + 10
						);
					}
				}
			);
		}
	};

	qodefAddonsPremiumCore.shortcodes.qi_addons_for_elementor_premium_interactive_project_carousel.qodefInteractiveProjectCarousel = qodefInteractiveProjectCarousel;

})( jQuery );

(function ( $ ) {
	'use strict';

	qodefAddonsPremiumCore.shortcodes.qi_addons_for_elementor_premium_intro_glitch_effect = {};

	$( document ).ready(
		function () {
			qodefIntroGlitchEffect.init();
		}
	);

	$( window ).on(
		'load',
		function () {
			qodefIntroGlitchEffect.windowLoaded = true;
		}
	);

	var qodefIntroGlitchEffect = {
		init: function () {
			this.holder = $( '.qodef-qi-intro-glitch-effect' );
			if ( this.holder.length ) {
				this.holder.each(
					function () {
						qodefIntroGlitchEffect.initItem( $( this ) );
					}
				);
			}
		},
		initItem: function ( $currentItem ) {
			if ( $currentItem.length && ! qodefAddonsCore.body.hasClass( 'qodef-qi--touch' ) ) {
				var $glitches            = $currentItem.find( '.qodef-m-image-glitches' ),
					sectionHeight,
					sectionOffset,
					sectionArea,
					scrollTarget,
					readyToScroll        = false,
					initialAnimationDone = false,
					wheelDownwards       = false;

				//windowLoaded is set to false initially, change to true on 'load' or when in elementor editor
				//if windowLoaded not set already set it to false
				if ( true !== qodefIntroGlitchEffect.windowLoaded ) {
					qodefIntroGlitchEffect.windowLoaded = false;
				}

				var isEditMode = Boolean( elementorFrontend.isEditMode() );
				if ( isEditMode ) {
					qodefIntroGlitchEffect.windowLoaded = true;
				}

				var Item = function ( sel, classString, set ) {
					this.sel         = sel;
					this.classString = classString;
					this.set         = set;
				};

				var $headlineHolder = new Item(
					$currentItem.find( '.qodef-m-headline-holder' ),
					'headlines',
					false
					),
					$image          = new Item(
						$currentItem.find( '.qodef-m-bottom-image' ),
						'image',
						false
					),
					$firstScreen    = new Item(
						$( '.qodef-m-screen-1' ),
						'screen',
						true
					),
					$secondScreen   = new Item(
						$( '.qodef-m-screen-2' ),
						'screen',
						false
					);

				//update section height and offset
				var updateCoordinates = function () {
					sectionHeight = $currentItem.height();
					sectionOffset = $currentItem.offset().top;
					scrollTarget  = sectionHeight + sectionOffset;
					sectionArea   = sectionHeight - sectionOffset;
				};

				//wheel logic
				var sectionWheelHandler = function ( e ) {
					wheelDownwards = e.originalEvent.deltaY > 0;

					if ( $headlineHolder.set && $image.set ) {
						initialAnimationDone = true;
					}

					if ( qodefAddonsCore.scroll < sectionArea ) {
						if (wheelDownwards) {
							qodefAddonsCore.qodefScroll.disable();

							if ( initialAnimationDone ) {
								//set headline
								if ( ! $headlineHolder.set && ! $image.set && ! $secondScreen.set ) {
									qodefIntroGlitchEffect.itemChange(
										$headlineHolder,
										true
									);
								}

								//set image
								if ( $headlineHolder.set && ! $image.set && ! $secondScreen.set ) {
									qodefIntroGlitchEffect.animateGlitches( $glitches );
									qodefIntroGlitchEffect.itemChange(
										$image,
										true
									);
								}

								//set second screen
								if ( $headlineHolder.set && $image.set && ! $secondScreen.set ) {
									clearInterval( qodefIntroGlitchEffect.animateGlitchesInterval );
									qodefIntroGlitchEffect.scrollToScreen(
										$currentItem,
										$headlineHolder,
										$firstScreen,
										$secondScreen
									);
								}

								if ( $secondScreen.set ) {
									qodefAddonsCore.qodefScroll.enable();
								}
							}
						} else {
							if ( qodefAddonsCore.scroll <= sectionOffset ) {
								if ( $firstScreen.set ) {
									qodefIntroGlitchEffect.animateGlitches( $glitches );
								}

								if ( $secondScreen.set ) {
									$currentItem.addClass( 'qodef--fadeout-text' );
									qodefIntroGlitchEffect.itemChange( $secondScreen );
									qodefIntroGlitchEffect.itemChange(
										$firstScreen,
										true
									);

									$currentItem.one(
										qodefIntroGlitchEffect.animationEventEnd(),
										function () {
											qodefIntroGlitchEffect.itemChange(
												$headlineHolder,
												true
											);
											qodefIntroGlitchEffect.animateGlitches( $glitches );
											$currentItem.removeClass( 'qodef--fadeout-text' );
										}
									);
								}
							}
						}
					}
				};

				$firstScreen.sel.on(
					'click',
					function () {
						if ( $headlineHolder.set && $image.set ) {
							initialAnimationDone = true;
							qodefIntroGlitchEffect.scrollToScreen(
								$currentItem,
								$headlineHolder,
								$firstScreen,
								$secondScreen
							);
						}
					}
				);

				//init
				updateCoordinates();
				$currentItem.on(
					'wheel',
					function ( e ) {
						sectionWheelHandler( e );
					},
				);

				qodefAddonsCore.qodefWaitForImages.check(
					$currentItem,
					function () {
						qodefIntroGlitchEffect.itemChange(
							$headlineHolder,
							true
						);

						setTimeout(
							function () {
								if ( ! readyToScroll ) {
									$currentItem.addClass( 'qodef--headline-loop' );
								}
							},
							1000
						);
					}
				);

				//check when loaded to move on with animation
				var animateIntro = setInterval(
					function () {
						if ( qodefIntroGlitchEffect.windowLoaded ) {
							readyToScroll = true;
							$currentItem.removeClass( 'qodef--headline-loop' );

							if ( ! $headlineHolder.set ) {
								qodefIntroGlitchEffect.itemChange(
									$headlineHolder,
									true
								);
								$currentItem.one(
									qodefIntroGlitchEffect.animationEventEnd(),
									function () {
										qodefIntroGlitchEffect.animateGlitches( $glitches );
										qodefIntroGlitchEffect.itemChange(
											$image,
											true
										);
									}
								);
							} else {
								qodefIntroGlitchEffect.animateGlitches( $glitches );
								qodefIntroGlitchEffect.itemChange(
									$image,
									true
								);
							}
							clearInterval( animateIntro );
						}
					},
					1000
				);

				$( window ).resize(
					function () {
						setTimeout(
							function () {
								updateCoordinates();
							},
							100
						);
					}
				);
			}
		},
		scrollToScreen: function ( $currentItem, $headlineHolder, $firstScreen, $secondScreen ) {
			qodefIntroGlitchEffect.itemChange( $headlineHolder );
			$currentItem.one(
				qodefIntroGlitchEffect.animationEventEnd(),
				function () {
					qodefIntroGlitchEffect.itemChange( $firstScreen );
					qodefIntroGlitchEffect.itemChange(
						$secondScreen,
						true
					);

					$currentItem.one(
						qodefIntroGlitchEffect.animationEventEnd(),
						function () {
							qodefIntroGlitchEffect.itemChange( $headlineHolder );
						}
					);
				}
			);
		},
		animationEventEnd: function () {
			var el = document.createElement( 'animationDetector' );

			var animations = {
				'animation': 'animationend',
				'OAnimation': 'oAnimationEnd',
				'MozAnimation': 'animationend',
				'WebkitAnimation': 'webkitAnimationEnd'
			};

			for ( var t in animations ) {
				if ( el.style[t] !== undefined ) {
					return animations[t];
				}
			}
		},
		animateGlitches: function ( $glitches ) {
			qodefIntroGlitchEffect.animateGlitchesInterval = setInterval(
				function () {
					$glitches.removeClass( 'qodef-glitches--hide' ).addClass( 'qodef-glitches--show' );
					setTimeout(
						function () {
							$glitches.removeClass( 'qodef-glitches--show' ).addClass( 'qodef-glitches--hide' );
						},
						350
					);
				},
				1600
			);
		},
		itemChange: function ( $item, show = false ) {
			var remove,
				add;

			if ( show ) {
				remove = '--hide';
				add    = '--show';
			} else {
				remove = '--show';
				add    = '--hide';
			}

			$item.sel
			.removeClass( 'qodef-' + $item.classString + remove )
			.addClass( 'qodef-' + $item.classString + add )
			.one(
				qodefIntroGlitchEffect.animationEventEnd(),
				function () {
					$item.set = show;
				}
			);
		},
	};

	qodefAddonsPremiumCore.shortcodes.qi_addons_for_elementor_premium_intro_glitch_effect.qodefIntroGlitchEffect = qodefIntroGlitchEffect;

})( jQuery );

(function ( $ ) {
	'use strict';

	qodefAddonsPremiumCore.shortcodes.qi_addons_for_elementor_premium_intro_write_out_floating_images = {};

	$( window ).on(
		'load',
		function () {
			qodefIntroFloatingImages.init();
		}
	);

	var qodefIntroFloatingImages = {
		init: function () {
			var $holder = $( '.qodef-qi-intro-write-out-floating-images' );

			if ( $holder.length ) {
				$holder.each(
					function () {
						qodefIntroFloatingImages.initItem( $( this ) );

					}
				);
			}
		},
		initItem: function ( $thisHolder ) {
			if ( qodefAddonsCore.windowWidth > 1024 ) {
				qodefIntroFloatingImages.animateFloat( $thisHolder );
			}

			$thisHolder.addClass( 'qodef--appear' );
		},
		animateFloat: function ( $thisHolder ) {
			setTimeout(
				function () {
					$overlayHolder.addClass( 'qodef--appear' );
				},
				500
			);

			/* logic for scrolling slider - start */
			gsap.registerPlugin( ScrollTrigger );//need to make sure that plugin is registered
			gsap.registerPlugin( ScrollToPlugin );//need to make sure that plugin is registered

			var $lastItem          = $thisHolder.find( 'article:last-of-type' ),
				holderHeight       = Math.ceil( $lastItem.position().top + $lastItem.outerHeight() ),//position().top  is relative to parent top position
				scrollOffsetBottom = 100,//arbitrary value, final bottom position after scroll is finished
				maxScroll          = holderHeight - qodefAddonsCore.windowHeight + scrollOffsetBottom,
				$holderParent      = $thisHolder.closest( 'section' ),
				$scrollHolder      = $thisHolder.find( '.qodef-grid-holder ' ),
				$imagesHolder      = $thisHolder.find( '.qodef-grid-inner ' ),
				$nextSection       = $holderParent.next(),
				$overlayHolder     = $thisHolder.find( '.qodef-m-image-overlay-holder' ),
				trigerNextSection  = false;


			// this scrolling object just allows us to conveniently call scrolling.enable(), scrolling.disable(), and check if scrolling.enabled is true.
			var scrolling = {
				enabled: true,
				events: 'scroll,wheel,touchmove,pointermove'.split( ',' ),
				prevent: e => e.preventDefault(),
				disable() {
					if ( scrolling.enabled ) {
						scrolling.enabled = false;
						window.addEventListener(
							'scroll',
							gsap.ticker.tick,
							{ passive: true }
						);
						scrolling.events.forEach(
							( e, i ) => (i ? document : window).addEventListener(
								e,
								scrolling.prevent,
								{ passive: false }
							)
						);
					}
				},
				enable() {
					if ( ! scrolling.enabled ) {
						scrolling.enabled = true;
						window.removeEventListener(
							'scroll',
							gsap.ticker.tick
						);
						scrolling.events.forEach(
							( e, i ) => (i ? document : window).removeEventListener(
								e,
								scrolling.prevent
							)
						);
					}
				}
			};

			function updateProgress( timeline ) {
				if ( ! $nextSection.length ) {
					return false;
				} else {
					trigerNextSection = ScrollTrigger.positionInViewport(
						$imagesHolder[0],
						'bottom'
					).toFixed( 2 ) < 1.15;//images holder reached near end position

					if ( trigerNextSection && scrolling.enabled && timeline.direction === 1 ) {//timeline.direction is 1 if going forwards in timeline
						scrolling.disable();

						$( window ).one(
							'wheel',
							function () {
								gsap.to(
									window,
									{
										scrollTo: { y: $nextSection.offset().top, autoKill: false },
										onComplete: scrolling.enable,
										duration: 1.1,
									}
								);
							}
						);
					}
				}
			}

			var floatTl = gsap.timeline(
				{
					paused: true,
					scrollTrigger: {
						trigger: $scrollHolder,
						pin: $thisHolder,
						scrub: 1,
						// anticipatePin: 1,
						start: 'top top',//when top of the holder hits top of the viewport
						// markers: true,//only used for development
						end: '+=150%',//110% the height of the scroller beyond where the start is
						onUpdate: updateProgress,
					}
				}
			);

			floatTl
			.to(
				$imagesHolder,
				{
					y: Math.min(//cant be smaller than 0, in case holder height is smaller than window height
						0,
						-maxScroll
					),
				}
			);

			/* logic for scrolling slider - end */

			/* logic for show items on load/scroll - start */
			//set data offset to items, so we could know when to show them
			var $items = $thisHolder.find( 'article' );

			$items.each(
				function () {
					$( this ).attr(
						'data-offset-top',
						$( this ).offset().top - $( this ).outerHeight()
					);
					$( this ).data(
						'offset-top',
						$( this ).offset().top - $( this ).outerHeight()
					);
				}
			);

			//if some items are in viewport on load, than show them
			setTimeout(
				function () {
					$items.each(
						function ( i ) {
							var $thisArticle = $( this );
							if ( qodefAddonsCore.windowHeight / 2 > $( this ).data( 'offset-top' ) ) {
								setTimeout(
									function () {
										$thisArticle.addClass( 'qodef--appear' );
									},
									(i + 1) * 350 + 1500
								);
							} else {
								qodefAddonsCore.qodefIsInViewport.check(
									$thisArticle,
									function () {
										if ( ! $thisArticle.hasClass( 'qodef--appear' ) ) {
											$thisArticle.addClass( 'qodef--appear' );
										}
									}
								);
							}
						}
					);
				},
				500
			);
		}
	};

	qodefAddonsPremiumCore.shortcodes.qi_addons_for_elementor_premium_intro_write_out_floating_images.qodefIntroFloatingImages = qodefIntroFloatingImages;
	qodefAddonsPremiumCore.shortcodes.qi_addons_for_elementor_premium_intro_write_out_floating_images.qodefSplitting           = qodefAddonsPremiumCore.qodefSplitting;

})( jQuery );

(function ( $ ) {
	'use strict';

	qodefAddonsPremiumCore.shortcodes.qi_addons_for_elementor_premium_intro_swipe_images = {};

	$( document ).ready(
		function () {
			qodefIntroSwipeImages.init();
		}
	);

	// End Spinner Animation on Window Load
	$( window ).on(
		'load',
		function () {
			qodefIntroSwipeImages.windowLoaded = true;
		}
	);

	var qodefIntroSwipeImages = {
		init: function () {
			this.holder = $( '.qodef-qi-intro-swipe-images' );
			if ( this.holder.length ) {
				this.holder.each(
					function () {
						qodefIntroSwipeImages.initItem( $( this ) );
					}
				);
			}
		},
		initItem: function ( $currentItem ) {
			var $imagesHolder = $currentItem.find( '.qodef-m-images-holder' ),
				$images       = $imagesHolder.find( '.qodef-e-bckg-image' ),
				interval;

			//if windowLoaded not set already set it to false
			if ( true !== qodefIntroSwipeImages.windowLoaded ) {
				qodefIntroSwipeImages.windowLoaded = false;
			}

			var isEditMode = Boolean( elementorFrontend.isEditMode() );
			if ( isEditMode ) {
				qodefIntroSwipeImages.windowLoaded = true;
			}

			var animateImagesSecond = function () {
				var animateImagesInterval = setInterval(
					function () {
						var activeImage = $images.filter( '.qodef-image--animating' ),
							firstImage  = $images.first();

						$images.removeClass( 'qodef-image--animating' );
						if ( ! activeImage.next().length ) {
							firstImage.addClass( 'qodef-image--animating' );
						} else {
							activeImage.next().addClass( 'qodef-image--animating' );
						}

						if ( qodefIntroSwipeImages.windowLoaded ) {
							setTimeout(
								function () {
									$currentItem.addClass( 'qodef--animate-elements' );
								},
								500
							);
							moveOnScroll();
							clearInterval( animateImagesInterval );
						}
					},
					1000
				);
			};

			var animateImagesFirst = function () {
				var delay = 0;

				$images.each(
					function ( i ) {
						var $thisImage    = $( this );
						var $imagesLength = $images.length - 1;

						$imagesHolder.css(
							'opacity',
							1
						);

						setTimeout(
							function () {
								$thisImage.addClass( 'qodef-image--animating' );
								if ( $thisImage.hasClass( 'qodef-image--animating' ) ) {
									$thisImage.prev().removeClass( 'qodef-image--animating' );
								}

								if ( i === $imagesLength ) {
									if ( qodefIntroSwipeImages.windowLoaded ) {
										clearInterval( interval );
										setTimeout(
											function () {
												$currentItem.addClass( 'qodef--animate-elements' );
											},
											500
										);
										moveOnScroll();
									} else {
										// Continue looping images if window not loaded
										animateImagesSecond();
									}
								}
							},
							delay
						);
						delay += 1000;

						$imagesHolder.addClass( 'qodef--animate-border' );
						$imagesHolder.css(
							'transition-duration',
							i + 1 + 's'
						);
					}
				);
			};

			var moveOnScroll = function () {
				$( 'html, body' ).animate(
					{ scrollTop: 0 },
					100
				);
				setTimeout(
					function () {
						$currentItem.addClass( 'qodef-animation--stop' );
						qodefAddonsCore.qodefScroll.enable();
						/*scrollToContent();*/
					},
					1500
				);
			};

			// Start Spinner Animation Loop
			setTimeout(
				function () {
					qodefAddonsCore.qodefScroll.disable();
					animateImagesFirst();
				},
				250
			);
		},
		fadeOutLoader: function ( $currentItem, speed, delay, easing ) {
			speed  = speed ? speed : 600;
			delay  = delay ? delay : 0;
			easing = easing ? easing : 'swing';

			if ( $currentItem.length ) {
				$currentItem.delay( delay ).fadeOut(
					speed,
					easing
				);
				$( window ).on(
					'bind',
					'pageshow',
					function ( event ) {
						if ( event.originalEvent.persisted ) {
							$currentItem.fadeOut(
								speed,
								easing
							);
						}
					}
				);
			}
		}
	};

	qodefAddonsPremiumCore.shortcodes.qi_addons_for_elementor_premium_intro_swipe_images.qodefIntroSwipeImages = qodefIntroSwipeImages;

})( jQuery );

(function ( $ ) {
	'use strict';

	qodefAddonsPremiumCore.shortcodes.qi_addons_for_elementor_premium_numbered_slider             = {};
	qodefAddonsPremiumCore.shortcodes.qi_addons_for_elementor_premium_numbered_slider.qodefSwiper = qodefAddonsCore.qodefSwiper;

	$( document ).ready(
		function () {
			qodefNumberedSlider.init();
		}
	);

	var qodefNumberedSlider = {
		init: function () {
			this.holder = $( '.qodef-qi-numbered-slider' );

			if ( this.holder.length ) {
				this.holder.each(
					function () {
						qodefNumberedSlider.initItem( $( this ) );
					}
				);
			}
		},
		initItem: function( $currentItem ) {
			qodefAddonsCore.qodefSwiperElementorCheck.init( qodefNumberedSlider.initSwiperReinit, $currentItem );
		},
		initSwiperReinit: function ( $currentItem ) {
			var $mainSlider             = $currentItem.find( '.qodef-m-items-slider' ),
				$mainSliderSwiper       = $mainSlider[0].swiper,
				$backgroundSlider       = $currentItem.find( '.qodef-m-background-slider' ),
				$backgroundSliderSwiper = $backgroundSlider[0].swiper,
				autoplay                = $mainSliderSwiper.params['autoplay']['enabled'];

			qodefNumberedSlider.initAnimation(
				$currentItem,
				$backgroundSliderSwiper,
				$mainSlider
			);
			qodefNumberedSlider.triggerMove(
				$currentItem,
				$mainSliderSwiper
			);

			if ( autoplay ) {
				$mainSliderSwiper.autoplay.start();
			}

			if ( ! $currentItem.hasClass( 'qodef--full-height' ) ) {
				qodefNumberedSlider.equalHeights( $backgroundSlider );
			}
			$currentItem.addClass( 'qodef--visible' );
		},
		initAnimation: function ( $currentItem, $backgroundSliderSwiper, $mainSlider ) {
			$currentItem.addClass( 'qodef--reveal' );

			$mainSlider[0].swiper.on(
				'slideChangeTransitionStart',
				function () {

					setTimeout(
						function () {
							$backgroundSliderSwiper.slideTo( $mainSlider[0].swiper.activeIndex );
						},
						500
					);

					var $activeItem = $mainSlider.find( '.swiper-slide-active' );

					$mainSlider.find( '.swiper-slide' ).removeClass( 'qodef--after-active qodef--prev-active' );
					$activeItem.prev().prevAll().removeClass( 'qodef--after-active' ).addClass( 'qodef--prev-active' );
					$activeItem.next().nextAll().removeClass( 'qodef--prev-active' ).addClass( 'qodef--after-active' );
				}
			);

			$mainSlider[0].swiper.on(
				'slideChange',
				function () {
					$currentItem.removeClass( 'qodef--reveal' );
					$currentItem.addClass( 'qodef--hide' );

					setTimeout(
						function () {
							var $activeItem = $mainSlider.find( '.swiper-slide-active' );

							$currentItem.addClass( 'qodef--reveal' );
							$activeItem.siblings().removeClass( 'qodef--show' );
							$activeItem.addClass( 'qodef--show' );
							setTimeout(
								function () {
									// $currentItem.removeClass( 'qodef--reveal' );
									$currentItem.removeClass( 'qodef--hide' );
								},
								500
							);
						},
						900
					);
				}
			);
		},
		triggerMove: function ( $currentItem, $backgroundSliderSwiper ) {
			var $prev = $currentItem.find( '.qodef-trigger--prev' ),
				$next = $currentItem.find( '.qodef-trigger--next' );

			$prev.on(
				'click',
				function () {
					$backgroundSliderSwiper.slidePrev();
				}
			);
			$next.on(
				'click',
				function () {
					$backgroundSliderSwiper.slideNext();
				}
			);
		},
		equalHeights: function ( $backgroundSlider ) {
			var $items = $backgroundSlider.find( '.qodef-e-image-holder' ),
				height = 0;

			if ( $items.length ) {
				$items.each(
					function () {
						var $this     = $( this ),
							newHeight = $this.outerHeight();

						if ( newHeight > height ) {
							height = newHeight;
						}
					}
				);

				$items.find( 'img' ).css(
					'height',
					height
				);
			}
		}
	};
	qodefAddonsPremiumCore.shortcodes.qi_addons_for_elementor_premium_numbered_slider.qodefNumberedSlider = qodefNumberedSlider;

})( jQuery );

(function ( $ ) {
	'use strict';
	
	qodefAddonsPremiumCore.shortcodes.qi_addons_for_elementor_premium_rotating_image_tiles = {};

	$( document ).ready(
		function ()
		{
			qodefRotatingImageTiles.init();
		}
	);
	
	var qodefRotatingImageTiles = {
		init: function () {
			var $holder = $( '.qodef-qi-rotating-image-tiles' );
			if ( $holder.length ) {
				$holder.each(
					function (i) {
						var $thisHolder = $( this );
						
						qodefRotatingImageTiles.initItem( $thisHolder, i );
					}
				);
			}
		},
		initItem: function ( $holder, $index ) {
			var $wheel = $holder.find( '.qodef-tile-wheel' ),
				$size = 0,
				$deg = 0,
				$interval = $holder.data( 'interval' ) !== undefined ? $holder.data( 'interval' ) : 2500;
			
			$size = $holder.outerWidth();
			$holder.css(
				'--qodef-image-tiles-size',
				$size + 'px'
			);
			
			// setInterval function keeps the reference only to the last value of $index
			(function () {
				var $isPaused = false;
				setInterval(function () {
					if ( !$isPaused ) {
						$wheel.css(
							'transform',
							'rotate(' + $deg + 'deg)'
						);
						$deg += 90;
					}
				}, $interval);
				
				$(window).focus(function() {
					$isPaused = false;
				})
				.blur(function() {
					$isPaused = true;
				})
				.focus();
			})($index);
		},
	};
	
	qodefAddonsPremiumCore.shortcodes.qi_addons_for_elementor_premium_rotating_image_tiles.qodefRotatingImageTiles = qodefRotatingImageTiles;

})( jQuery );

(function ( $ ) {
	'use strict';

	qodefAddonsPremiumCore.shortcodes.qi_addons_for_elementor_premium_pricing_slider = {};


	$( document ).ready(
		function () {
			qodefInitPricingSlider.init();
		}
	);

	/*
	 **	Horizontal progress bars shortcode
	 */
	var qodefInitPricingSlider = {
		init: function () {
			var $holder = $( '.qodef-qi-pricing-slider' );

			if ( $holder.length ) {
				$holder.each(
					function () {
						qodefInitPricingSlider.initItem( $( this ) );
					}
				);
			}
		},
		initItem: function ( $currentItem ) {
			var slider          = $currentItem;
			var dragHolder      = slider.find( '.qodef-m-slider' );
			var drag            = slider.find( '.qodef-m-slider-drag' );
			var progressBar     = slider.find( '.qodef-m-slider-bar' );
			var priceElement    = slider.find( '.qodef-m-total-price' );
			var sliderTextLabel = slider.find( '.qodef-m-slider-value' );

			var unitName            = slider.data( 'unit-name' ) ? slider.data( 'unit-name' ) : 'unit';
			var unitNamePlural      = slider.data( 'unit-name-plural' ) ? slider.data( 'unit-name-plural' ) : 'units';
			var unitsRange          = parseFloat( slider.data( 'units-range' ) ) ? parseFloat( slider.data( 'units-range' ) ) : 0;
			var unitsBreakpoints    = parseFloat( slider.data( 'units-breakpoints' ) ) ? parseFloat( slider.data( 'units-breakpoints' ) ) : 0;
			var price               = parseFloat( slider.data( 'price-per-unit' ) ) ? parseFloat( slider.data( 'price-per-unit' ) ) : 0;
			var reduceRate          = parseFloat( slider.data( 'price-reduce-per-breakpoint' ) ) ? parseFloat( slider.data( 'price-reduce-per-breakpoint' ) ) : 0;
			var breakpointValue     = unitsBreakpoints;
			var breakPointsIterator = 0;

			var parentXPos  = dragHolder.offset().left;
			var parentWidth = dragHolder.outerWidth() - drag.outerWidth();
			var iterator    = parentWidth / unitsRange;

			var offset = 0;
			var xPos   = 1;
			var units  = 1;

			var i;
			if ( unitsBreakpoints > 0 ) {
				var delimiters = unitsRange / unitsBreakpoints;
				for ( i = 1; i < delimiters; i++ ) {
					progressBar.append( '<span class="qodef-m-delimiter" style="left:' + Math.round( (100 / delimiters) * i ) + '%;"></span>' );
				}
			}

			qodefInitPricingSlider.recalculateValues(
				priceElement,
				units,
				price,
				sliderTextLabel,
				progressBar,
				xPos,
				parentWidth,
				unitName,
				unitNamePlural
			);

			var draggerPosition;
			drag.draggable( {
				axis: 'x',
				containment: dragHolder.parent(),
				scrollSensitivity: 10,
				start: function ( event, ui ) {
					draggerPosition = ui.position.left;
				},
				drag: function ( event, ui ) {
					var direction   = (ui.position.left > draggerPosition) ? 'right' : 'left';
					draggerPosition = ui.position.left;
					offset          = $( this ).offset();
					xPos            = offset.left - parentXPos;
					units           = Math.floor( xPos / iterator );
					if ( xPos >= 0 && xPos <= parentWidth ) {
						if ( direction === 'right' ) {
							if ( units > breakpointValue ) {
								breakpointValue = breakpointValue + unitsBreakpoints;
								breakPointsIterator++;
								price = price - reduceRate;
							}
						} else if ( direction === 'left' ) {
							if ( units <= breakpointValue - unitsBreakpoints ) {
								breakpointValue = breakpointValue - unitsBreakpoints;
								breakPointsIterator--;
								price = price + reduceRate;
							}
						}
						qodefInitPricingSlider.recalculateValues(
							priceElement,
							units,
							price,
							sliderTextLabel,
							progressBar,
							xPos,
							parentWidth,
							unitName,
							unitNamePlural
						);
					}
				}
			} );

		},
		recalculateValues: function ( priceElement, units, price, sliderTextLabel, progressBar, xPos, parentWidth, unitName, unitNamePlural ) {
			priceElement.text( ((Math.round( units * price * 100 )) / 100) );
			if ( units == 1 ) {
				sliderTextLabel.text( units + ' ' + unitName );
			} else {
				sliderTextLabel.text( units + ' ' + unitNamePlural );
			}
			progressBar.width( Math.round( (xPos / parentWidth) * 100 ) + '%' );
		}
	};

	qodefAddonsPremiumCore.shortcodes.qi_addons_for_elementor_premium_pricing_slider.qodefInitPricingSlider = qodefInitPricingSlider;
})
(jQuery);
(function ( $ ) {
	'use strict';

	qodefAddonsPremiumCore.shortcodes.qi_addons_for_elementor_premium_pricing_calculator = {};

	$( document ).ready(
		function () {
			qodefPricingCalculator.init();
		}
	);

	var qodefPricingCalculator = {
		init: function () {
			var $holder = $( '.qodef-qi-pricing-calculator' );

			if ( $holder.length ) {
				$holder.each(
					function () {
						qodefPricingCalculator.initItem( $( this ) );
					}
				);
			}
		},
		initItem: function ( $currentItem ) {
			var $totalPriceHolder = $currentItem.find( '.qodef-m-total-price' ),
				totalPrice        = parseFloat( $totalPriceHolder.text() ),
				$items            = $currentItem.find( '.qodef-e-item.qodef-item-price' );

			if ( isNaN( totalPrice ) ) {
				totalPrice = 0;
			}

			$items.each(
				function () {
					var $currentItem     = $( this ),
						$currentCheckbox = $currentItem.find( 'input[type="checkbox"]' ),
						currentPrice     = 0;

					if ( typeof $currentItem.data( 'price' ) !== 'undefined' && $currentItem.data( 'price' ) !== false ) {
						currentPrice = parseFloat( $currentItem.data( 'price' ) );

						if ( isNaN( currentPrice ) ) {
							currentPrice = 0;
						}
					}

					$currentCheckbox.change(
						function () {
							if ( $( this ).is( ':checked' ) ) {
								totalPrice += currentPrice; //+
							} else {
								totalPrice -= currentPrice; // -
							}
							$totalPriceHolder.text( totalPrice );
						}
					);
				}
			);
		}
	};

	qodefAddonsPremiumCore.shortcodes.qi_addons_for_elementor_premium_pricing_calculator.qodefPricingCalculator = qodefPricingCalculator;

})( jQuery );

(function ( $ ) {
	'use strict';

	qodefAddonsPremiumCore.shortcodes.qi_addons_for_elementor_premium_stacked_item_scroll = {};

	$( document ).ready(
		function () {
			qodefStacked.init();
		}
	);

	var qodefStacked = {
		init: function () {
			this.holder = $( '.qodef-qi-stacked-item-scroll' );
			if ( this.holder.length ) {
				this.holder.each(
					function () {
						qodefStacked.initItem( $( this ) );
					}
				);
			}
		},
		initItem: function ( $thisHolder ) {
			var documentHeight            = $thisHolder.closest( 'body' ).height(),
				elementorAdditionalHeight = $( '#elementor-add-new-section' ).length ? $( '#elementor-add-new-section' ).outerHeight( true ) : 0,
				isInContent               = qodefAddonsCore.windowHeight < documentHeight - elementorAdditionalHeight;

			if ( isInContent ) {
				qodefStacked.initAnimation(
					$thisHolder,
					isInContent
				);
			} else {
				qodefStacked.initAnimation(
					$thisHolder,
					isInContent
				);
			}
		},
		initAnimation: function ( $currentItem, isInContent ) {
			if ( isInContent ) {
				$currentItem.addClass( 'qodef--is-in-content' );
			}

			var $innerItems     = $currentItem.find( '.qodef-e-item' ),
				$textItems      = $currentItem.find( '.qodef-e-cursor-text' ),
				$mainTextHolder = $currentItem.find( '.qodef-m-main-holder' ),
				$activeText     = $textItems.first();

			qodefStacked.itemsCount         = $innerItems.length;
			qodefStacked.endOfScrollVisible = false;
			qodefStacked.activeIndex        = 0;
			qodefStacked.direction          = null;
			qodefStacked.deltaY             = 0;
			qodefStacked.tilt               = 30;
			qodefStacked.tx                 = 0;
			qodefStacked.ty                 = 0;

			$innerItems.each(
				function () {
					$( this ).data(
						'move',
						0
					);
					$( this ).data(
						'buffer',
						0
					);
				}
			);

			$innerItems.first().addClass( 'qodef--active' );
			$textItems.first().addClass( 'qodef--active' );
			// qodefStacked.setWidth( $innerItems );
			// qodefStacked.positionItems( $innerItems );
			qodefStacked.setIndexes( $innerItems );

			qodefAddonsCore.qodefWaitForImages.check(
				$currentItem,
				function () {
					qodefStacked.setWidth( $innerItems );
					$currentItem.addClass( 'qodef--loaded' );

					//scroll support
					if ( ! qodefAddonsCore.body.hasClass( 'qodef-qi--touch' ) ) {
						if ( ! isInContent ) {
							$currentItem.on(
								'wheel',
								function ( e ) {
									e.preventDefault();
									qodefStacked.mouseWheel(
										e,
										$currentItem,
										$mainTextHolder,
										$innerItems,
										$textItems,
										$activeText
									);
								}
							);
						}
						$currentItem.on(
							'mousemove',
							function ( e ) {
								qodefStacked.mouseMove(
									e,
									$innerItems
								);
							}
						);
						qodefStacked.fixedInfo(
							$currentItem,
							$innerItems
						);
					}

					//touch support
					if ( qodefAddonsCore.body.hasClass( 'qodef-qi--touch' ) && ! isInContent ) {
						$currentItem.on(
							'touchstart',
							function ( e ) {
								qodefStacked.touchStart(
									e,
									$currentItem
								);
							}
						);
						$currentItem.on(
							'touchmove',
							function ( e ) {
								e.preventDefault();
								qodefStacked.touchMove(
									e,
									$currentItem,
									$mainTextHolder,
									$innerItems,
									$textItems,
									$activeText
								);
							}
						);
						qodefStacked.fixedInfo(
							$currentItem,
							$innerItems,
							true
						);
					}
				}
			);
		},
		setIndexes: function ( $innerItems ) {
			$innerItems.each(
				function () {
					var $item = $( this );

					$item.css(
						{
							'z-index': qodefStacked.itemsCount - $item.data( 'index' ),
							'--qodef-transition-delay': (qodefStacked.itemsCount - $item.data( 'index' )) - 1
						}
					);
				}
			);
		},
		setWidth: function ( $innerItems ) {
			var c = 1;

			if ( qodefAddonsCore.windowWidth <= 1440 && qodefAddonsCore.windowWidth > 1024 ) {
				c = 0.65;
			}
			if ( qodefAddonsCore.windowWidth <= 1024 && qodefAddonsCore.windowWidth > 768 ) {
				c = 0.5;
			}
			if ( qodefAddonsCore.windowWidth <= 768 ) {
				c = 0.4;
			}

			$innerItems.each(
				function () {
					var $item = $( this ),
						w     = ($item.find( 'img' )[0].naturalWidth / Math.min(
							qodefAddonsCore.windowWidth,
							1920
						) * 100).toFixed( 2 ),
						h     = ($item.find( 'img' )[0].naturalHeight / Math.min(
							qodefAddonsCore.windowHeight,
							1080
						) * 100).toFixed( 2 );

					var css = {
						'width': w * c + '%',
						'height': h * c + '%'
					};
					$item.css( css );
				}
			);
		},
		positionItems: function ( $innerItems ) {
			$innerItems.each(
				function () {
					var $item  = $( this ),
						$inner = $item.find( '.qodef-e-item-inner' ),
						x      = qodefAddonsCore.windowWidth >= 1200 ? parseInt( $item.data( 'x' ) ) : parseInt( $item.data( 'x' ) ) * .88,
						y      = qodefAddonsCore.windowWidth > 1024 ? parseInt( $item.data( 'y' ) ) : undefined;

					var offsets = {
						'top': (y || 50) + '%',
						'left': (x || 50) + '%',
					};

					// $item.css( offsets );
					$inner.css(
						'transform',
						'translateX(' + parseInt( isNaN( x ) ? -50 : 0 ) + '%) translateY(' + parseInt( isNaN( y ) ? -50 : 0 ) + '%)'
					);
				}
			);
		},
		offScreen: function ( $item ) {
			return $item.offset().top <= -$item.height() * 0.97;
		},
		showEndOfScroll: function ( $currentItem, $mainTextHolder ) {
			qodefStacked.endOfScrollVisible = true;
			$mainTextHolder.addClass( 'qodef--visible' );
			$currentItem.addClass( 'qodef--eos' );
		},
		hideEndOfScroll: function ( $currentItem, $mainTextHolder ) {
			qodefStacked.endOfScrollVisible = false;
			$mainTextHolder.removeClass( 'qodef--visible' );
			$currentItem.removeClass( 'qodef--eos' );
		},
		getActiveItem: function ( $innerItems ) {
			$innerItems.removeClass( 'qodef--active' );
			return $innerItems.filter(
				function () {
					return $( this ).data( 'index' ) == qodefStacked.activeIndex;
				}
			);
		},
		setActiveText: function ( $textItems ) {
			$textItems.removeClass( 'qodef--active' );
			$textItems.filter(
				function () {
					return $( this ).data( 'index' ) === qodefStacked.activeIndex;
				}
			).addClass( 'qodef--active' );
		},
		movement: function ( $currentItem, $mainTextHolder, $innerItems, $textItems, $activeText ) {
			var $activeItem = $innerItems.filter(
				function () {
					return $( this ).data( 'index' ) === qodefStacked.activeIndex;
				}
			);

			if ( qodefStacked.direction === 'next' && qodefStacked.offScreen( $activeItem.find( 'img' ) ) ) {
				qodefStacked.activeIndex++;
				if ( qodefStacked.activeIndex === qodefStacked.itemsCount ) {
					qodefStacked.deltaY = 0;
				}
				qodefStacked.activeIndex = Math.min(
					qodefStacked.activeIndex,
					qodefStacked.itemsCount - 1
				);

				$activeItem = qodefStacked.getActiveItem( $innerItems );
			} else if ( qodefStacked.direction === 'prev' ) {
				if ( $activeItem.data( 'move' ) == 0 ) {
					qodefStacked.endOfScrollVisible && qodefStacked.hideEndOfScroll(
						$currentItem,
						$mainTextHolder
					);
					qodefStacked.activeIndex--;
					qodefStacked.activeIndex = Math.max(
						qodefStacked.activeIndex,
						0
					);

					$activeItem = qodefStacked.getActiveItem( $innerItems );
				}
			}

			! qodefStacked.endOfScrollVisible &&
			qodefStacked.direction === 'next' &&
			qodefStacked.activeIndex === qodefStacked.itemsCount - 1 &&
			Math.abs( $activeItem.data( 'move' ) ) > $activeItem.find( 'img' ).height() * 0.1 &&
			qodefStacked.showEndOfScroll(
				$currentItem,
				$mainTextHolder
			);

			$activeText.data( 'index' ) !== qodefStacked.activeIndex && qodefStacked.setActiveText( $textItems );

			$activeItem
			.addClass( 'qodef--active' )
			.data(
				'move',
				Math.min(
					$activeItem.data( 'move' ) + qodefStacked.deltaY,
					0
				)
			)
			.css(
				'transform',
				'translate3d(0,' + Math.round( $activeItem.data( 'move' ) - $activeItem.data( 'buffer' ) * 0.2 ) + 'px,0)'
			)
			.data(
				'buffer',
				Math.abs( $activeItem.data( 'move' ) )
			);
		},
		mouseWheel: function ( e, $currentItem, $mainTextHolder, $innerItems, $textItems, $activeText ) {
			qodefStacked.direction = -e.originalEvent.deltaY < 0 ? 'next' : 'prev';
			qodefStacked.deltaY    = -e.originalEvent.deltaY;
			if ( Math.abs( qodefStacked.deltaY ) == 3 ) {
				qodefStacked.deltaY = qodefStacked.deltaY * 10; //ffox
			}
			qodefStacked.movement(
				$currentItem,
				$mainTextHolder,
				$innerItems,
				$textItems,
				$activeText
			);
		},
		mouseMove: function ( e, $innerItems ) {
			qodefStacked.tX = 0.5 - e.screenX / qodefAddonsCore.windowWidth;
			qodefStacked.tY = 0.5 - e.screenY / qodefAddonsCore.windowHeight;
			$innerItems.each(
				function ( i ) {
					var $img = $( this ).find( 'img' ),
						valX = Math.round( qodefStacked.tX * qodefStacked.tilt * (i + 1) ),
						valY = Math.round( qodefStacked.tY * qodefStacked.tilt * (i + 1) );

					$img.css(
						'transform',
						'translateX(' + valX + 'px) translateY(' + valY + 'px)'
					);
				}
			);
		},
		touchStart: function ( e, $currentItem ) {
			$currentItem.data(
				'y-start',
				parseInt( e.changedTouches[0].clientY )
			);
		},
		touchMove: function ( e, $currentItem, $mainTextHolder, $innerItems, $textItems, $activeText ) {
			$currentItem.data(
				'y-end',
				parseInt( e.changedTouches[0].clientY )
			);
			qodefStacked.deltaY    = $currentItem.data( 'y-end' ) - $currentItem.data( 'y-start' );
			qodefStacked.direction = qodefStacked.deltaY < 0 ? 'next' : 'prev';
			qodefStacked.deltaY    = Math.min(
				Math.max(
					qodefStacked.deltaY,
					-90
				),
				100
			);
			qodefStacked.movement(
				$currentItem,
				$mainTextHolder,
				$innerItems,
				$textItems,
				$activeText
			);
		},
		fixedInfo: function ( $currentItem, $innerItems, touch = false ) {
			var $cursor = $currentItem.find( '.qodef-m-hover-text' );

			var moveInfo = function ( x, y ) {
				x += 5;//to move box a bit, so mouse doesn't go over it and make it blink
				y += 5;//to move box a bit, so mouse doesn't go over it and make it blink
				$cursor.css(
					{
						'transform': 'translate3d(' + x + 'px, ' + y + 'px, 0)'
					}
				);
			};

			var handleMove = function ( e ) {
				var x = e.clientX,
					y = e.clientY;

				requestAnimationFrame(
					function () {
						moveInfo(
							x,
							y
						);
					}
				);
			};

			var changeInfo = function ( e ) {
				if ( ! touch ) {
					var index = $( e.currentTarget ).closest( $innerItems ).data( 'index' );
				} else {
					//to take the index od next item, in order for visible title to be related to most visible element
					// var index = $( e.currentTarget ).find( '.qodef-e-item.qodef--active' ).next().data( 'index' );
					var index = $( e.currentTarget ).find( '.qodef-e-item.qodef--active' ).data( 'index' );
				}

				if ( $cursor.data( 'active' ) !== index ) {
					var $activeItem = $innerItems.filter(
						function () {
							return $( this ).data( 'index' ) === index;
						}
					),
						titleText   = $activeItem.find( '.qodef-e-cursor-text' ).html();

					$cursor.data(
						'active',
						index
					)
					.addClass( 'qodef--show' );

					$cursor.find( '.qodef-m-hover-title-holder' ).html( titleText );
				}
			};

			var hideInfo = function ( e ) {
				$cursor
				.data(
					'active',
					null
				)
				.removeClass( 'qodef--show' );
			};

			if ( ! touch ) {
				$currentItem.on(
					'mousemove',
					handleMove
				);
				$currentItem.on(
					'mousemove',
					'img',
					changeInfo
				);
				$currentItem.on(
					'mouseleave',
					'img',
					hideInfo
				);
			} else {
				$currentItem.on(
					'touchmove',
					changeInfo
				);
			}
		}
	};

	qodefAddonsPremiumCore.shortcodes.qi_addons_for_elementor_premium_stacked_item_scroll.qodefStacked = qodefStacked;

})( jQuery );

(function ( $ ) {
	'use strict';

	qodefAddonsPremiumCore.shortcodes.qi_addons_for_elementor_premium_typeforms_form = {};

	// $( document ).ready(
	// 	function () {
	// 		qodefTypeform.init();
	// 	}
	// );

	var qodefTypeform = {
		init: function () {
			this.holder = $( '.qodef-qi-typeforms-form' );
			if ( this.holder.length ) {
				this.holder.each(
					function () {
						qodefTypeform.initItem( $( this ) );
					}
				);
			}
		},
		initItem: function ( $thisHolder ) {
			var data = $thisHolder.find( '.qodef-m-content > div' ).attr('data-tf-widget');

			window.tf.createWidget(	data, { container: $thisHolder.find( '.qodef-m-content > div' ) } );
		},
	};

	qodefAddonsPremiumCore.shortcodes.qi_addons_for_elementor_premium_typeforms_form.qodefTypeform = qodefTypeform;

})( jQuery );

(function ( $ ) {
	'use strict';

	qodefAddonsPremiumCore.shortcodes.qi_addons_for_elementor_premium_vertical_circled_slider = {};

	$( document ).ready(
		function () {
			qodefVerticalCircledSlider.init();
		}
	);

	var qodefVerticalCircledSlider = {
		init: function () {
			this.sliders = $( '.qodef-qi-vertical-circled-slider' );

			if ( this.sliders.length ) {
				this.sliders.each(
					function () {
						qodefVerticalCircledSlider.initItem( $( this ) );
					}
				);
			}
		},
		initItem: function( $currentItem ) {
			qodefAddonsCore.qodefSwiperElementorCheck.init( qodefVerticalCircledSlider.initSwiperReinit, $currentItem );
		},
		initSwiperReinit: function ( $currentItem ) {
			qodefVerticalCircledSlider.setWidth( $currentItem );

			var $mainSlider = $currentItem.find( '.qodef-qi-swiper-container:not(.qodef-vertical-circled-slider-text)' ),
				$textSlider = $currentItem.find( '.qodef-qi-swiper-container.qodef-vertical-circled-slider-text' ),
				textSliderOptions,
				numItemsMain,
				autoplay    = $mainSlider[0].swiper.autoplay.running;

			numItemsMain                      = $mainSlider.find( '.swiper-slide' ).length;
			textSliderOptions                 = $textSlider[0].swiper.params;
			textSliderOptions['loopedSlides'] = numItemsMain;//real number of slides should be the same on both sides because of controller
			textSliderOptions['autoplay']     = 'false';

			$mainSlider[0].swiper.autoplay.stop();
			$textSlider[0].swiper.destroy();

			let $swiperDeviceNew = new Swiper(
				$textSlider[0],
				Object.assign( textSliderOptions )
			);

			$mainSlider[0].swiper.controller.control = $swiperDeviceNew;
			$mainSlider[0].swiper.controller.by      = 'slide';
			$mainSlider[0].swiper.controller.inverse = true;
			$swiperDeviceNew.controller.control      = $mainSlider[0].swiper;
			$mainSlider[0].swiper.on(
				'resize',
				function () {
					qodefVerticalCircledSlider.setWidth( $currentItem );
				}
			);

			if ( autoplay ) {
				$mainSlider[0].swiper.autoplay.start();
			}
			$currentItem.addClass( 'qodef--visible' );
		},
		setWidth: function ( $currentItem ) {
			if ( $currentItem.hasClass( 'qodef--slider-circle-image' ) ) {

				var currentWidth    = 0;
				var currentHeight   = 0;
				var currentMinValue = 0;
				var $item           = $currentItem.find( '.qodef-qi-swiper-container:not(.qodef-vertical-circled-slider-text) .qodef-e' );

				if ( $item.length ) {
					currentHeight = $item.outerHeight();
					currentWidth  = $item.outerWidth();

					if ( currentWidth > currentHeight ) {
						currentMinValue = currentHeight;
					} else {
						currentMinValue = currentWidth;
					}

					$item.find( 'img' ).css(
						'width',
						currentMinValue
					);
					$item.find( 'img' ).css(
						'height',
						currentMinValue
					);
				}
			}
		}
	};

	qodefAddonsPremiumCore.shortcodes.qi_addons_for_elementor_premium_vertical_circled_slider.qodefSwiper                = qodefAddonsCore.qodefSwiper;
	qodefAddonsPremiumCore.shortcodes.qi_addons_for_elementor_premium_vertical_circled_slider.qodefVerticalCircledSlider = qodefVerticalCircledSlider;

})( jQuery );

(function ( $ ) {
	'use strict';

	qodefAddonsPremiumCore.shortcodes.qi_addons_for_elementor_premium_textual_projects_showcase = {};

	$( document ).ready(
		function () {
			qodefTextualProjectsShowcase.init();
		}
	);

	var qodefTextualProjectsShowcase = {
		init: function () {
			var $holder = $( '.qodef-textual-projects-showcase .qodef--highlight svg' );

			if ( $holder.length ) {
				$holder.each(
					function () {
						var $thisHolder = $( this );

						qodefAddonsCore.qodefIsInViewport.check(
							$thisHolder,
							function () {
								$thisHolder.addClass( 'qodef-animation-init' );
							}
						);
					}
				);
			}
		}
	};

	qodefAddonsPremiumCore.shortcodes.qi_addons_for_elementor_premium_textual_projects_showcase.qodefTextualProjectsShowcase = qodefTextualProjectsShowcase;
	qodefAddonsPremiumCore.shortcodes.qi_addons_for_elementor_premium_textual_projects_showcase.qodefAppear                  = qodefAddonsCore.qodefAppear;

})( jQuery );

(function ( $ ) {
	'use strict';

	qodefAddonsPremiumCore.shortcodes.qi_addons_for_elementor_premium_vertical_project_reel = {};

	$( window ).on(
		'load',
		function () {
			qodefVerticalProjectReel.init();
		}
	);

	var qodefVerticalProjectReel = {
		init: function () {
			var $holder = $( '.qodef-qi-vertical-project-reel' );

			if ( $holder.length ) {
				$holder.each(
					function ( index ) {
						$( this ).closest( '#qodef-page-wrapper' ).css(
							'overflow',
							'visible'
						);

						qodefVerticalProjectReel.calculateSticky( $( this ) );
						qodefVerticalProjectReel.initItem( $( this ), index );
					}
				);
			}
		},
		calculateSticky: function ( $thisHolder ) {
			var $items    = $thisHolder.find( '.qodef-e-item' ),
				height = 0,
				currentHeight = 0;

			if ( $items.length ) {
				$items.each(
					function () {
						currentHeight = $( this ).outerHeight();

						if ( currentHeight > height) {
							height = currentHeight;
						}
					}
				);

				$thisHolder.find( '.qodef-qi-vertical-project-reel-left' ).css( {
					'min-height': height,
					'top': 'calc(50% - ' + (height / 2) + 'px )',
				} );
			}
		},
		initItem: function( $thisHolder, index ) {
			var $items    = $thisHolder.find( '.qodef-e-item' ),
				$images   = $thisHolder.find( '.qodef-qi-vertical-project-reel-right .qodef-e-image' ),
				scrollPos = 0,
				$imageInView,
				$activeimage;

			$( $items[0] ).addClass( 'qodef--active' );
			$images.each(
				function () {
					var $image = $( this );
					qodefVerticalProjectReel.itemInView( $image );
					qodefAddonsCore.qodefIsInViewport.check(
						$image,
						function () {
							if ( ! $image.hasClass( 'qodef--appeared' ) ) {
								$image.addClass( 'qodef--appeared' );
							}
						}
					);
				}
			);

			qodefVerticalProjectReel.initImageDistort(
				$thisHolder,
				index
			);

			$( window ).on(
				'scroll',
				function () {

					$images.each(
						function () {
							qodefVerticalProjectReel.itemInView( $( this ) );
						}
					);

					$imageInView = $images.filter( '.qodef-in-view' );

					if ( $imageInView.length ) {
						$items.removeClass( 'qodef--active' );

						if ( (document.body.getBoundingClientRect()).top < scrollPos ) { //if scrolling down
							$activeimage = $imageInView.last();
						} else {
							$activeimage = $imageInView.first();
						}

						var activeimageIndex = $images.index( $activeimage );

						$items.eq( activeimageIndex ).addClass( 'qodef--active' );

						// saves the new position for iteration.
						scrollPos = (document.body.getBoundingClientRect()).top;
					}
				}
			);

		},
		itemInView: function( element ) {
			if ( qodefAddonsCore.scroll > element.offset().top - (0.67 * qodefAddonsCore.windowHeight) && qodefAddonsCore.scroll < element.offset().top + element.height() ) {
				if ( ! element.hasClass( 'qodef-in-view' ) ) {
					element.addClass( 'qodef-in-view' );
				}
			} else {
				if ( element.hasClass( 'qodef-in-view' ) ) {
					element.removeClass( 'qodef-in-view' );
				}
			}
		},
		initImageDistort: function ( $holder, index ) {
			var $items = $holder.find( '.qodef-qi-vertical-project-reel-right .qodef-e-image' );

			if ( $items.length ) {
				$items.each(
					function ( itemIndex ) {
						var $item             = $( this ),
							$itemImage        = $item.find( 'img' ),
							$itemTitle	      = $holder.find( '.qodef-qi-vertical-project-reel-left .qodef-e-item' ).eq( itemIndex ).find( '.qodef-e-title-link' ),
							$filterId         = 'qodef-vertical-project-svg-distort-' + index + '-' + itemIndex,
							$distortFilterSvg = '<svg class="qodef-svg-distort-filter" width="100%" height="100%">' +
								'<filter id=' + $filterId + ' x="-25%" y="-25%" width="150%" height="150%">' +
								'<feTurbulence type="fractalNoise" baseFrequency="0.02 0.01" numOctaves="2" seed="2" result="warp" result="warp" />' +
								'<feDisplacementMap xChannelSelector="R" yChannelSelector="G" scale="0" in="SourceGraphic" in2="warp" />' +
								'</filter></svg>';

						$itemImage.clone().addClass( 'qodef--distort-img-clone' ).insertAfter( $itemImage );
						$itemImage.after( $distortFilterSvg );

						var $itemCloneImage       = $item.find( '.qodef--distort-img-clone' ),
							$svg                  = $item.find( '.qodef-svg-distort-filter' ),
							$filter               = $svg.find( 'filter' ),
							$displacementMap      = $filter.find( 'feDisplacementMap' )[0],
							$displacementMapScale = { val: 0 };

						var $distortTl = gsap.timeline(
							{
								paused: true,
								defaults: {
									duration: 0.8,
									ease: 'power1.inOut',
								},
								onStart: () => {
									gsap.set(
										$itemCloneImage,
										{
											filter: 'url(#' + $filterId + ')',
										}
									);
								},
								onReverseComplete: () => {
									gsap.set(
										$itemCloneImage,
										{
											filter: 'none',
										}
									);
								},
								onUpdate: () => {
									$displacementMap.setAttribute(
										'scale',
										$displacementMapScale.val
									);
								}
							}
						);

						$distortTl.to(
							$displacementMapScale,
							{
								startAt: {
									val: 0
								},
								val: 100,
							},
							0
						);

						$item[0].addEventListener(
							'mouseenter',
							function () {
								$distortTl.restart();
							}
						);
						$item[0].addEventListener(
							'mouseleave',
							function () {
								$distortTl.reverse();
							}
						);

						if ( $itemTitle.length ) {
							$itemTitle[0].addEventListener(
								'mouseenter',
								function () {
									$distortTl.restart();
								}
							);
							$itemTitle[0].addEventListener(
								'mouseleave',
								function () {
									$distortTl.reverse();
								}
							);
						}
					}
				);
			}
		},
	};

	qodefAddonsPremiumCore.shortcodes.qi_addons_for_elementor_premium_vertical_project_reel.qodefVerticalProjectReel = qodefVerticalProjectReel;

})( jQuery );

(function ( $ ) {
	'use strict';

	var shortcode = 'qi_addons_for_elementor_premium_blog_list_premium';

	qodefAddonsPremiumCore.shortcodes[shortcode] = {};

	$( window ).load(
		function () {
			qodefBlogListPremium.init();
		}
	);

	$( window ).resize(
		function () {
			qodefBlogListPremium.init();
		}
	);
	$( document ).on(
		'qi_addons_for_elementor_premium_trigger_get_new_posts',
		function ( e, $holder ) {
			if ( $holder.hasClass( '.qodef-qi-blog-list-premium' ) ) {
				qodefBlogListPremium.initItem( $holder );
				$holder.find( '.qodef-grid-inner' ).isotope( 'reloadItems' ).isotope( { sortBy: 'original-order' } );
			}
		}
	);

	$( window ).on(
		'elementor/frontend/init',
		function () {
			if ( elementorFrontend.isEditMode() ) {
				elementor.channels.editor.on(
					'change',
					function ( e ) {
						var id         = e.options.container.args.id,
							$shortcode = $( '.elementor-element-' + id + ' .qodef-qi-blog-list-premium' );

						if ( $shortcode.length ) {
							qodefBlogListPremium.initMasonry( $shortcode );
						}
					}
				);
			}
		}
	);

	/**
	 * Resize oembed iframes
	 */
	var qodefBlogListPremium = {
		init: function () {
			var $holder = $( '.qodef-qi-blog-list-premium' );

			if ( $holder.length ) {
				$holder.each(
					function () {

						qodefBlogListPremium.initItem( $( this ) );
					}
				);
			}
		},
		initItem: function( $currentItem ) {
			qodefBlogListPremium.initMasonry( $currentItem );
		},
		doubleItem: function ( $holder ) {
			var $doubleItems       = $holder.find( '.qodef-blog-item.qodef-item--double' ),
				$masonrySizer      = $holder.find( '.qodef-qi-grid-masonry-sizer' ),
				masonryItemSizeGap = parseInt( $holder.find( '.qodef-grid-inner' ).css( 'column-gap' ) );

			if ( $doubleItems.length ) {
				$doubleItems.each(
					function () {
						var sizerWidth  = $masonrySizer.outerWidth(),
							holderWidth = $holder.width(),
							width       = sizerWidth === holderWidth ? sizerWidth : sizerWidth * 2 + masonryItemSizeGap;

						$( this ).css( 'width', width );
					}
				);
			}
		},
		initMasonry: function( $holder ) {
			var $masonry           = $holder.find( '.qodef-grid-inner' ),
				$masonryItem       = $masonry.find( '.qodef-grid-item' ),
				$masonryItemSize   = $masonry.find( '.qodef-qi-grid-masonry-sizer' ).width(),
				masonryItemSizeGap = parseInt( $masonry.css( 'column-gap' ) );

			$masonryItem.css(
				'width',
				$masonryItemSize
			);

			qodefBlogListPremium.doubleItem( $holder );

			if ( $holder.hasClass( 'qodef--same-height' ) ) {
				qodefBlogListPremium.calcHeight( $holder );
			}

			qodefAddonsCore.qodefWaitForImages.check(
				$masonry,
				function () {
					if ( typeof $masonry.isotope === 'function' ) {

						$masonry.isotope(
							{
								layoutMode: 'packery',
								itemSelector: '.qodef-grid-item',
								percentPosition: true,
								packery: {
									columnWidth: '.qodef-qi-grid-masonry-sizer',
									gutter: masonryItemSizeGap,
								}
							}
						);
					}

					$masonry.addClass( 'qodef--masonry-init' );
				}
			);
		},
		calcHeight: function ( $holder ) {
			var $items = $holder.find( '.qodef-blog-item' ),
				height = 0;

			if ( $items.length ) {
				$items.each(
					function () {
						var currentHeight = $( this ).find( '.qodef-e-inner' ).height();

						if ( currentHeight > height ) {
							height = currentHeight;
						}
					}
				);

				$items.css( 'height', height );
			}
		}
	};

	qodefAddonsPremiumCore.shortcodes[shortcode].qodefLightboxPopup   = qodefAddonsCore.qodefLightboxPopup;
	qodefAddonsPremiumCore.shortcodes[shortcode].qodefBlogListPremium = qodefBlogListPremium;

})( jQuery );

(function ( $ ) {
	'use strict';

	var shortcode = 'qi_addons_for_elementor_product_comparison';

	qodefAddonsCore.shortcodes[shortcode] = {};

	$( document ).ready(
		function () {
			changeViewCart.init();
		}
	);

	var changeViewCart = {
		init: function() {
			this.holder = $( '.qodef-qi-woo-shortcode-product-comparison' );

			if ( this.holder.length ) {
				this.holder.each(
					function () {
						changeViewCart.initItem( $( this ) );
					}
				);
			}
		},
		initItem: function ( $currentItem ) {
			qodefAddonsCore.shortcodes.qi_addons_for_elementor_add_to_cart_button.changeViewCart.initItem( $currentItem );
		}
	};

	qodefAddonsCore.shortcodes.qi_addons_for_elementor_product_comparison.changeViewCart = changeViewCart;
	qodefAddonsCore.shortcodes.qi_addons_for_elementor_product_comparison.qodefButton    = qodefAddonsCore.qodefButton;

})( jQuery );

(function ( $ ) {
	'use strict';

	$( document ).on(
		'qi_addons_for_elementor_premium_trigger_get_new_posts',
		function ( e, $holder ) {
			qodefAddonsCore.shortcodes.qi_addons_for_elementor_product_list.changeViewCart.initItem( $holder );
			qodefAddonsCore.shortcodes.qi_addons_for_elementor_product_list.qodefProductListSwap.initItem( $holder );
		}
	);

})( jQuery );

(function ( $ ) {
	'use strict';
	qodefAddonsPremiumCore.shortcodes.qi_addons_for_elementor_premium_premium_button = {};

	$( document ).ready(
		function () {
			qodefSvgButtonAnimation.init();
		}
	);

	var qodefSvgButtonAnimation = {
		init: function () {
			this.holder = $( '.qodef-qi-premium-button.qodef-layout--svg' );

			if ( this.holder.length ) {
				this.holder.each(
					function () {
						qodefSvgButtonAnimation.initItem( $( this ) );
					}
				);
			}
		},
		initItem: function ( $currentItem ) {
			if ( $currentItem.hasClass( 'qodef-hover--svg-follow-mouse' ) && qodefAddonsCore.windowWidth > 1024 ) {
				qodefSvgButtonAnimation.initFollowCursorSvg( $currentItem );
			} else if ( $currentItem.hasClass( 'qodef-hover--svg-float' ) && qodefAddonsCore.windowWidth > 1024 ) {
				qodefSvgButtonAnimation.initFloatSvg( $currentItem );
			}
		},
		initFollowCursorSvg: function ( $currentItem ) {
			var $svg       = $currentItem.find( 'svg' )[0],
				limitMoveX = 15,
				limitMoveY = 10;

			function bound( number, min, max ) {
				return Math.max(
					Math.min(
						number,
						max
					),
					min
				);
			}

			function moveItem( e ) {
				var offsetleft = e.clientX - $currentItem[0].getBoundingClientRect().left - $currentItem.width() / 2;
				var offsetTop  = e.clientY - $currentItem[0].getBoundingClientRect().top - $currentItem.height() / 2;

				gsap.to(
					$svg,
					{
						x: bound(
							offsetleft,
							-limitMoveX,
							limitMoveX
						),
						y: bound(
							offsetTop,
							-limitMoveY,
							limitMoveY
						),
						duration: 1.2,
						ease: 'power1.easeOut',
					}
				);
			}

			$currentItem.on(
				'mousemove',
				function ( e ) {
					moveItem( e );
				}
			);

			$currentItem.mouseleave(
				function () {
					gsap.to(
						$svg,
						{
							y: 0,
							x: 0,
							duration: 1,
							ease: 'power2.easeOut',
							overwrite: true
						}
					);
				}
			);
		},
		initFloatSvg: function ( $currentItem ) {
			var $svg           = $currentItem.find( 'svg' )[0],
				timelinePaused = true;

			var floatTl = gsap.timeline(
				{
					paused: true,
					ease: 'power1.easeOut',
					onComplete: () => {
						if ( ! timelinePaused ) {
							floatTl.restart();
						}
					},
				}
			);

			floatTl
			.to(
				$svg,
				{
					keyframes: [
						{ x: 12, y: -5, duration: 0.75 },
						{ x: 9, y: -9, duration: 0.4 },
						{ x: 5, y: -7, duration: 0.4 },
						{ x: 3, y: -4, duration: 0.35 },
						{ x: 0, y: 0, duration: 0.6 },
					]
				}
			);

			floatTl.timeScale( 1.6 );//speed up 1.2X

			$currentItem.mouseenter(
				function () {
					timelinePaused = false;
					floatTl.restart();
				}
			);
			$currentItem.mouseleave(
				function () {
					timelinePaused = true;
					floatTl.pause();
					gsap.to(
						$svg,
						{
							y: 0,
							x: 0,
							duration: .5,
							ease: 'power2.easeOut',
						}
					);
				}
			);
		}
	};

	qodefAddonsPremiumCore.shortcodes.qi_addons_for_elementor_premium_premium_button.qodefSvgButtonAnimation = qodefSvgButtonAnimation;

})( jQuery );
