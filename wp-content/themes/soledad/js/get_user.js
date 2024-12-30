(function ($) {
  'use strict'
  $('.penci_extra_author_ajax_id').select2({
    width: '270px',
    placeholder: {
      id: "",
      text: '-- Select User --',
    },
    allowClear: true,
    ajax: {
      url: penci_adm_users.ajax,
      data: function (params) {
        var query = {
          search: params.term,
          action: 'penci_get_users',
          nonce: penci_adm_users.nonce,
        }
        return query
      },
      processResults: function (response) {
        return {
          results: response.data,
        }
      },
    },
  })
})(jQuery)