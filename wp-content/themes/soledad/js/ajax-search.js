/* Debounce */
(function (b, c) {
    var $ = b.jQuery || b.Cowboy || (b.Cowboy = {}), a;
    $.throttle = a = function (e, f, j, i) {
        var h, d = 0;
        if (typeof f !== "boolean") {
            i = j;
            j = f;
            f = c
        }

        function g() {
            var o = this, m = +new Date() - d, n = arguments;

            function l() {
                d = +new Date();
                j.apply(o, n)
            }

            function k() {
                h = c
            }

            if (i && !h) {
                l()
            }
            h && clearTimeout(h);
            if (i === c && m > e) {
                l()
            } else {
                if (f !== true) {
                    h = setTimeout(i ? k : l, i === c ? e - m : e)
                }
            }
        }

        if ($.guid) {
            g.guid = j.guid = j.guid || $.guid++
        }
        return g
    };
    $.debounce = function (d, e, f) {
        return f === c ? a(d, e, false) : a(d, f, e !== false)
    }
})(this);
(function ($) {
    "use strict";
    var PENCI = PENCI || {};
    PENCI.ajaxsearch = function () {
        var escapeRegExChars = function (value) {
            return value.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
        };

        $('form.penci-ajax-search').each(
            function () {
                var $this = $(this),
                    number = parseInt(penci_ajsr.maxitems),
                    thumbnail = parseInt(penci_ajsr.thumbnail),
                    date = parseInt(penci_ajsr.date),
                    $results = $this.parent().find('.penci-dropdown-results > .penci-search-results-wrapper');


                if ($this.data('count')) {
                    number = parseInt($this.data('count'));
                }

                if ($this.data('thumbnail')) {
                    thumbnail = parseInt($this.data('thumbnail'));
                }

                if ($('body').find('.header-search-style-showup').length) {
                    number = 3;
                }

                if ($('body').find('.header-search-style-default').length) {
                    number = 8;
                }

                if ($('body').find('.header-search-style-overlay').length) {
                    number = 6;
                }

                if (penci_ajsr.citems && penci_ajsr.maxitems) {
                    number = parseInt(penci_ajsr.maxitems);
                }

                $results.on(
                    'click',
                    '.view-all-results',
                    function () {
                        $this.submit();
                    }
                );

                $this.find('[type="text"]').on(
                    'focus keyup',
                    $.debounce(200, function () {
                            var $input = $(this),
                                $svalue = $input.val(),
                                data = {
                                    action: 'penci_ajax_search',
                                    number: number,
                                    nonce: penci_ajsr.nonce,
                                    query: $svalue,
                                };

                            if ($svalue.length < 1) {
                                return;
                            }

                            $.ajax({
                                type: "GET",
                                dataType: "html",
                                url: penci_ajsr.ajaxUrl,
                                data: data,
                                beforeSend: function () {
                                    $this.addClass('search-loading');
                                    $this.closest('.show-search').addClass('pcajx-search-loading');
                                    $this.closest('.penci-search-form').addClass('pcajx-search-open');
                                },
                                success: function (data) {
                                    $results.empty();
                                    $results.append('<div class="autocomplete-suggestions"></div>');
                                    var returnValue = '';

                                    data = JSON.parse(data);

                                    $.each(data.suggestions, function (index, suggestion) {

                                        returnValue += '<div class="autocomplete-suggestion" data-index="' + index + '">';

                                        if (thumbnail && suggestion.thumbnail) {
                                            returnValue += ' <div class="suggestion-thumb">' + suggestion.thumbnail + '</div>';
                                        }

                                        if (suggestion.value) {
                                            returnValue += ' <div class="suggestion-content reset-last-child">';
                                            returnValue += '<h4 class="penci-post-title"><a title="' + suggestion.title + '" href="' + suggestion.permalink + '">' + suggestion.value + '</a></h4>';
                                        }

                                        if (date && suggestion.date) {
                                            returnValue += ' <span class="post-date">' + suggestion.date + '</span>';
                                        }

                                        if (suggestion.value) {
                                            returnValue += ' </div>';
                                        }

                                        if (suggestion.no_found) {
                                            returnValue = '<span class="no-found-msg">' + suggestion.value + '</span>';
                                        }

                                        returnValue += ' </div>';

                                    });

                                    $results.find('.autocomplete-suggestions').append(returnValue);


                                    $results.find('.view-all-results').remove();

                                    if ($results.find('.autocomplete-suggestion').length > 2 && penci_ajsr.allresults) {
                                        $results.append('<div class="view-all-results"><span><a href="' + data.allsearch + '">' + penci_ajsr.allresults + '</a></span></div>');
                                    }

                                    if ($results.find('.autocomplete-suggestion').length > 1) {
                                        $results.closest('.penci-search-form').addClass('has-search-items');
                                    }

                                    $results.parent().addClass('penci-opened');
                                },
                                complete: function () {
                                    $this.removeClass('search-loading');
                                    $this.closest('.show-search').removeClass('pcajx-search-loading');
                                    $(document).trigger('penci-images-loaded');
                                    var PenciLazy = new LazyLoad({
                                        elements_selector: '.penci-lazy',
                                        data_bg: 'bgset',
                                        class_loading: 'lazyloading',
                                        class_entered: 'lazyloaded',
                                        class_loaded: 'pcloaded',
                                        unobserve_entered: true
                                    });
                                }
                            });
                        }
                    ));

                $(document).on(
                    'click',
                    function (e) {
                        var target = e.target;

                        if (!$(target).is('.penci-search-form') && !$(target).parents().is('.penci-search-form') && !$(target).is('.penci-search-full-screen') && !$(target).parents().is('.penci-search-full-screen')) {
                            $('.show-search').removeClass('active');
                            $results.parent().removeClass('penci-opened');
                            $this.closest('.penci-search-form')
                                .removeClass('has-search-items')
                                .removeClass('pcajx-search-open');
                        }
                    }
                );

                $('.penci-dropdown-results > .penci-search-results-wrapper').on(
                    'click',
                    function (e) {
                        e.stopPropagation();
                    }
                );
            }
        );
    }

    $(document).ready(function () {
        PENCI.ajaxsearch();
    });
})(jQuery);
