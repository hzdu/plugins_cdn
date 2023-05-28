const scheme = new ColorScheme;
scheme.web_safe(false);
const resultWrapper = document.querySelector('#result');

let BRXC = {
     
    // variables
    startTime: performance.now(),
    isDarkMode: false,
    isModalOpen: false,
    isExportOpen: false,
    currentTransform: -5,
    objLight: {
        '': 0,
        '-l-1': 0.1,
        '-l-2': 0.2,
        '-l-3': 0.4,
        '-l-4': 0.6,
        '-l-5': 0.8,
        '-l-6': 0.9,
        '-d-1': -0.1,
        '-d-2': -0.2,
        '-d-3': -0.4,
        '-d-4': -0.6,
        '-d-5': -0.8,
        '-d-6': -0.9,
     },
     
     objDark: {
        '': 0,
        '-l-10': -0.1,
        '-l-20': -0.2,
        '-l-40': -0.4,
        '-l-60': -0.6,
        '-l-80': -0.8,
        '-l-90': -0.9,
        '-d-10': 0.1,
        '-d-20': 0.2,
        '-d-40': 0.4,
        '-d-60': 0.6,
        '-d-80': 0.8,
        '-d-90': 0.9,
     },

    // Debounce function
    debounce: (fn, threshold) => {
        var timeout;
        threshold = threshold || 200;
        return function debounced() {
        clearTimeout(timeout);
        var args = arguments;
        var _this = this;
    
        function delayed() {
            fn.apply(_this, args);
        }
        timeout = setTimeout(delayed, threshold);
        };
    },

    pSBC: (percent, color) => {
        var f = parseInt(color.slice(1), 16),
           t = percent < 0 ? 0 : 255,
           p = percent < 0 ? percent * -1 : percent,
           R = f >> 16,
           G = f >> 8 & 0x00FF,
           B = f & 0x0000FF;
        return "#" + (0x1000000 + (Math.round((t - R) * p) + R) * 0x10000 + (Math.round((t - G) * p) + G) * 0x100 + (Math.round((t - B) * p) + B)).toString(16).slice(1);
     },

     clampBuilder: (baseFont, minWidthPx, maxWidthPx, minFontSize, maxFontSize) => {
 
        const minWidth = minWidthPx / baseFont;
        const maxWidth = maxWidthPx / baseFont;
     
        const slope = (maxFontSize - minFontSize) / (maxWidth - minWidth);
        const yAxisIntersection = -minWidth * slope + minFontSize;
     
        return `clamp( ${ minFontSize / baseFont  }rem, ${ yAxisIntersection / baseFont  }rem + ${ slope / baseFont * 100 }vw, ${ maxFontSize / baseFont }rem )`;
     },

     getSetStyleRule: sheetName => {
        var stylesheet = document.querySelector('link[href*=' + sheetName + ']')
     
        if (stylesheet) {
           stylesheet = stylesheet.sheet;
        }
     
        return stylesheet
     },

     updateStyleSheet: (el, value, target) => {
        const sheet = BRXC.getSetStyleRule('bricks-advanced-themer');
        let sheetRule;
        if (BRXC.isDarkMode === true) {
           sheetRule = [...sheet.cssRules].find((r) => r.selectorText === "html body.brxc-dark");
        } else {
           sheetRule = [...sheet.cssRules].find((r) => r.selectorText === "html body");
        }
        if (!Array.isArray(el)) {
           const color = el.dataset.color;
           const sufix = el.dataset.sufix;
           if (!sufix) return sheetRule.style.setProperty('--' + color, value);
           return sheetRule.style.setProperty('--' + color + '-' + sufix, value);
        } else {
           const color = target.dataset.color;
           el.forEach(i => {
              if (value == "none") return sheetRule.style.setProperty('--' + color + i[0], value);
              return sheetRule.style.setProperty('--' + color + i[0], BRXC.pSBC(i[1], target.value));
           })
        }
     },

     populateColors: (color, cat, target) => {
        let obj;
        if (BRXC.isDarkMode === false) {
            obj = BRXC.objLight;
        } else {
            obj = BRXC.objDark;
        }
     
        const arr = Object.entries(obj);
        BRXC.updateStyleSheet(arr, color, target);
        if (color == "none") return BRXC.updateLabel(target, '');
        return BRXC.updateLabel(target, color);
     },

     populateSingleColors: target => {
        const color = target.dataset.color;
        const sufix = target.dataset.sufix;
        const sheet = BRXC.getSetStyleRule('bricks-advanced-themer');
        let sheetRule;
        if (BRXC.isDarkMode === true) {
           sheetRule = [...sheet.cssRules].find((r) => r.selectorText === "body.brxc-dark");
        } else {
           sheetRule = [...sheet.cssRules].find((r) => r.selectorText === "body");
        }
        if (!sufix) return sheetRule.style.setProperty('--' + color, target.value);
        return sheetRule.style.setProperty('--' + color + '-' + sufix, target.value);
     },

     updateLabel: (target, value) => {
        const parent = target.closest('.brxc-modal__field');
        const label = parent.querySelector('input[type="text"]');
        label.value = value;
     },
     
     updateSingleLabel: target => {
        const parent = target.closest('.brxc-modal__field');
        const label = parent.querySelector('input[type="text"]');
        label.value = target.value;
        BRXC.updateStyleSheet(target, label.value);
     },

     updateInput: target => {
        const parent = target.closest('.brxc-modal__field');
        const label = parent.querySelector('input[type="color"]');
        label.value = target.value;
        const color = label.dataset.color;
        let obj;
        if (BRXC.isDarkMode === false) {
            obj = BRXC.objLight;
        } else {
            obj = BRXC.objDark;
        }
     
        const arr = Object.entries(obj);
        BRXC.updateStyleSheet(arr, false, label);
     },

     updateSingleInput: target => {
        const parent = target.closest('.brxc-modal__field');
        const label = parent.querySelector('input[type="color"]');
        label.value = target.value;
        BRXC.updateStyleSheet(label, label.value);
     },

     updateMiscValue: target => {
        const parent = target.closest('.brxc-modal__field');
        const label = parent.querySelector('input[type="text"]');
        const prefix = label.dataset.prefix;

        const sheet = BRXC.getSetStyleRule('bricks-advanced-themer');
        sheetRule = [...sheet.cssRules].find((r) => r.selectorText === "html body");

        if (prefix) return sheetRule.style.setProperty('--' + prefix + '-' + label.dataset.label, label.value);
        return sheetRule.style.setProperty('--' + label.dataset.label, label.value);
     },

     unsecuredCopyToClipboard: text => {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.focus({
           preventScroll: true
        });
        textArea.select();
        try {
           document.execCommand('copy')
        } catch (err) {
           console.error('Unable to copy to clipboard', err)
        }
        document.body.removeChild(textArea);
     },

     setActiveBtnState: e => {
        setTimeout(() => {
           e.classList.add('active');
        }, setTimeout(() => {
           e.classList.remove('active');
        }, 2000))
     },

     copyLabeltoClipboard: target => {
        const parent = target.closest('.brxc-modal__field');
        let copyText;
        (parent.querySelector('input[type="text"]')) ? copyText = parent.querySelector('input[type="text"]').value: copyText = parent.querySelector('input[type="number"]').value;
        if (window.isSecureContext && navigator.clipboard) {
           navigator.clipboard.writeText(copyText);
        } else {
            BRXC.unsecuredCopyToClipboard(copyText);
        }
        BRXC.setActiveBtnState(target)
     },

     copyColortoClipboard: target => {
        const parent = target.closest('.color-wrapper');
        const copyText = parent.querySelector('input[type="text"]').value;
        if (window.isSecureContext && navigator.clipboard) {
           navigator.clipboard.writeText(copyText);
        } else {
            BRXC.unsecuredCopyToClipboard(copyText);
        }
        BRXC.setActiveBtnState(target)
     },

     copyValuetoClipboard: value => {
        if (window.isSecureContext && navigator.clipboard) {
           navigator.clipboard.writeText(value);
        } else {
            BRXC.unsecuredCopyToClipboard(value);
        }
     },

     resetTypography: (target, updateStyle) => {
        const parent = target.closest('.brxc-modal__labels-typo');
        let clr;
        (parent.querySelector('input[type="number"]')) ? clr = parent.querySelector('input[type="number"]'): clr = parent.querySelector('input[type="text"]');
        const initialValue = clr.dataset.initialValue;
        clr.value = initialValue;
        BRXC.setActiveBtnState(target);
     },

     resetSingleLabelandInput: (target, updateStyle) => {
        const parent = target.closest('.brxc-modal__field');
        const clr = parent.querySelector('input[type="color"]');
        const initialValue = clr.dataset.initialValue;
        clr.value = initialValue;
        parent.querySelector('input[type="text"]').value = initialValue;
        (updateStyle) ? BRXC.updateStyleSheet(clr, initialValue): '';
        BRXC.setActiveBtnState(target)
     },

     resetLabelandInput: (target, updateStyle) => {
        const parent = target.closest('.brxc-modal__field');
        const clr = parent.querySelector('input[type="color"]');
        const initialValue = clr.dataset.initialValue;
        clr.value = initialValue;
        parent.querySelector('input[type="text"]').value = initialValue;
        (updateStyle) ? BRXC.populateColors(initialValue, clr.dataset.color, clr): '';
        BRXC.setActiveBtnState(target);
     },

     deleteSingleLabelandInput: target => {
        const parent = target.closest('.brxc-modal__field');
        const clr = parent.querySelector('input[type="color"]');
        clr.value = clr.dataset.deleteValue;
        parent.querySelector('input[type="text"]').value = '';
        BRXC.updateStyleSheet(clr, clr.value);
        BRXC.setActiveBtnState(target)
     },
      
     // Accordion
    initAcc: (elem, option) => {
        document.addEventListener('click', (e) => {
            if (!e.target.matches(elem + ' .a-btn')) return;
            else {
                if (!e.target.parentElement.classList.contains('active')) {
                    if (option == true) {
                        var elementList = document.querySelectorAll(elem + ' .a-container');
                        Array.prototype.forEach.call(elementList, (e) => {
                        e.classList.remove('active');
                        });
                    }
                    e.target.parentElement.classList.add('active');
                } else {
                    e.target.parentElement.classList.remove('active');
                }
            }
        });
    },

    exportValuesToJSON: palette => {
        let lightArr = [];
        let darkArr = [];
        const lightFields = document.querySelectorAll('.brxc-modal__light .brxc-modal__inner--content .brxc-modal__palette-wrapper[data-palette="' + palette + '"] .brxc-modal__field');
        const darkFields = document.querySelectorAll('.brxc-modal__dark .brxc-modal__inner--content .brxc-modal__palette-wrapper[data-palette="' + palette + '"] .brxc-modal__field');
        lightFields.forEach(field => {
           const inputColor = field.querySelector('input[type="color"]');
           const inputText = field.querySelector('input[type="text"]');
           let label;
           if (!inputColor.dataset.sufix) {
              label = '--' + inputColor.dataset.color;
           } else {
              label = '--' + inputColor.dataset.color + '-' + inputColor.dataset.sufix;
           }
           let value;
           if (!inputText.value) return;
           value = inputColor.value;
           lightArr.push([label, value])
        })
     
        darkFields.forEach(field => {
           const inputColor = field.querySelector('input[type="color"]');
           const inputText = field.querySelector('input[type="text"]');
           let label;
           if (!inputColor.dataset.sufix) {
              label = '--' + inputColor.dataset.color;
           } else {
              label = '--' + inputColor.dataset.color + '-' + inputColor.dataset.sufix;
           }
           let value;
           if (!inputText.value) return;
           value = inputColor.value;
           darkArr.push([label, value])
        })
        const arr = {
           'light': lightArr,
           'dark': darkArr
        };
        return JSON.stringify(arr);
     },

     exportValuesToCSS: palette => {
        const obj = JSON.parse(BRXC.exportValuesToJSON(palette));
        let lightCSS = "body{\n";
        let darkCSS = "body.brxc-dark{\n";
        const lightobj = obj[Object.keys(obj)[0]];
     
        for (const value in lightobj) {
           arr = lightobj[value];
           lightCSS += `   ${arr[0]}: ${arr[1]};` + '\n';
        }
        lightCSS += '}\n';
     
        const darkobj = obj[Object.keys(obj)[1]];
     
        if (darkobj.length < 1) return lightCSS;
     
        for (const value in darkobj) {
           arr = darkobj[value];
           darkCSS += `   ${arr[0]}: ${arr[1]};` + '\n';
        }
        darkCSS += '}';
     
        return lightCSS + darkCSS;
     },

     // color palette generator
    generateColors: () => {
        var colors = scheme.colors();
        let div = "";
        for (var i in colors) {
        var c = colors[i];
        div += "<div class='color-wrapper generated-color-wrapper'><div class='generated-color' style='background-color: #" + c + "'><svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48' class='brxc__svg-path green' onClick='BRXC.copyColortoClipboard(event.target);'><path d='M9 43.95q-1.2 0-2.1-.9-.9-.9-.9-2.1V10.8h3v30.15h23.7v3Zm6-6q-1.2 0-2.1-.9-.9-.9-.9-2.1v-28q0-1.2.9-2.1.9-.9 2.1-.9h22q1.2 0 2.1.9.9.9.9 2.1v28q0 1.2-.9 2.1-.9.9-2.1.9Zm0-3h22v-28H15v28Zm0 0v-28 28Z'/></svg></div><input type='text' value='#" + c + "' disabled></div>";
        }
    
        resultWrapper.innerHTML = div;
    
    },

    setHex: hex => {
        hex = hex.replace('#', '');
        scheme.from_hex(hex);
        BRXC.generateColors();
     },
     
     setScheme: newScheme => {
        scheme.scheme(newScheme);
        BRXC.generateColors();
     },
    
     setVariation: variation => {
        scheme.variation(variation);
        BRXC.generateColors();
     },
     
     setDistance: distance => {
        scheme.distance(distance);
        BRXC.generateColors();
     },

     displayDistance: value => {
        const distance = document.querySelector('.distance-wrapper');
        (value == 'monochromatic' || value == 'contrast') ? distance.style.display = "none": distance.style.display = "block";
     },

     //Lab Color
    labGenerateColor: () => {
        const initialValueCnt = document.querySelector('.brxc-modal__lab .brxc-modal__inner--content > .brxc-modal__field');
        const color = initialValueCnt.querySelector('input[type="color"]');
        const text = initialValueCnt.querySelector('input[type="text"]');
        const brightness = document.querySelector('.brightness-range #brightness');
        const saturation = document.querySelector('.saturation-range #saturation');
        const luminance = document.querySelector('.luminance-range #luminance');
        const luminanceText = document.querySelector('.luminance-range #luminanceValue');
        const labColor1 = document.querySelector('.brxc-modal__lab #resultLabColor1');
        const labText1 = document.querySelector('.brxc-modal__lab #resultLabText1');
        const labColor2 = document.querySelector('.brxc-modal__lab #resultLabColor2');
        const labText2 = document.querySelector('.brxc-modal__lab #resultLabText2');
        let hex = color.value;
        hex = chroma(hex).set("hsl.l", '*' + brightness.value).set("hsl.s", '*' + saturation.value);
        luminance.value = hex.luminance();
        labColor1.value = hex;
        labText1.value = hex;
        luminanceText.innerHTML = (parseFloat(hex.luminance()) * 100).toFixed(0) + '%';
        labColor2.value = hex;
        labText2.value = hex;
    },

    labGenerateColorLuminance: () => {
        const luminance = document.querySelector('.luminance-range #luminance');
        const labColor1 = document.querySelector('.brxc-modal__lab #resultLabColor1');
        const labColor2 = document.querySelector('.brxc-modal__lab #resultLabColor2');
        const labText2 = document.querySelector('.brxc-modal__lab #resultLabText2');
        let hex = chroma(labColor1.value).luminance(parseFloat(luminance.value));
        labColor2.value = hex;
        labText2.value = hex;
     },

     formatConvertedColor: (col, arr) => {
        let color = col + '(';
        if (col === 'rgb') {
           color += parseInt(arr[0]).toFixed(0) + ',';
           color += parseFloat(arr[1]).toFixed(0) + ',';
           color += parseFloat(arr[2]).toFixed(0);
        } else if (col === 'rgba') {
           color += parseInt(arr[0]).toFixed(0) + ',';
           color += parseFloat(arr[1]).toFixed(0) + ',';
           color += parseFloat(arr[2]).toFixed(0) + ',1';;
        } else if (col === 'hsla') {
           color += parseInt(arr[0]) + ',';
           color += parseFloat(arr[1]).toFixed(2) + ',';
           color += parseFloat(arr[2]).toFixed(2) + ',1';;
        } else if (col === "hsl" || col === "hsv" || col === "hsi") {
           color += parseInt(arr[0]) + ',';
           color += parseFloat(arr[1]).toFixed(2) + ',';
           color += parseFloat(arr[2]).toFixed(2);
        } else {
           color += parseFloat(arr[0].toFixed(2)) + ',';
           color += parseFloat(arr[1]).toFixed(2) + ',';
           color += parseFloat(arr[2]).toFixed(2);
        }
        color += ')';
        return color;
     },

     // ConvertColor
    convertHexColor: hex => {
        let num;
        const wrapper = document.querySelector('.brxc__converted-wrapper');
        const rgb = wrapper.querySelector('#rgbConvertText');
        const rgba = wrapper.querySelector('#rgbaConvertText');
        const hsl = wrapper.querySelector('#hslConvertText');
        const hsla = wrapper.querySelector('#hslaConvertText');
        const hsv = wrapper.querySelector('#hsvConvertText');
        const hsi = wrapper.querySelector('#hsiConvertText');
        const lab = wrapper.querySelector('#labConvertText');
        const oklab = wrapper.querySelector('#oklabConvertText');
        const lch = wrapper.querySelector('#lchConvertText');
        const hcl = wrapper.querySelector('#hclConvertText');
        const oklch = wrapper.querySelector('#oklchConvertText');
        const gl = wrapper.querySelector('#glConvertText');
        rgb.value = BRXC.formatConvertedColor('rgb', chroma(hex).rgb());
        rgba.value = BRXC.formatConvertedColor('rgba', chroma(hex).rgb());
        hsl.value = BRXC.formatConvertedColor('hsl', chroma(hex).hsl());
        hsla.value = BRXC.formatConvertedColor('hsla', chroma(hex).hsl());
        hsv.value = BRXC.formatConvertedColor('hsv', chroma(hex).hsv());
        hsi.value = BRXC.formatConvertedColor('hsi', chroma(hex).hsi());
        lab.value = BRXC.formatConvertedColor('lab', chroma(hex).lab());
        oklab.value = BRXC.formatConvertedColor('oklab', chroma(hex).oklab());
        lch.value = BRXC.formatConvertedColor('lch', chroma(hex).lch());
        hcl.value = BRXC.formatConvertedColor('hcl', chroma(hex).hcl());
        oklch.value = BRXC.formatConvertedColor('oklch', chroma(hex).oklch());
        gl.value = BRXC.formatConvertedColor('gl', chroma(hex).gl());
    },

    // Scale Generator
 
    displayGradientDegree: value => {
        const gradient = document.querySelector('.gradientdegree-wrapper');
        (value == 'circle' || value == 'ellipse') ? gradient.style.display = "none": gradient.style.display = "block";
    },

    displayGradientPosition: value => {
        const position = document.querySelector('.gradientposition-wrapper');
        (value == 'linear') ? position.style.display = "none": position.style.display = "block";
    },

    scaleGenerateArray: () => {
        const wrapper = document.querySelector('#colorsScale');
        const num = document.querySelector('#scaleNumColors').value;
        const resultWrapper = document.querySelector('#scaleArrResult');
        const arr = [];
        wrapper.querySelectorAll('input[type="color"]').forEach(color => arr.push(color.value));
        const colors = chroma.scale(arr).colors(num);
        resultWrapper.innerHTML = '';
        const deg = document.querySelector('#gradientDegree').value;
        const gradient = document.querySelector('input[name="gradienttype"]:checked').dataset.value;
        const position = document.querySelector('input[name="gradientposition"]:checked').dataset.value;
        let css;
        if (gradient == 'linear') {
           css = "linear-gradient(" + deg + "deg,";
        } else if (gradient == 'circle') {
           css = "radial-gradient(circle " + position + ",";
        } else {
           css = "radial-gradient(ellipse " + position + ",";
        }
        colors.forEach((color, index) => {
           const div = '<div class="color-wrapper brxc-modal__field generated-color-wrapper"><input type="color" value="' + color + '" disabled><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" class="brxc__svg-path green" onClick="BRXC.copyColortoClipboard(event.target);"><path d="M9 43.95q-1.2 0-2.1-.9-.9-.9-.9-2.1V10.8h3v30.15h23.7v3Zm6-6q-1.2 0-2.1-.9-.9-.9-.9-2.1v-28q0-1.2.9-2.1.9-.9 2.1-.9h22q1.2 0 2.1.9.9.9.9 2.1v28q0 1.2-.9 2.1-.9.9-2.1.9Zm0-3h22v-28H15v28Zm0 0v-28 28Z"/></svg><input type="text" value="' + color + '" disabled></div>';
           resultWrapper.innerHTML += div;
           css += color;
           (index == colors.length - 1) ? '' : css += ",";
        })
        css += ")";
        document.querySelector('#scalePreview').style.background = css;
        const code = 'background: ' + css;
        document.querySelector('#scaleCssCode').innerHTML = code;
     },

     // Export - Copy to clipboard
    copyJSONtoClipboard: target => {
        const code = document.querySelector('#ExportJSONCode').innerHTML;
        BRXC.copyValuetoClipboard(code);
        setTimeout(() => {
        target.innerHTML = "Copied!";
        target.classList.add('active');
        }, setTimeout(() => {
        target.innerHTML = "Copy JSON to Clipboard";
        target.classList.remove('active');
        }, 2000))
    },
    
    copyCSStoClipboard: target => {
        const code = document.querySelector('#ExportCSSCode').innerHTML;
        BRXC.copyValuetoClipboard(code);
        setTimeout(() => {
        target.innerHTML = "Copied!";
        target.classList.add('active');
        }, setTimeout(() => {
        target.innerHTML = "Copy CSS to Clipboard";
        target.classList.remove('active');
        }, 2000))
    },
    
    // Typography
    setClampValue: target => {
        const parent = target.closest('.brxc-modal__field');
        const clr = parent.querySelectorAll('input[type="number"]');
        const minFont = clr[0].value;
        const maxFont = clr[1].value;
        const prefix = clr[0].dataset.prefix;
    
        const sheet = BRXC.getSetStyleRule('bricks-advanced-themer');
        sheetRule = [...sheet.cssRules].find((r) => r.selectorText === "html body");

        if (prefix) return sheetRule.style.setProperty('--' + prefix + '-' + clr[0].dataset.label, BRXC.clampBuilder(parseInt(clr[0].dataset.baseFont), parseInt(clr[0].dataset.minVw), parseInt(clr[0].dataset.maxVw), parseInt(minFont), parseInt(maxFont)));
        return sheetRule.style.setProperty('--' + clr[0].dataset.label, BRXC.clampBuilder(parseInt(clr[0].dataset.baseFont), parseInt(clr[0].dataset.minVw), parseInt(clr[0].dataset.maxVw), parseInt(minFont), parseInt(maxFont)));
    },

    // Grids
    setGridValue: (target, label, selector, unit) => {
      const els = document.querySelectorAll('.' + label);
      if (els.length < 1) return;

      els.forEach(el => {
         el.style.setProperty(selector, target.value + unit);
      });
    },

    //
    activeClassHighlight: (target) => {
      const activeEls = document.querySelectorAll('.brxc-class-used');
      activeEls.forEach(el => {
         el.classList.remove('brxc-class-used');
      })

      if (target.classList.contains('active') === true ) {
         return target.classList.remove('active');
      } else {
         const classBtns = document.querySelectorAll('.brxc-modal__classes .class-button-wrapper a.class-button');
         classBtns.forEach(el=> el.classList.remove('active'));
         target.classList.add('active');
         const els = document.querySelectorAll(target.dataset.class);
         if (els.length < 1) return;
         els.forEach(el => {
            el.classList.add('brxc-class-used');

         })
      }
    }
 }
 
 window.addEventListener('DOMContentLoaded', () => {
    // Variables
    const body = document.body;
    const btn = document.querySelector('.brxc-modal__button');
    const overlay = document.querySelector('.brxc-modal__overlay');
    const closeBtn = document.querySelector('.brxc-export__close-btn');
    const contrastBtn = document.querySelector('.brxc-modal__contrast');
    const exportBtn = document.querySelector('.brxc-modal__export');
    const inner = document.querySelector('.brxc-modal__inner');
    const allInputs = document.querySelectorAll('.brxc-modal__inner input');
    // Darkmode vars
    const darkmodeCookie = localStorage.getItem("brxc-theme");
    const darkmodeCheckbox = document.querySelector('.toggle-checkbox');
    const darkmodeToggles = document.querySelectorAll('.brxe-brxc-darkmode-toggle, .brxe-brxc-darkmode-btn');
    // Header buttons
    const headerBtns = document.querySelectorAll('.brxc-modal__header--btn.brxc-panel');
    // Left menu
    const menuItems = document.querySelectorAll('.brxc-modal__menu-item.transformable');
    const menuColor = document.querySelector('.brxc-modal__menu-item.color');
    // Default color palette generator
    const baseColor = document.querySelector('.brxc-modal__generator input[type="color"]');
    // Scale vars
    const scaleWrapper = document.querySelector('#colorsScale');
    const scaleAddColor = document.querySelector('#ScaleAddColor');
    let wrappers = scaleWrapper.querySelectorAll('#colorsScale .color-wrapper.delete');
    let clone = wrappers[wrappers.length - 1].cloneNode(true);
    // Imported Classes
    const preCodes = document.querySelectorAll('.brxc-modal__classes pre.imported-classes-code');
    const classBtns = document.querySelectorAll('.brxc-modal__classes .class-button-wrapper a.class-button');
    
    // Remove no-transition after the dom is loaded
    document.querySelector('.brxc-modal.no-transition-on-load').classList.remove('no-transition-on-load');
 
    // Toggle modal whtn the setting icon is clicked
    btn.addEventListener('click', () => {
       if (BRXC.isModalOpen === true) {
          body.classList.remove('brxc-modal--open');
          BRXC.isModalOpen = false;
       } else {
          body.classList.add('brxc-modal--open');
          BRXC.isModalOpen = true;;
       }
    })
 
    // Close modal on overlay click
    overlay.addEventListener('click', () => {
       if (BRXC.isModalOpen === true && BRXC.isExportOpen === false) {
          body.classList.remove('brxc-modal--open');
          BRXC.isModalOpen = false;
       } else if (BRXC.isModalOpen === true && BRXC.isExportOpen === true) {
          BRXC.isExportOpen = false;
          overlay.classList.remove('active');
       }
       overlay.classList.remove('active');
    })

    // Stop Modal Propagation
    document.querySelector('.brxc-modal__export-modal').addEventListener('click', (e) => {
       e.stopPropagation();
    })

    closeBtn.addEventListener('click', () => {
       if (BRXC.isModalOpen === true && BRXC.isExportOpen === true) {
          BRXC.isExportOpen = false;
          overlay.classList.remove('active');
       }
    })
 
 
    // Dark mode
 
    if (darkmodeCookie === 'dark') {
       const darkmodeCheckbox = document.querySelector('.toggle-checkbox');
       darkmodeCheckbox.checked = true;
       inner.classList.add('active');
       BRXC.isDarkMode = true;
    }
    if (darkmodeCheckbox){
      darkmodeCheckbox.addEventListener('change', () => {
         if (body.classList.contains('brxc-dark')) {
            body.classList.remove('brxc-dark');
            inner.classList.remove('active');
            inner.style.transform = "translateX(calc(var(--modal-width) * -5))";
            darkmodeToggles.forEach(cb => {
               cb.querySelector('input.brxc-toggle-checkbox').checked = false;
            });
            headerBtns.forEach(btns => btns.classList.remove('active'));
            menuItems.forEach(btns => btns.classList.remove('active'));
            menuColor.classList.add('active');
            BRXC.isDarkMode = false;
            BRXC.currentTransform = -5;
         } else {
            body.classList.add('brxc-dark');
            inner.classList.add('active');
            inner.style.transform = "translateX(calc(var(--modal-width) * -6))";
            darkmodeToggles.forEach(cb => {
               cb.querySelector('input.brxc-toggle-checkbox').checked = true;
            });
            headerBtns.forEach(btns => btns.classList.remove('active'));
            menuItems.forEach(btns => btns.classList.remove('active'));
            menuColor.classList.add('active');
            BRXC.isDarkMode = true;
            BRXC.currentTransform = -6;
         }
      })
    }
    
    if(darkmodeToggles.length > 0){
      darkmodeToggles.forEach(toggle => {
         toggle.addEventListener('change', () => {
            if (body.classList.contains('brxc-dark')) {
               darkmodeCheckbox.checked = true;
               body.classList.add('brxc-dark');
               inner.classList.add('active');
               BRXC.isDarkMode = true;
            } else {
               darkmodeCheckbox.checked = false;
               body.classList.remove('brxc-dark');
               inner.classList.remove('active');
               BRXC.isDarkMode = false;
            }
         })
      })
    }
    
    // Header buttons
    headerBtns.forEach(btn => {
       btn.addEventListener('click', () => {
          if (btn.classList.contains('active')) {
             btn.classList.remove('active');
             inner.style.transform = "translateX(calc(var(--modal-width) * " + BRXC.currentTransform + "))";
          } else {
             const transform = btn.dataset.transform;
             headerBtns.forEach(btns => btns.classList.remove('active'));
             btn.classList.add('active');
             inner.style.transform = "translateX(calc(var(--modal-width) * " + transform + "))";
          }
       })
    })

    // Left menu
    menuItems.forEach(btn => {
       btn.addEventListener('click', () => {
          if (btn.classList.contains('active')) {
             return;
          } else {
             const transform = btn.dataset.transform;
             menuItems.forEach(btns => btns.classList.remove('active'));
             headerBtns.forEach(btns => btns.classList.remove('active'));
             (menuColor) ? menuColor.classList.remove('active') : '';
             btn.classList.add('active');
             inner.style.transform = "translateX(calc(var(--modal-width) * " + transform + "))";
             BRXC.currentTransform = transform;
          }
       })
    })

    // Color menu item
    if(menuColor){
      menuColor.addEventListener('click', () => {
         if (btn.classList.contains('active')) {
            return;
         } else {
            menuItems.forEach(btns => btns.classList.remove('active'));
            headerBtns.forEach(btns => btns.classList.remove('active'));
            menuColor.classList.add('active');
            inner.style.transform = "";
            (body.classList.contains('brxc-dark')) ? BRXC.currentTransform = -6: BRXC.currentTransform = -5;
         }
      })
    }
 
    /* Init Accordion*/
    BRXC.initAcc('.accordion.v1', true);
 
    /* Export function */
    if(exportBtn){
      exportBtn.addEventListener('click', () => {
         const activePaletteJSON = document.querySelector('#colorPaletteJson').value;
         const activePaletteCSS = document.querySelector('#colorPaletteCss').value;
         document.querySelector('#ExportJSONCode').innerHTML = BRXC.exportValuesToJSON(activePaletteJSON);
         document.querySelector('#ExportCSSCode').innerHTML = BRXC.exportValuesToCSS(activePaletteCSS);
         BRXC.isExportOpen = true;
         overlay.classList.add('active');
      })
    }
    
    // Contrast Checker
    const contrastCheck = BRXC.debounce(() => {
       contrast.check();
    }, 300);
 
    const addListenerToInputs = () => {
       allInputs.forEach(input => {
          input.addEventListener('input', contrastCheck);
       })
    }

    const removeListenerToInputs = () => {
       allInputs.forEach(input => {
          input.removeEventListener('input', contrastCheck);
       })
    }

    contrastBtn.addEventListener('click', () => {
       if (contrastBtn.classList.contains('active')) {
          contrastBtn.classList.remove('active');
          const failedEls = document.querySelectorAll('.brxc-contrast-failed');
          failedEls.forEach(el => el.classList.remove('brxc-contrast-failed'))
          removeListenerToInputs();
       } else {
          contrastBtn.classList.add('active');
          contrastCheck();
          addListenerToInputs();
       }
    })

    // Set Default color palette generator on load
    BRXC.setHex(baseColor.value);
 
    // Set Default Lab Color on load
    BRXC.labGenerateColor();
 
    // Set Default Convertor color on load
    BRXC.convertHexColor(document.querySelector('#ConvertColor').value);
 
    // Scale
    scaleAddColor.addEventListener('click', () => {
       scaleWrapper.insertBefore(clone, scaleAddColor);
       BRXC.scaleGenerateArray();
       wrappers = scaleWrapper.querySelectorAll('#colorsScale .color-wrapper.delete');
       clone = wrappers[wrappers.length - 1].cloneNode(true);
    })
    
    // Set default scale on load
    BRXC.scaleGenerateArray();
 
    // Isotope
 
    let qsRegex;
 
    // init Isotope
    const panels = document.querySelectorAll('.brxc-modal__inner > div');

    panels.forEach(panel => {
      content = panel.querySelector('.brxc-modal__inner--content');

      if (!content) return;
      const iso = new Isotope(content, {
         itemSelector: '.isotope-wrapper',
         layoutMode: 'fitRows',
         filter: (itemElem1, itemElem2) => {
            const itemElem = itemElem1 || itemElem2;
            return qsRegex ? itemElem.textContent.match(qsRegex) : true;
         },
      })

      const isoSearch = panel.querySelector('input[type="search"].iso-search');

      if (!isoSearch) return;
      isoSearch.addEventListener('keyup', BRXC.debounce(() => {
         qsRegex = new RegExp(isoSearch.value, 'gi');
         iso.arrange();
      }, 100));
      
    })
 
 
    // Sortable JS
 
    const sortable = new Sortable(scaleWrapper, {
       animation: 150,
       handle: ".generated-color-wrapper.delete",
       filter: ".add-color",
       onChange: () => {
        BRXC.scaleGenerateArray()
       },
       onMove: (evt) => {
          return evt.related.className.indexOf('add-color') === -1; // returns false when the .exclude is about to be moved
       }
    })

    // Highlight JS

    preCodes.forEach((el) => {
      hljs.highlightElement(el);
   });

   // Active imported Classes
   
   classBtns.forEach(btn => {
      const activeClass = document.querySelectorAll('body > *:not(.brxc-modal) ' + btn.dataset.class);
      if (activeClass.length < 1) return btn.innerHTML = btn.innerHTML + ' (0)';;
      btn.classList.add('used');
      btn.innerHTML = btn.innerHTML + ' (' + activeClass.length + ')';
   })

   var endTime = performance.now()
   console.log(`Javascript Time Execution:  ${endTime - BRXC.startTime} milliseconds`)

})