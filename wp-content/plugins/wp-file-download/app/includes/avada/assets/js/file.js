jQuery(document).ready(function ($) {

    if ( !$('.fusion-builder-live').length && $('.wpfd-avada-single-file > link').length ) {
        $('.wpfd-avada-single-file > link').remove();
    }
    if ( $('.fusion-builder-live').length ) {
        if (jQuery('select[name="extension"]').length) {
            jQuery('select[name="extension"]').chosen({width: '100%', search_contains: true});
        } else {
            setTimeout(function() {
                if (jQuery('select[name="extension"]').length) {
                    jQuery('select[name="extension"]').chosen({width: '100%', search_contains: true});
                }
            }, 1000)
        }

        setInterval(function() {
            if ($(".wpfd-adminForm").length) {
                if ($('select[name="extension"]').length) {
                    if ($('.et_divi_theme.et-fb').length) {
                        $('select[name="extension"]').chosen({width: '100%', search_contains: true});
                    } else {
                        $('select[name="extension"]').empty();
                        var newOption = $('<option value="1">test</option>');
                        $('select[name="extension"]').append(newOption);
                        $('select[name="extension"]').trigger("chosen:updated");
                    }
                } else {
                    setTimeout(function() {
                        if ($('select[name="extension"]').length) {
                            if ($('.et_divi_theme.et-fb').length) {
                                $('select[name="extension"]').chosen({width: '100%', search_contains: true});
                            } else {
                                $('select[name="extension"]').empty();
                                var newOption = $('<option value="1">test</option>');
                                $('select[name="extension"]').append(newOption);
                                $('select[name="extension"]').trigger("chosen:updated");
                            }
                        }
                    }, 3000);
                }

                if ($(".input_tags").length) {
                    if ($(".tags-filtering .tagit-new input").length) {
                        $(".tags-filtering .tagit-new input").attr("placeholder", msg_search_box_placeholder);    
                    } else {
                        if ($('.fusion-builder-live').length) {
                            $('.wpfd-tags .tags-filtering .input_tags').remove();
                            var inputField = $('<input>').attr({'type': 'text', 'name': 'ftags'}).addClass('tagit input_tags');
                            $('.wpfd-tags .tags-filtering').append(inputField);
                            inputField.tagit({allowSpaces: true});
                        } else {
                            setTimeout(function() {
                                jQuery(".tagit.input_tags").tagit({allowSpaces: true});
                                if ($(".tags-filtering .tagit-new input").length) {
                                    $(".tags-filtering .tagit-new input").attr("placeholder", msg_search_box_placeholder);
                                }
                            }, 3000);
                        }

                    }
                }
            }
        }, 1000);
    }
});