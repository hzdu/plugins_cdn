jQuery(window).on('elementor/frontend/init', () => {
    "use strict";
    elementorFrontend.hooks.addAction('frontend/element_ready/woocommerce-lucky-wheel.default', function ($scope) {
        if (!window.elementor) {
            return;
        }
        let $container = $scope.find('.wc-lucky-wheel-shortcode-container');
        if (!$container || $container.length === 0) {
            return;
        }
        let shortcode_id = $container.attr('id');
        let shortcode_args = $container.data('shortcode_args');
        /*Click button spin when input fields are on focus and Enter key is pressed*/
        $container.find('.wc-lucky-wheel-shortcode-wheel-field').on('keyup', function (e) {
            if (e.keyCode === 13) {
                $container.find('.wc-lucky-wheel-shortcode-wheel-button').click();
            }
        });
        let congratulations_effect = shortcode_args.congratulations_effect;
        let font_size = shortcode_args.font_size || 100;
        let wheel_size = shortcode_args.wheel_size || 100;
        let custom_field_name_enable = shortcode_args.custom_field_name_enable;
        let custom_field_name_required = shortcode_args.custom_field_name_required;
        let custom_field_mobile_enable = shortcode_args.custom_field_mobile_enable;
        let custom_field_mobile_required = shortcode_args.custom_field_mobile_required;
        let color = shortcode_args.color;
        let slices_text_color = shortcode_args.slices_text_color;
        let label = shortcode_args.label;
        let piece_coupons = shortcode_args.coupon_type;
        let wlwl_center_color = shortcode_args.wheel_center_color;
        let wlwl_border_color = shortcode_args.wheel_border_color;
        let wlwl_dot_color = shortcode_args.wheel_dot_color;
        let gdpr_checkbox = shortcode_args.gdpr;
        let wlwl_spinning_time = shortcode_args.spinning_time;
        let wheel_speed = shortcode_args.wheel_speed;
        let center_image = shortcode_args.center_image;

        let slices = piece_coupons.length;
        let sliceDeg = 360 / slices;
        let deg = -(sliceDeg / 2);
        let cv = $container.find('.wc-lucky-wheel-shortcode-wheel-canvas-1')[0];
        if (cv === undefined) {
            return;
        }
        let ctx = cv.getContext('2d');

        let canvas_width;
        let wd_width, wd_height;
        wd_width = window.innerWidth;
        wd_height = window.innerHeight;
        if (wd_width > wd_height) {
            canvas_width = wd_height;
        } else {
            canvas_width = wd_width;
        }
        let width = parseInt(canvas_width * 0.75 + 16);// size
        if (canvas_width > 480) {
            width = parseInt(wheel_size * (canvas_width * 0.55 + 16) / 100);
        }
        cv.width = width;
        cv.height = width;
        if (window.devicePixelRatio) {
            let hidefCanvasWidth = jQuery(cv).attr('width');
            let hidefCanvasHeight = jQuery(cv).attr('height');
            let hidefCanvasCssWidth = hidefCanvasWidth;
            let hidefCanvasCssHeight = hidefCanvasHeight;
            jQuery(cv).attr('width', hidefCanvasWidth * window.devicePixelRatio);
            jQuery(cv).attr('height', hidefCanvasHeight * window.devicePixelRatio);
            jQuery(cv).css('width', hidefCanvasCssWidth);
            jQuery(cv).css('height', hidefCanvasCssHeight);
            ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
        }

        let center = width / 2; // center
        $container.find('.wc-lucky-wheel-shortcode-wheel-canvas').css({
            'width': width + 'px',
            'height': width + 'px'
        });
        let inline_css = '';
        if (shortcode_args.pointer_position === 'center') {
            inline_css += '#' + shortcode_id + ' .wc-lucky-wheel-shortcode-wheel-pointer:before{font-size:' + parseInt(width / 4) + 'px !important; }';
        } else {
            inline_css += '#' + shortcode_id + ' .wc-lucky-wheel-shortcode-wheel-pointer:before{font-size:' + parseInt(width / 10) + 'px !important; }';
            inline_css += '#' + shortcode_id + '.wc-lucky-wheel-shortcode-margin-position .wc-lucky-wheel-shortcode-wheel-container .wc-lucky-wheel-shortcode-wheel-pointer-container .wc-lucky-wheel-shortcode-wheel-pointer:after{width:' + parseInt(width / 25) + 'px !important;height:' + parseInt(width / 25) + 'px !important;bottom:' + parseInt(width / 25) + 'px !important; }';
        }
        jQuery('head').append('<style type="text/css">' + inline_css + '</style>');
        let wheel_text_size;
        wheel_text_size = parseInt(width / 28) * parseInt(font_size) / 100;

        function wlwl_shortcode_deg2rad(deg) {
            return deg * Math.PI / 180;
        }

        function wlwl_shortcode_drawSlice(deg, color) {
            ctx.beginPath();
            ctx.fillStyle = color;
            ctx.moveTo(center, center);
            let r;
            if (width <= 480) {
                r = width / 2 - 10;
            } else {
                r = width / 2 - 14;
            }
            ctx.arc(center, center, r, wlwl_shortcode_deg2rad(deg), wlwl_shortcode_deg2rad(deg + sliceDeg));
            ctx.lineTo(center, center);
            ctx.fill();
        }

        function wlwl_shortcode_drawPoint(deg, color) {
            ctx.save();
            ctx.beginPath();
            ctx.fillStyle = color;
            ctx.shadowBlur = 1;
            ctx.shadowOffsetX = 8;
            ctx.shadowOffsetY = 8;
            ctx.shadowColor = 'rgba(0,0,0,0.2)';
            ctx.arc(center, center, width / 8, 0, 2 * Math.PI);
            ctx.fill();
            ctx.clip();
            ctx.restore();
        }

        function wlwl_shortcode_drawBorder(borderC, dotC, lineW, dotR, des, shadColor) {
            let center1 = center - 2 * des;
            ctx.beginPath();
            ctx.strokeStyle = borderC;
            ctx.lineWidth = lineW;
            ctx.shadowBlur = 1;
            ctx.shadowOffsetX = 6;
            ctx.shadowOffsetY = 6;
            ctx.shadowColor = shadColor;
            ctx.arc(center, center, center1, 0, 2 * Math.PI);
            ctx.stroke();
            let x_val, y_val, deg;
            deg = sliceDeg / 2;
            for (let i = 0; i < slices; i++) {
                ctx.beginPath();
                ctx.fillStyle = dotC;
                x_val = center + center1 * Math.cos(deg * Math.PI / 180);
                y_val = center - center1 * Math.sin(deg * Math.PI / 180);
                ctx.arc(x_val, y_val, dotR, 0, 2 * Math.PI);
                ctx.fill();
                deg += sliceDeg;
            }
        }

        function wlwl_shortcode_drawText(deg, text, color) {
            let font_text_wheel = 'Helvetica';
            if (typeof shortcode_args.font_text_wheel !== 'undefined' && shortcode_args.font_text_wheel !== '') {
                font_text_wheel = shortcode_args.font_text_wheel;
            }
            ctx.save();
            ctx.translate(center, center);
            ctx.rotate(wlwl_shortcode_deg2rad(deg));
            ctx.textAlign = "right";
            ctx.fillStyle = color;
            ctx.font = '200 ' + wheel_text_size + 'px ' + font_text_wheel;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;
            text = text.replace(/&#(\d{1,4});/g, function (fullStr, code) {
                return String.fromCharCode(code);
            });
            let reText = text.split('\/n'), text1 = '', text2 = '', text3 = '';
            if (reText.length > 1) {
                text1 = reText[0];
                if (reText.length > 2) {
                    text2 = reText[1];
                } else {
                    text2 = reText.splice(1, reText.length - 1);
                    text2 = text2.join('');
                }
                text3 = reText.splice(2, reText.length - 1);
                text3 = text3.join('');

            } else {
                reText = text.split('\\n');
                if (reText.length > 1) {
                    text1 = reText[0];
                    text2 = reText.splice(1, reText.length - 1);
                    text2 = text2.join('');
                    text3 = reText.splice(2, reText.length - 2);
                    text3 = text3.join('');
                }
            }
            if (text1.trim() !== "" && text2.trim() !== "" && text3.trim() === "") {
                ctx.fillText(text1.trim(), 7 * center / 8, -(wheel_text_size * 1 / 4));
                ctx.fillText(text2.trim(), 7 * center / 8, wheel_text_size * 3 / 4);
            } else if (text1.trim() !== "" && text2.trim() !== "" && text3.trim() !== "") {
                ctx.fillText(text1.trim(), 7 * center / 8, -(wheel_text_size * 1 / 2));
                ctx.fillText(text2.trim(), 7 * center / 8, (wheel_text_size * 1 / 2));
                ctx.fillText(text3.trim(), 7 * center / 8, (wheel_text_size * 1.5));
            } else {
                ctx.fillText(text.replace(/\\n/g, '').replace(/\/n/g, ''), 7 * center / 8, wheel_text_size / 2 - 2);
            }
            ctx.restore();
        }

        function wlwl_shortcode_spins_wheel($container, stop_position, result_notification, result) {
            let canvas_1 = $container.find('.wc-lucky-wheel-shortcode-wheel-canvas-1');
            let canvas_3 = $container.find('.wc-lucky-wheel-shortcode-wheel-canvas-3');
            let default_css = '';
            if (window.devicePixelRatio) {
                default_css = 'width:' + width + 'px;height:' + width + 'px;';
            }
            canvas_1.attr('style', default_css);
            canvas_3.attr('style', default_css);
            let stop_deg = 360 - sliceDeg * stop_position;
            let wheel_stop = wheel_speed * 360 * wlwl_spinning_time + stop_deg;
            let css = default_css + '-moz-transform: rotate(' + wheel_stop + 'deg);-webkit-transform: rotate(' + wheel_stop + 'deg);-o-transform: rotate(' + wheel_stop + 'deg);-ms-transform: rotate(' + wheel_stop + 'deg);transform: rotate(' + wheel_stop + 'deg);';
            css += '-webkit-transition: transform ' + wlwl_spinning_time + 's ease;-moz-transition: transform ' + wlwl_spinning_time + 's ease;-ms-transition: transform ' + wlwl_spinning_time + 's ease;-o-transition: transform ' + wlwl_spinning_time + 's ease;transition: transform ' + wlwl_spinning_time + 's ease;';
            canvas_1.attr('style', css);
            canvas_3.attr('style', css);
            spinning = true;
            setTimeout(function () {
                if (result === 'win' && congratulations_effect === 'firework') {
                    $container.find('.wlwl-congratulations-effect').addClass('wlwl-congratulations-effect-firework');
                }
                $container.find('.wc-lucky-wheel-shortcode-wheel-fields-container').html('<div class="wc-lucky-wheel-shortcode--frontend-result">' + result_notification + '</div>');
                $container.find('.wc-lucky-wheel-shortcode-wheel-button-wrap').removeClass('wc-lucky-wheel-shortcode-loading');
                css = default_css + 'transform: rotate(' + stop_deg + 'deg);';
                canvas_1.attr('style', css);
                canvas_3.attr('style', css);
                spinning = false;
            }, parseInt(wlwl_spinning_time * 1000))
        }

        function isValidEmailAddress(emailAddress) {
            let pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}jQuery/i;
            return pattern.test(emailAddress);
        }

        let spinning = false;

        function validateRecaptcha(response) {
            if (response) {
                jQuery('.wlwl-shortcode-recaptcha-field #wlwl-shortcode-g-validate-response').val(response);
            }
        }

        function expireRecaptcha() {
            jQuery('.wlwl-shortcode-recaptcha-field #wlwl-shortcode-g-validate-response').val(null);
        }

        /* Googele recaptcha */
        window.addEventListener('load', function () {
            if (shortcode_args.wlwl_recaptcha == 'on') {
                if (shortcode_args.wlwl_recaptcha_version == 2) {
                    wlwlreCaptchaV2Onload();
                } else {
                    wlwlreCaptchaV3Onload();
                    jQuery('.wlwl-shortcode-recaptcha-field').hide();
                }
            } else {
                jQuery('.wlwl-shortcode-recaptcha-field').hide();
            }
        });

        function wlwlreCaptchaV3Onload() {
            grecaptcha.ready(function () {
                grecaptcha.execute(shortcode_args.wlwl_recaptcha_site_key, {action: 'homepage'}).then(function (token) {
                    validateRecaptcha(token);
                })
            });
        }

        function wlwlreCaptchaV2Onload() {
            if (jQuery.find('.wlwl-shortcode-recaptcha').length == 0 || jQuery.find('.wlwl-shortcode-recaptcha iframe').length) {
                return true;
            }
            grecaptcha.render('wlwl-shortcode-recaptcha', {

                'sitekey': shortcode_args.wlwl_recaptcha_site_key,

                'callback': validateRecaptcha,

                'expired-callback': expireRecaptcha,

                'theme': shortcode_args.wlwl_recaptcha_secret_theme,

                'isolated': false
            });

        }

        function wlwl_shortcode_check_email() {
            $container.find('.wc-lucky-wheel-shortcode-wheel-button-wrap').on('click', function () {
                if (spinning) {
                    return;
                }
                $('#wlwl_shortcode_warring_recaptcha').html('');
                $('.wlwl-shortcode-recaptcha-field').removeClass('wc-lucky-wheel-shortcode-required-field');
                let $button = jQuery(this);
                let $error_email = $container.find('.wc-lucky-wheel-shortcode-wheel-field-error-email');
                $error_email.html('');
                let $email = $container.find('.wc-lucky-wheel-shortcode-wheel-field-email');
                let $email_container = $email.closest('.wc-lucky-wheel-shortcode-wheel-field-email-wrap');
                let $name = $container.find('.wc-lucky-wheel-shortcode-wheel-field-name');
                let $name_container = $name.closest('.wc-lucky-wheel-shortcode-wheel-field-name-wrap');
                let $mobile = $container.find('.wc-lucky-wheel-shortcode-wheel-field-mobile');
                let $mobile_container = $mobile.closest('.wc-lucky-wheel-shortcode-wheel-field-mobile-wrap');
                $email_container.removeClass('wc-lucky-wheel-shortcode-required-field');
                $name_container.removeClass('wc-lucky-wheel-shortcode-required-field');
                $mobile_container.removeClass('wc-lucky-wheel-shortcode-required-field');
                if ('on' === gdpr_checkbox && !jQuery('.wc-lucky-wheel-shortcode-wheel-gdpr-wrap input[type="checkbox"]').prop('checked')) {
                    alert(shortcode_args.gdpr_warning);
                    return false;
                }
                let wlwl_email = $email.val();
                let wlwl_name = $name.val();
                let wlwl_mobile = $mobile.val();
                let shortcode_g_validate_response = $('#wlwl-shortcode-g-validate-response').val();
                let qualified = true;
                let focus_field;
                if (shortcode_args.wlwl_recaptcha && shortcode_args.wlwl_recaptcha_site_key && !shortcode_g_validate_response) {
                    $('.wlwl-shortcode-recaptcha-field #wlwl-shortcode-recaptcha > div').addClass('wc-lucky-wheel-shortcode-required-field').focus();
                    $('#wlwl_shortcode_warring_recaptcha').html(shortcode_args.wlwl_warring_recaptcha);
                    qualified = false;
                } else if (shortcode_args.wlwl_recaptcha && shortcode_args.wlwl_recaptcha_site_key) {
                    $('.wlwl-shortcode-recaptcha-field #wlwl-shortcode-recaptcha > div').removeClass('wc-lucky-wheel-shortcode-required-field');
                    qualified = true;
                }
                if (!wlwl_email) {
                    $email.prop('disabled', false);
                    focus_field = $email;
                    $error_email.html(shortcode_args.empty_email_warning);
                    $email_container.addClass('wc-lucky-wheel-shortcode-required-field');
                    qualified = false;
                }

                if (!isValidEmailAddress(wlwl_email)) {
                    $email.prop('disabled', false);
                    focus_field = $email;
                    $error_email.html(shortcode_args.invalid_email_warning);
                    $email_container.addClass('wc-lucky-wheel-shortcode-required-field');
                    qualified = false;
                }
                if (custom_field_mobile_enable === 'on' && custom_field_mobile_required === 'on' && !wlwl_mobile) {
                    $mobile_container.addClass('wc-lucky-wheel-shortcode-required-field');
                    $mobile.attr('placeholder', shortcode_args.custom_field_mobile_message);
                    focus_field = $mobile;
                    qualified = false;
                }
                if (custom_field_name_enable === 'on' && custom_field_name_required === 'on' && !wlwl_name) {
                    $name_container.addClass('wc-lucky-wheel-shortcode-required-field');
                    $name.attr('placeholder', shortcode_args.custom_field_name_message);
                    focus_field = $name;
                    qualified = false;
                }

                if (qualified === false) {
                    focus_field.focus();
                    return false;
                }
                $email.prop('disabled', true);
                $error_email.html('');
                $button.addClass('wc-lucky-wheel-shortcode-loading');
                jQuery.ajax({
                    type: 'post',
                    dataType: 'json',
                    url: shortcode_args.ajaxurl,
                    data: {
                        user_email: wlwl_email,
                        user_name: wlwl_name,
                        user_mobile: wlwl_mobile,
                        language: shortcode_args.language,
                        _woocommerce_lucky_wheel_nonce: jQuery('#_woocommerce_lucky_wheel_nonce').val(),
                    },
                    success: function (response) {
                        if (response.allow_spin === 'yes') {
                            wlwl_shortcode_spins_wheel($container, response.stop_position, response.result_notification, response.result);
                        } else {
                            $button.removeClass('wc-lucky-wheel-shortcode-loading');
                            $email.prop('disabled', false);
                            alert(response.allow_spin);
                        }
                    }
                });
            });
        }

        wlwl_shortcode_check_email();
        let center1 = 32;
        for (let i = 0; i < slices; i++) {
            wlwl_shortcode_drawSlice(deg, color[i]);
            wlwl_shortcode_drawText(deg + sliceDeg / 2, label[i], slices_text_color[i]);
            deg += sliceDeg;

        }
        cv = $container.find('.wc-lucky-wheel-shortcode-wheel-canvas-2')[0];
        ctx = cv.getContext('2d');
        cv.width = width;
        cv.height = width;
        if (window.devicePixelRatio) {
            let hidefCanvasWidth = jQuery(cv).attr('width');
            let hidefCanvasHeight = jQuery(cv).attr('height');
            let hidefCanvasCssWidth = hidefCanvasWidth;
            let hidefCanvasCssHeight = hidefCanvasHeight;

            jQuery(cv).attr('width', hidefCanvasWidth * window.devicePixelRatio);
            jQuery(cv).attr('height', hidefCanvasHeight * window.devicePixelRatio);
            jQuery(cv).css('width', hidefCanvasCssWidth);
            jQuery(cv).css('height', hidefCanvasCssHeight);
            ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
        }
        wlwl_shortcode_drawPoint(deg, wlwl_center_color);
        if (center_image) {
            let wl_image = new Image;
            wl_image.onload = function () {
                cv = $container.find('.wc-lucky-wheel-shortcode-wheel-canvas-2')[0];
                ctx = cv.getContext('2d');
                let image_size = 2 * (width / 8 - 7);
                ctx.arc(center, center, image_size / 2, 0, 2 * Math.PI);
                ctx.clip();
                ctx.drawImage(wl_image, center - image_size / 2, center - image_size / 2, image_size, image_size);

            };
            wl_image.src = center_image;
        }

        if (width <= 480) {
            wlwl_shortcode_drawBorder(wlwl_border_color, 'rgba(0,0,0,0)', 8, 3, 4, 'rgba(0,0,0,0.2)');
        } else {
            wlwl_shortcode_drawBorder(wlwl_border_color, 'rgba(0,0,0,0)', 16, 6, 7, 'rgba(0,0,0,0.2)');
        }
        cv = $container.find('.wc-lucky-wheel-shortcode-wheel-canvas-3')[0];
        ctx = cv.getContext('2d');

        cv.width = width;
        cv.height = width;
        if (window.devicePixelRatio) {
            let hidefCanvasWidth = jQuery(cv).attr('width');
            let hidefCanvasHeight = jQuery(cv).attr('height');
            let hidefCanvasCssWidth = hidefCanvasWidth;
            let hidefCanvasCssHeight = hidefCanvasHeight;

            jQuery(cv).attr('width', hidefCanvasWidth * window.devicePixelRatio);
            jQuery(cv).attr('height', hidefCanvasHeight * window.devicePixelRatio);
            jQuery(cv).css('width', hidefCanvasCssWidth);
            jQuery(cv).css('height', hidefCanvasCssHeight);
            ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
        }
        if (width <= 480) {
            wlwl_shortcode_drawBorder('rgba(0,0,0,0)', wlwl_dot_color, 8, 3, 4, 'rgba(0,0,0,0)');
        } else {
            wlwl_shortcode_drawBorder('rgba(0,0,0,0)', wlwl_dot_color, 16, 6, 7, 'rgba(0,0,0,0)');
        }
    });
});
jQuery(document).ready(function ($) {
    "use strict";
    $('.wc-lucky-wheel-shortcode-container').map(function () {
        let $container = $(this);
        let shortcode_id = $container.attr('id');
        let shortcode_args = $container.data('shortcode_args');
        /*Click button spin when input fields are on focus and Enter key is pressed*/
        $container.find('.wc-lucky-wheel-shortcode-wheel-field').on('keyup', function (e) {
            if (e.keyCode === 13) {
                $container.find('.wc-lucky-wheel-shortcode-wheel-button').click();
            }
        });
        let congratulations_effect = shortcode_args.congratulations_effect;
        let font_size = shortcode_args.font_size || 100;
        let wheel_size = shortcode_args.wheel_size || 100;
        let custom_field_name_enable = shortcode_args.custom_field_name_enable;
        let custom_field_name_required = shortcode_args.custom_field_name_required;
        let custom_field_mobile_enable = shortcode_args.custom_field_mobile_enable;
        let custom_field_mobile_required = shortcode_args.custom_field_mobile_required;
        let color = shortcode_args.color;
        let slices_text_color = shortcode_args.slices_text_color;
        let label = shortcode_args.label;
        let piece_coupons = shortcode_args.coupon_type;
        let wlwl_center_color = shortcode_args.wheel_center_color;
        let wlwl_border_color = shortcode_args.wheel_border_color;
        let wlwl_dot_color = shortcode_args.wheel_dot_color;
        let gdpr_checkbox = shortcode_args.gdpr;
        let wlwl_spinning_time = shortcode_args.spinning_time;
        let wheel_speed = shortcode_args.wheel_speed;
        let center_image = shortcode_args.center_image;

        let slices = piece_coupons.length;
        let sliceDeg = 360 / slices;
        let deg = -(sliceDeg / 2);
        let cv = $container.find('.wc-lucky-wheel-shortcode-wheel-canvas-1')[0];
        if (cv === undefined) {
            return;
        }
        let ctx = cv.getContext('2d');

        let canvas_width;
        let wd_width, wd_height;
        wd_width = window.innerWidth;
        wd_height = window.innerHeight;
        if (wd_width > wd_height) {
            canvas_width = wd_height;
        } else {
            canvas_width = wd_width;
        }
        let width = parseInt(canvas_width * 0.75 + 16);// size
        if (canvas_width > 480) {
            width = parseInt(wheel_size * (canvas_width * 0.55 + 16) / 100);
        }
        cv.width = width;
        cv.height = width;
        if (window.devicePixelRatio) {
            let hidefCanvasWidth = $(cv).attr('width');
            let hidefCanvasHeight = $(cv).attr('height');
            let hidefCanvasCssWidth = hidefCanvasWidth;
            let hidefCanvasCssHeight = hidefCanvasHeight;
            $(cv).attr('width', hidefCanvasWidth * window.devicePixelRatio);
            $(cv).attr('height', hidefCanvasHeight * window.devicePixelRatio);
            $(cv).css('width', hidefCanvasCssWidth);
            $(cv).css('height', hidefCanvasCssHeight);
            ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
        }

        let center = width / 2; // center
        $container.find('.wc-lucky-wheel-shortcode-wheel-canvas').css({'width': width + 'px', 'height': width + 'px'});
        let inline_css = '';
        if (shortcode_args.pointer_position === 'center') {
            inline_css += '#' + shortcode_id + ' .wc-lucky-wheel-shortcode-wheel-pointer:before{font-size:' + parseInt(width / 4) + 'px !important; }';
        } else {
            inline_css += '#' + shortcode_id + ' .wc-lucky-wheel-shortcode-wheel-pointer:before{font-size:' + parseInt(width / 10) + 'px !important; }';
            inline_css += '#' + shortcode_id + '.wc-lucky-wheel-shortcode-margin-position .wc-lucky-wheel-shortcode-wheel-container .wc-lucky-wheel-shortcode-wheel-pointer-container .wc-lucky-wheel-shortcode-wheel-pointer:after{width:' + parseInt(width / 25) + 'px !important;height:' + parseInt(width / 25) + 'px !important;bottom:' + parseInt(width / 25) + 'px !important; }';
        }
        $('head').append('<style type="text/css">' + inline_css + '</style>');
        let wheel_text_size;
        wheel_text_size = parseInt(width / 28) * parseInt(font_size) / 100;

        function wlwl_shortcode_deg2rad(deg) {
            return deg * Math.PI / 180;
        }

        function wlwl_shortcode_drawSlice(deg, color) {
            ctx.beginPath();
            ctx.fillStyle = color;
            ctx.moveTo(center, center);
            let r;
            if (width <= 480) {
                r = width / 2 - 10;
            } else {
                r = width / 2 - 14;
            }
            ctx.arc(center, center, r, wlwl_shortcode_deg2rad(deg), wlwl_shortcode_deg2rad(deg + sliceDeg));
            ctx.lineTo(center, center);
            ctx.fill();
        }

        function wlwl_shortcode_drawPoint(deg, color) {
            ctx.save();
            ctx.beginPath();
            ctx.fillStyle = color;
            ctx.shadowBlur = 1;
            ctx.shadowOffsetX = 8;
            ctx.shadowOffsetY = 8;
            ctx.shadowColor = 'rgba(0,0,0,0.2)';
            ctx.arc(center, center, width / 8, 0, 2 * Math.PI);
            ctx.fill();
            ctx.clip();
            ctx.restore();
        }

        function wlwl_shortcode_drawBorder(borderC, dotC, lineW, dotR, des, shadColor) {
            let center1 = center - 2 * des;
            ctx.beginPath();
            ctx.strokeStyle = borderC;
            ctx.lineWidth = lineW;
            ctx.shadowBlur = 1;
            ctx.shadowOffsetX = 6;
            ctx.shadowOffsetY = 6;
            ctx.shadowColor = shadColor;
            ctx.arc(center, center, center1, 0, 2 * Math.PI);
            ctx.stroke();
            let x_val, y_val, deg;
            deg = sliceDeg / 2;
            for (let i = 0; i < slices; i++) {
                ctx.beginPath();
                ctx.fillStyle = dotC;
                x_val = center + center1 * Math.cos(deg * Math.PI / 180);
                y_val = center - center1 * Math.sin(deg * Math.PI / 180);
                ctx.arc(x_val, y_val, dotR, 0, 2 * Math.PI);
                ctx.fill();
                deg += sliceDeg;
            }
        }

        function wlwl_shortcode_drawText(deg, text, color) {
            let font_text_wheel = 'Helvetica';
            if (typeof shortcode_args.font_text_wheel !== 'undefined' && shortcode_args.font_text_wheel !== '') {
                font_text_wheel = shortcode_args.font_text_wheel;
            }
            ctx.save();
            ctx.translate(center, center);
            ctx.rotate(wlwl_shortcode_deg2rad(deg));
            ctx.textAlign = "right";
            ctx.fillStyle = color;
            ctx.font = '400 ' + wheel_text_size + 'px ' + font_text_wheel;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;
            text = text.replace(/&#(\d{1,4});/g, function (fullStr, code) {
                return String.fromCharCode(code);
            });
            let reText = text.split('\/n'), text1 = '', text2 = '';
            if (reText.length > 1) {
                text1 = reText[0];
                text2 = reText.splice(1, reText.length - 1);
                text2 = text2.join('');
            } else {
                reText = text.split('\\n');
                if (reText.length > 1) {
                    text1 = reText[0];
                    text2 = reText.splice(1, reText.length - 1);
                    text2 = text2.join('');
                }
            }
            if (text1.trim() !== "" && text2.trim() !== "") {
                ctx.fillText(text1.trim(), 7 * center / 8, -(wheel_text_size * 1 / 4));
                ctx.fillText(text2.trim(), 7 * center / 8, wheel_text_size * 3 / 4);
            } else {
                ctx.fillText(text.replace(/\\n/g, '').replace(/\/n/g, ''), 7 * center / 8, wheel_text_size / 2 - 2);
            }
            ctx.restore();
        }

        function wlwl_shortcode_spins_wheel($container, stop_position, result_notification, result) {
            let canvas_1 = $container.find('.wc-lucky-wheel-shortcode-wheel-canvas-1');
            let canvas_3 = $container.find('.wc-lucky-wheel-shortcode-wheel-canvas-3');
            let default_css = '';
            if (window.devicePixelRatio) {
                default_css = 'width:' + width + 'px;height:' + width + 'px;';
            }
            canvas_1.attr('style', default_css);
            canvas_3.attr('style', default_css);
            let stop_deg = 360 - sliceDeg * stop_position;
            let wheel_stop = wheel_speed * 360 * wlwl_spinning_time + stop_deg;
            let css = default_css + '-moz-transform: rotate(' + wheel_stop + 'deg);-webkit-transform: rotate(' + wheel_stop + 'deg);-o-transform: rotate(' + wheel_stop + 'deg);-ms-transform: rotate(' + wheel_stop + 'deg);transform: rotate(' + wheel_stop + 'deg);';
            css += '-webkit-transition: transform ' + wlwl_spinning_time + 's ease;-moz-transition: transform ' + wlwl_spinning_time + 's ease;-ms-transition: transform ' + wlwl_spinning_time + 's ease;-o-transition: transform ' + wlwl_spinning_time + 's ease;transition: transform ' + wlwl_spinning_time + 's ease;';
            canvas_1.attr('style', css);
            canvas_3.attr('style', css);
            spinning = true;
            setTimeout(function () {
                if (result === 'win' && congratulations_effect === 'firework') {
                    $container.find('.wlwl-congratulations-effect').addClass('wlwl-congratulations-effect-firework');
                }
                $container.find('.wc-lucky-wheel-shortcode-wheel-fields-container').html('<div class="wc-lucky-wheel-shortcode--frontend-result">' + result_notification + '</div>');
                $container.find('.wc-lucky-wheel-shortcode-wheel-button-wrap').removeClass('wc-lucky-wheel-shortcode-loading');
                css = default_css + 'transform: rotate(' + stop_deg + 'deg);';
                canvas_1.attr('style', css);
                canvas_3.attr('style', css);
                spinning = false;
            }, parseInt(wlwl_spinning_time * 1000))
        }

        function isValidEmailAddress(emailAddress) {
            let pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/i;
            return pattern.test(emailAddress);
        }

        let spinning = false;

        function validateRecaptcha(response) {
            if (response) {
                jQuery('.wlwl-shortcode-recaptcha-field #wlwl-shortcode-g-validate-response').val(response);
            }
        }

        function expireRecaptcha() {
            jQuery('.wlwl-shortcode-recaptcha-field #wlwl-shortcode-g-validate-response').val(null);
        }

        /* Googele recaptcha */
        window.addEventListener('load', function () {
            if (shortcode_args.wlwl_recaptcha == 'on') {
                if (shortcode_args.wlwl_recaptcha_version == 2) {
                    wlwlreCaptchaV2Onload();
                } else {
                    wlwlreCaptchaV3Onload();
                    jQuery('.wlwl-shortcode-recaptcha-field').hide();
                }
            } else {
                jQuery('.wlwl-shortcode-recaptcha-field').hide();
            }
        });

        function wlwlreCaptchaV3Onload() {
            grecaptcha.ready(function () {
                grecaptcha.execute(shortcode_args.wlwl_recaptcha_site_key, {action: 'homepage'}).then(function (token) {
                    validateRecaptcha(token);
                })
            });
        }

        function wlwlreCaptchaV2Onload() {
            if (jQuery.find('.wlwl-shortcode-recaptcha').length == 0 || jQuery.find('.wlwl-shortcode-recaptcha iframe').length) {
                return true;
            }
            grecaptcha.render('wlwl-shortcode-recaptcha', {
                'sitekey': shortcode_args.wlwl_recaptcha_site_key,
                'callback': validateRecaptcha,
                'expired-callback': expireRecaptcha,
                'theme': shortcode_args.wlwl_recaptcha_secret_theme,
                'isolated': false
            });

        }

        function wlwl_shortcode_check_email() {
            $container.find('.wc-lucky-wheel-shortcode-wheel-button-wrap').on('click', function () {
                if (spinning) {
                    return;
                }
                $('#wlwl_shortcode_warring_recaptcha').html('');
                let $button = $(this);
                let $error_email = $container.find('.wc-lucky-wheel-shortcode-wheel-field-error-email');
                $error_email.html('');
                let $email = $container.find('.wc-lucky-wheel-shortcode-wheel-field-email');
                let $email_container = $email.closest('.wc-lucky-wheel-shortcode-wheel-field-email-wrap');
                let $name = $container.find('.wc-lucky-wheel-shortcode-wheel-field-name');
                let $name_container = $name.closest('.wc-lucky-wheel-shortcode-wheel-field-name-wrap');
                let $mobile = $container.find('.wc-lucky-wheel-shortcode-wheel-field-mobile');
                let $mobile_container = $mobile.closest('.wc-lucky-wheel-shortcode-wheel-field-mobile-wrap');

                let shortcode_g_validate_response = $('#wlwl-shortcode-g-validate-response').val();

                $('.wlwl-shortcode-recaptcha-field').removeClass('wc-lucky-wheel-shortcode-required-field');
                $email_container.removeClass('wc-lucky-wheel-shortcode-required-field');
                $name_container.removeClass('wc-lucky-wheel-shortcode-required-field');
                $mobile_container.removeClass('wc-lucky-wheel-shortcode-required-field');

                if ('on' === gdpr_checkbox && !$('.wc-lucky-wheel-shortcode-wheel-gdpr-wrap input[type="checkbox"]').prop('checked')) {
                    alert(shortcode_args.gdpr_warning);
                    return false;
                }
                let wlwl_email = $email.val();
                let wlwl_name = $name.val();
                let wlwl_mobile = $mobile.val();
                let qualified = true;
                let focus_field;
                if (shortcode_args.wlwl_recaptcha && shortcode_args.wlwl_recaptcha_site_key && !shortcode_g_validate_response) {
                    $('.wlwl-shortcode-recaptcha-field #wlwl-shortcode-recaptcha > div').addClass('wc-lucky-wheel-shortcode-required-field').focus();
                    $('#wlwl_shortcode_warring_recaptcha').html(shortcode_args.wlwl_warring_recaptcha);
                    qualified = false;
                } else if (shortcode_args.wlwl_recaptcha && shortcode_args.wlwl_recaptcha_site_key) {
                    $('.wlwl-shortcode-recaptcha-field #wlwl-shortcode-recaptcha > div').removeClass('wc-lucky-wheel-shortcode-required-field');
                    qualified = true;
                }
                if (!wlwl_email) {
                    $email.prop('disabled', false);
                    focus_field = $email;
                    $error_email.html(shortcode_args.empty_email_warning);
                    $email_container.addClass('wc-lucky-wheel-shortcode-required-field');
                    qualified = false;
                }

                if (!isValidEmailAddress(wlwl_email)) {
                    $email.prop('disabled', false);
                    focus_field = $email;
                    $error_email.html(shortcode_args.invalid_email_warning);
                    $email_container.addClass('wc-lucky-wheel-shortcode-required-field');
                    qualified = false;
                }
                if (custom_field_mobile_enable === 'on' && custom_field_mobile_required === 'on' && !wlwl_mobile) {
                    $mobile_container.addClass('wc-lucky-wheel-shortcode-required-field');
                    $mobile.attr('placeholder', shortcode_args.custom_field_mobile_message);
                    focus_field = $mobile;
                    qualified = false;
                }
                if (custom_field_name_enable === 'on' && custom_field_name_required === 'on' && !wlwl_name) {
                    $name_container.addClass('wc-lucky-wheel-shortcode-required-field');
                    $name.attr('placeholder', shortcode_args.custom_field_name_message);
                    focus_field = $name;
                    qualified = false;
                }

                if (qualified === false) {
                    focus_field.focus();
                    return false;
                }
                $email.prop('disabled', true);
                $error_email.html('');
                $button.addClass('wc-lucky-wheel-shortcode-loading');
                $.ajax({
                    type: 'post',
                    dataType: 'json',
                    url: shortcode_args.ajaxurl,
                    data: {
                        user_email: wlwl_email,
                        user_name: wlwl_name,
                        user_mobile: wlwl_mobile,
                        language: shortcode_args.language,
                        g_validate_response: shortcode_g_validate_response,
                        _woocommerce_lucky_wheel_nonce: $('#_woocommerce_lucky_wheel_nonce').val(),
                    },
                    success: function (response) {
                        if (response.allow_spin === 'yes') {
                            wlwl_shortcode_spins_wheel($container, response.stop_position, response.result_notification, response.result);
                        } else {
                            $button.removeClass('wc-lucky-wheel-shortcode-loading');
                            $email.prop('disabled', false);
                            alert(response.allow_spin);
                        }
                    }
                });
            });
        }

        wlwl_shortcode_check_email();
        let center1 = 32;
        for (let i = 0; i < slices; i++) {
            wlwl_shortcode_drawSlice(deg, color[i]);
            wlwl_shortcode_drawText(deg + sliceDeg / 2, label[i], slices_text_color[i]);
            deg += sliceDeg;

        }
        cv = $container.find('.wc-lucky-wheel-shortcode-wheel-canvas-2')[0];
        ctx = cv.getContext('2d');
        cv.width = width;
        cv.height = width;
        if (window.devicePixelRatio) {
            let hidefCanvasWidth = $(cv).attr('width');
            let hidefCanvasHeight = $(cv).attr('height');
            let hidefCanvasCssWidth = hidefCanvasWidth;
            let hidefCanvasCssHeight = hidefCanvasHeight;

            $(cv).attr('width', hidefCanvasWidth * window.devicePixelRatio);
            $(cv).attr('height', hidefCanvasHeight * window.devicePixelRatio);
            $(cv).css('width', hidefCanvasCssWidth);
            $(cv).css('height', hidefCanvasCssHeight);
            ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
        }
        wlwl_shortcode_drawPoint(deg, wlwl_center_color);
        if (center_image) {
            let wl_image = new Image;
            wl_image.onload = function () {
                cv = $container.find('.wc-lucky-wheel-shortcode-wheel-canvas-2')[0];
                ctx = cv.getContext('2d');
                let image_size = 2 * (width / 8 - 7);
                ctx.arc(center, center, image_size / 2, 0, 2 * Math.PI);
                ctx.clip();
                ctx.drawImage(wl_image, center - image_size / 2, center - image_size / 2, image_size, image_size);

            };
            wl_image.src = center_image;
        }

        if (width <= 480) {
            wlwl_shortcode_drawBorder(wlwl_border_color, 'rgba(0,0,0,0)', 8, 3, 4, 'rgba(0,0,0,0.2)');
        } else {
            wlwl_shortcode_drawBorder(wlwl_border_color, 'rgba(0,0,0,0)', 16, 6, 7, 'rgba(0,0,0,0.2)');
        }
        cv = $container.find('.wc-lucky-wheel-shortcode-wheel-canvas-3')[0];
        ctx = cv.getContext('2d');

        cv.width = width;
        cv.height = width;
        if (window.devicePixelRatio) {
            let hidefCanvasWidth = $(cv).attr('width');
            let hidefCanvasHeight = $(cv).attr('height');
            let hidefCanvasCssWidth = hidefCanvasWidth;
            let hidefCanvasCssHeight = hidefCanvasHeight;

            $(cv).attr('width', hidefCanvasWidth * window.devicePixelRatio);
            $(cv).attr('height', hidefCanvasHeight * window.devicePixelRatio);
            $(cv).css('width', hidefCanvasCssWidth);
            $(cv).css('height', hidefCanvasCssHeight);
            ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
        }
        if (width <= 480) {
            wlwl_shortcode_drawBorder('rgba(0,0,0,0)', wlwl_dot_color, 8, 3, 4, 'rgba(0,0,0,0)');
        } else {
            wlwl_shortcode_drawBorder('rgba(0,0,0,0)', wlwl_dot_color, 16, 6, 7, 'rgba(0,0,0,0)');
        }
    })
});
