"use strict";
class AmeActorAccessDictionary {
    constructor(initialData) {
        this.items = {};
        this.numberOfObservables = ko.observable(0);
        if (initialData) {
            this.setAll(initialData);
        }
    }
    get(actor, defaultValue = null) {
        if (this.items.hasOwnProperty(actor)) {
            return this.items[actor]();
        }
        this.numberOfObservables(); //Establish a dependency.
        return defaultValue;
    }
    set(actor, value) {
        if (!this.items.hasOwnProperty(actor)) {
            this.items[actor] = ko.observable(value);
            this.numberOfObservables(this.numberOfObservables() + 1);
        }
        else {
            this.items[actor](value);
        }
    }
    getAll() {
        let result = {};
        for (let actorId in this.items) {
            if (this.items.hasOwnProperty(actorId)) {
                result[actorId] = this.items[actorId]();
            }
        }
        return result;
    }
    setAll(values) {
        for (let actorId in values) {
            if (values.hasOwnProperty(actorId)) {
                this.set(actorId, values[actorId]);
            }
        }
    }
}
//# sourceMappingURL=pro-common-lib.js.map