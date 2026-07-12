/* Foyar Stories · 全局交互
 * 1) 移动端导航：汉堡展开/收起（点击遮罩或菜单项关闭）
 * 2) 固定顶栏：首屏透明浮于 Hero，滚动后变实色
 * 3) 入场动画：IntersectionObserver 依次浮现
 * 4) Hero 视差：远山/墨晕随滚动轻微位移
 * 5) 朱砂钤印落定
 */
(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {

    /* ---------- 1. 移动端导航 ---------- */
    var toggles = document.querySelectorAll('.main-navigation .menu-toggle');
    Array.prototype.forEach.call(toggles, function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        var nav = btn.closest('.main-navigation');
        if (!nav) return;
        var open = nav.classList.toggle('toggled');
        btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
    });
    // 点击遮罩(scrim)或任意菜单项 → 收起
    document.addEventListener('click', function (e) {
      var openNavs = document.querySelectorAll('.main-navigation.toggled');
      Array.prototype.forEach.call(openNavs, function (nav) {
        if (!nav.contains(e.target)) return;
        if (e.target.closest('a')) {
          nav.classList.remove('toggled');
        } else if (e.target.classList.contains('main-nav')) {
          nav.classList.remove('toggled');
        }
      });
    });

    /* ---------- 2. 顶栏滚动实色 ---------- */
    var header = document.querySelector('.site-header');
    if (header) {
      var onScroll = function () {
        if ((window.scrollY || window.pageYOffset) > 40) {
          header.classList.add('is-solid');
        } else {
          header.classList.remove('is-solid');
        }
      };
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
    }

    /* ---------- 3. 入场动画 ---------- */
    var reveals = document.querySelectorAll('[data-reveal]');
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) {
            en.target.classList.add('in');
            io.unobserve(en.target);
          }
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
      Array.prototype.forEach.call(reveals, function (el) { io.observe(el); });
    } else {
      Array.prototype.forEach.call(reveals, function (el) { el.classList.add('in'); });
    }

    /* ---------- 4. Hero 视差 ---------- */
    var wash = document.querySelector('.gf-hero .hero-wash');
    var ridge = document.querySelector('.gf-hero .hero-ridge');
    if (wash || ridge) {
      var ticking = false;
      window.addEventListener('scroll', function () {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(function () {
          var y = window.scrollY || window.pageYOffset;
          if (y < 1000) {
            if (ridge) ridge.style.transform = 'translateY(' + (y * 0.10) + 'px)';
            if (wash) wash.style.transform = 'translateY(' + (y * -0.06) + 'px)';
          }
          ticking = false;
        });
      }, { passive: true });
    }

    /* ---------- 5. 钤印落定 ---------- */
    var stamp = document.querySelector('.hero-stamp');
    if (stamp) {
      setTimeout(function () { stamp.classList.add('stamped'); }, 700);
    }

  });
})();
