(function (factory) {
  
    if (typeof define === "function" && define.amd) { 
        define(["jquery"], factory);
    } else if (typeof exports === "object") { 
        var jQuery = require("jquery");
        module.exports = factory(jQuery);
    } else { 
        factory(window.jQuery || window.Zepto || window.$); 
    }

}(function ($) {
    "use strict";

    var rCRLF = /\r?\n/g;
    var rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i;
    var rsubmittable = /^(?:input|select|textarea|keygen)/i;
    var rcheckableType = /^(?:checkbox|radio)$/i;

    $.fn.serializeJSON = function (options) {
        var f = $.serializeJSON;
        var $form = this; 
        var opts = f.setupOpts(options); 
        var typeFunctions = $.extend({}, opts.defaultTypes, opts.customTypes);
        var serializedArray = f.serializeArray($form, opts);
        var serializedObject = {};
        $.each(serializedArray, function (_i, obj) {

            var nameSansType = obj.name;
            var type = $(obj.el).attr("data-value-type");

            if (!type && !opts.disableColonTypes) { 
                var p = f.splitType(obj.name); 
                nameSansType = p[0];
                type = p[1];
            }
            if (type === "skip") {
                return; 
            }
            if (!type) {
                type = opts.defaultType;
            }

            var typedValue = f.applyTypeFunc(obj.name, obj.value, type, obj.el, typeFunctions); 

            if (!typedValue && f.shouldSkipFalsy(obj.name, nameSansType, type, obj.el, opts)) {
                return; 
            }

            var keys = f.splitInputNameIntoKeysArray(nameSansType);
            f.deepSet(serializedObject, keys, typedValue, opts);
        });
        return serializedObject;
    };

    $.serializeJSON = {
        defaultOptions: {}, 

        defaultBaseOptions: { 
            checkboxUncheckedValue: undefined, 
            useIntKeysAsArrayIndex: false, 

            skipFalsyValuesForTypes: [], 
            skipFalsyValuesForFields: [], 

            disableColonTypes: false, 
            customTypes: {}, 
            defaultTypes: {
                "string":  function(str) { return String(str); },
                "number":  function(str) { return Number(str); },
                "boolean": function(str) { var falses = ["false", "null", "undefined", "", "0"]; return falses.indexOf(str) === -1; },
                "null":    function(str) { var falses = ["false", "null", "undefined", "", "0"]; return falses.indexOf(str) === -1 ? str : null; },
                "array":   function(str) { return JSON.parse(str); },
                "object":  function(str) { return JSON.parse(str); },
                "skip":    null 
            },
            defaultType: "string",
        },

        setupOpts: function(options) {
            if (options == null) options = {};
            var f = $.serializeJSON;

            var validOpts = [
                "checkboxUncheckedValue",
                "useIntKeysAsArrayIndex",

                "skipFalsyValuesForTypes",
                "skipFalsyValuesForFields",

                "disableColonTypes",
                "customTypes",
                "defaultTypes",
                "defaultType"
            ];
            for (var opt in options) {
                if (validOpts.indexOf(opt) === -1) {
                    throw new  Error("serializeJSON ERROR: invalid option '" + opt + "'. Please use one of " + validOpts.join(", "));
                }
            }

            return $.extend({}, f.defaultBaseOptions, f.defaultOptions, options);
        },

        serializeArray: function($form, opts) {
            if (opts == null) { opts = {}; }
            var f = $.serializeJSON;

            return $form.map(function() {
                var elements = $.prop(this, "elements"); 
                return elements ? $.makeArray(elements) : this;

            }).filter(function() {
                var $el = $(this);
                var type = this.type;

                return this.name && 
                    !$el.is(":disabled") && 
                    rsubmittable.test(this.nodeName) && !rsubmitterTypes.test(type) && 
                    (this.checked || !rcheckableType.test(type) || f.getCheckboxUncheckedValue($el, opts) != null); 

            }).map(function(_i, el) {
                var $el = $(this);
                var val = $el.val();
                var type = this.type; 

                if (val == null) {
                    return null;
                }

                if (rcheckableType.test(type) && !this.checked) {
                    val = f.getCheckboxUncheckedValue($el, opts);
                }

                if (isArray(val)) {
                    return $.map(val, function(val) {
                        return { name: el.name, value: val.replace(rCRLF, "\r\n"), el: el };
                    } );
                }

                return { name: el.name, value: val.replace(rCRLF, "\r\n"), el: el };

            }).get();
        },

        getCheckboxUncheckedValue: function($el, opts) {
            var val = $el.attr("data-unchecked-value");
            if (val == null) {
                val = opts.checkboxUncheckedValue;
            }
            return val;
        },

        applyTypeFunc: function(name, strVal, type, el, typeFunctions) {
            var typeFunc = typeFunctions[type];
            if (!typeFunc) { 
                throw new Error("serializeJSON ERROR: Invalid type " + type + " found in input name '" + name + "', please use one of " + objectKeys(typeFunctions).join(", "));
            }
            return typeFunc(strVal, el);
        },

        splitType : function(name) {
            var parts = name.split(":");
            if (parts.length > 1) {
                var t = parts.pop();
                return [parts.join(":"), t];
            } else {
                return [name, ""];
            }
        },

        shouldSkipFalsy: function(name, nameSansType, type, el, opts) {
            var skipFromDataAttr = $(el).attr("data-skip-falsy");
            if (skipFromDataAttr != null) {
                return skipFromDataAttr !== "false"; 
            }

            var optForFields = opts.skipFalsyValuesForFields;
            if (optForFields && (optForFields.indexOf(nameSansType) !== -1 || optForFields.indexOf(name) !== -1)) {
                return true;
            }

            var optForTypes = opts.skipFalsyValuesForTypes;
            if (optForTypes && optForTypes.indexOf(type) !== -1) {
                return true;
            }

            return false;
        },

        splitInputNameIntoKeysArray: function(nameWithNoType) {
            var keys = nameWithNoType.split("["); 
            keys = $.map(keys, function (key) { return key.replace(/\]/g, ""); }); 
            if (keys[0] === "") { keys.shift(); } 
            return keys;
        },

        deepSet: function (o, keys, value, opts) {
            if (opts == null) { opts = {}; }
            var f = $.serializeJSON;
            if (isUndefined(o)) { throw new Error("ArgumentError: param 'o' expected to be an object or array, found undefined"); }
            if (!keys || keys.length === 0) { throw new Error("ArgumentError: param 'keys' expected to be an array with least one element"); }

            var key = keys[0];

            if (keys.length === 1) {
                if (key === "") { 
                    o.push(value);
                } else {
                    o[key] = value; 
                }
                return;
            }

            var nextKey = keys[1]; 
            var tailKeys = keys.slice(1); 

            if (key === "") { 
                var lastIdx = o.length - 1;
                var lastVal = o[lastIdx];

                
                if (isObject(lastVal) && isUndefined(f.deepGet(lastVal, tailKeys))) {
                    key = lastIdx; 
                } else {
                    key = lastIdx + 1; 
                }
            }

            if (nextKey === "") { 
                if (isUndefined(o[key]) || !isArray(o[key])) {
                    o[key] = []; 
                }
            } else {
                if (opts.useIntKeysAsArrayIndex && isValidArrayIndex(nextKey)) { 
                    if (isUndefined(o[key]) || !isArray(o[key])) {
                        o[key] = [];
                    }
                } else { 
                    if (isUndefined(o[key]) || !isObject(o[key])) {
                        o[key] = {}; 
                    }
                }
            }

            f.deepSet(o[key], tailKeys, value, opts);
        },

        deepGet: function (o, keys) {
            var f = $.serializeJSON;
            if (isUndefined(o) || isUndefined(keys) || keys.length === 0 || (!isObject(o) && !isArray(o))) {
                return o;
            }
            var key = keys[0];
            if (key === "") { 
                return undefined;
            }
            if (keys.length === 1) {
                return o[key];
            }
            var tailKeys = keys.slice(1);
            return f.deepGet(o[key], tailKeys);
        }
    };

  
    var objectKeys = function(obj) {
        if (Object.keys) {
            return Object.keys(obj);
        } else {
            var key, keys = [];
            for (key in obj) { keys.push(key); }
            return keys;
        }
    };

    var isObject =          function(obj) { return obj === Object(obj); }; 
    var isUndefined =       function(obj) { return obj === void 0; }; 
    var isValidArrayIndex = function(val) { return /^[0-9]+$/.test(String(val)); }; 
    var isArray =           Array.isArray || function(obj) { return Object.prototype.toString.call(obj) === "[object Array]"; };
}));
