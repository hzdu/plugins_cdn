/**
 * Script for customizer preview.
 */
(function ( $, api ){

    var quick_customizer_sections = {
        '#header' : 'pencidesign_logo_header_general_section',
        '#widget-area' : 'penci_section_footer_widgets_section',
        '#navigation' : 'pencidesign_logo_header_primary_menu_section',
        '.featuredsl-customizer' : 'penci_section_fslider_general_section',
        '.home-featured-cat' : 'penci_section_homepage_featured_cat_section',
        '.penci-homepage-title' : 'penci_section_homepage_title_box_section',
        '#footer-section' : 'penci_section_footer_general_section',
        '.penci-wrapper-posts-content' : 'penci_section_homepage_general_section',
        '.penci-home-popular-posts': 'penci_section_homepage_popular_posts_section',
        'body.single article.post': 'penci_section_spost_general_section',
        'body.single .post-related': 'penci_section_spost_related_posts_section',
        'body.single #comments': 'penci_section_spost_comments_section',
        '#sidebar': 'penci_section_sidebar_general_section',
        '.penci-wrapper-posts-content .standard-article,#main .standard-article': 'penci_section_standard_classic_section',
        '.penci-wrapper-posts-content ul.penci-grid li,.penci-wrapper-data li': 'penci_section_other_layouts_section',
        '.penci-wrapper-posts-content .grid-overlay,.penci-wrapper-data .grid-overlay': 'penci_section_other_layouts_section',
        '.penci-wrapper-posts-content .grid-featured,.penci-wrapper-data .grid-featured': 'penci_section_other_layouts_section',
        '.penci-wrapper-posts-content .item-masonry,.penci-wrapper-data .item-masonry': 'penci_section_other_layouts_section',
        '.penci-wrapper-posts-content .grid-mixed,.penci-wrapper-data .grid-mixed': 'penci_section_other_layouts_section',
        'body.category .penci-wrapper-data': 'pencidesign_general_archive_page_section',
        '#widget-area .footer-widget-wrapper': 'widgets_edit',
        '#sidebar-nav': 'pencidesign_logo_header_verticalnav_section',
        '.penci-menu-hbg': 'penci_menu_hbg_section',
    }

    var $image = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M13.89 3.39l2.71 2.72c.46.46.42 1.24.03 1.64l-8.01 8.02-5.56 1.16 1.16-5.58s7.6-7.63 7.99-8.03c.39-.39 1.22-.39 1.68.07zm-2.73 2.79l-5.59 5.61 1.11 1.11 5.54-5.65zm-2.97 8.23l5.58-5.6-1.07-1.08-5.59 5.6z"/></svg>';

    for (const [selector, identifier] of Object.entries(quick_customizer_sections)) {
        $(selector).css('position','relative');
        if ( identifier == 'widgets_edit' ) {
            $(selector).append('<a class="soledad-customizer-edit-link custom-link '+identifier+'" data-href="'+ PenciPreview.widgetURL +'"><button>'+$image+'</button></a>');
        } else {
            $(selector).append('<span class="soledad-customizer-edit-link" data-section="'+ identifier +'"><button>'+$image+'</button></span>');
        }
        
    }

})( jQuery, wp.customize );