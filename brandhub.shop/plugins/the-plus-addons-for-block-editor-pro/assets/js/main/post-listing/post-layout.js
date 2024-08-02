document.addEventListener('DOMContentLoaded', (event) => {
    tppoLay(document)
});

function tppoLay(doc){
    var isoDiv = doc.querySelectorAll('.tpgb-isotope,.tpgb-metro');
    if(isoDiv){
        isoDiv.forEach((el)=>{
            let roDiv = el.querySelector('.post-loop-inner'),
            griDiv = el.querySelector('.post-loop-inner > .grid-item'),
            gidsty = (griDiv) ? griDiv.currentStyle || window.getComputedStyle(griDiv) : null;
            if(gidsty){
                if(gidsty.paddingLeft){
                    roDiv.style.marginLeft = '-'+ gidsty.paddingLeft;
                }
                
                if(gidsty.paddingLeft){
                    roDiv.style.marginRight = '-'+ gidsty.paddingRight;
                }
            }
        })
    }
}