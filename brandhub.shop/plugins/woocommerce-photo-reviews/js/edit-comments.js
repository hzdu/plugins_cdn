jQuery(document).ready(function ($) {
    'use strict';
    jQuery('.wcpr-product-search').select2({
        allowClear: true,
        placeholder: "Please fill in your product title",
        ajax: {
            url: "admin-ajax.php?action=wcpr_search_parent_product",
            dataType: 'json',
            type: "GET",
            quietMillis: 50,
            delay: 250,
            data: function (params) {
                return {
                    keyword: params.term,
                    nonce: wcpr_edit_comments.nonce
                };
            },
            processResults: function (data) {
                return {
                    results: data
                };
            },
            cache: true
        },
        escapeMarkup: function (markup) {
            return markup;
        }, // let our custom formatter work
        minimumInputLength: 1
    });

});
jQuery(window).on('load', function () {
    'use strict';
   if (typeof wcpr_edit_comments !== "undefined" && wcpr_edit_comments.wcpr_review_images_html) {
       if (!jQuery('.wcpr_review_filter_images').length){
           jQuery('#filter-by-review-rating').after(wcpr_edit_comments.wcpr_review_images_html);
       }
       jQuery('.wcpr_review_filter_images').val(wcpr_edit_comments.wcpr_review_images);
   }
});