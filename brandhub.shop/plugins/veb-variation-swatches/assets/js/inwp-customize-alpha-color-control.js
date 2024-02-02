var INWP_Customize_Alpha_Color_Control = {
    ready: function ready() {

        var control = this,
            updating = false,
            picker = void 0;

        picker = this.container.find('.inwp-color-picker');
        picker.val(control.setting()).wpColorPicker({
            change: function change() {
                updating = true;
                control.setting.set(picker.wpColorPicker('color'));
                updating = false;
            },
            clear: function clear() {
                updating = true;
                control.setting.set('');
                updating = false;
            }
        });

        control.setting.bind(function (value) {
            if (updating) {
                return;
            }
            picker.val(value);
            picker.wpColorPicker('color', value);
        });

        control.container.on('keydown', function (event) {
            var pickerContainer = void 0;
            if (27 !== event.which) {
                return;
            }
            pickerContainer = control.container.find('.wp-picker-container');
            if (pickerContainer.hasClass('wp-picker-active')) {
                picker.wpColorPicker('close');
                control.container.find('.wp-color-result').focus();
                event.stopPropagation(); 
            }
        });
    }
};

wp.customize.controlConstructor['inwp-alpha-color'] = wp.customize.Control.extend(INWP_Customize_Alpha_Color_Control);