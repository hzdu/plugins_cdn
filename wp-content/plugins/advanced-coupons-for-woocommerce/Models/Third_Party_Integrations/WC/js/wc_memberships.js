(function ($) {
    var allowed_field_title = wc_memberships_args.allowed_field_title, disallowed_field_title = wc_memberships_args.disallowed_field_title, select_membership_plans = wc_memberships_args.select_membership_plans, membership_plans = wc_memberships_args.membership_plans;
    /**
     * Define allowed field data and callbacks.
     */
    var field_data = {
        default_data_value: [],
        /**
         * Condition field template markup callback.
         *
         * @since 1.15
         */
        template_callback: function (data, field_key) {
            if (field_key === void 0) { field_key = "wc_memberships_allowed"; }
            var title = field_key == "wc_memberships_allowed" ? allowed_field_title : disallowed_field_title;
            var type = field_key == "wc_memberships_allowed" ? "wc-memberships-allowed" : "wc-memberships-disallowed";
            return "\n            <div class=\"wc-memberships-field condition-field\" data-type=\"" + type + "\">\n                <a class=\"remove-condition-field\" href=\"javascript:void(0);\"><i class=\"dashicons dashicons-trash\"></i></a>\n                <h3 class=\"condition-field-title\">" + title + "</h3>\n                <div class=\"field-control\">\n                    <select class=\"wc-enhanced-select condition-value\" multiple data-placeholder=\"" + select_membership_plans + "\">\n                        " + get_membership_options(data) + "\n                    </select>\n                </div>\n            </div>        \n            ";
        },
        /**
         * Condition field scraper callback.
         *
         * @since 1.15
         */
        scraper_callback: function (condition_field) {
            var temp = condition_field.querySelector(".condition-value");
            return $(temp).val();
        }
    };
    /**
     * Register condition field callbacks.
     */
    acfw_edit_coupon.cart_condition_fields.wc_memberships_allowed = field_data;
    acfw_edit_coupon.cart_condition_fields.wc_memberships_disallowed = field_data;
    /*
    |--------------------------------------------------------------------------
    | Utility functions.
    |--------------------------------------------------------------------------
    */
    /**
     * Get membership options markup.
     *
     * @since 1.15
     *
     * @param data
     */
    function get_membership_options(data) {
        if (data === void 0) { data = []; }
        var markup = "";
        for (var key in membership_plans) {
            var label = membership_plans[key];
            var selected = data.indexOf(key) > -1 ? "selected" : "";
            markup += "<option value=\"" + key + "\" " + selected + ">" + label + "</option>";
        }
        return markup;
    }
})(jQuery);
