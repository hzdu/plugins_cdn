(function($) {
    $(function() {
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
                    var count = ('' == val) ? 0 : val.split(',').length;
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
                return el.find('input.checkbox:checked').val();
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
                tinyMCE.triggerSave();
                return el.find('textarea').val();
            },
            'repeater': function(el) {
                var rows = [];
                el.find('> .cfgroup_repeater > .repeater_wrapper').each(function(index) {
                    rows.push(index);
                });
                return rows.join(',');
            }
        };

        CFG.is_draft = false;
        $(document).on('click', '#save-post', function() {
            CFG.is_draft = true;
        });

        $('form#post').submit(function() {

            // skip validation for drafts
            if (false === CFG.is_draft) {
                var passthru = true;

                // handle each validator field
                $.each(CFG.field_rules, function(field_name, obj) {
                    $('.cfgroup_input .field-' + field_name).each(function() {
                        var $this = $(this);

                        // reset error styling
                        $this.find('.error').hide();

                        var type = obj.type;
                        var validator = obj.rule.split('|')[0];

                        // the validator exists
                        if ('object' == typeof CFG.validators[validator]) {

                            // set the DOM attribute
                            $this.attr('data-validator', obj.rule);

                            // figure out the field value
                            if ('function' == typeof CFG.get_field_value[type]) {
                                var val = CFG.get_field_value[type]($this);
                            }
                            else {
                                var val = $this.find('input').val();
                            }

                            // pass the value through the validator
                            var is_valid = CFG.validators[validator]['validate'](val, $this);

                            if (!is_valid) {
                                passthru = false;

                                if ($this.find('.error').length < 1) {
                                    $this.append('<div class="error"></div>');
                                }

                                // if the error is inside a repeater field, open it up
                                if ($this.parents('.cfgroup_repeater_body').length > 0) {
                                    $repeater = $this.parents('.cfgroup_repeater_body');
                                    $repeater.addClass('open');
                                    $repeater.siblings('.cfgroup_repeater_head').addClass('open');
                                }

                                // error can be either a string or function
                                var error_msg = CFG.validators[validator]['error'];
                                if ('function' == typeof error_msg) {
                                    error_msg = error_msg($this);
                                }

                                $this.find('.error').html(error_msg);
                                $this.find('.error').show();

                                $('#cfgroup-validation-admin-notice').show();
                            }
                        }
                    });
                });

                if (!passthru) {
                    $('#publish').removeClass('button-primary-disabled');
                    $('#save-post').removeClass('button-disabled');
                    $('.spinner').hide();
                    return false;
                }
            }
        });
    });
})(jQuery);
