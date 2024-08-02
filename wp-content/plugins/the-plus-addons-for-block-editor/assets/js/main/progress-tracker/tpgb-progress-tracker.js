document.addEventListener('DOMContentLoaded',()=>{
    tpproTrack(document);
});

function tpproTrack(doc){
    let allPT = doc.querySelectorAll('.tpgb-progress-tracker');
    allPT.forEach((pt)=>{
    let getDataA = pt.getAttribute('data-attr');
    if(pt.classList.contains('container-pinpoint-yes')){
        let getPin = pt.querySelectorAll('.tracker-pin');

        let getType = '';
        if(pt.classList.contains('type-vertical')){
            getType = 'vertical';
        }else if(pt.classList.contains('type-horizontal')){
            getType = 'horizontal';
        }

        getPin.forEach((pp)=>{
            let getConID = pp.getAttribute('data-id');
            let offsetGet = Number(ptpinpoint(getConID, pp, getType) + 1);

            pp.addEventListener('click', ()=>{
                window.scroll({
                    top: offsetGet,
                    behavior: 'smooth'
                });
            })
        });
    }
    getDataA =  JSON.parse(getDataA);
    let ptfill = pt.querySelector('.progress-track-fill'),
        ptPtext = pt.querySelector('.progress-track-percentage');

    let winScroll = '',height = '',  scrolled = '', ptSelVal = {};
    if(getDataA.apply_to=='entire'){
        winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        height = document.body.scrollHeight - window.innerHeight;
        scrolled = (winScroll / height) * 100;
        progresstracker(pt, ptfill, ptPtext, winScroll, height);

        if(pt.classList.contains('container-pinpoint-yes')){
            checkpinonscroll(pt, winScroll);
        }
        window.addEventListener('scroll', ()=>{ 
            winScroll = document.body.scrollTop || document.documentElement.scrollTop;
            progresstracker(pt, ptfill, ptPtext, winScroll, height) 
            if(pt.classList.contains('container-pinpoint-yes')){
                checkpinonscroll(pt, winScroll);
            }
        });
    }else if(getDataA.apply_to=='selector' && getDataA.selector){
        winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        let getSelector = document.querySelector(getDataA.selector);
        if(getSelector){
            ptSelVal.start = getSelector.offsetTop;
            ptSelVal.end = ptSelVal.start + getSelector.clientHeight - window.innerHeight;
            ptSelVal.between = getSelector.clientHeight - window.innerHeight;
            let xScroll = Number(winScroll - ptSelVal.start);
            height = ptSelVal.between;
            if(winScroll >= ptSelVal.start && ptSelVal.end >= winScroll){
                progresstracker(pt, ptfill, ptPtext, xScroll, height);
            }else if(winScroll <  ptSelVal.start){
                progresstracker(pt, ptfill, ptPtext, xScroll = 0, height);
            }else if(ptSelVal.end < winScroll){
                setTimeout(()=>{
                    progresstracker(pt, ptfill, ptPtext, height, height);
                }, 500);
            }
            window.addEventListener('scroll', ()=>{ 
                winScroll = document.body.scrollTop || document.documentElement.scrollTop;
                let xScroll = Number(winScroll - ptSelVal.start);
                if(winScroll >= ptSelVal.start && ptSelVal.end >= winScroll){
                    progresstracker(pt, ptfill, ptPtext, xScroll, height);
                }else if(winScroll <  ptSelVal.start){
                    progresstracker(pt, ptfill, ptPtext, xScroll = 0, height);
                }else if(ptSelVal.end < winScroll){
                    progresstracker(pt, ptfill, ptPtext, height, height);
                }
            })  
        }
    }
    })
}

function progresstracker(pt, ptfill, ptPtext, winScroll, height){
    let scrolled = (winScroll / height) * 100;
    scrolled = (scrolled > 100) ? 100: scrolled;
    if(pt.classList.contains('type-horizontal')){
       ptfill.style.width = scrolled + "%";
       if(ptPtext){
           ptPtext.textContent = Math.round(scrolled)+"%";
       }
    }else if(pt.classList.contains('type-vertical')){
       ptfill.style.height = scrolled + "%";
       if(ptPtext){
           ptPtext.textContent = Math.round(scrolled)+"%";
       }
    }else if(pt.classList.contains('type-circular')){
       let circle2 =  pt.querySelector('.tpgb-pt-circle-st2'),
           totalLength = circle2.getTotalLength();
    
       circle2.style.strokeDasharray = totalLength;
       circle2.style.strokeDashoffset = totalLength;
    
       let percentage = winScroll / height;
       percentage = percentage.toFixed(2);
       circle2.style.strokeDashoffset = totalLength - totalLength * percentage;
       if(ptPtext){
           ptPtext.textContent = Math.round(scrolled)+"%";
       }
    }
    }
    
function ptpinpoint(id, pp, type){
    let nheight = document.body.scrollHeight - window.innerHeight,
    getPinC = document.querySelector('#'+id),
    newwinScroll = getPinC.offsetTop,
    scrollPercentage = (newwinScroll / nheight ) * 100;
    if(type == 'vertical'){
    pp.style.top = scrollPercentage+'%';
    }else if(type == 'horizontal'){
    pp.style.left = scrollPercentage+'%';
    }
    return newwinScroll;
}
    
function checkpinonscroll(pt, scroll){
    let getPinN = pt.querySelectorAll('.tracker-pin');
    getPinN.forEach((ppn)=>{
        let getConIDN = ppn.getAttribute('data-id');
        let getCid = document.querySelector('#'+getConIDN);
        if(getCid){
            let getcScroll = getCid.offsetTop;
        
            if(scroll >= getcScroll){
                ppn.classList.add('active');
            }else{
                ppn.classList.remove('active');
            }
        }
    });
}