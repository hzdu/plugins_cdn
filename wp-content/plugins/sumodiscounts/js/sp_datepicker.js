
jQuery(document).ready(function () {
    jQuery('.sp_date').datepicker({
        dateFormat: "dd-mm-yy"
    });
    jQuery('.sp__date').datepicker({
        dateFormat: "yy-mm-dd",
        maxDate: new Date()
    });
});
