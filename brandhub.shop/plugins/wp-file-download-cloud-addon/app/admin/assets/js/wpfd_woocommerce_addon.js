var wpfd_wooframeload = function() {
    jQuery("#wpfd_woo_loader").hide();
    jQuery("#wpfdWooModalFrame").css('visibility',"visible");
    jQuery("#wpfdWooModalFrame").show();
}
var wpfdWooAddonAddFileRow = function (file, variationId = 0) {
    var selector = variationId ? '#wpfd_product_data_' + variationId : '#wpfd_product_data';
    var container = jQuery(selector);
    var sourceRowSelector = variationId ? '[data-variant-id='+variationId+']' : '[data-wpfd-woo-add]';
    container.find(".downloadable_files").find("tbody").append(jQuery(sourceRowSelector).data("row"));
    container.find(".downloadable_files").find("tbody tr:last-child input[name*=_wpfd_wc_files_name]").val(file.name);
    container.find(".downloadable_files").find("tbody tr:last-child input[name*=_wpfd_wc_files_id]").val(file.id);
    container.find(".downloadable_files").find("tbody tr:last-child input[name*=_wpfd_wc_files_catid]").val(file.catid);
    container.find(".downloadable_files").find("tbody tr:last-child .file_id span").html(file.id);
    container.find(".downloadable_files").find("tbody tr:last-child .file_catid span").html(file.catid);

    // For Variations reload the forms
    container.closest(".woocommerce_variation").addClass("variation-needs-update"),
    jQuery("button.cancel-variation-changes, button.save-variation-changes").prop("disabled", !1),
    jQuery("#variable_product_options").trigger("woocommerce_variations_input_changed");

    return false;
}
window.wpfdWooAddonAddFileRow = wpfdWooAddonAddFileRow;
jQuery(function ($) {
    // $('#wpfd_woo_add_file').appendTo('.downloadable_files tfoot th');
    $('[data-wpfd-woo-add]').leanModal({
        top: 20, beforeShow: function () {
            $("#wpfdWoocommerceModal").css("height", "90%");
            $("#wpfdWooModalFrame").css('visibility','hidden');
            $("#wpfdWooModalFrame").hide();
            $("#wpfdWooModalFrame").attr('src', $("#wpfdWooModalFrame").data('src'));
            $("#wpfd_woo_loader").show();
        }
    });
    $(document).on('click', '[data-wpfd-woo-add]', function(e) {
       var button = $(this);
        var variationId = button.data('variant-id') || 0;
        var modalUrl = wpfdWooAddonVars.adminurl + 'admin.php?page=wpfd&noheader=1&caninsert=1&woocommerce=1&variation=' + variationId;
        $('#wpfdWoocommerceModal').remove();
        $('body').append('<div id="wpfdWoocommerceModal"><img src="'+wpfdWooAddonVars.adminurl+'images/spinner-2x.gif" width="32" id="wpfd_woo_loader" /><iframe id="wpfdWooModalFrame" onload="wpfd_wooframeload()"  width="100%" height="100%" marginWidth="0" marginHeight="0" frameBorder="0" scrolling="auto" data-src="'+modalUrl+'"></iframe><button id="wpfd-close-modal">x</button></div>');
        $("#wpfdWoocommerceModal").css("height", "90%");
        $("#wpfdWooModalFrame").css('visibility', 'hidden');
        $("#wpfdWooModalFrame").attr('src', $("#wpfdWooModalFrame").data('src'));
        $("#wpfd_woo_loader").show();

        var modal_id = button.attr("href");
        //var modal_height=$(modal_id).outerHeight();
        var modal_width = $(modal_id).outerWidth();
        $("#lean_overlay").css({"display": "block", opacity: 0});
        $("#lean_overlay").fadeTo(200, 0.5);
        $(modal_id).css({"visibility": "visible", "display": "block", "text-align": "center", "position": "fixed", "opacity": 0, "z-index": 100102, "left": 50 + "%", "margin-left": -(modal_width / 2) + "px", "top": "20px"});
        $(modal_id).fadeTo(200, 1);
    });
    $(document).on('click', '#wpfd-close-modal', function (e) {
        $('#lean_overlay', window.parent.document).fadeOut(300);
        $('#wpfdWoocommerceModal', window.parent.document).fadeOut(300);
    });
});
