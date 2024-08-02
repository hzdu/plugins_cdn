tponlyStricky()
function tponlyStricky(){
    var onlyStricyDiv = document.querySelectorAll('.tpgb-sticky-only');

    if(onlyStricyDiv && onlyStricyDiv != undefined){
        onlyStricyDiv.forEach((sel)=>{
            var initOff = sel.previousElementSibling.getBoundingClientRect().top + window.scrollY;
            window.addEventListener('scroll', () => {
                tpgbheadersticky(sel , initOff)
            });
            document.addEventListener('DOMContentLoaded', ()=> {
                tpgbheadersticky(sel, initOff)
            })
        })
    }
}


let lastScroll = 0;

// Only Sticky
var tpgbheadersticky = function(el,initOff){
    var adminbarOfset = document.querySelector('#wpadminbar'), barOfset = 0;
    if(adminbarOfset){
        barOfset = 32;
    }
    var resData = JSON.parse(el.dataset.stickyOpt),
        scrollTop =  initOff,
        desCheck = false,
        mobCheck = false,
        tabcheck = false;

        const scrupTop = window.screenY || document.documentElement.scrollTop;

        if(resData.scupSticky){

            if( resData && resData.md && window.innerWidth > 1024 ){
                if (scrupTop > lastScroll || scrupTop == 0) {
                    desCheck = false;
                } else {
                    desCheck = true;
                }
            }

            if( resData && resData.sm && window.innerWidth >= 768 && window.innerWidth <= 1024 ){
                if ( scrupTop > lastScroll || lastScroll == 0 ) {
                    tabcheck = false;
                } else {
                    tabcheck = true;
                }
            }

            if(resData && resData.xs && window.innerWidth < 768){
                if ( scrupTop > lastScroll || lastScroll == 0 ) {
                    mobCheck = false;
                } else {
                    mobCheck = true;
                }
            }

            lastScroll = scrupTop;
        }else{
            desCheck = resData && resData.md && window.innerWidth > 1024 && window.scrollY > scrollTop + ( resData.topoff && resData.topoff.md ? (Number(resData.topoff.md) - barOfset) : (-barOfset)  )

            tabcheck = resData && resData.sm && window.innerWidth <= 1024 && window.innerWidth >= 768 && window.scrollY > scrollTop + ( resData.topoff && resData.topoff.sm ? (Number(resData.topoff.sm) - barOfset) : (-barOfset)  )

            mobCheck = resData && resData.xs && window.innerWidth < 768 && window.scrollY > scrollTop + ( resData.topoff && resData.topoff.sm ? (Number(resData.topoff.sm) - barOfset) : (-barOfset)  )
        }


        if(desCheck){
            if(!el.classList.contains('tpgb-desk-sticky')){
                el.classList.add('tpgb-desk-sticky');
            }
        }else if(el.classList.contains('tpgb-desk-sticky')){
            el.classList.remove('tpgb-desk-sticky');
        }

        if(tabcheck){
            if(!el.classList.contains('tpgb-tab-sticky')){
                el.classList.add('tpgb-tab-sticky');
            }
        }else if(el.classList.contains('tpgb-tab-sticky')){
            el.classList.remove('tpgb-tab-sticky');
        }

        if(mobCheck){
            if(!el.classList.contains('tpgb-moblie-sticky')){
                el.classList.add('tpgb-moblie-sticky');
            }
        }else if(el.classList.contains('tpgb-moblie-sticky')){
            el.classList.remove('tpgb-moblie-sticky');
        }
}