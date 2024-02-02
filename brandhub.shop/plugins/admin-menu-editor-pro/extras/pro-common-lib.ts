class AmeActorAccessDictionary {
	items: { [actorId: string] : KnockoutObservable<boolean>; } = {};
	private readonly numberOfObservables: KnockoutObservable<number>;

	constructor(initialData?: AmeDictionary<boolean>) {
		this.numberOfObservables = ko.observable(0);
		if (initialData) {
			this.setAll(initialData);
		}
	}

	get(actor: string, defaultValue: boolean|null = null): boolean|null {
		if (this.items.hasOwnProperty(actor)) {
			return this.items[actor]();
		}
		this.numberOfObservables(); //Establish a dependency.
		return defaultValue;
	}

	set(actor: string, value: boolean) {
		if (!this.items.hasOwnProperty(actor)) {
			this.items[actor] = ko.observable(value);
			this.numberOfObservables(this.numberOfObservables() + 1);
		} else {
			this.items[actor](value);
		}
	}

	getAll(): AmeDictionary<boolean> {
		let result: AmeDictionary<boolean> = {};
		for (let actorId in this.items) {
			if (this.items.hasOwnProperty(actorId)) {
				result[actorId] = this.items[actorId]();
			}
		}
		return result;
	}

	setAll(values: AmeDictionary<boolean>) {
		for (let actorId in values) {
			if (values.hasOwnProperty(actorId)) {
				this.set(actorId, values[actorId]);
			}
		}
	}
}