jQuery(window).on('elementor/frontend/init', () => {
    'use strict';
    elementorFrontend.hooks.addAction('frontend/element_ready/woocommerce-photo-reviews-form.default', function ($scope) {
        if (!window.elementor) {
            return;
        }
        let $shortcode_container = $scope.find('.woocommerce-photo-reviews-form-container');
        $shortcode_container.find('.wcpr-rating')
            .hide()
            .before(
                '<p class="stars">\
                    <span>\
                        <a class="star-1" href="#">1</a>\
                        <a class="star-2" href="#">2</a>\
                        <a class="star-3" href="#">3</a>\
                        <a class="star-4" href="#">4</a>\
                        <a class="star-5" href="#">5</a>\
                    </span>\
                </p>'
            );
        $shortcode_container.find('.viwcpr-review-order-container .woocommerce-photo-reviews-form-product .woocommerce-photo-reviews-form-meta-title').map(function () {
            $(this).closest('.woocommerce-photo-reviews-form-main-inner').prepend($(this).clone());
            $(this).remove();
        })
    })
});
jQuery(document).ready(function ($) {
    'use strict';
    $('body')
    // Star ratings for comments
        .on('init', '.wcpr-rating', function () {
            $('.wcpr-rating')
                .hide()
                .before(
                    '<p class="stars">\
                        <span>\
                            <a class="star-1" href="#">1</a>\
                            <a class="star-2" href="#">2</a>\
                            <a class="star-3" href="#">3</a>\
                            <a class="star-4" href="#">4</a>\
                            <a class="star-5" href="#">5</a>\
                        </span>\
                    </p>'
                );
        })
        .on('click', '#respond p.stars a', function () {
            var $star = $(this),
                $rating = $(this).closest('#respond').find('#wcpr-rating'),
                $container = $(this).closest('.stars');

            $rating.val($star.text());
            $star.siblings('a').removeClass('active');
            $star.addClass('active');
            $container.addClass('selected');

            return false;
        })
        .on('click', '#respond #submit', function () {
            var $rating = $(this).closest('#respond').find('#wcpr-rating'),
                rating = $rating.val();
            if ($rating.length > 0 && !rating && woocommerce_photo_reviews_form_params.review_rating_required === 'yes') {
                window.alert(woocommerce_photo_reviews_form_params.i18n_required_rating_text);

                return false;
            }
        });
    $('#wcpr-rating').trigger('init');
    setTimeout(function (){
        $('.viwcpr-review-order-container .woocommerce-photo-reviews-form-product .woocommerce-photo-reviews-form-meta-title').map(function () {
            $(this).closest('.woocommerce-photo-reviews-form-main-inner').prepend($(this).clone());
            $(this).closest('.woocommerce-photo-reviews-form-main-inner').find('.wcpr-comment-form-submit').attr('type', 'button');
            $(this).remove();
        });
    },100);
    let max_files = woocommerce_photo_reviews_form_params.max_files;
    $('.wcpr-comment-form').on('change', '.wcpr_image_upload', function (e) {
        $(this).parent().find('.wcpr-selected-image-container').html('');
        if (this.files.length > max_files) {
            jQuery(this).closest('.woocommerce-photo-reviews-form-container').find('.wcpr-comment-form-error-wraps').removeClass('wcpr-hidden').html(woocommerce_photo_reviews_form_params.warning_max_files);
            $(this).val('');
            return false;
        } else if (this.files.length > 0) {
            jQuery(this).closest('.woocommerce-photo-reviews-form-container').find('.wcpr-comment-form-error-wraps').addClass('wcpr-hidden');
            readURL(this);
        }
    }).find('.star-5').trigger('click');
    let image_caption_enable = woocommerce_photo_reviews_form_params.image_caption_enable == 1;
    let i18n_image_caption = woocommerce_photo_reviews_form_params.i18n_image_caption;

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
    $(document).on('click','.viwcpr-review-order-submit:not(.viwcpr-review-order-submit-loading)',function () {
        let queue=[],
            button = $(this),
            form = $(this).closest('.viwcpr-review-order-wrap').find('.woocommerce-photo-reviews-form-container');
        if (!form.length){
            return false;
        }
        button.addClass('viwcpr-review-order-submit-loading');
        form.each(function () {
            let $container = $(this);
            let $content = $container.find('textarea[id="comment"]') || $container.find('textarea[name="comment"]');
            let $name = $container.find('input[name="author"]');
            let $email = $container.find('input[name="email"]');
            $container.find('.wcpr-comment-form-error-wraps,.wcpr-comment-form-notify-wraps').addClass('wcpr-hidden');
            let $rating = $container.find( '#rating' ),
                rating  = $rating.val();
            if ( $rating.length > 0 && ! rating && woocommerce_photo_reviews_params.review_rating_required === 'yes' ) {
                $container.find('.wcpr-comment-form-error-wraps').removeClass('wcpr-hidden').html(woocommerce_photo_reviews_params.i18n_required_rating_text);
                window.scrollTo({top: $container.offset().top - 50 });
                return false;
            }
            if ($content.length > 0 ) {
                let comment = $content.val();
                if (!comment && woocommerce_photo_reviews_params.allow_empty_comment != 1) {
                    $container.find('.wcpr-comment-form-error-wraps').removeClass('wcpr-hidden').html(woocommerce_photo_reviews_params.i18n_required_comment_text);
                    $content.focus();
                    return false;
                }
                let minimum_comment_length = parseInt(woocommerce_photo_reviews_params.minimum_comment_length);
                if (minimum_comment_length && minimum_comment_length > comment.length){
                    $container.find('.wcpr-comment-form-error-wraps').removeClass('wcpr-hidden').html(woocommerce_photo_reviews_params.i18n_minimum_comment_text);
                    $content.focus();
                    return false;
                }
            }
            if ('on' === woocommerce_photo_reviews_form_params.enable_photo) {
                let $fileUpload = $container.find('.wcpr_image_upload');
                if ($fileUpload.length > 0) {
                    let file_upload = $fileUpload.get(0).files;
                    let imagesCount = parseInt(file_upload.length);
                    if ('on' === woocommerce_photo_reviews_form_params.required_image && imagesCount === 0) {
                        $container.find('.wcpr-comment-form-error-wraps').removeClass('wcpr-hidden').html(woocommerce_photo_reviews_form_params.warning_required_image);
                        window.scrollTo({top: $container.offset().top - 50 });
                        return false;
                    }
                    if (imagesCount > woocommerce_photo_reviews_form_params.max_files) {
                        $container.find('.wcpr-comment-form-error-wraps').removeClass('wcpr-hidden').html(woocommerce_photo_reviews_form_params.warning_max_files);
                        window.scrollTo({top: $container.offset().top - 50 });
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
                        $container.find('.wcpr-comment-form-error-wraps').removeClass('wcpr-hidden').html(error.join(''));
                        window.scrollTo({top: $container.offset().top - 50 });
                        return false;
                    }
                } else if ('on' === woocommerce_photo_reviews_form_params.required_image) {
                    $container.find('.wcpr-comment-form-error-wraps').removeClass('wcpr-hidden').html(woocommerce_photo_reviews_form_params.warning_required_image);
                    window.scrollTo({top: $container.offset().top - 50 });
                    return false;
                }
            }
            if ($name.length > 0 && $name.attr('required') && !$name.val()) {
                $container.find('.wcpr-comment-form-error-wraps').removeClass('wcpr-hidden').html(woocommerce_photo_reviews_form_params.i18n_required_name_text);
                $name.focus();
                return false;
            }
            if ($email.length > 0 && $email.attr('required') && !$email.val()) {
                $container.find('.wcpr-comment-form-error-wraps').removeClass('wcpr-hidden').html(woocommerce_photo_reviews_form_params.i18n_required_email_text);
                $email.focus();
                return false;
            }
            if ($container.find('input[name="wcpr_gdpr_checkbox"]').prop('checked') === false) {
                $container.find('.wcpr-comment-form-error-wraps').removeClass('wcpr-hidden').html(woocommerce_photo_reviews_form_params.warning_gdpr);
                window.scrollTo({top: $container.offset().top - 50 });
                return false;
            }
            let data =new FormData($container.find('form')[0]);
            if ($content.val() && !$container.find('textarea[name="comment"]').val()){
                data.set('comment',$content.val()) ;
            }
            queue.push({
                type: 'post',
                url: woocommerce_photo_reviews_form_params.wc_ajax_url.toString().replace('%%endpoint%%', 'viwcpr_review_order') + '&nonce=' + woocommerce_photo_reviews_form_params.nonce,
                // url: $container.find('form').attr('action'),
                processData: false,
                cache: false,
                contentType: false,
                data: data,
                success: function (response) {
                    if (response.error) {
                        $container.find('.wcpr-comment-form-error-wraps').removeClass('wcpr-hidden').html(response.error);
                    } else {
                        if (response.html) {
                            $container.find('.woocommerce-photo-reviews-form-main-content').html(response.html);
                            if (!$('.viwcpr-review-order-wrap form').length){
                                button.addClass('wcpr-hidden');
                            }
                        }
                    }
                },
                error: function (err) {
                    cosole.log(err)
                    $container.find('.wcpr-comment-form-error-wraps').removeClass('wcpr-hidden').html( err.responseText === '-1' ? err.statusText : err.responseText);
                },
                complete:function (){
                    $container.find('.wcpr-comment-form-notify-wraps').addClass('wcpr-hidden');
                    queue.shift();
                    if (queue.length){
                        $.ajax(queue[0]);
                    }else {
                        button.removeClass('viwcpr-review-order-submit-loading');
                    }
                }
            });
        });
        if (!queue.length || queue.length < form.length){
            button.removeClass('viwcpr-review-order-submit-loading');
            return false;
        }
        $('.wcpr-comment-form-notify-wraps').removeClass('wcpr-hidden');
        $.ajax(queue[0]);
    });
    $('.woocommerce-photo-reviews-form-container').find('input[type="submit"]').on('click', function (e) {
        let $button = $(this);
        if ($button.hasClass('viwcpr_form_checked')){
            return true;
        }
        let $container = $button.closest('.woocommerce-photo-reviews-form-container');
        let $content = $container.find('textarea[id="comment"]') || $container.find('textarea[name="comment"]');
        let $name = $container.find('input[name="author"]');
        let $email = $container.find('input[name="email"]');
        $container.find('.wcpr-comment-form-error-wraps,.wcpr-comment-form-notify-wraps').addClass('wcpr-hidden');
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
                $container.find('.wcpr-comment-form-error-wraps').removeClass('wcpr-hidden').html(woocommerce_photo_reviews_params.i18n_required_comment_text);
                e.preventDefault();
                $content.focus();
                return false;
            }
            let minimum_comment_length = parseInt(woocommerce_photo_reviews_params.minimum_comment_length);
            if (minimum_comment_length && minimum_comment_length > comment.length){
                $container.find('.wcpr-comment-form-error-wraps').removeClass('wcpr-hidden').html(woocommerce_photo_reviews_params.i18n_minimum_comment_text);
                e.preventDefault();
                $content.focus();
                return false;
            }
        }
        if ('on' === woocommerce_photo_reviews_form_params.enable_photo) {
            let $fileUpload = $container.find('.wcpr_image_upload');
            if ($fileUpload.length > 0) {
                let file_upload = $fileUpload.get(0).files;
                let imagesCount = parseInt(file_upload.length);
                if ('on' === woocommerce_photo_reviews_form_params.required_image && imagesCount === 0) {
                    $container.find('.wcpr-comment-form-error-wraps').removeClass('wcpr-hidden').html(woocommerce_photo_reviews_form_params.warning_required_image);
                    return false;
                }
                if (imagesCount > woocommerce_photo_reviews_form_params.max_files) {
                    $container.find('.wcpr-comment-form-error-wraps').removeClass('wcpr-hidden').html(woocommerce_photo_reviews_form_params.warning_max_files);
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
                    $container.find('.wcpr-comment-form-error-wraps').removeClass('wcpr-hidden').html(error.join(''));
                    e.preventDefault();
                    return false;
                }
            } else if ('on' === woocommerce_photo_reviews_form_params.required_image) {
                $container.find('.wcpr-comment-form-error-wraps').removeClass('wcpr-hidden').html(woocommerce_photo_reviews_form_params.warning_required_image);
                return false;
            }
        }

        if ($name.length > 0 && $name.attr('required') && !$name.val()) {
            $container.find('.wcpr-comment-form-error-wraps').removeClass('wcpr-hidden').html(woocommerce_photo_reviews_form_params.i18n_required_name_text);
            e.preventDefault();
            $name.focus();
            return false;
        }
        if ($email.length > 0 && $email.attr('required') && !$email.val()) {
            $container.find('.wcpr-comment-form-error-wraps').removeClass('wcpr-hidden').html(woocommerce_photo_reviews_form_params.i18n_required_email_text);
            e.preventDefault();
            $email.focus();
            return false;
        }
        if ($container.find('input[name="wcpr_gdpr_checkbox"]').prop('checked') === false) {
            $container.find('.wcpr-comment-form-error-wraps').removeClass('wcpr-hidden').html(woocommerce_photo_reviews_form_params.warning_gdpr);
            e.preventDefault();
            return false;
        }
        jQuery('.wcpr-comment-form-notify-wraps').removeClass('wcpr-hidden');
        if (woocommerce_photo_reviews_form_params.restrict_number_of_reviews) {
            $button.attr('type','button');
            let restrict_number_of_reviews = async function () {
                let error = '',data =new FormData(jQuery('.woocommerce-photo-reviews-form-container form')[0]);
                if ($content.val() && !$container.find('textarea[name="comment"]').val()){
                    data.set('comment',$content.val()) ;
                }
                await new Promise(function (resolve) {
                    $.ajax({
                        type: 'post',
                        url: woocommerce_photo_reviews_form_params.wc_ajax_url.toString().replace('%%endpoint%%', 'viwcpr_restrict_number_of_reviews'),
                        processData: false,
                        cache: false,
                        contentType: false,
                        data: data,
                        success: function (response) {
                            if (response.error){
                                error = response.error;
                            }else {
                                if (response.remove_upload_file) {
                                    $container.find('.woocommerce-photo-reviews-form-container form').find('.wcpr_image_upload').val('');
                                }
                                if (response.img_id) {
                                    $container.find('.woocommerce-photo-reviews-form-container form').append(`<input type="hidden" name="wcpr_image_upload_id" value="${response.img_id}">`);
                                }
                            }
                            console.log(response)
                            resolve(error)
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
                    $container.find('.wcpr-comment-form-notify-wraps').addClass('wcpr-hidden');
                    $container.find('.wcpr-comment-form-error-wraps').removeClass('wcpr-hidden').html(error);
                    e.preventDefault();
                    return false;
                }else {
                    $button.addClass('viwcpr_form_checked').trigger('click');
                }
            });
        }
    });
    $(document).on('click', '.woocommerce-photo-reviews-form-main,.woocommerce-photo-reviews-form-main-close', function () {
        let $container = $(this).closest('.woocommerce-photo-reviews-form-container');
        $container.addClass('woocommerce-photo-reviews-form-popup-hide')
        wcpr_enable_scroll();
    });
    $(document).on('click', '.woocommerce-photo-reviews-form-button-add-review', function () {
        let $button = $(this);
        let $container = $button.closest('.woocommerce-photo-reviews-form-container');
        $container.removeClass('woocommerce-photo-reviews-form-popup-hide');
        wcpr_disable_scroll();
    });
    $(document).on('click', '.woocommerce-photo-reviews-form-main-inner', function (e) {
        e.stopPropagation();
    });
});
