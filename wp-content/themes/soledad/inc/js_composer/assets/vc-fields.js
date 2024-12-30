(function ($) {
    var $panel = $('#vc_ui-panel-edit-element');
    $panel.on('vcPanel.shown', function () {

        if (typeof tinyMCE !== 'undefined') {
            if (tinyMCE.get('wpb_tinymce_content')) {
                var _formated_content = tinyMCE.get('wpb_tinymce_content').getContent();
                _formated_content = _formated_content.replace(/<\/p><p>\s<\/p>/g, '</p>');
            }
            tinyMCE.EditorManager.execCommand('mceRemoveEditor', true, 'wpb_tinymce_content');
        }

        var $wrapperPanel = $(this);

        $(document).ajaxComplete(function (event, request, settings) {
            $wrapperPanel.find('.post-types-list').each(function () {
                var $exlcude = ['e-landing-page', 'elementor_library', 'penci-block', 'web-story', 'product'],
                    $checkboxs = $(this).find('input');
                $checkboxs.each(function () {
                    if (jQuery.inArray($(this).val(), $exlcude) !== -1) {
                        $(this).closest('label').hide();
                    }
                });
            });
        });


        $('.penci-param-heading-wrapper').each(function () {
            var $divider = $(this);
            var $fields = $divider.nextUntil('.penci-param-heading-wrapper, .vc_shortcode-param.penci-vc-no-wrap');
            var $wrapper = $('<div class="penci-td-wrapper"></div>');
            var $content = $('<div class="penci-td-content"></div>');

            $divider.before($wrapper);
            $wrapper.append($divider);

            if ($fields.length) {
                $content.append($fields);
                $wrapper.append($content);
            }
        });

        $('.vc_edit-form-tab').each(function () {
            if (!$(this).find('.penci-param-heading-wrapper').length) {
                $(this).wrapInner("<div class='penci-td-wrapper no-head'></div>");
            }
        });

        $('.penci-vc-switch').each(function () {
            var $this = $(this);
            var currentValue = $this.find('.switch-field-value').val();

            $this.find('[data-value="' + currentValue + '"]').addClass('pc-active');
        });

        $('.switch-controls').on('click', function () {
            var $this = $(this);
            var value = $this.data('value');

            $this.addClass('pc-active');
            $this.siblings().removeClass('pc-active');
            $this.parents('.penci-vc-switch').find('.switch-field-value').val(value).trigger('change');
        });

        // slider
        $('.penci-vc-slider').each(function () {
            var $this = $(this);
            var $value = $this.find('.pc-slider-field-value');
            var $slider = $this.find('.pc-slider-field');
            var $text = $this.find('.pc-slider-value-preview');
            var sliderData = $value.data();
            var mainInputVal = $value.val();

            if (mainInputVal && isBase64(mainInputVal) && sliderData.css_args) {
                var parseVal = JSON.parse(window.atob(mainInputVal));
                mainInputVal = parseVal.data[sliderData.css_params.device];
            }

            $slider.slider({
                range: 'min',
                value: mainInputVal,
                min: sliderData.min,
                max: sliderData.max,
                step: sliderData.step,
                slide: function (event, ui) {
                    setMainSliderValue($this, ui.value);
                    $text.text(ui.value);
                }
            });

            $text.text($slider.slider('value'));
            setMainSliderValue($this, mainInputVal);
        });

        function setMainSliderValue($this, value) {
            var $mainInput = $this.find('.pc-slider-field-value');

            var results = {
                param_type: 'penci_slider',
                css_args: $mainInput.data('css_args'),
                css_params: $mainInput.data('css_params'),
                selector_id: $('.penci-css-id').val(),
                data: {}
            };

            results.data[$mainInput.data('css_params').device] = value;

            results = window.btoa(JSON.stringify(results));

            if (0 === parseInt(value)) {
                results = '';
            }

            if (!$mainInput.data('css_args')) {
                results = value;
            }

            $mainInput.val(results).trigger('change');
        }

        function isBase64(str) {
            try {
                return btoa(atob(str)) === str;
            } catch (err) {
                return false;
            }
        }

        // responsive sizes
        //Transfer old options
        transferCustomSizeOptions({
            oldSizes: {
                desktop: $('.desktop_text_size'),
                tablet: $('.tablet_text_size'),
                mobile: $('.mobile_text_size'),
            },
            newOptSelector: $('.title_font_size'),
        });

        transferCustomSizeOptions({
            oldSizes: {
                desktop: $('.desktop_text_size'),
                tablet: $('.tablet_text_size'),
                mobile: $('.mobile_text_size'),
            },
            newOptSelector: $('.text_font_size'),
        });

        transferCustomSizeOptions({
            oldSizes: {
                desktop: $('.title_desktop_text_size'),
                tablet: $('.title_tablet_text_size'),
                mobile: $('.title_mobile_text_size'),
            },
            newOptSelector: $('.custom_title_size'),
        });

        transferCustomSizeOptions({
            oldSizes: {
                desktop: $('.subtitle_desktop_text_size'),
                tablet: $('.subtitle_tablet_text_size'),
                mobile: $('.subtitle_mobile_text_size'),
            },
            newOptSelector: $('.custom_subtitle_size'),
        });

        function transferCustomSizeOptions(args) {
            if (args.newOptSelector.length == 0) return;

            $.each(args.oldSizes, function (key, value) {
                if (!value.val()) return;
                args.newOptSelector.find('input[data-id="' + key + '"]').val(value.val());
                args.newOptSelector.find('.penci-rs-item').removeClass('hide');
                args.newOptSelector.find('.penci-rs-value').val('');
                value.val('');
            });
        }

        //Size options
        $('.penci-rs-wrapper').each(function () {
            var $this = $(this);
            setInputsValue($this);
            setMainValue($this);
        });

        $('.penci-rs-input').on('change', function () {
            var $wrapper = $(this).parents('.penci-rs-wrapper');
            setMainValue($wrapper);
        });

        function setMainValue($this) {
            var $mainInput = $this.find('.penci-rs-value');
            var results = {
                param_type: 'penci_responsive_sizes',
                css_args: $mainInput.data('css_args'),
                selector_id: $('.penci-css-id').val(),
                data: {}
            };

            $this.find('.penci-rs-input').each(function (index, elm) {
                var value = $(elm).val();
                var responsive = $(elm).data('id');
                if (value) {
                    results.data[responsive] = value + 'px';
                }
            });

            if ($.isEmptyObject(results.data)) {
                results = '';
            } else {
                results = window.btoa(JSON.stringify(results));
            }

            $mainInput.val(results).trigger('change');
        }

        function setInputsValue($this) {
            var $mainInput = $this.find('.penci-rs-value');
            var mainInputVal = $mainInput.val();
            var toggle = {};

            if (mainInputVal) {
                var parseVal = JSON.parse(window.atob(mainInputVal));

                $.each(parseVal.data, function (key, value) {
                    $this.find('.penci-rs-input').each(function (index, element) {
                        var dataid = $(element).data('id');

                        if (dataid == key) {
                            $(element).val(value.replace('px', ''));
                            //Toggle
                            toggle[dataid] = value;
                        }
                    });
                });
            }

            //Toggle
            function size(obj) {
                var size = 0, key;
                for (key in obj) {
                    if (obj.hasOwnProperty(key)) size++;
                }
                return size;
            };

            var size = size(toggle);

            if (size >= 2) {
                $this.find('.penci-rs-item').removeClass('hide');
            }
        }

        // responsive spacing
        $('.vc_wrapper-param-type-css_editor .vc_layout-onion').addClass('pc-active');
        $('.pc-spacing-devices > span').on('click', function () {
            var $this = $(this);
            var device = $this.data('value');

            $this.siblings().removeClass('pc-active');
            $this.addClass('pc-active');
            if ('desktop' === device) {
                $wrapperPanel.find('.vc_layout-onion').removeClass('pc-active');
                $wrapperPanel.find('.vc_wrapper-param-type-css_editor .vc_layout-onion').addClass('pc-active');
            } else {
                $wrapperPanel.find('.vc_layout-onion').removeClass('pc-active');
                $wrapperPanel.find('.vc_layout-onion[data-device="' + device + '"]').addClass('pc-active');
            }
        });

        $('.pc-responsive-spacing-wrapper').each(function () {
            var $this = $(this);
            setResSpacingInputsValue($this);
            setResSpacingMainValue($this);
        });

        $('.pc-responsive-spacing input').on('change', function () {
            var $wrapper = $(this).parents('.pc-responsive-spacing-wrapper');
            setResSpacingMainValue($wrapper);
        });

        function setResSpacingMainValue($this) {
            var $mainInput = $this.find('.pc-responsive-spacing-value');
            var results = {
                param_type: 'penci_responsive_spacing',
                selector_id: $('.penci-css-id').val(),
                shortcode: $panel.attr('data-vc-shortcode'),
                data: {}
            };

            $this.find('.pc-responsive-spacing').each(function () {
                var $this = $(this);
                var device = $this.data('device');

                results.data[device] = {};

                $this.find('input').each(function (index, elm) {
                    var $elm = $(elm);
                    var value = $elm.val();
                    var name = $elm.data('name');

                    if (value) {
                        Object.assign(results.data[device], {
                            [name]: value
                        });
                    }
                });
            });

            if ($.isEmptyObject(results.data)) {
                results = '';
            } else {
                results = window.btoa(JSON.stringify(results));
            }

            $mainInput.val(results).trigger('change');
        }

        function setResSpacingInputsValue($this) {
            var $mainInput = $this.find('.pc-responsive-spacing-value');
            var mainInputVal = $mainInput.val();

            if (mainInputVal) {
                var parseVal = JSON.parse(window.atob(mainInputVal));

                $.each(parseVal.data, function (key, value) {
                    var device = key;
                    if (value) {
                        $.each(value, function (key, value) {
                            if (!value.includes('px') && !value.includes('%') && !value.includes('vh') && !value.includes('vw')) {
                                value += 'px';
                            }

                            $this.find('[data-device="' + device + '"]').find('[data-name="' + key + '"]').val(value);
                        });
                    }
                });
            }
        }

        if (typeof tinyMCE !== 'undefined') {
            tinyMCE.EditorManager.execCommand('mceAddEditor', true, 'wpb_tinymce_content');
            if (typeof _formated_content !== typeof undefined) {
                tinyMCE.get('wpb_tinymce_content').setContent(_formated_content);
            }
        }
    });
})(jQuery);
