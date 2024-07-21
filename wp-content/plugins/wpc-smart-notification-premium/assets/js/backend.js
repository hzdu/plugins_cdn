(function($) {
  class wpcsnAdmin {
    constructor($el) {
      let _this = this;
      this.namePrefix = 'wpcsn';
      this.$el = $el;
      this.toggle = {
        $el: [],
        $bind: {},
      };
      this.autoWidth($el);
      this.handleWidgetChange($el);
      $(window).resize(function() {
        _this.autoWidth($el);
      });
      $('body').append('<div class="overlay">');
      let $form = $el.parents('form.wpcsn-wrap');
      if ($form.length) {
        $form.submit(function(e) {
          e.preventDefault();
          let _data = {
            action: 'wpcsn',
            _nonce: WPCSNOptions.nonce,
            form_data: {
              action: 'save_form',
              data: $form.serialize(),
            },
          };
          $.ajax({
            url: ajaxurl,
            dataType: 'json',
            type: 'post',
            data: _data,
            beforeSend: function() {
              _this.isLoading($form, true);
            },
            success: function(response) {
              _this.isLoading($form);
              _this.noti({
                status: response.status,
                alert: response.alert,
              });
            },
            error: function(e) {
              _this.isLoading($form);
              _this.noti({
                status: 'error',
                alert: WPCSNOptions.saveFail,
              });
            },
          });
        });
      }
    }

    Initialize($el) {
      let _this = this;
      _this.BindingWidget($el);
      _this.EventWidget($el);
    }

    isLoading($el, isLoading) {
      let $$ = $('body > .overlay');
      if (isLoading) {
        $$.addClass('active').css({
          width: parseInt($el.innerWidth()) +
              parseInt($el.css('padding-left')) +
              parseInt($el.css('padding-right')),
          height: parseInt($el.innerHeight()) +
              parseInt($el.css('padding-top')) +
              parseInt($el.css('padding-bottom')),
          left: $el.offset().left,
          top: $el.offset().top,
        });
        $el.addClass('is-loading');
      } else {
        $el.removeClass('is-loading');
        $$.removeClass('active');
      }
    }

    noti(data) {
      new Noty({
        type: data.status,
        theme: 'relax',
        timeout: 15000,
        killer: true,
        text: '<div class="noti">' + data.alert + '</div>',
      }).show();
    }

    autoWidth($el) {
      $el.find('.widget-wpcsn-multipleField').each(function() {
        let isVisible = true;
        if ($(this).is('[data-toggle]')) {
          isVisible = $(this).is(':visible');
          $(this).show();
        }
        let $wrap = $(this).children('.item-inner');
        let $wrapWidth = $wrap.outerWidth();
        let $items = $wrap.children();
        let $itemsWidth = 0;
        $wrap.removeAttr('style');
        $items.each(function() {
          $itemsWidth += $(this).outerWidth();
        });

        if ($itemsWidth / $wrapWidth < 1.3 && $wrapWidth / $items.length >
            200) {
          $wrap.css({
            display: 'flex',
            overflow: 'unset',
          });
        } else {
          $wrap.removeAttr('style');
        }
        if (!isVisible) {
          $(this).hide();
        }
      });
    }

    BindingWidget($el) {
      let _this = this;

      $el.find('[data-toggle]').each(function(e) {
        let $$ = $(this);

        if ($.type($$.binded) == 'undefined') {
          $$.binded = true;
          let toggle = '.field-' +
              $$.data('toggle').split(' ').join(' .field-');
          let toggleValue = $$.data('toggle-value').split(',');
          let t = $el.find(toggle);
          let hidden = true;
          let index = _this.toggle.$el.indexOf(t[0]);
          if (index == -1) {
            index = _this.toggle.$el.push(t[0]);
            index -= 1;
          }

          if ($.type(_this.toggle.$bind[index]) != 'array') {
            _this.toggle.$bind[index] = [];
          }
          _this.toggle.$bind[index].push($(this)[0]);

          if (t.hasClass('widget-' + _this.namePrefix + '-text')) {
            hidden = (toggleValue.indexOf(t.find('input').val()) != -1) ?
                false :
                true;
          } else if (t.hasClass('widget-' + _this.namePrefix + '-number')) {
            hidden = (toggleValue.indexOf(t.find('input').val()) != -1) ?
                false :
                true;
          } else if (t.hasClass('widget-' + _this.namePrefix + '-select')) {

            hidden = (toggleValue.indexOf(t.find('select').val()) != -1) ?
                false :
                true;
          } else if (t.hasClass('widget-' + _this.namePrefix + '-textarea')) {
            hidden = (toggleValue.indexOf(t.find('textarea').val()) != -1) ?
                false :
                true;
          } else if (t.hasClass('widget-' + _this.namePrefix + '-checkbox')) {
            t.find('input:checked').each(function(e) {
              if (toggleValue.indexOf($(this).val()) != -1) {
                hidden = false;
              }
            });
          } else if (t.hasClass('widget-' + _this.namePrefix + '-radio')) {
            t.find('input:checked').each(function(e) {
              if (toggleValue.indexOf($(this).val()) != -1) {
                hidden = false;
              }
            });
          }

          if (hidden) {
            $$.hide();
          } else {
            $$.show();
          }
        }
      });

    }

    AddMoreEvent($el) {
      var _this = this;

      $el.find('[href="#add-more"]').click(function(e) {
        e.preventDefault();
        let $t = $(this);
        let $el = $t.parents('.item-wrapper').first();
        let length = parseInt($el.children('.item-inner').length);
        let _field_name = $el.data('field-name');
        let html = $el.children('.item-inner').first().clone();

        $(this).before(html);
        html.find('.select2-container').remove();
        html.find('[data-select2-id]').
            removeAttr('data-select2-id tatoggleex aria-hidden');
        html.find('.item-wrapper[data-field-name] .item-inner').
            first().
            siblings('.item-inner').
            remove();
        html.find('.widget-wpcsn-color .indicator > span').removeAttr('style');
        html.find('[name]').val('');
        html.find('.widget-wpcsn-image .img-preview .src').html('');
        html.find('.has-img').removeClass('has-img').find('img').hide();
        _this.setAttribute(html, length, _field_name);
        _this.handleWidgetChange(html);
      });
      $el.on('click', '[href="#remove"]', function(e) {
        e.preventDefault();
        var $el = $(this).parents('.item-wrapper').first();
        let _field_name = $el.data('field-name');
        if ($el.children('.item-inner').length > 1) {
          $(this).parents('.item-inner').first().remove();
          $el.children('.item-inner').each(function(index) {
            _this.setAttribute($(this), index, _field_name);
          });
        }
      });
    }

    EventWidget($el) {
      let _this = this;

      $el.on('change', 'input, select, textarea', function(e) {
        let $$ = $(this).parents('.item-wrapper').first();
        let index = _this.toggle.$el.indexOf($$[0]);
        let $bind = $.extend({}, _this.toggle.$bind);
        if ($.type(_this.toggle.$bind[index]) == 'array') {
          let value = [];
          if ($(this).attr('type') == 'checkbox') {
            value = $(this).
                parents('.widget-' + _this.namePrefix + '-checkbox').
                first().
                find('input:checked').
                map(function() {
                  return $(this).val();
                }).
                get();
          } else {
            value = [$(this).val()];
          }

          _this.toggle.$bind[index].forEach(function($t) {
            let $this = $($t);
            let toggleValue = $this.data('toggle-value');
            let show = false;
            value.forEach(function(e) {
              let preg = new RegExp(
                  '^' + e + ',|,' + e + ',|,' + e + '$|^' + e + '$');
              if (preg.test(toggleValue)) {
                show = true;
              }
            });
            if (show) {
              $this.slideDown();
            } else {
              $this.slideUp('fast');
            }
          });
        }

      });

      $el.find('[data-js="select2"]:not([data-select2-id])').
          each(function(index, value) {
            if (_.isUndefined($(this).data('source'))) {
              $(this).select2({
                allowClear: !$(this).is('[multiple]') ? true : false,
              });
            } else {
              $(this).select2({
                allowClear: !$(this).is('[multiple]') ? true : false,
                minimumInputLength: 2,
                ajax: {
                  url: ajaxurl,
                  dataType: 'json',
                  type: 'post',
                  delay: 250,
                  data: function(params) {
                    return {
                      action: 'wpcsn',
                      _nonce: WPCSNOptions.nonce,
                      form_data: {
                        action: $(this).data('source'),
                        field: $(this).data('field'),
                        selected: $(this).val(),
                        q: params.term,
                        page: params.page,
                      },
                    };
                  },
                  processResults: function(data, params) {
                    params.page = params.page || 1;
                    params.limit = params.limit || 10;
                    return {
                      results: data.items,
                      pagination: {
                        more: (params.page * params.limit) < data.total_item,
                      },
                    };
                  },
                  cache: true,
                },
                escapeMarkup: function(markup) {
                  return markup;
                },
              });
            }
          });

      if ($.fn.tipsy) {
        $el.find('input[title], select[title], textarea[title]').
            addClass('has-tip');
        $el.find('.has-tip').tipsy({live: true, gravity: 's'});
      }

      $el.find('.sortable').sortable();

      $el.find('.widget-wpcsn-image').find('.remove').click(function(e) {
        e.preventDefault();
        let $t = $(this).parents('.widget-wpcsn-image').first();
        $t.find('.img-id').val('');
        $t.find('.src').html('');
        $t.find('.button').removeClass('has-img').find('img').hide();
      });
      $el.find('.widget-wpcsn-image').find('.upload').click(function(e) {
        e.preventDefault();

        let $t = $(this).parent('.button');
        let $el = $t.parents('.widget-wpcsn-image').first();
        let img = $el.find('.img-id');
        let src = $el.find('.src');
        let attachment;
        let file_frame = wp.media.frames.file_frame = wp.media({
          title: 'Select Images',
          library: {},
          button: {text: 'Select'},
          multiple: false,
        });
        file_frame.on('open', function() {
          var selection = file_frame.state().get('selection');
          var val = img.val() != undefined ? img.val().split(',') : [];
          $.each(val, function(index, el) {
            attachment = wp.media.attachment(el);
            attachment.fetch();
            selection.add(attachment ? [attachment] : []);
          });
        });

        file_frame.on('select', function() {
          var attachment_ids = [];
          attachment = file_frame.state().get('selection').toJSON();
          img.val(attachment[0]['id']);
          src.html(attachment[0]['url']);
          var $img = $('<img>').attr({
            src: attachment[0]['url'],
          });
          $t.addClass('has-img');
          if ($t.find('img').length > 0) {
            $t.find('img').remove();
          }
          $t.append($img);
        });
        file_frame.open();
      });
    }

    setAttribute($el, index, _field_name) {
      var _this = this;
      let field_id = _this.arrayToId(_field_name);
      let field_name = _this.arrayToName(_field_name);
      $el.find('[name]').each(function() {
        let name = $(this).attr('name');
        name = field_name + '[' + index + ']' +
            name.slice(field_name.length + 3);
        let id = $(this).attr('id');
        id = field_id + '-' + index + id.slice(field_id.length + 2);
        $(this).attr({
          'id': id,
          'name': name,
        });
      });
      $el.find('.item-wrapper[data-field-name]').each(function() {
        let dataName = $(this).data('field-name');
        dataName[_field_name.length] = index;

        let id = $(this).attr('id');
        id = field_id + '-' + index + id.slice(field_id.length + 2);
        $(this).attr({
          'id': id,
          'data-field-name': JSON.stringify(dataName),
        });
      });
    }

    arrayToName(array) {
      let str = '';
      for (var i = 0; i < array.length; i++) {
        if (str != '') {
          str += '[' + array[i] + ']';
        } else {
          str = array[i];
        }
      }
      return str;
    }

    arrayToId(array) {
      return array.join('-');
    }

    handleWidgetChange($el) {
      this.Initialize($el);
      this.AddMoreEvent($el);
    }
  }

  $(document).find('.wpcsn-form-content.attach').each(function() {
    new wpcsnAdmin($(this));
  });
})(jQuery);
