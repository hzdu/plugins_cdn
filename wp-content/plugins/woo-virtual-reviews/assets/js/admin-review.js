jQuery(document).ready(function ($) {
    'use strict';

    let ajaxData = {action: 'wvr_action', nonce: wvrObject.nonce};

    const MultipleReviews = {
        init() {
            this.processing = false;
            this.form = $('#wvr-review-from-setting');
            this.progressbar = this.form.find('.wvr-processing-bar');
            this.form.on('click', '.wvr-add-multi-reviews', () => this.addMultiReview());
            this.select2Init();
        },

        select2Init() {
            $('.wvr-product-cat').select2({
                multiple: true,
                placeholder: 'All categories'
            }).select2('val', ['']);
        },

        addMultiReview() {
            if (!confirm('Do you want to add reviews?')) return;

            if (this.processing) return;

            this.processing = true;
            let qty = this.form.find('.wvr-review-per-product').val();

            if (qty && parseInt(qty) !== 0) {
                let data = {
                    sub_action: 'add_multiple_reviews',
                    qty: qty,
                    cats: this.form.find('.wvr-product-cat').val(),
                    from: this.form.find('.wvr-date-from').val(),
                    to: this.form.find('.wvr-date-to').val()
                };
                this.ajaxAddReview(data);
            }
        },

        ajaxAddReview(data, step = 1) {
            let $this = this;
            $.ajax({
                url: wvrObject.ajaxUrl,
                type: 'post',
                dataType: 'json',
                data: {
                    ...ajaxData,
                    ...data,
                    step: step
                },
                beforeSend() {
                    if (step === 1) $this.progressbar.children().css('width', 0);
                    $this.progressbar.show();
                },
                success(res) {
                    if (res.success) {
                        if (res.data.continue) {
                            $this.progressbar.children().css('width', res.data.percentage + '%');
                            $this.ajaxAddReview(data, step + 1)
                        } else {
                            $this.processing = false;
                            $this.progressbar.children().css('width', '100%');
                            setTimeout(() => $this.progressbar.hide(), 3000);
                        }
                    }
                }
            });
        }
    };

    const SingleReview = {
        init() {
            this.form = $('#wvr-custom-review');
            this.progressbar = this.form.find('.wvr-processing-bar');
            this.form.on('click', '.wvr-add-review', (e) => this.addReview(e));
            this.searchProducts();
        },

        addReview(e) {
            let btn = $(e.target);
            if (btn.hasClass('loading')) {
                return;
            }
            let form = this.form, error = 0;

            ['.wvr-products', '.wvr-review', '.wvr-author'].forEach(function (el) {
                let input = form.find(el);
                input.removeClass('wvr-error');
                if (input.hasClass('select2-hidden-accessible')) input.next().removeClass('wvr-error');

                let value = input.val();

                if (!value || value.length === 0) {
                    error++;
                    input.addClass('wvr-error');
                    if (input.hasClass('select2-hidden-accessible')) input.next().addClass('wvr-error');
                }
            });

            if (error) return;

            let data = {
                sub_action: 'add_custom_reviews',
                pids: form.find('.wvr-products').val(),
                time: form.find('.wvr-time').val(),
                cmt: form.find('.wvr-review').val(),
                author: form.find('.wvr-author').val(),
                rating: form.find('.wvr-rating').val()
            };

            $.ajax({
                url: wvrObject.ajaxUrl,
                type: 'post',
                dataType: 'json',
                data: {
                    ...ajaxData,
                    ...data,
                },
                beforeSend() {
                    btn.addClass('loading')
                },
                success(res) {
                    btn.removeClass('loading');
                },
                error(res) {
                }
            });
        },

        searchProducts() {
            $('.wvr-products').select2({
                multiple: true,
                placeholder: 'Search product to add review',
                ajax: {
                    url: wvrObject.ajaxUrl,
                    dataType: 'json',
                    type: "POST",
                    quietMillis: 50,
                    delay: 250,
                    data: function (params) {
                        return {
                            ...ajaxData,
                            sub_action: 'search_product',
                            keyword: params.term
                        };
                    },
                    processResults: function (data) {
                        return {
                            results: data
                        };
                    },
                    cache: true
                },
                escapeMarkup: function (markup) {
                    return markup;
                },
                minimumInputLength: 2
            });
        }

    };

    MultipleReviews.init();
    SingleReview.init();

    /*Fix previous version*/
    let fixBtn = $('.wvr-fix-review');

    function fixReview() {
        $.ajax({
            url: wvrObject.ajaxUrl,
            type: 'post',
            dataType: 'json',
            data: {
                ...ajaxData,
                sub_action: 'fix_review_previous_version',
            },
            beforeSend() {
            },
            success(res) {
                if (res.success) {
                    if (res.data.next) {
                        $('.wvr-fix-review-remain').text(`Remain ${res.data.remain} reviews need to fix`);
                        fixReview();
                    } else {
                        $('.wvr-fix-review-remain').text('Completed');
                        fixBtn.removeClass('loading');
                    }
                }
            },
            error(res) {
            }
        });
    }

    fixBtn.on('click', function () {
        if ($(this).hasClass('loading')) return;
        $(this).addClass('loading');
        fixReview();
    });

    // $('.submit-add-reviews').on('click', function (e) {
    //     if (confirm('OK?')) {
    //         return true;
    //     } else {
    //         e.preventDefault();
    //     }
    // });
    //
    // auto_review_setting($('.wvr-cb-auto-review'));
    //
    // $('.wvr-cb-auto-review').on('change', function () {
    //     auto_review_setting($(this));
    // });
    //
    // function auto_review_setting(el) {
    //     if (el.is(':checked')) {
    //         $('.wvr-first-comment').css('color', 'inherit');
    //     } else {
    //         $('.wvr-first-comment').css('color', '#ddd');
    //     }
    // }

    //generate reviews for all products
    // var product_ids, product_no_cmt_ids, processing = 0;
    //
    // $('.wvr-add-reviews-all-product').on('click', function () {
    //     $.ajax({
    //         url: wvrObject.ajax_url,
    //         type: 'POST',
    //         data: {action: 'count_product'},
    //         success: function (data) {
    //             // console.log(data);
    //             product_ids = data[0];
    //             product_no_cmt_ids = data[1];
    //             $('.wvr-all-product-for-reviews').html(data[0].length);
    //             $('.wvr-product-no-vr-for-reviews').html(data[1].length);
    //             $('.wvr-processing-block').show();
    //
    //             // let pExistCmt = data[2];
    //             // deleteComment(0, pExistCmt);
    //         },
    //         error: function (data) {
    //             console.log(data);
    //         }
    //     });
    // });

    // function deleteComment(index, pExistCmt) {
    //     if (pExistCmt[index + 1] !== undefined) {
    //         $.ajax({
    //             url: wvrObject.ajax_url,
    //             type: 'POST',
    //             data: {action: 'delete_cmt', id: pExistCmt[index]},
    //             success: function (data) {
    //                 console.log(data);
    //                 // console.log(pExistCmt[index]);
    //                 deleteComment(index + 1, pExistCmt);
    //             },
    //             error: function (data) {
    //                 console.log(data);
    //             }
    //         });
    //     }
    // }

    // $('.wvr-generate-for-all-products').on('click', function () {
    //     let qty = $('.wvr-qty-cmt-all-products').val();
    //     beforeSendAjax(product_ids, qty);
    //     // console.log(product_ids);
    // });

    // $('.wvr-generate-for-no-cmt-products').on('click', function () {
    //     let qty = $('.wvr-qty-no-cmt-products').val();
    //     beforeSendAjax(product_no_cmt_ids, qty);
    // });
    //
    // function beforeSendAjax(obj, qty) {
    //     processing = 0;
    //     $('.wvr-processing-bar-group').show();
    //     $('.wvr-processing-bar-inside').css('width', '0');
    //     if (qty && obj) {
    //         generateReviews(0, obj, qty);
    //     }
    // }

    // function generateReviews(index, obj, qty) {
    //     // console.log(processing);
    //     $('.wvr-notice-completed').remove();
    //     $.ajax({
    //         url: wvrObject.ajax_url,
    //         type: 'POST',
    //         data: {action: 'add_reviews_all', id: obj[index], qty: qty},
    //         success: function (data) {
    //             // console.log(data);
    //             if (data[0]) {
    //                 $('.wvr-generate-processing-result').first().before(`<tr class="wvr-generate-processing-result"><td><a href="${data[2]}" target="_blank">${data[1]}</a></td><td class="wvr-right">Done</td></tr>`);
    //             } else {
    //                 $('.wvr-generate-processing-result').first().before(`<tr class="wvr-generate-processing-result"><td><a href="${data[2]}" target="_blank">${data[1]}</a></td><td class="wvr-right">Failed<span class="wvr-explain">Variable product have no variation</span></td></tr>`);
    //             }
    //
    //             processing++;
    //             let ratio = (processing / obj.length) * 100;
    //
    //             $('.wvr-processing-bar-inside').css('width', ratio + '%');
    //             if (parseInt(ratio) === 100) {
    //                 $('.wvr-processing-bar-outside').after('<div class="wvr-notice-completed" style="text-align: right; padding-right: 3px">Completed!</div>');
    //             }
    //
    //             if (index + 1 < obj.length) {
    //                 generateReviews(index + 1, obj, qty);
    //             }
    //         }
    //     });
    // }

});