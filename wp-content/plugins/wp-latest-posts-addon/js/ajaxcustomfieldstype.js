/*
+ * To change this license header, choose License Headers in Project Properties.
+ * To change this template file, choose Tools | Templates
+ * and open the template in the editor.
+ */
jQuery(function ($) {
    $(document).ready(function () {
        $('body').on('change', ".custom_field_select", function () {
            var source_type = $(this).data('type');
            changeFieldGroup($(this), source_type);
        });

        function changeFieldGroup(sourceObj, source_type) {
            var data = {
                'action': 'getFieldsCustomAdvanced',
                'source_type': source_type,
                'fieldType': $(sourceObj).val()
            };

            $.post(ajaxurl, data, function (response) {
                $parent = $(sourceObj).parents(".group_field");
                $("#taxonomySelector" + source_type).remove();
                $parent.after(response);
                //$('select').material_select();
            });
        }

        $(".display_custom_field_title").change(function () {
                var setVal = $(this).val();
                $(".display_custom_field_title").val(setVal);
            }
        );

        x = $('#custom_field_select').val();
        y = $('#custom_field_select_page').val();
        z = $('#custom_field_select_custompost').val();
        if (x === 'default') {
            $("#taxonomySelector").remove();
        }
        if (y === 'default') {
            $("#taxonomySelectorPage").remove();
        }
        if (z === 'default') {
            $("#taxonomySelectorCustompost").remove();
        }
    });
});
