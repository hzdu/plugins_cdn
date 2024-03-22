import UIkit from 'uikit';
import { isRtl, once, ready, swap } from 'uikit-util';
import { Header, Sticky } from './header';

UIkit.component('Header', Header);
UIkit.mixin(Sticky, 'sticky');

if (isRtl) {
    const mixin = {
        created() {
            this.$props.pos = swap(this.$props.pos, 'left', 'right');
        },
    };

    UIkit.mixin(mixin, 'drop');
    UIkit.mixin(mixin, 'tooltip');
}

once(document, 'uikit:init', () => {
    const { $theme: { i18n = {} } = {} } = window;
    for (const component in i18n) {
        UIkit.mixin({ i18n: i18n[component] }, component);
    }
});

ready(() => {
    const { $load = [], $theme = {} } = window;

    function load(stack, config) {
        stack.length && stack.shift()(config, () => load(stack, config));
    }

    load($load, $theme);
});
