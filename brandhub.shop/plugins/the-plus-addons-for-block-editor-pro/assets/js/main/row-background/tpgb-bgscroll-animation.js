
tpgbbgScroll(document)
function tpgbbgScroll(){
    let getSecCon = document.querySelectorAll('.tpgb-section:not(.tpgb-section-editor), .tpgb-container-row:not(.tpgb-container-row-editor)');
    if(getSecCon){
        getSecCon.forEach(function (element) {
            if (element.querySelector('.tpgb-row-bg-gradient')) {
                var container = element.querySelector('.tpgb-row-bg-gradient');
                var position = container.dataset.position;
                var fullpage = container.dataset.fullPage;
                if (fullpage === 'yes') {
                    element.closest('.site-content').prepend(container);
                    element.closest('.site-content').style.position = position;
                }
            }
            if (element.querySelector('.tpgb-row-scrollbg')) {
                var scrolldiv = element.querySelector('.tpgb-row-scrollbg');
                var secdiv = scrolldiv.querySelector('.tpgb-section-bg-scrolling');
        
                element.closest('.site-content').prepend(scrolldiv);
                element.closest('.site-content').style.position = scrolldiv.style.position;
        
                if (scrolldiv.dataset.scrollingEffect === 'yes') {
                    var bgColors = scrolldiv.dataset.bgcolors;
        
                    bgColors = JSON.parse(bgColors);
        
                    if (bgColors) {
                        var parent_node = scrolldiv.closest('.site-content');
                        var i = 0;
                        var arry_len = bgColors.length;
                        var pareDiv = document.querySelectorAll(".tpgb-section").length ? parent_node.querySelectorAll(".tpgb-section") : parent_node.querySelectorAll(".tpgb-container-row");
        
                        document.querySelectorAll('.tpgb-row-scrollbg').forEach(function (scrollDiv) {
                            scrollDiv.style.backgroundColor = bgColors[0];
        
                            pareDiv.forEach(function (div) {
                                var FirstColor, SecondColor;
                                if (arry_len > i) {
                                    FirstColor = i;
                                    SecondColor = i + 1;
                                } else {
                                    i = 0;
                                    FirstColor = i;
                                    SecondColor = i + 1;
                                }
                                if (bgColors[FirstColor] !== '' && bgColors[FirstColor] !== undefined) {
                                    FirstColor = bgColors[FirstColor];
                                }
                                if (bgColors[SecondColor] !== '' && bgColors[SecondColor] !== undefined) {
                                    SecondColor = bgColors[SecondColor];
                                } else {
                                    i = 0;
                                    SecondColor = i;
                                    SecondColor = bgColors[SecondColor];
                                }
                                rowTransitionalColor(div, new Color(FirstColor), new Color(SecondColor));
                                i++;
                            });
                        });
                    }
                } else if (scrolldiv) {
                    var bgColors = scrolldiv.dataset.bgcolors;
        
                    var secDiv = document.querySelectorAll('.tpgb-section');
                    var contentElems = secDiv.length ? Array.from(document.querySelectorAll('.tpgb-section')) : Array.from(document.querySelectorAll('.tpgb-container-row'));
        
                    var loop_scroll = scrolldiv.querySelectorAll(".tpgb-section-bg-scrolling");
                    var totalEle = contentElems.length;
                    var step = 0;
                    var position= 0;
        
                    contentElems.forEach(function (el, pos) {
                        var scrollElemToWatch = pos ? contentElems[pos] : contentElems[pos];
                        pos = pos ? pos : totalEle;
                        var watcher = scrollMonitor.create(scrollElemToWatch, { top: -300 });
        
                        watcher.enterViewport(function () {
                            step = pos;
                            if (totalEle >= loop_scroll.length && pos + 1 > loop_scroll.length) {
                                position = 0;
                            } else {
                                position = pos;
                            }
                            scrolldiv.querySelector(".tpgb-section-bg-scrolling.active").classList.remove("active");
                            scrolldiv.querySelectorAll(".tpgb-section-bg-scrolling")[position].classList.add("active");
                        });
                        watcher.exitViewport(function () {
                            var idx = !watcher.isAboveViewport ? pos - 1 : pos + 1;
                            if (idx <= totalEle && step !== idx) {
                                step = idx;
                                if (totalEle > loop_scroll.length && idx + 1 > loop_scroll.length) {
                                    position = 0;
                                } else {
                                    position = idx;
                                }
        
                                scrolldiv.querySelector(".tpgb-section-bg-scrolling.active").classList.remove("active");
                                scrolldiv.querySelectorAll(".tpgb-section-bg-scrolling")[position].classList.add("active");
                            }
                        });
                    });
                }
            }
        });
    }
}

function rowTransitionalColor(row, firstColor, secondColor) {
    var scrollPos = 0;
    var currentRow = row;
    var beginningColor = firstColor;
    var endingColor = secondColor;
    var percentScrolled, newRed, newGreen, newBlue, newColor;

    document.addEventListener('scroll', function () {
        var animationBeginPos = currentRow.offsetTop;
        var endPart = currentRow.offsetHeight < 800 ? currentRow.offsetHeight / 4 : window.innerHeight;
        var animationEndPos = animationBeginPos + currentRow.offsetHeight - endPart;
        scrollPos = window.scrollY;

        if (scrollPos >= animationBeginPos && scrollPos <= animationEndPos) {
            percentScrolled = (scrollPos - animationBeginPos) / (currentRow.offsetHeight - endPart);

            newRed = Math.abs(beginningColor.red() + (endingColor.red() - beginningColor.red()) * percentScrolled);
            newGreen = Math.abs(beginningColor.green() + (endingColor.green() - beginningColor.green()) * percentScrolled);
            newBlue = Math.abs(beginningColor.blue() + (endingColor.blue() - beginningColor.blue()) * percentScrolled);

            newColor = 'rgb(' + Math.round(newRed) + ',' + Math.round(newGreen) + ',' + Math.round(newBlue) + ')';
            document.querySelector('.tpgb-row-scrollbg').style.backgroundColor = newColor.toString();
        // } else if (scrollPos > animationEndPos) {
            // document.querySelector('.tpgb-row-scrollbg').style.backgroundColor = endingColor.toString();
        }
    });
}