var vc_iframe = vc_iframe || {}
!function ( $ ) {
	'use strict'
	var PENCI = PENCI || {}
	PENCI.sticky = {
		init: function () {

			PENCI.sticky.stickySidebar()
			PENCI.sticky.headerSticky()
			PENCI.sticky.headerMobileSticky()

			$( window ).on( 'resize', function () {
				$( '.site-header' ).unstick()

				PENCI.sticky.headerSticky()

				if ( !$( '.penci-header-mobile' ).hasClass( 'mobile' ) ) {
					$( '.penci-header-mobile' ).unstick()
					PENCI.sticky.headerMobileSticky()
				}
			} )
		},


		headerSticky: function () {
			if ( !$( 'body' ).hasClass( 'header-sticky' ) || !$().sticky || $( window ).width() < 1024 ) {
				return
			}

			$( '.site-header' ).sticky( {
				topSpacing: (
					$( '#wpadminbar' ).length ? $( '#wpadminbar' ).height() : 0
				),
			} )
		},
		headerMobileSticky: function () {

			if ( !$( 'body' ).hasClass( 'header-sticky' ) || !$().sticky || $( window ).width() > 1024 ) {
				return false
			}
			var offset = $( '#wpadminbar' ).length && $( window ).width() > 480 ? $( '#wpadminbar' ).height() : 0

			$( '.penci-header-mobile' ).sticky( {
				topSpacing: offset,
				className: 'mobile-is-sticky',
				wrapperClassName: 'mobile-sticky-wrapper',
			} )

			return false
		},
		stickySidebar: function () {

			if ( !$( 'body' ).hasClass( 'penci_sticky_content_sidebar' ) || !$().theiaStickySidebar || $( window ).width() < 992 ) {
				return false
			}

			var top_margin = $( '.site-header' ).data( 'height' )

			$( '.penci-sticky-sidebar, .penci-sticky-content, .penci_vc_sticky_sidebar .penci-content-main, .penci_vc_sticky_sidebar .widget-area' ).theiaStickySidebar( {
				// settings
				additionalMarginTop: top_margin,
				additionalMarginBottom: 0,
			} )
		},
	}
	PENCI.penciVideo = function () {

		if ( $().magnificPopup ) {
			$( '.penci-popup-video' ).magnificPopup( {
				type: 'iframe',
				mainClass: 'mfp-fade',
			} )
		}

	}
	PENCI.toggleSocialMedia = function () {
		var $socialToggle = $( '.social-buttons__toggle' ),
			socialButtons = $( '.penci-block-vc .social-buttons' )

		$socialToggle.on( 'click', function ( e ) {
			e.preventDefault()

			socialButtons.removeClass( 'active' )

			var socailMedia = $( this ).closest( '.social-buttons' )

			if ( socailMedia.hasClass( 'active' ) ) {
				socailMedia.addClass( 'pbutton_close_click' ).removeClass( 'active' )

				setTimeout( function () {
					socailMedia.removeClass( 'pbutton_close_click' )
				}, 400 )
			}
		} )

		$( '#page' ).on( 'click', function ( e ) {

			if ( socialButtons.hasClass( 'active' ) ) {
				socialButtons.removeClass( 'active' )
			}
		} )

		$socialToggle.on( 'mouseover touchstart', function () {
			var $this = $( this ),
				parent = $this.parent()

			if ( parent.hasClass( 'active' ) ) {
				return false
			}

			socialButtons.removeClass( 'active' )
			parent.addClass( 'active' )

		} )
	}
	PENCI.popupGallery = function () {
		if ( !$().magnificPopup ) {
			return false
		}

		$( '.penci-image-popup-no-margins' ).magnificPopup( {
			type: 'image',
			closeOnContentClick: true,
			closeBtnInside: false,
			fixedContentPos: true,
			mainClass: 'mfp-no-margins mfp-with-zoom', // class to remove default margin from left and right side
			image: {
				verticalFit: true,
			},
			zoom: {
				enabled: true,
				duration: 300, // don't foget to change the duration also in CSS
			},
		} )

		$( '.popup-gallery-slider a' ).magnificPopup( {
			type: 'image',
		} )


		$( '.penci-popup-gallery' ).each( function () {
			var $this = $( this ),
				id = $this.attr( 'id' )

			$( '#' + id + ' a' ).magnificPopup( {
				type: 'image',
				closeOnContentClick: true,
				closeBtnInside: false,
				fixedContentPos: true,
				image: {
					verticalFit: true,
				},
				gallery: {
					enabled: true,
				},
				zoom: {
					enabled: false,
					duration: 300,
				},
			} )
		} )
	}
	PENCI.ajaxDoBlockRequest = {
		// Init the module
		init: function () {
			PENCI.ajaxDoBlockRequest.link()
			PENCI.ajaxDoBlockRequest.nextPrev()
			PENCI.ajaxDoBlockRequest.loadMore()
			PENCI.ajaxDoBlockRequest.infinityScroll()
			PENCI.ajaxDoBlockRequest.megamenu()
		},
		megamenu: function () {

			$( 'body' ).on( 'click', '.penci-mega-pag', function ( event ) {
				event.preventDefault()

				if ( $( this ).hasClass( 'penci-pag-disabled' ) ) {
					return false
				}

				var currentBlockObj = $( this ).data( 'block_id' ),
					$currentBlockObj = $( '#' + currentBlockObj ),
					$blockVC = $currentBlockObj.closest( '.penci-mega-row' ),
					dataFilter = $blockVC.data( 'atts_json' ),
					paged = $blockVC.attr( 'data-current' ),
					blockHeight = $currentBlockObj.height(),
					$is_cache = false

				var OBjBlockData = PENCI.ajaxDoBlockRequest.getOBjBlockData( $blockVC.attr( 'data-blockUid' ) )
				dataFilter = OBjBlockData.atts_json ? JSON.parse( OBjBlockData.atts_json ) : OBjBlockData.atts_json

				if ( $( this ).hasClass( 'penci-slider-next' ) ) {
					paged ++
				}

				if ( $( this ).hasClass( 'penci-slider-prev' ) ) {
					paged --
				}

				$blockVC.find( '.penci-block-pag' ).removeClass( 'penci-pag-disabled' )

				// Fix height block
				$currentBlockObj.css( 'min-height', blockHeight + 'px' )

				var data = {
					action: 'penci_ajax_mega_menu',
					datafilter: dataFilter,
					paged: paged.toString(),
					styleAction: 'next_prev',
					nonce: PENCILOCALIZE.nonce,
				}

				var currentBlockObjSignature = JSON.stringify( data )

				if ( PENCILOCALCACHE.exist( currentBlockObjSignature ) ) {
					var responseData = PENCILOCALCACHE.get( currentBlockObjSignature )

					$is_cache = true
					setTimeout( function () {
						$blockVC.attr( 'data-current', paged )
						$currentBlockObj.html( responseData.items ).removeClass( 'ajax-loading' )

						PENCI.ajaxDoBlockRequest.animateMegaLoadITems( $currentBlockObj, $is_cache )
						PENCI.ajaxDoBlockRequest.hidePag( $blockVC, responseData )
					}, 300 )

					return false
				}

				$currentBlockObj.addClass( 'ajax-loading' )

				$.post( PENCILOCALIZE.ajaxUrl, data, function ( response ) {
					$blockVC.attr( 'data-current', paged )


					$currentBlockObj.html( response.data.items )

					PENCI.ajaxDoBlockRequest.animateMegaLoadITems( $currentBlockObj, $is_cache )
					PENCI.ajaxDoBlockRequest.hidePag( $blockVC, response.data )
					PENCI.ajaxDoBlockRequest.saveAjaxData( currentBlockObjSignature, response.data )
				} )

				// Save items page 1 of block
				if ( 1 === paged - 1 ) {

					var dataFirstItems = {
						action: 'penci_ajax_mega_menu',
						datafilter: dataFilter,
						paged: '1',
						styleAction: 'next_prev',
						nonce: PENCILOCALIZE.nonce,
					}

					$.post( PENCILOCALIZE.ajaxUrl, dataFirstItems, function ( response ) {
						PENCI.ajaxDoBlockRequest.saveAjaxData( JSON.stringify( dataFirstItems ), response.data )
					} )
				}

			} )
		},
		link: function () {
			$( '.penci-subcat-link' ).click( function ( event ) {
				event.preventDefault()

				if ( $( this ).hasClass( 'active' ) ) {
					return false
				}

				var currentBlockObj = $( this ).data( 'block_id' ),
					$currentBlockObj = $( '#' + currentBlockObj ),
					$blockVC = $currentBlockObj.closest( '.penci-block-vc' ),
					blockHeight = $currentBlockObj.height(),
					$is_cache = false

				$blockVC.find( '.penci-subcat-link' ).removeClass( 'active' )
				$( this ).addClass( 'active clicked' )

				var dataFilter = $blockVC.data( 'atts_json' ),
					dataContent = $blockVC.data( 'content' ),
					filterValue = $( this ).data( 'filter_value' )

				var OBjBlockData = PENCI.ajaxDoBlockRequest.getOBjBlockData( $blockVC.attr( 'data-blockUid' ) )
				dataFilter = JSON.parse( OBjBlockData.atts_json )
				dataContent = OBjBlockData.content

				if ( filterValue ) {
					dataFilter['category_ids'] = filterValue.toString()
				}

				var data = {
					action: 'penci_ajax_block',
					datafilter: dataFilter,
					datacontent: dataContent,
					styleAction: 'link',
					nonce: PENCILOCALIZE.nonce,
				}

				// Fix height block
				$currentBlockObj.css( 'min-height', blockHeight + 'px' )

				var currentBlockObjSignature = JSON.stringify( data )

				if ( PENCILOCALCACHE.exist( currentBlockObjSignature ) ) {
					var responseData = PENCILOCALCACHE.get( currentBlockObjSignature )
					$is_cache = true
					setTimeout( function () {
						$blockVC.attr( 'data-atts_json', JSON.stringify( dataFilter ) ).attr( 'data-current', 1 )

						$currentBlockObj.html( responseData.items ).removeClass( 'ajax-loading' )

						PENCI.ajaxDoBlockRequest.animateLoadITems( $currentBlockObj, '1', $is_cache )
						PENCI.ajaxDoBlockRequest.hidePag( $blockVC, responseData )
					}, 300 )

					return false
				}

				$currentBlockObj.addClass( 'ajax-loading' )

				$.post( PENCILOCALIZE.ajaxUrl, data, function ( response ) {

					$blockVC.attr( 'data-atts_json', JSON.stringify( dataFilter ) ).attr( 'data-current', 1 )

					$currentBlockObj.html( response.data.items ).removeClass( 'ajax-loading' )

					PENCI.ajaxDoBlockRequest.animateLoadITems( $currentBlockObj, '1', $is_cache )
					PENCI.ajaxDoBlockRequest.hidePag( $blockVC, response.data )
					PENCI.ajaxDoBlockRequest.saveAjaxData( currentBlockObjSignature, response.data )
				} )

				// Save items page 1 of block
				var preFilterValue = $blockVC.find( '.penci-subcat-item-1' ).data( 'filter_value' )
				dataFilter['category_ids'] = preFilterValue ? preFilterValue.toString() : ''

				var dataFirstItems = {
					action: 'penci_ajax_block',
					datafilter: dataFilter,
					datacontent: dataContent,
					styleAction: 'link',
					nonce: PENCILOCALIZE.nonce,
				}

				var currentBlockObjFirstItems = JSON.stringify( dataFirstItems )

				if ( filterValue && !PENCILOCALCACHE.exist( currentBlockObjFirstItems ) ) {
					$.post( PENCILOCALIZE.ajaxUrl, dataFirstItems, function ( response ) {

						PENCI.ajaxDoBlockRequest.saveAjaxData( currentBlockObjFirstItems, response.data )
					} )
				}
			} )
		},
		nextPrev: function () {
			$( 'body' ).on( 'click', '.penci-block-pag', function ( event ) {
				event.preventDefault()

				var start = new Date().getTime()
				if ( $( this ).hasClass( 'penci-pag-disabled' ) ) {
					return false
				}

				var currentBlockObj = $( this ).data( 'block_id' ),
					$currentBlockObj = $( '#' + currentBlockObj ),
					$blockVC = $currentBlockObj.closest( '.penci-block-vc' ),
					dataContent = $blockVC.data( 'content' ),
					dataFilter = $blockVC.data( 'atts_json' ),
					paged = $blockVC.attr( 'data-current' ),
					filterValue = $blockVC.find( '.penci-subcat-link.active' ).data( 'filter_value' ),
					blockHeight = $currentBlockObj.height(),
					$is_cache = false


				var OBjBlockData = PENCI.ajaxDoBlockRequest.getOBjBlockData( $blockVC.attr( 'data-blockUid' ) )

				dataFilter = OBjBlockData.atts_json ? JSON.parse( OBjBlockData.atts_json ) : OBjBlockData.atts_json
				dataContent = OBjBlockData.content

				if ( filterValue ) {
					dataFilter['category_ids'] = filterValue.toString()
				}

				if ( $( this ).hasClass( 'penci-slider-next' ) ) {
					paged ++
				}

				if ( $( this ).hasClass( 'penci-slider-prev' ) ) {
					paged --
				}

				$blockVC.find( '.penci-block-pag' ).removeClass( 'penci-pag-disabled' )

				// Fix height block
				$currentBlockObj.css( 'min-height', blockHeight + 'px' )

				var data = {
					action: 'penci_ajax_block',
					datafilter: dataFilter,
					paged: paged.toString(),
					styleAction: 'next_prev',
					datacontent: dataContent,
					nonce: PENCILOCALIZE.nonce,
				}

				var currentBlockObjSignature = JSON.stringify( data )

				if ( PENCILOCALCACHE.exist( currentBlockObjSignature ) ) {

					var responseData = PENCILOCALCACHE.get( currentBlockObjSignature )
					$is_cache = true

					$blockVC.attr( 'data-current', paged )

					var content = jQuery( responseData.items )
					$currentBlockObj.html( content )

					PENCI.ajaxDoBlockRequest.animateLoadITems( $currentBlockObj, paged, $is_cache )
					PENCI.ajaxDoBlockRequest.hidePag( $blockVC, responseData )

					return false
				}

				$currentBlockObj.addClass( 'ajax-loading' )

				$.post( PENCILOCALIZE.ajaxUrl, data, function ( response ) {

					$blockVC.attr( 'data-current', paged )

					var content = jQuery( response.data.items )
					$currentBlockObj.html( content )
					PENCI.ajaxDoBlockRequest.animateLoadITems( $currentBlockObj, paged, $is_cache )
					PENCI.ajaxDoBlockRequest.hidePag( $blockVC, response.data )
					PENCI.ajaxDoBlockRequest.saveAjaxData( currentBlockObjSignature, response.data )

				} )

				// Save items page 1 of block
				if ( 1 === paged - 1 ) {

					var dataFirstItems = {
						action: 'penci_ajax_block',
						datafilter: dataFilter,
						paged: '1',
						styleAction: 'next_prev',
						datacontent: dataContent,
						nonce: PENCILOCALIZE.nonce,
					}

					$.post( PENCILOCALIZE.ajaxUrl, dataFirstItems, function ( response ) {
						PENCI.ajaxDoBlockRequest.saveAjaxData( JSON.stringify( dataFirstItems ), response.data )
					} )
				}

			} )
		},
		loadMore: function () {
			$( 'body' ).on( 'click', '.penci-block-ajax-more-button', function ( event ) {
				PENCI.ajaxDoBlockRequest.actionLoadMore( $( this ) )
			} )
		},

		infinityScroll: function () {
			var $this_scroll = $( '.penci-block-ajax-more-button.infinite_scroll' )

			if ( !$this_scroll.length ) {
				return false
			}

			$( window ).on( 'scroll', function () {
				var hT = $this_scroll.offset().top,
					hH = $this_scroll.outerHeight(),
					wH = $( window ).height(),
					wS = $( this ).scrollTop()

				if ( wS > (
					hT + hH - wH
				) ) {

					PENCI.ajaxDoBlockRequest.actionLoadMore( $this_scroll )
				}
			} ).trigger( 'scroll' )
		},
		getOBjBlockData: function ( $blockID ) {
			var $obj = new penciBlock()
			$.each( penciBlocksArray, function ( index, block ) {

				if ( block.blockID === $blockID ) {
					$obj = penciBlocksArray[index]
				}
			} )

			return $obj
		},

		actionLoadMore: function ( $this ) {

			if ( $this.hasClass( 'loading-posts' ) ) {
				return false
			}

			var mes = $this.data( 'mes' ),
				currentBlockObj = $this.data( 'block_id' ),
				$currentBlockObj = $( '#' + currentBlockObj ),
				$ajaxLoading = $currentBlockObj.find( '.penci-loader-effect' ),
				$blockVC = $currentBlockObj.closest( '.penci-block-vc' ),
				$contentItems = $currentBlockObj.find( '.penci-block_content__items' ),
				dataFilter = $blockVC.data( 'atts_json' ),
				dataContent = $blockVC.data( 'content' ),
				filterValue = $blockVC.find( '.penci-subcat-link.active' ).data( 'filter_value' ),
				paged = $blockVC.attr( 'data-current' ),
				$is_cache = false

			var OBjBlockData = PENCI.ajaxDoBlockRequest.getOBjBlockData( $blockVC.attr( 'data-blockUid' ) )
			dataFilter = JSON.parse( OBjBlockData.atts_json )
			dataContent = OBjBlockData.content

			if ( filterValue ) {
				dataFilter['category_ids'] = filterValue.toString()
			}

			paged ++

			$this.addClass( 'loading-posts' )

			var data = {
				action: 'penci_ajax_block',
				datafilter: dataFilter,
				styleAction: 'load_more',
				paged: paged,
				datacontent: dataContent,
				nonce: PENCILOCALIZE.nonce,
			}

			$.post( PENCILOCALIZE.ajaxUrl, data, function ( response ) {

				if ( response.data.items ) {

					$ajaxLoading.remove()
					$currentBlockObj.append( response.data.items ).removeClass( 'ajax-loading' )
					$this.removeClass( 'loading-posts' )

				} else {
					$this.find( '.ajax-more-text' ).text( mes )
					$this.find( 'i' ).remove()
					$this.removeClass( 'loading-posts' )
					setTimeout( function () {
						$this.parent( '.penci-ajax-more' ).remove()
					}, 1200 )
				}

				$blockVC.attr( 'data-current', paged )
				PENCI.ajaxDoBlockRequest.animateLoadITems( $currentBlockObj, paged, $is_cache )
			} )
		},

		animateLoadITems: function ( $currentBlockObj, currentPage, $is_cache ) {
			var theBlockListPostItem = $currentBlockObj.find( '.penci-block-items__' + currentPage )

			// Animate the loaded items
			theBlockListPostItem.find( '.penci-post-item' ).velocity( { opacity: 0 } )
			$currentBlockObj.removeClass( 'ajax-loading' )
			theBlockListPostItem.find( '.penci-post-item' ).velocity( 'stop' ).velocity( 'transition.slideUpIn', {
				stagger: 100,
				duration: 500,
				complete: function () {
					$currentBlockObj.attr( 'style', '' )
					PENCI.ajaxDoBlockRequest.ajaxSuccess( $currentBlockObj, $is_cache )
				},
			} )

		},
		animateMegaLoadITems: function ( $currentBlockObj, $is_cache ) {
			// Animate the loaded items
			$currentBlockObj.find( '.penci-mega-post' ).velocity( { opacity: 0 } )
			$currentBlockObj.removeClass( 'ajax-loading' )
			$currentBlockObj.find( '.penci-mega-post' ).velocity( 'stop' ).velocity( 'transition.slideUpIn', {
				stagger: 100,
				duration: 200,
				complete: function () {
					PENCI.ajaxDoBlockRequest.ajaxSuccess( $currentBlockObj, $is_cache )
					$currentBlockObj.attr( 'style', '' )
				},
			} )
		},

		hidePag: function ( $blockVC, responseData ) {

			var $pagNext = $blockVC.find( '.penci-slider-next' ),
				$pagPrev = $blockVC.find( '.penci-slider-prev' ),
				$pagination = $blockVC.find( '.penci-pagination' )

			if ( responseData.hidePagNext ) {
				$pagNext.addClass( 'penci-pag-disabled' )
				$pagination.addClass( 'penci-ajax-more-disabled' )
			} else {
				$pagNext.removeClass( 'penci-pag-disabled' )
				$pagination.removeClass( 'penci-ajax-more-disabled' )
			}

			if ( responseData.hidePagPrev ) {
				$pagPrev.addClass( 'penci-pag-disabled' )
			} else {
				$pagPrev.removeClass( 'penci-pag-disabled' )
			}
		},

		ajaxSuccess: function ( $currentBlockObj, $is_cache ) {
			if ( !$is_cache ) {
				PENCI.penciLazy()
			}

			PENCI.general.fitvids( $currentBlockObj )
			PENCI.toggleSocialMedia()
			PENCI.popupGallery()
			PENCI.penciVideo()
			PENCI.sticky.stickySidebar()
			PENCI.EasyPieChart()
		},

		saveAjaxData: function ( key, data ) {

			var dataPost = data.items
			dataPost = dataPost.replace( /data-bgset="/g, 'style="background-image: url(' )
			dataPost = dataPost.replace( /" data-delay/g, ');" data-delay' )

			$.each( data, function ( index, value ) {
				if ( 'items' === index ) {
					data[index] = dataPost
				}
			} )

			PENCILOCALCACHE.set( key, data )
		},
	}
	PENCI.sliderOwl = function ( $item ) {
		$item.each( function () {
			var $this = $( this ),
				$penciBlock = $this.closest( '.penci-block-vc' ),
				$penciNav = $penciBlock.find( '.penci-slider-nav' ),
				$customNext = $penciBlock.find( '.penci-slider-next' ),
				$customPrev = $penciBlock.find( '.penci-slider-prev' ),
				$dataStyle = $this.data( 'style' ),
				$dataItems = $this.data( 'items' ),
				$dataAutoWidth = $this.data( 'autowidth' ),
				$dataAuto = $this.data( 'auto' ),
				$dataAutoTime = $this.data( 'autotime' ),
				$dataSpeed = $this.data( 'speed' ),
				$dataLoop = $this.data( 'loop' ),
				$dataDots = $this.data( 'dots' ),
				$dataNav = $this.data( 'nav' ),
				$dataCenter = $this.data( 'center' ),
				$dataVideo = $this.data( 'video' ),
				$dataVertical = $this.data( 'vertical' ),
				$dataMagrin = $this.data( 'magrin' ),
				$lazyLoad = true,
				$dataReponsive = {}

			if ( 2 === $dataItems ) {
				$dataReponsive = {
					0: { items: 1, autoWidth: false },
					480: { items: 2 },
				}
			}

			if ( (
				     3 === $dataItems || $this.hasClass( 'penci-related-carousel' )
			     ) && 'style-27' !== $dataStyle ) {
				$dataReponsive = {
					0: { items: 1, autoWidth: false },
					480: { items: 2, autoWidth: false },
					992: { items: 3 },
				}
			}

			if ( 4 === $dataItems ) {
				$dataReponsive = {
					0: { items: 1, autoWidth: false },
					480: { items: 2, autoWidth: false },
					960: { items: 3 },
					1100: { items: 4 },
				}
			}

			if ( 'style-7' === $dataStyle ) {
				$dataReponsive = {
					0: { items: 1, autoWidth: false },
					900: { items: 1, autoWidth: true },
				}
			}

			if ( 'style-18' === $dataStyle ) {
				$dataReponsive = {
					0: { items: 1, autoWidth: false },
					768: { items: 2, autoWidth: false },
				}
			}

			if ( 'style-10' === $dataStyle ) {
				$dataReponsive = {
					0: { items: 1, autoWidth: false },
					768: { items: 1, autoWidth: false },
					690: { items: 2 },
				}
			}

			if ( 1 === $dataAutoWidth && 'style-27' !== $dataStyle && 'style-7' !== $dataStyle ) {
				$dataReponsive = {
					0: { items: 1, autoWidth: false },
					480: { items: 2 },
					768: { items: 2 },
					992: { items: 3 },
				}
			}

			var owl_args = {
				loop: 1 === $dataLoop ? false : true,
				margin: $dataMagrin,
				items: $dataItems ? $dataItems : 3,
				navSpeed: $dataSpeed,
				dotsSpeed: $dataSpeed,
				nav: 1 === $dataNav ? true : false,
				dots: 1 === $dataDots ? true : false,
				navText: ['<i class="penciicon-left-chevron"></i>', '<i class="penciicon-right-chevron"></i>'],
				autoplay: 1 === $dataAuto ? true : false,
				autoplayTimeout: $dataAutoTime,
				autoHeight: false,
				center: 1 === $dataCenter ? true : false,
				autoWidth: 1 === $dataAutoWidth ? true : false,
				autoplayHoverPause: true,
				autoplaySpeed: $dataSpeed,
				video: 1 === $dataVideo ? true : false,
				animateOut: 1 === $dataVertical ? 'fadeOutRightNewsTicker' : false,
				animateIn: 1 === $dataVertical ? 'fadeInRightNewsTicker' : false,
				lazyLoad: $lazyLoad,
				responsive: $dataReponsive,
			}

			if ( $this.hasClass( 'penci-slider-fullscreen' ) ) {
				var slideHeight = parseFloat( $( window ).height() ),
					slidewidth = parseFloat( $( window ).width() ),
					sliderRatio = slideHeight / slidewidth * 100,
					sliderRatio = sliderRatio.toFixed( 2 ) + '%'

				$this.find( '.penci-slider__item' ).css( 'padding-top', sliderRatio )
			}

			$this.imagesLoaded( { background: '.penci-slider__item' }, function () {
				$( 'body' ).trigger( 'el_featured_slider' )
			} )

			$this.on( 'initialized.owl.carousel', function ( event ) {
				PENCI.penciLazy()

				var $jarallax = $this.find( '.penci-jarallax-slider' )

				if ( $jarallax.length ) {
					$jarallax.jarallax( { elementInViewport: $this, imgPosition: '30% 50%' } )
				}
			} )

			// Go to the next item
			$customNext.click( function ( ev ) {
				ev.preventDefault()
				$this.trigger( 'next.owl.carousel' )
				return false
			} )

			// Go to the previous item
			$customPrev.click( function ( ev ) {
				ev.preventDefault()
				$this.trigger( 'prev.owl.carousel' )
				return false
			} )


		} )
	},
		PENCI.Jarallax = function () {
			if ( !$.fn.jarallax || !$( '.penci-jarallax' ).length ) {
				return false
			}

			$( '.penci-jarallax' ).each( function () {
				var $this = $( this ),
					$jarallaxArgs = {}

				if ( $this.hasClass( 'penci-jarallax-inviewport' ) ) {
					var $parent = $this.closest( '.penci-owl-featured-area' )
					$jarallaxArgs = { elementInViewport: $parent, imgPosition: '30% 50%' }
				}

				$this.imagesLoaded( { background: true }, function () {
					jarallax( $this, $jarallaxArgs )
				} )


			} )
		},
		PENCI.postLike = function () {
			$( 'body' ).on( 'click', '.penci-post-like', function ( event ) {
				event.preventDefault()
				var $this = $( this ),
					post_id = $this.data( 'post_id' ),
					like_text = $this.data( 'like' ),
					unlike_text = $this.data( 'unlike' ),
					$selector = $this.children( '.penci-share-number' )

				var $like = parseInt( $selector.text() )

				if ( $this.hasClass( 'single-like-button' ) ) {
					$selector = $( '.single-like-button .penci-share-number' )
					$this = $( '.single-like-button' )
				}

				if ( $this.hasClass( 'liked' ) ) {
					$this.removeClass( 'liked' )
					$this.prop( 'title', like_text )
					$selector.html( (
						$like - 1
					) )
				} else {
					$this.addClass( 'liked' )
					$this.prop( 'title', unlike_text )
					$selector.html( (
						$like + 1
					) )
				}

				var data = {
					action: 'penci_post_like',
					post_id: post_id,
					penci_post_like: '',
					nonce: PENCILOCALIZE.nonce,
				}

				$.post( PENCILOCALIZE.ajaxUrl, data, function ( r ) {
				} )
			} )
		}
	PENCI.gallery = function () {
		var $justified_gallery = $( '.penci-post-gallery-container.justified' )
		var $masonry_gallery = $( '.penci-post-gallery-container.masonry' )
		if ( $().justifiedGallery && $justified_gallery.length ) {
			$( '.penci-post-gallery-container.justified' ).each( function () {
				var $this = $( this )
				$this.justifiedGallery( {
					rowHeight: $this.data( 'height' ),
					lastRow: 'nojustify',
					margins: $this.data( 'margin' ),
					randomize: false,
				} )
			} ) // each .penci-post-gallery-container
		}

		if ( $().isotope && $masonry_gallery.length ) {

			$( '.penci-post-gallery-container.masonry .item-gallery-masonry' ).each( function () {
				var $this = $( this )
				if ( $this.attr( 'title' ) ) {
					var $title = $this.attr( 'title' )
					$this.children().append( '<div class="caption">' + $title + '</div>' )
				}
			} )

			if ( $masonry_gallery.length ) {
				$masonry_gallery.each( function () {
					var $this = $( this )
					$this.imagesLoaded( function () {
						// initialize isotope
						$this.isotope( {
							itemSelector: '.item-gallery-masonry',
							transitionDuration: '.55s',
							layoutMode: 'masonry',
						} )

						$this.addClass( 'loaded' )

						$( '.penci-post-gallery-container.masonry .item-gallery-masonry' ).each( function () {
							var $this = $( this )
							$this.one( 'inview', function ( event, isInView, visiblePartX, visiblePartY ) {
								$this.addClass( 'animated' )
							} ) // inview
						} )
					} )
				} ) // each
			}
		}

	}
	PENCI.EasyPieChart = function () {

		$( '.penci-review-process' ).each( function () {
			var $this = $( this ),
				$bar = $this.children(),
				$bar_w = $bar.data( 'width' ) * 10
			$this.one( 'inview', function ( event, isInView, visiblePartX, visiblePartY ) {
				$bar.animate( { width: $bar_w + '%' }, 1000 )
			} ) // bind inview
		} ) // each

		if ( !$.fn.easyPieChart || !$( '.penci-piechart' ).length ) {
			return false
		}

		$( '.penci-piechart' ).each( function () {
			var $this = $( this )
			$this.one( 'inview', function ( event, isInView, visiblePartX, visiblePartY ) {
				var chart_args = {
					barColor: $this.data( 'color' ),
					trackColor: $this.data( 'trackcolor' ),
					scaleColor: false,
					lineWidth: $this.data( 'thickness' ),
					size: $this.data( 'size' ),
					animate: 1000,
				}
				$this.easyPieChart( chart_args )
			} ) // bind inview
		} ) // each
	}

	vc_iframe.penciSliders = function ( model_id ) {
		$( 'body' ).trigger( 'el_featured_slider' )
	}
}( window.jQuery )
