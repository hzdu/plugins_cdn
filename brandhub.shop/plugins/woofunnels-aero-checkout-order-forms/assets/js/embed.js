(function ($) {
    "use strict";
    $(document.body).on('wfacp_step_switching', function (e, v) {
        if (typeof v == "undefined") {
            return;
        }
        var next_shown = v.next_shown;
        var prev_step = v.hide_parent;
        var wfacp_payment_tab_list = $('.wfacp-payment-tab-list');
        wfacp_payment_tab_list.removeClass('wfacp-active');
        var addon = $('.wfacp-payment-tab-list.' + next_shown);

        if (addon.length > 0) {
            addon.addClass('wfacp-active');
        }
        if (wfacp_payment_tab_list.hasClass(prev_step)) {
            $('.wfacp-payment-tab-list.' + prev_step).addClass("visited_cls");
            addon.addClass("visited_cls");
        }
        $(".wfacp_modal_container").scroll().animate({
            scrollTop: 0
        }, 1000);
    });
    $(document.body).on('checkout_error', function () {
        $(".wfacp_modal_container").scroll().animate({
            scrollTop: 0
        }, 1000);
        var strip_error = $('ul.woocommerce_error.woocommerce-error.wc-stripe-error:visible');
        if (strip_error.length > 0) {
            $.scroll_to_notices(strip_error);
        }
    });

    $(document).ready(function (e) {
        $(".wfacp-payment-tab-list").off('click').on('click', function (e) {
            e.preventDefault();


            if ($(this).hasClass("visited_cls")) {
                var step = $(this).attr('step');

                let parent_el = $('.wfacp_page:visible');
                if (parent_el.hasClass(step)) {
                    return;
                }

                $('.woocommerce-error').remove();
                validate_fields(parent_el.find('.wfacp-form-control:visible'));
                let control = parent_el.find('.woocommerce-invalid:visible');
                if (control.length > 0) {
                    $('.wfacp_payment').removeClass('wfacp_show_payment_part');
                    $(document.body).trigger('checkout_error');
                    return;
                }
                $('.wfacp-payment-tab-list').removeClass('wfacp-active');
                $(this).addClass('wfacp-active');
                $(".wfacp_page").hide();
                $(".wfacp_page." + step).show();
                if ($('.country_to_state').length > 0) {
                    $(document.body).trigger('country_to_state_changed');
                }

            }
        });
        $('.wfacp_modal_open').on('click', function (e) {
            e.preventDefault();
            $('.wfacp_modal_overlay').removeClass("wfacp_display_none");
            $('.wfacp_modal_outerwrap').fadeIn(300);
            $('body').addClass("wfacp_overflow_hide");
        });

        //----- CLOSE
        $('.wfacp_modal_close').on('click', function (e) {
            e.preventDefault();
            $('.wfacp_modal_overlay').addClass("wfacp_display_none");
            $('.wfacp_modal_outerwrap').fadeOut(300);
            $('body').removeClass("wfacp_overflow_hide");
        });

        (function () {
            var loginForm = $(".woocommerce-form-login");
            var modal_al = $(".wfacp_modal_open");
            if (modal_al.length > 0) {
                var user_login_opten_popup = localStorage.getItem('wfacp_embed_form_login');
                if (user_login_opten_popup !== null && user_login_opten_popup === 'yes') {
                    localStorage.removeItem('wfacp_embed_form_login');
                    modal_al.trigger('click');
                }
            }
            loginForm.on('submit', function () {
                localStorage.setItem("wfacp_embed_form_login", 'yes');
            });
        })();
    });
})(jQuery);


