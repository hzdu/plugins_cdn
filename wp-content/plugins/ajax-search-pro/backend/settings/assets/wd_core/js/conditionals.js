window.WD_Helpers = window.WD_Helpers || {};
window.WD_Helpers.Conditionals =window.WD_Helpers.Conditionals || {};
jQuery(function($){
    var conditionals = window.WD_Helpers.Conditionals;
    conditionals = $.extend({
        'types': {
            'wd-show-on': {
                'remove': 'hiddend'
            },
            'wd-hide-on': {
                'add': 'hiddend'
            },
            'wd-disable-on': {
                'add': 'disabled'
            },
            'wd-enable-on': {
                'remove': 'disabled'
            }
        },
        init: function(selector) {
            this.events.init(selector);
        },
        load: function( node ) {
            $.each(Object.keys(this.types), function(i, type) {
                $(node).find('*[' + type + ']').each(function () {
                    var rules = $(this).attr(type).split(';');
                    var last = rules[rules.length - 1];
                    var attr = last.split(':')[0];
                    $(node).find('*[attr="' + attr + '"], [noattr="' + attr + '"]').last().trigger('conditionalchange');
                });
            });
        },
        events: {
            /**
             * Allows custom syntax on nodes to show/hide/enable/disable on specific conditions
             * Ex.:
             *      <node wd-show-on='name1:value1,value2;name2:valueX;..'>
             */
            init: function( selector ) {
                $(selector).each(function(){
                    var parent = this;
                    $.each(Object.keys(conditionals.types), function(i, type){
                        $(parent).find('*[' + type + ']').each(function(){
                            var target = this;
                            var rules = $(this).attr(type).split(';');
                            var length = rules.length;
                            $.each(rules, function(i, rule){
                                var attr = rule.split(':')[0];
                                $(parent).find('*[attr="' + attr + '"], *[noattr="' + attr + '"], *[isparam=1][name="' + attr + '"]').each(function(){
                                    $(this).on('input', function (){
                                        $(this).trigger('conditionalchange');
                                    });
                                    $(this).on('conditionalchange', function(e){
                                        var allRulesMatch = conditionals.functions.check(rules, parent);
                                        if ( allRulesMatch ) {
                                            if ( typeof conditionals.types[type].add != "undefined" ) {
                                                $(target).addClass(conditionals.types[type].add);
                                            } else if ( typeof conditionals.types[type].remove != "undefined" ) {
                                                $(target).removeClass(conditionals.types[type].remove);
                                            }
                                        } else {
                                            if ( typeof conditionals.types[type].add != "undefined" ) {
                                                $(target).removeClass(conditionals.types[type].add);
                                            } else if ( typeof conditionals.types[type].remove != "undefined" ) {
                                                $(target).addClass(conditionals.types[type].remove);
                                            }
                                        }
                                    });
                                    if ( i == (length - 1) ) {
                                        $(this).trigger('conditionalchange');
                                    }
                                });
                            });
                        });
                    });

                    var observer = new MutationObserver(function(mutationsList){
                        conditionals.load(parent);
                    });
                    observer.observe(parent, { attributes: false, childList: true, subtree: true });
                });
            }
        },
        functions: {
            /**
             * Checks if all the conditional rules are matching within the parent scope
             *
             * @param {[]} rules Array of rules in format "name:value1,value2,..,valueN"
             * @param {{}} parent Scope in whic to look for the rules
             * @returns {boolean}
             */
            check: function(rules, parent) {
                var allRulesMatched = true;
                $.each(rules, function(i, rule){
                    var attr = rule.split(':')[0];
                    var values = rule.split(':').slice(1)[0].split(',');
                    $(parent).find('*[attr="' + attr + '"], [noattr="' + attr + '"], *[isparam=1][name="' + attr + '"]').each(function(){
                        var value = WD_Helpers.getNodeValue(this);
                        var match = false;
                        $.each(values, function(ii, val){
                            if ( Array.isArray(value) ) {
                                if ( value.includes(val) ) {
                                    match = true;
                                    return false;
                                }
                            } else {
                                if ( value == val ) {
                                    match = true;
                                    return false;
                                }
                            }
                        });
                        if ( !match ) {
                            allRulesMatched = false;
                            return false;
                        }
                    });
                    if ( !allRulesMatched ) {
                        return false;
                    }
                });

                return allRulesMatched;
            }
        }
    }, conditionals);
    window.WD_Helpers.Conditionals = conditionals;
});