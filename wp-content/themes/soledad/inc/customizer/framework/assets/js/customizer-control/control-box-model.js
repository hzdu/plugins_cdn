(function ($, api) {
    "use strict";

    api.controlConstructor['soledad-fw-box-model'] = api.controlConstructor.default.extend({
        ready: function () {
            'use strict';

            $(document).on('keyup', '.box-model-field', function () {
                var $parent = $(this).parents('.box-model-wrapper'),
                    $save_field = $parent.find('.box-model-saved'),
                    $input_fields = $parent.find('.box-model-field'),
                    saved_string = '';

                $input_fields.each(function () {
                    var $field = $(this);
                    var field_value = $.isNumeric($field.val()) ? parseInt($field.val(), 10) : '-';
                    if ($.isNumeric(field_value) || '-' === field_value) {
                        saved_string += field_value + ', ';
                    }
                });

                $save_field.val(saved_string.replace(/,\s*$/, "")).trigger('change');
            });

        }
    });
})(jQuery, wp.customize);
