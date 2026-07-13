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

    /* ---------- 1b. 移动端子菜单折叠（支持多级，事件委托 + 精确高度动画） ---------- */
    function bindSubToggle() {
      var navs = document.querySelectorAll('.main-navigation .main-nav');
      Array.prototype.forEach.call(navs, function (nav) {
        if (nav._subDelegated) return;
        nav._subDelegated = true;
        nav.addEventListener('click', function (e) {
          var link = e.target.closest('a');
          if (!link) return;
          // 找到最近的带子菜单的祖先 li（closest 能穿透 <span> 等任何包裹层，比 parentElement 稳）
          var li = link.closest('li.menu-item-has-children');
          if (!li) return;
          // 仅当点击的是该 li 的「入口链接」（直接位于 li 内、不在其自身 sub-menu 中）才拦截：
          // ① 避免点到子菜单里的叶子链接时误 toggle 上层父项（叶子链接应能正常跳转）；
          // ② 兼容 label 被 <span> 等包裹的情况。
          var ownUl = li.querySelector(':scope > ul');
          if (ownUl && ownUl.contains(link)) return;
          // 仅在移动抽屉内拦截（阻止跳转 + 切换展开）
          var mm = li.closest('.main-navigation');
          if (!mm || !mm.classList.contains('toggled')) return;
          e.preventDefault();
          e.stopPropagation();
          var isOpen = li.classList.contains('sub-open');
          var subUl = li.querySelector(':scope > ul');
          // 关闭同级其它展开项（手风琴式）
          var siblings = li.parentElement ? li.parentElement.children : [];
          Array.prototype.forEach.call(siblings, function (sib) {
            if (sib !== li && sib.classList.contains('sub-open')) {
              sib.classList.remove('sub-open');
              var sibUl = sib.querySelector(':scope > ul');
              if (sibUl) { sibUl.style.display=''; sibUl.style.maxHeight=''; sibUl.style.overflow=''; sibUl.style.transition=''; sibUl.style.opacity=''; }
            }
          });
          if (!isOpen) {
            li.classList.add('sub-open');
            // 精确高度：读 scrollHeight 设为实际像素 → 零多余空间
            if (subUl) {
              // 显式 inline display:block 顶住任何 CSS 隐藏规则，确保一定可见（不依赖 CSS .sub-open 是否生效）
              subUl.style.display = 'block';
              subUl.style.visibility = 'visible';
              subUl.style.transition = 'max-height .35s cubic-bezier(.22,.61,.36,1), opacity .25s ease';
              subUl.style.overflow = 'hidden';
              subUl.style.opacity = '0';
              subUl.style.maxHeight = '0px';
              // 强制 reflow 后设实际高度
              void subUl.offsetHeight;
              subUl.style.maxHeight = subUl.scrollHeight + 'px';
              subUl.style.opacity = '1';
            }
          } else {
            li.classList.remove('sub-open');
            // 收起：用 inline display:block 顶住 CSS 的 display:none，动画过渡高度到 0，结束再清理
            if (subUl) {
              subUl.style.display = 'block';
              subUl.style.overflow = 'hidden';
              subUl.style.transition = 'max-height .35s cubic-bezier(.22,.61,.36,1), opacity .25s ease';
              subUl.style.maxHeight = subUl.scrollHeight + 'px';
              void subUl.offsetHeight;
              subUl.style.maxHeight = '0px';
              subUl.style.opacity = '0';
              // 动画结束清理（若期间又被打开则不清理）
              setTimeout(function(){
                if(!li.classList.contains('sub-open')){
                  subUl.style.display=''; subUl.style.maxHeight=''; subUl.style.overflow=''; subUl.style.opacity=''; subUl.style.transition='';
                }
              }, 400);
            }
          }
        });
      });
    }
    bindSubToggle();

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
    var ridgeLayers = document.querySelectorAll('.gf-hero .hero-ridge .ridge-layer');
    if (wash || ridgeLayers.length) {
      var ticking = false;
      window.addEventListener('scroll', function () {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(function () {
          var y = window.scrollY || window.pageYOffset;
          if (y < 1000) {
            // 三层山按各自 data-speed 错速位移：远层慢、近层快，强化远近层次
            ridgeLayers.forEach(function (l) {
              var sp = parseFloat(l.getAttribute('data-speed')) || 0.08;
              l.style.transform = 'translateY(' + (y * sp) + 'px)';
            });
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

    /* ---------- 6. Hero 飞鸟 · 随机三次贝塞尔曲线轨迹 ---------- */
    var sky = document.querySelector('.hero-sky');
    if (sky && sky.querySelector('.bird')) {
      var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      function rand(a, b) { return Math.random() * (b - a) + a; }
      // 生成一条从画面左侧外缘飘到右侧外缘、上下随机蜿蜒的三段三次贝塞尔曲线
      function buildBirdPath(W, H) {
        var sx = -0.12 * W, ex = 1.12 * W;        // 起止都在画面外，保证完整飞入飞出
        var y0 = rand(0.10 * H, 0.62 * H);
        var y3 = rand(0.10 * H, 0.62 * H);
        var x1 = 0.34 * W, x2 = 0.67 * W;          // 两个中间拐点
        var y1 = rand(0.04 * H, 0.92 * H);
        var y2 = rand(0.04 * H, 0.92 * H);
        function ctrl(lo, hi) { return [rand(lo, hi), rand(0.02 * H, 0.98 * H)]; }
        var a = ctrl(0.08 * W, 0.30 * W), b = ctrl(0.22 * W, 0.46 * W);
        var c = ctrl(0.45 * W, 0.62 * W), d = ctrl(0.58 * W, 0.78 * W);
        var e = ctrl(0.74 * W, 0.94 * W), f = ctrl(0.88 * W, 1.04 * W);
        return 'path("M ' + sx.toFixed(1) + ' ' + y0.toFixed(1) +
          ' C ' + a[0].toFixed(1) + ' ' + a[1].toFixed(1) + ' ' + b[0].toFixed(1) + ' ' + b[1].toFixed(1) + ' ' + x1.toFixed(1) + ' ' + y1.toFixed(1) +
          ' C ' + c[0].toFixed(1) + ' ' + c[1].toFixed(1) + ' ' + d[0].toFixed(1) + ' ' + d[1].toFixed(1) + ' ' + x2.toFixed(1) + ' ' + y2.toFixed(1) +
          ' C ' + e[0].toFixed(1) + ' ' + e[1].toFixed(1) + ' ' + f[0].toFixed(1) + ' ' + f[1].toFixed(1) + ' ' + ex.toFixed(1) + ' ' + y3.toFixed(1) + '")';
      }
      var birds = Array.prototype.slice.call(sky.querySelectorAll('.bird'));
      function applyPaths() {
        var W = sky.clientWidth, H = sky.clientHeight;
        if (!W || !H) return;
        birds.forEach(function (bird) { bird.style.offsetPath = buildBirdPath(W, H); });
      }
      applyPaths();
      if (reduceMotion) {
        // 无障碍：静态散布在轨迹上，不运动
        birds.forEach(function (bird, i) { bird.style.offsetDistance = (15 + i * 17) + '%'; });
      } else {
        birds.forEach(function (bird) {
          var dur = rand(46, 92);                  // 每只速度不同
          var delay = -rand(0, dur);               // 错峰起飞，避免同步
          bird.style.offsetDistance = '0%';
          bird._birdAnim = bird.animate(
            [{ offsetDistance: '0%' }, { offsetDistance: '100%' }],
            { duration: dur * 1000, delay: delay * 1000, iterations: Infinity, easing: 'linear' }
          );
        });
      }
      // 视口尺寸变化时重算路径（动画沿新路径继续，无需重启）
      var rt;
      window.addEventListener('resize', function () {
        clearTimeout(rt);
        rt = setTimeout(applyPaths, 250);
      });
    }

  });
})();
