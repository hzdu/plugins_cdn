(function ($) {
    
    //render timeline
    function render_timeline() {

        var $timeline_block = $('ul .timeline');
        //hide timeline blocks which are outside the viewport
        $timeline_block.each(function () {
            if ($(this).offset().top > $(window).scrollTop() + $(window).height() * 0.75) {
                $(this).find('.img_cropper, .wpcu-front-box.bottom').addClass('is-hidden');
            }
        });

        //on scolling, show/animate timeline blocks when enter the viewport
        $(window).on('scroll', function () {
            $timeline_block.each(function () {
                if ($(this).offset().top <= $(window).scrollTop() + $(window).height() * 0.75 && $(this).find('.img_cropper').hasClass('is-hidden')) {
                    $(this).find('.img_cropper, .wpcu-front-box.bottom').removeClass('is-hidden').addClass('bounce-in');
                }
            });
        });

    }

    $(document).ready(function () {
        render_timeline();
    })
    
})(jQuery);