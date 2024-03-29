(function ($) {
    'use strict';

    var ptfListStacked = {};
    qode.modules.ptfListStacked = ptfListStacked;

    ptfListStacked.qodeOnWindowLoad = qodeOnWindowLoad;
    ptfListStacked.qodeOnWindowResize = qodeOnWindowResize;
	ptfListStacked.qodeInitPortfolioListStacked = qodeInitPortfolioListStacked;

    $(window).on('load', qodeOnWindowLoad);
    $(window).resize(qodeOnWindowResize);

    /*
     All functions to be called on $(window).load() should be in this function
     */
    function qodeOnWindowLoad() {
        qodeInitPortfolioListStacked().init();
    }

    /*
     All functions to be called on $(window).resize() should be in this function
     */
    function qodeOnWindowResize() {
        qodeInitPortfolioListStacked().resize();
    }

    /**
     * Initializes portfolio list stacked
     */
    function qodeInitPortfolioListStacked() {
        var holder = $('#qode-portfolio-list-stacked');
        
        if (holder.length) {
            //items
            holder.items = holder.find('.qode-pls-item');
            holder.total = holder.items.length;
            holder.textItems = holder.find('.qode-pls-text-item');
            holder.imgs = holder.find('img');
            holder.info = $('#qode-pls-info');
            holder.endOfScrollVisible = false;
            holder.endOfScroll = holder.find('.qode-pls-end-of-scroll');
            //state
            holder.activeIndex = 0;
            holder.activeText = holder.textItems.first();
            holder.direction = null;
            //move
            holder.deltaY = 0;
            //tilt
            holder.tilt = 30;
            holder.tX = 0;
            holder.tY = 0;
            //item move
            holder.items.each(function () {
                $(this).data('move', 0);
                $(this).data('buffer', 0);
            });
        }

        var setIndexes = function () {
            holder.items.each(function () {
                var item = $(this);

                item.css({
                    'z-index': holder.total - item.data('index')
                });
            })
        }

        var setWidth = function () {
            var c = 1;
            if (qode.windowWidth <= 1440 && qode.windowWidth > 1024) c = 0.65;
            if (qode.windowWidth <= 1024 && qode.windowWidth > 768) c = 0.5;
            if (qode.windowWidth <= 768 && qode.windowWidth > 414) c = 0.4;
            if (qode.windowWidth <= 414 && qode.windowWidth > 320) c = 0.25;
            if (qode.windowWidth <= 320) c = .2;

            holder.items.each(function () {
                var el = $(this),
                    w = (el.find('img')[0].naturalWidth / Math.min(qode.windowWidth, 1920) * 100).toFixed(2),
                    h = (el.find('img')[0].naturalHeight / Math.min(qode.windowHeight, 1080) * 100).toFixed(2);

                var css = {
                    'width': w * c + '%',
                    'height': h * c + '%'
                };
                el.css(css);
            })
        };

        var positionItems = function () {
            holder.items.each(function () {
                var item = $(this),
                    inner = item.find('.qode-pls-item-inner'),
                    x = qode.windowWidth >= 1200 ? parseInt(item.data('x')) : parseInt(item.data('x')) * .88,
                    y = qode.windowWidth > 1024 ? parseInt(item.data('y')) : parseInt(item.data('y')) + 20;

                var offsets = {
                    'top': (y || 50) + '%',
                    'left': (x || 50) + '%',
                }

                item.css(offsets);
                inner.css('transform', 'translateX(' + parseInt(isNaN(x) ? -50 : 0) + '%) translateY(' + parseInt(isNaN(y) ? -50 : 0) + '%)');
            });
        };

        var offScreen = function (item) {
            return item.offset().top <= -item.height() * 0.97
        }

        var showEndOfScroll = function () {
            holder.endOfScrollVisible = true;
            holder.endOfScroll.addClass('qode-visible');
            holder.addClass('qode-eos');
        };

        var hideEndOfScroll = function () {
            holder.endOfScrollVisible = false;
            holder.endOfScroll.removeClass('qode-visible');
            holder.removeClass('qode-eos');
        };

        var getActiveItem = function () {
            holder.items.removeClass('qode-active');
            return holder.items.filter(function () {
                return $(this).data('index') == holder.activeIndex
            });
        };

        var setActiveText = function () {
            holder.textItems.removeClass('qode-active');
            holder.activeText = holder.textItems.filter(function () {
                return $(this).data('index') == holder.activeIndex
            }).addClass('qode-active');
        };

        var movement = function () {
            var activeItem = holder.items.filter(function () {
                return $(this).data('index') == holder.activeIndex
            });

            if (holder.direction == 'next' && offScreen(activeItem.find('img'))) {
                holder.activeIndex++;
                if (holder.activeIndex == holder.total) holder.deltaY = 0;
                holder.activeIndex = Math.min(holder.activeIndex, holder.total - 1);
                activeItem = getActiveItem();
            } else if (holder.direction == 'prev') {
                if (activeItem.data('move') == 0) {
                    holder.endOfScrollVisible && hideEndOfScroll();
                    holder.activeIndex--;
                    holder.activeIndex = Math.max(holder.activeIndex, 0);
                    activeItem = getActiveItem();
                }
            }

            !holder.endOfScrollVisible &&
                holder.direction == 'next' &&
                holder.activeIndex == holder.total - 1 &&
                Math.abs(activeItem.data('move')) > activeItem.find('img').height() * 0.1 &&
                showEndOfScroll();

            holder.activeText.data('index') !== holder.activeIndex && setActiveText();

            activeItem
                .addClass('qode-active')
                .data('move', Math.min(activeItem.data('move') + holder.deltaY, 0))
                .css('transform', 'translate3d(0,' + Math.round(activeItem.data('move') - activeItem.data('buffer') * 0.2) + 'px,0)')
                .data('buffer', Math.abs(activeItem.data('move')));
        };

        var tiltImages = function () {
            holder.items.each(function (i) {
                var img = $(this).find('img'),
                    valX = Math.round(holder.tX * holder.tilt * (i + 1)),
                    valY = Math.round(holder.tY * holder.tilt * (i + 1));

                img.css('transform', 'translateX(' + valX + 'px) translateY(' + valY + 'px)');
            });
        };

        var mouseWheel = function (e) {
            holder.direction = -e.deltaY < 0 ? 'next' : 'prev';
            holder.deltaY = -e.deltaY;
            if (Math.abs(holder.deltaY) == 3) holder.deltaY = holder.deltaY * 10; //ffox
            requestAnimationFrame(movement);
        };

        var mouseMove = function (e) {
            holder.tX = 0.5 - e.screenX / qode.windowWidth;
            holder.tY = 0.5 - e.screenY / qode.windowHeight;
            requestAnimationFrame(tiltImages);
        };

        var touchStart = function (e) {
            holder.data('y-start', parseInt(e.changedTouches[0].clientY));
        };

        var touchMove = function (e) {
            holder.data('y-end', parseInt(e.changedTouches[0].clientY));
            holder.deltaY = holder.data('y-end') - holder.data('y-start');
            holder.direction = holder.deltaY < 0 ? 'next' : 'prev';
            holder.deltaY = Math.min(Math.max(holder.deltaY, -20), 100);
            requestAnimationFrame(movement);
        };

        var fixedInfo = function (e) {
            var moveInfo = function (x, y) {
                holder.info.css({
                    'transform': 'translate3d(' + x + 'px, ' + y + 'px, 0)'
                });
            };

            var handleMove = function (e) {
                var x = e.clientX,
                    y = e.clientY;

                requestAnimationFrame(function () {
                    moveInfo(x, y);
                });
            };

            var changeInfo = function (e) {
                var index = $(e.currentTarget).closest(holder.items).data('index');
                if (holder.info.data('active') !== index) {
                    var activeItem = holder.textItems.filter(function () {
                            return $(this).data('index') == index
                        }),
                        titleText = activeItem.find('.qode-pls-title-holder').html();

                    holder.info
                        .data('active', index)
                        .addClass('qode-show');
                    holder.info
                        .find('.qode-pls-title-holder')
                        .html(titleText);
                }

                //custom
                $('.qode-page-header').css('pointer-events', 'none');
            };

            var hideInfo = function (e) {
                holder.info
                    .data('active', null)
                    .removeClass('qode-show');

                //custom
                $('.qode-page-header').css('pointer-events', 'auto');
            };

            holder.on('mousemove', handleMove);
            holder.on('mousemove', 'img', changeInfo);
            holder.on('mouseleave', 'img', hideInfo)
        };

        return {
            init: function () {
                if (holder.length) {
	                $('html').addClass('qode-overflow');
                    holder.items.first().addClass('qode-active');
                    holder.textItems.first().addClass('qode-active');
                    setWidth();
                    positionItems();
                    setIndexes();
                    holder.waitForImages(function () {
                        holder.addClass('qode-loaded');
                        //scroll support
                        if (!Modernizr.touch) {
                            document.body.addEventListener('wheel', mouseWheel);
                            document.body.addEventListener('mousemove', mouseMove);
                            fixedInfo();
                        }
                        //touch support 
                        if (Modernizr.touch) {
                            holder[0].addEventListener('touchstart', touchStart);
                            holder[0].addEventListener('touchmove', touchMove);
                        }
                    })
                }
            },
            resize: function () {
                if (holder.length) {
                    positionItems();
                    setWidth();
                }
            }
        };
    }
    
})(jQuery);