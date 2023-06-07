(function($){
    $(document).ready(function(){
        $('.chosen').chosen({ width: '100%' });
        $(document).on('click', '#wpfd-statistics-reset', function(e) {
            e.preventDefault();
            var form = $('#wpfd-statistics-form');
            form.find('input[type=text]').val('');
            form.submit();

        });

        $(document).on('click', '.wpfd-ordering', function(e) {
            e.preventDefault();
            var form = $('#wpfd-statistics-form');
            form.find('[name="filter_order"]').val($(this).data('ordering'));
            form.find('[name="filter_order_dir"]').val($(this).data('direction'));
            form.submit();
        });

        $(document).on('change', '#selection', function () {
            $('#selection_value').val("").trigger('change').trigger("liszt:updated").trigger("chosen:updated");
            $('#wpfd-statistics-form').submit();
        });

        // Export
        $(document).on('click', '.wpfd-statistics--export', function(e) {
            e.preventDefault();
            e.stopPropagation();
            var form = $('#wpfd-statistics-form');
            $.ajax({
                method: 'POST',
                url: wpfdAjaxUrl + 'task=statistics.export',
                data: form.serialize(),
                success: function(response) {
                    if (response.success) {
                        var code = response.data.code;
                        var wpfd_statistics_nonce = $(form).find('input[name=wpfd_statistics_nonce]').val();
                        var _wp_http_referer = $(form).find('input[name=_wp_http_referer]').val();
                        window.open(wpfdAjaxUrl + 'task=statistics.download&code=' + code + '&wpfd_statistics_nonce=' + wpfd_statistics_nonce + '&_wp_http_referer=' + _wp_http_referer, '_blank');
                    } else {
                        console.log(response);
                    }
                },
                error: function(xhr, error) {
                    console.log(error);
                }
            });
        });

        // Pagination
        $(document).on('click', '.wpfd-statistics--pagination a', function(e){
            e.preventDefault();
            var $url = $(this).attr('href').match(/paged=([0-9]+)/);
            var page = $url[1];
            var form = $('#wpfd-statistics-form');

            form.find('[name="paged"]').val(page);
            form.submit();
        });
    });
})(jQuery);
