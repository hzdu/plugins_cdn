document.addEventListener('DOMContentLoaded', (event) => {
    tpinCircle(document);
  });
  
  function  tpinCircle(doc){
  
    let intCircle = doc.querySelectorAll('.tpgb-ia-circle-info');
    if(intCircle){
        intCircle.forEach( el => {
            let mTrigger = el.getAttribute('data-trigger');
            let allRep = el.querySelectorAll('.tpgb-ia-circle-item');
            allRep.forEach(e=>{
                let tglBtn = e.querySelector('.tpgb-circle-icon-wrap');
  
                if(mTrigger && mTrigger=='hover'){
                    tglBtn.addEventListener("mouseenter",function(ev){
                        inActToggleFun(ev.currentTarget);
                    })
                }
                if(mTrigger && mTrigger=='click'){
                    tglBtn.addEventListener("click",function(ev){
                        inActToggleFun(ev.currentTarget);
                    })
                }
            });
  
            if(mTrigger && mTrigger=='auto'){
                let autoTime  = Number(el.getAttribute('data-auto-time'));
                setInterval(function() {
                    var active = el.querySelector('.tpgb-ia-circle-item.active');
                    if(active){
                        active.classList.remove('active'); 
                        if(!active.nextSibling){
                            let closeInn = active.closest('.ia-circle-inner'),
                            firstItem = closeInn.firstElementChild;
                            if(firstItem){
                                firstItem.classList.add('active');
                            }
                        }else{
                            active.nextSibling.classList.add('active');
                        }
                    }
                }, autoTime);
            }
  
        });
    }
  }
  
  function inActToggleFun(tglBtn) {
    let closeRep = tglBtn.closest('.tpgb-ia-circle-item');
    if(!closeRep.classList.contains('active')){
        let mainWrap = tglBtn.closest('.ia-circle-inner');
        let allRep = mainWrap.querySelectorAll('.tpgb-ia-circle-item');
        allRep.forEach(e=>{
            if(e.classList.contains('active')){
                e.classList.remove('active');
            }
        });
        closeRep.classList.add('active');
    }
  }
  /* Interactive Circle Info End */