function animatedBG(element, options) {
    var defaults = {
        colorSet: ['#ef008c', '#00be59', '#654b9e', '#ff5432', '#00d8e6'],
        delay: 0,
        duration: 3
    };
    var settings = Object.assign({}, defaults, options);
    var totalInterval = (Number(settings.delay) + Number(settings.duration)) * 1000;
    function shiftColor(colors) {
        var color = colors.shift();
        colors.push(color);
        return color.toString();
    }

    // initial color
    var initColor = shiftColor(settings.colorSet);
    element.style.backgroundColor = initColor;

    setInterval(function() {
        var color = shiftColor(settings.colorSet);
        animateBackgroundColor(element, color, settings.duration * 1000);
    }, totalInterval);
}
  
function animateBackgroundColor(element, color, duration) {
    var startTime = new Date().getTime();
    var startColor = element.style.backgroundColor;
    var raf = requestAnimationFrame(function animateStep() {
        var currentTime = new Date().getTime();
        var elapsed = currentTime - startTime;
        if (elapsed < duration) {
            var progress = elapsed / duration;
            var newColor = blendColors(startColor, color, progress);
            element.style.backgroundColor = newColor;
            raf = requestAnimationFrame(animateStep);
        } else {
            element.style.backgroundColor = color;
        }
    });
}
  
function blendColors(startColor, endColor, progress) {
    var start = hexToRGB(startColor);
    var end = hexToRGB(endColor);
    var r = Math.round(start.r + (end.r - start.r) * progress);
    var g = Math.round(start.g + (end.g - start.g) * progress);
    var b = Math.round(start.b + (end.b - start.b) * progress);
    return "rgb(" + r + "," + g + "," + b + ")";
}
  
function hexToRGB(hex) {
    let rootPattern = /^var\(\s*--[\w-]+\s*\)$/;
    var rootResult = rootPattern.exec(hex);
    if(rootResult){
        let getRoot = document.querySelector(':root');
        if(getRoot){
            let varPattern = /var\(([^)]+)\)/;
            let matches = hex.match(varPattern);
            if (matches) {
                const innerBracketText = matches[1];
                let rootCSS = getComputedStyle(getRoot);
                hex = rootCSS.getPropertyValue(innerBracketText);
            }
        }
    }
    var rgbPattern = /^rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/i;
    var result = rgbPattern.exec(hex);
    if(result){
        return {
            r: parseInt(result[1], 10),
            g: parseInt(result[2], 10),
            b: parseInt(result[3], 10),
        };
    }else{
        var resultN = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        if(resultN){
            return {
                r: parseInt(resultN[1], 16),
                g: parseInt(resultN[2], 16),
                b: parseInt(resultN[3], 16),
            };
        }
    }
}

function tpgbrowaniBg(doc) {
    var animateBg = doc.querySelectorAll(".tpgb-section:not(.tpgb-section-editor) .row-animat-bg, .tpgb-container-row:not(.tpgb-container-row-editor) .row-animat-bg");
    if(animateBg){
    animateBg.forEach(function(element) {
        var dataDelay = element.getAttribute("data-bg-delay");
        var dataDuration = element.getAttribute("data-bg-duration");
        var dataColors = element.getAttribute("data-bg");
        var colors = dataColors ? JSON.parse(dataColors) : undefined;
        animatedBG(element, {
            colorSet: colors,
            delay: dataDelay,
            duration: dataDuration,
        });
        });
    }
}

document.addEventListener("DOMContentLoaded", function() {
    tpgbrowaniBg(document)
});
