/* global penciBlock */
/* global penciBlocksArray */
jQuery(document).ready(function ($) {
    var nav = [];
    $('.penci-biggrid-terms-wrapper').each(function () {
        var t = $(this),
            elID = t.attr('id'),
            c = 'li.all .pc-ajaxfil-link',
            datamax = t.find('.penci-biggrid-inner.default .penci-biggrid-data').data('maxp');

        if (t.find(c).length) {
            t.find(c).attr('data-maxp', datamax);
        }

        if (parseInt(datamax) <= 1) {
            $(this).find('.pcflx-nav .pcaj-nav-link').addClass('disable');
        }

        if (t.find('.penci-ajax-more').length) {
            nav[elID] = t.find('.penci-ajax-more').prop('outerHTML');
        }
    });

    jQuery('body').on('click', '.penci-biggrid-wrapper .pc-ajaxfil-link', function (event) {
        event.preventDefault();
        if (!$(this).hasClass('loading-posts')) {
            var $this = $(this),
                parentID = $(this).closest('.penci-biggrid-wrapper').attr('id'),
                $navthis = $this,
                divid = $this.data('id'),
                divc = 'penci-biggrid-tab-' + divid,
                parent = $this.closest('.pcnav-lgroup'),
                settings = parent.data('settings'),
                layout = parent.data('layout'),
                wrap_content = $this.closest('.penci-biggrid-wrapper').find('.penci-biggrid'),
                mainc = wrap_content.find('.penci-biggrid-data').attr('class'),
                pagednum = parseInt(parent.attr('data-paged')),
                curpaged = pagednum,
                navlink = true,
                prev = false,
                o = 0;

        

            if (navlink && $this.hasClass('prev')) {
                prev = true;
            }

            if (navlink) {
                $this = parent.find('.current-item');
                divid = $this.data('id');
                divc = 'penci-biggrid-tab-' + divid;

                if (prev) {
                    pagednum = curpaged - 1;
                } else {
                    pagednum = curpaged + 1;
                }
            }

            $this.addClass('loading-posts');
            wrap_content.addClass('loading-posts pcftaj-ld');
            parent.find('.pc-ajaxfil-link').removeClass('current-item');
            $this.addClass('current-item');

            

                var data = {
                    action: 'penci_bgmore_terms_ajax',
                    settings: settings,
                    layout: layout,
                    pagednum: pagednum,
                    nonce: penci_ajax_terms_filter_bg.nonce,
                };

                $.ajax({
                    type: "POST",
                    dataType: "html",
                    url: penci_ajax_terms_filter_bg.url,
                    data: data,
                    success: function (data) {
                        if (data) {
                            var data_paded = curpaged;

                            if (navlink) {
                                wrap_content.find('.' + divc).remove();
                                data_paded = curpaged + 1;
                            }

                            if (prev) {
                                data_paded = curpaged - 1;
                            }

                            wrap_content.append('<div class="penci-biggrid-inner ' + divc + '"><div class="' + mainc + '"></div></div>');

                            if (data_paded <= 1) {
                                parent.find('.pc-ajaxfil-link.prev').addClass('disable');
                            } else {
                                parent.find('.pc-ajaxfil-link.prev').removeClass('disable');
                            }

                            if (nav[parentID] !== undefined) {
                                wrap_content.find('.' + divc).append($(nav[parentID]));
                                wrap_content.find('.' + divc + ' .penci-ajax-more .penci-ajax-more-button').attr('data-pagednum', data_paded + 1);
                                wrap_content.find('.' + divc + ' .penci-ajax-more .penci-ajax-more-button').attr('data-paged', data_paded + 1);
                            }

                            parent.attr('data-paged', data_paded);

                            if (layout === 'style-2') {

                                wrap_content.find('.' + divc + ' .penci-biggrid-data').append(data).imagesLoaded(function () {
                                    wrap_content.find('.' + divc + ' .penci-biggrid-data').isotope({
                                        itemSelector: '.item-masonry',
                                        transitionDuration: '.55s',
                                        layoutMode: 'masonry'
                                    });
                                });
                            } else {
                                wrap_content.find('.' + divc + ' .penci-biggrid-data').append(data);
                            }

                            if ($('.' + divc).find('.pc-nomorepost').length) {
                                parent.find('.pc-ajaxfil-link.next').addClass('disable');
                            } else {
                                parent.find('.pc-ajaxfil-link.next').removeClass('disable');
                            }

                            wrap_content.find('.penci-biggrid-inner').hide();
                            wrap_content.find('.' + divc).show();
                            wrap_content.removeClass('loading-posts pcftaj-ld');
                            $this.removeClass('loading-posts');
                            $navthis.removeClass('loading-posts');

                            var o = 0;
                            wrap_content.find('.' + divc + ' .penci-bgitem').each(function () {
                                o++;
                                $(this).addClass('penci-ajrs-animate').attr('style', 'animation-delay:' + o / 10 + 's')
                            });
                            $(document).trigger('bgajax_loaded');
                            $(document).trigger('penci_bf_check');
                        } else {
                            if (navlink) {
                                parent.find('.pc-ajaxfil-link.next').addClass('disable');
                            } else {
                                wrap_content.find('.penci-biggrid-inner').hide();
                                wrap_content.find('.' + divc).append('<div class="pcajx-nopost"><span>No post found !</span></div>');
                                wrap_content.find('.' + divc).show();
                            }
                            wrap_content.removeClass('loading-posts pcftaj-ld');
                            $this.removeClass('loading-posts');
                            $navthis.removeClass('loading-posts');
                        }
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        console.log(jqXHR + " :: " + textStatus + " :: " + errorThrown);
                    },
                    completed: function () {
                        wrap_content.removeClass('loading-posts pcftaj-ld');
                        $this.removeClass('loading-posts');
                        $navthis.removeClass('loading-posts');
                    }
                });
            
        }
    });
});
