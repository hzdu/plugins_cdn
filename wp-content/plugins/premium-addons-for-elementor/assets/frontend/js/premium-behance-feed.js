(function ($) {

    $(window).on('elementor/frontend/init', function () {

        var PremiumBehanceFeedHandler = function ($scope, $) {
            var $behanceElem = $scope.find(".premium-behance-container"),
                $loading = $scope.find(".premium-loading-feed"),
                settings = $behanceElem.data("settings");

            function get_behance_data() {

                $behanceElem.embedBehance({
                    apiKey: 'XQhsS66hLTKjUoj8Gky7FOFJxNMh23uu',
                    userName: settings.username,
                    project: 'yes' === settings.project,
                    owners: 'yes' === settings.owner,
                    appreciations: 'yes' === settings.apprectiations,
                    views: 'yes' === settings.views,
                    publishedDate: 'yes' === settings.date,
                    fields: 'yes' === settings.fields,
                    projectUrl: 'yes' === settings.url,
                    infiniteScrolling: false,
                    description: 'yes' === settings.desc,
                    animationEasing: "easeInOutExpo",
                    ownerLink: true,
                    tags: true,
                    containerId: settings.id,
                    itemsPerPage: settings.number,
                    coverSize: settings.cover_size
                });
            }

            $.ajax({
                url: get_behance_data(),
                beforeSend: function () {
                    $loading.addClass("premium-show-loading");
                },
                success: function () {
                    $loading.removeClass("premium-show-loading");
                },
                error: function () {
                    console.log("error getting data from Behance");
                }
            });
        };

        elementorFrontend.hooks.addAction('frontend/element_ready/premium-behance-feed.default', PremiumBehanceFeedHandler);
    });
})(jQuery);