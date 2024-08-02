/*Switcher*/
document.addEventListener("DOMContentLoaded", function() {
    tpswitcherInit(document)
});

function tpswitcherInit(doc){
    let switchAll = doc.querySelectorAll('.tpgb-switch-wrap');

    if(switchAll){
        switchAll.forEach((sw)=>{
            let switch_toggle = sw.querySelector('.switch-toggle'),
                switch_1_toggle = sw.querySelector('.switch-1'),
                switch_2_toggle = sw.querySelector('.switch-2'),
                sc1 = sw.querySelector(".switch-content-1"),
                sc2 = sw.querySelector(".switch-content-2"),
                sTgl = sw.querySelector(".switch-toggle-wrap"),
                inpSwi = sw.querySelector(".switch-toggle"),
                swBlockId = sw.getAttribute('data-id');

            let gtCclass = localStorage.getItem(swBlockId);
            if(gtCclass && gtCclass == 'switch-2'){
                sc1.style.display = 'none';
                sc2.style.display = 'block';
                
                if(inpSwi){ inpSwi.checked = true;  }
                if(sTgl.classList.contains('inactive')){
                    sTgl.classList.remove('inactive');
                    sTgl.classList.add('active');
                }
                switcerSlider(sw)
            }
            
            
            if(switch_toggle !== null){
                switch_toggle.addEventListener('click',function(e) {
                    let sc1Display = window.getComputedStyle(sc1).display,
                        sc2Display = window.getComputedStyle(sc2).display;
            
                    if(sc1Display == 'block'){
                        sc1.style.display = 'none';
                    }else{
                        sc1.style.display = 'block';
                    }
            
                    if(sc2Display == 'block'){
                        sc2.style.display = 'none';
                    }else{
                        if(switch_2_toggle.classList.contains('tpgb-load-template-click')){
                            switch_2_toggle.dispatchEvent(new Event('click'));
                        }
                        sc2.style.display = 'block';
                    }
            
            
                    if(sTgl.classList.contains('active')){
                        sTgl.classList.remove('active');
                        sTgl.classList.add('inactive');
                    }else{
                        sTgl.classList.add('active');
                        sTgl.classList.remove('inactive');
                    }
            
                    switcerSlider(sw)
                });
            }

            
            if(switch_1_toggle !== null){
                switch_1_toggle.addEventListener('click', ()=>{
                    sc1.style.display = 'block';
                    sc2.style.display = 'none';

                    if(localStorage.getItem(swBlockId)){
                        localStorage.removeItem(swBlockId);
                    }
            
                    if(inpSwi){ inpSwi.checked = false;  }
                    if(sTgl.classList.contains('active')){
                        sTgl.classList.remove('active');
                        sTgl.classList.add('inactive');
                    }
            
                    switcerSlider(sw)
                });
            }

            if(switch_2_toggle !== null){
                switch_2_toggle.addEventListener('click', (e)=>{
                    sc1.style.display = 'none';
                    sc2.style.display = 'block';
                    
                    let gtClass = e.currentTarget.className;
                    localStorage.setItem(swBlockId, gtClass);

                    if(inpSwi){ inpSwi.checked = true;  }
                    if(sTgl.classList.contains('inactive')){
                        sTgl.classList.remove('inactive');
                        sTgl.classList.add('active');
                    }
            
                    switcerSlider(sw)
                });
            }

        })
        
    }
}

function switcerSlider(el){
    let swTgCnt = el.querySelector('.switch-toggle-content'),
        cnt1 = swTgCnt.querySelector('.switch-content-1'),
        cnt2 = swTgCnt.querySelector('.switch-content-2');

    let equalHeightCheck = cnt2.querySelector('.tpgb-equal-height');
    if(equalHeightCheck && typeof equalHeightFun === 'function'){
        let eqLoaded = false;
        if(!eqLoaded){
            equalHeightFun(equalHeightCheck)
            eqLoaded == true;
        }
    }

    if(swTgCnt.querySelector(".tpgb-carousel")){
        let scope = swTgCnt.querySelectorAll('.tpgb-carousel');
        scope.forEach(function(obj){
            var splideInit = slideStore.get(obj);
            splideInit.refresh();
        });
    }
    if(cnt1.querySelector(".tpgb-metro")){
        tppoMetro(cnt1);
    }
    if(cnt2.querySelector(".tpgb-metro")){
        tppoMetro(cnt2);
    }

    if (cnt1 !== null && cnt1.querySelectorAll(".tpgb-isotope .post-loop-inner").length > 0) {
        let postList1 = cnt1.querySelectorAll(".tpgb-isotope .post-loop-inner");
        tppoMaso(postList1);
    }
    
    if (cnt2 !== null && cnt2.querySelectorAll(".tpgb-isotope .post-loop-inner").length > 0) {
        let postList2 = cnt2.querySelectorAll(".tpgb-isotope .post-loop-inner");
        tppoMaso(postList2);
    }

}