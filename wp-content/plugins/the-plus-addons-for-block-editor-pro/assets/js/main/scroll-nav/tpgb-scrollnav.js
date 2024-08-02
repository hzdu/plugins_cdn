/**
 * Scroll Navigation
*/
document.addEventListener('DOMContentLoaded', () => {
    tpscrollNav(document)
});

function tpscrollNav(doc){
    let allScrolNav = document.querySelectorAll('.tpgb-scroll-nav');
    if(allScrolNav){
        allScrolNav.forEach((sn)=>{
            let navItems = sn.querySelectorAll('.tpgb-scroll-nav-item');
            if(navItems){
                navItems.forEach((ni)=>{
                    ni.addEventListener('click',(e)=> {
                        e.preventDefault();
                        if(!e.currentTarget.classList.contains('active')){
                            let getSecId = e.currentTarget.href,
                                getHash = getSecId.split('#')[1];
                            clickchangesection(getHash);
                            let closeMain = e.currentTarget.closest('.tpgb-scroll-nav');
                            let actNavItm = closeMain.querySelector('.tpgb-scroll-nav-item.active');
                            if(actNavItm){
                                actNavItm.classList.remove('active');
                                e.currentTarget.classList.add('active');
                            }
                        }
                    });
                });
                let winScroll = document.body.scrollTop || document.documentElement.scrollTop;
                scrollchangesection(navItems, winScroll)

                window.addEventListener('scroll', ()=>{ 
                    winScroll = document.body.scrollTop || document.documentElement.scrollTop;
                    scrollchangesection(navItems, winScroll);
                });
            }

            if(sn.classList.contains('scroll-view')){
                var container_scroll_view = sn.querySelector('.tpgb-scroll-nav-inner');
                if(container_scroll_view){
                    window.addEventListener('scroll', function() {
                        const scrollVal = window.scrollY || document.documentElement.scrollTop;
                        let scroll_view_value = sn.getAttribute('data-scroll-view');
                        
                        if (scroll_view_value && scrollVal > scroll_view_value) {
                            sn.classList.add('show');
                        } else {
                            sn.classList.remove('show');
                        }
                    });
                }
            }
        });
    }
}

function clickchangesection(id){
    let section = document.getElementById(id);
    if(section){
        let getOffset = section.offsetTop;
        window.scroll({
            top: getOffset,
            behavior: 'smooth'
        }); 
    }
}

function scrollchangesection(navItems, scroll){
    navItems.forEach((nav)=>{
        let getSecId = nav.href,
            getHash = getSecId.split('#')[1];
        if(getHash){
            let getSec = document.getElementById(getHash);
            if(getSec){
                let getcScroll = getSec.offsetTop,
                    wHeight = window.innerHeight/2,
                    totalHeight = getSec.offsetHeight+getcScroll;
                if(scroll >= getcScroll - wHeight &&  totalHeight > scroll){
                    navItems.forEach((item) => {if(item.classList.contains('active')){item.classList.remove('active')}});
                    nav.classList.add('active');
                }else{
                    nav.classList.remove('active');
                }
            }
        }
    });
}