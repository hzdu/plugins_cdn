/**
 * Load the wp File Download Frame
 */
function wpfd_wpbakery_frameload() {
    jQuery("#wpfd_wpbakery_loader").hide();
    jQuery("#wpfdwpbakerymodalframe").css('visibility',"visible");
    jQuery("#wpfdwpbakerymodalframe").show();
}

function wpfd_wpbakery_category_trigger_controls(categoryName) {
    var selectedCategoryName = '<!-- wp:paragraph --><p>Hello! This is the Wp File Download Category you can edit directly from the WPBakery Page Builder.</p><!-- /wp:paragraph -->';
    if (categoryName.length) {
        selectedCategoryName = '<div class="selected-category-control-section"><span style="font-weight: bold">Category Title: </span>' + categoryName + '</div>';
    }
    jQuery('input[name="wpfd_category_random"]', window.parent.document).trigger('input');
    jQuery('input[name="wpfd_selected_category_id"]', window.parent.document).trigger('input');
    jQuery('input.wpfd_category_title[name="wpfd_category_title"]', window.parent.document).trigger('input');
    jQuery('input.wpfd_category-field[name="content"]', window.parent.document).val(selectedCategoryName).trigger('input');
}

function wpfd_wpbakery_file_trigger_controls(fileName) {
    var selectedFileName = '<!-- wp:paragraph --><p>Hello! This is the Wp File Download File you can edit directly from the WPBakery Page Builder.</p><!-- /wp:paragraph -->';
    if (fileName.length) {
        selectedFileName = '<div class="selected-file-control-section"><span style="font-weight: bold">File Title: </span>' + fileName + '</div>';
    }
    jQuery('input[name="wpfd_file_random"]', window.parent.document).trigger('input');
    jQuery('input[name="wpfd_file_id"]', window.parent.document).trigger('input');
    jQuery('input[name="wpfd_file_related_category_id"]', window.parent.document).trigger('input');
    jQuery('input[name="wpfd_file_title"]', window.parent.document).trigger('input');
    jQuery('input.wpfd_file-field[name="content"]', window.parent.document).val(selectedFileName).trigger('input');
}

function wpfd_wpbakery_hide_modal(e) {
    if ($('input[name="wpfd_category_random"]').length) {
        $('input[name="wpfd_category_random"]').val(Math.random());
    }
    if ($('input[name="wpfd_file_random"]').length) {
        $('input[name="wpfd_file_random"]').val(Math.random());
    }
    $('#lean_overlay', window.parent.document).fadeOut(300);
    $('#wpfdwpbakerymodal', window.parent.document).fadeOut(300);
}

jQuery(document).ready(function ($) {
    $('.wpfdwpbakerycategorylaunch').leanModal({
        top: 20, beforeShow: function () {
            $('#wpfdwpbakerymodal').css("height", "90%");
            $("#wpfdwpbakerymodalframe").css('visibility', 'hidden');
            $("#wpfdwpbakerymodalframe").hide();
            $("#wpfdwpbakerymodalframe").attr('src', $("#wpfdwpbakerymodalframe").data('src'));
            $("#wpfd_wpbakery_loader").show();
        }
    });

    if (typeof wpfd_wpbakery_vars !== "undefined") {
        $('body').append('<div id="wpfdwpbakerymodal" class="wpfdwpbakerymodal-wpbakery"><img src="' + wpfd_wpbakery_vars.dir + 'app/admin/assets/images/spinner-2x.gif" alt="Loading..." width="32" id="wpfd_wpbakery_loader" /><iframe id="wpfdwpbakerymodalframe" onload="wpfd_wpbakery_frameload()"  width="100%" height="100%" marginWidth="0" marginHeight="0" frameBorder="0" scrolling="auto" data-src="admin.php?page=wpfd&noheader=1&caninsert=1&wpbakerybuilder=1"></iframe><button id="wpfd-close-wpbakery-modal">x</button></div>');
    }

    $(document).on("click", '.wpfdwpbakerycategorylaunch', function (e) {
        window.selectedCatId = $('input[name="wpfd_selected_category_id"]').val();
        $("#wpfdwpbakerymodal").css("height", "90%");
        $("#wpfdwpbakerymodalframe").css('visibility', 'hidden');

        $("#wpfdwpbakerymodalframe").attr('src', $("#wpfdwpbakerymodalframe").data('src'));
        $("#wpfd_wpbakery_loader").show();

        var modal_id    = $(this).attr('href');
        var modal_width = $(modal_id).outerWidth();
        $("#lean_overlay").css({"display": "block", opacity: 0});
        $("#lean_overlay").fadeTo(200, 0.5);
        $(modal_id).css({"visibility": "visible", "display": "block", "text-align": "center", "position": "fixed", "opacity": 0, "z-index": 100102, "left": 50 + "%", "margin-left": -(modal_width / 2) + "px", "top": "20px"});
        $(modal_id).fadeTo(200, 1);

        $('#wpfdwpbakerymodal.wpfdwpbakerymodal-wpbakery #wpfdwpbakerymodalframe').removeClass('wpfdwpbakerymodalframe-single-file').addClass('wpfdwpbakerymodalframe-category');
        $('#wpfdwpbakerymodalframe.wpfdwpbakerymodalframe-category').load(function () {
            var frameContents;
            frameContents = $("#wpfdwpbakerymodalframe.wpfdwpbakerymodalframe-category").contents();
            frameContents.find("#insertfile").css({'visibility': 'hidden', 'display': 'none', 'border': 'unset', 'background-color': 'transparent', 'box-shadow': 'unset', 'color': 'transparent', 'width': '0', 'height': '0', 'margin': '0', 'padding': '0'});
            frameContents.find("#rightcol .mCSB_container").css({'marginRight': '0', 'width': 'auto', 'height': 'auto'});
            frameContents.find("#rightcol .mCSB_scrollTools").css({'display': 'none', 'width': '0', 'height': '0', 'visibility': 'hidden'});
        });
    });

    $(document).on("click", '.wpfdwpbakeryfilelaunch', function (e) {
        window.selectedCatId  = $('input[name="wpfd_file_related_category_id"]').val();
        window.selectedFileId = $('input[name="wpfd_file_id"]').val();
        $("#wpfdwpbakerymodal").css("height", "90%");
        $("#wpfdwpbakerymodalframe").css('visibility', 'hidden');
        $("#wpfdwpbakerymodalframe").attr('src', $("#wpfdwpbakerymodalframe").data('src'));
        $("#wpfd_wpbakery_loader").show();

        var modalId     = $(this).attr('href');
        var modal_width = $(modalId).outerWidth();
        $("#lean_overlay").css({"display": "block", opacity: 0});
        $("#lean_overlay").fadeTo(200, 0.5);
        $(modalId).css({"visibility": "visible", "display": "block", "text-align": "center", "position": "fixed", "opacity": 0, "z-index": 100102, "left": 50 + "%", "margin-left": -(modal_width / 2) + "px", "top": "20px"});
        $(modalId).fadeTo(200, 1);
        $('#wpfdwpbakerymodal.wpfdwpbakerymodal-wpbakery #wpfdwpbakerymodalframe').removeClass('wpfdwpbakerymodalframe-category').addClass('wpfdwpbakerymodalframe-single-file');
        $('#wpfdwpbakerymodalframe.wpfdwpbakerymodalframe-single-file').load(function () {
            var frameContents;
            frameContents = $("#wpfdwpbakerymodalframe.wpfdwpbakerymodalframe-single-file").contents();
            frameContents.find("#insertcategory").css({'visibility': 'hidden', 'display': 'none', 'border': 'unset', 'background-color': 'transparent', 'box-shadow': 'unset', 'color': 'transparent', 'width': '0', 'height': '0', 'margin': '0', 'padding': '0'});
            frameContents.find("#rightcol .mCSB_container").css({'marginRight': '0', 'width': 'auto', 'height': 'auto'});
            frameContents.find("#rightcol .mCSB_scrollTools").css({'display': 'none', 'width': '0', 'height': '0', 'visibility': 'hidden'});
        });
    });

    $(document).on('click', '#wpfd-close-wpbakery-modal', function (e) {
        wpfd_wpbakery_hide_modal(e);
    });

    $('body').on('click', function (e) {
        if ($('div#wpfdwpbakerymodal').is(':visible') && !$(e.target).is('#wpfdwpbakerymodal')) {
            wpfd_wpbakery_hide_modal(e);
        }
    });

    $(document).on('change', 'div[data-vc-shortcode="wpfd_search_shortcode"] select', function (e) {
        var categoryFilter  = $('select[name="wpfd_filter_by_category"]').val();
        var tagFilter       = $('select[name="wpfd_filter_by_tag"]').val();
        var tagAs           = ($('select[name="wpfd_filter_tag_as"]').val() === '1') ? 'searchbox' : 'checkbox';
        var creationDate    = $('select[name="wpfd_filter_creation_date"]').val();
        var updateDate      = $('select[name="wpfd_filter_update_date"]').val();
        var typeFilter      = $('select[name="wpfd_filter_type"]').val();
        var weightFilter    = $('select[name="wpfd_filter_weight"]').val();
        var perPage         = $('select[name="wpfd_filter_per_page"]').val();
        var result          = '<!-- wp:paragraph --><p style="margin: 0"><span style="font-weight: bold">Search Shortcode: </span>[wpfd_search cat_filter="'+ categoryFilter +'" tag_filter="'+ tagFilter +'" display_tag="'+ tagAs +'" create_filter="'+ creationDate +'" update_filter="'+ updateDate +'" type_filter="'+ typeFilter +'" weight_filter="'+ weightFilter +'" file_per_page="'+ perPage +'"]</p><!-- /wp:paragraph -->';
        $('div[data-vc-shortcode="wpfd_search_shortcode"] input[name="content"]').val(result).trigger('input');
    });
});