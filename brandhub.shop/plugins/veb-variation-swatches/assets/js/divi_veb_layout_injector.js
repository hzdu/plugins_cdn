jQuery(document).ready(function () {

    if (jQuery('.single-product .sb_veb_product_image').length) {
        if (!jQuery('.single-product .sb_veb_product_image').hasClass('sb_veb_image_disable_zoom')) {
            jQuery('.single-product .sb_veb_product_image').zoom({
                callback: function callback() {
                    if (!jQuery('.single-product .sb_veb_product_image').hasClass('sb_veb_image_disable_lightbox')) {
                        jQuery(this).colorbox({
                            href: jQuery('.single-product .sb_veb_product_image img').attr('src')
                        });
                    }
                }
            });
        } else {
            if (!jQuery('.single-product .sb_veb_product_image').hasClass('sb_veb_image_disable_lightbox')) {
                jQuery('.sb_veb_product_image').colorbox({
                    href: jQuery('.single-product .sb_veb_product_image img').attr('src')
                });
            }
        }
    }

    if (jQuery('.single-product .cart.variations_form')) {
        
        jQuery('.single-product .cart.variations_form .variations .value select').each(function (index, attr) {
            jQuery(this).change(function () {
                sb_veb_variation_image();
            });
        });
        
    }

    if (jQuery('.woocommerce-remove-coupon').length) {
        jQuery('.et_pb_veb_checkout_coupon').slideUp();
    }

    jQuery(document.body).on('wc_fragments_refreshed', function () {
    });

    if (jQuery('body').hasClass('wli_injected')) {

        if (jQuery('.wpcf7').length > 0) {
            var wli_post_id,
                matches = document.body.className.match(/(^|\s)postid-(\d+)(\s|$)/);
            if (matches) {
                jQuery("input[name='_wpcf7_container_post']").val(matches[2]);
                jQuery(".wpcf7-submit").addClass('button');
                jQuery(".wpcf7-form > p").addClass('form-row');
                jQuery(".wpcf7-form > p .wpcf7-form-control-wrap input").addClass('input-text');
            }
        }

        jQuery(document.body).on('added_to_cart', function () {
            setTimeout(function () {
                jQuery('.added_to_cart').addClass('button');
            }, 50);
        });

        jQuery(document.body).on('wc_fragments_loaded', function () {
            wli_refresh_cart_count();
        });

        jQuery(document.body).on('wc_fragments_refreshed', function () {
            wli_refresh_cart_count();
        });

        jQuery(document.body).on("checkout_error", function () {

            if (jQuery('.woocommerce-NoticeGroup').length) {
                sb_veb_popup_notice(jQuery('.woocommerce-NoticeGroup').html());
                setTimeout(function () {
                    jQuery('.woocommerce-NoticeGroup').remove();
                }, 250);
            }
        });

        jQuery(document.body).on("updated_wc_div", function () {

            if (jQuery('.woocommerce .woocommerce-error').length) {
                sb_veb_popup_notice(jQuery('.woocommerce .woocommerce-error'));
                jQuery('.entry-content .woocommerce .woocommerce-error').remove();
            }
            if (jQuery('.woocommerce .woocommerce-message').length) {
                sb_veb_popup_notice(jQuery('.woocommerce .woocommerce-message').clone().wrap("<div />"));
                jQuery('.entry-content .woocommerce .woocommerce-message').remove();
            }
            if (jQuery('.cart-empty').length > 0) {
                jQuery('.et_pb_veb_cart_totals').remove();
            }
        });

        jQuery(document.body).on("applied_coupon", function () {

            if (jQuery('.woocommerce .woocommerce-error').length) {
                sb_veb_popup_notice(jQuery('.woocommerce .woocommerce-error'));
                jQuery('.entry-content .woocommerce .woocommerce-error').remove();
            }
        });

        jQuery(document.body).on("removed_coupon", function () {

            if (jQuery('.woocommerce .woocommerce-message').length) {
                sb_veb_popup_notice(jQuery('.woocommerce .woocommerce-message').clone().wrap("<div />"));
                jQuery('.entry-content .woocommerce .woocommerce-message').remove();
            }
        });

        jQuery(document.body).on("update_checkout", function () {

            if (jQuery('.wli_wrapper_checkout-form-coupon .woocommerce-error').length) {
                sb_veb_popup_notice(jQuery('.wli_wrapper_checkout-form-coupon .woocommerce-error').clone().wrap("<div />"));
                jQuery('.et_pb_veb_checkout_coupon').slideDown();
            } else if (jQuery('.wli_wrapper_checkout-form-coupon .woocommerce-message').length) {
                sb_veb_popup_notice(jQuery('.wli_wrapper_checkout-form-coupon .woocommerce-message').clone().wrap("<div />"));
                jQuery('.coupon-module').val('');

                if (jQuery('.woocommerce-remove-coupon').length) {
                    jQuery('.et_pb_veb_checkout_coupon').slideDown();
                } else {
                    jQuery('.et_pb_veb_checkout_coupon').slideUp();
                }
            } else if (jQuery('.woocommerce .woocommerce-message').length) {
                sb_veb_popup_notice(jQuery('.woocommerce .woocommerce-message').clone().wrap("<div />"));
                setTimeout(function () {
                    jQuery('.entry-content > .woocommerce > .woocommerce-message').remove();
                }, 250);
            }
        });
    }
});

function wli_refresh_cart_count() {
    var wli_new_count = 0;

    if (jQuery('.sb_veb_mini_cart ul li').length) {
        jQuery('.sb_veb_mini_cart ul li').each(function () {
            var wli_quantity = jQuery(this).children('.quantity').text();
            var wli_quantity_nums = wli_quantity.split(' ');
            var wli_quantity_num = parseInt(wli_quantity_nums[0]);

            wli_new_count += wli_quantity_num;
        });
    }

    if (wli_new_count <= 0) {
        wli_new_count = '';
    }

    jQuery('.sb_veb_prod_cart_container .et-cart-info span').text(wli_new_count);
}

function sb_veb_popup_notice(popup_object) {
    jQuery('html, body').scrollTop(0);

    jQuery.colorbox({
        html: popup_object,
        width: "50%",
        className: "woocommerce"
    });
}

function sb_veb_maybe_submit_checkout_coupon() {
    jQuery(this).keypress(function (e) {
        if (e.which == 13) {
            sb_veb_submit_checkout_coupon();
        }
    });
}

function sb_veb_submit_checkout_coupon() {
    if (jQuery('.coupon-module').length) {
        jQuery('.coupon-module').parent().removeClass('woocommerce-invalid').removeClass('woocommerce-validated');

        var coupon = jQuery('.coupon-module').val();

        if (coupon != '') {
            jQuery('#coupon_code').val(coupon);
            jQuery('.checkout_coupon').submit();
        } else {
            jQuery('.coupon-module').parent().addClass('woocommerce-invalid').removeClass('woocommerce-validated');
        }
    }

    return false;
}

function sb_veb_variation_image() {
    
    var sb_veb_attr_data = jQuery('.single-product .cart.variations_form').data('product_variations');
    var sb_veb_attr_val = '';
    var sb_veb_attr_id = '';
    var sb_veb_attr_name = '';
    var sb_veb_attr_set = [];
    var sb_veb_attr_set_l = 0;
    var sb_veb_attr_set_matched = 0;
    var sb_veb_found_set = [];
    var sb_veb_large_image = '';


    jQuery('.single-product .cart.variations_form .variations .value select').each(function (index2, attr2) {
        sb_veb_attr_val = jQuery(this).val();
        sb_veb_attr_id = jQuery(this).attr('id');
        sb_veb_attr_name = 'attribute_' + sb_veb_attr_id;

        if (sb_veb_attr_val) {
            sb_veb_attr_set.push([sb_veb_attr_name, sb_veb_attr_val]);
            sb_veb_attr_set_l++;
        }
    });


    if (sb_veb_attr_set_l > 0) {
        
        jQuery(sb_veb_attr_data).each(function (index3, attr3) {
           
            var sb_veb_attrs = attr3.attributes;
            sb_veb_attr_set_matched = 0; 

            jQuery(sb_veb_attrs).each(function (index4, attr4) {
                jQuery(attr4).each(function (index4, attr4) {
                    jQuery(sb_veb_attr_set).each(function (index5, attr5) {
                        if (attr4[attr5[0]] == attr5[1] || attr4[attr5[0]] == "") {
                            sb_veb_attr_set_matched++;
                        }
                    });
                });
            });

            if (sb_veb_attr_set_matched >= sb_veb_attr_set_l) {
                sb_veb_found_set = attr3; 
            }
        });

        if (typeof sb_veb_found_set.image !== 'undefined') {
            sb_veb_large_image = sb_veb_found_set.image.full_src;
        } else {
            sb_veb_large_image = jQuery('.sb_veb_product_thumb_col_num_1 a').data('large_image');
        }

        sb_veb_product_thumb_replace_by_url(sb_veb_large_image, jQuery('.sb_veb_product_image_container')); //we aren't selecting the same element here so just grab the image directly
    }
}

function sb_veb_product_thumb_replace_by_url(large_image, image_object) {
    if (jQuery('.single-product .sb_veb_product_image img').attr('src') == large_image) {
        return;
    }

    var parent_object = image_object.closest('.sb_veb_product_image_container');

    if (parent_object.length == 0) {
        var parent_object = jQuery('.sb_veb_product_image_container');
    }

    if (parent_object.length) {

        parent_object.find('.sb_veb_product_image img').trigger('zoom.destroy'); 
        parent_object.find('.sb_veb_product_image img.zoomImg').remove(); 

        var image_height = parent_object.find('.sb_veb_product_image img').height();

        parent_object.find('.sb_veb_product_image').css('height', image_height + 'px');

        parent_object.find('.sb_veb_product_image img').fadeOut(400, function () {
            parent_object.find('.sb_veb_product_image img').attr('src', large_image);

            parent_object.find('.sb_veb_product_image').imagesLoaded(function () {
                var image_height = parent_object.find('.sb_veb_product_image img').height();

                parent_object.find('.sb_veb_product_image').css('height', image_height + 'px');

                parent_object.find('.sb_veb_product_image img').fadeIn(400, function () {
                    if (!parent_object.find('.sb_veb_product_image').hasClass('sb_veb_image_disable_zoom')) {
                        parent_object.find('.sb_veb_product_image').zoom({
                            callback: function callback() {
                                if (!parent_object.find('.sb_veb_product_image').hasClass('sb_veb_image_disable_lightbox')) {
                                    jQuery(this).colorbox({
                                        href: parent_object.find('.sb_veb_product_image img').attr('src')
                                    });
                                }
                            }
                        });
                    } else {
                        if (!parent_object.find('.sb_veb_product_image').hasClass('sb_veb_image_disable_lightbox')) {
                            jQuery('.sb_veb_product_image').colorbox({
                                href: parent_object.find('.sb_veb_product_image img').attr('src')
                            });
                        }
                    }
                });
            });
        });
    } else {

    }
}

function sb_veb_product_thumb_replace(image_object) {
    var large_image = image_object.data('large_image');

    sb_veb_product_thumb_replace_by_url(large_image, image_object);
}