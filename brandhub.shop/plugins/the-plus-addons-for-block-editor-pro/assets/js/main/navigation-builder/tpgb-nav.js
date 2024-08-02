document.addEventListener('DOMContentLoaded', function() {
    
    function tpnavScro() {
        var navBuilder = document.querySelectorAll('.tpgb-navbuilder');

        if (navBuilder) {
            navBuilder.forEach(function(navbuild) {
            var navLinks = navbuild.querySelectorAll('a');
            var pathname = window.location.pathname;
            var currentHash = window.location.hash;
            pathname = pathname.substr(pathname.indexOf('/') + 1);
            if(navLinks){
                navLinks.forEach(function(navLink) {
                    var navPath = ( navLink.getAttribute('href') && navLink.getAttribute('href') != 'javascript:void(0);' ) ? navLink.getAttribute('href').replace(/\/$/, '') : '';
                    var menuItemPathname = navPath ? new URL(navPath, window.location.href).pathname : "";
                    var menuItemHash = navPath ? navPath.substring(navPath.indexOf('#')) : "";
                    if ( menuItemHash === currentHash ) {
                        navLinks.forEach(function(item) {
                            if( navLink!=item && item.closest('li') != null ){
                            item.closest('li').classList.remove('active');		  
                            }
                        });
                        setTimeout(function() {
                            if( navLink.closest('li') != null){
                                navLink.closest('li').classList.add('active');
                            }
                        }, 5);
                    }else if (navPath === window.location.href.replace(/\/$/, '') && navLink.closest('li') ) {
                        var closestLi = navLink.closest('li');
                        if (closestLi !== null) {
                            closestLi.classList.add('active');
                        }
                    } else if (pathname && menuItemPathname && menuItemPathname === pathname) {
                        var closestLi = navLink.closest('li');
                        if (closestLi !== null) {
                            closestLi.classList.add('active');
                        }
                    }
                });
            }
        });
        }
    }
    
    window.addEventListener('scroll', function() {
        tpnavScro();
    });
    
    tpnavScro();

    tpNav(document)

}); 

function tpNav(doc){
    let getNavBuilder = doc.querySelectorAll('.tpgb-navbuilder');
    let innerWidth = window.innerWidth;
    if (getNavBuilder) {
        getNavBuilder.forEach((nav)=> {

            let getNavv = nav.querySelector('.tpgb-nav-inner');
            if(innerWidth < 991){
                if(getNavv.classList.contains('menu-hover')){
                    getNavv.classList.remove('menu-hover')
                    getNavv.classList.add('menu-click')
                }
            }

            /** Click */
            var menuClickNav = nav.querySelector(".tpgb-nav-wrap > .tpgb-nav-inner.menu-click");
            if (menuClickNav) {
                var menuClickItems = nav.querySelectorAll('.tpgb-nav-wrap > .menu-click .tpgb-normal-menu > .tpgb-nav-item > .navbar-nav > li.menu-item-has-children > a, .tpgb-nav-wrap .menu-click .tpgb-mobile-menu > .navbar-nav > li.menu-item-has-children > a');
                menuClickItems.forEach((item)=> {
                    item.addEventListener('click', (e)=> {
                        e.preventDefault();
                        e.stopPropagation();
                        
                        var closestNavInner = item.closest(".tpgb-nav-inner.menu-click");
                        
                        if (closestNavInner) {
                            var navSideBut = item,
                                navSideItem = navSideBut.parentElement,
                                navSideUl = navSideItem.parentElement,
                                navSideItemSub = navSideItem.querySelector('ul.dropdown-menu');
                            
                            if (navSideItem.classList.contains('open')) {
                                slideUpP(navSideItemSub, 400)
                                navSideItemSub.classList.remove('open-menu');
                                navSideItem.classList.remove('open');
                            } else {
                                navSideUl.style.height = "auto";
                                navSideUl.querySelectorAll('li.dropdown.open ul.dropdown-menu').forEach((el)=> {
                                    slideUpP(el, 400)
                                });
                                navSideUl.querySelectorAll('li.dropdown-submenu.open ul.dropdown-menu').forEach((el)=> {
                                    slideUpP(el, 400)
                                });
                                navSideUl.querySelectorAll('li.dropdown, li.dropdown-submenu.open').forEach((el)=> {
                                    el.classList.remove('open');
                                });
                                slideDownP(navSideItemSub, 400)
                                navSideItemSub.classList.add('open-menu');
                                navSideItem.classList.add('open');
                            }
                        }
                        
                        if (navSideUl.querySelectorAll('li.dropdown.open ul.dropdown-menu .tpgb-carousel').length) {
                            var splideDiv = navSideUl.querySelector('li.dropdown.open ul.dropdown-menu');
                            var scope = splideDiv.querySelectorAll('.tpgb-carousel');
                            navsplider(scope);
                        }
        
                        if (navSideUl.querySelectorAll('li.dropdown.open ul.dropdown-menu .tpgb-isotope .post-loop-inner').length) {
                            navSideUl.querySelectorAll('li.dropdown.open ul.dropdown-menu .tpgb-isotope .post-loop-inner').forEach((el)=> {
                                //el.isotope('layout');
                                tppoMaso(navSideUl)
                            });
                        }
                    });
                });

                var menusubClickItems = nav.querySelectorAll('.tpgb-nav-wrap .menu-click .tpgb-normal-menu .tpgb-nav-item > .navbar-nav .dropdown-submenu,.tpgb-nav-wrap .menu-click .tpgb-mobile-menu  .navbar-nav .dropdown-submenu');

                menusubClickItems.forEach((item)=> {
                    item.addEventListener('click', (e)=> {
                        e.preventDefault();
                        e.stopPropagation();
                        
                        var closestNavInner = item.closest(".tpgb-nav-inner.menu-click");
                        
                        if (closestNavInner) {
                            var navSideBut = item,
                                navSideItem = navSideBut.parentElement,
                                navSideUl = navSideItem.parentElement,
                                navSideItemSub = navSideItem.querySelector('ul.dropdown-menu');
                            if (navSideItem.classList.contains('open')) {
                                slideUpP(navSideItemSub, 400)
                                navSideItemSub.classList.remove('open-menu');
                                navSideItem.classList.remove('open');
                            } else {
                                navSideUl.style.height = "auto";
                                navSideUl.querySelectorAll('li.dropdown-submenu.open ul.dropdown-menu').forEach((el)=> {
                                    slideUpP(el, 400)
                                });
                                navSideUl.querySelectorAll('li.dropdown, li.dropdown-submenu.open').forEach((el)=> {
                                    el.classList.remove('open');
                                });
                                slideDownP(navSideItemSub, 400)
                                navSideItemSub.classList.add('open-menu');
                                navSideItem.classList.add('open');
                            }
                        }
                        
                        if (navSideUl.querySelectorAll('li.dropdown.open ul.dropdown-menu .tpgb-carousel').length) {
                            var splideDiv = navSideUl.querySelector('li.dropdown.open ul.dropdown-menu');
                            var scope = splideDiv.querySelectorAll('.tpgb-carousel');
                            navsplider(scope);
                        }
        
                        if (navSideUl.querySelectorAll('li.dropdown.open ul.dropdown-menu .tpgb-isotope .post-loop-inner').length) {
                            navSideUl.querySelectorAll('li.dropdown.open ul.dropdown-menu .tpgb-isotope .post-loop-inner').forEach((el)=> {
                                el.isotope('layout');
                            });
                        }
                    });
                });
        
                document.addEventListener('mouseup', (e)=> {
                    var menu = document.querySelectorAll('li.dropdown');
                    menu.forEach((item)=> {
                        if (!item.contains(e.target)) {
                            item.querySelectorAll('ul.dropdown-menu').forEach((el)=> {
                                slideUpP(el, 400)
                            });
                            item.querySelectorAll('li.dropdown-submenu.open ul.dropdown-menu').forEach((el)=> {
                                slideUpP(el, 400)
                            });
                            item.classList.remove('open');
                        }
                    });
                });
            }  

            /** Mouse Event */
            var menuHoverNav = nav.querySelector(".tpgb-nav-wrap > .tpgb-nav-inner.menu-hover");
            if(menuHoverNav){

                /** Menu */
                var menuHoverItems = nav.querySelectorAll('.tpgb-nav-wrap .menu-hover .tpgb-normal-menu .tpgb-nav-item > .navbar-nav .dropdown,.tpgb-nav-wrap .menu-hover .tpgb-mobile-menu > .navbar-nav .dropdown');

                menuHoverItems.forEach((item)=> {
                    if (innerWidth <= 991 && nav.querySelectorAll('.tpgb-mobile-menu').length > 0) {
                        if(item.classList.contains('menu-item-has-children')){
                            let getAtag = item.querySelector('a');
                            if(getAtag){
                                getAtag.style.pointerEvents = 'none';
                            }
                        }
                    }


                    item.addEventListener('mouseenter', (e)=> {
                        e.preventDefault();
                        e.stopPropagation();
                        menuSubMenuHover('enter', e.currentTarget)
                        // Grid Layout For Mega Menu
                        if ( item.querySelector(".dropdown-menu .tpgb-isotope .post-loop-inner") && typeof tppoMaso == 'function' ) {
                            tppoMaso(item);
                        }
                    });
                    item.addEventListener('mouseleave', (e)=> {
                        e.stopPropagation();
                        menuSubMenuHover('leave', e.currentTarget)
                    });
                });

                /** Sub Menu */
                var smenuHoverItems = nav.querySelectorAll('.tpgb-nav-wrap .menu-hover .tpgb-normal-menu .tpgb-nav-item > .navbar-nav .dropdown-submenu,.tpgb-nav-wrap .menu-hover .tpgb-mobile-menu >  .navbar-nav .dropdown-submenu');

                smenuHoverItems.forEach((item)=> {
                    item.addEventListener('mouseenter',(e)=> {
                        e.preventDefault();
                        menuSubMenuHover('enter', e.currentTarget)
                        // Grid Layout For Mega Menu
                        if (item.querySelector(".dropdown-menu .tpgb-isotope .post-loop-inner")) {
                            item.querySelector(".dropdown-menu .tpgb-isotope .post-loop-inner").isotope('layout');
                        }
                    });
                    item.addEventListener('mouseleave',(e)=> {
                        menuSubMenuHover('leave', e.currentTarget)
                    });
                });

            }


            // Check if there are elements with class "tpgb-nav-item vertical-side toggle-click"
            if (nav.querySelectorAll(".tpgb-nav-item.vertical-side.toggle-click").length > 0) {
                // Add event listener for click on elements with class "vertical-side-toggle" inside ".vertical-side.toggle-click"
                nav.querySelectorAll(".vertical-side.toggle-click .vertical-side-toggle").forEach((item)=> {
                    item.addEventListener("click",(a)=> {
                        a.preventDefault();
                        a.stopPropagation();
                        item.closest(".toggle-click").classList.toggle("tp-click");
                    });
                });
            }

            // Check if there are elements with class "tpgb-nav-item vertical-side toggle-hover"
            if (nav.querySelectorAll(".tpgb-nav-item.vertical-side.toggle-hover").length > 0) {
                // Add event listener for mouseenter
                nav.querySelectorAll(".vertical-side.toggle-hover").forEach((item)=> {
                    item.addEventListener('mouseenter', ()=> {
                        e.preventDefault();
                        item.classList.add("tp-hover");
                    });
                    // Add event listener for mouseleave
                    item.addEventListener('mouseleave', ()=> {
                        item.classList.remove("tp-hover");
                    });
                });
            }

            // Js For Toggle Class On Click on the toggle icon start 
            if (nav.querySelectorAll(".tpgb-toggle-menu.hamburger-toggle").length > 0) {
                nav.querySelectorAll(".tpgb-toggle-menu.hamburger-toggle").forEach((item)=> {

                    // Add click event listener to each element
                    item.addEventListener('click', ()=> {
                        var target = item.dataset.target;
                        item.classList.toggle("open-menu");
                        var collapseNotIn = nav.querySelectorAll(target + '.collapse:not(.in)');
                        if (collapseNotIn.length) {
                            collapseNotIn.forEach((el)=> {
                                slideDownP(el, 300)
                                el.classList.add('in');
                            });
                        } else {
                            var collapseIn = nav.querySelectorAll(target + '.collapse.in');
                            collapseIn.forEach((el)=> {
                                slideUpP(el, 300)
                                el.classList.remove('in');
                            });
                        }

                        var offeset = '';
                        var windowWidth = window.innerWidth;
                        var menuContent = nav.querySelector(target);
                        var navWrap = menuContent.closest('.tpgb-navbuilder');
                        var offsetLeft = '';

                        let gtParent = navWrap.parentElement;

                        if (gtParent.classList.contains("tpgb-container-col")) {
                            // offeset = navWrap.closest(".tpgb-container-col");
                            offsetLeft = 0 - (window.innerWidth - (gtParent.offsetLeft + gtParent.offsetWidth));
                            tpgbresleftCss(offsetLeft, windowWidth, menuContent);
                        }

                        if (gtParent.classList.contains("tpgb-container-row")) {
                            // offeset = navWrap.closest(".tpgb-container-row");
                            offsetLeft = 0 - gtParent.offsetLeft;
                            tpgbresleftCss(offsetLeft, windowWidth, menuContent);
                        }

                        if (gtParent.classList.contains("tpgb-cont-in")) {
                            // offeset = navWrap.closest(".tpgb-cont-in");
                            offsetLeft = 0 - gtParent.offsetLeft;
                            tpgbresleftCss(offsetLeft, windowWidth, menuContent);
                        }

                        if(gtParent.classList.contains('tpgb-section')){
                            // offeset = navWrap.closest(".tpgb-section");
                            offsetLeft = 0 - offeset.offsetLeft;
                            tpgbresCss(offsetLeft, windowWidth, menuContent);
                        }
                    });
                });
            }

            /* submenu toggle for standard menu Start */
            nav.querySelectorAll(".tpgb-mobile-menu.tpgb-menu-toggle .tpgb-menu-wrap > .navbar-nav > li.menu-item-has-children > a, .tpgb-mobile-menu.tpgb-menu-off-canvas .template-wrap > .navbar-nav li.menu-item-has-children > a").forEach((item)=> {
                item.addEventListener("click", (a)=> {
                    a.preventDefault();
                    a.stopPropagation();
                    var b = item,
                        c = b.parentElement,
                        d = c.parentElement,
                        e = c.querySelector("ul.dropdown-menu");
            
                    if (c.classList.contains("open")) {
                       slideUpP(e, 300)
                        c.classList.remove("open");
                    } else {
                        d.style.height = "auto";
                        d.querySelectorAll("li.dropdown.open ul.dropdown-menu").forEach((el)=> {
                            slideUpP(el, 300)
                        });
                        d.querySelectorAll("li.dropdown-submenu.open ul.dropdown-menu").forEach((el)=> {
                            slideUpP(el, 300)
                        });
                        d.querySelectorAll("li.dropdown, li.dropdown-submenu.open").forEach((el)=> {
                            el.classList.remove("open");
                        });
                        slideDownP(e, 300)
                        c.classList.add("open");
                    }
            
                    if (d.querySelectorAll("li.dropdown.open ul.dropdown-menu .tpgb-carousel").length) {
                        var splideDiv = d.querySelector("li.dropdown.open ul.dropdown-menu");
                        var scope = splideDiv.querySelectorAll('.tpgb-carousel');
                        navsplider(scope);
                    }
            
                    if (d.querySelectorAll('li.dropdown.open ul.dropdown-menu .tpgb-isotope .post-loop-inner').length) {
                        d.querySelectorAll('li.dropdown.open ul.dropdown-menu .tpgb-isotope .post-loop-inner').forEach((el)=> {
                            el.isotope('layout');
                        });
                    }
                });
            }); 
            /* submenu toggle for standard menu Start */  
            // Js For Toggle Class On Click on the toggle icon End   
            
            
            // JS for off Canvas Start
            let getoffCan = nav.querySelector(".tpgb-toggle-menu.hamburger-off-canvas");
            if (getoffCan) {
                let getInner = nav.querySelector(".tpgb-nav-inner");
                var mouse_click = getInner.dataset.mobileMenuClick;
                var bodyselect = '';
            
                nav.querySelector('.tpgb-toggle-menu.hamburger-off-canvas').addEventListener('click',(event)=> {
                    var target = event.currentTarget;
                    if (target.classList.contains('tpgb-toggle-menu') && target.classList.contains('hamburger-off-canvas')) {
                        target.classList.add('open-menu');
                        document.body.classList.add('mobile-menu-open');
                        var b = target,
                            c = b.parentElement.parentElement;
                        c.querySelector('.tpgb-mobile-menu.tpgb-menu-off-canvas').classList.add('is-active');
                    }
                });
            
                if (mouse_click == 'yes') {
                   document.addEventListener('click',(event)=> {
                    if(getoffCan.classList.contains('open-menu') && !event.target.closest('.tpgb-search-input') && !event.target.classList.contains('tpgb-toggle-menu') && !event.target.classList.contains('toggle-line') && !event.target.classList.contains('tpgb-toggle-nm')){
                        let getmMenu = getInner.querySelector('.tpgb-mobile-menu.tpgb-menu-off-canvas');
                        if (getmMenu.classList.contains('is-active')) {
                            getmMenu.classList.remove('is-active');
                            getmMenu.classList.remove('mobile-menu-open');
                            getInner.querySelector(".tpgb-toggle-menu.hamburger-off-canvas").classList.remove('open-menu');
                        }
                        getoffCan.classList.remove('open-menu');
                    }
                    });
                } else {
                    nav.querySelector('.tpgb-mobile-menu.tpgb-menu-off-canvas .close-menu').addEventListener('click',(event)=> {
                        var target = event.currentTarget;
                        if (target.classList.contains('close-menu')) {
                            var p = target.parentElement;
                            document.body.classList.remove('mobile-menu-open');
                            if (p.classList.contains('is-active')) {
                                p.classList.remove('is-active');
                                p.previousElementSibling.querySelector(".tpgb-toggle-menu.hamburger-off-canvas").classList.remove('open-menu');
                            }
                        }
                    });
                }
            }
            // JS for off Canvas End

            /* Toggle class For Opacity in Main Menu & sub Menu Start */
            if (nav.querySelectorAll('.tpgb-nav-item .hover-inverse-effect').length > 0) {
                nav.querySelectorAll('.tpgb-nav-item .nav > li').forEach((item)=> {
                    item.addEventListener('mouseenter', (e)=> {
                        e.preventDefault();
                        e.currentTarget.closest('.hover-inverse-effect').classList.add('is-hover-inverse');
                        e.currentTarget.classList.add('is-hover');
                    });
                    item.addEventListener('mouseleave', (e)=> {
                        e.currentTarget.closest('.hover-inverse-effect').classList.remove('is-hover-inverse');
                        e.currentTarget.classList.remove('is-hover');
                    });
                });
            }

            if (nav.querySelectorAll('.tpgb-nav-item .submenu-hover-inverse-effect').length > 0) {
                nav.querySelectorAll('.tpgb-nav-item .nav li.dropdown .dropdown-menu > li').forEach((item)=> {
                    item.addEventListener('mouseenter', (e)=> {
                        e.preventDefault();
                        e.currentTarget.closest('.submenu-hover-inverse-effect').classList.add('is-submenu-hover-inverse');
                        e.currentTarget.classList.add('is-hover');
                    });
                    item.addEventListener('mouseleave', (e)=> {
                        e.currentTarget.closest('.submenu-hover-inverse-effect').classList.remove('is-submenu-hover-inverse');
                        e.currentTarget.classList.remove('is-hover');
                    });
                });
            }
            /*Toggle class For Opacity in Main Menu & sub Menu End */

            /* Swiper Start */
            var swiperContainer = nav.querySelector('.tpgb-mobile-menu.tpgb-menu-swiper');
            if (swiperContainer) {
                new Swiper(swiperContainer, {
                    slidesPerView: "auto",
                    mousewheelControl: true,
                    freeMode: true
                });
            }
            /* Swiper End */
            if (innerWidth <= 991 && nav.querySelectorAll('.tpgb-mobile-menu').length > 0) {
                document.addEventListener('mouseup', function(e) {
                    e.preventDefault();
                    var container = nav.querySelector('.tpgb-toggle-menu');
                    var mouseClick = nav.querySelector('.tpgb-nav-inner') ? nav.querySelector('.tpgb-nav-inner').getAttribute('data-mobile-menu-click') : null;
                    if (mouseClick && mouseClick === 'yes' && !e.target.closest('#menu-main-menu') && !e.target.classList.contains('tpgb-toggle-menu') && !e.target.classList.contains('toggle-line') && !e.target.classList.contains('tpgb-toggle-nm') && !e.target.closest('.tpgb-nav-inner') && !e.target.closest('.tpgb-mobile-menu')) {
                        if (!container.contains(e.target)) {
                            document.querySelectorAll('.tpgb-mobile-menu:not(.tpgb-menu-off-canvas)').forEach(function(menu) {
                                slideUpP(menu, 300)
                                menu.classList.remove('in');
                            });
                            document.querySelectorAll('.tpgb-mobile-menu.tpgb-menu-off-canvas').forEach(function(menu) {
                                menu.classList.remove('is-active');
                            });
                            document.querySelectorAll('.tpgb-nav-inner .tpgb-toggle-menu').forEach(function(toggleMenu) {
                                toggleMenu.classList.remove('open-menu');
                            });
                        }
                    }
                });
            }

        });
    }
}

function menuSubMenuHover(type, element){
    var container = element.closest(".tpgb-nav-inner");
    var transitionStyle = container.dataset.menu_transition;
    if(type='enter' && type!='leave'){
        if (transitionStyle == '' || transitionStyle == 'style-1') {
            slideDownP(element.querySelector(".dropdown-menu"), 300)
        } else if (transitionStyle == 'style-2') {
            fadeInP(element.querySelector(".dropdown-menu"), 300)
            if (element.querySelector(".dropdown-menu .tpgb-carousel")) {
                var splideDiv = element.querySelector('.dropdown-menu');
                var scope = splideDiv.querySelectorAll('.tpgb-carousel');
                navsplider(scope);
            }
        } else if (transitionStyle == 'style-3' || transitionStyle == 'style-4') {
            element.querySelector(".dropdown-menu").classList.add("open-menu");
        }
        if (element.querySelector(".dropdown-menu .tpgb-carousel")) {
            var splideDiv = element.querySelector('.dropdown-menu');
            var scope = splideDiv.querySelectorAll('.tpgb-carousel');
            navsplider(scope);
        }
    }else if(type='leave'){
        if (transitionStyle == '' || transitionStyle == 'style-1') {
            slideUpP(element.querySelector(".dropdown-menu"), 300)
        } else if (transitionStyle == 'style-2') {
            fadeOutP(element.querySelector(".dropdown-menu"), 300)
        } else if (transitionStyle == 'style-3' || transitionStyle == 'style-4') {
            element.querySelector(".dropdown-menu").classList.remove("open-menu");
        }
    }
}

function tpgbresleftCss(offset_left , window_width , menu_content ){
    var body = document.querySelector('body');
    if (body.classList.contains("rtl")) {
        menu_content.style.right = 'unset';
        menu_content.style.boxSizing = 'border-box';
        menu_content.style.width = window_width + 'px';
        menu_content.style.left = offset_left + 'px';
    } else {
        menu_content.style.right = offset_left + 'px';
        menu_content.style.boxSizing = 'border-box';
        menu_content.style.width = window_width + 'px';
        menu_content.style.left = 'unset';
    }

}

function tpgbresCss(offset_left, window_width, menu_content) {
    var body = document.querySelector('body');
    if (body.classList.contains("rtl")) {
        menu_content.style.right = offset_left + 'px';
        menu_content.style.boxSizing = 'border-box';
        menu_content.style.width = window_width + 'px';
    } else {
        menu_content.style.left = offset_left + 'px';
        menu_content.style.boxSizing = 'border-box';
        menu_content.style.width = window_width + 'px';
    }
}

/* Js For Mega Menu */

window.addEventListener('load', tpnavmResize);
window.addEventListener('resize', tpnavmResize);

function tpnavmResize() {

    let getNavWrap = document.querySelectorAll('.tpgb-navbuilder');
    if(getNavWrap){
        getNavWrap.forEach(function(navbuild) {
            var tpgbDropdownContainers = navbuild.querySelectorAll('.tpgb-nav-item .tpgb-dropdown-container');
            var tpgbDropdownFullWidths = navbuild.querySelectorAll('.tpgb-nav-item .tpgb-dropdown-full-width');
            var leftOffset = 0;

            if (tpgbDropdownContainers.length > 0 || tpgbDropdownFullWidths.length > 0) {
                tpgbDropdownContainers.forEach(function(container) {
                    var verticalMenu = container.closest('.vertical-side');
                    if (verticalMenu) {
                        var fullWidth = container.closest(".tpgb-section-wrap") ? container.closest(".tpgb-section-wrap").offsetWidth : (container.closest(".tpgb-container-row")) ? container.closest(".tpgb-container-row").offsetWidth : undefined;
                        var menuWidth = verticalMenu.querySelector(".navbar-nav").offsetWidth;
                        var conWidth = fullWidth - menuWidth - 20;
                        var containerMegamenu = container.querySelector('.dropdown-menu');
                        containerMegamenu.style.boxSizing = "border-box";
                        if(conWidth){
                            containerMegamenu.style.width = conWidth + "px";   
                        }
                    } else {
                        var contWidth = container.closest(".tpgb-section-wrap") ? container.closest(".tpgb-section-wrap").offsetWidth : (container.closest(".tpgb-cont-in")) ? container.closest(".tpgb-cont-in").offsetWidth : (container.closest(".tpgb-container-row")) ? container.closest(".tpgb-container-row").offsetWidth : undefined;
                        var windowWidth = window.innerWidth;
                        windowWidth = windowWidth - contWidth;
                        var offeset = container.closest(".tpgb-nav-wrap");
                        leftOffset = windowWidth / 2;
                        
                        var containerMegamenu = container.querySelector('.dropdown-menu');
                        if (document.body.classList.contains("rtl")) {
                            var divoffsetLeft = 0;
                            var element = offeset;
                            while (element) {
                                divoffsetLeft += element.offsetLeft;
                                element = element.offsetParent;
                            }
                            var offsetRight = 0 - divoffsetLeft + leftOffset;
                            containerMegamenu.style.right = offsetRight + "px";
                        } else {

                            var divoffsetLeft = 0;
                            var element = offeset;
                            while (element) {
                                divoffsetLeft += element.offsetLeft;
                                element = element.offsetParent;
                            }
                            var offsetLeft = 0 - divoffsetLeft + leftOffset;
                            containerMegamenu.style.left = offsetLeft + "px";
                        }
                        containerMegamenu.style.boxSizing = "border-box";
                        if(contWidth){
                            containerMegamenu.style.width = contWidth + "px";   
                        }
                    }
                });
            }
            if (tpgbDropdownFullWidths.length > 0) {
                tpgbDropdownFullWidths.forEach(function(container) {
                    var verticalMenu = container.closest('.menu-vertical-side');
                    if (verticalMenu) {
                        var fullWidth = (container.closest(".tpgb-container")) ? container.closest(".tpgb-container").offsetWidth : undefined;
                        var menuWidth = verticalMenu.querySelector(".navbar-nav").offsetWidth;
                        var conWidth = fullWidth - menuWidth - 20;
                        var containerMegamenu = container.querySelector('.dropdown-menu');
                        containerMegamenu.style.boxSizing = "border-box";
                        if(conWidth && conWidth!=NaN){
                            containerMegamenu.style.width = conWidth + "px";
                        }
                    } else {
                        var fullWidth = (container.closest(".tpgb-container")) ? container.closest(".tpgb-container").offsetWidth : undefined;
                        var windowWidth = window.innerWidth;
                        var offeset = container.closest(".tpgb-nav-wrap");
                        var divoffsetLeft = 0;
                        var element = offeset;
                        while (element) {
                            divoffsetLeft += element.offsetLeft;
                            element = element.offsetParent;
                        }

                        var offsetLeft = 0 - divoffsetLeft - (leftOffset);
                        if (document.body.classList.contains("rtl")) {
                            var offsetLeft = 0 - (windowWidth - (divoffsetLeft + offeset.offsetWidth));
                        }
                        var containerMegamenu = container.querySelector('.dropdown-menu');
                        if (document.body.classList.contains("rtl")) {
                            containerMegamenu.style.right = offsetLeft + "px";
                        } else {
                            containerMegamenu.style.left = offsetLeft + "px";
                        }
                        containerMegamenu.style.boxSizing = "border-box";
                        containerMegamenu.style.width = windowWidth + "px";
                    }
                });
            }

            // Desktop Menu Hide 
            var element = navbuild.querySelector('.tpgb-mobile-nav-toggle'),
                style = ( element ) ? window.getComputedStyle(element) : '',
                displayProperty = ( style ) ? style.getPropertyValue('display') : '';

            if(displayProperty == 'none'){
                if( element.querySelector('.tpgb-toggle-menu').classList.contains('open-menu') ){
                    element.querySelector('.tpgb-toggle-menu').classList.remove("open-menu");
                }
               
                slideUpP(element.nextElementSibling, 300)
                element.nextElementSibling.classList.remove('in');
            }
        }); 
    }
}

// Slider Init
function navsplider(ele){
    ele.forEach(function(obj){
        var splideInit = slideStore.get(obj);
        splideInit.refresh();
    });
}