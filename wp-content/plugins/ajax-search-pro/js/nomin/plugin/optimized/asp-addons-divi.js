(function($){
    "use strict";
    let helpers = window.WPD.ajaxsearchpro.helpers;
    let addon = function() {
        this.name = "Divi Widget Fixes";
        this.init = function(){
            helpers.Hooks.addFilter('asp/init/etc', this.diviBodyCommerceResultsPage, 10, this);
        };
        this.diviBodyCommerceResultsPage = function( $this ) {
            if ( $this.o.divi.bodycommerce && $this.o.is_results_page ) {
                WPD.intervalUntilExecute(function($){
                    setTimeout(function(){
                        $('#divi_filter_button').trigger('click');
                    }, 50);
                }, function() {
                    return typeof jQuery !== "undefined" ? jQuery : false;
                });
            }
        };
    }
    window.WPD.ajaxsearchpro.addons.add(new addon());
})(WPD.dom);