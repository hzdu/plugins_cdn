(function ($) {
  $(document).ready(function ($) {
    var wpfd_wizard = {
      init: function () {
        $(document).on('change', '.ju-switch-button .switch input[type="checkbox"]', this.switch);
        $(document).on('click', '.wizard-theme-config .wpfd-theme .overlay', this.theme_select);
      },
      theme_select: function (e) {
        var $this = $(e.target);
        // Clear selected
        $('.wizard-theme-config .wpfd-theme').removeClass('checked');
        $('.wizard-theme-config input').prop('checked', false);

        // Select current
        $this.parent().addClass('checked');
        $this.parent().find('input').prop('checked', true);
      },
      switch: function (e) {
        var $this = $(e.target);
        var ref = $this.attr('name').replace('ref_', '');
        $('input[name="' + ref + '"]').val($this.prop('checked') ? 1 : 0);
      },
      minicolors: function () {
        $('.minicolors:not(.bgcolor, .bgdownloadlink)').minicolors({position: 'bottom left'});

        // Transparent color option
        $('.minicolors.bgcolor, .minicolors.bgdownloadlink').minicolors({
          position: 'bottom left',
          opacity: true,
          value: '#fff',
          change: function (hex, opacity) {
            var opacitySaved = $(this).data('opacity').toString();
            if (opacity === opacitySaved && opacitySaved !== '1.00') {
              opacitySaved = '1.00';
              opacity = '1.00';
              $(this).attr('data-opacity', '1.00').trigger('change');
              $(this).siblings('.minicolors-swatch').find('.minicolors-swatch-color').css({'opacity': '1'});
              $(this).siblings('.minicolors-panel').find('.minicolors-opacity-slider .minicolors-picker').css({'top': '0'});
            }

            if ((!hex || hex === '') && $(this).hasClass('bgcolor')) {
              color = 'rgba(255, 255, 255, 0)';
            } else {
              color = $(this).minicolors('rgbaString');
            }
          },
          hide : function() {
            $(this).val(color);
          },
          show : function() {}
        });
      },
    };

    // Wizard Init
    wpfd_wizard.init();
    wpfd_wizard.minicolors();
  });
})(jQuery);