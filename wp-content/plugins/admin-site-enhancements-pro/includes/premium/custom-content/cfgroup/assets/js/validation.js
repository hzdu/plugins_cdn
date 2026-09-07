(function($) {
    $(function() {
        window.CFG = window.CFG || {};
        var CFG = window.CFG;

        CFG.validators = {
            'required': {
                'error': 'Please enter or choose something',
                'validate': function(val) {
                    return ('' != val && null != val);
                }
            },
            'valid_date': {
                'error': 'Please enter a valid date (YYYY-MM-DD HH:MM)',
                'validate': function(val) {
                    var regex = /^\d{4}-\d{2}-\d{2}/;
                    return regex.test(val);
                }
            },
            'valid_color': {
                'error': 'Please enter a valid color HEX (#ff0000)',
                'validate': function(val) {
                    var regex = /^#[0-9a-zA-Z]{3,}$/;
                    return regex.test(val);
                }
            },
            'limit': {
                'error': function(el) {
                    var limits = el.attr('data-validator').split('|')[1].split(',');
                    if (limits[0] == limits[1]) {
                        return 'Please select ' + limits[0] + ' item(s)';
                    }
                    else {
                        return 'Please select between ' + limits[0] + ' and ' + limits[1] + ' items';
                    }
                },
                'validate': function(val, el) {
                    var count;
                    if ($.isArray(val)) {
                        count = val.length;
                    } else {
                        count = ('' == val) ? 0 : String(val).split(',').length;
                    }
                    var limits = el.attr('data-validator').split('|')[1].split(',');
                    var min = parseInt(limits[0]);
                    var max = parseInt(limits[1]);
                    if (0 < min && count < min) {
                        return false;
                    }
                    if (0 < max && max < count) {
                        return false;
                    }
                    return true;
                }
            },
            'valid_number': {
                'error': function(el) {
                    var parts = el.attr('data-validator').split('|')[1].split(',');
                    var min = parts[0];
                    var max = parts[1];
                    var required = parts[2] === '1';
                    var val = el.find('input').val();

                    if (('' == val || null == val) && required) {
                        return 'Please enter or choose something';
                    }

                    if ('' !== min && '' !== max) {
                        return 'Please enter a number between ' + min + ' and ' + max;
                    }
                    if ('' !== min) {
                        return 'Please enter a number of at least ' + min;
                    }
                    if ('' !== max) {
                        return 'Please enter a number of at most ' + max;
                    }

                    return 'Please enter or choose something';
                },
                'validate': function(val, el) {
                    var parts = el.attr('data-validator').split('|')[1].split(',');
                    var min = '' !== parts[0] ? parseFloat(parts[0]) : null;
                    var max = '' !== parts[1] ? parseFloat(parts[1]) : null;
                    var required = parts[2] === '1';

                    if ('' == val || null == val) {
                        return !required;
                    }

                    var num = parseFloat(val);
                    if (isNaN(num)) {
                        return false;
                    }
                    if (null !== min && num < min) {
                        return false;
                    }
                    if (null !== max && num > max) {
                        return false;
                    }

                    return true;
                }
            },
            'valid_file': {
                'error': function(el) {
                    var $wrapper = el.find('.cfgroup_file_input');
                    var extensions = [];

                    try {
                        extensions = JSON.parse($wrapper.attr('data-allowed-extensions') || '[]');
                    } catch (e) {
                        extensions = [];
                    }

                    var extList = $.map(extensions, function(ext) {
                        return '.' + ext;
                    }).join(', ');

                    if (!extList.length) {
                        if (typeof cfgroupValidationI18n !== 'undefined' && cfgroupValidationI18n.invalid_file_none) {
                            return cfgroupValidationI18n.invalid_file_none;
                        }
                        return 'This file type is not allowed.';
                    }

                    if (typeof cfgroupValidationI18n !== 'undefined' && cfgroupValidationI18n.invalid_file_extension) {
                        return cfgroupValidationI18n.invalid_file_extension.replace('%s', extList);
                    }

                    return 'This file type is not allowed. Allowed extensions: ' + extList;
                },
                'validate': function(val, el) {
                    var parts = el.attr('data-validator').split('|');
                    var required = parts[1] === '1';

                    if ('' == val || null == val) {
                        return !required;
                    }

                    var $wrapper = el.find('.cfgroup_file_input');
                    var mode = $wrapper.attr('data-allowed-mime-mode') || 'all';
                    var allowedMimes = [];

                    try {
                        allowedMimes = JSON.parse($wrapper.attr('data-allowed-mimes') || '[]');
                    } catch (e) {
                        allowedMimes = [];
                    }

                    if ('selected' === mode && !allowedMimes.length) {
                        return false;
                    }

                    if (!allowedMimes.length) {
                        return false;
                    }

                    var selectedMime = $wrapper.attr('data-selected-mime') || '';

                    if (!selectedMime) {
                        return false;
                    }

                    return -1 !== allowedMimes.indexOf(selectedMime);
                }
            }
        };

        // Get the value for non-standard field types
        CFG.get_field_value = {
            'textarea': function(el) {
                return el.find('textarea').val();
            },
            'select': function(el) {
                return el.find('select').val();
            },
            'radio': function(el) {
                return el.find('input.radio:checked').val();
            },
            'checkbox': function(el) {
                var vals = [];
                el.find('input.checkbox:checked').each(function() {
                    vals.push($(this).val());
                });
                return vals;
            },
            'relationship': function(el) {
                return el.find('input.relationship').val();
            },
            'file': function(el) {
                return el.find('input.file_value').val();
            },
            'term': function(el) {
                return el.find('input.term').val();
            },
            'user': function(el) {
                return el.find('input.user').val();
            },
            'wysiwyg': function(el) {
                var $ta = el.find('textarea.wp-editor-area, textarea.wysiwyg').first();
                if (!$ta.length) {
                    $ta = el.find('textarea').first();
                }
                var tid = $ta.attr('id');
                if (typeof window.tinyMCE !== 'undefined' && window.tinyMCE.get && tid) {
                    var ed = window.tinyMCE.get(tid);
                    if (ed) {
                        ed.save();
                    } else if (window.tinyMCE.triggerSave) {
                        window.tinyMCE.triggerSave();
                    }
                }
                return $ta.val();
            },
            'repeater': function(el) {
                var rows = [];
                el.find('> .cfgroup_repeater > .repeater_wrapper').each(function(index) {
                    rows.push(index);
                });
                return rows.join(',');
            }
        };

        CFG.clearValidationState = function() {
            $('.cfgroup_input .field').removeClass('cfgroup-validation-error');
            $('.cfgroup_input .field .error').hide();
            $('#cfgroup-validation-admin-notice').hide();
        };

        CFG.activateTabForField = function($field) {
            var $tabContent = $field.closest('.cfgroup-tab-content');
            if (!$tabContent.length || $tabContent.hasClass('active') || $tabContent.hasClass('cfgroup-cl-hidden')) {
                return;
            }
            var tabFieldId = $tabContent.data('field-id');
            var $tab = $tabContent.closest('.cfgroup_input')
                .find('.cfgroup-tab[data-field-id="' + tabFieldId + '"]:not(.cfgroup-cl-hidden)')
                .first();
            if ($tab.length) {
                $tab.trigger('click');
            }
        };

        CFG.scrollToFirstValidationError = function() {
            var $field = $('.cfgroup_input .field.cfgroup-validation-error').first();
            if (!$field.length) {
                return;
            }

            CFG.activateTabForField($field);

            if ($field.parents('.cfgroup_repeater_body').length > 0) {
                var $repeater = $field.parents('.cfgroup_repeater_body');
                $repeater.addClass('open');
                $repeater.siblings('.cfgroup_repeater_head').addClass('open');
            }

            var scrollTarget = $field.closest('.cfgroup-field-wrap, .field')[0];
            var doScroll = function() {
                if (scrollTarget && scrollTarget.scrollIntoView) {
                    scrollTarget.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            };

            if (window.requestAnimationFrame) {
                window.requestAnimationFrame(doScroll);
            } else {
                setTimeout(doScroll, 0);
            }
        };

        CFG.runValidation = function(options) {
            options = options || {};
            var silent = !!options.silent;

            if (!CFG.field_rules || 'object' !== typeof CFG.field_rules) {
                return true;
            }

            if (!silent) {
                CFG.clearValidationState();
            }

            var passthru = true;

            $.each(CFG.field_rules, function(field_name, obj) {
                $('.cfgroup_input .field-' + field_name).each(function() {
                    var $this = $(this);

                    var $wrap = $this.closest('.cfgroup-field-wrap, .cfgroup-repeater-sub-wrap');
                    if ($wrap.length && $wrap.hasClass('cfgroup-cl-hidden')) {
                        return;
                    }

                    var type = obj.type;
                    var validator = obj.rule.split('|')[0];

                    if ('object' == typeof CFG.validators[validator]) {

                        $this.attr('data-validator', obj.rule);

                        if ('function' == typeof CFG.get_field_value[type]) {
                            var val = CFG.get_field_value[type]($this);
                        }
                        else {
                            var val = $this.find('input').val();
                        }

                        var is_valid = CFG.validators[validator]['validate'](val, $this);

                        if (!is_valid) {
                            passthru = false;

                            if (!silent) {
                                $this.addClass('cfgroup-validation-error');

                                if ($this.find('.error').length < 1) {
                                    $this.append('<div class="error"></div>');
                                }

                                if ($this.parents('.cfgroup_repeater_body').length > 0) {
                                    var $repeater = $this.parents('.cfgroup_repeater_body');
                                    $repeater.addClass('open');
                                    $repeater.siblings('.cfgroup_repeater_head').addClass('open');
                                }

                                var error_msg = CFG.validators[validator]['error'];
                                if ('function' == typeof error_msg) {
                                    error_msg = error_msg($this);
                                }

                                $this.find('.error').html(error_msg);
                                $this.find('.error').show();

                                $('#cfgroup-validation-admin-notice').show();
                            }
                        }
                    }
                });
            });

            return passthru;
        };

        CFG.is_draft = false;
        $(document).on('click', '#save-post', function() {
            CFG.is_draft = true;
        });

        $('form#post').submit(function() {

            // skip validation for drafts
            if (false === CFG.is_draft) {
                if (!CFG.runValidation()) {
                    CFG.scrollToFirstValidationError();
                    $('#publish').removeClass('button-primary-disabled');
                    $('#save-post').removeClass('button-disabled');
                    $('.spinner').hide();
                    return false;
                }
            }
        });
    });
})(jQuery);
