"use strict";

var wfob_app = {};
wfob_app.Helpers = {};
wfob_app.Views = {};
wfob_app.Events = {};

_.extend(wfob_app.Events, Backbone.Events);

wfob_app.Helpers.uniqid = function (prefix, more_entropy) {
    if (typeof prefix == 'undefined') {
        prefix = "";
    }

    var retId;

    var formatSeed = function formatSeed(seed, reqWidth) {
        seed = parseInt(seed, 10).toString(16); // to hex str

        if (reqWidth < seed.length) {
            // so long we split
            return seed.slice(seed.length - reqWidth);
        }

        if (reqWidth > seed.length) {
            // so short we pad
            return Array(1 + (reqWidth - seed.length)).join('0') + seed;
        }

        return seed;
    }; // BEGIN REDUNDANT


    if (!this.php_js) {
        this.php_js = {};
    } // END REDUNDANT


    if (!this.php_js.uniqidSeed) {
        // init seed with big random int
        this.php_js.uniqidSeed = Math.floor(Math.random() * 0x75bcd15);
    }

    this.php_js.uniqidSeed++;
    retId = prefix; // start with prefix, add current milliseconds hex string

    retId += formatSeed(parseInt(new Date().getTime() / 1000, 10), 8);
    retId += formatSeed(this.php_js.uniqidSeed, 5); // add seed hex string

    if (more_entropy) {
        // for more entropy we add a float lower to 10
        retId += (Math.random() * 10).toFixed(8).toString();
    }

    return retId;
};

jQuery(function ($) {
    // if (!(typeof pagenow !== "undefined" && pagenow === "wfob_thankyou")) {
    //     return;
    // }
    $('#wfob_settings_location').change(function () {
        if ($(this).val() == 'custom:custom') {
            $('.wfob-settings-custom').show();
        } else {
            $('.wfob-settings-custom').hide();
        }
    });
    $('.wfob_save_funnel_rules').on('click', function () {
        var data = {
            "data": $('.wfob_rules_form').serialize()
        };
        data.action = 'wfob_save_rules_settings';
        var ajax_loader = $('#wfob_funnel_rule_settings').find('.wfob_save_funnel_rules_ajax_loader');
        ajax_loader.addClass('ajax_loader_show');
        $.post(wfob_secure.ajax_url, data, function () {
            ajax_loader.removeClass('ajax_loader_show');
            $(document).trigger('wfob_rules_updated');
        });
        return false;
    });
    $('#wfob_settings_location').trigger('change'); // Ajax Chosen Product Selectors

    var bind_ajax_chosen = function bind_ajax_chosen() {
        $(".wfob-date-picker-field").datepicker({
            dateFormat: "yy-mm-dd",
            numberOfMonths: 1,
            showButtonPanel: true,
            beforeShow: function beforeShow(input, inst) {
                $(inst.dpDiv).addClass('xl-datepickers');
            }
        });
        $(".wfob-time-picker-field").mask("99 : 99");
        $('select.chosen_select').xlChosen();
        $("select.ajax_chosen_select_products").xlAjaxChosen({
            method: 'GET',
            url: ajaxurl,
            dataType: 'json',
            afterTypeDelay: 100,
            data: {
                action: 'woocommerce_json_search_products_and_variations',
                security: wfob_secure.search_products_nonce
            }
        }, function (data) {
            var terms = {};
            $.each(data, function (i, val) {
                terms[i] = val;
            });
            return terms;
        });
        $("select.ajax_chosen_select_users").xlAjaxChosen({
            method: 'GET',
            url: ajaxurl,
            dataType: 'json',
            afterTypeDelay: 100,
            data: {
                action: 'woocommerce_json_search_customers',
                security: wfob_secure.search_customers_nonce
            }
        }, function (data) {
            var terms = {};
            $.each(data, function (i, val) {
                terms[i] = val;
            });
            return terms;
        });


        $("select.ajax_chosen_select").each(function (element) {
            $(element).xlAjaxChosen({
                method: 'GET',
                url: ajaxurl,
                dataType: 'json',
                afterTypeDelay: 100,
                data: {
                    action: 'wfob_json_search',
                    method: $(element).data('method'),
                    security: wfob_secure.ajax_chosen
                }
            }, function (data) {
                var terms = {};
                $.each(data, function (i, val) {
                    terms[i] = val;
                });
                return terms;
            });
        });
    };

    bind_ajax_chosen(); //Note - this section will eventually be refactored into the backbone views themselves.  For now, this is more efficent.

    $('.wfob_rules_common').on('change', 'select.rule_type', function () {
        // vars
        var tr = $(this).closest('tr');
        var rule_id = tr.data('ruleid');
        var group_id = tr.closest('table').data('groupid');
        var ajax_data = {
            action: "wfob_change_rule_type",
            security: wfob_secure.nonce,
            rule_category: $(this).parents(".wfob-rules-builder").eq(0).attr('data-category'),
            group_id: group_id,
            rule_id: rule_id,
            rule_type: $(this).val()
        };
        tr.find('td.condition').html('').remove();
        tr.find('td.operator').html('').remove();
        tr.find('td.loading').show();
        tr.find('td.rule-type select').prop("disabled", true); // load location html

        $.ajax({
            url: ajaxurl,
            data: ajax_data,
            type: 'post',
            dataType: 'html',
            success: function success(html) {
                tr.find('td.loading').hide().before(html);
                tr.find('td.rule-type select').prop("disabled", false);
                bind_ajax_chosen();
            }
        });
    }); //Backbone views to manage the UX.

    var wfob_Rule_Builder = Backbone.View.extend({
        groupCount: 0,
        el: '.wfob-rules-builder[data-category="basic"]',
        events: {
            'click .wfob-add-rule-group': 'addRuleGroup'
        },
        render: function render() {
            var _this = this;

            this.$target = this.$('.wfob-rule-group-target');
            this.category = 'basic';
            wfob_app.Events.bind('wfob:remove-rule-group', this.removeRuleGroup, this);
            this.views = {};
            var groups = this.$('div.wfob-rule-group-container');
            _.each(groups, function (group) {
                _this.groupCount++;
                var id = $(group).data('groupid');
                var view = new wfob_Rule_Group({
                    el: group,
                    model: new Backbone.Model({
                        groupId: id,
                        groupCount: _this.groupCount,
                        headerText: _this.groupCount > 1 ? wfob_secure.text_or : wfob_secure.text_apply_when,
                        removeText: wfob_secure.remove_text,
                        category: _this.category
                    })
                });
                _this.views[id] = view;
                view.bind('wfob:remove-rule-group', _this.removeRuleGroup, _this);
            }, this);

            if (this.groupCount > 0) {
                $('.rules_or').show();
            }
        },
        addRuleGroup: function addRuleGroup(event) {
            event.preventDefault();
            var newId = 'group' + wfob_app.Helpers.uniqid();
            this.groupCount++;
            var view = new wfob_Rule_Group({
                model: new Backbone.Model({
                    groupId: newId,
                    groupCount: this.groupCount,
                    headerText: this.groupCount > 1 ? wfob_secure.text_or : wfob_secure.text_apply_when,
                    removeText: wfob_secure.remove_text,
                    category: this.category
                })
            });
            this.$target.append(view.render().el);
            this.views[newId] = view;
            view.bind('wfob:remove-rule-group', this.removeRuleGroup, this);

            if (this.groupCount > 0) {
                $('.rules_or').show();
            }

            bind_ajax_chosen();
            return false;
        },
        removeRuleGroup: function removeRuleGroup(sender) {
            delete this.views[sender.model.get('groupId')];
            sender.remove();
        }
    }); //Backbone views to manage the UX.

    var wfob_Rule_Builder2 = Backbone.View.extend({
        groupCount: 0,
        el: '.wfob-rules-builder[data-category="product"]',
        events: {
            'click .wfob-add-rule-group': 'addRuleGroup'
        },
        render: function render() {
            this.$target = this.$('.wfob-rule-group-target');
            this.category = 'product';
            wfob_app.Events.bind('wfob:remove-rule-group', this.removeRuleGroup, this);
            this.views = {};
            var groups = this.$('div.wfob-rule-group-container');

            _.each(groups, function (group) {
                this.groupCount++;
                var id = $(group).data('groupid');
                var view = new wfob_Rule_Group({
                    el: group,
                    model: new Backbone.Model({
                        groupId: id,
                        groupCount: this.groupCount,
                        headerText: this.groupCount > 1 ? wfob_secure.text_or : wfob_secure.text_apply_when,
                        removeText: wfob_secure.remove_text,
                        category: this.category
                    })
                });
                this.views[id] = view;
                view.bind('wfob:remove-rule-group', this.removeRuleGroup, this);
            }, this);

            if (this.groupCount > 0) {
                $('.rules_or').show();
            }
        },
        addRuleGroup: function addRuleGroup(event) {
            event.preventDefault();
            var newId = 'group' + wfob_app.Helpers.uniqid();
            this.groupCount++;
            var view = new wfob_Rule_Group({
                model: new Backbone.Model({
                    groupId: newId,
                    groupCount: this.groupCount,
                    headerText: this.groupCount > 1 ? wfob_secure.text_or : wfob_secure.text_apply_when,
                    removeText: wfob_secure.remove_text,
                    category: this.category
                })
            });
            this.$target.append(view.render().el);
            this.views[newId] = view;
            view.bind('wfob:remove-rule-group', this.removeRuleGroup, this);

            if (this.groupCount > 0) {
                $('.rules_or').show();
            }

            bind_ajax_chosen();
            return false;
        },
        removeRuleGroup: function removeRuleGroup(sender) {
            delete this.views[sender.model.get('groupId')];
            sender.remove();
        }
    });
    var wfob_Rule_Group = Backbone.View.extend({
        tagName: 'div',
        className: 'wfob-rule-group-container',
        template: _.template('<div class="wfob-rule-group-header"><h4 class="rules_or"><%= headerText %></h4><a href="#" class="wfob-remove-rule-group button"><%= removeText %></a></div><table class="wfob-rules" data-groupid="<%= groupId %>"><tbody></tbody></table>'),
        events: {
            'click .wfob-remove-rule-group': 'onRemoveGroupClick'
        },
        initialize: function initialize() {
            var _this2 = this;

            this.views = {};
            this.$rows = this.$el.find('table.wfob-rules tbody');
            var rules = this.$('tr.wfob-rule');

            _.each(rules, function (rule) {
                var id = $(rule).data('ruleid');
                var view = new wfob_Rule_Item({
                    el: rule,
                    model: new Backbone.Model({
                        groupId: _this2.model.get('groupId'),
                        ruleId: id,
                        category: _this2.model.get('category')
                    })
                });
                view.delegateEvents();
                view.bind('wfob:add-rule', _this2.onAddRule, _this2);
                view.bind('wfob:remove-rule', _this2.onRemoveRule, _this2);
                _this2.views.ruleId = view;
            }, this);
        },
        render: function render() {
            this.$el.html(this.template(this.model.toJSON()));
            this.$rows = this.$el.find('table.wfob-rules tbody');
            this.$el.attr('data-groupid', this.model.get('groupId'));
            this.onAddRule(null);
            return this;
        },
        onAddRule: function onAddRule(sender) {
            var newId = 'rule' + wfob_app.Helpers.uniqid();
            var view = new wfob_Rule_Item({
                model: new Backbone.Model({
                    groupId: this.model.get('groupId'),
                    ruleId: newId,
                    category: this.model.get('category')
                })
            });

            if (sender == null) {
                this.$rows.append(view.render().el);
            } else {
                sender.$el.after(view.render().el);
            }

            view.bind('wfob:add-rule', this.onAddRule, this);
            view.bind('wfob:remove-rule', this.onRemoveRule, this);
            bind_ajax_chosen();
            this.views.ruleId = view;
        },
        onRemoveRule: function onRemoveRule(sender) {
            var ruleId = sender.model.get('ruleId');
            var rulesgrp = sender.model.get('groupId');
            var cat = sender.model.get('category');
            var countRules = $(".wfob-rules-builder[data-category='" + cat + "'] .wfob_rules_common .wfob-rule-group-container table tr.wfob-rule").length;

            if (countRules == 1) {
                return;
            }

            delete this.views[ruleId];
            sender.remove();

            if ($("table[data-groupid='" + this.model.get('groupId') + "'] tbody tr").length == 0) {
                wfob_app.Events.trigger('wfob:removing-rule-group', this);
                this.trigger('wfob:remove-rule-group', this);
            }
        },
        onRemoveGroupClick: function onRemoveGroupClick(event) {
            event.preventDefault();
            wfob_app.Events.trigger('wfob:removing-rule-group', this);
            this.trigger('wfob:remove-rule-group', this);
            return false;
        }
    });
    var wfob_Rule_Item = Backbone.View.extend({
        tagName: 'tr',
        className: 'wfob-rule',
        events: {
            'click .wfob-add-rule': 'onAddClick',
            'click .wfob-remove-rule': 'onRemoveClick'
        },
        render: function render() {
            var base = this.model.get('category');
            var html = $('#wfob-rule-template-' + base).html();

            var template = _.template(html);
            this.$el.html(template(this.model.toJSON()));
            this.$el.attr('data-ruleid', this.model.get('ruleId'));
            return this;
        },
        onAddClick: function onAddClick(event) {
            event.preventDefault();
            wfob_app.Events.trigger('wfob:adding-rule', this);
            this.trigger('wfob:add-rule', this);
            return false;
        },
        onRemoveClick: function onRemoveClick(event) {
            event.preventDefault();
            wfob_app.Events.trigger('wfob:removing-rule', this);
            this.trigger('wfob:remove-rule', this);
            return false;
        }
    });
    var ruleBuilder = new wfob_Rule_Builder();
    ruleBuilder.render();
    var ruleBuilder2 = new wfob_Rule_Builder2();
    ruleBuilder2.render();
});