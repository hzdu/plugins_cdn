/// <reference path="../../../customizables/assets/popup-slider.d.ts" />
/**
 * This is a wrapper for the popup slider that initializes the slider on first use.
 * It's useful for Knockout components.
 */
export class LazyPopupSliderAdapter {
    constructor(sliderRanges, containerSelector = '.ame-container-with-popup-slider', inputSelector = 'input', sliderOptions = {}) {
        this.sliderRanges = sliderRanges;
        this.containerSelector = containerSelector;
        this.inputSelector = inputSelector;
        this.sliderOptions = sliderOptions;
        this.slider = null;
        if (!sliderOptions.hasOwnProperty('ranges')) {
            sliderOptions.ranges = sliderRanges;
        }
        this.handleKoClickEvent = ($data, event) => {
            //Verify that this is one of the inputs we're interested in.
            //Also, disabled inputs should not trigger the slider.
            if (event.target === null) {
                return;
            }
            const $input = jQuery(event.target);
            if ($input.is(':disabled') || !$input.is(this.inputSelector)) {
                return;
            }
            //Short-circuit if the slider is already initialized.
            if (this.slider) {
                this.slider.showForInput($input);
                return;
            }
            //Some sanity checks.
            if (typeof AmePopupSlider === 'undefined') {
                return;
            }
            const $container = $input.closest(this.containerSelector);
            if ($container.length < 1) {
                return;
            }
            this.initSlider($container);
            if (this.slider !== null) {
                //TS doesn't realize that this.initSlider() will initialize the slider.
                this.slider.showForInput($input);
            }
        };
    }
    /**
     * Initialize the slider if it's not already initialized.
     */
    initSlider($container) {
        if (this.slider) {
            return;
        }
        //In HTML, we would pass the range data as a "data-slider-ranges" attribute,
        //but here they are passed via the "ranges" option (see the constructor).
        this.slider = AmePopupSlider.createSlider($container, this.sliderOptions);
    }
}
//# sourceMappingURL=lazy-popup-slider-adapter.js.map