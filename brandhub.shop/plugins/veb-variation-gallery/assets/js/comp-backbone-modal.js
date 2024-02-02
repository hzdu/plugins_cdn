/**
 * WooCommerce Additional Variation Images And Swatches Pro - Addon 2
 *
 * This source file is subject to the GNU General Public License v3.0
 * that is bundled with this package in the file license.txt.
 * It is also available through the world-wide-web at this URL:
 * http://www.gnu.org/licenses/gpl-3.0.html
 * If you did not receive a copy of the license and are unable to
 * obtain it through the world-wide-web, please send an email
 * to support@innovativewp.org so we can send you a copy immediately.
 *
 * @author    InnovativeWP
 * @copyright Copyright (c) 2021, InnovativeWP.
 * @license   http://www.gnu.org/licenses/gpl-3.0.html GNU General Public License v3.0
 */
(function ($, Backbone, _) {
    'use strict';


    $.fn.COMPBackboneModal = function (options) {
        return this.each(function () {
            new $.COMPBackboneModal($(this), options);
        });
    };

    $.COMPBackboneModal = function (element, options) {
        // Set settings
        var settings = $.extend({}, $.COMPBackboneModal.defaultOptions, options);

        if (settings.template) {
            new $.COMPBackboneModal.View({
                target: settings.template,
                string: settings.data
            });
        }
    };

    $.COMPBackboneModal.defaultOptions = {
        template: '',
        data: {}
    };

    $.COMPBackboneModal.View = Backbone.View.extend({
        tagName: 'div',
        id: 'comp-backbone-modal-dialog',
        _target: undefined,
        _string: undefined,
        events: {
            'click .modal-close': 'closeButton',
            'click #btn-ok': 'addButton',
            'click #send-ajax': 'sendAjax',
            'touchstart #btn-ok': 'addButton',
            'keydown': 'keyboardActions',
            'change :radio': 'optionChange'
        },
        resizeContent: function resizeContent() {
            var $content = $('.comp-backbone-modal-content').find('article');
            var max_h = $(window).height() * 0.75;

            $content.css({
                'max-height': max_h + 'px'
            });
        },
        initialize: function initialize(data) {
            var view = this;
            this._target = data.target;
            this._string = data.string;
            _.bindAll(this, 'render');
            this.render();

            $(window).resize(function () {
                view.resizeContent();
            });
        },
        render: function render() {
            var template = wp.template(this._target);

            this.$el.append(template(this._string));

            $(document.body).css({
                'overflow': 'hidden'
            }).append(this.$el);

            this.resizeContent();
            this.$('.comp-backbone-modal-content').attr('tabindex', '0').focus();


            $(document.body).trigger('comp_backbone_modal_loaded', this._target);
        },
        closeButton: function closeButton(e) {
            e.preventDefault();
            $(document.body).trigger('comp_backbone_modal_before_remove', this._target);
            this.undelegateEvents();
            $(document).off('focusin');
            $(document.body).css({
                'overflow': 'auto'
            });
            this.remove();
            $(document.body).trigger('comp_backbone_modal_removed', this._target);
        },

        addButton: function addButton(e) {
            $(document.body).trigger('comp_backbone_modal_response', [this._target, this.getFormData()]);
            this.closeButton(e);
        },

        sendAjax: function sendAjax(event) {
            var _this = this;

            event.preventDefault();

            var form = this.getFormData();
            var data = this._string;

            if (typeof form['reason_type'] === 'undefined') {
                this.closeButton(event);
                return;
            }

            $(event.target).prop('disabled', true).text($(event.target).data('deactivating')).next().addClass('visible');

            wp.ajax.send(form.action, {
                data: form,
                success: function success(response) {
                    window.location.replace(data.deactivate_link);
                    _this.closeButton(event);
                },
                error: function error() {
                    console.error('Deactivation Not logged.');
                    window.location.replace(data.deactivate_link);
                    _this.closeButton(event);
                }
            });
        },

        optionChange: function optionChange(event) {

            $(event.target).closest('.feedback-dialog-form-body').find('.feedback-text').prop('disabled', true).hide();

            $(event.target).nextAll('.feedback-text').prop('disabled', false).show().focus();
        },

        getFormData: function getFormData() {
            var data = {};

            $(document.body).trigger('comp_backbone_modal_before_update', this._target);

            $.each($('form', this.$el).serializeArray(), function (index, item) {
                if (item.name.indexOf('[]') !== -1) {
                    item.name = item.name.replace('[]', '');
                    data[item.name] = $.makeArray(data[item.name]);
                    data[item.name].push(item.value);
                } else {
                    data[item.name] = item.value;
                }
            });

            return data;
        },
        keyboardActions: function keyboardActions(e) {
            var button = e.keyCode || e.which;

            // Enter key
            if (13 === button && !(e.target.tagName && (e.target.tagName.toLowerCase() === 'input' || e.target.tagName.toLowerCase() === 'textarea'))) {
                this.addButton(e);
            }

            // ESC key
            if (27 === button) {
                this.closeButton(e);
            }
        }
    });
})(jQuery, Backbone, _);