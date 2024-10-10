(function ($, elementor) {
    "use strict";
    var UWCCElements = {

        init: function () {

            var widgets = {
                'uwcc-ajax-cart-quantity-items.default': UWCCElements.cartController,
                'uwcc-ajax-cart-products.default': UWCCElements.cartController,
                'uwcc-ajax-cart-amounts.default': UWCCElements.cartController,
                'uwcc-coupon-code-list.default': UWCCElements.couponCodeListController,
                'uwcc-coupon-code-form.default': UWCCElements.couponCodeFormController,
                'uwcc-suggested-products.default': UWCCElements.suggestedProductsController,
                'uwcc-checkout-form.default': UWCCElements.checkoutFormController,
                'uwcc-add-to-cart-button.default': UWCCElements.addToCartButtonController
            };

            $.each(widgets, function (widget, callback) {
                elementor.hooks.addAction('frontend/element_ready/' + widget, callback);
            });
        },

        cartController: function ($scope) {
            $(document.body).trigger('wc_fragment_refresh');
        },
        suggestedProductsController: function ($scope) {
            $(document.body).trigger('uwcc_change_slider_products');

            if ($scope.find('.uwcc-slide.owl-carousel').length) {

                var params = JSON.parse($scope.find('.uwcc-slide.owl-carousel').attr('data-params'));

                $scope.find('.uwcc-slide.owl-carousel').owlCarousel({
                    items: params.items,
                    loop: JSON.parse(params.loop),
                    autoplay: JSON.parse(params.autoplay),
                    autoplayTimeout: params.pause,
                    autoplayHoverPause: JSON.parse(params.pause_on_hover),
                    nav: JSON.parse(params.arrows),
                    dots: JSON.parse(params.dots),
                    margin: 15,
                    responsiveClass: true,
                    rtl: JSON.parse(uwcc_ajax_object.rtl),
                    responsive: {
                        0: {
                            items: params.items_mobile
                        },
                        580: {
                            items: params.items_tablet
                        },
                        800: {
                            items: params.items
                        }
                    }
                });
            }
        },
        couponCodeListController: function ($scope) {
            $scope.find('.uwcc-el-heading-trigger h4').on('click', function () {
                $(this).next('.uwcc-el-coupons-list-wrapper').slideToggle();
            });
        },
        couponCodeFormController: function ($scope) {
            $scope.find('.uwcc-el-heading-trigger h4').on('click', function () {
                $(this).next('.uwcc-coupon-form-wrap').slideToggle();
            });
        },
        checkoutFormController: function ($scope) {
            $scope.find('#createaccount').on('click', function () {
                $(this).closest('.woocommerce-account-fields').find('div.create-account').slideToggle();
            });

            if ($scope.find('.woocommerce').is(':empty')) {
                $scope.find('.woocommerce').html('CheckOut Form Preview Issue - Click here and refresh the content');
                $scope.find('.elementor-widget-container').css({
                    background: '#FF0000',
                    color: '#FFF',
                    padding: '20px',
                    textAlign: 'center'
                });
            }
        },
        addToCartButtonController: function ($scope) {
            $scope.find('.uwcc-change-cart-quantity').on('change, keyup', function (e) {
                $scope.find('.uwcc-add-to-cart').attr('data-quantity', e.target.value);
            })
        },
    };
    $(window).on('elementor/frontend/init', UWCCElements.init);
}(jQuery, window.elementorFrontend));
