
tpnorSticky();
function tpnorSticky(){
    var normalstricyDiv = document.querySelectorAll('.tpgb-sticky-enable');

    if(normalstricyDiv && normalstricyDiv != undefined){
        normalstricyDiv.forEach((el)=>{
            var initOffset = el.getBoundingClientRect().top + window.scrollY;
            window.addEventListener('scroll', () => {
                tpgbheadernorsticky(el, initOffset)
            });
            document.addEventListener('DOMContentLoaded', ()=> {
                tpgbheadernorsticky(el, initOffset)
            })
        })
    }
}
   

var tpheightDiv = function(exDiv,height,current,resData,heightadd){
    if(exDiv !== null){
        if(heightadd){
            exDiv.style.minHeight = height+'px';
        }else{
            exDiv.style.minHeight = 0;
        }
    }
}

let lastScrollTop = 0;

// Normal + Sticky
var tpgbheadernorsticky = function(el, initOffset){
    var adminbarOfset = document.querySelector('#wpadminbar'), barOfset = 0;
    if(adminbarOfset){
        barOfset = 32;
    }
    var animSlide = el.classList.contains('tpgb-sticky-slide')
    var animFade = el.classList.contains('tpgb-sticky-fade')
    var desCheck = false,
        mobCheck = false,
        tabcheck = false,
        resData = JSON.parse(el.dataset.stickyOpt),
        exDiv = el.previousSibling,
        headerHeight =( el ) ? el.clientHeight : 0,
        animHeight = ( el && (animSlide || animFade) ) ? el.clientHeight : 0,
        scrollTop =  initOffset;
        
        const scrupTop = window.screenY || document.documentElement.scrollTop;

        if(resData.scupSticky){

            if( resData && resData.md && window.innerWidth > 1024 ){
                if ( (scrollTop + ( Number(animHeight) - barOfset) ) > lastScrollTop || window.scrollY > lastScrollTop) {
                    desCheck = false;
                } else {
                    desCheck = true;
                }
            }

           if( resData && resData.sm && window.innerWidth >= 768 && window.innerWidth <= 1024 ){
                if ( (scrollTop + ( Number(animHeight) - barOfset) ) > lastScrollTop || window.scrollY > lastScrollTop) {
                    tabcheck = false;
                } else {
                    tabcheck = true;
                }
            }

            if(resData && resData.xs && window.innerWidth < 768){
                if ( (scrollTop + ( Number(animHeight) - barOfset) ) > lastScrollTop || window.scrollY > lastScrollTop) {
                    mobCheck = false;
                } else {
                    mobCheck = true;
                }
            }

            lastScrollTop = window.scrollY;
        }else{

            desCheck = resData && resData.md && window.innerWidth > 1024 && window.scrollY > scrollTop + ( resData.topoff && resData.topoff.md ? (Number(resData.topoff.md) + Number(animHeight) - barOfset) : (Number(animHeight) - barOfset) ),

            tabcheck = resData && resData.sm && window.innerWidth >= 768 && window.innerWidth <= 1024 && window.scrollY > scrollTop + ( resData.topoff && resData.topoff.sm ?  (Number(resData.topoff.sm) + Number(animHeight) - barOfset) : (Number(animHeight) - barOfset) ),

            mobCheck = resData && resData.xs && window.innerWidth < 768 && window.scrollY > scrollTop + ( resData.topoff && resData.topoff.xs ? (Number(resData.topoff.xs) + Number(animHeight) - barOfset) : (Number(animHeight) - barOfset) );
        }

        if(desCheck){
			if(!el.classList.contains('tpgb-desk-sticky')){
				tpheightDiv(exDiv,headerHeight, el , resData ,true)
            	el.classList.add('tpgb-desk-sticky');
                if(animSlide || animFade) {
                    el.style.animationName = ""
                }
			}
        }else{
            if(el.classList.contains('tpgb-desk-sticky')){
                tpheightDiv(exDiv,'0', el ,resData ,false)
                el.classList.remove('tpgb-desk-sticky');
                if(animSlide || animFade) {
                    el.style.animationName = "tpgb_stslideout"
                }
            }
        }

        if(tabcheck){
            if(!el.classList.contains('tpgb-tab-sticky')){
                tpheightDiv(exDiv,headerHeight, el , resData ,true)
                el.classList.add('tpgb-tab-sticky');
                if(animSlide || animFade) {
                    el.style.animationName = ""
                }
            }
        }else{
            if(el.classList.contains('tpgb-tab-sticky')){
                tpheightDiv(exDiv,'0', el , resData ,false)
                el.classList.remove('tpgb-tab-sticky');
                if(animSlide || animFade) {
                    el.style.animationName = "tpgb_stslideout"
                }
            }
        }

        if(mobCheck){
            if(!el.classList.contains('tpgb-moblie-sticky')){
                tpheightDiv(exDiv,headerHeight, el , resData ,true)
                el.classList.add('tpgb-moblie-sticky');
                if(animSlide || animFade) {
                    el.style.animationName = ""
                }
            }
        }else{
            if(el.classList.contains('tpgb-moblie-sticky')){
                tpheightDiv(exDiv,'0', el , resData ,false)
                el.classList.remove('tpgb-moblie-sticky');
                if(animSlide || animFade) {
                    el.style.animationName = "tpgb_stslideout"
                }
            }
        }
}