/**
 * Search Bar
 */
document.addEventListener("DOMContentLoaded", function () {
    searchbarInit(document)

});

function searchbarInit(){
    let searchBar = document.querySelectorAll(".tpgb-search-bar");
  
    if (searchBar) {
        searchBar.forEach(function (sb) {
            var form = sb.querySelector('.tpgb-search-form'),
                resultsinnerList = sb.querySelector('.tpgb-search-list-inner'),
                searcharea = sb.querySelector('.tpgb-search-area'),
                resultList = '.tpgb-search-slider tpgb-row',
                searchheader = sb.querySelector('.tpgb-search-header'),
                ajaxsearch = (sb.dataset.ajax_search) ? JSON.parse(sb.dataset.ajax_search) : [],
                acfData = (sb.dataset.acfdata) ? JSON.parse(sb.dataset.acfdata) : [],
                Generic = (sb.dataset.genericfilter) ? JSON.parse(sb.dataset.genericfilter) : [],
                Rsetting = (sb.dataset.resultSetting) ? JSON.parse(sb.dataset.resultSetting) : [],
                pagesetting = (sb.dataset.paginationData) ? JSON.parse(sb.dataset.paginationData) : [],
                Defsetting = (sb.dataset.defaultData) ? JSON.parse(sb.dataset.defaultData) : [];

            resultsinnerList.style.transform = 'translateX(0)';            

            let OverlayBg = sb.querySelector('.tpgb-rental-overlay');
            if( OverlayBg ){
                tp_overlay_body(sb);
            }

            let GetDropDown = sb.querySelectorAll('.tpgb-sbar-dropdown');

            if (GetDropDown.length > 0) {
                GetDropDown.forEach(function (dropdown) {
                    dropdown.addEventListener('click', function() {
                        this.setAttribute('tabindex', 1);
                        this.classList.toggle('active');
                        let ddMenu = this.querySelector('.tpgb-sbar-dropdown-menu');
                        slideToggleP(ddMenu, 300);
                    });

                    dropdown.addEventListener('focusout', function() {
                        this.classList.remove('active');
                        let ddMenu = this.querySelector('.tpgb-sbar-dropdown-menu');
                        slideUpP(ddMenu, 300);
                    });

                    var dropdownItems = dropdown.querySelectorAll('.tpgb-sbar-dropdown-menu .tpgb-searchbar-li');
                    dropdownItems.forEach(function(item) {
                        item.addEventListener('click', function() {
                            var parentDropdown = this.closest('.tpgb-sbar-dropdown');
                            parentDropdown.querySelector('span.search-selected-text').textContent = this.textContent;
                            let gettInp = parentDropdown.querySelector('input');
                            if(gettInp.getAttribute('data-extra')){
                                gettInp.value = gettInp.getAttribute('data-extra')+","+this.getAttribute('id');
                            }else{
                                gettInp.value = this.getAttribute('id');
                            }
                            var changeEvent = new Event('change', { bubbles: true });
                            parentDropdown.querySelector('input').dispatchEvent(changeEvent);
                        });
                    });
                });
            }

            if(ajaxsearch.ajax == 'yes'){
                var SpecialCTP = (Defsetting && Defsetting.SpecialCTP) ? Defsetting.SpecialCTP : 0,
                    $Searhlimit = (ajaxsearch && ajaxsearch.ajaxsearchCharLimit) ? ajaxsearch.ajaxsearchCharLimit : 0;

                let formData = new URLSearchParams(new FormData(form)).toString();

                formData = formData.split("&");

                    var formDataObject = {};

                    // Loop through each parameter and split it into key-value pair
                    formData.forEach(function(param) {
                        var keyValue = param.split("=");
                        var key = decodeURIComponent(keyValue[0]);
                        var value = decodeURIComponent(keyValue[1]);
                        formDataObject[key] = value;
                    });



                let AjaxData = {
                    // action : 'tpgb_search',
                    searchData : formData,
                    text : '',
                    postper : ajaxsearch.post_page,
                    GFilter : Generic,
                    ACFilter : acfData,
                    styleColumn : ajaxsearch.styleColumn,
                    style : ajaxsearch.style,
                    tempId : ajaxsearch.tempid,
                    ResultData : pagesetting,
                    DefaultData : Defsetting,
                    resultSetting : Rsetting,
                    nonce : ajaxsearch.nonce,
                };


                let nAjaxData = {
                    searchData : formDataObject,
                    GFilter : Generic,
                    ACFilter : acfData,
                    ResultData : pagesetting,
                    DefaultData : Defsetting,
                    resultSetting : Rsetting
                }

                /**on Load(LoadMore) */
                let lloadmore = searcharea.querySelector('.post-load-more');
                if(lloadmore){
                    tp_loadmore_ajax('', nAjaxData, pagesetting, sb, ajaxsearch)
                }

                /**on Load(Lazyload) */
                let llazyload = searcharea.querySelector('.post-lazy-load');
                if(llazyload){
                    tp_lazymore_ajax(nAjaxData, pagesetting, sb, ajaxsearch)
                }
                /**on Load(Pagination) */
                let lpagination = searcharea.querySelector('.tpgb-search-pagina');
                if(lpagination && lpagination.innerHTML!=''){
                    let pageColumn = lpagination.getAttribute('data-pageColumn');
                    pageColumn = (pageColumn) ? pageColumn : '';
                    tp_pagination_ajax(pageColumn,AjaxData, pagesetting, sb, ajaxsearch)
                }

                form.addEventListener("keypress", function(e) {
                    var code = e.keyCode || e.which;
                    if (e.key === "Enter" || code === 13) {
                      e.stopPropagation();
                      e.preventDefault();
                      return false;
                    }
                });

                var timeoutID = null;
                sb.addEventListener("change", handleInputChange);
                sb.addEventListener("keyup", handleInputChange);

                function handleInputChange(e) {
                    

                    let getCat = sb.querySelectorAll("input[name^=taxonomy_]");
                    let eventType = e.type,
                        serText = (sb.querySelector("input[name=s]")) ? sb.querySelector("input[name=s]").value : '',
                        post = (sb.querySelector("input[name=post_type]")) ? sb.querySelector("input[name=post_type]").value : '',
                        cat1 = (getCat[0]) ? getCat[0].value : '',
                        cat2 = (getCat[1]) ? getCat[1].value : '';

                    if ( (eventType === "keyup" && serText && serText.length >= $Searhlimit) || (eventType === "change" && ((post && SpecialCTP === 0) || (post && serText && serText.length >= $Searhlimit) || (post === "" && serText.length >= $Searhlimit) || (cat1 && SpecialCTP === 0) || (cat1 && serText && serText.length >= $Searhlimit) || (cat1 === "" && serText && serText.length >= $Searhlimit) || (cat2 && SpecialCTP === 0) || (cat2 && serText && serText.length >= $Searhlimit) || (cat2 === "" && serText && serText.length >= $Searhlimit) )) )  {
                        let tCloseBtn = sb.querySelector(".tpgb-close-btn"),
                            tajaxload = sb.querySelector(".tpgb-ajx-loading"),
                            serInArrow = sb.querySelector(".tpgb-dd-icon");
                            let timerLd = (eventType === "keyup") ? 1000 : 300;
                        clearTimeout(timeoutID);
                        timeoutID = setTimeout(function() {
                            if (tCloseBtn) {
                                tCloseBtn.style.display = "none";
                            }
                            if (sb.classList.contains("tpgb-ser-input-dis")) {
                                serInArrow.style.display = "none";
                            }
                            if (tajaxload) {
                                tajaxload.style.display = "flex";
                            }
                            tpgb_block_searchbar(serText);
                        }, timerLd);
                    }
                }

                function tpgb_block_searchbar(search) {
                    let serText = (sb.querySelector("input[name=s]")) ? sb.querySelector("input[name=s]").value : '';
                        resultsinnerList.innerHTML = '';
                        let serPeg = searchheader.querySelector('.tpgb-search-pagina');
                        if(serPeg){
                            serPeg.innerHTML = '';
                        }
                        
                        let formData = new URLSearchParams(new FormData(form)).toString();

                        formData = formData.split("&");

                        var formDataObject = {};

                        // Loop through each parameter and split it into key-value pair
                        formData.forEach(function(param) {
                            var keyValue = param.split("=");
                            var key = decodeURIComponent(keyValue[0]);
                            var value = decodeURIComponent(keyValue[1]);
                            formDataObject[key] = value;
                        });

                    let AjaxData = {
                        GFilter : Generic,
                        ACFilter : acfData,
                        ResultData : pagesetting,
                        DefaultData : Defsetting,
                        resultSetting : Rsetting,
                        searchData: formDataObject
                    };

                    var xhr = new XMLHttpRequest();
                    xhr.open("POST", ((tpgb_config && tpgb_config.ajax_url) ? tpgb_config.ajax_url : tpgb_load.ajaxUrl), true);
                    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;');

                    xhr.onreadystatechange = function () {
                        if (xhr.readyState === 4) {
                            if (xhr.status === 200) {
                                var response = JSON.parse(xhr.responseText);
                                var ErrorHtml = sb.querySelectorAll('.tpgb-search-error');
                                var Headerclass = sb.querySelector('.tpgb-search-header');

                                if (response.error && ErrorHtml.length > 0) {
                                    ErrorHtml[0].style.cssText = "display:block";
                                    ErrorHtml[0].innerHTML = response.message;
                                    Headerclass.style.cssText = "display:none";
                                    slideDownP(searcharea, 100);
                                    return;
                                } else {
                                    ErrorHtml[0].style.cssText = "display:none";
                                    Headerclass.style.cssText = "display:flex";
                                    ErrorHtml[0].innerHTML = '';
                                }

                                var responseData = (response.data) ? response.data : '';
                                if (responseData && responseData.post_count !== 0) {
                                    var posts = responseData.posts;
                                    var outputHtml = '';
                                    var listHtml = '<div class="' + resultList.replace('.', '') + '">%s</div>';
                                    var listItemHtml = '';
                                    slideDownP(searcharea, 100);

                                    for (var post in posts) {
                                        listItemHtml += posts[post];

                                        if ((parseInt(post) + 1) % responseData.limit_query == 0 || parseInt(post) === posts.length - 1) {
                                            outputHtml += listHtml.replace('%s', listItemHtml);
                                            listItemHtml = '';
                                        }
                                    }

                                    resultsinnerList.innerHTML = outputHtml;

                                    if (Rsetting.TotalResult) {
                                        var ResultTxt = Rsetting.TotalResultTxt ? Rsetting.TotalResultTxt : '';
                                        var resultCountEl = searchheader.querySelector('.tpgb-search-resultcount');
                                        if (resultCountEl) {
                                            resultCountEl.innerHTML = responseData.post_count + ' ' + ResultTxt;
                                        }
                                    }

                                    if (responseData.pagination) {
                                        sb.querySelector('.tpgb-search-pagina').innerHTML = responseData.pagination;
                                        var pageColumn = (responseData.columns) ? responseData.columns : '';
                                        tp_pagination_ajax(pageColumn, AjaxData, pagesetting, sb, ajaxsearch);
                                    } else if (responseData.loadmore != undefined) {
                                        var loadmEl = sb.querySelector('.tpgb-load-more');
                                        if (responseData.loadmore) {
                                            if (responseData.total_count > responseData.limit_query) {
                                                loadmEl.innerHTML = responseData.loadmore;
                                                tp_loadmore_ajax(responseData, AjaxData, pagesetting, sb, ajaxsearch);
                                            } else {
                                                var Paginaclass = sb.querySelectorAll('.tpgb-search-pagina');
                                                if (Paginaclass.length > 0) {
                                                    Paginaclass[0].innerHTML = responseData.loadmore_page;
                                                }
                                            }
                                        } else {
                                            loadmEl.innerHTML = '';
                                        }
                                    } else if (responseData.lazymore) {
                                        var gLzLoad = sb.querySelector('.tpgb-lazy-load');
                                        if (responseData.total_count > responseData.limit_query) {
                                            gLzLoad.innerHTML = responseData.lazymore;
                                            tp_lazymore_ajax(AjaxData, pagesetting, sb, ajaxsearch);
                                        } else {
                                            gLzLoad.innerHTML = '';
                                        }
                                    }
                                } else {
                                    ErrorHtml[0].style.cssText = "display:block";
                                    ErrorHtml[0].innerHTML = Rsetting.errormsg;
                                    Headerclass.style.cssText = "display:none";
                                    slideDownP(searcharea, 100);
                                    return;
                                }
                            } else {
                                console.error('Error:', xhr.status);
                            }

                            var getinput = document.querySelectorAll('.tpgb-search-input');
                            if (getinput.length > 0) {
                                getinput.forEach(function (el) {
                                    setTimeout(function () {
                                        el.blur();
                                    }, 500);
                                });
                            }

                            setTimeout(function () {
                                var tCloseBtn = sb.querySelector('.tpgb-close-btn');
                                var tajaxload = sb.querySelector('.tpgb-ajx-loading');
                                if (tajaxload) {
                                    tajaxload.style.cssText = "display:none";
                                }
                                if (tCloseBtn) {
                                    tCloseBtn.style.cssText = "display:flex";
                                }
                            }, 500);
                            tp_Close_result();
                        }
                    };

                      xhr.send('action=tpgb_search&nonce='+ajaxsearch.nonce+'&text='+serText+'&postper='+ajaxsearch.post_page+'&styleColumn='+ajaxsearch.styleColumn+'&style='+ajaxsearch.style+'&tempId='+ajaxsearch.tempid+'&data='+JSON.stringify(AjaxData));
                }


                function tp_Close_result() {
                    let Area = sb.querySelector('.tpgb-search-area'),
                        input= sb.querySelector('input[name=s]'),
                        overlay = sb.querySelector('.tpgb-rental-overlay'),
                        closebtn = sb.querySelector('.tpgb-close-btn'),
                        serInArrow = sb.querySelector('.tpgb-dd-icon');

                    if(closebtn){
                        closebtn.addEventListener('click', (e)=>{
                            if(input){
                                input.value='';
                            }
                            e.currentTarget.style.display = 'none';

                            slideUpP(Area);
                            if(overlay){
                                overlay.style.cssText = "visibility:hidden;opacity:0;";
                            }
                            if(sb.classList.contains('tpgb-ser-input-dis')){
                                serInArrow.style.cssText = "display:flex";
                            }
                        })
                    }

                    sb.addEventListener('keyup', (e)=>{
                        if (e.key === "Escape") {
                            input.value='';
                            slideUpP(Area);
                            closebtn.style.cssText = "display:none";
                        }
                    });
                }
            }

        });
    }
}

/** Load More Function */
function tp_loadmore_ajax(responseData, ajaxData, pagesetting, main, ajaxsearch) {
    let loadclass = main.querySelector('.post-load-more'),
        Postclass = main.querySelector('.tpgb-search-slider'),
        Paginaclass = main.querySelector('.tpgb-search-pagina');
        
    if(Paginaclass && responseData){
        Paginaclass.innerHTML = responseData.loadmore_page;
    }

    if(loadclass){
        loadclass.addEventListener("click", function(e){
            let PageNum = Number(this.dataset.page),
                NewNum = Number(PageNum + 1),
                PostCount = main.querySelectorAll('.tpgb-ser-item');

                var xhr = new XMLHttpRequest();
                xhr.open('POST', (tpgb_config && tpgb_config.ajax_url) ? tpgb_config.ajax_url : tpgb_load.ajaxUrl);
                xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

                // xhr.onreadystatechange = function() {
                    if (xhr.readyState) {
                        loadclass.textContent = pagesetting.loadingtxt;
                    }
                // };

                xhr.onload = function() {
                    if (xhr.status === 200) {
                        var loadRes = JSON.parse(xhr.responseText);
                        loadclass.textContent = pagesetting.loadbtntxt;

                        var posts = loadRes.data.posts,
                            totalcount = loadRes.data.total_count,
                            post = null,
                            listItemHtml = '';

                        for (post in posts) {
                            listItemHtml += posts[post];
                        }

                        Postclass.innerHTML += listItemHtml;
                        loadclass.setAttribute("data-page", NewNum);

                        if (Paginaclass) {
                            var PageCount = Paginaclass.querySelector('.tpgb-load-number');
                            PageCount.textContent = NewNum;
                        }

                        var postscount = main.querySelectorAll('.tpgb-ser-item');
                        if (postscount.length == totalcount) {
                            loadclass.classList.add('tp-hide');

                            var parentLoad = loadclass.parentNode;
                            parentLoad.innerHTML += '<div class="tpgb-post-loaded">' + pagesetting.loadedtxt + '</div>';
                        }
                    } else {
                        console.error('Request failed. Status: ' + xhr.status);
                    }
                };

                xhr.onerror = function() {
                    console.error('Request failed');
                };

            xhr.send('action=tpgb_search&nonce='+ajaxsearch.nonce+'&text=&postper='+ajaxsearch.post_page+'&styleColumn='+ajaxsearch.styleColumn+'&style='+ajaxsearch.style+'&tempId='+ajaxsearch.tempid+'&data='+JSON.stringify(ajaxData)+'&offset='+PostCount.length+'&loadNumpost='+pagesetting.loadnumber);

        });
    }
}

/** Lazy Load Function */
function tp_lazymore_ajax(ajaxData, pagesetting, main, ajaxsearch) {
    let loadclass = main.querySelector('.post-lazy-load'),
        Postclass = main.querySelector('.tpgb-search-slider'),
        Paginaclass = main.querySelectorAll('.tpgb-search-pagina');

    var windowWidth, windowHeight, documentHeight, scrollTop, containerHeight, containerOffset, $window = window;
    var recalcValues = function() {
        windowWidth = $window.innerWidth;
        windowHeight = $window.innerHeight;
        documentHeight = document.body.offsetHeight;
        containerHeight = main.querySelector(".tpgb-search-area").offsetHeight;
        containerOffset = main.querySelector(".tpgb-search-area").offsetTop + 50;

        setTimeout(function() {
            containerHeight = main.querySelector(".tpgb-search-area").offsetHeight;
            containerOffset = main.querySelector(".tpgb-search-area").offsetTop + 50;
        }, 50);
    };
    recalcValues();
    $window.addEventListener('resize', recalcValues);


    unbindEventListeners(window, "scroll");
    bindEventListener(window, "scroll", scrollListLoad);

    function scrollListLoad(e) {
        e.preventDefault();
        recalcValues();
        scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        let gtSerArea = main.querySelector(".tpgb-search-area");
        containerHeight = gtSerArea.offsetHeight;
        containerOffset = gtSerArea.offsetTop + 50;

        var lazyFeed_click = gtSerArea.querySelector(".post-lazy-load"),
            PostCount = main.querySelectorAll('.tpgb-ser-item');
        if (lazyFeed_click && scrollTop < documentHeight && (scrollTop + 60 > (containerHeight + containerOffset - windowHeight))) {
            if (lazyFeed_click.dataset.requestRunning && lazyFeed_click.dataset.requestRunning=='true') {
                return;
            }
            lazyFeed_click.dataset.requestRunning = 'true';
            var xhr = new XMLHttpRequest();
            xhr.open('POST', (tpgb_config && tpgb_config.ajax_url) ? tpgb_config.ajax_url : tpgb_load.ajaxUrl, true);
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            xhr.onload = function () {
                if (xhr.status === 200 && xhr.status < 400) {
                    var loadRes = JSON.parse(xhr.responseText);

                    let posts = loadRes.data.posts,
                        totalcount = loadRes.data.total_count,
                        post = null,
                        listItemHtml = '';

                    for (post in posts) {
                        listItemHtml += posts[post];
                    }

                    Postclass.innerHTML += listItemHtml;

                    let postscount = main.querySelectorAll('.tpgb-ser-item');
                    if (postscount.length == totalcount) {
                        loadclass.classList.add('tp-hide');

                        var parentLoad = loadclass.parentNode;
                        parentLoad.innerHTML += '<div class="tpgb-post-loaded">' + pagesetting.loadedtxt + '</div>';

                        if (pagesetting.loadedtxt) {
                            setTimeout(() => {
                                parentLoad.innerHTML = '';
                            }, 1000)
                        }
                    }
                }
                lazyFeed_click.dataset.requestRunning = 'false';
            };
            xhr.send('action=tpgb_search&nonce='+ajaxsearch.nonce+'&text=&postper='+ajaxsearch.post_page+'&styleColumn='+ajaxsearch.styleColumn+'&style='+ajaxsearch.style+'&tempId='+ajaxsearch.tempid+'&data='+JSON.stringify(ajaxData)+'&offset='+PostCount.length+'&loadNumpost='+pagesetting.loadnumber);
        }
    }
}

/** Pagination Function */
function tp_pagination_ajax(pageColumn, ajaxData, pagesetting, main, ajaxsearch) {
			
    let Innerclass = main.querySelector('.tpgb-search-list-inner'),
        Buttonajax = main.querySelectorAll('.tpgb-pagelink.tpgb-ajax-page'),
        NextBtn = main.querySelector('.tpgb-pagelink.next'),
        PrevBtn = main.querySelector('.tpgb-pagelink.prev'),
        $counterOn = (pagesetting.Pcounter) ? pagesetting.Pcounter : 0,
        $Countlimit = (pagesetting.PClimit) ? pagesetting.PClimit : 3;

    var $NavigationOn = (pagesetting.PNavigation) ? pagesetting.PNavigation : 0,
        $PostPer = (ajaxData && ajaxData.post_page) ? ajaxData.post_page : 3;

    if(Buttonajax.length > 0){
        Buttonajax.forEach(function(self,idx) {
            if(Number(self.dataset.page) == Number(1)){
                let Findhtml = main.querySelector('.tpgb-search-slider');
                    if(Findhtml){
                        Findhtml.classList.add( 'ajax-'+Number(1) );
                    }
            }else{
                if(Innerclass){
                    Innerclass.innerHTML += '<div class="tpgb-search-slider tpgb-row ajax-' + Number(idx + 1) + '"></div>';
                }
            }

            self.addEventListener("click", function(e){
                let PageNumber = this.dataset.page,
                    Offset = (PageNumber * $PostPer) - ($PostPer),
                    Position = idx*100;
                let PpostCount = main.querySelectorAll('.tpgb-ser-item');
                    // ajaxData.offset = PpostCount.length;
                    // ajaxData.offset = Offset;

                    tp_pagination_active(Buttonajax,PageNumber)

                    if($NavigationOn){
                        PrevBtn.setAttribute("data-prev", PageNumber);
                        NextBtn.setAttribute("data-next", PageNumber);
                    }

                    let ajaxclass = Innerclass.querySelector('.tpgb-search-slider.ajax-'+PageNumber);
                        if(ajaxclass){
                            if(ajaxclass.querySelector('.tpgb-ser-item')){
                                Innerclass.style.cssText = "transform: translateX("+ -(Position) +"%)";
                                tp_pagination_hidden(pageColumn, main);
                                return;
                            }
                        }

                    var xhr = new XMLHttpRequest();

                    // Open the request
                    xhr.open('POST', (tpgb_config && tpgb_config.ajax_url) ? tpgb_config.ajax_url : tpgb_load.ajaxUrl, true);
                    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                    // Set up event listeners
                    xhr.onload = function() {
                       
                        if (xhr.status === 200) {
                            var res2 = JSON.parse(xhr.responseText);
                            var posts = res2.data.posts;
                            var listItemHtml = '';

                            for (var post in posts) {
                                listItemHtml += posts[post];
                            }

                            ajaxclass.innerHTML += listItemHtml;
                            Innerclass.style.cssText = "transform: translateX(" + -(Position) + "%)";
                            tp_pagination_hidden(pageColumn, main);
                        } else {
                            // Handle error
                            console.error('Request failed with status:', xhr.status);
                        }
                    };

                    // Send the request
                    xhr.send('action=tpgb_search&nonce='+ajaxsearch.nonce+'&text=&postper='+ajaxsearch.post_page+'&styleColumn='+ajaxsearch.styleColumn+'&style='+ajaxsearch.style+'&tempId='+ajaxsearch.tempid+'&data='+JSON.stringify(ajaxData)+'&offset='+PpostCount.length);

            });
        });
    }

    if(NextBtn){
        NextBtn.addEventListener("click", function(e){
            let PageNumber = Number(this.dataset.next),
                NewNumber = PageNumber + Number(1),
                Position = -(PageNumber * Number(100)),
                Offset = (NewNumber * $PostPer) - ($PostPer);

            let PpostCount = main.querySelectorAll('.tpgb-ser-item');
                ajaxData.offset = PpostCount.length;
                // ajaxData.offset = Offset;

            if($counterOn){
                Buttonajax.forEach(function(self,idxi) {
                    if(NewNumber == Number(self.dataset.page)){   
                        if(self.classList.contains('tp-hide')){
                            let one = Number(idxi+1 - $Countlimit);
                                self.classList.remove('tp-hide');
                                Buttonajax.forEach(function(self,idxii) {
                                    if(one == idxii+1){
                                        self.classList.add('tp-hide');
                                    }
                                });
                        }
                    }
                });
            }

            tp_pagination_active(Buttonajax,NewNumber)

            if($NavigationOn){
                PrevBtn.setAttribute("data-prev", NewNumber);
                NextBtn.setAttribute("data-next", NewNumber);
            }

            let ajaxclass = Innerclass.querySelector('.tpgb-search-slider.ajax-'+NewNumber);
            if(ajaxclass){
                if(ajaxclass.querySelector('.tpgb-ser-item')){
                    Innerclass.style.cssText = "transform: translateX("+ Position +"%)";
                    tp_pagination_hidden(pageColumn, main);
                    return;
                }
            }

            var xhr = new XMLHttpRequest();
            // Open the request
            xhr.open('POST', (tpgb_config && tpgb_config.ajax_url) ? tpgb_config.ajax_url : tpgb_load.ajaxUrl, true);
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            // Set up event listeners
            xhr.onload = function() {
                if (xhr.status === 200) {
                    var nextres = JSON.parse(xhr.responseText);
                    var posts = nextres.data.posts;
                    var listItemHtml = '';

                    for (var post in posts) {
                        listItemHtml += posts[post];
                    }

                    ajaxclass.innerHTML += listItemHtml;
                    Innerclass.style.cssText = "transform: translateX(" + Position + "%)";
                    tp_pagination_hidden(pageColumn, main);
                } else {
                    // Handle error
                    console.error('Request failed with status:', xhr.status);
                }
            };

            // Send the request
            xhr.send('action=tpgb_search&nonce='+ajaxsearch.nonce+'&text=&postper='+ajaxsearch.post_page+'&styleColumn='+ajaxsearch.styleColumn+'&style='+ajaxsearch.style+'&tempId='+ajaxsearch.tempid+'&data='+JSON.stringify(ajaxData)+'&offset='+PpostCount.length);

        });
    }
        
    if(PrevBtn){
        PrevBtn.addEventListener("click", function(e){
            let PageNumber = Number(this.dataset.prev),
                OldNumber = PageNumber - Number(1),
                Position = -(OldNumber * 100) + 100,
                Offset = (OldNumber * $PostPer) - ($PostPer);

            let PpostCount = main.querySelectorAll('.tpgb-ser-item');
            // ajaxData.offset = PpostCount.length;
                // ajaxData.offset = Offset;

            if($counterOn){
                Buttonajax.forEach(function(self,idxi) {
                    if(OldNumber == Number(self.dataset.page)){ 
                        if(self.classList.contains('tp-hide')){
                            let one = Number( idxi+1) + Number( ($Countlimit) );	
                            self.classList.remove('tp-hide');
                            Buttonajax.forEach(function(self,idxii) {
                                if(one == idxii+1){
                                    self.classList.add('tp-hide');
                                }
                            });
                        }
                    }
                });
            }

            tp_pagination_active(Buttonajax,OldNumber)

            if($NavigationOn){
                PrevBtn.setAttribute("data-prev", OldNumber);
                NextBtn.setAttribute("data-next", OldNumber);
            }

            let ajaxclass = Innerclass.querySelector('.tpgb-search-slider.ajax-'+OldNumber);
            if(ajaxclass){
                if(ajaxclass.querySelector('.tpgb-ser-item')){
                    Innerclass.style.cssText = "transform: translateX("+ Position +"%)";
                    tp_pagination_hidden(pageColumn, main);
                    return;
                }
            }

            var xhr = new XMLHttpRequest();
            xhr.open('POST', (tpgb_config && tpgb_config.ajax_url) ? tpgb_config.ajax_url : tpgb_load.ajaxUrl, true);
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            // Set up event listeners
            xhr.onload = function() {
                    if (xhr.status === 200) {
                        var Prevres = JSON.parse(xhr.responseText);
                        var posts = Prevres.data.posts;
                        var listItemHtml = '';

                        for (var post in posts) {
                            listItemHtml += posts[post];
                        }

                        ajaxclass.innerHTML += listItemHtml;
                        Innerclass.style.cssText = "transform: translateX(" + Position + "%)";
                        tp_pagination_hidden(pageColumn, main);
                    } else {
                        // Handle error
                        console.error('Request failed with status:', xhr.status);
                    }
            };

            // Send the request
            xhr.send('action=tpgb_search&nonce='+ajaxsearch.nonce+'&text=&postper='+ajaxsearch.post_page+'&styleColumn='+ajaxsearch.styleColumn+'&style='+ajaxsearch.style+'&tempId='+ajaxsearch.tempid+'&data='+JSON.stringify(ajaxData)+'&offset='+PpostCount.length);

        });
    }
}
function tp_pagination_hidden(pageColumn, main){
    if(pageColumn){
        let PagelinkNext = main.querySelector('.tpgb-pagelink.next'),
            PagelinkPrev = main.querySelector('.tpgb-pagelink.prev');
        
        if(PagelinkNext){
            let Next = (PagelinkNext.dataset && PagelinkNext.dataset.next) ? PagelinkNext.dataset.next : '';
            if(parseInt(Next) == pageColumn){
                PagelinkNext.style.display = 'none';
            }else{
                PagelinkNext.style.display = 'inline-block';
            }
        }
        
        if(PagelinkPrev){
            let Prev = (PagelinkPrev.dataset && PagelinkPrev.dataset.prev) ? PagelinkPrev.dataset.prev : '';
            if(parseInt(Prev) == 1){
                PagelinkPrev.style.display = 'none';
            }else{
                PagelinkPrev.style.display = 'inline-block';
            }
        }
    }
}
function tp_pagination_active($class, $val){
    if($class.length > 0){
        $class.forEach(function(item) {
            if($val == Number(item.dataset.page)){
                item.classList.add('active');
            }else if(item.classList.contains('active')){
                item.classList.remove('active');
            }
        });
    }
}

function tp_overlay_body(sb){
    let overlay = sb.querySelector('.tpgb-rental-overlay'),
        textbox = sb.querySelector('.tpgb-input-field');

    // Input 
    let serInput =  sb.querySelector('.tpgb-search-input');
    if(serInput){
        serInput.addEventListener('focus', ()=>{
            overlay.style.cssText = "visibility:visible;opacity:1;";
            textbox.style.cssText = "z-index:1000;";
        });
        serInput.addEventListener('focusout', ()=>{
            overlay.style.cssText = "visibility:hidden;opacity:0;";
            textbox.style.cssText = "";
        });
    }  

    // select 
    let serSelect = sb.querySelector('.tpgb-select');
    if(serSelect){
        serSelect.addEventListener('click', ()=>{
            overlay.style.cssText = "visibility:visible;opacity:1;";
        });
    }
    if(overlay){
        overlay.addEventListener('click', ()=>{
            overlay.style.cssText = "visibility:hidden;opacity:0;";
        });
    }

    // Esc key to close
    sb.addEventListener('keyup', (e)=>{
        if (e.key === "Escape") {
            overlay.style.cssText = "visibility:hidden;opacity:0;";
        }
    });
}

function bindEventListener(element, eventName, handler) {
    if (!element.eventListeners) {
        element.eventListeners = {};
    }
    if (!element.eventListeners[eventName]) {
        element.eventListeners[eventName] = [];
    }
    element.addEventListener(eventName, handler);
    element.eventListeners[eventName].push(handler);
}

function unbindEventListeners(element, eventName) {
    if (element.eventListeners && element.eventListeners[eventName]) {
        element.eventListeners[eventName].forEach(handler => {
            element.removeEventListener(eventName, handler);
        });
        element.eventListeners[eventName] = [];
    }
}