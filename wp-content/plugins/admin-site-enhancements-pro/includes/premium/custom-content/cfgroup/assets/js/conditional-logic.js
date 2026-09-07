/**
 * Conditional logic for CFG field groups (admin + frontend forms using cfgroup_input).
 */
(function($) {
    'use strict';

    var CFGROUP_CL_TINYMCE_DEBOUNCE_MS = 100;
    var CFGROUP_CL_INIT_DELAY_MS = 300;
    /** @type {Object<string, boolean>} */
    var cfgroupClTinyMceBound = {};

    function debounce(fn, wait) {
        var t;
        return function() {
            var ctx = this;
            var args = arguments;
            clearTimeout(t);
            t = setTimeout(function() {
                fn.apply(ctx, args);
            }, wait);
        };
    }

    /**
     * HTML-aware empty check for WYSIWYG (empty / not_empty only): strip tags, collapse whitespace.
     *
     * @param {*} val Raw editor value (usually HTML string).
     * @return {boolean} True if there is no visible text.
     */
    function wysiwygIsVisuallyEmpty(val) {
        if (val === null || typeof val === 'undefined') {
            return true;
        }
        if ($.isArray(val)) {
            return val.length === 0;
        }
        var s = String(val);
        var tmp = document.createElement('div');
        tmp.innerHTML = s;
        var text = tmp.textContent || tmp.innerText || '';
        text = text.replace(/\u00a0/g, ' ').replace(/\s+/g, ' ').trim();
        return text === '';
    }

    /**
     * Sync a single TinyMCE instance to its textarea if present (avoids relying on global triggerSave only).
     *
     * @param {string} editorId Textarea / editor id.
     */
    function saveTinyMceEditorById(editorId) {
        if (!editorId || typeof window.tinyMCE === 'undefined' || !window.tinyMCE.get) {
            return;
        }
        var ed = window.tinyMCE.get(editorId);
        if (ed) {
            ed.save();
        }
    }

    function getScopeForGroupId(gid) {
        var $box = $('#cfgroup_input_' + gid);
        if ($box.length) {
            return $box.find('.inside').first().length ? $box.find('.inside').first() : $box;
        }
        return $('.cfgroup_input.no_box');
    }

    function getFieldWrap($scope, fieldId) {
        return $scope.find('.cfgroup-field-wrap[data-field-id="' + fieldId + '"]');
    }

    function getFieldInner($scope, fieldId) {
        return $scope.find('.field[data-field-id="' + fieldId + '"]');
    }

    /**
     * Read a field value from a specific .field container (top-level or repeater row).
     *
     * @param {jQuery} $inner  .field element.
     * @param {Object} fieldMeta Field metadata from CFG.conditionalLogic config.
     * @return {*}
     */
    function getFieldValueFromInner($inner, fieldMeta) {
        if (!$inner || !$inner.length) {
            return null;
        }

        var type = fieldMeta.type;

        if (type === 'checkbox') {
            var vals = [];
            $inner.find('input.checkbox:checked').each(function() {
                vals.push($(this).val());
            });
            return vals;
        }

        if (type === 'hyperlink') {
            return {
                url: $.trim(String($inner.find('.link-url').first().val() || '')),
                text: $.trim(String($inner.find('.link-text').first().val() || ''))
            };
        }

        if (typeof CFG !== 'undefined' && CFG.get_field_value && typeof CFG.get_field_value[type] === 'function') {
            return CFG.get_field_value[type]($inner);
        }

        if (type === 'wysiwyg') {
            var $ta = $inner.find('textarea.wp-editor-area, textarea.wysiwyg').first();
            if (!$ta.length) {
                $ta = $inner.find('textarea').first();
            }
            var tid = $ta.attr('id');
            if (tid) {
                saveTinyMceEditorById(tid);
            } else if (typeof window.tinyMCE !== 'undefined' && window.tinyMCE.triggerSave) {
                window.tinyMCE.triggerSave();
            }
            return $ta.val();
        }

        if (type === 'true_false') {
            return $inner.find('input[type="hidden"]').val();
        }

        return $inner.find('input').first().val();
    }

    function getFieldValue($scope, fieldId, fieldMeta) {
        return getFieldValueFromInner(getFieldInner($scope, fieldId), fieldMeta);
    }

    function getFieldInnerInRow($row, fieldId) {
        return $row.find('.field[data-field-id="' + fieldId + '"]').first();
    }

    function getFieldValueInRow($row, fieldId, fieldMeta) {
        return getFieldValueFromInner(getFieldInnerInRow($row, fieldId), fieldMeta);
    }

    function isEmptyValue(type, val) {
        if (val === null || typeof val === 'undefined') {
            return true;
        }
        if ($.isArray(val)) {
            return val.length === 0;
        }
        if (type === 'hyperlink' && val && typeof val === 'object' && !$.isArray(val)) {
            var hu = $.trim(String(val.url !== undefined ? val.url : ''));
            var ht = $.trim(String(val.text !== undefined ? val.text : ''));
            return hu === '' && ht === '';
        }
        if (type === 'wysiwyg') {
            return wysiwygIsVisuallyEmpty(val);
        }
        var s = $.trim(String(val));
        if (s === '') {
            return true;
        }
        if (type === 'file' || type === 'gallery' || type === 'relationship' || type === 'term' || type === 'user') {
            return s === '' || s === '0';
        }
        return false;
    }

    function compareEquals(type, norm, expect) {
        if ($.isArray(norm)) {
            var exp = $.isArray(expect) ? expect : [expect];
            norm = norm.slice().sort();
            exp = exp.slice().sort();
            return norm.join('\u0000') === exp.join('\u0000');
        }
        return String(norm) === String(expect);
    }

    function containsValue(type, norm, expect) {
        if (type === 'hyperlink' && norm && typeof norm === 'object' && !$.isArray(norm)) {
            var cu = String(norm.url !== undefined ? norm.url : '');
            var ct = String(norm.text !== undefined ? norm.text : '');
            var needle = String(expect);
            return cu.indexOf(needle) !== -1 || ct.indexOf(needle) !== -1;
        }
        if ($.isArray(norm)) {
            return $.inArray(String(expect), $.map(norm, String)) !== -1;
        }
        return String(norm).indexOf(String(expect)) !== -1;
    }

    /**
     * True when the repeater has no rows (all rows removed).
     *
     * @param {jQuery} $scope CFG scope container.
     * @param {number} fieldId Field id.
     * @return {boolean}
     */
    function repeaterIsEmptyDom($scope, fieldId) {
        var $inner = getFieldInner($scope, fieldId);
        if (!$inner.length) {
            return true;
        }
        var $rows = $inner.children('.cfgroup_repeater').children('.repeater_wrapper');
        if (!$rows.length) {
            $rows = $inner.children('.repeater_wrapper');
        }
        return $rows.length === 0;
    }

    /**
     * Collect all sub-field text from repeater rows (including nested repeaters) for "contains" matching.
     *
     * @param {jQuery} $scope CFG scope container.
     * @param {number} fieldId Field id.
     * @return {string}
     */
    function repeaterCollectTextForCl($scope, fieldId) {
        var $inner = getFieldInner($scope, fieldId);
        if (!$inner.length) {
            return '';
        }
        var $root = $inner.children('.cfgroup_repeater');
        if (!$root.length) {
            $root = $inner;
        }
        var parts = [];
        $root.find('input, textarea, select').each(function() {
            var $el = $(this);
            var t = $el.attr('type');
            if (t === 'button' || t === 'submit') {
                return;
            }
            if (t === 'checkbox' || t === 'radio') {
                if ($el.is(':checked')) {
                    parts.push(String($el.val() || ''));
                }
                return;
            }
            if ($el.is('textarea') && $el.hasClass('wp-editor-area')) {
                var tid = $el.attr('id');
                if (tid && typeof window.tinyMCE !== 'undefined' && window.tinyMCE.get) {
                    var ed = window.tinyMCE.get(tid);
                    if (ed) {
                        ed.save();
                    }
                } else if (typeof window.tinyMCE !== 'undefined' && window.tinyMCE.triggerSave) {
                    window.tinyMCE.triggerSave();
                }
            }
            parts.push(String($el.val() || ''));
        });
        return parts.join('\n');
    }

    /**
     * @param {jQuery} $scope CFG scope container.
     * @param {number} fieldId Field id.
     * @param {*} expect Needle.
     * @return {boolean}
     */
    function repeaterContainsText($scope, fieldId, expect) {
        var needle = String(expect).trim();
        if (needle === '') {
            return false;
        }
        var hay = repeaterCollectTextForCl($scope, fieldId);
        return hay.indexOf(needle) !== -1;
    }

    /**
     * Match PHP is_numeric-style parsing for conditional number rules.
     *
     * @param {*} val Raw or normalized value.
     * @return {number|null}
     */
    function parseNumericForCl(val) {
        if (val === null || typeof val === 'undefined' || $.isArray(val)) {
            return null;
        }
        var s = String(val).trim();
        if (s === '') {
            return null;
        }
        if (!$.isNumeric(s)) {
            return null;
        }
        var n = parseFloat(s);
        return Number.isFinite(n) ? n : null;
    }

    function compareNumericEquality(norm, expect) {
        var left = parseNumericForCl(norm);
        var right = parseNumericForCl(expect);
        if (left === null || right === null) {
            return false;
        }
        return left === right;
    }

    function compareNumericRelation(op, norm, expect) {
        var left = parseNumericForCl(norm);
        var right = parseNumericForCl(expect);
        if (left === null || right === null) {
            return false;
        }
        switch (op) {
            case '<':
                return left < right;
            case '<=':
                return left <= right;
            case '>':
                return left > right;
            case '>=':
                return left >= right;
            default:
                return false;
        }
    }

    /**
     * Parse Y-m-d for date conditional rules (matches PHP parse_ymd_for_cl).
     *
     * @param {*} val Raw or normalized value.
     * @return {string|null} Normalized Y-m-d or null.
     */
    function parseYmdForCl(val) {
        if (val === null || typeof val === 'undefined' || $.isArray(val)) {
            return null;
        }
        var s = String(val).trim();
        if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) {
            return null;
        }
        var p = s.split('-');
        var y = parseInt(p[0], 10);
        var m = parseInt(p[1], 10);
        var d = parseInt(p[2], 10);
        var dt = new Date(y, m - 1, d);
        if (dt.getFullYear() !== y || dt.getMonth() !== m - 1 || dt.getDate() !== d) {
            return null;
        }
        return s;
    }

    /**
     * @param {string} op             date_before, date_before_or_equal, date_after, date_after_or_equal.
     * @param {string} fieldYmd       Y-m-d.
     * @param {string} boundaryYmd    Y-m-d.
     * @return {boolean}
     */
    function compareDateRelation(op, fieldYmd, boundaryYmd) {
        switch (op) {
            case 'date_before':
                return fieldYmd < boundaryYmd;
            case 'date_before_or_equal':
                return fieldYmd <= boundaryYmd;
            case 'date_after':
                return fieldYmd > boundaryYmd;
            case 'date_after_or_equal':
                return fieldYmd >= boundaryYmd;
            default:
                return false;
        }
    }

    /**
     * Parse H:i for time conditional rules (matches PHP parse_hi_for_cl).
     *
     * @param {*} val Raw or normalized value.
     * @return {string|null} Normalized H:i or null.
     */
    function parseHiForCl(val) {
        if (val === null || typeof val === 'undefined' || $.isArray(val)) {
            return null;
        }
        var s = String(val).trim();
        if (s === '') {
            return null;
        }
        var m = /^(\d{1,2}):(\d{2})$/.exec(s);
        if (m) {
            var h = parseInt(m[1], 10);
            var mi = parseInt(m[2], 10);
            if (h >= 0 && h <= 23 && mi >= 0 && mi <= 59) {
                return (h < 10 ? '0' : '') + h + ':' + (mi < 10 ? '0' : '') + mi;
            }
            return null;
        }
        var d = new Date('2000-01-01 ' + s);
        if (isNaN(d.getTime())) {
            d = new Date('2000/01/01 ' + s);
        }
        if (isNaN(d.getTime())) {
            return null;
        }
        var hh = d.getHours();
        var mm = d.getMinutes();
        return (hh < 10 ? '0' : '') + hh + ':' + (mm < 10 ? '0' : '') + mm;
    }

    /**
     * Parse Y-m-d H:i for datetime conditional rules (matches PHP parse_ymd_hi_for_cl).
     *
     * @param {*} val Raw or normalized value.
     * @return {string|null} Normalized Y-m-d H:i or null.
     */
    function parseYmdHiForCl(val) {
        if (val === null || typeof val === 'undefined' || $.isArray(val)) {
            return null;
        }
        var s = String(val).trim();
        if (s === '') {
            return null;
        }
        var strict = /^(\d{4})-(\d{2})-(\d{2})\s+(\d{2}):(\d{2})$/.exec(s);
        if (strict) {
            var y = parseInt(strict[1], 10);
            var mo = parseInt(strict[2], 10);
            var d = parseInt(strict[3], 10);
            var h = parseInt(strict[4], 10);
            var mi = parseInt(strict[5], 10);
            var dt = new Date(y, mo - 1, d, h, mi);
            if (dt.getFullYear() !== y || dt.getMonth() !== mo - 1 || dt.getDate() !== d || dt.getHours() !== h || dt.getMinutes() !== mi) {
                return null;
            }
            if (h < 0 || h > 23 || mi < 0 || mi > 59) {
                return null;
            }
            return strict[1] + '-' + strict[2] + '-' + strict[3] + ' ' + strict[4] + ':' + strict[5];
        }
        var d = new Date(s);
        if (!isNaN(d.getTime())) {
            var padN = function(n) { return n < 10 ? '0' + n : '' + n; };
            return d.getFullYear() + '-' + padN(d.getMonth() + 1) + '-' + padN(d.getDate()) + ' ' + padN(d.getHours()) + ':' + padN(d.getMinutes());
        }
        return null;
    }

    function ruleMatches(fieldMeta, rule, rawVal, $scope) {
        var op = rule.operator;
        var expect = rule.value;
        var type = fieldMeta.type;
        var norm = rawVal;

        if (type === 'true_false') {
            // Align with PHP (string)(int)(bool): only "0" and empty string are false; "1" is true.
            if (null === rawVal || typeof rawVal === 'undefined') {
                norm = '0';
            } else if (false === rawVal || 0 === rawVal) {
                norm = '0';
            } else if (true === rawVal || 1 === rawVal) {
                norm = '1';
            } else {
                var ts = String(rawVal);
                norm = ('' === ts || '0' === ts) ? '0' : '1';
            }
        } else if (type === 'hyperlink' && rawVal && typeof rawVal === 'object' && !$.isArray(rawVal)) {
            norm = rawVal;
        } else if (!$.isArray(rawVal) && rawVal !== null && typeof rawVal !== 'undefined') {
            norm = String(rawVal);
        }

        switch (op) {
            case 'empty':
                if (type === 'repeater' && $scope && $scope.length) {
                    return repeaterIsEmptyDom($scope, fieldMeta.id);
                }
                return isEmptyValue(type, rawVal);
            case 'not_empty':
                if (type === 'repeater' && $scope && $scope.length) {
                    return !repeaterIsEmptyDom($scope, fieldMeta.id);
                }
                return !isEmptyValue(type, rawVal);
            case '==':
                if (type === 'number') {
                    return compareNumericEquality(norm, expect);
                }
                return compareEquals(type, norm, expect);
            case '!=':
                return !compareEquals(type, norm, expect);
            case 'contains':
                if (type === 'repeater' && $scope && $scope.length) {
                    return repeaterContainsText($scope, fieldMeta.id, expect);
                }
                return containsValue(type, norm, expect);
            case 'not_contains':
                if (type === 'repeater' && $scope && $scope.length) {
                    return !repeaterContainsText($scope, fieldMeta.id, expect);
                }
                return !containsValue(type, norm, expect);
            case 'match':
                try {
                    return new RegExp(expect).test(String(rawVal || ''));
                } catch (e) {
                    return false;
                }
            case '<':
            case '<=':
            case '>':
            case '>=':
                if (type !== 'number') {
                    return false;
                }
                return compareNumericRelation(op, norm, expect);
            case 'date_before':
            case 'date_before_or_equal':
            case 'date_after':
            case 'date_after_or_equal':
                if (type === 'date') {
                    var fieldYmd = parseYmdForCl(norm);
                    var boundaryYmd = parseYmdForCl(expect);
                    if (fieldYmd === null || boundaryYmd === null) {
                        return false;
                    }
                    return compareDateRelation(op, fieldYmd, boundaryYmd);
                }
                if (type === 'time') {
                    var fieldHi = parseHiForCl(norm);
                    var boundaryHi = parseHiForCl(expect);
                    if (fieldHi === null || boundaryHi === null) {
                        return false;
                    }
                    return compareDateRelation(op, fieldHi, boundaryHi);
                }
                if (type === 'datetime') {
                    var fieldYmdHi = parseYmdHiForCl(norm);
                    var boundaryYmdHi = parseYmdHiForCl(expect);
                    if (fieldYmdHi === null || boundaryYmdHi === null) {
                        return false;
                    }
                    return compareDateRelation(op, fieldYmdHi, boundaryYmdHi);
                }
                return false;
            case 'date_between':
                if (type === 'date') {
                    var fY = parseYmdForCl(norm);
                    if (fY === null) {
                        return false;
                    }
                    if (!expect || typeof expect !== 'object' || $.isArray(expect)) {
                        return false;
                    }
                    var st = parseYmdForCl(expect.start !== undefined ? expect.start : '');
                    var en = parseYmdForCl(expect.end !== undefined ? expect.end : '');
                    if (st === null || en === null) {
                        return false;
                    }
                    return (st <= fY && fY <= en);
                }
                if (type === 'time') {
                    var fH = parseHiForCl(norm);
                    if (fH === null) {
                        return false;
                    }
                    if (!expect || typeof expect !== 'object' || $.isArray(expect)) {
                        return false;
                    }
                    var stH = parseHiForCl(expect.start !== undefined ? expect.start : '');
                    var enH = parseHiForCl(expect.end !== undefined ? expect.end : '');
                    if (stH === null || enH === null) {
                        return false;
                    }
                    return (stH <= fH && fH <= enH);
                }
                if (type === 'datetime') {
                    var fDt = parseYmdHiForCl(norm);
                    if (fDt === null) {
                        return false;
                    }
                    if (!expect || typeof expect !== 'object' || $.isArray(expect)) {
                        return false;
                    }
                    var stDt = parseYmdHiForCl(expect.start !== undefined ? expect.start : '');
                    var enDt = parseYmdHiForCl(expect.end !== undefined ? expect.end : '');
                    if (stDt === null || enDt === null) {
                        return false;
                    }
                    return (stDt <= fDt && fDt <= enDt);
                }
                return false;
            default:
                return false;
        }
    }

    /**
     * Whether a wrap contains a CFG WYSIWYG editor (initialized or pending).
     *
     * @param {jQuery} $wrap
     * @return {boolean}
     */
    function wrapContainsWysiwyg($wrap) {
        return $wrap.find('.cfgroup_wysiwyg, .cfg-wysiwyg-pending, .wp-editor-area').length > 0;
    }

    /**
     * After conditional logic reveals field wraps, refresh any WYSIWYG editors inside them.
     *
     * @param {jQuery} $newlyShown Collection of wraps that lost .cfgroup-cl-hidden.
     */
    function notifyWysiwygFieldsShown($newlyShown) {
        if (!$newlyShown || !$newlyShown.length) {
            return;
        }

        var $withWysiwyg = $newlyShown.filter(function() {
            return wrapContainsWysiwyg($(this));
        });

        if (!$withWysiwyg.length) {
            return;
        }

        window.requestAnimationFrame(function() {
            // Prefer the public API when cfg-wysiwyg.js has registered it; otherwise fall back to the event.
            if (window.CFG && typeof window.CFG.refreshWysiwygInContext === 'function') {
                window.CFG.refreshWysiwygInContext($withWysiwyg);
            } else {
                $(document).trigger('cfgroup/cl_fields_shown', [$withWysiwyg]);
            }
        });
    }

    function applyVisibilityInRow($row, visible) {
        var $previouslyHidden = $();

        $row.find('.cfgroup-repeater-sub-wrap.cfgroup-cl-hidden').each(function() {
            $previouslyHidden = $previouslyHidden.add(this);
        });

        $row.find('.cfgroup-repeater-sub-wrap').each(function() {
            var id = parseInt($(this).data('field-id'), 10);
            if (!id) {
                return;
            }
            $(this).toggleClass('cfgroup-cl-hidden', visible[id] === false);
        });

        var $newlyShown = $previouslyHidden.filter(function() {
            return !$(this).hasClass('cfgroup-cl-hidden');
        });

        notifyWysiwygFieldsShown($newlyShown);
    }

    function getSubFieldIds(config, repeaterId) {
        var ids = [];
        var fields = config.fields || {};
        $.each(fields, function(fid, meta) {
            if (parseInt(meta.parent_id, 10) === repeaterId) {
                ids.push(parseInt(fid, 10));
            }
        });
        return ids;
    }

    function getRepeaterRows($repeaterField) {
        var $rows = $repeaterField.children('.cfgroup_repeater').children('.repeater_wrapper');
        if (!$rows.length) {
            $rows = $repeaterField.children('.repeater_wrapper');
        }
        return $rows;
    }

    function runForRepeaterRow($row, config, repeaterId) {
        var fields = config.fields || {};
        var logic = config.logic || {};
        var subIds = getSubFieldIds(config, repeaterId);

        if (!subIds.length) {
            return;
        }

        var visible = {};
        $.each(subIds, function(_, id) {
            visible[id] = true;
        });

        var iter = 0;
        var changed = true;
        while (changed && iter < 25) {
            changed = false;
            iter++;
            var visiblePrev = $.extend({}, visible);
            var nextVis = {};
            $.each(subIds, function(_, fid) {
                var cl = logic[String(fid)];
                var next = true;
                if (cl && cl.enabled && cl.groups && cl.groups.length) {
                    next = false;
                    for (var g = 0; g < cl.groups.length; g++) {
                        var andRules = cl.groups[g];
                        if (!andRules || !andRules.length) {
                            continue;
                        }
                        var allOk = true;
                        for (var r = 0; r < andRules.length; r++) {
                            var rule = andRules[r];
                            var depId = parseInt(rule.field_id, 10);
                            if (!visiblePrev[depId]) {
                                allOk = false;
                                break;
                            }
                            var depMeta = fields[String(depId)];
                            if (!depMeta) {
                                allOk = false;
                                break;
                            }
                            var raw = getFieldValueInRow($row, depId, depMeta);
                            if (!ruleMatches(depMeta, rule, raw, $row)) {
                                allOk = false;
                                break;
                            }
                        }
                        if (allOk) {
                            next = true;
                            break;
                        }
                    }
                }
                nextVis[fid] = next;
            });
            $.each(subIds, function(_, fid) {
                if (visible[fid] !== nextVis[fid]) {
                    changed = true;
                }
                visible[fid] = nextVis[fid];
            });
        }

        applyVisibilityInRow($row, visible);

        $row.find('> .cfgroup_repeater_body > .fields-wrapper > .cfgroup-repeater-sub-wrap > .field.cfgroup_repeater[data-field-id]').each(function() {
            var nestedId = parseInt($(this).data('field-id'), 10);
            if (!nestedId) {
                return;
            }
            getRepeaterRows($(this)).each(function() {
                runForRepeaterRow($(this), config, nestedId);
            });
        });
    }

    function runRepeaterSubFieldCl($scope, gid) {
        if (typeof CFG === 'undefined' || !CFG.conditionalLogic || !CFG.conditionalLogic[gid]) {
            return;
        }
        var config = CFG.conditionalLogic[gid];
        var fields = config.fields || {};

        $.each(fields, function(fid, meta) {
            if (meta.type !== 'repeater' || parseInt(meta.parent_id, 10) !== 0) {
                return;
            }
            if (!getSubFieldIds(config, parseInt(fid, 10)).length) {
                return;
            }
            var repeaterId = parseInt(fid, 10);
            $scope.find('.field[data-field-id="' + repeaterId + '"]').each(function() {
                getRepeaterRows($(this)).each(function() {
                    runForRepeaterRow($(this), config, repeaterId);
                });
            });
        });
    }

    function applyVisibility($scope, gid, visible) {
        var $previouslyHidden = $();

        $scope.find('.cfgroup-field-wrap.cfgroup-cl-hidden, .cfgroup-tab-content.cfgroup-cl-hidden').each(function() {
            $previouslyHidden = $previouslyHidden.add(this);
        });

        // Reset top-level visibility only. Repeater sub-wraps are owned by applyVisibilityInRow;
        // clearing them here would erase hidden→visible transitions for nested WYSIWYG fields.
        $scope.find('.cfgroup-field-wrap.cfgroup-cl-hidden, .cfgroup-tab.cfgroup-cl-hidden, .cfgroup-tab-content.cfgroup-cl-hidden').removeClass('cfgroup-cl-hidden');
        $scope.find('.cfgroup-field-wrap').each(function() {
            var id = parseInt($(this).data('field-id'), 10);
            if (!id) {
                return;
            }
            if (visible[id] === false) {
                $(this).addClass('cfgroup-cl-hidden');
            }
        });

        $scope.find('.cfgroup-tab').each(function() {
            var id = parseInt($(this).data('field-id'), 10);
            if (!id) {
                return;
            }
            if (visible[id] === false) {
                $(this).addClass('cfgroup-cl-hidden');
            }
        });

        $scope.find('.cfgroup-tab-content').each(function() {
            var id = parseInt($(this).data('field-id'), 10);
            if (!id) {
                return;
            }
            if (visible[id] === false) {
                $(this).addClass('cfgroup-cl-hidden');
            }
        });

        $scope.find('.cfgroup-tabs').each(function() {
            var $t = $(this);
            var vis = $t.find('.cfgroup-tab:not(.cfgroup-cl-hidden)');
            if (vis.length === 0) {
                $t.addClass('cfgroup-tabs-all-hidden');
            } else {
                $t.removeClass('cfgroup-tabs-all-hidden');
            }
        });

        $scope.find('.cfgroup-tabs').each(function() {
            var $tabs = $(this).find('.cfgroup-tab:not(.cfgroup-cl-hidden)');
            if ($tabs.length && !$tabs.filter('.active').length) {
                $tabs.first().trigger('click');
            }
        });

        var $newlyShown = $previouslyHidden.filter(function() {
            return !$(this).hasClass('cfgroup-cl-hidden');
        });

        notifyWysiwygFieldsShown($newlyShown);
    }

    function runForGroup(gid) {
        if (typeof CFG === 'undefined' || !CFG.conditionalLogic || !CFG.conditionalLogic[gid]) {
            return;
        }
        var config = CFG.conditionalLogic[gid];
        var $scope = getScopeForGroupId(gid);
        if (!$scope.length) {
            return;
        }

        var fields = config.fields || {};
        var logic = config.logic || {};
        var visible = {};

        var ids = [];
        $.each(fields, function(fid) {
            if (parseInt(fields[fid].parent_id, 10) === 0) {
                ids.push(parseInt(fid, 10));
            }
        });

        $.each(ids, function(_, id) {
            visible[id] = true;
        });

        var iter = 0;
        var changed = true;
        while (changed && iter < 25) {
            changed = false;
            iter++;
            var visiblePrev = $.extend({}, visible);
            var nextVis = {};
            $.each(ids, function(_, fid) {
                var f = fields[String(fid)];
                var cl = logic[String(fid)];
                var next = true;
                if (cl && cl.enabled && cl.groups && cl.groups.length) {
                    next = false;
                    for (var g = 0; g < cl.groups.length; g++) {
                        var andRules = cl.groups[g];
                        if (!andRules || !andRules.length) {
                            continue;
                        }
                        var allOk = true;
                        for (var r = 0; r < andRules.length; r++) {
                            var rule = andRules[r];
                            var depId = parseInt(rule.field_id, 10);
                            if (!visiblePrev[depId]) {
                                allOk = false;
                                break;
                            }
                            var depMeta = fields[String(depId)];
                            if (!depMeta) {
                                allOk = false;
                                break;
                            }
                            var raw = getFieldValue($scope, depId, depMeta);
                            if (!ruleMatches(depMeta, rule, raw, $scope)) {
                                allOk = false;
                                break;
                            }
                        }
                        if (allOk) {
                            next = true;
                            break;
                        }
                    }
                }
                nextVis[fid] = next;
            });
            $.each(ids, function(_, fid) {
                if (visible[fid] !== nextVis[fid]) {
                    changed = true;
                }
                visible[fid] = nextVis[fid];
            });
        }

        applyVisibility($scope, gid, visible);
        runRepeaterSubFieldCl($scope, gid);
    }

    function runAll() {
        if (typeof CFG === 'undefined' || !CFG.conditionalLogic) {
            return;
        }
        $.each(CFG.conditionalLogic, function(gid) {
            runForGroup(parseInt(gid, 10));
        });
    }

    var debouncedRunAll = debounce(runAll, CFGROUP_CL_TINYMCE_DEBOUNCE_MS);

    /**
     * Attach TinyMCE editor events so conditional logic re-runs when Visual mode content changes.
     *
     * @param {Object} editor TinyMCE editor instance.
     */
    function bindCfgroupTinyMceEditor(editor) {
        if (!editor || !editor.id) {
            return;
        }
        if (cfgroupClTinyMceBound[editor.id]) {
            return;
        }
        var $container = $(editor.getContainer());
        if (!$container.closest('.cfgroup_input').length) {
            return;
        }
        cfgroupClTinyMceBound[editor.id] = true;
        editor.on('keyup change SetContent Undo Redo ExecCommand', debouncedRunAll);
    }

    /**
     * Late-bound editors (repeaters) and editors created before this script.
     */
    function scanTinyMceEditorsForCfgroup() {
        var api = window.tinymce || window.tinyMCE;
        if (!api || !api.editors || !api.editors.length) {
            return;
        }
        for (var i = 0; i < api.editors.length; i++) {
            bindCfgroupTinyMceEditor(api.editors[i]);
        }
    }

    $(document).on('tinymce-editor-init', function(event, editor) {
        bindCfgroupTinyMceEditor(editor);
    });

    (function bindTinyMceAddRemoveEditor() {
        var api = window.tinymce || window.tinyMCE;
        if (api && typeof api.on === 'function') {
            api.on('AddEditor', function(e) {
                if (e && e.editor) {
                    bindCfgroupTinyMceEditor(e.editor);
                }
            });
            api.on('RemoveEditor', function(e) {
                if (e && e.editor && e.editor.id) {
                    delete cfgroupClTinyMceBound[e.editor.id];
                }
            });
        }
    })();

    $(document).on('change input', '.cfgroup_input', function(e) {
        var $t = $(e.target);
        if ($t.closest('.cfgroup-cl-builder').length) {
            return;
        }
        if ($t.closest('.cfgroup_color').length) {
            debouncedRunAll();
        } else {
            runAll();
        }
    });

    $(document).on('click', '.cfgroup_input .media.button, .cfgroup_input .cfgroup_add_field', function() {
        setTimeout(runAll, 100);
    });

    $(document).on('click', '.cfgroup_input .cfgroup_delete_field, .cfgroup_input .cfgroup_insert_field', function() {
        setTimeout(runAll, 100);
    });

    $(document).on('cfgroup/ready', '.cfgroup_input', function() {
        setTimeout(runAll, 100);
    });

    $(document).on('input change', '.cfgroup_input textarea.wp-editor-area', function() {
        debouncedRunAll();
    });

    $(function() {
        setTimeout(runAll, 0);
        setTimeout(function() {
            scanTinyMceEditorsForCfgroup();
            runAll();
        }, CFGROUP_CL_INIT_DELAY_MS);
    });

    window.CFG = window.CFG || {};
    window.CFG.runCfgroupConditionalLogic = runAll;
})(jQuery);
