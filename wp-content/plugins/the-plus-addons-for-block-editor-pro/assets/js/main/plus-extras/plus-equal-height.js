/* Equal Height Start */
document.addEventListener("DOMContentLoaded", (e) => {    
    tpeqHeight(document)
})

function tpeqHeight(doc){
    let equalHeightClass = doc.querySelectorAll('.tpgb-equal-height');
    if(equalHeightClass){
        equalHeightClass.forEach( el => {
            equalHeightFun(el)         
        });
    }

}

function equalHeightFun(el){
    let eHDiv = el.getAttribute('data-tpgb-equal-height'),
        getMlClass = eHDiv.split(',');

    getMlClass.forEach(gm =>{
        if(gm && gm.startsWith(".")){
            let gmc = el.querySelectorAll(gm);
            var highest = null;
            var hi = 0;
            if(gmc){
                gmc.forEach( ell => {
                    var h = ell.offsetHeight;
                    if(h > hi){
                        hi = h;
                        highest = ell.offsetHeight;  
                    }
                });
    
                if(highest){
                    gmc.forEach( ell => {
                        ell.style.height = highest+"px";
                    });
                }
            }
        }
    })
}
/* Equal Height End */