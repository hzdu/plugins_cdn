function downloadObjectAsJson(exportObj, exportName){
    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObj));
    var downloadElement = document.createElement('a');
    downloadElement.setAttribute("href", dataStr);
    downloadElement.setAttribute("download", exportName);
    downloadElement.style.display = 'none';
    document.body.appendChild(downloadElement)
    downloadElement.click();
    document.body.removeChild(downloadElement);
}

jQuery(document).ready(function($){

    const form = '<input type="file" id="brxcImportFile" name="filename" accept="application/JSON"><a href="#" id="brxcImportSubmit" class="button button-primary button-large button-disabled">Import Theme Settings</a>';
    $('#brxcImportWrapper').append(form);
    const file = document.querySelector('#brxcImportFile');
    const submit = document.querySelector('#brxcImportSubmit');
    file.addEventListener('change', () => {
        (file.files.length) ? submit.classList.remove('button-disabled') : submit.classList.add('button-disabled');
    })

    $('#brxcExportSettings').click(function(e) {
        e.preventDefault();

        $.ajax({
            url: exportOptions.ajax_url, 
            method: "POST",
            dataType: "JSON",
            data: {
                action: "export_advanced_options",
                nonce: exportOptions.nonce 
            },
            success: function(data) {
                if (Object.keys(data).length > 0) {
                    downloadObjectAsJson(data, 'export_at_theme_settings.json');
                } else {
                    console.log('No AT data found');
                }
            },
            error: function() {
                console.log("Error fetching data from wp_options table");
            }
        });
    });

    $('#brxcImportSubmit').click(function(e) {
        e.preventDefault();

        const file = $('#brxcImportFile')[0].files[0];
        if (typeof file === "undefined") {
            alert('No file imported. Please select a JSON export file.');
            return false;
        }

        // Create a FormData object
        const formData = new FormData();
        formData.append('action', 'import_advanced_options');
        formData.append('nonce', exportOptions.nonce);
        formData.append('file', file);
        $.ajax({
            url: exportOptions.ajax_url, 
            method: "POST",
            dataType: "JSON",
            data: formData, // Use formData as data
            processData: false, // Tell jQuery not to process the data
            contentType: false, // Tell jQuery not to set contentType
            success: function(response) {
                console.log("Response object:", response);
                console.log("Debug information:", response.debug);
                location.reload();
            },
            error: function(response) {
                console.log("Error fetching data from wp_options table");
            }
        });
    });
    $('#brxcResetSettings').click(function(e) {
        e.preventDefault();

        $.ajax({
            url: exportOptions.ajax_url, 
            method: "POST",
            dataType: "JSON",
            data: {
                action: "reset_advanced_options",
                nonce: exportOptions.nonce 
            },
            success: function(data) {
                console.log(data);
                location.reload();
            },
            error: function() {
                console.log("Error fetching data from wp_options table");
            }
        });
    });
})


window.addEventListener('DOMContentLoaded', () => {
    //open tab with URL hash

    const url = new URL(window.location.href); 
    const anchorID = url.hash.substring(1);
    const link = document.querySelector(`[data-key="${anchorID}"]`); 
    if (link) link.click();

    document.querySelectorAll('body.bricks_page_bricks-advanced-themer .acf-repeater .acf-field .acf-input').forEach(function(el) {
        if (el.querySelector('.acf-input-append')) {
            el.classList.add('has-append');
        }
    });
});

window.addEventListener('DOMContentLoaded', () => {
    const adminOption = document.querySelector('#acf-field_63daa58ccc209-field_6388e73289b6a-administrator');
    if (!adminOption) return;
    adminOption.setAttribute('disabled','');
    adminOption.setAttribute('checked','');

    //Clamp builder
    const clampBuilder = (baseFont, minWidthPx, maxWidthPx, minFontSize, maxFontSize) => {
 
        const minWidth = minWidthPx / baseFont;
        const maxWidth = maxWidthPx / baseFont;
     
        const slope = (maxFontSize - minFontSize) / (maxWidth - minWidth);
        const yAxisIntersection = -minWidth * slope + minFontSize;
     
        return `clamp( ${ minFontSize / baseFont  }rem, ${ yAxisIntersection / baseFont  }rem + ${ slope / baseFont * 100 }vw, ${ maxFontSize / baseFont }rem )`;
     }

     // Typography
    const setClampValue =  (minFont, maxFont, target, type) => {
        if (type === 'font-size'){
            (target) ? target.style.fontSize = clampBuilder(parseInt(baseFont.value), parseInt(minViewport.value), parseInt(maxViewport.value), parseInt(minFont), parseFloat(maxFont)) : '';
        } else if (type === 'spacing'){
            (target) ? target.style.gap = clampBuilder(parseInt(baseFont.value), parseInt(minViewport.value), parseInt(maxViewport.value), parseInt(minFont), parseFloat(maxFont)) : '';
        } else if (type === 'border'){
            (target) ? target.style.borderRadius = clampBuilder(parseInt(baseFont.value), parseInt(minViewport.value), parseInt(maxViewport.value), parseInt(minFont), parseFloat(maxFont)) : '';
        } else if (type === 'width'){
            (target) ? target.style.width = clampBuilder(parseInt(baseFont.value), parseInt(minViewport.value), parseInt(maxViewport.value), parseInt(minFont), parseFloat(maxFont)) : '';
        }
        
    }

    // //Const

    // let typeRepeaterRows = document.querySelectorAll('.acf-field-repeater.typography-repeater .acf-row:not(.acf-clone)');
    // const typeAddRow = document.querySelector('.acf-field-repeater.typography-repeater .acf-actions > a[data-event="add-row"]');
    // let spaceRepeaterRows = document.querySelectorAll('.acf-field-repeater.spacing-repeater .acf-row:not(.acf-clone)');
    // const spaceAddRow = document.querySelector('.acf-field-repeater.spacing-repeater .acf-actions > a[data-event="add-row"]');
    // let borderRepeaterRows = document.querySelectorAll('.acf-field-repeater.border-repeater .acf-row:not(.acf-clone)');
    // const borderAddRow = document.querySelector('.acf-field-repeater.border-repeater .acf-actions > a[data-event="add-row"]');

    // //On Load
    let baseFont = document.querySelector('.base-font input[type="number"]');
    let minViewport = document.querySelector('.min-viewport input[type="number"]');
    let maxViewport = document.querySelector('.max-viewport input[type="number"]');
    const typographyFN = (row) => {
        const arr = [];
        const minValue = row.querySelector('[data-name="brxc_typography_min_value"] input')
        arr.push(minValue);
        const maxValue = row.querySelector('[data-name="brxc_typography_max_value"] input')
        arr.push(maxValue);
        const preview = row.querySelector('.typography-preview')
        setClampValue(minValue.value, maxValue.value, preview, 'font-size');
        arr.forEach(el => {
            ['change', 'input'].forEach(event => {
                el.addEventListener(event, () => {
                    const minValue = row.querySelector('[data-name="brxc_typography_min_value"] input').value
                    const maxValue = row.querySelector('[data-name="brxc_typography_max_value"] input').value
                    setClampValue(minValue, maxValue, preview, 'font-size');
                })
            })
        })
    }
    const spacingFN = (row) => {
        const arr = [];
        const minValue = row.querySelector('[data-name="brxc_spacing_min_value"] input')
        arr.push(minValue);
        const maxValue = row.querySelector('[data-name="brxc_spacing_max_value"] input')
        arr.push(maxValue);
        const preview = row.querySelector('.spacing-preview')
        setClampValue(minValue.value, maxValue.value, preview, 'spacing');
        arr.forEach(el => {
            ['change', 'input'].forEach(event => {
                el.addEventListener(event, () => {
                    const minValue = row.querySelector('[data-name="brxc_spacing_min_value"] input').value
                    const maxValue = row.querySelector('[data-name="brxc_spacing_max_value"] input').value
                    setClampValue(minValue, maxValue, preview, 'spacing');
                })
            })
        })
    }
    const borderFN = (row) => {
        const value = row.querySelector('[data-name="brxc_border_simple_value"] input')
        const preview = row.querySelector('.border-preview')
        preview.style.border = value.value;
        ['change', 'input'].forEach(event => {
            value.addEventListener(event, () => {
                const value = row.querySelector('[data-name="brxc_border_simple_value"] input').value
                preview.style.border = 'none';
                preview.style.border = value;
            })
        })
    }
    const borderRadiusFN = (row) => {
        const arr = [];
        const minValue = row.querySelector('[data-name="brxc_border_min_value"] input')
        arr.push(minValue);
        const maxValue = row.querySelector('[data-name="brxc_border_max_value"] input')
        arr.push(maxValue);
        const preview = row.querySelector('.border-preview')
        setClampValue(minValue.value, maxValue.value, preview, 'border');
        arr.forEach(el => {
            ['change', 'input'].forEach(event => {
                el.addEventListener(event, () => {
                    const minValue = row.querySelector('[data-name="brxc_border_min_value"] input').value
                    const maxValue = row.querySelector('[data-name="brxc_border_max_value"] input').value
                    setClampValue(minValue, maxValue, preview, 'border');
                })
            })
        })
    }
    const boxShadowFN = (row) => {
        const value = row.querySelector('[data-name="brxc_box_shadow_value"] input')
        const preview = row.querySelector('.border-preview')
        preview.style.boxShadow = value.value;
        ['change', 'input'].forEach(event => {
            value.addEventListener(event, () => {
                const value = row.querySelector('[data-name="brxc_box_shadow_value"] input').value
                preview.style.boxShadow = 'none';
                preview.style.boxShadow = value;
            })
        })
    }
    const widthFN = (row) => {
        const arr = [];
        const minValue = row.querySelector('[data-name="brxc_width_min_value"] input')
        arr.push(minValue);
        const maxValue = row.querySelector('[data-name="brxc_width_max_value"] input')
        arr.push(maxValue);
        const preview = row.querySelector('.border-preview')
        setClampValue(minValue.value, maxValue.value, preview, 'width');
        arr.forEach(el => {
            ['change', 'input'].forEach(event => {
                el.addEventListener(event, () => {
                    const minValue = row.querySelector('[data-name="brxc_width_min_value"] input').value
                    const maxValue = row.querySelector('[data-name="brxc_width_max_value"] input').value
                    setClampValue(minValue, maxValue, preview, 'width');
                })
            })
        })
    }
    const setListener = (selector, customFN) => {
        const repeater = document.querySelector(selector)
        if (!repeater) return;
        const rows = repeater.querySelectorAll('.acf-row:not(.acf-clone)');
        if (rows.length < 1) return;
        rows.forEach(el => {
            if (el.dataset.listening === "true") return;
            el.setAttribute("data-listening", "true");
            customFN(el)
        })
        
    }
    const varGroup = document.querySelector('.acf-field-group.acf-field-6445ab9f3d498')
    if (!varGroup) return;

    setListener('[data-name="brxc_typography_variables_repeater"]',typographyFN);
    setListener('[data-name="brxc_spacing_variables_repeater"]',spacingFN);
    setListener('[data-name="brxc_border_variables_repeater"]',borderRadiusFN);
    setListener('[data-name="brxc_border_simple_variables_repeater"]',borderFN);
    setListener('[data-name="brxc_box_shadow_variables_repeater"]',boxShadowFN);
    setListener('[data-name="brxc_width_variables_repeater"]',widthFN);

    const observer = new MutationObserver(function(mutations) {
        setListener('[data-name="brxc_typography_variables_repeater"]',typographyFN);
        setListener('[data-name="brxc_spacing_variables_repeater"]',spacingFN);
        setListener('[data-name="brxc_border_variables_repeater"]',borderRadiusFN);
        setListener('[data-name="brxc_border_simple_variables_repeater"]',borderFN);
        setListener('[data-name="brxc_box_shadow_variables_repeater"]',boxShadowFN);
        setListener('[data-name="brxc_width_variables_repeater"]',widthFN);

    });
    observer.observe(varGroup, { subtree: true, childList: true });
    
})