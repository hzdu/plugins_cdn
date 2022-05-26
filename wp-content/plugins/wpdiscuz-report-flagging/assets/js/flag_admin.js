jQuery(document).ready(function ($) {
    $(document).on('click', '#add_field', function () {
        $(this).before('<span style="display:flex; margin-bottom: 10px;"><input type="text" name="' + wpdiscuzFcObj.tabKey + '[optionType][]" value="" style="margin:1px;padding:3px 5px; width:90%;" /><input type="button" class="report_remove" value=""></span>');
    });
    $(document).on('click', '.report_remove', function () {
        $(this).parents('span').remove();
    });
});