import {KoComponentViewModel} from '../control-base.js';

/**
 * Base class for description components.
 */
export class AmeDescriptionComponent extends KoComponentViewModel<never> {
	public readonly description: string;

	constructor(params: any, $element: JQuery) {
		super(params, $element);
		this.description = params.description || '';
	}
}