jQuery(document).ready(function ($) {

    var get_hash = window.location.hash;
    var clean_hash = get_hash.split('$');

    var hash = $(location).attr('hash').split('#tab=')[1];

    if (typeof hash != 'undefined') {
        $('#' + hash + '-tab').addClass("nav-tab-active");
        $('#' + hash).addClass("active");
    } else {
        if (typeof sessionStorage != 'undefined') {
            var seopress_tab_session_storage = sessionStorage.getItem("seopress_woocommerce_tab");

            if (clean_hash[1] == '1') { //WooCommerce Tab
                $('#tab_seopress_woocommerce-tab').addClass("nav-tab-active");
                $('#tab_seopress_woocommerce').addClass("active");
            } else if (clean_hash[1] == '2') { //Breadcrumbs Tab
                $('#tab_seopress_breadcrumbs-tab').addClass("nav-tab-active");
                $('#tab_seopress_breadcrumbs').addClass("active");
            } else if (clean_hash[1] == '3') { //Page Speed Tab
                $('#tab_seopress_page_speed-tab').addClass("nav-tab-active");
                $('#tab_seopress_page_speed').addClass("active");
            } else if (clean_hash[1] == '4') { //Robots Tab
                $('#tab_seopress_robots-tab').addClass("nav-tab-active");
                $('#tab_seopress_robots').addClass("active");
            } else if (clean_hash[1] == '5') { //Google News Tab
                $('#tab_seopress_news-tab').addClass("nav-tab-active");
                $('#tab_seopress_news').addClass("active");
            } else if (clean_hash[1] == '6') { //404 Tab
                $('#tab_seopress_404-tab').addClass("nav-tab-active");
                $('#tab_seopress_404').addClass("active");
            } else if (clean_hash[1] == '7') { //htaccess Tab
                $('#tab_seopress_htaccess-tab').addClass("nav-tab-active");
                $('#tab_seopress_htaccess').addClass("active");
            } else if (clean_hash[1] == '8') { //Dublin Core Tab
                $('#tab_seopress_dublin_core-tab').addClass("nav-tab-active");
                $('#tab_seopress_dublin_core').addClass("active");
            } else if (clean_hash[1] == '9') { //Rich Snippets Tab
                $('#tab_seopress_rich_snippets-tab').addClass("nav-tab-active");
                $('#tab_seopress_rich_snippets').addClass("active");
            } else if (clean_hash[1] == '10') { //Local Business Tab
                $('#tab_seopress_local_business-tab').addClass("nav-tab-active");
                $('#tab_seopress_local_business').addClass("active");
            } else if (clean_hash[1] == '11') { //RSS Tab
                $('#tab_seopress_rss-tab').addClass("nav-tab-active");
                $('#tab_seopress_rss').addClass("active");
            } else if (clean_hash[1] == '13') { //Easy Digital Downloads Tab
                $('#tab_seopress_edd-tab').addClass("nav-tab-active");
                $('#tab_seopress_edd').addClass("active");
            } else if (clean_hash[1] == '14') { //Rewrite Tab
                $('#tab_seopress_rewrite-tab').addClass("nav-tab-active");
                $('#tab_seopress_rewrite').addClass("active");
            } else if (clean_hash[1] == '15') { //White Label Tab
                $('#tab_seopress_white_label-tab').addClass("nav-tab-active");
                $('#tab_seopress_white_label').addClass("active");
            } else if (clean_hash[1] == '16') { //Inspect URL Tab
                $('#tab_seopress_inspect_url-tab').addClass("nav-tab-active");
                $('#tab_seopress_inspect_url').addClass("active");
            } else if (seopress_tab_session_storage) {
                $('#seopress-tabs').find('.nav-tab.nav-tab-active').removeClass("nav-tab-active");
                $('#seopress-tabs').find('.seopress-tab.active').removeClass("active");

                $('#' + seopress_tab_session_storage.split('#tab=') + '-tab').addClass("nav-tab-active");
                $('#' + seopress_tab_session_storage.split('#tab=')).addClass("active");
            } else {
                //Default TAB
                $('#tab_seopress_local_business-tab').addClass("nav-tab-active");
                $('#tab_seopress_local_business').addClass("active");
            }
        }
    };
    $("#seopress-tabs").find("a.nav-tab").click(function (e) {
        e.preventDefault();
        var hash = $(this).attr('href').split('#tab=')[1];

        $('#seopress-tabs').find('.nav-tab.nav-tab-active').removeClass("nav-tab-active");
        $('#' + hash + '-tab').addClass("nav-tab-active");

        if (clean_hash[1] == 1) {
            sessionStorage.setItem("seopress_woocommerce_tab", 'tab_seopress_woocommerce');
        } else if (clean_hash[1] == 2) {
            sessionStorage.setItem("seopress_woocommerce_tab", 'tab_seopress_breadcrumbs');
        } else if (clean_hash[1] == 3) {
            sessionStorage.setItem("seopress_woocommerce_tab", 'tab_seopress_page_speed');
        } else if (clean_hash[1] == 4) {
            sessionStorage.setItem("seopress_woocommerce_tab", 'tab_seopress_robots');
        } else if (clean_hash[1] == 5) {
            sessionStorage.setItem("seopress_woocommerce_tab", 'tab_seopress_news');
        } else if (clean_hash[1] == 6) {
            sessionStorage.setItem("seopress_woocommerce_tab", 'tab_seopress_404');
        } else if (clean_hash[1] == 7) {
            sessionStorage.setItem("seopress_woocommerce_tab", 'tab_seopress_htaccess');
        } else if (clean_hash[1] == 8) {
            sessionStorage.setItem("seopress_woocommerce_tab", 'tab_seopress_dublin_core');
        } else if (clean_hash[1] == 9) {
            sessionStorage.setItem("seopress_woocommerce_tab", 'tab_seopress_rich_snippets');
        } else if (clean_hash[1] == 10) {
            sessionStorage.setItem("seopress_woocommerce_tab", 'tab_seopress_local_business');
        } else if (clean_hash[1] == 11) {
            sessionStorage.setItem("seopress_woocommerce_tab", 'tab_seopress_rss');
        } else if (clean_hash[1] == 13) {
            sessionStorage.setItem("seopress_woocommerce_tab", 'tab_seopress_edd');
        } else if (clean_hash[1] == 14) {
            sessionStorage.setItem("seopress_woocommerce_tab", 'tab_seopress_rewrite');
        } else if (clean_hash[1] == 15) {
            sessionStorage.setItem("seopress_woocommerce_tab", 'tab_seopress_white_label');
        } else if (clean_hash[1] == 16) {
            sessionStorage.setItem("seopress_woocommerce_tab", 'tab_seopress_inspect_url');
        } else {
            sessionStorage.setItem("seopress_woocommerce_tab", hash);
        }

        $('#seopress-tabs').find('.seopress-tab.active').removeClass("active");
        $('#' + hash).addClass("active");
    });
    //Robots
    $('#seopress-tag-robots-1, #seopress-tag-robots-2, #seopress-tag-robots-3, #seopress-tag-robots-4, #seopress-tag-robots-5, #seopress-tag-robots-6, #seopress-tag-robots-7').click(function () {
        $(".seopress_robots_file").val($(".seopress_robots_file").val() + '\n' + $(this).attr('data-tag'));
    });
    //Breadcrumbs
    $('#seopress-tag-breadcrumbs-1, #seopress-tag-breadcrumbs-2, #seopress-tag-breadcrumbs-3, #seopress-tag-breadcrumbs-4, #seopress-tag-breadcrumbs-5').click(function () {
        $(".seopress_breadcrumbs_sep").val($(".seopress_breadcrumbs_sep").val() + '\n' + $(this).attr('data-tag'));
    });

    //Rich Snippets Media Uploader
    var mediaUploader;
    $('#seopress_rich_snippets_publisher_logo_upload').click(function (e) {
        e.preventDefault();
        // If the uploader object has already been created, reopen the dialog
        if (mediaUploader) {
            mediaUploader.open();
            return;
        }
        // Extend the wp.media object
        mediaUploader = wp.media.frames.file_frame = wp.media({
            multiple: false
        });

        // When a file is selected, grab the URL and set it as the text field's value
        mediaUploader.on('select', function () {
            attachment = mediaUploader.state().get('selection').first().toJSON();
            $('#seopress_rich_snippets_publisher_logo_meta').val(attachment.url);
            $('#seopress_rich_snippets_publisher_logo_width').val(attachment.width);
            $('#seopress_rich_snippets_publisher_logo_height').val(attachment.height);
        });
        // Open the uploader dialog
        mediaUploader.open();
    });
});
