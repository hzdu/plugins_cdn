jQuery(function ($) {
    'use strict';

    function widgetImg() {
        var frame = wp.media({
            title: PenciReview.WidgetImageTitle,
            multiple: false,
            library: {type: 'image'},
            button: {text: PenciReview.WidgetImageButton}
        });

        $('body')
            .on('click', '.penci-widget-image__select_review', function (e) {
                e.preventDefault();
                var $this = $(this),
                    $input = $this.siblings('input'),
                    $image = $this.siblings('img'),
                    $placeholder = $this.prev(),
                    $savewidget = $this.closest('.widget-inside').find('.widget-control-save');

                frame.off('select')
                    .on('select', function () {
                        var id = frame.state().get('selection').toJSON()[0].id;
                        var url = frame.state().get('selection').toJSON()[0].url;
                        $input.val(id);
                        $input.data('url', url);
                        $image.attr('src', url).removeClass('hidden');
                        $placeholder.addClass('hidden');
                        $savewidget.prop("disabled", false);
                    })
                    .open();
            })
            .on('click', '.penci-widget-image__remove', function (e) {
                e.preventDefault();
                var $this = $(this),
                    $input = $this.siblings('input'),
                    $image = $this.siblings('img'),
                    $placeholder = $this.prev().prev(),
                    $savewidget = $this.closest('.widget-inside').find('.widget-control-save');

                $input.val('');
                $image.addClass('hidden');
                $placeholder.removeClass('hidden');
                $savewidget.prop("disabled", false);
            })
            .on('change', '.penci-widget-image__input', function (e) {
                e.preventDefault();
                var $this = $(this),
                    url = $this.data(url),
                    $image = $this.siblings('img');
                $image.attr('src', url)[url ? 'removeClass' : 'addClass']('hidden');

            });
    };


    function changeReviewSchema() {
        $(document).on('change', '.penci_review_schema_markup', function () {
            var selected_val = $(this).val();

            $('.penci-review_schema_fields').hide();
            $('.penci-review_' + selected_val + '_fields').show();
        }).trigger('change');
        $('.penci-datepicker').datepicker();
    }

    function add_new_review() {

        $('.penci-table-area-action').on('click', function (e) {
            e.preventDefault();
            var tabs = $('.penci-table-meta-tabs'),
                num_items = $('#penci_review_meta .penci-table-repeat').length + 1,
                prefix = 'penci_review_items[' + num_items + ']',
                form = $('.penci-table-repeat.first').clone().removeClass('first').addClass('active area-' + num_items).attr('id', 'penci-review-area-' + num_items),
                litems = $('.penci-table-meta-tabs li.first').clone().removeClass('first').addClass('litems-' + num_items);

            form.find('.order-number').html(num_items);
            litems.find('a').attr('data-id', 'penci-review-area-' + num_items).addClass('active');
            litems.find('.order-number').html(num_items);

            form.find('label').each(function (e) {
                $(this).attr('for', prefix + '[' + $(this).attr('for') + ']');
            });

            form.find('input, select, textarea').each(function (e) {
                $(this).val('')
                    .attr('id', prefix + '[' + $(this).attr('id') + ']')
                    .attr('name', prefix + '[' + $(this).attr('name') + ']');
            });

            $('#penci_review_meta').find('.penci-table-meta').removeClass('active');
            $('.penci-table-meta-button-area').before(form);
            tabs.find('.penci-review-tabs-btn').removeClass('active');
            tabs.append(litems);
        });

        $(document).on('click', '.penci-review-tabs-btn', function (e) {

            e.preventDefault();

            if ($(this).hasClass('active')) {
                return false;
            }

            $('.penci-table-meta-tabs').find('a').removeClass('active');
            var t = $(this),
                tabid = t.attr('data-id'),
                a = $('#penci_review_meta');

            a.find('.penci-table-meta').removeClass('active');
            a.find('#' + tabid).addClass('active');
            t.addClass('active');
        });
    }


    $(document).ready(function () {
        widgetImg();
        changeReviewSchema();
        add_new_review();
    });

});