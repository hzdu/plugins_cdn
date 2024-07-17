jQuery(window).on('elementor/frontend/init', () => {
    'use strict';
    elementorFrontend.hooks.addAction('frontend/element_ready/woocommerce-photo-reviews.default', function ($scope) {
        if (!window.elementor) {
            return;
        }
        wcpr_helpful_button();
        viwcpr_flexslider();
    });
});
jQuery(document).ready(function ($) {
    'use strict';
    let image_caption_enable = woocommerce_photo_reviews_params.image_caption_enable == 1;
    let i18n_image_caption = woocommerce_photo_reviews_params.i18n_image_caption;
    function getSelectedImageHtml(src, name, error='') {
        let selectImageHtml;
        let temp =`<img title="${name}" src="${src}" class="wcpr-selected-image-preview">`;
        if (src.indexOf('data:video/') > -1){
            temp = `<video class="wcpr-selected-image-preview" height="100%" width="100%" src="${src}" controls >${name}</video>`;
        }
        if (error){
            selectImageHtml = `<div class="wcpr-selected-image">${temp}<div class="wcpr-selected-image-info"><div class="wcpr-selected-image-name wcpr-comment-form-error" >${error}</div></div></div>`;
        }else if (image_caption_enable) {
            selectImageHtml = `<div class="wcpr-selected-image">${temp}<div class="wcpr-selected-image-info"><div class="wcpr-selected-image-name" title="${name}">${name}</div><input class="wcpr-selected-image-caption" type="text" name="wcpr_image_caption[]" placeholder="${i18n_image_caption}"></div></div>`;
        } else {
            selectImageHtml = `<div class="wcpr-selected-image">${temp}<div class="wcpr-selected-image-info"><div class="wcpr-selected-image-name" title="${name}">${name}</div></div></div>`;
        }
        return selectImageHtml;
    }

    function readURL(input) {
        let max_file_size = 1024 * parseFloat(woocommerce_photo_reviews_params.max_file_size);
        for (let i = 0; i < input.files.length; i++) {
            var reader = new FileReader();

            reader.onload = function (e) {
                let error ='';
                if (input.files[i].size > max_file_size){
                    error= woocommerce_photo_reviews_params.warning_max_file_size.replace('%file_name%',input.files[i].name);
                }else if (woocommerce_photo_reviews_params.upload_allow.indexOf(input.files[i].type) === -1){
                    error=woocommerce_photo_reviews_params.warning_upload_allow.replace('%file_name%',input.files[i].name);
                }
                $(input).parent().find('.wcpr-selected-image-container').append(getSelectedImageHtml(e.target.result, input.files[i].name, error))
            };

            reader.readAsDataURL(input.files[i]); // convert to base64 string
        }
    }

    /*helpful button*/
    wcpr_helpful_button();
    viwcpr_flexslider();
    let max_files = woocommerce_photo_reviews_params.max_files;
    $('#commentform').on('change', '.wcpr_image_upload', function (e) {
        $(this).parent().find('.wcpr-selected-image-container').html('');
        if (this.files.length > max_files) {
            jQuery('.wcpr-comment-form-error-wraps').removeClass('wcpr-hidden').html(woocommerce_photo_reviews_params.warning_max_files);
            $(this).val('');
            return false;
        } else if (this.files.length > 0) {
            jQuery('.wcpr-comment-form-error-wraps').addClass('wcpr-hidden');
            readURL(this);
        }
    });
    jQuery(document).on('click','.wcpr_image_upload_button',function (e) {
        e.preventDefault();
        e.stopPropagation();
        jQuery(this).parent().find('.wcpr_image_upload').trigger('click');
    });

    $('#commentform').find('input[type="submit"]').on('click', function (e) {
        let $button = $(this);
        if ($button.hasClass('viwcpr_form_checked') || !$('#wcpr_image_upload_nonce').length){
            return true;
        }
        let $container = $button.closest('form');
        let $content = $container.find('textarea[id="comment"]') || $container.find('textarea[name="comment"]');
        let $name = $container.find('input[name="author"]');
        let $email = $container.find('input[name="email"]');
        jQuery('.wcpr-comment-form-error-wraps').addClass('wcpr-hidden');
        jQuery('.wcpr-comment-form-notify-wraps').addClass('wcpr-hidden');
        let $rating = $container.find( '#rating' ),
            rating  = $rating.val();
        if ( $rating.length > 0 && ! rating && woocommerce_photo_reviews_params.review_rating_required === 'yes' ) {
            jQuery('.wcpr-comment-form-error-wraps').removeClass('wcpr-hidden').html(woocommerce_photo_reviews_params.i18n_required_rating_text);
            e.preventDefault();
            return false;
        }
        if ($content.length > 0 ) {
            let comment = $content.val();
            if (!comment && woocommerce_photo_reviews_params.allow_empty_comment != 1) {
                jQuery('.wcpr-comment-form-error-wraps').removeClass('wcpr-hidden').html(woocommerce_photo_reviews_params.i18n_required_comment_text);
                e.preventDefault();
                $content.focus();
                return false;
            }
            let minimum_comment_length = parseInt(woocommerce_photo_reviews_params.minimum_comment_length);
            if (minimum_comment_length && minimum_comment_length > comment.length){
                jQuery('.wcpr-comment-form-error-wraps').removeClass('wcpr-hidden').html(woocommerce_photo_reviews_params.i18n_minimum_comment_text);
                e.preventDefault();
                $content.focus();
                return false;
            }
        }
        if ($name.length > 0 && $name.attr('required') && !$name.val()) {
            jQuery('.wcpr-comment-form-error-wraps').removeClass('wcpr-hidden').html(woocommerce_photo_reviews_params.i18n_required_name_text);
            e.preventDefault();
            $name.focus();
            return false;
        }
        if ($email.length > 0 && $email.attr('required') && !$email.val()) {
            jQuery('.wcpr-comment-form-error-wraps').removeClass('wcpr-hidden').html(woocommerce_photo_reviews_params.i18n_required_email_text);
            e.preventDefault();
            $email.focus();
            return false;
        }
        if ($container.find('input[name="wcpr_gdpr_checkbox"]').prop('checked') === false) {
            jQuery('.wcpr-comment-form-error-wraps').removeClass('wcpr-hidden').html(woocommerce_photo_reviews_params.warning_gdpr);
            e.preventDefault();
            return false;
        }
        if ('on' === woocommerce_photo_reviews_params.enable_photo) {
            if (!$container.attr('enctype') || $container.attr('enctype') !== 'multipart/form-data') {
                $container.attr('enctype', 'multipart/form-data');
            }
            let $fileUpload = $container.find('.wcpr_image_upload');
            if ($fileUpload.length > 0) {
                let file_upload = $fileUpload.get(0).files;
                let imagesCount = parseInt(file_upload.length);
                if ('on' === woocommerce_photo_reviews_params.required_image && imagesCount === 0) {
                    jQuery('.wcpr-comment-form-error-wraps').removeClass('wcpr-hidden').html(woocommerce_photo_reviews_params.warning_required_image);
                    e.preventDefault();
                    return false;
                }
                if (imagesCount > max_files) {
                    jQuery('.wcpr-comment-form-error-wraps').removeClass('wcpr-hidden').html(woocommerce_photo_reviews_params.warning_max_files);
                    e.preventDefault();
                    return false;
                }
                let error=[], max_file_size = 1024 * parseFloat(woocommerce_photo_reviews_params.max_file_size);
                jQuery.each(file_upload,function (k,v) {
                    if (v.size > max_file_size){
                        error.push('<p>'+woocommerce_photo_reviews_params.warning_max_file_size.replace('%file_name%',v.name)+'</p>');
                        return true;
                    }
                    if (woocommerce_photo_reviews_params.upload_allow.indexOf(v.type) === -1){
                        error.push('<p>'+woocommerce_photo_reviews_params.warning_upload_allow.replace('%file_name%',v.name)+'</p>');
                    }
                });
                if (error.length){
                    jQuery('.wcpr-comment-form-error-wraps').removeClass('wcpr-hidden').html(error.join(''));
                    e.preventDefault();
                    return false;
                }
            } else if ('on' === woocommerce_photo_reviews_params.required_image) {
                jQuery('.wcpr-comment-form-error-wraps').removeClass('wcpr-hidden').html(woocommerce_photo_reviews_params.warning_required_image);
                e.preventDefault();
                return false;
            }
        }
        jQuery('.wcpr-comment-form-notify-wraps').removeClass('wcpr-hidden');
        if (woocommerce_photo_reviews_params.restrict_number_of_reviews) {
            $button.attr('type','button');
            let restrict_number_of_reviews = async function () {
                let error = '',data =new FormData($container[0]);
                if ($content.val() && !$container.find('textarea[name="comment"]').val()){
                    data.set('comment',$content.val()) ;
                }
                await new Promise(function (resolve) {
                    $.ajax({
                        type: 'post',
                        url: woocommerce_photo_reviews_params.wc_ajax_url.toString().replace('%%endpoint%%', 'viwcpr_restrict_number_of_reviews'),
                        processData: false,
                        cache: false,
                        contentType: false,
                        data: data,
                        success: function (response) {
                            if (response.error){
                                error = response.error;
                            }else {
                                if (response.remove_upload_file) {
                                    $container.find('.wcpr_image_upload').val('');
                                }
                                if (response.img_id) {
                                    $container.append(`<input type="hidden" name="wcpr_image_upload_id" value="${response.img_id}">`);
                                }
                            }
                            resolve(error);
                        },
                        error:function (err){
                            error = err.responseText === '-1' ? err.statusText : err.responseText;
                            resolve(error)
                        }
                    });
                });
                return error;
            };
            restrict_number_of_reviews().then(function (error) {
                $button.attr('type','submit');
                if (error) {
                    jQuery('.wcpr-comment-form-notify-wraps').addClass('wcpr-hidden');
                    jQuery('.wcpr-comment-form-error-wraps').removeClass('wcpr-hidden').html(error);
                    e.preventDefault();
                    return false;
                }else {
                    $button.addClass('viwcpr_form_checked').trigger('click');
                }
            });
        }
    });
    let comments = woocommerce_photo_reviews_params.hasOwnProperty('comments_container_id') ? woocommerce_photo_reviews_params.comments_container_id : 'comments';
    let $comments = $('#' + comments);
    if ($comments.length > 0) {
        append_filters_and_overall_rating();
        handle_ajax_pagination_and_loadmore();
    } else {
        $(document).on('skeleton-loaded', function () {
            $comments = $('#' + comments);
            append_filters_and_overall_rating();
            handle_ajax_pagination_and_loadmore();
        });
    }

    $(document).on('click', '.reviews_tab', function () {
        $comments = $('#' + comments);
        append_filters_and_overall_rating();
    });

    function handle_ajax_pagination_and_loadmore() {
        /*Ajax pagination*/
        if (woocommerce_photo_reviews_params.pagination_ajax && $comments.length) {
            let $pagination_container = $comments.find('.woocommerce-pagination');
            if (woocommerce_photo_reviews_params.loadmore_button) {
                $pagination_container.html(jQuery('.wcpr-load-more-reviews-button-modal').html());
                wcpr_pagination_loadmore($comments, $comments.find('.woocommerce-pagination'));
            } else {
                wcpr_pagination_basic($comments, $comments.find('.woocommerce-pagination'));
            }
        } else if (jQuery('.et_divi_theme').length) {
            jQuery('a.wcpr-filter-button').on('click', function () {
                location.href = jQuery(this).attr('href');
            })
        }
    }

    function append_filters_and_overall_rating() {
        $comments.prepend($('.wcpr-filter-container')).prepend($('.wcpr-overall-rating-and-rating-count')).prepend($('.woocommerce-Reviews-title').eq(0));
    }
});

function wcpr_pagination_basic($comments, $pagination_container) {
    $comments = jQuery($comments);
    $pagination_container = jQuery($pagination_container);
    let ajax_pagination_running = false;
    jQuery(document).on('click', '.woocommerce-pagination a', function (e) {
        if (ajax_pagination_running) {
            return false;
        }
        e.preventDefault();
        e.stopPropagation();
        let $container = woocommerce_photo_reviews_params.display === '1' ? $comments.find('.wcpr-grid') : $comments.find(woocommerce_photo_reviews_params.container);
        let scrollTop = parseInt($container.offset().top) - 200;
        window.scrollTo({top: scrollTop, behavior: 'smooth'});
        ajax_pagination_running = true;
        let url = jQuery(this).attr('href');
        if (!$container.find('.wcpr-grid-overlay').length) {
            $container.append('<div class="wcpr-grid-overlay wcpr-hidden"></div>');
        }
        let $overlay = $container.find('.wcpr-grid-overlay');
        $overlay.removeClass('wcpr-hidden');
        jQuery.ajax({
            url: url,
            type: 'get',
            success: function (response) {
                if (response) {
                    // response = response.replace(/(\r\n\t|\n|\r\t)/gm, "");
                    // console.log(response)
                    let $reg;
                    let temp_html = jQuery(response);
                    if (woocommerce_photo_reviews_params.display === '1') {
                        $container.html(temp_html.find('.wcpr-grid').html());
                        // $reg = new RegExp('<div class="' + woocommerce_photo_reviews_params.grid_class + '" data-wcpr_columns="'+$container.data('wcpr_columns')+'">([^]+?)<div class="wcpr-grid-overlay', 'gm');
                    } else {
                        $container.html(temp_html.find(woocommerce_photo_reviews_params.container).html());
                        // let first_char = woocommerce_photo_reviews_params.container.substr(0, 1),
                        //     $container_tag = $container.get()[0].localName;
                        // if (first_char === '.') {
                        //     $reg =new RegExp('<'+$container_tag+' class="' +woocommerce_photo_reviews_params.container.substr(1) + '">([^]+?)</'+$container_tag+'>', 'gm');
                        // } else {
                        //     $reg = new RegExp('<'+$container_tag+' id="' +woocommerce_photo_reviews_params.container.substr(1) + '">([^]+?)</'+$container_tag+'>', 'gm');
                        // }
                    }
                    // let match = $reg.exec(response);
                    // if (match != null) {
                    //     console.log('a3')
                    //     // console.log(match[1].substr(0, match[1].length - 6) )
                    //     $container.html(match[1]+ '<div class="wcpr-grid-overlay wcpr-hidden"></div>');
                    //     // wcpr_helpful_button();
                    // }
                    // console.log('a4')
                    // $reg = /class="woocommerce-pagination">([^]+?)<\/nav>/gm;
                    // match = $reg.exec(response);
                    // if (match != null) {
                    if (temp_html.find('.woocommerce-pagination').length) {
                        $pagination_container.html(temp_html.find('.woocommerce-pagination').html())
                        // $pagination_container.html(match[1])
                    }
                    jQuery(document.body).trigger('wcpr_ajax_pagination_end');
                }
                $overlay.addClass('wcpr-hidden');
                ajax_pagination_running = false;
            },
            error: function (err) {
                ajax_pagination_running = false;
                $overlay.addClass('wcpr-hidden');
            }
        });
    });
    let $filters = $comments.find('.wcpr-filter-container');
    if (!$filters.length) {
        return false;
    }
    if (jQuery('.et_divi_theme').length) {
        jQuery('a.wcpr-filter-button').on('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            let $button = jQuery(this);
            if (ajax_pagination_running || (parseInt($button.find('.wcpr-filter-button-count').html()) === 0 && !$button.hasClass('wcpr-active'))) {
                return false;
            }
            ajax_pagination_running = true;
            e.preventDefault();
            let url = jQuery(this).attr('href');
            let $container = woocommerce_photo_reviews_params.display === '1' ? $comments.find('.wcpr-grid') : $comments.find(woocommerce_photo_reviews_params.container);
            if ($container.length === 0) {
                if (woocommerce_photo_reviews_params.display === '1') {
                    $comments.append('<div class="' + woocommerce_photo_reviews_params.grid_class + '"><div class="wcpr-grid-overlay"></div></div>');
                    $container = $comments.find('.wcpr-grid');
                } else {
                    let first_char = woocommerce_photo_reviews_params.container.substr(0, 1);
                    if (first_char === '.') {
                        $comments.append('<ol class="' + woocommerce_photo_reviews_params.container.substr(1) + '"></ol>');
                    } else {
                        $comments.append('<ol id="' + woocommerce_photo_reviews_params.container.substr(1) + '"></ol>');
                    }
                    $container = $comments.find(woocommerce_photo_reviews_params.container);
                }
                $comments.find('.woocommerce-noreviews').hide();
            }
            if (!$container.find('.wcpr-grid-overlay').length) {
                $container.append('<div class="wcpr-grid-overlay wcpr-hidden"></div>');
            }
            let $overlay = $container.find('.wcpr-grid-overlay');
            $overlay.removeClass('wcpr-hidden');
            $filters.addClass('wcpr-filter-loading');
            jQuery.ajax({
                url: url,
                type: 'get',
                data: {
                    'wcpr_is_ajax': 1
                },
                success: function (response) {
                    if (response) {
                        response = response.replace(/(\r\n\t|\n|\r\t)/gm, "");
                        let $reg, match;
                        let temp_html = jQuery(response);
                        if (woocommerce_photo_reviews_params.display === '1') {
                            $container.html(temp_html.find('.wcpr-grid').html());
                        } else {
                            $container.html(temp_html.find(woocommerce_photo_reviews_params.container).html());
                        }
                        if (temp_html.find('.woocommerce-pagination').length) {
                            if ($pagination_container && $pagination_container.length) {
                                $pagination_container.html(temp_html.find('.woocommerce-pagination').html())
                            } else {
                                $comments.append('<nav class="woocommerce-pagination">' + temp_html.find('.woocommerce-pagination').html() + '</nav>');
                                $pagination_container = $comments.find('.woocommerce-pagination');
                            }
                            // $pagination_container.html(match[1])
                        } else {
                            if ($pagination_container && $pagination_container.length > 0) {
                                $pagination_container.remove();
                                $pagination_container = null;
                            }
                        }
                        $reg = /<div class="wcpr-filter-container" style="display: none;">([^]+?)<\/div>/gm;
                        match = $reg.exec(response);
                        if (match != null) {
                            $filters.html(match[1]);
                        }
                        jQuery(document.body).trigger('wcpr_ajax_pagination_end');
                    }
                },
                error: function (err) {
                    console.log(err);
                },
                complete: function () {
                    ajax_pagination_running = false;
                    $overlay.addClass('wcpr-hidden');
                    $filters.removeClass('wcpr-filter-loading');
                }
            });
        });
    } else {
        jQuery(document).on('click', 'a.wcpr-filter-button', function (e) {
            e.preventDefault();
            e.stopPropagation();
            let $button = jQuery(this);
            if (ajax_pagination_running || (parseInt($button.find('.wcpr-filter-button-count').html()) === 0 && !$button.hasClass('wcpr-active'))) {
                return false;
            }
            ajax_pagination_running = true;
            e.preventDefault();
            let url = jQuery(this).attr('href');
            let $container = woocommerce_photo_reviews_params.display === '1' ? $comments.find('.wcpr-grid') : $comments.find(woocommerce_photo_reviews_params.container);
            if ($container.length === 0) {
                if (woocommerce_photo_reviews_params.display === '1') {
                    $comments.append('<div class="' + woocommerce_photo_reviews_params.grid_class + '"><div class="wcpr-grid-overlay"></div></div>');
                    $container = $comments.find('.wcpr-grid');
                } else {
                    let first_char = woocommerce_photo_reviews_params.container.substr(0, 1);
                    if (first_char === '.') {
                        $comments.append('<ol class="' + woocommerce_photo_reviews_params.container.substr(1) + '"></ol>');
                    } else {
                        $comments.append('<ol id="' + woocommerce_photo_reviews_params.container.substr(1) + '"></ol>');
                    }
                    $container = $comments.find(woocommerce_photo_reviews_params.container);
                }
                $comments.find('.woocommerce-noreviews').hide();
            }
            if (!$container.find('.wcpr-grid-overlay').length) {
                $container.append('<div class="wcpr-grid-overlay wcpr-hidden"></div>');
            }
            let $overlay = $container.find('.wcpr-grid-overlay');
            $overlay.removeClass('wcpr-hidden');
            $filters.addClass('wcpr-filter-loading');
            jQuery.ajax({
                url: url,
                type: 'get',
                data: {
                    'wcpr_is_ajax': 1
                },
                success: function (response) {
                    if (response) {
                        response = response.replace(/(\r\n\t|\n|\r\t)/gm, "");
                        let $reg, match;
                        let temp_html = jQuery(response);
                        if (woocommerce_photo_reviews_params.display === '1') {
                            $container.html(temp_html.find('.wcpr-grid').html());
                        } else {
                            $container.html(temp_html.find(woocommerce_photo_reviews_params.container).html());
                        }
                        if (temp_html.find('.woocommerce-pagination').length) {
                            if ($pagination_container && $pagination_container.length) {
                                $pagination_container.html(temp_html.find('.woocommerce-pagination').html())
                            } else {
                                $comments.append('<nav class="woocommerce-pagination">' + temp_html.find('.woocommerce-pagination').html() + '</nav>');
                                $pagination_container = $comments.find('.woocommerce-pagination');
                            }
                        } else {
                            if ($pagination_container && $pagination_container.length > 0) {
                                $pagination_container.remove();
                                $pagination_container = null;
                            }
                        }
                        $reg = /<div class="wcpr-filter-container" style="display: none;">([^]+?)<\/div>/gm;
                        match = $reg.exec(response);
                        if (match != null) {
                            $filters.html(match[1]);
                        }
                        jQuery(document.body).trigger('wcpr_ajax_pagination_end');
                    }
                },
                error: function (err) {
                    console.log(err);
                },
                complete: function () {
                    ajax_pagination_running = false;
                    $overlay.addClass('wcpr-hidden');
                    $filters.removeClass('wcpr-filter-loading');
                }
            });
        });
    }
}

function wcpr_pagination_loadmore($comments, $pagination_container) {
    $comments = jQuery($comments);
    $pagination_container = jQuery($pagination_container);
    let $filters = $comments.find('.wcpr-filter-container'),
        cpage = jQuery('.wcpr-load-more-reviews-cpage').val(),
        max_page = jQuery('.wcpr-load-more-reviews-cpage').data('max_page'),
        parent_post_id = jQuery('.wcpr-load-more-reviews-product-id').val(),
        rating = jQuery('.wcpr-load-more-reviews-rating').val(),
        verified = jQuery('.wcpr-load-more-reviews-verified').val(),
        image = jQuery('.wcpr-load-more-reviews-image').val(),
        $no_review = $comments.find('.woocommerce-noreviews'),
        $container = woocommerce_photo_reviews_params.display === '1' ? $comments.find('.wcpr-grid') : $comments.find(woocommerce_photo_reviews_params.container);

    function handle_missing_container() {
        if ($container.length === 0) {
            let first_char = woocommerce_photo_reviews_params.display === '1' ? '.' : woocommerce_photo_reviews_params.container.substr(0, 1);
            if (first_char === '.') {
                $container = woocommerce_photo_reviews_params.display === '1' ? jQuery('<div class="' + woocommerce_photo_reviews_params.grid_class + '"></div>') : jQuery('<ol class="' + woocommerce_photo_reviews_params.container.substr(1) + '"></ol>');
            } else {
                $container = jQuery('<ol id="' + woocommerce_photo_reviews_params.container.substr(1) + '"></ol>');
            }
            $comments.append($container);
        }
    }

    function handle_missing_pagination() {
        if ($pagination_container.length === 0) {
            $comments.append('<nav class="woocommerce-pagination"></nav>');
            $pagination_container = $comments.find('.woocommerce-pagination');
        }
    }

    if (cpage && parent_post_id) {
        jQuery(document).on('click', '.wcpr-load-more-reviews-button:not(.shortcode-wcpr-load-more-reviews-button):not(.wcpr-loading)', function () {
            let $button = jQuery(this);
            if ($button.parent().hasClass('wcpr-hidden')){
                return false;
            }
            if (cpage > -1) {
                jQuery.ajax({
                    url: woocommerce_photo_reviews_params.ajaxurl, // AJAX handler, declared before
                    data: {
                        'action': 'wcpr_ajax_load_more_reviews', // wp_ajax_cloadmore
                        'nonce': woocommerce_photo_reviews_params.nonce,
                        'post_id': parent_post_id, // the current post
                        'cpage': cpage, // current comment page
                        'rating': rating,
                        'verified': verified,
                        'image': image,
                        'is_shortcode': '',
                        'frontend_style': woocommerce_photo_reviews_params.display,
                    },
                    type: 'POST',
                    beforeSend: function (xhr) {
                        $button.addClass('wcpr-loading');
                    },
                    success: function (response) {
                        if (response.html) {
                            $container.append(response.html);
                            // if the last page, remove the button
                            if (woocommerce_photo_reviews_params.default_comments_page === 'oldest') {
                                if (cpage < max_page){
                                    cpage++;
                                }else {
                                    $button.parent().addClass('wcpr-hidden');
                                }
                            }else {
                                if (cpage > 1){
                                    cpage--;
                                }else {
                                    $button.parent().addClass('wcpr-hidden');
                                }
                            }
                        } else {
                            $button.parent().addClass('wcpr-hidden');
                        }
                        jQuery(document.body).trigger('wcpr_ajax_load_more_reviews_end');
                    },
                    complete: function () {
                        $button.removeClass('wcpr-loading');
                    }
                });
            }
            return false;
        });
        let ajax_pagination_running = false;
        if ($filters.length) {
            let $filters_rating = $filters.find('.wcpr-filter-button-ul');
            jQuery(document).on('click', 'a.wcpr-filter-button', function (e) {
                let $button = jQuery(this);
                if (ajax_pagination_running || (parseInt($button.find('.wcpr-filter-button-count').html()) === 0 && !$button.hasClass('wcpr-active'))) {
                    return false;
                }
                if (woocommerce_photo_reviews_params.default_comments_page === 'oldest') {
                    cpage=1;
                }else {
                    cpage = '';
                }
                let filter_type = $button.data('filter_type');
                switch (filter_type) {
                    case 'all':
                        if ($button.hasClass('wcpr-active')) {
                            return false;
                        } else {
                            rating = '';
                        }
                        break;
                    case 'image':
                        if ($button.hasClass('wcpr-active')) {
                            image = '';
                        } else {
                            image = 1;
                        }

                        break;
                    case 'verified':
                        if ($button.hasClass('wcpr-active')) {
                            verified = '';
                        } else {
                            verified = 1;
                        }

                        break;
                    default:
                        if ($button.hasClass('wcpr-active')) {
                            return false;
                        } else {
                            rating = parseInt(filter_type);
                        }
                }
                ajax_pagination_running = true;
                e.preventDefault();
                $filters.addClass('wcpr-filter-loading');
                jQuery.ajax({
                    url: woocommerce_photo_reviews_params.ajaxurl, // AJAX handler, declared before
                    type: 'POST',
                    data: {
                        'action': 'wcpr_ajax_load_more_reviews', // wp_ajax_cloadmore
                        'post_id': parent_post_id, // the current post
                        'cpage': cpage, // current comment page
                        'rating': rating,
                        'verified': verified,
                        'image': image,
                        'filter_type': filter_type,
                        'is_shortcode': '',
                        'frontend_style': woocommerce_photo_reviews_params.display,
                    },
                    success: function (response) {
                        if (response.html) {
                            $no_review.hide();
                            handle_missing_container();
                        }
                        $container.html(response.html);
                        handle_missing_pagination();
                        max_page = parseInt(response.max_page);
                        if (max_page != cpage) {
                            if (woocommerce_photo_reviews_params.default_comments_page === 'oldest') {
                                cpage++;
                            }else {
                                cpage--;
                            }
                            $pagination_container.find('.wcpr-load-more-reviews-button').parent().removeClass('wcpr-hidden');
                        }
                        // $pagination_container.html(response.load_more_html);
                        // wcpr_helpful_button();
                        let update_count = response.update_count;
                        if (update_count) {
                            for (let i in update_count) {
                                if (update_count.hasOwnProperty(i)) {
                                    $filters.find('.wcpr-filter-button[data-filter_type="' + i + '"]').find('.wcpr-filter-button-count').html(update_count[i]);
                                }
                            }
                        }
                        $filters.find('.wcpr-filter-rating-placeholder .wcpr-filter-button-count').html(update_count.all);
                        switch (filter_type) {
                            case 'all':
                                $filters_rating.find('.wcpr-filter-button').removeClass('wcpr-active');
                                $button.addClass('wcpr-active');
                                $filters.find('.wcpr-filter-rating-placeholder').html($button.html());
                                break;
                            case 'image':
                            case 'verified':
                                if ($button.hasClass('wcpr-active')) {
                                    $button.removeClass('wcpr-active');
                                } else {
                                    $button.addClass('wcpr-active');
                                }
                                break;
                            default:
                                $filters_rating.find('.wcpr-filter-button').removeClass('wcpr-active');
                                $button.addClass('wcpr-active');
                                $filters.find('.wcpr-filter-rating-placeholder').html($button.html());
                        }
                        jQuery(document.body).trigger('wcpr_ajax_load_more_reviews_end');
                    },
                    error: function (err) {
                        console.log(err);
                    },
                    complete: function () {
                        ajax_pagination_running = false;
                        $filters.removeClass('wcpr-filter-loading');
                    }
                });
            });
        }
    }
}

function viwcpr_flexslider() {
    'use strict';
    if (!jQuery('.woocommerce-photo-reviews-shortcode, .wcpr-review-title').length){
        setTimeout(function (){
            viwcpr_flexslider();
        }, 100);
        return false;
    }
    jQuery('.woocommerce-photo-reviews-shortcode:not(.woocommerce-photo-reviews-slide)').each(function () {
        jQuery(this).addClass('woocommerce-photo-reviews-slide');
        if (!jQuery(this).data('wcpr_slide')) {
            jQuery(this).addClass('woocommerce-photo-reviews-slide-none');
            return true;
        }
        let rtl = false,
            now = Date.now(),
            params = jQuery(this).data('reviews_shortcode'),
            selector = '.shortcode-wcpr-grid .shortcode-wcpr-grid-item';
        if (jQuery(this).find('.shortcode-wcpr-reviews').length) {
            selector = '.commentlist li';
        }
        if (!jQuery(this).find('.viwcpr-slide-wrap').length){
            jQuery(this).append('<div class="viwcpr-slide-wrap viwcpr-slide-wrap-'+now+'" data-id_css="viwcpr-slide-wrap-'+now+'"></div>');
            let tmp = jQuery(selector).parent().clone();
            jQuery(selector).parent().remove();
            jQuery(this).find('.viwcpr-slide-wrap').css({'width':'100%','position':'relative'}).append(tmp);
        }
        if (jQuery(this).closest('.rtl').length) {
            rtl = true;
        }
        console.log('rtl')
        console.log(rtl)
        let wrap = jQuery(this).find('.viwcpr-slide-wrap');
        let wrap_width = wrap.innerWidth() ?  jQuery(this).parent().width() : 0,
            gap = parseInt(params.cols_gap || 20),
            colums = parseInt(params.cols || 4),
            colums_mobile = parseInt(params.cols_mobile || 1);
        if (wrap_width < 600 && wrap_width >= 480) {
            colums = colums > 3 ? 3 : colums;
        }
        if (wrap_width < 480) {
            colums = colums_mobile;
        }
        jQuery(this).addClass('woocommerce-photo-reviews-slide-init');
        let itemWidth = wrap_width ?  (wrap_width - gap * colums) / colums : 200;
        wrap.addClass('viwcpr-slide-wrap-init').removeData("flexslider").viwcaio_flexslider({
            namespace: 'villatheme-slider-',
            selector: selector,
            animation: 'slide',
            animationLoop: 1,
            itemWidth: itemWidth,
            itemMargin: gap,
            controlNav: false,
            maxItems: colums,
            reverse: false,
            rtl: rtl,
            move: colums,
            touch: true,
            slideshow: false,
            start:function (slider){
                if (slider.count === slider.move){
                    get_reviews(slider,1,params,selector).then(function () {
                        slider.setProps(0);
                    });
                }
                let id_css = slider.data('id_css'),
                    css = `.${id_css} .viwse-suggestion-product-wrap{width: ${itemWidth}px !important;}`,
                    h=0;
                for (let i = 0; i < slider.move; i++) {
                    if (h < slider.find(selector).eq(i).innerHeight()) {
                        h = slider.find(selector).eq(i).innerHeight();
                    }
                    if (slider.find(selector).eq(i).find('.shortcode-reviews-images-wrap-right img').length) {
                        slider.find(selector).eq(i).find('.shortcode-reviews-images-wrap-right img').on('load',function(){
                            if (!jQuery('#'+id_css).length){
                                jQuery('head').append(`<style id="${id_css}"></style>`);
                            }
                            if (jQuery(this).closest(selector+':visible').length && jQuery(this).closest(selector).innerHeight() && slider.data('current_height')) {
                                let h_tmp = slider.find(selector).eq(i).innerHeight() + 30;
                                if (jQuery(this).closest(selector).innerHeight() > parseFloat(slider.data('current_height'))) {
                                    let css_tmp = `.${id_css} .viwse-suggestion-product-wrap{width: ${itemWidth}px !important;}`;
                                    css_tmp += `.${id_css} .villatheme-slider-viewport{height: ${h_tmp}px !important;}`;
                                    jQuery('#' + id_css).html(css_tmp);
                                    slider.data('current_height',h_tmp);
                                }
                            }
                        });
                    }
                }
                if (h) {
                    h += 30;
                    css += `.${id_css} .villatheme-slider-viewport{height: ${h}px !important;}`;
                }
                if (!jQuery('#'+id_css).length){
                    jQuery('head').append(`<style id="${id_css}"></style>`);
                }
                jQuery('#'+id_css).html(css);
                slider.data('current_height',h);
            },
            before:function (slider){
                slider.removeClass('viwcpr-slide-wrap-init');
            },
            after:function (slider){
                if (slider.hasClass('viwcpr-slide-wrap-init')){
                    return true;
                }
                slider.addClass('viwcpr-slide-wrap-init');
                let id_css = slider.data('id_css'),
                    css = `.${id_css} .viwse-suggestion-product-wrap{width: ${itemWidth}px !important;}`,
                    first = slider.currentSlide * slider.move ,
                    last = (slider.currentSlide + 1) * slider.move ,
                    h = 0;
                slider.find(selector).css({'margin-bottom': '0', 'margin-top': '0', 'width': `${itemWidth}px !important;`});
                if (first === last){
                    h = slider.find(selector).eq(first).innerHeight();
                    if (slider.find(selector).eq(first).find('.shortcode-reviews-images-wrap-right img').length) {
                        slider.find(selector).eq(first).find('.shortcode-reviews-images-wrap-right img').on('load',function(){
                            if (!jQuery('#'+id_css).length){
                                jQuery('head').append(`<style id="${id_css}"></style>`);
                            }
                            if (jQuery(this).closest(selector+':visible').length && jQuery(this).closest(selector).innerHeight() && slider.data('current_height')) {
                                let h_tmp = slider.find(selector).eq(i).innerHeight() + 30;
                                if (jQuery(this).closest(selector).innerHeight() > parseFloat(slider.data('current_height'))) {
                                    let css_tmp = `.${id_css} .viwse-suggestion-product-wrap{width: ${itemWidth}px !important;}`;
                                    css_tmp += `.${id_css} .villatheme-slider-viewport{height: ${h_tmp}px !important;}`;
                                    jQuery('#' + id_css).html(css_tmp);
                                    slider.data('current_height',h_tmp);
                                }
                            }
                        });
                    }
                }else {
                    for (let i = first; i < last; i++) {
                        if (h < slider.find(selector).eq(i).innerHeight()) {
                            h = slider.find(selector).eq(i).innerHeight();
                        }
                        if (slider.find(selector).eq(i).find('.shortcode-reviews-images-wrap-right img').length) {
                            slider.find(selector).eq(i).find('.shortcode-reviews-images-wrap-right img').on('load',function(){
                                if (!jQuery('#'+id_css).length){
                                    jQuery('head').append(`<style id="${id_css}"></style>`);
                                }
                                if (jQuery(this).closest(selector+':visible').length && jQuery(this).closest(selector).innerHeight() && slider.data('current_height')) {
                                    let h_tmp = slider.find(selector).eq(i).innerHeight() + 30;
                                    if (jQuery(this).closest(selector).innerHeight() > parseFloat(slider.data('current_height'))) {
                                        let css_tmp = `.${id_css} .viwse-suggestion-product-wrap{width: ${itemWidth}px !important;}`;
                                        css_tmp += `.${id_css} .villatheme-slider-viewport{height: ${h_tmp}px !important;}`;
                                        jQuery('#' + id_css).html(css_tmp);
                                        slider.data('current_height',h_tmp);
                                    }
                                }
                            });
                        }
                    }
                }
                if (h) {
                    h += 30;
                    css += `.${id_css} .villatheme-slider-viewport{height: ${h}px !important;}`;
                    slider.data('current_height',h);
                }
                if (!jQuery('#'+id_css).length){
                    jQuery('head').append(`<style id="${id_css}"></style>`);
                }
                jQuery('#'+id_css).html(css);
            },
            end:function (slider) {
                let total_pages = parseInt(slider.find('.wcpr-reviews-total-pages').html() || slider.closest('.woocommerce-photo-reviews-shortcode').find('.wcpr-reviews-total-pages').html() ),
                    current_page = Math.ceil(slider.find(selector).length/parseInt(params.comments_per_page || 1));
                if (total_pages > current_page){
                    let current = slider.limit;
                    get_reviews(slider,current_page,params,selector).then(function () {
                        slider.setProps(current);
                    });
                }
            }
        });
    });
    let get_reviews = async function(slider,current_page,params,selector){
        await new Promise(function (resolve) {
            jQuery.ajax({
                url: woocommerce_photo_reviews_params.ajaxurl,
                type: 'get',
                data: {
                    action: 'woocommerce_photo_reviews_shortcode_ajax_get_reviews',
                    nonce: woocommerce_photo_reviews_params.nonce,
                    reviews_shortcode: JSON.stringify(params),
                    wcpr_page: current_page + 1,
                    wcpr_image: slider.data('wcpr_image'),
                    wcpr_verified: slider.data('wcpr_verified'),
                    wcpr_rating: slider.data('wcpr_rating'),
                },
                beforeSend:function(){
                    slider.closest('.woocommerce-photo-reviews-shortcode').addClass('woocommerce-photo-reviews-shortcode-loading');
                },
                success: function (response) {
                    let temp = jQuery('<div></div>');
                    temp.append(response.html);
                    temp.find(selector).each(function (k, v) {
                        slider.addSlide(jQuery(v));
                    });
                    slider.closest('.woocommerce-photo-reviews-shortcode').removeClass('woocommerce-photo-reviews-shortcode-loading');
                    resolve(slider);
                },
                error: function (err) {
                    resolve(slider);
                    slider.closest('.woocommerce-photo-reviews-shortcode').removeClass('woocommerce-photo-reviews-shortcode-loading');
                }
            })
        });
    };
    jQuery('.wcpr-grid .wcpr-grid-item').last().css('display','inline-block');
    jQuery('.shortcode-wcpr-grid .shortcode-wcpr-grid-item').last().css('display','inline-block');
    if (jQuery('#wcpr_thank_you_message').length){
        setTimeout(function (){
            jQuery( '.reviews_tab a' ).trigger( 'click' );
            setTimeout(function (){
                window.scrollTo({top: jQuery('#review_form').offset().top - 450 });
            });
        },100);
    }
}
function wcpr_helpful_button() {
    'use strict';
    let popup_button = [
        '.wcpr-single-product-summary .single_add_to_cart_button:not(.vicatna-single-atc-button):not(.vi-wcaio-product-bt-atc-loading)',
        '.shortcode-wcpr-single-product-summary .single_add_to_cart_button:not(.vicatna-single-atc-button):not(.vi-wcaio-product-bt-atc-loading)',
    ];
    jQuery(document).on('click', popup_button.join(','), function (e) {
        if (!woocommerce_photo_reviews_params.ajax_atc){
            return true;
        }
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        let button = jQuery(this), form = jQuery(this).closest('form.cart');
        button.addClass('vi-wcaio-product-bt-atc-loading');
        if (!form.length || button.hasClass('disabled')) {
            button.removeClass('vi-wcaio-product-bt-atc-loading');
            return false;
        }
        if (form.hasClass('.variations_form')) {
            let variation_id_check = parseInt(form.find('input[name=variation_id]').val());
            if (!variation_id_check || variation_id_check <= 0) {
                button.removeClass('vi-wcaio-product-bt-atc-loading');
                return false;
            }
        }
        let product_id = form.find('input[name=product_id]').val();
        if (!product_id){
            product_id = form.find('[name=add-to-cart]').val()
        }
        if (!product_id || form.find('[name="woopb-add-to-cart"]').length) {
            button.attr('type', 'submit').trigger('click');
            return false;
        }
        let data = {};
        form.find('select, textarea, input').each(function () {
            if (jQuery(this).prop('disabled')){
                return true;
            }
            if (['checkbox', 'radio'].indexOf(jQuery(this).attr('type')) > -1 && !jQuery(this).prop('checked')) {
                return true;
            }
            let name = jQuery(this).attr('name');
            if (name) {
                data[name] = jQuery(this).val();
            }
        });
        if (!data['add-to-cart']){
            data['add-to-cart']=form.find('[name=add-to-cart]').val();
        }
        jQuery(document.body).trigger('adding_to_cart', [button, data]);
        if ( !woocommerce_photo_reviews_params['ajax_atc_event']){
            woocommerce_photo_reviews_params['ajax_atc_event'] = [];
        }
        woocommerce_photo_reviews_params['ajax_atc_event'].push({
            type: 'post',
            url: woocommerce_photo_reviews_params.wc_ajax_url.toString().replace('%%endpoint%%', 'viwcpr_add_to_cart'),
            data: data,
            beforeSend: function () {
                button.removeClass('added').addClass('loading');
            },
            success: function (response) {
                if (response.error) {
                    location.href = window.location.href;
                    return false;
                }
                if (woocommerce_photo_reviews_params.cart_redirect_after_add === 'yes' && woocommerce_photo_reviews_params.cart_url) {
                    window.location = woocommerce_photo_reviews_params.cart_url;
                    return false;
                }
                jQuery(document.body).trigger('added_to_cart', [response.fragments, response.cart_hash, button]);
                if (!woocommerce_photo_reviews_params.woocommerce_enable_ajax_add_to_cart) {
                    jQuery(document.body).trigger("wc_fragment_refresh");
                }
                jQuery(document.body).trigger('viwcpr_added_to_cart', [response.fragments, response.cart_hash, button]);
                woocommerce_photo_reviews_params['ajax_atc_event'].shift();
                if (woocommerce_photo_reviews_params['ajax_atc_event'].length > 0) {
                    jQuery.ajax(woocommerce_photo_reviews_params['ajax_atc_event'][0]);
                }
            },
            complete: function (response) {
                button.removeClass('loading vi-wcaio-product-bt-atc-loading').addClass('added');
            },
        });
        if (woocommerce_photo_reviews_params['ajax_atc_event'].length === 1) {
            jQuery.ajax(woocommerce_photo_reviews_params['ajax_atc_event'][0]);
        }
    });
    jQuery(document).on('click', '.wcpr-comment-helpful-button', function (e) {
        e.stopPropagation();
        let button = jQuery(this);
        let vote = button.hasClass('wcpr-comment-helpful-button-up-vote') ? 'up' : 'down';
        let container = button.closest('.wcpr-comment-helpful-button-container');
        let comment_id = container.data('comment_id');
        if (vote === 'up' && container.hasClass('wcpr-comment-helpful-button-voted-up')) {
            return;
        }
        if (vote === 'down' && container.hasClass('wcpr-comment-helpful-button-voted-down')) {
            return;
        }
        if (container.hasClass('wcpr-comment-helpful-button-voting')) {
            return;
        }
        container.addClass('wcpr-comment-helpful-button-voting');
        jQuery.ajax({
            url: woocommerce_photo_reviews_params.ajaxurl, // AJAX handler, declared before
            data: {
                'action': 'wcpr_helpful_button_handle',
                'vote': vote,
                'comment_id': comment_id,
                'nonce': woocommerce_photo_reviews_params.nonce,
            },
            type: 'POST',
            success: function (response) {
                if (response.status === 'success') {
                    container.find('.wcpr-comment-helpful-button-up-vote-count').html(parseInt(response.up));
                    container.find('.wcpr-comment-helpful-button-down-vote-count').html(parseInt(response.down));
                    if (vote === 'up') {
                        container.removeClass('wcpr-comment-helpful-button-voted-down').addClass('wcpr-comment-helpful-button-voted-up');
                    } else {
                        container.removeClass('wcpr-comment-helpful-button-voted-up').addClass('wcpr-comment-helpful-button-voted-down');
                    }
                    if (container.parent().hasClass('reviews-content-right-meta') || container.parent().hasClass('shortcode-reviews-content-right-meta')) {
                        let comment_container = jQuery('.wcpr-comment-helpful-button-container[data-comment_id="' + comment_id + '"]');
                        comment_container.find('.wcpr-comment-helpful-button-up-vote-count').html(parseInt(response.up));
                        comment_container.find('.wcpr-comment-helpful-button-down-vote-count').html(parseInt(response.down));
                        if (vote === 'up') {
                            comment_container.removeClass('wcpr-comment-helpful-button-voted-down').addClass('wcpr-comment-helpful-button-voted-up');
                        } else {
                            comment_container.removeClass('wcpr-comment-helpful-button-voted-up').addClass('wcpr-comment-helpful-button-voted-down');
                        }
                    }
                }
            },
            error: function () {

            },
            complete: function () {
                container.removeClass('wcpr-comment-helpful-button-voting');
            }
        });
    });
}

function viSwipeDetect(el, callback) {
    var touchsurface = el,
        swipedir,
        startX,
        startY,
        distX,
        distY,
        threshold = 150, //required min distance traveled to be considered swipe
        restraint = 100, // maximum distance allowed at the same time in perpendicular direction
        allowedTime = 300, // maximum time allowed to travel that distance
        elapsedTime,
        startTime,
        handleswipe = callback || function (swipedir) {
        };

    touchsurface.addEventListener(
        "touchstart",
        function (e) {
            var touchobj = e.changedTouches[0];
            swipedir = "none";
            startX = touchobj.pageX;
            startY = touchobj.pageY;
            startTime = new Date().getTime(); // record time when finger first makes contact with surface
        },
        false
    );

    touchsurface.addEventListener(
        "touchmove",
        function (e) {
            e.preventDefault(); // prevent scrolling when inside DIV
        },
        false
    );

    touchsurface.addEventListener(
        "touchend",
        function (e) {
            var touchobj = e.changedTouches[0];
            distX = touchobj.pageX - startX; // get horizontal dist traveled by finger while in contact with surface
            distY = touchobj.pageY - startY; // get vertical dist traveled by finger while in contact with surface
            elapsedTime = new Date().getTime() - startTime; // get time elapsed
            if (elapsedTime <= allowedTime) {
                // first condition for awipe met
                if (Math.abs(distX) >= threshold && Math.abs(distY) <= restraint) {
                    // 2nd condition for horizontal swipe met
                    swipedir = distX < 0 ? "left" : "right"; // if dist traveled is negative, it indicates left swipe
                } else if (
                    Math.abs(distY) >= threshold &&
                    Math.abs(distX) <= restraint
                ) {
                    // 2nd condition for vertical swipe met
                    swipedir = distY < 0 ? "up" : "down"; // if dist traveled is negative, it indicates up swipe
                }
            }
            handleswipe(swipedir);
        },
        false
    );
}
