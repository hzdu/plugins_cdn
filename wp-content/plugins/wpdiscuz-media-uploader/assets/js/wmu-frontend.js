jQuery(document).ready(function ($) {

    if (wpdiscuzAjaxObj.wmuLazyLoadImages) {
        function wmuImagesInit() {
            var imgDefer = $('#wpdcom img');
            for (var i = 0; i < imgDefer.length; i++) {
                var wmuImg = $(imgDefer[i]);
                var wmuSrcAttr = wmuImg.attr('wmu-data-src');
                if (wmuSrcAttr) {
                    wmuImg.attr('src', wmuSrcAttr);
                }
            }
        }
        wmuImagesInit();
        wpdiscuzAjaxObj.wmuImagesInit = wmuImagesInit;
    }

});