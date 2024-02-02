/**
 * Load the wp File Download Frame
 */
function wpfd_elementor_frameload() {
    jQuery("#wpfd_elementor_loader").hide();
    jQuery("#wpfdelementormodalframe").css('visibility',"visible");
    jQuery("#wpfdelementormodalframe").show();
}

function wpfd_file_widget_trigger_controls() {
    jQuery('.elementor-control.wpfd-file-id-controls input[data-setting="wpfd_file_id"]', window.parent.document).trigger('input');
    jQuery('.elementor-control.wpfd-category-id-controls input[data-setting="wpfd_category_id"]', window.parent.document).trigger('input');
    jQuery('.elementor-control.wpfd-file-name-controls input[data-setting="wpfd_file_name"]', window.parent.document).trigger('input');
}

function wpfd_category_widget_trigger_controls() {
    jQuery('.elementor-control.elementor-control-wpfd_selected_category_id input[data-setting="wpfd_selected_category_id"]', window.parent.document).trigger('input');
    jQuery('.elementor-control.elementor-control-wpfd_selected_category_name input[data-setting="wpfd_selected_category_name"]', window.parent.document).trigger('input');
}

function wpfd_elementor_hide_modal(e) {
    jQuery('#lean_overlay', window.parent.document).fadeOut(300);
    jQuery('#wpfdelementormodal', window.parent.document).fadeOut(300);
}

jQuery(document).ready(function ($) {
    $('.wpfdelementorlaunch').leanModal({
        top: 20, beforeShow: function () {
            $("#wpfdelementormodal").css("height", "90%");
            $("#wpfdelementormodalframe").css('visibility', 'hidden');
            $("#wpfdelementormodalframe").hide();
            $("#wpfdelementormodalframe").attr('src', $("#wpfdelementormodalframe").data('src'));
            $("#wpfd_elementor_loader").show();
        }
    });
    if (typeof wpfd_elemetor_vars !== "undefined") {
        $('body').append('<div id="wpfdelementormodal" class="wpfdelementormodal-elementor"><img src="' + wpfd_elemetor_vars.dir + 'app/admin/assets/images/spinner-2x.gif" alt="Loading..." width="32" id="wpfd_elementor_loader" /><iframe id="wpfdelementormodalframe" onload="wpfd_elementor_frameload()"  width="100%" height="100%" marginWidth="0" marginHeight="0" frameBorder="0" scrolling="auto" data-src="admin.php?page=wpfd&noheader=1&caninsert=1&elementorbuilder=1"></iframe><button id="wpfd-close-elementor-modal">x</button></div>');
    }
    $(document).on("click", '.wpfdelementorlaunch', function (e) {
        window.selectedCatId = $('[data-setting="wpfd_category_id"]').val();
        window.selectedFileId = $('[data-setting="wpfd_file_id"]').val();
        $("#wpfdelementormodal").css("height", "90%");
        $("#wpfdelementormodalframe").css('visibility', 'hidden');
        $("#wpfdelementormodalframe").attr('src', $("#wpfdelementormodalframe").data('src'));
        $("#wpfd_elementor_loader").show();

        var modal_id = $(this).attr("href");
        //var modal_height=$(modal_id).outerHeight();
        var modal_width = $(modal_id).outerWidth();
        $("#lean_overlay").css({"display": "block", opacity: 0});
        $("#lean_overlay").fadeTo(200, 0.5);
        $(modal_id).css({"visibility": "visible", "display": "block", "text-align": "center", "position": "fixed", "opacity": 0, "z-index": 100102, "left": 50 + "%", "margin-left": -(modal_width / 2) + "px", "top": "20px"});
        $(modal_id).fadeTo(200, 1);
        $('#wpfdelementormodal.wpfdelementormodal-elementor #wpfdelementormodalframe').removeClass('wpfdelementormodalframe-category').addClass('wpfdelementormodalframe-single-file');
        $('#wpfdelementormodalframe.wpfdelementormodalframe-single-file').load(function () {
            var frameContents;
            frameContents = $("#wpfdelementormodalframe.wpfdelementormodalframe-single-file").contents();
            frameContents.find("#insertcategory").css({'visibility': 'hidden', 'display': 'none', 'border': 'unset', 'background-color': 'transparent', 'box-shadow': 'unset', 'color': 'transparent', 'width': '0', 'height': '0', 'margin': '0', 'padding': '0'});
            frameContents.find("#rightcol .mCSB_container").css({'marginRight': '0', 'width': 'auto', 'height': 'auto'});
            frameContents.find("#rightcol .mCSB_scrollTools").css({'display': 'none', 'width': '0', 'height': '0', 'visibility': 'hidden'});
        });
    });

    $(document).on("click", '.wpfdcategorylaunch', function (e) {
        window.selectedCatId = $('[data-setting="wpfd_selected_category_id"]').val();
        $("#wpfdelementormodal").css("height", "90%");
        $("#wpfdelementormodalframe").css('visibility', 'hidden');

        $("#wpfdelementormodalframe").attr('src', $("#wpfdelementormodalframe").data('src'));
        $("#wpfd_elementor_loader").show();

        var modal_id = $(this).attr("href");
        var modal_width = $(modal_id).outerWidth();
        $("#lean_overlay").css({"display": "block", opacity: 0});
        $("#lean_overlay").fadeTo(200, 0.5);
        $(modal_id).css({"visibility": "visible", "display": "block", "text-align": "center", "position": "fixed", "opacity": 0, "z-index": 100102, "left": 50 + "%", "margin-left": -(modal_width / 2) + "px", "top": "20px"});
        $(modal_id).fadeTo(200, 1);

        $('#wpfdelementormodal.wpfdelementormodal-elementor #wpfdelementormodalframe').removeClass('wpfdelementormodalframe-single-file').addClass('wpfdelementormodalframe-category');
        $('#wpfdelementormodalframe.wpfdelementormodalframe-category').load(function () {
            var frameContents;
            frameContents = $("#wpfdelementormodalframe.wpfdelementormodalframe-category").contents();
            frameContents.find("#insertfile").css({'visibility': 'hidden', 'display': 'none', 'border': 'unset', 'background-color': 'transparent', 'box-shadow': 'unset', 'color': 'transparent', 'width': '0', 'height': '0', 'margin': '0', 'padding': '0'});
            frameContents.find("#rightcol .mCSB_container").css({'marginRight': '0', 'width': 'auto', 'height': 'auto'});
            frameContents.find("#rightcol .mCSB_scrollTools").css({'display': 'none', 'width': '0', 'height': '0', 'visibility': 'hidden'});
        });
    });

    $(document).on('click', '#wpfd-close-elementor-modal', function (e) {
        wpfd_elementor_hide_modal(e);
    });

    $('body').on('click', function (e) {
        if ($('div#wpfdelementormodal').is(':visible') && !$(e.target).is('#wpfdelementormodal')) {
            wpfd_elementor_hide_modal(e);
        }
    });

    $(document).on('click','.elementor-control .elementor-control-title',function (e) {
        e.preventDefault();
    });
    return false;
});
