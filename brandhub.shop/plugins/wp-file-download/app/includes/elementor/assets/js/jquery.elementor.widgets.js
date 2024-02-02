jQuery(document).ready(function ($) {
    if (jQuery('.elementor-control.elementor-control-wpfd_choose_file').length) {
        jQuery('.elementor-control.elementor-control-wpfd_choose_file').addClass('full-width');
    }
    if ($('section.elementor-section').length) {
        $(this).find('.shortcode').hide();
        $(this).find('.single-file-icon').show();
    }
    $('#wpfd-elementor-single-file a.noLightbox').on('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        var link = $(this).attr('href');
        window.location.href = link;
    });
    $('#wpfd-elementor-category a.wpfd_downloadlink').on('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        var link = $(this).attr('href');
        window.location.href = link;
    });
});