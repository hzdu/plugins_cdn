document.addEventListener('DOMContentLoaded', () => {
    tpgbmobileMenu(document)
});


function tpgbmobileMenu(doc){
    let mobileMenu = doc.querySelectorAll('.tpgb-mobile-menu');
	mobileMenu.forEach((self,idx) => {
		let mmOpt = self.getAttribute('data-mm-option');
		mmOpt = JSON.parse(mmOpt);
		let screenWidth = screen.width,
			mmWrapper = doc.querySelector('.tpgb-mm-wrapper.swiper-container'),
			mmlWrapper = doc.querySelector('.tpgb-mm-l-wrapper.swiper-container'),
		 	mmrWrapper = doc.querySelector('.tpgb-mm-r-wrapper.swiper-container');
		if(mmWrapper || mmlWrapper || mmrWrapper){
			new Swiper(".tpgb-mm-wrapper.swiper-container,.tpgb-mm-l-wrapper.swiper-container,.tpgb-mm-r-wrapper.swiper-container",{
				slidesPerView: "auto",
				mousewheelControl: !0,
				freeMode: !0
			});
		}
		let mmTpeton = doc.querySelector('.tpgb-mobile-menu.tpet-on'),
			mmCiauto = self.querySelector('.tpgb-mobile-menu .extra-toggle-close-menu.mm-ci-auto'),
			mmLink = self.querySelector('.tpgb-mm-et-link');
		if(mmLink) {
			mmLink.addEventListener('click', (event) => {
				if(mmTpeton) {
					mmLink.closest(".tpgb-mobile-menu").querySelector('.header-extra-toggle-content').classList.add('open');
					mmLink.closest(".tpgb-mobile-menu").querySelector('.extra-toggle-content-overlay').classList.add('open');
				}
				if(mmCiauto) {
					mmLink.closest(".tpgb-loop-inner").querySelector('.tpgb-mm-et-link').classList.add('tpgb-mm-ca');
					mmLink.closest(".tpgb-loop-inner").querySelector('.extra-toggle-close-menu-auto').classList.add('tpgb-mm-ca');
				}
			});
		}
		let closeMenu = self.querySelector('.extra-toggle-close-menu');
		if(closeMenu) {
			closeMenu.addEventListener('click', (event) => {
				if(mmTpeton) {
					mmLink.closest(".tpgb-mobile-menu").querySelector('.header-extra-toggle-content').classList.remove('open');
					mmLink.closest(".tpgb-mobile-menu").querySelector('.extra-toggle-content-overlay').classList.remove('open');
				}
			});
		}
		let closeMenuauto = self.querySelector('.extra-toggle-close-menu-auto');
		if(closeMenuauto) {
			closeMenuauto.addEventListener('click', (event) => {
				if(mmCiauto) {
					mmlink.closest(".tpgb-mobile-menu").querySelector('.header-extra-toggle-content').classList.remove('open');
					mmlink.closest(".tpgb-mobile-menu").querySelector('.extra-toggle-content-overlay').classList.remove('open');
					mmlink.closest(".tpgb-mobile-menu").querySelector('.tpgb-loop-inner .tpgb-mm-et-link').classList.remove("tpgb-mm-ca");
					mmlink.closest(".tpgb-mobile-menu").querySelector('.tpgb-loop-inner .extra-toggle-close-menu-auto').classList.remove('tpgb-mm-ca');
				}
			});
		}
		let contentOverlay = self.querySelector('.extra-toggle-content-overlay');
		if(contentOverlay) {
			contentOverlay.addEventListener('click', (event) => {
				if(mmTpeton) {
					mmLink.closest(".tpgb-mobile-menu").querySelector('.header-extra-toggle-content').classList.remove("open");
					mmLink.closest(".tpgb-mobile-menu").querySelector('.extra-toggle-content-overlay').classList.remove("open");
				}
				if(mmCiauto) {
					mmLink.closest(".tpgb-loop-inner").querySelector( ".extra-toggle-close-menu-auto.tpgb-mm-ca").trigger( "click" );
				}
			});
		}
		let container_scroll_view = self.classList.contains('scroll-view');
		if(self && container_scroll_view) {
			if ((screenWidth >= 1201 && mmOpt.DeskTopHide!==true) || (screenWidth <= 1200 && screenWidth >= 768 && mmOpt.TabletHide!==true) || (screenWidth <= 767 && mmOpt.MobileHide!==true) ) {
				let uid = mmOpt.uid;
				let scroll_top = doc.querySelector("."+uid );
					window.addEventListener('scroll', (event) => {
						var scroll = window.scrollY;
						if(scroll > mmOpt.ScrollVal) {
							scroll_top.classList.add('show');
						} else {
							scroll_top.classList.remove('show');
						}
					 });
			}
		}
		let menuLink = self.querySelectorAll('.tpgb-menu-link');
		menuLink.forEach((selfLink,idx) => {
			let pathname = location.pathname;
			pathname = pathname.substr(pathname.indexOf('/') + 1);
			if(selfLink.getAttribute('href') == window.location.href.replace(/\/d/, '')) {
				selfLink.closest(".tpgb-mm-li").classList.add('active');
			} else if(pathname && selfLink.getAttribute('href') && selfLink.getAttribute('href').indexOf(pathname) > -1) {
				selfLink.closest(".tpgb-mm-li").classList.add('active');
			}
		});
  	});
}
