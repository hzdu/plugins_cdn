;(function (root, factory) {
    // AMD.
    if (typeof define === "function" && define.amd)
        define(["jquery"], factory);

    // Node, CommonJS-like.
    else if (typeof exports === "object")
        factory(require("jquery"));

    // Browser globals.
    else
        factory(root.jQuery);
}(this, function ($) {
    // Strict mode.
    "use strict";

    // @todo
    //      - markup: datalist > option
    //      - markup: select > optgroup > option

    /**
     * Initialize GridPicker.
     *
     * @param  {HTMLSelectElement} element select element node
     * @param  {Object}            options see GridPicker.prototype._defaults
     * @return {Void}
     */
    var GridPicker = function (element, options) {
        if (!(this instanceof GridPicker))
            throw "GridPicker: GridPicker is a constructor.";
        if (!(element instanceof HTMLSelectElement))
            throw "GridPicker: element argument must be of type HTMLSelectElement.";

        this._element = element;
        this._options = options;

        this._init();
    }

    /**
     * GridPicker prototype.
     *
     * @type {Object}
     */
    GridPicker.prototype = {
        /**
         * Default options.
         *
         * @type {Object}
         */
        _defaults: {
            /**
             * Render method.
             *
             * If not defined (Null) the default render
             * method will be used. The first argument
             * in function is HTMLOptionElement, and the
             * result should be any HTMLElement.
             *
             * Example usage:
             *
             * $(selector).gridPicker({
             *     render: function(element) {
             *         return $("<a />")
             *             .attr("href", "#")
             *             .attr("title", label)
             *             .text(label)
             *             .get(0);
             *     }
             * }
             *
             * @type {Function|Null}
             */
            render: null,

            /**
             * Can item be selected.
             *
             * If not defined (Null) the default canSelect
             * method will be used. It can be True, False
             * or Function. The first argument in function
             * is HTMLOptionElement, and the result should
             * be True|False.
             *
             * Example usage:
             *
             * $(selector).gridPicker({
             *     canSelect: function(element) {
             *         return !$(element).is(":disabled");
             *     }
             * }
             *
             * @type {Function|Boolean|Null}
             */
            canSelect: null,

            /**
             * Can item be unselected.
             *
             * If not defined (Null) the default canUnselect
             * method will be used. It can be True, False
             * or Function. The first argument in function
             * is HTMLOptionElement, and the result should
             * be True|False.
             *
             * Example usage:
             *
             * $(selector).gridPicker({
             *     canUnselect: function(element) {
             *         return typeof this._$ui.element.attr("multiple") !== "undefined";
             *     }
             * }
             *
             * @type {Function|Boolean|Null}
             */
            canUnselect: null,
        },

        /**
         * Constructor.
         *
         * @return {Void}
         */
        _init: function () {
            // Already instanced.
            if ($(this._element).data("jquery-grid-picker"))
                return;

            // Init all.
            this._initElement();
            this._initWidget();
            this._initOptions();
            this._initUi();
            this._initObserver();

            // Render items.
            this.refresh();
        },

        /**
         * Initialize element.
         *
         * @return {Void}
         */
        _initElement: function () {
            this._element = $(this._element)
                .addClass("jquery-grid-picker")
                .off(".jquerygridpicker")
                .on("change.jquerygridpicker", this._handleElementChange.bind(this))
                .data("jquery-grid-picker", this)
                .get(0);
        },

        /**
         * Initialize widget.
         *
         * @return {Void}
         */
        _initWidget: function () {
            this._widget = $("<ul />")
                .addClass("jquery-grid-picker-widget")
                .on("click.jquerygridpicker", ".jquery-grid-picker-item", this._handleItemClick.bind(this))
                .insertAfter(this.element)
                .get(0);
        },

        /**
         * Initialize options.
         *
         * @return {Void}
         */
        _initOptions: function () {
            this._options = $.extend({}, this._defaults, this._options);

            // Delete invalid option keys.
            for (var key in this._options) {
                if (!this._defaults.hasOwnProperty(key))
                    delete this._options[key];
            }
        },

        /**
         * Initialize ui.
         *
         * @return {Void}
         */
        _initUi: function () {
            this._$ui = {
                element: $(this.element),
                widget: $(this.widget),
                items: $(null),
            };
        },

        /**
         * Initialize mutation observer.
         *
         * @return {Void}
         */
        _initObserver: function () {
            this._observer = null;
            if (typeof MutationObserver === "undefined")
                return;

            this._observer = new MutationObserver(this._handleMutation.bind(this));
            this._observer.observe(this.element, {
                attributes: true,
                childList: true,
                subtree: true,
                characterData: true,
            });
        },

        /**
         * Destructor.
         *
         * @return {Void}
         */
        destroy: function () {
            if (this._observer)
                this._observer.disconnect();

            this._$ui.element
                .off(".jquerygridpicker")
                .removeClass("jquery-grid-picker")
                .removeData("jquery-grid-picker");
            this._$ui.widget
                .remove();

            this._$ui = null;
            this._observer = null;
            this._options = null;
            this._widget = null;
            this._element = null;
        },

        /**
         * Element property getter.
         *
         * @return {HTMLSelectElement}
         */
        get element() {
            return this._element;
        },

        /**
         * Widget property getter.
         *
         * @return {HTMLElement}
         */
        get widget() {
            return this._widget;
        },

        /**
         * Get option.
         *
         * @param  {String} key
         * @return {Mixed}
         */
        getOption: function (key) {
            return this._options[key];
        },

        /**
         * Set option.
         *
         * @param  {String} key
         * @param  {Mixed}  value
         * @return {Void}
         */
        setOption: function (key, value) {
            if (this._defaults.hasOwnProperty(key))
                this._options[key] = value;
        },

        /**
         * Element value.
         *
         * @return {String}
         */
        value: function () {
            return this._$ui.element.val();
        },

        /**
         * Reset element value to null.
         *
         * @return {Void}
         */
        reset: function () {
            this._$ui.element.val(null);
        },

        /**
         * Refresh (render) option list.
         *
         * @return {Void}
         */
        refresh: function () {
            this._$ui.widget.empty();
            this._$ui.items = $(null);

            this._$ui.element
                .find("option")
                .each(function (index, element) {
                    this._syncItem(element);
                }.bind(this));

            this._handleElementChange();
        },

        /**
         * Sync select option and widget list item.
         *
         * @param  {HTMLOptionElement} element
         * @return {Void}
         */
        _syncItem: function (element) {
            // Clear old element widget item (if exists).
            var $element = $(element),
                attached = !!$element.closest(this.element).length,
                value = $element.val(),
                item = this._$ui.items.filter('[data-jquery-grid-picker-value="' + this._selectorEscape(value) + '"]').get(0);
            this._$ui.items = this._$ui.items.not(item);
            $(item).remove();

            // Element is detached, nothing else to do here.
            if (!attached)
                return;

            // Render item content from render option.
            var content = null,
                render = this.getOption("render");
            if (typeof render === "function")
                content = render.call(this, element);
            else
                content = this._renderItemContent(element);
            if (!content)
                return;

            var index = $element.index(),
                selected = $element.prop("selected"),
                hidden = $element.css("display") === "none",
                disabled = $element.is(":disabled");

            // Render new element widget item.
            item = this._renderItemWrapper(element);
            $(item)
                .addClass("jquery-grid-picker-item")
                .addClass("jquery-grid-picker-item-" + (selected ? "selected" : "temp"))
                .addClass("jquery-grid-picker-item-" + (hidden ? "hidden" : "temp"))
                .addClass("jquery-grid-picker-item-" + (disabled ? "disabled" : "temp"))
                .removeClass("jquery-grid-picker-item-temp")
                .attr("data-jquery-grid-picker-value", value)
                .removeAttr("data-jquery-grid-picker-item-temp");
            $(content)
                .addClass("jquery-grid-picker-item-content")
                .appendTo(item);

            // ...and append it to widget.
            if (!index)
                this._$ui.widget.prepend(item);
            else
                this._$ui.widget.find(".jquery-grid-picker-item:nth-child(" + index + ")").after(item);

            // Refresh ui.
            this._$ui.items = this._$ui.items
                .add(item);
        },

        /**
         * Render list item wrapper.
         *
         * @param  {HTMLOptionElement} element
         * @return {HTMLElement}
         */
        _renderItemWrapper: function (element) {
            return $("<li />").get(0);
        },

        /**
         * Render list item (default) content:
         * this is a render fallback if no render
         * option is specified.
         *
         * @param  {HTMLOptionElement} element
         * @return {HTMLElement}
         */
        _renderItemContent: function (element) {
            var $element = $(element),
                label = $element.attr("label") || $element.text();
            return $("<a />")
                .attr("href", "#")
                .attr("title", label)
                .attr("data-tippy-content", label)
                .attr("draggable", "false")
                .text(label)
                .get(0);
        },

        /**
         * Can select item.
         *
         * @param  {HTMLOptionElement} element
         * @return {Boolean}
         */
        _canSelect: function (element) {
            var option = this.getOption("canSelect");
            if (typeof option === "boolean")
                return option;
            else if (typeof option === "function")
                return !!option.call(this, element);

            return !$(element).is(":disabled");
        },

        /**
         * Can unselect item.
         *
         * @param  {HTMLOptionElement} element
         * @return {Boolean}
         */
        _canUnselect: function (element) {
            var option = this.getOption("canUnselect");
            if (typeof option === "boolean")
                return option;
            else if (typeof option === "function")
                return !!option.call(this, element);

            return this.element.hasAttribute("multiple");
        },

        /**
         * Escape string so we can use it as css selector.
         *
         * @param  {String} str
         * @return {String}
         */
        _selectorEscape: function (str) {
            return str.toString()
                .replace(/"/g, "\\\"");
        },

        /**
         * Mutation observer callback:
         * sync select option and widget list item.
         *
         * @param  {Array} e
         * @return {Void}
         */
        _handleMutation: function (e) {
            // Element list that needs sync. It would be easier
            // to use jQuery object here, but jQuery's list of
            // elements is sorted. We need to apply sync method
            // on elements as provided in MutationRecord list.
            var elements = [],
                addToElements = function (element) {
                    $(element)
                        .closest("option")
                        .each(function (index, value) {
                            if (elements.indexOf(value) === -1)
                                elements.push(value);
                        });
                };

            // Iterate mutation record list and find elements
            // that need sync.
            e.forEach(function (record) {
                if (record.type === "childList") {
                    addToElements(record.removedNodes);
                    addToElements(record.addedNodes);
                } else if ((record.type === "attributes" && record.target !== this.element) || (record.type === "characterData"))
                    addToElements(record.target);
            }.bind(this));

            // Sync mutated elements.
            elements.forEach(function (element) {
                this._syncItem(element);
            }.bind(this));
        },

        /**
         * Element change event handler.
         *
         * @param  {Event} e
         * @return {Void}
         */
        _handleElementChange: function (e) {
            var value = this.value(),
                filter = null;

            if (typeof value === "string")
                filter = '[data-jquery-grid-picker-value="' + this._selectorEscape(value) + '"]';
            else if (value instanceof Array)
                filter = value
                    .map(function (item) {
                        return '[data-jquery-grid-picker-value="' + this._selectorEscape(item) + '"]';
                    }.bind(this))
                    .join(",");

            this._$ui.items
                .removeClass("jquery-grid-picker-item-selected")
                .filter(filter)
                .addClass("jquery-grid-picker-item-selected");
        },

        /**
         * Item click event handler.
         *
         * @param  {Event} e
         * @return {Void}
         */
        _handleItemClick: function (e) {
            e.preventDefault();

            var target = e.currentTarget,
                value = $(target).attr("data-jquery-grid-picker-value") || "",
                $option = this._$ui.element.find('option[value="' + this._selectorEscape(value) + '"]'),
                option = $option.get(0),
                isSelected = $option.is(":selected");

            // Unselect selected.
            if (isSelected && this._canUnselect(option)) {
                // Non multiple select elements can not have all the
                // options unselected (it will default to first option),
                // so we will reset it's value.
                var length = this._$ui.element.find("option:selected").length;
                if (length - 1 === 0)
                    this.reset();
                else
                    $option.prop("selected", false);
            }

            // Select unselected.
            else if (!isSelected && this._canSelect(option))
                $option.prop("selected", true);

            // Select/unselect fail, return.
            else
                return;

            // Trigger change and let change event handler
            // do the rest.
            this._$ui.element
                .trigger("change");
        },
    };

    // Re-assign constuctor.
    GridPicker.prototype.constructor = GridPicker;

    /**
     * jQuery gridPicker plugin:
     * display HTMLSelectElement as grid with clickable
     * (select/unselect) items.
     *
     * Instance new GridPicker on element(s)
     * >> $(selector).gridPicker(options);
     *
     * ...execute GridPicker method
     * >> $(selector)
     *        .gridPicker("setOption", "canUnselect", true)
     *        .gridPicker("reset");
     *
     * ...or access GridPicker property
     * >> var widget = $(selector).gridPicker("widget");
     *
     * @param  {Mixed} options
     * @return {Mixed}
     */
    $.fn.gridPicker = function (options) {
        var classObject = GridPicker,
            className = "GridPicker",
            store = "jquery-grid-picker",
            args = Array.prototype.slice.call(arguments, 1),
            $this = $(this);

        // Iterate all
        $this.each(function () {
            // Get instance (or create new one).
            var instance = $(this).data(store);
            if (!instance)
                instance = new classObject(this, typeof options === "object" ? options : {});

            // Access properties.
            if (typeof options === "string") {
                var exists = options in instance,
                    isPrivate = options.substr(0, 1) === "_",
                    type = typeof instance[options];

                // Property is function, execute it.
                if (exists && !isPrivate && type === "function" && instance[options] !== Object.prototype[options] && options !== "constructor") {
                    var result = instance[options].apply(instance, args);

                    // Function returned result (non undefined), store
                    // result, exit loop.
                    if (typeof result !== "undefined") {
                        $this = result;
                        return false;
                    }
                }

                // Property as getter (get, store result, exit loop).
                else if (exists && !isPrivate && type !== "function" && !args.length) {
                    $this = instance[options];
                    return false;
                }

                // Property as setter (set, continue).
                else if (exists && !isPrivate && type !== "function") {
                    instance[options] = args[0];
                }

                // Invalid option argument.
                else {
                    throw className + ": " + options + " is not a valid " + className + " property.";
                }
            }
        });

        // ...finally.
        return $this;
    };
}));
