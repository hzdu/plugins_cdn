(function ($) {
	var isEditMode = false;

	function equalHeight( $scope, slider_type ) {
		var activeSlide = $scope.find( '.swiper-slide-visible' ),
			maxHeight   = -1;

		activeSlide.each( function() {
			var $this      = $( this );
				if ( 'product' === slider_type ) {
					var product    = $this.find( '.pp-woo-product-wrapper' ),
						productHeight = product.height();
						if ( maxHeight < productHeight ) {
							maxHeight = productHeight;
						}
				}

				if ( 'category' === slider_type ) {
					var category   = $this.find( '.pp-grid-item' ),
						categoryHeight = category.height();
					if ( maxHeight < categoryHeight ) {
						maxHeight = categoryHeight;
					}
				}
		});

		activeSlide.each( function() {
			if ( 'product' === slider_type ) {
				var selector = $( this ).find( '.pp-woo-product-wrapper' );
			}
			if ( 'category' === slider_type ) {
				var selector = $( this ).find( '.pp-grid-item' );
			}
			selector.animate({ height: maxHeight }, { duration: 200, easing: 'linear' });
		});
	}

	var ppSwiperSliderAfterinit = function ( $scope, carousel, carouselWrap, elementSettings, mySwiper, slider_type ) {
		equalHeight( $scope, slider_type );

		mySwiper.on('slideChange', function () {
			equalHeight( $scope, slider_type );
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
							mySwiper.update();
						}, 100);
					}
				});
			}
		});

		var $containers = {
			".pp-advanced-tabs": ".pp-advanced-tabs-title",
			".pp-toggle-container": ".pp-toggle-switch",
			".elementor-tabs": ".elementor-tab-title",
		};

		$.each( $containers, function (main_parent, click_element) {
			if ($(mySwiper).closest(main_parent).length > 0) {
				$(mySwiper)
					.closest(main_parent)
					.find(click_element)
					.on("click", function () {
						setTimeout(function() {
							mySwiper.update();
						}, 100);
					});
			}
		});
	};

	var RegisterPPQuickView = function ($scope, $) {
		var scope_id = $scope.data("id");
		var quick_view_btn = $scope.find(".pp-quick-view-btn");
		var modal_wrap = $scope.find(".pp-quick-view-" + scope_id);

		modal_wrap.appendTo(document.body);

		var pp_quick_view_bg = modal_wrap.find(".pp-quick-view-bg"),
			pp_qv_modal = modal_wrap.find("#pp-quick-view-modal"),
			pp_qv_content = pp_qv_modal.find("#pp-quick-view-content"),
			pp_qv_close_btn = pp_qv_modal.find("#pp-quick-view-close"),
			pp_qv_wrapper = pp_qv_modal.find(".pp-content-main-wrapper"),
			pp_qv_wrapper_w = pp_qv_wrapper.width(),
			pp_qv_wrapper_h = pp_qv_wrapper.height();

		$scope
			.off("click", ".pp-quick-view-btn")
			.on("click", ".pp-quick-view-btn", function (e) {
				e.preventDefault();

				var $this = $(this);
				var wrap = $this.closest("li.product");
				var product_id = $this.data("product_id");

				if (!pp_qv_modal.hasClass("loading")) {
					pp_qv_modal.addClass("loading");
				}

				if (!pp_quick_view_bg.hasClass("pp-quick-view-bg-ready")) {
					pp_quick_view_bg.addClass("pp-quick-view-bg-ready");
				}

				$(document).trigger("pp_quick_view_loading");

				pp_qv_ajax_call($this, product_id);
			});

		var pp_qv_ajax_call = function (t, product_id) {
			pp_qv_modal.css("opacity", 0);

			$.ajax({
				url: pp_woo_products_script.ajax_url,
				data: {
					action: "pp_woo_quick_view",
					product_id: product_id,
				},
				dataType: "html",
				type: "POST",
				success: function (data) {
					pp_qv_content.html(data);
					pp_qv_content_height();
				},
			});
		};

		var pp_qv_content_height = function () {
			// Variation Form
			var form_variation = pp_qv_content.find(".variations_form");

			form_variation.trigger("check_variations");
			form_variation.trigger("reset_image");

			if (!pp_qv_modal.hasClass("open")) {
				pp_qv_modal.removeClass("loading").addClass("open");

				var scrollbar_width = pp_get_scrollbar_width();
				var $html = $("html");

				$html.css("margin-right", scrollbar_width);
				$html.addClass("pp-quick-view-is-open");
			}

			var var_form = pp_qv_modal.find(".variations_form");
			if (
				var_form.length > 0 &&
				"function" === typeof var_form.wc_variation_form
			) {
				var_form.wc_variation_form();
				var_form.find("select").change();
			}

			pp_qv_content.imagesLoaded(function (e) {
				var image_slider_wrap = pp_qv_modal.find(".pp-qv-image-slider");

				if (image_slider_wrap.find("li").length > 1) {
					image_slider_wrap.flexslider({
						animation: "slide",
						start: function (slider) {
							setTimeout(function () {
								pp_update_summary_height(true);
							}, 300);
						},
					});
				} else {
					setTimeout(function () {
						pp_update_summary_height(true);
					}, 300);
				}
			});

			// stop loader
			$(document).trigger("pp_quick_view_loader_stop");
		};

		var pp_qv_close_modal = function () {
			// Close box by click overlay
			pp_qv_wrapper.on("click", function (e) {
				if (this === e.target) {
					pp_qv_close();
				}
			});

			// Close box with esc key
			$(document).keyup(function (e) {
				if (e.keyCode === 27) {
					pp_qv_close();
				}
			});

			// Close box by click close button
			pp_qv_close_btn.on("click", function (e) {
				e.preventDefault();
				pp_qv_close();
			});

			var pp_qv_close = function () {
				pp_quick_view_bg.removeClass("pp-quick-view-bg-ready");
				pp_qv_modal.removeClass("open").removeClass("loading");
				$("html").removeClass("pp-quick-view-is-open");
				$("html").css("margin-right", "");

				setTimeout(function () {
					pp_qv_content.html("");
				}, 600);
			};
		};

		var pp_update_summary_height = function (update_css) {
			var quick_view = pp_qv_content,
				img_height = quick_view
					.find(".product .pp-qv-image-slider")
					.first()
					.height(),
				summary = quick_view.find(".product .summary.entry-summary"),
				content = summary.css("content");

			if (
				"undefined" != typeof content &&
				544 == content.replace(/[^0-9]/g, "") &&
				0 != img_height &&
				null !== img_height
			) {
				summary.css("height", img_height);
			} else {
				summary.css("height", "");
			}

			if (true === update_css) {
				pp_qv_modal.css("opacity", 1);
			}
		};

		var pp_get_scrollbar_width = function () {
			var div = $(
				'<div style="width:50px;height:50px;overflow:hidden;position:absolute;top:-200px;left:-200px;"><div style="height:100px;"></div>'
			);
			// Append our div, do our calculation and then remove it
			$("body").append(div);
			var w1 = $("div", div).innerWidth();
			div.css("overflow-y", "scroll");
			var w2 = $("div", div).innerWidth();
			$(div).remove();

			return w1 - w2;
		};

		pp_qv_close_modal();
		//pp_update_summary_height();

		window.addEventListener("resize", function (event) {
			pp_update_summary_height();
		});

		/* Add to cart ajax */
		/**
		 * pp_add_to_cart_ajax class.
		 */
		var pp_add_to_cart_ajax = function () {
			modal_wrap
				.off(
					"click",
					"#pp-quick-view-content .single_add_to_cart_button"
				)
				.off("pp_added_to_cart")
				.on(
					"click",
					"#pp-quick-view-content .single_add_to_cart_button",
					this.onAddToCart
				)
				.on("pp_added_to_cart", this.updateButton);
		};

		/**
		 * Handle the add to cart event.
		 */
		pp_add_to_cart_ajax.prototype.onAddToCart = function (e) {
			e.preventDefault();

			var $form = $(this).closest('form');

			// If the form inputs are invalid
			if ( ! $form[0].checkValidity() ) {
				$form[0].reportValidity();
				return false;
			}

			var $thisbutton = $(this),
				product_id = $(this).val(),
				variation_id = $('input[name="variation_id"]').val() || "",
				quantity = $('input[name="quantity"]').val();

			// Set Quantity.
			//
			// For grouped product quantity should be array instead of single value
			// For that set the quantity as array for grouped product.
			if ( $scope.find('.woocommerce-grouped-product-list-item' ).length ) {
				var quantities = $('input.qty'),
					quantity   = [];
				$.each( quantities, function(index, val) {

					var name = $( this ).attr( 'name' );

					name = name.replace('quantity[','');
					name = name.replace(']','');
					name = parseInt( name );

					if ( $( this ).val() ) {
						quantity[ name ] = $( this ).val();
					}
				} );
			}

			var cartFormData = $form.serialize();

			if ( $thisbutton.is(".single_add_to_cart_button") ) {
				$thisbutton.removeClass("added");
				$thisbutton.addClass("loading");

				// Ajax action.
				if (variation_id != "") {
					jQuery.ajax({
						url: pp_woo_products_script.ajax_url,
						type: "POST",
						data:
							"action=pp_add_cart_single_product&product_id=" +
							product_id +
							"&nonce=" + pp_woo_products_script.add_cart_nonce +
							"&" + cartFormData,

						success: function (results) {
							// Trigger event so themes can refresh other areas.
							$(document.body).trigger("wc_fragment_refresh");
							$(document.body).trigger("pp_added_to_cart", [
								$thisbutton,
							]);
							$thisbutton.removeClass("loading");
							$thisbutton.addClass("added");
						},
					});
				} else {
					jQuery.ajax({
						url: pp_woo_products_script.ajax_url,
						type: "POST",
						data:
							"action=pp_add_cart_single_product&product_id=" +
							product_id +
							"&nonce=" + pp_woo_products_script.add_cart_nonce +
							"&" + cartFormData,

						success: function (results) {
							// Trigger event so themes can refresh other areas.
							$(document.body).trigger("wc_fragment_refresh");
							modal_wrap.trigger("pp_added_to_cart", [
								$thisbutton,
							]);
						},
					});
				}
			}
		};

		/**
		 * Update cart page elements after add to cart events.
		 */
		pp_add_to_cart_ajax.prototype.updateButton = function (e, button) {
			button = typeof button === "undefined" ? false : button;

			if ($(button)) {
				$(button).removeClass("loading");
				$(button).addClass("added");
				$(button).addClass("testng");

				// View cart text.
				if (
					! pp_woo_products_script.is_cart && 
					$(button).parent().find('.added_to_cart').length === 0
				) {
					$(button).after(
						' <a href="' +
						pp_woo_products_script.cart_url +
						'" class="added_to_cart wc-forward" title="' +
						pp_woo_products_script.view_cart +
						'">' + 
						pp_woo_products_script.view_cart + 
						'</a>'
					);
				}
			}
		};

		/**
		 * Init pp_add_to_cart_ajax.
		 */
		new pp_add_to_cart_ajax();
	};

	var RegisterPPAddCart = function ($scope, $) {
		//
		$layout = $scope.data("element_type");

		/* if (
			"pp-woo-products.skin-2" !== $layout &&
			"pp-woo-products-slider.slider-modern" !== $layout
		) {
			return;
		} */

		/* Add to cart for styles */
		var style_add_to_cart = function () {
			//fa-spinner

			$(document.body)
				.off(
					"click",
					".pp-product-actions .pp-add-to-cart-btn.product_type_simple"
				)
				.off("pp_product_actions_added_to_cart")
				.on(
					"click",
					".pp-product-actions .pp-add-to-cart-btn.product_type_simple",
					this.onAddToCart
				)
				.on("pp_product_actions_added_to_cart", this.updateButton);
		};

		/**
		 * Handle the add to cart event.
		 */
		style_add_to_cart.prototype.onAddToCart = function (e) {
			e.preventDefault();

			var $thisbutton = $(this),
				product_id = $thisbutton.data("product_id"),
				quantity = 1,
				cart_icon = $thisbutton.find("pp-action-item");

			$thisbutton.removeClass("added");
			$thisbutton.addClass("loading");

			jQuery.ajax({
				url: pp_woo_products_script.ajax_url,
				type: "POST",
				data:
					"action=pp_add_cart_single_product&product_id=" +
					product_id +
					"&quantity=" +
					quantity +
					"&nonce=" + pp_woo_products_script.add_cart_nonce,

				success: function (results) {
					// Trigger event so themes can refresh other areas.
					$(document.body).trigger("wc_fragment_refresh");
					$(document.body).trigger(
						"pp_product_actions_added_to_cart",
						[$thisbutton]
					);
				},
			});
		};

		/**
		 * Update cart page elements after add to cart events.
		 */
		style_add_to_cart.prototype.updateButton = function (e, button) {
			button = typeof button === "undefined" ? false : button;

			if ($(button)) {
				$(button).removeClass("loading");
				$(button).addClass("added");

				// Show view cart notice.
				if (
					!pp_woo_products_script.is_cart &&
					$(button).parent().find(".added_to_cart").length === 0 &&
					pp_woo_products_script.is_single_product
				) {
					$(button).after(
						' <a href="' +
							pp_woo_products_script.cart_url +
							'" class="added_to_cart wc-forward" title="' +
							pp_woo_products_script.view_cart +
							'">' +
							pp_woo_products_script.view_cart +
							"</a>"
					);
				}
			}
		};

		/**
		 * Init style_add_to_cart.
		 */
		new style_add_to_cart();
	};
	/**
	 * Function for Product Grid.
	 *
	 */
	var WidgetPPWooProducts = function ($scope, $, $panel) {
		if ("undefined" == typeof $scope) {
			return;
		}

		/* Slider */
		var slider_wrapper = $scope.find(".pp-woo-products-slider");

		if (slider_wrapper.length > 0) {
			var carouselWrap  = $scope.find( '.swiper-container-wrap' ).eq( 0 ),
				carousel      = $scope.find( '.pp-woo-products-inner' ).eq( 0 ),
				sliderOptions = JSON.parse(
					slider_wrapper.attr("data-woo_slider")
				);

				if ( carousel.length > 0 ) {
					if ( 'undefined' === typeof Swiper ) {
						var asyncSwiper = elementorFrontend.utils.swiper;
			
						new asyncSwiper( carousel, sliderOptions ).then( function( newSwiperInstance ) {
							var mySwiper = newSwiperInstance;
							ppSwiperSliderAfterinit( $scope, carousel, carouselWrap, sliderOptions, mySwiper, 'product' );
						} );
					} else {
						var mySwiper = new Swiper(carousel, sliderOptions);
						ppSwiperSliderAfterinit( $scope, carousel, carouselWrap, sliderOptions, mySwiper, 'product' );
					}
				}
		}

		if (!elementorFrontend.isEditMode()) {
			/* Common */
			RegisterPPQuickView($scope, $);
			/* Style specific cart button */
			RegisterPPAddCart($scope, $);
		}

		if (elementorFrontend.isEditMode()) {
			RegisterPPQuickView($scope, $);
		}
	};

	$( document )
	.off( 'click', '.pp-woocommerce-pagination a.page-numbers' )
	.on( 'click', '.pp-woocommerce-pagination a.page-numbers', function( e ) {

		$scope = $( this ).closest( '.elementor-widget-pp-woo-products' );

		if ( $scope.find( '.pp-woocommerce' ).hasClass( 'pp-woo-query-main' ) ) {
			return;
		}

		e.preventDefault();

		$scope.find( 'ul.products' ).after( '<div class="pp-woo-loader"><div class="pp-loader"></div><div class="pp-loader-overlay"></div></div>' );

		var widget_id = $scope.data( 'id' ),
			page_id = $scope.find( '.pp-woocommerce' ).data('page'),
			page_number = 1,
			curr = parseInt( $scope.find( '.pp-woocommerce-pagination .page-numbers.current' ).html() ),
			skin = $scope.find( '.pp-woocommerce' ).data( 'skin' );

		if ( $( this ).hasClass( 'next' ) ) {
			page_number = curr + 1;
		} else if ( $( this ).hasClass( 'prev' ) ) {
			page_number = curr - 1;
		} else {
			page_number = $( this ).html();
		}

		$.ajax({
			url: pp_woo_products_script.ajax_url,
			data: {
				action: 'pp_get_products',
				page_id: page_id,
				widget_id: widget_id,
				skin: skin,
				page_number: page_number,
				nonce: pp_woo_products_script.get_product_nonce,
			},
			dataType: 'json',
			type: 'POST',
			success: function ( data ) {
				$scope.find( '.pp-woo-loader' ).remove();

				$('html, body').animate({
					scrollTop: ( ( $scope.find( '.pp-woocommerce' ).offset().top ) - 30 )
				}, 'slow');

				var sel = $scope.find( '.pp-woo-products-inner ul.products' );

				sel.replaceWith( data.data.html );
				$scope.find( '.pp-woocommerce-pagination' ).replaceWith( data.data.pagination );
			}
		});

	} );

	/**
	 * Function for Product Grid.
	 *
	 */
	var WidgetPPWooAddToCart = function ($scope, $) {
		$("body")
			.off("added_to_cart.pp_cart")
			.on("added_to_cart.pp_cart", function (
				e,
				fragments,
				cart_hash,
				this_button
			) {
				if (
					$(this_button)
						.parent()
						.parent()
						.parent()
						.hasClass("elementor-widget-pp-woo-add-to-cart")
				) {
					$btn = $(this_button);

					if ($btn.length > 0) {
						// View cart text.
						if (
							!pp_woo_products_script.is_cart &&
							$btn.hasClass("added")
						) {
							if( $btn.hasClass( 'pp-redirect' ) ) {
								setTimeout(function () {
									window.location =
										pp_woo_products_script.cart_url;
								}, 500);
							}
						}
					}
				}
			});
	};

	/**
	 * Function for Product Categories.
	 *
	 */
	var WooOffcanvasCartHandler = function ($scope, $) {
		var container = $scope.find(".pp-offcanvas-cart-container");

		if ($(container).length > 0) {
			new PPOffcanvasContent($scope);
		}
	};

	/**
	 * Function for Product Categories.
	 *
	 */
	var WooCategoriesHandler = function ($scope, $) {
		/* Slider */
		var slider_wrapper = $scope.find(".pp-woo-categories-carousel");

		if (slider_wrapper.length > 0) {
			var carouselWrap  = $scope.find( '.swiper-container-wrap' ).eq( 0 ),
				carousel      = $scope.find( '.pp-woo-categories-inner' ).eq( 0 ),
				sliderOptions = JSON.parse(
					slider_wrapper.attr("data-cat-carousel-options")
				);

				if ( carousel.length > 0 ) {
					if ( 'undefined' === typeof Swiper ) {
						var asyncSwiper = elementorFrontend.utils.swiper;
			
						new asyncSwiper( carousel, sliderOptions ).then( function( newSwiperInstance ) {
							var mySwiper = newSwiperInstance;
							ppSwiperSliderAfterinit( $scope, carousel, carouselWrap, sliderOptions, mySwiper, 'category' );
						} );
					} else {
						var mySwiper = new Swiper(carousel, sliderOptions);
						ppSwiperSliderAfterinit( $scope, carousel, carouselWrap, sliderOptions, mySwiper, 'category' );
					}
				}
		}
	};

	/**
	 * Function for Woo Product Tabs
	 */

	var WooProductTabsHandler = function ($scope) {
		var $tabs = $scope.find(".wc-tabs-wrapper, .woocommerce-tabs, #rating");

		// Trigger WooCommerce's Single Product JS manually on widget load

		$tabs.trigger("init");
	};

	/**
	 * Function for Woo Add to Cart Notification
	 */
	var WooAddToCartNotificationHandler = function ($scope, $) {
		var cartForm = $(".single-product .cart");
		var stickyCartBtnArea = $(".pp-add-to-cart-sticky");

		if (stickyCartBtnArea.length <= 0 || cartForm.length <= 0) {
			return;
		}

		var totalOffset = cartForm.offset().top + cartForm.outerHeight();

		var addToCartStickyToggler = function () {
			var windowScroll = $(window).scrollTop();
			var windowHeight = $(window).height();
			var documentHeight = $(document).height();

			if (
				totalOffset < windowScroll &&
				windowScroll + windowHeight != documentHeight
			) {
				stickyCartBtnArea.addClass("pp-sticky-shown");
			} else if (
				windowScroll + windowHeight == documentHeight ||
				totalOffset > windowScroll
			) {
				stickyCartBtnArea.removeClass("pp-sticky-shown");
			}
		};
		addToCartStickyToggler();
		$(window).scroll(addToCartStickyToggler);

		// If Variations Product
		$(".pp-sticky-add-to-cart").on("click", function (e) {
			e.preventDefault();
			$("html, body").animate(
				{
					scrollTop: $(".single-product .cart").offset().top - 30,
				},
				500
			);
		});
	};
	
	var WooMiniCartHandler = function ($scope) {
		new PPWooMiniCart( $scope );
	};

	var WooMyAccountHandler = function ($scope, $) {

		$scope.find('button[name="save_address"], button[name="save_account_details"]').parent().addClass('pp-my-account-button');
	
	};

	/* Add to cart Quantity ajax */
	/**
	 * pp-add-to-cart-qty-ajax class.
	 */
	var pp_add_to_cart_quantity_ajax = function () {
		this.init();
	};

	pp_add_to_cart_quantity_ajax.prototype = {

		init: function() {
			this.bindEvents();
		},

		bindEvents: function() {
			var self = this;
			var ppAddToCartQtyAjax =  $( ".pp-woo-add-to-cart input.pp-add-to-cart-qty-ajax" );
			if ( $( ".pp-woo-add-to-cart input" ).hasClass( 'pp-add-to-cart-qty-ajax' ) ) {
				ppAddToCartQtyAjax.bind( 'keyup mouseup', function () {
					var ppAddToCartQtyAjaxVal = ppAddToCartQtyAjax.val();
					ppAddToCartQtyAjax.siblings( '.ajax_add_to_cart' ).attr( 'data-quantity', ppAddToCartQtyAjaxVal );
				} );
			}
		},
	}
	new pp_add_to_cart_quantity_ajax();

	$(window).on("elementor/frontend/init", function () {
		
		var widgets = {
			'pp-woo-products.skin-1':                  WidgetPPWooProducts,
			'pp-woo-products.skin-2':                  WidgetPPWooProducts,
			'pp-woo-products.skin-3':                  WidgetPPWooProducts,
			'pp-woo-products.skin-4':                  WidgetPPWooProducts,
			'pp-woo-products.skin-5':                  WidgetPPWooProducts,
			'pp-woo-add-to-cart.default':              WidgetPPWooAddToCart,
			'pp-woo-categories.default':               WooCategoriesHandler,
			'pp-woo-offcanvas-cart.default':           WooOffcanvasCartHandler,
			'pp-woo-add-to-cart-notification.default': WooAddToCartNotificationHandler,
			'pp-woo-mini-cart.default':                WooMiniCartHandler,
			'pp-woo-my-account.default':               WooMyAccountHandler,
		}

		$.each( widgets, function( widget, callback ) {
			elementorFrontend.hooks.addAction( 'frontend/element_ready/' + widget, callback );
		});

		//elementorFrontend.hooks.addAction('frontend/element_ready/pp-woo-product-tabs.default', WooProductTabsHandler);
	});
})(jQuery);
