/* Debounce */
(
  function (b, c) {
    var $ = b.jQuery || b.Cowboy || (
      b.Cowboy = {}
    ), a
    $.throttle = a = function (e, f, j, i) {
      var h, d = 0
      if (typeof f !== 'boolean') {
        i = j
        j = f
        f = c
      }

      function g () {
        var o = this, m = +new Date() - d, n = arguments

        function l () {
          d = +new Date()
          j.apply(o, n)
        }

        function k () {
          h = c
        }

        if (i && !h) {
          l()
        }
        h && clearTimeout(h)
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
    }
    $.debounce = function (d, e, f) {
      return f === c ? a(d, e, false) : a(d, f, e !== false)
    }
  }
)(this);

/* global PENCILOCALIZE */
(
  function ($) {
    'use strict'
    var PENCI = PENCI || {}

    /* General functions
 ---------------------------------------------------------------*/
    PENCI.general = function () {
      // Top search
      $('.pcheader-icon a.search-click').on('click', function (e) {
        var $this = $(this),
          $body = $('body'),
          $container = $this.closest('.container')

        $('body').find('.search-input').removeClass('active')
        $container.find('.search-input').toggleClass('active')

        if ($body.find('.header-search-style-overlay').length ||
          $body.find('.header-search-style-showup').length) {
          $container.find('.show-search').toggleClass('active')
        } else {
          $this.next().fadeToggle()
        }

        var opentimeout = setTimeout(function () {
          var element = document.querySelector('.search-input.active')
          if (element !== null) {
            element.focus({
              preventScroll: true,
            })
          }
        }, 200, function () {
          clearTimeout(opentimeout)
        })

        $body.addClass('search-open')
        e.preventDefault()
        e.stopPropagation()
        return false
      })

      $('.pcheader-icon .close-search').on('click', function (e) {

        if ($('body').find('.header-search-style-overlay').length ||
          $('body').find('.header-search-style-showup').length) {
          $('body').find('.show-search').each(function () {
            $(this).removeClass('active')
          })
        } else {
          $(this).closest('.show-search').fadeToggle()
        }
        $('body').removeClass('search-open')
        $('body').find('.search-input').each(function () {
          $(this).removeClass('active')
        })
        return false
      })

      $(document).keyup(function (e) {
        var bd = $('body')
        if (e.key === 'Escape' && bd.hasClass('pchds-overlay') &&
          bd.hasClass('search-open')) {
          bd.removeClass('search-open')
          if ($('body').find('.header-search-style-overlay').length ||
            $('body').find('.header-search-style-showup').length) {
            $('body').find('.show-search').each(function () {
              $(this).removeClass('active')
            })
          } else {
            $('body').find('.show-search').fadeToggle()
          }
          $('body').find('.search-input, .show-search').each(function () {
            $(this).removeClass('active')
          })
        }
        return false
      })

      // Go to top
      $('.go-to-top, .penci-go-to-top-floating').on('click', function () {
        $('html, body').animate({ scrollTop: 0 }, 700)
        return false
      })

      // Go to top button
      var $goto_button = $('.penci-go-to-top-floating')
      if ($goto_button.length) {
        $(document).on('scroll', $.debounce(200, function () {
          var y = $(this).scrollTop()
          if (y > 300) {
            $goto_button.addClass('show-up')
          } else {
            $goto_button.removeClass('show-up')
          }
        }))
      }

      // Call back fitvid when click load more button on buddypress
      $('body.buddypress .activity .load-more a').on('click', function () {
        $(document).ajaxStop(function () {
          $('.container').fitVids({ ignore: '.penci-sticky-video' })
        })
      })

      document.addEventListener('DOMContentLoaded', function () {
        document.querySelectorAll('.menu-item-has-anchor').forEach(function (item) {
          const offset = -120;
          const anchor = item.querySelector('a');
      
          if (!anchor) return;
      
          const href = anchor.getAttribute('href');
          if (!href || !href.startsWith('#')) return;
      
          const target = document.querySelector(href);
      
          if (!target) {
            console.error('Target element not found for:', href);
            return;
          }
      
          anchor.addEventListener('click', function (e) {
            e.preventDefault();
            $('body').removeClass('open-sidebar-nav penci-menuhbg-open open-mobile-builder-sidebar-nav');
      
            const targetOffset = target.getBoundingClientRect().top + window.pageYOffset;
      
            console.log('Scrolling to:', targetOffset); // Debug
      
            window.scrollTo({
              top: targetOffset + offset,
              behavior: 'smooth',
            });
          });
        });
      });
      
      

      $('#pc_archive_sort').on('change', function (e) {
        var form = $(this).closest('form')
        form.submit()
      })

      $(document).on('click', '.pcauthor-tabs', function (e) {
        e.preventDefault()

        if ($(this).hasClass('active')) {
          return
        }

        var tab = $(this).attr('data-tab'),
          wrapper = $(this).closest('.post-author')

        wrapper.find('.author-tab-content').removeClass('active')
        wrapper.find('.pcauthor-tabs').removeClass('active')
        wrapper.find('#' + tab).addClass('active')
        $(this).addClass('active')
      })

      $(document).
        on('click', '.penci-category-description-button a', function (e) {
          e.preventDefault()
          $(this).closest('.penci-category-description').toggleClass('active')
        })

      $(document).on('click', '.penci-wuser-gps', function (e) {
        e.preventDefault()
        var t = $(this),
          parent = t.closest('.penci-weather-widget'),
          id = parent.attr('data-id'),
          forecast_days = parent.attr('data-forecast_days'),
          units = parent.attr('data-units')

        parent.addClass('loading')

        $.ajax({
          type: 'GET',
          url: ajax_var_more.url,
          data: {
            action: 'penci_get_weather_loc',
            id: id,
            forecast_days: forecast_days,
            units: units,
          },
          success: function (response) {
            var z = response.data.html,
              v = $(z).html()
            parent.html(v)
            parent.removeClass('loading')
          },
        })
      })

      $(document).on('click','.pc-comment-s1-button a',function(e) {
        e.preventDefault()
        $('.pc-comment-s1').toggleClass('active')
      })
      
      $(document).on('click','.new-ver-share.post-share-link',function(e) {
        e.preventDefault()
        var link = $(this).attr('href');
        navigator.clipboard.writeText(link);
      })

      $(document).on('click','.penci_cmrm',function(e){
        e.preventDefault()
        $(this).closest('.comment-text').addClass('showfull')
        $(this).remove()
      })

      $(document).on('click','.penci-mtp-filters-mobile',function(e){
        e.preventDefault()
        $(this).addClass('active')
        $('.penci-mtp-filters-main').addClass('active')
        $('.penci-mtp-filters-close').addClass('active')
      })

      $(document).on('click','.penci-mtp-filters-close',function(e){
        e.preventDefault()
        $(this).removeClass('active')
        $('.penci-mtp-filters-mobile').removeClass('active')
        $('.penci-mtp-filters-main').removeClass('active')
      })

      $(document).on('click','.penci-post-share-box-btn',function(e){
        e.preventDefault()
        var t = $(this).closest('.list-post-3')
        t.find('.penci-post-box-meta').toggleClass('active')
      })
      
      $(document).on('click','.penci-bmca',function(e){
        e.preventDefault()
        var t = $(this).closest('.penci-sg-cth')
        t.addClass('show-full')
        $(this).remove()
      })
      return false
    }

    PENCI.rdatetime = function () {
      function formatDate(date, format, locale = 'en-US') {
        const map = {
            'd': ('0' + date.getDate()).slice(-2),           // Day of the month (01 to 31)
            'D': date.toLocaleDateString(locale, { weekday: 'short' }),  // Short textual day
            'j': date.getDate(),                             // Day of the month (1 to 31)
            'l': date.toLocaleDateString(locale, { weekday: 'long' }),   // Full textual day
            'F': date.toLocaleDateString(locale, { month: 'long' }),     // Full textual month
            'm': ('0' + (date.getMonth() + 1)).slice(-2),    // Month (01 to 12)
            'M': date.toLocaleDateString(locale, { month: 'short' }),    // Short month (Jan, Feb)
            'n': date.getMonth() + 1,                        // Month without leading zeros (1 to 12)
            'Y': date.getFullYear(),                         // Full year (2024)
            'y': ('' + date.getFullYear()).slice(-2),        // Short year (24)
            'H': ('0' + date.getHours()).slice(-2),          // 24-hour format (00 to 23)
            'h': ('0' + (date.getHours() % 12 || 12)).slice(-2),  // 12-hour format (01 to 12)
            'i': ('0' + date.getMinutes()).slice(-2),        // Minutes (00 to 59)
            's': ('0' + date.getSeconds()).slice(-2),        // Seconds (00 to 59)
            'a': date.getHours() < 12 ? 'am' : 'pm',         // am/pm lowercase
            'A': date.getHours() < 12 ? 'AM' : 'PM',         // AM/PM uppercase
        };

        return format.replace(/[a-zA-Z]/g, function(match) {
            return map[match] !== undefined ? map[match] : match;
        });
      }

      function applyRealTimeDate() {
        const locale = document.documentElement.lang || 'en-US';

        const elements = document.querySelectorAll('.penci-dtf-real');

        elements.forEach(el => {
            const format = el.getAttribute('data-format');

            const currentDate = new Date();

            const formattedDate = formatDate(currentDate, format, locale);

            el.textContent = formattedDate;
        });
      }

      applyRealTimeDate();

    }

    PENCI.videofloat = function () {
      $('body.single .post').each(function (e) {

        var wrapper = $(this),
          t = wrapper.find('.post-image'),
          h = t.height(),
          f = t.find('iframe'),
          p

        if (f.length && ajax_var_more.vfloat) {

          t.addClass(ajax_var_more.vfloatp)

          var z = h + t.offset().top

          $(document).on('scroll', function () {

            if (t.hasClass('disable-sticky')) {
              return
            }
            var y = $(this).scrollTop()
            if (y > z) {
              t.addClass('stick-video-enable')
              if (t.find('.stick-video-enable-remove').length == 0) {
                t.append(
                  '<span class="stick-video-enable-remove"><i class="penciicon-close-button"></i></span>')
              }
              if (!wrapper.hasClass('penci-apply-padding')) {
                wrapper.addClass('penci-apply-padding').css('padding-top', h)
              }
            } else {
              t.removeClass('stick-video-enable')
              t.find('.stick-video-enable-remove').remove()
              wrapper.removeClass('penci-apply-padding')
              wrapper.css('padding-top', 0)
            }
          })
        }

      })

      $(document).on('click', '.stick-video-enable-remove', function (e) {
        e.preventDefault()
        var t = $(this).closest('.post-image')

        t.find('.stick-video-enable-remove').remove()
        t.removeClass('stick-video-enable').addClass('disable-sticky')
      })

      $(document).on('mouseenter', '.penci-preview-thumb', function () {
        var t = $(this),
          w = t.outerHeight() * 16 / 9,
          h = t.outerHeight(),
          type = $(this).attr('data-type'),
          url = $(this).attr('data-url')

        if (t.find('video').length == 0 && type == 'self') {
          t.append('<video src="' + url + '" loop muted></video>')
        }

        if (t.find('iframe').length == 0 && type !== 'self') {
          t.append('<div class="penci-preview-iframe"><iframe src="' + url +
            '" frameborder="0"></iframe></div>')
          $(this).find('iframe').width(w).height(h).fadeIn()
        }

        if ($(this).find('video').length !== 0) {
          $(this).find('video').fadeIn()
          $(this).find('video')[0].play()
        }

        if ($(this).find('iframe').length !== 0) {
          $(this).find('iframe').fadeIn()
        }

      }).on('mouseleave', '.penci-preview-thumb', function () {
        if ($(this).find('video').length !== 0) {
          $(this).find('video')[0].pause()
          $(this).find('video').fadeOut()
        }
        if ($(this).find('iframe').length !== 0) {
          $(this).find('iframe').fadeOut()
        }
      })
    }

    /* Font Size Changer
---------------------------------------------------------------*/
    PENCI.fontsizeChanger = function () {

      if ($('.penci-font-changer').length) {

        var c = Cookies.get('penci-font-changer') ? Cookies.get(
            'penci-font-changer') : 1,
          pr = $('.penci-font-changer'),
          w = $('#main').width(),
          step = .1

        if ($('body').hasClass('elementor-default')) {
          w = $('article.post').width()
        }

        pr.attr('data-size', c)

        var penci_apply_fontsize = function ($csize = null) {
          var size = parseFloat(pr.attr('data-size'))

          size = $csize ? parseFloat($csize) : size

          size = size > 1.5 ? size = 1.5 : (
            size < -1.5 ? size = -1.5 : size
          )

          $('.entry-content').css({
            'transform': 'scale(' + size + ')',
            'transform-origin': '0 0 0',
            'overflow': 'hidden',
            'width': parseInt(w / size) + 'px',
          })

          if ($('body').hasClass('rtl')) {
            $('.entry-content').css({
              'transform-origin': '100% 0',
            })
          }

          $('.entry-content p,.entry-content iframe,.entry-content audio,.entry-content div,.entry-content ol, .entry-content ul, .entry-content blockquote, .entry-content h1, .entry-content h1, .entry-content h2, .entry-content h3, .entry-content h4, .entry-content h5, .entry-content h6').
            css({
              'max-width': parseInt(w / size) + 'px',
            })

          if ($('.entry-content .penci-toc-container-wrapper').length) {
            $('.penci-toc-container-wrapper, .penci-toc-container-wrapper div, .penci-toc-container-wrapper ul, .penci-toc-container-wrapper span, .penci-toc-container-wrapper p').
              css({ 'max-width': '' })
          }

          $('.penci-single-block').each(function(e){
              
            if ( ! $(this).hasClass('pcapply_fs') ) {
            
                $(this).addClass('pcapply_fs');
                
                var t = $(this).find('.entry-content'),
                    p = $(this).find('.post-entry'),
                    h = t[0].getBoundingClientRect().height;
  
                    p.css({
                      'height': h + 'px',
                      'transform': 'none',
                    })
                
            }

          });
        }

        penci_apply_fontsize()

        if ($.isFunction($.fn.jRange)) {
          var def = Cookies.get('penci-font-changer') ? Cookies.get(
            'penci-font-changer') : '1'
          $('.penci-font-changer-slider').each(function () {
            $(this).jRange({
              from: 0.5,
              to: 1.5,
              step: 0.1,
              scale: [0.5, 0, 1.0, 1.5],
              format: '%s',
              width: 120,
              showLabels: false,
              showScale: false,
              snap: true,
              theme: 'penci-fs-slider',
              onstatechange: function (size) {
                penci_apply_fontsize(size)
                Cookies.set('penci-font-changer', size)
              },
            })
            $(this).jRange('setValue', def)
          })
        }

        $('body').on('single_loaded_more', function (e) {
          penci_apply_fontsize()
          if ($.isFunction($.fn.jRange)) {
            var def = Cookies.get('penci-font-changer') ? Cookies.get(
              'penci-font-changer') : '1'
            $('.penci-font-changer-slider').each(function () {
              $(this).jRange({
                from: 0.5,
                to: 1.5,
                step: 0.1,
                scale: [0.5, 0, 1.0, 1.5],
                format: '%s',
                width: 120,
                showLabels: false,
                showScale: false,
                snap: true,
                theme: 'penci-fs-slider',
                onstatechange: function (size) {
                  penci_apply_fontsize(size)
                  Cookies.set('penci-font-changer', size)
                },
              })
              $(this).jRange('setValue', def)
            })
          }
        })

        $(document).on('click', '.penci-font-changer-reset', function (e) {
          e.preventDefault()
          $('.penci-font-changer-slider').jRange('setValue', '1')
          Cookies.set('penci-font-changer', 1)
        })

        $(document).on('click', '.penci-font-changer-btn', function (e) {
          e.preventDefault()
          $(this).closest('.penci-font-changer-popup').addClass('active')
        })

        $(document).on('click', function (e) {
          var container = $('.penci-font-changer-popup')

          if (!container.is(e.target) && container.has(e.target).length === 0) {
            container.removeClass('active')
          }
        })
      }

    }

    /* Block Heading Lists
 ---------------------------------------------------------------*/
    PENCI.blockheadinglist = function () {
      $('.pcnav-lgroup').each(function () {
        var lgroup = $(this),
          maintitle = $(this).closest('.penci-homepage-title'),
          maintitlew = maintitle.width(),
          mainwrap = lgroup.find('ul.pcflx'),
          titlew = maintitle.find('.inner-arrow span').width(),
          nav = maintitle.find('.pcflx-nav').length ? maintitle.find(
            '.pcflx-nav').width() : 0,
          maxwidthc = 0,
          childlists = $(
            '<li class="more"><a class="more-click" href="#"><i class="fa fa-ellipsis-v"></i></a><ul class="pcflx-sub"></ul></li>'),
          width = maintitlew - titlew - nav,
          oldlist

        if (maintitle.hasClass('pcalign-center')) {
          width = maintitlew / 2 - titlew / 2 - 30
        }

        if (maintitle.hasClass('pciconp-left') ||
          maintitle.hasClass('pciconp-right')) {
          width = width - 36
        }

        lgroup.css('width', width)

        //reset
        oldlist = mainwrap.find('.pcflx-sub').html()
        mainwrap.find('.more').remove()
        mainwrap.append(oldlist)

        mainwrap.find('li').each(function () {
          maxwidthc = maxwidthc + $(this).outerWidth()
          if (maxwidthc > width - 60) {
            $(childlists).find('.pcflx-sub').append($(this))
          }
        })
        if ($(childlists).find('.pcflx-sub li').length) {
          mainwrap.append(childlists)
        }
        maintitle.parent().addClass('pc-flexmnld')
        lgroup.addClass('loaded')
      })
      $(document).on('click', '.pcnav-lgroup .more-click', function (e) {
        e.preventDefault()
      })

      $('.pcnav-lgroup a').on('click', function () {
        var t = $(this),
          pr = t.closest('.pcnav-lgroup')

        if (!t.hasClass('pcaj-nav-link')) {
          pr.find('a').removeClass('clactive')
          t.addClass('clactive')
        }

      })
    }

    /* Share Expand
 ---------------------------------------------------------------*/
    PENCI.shareexpand = function () {

      if (!$('.tags-share-box').length) {
        return
      }

      $('.tags-share-box').each(function () {
        var tag = $(this)

        if (tag.hasClass('disable-btnplus')) {
          tag.css('opacity', '1')
          return
        }

        if (tag.length) {
          var sharew = 0,
            sexpand = false,
            maxw = tag.width(),
            $count = 1,
            exspace,
            dsharew = tag.find('.post-share-expand').outerWidth()

          if (tag.find('.penci-social-share-text').length) {
            maxw = maxw - tag.find('.penci-social-share-text').outerWidth(true)
          }

          if (tag.find('.post-share-plike').length) {
            maxw = maxw - tag.find('.post-share-plike').outerWidth(true)
          }

          if (tag.find('.new-ver-share').length) {
            exspace = tag.find('.new-ver-share').outerWidth(true) -
              tag.find('.new-ver-share').outerWidth()
          }

          tag.find('.post-share-expand').
            removeClass('auto-hidden').
            removeClass('showing').
            removeClass('hidden')

          tag.find('.new-ver-share').each(function () {
            $(this).removeClass('auto-hidden').removeClass('show')
            sharew += $(this).outerWidth(true)
            if (sharew > maxw + exspace) {
              $(this).addClass('auto-hidden').removeClass('show')
              sexpand = true
            } else {
              $(this).removeClass('auto-hidden').addClass('show')
            }
            $count++
          })

          if (sexpand) {
            tag.find('.post-share-expand').
              removeClass('auto-hidden').
              addClass('showing')

            tag.find('.new-ver-share.show').each(function () {
              dsharew += $(this).outerWidth(true)
              if (dsharew >= maxw - exspace) {
                $(this).addClass('auto-hidden').removeClass('show')
              }
            })

          } else {
            tag.find('.post-share-expand').addClass('hidden')
          }

          $('.post-share-item.post-share-expand').
            off().
            on('click', function (e) {
              e.preventDefault()
              var parent = $(this).closest('.post-share')
              parent.find('.auto-hidden').toggleClass('active')
              parent.toggleClass('showing-hidden')
            })

          tag.css('opacity', '1')
        }
      })

    }

    /* Smooth Scroll */
    PENCI.smoothlinkscroll = function () {
      $('a[href^="#"]').on('click', function (e) {
        // e.preventDefault();

        var target = this.hash,
          $target = $(target)

        $('html, body').stop().animate({
          'scrollTop': $target.offset().top - 70,
        }, 900, 'swing', function () {
          window.location.hash = target
        })
      })
    }
    /* Cookie Law
 ---------------------------------------------------------------*/
    PENCI.cookie = function () {
      var wrapCookie = '.penci-wrap-gprd-law',
        $wrapCookie = $(wrapCookie),
        classAction = 'penci-wrap-gprd-law-close',
        penciCookieName = 'penci_law_footer_new'

      if (!$wrapCookie.length) {
        return false
      }

      var penciCookie = {
        set: function (name, value) {
          var date = new Date()
          date.setTime(date.getTime() + (
            31536000000
          ))
          var expires = '; expires=' + date.toGMTString()
          document.cookie = name + '=' + value + expires + '; path=/'
        },
        read: function (name) {
          var namePre = name + '='
          var cookieSplit = document.cookie.split(';')
          for (var i = 0; i < cookieSplit.length; i++) {
            var cookie = cookieSplit[i]
            while (cookie.charAt(0) == ' ') {
              cookie = cookie.substring(1, cookie.length)
            }
            if (cookie.indexOf(namePre) === 0) {
              return cookie.substring(namePre.length, cookie.length)
            }
          }
          return null
        },
        erase: function (name) {
          this.set(name, '', -1)
        },
        exists: function (name) {
          return (
            this.read(name) !== null
          )
        },
      }

      $wrapCookie.removeClass('penci-close-all')
      if (!penciCookie.exists(penciCookieName) ||
        (
          penciCookie.exists(penciCookieName) && 1 ==
          penciCookie.read(penciCookieName)
        )) {
        $wrapCookie.removeClass(classAction)
      } else {
        $wrapCookie.addClass(classAction)
      }

      $('.penci-gprd-accept, .penci-gdrd-show').on('click', function (e) {
        e.preventDefault()

        var $this = $(this),
          $parent_law = $this.closest(wrapCookie)

        $parent_law.toggleClass(classAction)

        if ($parent_law.hasClass(classAction)) {
          penciCookie.set(penciCookieName, '2')
        } else {
          penciCookie.set(penciCookieName, '1')
        }

        return false
      })
    }

    /* Sticky main navigation
 ---------------------------------------------------------------*/
    PENCI.main_sticky = function () {
      if ($('nav#navigation').length && $().pensticky &&
        !$('nav#navigation').hasClass('penci-disable-sticky-nav')) {
        var spaceTop = 0
        if ($('body').hasClass('admin-bar')) {
          spaceTop = 32
        }
        $('nav#navigation').each(function () {
          $(this).pensticky({ topSpacing: spaceTop })
        })
      } // sticky
    }

    /* Homepage Featured Slider
 ---------------------------------------------------------------*/
    PENCI.featured_slider = function () {

      const owl_fslider_name = {}

      $('.featured-area .penci-owl-featured-area').each(function () {

        var $this = $(this),
          $style = $this.data('style'),
          $auto = false,
          $autotime = $this.data('autotime'),
          $speed = $this.data('speed'),
          $loop = $this.data('loop'),
          $item = 1,
          $slideby = 1,
          $nav = true,
          $dots = false,
          $rtl = false,
          $items_desktop = 1,
          $items_tablet = 1,
          $items_tabsmall = 1,
          $items_mobile = 1,
          $spaceBetween = 0,
          $ctyle = ajax_var.fcarousel_e,
          $sstyle = ajax_var.fslider_e,
          $id = 'fetured-swiper-' + Math.floor(Math.random() * (
            1 - 999999
          ) + 1) + 1

        if ($this.attr('data-id')) {
          $id = $this.attr('data-id')
        }

        $this.addClass($id)

        if ($this.hasClass('no-df-swiper')) {
          return
        }
        
        if ($this.hasClass('penci-owl-loaded')) {
          return
        }

        if ($this.attr('data-ceffect')) {
          $ctyle = $this.attr('data-ceffect')
        }

        if ($this.attr('data-seffect')) {
          $sstyle = $this.attr('data-seffect')
        }

        if ($('html').attr('dir') === 'rtl') {
          $rtl = true
        }
        if ($this.attr('data-auto') === 'true') {
          $auto = true
        }
        if ($this.attr('data-nav') === 'false') {
          $nav = false
        }
        if ($this.attr('data-dots') === 'true') {
          $dots = true
          $this.append('<div class="penci-owl-dots"></div>')
        }
        if ($this.attr('data-item')) {
          $item = parseInt($this.data('item'))
          $slideby = $item
        }
        if ($this.attr('data-desktop')) {
          $items_desktop = parseInt($this.data('desktop'))
        }
        if ($this.attr('data-tablet')) {
          $items_tablet = parseInt($this.data('tablet'))
        }
        if ($this.attr('data-tabsmall')) {
          $items_tabsmall = parseInt($this.data('tabsmall'))
        }
        if ($this.attr('data-mobile')) {
          $items_mobile = parseInt($this.data('mobile'))
        }
        if ($this.attr('data-slideby')) {
          $slideby = parseInt($this.data('slideby'))
        }

        if ($item > 1) {
          $this.addClass('swiper-multi-items')
        }

        let a = 0,
          e = $(this),
          t = !1

        var interleaveOffset = 0.5

        if ($style === 'style-2') {
          $spaceBetween = 10
          $loop = true
        } else if ($style === 'style-28') {
          $items_desktop = $item = 6
        } else if ($style === 'style-38') {
          $spaceBetween = 5
          $items_desktop = $item = 5
        } else if ($style === 'style-43') {
          $spaceBetween = 0
        }

        var swiper_arg = {
          loop: $loop,
          autoplay: $auto,
          spaceBetween: $spaceBetween,
          slidesPerView: $item,
          speed: $speed,
          slideActiveClass: 'active',
          watchSlidesProgress: true,
          navigation: {
            nextEl: '.' + $id + ' .owl-next',
            prevEl: '.' + $id + ' .owl-prev',
          },
          on: {
            init: function () {
              $this.addClass('penci-owl-loaded')
            },
            afterInit: function () {
              $this.addClass('penci-featured-loaded')
            },
            setTransition: function (swiper, speed) {

              if (swiper.slides) {

                for (var i = 0; i < swiper.slides.length; i++) {
                  if (swiper.slides[i].querySelector('.slide-inner') !== null &&
                    $sstyle == 'creative') {
                    swiper.slides[i].style.transition = speed + 'ms'
                    swiper.slides[i].querySelector(
                      '.slide-inner').style.transition = speed + 'ms'
                  }
                  if (swiper.slides[i].querySelector('.penci-swiper-mask') !==
                    null && $sstyle == 'creative') {
                    swiper.slides[i].style.transition = speed + 'ms'
                    swiper.slides[i].querySelector(
                      '.penci-swiper-mask').style.transition = speed + 'ms'
                  }
                }

              }

            },
            touchStart (...n) {
              if ($item > 1) {
                t = !0, e.on && e.on.touchStart && e.on.touchStart(...n)
              }
              var swiper = this
              for (var i = 0; i < swiper.slides.length; i++) {
                if (swiper.slides[i].querySelector('.slide-inner') !== null &&
                  $sstyle == 'creative') {
                  swiper.slides[i].style.transition = ''
                }
                if (swiper.slides[i].querySelector('.penci-swiper-mask') !==
                  null && $sstyle == 'creative') {
                  swiper.slides[i].style.transition = ''
                }
              }
            },
            touchEnd (...n) {
              if ($item > 1) {
                t = !1, e.on && e.on.touchStart && e.on.touchEnd(...n)
              }
            },
            progress (n, u) {
              if (t) {
                return
              }
              if ($item > 1 && $ctyle == 'swing') {
                n.on && n.on.progress && n.on.progress(n, u)
                const g = n.progress > a ? 'next' : 'prev'
                a = n.progress
                const y = n.params.speed / 16,
                  f = n.visibleSlidesIndexes ? n.visibleSlidesIndexes : [],
                  h = f[0],
                  m = f[f.length - 1],
                  v = (l, c) => {
                    g === 'next' && c >= h ? l.style.transitionDelay = `${(c -
                      h + 1) * y}ms` : g === 'prev' && c <= m + 1
                      ? l.style.transitionDelay = `${(m - c + 1) * y}ms`
                      : l.style.transitionDelay = `${0}ms`
                  }
                n.slides.forEach((l, c) => {
                  n.animating
                    ? (l.style.transitionDelay = '0ms', requestAnimationFrame(
                      () => {
                        v(l, c)
                      }))
                    : v(l, c)
                })
              }

              var swiper = this
              for (var i = 0; i < swiper.slides.length; i++) {
                var slideProgress = swiper.slides[i].progress
                var innerOffset = swiper.width * interleaveOffset
                var innerTranslate = slideProgress * innerOffset
                if (swiper.slides[i].querySelector('.slide-inner') !== null &&
                  $sstyle == 'creative') {
                  swiper.slides[i].querySelector(
                    '.slide-inner').style.transform = 'translate3d(' +
                    innerTranslate + 'px, 0, 0)'
                }
                if (swiper.slides[i].querySelector('.penci-swiper-mask') !==
                  null && $sstyle == 'creative') {
                  swiper.slides[i].querySelector(
                    '.penci-swiper-mask').style.transform = 'translate3d(' +
                    innerTranslate + 'px, 0, 0)'
                }
              }

            },
          },
        }

        if ($this.attr('data-slidespg')) {
          swiper_arg['slidesPerGroup'] = $this.attr('data-slidespg')
        }

        if ($auto) {
          swiper_arg['autoplay'] = {
            delay: $autotime,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }
        }

        if ($style === 'style-2' || $style === 'style-38') {
          swiper_arg['centeredSlides'] = true
          swiper_arg['loop'] = true
          swiper_arg['slidesPerView'] = 'auto'
        }

        if ($style === 'style-43' ) {
          swiper_arg['centeredSlides'] = true
          swiper_arg['loop'] = true
        }

        if ($this.find('.swiper-mark-item').length) {
          swiper_arg['parallax'] = true
        }

        if ($style === 'style-2') {
          swiper_arg['loopAddBlankSlides'] = true
          swiper_arg['watchSlidesProgress'] = false
          swiper_arg['centerInsufficientSlides'] = true
        }

        if ($style === 'style-38') {
          swiper_arg['loopAddBlankSlides'] = true
          swiper_arg['watchSlidesProgress'] = false
          swiper_arg['centerInsufficientSlides'] = true
        }

        if ($dots) {
          swiper_arg['pagination'] = {
            el: '.' + $id + ' .penci-owl-dots',
            type: 'bullets',
            bulletElement: 'div',
            clickable: true,
            bulletClass: 'penci-owl-dot',
            bulletActiveClass: 'active',
            renderBullet: function (index, className) {
              return '<div class="' + className + '"><span></span></div>'
            },
          }
        }

        if ($item == 1 && $style !== 'style-38') {

          if ($sstyle === 'creative') {
            swiper_arg['effect'] = 'slide'
          } else {
            swiper_arg['effect'] = $sstyle
          }
        }

        if ($style == 'style-28' || $style == 'style-2' || $style ==
          'style-38') {
          swiper_arg['effect'] = 'side'
          swiper_arg['slidesPerView'] = 'auto'
        }

        if (swiper_arg['effect'] == 'fade') {
          swiper_arg['fadeEffect'] = {
            crossFade: true,
          }
        }

        if ($ctyle == 'swing' && $item > 1) {
          swiper_arg['speed'] = $speed
          swiper_arg['loop'] = false

          if ($style !== 'style-38') {
            swiper_arg['rewind'] = true
          }

          swiper_arg['effect'] = 'creative'
          swiper_arg['followFinger'] = !1
          swiper_arg['creativeEffect'] = {
            limitProgress: 100,
            prev: {
              translate: ['-100%', 0, 0],
            },
            next: {
              translate: ['100%', 0, 0],
            },
          }
        }

        if (swiper_arg['slidesPerView'] !== 'auto') {
          swiper_arg['breakpoints'] = {
            0: {
              slidesPerView: $items_mobile,
            },
            480: {
              slidesPerView: $items_tabsmall,
            },
            768: {
              slidesPerView: $items_tablet,
            },
            1170: {
              slidesPerView: $items_desktop,
            },
          }
        }

        owl_fslider_name[$id] = new Swiper('.' + $id, swiper_arg)

        owl_fslider_name[$id].update()

        if ($this.attr('data-slideTo')) {
          owl_fslider_name[$id].slideTo($this.attr('data-slideTo'), 0)
        } else if ($style == 'style-38') {
          owl_fslider_name[$id].slideTo(4, 0)
        } else if ($style == 'style-2') {
          owl_fslider_name[$id].slideTo(4, 0)
        } else if ($style == 'style-43') {
          owl_fslider_name[$id].slideTo(2, 0)
        }

        if ($('body').hasClass('rtl')) {
          owl_fslider_name[$id].changeLanguageDirection('ltr')
        }
      })
    }

    /* Owl Slider General
 ---------------------------------------------------------------*/
    PENCI.owl_slider = function () {

      const owl_slider_name = {}

      $('.penci-owl-carousel-slider').each(function () {
        var $this = $(this),
          $parent = $this.parent(),
          $auto = true,
          $dots = false,
          $nav = true,
          $loop = true,
          $rtl = false,
          $items_desktop = 1,
          $items_tablet = 1,
          $items_tabsmall = 1,
          $items_mobile = 1,
          $speed = 600,
          $item = 1,
          $slideby = 1,
          $margin = 0,
          $autotime = 5000,
          $height = true,
          $datalazy = false,
          $carousel_effect = ajax_var.carousel_e,
          $slide_effect = ajax_var.slider_e,
          $direction = 'horizontal',
          $disable_effect = false,
          $e = false,
          $thumbs = $this.attr('data-thumbs'),
          $id = 'fetured-swiper-' + Math.floor(Math.random() * (
            1 - 999999
          ) + 1) + 1

        if ($this.hasClass('no-df')) {
          return
        }
        
        if ($this.hasClass('penci-owl-loaded')) {
          return
        }

        if ($this.hasClass('nav-thumb-creative')) {
          return
        }

        if ($this.hasClass('penci-featured-loaded')) {
          return
        }

        if ($this.attr('data-id')) {
          $id = $this.attr('data-id')
        }

        if ($this.attr('data-ceffect')) {
          $carousel_effect = $this.attr('data-ceffect')
        }

        if ($this.attr('data-seffect')) {
          $slide_effect = $this.attr('data-seffect')
        }

        $this.addClass($id)

        $this.find('.swiper-slide').removeClass('penci-ajrs-animate')

        if ($this.attr('data-nav') !== 'false') {
          $this.append(
            '<div class="penci-owl-nav"><div class="owl-prev"><i class="penciicon-left-chevron"></i></div><div class="owl-next"><i class="penciicon-right-chevron"></i></div></div>')
        }

        if ($('html').attr('dir') === 'rtl') {
          $rtl = true
        }
        if ($this.attr('data-dots') === 'true') {
          $dots = true
          if (!$this.find('.penci-owl-dots').length) {
            $this.append('<div class="penci-owl-dots"></div>')
          }
        }
        if ($this.attr('data-loop') === 'false') {
          $loop = false
        }
        if ($this.attr('data-nav') === 'false') {
          $nav = false
        }
        if ($this.attr('data-auto') === 'false') {
          $auto = false
        }

        if ($this.attr('data-margin')) {
          $margin = parseInt($this.data('margin'))
        }
        if ($this.attr('data-desktop')) {
          $items_desktop = $this.data('desktop') == 'auto' ? 'auto' : parseInt($this.data('desktop'))
        }
        if ($this.attr('data-tablet')) {
          $items_tablet = $this.data('tablet') == 'auto' ? 'auto' : parseInt($this.data('tablet'))
        }
        if ($this.attr('data-tabsmall')) {
          $items_tabsmall = $this.data('tabsmall') == 'auto' ? 'auto' : parseInt($this.data('tabsmall'))
        }
        if ($this.attr('data-mobile')) {
          $items_mobile = $this.data('mobile') == 'auto' ? 'auto' : parseInt($this.data('mobile'))
        }
        if ($this.attr('data-speed')) {
          $speed = parseInt($this.data('speed'))
        }
        if ($this.attr('data-autotime')) {
          $autotime = parseInt($this.data('autotime'))
        }
        if ($this.attr('data-item')) {
          $item = $slideby = parseInt($this.data('item'))
        }
        if ($this.attr('data-lazy')) {
          $datalazy = true
        }
        if ($this.attr('data-height')) {
          $height = $this.attr('data-height')
        }

        if ($this.attr('data-direction')) {
          $direction = $this.attr('data-direction')
        }

        if ( $direction == 'vertical' || $this.attr('data-e') == 'false' ) {
          $disable_effect = true;
        }

        let a = 0,
          t = !1

        var interleaveOffset = 0.5

        var swiper_arg = {
          loop: $loop,
          spaceBetween: $margin,
          slidesPerView: $item,
          speed: $speed,
          autoplay: $auto,
          pauseOnMouseEnter: true,
          autoHeight: $height,
          slideActiveClass: 'active',
          watchSlidesProgress: true,
          lazyLoading: $datalazy,
          direction: $direction,
          navigation: {
            nextEl: '.' + $id + ' .owl-next',
            prevEl: '.' + $id + ' .owl-prev',
          },
          breakpoints: {
            320: {
              slidesPerView: $items_mobile,
              direction: 'horizontal',
            },
            768: {
              slidesPerView: $items_tablet,
              direction: 'horizontal',
            },
            1170: {
              slidesPerView: $items_desktop,
            },
          },
          on: {
            init: function () {
              $this.addClass('penci-owl-loaded')
            },
            afterInit: function () {
              $this.addClass('penci-featured-loaded')
            },
            touchStart (slider) {

              if ($item > 1) {
                t = !0, slider.on && slider.on.touchStart &&
                slider.on.touchStart(slider)
              } else {
                var swiper = this
                for (var i = 0; i < swiper.slides.length; i++) {
                  if (swiper.slides[i].querySelector('.slide-inner') !== null &&
                    $slide_effect == 'creative') {
                    swiper.slides[i].style.transition = ''
                  }
                  if (swiper.slides[i].querySelector('.penci-swiper-mask') !==
                    null && $slide_effect == 'creative') {
                    swiper.slides[i].style.transition = ''
                  }
                }
              }
            },
            touchEnd (slider) {

              if ($item > 1) {
                t = !1, slider.on && slider.on.touchStart &&
                slider.on.touchEnd(slider)
              }
            },
            setTransition: function (swiper, speed) {

              if ( $disable_effect ) {
                return;
              }

              if (swiper.slides) {

                for (var i = 0; i < swiper.slides.length; i++) {

                  if (swiper.slides[i].querySelector('.slide-inner') !== null &&
                    $slide_effect == 'creative') {
                    swiper.slides[i].style.transition = speed + 'ms'
                    swiper.slides[i].querySelector(
                      '.slide-inner').style.transition = speed + 'ms'
                  }
                  if (swiper.slides[i].querySelector('.penci-ctslide-bg') !==
                    null && $slide_effect == 'creative') {
                    swiper.slides[i].style.transition = speed + 'ms'
                    swiper.slides[i].querySelector(
                      '.penci-ctslide-bg').style.transition = speed + 'ms'
                  }
                  if (swiper.slides[i].querySelector('.penci-swiper-mask') !==
                    null && $slide_effect == 'creative') {
                    swiper.slides[i].style.transition = speed + 'ms'
                    swiper.slides[i].querySelector(
                      '.penci-swiper-mask').style.transition = speed + 'ms'
                  }
                }

              }

            },
            progress (n, u) {
              if (t) {
                return
              }

              if ( $disable_effect ) {
                return;
              }

              if ($item > 1 && $carousel_effect === 'swing') {

                n.on && n.on.progress && n.on.progress(n, u)
                const g = n.progress > a ? 'next' : 'prev'
                a = n.progress
                const y = n.params.speed / 16,
                  f = n.visibleSlidesIndexes ? n.visibleSlidesIndexes : [],
                  h = f[0],
                  m = f[f.length - 1],
                  v = (l, c) => {
                    g === 'next' && c >= h ? l.style.transitionDelay = `${(c -
                      h + 1) * y}ms` : g === 'prev' && c <= m + 1
                      ? l.style.transitionDelay = `${(m - c + 1) * y}ms`
                      : l.style.transitionDelay = `${0}ms`
                  }
                n.slides.forEach((l, c) => {
                  n.animating
                    ? (l.style.transitionDelay = '0ms', requestAnimationFrame(
                      () => {
                        v(l, c)
                      }))
                    : v(l, c)
                })

              } else {

                var swiper = this
                for (var i = 0; i < swiper.slides.length; i++) {
                  var slideProgress = swiper.slides[i].progress
                  var innerOffset = swiper.width * interleaveOffset
                  var innerTranslate = slideProgress * innerOffset
                  if (swiper.slides[i].querySelector('.slide-inner') !== null &&
                    $slide_effect === 'creative') {
                    swiper.slides[i].querySelector(
                      '.slide-inner').style.transform = 'translate3d(' +
                      innerTranslate + 'px, 0, 0)'
                  }
                  if (swiper.slides[i].querySelector('.penci-ctslide-bg') !==
                    null && $slide_effect === 'creative') {
                    swiper.slides[i].querySelector(
                      '.penci-ctslide-bg').style.transform = 'translate3d(' +
                      innerTranslate + 'px, 0, 0)'
                  }
                  if (swiper.slides[i].querySelector('.penci-swiper-mask') !==
                    null && $slide_effect === 'creative') {
                    swiper.slides[i].querySelector(
                      '.penci-swiper-mask').style.transform = 'translate3d(' +
                      innerTranslate + 'px, 0, 0)'
                  }
                }
              }
            },
          },
        }

        if ($carousel_effect === 'swing' && $item > 1 && !$disable_effect) {
          $this.addClass('penci-swing-ef')
          swiper_arg['speed'] = $speed
          swiper_arg['loop'] = false
          swiper_arg['rewind'] = true
          swiper_arg['effect'] = 'creative'
          swiper_arg['followFinger'] = !1
          swiper_arg['creativeEffect'] = {
            limitProgress: 100,
            prev: {
              translate: ['-100%', 0, 0],
            },
            next: {
              translate: ['100%', 0, 0],
            },
          }
        } else if ($item == 1 && !$disable_effect) {
          swiper_arg['effect'] = $slide_effect
        }

        if ((
          swiper_arg['effect'] === 'flip' || swiper_arg['effect'] === 'cards'
        ) && $item == 1) {
          swiper_arg['loop'] = false
        }

        if (swiper_arg['effect'] === 'creative' && $item === 1) {
          swiper_arg['creativeEffect'] = {
            shadowPerProgress: true,
            prev: {
              translate: ['-100%', 0, 0],
              opacity: 0.5,
            },
            next: {
              translate: ['100%', 0, 0],
              opacity: 1,
            },
          }
        }

        if ($dots) {
          swiper_arg['pagination'] = {
            el: '.' + $id + ' .penci-owl-dots',
            type: 'bullets',
            bulletElement: 'div',
            clickable: true,
            bulletClass: 'penci-owl-dot',
            bulletActiveClass: 'active',
            renderBullet: function (index, className) {
              return '<div class="' + className + '"><span></span></div>'
            },
          }
        }

        if ($this.attr('data-thumbs-id')) {
          swiper_arg['thumbs'] = {
            swiper: owl_slider_name[$this.attr('data-thumbs-id')],
          }
        }

        if ($this.attr('data-thumb')) {
          swiper_arg['slideToClickedSlide'] = true
        }

        if ($parent.hasClass('penci-topbar-trending')) {

          swiper_arg['navigation'] = {
            nextEl: '.penci-slider-next',
            prevEl: '.penci-slider-prev',
          }

          swiper_arg['autoHeight'] = false

          if ($this.attr('data-anim')) {
            swiper_arg['slideActiveClass'] = 'animated'
          }

          if ($this.attr('data-anim') === 'slideInUp') {
            swiper_arg['effect'] = 'creative'
            swiper_arg['creativeEffect'] = {
              shadowPerProgress: true,
              prev: {
                translate: [0, '-100%', 0],
                opacity: 0,
              },
              next: {
                translate: [0, '100%', 0],
                opacity: 1,
              },
            }
          }

          if ($this.attr('data-anim') === 'slideInRight') {
            swiper_arg['effect'] = 'creative'
            swiper_arg['creativeEffect'] = {
              shadowPerProgress: false,
              perspective: true,

              prev: {
                translate: ['20px', 0, 0],
                opacity: 0,
              },
              next: {
                translate: ['20px', 0, 0],
                opacity: 0,
              },
            }
          }

          if ($this.attr('data-anim') === 'fadeIn') {
            swiper_arg['effect'] = 'fade'
            swiper_arg['fadeEffect'] = {
              crossFade: true,
            }
          }
        }

        if ($auto) {
          swiper_arg['autoplay'] = {
            delay: $autotime,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }
        }

        owl_slider_name[$id] = new Swiper('.' + $id, swiper_arg)

        if ($this.attr('data-thumbs-id')) {
          owl_slider_name[$this.attr('data-thumbs-id')].update()
        }

        owl_slider_name[$id].update()

      })

    }

    /* Slick Slider w Thumbnails
     ---------------------------------------------------------------*/
    PENCI.slick_slider = function () {

      $('.penci-image-gallery-thumbnail-slider').each(function () {

        var main_slider = $(this).find('.pcthumb-s-msl').attr('data-id'),
          thumb_slider = $(this).find('.pcthumb-s-csl').attr('data-id'),
          thumb_total = $(this).find('.pcthumb-s-csl').attr('data-total')

        var swiper_thumb_slider = new Swiper('.' + thumb_slider, {
          loop: true,
          slidesPerView: 'auto',
          spaceBetween: 0,
          slideToClickedSlide: true,
          on: {
            init: function (e) {
              $('.' + thumb_slider).addClass('slick-initialized')
            },
          },
          navigation: {
            nextEl: '.' + thumb_slider + ' .slick-next',
            prevEl: '.' + thumb_slider + ' .slick-prev',
          },
        })

        var swiper_slider = new Swiper('.' + main_slider, {
          slidesPerView: 1,
          autoHeight: true,
          loop: true,
          thumbs: {
            swiper: swiper_thumb_slider,
          },
          on: {
            init: function (e) {
              $('.' + main_slider).addClass('slick-initialized')
            },
            slideChange: function (e) {
              var number = e.realIndex,
                number = number == 0 ? 1 : number
              $('.' + thumb_slider).
                find('.pcslick-nav-area').
                find('.current').
                html(number)
            },
          },
        })

        swiper_thumb_slider.update()
        swiper_slider.update()

      })

    }

    /* Fitvids
 ---------------------------------------------------------------*/
    PENCI.fitvids = function () {
      // Target your .container, .wrapper, .post, etc.
      if ($().fitVids) {
        $('.container').fitVids({ ignore: '.penci-sticky-video' })
      }
    }

    /* Sticky sidebar
 ----------------------------------------------------------------*/
    PENCI.sticky_sidebar = function () {
      if ($().theiaStickySidebar) {
        var top_margin = 80
        if ($('body').hasClass('admin-bar') &&
          $('body').hasClass('penci-vernav-enable')) {
          top_margin = 52
        } else if (!$('body').hasClass('admin-bar') &&
          $('body').hasClass('penci-vernav-enable')) {
          top_margin = 20
        } else if ($('body').hasClass('admin-bar') &&
          !$('body').hasClass('penci-vernav-enable')) {
          top_margin = 112
        }

        if ($('.pc-wrapbuilder-header').length) {
          var headerdesktop = $('.penci_builder_sticky_header_desktop')
          top_margin = 20
          if (headerdesktop.length &&
            !headerdesktop.hasClass('hide-scroll-down')) {
            top_margin = headerdesktop.height() + 20
          }
          if ($('body').hasClass('admin-bar')) {
            top_margin = top_margin + 32
          }
        }

        $('.pc-container-sticky').each(function () {
          var t = $(this)
          if (t.find('.theiaStickySidebar').length === 0) {
            t.wrapInner('<div class="theiaStickySidebar"></div>')
          }
        })

        if ($(
          '.penci-vc-sticky-sidebar > .penci-vc-row > .penci-vc-column').length) {
          $('.penci-vc-sticky-sidebar > .penci-vc-row > .penci-vc-column').
            theiaStickySidebar({
              additionalMarginTop: top_margin,
              'minWidth': 961,
            })
        }

        if ($('.penci-enSticky .penci-sticky-sb').length) {
          $('.penci-enSticky .penci-sticky-sb,.penci-enSticky .penci-sticky-ct').
            theiaStickySidebar({
              additionalMarginTop: top_margin,
              'minWidth': 961,
            })
        }
        $('#main.penci-main-sticky-sidebar, #sidebar.penci-sticky-sidebar').
          theiaStickySidebar({
            // settings
            additionalMarginTop: top_margin,
          })
      } // if sticky
    }

    /* Mega menu
 ----------------------------------------------------------------*/
    PENCI.mega_menu = function () {
      // Hover parent
      $('#navigation ul.menu > li.penci-mega-menu').
        on('mouseenter', function () {
          var $this = $(this),
            $row_active = $this.find('.row-active'),
            $rowsLazy = $row_active.find('.penci-lazy')
          $row_active.fadeIn('200').css('display', 'inline-block')
        })

      $('#navigation .penci-mega-child-categories a').
        on('mouseenter', function () {
          if ($(this).hasClass('mega-normal-child')) {
            return
          }
          if (!$(this).hasClass('cat-active')) {
            var $this = $(this),
              $row_active = $this.data('id'),
              $parentA = $this.parent().children('a'),
              $parent = $this.closest('.penci-megamenu'),
              $rows = $this.closest('.penci-megamenu').
                find('.penci-mega-latest-posts').
                children('.penci-mega-row'),
              $rowsLazy = $rows.find('.penci-lazy')
            $parentA.removeClass('cat-active')
            $this.addClass('cat-active')
            $rows.hide()
            $rows.removeClass('row-active')
            $parent.find('.' + $row_active).
              fadeIn('300').
              css('display', 'inline-block').
              addClass('row-active')
          }
        })
    }

    PENCI.categories_lists = function () {
      // Add indicator

      $('.pc-advanced-cat li').each(function (e) {
        if ($(this).find('.children').length) {
          $(this).addClass('has-children')
          $(this).find('.children').hide()
          $(this).
            append('<u class="indicator"><i class="fa fa-angle-down"></i></u>')
        }
      })

      // indicator click
      $('.pc-advanced-cat .indicator').on('click', function (e) {
        var $this = $(this)
        e.preventDefault()
        $this.children().toggleClass('fa-angle-up')
        $this.closest('li').find('.children').slideToggle('fast')
      })

      $(document).on('mouseenter', '.penci-mega-menu', function (e) {
        var t = $(this),
            w = t.find('.penci-megamenu')
            if ( w.hasClass('loading') || t.hasClass('pcmn-ajxd') ) {
              return
            }
            if ( ! w.hasClass('loaded') ) {
              var menu = w.attr('data-menu'),
                  item = w.attr('data-item'),
                  catid = w.attr('data-catid'),
                  number = w.attr('data-number'),
                  style = w.attr('data-style'),
                  rid = w.attr('data-id'),
                  position = w.attr('data-position')

              w.addClass('loading')

              if ( menu && item && catid && number && style && rid && position ) {

                var save_name = 'penci_megamn_'+menu+item+catid+number+style+position;

                if (sessionStorage.getItem(save_name) ) {
                  w.append(sessionStorage.getItem(save_name))
                  w.removeClass('loading')
                  w.addClass('loaded')

                  var $row_active = w.find('.row-active')
                  $row_active.fadeIn('200').css('display', 'inline-block')

                  $('body').trigger('penci-ajax-menu-loaded')
                } else {

                  $.post(
                    ajax_var_more.url,
                    {
                      menu: menu,
                      item: item,
                      catid: catid,
                      number: number,
                      style: style,
                      position: position,
                      id: rid,
                      action: 'penci_html_mega_menu',
                    }, function (response) {
                      sessionStorage.setItem(save_name, response.data);
                      w.append(response.data)
                      w.removeClass('loading')
                      w.addClass('loaded')

                      var $row_active = w.find('.row-active')
                      $row_active.fadeIn('200').css('display', 'inline-block')

                      $('body').trigger('penci-ajax-menu-loaded')
                    }
                  )
                }
              }
            }
      })
    }

    /* Mobile AJAX Menu
    ----------------------------------------------------------------*/
    PENCI.mobile_ajax_menu = function () {
        $('.penci-megamenu').each(function (index, element) {
          var w = $(this);
              if ( w.hasClass('loadingm') ) {
                return
              }
              if ( ! w.hasClass('loaded') ) {
                var menu = w.attr('data-menu'),
                    item = w.attr('data-item'),
                    catid = w.attr('data-catid'),
                    number = w.attr('data-number'),
                    style = w.attr('data-style'),
                    rid = w.attr('data-id'),
                    position = w.attr('data-position')

                w.addClass('loadingm')

                if ( menu && item && catid && number && style && rid && position ) {

                  var save_name = 'penci_megamn_m_'+menu+item+catid+number+style+position;

                  if (sessionStorage.getItem(save_name) ) {
                    w.append(sessionStorage.getItem(save_name))
                    w.removeClass('loadingm')
                    w.addClass('loaded')

                    var $row_active = w.find('.row-active')
                    $row_active.fadeIn('200').css('display', 'inline-block')

                    $('body').trigger('penci-ajax-menu-loaded')
                  } else {

                    $.post(
                      ajax_var_more.url,
                      {
                        menu: menu,
                        item: item,
                        catid: catid,
                        number: number,
                        style: style,
                        position: position,
                        id: rid,
                        action: 'penci_html_mega_menu',
                      }, function (response) {
                        sessionStorage.setItem(save_name, response.data);
                        w.append(response.data)
                        w.removeClass('loadingm')
                        w.addClass('loaded')

                        var $row_active = w.find('.row-active')
                        $row_active.fadeIn('200').css('display', 'inline-block')

                        $('body').trigger('penci-ajax-menu-loaded')
                      }
                    )
                  }
                }
              }
        })
    }

    /* Mobile menu responsive
 ----------------------------------------------------------------*/
    PENCI.mobile_menu = function () {
      // Add indicator
      $('#sidebar-nav .menu li.menu-item-has-children > a').
        append('<u class="indicator"><i class="fa fa-angle-down"></i></u>')

      // Toggle menu when click show/hide menu
      $('#navigation .button-menu-mobile').on('click', function () {
        $('body').addClass('open-sidebar-nav')
      })

      // indicator click
      $('#sidebar-nav .menu li a .indicator').on('click', function (e) {
        if ($('body').hasClass('penci-vernav-cparent')) {
          return
        }
        var $this = $(this)
        e.preventDefault()
        $this.children().toggleClass('fa-angle-up')
        $this.parent().next().slideToggle('fast')
      })

      $('.penci-vernav-cparent #sidebar-nav .menu li.menu-item-has-children > a').
        on('click', function (e) {
          var $this = $(this)
          e.preventDefault()
          $this.children().children().toggleClass('fa-angle-up')
          $this.next().slideToggle('fast')
        })

      // Close sidebar nav
      $('body').on('click', '#close-sidebar-nav', function (e) {
        e.preventDefault()
        $('body').removeClass('open-sidebar-nav')
      })
    }

    PENCI.toggleMenuHumburger = function () {
      var $menuhumburger = $('.penci-menu-hbg')
      if ($menuhumburger.length) {
        var $body = $('body'),
          $button = $(
            '.penci-vernav-toggle,.penci-menuhbg-toggle,#penci-close-hbg,.penci-menu-hbg-overlay'),
          sidebarClass = 'penci-menuhbg-open'

        // Add indicator
        $('.penci-menu-hbg .menu li.menu-item-has-children > a').
          append('<u class="indicator"><i class="fa fa-angle-down"></i></u>')

        // indicator click
        $('.penci-menu-hbg .menu li a .indicator').on('click', function (e) {
          if ($('body').hasClass('penci-hbg-cparent') &&
            !$menuhumburger.hasClass('penci-builder-mobile-sidebar-nav')) {
            return
          }
          if ($menuhumburger.hasClass('penci-builder-mobile-sidebar-nav') &&
            $menuhumburger.find('.pchb-cparent').length) {
            return
          }
          var $this = $(this)
          e.preventDefault()
          $this.children().toggleClass('fa-angle-up')
          $this.parent().next().slideToggle('fast')
        })

        $('.penci-hbg-cparent .penci-menu-hbg .menu li.menu-item-has-children > a').
          on('click', function (e) {
            var $this = $(this)
            e.preventDefault()
            $this.children().children().toggleClass('fa-angle-up')
            $this.next().slideToggle('fast')
          })

        // Click to show mobile menu
        $button.on('click', function (e) {
          e.preventDefault()

          if ($body.hasClass(sidebarClass)) {
            $body.removeClass(sidebarClass)
            $button.removeClass('active')

            return
          }
          e.stopPropagation() // Do not trigger click event on '.site' below
          $body.addClass(sidebarClass)
          $button.addClass('active')

        })
      }
    }

    /* Light box
 ----------------------------------------------------------------*/
    PENCI.lightbox = function () {
      if ($().magnificPopup) {
        $('a[data-rel^="penci-gallery-image-content"], .penci-enable-lightbox .gallery-item a').
          magnificPopup({
            type: 'image',
            closeOnContentClick: true,
            closeBtnInside: false,
            fixedContentPos: true,
            image: {
              verticalFit: true,
              titleSrc: 'data-cap',
            },
            gallery: {
              enabled: true,
            },
            zoom: {
              enabled: false,
              duration: 300,
            },
          })

        $('a[data-rel^="penci-gallery-bground-content"]').magnificPopup({
          type: 'image',
          closeOnContentClick: true,
          closeBtnInside: false,
          fixedContentPos: true,
          image: {
            verticalFit: true,
          },
          gallery: {
            enabled: true,
          },
        })

        // Enable lightbox videos
        $('.penci-other-layouts-lighbox').magnificPopup({
          type: 'iframe',
          mainClass: 'mfp-fade',
          fixedContentPos: true,
          closeBtnInside: false,
          closeOnContentClick: true,
        })

        if ($('.penci-image-gallery').length) {
          $('.penci-image-gallery').each(function () {
            var $this = $(this),
              id = $this.attr('id')

            $('#' + id + ' a.penci-gallery-ite').magnificPopup({
              type: 'image',
              closeOnContentClick: true,
              closeBtnInside: false,
              fixedContentPos: true,
              image: {
                verticalFit: true,
                titleSrc: 'data-cap',
              },
              gallery: {
                enabled: true,
              },
            })
          })
        }

        if ($('.penci-post-gallery-container').length) {
          $('.penci-post-gallery-container').each(function () {
            var $this = $(this),
              id = $this.attr('id')

            $('#' + id + ' a.penci-gallery-ite').magnificPopup({
              type: 'image',
              closeOnContentClick: true,
              closeBtnInside: false,
              fixedContentPos: true,
              image: {
                verticalFit: true,
                titleSrc: 'data-cap',
              },
              gallery: {
                enabled: true,
              },
            })
          })
        }

      } // if magnificPopup exists
    }

    /* Masonry layout
 ----------------------------------------------------------------*/
    PENCI.masonry = function () {
      var $masonry_container = $(
        '.penci-masonry, .penci-bgstyle-2 .penci-biggrid-data')
      if ($masonry_container.length) {
        $masonry_container.each(function () {
          var $this = $(this)
          $this.imagesLoaded(function () {
            // initialize isotope
            $this.isotope({
              itemSelector: '.item-masonry',
              transitionDuration: '.55s',
              layoutMode: 'masonry',
            })
          })
        })
      }
    }

    /* Video Background
 ----------------------------------------------------------------*/
    PENCI.video_background = function () {
      var $penci_videobg = $('#penci-featured-video-bg')
      if ($penci_videobg.length) {
        $($penci_videobg).each(function () {
          var $this = $(this),
            $src = $this.data('videosrc'),
            $startime = $this.data('starttime'),
            $jarallaxArgs = {
              videoSrc: $src,
              videoStartTime: $startime,
              videoPlayOnlyVisible: false,
            }

          jarallax($this, $jarallaxArgs)
          $('.featured-area').addClass('loaded-wait')
          setTimeout(function () {
            $('.featured-area').addClass('loaded-animation')
          }, 1500)
        })
      }
    }

    /* Portfolio
 ----------------------------------------------------------------*/
    PENCI.AjaxPortfolio = function () {
      
      var $penci_portfolio_w = $('.wrapper-penci-portfolio.pcpt-ajax-ftl'),
          $penci_portfolio = $penci_portfolio_w.find('.penci-portfolio'),
          $penci_portfolio_i = $penci_portfolio_w.find('.inner-portfolio-posts'),
          $filter_a = $penci_portfolio_w.find('.penci-portfolio-filter a'),
          unique_id = $penci_portfolio.attr('id'),
          pagenavi = $penci_portfolio_w.find('.penci-pagenavi-shortcode'),
          DataFilter = null

      if (typeof (
          portfolioDataJs
        ) != 'undefined' && portfolioDataJs !==
        null) {
        for (var e in portfolioDataJs) {

          if (portfolioDataJs[e].instanceId == unique_id) {
            DataFilter = portfolioDataJs[e]
          }
        }
      }

      if ($().isotope && $penci_portfolio_i.length) {
        $penci_portfolio_i.each(function () {
          var $this = $(this)

          $this.imagesLoaded(function () {
            $this.isotope({
              itemSelector: '.portfolio-item',
              animationEngine: 'best-available',
              animationOptions: {
                duration: 250,
                queue: false,
              },
            }) // isotope

            $this.addClass('loaded')

            $('.portfolio-item .inner-item-portfolio').each(function () {
              var $this = $(this)
              $this.one('inview',
                function (event, isInView, visiblePartX, visiblePartY) {
                  $this.addClass('animated')
                }) // inview
            }) // each
          })
        })
      }
      
      $filter_a.on('click', function(e) {
        e.preventDefault();
        var filter_a = $(this),
            term = filter_a.attr('data-term'),
            paged = filter_a.attr('data-paged') ? parseInt( filter_a.attr('data-paged') ) : 1,
            term_wrapper = $penci_portfolio.find('.pcpt_data_' + term),
            df_wrapper =  $penci_portfolio.find('.inner-portfolio-posts:first-child'),
            loadmorebtm = $penci_portfolio_w.find('.penci-ajax-more-button'),
            mesNoMore = loadmorebtm.data('mes_no_more'),
            mes = loadmorebtm.data('mes')


          if ( filter_a.hasClass('loadmore-finish') ) {
            loadmorebtm.find('.ajax-more-text').html(mesNoMore)
            loadmorebtm.addClass('disable')
          } else {
            loadmorebtm.find('.ajax-more-text').html(mes)
            loadmorebtm.removeClass('disable')
          }

          if ( filter_a.hasClass('loading-data') || filter_a.closest('li').hasClass('active') ){
            return;
          }

          $penci_portfolio_w.find('.penci-portfolio-filter li').removeClass('active');
          filter_a.closest('li').addClass('active')

          filter_a.addClass('loading-data')
          $penci_portfolio.addClass('pcftaj-ld')


          if ( term == '*' ) {
            $penci_portfolio.find('.inner-portfolio-posts').hide()
            $penci_portfolio.find('.inner-portfolio-posts').removeClass('loaded')
            df_wrapper.show()
            df_wrapper.isotope('layout')
            df_wrapper.addClass('loaded')
            filter_a.removeClass('loading-data');
            $penci_portfolio.removeClass('pcftaj-ld');
            return
          }

          if( filter_a.hasClass('loaded_data')){
            $penci_portfolio.find('.inner-portfolio-posts').hide()
            $penci_portfolio.find('.inner-portfolio-posts').removeClass('loaded')
            $('.pcpt_data_' + term).show()
            $('.pcpt_data_' + term).isotope('layout')
            $('.pcpt_data_' + term).addClass('loaded')
            filter_a.removeClass('loading-data');
            $penci_portfolio.removeClass('pcftaj-ld');
            return;
          }

          if( filter_a.hasClass('load_full')){
            pagenavi.hide();
          } else {
            pagenavi.show();
          }

        DataFilter.currentTerm = term
        DataFilter.query.paged = paged

        var data = {
          action: 'penci_pfl_more_post_ajax',
          datafilter: DataFilter,
          nonce: ajax_var_more.nonce,
        }

        $.post(ajax_var_more.url, data, function (response) {

          filter_a.attr('data-paged', paged + 1)

          var $data = $(response.data.items)

          if ( ! term_wrapper.length && term != '*' ) {
            $penci_portfolio.append('<div class="inner-portfolio-posts pcpt_data_'+ term +'"></div>')
          }

          $penci_portfolio.find('.inner-portfolio-posts').hide()
          $penci_portfolio.find('.inner-portfolio-posts').removeClass('loaded')
          $('.pcpt_data_' + term).show()
          $('.pcpt_data_' + term).addClass('loaded')

          if ( $data.length > 0 ) {
            $('.pcpt_data_' + term).isotope()
            .append( $data )
            .isotope( 'appended', $data )
            .isotope('layout');
            filter_a.addClass('loaded_data')
          } else {
            $('.pcpt_data_' + term).isotope().isotope('layout')
            filter_a.addClass('load_full')
          }

          $('.container').fitVids({ ignore: '.penci-sticky-video' })

          $('a[data-rel^="penci-gallery-image-content"]').magnificPopup({
            type: 'image',
            closeOnContentClick: true,
            closeBtnInside: false,
            fixedContentPos: true,
            image: {
              verticalFit: true,
            },
            gallery: {
              enabled: true,
            },
            zoom: {
              enabled: false,
              duration: 300,
            },
          })

          $('.portfolio-item .inner-item-portfolio').each(function () {
            var $this = $(this)
            $this.one('inview',
              function (event, isInView, visiblePartX, visiblePartY) {
                $this.addClass('animated')
              }) // inview
          }) // each

          filter_a.removeClass('loading-data')
          $penci_portfolio.removeClass('pcftaj-ld')
        })
      });

      PENCI.Ajax_Portfolio_LoadMore.loadMore(DataFilter)
      PENCI.Ajax_Portfolio_LoadMore.infinityScroll(DataFilter)
      
    }

    PENCI.Ajax_Portfolio_LoadMore = {
      btnLoadMore: $('.penci-plf-loadmore'),
      loadMore: function (DataFilter) {
        var self = this
        $('body').on('click', '.penci-plf-loadmore .penci-ajax-more-button', function (event) {
          self.actionLoadMore($(this), DataFilter)
        })
      },
      infinityScroll: function (DataFilter) {
        var self = this,
          $handle = $('.penci-plf-loadmore'),
          $button_load = $handle.find('.penci-ajax-more-button')

        if ($handle.hasClass('penci-infinite-scroll')) {
          $(window).on('scroll', function () {
            var hT = $button_load.offset().top,
              hH = $button_load.outerHeight(),
              wH = $(window).height(),
              wS = $(this).scrollTop()

            if ((
              wS > (
                hT + hH - wH
              )
            ) && $button_load.length) {
              self.actionLoadMore($button_load, DataFilter)
            }
          }).trigger('scroll')
        }
      },
      actionLoadMore: function ($button_load, DataFilter) {
        if ($button_load.hasClass('loading-portfolios')) {
          return false
        }

        $button_load.addClass('loading-portfolios')

        var mesNoMore = $button_load.data('mes_no_more'),
            mes = $button_load.data('mes'),
            currentItem = $button_load.closest('.wrapper-penci-portfolio').find('.penci-portfolio-filter li.active a'),
            $wrap_content = $button_load.closest('.wrapper-penci-portfolio').find('.inner-portfolio-posts.loaded'),
            term_name = currentItem.attr('data-term'),
            term_paged = currentItem.attr('data-paged')


            DataFilter.currentTerm = term_name
            DataFilter.query.paged = term_paged

        var data = {
          action: 'penci_pfl_more_post_ajax',
          datafilter: DataFilter,
          nonce: ajax_var_more.nonce,
        }
        $.post(ajax_var_more.url, data, function (response) {
          if (!response.data.items) {
            $button_load.find('.ajax-more-text').html(mesNoMore)
            $button_load.removeClass('loading-portfolios')

            currentItem.addClass('loadmore-finish')
            $wrap_content.addClass('nore-moreposts')
            $button_load.addClass('disable')
            return false
          }

          currentItem.attr('data-paged', term_paged + 1)

          var $data = $(response.data.items)

          $wrap_content.append($data)
          $wrap_content.isotope('appended', $data).imagesLoaded(function () {
            $wrap_content.isotope('layout')
          })

          $('.container').fitVids({ ignore: '.penci-sticky-video' })

          $('a[data-rel^="penci-gallery-image-content"]').magnificPopup({
            type: 'image',
            closeOnContentClick: true,
            closeBtnInside: false,
            fixedContentPos: true,
            image: {
              verticalFit: true,
            },
            gallery: {
              enabled: true,
            },
            zoom: {
              enabled: false,
              duration: 300,
            },
          })

          $('.portfolio-item .inner-item-portfolio').each(function () {
            var $this = $(this)
            $this.one('inview',
              function (event, isInView, visiblePartX, visiblePartY) {
                $this.addClass('animated')
              }) // inview
          }) // each

          $button_load.removeClass('loading-portfolios')
        })
      },
    }

    // end portfolio ajax

    PENCI.portfolio = function () {
      var $penci_portfolio = $('.penci-portfolio')

      if ( $penci_portfolio.hasClass( 'pcpt-ajax-ftl' ) ) {
        return;
      }

      if ($().isotope && $penci_portfolio.length) {
        $('.penci-portfolio').each(function () {
          var $this = $(this),
            unique_id = $(this).attr('id'),
            DataFilter = null

          if (typeof (
              portfolioDataJs
            ) != 'undefined' && portfolioDataJs !==
            null) {
            for (var e in portfolioDataJs) {

              if (portfolioDataJs[e].instanceId == unique_id) {
                var DataFilter = portfolioDataJs[e]
              }
            }
          }

          $this.imagesLoaded(function () {
            $this.isotope({
              itemSelector: '.portfolio-item',
              animationEngine: 'best-available',
              animationOptions: {
                duration: 250,
                queue: false,
              },
            }) // isotope

            $this.addClass('loaded')

            $('.portfolio-item .inner-item-portfolio').each(function () {
              var $this = $(this)
              $this.one('inview',
                function (event, isInView, visiblePartX, visiblePartY) {
                  $this.addClass('animated')
                }) // inview
            }) // each

            var location = window.location.hash.toString()
            if (location.length) {
              location = location.replace('#', '')
              location.match(/:/)
              var Mlocation = location.match(/^([^:]+)/)[1]
              location = location.replace(Mlocation + ':', '')

              if (location.length > 1) {

                var $termActive = $afilter.filter(
                    '[data-term="' + location + '"]'),
                  portfolioItem = $this.find('.portfolio-item'),
                  $buttonLoadMore = $this.parent().
                    find('.penci-pagenavi-shortcode')

                if ($termActive.length) {

                  liFilter.removeClass('active')
                  $termActive.parent().addClass('active')
                  $this.isotope({ filter: '.penci-' + location })

                  var dataTerm = $termActive.data('term'),
                    p = {}

                  DataFilter.currentTerm = dataTerm
                  $.each(DataFilter.countByTerms, function (t, e) {
                    p[t] = 0
                  })

                  portfolioItem.each(function (t, e) {
                    $.each((
                      $(e).data('terms') + ''
                    ).split(' '), function (t, e) {
                      p[e]++
                    })
                  })

                  var show_button = 'number' == typeof p[dataTerm] &&
                    p[dataTerm] == DataFilter.countByTerms[dataTerm]
                  if ($buttonLoadMore.length) {
                    if (portfolioItem.length !== DataFilter.count &&
                      !show_button) {
                      $buttonLoadMore.show()
                    } else {
                      $buttonLoadMore.hide()
                    }
                  }
                }
              }
            }
          }) // imagesloaded

          // Filter items when filter link is clicked
          var $filter = $this.parent().find('.penci-portfolio-filter'),
            $afilter = $filter.find('a'),
            liFilter = $filter.find('li')

          liFilter.on('click', function () {

            var self = $(this),
              term = self.find('a').data('term'),
              selector = self.find('a').attr('data-filter'),
              $e_dataTerm = $filter.find('a').
                filter('[data-term="' + term + '"]'),
              portfolioItem = $this.find('.portfolio-item'),
              $buttonLoadMore = $this.parent().
                find('.penci-pagenavi-shortcode'),
              scrollTop = $(window).scrollTop()

            liFilter.removeClass('active')
            self.addClass('active')

            $this.parent().
              find('.penci-ajax-more-button').
              attr('data-cat', term)

            $this.isotope({ filter: selector })

            if ($e_dataTerm.length) {
              window.location.hash = '*' == term ? '' : term

              $(window).scrollTop(scrollTop)
            }

            var p = {}
            DataFilter.currentTerm = term
            $.each(DataFilter.countByTerms, function (t, e) {
              p[t] = 0
            })

            portfolioItem.each(function (t, e) {
              $.each((
                $(e).data('terms') + ''
              ).split(' '), function (t, e) {
                p[e]++
              })
            })

            var show_button = 'number' == typeof p[term] && p[term] ==
              DataFilter.countByTerms[term]
            if ($buttonLoadMore.length) {
              if (portfolioItem.length !== DataFilter.count && !show_button) {
                $buttonLoadMore.show()
              } else {
                $buttonLoadMore.hide()
              }
            }

            return false
          })

          PENCI.portfolioLoadMore.loadMore($this, DataFilter)
          PENCI.portfolioLoadMore.infinityScroll(DataFilter)

        }) // each .penci-portfolio

      }	// end if isotope & portfolio

      var $btnLoadMore = $('.penci-plf-loadmore')
      if (!$().isotope || !$btnLoadMore.length) {
        return false
      }
    }

    PENCI.portfolioLoadMore = {
      btnLoadMore: $('.penci-plf-loadmore'),
      loadMore: function ($pfl_wapper, DataFilter) {
        var self = this
        $('body').on('click', '.penci-ajax-more-button', function (event) {
          self.actionLoadMore($(this), $pfl_wapper, DataFilter)
        })
      },
      infinityScroll: function (DataFilter) {
        var self = this,
          $handle = $('.penci-plf-loadmore'),
          $button_load = $handle.find('.penci-ajax-more-button')

        if ($handle.hasClass('penci-infinite-scroll')) {
          $(window).on('scroll', function () {
            var hT = $button_load.offset().top,
              hH = $button_load.outerHeight(),
              wH = $(window).height(),
              wS = $(this).scrollTop()

            if ((
              wS > (
                hT + hH - wH
              )
            ) && $button_load.length) {
              var $pfl_wapper = $button_load.closest('.penci-portfolio')
              self.actionLoadMore($button_load, $pfl_wapper, DataFilter)
            }
          }).trigger('scroll')
        }
      },
      actionLoadMore: function ($button_load, $pfl_wapper, DataFilter) {
        if ($button_load.hasClass('loading-portfolios')) {
          return false
        }

        $button_load.addClass('loading-portfolios')

        var mesNoMore = $button_load.data('mes_no_more'),
          mes = $button_load.data('mes')

        DataFilter.pflShowIds = []

        $button_load.closest('.wrapper-penci-portfolio').
          find('.portfolio-item').
          each(function (t, e) {
            DataFilter.pflShowIds.push($(e).data('pflid'))
          })

        var data = {
          action: 'penci_pfl_more_post_ajax',
          datafilter: DataFilter,
          nonce: ajax_var_more.nonce,
        }
        $.post(ajax_var_more.url, data, function (response) {
          if (!response.data.items) {
            $button_load.find('.ajax-more-text').html(mesNoMore)
            $button_load.removeClass('loading-portfolios')

            $button_load.closest('.wrapper-penci-portfolio').
              find('.penci-portfolio-filter li.active').
              addClass('loadmore-finish')

            setTimeout(function () {
              $button_load.parent().parent().hide()
              $button_load.find('.ajax-more-text').html(mes)
            }, 1200)

            return false
          }

          var $wrap_content = $button_load.closest('.wrapper-penci-portfolio').
              find('.penci-portfolio'),
            $data = $(response.data.items)

          $wrap_content.find('.inner-portfolio-posts').append($data)
          $wrap_content.isotope('appended', $data).imagesLoaded(function () {
            $wrap_content.isotope('layout')
          })

          $('.container').fitVids({ ignore: '.penci-sticky-video' })

          $('a[data-rel^="penci-gallery-image-content"]').magnificPopup({
            type: 'image',
            closeOnContentClick: true,
            closeBtnInside: false,
            fixedContentPos: true,
            image: {
              verticalFit: true,
            },
            gallery: {
              enabled: true,
            },
            zoom: {
              enabled: false,
              duration: 300,
            },
          })

          $wrap_content.addClass('loaded')

          $('.portfolio-item .inner-item-portfolio').each(function () {
            var $this = $(this)
            $this.one('inview',
              function (event, isInView, visiblePartX, visiblePartY) {
                $this.addClass('animated')
              }) // inview
          }) // each

          $button_load.removeClass('loading-portfolios')
        })
      },
    }

    /* Gallery
 ----------------------------------------------------------------*/
    PENCI.gallery = function () {
      var $justified_gallery = $('.penci-post-gallery-container.justified')
      var $masonry_gallery = $('.penci-post-gallery-container.masonry')
      if ($().justifiedGallery && $justified_gallery.length) {
        $('.penci-post-gallery-container.justified').each(function () {
          var $this = $(this)
          $this.justifiedGallery({
            rowHeight: $this.data('height'),
            lastRow: 'nojustify',
            margins: $this.data('margin'),
            randomize: false,
          })
        }) // each .penci-post-gallery-container
      }

      if ($().isotope && $masonry_gallery.length) {

        $('.penci-post-gallery-container.masonry .item-gallery-masonry').
          each(function () {
            var $this = $(this).children()
            if ($this.attr('data-cap') && !$this.hasClass('added-caption')) {
              var $title = $this.attr('data-cap')
              if ($title !== 'undefined') {
                $this.children().
                  append('<div class="caption">' + $title + '</div>')
                $this.addClass('added-caption')
              }

            }
          })
      }

      if ($masonry_gallery.length) {
        $masonry_gallery.each(function () {
          var $this = $(this)
          $this.imagesLoaded(function () {
            // initialize isotope
            $this.isotope({
              itemSelector: '.item-gallery-masonry',
              transitionDuration: '.55s',
              layoutMode: 'masonry',
            })

            $this.addClass('loaded')

            $('.penci-post-gallery-container.masonry .item-gallery-masonry').
              each(function () {
                var $this = $(this)
                $this.one('inview',
                  function (event, isInView, visiblePartX, visiblePartY) {
                    $this.children().addClass('animated')
                  }) // inview
              }) // each
          })
        })
      }
    },

      /* Jarallax
 ----------------------------------------------------------------*/
      PENCI.Jarallax = function () {
        if (!$.fn.jarallax || !$('.penci-jarallax').length) {
          return false
        }
        $('.penci-jarallax').each(function () {
          var $this = $(this),
            $jarallaxArgs = {}

          $this.imagesLoaded({ background: true }, function () {
            jarallax($this, $jarallaxArgs)
          })
        })
      },

      /* Related Popup
 ----------------------------------------------------------------*/
      PENCI.RelatedPopup = function () {
        if ($('.penci-rlt-popup').length) {
          var rltpopup = $('.penci-rlt-popup'),
            rltclose = $('.penci-rlt-popup .penci-close-rltpopup'),
            rltlazy = rltpopup.find('.penci-lazy')

          $('body').on('inview', '.penci-flag-rlt-popup',
            function (event, isInView, visiblePartX, visiblePartY) {
              if (!rltpopup.hasClass('rltpopup-notshow-again') &&
                isInView) {
                rltpopup.addClass('rltpopup-show-up')
                rltclose.on('click', function (e) {
                  e.preventDefault()
                  rltpopup.removeClass('rltpopup-show-up').
                    addClass('rltpopup-notshow-again')
                })
                /*rltlazy.Lazy({
                      effect: 'fadeIn',
                      effectTime: 300,
                      scrollDirection: 'both'
                  });*/
                //lazySizes.init();
              }
            })
          rltclose.on('click', function (e) {
            e.preventDefault()
            rltpopup.removeClass('rltpopup-show-up').
              addClass('rltpopup-notshow-again')
          })
        }
      },

      PENCI.extraFunction = {
        init: function () {
          this.counterUp()
          this.progressBar()
          this.loginPopup()
          this.recoverPassPopup()
          this.registerPopup()
          this.login()
          this.register()
          this.map()
        },
        progressBar: function () {
          if ($('.penci-review-process').length) {
            $('.penci-review-process').each(function () {
              var $this = $(this),
                $bar = $this.children(),
                $bar_w = $bar.data('width') * 10
              $this.one('inview',
                function (event, isInView, visiblePartX, visiblePartY) {
                  $bar.animate({ width: $bar_w + '%' }, 1000)
                }) // bind inview
            }) // each
          }

          if ($.fn.easyPieChart && $('.penci-piechart').length) {
            $('.penci-piechart').each(function () {
              var $this = $(this)
              $this.one('inview',
                function (event, isInView, visiblePartX, visiblePartY) {
                  var chart_args = {
                    barColor: $this.data('color'),
                    trackColor: $this.data('trackcolor'),
                    scaleColor: false,
                    lineWidth: $this.data('thickness'),
                    size: $this.data('size'),
                    animate: 1000,
                  }
                  $this.easyPieChart(chart_args)
                }) // bind inview
            }) // each
          }
        },
        counterUp: function () {
          var $counterup = $('.penci-counterup-number')

          if (!$.fn.counterUp || !$counterup.length) {
            return false
          }

          $counterup.each(function () {
            var $this = $(this)

            $this.one('inview',
              function (event, isInView, visiblePartX, visiblePartY) {
                setTimeout(function () {
                  $({ countNum: $this.text() }).animate(
                    {
                      countNum: $this.attr('data-count'),
                    },

                    {
                      duration: 2000,
                      easing: 'linear',
                      step: function () {
                        $this.text(Math.floor(this.countNum))
                      },
                      complete: function () {
                        $this.text(this.countNum)
                      },
                    },
                  )
                }, $this.attr('data-delay'))

              }) // bind inview
          })
        },
        loginPopup: function () {
          var $body = $('body'),
            $loginform = $('#penci-loginpopform'),
            $loginContainer = $loginform.closest('.penci-popup-wrapper')

          if ($loginform.length) {

            $('.penci-login-popup-btn a').magnificPopup({
              type: 'inline',
              midClick: true,
              removalDelay: 600,
              mainClass: 'penci-popup-animation',
            })

            $body.on('click', '.penci-lostpassword-btn', function (e) {
              var $this = $(this),
                $parent = $this.closest('.penci-popup-wrapper')

              $parent.children('.penci-popup-passreset').slideDown('normal')
              $parent.children('.penci-popup-login').slideUp('normal')
              e.preventDefault()
              return false
            })

            $body.on('click', '.penci-register-popup-btn', function (e) {
              var $this = $(this),
                $parent = $this.closest('.penci-popup-wrapper')

              $parent.children('.penci-popup-register').slideDown('normal')
              $parent.children('.penci-popup-login').slideUp('normal')
              e.preventDefault()
              return false
            })

            $body.on('click', '.penci-login-popup-btn', function (e) {
              var $this = $(this),
                $parent = $this.closest('.penci-popup-wrapper')

              $parent.children('.penci-popup-login').slideDown('normal')
              $parent.children('.penci-popup-register').slideUp('normal')
              $parent.children('.penci-popup-passreset').slideUp('normal')

              e.preventDefault()
              return false
            })

            $('#penci_user, #penci_pass').on('focus', function () {
              $(this).removeClass('invalid')
            })

            $loginform.on('submit', function (e) {
              var $this = $(this),
                inputUsername = $this.find('#penci_user'),
                inputPass = $this.find('#penci_pass'),
                valUsername = inputUsername.val(),
                valPass = inputPass.val(),
                nonce = $this.find('.penci_form_nonce').val(),
                gcapcha = $this.find('.g-recaptcha-response')
              if (gcapcha.length) {
                var captcha = gcapcha.val()
              } else {
                var captcha = 'noexists'
              }

              if (inputUsername.length > 0 && valUsername == '') {
                inputUsername.addClass('invalid')
                e.preventDefault()
              }

              if (inputPass.length > 0 && valPass == '') {
                inputPass.addClass('invalid')
                e.preventDefault()
              }

              if (valUsername == '' || valPass == '') {
                return false
              }

              $loginContainer.addClass('ajax-loading')
              $loginContainer.find('.message').slideDown().remove()

              var data = {
                action: 'penci_login_ajax',
                username: valUsername,
                password: valPass,
                captcha: captcha,
                security: nonce,
                remember: $loginContainer.find('#remembermepopup').val(),
              }

              $.post(ajax_var_more.url, data, function (response) {
                $loginContainer.removeClass('ajax-loading')
                $loginContainer.children('.penci-popup-login').
                  append(response.data)
                if (!response.success) {
                  return
                }

                var rdurl = window.location.href,
                  curl = ajax_var_more.redirect_url,
                  urlPattern = /^(https?:\/\/)?([\w-]+\.)*[\w-]+[\.][\w]+(\/.*)?$/

                if (urlPattern.test(curl)) {
                  rdurl = curl
                }

                window.location.href = rdurl + '?singin=true'
              })

              e.preventDefault()
              return false
            })
          }
        },
        recoverPassPopup: function () {
          var $body = $('body'),
            $recoveryform = $('#penci-passreset-popup'),
            $recoveryContainer = $recoveryform.closest(
              '.penci-popup-wrapper')

          if ($recoveryform.length) {

            $('.penci_user_email').on('focus', function () {
              $(this).removeClass('invalid')
            })

            $recoveryform.on('submit', function (e) {
              e.preventDefault()

              var $this = $(this),
                inputUsername = $this.find('.penci_user_email'),
                valUsername = inputUsername.val(),
                nonce = $this.find('.penci_form_nonce').val(),
                gcapcha = $this.find('.g-recaptcha-response')
              if (gcapcha.length) {
                var captcha = gcapcha.val()
              } else {
                var captcha = 'noexists'
              }

              if (inputUsername.length > 0 && valUsername == '') {
                inputUsername.addClass('invalid')

                e.preventDefault()
                return false
              }

              $recoveryContainer.addClass('ajax-loading')
              $recoveryContainer.find('.message').slideDown().remove()

              var data = {
                action: 'penci_resetpass_ajax',
                security: nonce,
                username: valUsername,
                captcha: captcha,
              }

              $.post(ajax_var_more.url, data, function (response) {
                $recoveryContainer.removeClass('ajax-loading')
                $recoveryContainer.children('.penci-popup-passreset').
                  append(response.data)

                return
              })

              event.preventDefault()
              return false
            })
          }
        },
        registerPopup: function () {
          var $body = $('body'),
            $registerform = $('#penci-register-popup'),
            $registerContainer = $registerform.closest(
              '.penci-popup-wrapper')

          if ($registerform.length) {

            var $allInput = $(
              '.penci_user_name,.penci_user_email,.penci_user_pass,.penci_user_pass_confirm')
            $allInput.on('focus', function () {
              $(this).removeClass('invalid')
            })

            $registerform.on('submit', function (e) {
              e.preventDefault()

              var $this = $(this),
                inputUsername = $this.find('.penci_user_name'),
                inputEmail = $this.find('.penci_user_email'),
                $inputPass = $this.find('.penci_user_pass'),
                $inputPassConfirm = $this.find('.penci_user_pass_confirm'),
                valUsername = inputUsername.val(),
                valEmail = inputEmail.val(),
                valPass = $inputPass.val(),
                valPassConfirm = $inputPassConfirm.val(),
                nonce = $this.find('.penci_form_nonce').val(),
                gcapcha = $this.find('.g-recaptcha-response')
              if (gcapcha.length) {
                var captcha = gcapcha.val()
              } else {
                var captcha = 'noexists'
              }

              $allInput.removeClass('invalid')

              if (inputUsername.length > 0 && valUsername == '') {
                inputUsername.addClass('invalid')
                event.preventDefault()
              }

              if (inputEmail.length > 0 && valEmail == '') {
                inputEmail.addClass('invalid')
                event.preventDefault()
              }

              if ($inputPass.length > 0 && valPass == '') {
                $inputPass.addClass('invalid')
                event.preventDefault()
              }

              if ($inputPassConfirm.length > 0 && valPassConfirm == '') {
                $inputPassConfirm.addClass('invalid')
                event.preventDefault()
              }
              if (valUsername == '' || valEmail == '' || valPass == '' ||
                valPassConfirm == '') {
                return false
              }

              $registerContainer.find('.message').slideDown().remove()

              // Password does not match the confirm password
              if (valPassConfirm !== valPass) {
                $inputPass.addClass('invalid')
                $inputPassConfirm.addClass('invalid')
                $registerContainer.children('.penci-popup-register').
                  append(ajax_var_more.errorPass)
                event.preventDefault()

                return false
              }
              $registerContainer.addClass('ajax-loading')

              var data = {
                action: 'penci_register_ajax',
                fistName: $this.find('.penci_first_name').val(),
                lastName: $this.find('.penci_last_name').val(),
                username: valUsername,
                password: valPass,
                confirmPass: valPassConfirm,
                email: valEmail,
                security: nonce,
                captcha: captcha,
              }

              $.post(ajax_var_more.url, data, function (response) {
                $registerContainer.removeClass('ajax-loading')
                $registerContainer.children('.penci-popup-register').
                  append(response.data)
                if (!response.success) {
                  return
                }
                window.location.href = window.location.href + '?singin=true'
              })

              event.preventDefault()
              return false
            })

          }
        },
        login: function () {
          var $body = $('body'),
            $loginform = $('.penci-loginform'),
            $loginContainer = $loginform.parent('.penci-login-wrap')

          if ($loginform.length) {
            $body.on('click', '.penci-user-register', function (e) {
              e.preventDefault()

              var $this = $(this),
                $parent = $this.closest('.penci-login-register')

              $parent.find('.penci-login-wrap').addClass('hidden')
              $parent.find('.penci-register-wrap').removeClass('hidden')
            })

            $('#penci-user-login,#penci-user-pass').on('focus', function () {
              $(this).removeClass('invalid')
            })

            $('.penci-loginform').each(function () {
              $(this).on('submit', function (e) {
                var $this = $(this),
                  $loginContainer = $this.parent('.penci-login-wrap'),
                  inputUsername = $this.find('#penci-user-login'),
                  inputPass = $this.find('#penci-user-pass'),
                  valUsername = inputUsername.val(),
                  valPass = inputPass.val(),
                  nonce = $this.find('.penci_form_nonce').val(),
                  gcapcha = $this.find('.g-recaptcha-response')
                if (gcapcha.length) {
                  var captcha = gcapcha.val()
                } else {
                  var captcha = 'noexists'
                }

                if (inputUsername.length > 0 && valUsername == '') {
                  inputUsername.addClass('invalid')
                  e.preventDefault()
                }

                if (inputPass.length > 0 && valPass == '') {
                  inputPass.addClass('invalid')
                  e.preventDefault()
                }

                if (valUsername == '' || valPass == '') {
                  return false
                }

                $loginContainer.parent().addClass('ajax-loading')
                $loginContainer.find('.message').slideDown().remove()

                var data = {
                  action: 'penci_login_ajax',
                  username: valUsername,
                  password: valPass,
                  captcha: captcha,
                  security: nonce,
                  remember: $loginContainer.find('#rememberme').val(),
                }

                $.post(ajax_var_more.url, data, function (response) {
                  $loginContainer.parent().removeClass('ajax-loading')
                  $loginContainer.append(response.data)
                  if (!response.success) {
                    return
                  }

                  window.location.href = window.location.href + '?singin=true'
                })

                e.preventDefault()
                return false
              })
            })
          }
        },
        register: function () {
          var $body = $('body'),
            $registerform = $('#penci-registration-form'),
            $registerContainer = $registerform.closest(
              '.penci-register-wrap')

          if (!$registerform.length) {
            return false
          }

          $body.on('click', '.penci-user-login-here', function (e) {
            e.preventDefault()

            var $this = $(this),
              $parent = $this.closest('.penci-login-register')

            $parent.find('.penci-login-wrap').removeClass('hidden')
            $parent.find('.penci-register-wrap').addClass('hidden')

            return false
          })

          var $allInput = $(
            '.penci_user_name,.penci_user_email,.penci_user_pass,.penci_user_pass_confirm')
          $allInput.on('focus', function () {
            $(this).removeClass('invalid')
          })

          $('.penci-registration-form').each(function () {
            $(this).on('submit', function (e) {
              e.preventDefault()

              var $this = $(this),
                $registerContainer = $this.closest('.penci-register-wrap'),
                inputUsername = $this.find('.penci_user_name'),
                inputEmail = $this.find('.penci_user_email'),
                $inputPass = $this.find('.penci_user_pass'),
                $inputPassConfirm = $this.find('.penci_user_pass_confirm'),
                valUsername = inputUsername.val(),
                valEmail = inputEmail.val(),
                valPass = $inputPass.val(),
                valPassConfirm = $inputPassConfirm.val(),
                nonce = $this.find('.penci_form_nonce').val(),
                gcapcha = $this.find('.g-recaptcha-response')
              if (gcapcha.length) {
                var captcha = gcapcha.val()
              } else {
                var captcha = 'noexists'
              }

              $allInput.removeClass('invalid')

              if (inputUsername.length > 0 && valUsername == '') {
                inputUsername.addClass('invalid')
                event.preventDefault()
              }

              if (inputEmail.length > 0 && valEmail == '') {
                inputEmail.addClass('invalid')
                event.preventDefault()
              }

              if ($inputPass.length > 0 && valPass == '') {
                $inputPass.addClass('invalid')
                event.preventDefault()
              }

              if ($inputPassConfirm.length > 0 && valPassConfirm == '') {
                $inputPassConfirm.addClass('invalid')
                event.preventDefault()
              }
              if (valUsername == '' || valEmail == '' || valPass == '' ||
                valPassConfirm == '') {
                return false
              }

              $registerContainer.find('.message').slideDown().remove()

              // Password does not match the confirm password
              if (valPassConfirm !== valPass) {
                $inputPass.addClass('invalid')
                $inputPassConfirm.addClass('invalid')
                $registerContainer.append(ajax_var_more.errorPass)
                event.preventDefault()

                return false
              }
              $registerContainer.parent().addClass('ajax-loading')

              var data = {
                action: 'penci_register_ajax',
                fistName: $this.find('.penci_first_name').val(),
                lastName: $this.find('.penci_last_name').val(),
                username: valUsername,
                password: valPass,
                confirmPass: valPassConfirm,
                email: valEmail,
                security: nonce,
                captcha: captcha,
              }

              $.post(ajax_var_more.url, data, function (response) {
                $registerContainer.parent().removeClass('ajax-loading')
                $registerContainer.append(response.data)
                if (!response.success) {
                  return
                }
                window.location.href = window.location.href + '?singin=true'
              })

              event.preventDefault()
              return false
            })
          })
        },
        map: function () {
          if (!$('.penci-google-map').length) {
            return false
          }
          $('.penci-google-map').each(function () {

            var map = $(this),
              Option = map.data('map_options'),
              mapID = map.attr('id')

            var mapTypePre = google.maps.MapTypeId.ROADMAP
            switch (Option.map_type) {
              case'satellite':
                mapTypePre = google.maps.MapTypeId.SATELLITE
                break
              case'hybrid':
                mapTypePre = google.maps.MapTypeId.HYBRID
                break
              case'terrain':
                mapTypePre = google.maps.MapTypeId.TERRAIN
            }
            var latLng = new google.maps.LatLng(-34.397, 150.644)
            var map = new google.maps.Map(document.getElementById(mapID), {
              zoom: parseInt(Option.map_zoom),
              center: latLng,
              mapTypeId: mapTypePre,
              panControl: Option.map_pan,
              zoomControl: Option.map_is_zoom,
              mapTypeControl: true,
              scaleControl: Option.map_scale,
              streetViewControl: Option.map_street_view,
              rotateControl: Option.map_rotate,
              overviewMapControl: Option.map_overview,
              scrollwheel: Option.map_scrollwheel,
            })
            var marker = new google.maps.Marker({
              position: latLng,
              map: map,
              title: Option.marker_title,
              icon: Option.marker_img,
            })

            if (Option.info_window) {
              var infoWindow = new google.maps.InfoWindow({
                content: Option.info_window,
              })

              google.maps.event.addListener(marker, 'click', function () {
                infoWindow.open(map, marker)
              })
            }

            if ('coordinates' == Option.map_using && Option.latitude &&
              Option.longtitude) {
              latLng = new google.maps.LatLng(Option.latitude,
                Option.longtitude)
              map.setCenter(latLng)
              marker.setPosition(latLng)
            } else {
              var geocoder = new google.maps.Geocoder()
              geocoder.geocode({
                address: Option.address,
              }, function (results) {
                var loc = results[0].geometry.location
                latLng = new google.maps.LatLng(loc.lat(), loc.lng())
                map.setCenter(latLng)
                marker.setPosition(latLng)
              })
            }
          })
        },
      },

      PENCI.VideosList = {
        // Init the module
        init: function () {
          PENCI.VideosList.play()
        },
        play: function () {
          if (!$('.penci-video_playlist').length) {
            return false
          }
          $('.penci-video_playlist').each(function (idx, item) {
            var $blockVideo = $(this),
              $VideoF = $blockVideo.find('.penci-video-frame')

            var $height = $blockVideo.find('.penci-video-nav').height(),
              $heightTitle = $blockVideo.find(
                '.penci-video-nav .penci-playlist-title').height()

            $blockVideo.find('.penci-video-playlist-nav').
              css('height', $height - $heightTitle)
            // Init
            $VideoF.video()
            PENCI.VideosList.updateStatus($blockVideo)

            // Show First video and remove the loader icon
            $VideoF.addVideoEvent('ready', function () {
              $VideoF.css('visibility', 'visible').fadeIn()
              $blockVideo.find('.loader-overlay').remove()
            })
            // Play videos
            $blockVideo.on('click', '.penci-video-playlist-item', function () {
              var $thisVideo = $(this),
                frameID = $thisVideo.data('name'),
                $thisFrame = $('#' + frameID),
                videoSrc = $thisVideo.data('src'),
                videoNum = $thisVideo.find('.penci-video-number').text()

              if ($thisVideo.hasClass('is-playing')) {
                $thisFrame.pauseVideo()
                return
              }

              // Update the number of the playing video in the title section
              $blockVideo.find('.penci-video-playing').text(videoNum)

              // Pause all Videos
              $blockVideo.find('.penci-video-frame').each(function () {
                $(this).pauseVideo().hide()
              })

              // If the iframe not loaded before, add it
              if (!$thisFrame.length) {
                // Add the loader icon
                $blockVideo.find('.fluid-width-video-wrapper').prepend('')

                $blockVideo.find('.fluid-width-video-wrapper').
                  append('<iframe class="penci-video-frame" id="' + frameID +
                    '" src="' + videoSrc +
                    '" frameborder="0" width="100%"" height="434" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>')
                $thisFrame = $('#' + frameID)

                $thisFrame.video() // reinit

                $thisFrame.addVideoEvent('ready',
                  function (e, $thisFrame, video_type) {
                    $thisFrame.playVideo()
                    $blockVideo.find('.loader-overlay').remove()
                  })
              } else {
                $thisFrame.playVideo()
              }

              $thisFrame.css('visibility', 'visible').fadeIn()

              PENCI.VideosList.updateStatus($blockVideo)

            })
          })
        },
        updateStatus: function ($blockVideo) {
          $blockVideo.find('.penci-video-frame').each(function () {
            var $this = $(this),
              $videoItem = $('[data-name=\'' + $this.attr('id') + '\']')

            $this.addVideoEvent('play', function () {
              $videoItem.removeClass('is-paused').addClass('is-playing')
            })

            $this.addVideoEvent('pause', function () {
              $videoItem.removeClass('is-playing').addClass('is-paused')
            })

            $this.addVideoEvent('finish', function () {
              $videoItem.removeClass('is-paused is-playing')
            })
          })
        },
      },

      PENCI.JumtoRecipe = function () {

        $('.penci-jump-recipe').on('click', function (e) {
          e.preventDefault()
          var $closetMain = $(this).closest('.penci-single-block'),
            id = $(this).attr('href'),
            $firstRecipe = $closetMain.find(id).first()
          if ($firstRecipe.length) {
            var $scroll_top = $firstRecipe.offset().top,
              $nav_height = 30
            if ($('#navigation').length) {
              $nav_height = $('#navigation').height() + 30
            } else if ($('.pc-wrapbuilder-header').length) {
              if (window.matchMedia('(max-width: 960px)').matches) {
                var headermobile = $('.penci_navbar_mobile')
                if (!headermobile.hasClass('hide-scroll-down')) {
                  $nav_height = headermobile.height() + 30
                }
              } else {
                var headerdesktop = $('.penci_builder_sticky_header_desktop')
                if (headerdesktop.length &&
                  !headerdesktop.hasClass('hide-scroll-down')) {
                  $nav_height = headerdesktop.height() + 30
                }
              }
            }
            if ($('body').hasClass('admin-bar')) {
              $nav_height = $nav_height + 32
            }
            var $scroll_to = $scroll_top - $nav_height
            $('html,body').animate({
              scrollTop: $scroll_to,
            }, 'fast')
          }
        })
      },

      PENCI.DelayedContent = function () {
        $(document).on('mousemove scroll click', function(event) {
          $('.pc-content-delayed').each( function(e) {
            var t = $(this),
                d = t.attr('data-type') ? t.attr('data-type') : '',
                u = t.attr('data-url') ? t.attr('data-url') : '',
                c = t.attr('data-class') ? t.attr('data-class') : '',
                id = t.attr('data-id') ? t.attr('data-id') : '',
                s = t.attr('data-settings') ? t.attr('data-settings') : '',
                save_name = ('pcdelayed_' + d + id + c).toLowerCase();

            if ( ! t.hasClass('loaded') ) {
              t.addClass('loaded')
              if ( localStorage.getItem( save_name ) ) {
                t.after( localStorage.getItem( save_name ) )
                t.remove()
              } else {

                if ( u ) {
                  $.ajax({
                    type: "GET",
                    url: u,
                    success: function (response) {
                      t.after( response )
                      t.remove()
                      localStorage.setItem( save_name, response );
                    }
                  })
                } else {
                  $.ajax({
                    type: "POST",
                    dataType: 'JSON',
                    url: ajax_var_more.url,
                    data: {
                      type: d,
                      class: c,
                      id: id,
                      settings: s,
                      action: 'penci_delayed_div_content',
                    },
                    success: function (response) {
                      t.after( response.data.html )
                      t.remove()
                      localStorage.setItem( save_name, response.data.html );
                    }
                  })
                }
              }
              
            }

            $(document).trigger('penci-mega-loaded')
            
          })
        })
      },

      /* Smart Lists
    ---------------------------------------------------------------*/
      PENCI.SmartLists = function () {
        $('.pcsml-dropdown').each(function () {
          var select = $(this)
          select.on('change', function () {
            var url = this.value,
              curl = window.location.href

            if (url != curl && url !== undefined) {
              window.location.href = url
            }
          })
        })
      },

      PENCI.Single_Loadmore = function () {
        var $wrapper_loadmore = $('.penci-single-infiscroll')
        if ($wrapper_loadmore.length) {
          var adsHTML = $wrapper_loadmore.data('infiads')
          $(window).on('scroll', $.debounce(250, function () {
            var $lastArticle = $wrapper_loadmore.find('.penci-single-block').
                last(),
              $windowScroll = $(window).scrollTop(),
              $lastArticleTop = $lastArticle.offset().top,
              $dataURL = $lastArticle.data('prev-url')

            if ($lastArticle.hasClass('penci-single-infiblock-end')) {
              $('.penci-ldsingle').remove()
            }

            if ((
                $windowScroll > $lastArticleTop
              ) &&
              (
                typeof $dataURL !== 'undefined'
              ) && (
                typeof $dataURL !== ''
              ) &&
              !$lastArticle.hasClass('penci-single-infiblock-end')) {
              if (!$wrapper_loadmore.hasClass('penci-disable-sendajax')) {
                $wrapper_loadmore.addClass('penci-disable-sendajax')
                $.ajax({
                  url: $dataURL,
                  type: 'GET',
                  dataType: 'html',
                  success: function (result) {
                    var resultBlock = $(
                      $(result).find('.penci-single-wrapper').html()).
                      css('opacity', 0).
                      animate({ 'opacity': 1 }, 300)
                    if ((
                        typeof adsHTML !== 'undefined'
                      ) &&
                      (
                        typeof adsHTML !== ''
                      )) {
                      $wrapper_loadmore.append(adsHTML)
                    }
                    $wrapper_loadmore.append(resultBlock)
                    if (resultBlock.find('.penci_facebook_widget').length) {
                      try {
                        FB.XFBML.parse()
                      } catch (ex) {
                      }
                    }
                    $wrapper_loadmore.removeClass('penci-disable-sendajax')

                    PENCI.featured_slider()
                    PENCI.owl_slider()
                    PENCI.fitvids()
                    PENCI.sticky_sidebar()
                    PENCI.lightbox()
                    PENCI.masonry()
                    PENCI.portfolio()
                    PENCI.AjaxPortfolio()
                    PENCI.gallery()
                    PENCI.Jarallax()
                    PENCI.extraFunction.init()
                    PENCI.VideosList.init()
                    PENCI.JumtoRecipe()
                    PENCI.shareexpand()
                    PENCI.videofloat()

                    var $review_process = $('.penci-review-process'),
                      $review_piechart = $('.penci-piechart')
                    if ($review_process.length) {
                      $('.penci-review-process').each(function () {
                        var $this = $(this),
                          $bar = $this.children(),
                          $bar_w = $bar.data('width') * 10
                        $this.one('inview',
                          function (event, isInView, visiblePartX,
                            visiblePartY,
                          ) {
                            $bar.animate({ width: $bar_w + '%' }, 1000)
                          }) // bind inview
                      }) // each
                    }

                    if ($review_piechart.length) {
                      $('.penci-piechart').each(function () {
                        var $this = $(this)
                        $this.one('inview',
                          function (event, isInView, visiblePartX,
                            visiblePartY,
                          ) {
                            var chart_args = {
                              barColor: $this.data('color'),
                              trackColor: $this.data('trackcolor'),
                              scaleColor: false,
                              lineWidth: $this.data('thickness'),
                              size: $this.data('size'),
                              animate: 1000,
                            }
                            $this.easyPieChart(chart_args)
                          }) // bind inview
                      }) // each
                    }
                    $('body').trigger('single_loaded_more')
                  },
                })
              }
            }
          }))

          $(window).bind('scroll touchstart', function () {
            // UPdate permalink
            var scrollTop = $(this).scrollTop()
            var firstPost = $('.penci-single-block')
            window.setTimeout(function () {
              var preScrollTop = scrollTop + 60
              var postsContainer = $('.penci-single-block')
              var locationHref = window.location.href

              var currentP = postsContainer.map(function () {
                if ($(this).offset().top < preScrollTop) {
                  return this
                }
              })

              currentP = currentP[currentP.length - 1]
              var pid = $(currentP).data('postid'),
                plink = $(currentP).data('current-url'),
                ptitle = $(currentP).data('post-title'),
                pedit = $(currentP).data('edit-post')

              if (typeof pid === 'undefined' || typeof pid === '') {
                pid = firstPost.data('postid')
                plink = firstPost.data('current-url')
                ptitle = firstPost.data('post-title')
                pedit = firstPost.data('edit-post')
              }

              if (locationHref !== plink) {
                window.history.pushState({ 'pageTitle': ptitle }, '', plink)
                if ($('#wpadminbar').length) {
                  $('#wp-admin-bar-edit a').attr('href', pedit)
                }
                if ($('title').length) {
                  $('title').each(function () {
                    $(this).text(ptitle)
                  })
                }

                if (typeof _gaq !== 'undefined' && _gaq !== null) {
                  _gaq.push(['_trackPageview', plink])
                }

                if (typeof ga !== 'undefined' && ga !== null) {
                  ga('send', 'pageview', plink)
                }
              }

            }, 100)
          })
        }
      }

    /* Init functions
 ---------------------------------------------------------------*/
    $(document).ready(function () {
      PENCI.general()
      PENCI.rdatetime()
      PENCI.cookie()
      PENCI.main_sticky()
      PENCI.featured_slider()
      PENCI.slick_slider()
      PENCI.owl_slider()
      PENCI.fitvids()
      PENCI.sticky_sidebar()
      PENCI.mega_menu()
      PENCI.mobile_menu()
      PENCI.toggleMenuHumburger()
      PENCI.lightbox()
      PENCI.masonry()
      PENCI.video_background()
      PENCI.portfolio()
      PENCI.AjaxPortfolio()
      PENCI.gallery()
      PENCI.Jarallax()
      PENCI.RelatedPopup()
      PENCI.extraFunction.init()
      PENCI.VideosList.init()
      PENCI.JumtoRecipe()
      PENCI.Single_Loadmore()
      PENCI.fontsizeChanger()
      setTimeout(function () {
        PENCI.shareexpand()
        PENCI.fontsizeChanger()
      }, 100)
      PENCI.categories_lists()
      PENCI.blockheadinglist()
      PENCI.SmartLists()
      PENCI.videofloat()
      PENCI.DelayedContent()
      if( /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent) ) {
        PENCI.mobile_ajax_menu()
      }
      $('body').on('penci-ajax-menu-loaded', function(){
        PENCI.mega_menu()
      })
      $('body').on('penci-block-heading', function () {
        PENCI.blockheadinglist()
      }).on('penci-image-gallery', function () {
        PENCI.slick_slider()
      })
      $('body').on('el_featured_slider', function () {
        PENCI.slick_slider()
        PENCI.featured_slider()
        PENCI.owl_slider()
      })
      $('body').on('slider-load', function () {
        PENCI.owl_slider()
      })
      $('body').on('penci_swiper_sliders', function () {
        PENCI.owl_slider()
        PENCI.slick_slider()
      })
      $(document).on('pajax-tab-loaded', function () {
        PENCI.owl_slider()
      })
      $(window).on('resize', function () {
        PENCI.sticky_sidebar()
        PENCI.blockheadinglist()
        PENCI.fontsizeChanger()
        PENCI.videofloat()
        PENCI.mobile_ajax_menu()
        setTimeout(function () {
          PENCI.shareexpand()
        }, 100)
      })
      $(window).on('scroll', function () {
        PENCI.fontsizeChanger()
      })
      $(document).on('penci-mega-loaded', function () {
        PENCI.featured_slider()
        PENCI.owl_slider()
        PENCI.fitvids()
        PENCI.lightbox()
        PENCI.masonry()
        PENCI.portfolio()
        PENCI.AjaxPortfolio()
        PENCI.gallery()
        PENCI.extraFunction.init()
        PENCI.VideosList.init()
      })
    })
  }
)(jQuery)	// EOF
