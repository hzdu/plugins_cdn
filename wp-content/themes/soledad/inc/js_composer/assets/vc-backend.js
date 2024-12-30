if (!window.vc) var vc = {};
!function () {
    vc.templateOptions = {
        default: {
            evaluate: /<%([\s\S]+?)%>/g,
            interpolate: /<%=([\s\S]+?)%>/g,
            escape: /<%-([\s\S]+?)%>/g
        },
        custom: {
            evaluate: /<#([\s\S]+?)#>/g,
            interpolate: /\{\{\{([\s\S]+?)\}\}\}/g,
            escape: /\{\{([^\}]+?)\}\}(?!\})/g
        }
    };
    var escapes = {
            "'": "'",
            "\\": "\\",
            "\r": "r",
            "\n": "n",
            "\u2028": "u2028",
            "\u2029": "u2029"
        },
        escapeChar = function (match) {
            return "\\" + escapes[match]
        };
    vc.template = function (text, settings) {
        settings = _.defaults({}, settings, vc.templateOptions.default);
        var matcher = RegExp([(settings.escape || /(.)^/).source, (settings.interpolate || /(.)^/).source, (settings.evaluate || /(.)^/).source].join("|") + "|$", "g"),
            index = 0,
            source = "__p+='";
        text.replace(matcher, function (match, escape, interpolate, evaluate, offset) {
            return source += text.slice(index, offset).replace(/\\|'|\r|\n|\u2028|\u2029/g, escapeChar), index = offset + match.length, escape ? source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'" : interpolate ? source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'" : evaluate && (source += "';\n" + evaluate + "\n__p+='"), match
        }), source += "';\n", settings.variable || (source = "with(obj||{}){\n" + source + "}\n"), source = "var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};\n" + source + "return __p;\n";
        var render;
        try {
            render = new Function(settings.variable || "obj", "_", source)
        } catch (e) {
            throw e.source = source, e
        }
        var template = function (data) {
                return render.call(this, data, _)
            },
            argument = settings.variable || "obj";
        return template.source = "function(" + argument + "){\n" + source + "}", template
    };
}(),
    function ($) {
        var Shortcodes = vc.shortcodes;
        window.VcPenciContainerView = vc.shortcode_view.extend({
            change_columns_layout: !1,
            events: {
                'click > .vc_controls [data-vc-control="delete"]': "deleteShortcode",
                "click > .vc_controls .penci_set_layout": "setColumns",
                'click > .vc_controls [data-vc-control="add"]': "addElement",
                'click > .vc_controls [data-vc-control="edit"]': "editElement",
                'click > .vc_controls [data-vc-control="clone"]': "clone",
                'click > .vc_controls [data-vc-control="move"]': "moveElement",
                'click > .vc_controls [data-vc-control="toggle"]': "toggleElement",
                "click > .wpb_element_wrapper .vc_controls": "openClosedRow"
            },
            convertRowColumns: function (layout) {
                var layout_split = layout.toString().split(/_/),
                    columns = Shortcodes.where({
                        parent_id: this.model.id
                    }),
                    new_columns = [],
                    new_layout = [],
                    new_width = "";

                var params = this.model.get("params"),
                    addParams = {container_layout: layout.toString()};
                mergedParams = _.extend({}, params, addParams);
                this.model.save("params", mergedParams);

                return _.each(layout_split, function (value, i) {
                    var new_column_params, new_column, column_data = _.map(value.toString().split(""), function (v, i) {
                        return parseInt(v, 10)
                    });

                    if (column_data.length > 3) {
                        new_width = column_data[0] + '' + column_data[1] + '/' + column_data[2] + '' + column_data[3];
                    } else if (column_data.length > 2) {
                        new_width = column_data[0] + '/' + column_data[1] + '' + column_data[2];
                    } else {
                        new_width = column_data[0] + '/' + column_data[1];
                    }
                    new_layout.push(new_width);

                    new_column_params = _.extend({}, _.isUndefined(columns[i]) ? {} : columns[i].get('params'),
                        {width: new_width, order: parseInt(i + 1)}),
                        vc.storage.lock(), new_column = Shortcodes.create({
                        shortcode: this.getChildTag(),
                        params: new_column_params,
                        parent_id: this.model.id
                    }), _.isObject(columns[i]) && _.each(Shortcodes.where({
                        parent_id: columns[i].id
                    }), function (shortcode) {
                        vc.storage.lock(), shortcode.save({
                            parent_id: new_column.id
                        }), vc.storage.lock(), shortcode.trigger("change_parent_id")
                    }), new_columns.push(new_column)
                }, this), layout_split.length < columns.length && _.each(columns.slice(layout_split.length), function (column) {
                    _.each(Shortcodes.where({
                        parent_id: column.id
                    }), function (shortcode) {
                        vc.storage.lock(), shortcode.save({
                            parent_id: _.last(new_columns).id
                        }), vc.storage.lock(), shortcode.trigger("change_parent_id")
                    })
                }), _.each(columns, function (shortcode) {
                    vc.storage.lock(), shortcode.destroy()
                }, this), this.model.save(), this.setActiveLayoutButton("" + layout), new_layout
            },
            changeShortcodeParams: function (model) {
                window.VcPenciContainerView.__super__.changeShortcodeParams.call(this, model), this.buildDesignHelpers(), this.setRowClasses()
            },
            setRowClasses: function () {
                var disable = this.model.getParam("disable_element"),
                    disableClass = "vc_hidden-xs vc_hidden-sm  vc_hidden-md vc_hidden-lg";
                this.disable_element_class && this.$el.removeClass(this.disable_element_class), _.isEmpty(disable) || (this.$el.addClass(disableClass), this.disable_element_class = disableClass)
            },
            designHelpersSelector: "> .penci_container_controls .column_toggle",
            buildDesignHelpers: function () {

                var css, $elementToPrepend, image, color, rowId, matches;

                var valueParam = '',
                    elWidth = this.model.getParam("el_width"),
                    elWidthCustom = this.model.getParam("penci_el_width_custom"),
                    elEnableSticky = this.model.getParam("el_enable_sticky");

                rowId = this.model.getParam("el_id");

                if (!_.isEmpty(rowId)) {
                    valueParam += "#" + rowId;
                }

                if (!_.isEmpty(elWidth)) {

                    if (!_.isEmpty(rowId)) {
                        valueParam += '|';
                    }

                    var $contentSidebarSidebar = this.$el.find("> .vc_controls .cell-12_14_14"),
                        $sidebarSidebarContent = this.$el.find("> .vc_controls .cell-14_14_12"),
                        $twoSidebar = this.$el.find("> .vc_controls .cell-14_12_14"),
                        $fourSidebar = this.$el.find("> .vc_controls .cell-14_14_14_14");

                    if ('penci-wide-content' === elWidth) {
                        valueParam += '';
                    } else if ('w1080' === elWidth && 'penci_container' === this.model.attributes.shortcode) {
                        valueParam += 'W:1080px';
                        $twoSidebar.addClass('penci-hidden');
                        $fourSidebar.addClass('penci-hidden');
                        $contentSidebarSidebar.addClass('penci-hidden');
                        $sidebarSidebarContent.addClass('penci-hidden');

                        if (this.$el.find("> .vc_controls .penci_set_layout.vc_active").hasClass('cell-14_12_14')) {
                            this.$el.find("> .vc_controls .penci_set_layout.cell-23_13").click();
                        }

                        if (this.$el.find("> .vc_controls .penci_set_layout.vc_active").hasClass('ccell-14_14_14_14')) {
                            this.$el.find("> .vc_controls .penci_set_layout.cell-23_13").click();
                        }

                    } else if ('w1170' === elWidth) {
                        valueParam += 'W:1170px';
                        $twoSidebar.addClass('penci-hidden');
                        $fourSidebar.addClass('penci-hidden');
                        $contentSidebarSidebar.addClass('penci-hidden');
                        $sidebarSidebarContent.addClass('penci-hidden');

                        if (this.$el.find("> .vc_controls .penci_set_layout.vc_active").hasClass('cell-14_12_14')) {
                            this.$el.find("> .vc_controls .penci_set_layout.cell-23_13").click();
                        }

                        if (this.$el.find("> .vc_controls .penci_set_layout.vc_active").hasClass('ccell-14_14_14_14')) {
                            this.$el.find("> .vc_controls .penci_set_layout.cell-23_13").click();
                        }
                    } else if ('w1400' === elWidth) {
                        valueParam += 'W:1400px';
                        $twoSidebar.removeClass('penci-hidden');
                        $fourSidebar.removeClass('penci-hidden');
                        $contentSidebarSidebar.removeClass('penci-hidden');
                        $sidebarSidebarContent.removeClass('penci-hidden');
                    }
                }

                if (!_.isEmpty(valueParam)) {
                    valueParam += '';
                }

                if (!_.isEmpty(elEnableSticky)) {
                    valueParam += '| Sticky';
                }

                css = this.model.getParam("css"), $elementToPrepend = this.$el.find(this.designHelpersSelector), this.$el.find("> .vc_controls .vc_row_color").remove(), this.$el.find("> .vc_controls .vc_row_image").remove(), matches = css.match(/background\-image:\s*url\(([^\)]+)\)/), matches && !_.isUndefined(matches[1]) && (image = matches[1]), matches = css.match(/background\-color:\s*([^\s\;]+)\b/), matches && !_.isUndefined(matches[1]) && (color = matches[1]), matches = css.match(/background:\s*([^\s]+)\b\s*url\(([^\)]+)\)/), matches && !_.isUndefined(matches[1]) && (color = matches[1], image = matches[2]), this.$el.find("> .vc_controls .vc_row-hash-id").remove(), _.isEmpty(valueParam) || $('<span class="vc_row-hash-id"></span>').text(valueParam).insertAfter($elementToPrepend), image && $('<span class="vc_row_image" style="background-image: url(' + image + ');" title="' + window.i18nLocale.row_background_image + '"></span>').insertAfter($elementToPrepend), color && $('<span class="vc_row_color" style="background-color: ' + color + '" title="' + window.i18nLocale.row_background_color + '"></span>').insertAfter($elementToPrepend)
            },
            addElement: function (e) {
                e && e.preventDefault(), Shortcodes.create({
                    shortcode: this.getChildTag(),
                    params: {},
                    parent_id: this.model.id
                }), this.setActiveLayoutButton(), this.$el.removeClass("vc_collapsed-row")
            },
            getChildTag: function () {
                return "penci_container_inner" === this.model.get("shortcode") ? "penci_column_inner" : "penci_column"
            },
            sortingSelector: "> [data-element_type=vc_column], > [data-element_type=vc_column_inner]",
            sortingSelectorCancel: ".vc-non-draggable-column",
            setSorting: function () {
                var _this = this;
                1 < this.$content.find(this.sortingSelector).length ? this.$content.removeClass("wpb-not-sortable").sortable({
                    forcePlaceholderSize: !0,
                    placeholder: "widgets-placeholder-column",
                    tolerance: "pointer",
                    cursor: "move",
                    items: this.sortingSelector,
                    cancel: this.sortingSelectorCancel,
                    distance: .5,
                    start: function (event, ui) {
                        $("#visual_composer_content").addClass("vc_sorting-started"), ui.placeholder.width(ui.item.width())
                    },
                    stop: function (event, ui) {
                        $("#visual_composer_content").removeClass("vc_sorting-started")
                    },
                    update: function () {
                        var $columns = $(_this.sortingSelector, _this.$content);
                        $columns.each(function () {
                            var model = $(this).data("model"),
                                index = $(this).index();
                            model.set("order", index), $columns.length - 1 > index && vc.storage.lock(), model.save()
                        })
                    },
                    over: function (event, ui) {
                        ui.placeholder.css({
                            maxWidth: ui.placeholder.parent().width()
                        }), ui.placeholder.removeClass("vc_hidden-placeholder")
                    },
                    beforeStop: function (event, ui) {
                    }
                }) : (this.$content.hasClass("ui-sortable") && this.$content.sortable("destroy"), this.$content.addClass("wpb-not-sortable"))
            },
            validateCellsList: function (cells) {
                var b, return_cells = [],
                    split = cells.replace(/\s/g, "").split("+");
                return 12 === _.reduce(_.map(split, function (c) {
                    if (c.match(/^(vc_)?span\d?$/)) {
                        var converted_c = vc_convert_column_span_size(c);
                        return !1 === converted_c ? 1e3 : (b = converted_c.split(/\//), return_cells.push(b[0] + "" + b[1]), 12 * parseInt(b[0], 10) / parseInt(b[1], 10))
                    }
                    return c.match(/^[1-9]|1[0-2]\/[1-9]|1[0-2]$/) ? (b = c.split(/\//), return_cells.push(b[0] + "" + b[1]), 12 * parseInt(b[0], 10) / parseInt(b[1], 10)) : 1e4
                }), function (num, memo) {
                    return memo += num
                }, 0) && return_cells.join("_")
            },
            setActiveLayoutButton: function (column_layout) {
                column_layout || (column_layout = _.map(vc.shortcodes.where({
                    parent_id: this.model.get("id")
                }), function (model) {
                    var width = model.getParam("width");
                    return width ? width.replace(/\//, "") : "11"
                }).join("_")), this.$el.find("> .vc_controls .vc_active").removeClass("vc_active");
                var $button = this.$el.find('> .vc_ [data-cells-mask="' + vc_get_column_mask(column_layout) + '"] [data-cells="' + column_layout + '"], > .vc_controls [data-cells-mask="' + vc_get_column_mask(column_layout) + '"][data-cells="' + column_layout + '"]');
                $button.length ? $button.addClass("vc_active") : this.$el.find("> .vc_controls [data-cells-mask=custom]").addClass("vc_active")
            },
            layoutEditor: function () {
                return _.isUndefined(vc.row_layout_editor) && (vc.row_layout_editor = new vc.RowLayoutUIPanelBackendEditor({
                    el: $("#vc_ui-panel-row-layout")
                })), vc.row_layout_editor
            },
            setColumns: function (e) {
                _.isObject(e) && e.preventDefault();
                var $button = $(e.currentTarget);
                $button.is(".vc_active") || (this.change_columns_layout = !0, _.defer(function (view, cells) {
                    view.convertRowColumns(cells)
                }, this, $button.data("cells")))
                this.$el.removeClass("vc_collapsed-row")
            },
            sizeRows: function () {
                var max_height = 45;
                $("> .wpb_vc_column, > .wpb_vc_column_inner", this.$content).each(function () {
                    var content_height = $(this).find("> .wpb_element_wrapper > .wpb_column_container").css({
                        minHeight: 0
                    }).height();
                    content_height > max_height && (max_height = content_height)
                }).each(function () {
                    $(this).find("> .wpb_element_wrapper > .wpb_column_container").css({
                        minHeight: max_height
                    })
                })
            },
            ready: function (e) {
                return window.VcPenciContainerView.__super__.ready.call(this, e), this
            },
            checkIsEmpty: function () {
                window.VcPenciContainerView.__super__.checkIsEmpty.call(this), this.setSorting()
            },
            changedContent: function (view) {
                if (this.change_columns_layout) return this;
                this.setActiveLayoutButton()
            },
            moveElement: function (e) {
                e.preventDefault()
            },
            toggleElement: function (e) {
                e && e.preventDefault(), this.$el.toggleClass("vc_collapsed-row")
            },
            openClosedRow: function (e) {
                this.$el.removeClass("vc_collapsed-row")
            },
            remove: function () {
                this.$content && this.$content.data("uiSortable") && this.$content.sortable("destroy"), this.$content && this.$content.data("uiDroppable") && this.$content.droppable("destroy"), delete vc.app.views[this.model.id], window.VcPenciContainerView.__super__.remove.call(this)
            }
        });
        window.VcPenciVideoList = vc.shortcode_view.extend({

            changeShortcodeParams: function (model) {
                var data = {
                    action: 'penci_save_video_playlist',
                    videoList: this.model.getParam("videos_list"),
                    shortcodeId: this.model.getParam("video_shortcode_id"),
                    nonce: PENCILOCALIZE.nonce
                };

                $.post(PENCILOCALIZE.ajaxUrl, data, function (response) {
                });
            },
            deleteShortcode: function (e) {

                _.isObject(e) && e.preventDefault(), !0 === confirm(window.i18nLocale.press_ok_to_delete_section) && this.model.destroy();

                var data = {
                    action: 'penci_remove_video_playlist',
                    shortcodeId: this.model.getParam("video_shortcode_id"),
                    nonce: PENCILOCALIZE.nonce
                };

                $.post(PENCILOCALIZE.ajaxUrl, data, function (response) {
                });
            },
        });
        window.VcPenciVideoList = vc.shortcode_view.extend({
            render: function () {
                var params = this.model.get('params');

                if (!params.block_id) {
                    params.block_id = this.model.get("shortcode") + '-' + (+new Date() + Math.floor(Math.random() * 11));

                    this.model.save('params', params);
                }
                this.id = 'block-' + params.block_id;
                this.$el.attr('id', this.id);

                return window.VcColumnView.__super__.render.call(this), this.current_column_width = this.model.get("params").width || "1/1", this.$el.attr("data-width", this.current_column_width), this.setEmpty(), this
            },
            cloneModel: function (model, parent_id, save_order) {
                var shortcodes_to_resort = [],
                    randomID = model.get("shortcode") + '-' + (+new Date() + Math.floor(Math.random() * 11)),
                    new_order = _.isBoolean(save_order) && save_order === true ? model.get('order') : parseFloat(model.get('order')) + vc.clone_index,
                    new_params = _.extend({}, model.get('params'));

                _.extend(new_params, {block_id: +randomID});
                var model_clone = Shortcodes.create({
                    shortcode: model.get('shortcode'),
                    parent_id: parent_id,
                    order: new_order,
                    cloned: true,
                    cloned_from: model.toJSON(),
                    params: new_params
                });
                _.each(Shortcodes.where({parent_id: model.id}), function (shortcode) {
                    this.cloneModel(shortcode, model_clone.id, true);
                }, this);


                return model_clone;
            },
            changeShortcodeParams: function (model) {
                var data = {
                    action: 'penci_save_video_playlist',
                    videoList: this.model.getParam("videos_list"),
                    shortcodeId: this.model.getParam("block_id"),
                    nonce: PENCILOCALIZE.nonce
                };

                $.post(PENCILOCALIZE.ajaxUrl, data, function (response) {
                });
            },
            deleteShortcode: function (e) {

                _.isObject(e) && e.preventDefault(), !0 === confirm(window.i18nLocale.press_ok_to_delete_section) && this.model.destroy();

                var data = {
                    action: 'penci_remove_video_playlist',
                    shortcodeId: this.model.getParam("block_id"),
                    nonce: PENCILOCALIZE.nonce
                };

                $.post(PENCILOCALIZE.ajaxUrl, data, function (response) {
                });
            },
        });
        window.VcPenciShortcodeView = vc.shortcode_view.extend({
            render: function () {
                var params = this.model.get('params');

                if (!params.block_id || this.model.get('cloned')) {
                    params.block_id = this.model.get("shortcode") + '-' + (+new Date() + Math.floor(Math.random() * 11));

                    this.model.save('params', params);
                }
                this.id = 'block-' + params.block_id;
                this.$el.attr('id', this.id);

                return window.VcColumnView.__super__.render.call(this), this.current_column_width = this.model.get("params").width || "1/1", this.$el.attr("data-width", this.current_column_width), this.setEmpty(), this
            },
            cloneModel: function (model, parent_id, save_order) {
                var shortcodes_to_resort = [],
                    randomID = model.get("shortcode") + '-' + (+new Date() + Math.floor(Math.random() * 11)),
                    new_order = _.isBoolean(save_order) && save_order === true ? model.get('order') : parseFloat(model.get('order')) + vc.clone_index,
                    new_params = _.extend({}, model.get('params'));

                _.extend(new_params, {block_id: +randomID});
                var model_clone = Shortcodes.create({
                    shortcode: model.get('shortcode'),
                    parent_id: parent_id,
                    order: new_order,
                    cloned: true,
                    cloned_from: model.toJSON(),
                    params: new_params
                });
                _.each(Shortcodes.where({parent_id: model.id}), function (shortcode) {
                    this.cloneModel(shortcode, model_clone.id, true);
                }, this);


                return model_clone;
            }
        });
        vc.atts.penci_google_fonts = {
            parse: function (param) {
                var string_pieces, $field = this.content().find(".wpb_vc_param_value[name=" + param.param_name + "]"),
                    $block = $field.parent(),
                    options = {};
                return options.font_family = $block.find(".vc_google_fonts_form_field-font_family-select > option:selected").val(), options.font_style = $block.find(".vc_google_fonts_form_field-font_style-select > option:selected").val(), string_pieces = _.map(options, function (value, key) {
                    if (_.isString(value) && 0 < value.length) return key + ":" + encodeURIComponent(value)
                }), $.grep(string_pieces, function (value) {
                    return _.isString(value) && 0 < value.length
                }).join("|")
            },
            init: function (param, $field) {

            }
        };
    }(window.jQuery);

jQuery(function ($) {
    'use strict';
    $(document).on('click', '.penci-image-select', function () {
        var $this = $(this);

        $this.parent().siblings('.wpb_vc_param_value').attr("value", $this.data('value')).change();
        $this.addClass('penci-image-select--active')
            .siblings().removeClass('penci-image-select--active');
    });

    $(document).on('change', '.penci-number-input, .penci-number-suffix', function () {
        var $number = $(this).parent(),
            input = $number.find('.penci-number-input').val(),
            unit = $number.find('.penci-number-suffix').val();

        $number.find('.wpb_vc_param_value').val(input + unit);
    });
});
