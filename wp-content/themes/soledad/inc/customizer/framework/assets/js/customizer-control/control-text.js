;(function ($, api) {
  'use strict'

  api.controlConstructor['soledad-fw-text'] = api.controlConstructor.default.extend({
    ready: function () {
      var control = this

      this.container.on('change click keyup paste', 'input', function () {
        control.setting.set($(this).val())
      })
    },
  })

  api.controlConstructor['soledad-fw-password'] = api.controlConstructor['soledad-fw-text']
})(jQuery, wp.customize)
