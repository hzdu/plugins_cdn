jQuery(document).ready(function ($) {

    function penci_init_toc() {

        if (typeof PenciTOC != 'undefined') {

            $('article.post').each(function () {
                var $post = $(this),
                    $sticky = $post.find('.penci-toc-container-wrapper'),
                    $stickyrStopper = $post.find('.post-entry'),
                    $stickC = $sticky.clone();


                $stickC.addClass('penci-sticky-toc');
                $stickC.find('.penci-toc-container')
                    .attr('id', 'penci-toc-sticky-container')
                    .addClass('hide-table');
                $stickC.find('a.penci-toc-toggle').addClass('sticky-toggle');
                if ($('body').hasClass('penci-aw-sticky')) {
                    $stickC.addClass('tocSticky');
                }
                $stickyrStopper.append($stickC);

                if (!!$sticky.offset()) { // make sure ".sticky" element exists

                    var asticky = $('body').hasClass('penci-aw-sticky'),
                        generalSidebarHeight = asticky ? 0 : $sticky.innerHeight(),
                        stickyTop = asticky ? 0 : $sticky.offset().top,
                        stickOffset = asticky ? 0 : 120,
                        innerset = stickOffset - generalSidebarHeight - 60,
                        outerset = stickOffset - $stickyrStopper.innerHeight() + 60;

                    $(window).scroll(function () {
                        var windowTop = $(window).scrollTop(),

                            shouldAddClass = asticky ? stickyTop > windowTop + outerset : stickyTop < windowTop + innerset && stickyTop > windowTop + outerset;

                        $stickC.toggleClass('tocSticky', shouldAddClass);


                        
                    });

                }
            });

            if (window.location.hash) {

                var path = window.location.hash;

                if (path.startsWith("#" + PenciTOC.prefix)) {

                    var offset = -120,
                        hash = window.location.hash.substring(1);

                    if (!hash) {
                        return;
                    }

                    var sel = '[id="' + hash + '"], a[name="' + hash + '"]';
                    var currentOffset = $(sel).offset().top;

                    // smooth scroll to the anchor id
                    $('html, body').animate({
                        scrollTop: (currentOffset + offset) + 'px'
                    }, 1000, 'swing');
                }
            }


            $.fn.shrinkTOCWidth = function () {

                $(this).css({
                    width: 'auto',
                    display: 'table'
                });

                if (/MSIE 7\./.test(navigator.userAgent))
                    $(this).css('width', '');
            };

            var smoothScroll = parseInt(PenciTOC.smooth_scroll);

            if (1 === smoothScroll) {

                $('a.penci-toc-link').off().on('click', function () {

                    var self = $(this);

                    var target = '';
                    var hostname = self.prop('hostname');
                    var pathname = self.prop('pathname');
                    var qs = self.prop('search');
                    var hash = self.prop('hash');

                    // ie strips out the preceding / from pathname
                    if (pathname.length > 0) {
                        if (pathname.charAt(0) !== '/') {
                            pathname = '/' + pathname;
                        }
                    }

                    if ((window.location.hostname === hostname) &&
                        (window.location.pathname === pathname) &&
                        (window.location.search === qs) &&
                        (hash !== '')
                    ) {
                        // var id = decodeURIComponent( hash.replace( '#', '' ) );
                        //target = '[id="' + hash.replace('#', '') + '"]';
                        target = $(this).attr('href');

                        var parentClass;
                        if ($('.penci-single-infiscroll').length) {
                            parentClass = $(this).closest('.penci-single-block').find('#main article').attr('id');
                        }

                        if (typeof parentClass !== 'undefined' && parentClass !== false) {
                            target = '#' + parentClass + ' ' + target;
                        }

                        // verify it exists
                        if ($(target).length === 0) {
                            console.log('PenciTOC scrollTarget Not Found: ' + target);
                            target = '';
                        }

                        // check offset setting
                        if (typeof PenciTOC.scroll_offset != 'undefined') {

                            var offset = -1 * PenciTOC.scroll_offset;

                        } else {

                            var adminbar = $('#wpadminbar');

                            if (adminbar.length > 0) {

                                if (adminbar.is(':visible'))
                                    offset = -30;	// admin bar exists, give it the default
                                else
                                    offset = 0;		// there is an admin bar but it's hidden, so no offset!

                            } else {

                                // no admin bar, so no offset!
                                offset = 0;
                            }
                        }

                        if (target) {
                            $.smoothScroll({
                                scrollTarget: target,
                                offset: offset,
                                beforeScroll: deactivateSetActivePenciTocListElement,
                                afterScroll: function () {
                                    setActivePenciTocListElement();
                                    activateSetActivePenciTocListElement();
                                }
                            });
                        }
                    }
                });
            }

            if (typeof PenciTOC.visibility_hide_by_default != 'undefined') {

                $('article.post').each(function () {

                    var post = $(this),
                        toc = post.find('.penci-toc-container-wrapper:not(.penci-sticky-toc) ul.penci-toc-list'),
                        toggle = post.find('a.penci-toc-toggle:not(.sticky-toggle)'),
                        wrapper = post.find('.penci-toc-container-wrapper:not(.penci-sticky-toc) .penci-toc-wrapper'),
                        swrapper = post.find('.penci-sticky-toc .penci-toc-wrapper'),
                        mswrapper = post.find('.penci-sticky-toc'),
                        stoggle = post.find('.penci-sticky-toc a.sticky-toggle'),
                        stoc = post.find('.penci-sticky-toc ul.penci-toc-list'),
                        invert = PenciTOC.visibility_hide_by_default;

                    toggle.css('display', 'inline');
                    stoggle.css('display', 'inline');

                    if (Cookies) {

                        Cookies.get('penciTOC_hidetoc') == 1 ? toggle.data('visible', false) : toggle.data('visible', true);

                    } else {

                        toggle.data('visible', true);
                    }

                    if (invert) {

                        toggle.data('visible', false)
                    }

                    if (!toggle.data('visible')) {

                        toc.hide();
                        wrapper.removeClass('show-table').addClass('hide-table');
                    }

                    toggle.off().on('click', function (event) {

                        event.preventDefault();

                        if ($(this).data('visible')) {

                            $(this).data('visible', false);

                            if (Cookies) {

                                if (invert)
                                    Cookies.set('penciTOC_hidetoc', null, {path: '/'});
                                else
                                    Cookies.set('penciTOC_hidetoc', '1', {expires: 30, path: '/'});
                            }

                            toc.hide('fast');
                            wrapper.removeClass('show-table').addClass('hide-table');

                        } else {

                            $(this).data('visible', true);

                            if (Cookies) {

                                if (invert)
                                    Cookies.set('penciTOC_hidetoc', '1', {expires: 30, path: '/'});
                                else
                                    Cookies.set('penciTOC_hidetoc', null, {path: '/'});
                            }

                            toc.show('fast');
                            wrapper.removeClass('hide-table').addClass('show-table');

                        }

                    });

                    stoggle.data('visible', false);
                    stoc.hide();
                    mswrapper.addClass('hide-table');

                    stoggle.off().on('click', function (event) {
                        event.preventDefault();
                        if ($(this).data('visible')) {
                            $(this).data('visible', false);
                            stoc.hide('fast');
                            swrapper.removeClass('show-table').addClass('hide-table');
                            mswrapper.removeClass('show-table').addClass('hide-table');
                        } else {
                            $(this).data('visible', true);
                            stoc.show('fast');
                            swrapper.removeClass('hide-table').addClass('show-table');
                            mswrapper.removeClass('hide-table').addClass('show-table');
                        }
                    });
                });
            }

            // ======================================
            // Set active heading in penci-toc-widget list
            // ======================================

            var getPenciTocListElementLinkByHeading = function (heading) {
                return $('.penci-sticky-toc .penci-toc-list a[href="#' + $(heading).attr('id') + '"]');
            }

            var getHeadingToListElementLinkMap = function (headings) {
                return headings.reduce(function (map, heading) {
                    map[heading.id] = getPenciTocListElementLinkByHeading(heading);
                    return map;
                }, {});
            }

            var headings = $('span.penci-toc-section').toArray();
            var headingToListElementLinkMap = getHeadingToListElementLinkMap(headings);
            var listElementLinks = $.map(headingToListElementLinkMap, function (value, key) {
                return value
            });

            var getScrollOffset = function () {
                var scrollOffset = 5; // so if smooth offset is off, the correct title is set as active
                if (typeof PenciTOC.smooth_scroll != 'undefined' && parseInt(PenciTOC.smooth_scroll) === 1) {
                    scrollOffset = (typeof PenciTOC.scroll_offset != 'undefined') ? parseInt(PenciTOC.scroll_offset) : 30;
                }

                var adminbar = $('#wpadminbar');

                if (adminbar.length) {
                    scrollOffset += adminbar.height();
                }
                return scrollOffset;
            }

            var scrollOffset = getScrollOffset();

            var activateSetActivePenciTocListElement = function () {
                if (headings.length > 0 && $('.penci-sticky-toc').length) {
                    $(window).on('load resize scroll', setActivePenciTocListElement);
                }
            }

            activateSetActivePenciTocListElement();

            var setActivePenciTocListElement = function () {
                var activeHeading = getActiveHeading(scrollOffset, headings);
                if (activeHeading) {
                    var activeListElementLink = headingToListElementLinkMap[activeHeading.id];
                    removeStyleFromNonActiveListElement(activeListElementLink, listElementLinks);
                    setStyleForActiveListElementElement(activeListElementLink);
                }
            }

            var deactivateSetActivePenciTocListElement = function () {
                $(window).off('load resize scroll', setActivePenciTocListElement);
            }


            var getActiveHeading = function (topOffset, headings) {
                var scrollTop = $(window).scrollTop();
                var relevantOffset = scrollTop + topOffset + 1;
                var activeHeading = headings[0];
                var closestHeadingAboveOffset = relevantOffset - $(activeHeading).offset().top;
                headings.forEach(function (section) {
                    var topOffset = relevantOffset - $(section).offset().top;
                    if (topOffset > 0 && topOffset < closestHeadingAboveOffset) {
                        closestHeadingAboveOffset = topOffset;
                        activeHeading = section;
                    }
                });
                return activeHeading;
            }

            var removeStyleFromNonActiveListElement = function (activeListElementLink, listElementLinks) {
                listElementLinks.forEach(function (listElementLink) {
                    if (activeListElementLink !== listElementLink && listElementLink.parent().hasClass('active')) {
                        listElementLink.parent().removeClass('active');
                    }
                });
            }

            var setStyleForActiveListElementElement = function (activeListElementLink) {
                var activeListElement = activeListElementLink.parent();
                if (!activeListElement.hasClass('active')) {
                    activeListElement.addClass('active');
                }
            }
        }
    }

    penci_init_toc();

    $('body').on('single_loaded_more', function () {
        penci_init_toc();
    });
});
