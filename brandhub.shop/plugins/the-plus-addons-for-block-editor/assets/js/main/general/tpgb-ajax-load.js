document.addEventListener("DOMContentLoaded", function() {

    var ajaxClick = document.querySelectorAll('.tpgb-load-template-click');
    if(ajaxClick.length){
        ajaxClick.forEach(function(ele) {
            ele.addEventListener("click", function(e) {
                e.preventDefault()
                tpgbeventCall(e)
            })
        });
    }

    var ajaxHover = document.querySelectorAll('.tpgb-load-template-hover');
    if(ajaxHover.length){
        ajaxHover.forEach(function(ele) {
            ele.addEventListener("mouseenter", function(e) {
                e.preventDefault();
                tpgbeventCall(e)
            })
        });
    }

    const tpgbonView = document.getElementsByClassName("tpgb-load-template-view");
    let tpgbserver = new IntersectionObserver(e => {
        e.forEach(e => {
            if( e.isIntersecting ){
                tpgbeventCall(e)
            }
        })
    });
    for (let tpserve of tpgbonView) tpgbserver.observe(tpserve);
});

// Lazy Render Script
! function(e) {
    "function" == typeof define && define.amd ? define(e) : e()
}(function() {
    ! function() {
        const tpgbonView = document.getElementsByClassName("tpgb-lazy-render");
        let tpgbserver = new IntersectionObserver(e => {
            e.forEach(e => {
                if( e.isIntersecting ){
                    var n = e.target.querySelector("noscript"),
                        blockID = e.target.getAttribute('data-bid');
                    if (n) {
                        var r, o = (new DOMParser).parseFromString(n.textContent, "text/html");
                        (r = e.target).replaceWith.apply(r, o.body.childNodes)
                        
                        var lcnt = '';
                        if( document.querySelector('.tpgb-wrap-'+blockID) != null ){
                            lcnt = document.querySelector('.tpgb-wrap-'+blockID)
                        }else{
                            lcnt = document.querySelector('.tpgb-block-'+blockID)
                        }

                        if(lcnt){
                            tpgb_trigger_hook(lcnt)
                        }
                        
                       
                    }
                    tpgbserver.unobserve(e.target)
                }
            })
        }, {
            root: null,
            rootMargin: "200px 0px"
        });
        for (let tpserve of tpgbonView) tpgbserver.observe(tpserve);
    }()
});



function tpgbeventCall(e){
    let listcls = (e.currentTarget) ? e.currentTarget.getAttribute('class') :  e.target.getAttribute('class') ,
    regex = /tpgb-load-(\d+)/,
    match = regex.exec(listcls);

    if (match &&  match[1]) {
        let id = match[1];
        cntselec = document.querySelector('.tpgb-load-'+id+'-content');
        if(cntselec ){
            if(!cntselec.classList.contains("tpgbtemloaded")){
                tpgb_pattern_ajax( cntselec , id)
            }
        }
    }
}

function tpgb_pattern_ajax(selector = '' , postId){
    selector.classList.add('tpgbonAjax');
    var request = new XMLHttpRequest();

    request.open('POST', tpgb_config.ajax_url, true);
    request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;');
    request.onload = function () {
        if (request.status >= 200 && request.status < 400) {
            
            var response = JSON.parse(request.response);
            if(response.success == true){
                cntselec = document.querySelectorAll('.tpgb-load-'+postId+'-content');
                if(cntselec.length ){
                    cntselec.forEach(function(cnt) {
                        if(!cnt.classList.contains("tpgbtemloaded")){
                            cnt.innerHTML = response.data
                            cnt.classList.add('tpgbtemloaded');
                            if( cnt.classList.contains('tpgbonAjax')){
                                cnt.classList.remove('tpgbonAjax');
                            }
                            tpgb_trigger_hook(cnt)
                        }
                    })
                }else{
                    selector.innerHTML = response.data
                    selector.classList.add('tpgbtemloaded');
                    selector.classList.remove('tpgbonAjax');
                    
                    tpgb_trigger_hook(selector)
                }
                    
                
            }
        }
    };
    request.send('action=tpgb_get_template_content&tpgb_nonce=' + tpgb_config.tpgb_nonce+'&postid='+postId+'');
}

function tpgb_trigger_hook(ele){

    if( typeof onTpgbJsLoad == 'function' ){
        onTpgbJsLoad()
    }

    if(typeof accordionJS == 'function'){
        accordionJS(ele);
    }
    if(typeof advanceTypo == 'function'){
        advanceTypo(ele);
    }
    if(typeof tpadvBtn == 'function'){
        tpadvBtn(ele);
    }
    if(typeof tpdownBtn == 'function'){
        tpdownBtn(ele);
    }
    if(typeof tpadvChart == 'function'){
        tpadvChart(ele);
    }
    if(typeof tpaniBox == 'function'){
        tpaniBox(ele)
    }
    if(typeof tpaudioPlayer == 'function'){
        tpaudioPly(ele)
    }
    if(typeof tpbeAfimg == 'function'){
        setTimeout(() => {
            tpbeAfimg(ele)
        }, 100);
    }
    if(typeof tpcaroRemote == 'function'){
        tpcaroRemote(ele)
    }
    if(typeof tpcircleMenu == 'function'){
        tpcircleMenu(ele)
    }
    if(typeof tpcountDown == 'function'){
        tpcountDown(ele)
    }
    if(typeof tpstiCol == 'function'){
        tpstiCol(ele)
    }
    if(typeof tpcopCode == 'function'){
        tpcopCode(ele)
    }
    if(typeof tpadvImg == 'function'){
        tpadvImg(ele)
    }
    if(typeof tpgbctaTilt == 'function'){
        tpgbctaTilt(ele)
    }
    if(typeof tpdyDevices == 'function'){
        tpdyDevices(ele)
    }
    if(typeof tpExpand == 'function'){
        tpExpand(ele)
    }
    if(typeof tpgbInitMap == 'function'){
        tpgbInitMap(ele)
    }
    if(typeof tpheAnim == 'function'){
        tpheAnim(ele)
    }
    if(typeof tphospInit == 'function'){
        tphospInit(ele)
    }
    if(typeof tplogin == 'function'){
        tplogin(ele)
    }
    if(typeof tpmailchmp == 'function'){
        tpmailchmp(ele)
    }
    if(typeof tpmediaInit == 'function'){
        tpmediaInit(ele)
    }
    if(typeof tpmouserCur == 'function'){
        tpmouserCur(ele)
    } 
    if(typeof tpNav == 'function'){
        tpNav(ele)
    } 
    if(typeof tpnavmResize == 'function'){
        tpnavmResize(ele)
    } 
    if(typeof tpnavScro == 'function'){
        tpnavScro(ele)
    } 
    if(typeof tpnavAcc == 'function'){
        tpnavAcc(ele)
    } 
    if(typeof tpeqHeight == 'function'){
        tpeqHeight(ele)
    }
    if(typeof tpglTip == 'function'){
        tpglTip(ele)
    }
    if(typeof tpmoPrlx == 'function'){
        tpmoPrlx(ele)
    }
    if(typeof tpevTrack == 'function'){
        tpevTrack(ele)
    }
    if(typeof tpgloTilt == 'function'){
        tpgloTilt(ele)
    }
    if(typeof tppopup == 'function'){
        tppopup(ele)
    }

    // Post Listing Style 1 Hover
    if(typeof tppostList == 'function'){
        tppostList(ele)
    }
    if(typeof tpFilter == 'function'){
        tpFilter(ele)
    }
    if(typeof tppoLay == 'function'){
        tppoLay(ele)
    }
    if(typeof tppoMaso == 'function'){
        tppoMaso(ele)
    }
    if(typeof tppoMetro == 'function'){
        tppoMetro(ele)
    }
    if(typeof tppocaro == 'function'){
        tppocaro(ele)
    }
    if(typeof tppoLoad == 'function'){
        tppoLoad(ele)
    }
    if(typeof tppriceTable == 'function'){
        tppriceTable(ele)
    }
    if(typeof tpproStep == 'function'){
        tpproStep(ele)
    }
    if(typeof tpscrollNav == 'function'){
        tpscrollNav(ele)
    }
    if(typeof tpscrollSeq == 'function'){
        tpscrollSeq(ele)
    }
    if(typeof tpsocialFeed == 'function'){
        tpsocialFeed(ele)
    }
    if(typeof tpsocialReview == 'function'){
        tpsocialReview(ele)
    }
    if(typeof tpsocialShare == 'function'){
        tpsocialShare(ele)
    }
    if(typeof tpstlishList == 'function'){
        tpstlishList(ele)
    }
    if(typeof tpswitcherInit == 'function'){
        tpswitcherInit(ele)
    }
    if(typeof tptablecntInit == 'function'){
        tptablecntInit(ele)
    }
    if(typeof tprowretch == 'function'){
        tprowretch(ele)
    }
    if(typeof tpnorSticky == 'function'){
        tpnorSticky()
    }
    if(typeof tponlyStricky == 'function'){
        tponlyStricky()
    }

    // Free Block Function Call

    if(typeof drawsvgInit == 'function'){
        drawsvgInit(ele)
    }
    if(typeof tpcoForm == 'function'){
        tpcoForm(ele)
    }
    if(typeof tpeverestform == 'function'){
        tpeverestform(ele)
    }
    if(typeof tpgravityForm == 'function'){
        tpgravityForm(ele)
    }
    if(typeof darkmodeInit == 'function'){
        darkmodeInit(ele)
    }
    if(typeof tpdataTable == 'function'){
        tpdataTable(ele)
    }
    if(typeof tpgbwpForm == 'function'){
        tpgbwpForm(ele)
    }
    if(typeof tpheading == 'function'){
        tpheading(ele)
    }
    if(typeof tpinCircle == 'function'){
        tpinCircle(ele)
    }
    if(typeof tpmsgBox == 'function'){
        tpmsgBox(ele)
    }
    if(typeof tpproBar == 'function'){
        tpproBar(ele)
    }
    if(typeof tpproTrack == 'function'){
        tpproTrack(ele)
    }
    if(typeof tpsmScroll == 'function'){
        tpsmScroll(ele)
    }
    if(typeof tpsoIcon == 'function'){
        tpsoIcon(ele)
    }
    if(typeof tabtoursInit == 'function'){
        tabtoursInit(ele)
    }
    if(typeof testimonialInit == 'function'){
        testimonialInit(ele)
    }
    if(typeof postimageInit == 'function'){
        postimageInit(ele)
    }
    if(typeof rowInit == 'function'){
        rowInit(ele)
    }
    if(typeof tpvideoInit == 'function'){
        tpvideoInit(ele)
    }
    if(typeof searchbarInit == 'function'){
        searchbarInit(ele)
    }
    if(typeof tpcodeInit == 'function'){
        tpcodeInit(ele)

        if(typeof Prism.highlightAll == 'function'){
            Prism.highlightAll()
        }
    }
    if(typeof tpgbextraInit == 'function'){
        tpgbextraInit(ele)
    }
    if(typeof tpgbpichart == 'function'){
        tpgbpichart(ele)
    }
    if(typeof tplottieAnim == 'function'){
        tplottieAnim(ele)
    }
    if(typeof tpgnbtnPopup == 'function'){
        tpgnbtnPopup(ele)
    }
    if(typeof tpgbmobileMenu == 'function'){
        tpgbmobileMenu(ele)
    }

    // Row Background Function
    if(typeof tpgbrowimgMove == 'function'){
        tpgbrowimgMove(ele)
    }
    if(typeof tpgbvideoComm == 'function'){
        tpgbvideoComm(ele)
    }
    if(typeof tpgbyouVideo == 'function'){
        tpgbyouVideo(ele)
    }
    if(typeof tpgbselfVideo == 'function'){
        tpgbselfVideo(ele)
    }
    if(typeof tpgbcanvasBg == 'function'){
        tpgbcanvasBg(ele)
    }
    if(typeof tpgbcanvasParti == 'function'){
        tpgbcanvasParti(ele)
    }
    if(typeof tpgbimageParellax == 'function'){
        tpgbimageParellax(ele)
    }
    if(typeof tpgbmodenParellex == 'function'){
        tpgbmodenParellex(ele)
    }
    if(typeof tpgbrowaniBg == 'function'){
        tpgbrowaniBg(ele)
    }
    if(typeof tpgbscrollParallex == 'function'){
        tpgbscrollParallex(ele)
    }
    if(typeof tpgbimgSlide == 'function'){
        tpgbimgSlide(ele)
    }
    if(typeof tpgbbgScroll == 'function'){
        tpgbbgScroll(ele)
    }

    if(typeof numscrollerfun == 'function'){
        numscrollerfun()
    }
}