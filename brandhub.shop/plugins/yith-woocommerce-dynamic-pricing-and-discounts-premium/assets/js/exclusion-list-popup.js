/**
 * Global ywdpd_exclusion_list
 *
 * @package YITH\Dynamic\Assets\JS
 */

jQuery(
    function ($) {
        "use strict";
        $('input, textarea, select, checkbox').on('change', function () {
            window.onbeforeunload = '';
        });

        var updatePopupField = function () {
                $(document).on(
                    'change',
                    '#ywdpd-exclusion-type',
                    function () {
                        var $t = $(this),
                            fieldSelected = $t.val();
                        $('.ywdpd-exclusion-field').hide();
                        $('[dep-value="' + fieldSelected + '"').show();
                    }
                );

                $('#ywdpd-exclusion-type').change();
            };

        $(document).on(
            'click',
            '.ywdpd-add-exclusions a',
            function (e) {
                e.preventDefault();
               var modal = yith.ui.modal(
                    {
                        title: ywdpd_exclusion_list.popup_add_title,
                        content: ywdpd_exclusion_list.content,
                        closeWhenClickingOnOverlay: true,
                        footer: false,
                        width: 500,
                    }
                );
                $(document.body).trigger('wc-enhanced-select-init');
                $(document).trigger('yith_fields_init');
                updatePopupField();
                $('.yith-save-form').on('click', function (e) {
                    e.preventDefault();
                    window.onbeforeunload = null;
					$(document).find('.yith-exclusion-list__popup_wrapper form').submit();
                });
            }
        );

    }
);
