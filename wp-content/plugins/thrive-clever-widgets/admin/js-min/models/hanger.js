/*! Thrive Clever Widgets 2022-02-25
* http://www.thrivethemes.com 
* Copyright (c) 2022 * Thrive Themes */
var tcw_app=tcw_app||{};!function(){"use strict";tcw_app.Hanger=Backbone.Model.extend({defaults:{identifier:"",tabs:""},initialize:function(a,b){this.set("tabs",new tcw_app.Tabs(a.tabs))},countCheckedOptions:function(){var a=0;return this.get("tabs").each(function(b){a+=b.countCheckedOptions()}),a},uncheckAll:function(){this.get("tabs").each(function(a){a.uncheckAll()})}})}(jQuery);