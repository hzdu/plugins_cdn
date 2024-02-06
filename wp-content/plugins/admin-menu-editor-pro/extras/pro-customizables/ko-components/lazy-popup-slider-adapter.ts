/// <reference path="../../../customizables/assets/popup-slider.d.ts" />

/**
 * This is a wrapper for the popup slider that initializes the slider on first use.
 * It's useful for Knockout components.
 */
export class LazyPopupSliderAdapter {
	private slider: AmePopupSlider|null = null;

	/**
	 * Handler for a Knockout click event. It will initialize and show the slider.
	 */
	public readonly handleKoClickEvent: ($data: any, event: Event) => void;

	constructor(
		private readonly sliderRanges: AmePopupSliderRanges|null,
		private readonly containerSelector: string = '.ame-container-with-popup-slider',

		private readonly inputSelector: string = 'input',
		private readonly sliderOptions: AmePopupSliderOptions = {}
	) {
		if (!sliderOptions.hasOwnProperty('ranges')) {
			sliderOptions.ranges = sliderRanges;
		}

		this.handleKoClickEvent =  ($data, event) => {
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
				(this.slider as AmePopupSlider).showForInput($input);
			}
		}
	}

	/**
	 * Initialize the slider if it's not already initialized.
	 */
	private initSlider($container: JQuery) {
		if (this.slider) {
			return;
		}

		//In HTML, we would pass the range data as a "data-slider-ranges" attribute,
		//but here they are passed via the "ranges" option (see the constructor).
		this.slider = AmePopupSlider.createSlider($container, this.sliderOptions);
	}
}