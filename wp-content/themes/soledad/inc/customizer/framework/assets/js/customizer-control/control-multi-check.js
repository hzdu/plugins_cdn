wp.customize.controlConstructor['soledad-fw-multi-check'] = wp.customize.controlConstructor.default.extend({

    ready: function () {
        'use strict';

        jQuery('.customize-control-soledad-fw-multi-check input[type="checkbox"]').on('change', function () {
                var checkbox_values = jQuery(this).parents('.customize-control').find('input[type="checkbox"]:checked').map(
                    function () {
                        return this.value;
                    }
                ).get().join(',');

                jQuery(this).parents('.customize-control').find('input[type="hidden"]').val(checkbox_values).trigger('change');
            }
        );
    }
});
