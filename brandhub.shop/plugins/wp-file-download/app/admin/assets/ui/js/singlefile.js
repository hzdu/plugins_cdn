(function ($) {
    // Thanks to akhoury: https://gist.github.com/akhoury/9118682
    /* a helper to execute an IF statement with any expression
    USAGE:
   -- Yes you NEED to properly escape the string literals, or just alternate single and double quotes
   -- to access any global function or property you should use window.functionName() instead of just functionName()
   -- this example assumes you passed this context to your handlebars template( {name: 'Sam', age: '20' } ), notice age is a string, just for so I can demo parseInt later
   <p>
     {{#xif " name == 'Sam' && age === '12' " }}
       BOOM
     {{else}}
       BAMM
     {{/xif}}
   </p>
   */
    Handlebars.registerHelper("xif", function(param, second, options) {
        if (param === second) {
            return options.fn(this);
        } else {
            return options.inverse(this);
        }
    });
    Handlebars.registerHelper("xxif", function (expression, options) {
        return Handlebars.helpers["x"].apply(this, [expression, options]) ? options.fn(this) : options.inverse(this);
    });

    /* a helper to execute javascript expressions
     USAGE:
     -- Yes you NEED to properly escape the string literals or just alternate single and double quotes
     -- to access any global function or property you should use window.functionName() instead of just functionName(), notice how I had to use window.parseInt() instead of parseInt()
     -- this example assumes you passed this context to your handlebars template( {name: 'Sam', age: '20' } )
     <p>Url: {{x " \"hi\" + name + \", \" + window.location.href + \" <---- this is your href,\" + " your Age is:" + window.parseInt(this.age, 10) "}}</p>
     OUTPUT:
     <p>Url: hi Sam, http://example.com <---- this is your href, your Age is: 20</p>
    */
    Handlebars.registerHelper("x", function(expression, options) {
        var result;

        // you can change the context, or merge it with options.data, options.hash
        var context = this;

        // yup, i use 'with' here to expose the context's properties as block variables
        // you don't need to do {{x 'this.age + 2'}}
        // but you can also do {{x 'age + 2'}}
        // HOWEVER including an UNINITIALIZED var in a expression will return undefined as the result.
        with(context) {
            result = (function() {
                try {
                    return eval(expression);
                } catch (e) {
                    console.warn('•Expression: {{x \'' + expression + '\'}}\n•JS-Error: ', e, '\n•Context: ', context);
                }
            }).call(context); // to make eval's lexical this=context
        }
        return result;
    });
    // Decrypt icon to svg and change it color
    Handlebars.registerHelper("svgicon", function (id, color, size) {
        var icons = [];
        icons['download-icon1'] = '<svg xmlns="http://www.w3.org/2000/svg" width="45" height="45" viewBox="0 0 400 400"><g fill="#9a9999"><path d="M400 200c0 112-89 200-201 200C88 400 0 311 0 199S89 0 201 0c111 0 199 89 199 200zm-179-8l-3-1V89c0-15-7-24-18-23-13 1-18 9-18 22v107l-34-35c-8-8-18-11-27-2-8 8-7 18 2 26l63 63c10 11 18 10 28 0l63-62c8-8 10-17 2-27-7-8-17-7-27 2l-31 32zm-21 113h82c13 0 24-4 32-14 10-14 8-29 6-44-1-4-8-9-12-8-5 0-9 6-12 10-2 3-1 8 0 13 1 13-5 17-18 17H131c-25 0-25 0-26-25-1-3 0-6-2-7-3-4-8-8-12-8s-10 5-11 9c-11 30 8 57 40 57h80z"/></g></svg>';
        icons['download-icon2'] = '<svg xmlns="http://www.w3.org/2000/svg" width="45" height="45" viewBox="0 0 400 400"><g fill="#9a9999"><path d="M45 355h310v-65c1-16 15-27 29-22 9 3 16 11 16 20v91c0 12-10 21-24 21H26c-17 0-26-9-26-26v-85a22 22 0 0143-8 31 31 0 011 11l1 57z"/><path data-name="Path 1270" d="M222 235l5-5 45-45c9-9 23-9 32 0s9 22-1 32l-86 86c-10 10-23 10-34 0l-86-86a22 22 0 1131-31l45 44a55 55 0 013 4l2-1V24c0-13 8-23 20-24 13-1 24 9 24 23v212z"/></g></svg>';
        icons['download-icon3'] = '<svg xmlns="http://www.w3.org/2000/svg" width="45" height="45" viewBox="0 0 400 400"><g fill="#9a9999"><path d="M200 400H26c-18 0-26-9-26-27v-73c0-16 9-25 24-25h105a14 14 0 018 4l28 28c21 21 48 21 69 0l28-29a13 13 0 018-3h106c14 0 24 9 24 23v79c0 14-10 23-25 23H200zm155-63c-9 0-17 8-17 16a15 15 0 0015 16c9 0 17-7 17-16a16 16 0 00-15-16zm-47 16c0-9-7-16-16-16a16 16 0 00-15 16c0 9 6 16 15 16s16-7 16-16zM245 127h55a56 56 0 017 0c7 0 11 4 13 10 3 6 1 11-3 16l-43 45-62 63c-8 9-17 9-25 1L83 154c-5-5-6-11-4-18 3-7 9-9 15-9h61v-9-99c0-14 5-19 17-19h55c13 0 18 5 18 19v99z"/></g></svg>';
        icons['download-icon4'] = '<svg xmlns="http://www.w3.org/2000/svg" width="45" height="45" viewBox="0 0 400 400"><g fill="#9a9999"><path d="M178 234v-7V24c0-13 8-23 20-24 13-1 24 9 24 23v212l5-5 44-44c10-9 23-10 32-1s9 23-1 33l-85 85c-10 11-23 11-34 0l-85-86a22 22 0 0123-37 28 28 0 018 6l44 44a31 31 0 013 5zM200 400H24c-17 0-28-14-23-29 3-10 12-15 23-16h351c12 0 21 6 24 16 5 15-6 29-22 29H200z"/></g></svg>';
        icons['preview-icon1'] = '<svg xmlns="http://www.w3.org/2000/svg" width="45" height="45" viewBox="0 0 400 400"><g fill="#9a9999"><path d="M200 325c-36 0-70-11-101-30a356 356 0 01-92-80c-9-11-9-19 0-29 37-44 79-79 131-99 51-20 102-14 151 12 41 22 76 52 106 89 6 8 7 16 1 23-39 48-85 85-141 105a167 167 0 01-55 9zm0-47c41 0 75-36 75-81s-34-81-75-81c-42 0-75 36-75 81s34 81 75 81z"/><path d="M200 159c21 0 38 17 38 38 0 20-17 37-38 37s-38-17-38-37c0-21 17-38 38-38z"/></g></svg>';
        icons['preview-icon2'] = '<svg xmlns="http://www.w3.org/2000/svg" width="45" height="45" viewBox="0 0 400 400"><g fill="#9a9999"><path d="M0 195c2-10 9-18 16-26 26-28 54-52 89-70a203 203 0 01202 6c33 20 61 46 86 75 3 4 5 10 7 15v10c-2 10-9 18-16 26-24 26-51 50-84 67a206 206 0 01-207-3c-31-18-57-42-81-69-5-6-10-13-12-21zm199 99c30 0 57-8 82-21 33-18 60-43 84-70 2-2 2-4 0-6-21-24-45-47-74-64-27-16-56-26-88-27-28 0-54 6-79 19-35 17-64 43-89 72-2 2-2 4 0 6 21 24 45 47 74 64 27 17 58 27 90 27z"/><path d="M202 276c-45 1-82-32-84-73-2-42 34-77 79-79s83 31 85 74c1 42-34 76-80 78zm-2-30c27-1 49-21 49-46s-22-46-49-45c-27 0-49 20-49 45s22 46 49 46z"/></g></svg>';
        icons['preview-icon3'] = '<svg xmlns="http://www.w3.org/2000/svg" width="45" height="45" viewBox="0 0 400 400"><g fill="#9a9999"><path d="M201 0l12 12 80 76a9 9 0 012 6v98c0 3 1 5 3 6a83 83 0 0133 122l-2 3 61 59-19 18-60-59-15 8-1 3v19H10v-5V4 0zm68 108h-86V25H36v321h176l-2-2a83 83 0 01-33-38c-1-3-3-4-6-4H66v-25h103l5-33H66v-25h121a8 8 0 005-2c19-19 41-29 68-28h9zm-11 225c34 0 62-27 62-59 0-34-28-61-62-61s-62 27-62 59c0 34 27 61 62 61zm-9-250l-40-39v39z"/></g></svg>';
        icons['preview-icon4'] = '<svg xmlns="http://www.w3.org/2000/svg" width="45" height="45" viewBox="0 0 400 400"><g fill="#9a9999"><path d="M0 200V55C0 28 16 8 41 2a63 63 0 0115-2h289c32 0 55 23 55 54v248c0 10-6 16-15 16-8 0-14-6-14-16V56c0-16-11-27-28-27H57c-18 0-28 9-28 28v286c0 19 10 28 28 28h243c11 0 18 6 18 15s-7 14-18 14H56c-28 0-49-16-55-41a67 67 0 01-1-15V200z"/><path d="M314 302l15 15 52 51c7 7 7 14 2 20-6 6-13 5-20-2l-67-65a11 11 0 00-1-1 104 104 0 01-149-26c-29-43-20-99 20-133 39-33 99-31 137 4 38 34 45 93 11 137zm-159-64c-1 42 34 77 77 77 42 1 78-33 78-75 1-42-34-77-75-77-44-1-79 32-80 75z"/></g></svg>';
        try {
            var icon = icons[id] || '';
            var icon = icon.replace(/fill=\"#[a-z0-9]{3,6}\"/, 'fill="' + color + '"');
            var icon = icon.replace(/width=\"[0-9]+\"/, 'width="' + size + '"');
            var icon = icon.replace(/height=\"[0-9]+\"/, 'height="' + size + '"');

            return icon;
        } catch (e) {
            console.log(e);
        }
        return '';
    });
    $(document).ready(function ($) {
        var wpfd_single_file = {
            source: $('.wpfd-single-button-settings'),
            init: function() {
                if( $('#wpfd_singleicon_custom_css').length ) {
                    var editorSettings = wp.codeEditor.defaultSettings ? _.clone( wp.codeEditor.defaultSettings ) : {};
                    editorSettings.codemirror = _.extend(
                      {},
                      editorSettings.codemirror,
                      {
                          indentUnit: 2,
                          tabSize: 2,
                          mode: 'css',
                          theme: 'idea',
                      }
                    );
                    window.singleFileCustomCssEditor = wp.codeEditor.initialize( $('#wpfd_singleicon_custom_css'), editorSettings );
                    window.singleFileCustomCssEditor.codemirror.setSize(null, 150);
                    $(document).on('keyup', '.CodeMirror-code', function(){
                        $('#wpfd_singleicon_custom_css').trigger('change');
                    });
                }
                this.initRangeSlider();
                this.initSwitch();
                this.initColorsSwitch();
                // this.initMiniColors();
                // this.initCollapse();
                this.initGradientSwitcher();
                this.initIcon();
                this.initLivePreview();
                this.initSaveTrigger();
                $(window).on('resize', this.moveCustomCss);
                this.moveCustomCss();
                $(document).on('change', '[name=base_icon_set]', this.baseIconSetChanged);
                $(document).on('click', '.js-singleIconRestore-trigger', {context: this}, this.restoreDefaultSettings);
            },
            restoreDefaultSettings: function(e) {
                if (typeof window.wpfd_ultilities === "undefined") {
                    toastr['error']('Something went wrong!');
                }
                var $context = e.data.context;
                wpfd_ultilities.popup({
                    title: 'Are you sure?',
                    type: 'confirm',
                    content: 'You are about to restore all single file design and setup to default, that is not something reversible, are you sure?',
                    onConfirm: function() {

                        // Send ajax
                        $.ajax({
                            method: "POST",
                            url: wpfdajaxurl + 'task=iconsbuilder.restoresinglefile',
                            beforeSend: function() {
                                $context.offLivePreview();
                            },
                            success: function (data) {
                                if (typeof data === typeof string) {
                                    data = JSON.parse(data);
                                }
                                if (typeof data.datas.params === "undefined") {
                                    toastr["error"](data.datas.message);
                                }

                                toastr["success"](data.datas.message);
                                // Replace override icons
                                Object.keys(data.datas.params).forEach(function(key) {
                                    var input = $('.wpfd-single-button-settings [name='+key+']');
                                    // Colors
                                    if (input.prop('type') === 'text') {
                                        input.val(data.datas.params[key]).trigger('change').trigger('keyup');
                                    }

                                    // Range, Select
                                    if (input.prop('type') === 'range' || input.prop('tagName') === 'SELECT') {
                                        input.val(data.datas.params[key]).trigger('change');
                                    }
                                    // Margin, padding
                                    if (input.prop('type') === 'number' && input.hasClass('ju-input')) {
                                        input.val(data.datas.params[key]).trigger('change');
                                    }
                                    if (input.prop('type') === 'hidden') {
                                        input.val(data.datas.params[key]).trigger('change');
                                        $('.wpfd-single-button-settings [name=ref_'+key+']').prop('checked' , data.datas.params[key]);
                                    }
                                    // Icons
                                    if (key === 'preview_icon') {
                                        $('.wpfd-frame-list li[data-icon-id*="preview-icon"]').removeClass('selected');
                                        $('.wpfd-frame-list li[data-icon-id="'+data.datas.params[key]+'"]').addClass('selected');
                                    }
                                    if (key === 'download_icon') {
                                        $('.wpfd-frame-list li[data-icon-id*="download-icon"]').removeClass('selected');
                                        $('.wpfd-frame-list li[data-icon-id="'+data.datas.params[key]+'"]').addClass('selected');
                                    }
                                    // Position
                                    if (key === 'download_icon_position' || key === 'preview_icon_position') {
                                        $('.wpfd-single-button-settings #'+key+'_'+data.datas.params[key]).click();
                                    }
                                    if (key === 'custom_css' && typeof (window.singleFileCustomCssEditor.codemirror.getDoc) === 'function') {
                                        window.singleFileCustomCssEditor.codemirror.getDoc().setValue(data.datas.params[key])
                                    }
                                });
                            },
                            error: function(data) {
                                if (typeof data === typeof string) {
                                    data = JSON.parse(data);
                                }
                                toastr["error"](data.datas.message);
                            },
                            complete: function() {
                                $context.initLivePreview();
                            }
                        });
                    },
                    onCancel: function() {
                    },
                });

            },
            baseIconSetChanged: function (e) {
                $('#icon_set_heading').html($("#base_icon_set option:selected").text());
            },
            moveCustomCss: function() {
                if (window.innerWidth <= 1366) {
                    $('#wpfd_single_custom_css_wrapper:not(.moved)').insertAfter($('.wpfd-single-button-settings'));
                    $('#wpfd_single_custom_css_wrapper').addClass('moved');
                } else {
                    $('#wpfd_single_custom_css_wrapper.moved').insertAfter($('.wpfd-single-button--preview .wpfd-single-file'));
                    $('#wpfd_single_custom_css_wrapper').removeClass('moved');
                }
            },
            initColorsSwitch: function() {
                $('.wpfd-button-colors .wpfd-color-tab').on('click', function(e) {
                    e.preventDefault;
                    var $this = $(this);
                    if ($this.hasClass('active')) {
                        return;
                    }
                    $this.parent().find('.wpfd-color-tab').each(function(index, content) {
                        if($(this).hasClass('active')) {
                            $(this).removeClass('active');
                        } else {
                            $(this).addClass('active');
                        }
                    });
                    $this.parent().parent().find('.wpfd-color-content').each(function(index, content) {
                        if($(this).hasClass('active')) {
                            $(this).removeClass('active');
                        } else {
                            $(this).addClass('active');
                        }
                    });

                    return false;
                });
            },
            initSwitch: function() {
                $($('.wpfd-single-button--options')).on('change', '.ju-switch-button .switch input[type="checkbox"]', function(e) {
                    var $switch = $(e.target);
                    var ref = $switch.attr('name').replace('ref_', '');
                    $('input[name="' + ref + '"]').val($switch.prop('checked') ? 1 : 0).trigger('wpfd::switch');
                });
                var bindSwitchChange = function (e) {
                    var $switch = $(e.target);
                    var ref = $switch.attr('name').replace('ref_', '');
                    $('input[name="' + ref + '"]').val($switch.prop('checked') ? 1 : 0);
                };
                $($('.wpfd-single-button-settings')).find('.ju-switch-button .switch input[type="checkbox"]').unbind('change', bindSwitchChange).on('change', bindSwitchChange);
            },
            initMiniColors: function() {
                $('.minicolors', $(this.source)).minicolors({
                    position: "bottom right",
                    format: 'hex',
                    change: function(value, opacity) {}
                });
            },
            initRangeSlider: function() {
                $(this.source).on('change', 'input[data-rangeslider-number]', function (e) {
                    var $inputRange = $('[data-rangeslider]', e.target.parentNode);
                    var value = $('input[type="number"]', e.target.parentNode)[0].value;
                    $inputRange.val(value).change();
                });
                $('input[data-rangeslider]', $(this.source)).rangeslider({
                    polyfill: false,
                    onInit: function () {
                        this.output = this.$element.parent().find('input[data-rangeslider-number]').val(this.$element.val());
                    },
                    onSlide: function (position, value) {
                        this.output.val(value);
                    },
                });
            },
            initCollapse: function() {
                var collapseItems = $('.wpfd-collapse', this.source);
                if (collapseItems.length) {
                    collapseItems.each(function (index, item) {
                        $('.wpfd-collapse--icon', item).on('click', function (e) {
                            if ($(item).hasClass('wpfd-card')) {
                                $(e.target).parent().next().slideToggle();
                            } else if ($(item).hasClass('wpfd-options-title')) {
                                $(item).next().slideToggle();
                            }
                            $(this).toggleText('expand_more', 'expand_less');
                        });
                    });
                }
            },
            initGradientSwitcher: function () {
                var switches = $('[data-wpfd-gradient]');
                if (switches.length > 0) {
                    switches.each(function (index, elm) {
                        $(this).unbind('click').on('click', function(e) {
                            var $this = $(this);
                            var $name = $this.prop('name');

                            if ($this.val() === 'gradient') {
                                // Hide gradient color input
                                $('[data-id="'+$name+'_start"], [data-id="'+$name+'_end"]').show();
                                $('[data-id="'+$name+'_solid"]').hide();
                            } else if ($this.val() === 'solid') {
                                // Hide solid color input
                                $('[data-id="'+$name+'_start"], [data-id="'+$name+'_end"]').hide();
                                $('[data-id="'+$name+'_solid"]').show();
                            }
                        });
                    });
                }
                // Init on page load
                $('input[data-wpfd-gradient]:checked').click();
            },
            initIcon: function() {
                $('.wpfd-single-button-settings').on('click', '.wpfd-frame-list li', {'container': this}, this.initIconClick);
                // Trigger click for first load
                $('.wpfd-single-button-settings').find('.wpfd-frame-list li.selected').trigger('click');
            },
            initIconClick: function(e) {
                var $container = e.data.container;
                var $this = $(this);
                e.preventDefault();
                $this.parent().find('li').removeClass('selected');
                $this.addClass('selected');
                $this.parent().next('input[type="hidden"]').val($this.data('icon-id')).trigger('change');
            },
            initLivePreview: function() {
                $(document).on('wpfd::switch', '.wpfd-single-button--options input', {context: this}, this.livePreview);
                $(document).on('change', '.wpfd-single-button-settings input, .wpfd-single-button select, [name=custom_css]', {context: this}, this.livePreview);
                // Load for first page load
                this.livePreview();
            },
            offLivePreview: function() {
                $(document).off('wpfd::switch', '.wpfd-single-button--options input', this.livePreview);
                $(document).off('change', '.wpfd-single-button-settings input, .wpfd-single-button select, [name=custom_css]', this.livePreview);
            },
            initSaveTrigger: function(e) {
                $(document).on('click', '.js-singleIconSave-trigger', {context: this}, this.save);
            },
            getParams: function() {
                var params = {};
                var $options = $('.wpfd-single-button--options input, .wpfd-single-button--options select, .wpfd-single-button--options textarea');
                if ($options.length) {
                    $.each($options, function(index, input) {
                        var inputName = $(input).prop('name');
                        var inputValue = $(input).val();
                        if (inputName !== '' && inputName.indexOf('ref_') === -1) {
                            if ($(input).prop('type') !== 'number' && (inputValue.toString() === '1' || inputValue.toString() === '0')) {
                                params[inputName] = inputValue.toString() === '1' ? true : false;
                            } else {
                                params[inputName] = inputValue;
                            }
                        }
                    });
                }
                var $inputs = $('.wpfd-single-button-settings input, .wpfd-single-button-settings select, .wpfd-single-button-settings textarea');
                if ($inputs.length) {
                    $.each($inputs, function (index, input) {
                        var inputName = $(input).prop('name');
                        var inputType = $(input).prop('type');
                        if (inputType === 'radio' && (typeof $(input).attr('data-wpfd-gradient') !== "undefined" || typeof $(input).attr('data-wpfd-lr') !== "undefined")) {
                            var inputValue = $('[name='+inputName+']:checked').val();
                        } else {
                            var inputValue = $(input).val();
                        }

                        if (inputName !== '' && inputName.indexOf('ref_') === -1) {
                            if ($(input).prop('type') !== 'number' && (inputValue.toString() === '1' || inputValue.toString() === '0')) {
                                params[inputName] = inputValue.toString() == '1' ? true : false;
                            } else {
                                params[inputName] = inputValue;
                            }
                        }
                    });
                }
                if (typeof (window.singleFileCustomCssEditor.codemirror.getDoc) === 'function') {
                    params.custom_css = window.singleFileCustomCssEditor.codemirror.getDoc().getValue();
                }
                return params;
            },
            livePreview: function(e) {
                var $context, params;
                if (typeof e !== "undefined") {
                    e.preventDefault();
                    $context = e.data.context;
                    params = $context.getParams();
                } else {
                    params = this.getParams();
                }

                // Load handlebars templates
                var singleButtonHtml = $('[data-template-name="wpfd-single-file-template"]').html();
                var singleButtonCss = $('[data-template-name="wpfd-single-file-css-template"]').html();
                var singleButtonHtmlTemplate = Handlebars.compile(singleButtonHtml);
                var singleButtonCssTemplate = Handlebars.compile(singleButtonCss);
                // execute the compiled template and print the output to the console
                var html = singleButtonHtmlTemplate(params);
                $('.wpfd-single-file').html(html);
                var css = singleButtonCssTemplate(params);
                $('#wpfd-single-file-css').html(css);
                $('#wpfd-single-file-custom-css').html(params.custom_css);

                return false;
            },
            save: function(e) {
                var $context, params;
                if (typeof e !== "undefined") {
                    e.preventDefault();
                    $context = e.data.context;
                    params = $context.getParams();
                } else {
                    params = this.getParams();
                }
                $.ajax({
                    method: 'POST',
                    url: wpfdajaxurl + 'task=iconsbuilder.saveSingleParams',
                    data: {params: params},
                    success: function(response) {
                        if (typeof toastr !== "undefined") {
                            toastr['success'](response.datas.message);
                        } else {
                            alert(response.datas.message);
                        }
                    },
                    error: function(error) {}
                });
            }
        };

        wpfd_single_file.init();
    });
})(jQuery);