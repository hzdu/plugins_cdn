(
	function ( $ ) {
		'use strict'
		var PENCI = PENCI || {}

		/* Check mobile device
	 ---------------------------------------------------------------*/
		PENCI.isMobile = function () {
			var isMobile = false
			if ( /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test( navigator.userAgent ) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test( navigator.userAgent.substr( 0, 4 ) ) ) {
				isMobile = true
			}
			return isMobile
		}

		/* Elementor Edit Mode
	---------------------------------------------------------------*/
		PENCI.elAction = function ( name, callback ) {
			$( window ).on( 'elementor/frontend/init', function () {
				if ( !elementorFrontend.isEditMode() ) {
					return
				}

				elementorFrontend.hooks.addAction( name, callback )
			} )
		}

		/* YITH Plugin loading icon
	 ---------------------------------------------------------------*/
		PENCI.yith = function () {
			var $list_producs = $( 'ul.products' )

			$list_producs.on( 'click', '.add_to_wishlist.single_add_to_wishlist', function ( e ) {
				var $singleBtn = $( this )
				$singleBtn.addClass( 'loading' )
			} )

			$list_producs.on( 'added_to_wishlist', function () {
				$singleBtn.removeClass( 'loading' )
			} )

			$( document ).on( 'click', '.button.yith-wcqv-button', function ( e ) {
				var $singleBtn = $( this )
				$singleBtn.addClass( 'loading' )
			} )

			$( document ).on( 'qv_loader_stop', function () {
				var $singleBtn = $( '.button.yith-wcqv-button' )
				if ( $singleBtn.hasClass( 'loading' ) ) {
					$singleBtn.removeClass( 'loading' )
				}
			} )

			$( document ).on( 'click', '.product a.compare:not(.added)', function ( e ) {
				var $singleBtn = $( this )
				$singleBtn.addClass( 'loading' )
			} )

			$( 'body' ).on( 'yith_woocompare_open_popup', function ( e, data ) {
				data.button.removeClass( 'loading' )
			} )
		}

		/* Product Image Slider
	 ---------------------------------------------------------------*/
		PENCI.productslider = function ( zoom = true, quickview = false ) {

			var $slider = $( '.penci-product-gallery-slider.splide' ),
				$thumbnail_slider = $( '.penci-thumbnail-slider.splide' ),
				$wrapper = $( '.woocommerce-product-gallery' ), $thumb_list = '.penci-thumbnail-image-wrapper',
				$gallery_list = '.penci-product-gallery-items', $rtl = false, $lazy = 'ondemand', $centerMode = true,
				slides = 3, $vertical

			$wrapper.removeClass( 'no-js' )

			if ( quickview ) {
				$thumb_list = '.quick-view-wrapper .penci-thumbnail-image-wrapper'
				$gallery_list = '.quick-view-wrapper .penci-product-gallery-items'
			}

			if ( $( 'body' ).hasClass( 'rtl' ) ) {
				$rtl = true
			}

			if ( $wrapper.hasClass( 'thumbnail-left' ) || $wrapper.hasClass( 'thumbnail-right' ) ) {
				$vertical = 'vertical'
			}

			if ( $wrapper.hasClass( 'quickview-screen' ) || $wrapper.hasClass( 'thumbnail-bottom' ) ) {
				$vertical = 'horizontal'
			}

			if ( window.matchMedia( '(max-width: 767px)' ).matches ) {
				$vertical = 'horizontal'
			}

			$thumbnail_slider.on( 'click', 'a', function ( e ) {
				e.preventDefault()
			} )

			if ( $slider.length > 0 && $thumbnail_slider.length > 0 ) {

				var $thumb_arg = {
					slidesPerView: 5,
					direction: $vertical,
					spaceBetween: 10,
					loop: true,
					slideActiveClass: 'active',
					slideToClickedSlide: true,
					breakpoints: {
						320: {
							direction: 'horizontal',
						},
						768: {
							direction: 'horizontal',
						},
						1170: {
							direction: $vertical,
						},
					},
					navigation: {
						nextEl: '.penci-custom-thumbnail-nav .penci-product-slider-next',
						prevEl: '.penci-custom-thumbnail-nav .penci-product-slider-prev',
					},
				}

				var swiper_thumbnail_list = new Swiper( $thumb_list, $thumb_arg )

				var swiper_gallery_list = new Swiper( $gallery_list, {
					slidesPerView: 1,
					loop: true,
					thumbs: {
						swiper: swiper_thumbnail_list,
					},
				} )

				if ( $('body').hasClass('rtl') ) {
					swiper_gallery_list.changeLanguageDirection( 'ltr' )
				}

			} else if ( $slider.length > 0 ) {
				var $slider_options
				if ( $slider.hasClass( 'fullwidth-container' ) || $slider.hasClass( 'fullwidth' ) ) {

					$( $gallery_list ).addClass( 'penci-owl-carousel penci-owl-carousel-slider' )


					const swiper = new Swiper( $gallery_list, {
						loop: true,
						spaceBetween: 30,
						centeredSlides: true,
						slidesPerView: 3,
						breakpoints: {
							320: {
								slidesPerView: 1, spaceBetween: 0,
							}, 768: {
								slidesPerView: 1, spaceBetween: 0, nav: false,
							}, 1170: {
								slidesPerView: 3,
							},
						},
					} )
				} else {
					const swiper = new Swiper( $gallery_list, {
						loop: true,
						spaceBetween: 0,
						slidesPerView: 1,
					} )
				}

				if ( $('body').hasClass('rtl') ) {
					swiper.changeLanguageDirection( 'ltr' )
				}
			}

			if ( zoom && $slider.length > 0 ) {
				swiper_gallery_list.on( 'slideChange', function ( e ) {

					var $slideritem = $( $gallery_list ).find( '.woocommerce-product-gallery__wrapper' ).eq( e.realIndex ).find( '.woocommerce-product-gallery__image' ),
						image = $slideritem.find( 'img' )

					if ( image.data( 'large_image_width' ) > $slideritem.width() ) {
						$slideritem.trigger( 'zoom.destroy' )
						if ( typeof $slideritem.zoom === 'function' ) {
							$slideritem.zoom()
						}
					}

				} )
			}


			$( '.variations_form' ).each( function () {
				var $this = $( this )
				$this.on( 'woocommerce_update_variation_values', function () {
					setTimeout( function () {
						if ( $thumbnail_slider.length > 0 ) {
							var $imgid = $this.attr( 'current-image' ),
								$slideitem = $slider.find( 'figure[data-attr_id=\'' + $imgid + '\']' ).data( 'slide_item' )

							if ( $slideitem !== undefined ) {
								swiper_gallery_list.slideTo( $slideitem )
							} else {
								swiper_gallery_list.slideTo( 0 )
							}
						}
					}, 100 )

				} )
			} )
		}

		/* Product Quick View
	 ---------------------------------------------------------------*/
		PENCI.quickview = function () {
			$( 'body' ).on( 'click', '.penci-quickview-button', function ( e ) {
				e.preventDefault()
				var $this = $( this ), productID = $this.data( 'pid' ), data = {
					pid: productID, action: 'penci_quickview', nonce: penciwoo.nonce,
				}

				$this.addClass( 'loading' )

				var initPopup = function ( data ) {
					var items = $( data )

					$.magnificPopup.open( {
						items: {
							src: items, type: 'inline',
						}, fixedContentPos: true, removalDelay: 500, callbacks: {
							beforeOpen: function () {
								this.st.mainClass = 'quick-view-wrapper woocommerce'
							}, open: function () {
								var $form = $( '.variations_form' )
								$form.each( function () {
									$( this ).wc_variation_form().find( '.variations select:eq(0)' ).change()
								} )
								PENCI.productslider( false, true )
								$form.trigger( 'wc_variation_form' )
							},
						},
					} )
				}

				$.ajax( {
					url: penciwoo.ajaxUrl, data: data, method: 'get', success: function ( data ) {
						initPopup( data )
					}, complete: function () {
						$this.removeClass( 'loading' )
						PENCI.swatches( '.quick-view-wrapper .variations_form' )
						PENCI.select2button()
						PENCI.loadingicon()
					},
				} )
			} )

			$(document).ready(function() {
				$(document.body).on('added_to_cart', function() {
					if (typeof $.magnificPopup !== 'undefined') {
						$.magnificPopup.close();
					}
				});
			});
		}

		/* Product Wish List
	 ---------------------------------------------------------------*/
		PENCI.wishlist = function () {
			$( document ).on( 'click', '.penci-addtowishlist:not(.added)', function ( e ) {
				e.preventDefault()
				var $this = $( this ), productID = $this.data( 'pid' ), data = {
					pid: productID, action: 'penci_add_to_wishlist', nonce: penciwoo.nonce,
				}
				$.ajax( {
					url: penciwoo.ajaxUrl, data: data, method: 'get', beforeSend: function () {
						$this.addClass( 'loading' )
					}, success: function ( response ) {
						$this.addClass( 'added' ).attr( 'href', response.data.url ).html( penciwoo.browsewishlist ).attr( 'title', penciwoo.browsewishlist ).attr( 'data-tippy-content', penciwoo.browsewishlist )
						$( '.top-search-classes.wishlist-icon .wishlist-contents > span' ).html( response.data.total )
						$( '.penci-mobile-bottom-nav li.wishlist span.current-item' ).html( response.data.total )
						PENCI.tippyContent()
						PENCI.notify( '<a href="' + response.data.item_link + '"><img class="product_image" src="' + response.data.img + '" alt=""/></a><div><a class="toast-title" href="' + response.data.item_link + '">' + response.data.title + '</a><p>' + penciwoo.addwishlist + '.</p></div>', '<div class="woocommerce notify_bottom"><a class="button wishlist_url" href="' + response.data.url + '">' + penciwoo.browsewishlist + '</a></div>', 'added_to_cart' )
					}, complete: function () {
						$this.removeClass( 'loading' )
					},
				} )
			} )

			$( document ).on( 'click', '.penci-removewishlist', function ( e ) {
				e.preventDefault()
				var $this = $( this ), productID = $this.data( 'pid' ), data = {
					pid: productID, action: 'penci_remove_wishlist_item', nonce: penciwoo.nonce,
				}
				$.ajax( {
					url: penciwoo.ajaxUrl, data: data, method: 'get', beforeSend: function () {
						$this.addClass( 'loading' )
					}, success: function ( response ) {
						$( '.top-search-classes.wishlist-icon .wishlist-contents > span' ).html( response.data.total )
						$( '.penci-mobile-bottom-nav li.wishlist span.current-item' ).html( response.data.total )
						var $container = $( '.penci-custom-products' )
						if ( 0 === response.data.total ) {
							$container.append( '<div class="penci-wishlist-products-empty-text"><h3 class="penci-wishlist-empty-title">' + penciwoo.wishlist_empty_heading + '</h3>' + penciwoo.wishlist_empty_text + '<p class="return-to-shop"><a class="button" href="' + penciwoo.shoppage + '">' + penciwoo.returnshop + '</a></p></div>' )
						}
						PENCI.notify( '<a href="' + response.data.item_link + '"><img class="product_image" src="' + response.data.img + '" alt=""/></a><div><a class="toast-title" href="' + response.data.item_link + '">' + response.data.title + '</a><p>' + penciwoo.removewishlist + '.</p></div>', ' ', 'added_to_cart' )

					}, complete: function () {
						$this.removeClass( 'loading' )
						$this.closest( 'li.product' ).remove()
					},
				} )
			} )
		}

		/* Product Compare
	 ---------------------------------------------------------------*/
		PENCI.compare = function () {
			$( 'body' ).on( 'click', '.penci-compare:not(.added)', function ( e ) {
				e.preventDefault()
				var $this = $( this ), productID = $this.data( 'pid' ), method = $this.data( 'method' ), data = {
					pid: productID, method: method, action: 'penci_add_to_compare', nonce: penciwoo.nonce,
				}
				$.ajax( {
					url: penciwoo.ajaxUrl, data: data, method: 'get', beforeSend: function () {
						$this.addClass( 'loading' )
					}, success: function ( response ) {
						var comparetext = penciwoo.addtocompare,
							compare_footer = '<div class="woocommerce notify_bottom"><a class="button compare_url" href="' + response.data.url + '">' + penciwoo.browsecompare + '</a></div>'
						if ( 'add' === method ) {
							$this.addClass( 'added' ).attr( 'href', response.data.url ).attr( 'title', penciwoo.browsecompare ).html( penciwoo.browsecompare ).attr( 'data-tippy-content', penciwoo.browsecompare )
							PENCI.tippyContent()
						} else {
							var currentId = $this.closest( '.penci-products-compare-table' )
							currentId.find( '[data-productid="' + productID + '"]' ).remove()
							comparetext = penciwoo.removecompare
							compare_footer = ''
						}
						$( '.top-search-classes.compare-icon .compare-contents > span' ).html( response.data.total )
						$( '.penci-mobile-bottom-nav li.compare span.current-item' ).html( response.data.total )
						var $container = $( '.penci-products-compare-table.woocommerce' )
						if ( 0 === response.data.total ) {
							$container.empty().append( '<div class="penci-empty-compare penci-empty-page penci-empty-page-text"><h3 class="penci-compare-empty-title">' + penciwoo.compare_empty_heading + '</h3>' + penciwoo.compare_empty_text + '</p><p class="return-to-shop"><a class="button" href="' + penciwoo.shoppage + '">' + penciwoo.returnshop + '</a></div>' )
						}
						PENCI.notify( '<a href="' + response.data.item_link + '"><img class="product_image" src="' + response.data.img + '" alt=""/></a><div><a class="toast-title" href="' + response.data.item_link + '">' + response.data.title + '</a><p>' + comparetext + '.</p></div>', compare_footer, 'added_to_cart' )
					}, complete: function () {
						$this.removeClass( 'loading' )
					},
				} )
			} )
		}

		/* Product Swatches
	 ---------------------------------------------------------------*/
		PENCI.swatches = function ( selector ) {
			$( selector ).each( function () {
				var $form = $( this )

				$form.addClass( 'swatches-support' ).on( 'click', '.swatch', function ( e ) {
					e.preventDefault()

					var $el = $( this ), $select = $el.closest( '.value' ).find( 'select' ),
						value = $el.attr( 'data-value' )

					if ( $el.hasClass( 'disabled' ) ) {
						return
					}

					// For old WC.
					$select.trigger( 'focusin' )

					// Check if this combination is available.
					if ( !$select.find( 'option[value="' + value + '"]' ).length ) {
						$el.siblings( '.swatch' ).removeClass( 'selected' )
						$select.val( '' ).change()
						$form.trigger( 'penci_no_matching_variations', [$el] )
						return
					}

					if ( $el.hasClass( 'selected' ) ) {
						$select.val( '' )
						$el.removeClass( 'selected' )
					} else {
						$el.addClass( 'selected' ).siblings( '.selected' ).removeClass( 'selected' )
						$select.val( value )
					}
					$select.change()
				} ).on( 'woocommerce_variation_select_change', function () {
					$form.addClass( 'has-selected-swatch' )
				} ).on( 'click', '.reset_variations', function () {
					$form.find( '.swatch.selected' ).removeClass( 'selected' )
					$form.find( '.swatch.disabled' ).removeClass( 'disabled' )
					$form.removeClass( 'has-selected-swatch' )
				} ).on( 'woocommerce_update_variation_values', function () {
					setTimeout( function () {
						$form.find( 'tbody tr' ).each( function () {
							var $variationRow = $( this ), $options = $variationRow.find( 'select' ).find( 'option' ),
								$selected = $options.filter( ':selected' ), values = []

							$options.each( function ( index, option ) {
								if ( option.value !== '' ) {
									values.push( option.value )
								}
							} )

							$variationRow.find( '.swatch' ).each( function () {
								var $swatch = $( this ), value = $swatch.attr( 'data-value' )

								if ( values.indexOf( value ) > - 1 ) {
									$swatch.removeClass( 'disabled' )
								} else {
									$swatch.addClass( 'disabled' )

									if ( $selected.length && value === $selected.val() ) {
										$swatch.removeClass( 'selected' )
									}
								}
							} )
						} )
					}, 100 )
				} ).on( 'penci_no_matching_variations', function () {
					window.alert( wc_add_to_cart_variation_params.i18n_no_matching_variations_text )
				} )
			} )
		}

		/* Product Quantity
	 ---------------------------------------------------------------*/
		PENCI.quantity = function () {
			if ( !String.prototype.getDecimals ) {
				String.prototype.getDecimals = function () {
					var num = this, match = (
						'' + num
					).match( /(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/ )

					if ( !match ) {
						return 0
					}

					return Math.max( 0, (
						                    match[1] ? match[1].length : 0
					                    ) - (
						                    match[2] ? + match[2] : 0
					                    ) )
				}
			}

			$( 'body' ).on( 'click', '.plus, .minus', function () {
				var $this = $( this ), $qty = $this.closest( '.quantity' ).find( '.qty' ),
					currentVal = parseFloat( $qty.val() ), max = parseFloat( $qty.attr( 'max' ) ),
					min = parseFloat( $qty.attr( 'min' ) ), step = $qty.attr( 'step' )

				if ( !currentVal || currentVal === '' || currentVal === 'NaN' ) {
					currentVal = 0
				}
				if ( max === '' || max === 'NaN' ) {
					max = ''
				}
				if ( min === '' || min === 'NaN' ) {
					min = 0
				}
				if ( step === 'any' || step === '' || step === undefined || parseFloat( step ) == 'NaN' ) {
					step = '1'
				}

				if ( $this.is( '.plus' ) ) {
					if ( max && (
						currentVal >= max
					) ) {
						$qty.val( max )
					} else {
						$qty.val( (
							currentVal + parseFloat( step )
						).toFixed( step.getDecimals() ) )
					}
				} else {
					if ( min && (
						currentVal <= min
					) ) {
						$qty.val( min )
					} else if ( currentVal > 0 ) {
						$qty.val( (
							currentVal - parseFloat( step )
						).toFixed( step.getDecimals() ) )
					}
				}

				$qty.trigger( 'change' )
			} )
		}

		/* Product Loop
	 ---------------------------------------------------------------*/
		PENCI.productLoop = function () {
			$( 'body' ).on( 'click', '.penci-swatch-item', function () {
				var current_swatches = $( this ), $this = $( this ).closest( '.penci-soledad-product' ),
					$imgMain = $this.find( '.penci-main-loop-image > img' ),
					$hoverImg = $this.find( '.hover-img > a img' )
				$this.addClass( 'loading-image' ).removeClass( 'active-custom-swatches' )
				$this.find( '.penci-swatch-item' ).removeClass( 'active-swatches' )
				var $variable_img_src = $( this ).data( 'image-src' ),
					$variable_img_srcset = $( this ).data( 'image-srcset' ),
					$variable_img_sizes = $( this ).data( 'image-sizes' )
				if ( $variable_img_src ) {
					$imgMain.attr( 'src', $variable_img_src ).attr( 'srcset', $variable_img_srcset ).attr( 'sizes', $variable_img_sizes ).one( 'load', function () {
						$this.removeClass( 'loading-image' ).addClass( 'active-custom-swatches' )
						current_swatches.addClass( 'active-swatches' )
					} )

					if ( $hoverImg.length > 0 ) {
						$hoverImg.attr( 'src', $variable_img_src ).attr( 'srcset', $variable_img_srcset ).attr( 'sizes', $variable_img_sizes )
					}
				}
			} )
		}

		/* Product Tippy
	 ---------------------------------------------------------------*/
		PENCI.tippyContent = function () {
			if ( PENCI.isMobile() || window.matchMedia( '(max-width: 768px)' ).matches ) {
				return false
			}

			$( '.penci-product-loop-button .button' ).each( function () {
				$( this ).attr( 'data-tippy-content', $( this ).text() )
			} )

			tippy( 'ul.products.icon-align-vertical.icon-position-top-left .penci-product-loop-button .button', {
				placement: 'right',
			} )

			tippy( 'ul.products.icon-align-vertical.icon-position-bottom-left .penci-product-loop-button .button', {
				placement: 'right',
			} )

			tippy( 'ul.products.icon-align-vertical.icon-position-top-right .penci-product-loop-button .button', {
				placement: 'left',
			} )

			tippy( 'ul.products.icon-align-vertical.icon-position-bottom-right .penci-product-loop-button .button', {
				placement: 'left',
			} )

			tippy( 'ul.products.icon-align-horizontal .penci-product-loop-button .button', {
				placement: 'top',
			} )

			tippy( '.penci-swatch-item', { placement: 'top' } )
			tippy( '.soledad-product-filter .layer-term-name.penci-tooltip', { placement: 'top' } )
		}

		/* Product Ajax Filter
	 ---------------------------------------------------------------*/

		PENCI.updateURL = function ( uri, key, value ) {
			var re = new RegExp( '([?&])' + key + '=.*?(&|$)', 'i' )
			var separator = uri.indexOf( '?' ) !== - 1 ? '&' : '?'
			if ( uri.match( re ) ) {
				return uri.replace( re, '$1' + key + '=' + value + '$2' )
			} else {
				return uri + separator + key + '=' + value
			}
		}

		PENCI.ajaxfilter = function () {

			$( document ).on( 'change', 'select.orderby', function ( event ) {
				var $form = $( this ).closest( 'form' )
				$form.find( '[name="_pjax"]' ).remove()
				$.pjax( {
					timeout: 5000, container: '#main', fragment: '#main', url: '?' + $form.serialize(),
				} )
			} )

			$( document ).on( 'change', 'select.penci-widget-layered-nav-dropdown', function ( event ) {
				var $form = $( this ).closest( 'form' ), $attr_name = $( this ).data( 'slug' ),
					$updateURL = PENCI.updateURL( window.location.href, 'filter_' + $attr_name, $( this ).val() )
				$form.find( '[name="_pjax"]' ).remove()
				$form.find( '[name="filter_' + $attr_name + '"]' ).val( this.value )
				$.pjax( {
					timeout: 5000,
					container: '.penci-woo-page-container',
					fragment: '.penci-woo-page-container',
					url: $updateURL,
				} )
			} )

			$( '.woocommerce-ordering' ).on( 'submit', function ( e ) {
				e.preventDefault( e )
			} )

			$( document ).on( 'submit', '.widget_price_filter form', function ( event ) {
				event.preventDefault( event )
				$.pjax( {
					timeout: 5000,
					container: '.penci-woo-page-container',
					fragment: '.penci-woo-page-container',
					url: '?' + $( this ).serialize(),
				} )
			} )

			$( '.penci-widget-layered-nav-dropdown-form' ).on( 'submit', function ( e ) {
				e.preventDefault( e )
			} )

			$.each( [
				'body:not(.elementor-page) a.layered-nav-link',
				'body:not(.elementor-page) .penci-products-shop-view a',
				'body:not(.elementor-page) .soledad-price-filter a',
				'body:not(.elementor-page) .penci-products-per-page a',
				'body:not(.elementor-page) .penci-widget-stock-status a',
				'body:not(.elementor-page) .widget_rating_filter a',
				'body:not(.elementor-page) .penci-active-filters a',
				'body:not(.elementor-page) .woocommerce-pagination ul li a',
			], function ( index, value ) {
				$( document ).pjax( value, {
					timeout: 10000,
					container: '.penci-woo-page-container',
					fragment: '.penci-woo-page-container',
					scrollTo: false,
				} )
			} )

			$( document ).on( 'pjax:send', function ( xhr, options ) {
				var mainClass = $( xhr.relatedTarget ), bodyClass = $( mainClass ).closest( 'body' )

				if ( ! $( 'body' ).hasClass('woocommerce') ) {
					return;
				}

				$( 'body' ).addClass( 'pre-load-content' )
				if ( penciwoo.scrolltotopajax > 0 && !bodyClass.hasClass( 'elementor-page' ) ) {
					var element = document.querySelector( '#header' )
					element.scrollIntoView( { behavior: 'smooth', block: 'end' } )
				}
			} )

			$( document ).on( 'pjax:complete', function () {
				$( 'body' ).removeClass( 'pre-load-content' )
				PENCI.tippyContent()
				PENCI.pagination()
				PENCI.loadingicon()
				PENCI.productQuery()
				PENCI.productCarousel()
				PENCI.fixproductIconsize()
				PENCI.quickshop()
				PENCI.misc()
				PENCI.product_sticky_sidebar()
				$( document.body ).trigger( 'wc_fragment_refresh' )
				$( document.body ).trigger( 'init_price_filter' )
			} )

			$( 'body' ).on( 'click', '.woocommerce-pagination.ajax-pagination li a', function ( e ) {

				if ( $( 'body' ).hasClass( 'penci-wishlist-page' ) ) {
					return
				}

				e.preventDefault()
				var reged = new RegExp( /\?product-page=([0-9\-]+)\&?/ ), link = $( this ).attr( 'href' ),
					$settings = $( this ).closest( '.woocommerce-pagination.ajax-pagination' ).data( 'settings' ),
					$contentID = $( this ).closest( '.page-unique-part' ).data( 'part' ),
					$contentParent = $( this ).closest( '.elementor-widget-container' ),
					$currentpage = reged.test( link )


				if ( $currentpage ) {
					$.ajax( {
						url: penciwoo.ajaxUrl, data: {
							'action': 'penci_ajax_load_products',
							'settings': $settings,
							'preloader': true,
							'product-page': link.match( reged )[1],
							'requestid': penciwoo.nonce,
						}, method: 'get', beforeSend: function () {
							$contentParent.addClass( 'pre-load-content' )
						}, success: function ( data ) {
							var result = data, innerRes = $( result ).html()
							$contentParent.removeClass( 'pre-load-content' )
							$contentParent.find( '.' + $contentID ).empty().html( innerRes )
							PENCI.tippyContent()
							PENCI.loadingicon()
							PENCI.fixproductIconsize()
							PENCI.quickshop()
						},
					} )
				} else {
					$.ajax( {
						url: link, method: 'get', beforeSend: function () {
							$contentParent.addClass( 'pre-load-content' )
						}, success: function ( data ) {
							var result = data, innerRes = $( result ).html()
							$contentParent.removeClass( 'pre-load-content' )
							$contentParent.find( '.' + $contentID ).empty().html( innerRes )
							PENCI.tippyContent()
							PENCI.loadingicon()
							PENCI.fixproductIconsize()
							PENCI.quickshop()
						},
					} )
				}
			} )
		}

		/* Product Ajax ATC
	 ---------------------------------------------------------------*/
		PENCI.productATC = function () {
			$.fn.PenciserializeArrayAll = function () {
				var rCRLF = /\r?\n/g
				return this.map( function () {
					return this.elements ? jQuery.makeArray( this.elements ) : this
				} ).map( function ( i, elem ) {
					var val = jQuery( this ).val()
					if ( val == null ) {
						return val == null
					} else if ( this.type === 'checkbox' && this.checked === false ) {
						return { name: this.name, value: this.checked ? this.value : '' }
					} else {
						return jQuery.isArray( val ) ? jQuery.map( val, function ( val, i ) {
							return { name: elem.name, value: val.replace( rCRLF, '\r\n' ) }
						} ) : { name: elem.name, value: val.replace( rCRLF, '\r\n' ) }
					}
				} ).get()
			}
			$( document ).on( 'click', 'form.cart:not(.variations_form):not(.grouped_form) .single_add_to_cart_button:not(.disabled)', function ( e ) {

				var $thisbutton = $( this ), $form = $thisbutton.closest( 'form.cart' ),
					data = $form.find( 'input:not([name="product_id"]), select, button, textarea' ).PenciserializeArrayAll() || 0,
					mainClass = $thisbutton.closest( '.product.type-product' )

				if ( mainClass.hasClass( 'product-type-external' ) || penciwoo.addtocart_jax ) {
					return
				}

				$.each( data, function ( i, item ) {
					if ( 'add-to-cart' === item.name ) {
						item.name = 'product_id'
						item.value = $form.find( 'input[name=variation_id]' ).val() || $thisbutton.val()
					}
				} )

				e.preventDefault()

				$( document.body ).trigger( 'adding_to_cart', [$thisbutton, data] )

				$.ajax( {
					type: 'POST',
					url: woocommerce_params.wc_ajax_url.toString().replace( '%%endpoint%%', 'add_to_cart' ),
					data: data,
					beforeSend: function () {
						$thisbutton.removeClass( 'added' ).addClass( 'loading' )
					},
					complete: function () {
						$thisbutton.addClass( 'added' ).removeClass( 'loading' )
					},
					success: function ( response ) {

						if ( response.error && response.product_url ) {
							window.location = response.product_url
							return
						}

						$( document.body ).trigger( 'added_to_cart', [
							response.fragments, response.cart_hash, $thisbutton,
						] )
					},
				} )

				return false

			} )
		}

		/* Product Ajax Variable Add to Cart
    ---------------------------------------------------------------*/
		PENCI.productVATC = function () {
			// wc_add_to_cart_params is required to continue, ensure the object exists
			if ( typeof wc_add_to_cart_params === 'undefined' || penciwoo.addtocart_jax ) {
				return false
			}

			// Ajax add to cart
			$( document ).on( 'click', '.variations_form .single_add_to_cart_button', function ( e ) {

				e.preventDefault()

				var $variation_form = $( this ).closest( '.variations_form' ),
					var_id = $variation_form.find( 'input[name=variation_id]' ).val(),
					product_id = $variation_form.find( 'input[name=product_id]' ).val(),
					quantity = $variation_form.find( 'input[name=quantity]' ).val(),
					variations = $variation_form.find( 'select[name^=attribute]' )

				$( '.ajaxerrors' ).remove()
				var item = {}, check = true


				/* Updated code to work with radio button - mantish - WC Variations Radio Buttons - 8manos */
				if ( !variations.length ) {
					variations = $variation_form.find( '[name^=attribute]:checked' )
				}

				/* Backup Code for getting input variable */
				if ( !variations.length ) {
					variations = $variation_form.find( 'input[name^=attribute]' )
				}

				variations.each( function () {

					var $this = $( this ), attributeName = $this.attr( 'name' ), attributevalue = $this.val(), index,
						attributeTaxName

					$this.removeClass( 'error' )

					if ( attributevalue.length === 0 ) {
						index = attributeName.lastIndexOf( '_' )
						attributeTaxName = attributeName.substring( index + 1 )

						$this.addClass( 'required error' ).before( '<div class="ajaxerrors"><p>Please select ' + attributeTaxName + '</p></div>' )

						check = false
					} else {
						item[attributeName] = attributevalue
					}

				} )

				if ( !check ) {
					return false
				}

				var $thisbutton = $( this )

				if ( $thisbutton.is( '.variations_form .single_add_to_cart_button' ) ) {

					$thisbutton.removeClass( 'added' )
					$thisbutton.addClass( 'loading' )

					var data = {
						action: 'penci_add_to_cart_variable',
					}

					$variation_form.serializeArray().map( function ( attr ) {
						if ( attr.name !== 'add-to-cart' ) {
							if ( attr.name.endsWith( '[]' ) ) {
								let name = attr.name.substring( 0, attr.name.length - 2 )
								if ( !(
									name in data
								) ) {
									data[name] = []
								}
								data[name].push( attr.value )
							} else {
								data[attr.name] = attr.value
							}
						}
					} )

					// Trigger event
					$( 'body' ).trigger( 'adding_to_cart', [$thisbutton, data] )

					// Ajax action
					$.post( wc_add_to_cart_params.ajax_url, data, function ( response ) {

						if ( !response ) {
							return
						}

						if ( response.error && response.product_url ) {
							window.location = response.product_url
							return
						}

						// Redirect to cart option
						if ( wc_add_to_cart_params.cart_redirect_after_add === 'yes' ) {
							window.location = wc_add_to_cart_params.cart_url
							return
						}

						// Trigger event so themes can refresh other areas.
						$( document.body ).trigger( 'added_to_cart', [
							response.fragments, response.cart_hash, $thisbutton,
						] )

					} )

					return false

				} else {

					return true
				}

			} )
		}

		/* Product Ajax Quick Shop
	 ---------------------------------------------------------------*/
		PENCI.quickshop = function () {

			if ( penciwoo.quickshop == 0 ) {
				return false
			}

			$( 'ul.products.penci-quickshop-support' ).on( 'click', '.button.product_type_variable', function ( e ) {
				e.preventDefault()
				var $this = $( this ), $product = $this.closest( 'li.product' ),
					$content = $product.find( '.quick-shop-form' ), id = $content.data( 'pid' ),
					loadingClass = 'loading', formSelect = 'li.post-' + id + ' .variations_form'

				if ( $this.hasClass( loadingClass ) ) {
					return
				}

				if ( $product.hasClass( 'quick-shop-loaded' ) ) {
					$product.addClass( 'quick-shop-shown' )
					return
				}

				$this.addClass( loadingClass )
				$product.addClass( 'loading-quick-shop' )

				$.ajax( {
					url: penciwoo.ajaxUrl, data: {
						action: 'penci_quick_shop', id: id,
					}, method: 'get', success: function ( data ) {
						$content.append( data )
						$product.find( '.variations_form' ).wc_variation_form().find( '.variations select:eq(0)' ).change()
						$product.find( '.variations_form' ).trigger( 'wc_variation_form' )
						PENCI.loadingicon()
						PENCI.swatches( formSelect )
					}, complete: function () {
						setTimeout( function () {
							$this.removeClass( loadingClass )
							$product.removeClass( 'loading-quick-shop' )
							$product.addClass( 'quick-shop-shown quick-shop-loaded' )
						}, 100 )
					},
				} )

			} ).on( 'click', '.quick-shop-close', function ( e ) {
				e.preventDefault()

				var $this = $( this ), $product = $this.parents( 'li.product' )

				$product.removeClass( 'quick-shop-shown' )
			} )

			$( 'body' ).on( 'added_to_cart', function () {
				$( '.product' ).removeClass( 'quick-shop-shown' )
			} )
		}

		/* Product Accordion
	 ---------------------------------------------------------------*/
		PENCI.accordion = function () {
			$( '.woocommerce-accordion-title' ).click( function ( j ) {
				var $parent = $( this ).parent(), $toggle = $parent.find( '.woocommerce-accordion-panel' )

				$( this ).toggleClass( 'active' )
				$parent.toggleClass( 'parent-active' )
				$toggle.slideToggle()
				j.preventDefault()
			} )
		}

		/* Product Product Carousel
	---------------------------------------------------------------*/
		PENCI.productCarousel = function () {

			var penci_product_section_carousel = function ( selector, columns ) {
				var sectionProduct, mobilecol, vclass

				vclass = 'swiper-' + Math.floor( Math.random() * (
				         9999999 - 1 + 1
				) + 1 )
				sectionProduct = '.' + vclass

				if ( selector.indexOf( 'ul.products' ) >= 0 ) {
					$( selector ).addClass( 'swiper ' + vclass )
				} else {
					$( selector ).find( 'ul.products' ).addClass( 'swiper ' + vclass )
				}

				$( sectionProduct ).wrapInner( '<div class="swiper-wrapper"></div>' )
				$( sectionProduct ).find( 'li' ).addClass( 'swiper-slide' )
				$( sectionProduct ).addClass( 'penci-owl-carousel penci-owl-carousel-slider' )
				$( sectionProduct ).append( '<div class="penci-owl-nav"><div class="owl-prev"><i class="penciicon-left-chevron"></i></div><div class="owl-next"><i class="penciicon-right-chevron"></i></div></div>' )

				var relateProduct_arg = {
					loop: true,
					spaceBetween: 30,
					slidesPerView: columns,
					breakpoints: {
						320: {
							slidesPerView: 2, spaceBetween: 20,
						}, 600: {
							slidesPerView: 2, spaceBetween: 20,
						}, 1000: {
							slidesPerView: columns,
						},
					},
					navigation: {
						nextEl: sectionProduct + ' .owl-next',
						prevEl: sectionProduct + ' .owl-prev',
					},
					on: {
						init: function ( e ) {
							$( sectionProduct ).addClass( 'penci-owl-loaded' )
						},
					},
				}

				const swiper = new Swiper( sectionProduct, relateProduct_arg )

			}

			$.each( [
				{
					name: '.up-sells.products.slider', number: penciwoo.upsellproduct,
				}, {
					name: '.related.products.slider', number: penciwoo.relateproduct,
				}, {
					name: '.cart-collaterals + .cross-sells.slider', number: penciwoo.crosssellproduct,
				}, {
					name: 'ul.products.penci-woo-product-loop-categories.display-style-carousel',
					number: penciwoo.catcolumns,
				},
			], function ( key, section ) {
				penci_product_section_carousel( section.name, section.number )
			} )
		}

		/* Product Product Sticky
	---------------------------------------------------------------*/
		PENCI.productSticky = function () {
			$( 'body.single-product' ).on( 'click', '.penci-sticky-cart .button.product_type_variable', function ( e ) {
				e.preventDefault()
				var productElement = document.querySelector( '#main' )
				productElement.scrollIntoView( { behavior: 'smooth', block: 'start' } )
			} )

			var stickyAddToCartCheck = function () {
				if ( (
					     $( '#main' ).find( '.penci-sticky-cart' ).length
				     ) === 1 ) {
					var windowScroll = $( window ).scrollTop(), windowHeight = $( window ).height(),
						documentHeight = $( document ).height(), stickyCart = $( '.penci-sticky-cart' ),
						mainCart = $( 'form.cart' ), summaryOffset = mainCart.offset().top + mainCart.outerHeight()

					if ( summaryOffset < windowScroll && windowScroll + windowHeight !== documentHeight ) {
						stickyCart.addClass( 'cart-sticky' )

					} else if ( windowScroll + windowHeight === documentHeight || summaryOffset > windowScroll ) {
						stickyCart.removeClass( 'cart-sticky' )
					}

				} // sticky
			}

			stickyAddToCartCheck()

			$( window ).on( 'scroll', stickyAddToCartCheck )
		}

		/* Product Pagination
	---------------------------------------------------------------*/
		PENCI.pagination = function () {
			var nextPage = $( '.woocommerce-pagination .next.page-numbers' )
			if ( $.isFunction( $.fn.infiniteScroll ) && nextPage.length > 0 ) {
				var pPath = '.woocommerce-pagination .next.page-numbers', pAppend = 'li.product',
					pButton = '.view-more-button.button', pStatus = '.page-load-status', pBody = $( 'body' ),
					ajax_threshold = penciwoo.pagination_ajax_threshold,
					ajax_history = penciwoo.pagination_ajax_history, ajax_title = penciwoo.pagination_ajax_title

				if ( pBody.hasClass( 'elementor-page' ) ) {
					ajax_history = false
					ajax_title = false
				}

				$( '.infinit.penci-woo-page-container ul.products:not(.penci-woo-product-loop-categories)' ).each( function () {
					$( this ).infiniteScroll( {
						path: pPath,
						append: pAppend,
						status: pStatus,
						scrollThreshold: ajax_threshold,
						history: ajax_history,
						historyTitle: ajax_title,
						checkLastPage: true,
					} )
				} )

				if ( !pBody.hasClass( 'elementor-page' ) ) {


					$( '.loadmore.penci-woo-page-container ul.products:not(.penci-woo-product-loop-categories)' ).each( function () {
						var idClass = '.woocommerce-pagination.loadmore-pagination .next.page-numbers',
							mainClass = $( this )

						if ( pBody.hasClass( 'elementor-page' ) ) {
							var id = $( this ).closest( '.penci-woo-page-container' ).data( 'section' )
							idClass = '.' + id + ' .next.page-numbers'
							mainClass = $( '.' + id + '.loadmore.penci-woo-page-container ul.products.' + id + '-container' )
							pAppend = '.' + id + ' li.product'
							pButton = '.' + id + '.view-more-button.button'
							pStatus = '.' + id + '.page-load-status'
						}

						mainClass.infiniteScroll( {
							path: idClass,
							append: pAppend,
							scrollThreshold: false,
							button: pButton,
							status: pStatus,
							checkLastPage: true,
							history: ajax_history,
							historyTitle: ajax_title,
							debug: false,
						} )
					} )
				}


				$( '.penci-woo-page-container ul.products' ).on( 'request.infiniteScroll', function ( event, path, fetchPromise ) {
					$( pButton ).addClass( 'loading-posts' )
				} ).on( 'load.infiniteScroll', function ( event, body, path, response ) {
					$( pButton ).removeClass( 'loading-posts' )
				} ).on( 'append.infiniteScroll', function ( event, body, path, response ) {
					PENCI.tippyContent()
				} ).on( 'last.infiniteScroll', function ( event, body, path, response ) {
					$( pButton ).hide()
				} )

				if ( pBody.hasClass( 'elementor-page' ) ) {
					pBody.on( 'click', '.penci-ajax-more-button', function ( e ) {
						e.preventDefault()
						var thisBtn = $( this ), id = thisBtn.closest( '.penci-woo-page-container' ).data( 'section' ),
							contentContainer = $( '.' + id ),
							nextLink = contentContainer.find( '.woocommerce-pagination .next.page-numbers' )

						if ( nextLink.length > 0 ) {
							$.ajax( {
								url: nextLink.attr( 'href' ), method: 'get', beforeSend: function () {
									thisBtn.addClass( 'loading-posts' )
									contentContainer.addClass( 'pre-load-content' )
								}, success: function ( data ) {
									var content = $( data ).find( 'ul.products' ).html(),
										pagination = $( data ).find( '.woocommerce-pagination' ).html(),
										next = $( data ).find( '.woocommerce-pagination .next.page-numbers' )
									contentContainer.removeClass( 'pre-load-content' )
									thisBtn.removeClass( 'loading-posts' )
									contentContainer.find( 'ul.products' ).append( content )
									contentContainer.find( '.woocommerce-pagination' ).html( pagination )
									PENCI.tippyContent()
									PENCI.loadingicon()
									PENCI.fixproductIconsize()
									PENCI.quickshop()
									if ( next.length === 0 ) {
										thisBtn.hide()
									}
								},
							} )
						}
					} )
				}
			}
		}

		/* Product Select2button
	---------------------------------------------------------------*/
		PENCI.select2button = function () {
			if ( penciwoo.select2button > 0 ) {
				$( '.variations_form.cart table.variations .value' ).each( function () {
					var $this = $( this ), $select = $this.find( 'select' )
					if ( $this.find( '.penci-swatches' ).length < 1 ) {

						$select.gridPicker( {
							canSelect: function ( element ) {
								return !$( element ).is( ':disabled' )
							}, canUnselect: function ( element ) {
								return typeof this._$ui.element.attr( 'multiple' ) !== 'undefined'
							},
						} )
					}
				} )
			}
		}

		/* Product Sidebar
	---------------------------------------------------------------*/
		PENCI.sidecart = function () {
			$( document ).on( 'click', '.shoping-cart-icon a', function ( e ) {
				e.preventDefault()
				$( 'body' ).addClass( 'open-sidecart' )
			} )
			$( '.sidebar-cart-close' ).on( 'click', function () {
				$( 'body' ).removeClass( 'open-sidecart' )
			} )
		}

		/* Top Widget Trigger
	---------------------------------------------------------------*/
		PENCI.topWidgets = function () {

			var scrollEnable = true, bdY = $( 'body' ), filtetPanelPositon = penciwoo.fullpanelposition,
				filterClass = 'penci-' + filtetPanelPositon + '-filter-active'

			if ( window.matchMedia( '(max-width: 767px)' ).matches && penciwoo.disable_mobile_autoscroll > 0 ) {
				scrollEnable = false
			}

			$( document ).on( 'click', '.penci-product-top-filter-button > .penci-filter-button', function ( e ) {
				e.preventDefault()
				bdY.toggleClass( filterClass )
				$( this ).toggleClass( 'close' )
			} )

			$( document ).on( 'click', 'button.close-sidebar', function ( e ) {
				bdY.toggleClass( filterClass )
				$( '.penci-product-top-filter-button > .penci-filter-button' ).toggleClass( 'close' )
			} )

			$( document ).keyup( function ( e ) {
				if ( e.key === 'Escape' ) {
					if ( bdY.hasClass( filterClass ) ) {
						bdY.removeClass( filterClass )
						$( '.penci-product-top-filter-button > .penci-filter-button' ).removeClass( 'close' )
					}
				}
			} )
		}

		PENCI.productSwiper = function ( selector ) {

			var tabProduct = $( selector ).find( 'ul.products' ), speed = tabProduct.data( 'speed' ),
				slides_per_view = tabProduct.data( 'desktop' ),
				slides_per_view_tablet = tabProduct.data( 'tablet' ) ? tabProduct.data( 'desktop' ) : slides_per_view,
				slides_per_view_mobile = tabProduct.data( 'mobile' ) ? tabProduct.data( 'mobile' ) : slides_per_view,
				autoplay = tabProduct.data( 'autoplay' ), center_mode = tabProduct.data( 'center_mode' ),
				hide_pagination_control = tabProduct.data( 'hide_pagination_control' ),
				hide_prev_next_buttons = tabProduct.data( 'hide_prev_next_buttons' ),
				datamargin = tabProduct.attr( 'data-margin' ), scroll_per_page = tabProduct.data( 'scroll_per_page' ),
				vclass = 'swiper_v_' + Math.floor( Math.random() * (
				         9999999 - 1 + 1
				) + 1 ),
				$ids = 'swiper_v_' + Math.floor( Math.random() * (
				       9999999 - 1 + 1
				) + 1 )

			if ( !tabProduct.hasClass( 'swiper' ) ) {
				tabProduct.addClass( 'swiper ' + vclass )
				tabProduct.find( 'li' ).addClass( 'swiper-slide' )
				tabProduct.wrapInner( '<div class="swiper-wrapper"></div>' )
			}

			$( 'body' ).trigger( 'slider-load' )

		}

		/* Penci Ajax Product Query
	---------------------------------------------------------------*/
		PENCI.productQuery = function () {

			$( '.elementor-element' ).each( function () {
				var telement = $( this ),
					defaultTab = $( telement ).find( '.penci-products-tabs .products-tabs-title li.active-tab-title' )
				if ( 'carousel' === defaultTab.data( 'layout' ) ) {
					$( 'body' ).trigger( 'slider-load' )
				}
			} )

			$( '.penci-products-tabs' ).on( 'click', '.products-tabs-title li', function ( e ) {
				e.preventDefault()
				var $this = $( this ), $setting = $this.data( 'atts' ),
					$elementClass = $this.closest( '.elementor-element' ), $queryID = $this.data( 'queryid' ),
					$layout = $this.data( 'layout' ), $queryClass = '.products-' + $queryID + '-section',
					$contentContainer = $elementClass.find( '.penci-tab-content-container' ),
					$slider = $( $queryClass ).find( 'ul.products' )

				if ( $this.hasClass( 'active-tab-title' ) ) {
					return false
				}

				if ( $elementClass.find( $queryClass ).length > 0 ) {
					$contentContainer.find( '.penci-custom-products' ).removeClass( 'active' )
					$contentContainer.find( $queryClass ).addClass( 'active' )

					$elementClass.find( '.products-tabs-title li' ).removeClass( 'active-tab-title' )
					$this.addClass( 'active-tab-title' )

					if ( 'carousel' === $layout ) {
						$( 'body' ).trigger( 'slider-load' )
					}

				} else {
					$.ajax( {
						url: penciwoo.ajaxUrl, data: {
							action: 'penci_ajax_load_products',
							settings: $setting,
							requestid: penciwoo.nonce,
							preloader: 0,
						}, method: 'get', beforeSend: function () {
							$contentContainer.addClass( 'pre-load-content' )
						}, success: function ( data ) {
							$contentContainer.append( data )
							$contentContainer.removeClass( 'pre-load-content' )
							$contentContainer.find( '.penci-custom-products' ).removeClass( 'active' )
							$contentContainer.find( $queryClass ).addClass( 'active' )
							$elementClass.find( '.products-tabs-title li' ).removeClass( 'active-tab-title' )
							$this.addClass( 'active-tab-title' )
							PENCI.tippyContent()
							PENCI.loadingicon()
							PENCI.fixproductIconsize()
							PENCI.quickshop()
							if ( 'carousel' === $layout ) {
								$( 'body' ).trigger( 'slider-load' )
							}
						},
					} )
				}
			} ).on( 'click', '.page-numbers a', function ( e ) {

				var linkURL = $( this ).attr( 'href' ).toString()

				if ( linkURL.indexOf( 'penci_ajax_load_products' ) >= 0 ) {

					var parentClass = $( this ).closest( '.page-unique-part' ),
						containerUnit = '.' + parentClass.data( 'part' ),
						parentConent = $( '.penci-tab-content-container' ), postURL = $( this ).attr( 'href' )
					$.ajax( {
						url: postURL, method: 'get', beforeSend: function () {
							parentConent.addClass( 'pre-load-content' )
						}, success: function ( data ) {
							parentConent.find( containerUnit ).remove()
							parentConent.append( data )
							parentConent.removeClass( 'pre-load-content' )
							parentConent.find( containerUnit ).addClass( 'active' )
							PENCI.tippyContent()
						},
					} )
				}

				e.preventDefault()
			} )

			$( document ).on( 'click', '.penci-swatches-divider', function () {
				var $click = $( this ), $item = $click.closest( '.penci-swatches-list' )
				$item.find( '.penci-swatch-item' ).removeClass( 'hidden' )
				$click.hide()
			} )

		}

		/* Penci Notify
	---------------------------------------------------------------*/
		PENCI.notify = function ( title, message, type ) {
			if ( penciwoo.toast_notify > 0 && title && message && type ) {

				var $icon = type

				if ( type === 'added_to_cart' ) {
					$icon = false
				}

				$.toast( {
					heading: title,
					text: message,
					icon: $icon,
					position: penciwoo.toast_notify_position,
					textAlign: penciwoo.toast_notify_text_align,
					showHideTransition: penciwoo.toast_notify_transition,
					hideAfter: penciwoo.toast_notify_hide_after,
					bgColor: penciwoo.toast_notify_bg_color,
					textColor: penciwoo.toast_notify_text_color,
				} )
			}
		}

		/* Penci Misc Template
   ---------------------------------------------------------------*/
		PENCI.ajaxNotify = function ( $id ) {
			$.ajax( {
				url: penciwoo.ajaxUrl, data: {
					action: 'penci_get_product_info', requestid: penciwoo.nonce, id: $id,
				}, method: 'get', success: function ( response ) {
					PENCI.notify( '<a href="' + response.data.item_link + '"><img class="product_image" src="' + response.data.img + '" alt=""/></a><div><a class="toast-title" href="' + response.data.item_link + '">' + response.data.title + '</a><p>' + penciwoo.addtocart + '.</p></div>', penciwoo.toast_notify_shop_sucess_text + '<div class="woocommerce notify_bottom"><a class="button shop_url" href="' + penciwoo.toast_notify_shop_url + '">' + penciwoo.toast_notify_shop_text + '</a><a class="button checkout_url" href="' + penciwoo.checkout_url + '">' + penciwoo.checkout_text + '</a></div>', 'added_to_cart' )
				},
			} )
		}

		/* Penci Misc Template
	---------------------------------------------------------------*/
		PENCI.getURLparam = function ( sParam ) {
			var sPageURL = window.location.search.substring( 1 ), sURLVariables = sPageURL.split( '&' ), sParameterName,
				i

			for ( i = 0; i < sURLVariables.length; i ++ ) {
				sParameterName = sURLVariables[i].split( '=' )

				if ( sParameterName[0] === sParam ) {
					return typeof sParameterName[1] === undefined ? true : decodeURIComponent( sParameterName[1] )
				}
			}
			return false
		}

		PENCI.misc = function () {
			var body = $( 'body' )
			if ( body.find( '.penci-mobile-bottom-nav' ).length > 0 ) {
				body.addClass( 'mobile-bottom-nav-active' )
			}

			$( '.penci-mobile-bottom-nav li.filter a' ).on( 'click', function ( e ) {
				e.preventDefault()
				$( 'body' ).addClass( 'open-filter-side' )
			} )
			$( '.sidebar-filter-close, .sidebar-filter-close-button' ).on( 'click', function () {
				$( 'body' ).removeClass( 'open-filter-side penci-side-right-filter-active penci-side-left-filter-active' )
				$( '.penci-product-top-filter-button > .penci-filter-button' ).removeClass( 'close' )
			} )
			$( '.penci-top-relate-post .top-ralate-item' ).each( function () {
				if ( PENCI.isMobile() ) {
					var tItem = $( this ), title = tItem.find( 'h4' ).text(), link = tItem.find( 'a' ).attr( 'href' )
					tItem.attr( 'data-tippy-content', title )
					tippy( '[data-tippy-content]', { placement: 'bottom' } )
					$( this ).on( 'click', function () {
						window.location.href = link
					} )
				}
			} )

			$( '.widget_layered_nav_filters a,.soledad-product-filter li.chosen a.layered-nav-link' ).each( function () {
				var theme_demo_mods = penciwoo.demo_mods, currentURL = $( this ).attr( 'href' )
				$.each( theme_demo_mods, function ( index, attr ) {
					var value = PENCI.getURLparam( attr )
					if ( value.length > 0 ) {
						currentURL = PENCI.updateURL( currentURL, attr, value )
					}
				} )

				$( this ).attr( 'href', currentURL )
			} )
		}

		/* Penci Woo Extra
	---------------------------------------------------------------*/

		PENCI.wooextra = function () {

			$( 'body' ).on( 'wc_cart_button_updated', function () {
				$( '.penci-product-loop-button' ).find( 'a.added_to_cart.wc-forward' ).remove()
			} )

			$( document ).on( 'added_to_cart', function ( event, fragments, cart_hash, $button ) {

				if ( 'dropdown' !== penciwoo.cartstyle.toString() ) {
					$( 'body' ).addClass( 'open-sidecart' )
				}

				if ( penciwoo.cartnotify > 0 ) {

					var $id

					if ( $button.data( 'product_id' ) ) {
						$id = $button.data( 'product_id' )
					} else {
						if ( $button.closest( 'form.cart' ).data( 'product_id' ) ) {
							$id = $button.closest( 'form.cart' ).data( 'product_id' )
						} else if ( $button.attr( 'value' ) ) {
							$id = $button.attr( 'value' )
						}
					}

					if ( $id ) {
						PENCI.ajaxNotify( $id )
						return false
					}

				}
			} )
		}

		/* Penci Loading
	---------------------------------------------------------------*/
		PENCI.loadingicon = function () {

			var penci_loading_icon = '<span class="penci-loading-icon"><span class="bubble"></span><span class="bubble"></span><span class="bubble"></span></span>',
				elAdd = [
					'.single_add_to_cart_button',
					'ul.product-style-5 .penci-product-loop-top a.button.add_to_cart_button',
					'ul.product-style-3 .penci-product-loop-image a.button.add_to_cart_button',
					'ul.product-standard a.button',
					'.penci-list-action .button',
					'.woocommerce.penci-products-compare-table a.button.add_to_cart_button',
					'.hotspot-product .button',
				]

			$.each( elAdd, function ( index, value ) {
				$( value ).append( penci_loading_icon ).addClass( 'has-new-preload' )
			} )
		}

		/* Penci Product Filter
	---------------------------------------------------------------*/
		PENCI.productFilters = function () {
			var removeValue = function ( $mainInput, currentVal ) {
				if ( $mainInput.length === 0 ) {
					return
				}

				var mainInputVal = $mainInput.val()

				if ( mainInputVal.indexOf( ',' ) > 0 ) {
					$mainInput.val( mainInputVal.replace( ',' + currentVal, '' ).replace( currentVal + ',', '' ) )
				} else {
					$mainInput.val( mainInputVal.replace( currentVal, '' ) )
				}
			}

			$( '.penci-pf-checkboxes li > .pf-value' ).on( 'click', function ( e ) {
				e.preventDefault()
				var $this = $( this ), $li = $this.parent(), $widget = $this.parents( '.penci-pf-checkboxes' ),
					$mainInput = $widget.find( '.result-input' ), $results = $widget.find( '.penci-pf-results' ),
					multiSelect = $widget.hasClass( 'multi_select' ), mainInputVal = $mainInput.val(),
					currentText = $this.data( 'title' ), currentVal = $this.data( 'val' )

				if ( multiSelect ) {
					if ( !$li.hasClass( 'pf-active' ) ) {
						if ( mainInputVal === '' ) {
							$mainInput.val( currentVal )
						} else {
							$mainInput.val( mainInputVal + ',' + currentVal )
						}

						$results.prepend( '<li class="selected-value" data-title="' + currentVal + '">' + currentText + '</li>' )
						$li.addClass( 'pf-active' )
					} else {
						removeValue( $mainInput, currentVal )
						$results.find( 'li[data-title="' + currentVal + '"]' ).remove()
						$li.removeClass( 'pf-active' )
					}
				} else {
					if ( !$li.hasClass( 'pf-active' ) ) {
						$mainInput.val( currentVal )
						$results.find( '.selected-value' ).remove()
						$results.prepend( '<li class="selected-value" data-title="' + currentVal + '">' + currentText + '</li>' )
						$li.parents( '.penci-scroll-content' ).find( '.pf-active' ).removeClass( 'pf-active' )
						$li.addClass( 'pf-active' )
					} else {
						$mainInput.val( '' )
						$results.find( '.selected-value' ).remove()
						$li.removeClass( 'pf-active' )
					}
				}
			} )

			// Label clear
			var $checkboxes = $( '.penci-pf-checkboxes' )
			$checkboxes.on( 'click', '.selected-value', function () {
				var $this = $( this ), $widget = $this.parents( '.penci-pf-checkboxes' ),
					$mainInput = $widget.find( '.result-input' ), currentVal = $this.data( 'title' )

				// Price filter clear
				if ( currentVal === 'price-filter' ) {
					var min = $this.data( 'min' ), max = $this.data( 'max' ),
						$slider = $widget.find( '.price_slider_widget' )
					$slider.slider( 'values', 0, min )
					$slider.slider( 'values', 1, max )
					$widget.find( '.min_price' ).val( '' )
					$widget.find( '.max_price' ).val( '' )
					$( 'body' ).trigger( 'filter_price_slider_slide', [
						min, max, min, max, $slider,
					] )
					return
				}

				removeValue( $mainInput, currentVal )
				$widget.find( '.pf-value[data-val="' + currentVal + '"]' ).parent().removeClass( 'pf-active' )
				$this.remove()
			} )

			// Checkboxes value dropdown
			$checkboxes.each( function () {
				var $this = $( this ), $btn = $this.find( '.penci-pf-title' ),
					$list = $btn.siblings( '.penci-pf-dropdown' ), multiSelect = $this.hasClass( 'multi_select' )

				$btn.on( 'click', function ( e ) {
					var target = e.target

					if ( $( target ).is( $btn.find( '.selected-value' ) ) ) {
						return
					}

					if ( !$this.hasClass( 'opened' ) ) {
						$this.addClass( 'opened' )
						$list.slideDown( 100 )
						setTimeout( function () {
							$( document ).trigger( 'wdProductFiltersOpened' )
						}, 300 )
					} else {
						close()
					}
				} )

				$( document ).on( 'click', function ( e ) {
					var target = e.target

					if ( $this.hasClass( 'opened' ) && (
						multiSelect && !$( target ).is( $this ) && !$( target ).parents().is( $this )
					) || (
						     !multiSelect && !$( target ).is( $btn ) && !$( target ).parents().is( $btn )
					     ) ) {
						close()
					}
				} )

				var close = function () {
					$this.removeClass( 'opened' )
					$list.slideUp( 100 )
				}
			} )

			var removeEmptyValues = function ( $selector ) {
				$selector.find( '.penci-pf-checkboxes' ).each( function () {
					var $this = $( this )

					if ( !$this.find( 'input[type="hidden"]' ).val() ) {
						$this.find( 'input[type="hidden"]' ).remove()
					}
				} )
			}

			var changeFormAction = function ( $form ) {
				var activeCat = $form.find( '.penci-pf-categories .pf-active .pf-value' )

				if ( activeCat.length > 0 ) {
					$form.attr( 'action', activeCat.attr( 'href' ) )
				}
			}

			// Price slider init
			$( 'body' ).on( 'filter_price_slider_create filter_price_slider_slide', function ( event, min, max, minPrice, maxPrice, $slider ) {
				var minHtml = accounting.formatMoney( min, {
					symbol: woocommerce_price_slider_params.currency_format_symbol,
					decimal: woocommerce_price_slider_params.currency_format_decimal_sep,
					thousand: woocommerce_price_slider_params.currency_format_thousand_sep,
					precision: woocommerce_price_slider_params.currency_format_num_decimals,
					format: woocommerce_price_slider_params.currency_format,
				} )

				var maxHtml = accounting.formatMoney( max, {
					symbol: woocommerce_price_slider_params.currency_format_symbol,
					decimal: woocommerce_price_slider_params.currency_format_decimal_sep,
					thousand: woocommerce_price_slider_params.currency_format_thousand_sep,
					precision: woocommerce_price_slider_params.currency_format_num_decimals,
					format: woocommerce_price_slider_params.currency_format,
				} )

				$slider.siblings( '.filter_price_slider_amount' ).find( 'span.from' ).html( minHtml )
				$slider.siblings( '.filter_price_slider_amount' ).find( 'span.to' ).html( maxHtml )

				var $results = $slider.parents( '.penci-pf-checkboxes' ).find( '.penci-pf-results' ),
					value = $results.find( '.selected-value' )

				if ( min === minPrice && max === maxPrice ) {
					value.remove()
				} else {
					if ( value.length === 0 ) {
						$results.prepend( '<li class="selected-value" data-title="price-filter" data-min="' + minPrice + '" data-max="' + maxPrice + '">' + minHtml + ' - ' + maxHtml + '</li>' )
					} else {
						value.html( minHtml + ' - ' + maxHtml )
					}
				}

				$( 'body' ).trigger( 'price_slider_updated', [
					min, max,
				] )
			} )

			$( '.penci-pf-price-range .price_slider_widget' ).each( function () {
				var $this = $( this ), $minInput = $this.siblings( '.filter_price_slider_amount' ).find( '.min_price' ),
					$maxInput = $this.siblings( '.filter_price_slider_amount' ).find( '.max_price' ),
					minPrice = parseInt( $minInput.data( 'min' ) ), maxPrice = parseInt( $maxInput.data( 'max' ) ),
					currentMinPrice = parseInt( $minInput.val() ), currentMaxPrice = parseInt( $maxInput.val() )

				$( '.price_slider_widget, .price_label' ).show()

				$this.slider( {
					range: true, animate: true, min: minPrice, max: maxPrice, values: [
						currentMinPrice, currentMaxPrice,
					], create: function () {
						if ( currentMinPrice === minPrice && currentMaxPrice === maxPrice ) {
							$minInput.val( '' )
							$maxInput.val( '' )
						}

						$( 'body' ).trigger( 'filter_price_slider_create', [
							currentMinPrice, currentMaxPrice, minPrice, maxPrice, $this,
						] )
					}, slide: function ( event, ui ) {
						if ( ui.values[0] === minPrice && ui.values[1] === maxPrice ) {
							$minInput.val( '' )
							$maxInput.val( '' )
						} else {
							$minInput.val( ui.values[0] )
							$maxInput.val( ui.values[1] )
						}

						$( 'body' ).trigger( 'filter_price_slider_slide', [
							ui.values[0], ui.values[1], minPrice, maxPrice, $this,
						] )
					}, change: function ( event, ui ) {
						$( 'body' ).trigger( 'price_slider_change', [
							ui.values[0], ui.values[1],
						] )
					},
				} )
			} )

			// Submit filter form
			$( '.penci-product-filters' ).one( 'click', '.penci-pf-btn button', function () {
				var $this = $( this ), $form = $this.parents( '.penci-product-filters' )
				removeEmptyValues( $form )
				changeFormAction( $form )

				if ( !$( 'body' ).hasClass( 'penci-ajax-shop-on' ) || typeof (
					$.fn.pjax
				) == 'undefined' || !$form.hasClass( 'with-ajax' ) ) {
					return
				}

				$.pjax( {
					container: '.penci-woo-page-container',
					fragment: '.penci-woo-page-container',
					url: $form.attr( 'action' ),
					data: $form.serialize(),
					scrollTo: false,
				} )

				$this.prop( 'disabled', true )
			} )

			// Create labels after ajax
			$( '.penci-pf-checkboxes .pf-active > .pf-value' ).each( function () {
				var $this = $( this ),
					resultsWrapper = $this.parents( '.penci-pf-checkboxes' ).find( '.penci-pf-results' )

				resultsWrapper.prepend( '<li class="selected-value" data-title="' + $this.data( 'val' ) + '">' + $this.data( 'title' ) + '</li>' )
			} )
		}

		/* Penci Category Dropdown
	---------------------------------------------------------------*/
		PENCI.categoryDropdown = function () {
			$( '.penci-search-cat' ).each( function () {
				var dd = $( this ), btn = dd.find( '> a' ), input = dd.find( '> input' ),
					list = dd.find( '> .penci-dropdown' ), $searchInput = dd.parent().parent().find( '.s' )

				$searchInput.on( 'focus', function () {
					inputPadding()
				} )

				$( document ).on( 'click', function ( e ) {
					var target = e.target

					if ( list.hasClass( 'penci-opened' ) && !$( target ).is( '.penci-search-cat' ) && !$( target ).parents().is( '.penci-search-cat' ) ) {
						hideList()
						return false
					}
				} )

				btn.on( 'click', function ( e ) {
					e.preventDefault()

					if ( list.hasClass( 'penci-opened' ) ) {
						hideList()
					} else {
						showList()
					}

					return false
				} )

				list.on( 'click', 'a', function ( e ) {
					e.preventDefault()
					var $this = $( this ), value = $this.data( 'val' ), label = $this.text()

					list.find( '.current-item' ).removeClass( 'current-item' )
					$this.parent().addClass( 'current-item' )

					if ( value !== 0 ) {
						list.find( 'ul:not(.children) > li:first-child' ).show()
					} else if ( value === 0 ) {
						list.find( 'ul:not(.children) > li:first-child' ).hide()
					}

					btn.find( 'span' ).text( label )
					input.val( value ).trigger( 'cat_selected' )
					hideList()
					inputPadding()
				} )

				function showList() {
					list.addClass( 'penci-opened' )

					if ( typeof (
						$.fn.devbridgeAutocomplete
					) != 'undefined' ) {
						dd.parent().siblings( '[type="text"]' ).devbridgeAutocomplete( 'hide' )
					}

					setTimeout( function () {
						$( document ).trigger( 'wdSimpleDropdownOpened' )
					}, 300 )
				}

				function hideList() {
					list.removeClass( 'penci-opened' )
				}

				function inputPadding() {
					if ( $( window ).width() <= 768 || $searchInput.hasClass( 'penci-padding-inited' ) || 'yes' !== penciwoo.search_input_padding ) {
						return
					}

					var paddingValue = dd.innerWidth() + dd.parent().siblings( '.searchsubmit' ).innerWidth() + 17,
						padding = 'padding-right'

					if ( $( 'body' ).hasClass( 'rtl' ) ) {
						padding = 'padding-left'
					}

					$searchInput.css( padding, paddingValue )
					$searchInput.addClass( 'penci-padding-inited' )
				}
			} )
		}

		/* Countdown
	 ---------------------------------------------------------------*/
		PENCI.product_countdown = function () {
			$( '.penci-time-countdown' ).each( function () {
				var $this = $( this )
				dayjs.extend( window.dayjs_plugin_utc )
				dayjs.extend( window.dayjs_plugin_timezone )
				var time = dayjs.tz( $this.data( 'end-date' ), $this.data( 'timezone' ) )
				$this.countdown( time.toDate(), function ( event ) {
					$this.html( event.strftime( '' + '<span class="countdown-days">%-D <span>' + penciwoo.countdown_days + '</span></span> ' + '<span class="countdown-hours">%H <span>' + penciwoo.countdown_hours + '</span></span> ' + '<span class="countdown-min">%M <span>' + penciwoo.countdown_mins + '</span></span> ' + '<span class="countdown-sec">%S <span>' + penciwoo.countdown_sec + '</span></span>' ) )
				} )
			} )
		}

		/* Product Sticky sidebar
	 ----------------------------------------------------------------*/
		PENCI.product_sticky_sidebar = function () {
			if ( $().theiaStickySidebar ) {
				var top_margin = 90
				if ( $( 'body' ).hasClass( 'admin-bar' ) && $( 'body' ).hasClass( 'penci-vernav-enable' ) ) {
					top_margin = 62
				} else if ( !$( 'body' ).hasClass( 'admin-bar' ) && $( 'body' ).hasClass( 'penci-vernav-enable' ) ) {
					top_margin = 30
				} else if ( $( 'body' ).hasClass( 'admin-bar' ) && !$( 'body' ).hasClass( 'penci-vernav-enable' ) ) {
					top_margin = 122
				}

				$( '#main.penci-main-sticky-sidebar, #sidebar.penci-sticky-sidebar' ).theiaStickySidebar( {
					// settings
					additionalMarginTop: top_margin,
				} )

				$( '.penci-product-summary.penci-main-sticky-sidebar, .woocommerce-product-gallery.penci-sticky-sidebar' ).theiaStickySidebar( {
					// settings.
					additionalMarginTop: top_margin,
				} )

				$( '.sidebar-bottom .penci-content-sticky-sidebar .bottom-content, .sidebar-bottom .penci-content-sticky-sidebar #sidebar.penci-sticky-sidebar' ).theiaStickySidebar( {
					// settings.
					additionalMarginTop: top_margin,
				} )
			} // if sticky
		}

		/* Product Sidebar Quantity
	 ----------------------------------------------------------------*/
		PENCI.sidecartQuantity = function () {
			var timeout
			$( document ).on( 'change input', '.woocommerce-mini-cart .quantity .qty', function () {
				var input = $( this ), qtyVal = input.val(), itemID = input.parents( '.mini_cart_item' ).data( 'key' ),
					penci_loading_icon = '<span class="penci-loading-icon"><span class="bubble"></span><span class="bubble"></span><span class="bubble"></span></span>'

				clearTimeout( timeout )

				timeout = setTimeout( function () {
					input.parents( '.mini_cart_item' ).append( penci_loading_icon ).addClass( 'loading' )

					$.ajax( {
						url: penciwoo.ajaxUrl, data: {
							action: 'penci_shop_update_cart_item', item_id: itemID, qty: qtyVal,
						}, success: function ( data ) {
							if ( data && data.fragments ) {
								$.each( data.fragments, function ( key, value ) {
									if ( $( key ).hasClass( 'widget_shopping_cart_content' ) ) {
										var dataItemValue = $( value ).find( '.woocommerce-mini-cart-item[data-key="' + itemID + '"]' ),
											dataFooterValue = $( value ).find( '.woocommerce-mini-cart__total' ),
											$itemSelector = $( key ).find( '.woocommerce-mini-cart-item[data-key="' + itemID + '"]' )

										if ( !data.cart_hash ) {
											$( key ).replaceWith( value )
										} else {
											$itemSelector.replaceWith( dataItemValue )
											$( '.woocommerce-mini-cart__total' ).replaceWith( dataFooterValue )
										}
									} else {
										$( key ).replaceWith( value )
									}
								} )
							}
						}, dataType: 'json', method: 'GET',
					} )
				}, 500 )
			} )
		}

		/* Product Sticky sidebar
	----------------------------------------------------------------*/
		PENCI.fixproductIconsize = function () {
			$( 'ul.products' ).find( 'li.product' ).each( function ( e ) {
				var productC = $( this ), productZ = productC.closest( 'ul.products' ),
					productB = productC.find( '.penci-product-loop-button' ).innerHeight(),
					productW = productC.find( '.penci-product-loop-top' ).innerHeight()
				if ( productB > productW ) {
					productZ.addClass( 'penci-small-width' )
				} else {
					productZ.removeClass( 'penci-small-width' )
				}
			} )
			$( '.widget.soledad-product-filter' ).each( function () {
				var items = $( this ).find( 'ul.swatches-display-list li' ).length,
					height = $( this ).find( 'ul.swatches-display-list li' ).outerHeight(), standard = penciwoo.wdgh

				if ( PENCI.isMobile() || window.matchMedia( '(max-width: 768px)' ).matches ) {
					standard = penciwoo.wdgmh
				}

				$( this ).addClass( 'penci-scroll-inactive' ).removeClass( 'penci-scroll-active' )

				if ( items * height + items * 5.32 > standard ) {
					$( this ).removeClass( 'penci-scroll-inactive' ).addClass( 'penci-scroll-active' )
				}
			} )
		}

		/* Hotspot Product
	----------------------------------------------------------------*/
		PENCI.producthotspot = function () {
			$( '.penci-image-hotspot' ).each( function () {
				var _this = $( this )
				var btn = _this.find( '.hotspot-btn' )
				var parentWrapper = _this.parents( '.penci-image-hotspot-wrapper' )

				if ( !parentWrapper.hasClass( 'hotspot-action-click' ) && $( window ).width() > 1024 ) {
					return
				}

				btn.on( 'click', function () {
					if ( _this.hasClass( 'hotspot-opened' ) ) {
						_this.removeClass( 'hotspot-opened' )
					} else {
						_this.addClass( 'hotspot-opened' )
						_this.siblings().removeClass( 'hotspot-opened' )
					}

					$( document ).trigger( 'wood-images-loaded' )
					return false
				} )

				$( document ).on( 'click', function ( e ) {
					var target = e.target

					if ( _this.hasClass( 'hotspot-opened' ) && !$( target ).is( '.penci-image-hotspot' ) && !$( target ).parents().is( '.penci-image-hotspot' ) ) {
						_this.removeClass( 'hotspot-opened' )
						return false
					}
				} )
			} )

			//Image loaded
			$( '.penci-image-hotspot-wrapper' ).each( function () {
				var _this = $( this )
				_this.imagesLoaded( function () {
					_this.addClass( 'loaded' )
				} )
			} )

			$( '.pc-image-hotspot .hotspot-content' ).each( function () {
				var content = $( this ), offsetLeft = content.offset().left, offsetRight = $( window ).width() - (
					offsetLeft + content.outerWidth()
				)

				if ( $( window ).width() > 768 ) {
					if ( offsetLeft <= 0 ) {
						content.addClass( 'hotspot-overflow-right' )
					}
					if ( offsetRight <= 0 ) {
						content.addClass( 'hotspot-overflow-left' )
					}
				}

				if ( $( window ).width() <= 768 ) {
					if ( offsetLeft <= 0 ) {
						content.css( 'marginLeft', Math.abs( offsetLeft - 15 ) + 'px' )
					}
					if ( offsetRight <= 0 ) {
						content.css( 'marginLeft', offsetRight - 15 + 'px' )
					}
				}
			} )
		}

		/* Soledad on Mobile
	----------------------------------------------------------------*/
		PENCI.mobileTrigger = function () {
			$( document ).on( 'mouseenter mousemove touchstart', '.penci-soledad-product', function ( e ) {
				var $this = $( this )
				$this.closest( 'ul.products' ).find( '.penci-soledad-product' ).removeClass( 'penci-hover' )
				$this.addClass( 'penci-hover' )
			} )
		}

		/* Init functions
	 ---------------------------------------------------------------*/
		$( document ).ready( function () {
			PENCI.yith()
			PENCI.quickview()
			PENCI.wishlist()
			PENCI.compare()
			PENCI.swatches( '.entry-summary .variations_form' )
			PENCI.productslider()
			PENCI.quantity()
			PENCI.productLoop()
			PENCI.productATC()
			PENCI.productVATC()
			PENCI.quickshop()
			PENCI.accordion()
			PENCI.productCarousel()
			PENCI.productSticky()
			PENCI.tippyContent()
			PENCI.pagination()
			PENCI.select2button()
			PENCI.topWidgets()
			PENCI.productQuery()
			PENCI.productFilters()
			PENCI.misc()
			PENCI.categoryDropdown()
			PENCI.product_countdown()
			PENCI.product_sticky_sidebar()
			PENCI.loadingicon()
			PENCI.sidecartQuantity()
			PENCI.producthotspot()
			PENCI.fixproductIconsize()
			PENCI.wooextra()
			if ( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test( navigator.userAgent ) ) {
				PENCI.mobileTrigger()
			}
			if ( 'dropdown' !== penciwoo.cartstyle.toString() ) {
				PENCI.sidecart()
			}
			if ( penciwoo.ajaxshop > 0 ) {
				PENCI.ajaxfilter()
			}
			$( window ).on( 'resize', function () {
				PENCI.fixproductIconsize()
			} )
		} )

		// Hook to Elementor Edit.
		$.each( ['frontend/element_ready/penci_product_deals.default'], function ( index, value ) {
			PENCI.elAction( value, function () {
				PENCI.fixproductIconsize()
			} )
		} )

		$.each( ['frontend/element_ready/penci_products_tabs.default'], function ( index, value ) {
			PENCI.elAction( value, function () {
				PENCI.productQuery()
				PENCI.fixproductIconsize()
				PENCI.tippyContent()
			} )
		} )

		$.each( ['frontend/element_ready/penci_product_hotspot.default'], function ( index, value ) {
			PENCI.elAction( value, function () {
				PENCI.producthotspot()
			} )
		} )

		$.each( [
			'frontend/element_ready/penci_products.default',
			'frontend/element_ready/penci_product_categories.default',
			'frontend/element_ready/penci_products_brands.default',
		], function ( index, value ) {
			PENCI.elAction( value, function () {
				$( 'body' ).trigger( 'slider-load' )
				PENCI.misc()
				PENCI.fixproductIconsize()
				PENCI.tippyContent()
			} )
		} )
	}
)( jQuery )
