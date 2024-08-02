/**
 * Circle Menu
 */
document.addEventListener('DOMContentLoaded', () => {
    tpcircleMenu(document)
});

function tpcircleMenu(doc){
    let allCmenu = doc.querySelectorAll('.tpgb-circle-menu');
    if(allCmenu){
        allCmenu.forEach((cm)=>{
			if (cm.classList.contains('layout-straight')) {
				var mainMenuIcons = cm.querySelector(".tpgb-circle-main-menu-list .main_menu_icon");
				mainMenuIcons.addEventListener('click', function (e) {
					e.preventDefault();
					var blockId = this.closest(".tpgb-circle-menu").getAttribute("data-block-id");
					var circleMenuWrap = doc.querySelector('#' + blockId + ' .tpgb-circle-menu-wrap');
					var showBgOverlay = this.closest(".tpgb-circle-menu").querySelector('.show-bg-overlay');
			
					if (circleMenuWrap.classList.contains("circleMenu-closed")) {
						circleMenuWrap.classList.remove("circleMenu-closed");
						circleMenuWrap.classList.add("circleMenu-open");
						(showBgOverlay) ? showBgOverlay.classList.add("activebg") : '';
					} else if (circleMenuWrap.classList.contains("circleMenu-open")) {
						circleMenuWrap.classList.remove("circleMenu-open");
						circleMenuWrap.classList.add("circleMenu-closed");
						(showBgOverlay) ? showBgOverlay.classList.remove("activebg") : '';
					}
				});
			}

			if (cm.classList.contains('layout-circle')) {
				let menuopt = JSON.parse(cm.getAttribute('data-cirmenu-opt'));
				let menuWrap = cm.querySelector('ul.tpgb-circle-menu-wrap');

				new CircleMenu(menuWrap, {
					direction: menuopt.direction,
					anglestart: menuopt.anglestart,
					angleend: menuopt.angleend,
					circle_radius: menuopt.circle_radius,
					circle_radius_tablet: menuopt.circle_radius_tablet,
					circle_radius_mobile: menuopt.circle_radius_mobile,
					delay: menuopt.delay,
					item_diameter: menuopt.item_diameter,
					speed: menuopt.speed,
					step_in: menuopt.step_in,
					step_out: menuopt.step_out,
					transition_function: menuopt.transition_function,
					trigger: menuopt.trigger
				});
			}
			
			if (cm.classList.contains('scroll-view')) {
				window.addEventListener('scroll', function () {
					let scrollVal = window.pageYOffset,
						scroll_view_value = cm.getAttribute("data-scroll-view"),
						block_id = cm.getAttribute("data-block-id"),
						scroll_top = doc.querySelector("#" + block_id);
					if (scrollVal > parseInt(scroll_view_value)) {
						scroll_top.classList.add('show');
					} else {
						scroll_top.classList.remove('show');
					}
				});
			}
			
			/** Tooltip */
			let cmTTList  = cm.querySelectorAll(".tpgb-circle-menu-list");
            cmTTList.forEach((ctt)=>{
                let id = ctt.getAttribute('id'),
                    settings = ctt.getAttribute("data-tooltip-opt");
				if(settings){
					settings = JSON.parse(settings);
					if(settings.content != '' ){
						tippy( '#'+id , {
							allowHTML : true,
							content: settings.content,
							trigger : settings.trigger,
							maxWidth : settings.MaxWidth,
							appendTo: doc.querySelector('#'+id),
						});
					}
				}
            })

			let showBgOverlayElements = cm.querySelector(".show-bg-overlay");
			if(showBgOverlayElements){
				showBgOverlayElements.addEventListener("click", function (e) {
					let tpgbCircleMenu = e.currentTarget.closest(".tpgb-circle-menu"),
						mainMenuIcon = tpgbCircleMenu.querySelector(".main_menu_icon");
					if (mainMenuIcon) {
						var clickEvent = new Event("click");
						mainMenuIcon.dispatchEvent(clickEvent);
					}
				});
			}
        });
    }
}