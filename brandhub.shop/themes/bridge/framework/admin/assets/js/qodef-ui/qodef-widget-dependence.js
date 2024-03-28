(function($) {
    "use strict";

    $(document).ready(function(){
        qodeInitWidgetFieldColorPicker();
    });

    $(window).on('load', function() {
        qodeButtonWidgetFieldDependency();
        qodeIconWithTextWidgetFieldDependency();
        qodeIconListItemWidgetFieldDependency();
    });

    $( document ).on( 'widget-added widget-updated', function(event, widget){
        qodeColorPickeronFormUpdate(event, widget);
        qodeButtonWidgetFieldDependency();
        qodeIconWithTextWidgetFieldDependency();
        qodeIconListItemWidgetFieldDependency();
    });

    function qodeInitColorPicker(widget) {
        if (widget.find('.wp-picker-container').length <= 0) {
            widget.find('input.qode-color-picker-field').wpColorPicker({
                change: _.throttle(function () { // For Customizer
                    $(this).trigger('change');
                }, 3000)
            });
        }
    }

    function qodeColorPickeronFormUpdate( event, widget ) {
        qodeInitColorPicker( widget );
    }

    function qodeInitWidgetFieldColorPicker() {
        var colorPicker = $('.qode-widget-color-picker');

        if (colorPicker.length && colorPicker.find('.wp-picker-container').length <= 0) {
            colorPicker.each(function(){
                var thisColorPicker = $(this),
                    listParent = thisColorPicker.parents('#widget-list');

                //do not initiate color picker if in widget list
                if (listParent.length <= 0){
                    qodeInitColorPicker( thisColorPicker );
                }
            });
        }
    }

    /**
     * Render field dependency for Button Widget
     */
    function qodeButtonWidgetFieldDependency() {
        var iconPacks = {
            'font_awesome': 'icon',
            'font_elegant': 'fe_icon',
            'ion_icons': 'ion_icon',
            'linea_icons': 'linea_icon',
            'linear_icons': 'linear_icon',
            'simple_line_icons': 'simple_line_icon',
            'dripicons': 'dripicon',
            'kiko': 'kiko'
        };

        qodeUpdateWidgetSelection('qode_button', 'icon_pack', iconPacks);
    }

    /**
     * Render field dependency for Icon With Text Widget
     */
    function qodeIconWithTextWidgetFieldDependency() {
        var iconPacks = {
            'font_awesome': 'icon',
            'font_elegant': 'fe_icon',
            'ion_icons': 'ion_icon',
            'linea_icons': 'linea_icon',
            'linear_icons': 'linear_icon',
            'simple_line_icons': 'simple_line_icon',
            'dripicons': 'dripicon',
            'kiko': 'kiko'
        };

        qodeUpdateWidgetSelection('qode_icon_with_text', 'icon_pack', iconPacks);
    }

    /**
     * Render field dependency for Icon List Item Widget
     */
    function qodeIconListItemWidgetFieldDependency() {
        var iconPacks = {
            'font_awesome': 'icon',
            'font_elegant': 'fe_icon',
            'ion_icons': 'ion_icon',
            'linea_icons': 'linea_icon',
            'linear_icons': 'linear_icon',
            'simple_line_icons': 'simple_line_icon',
            'dripicons': 'dripicon',
            'kiko': 'kiko'
        };

        qodeUpdateWidgetSelection('qode_icon_list_item', 'icon_pack', iconPacks);
    }

    /**
     * Function that shows/hides fields based on selection
     *
     * @param string widgetId is unique id of widget
     * @param string optionName is widget option name which trigger dependency
     * @param object optionDependencyArray is object where keys are values of option with dependency and values are options you want to show/hide
     */
    function qodeUpdateWidgetSelection(widgetId, optionName, optionDependencyArray) {
        qodeWidgetFields(widgetId, optionName, optionDependencyArray);

        $('body').on('change', 'select[name*="'+widgetId+'"]', function() {
            if( $(this).attr('name').search(optionName) !== -1 ) {
                var thisWidget    = $(this).closest('.widget'),
                    selectedValue = $(this).find('option:selected').val();

                qodeHideFields(thisWidget, optionDependencyArray);
                qodeShowFields(thisWidget, optionDependencyArray, selectedValue);
            }
        });
    }

    /**
     * Core function which initialy loops for dependancy fields and hide non-selected ones
     *
     * @param string widgetId is unique id of widget
     * @param string optionName is widget option name which trigger dependency
     * @param object optionDependencyArray is object where keys are values of option with dependency and values are options you want to show/hide
     */
    function qodeWidgetFields(widgetId, optionName, optionDependencyArray) {
        $('div[id*="'+widgetId+'"]').each(function(){
            var selectedValue = $(this).find('select[id*="'+optionName+'"]').val(),
                saveButton = $(this).find('.widget-control-save');

            saveButton.on('click', {widget: $(this), optionDependencyArray: optionDependencyArray, optionName: optionName}, qodeTrackAjaxChange);

            qodeHideFields($(this), optionDependencyArray);
            qodeShowFields($(this), optionDependencyArray, selectedValue);
        });
    }

    /**
     * Core function which hides non selected fields and shows selected one
     *
     * @param object thisWidget is current widget
     * @param object optionDependencyArray is object where keys are values of option with dependency and values are options you want to show/hide
     */
    function qodeHideFields(thisWidget, optionDependencyArray) {
        $.each(optionDependencyArray, function(key, value) {
            if( typeof value === 'string' ) {
                thisWidget.find('[name*="[' + value + ']"]').parent().hide();
            } else if (typeof value === 'object') {
                $.each(value, function(arrayKey, arrayValue){
                    thisWidget.find('[name*="['+arrayValue+']"]').parent().hide();
                });
            }
        });
    }

    /**
     * Core function which shows non selected fields and shows selected one
     *
     * @param object thisWidget is current widget
     * @param object optionDependencyArray is object where keys are values of option with dependency and values are options you want to show/hide
     * @param string/object selectedValue is selected value of optionName
     */
    function qodeShowFields(thisWidget, optionDependencyArray, selectedValue) {
        if( typeof optionDependencyArray[selectedValue] === 'string' ) {
            thisWidget.find('[name*="['+optionDependencyArray[selectedValue]+']"]').parent().show();
        } else {
            $.each(optionDependencyArray[selectedValue], function(key, value){
                thisWidget.find('[name*="['+value+']"]').parent().show();
            });
        }
    }

    /**
     * Core function which checks for spinner once a save button is clicked
     */
    function qodeTrackAjaxChange(event) {
        var widget = event.data.widget,
            optionDependencyArray = event.data.optionDependencyArray,
            optionName = event.data.optionName,
            spinner = widget.find('.spinner');

        var timer = setInterval(function(){
            if( spinner.hasClass('is-active') ) {
                clearInterval(timer);
                qodeAfterAjaxReset(widget, optionName, spinner, optionDependencyArray);
            }
        }, 20);
    }

    /**
     * Core function which runs after ajax save is reloaded
     *
     * @param object thisWidget is current widget
     * @param string optionName is widget option name which trigger dependency
     * @param object spinner is native widget spinner when you click to save widget
     * @param object optionDependencyArray is object where keys are values of option with dependency and values are options you want to show/hide
     */
    function qodeAfterAjaxReset(thisWidget, optionName, spinner, optionDependencyArray) {
        var timer = setInterval(function(){
            if( ! spinner.hasClass('is-active') ) {
                var selectedValue = thisWidget.find('select[id*="'+optionName+'"]').val();

                clearInterval(timer);
                qodeHideFields(thisWidget, optionDependencyArray);
                qodeShowFields(thisWidget, optionDependencyArray, selectedValue);
            }
        }, 20);
    }

})(jQuery);