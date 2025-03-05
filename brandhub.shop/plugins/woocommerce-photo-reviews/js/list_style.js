jQuery(document).ready(function ($) {
    'use strict';
    let isSafari = false;
    if (/iPad/i.test(navigator.userAgent) || (/Safari/i.test(navigator.userAgent) && /Apple Computer/.test(navigator.vendor) && !/Mobi|Android/i.test(navigator.userAgent))) {
        isSafari = true;
    } else {
        $('.wcpr-enable-box-shadow').addClass('wcpr-fix-box-shadow');
    }
    let current = -1;
    let slides;
    let swipeBoxIndex = 0;


    function triggerReviewClick() {
        $(document).on('click', '.wcpr-list-style-item,.wcpr-list-layout-2-style-item', function () {
            let i;
            // if (woocommerce_photo_reviews_params.masonry_popup ==='image'){
            //     slides = $('.wcpr-grid-item .reviews-images-container');
            //     i = slides.index($(this).find('.reviews-images-container'));
            // }else{
            switch (woocommerce_photo_reviews_params.display) {
                case "5":
                    slides = $('.wcpr-list-style-item');
                    break;
                case "6":
                    slides = $('.wcpr-list-layout-2-style-item');
                    break;
                default:
                    slides = $('.wcpr-grid-item');
                    break;
            }

            i = slides.index($(this));
            // }
            if (i >= 0) {
                showReview(i);
                wcpr_disable_scroll();
                // wcpr_helpful_button();
            }
        });
    }

    function wcpr_enable_scroll() {
        let scrollTop = parseInt($('html').css('top'));
        $('html').removeClass('wcpr-noscroll');
        window.scrollTo({top: -scrollTop, behavior: 'instant'})
    }

    function wcpr_disable_scroll() {
        if ($(document).height() > $(window).height()) {
            let scrollTop = ($('html').scrollTop()) ? $('html').scrollTop() : $('body').scrollTop(); // Works for Chrome, Firefox, IE...
            $('html').addClass('wcpr-noscroll').css('top', -scrollTop);
        }
    }

    function showReview(n) {
        swipeBoxIndex = 0;
        current = n;
        // if (!slides){
        //     if (woocommerce_photo_reviews_params.masonry_popup ==='image'){
        //         slides = $('.wcpr-grid-item .reviews-images-container');
        //     }else{
        //         slides = $('.wcpr-grid-item');
        //     }
        // }
        if (n >= slides.length) {
            current = 0
        }
        if (n < 0) {
            current = slides.length - 1
        }
        let $left_modal = $('#reviews-content-left-modal');
        let $left_main = $('#reviews-content-left-main'), $wrap_current;
        // if (woocommerce_photo_reviews_params.masonry_popup ==='image'){
        //     $wrap_current = slides.eq(current).closest('.wcpr-grid-item');
        // }else{
        $wrap_current = slides.eq(current);
        // }
        $left_modal.html('');
        $left_main.html('');
        if ($wrap_current.find('.reviews-images-container').length === 0) {
            $('.wcpr-modal-light-box').addClass('wcpr-no-images');
        } else {
            $left_modal.html(($wrap_current.find('.reviews-images-wrap-left').html()));
            let img_data = $wrap_current.find('.reviews-images-wrap-right').html();
            if (img_data) {
                $('.wcpr-modal-light-box').removeClass('wcpr-no-images');
                $left_main.html(img_data);
                $left_main.find('img').attr('src', $left_main.find('img').data('original_src') || $left_main.find('img').attr('src'));
            }
            $left_modal.find('.reviews-images').map(function () {
                let lazy_load_src = $(this).data('src');
                if (lazy_load_src) {
                    $(this).attr('src', lazy_load_src)
                }
            });
            $left_modal.find('.reviews-images').closest('a').on('click', function () {
                swipeBoxIndex = $(this).data('image_index');
                let current_image_src = $(this).attr('href');
                let temp = '';
                if (jQuery(this).hasClass('reviews-iframe') || jQuery(this).find('.reviews-iframe').length) {
                    temp = jQuery(`<iframe class="reviews-images reviews-iframe" data-original_src="${current_image_src}" src="${current_image_src}" frameborder="0" allowfullscreen></iframe>`);
                } else if (jQuery(this).hasClass('reviews-videos') || jQuery(this).find('.reviews-videos').length) {
                    temp = jQuery(`<video class="reviews-images reviews-videos" data-original_src="${current_image_src}" src="${current_image_src}" controls></video>`);
                } else {
                    current_image_src = $(this).data('image_src') || current_image_src;
                    temp = jQuery(`<img class="reviews-images" data-original_src="${current_image_src}" src="${current_image_src}">`);
                    temp.attr('title', $left_main.find('.reviews-images').attr('title'));
                }
                temp.attr({
                    width: $left_main.find('.reviews-images').attr('width'),
                    height: $left_main.find('.reviews-images').attr('width')
                });
                $left_main.find('.reviews-images').replaceWith(temp);
                $left_main.find('source').attr('srcset', current_image_src);
                $left_main.find('.wcpr-review-image-caption').html($(this).data('image_caption'));
                return false;
            });
        }
        $('#reviews-content-right .reviews-content-right-meta').html($wrap_current.find('.review-content-container').html());
        $('.wcpr-modal-light-box').fadeIn(200);
    }

    switch (woocommerce_photo_reviews_params.display) {
        case "5":
            slides = $('.wcpr-list-style-item');
            break;
        case "6":
            slides = $('.wcpr-list-layout-2-style-item');
            break;
        default:
            slides = $('.wcpr-grid-item');
            break;
    }
    $('.wcpr-close').on('click', function () {
        wcpr_enable_scroll();
        $('.wcpr-modal-light-box').fadeOut(200);
        current = -1;

    });
    $('.wcpr-modal-light-box .wcpr-overlay').on('click', function () {
        wcpr_enable_scroll();
        $('.wcpr-modal-light-box').fadeOut(200);
        current = -1;
    });
    $('#reviews-content-left-main').on('click', '.reviews-images', function () {
        let this_image = $(this);
        let data = [];
        $('#reviews-content-left-modal').find('a').map(function () {
            let current_image = $(this).find('.reviews-images');
            let href = $(this).data('image_src') ? $(this).data('image_src') : current_image.attr('src');
            let title = $(this).data('image_caption') ? $(this).data('image_caption') : ((parseInt($(this).data('image_index')) + 1) + '/' + $('#reviews-content-left-modal').find('a').length);
            data.push({href: href, title: title});
        });
        if (data.length == 0) {
            data.push({
                href: this_image.data('original_src') ? this_image.data('original_src') : this_image.attr('src'),
                title: this_image.parent().find('.wcpr-review-image-caption').html()
            });
        }
        $.swipebox(data, {hideBarsDelay: 100000, initialIndexOnArray: swipeBoxIndex})
    });

    $(document).keydown(function (e) {
        if ($.swipebox.isOpen) {
            return;
        }
        if ($('.wcpr-modal-light-box').css('display') == 'none') {
            return;
        }
        if (e.keyCode == 27) {
            wcpr_enable_scroll();
            $('.wcpr-modal-light-box').fadeOut(200);
            current = -1;
        }
        if (current != -1) {
            if (e.keyCode == 37) {
                showReview(current -= 1);
            }
            if (e.keyCode == 39) {
                showReview(current += 1);
            }
        }
    });
    triggerReviewClick();
    $('.wcpr-next').on('click', function () {
        showReview(current += 1);
    });
    $('.wcpr-prev').on('click', function () {
        showReview(current -= 1);
    });


    jQuery(document.body).on('click', '.wcpr-read-more', function (e) {
        e.stopPropagation();
        let $button = $(this);
        let $comment_content = $button.closest('.wcpr-review-content');
        let $comment_content_full = $comment_content.find('.wcpr-review-content-full');
        let comment_content_full = $comment_content_full.html();
        if (comment_content_full) {
            $comment_content.html(comment_content_full);
        }
        $comment_content.closest('.wcpr-grid-item').removeClass('wcpr-grid-item-init');
        wcpr_resize_masonry_items(true);
    });
    return false;
});
