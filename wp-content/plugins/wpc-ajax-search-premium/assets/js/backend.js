'use strict';

(function($) {
  $(function() {
    wpcas_settings();
    wpcas_source_init();
    wpcas_build_label();
    wpcas_terms_init();
    wpcas_enhanced_select();
    wpcas_condition_init();
    wpcas_condition_tags_init();
    wpcas_combined_init();
    wpcas_combined_terms_init();
    wpcas_returned_init();
    wpcas_sortable();
  });

  $(document).on('change', '.wpcas_animated_placeholder', function(e) {
    wpcas_settings();
  });

  $(document).on('change', '.wpcas_condition_compare_selector', function(e) {
    wpcas_condition_init();
  });

  $(document).on('change', '.wpcas_returned_selector', function(e) {
    var $this = $(this);
    var $rule = $this.closest('.wpcas_rule');

    wpcas_build_label($rule);
    wpcas_returned_init($rule);
  });

  $(document).on('change', '.wpcas_source_selector', function() {
    var $this = $(this);
    var $rule = $this.closest('.wpcas_rule');

    wpcas_source_init($rule);
    wpcas_terms_init();
  });

  $(document).on('change, keyup', '.wpcas_rule_name_val', function() {
    var name = $(this).val();

    $(this).
        closest('.wpcas_rule').
        find('.wpcas_rule_name').
        html(name.replace(/(<([^>]+)>)/ig, ''));
  });

  $(document).on('change', '.wpcas_terms', function() {
    var $this = $(this);
    var apply = $(this).
        closest('.wpcas_rule').
        find('.wpcas_source_selector').
        val();

    $this.data(apply, $this.val().join());
  });

  $(document).on('click touch', '.wpcas_condition_remove', function() {
    $(this).closest('.wpcas_condition').remove();
  });

  $(document).on('change', '.wpcas_combined_selector', function() {
    wpcas_combined_init();
    wpcas_combined_terms_init();
  });

  $(document).on('click touch', '.wpcas_combined_remove', function() {
    $(this).closest('.wpcas_combined').remove();
  });

  $(document).on('click touch', '.wpcas_rule_heading', function(e) {
    if ($(e.target).closest('.wpcas_rule_remove').length === 0) {
      $(this).closest('.wpcas_rule').toggleClass('active');
    }
  });

  $(document).on('click touch', '.wpcas_new_condition', function(e) {
    var $conditions = $(this).
        closest('.wpcas_tr').
        find('.wpcas_conditions');
    var key = $(this).
        closest('.wpcas_rule').data('key');
    var data = {
      action: 'wpcas_add_condition',
      nonce: wpcas_vars.wpcas_nonce,
      key: key,
    };

    $.post(ajaxurl, data, function(response) {
      $conditions.append(response);
      wpcas_condition_init();
      wpcas_condition_tags_init();
    });

    e.preventDefault();
  });

  $(document).on('click touch', '.wpcas_new_combined', function(e) {
    var $combination = $(this).
        closest('.wpcas_tr').
        find('.wpcas_combination');
    var key = $(this).
        closest('.wpcas_rule').data('key');
    var data = {
      action: 'wpcas_add_combined',
      nonce: wpcas_vars.wpcas_nonce,
      key: key,
    };

    $.post(ajaxurl, data, function(response) {
      $combination.append(response);
      wpcas_combined_init();
      wpcas_combined_terms_init();
    });

    e.preventDefault();
  });

  $(document).on('click touch', '.wpcas_new_rule', function(e) {
    e.preventDefault();
    $('.wpcas_rules').addClass('wpcas_rules_loading');

    var data = {
      action: 'wpcas_add_rule', nonce: wpcas_vars.wpcas_nonce,
    };

    $.post(ajaxurl, data, function(response) {
      var $rule = $(response);
      $('.wpcas_rules').append($rule);
      wpcas_source_init($rule);
      wpcas_build_label($rule);
      wpcas_init_editor($rule);
      wpcas_terms_init();
      wpcas_enhanced_select();
      wpcas_condition_init();
      wpcas_condition_tags_init();
      wpcas_combined_init();
      wpcas_combined_terms_init();
      wpcas_returned_init($rule);
      $('.wpcas_rules').removeClass('wpcas_rules_loading');
    });
  });

  $(document).on('click touch', '.wpcas_rule_remove', function(e) {
    e.preventDefault();

    if (confirm('Are you sure?')) {
      $(this).closest('.wpcas_rule').remove();
    }
  });

  $(document).on('click touch', '.wpcas_expand_all', function(e) {
    e.preventDefault();

    $('.wpcas_rule').addClass('active');
  });

  $(document).on('click touch', '.wpcas_collapse_all', function(e) {
    e.preventDefault();

    $('.wpcas_rule').removeClass('active');
  });

  $(document).on('click touch', '.wpcas_conditional_remove', function(e) {
    e.preventDefault();

    if (confirm('Are you sure?')) {
      $(this).closest('.wpcas_conditional_item').remove();
    }
  });

  $(document).on('click touch', '.wpcas_import_export', function(e) {
    if (!$('#wpcas_import_export').length) {
      $('body').append('<div id=\'wpcas_import_export\'></div>');
    }

    $('#wpcas_import_export').html('Loading...');

    $('#wpcas_import_export').dialog({
      minWidth: 460,
      title: 'Import/Export',
      modal: true,
      dialogClass: 'wpc-dialog',
      open: function() {
        $('.ui-widget-overlay').bind('click', function() {
          $('#wpcas_import_export').dialog('close');
        });
      },
    });

    var data = {
      action: 'wpcas_import_export', nonce: wpcas_vars.wpcas_nonce,
    };

    $.post(ajaxurl, data, function(response) {
      $('#wpcas_import_export').html(response);
    });

    e.preventDefault();
  });

  $(document).on('click touch', '.wpcas_import_export_save', function(e) {
    if (confirm('Are you sure?')) {
      $(this).addClass('disabled');

      var rules = $('.wpcas_import_export_data').val();
      var data = {
        action: 'wpcas_import_export_save',
        nonce: wpcas_vars.wpcas_nonce,
        rules: rules,
      };

      $.post(ajaxurl, data, function(response) {
        location.reload();
      });
    }
  });

  $(document).on('click touch', '.wpcas_shortcodes_btn', function(e) {
    e.preventDefault();

    $('#wpcas_shortcodes_dialog').
        dialog({
          minWidth: 460,
          modal: true,
          dialogClass: 'wpc-dialog wpc-dialog-wide',
          open: function() {
            $('.ui-widget-overlay').bind('click', function() {
              $('#wpcas_shortcodes_dialog').dialog('close');
            });
          },
        });
  });

  function wpcas_terms_init() {
    $('.wpcas_terms').each(function() {
      var $this = $(this);
      var apply = $this.closest('.wpcas_rule').
          find('.wpcas_source_selector').
          val();

      $this.selectWoo({
        ajax: {
          url: ajaxurl, dataType: 'json', delay: 250, data: function(params) {
            return {
              q: params.term, action: 'wpcas_search_term', taxonomy: apply,
            };
          }, processResults: function(data) {
            var options = [];
            if (data) {
              $.each(data, function(index, text) {
                options.push({id: text[0], text: text[1]});
              });
            }
            return {
              results: options,
            };
          }, cache: true,
        }, minimumInputLength: 1,
      });

      if (apply !== 'all' && apply !== 'products' && apply !== 'combined') {
        // for terms only
        if ((typeof $this.data(apply) === 'string' ||
            $this.data(apply) instanceof
            String) && $this.data(apply) !== '') {
          $this.val($this.data(apply).split(',')).change();
        } else {
          $this.val([]).change();
        }
      }
    });
  }

  function wpcas_settings() {
    var animated = $('.wpcas_animated_placeholder').val();

    if (animated === 'yes') {
      $('.wpcas-show-if-animated-placeholder').show();
    } else {
      $('.wpcas-show-if-animated-placeholder').hide();
    }
  }

  function wpcas_combined_init() {
    $('.wpcas_combined_selector').each(function() {
      var $this = $(this);
      var $combined = $this.closest('.wpcas_combined');
      var val = $this.val();

      if (val === 'price') {
        $combined.find('.wpcas_combined_same_wrap').hide();
        $combined.find('.wpcas_combined_compare_wrap').hide();
        $combined.find('.wpcas_combined_val_wrap').hide();
        $combined.find('.wpcas_combined_number_compare_wrap').show();
        $combined.find('.wpcas_combined_number_val_wrap').show();
      } else {
        $combined.find('.wpcas_combined_same_wrap').hide();
        $combined.find('.wpcas_combined_number_compare_wrap').hide();
        $combined.find('.wpcas_combined_number_val_wrap').hide();
        $combined.find('.wpcas_combined_compare_wrap').show();
        $combined.find('.wpcas_combined_val_wrap').show();
      }
    });
  }

  function wpcas_condition_init() {
    $('.wpcas_condition_compare_selector').each(function() {
      var $this = $(this);
      var $condition = $this.closest('.wpcas_condition');
      var val = $this.find('option:selected').data('val');

      if (val === 'number') {
        $condition.find('.wpcas_condition_number').show();
        $condition.find('.wpcas_condition_text').hide();
        $condition.find('.wpcas_condition_regex').hide();
      } else if (val === 'regex') {
        $condition.find('.wpcas_condition_number').hide();
        $condition.find('.wpcas_condition_text').hide();
        $condition.find('.wpcas_condition_regex').show();
      } else {
        $condition.find('.wpcas_condition_number').hide();
        $condition.find('.wpcas_condition_text').show();
        $condition.find('.wpcas_condition_regex').hide();
      }
    });
  }

  function wpcas_condition_tags_init() {
    $('.wpcas_condition_text_val').selectWoo({
      tags: true,
      multiple: true,
    });
  }

  function wpcas_combined_terms_init() {
    $('.wpcas_apply_terms').each(function() {
      var $this = $(this);
      var taxonomy = $this.closest('.wpcas_combined').
          find('.wpcas_combined_selector').
          val();

      $this.selectWoo({
        ajax: {
          url: ajaxurl, dataType: 'json', delay: 250, data: function(params) {
            return {
              q: params.term, action: 'wpcas_search_term', taxonomy: taxonomy,
            };
          }, processResults: function(data) {
            var options = [];
            if (data) {
              $.each(data, function(index, text) {
                options.push({id: text[0], text: text[1]});
              });
            }
            return {
              results: options,
            };
          }, cache: true,
        }, minimumInputLength: 1,
      });
    });
  }

  function wpcas_returned_init($rule) {
    if (typeof $rule !== 'undefined') {
      var returned = $rule.find('.wpcas_returned_selector').
          find(':selected').
          val();

      $rule.find('.hide_returned').hide();
      $rule.find('.show_if_returned_' + returned).show();
    } else {
      $('.wpcas_returned_selector').each(function(e) {
        var $rule = $(this).closest('.wpcas_rule');
        var returned = $(this).find(':selected').val();

        $rule.find('.hide_returned').hide();
        $rule.find('.show_if_returned_' + returned).show();
      });
    }
  }

  function wpcas_source_init($rule) {
    if (typeof $rule !== 'undefined') {
      var apply = $rule.find('.wpcas_source_selector').
          find(':selected').
          val();
      var text = $rule.find('.wpcas_source_selector').
          find(':selected').
          text();

      $rule.find('.wpcas_get_text').text(text);
      $rule.find('.hide_get').hide();
      $rule.find('.show_if_' + apply).show();
      $rule.find('.show_get').show();
      $rule.find('.hide_if_' + apply).hide();
    } else {
      $('.wpcas_source_selector').each(function(e) {
        var $rule = $(this).closest('.wpcas_rule');
        var apply = $(this).find(':selected').val();
        var text = $(this).find(':selected').text();

        $rule.find('.wpcas_get_text').text(text);
        $rule.find('.hide_get').hide();
        $rule.find('.show_if_' + apply).show();
        $rule.find('.show_get').show();
        $rule.find('.hide_if_' + apply).hide();
      });
    }
  }

  function wpcas_sortable() {
    $('.wpcas_rules').sortable({handle: '.wpcas_rule_move'});
  }

  function wpcas_enhanced_select() {
    $(document.body).trigger('wc-enhanced-select-init');
  }

  function wpcas_build_label($rule) {
    if (typeof $rule !== 'undefined') {
      var get = $rule.find('.wpcas_returned_selector').
          find('option:selected').
          text();

      $rule.find('.wpcas_rule_returned').
          html('Returned results: ' + get);
    } else {
      $('.wpcas_rule ').each(function() {
        var $this = $(this);
        var get = $this.find('.wpcas_returned_selector').
            find('option:selected').
            text();

        $this.find('.wpcas_rule_returned').
            html('Returned results: ' + get);
      });
    }
  }

  function wpcas_init_editor($rule) {
    var editor = $rule.find('.wpcas_editor');
    var editor_id = editor.attr('id');

    wp.editor.initialize(editor_id, {
      mediaButtons: true,
      tinymce: {
        wpautop: true,
        plugins: 'charmap colorpicker compat3x directionality fullscreen hr image lists media paste tabfocus textcolor wordpress wpautoresize wpdialogs wpeditimage wpemoji wpgallery wplink wptextpattern wpview',
        toolbar1: 'formatselect bold italic | bullist numlist | blockquote | alignleft aligncenter alignright | link unlink | wp_more | spellchecker',
      },
      quicktags: true,
    });
  }
})(jQuery);