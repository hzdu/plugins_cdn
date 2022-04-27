(function ($) {

    $(window).on('elementor/frontend/init', function () {

        var PremiumFacebookHandler = function ($scope, $) {

            var premiumFacebookFeedElement = $scope.find(".premium-facebook-feed-wrapper"),
                $loading = premiumFacebookFeedElement.find(".premium-loading-feed"),
                settings = premiumFacebookFeedElement.data("settings"),
                carousel = 'yes' === premiumFacebookFeedElement.data("carousel");

            if (!settings)
                return;

            $scope.find(".premium-social-feed-element-wrap").remove();

            function get_facebook_data() {
                premiumFacebookFeedElement
                    .find(".premium-social-feed-container")
                    .socialfeed({
                        facebook: {
                            accounts: [settings.accounts],
                            limit: settings.limit || 2,
                            access_token: settings.accessTok
                        },
                        length: settings.length || 130,
                        show_media: 'yes' === settings.showMedia,
                        readMore: settings.readMore,
                        template: settings.template,
                        adminPosts: settings.adminPosts,
                        callback: function () {
                            $loading.removeClass("premium-show-loading");
                            premiumFacebookFeedElement.imagesLoaded(function () {
                                handleFacebookFeed();
                            });
                        }
                    });
            }

            //new function for handling carousel option
            function handleFacebookFeed() {

                if (carousel) {

                    var autoPlay = 'yes' === premiumFacebookFeedElement.data("play"),
                        speed = premiumFacebookFeedElement.data("speed") || 5000,
                        rtl = premiumFacebookFeedElement.data("rtl"),
                        colsNumber = premiumFacebookFeedElement.data("col"),
                        prevArrow = '<a type="button" data-role="none" class="carousel-arrow carousel-prev" aria-label="Next" role="button" style=""><i class="fas fa-angle-left" aria-hidden="true"></i></a>',
                        nextArrow = '<a type="button" data-role="none" class="carousel-arrow carousel-next" aria-label="Next" role="button" style=""><i class="fas fa-angle-right" aria-hidden="true"></i></a>';

                    premiumFacebookFeedElement.find(".premium-social-feed-container").slick({
                        infinite: true,
                        slidesToShow: colsNumber,
                        slidesToScroll: colsNumber,
                        responsive: [{
                            breakpoint: 1025,
                            settings: {
                                slidesToShow: 1,
                                slidesToScroll: 1
                            }
                        },
                        {
                            breakpoint: 768,
                            settings: {
                                slidesToShow: 1,
                                slidesToScroll: 1
                            }
                        }
                        ],
                        autoplay: autoPlay,
                        autoplaySpeed: speed,
                        rows: 0,
                        rtl: rtl ? true : false,
                        nextArrow: nextArrow,
                        prevArrow: prevArrow,
                        draggable: true,
                        pauseOnHover: true
                    });
                }

                if (!carousel && settings.layout === "grid-layout" && !settings.even) {

                    var masonryContainer = premiumFacebookFeedElement.find(".premium-social-feed-container");

                    masonryContainer.isotope({
                        itemSelector: ".premium-social-feed-element-wrap",
                        percentPosition: true,
                        layoutMode: "masonry",
                        animationOptions: {
                            duration: 750,
                            easing: "linear",
                            queue: false
                        }
                    });
                }
            }

            $.ajax({
                url: get_facebook_data(),
                beforeSend: function () {
                    $loading.addClass("premium-show-loading");
                },
                error: function () {
                    console.log("error getting data from Facebook");
                }
            });
        };

        elementorFrontend.hooks.addAction('frontend/element_ready/premium-facebook-feed.default', PremiumFacebookHandler);
    });

})(jQuery);