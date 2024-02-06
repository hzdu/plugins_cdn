var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

(function ($) {

  $.fn.FormFieldDependency = function (options) {

    var settings = $.extend({
      'attribute': 'inwpdepends', 
      'rules': {}
    }, options);

    var arrayInArraysHelper = function arrayInArraysHelper(needleArray, haystackArray, strict) {

      if (typeof strict == 'undefined') {
        strict = false;
      }

      if (needleArray == null) {
        needleArray = [];
      }

      if (strict == true) {
        return needleArray.sort().join(',').toLowerCase() == haystackArray.sort().join(',').toLowerCase();
      } else {
        for (var i = 0; i < needleArray.length; i++) {
          if (haystackArray.indexOf(needleArray[i]) >= 0) {
            return true;
          }
        }
        return false;
      }
    };

    var stringInArraysHelper = function stringInArraysHelper(needleString, haystackArray) {
      return $.inArray(needleString, haystackArray) >= 0 && $.isArray(haystackArray);
    };


    var isEmpty = function isEmpty(value) {

      if (typeof value == 'null' || typeof value == 'undefined') {
        return true;
      }

      if (typeof value == 'string') {
        return value.trim() == '';
      }

      if ((typeof value === 'undefined' ? 'undefined' : _typeof(value)) == 'object') {
        if ($.isArray(value)) {
          var _tmp = $.map(value, function (val, i) {
            return val.trim() == '' ? null : val;
          });
          return $.isEmptyObject(_tmp);
        } else {
          return $.isEmptyObject(value);
        }
      }
    };

    var typeRegExpDependency = function typeRegExpDependency(element, depObject, parent, useEvent) {

      if (typeof useEvent == 'undefined') {
        useEvent = false;
      }

      if (typeof $(parent).prop('tagName') == 'undefined') {
        return false;
      }

      var tag = $(parent).prop('tagName').toLowerCase();
      var type = $(parent).prop('type').toLowerCase();
      var name = tag + ':' + type;
      var value = $(parent).val().trim();

      switch (name) {
        case 'input:text':
        case 'input:password':
        case 'input:number':
        case 'input:date':
        case 'input:email':
        case 'input:url':
        case 'input:tel':
        case 'textarea:textarea':

          var modifier = typeof depObject.modifier == 'undefined' ? '' : depObject.modifier;
          var pattern = new RegExp(depObject.pattern, modifier);

          if (pattern.test(value)) {
            $(element).show();
          } else {
            $(element).hide();
          }
          break;
      }

      if (useEvent) {
        $(document.body).on('input', $(parent), function (e) {
          typeRegExpDependency(element, depObject, parent, false);
        });
      }
    };

    var typeEmptyDependency = function typeEmptyDependency(element, depObject, parent, useEvent) {

      if (typeof useEvent == 'undefined') {
        useEvent = false;
      }

      if (typeof $(parent).prop('tagName') == 'undefined') {
        return false;
      }

      var tag = $(parent).prop('tagName').toLowerCase();
      var type = $(parent).prop('type').toLowerCase();
      var name = tag + ':' + type;
      var value = $(parent).val();

      switch (name) {
        case 'input:text':
        case 'input:password':
        case 'input:number':
        case 'input:date':
        case 'input:email':
        case 'input:url':
        case 'input:tel':
        case 'textarea:textarea':
        case 'select:select-one':

          if (value.trim() == '') {
            $(element).show();
          } else {
            $(element).hide();
          }
          break;

        case 'input:checkbox':
          if ($(parent).is(':checked') && value.trim() != '') {
            $(element).hide();
          } else {
            $(element).show();
          }
          break;

        case 'select:select-multiple':

          if (isEmpty(value)) {
            $(element).show();
          } else {
            $(element).hide();
          }

          break;
      }

      if (useEvent) {
        $(document.body).on('input change', $(parent), function (e) {
          typeEmptyDependency(element, depObject, parent, false);
        });
      }
    };

    var typeNotEmptyDependency = function typeNotEmptyDependency(element, depObject, parent, useEvent) {

      if (typeof useEvent == 'undefined') {
        useEvent = false;
      }

      if (typeof $(parent).prop('tagName') == 'undefined') {
        return false;
      }

      var tag = $(parent).prop('tagName').toLowerCase();
      var type = $(parent).prop('type').toLowerCase();
      var name = tag + ':' + type;
      var value = $(parent).val();

      switch (name) {
        case 'input:text':
        case 'input:password':
        case 'input:number':
        case 'input:date':
        case 'input:email':
        case 'input:url':
        case 'input:tel':
        case 'textarea:textarea':
        case 'select:select-one':

          if (value.trim() != '') {
            $(element).show();
          } else {
            $(element).hide();
          }
          break;

        case 'input:checkbox':
          if ($(parent).is(':checked') && value.trim() != '') {
            $(element).show();
          } else {
            $(element).hide();
          }
          break;

        case 'select:select-multiple':

          if (isEmpty(value)) {
            $(element).hide();
          } else {
            $(element).show();
          }

          break;
      }

      if (useEvent) {
        $(document.body).on('input change', $(parent), function (e) {
          typeNotEmptyDependency(element, depObject, parent, false);
        });
      }
    };

    var typeEqualDependency = function typeEqualDependency(element, depObject, parent, useEvent) {

      if (typeof useEvent == 'undefined') {
        useEvent = false;
      }

      if (typeof $(parent).prop('tagName') == 'undefined') {
        return false;
      }

      var tag = $(parent).prop('tagName').toLowerCase();
      var type = $(parent).prop('type').toLowerCase();
      var name = tag + ':' + type;
      var value = $(parent).val();

      var equalLike = typeof depObject.like == 'undefined' ? false : true;

      depObject.empty = typeof depObject.empty == 'undefined' ? false : depObject.empty;

      depObject.strict = typeof depObject.strict == 'undefined' ? false : depObject.strict;

      if (equalLike) {

        var eqtag = $(depObject.like).prop('tagName').toLowerCase();
        var eqtype = $(depObject.like).prop('type').toLowerCase();
        var eqname = eqtag + ':' + eqtype;

        if (eqname == 'input:checkbox' || eqname == 'input:radio') {
          depObject.value = $(depObject.like + ':checked').map(function () {
            return this.value;
          }).get();
        } else {

          depObject.value = $(depObject.like).val();

          if (!showOnEmptyValue) {
            depObject.value = $(depObject.like).val().trim() == '' ? null : $(depObject.like).val();
          }
        }
      }

      switch (name) {
        case 'input:text':
        case 'input:password':
        case 'input:number':
        case 'input:date':
        case 'input:email':
        case 'input:url':
        case 'input:tel':
        case 'textarea:textarea':
        case 'select:select-one':

          if (value.trim() == depObject.value) {
            $(element).show();
          } else if (stringInArraysHelper(value, depObject.value)) {
            $(element).show();
          } else {
            if (value.trim() == '' && depObject.empty) {
              $(element).show();
            } else {
              $(element).hide();
            }
          }
          break;

        case 'input:checkbox':
        case 'input:radio':

          var value = $(parent + ':checked').map(function () {
            return this.value;
          }).get();

          if (value == depObject.value) {
            $(element).show();
          } else if (stringInArraysHelper(value, depObject.value)) {
            $(element).show();
          } else if (arrayInArraysHelper(value, depObject.value, depObject.strict)) {
            $(element).show();
          } else {
            if (isEmpty(value) && depObject.empty) {
              $(element).show();
            } else {
              $(element).hide();
            }
          }
          break;

        case 'select:select-multiple':

          if (arrayInArraysHelper(value, depObject.value, depObject.strict)) {
            $(element).show();
          } else {

            if (value == null && depObject.empty) {
              $(element).show();
            } else {
              $(element).hide();
            }
          }
          break;
      }

      if (useEvent) {
        $(document.body).on('input change', $(parent), function (e) {
          typeEqualDependency(element, depObject, parent, false);
        });
      }
    };

    var typeNotEqualDependency = function typeNotEqualDependency(element, depObject, parent, useEvent) {

      if (typeof useEvent == 'undefined') {
        useEvent = false;
      }

      if (typeof $(parent).prop('tagName') == 'undefined') {
        return false;
      }

      var tag = $(parent).prop('tagName').toLowerCase();
      var type = $(parent).prop('type').toLowerCase();
      var name = tag + ':' + type;
      var value = $(parent).val();

      var equalLike = typeof depObject.like == 'undefined' ? false : true;
      depObject.strict = typeof depObject.strict == 'undefined' ? false : depObject.strict;

      depObject.empty = typeof depObject.empty == 'undefined' ? true : depObject.empty;

      if (equalLike) {

        var eqtag = $(depObject.like).prop('tagName').toLowerCase();
        var eqtype = $(depObject.like).prop('type').toLowerCase();
        var eqname = eqtag + ':' + eqtype;

        if (eqname == 'input:checkbox' || eqname == 'input:radio') {
          depObject.value = $(depObject.like + ':checked').map(function () {
            return this.value;
          }).get();
        } else {

          depObject.value = $(depObject.like).val();

          if (!showOnEmptyValue) {
            depObject.value = $(depObject.like).val().trim() == '' ? null : $(depObject.like).val();
          }
        }
      }

      switch (name) {
        case 'input:text':
        case 'input:password':
        case 'input:number':
        case 'input:date':
        case 'input:email':
        case 'input:url':
        case 'input:tel':
        case 'textarea:textarea':
        case 'select:select-one':

          if (value == depObject.value) {
            $(element).hide();
          } else if (stringInArraysHelper(value, depObject.value)) {
            $(element).hide();
          } else {
            if (value.trim() == '' && !depObject.empty) {
              $(element).hide();
            } else {
              $(element).show();
            }
          }
          break;

        case 'input:checkbox':
        case 'input:radio':

          value = $(parent + ':checked').map(function () {
            return this.value;
          }).get();

          if (typeof depObject.strict == 'undefined') {
            depObject.strict = false;
          }

          if (value == depObject.value) {

            $(element).hide();
          } else if (stringInArraysHelper(value, depObject.value)) {

            $(element).hide();
          } else if (arrayInArraysHelper(value, depObject.value, depObject.strict)) {

            $(element).hide();
          } else {
            if (isEmpty(value) && !depObject.empty) {
              $(element).hide();
            } else {
              $(element).show();
            }
          }

          break;

        case 'select:select-multiple':

          if (arrayInArraysHelper(value, depObject.value, depObject.strict)) {
            $(element).hide();
          } else {
            if (value == null && !depObject.empty) {
              $(element).hide();
            } else {
              $(element).show();
            }
          }

          break;
      }

      if (useEvent) {
        $(document.body).on('input change', $(parent), function (e) {
          typeNotEqualDependency(element, depObject, parent, false);
        });
      }
    };

    var typeCompareDependency = function typeCompareDependency(element, depObject, parent, useEvent) {

      if (typeof useEvent == 'undefined') {
        useEvent = false;
      }

      if (typeof $(parent).prop('tagName') == 'undefined') {
        return false;
      }

      var tag = $(parent).prop('tagName').toLowerCase();
      var type = $(parent).prop('type').toLowerCase();
      var name = tag + ':' + type;
      var value = parseInt($(parent).val());
      depObject.value = parseInt(depObject.value);

      switch (depObject.sign) {
        case '<':
        case 'lt':
        case 'lessthen':
        case 'less-then':
        case 'LessThen':
          if (value < depObject.value) {
            $(element).show();
          } else {
            $(element).hide();
          }
          break;

        case '<=':
        case 'lteq':
        case 'lessthenequal':
        case 'less-then-equal':
        case 'LessThenEqual':
        case 'eqlt':
          if (value <= depObject.value) {
            $(element).show();
          } else {
            $(element).hide();
          }
          break;

        case '>=':
        case 'gteq':
        case 'greaterthenequal':
        case 'greater-then-equal':
        case 'GreaterThenEqual':
        case 'eqgt':
          if (value >= depObject.value) {
            $(element).show();
          } else {
            $(element).hide();
          }
          break;

        case '>':
        case 'gt':
        case 'greaterthen':
        case 'greater-then':
        case 'GreaterThen':
          if (value > depObject.value) {
            $(element).show();
          } else {
            $(element).hide();
          }
          break;

      }

      if (useEvent) {
        $(document.body).on('input change', $(parent), function (e) {
          typeCompareDependency(element, depObject, parent, false);
        });
      }
    };

    var typeRangeDependency = function typeRangeDependency(element, depObject, parent, useEvent) {

      if (typeof useEvent == 'undefined') {
        useEvent = false;
      }

      if (typeof $(parent).prop('tagName') == 'undefined') {
        return false;
      }

      var tag = $(parent).prop('tagName').toLowerCase();
      var type = $(parent).prop('type').toLowerCase();
      var name = tag + ':' + type;
      var value = parseInt($(parent).val());
      var min, max;


      if ($.isArray(depObject.value)) {
        min = parseInt(depObject.value[0]);
        max = parseInt(depObject.value[1]);
      }

      if (typeof depObject.value == 'undefined') {
        min = parseInt(depObject.min);
        max = parseInt(depObject.max);
      }

      if (min < value && value < max) {
        $(element).show();
      } else {
        $(element).hide();
      }

      if (useEvent) {
        $(document.body).on('input change', $(parent), function (e) {
          typeRangeDependency(element, depObject, parent, false);
        });
      }
    };

    var typeLengthDependency = function typeLengthDependency(element, depObject, parent, useEvent) {

      if (typeof useEvent == 'undefined') {
        useEvent = false;
      }

      if (typeof $(parent).prop('tagName') == 'undefined') {
        return false;
      }

      var tag = $(parent).prop('tagName').toLowerCase();
      var type = $(parent).prop('type').toLowerCase();
      var name = tag + ':' + type;
      var value = $(parent).val().length;
      depObject.value = parseInt(depObject.value);

      switch (depObject.sign) {
        case '<':
        case 'lt':
        case 'lessthen':
        case 'less-then':
        case 'LessThen':
          if (value < depObject.value) {
            $(element).show();
          } else {
            $(element).hide();
          }
          break;

        case '<=':
        case 'lteq':
        case 'lessthenequal':
        case 'less-then-equal':
        case 'LessThenEqual':
        case 'eqlt':
          if (value <= depObject.value) {
            $(element).show();
          } else {
            $(element).hide();
          }
          break;

        case '>=':
        case 'gteq':
        case 'greaterthenequal':
        case 'greater-then-equal':
        case 'GreaterThenEqual':
        case 'eqgt':
          if (value >= depObject.value) {
            $(element).show();
          } else {
            $(element).hide();
          }
          break;

        case '>':
        case 'gt':
        case 'greaterthen':
        case 'greater-then':
        case 'GreaterThen':
          if (value > depObject.value) {
            $(element).show();
          } else {
            $(element).hide();
          }
          break;

      }

      if (useEvent) {
        $(document.body).on('input change', $(parent), function (e) {

          typeLengthDependency(element, depObject, parent, false);
        });
      }
    };

    var useTypes = function useTypes($el, $data) {
      $.each($data, function (selector, depObject) {

        switch (depObject.type) {
          case 'empty':
            typeEmptyDependency($el, depObject, selector, true);
            break;

          case 'notempty':
          case 'not-empty':
          case 'notEmpty':
          case '!empty':
            typeNotEmptyDependency($el, depObject, selector, true);
            break;

          case 'equal':
          case '==':
          case '=':
            typeEqualDependency($el, depObject, selector, true);
            break;

          case '!equal':
          case 'notequal':
          case '!=':
          case 'not-equal':
          case 'notEqual':
            typeNotEqualDependency($el, depObject, selector, true);
            break;

          case 'regexp':
          case 'expression':
          case 'reg':
          case 'exp':
            typeRegExpDependency($el, depObject, selector, true);
            break;

          case 'compare':
          case 'comp':
            typeCompareDependency($el, depObject, selector, true);
            break;

          case 'length':
          case 'lng':
            typeLengthDependency($el, depObject, selector, true);
            break;

          case 'range':
            typeRangeDependency($el, depObject, selector, true);
            break;

        }
      });
    };

    (function ($data) {
      $.each($data, function ($el, depObject) {
        useTypes($($el), depObject);
      });
    })(settings.rules);

    return this.each(function () {
      var $data = $(this).data(settings.attribute.replace('data-', '').trim());

      if ($data) {

        $(this).addClass('has-dependent-data');

        $.each($data, function (el, obj) {
          useTypes($(this), obj);
        }.bind(this));
      }
    });
  };
})(jQuery);