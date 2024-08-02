let accordionStore = new Map();
document.addEventListener("DOMContentLoaded", (event) => {
    accordionJS(document);
});

function accordionJS(getAcc) {
    let allAccordion = getAcc.querySelectorAll(".tpgb-accor-wrap");
    if (allAccordion) {
        allAccordion.forEach((el) => {
            let accType = el.getAttribute("data-type"),
                accrodionList = el.querySelectorAll(".tpgb-accor-item"),
                atoneopen = el.getAttribute("data-one-onen");

            accordionJS(el);

            let exColBtn = el.querySelector('.tpgb-toggle-aec');
            if(exColBtn){
                exColBtn.addEventListener('click', function(excl){
                    if(excl.currentTarget.classList.contains('active')){
                        excl.currentTarget.classList.remove('active')
                        accrodionList.forEach((al) => {
                            let acBtn = al.querySelector(".tpgb-accordion-header");
                            acBtn.classList.remove("active");
                            acBtn.nextSibling.classList.remove("active");
                            slideUpP(acBtn.nextSibling, 500);
                        });
                    }else{
                        excl.currentTarget.classList.add('active')
                        accrodionList.forEach((al) => {
                            let acBtn = al.querySelector(".tpgb-accordion-header");
                            acBtn.classList.add("active");
                            acBtn.nextSibling.classList.add("active");
                            slideDownP(acBtn.nextSibling, 500);
                        });
                    }
                });
            }


            accrodionList.forEach((al) => {
                let acBtn = al.querySelector(".tpgb-accordion-header");
                if (accType == "accordion") {
                    if (!accordionStore.get(acBtn)) {
                        acBtn.addEventListener("click", (btn) => {
                            var currBtn = btn.currentTarget;
                            toggleFun(currBtn, accrodionList, atoneopen, exColBtn);
                            changeEventAccordion(currBtn);
                        });
                        accordionStore.set(acBtn, al);
                    }
                } else {
                    acBtn.addEventListener("mouseenter", (btn) => {
                        var currBtn = btn.currentTarget;
                        toggleFun(currBtn, accrodionList, atoneopen, exColBtn);
                    });
                }
            });
        });

        var hash = window.location.hash;
        if (hash != "" && hash != undefined) {
            let getHash = document.querySelector(hash);
            if (getHash && !getHash.classList.contains("active")) {
                var hashOffset = getHash.getBoundingClientRect();
                window.scrollTo({ top: hashOffset.top, behavior: "smooth" });

                let mainAc = getHash.closest(".tpgb-accor-wrap");
                if (mainAc) {
                    let atOpen = mainAc.getAttribute("data-one-onen"),
                        exClBtn = mainAc.querySelector('.tpgb-toggle-aec');
                    let acList = mainAc.querySelectorAll(".tpgb-accor-item");
                    toggleFun(getHash, acList, atOpen, exClBtn);
                }
            }
        }
    }
}

function toggleFun(currBtn, accrodionList, atoneopen, exColBtn) {
    let content = currBtn.nextSibling;
    if (currBtn.classList.contains("active")) {
        if (atoneopen == "no") {
            currBtn.classList.remove("active");
            content.classList.remove("active");
            slideUpP(content, 500);
        }
    } else {
        accrodionList.forEach((ell) => {
            let actCon = ell.querySelector(".tpgb-accordion-header");

            if (actCon.classList.contains("active")) {
                actCon.classList.remove("active");
                actCon.nextSibling.classList.remove("active");
                slideUpP(actCon.nextSibling, 500);
            }
        });
        currBtn.classList.add("active");
        content.classList.add("active");
        slideDownP(content, 500);
    }
    setTimeout(scrollTStart, 500, currBtn);

    let closeItem = currBtn.closest(".tpgb-accor-item");
    if (closeItem) {
        let equalHeightCheck = closeItem.querySelector(".tpgb-equal-height");
        if (equalHeightCheck && typeof equalHeightFun === "function") {
            let eqLoaded = false;
            if (!eqLoaded) {
                equalHeightFun(equalHeightCheck);
                eqLoaded == true;
            }
        }
    }
    if(exColBtn){
        checkExColl(exColBtn, accrodionList)
    }
}

function checkExColl(exColBtn, accrodionList){
    let totalAc = 0;
    accrodionList.forEach((ell) => {
        let actCon = ell.querySelector(".tpgb-accordion-header.active");
        if(actCon){
            totalAc++;
        }
    });
    if(totalAc == 0){
        exColBtn.classList.remove('active');
    }else{
        exColBtn.classList.add('active');
    }
}

function scrollTStart(currBtn) {
    let checkWsize = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    if (checkWsize < 767) {
        currBtn.scrollIntoView({ behavior: "smooth", block: "center" });
    }
}

function changeEventAccordion(el) {
    var isotope_class = " .tpgb-isotope .post-loop-inner",
        metro_class = " .tpgb-metro .post-loop-inner";
    if (el.nextSibling.querySelector(".tpgb-carousel")) {
        var splideDiv = el.nextSibling,
            scope = splideDiv.querySelectorAll(".tpgb-carousel");
        scope.forEach(function (obj) {
            var splideInit = slideStore.get(obj);
            splideInit.refresh();
        });
    }
    if (el && el.nextSibling.querySelector(isotope_class)) {
        tppoMaso(el.nextSibling);
    }
    if (el && el.nextSibling.querySelector(metro_class)) {
        tppoMetro(el.nextSibling);
    }
}