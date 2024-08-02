function numscrollerfun() {
    function numberRoller(g) {
        var element = document.querySelector(".roller-title-number-" + g);
        var min = parseInt(element.getAttribute("data-min"));
        var max = parseInt(element.getAttribute("data-max"));
        var delay = parseInt(element.getAttribute("data-delay"));
        var increment = parseInt(element.getAttribute("data-increment"));
        var numeration = element.getAttribute("data-numeration");
        
        numberRoll(g, min, max, increment, 1000 * delay / (max - min), numeration);
    }

    function numberRoll(slno, min, max, increment, timeout, numeration) {
        if (min <= max) {
            var element = document.querySelector(".roller-title-number-" + slno);
            element.innerHTML = formatNumber(min, numeration);
            min = parseInt(min) + parseInt(increment);
            setTimeout(function() {
                numberRoll(slno, min, max, increment, timeout, numeration);
            }, timeout);
        } else {
            var element = document.querySelector(".roller-title-number-" + slno);
            element.innerHTML = formatNumber(max, numeration);
        }
    }

    function formatNumber(a, b) {
        if (b === "indian") {
            let b = a.toString();
            var c = b.substring(b.length - 3);
            var d = b.substring(0, b.length - 3);
            if (d !== "") {
                c = "," + c;
            }
            var e = d.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + c;
            return e;
        }
        return b === "international" ? a.toLocaleString("en-US") : a;
    }

    // window.addEventListener("load", function() {
    //     document.addEventListener("scroll", function() {
    //         document.querySelectorAll(".numscroller").forEach(function(element) {
    //             if(element){
    //                 if (isElementInViewport(element) && !element.classList.contains('isshown')) {
    //                     element.classList.add('isshown')
    //                     numberRoller(element.getAttribute("data-slno"));
    //                 }
    //             }
    //         });
    //     });
    // });

    function isElementInViewport(el, partiallyVisible = false) {
        const { top, left, bottom, right } = el.getBoundingClientRect();
        const { innerHeight, innerWidth } = window;
        return partiallyVisible
            ? ((top > 0 && top < innerHeight) ||
                (bottom > 0 && bottom < innerHeight)) &&
                ((left > 0 && left < innerWidth) || (right > 0 && right < innerWidth))
            : top >= 0 && left >= 0 && bottom <= innerHeight && right <= innerWidth;
    }

    function rollerInit() {
        var numscrollers = document.querySelectorAll(".numscroller");
        if(numscrollers){
            numscrollers.forEach(function(element, index) {
                if(element){
                    element.setAttribute("data-slno", index + 1);
                    element.classList.add("roller-title-number-" + (index + 1));
    
                    document.addEventListener("scroll", function() {
                        if (isElementInViewport(element) && !element.classList.contains('isshown')) {
                            element.classList.add('isshown')
                            numberRoller(element.getAttribute("data-slno"));
                        }
                    });
                }
            });
        }
    }

    function initialLoad(){
        document.querySelectorAll(".numscroller").forEach(function(element) {
            if(element){
                if (isElementInViewport(element) && !element.classList.contains('isshown')) {
                    element.classList.add('isshown')
                    numberRoller(element.getAttribute("data-slno"));
                }
            }
        });
    }
    rollerInit();
    initialLoad();
}
document.addEventListener('DOMContentLoaded', ()=>{
    numscrollerfun();
});