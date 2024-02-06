/**
 * Load the wp File Download Frame
 */
function wpfd_avada_frameload() {
    jQuery("#wpfd_avada_loader").hide();
    jQuery("#wpfdavadamodalframe").css('visibility',"visible");
    jQuery("#wpfdavadamodalframe").show();
}

function wpfd_avada_category_trigger_controls() {
    jQuery('input#wpfd_selected_category_random', window.parent.document).trigger('input').trigger('change');
    jQuery('input#wpfd_selected_category_id', window.parent.document).trigger('input').trigger('change');
    jQuery('input#wpfd_selected_category_title', window.parent.document).trigger('input').trigger('change');
    jQuery('input#element_content', window.parent.document).trigger('input').trigger('change');
}

function wpfd_avada_file_trigger_controls() {
    jQuery('input#wpfd_selected_file_random', window.parent.document).trigger('input').trigger('change');
    jQuery('input#wpfd_selected_file_id', window.parent.document).trigger('input').trigger('change');
    jQuery('input#wpfd_selected_category_id_related', window.parent.document).trigger('input').trigger('change');
    jQuery('input#wpfd_selected_file_title', window.parent.document).trigger('input').trigger('change');
    jQuery('input#element_content', window.parent.document).trigger('input').trigger('change');
}

function wpfd_avada_hide_modal(e) {
    if (jQuery('input#wpfd_selected_category_random').length) {
        jQuery('input#wpfd_selected_category_random').val(Math.random()).trigger('change');
    }
    if (jQuery('input#wpfd_selected_file_random').length) {
        jQuery('input#wpfd_selected_file_random').val(Math.random()).trigger('change');
    }
    jQuery('#lean_overlay', window.parent.document).fadeOut(300);
    jQuery('#wpfdavadamodal', window.parent.document).fadeOut(300);
}

function wpfd_avada_search_params(e) {
    var categoryFilter  = ( jQuery('input#wpfd_filter_by_category').val().toString() === 'yes' ) ? '1' : '0';
    var tagFilter       = ( jQuery('input#wpfd_filter_by_tag').val().toString() === 'yes' ) ? '1' : '0';
    var tagAs           = ( jQuery('select#wpfd_filter_tag_as').length ) ? jQuery('select#wpfd_filter_tag_as').val().toString() : jQuery('input#wpfd_filter_tag_as').val().toString();
    var creationDate    = ( jQuery('input#wpfd_filter_creation_date').val().toString() === 'yes' ) ? '1' : '0';
    var updateDate      = ( jQuery('input#wpfd_filter_update_date').val().toString() === 'yes' ) ? '1' : '0';
    var typeFilter      = ( jQuery('input#wpfd_filter_by_type').val().toString() === 'yes' ) ? '1' : '0';
    var weightFilter    = ( jQuery('input#wpfd_filter_by_weight').val().toString() === 'yes' ) ? '1' : '0';
    var perPage         = ( jQuery('select#wpfd_filter_per_page').length ) ? jQuery('select#wpfd_filter_per_page').val().toString() : jQuery('input#wpfd_filter_per_page').val().toString();
    var result          = '[wpfd_search cat_filter="'+ categoryFilter +'" tag_filter="'+ tagFilter +'" display_tag="'+ tagAs +'" create_filter="'+ creationDate +'" update_filter="'+ updateDate +'" type_filter="'+ typeFilter +'" weight_filter="'+  weightFilter +'" file_per_page="'+ perPage +'"]';
    jQuery('ul.wpfd_search_file input#element_content').val(result);
}

jQuery(document).ready(function ($) {

    $('.wpfdavadacategorylaunch').leanModal({
        top: 20, beforeShow: function () {
            $('#wpfdavadamodal').css("height", "90%");
            $("#wpfdavadamodalframe").css('visibility', 'hidden');
            $("#wpfdavadamodalframe").hide();
            $("#wpfdavadamodalframe").attr('src', $("#wpfdavadamodalframe").data('src'));
            $("#wpfd_avada_loader").show();
        }
    });

    if (typeof wpfd_avada_vars !== "undefined") {
        $('body').append('<div id="wpfdavadamodal" class="wpfdavadamodal-avada"><img src="' + wpfd_avada_vars.dir + 'app/admin/assets/images/spinner-2x.gif" alt="Loading..." width="32" id="wpfd_avada_loader" /><iframe id="wpfdavadamodalframe" onload="wpfd_avada_frameload()"  width="100%" height="100%" marginWidth="0" marginHeight="0" frameBorder="0" scrolling="auto" data-src="' + wpfd_avada_vars.adminurl + 'admin.php?page=wpfd&noheader=1&caninsert=1&avadabuilder=1"></iframe><button id="wpfd-close-avada-modal">x</button></div>');
    }

    $(document).on('click', '#wpfdavadacategorylaunch', function (e) {
        window.selectedCatId = $('input#wpfd_selected_category_id').val();
        $("#wpfdavadamodal").css("height", "90%");
        $("#wpfdavadamodalframe").css('visibility', 'hidden');

        $("#wpfdavadamodalframe").attr('src', $("#wpfdavadamodalframe").data('src'));
        $("#wpfd_avada_loader").show();

        var avada_modal_id            = $(this).attr('href');
        var avada_modal_width         = $(avada_modal_id).outerWidth();
        $("#lean_overlay").css({"display": "block", opacity: 0});
        $("#lean_overlay").fadeTo(200, 0.5);
        $(avada_modal_id).css({"visibility": "visible", "display": "block", "text-align": "center", "position": "fixed", "opacity": 0, "z-index": 100102, "left": 50 + "%", "margin-left": -(avada_modal_width / 2) + "px", "top": "20px"});
        $(avada_modal_id).fadeTo(200, 1);

        $('#wpfdavadamodal.wpfdavadamodal-avada #wpfdavadamodalframe').removeClass('wpfdavadamodalframe-single-file').addClass('wpfdavadamodalframe-category');
        $('#wpfdavadamodalframe.wpfdavadamodalframe-category').load(function () {
            var frameContents;
            frameContents = $("#wpfdavadamodalframe.wpfdavadamodalframe-category").contents();
            frameContents.find("#insertfile").css({'visibility': 'hidden', 'display': 'none', 'border': 'unset', 'background-color': 'transparent', 'box-shadow': 'unset', 'color': 'transparent', 'width': '0', 'height': '0', 'margin': '0', 'padding': '0'});
            frameContents.find("#rightcol .mCSB_container").css({'marginRight': '0', 'width': 'auto', 'height': 'auto', 'border-bottom': '1px solid transparent'});
            frameContents.find("#rightcol .mCSB_scrollTools").css({'display': 'none', 'width': '0', 'height': '0', 'visibility': 'hidden'});
        });
    });

    $(document).on('click', '#wpfdavadafilelaunch', function (e) {
        window.selectedCatId  = $('input#wpfd_selected_category_id_related').val();
        window.selectedFileId = $('input#wpfd_selected_file_id').val();
        $("#wpfdavadamodal").css("height", "90%");
        $("#wpfdavadamodalframe").css('visibility', 'hidden');
        $("#wpfdavadamodalframe").attr('src', $("#wpfdavadamodalframe").data('src'));
        $("#wpfd_avada_loader").show();

        var modalId     = $(this).attr('href');
        var modal_width = $(modalId).outerWidth();
        $("#lean_overlay").css({"display": "block", opacity: 0});
        $("#lean_overlay").fadeTo(200, 0.5);
        $(modalId).css({"visibility": "visible", "display": "block", "text-align": "center", "position": "fixed", "opacity": 0, "z-index": 100102, "left": 50 + "%", "margin-left": -(modal_width / 2) + "px", "top": "20px"});
        $(modalId).fadeTo(200, 1);
        $('#wpfdavadamodal.wpfdavadamodal-avada #wpfdavadamodalframe').removeClass('wpfdavadamodalframe-category').addClass('wpfdavadamodalframe-single-file');
        $('#wpfdavadamodalframe.wpfdavadamodalframe-single-file').load(function () {
            var frameContents;
            frameContents = $("#wpfdavadamodalframe.wpfdavadamodalframe-single-file").contents();
            frameContents.find("#insertcategory").css({'visibility': 'hidden', 'display': 'none', 'border': 'unset', 'background-color': 'transparent', 'box-shadow': 'unset', 'color': 'transparent', 'width': '0', 'height': '0', 'margin': '0', 'padding': '0'});
            frameContents.find("#rightcol .mCSB_container").css({'marginRight': '0', 'width': 'auto', 'height': 'auto', 'border-bottom': '1px solid transparent'});
            frameContents.find("#rightcol .mCSB_scrollTools").css({'display': 'none', 'width': '0', 'height': '0', 'visibility': 'hidden'});
        });
    });

    $(document).on('click', '#wpfd-close-avada-modal', function (e) {
        wpfd_avada_hide_modal(e);
    });

    $('body').on('click', function (e) {
        if ($('div#wpfdavadamodal').is(':visible') && !$(e.target).is('#wpfdavadamodal')) {
            wpfd_avada_hide_modal(e);
        }
    });

    $(document).on('change', 'ul.wpfd_search_file input, ul.wpfd_search_file select', function (e) {
        wpfd_avada_search_params(e);
    });

    $(document).on('click', '.fusion-builder-live .wpfd_search_file .buttonset-item, .fusion-builder-live .wpfd_search_file .fusion-select-label', function (e) {
        wpfd_avada_search_params(e);
        $('ul.wpfd_search_file input#element_content').trigger('input').trigger('change');
    });

});