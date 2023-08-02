/* global wc_pyvio_params */
(function ($) {

    const PYVIO = {

        init: function () {

            this.initObj();

            this.initBrowData();

            this.initFormHandler();

            this.initRiskPlugins();
        },

        initObj: function () {

            this.regExp = {
                'visa': /^4/,//以4开头
                'mastercard': /^(5[1-5]|22[2-9][1-9]|2[3-6][0-9]{2}|27[0-1][0-9]|2720)\d*$/,//以51到55开头和2221到2720开头
                'amex': /^3[47]/,//以34和37开头
                'diners': /^36\d+|^54\d+/,//以36和54开头
                'discover': /^(6011|64[4-9]|65|622(12[6-9]|1[3-9]\d|2[0-5]\d))\d*$/,//以6011或644-649或65开头或622126-622925的数字
                'jcb': /^(352[8-9]|35[3-8][0-9]).*$/,//以3528-3589
            };

            this.errors = {
                'invalidCardNumber': 'The card number is incorrect.',
                'invalidCardExpiration': 'The expiration date is invalid.',
                'invalidCardCVV': 'The CVC number is incorrect.',
                'invalidCardExp': 'The card has expired.',
            };
        },

        // 浏览器信息
        initBrowData: function () {

            const terminalType = navigator.platform;

            const language = navigator.language || navigator.userLanguage;

            const screenHeight = window.screen.height;
            const screenWidth = window.screen.width;

            const userAgent = navigator.userAgent;

            const javaEnabled = navigator.javaEnabled();

            const colorDepth = window.screen.colorDepth;

            const timeZoneOffset = new Date().getTimezoneOffset();

            const acceptHeader = navigator.acceptLanguage || navigator.language;

            const formObj = wc_pyvio_params.is_checkout === 'yes' ? '.checkout.woocommerce-checkout' : '#order_review';

            console.log('initBrowserData');

            $.each({
                'terminal_type': terminalType,
                'language': language,
                'screen_height': screenHeight,
                'screen_width': screenWidth,
                'user_agent': userAgent,
                'java_enabled': javaEnabled,
                'color_depth': colorDepth,
                'time_zone_offset': timeZoneOffset,
                'accept_header': acceptHeader
            }, function (key, value) {
                // 创建隐藏输入框
                const input = $('<input>').attr({
                    type: 'hidden',
                    name: key,
                    value: value
                });

                // 将输入框插入到表单中
                $(formObj).append(input);
            });
        },

        delError: function (dom) {
            if ($(dom).hasClass('is-invalid')) {
                $(dom).removeClass('is-invalid');
            }

            if ($('.pyvio-source-error').has('.wc-pyvio-error')) {
                $('.wc-pyvio-error').remove();
            }
        },

        // 表单事件
        initFormHandler: function () {
            const _this = this;
            const $document = $(document);

            $document.on('keyup', '#pyvio_ccNo', function (event) {

                _this.delError('#pyvio_ccNo');

                let cardNo = $(this).val().replace(/\D/g, '');
                if (cardNo.length >= 19) {
                    $(this).val(_this.useInputSpace(cardNo.slice(0, 19)));

                    if (!_this.validateCardNo($(this).val())) {
                        $('#pyvio_ccNo').addClass('is-invalid');
                        _this.pyvioError(_this.errors['invalidCardNumber']);
                    }
                    return;
                }

                const keyPressed = event.key || event.keyCode;

                const cardBrand = _this.validateCardNo($(this).val());

                _this.updateCardBrand(cardBrand);

                if (keyPressed === 'Backspace' || keyPressed === 8 || keyPressed === 'Delete' || keyPressed === 46) {
                    return;
                }

                $(this).val(_this.useInputSpace($(this).val()));

            });

            // 卡号校验
            $document.on('blur', '#pyvio_ccNo', function (event) {
                if (!_this.validateCardNo($(this).val())) {
                    $('#pyvio_ccNo').addClass('is-invalid');
                    _this.pyvioError(_this.errors['invalidCardNumber']);
                }
            });

            // 有效期格式化
            $document.on('keyup', '#pyvio_expdate', function (event) {

                _this.delError('#pyvio_expdate');

                const keyPressed = event.key || event.keyCode;

                if (keyPressed === 'Backspace' || keyPressed === 8 || keyPressed === 'Delete' || keyPressed === 46) {
                    return;
                }

                $(this).val(_this.formatExpiryDate($(this).val()))
            });

            // 有效期校验
            $document.on('blur', '#pyvio_expdate', function (event) {
                const expiration = $(this).val();

                if (!_this.validateExpiration(expiration)) {
                    $('#pyvio_expdate').addClass('is-invalid');
                    _this.pyvioError(_this.errors['invalidCardExpiration']);
                }
            });

            // cvv格式化
            $document.on('keyup', '#pyvio_cvv', function (event) {

                _this.delError('#pyvio_cvv');

                let cvv = $(this).val().replace(/\D/g, '');
                if (cvv.length > 4) {
                    cvv = cvv.slice(0, 4);
                }
                $(this).val(cvv);
            });

            // cvv校验
            $document.on('blur', '#pyvio_cvv', function (event) {
                const ccNumber = $(this).val().replace(/\D/g, '');
                if (!_this.validateCVV(ccNumber)) {
                    $('#pyvio_cvv').addClass('is-invalid');
                    _this.pyvioError(_this.errors['invalidCardCVV']);
                }
            });

            // 表单校验
            $document.on('click', '#place_order', function () {
                return _this.checkForm();
            })
        },

        initRiskPlugins: function () {
            //初始化参数
            let options = {
                env: wc_pyvio_params.env, // 沙箱-sandbox 生产-prod
                websiteId: wc_pyvio_params.website_id,
                requestSource: wc_pyvio_params.request_source
            };

            const myRiskPlugin = new window.PyvioRiskPlugin(options);
            myRiskPlugin.pyvioRiskInit(options, this.riskCallback);
        },

        riskCallback: function (jsGeneratedData) {
            const formObj = wc_pyvio_params.is_checkout === 'yes' ? '.checkout.woocommerce-checkout' : '#order_review';
            console.log('riskCallback')
            $.each(jsGeneratedData, function (key, value) {
                const input = $('<input>').attr({
                    type: 'hidden',
                    name: key,
                    value: value
                });

                // 将隐藏输入框插入到表单中
                $(formObj).append(input);
            });

        },

        // 格式化时间  2/ 2|4
        formatExpiryDate: function (value) {
            if (!value) return ''
            value = value.toString()

            const pattern = /^(0[1-9]|1[0-2])\/(2[2-9]|[3-9]\d)$/ // 正则表达式，匹配MM/YY格式
            if (!pattern.test(value)) {
                // 如果不符合格式
                value = value.replace(/[^\d]/g, '') // 将非数字字符替换为空字符串
                if (value.slice(0, 1) > 1) {
                    value = '0' + value
                }
                value = value.replace(/^(..)(.*)$/, '$1/$2')

                const month = value.substring(0, 2) // 获取输入的月份
                if (month > 12) {
                    // 如果月份大于12
                    value = value.replace(month, '12') // 将月份替换为12
                }

                const date = value.split('/');
                if (date.length > 1 && date[1].length > 4) {
                    value = value.replace(date[1], date[1].slice(0, 4)) // 将年份替换4位
                }
            }
            return value
        },

        // 卡号新增空格
        useInputSpace(value) {
            if (!value) return

            // 判断输入的内容是否为数字
            if (!/^\d*$/.test(value)) {
                // 如果输入的内容不是数字，移除非数字字符
                value = value.replace(/\D/g, '');
            }

            if (/\S{5}/.test(value)) {
                return value.replace(/\s/g, '').replace(/(\d{4})(?=\d)/g, '$1 ')
            }

            return value
        },

        // 更新卡品牌logo
        updateCardBrand: function (brand) {
            const brandClass = {
                'visa': 'pyvio-visa-brand',
                'mastercard': 'pyvio-mastercard-brand',
                'amex': 'pyvio-amex-brand',
                'discover': 'pyvio-discover-brand',
                'diners': 'pyvio-diners-brand',
                'jcb': 'pyvio-jcb-brand',
                'unknown': 'pyvio-credit-card-brand'
            };

            let imageElement = $('.pyvio-card-brand'),
                imageClass = 'pyvio-credit-card-brand';

            if (brand in brandClass) {
                imageClass = brandClass[brand];
            }

            // Remove existing card brand class.
            $.each(brandClass, function (index, el) {
                imageElement.removeClass(el);
            });

            imageElement.addClass(imageClass);
        },

        // 表单提交
        checkForm: function () {

            if (!this.validateCardNo($('#pyvio_ccNo').val())) {
                $('#pyvio_ccNo').addClass('is-invalid');
                this.pyvioError(this.errors['invalidCardNumber']);
                return false;
            }

            if (!this.validateExpiration($('#pyvio_expdate').val())) {
                $('#pyvio_expdate').addClass('is-invalid');
                this.pyvioError(this.errors['invalidCardExpiration']);
                return false;
            }

            if (!this.validateCVV($('#pyvio_cvv').val())) {
                $('#pyvio_cvv').addClass('is-invalid');
                this.pyvioError(this.errors['invalidCardCVV']);
                return false;
            }

            return true;
        },

        // 错误
        pyvioError: function (errorMessage) {
            let errorContainer;

            const $pyvioError = $('#wc-pyvio-cc-form .pyvio-source-errors');

            if ($pyvioError.length > 0) {
                errorContainer = $pyvioError;
            } else {
                errorContainer = $('div.woocommerce-notices-wrapper').first();
            }

            $(errorContainer).html('<ul class="woocommerce_error woocommerce-error wc-pyvio-error"><li /></ul>');
            $(errorContainer).find('li').text(errorMessage);
            $('html, body').animate({
                scrollTop: ($('.wc-pyvio-error').offset().top - 200)
            }, 200);

            return false;
        },

        // 校验卡规则
        validateCardNo: function (number) {
            number = number.replace(/\D/g, '');

            for (const card in this.regExp) {
                if (this.regExp[card].test(number)) {
                    return card;
                }
            }

            // 使用indexOf方法检查元素是否存在于数组中
            return wc_pyvio_params.blackCardNumber.indexOf(number) !== -1;
        },

        // 校验有效期
        validateExpiration: function (expiration) {
            const [givenMonth, givenYear] = expiration.split('/').map(item => parseInt(item, 10));

            if (isNaN(givenMonth) || isNaN(givenYear)) {
                return false;
            }

            // 获取当前日期
            const currentDate = new Date();

            // 获取当前年份和月份
            const currentYear = currentDate.getFullYear();
            const currentMonth = currentDate.getMonth(); // 当月和上个月都允许

            // Convert two-digit year to four-digit year if necessary
            const fullYear = givenYear < 100 ? currentYear - (currentYear % 100) + givenYear : givenYear;

            // 比较年份和月份
            return !(fullYear < currentYear || (fullYear === currentYear && givenMonth < currentMonth));
        },

        // cvv  0-9 string  ,length  3 | 4
        validateCVV: function (cvv) {
            return cvv.length === 3 || cvv.length === 4
        },

    }

    PYVIO.init();

})(jQuery);
